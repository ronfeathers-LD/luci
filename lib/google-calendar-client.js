/**
 * Google Calendar API Client Library
 * 
 * Handles Google Calendar API authentication and data fetching
 * Uses per-user OAuth tokens stored in database
 */

const { google } = require('googleapis');

/**
 * Get Google Calendar OAuth configuration from environment
 * Uses existing GOOGLE_CLIENT_ID if GOOGLE_CALENDAR_CLIENT_ID is not set
 */
function getGoogleCalendarConfig() {
  // Try GOOGLE_CALENDAR_CLIENT_ID first, fallback to GOOGLE_CLIENT_ID (for reusing existing OAuth client)
  // Trim whitespace to prevent issues with environment variable formatting
  const clientId = (process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '').trim();
  // Try GOOGLE_CALENDAR_CLIENT_SECRET first, fallback to GOOGLE_CLIENT_SECRET
  const clientSecret = (process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || '').trim();
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI ? process.env.GOOGLE_CALENDAR_REDIRECT_URI.trim() : undefined;

  if (!clientId || !clientSecret) {
    throw new Error('Google Calendar OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (or GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET) environment variables.');
  }

  // Validate that clientId is an OAuth Client ID, not an API key
  // OAuth Client IDs end with .apps.googleusercontent.com
  // API keys start with AIza
  if (clientId.startsWith('AIza')) {
    throw new Error(`Invalid OAuth Client ID format. The value "${clientId.substring(0, 20)}..." appears to be an API key, not an OAuth Client ID. OAuth Client IDs should end with ".apps.googleusercontent.com". Please check your GOOGLE_CLIENT_ID or GOOGLE_CALENDAR_CLIENT_ID environment variable.`);
  }

  if (!clientId.includes('.apps.googleusercontent.com')) {
    throw new Error(`Invalid OAuth Client ID format. The Client ID should end with ".apps.googleusercontent.com". Got: "${clientId.substring(0, 30)}...". Please check your GOOGLE_CLIENT_ID or GOOGLE_CALENDAR_CLIENT_ID environment variable.`);
  }

  return {
    clientId,
    clientSecret,
    redirectUri: redirectUri || 'http://localhost:3000/api/google-calendar-auth', // Default for local dev
  };
}

/**
 * Create OAuth2 client for Google Calendar
 */
function createOAuth2Client(config = null) {
  const cfg = config || getGoogleCalendarConfig();
  
  // Ensure redirectUri is set
  const redirectUri = cfg.redirectUri || 'http://localhost:3000/api/google-calendar-auth';
  
  const oauth2Client = new google.auth.OAuth2(
    cfg.clientId,
    cfg.clientSecret,
    redirectUri
  );
  
  return oauth2Client;
}

/**
 * Get user's Google Calendar token from database
 */
async function getUserCalendarToken(supabase, userId) {
  const { data: tokenData, error } = await supabase
    .from('google_calendar_tokens')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error || !tokenData) {
    return null;
  }

  return tokenData;
}

/**
 * Get or refresh Google Calendar access token for a user
 */
async function getAccessToken(supabase, userId) {
  const tokenData = await getUserCalendarToken(supabase, userId);
  
  if (!tokenData) {
    throw new Error('Google Calendar not authorized. Please authorize via /api/google-calendar-auth');
  }

  // Check if token is expired or expiring soon (within 5 minutes)
  if (tokenData.token_expires_at) {
    const expiresAt = new Date(tokenData.token_expires_at);
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    if (expiresAt <= fiveMinutesFromNow) {
      // Token expired or expiring soon - try to refresh
      if (tokenData.refresh_token) {
        try {
          const refreshedToken = await refreshAccessToken(supabase, userId, tokenData);
          return refreshedToken;
        } catch (error) {
          const { logError } = require('./api-helpers');
          logError('Error refreshing Google Calendar token', error);
          throw new Error('Google Calendar access token expired and refresh failed. Please re-authorize.');
        }
      } else {
        throw new Error('Google Calendar access token expired and no refresh token available. Please re-authorize.');
      }
    }
  }

  return tokenData.access_token;
}

/**
 * Refresh Google Calendar access token using refresh token
 */
async function refreshAccessToken(supabase, userId, tokenData) {
  const config = getGoogleCalendarConfig();
  const oauth2Client = createOAuth2Client(config);
  
  oauth2Client.setCredentials({
    refresh_token: tokenData.refresh_token,
  });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    // Calculate token expiration
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + (credentials.expiry_date ? 
      Math.floor((credentials.expiry_date - Date.now()) / 1000) : 3600));

    // Update token in database
    const { error: updateError } = await supabase
      .from('google_calendar_tokens')
      .update({
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token || tokenData.refresh_token, // Keep existing if not provided
        token_expires_at: expiresAt.toISOString(),
        last_tested: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      throw new Error(`Failed to update token: ${updateError.message}`);
    }

    return credentials.access_token;
  } catch (error) {
    const { logError } = require('./api-helpers');
    logError('Error refreshing Google Calendar token', error);
    throw error;
  }
}

/**
 * Get authenticated Google Calendar API client for a user
 */
async function getCalendarClient(supabase, userId) {
  const accessToken = await getAccessToken(supabase, userId);
  const oauth2Client = createOAuth2Client();
  
  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Fetch upcoming calendar events for a user
 */
async function fetchUpcomingEvents(supabase, userId, options = {}) {
  const {
    maxResults = 50,
    timeMin = new Date().toISOString(), // Default to now
    timeMax = null, // Default to 7 days from now if not specified
    calendarId = 'primary',
  } = options;

  // Default to 7 days from now if timeMax not specified
  const maxDate = timeMax || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const calendar = await getCalendarClient(supabase, userId);
    
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: timeMin,
      timeMax: maxDate,
      maxResults: maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    const { logError } = require('./api-helpers');
    logError('Error fetching Google Calendar events', error);
    throw error;
  }
}

/**
 * Store calendar events in database
 */
async function storeCalendarEvents(supabase, userId, events) {
  const eventsToStore = events.map(event => ({
    user_id: userId,
    event_id: event.id,
    summary: event.summary || null,
    description: event.description || null,
    start_time: event.start?.dateTime || event.start?.date || null,
    end_time: event.end?.dateTime || event.end?.date || null,
    location: event.location || null,
    attendees: event.attendees || null,
    organizer_email: event.organizer?.email || null,
    organizer_name: event.organizer?.displayName || null,
    conference_data: event.conferenceData || null,
    html_link: event.htmlLink || null,
  }));

  // Upsert events (update if exists, insert if not)
  const { error } = await supabase
    .from('google_calendar_events')
    .upsert(eventsToStore, {
      onConflict: 'user_id,event_id',
      ignoreDuplicates: false,
    });

  if (error) {
    const { logError } = require('./api-helpers');
    logError('Error storing calendar events', error);
    throw error;
  }

  return eventsToStore;
}

module.exports = {
  getGoogleCalendarConfig,
  createOAuth2Client,
  getUserCalendarToken,
  getAccessToken,
  refreshAccessToken,
  getCalendarClient,
  fetchUpcomingEvents,
  storeCalendarEvents,
};

