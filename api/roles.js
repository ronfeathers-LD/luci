/**
 * Vercel Serverless Function for Roles and User-Role Management
 * 
 * Handles:
 * - GET /api/roles - List all available roles
 * - GET /api/roles?userRoles=true - List all users with their roles
 * - GET /api/roles?userRoles=true&userId=X - Get specific user with roles
 * - PUT /api/roles - Update user roles
 * Uses Supabase for data persistence
 */

// Import shared Supabase client utility
const { getSupabaseClient } = require('../lib/supabase-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } = require('../lib/api-helpers');

/**
 * Check if a user has a specific role (case-insensitive)
 */
async function userHasRole(supabase, userId, roleName) {
  if (!roleName) return false;
  
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      role:roles!inner(name)
    `)
    .eq('user_id', userId)
    .limit(100);

  if (error) {
    logError('Error checking user role:', error);
    return false;
  }

  // Case-insensitive comparison
  const normalizedRoleName = roleName.toLowerCase();
  return data && data.some(item => item.role && item.role.name && item.role.name.toLowerCase() === normalizedRoleName);
}

/**
 * Get all roles for a user
 */
async function getUserRoles(supabase, userId) {
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      role:roles!inner(id, name, description)
    `)
    .eq('user_id', userId);

  if (error) {
    logError('Error fetching user roles:', error);
    return [];
  }

  return (data || []).map(item => item.role);
}

/**
 * Get all users with their roles
 */
async function getAllUsersWithRoles(supabase) {
  // Get all users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, name, picture, created_at')
    .order('created_at', { ascending: false });

  if (usersError) {
    logError('Error fetching users:', usersError);
    throw usersError;
  }

  // Get all user-role relationships
  const { data: userRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select(`
      user_id,
      role:roles!inner(id, name, description)
    `);

  if (rolesError) {
    logError('Error fetching user roles:', rolesError);
    throw rolesError;
  }

  // Group roles by user_id
  const rolesByUserId = {};
  (userRoles || []).forEach(ur => {
    if (!rolesByUserId[ur.user_id]) {
      rolesByUserId[ur.user_id] = [];
    }
    rolesByUserId[ur.user_id].push(ur.role);
  });

  // Combine users with their roles
  return (users || []).map(user => ({
    ...user,
    roles: rolesByUserId[user.id] || [],
  }));
}

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  try {
    // Get Supabase client
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    if (req.method === 'GET') {
      const { userRoles, userId } = req.query;

      if (userRoles === 'true') {
        // Handle user-roles requests
        if (userId) {
          // Get specific user with roles
          const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, email, name, picture, created_at')
            .eq('id', userId)
            .single();

          if (userError || !user) {
            return sendErrorResponse(res, new Error('User not found'), 404);
          }

          const roles = await getUserRoles(supabase, userId);
          return sendSuccessResponse(res, {
            ...user,
            roles: roles,
          });
        } else {
          // Get all users with roles
          const usersWithRoles = await getAllUsersWithRoles(supabase);
          return sendSuccessResponse(res, {
            users: usersWithRoles,
          });
        }
      } else {
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
      }
    } else if (req.method === 'PUT') {
      // PUT: Update user roles
      const { userId, roleIds, roleNames } = req.body;

      if (!userId) {
        return sendErrorResponse(res, new Error('Missing required field: userId'), 400);
      }

      // Verify user exists
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return sendErrorResponse(res, new Error('User not found'), 404);
      }

      // Get current user roles to determine what changed
      const currentRoles = await getUserRoles(supabase, userId);
      const currentRoleIds = new Set(currentRoles.map(r => r.id));

      // Determine which roles to assign
      let rolesToAssign = [];

      if (roleIds && Array.isArray(roleIds)) {
        // Use role IDs
        rolesToAssign = roleIds;
      } else if (roleNames && Array.isArray(roleNames)) {
        // Use role names - need to look up IDs
        const { data: roles, error: rolesError } = await supabase
          .from('roles')
          .select('id, name')
          .in('name', roleNames);

        if (rolesError) {
          logError('Error fetching roles:', rolesError);
          return sendErrorResponse(res, new Error('Failed to fetch roles'), 500);
        }

        rolesToAssign = (roles || []).map(r => r.id);
      } else {
        return sendErrorResponse(res, new Error('Missing required field: roleIds or roleNames'), 400);
      }

      // Determine roles to add and remove
      const newRoleIds = new Set(rolesToAssign);
      const rolesToAdd = rolesToAssign.filter(id => !currentRoleIds.has(id));
      const rolesToRemove = Array.from(currentRoleIds).filter(id => !newRoleIds.has(id));

      // Remove roles that are no longer assigned
      if (rolesToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .in('role_id', rolesToRemove);

        if (deleteError) {
          logError('Error removing user roles:', deleteError);
          return sendErrorResponse(res, new Error('Failed to remove roles'), 500);
        }
      }

      // Add new roles
      if (rolesToAdd.length > 0) {
        const userRoleInserts = rolesToAdd.map(roleId => ({
          user_id: userId,
          role_id: roleId,
        }));

        const { error: insertError } = await supabase
          .from('user_roles')
          .insert(userRoleInserts);

        if (insertError) {
          logError('Error adding user roles:', insertError);
          return sendErrorResponse(res, new Error('Failed to add roles'), 500);
        }
      }

      // Get updated roles
      const updatedRoles = await getUserRoles(supabase, userId);

      return sendSuccessResponse(res, {
        message: 'User roles updated successfully',
        user: {
          id: userId,
          roles: updatedRoles,
        },
      });
    } else {
      return sendErrorResponse(res, new Error('Method not allowed'), 405);
    }
  } catch (error) {
    logError('Error in roles function:', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
};

// Export helper functions for use in other modules
module.exports.userHasRole = userHasRole;
module.exports.getUserRoles = getUserRoles;
