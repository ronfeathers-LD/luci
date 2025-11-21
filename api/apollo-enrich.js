/**
 * Vercel Serverless Function for Apollo.io Contact Enrichment
 * 
 * Enriches contacts with profile data using Apollo.io API
 * Requires Apollo.io API key (see APOLLO_SETUP.md)
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { enrichContact: enrichContactWithApollo, getApolloConfig } = require('../lib/apollo-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, isProduction } = require('../lib/api-helpers');
const { CACHE_TTL } = require('../lib/constants');
const { isCacheFresh } = require('../lib/cache-helpers');

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }
  
  // Only allow POST and GET requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return sendErrorResponse(res, new Error('Method not allowed'), 405);
  }

  // Wrap everything in try-catch to ensure we never return 500
  let contact = null;
  
  try {
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    // Get parameters
    const { contactId, salesforceContactId, email, firstName, lastName, linkedinURL, company, forceRefresh } = req.method === 'POST' 
      ? req.body 
      : req.query;

    if (!contactId && !salesforceContactId && !email && (!firstName || !lastName)) {
      return sendErrorResponse(res, new Error('Missing required parameter: contactId, salesforceContactId, email, or firstName+lastName'), 400);
    }

    const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

    // If we have contactId or salesforceContactId, fetch contact from database
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
    } else {
      // Build contact object from provided parameters
      contact = {
        email: email || null,
        firstName: firstName || null,
        lastName: lastName || null,
        linkedinURL: linkedinURL || null,
        company: company || null,
      };
    }

    // Check if we already have enriched profile data (unless force refresh)
    if (!shouldForceRefresh && contact.id) {
      const { data: existingProfile } = await supabase
        .from('linkedin_profiles')
        .select('*')
        .eq('contact_id', contact.id)
        .order('last_synced_at', { ascending: false })
        .limit(1)
        .single();

      if (existingProfile) {
        // Check if cache is fresh (24 hours)
        if (isCacheFresh(existingProfile.last_synced_at, CACHE_TTL.CONTACTS)) {
          // Return cached profile
          return sendSuccessResponse(res, {
            success: true,
            profile: existingProfile,
            cached: true,
            source: 'apollo',
          });
        }
      }
    }

    // Try to enrich contact with Apollo.io
    try {
      let config;
      try {
        config = await getApolloConfig(supabase);
        log('Apollo.io config retrieved successfully');
      } catch (configError) {
        // Apollo.io config not found or error
        logError('Apollo.io config error:', configError);
        return sendSuccessResponse(res, {
          success: false,
          message: configError.message || 'Apollo.io API key not configured. Please configure Apollo.io API key in Supabase.',
          profile: null,
        });
      }
      
      if (!config || !config.api_key) {
        logError('Apollo.io config missing API key:', { config: config ? 'exists' : 'null' });
        return sendSuccessResponse(res, {
          success: false,
          message: 'Apollo.io API key is missing in configuration.',
          profile: null,
        });
      }

      // Prepare contact data for Apollo.io enrichment
      const contactForEnrichment = {
        id: contact.id || null,
        salesforce_id: contact.salesforce_id || salesforceContactId || null,
        email: contact.email || email || null,
        firstName: contact.first_name || contact.firstName || firstName || null,
        lastName: contact.last_name || contact.lastName || lastName || null,
        linkedinURL: contact.linkedin_url || contact.linkedinURL || linkedinURL || null,
        company: contact.account_name || contact.company || company || null,
        accountName: contact.account_name || null,
      };

      // Attempt enrichment with Apollo.io
      const enrichmentResult = await enrichContactWithApollo(supabase, contactForEnrichment);
      
      if (enrichmentResult.success && enrichmentResult.profile) {
        // Save enriched profile to database
        const profileData = {
          ...enrichmentResult.profile,
          contact_id: contact.id || null,
          salesforce_contact_id: contact.salesforce_id || salesforceContactId || null,
        };

        // Remove fields that don't exist in linkedin_profiles table
        delete profileData.email;
        delete profileData.phone_number;

        const { data: savedProfile, error: upsertError } = await supabase
          .from('linkedin_profiles')
          .upsert(profileData, {
            onConflict: 'linkedin_url',
            ignoreDuplicates: false,
          })
          .select()
          .single();

        if (upsertError) {
          logError('Error saving Apollo.io enriched profile:', upsertError);
          // Still return the profile data even if save fails
        }

        return sendSuccessResponse(res, {
          success: true,
          profile: savedProfile || profileData,
          cached: false,
          source: 'apollo',
        });
      } else {
        return sendSuccessResponse(res, {
          success: false,
          error: enrichmentResult.error,
          message: 'Apollo.io enrichment attempted but failed. ' + (enrichmentResult.error || 'No matching person found.'),
          profile: null,
        });
      }
    } catch (error) {
      logError('Error enriching contact with Apollo.io:', error);
      logError('Error stack:', error.stack);
      
      // Return a graceful error instead of 500
      return sendSuccessResponse(res, {
        success: false,
        error: error.message || 'Apollo.io enrichment failed',
        message: 'Apollo.io enrichment is not available. ' + (error.message || 'An error occurred.'),
        profile: null,
      });
    }

  } catch (error) {
    logError('Error in apollo-enrich function:', error);
    logError('Error stack:', error.stack);
    
    // Return graceful error instead of 500 to prevent UI errors
    return sendSuccessResponse(res, {
      success: false,
      error: error.message || 'An error occurred while enriching contact with Apollo.io',
      message: 'Apollo.io enrichment is not available. ' + (error.message || 'An error occurred.'),
      profile: null,
    });
  }
}

