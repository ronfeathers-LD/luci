// SentimentAnalyzer Component
const { useState, useCallback, useEffect, useRef, useMemo } = React;

// Analytics helper (structure for future integration)
const analytics = {
  track: (event, data) => {
    if (window.isProduction) {
      // In production, send to analytics service
    }
    // Dev logging removed for cleaner console
  },
  pageView: (page) => {
    analytics.track('page_view', { page });
  }
};

// Helper Functions
// Fetch Avoma transcription data (with caching)
const fetchAvomaData = async (customerIdentifier, salesforceAccountId = null) => {
      try {
        const response = await (window.deduplicatedFetch || fetch)('/api/avoma-transcription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerIdentifier: customerIdentifier,
            salesforceAccountId: salesforceAccountId,
          }),
        });
        const responseClone = response.clone();

        if (!response.ok) {
          // Only throw error for actual API errors, not missing transcriptions
          const errorData = await responseClone.json();
          throw new Error(errorData.error || 'Failed to fetch transcription');
        }

        const data = await responseClone.json();
        // Return transcription, meeting counts, and any warning
        return {
          transcription: data.transcription || '',
          meetingCounts: data.meetingCounts || null,
          warning: data.warning || null,
        };
      } catch (error) {
        window.logError('Error fetching Avoma transcription:', error);
        // Return empty data instead of throwing - allow analysis to continue
        return {
          transcription: '',
          meetingCounts: null,
          warning: 'Unable to fetch Avoma transcription. Analysis will proceed with Salesforce data only.',
        };
      }
    };

// Fetch Salesforce customer context (using real account data + cases)
// Note: This function is defined outside component but doesn't use component state
// Cases should be passed in from component state (already fetched via fetchCasesForAccount)
const fetchSalesforceData = async (customerIdentifier, accountData = null, existingCases = []) => {
      // Use account data if provided, otherwise return minimal context
      if (!accountData) {
        return {
          account_tier: "Unknown",
          contract_value: "Unknown",
          account_manager: "Unknown",
        };
      }
      
      // Use existing cases from component state instead of making redundant API call
      // Cases are already loaded via fetchCasesForAccount when account is selected
      const recentCases = existingCases || [];
      const totalCasesCount = recentCases.length;
      
      // Return real Salesforce account data with cases
      // Include more case details for sentiment analysis (description, type, reason, etc.)
      return {
        account_tier: accountData.accountTier || null,
        contract_value: accountData.contractValue || null,
        account_id: accountData.id,
        account_name: accountData.name,
        industry: accountData.industry || null,
        annual_revenue: accountData.annualRevenue || null,
        account_manager: accountData.ownerName || null,
        recent_tickets: recentCases.map(c => ({
          id: c.caseNumber || c.id,
          subject: c.subject || null,
          status: c.status || null,
          priority: c.priority || null,
          type: c.type || null,
          reason: c.reason || null,
          origin: c.origin || null,
          created_date: c.createdDate || null,
          closed_date: c.closedDate || null,
          description: c.description || null, // Include description for sentiment analysis
          contact_email: c.contactEmail || null,
          contact_id: c.contactId || null,
          contact_name: c.contactName || null,
        })),
        total_cases_count: totalCasesCount,
      };
    };

// Analyze sentiment using secure Vercel Serverless Function
const analyzeSentiment = async (transcription, salesforceContext, userId, accountId, salesforceAccountId, customerIdentifier, forceRefresh = false) => {
  const response = await (window.deduplicatedFetch || fetch)('/api/analyze-sentiment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transcription,
      salesforceContext,
      userId,
      accountId,
      salesforceAccountId,
      customerIdentifier,
      forceRefresh: forceRefresh
    })
  });
  const responseClone = response.clone();

  if (!response.ok) {
    const errorData = await responseClone.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  const result = await responseClone.json();
  
  // Validate score is within range
  if (result.score < 1 || result.score > 10) {
    throw new Error('Invalid sentiment score returned from API');
  }

  return result;
};

// Icon Components are already defined in Icons.js and exported to window

// Main SentimentAnalyzer Component
const SentimentAnalyzer = ({ user, onSignOut }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [customerIdentifier, setCustomerIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [dataSources, setDataSources] = useState(null); // Track data sources used
  const [analysisData, setAnalysisData] = useState(null); // Store actual data used for analysis
  const [showDataDetails, setShowDataDetails] = useState(false); // Toggle for showing data details
  const [cases, setCases] = useState([]); // Store cases for the selected account
  const [casesLoading, setCasesLoading] = useState(false); // Loading state for cases
  const [casesLoadingFromCache, setCasesLoadingFromCache] = useState(false); // Track if loading from cache vs Salesforce
  const [showCasesList, setShowCasesList] = useState(false); // Toggle for showing cases list
  const [contacts, setContacts] = useState([]); // Store contacts for the selected account
  const [contactsLoading, setContactsLoading] = useState(false); // Loading state for contacts
  const [contactsLoadingFromCache, setContactsLoadingFromCache] = useState(false); // Track if loading from cache vs Salesforce
  const [showContactsList, setShowContactsList] = useState(false); // Toggle for showing contacts list
  const [showHelp, setShowHelp] = useState(false); // Toggle for showing help page
  const [showResultsPage, setShowResultsPage] = useState(false); // Navigate to results page
  const [sentimentHistory, setSentimentHistory] = useState(null); // Historical sentiment data
  const [historyLoading, setHistoryLoading] = useState(false); // Loading state for history
  const [cachedSentiment, setCachedSentiment] = useState(null); // Most recent cached sentiment for selected account
  const [checkingCache, setCheckingCache] = useState(false); // Loading state for cache check
  const [avomaWarning, setAvomaWarning] = useState(null); // Warning message for missing Avoma data
  const maxRetries = 3;
  
  // HelpPage component - reusable help content (defined early for use throughout component)
  const HelpPage = ({ onClose }) => {
    return (
      <div className="bg-lean-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="typography-heading text-lean-black">How Sentiment Analysis Works</h2>
          <button
            onClick={onClose}
            className="text-lean-black-60 hover:text-lean-black"
            aria-label="Close help"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="prose max-w-none space-y-6">
          <section>
            <h3 className="typography-heading text-lean-black mb-3">Overview</h3>
            <p className="typography-body text-lean-black-80">
              L.U.C.I. uses Google Gemini AI to analyze customer sentiment by combining conversation transcripts from Avoma meetings with comprehensive Salesforce account context. The analysis provides a score from 1-10 and detailed insights about the customer relationship.
            </p>
          </section>

          <section>
            <h3 className="typography-heading text-lean-black mb-3">Data Sources Analyzed</h3>
            <div className="space-y-4">
              <div className="bg-lean-green-10 rounded-lg p-4 border-l-4 border-lean-green">
                <h4 className="font-semibold text-lean-black mb-2">1. Avoma Conversation Transcripts</h4>
                <p className="text-lean-black-80 text-sm">
                  The AI analyzes the actual conversation between your team and the customer, looking for:
                </p>
                <ul className="list-disc list-inside text-lean-black-80 text-sm mt-2 space-y-1">
                  <li>Tone and emotional indicators (frustration, satisfaction, urgency)</li>
                  <li>Language patterns and sentiment signals</li>
                  <li>Initial concerns and how they were addressed</li>
                  <li>Resolution quality and final satisfaction level</li>
                </ul>
              </div>

              <div className="bg-lean-green-10 rounded-lg p-4 border-l-4 border-lean-green">
                <h4 className="font-semibold text-lean-black mb-2">2. Salesforce Support Cases</h4>
                <p className="text-lean-black-80 text-sm">
                  Recent support cases provide critical context:
                </p>
                <ul className="list-disc list-inside text-lean-black-80 text-sm mt-2 space-y-1">
                  <li><strong>Case Count:</strong> Number of recent cases (more cases may indicate issues)</li>
                  <li><strong>Case Descriptions:</strong> Customer feedback and issue details</li>
                  <li><strong>Priority & Status:</strong> High priority or unresolved cases signal risk</li>
                  <li><strong>Case Types & Reasons:</strong> Patterns in support needs</li>
                  <li><strong>Resolution Timelines:</strong> How quickly issues are resolved</li>
                  <li><strong>⚠️ Contact Level Involvement:</strong> <strong>CRITICAL INDICATOR</strong> - C-Level or Sr. Level executives submitting support cases is a major red flag indicating serious escalation</li>
                </ul>
              </div>

              <div className="bg-lean-almost-white rounded-lg p-4 border-l-4 border-lean-black/20">
                <h4 className="font-semibold text-lean-black mb-2">3. Account Profile Context</h4>
                <p className="text-lean-black-80 text-sm">
                  Account characteristics help set appropriate expectations:
                </p>
                <ul className="list-disc list-inside text-lean-black-80 text-sm mt-2 space-y-1">
                  <li><strong>Account Tier:</strong> Higher tier accounts may have different expectations</li>
                  <li><strong>Contract Value:</strong> Expiring ARR indicates renewal risk</li>
                  <li><strong>Industry:</strong> Industry norms and standards</li>
                  <li><strong>Account Manager:</strong> Relationship context</li>
                </ul>
              </div>

              <div className="bg-lean-almost-white rounded-lg p-4 border-l-4 border-lean-green">
                <h4 className="font-semibold text-lean-black mb-2">4. Engagement Metrics</h4>
                <p className="text-lean-black-80 text-sm">
                  Meeting participation and frequency:
                </p>
                <ul className="list-disc list-inside text-lean-black-80 text-sm mt-2 space-y-1">
                  <li>Total Avoma calls/meetings with the customer</li>
                  <li>Number of meetings with ready transcripts</li>
                  <li>Engagement frequency and participation</li>
                </ul>
              </div>

              <div className="bg-lean-green-10 rounded-lg p-4 border-l-4 border-lean-green">
                <h4 className="font-semibold text-lean-black mb-2">5. Contact Intelligence & Professional Context</h4>
                <p className="text-lean-black-80 text-sm">
                  Enriched contact data from Apollo.io and LinkedIn provides deep insights:
                </p>
                <ul className="list-disc list-inside text-lean-black-80 text-sm mt-2 space-y-1">
                  <li><strong>Contact Level Breakdown:</strong> C-Level, Sr. Level, and Other contacts categorized by title</li>
                  <li><strong>Case Involvement by Level:</strong> Which contact levels are submitting support cases (C-Level involvement = major concern)</li>
                  <li><strong>Job Change Signals:</strong> Recent job changes or high job change likelihood indicate account risk</li>
                  <li><strong>Stale Relationships:</strong> Contacts with no activity in 90+ days may indicate disengagement</li>
                  <li><strong>Engagement Signals:</strong> Social media interactions with company content</li>
                  <li><strong>Professional Context:</strong> Department, reporting structure, company size, industry, and technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-lean-black mb-3">Sentiment Score Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                <div className="text-2xl font-bold text-red-600 mb-2">1-4</div>
                <p className="text-sm font-semibold text-lean-black mb-1">At Risk</p>
                <p className="text-xs text-lean-black-80">Very negative sentiment. Customer may be at risk of churn. Immediate attention required.</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600 mb-2">5-7</div>
                <p className="text-sm font-semibold text-lean-black mb-1">Neutral/Mixed</p>
                <p className="text-xs text-lean-black-80">Mixed or neutral sentiment. Relationship is stable but needs attention to improve.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <div className="text-2xl font-bold text-lean-green mb-2">8-10</div>
                <p className="text-sm font-semibold text-lean-black mb-1">Positive</p>
                <p className="text-xs text-lean-black-80">Strong positive sentiment. Customer is satisfied and may be a strong advocate.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-lean-black mb-3">What the Analysis Includes</h3>
            <p className="text-lean-black-80 leading-relaxed mb-3">
              Each sentiment analysis provides two levels of detail:
            </p>
            <div className="space-y-3 mb-3">
              <div className="bg-lean-almost-white rounded-lg p-3">
                <p className="font-semibold text-lean-black mb-1">Executive Summary (150 words)</p>
                <p className="text-sm text-lean-black-80">
                  A concise, high-level overview for C-level executives focusing on overall sentiment, top critical factors, immediate actions, and relationship health status.
                </p>
              </div>
              <div className="bg-lean-almost-white rounded-lg p-3">
                <p className="font-semibold text-lean-black mb-1">Comprehensive Analysis (500-800 words)</p>
                <p className="text-sm text-lean-black-80">
                  A detailed, in-depth analysis for CSMs and Account Managers including detailed factor breakdown, specific concerns/positive signals with examples, relationship trajectory with evidence, contact level involvement analysis, support case patterns, engagement metrics, risk factors, opportunities, and detailed recommendations.
                </p>
              </div>
            </div>
            <p className="text-lean-black-80 leading-relaxed mb-2">
              Both analyses include:
            </p>
            <ul className="list-disc list-inside text-lean-black-80 space-y-2">
              <li><strong>Key Factors:</strong> What most influenced the sentiment score</li>
              <li><strong>Specific Concerns or Signals:</strong> Identified issues or positive indicators</li>
              <li><strong>Relationship Trajectory:</strong> Whether sentiment is improving, declining, or stable</li>
              <li><strong>Contact Level Analysis:</strong> Critical assessment of which contact levels are involved in support cases</li>
              <li><strong>Actionable Insights:</strong> Detailed recommendations for account management</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-lean-black mb-3">Best Practices</h3>
            <div className="bg-lean-almost-white rounded-lg p-4 space-y-2">
              <p className="text-sm text-lean-black-80">
                <strong>✓ Regular Monitoring:</strong> Check sentiment after important meetings or when support cases are resolved
              </p>
              <p className="text-sm text-lean-black-80">
                <strong>✓ Context Matters:</strong> Review the detailed data sources to understand what influenced the score
              </p>
              <p className="text-sm text-lean-black-80">
                <strong>✓ Action on Low Scores:</strong> Scores of 4 or below indicate immediate attention is needed
              </p>
              <p className="text-sm text-lean-black-80">
                <strong>✓ Track Trends:</strong> Monitor sentiment over time to identify improving or declining relationships
              </p>
            </div>
          </section>

          <section className="pt-4 border-t border-lean-black/20">
            <p className="text-sm text-lean-black-60">
              <strong>AI Model:</strong> Google Gemini (auto-discovered best available model)<br />
              <strong>Analysis Framework:</strong> 6-dimensional analysis (Conversation, Support Context, Account Profile, Engagement, Contact Intelligence, Overall Assessment)
            </p>
          </section>
        </div>
      </div>
    );
  };
  
  // Fetch cases for an account (can be called independently)
  const fetchCasesForAccount = useCallback(async (accountData) => {
    if (!accountData) {
      setCases([]);
      setCasesLoading(false);
      setCasesLoadingFromCache(false);
      return;
    }

    // Use salesforceId if available, otherwise check if id is a Salesforce ID (no dashes, 15 or 18 chars)
    // UUIDs have dashes, Salesforce IDs don't
    const salesforceAccountId = accountData.salesforceId || 
                               (accountData.id && !accountData.id.includes('-') && 
                                (accountData.id.length === 15 || accountData.id.length === 18) 
                                ? accountData.id : null);
    
    if (!salesforceAccountId) {
      if (!window.isProduction) {
        console.warn('Cannot fetch cases: No valid Salesforce Account ID found', { 
          accountData,
          hasSalesforceId: !!accountData.salesforceId,
          id: accountData.id 
        });
      }
      setCases([]);
      setCasesLoading(false);
      setCasesLoadingFromCache(false);
      return;
    }

    setCasesLoading(true);
    // Optimistically assume cache first (will be updated if Salesforce is queried)
    setCasesLoadingFromCache(true);
    try {
      const params = new URLSearchParams({
        salesforceAccountId: salesforceAccountId,
        accountId: accountData.id, // This might be a UUID, which is fine for the lookup
      });
      
      const casesResponse = await (window.deduplicatedFetch || fetch)(`/api/salesforce-cases?${params}`);
      const casesResponseClone = casesResponse.clone();
      
      if (casesResponse.ok) {
        const casesData = await casesResponseClone.json();
        const fetchedCases = casesData.cases || [];
        
        // Update loading source based on response
        setCasesLoadingFromCache(casesData.cached === true);
        setCases(fetchedCases);
      } else {
        const errorData = await casesResponseClone.json().catch(() => ({}));
        window.logError('Error fetching cases:', new Error(errorData.message || errorData.error || `HTTP ${casesResponse.status}`));
        setCases([]);
      }
    } catch (err) {
      window.logError('Error fetching cases:', err);
      setCases([]);
    } finally {
      setCasesLoading(false);
    }
  }, []);

  // Fetch contacts for an account (can be called independently)
  const fetchContactsForAccount = useCallback(async (accountData) => {
    if (!accountData) {
      setContacts([]);
      setContactsLoading(false);
      setContactsLoadingFromCache(false);
      return;
    }

    // Use salesforceId if available, otherwise check if id is a Salesforce ID (no dashes, 15 or 18 chars)
    // UUIDs have dashes, Salesforce IDs don't
    const salesforceAccountId = accountData.salesforceId || 
                               (accountData.id && !accountData.id.includes('-') && 
                                (accountData.id.length === 15 || accountData.id.length === 18) 
                                ? accountData.id : null);
    
    if (!salesforceAccountId) {
      if (!window.isProduction) {
        console.warn('Cannot fetch contacts: No valid Salesforce Account ID found', { 
          accountData,
          hasSalesforceId: !!accountData.salesforceId,
          id: accountData.id 
        });
      }
      setContacts([]);
      setContactsLoading(false);
      setContactsLoadingFromCache(false);
      return;
    }

    setContactsLoading(true);
    // Optimistically assume cache first (will be updated if Salesforce is queried)
    setContactsLoadingFromCache(true);
    try {
      const params = new URLSearchParams({
        salesforceAccountId: salesforceAccountId,
        accountId: accountData.id, // This might be a UUID, which is fine for the lookup
      });
      
      const contactsResponse = await (window.deduplicatedFetch || fetch)(`/api/salesforce-contacts?${params}`);
      const contactsResponseClone = contactsResponse.clone();
      if (contactsResponse.ok) {
        const contactsData = await contactsResponseClone.json();
        const fetchedContacts = contactsData.contacts || [];
        
        // Update loading source based on response
        setContactsLoadingFromCache(contactsData.cached === true);
        
        // Log whether we got cached or fresh data
        if (contactsData.cached) {
          // Contacts loaded from cache
        }
        
        // Enrich contacts with Apollo.io data using bulk endpoint
        // Apollo.io provides LinkedIn profile data, so we don't need LinkedIn enrichment
        // Use bulk endpoint to stay within rate limits (50 calls/minute)
        let enrichedContacts = [...fetchedContacts];
        
        // Only attempt enrichment if we have contacts
        if (fetchedContacts.length > 0) {
          try {
            // Prepare contacts for bulk enrichment
            const contactsForEnrichment = fetchedContacts.map(contact => ({
              contactId: contact.id,
              salesforceContactId: contact.salesforce_id,
              email: contact.email,
              firstName: contact.firstName || contact.first_name,
              lastName: contact.lastName || contact.last_name,
              linkedinURL: contact.linkedinURL || contact.linkedin_url,
              company: contact.accountName || contact.account_name,
              account_name: contact.accountName || contact.account_name,
            }));

            // Use bulk enrichment endpoint to batch API calls
            const bulkEnrichResponse = await (window.deduplicatedFetch || fetch)('/api/apollo-enrich', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contacts: contactsForEnrichment,
              }),
            });
          
          if (bulkEnrichResponse.ok) {
            try {
              const bulkData = await bulkEnrichResponse.json();
              if (bulkData.success && bulkData.results) {
                // Create a map of contact IDs to enrichment results
                const enrichmentMap = new Map();
                bulkData.results.forEach(result => {
                  const contactId = result.contact?.contactId || result.contact?.id;
                  if (contactId) {
                    enrichmentMap.set(contactId, result);
                  }
                });

                // Merge enrichment data back into contacts
                enrichedContacts = fetchedContacts.map(contact => {
                  const enrichment = enrichmentMap.get(contact.id);
                  if (enrichment && enrichment.success && enrichment.profile) {
                    return {
                      ...contact,
                      linkedinProfile: enrichment.profile,
                      enrichmentSource: 'apollo',
                    };
                  }
                  return contact;
                });

                // Show user-friendly message if credits exhausted
                if (bulkData.creditsExhausted && bulkData.message) {
                  setError(`Note: ${bulkData.message}`);
                }

                if (!window.isProduction) {
                }
              }
            } catch (parseErr) {
              // Silently fail - enrichment is optional
              if (!window.isProduction) {
                console.warn('Apollo bulk enrichment response parse error:', parseErr);
              }
            }
          } else if (bulkEnrichResponse.status === 400) {
            // Bad request (e.g., empty contacts array) - silently skip enrichment
            if (!window.isProduction) {
              console.warn('Apollo bulk enrichment request invalid (400). Skipping enrichment.');
            }
          } else if (bulkEnrichResponse.status === 404) {
            // Endpoint not found - fall back to individual calls (but with rate limiting)
            // Fallback: Use individual calls but with rate limiting (max 50 per minute)
            // Process in batches of 10 with delays
            const BATCH_SIZE = 10;
            const DELAY_MS = 15000; // 15 seconds between batches (allows ~40 calls/minute)
            
            for (let i = 0; i < fetchedContacts.length; i += BATCH_SIZE) {
              const batch = fetchedContacts.slice(i, i + BATCH_SIZE);
              
              await Promise.all(
                batch.map(async (contact) => {
                  try {
                    const apolloEnrichResponse = await (window.deduplicatedFetch || fetch)('/api/apollo-enrich', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        contactId: contact.id,
                        email: contact.email,
                        firstName: contact.firstName || contact.first_name,
                        lastName: contact.lastName || contact.last_name,
                        linkedinURL: contact.linkedinURL || contact.linkedin_url,
                        company: contact.accountName || contact.account_name,
                      }),
                    });
                    
                    if (apolloEnrichResponse.ok) {
                      const apolloData = await apolloEnrichResponse.json();
                      if (apolloData.success && apolloData.profile) {
                        const contactIndex = enrichedContacts.findIndex(c => c.id === contact.id);
                        if (contactIndex >= 0) {
                          enrichedContacts[contactIndex] = {
                            ...enrichedContacts[contactIndex],
                            linkedinProfile: apolloData.profile,
                            enrichmentSource: 'apollo',
                          };
                        }
                      }
                    }
                  } catch (apolloErr) {
                    // Silently fail - enrichment is optional
                    if (!window.isProduction) {
                      console.warn('Apollo enrichment error for contact:', contact.id, apolloErr);
                    }
                  }
                })
              );
              
              // Wait between batches to respect rate limits
              if (i + BATCH_SIZE < fetchedContacts.length) {
                await new Promise(resolve => setTimeout(resolve, DELAY_MS));
              }
            }
          }
          } catch (bulkErr) {
            // Network error or other issue - silently fail - enrichment is optional
            if (!window.isProduction) {
              console.warn('Apollo bulk enrichment error:', bulkErr);
            }
          }
        }
        
        setContacts(enrichedContacts);
        if (!window.isProduction) {
        }
      } else {
        const errorData = await contactsResponse.json().catch(() => ({}));
        window.logError('Error fetching contacts:', new Error(errorData.message || errorData.error || `HTTP ${contactsResponse.status}`));
        setContacts([]);
      }
    } catch (err) {
      window.logError('Error fetching contacts:', err);
      setContacts([]);
    } finally {
      setContactsLoading(false);
    }
  }, []);
  
  // Fetch cached accounts from user_accounts (no Salesforce query, just cached data)
  useEffect(() => {
    const fetchCachedAccounts = async () => {
      if (!user?.id && !user?.email) {
        setLoadingAccounts(false);
        return;
      }

      try {
        setLoadingAccounts(true);
        setError(null);
        
        // Fetch cached accounts only - don't query Salesforce, just return what's in user_accounts
        const params = new URLSearchParams({
          userId: user.id || '',
          email: user.email || '',
          role: user.role || '',
          cacheOnly: 'true', // Only return cached accounts, never query Salesforce
        });

        const response = await (window.deduplicatedFetch || fetch)(`/api/salesforce-accounts?${params}`);
        const responseClone = response.clone();
        
        if (!response.ok) {
          const errorData = await responseClone.json().catch(() => ({}));
          // Don't throw error for empty accounts - that's expected if user hasn't added any yet
          if (errorData.error && !errorData.error.includes('not found')) {
            throw new Error(errorData.message || errorData.error || 'Failed to fetch accounts');
          }
          setAccounts([]);
          setLoadingAccounts(false);
          return;
        }

        const data = await responseClone.json();
        const cachedAccounts = data.accounts || [];
        setAccounts(cachedAccounts);
        
        // Auto-select first account if available
        if (cachedAccounts.length > 0) {
          setSelectedAccount(cachedAccounts[0]);
          setCustomerIdentifier(cachedAccounts[0].name);
        }
        
        analytics.track('cached_accounts_loaded', { 
          count: cachedAccounts.length,
          userId: user.id 
        });
      } catch (err) {
        window.logError('Error fetching cached accounts:', err);
        // Don't show error for missing accounts - just set empty array
        setAccounts([]);
      } finally {
        setLoadingAccounts(false);
      }
    };

    // Only fetch if not in search mode
    if (!isSearchMode) {
      fetchCachedAccounts();
    }
  }, [user, isSearchMode]);

  // Fetch cases and contacts when selected account changes
  useEffect(() => {
    if (selectedAccount) {
      // Use the memoized functions to fetch data
      fetchCasesForAccount(selectedAccount);
      fetchContactsForAccount(selectedAccount);
    } else {
      setCases([]);
      setShowCasesList(false);
      setContacts([]);
      setShowContactsList(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount]); // Functions are stable (useCallback with empty deps), so we can omit them

  // Fetch historical sentiment when results page is shown
  const fetchSentimentHistory = useCallback(async (accountData) => {
    if (!accountData) {
      setSentimentHistory(null);
      return;
    }

    const salesforceAccountId = accountData.salesforceId || 
                               (accountData.id && !accountData.id.includes('-') && 
                                (accountData.id.length === 15 || accountData.id.length === 18) 
                                ? accountData.id : null);
    
    if (!salesforceAccountId && !accountData.id) {
      return;
    }

    setHistoryLoading(true);
    try {
      const params = new URLSearchParams({
        accountId: accountData.id || '',
        salesforceAccountId: salesforceAccountId || '',
        limit: '50',
        days: '365',
      });
      
      const response = await (window.deduplicatedFetch || fetch)(`/api/sentiment-analysis?${params}`);
      const responseClone = response.clone();
      if (response.ok) {
        const data = await responseClone.json();
        setSentimentHistory(data);
      } else {
        const errorData = await responseClone.json().catch(() => ({}));
        window.logError('Failed to fetch sentiment history:', { 
          status: response.status, 
          error: errorData 
        });
        // Don't show error to user - historical data is optional
        setSentimentHistory(null);
      }
    } catch (err) {
      window.logError('Error fetching sentiment history:', err);
      // Don't show error to user - historical data is optional
      setSentimentHistory(null);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Check for most recent cached sentiment when account is selected
  const checkCachedSentiment = useCallback(async (accountData) => {
    if (!accountData) {
      setCachedSentiment(null);
      return;
    }

    const salesforceAccountId = accountData.salesforceId || 
                               (accountData.id && !accountData.id.includes('-') && 
                                (accountData.id.length === 15 || accountData.id.length === 18) 
                                ? accountData.id : null);
    
    if (!salesforceAccountId && !accountData.id) {
      setCachedSentiment(null);
      return;
    }

    setCheckingCache(true);
    try {
      const params = new URLSearchParams({
        accountId: accountData.id || '',
        salesforceAccountId: salesforceAccountId || '',
        limit: '1', // Just get the most recent one
        days: '365',
      });
      
      const response = await (window.deduplicatedFetch || fetch)(`/api/sentiment-analysis?${params}`);
      const responseClone = response.clone();
      if (response.ok) {
        const data = await responseClone.json();
        if (data.history && data.history.length > 0) {
          setCachedSentiment(data.history[0]); // Most recent sentiment
        } else {
          setCachedSentiment(null);
        }
      } else {
        setCachedSentiment(null);
      }
    } catch (err) {
      window.logError('Error checking cached sentiment:', err);
      setCachedSentiment(null);
    } finally {
      setCheckingCache(false);
    }
  }, []);

  // Check for cached sentiment when account is selected
  useEffect(() => {
    if (selectedAccount && !showResultsPage) {
      checkCachedSentiment(selectedAccount);
    } else {
      setCachedSentiment(null);
    }
  }, [selectedAccount, showResultsPage, checkCachedSentiment]);

  // Fetch history when results page is shown
  useEffect(() => {
    if (showResultsPage && selectedAccount) {
      fetchSentimentHistory(selectedAccount);
    }
  }, [showResultsPage, selectedAccount, fetchSentimentHistory]);

  // Search for accounts
  const handleSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setError('Please enter at least 2 characters to search');
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      
      const params = new URLSearchParams({
        search: searchQuery.trim(),
        userId: user?.id || '',
      });

      const response = await (window.deduplicatedFetch || fetch)(`/api/salesforce-accounts?${params}`);
      const responseClone = response.clone();
      
      if (!response.ok) {
        const errorData = await responseClone.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to search accounts');
      }

      const data = await responseClone.json();
      setAccounts(data.accounts || []);
      setIsSearchMode(true);
      
      // Auto-select first result if available
      if (data.accounts && data.accounts.length > 0) {
        setSelectedAccount(data.accounts[0]);
        setCustomerIdentifier(data.accounts[0].name);
      } else {
        setSelectedAccount(null);
        setCustomerIdentifier('');
      }
      
      analytics.track('accounts_searched', { 
        searchTerm: searchQuery,
        count: data.accounts?.length || 0,
        userId: user?.id 
      });
    } catch (err) {
      window.logError('Error searching accounts:', err);
      setError(err.message || 'Failed to search accounts. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search and return to assigned accounts
  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearchMode(false);
    setSelectedAccount(null);
    setCustomerIdentifier('');
    setError(null);
    // Trigger useEffect to reload assigned accounts
    window.location.reload();
  };

  const handleAnalyze = useCallback(async (attempt = 0, forceRefresh = false) => {
    setLoading(true);
    setError(null);
    // Don't set casesLoading - cases/contacts are already loaded from useEffect
    // This prevents unnecessary reloading indicators
    if (attempt === 0) {
      setSentiment(null);
    }

    try {
      // Fetch data from both sources in parallel
      // Pass existing cases to avoid redundant API call
      const [avomaData, salesforceContext] = await Promise.all([
        fetchAvomaData(customerIdentifier, selectedAccount?.salesforceId || selectedAccount?.id),
        fetchSalesforceData(customerIdentifier, selectedAccount, cases)
      ]);

      // Extract transcription and meeting counts
      const transcription = avomaData.transcription || '';
      const meetingCounts = avomaData.meetingCounts || null;
      
      // Show warning if no transcription available (but don't error out)
      if (avomaData.warning || !transcription) {
        const warningMessage = avomaData.warning || 'No Avoma transcription available. Analysis will proceed with Salesforce account data only.';
        setAvomaWarning(warningMessage);
        if (!window.isProduction) {
          console.warn('Avoma transcription warning:', warningMessage);
        }
      } else {
        setAvomaWarning(null);
      }

      // Categorize contacts by level and track case involvement
      const contactTitle = (c) => c.title || c.linkedinProfile?.current_title || '';
      const categorizedContacts = contacts.map(c => {
        const title = contactTitle(c);
        const level = window.categorizeContactLevel(title);
        return {
          ...c,
          contactLevel: level,
          title: title,
        };
      });

      // Track which contacts are involved in cases (by email or ID)
      const caseContactEmails = new Set();
      const caseContactIds = new Set();
      (salesforceContext.recent_tickets || []).forEach(ticket => {
        if (ticket.contact_email) caseContactEmails.add(ticket.contact_email.toLowerCase());
        if (ticket.contact_id) caseContactIds.add(ticket.contact_id);
      });

      // Mark contacts involved in cases
      const contactsWithCaseInvolvement = categorizedContacts.map(c => {
        const emailMatch = c.email && caseContactEmails.has(c.email.toLowerCase());
        const idMatch = c.id && caseContactIds.has(c.id);
        const involvedInCases = emailMatch || idMatch;
        return {
          ...c,
          involvedInCases: involvedInCases,
        };
      });

      // Count contacts by level - optimized single pass instead of multiple filters
      const contactLevelCounts = { 'C-Level': 0, 'Sr. Level': 0, 'Other': 0 };
      const caseInvolvedByLevel = { 'C-Level': 0, 'Sr. Level': 0, 'Other': 0 };
      
      contactsWithCaseInvolvement.forEach(c => {
        contactLevelCounts[c.contactLevel] = (contactLevelCounts[c.contactLevel] || 0) + 1;
        if (c.involvedInCases) {
          caseInvolvedByLevel[c.contactLevel] = (caseInvolvedByLevel[c.contactLevel] || 0) + 1;
        }
      });

      // Enrich with comprehensive contact data from Salesforce and Apollo.io
      const linkedinData = {
        contacts: contactsWithCaseInvolvement
          .filter(c => c.linkedinURL || c.linkedinProfile || c.email || c.name)
          .map(c => ({
            // Basic Info
            name: c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim(),
            email: c.email,
            linkedin_url: c.linkedinURL || c.linkedin_url,
            // Contact Level
            contact_level: c.contactLevel,
            involved_in_cases: c.involvedInCases,
            // Salesforce Contact Data
            department: c.department,
            reports_to_name: c.reports_to_name,
            owner_name: c.owner_name,
            last_activity_date: c.last_activity_date,
            created_date: c.created_date,
            lead_source: c.lead_source,
            mailing_city: c.mailing_city,
            mailing_state: c.mailing_state,
            mailing_country: c.mailing_country,
            // Apollo.io Enrichment Data
            current_title: c.title || c.linkedinProfile?.current_title,
            current_company: c.linkedinProfile?.current_company || c.account_name,
            job_changed_recently: c.linkedinProfile?.job_changed_recently || false,
            days_in_current_role: c.linkedinProfile?.days_in_current_role,
            job_change_likelihood: c.linkedinProfile?.job_change_likelihood,
            profile_updated_recently: c.linkedinProfile?.profile_updated_at ? 
              (new Date() - new Date(c.linkedinProfile.profile_updated_at)) < (30 * 24 * 60 * 60 * 1000) : false,
            // Company Intelligence (Apollo)
            company_industry: c.linkedinProfile?.company_industry,
            company_size: c.linkedinProfile?.company_size,
            company_revenue: c.linkedinProfile?.company_revenue,
            company_technologies: c.linkedinProfile?.company_technologies || [],
            // Employment History (Apollo)
            previous_companies: c.linkedinProfile?.previous_companies || [],
            previous_titles: c.linkedinProfile?.previous_titles || [],
            // Contact Verification (Apollo)
            email_status: c.linkedinProfile?.email_status,
            phone_status: c.linkedinProfile?.phone_status,
            email_verified: c.linkedinProfile?.email_verified,
            phone_verified: c.linkedinProfile?.phone_verified,
            // Engagement Metrics
            engagement_with_company: {
              posts_about_company: c.linkedinProfile?.posts_about_company || 0,
              comments_on_company_posts: c.linkedinProfile?.comments_on_company_posts || 0,
              shares_of_company_content: c.linkedinProfile?.shares_of_company_content || 0,
              reactions_to_company_posts: c.linkedinProfile?.reactions_to_company_posts || 0,
            },
            // Engagement Rates (Apollo)
            email_open_rate: c.linkedinProfile?.email_open_rate,
            email_click_rate: c.linkedinProfile?.email_click_rate,
            response_rate: c.linkedinProfile?.response_rate,
            last_contacted: c.linkedinProfile?.last_contacted,
            last_engaged: c.linkedinProfile?.last_engaged,
          })),
        total_contacts_with_linkedin: contacts.filter(c => c.linkedinURL || c.linkedin_url).length,
        contacts_with_enriched_data: contacts.filter(c => c.linkedinProfile).length,
        contact_level_counts: contactLevelCounts,
        case_involved_by_level: caseInvolvedByLevel,
        total_contacts: contacts.length,
      };

      // Add counts to salesforce context for sentiment analysis
      const enrichedContext = {
        ...salesforceContext,
        total_cases_count: salesforceContext.total_cases_count || 0,
        total_avoma_calls: meetingCounts?.total || 0,
        ready_avoma_calls: meetingCounts?.ready || 0,
        linkedin_data: linkedinData.contacts.length > 0 ? linkedinData : null,
        contact_levels: {
          c_level_count: contactLevelCounts['C-Level'],
          sr_level_count: contactLevelCounts['Sr. Level'],
          other_count: contactLevelCounts['Other'],
          c_level_in_cases: caseInvolvedByLevel['C-Level'],
          sr_level_in_cases: caseInvolvedByLevel['Sr. Level'],
          other_in_cases: caseInvolvedByLevel['Other'],
        },
      };

      // Store the actual data used for analysis (for transparency)
      setAnalysisData({
        transcription: transcription,
        salesforceContext: enrichedContext,
        transcriptionPreview: transcription.length > 500 
          ? transcription.substring(0, 500) + '...' 
          : transcription,
      });
      
      // Analyze sentiment (pass account/user info for historical tracking)
      // Determine account IDs - selectedAccount.id should be UUID, selectedAccount.salesforceId should be Salesforce ID
      const accountId = selectedAccount?.id; // This should be a UUID from Supabase
      const salesforceAccountId = selectedAccount?.salesforceId || 
                                 (selectedAccount?.id && !selectedAccount.id.includes('-') && 
                                  (selectedAccount.id.length === 15 || selectedAccount.id.length === 18) 
                                  ? selectedAccount.id : null);
      
      const result = await analyzeSentiment(
        transcription, 
        enrichedContext,
        user?.id,
        accountId, // Pass the UUID if available
        salesforceAccountId,
        customerIdentifier,
        forceRefresh // Pass forceRefresh flag to bypass cache
      );
      setSentiment(result);
      setRetryCount(0);
      
      // Track data sources used for this analysis
      setDataSources({
        hasTranscription: !!transcription && transcription.length > 0,
        transcriptionLength: transcription.length,
        hasAccountData: !!selectedAccount,
        accountName: selectedAccount?.name || customerIdentifier,
        casesCount: enrichedContext.total_cases_count || 0,
        avomaCallsTotal: enrichedContext.total_avoma_calls || 0,
        avomaCallsReady: enrichedContext.ready_avoma_calls || 0,
        hasCases: (enrichedContext.recent_tickets || []).length > 0,
        hasLinkedIn: !!enrichedContext.linkedin_data && enrichedContext.linkedin_data.contacts.length > 0,
        linkedinContactsCount: enrichedContext.linkedin_data?.contacts.length || 0,
        linkedinEnrichedCount: enrichedContext.linkedin_data?.contacts_with_enriched_data || 0,
      });
      
      // Navigate to results page
      setShowResultsPage(true);
      
      // Refetch sentiment history and cached sentiment after a brief delay to ensure the new result is saved
      // The useEffect will also fetch, but this ensures we get the latest data after save completes
      setTimeout(() => {
        if (selectedAccount) {
          fetchSentimentHistory(selectedAccount);
          checkCachedSentiment(selectedAccount); // Refresh cached sentiment indicator
        }
      }, 1000); // Small delay to allow database save to complete
      
      analytics.track('sentiment_analyzed', { 
        customerIdentifier,
        score: result.score,
        hasTranscription: !!transcription,
        casesCount: enrichedContext.total_cases_count || 0,
        avomaCallsCount: enrichedContext.total_avoma_calls || 0,
      });
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while analyzing sentiment';
      setError(errorMessage);
      window.logError('Sentiment analysis error:', err);
      
      if (attempt < maxRetries && (err.message?.includes('timeout') || err.message?.includes('network'))) {
        setRetryCount(attempt + 1);
        analytics.track('sentiment_analysis_retry', { attempt: attempt + 1 });
      } else {
        setRetryCount(0);
        analytics.track('sentiment_analysis_failed', { error: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  }, [customerIdentifier, selectedAccount, contacts, cases, fetchSentimentHistory]);

  const getScoreColor = (score) => {
    if (score <= 4) return 'text-red-600 bg-red-50 border-red-200';
    if (score <= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-lean-green bg-lean-green-10 border-lean-green/20';
  };

  const getScoreBgColor = (score) => {
    if (score <= 4) return 'bg-red-100';
    if (score <= 7) return 'bg-yellow-100';
    return 'bg-lean-green-10';
  };

  // Results Page Component
  const ResultsPage = ({ sentiment, dataSources, analysisData, selectedAccount, cases, contacts, sentimentHistory, historyLoading, avomaWarning, onBack, onShowHelp, onCloseHelp, showHelp }) => {
    const [showDataDetails, setShowDataDetails] = useState(false);
    
    // Scroll to help section when it opens
    useEffect(() => {
      if (showHelp) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
          const helpSection = document.getElementById('help-section');
          if (helpSection) {
            helpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }, [showHelp]);
    
    // Categorize contacts for display
    const categorizedContacts = contacts.map(c => {
      const title = c.title || c.linkedinProfile?.current_title || '';
      return {
        ...c,
        contactLevel: window.categorizeContactLevel(title),
        title: title,
      };
    });
    
    // Track case involvement
    const caseContactEmails = new Set();
    const caseContactIds = new Set();
    (cases || []).forEach(caseItem => {
      if (caseItem.contactEmail) caseContactEmails.add(caseItem.contactEmail.toLowerCase());
      if (caseItem.contactId) caseContactIds.add(caseItem.contactId);
    });
    
    const contactsWithCaseInvolvement = categorizedContacts.map(c => {
      const emailMatch = c.email && caseContactEmails.has(c.email.toLowerCase());
      const idMatch = c.id && caseContactIds.has(c.id);
      return {
        ...c,
        involvedInCases: emailMatch || idMatch,
      };
    });
    
    // Group contacts by level
    const contactsByLevel = {
      'C-Level': contactsWithCaseInvolvement.filter(c => c.contactLevel === 'C-Level'),
      'Sr. Level': contactsWithCaseInvolvement.filter(c => c.contactLevel === 'Sr. Level'),
      'Other': contactsWithCaseInvolvement.filter(c => c.contactLevel === 'Other'),
    };
    
    const contactLevelCounts = {
      'C-Level': contactsByLevel['C-Level'].length,
      'Sr. Level': contactsByLevel['Sr. Level'].length,
      'Other': contactsByLevel['Other'].length,
    };
    
    const caseInvolvedByLevel = {
      'C-Level': contactsByLevel['C-Level'].filter(c => c.involvedInCases).length,
      'Sr. Level': contactsByLevel['Sr. Level'].filter(c => c.involvedInCases).length,
      'Other': contactsByLevel['Other'].filter(c => c.involvedInCases).length,
    };

    return (
      <div className="min-h-screen bg-lean-almost-white flex flex-col">
        {/* Header with Logo */}
        <header className="bg-lean-black px-4 sm:px-6 lg:px-8 py-4 flex-shrink-0">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* LD Logo */}
              <img 
                src={`/ld-logo-abbr-green.png?v=${window.getBuildVersion()}`}
                alt="LeanData Logo" 
                className="h-12 w-auto flex-shrink-0"
                key={`logo-${window.getBuildVersion()}`}
              />
              <div className="text-left">
                <h1 className="typography-heading text-[#f7f7f7] mb-1">
                  L.U.C.I.
                </h1>
                <p className="text-sm text-[#f7f7f7]">
                  LeanData Unified Customer Intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (window.navigate) {
                    window.navigate('/user');
                  } else {
                    window.location.href = '/user';
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-[#f7f7f7] bg-lean-green rounded-lg hover:bg-lean-green/90 focus:outline-none focus:ring-2 focus:ring-lean-green transition-all"
                aria-label="Manage my accounts"
              >
                My Accounts
              </button>
              <button
                onClick={() => {
                  if (window.navigate) {
                    window.navigate('/admin');
                  } else {
                    window.location.href = '/admin';
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-[#f7f7f7] bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                aria-label="Go to admin panel"
              >
                Admin
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (onShowHelp && typeof onShowHelp === 'function') {
                    onShowHelp();
                  } else if (!window.isProduction) {
                    console.warn('onShowHelp is not a function:', onShowHelp);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-[#f7f7f7] bg-lean-green rounded-lg hover:bg-lean-green/90 focus:outline-none focus:ring-2 focus:ring-lean-green transition-all"
                aria-label="Show help and explanation"
                type="button"
              >
                Help
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Help Page */}
            {showHelp && (
              <div id="help-section">
                <HelpPage onClose={() => onCloseHelp && onCloseHelp()} />
              </div>
            )}
            
            {/* Back Button */}
            <div className="mb-8">
              <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-lean-black-70 hover:text-lean-black transition-colors"
                aria-label="Back to account selection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Account Selection</span>
              </button>
              <div>
                <h1 className="typography-heading text-lean-black mb-2">
                  Sentiment Analysis Results
                </h1>
                {selectedAccount ? (
                  <button
                    onClick={() => {
                      const accountId = selectedAccount.salesforceId || selectedAccount.id;
                      if (window.navigate) {
                        window.navigate(`/account/${accountId}/data`);
                      } else {
                        window.location.href = `/account/${accountId}/data`;
                      }
                    }}
                    className="typography-body text-lean-black-70 hover:text-lean-green hover:underline transition-colors text-left"
                  >
                    {selectedAccount.name || 'Account Analysis'}
                  </button>
                ) : (
                  <p className="typography-body text-lean-black-70">
                    Account Analysis
                  </p>
                )}
              </div>
            </div>

          {/* Avoma Warning Banner */}
          {avomaWarning && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> {avomaWarning}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sentiment Score Display */}
          <div className="bg-lean-white rounded-lg shadow-lg p-8 mb-6" role="region" aria-live="polite" aria-label="Sentiment analysis results">
            {/* Score Display */}
            <div className={`text-center mb-6 p-8 rounded-xl border-2 ${getScoreColor(sentiment.score)}`} role="status">
              <div className="text-6xl font-bold mb-2" aria-label={`Sentiment score: ${sentiment.score} out of 10`}>
                {sentiment.score}
              </div>
              <div className="text-xl font-semibold text-lean-black-70">
                / 10
              </div>
            </div>

            {/* Executive Summary Display */}
            <div className={`rounded-lg p-6 ${getScoreBgColor(sentiment.score)}`}>
              <div className="flex items-start gap-3">
                {sentiment.score >= 8 ? (
                  <window.TrendingUpIcon className="w-6 h-6 text-lean-green flex-shrink-0 mt-1" />
                ) : (
                  <window.TrendingDownIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lean-black">Executive Summary</h3>
                    <span className="text-xs text-lean-black-60 bg-lean-almost-white px-2 py-1 rounded">
                      C-Level Brief
                    </span>
                  </div>
                  <p className="text-lean-black-80 leading-relaxed">{sentiment.summary}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comprehensive Analysis Display */}
          {sentiment.comprehensiveAnalysis && (
            <div className="bg-lean-white rounded-lg shadow-lg p-8 mb-6 border-l-4 border-lean-green">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-lean-black">Comprehensive Analysis</h3>
                  <span className="text-xs text-lean-black-60 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                    For CSMs & Account Managers
                  </span>
                </div>
              </div>
              <div className="prose max-w-none">
                <div className="text-lean-black-80 leading-relaxed whitespace-pre-wrap">
                  {sentiment.comprehensiveAnalysis}
                </div>
              </div>
            </div>
          )}

          {/* Historical Sentiment Section */}
          {sentimentHistory && sentimentHistory.history && sentimentHistory.history.length > 0 && (
            <div className="bg-lean-white rounded-lg shadow-lg p-8 mb-6">
              <h3 className="typography-heading text-lean-black mb-4">Sentiment History</h3>
              
              {/* Statistics */}
              {sentimentHistory.stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-lean-almost-white rounded-lg p-4">
                    <div className="text-sm text-lean-black-70 mb-1">Average Score</div>
                    <div className="text-2xl font-bold text-lean-black">{sentimentHistory.stats.average.toFixed(1)}</div>
                    <div className="text-xs text-lean-black-60">/ 10</div>
                  </div>
                  <div className="bg-lean-almost-white rounded-lg p-4">
                    <div className="text-sm text-lean-black-70 mb-1">Range</div>
                    <div className="text-2xl font-bold text-lean-black">
                      {sentimentHistory.stats.min} - {sentimentHistory.stats.max}
                    </div>
                    <div className="text-xs text-lean-black-60">Min - Max</div>
                  </div>
                  <div className="bg-lean-almost-white rounded-lg p-4">
                    <div className="text-sm text-lean-black-70 mb-1">Total Analyses</div>
                    <div className="text-2xl font-bold text-lean-black">{sentimentHistory.stats.total}</div>
                    <div className="text-xs text-lean-black-60">Last 365 days</div>
                  </div>
                  <div className="bg-lean-almost-white rounded-lg p-4">
                    <div className="text-sm text-lean-black-70 mb-1">Trend</div>
                    <div className={`text-2xl font-bold ${
                      sentimentHistory.stats.trend === 'improving' ? 'text-lean-green' :
                      sentimentHistory.stats.trend === 'declining' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {sentimentHistory.stats.trend === 'improving' ? '↑ Improving' :
                       sentimentHistory.stats.trend === 'declining' ? '↓ Declining' :
                       '→ Stable'}
                    </div>
                    {sentimentHistory.stats.recentAverage > 0 && sentimentHistory.stats.previousAverage > 0 && (
                      <div className="text-xs text-lean-black-60">
                        {sentimentHistory.stats.recentAverage.toFixed(1)} vs {sentimentHistory.stats.previousAverage.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Simple Line Chart Visualization */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-lean-black-80 mb-3">Score Over Time</h4>
                <div className="bg-lean-almost-white rounded-lg p-4" style={{ height: '200px', position: 'relative' }}>
                  {/* Simple bar chart representation */}
                  <div className="flex items-end justify-between h-full gap-1">
                    {sentimentHistory.history.slice(0, 20).reverse().map((entry, idx) => {
                      const height = (entry.score / 10) * 100;
                      const color = entry.score <= 4 ? '#ef4444' : entry.score <= 7 ? '#eab308' : '#22c55e';
                      return (
                        <button
                          key={entry.id || idx}
                          onClick={() => {
                            if (entry.id && window.navigate) {
                              window.navigate(`/sentiment/${entry.id}`);
                            } else if (entry.id) {
                              window.location.href = `/sentiment/${entry.id}`;
                            }
                          }}
                          className="flex-1 flex flex-col items-center cursor-pointer"
                          title={`Score: ${entry.score} on ${new Date(entry.analyzed_at).toLocaleDateString()} - Click to view details`}
                          disabled={!entry.id}
                        >
                          <div
                            className="w-full rounded-t transition-all hover:opacity-80"
                            style={{
                              height: `${height}%`,
                              backgroundColor: color,
                              minHeight: '4px'
                            }}
                          />
                          <div className="text-xs text-lean-black-60 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
                            {new Date(entry.analyzed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent History List */}
              <div>
                <h4 className="text-sm font-semibold text-lean-black-80 mb-3">Recent Analyses</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {sentimentHistory.history.slice(0, 10).map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => {
                        if (entry.id && window.navigate) {
                          window.navigate(`/sentiment/${entry.id}`);
                        } else if (entry.id) {
                          window.location.href = `/sentiment/${entry.id}`;
                        }
                      }}
                      className="w-full flex items-center justify-between p-3 bg-lean-almost-white rounded-lg border border-lean-black/20 hover:bg-lean-green-10 hover:border-lean-green/30 transition-colors text-left"
                      disabled={!entry.id}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${
                            entry.score <= 4 ? 'text-red-600' :
                            entry.score <= 7 ? 'text-yellow-600' :
                            'text-lean-green'
                          }`}>
                            {entry.score}
                          </span>
                          <span className="text-sm text-lean-black-70">/ 10</span>
                          <span className="text-xs text-lean-black-60 ml-2">
                            {new Date(entry.analyzed_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-lean-black-70 mt-1 line-clamp-1">{entry.summary}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {historyLoading && (
            <div className="bg-lean-white rounded-lg shadow-lg p-8 mb-6">
              <div className="flex items-center justify-center">
                <window.LoaderIcon className="w-6 h-6 animate-spin text-blue-600 mr-3" />
                <p className="text-lean-black-70">Loading sentiment history...</p>
              </div>
            </div>
          )}

          {/* Data Sources Section */}
          {dataSources && (
            <div className="bg-lean-white rounded-lg shadow-lg p-8 mb-6">
              <h3 className="text-xl font-semibold text-lean-black mb-4">Analysis Data Sources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {dataSources.hasTranscription ? (
                      <svg className="w-5 h-5 text-lean-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className="font-medium text-lean-black-80">Avoma Transcription</span>
                  </div>
                  {dataSources.hasTranscription ? (
                    <p className="text-lean-black-70 ml-7">
                      {dataSources.transcriptionLength.toLocaleString()} characters from customer call/meeting
                      {dataSources.avomaCallsTotal > 0 && (
                        <span className="block mt-1 text-xs text-lean-black-60">
                          Found {dataSources.avomaCallsTotal} meeting{dataSources.avomaCallsTotal !== 1 ? 's' : ''} 
                          {dataSources.avomaCallsReady > 0 && ` (${dataSources.avomaCallsReady} with ready transcripts)`}
                        </span>
                      )}
                    </p>
                  ) : (
                    <p className="text-lean-black-60 ml-7 text-xs">No transcription available</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {dataSources.hasAccountData ? (
                      <svg className="w-5 h-5 text-lean-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className="font-medium text-lean-black-80">Salesforce Account</span>
                  </div>
                  {dataSources.hasAccountData ? (
                    <p className="text-lean-black-70 ml-7">
                      <button
                        onClick={() => {
                          const accountId = selectedAccount?.salesforceId || selectedAccount?.id;
                          if (accountId && window.navigate) {
                            window.navigate(`/account/${accountId}/data`);
                          } else if (accountId) {
                            window.location.href = `/account/${accountId}/data`;
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {dataSources.accountName}
                      </button>
                      {dataSources.casesCount > 0 && (
                        <span className="block mt-1 text-xs text-lean-black-60">
                          {dataSources.casesCount} support case{dataSources.casesCount !== 1 ? 's' : ''} found
                        </span>
                      )}
                    </p>
                  ) : (
                    <p className="text-lean-black-60 ml-7 text-xs">No account data available</p>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-lean-black-60 mb-3">
                  <strong>AI Analysis:</strong> Powered by Google Gemini 2.5 Flash, analyzing conversation tone, 
                  customer language, and account context to generate sentiment score.
                </p>
                <button
                  onClick={() => setShowDataDetails(!showDataDetails)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1"
                  aria-expanded={showDataDetails}
                  aria-label={showDataDetails ? 'Hide data details' : 'Show data details'}
                >
                  {showDataDetails ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      Hide Data Used in Analysis
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Show Data Used in Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Detailed Data View */}
          {showDataDetails && analysisData && (
            <div className="bg-lean-white rounded-lg shadow-lg p-8 mb-6">
              <h4 className="text-lg font-semibold text-lean-black mb-4">Detailed Data Used in Analysis</h4>
              
              {/* Avoma Transcription Details */}
              <div className="bg-lean-almost-white rounded-lg p-4 mb-4">
                <h5 className="text-sm font-semibold text-gray-800 mb-2">Avoma Transcription</h5>
                {analysisData.transcription && analysisData.transcription.length > 0 ? (
                  <>
                    <p className="text-xs text-lean-black-80 mb-2">
                      <span className="font-medium">Characters:</span> {analysisData.transcription.length.toLocaleString()} | 
                      <span className="font-medium ml-2">Words:</span> {analysisData.transcription.split(/\s+/).filter(Boolean).length.toLocaleString()}
                    </p>
                    <div className="bg-lean-white border border-lean-black/20 rounded-md p-3 text-xs text-gray-800 max-h-60 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-mono">{analysisData.transcription}</pre>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-lean-black-60">No transcription data was available for analysis.</p>
                )}
              </div>

              {/* Salesforce Context Details */}
              <div className="bg-lean-almost-white rounded-lg p-4 mb-4">
                <h5 className="text-sm font-semibold text-gray-800 mb-2">Salesforce Account Context</h5>
                {analysisData.salesforceContext ? (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <span className="font-medium text-lean-black-70">Account Name:</span>
                      <button
                        onClick={() => {
                          const accountId = selectedAccount?.salesforceId || selectedAccount?.id || analysisData.salesforceContext?.account_id;
                          if (accountId && window.navigate) {
                            window.navigate(`/account/${accountId}/data`);
                          } else if (accountId) {
                            window.location.href = `/account/${accountId}/data`;
                          }
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {analysisData.salesforceContext.account_name || 'N/A'}
                      </button>
                    </div>
                    <div>
                      <span className="font-medium text-lean-black-70">Tier:</span>
                      <span className="ml-2 text-lean-black">{analysisData.salesforceContext.account_tier || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-lean-black-70">Contract Value:</span>
                      <span className="ml-2 text-lean-black">{window.formatCurrency(analysisData.salesforceContext.contract_value) || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-lean-black-70">Industry:</span>
                      <span className="ml-2 text-lean-black">{analysisData.salesforceContext.industry || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-lean-black-70">Annual Revenue:</span>
                      <span className="ml-2 text-lean-black">{analysisData.salesforceContext.annual_revenue ? `$${analysisData.salesforceContext.annual_revenue.toLocaleString()}` : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-lean-black-70">Account Manager:</span>
                      <span className="ml-2 text-lean-black">{analysisData.salesforceContext.account_manager || 'N/A'}</span>
                    </div>
                    {analysisData.salesforceContext.total_cases_count !== undefined && (
                      <div>
                        <span className="font-medium text-lean-black-70">Support Cases:</span>
                        <span className="ml-2 text-lean-black">{analysisData.salesforceContext.total_cases_count}</span>
                      </div>
                    )}
                    {analysisData.salesforceContext.total_avoma_calls !== undefined && (
                      <div>
                        <span className="font-medium text-lean-black-70">Avoma Calls (Total):</span>
                        <span className="ml-2 text-lean-black">{analysisData.salesforceContext.total_avoma_calls}</span>
                      </div>
                    )}
                    {analysisData.salesforceContext.ready_avoma_calls !== undefined && (
                      <div>
                        <span className="font-medium text-lean-black-70">Avoma Calls (Ready):</span>
                        <span className="ml-2 text-lean-black">{analysisData.salesforceContext.ready_avoma_calls}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-lean-black-60">No Salesforce account context was available for analysis.</p>
                )}
              </div>

              {/* Recent Support Cases Details */}
              {analysisData.salesforceContext?.recent_tickets && 
               analysisData.salesforceContext.recent_tickets.length > 0 && (
                <div className="bg-lean-almost-white rounded-lg p-4 mb-4">
                  <h5 className="text-sm font-semibold text-gray-800 mb-2">
                    Recent Support Cases ({analysisData.salesforceContext.recent_tickets.length})
                  </h5>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {analysisData.salesforceContext.recent_tickets.map((ticket, idx) => (
                      <div key={idx} className="text-xs bg-lean-white rounded p-2 border border-lean-black/20">
                        <a
                          href={`https://leandata.my.salesforce.com/500/o/Case/d?id=${ticket.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1"
                          aria-label={`View case ${ticket.caseNumber} in Salesforce`}
                        >
                          {ticket.caseNumber || ticket.id} - {ticket.subject || 'No Subject'}
                          <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        <p className="text-lean-black-70 mt-1">
                          Status: <span className={`font-semibold ${ticket.status === 'Closed' ? 'text-lean-green' : 'text-blue-600'}`}>{ticket.status}</span>
                          <span className="mx-2">|</span> Priority: <span className={`font-semibold ${['High', 'Critical'].includes(ticket.priority) ? 'text-red-600' : 'text-lean-black-70'}`}>{ticket.priority || 'N/A'}</span>
                        </p>
                        <p className="text-lean-black-60 mt-1">
                          Created: {new Date(ticket.created_date).toLocaleDateString()} {ticket.closed_date ? `| Closed: ${new Date(ticket.closed_date).toLocaleDateString()}` : ''}
                        </p>
                        {ticket.description && (
                          <p className="text-lean-black-80 mt-2 italic line-clamp-2" title={ticket.description}>
                            "{ticket.description}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LinkedIn Data Details */}
              {analysisData.salesforceContext?.linkedin_data && 
               analysisData.salesforceContext.linkedin_data.contacts.length > 0 && (
                <div className="bg-lean-almost-white rounded-lg p-4 mb-4">
                  <h5 className="text-sm font-semibold text-gray-800 mb-2">
                    LinkedIn Professional Context ({analysisData.salesforceContext.linkedin_data.contacts.length} contacts)
                  </h5>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {analysisData.salesforceContext.linkedin_data.contacts.map((contact, idx) => (
                      <div key={idx} className="text-xs bg-lean-white rounded p-2 border border-lean-black/20">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-lean-black">{contact.name}</span>
                          {contact.linkedin_url && (
                            <a
                              href={contact.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                              aria-label={`View ${contact.name} on LinkedIn`}
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                              LinkedIn
                            </a>
                          )}
                        </div>
                        {contact.current_title && (
                          <p className="text-lean-black-80 mt-1">
                            <span className="font-medium">Title:</span> {contact.current_title}
                            {contact.current_company && ` at ${contact.current_company}`}
                          </p>
                        )}
                        {contact.job_changed_recently && (
                          <p className="text-red-600 text-xs font-semibold mt-1">
                            ⚠️ Recent job change detected
                          </p>
                        )}
                        {contact.profile_updated_recently && (
                          <p className="text-yellow-600 text-xs mt-1">
                            📝 Profile recently updated
                          </p>
                        )}
                        {contact.engagement_with_company && (
                          contact.engagement_with_company.posts_about_company > 0 ||
                          contact.engagement_with_company.comments_on_company_posts > 0 ||
                          contact.engagement_with_company.shares_of_company_content > 0 ||
                          contact.engagement_with_company.reactions_to_company_posts > 0
                        ) && (
                          <p className="text-lean-black-70 text-xs mt-1">
                            Engagement: {contact.engagement_with_company.posts_about_company} posts, 
                            {contact.engagement_with_company.comments_on_company_posts} comments, 
                            {contact.engagement_with_company.shares_of_company_content} shares, 
                            {contact.engagement_with_company.reactions_to_company_posts} reactions
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Summary Statistics */}
              <div className="bg-lean-almost-white rounded-lg p-4">
                <h5 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-2">
                  Data Summary
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-blue-600 font-medium">Transcription</div>
                    <div className="text-blue-900">{analysisData.transcription.length.toLocaleString()} chars</div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-medium">Account Fields</div>
                    <div className="text-blue-900">
                      {Object.keys(analysisData.salesforceContext).filter(k => 
                        !['recent_tickets', 'account_id', 'linkedin_data'].includes(k) && 
                        analysisData.salesforceContext[k] !== null
                      ).length} provided
                    </div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-medium">Support Cases</div>
                    <div className="text-blue-900">
                      {analysisData.salesforceContext.recent_tickets?.length || 0} cases
                    </div>
                  </div>
                  <div>
                    <div className="text-blue-600 font-medium">LinkedIn Contacts</div>
                    <div className="text-blue-900">
                      {analysisData.salesforceContext.linkedin_data?.contacts.length || 0} profiles
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Level Breakdown Section */}
          {contacts.length > 0 && (
            <div className="bg-lean-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-lean-black mb-4">Contact Level Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* C-Level */}
                <div className={`rounded-lg p-4 border-2 ${
                  caseInvolvedByLevel['C-Level'] > 0 
                    ? 'bg-red-50 border-red-300' 
                    : 'bg-lean-almost-white border-lean-black/20'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lean-black">C-Level</h4>
                    {caseInvolvedByLevel['C-Level'] > 0 && (
                      <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                        ⚠️ {caseInvolvedByLevel['C-Level']} in cases
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-lean-black mb-1">
                    {contactLevelCounts['C-Level']}
                  </div>
                  <div className="text-xs text-lean-black-70">
                    {caseInvolvedByLevel['C-Level'] > 0 ? (
                      <span className="text-red-600 font-semibold">
                        {caseInvolvedByLevel['C-Level']} involved in support cases - Major concern
                      </span>
                    ) : (
                      <span className="text-lean-green">No case involvement</span>
                    )}
                  </div>
                </div>

                {/* Sr. Level */}
                <div className={`rounded-lg p-4 border-2 ${
                  caseInvolvedByLevel['Sr. Level'] > 0 
                    ? 'bg-yellow-50 border-yellow-300' 
                    : 'bg-lean-almost-white border-lean-black/20'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lean-black">Sr. Level</h4>
                    {caseInvolvedByLevel['Sr. Level'] > 0 && (
                      <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                        ⚠️ {caseInvolvedByLevel['Sr. Level']} in cases
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-lean-black mb-1">
                    {contactLevelCounts['Sr. Level']}
                  </div>
                  <div className="text-xs text-lean-black-70">
                    {caseInvolvedByLevel['Sr. Level'] > 0 ? (
                      <span className="text-yellow-600 font-semibold">
                        {caseInvolvedByLevel['Sr. Level']} involved in support cases - Significant concern
                      </span>
                    ) : (
                      <span className="text-lean-green">No case involvement</span>
                    )}
                  </div>
                </div>

                {/* Other */}
                <div className="rounded-lg p-4 border-2 bg-lean-almost-white border-lean-black/20">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lean-black">Other</h4>
                    {caseInvolvedByLevel['Other'] > 0 && (
                      <span className="text-xs text-lean-black-70">
                        {caseInvolvedByLevel['Other']} in cases
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-lean-black mb-1">
                    {contactLevelCounts['Other']}
                  </div>
                  <div className="text-xs text-lean-black-70">
                    {caseInvolvedByLevel['Other'] > 0 ? (
                      <span>{caseInvolvedByLevel['Other']} involved in support cases</span>
                    ) : (
                      <span className="text-lean-green">No case involvement</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Contact Lists by Level */}
              <div className="space-y-4">
                {contactsByLevel['C-Level'].length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-lean-black mb-2">
                      C-Level Contacts ({contactsByLevel['C-Level'].length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {contactsByLevel['C-Level'].map((contact) => (
                        <div key={contact.id || contact.email} className={`text-sm p-2 rounded border ${
                          contact.involvedInCases 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-lean-almost-white border-lean-black/20'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-lean-black">
                              {contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim()}
                            </span>
                            {contact.involvedInCases && (
                              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                ⚠️ In Cases
                              </span>
                            )}
                          </div>
                          {contact.title && (
                            <p className="text-xs text-lean-black-70 mt-1">{contact.title}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {contactsByLevel['Sr. Level'].length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-lean-black mb-2">
                      Sr. Level Contacts ({contactsByLevel['Sr. Level'].length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {contactsByLevel['Sr. Level'].map((contact) => (
                        <div key={contact.id || contact.email} className={`text-sm p-2 rounded border ${
                          contact.involvedInCases 
                            ? 'bg-yellow-50 border-yellow-200' 
                            : 'bg-lean-almost-white border-lean-black/20'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-lean-black">
                              {contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim()}
                            </span>
                            {contact.involvedInCases && (
                              <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">
                                ⚠️ In Cases
                              </span>
                            )}
                          </div>
                          {contact.title && (
                            <p className="text-xs text-lean-black-70 mt-1">{contact.title}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cases and Contacts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Cases Section */}
            {cases.length > 0 && (
              <div className="bg-lean-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-lean-black mb-4">Support Cases ({cases.length})</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cases.map((caseItem) => {
                    const salesforceUrl = caseItem.id 
                      ? `https://leandata.my.salesforce.com/${caseItem.id}`
                      : null;
                    
                    return (
                      <div key={caseItem.id} className="bg-lean-almost-white rounded-lg p-3 border border-lean-black/20">
                        <a
                          href={salesforceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 mb-1"
                        >
                          {caseItem.caseNumber || caseItem.id} - {caseItem.subject || 'No Subject'}
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        <p className="text-xs text-lean-black-70 mt-1">
                          Status: <span className={`font-semibold ${caseItem.status === 'Closed' ? 'text-lean-green' : 'text-blue-600'}`}>{caseItem.status}</span>
                          <span className="mx-2">|</span> Priority: <span className={`font-semibold ${['High', 'Critical'].includes(caseItem.priority) ? 'text-red-600' : 'text-lean-black-70'}`}>{caseItem.priority || 'N/A'}</span>
                        </p>
                        <p className="text-xs text-lean-black-60 mt-1">
                          Created: {new Date(caseItem.createdDate).toLocaleDateString()} {caseItem.closedDate ? `| Closed: ${new Date(caseItem.closedDate).toLocaleDateString()}` : ''}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contacts Section */}
            {contacts.length > 0 && (
              <div className="bg-lean-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-lean-black mb-4">Account Contacts ({contacts.length})</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {contactsWithCaseInvolvement.map((contact) => {
                    const contactLevel = contact.contactLevel || window.categorizeContactLevel(contact.title || contact.linkedinProfile?.current_title || '');
                    const isInvolved = contact.involvedInCases;
                    const salesforceUrl = contact.id 
                      ? `https://leandata.my.salesforce.com/${contact.id}`
                      : null;
                    
                    return (
                      <div key={contact.id} className="bg-lean-almost-white rounded-lg p-3 border border-lean-black/20">
                        <a
                          href={salesforceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 mb-1"
                        >
                          {contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Contact'}
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        {contact.title && (
                          <p className="text-xs text-lean-black-70 mt-1">{contact.title}</p>
                        )}
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-lean-black-60 mt-1">
                          {contact.email && (
                            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                              {contact.email}
                            </a>
                          )}
                          {contact.phone && (
                            <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                              {contact.phone}
                            </a>
                          )}
                          {contact.linkedinURL && (
                            <a 
                              href={contact.linkedinURL} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                              aria-label={`View ${contact.name} on LinkedIn`}
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                              LinkedIn
                            </a>
                          )}
                        </div>
                        {contact.linkedinProfile && (
                          <div className="mt-2 pt-2 border-t border-lean-black/20">
                            {contact.linkedinProfile.job_changed_recently && (
                              <p className="text-xs text-red-600 font-semibold mb-1">
                                ⚠️ Recent job change detected
                              </p>
                            )}
                            {contact.linkedinProfile.current_title && (
                              <p className="text-xs text-lean-black-70">
                                <span className="font-medium">LinkedIn:</span> {contact.linkedinProfile.current_title}
                                {contact.linkedinProfile.current_company && ` at ${contact.linkedinProfile.current_company}`}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        </main>

        {/* Footer */}
        <footer className="bg-lean-black px-4 sm:px-6 lg:px-8 py-4 flex-shrink-0">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs text-[#f7f7f7] text-center">
              ✅ Sentiment analysis is securely handled via Vercel Serverless Function
            </p>
          </div>
        </footer>
      </div>
    );
  };

  // Show results page if analysis is complete
  if (showResultsPage && sentiment) {
    return (
      <>
        <ResultsPage
          sentiment={sentiment}
          dataSources={dataSources}
          analysisData={analysisData}
          selectedAccount={selectedAccount}
          cases={cases}
          contacts={contacts}
          sentimentHistory={sentimentHistory}
          historyLoading={historyLoading}
          avomaWarning={avomaWarning}
          onBack={() => {
            setShowResultsPage(false);
            setSentiment(null);
            setAnalysisData(null);
            setDataSources(null);
            setSentimentHistory(null);
            setAvomaWarning(null);
          }}
          onShowHelp={() => setShowHelp(true)}
          onCloseHelp={() => setShowHelp(false)}
          showHelp={showHelp}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-lean-almost-white flex flex-col">
      {/* Global Header */}
      <window.Header user={user} onSignOut={onSignOut} showHelp={showHelp} setShowHelp={setShowHelp} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
        {/* Help Page */}
        {showHelp && <HelpPage onClose={() => setShowHelp(false)} />}

        {/* Accounts Selection */}
        {loadingAccounts ? (
          <div className="bg-lean-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-center py-8">
              <window.LoaderIcon className="w-6 h-6 animate-spin text-blue-600 mr-3" />
              <p className="text-lean-black-70">Loading your accounts...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* My Accounts - Left Side */}
            <div className="bg-lean-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="account-select" className="block text-sm font-semibold text-lean-black">
                  📋 My Accounts
                </label>
                <button
                  onClick={() => {
                    if (window.navigate) {
                      window.navigate('/user');
                    } else {
                      window.location.href = '/user';
                    }
                  }}
                  className="text-xs text-lean-green hover:text-lean-green/80 underline font-medium transition-colors"
                  aria-label="Manage accounts"
                >
                  Manage Accounts →
                </button>
              </div>
              {accounts.length > 0 && !isSearchMode ? (
                <select
                  id="account-select"
                  value={selectedAccount?.id || ''}
                  onChange={(e) => {
                    const account = accounts.find(acc => acc.id === e.target.value);
                    setSelectedAccount(account);
                    setCustomerIdentifier(account?.name || '');
                  }}
                  className="w-full px-4 py-3 border border-lean-black/20 rounded-lg focus:ring-2 focus:ring-lean-green focus:border-transparent outline-none transition-all"
                  aria-label="Select Salesforce account"
                >
                  <option value="">-- Select an account --</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} {account.accountTier ? `(${account.accountTier})` : ''}
                    </option>
                  ))}
                </select>
              ) : !isSearchMode ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg" role="alert">
                  <p className="text-sm text-yellow-700 mb-2">
                    No accounts found. Visit the <strong>My Accounts</strong> page to add accounts.
                  </p>
                  <button
                    onClick={() => {
                      if (window.navigate) {
                        window.navigate('/user');
                      } else {
                        window.location.href = '/user';
                      }
                    }}
                    className="text-sm text-yellow-800 hover:text-yellow-900 underline font-semibold"
                  >
                    Go to My Accounts →
                  </button>
                </div>
              ) : (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg" role="alert">
                  <p className="text-sm text-blue-700">
                    Currently showing search results. Select an account from the search results on the right.
                  </p>
                </div>
              )}
            </div>

            {/* Search Section - Right Side */}
            <div className="bg-lean-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="account-search" className="block text-sm font-semibold text-lean-black">
                  {isSearchMode ? '🔍 Search Results' : '🔍 Search for Any Account'}
                </label>
                {isSearchMode && (
                  <button
                    onClick={handleClearSearch}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                    aria-label="Clear search and show assigned accounts"
                  >
                    Show My Accounts
                  </button>
                )}
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  id="account-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchTerm);
                    }
                  }}
                  placeholder="Type account name to search (min 2 characters)..."
                  className="flex-1 px-4 py-3 border-2 border-lean-black/20 rounded-lg focus:ring-2 focus:ring-lean-green focus:border-lean-green outline-none transition-all"
                  aria-label="Search for Salesforce account"
                />
                <button
                  onClick={() => handleSearch(searchTerm)}
                  disabled={isSearching || !searchTerm || searchTerm.trim().length < 2}
                  className="px-6 py-3 bg-lean-green text-lean-white rounded-lg hover:bg-lean-green/90 disabled:bg-lean-black/30 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
                  aria-label="Search accounts"
                >
                  {isSearching ? (
                    <window.LoaderIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
              {isSearchMode && accounts.length > 0 ? (
                <>
                  <select
                    id="search-account-select"
                    value={selectedAccount?.id || ''}
                    onChange={(e) => {
                      const account = accounts.find(acc => acc.id === e.target.value);
                      setSelectedAccount(account);
                      setCustomerIdentifier(account?.name || '');
                      // useEffect will handle fetching cases and contacts when selectedAccount changes
                    }}
                    className="w-full px-4 py-3 border border-lean-black/20 rounded-lg focus:ring-2 focus:ring-lean-green focus:border-transparent outline-none transition-all"
                    aria-label="Select from search results"
                  >
                    <option value="">-- Select from search results --</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} {account.accountTier ? `(${account.accountTier})` : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-lean-black-60 mt-2">
                    Found {accounts.length} account{accounts.length !== 1 ? 's' : ''}. Select one to analyze.
                  </p>
                </>
              ) : isSearchMode ? (
                <div className="bg-lean-almost-white border border-lean-black/20 rounded-lg p-4">
                  <p className="text-sm text-lean-black-70">
                    No accounts found matching "{searchTerm}". Try a different search term.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-lean-black-60">
                  Search for any account in Salesforce by name. Results will appear here.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Selected Account Details - Full Width Below Split */}
        {selectedAccount && (
          <div className="bg-lean-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-lean-black">Selected Account Details</h3>
              <div className="flex items-center gap-3">
                {/* Cache Status Indicator */}
                {checkingCache ? (
                  <div className="flex items-center gap-2 text-xs text-lean-black-70">
                    <window.LoaderIcon className="w-4 h-4 animate-spin text-lean-green" />
                    <span>Checking cache...</span>
                  </div>
                ) : cachedSentiment ? (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                      ✓ Cached
                    </span>
                    <span className="text-lean-black-70">
                      {(() => {
                        try {
                          const analyzedDate = new Date(cachedSentiment.analyzed_at);
                          const now = new Date();
                          const diffMs = now - analyzedDate;
                          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                          
                          if (diffDays === 0 && diffHours === 0) {
                            const diffMins = Math.floor(diffMs / (1000 * 60));
                            return diffMins < 1 ? 'Just now' : `${diffMins} min ago`;
                          } else if (diffDays === 0) {
                            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                          } else if (diffDays === 1) {
                            return 'Yesterday';
                          } else if (diffDays < 7) {
                            return `${diffDays} days ago`;
                          } else {
                            return analyzedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                          }
                        } catch {
                          return 'Recently';
                        }
                      })()}
                    </span>
                  </div>
                ) : null}
                
                {/* Action Buttons */}
                {cachedSentiment ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        // View cached sentiment - load it directly
                        if (cachedSentiment.id && window.navigate) {
                          window.navigate(`/sentiment/${cachedSentiment.id}`);
                        } else {
                          // Fallback: set sentiment from cache and show results
                          setSentiment({
                            score: cachedSentiment.score,
                            summary: cachedSentiment.summary,
                            comprehensiveAnalysis: cachedSentiment.comprehensive_analysis || cachedSentiment.summary,
                            cached: true,
                            analyzedAt: cachedSentiment.analyzed_at,
                          });
                          setShowResultsPage(true);
                        }
                      }}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                      aria-label="View cached sentiment"
                    >
                      View Cached
                    </button>
                    <button
                      onClick={() => handleAnalyze(0, true)}
                      disabled={loading || !selectedAccount || !customerIdentifier}
                      className="px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 focus:outline-none focus:ring-2 focus:ring-lean-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm"
                      aria-label={loading ? 'Re-running analysis' : 'Re-run analysis'}
                      aria-busy={loading}
                    >
                      {loading ? (
                        <>
                          <window.LoaderIcon className="w-4 h-4 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Re-run</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAnalyze(0, false)}
                    disabled={loading || !selectedAccount || !customerIdentifier}
                    className="px-6 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 focus:outline-none focus:ring-2 focus:ring-lean-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    aria-label={loading ? 'Analyzing sentiment' : 'View sentiment analysis'}
                    aria-busy={loading}
                  >
                    {loading ? (
                      <>
                        <window.LoaderIcon className="w-5 h-5 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Sentiment</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <span className="text-lean-black-70">Account:</span>
                <span className="ml-2 font-medium text-lean-black block">{selectedAccount.name}</span>
              </div>
              <div>
                <span className="text-lean-black-70">Tier:</span>
                <span className="ml-2 font-medium text-lean-black">{selectedAccount.accountTier || 'N/A'}</span>
              </div>
              <div>
                <span className="text-lean-black-70">Contract Value:</span>
                <span className="ml-2 font-medium text-lean-black">{window.formatCurrency(selectedAccount.contractValue)}</span>
              </div>
              <div>
                <span className="text-lean-black-70">Industry:</span>
                <span className="ml-2 font-medium text-lean-black">{selectedAccount.industry || 'N/A'}</span>
              </div>
              <div>
                <span className="text-lean-black-70">Owner:</span>
                <span className="ml-2 font-medium text-lean-black">{selectedAccount.ownerName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-lean-black-70">Support Cases:</span>
                <span className="ml-2 font-medium text-lean-black">
                  {casesLoading ? (
                    <span className={casesLoadingFromCache ? "text-blue-600" : "text-orange-600"}>
                      {casesLoadingFromCache ? "Loading from cache..." : "Loading from Salesforce..."}
                    </span>
                  ) : cases.length > 0 ? (
                    <button
                      onClick={() => setShowCasesList(!showCasesList)}
                      className="text-blue-600 hover:text-blue-800 underline font-semibold"
                      aria-label={`${cases.length} cases - click to ${showCasesList ? 'hide' : 'show'} list`}
                    >
                      {cases.length} case{cases.length !== 1 ? 's' : ''}
                    </button>
                  ) : (
                    '0'
                  )}
                </span>
              </div>
              <div>
                <span className="text-lean-black-70">Contacts:</span>
                <span className="ml-2 font-medium text-lean-black">
                  {contactsLoading ? (
                    <span className={contactsLoadingFromCache ? "text-blue-600" : "text-orange-600"}>
                      {contactsLoadingFromCache ? "Loading from cache..." : "Loading from Salesforce..."}
                    </span>
                  ) : contacts.length > 0 ? (
                    <button
                      onClick={() => setShowContactsList(!showContactsList)}
                      className="text-blue-600 hover:text-blue-800 underline font-semibold"
                      aria-label={`${contacts.length} contacts - click to ${showContactsList ? 'hide' : 'show'} list`}
                    >
                      {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
                    </button>
                  ) : (
                    '0'
                  )}
                </span>
              </div>
            </div>

            {/* Cases List - Expandable */}
            {cases.length > 0 && showCasesList && (
              <div className="mt-4 pt-4 border-t border-lean-black/20">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-lean-black">
                    Recent Support Cases ({cases.length})
                  </h4>
                  <button
                    onClick={() => setShowCasesList(false)}
                    className="text-xs text-lean-black-60 hover:text-lean-black-80"
                    aria-label="Hide cases list"
                  >
                    Hide
                  </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {cases.map((caseItem, idx) => {
                    // Build Salesforce URL if we have the case ID
                    const salesforceUrl = caseItem.id 
                      ? `https://leandata.my.salesforce.com/${caseItem.id}`
                      : null;
                    
                    return (
                      <div 
                        key={idx} 
                        className="bg-lean-almost-white rounded-lg p-3 border border-lean-black/20 hover:border-lean-green/30 hover:bg-lean-green-10 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {salesforceUrl ? (
                                <a
                                  href={salesforceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {caseItem.caseNumber || `Case ${idx + 1}`}
                                </a>
                              ) : (
                                <span className="font-semibold text-lean-black text-sm">
                                  {caseItem.caseNumber || `Case ${idx + 1}`}
                                </span>
                              )}
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                caseItem.status === 'Closed' ? 'bg-green-100 text-green-800' :
                                caseItem.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                                caseItem.priority === 'High' || caseItem.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {caseItem.status || 'Unknown'}
                              </span>
                              {caseItem.priority && (
                                <span className="text-xs text-lean-black-70">
                                  {caseItem.priority} priority
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-lean-black font-medium mb-1">
                              {caseItem.subject || 'No subject'}
                            </p>
                            {caseItem.createdDate && (
                              <p className="text-xs text-lean-black-60">
                                Created: {new Date(caseItem.createdDate).toLocaleDateString()}
                                {caseItem.closedDate && (
                                  <span className="ml-2">
                                    • Closed: {new Date(caseItem.closedDate).toLocaleDateString()}
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                          {salesforceUrl && (
                            <a
                              href={salesforceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`Open case ${caseItem.caseNumber} in Salesforce`}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contacts List - Expandable */}
            {contacts.length > 0 && showContactsList && (
              <div className="mt-4 pt-4 border-t border-lean-black/20">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-lean-black">
                    Account Contacts ({contacts.length})
                  </h4>
                  <button
                    onClick={() => setShowContactsList(false)}
                    className="text-xs text-lean-black-60 hover:text-lean-black-80"
                    aria-label="Hide contacts list"
                  >
                    Hide
                  </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {contacts.map((contact, idx) => {
                    // Build Salesforce URL if we have the contact ID
                    const salesforceUrl = contact.id 
                      ? `https://leandata.my.salesforce.com/${contact.id}`
                      : null;
                    
                    return (
                      <div 
                        key={idx} 
                        className="bg-lean-almost-white rounded-lg p-3 border border-lean-black/20 hover:border-lean-green/30 hover:bg-lean-green-10 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {salesforceUrl ? (
                                <a
                                  href={salesforceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Contact'}
                                </a>
                              ) : (
                                <span className="font-semibold text-lean-black text-sm">
                                  {contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Contact'}
                                </span>
                              )}
                              {contact.contactStatus && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  contact.contactStatus === 'Unqualified' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {contact.contactStatus}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-lean-black-70 mb-1">
                              {contact.title && <span>{contact.title}</span>}
                              {contact.department && (
                                <span className="ml-2 text-lean-black-60">• {contact.department}</span>
                              )}
                              {contact.reportsToName && (
                                <span className="ml-2 text-lean-black-60">• Reports to: {contact.reportsToName}</span>
                              )}
                            </div>
                            {/* Risk Indicators */}
                            {(contact.linkedinProfile?.job_changed_recently || 
                              (contact.linkedinProfile?.job_change_likelihood && contact.linkedinProfile.job_change_likelihood > 50)) && (
                              <div className="mb-1">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                                  ⚠️ Job Change Risk
                                </span>
                                {contact.linkedinProfile.days_in_current_role && (
                                  <span className="text-xs text-lean-black-60 ml-2">
                                    ({contact.linkedinProfile.days_in_current_role} days in role)
                                  </span>
                                )}
                              </div>
                            )}
                            {/* Last Activity Indicator */}
                            {contact.lastActivityDate && (() => {
                              const daysSinceActivity = Math.floor((new Date() - new Date(contact.lastActivityDate)) / (24 * 60 * 60 * 1000));
                              const isStale = daysSinceActivity > 90;
                              return (
                                <div className="mb-1">
                                  <span className={`text-xs ${isStale ? 'text-red-600 font-semibold' : 'text-lean-black-60'}`}>
                                    Last activity: {daysSinceActivity} days ago {isStale ? '(Stale)' : ''}
                                  </span>
                                </div>
                              );
                            })()}
                            {/* Apollo Enrichment Indicators */}
                            {contact.linkedinProfile && (
                              <div className="mb-1 flex flex-wrap gap-2">
                                {contact.linkedinProfile.email_verified && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                                    ✓ Verified Email
                                  </span>
                                )}
                                {contact.linkedinProfile.company_industry && (
                                  <span className="text-xs text-lean-black-60">
                                    Industry: {contact.linkedinProfile.company_industry}
                                  </span>
                                )}
                                {contact.linkedinProfile.company_size && (
                                  <span className="text-xs text-lean-black-60">
                                    Company: {contact.linkedinProfile.company_size.toLocaleString()} employees
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-lean-black-60">
                              {contact.email && (
                                <a 
                                  href={`mailto:${contact.email}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {contact.email}
                                </a>
                              )}
                              {contact.phone && (
                                <a 
                                  href={`tel:${contact.phone}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {contact.phone}
                                </a>
                              )}
                              {contact.mobilePhone && !contact.phone && (
                                <a 
                                  href={`tel:${contact.mobilePhone}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {contact.mobilePhone} (mobile)
                                </a>
                              )}
                              {contact.mailingCity && contact.mailingState && (
                                <span className="text-lean-black-60">
                                  📍 {contact.mailingCity}, {contact.mailingState}
                                </span>
                              )}
                            </div>
                          </div>
                          {salesforceUrl && (
                            <a
                              href={salesforceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`Open contact ${contact.name} in Salesforce`}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6" role="alert" aria-live="polite">
            <div className="flex">
              <div className="flex-shrink-0" aria-hidden="true">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700 font-medium">Error</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                {retryCount > 0 && retryCount < maxRetries && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleAnalyze(retryCount)}
                      className="text-sm text-red-700 hover:text-red-900 font-medium underline"
                      aria-label={`Retry analysis (attempt ${retryCount + 1} of ${maxRetries})`}
                    >
                      Retry ({retryCount}/{maxRetries})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Display - Now shown on separate Results Page */}
        {false && sentiment && (
          <div className="bg-lean-white rounded-lg shadow-lg p-8" role="region" aria-live="polite" aria-label="Sentiment analysis results">
            {/* Score Display */}
            <div className={`text-center mb-6 p-8 rounded-xl border-2 ${getScoreColor(sentiment.score)}`} role="status">
              <div className="text-6xl font-bold mb-2" aria-label={`Sentiment score: ${sentiment.score} out of 10`}>
                {sentiment.score}
              </div>
              <div className="text-xl font-semibold text-lean-black-70">
                / 10
              </div>
            </div>

            {/* Executive Summary Display */}
            <div className={`rounded-lg p-6 ${getScoreBgColor(sentiment.score)}`}>
              <div className="flex items-start gap-3">
                {sentiment.score >= 8 ? (
                  <window.TrendingUpIcon className="w-6 h-6 text-lean-green flex-shrink-0 mt-1" />
                ) : (
                  <window.TrendingDownIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lean-black">Executive Summary</h3>
                    <span className="text-xs text-lean-black-60 bg-lean-almost-white px-2 py-1 rounded">
                      C-Level Brief
                    </span>
                  </div>
                  <p className="text-lean-black-80 leading-relaxed">{sentiment.summary}</p>
                </div>
              </div>
            </div>

            {/* Comprehensive Analysis Display */}
            {sentiment.comprehensiveAnalysis && (
              <div className="bg-lean-white rounded-lg shadow-lg p-8 mb-6 border-l-4 border-lean-green">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-lean-black">Comprehensive Analysis</h3>
                    <span className="text-xs text-lean-black-60 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                      For CSMs & Account Managers
                    </span>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <div className="text-lean-black-80 leading-relaxed whitespace-pre-wrap">
                    {sentiment.comprehensiveAnalysis}
                  </div>
                </div>
              </div>
            )}

            {/* Data Sources Explanation */}
            {dataSources && (
              <div className="mt-6 pt-6 border-t border-lean-black/20">
                <h4 className="text-sm font-semibold text-lean-black mb-3">Analysis Data Sources</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {dataSources.hasTranscription ? (
                        <svg className="w-5 h-5 text-lean-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className="font-medium text-lean-black-80">Avoma Transcription</span>
                    </div>
                    {dataSources.hasTranscription ? (
                      <p className="text-lean-black-70 ml-7">
                        {dataSources.transcriptionLength.toLocaleString()} characters from customer call/meeting
                        {dataSources.avomaCallsTotal > 0 && (
                          <span className="block mt-1 text-xs text-lean-black-60">
                            Found {dataSources.avomaCallsTotal} meeting{dataSources.avomaCallsTotal !== 1 ? 's' : ''} 
                            {dataSources.avomaCallsReady > 0 && ` (${dataSources.avomaCallsReady} with ready transcripts)`}
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-lean-black-60 ml-7 text-xs">No transcription available</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {dataSources.hasAccountData ? (
                        <svg className="w-5 h-5 text-lean-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className="font-medium text-lean-black-80">Salesforce Account</span>
                    </div>
                    {dataSources.hasAccountData ? (
                      <p className="text-lean-black-70 ml-7">
                        {dataSources.accountName}
                        {dataSources.casesCount > 0 && (
                          <span className="block mt-1 text-xs text-lean-black-60">
                            {dataSources.casesCount} support case{dataSources.casesCount !== 1 ? 's' : ''} found
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-lean-black-60 ml-7 text-xs">No account data available</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-lean-black-60 mb-3">
                    <strong>AI Analysis:</strong> Powered by Google Gemini 2.5 Flash, analyzing conversation tone, 
                    customer language, and account context to generate sentiment score.
                  </p>
                  <button
                    onClick={() => setShowDataDetails(!showDataDetails)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1"
                    aria-expanded={showDataDetails}
                    aria-label={showDataDetails ? 'Hide data details' : 'Show data details'}
                  >
                    {showDataDetails ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Hide Data Used in Analysis
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Show Data Used in Analysis
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Detailed Data View */}
            {showDataDetails && analysisData && (
              <div className="mt-6 pt-6 border-t border-lean-black/20">
                <h4 className="text-sm font-semibold text-lean-black mb-4">Exact Data Analyzed</h4>
                
                <div className="space-y-4">
                  {/* Transcription Data */}
                  <div className="bg-lean-almost-white rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-xs font-semibold text-lean-black-80 uppercase tracking-wide">
                        Avoma Transcription ({analysisData.transcription.length.toLocaleString()} characters)
                      </h5>
                      <span className="text-xs text-lean-black-60">
                        {Math.round(analysisData.transcription.length / 5)} words
                      </span>
                    </div>
                    <div className="bg-lean-white rounded border border-lean-black/20 p-3 max-h-64 overflow-y-auto">
                      <pre className="text-xs text-lean-black-80 whitespace-pre-wrap font-mono">
                        {analysisData.transcriptionPreview}
                        {analysisData.transcription.length > 500 && (
                          <span className="text-gray-400 italic">
                            {'\n\n[... ' + (analysisData.transcription.length - 500).toLocaleString() + ' more characters ...]'}
                          </span>
                        )}
                      </pre>
                    </div>
                  </div>

                  {/* Salesforce Context */}
                  <div className="bg-lean-almost-white rounded-lg p-4">
                    <h5 className="text-xs font-semibold text-lean-black-80 uppercase tracking-wide mb-3">
                      Salesforce Account Context
                    </h5>
                    <div className="bg-lean-white rounded border border-lean-black/20 p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {analysisData.salesforceContext.account_name && (
                          <div>
                            <span className="font-medium text-lean-black-70">Account:</span>
                            <span className="ml-2 text-lean-black">{analysisData.salesforceContext.account_name}</span>
                          </div>
                        )}
                        {analysisData.salesforceContext.account_tier && (
                          <div>
                            <span className="font-medium text-lean-black-70">Tier:</span>
                            <span className="ml-2 text-lean-black">{analysisData.salesforceContext.account_tier}</span>
                          </div>
                        )}
                        {analysisData.salesforceContext.contract_value && (
                          <div>
                            <span className="font-medium text-lean-black-70">Contract Value:</span>
                            <span className="ml-2 text-lean-black">{window.formatCurrency(analysisData.salesforceContext.contract_value)}</span>
                          </div>
                        )}
                        {analysisData.salesforceContext.industry && (
                          <div>
                            <span className="font-medium text-lean-black-70">Industry:</span>
                            <span className="ml-2 text-lean-black">{analysisData.salesforceContext.industry}</span>
                          </div>
                        )}
                        {analysisData.salesforceContext.annual_revenue && (
                          <div>
                            <span className="font-medium text-lean-black-70">Annual Revenue:</span>
                            <span className="ml-2 text-lean-black">
                              ${analysisData.salesforceContext.annual_revenue.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {analysisData.salesforceContext.account_manager && (
                          <div>
                            <span className="font-medium text-lean-black-70">Account Manager:</span>
                            <span className="ml-2 text-lean-black">{analysisData.salesforceContext.account_manager}</span>
                          </div>
                        )}
                        {analysisData.salesforceContext.total_cases_count !== undefined && (
                          <div>
                            <span className="font-medium text-lean-black-70">Support Cases:</span>
                            <span className="ml-2 text-lean-black">{analysisData.salesforceContext.total_cases_count}</span>
                          </div>
                        )}
                        {analysisData.salesforceContext.total_avoma_calls !== undefined && (
                          <div>
                            <span className="font-medium text-lean-black-70">Avoma Meetings:</span>
                            <span className="ml-2 text-lean-black">
                              {analysisData.salesforceContext.ready_avoma_calls || 0} ready / {analysisData.salesforceContext.total_avoma_calls} total
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Recent Tickets */}
                      {analysisData.salesforceContext.recent_tickets && 
                       analysisData.salesforceContext.recent_tickets.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-lean-black/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-lean-black-80">
                              Recent Support Cases ({analysisData.salesforceContext.recent_tickets.length})
                            </span>
                          </div>
                          <div className="space-y-2">
                            {analysisData.salesforceContext.recent_tickets.slice(0, 5).map((ticket, idx) => (
                              <div key={idx} className="text-xs bg-lean-almost-white rounded p-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-lean-black">{ticket.subject || 'No subject'}</span>
                                  <span className="text-lean-black-60">{ticket.status || 'Unknown'}</span>
                                </div>
                                {ticket.priority && (
                                  <div className="text-lean-black-70 mt-1">
                                    Priority: <span className="font-medium">{ticket.priority}</span>
                                    {ticket.created_date && (
                                      <span className="ml-2 text-lean-black-60">
                                        • {new Date(ticket.created_date).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                            {analysisData.salesforceContext.recent_tickets.length > 5 && (
                              <p className="text-xs text-lean-black-60 italic mt-2">
                                ... and {analysisData.salesforceContext.recent_tickets.length - 5} more case{analysisData.salesforceContext.recent_tickets.length - 5 !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Data Summary Stats */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-2">
                      Data Summary
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <div className="text-blue-600 font-medium">Transcription</div>
                        <div className="text-blue-900">{analysisData.transcription.length.toLocaleString()} chars</div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-medium">Account Fields</div>
                        <div className="text-blue-900">
                          {Object.keys(analysisData.salesforceContext).filter(k => 
                            !['recent_tickets', 'account_id'].includes(k) && 
                            analysisData.salesforceContext[k] !== null
                          ).length} provided
                        </div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-medium">Support Cases</div>
                        <div className="text-blue-900">
                          {analysisData.salesforceContext.recent_tickets?.length || 0} cases
                        </div>
                      </div>
                      <div>
                        <div className="text-blue-600 font-medium">Total Context</div>
                        <div className="text-blue-900">
                          {(
                            analysisData.transcription.length + 
                            JSON.stringify(analysisData.salesforceContext).length
                          ).toLocaleString()} chars
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        </div>
        </main>

        {/* Footer */}
        <footer className="bg-lean-black px-4 sm:px-6 lg:px-8 py-4 flex-shrink-0">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs text-[#f7f7f7] text-center">
              ✅ Sentiment analysis is securely handled via Vercel Serverless Function
            </p>
          </div>
        </footer>
      </div>
    );
  };

// Export to window
window.SentimentAnalyzer = SentimentAnalyzer;
