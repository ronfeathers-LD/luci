/**
 * Shared Cache Helper Functions
 * 
 * Common utilities for cache management
 */

const { CACHE_TTL } = require('./constants');
const { isCacheFresh } = require('./salesforce-client');

/**
 * Check if cache is fresh for a given resource type
 * 
 * @param {string|Date} lastSyncedAt - Last sync timestamp
 * @param {string} resourceType - Type of resource (ACCOUNTS, CASES, CONTACTS, etc.)
 * @returns {boolean} True if cache is fresh
 */
function isResourceCacheFresh(lastSyncedAt, resourceType) {
  const ttlHours = CACHE_TTL[resourceType] || CACHE_TTL.ACCOUNTS;
  return isCacheFresh(lastSyncedAt, ttlHours);
}

/**
 * Get cache TTL in milliseconds for a resource type
 * 
 * @param {string} resourceType - Type of resource
 * @returns {number} TTL in milliseconds
 */
function getCacheTTLMs(resourceType) {
  const ttlHours = CACHE_TTL[resourceType] || CACHE_TTL.ACCOUNTS;
  return ttlHours * 60 * 60 * 1000;
}

/**
 * Calculate cache age in milliseconds
 * 
 * @param {string|Date} lastSyncedAt - Last sync timestamp
 * @returns {number} Age in milliseconds, or null if invalid
 */
function getCacheAge(lastSyncedAt) {
  if (!lastSyncedAt) return null;
  
  const now = new Date();
  const lastSynced = new Date(lastSyncedAt);
  
  if (isNaN(lastSynced.getTime())) return null;
  
  return now - lastSynced;
}

module.exports = {
  isResourceCacheFresh,
  getCacheTTLMs,
  getCacheAge,
  CACHE_TTL,
};

