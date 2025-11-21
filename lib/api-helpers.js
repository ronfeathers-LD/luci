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

module.exports = {
  setCORSHeaders,
  handlePreflight,
  validateRequestSize,
  sanitizeError,
  sendErrorResponse,
  sendSuccessResponse,
  getClientIP,
  isProduction,
  log,
  logError,
  logWarn,
};

