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
 * Get LinkedIn profile using OpenID Connect userinfo endpoint
 * Requires: openid profile email scopes
 */
async function getProfileByOpenIDConnect(supabase, accessToken) {
  try {
    // OpenID Connect userinfo endpoint
    const userinfoUrl = 'https://api.linkedin.com/v2/userinfo';
    
    const response = await fetch(userinfoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn userinfo API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const userinfo = await response.json();
    return userinfo;
  } catch (error) {
    console.error('Error fetching LinkedIn profile via OpenID Connect:', error);
    throw error;
  }
}

/**
 * Get LinkedIn profile by URN (legacy v2 API - may not work with OpenID Connect)
 * Requires: r_liteprofile or r_basicprofile scope (deprecated)
 * 
 * Note: With OpenID Connect, we should use getProfileByOpenIDConnect instead
 */
async function getProfileByURN(supabase, linkedinURN) {
  const config = await getLinkedInConfig(supabase);
  const accessToken = await getAccessToken(supabase, config);

  try {
    // Try OpenID Connect userinfo endpoint first (works with openid profile email scopes)
    try {
      const userinfo = await getProfileByOpenIDConnect(supabase, accessToken);
      console.log('[LinkedIn] Successfully fetched profile via OpenID Connect userinfo');
      return userinfo;
    } catch (openidError) {
      console.warn('[LinkedIn] OpenID Connect userinfo failed, trying legacy v2 API:', openidError.message);
      
      // Fallback to legacy v2 API (may not work with OpenID Connect scopes)
      const profile = await linkedInRequest(`/people/${linkedinURN}`, accessToken, {
        params: {
          projection: '(id,firstName,lastName,headline,profilePicture(displayImage~:playableStreams))'
        }
      });

      return profile;
    }
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
 * Normalize LinkedIn URL to full format
 * Handles incomplete URLs like "in/username" or "/in/username"
 * Returns full URL: https://www.linkedin.com/in/username
 */
function normalizeLinkedInURL(url) {
  if (!url || typeof url !== 'string') return null;
  
  // Trim whitespace
  url = url.trim();
  
  // If already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a URN, return as is
  if (url.startsWith('urn:li:')) {
    return url;
  }
  
  // Handle incomplete URLs
  // Remove leading slash if present
  if (url.startsWith('/')) {
    url = url.substring(1);
  }
  
  // If it starts with "in/", add the domain
  if (url.startsWith('in/')) {
    return `https://www.linkedin.com/${url}`;
  }
  
  // If it's just a username (no "in/" prefix), add it
  if (!url.includes('/') && !url.includes('linkedin.com')) {
    return `https://www.linkedin.com/in/${url}`;
  }
  
  // If it contains linkedin.com but no protocol, add https://
  if (url.includes('linkedin.com') && !url.startsWith('http')) {
    return `https://${url}`;
  }
  
  // Default: assume it's a profile path and add domain
  if (url.startsWith('www.linkedin.com')) {
    return `https://${url}`;
  }
  
  // If we can't normalize it, return null
  return null;
}

/**
 * Extract LinkedIn URN from profile URL
 * Example: https://www.linkedin.com/in/johndoe -> urn:li:person:123456
 */
function extractURNFromURL(profileURL) {
  if (!profileURL) return null;
  
  // Normalize URL first
  const normalizedURL = normalizeLinkedInURL(profileURL);
  if (!normalizedURL) return null;
  
  // If already a URN, return it
  if (normalizedURL.startsWith('urn:li:')) {
    return normalizedURL;
  }

  // Extract from URL - this is a simplified version
  // Actual implementation may need to fetch profile to get URN
  const match = normalizedURL.match(/linkedin\.com\/in\/([^\/\?]+)/);
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
 * 
 * Note: With OpenID Connect, we can only get the authenticated user's profile.
 * For other profiles, we'd need different API access or third-party enrichment.
 */
async function enrichContact(supabase, contact, linkedinURL) {
  try {
    // Normalize LinkedIn URL first
    const normalizedURL = normalizeLinkedInURL(linkedinURL);
    if (!normalizedURL) {
      return {
        success: false,
        error: 'Invalid LinkedIn URL format',
      };
    }
    
    const config = await getLinkedInConfig(supabase);
    const accessToken = await getAccessToken(supabase, config);
    
    // With OpenID Connect, we can only get the authenticated user's profile via userinfo
    // For other profiles (from URLs), we need a different approach
    // For now, we'll try to use the userinfo endpoint to get basic profile data
    // This will only work if the contact's LinkedIn URL matches the authenticated user
    
    try {
      // Try OpenID Connect userinfo endpoint
      const userinfo = await getProfileByOpenIDConnect(supabase, accessToken);
      
      console.log('[LinkedIn Enrich] Got userinfo via OpenID Connect:', userinfo.sub ? 'Success' : 'No sub');
      
      // Map OpenID Connect userinfo to our profile format
      const profileData = {
        contact_id: contact?.id || null,
        salesforce_contact_id: contact?.salesforce_id || null,
        linkedin_url: normalizedURL,
        linkedin_urn: userinfo.sub || null, // OpenID Connect subject identifier
        first_name: userinfo.given_name || null,
        last_name: userinfo.family_name || null,
        email: userinfo.email || null,
        name: userinfo.name || null,
        picture: userinfo.picture || null,
        // Map additional fields if available
        current_title: null, // Not available in basic OpenID Connect userinfo
        current_company: null, // Not available in basic OpenID Connect userinfo
        last_synced_at: new Date().toISOString(),
      };
      
        // Upsert profile (use normalized URL for consistency)
        const { error: upsertError } = await supabase
          .from('linkedin_profiles')
          .upsert(profileData, {
            onConflict: 'linkedin_url',
            ignoreDuplicates: false,
          });

      if (upsertError) {
        console.error('Error saving LinkedIn profile:', upsertError);
      }

      return {
        success: true,
        profile: profileData,
      };
    } catch (openidError) {
      console.warn('[LinkedIn Enrich] OpenID Connect userinfo failed:', openidError.message);
      
      // Fallback: Try to get URN and use legacy API (may not work)
      let linkedinURN = null;
      
      // Check if we already have this profile cached (using normalized URL)
      const { data: existingProfile } = await supabase
        .from('linkedin_profiles')
        .select('*')
        .eq('linkedin_url', normalizedURL)
        .single();

      if (existingProfile && existingProfile.linkedin_urn) {
        linkedinURN = existingProfile.linkedin_urn;
      } else {
        linkedinURN = extractURNFromURL(normalizedURL);
      }

      if (!linkedinURN) {
        return {
          success: false,
          error: 'LinkedIn URN not available. OpenID Connect can only fetch authenticated user profile.',
        };
      }

      // Try legacy v2 API (may not work with OpenID Connect scopes)
      try {
        const profile = await getProfileByURN(supabase, linkedinURN);

        // Save to database (legacy v2 API format)
        const profileData = {
          contact_id: contact?.id || null,
          salesforce_contact_id: contact?.salesforce_id || null,
          linkedin_url: normalizedURL,
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
      } catch (legacyError) {
        console.warn('[LinkedIn Enrich] Legacy API also failed:', legacyError.message);
        // If both OpenID Connect and legacy API fail, return error
        return {
          success: false,
          error: 'LinkedIn profile enrichment failed. OpenID Connect can only fetch authenticated user profile.',
        };
      }
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
  normalizeLinkedInURL,
  extractURNFromURL,
  enrichContact,
};

