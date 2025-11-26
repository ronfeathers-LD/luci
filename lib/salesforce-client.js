/**
 * Shared Salesforce Client Utilities
 * 
 * Centralized Salesforce authentication and common operations
 */

const { getSupabaseClient } = require('./supabase-client');
const { log, logError, logWarn, isProduction } = require('./api-helpers');

/**
 * Get jsforce client library
 */
function getJsforceClient() {
  try {
    const jsforce = require('jsforce');
    return jsforce;
  } catch (error) {
    logWarn('jsforce not available:', error.message);
    return null;
  }
}

/**
 * Authenticate with Salesforce using jsforce
 * 
 * @param {Object} supabase - Supabase client instance
 * @returns {Promise<Object>} Connection object with connection, instanceUrl, and accessToken
 */
async function authenticateSalesforce(supabase) {
  // Get Salesforce config from Supabase
  const { data: config, error: configError } = await supabase
    .from('salesforce_configs')
    .select('*')
    .eq('is_active', true)
    .single();

  if (configError) {
    logError('Error fetching Salesforce config:', configError);
    throw new Error(`Error fetching Salesforce config: ${configError.message}`);
  }
  
  if (!config) {
    logError('No active Salesforce configuration found in salesforce_configs table');
    throw new Error('Salesforce configuration not found in Supabase. Please insert credentials into salesforce_configs table.');
  }
  
  const jsforce = getJsforceClient();
  if (!jsforce) {
    logError('jsforce library not available');
    throw new Error('jsforce library not available. Make sure jsforce is installed: npm install jsforce');
  }

  // Clean login URL (handle custom domains like leandata.my.salesforce.com)
  let loginUrl = config.login_url || 'https://login.salesforce.com';
  loginUrl = loginUrl.trim().replace(/\/$/, '');
  
  // For custom domains ending in .my.salesforce.com, keep as-is
  // jsforce will handle the authentication
  if (!loginUrl.startsWith('http://') && !loginUrl.startsWith('https://')) {
    loginUrl = 'https://' + loginUrl;
  }

  // Create connection
  const conn = new jsforce.Connection({
    loginUrl: loginUrl
  });

  // Authenticate (jsforce handles OAuth internally - no Client ID/Secret needed!)
  try {
    await conn.login(config.username, config.password + (config.security_token || ''));
  } catch (error) {
    // Try with password only if first attempt fails
    if (error.message && error.message.includes('INVALID_LOGIN')) {
      await conn.login(config.username, config.password);
    } else {
      throw error;
    }
  }

  return {
    connection: conn,
    instanceUrl: conn.instanceUrl,
    accessToken: conn.accessToken,
  };
}

/**
 * Escape single quotes in SOQL queries to prevent injection
 * 
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeSOQL(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'");
}

module.exports = {
  getJsforceClient,
  authenticateSalesforce,
  escapeSOQL,
};

