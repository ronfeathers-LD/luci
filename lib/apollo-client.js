/**
 * Apollo.io API Client
 * 
 * Provides functions to enrich contacts using Apollo.io's API
 * Documentation: https://docs.apollo.io/
 */

const { log, logError, isProduction } = require('./api-helpers');

const APOLLO_API_BASE = 'https://api.apollo.io/api/v1';

// Circuit breaker: track if Apollo is disabled due to credit/quota issues
let apolloDisabled = false;
let apolloDisabledReason = null;
let apolloDisabledAt = null;

/**
 * Check if Apollo API is disabled due to credit/quota issues
 */
function isApolloDisabled() {
  return apolloDisabled;
}

/**
 * Get the reason why Apollo is disabled
 */
function getApolloDisabledReason() {
  return apolloDisabledReason;
}

/**
 * Reset Apollo circuit breaker (call when credits are restored)
 */
function resetApolloCircuitBreaker() {
  apolloDisabled = false;
  apolloDisabledReason = null;
  apolloDisabledAt = null;
  log('Apollo circuit breaker reset - Apollo API re-enabled');
}

/**
 * Check if error indicates credit/quota exhaustion
 * @param {string} errorText - Error message or text to check
 * @param {number} [statusCode] - Optional HTTP status code
 * @returns {boolean} True if error indicates credit/quota issue
 */
function isCreditError(errorText, statusCode = null) {
  if (!errorText) return false;
  
  const lowerError = errorText.toLowerCase();
  
  // Check for credit-related keywords
  const creditKeywords = [
    'credit',
    'quota',
    'insufficient',
    'exceeded',
    'limit reached',
    'out of credits',
    'no credits',
    'credit limit',
    'subscription',
    'billing',
    'payment',
    'plan limit',
    'usage limit',
    'monthly limit',
    'daily limit',
    'credits/quota exhausted',
    'credits exhausted',
    'quota exhausted'
  ];
  
  const hasCreditKeyword = creditKeywords.some(keyword => lowerError.includes(keyword));
  
  // Check status codes that might indicate quota issues
  // 402 = Payment Required, 403 = Forbidden (sometimes used for quota)
  const quotaStatusCodes = [402, 403];
  const hasQuotaStatusCode = statusCode !== null && quotaStatusCodes.includes(statusCode);
  
  return hasCreditKeyword || hasQuotaStatusCode;
}

/**
 * Get Apollo.io configuration from Supabase
 */
async function getApolloConfig(supabase) {
  if (!supabase) {
    throw new Error('Supabase client is required');
  }

  const { data, error } = await supabase
    .from('apollo_configs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle(); // Use maybeSingle() instead of single() to handle no rows gracefully

  if (error) {
    logError('Error fetching Apollo.io config:', error);
    throw new Error(`Apollo.io configuration error: ${error.message}`);
  }

  if (!data) {
    throw new Error('Apollo.io configuration not found. Please configure Apollo.io API key in Supabase.');
  }

  if (!data.api_key) {
    throw new Error('Apollo.io API key is missing in configuration.');
  }

  return data;
}

/**
 * Make authenticated request to Apollo.io API
 * Apollo.io uses API key in X-Api-Key header
 */
async function apolloRequest(endpoint, apiKey, options = {}) {
  const url = `${APOLLO_API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey, // Apollo.io uses X-Api-Key header
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    
    // Check for credit/quota errors - disable Apollo if detected
    if (isCreditError(errorText, response.status)) {
      apolloDisabled = true;
      apolloDisabledReason = `Apollo.io credits/quota exhausted: ${response.status} ${response.statusText} - ${errorText}`;
      apolloDisabledAt = new Date().toISOString();
      
      logError(`Apollo.io CREDIT/QUOTA ERROR - DISABLING APOLLO API CALLS:`, { 
        status: response.status,
        statusText: response.statusText,
        endpoint, 
        url, 
        error: errorText,
        disabledAt: apolloDisabledAt
      });
      
      throw new Error(`Apollo.io credits/quota exhausted. Apollo API calls are now disabled. ${errorText}`);
    }
    
    // Handle rate limiting (429) specifically
    if (response.status === 429) {
      logError(`Apollo.io rate limit exceeded (429). Limit: 50 calls/minute.`, { 
        endpoint, 
        url, 
        error: errorText 
      });
      throw new Error(`Apollo.io API rate limit exceeded: 429 Too Many Requests - ${errorText}`);
    }
    
    logError(`Apollo.io API error: ${response.status} ${response.statusText}`, { 
      endpoint, 
      url, 
      error: errorText 
    });
    throw new Error(`Apollo.io API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Enrich a contact using Apollo.io's people/match endpoint
 * 
 * @param {Object} supabase - Supabase client
 * @param {Object} contact - Contact object with email, firstName, lastName, linkedinURL, etc.
 * @returns {Object} Enrichment result with profile data
 */
async function enrichContact(supabase, contact) {
  try {
    // Check circuit breaker - if Apollo is disabled due to credits, skip API call
    if (isApolloDisabled()) {
      log(`Apollo API is disabled due to credit/quota issues. Skipping enrichment for contact. Reason: ${getApolloDisabledReason()}`);
      return {
        success: false,
        error: `Apollo.io is disabled: ${getApolloDisabledReason()}`,
        creditsExhausted: true,
      };
    }
    
    const config = await getApolloConfig(supabase);
    
    if (!config || !config.api_key) {
      return {
        success: false,
        error: 'Apollo.io API key not configured',
      };
    }

    // Build match request - Apollo.io can match by email, LinkedIn URL, or name+company
    const matchData = {};
    
    if (contact.email) {
      matchData.email = contact.email;
    }
    
    if (contact.linkedinURL) {
      // Extract LinkedIn username from URL
      const linkedinMatch = contact.linkedinURL.match(/linkedin\.com\/in\/([^\/\?]+)/);
      if (linkedinMatch) {
        matchData.linkedin_url = contact.linkedinURL;
      }
    }
    
    if (contact.firstName && contact.lastName) {
      matchData.first_name = contact.firstName;
      matchData.last_name = contact.lastName;
    }
    
    if (contact.company || contact.accountName) {
      matchData.organization_name = contact.company || contact.accountName;
    }

    // If we don't have enough data to match, return error
    if (!matchData.email && !matchData.linkedin_url && (!matchData.first_name || !matchData.last_name)) {
      return {
        success: false,
        error: 'Insufficient data for Apollo.io matching. Need email, LinkedIn URL, or first name + last name + company',
      };
    }

    // Call Apollo.io people/match endpoint
    // Apollo.io API: POST /api/v1/people/match with X-Api-Key header
    // Rate limit: 50 calls/minute
    log('Attempting Apollo.io enrichment with data:', { 
      hasEmail: !!matchData.email,
      hasLinkedIn: !!matchData.linkedin_url,
      hasName: !!(matchData.first_name && matchData.last_name),
      hasCompany: !!matchData.organization_name
    });
    
    const response = await apolloRequest('/people/match', config.api_key, {
      method: 'POST',
      body: matchData,
    });

    if (!response || !response.person) {
      return {
        success: false,
        error: 'No matching person found in Apollo.io',
      };
    }

    const person = response.person;
    const organization = person.organization || person.organization_name ? 
      (typeof person.organization === 'string' ? { name: person.organization } : person.organization) : null;

    // Extract employment history
    const employmentHistory = person.employment_history || person.work_experiences || [];
    const previousCompanies = employmentHistory
      .filter(emp => !emp.current && emp.company_name)
      .map(emp => emp.company_name)
      .filter(Boolean);
    const previousTitles = employmentHistory
      .filter(emp => !emp.current && emp.title)
      .map(emp => emp.title)
      .filter(Boolean);

    // Extract education
    const education = person.education || person.educations || [];

    // Extract social profiles
    const socialProfiles = {
      twitter: person.twitter_url || person.twitter || null,
      github: person.github_url || person.github || null,
      facebook: person.facebook_url || person.facebook || null,
    };

    // Extract personal contact info
    const personalEmails = person.personal_emails || [];
    const personalPhones = person.personal_phone_numbers || 
      (person.phone_numbers ? person.phone_numbers.map(p => p.raw_number || p.number).filter(Boolean) : []);

    // Extract technologies (from organization)
    const technologies = organization?.technologies || 
                        organization?.technology_names || 
                        person.technologies || 
                        [];

    // Calculate job change metrics
    const jobChangeDate = person.job_change_date || 
                         (employmentHistory.find(emp => emp.current)?.start_date);
    const jobChangedRecently = jobChangeDate ? 
      (new Date() - new Date(jobChangeDate)) < (90 * 24 * 60 * 60 * 1000) : false;
    const daysInCurrentRole = jobChangeDate ? 
      Math.floor((new Date() - new Date(jobChangeDate)) / (24 * 60 * 60 * 1000)) : null;

    // Map Apollo.io response to our linkedin_profiles format
    const profileData = {
      contact_id: contact.id || null,
      salesforce_contact_id: contact.salesforce_id || contact.salesforceContactId || null,
      linkedin_url: person.linkedin_url || contact.linkedinURL || null,
      linkedin_urn: person.linkedin_urn || null,
      first_name: person.first_name || contact.firstName || null,
      last_name: person.last_name || contact.lastName || null,
      headline: person.headline || person.title || null,
      current_title: person.title || person.headline || null,
      current_company: person.organization_name || organization?.name || person.company_name || contact.company || null,
      location: person.city || person.state || person.country ? 
        [person.city, person.state, person.country].filter(Boolean).join(', ') : null,
      profile_picture_url: person.profile_picture_url || null,
      // Contact Verification
      email_status: person.email_status || (person.email_verified ? 'verified' : 'unverified') || null,
      phone_status: person.phone_status || (person.phone_verified ? 'verified' : 'unverified') || null,
      email_verified: person.email_verified || person.email_status === 'verified' || false,
      phone_verified: person.phone_verified || person.phone_status === 'verified' || false,
      // Company Intelligence
      company_industry: organization?.industry || organization?.industry_tag || null,
      company_size: organization?.estimated_num_employees || organization?.employees || organization?.num_employees || null,
      company_revenue: organization?.annual_revenue || organization?.revenue || null,
      company_website_url: organization?.website_url || null,
      company_linkedin_url: organization?.linkedin_url || null,
      company_twitter_url: organization?.twitter_url || null,
      company_facebook_url: organization?.facebook_url || null,
      // Technographic Data
      company_technologies: Array.isArray(technologies) ? technologies : (technologies ? [technologies] : []),
      // Employment History
      previous_companies: previousCompanies,
      previous_titles: previousTitles,
      employment_history: employmentHistory.length > 0 ? employmentHistory : null,
      // Education
      education: education.length > 0 ? education : null,
      // Social Profiles
      twitter_url: socialProfiles.twitter,
      github_url: socialProfiles.github,
      facebook_url: socialProfiles.facebook,
      personal_emails: personalEmails.length > 0 ? personalEmails : null,
      personal_phone_numbers: personalPhones.length > 0 ? personalPhones : null,
      // Skills & Interests
      skills: person.skills || person.skill_list || [],
      interests: person.interests || [],
      languages: person.languages || person.language_list || [],
      // Buying Intent & Signals
      job_change_likelihood: person.job_change_likelihood || person.job_change_score || null,
      buying_signals: person.buying_signals || person.intent_signals || null,
      technology_adoptions: person.technology_adoptions || null,
      hiring_signals: person.hiring_signals || null,
      // Engagement Metrics
      email_open_rate: person.email_open_rate || null,
      email_click_rate: person.email_click_rate || null,
      response_rate: person.response_rate || null,
      last_contacted: person.last_contacted ? new Date(person.last_contacted).toISOString() : null,
      last_engaged: person.last_engaged ? new Date(person.last_engaged).toISOString() : null,
      // Job Change Metrics
      job_changed_recently: jobChangedRecently,
      days_in_current_role: daysInCurrentRole,
      // Store raw Apollo data for reference and future use
      apollo_raw_data: person,
      last_synced_at: new Date().toISOString(),
    };

    return {
      success: true,
      profile: profileData,
      source: 'apollo',
      raw_data: person, // Store raw Apollo data for reference
    };
  } catch (error) {
    logError('Error enriching contact with Apollo.io:', error);
    
    // Check if this was a credit error (already handled in apolloRequest, but check message)
    if (error.message && isCreditError(error.message)) {
      return {
        success: false,
        error: error.message,
        creditsExhausted: true,
      };
    }
    
    return {
      success: false,
      error: error.message || 'Apollo.io enrichment failed',
    };
  }
}

/**
 * Bulk enrich multiple contacts using individual API calls with rate limiting
 * Apollo.io doesn't have a bulk endpoint, so we call /people/match individually
 * Rate limit: 50 calls/minute, so we add delays between calls
 * 
 * @param {Object} supabase - Supabase client
 * @param {Array} contacts - Array of contact objects
 * @returns {Array} Array of enrichment results
 */
async function bulkEnrichContacts(supabase, contacts) {
  try {
    // Check circuit breaker - if Apollo is disabled due to credits, skip all API calls
    if (isApolloDisabled()) {
      log(`Apollo API is disabled due to credit/quota issues. Skipping bulk enrichment for ${contacts.length} contacts. Reason: ${getApolloDisabledReason()}`);
      return contacts.map(contact => ({
        contact,
        success: false,
        error: `Apollo.io is disabled: ${getApolloDisabledReason()}`,
        creditsExhausted: true,
      }));
    }
    
    const config = await getApolloConfig(supabase);
    
    if (!config || !config.api_key) {
      return contacts.map(contact => ({
        contact,
        success: false,
        error: 'Apollo.io API key not configured',
      }));
    }

    // Apollo.io doesn't have a bulk endpoint, so we need to call individually
    // Rate limit: 50 calls/minute = ~1.2 seconds per call
    // We'll process with 1.5 second delays to be safe (40 calls/minute)
    const DELAY_MS = 1500; // 1.5 seconds between calls
    const results = [];

    log(`Enriching ${contacts.length} contacts individually (Apollo.io has no bulk endpoint)`);

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      
      // Check if Apollo was disabled during bulk processing (stop early if credits exhausted)
      if (isApolloDisabled()) {
        log(`Apollo API was disabled during bulk enrichment. Stopping early at contact ${i + 1}/${contacts.length}.`);
        // Mark remaining contacts as skipped due to credits
        for (let j = i; j < contacts.length; j++) {
          results.push({
            contact: contacts[j],
            success: false,
            error: `Apollo.io is disabled: ${getApolloDisabledReason()}`,
            creditsExhausted: true,
            profile: null,
          });
        }
        break; // Exit the loop early
      }
      
      try {
        // Use the individual enrichContact function
        const result = await enrichContact(supabase, {
          id: contact.id || contact.contactId || null,
          salesforce_id: contact.salesforce_id || contact.salesforceContactId || null,
          email: contact.email || contact.email_address || null,
          firstName: contact.firstName || contact.first_name || null,
          lastName: contact.lastName || contact.last_name || null,
          linkedinURL: contact.linkedinURL || contact.linkedin_url || null,
          company: contact.company || contact.accountName || contact.account_name || null,
          accountName: contact.accountName || contact.account_name || null,
        });

        // If enrichment failed due to credits, mark all remaining as failed and exit
        if (result.creditsExhausted || (result.error && isCreditError(result.error))) {
          log(`Credits exhausted during bulk enrichment. Stopping early at contact ${i + 1}/${contacts.length}.`);
          results.push({
            contact,
            success: false,
            error: result.error || 'Apollo.io credits exhausted',
            creditsExhausted: true,
            profile: null,
          });
          // Mark remaining contacts as skipped due to credits
          for (let j = i + 1; j < contacts.length; j++) {
            results.push({
              contact: contacts[j],
              success: false,
              error: result.error || 'Apollo.io credits exhausted',
              creditsExhausted: true,
              profile: null,
            });
          }
          break; // Exit the loop early
        }

        if (result.success && result.profile) {
          results.push({
            contact,
            success: true,
            profile: result.profile,
            source: 'apollo',
          });
        } else {
          results.push({
            contact,
            success: false,
            error: result.error || 'No match found',
            profile: null,
          });
        }
      } catch (error) {
        logError(`Error enriching contact ${i + 1}/${contacts.length}:`, error);
        
        // Check if this was a credit error - stop bulk processing
        if (error.message && isCreditError(error.message)) {
          log(`Credits exhausted during bulk enrichment. Stopping early at contact ${i + 1}/${contacts.length}.`);
          results.push({
            contact,
            success: false,
            error: error.message || 'Apollo.io credits exhausted',
            creditsExhausted: true,
            profile: null,
          });
          // Mark remaining contacts as skipped due to credits
          for (let j = i + 1; j < contacts.length; j++) {
            results.push({
              contact: contacts[j],
              success: false,
              error: error.message || 'Apollo.io credits exhausted',
              creditsExhausted: true,
              profile: null,
            });
          }
          break; // Exit the loop early
        }
        
        results.push({
          contact,
          success: false,
          error: error.message || 'Enrichment failed',
          profile: null,
        });
      }

      // Add delay between calls to respect rate limits (except for the last one)
      // Only delay if Apollo is still enabled
      if (i < contacts.length - 1 && !isApolloDisabled()) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    }

    log(`Completed enrichment: ${results.filter(r => r.success).length} succeeded, ${results.filter(r => !r.success).length} failed`);
    return results;
  } catch (error) {
    logError('Error bulk enriching contacts with Apollo.io:', error);
    return contacts.map(contact => ({
      contact,
      success: false,
      error: error.message || 'Apollo.io bulk enrichment failed',
    }));
  }
}

module.exports = {
  getApolloConfig,
  apolloRequest,
  enrichContact,
  bulkEnrichContacts,
  isApolloDisabled,
  getApolloDisabledReason,
  resetApolloCircuitBreaker,
};

