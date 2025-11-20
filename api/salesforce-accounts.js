/**
 * Vercel Serverless Function for Salesforce Account Fetching
 * 
 * Fetches accounts from Salesforce assigned to a user based on their role
 * Uses Supabase to store credentials and account assignments
 * Uses jsforce library (same as SOW-Generator) - no Client ID/Secret needed!
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

// Helper function to get jsforce client
function getJsforceClient() {
  try {
    const jsforce = require('jsforce');
    return jsforce;
  } catch (error) {
    console.warn('jsforce not available:', error.message);
    return null;
  }
}

/**
 * Authenticate with Salesforce using jsforce (same as SOW-Generator)
 */
async function authenticateSalesforce(supabase) {
  // Get Salesforce config from Supabase (same pattern as SOW-Generator)
  const { data: config, error: configError } = await supabase
    .from('salesforce_configs')
    .select('*')
    .eq('is_active', true)
    .single();

  if (configError) {
    console.error('Error fetching Salesforce config:', configError);
    throw new Error(`Error fetching Salesforce config: ${configError.message}`);
  }
  
  if (!config) {
    console.error('No active Salesforce configuration found in salesforce_configs table');
    throw new Error('Salesforce configuration not found in Supabase. Please insert credentials into salesforce_configs table.');
  }
  
  console.log('Salesforce config found:', {
    username: config.username,
    login_url: config.login_url,
    has_password: !!config.password,
    has_security_token: !!config.security_token,
  });

  const jsforce = getJsforceClient();
  if (!jsforce) {
    console.error('jsforce library not available - check if jsforce is installed');
    throw new Error('jsforce library not available. Make sure jsforce is installed: npm install jsforce');
  }
  
  console.log('jsforce library loaded successfully');

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
 * Query Salesforce for accounts based on user role/ownership
 * Uses standard fields only (custom fields may not exist in all orgs)
 * Note: Salesforce doesn't allow semi-join subqueries with OR, so we query separately and combine
 */
async function querySalesforceAccounts(conn, userId, userEmail, role) {
  // First, get the Salesforce User ID for the email (needed for AccountTeamMember query)
  let salesforceUserId = null;
  try {
    const userQuery = `SELECT Id FROM User WHERE Email = '${userEmail}' LIMIT 1`;
    const userResult = await conn.query(userQuery);
    if (userResult.records && userResult.records.length > 0) {
      salesforceUserId = userResult.records[0].Id;
      console.log(`Found Salesforce User ID: ${salesforceUserId} for email: ${userEmail}`);
    } else {
      console.warn(`No Salesforce User found for email: ${userEmail}`);
    }
  } catch (error) {
    console.warn(`Could not find Salesforce User for email ${userEmail}:`, error.message);
  }
  
  // Field selection - try custom fields first, fallback to standard
  const customFields = `Id, Name, Account_Tier__c, Contract_Value__c, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
  const standardFields = `Id, Name, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
  
  let useCustomFields = true;
  let allAccounts = [];
  const accountMap = new Map(); // Use Map to deduplicate by Account Id
  
  if (role === 'Account Manager' || role === 'Sales Rep') {
    // Query 1: Accounts owned by user (by Owner.Email)
    try {
      let ownerQuery = `SELECT ${customFields} FROM Account WHERE Owner.Email = '${userEmail}' ORDER BY Name LIMIT 100`;
      
      try {
        const ownerResult = await conn.query(ownerQuery);
        if (ownerResult.records) {
          ownerResult.records.forEach(acc => {
            accountMap.set(acc.Id, acc);
          });
          console.log(`Found ${ownerResult.records.length} accounts owned by ${userEmail}`);
        }
      } catch (error) {
        if (error.errorCode === 'INVALID_FIELD') {
          console.warn('Custom fields not found, using standard fields only');
          useCustomFields = false;
          ownerQuery = `SELECT ${standardFields} FROM Account WHERE Owner.Email = '${userEmail}' ORDER BY Name LIMIT 100`;
          const ownerResult = await conn.query(ownerQuery);
          if (ownerResult.records) {
            ownerResult.records.forEach(acc => {
              accountMap.set(acc.Id, acc);
            });
            console.log(`Found ${ownerResult.records.length} accounts owned by ${userEmail}`);
          }
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error querying accounts by owner:', error);
    }
    
    // Query 2: Accounts from AccountTeamMember (if we have User ID)
    if (salesforceUserId) {
      try {
        // First get Account IDs from AccountTeamMember
        const teamMemberQuery = `SELECT AccountId FROM AccountTeamMember WHERE UserId = '${salesforceUserId}' LIMIT 100`;
        const teamResult = await conn.query(teamMemberQuery);
        
        if (teamResult.records && teamResult.records.length > 0) {
          const accountIds = teamResult.records.map(tm => tm.AccountId);
          console.log(`Found ${accountIds.length} accounts in AccountTeamMember`);
          
          // Query accounts by IDs (Salesforce allows up to 200 IDs in IN clause)
          const fields = useCustomFields ? customFields : standardFields;
          const idsString = accountIds.map(id => `'${id}'`).join(',');
          const accountQuery = `SELECT ${fields} FROM Account WHERE Id IN (${idsString}) ORDER BY Name`;
          
          try {
            const accountResult = await conn.query(accountQuery);
            if (accountResult.records) {
              accountResult.records.forEach(acc => {
                accountMap.set(acc.Id, acc);
              });
              console.log(`Found ${accountResult.records.length} accounts from AccountTeamMember`);
            }
          } catch (error) {
            if (error.errorCode === 'INVALID_FIELD' && useCustomFields) {
              // Retry with standard fields
              const standardAccountQuery = `SELECT ${standardFields} FROM Account WHERE Id IN (${idsString}) ORDER BY Name`;
              const accountResult = await conn.query(standardAccountQuery);
              if (accountResult.records) {
                accountResult.records.forEach(acc => {
                  accountMap.set(acc.Id, acc);
                });
              }
            } else {
              console.error('Error querying accounts from AccountTeamMember:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error querying AccountTeamMember:', error);
      }
    }
    
    // Convert Map to array
    allAccounts = Array.from(accountMap.values());
    
  } else {
    // For admins or other roles, get all accounts
    try {
      let adminQuery = `SELECT ${customFields} FROM Account ORDER BY Name LIMIT 100`;
      try {
        const result = await conn.query(adminQuery);
        allAccounts = result.records || [];
      } catch (error) {
        if (error.errorCode === 'INVALID_FIELD') {
          console.warn('Custom fields not found, using standard fields only');
          adminQuery = `SELECT ${standardFields} FROM Account ORDER BY Name LIMIT 100`;
          const result = await conn.query(adminQuery);
          allAccounts = result.records || [];
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error querying all accounts:', error);
      throw error;
    }
  }
  
  return allAccounts;
}

/**
 * Sync accounts from Salesforce to Supabase
 */
async function syncAccountsToSupabase(supabase, sfdcAccounts, userId) {
  if (!supabase || !sfdcAccounts || sfdcAccounts.length === 0) {
    return [];
  }

  const syncedAccounts = [];

  for (const sfdcAccount of sfdcAccounts) {
    // Upsert account in Supabase
    // Handle custom fields that may not exist (they'll be undefined)
    const accountData = {
      salesforce_id: sfdcAccount.Id,
      name: sfdcAccount.Name,
      account_tier: sfdcAccount.Account_Tier__c || null, // Custom field - may not exist
      contract_value: sfdcAccount.Contract_Value__c || null, // Custom field - may not exist
      industry: sfdcAccount.Industry || null,
      annual_revenue: sfdcAccount.AnnualRevenue || null,
      owner_id: sfdcAccount.OwnerId || null,
      owner_name: sfdcAccount.Owner?.Name || null,
      last_synced_at: new Date().toISOString(), // Track when this account was last synced
    };

    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .upsert(accountData, {
        onConflict: 'salesforce_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (accountError) {
      console.error(`Error syncing account ${sfdcAccount.Id}:`, accountError);
      continue;
    }

    // Create user-account relationship if it doesn't exist
    if (userId && account) {
      const { error: relationError } = await supabase
        .from('user_accounts')
        .upsert({
          user_id: userId,
          account_id: account.id,
        }, {
          onConflict: 'user_id,account_id',
          ignoreDuplicates: true,
        });

      if (relationError) {
        console.error(`Error creating user-account relationship:`, relationError);
      }
    }

    syncedAccounts.push(account);
  }

  return syncedAccounts;
}

/**
 * Get cached accounts from Supabase
 * Returns accounts and whether they need refresh (based on last_synced_at)
 */
async function getCachedAccounts(supabase, userId, email, role) {
  if (!supabase) {
    return { accounts: null, needsRefresh: true };
  }

  // Get user
  let user;
  if (userId) {
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    user = userData;
  } else if (email) {
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    user = userData;
  }

  if (!user) {
    return { accounts: null, needsRefresh: true };
  }

  // Get accounts with last_synced_at
  const { data: userAccounts } = await supabase
    .from('user_accounts')
    .select(`
      account_id,
      accounts (
        id,
        salesforce_id,
        name,
        account_tier,
        contract_value,
        industry,
        annual_revenue,
        owner_id,
        owner_name,
        last_synced_at
      )
    `)
    .eq('user_id', user.id);

  if (!userAccounts || userAccounts.length === 0) {
    return { accounts: null, needsRefresh: true };
  }

  // Check if any account needs refresh (older than CACHE_TTL_HOURS)
  const now = new Date();
  const cacheExpiry = CACHE_TTL_HOURS * 60 * 60 * 1000; // Convert hours to milliseconds
  let needsRefresh = false;

  const accounts = userAccounts.map(ua => {
    const account = ua.accounts;
    const lastSynced = account.last_synced_at ? new Date(account.last_synced_at) : null;
    
    // Check if this account needs refresh
    if (!lastSynced || (now - lastSynced) > cacheExpiry) {
      needsRefresh = true;
    }

    return {
      id: account.salesforce_id || account.id,
      salesforceId: account.salesforce_id,
      name: account.name,
      accountTier: account.account_tier,
      contractValue: account.contract_value,
      industry: account.industry,
      annualRevenue: account.annual_revenue ? parseFloat(account.annual_revenue) : null,
      ownerId: account.owner_id,
      ownerName: account.owner_name,
    };
  });

  return { accounts, needsRefresh };
}

// Constants
const MAX_REQUEST_SIZE = 1024 * 1024; // 1MB
const REQUEST_TIMEOUT = 30000; // 30 seconds
const CACHE_TTL_HOURS = 1; // Cache accounts for 1 hour before refreshing from Salesforce

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check request size
  const contentLength = req.headers['content-length'];
  if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
    return res.status(413).json({ error: 'Request too large' });
  }

  const { userId, email, role, forceRefresh } = req.query;

  // Validate input
  if (!userId && !email) {
    return res.status(400).json({ error: 'Missing required parameter: userId or email' });
  }
  
  // Check if we should force refresh (bypass cache)
  const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

  try {
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    // Check if Supabase is configured
    if (!supabase) {
      // Fallback to mock data if Supabase not configured
      console.warn('Supabase not configured, using mock data');
      const mockAccounts = [
        {
          id: '001XX000004ABCD',
          salesforceId: '001XX000004ABCD',
          name: 'Acme Corp',
          accountTier: 'Enterprise (Tier 1)',
          contractValue: '$120,000/year',
          ownerId: userId || 'mock-user-id',
          ownerName: 'Sarah Johnson',
          industry: 'Technology',
          annualRevenue: 5000000,
        },
        {
          id: '001XX000004EFGH',
          salesforceId: '001XX000004EFGH',
          name: 'TechStart Inc',
          accountTier: 'Enterprise (Tier 2)',
          contractValue: '$85,000/year',
          ownerId: userId || 'mock-user-id',
          ownerName: 'Sarah Johnson',
          industry: 'Software',
          annualRevenue: 2500000,
        },
      ];

      return res.status(200).json({
        accounts: mockAccounts,
        total: mockAccounts.length,
        userId: userId || email,
        role: role || 'Account Manager',
      });
    }

    // First, get the user by userId or email
    let user;
    if (userId) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }
      user = userData;
    } else if (email) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }
      user = userData;
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check cache first (unless force refresh is requested)
    let accounts = [];
    let useCached = false;
    let needsRefresh = true;

    if (!shouldForceRefresh) {
      console.log('Checking cached accounts...');
      const cacheResult = await getCachedAccounts(supabase, user.id, user.email, user.role);
      
      if (cacheResult.accounts && cacheResult.accounts.length > 0) {
        accounts = cacheResult.accounts;
        needsRefresh = cacheResult.needsRefresh;
        
        if (!needsRefresh) {
          console.log(`Using ${accounts.length} cached accounts (fresh)`);
          useCached = true;
        } else {
          console.log(`Found ${accounts.length} cached accounts, but they need refresh`);
        }
      } else {
        console.log('No cached accounts found, will query Salesforce');
      }
    } else {
      console.log('Force refresh requested, skipping cache');
    }

    // Query Salesforce if cache is stale/missing or force refresh requested
    if (needsRefresh || shouldForceRefresh) {
      try {
        console.log('Attempting Salesforce authentication...');
        const sfdcAuth = await authenticateSalesforce(supabase);
        console.log('Salesforce authenticated successfully');
        
        console.log('Querying Salesforce accounts...');
        const sfdcAccounts = await querySalesforceAccounts(
          sfdcAuth.connection,
          user.id,
          user.email,
          user.role || role
        );
        console.log(`Found ${sfdcAccounts.length} accounts in Salesforce`);

        // Sync accounts to Supabase
        const syncedAccounts = await syncAccountsToSupabase(supabase, sfdcAccounts, user.id);
        console.log(`Synced ${syncedAccounts.length} accounts to Supabase`);

        // Transform to expected format
        accounts = syncedAccounts.map(acc => ({
          id: acc.salesforce_id || acc.id,
          salesforceId: acc.salesforce_id,
          name: acc.name,
          accountTier: acc.account_tier,
          contractValue: acc.contract_value,
          industry: acc.industry,
          annualRevenue: acc.annual_revenue ? parseFloat(acc.annual_revenue) : null,
          ownerId: acc.owner_id,
          ownerName: acc.owner_name,
        }));
        
        useCached = false;
      } catch (sfdcError) {
        console.error('Salesforce API error:', sfdcError);
        
        // If we have cached accounts, use them even if stale
        if (accounts.length > 0) {
          console.log(`Salesforce query failed, using ${accounts.length} cached accounts (may be stale)`);
          useCached = true;
        } else {
          // No cached accounts available, return error
          return res.status(500).json({
            error: 'Failed to fetch accounts from Salesforce and no cached accounts available',
            details: process.env.NODE_ENV === 'production' 
              ? 'Check server logs for details' 
              : sfdcError.message,
          });
        }
      }
    }

    return res.status(200).json({
      accounts: accounts,
      total: accounts.length,
      userId: user.id,
      role: user.role || role || 'Account Manager',
      cached: useCached,
    });
  } catch (error) {
    console.error('Error in salesforce-accounts function:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: 'Failed to fetch accounts from Salesforce',
      details: process.env.NODE_ENV === 'production' 
        ? 'Check server logs for details' 
        : {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
    });
  }
}
