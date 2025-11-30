/**
 * Server-side Supabase Client for Next.js
 * Uses the same logic as lib/supabase-client.js but as ES module
 */

export function getSupabaseClient() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      const missing = [];
      if (!supabaseUrl) missing.push('SUPABASE_URL');
      if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
      console.error(`[Supabase] Missing environment variables: ${missing.join(', ')}`);
      return null;
    }
    
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  } catch (error) {
    console.error('[Supabase] Error creating client:', error.message);
    if (error.stack) {
      console.error('[Supabase] Stack:', error.stack);
    }
    return null;
  }
}

export function validateSupabase(supabase) {
  if (!supabase) {
    return {
      valid: false,
      error: { status: 503, message: 'Database not configured' }
    };
  }
  return { valid: true };
}

