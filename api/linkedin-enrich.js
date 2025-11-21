/**
 * Vercel Serverless Function for LinkedIn Contact Enrichment
 * 
 * Enriches contacts with LinkedIn profile data using LinkedIn API
 * Requires LinkedIn OAuth access token (see LINKEDIN_SETUP.md)
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { enrichContact, getLinkedInConfig } = require('../lib/linkedin-client');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST and GET requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return res.status(503).json({
        error: 'Database not configured',
        message: 'The application database is not properly configured. Please contact your administrator.',
      });
    }

    // Get parameters
    const { linkedinURL, contactId, salesforceContactId, forceRefresh } = req.method === 'POST' 
      ? req.body 
      : req.query;

    if (!linkedinURL && !contactId && !salesforceContactId) {
      return res.status(400).json({ 
        error: 'Missing required parameter: linkedinURL, contactId, or salesforceContactId' 
      });
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
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      contact = contactData;
      linkedinURL = linkedinURL || contact.linkedin_url;
    }

    if (!linkedinURL) {
      return res.status(400).json({ error: 'LinkedIn URL is required' });
    }

    // Check if we already have enriched profile data (unless force refresh)
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
          if (process.env.NODE_ENV !== 'production') {
            console.log('Returning cached LinkedIn profile');
          }
          
          return res.status(200).json({
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
      const config = await getLinkedInConfig(supabase);
      
      if (!config.access_token) {
        // No access token - return URL only (enrichment requires OAuth)
        return res.status(200).json({
          success: true,
          linkedinURL: linkedinURL,
          message: 'LinkedIn OAuth not configured. Profile URL stored for future enrichment.',
          profile: null,
        });
      }

      // Attempt enrichment
      const enrichmentResult = await enrichContact(supabase, contact || { id: contactId }, linkedinURL);
      
      if (enrichmentResult.success) {
        // Fetch the enriched profile
        const { data: profile } = await supabase
          .from('linkedin_profiles')
          .select('*')
          .eq('linkedin_url', linkedinURL)
          .single();

        return res.status(200).json({
          success: true,
          profile: profile,
          cached: false,
        });
      } else {
        return res.status(200).json({
          success: false,
          linkedinURL: linkedinURL,
          error: enrichmentResult.error,
          message: 'LinkedIn enrichment attempted but failed. URL stored for future enrichment.',
        });
      }
    } catch (error) {
      // If enrichment fails (e.g., no OAuth token), just store the URL
      if (error.message && (error.message.includes('not found') || error.message.includes('not available') || error.message.includes('not configured'))) {
        return res.status(200).json({
          success: true,
          linkedinURL: linkedinURL,
          message: 'LinkedIn OAuth not configured. Profile URL stored for future enrichment.',
          profile: null,
        });
      }
      
      console.error('Error enriching LinkedIn profile:', error);
      console.error('Error stack:', error.stack);
      
      // Return a graceful error instead of 500
      return res.status(200).json({
        success: false,
        linkedinURL: linkedinURL,
        error: error.message || 'LinkedIn enrichment failed',
        message: 'LinkedIn enrichment is not available. Profile URL stored for future enrichment.',
        profile: null,
      });
    }

  } catch (error) {
    console.error('Error in linkedin-enrich function:', error);
    console.error('Error stack:', error.stack);
    
    // Return graceful error instead of 500 to prevent UI errors
    return res.status(200).json({
      success: false,
      linkedinURL: linkedinURL || null,
      error: error.message || 'An error occurred while enriching LinkedIn profile',
      message: 'LinkedIn enrichment is not available. Profile URL stored for future enrichment.',
      profile: null,
    });
  }
}

