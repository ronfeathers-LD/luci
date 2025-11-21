/**
 * Vercel Serverless Function for Salesforce Cases/Tickets
 * 
 * Fetches Cases from Salesforce for a specific account with intelligent caching
 * Only calls Salesforce API when cache is stale or missing
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { authenticateSalesforce, escapeSOQL } = require('../lib/salesforce-client');
const { isCacheFresh } = require('../lib/cache-helpers');
const { handlePreflight, validateRequestSize, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } = require('../lib/api-helpers');
const { MAX_REQUEST_SIZE, CACHE_TTL, API_LIMITS } = require('../lib/constants');

/**
 * Get cached cases from Supabase
 */
async function getCachedCases(supabase, salesforceAccountId) {
  if (!supabase || !salesforceAccountId) return null;

  const { data: cases, error } = await supabase
    .from('cases')
    .select('*')
    .eq('salesforce_account_id', salesforceAccountId)
      .order('created_date', { ascending: false })
      .limit(API_LIMITS.CASES_PER_ACCOUNT);

  if (error || !cases || cases.length === 0) {
    return null;
  }

  // Check if cache is fresh (use most recent last_synced_at)
  const mostRecentSync = cases.reduce((latest, current) => {
    const currentDate = current.last_synced_at ? new Date(current.last_synced_at) : new Date(0);
    const latestDate = latest ? new Date(latest) : new Date(0);
    return currentDate > latestDate ? current.last_synced_at : latest;
  }, null);

  return {
    cases: cases,
    isFresh: isCacheFresh(mostRecentSync, CACHE_TTL.CASES),
    lastSyncedAt: mostRecentSync,
  };
}

/**
 * Query Salesforce for Cases
 */
async function querySalesforceCases(conn, salesforceAccountId) {
  // Escape account ID to prevent injection
  const escapedAccountId = escapeSOQL(salesforceAccountId);
  
  // Query recent cases for the account
  const caseQuery = `SELECT Id, CaseNumber, Subject, Status, Priority, Type, Reason, Origin, CreatedDate, ClosedDate, Description 
                     FROM Case 
                     WHERE AccountId = '${escapedAccountId}' 
                     ORDER BY CreatedDate DESC 
                     LIMIT ${API_LIMITS.CASES_PER_ACCOUNT}`;
  
  try {
    const result = await conn.query(caseQuery);
    return result.records || [];
  } catch (error) {
    logError('Error querying Salesforce Cases:', error);
    throw error;
  }
}

/**
 * Sync cases to Supabase cache
 */
async function syncCasesToSupabase(supabase, sfdcCases, salesforceAccountId, accountId) {
  if (!supabase || !sfdcCases || sfdcCases.length === 0) {
    return [];
  }

  const syncedCases = [];

  for (const sfdcCase of sfdcCases) {
    const caseData = {
      salesforce_id: sfdcCase.Id,
      salesforce_account_id: salesforceAccountId,
      account_id: accountId || null,
      case_number: sfdcCase.CaseNumber || null,
      subject: sfdcCase.Subject || null,
      status: sfdcCase.Status || null,
      priority: sfdcCase.Priority || null,
      type: sfdcCase.Type || null,
      reason: sfdcCase.Reason || null,
      origin: sfdcCase.Origin || null,
      created_date: sfdcCase.CreatedDate || null,
      closed_date: sfdcCase.ClosedDate || null,
      description: sfdcCase.Description || null,
      last_synced_at: new Date().toISOString(),
    };

    const { data: caseRecord, error: caseError } = await supabase
      .from('cases')
      .upsert(caseData, {
        onConflict: 'salesforce_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (caseError) {
      logError(`Error syncing case ${sfdcCase.Id}:`, caseError);
      continue;
    }

    syncedCases.push(caseRecord);
  }

  return syncedCases;
}

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return sendErrorResponse(res, new Error('Method not allowed'), 405);
  }

  // Validate request size
  const sizeValidation = validateRequestSize(req, MAX_REQUEST_SIZE.DEFAULT);
  if (!sizeValidation.valid) {
    return sendErrorResponse(res, new Error(sizeValidation.error.message), sizeValidation.error.status);
  }

  const { salesforceAccountId, accountId, forceRefresh } = req.query;

  // Validate input
  if (!salesforceAccountId) {
    return res.status(400).json({ error: 'Missing required parameter: salesforceAccountId' });
  }

  const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

  try {
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    // CACHE-FIRST: Check Supabase cache before querying Salesforce
    if (!shouldForceRefresh) {
      const cached = await getCachedCases(supabase, salesforceAccountId);
      
      if (cached && cached.isFresh) {
        log(`Using ${cached.cases.length} cached cases for account: ${salesforceAccountId}`);
        
        return sendSuccessResponse(res, {
          cases: cached.cases.map(c => ({
            id: c.salesforce_id,
            caseNumber: c.case_number,
            subject: c.subject,
            status: c.status,
            priority: c.priority,
            type: c.type,
            reason: c.reason,
            origin: c.origin,
            createdDate: c.created_date,
            closedDate: c.closed_date,
            description: c.description,
          })),
          total: cached.cases.length,
          cached: true,
          lastSyncedAt: cached.lastSyncedAt,
        });
      }
    }

    // Cache is stale or missing - query Salesforce
    if (shouldForceRefresh) {
      log(`Force refresh requested for cases, querying Salesforce`);
    } else {
      log(`Cache stale or missing for cases, querying Salesforce`);
    }

    const sfdcAuth = await authenticateSalesforce(supabase);
    const sfdcCases = await querySalesforceCases(sfdcAuth.connection, salesforceAccountId);

    // Always look up account UUID from Supabase using salesforce_account_id
    // The accountId parameter might be a Salesforce ID string, not a UUID
    let accountUuid = null;
    
    // First, try to use accountId if it looks like a UUID (has dashes)
    if (accountId && accountId.includes('-') && accountId.length === 36) {
      // It's likely a UUID, verify it exists
      const { data: account } = await supabase
        .from('accounts')
        .select('id')
        .eq('id', accountId)
        .single();
      if (account) {
        accountUuid = account.id;
      }
    }
    
    // If we don't have a valid UUID yet, look it up by salesforce_id
    if (!accountUuid) {
      const { data: account } = await supabase
        .from('accounts')
        .select('id')
        .eq('salesforce_id', salesforceAccountId)
        .single();
      accountUuid = account?.id || null;
    }

    // Sync cases to Supabase cache
    const syncedCases = await syncCasesToSupabase(supabase, sfdcCases, salesforceAccountId, accountUuid);

    const cases = syncedCases.map(c => ({
      id: c.salesforce_id,
      caseNumber: c.case_number,
      subject: c.subject,
      status: c.status,
      priority: c.priority,
      type: c.type,
      reason: c.reason,
      origin: c.origin,
      createdDate: c.created_date,
      closedDate: c.closed_date,
      description: c.description,
    }));

    return sendSuccessResponse(res, {
      cases: cases,
      total: cases.length,
      cached: false,
      lastSyncedAt: new Date().toISOString(),
    });

  } catch (error) {
    logError('Error in salesforce-cases function:', error);
    
    // If Salesforce fails, try to return stale cache
    const supabase = getSupabaseClient();
    if (!shouldForceRefresh && supabase && validateSupabase(supabase, res)) {
      const staleCache = await getCachedCases(supabase, salesforceAccountId);
      if (staleCache && staleCache.cases.length > 0) {
        log(`Salesforce query failed, using ${staleCache.cases.length} stale cached cases`);
        
        return sendSuccessResponse(res, {
          cases: staleCache.cases.map(c => ({
            id: c.salesforce_id,
            caseNumber: c.case_number,
            subject: c.subject,
            status: c.status,
            priority: c.priority,
            type: c.type,
            reason: c.reason,
            origin: c.origin,
            createdDate: c.created_date,
            closedDate: c.closed_date,
            description: c.description,
          })),
          total: staleCache.cases.length,
          cached: true,
          stale: true,
          lastSyncedAt: staleCache.lastSyncedAt,
        });
      }
    }
    
    return sendErrorResponse(res, error, 500, isProduction());
  }
};

