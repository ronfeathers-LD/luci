/**
 * Next.js App Router API Route for Roles and User-Role Management
 * 
 * Handles:
 * - GET /api/roles - List all available roles
 * - GET /api/roles?userRoles=true - List all users with their roles
 * - GET /api/roles?userRoles=true&userId=X - Get specific user with roles
 * - PUT /api/roles - Update user roles
 */

import { NextRequest } from 'next/server';
import { getSupabaseClient, validateSupabase } from '../../../lib/supabase-server';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/next-api-helpers';
import { getUserRoles, getAllUsersWithRoles } from '../../../lib/roles-helpers';

function logError(message, error) {
  console.error(`[ERROR] ${message}`, error);
}

// Handle OPTIONS preflight
export async function OPTIONS() {
  const response = new Response(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// GET /api/roles
export async function GET(request) {
  try {
    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }

    const { searchParams } = new URL(request.url);
    const userRoles = searchParams.get('userRoles');
    const userId = searchParams.get('userId');

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
          return sendErrorResponse(new Error('User not found'), 404);
        }

        const roles = await getUserRoles(supabase, userId);
        return sendSuccessResponse({
          ...user,
          roles: roles,
        });
      } else {
        // Get all users with roles
        const usersWithRoles = await getAllUsersWithRoles(supabase);
        return sendSuccessResponse({
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

      return sendSuccessResponse({
        roles: roles || [],
      });
    }
  } catch (error) {
    logError('Error in GET /api/roles:', error);
    return sendErrorResponse(error, 500);
  }
}

// PUT /api/roles - Update user roles
export async function PUT(request) {
  try {
    const { userId, roleIds, roleNames } = await request.json();

    if (!userId) {
      return sendErrorResponse(new Error('Missing required field: userId'), 400);
    }

    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return sendErrorResponse(new Error('User not found'), 404);
    }

    // Get current user roles to determine what changed
    const currentRoles = await getUserRoles(supabase, userId);
    const currentRoleIds = new Set(currentRoles.map(r => r.id));

    // Determine which roles to assign
    let rolesToAssign = [];

    if (roleIds && Array.isArray(roleIds)) {
      rolesToAssign = roleIds;
    } else if (roleNames && Array.isArray(roleNames)) {
      const { data: roles, error: rolesError } = await supabase
        .from('roles')
        .select('id, name')
        .in('name', roleNames);

      if (rolesError) {
        logError('Error fetching roles:', rolesError);
        return sendErrorResponse(new Error('Failed to fetch roles'), 500);
      }

      rolesToAssign = (roles || []).map(r => r.id);
    } else {
      return sendErrorResponse(new Error('Missing required field: roleIds or roleNames'), 400);
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
        return sendErrorResponse(new Error('Failed to remove roles'), 500);
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
        return sendErrorResponse(new Error('Failed to add roles'), 500);
      }
    }

    // Get updated roles
    const updatedRoles = await getUserRoles(supabase, userId);

    return sendSuccessResponse({
      message: 'User roles updated successfully',
      user: {
        id: userId,
        roles: updatedRoles,
      },
    });
  } catch (error) {
    logError('Error in PUT /api/roles:', error);
    return sendErrorResponse(error, 500);
  }
}

