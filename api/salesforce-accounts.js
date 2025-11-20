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

    // Fetch accounts assigned to this user via user_accounts join table
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
          owner_name
        )
      `)
      .eq('user_id', user.id);

    if (userAccountsError) {
      console.error('Error fetching user accounts:', userAccountsError);
      throw userAccountsError;
    }

    // Transform the data to match expected format
    const accounts = (userAccounts || []).map(ua => ({
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

    // TODO: In production, you would also:
    // 1. Sync accounts from Salesforce API periodically
    // 2. Update the accounts table with latest Salesforce data
    // 3. Maintain user_accounts relationships based on Salesforce sharing rules

    return res.status(200).json({
      accounts: accounts,
      total: accounts.length,
      userId: user.id,
      role: user.role || role || 'Account Manager',
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

