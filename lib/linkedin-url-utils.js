/**
 * LinkedIn URL Utility Functions
 * 
 * Simple utilities for normalizing LinkedIn URLs from Salesforce contacts.
 * Note: We store LinkedIn URLs but do not use the LinkedIn API for enrichment.
 */

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

module.exports = {
  normalizeLinkedInURL,
};

