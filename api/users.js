/**
 * Vercel Serverless Function for User Management
 * 
 * Handles:
 * - User creation/retrieval (POST/GET)
 * - User-account relationship management (POST/DELETE with action=accounts)
 * Uses Supabase for data persistence
 */

// Import shared Supabase client utility
const { getSupabaseClient } = require('../lib/supabase-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, logError, logWarn, isProduction } = require('../lib/api-helpers');
const { getUserRoles } = require('./roles');

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  try {
    const { action } = req.query;

    // Handle user-account relationship management
    if (action === 'accounts') {
      // Only allow POST and DELETE requests for account management
      if (req.method !== 'POST' && req.method !== 'DELETE') {
        return sendErrorResponse(res, new Error('Method not allowed'), 405);
      }

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
    }

    // Handle user creation/retrieval (existing functionality)
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

      // Record login event
      const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || req.connection?.remoteAddress || null;
      const userAgent = req.headers['user-agent'] || null;
      
      const { error: loginLogError } = await supabase
        .from('user_logins')
        .insert({
          user_id: user.id,
          ip_address: ipAddress,
          user_agent: userAgent,
        });

      if (loginLogError) {
        // Log error but don't fail the login
        logError('Error recording login event:', loginLogError);
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
    } else {
      return sendErrorResponse(res, new Error('Method not allowed'), 405);
    }
  } catch (error) {
    logError('Error in users function:', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
};
