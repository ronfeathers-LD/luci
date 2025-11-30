// Account Data Management Page Component
// Displays Contacts, Cases, and Avoma calls for a specific account with ability to re-fetch
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../shared/Header';
import { LoaderIcon } from '../shared/Icons';
import { deduplicatedFetch, logError } from '../../lib/client-utils';
import AccountChatBot from './AccountChatBot';

const AccountDataPage = ({ user, onSignOut, accountId }) => {
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [cases, setCases] = useState([]);
  const [transcriptions, setTranscriptions] = useState([]);
  const [sentimentAnalyses, setSentimentAnalyses] = useState([]);
  const [contactsLastSynced, setContactsLastSynced] = useState(null);
  const [casesLastSynced, setCasesLastSynced] = useState(null);
  const [transcriptionsLastSynced, setTranscriptionsLastSynced] = useState(null);
  const [sentimentLastAnalyzed, setSentimentLastAnalyzed] = useState(null);
  const [activeTab, setActiveTab] = useState('contacts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Loading states for each section
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingCases, setLoadingCases] = useState(false);
  const [loadingTranscriptions, setLoadingTranscriptions] = useState(false);
  const [loadingSentiment, setLoadingSentiment] = useState(false);
  
  // Refreshing states
  const [refreshingContacts, setRefreshingContacts] = useState(false);
  const [refreshingCases, setRefreshingCases] = useState(false);
  const [refreshingTranscriptions, setRefreshingTranscriptions] = useState(false);
  const [runningAnalysis, setRunningAnalysis] = useState(false);

  // Fetch account details
  const fetchAccount = useCallback(async () => {
    if (!accountId) return;

    try {
      const params = new URLSearchParams({
        userId: user?.id || '',
        email: user?.email || '',
        role: user?.role || '',
      });

      const response = await deduplicatedFetch(`/api/salesforce-accounts?${params}`);
      
      // Clone response immediately to avoid "body stream already read" error
      // (deduplicatedFetch can return the same response to multiple callers)
      const responseClone = response.clone();
      
      // Read response once - check status first to handle errors properly
      if (!response.ok) {
        const errorText = await responseClone.text().catch(() => 'Failed to fetch account');
        throw new Error(errorText || 'Failed to fetch account');
      }
      
      const data = await responseClone.json();
      const foundAccount = (data.accounts || []).find(
        acc => (acc.salesforceId || acc.id) === accountId || (acc.salesforce_id || acc.id) === accountId
      );
      
      if (foundAccount) {
        setAccount(foundAccount);
      } else {
        setError('Account not found');
      }
    } catch (err) {
      logError('Error fetching account:', err);
      setError(err.message || 'Failed to load account');
    }
  }, [accountId, user]);

  // Fetch contacts for the account
  const fetchContacts = useCallback(async (forceRefresh = false) => {
    if (!account || !account.salesforceId) return;

    try {
      setLoadingContacts(true);
      setError(null);

      const params = new URLSearchParams({
        salesforceAccountId: account.salesforceId,
        accountId: account.id,
        forceRefresh: forceRefresh ? 'true' : 'false',
      });

      const response = await deduplicatedFetch(`/api/salesforce-contacts?${params}`);
      const responseClone = response.clone();
      
      if (!response.ok) {
        const errorData = await responseClone.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to fetch contacts');
      }
      
      const data = await responseClone.json();
      setContacts(data.contacts || []);
      setContactsLastSynced(data.lastSyncedAt || null);
    } catch (err) {
      logError('Error fetching contacts:', err);
      setError(err.message || 'Failed to load contacts');
    } finally {
      setLoadingContacts(false);
    }
  }, [account]);

  // Fetch cases for the account
  const fetchCases = useCallback(async (forceRefresh = false) => {
    if (!account || !account.salesforceId) return;

    try {
      setLoadingCases(true);
      setError(null);

      const params = new URLSearchParams({
        salesforceAccountId: account.salesforceId,
        accountId: account.id,
        forceRefresh: forceRefresh ? 'true' : 'false',
      });

      const response = await deduplicatedFetch(`/api/salesforce-cases?${params}`);
      const responseClone = response.clone();
      
      if (!response.ok) {
        const errorData = await responseClone.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to fetch cases');
      }
      
      const data = await responseClone.json();
      setCases(data.cases || []);
      setCasesLastSynced(data.lastSyncedAt || null);
    } catch (err) {
      logError('Error fetching cases:', err);
      setError(err.message || 'Failed to load cases');
    } finally {
      setLoadingCases(false);
    }
  }, [account]);

  // Fetch sentiment analyses for the account
  const fetchSentimentAnalyses = useCallback(async () => {
    if (!account || !account.salesforceId) return;

    try {
      setLoadingSentiment(true);
      setError(null);

      const params = new URLSearchParams({
        salesforceAccountId: account.salesforceId,
        accountId: account.id,
        limit: '100', // Get up to 100 analyses
      });

      const response = await deduplicatedFetch(`/api/sentiment-analysis?${params}`);
      const responseClone = response.clone();
      
      if (!response.ok) {
        const errorData = await responseClone.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to fetch sentiment analyses');
      }
      
      const data = await responseClone.json();
      const history = data.history || [];
      setSentimentAnalyses(history);
      
      // Get the most recent analyzed_at timestamp
      if (history.length > 0) {
        setSentimentLastAnalyzed(history[0].analyzed_at);
      }
    } catch (err) {
      logError('Error fetching sentiment analyses:', err);
      setError(err.message || 'Failed to load sentiment analyses');
    } finally {
      setLoadingSentiment(false);
    }
  }, [account]);

  // Trigger a new sentiment analysis
  const triggerNewAnalysis = useCallback(async () => {
    if (!account || !account.salesforceId || !user?.id) return;

    try {
      setRunningAnalysis(true);
      setError(null);

      // Get the latest transcription if available
      let transcription = '';
      if (transcriptions.length > 0 && transcriptions[0].transcription) {
        transcription = transcriptions[0].transcription;
      } else {
        // Try to fetch the latest transcription
        try {
          const avomaParams = {
            salesforceAccountId: account.salesforceId,
            customerIdentifier: account.name || '',
            forceRefresh: 'false',
          };
          const avomaResponse = await deduplicatedFetch('/api/avoma-transcription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(avomaParams),
          });
          if (avomaResponse.ok) {
            const avomaData = await avomaResponse.json();
            transcription = avomaData.transcription || '';
          }
        } catch (err) {
          logError('Could not fetch transcription for analysis:', err);
          // Continue without transcription
        }
      }

      // Build salesforce context from available data
      const salesforceContext = {
        account_name: account.name,
        account_tier: account.accountTier || null,
        contract_value: account.contractValue || null,
        industry: account.industry || null,
        annual_revenue: account.annualRevenue || null,
        account_manager: account.ownerName || null,
        recent_tickets: cases.map(c => ({
          case_number: c.caseNumber,
          subject: c.subject,
          status: c.status,
          priority: c.priority,
          created_date: c.createdDate,
        })),
        total_cases_count: cases.length,
        total_contacts: contacts.length,
        contacts: contacts.map(c => ({
          name: c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim(),
          email: c.email,
          title: c.title,
          contact_status: c.contactStatus,
        })),
      };

      // Call analyze-sentiment API
      const response = await deduplicatedFetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription,
          salesforceContext,
          userId: user.id,
          accountId: account.id,
          salesforceAccountId: account.salesforceId,
          customerIdentifier: account.name || '',
          forceRefresh: true, // Force a new analysis
        }),
      });

      const responseClone = response.clone();
      
      if (!response.ok) {
        const errorData = await responseClone.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to run sentiment analysis');
      }

      const result = await responseClone.json();
      
      // Wait a moment for the analysis to be saved, then refresh the list
      setTimeout(() => {
        fetchSentimentAnalyses();
      }, 1000);

      // Analysis completed successfully
    } catch (err) {
      logError('Error running sentiment analysis:', err);
      setError(err.message || 'Failed to run sentiment analysis. Please try again.');
    } finally {
      setRunningAnalysis(false);
    }
  }, [account, user, transcriptions, cases, contacts, fetchSentimentAnalyses]);

  // Fetch Avoma transcriptions for the account
  const fetchTranscriptions = useCallback(async (forceRefresh = false) => {
    if (!account || !account.salesforceId) return;

    try {
      setLoadingTranscriptions(true);
      setError(null);

      // First, get all cached transcriptions from the database
      const params = new URLSearchParams({
        salesforceAccountId: account.salesforceId,
        accountId: account.id,
      });

      const cachedResponse = await deduplicatedFetch(`/api/avoma-transcription?source=cache&${params}`);
      
      if (cachedResponse.ok) {
        const cachedData = await cachedResponse.json();
        setTranscriptions(cachedData.transcriptions || []);
        // Get the most recent last_synced_at from transcriptions
        if (cachedData.transcriptions && cachedData.transcriptions.length > 0) {
          const mostRecent = cachedData.transcriptions.reduce((latest, current) => {
            const currentDate = current.last_synced_at ? new Date(current.last_synced_at) : new Date(0);
            const latestDate = latest ? new Date(latest) : new Date(0);
            return currentDate > latestDate ? current.last_synced_at : latest;
          }, null);
          setTranscriptionsLastSynced(mostRecent);
        }
      }

      // If force refresh, also fetch from Avoma API to update cache
      if (forceRefresh) {
        const avomaParams = {
          salesforceAccountId: account.salesforceId,
          customerIdentifier: account.name || '',
          forceRefresh: 'true',
        };

        const avomaResponse = await (window.deduplicatedFetch || fetch)('/api/avoma-transcription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(avomaParams),
        });
        
        if (avomaResponse.ok) {
          const avomaData = await avomaResponse.json();
          
          // Bulk sync completed (avomaData.synced contains count if bulk sync was performed)
          
          // Refresh the cached list after fetching from Avoma
          const refreshParams = new URLSearchParams({
            salesforceAccountId: account.salesforceId,
            accountId: account.id,
          });
          const refreshResponse = await deduplicatedFetch(`/api/avoma-transcription?source=cache&${refreshParams}`);
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            setTranscriptions(refreshData.transcriptions || []);
            // Update last synced timestamp
            if (refreshData.transcriptions && refreshData.transcriptions.length > 0) {
              const mostRecent = refreshData.transcriptions.reduce((latest, current) => {
                const currentDate = current.last_synced_at ? new Date(current.last_synced_at) : new Date(0);
                const latestDate = latest ? new Date(latest) : new Date(0);
                return currentDate > latestDate ? current.last_synced_at : latest;
              }, null);
              setTranscriptionsLastSynced(mostRecent);
            } else {
              // If no transcriptions after sync, update timestamp to now
              setTranscriptionsLastSynced(new Date().toISOString());
            }
          }
        } else {
          const errorData = await avomaResponse.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || 'Failed to sync Avoma transcriptions');
        }
      }
    } catch (err) {
      logError('Error fetching transcriptions:', err);
      setError(err.message || 'Failed to load transcriptions');
      // Don't clear transcriptions if we have cached data
    } finally {
      setLoadingTranscriptions(false);
    }
  }, [account]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAccount();
      setLoading(false);
    };
    loadData();
  }, [fetchAccount]);

  // Load data when account is available
  useEffect(() => {
    if (account) {
      fetchContacts(false);
      fetchCases(false);
      fetchTranscriptions(false);
      fetchSentimentAnalyses();
    }
  }, [account, fetchContacts, fetchCases, fetchTranscriptions, fetchSentimentAnalyses]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Format relative time helper
  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return formatDate(dateString);
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-lean-almost-white flex items-center justify-center">
        <div className="text-center">
          <LoaderIcon className="w-8 h-8 animate-spin text-lean-green mx-auto mb-4" />
          <p className="text-lean-black-70">Loading account data...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-lean-almost-white flex flex-col">
        <Header user={user} onSignOut={onSignOut} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                {error || 'Account not found'}
              </p>
            </div>
            <button
              onClick={() => {
                router.push('/user');
              }}
              className="mt-4 px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
            >
              Back to My Accounts
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lean-almost-white flex flex-col">
      {/* Global Header */}
      <Header user={user} onSignOut={onSignOut} />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <button
              onClick={() => {
                router.push('/user');
              }}
              className="text-lean-green hover:text-lean-green/80 mb-4 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to My Accounts
            </button>
            <h1 className="typography-heading text-lean-black mb-2">{account.name}</h1>
            <p className="text-sm text-lean-black-70">Manage data for this account</p>
            {account.salesforceId && (
              <p className="text-xs text-lean-black-60 mt-1">Salesforce ID: {account.salesforceId}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Contacts Card */}
            <div className="bg-lean-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-lean-black">Contacts</h3>
                <div className="text-2xl font-bold text-lean-green">{contacts.length}</div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-lean-black-70">
                  {contactsLastSynced ? (
                    <>Last synced: {formatRelativeTime(contactsLastSynced)}</>
                  ) : (
                    <>Never synced</>
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  setRefreshingContacts(true);
                  fetchContacts(true).finally(() => setRefreshingContacts(false));
                }}
                disabled={refreshingContacts || loadingContacts}
                className="w-full px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {refreshingContacts || loadingContacts ? (
                  <>
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Re-sync
                  </>
                )}
              </button>
            </div>

            {/* Cases Card */}
            <div className="bg-lean-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-lean-black">Cases</h3>
                <div className="text-2xl font-bold text-lean-green">{cases.length}</div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-lean-black-70">
                  {casesLastSynced ? (
                    <>Last synced: {formatRelativeTime(casesLastSynced)}</>
                  ) : (
                    <>Never synced</>
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  setRefreshingCases(true);
                  fetchCases(true).finally(() => setRefreshingCases(false));
                }}
                disabled={refreshingCases || loadingCases}
                className="w-full px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {refreshingCases || loadingCases ? (
                  <>
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Re-sync
                  </>
                )}
              </button>
            </div>

            {/* Avoma Calls Card */}
            <div className="bg-lean-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-lean-black">Avoma Calls</h3>
                <div className="text-2xl font-bold text-lean-green">{transcriptions.length}</div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-lean-black-70">
                  {transcriptionsLastSynced ? (
                    <>Last synced: {formatRelativeTime(transcriptionsLastSynced)}</>
                  ) : (
                    <>Never synced</>
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  setRefreshingTranscriptions(true);
                  fetchTranscriptions(true).finally(() => setRefreshingTranscriptions(false));
                }}
                disabled={refreshingTranscriptions || loadingTranscriptions}
                className="w-full px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {refreshingTranscriptions || loadingTranscriptions ? (
                  <>
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Re-sync
                  </>
                )}
              </button>
            </div>

            {/* Sentiment Analyses Card */}
            <div className="bg-lean-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-lean-black">Sentiment Analyses</h3>
                <div className="text-2xl font-bold text-lean-green">{sentimentAnalyses.length}</div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-lean-black-70">
                  {sentimentLastAnalyzed ? (
                    <>Last analyzed: {formatRelativeTime(sentimentLastAnalyzed)}</>
                  ) : (
                    <>No analyses yet</>
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  triggerNewAnalysis();
                }}
                disabled={runningAnalysis || loadingSentiment}
                className="w-full px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {runningAnalysis ? (
                  <>
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Run New Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-lean-white rounded-lg shadow-lg">
            {/* Tab Headers */}
            <div className="border-b border-lean-black/20 flex">
              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                  activeTab === 'contacts'
                    ? 'text-lean-green border-lean-green'
                    : 'text-lean-black-70 border-transparent hover:text-lean-black hover:border-lean-black/30'
                }`}
              >
                Contacts ({contacts.length})
              </button>
              <button
                onClick={() => setActiveTab('cases')}
                className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                  activeTab === 'cases'
                    ? 'text-lean-green border-lean-green'
                    : 'text-lean-black-70 border-transparent hover:text-lean-black hover:border-lean-black/30'
                }`}
              >
                Cases ({cases.length})
              </button>
              <button
                onClick={() => setActiveTab('avoma')}
                className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                  activeTab === 'avoma'
                    ? 'text-lean-green border-lean-green'
                    : 'text-lean-black-70 border-transparent hover:text-lean-black hover:border-lean-black/30'
                }`}
              >
                Avoma Calls ({transcriptions.length})
              </button>
              <button
                onClick={() => setActiveTab('sentiment')}
                className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                  activeTab === 'sentiment'
                    ? 'text-lean-green border-lean-green'
                    : 'text-lean-black-70 border-transparent hover:text-lean-black hover:border-lean-black/30'
                }`}
              >
                Sentiment Analyses ({sentimentAnalyses.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Contacts Tab */}
              {activeTab === 'contacts' && (
                <div>
                  {loadingContacts && !refreshingContacts ? (
                    <div className="flex items-center justify-center py-8">
                      <LoaderIcon className="w-6 h-6 animate-spin text-lean-green" />
                      <span className="ml-3 text-lean-black-70">Loading contacts...</span>
                    </div>
                  ) : contacts.length === 0 ? (
                    <div className="text-center py-8 text-lean-black-70">
                      <p>No contacts found for this account.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-lean-black/20">
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Email</th>
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Title</th>
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Phone</th>
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-lean-black/10">
                          {contacts.map((contact) => (
                            <tr key={contact.id} className="hover:bg-lean-almost-white transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-medium text-lean-black">
                                  {contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'N/A'}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-lean-black-70">{contact.email || 'N/A'}</td>
                              <td className="py-3 px-4 text-lean-black-70">{contact.title || 'N/A'}</td>
                              <td className="py-3 px-4 text-lean-black-70">{contact.phone || contact.mobilePhone || 'N/A'}</td>
                              <td className="py-3 px-4 text-lean-black-70">{contact.contactStatus || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Cases Tab */}
              {activeTab === 'cases' && (
                <div>
                  {loadingCases && !refreshingCases ? (
                    <div className="flex items-center justify-center py-8">
                      <LoaderIcon className="w-6 h-6 animate-spin text-lean-green" />
                      <span className="ml-3 text-lean-black-70">Loading cases...</span>
                    </div>
                  ) : cases.length === 0 ? (
                    <div className="text-center py-8 text-lean-black-70">
                      <p>No cases found for this account.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-lean-black/20">
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Case Number</th>
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Subject</th>
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Priority</th>
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Created</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-lean-black/10">
                          {cases.map((caseItem) => (
                            <tr key={caseItem.id} className="hover:bg-lean-almost-white transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-medium text-lean-black">{caseItem.caseNumber || 'N/A'}</div>
                              </td>
                              <td className="py-3 px-4 text-lean-black-70">{caseItem.subject || 'N/A'}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  caseItem.status === 'Closed' ? 'bg-green-100 text-green-800' :
                                  caseItem.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {caseItem.status || 'N/A'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-lean-black-70">{caseItem.priority || 'N/A'}</td>
                              <td className="py-3 px-4 text-lean-black-70 text-sm">{formatDate(caseItem.createdDate)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Avoma Calls Tab */}
              {activeTab === 'avoma' && (
                <div>
                  {loadingTranscriptions && !refreshingTranscriptions ? (
                    <div className="flex items-center justify-center py-8">
                      <LoaderIcon className="w-6 h-6 animate-spin text-lean-green" />
                      <span className="ml-3 text-lean-black-70">Loading Avoma calls...</span>
                    </div>
                  ) : transcriptions.length === 0 ? (
                    <div className="text-center py-8 text-lean-black-70">
                      <p>No Avoma calls found for this account.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transcriptions.map((transcription, index) => (
                        <div key={index} className="border border-lean-black/20 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lean-black">
                                {transcription.meeting?.subject || 'Untitled Meeting'}
                              </h3>
                              {transcription.meeting?.meeting_date && (
                                <p className="text-sm text-lean-black-70 mt-1">
                                  {formatDate(transcription.meeting.meeting_date)}
                                </p>
                              )}
                              {transcription.meeting?.duration && (
                                <p className="text-xs text-lean-black-60 mt-1">
                                  Duration: {Math.floor(transcription.meeting.duration / 60)} minutes
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-lean-black-60">
                                {transcription.cached ? 'Cached' : 'Fresh'}
                              </p>
                              {transcription.last_synced_at && (
                                <p className="text-xs text-lean-black-60 mt-1">
                                  {formatRelativeTime(transcription.last_synced_at)}
                                </p>
                              )}
                            </div>
                          </div>
                          {transcription.meeting?.url && (
                            <a
                              href={transcription.meeting.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-lean-green hover:text-lean-green/80 inline-flex items-center gap-1"
                            >
                              View in Avoma
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                          {transcription.transcription && (
                            <div className="mt-3">
                              <p className="text-xs text-lean-black-60 mb-1">Transcript preview:</p>
                              <p className="text-sm text-lean-black-70 line-clamp-3">
                                {transcription.transcription.substring(0, 200)}...
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sentiment Analyses Tab */}
              {activeTab === 'sentiment' && (
                <div>
                  {loadingSentiment ? (
                    <div className="flex items-center justify-center py-8">
                      <LoaderIcon className="w-6 h-6 animate-spin text-lean-green" />
                      <span className="ml-3 text-lean-black-70">Loading sentiment analyses...</span>
                    </div>
                  ) : sentimentAnalyses.length === 0 ? (
                    <div className="text-center py-8 text-lean-black-70">
                      <p>No sentiment analyses found for this account.</p>
                      <p className="text-sm mt-2">Run a sentiment analysis from the dashboard to see results here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-lean-black/20">
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Date</th>
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Score</th>
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Summary</th>
                            <th className="text-left py-3 px-4 font-semibold text-lean-black">Data Sources</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-lean-black/10">
                          {sentimentAnalyses.map((analysis) => (
                            <tr key={analysis.id} className="hover:bg-lean-almost-white transition-colors">
                              <td className="py-3 px-4 text-lean-black-70 text-sm">
                                {formatDate(analysis.analyzed_at)}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className={`text-2xl font-bold ${
                                    analysis.score >= 8 ? 'text-green-600' :
                                    analysis.score >= 5 ? 'text-yellow-600' :
                                    'text-red-600'
                                  }`}>
                                    {analysis.score}
                                  </span>
                                  <span className="text-xs text-lean-black-60">/ 10</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => {
                                    router.push(`/sentiment/${analysis.id}`);
                                  }}
                                  className="text-left text-sm text-lean-black-70 hover:text-lean-green hover:underline line-clamp-2 transition-colors"
                                >
                                  {analysis.summary || 'No summary available'}
                                </button>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1 text-xs">
                                  {analysis.has_transcription && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                      Transcription
                                    </span>
                                  )}
                                  {analysis.cases_count > 0 && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                                      {analysis.cases_count} Case{analysis.cases_count > 1 ? 's' : ''}
                                    </span>
                                  )}
                                  {analysis.avoma_calls_ready > 0 && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                                      {analysis.avoma_calls_ready} Call{analysis.avoma_calls_ready > 1 ? 's' : ''}
                                    </span>
                                  )}
                                  {!analysis.has_transcription && analysis.cases_count === 0 && analysis.avoma_calls_ready === 0 && (
                                    <span className="text-lean-black-60">No data sources</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Account ChatBot */}
      {account && user && account.id && (
        <AccountChatBot
          accountId={account.id}
          userId={user.id}
          accountName={account.name}
          salesforceAccountId={account.salesforceId}
          user={user}
        />
      )}
    </div>
  );
};

export default AccountDataPage;
