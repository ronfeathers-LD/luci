/**
 * Vercel Serverless Function for User Management
 * 
 * Creates or retrieves user information after Google OAuth login
 * Uses Supabase for data persistence
 */

// Import shared Supabase client utility
const { getSupabaseClient } = require('../lib/supabase-client');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST and GET requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (req.method === 'POST') {
      // Create or update user
      const { email, name, picture, sub } = req.body;

      if (!email || !sub) {
        return res.status(400).json({ error: 'Missing required fields: email and sub' });
      }

      // Get Supabase client
      const supabase = getSupabaseClient();
      
      // Check if Supabase is configured
      if (!supabase) {
        // Fallback to mock data if Supabase not configured
        console.warn('Supabase not configured, using mock data');
        return res.status(200).json({
          id: sub,
          google_sub: sub,
          email: email,
          name: name || email.split('@')[0],
          picture: picture || null,
          role: 'Account Manager',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // Check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('google_sub', sub)
        .single();

      let user;

      if (existingUser) {
        // Update existing user
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            email: email,
            name: name || existingUser.name,
            picture: picture || existingUser.picture,
            updated_at: new Date().toISOString(),
          })
          .eq('google_sub', sub)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user:', updateError);
          throw updateError;
        }

        user = updatedUser;
      } else {
        // Create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            google_sub: sub,
            email: email,
            name: name || email.split('@')[0],
            picture: picture || null,
            role: 'Account Manager', // Default role, can be updated later
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
          throw insertError;
        }

        user = newUser;
      }

      return res.status(200).json(user);
    } else if (req.method === 'GET') {
      // Get user by email or ID
      const { email, id, google_sub } = req.query;

      if (!email && !id && !google_sub) {
        return res.status(400).json({ error: 'Missing required parameter: email, id, or google_sub' });
      }

      // Get Supabase client
      const supabase = getSupabaseClient();
      
      // Check if Supabase is configured
      if (!supabase) {
        // Fallback to mock data
        console.warn('Supabase not configured, using mock data');
        return res.status(200).json({
          id: id || 'mock-user-id',
          google_sub: google_sub || 'mock-sub',
          email: email || 'user@example.com',
          name: email?.split('@')[0] || 'User',
          role: 'Account Manager',
        });
      }

      // Build query based on provided parameter
      let query = supabase.from('users').select('*');

      if (id) {
        query = query.eq('id', id);
      } else if (google_sub) {
        query = query.eq('google_sub', google_sub);
      } else if (email) {
        query = query.eq('email', email);
      }

      const { data: user, error: fetchError } = await query.single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No rows returned
          return res.status(404).json({ error: 'User not found' });
        }
        console.error('Error fetching user:', fetchError);
        throw fetchError;
      }

      return res.status(200).json(user);
    }
  } catch (error) {
    console.error('Error in users function:', error);
    return res.status(500).json({ 
      error: process.env.NODE_ENV === 'production' 
        ? 'An error occurred' 
        : error.message 
    });
  }
}

