/**
 * Vercel Serverless Function for Sentiment Analysis
 * 
 * This function securely handles the Gemini API call server-side,
 * protecting the API key from client-side exposure.
 * Also saves sentiment results to database for historical tracking.
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { handlePreflight, validateRequestSize, sendErrorResponse, sendSuccessResponse, validateSupabase, getClientIP, checkRateLimit, log, logError, isProduction } = require('../lib/api-helpers');
const { MAX_REQUEST_SIZE, REQUEST_TIMEOUT, RATE_LIMIT } = require('../lib/constants');

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return sendErrorResponse(res, new Error('Method not allowed'), 405);
  }

  // Rate limiting
  const clientIp = getClientIP(req);
  
  if (!checkRateLimit(clientIp, RATE_LIMIT.WINDOW, RATE_LIMIT.MAX_REQUESTS)) {
    return sendErrorResponse(res, new Error('Too many requests. Please try again in a minute.'), 429);
  }

  // Validate request size
  const sizeValidation = validateRequestSize(req, MAX_REQUEST_SIZE.LARGE);
  if (!sizeValidation.valid) {
    return sendErrorResponse(res, new Error(sizeValidation.error.message), sizeValidation.error.status);
  }

  // Get API key from environment variable
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    logError('GEMINI_API_KEY environment variable is not set');
    return sendErrorResponse(res, new Error('Server configuration error'), 500, isProduction());
  }

  const { transcription, salesforceContext, userId, accountId, salesforceAccountId, customerIdentifier } = req.body;

  // Validate input
  // transcription can be empty string (analysis can proceed with Salesforce data only)
  // but salesforceContext is required
  if (transcription === undefined || transcription === null || !salesforceContext) {
    return sendErrorResponse(res, new Error('Missing required parameters: transcription and salesforceContext'), 400);
  }
  
  // Validate input types and sizes
  // Allow empty string for transcription (no Avoma data available)
  if (typeof transcription !== 'string' || transcription.length > 50000) {
    return sendErrorResponse(res, new Error('Invalid transcription: must be a string under 50,000 characters'), 400);
  }
  
  if (typeof salesforceContext !== 'object' || salesforceContext === null) {
    return sendErrorResponse(res, new Error('Invalid salesforceContext: must be an object'), 400);
  }
  
  try {
    // Create a promise with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT);
    });
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: `Analyze the customer sentiment from the following conversation transcription and Salesforce account context.

=== CONVERSATION TRANSCRIPTION ===
${transcription || '(No transcription available)'}

=== SALESFORCE ACCOUNT CONTEXT ===
${JSON.stringify(salesforceContext, null, 2)}

=== ANALYSIS INSTRUCTIONS ===
Provide a comprehensive sentiment analysis considering:

1. **Conversation Sentiment**:
   - Initial customer tone and emotional state
   - Language patterns (positive/negative indicators, urgency, frustration)
   - Resolution quality and how concerns were addressed
   - Final outcome and customer satisfaction level

2. **Support Case Context**:
   - Number of recent support cases (${salesforceContext.total_cases_count || 0} total)
   - Case priorities and statuses (high priority or unresolved cases indicate issues)
   - Case descriptions (customer feedback and issue details)
   - Case types and reasons (patterns in support needs)
   - Resolution timelines (closed dates vs created dates)

3. **Account Profile**:
   - Account tier: ${salesforceContext.account_tier || 'Unknown'}
   - Contract value: ${salesforceContext.contract_value || 'Unknown'}
   - Industry: ${salesforceContext.industry || 'Unknown'}
   - Account manager: ${salesforceContext.account_manager || 'Unknown'}

4. **Engagement Metrics**:
   - Total Avoma calls: ${salesforceContext.total_avoma_calls || 0}
   - Ready transcripts: ${salesforceContext.ready_avoma_calls || 0}

5. **Contact Intelligence & Professional Context**${salesforceContext.linkedin_data ? `:
   - Total contacts: ${salesforceContext.linkedin_data.total_contacts_with_linkedin || 0}
   - Enriched profile data available: ${salesforceContext.linkedin_data.contacts_with_enriched_data || 0}
   - Key contact insights:
${salesforceContext.linkedin_data.contacts.map(c => {
  const insights = [];
  insights.push(`     * ${c.name}: ${c.current_title || 'Title unknown'} at ${c.current_company || 'Company unknown'}`);
  if (c.department) insights.push(`       - Department: ${c.department}`);
  if (c.reports_to_name) insights.push(`       - Reports to: ${c.reports_to_name} (hierarchy context)`);
  if (c.owner_name) insights.push(`       - Relationship owner: ${c.owner_name}`);
  if (c.last_activity_date) {
    const daysSinceActivity = Math.floor((new Date() - new Date(c.last_activity_date)) / (24 * 60 * 60 * 1000));
    insights.push(`       - Last activity: ${daysSinceActivity} days ago ${daysSinceActivity > 90 ? '(STALE - potential risk)' : ''}`);
  }
  if (c.job_changed_recently) insights.push(`       - ⚠️ RECENT JOB CHANGE (${c.days_in_current_role || 'unknown'} days in role - potential account risk)`);
  if (c.job_change_likelihood && c.job_change_likelihood > 50) insights.push(`       - ⚠️ High job change likelihood: ${c.job_change_likelihood}%`);
  if (c.company_industry) insights.push(`       - Company industry: ${c.company_industry}`);
  if (c.company_size) insights.push(`       - Company size: ${c.company_size} employees`);
  if (c.company_technologies && c.company_technologies.length > 0) insights.push(`       - Technologies: ${c.company_technologies.slice(0, 5).join(', ')}`);
  if (c.previous_companies && c.previous_companies.length > 0) insights.push(`       - Previous companies: ${c.previous_companies.slice(0, 3).join(', ')}`);
  if (c.email_status === 'verified') insights.push(`       - ✅ Verified email`);
  if (c.email_status === 'invalid') insights.push(`       - ❌ Invalid email`);
  return insights.join('\n');
}).join('\n')}
   - Engagement signals: ${salesforceContext.linkedin_data.contacts.reduce((sum, c) => sum + (c.engagement_with_company?.posts_about_company || 0) + (c.engagement_with_company?.comments_on_company_posts || 0) + (c.engagement_with_company?.shares_of_company_content || 0), 0)} total interactions with company content
   - Risk indicators: ${salesforceContext.linkedin_data.contacts.filter(c => c.job_changed_recently || (c.job_change_likelihood && c.job_change_likelihood > 50)).length} contacts with job change signals
   - Stale relationships: ${salesforceContext.linkedin_data.contacts.filter(c => {
     if (!c.last_activity_date) return false;
     const daysSinceActivity = Math.floor((new Date() - new Date(c.last_activity_date)) / (24 * 60 * 60 * 1000));
     return daysSinceActivity > 90;
   }).length} contacts with no activity in 90+ days` : ' (No contact enrichment data available)'}

6. **Overall Assessment**:
   - Customer relationship health (at-risk, stable, or thriving)
   - Key risk factors or positive indicators
   - Recommended actions or areas of concern

Provide a sentiment score (1-10) and a detailed summary that explains:
- What factors most influenced the score
- Specific concerns or positive signals identified
- Relationship trajectory (improving, declining, stable)
- Actionable insights for account management`
        }]
      }],
      systemInstruction: {
        parts: [{
          text: `You are an expert Customer Sentiment Analyst specializing in B2B customer relationship analysis. Your role is to provide comprehensive sentiment analysis by evaluating:

1. **Conversation Analysis**: Tone, language patterns, emotional indicators, frustration levels, satisfaction signals
2. **Support Context**: Recent support cases, their status, priority, and descriptions - these reveal underlying issues
3. **Account Health**: Account tier, contract value, industry context - higher value accounts may have different expectations
4. **Resolution Quality**: How effectively concerns were addressed, response time indicators, solution completeness
5. **Relationship Trajectory**: Whether sentiment is improving, declining, or stable over time

Consider the full customer journey from initial contact through resolution. Weight recent interactions more heavily but consider historical context. Account for account value and industry norms when assessing expectations.

Provide scores from 1 (very negative - at risk of churn) to 10 (very positive - strong advocate) with detailed, actionable summaries that explain the reasoning and highlight key factors influencing the sentiment.`
        }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            score: {
              type: "integer",
              description: "Sentiment score from 1 to 10, where 1 is very negative and 10 is very positive."
            },
            summary: {
              type: "string",
              description: "A comprehensive summary of the sentiment analysis, including key factors influencing the score, specific concerns or positive signals, relationship trajectory, and actionable insights. Maximum 150 words to allow for detailed analysis."
            }
          },
          required: ["score", "summary"]
        },
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    };

    // Retry logic with exponential backoff
    const retryFetch = async (fetchFn, maxRetries = 3, baseDelay = 1000) => {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const response = await fetchFn();
          
          if (response.status === 429) {
            const delay = baseDelay * Math.pow(2, attempt);
            if (attempt < maxRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            }
          }
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
          }
          
          return response;
        } catch (error) {
          if (attempt === maxRetries - 1) {
            throw error;
          }
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    };

    // Race between the fetch and timeout
    const fetchPromise = retryFetch(async () => {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
    });
    
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    const data = await response.json();
    
    if (data.error) {
      logError('Gemini API error:', data.error);
      return res.status(500).json({ error: `Gemini API error: ${data.error.message || 'Unknown error'}` });
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return sendErrorResponse(res, new Error('Invalid response format from Gemini API'), 500, isProduction());
    }

    const content = data.candidates[0].content.parts[0].text;
    const result = JSON.parse(content);
    
    // Validate score is within range
    if (result.score < 1 || result.score > 10) {
      return sendErrorResponse(res, new Error('Invalid sentiment score returned from API'), 500, isProduction());
    }

    // Save sentiment result to database for historical tracking (non-blocking)
    if (accountId || salesforceAccountId) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          // Resolve account_id if we only have salesforceAccountId
          let resolvedAccountId = accountId;
          if (!resolvedAccountId && salesforceAccountId) {
            const { data: account } = await supabase
              .from('accounts')
              .select('id')
              .eq('salesforce_id', salesforceAccountId)
              .single();
            resolvedAccountId = account?.id || null;
          }

          if (resolvedAccountId) {
            await supabase.from('sentiment_history').insert({
              account_id: resolvedAccountId,
              salesforce_account_id: salesforceAccountId || null,
              user_id: userId || null,
              score: result.score,
              summary: result.summary,
              has_transcription: !!transcription && transcription.length > 0,
              transcription_length: transcription?.length || 0,
              cases_count: salesforceContext.total_cases_count || 0,
              avoma_calls_total: salesforceContext.total_avoma_calls || 0,
              avoma_calls_ready: salesforceContext.ready_avoma_calls || 0,
              customer_identifier: customerIdentifier || null,
              analyzed_at: new Date().toISOString(),
            });

            log('Sentiment result saved to history');
          }
        }
      } catch (dbError) {
        // Don't fail the request if database save fails - just log it
        logError('Error saving sentiment to history:', dbError);
      }
    }

    return sendSuccessResponse(res, result);
  } catch (error) {
    logError('Error in analyze-sentiment function:', error);
    
    // Handle timeout specifically
    if (error.message === 'Request timeout') {
      return sendErrorResponse(res, new Error('Request timeout'), 504, isProduction());
    }
    
    return sendErrorResponse(res, error, 500, isProduction());
  }
}

