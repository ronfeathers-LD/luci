/**
 * Vercel Serverless Function for Roles Management
 * 
 * Handles listing all available roles
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

  // Only allow GET requests
  if (req.method !== 'GET') {
    return sendErrorResponse(res, new Error('Method not allowed'), 405);
  }

  try {
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    // Get all roles
    const { data: roles, error: fetchError } = await supabase
      .from('roles')
      .select('*')
      .order('name', { ascending: true });

    if (fetchError) {
      logError('Error fetching roles:', fetchError);
      throw fetchError;
    }

    return sendSuccessResponse(res, {
      roles: roles || [],
    });
  } catch (error) {
    logError('Error in roles function:', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
};

