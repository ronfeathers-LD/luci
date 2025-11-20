/**
 * Vercel Serverless Function for Salesforce Cases/Tickets
 * 
 * Fetches Cases from Salesforce for a specific account with intelligent caching
 * Only calls Salesforce API when cache is stale or missing
 */

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

// Constants
const CACHE_TTL_HOURS = 1; // Cache cases for 1 hour
const MAX_REQUEST_SIZE = 1024 * 1024; // 1MB

/**
 * Authenticate with Salesforce using jsforce
 */
async function authenticateSalesforce(supabase) {
  const { data: config, error: configError } = await supabase
    .from('salesforce_configs')
    .select('*')
    .eq('is_active', true)
    .single();

  if (configError) {
    throw new Error(`Error fetching Salesforce config: ${configError.message}`);
  }
  
  if (!config) {
    throw new Error('Salesforce configuration not found');
  }
  
  const jsforce = getJsforceClient();
  if (!jsforce) {
    throw new Error('jsforce library not available');
  }

  const conn = new jsforce.Connection({
    loginUrl: config.login_url || 'https://login.salesforce.com',
  });

  // Authenticate with username, password, and security token
  const fullPassword = config.password + (config.security_token || '');
  await conn.login(config.username, fullPassword);

  return { connection: conn, config };
}

/**
 * Check if cached cases are fresh
 */
function isCacheFresh(lastSyncedAt) {
  if (!lastSyncedAt) return false;
  
  const now = new Date();
  const cacheExpiry = CACHE_TTL_HOURS * 60 * 60 * 1000;
  const lastSynced = new Date(lastSyncedAt);
  
  return (now - lastSynced) < cacheExpiry;
}

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
    .limit(10);

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
    isFresh: isCacheFresh(mostRecentSync),
    lastSyncedAt: mostRecentSync,
  };
}

/**
 * Query Salesforce for Cases
 */
async function querySalesforceCases(conn, salesforceAccountId) {
  // Escape account ID to prevent injection
  const escapedAccountId = salesforceAccountId.replace(/'/g, "\\'");
  
  // Query recent cases for the account
  const caseQuery = `SELECT Id, CaseNumber, Subject, Status, Priority, Type, Reason, Origin, CreatedDate, ClosedDate, Description 
                     FROM Case 
                     WHERE AccountId = '${escapedAccountId}' 
                     ORDER BY CreatedDate DESC 
                     LIMIT 10`;
  
  try {
    const result = await conn.query(caseQuery);
    return result.records || [];
  } catch (error) {
    console.error('Error querying Salesforce Cases:', error);
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
      console.error(`Error syncing case ${sfdcCase.Id}:`, caseError);
      continue;
    }

    syncedCases.push(caseRecord);
  }

  return syncedCases;
}

module.exports = async function handler(req, res) {
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

  const { salesforceAccountId, accountId, forceRefresh } = req.query;

  // Validate input
  if (!salesforceAccountId) {
    return res.status(400).json({ error: 'Missing required parameter: salesforceAccountId' });
  }

  const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({
        error: 'Database not configured',
        message: 'The application database is not properly configured. Please contact your administrator.',
      });
    }

    // CACHE-FIRST: Check Supabase cache before querying Salesforce
    if (!shouldForceRefresh) {
      const cached = await getCachedCases(supabase, salesforceAccountId);
      
      if (cached && cached.isFresh) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Using ${cached.cases.length} cached cases for account: ${salesforceAccountId}`);
        }
        
        return res.status(200).json({
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
    if (process.env.NODE_ENV !== 'production') {
      if (shouldForceRefresh) {
        console.log(`Force refresh requested for cases, querying Salesforce`);
      } else {
        console.log(`Cache stale or missing for cases, querying Salesforce`);
      }
    }

    const sfdcAuth = await authenticateSalesforce(supabase);
    const sfdcCases = await querySalesforceCases(sfdcAuth.connection, salesforceAccountId);

    // Get account UUID from Supabase if accountId not provided
    let accountUuid = accountId;
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

    return res.status(200).json({
      cases: cases,
      total: cases.length,
      cached: false,
      lastSyncedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in salesforce-cases function:', error);
    
    // If Salesforce fails, try to return stale cache
    const supabase = getSupabaseClient();
    if (!shouldForceRefresh && supabase) {
      const staleCache = await getCachedCases(supabase, salesforceAccountId);
      if (staleCache && staleCache.cases.length > 0) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Salesforce query failed, using ${staleCache.cases.length} stale cached cases`);
        }
        
        return res.status(200).json({
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
    
    return res.status(500).json({
      error: 'Failed to fetch cases',
      details: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
};

