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
  if (!supabase || !salesforceAccountId) {
    return null;
  }
  
  const { data: cases, error } = await supabase
    .from('cases')
    .select('*')
    .eq('salesforce_account_id', salesforceAccountId)
      .order('created_date', { ascending: false })
      .limit(API_LIMITS.CASES_PER_ACCOUNT);

  if (error) {
    logError('Error querying cached cases', error);
    return null;
  }

  if (!cases || cases.length === 0) {
    return null;
  }

  // Check if cache is fresh (use most recent last_synced_at)
  const mostRecentSync = cases.reduce((latest, current) => {
    const currentDate = current.last_synced_at ? new Date(current.last_synced_at) : new Date(0);
    const latestDate = latest ? new Date(latest) : new Date(0);
    return currentDate > latestDate ? current.last_synced_at : latest;
  }, null);

  const isFresh = isCacheFresh(mostRecentSync, CACHE_TTL.CASES);

  return {
    cases: cases,
    isFresh: isFresh,
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
  // Include ContactEmail and ContactId to track who submitted/copied on cases
  // Note: Contact.Name might be null if Contact is not set, so we handle that gracefully
  const caseQuery = `SELECT Id, CaseNumber, Subject, Status, Priority, Type, Reason, Origin, CreatedDate, ClosedDate, Description, 
                     ContactEmail, ContactId, Contact.Name
                     FROM Case 
                     WHERE AccountId = '${escapedAccountId}' 
                     ORDER BY CreatedDate DESC 
                     LIMIT ${API_LIMITS.CASES_PER_ACCOUNT}`;
  
  try {
    const result = await conn.query(caseQuery);
    const caseCount = result.records?.length || 0;
    
    if (caseCount === 0) {
      // Try a simpler query without Contact.Name to see if that's the issue
      const simpleQuery = `SELECT Id, CaseNumber, Subject, Status, Priority, Type, Reason, Origin, CreatedDate, ClosedDate, Description, 
                           ContactEmail, ContactId
                           FROM Case 
                           WHERE AccountId = '${escapedAccountId}' 
                           ORDER BY CreatedDate DESC 
                           LIMIT ${API_LIMITS.CASES_PER_ACCOUNT}`;
      
      try {
        const simpleResult = await conn.query(simpleQuery);
        const simpleCount = simpleResult.records?.length || 0;
        if (simpleCount > 0) {
          log(`⚠️ Simpler query returned ${simpleCount} cases - Contact.Name field may be causing issues`);
          // Enrich records with Contact.Name if available - parallelize lookups
          const contactIds = simpleResult.records
            .filter(record => record.ContactId)
            .map(record => record.ContactId);
          
          if (contactIds.length > 0) {
            // Fetch all contacts in parallel
            const contactPromises = contactIds.map(contactId =>
              conn.sobject('Contact').retrieve(contactId, ['Name'])
                .then(contact => ({ contactId, contact }))
                .catch(error => ({ contactId, error }))
            );
            
            const contactResults = await Promise.all(contactPromises);
            const contactMap = new Map();
            contactResults.forEach(({ contactId, contact, error }) => {
              if (error) {
                logError(`Could not fetch Contact.Name for ContactId ${contactId}`, error);
                contactMap.set(contactId, null);
              } else {
                contactMap.set(contactId, { Name: contact.Name });
              }
            });
            
            // Attach Contact data to records
            simpleResult.records.forEach(record => {
              if (record.ContactId) {
                record.Contact = contactMap.get(record.ContactId) || null;
              }
            });
          }
          return simpleResult.records || [];
        }
      } catch (simpleError) {
        logError('Simple query also failed:', simpleError);
        // Continue with original error
      }
    }
    
    return result.records || [];
  } catch (error) {
    logError('Error querying Salesforce Cases:', error);
    logError('Query that failed:', caseQuery);
    logError('Account ID used:', salesforceAccountId);
    logError('Error details:', {
      message: error.message,
      errorCode: error.errorCode,
      fields: error.fields,
    });
    
    // Try fallback query without Contact.Name
    try {
      log(`Attempting fallback query without Contact.Name for account ${salesforceAccountId}`);
      const fallbackQuery = `SELECT Id, CaseNumber, Subject, Status, Priority, Type, Reason, Origin, CreatedDate, ClosedDate, Description, 
                              ContactEmail, ContactId
                              FROM Case 
                              WHERE AccountId = '${escapedAccountId}' 
                              ORDER BY CreatedDate DESC 
                              LIMIT ${API_LIMITS.CASES_PER_ACCOUNT}`;
      
      const fallbackResult = await conn.query(fallbackQuery);
      log(`Fallback query returned ${fallbackResult.records?.length || 0} cases`);
      
      // Try to enrich with Contact.Name if ContactId exists - parallelize lookups
      if (fallbackResult.records && fallbackResult.records.length > 0) {
        const contactIds = fallbackResult.records
          .filter(record => record.ContactId)
          .map(record => record.ContactId);
        
        if (contactIds.length > 0) {
          // Fetch all contacts in parallel
          const contactPromises = contactIds.map(contactId =>
            conn.sobject('Contact').retrieve(contactId, ['Name'])
              .then(contact => ({ contactId, contact }))
              .catch(error => ({ contactId, error }))
          );
          
          const contactResults = await Promise.all(contactPromises);
          const contactMap = new Map();
          contactResults.forEach(({ contactId, contact, error }) => {
            if (error) {
              logError(`Could not fetch Contact.Name for ContactId ${contactId}`, error);
              contactMap.set(contactId, null);
            } else {
              contactMap.set(contactId, { Name: contact.Name });
            }
          });
          
          // Attach Contact data to records
          fallbackResult.records.forEach(record => {
            if (record.ContactId) {
              record.Contact = contactMap.get(record.ContactId) || null;
            }
          });
        }
      }
      
      return fallbackResult.records || [];
    } catch (fallbackError) {
      logError('Fallback query also failed:', fallbackError);
      throw error; // Throw original error
    }
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
    // Build case data with all fields
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

    // Add contact fields if they exist in the schema (for backward compatibility)
    // These fields were added in migration 013
    if (sfdcCase.ContactEmail !== undefined) {
      caseData.contact_email = sfdcCase.ContactEmail || null;
    }
    if (sfdcCase.ContactId !== undefined) {
      caseData.contact_id = sfdcCase.ContactId || null;
    }
    if (sfdcCase.Contact?.Name !== undefined) {
      caseData.contact_name = sfdcCase.Contact?.Name || null;
    }

    const { data: caseRecord, error: caseError } = await supabase
      .from('cases')
      .upsert(caseData, {
        onConflict: 'salesforce_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (caseError) {
      // If error is about missing columns, try without contact fields
      if (caseError.code === 'PGRST204' && (
        caseError.message?.includes('contact_email') ||
        caseError.message?.includes('contact_id') ||
        caseError.message?.includes('contact_name')
      )) {
        logError(`Contact columns not found in cases table. Please run migration 013_add_case_contact_fields.sql. Retrying without contact fields for case ${sfdcCase.Id}`);
        
        // Remove contact fields and retry
        delete caseData.contact_email;
        delete caseData.contact_id;
        delete caseData.contact_name;
        
        const { data: retryRecord, error: retryError } = await supabase
          .from('cases')
          .upsert(caseData, {
            onConflict: 'salesforce_id',
            ignoreDuplicates: false,
          })
          .select()
          .single();
        
        if (retryError) {
          logError(`Error syncing case ${sfdcCase.Id} (retry without contact fields):`, retryError);
          continue;
        }
        
        syncedCases.push(retryRecord);
      } else {
        logError(`Error syncing case ${sfdcCase.Id}:`, caseError);
        continue;
      }
    } else {
      syncedCases.push(caseRecord);
    }
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
        const mappedCases = cached.cases.map(c => ({
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
          contactEmail: c.contact_email,
          contactId: c.contact_id,
          contactName: c.contact_name,
        }));
        
        return sendSuccessResponse(res, {
          cases: mappedCases,
          total: cached.cases.length,
          cached: true,
          lastSyncedAt: cached.lastSyncedAt,
        });
      } else if (cached && !cached.isFresh) {
        log(`Cache stale for account ${salesforceAccountId}, refreshing from Salesforce`);
      }
    }

    // Cache is stale or missing - query Salesforce
    if (shouldForceRefresh) {
      log(`Force refresh requested, querying Salesforce for account ${salesforceAccountId}`);
    }

    const sfdcAuth = await authenticateSalesforce(supabase);
    const sfdcCases = await querySalesforceCases(sfdcAuth.connection, salesforceAccountId);
    
    if (sfdcCases.length > 0) {
      log(`Retrieved ${sfdcCases.length} cases from Salesforce`);
    }

    // Always look up account UUID from Supabase using salesforce_account_id
    // The accountId parameter might be a Salesforce ID string, not a UUID
    // Optimize: Try both lookups in parallel if accountId looks like UUID, otherwise just lookup by salesforce_id
    let accountUuid = null;
    
    const isLikelyUUID = accountId && accountId.includes('-') && accountId.length === 36;
    
    if (isLikelyUUID) {
      // Try both lookups in parallel for faster resolution
      const [uuidResult, salesforceIdResult] = await Promise.all([
        supabase.from('accounts').select('id').eq('id', accountId).single(),
        supabase.from('accounts').select('id').eq('salesforce_id', salesforceAccountId).single()
      ]);
      
      accountUuid = uuidResult.data?.id || salesforceIdResult.data?.id || null;
    } else {
      // Just lookup by salesforce_id
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
      contactEmail: c.contact_email,
      contactId: c.contact_id,
      contactName: c.contact_name,
    }));
    
    return sendSuccessResponse(res, {
      cases: cases,
      total: cases.length,
      cached: false,
      lastSyncedAt: new Date().toISOString(),
      _debug: !isProduction() ? {
        cacheLookup: false,
        casesCount: cases.length,
        salesforceAccountId: salesforceAccountId,
      } : undefined,
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
            contactEmail: c.contact_email,
            contactId: c.contact_id,
            contactName: c.contact_name,
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

