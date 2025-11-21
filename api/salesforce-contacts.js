/**
 * Vercel Serverless Function for Salesforce Contacts
 * 
 * Fetches Contacts from Salesforce for a specific account with intelligent caching
 * Only calls Salesforce API when cache is stale or missing
 * Filters out contacts with Contact Status = "Unqualified"
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
const CACHE_TTL_HOURS = 24; // Cache contacts for 24 hours (contacts change less frequently)
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

  if (configError || !config) {
    console.error('No active Salesforce configuration found in salesforce_configs table');
    throw new Error('Salesforce configuration not found in Supabase. Please insert credentials into salesforce_configs table.');
  }

  const jsforce = getJsforceClient();
  if (!jsforce) {
    throw new Error('jsforce library not available');
  }

  const conn = new jsforce.Connection({
    loginUrl: config.login_url || 'https://login.salesforce.com',
  });

  // Authenticate with username, password, and security token
  await conn.login(config.username, config.password + (config.security_token || ''));

  if (process.env.NODE_ENV !== 'production') {
    console.log('Salesforce authenticated successfully');
  }

  return {
    connection: conn,
    accessToken: conn.accessToken,
  };
}

/**
 * Escape single quotes in SOQL queries to prevent injection
 */
function escapeSOQL(str) {
  return str.replace(/'/g, "\\'");
}

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
                             LIMIT 100`;
  
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
      console.error('Error querying Salesforce Contacts:', error);
      // Log more details about the error
      if (process.env.NODE_ENV !== 'production') {
        console.error('Contact query error details:', {
          errorCode: error.errorCode,
          message: error.message,
          accountId: salesforceAccountId,
        });
      }
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
  const now = new Date();
  const cacheExpiry = CACHE_TTL_HOURS * 60 * 60 * 1000;
  
  // Find most recent sync time
  const lastSynced = contacts
    .map(c => c.last_synced_at ? new Date(c.last_synced_at) : null)
    .filter(d => d !== null)
    .sort((a, b) => b - a)[0];

  const isFresh = lastSynced && (now - lastSynced) < cacheExpiry;

  return {
    contacts,
    isFresh: !!isFresh,
    lastSyncedAt: lastSynced ? lastSynced.toISOString() : null,
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

    // Extract LinkedIn URL from Person_LinkedIn__c field
    const linkedinURL = sfdcContact.Person_LinkedIn__c || null;

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
      linkedin_url: linkedinURL, // Store LinkedIn URL for enrichment
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
      console.error(`Error syncing contact ${sfdcContact.Id}:`, contactError);
      continue;
    }

    syncedContacts.push(contactRecord);
  }

  return syncedContacts;
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
      const cached = await getCachedContacts(supabase, salesforceAccountId);
      
      if (cached && cached.isFresh) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Using ${cached.contacts.length} cached contacts for account: ${salesforceAccountId}`);
        }
        
        return res.status(200).json({
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
    if (process.env.NODE_ENV !== 'production') {
      if (shouldForceRefresh) {
        console.log(`Force refresh requested for contacts, querying Salesforce`);
      } else {
        console.log(`Cache stale or missing for contacts, querying Salesforce`);
      }
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

    return res.status(200).json({
      contacts: contacts,
      total: contacts.length,
      cached: false,
      lastSyncedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in salesforce-contacts function:', error);
    
    // If Salesforce fails, try to return stale cache
    const supabase = getSupabaseClient();
    if (!shouldForceRefresh && supabase) {
      const staleCache = await getCachedContacts(supabase, salesforceAccountId);
      if (staleCache && staleCache.contacts.length > 0) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Salesforce query failed, using ${staleCache.contacts.length} stale cached contacts`);
        }
        
        return res.status(200).json({
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
    
    return res.status(500).json({
      error: 'Failed to fetch contacts',
      details: process.env.NODE_ENV === 'production' ? undefined : error.message,
    });
  }
};

