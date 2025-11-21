/**
 * Vercel Serverless Function for Fetching Historical Sentiment Data
 * 
 * Returns sentiment history for a given account, with optional filtering
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

    const { accountId, salesforceAccountId, limit = '50', days = '365' } = req.query;

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

    // Calculate date filter
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // Query sentiment history
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
      logError('Error details:', error.message);
      logError('Error code:', error.code);
      logError('Error details:', error.details);
      logError('Error hint:', error.hint);
      return sendErrorResponse(res, new Error(`Failed to fetch sentiment history: ${error.message}`), 500, isProduction());
    }

    // Calculate statistics
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

  } catch (error) {
    logError('Error in sentiment-history function:', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
}

