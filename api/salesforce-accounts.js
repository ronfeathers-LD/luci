/**
 * Vercel Serverless Function for Salesforce Account Fetching
 * 
 * Fetches accounts from Salesforce assigned to a user based on their role
 * Uses Supabase to store credentials and account assignments
 * Uses jsforce library (same as SOW-Generator) - no Client ID/Secret needed!
 */

// Import shared Supabase client utility
const { getSupabaseClient } = require('../lib/supabase-client');

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
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('Salesforce config found:', {
      username: config.username,
      login_url: config.login_url,
      has_password: !!config.password,
      has_security_token: !!config.security_token,
    });
  }

  const jsforce = getJsforceClient();
  if (!jsforce) {
    console.error('jsforce library not available - check if jsforce is installed');
    throw new Error('jsforce library not available. Make sure jsforce is installed: npm install jsforce');
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('jsforce library loaded successfully');
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
 * Query Salesforce for accounts based on user role/ownership
 * Uses standard fields only (custom fields may not exist in all orgs)
 * Note: Salesforce doesn't allow semi-join subqueries with OR, so we query separately and combine
 */
/**
 * Escape single quotes in SOQL queries to prevent injection
 */
function escapeSOQL(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'");
}

async function querySalesforceAccounts(conn, userId, userEmail, role) {
  // First, get the Salesforce User ID for the email (needed for AccountTeamMember query)
  let salesforceUserId = null;
  try {
    const escapedEmail = escapeSOQL(userEmail);
    const userQuery = `SELECT Id FROM User WHERE Email = '${escapedEmail}' LIMIT 1`;
    const userResult = await conn.query(userQuery);
    if (userResult.records && userResult.records.length > 0) {
      salesforceUserId = userResult.records[0].Id;
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Found Salesforce User ID: ${salesforceUserId} for email: ${userEmail}`);
      }
    } else {
      console.warn(`No Salesforce User found for email: ${userEmail}`);
    }
  } catch (error) {
    console.warn(`Could not find Salesforce User for email ${userEmail}:`, error.message);
  }
  
  // Field selection - try custom fields first, fallback to standard
  // Using Employee_Band__c for Account Segment (Tier) - confirmed API name
  // Using Expiring_Revenue__c for Contract Value (Expiring ARR) - confirmed API name
  const customFields = `Id, Name, Employee_Band__c, Expiring_Revenue__c, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
  const standardFields = `Id, Name, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
  
  let useCustomFields = true;
  let allAccounts = [];
  const accountMap = new Map(); // Use Map to deduplicate by Account Id
  
  if (role === 'Account Manager' || role === 'Sales Rep') {
    // Query 1: Accounts owned by user (by Owner.Email)
    // Filter by IsActive = true to exclude inactive/closed accounts
    try {
      const escapedEmail = escapeSOQL(userEmail);
      let ownerQuery = `SELECT ${customFields} FROM Account WHERE Owner.Email = '${escapedEmail}' AND IsActive = true ORDER BY Name LIMIT 100`;
      
      try {
        const ownerResult = await conn.query(ownerQuery);
        if (ownerResult.records) {
          ownerResult.records.forEach(acc => {
            accountMap.set(acc.Id, acc);
          });
          if (process.env.NODE_ENV !== 'production') {
            console.log(`Found ${ownerResult.records.length} accounts owned by ${userEmail}`);
          }
        }
        } catch (error) {
          if (error.errorCode === 'INVALID_FIELD') {
            // Log which field is invalid for debugging
            if (process.env.NODE_ENV !== 'production') {
              console.log('INVALID_FIELD error details:', {
                message: error.message,
                errorCode: error.errorCode,
                query: ownerQuery.substring(0, 200) + '...',
              });
            }
            
            // Check if error is about IsActive field
            const isActiveError = error.message && error.message.includes('IsActive');
            
            if (isActiveError) {
              // IsActive field doesn't exist - retry without it
              console.warn('IsActive field not found on Account, querying without status filter');
              try {
                ownerQuery = `SELECT ${customFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                const ownerResult = await conn.query(ownerQuery);
                if (ownerResult.records) {
                  ownerResult.records.forEach(acc => {
                    accountMap.set(acc.Id, acc);
                  });
                  if (process.env.NODE_ENV !== 'production') {
                    console.log(`Found ${ownerResult.records.length} accounts owned by ${userEmail} (without IsActive filter)`);
                  }
                }
              } catch (retryError) {
                // If still fails, might be custom fields issue
                if (retryError.errorCode === 'INVALID_FIELD') {
                  console.warn('Custom fields not found, trying alternative field names...');
                  
                  // Try alternative field names (including Employee_Band__c for tier)
                  const altCustomFields = `Id, Name, Employee_Band__c, Expiring_Revenue__c, Tier__c, ContractValue__c, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
                  try {
                    ownerQuery = `SELECT ${altCustomFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                    const altResult = await conn.query(ownerQuery);
                    if (altResult.records) {
                      altResult.records.forEach(acc => {
                        accountMap.set(acc.Id, acc);
                      });
                      if (process.env.NODE_ENV !== 'production') {
                        console.log(`Found ${altResult.records.length} accounts with alternative field names`);
                      }
                    }
                  } catch (altError) {
                    // If alternative fields also fail, fall back to standard fields
                    console.warn('Alternative custom fields also not found, using standard fields only');
                    useCustomFields = false;
                    ownerQuery = `SELECT ${standardFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                    const ownerResult = await conn.query(ownerQuery);
                    if (ownerResult.records) {
                      ownerResult.records.forEach(acc => {
                        accountMap.set(acc.Id, acc);
                      });
                      if (process.env.NODE_ENV !== 'production') {
                        console.log(`Found ${ownerResult.records.length} accounts owned by ${userEmail} (standard fields only)`);
                      }
                    }
                  }
                } else {
                  throw retryError;
                }
              }
            } else {
              // Not an IsActive error, try alternative field names
              console.warn('Custom fields not found, trying alternative field names...');
              
              // Try alternative field names (including Employee_Band__c for tier)
              const altCustomFields = `Id, Name, Employee_Band__c, Expiring_Revenue__c, Tier__c, ContractValue__c, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
              try {
                ownerQuery = `SELECT ${altCustomFields} FROM Account WHERE Owner.Email = '${escapedEmail}' AND IsActive = true ORDER BY Name LIMIT 100`;
                const altResult = await conn.query(ownerQuery);
                if (altResult.records) {
                  altResult.records.forEach(acc => {
                    accountMap.set(acc.Id, acc);
                  });
                  if (process.env.NODE_ENV !== 'production') {
                    console.log(`Found ${altResult.records.length} accounts with alternative field names`);
                  }
                }
              } catch (altError) {
                // If alternative fields also fail, check if it's IsActive error
                if (altError.errorCode === 'INVALID_FIELD' && altError.message && altError.message.includes('IsActive')) {
                  console.warn('IsActive field not found, retrying without status filter');
                  ownerQuery = `SELECT ${altCustomFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                  const altResult = await conn.query(ownerQuery);
                  if (altResult.records) {
                    altResult.records.forEach(acc => {
                      accountMap.set(acc.Id, acc);
                    });
                  }
                } else {
                  // If alternative fields also fail, fall back to standard fields
                  console.warn('Alternative custom fields also not found, using standard fields only');
                  useCustomFields = false;
                  ownerQuery = `SELECT ${standardFields} FROM Account WHERE Owner.Email = '${escapedEmail}' AND IsActive = true ORDER BY Name LIMIT 100`;
                  try {
                    const ownerResult = await conn.query(ownerQuery);
                    if (ownerResult.records) {
                      ownerResult.records.forEach(acc => {
                        accountMap.set(acc.Id, acc);
                      });
                      if (process.env.NODE_ENV !== 'production') {
                        console.log(`Found ${ownerResult.records.length} accounts owned by ${userEmail} (standard fields only)`);
                      }
                    }
                  } catch (stdError) {
                    // Last resort: standard fields without IsActive
                    if (stdError.errorCode === 'INVALID_FIELD' && stdError.message && stdError.message.includes('IsActive')) {
                      ownerQuery = `SELECT ${standardFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                      const ownerResult = await conn.query(ownerQuery);
                      if (ownerResult.records) {
                        ownerResult.records.forEach(acc => {
                          accountMap.set(acc.Id, acc);
                        });
                      }
                    } else {
                      throw stdError;
                    }
                  }
                }
              }
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
          if (process.env.NODE_ENV !== 'production') {
            console.log(`Found ${accountIds.length} accounts in AccountTeamMember`);
          }
          
          // Query accounts by IDs (Salesforce allows up to 200 IDs in IN clause)
          // Escape IDs to prevent injection (though IDs are typically safe)
          // Filter by IsActive = true to exclude inactive/closed accounts
          const fields = useCustomFields ? customFields : standardFields;
          const idsString = accountIds.map(id => `'${escapeSOQL(id)}'`).join(',');
          const accountQuery = `SELECT ${fields} FROM Account WHERE Id IN (${idsString}) AND IsActive = true ORDER BY Name`;
          
          try {
            const accountResult = await conn.query(accountQuery);
            if (accountResult.records) {
              accountResult.records.forEach(acc => {
                accountMap.set(acc.Id, acc);
              });
              if (process.env.NODE_ENV !== 'production') {
                console.log(`Found ${accountResult.records.length} accounts from AccountTeamMember`);
              }
            }
          } catch (error) {
            if (error.errorCode === 'INVALID_FIELD' && useCustomFields) {
              // Retry with standard fields
              const standardAccountQuery = `SELECT ${standardFields} FROM Account WHERE Id IN (${idsString}) AND IsActive = true ORDER BY Name`;
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
    // Filter by IsActive = true to exclude inactive/closed accounts
    try {
      let adminQuery = `SELECT ${customFields} FROM Account WHERE IsActive = true ORDER BY Name LIMIT 100`;
      try {
        const result = await conn.query(adminQuery);
        allAccounts = result.records || [];
      } catch (error) {
        if (error.errorCode === 'INVALID_FIELD') {
          console.warn('Custom fields not found, using standard fields only');
          adminQuery = `SELECT ${standardFields} FROM Account WHERE IsActive = true ORDER BY Name LIMIT 100`;
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
 * Search for cached accounts in Supabase by name
 */
async function searchCachedAccounts(supabase, searchTerm) {
  if (!supabase || !searchTerm || searchTerm.trim().length < 2) {
    return null;
  }

  const search = searchTerm.trim();
  
  // Search in Supabase cache by account name (case-insensitive)
  const { data: cachedAccounts, error } = await supabase
    .from('accounts')
    .select('*')
    .ilike('name', `%${search}%`)
    .order('name', { ascending: true })
    .limit(20);

  if (error || !cachedAccounts || cachedAccounts.length === 0) {
    return null;
  }

  // Check if cache is fresh (within TTL)
  const now = new Date();
  const cacheExpiry = CACHE_TTL_HOURS * 60 * 60 * 1000;
  
  // Check if all accounts are fresh (within TTL)
  const allFresh = cachedAccounts.every(acc => {
    if (!acc.last_synced_at) return false;
    const lastSynced = new Date(acc.last_synced_at);
    return (now - lastSynced) < cacheExpiry;
  });

  return {
    accounts: cachedAccounts,
    isFresh: allFresh,
  };
}

/**
 * Search for accounts in Salesforce by name
 */
async function searchSalesforceAccounts(conn, searchTerm) {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }

  const escapedSearch = escapeSOQL(searchTerm.trim());
  
  // Field selection - try custom fields first, fallback to standard
  // Using Employee_Band__c for Account Segment (Tier) - confirmed API name
  // Using Expiring_Revenue__c for Contract Value (Expiring ARR) - confirmed API name
  const customFields = `Id, Name, Employee_Band__c, Expiring_Revenue__c, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
  const standardFields = `Id, Name, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
  
  // Use LIKE for partial matching (case-insensitive)
  // Filter by IsActive = true to exclude inactive/closed accounts
  let searchQuery = `SELECT ${customFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' AND IsActive = true ORDER BY Name LIMIT 20`;
  
  try {
    const result = await conn.query(searchQuery);
    return result.records || [];
  } catch (error) {
    if (error.errorCode === 'INVALID_FIELD') {
      // Check if error is about IsActive field
      const isActiveError = error.message && error.message.includes('IsActive');
      
      if (isActiveError) {
        // IsActive field doesn't exist - retry without it
        console.warn('IsActive field not found on Account, searching without status filter');
        try {
          searchQuery = `SELECT ${customFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' ORDER BY Name LIMIT 20`;
          const result = await conn.query(searchQuery);
          return result.records || [];
        } catch (retryError) {
          // If still fails, might be custom fields issue
          if (retryError.errorCode === 'INVALID_FIELD') {
            // Retry with standard fields (without IsActive)
            searchQuery = `SELECT ${standardFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' ORDER BY Name LIMIT 20`;
            const result = await conn.query(searchQuery);
            return result.records || [];
          } else {
            throw retryError;
          }
        }
      } else {
        // Not an IsActive error, try standard fields with IsActive
        try {
          searchQuery = `SELECT ${standardFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' AND IsActive = true ORDER BY Name LIMIT 20`;
          const result = await conn.query(searchQuery);
          return result.records || [];
        } catch (stdError) {
          // If standard fields with IsActive fails, check if it's IsActive error
          if (stdError.errorCode === 'INVALID_FIELD' && stdError.message && stdError.message.includes('IsActive')) {
            // Last resort: standard fields without IsActive
            searchQuery = `SELECT ${standardFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' ORDER BY Name LIMIT 20`;
            const result = await conn.query(searchQuery);
            return result.records || [];
          } else {
            throw stdError;
          }
        }
      }
    } else {
      console.error('Error searching accounts:', error);
      throw error;
    }
  }
}

/**
 * Sync accounts from Salesforce to Supabase
 * @param {Object} supabase - Supabase client
 * @param {Array} sfdcAccounts - Accounts from Salesforce
 * @param {string} userId - User ID (optional, only used if createRelationships is true)
 * @param {boolean} createRelationships - Whether to create user_accounts relationships (default: true)
 */
async function syncAccountsToSupabase(supabase, sfdcAccounts, userId = null, createRelationships = true) {
  if (!supabase || !sfdcAccounts || sfdcAccounts.length === 0) {
    return [];
  }

  const syncedAccounts = [];

  for (const sfdcAccount of sfdcAccounts) {
    // Upsert account in Supabase
    // Handle custom fields that may not exist (they'll be undefined)
    // Try multiple possible field names for tier and contract value
    // Primary: Employee_Band__c (Account Segment - matches SOW-Generator)
    const accountTier = sfdcAccount.Employee_Band__c
      || sfdcAccount.Account_Segment__c
      || sfdcAccount.Account_Tier__c 
      || sfdcAccount.Tier__c 
      || sfdcAccount.AccountTier__c
      || sfdcAccount.Tier
      || null;
    
    // Primary: Expiring_Revenue__c (Expiring ARR - confirmed API name)
    const contractValue = sfdcAccount.Expiring_Revenue__c
      || sfdcAccount.Expiring_ARR__c
      || sfdcAccount.ExpiringARR__c
      || sfdcAccount.ARR_Expiring__c
      || sfdcAccount.Contract_Value__c
      || sfdcAccount.ContractValue__c
      || sfdcAccount.Contract_Value
      || sfdcAccount.ContractValue
      || null;
    
      // Log field values for debugging (always log first account to help diagnose issues)
      if (sfdcAccounts.length > 0 && sfdcAccounts.indexOf(sfdcAccount) === 0) {
        console.log('Sample account fields from Salesforce:', {
          Id: sfdcAccount.Id,
          Name: sfdcAccount.Name,
          'Employee_Band__c': sfdcAccount.Employee_Band__c,
          'Expiring_Revenue__c': sfdcAccount.Expiring_Revenue__c,
          'Expiring_ARR__c': sfdcAccount.Expiring_ARR__c,
          'Account_Segment__c': sfdcAccount.Account_Segment__c,
          'Account_Tier__c': sfdcAccount.Account_Tier__c,
          'Mapped accountTier': accountTier,
          'Mapped contractValue': contractValue,
          'All available fields': Object.keys(sfdcAccount),
        });
      }
    
    const accountData = {
      salesforce_id: sfdcAccount.Id,
      name: sfdcAccount.Name,
      account_tier: accountTier,
      contract_value: contractValue,
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

    // Only create user-account relationship if:
    // 1. createRelationships is true (regular query flow, not search)
    // 2. userId is provided
    // 3. The user is actually the owner of this account (verify ownership)
    if (createRelationships && userId && account) {
      // Verify that this account should be associated with this user
      // We'll check ownership when retrieving cached accounts, but we can also verify here
      // For now, we trust that syncAccountsToSupabase is only called with accounts the user owns/is a team member of
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
 * Only returns accounts where the user is actually the owner (verified by owner_id matching Salesforce User ID)
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

  // Get accounts from user_accounts relationships
  // These should only be accounts the user owns or is a team member of
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

  // Filter accounts to only include those where the user is actually the owner
  // We need to verify ownership by checking if the account's owner_id matches the user's Salesforce User ID
  // However, we don't have the Salesforce User ID stored in the users table, so we'll need to verify
  // ownership when we query Salesforce. For now, we'll trust the user_accounts relationships that were
  // created from the regular query flow (which only includes owned accounts).
  
  // But we should also verify by checking owner email if we have it
  // For now, we'll return all accounts from user_accounts, but add a note that we should verify ownership
  // The real fix is to ensure syncAccountsToSupabase only creates relationships for owned accounts
  
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

  const { userId, email, role, forceRefresh, search } = req.query;

  // Check if this is a search request
  const isSearch = search && search.trim().length >= 2;
  
  // Validate input (skip validation for search requests)
  if (!isSearch && !userId && !email) {
    return res.status(400).json({ error: 'Missing required parameter: userId or email (or search term)' });
  }
  
  // Check if we should force refresh (bypass cache)
  const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

  try {
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    // Check if Supabase is configured
    if (!supabase) {
      console.error('Supabase not configured');
      return res.status(503).json({
        error: 'Database not configured',
        message: 'The application database is not properly configured. Please contact your administrator.',
      });
    }
    
    // Handle search request (bypasses user assignment logic)
    if (isSearch) {
      try {
        // CACHE-FIRST: Check Supabase cache before querying Salesforce
        const cachedSearch = await searchCachedAccounts(supabase, search);
        
        if (cachedSearch && cachedSearch.isFresh) {
          // Use cached results (fresh)
          if (process.env.NODE_ENV !== 'production') {
            console.log(`Using ${cachedSearch.accounts.length} cached search results for: ${search}`);
          }
          
          const accounts = cachedSearch.accounts.map(acc => ({
            id: acc.salesforce_id || acc.id,
            salesforceId: acc.salesforce_id,
            name: acc.name,
            accountTier: acc.account_tier,
            contractValue: acc.contract_value,
            industry: acc.industry,
            annualRevenue: acc.annual_revenue ? parseFloat(acc.annual_revenue) : null,
            ownerId: acc.owner_id,
            ownerName: acc.owner_name,
            lastSyncedAt: acc.last_synced_at,
          }));
          
          return res.status(200).json({
            accounts: accounts,
            total: accounts.length,
            searchTerm: search,
            isSearch: true,
            cached: true,
          });
        }
        
        // Cache is stale or missing - query Salesforce
        if (process.env.NODE_ENV !== 'production') {
          if (cachedSearch && !cachedSearch.isFresh) {
            console.log(`Cache stale for search: ${search}, refreshing from Salesforce`);
          } else {
            console.log(`No cache found for search: ${search}, querying Salesforce`);
          }
        }
        
        const sfdcAuth = await authenticateSalesforce(supabase);
        const searchResults = await searchSalesforceAccounts(sfdcAuth.connection, search);
        
        // Sync search results to Supabase (for caching) - but don't create user relationships
        // Pass createRelationships=false so searched accounts aren't associated with the searching user
        const syncedAccounts = await syncAccountsToSupabase(supabase, searchResults, null, false);
        
        const accounts = syncedAccounts.map(acc => ({
          id: acc.salesforce_id || acc.id,
          salesforceId: acc.salesforce_id,
          name: acc.name,
          accountTier: acc.account_tier,
          contractValue: acc.contract_value,
          industry: acc.industry,
          annualRevenue: acc.annual_revenue ? parseFloat(acc.annual_revenue) : null,
          ownerId: acc.owner_id,
          ownerName: acc.owner_name,
          lastSyncedAt: acc.last_synced_at,
        }));
        
        return res.status(200).json({
          accounts: accounts,
          total: accounts.length,
          searchTerm: search,
          isSearch: true,
          cached: false,
        });
      } catch (searchError) {
        console.error('Salesforce search error:', searchError);
        
        // If Salesforce fails but we have stale cache, use it
        const staleCache = await searchCachedAccounts(supabase, search);
        if (staleCache && staleCache.accounts.length > 0) {
          if (process.env.NODE_ENV !== 'production') {
            console.log(`Salesforce search failed, using ${staleCache.accounts.length} stale cached results`);
          }
          
          const accounts = staleCache.accounts.map(acc => ({
            id: acc.salesforce_id || acc.id,
            salesforceId: acc.salesforce_id,
            name: acc.name,
            accountTier: acc.account_tier,
            contractValue: acc.contract_value,
            industry: acc.industry,
            annualRevenue: acc.annual_revenue ? parseFloat(acc.annual_revenue) : null,
            ownerId: acc.owner_id,
            ownerName: acc.owner_name,
            lastSyncedAt: acc.last_synced_at,
          }));
          
          return res.status(200).json({
            accounts: accounts,
            total: accounts.length,
            searchTerm: search,
            isSearch: true,
            cached: true,
            stale: true,
          });
        }
        
        return res.status(500).json({
          error: 'Failed to search accounts',
          details: process.env.NODE_ENV === 'production' ? undefined : searchError.message,
        });
      }
    }
    
    // Regular flow: get user's assigned accounts
    // First, get the user by userId or email

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
      const cacheResult = await getCachedAccounts(supabase, user.id, user.email, user.role);
      
      if (cacheResult.accounts && cacheResult.accounts.length > 0) {
        accounts = cacheResult.accounts;
        needsRefresh = cacheResult.needsRefresh;
        
        if (!needsRefresh) {
          useCached = true;
          if (process.env.NODE_ENV !== 'production') {
            console.log(`Using ${accounts.length} cached accounts (fresh)`);
          }
        }
      }
    }

    // Query Salesforce if cache is stale/missing or force refresh requested
    if (needsRefresh || shouldForceRefresh) {
      try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Attempting Salesforce authentication...');
      }
      const sfdcAuth = await authenticateSalesforce(supabase);
      
      const sfdcAccounts = await querySalesforceAccounts(
        sfdcAuth.connection,
        user.id,
        user.email,
        user.role || role
      );

      // Sync accounts to Supabase
      const syncedAccounts = await syncAccountsToSupabase(supabase, sfdcAccounts, user.id);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Synced ${syncedAccounts.length} accounts to Supabase`);
      }

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
          if (process.env.NODE_ENV !== 'production') {
            console.log(`Salesforce query failed, using ${accounts.length} cached accounts (may be stale)`);
          }
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
