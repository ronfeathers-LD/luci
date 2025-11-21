/**
 * LinkedIn API Client Library
 * 
 * Handles LinkedIn API authentication and data fetching
 * Supports both basic profile data and MDP (Marketing Developer Platform) features
 */

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';

/**
 * Get LinkedIn API configuration from Supabase
 */
async function getLinkedInConfig(supabase) {
  const { data: config, error } = await supabase
    .from('linkedin_configs')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error || !config) {
    throw new Error('LinkedIn configuration not found. Please configure LinkedIn API credentials.');
  }

  return config;
}

/**
 * Get or refresh LinkedIn OAuth access token
 */
async function getAccessToken(supabase, config) {
  // Check if we have a valid token
  if (config.access_token && config.token_expires_at) {
    const expiresAt = new Date(config.token_expires_at);
    const now = new Date();
    
    // If token expires in more than 5 minutes, use it
    if (expiresAt > new Date(now.getTime() + 5 * 60 * 1000)) {
      return config.access_token;
    }

    // Token is expired or expiring soon - try to refresh
    if (config.refresh_token) {
      try {
        const refreshedToken = await refreshAccessToken(supabase, config);
        return refreshedToken;
      } catch (error) {
        console.error('Error refreshing LinkedIn token:', error);
        // Fall through to re-authentication
      }
    }
  }

  // No valid token - need to re-authenticate
  if (!config.access_token) {
    throw new Error('LinkedIn access token not available. Please authenticate via /api/linkedin-auth');
  }

  // Token exists but expired and no refresh token
  throw new Error('LinkedIn access token expired. Please re-authenticate via /api/linkedin-auth');
}

/**
 * Refresh LinkedIn access token using refresh token
 */
async function refreshAccessToken(supabase, config) {
  const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
  
  const tokenParams = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: config.refresh_token,
    client_id: config.client_id,
    client_secret: config.client_secret,
  });

  const tokenResponse = await fetch(LINKEDIN_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenParams.toString(),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`LinkedIn token refresh failed: ${errorText}`);
  }

  const tokenData = await tokenResponse.json();
  
  // Calculate token expiration
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + (tokenData.expires_in || 5184000)); // Default 60 days

  // Update tokens in database
  await supabase
    .from('linkedin_configs')
    .update({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token || config.refresh_token, // Keep existing if not provided
      token_expires_at: expiresAt.toISOString(),
      last_tested: new Date().toISOString(),
    })
    .eq('id', config.id);

  return tokenData.access_token;
}

/**
 * Make authenticated request to LinkedIn API
 */
async function linkedInRequest(endpoint, accessToken, options = {}) {
  const url = `${LINKEDIN_API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LinkedIn API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Get LinkedIn profile by URN
 * Requires: r_liteprofile or r_basicprofile scope
 */
async function getProfileByURN(supabase, linkedinURN) {
  const config = await getLinkedInConfig(supabase);
  const accessToken = await getAccessToken(supabase, config);

  try {
    // Get basic profile info
      const profile = await linkedInRequest(`/people/${linkedinURN}`, accessToken, {
      params: {
        projection: '(id,firstName,lastName,headline,profilePicture(displayImage~:playableStreams))'
      }
    });

    return profile;
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
    throw error;
  }
}

/**
 * Search for LinkedIn profile by name and company
 * Note: LinkedIn API has limited search capabilities
 * This is a placeholder - actual implementation depends on API access level
 */
async function searchProfile(supabase, firstName, lastName, companyName) {
  // LinkedIn API doesn't have a public search endpoint
  // This would typically require:
  // 1. Sales Navigator API (if available)
  // 2. Third-party enrichment service
  // 3. Manual profile URL collection
  
  throw new Error('LinkedIn profile search not available via API. Use profile URLs or third-party enrichment.');
}

/**
 * Get company page data
 * Requires: r_organization_social scope
 */
async function getCompanyPage(supabase, companyURN) {
  const config = await getLinkedInConfig(supabase);
  const accessToken = await getAccessToken(supabase, config);

  try {
    const company = await linkedInRequest(`/organizations/${companyURN}`, accessToken, {
      params: {
        projection: '(id,name,logoV2,description)'
      }
    });

    return company;
  } catch (error) {
    console.error('Error fetching LinkedIn company page:', error);
    throw error;
  }
}

/**
 * Get social metadata (reactions, comments, shares) for a post
 * Requires: MDP (Marketing Developer Platform) access
 */
async function getSocialMetadata(supabase, postURN) {
  const config = await getLinkedInConfig(supabase);
  const accessToken = await getAccessToken(supabase, config);

  try {
    // MDP Social Metadata API endpoint
    const metadata = await linkedInRequest(`/socialMetadata/${postURN}`, accessToken);
    return metadata;
  } catch (error) {
    // If MDP not available, return null (graceful degradation)
    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      console.warn('MDP access not available. Social metadata unavailable.');
      return null;
    }
    throw error;
  }
}

/**
 * Extract LinkedIn URN from profile URL
 * Example: https://www.linkedin.com/in/johndoe -> urn:li:person:123456
 */
function extractURNFromURL(profileURL) {
  if (!profileURL) return null;
  
  // If already a URN, return it
  if (profileURL.startsWith('urn:li:')) {
    return profileURL;
  }

  // Extract from URL - this is a simplified version
  // Actual implementation may need to fetch profile to get URN
  const match = profileURL.match(/linkedin\.com\/in\/([^\/\?]+)/);
  if (match) {
    // Note: We can't convert username to URN without API call
    // This is a placeholder - actual implementation needs API lookup
    return null;
  }

  return null;
}

/**
 * Enrich contact with LinkedIn data
 * This is a high-level function that orchestrates multiple API calls
 */
async function enrichContact(supabase, contact, linkedinURL) {
  try {
    // First, try to get URN from URL or database
    let linkedinURN = null;
    
    // Check if we already have this profile cached
    const { data: existingProfile } = await supabase
      .from('linkedin_profiles')
      .select('*')
      .eq('linkedin_url', linkedinURL)
      .single();

    if (existingProfile && existingProfile.linkedin_urn) {
      linkedinURN = existingProfile.linkedin_urn;
    } else {
      // Try to extract or fetch URN
      linkedinURN = extractURNFromURL(linkedinURL);
    }

    if (!linkedinURN) {
      // Can't proceed without URN
      return {
        success: false,
        error: 'LinkedIn URN not available. Profile URL lookup required.',
      };
    }

    // Fetch profile data
    const profile = await getProfileByURN(supabase, linkedinURN);

    // Save to database
    const profileData = {
      contact_id: contact.id,
      salesforce_contact_id: contact.salesforce_id,
      linkedin_url: linkedinURL,
      linkedin_urn: linkedinURN,
      first_name: profile.firstName?.localized?.en_US || profile.firstName,
      last_name: profile.lastName?.localized?.en_US || profile.lastName,
      headline: profile.headline?.localized?.en_US || profile.headline,
      profile_picture_url: profile.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier,
      last_synced_at: new Date().toISOString(),
    };

    // Upsert profile
    const { error: upsertError } = await supabase
      .from('linkedin_profiles')
      .upsert(profileData, {
        onConflict: 'linkedin_urn',
        ignoreDuplicates: false,
      });

    if (upsertError) {
      console.error('Error saving LinkedIn profile:', upsertError);
    }

    return {
      success: true,
      profile: profileData,
    };
  } catch (error) {
    console.error('Error enriching contact with LinkedIn:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  getLinkedInConfig,
  getAccessToken,
  refreshAccessToken,
  linkedInRequest,
  getProfileByURN,
  searchProfile,
  getCompanyPage,
  getSocialMetadata,
  extractURNFromURL,
  enrichContact,
};

