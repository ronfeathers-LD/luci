/**
 * Vercel Serverless Function for Apollo.io Bulk Contact Enrichment
 * 
 * Enriches multiple contacts in a single batch to stay within rate limits
 * Apollo.io allows 50 calls/minute, so we batch and rate limit accordingly
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { bulkEnrichContacts, getApolloConfig } = require('../lib/apollo-client');
const { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, logWarn, isProduction } = require('../lib/api-helpers');
const { CACHE_TTL } = require('../lib/constants');
const { isCacheFresh } = require('../lib/cache-helpers');

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return sendErrorResponse(res, new Error('Method not allowed'), 405);
  }

  try {
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    const { contacts, forceRefresh } = req.body;

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return sendErrorResponse(res, new Error('Missing or invalid contacts array'), 400);
    }

    // Limit batch size to stay within rate limits
    // Apollo.io allows 50 calls/minute, so we'll process in smaller batches
    const MAX_BATCH_SIZE = 25; // Process 25 at a time to be safe
    const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

    if (contacts.length > MAX_BATCH_SIZE) {
      log(`Batch size ${contacts.length} exceeds max ${MAX_BATCH_SIZE}, processing in chunks`);
    }

    // Check cache for each contact (unless force refresh)
    const contactsToEnrich = [];
    const cachedResults = [];

    for (const contact of contacts) {
      const contactId = contact.contactId || contact.id;
      const salesforceContactId = contact.salesforceContactId || contact.salesforce_id;
      const linkedinURL = contact.linkedinURL || contact.linkedin_url;

      // Check cache if we have any identifier (contactId, salesforceContactId, or linkedinURL)
      if (!shouldForceRefresh && (contactId || salesforceContactId || linkedinURL)) {
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

        const { data: existingProfile } = await cacheQuery.limit(1).maybeSingle();

        if (existingProfile && isCacheFresh(existingProfile.last_synced_at, CACHE_TTL.CONTACTS)) {
          cachedResults.push({
            contact,
            success: true,
            profile: existingProfile,
            cached: true,
            source: 'apollo',
          });
          continue;
        }
      }

      contactsToEnrich.push(contact);
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

  } catch (error) {
    logError('Error in apollo-enrich-bulk function:', error);
    logError('Error stack:', error.stack);
    
    // Return graceful error instead of 500
    return sendSuccessResponse(res, {
      success: false,
      error: error.message || 'An error occurred while bulk enriching contacts with Apollo.io',
      message: 'Apollo.io bulk enrichment is not available. ' + (error.message || 'An error occurred.'),
      results: [],
    });
  }
}

