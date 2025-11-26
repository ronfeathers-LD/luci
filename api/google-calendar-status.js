/**
 * Vercel Serverless Function for Google Calendar Status
 * 
 * Checks if a user has Google Calendar connected
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } = require('../lib/api-helpers');

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

    // Check if Google Calendar is configured
    try {
      require('../lib/google-calendar-client').getGoogleCalendarConfig();
    } catch (configError) {
      // Google Calendar not configured - return not configured status
      logError('Google Calendar config check failed:', configError.message);
      // Log what environment variables are available (without exposing secrets)
      const hasClientId = !!(process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID);
      const hasClientSecret = !!(process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET);
      const clientIdValue = process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
      const isApiKey = clientIdValue && clientIdValue.startsWith('AIza');
      
      log(`Google Calendar env check - hasClientId: ${hasClientId}, hasClientSecret: ${hasClientSecret}, isApiKey: ${isApiKey}`);
      
      // Provide a more helpful error message
      let errorMessage = 'Google Calendar integration is not configured.';
      if (isApiKey) {
        errorMessage = 'Google Calendar integration is misconfigured. An API key is being used instead of an OAuth Client ID. Please update GOOGLE_CLIENT_ID or GOOGLE_CALENDAR_CLIENT_ID to use an OAuth Client ID (ending with .apps.googleusercontent.com) instead of an API key.';
      } else if (!hasClientId || !hasClientSecret) {
        errorMessage = 'Google Calendar integration is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (or GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET) environment variables.';
      } else {
        errorMessage = configError.message || errorMessage;
      }
      
      return sendSuccessResponse(res, {
        connected: false,
        configured: false,
        message: errorMessage,
        error: configError.message,
      });
    }

    const { userId } = req.query;

    if (!userId) {
      return sendErrorResponse(res, new Error('Missing required parameter: userId'), 400);
    }

    // Check if user has an active Google Calendar token
    const { data: tokenData, error } = await supabase
      .from('google_calendar_tokens')
      .select('id, token_expires_at, is_active')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is fine
      logError('Error checking calendar status', error);
      throw error;
    }

    const connected = !!(tokenData && tokenData.is_active);

    return sendSuccessResponse(res, {
      connected,
      configured: true,
      tokenExpiresAt: tokenData?.token_expires_at || null,
    });

  } catch (error) {
    logError('Error in google-calendar-status', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
}

