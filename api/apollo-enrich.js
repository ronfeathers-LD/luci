/**
 * Vercel Serverless Function for Apollo.io Contact Enrichment
 * 
 * Enriches contacts with profile data using Apollo.io API
 * Supports both single contact and bulk enrichment
 * Requires Apollo.io API key (see APOLLO_SETUP.md)
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { enrichContact: enrichContactWithApollo, bulkEnrichContacts, getApolloConfig } = require('../lib/apollo-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, logWarn, isProduction } = require('../lib/api-helpers');
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

  // ENRICHMENT DISABLED: Apollo.io license has expired
  // Return early to prevent any API calls
  const { contacts } = req.method === 'POST' ? req.body : req.query;
  const isBulkRequest = Array.isArray(contacts) && contacts.length > 0;

  if (isBulkRequest) {
    // Return empty results for bulk requests
    return sendSuccessResponse(res, {
      success: true,
      results: contacts.map(contact => ({
        contact,
        success: false,
        error: 'Apollo.io enrichment is currently disabled (license expired)',
        profile: null,
        skipped: true,
      })),
      total: contacts.length,
      enriched: 0,
      cached: 0,
      failed: 0,
      skipped: contacts.length,
      creditsExhausted: true,
      message: 'Apollo.io enrichment is currently disabled. Analysis will continue with available Salesforce data.',
    });
  } else {
    // Single contact enrichment - return disabled message
    return sendSuccessResponse(res, {
      success: false,
      error: 'Apollo.io enrichment is currently disabled (license expired)',
      profile: null,
      skipped: true,
      message: 'Apollo.io enrichment is currently disabled. Analysis will continue with available Salesforce data.',
    });
  }

  // Code below is disabled - uncomment when license is renewed
  /*
  try {
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    // Check if this is a bulk request (contacts is an array)
    const { contacts } = req.method === 'POST' ? req.body : req.query;
    const isBulkRequest = Array.isArray(contacts) && contacts.length > 0;

    if (isBulkRequest) {
      // BULK ENRICHMENT PATH
      const { forceRefresh } = req.body;

      // Limit batch size to stay within rate limits
      // Apollo.io allows 50 calls/minute, so we'll process in smaller batches
      const MAX_BATCH_SIZE = 25; // Process 25 at a time to be safe
      const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

      if (contacts.length > MAX_BATCH_SIZE) {
        log(`Batch size ${contacts.length} exceeds max ${MAX_BATCH_SIZE}, processing in chunks`);
      }

      // Check cache for each contact (unless force refresh) - batch queries for performance
      const contactsToEnrich = [];
      const cachedResults = [];

      if (!shouldForceRefresh) {
        // Build cache queries in parallel
        const cacheQueries = contacts.map(contact => {
          const contactId = contact.contactId || contact.id;
          const salesforceContactId = contact.salesforceContactId || contact.salesforce_id;
          const linkedinURL = contact.linkedinURL || contact.linkedin_url;

          if (!contactId && !salesforceContactId && !linkedinURL) {
            return { contact, promise: Promise.resolve(null) };
          }

          let cacheQuery = supabase
            .from('linkedin_profiles')
            .select('*')
            .order('last_synced_at', { ascending: false });

          // Try to find existing profile by any available identifier
          if (contactId) {
            cacheQuery = cacheQuery.eq('contact_id', contactId);
          } else if (salesforceContactId) {
            cacheQuery = cacheQuery.eq('salesforce_contact_id', salesforceContactId);
          } else if (linkedinURL) {
            cacheQuery = cacheQuery.eq('linkedin_url', linkedinURL);
          }

          return {
            contact,
            promise: cacheQuery.limit(1).maybeSingle().then(({ data }) => data)
          };
        });

        // Execute all cache queries in parallel
        const cacheResults = await Promise.all(cacheQueries.map(q => q.promise));

        // Process results
        cacheQueries.forEach(({ contact }, index) => {
          const existingProfile = cacheResults[index];
          if (existingProfile && isCacheFresh(existingProfile.last_synced_at, CACHE_TTL.CONTACTS)) {
            cachedResults.push({
              contact,
              success: true,
              profile: existingProfile,
              cached: true,
              source: 'apollo',
            });
          } else {
            contactsToEnrich.push(contact);
          }
        });
      } else {
        // Force refresh - skip cache checks
        contactsToEnrich.push(...contacts);
      }

      log(`Processing ${contactsToEnrich.length} contacts for enrichment (${cachedResults.length} from cache)`);

      // Process in batches to respect rate limits
      const batchResults = [];
      for (let i = 0; i < contactsToEnrich.length; i += MAX_BATCH_SIZE) {
        const batch = contactsToEnrich.slice(i, i + MAX_BATCH_SIZE);
        
        log(`Processing batch ${Math.floor(i / MAX_BATCH_SIZE) + 1} of ${Math.ceil(contactsToEnrich.length / MAX_BATCH_SIZE)} (${batch.length} contacts)`);
        
        try {
          const batchEnrichmentResults = await bulkEnrichContacts(supabase, batch);
          
          // Check if credits were exhausted - stop processing if so
          const creditsExhausted = batchEnrichmentResults.some(r => r.creditsExhausted);
          if (creditsExhausted) {
            // Silently stop processing - enrichment is optional
            // Mark remaining contacts as skipped (not failed) due to credits
            for (let j = i + batch.length; j < contactsToEnrich.length; j++) {
              batchResults.push({
                success: false,
                contact: contactsToEnrich[j],
                error: 'Apollo.io credits exhausted',
                creditsExhausted: true,
                skipped: true,
              });
            }
            break; // Exit the batch loop
          }
          
          // Save enriched profiles to database
          for (const result of batchEnrichmentResults) {
            if (result.success && result.profile) {
              const profileData = {
                ...result.profile,
                contact_id: result.contact.id || result.contact.contactId || null,
                salesforce_contact_id: result.contact.salesforce_id || result.contact.salesforceContactId || null,
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
                  contact_id: result.contact.id || result.contact.contactId || null,
                  salesforce_contact_id: result.contact.salesforce_id || result.contact.salesforceContactId || null,
                  linkedin_url: result.profile.linkedin_url || null,
                  linkedin_urn: result.profile.linkedin_urn || null,
                  first_name: result.profile.first_name || null,
                  last_name: result.profile.last_name || null,
                  headline: result.profile.headline || null,
                  current_title: result.profile.current_title || null,
                  current_company: result.profile.current_company || null,
                  company_urn: result.profile.company_urn || null,
                  location: result.profile.location || null,
                  profile_picture_url: result.profile.profile_picture_url || null,
                  job_changed_recently: result.profile.job_changed_recently || false,
                  days_in_current_role: result.profile.days_in_current_role || null,
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
              }

              batchResults.push({
                contact: result.contact,
                success: true,
                profile: savedProfile || result.profile,
                cached: false,
                source: 'apollo',
              });
            } else {
              batchResults.push(result);
            }
          }

          // Add delay between batches to respect rate limits (50 calls/minute = ~1.2 seconds per call)
          // With batch of 25, we need ~30 seconds between batches to be safe
          if (i + MAX_BATCH_SIZE < contactsToEnrich.length) {
            const delayMs = 30000; // 30 seconds between batches
            log(`Waiting ${delayMs / 1000} seconds before next batch to respect rate limits...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
        } catch (batchError) {
          logError('Error processing batch:', batchError);
          // Add failed results for this batch
          batch.forEach(contact => {
            batchResults.push({
              contact,
              success: false,
              error: batchError.message || 'Batch enrichment failed',
              profile: null,
            });
          });
        }
      }

      // Combine cached and newly enriched results
      const allResults = [...cachedResults, ...batchResults];
      
      // Check if credits were exhausted
      const creditsExhausted = batchResults.some(r => r.creditsExhausted);
      const enriched = batchResults.filter(r => r.success).length;
      const cached = cachedResults.length;
      const failed = allResults.filter(r => !r.success && !r.skipped).length;
      const skipped = allResults.filter(r => r.skipped).length;

      return sendSuccessResponse(res, {
        success: true,
        results: allResults,
        total: allResults.length,
        enriched,
        cached,
        failed,
        skipped,
        creditsExhausted, // Flag to notify frontend
        message: creditsExhausted ? 'Apollo.io credits exhausted. Some contacts were not enriched, but analysis will continue with available data.' : null,
      });

    } else {
      // SINGLE ENRICHMENT PATH
      // Wrap everything in try-catch to ensure we never return 500
      let contact = null;
      
      try {
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
  } catch (error) {
    logError('Error in apollo-enrich function:', error);
    logError('Error stack:', error.stack);
    
    // Return graceful error instead of 500
    return sendSuccessResponse(res, {
      success: false,
      error: error.message || 'An error occurred while enriching contacts with Apollo.io',
      message: 'Apollo.io enrichment is not available. ' + (error.message || 'An error occurred.'),
      profile: null,
      results: null,
    });
  }
  */
}
