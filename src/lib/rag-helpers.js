/**
 * RAG (Retrieval-Augmented Generation) Helper Functions
 * 
 * Handles:
 * - Data chunking for embeddings
 * - Embedding generation using Gemini
 * - Account access verification
 */

/**
 * Verify that a user has access to an account
 */
export async function verifyAccountAccess(supabase, userId, accountId) {
  if (!userId || !accountId) {
    return false;
  }

  // Use maybeSingle() to avoid errors when no record exists
  const { data, error } = await supabase
    .from('user_accounts')
    .select('id')
    .eq('user_id', userId)
    .eq('account_id', accountId)
    .maybeSingle();

  // Return false if error or no data found
  if (error) {
    // Log non-PGRST116 errors (PGRST116 is "not found" which is expected)
    if (error.code !== 'PGRST116') {
      console.error('Error verifying account access:', error);
    }
    return false;
  }

  return !!data;
}

/**
 * Chunk text into smaller pieces for embedding
 * Uses fixed-size chunks with overlap to preserve context
 */
export function chunkText(text, chunkSize = 1000, overlap = 100) {
  if (!text || text.length === 0) {
    return [];
  }

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.substring(start, end);
    
    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }

    // Move forward, but overlap with previous chunk
    start = end - overlap;
    
    // Prevent infinite loop if overlap >= chunkSize
    if (start >= end) {
      start = end;
    }
  }

  return chunks;
}

/**
 * Generate embedding using OpenAI API (text-embedding-3-small)
 * Falls back to Gemini if OpenAI key is not available
 * OpenAI has a more generous free tier for embeddings
 */
export async function generateEmbedding(text, openaiApiKey = null, geminiApiKey = null) {
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty');
  }

  // Prefer OpenAI if available (better free tier)
  if (openaiApiKey) {
    try {
      return await generateOpenAIEmbedding(text, openaiApiKey);
    } catch (error) {
      // If OpenAI fails with API key error, don't fall back
      if (error.message && (error.message.includes('API key') || error.message.includes('Invalid'))) {
        throw error;
      }
      // If OpenAI fails for other reasons and we have Gemini, fall back
      if (geminiApiKey) {
        console.warn('OpenAI embedding failed, falling back to Gemini:', error.message);
        return await generateGeminiEmbedding(text, geminiApiKey);
      } else {
        throw error;
      }
    }
  }

  // Fall back to Gemini if OpenAI not available
  if (geminiApiKey) {
    return await generateGeminiEmbedding(text, geminiApiKey);
  }

  throw new Error('No embedding API key available. Please set OPENAI_API_KEY or GEMINI_API_KEY');
}

/**
 * Generate embedding using OpenAI API
 */
async function generateOpenAIEmbedding(text, apiKey) {
  const url = 'https://api.openai.com/v1/embeddings';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 429) {
      const errorMessage = errorData?.error?.message || 'Rate limit exceeded';
      throw new Error(`OpenAI embedding API rate limit exceeded. ${errorMessage}. Please try again later.`);
    }
    
    throw new Error(`OpenAI embedding API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  
  if (!data.data || !data.data[0] || !data.data[0].embedding) {
    throw new Error('Invalid response format from OpenAI embedding API');
  }

  return data.data[0].embedding;
}

/**
 * Generate embedding using Gemini API (fallback)
 */
async function generateGeminiEmbedding(text, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'models/embedding-001',
      content: {
        parts: [{
          text: text
        }]
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 429) {
      const errorMessage = errorData?.error?.message || 'Rate limit exceeded';
      throw new Error(`Gemini embedding API rate limit exceeded. ${errorMessage}. Please try again later or upgrade your API plan.`);
    }
    
    if (response.status === 429 && errorData?.error?.code === 'RESOURCE_EXHAUSTED') {
      throw new Error('Gemini embedding API quota exceeded. The free tier has limited quota. Please wait or upgrade your plan.');
    }
    
    throw new Error(`Gemini embedding API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  
  if (!data.embedding || !data.embedding.values) {
    throw new Error('Invalid response format from Gemini embedding API');
  }

  return data.embedding.values;
}

/**
 * Format account data for embedding
 */
export function formatAccountDataForEmbedding(account) {
  const parts = [];
  
  if (account.name) parts.push(`Account Name: ${account.name}`);
  if (account.accountTier) parts.push(`Account Tier: ${account.accountTier}`);
  if (account.contractValue) parts.push(`Contract Value: ${account.contractValue}`);
  if (account.industry) parts.push(`Industry: ${account.industry}`);
  if (account.annualRevenue) parts.push(`Annual Revenue: ${account.annualRevenue}`);
  if (account.ownerName) parts.push(`Account Manager: ${account.ownerName}`);

  return parts.join('\n');
}

/**
 * Format contact data for embedding
 */
export function formatContactDataForEmbedding(contact) {
  const parts = [];
  
  if (contact.name) parts.push(`Contact Name: ${contact.name}`);
  if (contact.email) parts.push(`Email: ${contact.email}`);
  if (contact.title) parts.push(`Title: ${contact.title}`);
  if (contact.contactStatus) parts.push(`Status: ${contact.contactStatus}`);
  if (contact.department) parts.push(`Department: ${contact.department}`);
  if (contact.phone) parts.push(`Phone: ${contact.phone}`);

  return parts.join('\n');
}

/**
 * Format case data for embedding
 */
export function formatCaseDataForEmbedding(caseData) {
  const parts = [];
  
  if (caseData.caseNumber) parts.push(`Case Number: ${caseData.caseNumber}`);
  if (caseData.subject) parts.push(`Subject: ${caseData.subject}`);
  if (caseData.status) parts.push(`Status: ${caseData.status}`);
  if (caseData.priority) parts.push(`Priority: ${caseData.priority}`);
  if (caseData.type) parts.push(`Type: ${caseData.type}`);
  if (caseData.reason) parts.push(`Reason: ${caseData.reason}`);
  if (caseData.description) parts.push(`Description: ${caseData.description}`);
  if (caseData.createdDate) parts.push(`Created: ${caseData.createdDate}`);
  if (caseData.closedDate) parts.push(`Closed: ${caseData.closedDate}`);
  if (caseData.contactName) parts.push(`Contact: ${caseData.contactName}`);

  return parts.join('\n');
}

/**
 * Format transcription data for embedding
 */
export function formatTranscriptionDataForEmbedding(transcription) {
  const parts = [];
  
  // Handle different field name variations
  const meetingSubject = transcription.meetingSubject || transcription.meeting?.subject || transcription.subject;
  const meetingDate = transcription.meetingDate || transcription.meeting?.meeting_date || transcription.meeting_date;
  const transcriptText = transcription.transcriptionText || transcription.transcription || transcription.transcript || transcription.text || '';
  
  if (meetingSubject) parts.push(`Meeting Subject: ${meetingSubject}`);
  if (meetingDate) parts.push(`Date: ${meetingDate}`);
  if (transcriptText) parts.push(`\nTranscript:\n${transcriptText}`);

  return parts.join('\n');
}

/**
 * Format sentiment analysis for embedding
 */
export function formatSentimentDataForEmbedding(sentiment) {
  const parts = [];
  
  parts.push(`Sentiment Score: ${sentiment.score}/10`);
  if (sentiment.summary) parts.push(`Summary: ${sentiment.summary}`);
  if (sentiment.comprehensiveAnalysis) parts.push(`Analysis: ${sentiment.comprehensiveAnalysis}`);
  if (sentiment.analyzedAt) parts.push(`Analyzed: ${sentiment.analyzedAt}`);

  return parts.join('\n');
}

