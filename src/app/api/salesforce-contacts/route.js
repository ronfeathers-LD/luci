/**
 * Next.js App Router API Route for Salesforce Contacts
 * 
 * Fetches Contacts from Salesforce for a specific account with intelligent caching
 * Only calls Salesforce API when cache is stale or missing
 * Filters out contacts with Contact Status = "Unqualified"
 */

import { NextRequest } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabase-server';
import { handlePreflight, validateRequestSize, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, logWarn, isProduction } from '../../../lib/next-api-helpers';

// Can use require for lib files in Next.js API routes
const { normalizeLinkedInURL } = require('../../../../lib/linkedin-url-utils');
const { authenticateSalesforce, escapeSOQL } = require('../../../../lib/salesforce-client');
const { isCacheFresh } = require('../../../../lib/cache-helpers');
const { MAX_REQUEST_SIZE, CACHE_TTL, API_LIMITS } = require('../../../../lib/constants');

/**
 * Query Salesforce for Contacts
 */
async function querySalesforceContacts(conn, salesforceAccountId) {
  const escapedAccountId = salesforceAccountId.replace(/'/g, "\\'");
  
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
  
  const filteredContacts = (result.records || []).filter(contact => {
    const status = contact.Contact_Status__c || null;
    return status !== 'Unqualified';
  });
  
  if (filteredContacts.length > 0) {
    log(`Retrieved ${filteredContacts.length} contacts from Salesforce`);
  }
  
  if (filteredContacts.length === 0 && contactCount > 0) {
    logWarn(`All ${contactCount} contacts for account ${salesforceAccountId} were filtered out (likely all have Contact_Status__c = 'Unqualified')`);
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
    const contactStatus = sfdcContact.Contact_Status__c || null;
    if (contactStatus === 'Unqualified') {
      continue;
    }

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
      linkedin_url: linkedinURL,
      department: sfdcContact.Department || null,
      reports_to_id: sfdcContact.ReportsToId || null,
      reports_to_name: sfdcContact.ReportsTo?.Name || null,
      owner_id: sfdcContact.OwnerId || null,
      owner_name: sfdcContact.Owner?.Name || null,
      do_not_call: sfdcContact.DoNotCall || false,
      email_opt_out: sfdcContact.HasOptedOutOfEmail || false,
      mailing_street: sfdcContact.MailingStreet || null,
      mailing_city: sfdcContact.MailingCity || null,
      mailing_state: sfdcContact.MailingState || null,
      mailing_postal_code: sfdcContact.MailingPostalCode || null,
      mailing_country: sfdcContact.MailingCountry || null,
      last_activity_date: sfdcContact.LastActivityDate ? new Date(sfdcContact.LastActivityDate).toISOString() : null,
      created_date: sfdcContact.CreatedDate ? new Date(sfdcContact.CreatedDate).toISOString() : null,
      last_modified_date: sfdcContact.LastModifiedDate ? new Date(sfdcContact.LastModifiedDate).toISOString() : null,
      lead_source: sfdcContact.LeadSource || null,
      birthdate: sfdcContact.Birthdate || null,
      assistant_name: sfdcContact.AssistantName || null,
      assistant_phone: sfdcContact.AssistantPhone || null,
      description: sfdcContact.Description || null,
      account_industry: sfdcContact.Account?.Industry || null,
      account_annual_revenue: sfdcContact.Account?.AnnualRevenue || null,
      account_number_of_employees: sfdcContact.Account?.NumberOfEmployees || null,
      account_type: sfdcContact.Account?.Type || null,
      account_owner_id: sfdcContact.Account?.OwnerId || null,
      account_owner_name: sfdcContact.Account?.Owner?.Name || null,
      last_synced_at: new Date().toISOString(),
    };

    let { data: contactRecord, error: contactError } = await supabase
      .from('contacts')
      .upsert(contactData, {
        onConflict: 'salesforce_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (contactError && contactError.code === 'PGRST204') {
      logWarn(`Missing column detected for contact ${sfdcContact.Id}, retrying with core fields only:`, contactError.message);
      
      const coreContactData = {
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
        last_synced_at: new Date().toISOString(),
      };

      const retryResult = await supabase
        .from('contacts')
        .upsert(coreContactData, {
          onConflict: 'salesforce_id',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      contactRecord = retryResult.data;
      contactError = retryResult.error;
    }

    if (contactError) {
      logError(`Error syncing contact ${sfdcContact.Id}:`, contactError);
      continue;
    }

    syncedContacts.push(contactRecord);
  }

  return syncedContacts;
}

// Handle OPTIONS preflight
export async function OPTIONS() {
  return handlePreflight(new NextRequest('http://localhost', { method: 'OPTIONS' }));
}

// GET /api/salesforce-contacts
export async function GET(request) {
  const preflight = await handlePreflight(request);
  if (preflight) return preflight;

  const sizeValidation = validateRequestSize(request, MAX_REQUEST_SIZE.DEFAULT);
  if (!sizeValidation.valid) {
    return sendErrorResponse(new Error(sizeValidation.error.message), sizeValidation.error.status);
  }

  const { searchParams } = new URL(request.url);
  const salesforceAccountId = searchParams.get('salesforceAccountId');
  const accountId = searchParams.get('accountId');
  const forceRefresh = searchParams.get('forceRefresh');

  if (!salesforceAccountId) {
    return sendErrorResponse(new Error('Missing required parameter: salesforceAccountId'), 400);
  }

  const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

  try {
    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }

    // CACHE-FIRST: Check Supabase cache before querying Salesforce
    if (!shouldForceRefresh) {
      const cached = await getCachedContacts(supabase, salesforceAccountId);
      
      if (cached && cached.isFresh) {
        log(`Returning ${cached.contacts.length} cached contacts`);
        
        return sendSuccessResponse({
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
            linkedinURL: c.linkedin_url,
          })),
          total: cached.contacts.length,
          cached: true,
          lastSyncedAt: cached.lastSyncedAt,
        });
      }
    }

    // Cache is stale or missing - query Salesforce
    try {
      const sfdcAuth = await authenticateSalesforce(supabase);
      const sfdcContacts = await querySalesforceContacts(sfdcAuth.connection, salesforceAccountId);

      let accountUuid = null;
      
      if (accountId && accountId.includes('-') && accountId.length === 36) {
        const { data: account, error: accountError } = await supabase
          .from('accounts')
          .select('id')
          .eq('id', accountId)
          .single();
        
        if (accountError) {
          if (accountError.code !== 'PGRST116') {
            logError('Error looking up account by UUID:', accountError);
          }
        } else if (account) {
          accountUuid = account.id;
        }
      }
      
      if (!accountUuid) {
        const { data: account, error: accountError } = await supabase
          .from('accounts')
          .select('id')
          .eq('salesforce_id', salesforceAccountId)
          .single();
        
        if (accountError) {
          if (accountError.code !== 'PGRST116') {
            logError('Error looking up account by salesforce_id:', accountError);
          }
        } else if (account) {
          accountUuid = account.id;
        }
      }

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
        linkedinURL: c.linkedin_url,
      }));

      return sendSuccessResponse({
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
        
        return sendSuccessResponse({
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
            linkedinURL: c.linkedin_url,
          })),
          total: staleCache.contacts.length,
          cached: true,
          stale: true,
          lastSyncedAt: staleCache.lastSyncedAt,
        });
      }
      
      logWarn('No cached contacts available and Salesforce query failed, returning empty array');
      return sendSuccessResponse({
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
    return sendErrorResponse(error, 500);
  }
}

