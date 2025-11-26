/**
 * Debug endpoint to check Google Calendar OAuth configuration
 * Shows the exact redirect URI that will be used
 */

const { handlePreflight, sendErrorResponse, sendSuccessResponse } = require('../lib/api-helpers');
const { getGoogleCalendarConfig } = require('../lib/google-calendar-client');

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  try {
    // Get config
    let config;
    try {
      config = getGoogleCalendarConfig();
    } catch (error) {
      return sendErrorResponse(res, error, 400);
    }

    // Determine redirect URI the same way as the auth endpoint
    const isLocalhost = req.headers.host && (req.headers.host.includes('localhost') || req.headers.host.includes('127.0.0.1'));
    const protocol = isLocalhost ? 'http' : (req.headers['x-forwarded-proto'] || 'https');
    const host = req.headers.host;
    const redirectUri = config.redirectUri || `${protocol}://${host}/api/google-calendar-auth`;

    return sendSuccessResponse(res, {
      clientId: config.clientId,
      clientIdShort: config.clientId.substring(0, 30) + '...',
      hasClientSecret: !!config.clientSecret,
      clientSecretPrefix: config.clientSecret ? config.clientSecret.substring(0, 12) + '...' : 'missing',
      redirectUri: redirectUri,
      configRedirectUri: config.redirectUri,
      host: host,
      protocol: protocol,
      isLocalhost: isLocalhost,
      message: 'Check that this redirectUri matches EXACTLY in Google Cloud Console (including http vs https, trailing slashes, etc.)',
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

