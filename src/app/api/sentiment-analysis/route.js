/**
 * Next.js App Router API Route for Sentiment Analysis Data
 * 
 * Returns sentiment history for a given account, with optional filtering
 * OR returns a single sentiment analysis by ID
 * Supports both single account view and admin "all analyses" view
 */

import { NextRequest } from 'next/server';
import { getSupabaseClient, validateSupabase } from '../../../lib/supabase-server';
import { sendErrorResponse, sendSuccessResponse } from '../../../lib/next-api-helpers';

// Can use require for lib files in Next.js API routes
const { log, logError, isProduction } = require('../../../../lib/api-helpers');

// Handle OPTIONS preflight
export async function OPTIONS() {
  const response = new Response(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// GET /api/sentiment-analysis
export async function GET(request) {
  try {
    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const accountId = searchParams.get('accountId');
    const salesforceAccountId = searchParams.get('salesforceAccountId');
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const days = searchParams.get('days') || '365';
    const all = searchParams.get('all');
    const cached = searchParams.get('cached');
    
    // SINGLE ANALYSIS BY ID
    if (id) {
      const { data: analysis, error } = await supabase
        .from('sentiment_history')
        .select(`
          *,
          accounts:account_id (
            id,
            name,
            salesforce_id
          ),
          users:user_id (
            id,
            email,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return sendErrorResponse(new Error('Sentiment analysis not found'), 404);
        }
        logError('Error fetching sentiment analysis:', error);
        return sendErrorResponse(new Error(`Failed to fetch sentiment analysis: ${error.message}`), 500);
      }

      if (!analysis) {
        return sendErrorResponse(new Error('Sentiment analysis not found'), 404);
      }

      return sendSuccessResponse({
        analysis: analysis,
      });
    }

    // HISTORY/ANALYSES LIST
    const isAdminView = all === 'true';

    // Calculate date filter
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    if (isAdminView) {
      // ADMIN VIEW: All analyses across all accounts
      let query = supabase
        .from('sentiment_history')
        .select(`
          *,
          accounts:account_id (
            id,
            name,
            salesforce_id
          ),
          users:user_id (
            id,
            email,
            name
          )
        `)
        .gte('analyzed_at', daysAgo.toISOString())
        .order('analyzed_at', { ascending: false });

      if (accountId) {
        query = query.eq('account_id', accountId);
      }

      if (cached === 'true') {
        query = query.not('input_hash', 'is', null);
      }

      query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      let countQuery = supabase
        .from('sentiment_history')
        .select('id', { count: 'exact', head: true })
        .gte('analyzed_at', daysAgo.toISOString());

      if (accountId) {
        countQuery = countQuery.eq('account_id', accountId);
      }

      if (cached === 'true') {
        countQuery = countQuery.not('input_hash', 'is', null);
      }

      const [queryResult, countResult] = await Promise.all([
        query,
        countQuery
      ]);

      const { data: analyses, error } = queryResult;
      
      if (error) {
        logError('Error fetching all analyses', error);
        return sendErrorResponse(new Error(`Failed to fetch analyses: ${error.message}`), 500);
      }
      
      if (analyses && analyses.length > 0) {
        log(`Fetched ${analyses.length} analyses`);
      }

      const { count, error: countError } = countResult;

      if (countError) {
        logError('Error counting analyses', countError);
      }

      const stats = {
        total: count || analyses?.length || 0,
        cached: 0,
        unique: 0,
        averageScore: 0,
        byScore: {
          high: 0,
          medium: 0,
          low: 0,
        },
      };

      if (analyses && analyses.length > 0) {
        stats.cached = analyses.filter(a => a.input_hash).length;
        const uniqueHashes = new Set(analyses.filter(a => a.input_hash).map(a => a.input_hash));
        stats.unique = uniqueHashes.size;
        const scores = analyses.map(a => a.score);
        stats.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        scores.forEach(score => {
          if (score >= 8) stats.byScore.high++;
          else if (score >= 5) stats.byScore.medium++;
          else stats.byScore.low++;
        });
      }

      return sendSuccessResponse({
        analyses: analyses || [],
        stats,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: count || analyses?.length || 0,
        },
      });

    } else {
      // SINGLE ACCOUNT VIEW
      if (!accountId && !salesforceAccountId) {
        return sendErrorResponse(new Error('Missing required parameter: accountId or salesforceAccountId'), 400);
      }

      let resolvedAccountId = accountId;
      const isUUID = accountId && accountId.includes('-') && accountId.length === 36;
      
      if (!isUUID) {
        const lookupId = accountId || salesforceAccountId;
        if (lookupId) {
          const { data: account, error: accountError } = await supabase
            .from('accounts')
            .select('id')
            .eq('salesforce_id', lookupId)
            .single();
          
          if (accountError || !account) {
            logError('Account lookup error:', accountError);
            return sendErrorResponse(new Error('Account not found'), 404);
          }
          
          resolvedAccountId = account.id;
        }
      }
      
      if (!resolvedAccountId) {
        return sendErrorResponse(new Error('Could not resolve account ID'), 400);
      }

      let query = supabase
        .from('sentiment_history')
        .select('*')
        .eq('account_id', resolvedAccountId)
        .gte('analyzed_at', daysAgo.toISOString())
        .order('analyzed_at', { ascending: false })
        .limit(parseInt(limit));

      const { data: history, error } = await query;

      if (error) {
        logError('Error fetching sentiment history:', error);
        return sendErrorResponse(new Error(`Failed to fetch sentiment history: ${error.message}`), 500);
      }

      const stats = {
        total: history?.length || 0,
        average: 0,
        min: 10,
        max: 1,
        trend: 'stable',
        recentAverage: 0,
        previousAverage: 0,
      };

      if (history && history.length > 0) {
        const scores = history.map(h => h.score);
        stats.average = scores.reduce((a, b) => a + b, 0) / scores.length;
        stats.min = Math.min(...scores);
        stats.max = Math.max(...scores);

        if (history.length >= 10) {
          const recent = history.slice(0, 5);
          const previous = history.slice(5, 10);
          stats.recentAverage = recent.reduce((a, b) => a + b.score, 0) / recent.length;
          stats.previousAverage = previous.reduce((a, b) => a + b.score, 0) / previous.length;
          
          const diff = stats.recentAverage - stats.previousAverage;
          if (diff > 0.5) {
            stats.trend = 'improving';
          } else if (diff < -0.5) {
            stats.trend = 'declining';
          }
        } else if (history.length >= 5) {
          const recent = history.slice(0, 3);
          const previous = history.slice(3, 5);
          stats.recentAverage = recent.reduce((a, b) => a + b.score, 0) / recent.length;
          stats.previousAverage = previous.reduce((a, b) => a + b.score, 0) / previous.length;
          
          const diff = stats.recentAverage - stats.previousAverage;
          if (diff > 0.5) {
            stats.trend = 'improving';
          } else if (diff < -0.5) {
            stats.trend = 'declining';
          }
        }
      }

      return sendSuccessResponse({
        history: history || [],
        stats,
      });
    }

  } catch (error) {
    logError('Error in sentiment-analysis function:', error);
    return sendErrorResponse(error, 500);
  }
}

