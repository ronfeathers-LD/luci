/**
 * Vercel Serverless Function for Google Calendar Events
 * 
 * Fetches upcoming calendar events for a user and matches them to Salesforce accounts
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } = require('../lib/api-helpers');
const { fetchUpcomingEvents, storeCalendarEvents } = require('../lib/google-calendar-client');
const { matchEventsToAccounts } = require('../lib/calendar-account-matcher');
const { CACHE_TTL } = require('../lib/constants');

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return sendErrorResponse(res, new Error('Method not allowed'), 405);
  }

  try {
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    const { userId, days = 7, forceRefresh } = req.query;

    if (!userId) {
      return sendErrorResponse(res, new Error('Missing required parameter: userId'), 400);
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return sendErrorResponse(res, new Error('User not found'), 404);
    }

    const daysNum = parseInt(days, 10) || 7;
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + daysNum * 24 * 60 * 60 * 1000).toISOString();
    const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

    // CACHE-FIRST: Check for cached events before fetching from Google Calendar
    let events = [];
    let useCached = false;
    let needsRefresh = true;

    if (!shouldForceRefresh) {
      try {
        // Get cached events from database
        const { data: cachedEvents, error: cacheError } = await supabase
          .from('google_calendar_events')
          .select('*')
          .eq('user_id', userId)
          .gte('start_time', timeMin)
          .lte('start_time', timeMax)
          .order('start_time', { ascending: true });

        if (!cacheError && cachedEvents && cachedEvents.length > 0) {
          // Check if cache is fresh (within TTL)
          // CALENDAR_EVENTS TTL is in minutes, not hours
          const now = new Date();
          const cacheExpiry = (CACHE_TTL.CALENDAR_EVENTS || 15) * 60 * 1000; // 15 minutes in milliseconds
          
          // Check if all events are fresh (within TTL)
          // Use the most recent updated_at as the cache timestamp
          const mostRecentUpdate = cachedEvents.reduce((latest, event) => {
            if (!event.updated_at) return latest;
            const updated = new Date(event.updated_at);
            return updated > latest ? updated : latest;
          }, new Date(0));
          
          const allFresh = (now - mostRecentUpdate) < cacheExpiry;

          if (allFresh) {
            // Convert cached events to Google Calendar API format
            events = cachedEvents.map(event => ({
              id: event.event_id,
              summary: event.summary,
              description: event.description,
              start: {
                dateTime: event.start_time,
                date: event.start_time,
              },
              end: {
                dateTime: event.end_time,
                date: event.end_time,
              },
              location: event.location,
              attendees: event.attendees,
              organizer: event.organizer_email ? {
                email: event.organizer_email,
                displayName: event.organizer_name,
              } : null,
              conferenceData: event.conference_data,
              htmlLink: event.html_link,
            }));
            useCached = true;
            needsRefresh = false;
            log(`Returning ${events.length} cached calendar events`);
          } else {
            needsRefresh = true;
          }
        }
      } catch (cacheError) {
        logError('Error getting cached calendar events', cacheError);
        needsRefresh = true;
      }
    }

    // Fetch from Google Calendar if cache is stale/missing or force refresh requested
    if (needsRefresh || shouldForceRefresh) {
      try {
        const fetchedEvents = await fetchUpcomingEvents(supabase, userId, {
          timeMin,
          timeMax,
          maxResults: 50,
        });
        
        events = fetchedEvents;
        
        // Store events in database
        if (events.length > 0) {
          try {
            await storeCalendarEvents(supabase, userId, events);
            log(`Fetched and cached ${events.length} calendar events`);
          } catch (error) {
            logError('Error storing calendar events', error);
          }
        }
      } catch (error) {
        if (error.message && error.message.includes('not authorized')) {
          return sendErrorResponse(res, new Error('Google Calendar not authorized. Please connect your calendar first.'), 401);
        }
        logError('Error fetching calendar events', error);
        
        // If we have cached events (even if stale), use them as fallback
        if (useCached && events.length > 0) {
          log('Using stale cache as fallback');
        } else {
          throw error;
        }
      }
    }

    // Match events to Salesforce accounts
    let eventsWithAccounts = [];
    if (events.length > 0) {
      try {
        eventsWithAccounts = await matchEventsToAccounts(supabase, userId, events);
      } catch (error) {
        logError('Error matching events to accounts', error);
        // Return events without matches if matching fails
        eventsWithAccounts = events.map(event => ({
          event,
          matchedAccounts: [],
        }));
      }
    }

    return sendSuccessResponse(res, {
      events: eventsWithAccounts,
      totalEvents: events.length,
      matchedEvents: eventsWithAccounts.filter(e => e.matchedAccounts.length > 0).length,
      cached: useCached,
      forceRefresh: shouldForceRefresh,
    });

  } catch (error) {
    logError('Error in google-calendar-events', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
}

