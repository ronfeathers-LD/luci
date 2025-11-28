// Calendar Page Component
// Displays upcoming meetings with external contacts and research summary
const { useState, useEffect, useCallback } = React;

const CalendarPage = ({ user, onSignOut }) => {
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [checkingCalendar, setCheckingCalendar] = useState(true);
  const [calendarConfigured, setCalendarConfigured] = useState(true);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);
  const [researchSummary, setResearchSummary] = useState(null);
  const [error, setError] = useState(null);

  // Check Google Calendar connection status
  const checkCalendarConnection = useCallback(async () => {
    if (!user?.id) {
      setCheckingCalendar(false);
      return;
    }

    try {
      const response = await (window.deduplicatedFetch || fetch)(`/api/google-calendar?action=status&userId=${user.id}`);
      const responseClone = response.clone();
      if (response.ok) {
        const data = await responseClone.json();
        setCalendarConnected(data.connected || false);
        setCalendarConfigured(data.configured !== false);
      } else {
        setCalendarConnected(false);
        setCalendarConfigured(true);
      }
    } catch (err) {
      window.logError('Error checking calendar connection:', err);
      setCalendarConnected(false);
      setCalendarConfigured(true);
    } finally {
      setCheckingCalendar(false);
    }
  }, [user]);

  // Handle Google Calendar authorization
  const handleConnectCalendar = useCallback(() => {
    if (!user?.id) {
      setError('User ID is required to connect Google Calendar');
      return;
    }

    window.location.href = `/api/google-calendar?userId=${user.id}`;
  }, [user]);

  // Handle Google Calendar disconnection
  const handleDisconnectCalendar = useCallback(async () => {
    if (!user?.id) {
      setError('User ID is required to disconnect Google Calendar');
      return;
    }

    if (!confirm('Are you sure you want to disconnect Google Calendar? You will need to reconnect to sync your meetings.')) {
      return;
    }

    try {
      // Use query param for DELETE requests (more reliable than body in some environments)
      const response = await fetch(`/api/google-calendar?userId=${encodeURIComponent(user.id)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to disconnect Google Calendar');
      }

      setCalendarConnected(false);
      setUpcomingMeetings([]);
      setResearchSummary(null);
    } catch (err) {
      window.logError('Error disconnecting calendar:', err);
      setError(err.message || 'Failed to disconnect Google Calendar. Please try again.');
    }
  }, [user]);

  // Fetch upcoming meetings
  const fetchUpcomingMeetings = useCallback(async (forceRefresh = false) => {
    if (!user?.id || !calendarConnected) {
      return;
    }

    try {
      setLoadingMeetings(true);
      setError(null);
      const url = `/api/google-calendar?userId=${user.id}&action=events&days=7${forceRefresh ? '&forceRefresh=true' : ''}`;
      const response = await (window.deduplicatedFetch || fetch)(url);
      const responseClone = response.clone();
      
      if (!response.ok) {
        if (response.status === 401) {
          setCalendarConnected(false);
          return;
        }
        const errorData = await responseClone.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to fetch meetings');
      }

      const data = await responseClone.json();
      const allEvents = data.events || [];
      
      // Filter to only show meetings with matched accounts
      // We'll show any event that has matched accounts, regardless of how they matched
      const userEmail = user.email?.toLowerCase();
      const filteredEvents = allEvents.filter(({ event, matchedAccounts }) => {
        // Must have matched accounts
        if (!matchedAccounts || matchedAccounts.length === 0) {
          return false;
        }
        
        // If there are attendees, check if any are external (not the user)
        if (event.attendees && Array.isArray(event.attendees)) {
          const hasExternalAttendee = event.attendees.some(attendee => {
            if (!attendee.email) return false;
            const attendeeEmail = attendee.email.toLowerCase();
            // Skip if this is the user's email
            return !(userEmail && attendeeEmail === userEmail);
          });
          
          // If there are external attendees, show the event
          if (hasExternalAttendee) {
            return true;
          }
        }
        
        // Also show events matched by account name even if no external attendees
        // (in case the account name was found in title/description)
        return true;
      });
      
      setUpcomingMeetings(filteredEvents);
      
      // Create research summary
      const accountMap = new Map();
      filteredEvents.forEach(({ matchedAccounts }) => {
        matchedAccounts.forEach(account => {
          if (!accountMap.has(account.id)) {
            accountMap.set(account.id, {
              ...account,
              meetingCount: 0,
              meetings: [],
            });
          }
          const accountData = accountMap.get(account.id);
          accountData.meetingCount += 1;
        });
      });
      
      // Add meeting details to each account
      filteredEvents.forEach(({ event, matchedAccounts }) => {
        const startTime = event.start?.dateTime || event.start?.date;
        const startDate = startTime ? new Date(startTime) : null;
        
        matchedAccounts.forEach(account => {
          const accountData = accountMap.get(account.id);
          if (accountData && startDate) {
            accountData.meetings.push({
              title: event.summary || 'No Title',
              date: startDate,
              htmlLink: event.htmlLink,
            });
          }
        });
      });
      
      // Convert to array and sort by meeting count (most meetings first)
      const researchAccounts = Array.from(accountMap.values())
        .sort((a, b) => b.meetingCount - a.meetingCount);
      
      setResearchSummary({
        totalAccounts: researchAccounts.length,
        totalMeetings: filteredEvents.length,
        accounts: researchAccounts,
      });
    } catch (err) {
      window.logError('Error fetching meetings:', err);
      setError(err.message || 'Failed to fetch meetings. Please try again.');
    } finally {
      setLoadingMeetings(false);
    }
  }, [user, calendarConnected]);

  // Load calendar status on mount
  useEffect(() => {
    checkCalendarConnection();
  }, [checkCalendarConnection]);

  // Fetch meetings when calendar is connected
  useEffect(() => {
    if (calendarConnected) {
      fetchUpcomingMeetings();
    } else {
      setUpcomingMeetings([]);
      setResearchSummary(null);
    }
  }, [calendarConnected, fetchUpcomingMeetings]);

  return (
    <div className="min-h-screen bg-lean-almost-white flex flex-col">
      {/* Global Header */}
      <window.Header user={user} onSignOut={onSignOut} />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="typography-heading text-lean-black mb-2">Calendar</h1>
            <p className="text-sm text-lean-black-70">Upcoming meetings with external contacts</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Google Calendar Connection Section */}
          <div className="bg-lean-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="typography-heading text-lean-black">Google Calendar</h2>
                <p className="text-sm text-lean-black-70 mt-1">
                  Connect your Google Calendar to see upcoming meetings and associated accounts
                </p>
              </div>
              {checkingCalendar ? (
                <window.LoaderIcon className="w-5 h-5 animate-spin text-lean-green" />
              ) : !calendarConfigured ? (
                <span className="text-sm text-yellow-600 font-medium">Not Configured</span>
              ) : calendarConnected ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-green-600 font-medium">Connected</span>
                  <button
                    onClick={handleDisconnectCalendar}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectCalendar}
                  className="px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
                >
                  Connect Calendar
                </button>
              )}
            </div>
            {!calendarConfigured && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  ⚠️ Google Calendar integration is not configured. Please contact your administrator to set up the required environment variables.
                </p>
              </div>
            )}
            {calendarConfigured && calendarConnected && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✓ Your Google Calendar is connected. Meetings will be synced automatically.
                </p>
              </div>
            )}
          </div>

          {/* Research Summary Section */}
          {calendarConnected && researchSummary && researchSummary.accounts.length > 0 && (
            <div className="bg-gradient-to-r from-lean-green-10 to-lean-green-5 rounded-lg shadow-lg p-6 mb-6 border border-lean-green/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="typography-heading text-lean-black">Weekly Research Summary</h2>
                  <p className="text-sm text-lean-black-70 mt-1">
                    {researchSummary.totalAccounts} {researchSummary.totalAccounts === 1 ? 'account' : 'accounts'} to research across {researchSummary.totalMeetings} {researchSummary.totalMeetings === 1 ? 'meeting' : 'meetings'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {researchSummary.accounts.map((account) => (
                  <div
                    key={account.id}
                    className="bg-lean-white rounded-lg p-4 border border-lean-black/10 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lean-black flex-1">{account.name}</h3>
                      <span className="ml-2 px-2 py-1 bg-lean-green-10 text-lean-green text-xs font-semibold rounded-full">
                        {account.meetingCount} {account.meetingCount === 1 ? 'meeting' : 'meetings'}
                      </span>
                    </div>
                    <div className="text-xs text-lean-black-60 space-y-1">
                      {account.meetings.slice(0, 3).map((meeting, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="font-medium">
                            {meeting.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="truncate">{meeting.title}</span>
                        </div>
                      ))}
                      {account.meetings.length > 3 && (
                        <div className="text-lean-black-60 italic">
                          +{account.meetings.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Meetings Section */}
          {calendarConnected && (
            <div className="bg-lean-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="typography-heading text-lean-black">Upcoming Meetings</h2>
                  <p className="text-sm text-lean-black-70 mt-1">
                    Meetings with external contacts for the next 7 days
                  </p>
                </div>
                <button
                  onClick={() => fetchUpcomingMeetings(true)}
                  disabled={loadingMeetings}
                  className="px-4 py-2 text-sm text-lean-black-70 hover:text-lean-black transition-colors disabled:opacity-50"
                  title="Force refresh from Google Calendar (bypasses cache)"
                >
                  {loadingMeetings ? (
                    <window.LoaderIcon className="w-4 h-4 animate-spin inline" />
                  ) : (
                    'Refresh'
                  )}
                </button>
              </div>

              {loadingMeetings ? (
                <div className="flex items-center justify-center py-8">
                  <window.LoaderIcon className="w-6 h-6 animate-spin text-lean-green" />
                  <span className="ml-3 text-lean-black-70">Loading meetings...</span>
                </div>
              ) : upcomingMeetings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lean-black-70">No meetings with external contacts found for the next 7 days.</p>
                  <p className="text-sm text-lean-black-60 mt-2">Only meetings with external attendees who are known contacts are shown.</p>
                </div>
              ) : (() => {
                // Group meetings by date
                const meetingsByDate = {};
                upcomingMeetings.forEach(({ event, matchedAccounts }) => {
                  const startTime = event.start?.dateTime || event.start?.date;
                  if (!startTime) return;
                  
                  const startDate = new Date(startTime);
                  const dateKey = startDate.toDateString();
                  
                  if (!meetingsByDate[dateKey]) {
                    meetingsByDate[dateKey] = [];
                  }
                  meetingsByDate[dateKey].push({ event, matchedAccounts, startDate });
                });

                // Sort dates
                const sortedDates = Object.keys(meetingsByDate).sort((a, b) => 
                  new Date(a) - new Date(b)
                );

                return (
                  <div className="space-y-6">
                    {sortedDates.map((dateKey) => {
                      const date = new Date(dateKey);
                      const meetings = meetingsByDate[dateKey].sort((a, b) => 
                        a.startDate - b.startDate
                      );
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();

                      return (
                        <div key={dateKey} className="border border-lean-black/10 rounded-lg overflow-hidden">
                          {/* Date Header */}
                          <div className={`px-4 py-3 border-b border-lean-black/10 ${
                            isToday ? 'bg-lean-green-10' : 'bg-lean-almost-white'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`text-2xl font-bold ${
                                  isToday ? 'text-lean-green' : 'text-lean-black'
                                }`}>
                                  {date.getDate()}
                                </div>
                                <div>
                                  <div className="font-semibold text-lean-black">
                                    {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'long' })}
                                  </div>
                                  <div className="text-sm text-lean-black-70">
                                    {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm text-lean-black-70">
                                {meetings.length} {meetings.length === 1 ? 'meeting' : 'meetings'}
                              </div>
                            </div>
                          </div>

                          {/* Meetings for this date */}
                          <div className="divide-y divide-lean-black/5">
                            {meetings.map(({ event, matchedAccounts, startDate }, index) => {
                              const endTime = event.end?.dateTime || event.end?.date;
                              const endDate = endTime ? new Date(endTime) : null;
                              const duration = endDate ? Math.round((endDate - startDate) / (1000 * 60)) : null;

                              return (
                                <div
                                  key={event.id || index}
                                  className="p-4 hover:bg-lean-almost-white transition-colors"
                                >
                                  <div className="flex gap-4">
                                    {/* Time Column */}
                                    <div className="flex-shrink-0 w-24">
                                      <div className="text-sm font-semibold text-lean-black">
                                        {startDate.toLocaleTimeString('en-US', {
                                          hour: 'numeric',
                                          minute: '2-digit',
                                        })}
                                      </div>
                                      {endDate && (
                                        <div className="text-xs text-lean-black-60 mt-1">
                                          {endDate.toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                          })}
                                        </div>
                                      )}
                                      {duration && (
                                        <div className="text-xs text-lean-black-60 mt-1">
                                          {duration} min
                                        </div>
                                      )}
                                    </div>

                                    {/* Event Details */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                          <h3 className="font-semibold text-lean-black mb-1 truncate">
                                            {event.summary || 'No Title'}
                                          </h3>
                                          
                                          {event.location && (
                                            <div className="text-sm text-lean-black-70 mb-2 flex items-center gap-1">
                                              <span>📍</span>
                                              <span className="truncate">{event.location}</span>
                                            </div>
                                          )}

                                          {event.description && (
                                            <div className="text-sm text-lean-black-60 mb-2 line-clamp-2">
                                              {event.description}
                                            </div>
                                          )}

                                          {matchedAccounts.length > 0 && (
                                            <div className="mt-3">
                                              <p className="text-xs font-semibold text-lean-black-70 mb-2 uppercase tracking-wide">
                                                Accounts to Research:
                                              </p>
                                              <div className="flex flex-wrap gap-2">
                                                {matchedAccounts.map((account) => {
                                                  // Use salesforce_id (snake_case) from matcher, fallback to salesforceId (camelCase) or id
                                                  const accountId = account.salesforce_id || account.salesforceId || account.id;
                                                  return (
                                                    <button
                                                      key={account.id}
                                                      onClick={() => {
                                                        if (window.navigate) {
                                                          window.navigate(`/account/${accountId}/data`);
                                                        } else {
                                                          window.location.href = `/account/${accountId}/data`;
                                                        }
                                                      }}
                                                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-lean-green-10 text-lean-green border border-lean-green/20 hover:bg-lean-green hover:text-lean-white transition-colors cursor-pointer"
                                                    >
                                                      {account.name}
                                                    </button>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {event.htmlLink && (
                                          <a
                                            href={event.htmlLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-shrink-0 px-3 py-1 text-xs text-lean-green hover:text-lean-green/80 hover:underline whitespace-nowrap"
                                          >
                                            Open →
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Export to window
window.CalendarPage = CalendarPage;

