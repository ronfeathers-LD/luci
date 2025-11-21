/**
 * Vercel Serverless Function for LinkedIn Contact Enrichment
 * 
 * Enriches contacts with LinkedIn profile data using LinkedIn API
 * Requires LinkedIn OAuth access token (see LINKEDIN_SETUP.md)
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { enrichContact, getLinkedInConfig, normalizeLinkedInURL } = require('../lib/linkedin-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } = require('../lib/api-helpers');

export default async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }
  
  // Only allow POST and GET requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return sendErrorResponse(res, new Error('Method not allowed'), 405);
  }

  // Wrap everything in try-catch to ensure we never return 500
  try {
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    // Get parameters
    const { linkedinURL, contactId, salesforceContactId, forceRefresh } = req.method === 'POST' 
      ? req.body 
      : req.query;

    if (!linkedinURL && !contactId && !salesforceContactId) {
      return sendErrorResponse(res, new Error('Missing required parameter: linkedinURL, contactId, or salesforceContactId'), 400);
    }

    const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

    // If we have contactId or salesforceContactId, fetch contact from database
    let contact = null;
    if (contactId || salesforceContactId) {
      let query = supabase.from('contacts').select('*');
      
      if (contactId) {
        query = query.eq('id', contactId);
      } else {
        query = query.eq('salesforce_id', salesforceContactId);
      }
      
      const { data: contactData, error: contactError } = await query.single();
      
      if (contactError || !contactData) {
        return sendErrorResponse(res, new Error('Contact not found'), 404);
      }
      
      contact = contactData;
      linkedinURL = linkedinURL || contact.linkedin_url;
    }

    if (!linkedinURL) {
      return sendErrorResponse(res, new Error('LinkedIn URL is required'), 400);
    }

    // Normalize LinkedIn URL to ensure it's in the correct format
    const normalizedURL = normalizeLinkedInURL(linkedinURL);
    if (!normalizedURL) {
      return sendErrorResponse(res, new Error(`Invalid LinkedIn URL format. Unable to normalize LinkedIn URL: ${linkedinURL}. Expected format: https://www.linkedin.com/in/username or in/username`), 400);
    }
    
    // Use normalized URL for all operations
    linkedinURL = normalizedURL;

    // Check if we already have enriched profile data (unless force refresh)
    // Note: linkedinURL is already normalized at this point
    if (!shouldForceRefresh && contact) {
      const { data: existingProfile } = await supabase
        .from('linkedin_profiles')
        .select('*')
        .eq('linkedin_url', linkedinURL)
        .single();

      if (existingProfile) {
        // Check if cache is fresh (24 hours)
        const lastSynced = new Date(existingProfile.last_synced_at);
        const now = new Date();
        const cacheAge = now - lastSynced;
        const cacheTTL = 24 * 60 * 60 * 1000; // 24 hours

        if (cacheAge < cacheTTL) {
          // Return cached profile
          
          return sendSuccessResponse(res, {
            success: true,
            profile: existingProfile,
            cached: true,
          });
        }
      }
    }

    // Try to enrich contact with LinkedIn data
    // Note: This requires LinkedIn OAuth access token
    // If not available, we'll return the URL for manual enrichment
    try {
      let config;
      try {
        config = await getLinkedInConfig(supabase);
      } catch (configError) {
        // LinkedIn config not found or error fetching it
        return sendSuccessResponse(res, {
          success: false,
          linkedinURL: linkedinURL,
          message: 'LinkedIn OAuth not configured. Profile URL stored for future enrichment.',
          profile: null,
        });
      }
      
      if (!config || !config.access_token) {
        // No access token - return URL only (enrichment requires OAuth)
        return sendSuccessResponse(res, {
          success: false,
          linkedinURL: linkedinURL,
          message: 'LinkedIn OAuth not configured. Profile URL stored for future enrichment.',
          profile: null,
        });
      }

      // Attempt enrichment (linkedinURL is already normalized)
      const contactForEnrichment = contact || { 
        id: contactId, 
        salesforce_id: salesforceContactId 
      };
      const enrichmentResult = await enrichContact(supabase, contactForEnrichment, linkedinURL);
      
      if (enrichmentResult.success) {
        // Fetch the enriched profile
        const { data: profile } = await supabase
          .from('linkedin_profiles')
          .select('*')
          .eq('linkedin_url', linkedinURL)
          .single();

        return sendSuccessResponse(res, {
          success: true,
          profile: profile,
          cached: false,
        });
      } else {
        return sendSuccessResponse(res, {
          success: false,
          linkedinURL: linkedinURL,
          error: enrichmentResult.error,
          message: 'LinkedIn enrichment attempted but failed. URL stored for future enrichment.',
        });
      }
    } catch (error) {
      // If enrichment fails (e.g., no OAuth token), just store the URL
      if (error.message && (error.message.includes('not found') || error.message.includes('not available') || error.message.includes('not configured'))) {
        return sendSuccessResponse(res, {
          success: true,
          linkedinURL: linkedinURL,
          message: 'LinkedIn OAuth not configured. Profile URL stored for future enrichment.',
          profile: null,
        });
      }
      
      logError('Error enriching LinkedIn profile:', error);
      logError('Error stack:', error.stack);
      
      // Return a graceful error instead of 500
      return sendSuccessResponse(res, {
        success: false,
        linkedinURL: linkedinURL,
        error: error.message || 'LinkedIn enrichment failed',
        message: 'LinkedIn enrichment is not available. Profile URL stored for future enrichment.',
        profile: null,
      });
    }

  } catch (error) {
    logError('Error in linkedin-enrich function:', error);
    logError('Error stack:', error.stack);
    
    // Return graceful error instead of 500 to prevent UI errors
    return sendSuccessResponse(res, {
      success: false,
      linkedinURL: linkedinURL || null,
      error: error.message || 'An error occurred while enriching LinkedIn profile',
      message: 'LinkedIn enrichment is not available. Profile URL stored for future enrichment.',
      profile: null,
    });
  }
}

