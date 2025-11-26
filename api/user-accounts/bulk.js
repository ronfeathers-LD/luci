/**
 * Vercel Serverless Function for Bulk User-Account Relationship Management
 * 
 * Handles bulk removal of account relationships for users
 * Uses Supabase for data persistence
 */

// Import shared Supabase client utility
const { getSupabaseClient } = require('../../lib/supabase-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } = require('../../lib/api-helpers');

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return sendErrorResponse(res, new Error('Method not allowed'), 405);
  }

  try {
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    const { userId, accountIds } = req.body;

    if (!userId) {
      return sendErrorResponse(res, new Error('Missing required field: userId'), 400);
    }

    if (!accountIds || !Array.isArray(accountIds) || accountIds.length === 0) {
      return sendErrorResponse(res, new Error('Missing required field: accountIds (must be a non-empty array)'), 400);
    }

    // Get user to verify it exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return sendErrorResponse(res, new Error('User not found'), 404);
    }

    // Find all accounts by their salesforce_ids
    const { data: accounts, error: accountError } = await supabase
      .from('accounts')
      .select('id, salesforce_id')
      .in('salesforce_id', accountIds);

    if (accountError) {
      logError('Error fetching accounts:', accountError);
      return sendErrorResponse(res, new Error('Failed to fetch accounts'), 500);
    }

    if (!accounts || accounts.length === 0) {
      return sendErrorResponse(res, new Error('No matching accounts found in cache'), 404);
    }

    // Get the UUID account IDs
    const accountUuids = accounts.map(acc => acc.id);

    // Remove all user-account relationships for these accounts
    const { error: deleteError } = await supabase
      .from('user_accounts')
      .delete()
      .eq('user_id', userId)
      .in('account_id', accountUuids);

    if (deleteError) {
      logError('Error deleting user-account relationships:', deleteError);
      return sendErrorResponse(res, new Error('Failed to remove account relationships'), 500);
    }

    return sendSuccessResponse(res, {
      message: `Successfully removed ${accounts.length} account${accounts.length > 1 ? 's' : ''}`,
      removedCount: accounts.length,
    });
  } catch (error) {
    logError('Error in user-accounts bulk function:', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
};

