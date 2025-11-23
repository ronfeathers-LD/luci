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
    // Default model name (used if discovery fails)
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
    log(`Starting with default model: ${modelName} with API key prefix: ${apiKey ? apiKey.substring(0, 10) + '...' : 'missing'}`);
    
    // Use a longer timeout for Gemini API calls (60 seconds)
    // This accounts for model discovery time + API response time
    const GEMINI_API_TIMEOUT = 60000; // 60 seconds
    
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
   - **CRITICAL: Contact Level Involvement in Cases**:
     ${salesforceContext.contact_levels ? `
     * C-Level contacts involved in cases: ${salesforceContext.contact_levels.c_level_in_cases || 0} (${salesforceContext.contact_levels.c_level_count || 0} total C-Level contacts)
       - ⚠️ This is a MAJOR RED FLAG - C-Level executives submitting support cases indicates serious issues
       - C-Level involvement suggests problems have escalated to the highest levels
     * Sr. Level contacts involved in cases: ${salesforceContext.contact_levels.sr_level_in_cases || 0} (${salesforceContext.contact_levels.sr_level_count || 0} total Sr. Level contacts)
       - ⚠️ This is a SIGNIFICANT CONCERN - Senior leadership involvement indicates problems are not being resolved
       - Sr. Level (VP, Director, etc.) involvement suggests frustration and escalation
     * Other contacts involved in cases: ${salesforceContext.contact_levels.other_in_cases || 0} (${salesforceContext.contact_levels.other_count || 0} total other contacts)
     ` : 'Contact level data not available'}
     - **Weight case involvement by contact level heavily** - C-Level or Sr. Level on cases is a strong negative signal

3. **Account Profile**:
   - Account tier: ${salesforceContext.account_tier || 'Unknown'}
   - Contract value: ${salesforceContext.contract_value || 'Unknown'}
   - Industry: ${salesforceContext.industry || 'Unknown'}
   - Account manager: ${salesforceContext.account_manager || 'Unknown'}

4. **Engagement Metrics**:
   - Total Avoma calls: ${salesforceContext.total_avoma_calls || 0}
   - Ready transcripts: ${salesforceContext.ready_avoma_calls || 0}

5. **Contact Intelligence & Professional Context**${salesforceContext.linkedin_data ? `:
   - Total contacts: ${salesforceContext.linkedin_data.total_contacts || 0}
   - Contact breakdown by level:
     * C-Level: ${salesforceContext.linkedin_data.contact_level_counts?.['C-Level'] || 0} contacts
     * Sr. Level: ${salesforceContext.linkedin_data.contact_level_counts?.['Sr. Level'] || 0} contacts
     * Other: ${salesforceContext.linkedin_data.contact_level_counts?.['Other'] || 0} contacts
   - Contacts involved in support cases by level:
     * C-Level: ${salesforceContext.linkedin_data.case_involved_by_level?.['C-Level'] || 0} (${salesforceContext.linkedin_data.case_involved_by_level?.['C-Level'] > 0 ? '⚠️ MAJOR CONCERN' : 'Good'})
     * Sr. Level: ${salesforceContext.linkedin_data.case_involved_by_level?.['Sr. Level'] || 0} (${salesforceContext.linkedin_data.case_involved_by_level?.['Sr. Level'] > 0 ? '⚠️ SIGNIFICANT CONCERN' : 'Good'})
     * Other: ${salesforceContext.linkedin_data.case_involved_by_level?.['Other'] || 0}
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

Provide TWO analyses:

1. **Executive Summary** (150 words max): A concise, high-level overview suitable for C-level executives. Focus on:
   - Overall sentiment score and key takeaway
   - Top 2-3 critical factors
   - Immediate action required (if any)
   - Relationship health status

2. **Comprehensive Analysis** (500-800 words): A detailed, in-depth analysis for CSMs and Account Managers. Include:
   - Detailed breakdown of all factors influencing the score
   - Specific concerns or positive signals with examples
   - Relationship trajectory analysis (improving, declining, stable) with evidence
   - Contact level involvement analysis (C-Level/Sr. Level in cases is a major red flag)
   - Support case patterns and implications
   - Engagement metrics and their meaning
   - Risk factors and opportunities
   - Detailed actionable recommendations
   - Account-specific context and nuances
   - Comparison to account tier expectations`
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
              description: "Executive summary (150 words max) - concise, high-level overview for C-level executives. Focus on overall sentiment, top 2-3 critical factors, immediate actions, and relationship health status."
            },
            comprehensiveAnalysis: {
              type: "string",
              description: "Comprehensive analysis (500-800 words) - detailed, in-depth analysis for CSMs and Account Managers. Include detailed factor breakdown, specific concerns/positive signals with examples, relationship trajectory with evidence, contact level involvement analysis, support case patterns, engagement metrics, risk factors, opportunities, detailed recommendations, account-specific context, and comparison to account tier expectations."
            }
          },
          required: ["score", "summary", "comprehensiveAnalysis"]
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
            // Get error details from response body for better diagnostics
            let errorDetails = '';
            try {
              const errorData = await response.clone().json();
              errorDetails = errorData.error ? JSON.stringify(errorData.error) : '';
            } catch (e) {
              // If we can't parse JSON, get text
              try {
                errorDetails = await response.clone().text();
              } catch (e2) {
                // Ignore if we can't get error details
              }
            }
            
            const errorMessage = errorDetails 
              ? `API error: ${response.status} ${response.statusText} - ${errorDetails}`
              : `API error: ${response.status} ${response.statusText}`;
            
            // Log specific errors for 403 (Forbidden) and 404 (Not Found)
            if (response.status === 403) {
              logError('Gemini API 403 Forbidden - Possible causes:', {
                status: response.status,
                statusText: response.statusText,
                errorDetails: errorDetails,
                model: modelName,
                apiKeyPresent: !!apiKey,
                apiKeyLength: apiKey ? apiKey.length : 0,
                apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'missing',
              });
            } else if (response.status === 404) {
              logError('Gemini API 404 Not Found - Model not available:', {
                status: response.status,
                statusText: response.statusText,
                errorDetails: errorDetails,
                model: modelName,
                suggestion: 'Try using gemini-pro, gemini-1.5-pro-latest, or gemini-flash-latest',
              });
            }
            
            throw new Error(errorMessage);
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

    // Dynamically discover available models by querying ListModels API
    // This is more reliable than hardcoding model names
    async function discoverAvailableModels(apiVersion) {
      try {
        const listUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models?key=${apiKey}`;
        log(`Querying ListModels API for ${apiVersion} to discover available models...`);
        
        const response = await fetch(listUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          log(`ListModels API returned ${response.status} ${response.statusText} for ${apiVersion}`);
          return [];
        }
        
        const data = await response.json();
        const models = data.models || [];
        log(`ListModels API returned ${models.length} total models for ${apiVersion}`);
        
        // Filter for models that support generateContent method
        const supportedModels = models
          .filter(model => {
            const methods = model.supportedGenerationMethods || [];
            return methods.includes('generateContent');
          })
          .map(model => ({
            name: model.name.replace('models/', ''),
            displayName: model.displayName,
            version: apiVersion
          }));
        
        log(`Found ${supportedModels.length} models supporting generateContent in ${apiVersion}: ${supportedModels.map(m => m.name).join(', ')}`);
        return supportedModels;
      } catch (error) {
        logError(`Error discovering models for ${apiVersion}:`, error);
        return [];
      }
    }
    
    // Discover available models - try v1 first (more stable), then v1beta
    // Note: v1beta may have restricted access even if v1 works
    let discoveredModels = [];
    for (const version of ['v1', 'v1beta']) {
      const models = await discoverAvailableModels(version);
      if (models.length > 0) {
        log(`Discovered ${models.length} available models in ${version} API`);
        discoveredModels = models;
        break;
      }
    }
    
    // If no models discovered, use fallback list
    let modelsToTry = [];
    if (discoveredModels.length > 0) {
      // Sort models: prefer pro over flash, prefer shorter names (more stable)
      const sortedModels = discoveredModels.sort((a, b) => {
        const aIsPro = a.name.includes('pro');
        const bIsPro = b.name.includes('pro');
        if (aIsPro !== bIsPro) return bIsPro ? 1 : -1;
        return a.name.length - b.name.length;
      }).slice(0, 5); // Use top 5 models
      
      // Convert to format expected by loop: { model, version }
      modelsToTry = sortedModels.map(m => ({ model: m.name, version: m.version }));
      log(`Will try models in order: ${modelsToTry.map(m => `${m.model} (${m.version})`).join(', ')}`);
    } else {
      log('Could not discover models via API, using fallback list');
      modelsToTry = [
        { model: modelName, version: 'v1beta' },
        { model: 'gemini-1.5-flash', version: 'v1beta' },
        { model: 'gemini-pro', version: 'v1' },
      ];
    }
    
    let response = null;
    let lastError = null;
    let lastAttemptedModel = null;
    
    for (const { model: tryModel, version: apiVersion } of modelsToTry) {
      lastAttemptedModel = `${tryModel} (${apiVersion})`;
      try {
        const tryUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${tryModel}:generateContent?key=${apiKey}`;
        log(`Attempting Gemini model: ${tryModel} with API version: ${apiVersion}`);
        
        // Create API-version-specific request body
        // v1 API doesn't support systemInstruction or responseMimeType/responseSchema
        let apiRequestBody = requestBody;
        if (apiVersion === 'v1') {
          // For v1 API, include system instruction in the prompt and remove v1beta-only fields
          const systemInstructionText = requestBody.systemInstruction.parts[0].text;
          apiRequestBody = {
            contents: [{
              parts: [{
                text: `${systemInstructionText}\n\n${requestBody.contents[0].parts[0].text}\n\nIMPORTANT: You must respond with RAW JSON only (no markdown, no code blocks, no backticks). Start your response with { and end with }. Format your response EXACTLY as: {"score": <number 1-10>, "summary": "<text>", "comprehensiveAnalysis": "<text>"}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topP: 0.8,
              topK: 40
            }
          };
        }
        
        // Create a timeout-aware fetch function that times out per attempt
        const fetchWithTimeout = async () => {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Request timeout for model ${tryModel}`)), GEMINI_API_TIMEOUT);
          });
          
          const fetchPromise = fetch(tryUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiRequestBody)
          });
          
          return Promise.race([fetchPromise, timeoutPromise]);
        };
        
        // Use retryFetch with timeout-aware fetch function
        response = await retryFetch(fetchWithTimeout);
        
        // If we got a response and it's not 404, break out of the loop
        if (response && response.status !== 404) {
          log(`Successfully using Gemini model: ${tryModel} (${apiVersion})`);
          lastAttemptedModel = `${tryModel} (${apiVersion})`; // Track successful model
          break;
        }
        
        // If 404 or 400 (invalid request), try next model
        if (response && (response.status === 404 || response.status === 400)) {
          if (response.status === 404) {
            log(`Model ${tryModel} (${apiVersion}) not found (404), trying next model...`);
          } else {
            log(`Model ${tryModel} (${apiVersion}) returned 400 (invalid request), trying next model...`);
          }
          continue;
        }
      } catch (error) {
        lastError = error;
        // If it's a 404 or 400, try next model
        if (error.message && (error.message.includes('404') || error.message.includes('400'))) {
          const errorType = error.message.includes('404') ? '404' : '400';
          log(`Model ${tryModel} (${apiVersion}) failed with ${errorType}, trying next model...`);
          continue;
        }
        // For other errors, break and throw
        throw error;
      }
    }
    
    // If we still don't have a response, throw the last error with helpful message
    if (!response) {
      const errorMessage = lastError?.message || 'All Gemini models failed.';
      throw new Error(`${errorMessage}

Unable to find a working Gemini model. Please check:
1. Your GEMINI_API_KEY is valid and has access to Gemini models
2. The API key has the necessary permissions
3. Your Google Cloud project has the Generative Language API enabled
4. Try setting GEMINI_MODEL environment variable to a specific model name

To see available models, call: https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY

Last attempted models: ${modelsToTry.map(m => `${m.model} (${m.version})`).join(', ')}`);
    }

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorData = await response.json();
        errorDetails = errorData.error ? JSON.stringify(errorData.error) : JSON.stringify(errorData);
      } catch (e) {
        try {
          errorDetails = await response.text();
        } catch (e2) {
          errorDetails = `Status: ${response.status} ${response.statusText}`;
        }
      }
      
      logError('Gemini API request failed:', {
        status: response.status,
        statusText: response.statusText,
        errorDetails: errorDetails,
        model: lastAttemptedModel || modelName,
      });
      
      if (response.status === 403) {
        return sendErrorResponse(res, new Error(`Gemini API access forbidden (403). Please check:
1. Your GEMINI_API_KEY is valid and has access to Gemini models
2. The API key has the necessary permissions
3. Your Google Cloud project has the Generative Language API enabled
4. The API key is not restricted to specific APIs

Error details: ${errorDetails}`), 403, isProduction());
      } else if (response.status === 404) {
        return sendErrorResponse(res, new Error(`Gemini API model not found (404). The model '${modelName}' is not available.
        
Please try one of these models by setting GEMINI_MODEL environment variable:
- gemini-pro (most stable, recommended)
- gemini-1.5-pro-latest
- gemini-flash-latest

To see available models, visit: https://ai.google.dev/api/rest?version=v1beta#rest/rest/v1beta/models/list

Error details: ${errorDetails}`), 404, isProduction());
      }
      
      return sendErrorResponse(res, new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorDetails}`), response.status, isProduction());
    }

    const data = await response.json();
    
    if (data.error) {
      logError('Gemini API error:', data.error);
      return res.status(500).json({ error: `Gemini API error: ${data.error.message || 'Unknown error'}` });
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return sendErrorResponse(res, new Error('Invalid response format from Gemini API'), 500, isProduction());
    }

    const content = data.candidates[0].content.parts[0].text;
    
    // Clean up the content: strip markdown code blocks if present
    let cleanedContent = content.trim();
    
    // Remove markdown code blocks (```json ... ``` or ``` ... ```)
    cleanedContent = cleanedContent.replace(/^```(?:json)?\s*\n?/i, ''); // Remove opening ```json or ```
    cleanedContent = cleanedContent.replace(/\n?```\s*$/i, ''); // Remove closing ```
    cleanedContent = cleanedContent.trim();
    
    // Try to extract JSON if there's extra text around it
    // Look for JSON object boundaries { ... }
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedContent = jsonMatch[0];
    }
    
    let result;
    try {
      result = JSON.parse(cleanedContent);
    } catch (parseError) {
      logError('Failed to parse Gemini response as JSON:', {
        originalContent: content.substring(0, 500), // Log first 500 chars for debugging
        cleanedContent: cleanedContent.substring(0, 500),
        parseError: parseError.message
      });
      throw new Error(`Failed to parse Gemini response as JSON: ${parseError.message}. Response may not be in expected format.`);
    }
    
    // Validate score is within range
    if (result.score < 1 || result.score > 10) {
      return sendErrorResponse(res, new Error('Invalid sentiment score returned from API'), 500, isProduction());
    }
    
    // Ensure comprehensiveAnalysis exists (for backward compatibility)
    if (!result.comprehensiveAnalysis) {
      // If not provided, use summary as fallback
      result.comprehensiveAnalysis = result.summary || 'Comprehensive analysis not available.';
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
              comprehensive_analysis: result.comprehensiveAnalysis || null,
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
    
    // Handle timeout specifically (check for timeout in error message)
    if (error.message && error.message.includes('Request timeout')) {
      return sendErrorResponse(res, new Error('Request timeout - The Gemini API request took too long. Please try again.'), 504, isProduction());
    }
    
    return sendErrorResponse(res, error, 500, isProduction());
  }
}

