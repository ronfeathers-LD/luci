/**
 * Shared Supabase Client Utility
 * 
 * Provides a consistent way to create Supabase clients across all API functions
 */

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
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Supabase client not available:', error.message);
    }
  }
  return null;
}

module.exports = { getSupabaseClient };

