/**
 * Request Deduplication Utility
 * 
 * Prevents duplicate simultaneous API requests by caching in-flight requests
 * If the same request is made while one is already in progress, returns the existing promise
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
 * Deduplicated fetch - prevents duplicate simultaneous requests
 * 
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch promise (shared if duplicate request)
 */
function deduplicatedFetch(url, options = {}) {
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
 * Clear all pending requests (useful for cleanup or testing)
 */
function clearPendingRequests() {
  pendingRequests.clear();
}

// Export to window for use in components
window.deduplicatedFetch = deduplicatedFetch;
window.clearPendingRequests = clearPendingRequests;

