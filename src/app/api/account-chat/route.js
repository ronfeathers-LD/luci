/**
 * Next.js App Router API Route for Account Chat (RAG Chatbot)
 * 
 * Handles:
 * - POST /api/account-chat - Chat with account-specific context using RAG
 */

import { NextRequest } from 'next/server';
import { getSupabaseClient, validateSupabase } from '../../../lib/supabase-server';
import { sendErrorResponse, sendSuccessResponse, handlePreflight, validateRequestSize, getClientIP, checkRateLimit, logError, log } from '../../../lib/next-api-helpers';
import { verifyAccountAccess, generateEmbedding } from '../../../lib/rag-helpers';

const { MAX_REQUEST_SIZE, RATE_LIMIT } = require('../../../../lib/constants');

// Handle OPTIONS preflight
export async function OPTIONS() {
  return handlePreflight(new NextRequest('http://localhost', { method: 'OPTIONS' }));
}

// POST /api/account-chat - Chat with RAG
export async function POST(request) {
  const preflight = await handlePreflight(request);
  if (preflight) return preflight;

  // Rate limiting
  const clientIp = getClientIP(request);
  
  if (!checkRateLimit(clientIp, RATE_LIMIT.WINDOW, RATE_LIMIT.MAX_REQUESTS)) {
    return sendErrorResponse(new Error('Too many requests. Please try again in a minute.'), 429);
  }

  // Validate request size
  const sizeValidation = validateRequestSize(request, MAX_REQUEST_SIZE.LARGE);
  if (!sizeValidation.valid) {
    return sendErrorResponse(new Error(sizeValidation.error.message), sizeValidation.error.status);
  }

  // For chat, we use Gemini. For embeddings, we'll use OpenAI if available
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY; // For query embedding
  
  if (!geminiApiKey) {
    logError('GEMINI_API_KEY environment variable is not set');
    return sendErrorResponse(new Error('Server configuration error: GEMINI_API_KEY required for chat'), 500);
  }

  try {
    const body = await request.json();
    const { accountId, userId, query, messageHistory = [], userRole = 'Account Manager' } = body;

    if (!accountId || !userId || !query) {
      return sendErrorResponse(new Error('Missing required fields: accountId, userId, and query'), 400);
    }
    
    // Get user's role if not provided
    let actualUserRole = userRole;
    if (!actualUserRole || actualUserRole === 'Account Manager') {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (!userError && user) {
        actualUserRole = user.role || 'Account Manager';
      }
    }
    
    // Normalize role names
    const isCSM = actualUserRole?.toLowerCase().includes('csm') || 
                  actualUserRole?.toLowerCase().includes('customer success') ||
                  actualUserRole?.toLowerCase().includes('success manager');
    const roleType = isCSM ? 'CSM' : 'Account Manager';

    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }

    // If accountId looks like a Salesforce ID (no dashes), find the UUID
    let actualAccountId = accountId;
    if (!accountId.includes('-')) {
      // It's a Salesforce ID, need to find the UUID
      const { data: accountBySalesforceId, error: accountError } = await supabase
        .from('accounts')
        .select('id, salesforce_id')
        .eq('salesforce_id', accountId)
        .single();
      
      if (accountError || !accountBySalesforceId) {
        return sendErrorResponse(new Error('Account not found'), 404);
      }
      
      actualAccountId = accountBySalesforceId.id;
    }

    // Verify account access
    const hasAccess = await verifyAccountAccess(supabase, userId, actualAccountId);
    if (!hasAccess) {
      logError('Account access denied', { userId, accountId, actualAccountId });
      // Check if account exists
      const { data: accountCheck } = await supabase
        .from('accounts')
        .select('id')
        .eq('id', actualAccountId)
        .single();
      
      if (!accountCheck) {
        return sendErrorResponse(new Error('Account not found'), 404);
      }
      
      // Check if user_accounts relationship exists
      const { data: relationshipCheck } = await supabase
        .from('user_accounts')
        .select('id')
        .eq('user_id', userId)
        .eq('account_id', actualAccountId)
        .maybeSingle();
      
      if (!relationshipCheck) {
        logError('No user_accounts relationship found', { userId, accountId, actualAccountId });
        return sendErrorResponse(
          new Error('You do not have access to this account. Please add it to your account list first.'), 
          403
        );
      }
      
      return sendErrorResponse(new Error('Access denied to this account'), 403);
    }

    // Get account info
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id, name, salesforce_id')
      .eq('id', actualAccountId)
      .single();

    if (accountError || !account) {
      return sendErrorResponse(new Error('Account not found'), 404);
    }

    // Get counts of all data types for this account (to inform the system prompt)
    const { data: allEmbeddingsCounts, error: countsError } = await supabase
      .from('account_embeddings')
      .select('data_type')
      .eq('account_id', actualAccountId);

    const dataTypeTotals = {
      account: 0,
      contact: 0,
      case: 0,
      transcription: 0,
      sentiment: 0,
    };

    if (!countsError && allEmbeddingsCounts) {
      allEmbeddingsCounts.forEach(emb => {
        if (dataTypeTotals.hasOwnProperty(emb.data_type)) {
          dataTypeTotals[emb.data_type]++;
        }
      });
    }

    // Generate embedding for the query (prefer OpenAI, fall back to Gemini)
    let queryEmbedding;
    try {
      queryEmbedding = await generateEmbedding(query, openaiApiKey, geminiApiKey);
    } catch (embedError) {
      logError('Error generating query embedding:', embedError);
      // Check if it's a rate limit error
      if (embedError.message && embedError.message.includes('rate limit')) {
        return sendErrorResponse(
          new Error('API rate limit exceeded. Please try again in a few minutes.'),
          429
        );
      }
      return sendErrorResponse(new Error(`Failed to process query: ${embedError.message}`), 500);
    }
    
    // Convert to array format for Supabase (not string)
    // Supabase pgvector expects an array of numbers

    // Find similar embeddings using vector similarity search
    // Using cosine distance (1 - cosine similarity)
    let contextChunks = [];
    
    try {
      // Try RPC function first (more efficient)
      // Pass embedding as array directly (Supabase will convert to vector type)
      // Increased match_count and lowered threshold for better coverage
      const { data: similarEmbeddings, error: searchError } = await supabase
        .rpc('match_account_embeddings', {
          query_embedding: queryEmbedding, // Pass as array, not string
          match_account_id: actualAccountId,
          match_threshold: 0.5, // Lowered from 0.7 to 0.5 for better coverage
          match_count: 10, // Increased from 5 to 10 to get more diverse results
        });

      if (!searchError && similarEmbeddings && similarEmbeddings.length > 0) {
        contextChunks = similarEmbeddings.map(emb => ({
          content: emb.content,
          type: emb.data_type,
          metadata: emb.metadata,
        }));
        log(`Found ${contextChunks.length} similar embeddings via RPC`);
        // Log what types of data we found
        const dataTypes = contextChunks.map(c => c.type);
        const typeCounts = dataTypes.reduce((acc, type) => {
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});
        log(`Context data types: ${JSON.stringify(typeCounts)}`);
      } else {
        if (searchError) {
          logError('RPC function error:', searchError);
        }
        // RPC function might not exist yet or error occurred, use fallback
        log('RPC function not available or no results, using fallback query');
        throw new Error('RPC function not available');
      }
    } catch (rpcError) {
      // Fallback: Get diverse embeddings - try to get at least one from each data type
      log('Using fallback: fetching diverse embeddings');
      
      // Get embeddings from each data type to ensure diversity
      const dataTypes = ['case', 'transcription', 'sentiment', 'contact', 'account'];
      const allEmbeddings = [];
      
      for (const dataType of dataTypes) {
        const { data: typeEmbeddings, error: typeError } = await supabase
          .from('account_embeddings')
          .select('content, data_type, metadata, source_id')
          .eq('account_id', actualAccountId)
          .eq('data_type', dataType)
          .limit(3); // Get up to 3 from each type
        
        if (!typeError && typeEmbeddings) {
          allEmbeddings.push(...typeEmbeddings);
        }
      }
      
      // If we still don't have enough, get more from any type
      if (allEmbeddings.length < 10) {
        const { data: moreEmbeddings, error: fetchError } = await supabase
          .from('account_embeddings')
          .select('content, data_type, metadata, source_id')
          .eq('account_id', actualAccountId)
          .limit(10 - allEmbeddings.length);
        
        if (!fetchError && moreEmbeddings) {
          // Add only if not already included
          const existingIds = new Set(allEmbeddings.map(e => e.source_id));
          moreEmbeddings.forEach(emb => {
            if (!existingIds.has(emb.source_id)) {
              allEmbeddings.push(emb);
            }
          });
        }
      }

      if (allEmbeddings && allEmbeddings.length > 0) {
        contextChunks = allEmbeddings.map(emb => ({
          content: emb.content,
          type: emb.data_type,
          metadata: emb.metadata,
        }));
        log(`Found ${contextChunks.length} diverse embeddings via fallback`);
      } else {
        log('No embeddings found for this account');
      }
    }

    // Build context from retrieved chunks
    const context = contextChunks
      .map((chunk, idx) => `[${chunk.type.toUpperCase()} ${idx + 1}]\n${chunk.content}`)
      .join('\n\n---\n\n');

    // Get counts of available data types from embeddings
    const dataTypeCounts = {};
    contextChunks.forEach(chunk => {
      dataTypeCounts[chunk.type] = (dataTypeCounts[chunk.type] || 0) + 1;
    });

    // Analyze sentiment data if available
    const sentimentChunks = contextChunks.filter(c => c.type === 'sentiment');
    const latestSentiment = sentimentChunks.length > 0 ? sentimentChunks[0] : null;
    const sentimentScore = latestSentiment?.metadata?.score || null;
    
    // Analyze cases for issues
    const caseChunks = contextChunks.filter(c => c.type === 'case');
    const openCases = caseChunks.filter(c => 
      c.metadata?.status && 
      !['Closed', 'Resolved', 'Completed'].includes(c.metadata.status)
    );
    const highPriorityCases = caseChunks.filter(c => 
      c.metadata?.priority && 
      ['High', 'Critical', 'Urgent'].includes(c.metadata.priority)
    );
    
    // Fetch chatbot prompt from system settings
    let systemPrompt;
    try {
      const { data: promptSettings, error: promptError } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .eq('category', 'chatbot')
        .in('setting_key', ['PROMPT_BASE', 'PROMPT_TEMPLATE']);

      if (!promptError && promptSettings && promptSettings.length > 0) {
        // Build prompt from settings
        const baseSettings = {};
        let template = null;
        
        promptSettings.forEach(setting => {
          if (setting.setting_key === 'PROMPT_TEMPLATE') {
            template = setting.setting_value;
          } else if (setting.setting_key === 'PROMPT_BASE') {
            Object.assign(baseSettings, setting.setting_value);
          }
        });

        // Use template if available, otherwise build from base settings
        if (template && template.intro) {
          // Build prompt from template
          const roleGuidance = isCSM 
            ? (baseSettings.role_guidance_csm || '')
            : (baseSettings.role_guidance_am || '');
          
          const roleSpecificGuidance = isCSM
            ? (baseSettings.role_specific_csm || '')
            : (baseSettings.role_specific_am || '');
          
          const responseStyle = (baseSettings.response_style || '').replace('{role_specific_guidance}', roleSpecificGuidance);
          
          const dataTypeTotalsText = Object.entries(dataTypeTotals)
            .filter(([_, count]) => count > 0)
            .map(([type, count]) => `- ${type}: ${count} chunk(s)`)
            .join('\n') || '- No embeddings found';
          
          const dataTypeCountsText = Object.keys(dataTypeCounts).length > 0 
            ? Object.entries(dataTypeCounts).map(([type, count]) => `- ${type}: ${count} chunk(s)`).join('\n')
            : '- No chunks in current context';
          
          const healthIndicators = [
            sentimentScore !== null 
              ? `- Latest Sentiment Score: ${sentimentScore}/10 ${sentimentScore < 5 ? '⚠️ (Needs Attention)' : sentimentScore < 7 ? '⚠️ (Monitor)' : '✅ (Good)'}`
              : '- No sentiment data available',
            openCases.length > 0 
              ? `- Open Cases: ${openCases.length} (${highPriorityCases.length} high priority) ⚠️`
              : '- No open cases',
            caseChunks.length > 0 
              ? `- Total Cases: ${caseChunks.length}`
              : ''
          ].filter(Boolean).join('\n');
          
          // Replace template variables
          systemPrompt = template.intro
            .replace('{intro}', baseSettings.intro || `You are LUCI, an AI assistant helping ${roleType} work with the ${account.name} account.`)
            .replace('{role_guidance}', roleGuidance)
            .replace('{context}', context || '(No specific context available - use general knowledge carefully)')
            .replace('{data_type_totals}', dataTypeTotalsText)
            .replace('{data_type_counts}', dataTypeCountsText)
            .replace('{health_indicators}', healthIndicators)
            .replace('{response_style}', responseStyle)
            .replace('{role_type}', roleType)
            .replace('{account_name}', account.name);
        } else {
          // Fallback to hardcoded prompt if template not found
          throw new Error('Template not found');
        }
      } else {
        throw new Error('Prompt settings not found');
      }
    } catch (promptError) {
      // Fallback to hardcoded prompt if settings not available
      log('Using fallback hardcoded prompt - prompt settings not available');
      
      const roleGuidance = isCSM ? `
**Your Role: Customer Success Manager (CSM)**
Your primary focus is ensuring customer satisfaction, retention, and growth. Key responsibilities:
- Monitor account health and customer satisfaction
- Proactively address issues before they escalate
- Drive product adoption and value realization
- Build strong relationships with key stakeholders
- Identify expansion and upsell opportunities
- Ensure contract renewals` : `
**Your Role: Account Manager (Sales)**
Your primary focus is building relationships, driving revenue, and managing the sales cycle. Key responsibilities:
- Build and maintain relationships with decision-makers
- Identify new business opportunities and expansion
- Manage the sales pipeline and forecast
- Understand customer needs and pain points
- Coordinate with internal teams (CSM, support) for customer success
- Close deals and drive revenue growth`;

      systemPrompt = `You are LUCI, an AI assistant helping ${roleType} work with the ${account.name} account.

${roleGuidance}

**Account Context:**
${context || '(No specific context available - use general knowledge carefully)'}

**Available Data:**
Total chunks by type:
${Object.entries(dataTypeTotals)
  .filter(([_, count]) => count > 0)
  .map(([type, count]) => `- ${type}: ${count} chunk(s)`)
  .join('\n') || '- No embeddings found'}

Current context chunks:
${Object.keys(dataTypeCounts).length > 0 
  ? Object.entries(dataTypeCounts).map(([type, count]) => `- ${type}: ${count} chunk(s)`).join('\n')
  : '- No chunks in current context'
}

**Account Health Indicators:**
${sentimentScore !== null ? `- Latest Sentiment Score: ${sentimentScore}/10 ${sentimentScore < 5 ? '⚠️ (Needs Attention)' : sentimentScore < 7 ? '⚠️ (Monitor)' : '✅ (Good)'}` : '- No sentiment data available'}
${openCases.length > 0 ? `- Open Cases: ${openCases.length} (${highPriorityCases.length} high priority) ⚠️` : '- No open cases'}
${caseChunks.length > 0 ? `- Total Cases: ${caseChunks.length}` : ''}

**Your Response Style:**
1. **Be Proactive & Actionable**: Don't just report data - provide specific next steps and recommendations
2. **Daily Activities**: When asked about daily activities or "what should I do", provide a prioritized list of:
   - Immediate actions (urgent issues, high-priority cases)
   - Relationship building (key contacts to reach out to, follow-ups needed)
   - Account health monitoring (sentiment trends, case patterns)
   - Strategic initiatives (expansion opportunities, product adoption)
3. **Sentiment Improvement**: When sentiment is low or asked about improving sentiment:
   - Identify root causes from cases, transcriptions, and sentiment analyses
   - Provide specific, actionable recommendations
   - Suggest outreach strategies to key stakeholders
   - Recommend follow-up actions and timelines
4. **Role-Specific Guidance**:
   ${isCSM ? `- Focus on customer health, satisfaction, and retention
   - Identify at-risk accounts and proactive intervention opportunities
   - Suggest product adoption strategies and value realization activities
   - Recommend expansion opportunities based on usage and engagement` : `- Focus on relationship building and revenue opportunities
   - Identify decision-makers and influencers to engage
   - Suggest strategic touchpoints and sales activities
   - Recommend cross-sell/upsell opportunities based on account data`}
5. **Data Citations**: Always cite sources (e.g., [CASE 3], [TRANSCRIPTION 1], [SENTIMENT 2])
6. **Honesty**: Acknowledge when data is missing or insufficient

**Example Response Patterns:**
- "Based on [CASE 2], I recommend..."
- "Here are your top 3 priorities for today:"
- "To improve sentiment, consider these actions:"
- "Key stakeholders to engage: [CONTACT 5] and [CONTACT 8]"

**IMPORTANT**: Use only data from the context above. If information is missing, say so clearly and suggest how to gather it.`;
    }

    // Build conversation history
    // Gemini API expects alternating user/model messages in contents array
    const contents = [];
    
    // Add system prompt as first user message
    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt }],
    });
    
    // Add conversation history (alternating user/model)
    messageHistory
      .slice(-5) // Last 5 messages for context
      .forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      });

    // Add current query
    contents.push({
      role: 'user',
      parts: [{ text: query }],
    });

    // Discover available Gemini models and try them
    async function discoverAvailableModels(apiVersion) {
      try {
        const listUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models?key=${geminiApiKey}`;
        const response = await fetch(listUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          return [];
        }
        
        const data = await response.json();
        if (!data.models) return [];
        
        // Filter models that support generateContent
        return data.models
          .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
          .map(m => ({ name: m.name.replace(`models/`, ''), version: apiVersion }));
      } catch (error) {
        logError(`Error discovering models for ${apiVersion}:`, error);
        return [];
      }
    }
    
    // Build list of models to try
    let modelsToTry = [];
    const userModel = process.env.GEMINI_MODEL;
    
    // Try to discover available models
    let discoveredModels = [];
    for (const version of ['v1', 'v1beta']) {
      discoveredModels = await discoverAvailableModels(version);
      if (discoveredModels.length > 0) {
        log(`Discovered ${discoveredModels.length} available models in ${version} API`);
        break;
      }
    }
    
    if (discoveredModels.length > 0) {
      // Sort models: prefer flash (faster) over pro, prefer shorter names (more stable)
      const sortedModels = discoveredModels.sort((a, b) => {
        const aIsFlash = a.name.includes('flash');
        const bIsFlash = b.name.includes('flash');
        if (aIsFlash !== bIsFlash) return bIsFlash ? 1 : -1; // Prefer flash (faster)
        const aIsPro = a.name.includes('pro');
        const bIsPro = b.name.includes('pro');
        if (aIsPro !== bIsPro) return bIsPro ? 1 : -1;
        return a.name.length - b.name.length;
      }).slice(0, 5); // Use top 5 models
      
      modelsToTry = sortedModels.map(m => ({ model: m.name, version: m.version }));
      // Add user's preferred model at the front if specified
      if (userModel) {
        modelsToTry.unshift({ model: userModel, version: 'v1beta' });
      }
      log(`Will try models in order: ${modelsToTry.map(m => `${m.model} (${m.version})`).join(', ')}`);
    } else {
      log('Could not discover models via API, using fallback list');
      modelsToTry = [
        { model: userModel || 'gemini-1.5-flash-latest', version: 'v1beta' },
        { model: 'gemini-1.5-flash-latest', version: 'v1beta' },
        { model: 'gemini-1.5-pro-latest', version: 'v1beta' },
        { model: 'gemini-flash-latest', version: 'v1beta' },
        { model: 'gemini-pro', version: 'v1' },
      ].filter(m => m.model); // Remove null/undefined
    }
    
    // Call Gemini API - try multiple models for compatibility
    let reply;
    let lastError = null;
    
    for (const { model: modelName, version: apiVersion } of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${geminiApiKey}`;

        const requestBody = {
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096, // Increased from 1024 to allow longer responses
          },
        };
        
        log(`Calling Gemini API with model ${modelName} (${apiVersion}) and ${contents.length} content items`);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          // If model not found, try next one
          if (response.status === 404) {
            log(`Model ${modelName} (${apiVersion}) not found, trying next model...`);
            lastError = new Error(`Model ${modelName} not available in ${apiVersion}`);
            continue;
          }
          
          logError('Gemini API error:', { status: response.status, statusText: response.statusText, error: errorData, model: modelName, version: apiVersion });
          // Don't return immediately - try next model unless it's a non-404 error that suggests all will fail
          if (response.status === 403 || response.status === 401) {
            return sendErrorResponse(
              new Error(`Gemini API error: ${response.status} ${response.statusText} - Check your API key`),
              response.status
            );
          }
          lastError = new Error(`Gemini API error: ${response.status} ${response.statusText}`);
          continue;
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
          logError('Invalid Gemini response format:', data);
          lastError = new Error('Invalid response format from Gemini API');
          continue;
        }

        reply = data.candidates[0].content.parts[0].text;
        log(`Successfully got response from model ${modelName} (${apiVersion})`);
        break; // Success, exit loop
      } catch (geminiError) {
        logError(`Error calling Gemini API with model ${modelName} (${apiVersion}):`, geminiError);
        lastError = geminiError;
        // Continue to next model
        continue;
      }
    }
    
    if (!reply) {
      // All models failed
      logError('All Gemini models failed:', lastError);
      return sendErrorResponse(
        new Error(`Failed to generate response: ${lastError?.message || 'All models failed. Please check your Gemini API key and billing status.'}`),
        500
      );
    }

    return sendSuccessResponse({
      reply,
      contextUsed: contextChunks.length,
      sources: contextChunks.map(chunk => ({
        type: chunk.type,
        metadata: chunk.metadata,
      })),
    });
  } catch (error) {
    logError('Error in POST /api/account-chat:', error);
    // In production, log the actual error but return sanitized message
    // The actual error details are in server logs
    const errorMessage = error?.message || 'Unknown error occurred';
    logError('Full error details:', { 
      message: errorMessage, 
      stack: error?.stack,
      accountId,
      userId,
      queryLength: query?.length 
    });
    return sendErrorResponse(new Error(`Chat error: ${errorMessage}`), 500);
  }
}

