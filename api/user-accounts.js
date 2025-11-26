/**
 * Vercel Serverless Function for User-Account Relationship Management
 * 
 * Handles adding and removing account relationships for users
 * Uses Supabase for data persistence
 */

// Import shared Supabase client utility
const { getSupabaseClient } = require('../lib/supabase-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } = require('../lib/api-helpers');

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  // Only allow POST and DELETE requests
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return sendErrorResponse(res, new Error('Method not allowed'), 405);
  }

  try {
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    const { userId, accountId } = req.body;

    if (!userId) {
      return sendErrorResponse(res, new Error('Missing required field: userId'), 400);
    }

    if (!accountId) {
      return sendErrorResponse(res, new Error('Missing required field: accountId'), 400);
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

    // Find account by salesforce_id (accountId from client will be Salesforce ID)
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id, salesforce_id')
      .eq('salesforce_id', accountId)
      .single();

    if (accountError || !account) {
      // Account might not exist in cache yet - return helpful error
      return sendErrorResponse(res, new Error(`Account with Salesforce ID "${accountId}" not found in cache. Please search for the account first to cache it.`), 404);
    }

    if (req.method === 'POST') {
      // Add user-account relationship
      const { data: relationship, error: relationError } = await supabase
        .from('user_accounts')
        .upsert({
          user_id: userId,
          account_id: account.id,
        }, {
          onConflict: 'user_id,account_id',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (relationError) {
        logError('Error creating user-account relationship:', relationError);
        return sendErrorResponse(res, new Error('Failed to add account relationship'), 500);
      }

      return sendSuccessResponse(res, {
        message: 'Account added successfully',
        relationship: relationship,
      });
    } else if (req.method === 'DELETE') {
      // Remove user-account relationship
      const { error: deleteError } = await supabase
        .from('user_accounts')
        .delete()
        .eq('user_id', userId)
        .eq('account_id', account.id);

      if (deleteError) {
        logError('Error deleting user-account relationship:', deleteError);
        return sendErrorResponse(res, new Error('Failed to remove account relationship'), 500);
      }

      return sendSuccessResponse(res, {
        message: 'Account removed successfully',
      });
    }
  } catch (error) {
    logError('Error in user-accounts function:', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
};

