/**
 * Next.js App Router API Route for Account Embeddings
 * 
 * Handles:
 * - POST /api/account-embeddings - Generate and store embeddings for account data
 * - GET /api/account-embeddings - Get embedding status for an account
 */

import { NextRequest } from 'next/server';
import { getSupabaseClient, validateSupabase } from '../../../lib/supabase-server';
import { sendErrorResponse, sendSuccessResponse, handlePreflight, validateRequestSize, getClientIP, checkRateLimit, logError, log } from '../../../lib/next-api-helpers';
import { verifyAccountAccess, generateEmbedding, chunkText, formatAccountDataForEmbedding, formatContactDataForEmbedding, formatCaseDataForEmbedding, formatTranscriptionDataForEmbedding, formatSentimentDataForEmbedding } from '../../../lib/rag-helpers';

const { MAX_REQUEST_SIZE, RATE_LIMIT } = require('../../../../lib/constants');

// Handle OPTIONS preflight
export async function OPTIONS() {
  return handlePreflight(new NextRequest('http://localhost', { method: 'OPTIONS' }));
}

// GET /api/account-embeddings - Get embedding status
export async function GET(request) {
  const preflight = await handlePreflight(request);
  if (preflight) return preflight;

  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    const userId = searchParams.get('userId');

    if (!accountId || !userId) {
      return sendErrorResponse(new Error('Missing required parameters: accountId and userId'), 400);
    }

    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }

    // Verify account access
    const hasAccess = await verifyAccountAccess(supabase, userId, accountId);
    if (!hasAccess) {
      return sendErrorResponse(new Error('Access denied to this account'), 403);
    }

    // Get embedding count by data type
    const { data: embeddings, error } = await supabase
      .from('account_embeddings')
      .select('data_type, id')
      .eq('account_id', accountId);

    if (error) {
      logError('Error fetching embeddings:', error);
      return sendErrorResponse(new Error('Failed to fetch embedding status'), 500);
    }

    const counts = {
      account: 0,
      contact: 0,
      case: 0,
      transcription: 0,
      sentiment: 0,
      total: embeddings?.length || 0,
    };

    embeddings?.forEach(emb => {
      if (counts.hasOwnProperty(emb.data_type)) {
        counts[emb.data_type]++;
      }
    });

    return sendSuccessResponse({
      accountId,
      counts,
      hasEmbeddings: counts.total > 0,
    });
  } catch (error) {
    logError('Error in GET /api/account-embeddings:', error);
    return sendErrorResponse(error, 500);
  }
}

// POST /api/account-embeddings - Generate and store embeddings
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

  // Prefer OpenAI for embeddings (better free tier), fall back to Gemini
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  
  // Log which API we're using (without exposing keys)
  if (openaiApiKey) {
    log('Using OpenAI for embeddings (OPENAI_API_KEY found)');
  } else if (geminiApiKey) {
    log('Using Gemini for embeddings (fallback - OPENAI_API_KEY not found)');
  } else {
    logError('No embedding API key available. Please set OPENAI_API_KEY or GEMINI_API_KEY');
    return sendErrorResponse(new Error('Server configuration error: No embedding API key found'), 500);
  }

  try {
    const body = await request.json();
    const { accountId, userId, data } = body;

    if (!accountId || !userId) {
      return sendErrorResponse(new Error('Missing required fields: accountId and userId'), 400);
    }

    if (!data || typeof data !== 'object') {
      return sendErrorResponse(new Error('Missing or invalid data field'), 400);
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
      return sendErrorResponse(new Error('Access denied to this account'), 403);
    }

    // Get account info for salesforce_account_id
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id, salesforce_id')
      .eq('id', actualAccountId)
      .single();

    if (accountError || !account) {
      return sendErrorResponse(new Error('Account not found'), 404);
    }

    const salesforceAccountId = account.salesforce_id;
    const embeddingsToInsert = [];
    let failedCount = 0;
    let rateLimitError = false;

    // Process account data
    if (data.account) {
      const accountText = formatAccountDataForEmbedding(data.account);
      if (accountText) {
        try {
          const embedding = await generateEmbedding(accountText, openaiApiKey, geminiApiKey);
          embeddingsToInsert.push({
            account_id: actualAccountId,
            salesforce_account_id: salesforceAccountId,
            data_type: 'account',
            source_id: accountId,
            content: accountText,
            embedding: `[${embedding.join(',')}]`, // PostgreSQL vector format (Supabase will parse this)
            metadata: {
              name: data.account.name,
              tier: data.account.accountTier,
              contractValue: data.account.contractValue,
            },
          });
        } catch (err) {
          logError('Error generating account embedding:', err);
          failedCount++;
          // Check which API failed
          const isOpenAIError = err.message && err.message.includes('OpenAI');
          const isGeminiError = err.message && err.message.includes('Gemini');
          if (err.message && (err.message.includes('rate limit') || err.message.includes('quota'))) {
            rateLimitError = true;
            logError(`Rate limit error from ${isOpenAIError ? 'OpenAI' : isGeminiError ? 'Gemini' : 'unknown API'}`);
          }
        }
      }
    }

    // Process contacts
    if (data.contacts && Array.isArray(data.contacts)) {
      for (const contact of data.contacts) {
        const contactText = formatContactDataForEmbedding(contact);
        if (contactText) {
          try {
            const embedding = await generateEmbedding(contactText, openaiApiKey, geminiApiKey);
            embeddingsToInsert.push({
              account_id: accountId,
              salesforce_account_id: salesforceAccountId,
              data_type: 'contact',
              source_id: contact.id || contact.email,
              content: contactText,
              embedding: `[${embedding.join(',')}]`,
              metadata: {
                name: contact.name,
                email: contact.email,
                title: contact.title,
              },
            });
        } catch (err) {
          logError(`Error generating contact embedding for ${contact.email}:`, err);
          failedCount++;
          if (err.message && (err.message.includes('rate limit') || err.message.includes('quota'))) {
            rateLimitError = true;
          }
        }
        }
      }
    }

    // Process cases
    if (data.cases && Array.isArray(data.cases)) {
      for (const caseData of data.cases) {
        const caseText = formatCaseDataForEmbedding(caseData);
        if (caseText) {
          try {
            const embedding = await generateEmbedding(caseText, openaiApiKey, geminiApiKey);
            embeddingsToInsert.push({
              account_id: accountId,
              salesforce_account_id: salesforceAccountId,
              data_type: 'case',
              source_id: caseData.caseNumber || caseData.id,
              content: caseText,
              embedding: `[${embedding.join(',')}]`,
              metadata: {
                caseNumber: caseData.caseNumber,
                status: caseData.status,
                priority: caseData.priority,
                createdDate: caseData.createdDate,
              },
            });
          } catch (err) {
            logError(`Error generating case embedding for ${caseData.caseNumber}:`, err);
            failedCount++;
            if (err.message && (err.message.includes('rate limit') || err.message.includes('quota'))) {
              rateLimitError = true;
            }
          }
        }
      }
    }

    // Process transcriptions (chunk long ones)
    if (data.transcriptions && Array.isArray(data.transcriptions)) {
      for (const transcription of data.transcriptions) {
        const transcriptionText = formatTranscriptionDataForEmbedding(transcription);
        if (transcriptionText && transcription.transcriptionText) {
          // Chunk long transcriptions
          const chunks = chunkText(transcription.transcriptionText, 1000, 100);
          
          for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const chunkTextWithContext = `Meeting Subject: ${transcription.meetingSubject || 'N/A'}\nDate: ${transcription.meetingDate || 'N/A'}\n\nTranscript (Part ${i + 1}/${chunks.length}):\n${chunk}`;
            
            try {
              const embedding = await generateEmbedding(chunkTextWithContext, openaiApiKey, geminiApiKey);
              embeddingsToInsert.push({
                account_id: accountId,
                salesforce_account_id: salesforceAccountId,
                data_type: 'transcription',
                source_id: transcription.avomaMeetingUuid || transcription.id,
                content: chunkTextWithContext,
                embedding: `[${embedding.join(',')}]`,
                metadata: {
                  meetingSubject: transcription.meetingSubject,
                  meetingDate: transcription.meetingDate,
                  chunkIndex: i,
                  totalChunks: chunks.length,
                },
              });
            } catch (err) {
              logError(`Error generating transcription embedding chunk ${i}:`, err);
              failedCount++;
              if (err.message && (err.message.includes('rate limit') || err.message.includes('quota'))) {
                rateLimitError = true;
              }
            }
          }
        }
      }
    }

    // Process sentiment analyses
    if (data.sentimentAnalyses && Array.isArray(data.sentimentAnalyses)) {
      for (const sentiment of data.sentimentAnalyses) {
        const sentimentText = formatSentimentDataForEmbedding(sentiment);
        if (sentimentText) {
          try {
            const embedding = await generateEmbedding(sentimentText, openaiApiKey, geminiApiKey);
            embeddingsToInsert.push({
              account_id: accountId,
              salesforce_account_id: salesforceAccountId,
              data_type: 'sentiment',
              source_id: sentiment.id,
              content: sentimentText,
              embedding: `[${embedding.join(',')}]`,
              metadata: {
                score: sentiment.score,
                analyzedAt: sentiment.analyzedAt,
              },
            });
          } catch (err) {
            logError(`Error generating sentiment embedding:`, err);
            failedCount++;
            if (err.message && (err.message.includes('rate limit') || err.message.includes('quota'))) {
              rateLimitError = true;
            }
          }
        }
      }
    }

    // Check if we have any embeddings generated
    if (embeddingsToInsert.length === 0) {
      if (rateLimitError) {
        const apiUsed = openaiApiKey ? 'OpenAI' : 'Gemini';
        const errorMsg = openaiApiKey
          ? 'Rate limit exceeded: Unable to generate embeddings with OpenAI. Please try again later or check your OpenAI account limits.'
          : 'Rate limit exceeded: Unable to generate embeddings. The Gemini API free tier has limited quota. Please add OPENAI_API_KEY to Vercel environment variables for better rate limits, or try again later.';
        return sendErrorResponse(new Error(errorMsg), 429);
      }
      return sendSuccessResponse({
        message: 'No data to embed',
        count: 0,
      });
    }

    // Delete existing embeddings for this account (refresh)
    const { error: deleteError } = await supabase
      .from('account_embeddings')
      .delete()
      .eq('account_id', actualAccountId);

    if (deleteError) {
      logError('Error deleting existing embeddings:', deleteError);
      // Continue anyway - we'll just add new ones
    }

    // Insert new embeddings
    const { data: inserted, error: insertError } = await supabase
      .from('account_embeddings')
      .insert(embeddingsToInsert)
      .select();

    if (insertError) {
      logError('Error inserting embeddings:', insertError);
      return sendErrorResponse(new Error('Failed to store embeddings'), 500);
    }

    const message = failedCount > 0
      ? `Generated ${inserted?.length || 0} embeddings successfully (${failedCount} failed due to rate limits)`
      : 'Embeddings generated and stored successfully';

    return sendSuccessResponse({
      message,
      count: inserted?.length || 0,
      failed: failedCount,
    });
  } catch (error) {
    logError('Error in POST /api/account-embeddings:', error);
    return sendErrorResponse(error, 500);
  }
}


