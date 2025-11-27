/**
 * Vercel Serverless Function for Sentiment Analysis Data
 * 
 * Returns sentiment history for a given account, with optional filtering
 * OR returns a single sentiment analysis by ID
 * Supports both single account view and admin "all analyses" view
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } = require('../lib/api-helpers');

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return sendErrorResponse(res, new Error('Method not allowed'), 405);
  }

  try {
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    // Check if this is a request for a single analysis by ID
    const { id, accountId, salesforceAccountId, limit = '50', offset = '0', days = '365', all, cached } = req.query;
    
    // SINGLE ANALYSIS BY ID
    if (id) {
      // Fetch the sentiment analysis with account and user info
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
          return sendErrorResponse(res, new Error('Sentiment analysis not found'), 404);
        }
        logError('Error fetching sentiment analysis:', error);
        return sendErrorResponse(res, new Error(`Failed to fetch sentiment analysis: ${error.message}`), 500, isProduction());
      }

      if (!analysis) {
        return sendErrorResponse(res, new Error('Sentiment analysis not found'), 404);
      }

      return sendSuccessResponse(res, {
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
      // Build query with joins to get account and user info
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

      // Filter by account if provided
      if (accountId) {
        query = query.eq('account_id', accountId);
      }

      // Filter for cached analyses (those with input_hash that might be duplicates)
      if (cached === 'true') {
        query = query.not('input_hash', 'is', null);
      }

      // Apply limit and offset
      query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      // Build count query in parallel (same filters as main query)
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

      // Execute both queries in parallel for better performance
      const [queryResult, countResult] = await Promise.all([
        query,
        countQuery
      ]);

      const { data: analyses, error } = queryResult;
      
      if (error) {
        logError('Error fetching all analyses', error);
        return sendErrorResponse(res, new Error(`Failed to fetch analyses: ${error.message}`), 500, isProduction());
      }
      
      if (analyses && analyses.length > 0) {
        log(`Fetched ${analyses.length} analyses`);
      }

      const { count, error: countError } = countResult;

      if (countError) {
        logError('Error counting analyses', countError);
      }

      // Calculate statistics for admin view
      const stats = {
        total: count || analyses?.length || 0,
        cached: 0,
        unique: 0,
        averageScore: 0,
        byScore: {
          high: 0, // 8-10
          medium: 0, // 5-7
          low: 0, // 1-4
        },
      };

      if (analyses && analyses.length > 0) {
        // Count cached analyses
        stats.cached = analyses.filter(a => a.input_hash).length;
        
        // Count unique input hashes (deduplicated analyses)
        const uniqueHashes = new Set(analyses.filter(a => a.input_hash).map(a => a.input_hash));
        stats.unique = uniqueHashes.size;

        // Calculate average score
        const scores = analyses.map(a => a.score);
        stats.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        // Count by score range
        scores.forEach(score => {
          if (score >= 8) stats.byScore.high++;
          else if (score >= 5) stats.byScore.medium++;
          else stats.byScore.low++;
        });
      }

      return sendSuccessResponse(res, {
        analyses: analyses || [],
        stats,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: count || analyses?.length || 0,
        },
      });

    } else {
      // SINGLE ACCOUNT VIEW: History for a specific account
      if (!accountId && !salesforceAccountId) {
        return sendErrorResponse(res, new Error('Missing required parameter: accountId or salesforceAccountId'), 400);
      }

      // Resolve account_id - check if accountId is a UUID or a Salesforce ID
      let resolvedAccountId = accountId;
      
      // If accountId doesn't look like a UUID (has dashes and is 36 chars), or if we only have salesforceAccountId
      const isUUID = accountId && accountId.includes('-') && accountId.length === 36;
      
      if (!isUUID) {
        // accountId is either missing or is a Salesforce ID, so resolve it
        const lookupId = accountId || salesforceAccountId;
        if (lookupId) {
          const { data: account, error: accountError } = await supabase
            .from('accounts')
            .select('id')
            .eq('salesforce_id', lookupId)
            .single();
          
          if (accountError || !account) {
            logError('Account lookup error:', accountError);
            return sendErrorResponse(res, new Error('Account not found'), 404);
          }
          
          resolvedAccountId = account.id;
        }
      }
      
      if (!resolvedAccountId) {
        return sendErrorResponse(res, new Error('Could not resolve account ID'), 400);
      }

      // Query sentiment history for this account
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
        return sendErrorResponse(res, new Error(`Failed to fetch sentiment history: ${error.message}`), 500, isProduction());
      }

      // Calculate statistics for single account view
      const stats = {
        total: history?.length || 0,
        average: 0,
        min: 10,
        max: 1,
        trend: 'stable', // 'improving', 'declining', 'stable'
        recentAverage: 0,
        previousAverage: 0,
      };

      if (history && history.length > 0) {
        const scores = history.map(h => h.score);
        stats.average = scores.reduce((a, b) => a + b, 0) / scores.length;
        stats.min = Math.min(...scores);
        stats.max = Math.max(...scores);

        // Calculate trend: compare recent 5 vs previous 5
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
          } else {
            stats.trend = 'stable';
          }
        } else if (history.length >= 5) {
          // If we have at least 5, compare recent 3 vs previous 2
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

      return sendSuccessResponse(res, {
        history: history || [],
        stats,
      });
    }

  } catch (error) {
    logError('Error in sentiment-analysis function:', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
};

