/**
 * Vercel Serverless Function for Fetching All Sentiment Analyses
 * 
 * Returns all cached sentiment analyses across all accounts
 */

const { getSupabaseClient } = require('../../lib/supabase-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } = require('../../lib/api-helpers');

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

    const { limit = '100', offset = '0', days = '365', accountId, cached } = req.query;

    // Calculate date filter
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // Build query
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

    // Log query details for debugging
    log('Fetching all analyses:', {
      days,
      daysAgo: daysAgo.toISOString(),
      accountId,
      cached,
      limit,
      offset,
    });

    // Execute the query and log results
    const { data: analyses, error } = await query;
    
    if (error) {
      logError('Error fetching all analyses:', error);
      return sendErrorResponse(res, new Error(`Failed to fetch analyses: ${error.message}`), 500, isProduction());
    }
    
    log('Query executed successfully:', {
      analysesFound: analyses?.length || 0,
      sampleAnalysis: analyses && analyses.length > 0 ? {
        id: analyses[0].id,
        account_id: analyses[0].account_id,
        salesforce_account_id: analyses[0].salesforce_account_id,
        customer_identifier: analyses[0].customer_identifier,
        analyzed_at: analyses[0].analyzed_at,
        has_input_hash: !!analyses[0].input_hash,
      } : null,
    });

    // Get total count for pagination
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

    const { count, error: countError } = await countQuery;

    if (countError) {
      logError('Error counting analyses:', countError);
    }
    
    log('Query results:', {
      count,
      analysesReturned: analyses?.length || 0,
    });

    // Calculate statistics
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

  } catch (error) {
    logError('Error in all-analyses function:', error);
    return sendErrorResponse(res, error, 500, isProduction());
  }
}

