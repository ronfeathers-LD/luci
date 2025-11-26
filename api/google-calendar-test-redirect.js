/**
 * Test endpoint to show the exact redirect URI that will be used
 * This helps verify it matches Google Cloud Console
 */

const { handlePreflight, sendSuccessResponse } = require('../lib/api-helpers');
const { getGoogleCalendarConfig, createOAuth2Client } = require('../lib/google-calendar-client');

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  try {
    const config = getGoogleCalendarConfig();
    
    // Determine redirect URI the same way as the auth endpoint
    const isLocalhost = req.headers.host && (req.headers.host.includes('localhost') || req.headers.host.includes('127.0.0.1'));
    const host = req.headers.host || 'unknown';
    const protocol = isLocalhost ? 'http' : (req.headers['x-forwarded-proto'] || 'https');
    
    let redirectUri;
    if (isLocalhost) {
      redirectUri = 'http://localhost:3000/api/google-calendar-auth';
    } else {
      redirectUri = config.redirectUri || `${protocol}://${host}/api/google-calendar-auth`;
    }

    // Create OAuth2 client and generate a test auth URL to see what redirect_uri is actually used
    const oauth2Client = createOAuth2Client({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: redirectUri,
    });

    const testAuthUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.readonly'],
      state: 'test',
    });

    // Parse the auth URL to extract the redirect_uri parameter
    const authUrlObj = new URL(testAuthUrl);
    const redirectUriFromUrl = authUrlObj.searchParams.get('redirect_uri');

    return sendSuccessResponse(res, {
      message: 'Redirect URI Configuration',
      redirectUri: redirectUri,
      redirectUriFromAuthUrl: redirectUriFromUrl,
      redirectUriMatches: redirectUri === decodeURIComponent(redirectUriFromUrl || ''),
      host: host,
      protocol: protocol,
      isLocalhost: isLocalhost,
      configRedirectUri: config.redirectUri,
      clientId: config.clientId,
      instructions: [
        '1. Copy the redirectUri value above',
        '2. Go to Google Cloud Console → APIs & Services → Credentials',
        '3. Click on your OAuth Client ID',
        '4. Under "Authorized redirect URIs", make sure this EXACT value is listed:',
        `   ${redirectUri}`,
        '5. Make sure there are no extra spaces, trailing slashes, or different casing',
        '6. Click SAVE',
        '7. Wait a few seconds for changes to propagate',
        '8. Try connecting again',
      ],
    });
  } catch (error) {
    return sendSuccessResponse(res, {
      error: error.message,
      message: 'Error getting redirect URI configuration',
    });
  }
};

