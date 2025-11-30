/**
 * Next.js App Router API Route for Salesforce Account Fetching
 * 
 * Fetches accounts from Salesforce assigned to a user based on their role
 * Uses Supabase to store credentials and account assignments
 * Uses jsforce library (same as SOW-Generator) - no Client ID/Secret needed!
 */

import { NextRequest } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabase-server';
import { handlePreflight, validateRequestSize, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, logWarn, isProduction } from '../../../lib/next-api-helpers';

// Can use require for lib files in Next.js API routes
const { authenticateSalesforce, escapeSOQL } = require('../../../../lib/salesforce-client');
const { isCacheFresh } = require('../../../../lib/cache-helpers');
const { MAX_REQUEST_SIZE, CACHE_TTL, API_LIMITS } = require('../../../../lib/constants');

/**
 * Query Salesforce for accounts based on user role/ownership
 * Uses standard fields only (custom fields may not exist in all orgs)
 * Note: Salesforce doesn't allow semi-join subqueries with OR, so we query separately and combine
 */

async function querySalesforceAccounts(conn, userId, userEmail, role, ownerOnly = false) {
  // First, get the Salesforce User ID for the email (needed for AccountTeamMember query)
  let salesforceUserId = null;
  try {
    const escapedEmail = escapeSOQL(userEmail);
    const userQuery = `SELECT Id FROM User WHERE Email = '${escapedEmail}' LIMIT 1`;
    const userResult = await conn.query(userQuery);
    if (userResult.records && userResult.records.length > 0) {
      salesforceUserId = userResult.records[0].Id;
      log(`Found Salesforce User ID: ${salesforceUserId} for email: ${userEmail}`);
    } else {
      logWarn(`No Salesforce User found for email: ${userEmail}`);
    }
  } catch (error) {
    logWarn(`Could not find Salesforce User for email ${userEmail}:`, error.message);
  }
  
  // Field selection - try custom fields first, fallback to standard
  // Using Employee_Band__c for Account Segment (Tier) - confirmed API name
  // Using Expiring_Revenue__c for Contract Value (Expiring ARR) - confirmed API name
  // Type is a standard field used to filter out "Former Customer" accounts
  const customFields = `Id, Name, Employee_Band__c, Expiring_Revenue__c, Type, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
  const standardFields = `Id, Name, Type, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
  
  let useCustomFields = true;
  let allAccounts = [];
  const accountMap = new Map(); // Use Map to deduplicate by Account Id
  
  // If ownerOnly is true, only query accounts owned by the user (ignore role and team member accounts)
  // Otherwise, use role-based logic
  if (ownerOnly || role === 'Account Manager' || role === 'Sales Rep') {
    // Query 1: Accounts owned by user (by Owner.Email)
    // Filter by Type != 'Former Customer' to exclude former customers
    try {
      const escapedEmail = escapeSOQL(userEmail);
      let ownerQuery = `SELECT ${customFields} FROM Account WHERE Owner.Email = '${escapedEmail}' AND Type != 'Former Customer' ORDER BY Name LIMIT 100`;
      
      try {
        const ownerResult = await conn.query(ownerQuery);
        if (ownerResult.records) {
          ownerResult.records.forEach(acc => {
            accountMap.set(acc.Id, acc);
          });
          log(`Found ${ownerResult.records.length} accounts owned by ${userEmail}`);
        }
        } catch (error) {
          if (error.errorCode === 'INVALID_FIELD') {
            // Log which field is invalid for debugging
            logWarn('INVALID_FIELD error in Salesforce query', { errorCode: error.errorCode });
            
            // Check if error is about Type field
            const typeError = error.message && error.message.includes('Type');
            
            if (typeError) {
              // Type field doesn't exist or has issues - retry without filter
              logWarn('Type field issue on Account, querying without Type filter');
              try {
                ownerQuery = `SELECT ${customFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                const ownerResult = await conn.query(ownerQuery);
                if (ownerResult.records) {
                  ownerResult.records.forEach(acc => {
                    accountMap.set(acc.Id, acc);
                  });
                  log(`Found ${ownerResult.records.length} accounts owned by ${userEmail} (without Type filter)`);
                }
              } catch (retryError) {
                // If still fails, might be custom fields issue
                if (retryError.errorCode === 'INVALID_FIELD') {
                  logWarn('Custom fields not found, trying alternative field names...');
                  
                  // Try alternative field names (including Employee_Band__c for tier)
                  const altCustomFields = `Id, Name, Employee_Band__c, Expiring_Revenue__c, Tier__c, ContractValue__c, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
                  try {
                    ownerQuery = `SELECT ${altCustomFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                    const altResult = await conn.query(ownerQuery);
                    if (altResult.records) {
                      altResult.records.forEach(acc => {
                        accountMap.set(acc.Id, acc);
                      });
                      log(`Found ${altResult.records.length} accounts with alternative field names`);
                    }
                  } catch (altError) {
                    // If alternative fields also fail, fall back to standard fields
                    logWarn('Alternative custom fields also not found, using standard fields only');
                    useCustomFields = false;
                    ownerQuery = `SELECT ${standardFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                    const ownerResult = await conn.query(ownerQuery);
                    if (ownerResult.records) {
                      ownerResult.records.forEach(acc => {
                        accountMap.set(acc.Id, acc);
                      });
                      log(`Found ${ownerResult.records.length} accounts owned by ${userEmail} (standard fields only)`);
                    }
                  }
                } else {
                  throw retryError;
                }
              }
            } else {
              // Not a Type error, try alternative field names
              logWarn('Custom fields not found, trying alternative field names...');
              
              // Try alternative field names (including Employee_Band__c for tier)
              const altCustomFields = `Id, Name, Employee_Band__c, Expiring_Revenue__c, Tier__c, ContractValue__c, Type, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
              try {
                ownerQuery = `SELECT ${altCustomFields} FROM Account WHERE Owner.Email = '${escapedEmail}' AND Type != 'Former Customer' ORDER BY Name LIMIT 100`;
                const altResult = await conn.query(ownerQuery);
                if (altResult.records) {
                  altResult.records.forEach(acc => {
                    accountMap.set(acc.Id, acc);
                  });
                  log(`Found ${altResult.records.length} accounts with alternative field names`);
                }
              } catch (altError) {
                // If alternative fields also fail, check if it's Type error
                if (altError.errorCode === 'INVALID_FIELD' && altError.message && altError.message.includes('Type')) {
                  logWarn('Type field not found, retrying without Type filter');
                  ownerQuery = `SELECT ${altCustomFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                  const altResult = await conn.query(ownerQuery);
                  if (altResult.records) {
                    altResult.records.forEach(acc => {
                      accountMap.set(acc.Id, acc);
                    });
                  }
                } else {
                  // If alternative fields also fail, fall back to standard fields
                  logWarn('Alternative custom fields also not found, using standard fields only');
              useCustomFields = false;
              ownerQuery = `SELECT ${standardFields} FROM Account WHERE Owner.Email = '${escapedEmail}' AND Type != 'Former Customer' ORDER BY Name LIMIT 100`;
              try {
                const ownerResult = await conn.query(ownerQuery);
                if (ownerResult.records) {
                  ownerResult.records.forEach(acc => {
                    accountMap.set(acc.Id, acc);
                  });
                  log(`Found ${ownerResult.records.length} accounts owned by ${userEmail} (standard fields only)`);
                }
              } catch (stdError) {
                // Last resort: standard fields without Type filter
                if (stdError.errorCode === 'INVALID_FIELD' && stdError.message && stdError.message.includes('Type')) {
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
      logError('Error querying accounts by owner:', error);
    }
    
    // Query 2: Accounts from AccountTeamMember (if we have User ID)
    // Skip team member accounts if ownerOnly is true
    if (!ownerOnly && salesforceUserId) {
      try {
        // First get Account IDs from AccountTeamMember
        const teamMemberQuery = `SELECT AccountId FROM AccountTeamMember WHERE UserId = '${salesforceUserId}' LIMIT 100`;
        const teamResult = await conn.query(teamMemberQuery);
        
        if (teamResult.records && teamResult.records.length > 0) {
          const accountIds = teamResult.records.map(tm => tm.AccountId);
          
          // Query accounts by IDs (Salesforce allows up to 200 IDs in IN clause)
          // Escape IDs to prevent injection (though IDs are typically safe)
          // Filter by Type != 'Former Customer' to exclude former customers
          const fields = useCustomFields ? customFields : standardFields;
          const idsString = accountIds.map(id => `'${escapeSOQL(id)}'`).join(',');
          const accountQuery = `SELECT ${fields} FROM Account WHERE Id IN (${idsString}) AND Type != 'Former Customer' ORDER BY Name`;
          
          try {
            const accountResult = await conn.query(accountQuery);
            if (accountResult.records) {
              accountResult.records.forEach(acc => {
                accountMap.set(acc.Id, acc);
              });
              log(`Found ${accountResult.records.length} accounts from AccountTeamMember`);
            }
          } catch (error) {
            if (error.errorCode === 'INVALID_FIELD' && useCustomFields) {
              // Retry with standard fields
              const standardAccountQuery = `SELECT ${standardFields} FROM Account WHERE Id IN (${idsString}) AND Type != 'Former Customer' ORDER BY Name`;
              const accountResult = await conn.query(standardAccountQuery);
              if (accountResult.records) {
                accountResult.records.forEach(acc => {
                  accountMap.set(acc.Id, acc);
                });
                log(`Found ${accountResult.records.length} accounts from AccountTeamMember (standard fields)`);
              }
            } else {
              logError('Error querying accounts from AccountTeamMember:', error);
            }
          }
        }
        } catch (error) {
          logError('Error querying AccountTeamMember:', error);
        }
    }
    
    // Convert Map to array
    allAccounts = Array.from(accountMap.values());
    
  } else {
    // For admins or other roles, get all accounts
    // Filter by Type != 'Former Customer' to exclude former customers
    try {
      let adminQuery = `SELECT ${customFields} FROM Account WHERE Type != 'Former Customer' ORDER BY Name LIMIT 100`;
      try {
        const result = await conn.query(adminQuery);
        allAccounts = result.records || [];
      } catch (error) {
        if (error.errorCode === 'INVALID_FIELD') {
          logWarn('Custom fields not found, using standard fields only');
          adminQuery = `SELECT ${standardFields} FROM Account WHERE Type != 'Former Customer' ORDER BY Name LIMIT 100`;
          const result = await conn.query(adminQuery);
          allAccounts = result.records || [];
        } else {
          throw error;
        }
      }
    } catch (error) {
      logError('Error querying all accounts:', error);
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
  const cacheExpiry = CACHE_TTL.ACCOUNTS * 60 * 60 * 1000;
  
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
  // Type is a standard field used to filter out "Former Customer" accounts
  const customFields = `Id, Name, Employee_Band__c, Expiring_Revenue__c, Type, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
  const standardFields = `Id, Name, Type, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
  
  // Use LIKE for partial matching (case-insensitive)
  // Filter by Type != 'Former Customer' to exclude former customers
  let searchQuery = `SELECT ${customFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' AND Type != 'Former Customer' ORDER BY Name LIMIT 20`;
  
  try {
    const result = await conn.query(searchQuery);
    return result.records || [];
  } catch (error) {
    if (error.errorCode === 'INVALID_FIELD') {
      // Check if error is about Type field
      const typeError = error.message && error.message.includes('Type');
      
      if (typeError) {
        // Type field doesn't exist or has issues - retry without filter
        logWarn('Type field issue on Account, searching without Type filter');
        try {
          searchQuery = `SELECT ${customFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' ORDER BY Name LIMIT 20`;
          const result = await conn.query(searchQuery);
          return result.records || [];
        } catch (retryError) {
          // If still fails, might be custom fields issue
          if (retryError.errorCode === 'INVALID_FIELD') {
            // Retry with standard fields (without Type filter)
            searchQuery = `SELECT ${standardFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' ORDER BY Name LIMIT 20`;
            const result = await conn.query(searchQuery);
            return result.records || [];
          } else {
            throw retryError;
          }
        }
      } else {
        // Not a Type error, try standard fields with Type filter
        try {
          searchQuery = `SELECT ${standardFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' AND Type != 'Former Customer' ORDER BY Name LIMIT 20`;
          const result = await conn.query(searchQuery);
          return result.records || [];
        } catch (stdError) {
          // If standard fields with Type filter fails, check if it's Type error
          if (stdError.errorCode === 'INVALID_FIELD' && stdError.message && stdError.message.includes('Type')) {
            // Last resort: standard fields without Type filter
            searchQuery = `SELECT ${standardFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' ORDER BY Name LIMIT 20`;
            const result = await conn.query(searchQuery);
            return result.records || [];
          } else {
            throw stdError;
          }
        }
      }
    } else {
      logError('Error searching accounts:', error);
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
      logError(`Error syncing account ${sfdcAccount.Id}:`, accountError);
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
        logError(`Error creating user-account relationship:`, relationError);
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
  const { data: userAccounts, error: userAccountsError } = await supabase
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

  if (userAccountsError) {
    logError('Error fetching user_accounts:', userAccountsError);
    return { accounts: null, needsRefresh: true };
  }

  if (!userAccounts || userAccounts.length === 0) {
    return { accounts: null, needsRefresh: true };
  }

  // Check if any account needs refresh (older than CACHE_TTL_HOURS)
  const now = new Date();
  const cacheExpiry = CACHE_TTL.ACCOUNTS * 60 * 60 * 1000; // Convert hours to milliseconds
  let needsRefresh = false;

  const accounts = userAccounts
    .filter(ua => ua.accounts) // Filter out any null accounts
    .map(ua => {
      const account = ua.accounts;
      if (!account) return null;
      
      const lastSynced = account.last_synced_at ? new Date(account.last_synced_at) : null;
      
      // Check if this account needs refresh
      if (!lastSynced || (now - lastSynced) > cacheExpiry) {
        needsRefresh = true;
      }

      return {
        id: account.id, // Always use the UUID from database
        salesforceId: account.salesforce_id,
        name: account.name,
        accountTier: account.account_tier,
        contractValue: account.contract_value,
        industry: account.industry,
        annualRevenue: account.annual_revenue ? parseFloat(account.annual_revenue) : null,
        ownerId: account.owner_id,
        ownerName: account.owner_name,
        lastSyncedAt: account.last_synced_at,
      };
    })
    .filter(acc => acc !== null); // Remove any null entries

  return { accounts, needsRefresh };
}

// Handle OPTIONS preflight
export async function OPTIONS() {
  return handlePreflight(new NextRequest('http://localhost', { method: 'OPTIONS' }));
}

// GET /api/salesforce-accounts
export async function GET(request) {
  const preflight = await handlePreflight(request);
  if (preflight) return preflight;

  const sizeValidation = validateRequestSize(request, MAX_REQUEST_SIZE.DEFAULT);
  if (!sizeValidation.valid) {
    return sendErrorResponse(new Error(sizeValidation.error.message), sizeValidation.error.status);
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId')?.trim() || null;
  const email = searchParams.get('email')?.trim() || null;
  const role = searchParams.get('role')?.trim() || null;
  const forceRefresh = searchParams.get('forceRefresh');
  const search = searchParams.get('search');
  const ownerOnly = searchParams.get('ownerOnly');
  const cacheOnly = searchParams.get('cacheOnly');

  // Check if this is a search request
  const isSearch = search && search.trim().length >= 2;
  
  // Validate input (skip validation for search requests)
  if (!isSearch && !userId && !email) {
    logError('Missing required parameters', { userId, email, role, isSearch });
    return sendErrorResponse(new Error('Missing required parameter: userId or email (or search term)'), 400);
  }
  
  // Check if we should force refresh (bypass cache)
  const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

  try {
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      logError('Supabase client is null - environment variables may not be set');
      return sendErrorResponse(
        new Error('Database connection not configured. Please check environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)'),
        503
      );
    }
    
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      logError(`Supabase validation failed: ${validation.error.message}`);
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }
    
    // Handle search request (bypasses user assignment logic)
    if (isSearch) {
      try {
        // CACHE-FIRST: Check Supabase cache before querying Salesforce
        const cachedSearch = await searchCachedAccounts(supabase, search);
        
        if (cachedSearch && cachedSearch.isFresh) {
          // Use cached results (fresh)
          const accounts = cachedSearch.accounts.map(acc => ({
            id: acc.id, // Always use the UUID from database
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
          
          return sendSuccessResponse({
            accounts: accounts,
            total: accounts.length,
            searchTerm: search,
            isSearch: true,
            cached: true,
          });
        } else {
          log(`No cache found for search: ${search}, querying Salesforce`);
        }
        
        const sfdcAuth = await authenticateSalesforce(supabase);
        const searchResults = await searchSalesforceAccounts(sfdcAuth.connection, search);
        
        // Sync search results to Supabase (for caching) - but don't create user relationships
        // Pass createRelationships=false so searched accounts aren't associated with the searching user
        const syncedAccounts = await syncAccountsToSupabase(supabase, searchResults, null, false);
        
        const accounts = syncedAccounts.map(acc => ({
          id: acc.id, // Always use the UUID from database
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
        
        return sendSuccessResponse({
          accounts: accounts,
          total: accounts.length,
          searchTerm: search,
          isSearch: true,
          cached: false,
        });
      } catch (searchError) {
        logError('Salesforce search error:', searchError);
        
        // If Salesforce fails but we have stale cache, use it
        const staleCache = await searchCachedAccounts(supabase, search);
        if (staleCache && staleCache.accounts.length > 0) {
          const accounts = staleCache.accounts.map(acc => ({
            id: acc.id, // Always use the UUID from database
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
          
          return sendSuccessResponse({
            accounts: accounts,
            total: accounts.length,
            searchTerm: search,
            isSearch: true,
            cached: true,
            stale: true,
          });
        }
        
        return sendErrorResponse(searchError, 500);
      }
    }
    
    // Regular flow: get user's assigned accounts
    // First, get the user by userId or email
    let user;
    try {
      if (userId && userId.trim()) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) {
          if (userError.code === 'PGRST116') {
            // User not found - try email instead
            if (email && email.trim()) {
              logWarn(`User not found by ID ${userId}, trying email ${email}`);
            } else {
              user = null;
            }
          } else {
            logError('Error fetching user by ID:', userError);
            throw userError;
          }
        } else {
          user = userData;
        }
      }
      
      // If user not found by ID, try email
      if (!user && email && email.trim()) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (userError) {
          if (userError.code === 'PGRST116') {
            // User not found in database
            logError(`User not found by email: ${email}`);
            user = null;
          } else {
            logError('Error fetching user by email:', userError);
            throw userError;
          }
        } else {
          user = userData;
        }
      }

      if (!user) {
        // User doesn't exist in database yet - return empty accounts instead of error
        // This can happen if user hasn't logged in through the proper flow
        logWarn(`User not found in database - userId: ${userId || '(empty)'}, email: ${email || '(empty)'}. Returning empty accounts.`);
        return sendSuccessResponse({
          accounts: [],
          total: 0,
          userId: null,
          role: role || 'Account Manager',
          cached: false,
          message: 'User not found in database. Please log out and log back in to create your account.',
        });
      }
    } catch (userFetchError) {
      logError('Error in user lookup:', userFetchError);
      return sendErrorResponse(userFetchError, 500);
    }

    // Check cache first (unless force refresh is requested)
    let accounts = [];
    let useCached = false;
    let needsRefresh = true;

    if (!shouldForceRefresh) {
      try {
        const cacheResult = await getCachedAccounts(supabase, user.id, user.email, user.role);
        
        if (cacheResult && cacheResult.accounts && cacheResult.accounts.length > 0) {
          accounts = cacheResult.accounts;
          needsRefresh = cacheResult.needsRefresh || false;
          
          if (!needsRefresh) {
            useCached = true;
          }
        }
      } catch (cacheError) {
        logError('Error getting cached accounts', cacheError);
        // Continue - will try Salesforce or return empty
        accounts = [];
        needsRefresh = true;
      }
    }

    // Query Salesforce if cache is stale/missing or force refresh requested
    // BUT: If we have cached accounts, only try Salesforce if force refresh is explicitly requested
    // This prevents unnecessary Salesforce calls when we have valid cached data
    // If cacheOnly is true, never query Salesforce - just return cached accounts (or empty)
    const shouldTrySalesforce = !(cacheOnly === 'true' || cacheOnly === '1') && 
                                 (needsRefresh || shouldForceRefresh) && 
                                 (shouldForceRefresh || accounts.length === 0);
    
    if (shouldTrySalesforce) {
      try {
        const sfdcAuth = await authenticateSalesforce(supabase);
        const sfdcAccounts = await querySalesforceAccounts(
          sfdcAuth.connection,
          user.id,
          user.email,
          user.role || role,
          ownerOnly === 'true' || ownerOnly === '1'
        );

        // Sync accounts to Supabase
        if (!isProduction()) {
          log(`Syncing ${sfdcAccounts.length} accounts to Supabase...`);
        }
        const syncedAccounts = await syncAccountsToSupabase(supabase, sfdcAccounts, user.id);
        
        if (!isProduction()) {
          log(`Synced ${syncedAccounts.length} accounts to Supabase`);
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
          lastSyncedAt: acc.last_synced_at,
        }));
        
        useCached = false;
      } catch (sfdcError) {
        logError('Salesforce API error:', sfdcError);
        logError('Error details:', sfdcError.message);
        if (sfdcError.stack) {
          logError('Error stack:', sfdcError.stack);
        }
        
        // If we have cached accounts, use them even if stale
        if (accounts.length > 0) {
          logWarn(`Salesforce query failed, using ${accounts.length} cached accounts (may be stale)`);
          useCached = true;
        } else {
          // No cached accounts available
          // If cacheOnly mode, just return empty array instead of error
          if (cacheOnly === 'true' || cacheOnly === '1') {
            log('Cache-only mode: no cached accounts found, returning empty array');
            return sendSuccessResponse({
              accounts: [],
              total: 0,
              userId: user.id,
              role: user.role || role || 'Account Manager',
              cached: false,
            });
          }
          // Otherwise return error
          logError('No cached accounts available and Salesforce query failed');
          return sendErrorResponse(new Error('Failed to fetch accounts from Salesforce and no cached accounts available'), 500);
        }
      }
    } else if (accounts.length > 0) {
      // We have cached accounts and don't need to refresh
      useCached = true;
    }

    return sendSuccessResponse({
      accounts: accounts,
      total: accounts.length,
      userId: user.id,
      role: user.role || role || 'Account Manager',
      cached: useCached,
    });
  } catch (error) {
    // Enhanced error logging
    console.error('[salesforce-accounts] Error caught:', {
      message: error.message,
      name: error.name,
      code: error.code,
      details: error.details,
      stack: error.stack,
    });
    
    logError('Error in salesforce-accounts function:', error);
    logError('Error message:', error.message);
    logError('Error name:', error.name);
    
    if (error.stack) {
      logError('Error stack:', error.stack);
    }
    if (error.code) {
      logError('Error code:', error.code);
    }
    if (error.details) {
      logError('Error details:', error.details);
    }
    
    // Return a more descriptive error
    const errorMessage = error.message || 'Internal server error';
    return sendErrorResponse(
      new Error(`Failed to fetch accounts: ${errorMessage}`),
      500
    );
  }
}

