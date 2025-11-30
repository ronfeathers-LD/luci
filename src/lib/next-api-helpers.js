/**
 * Next.js API Route Helper Functions
 * 
 * Adapters for existing lib/api-helpers.js to work with Next.js
 * Can use require() for existing helpers
 */

import { NextResponse } from 'next/server';

// Import existing helpers (they work in Next.js via require)
// From src/lib/next-api-helpers.js -> up to src/ -> up to root/ -> lib/
const apiHelpers = require('../../lib/api-helpers');
const { MAX_REQUEST_SIZE, REQUEST_TIMEOUT, RATE_LIMIT } = require('../../lib/constants');

/**
 * Set CORS headers for Next.js Response
 */
export function setCORSHeaders(response, methods = ['GET', 'POST', 'OPTIONS']) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', methods.join(', '));
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

/**
 * Handle preflight OPTIONS requests for Next.js
 */
export async function handlePreflight(request) {
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    return setCORSHeaders(response);
  }
  return null;
}

/**
 * Validate request size for Next.js
 */
export function validateRequestSize(request, maxSize = MAX_REQUEST_SIZE.DEFAULT) {
  const contentLength = request.headers.get('content-length');
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
 * Send error response for Next.js
 */
export function sendErrorResponse(error, statusCode = 500) {
  const isProd = apiHelpers.isProduction();
  const sanitized = {
    error: isProd ? 'An error occurred' : (error?.message || 'An error occurred'),
    message: isProd ? 'Please try again later or contact support if the problem persists.' : (error?.message || 'An error occurred'),
  };
  
  if (!isProd && error?.stack) {
    sanitized.stack = error.stack;
  }
  
  const response = NextResponse.json(sanitized, { status: statusCode });
  return setCORSHeaders(response);
}

/**
 * Send success response for Next.js
 */
export function sendSuccessResponse(data, statusCode = 200) {
  const response = NextResponse.json(data, { status: statusCode });
  return setCORSHeaders(response);
}

/**
 * Get client IP from Next.js Request
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Validate Supabase client for Next.js
 */
export function validateSupabase(supabase) {
  if (!supabase) {
    return {
      valid: false,
      error: { status: 503, message: 'Database not configured' }
    };
  }
  return { valid: true };
}

/**
 * Check rate limit
 */
export function checkRateLimit(ip, windowMs, maxRequests) {
  return apiHelpers.checkRateLimit(ip, windowMs, maxRequests);
}

// Re-export other helpers
export const log = apiHelpers.log;
export const logError = apiHelpers.logError;
export const logWarn = apiHelpers.logWarn;
export const logDebug = apiHelpers.logDebug;
export const isProduction = apiHelpers.isProduction;

