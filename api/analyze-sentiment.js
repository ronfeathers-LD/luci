/**
 * Vercel Serverless Function for Sentiment Analysis
 * 
 * This function securely handles the Gemini API call server-side,
 * protecting the API key from client-side exposure.
 */

// Constants
const MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10MB
const REQUEST_TIMEOUT = 30000; // 30 seconds

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
          text: `Analyze the customer sentiment from the following conversation transcription and Salesforce context:

TRANSCRIPTION:
${transcription}

SALESFORCE CONTEXT:
${JSON.stringify(salesforceContext, null, 2)}

Please provide a sentiment analysis based on the customer's overall experience, considering their initial concerns, how they were addressed, and the final outcome.`
        }]
      }],
      systemInstruction: {
        parts: [{
          text: "You are a Customer Sentiment Analyst. Your role is to analyze customer conversations and provide structured sentiment scores. Consider the full customer journey, including initial concerns, resolution quality, and final satisfaction. Provide scores from 1 (very negative) to 10 (very positive) with concise, actionable summaries."
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
              description: "A concise justification of the sentiment score, maximum 50 words."
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

