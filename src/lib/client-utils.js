/**
 * Client Utilities for Next.js
 * 
 * Provides client-side utilities that replace window.* globals
 * Can be imported in components
 */

/**
 * Request deduplication map (in-memory, shared across components)
 */
const pendingRequests = new Map();

/**
 * Generate a cache key from request parameters
 */
function getRequestKey(url, options = {}) {
  const method = options.method || 'GET';
  const body = options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : '';
  return `${method}:${url}:${body}`;
}

/**
 * Deduplicated fetch wrapper
 * Prevents duplicate simultaneous requests by caching in-flight requests
 */
export function deduplicatedFetch(url, options = {}) {
  // Use existing window implementation if available (for backwards compatibility)
  if (typeof window !== 'undefined' && window.deduplicatedFetch && window.deduplicatedFetch !== deduplicatedFetch) {
    return window.deduplicatedFetch(url, options);
  }
  
  const key = getRequestKey(url, options);
  
  // If request is already in progress, return the existing promise
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }
  
  // Create new request
  const requestPromise = fetch(url, options)
    .then(response => {
      // Remove from pending after a short delay to allow for rapid re-requests
      setTimeout(() => {
        pendingRequests.delete(key);
      }, 100);
      return response;
    })
    .catch(error => {
      // Remove from pending on error
      pendingRequests.delete(key);
      throw error;
    });
  
  pendingRequests.set(key, requestPromise);
  return requestPromise;
}

/**
 * Logging utilities
 */
export function logError(message, error, ...args) {
  if (typeof window !== 'undefined' && window.logError) {
    return window.logError(message, error, ...args);
  }
  console.error(message, error, ...args);
}

export function log(message, ...args) {
  if (typeof window !== 'undefined' && window.log) {
    return window.log(message, ...args);
  }
  console.log(message, ...args);
}

export function logWarn(message, ...args) {
  if (typeof window !== 'undefined' && window.logWarn) {
    return window.logWarn(message, ...args);
  }
  console.warn(message, ...args);
}

/**
 * Analytics utilities
 */
export function trackAnalytics(event, data) {
  if (typeof window !== 'undefined' && window.analytics) {
    return window.analytics.track(event, data);
  }
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Analytics] Track:', event, data);
  }
}

export function pageView(page) {
  if (typeof window !== 'undefined' && window.analytics) {
    return window.analytics.pageView(page);
  }
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Analytics] Page View:', page);
  }
}

/**
 * Supabase client (if needed on client)
 */
export function getSupabaseClient() {
  if (typeof window !== 'undefined' && window.supabase) {
    return window.supabase;
  }
  throw new Error('Supabase client not available. Make sure it\'s initialized.');
}

/**
 * Contact level categorization
 */
export function categorizeContactLevel(title) {
  if (!title) return 'Other';
  
  const titleLower = title.toLowerCase();
  
  // C-Level executives
  const cLevelPatterns = [
    /^chief/i, /^c\s*[-.]?\s*level/i, /^c\s*[-.]?\s*suite/i,
    /president/i, /^ceo/i, /^cto/i, /^cfo/i, /^coo/i, /^cmo/i, /^chro/i,
    /^chief\s+executive/i, /^chief\s+technology/i, /^chief\s+financial/i,
    /^chief\s+operating/i, /^chief\s+marketing/i, /^chief\s+human/i
  ];
  
  // Senior Level (VP, SVP, Director, etc.)
  const srLevelPatterns = [
    /^vice\s+president/i, /^vp/i, /^svp/i, /^evp/i,
    /^senior\s+vice\s+president/i, /^executive\s+vice\s+president/i,
    /^director/i, /^senior\s+director/i, /^executive\s+director/i,
    /^head\s+of/i, /^general\s+manager/i, /^gm\b/i
  ];
  
  // Check C-Level first
  if (cLevelPatterns.some(pattern => pattern.test(titleLower))) {
    return 'C-Level';
  }
  
  // Check Senior Level
  if (srLevelPatterns.some(pattern => pattern.test(titleLower))) {
    return 'Sr. Level';
  }
  
  return 'Other';
}

/**
 * Format currency value
 */
export function formatCurrency(value) {
  if (!value || value === 'N/A' || value === null || value === undefined) {
    return 'N/A';
  }
  
  // If it's already a formatted string with $, return as is
  if (typeof value === 'string' && value.includes('$')) {
    return value;
  }
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return value; // Return original if not a number
  }
  
  // Format as US currency
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}

/**
 * Get build version for cache busting
 */
export function getBuildVersion() {
  if (typeof window === 'undefined') return 'unknown';
  const htmlTag = document.documentElement;
  return htmlTag.getAttribute('data-build-version') || 
         document.querySelector('meta[name="build-version"]')?.content || 
         'unknown';
}

/**
 * Check if in production environment
 */
export function isProduction() {
  if (typeof window === 'undefined') return false;
  return window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
}

