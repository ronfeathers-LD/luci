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

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    logError('GEMINI_API_KEY environment variable is not set');
    return sendErrorResponse(new Error('Server configuration error'), 500);
  }

  try {
    const body = await request.json();
    const { accountId, userId, query, messageHistory = [] } = body;

    if (!accountId || !userId || !query) {
      return sendErrorResponse(new Error('Missing required fields: accountId, userId, and query'), 400);
    }

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

    // Generate embedding for the query
    let queryEmbedding;
    try {
      queryEmbedding = await generateEmbedding(query, apiKey);
    } catch (embedError) {
      logError('Error generating query embedding:', embedError);
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
      const { data: similarEmbeddings, error: searchError } = await supabase
        .rpc('match_account_embeddings', {
          query_embedding: queryEmbedding, // Pass as array, not string
          match_account_id: actualAccountId,
          match_threshold: 0.7, // Minimum similarity threshold
          match_count: 5, // Return top 5 most similar chunks
        });

      if (!searchError && similarEmbeddings && similarEmbeddings.length > 0) {
        contextChunks = similarEmbeddings.map(emb => ({
          content: emb.content,
          type: emb.data_type,
          metadata: emb.metadata,
        }));
        log(`Found ${contextChunks.length} similar embeddings via RPC`);
      } else {
        if (searchError) {
          logError('RPC function error:', searchError);
        }
        // RPC function might not exist yet or error occurred, use fallback
        log('RPC function not available or no results, using fallback query');
        throw new Error('RPC function not available');
      }
    } catch (rpcError) {
      // Fallback: Get all embeddings for this account (less efficient but works)
      log('Using fallback: fetching all embeddings');
      const { data: allEmbeddings, error: fetchError } = await supabase
        .from('account_embeddings')
        .select('content, data_type, metadata, source_id')
        .eq('account_id', actualAccountId)
        .limit(10); // Limit to 10 for context size

      if (fetchError) {
        logError('Error fetching embeddings:', fetchError);
        // Continue with empty context - let Gemini handle it
      } else if (allEmbeddings && allEmbeddings.length > 0) {
        contextChunks = allEmbeddings.map(emb => ({
          content: emb.content,
          type: emb.data_type,
          metadata: emb.metadata,
        }));
        log(`Found ${contextChunks.length} embeddings via fallback`);
      } else {
        log('No embeddings found for this account');
      }
    }

    // Build context from retrieved chunks
    const context = contextChunks
      .map((chunk, idx) => `[${chunk.type.toUpperCase()} ${idx + 1}]\n${chunk.content}`)
      .join('\n\n---\n\n');

    // Build system prompt
    const systemPrompt = `You are an AI assistant helping analyze account data for ${account.name}.

You have access to the following account-specific information:
${context || '(No specific context available - use general knowledge carefully)'}

Your responses should:
- Be concise and actionable
- Cite specific data when making claims (mention the data type and source)
- Focus on insights and recommendations
- Acknowledge when you don't have information in the provided context
- Only use data provided in the context above - do not make assumptions about data not shown

IMPORTANT: Only use data provided in the context. If the context doesn't contain relevant information, say so clearly.`;

    // Build conversation history
    const conversationHistory = messageHistory
      .slice(-5) // Last 5 messages for context
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

    // Add current query
    conversationHistory.push({
      role: 'user',
      parts: [{ text: query }],
    });

    // Call Gemini API
    let reply;
    try {
      const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }],
          },
          ...conversationHistory,
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logError('Gemini API error:', { status: response.status, statusText: response.statusText, error: errorData });
        return sendErrorResponse(
          new Error(`Gemini API error: ${response.status} ${response.statusText}`),
          response.status
        );
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        logError('Invalid Gemini response format:', data);
        return sendErrorResponse(new Error('Invalid response format from Gemini API'), 500);
      }

      reply = data.candidates[0].content.parts[0].text;
    } catch (geminiError) {
      logError('Error calling Gemini API:', geminiError);
      return sendErrorResponse(new Error(`Failed to generate response: ${geminiError.message}`), 500);
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
    return sendErrorResponse(error, 500);
  }
}

