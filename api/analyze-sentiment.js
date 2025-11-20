/**
 * Vercel Serverless Function for Sentiment Analysis
 * 
 * This function securely handles the Gemini API call server-side,
 * protecting the API key from client-side exposure.
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

  try {
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

    const response = await retryFetch(async () => {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
    });

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
    return res.status(500).json({ error: error.message || 'An error occurred while analyzing sentiment' });
  }
}

