/**
 * Vercel Serverless Function for Fetching Historical Sentiment Data
 * 
 * Returns sentiment history for a given account, with optional filtering
 */

const { getSupabaseClient } = require('../lib/supabase-client');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({
        error: 'Database not configured',
        message: 'The application database is not properly configured. Please contact your administrator.',
      });
    }

    const { accountId, salesforceAccountId, limit = '50', days = '365' } = req.query;

    if (!accountId && !salesforceAccountId) {
      return res.status(400).json({ error: 'Missing required parameter: accountId or salesforceAccountId' });
    }

    // Resolve account_id if we only have salesforceAccountId
    let resolvedAccountId = accountId;
    if (!resolvedAccountId && salesforceAccountId) {
      const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('id')
        .eq('salesforce_id', salesforceAccountId)
        .single();
      
      if (accountError || !account) {
        return res.status(404).json({ error: 'Account not found' });
      }
      
      resolvedAccountId = account.id;
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
      console.error('Error fetching sentiment history:', error);
      return res.status(500).json({ error: 'Failed to fetch sentiment history' });
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

    return res.status(200).json({
      history: history || [],
      stats,
    });

  } catch (error) {
    console.error('Error in sentiment-history function:', error);
    
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'An error occurred while fetching sentiment history'
      : error.message || 'An error occurred while fetching sentiment history';
    
    return res.status(500).json({ error: errorMessage });
  }
}

