/**
 * Next.js App Router API Route for User-Account Relationship Management
 * 
 * Handles:
 * - POST /api/users/accounts - Add account relationship
 * - DELETE /api/users/accounts - Remove account relationship(s)
 */

import { NextRequest } from 'next/server';
import { getSupabaseClient, validateSupabase } from '../../../../lib/supabase-server';
import { sendErrorResponse, sendSuccessResponse } from '../../../../lib/next-api-helpers';

function logError(message, error) {
  console.error(`[ERROR] ${message}`, error);
}

// Handle OPTIONS preflight
export async function OPTIONS() {
  const response = new Response(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// POST /api/users/accounts - Add single account relationship
export async function POST(request) {
  try {
    const { userId, accountId } = await request.json();

    if (!userId) {
      return sendErrorResponse(new Error('Missing required field: userId'), 400);
    }

    if (!accountId) {
      return sendErrorResponse(new Error('Missing required field: accountId'), 400);
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

    // Find account by salesforce_id
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id, salesforce_id')
      .eq('salesforce_id', accountId)
      .single();

    if (accountError || !account) {
      return sendErrorResponse(new Error(`Account with Salesforce ID "${accountId}" not found in cache. Please search for the account first to cache it.`), 404);
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
      return sendErrorResponse(new Error('Failed to add account relationship'), 500);
    }

    return sendSuccessResponse({
      message: 'Account added successfully',
      relationship: relationship,
    });
  } catch (error) {
    logError('Error in POST /api/users/accounts:', error);
    return sendErrorResponse(error, 500);
  }
}

// DELETE /api/users/accounts - Remove account relationship(s)
export async function DELETE(request) {
  try {
    const { userId, accountId, accountIds, clearAll } = await request.json();

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
        return sendErrorResponse(new Error('Failed to clear account relationships'), 500);
      }

      return sendSuccessResponse({
        message: `Successfully cleared all account relationships`,
        clearedCount: beforeCount || 0,
      });
    } else if (accountIds && Array.isArray(accountIds) && accountIds.length > 0) {
      // Bulk remove: Remove multiple accounts
      const { data: accounts, error: accountError } = await supabase
        .from('accounts')
        .select('id, salesforce_id')
        .in('salesforce_id', accountIds);

      if (accountError) {
        logError('Error fetching accounts:', accountError);
        return sendErrorResponse(new Error('Failed to fetch accounts'), 500);
      }

      if (!accounts || accounts.length === 0) {
        return sendErrorResponse(new Error('No matching accounts found in cache'), 404);
      }

      const accountUuids = accounts.map(acc => acc.id);

      const { error: deleteError } = await supabase
        .from('user_accounts')
        .delete()
        .eq('user_id', userId)
        .in('account_id', accountUuids);

      if (deleteError) {
        logError('Error deleting user-account relationships:', deleteError);
        return sendErrorResponse(new Error('Failed to remove account relationships'), 500);
      }

      return sendSuccessResponse({
        message: `Successfully removed ${accounts.length} account${accounts.length > 1 ? 's' : ''}`,
        removedCount: accounts.length,
      });
    } else if (accountId) {
      // Single remove: Remove one account
      const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('id, salesforce_id')
        .eq('salesforce_id', accountId)
        .single();

      if (accountError || !account) {
        return sendErrorResponse(new Error(`Account with Salesforce ID "${accountId}" not found in cache. Please search for the account first to cache it.`), 404);
      }

      const { error: deleteError } = await supabase
        .from('user_accounts')
        .delete()
        .eq('user_id', userId)
        .eq('account_id', account.id);

      if (deleteError) {
        logError('Error deleting user-account relationship:', deleteError);
        return sendErrorResponse(new Error('Failed to remove account relationship'), 500);
      }

      return sendSuccessResponse({
        message: 'Account removed successfully',
      });
    } else {
      return sendErrorResponse(new Error('Missing required field: accountId, accountIds, or clearAll'), 400);
    }
  } catch (error) {
    logError('Error in DELETE /api/users/accounts:', error);
    return sendErrorResponse(error, 500);
  }
}

