/**
 * Shared API Helper Functions
 * 
 * Common utilities for Vercel serverless functions
 */

const { MAX_REQUEST_SIZE, REQUEST_TIMEOUT } = require('./constants');

/**
 * Set standard CORS headers
 */
function setCORSHeaders(res, methods = ['GET', 'POST', 'OPTIONS']) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Handle preflight OPTIONS requests
 */
function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    setCORSHeaders(res);
    return res.status(200).end();
  }
  return false;
}

/**
 * Validate request size
 */
function validateRequestSize(req, maxSize = MAX_REQUEST_SIZE.DEFAULT) {
  const contentLength = req.headers['content-length'];
  if (contentLength && parseInt(contentLength) > maxSize) {
    return {
      valid: false,
      error: {
        status: 413,
        message: 'Request too large',
      },
    };
  }
  return { valid: true };
}

/**
 * Sanitize error message for production
 */
function sanitizeError(error, isProduction = false) {
  if (isProduction) {
    // In production, don't expose internal error details
    return {
      error: 'An error occurred',
      message: 'Please try again later or contact support if the problem persists.',
    };
  }
  
  // In development, return full error details
  return {
    error: error.message || 'An error occurred',
    message: error.message,
    stack: error.stack,
  };
}

/**
 * Standard error response
 */
function sendErrorResponse(res, error, statusCode = 500, isProduction = false) {
  setCORSHeaders(res);
  const sanitized = sanitizeError(error, isProduction);
  return res.status(statusCode).json(sanitized);
}

/**
 * Standard success response
 */
function sendSuccessResponse(res, data, statusCode = 200) {
  setCORSHeaders(res);
  return res.status(statusCode).json(data);
}

/**
 * Get client IP address from request
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         'unknown';
}

/**
 * Validate Supabase client and return error response if invalid
 * 
 * @param {Object|null} supabase - Supabase client instance
 * @param {Object} res - Express response object
 * @returns {boolean} True if valid, false if invalid (response already sent)
 */
function validateSupabase(supabase, res) {
  if (!supabase) {
    sendErrorResponse(res, new Error('Database not configured'), 503, isProduction());
    return false;
  }
  return true;
}

/**
 * Check if environment is production
 */
function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Conditional logging (only in non-production)
 */
function log(...args) {
  if (!isProduction()) {
    console.log(...args);
  }
}

function logError(...args) {
  console.error(...args);
}

function logWarn(...args) {
  if (!isProduction()) {
    console.warn(...args);
  }
}

/**
 * Simple in-memory rate limiter
 * For production, use Redis or similar distributed store
 */
const rateLimitStore = new Map();

function checkRateLimit(ip, windowMs, maxRequests) {
  const now = Date.now();
  const key = ip;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const record = rateLimitStore.get(key);
  
  // Reset if window expired
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return true;
  }
  
  // Check if limit exceeded
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// Clean up old entries periodically
const { RATE_LIMIT } = require('./constants');
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT.WINDOW);

module.exports = {
  setCORSHeaders,
  handlePreflight,
  validateRequestSize,
  sanitizeError,
  sendErrorResponse,
  sendSuccessResponse,
  getClientIP,
  validateSupabase,
  checkRateLimit,
  isProduction,
  log,
  logError,
  logWarn,
};

