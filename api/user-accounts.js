/**
 * Vercel Serverless Function for User-Account Relationship Management
 * 
 * Handles adding and removing account relationships for users
 * Supports single operations, bulk operations, and clearing all
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

    const { userId, accountId, accountIds, clearAll } = req.body;

    if (!userId) {
      return sendErrorResponse(res, new Error('Missing required field: userId'), 400);
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

    if (req.method === 'POST') {
      // POST: Add single account relationship
      if (!accountId) {
        return sendErrorResponse(res, new Error('Missing required field: accountId'), 400);
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
      // DELETE: Handle single remove, bulk remove, or clear all
      
      if (clearAll) {
        // Clear all accounts for this user
        const { count: beforeCount, error: countError } = await supabase
          .from('user_accounts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (countError) {
          logError('Error counting user-account relationships:', countError);
        }

        const { error: deleteError } = await supabase
          .from('user_accounts')
          .delete()
          .eq('user_id', userId);

        if (deleteError) {
          logError('Error deleting user-account relationships:', deleteError);
          return sendErrorResponse(res, new Error('Failed to clear account relationships'), 500);
        }

        return sendSuccessResponse(res, {
          message: `Successfully cleared all account relationships`,
          clearedCount: beforeCount || 0,
        });
      } else if (accountIds && Array.isArray(accountIds) && accountIds.length > 0) {
        // Bulk remove: Remove multiple accounts
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
      } else if (accountId) {
        // Single remove: Remove one account
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
      } else {
        return sendErrorResponse(res, new Error('Missing required field: accountId, accountIds, or clearAll'), 400);
      }
    }
  } catch (error) {
    logError('Error in user-accounts function:', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
};

