module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/supabase-server.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Server-side Supabase Client for Next.js
 * Uses the same logic as lib/supabase-client.js but as ES module
 */ __turbopack_context__.s([
    "getSupabaseClient",
    ()=>getSupabaseClient,
    "validateSupabase",
    ()=>validateSupabase
]);
function getSupabaseClient() {
    try {
        const { createClient } = __turbopack_context__.r("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-route] (ecmascript)");
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (supabaseUrl && supabaseServiceKey) {
            return createClient(supabaseUrl, supabaseServiceKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            });
        }
    } catch (error) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn('Supabase client not available:', error.message);
        }
    }
    return null;
}
function validateSupabase(supabase) {
    if (!supabase) {
        return {
            valid: false,
            error: {
                status: 503,
                message: 'Database not configured'
            }
        };
    }
    return {
        valid: true
    };
}
}),
"[project]/src/lib/next-api-helpers.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Next.js API Route Helper Functions
 * 
 * Adapters for existing lib/api-helpers.js to work with Next.js
 * Can use require() for existing helpers
 */ __turbopack_context__.s([
    "checkRateLimit",
    ()=>checkRateLimit,
    "getClientIP",
    ()=>getClientIP,
    "handlePreflight",
    ()=>handlePreflight,
    "isProduction",
    ()=>isProduction,
    "log",
    ()=>log,
    "logDebug",
    ()=>logDebug,
    "logError",
    ()=>logError,
    "logWarn",
    ()=>logWarn,
    "sendErrorResponse",
    ()=>sendErrorResponse,
    "sendSuccessResponse",
    ()=>sendSuccessResponse,
    "setCORSHeaders",
    ()=>setCORSHeaders,
    "validateRequestSize",
    ()=>validateRequestSize,
    "validateSupabase",
    ()=>validateSupabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// Import existing helpers (they work in Next.js via require)
const apiHelpers = (()=>{
    const e = new Error("Cannot find module '../../../lib/api-helpers'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const { MAX_REQUEST_SIZE, REQUEST_TIMEOUT, RATE_LIMIT } = (()=>{
    const e = new Error("Cannot find module '../../../lib/constants'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
function setCORSHeaders(response, methods = [
    'GET',
    'POST',
    'OPTIONS'
]) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', methods.join(', '));
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
}
async function handlePreflight(request) {
    if (request.method === 'OPTIONS') {
        const response = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
            status: 200
        });
        return setCORSHeaders(response);
    }
    return null;
}
function validateRequestSize(request, maxSize = MAX_REQUEST_SIZE.DEFAULT) {
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > maxSize) {
        return {
            valid: false,
            error: {
                status: 413,
                message: 'Request too large'
            }
        };
    }
    return {
        valid: true
    };
}
function sendErrorResponse(error, statusCode = 500) {
    const isProd = apiHelpers.isProduction();
    const sanitized = {
        error: isProd ? 'An error occurred' : error?.message || 'An error occurred',
        message: isProd ? 'Please try again later or contact support if the problem persists.' : error?.message || 'An error occurred'
    };
    if (!isProd && error?.stack) {
        sanitized.stack = error.stack;
    }
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(sanitized, {
        status: statusCode
    });
    return setCORSHeaders(response);
}
function sendSuccessResponse(data, statusCode = 200) {
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
        status: statusCode
    });
    return setCORSHeaders(response);
}
function getClientIP(request) {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return request.headers.get('x-real-ip') || 'unknown';
}
function validateSupabase(supabase) {
    if (!supabase) {
        return {
            valid: false,
            error: {
                status: 503,
                message: 'Database not configured'
            }
        };
    }
    return {
        valid: true
    };
}
function checkRateLimit(ip, windowMs, maxRequests) {
    return apiHelpers.checkRateLimit(ip, windowMs, maxRequests);
}
const log = apiHelpers.log;
const logError = apiHelpers.logError;
const logWarn = apiHelpers.logWarn;
const logDebug = apiHelpers.logDebug;
const isProduction = apiHelpers.isProduction;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[externals]/node:process [external] (node:process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:process", () => require("node:process"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[project]/lib/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Shared Constants
 * 
 * Centralized constants used across the application
 */ // Request limits
const MAX_REQUEST_SIZE = {
    DEFAULT: 1024 * 1024,
    LARGE: 10 * 1024 * 1024
};
// Timeouts
const REQUEST_TIMEOUT = 30000; // 30 seconds
// Rate limiting
const RATE_LIMIT = {
    WINDOW: 60 * 1000,
    MAX_REQUESTS: 10
};
// Cache TTL (in hours, except CALENDAR_EVENTS which is in minutes)
const CACHE_TTL = {
    ACCOUNTS: 1,
    CASES: 1,
    CONTACTS: 24,
    TRANSCRIPTIONS: 24,
    LINKEDIN_PROFILES: 24,
    CALENDAR_EVENTS: 15
};
// API Limits
const API_LIMITS = {
    CASES_PER_ACCOUNT: 25,
    CONTACTS_PER_ACCOUNT: 100,
    ACCOUNTS_PER_USER: 1000
};
module.exports = {
    MAX_REQUEST_SIZE,
    REQUEST_TIMEOUT,
    RATE_LIMIT,
    CACHE_TTL,
    API_LIMITS
};
}),
"[project]/lib/api-helpers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Shared API Helper Functions
 * 
 * Common utilities for Vercel serverless functions
 */ const { MAX_REQUEST_SIZE, REQUEST_TIMEOUT } = __turbopack_context__.r("[project]/lib/constants.js [app-route] (ecmascript)");
/**
 * Set standard CORS headers
 */ function setCORSHeaders(res, methods = [
    'GET',
    'POST',
    'OPTIONS'
]) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
/**
 * Handle preflight OPTIONS requests
 */ function handlePreflight(req, res) {
    if (req.method === 'OPTIONS') {
        setCORSHeaders(res);
        return res.status(200).end();
    }
    return false;
}
/**
 * Validate request size
 */ function validateRequestSize(req, maxSize = MAX_REQUEST_SIZE.DEFAULT) {
    const contentLength = req.headers['content-length'];
    if (contentLength && parseInt(contentLength) > maxSize) {
        return {
            valid: false,
            error: {
                status: 413,
                message: 'Request too large'
            }
        };
    }
    return {
        valid: true
    };
}
/**
 * Sanitize error message for production
 */ function sanitizeError(error, isProduction = false) {
    if (isProduction) {
        // In production, don't expose internal error details
        return {
            error: 'An error occurred',
            message: 'Please try again later or contact support if the problem persists.'
        };
    }
    // In development, return full error details
    return {
        error: error.message || 'An error occurred',
        message: error.message,
        stack: error.stack
    };
}
/**
 * Standard error response
 */ function sendErrorResponse(res, error, statusCode = 500, isProduction = false) {
    setCORSHeaders(res);
    const sanitized = sanitizeError(error, isProduction);
    return res.status(statusCode).json(sanitized);
}
/**
 * Standard success response
 */ function sendSuccessResponse(res, data, statusCode = 200) {
    setCORSHeaders(res);
    return res.status(statusCode).json(data);
}
/**
 * Get client IP address from request
 */ function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || req.connection?.remoteAddress || 'unknown';
}
/**
 * Validate Supabase client and return error response if invalid
 * 
 * @param {Object|null} supabase - Supabase client instance
 * @param {Object} res - Express response object
 * @returns {boolean} True if valid, false if invalid (response already sent)
 */ function validateSupabase(supabase, res) {
    if (!supabase) {
        sendErrorResponse(res, new Error('Database not configured'), 503, isProduction());
        return false;
    }
    return true;
}
/**
 * Check if environment is production
 */ function isProduction() {
    return ("TURBOPACK compile-time value", "development") === 'production';
}
/**
 * Structured logging with levels
 */ function formatLog(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}
/**
 * Info log (only in non-production)
 */ function log(message, data = null) {
    if (!isProduction()) {
        if (data) {
            console.log(formatLog('info', message), data);
        } else {
            console.log(formatLog('info', message));
        }
    }
}
/**
 * Error log (always logs, even in production)
 */ function logError(message, error = null) {
    if (error) {
        console.error(formatLog('error', message), error);
    } else {
        console.error(formatLog('error', message));
    }
}
/**
 * Warning log (only in non-production)
 */ function logWarn(message, data = null) {
    if (!isProduction()) {
        if (data) {
            console.warn(formatLog('warn', message), data);
        } else {
            console.warn(formatLog('warn', message));
        }
    }
}
/**
 * Debug log (only in non-production, for verbose debugging)
 */ function logDebug(message, data = null) {
    if (!isProduction() && process.env.DEBUG === 'true') {
        if (data) {
            console.log(formatLog('debug', message), data);
        } else {
            console.log(formatLog('debug', message));
        }
    }
}
/**
 * Simple in-memory rate limiter
 * For production, use Redis or similar distributed store
 */ const rateLimitStore = new Map();
function checkRateLimit(ip, windowMs, maxRequests) {
    const now = Date.now();
    const key = ip;
    if (!rateLimitStore.has(key)) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs
        });
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
const { RATE_LIMIT } = __turbopack_context__.r("[project]/lib/constants.js [app-route] (ecmascript)");
setInterval(()=>{
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()){
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
    logDebug
};
}),
"[project]/lib/google-calendar-client.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Google Calendar API Client Library
 * 
 * Handles Google Calendar API authentication and data fetching
 * Uses per-user OAuth tokens stored in database
 */ const { google } = __turbopack_context__.r("[project]/node_modules/googleapis/build/src/index.js [app-route] (ecmascript)");
/**
 * Get Google Calendar OAuth configuration from environment
 * Uses existing GOOGLE_CLIENT_ID if GOOGLE_CALENDAR_CLIENT_ID is not set
 */ function getGoogleCalendarConfig() {
    // Try GOOGLE_CALENDAR_CLIENT_ID first, fallback to GOOGLE_CLIENT_ID (for reusing existing OAuth client)
    // Trim whitespace to prevent issues with environment variable formatting
    const clientId = (process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '').trim();
    // Try GOOGLE_CALENDAR_CLIENT_SECRET first, fallback to GOOGLE_CLIENT_SECRET
    const clientSecret = (process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || '').trim();
    const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI ? process.env.GOOGLE_CALENDAR_REDIRECT_URI.trim() : undefined;
    if (!clientId || !clientSecret) {
        throw new Error('Google Calendar OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (or GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET) environment variables.');
    }
    // Validate that clientId is an OAuth Client ID, not an API key
    // OAuth Client IDs end with .apps.googleusercontent.com
    // API keys start with AIza
    if (clientId.startsWith('AIza')) {
        throw new Error(`Invalid OAuth Client ID format. The value "${clientId.substring(0, 20)}..." appears to be an API key, not an OAuth Client ID. OAuth Client IDs should end with ".apps.googleusercontent.com". Please check your GOOGLE_CLIENT_ID or GOOGLE_CALENDAR_CLIENT_ID environment variable.`);
    }
    if (!clientId.includes('.apps.googleusercontent.com')) {
        throw new Error(`Invalid OAuth Client ID format. The Client ID should end with ".apps.googleusercontent.com". Got: "${clientId.substring(0, 30)}...". Please check your GOOGLE_CLIENT_ID or GOOGLE_CALENDAR_CLIENT_ID environment variable.`);
    }
    return {
        clientId,
        clientSecret,
        redirectUri: redirectUri || 'http://localhost:3000/api/google-calendar'
    };
}
/**
 * Create OAuth2 client for Google Calendar
 */ function createOAuth2Client(config = null) {
    const cfg = config || getGoogleCalendarConfig();
    // Ensure redirectUri is set
    const redirectUri = cfg.redirectUri || 'http://localhost:3000/api/google-calendar';
    const oauth2Client = new google.auth.OAuth2(cfg.clientId, cfg.clientSecret, redirectUri);
    return oauth2Client;
}
/**
 * Get user's Google Calendar token from database
 */ async function getUserCalendarToken(supabase, userId) {
    const { data: tokenData, error } = await supabase.from('google_calendar_tokens').select('*').eq('user_id', userId).eq('is_active', true).single();
    if (error || !tokenData) {
        return null;
    }
    return tokenData;
}
/**
 * Get or refresh Google Calendar access token for a user
 */ async function getAccessToken(supabase, userId) {
    const tokenData = await getUserCalendarToken(supabase, userId);
    if (!tokenData) {
        throw new Error('Google Calendar not authorized. Please authorize via /api/google-calendar');
    }
    // Check if token is expired or expiring soon (within 5 minutes)
    if (tokenData.token_expires_at) {
        const expiresAt = new Date(tokenData.token_expires_at);
        const now = new Date();
        const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
        if (expiresAt <= fiveMinutesFromNow) {
            // Token expired or expiring soon - try to refresh
            if (tokenData.refresh_token) {
                try {
                    const refreshedToken = await refreshAccessToken(supabase, userId, tokenData);
                    return refreshedToken;
                } catch (error) {
                    const { logError } = __turbopack_context__.r("[project]/lib/api-helpers.js [app-route] (ecmascript)");
                    logError('Error refreshing Google Calendar token', error);
                    throw new Error('Google Calendar access token expired and refresh failed. Please re-authorize.');
                }
            } else {
                throw new Error('Google Calendar access token expired and no refresh token available. Please re-authorize.');
            }
        }
    }
    return tokenData.access_token;
}
/**
 * Refresh Google Calendar access token using refresh token
 */ async function refreshAccessToken(supabase, userId, tokenData) {
    const config = getGoogleCalendarConfig();
    const oauth2Client = createOAuth2Client(config);
    oauth2Client.setCredentials({
        refresh_token: tokenData.refresh_token
    });
    try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        // Calculate token expiration
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + (credentials.expiry_date ? Math.floor((credentials.expiry_date - Date.now()) / 1000) : 3600));
        // Update token in database
        const { error: updateError } = await supabase.from('google_calendar_tokens').update({
            access_token: credentials.access_token,
            refresh_token: credentials.refresh_token || tokenData.refresh_token,
            token_expires_at: expiresAt.toISOString(),
            last_tested: new Date().toISOString()
        }).eq('user_id', userId);
        if (updateError) {
            throw new Error(`Failed to update token: ${updateError.message}`);
        }
        return credentials.access_token;
    } catch (error) {
        const { logError } = __turbopack_context__.r("[project]/lib/api-helpers.js [app-route] (ecmascript)");
        logError('Error refreshing Google Calendar token', error);
        throw error;
    }
}
/**
 * Get authenticated Google Calendar API client for a user
 */ async function getCalendarClient(supabase, userId) {
    const accessToken = await getAccessToken(supabase, userId);
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({
        access_token: accessToken
    });
    return google.calendar({
        version: 'v3',
        auth: oauth2Client
    });
}
/**
 * Fetch upcoming calendar events for a user
 */ async function fetchUpcomingEvents(supabase, userId, options = {}) {
    const { maxResults = 50, timeMin = new Date().toISOString(), timeMax = null, calendarId = 'primary' } = options;
    // Default to 7 days from now if timeMax not specified
    const maxDate = timeMax || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    try {
        const calendar = await getCalendarClient(supabase, userId);
        const response = await calendar.events.list({
            calendarId: calendarId,
            timeMin: timeMin,
            timeMax: maxDate,
            maxResults: maxResults,
            singleEvents: true,
            orderBy: 'startTime'
        });
        return response.data.items || [];
    } catch (error) {
        const { logError } = __turbopack_context__.r("[project]/lib/api-helpers.js [app-route] (ecmascript)");
        logError('Error fetching Google Calendar events', error);
        throw error;
    }
}
/**
 * Store calendar events in database
 */ async function storeCalendarEvents(supabase, userId, events) {
    const eventsToStore = events.map((event)=>({
            user_id: userId,
            event_id: event.id,
            summary: event.summary || null,
            description: event.description || null,
            start_time: event.start?.dateTime || event.start?.date || null,
            end_time: event.end?.dateTime || event.end?.date || null,
            location: event.location || null,
            attendees: event.attendees || null,
            organizer_email: event.organizer?.email || null,
            organizer_name: event.organizer?.displayName || null,
            conference_data: event.conferenceData || null,
            html_link: event.htmlLink || null
        }));
    // Upsert events (update if exists, insert if not)
    const { error } = await supabase.from('google_calendar_events').upsert(eventsToStore, {
        onConflict: 'user_id,event_id',
        ignoreDuplicates: false
    });
    if (error) {
        const { logError } = __turbopack_context__.r("[project]/lib/api-helpers.js [app-route] (ecmascript)");
        logError('Error storing calendar events', error);
        throw error;
    }
    return eventsToStore;
}
module.exports = {
    getGoogleCalendarConfig,
    createOAuth2Client,
    getUserCalendarToken,
    getAccessToken,
    refreshAccessToken,
    getCalendarClient,
    fetchUpcomingEvents,
    storeCalendarEvents
};
}),
"[project]/lib/calendar-account-matcher.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Calendar Event to Account Matcher
 * 
 * Matches Google Calendar events to Salesforce accounts based on:
 * - Account names in event title/summary
 * - Attendee email addresses matching contact emails
 * - Account names in event description
 */ const { log, logError } = __turbopack_context__.r("[project]/lib/api-helpers.js [app-route] (ecmascript)");
/**
 * Match calendar events to Salesforce accounts
 * 
 * @param {Object} supabase - Supabase client
 * @param {string} userId - User ID
 * @param {Array} events - Array of Google Calendar events
 * @returns {Promise<Array>} Array of events with matched accounts
 */ async function matchEventsToAccounts(supabase, userId, events) {
    // Get user's accounts
    const { data: userAccounts, error: accountsError } = await supabase.from('user_accounts').select(`
      account_id,
      accounts:account_id (
        id,
        salesforce_id,
        name
      )
    `).eq('user_id', userId);
    if (accountsError) {
        logError('Error fetching user accounts:', accountsError);
        return events.map((event)=>({
                event,
                matchedAccounts: []
            }));
    }
    if (!userAccounts || userAccounts.length === 0) {
        return events.map((event)=>({
                event,
                matchedAccounts: []
            }));
    }
    // Get account names for matching
    const accountMap = new Map();
    userAccounts.forEach((ua)=>{
        if (ua.accounts) {
            accountMap.set(ua.accounts.name.toLowerCase(), {
                id: ua.accounts.id,
                salesforce_id: ua.accounts.salesforce_id,
                name: ua.accounts.name
            });
        }
    });
    // Get contacts for email matching
    // Try both account_id (UUID) and salesforce_account_id (Salesforce ID) matching
    const accountIds = userAccounts.map((ua)=>ua.account_id).filter(Boolean);
    const salesforceAccountIds = userAccounts.map((ua)=>ua.accounts?.salesforce_id).filter(Boolean);
    log(`User has ${userAccounts.length} accounts for calendar matching`);
    const hasManaManage = userAccounts.some((ua)=>ua.accounts?.name?.toLowerCase().includes('manamanage'));
    if (hasManaManage) {
        log(`ManaManage account found in user accounts`);
    }
    let contacts = [];
    if (accountIds.length > 0 || salesforceAccountIds.length > 0) {
        // Build query to match by either account_id (UUID) or salesforce_account_id
        let contactsQuery = supabase.from('contacts').select('id, email, first_name, last_name, account_id, salesforce_account_id, account_name').not('email', 'is', null);
        // Match by account_id (UUID) if available
        if (accountIds.length > 0) {
            contactsQuery = contactsQuery.in('account_id', accountIds);
        }
        // Also match by salesforce_account_id if we have those
        // Note: Supabase doesn't support OR in a single query easily, so we'll do two queries and merge
        const contactsPromises = [];
        if (accountIds.length > 0) {
            contactsPromises.push(supabase.from('contacts').select('id, email, first_name, last_name, account_id, salesforce_account_id, account_name').in('account_id', accountIds).not('email', 'is', null));
        }
        if (salesforceAccountIds.length > 0) {
            contactsPromises.push(supabase.from('contacts').select('id, email, first_name, last_name, account_id, salesforce_account_id, account_name').in('salesforce_account_id', salesforceAccountIds).not('email', 'is', null));
        }
        const contactsResults = await Promise.all(contactsPromises);
        // Merge results and deduplicate by contact id
        const contactsMap = new Map();
        contactsResults.forEach(({ data: contactsData, error: contactsError })=>{
            if (contactsError) {
                logError('Error fetching contacts for calendar matching:', contactsError);
            } else if (contactsData) {
                contactsData.forEach((contact)=>{
                    if (!contactsMap.has(contact.id)) {
                        contactsMap.set(contact.id, contact);
                    }
                });
            }
        });
        const allContacts = Array.from(contactsMap.values());
        if (allContacts.length > 0) {
            // Map contacts to include account info from userAccounts
            // Try matching by account_id first, then by salesforce_account_id (case-insensitive)
            contacts = allContacts.map((contact)=>{
                let userAccount = null;
                // First try UUID match
                if (contact.account_id) {
                    userAccount = userAccounts.find((ua)=>ua.account_id === contact.account_id);
                }
                // If no UUID match, try Salesforce ID match (case-insensitive)
                if (!userAccount && contact.salesforce_account_id) {
                    const contactSalesforceId = contact.salesforce_account_id.toLowerCase().trim();
                    userAccount = userAccounts.find((ua)=>{
                        const accountSalesforceId = ua.accounts?.salesforce_id?.toLowerCase().trim();
                        return accountSalesforceId === contactSalesforceId;
                    });
                }
                return {
                    ...contact,
                    accounts: userAccount?.accounts || null
                };
            });
            // Log contacts that didn't match for debugging
            const unmatchedContacts = contacts.filter((contact)=>contact.accounts === null);
            if (unmatchedContacts.length > 0) {
                log(`Warning: ${unmatchedContacts.length} contacts found but not matched to user accounts:`);
                unmatchedContacts.slice(0, 5).forEach((contact)=>{
                    log(`  - ${contact.email} (account_id: ${contact.account_id || 'null'}, salesforce_account_id: ${contact.salesforce_account_id})`);
                });
            }
            // Only include contacts that matched to an account
            contacts = contacts.filter((contact)=>contact.accounts !== null);
            log(`Found ${contacts.length} contacts for calendar matching (from ${allContacts.length} total contacts across ${accountIds.length} UUID accounts and ${salesforceAccountIds.length} Salesforce accounts)`);
            // Log sample of contact emails for debugging
            if (contacts.length > 0 && contacts.length <= 20) {
                const sampleEmails = contacts.map((c)=>c.email).filter(Boolean).slice(0, 10);
                log(`  Sample contact emails: ${sampleEmails.join(', ')}`);
            }
        } else {
            log(`No contacts found for calendar matching (accountIds: ${accountIds.length}, salesforceAccountIds: ${salesforceAccountIds.length})`);
            // If no contacts found by account, try to find contacts by email for debugging
            // This is a fallback to help identify if contacts exist but aren't linked properly
            if (salesforceAccountIds.length > 0) {
                log(`  Attempting fallback: checking for contacts with salesforce_account_id in [${salesforceAccountIds.slice(0, 3).join(', ')}...]`);
            }
        }
    } else {
        log('No account IDs found for calendar matching');
    }
    // Create email to account map (exact matches)
    const emailToAccountMap = new Map();
    // Create domain to account map (domain-based matches)
    const domainToAccountMap = new Map();
    log(`Building email maps from ${contacts.length} contacts`);
    contacts.forEach((contact)=>{
        if (contact.email && contact.accounts) {
            const email = contact.email.toLowerCase().trim();
            // Exact email matching
            if (!emailToAccountMap.has(email)) {
                emailToAccountMap.set(email, []);
            }
            emailToAccountMap.get(email).push({
                id: contact.accounts.id,
                salesforce_id: contact.accounts.salesforce_id,
                name: contact.accounts.name
            });
            // Domain-based matching - extract domain from email
            try {
                const domain = email.split('@')[1];
                if (domain) {
                    if (!domainToAccountMap.has(domain)) {
                        domainToAccountMap.set(domain, []);
                    }
                    // Only add if not already in the array for this domain
                    const existingAccounts = domainToAccountMap.get(domain);
                    const alreadyExists = existingAccounts.some((acc)=>acc.id === contact.accounts.id);
                    if (!alreadyExists) {
                        domainToAccountMap.get(domain).push({
                            id: contact.accounts.id,
                            salesforce_id: contact.accounts.salesforce_id,
                            name: contact.accounts.name
                        });
                    }
                }
            } catch (e) {
                // Skip if email format is invalid
                logError('Invalid email format for domain extraction:', contact.email);
            }
        }
    });
    // Match events to accounts
    const eventsWithAccounts = events.map((event)=>{
        const matchedAccounts = new Set();
        const matchReasons = [];
        const eventText = [
            event.summary || '',
            event.description || '',
            event.location || ''
        ].join(' ').toLowerCase();
        // Match by account name in event text
        accountMap.forEach((account, accountNameLower)=>{
            // Check if account name appears in event text
            // Use word boundaries to avoid partial matches
            const regex = new RegExp(`\\b${accountNameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            if (regex.test(eventText)) {
                matchedAccounts.add(account.id);
                matchReasons.push({
                    accountId: account.id,
                    accountName: account.name,
                    reason: `Account name "${account.name}" found in event`,
                    confidence: 'high'
                });
            }
        });
        // Match by attendee email addresses
        if (event.attendees && Array.isArray(event.attendees)) {
            event.attendees.forEach((attendee)=>{
                if (attendee.email) {
                    const email = attendee.email.toLowerCase().trim();
                    // First try exact email match (higher confidence)
                    const matchedAccountsForEmail = emailToAccountMap.get(email);
                    if (matchedAccountsForEmail && matchedAccountsForEmail.length > 0) {
                        matchedAccountsForEmail.forEach((account)=>{
                            if (!matchedAccounts.has(account.id)) {
                                matchedAccounts.add(account.id);
                                matchReasons.push({
                                    accountId: account.id,
                                    accountName: account.name,
                                    reason: `Attendee email ${attendee.email} matches contact`,
                                    confidence: 'high'
                                });
                            }
                        });
                    } else {
                        // If no exact match, try domain-based matching (lower confidence)
                        try {
                            const attendeeDomain = email.split('@')[1];
                            if (attendeeDomain) {
                                const matchedAccountsForDomain = domainToAccountMap.get(attendeeDomain);
                                if (matchedAccountsForDomain && matchedAccountsForDomain.length > 0) {
                                    matchedAccountsForDomain.forEach((account)=>{
                                        if (!matchedAccounts.has(account.id)) {
                                            matchedAccounts.add(account.id);
                                            matchReasons.push({
                                                accountId: account.id,
                                                accountName: account.name,
                                                reason: `Attendee email domain ${attendeeDomain} matches contacts from ${account.name}`,
                                                confidence: 'medium'
                                            });
                                        }
                                    });
                                }
                            }
                        } catch (e) {
                            // Skip if email format is invalid
                            logError('Invalid attendee email format for domain extraction:', attendee.email);
                        }
                    }
                }
            });
        }
        // Convert Set to Array and get full account details
        const matchedAccountIds = Array.from(matchedAccounts);
        const matchedAccountsFull = matchedAccountIds.map((accountId)=>{
            const userAccount = userAccounts.find((ua)=>ua.account_id === accountId);
            if (userAccount && userAccount.accounts) {
                const matchReason = matchReasons.find((mr)=>mr.accountId === accountId);
                return {
                    id: userAccount.accounts.id,
                    salesforce_id: userAccount.accounts.salesforce_id,
                    name: userAccount.accounts.name,
                    matchReason: matchReason?.reason || 'Matched',
                    confidence: matchReason?.confidence || 'medium'
                };
            }
            return null;
        }).filter(Boolean);
        return {
            event,
            matchedAccounts: matchedAccountsFull
        };
    });
    // Store matches in database
    try {
        await storeEventAccountMatches(supabase, eventsWithAccounts);
    } catch (error) {
        logError('Error storing event-account matches:', error);
    // Continue even if storage fails
    }
    return eventsWithAccounts;
}
/**
 * Store event-account matches in database
 */ async function storeEventAccountMatches(supabase, eventsWithAccounts) {
    const matchesToStore = [];
    for (const { event, matchedAccounts } of eventsWithAccounts){
        if (matchedAccounts.length === 0) continue;
        // Get the stored event ID from database
        const { data: storedEvent, error: eventError } = await supabase.from('google_calendar_events').select('id').eq('event_id', event.id).single();
        if (eventError || !storedEvent) {
            continue; // Skip if event not found in database
        }
        // Create matches for each account
        matchedAccounts.forEach((account)=>{
            matchesToStore.push({
                event_id: storedEvent.id,
                account_id: account.id,
                salesforce_account_id: account.salesforce_id,
                match_confidence: account.confidence,
                match_reason: account.matchReason
            });
        });
    }
    if (matchesToStore.length > 0) {
        // Upsert matches (update if exists, insert if not)
        const { error: upsertError } = await supabase.from('calendar_event_account_matches').upsert(matchesToStore, {
            onConflict: 'event_id,account_id',
            ignoreDuplicates: false
        });
        if (upsertError) {
            logError('Error storing event-account matches:', upsertError);
            throw upsertError;
        }
    }
}
module.exports = {
    matchEventsToAccounts,
    storeEventAccountMatches
};
}),
"[project]/src/app/api/google-calendar/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Next.js App Router API Route for Google Calendar
 * 
 * Combined endpoint handling:
 * - OAuth authorization flow (GET with code/userId/action)
 * - Event fetching (GET with action=events)
 * - Status checks (GET with action=status)
 * - Disconnection (DELETE)
 */ __turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "OPTIONS",
    ()=>OPTIONS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase-server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/next-api-helpers.js [app-route] (ecmascript)");
;
;
;
// Can use require for lib files in Next.js API routes
const { getGoogleCalendarConfig, createOAuth2Client } = __turbopack_context__.r("[project]/lib/google-calendar-client.js [app-route] (ecmascript)");
const { fetchUpcomingEvents, storeCalendarEvents } = __turbopack_context__.r("[project]/lib/google-calendar-client.js [app-route] (ecmascript)");
const { matchEventsToAccounts } = __turbopack_context__.r("[project]/lib/calendar-account-matcher.js [app-route] (ecmascript)");
const { CACHE_TTL } = __turbopack_context__.r("[project]/lib/constants.js [app-route] (ecmascript)");
async function OPTIONS() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handlePreflight"])(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextRequest"]('http://localhost', {
        method: 'OPTIONS'
    }));
}
async function DELETE(request) {
    const preflight = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handlePreflight"])(request);
    if (preflight) return preflight;
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateSupabase"])(supabase);
        if (!validation.valid) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error(validation.error.message), validation.error.status);
        }
        const { searchParams } = new URL(request.url);
        let deleteUserId = searchParams.get('userId');
        // Try body if not in query params
        if (!deleteUserId) {
            try {
                const body = await request.json().catch(()=>({}));
                deleteUserId = body.userId;
            } catch (e) {
            // Body not available or not JSON
            }
        }
        if (!deleteUserId) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Missing required parameter: userId'), 400);
        }
        // Verify user exists
        const { data: user, error: userError } = await supabase.from('users').select('id').eq('id', deleteUserId).single();
        if (userError || !user) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('User not found'), 404);
        }
        // Deactivate token (soft delete)
        const { error: updateError } = await supabase.from('google_calendar_tokens').update({
            is_active: false,
            updated_at: new Date().toISOString()
        }).eq('user_id', deleteUserId);
        if (updateError) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error disconnecting Google Calendar', updateError);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Failed to disconnect Google Calendar'), 500);
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
            message: 'Google Calendar disconnected successfully'
        });
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error in google-calendar DELETE:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(error, 500);
    }
}
async function GET(request) {
    const preflight = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handlePreflight"])(request);
    if (preflight) return preflight;
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateSupabase"])(supabase);
        if (!validation.valid) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error(validation.error.message), validation.error.status);
        }
        // Get Google Calendar config (needed for most operations)
        let config;
        try {
            config = getGoogleCalendarConfig();
        } catch (error) {
            // Only throw error for operations that require config (not status checks)
            const { searchParams } = new URL(request.url);
            const action = searchParams.get('action');
            if (action !== 'status') {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Google Calendar not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (or GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET) environment variables.'), 400);
            }
        }
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const oauthError = searchParams.get('error');
        const userId = searchParams.get('userId');
        const action = searchParams.get('action');
        const days = searchParams.get('days');
        const forceRefresh = searchParams.get('forceRefresh');
        // Action: events - Fetch calendar events
        if (action === 'events') {
            if (!userId) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Missing required parameter: userId'), 400);
            }
            // Verify user exists
            const { data: user, error: userError } = await supabase.from('users').select('id, email').eq('id', userId).single();
            if (userError || !user) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('User not found'), 404);
            }
            const daysNum = parseInt(days, 10) || 7;
            const timeMin = new Date().toISOString();
            const timeMax = new Date(Date.now() + daysNum * 24 * 60 * 60 * 1000).toISOString();
            const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';
            // CACHE-FIRST: Check for cached events before fetching from Google Calendar
            let events = [];
            let useCached = false;
            let needsRefresh = true;
            if (!shouldForceRefresh) {
                try {
                    // Get cached events from database
                    const { data: cachedEvents, error: cacheError } = await supabase.from('google_calendar_events').select('*').eq('user_id', userId).gte('start_time', timeMin).lte('start_time', timeMax).order('start_time', {
                        ascending: true
                    });
                    if (!cacheError && cachedEvents && cachedEvents.length > 0) {
                        // Check if cache is fresh (within TTL)
                        const now = new Date();
                        const cacheExpiry = (CACHE_TTL.CALENDAR_EVENTS || 15) * 60 * 1000; // 15 minutes in milliseconds
                        // Use the most recent updated_at as the cache timestamp
                        const mostRecentUpdate = cachedEvents.reduce((latest, event)=>{
                            if (!event.updated_at) return latest;
                            const updated = new Date(event.updated_at);
                            return updated > latest ? updated : latest;
                        }, new Date(0));
                        const allFresh = now - mostRecentUpdate < cacheExpiry;
                        if (allFresh) {
                            // Convert cached events to Google Calendar API format
                            events = cachedEvents.map((event)=>{
                                let attendees = event.attendees;
                                if (attendees && typeof attendees === 'string') {
                                    try {
                                        attendees = JSON.parse(attendees);
                                    } catch (e) {
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error parsing attendees JSON:', e);
                                        attendees = null;
                                    }
                                }
                                return {
                                    id: event.event_id,
                                    summary: event.summary,
                                    description: event.description,
                                    start: {
                                        dateTime: event.start_time,
                                        date: event.start_time
                                    },
                                    end: {
                                        dateTime: event.end_time,
                                        date: event.end_time
                                    },
                                    location: event.location,
                                    attendees: Array.isArray(attendees) ? attendees : attendees ? [
                                        attendees
                                    ] : null,
                                    organizer: event.organizer_email ? {
                                        email: event.organizer_email,
                                        displayName: event.organizer_name
                                    } : null,
                                    conferenceData: event.conference_data,
                                    htmlLink: event.html_link
                                };
                            });
                            useCached = true;
                            needsRefresh = false;
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Returning ${events.length} cached calendar events`);
                        } else {
                            needsRefresh = true;
                        }
                    }
                } catch (cacheError) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error getting cached calendar events', cacheError);
                    needsRefresh = true;
                }
            }
            // Fetch from Google Calendar if cache is stale/missing or force refresh requested
            if (needsRefresh || shouldForceRefresh) {
                try {
                    const fetchedEvents = await fetchUpcomingEvents(supabase, userId, {
                        timeMin,
                        timeMax,
                        maxResults: 50
                    });
                    events = fetchedEvents;
                    // Store events in database
                    if (events.length > 0) {
                        try {
                            await storeCalendarEvents(supabase, userId, events);
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Fetched and cached ${events.length} calendar events`);
                        } catch (error) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error storing calendar events', error);
                        }
                    }
                } catch (error) {
                    if (error.message && error.message.includes('not authorized')) {
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Google Calendar not authorized. Please connect your calendar first.'), 401);
                    }
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error fetching calendar events', error);
                    // If we have cached events (even if stale), use them as fallback
                    if (useCached && events.length > 0) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])('Using stale cache as fallback');
                    } else {
                        throw error;
                    }
                }
            }
            // Match events to Salesforce accounts
            let eventsWithAccounts = [];
            if (events.length > 0) {
                try {
                    eventsWithAccounts = await matchEventsToAccounts(supabase, userId, events);
                } catch (error) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error matching events to accounts', error);
                    // Return events without matches if matching fails
                    eventsWithAccounts = events.map((event)=>({
                            event,
                            matchedAccounts: []
                        }));
                }
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
                events: eventsWithAccounts,
                totalEvents: events.length,
                matchedEvents: eventsWithAccounts.filter((e)=>e.matchedAccounts.length > 0).length,
                cached: useCached,
                forceRefresh: shouldForceRefresh
            });
        }
        // Action: status - Check connection status
        if (action === 'status' || !code && !userId && !oauthError && !action) {
            // Check if Google Calendar is configured
            try {
                getGoogleCalendarConfig();
            } catch (configError) {
                const hasClientId = !!(process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID);
                const hasClientSecret = !!(process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET);
                const clientIdValue = process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
                const isApiKey = clientIdValue && clientIdValue.startsWith('AIza');
                let errorMessage = 'Google Calendar integration is not configured.';
                if (isApiKey) {
                    errorMessage = 'Google Calendar integration is misconfigured. An API key is being used instead of an OAuth Client ID. Please update GOOGLE_CLIENT_ID or GOOGLE_CALENDAR_CLIENT_ID to use an OAuth Client ID (ending with .apps.googleusercontent.com) instead of an API key.';
                } else if (!hasClientId || !hasClientSecret) {
                    errorMessage = 'Google Calendar integration is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (or GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET) environment variables.';
                } else {
                    errorMessage = configError.message || errorMessage;
                }
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
                    connected: false,
                    configured: false,
                    message: errorMessage,
                    error: configError.message
                });
            }
            const statusUserId = userId || searchParams.get('userId');
            if (!statusUserId) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Missing required parameter: userId'), 400);
            }
            // Check if user has an active Google Calendar token
            const { data: tokenData, error } = await supabase.from('google_calendar_tokens').select('id, token_expires_at, is_active').eq('user_id', statusUserId).eq('is_active', true).single();
            if (error && error.code !== 'PGRST116') {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error checking calendar status', error);
                throw error;
            }
            const connected = !!(tokenData && tokenData.is_active);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
                connected,
                configured: true,
                tokenExpiresAt: tokenData?.token_expires_at || null
            });
        }
        // OAuth Flow: Initiate OAuth (redirect to Google)
        if (!code && !oauthError) {
            if (!userId) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Missing required parameter: userId'), 400);
            }
            // Verify user exists
            const { data: user, error: userError } = await supabase.from('users').select('id, email').eq('id', userId).single();
            if (userError || !user) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('User not found'), 404);
            }
            // Determine redirect URI
            const host = request.headers.get('host') || 'unknown';
            const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
            const protocol = isLocalhost ? 'http' : request.headers.get('x-forwarded-proto') || 'https';
            let redirectUri;
            if (isLocalhost) {
                redirectUri = 'http://localhost:3000/api/google-calendar';
            } else {
                redirectUri = config.redirectUri || `${protocol}://${host}/api/google-calendar`;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Initiating Google Calendar OAuth for user ${userId}`);
            // Generate state for CSRF protection
            const stateValue = Buffer.from(JSON.stringify({
                userId,
                timestamp: Date.now()
            })).toString('base64');
            // Create OAuth2 client
            const oauth2ClientConfig = {
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                redirectUri: redirectUri
            };
            const oauth2Client = createOAuth2Client(oauth2ClientConfig);
            // Generate auth URL
            const authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: [
                    'https://www.googleapis.com/auth/calendar.readonly',
                    'https://www.googleapis.com/auth/calendar.events.readonly'
                ],
                state: stateValue,
                prompt: 'consent'
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(authUrl);
        }
        // Handle OAuth error
        if (oauthError) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error(`Google Calendar OAuth error: ${oauthError}. User denied authorization or an error occurred.`), 400);
        }
        // Exchange authorization code for access token
        if (code) {
            // Parse state to get userId
            let userIdFromState = null;
            try {
                const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
                userIdFromState = stateData.userId;
            } catch (error) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error parsing state:', error);
            }
            const userId = userIdFromState || searchParams.get('userId');
            if (!userId) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Missing userId. Please include userId in the authorization request.'), 400);
            }
            // Verify user exists
            const { data: user, error: userError } = await supabase.from('users').select('id, email').eq('id', userId).single();
            if (userError || !user) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('User not found'), 404);
            }
            // Determine redirect URI (must match auth URL)
            const host = request.headers.get('host') || 'unknown';
            const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
            const protocol = isLocalhost ? 'http' : request.headers.get('x-forwarded-proto') || 'https';
            let redirectUri;
            if (isLocalhost) {
                redirectUri = 'http://localhost:3000/api/google-calendar';
            } else {
                redirectUri = config.redirectUri || `${protocol}://${host}/api/google-calendar`;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Exchanging OAuth code for token for user ${userId}`);
            // Create OAuth2 client
            const oauth2ClientConfig = {
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                redirectUri: redirectUri
            };
            const oauth2Client = createOAuth2Client(oauth2ClientConfig);
            try {
                const { tokens } = await oauth2Client.getToken(code);
                if (!tokens.access_token) {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Invalid token response. Google did not return an access token.'), 400);
                }
                // Calculate token expiration
                const expiresAt = new Date();
                expiresAt.setSeconds(expiresAt.getSeconds() + (tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600));
                // Store or update tokens in database
                const { error: upsertError } = await supabase.from('google_calendar_tokens').upsert({
                    user_id: userId,
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token || null,
                    token_expires_at: expiresAt.toISOString(),
                    scope: tokens.scope || null,
                    is_active: true,
                    last_tested: new Date().toISOString()
                }, {
                    onConflict: 'user_id',
                    ignoreDuplicates: false
                });
                if (upsertError) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error storing Google Calendar token', upsertError);
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Failed to store access token. Could not save access token to database.'), 500);
                }
                // Return success page with auto-redirect
                const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Google Calendar OAuth Success</title>
            <meta http-equiv="refresh" content="2;url=/calendar">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
              }
              .container {
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 500px;
              }
              h1 {
                color: #4285f4;
                margin-bottom: 1rem;
              }
              .success {
                color: #34a853;
                font-size: 3rem;
                margin-bottom: 1rem;
              }
              p {
                color: #6b7280;
                line-height: 1.6;
              }
              .token-info {
                background: #f3f4f6;
                padding: 1rem;
                border-radius: 4px;
                margin-top: 1rem;
                font-size: 0.875rem;
                color: #374151;
              }
              .redirect-message {
                margin-top: 1.5rem;
                font-size: 0.875rem;
                color: #6b7280;
              }
              .redirect-link {
                display: inline-block;
                margin-top: 1rem;
                padding: 0.75rem 1.5rem;
                background: #4285f4;
                color: white;
                text-decoration: none;
                border-radius: 0.375rem;
                font-weight: 600;
                transition: background 0.2s;
              }
              .redirect-link:hover {
                background: #3367d6;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success">✓</div>
              <h1>Google Calendar Connected!</h1>
              <p>Your Google Calendar has been successfully connected and is ready to use.</p>
              <div class="token-info">
                <strong>Token expires:</strong> ${new Date(expiresAt).toLocaleString()}
              </div>
              <div class="redirect-message">
                <p>Redirecting you back to the calendar page...</p>
                <a href="/calendar" class="redirect-link">Go to Calendar Page</a>
              </div>
            </div>
            <script>
              setTimeout(function() {
                window.location.href = '/calendar';
              }, 2000);
            </script>
          </body>
          </html>
        `;
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](htmlContent, {
                    status: 200,
                    headers: {
                        'Content-Type': 'text/html'
                    }
                });
            } catch (tokenError) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error exchanging authorization code', tokenError);
                if (tokenError.message && tokenError.message.includes('invalid_client')) {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error(`Invalid OAuth client credentials. Please verify that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local match the OAuth client in Google Cloud Console. Error: ${tokenError.message}`), 400);
                }
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error(`Failed to exchange authorization code: ${tokenError.message}`), 400);
            }
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Invalid request'), 400);
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error in google-calendar', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(error, 500);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4a511956._.js.map