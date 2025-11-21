/**
 * Apollo.io API Client
 * 
 * Provides functions to enrich contacts using Apollo.io's API
 * Documentation: https://docs.apollo.io/
 */

const { log, logError, isProduction } = require('./api-helpers');

const APOLLO_API_BASE = 'https://api.apollo.io/api/v1';

/**
 * Get Apollo.io configuration from Supabase
 */
async function getApolloConfig(supabase) {
  if (!supabase) {
    throw new Error('Supabase client is required');
  }

  const { data, error } = await supabase
    .from('apollo_configs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle(); // Use maybeSingle() instead of single() to handle no rows gracefully

  if (error) {
    logError('Error fetching Apollo.io config:', error);
    throw new Error(`Apollo.io configuration error: ${error.message}`);
  }

  if (!data) {
    throw new Error('Apollo.io configuration not found. Please configure Apollo.io API key in Supabase.');
  }

  if (!data.api_key) {
    throw new Error('Apollo.io API key is missing in configuration.');
  }

  return data;
}

/**
 * Make authenticated request to Apollo.io API
 * Apollo.io uses API key in X-Api-Key header
 */
async function apolloRequest(endpoint, apiKey, options = {}) {
  const url = `${APOLLO_API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey, // Apollo.io uses X-Api-Key header
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    logError(`Apollo.io API error: ${response.status} ${response.statusText}`, { 
      endpoint, 
      url, 
      error: errorText 
    });
    throw new Error(`Apollo.io API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Enrich a contact using Apollo.io's people/match endpoint
 * 
 * @param {Object} supabase - Supabase client
 * @param {Object} contact - Contact object with email, firstName, lastName, linkedinURL, etc.
 * @returns {Object} Enrichment result with profile data
 */
async function enrichContact(supabase, contact) {
  try {
    const config = await getApolloConfig(supabase);
    
    if (!config || !config.api_key) {
      return {
        success: false,
        error: 'Apollo.io API key not configured',
      };
    }

    // Build match request - Apollo.io can match by email, LinkedIn URL, or name+company
    const matchData = {};
    
    if (contact.email) {
      matchData.email = contact.email;
    }
    
    if (contact.linkedinURL) {
      // Extract LinkedIn username from URL
      const linkedinMatch = contact.linkedinURL.match(/linkedin\.com\/in\/([^\/\?]+)/);
      if (linkedinMatch) {
        matchData.linkedin_url = contact.linkedinURL;
      }
    }
    
    if (contact.firstName && contact.lastName) {
      matchData.first_name = contact.firstName;
      matchData.last_name = contact.lastName;
    }
    
    if (contact.company || contact.accountName) {
      matchData.organization_name = contact.company || contact.accountName;
    }

    // If we don't have enough data to match, return error
    if (!matchData.email && !matchData.linkedin_url && (!matchData.first_name || !matchData.last_name)) {
      return {
        success: false,
        error: 'Insufficient data for Apollo.io matching. Need email, LinkedIn URL, or first name + last name + company',
      };
    }

    // Call Apollo.io people/match endpoint
    // Apollo.io API: POST /api/v1/people/match with X-Api-Key header
    log('Attempting Apollo.io enrichment with data:', { 
      hasEmail: !!matchData.email,
      hasLinkedIn: !!matchData.linkedin_url,
      hasName: !!(matchData.first_name && matchData.last_name),
      hasCompany: !!matchData.organization_name
    });
    
    const response = await apolloRequest('/people/match', config.api_key, {
      method: 'POST',
      body: matchData,
    });

    if (!response || !response.person) {
      return {
        success: false,
        error: 'No matching person found in Apollo.io',
      };
    }

    const person = response.person;
    const organization = person.organization || person.organization_name ? 
      (typeof person.organization === 'string' ? { name: person.organization } : person.organization) : null;

    // Extract employment history
    const employmentHistory = person.employment_history || person.work_experiences || [];
    const previousCompanies = employmentHistory
      .filter(emp => !emp.current && emp.company_name)
      .map(emp => emp.company_name)
      .filter(Boolean);
    const previousTitles = employmentHistory
      .filter(emp => !emp.current && emp.title)
      .map(emp => emp.title)
      .filter(Boolean);

    // Extract education
    const education = person.education || person.educations || [];

    // Extract social profiles
    const socialProfiles = {
      twitter: person.twitter_url || person.twitter || null,
      github: person.github_url || person.github || null,
      facebook: person.facebook_url || person.facebook || null,
    };

    // Extract personal contact info
    const personalEmails = person.personal_emails || [];
    const personalPhones = person.personal_phone_numbers || 
      (person.phone_numbers ? person.phone_numbers.map(p => p.raw_number || p.number).filter(Boolean) : []);

    // Extract technologies (from organization)
    const technologies = organization?.technologies || 
                        organization?.technology_names || 
                        person.technologies || 
                        [];

    // Calculate job change metrics
    const jobChangeDate = person.job_change_date || 
                         (employmentHistory.find(emp => emp.current)?.start_date);
    const jobChangedRecently = jobChangeDate ? 
      (new Date() - new Date(jobChangeDate)) < (90 * 24 * 60 * 60 * 1000) : false;
    const daysInCurrentRole = jobChangeDate ? 
      Math.floor((new Date() - new Date(jobChangeDate)) / (24 * 60 * 60 * 1000)) : null;

    // Map Apollo.io response to our linkedin_profiles format
    const profileData = {
      contact_id: contact.id || null,
      salesforce_contact_id: contact.salesforce_id || contact.salesforceContactId || null,
      linkedin_url: person.linkedin_url || contact.linkedinURL || null,
      linkedin_urn: person.linkedin_urn || null,
      first_name: person.first_name || contact.firstName || null,
      last_name: person.last_name || contact.lastName || null,
      headline: person.headline || person.title || null,
      current_title: person.title || person.headline || null,
      current_company: person.organization_name || organization?.name || person.company_name || contact.company || null,
      location: person.city || person.state || person.country ? 
        [person.city, person.state, person.country].filter(Boolean).join(', ') : null,
      profile_picture_url: person.profile_picture_url || null,
      // Contact Verification
      email_status: person.email_status || (person.email_verified ? 'verified' : 'unverified') || null,
      phone_status: person.phone_status || (person.phone_verified ? 'verified' : 'unverified') || null,
      email_verified: person.email_verified || person.email_status === 'verified' || false,
      phone_verified: person.phone_verified || person.phone_status === 'verified' || false,
      // Company Intelligence
      company_industry: organization?.industry || organization?.industry_tag || null,
      company_size: organization?.estimated_num_employees || organization?.employees || organization?.num_employees || null,
      company_revenue: organization?.annual_revenue || organization?.revenue || null,
      company_website_url: organization?.website_url || null,
      company_linkedin_url: organization?.linkedin_url || null,
      company_twitter_url: organization?.twitter_url || null,
      company_facebook_url: organization?.facebook_url || null,
      // Technographic Data
      company_technologies: Array.isArray(technologies) ? technologies : (technologies ? [technologies] : []),
      // Employment History
      previous_companies: previousCompanies,
      previous_titles: previousTitles,
      employment_history: employmentHistory.length > 0 ? employmentHistory : null,
      // Education
      education: education.length > 0 ? education : null,
      // Social Profiles
      twitter_url: socialProfiles.twitter,
      github_url: socialProfiles.github,
      facebook_url: socialProfiles.facebook,
      personal_emails: personalEmails.length > 0 ? personalEmails : null,
      personal_phone_numbers: personalPhones.length > 0 ? personalPhones : null,
      // Skills & Interests
      skills: person.skills || person.skill_list || [],
      interests: person.interests || [],
      languages: person.languages || person.language_list || [],
      // Buying Intent & Signals
      job_change_likelihood: person.job_change_likelihood || person.job_change_score || null,
      buying_signals: person.buying_signals || person.intent_signals || null,
      technology_adoptions: person.technology_adoptions || null,
      hiring_signals: person.hiring_signals || null,
      // Engagement Metrics
      email_open_rate: person.email_open_rate || null,
      email_click_rate: person.email_click_rate || null,
      response_rate: person.response_rate || null,
      last_contacted: person.last_contacted ? new Date(person.last_contacted).toISOString() : null,
      last_engaged: person.last_engaged ? new Date(person.last_engaged).toISOString() : null,
      // Job Change Metrics
      job_changed_recently: jobChangedRecently,
      days_in_current_role: daysInCurrentRole,
      // Store raw Apollo data for reference and future use
      apollo_raw_data: person,
      last_synced_at: new Date().toISOString(),
    };

    return {
      success: true,
      profile: profileData,
      source: 'apollo',
      raw_data: person, // Store raw Apollo data for reference
    };
  } catch (error) {
    logError('Error enriching contact with Apollo.io:', error);
    return {
      success: false,
      error: error.message || 'Apollo.io enrichment failed',
    };
  }
}

/**
 * Bulk enrich multiple contacts
 * 
 * @param {Object} supabase - Supabase client
 * @param {Array} contacts - Array of contact objects
 * @returns {Array} Array of enrichment results
 */
async function bulkEnrichContacts(supabase, contacts) {
  try {
    const config = await getApolloConfig(supabase);
    
    if (!config || !config.api_key) {
      return contacts.map(contact => ({
        contact,
        success: false,
        error: 'Apollo.io API key not configured',
      }));
    }

    // Apollo.io bulk_match endpoint
    const matchData = contacts.map(contact => {
      const match = {};
      if (contact.email) match.email = contact.email;
      if (contact.linkedinURL) {
        const linkedinMatch = contact.linkedinURL.match(/linkedin\.com\/in\/([^\/\?]+)/);
        if (linkedinMatch) match.linkedin_url = contact.linkedinURL;
      }
      if (contact.firstName) match.first_name = contact.firstName;
      if (contact.lastName) match.last_name = contact.lastName;
      if (contact.company || contact.accountName) {
        match.organization_name = contact.company || contact.accountName;
      }
      return match;
    });

    const response = await apolloRequest('/mixed_people/bulk_match', config.api_key, {
      method: 'POST',
      body: { people: matchData },
    });

    // Map results back to contacts
    return contacts.map((contact, index) => {
      const person = response.people?.[index];
      if (!person) {
        return {
          contact,
          success: false,
          error: 'No match found',
        };
      }

      const profileData = {
        contact_id: contact.id || null,
        salesforce_contact_id: contact.salesforce_id || contact.salesforceContactId || null,
        linkedin_url: person.linkedin_url || contact.linkedinURL || null,
        linkedin_urn: person.linkedin_urn || null,
        first_name: person.first_name || contact.firstName || null,
        last_name: person.last_name || contact.lastName || null,
        headline: person.headline || person.title || null,
        current_title: person.title || person.headline || null,
        current_company: person.organization_name || person.company_name || contact.company || null,
        location: person.city || person.state || person.country ? 
          [person.city, person.state, person.country].filter(Boolean).join(', ') : null,
        profile_picture_url: person.profile_picture_url || null,
        email: person.email || contact.email || null,
        phone_number: person.phone_numbers?.[0]?.raw_number || person.phone_number || null,
        job_changed_recently: person.job_change_date ? 
          (new Date() - new Date(person.job_change_date)) < (90 * 24 * 60 * 60 * 1000) : false,
        days_in_current_role: person.job_change_date ? 
          Math.floor((new Date() - new Date(person.job_change_date)) / (24 * 60 * 60 * 1000)) : null,
        last_synced_at: new Date().toISOString(),
      };

      return {
        contact,
        success: true,
        profile: profileData,
        source: 'apollo',
      };
    });
  } catch (error) {
    logError('Error bulk enriching contacts with Apollo.io:', error);
    return contacts.map(contact => ({
      contact,
      success: false,
      error: error.message || 'Apollo.io bulk enrichment failed',
    }));
  }
}

module.exports = {
  getApolloConfig,
  apolloRequest,
  enrichContact,
  bulkEnrichContacts,
};

