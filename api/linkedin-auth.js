/**
 * Vercel Serverless Function for LinkedIn OAuth
 * 
 * Handles OAuth authorization flow:
 * 1. Redirects user to LinkedIn authorization
 * 2. Receives callback with authorization code
 * 3. Exchanges code for access token
 * 4. Stores token in database
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } = require('../lib/api-helpers');

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';

export default async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  try {
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    // Get LinkedIn config
    const { data: config, error: configError } = await supabase
      .from('linkedin_configs')
      .select('*')
      .eq('is_active', true)
      .single();

    if (configError || !config) {
      return sendErrorResponse(res, new Error('LinkedIn not configured. Please configure LinkedIn Client ID and Secret first. See LINKEDIN_OAUTH_SETUP.md'), 400);
    }

    if (!config.client_id || !config.client_secret) {
      return sendErrorResponse(res, new Error('LinkedIn credentials missing. Please configure LinkedIn Client ID and Secret in the database.'), 400);
    }

    const { code, state, error: oauthError } = req.query;

    // Step 1: Initiate OAuth flow (redirect to LinkedIn)
    if (!code && !oauthError) {
      // Determine redirect URI
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers.host;
      const redirectUri = config.redirect_uri || `${protocol}://${host}/api/linkedin-auth`;
      
      // Generate state for CSRF protection
      const stateValue = Math.random().toString(36).substring(7);
      
      const authUrl = new URL(LINKEDIN_AUTH_URL);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('client_id', config.client_id);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('state', stateValue);
      // Use valid LinkedIn scopes based on available products
      // Try OpenID Connect scopes first (requires "Sign In with LinkedIn using OpenID Connect" product)
      // If that fails, the user needs to enable that product in LinkedIn Developer Portal
      // Alternative: Some apps may need to use r_basicprofile if they have older product access
      const scope = req.query.scope || 'openid profile email';
      authUrl.searchParams.set('scope', scope);
      
      // Update redirect URI in config if not set
      if (!config.redirect_uri) {
        await supabase
          .from('linkedin_configs')
          .update({ redirect_uri: redirectUri })
          .eq('id', config.id);
      }

      return res.redirect(authUrl.toString());
    }

    // Step 2: Handle OAuth error
    if (oauthError) {
      return sendErrorResponse(res, new Error(`LinkedIn OAuth error: ${oauthError}. User denied authorization or an error occurred during LinkedIn OAuth.`), 400);
    }

    // Step 3: Exchange authorization code for access token
    if (code) {
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers.host;
      const redirectUri = config.redirect_uri || `${protocol}://${host}/api/linkedin-auth`;
      
      const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: config.client_id,
        client_secret: config.client_secret,
      });

      const tokenResponse = await fetch(LINKEDIN_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenParams.toString(),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        logError('LinkedIn token exchange error:', errorText);
        return sendErrorResponse(res, new Error(`Failed to exchange authorization code. Could not obtain access token from LinkedIn: ${errorText}`), 400);
      }

      const tokenData = await tokenResponse.json();
      
      if (!tokenData.access_token) {
        return sendErrorResponse(res, new Error('Invalid token response. LinkedIn did not return an access token.'), 400);
      }
      
      // Calculate token expiration
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + (tokenData.expires_in || 5184000)); // Default 60 days

      // Store tokens in database
      const { error: updateError } = await supabase
        .from('linkedin_configs')
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
          token_expires_at: expiresAt.toISOString(),
          last_tested: new Date().toISOString(),
        })
        .eq('id', config.id);

      if (updateError) {
        logError('Error updating LinkedIn config:', updateError);
        return sendErrorResponse(res, new Error('Failed to store access token. Could not save access token to database.'), 500, isProduction());
      }

      // Return success page
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>LinkedIn OAuth Success</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
              color: #0077b5;
              margin-bottom: 1rem;
            }
            .success {
              color: #10b981;
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">✓</div>
            <h1>LinkedIn OAuth Successful!</h1>
            <p>Your LinkedIn access token has been stored and is ready to use.</p>
            <div class="token-info">
              <strong>Token expires:</strong> ${new Date(expiresAt).toLocaleString()}
            </div>
            <p style="margin-top: 1.5rem; font-size: 0.875rem;">
              You can close this window and return to the application.
            </p>
          </div>
        </body>
        </html>
      `);
    }

    return sendErrorResponse(res, new Error('Invalid request'), 400);

  } catch (error) {
    logError('Error in linkedin-auth function:', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
}

