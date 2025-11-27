/**
 * Vercel Serverless Function for Google Calendar OAuth
 * 
 * Handles OAuth authorization flow:
 * 1. Redirects user to Google authorization
 * 2. Receives callback with authorization code
 * 3. Exchanges code for access token
 * 4. Stores token in database (per-user)
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } = require('../lib/api-helpers');
const { getGoogleCalendarConfig, createOAuth2Client } = require('../lib/google-calendar-client');

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  try {
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    // Get Google Calendar config
    let config;
    try {
      config = getGoogleCalendarConfig();
    } catch (error) {
      return sendErrorResponse(res, new Error('Google Calendar not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (or GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET) environment variables.'), 400);
    }

    const { code, state, error: oauthError, userId, action } = req.query;

    // Step 4: Handle disconnection (DELETE request) - Check this FIRST before OAuth flow
    if (req.method === 'DELETE') {
      // For DELETE requests, try body first, then query params as fallback
      // (Vercel may not always parse DELETE request bodies)
      let deleteUserId = req.body?.userId || req.query?.userId;

      if (!deleteUserId) {
        return sendErrorResponse(res, new Error('Missing required parameter: userId'), 400);
      }

      // Verify user exists
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', deleteUserId)
        .single();

      if (userError || !user) {
        return sendErrorResponse(res, new Error('User not found'), 404);
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
        return sendErrorResponse(res, new Error('Failed to disconnect Google Calendar'), 500, isProduction());
      }

      return sendSuccessResponse(res, { message: 'Google Calendar disconnected successfully' });
    }

    // Handle status check (GET request with action=status or no code/userId)
    if (req.method === 'GET' && (action === 'status' || (!code && !userId && !oauthError))) {
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
        
        return sendSuccessResponse(res, {
          connected: false,
          configured: false,
          message: errorMessage,
          error: configError.message,
        });
      }

      const statusUserId = userId || req.query.userId;
      if (!statusUserId) {
        return sendErrorResponse(res, new Error('Missing required parameter: userId'), 400);
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

      return sendSuccessResponse(res, {
        connected,
        configured: true,
        tokenExpiresAt: tokenData?.token_expires_at || null,
      });
    }

    // Step 1: Initiate OAuth flow (redirect to Google)
    if (!code && !oauthError) {
      // userId is required for per-user tokens
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

      // Determine redirect URI - must match exactly what's in Google Cloud Console
      // For local dev, always use http://localhost:3000 (ignore config.redirectUri if it's a production URL)
      const isLocalhost = req.headers.host && (req.headers.host.includes('localhost') || req.headers.host.includes('127.0.0.1'));
      const host = req.headers.host || 'unknown';
      const protocol = isLocalhost ? 'http' : (req.headers['x-forwarded-proto'] || 'https');
      
      let redirectUri;
      if (isLocalhost) {
        // Force localhost redirect URI for local development
        redirectUri = 'http://localhost:3000/api/google-calendar-auth';
      } else {
        // For production, use config or build from headers
        redirectUri = config.redirectUri || `${protocol}://${host}/api/google-calendar-auth`;
      }
      
      // Log OAuth initiation
      log(`Initiating Google Calendar OAuth for user ${userId}`);
      
      // Generate state for CSRF protection (include userId)
      const stateValue = Buffer.from(JSON.stringify({ userId, timestamp: Date.now() })).toString('base64');
      
      // Create OAuth2 client with explicit redirect URI
      const oauth2ClientConfig = {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: redirectUri, // Use the determined redirect URI
      };
      
      const oauth2Client = createOAuth2Client(oauth2ClientConfig);
      
      // Generate auth URL
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Required to get refresh token
        scope: [
          'https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/calendar.events.readonly',
        ],
        state: stateValue,
        prompt: 'consent', // Force consent screen to get refresh token
      });

      return res.redirect(authUrl);
    }

    // Step 2: Handle OAuth error
    if (oauthError) {
      return sendErrorResponse(res, new Error(`Google Calendar OAuth error: ${oauthError}. User denied authorization or an error occurred.`), 400);
    }

    // Step 3: Exchange authorization code for access token
    if (code) {
      // Parse state to get userId
      let userIdFromState = null;
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        userIdFromState = stateData.userId;
      } catch (error) {
        logError('Error parsing state:', error);
      }

      // Also check userId from query (fallback)
      const userId = userIdFromState || req.query.userId;

      if (!userId) {
        return sendErrorResponse(res, new Error('Missing userId. Please include userId in the authorization request.'), 400);
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

      // Determine redirect URI - must match exactly what was used in the auth URL
      const isLocalhost = req.headers.host && (req.headers.host.includes('localhost') || req.headers.host.includes('127.0.0.1'));
      const host = req.headers.host || 'unknown';
      const protocol = isLocalhost ? 'http' : (req.headers['x-forwarded-proto'] || 'https');
      
      let redirectUri;
      if (isLocalhost) {
        // Force localhost redirect URI for local development (must match what was sent in auth URL)
        redirectUri = 'http://localhost:3000/api/google-calendar-auth';
      } else {
        // For production, use config or build from headers
        redirectUri = config.redirectUri || `${protocol}://${host}/api/google-calendar-auth`;
      }

      log(`Exchanging OAuth code for token for user ${userId}`);

      // Create OAuth2 client with explicit redirect URI (must match auth URL)
      const oauth2ClientConfig = {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: redirectUri,
      };
      
      const oauth2Client = createOAuth2Client(oauth2ClientConfig);
      
      try {
        const { tokens } = await oauth2Client.getToken(code);
        
        if (!tokens.access_token) {
          return sendErrorResponse(res, new Error('Invalid token response. Google did not return an access token.'), 400);
        }

        // Calculate token expiration
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + (tokens.expiry_date ? 
          Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600));

        // Store or update tokens in database (per-user)
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
          return sendErrorResponse(res, new Error('Failed to store access token. Could not save access token to database.'), 500, isProduction());
        }

        // Return success page with auto-redirect
        return res.status(200).send(`
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
              // Also use JavaScript redirect as fallback
              setTimeout(function() {
                window.location.href = '/calendar';
              }, 2000);
            </script>
          </body>
          </html>
        `);
      } catch (tokenError) {
        logError('Error exchanging authorization code', tokenError);
        // Provide more helpful error message for invalid_client
        if (tokenError.message && tokenError.message.includes('invalid_client')) {
          return sendErrorResponse(res, new Error(`Invalid OAuth client credentials. Please verify that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local match the OAuth client in Google Cloud Console. Error: ${tokenError.message}`), 400);
        }
        return sendErrorResponse(res, new Error(`Failed to exchange authorization code: ${tokenError.message}`), 400);
      }
    }

    return sendErrorResponse(res, new Error('Invalid request'), 400);

  } catch (error) {
    logError('Error in google-calendar-auth', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
}

