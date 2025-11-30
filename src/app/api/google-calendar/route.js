/**
 * Next.js App Router API Route for Google Calendar
 * 
 * Combined endpoint handling:
 * - OAuth authorization flow (GET with code/userId/action)
 * - Event fetching (GET with action=events)
 * - Status checks (GET with action=status)
 * - Disconnection (DELETE)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabase-server';
import { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } from '../../../lib/next-api-helpers';

// Can use require for lib files in Next.js API routes
const { getGoogleCalendarConfig, createOAuth2Client } = require('../../../../lib/google-calendar-client');
const { fetchUpcomingEvents, storeCalendarEvents } = require('../../../../lib/google-calendar-client');
const { matchEventsToAccounts } = require('../../../../lib/calendar-account-matcher');
const { CACHE_TTL } = require('../../../../lib/constants');

// Handle OPTIONS preflight
export async function OPTIONS() {
  return handlePreflight(new NextRequest('http://localhost', { method: 'OPTIONS' }));
}

// DELETE /api/google-calendar - Disconnect Google Calendar
export async function DELETE(request) {
  const preflight = await handlePreflight(request);
  if (preflight) return preflight;

  try {
    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }

    const { searchParams } = new URL(request.url);
    let deleteUserId = searchParams.get('userId');
    
    // Try body if not in query params
    if (!deleteUserId) {
      try {
        const body = await request.json().catch(() => ({}));
        deleteUserId = body.userId;
      } catch (e) {
        // Body not available or not JSON
      }
    }

    if (!deleteUserId) {
      return sendErrorResponse(new Error('Missing required parameter: userId'), 400);
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', deleteUserId)
      .single();

    if (userError || !user) {
      return sendErrorResponse(new Error('User not found'), 404);
    }

    // Deactivate token (soft delete)
    const { error: updateError } = await supabase
      .from('google_calendar_tokens')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', deleteUserId);

    if (updateError) {
      logError('Error disconnecting Google Calendar', updateError);
      return sendErrorResponse(new Error('Failed to disconnect Google Calendar'), 500);
    }

    return sendSuccessResponse({ message: 'Google Calendar disconnected successfully' });
  } catch (error) {
    logError('Error in google-calendar DELETE:', error);
    return sendErrorResponse(error, 500);
  }
}

// GET /api/google-calendar - Handle OAuth flow, status checks, and event fetching
export async function GET(request) {
  const preflight = await handlePreflight(request);
  if (preflight) return preflight;

  try {
    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }

    // Get Google Calendar config (needed for most operations)
    let config;
    try {
      config = getGoogleCalendarConfig();
    } catch (error) {
      // Only throw error for operations that require config (not status checks)
      const { searchParams } = new URL(request.url);
      const action = searchParams.get('action');
      if (action !== 'status') {
        return sendErrorResponse(new Error('Google Calendar not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (or GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET) environment variables.'), 400);
      }
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const oauthError = searchParams.get('error');
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const days = searchParams.get('days');
    const forceRefresh = searchParams.get('forceRefresh');

    // Action: events - Fetch calendar events
    if (action === 'events') {
      if (!userId) {
        return sendErrorResponse(new Error('Missing required parameter: userId'), 400);
      }

      // Verify user exists
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return sendErrorResponse(new Error('User not found'), 404);
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
            const now = new Date();
            const cacheExpiry = (CACHE_TTL.CALENDAR_EVENTS || 15) * 60 * 1000; // 15 minutes in milliseconds
            
            // Use the most recent updated_at as the cache timestamp
            const mostRecentUpdate = cachedEvents.reduce((latest, event) => {
              if (!event.updated_at) return latest;
              const updated = new Date(event.updated_at);
              return updated > latest ? updated : latest;
            }, new Date(0));
            
            const allFresh = (now - mostRecentUpdate) < cacheExpiry;

            if (allFresh) {
              // Convert cached events to Google Calendar API format
              events = cachedEvents.map(event => {
                let attendees = event.attendees;
                if (attendees && typeof attendees === 'string') {
                  try {
                    attendees = JSON.parse(attendees);
                  } catch (e) {
                    logError('Error parsing attendees JSON:', e);
                    attendees = null;
                  }
                }
                
                return {
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
                  attendees: Array.isArray(attendees) ? attendees : (attendees ? [attendees] : null),
                  organizer: event.organizer_email ? {
                    email: event.organizer_email,
                    displayName: event.organizer_name,
                  } : null,
                  conferenceData: event.conference_data,
                  htmlLink: event.html_link,
                };
              });
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
            return sendErrorResponse(new Error('Google Calendar not authorized. Please connect your calendar first.'), 401);
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

      return sendSuccessResponse({
        events: eventsWithAccounts,
        totalEvents: events.length,
        matchedEvents: eventsWithAccounts.filter(e => e.matchedAccounts.length > 0).length,
        cached: useCached,
        forceRefresh: shouldForceRefresh,
      });
    }

    // Action: status - Check connection status
    if (action === 'status' || (!code && !userId && !oauthError && !action)) {
      // Check if Google Calendar is configured
      try {
        getGoogleCalendarConfig();
      } catch (configError) {
        const hasClientId = !!(process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID);
        const hasClientSecret = !!(process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET);
        const clientIdValue = process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
        const isApiKey = clientIdValue && clientIdValue.startsWith('AIza');
        
        let errorMessage = 'Google Calendar integration is not configured.';
        if (isApiKey) {
          errorMessage = 'Google Calendar integration is misconfigured. An API key is being used instead of an OAuth Client ID. Please update GOOGLE_CLIENT_ID or GOOGLE_CALENDAR_CLIENT_ID to use an OAuth Client ID (ending with .apps.googleusercontent.com) instead of an API key.';
        } else if (!hasClientId || !hasClientSecret) {
          errorMessage = 'Google Calendar integration is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (or GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET) environment variables.';
        } else {
          errorMessage = configError.message || errorMessage;
        }
        
        return sendSuccessResponse({
          connected: false,
          configured: false,
          message: errorMessage,
          error: configError.message,
        });
      }

      const statusUserId = userId || searchParams.get('userId');
      if (!statusUserId) {
        return sendErrorResponse(new Error('Missing required parameter: userId'), 400);
      }

      // Check if user has an active Google Calendar token
      const { data: tokenData, error } = await supabase
        .from('google_calendar_tokens')
        .select('id, token_expires_at, is_active')
        .eq('user_id', statusUserId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        logError('Error checking calendar status', error);
        throw error;
      }

      const connected = !!(tokenData && tokenData.is_active);

      return sendSuccessResponse({
        connected,
        configured: true,
        tokenExpiresAt: tokenData?.token_expires_at || null,
      });
    }

    // OAuth Flow: Initiate OAuth (redirect to Google)
    if (!code && !oauthError) {
      if (!userId) {
        return sendErrorResponse(new Error('Missing required parameter: userId'), 400);
      }

      // Verify user exists
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return sendErrorResponse(new Error('User not found'), 404);
      }

      // Determine redirect URI
      const host = request.headers.get('host') || 'unknown';
      const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
      const protocol = isLocalhost ? 'http' : (request.headers.get('x-forwarded-proto') || 'https');
      
      let redirectUri;
      if (isLocalhost) {
        redirectUri = 'http://localhost:3000/api/google-calendar';
      } else {
        redirectUri = config.redirectUri || `${protocol}://${host}/api/google-calendar`;
      }
      
      log(`Initiating Google Calendar OAuth for user ${userId}`);
      
      // Generate state for CSRF protection
      const stateValue = Buffer.from(JSON.stringify({ userId, timestamp: Date.now() })).toString('base64');
      
      // Create OAuth2 client
      const oauth2ClientConfig = {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: redirectUri,
      };
      
      const oauth2Client = createOAuth2Client(oauth2ClientConfig);
      
      // Generate auth URL
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/calendar.events.readonly',
        ],
        state: stateValue,
        prompt: 'consent',
      });

      return NextResponse.redirect(authUrl);
    }

    // Handle OAuth error
    if (oauthError) {
      return sendErrorResponse(new Error(`Google Calendar OAuth error: ${oauthError}. User denied authorization or an error occurred.`), 400);
    }

    // Exchange authorization code for access token
    if (code) {
      // Parse state to get userId
      let userIdFromState = null;
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        userIdFromState = stateData.userId;
      } catch (error) {
        logError('Error parsing state:', error);
      }

      const userId = userIdFromState || searchParams.get('userId');

      if (!userId) {
        return sendErrorResponse(new Error('Missing userId. Please include userId in the authorization request.'), 400);
      }

      // Verify user exists
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return sendErrorResponse(new Error('User not found'), 404);
      }

      // Determine redirect URI (must match auth URL)
      const host = request.headers.get('host') || 'unknown';
      const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
      const protocol = isLocalhost ? 'http' : (request.headers.get('x-forwarded-proto') || 'https');
      
      let redirectUri;
      if (isLocalhost) {
        redirectUri = 'http://localhost:3000/api/google-calendar';
      } else {
        redirectUri = config.redirectUri || `${protocol}://${host}/api/google-calendar`;
      }

      log(`Exchanging OAuth code for token for user ${userId}`);

      // Create OAuth2 client
      const oauth2ClientConfig = {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: redirectUri,
      };
      
      const oauth2Client = createOAuth2Client(oauth2ClientConfig);
      
      try {
        const { tokens } = await oauth2Client.getToken(code);
        
        if (!tokens.access_token) {
          return sendErrorResponse(new Error('Invalid token response. Google did not return an access token.'), 400);
        }

        // Calculate token expiration
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + (tokens.expiry_date ? 
          Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600));

        // Store or update tokens in database
        const { error: upsertError } = await supabase
          .from('google_calendar_tokens')
          .upsert({
            user_id: userId,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token || null,
            token_expires_at: expiresAt.toISOString(),
            scope: tokens.scope || null,
            is_active: true,
            last_tested: new Date().toISOString(),
          }, {
            onConflict: 'user_id',
            ignoreDuplicates: false,
          });

        if (upsertError) {
          logError('Error storing Google Calendar token', upsertError);
          return sendErrorResponse(new Error('Failed to store access token. Could not save access token to database.'), 500);
        }

        // Return success page with auto-redirect
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Google Calendar OAuth Success</title>
            <meta http-equiv="refresh" content="2;url=/calendar">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
              }
              .container {
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 500px;
              }
              h1 {
                color: #4285f4;
                margin-bottom: 1rem;
              }
              .success {
                color: #34a853;
                font-size: 3rem;
                margin-bottom: 1rem;
              }
              p {
                color: #6b7280;
                line-height: 1.6;
              }
              .token-info {
                background: #f3f4f6;
                padding: 1rem;
                border-radius: 4px;
                margin-top: 1rem;
                font-size: 0.875rem;
                color: #374151;
              }
              .redirect-message {
                margin-top: 1.5rem;
                font-size: 0.875rem;
                color: #6b7280;
              }
              .redirect-link {
                display: inline-block;
                margin-top: 1rem;
                padding: 0.75rem 1.5rem;
                background: #4285f4;
                color: white;
                text-decoration: none;
                border-radius: 0.375rem;
                font-weight: 600;
                transition: background 0.2s;
              }
              .redirect-link:hover {
                background: #3367d6;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success">✓</div>
              <h1>Google Calendar Connected!</h1>
              <p>Your Google Calendar has been successfully connected and is ready to use.</p>
              <div class="token-info">
                <strong>Token expires:</strong> ${new Date(expiresAt).toLocaleString()}
              </div>
              <div class="redirect-message">
                <p>Redirecting you back to the calendar page...</p>
                <a href="/calendar" class="redirect-link">Go to Calendar Page</a>
              </div>
            </div>
            <script>
              setTimeout(function() {
                window.location.href = '/calendar';
              }, 2000);
            </script>
          </body>
          </html>
        `;

        return new NextResponse(htmlContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        });
      } catch (tokenError) {
        logError('Error exchanging authorization code', tokenError);
        if (tokenError.message && tokenError.message.includes('invalid_client')) {
          return sendErrorResponse(new Error(`Invalid OAuth client credentials. Please verify that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local match the OAuth client in Google Cloud Console. Error: ${tokenError.message}`), 400);
        }
        return sendErrorResponse(new Error(`Failed to exchange authorization code: ${tokenError.message}`), 400);
      }
    }

    return sendErrorResponse(new Error('Invalid request'), 400);

  } catch (error) {
    logError('Error in google-calendar', error);
    return sendErrorResponse(error, 500);
  }
}

