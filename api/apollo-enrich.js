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

    // If we have contactId or salesforceContactId, try to fetch contact from database
    // But if not found, we can still enrich with provided parameters
    if (contactId || salesforceContactId) {
      let query = supabase.from('contacts').select('*');
      
      if (contactId) {
        query = query.eq('id', contactId);
      } else {
        query = query.eq('salesforce_id', salesforceContactId);
      }
      
      const { data: contactData, error: contactError } = await query.single();
      
      if (contactError || !contactData) {
        // Contact not in database, but we can still try to enrich with provided parameters
        log(`Contact not found in database (${contactId || salesforceContactId}), but will attempt enrichment with provided data`);
        contact = {
          id: null,
          salesforce_id: salesforceContactId || null,
          email: email || null,
          first_name: firstName || null,
          last_name: lastName || null,
          linkedin_url: linkedinURL || null,
          account_name: company || null,
        };
      } else {
        contact = contactData;
      }
    } else {
      // Build contact object from provided parameters
      contact = {
        id: null,
        salesforce_id: null,
        email: email || null,
        first_name: firstName || null,
        last_name: lastName || null,
        linkedin_url: linkedinURL || null,
        account_name: company || null,
      };
    }

    // Check if we already have enriched profile data (unless force refresh)
    // Check cache using contact_id, salesforce_contact_id, or linkedin_url
    if (!shouldForceRefresh && (contact.id || contact.salesforce_id || contact.linkedin_url)) {
      let cacheQuery = supabase
        .from('linkedin_profiles')
        .select('*')
        .order('last_synced_at', { ascending: false });

      // Try to find existing profile by any available identifier
      if (contact.id) {
        cacheQuery = cacheQuery.eq('contact_id', contact.id);
      } else if (contact.salesforce_id) {
        cacheQuery = cacheQuery.eq('salesforce_contact_id', contact.salesforce_id);
      } else if (contact.linkedin_url) {
        cacheQuery = cacheQuery.eq('linkedin_url', contact.linkedin_url);
      }

      const { data: existingProfile } = await cacheQuery.limit(1).maybeSingle();

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
        // Save enriched profile to database (only if we have a contact ID)
        if (contact.id) {
          const profileData = {
            ...enrichmentResult.profile,
            contact_id: contact.id,
            salesforce_contact_id: contact.salesforce_id || salesforceContactId || null,
          };

          // Remove fields that don't exist in linkedin_profiles table
          delete profileData.email;
          delete profileData.phone_number;

          // Try to upsert with all fields first
          let { data: savedProfile, error: upsertError } = await supabase
            .from('linkedin_profiles')
            .upsert(profileData, {
              onConflict: 'linkedin_url',
              ignoreDuplicates: false,
            })
            .select()
            .single();

          // If error is about missing columns, try again with only core fields (from migration 008)
          if (upsertError && upsertError.code === 'PGRST204') {
            logWarn(`Missing column detected for Apollo profile, retrying with core fields only:`, upsertError.message);
            
            // Retry with only core fields that definitely exist (from base migration 008)
            const coreProfileData = {
              contact_id: contact.id,
              salesforce_contact_id: contact.salesforce_id || salesforceContactId || null,
              linkedin_url: enrichmentResult.profile.linkedin_url || null,
              linkedin_urn: enrichmentResult.profile.linkedin_urn || null,
              first_name: enrichmentResult.profile.first_name || null,
              last_name: enrichmentResult.profile.last_name || null,
              headline: enrichmentResult.profile.headline || null,
              current_title: enrichmentResult.profile.current_title || null,
              current_company: enrichmentResult.profile.current_company || null,
              company_urn: enrichmentResult.profile.company_urn || null,
              location: enrichmentResult.profile.location || null,
              profile_picture_url: enrichmentResult.profile.profile_picture_url || null,
              job_changed_recently: enrichmentResult.profile.job_changed_recently || false,
              days_in_current_role: enrichmentResult.profile.days_in_current_role || null,
              last_synced_at: new Date().toISOString(),
            };

            const retryResult = await supabase
              .from('linkedin_profiles')
              .upsert(coreProfileData, {
                onConflict: 'linkedin_url',
                ignoreDuplicates: false,
              })
              .select()
              .single();

            savedProfile = retryResult.data;
            upsertError = retryResult.error;
          }

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
          // Contact not in database, but enrichment succeeded - return profile without saving
          return sendSuccessResponse(res, {
            success: true,
            profile: enrichmentResult.profile,
            cached: false,
            source: 'apollo',
            message: 'Enrichment successful, but contact not in database so profile was not saved.',
          });
        }
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

