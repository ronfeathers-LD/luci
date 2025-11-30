// Dashboard Component
// Shows overview of accounts, recent analyses, and upcoming meetings
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from './shared/Header';
import { deduplicatedFetch, logError } from '../lib/client-utils';

// Loader Icon Component
const LoaderIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Dashboard = ({ user, onSignOut }) => {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calendarConnected, setCalendarConnected] = useState(false);
  
  // Refs to prevent duplicate API calls during React Strict Mode double-renders
  const accountsFetchingRef = useRef(false);
  const accountsFetchedRef = useRef(false);

  // Fetch user's accounts
  const fetchAccounts = useCallback(async () => {
    if (!user?.id && !user?.email) return;
    
    // Prevent duplicate calls
    if (accountsFetchingRef.current) {
      return;
    }
    
    accountsFetchingRef.current = true;

    try {
      const params = new URLSearchParams({
        userId: user.id || '',
        email: user.email || '',
        role: user.role || '',
        cacheOnly: 'true',
      });

      const response = await deduplicatedFetch(`/api/salesforce-accounts?${params}`);
      const responseClone = response.clone();
      
      if (response.ok) {
        const data = await responseClone.json();
        setAccounts(data.accounts || []);
        accountsFetchedRef.current = true;
      }
    } catch (err) {
      logError('Error fetching accounts:', err);
    } finally {
      // Reset fetching flag after a short delay to allow for legitimate re-fetches
      setTimeout(() => {
        accountsFetchingRef.current = false;
      }, 1000);
    }
  }, [user]);

  // Fetch recent sentiment analyses for user's accounts
  const fetchRecentAnalyses = useCallback(async () => {
    if (!accounts.length) return;

    try {
      // Fetch analyses for each account (limit to most recent 3 per account)
      const analysisPromises = accounts.slice(0, 10).map(async (account) => {
        const accountId = account.salesforceId || account.id;
        const params = new URLSearchParams({
          accountId: account.id,
          salesforceAccountId: accountId,
          limit: '3',
          days: '30',
        });

        const response = await deduplicatedFetch(`/api/sentiment-analysis?${params}`);
        const responseClone = response.clone();
        
        if (response.ok) {
          const data = await responseClone.json();
          return (data.history || []).map(analysis => ({
            ...analysis,
            accountName: account.name,
            accountId: account.salesforceId || account.id,
          }));
        }
        return [];
      });

      const allAnalyses = await Promise.all(analysisPromises);
      const flattened = allAnalyses.flat().sort((a, b) => 
        new Date(b.analyzed_at) - new Date(a.analyzed_at)
      );
      setRecentAnalyses(flattened.slice(0, 10)); // Top 10 most recent
    } catch (err) {
      logError('Error fetching recent analyses:', err);
    }
  }, [accounts]);

  // Check calendar connection status
  const checkCalendarStatus = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await deduplicatedFetch(`/api/google-calendar?userId=${user.id}&action=status`);
      const responseClone = response.clone();
      
      if (response.ok) {
        const data = await responseClone.json();
        setCalendarConnected(data.connected === true);
        
        // If connected, fetch upcoming meetings
        if (data.connected) {
          const meetingsResponse = await deduplicatedFetch(`/api/google-calendar?userId=${user.id}&action=events&days=7`);
          const meetingsResponseClone = meetingsResponse.clone();
          
          if (meetingsResponse.ok) {
            const meetingsData = await meetingsResponseClone.json();
            const events = meetingsData.events || [];
            // Filter to only show meetings with matched accounts
            const matchedEvents = events.filter(({ matchedAccounts }) => 
              matchedAccounts && matchedAccounts.length > 0
            );
            setUpcomingMeetings(matchedEvents.slice(0, 5)); // Top 5 upcoming
          }
        }
      }
    } catch (err) {
      logError('Error checking calendar status:', err);
    }
  }, [user]);

  // Load all data - only fetch accounts once on mount or when user changes
  useEffect(() => {
    // Skip if already fetched or currently fetching
    if (accountsFetchedRef.current || accountsFetchingRef.current) {
      return;
    }
    
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await fetchAccounts();
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Reset fetched flag when user changes
    return () => {
      accountsFetchedRef.current = false;
    };
  }, [user?.id, user?.email, fetchAccounts]);

  // Fetch analyses and calendar when accounts are loaded
  useEffect(() => {
    if (accounts.length > 0) {
      fetchRecentAnalyses();
    }
  }, [accounts, fetchRecentAnalyses]);

  useEffect(() => {
    checkCalendarStatus();
  }, [checkCalendarStatus]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Invalid date';
    }
  };

  // Format meeting date
  const formatMeetingDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  // Get sentiment score color
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-lean-almost-white flex items-center justify-center">
        <div className="text-center">
          <LoaderIcon className="w-8 h-8 animate-spin text-lean-green mx-auto mb-4" />
          <p className="text-lean-black-70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lean-almost-white flex flex-col">
      <Header user={user} onSignOut={onSignOut} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="typography-heading text-lean-black mb-2">Dashboard</h1>
            <p className="text-lean-black-70">Overview of your accounts, analyses, and upcoming meetings</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Accounts Card */}
            <div className="bg-lean-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-lean-black-70 mb-1">My Accounts</p>
                  <p className="text-3xl font-bold text-lean-black">{accounts.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => router.push('/user')}
                className="mt-4 w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div>
                    <div className="font-semibold">Manage Accounts</div>
                    <div className="text-sm opacity-90">View and manage your accounts</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Analyses Card */}
            <div className="bg-lean-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-lean-black-70 mb-1">Recent Analyses</p>
                  <p className="text-3xl font-bold text-lean-black">{recentAnalyses.length}</p>
                  <p className="text-xs text-lean-black-60 mt-1">Last 30 days</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => router.push('/analyze')}
                className="mt-4 w-full px-4 py-3 bg-lean-green text-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>
                    <div className="font-semibold">Run Sentiment Analysis</div>
                    <div className="text-sm opacity-90">Analyze account sentiment</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Meetings Card */}
            <div className="bg-lean-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-lean-black-70 mb-1">Upcoming Meetings</p>
                  <p className="text-3xl font-bold text-lean-black">{upcomingMeetings.length}</p>
                  <p className="text-xs text-lean-black-60 mt-1">Next 7 days</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => router.push('/calendar')}
                className="mt-4 w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="font-semibold">View Calendar</div>
                    <div className="text-sm opacity-90">See upcoming meetings</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Analyses */}
            <div className="bg-lean-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-lean-black">Recent Sentiment Analyses</h2>
                <button
                  onClick={() => router.push('/analyze')}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View All →
                </button>
              </div>
              
              {recentAnalyses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lean-black-70 mb-4">No analyses yet</p>
                  <button
                    onClick={() => router.push('/analyze')}
                    className="px-4 py-2 bg-lean-green text-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
                  >
                    Run Your First Analysis
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAnalyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="border border-lean-black/20 rounded-lg p-4 hover:bg-lean-almost-white transition-colors cursor-pointer"
                      onClick={() => router.push(`/sentiment/${analysis.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const accountId = analysis.accountId || analysis.account_id;
                                if (accountId) {
                                  router.push(`/account/${accountId}/data`);
                                }
                              }}
                              className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {analysis.accountName || 'Unknown Account'}
                            </button>
                          </div>
                          <p className="text-sm text-lean-black-70 line-clamp-2 mb-2">
                            {analysis.summary || 'No summary available'}
                          </p>
                          <p className="text-xs text-lean-black-60">{formatDate(analysis.analyzed_at)}</p>
                        </div>
                        <div className="ml-4 text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                            {analysis.score}/10
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Meetings */}
            <div className="bg-lean-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-lean-black">Upcoming Meetings</h2>
                <button
                  onClick={() => router.push('/calendar')}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View All →
                </button>
              </div>
              
              {!calendarConnected ? (
                <div className="text-center py-8">
                  <p className="text-lean-black-70 mb-4">Connect your Google Calendar to see upcoming meetings</p>
                  <button
                    onClick={() => router.push('/calendar')}
                    className="px-4 py-2 bg-lean-green text-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
                  >
                    Connect Calendar
                  </button>
                </div>
              ) : upcomingMeetings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lean-black-70">No meetings with matched accounts in the next 7 days</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingMeetings.map(({ event, matchedAccounts }, idx) => (
                    <div
                      key={event.id || idx}
                      className="border border-lean-black/20 rounded-lg p-4 hover:bg-lean-almost-white transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lean-black mb-1">{event.summary || 'Untitled Meeting'}</h3>
                          <p className="text-sm text-lean-black-70 mb-2">
                            {formatMeetingDate(event.start?.dateTime || event.start?.date)}
                            {event.start?.dateTime && (
                              <span className="ml-2">
                                {new Date(event.start.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                              </span>
                            )}
                          </p>
                          {matchedAccounts && matchedAccounts.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {matchedAccounts.map((account, accIdx) => (
                                <button
                                  key={accIdx}
                                  onClick={() => {
                                    const accountId = account.salesforce_id || account.id;
                                    if (accountId) {
                                      router.push(`/account/${accountId}/data`);
                                    }
                                  }}
                                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                >
                                  {account.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

