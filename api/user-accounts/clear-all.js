/**
 * Vercel Serverless Function for Clearing All User-Account Relationships
 * 
 * Removes all account relationships for a user
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

  // Only allow POST requests
  if (req.method !== 'POST') {
    return sendErrorResponse(res, new Error('Method not allowed'), 405);
  }

  try {
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    const { userId } = req.body;

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

    // Count existing relationships before deletion
    const { count: beforeCount, error: countError } = await supabase
      .from('user_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      logError('Error counting user-account relationships:', countError);
      // Continue anyway - the delete might still work
    }

    // Remove all user-account relationships for this user
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
  } catch (error) {
    logError('Error in user-accounts clear-all function:', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
};

