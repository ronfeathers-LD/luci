/**
 * Vercel Serverless Function for Salesforce Account Fetching
 * 
 * Fetches accounts from Salesforce assigned to a user based on their role
 * Uses Supabase to store and retrieve account assignments
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

/**
 * Authenticate with Salesforce using Username-Password OAuth flow
 */
async function authenticateSalesforce() {
  const username = process.env.SFDC_USERNAME;
  const password = process.env.SFDC_PASSWORD;
  const securityToken = process.env.SFDC_SECURITY_TOKEN;
  const clientId = process.env.SFDC_CLIENT_ID;
  const clientSecret = process.env.SFDC_CLIENT_SECRET;
  const loginUrl = process.env.SFDC_LOGIN_URL || 'https://login.salesforce.com';

  if (!username || !password || !clientId || !clientSecret) {
    throw new Error('Salesforce credentials not configured');
  }

  // Construct the password (password + security token if provided)
  const fullPassword = securityToken ? `${password}${securityToken}` : password;

  // OAuth token endpoint
  const tokenUrl = `${loginUrl}/services/oauth2/token`;

  const params = new URLSearchParams({
    grant_type: 'password',
    client_id: clientId,
    client_secret: clientSecret,
    username: username,
    password: fullPassword,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Salesforce authentication failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    instanceUrl: data.instance_url,
    tokenType: data.token_type,
  };
}

/**
 * Query Salesforce for accounts based on user role/ownership
 */
async function querySalesforceAccounts(accessToken, instanceUrl, userId, userEmail, role) {
  // Build SOQL query based on user role
  // For Account Managers, get accounts where they are the owner or team member
  // Adjust the query based on your Salesforce sharing rules and role hierarchy
  
  let soqlQuery;
  
  if (role === 'Account Manager' || role === 'Sales Rep') {
    // Query accounts owned by user or in their territory
    // This assumes you have a way to map SFDC user to our user (by email)
    soqlQuery = `
      SELECT Id, Name, Account_Tier__c, Contract_Value__c, Industry, 
             AnnualRevenue, OwnerId, Owner.Name, Owner.Email
      FROM Account
      WHERE Owner.Email = '${userEmail}'
         OR Id IN (
           SELECT AccountId 
           FROM AccountTeamMember 
           WHERE UserId IN (
             SELECT Id FROM User WHERE Email = '${userEmail}'
           )
         )
      ORDER BY Name
      LIMIT 100
    `;
  } else {
    // For admins or other roles, get all accounts (adjust as needed)
    soqlQuery = `
      SELECT Id, Name, Account_Tier__c, Contract_Value__c, Industry, 
             AnnualRevenue, OwnerId, Owner.Name, Owner.Email
      FROM Account
      ORDER BY Name
      LIMIT 100
    `;
  }

  const queryUrl = `${instanceUrl}/services/data/v58.0/query?q=${encodeURIComponent(soqlQuery)}`;

  const response = await fetch(queryUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Salesforce query failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.records || [];
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
    const accountData = {
      salesforce_id: sfdcAccount.Id,
      name: sfdcAccount.Name,
      account_tier: sfdcAccount.Account_Tier__c || null,
      contract_value: sfdcAccount.Contract_Value__c || null,
      industry: sfdcAccount.Industry || null,
      annual_revenue: sfdcAccount.AnnualRevenue || null,
      owner_id: sfdcAccount.OwnerId || null,
      owner_name: sfdcAccount.Owner?.Name || null,
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
 */
async function getCachedAccounts(supabase, userId, email, role) {
  if (!supabase) {
    return null;
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
    return null;
  }

  // Get accounts
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
        owner_name
      )
    `)
    .eq('user_id', user.id);

  if (!userAccounts || userAccounts.length === 0) {
    return null;
  }

  return userAccounts.map(ua => ({
    id: ua.accounts.salesforce_id || ua.accounts.id,
    salesforceId: ua.accounts.salesforce_id,
    name: ua.accounts.name,
    accountTier: ua.accounts.account_tier,
    contractValue: ua.accounts.contract_value,
    industry: ua.accounts.industry,
    annualRevenue: ua.accounts.annual_revenue ? parseFloat(ua.accounts.annual_revenue) : null,
    ownerId: ua.accounts.owner_id,
    ownerName: ua.accounts.owner_name,
  }));
}

// Constants
const MAX_REQUEST_SIZE = 1024 * 1024; // 1MB
const REQUEST_TIMEOUT = 30000; // 30 seconds

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

  const { userId, email, role } = req.query;

  // Validate input
  if (!userId && !email) {
    return res.status(400).json({ error: 'Missing required parameter: userId or email' });
  }

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

    // Try to authenticate with Salesforce and fetch fresh data
    let accounts = [];
    let useCached = false;

    try {
      const sfdcAuth = await authenticateSalesforce();
      const sfdcAccounts = await querySalesforceAccounts(
        sfdcAuth.accessToken,
        sfdcAuth.instanceUrl,
        user.id,
        user.email,
        user.role || role
      );

      // Sync accounts to Supabase
      const syncedAccounts = await syncAccountsToSupabase(supabase, sfdcAccounts, user.id);

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
    } catch (sfdcError) {
      console.error('Salesforce API error:', sfdcError);
      // Fallback to cached accounts from Supabase
      const cachedAccounts = await getCachedAccounts(supabase, user.id, user.email, user.role);
      if (cachedAccounts && cachedAccounts.length > 0) {
        accounts = cachedAccounts;
        useCached = true;
      } else {
        // No cached accounts, return error
        return res.status(500).json({
          error: 'Failed to fetch accounts from Salesforce and no cached accounts available',
          details: process.env.NODE_ENV === 'production' ? undefined : sfdcError.message,
        });
      }
    }

    // If we have accounts from Supabase but didn't sync, get them
    if (accounts.length === 0 && !useCached) {
      const cachedAccounts = await getCachedAccounts(supabase, user.id, user.email, user.role);
      if (cachedAccounts) {
        accounts = cachedAccounts;
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
    return res.status(500).json({ 
      error: process.env.NODE_ENV === 'production' 
        ? 'Failed to fetch accounts from Salesforce' 
        : error.message 
    });
  }
}

