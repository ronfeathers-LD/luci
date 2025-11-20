/**
 * Vercel Serverless Function for Sentiment Analysis
 * 
 * This function securely handles the Gemini API call server-side,
 * protecting the API key from client-side exposure.
 */

// Constants
const MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10MB
const REQUEST_TIMEOUT = 30000; // 30 seconds
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

// Simple in-memory rate limiter (for production, use Redis or similar)
const rateLimitStore = new Map();

// Rate limiting helper
const checkRateLimit = (ip) => {
  const now = Date.now();
  const key = ip;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  const record = rateLimitStore.get(key);
  
  // Reset if window expired
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW;
    return true;
  }
  
  // Check if limit exceeded
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   'unknown';
  
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again in a minute.',
      retryAfter: 60
    });
  }

  // Check request size
  const contentLength = req.headers['content-length'];
  if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
    return res.status(413).json({ error: 'Request too large' });
  }

  // Get API key from environment variable
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { transcription, salesforceContext } = req.body;

  // Validate input
  if (!transcription || !salesforceContext) {
    return res.status(400).json({ error: 'Missing required parameters: transcription and salesforceContext' });
  }
  
  // Validate input types and sizes
  if (typeof transcription !== 'string' || transcription.length > 50000) {
    return res.status(400).json({ error: 'Invalid transcription: must be a string under 50,000 characters' });
  }
  
  if (typeof salesforceContext !== 'object' || salesforceContext === null) {
    return res.status(400).json({ error: 'Invalid salesforceContext: must be an object' });
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

5. **Overall Assessment**:
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
      console.error('Gemini API error:', data.error);
      return res.status(500).json({ error: `Gemini API error: ${data.error.message || 'Unknown error'}` });
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return res.status(500).json({ error: 'Invalid response format from Gemini API' });
    }

    const content = data.candidates[0].content.parts[0].text;
    const result = JSON.parse(content);
    
    // Validate score is within range
    if (result.score < 1 || result.score > 10) {
      return res.status(500).json({ error: 'Invalid sentiment score returned from API' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in analyze-sentiment function:', error);
    
    // Handle timeout specifically
    if (error.message === 'Request timeout') {
      return res.status(504).json({ error: 'Request timeout' });
    }
    
    // Don't expose internal error details in production
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'An error occurred while analyzing sentiment'
      : error.message || 'An error occurred while analyzing sentiment';
    
    return res.status(500).json({ error: errorMessage });
  }
}

