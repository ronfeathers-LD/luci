/**
 * Next.js App Router API Route for User Management
 * 
 * Handles:
 * - User creation/retrieval (POST/GET)
 * Uses Supabase for data persistence
 */

import { NextRequest } from 'next/server';
import { getSupabaseClient, validateSupabase } from '../../../lib/supabase-server';
import { sendErrorResponse, sendSuccessResponse, getClientIP } from '../../../lib/next-api-helpers';
import { getUserRoles } from '../../../lib/roles-helpers';

function logError(message, error) {
  console.error(`[ERROR] ${message}`, error);
}

function logWarn(message) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[WARN] ${message}`);
  }
}

// Handle OPTIONS preflight
export async function OPTIONS() {
  const response = new Response(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// POST /api/users - Create or update user
export async function POST(request) {
  try {
    const { email, name, picture, sub } = await request.json();

    if (!email || !sub) {
      return sendErrorResponse(new Error('Missing required fields: email and sub'), 400);
    }

    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
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
          role: 'Account Manager',
        })
        .select()
        .single();

      if (insertError) {
        logError('Error creating user:', insertError);
        throw insertError;
      }

      user = newUser;

      // Assign default "Account Manager" role
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
        }
      } else if (!roleError) {
        logWarn('Could not assign default role to new user - Account Manager role not found in database');
      }
    }

    // Record login event
    const ipAddress = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || null;
    
    const { error: loginLogError } = await supabase
      .from('user_logins')
      .insert({
        user_id: user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
      });

    if (loginLogError) {
      logError('Error recording login event:', loginLogError);
    }

    // Fetch and include roles
    const roles = await getUserRoles(supabase, user.id);
    const userWithRoles = {
      ...user,
      roles: roles,
    };

    return sendSuccessResponse(userWithRoles);
  } catch (error) {
    logError('Error in POST /api/users:', error);
    return sendErrorResponse(error, 500);
  }
}

// GET /api/users - Get user by email, id, or google_sub
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');
    const google_sub = searchParams.get('google_sub');

    if (!email && !id && !google_sub) {
      return sendErrorResponse(new Error('Missing required parameter: email, id, or google_sub'), 400);
    }

    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
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
        return sendErrorResponse(new Error('User not found'), 404);
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

    return sendSuccessResponse(userWithRoles);
  } catch (error) {
    logError('Error in GET /api/users:', error);
    return sendErrorResponse(error, 500);
  }
}

