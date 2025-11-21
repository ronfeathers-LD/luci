/**
 * Vercel Serverless Function for Salesforce Contacts
 * 
 * Fetches Contacts from Salesforce for a specific account with intelligent caching
 * Only calls Salesforce API when cache is stale or missing
 * Filters out contacts with Contact Status = "Unqualified"
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { normalizeLinkedInURL } = require('../lib/linkedin-client');
const { authenticateSalesforce, escapeSOQL } = require('../lib/salesforce-client');
const { isCacheFresh } = require('../lib/cache-helpers');
const { handlePreflight, validateRequestSize, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, logWarn, isProduction } = require('../lib/api-helpers');
const { MAX_REQUEST_SIZE, CACHE_TTL, API_LIMITS } = require('../lib/constants');

/**
 * Query Salesforce for Contacts
 * Filters out contacts with Contact Status = "Unqualified"
 * Assumes custom fields exist (Contact_Status__c, Person_LinkedIn__c)
 */
async function querySalesforceContacts(conn, salesforceAccountId) {
  // Escape account ID to prevent injection
  const escapedAccountId = salesforceAccountId.replace(/'/g, "\\'");
  
  // Query with comprehensive fields - user will ensure custom fields exist in Salesforce
  // Note: SOQL does not support comments, so all field selections are inline
  // Note: ReportsToId is the lookup field, ReportsTo.Name uses the relationship
  const query = `SELECT Id, FirstName, LastName, Name, Email, Title, Phone, MobilePhone, 
                Contact_Status__c, AccountId, Account.Name,
                Person_LinkedIn__c,
                Department, ReportsToId, ReportsTo.Name, OwnerId, Owner.Name,
                DoNotCall, HasOptedOutOfEmail,
                MailingStreet, MailingCity, MailingState, MailingPostalCode, MailingCountry,
                LastActivityDate, CreatedDate, LastModifiedDate,
                LeadSource,
                Birthdate, AssistantName, AssistantPhone, Description,
                Account.Industry, Account.AnnualRevenue, Account.NumberOfEmployees, 
                Account.Type, Account.OwnerId, Account.Owner.Name
                FROM Contact 
                WHERE AccountId = '${escapedAccountId}' 
                AND (Contact_Status__c != 'Unqualified' OR Contact_Status__c = null)
                ORDER BY LastName, FirstName 
                LIMIT ${API_LIMITS.CONTACTS_PER_ACCOUNT}`;
  
  const result = await conn.query(query);
  const contactCount = result.records?.length || 0;
  log(`Query returned ${contactCount} contacts for account ${salesforceAccountId}`);
  
  // Filter out any contacts with Unqualified status (in case query didn't filter properly)
  const filteredContacts = (result.records || []).filter(contact => {
    const status = contact.Contact_Status__c || null;
    return status !== 'Unqualified';
  });
  
  if (filteredContacts.length !== result.records.length) {
    log(`Filtered out ${result.records.length - filteredContacts.length} Unqualified contacts`);
  }
  
  if (contactCount === 0) {
    log(`Account ${salesforceAccountId} has no contacts in Salesforce. This is normal - not all accounts have contacts.`);
  }
  
  return filteredContacts;
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
    const contactStatus = sfdcContact.Contact_Status__c || null;
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
      // Relationship & Hierarchy
      department: sfdcContact.Department || null,
      reports_to_id: sfdcContact.ReportsToId || null,
      reports_to_name: sfdcContact.ReportsTo?.Name || null,
      owner_id: sfdcContact.OwnerId || null,
      owner_name: sfdcContact.Owner?.Name || null,
      // Communication Preferences
      do_not_call: sfdcContact.DoNotCall || false,
      email_opt_out: sfdcContact.HasOptedOutOfEmail || false,
      // Address Information
      mailing_street: sfdcContact.MailingStreet || null,
      mailing_city: sfdcContact.MailingCity || null,
      mailing_state: sfdcContact.MailingState || null,
      mailing_postal_code: sfdcContact.MailingPostalCode || null,
      mailing_country: sfdcContact.MailingCountry || null,
      // Engagement & Activity
      last_activity_date: sfdcContact.LastActivityDate ? new Date(sfdcContact.LastActivityDate).toISOString() : null,
      created_date: sfdcContact.CreatedDate ? new Date(sfdcContact.CreatedDate).toISOString() : null,
      last_modified_date: sfdcContact.LastModifiedDate ? new Date(sfdcContact.LastModifiedDate).toISOString() : null,
      // Lead Source & Acquisition
      lead_source: sfdcContact.LeadSource || null,
      // Personal Details
      birthdate: sfdcContact.Birthdate || null,
      assistant_name: sfdcContact.AssistantName || null,
      assistant_phone: sfdcContact.AssistantPhone || null,
      description: sfdcContact.Description || null,
      // Account Context (denormalized)
      account_industry: sfdcContact.Account?.Industry || null,
      account_annual_revenue: sfdcContact.Account?.AnnualRevenue || null,
      account_number_of_employees: sfdcContact.Account?.NumberOfEmployees || null,
      account_type: sfdcContact.Account?.Type || null,
      account_owner_id: sfdcContact.Account?.OwnerId || null,
      account_owner_name: sfdcContact.Account?.Owner?.Name || null,
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

    try {
      const sfdcAuth = await authenticateSalesforce(supabase);
      const sfdcContacts = await querySalesforceContacts(sfdcAuth.connection, salesforceAccountId);

      // Always look up account UUID from Supabase using salesforce_account_id
      // The accountId parameter might be a Salesforce ID string, not a UUID
      let accountUuid = null;
      
      // First, try to use accountId if it looks like a UUID (has dashes)
      if (accountId && accountId.includes('-') && accountId.length === 36) {
        // It's likely a UUID, verify it exists
        const { data: account, error: accountError } = await supabase
          .from('accounts')
          .select('id')
          .eq('id', accountId)
          .single();
        
        if (accountError) {
          // PGRST116 means no rows found - that's okay, we'll try salesforce_id lookup
          if (accountError.code !== 'PGRST116') {
            logError('Error looking up account by UUID:', accountError);
          }
        } else if (account) {
          accountUuid = account.id;
        }
      }
      
      // If we don't have a valid UUID yet, look it up by salesforce_id
      if (!accountUuid) {
        const { data: account, error: accountError } = await supabase
          .from('accounts')
          .select('id')
          .eq('salesforce_id', salesforceAccountId)
          .single();
        
        if (accountError) {
          // PGRST116 means no rows found - that's okay, account might not exist in cache yet
          if (accountError.code !== 'PGRST116') {
            logError('Error looking up account by salesforce_id:', accountError);
          }
        } else if (account) {
          accountUuid = account.id;
        }
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
    } catch (sfdcError) {
      logError('Salesforce contacts query error:', sfdcError);
      
      // If Salesforce fails, try to return stale cache
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
      
      // No cached contacts available, return empty array instead of error
      logWarn('No cached contacts available and Salesforce query failed, returning empty array');
      return sendSuccessResponse(res, {
        contacts: [],
        total: 0,
        cached: false,
        error: isProduction() ? undefined : sfdcError.message,
      });
    }

  } catch (error) {
    logError('Error in salesforce-contacts function:', error);
    logError('Error details:', error.message);
    if (error.stack) {
      logError('Error stack:', error.stack);
    }
    return sendErrorResponse(res, error, 500, isProduction());
  }
};

