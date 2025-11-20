/**
 * Vercel Serverless Function for Salesforce Authentication
 * 
 * Handles Salesforce OAuth authentication and token management
 * Uses Username-Password OAuth flow for server-to-server authentication
 */

// Helper function to get Supabase client
function getSupabaseClient() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (supabaseUrl && supabaseServiceKey) {
      return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }
  } catch (error) {
    console.warn('Supabase client not available:', error.message);
  }
  return null;
}

/**
 * Authenticate with Salesforce using Username-Password OAuth flow
 * Returns access token and instance URL
 */
async function authenticateSalesforce() {
  const username = process.env.SFDC_USERNAME;
  const password = process.env.SFDC_PASSWORD;
  const securityToken = process.env.SFDC_SECURITY_TOKEN;
  const clientId = process.env.SFDC_CLIENT_ID;
  const clientSecret = process.env.SFDC_CLIENT_SECRET;
  const loginUrl = process.env.SFDC_LOGIN_URL || 'https://login.salesforce.com';

  if (!username || !password || !clientId || !clientSecret) {
    throw new Error('Salesforce credentials not configured');
  }

  // Construct the password (password + security token if provided)
  const fullPassword = securityToken ? `${password}${securityToken}` : password;

  // OAuth token endpoint
  const tokenUrl = `${loginUrl}/services/oauth2/token`;

  const params = new URLSearchParams({
    grant_type: 'password',
    client_id: clientId,
    client_secret: clientSecret,
    username: username,
    password: fullPassword,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Salesforce authentication failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    instanceUrl: data.instance_url,
    tokenType: data.token_type,
    expiresIn: data.expires_in,
  };
}

/**
 * Get cached access token from Supabase or authenticate
 */
async function getAccessToken() {
  const supabase = getSupabaseClient();
  
  // Try to get cached token from Supabase (if you have a tokens table)
  // For now, we'll always authenticate fresh
  // TODO: Implement token caching in Supabase
  
  const authData = await authenticateSalesforce();
  return authData;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authData = await getAccessToken();
    
    return res.status(200).json({
      success: true,
      instanceUrl: authData.instanceUrl,
      // Don't return the actual token for security
      tokenType: authData.tokenType,
    });
  } catch (error) {
    console.error('Error in salesforce-auth function:', error);
    return res.status(500).json({ 
      error: process.env.NODE_ENV === 'production' 
        ? 'Failed to authenticate with Salesforce' 
        : error.message 
    });
  }
}

