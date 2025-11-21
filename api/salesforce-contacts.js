/**
 * Vercel Serverless Function for Salesforce Contacts
 * 
 * Fetches Contacts from Salesforce for a specific account with intelligent caching
 * Only calls Salesforce API when cache is stale or missing
 * Filters out contacts with Contact Status = "Unqualified"
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { normalizeLinkedInURL } = require('../lib/linkedin-client');
const { authenticateSalesforce, escapeSOQL, isCacheFresh } = require('../lib/salesforce-client');
const { handlePreflight, validateRequestSize, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } = require('../lib/api-helpers');
const { MAX_REQUEST_SIZE, CACHE_TTL, API_LIMITS } = require('../lib/constants');

/**
 * Query Salesforce for Contacts
 * Filters out contacts with Contact Status = "Unqualified"
 */
async function querySalesforceContacts(conn, salesforceAccountId) {
  // Escape account ID to prevent injection
  const escapedAccountId = salesforceAccountId.replace(/'/g, "\\'");
  
  // Query contacts for the account, excluding "Unqualified" status
  // Try with Contact_Status__c first (common custom field name)
  // Also try Status__c as alternative field name
  // Include Person_LinkedIn__c field for enrichment
  // Fallback to standard fields if custom field doesn't exist
  // In SOQL, we need to handle nulls properly - use IS NULL or filter in code
  const customFieldsQuery = `SELECT Id, FirstName, LastName, Name, Email, Title, Phone, MobilePhone, 
                             Contact_Status__c, Status__c, AccountId, Account.Name,
                             Person_LinkedIn__c
                             FROM Contact 
                             WHERE AccountId = '${escapedAccountId}' 
                             AND (Contact_Status__c != 'Unqualified' OR Contact_Status__c = null)
                             ORDER BY LastName, FirstName 
                             LIMIT ${API_LIMITS.CONTACTS_PER_ACCOUNT}`;
  
  try {
    const result = await conn.query(customFieldsQuery);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Query returned ${result.records?.length || 0} contacts for account ${salesforceAccountId}`);
    }
    // Filter out any contacts with Unqualified status (in case query didn't filter properly)
    // Also handle null status - include contacts where status is null or not "Unqualified"
    const filteredContacts = (result.records || []).filter(contact => {
      const status = contact.Contact_Status__c || contact.Status__c || null;
      return status !== 'Unqualified';
    });
    if (process.env.NODE_ENV !== 'production') {
      console.log(`After filtering Unqualified: ${filteredContacts.length} contacts`);
    }
    return filteredContacts;
  } catch (error) {
    // If Contact_Status__c doesn't exist, try with standard fields
    if (error.errorCode === 'INVALID_FIELD') {
      console.warn('Contact_Status__c field not found, querying with standard fields only');
      
      // Standard fields query (no Contact Status filter if field doesn't exist)
      // Return all contacts since we can't filter by status
      // Still try to get LinkedIn URL even if status field doesn't exist
      const standardFieldsQuery = `SELECT Id, FirstName, LastName, Name, Email, Title, Phone, MobilePhone, 
                                   AccountId, Account.Name,
                                   Person_LinkedIn__c
                                   FROM Contact 
                                   WHERE AccountId = '${escapedAccountId}' 
                                   ORDER BY LastName, FirstName 
                                   LIMIT 100`;
      
      try {
        const result = await conn.query(standardFieldsQuery);
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Standard fields query returned ${result.records?.length || 0} contacts`);
        }
        return result.records || [];
      } catch (stdError) {
        console.error('Error querying contacts with standard fields:', stdError);
        throw stdError;
      }
    } else {
      logError('Error querying Salesforce Contacts:', error);
      // Log more details about the error
      log('Contact query error details:', {
        errorCode: error.errorCode,
        message: error.message,
        accountId: salesforceAccountId,
      });
      throw error;
    }
  }
}

/**
 * Get cached contacts from Supabase
 */
async function getCachedContacts(supabase, salesforceAccountId) {
  if (!supabase || !salesforceAccountId) return null;

  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('salesforce_account_id', salesforceAccountId)
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })
    .limit(100);

  if (error || !contacts || contacts.length === 0) {
    return null;
  }

  // Check if cache is fresh (use most recent last_synced_at)
  const mostRecentSync = contacts.reduce((latest, current) => {
    const currentDate = current.last_synced_at ? new Date(current.last_synced_at) : new Date(0);
    const latestDate = latest ? new Date(latest) : new Date(0);
    return currentDate > latestDate ? current.last_synced_at : latest;
  }, null);

  const isFresh = isCacheFresh(mostRecentSync, CACHE_TTL.CONTACTS);

  return {
    contacts,
    isFresh,
    lastSyncedAt: mostRecentSync,
  };
}

/**
 * Sync contacts to Supabase cache
 */
async function syncContactsToSupabase(supabase, sfdcContacts, salesforceAccountId, accountId) {
  if (!supabase || !sfdcContacts || sfdcContacts.length === 0) {
    return [];
  }

  const syncedContacts = [];

  for (const sfdcContact of sfdcContacts) {
    // Skip contacts with Unqualified status (shouldn't happen if query worked, but double-check)
    const contactStatus = sfdcContact.Contact_Status__c || sfdcContact.Status__c || sfdcContact.Status || null;
    if (contactStatus === 'Unqualified') {
      continue;
    }

    // Extract LinkedIn URL from Person_LinkedIn__c field and normalize it
    const rawLinkedInURL = sfdcContact.Person_LinkedIn__c || null;
    const linkedinURL = rawLinkedInURL ? normalizeLinkedInURL(rawLinkedInURL) : null;

    const contactData = {
      salesforce_id: sfdcContact.Id,
      salesforce_account_id: salesforceAccountId,
      account_id: accountId || null,
      first_name: sfdcContact.FirstName || null,
      last_name: sfdcContact.LastName || null,
      name: sfdcContact.Name || null,
      email: sfdcContact.Email || null,
      title: sfdcContact.Title || null,
      phone: sfdcContact.Phone || null,
      mobile_phone: sfdcContact.MobilePhone || null,
      contact_status: contactStatus,
      account_name: sfdcContact.Account?.Name || null,
      linkedin_url: linkedinURL, // Store normalized LinkedIn URL for enrichment
      last_synced_at: new Date().toISOString(),
    };

    const { data: contactRecord, error: contactError } = await supabase
      .from('contacts')
      .upsert(contactData, {
        onConflict: 'salesforce_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (contactError) {
      logError(`Error syncing contact ${sfdcContact.Id}:`, contactError);
      continue;
    }

    syncedContacts.push(contactRecord);
  }

  return syncedContacts;
}

export default async function handler(req, res) {
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
    return sendErrorResponse(res, new Error('Missing required parameter: salesforceAccountId'), 400);
  }

  const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

  try {
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    // CACHE-FIRST: Check Supabase cache before querying Salesforce
    if (!shouldForceRefresh) {
      const cached = await getCachedContacts(supabase, salesforceAccountId);
      
      if (cached && cached.isFresh) {
        log(`Using ${cached.contacts.length} cached contacts for account: ${salesforceAccountId}`);
        
        return sendSuccessResponse(res, {
          contacts: cached.contacts.map(c => ({
            id: c.salesforce_id,
            firstName: c.first_name,
            lastName: c.last_name,
            name: c.name,
            email: c.email,
            title: c.title,
            phone: c.phone,
            mobilePhone: c.mobile_phone,
            contactStatus: c.contact_status,
            accountId: c.salesforce_account_id,
            accountName: c.account_name,
            linkedinURL: c.linkedin_url, // Include LinkedIn URL in response
          })),
          total: cached.contacts.length,
          cached: true,
          lastSyncedAt: cached.lastSyncedAt,
        });
      }
    }

    // Cache is stale or missing - query Salesforce
    if (shouldForceRefresh) {
      log(`Force refresh requested for contacts, querying Salesforce`);
    } else {
      log(`Cache stale or missing for contacts, querying Salesforce`);
    }

    const sfdcAuth = await authenticateSalesforce(supabase);
    const sfdcContacts = await querySalesforceContacts(sfdcAuth.connection, salesforceAccountId);

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

    // Sync contacts to Supabase cache
    const syncedContacts = await syncContactsToSupabase(supabase, sfdcContacts, salesforceAccountId, accountUuid);

    const contacts = syncedContacts.map(c => ({
      id: c.salesforce_id,
      firstName: c.first_name,
      lastName: c.last_name,
      name: c.name,
      email: c.email,
      title: c.title,
      phone: c.phone,
      mobilePhone: c.mobile_phone,
      contactStatus: c.contact_status,
      accountId: c.salesforce_account_id,
      accountName: c.account_name,
      linkedinURL: c.linkedin_url, // Include LinkedIn URL in response
    }));

    return sendSuccessResponse(res, {
      contacts: contacts,
      total: contacts.length,
      cached: false,
      lastSyncedAt: new Date().toISOString(),
    });

  } catch (error) {
    logError('Error in salesforce-contacts function:', error);
    
    // If Salesforce fails, try to return stale cache
    const supabase = getSupabaseClient();
    if (!shouldForceRefresh && supabase && validateSupabase(supabase, res)) {
      const staleCache = await getCachedContacts(supabase, salesforceAccountId);
      if (staleCache && staleCache.contacts.length > 0) {
        log(`Salesforce query failed, using ${staleCache.contacts.length} stale cached contacts`);
        
        return sendSuccessResponse(res, {
          contacts: staleCache.contacts.map(c => ({
            id: c.salesforce_id,
            firstName: c.first_name,
            lastName: c.last_name,
            name: c.name,
            email: c.email,
            title: c.title,
            phone: c.phone,
            mobilePhone: c.mobile_phone,
            contactStatus: c.contact_status,
            accountId: c.salesforce_account_id,
            accountName: c.account_name,
            linkedinURL: c.linkedin_url, // Include LinkedIn URL in response
          })),
          total: staleCache.contacts.length,
          cached: true,
          stale: true,
          lastSyncedAt: staleCache.lastSyncedAt,
        });
      }
    }
    
    return sendErrorResponse(res, error, 500, isProduction());
  }
};

