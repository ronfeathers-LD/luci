/**
 * Shared Constants
 * 
 * Centralized constants used across the application
 */

// Request limits
const MAX_REQUEST_SIZE = {
  DEFAULT: 1024 * 1024, // 1MB
  LARGE: 10 * 1024 * 1024, // 10MB (for sentiment analysis)
};

// Timeouts
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Rate limiting
const RATE_LIMIT = {
  WINDOW: 60 * 1000, // 1 minute
  MAX_REQUESTS: 10, // 10 requests per minute per IP
};

// Cache TTL (in hours)
const CACHE_TTL = {
  ACCOUNTS: 1, // 1 hour
  CASES: 1, // 1 hour
  CONTACTS: 24, // 24 hours
  TRANSCRIPTIONS: 24, // 24 hours
  LINKEDIN_PROFILES: 24, // 24 hours
};

// API Limits
const API_LIMITS = {
  CASES_PER_ACCOUNT: 25,
  CONTACTS_PER_ACCOUNT: 100,
  ACCOUNTS_PER_USER: 1000,
};

module.exports = {
  MAX_REQUEST_SIZE,
  REQUEST_TIMEOUT,
  RATE_LIMIT,
  CACHE_TTL,
  API_LIMITS,
};

