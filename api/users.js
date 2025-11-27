/**
 * Vercel Serverless Function for User Management
 * 
 * Creates or retrieves user information after Google OAuth login
 * Uses Supabase for data persistence
 */

// Import shared Supabase client utility
const { getSupabaseClient } = require('../lib/supabase-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, logWarn, isProduction } = require('../lib/api-helpers');
const { getUserRoles } = require('./roles');

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  // Only allow POST and GET requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return sendErrorResponse(res, new Error('Method not allowed'), 405);
  }

  try {
    if (req.method === 'POST') {
      // Create or update user
      const { email, name, picture, sub } = req.body;

      if (!email || !sub) {
        return sendErrorResponse(res, new Error('Missing required fields: email and sub'), 400);
      }

      // Get Supabase client
      const supabase = getSupabaseClient();
      
      if (!validateSupabase(supabase, res)) {
        return; // Response already sent
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
          logError('Error updating user:', updateError);
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
          logError('Error creating user:', insertError);
          throw insertError;
        }

        user = newUser;

        // Assign default "Account Manager" role to new users
        const { data: defaultRole, error: roleError } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'Account Manager')
          .single();

        if (roleError) {
          logError('Error fetching Account Manager role:', roleError);
        }

        if (defaultRole) {
          const { error: insertRoleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: user.id,
              role_id: defaultRole.id,
            });

          if (insertRoleError) {
            logError('Error assigning default role to new user:', insertRoleError);
            // Continue anyway - user is created, role assignment can be done later
          }
        } else if (!roleError) {
          // Only warn if role lookup succeeded but returned no role
          logWarn('Could not assign default role to new user - Account Manager role not found in database');
        }
      }

      // Fetch and include roles
      const roles = await getUserRoles(supabase, user.id);
      const userWithRoles = {
        ...user,
        roles: roles,
      };

      return sendSuccessResponse(res, userWithRoles);
    } else if (req.method === 'GET') {
      // Get user by email or ID
      const { email, id, google_sub } = req.query;

      if (!email && !id && !google_sub) {
        return sendErrorResponse(res, new Error('Missing required parameter: email, id, or google_sub'), 400);
      }

      // Get Supabase client
      const supabase = getSupabaseClient();
      
      if (!validateSupabase(supabase, res)) {
        return; // Response already sent
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
          return sendErrorResponse(res, new Error('User not found'), 404);
        }
        logError('Error fetching user:', fetchError);
        throw fetchError;
      }

      // Fetch and include roles
      const roles = await getUserRoles(supabase, user.id);
      const userWithRoles = {
        ...user,
        roles: roles,
      };

      return sendSuccessResponse(res, userWithRoles);
    }
  } catch (error) {
    logError('Error in users function:', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
}

