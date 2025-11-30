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
        if (!supabaseUrl || !supabaseServiceKey) {
            const missing = [];
            if (!supabaseUrl) missing.push('SUPABASE_URL');
            if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
            console.error(`[Supabase] Missing environment variables: ${missing.join(', ')}`);
            return null;
        }
        return createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
    } catch (error) {
        console.error('[Supabase] Error creating client:', error.message);
        if (error.stack) {
            console.error('[Supabase] Stack:', error.stack);
        }
        return null;
    }
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
// From src/lib/next-api-helpers.js -> up to src/ -> up to root/ -> lib/
const apiHelpers = __turbopack_context__.r("[project]/lib/api-helpers.js [app-route] (ecmascript)");
const { MAX_REQUEST_SIZE, REQUEST_TIMEOUT, RATE_LIMIT } = __turbopack_context__.r("[project]/lib/constants.js [app-route] (ecmascript)");
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
"[project]/lib/supabase-client.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Shared Supabase Client Utility
 * 
 * Provides a consistent way to create Supabase clients across all API functions
 */ function getSupabaseClient() {
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
        // Only log in development
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn('Supabase client not available:', error.message);
        }
    }
    return null;
}
module.exports = {
    getSupabaseClient
};
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

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
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/domain [external] (domain, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("domain", () => require("domain"));

module.exports = mod;
}),
"[project]/lib/salesforce-client.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Shared Salesforce Client Utilities
 * 
 * Centralized Salesforce authentication and common operations
 */ const { getSupabaseClient } = __turbopack_context__.r("[project]/lib/supabase-client.js [app-route] (ecmascript)");
const { log, logError, logWarn, isProduction } = __turbopack_context__.r("[project]/lib/api-helpers.js [app-route] (ecmascript)");
/**
 * Get jsforce client library
 */ function getJsforceClient() {
    try {
        const jsforce = __turbopack_context__.r("[project]/node_modules/jsforce/index.js [app-route] (ecmascript)");
        return jsforce;
    } catch (error) {
        logWarn('jsforce not available:', error.message);
        return null;
    }
}
/**
 * Authenticate with Salesforce using jsforce
 * 
 * @param {Object} supabase - Supabase client instance
 * @returns {Promise<Object>} Connection object with connection, instanceUrl, and accessToken
 */ async function authenticateSalesforce(supabase) {
    // Get Salesforce config from Supabase
    const { data: config, error: configError } = await supabase.from('salesforce_configs').select('*').eq('is_active', true).single();
    if (configError) {
        logError('Error fetching Salesforce config:', configError);
        throw new Error(`Error fetching Salesforce config: ${configError.message}`);
    }
    if (!config) {
        logError('No active Salesforce configuration found in salesforce_configs table');
        throw new Error('Salesforce configuration not found in Supabase. Please insert credentials into salesforce_configs table.');
    }
    const jsforce = getJsforceClient();
    if (!jsforce) {
        logError('jsforce library not available');
        throw new Error('jsforce library not available. Make sure jsforce is installed: npm install jsforce');
    }
    // Clean login URL (handle custom domains like leandata.my.salesforce.com)
    let loginUrl = config.login_url || 'https://login.salesforce.com';
    loginUrl = loginUrl.trim().replace(/\/$/, '');
    // For custom domains ending in .my.salesforce.com, keep as-is
    // jsforce will handle the authentication
    if (!loginUrl.startsWith('http://') && !loginUrl.startsWith('https://')) {
        loginUrl = 'https://' + loginUrl;
    }
    // Create connection
    const conn = new jsforce.Connection({
        loginUrl: loginUrl
    });
    // Authenticate (jsforce handles OAuth internally - no Client ID/Secret needed!)
    try {
        await conn.login(config.username, config.password + (config.security_token || ''));
    } catch (error) {
        // Try with password only if first attempt fails
        if (error.message && error.message.includes('INVALID_LOGIN')) {
            await conn.login(config.username, config.password);
        } else {
            throw error;
        }
    }
    return {
        connection: conn,
        instanceUrl: conn.instanceUrl,
        accessToken: conn.accessToken
    };
}
/**
 * Escape single quotes in SOQL queries to prevent injection
 * 
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */ function escapeSOQL(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'");
}
module.exports = {
    getJsforceClient,
    authenticateSalesforce,
    escapeSOQL
};
}),
"[project]/lib/cache-helpers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Shared Cache Helper Functions
 * 
 * Common utilities for cache management
 */ const { CACHE_TTL } = __turbopack_context__.r("[project]/lib/constants.js [app-route] (ecmascript)");
/**
 * Check if cached data is fresh based on TTL
 * 
 * @param {string|Date} lastSyncedAt - Last sync timestamp
 * @param {number} ttlHours - Time to live in hours (or string key from CACHE_TTL)
 * @returns {boolean} True if cache is fresh
 */ function isCacheFresh(lastSyncedAt, ttlHours) {
    if (!lastSyncedAt) return false;
    // If ttlHours is a string, look it up in CACHE_TTL
    const ttl = typeof ttlHours === 'string' ? CACHE_TTL[ttlHours] || CACHE_TTL.ACCOUNTS : ttlHours;
    const now = new Date();
    const cacheExpiry = ttl * 60 * 60 * 1000;
    const lastSynced = new Date(lastSyncedAt);
    if (isNaN(lastSynced.getTime())) return false;
    return now - lastSynced < cacheExpiry;
}
/**
 * Check if cache is fresh for a given resource type
 * 
 * @param {string|Date} lastSyncedAt - Last sync timestamp
 * @param {string} resourceType - Type of resource (ACCOUNTS, CASES, CONTACTS, etc.)
 * @returns {boolean} True if cache is fresh
 */ function isResourceCacheFresh(lastSyncedAt, resourceType) {
    return isCacheFresh(lastSyncedAt, resourceType);
}
/**
 * Get cache TTL in milliseconds for a resource type
 * 
 * @param {string} resourceType - Type of resource
 * @returns {number} TTL in milliseconds
 */ function getCacheTTLMs(resourceType) {
    const ttlHours = CACHE_TTL[resourceType] || CACHE_TTL.ACCOUNTS;
    return ttlHours * 60 * 60 * 1000;
}
/**
 * Calculate cache age in milliseconds
 * 
 * @param {string|Date} lastSyncedAt - Last sync timestamp
 * @returns {number} Age in milliseconds, or null if invalid
 */ function getCacheAge(lastSyncedAt) {
    if (!lastSyncedAt) return null;
    const now = new Date();
    const lastSynced = new Date(lastSyncedAt);
    if (isNaN(lastSynced.getTime())) return null;
    return now - lastSynced;
}
module.exports = {
    isCacheFresh,
    isResourceCacheFresh,
    getCacheTTLMs,
    getCacheAge,
    CACHE_TTL
};
}),
"[project]/src/app/api/salesforce-accounts/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Next.js App Router API Route for Salesforce Account Fetching
 * 
 * Fetches accounts from Salesforce assigned to a user based on their role
 * Uses Supabase to store credentials and account assignments
 * Uses jsforce library (same as SOW-Generator) - no Client ID/Secret needed!
 */ __turbopack_context__.s([
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
const { authenticateSalesforce, escapeSOQL } = __turbopack_context__.r("[project]/lib/salesforce-client.js [app-route] (ecmascript)");
const { isCacheFresh } = __turbopack_context__.r("[project]/lib/cache-helpers.js [app-route] (ecmascript)");
const { MAX_REQUEST_SIZE, CACHE_TTL, API_LIMITS } = __turbopack_context__.r("[project]/lib/constants.js [app-route] (ecmascript)");
/**
 * Query Salesforce for accounts based on user role/ownership
 * Uses standard fields only (custom fields may not exist in all orgs)
 * Note: Salesforce doesn't allow semi-join subqueries with OR, so we query separately and combine
 */ async function querySalesforceAccounts(conn, userId, userEmail, role, ownerOnly = false) {
    // First, get the Salesforce User ID for the email (needed for AccountTeamMember query)
    let salesforceUserId = null;
    try {
        const escapedEmail = escapeSOQL(userEmail);
        const userQuery = `SELECT Id FROM User WHERE Email = '${escapedEmail}' LIMIT 1`;
        const userResult = await conn.query(userQuery);
        if (userResult.records && userResult.records.length > 0) {
            salesforceUserId = userResult.records[0].Id;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Found Salesforce User ID: ${salesforceUserId} for email: ${userEmail}`);
        } else {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])(`No Salesforce User found for email: ${userEmail}`);
        }
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])(`Could not find Salesforce User for email ${userEmail}:`, error.message);
    }
    // Field selection - try custom fields first, fallback to standard
    // Using Employee_Band__c for Account Segment (Tier) - confirmed API name
    // Using Expiring_Revenue__c for Contract Value (Expiring ARR) - confirmed API name
    // Type is a standard field used to filter out "Former Customer" accounts
    const customFields = `Id, Name, Employee_Band__c, Expiring_Revenue__c, Type, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
    const standardFields = `Id, Name, Type, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
    let useCustomFields = true;
    let allAccounts = [];
    const accountMap = new Map(); // Use Map to deduplicate by Account Id
    // If ownerOnly is true, only query accounts owned by the user (ignore role and team member accounts)
    // Otherwise, use role-based logic
    if (ownerOnly || role === 'Account Manager' || role === 'Sales Rep') {
        // Query 1: Accounts owned by user (by Owner.Email)
        // Filter by Type != 'Former Customer' to exclude former customers
        try {
            const escapedEmail = escapeSOQL(userEmail);
            let ownerQuery = `SELECT ${customFields} FROM Account WHERE Owner.Email = '${escapedEmail}' AND Type != 'Former Customer' ORDER BY Name LIMIT 100`;
            try {
                const ownerResult = await conn.query(ownerQuery);
                if (ownerResult.records) {
                    ownerResult.records.forEach((acc)=>{
                        accountMap.set(acc.Id, acc);
                    });
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Found ${ownerResult.records.length} accounts owned by ${userEmail}`);
                }
            } catch (error) {
                if (error.errorCode === 'INVALID_FIELD') {
                    // Log which field is invalid for debugging
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])('INVALID_FIELD error in Salesforce query', {
                        errorCode: error.errorCode
                    });
                    // Check if error is about Type field
                    const typeError = error.message && error.message.includes('Type');
                    if (typeError) {
                        // Type field doesn't exist or has issues - retry without filter
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])('Type field issue on Account, querying without Type filter');
                        try {
                            ownerQuery = `SELECT ${customFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                            const ownerResult = await conn.query(ownerQuery);
                            if (ownerResult.records) {
                                ownerResult.records.forEach((acc)=>{
                                    accountMap.set(acc.Id, acc);
                                });
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Found ${ownerResult.records.length} accounts owned by ${userEmail} (without Type filter)`);
                            }
                        } catch (retryError) {
                            // If still fails, might be custom fields issue
                            if (retryError.errorCode === 'INVALID_FIELD') {
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])('Custom fields not found, trying alternative field names...');
                                // Try alternative field names (including Employee_Band__c for tier)
                                const altCustomFields = `Id, Name, Employee_Band__c, Expiring_Revenue__c, Tier__c, ContractValue__c, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
                                try {
                                    ownerQuery = `SELECT ${altCustomFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                                    const altResult = await conn.query(ownerQuery);
                                    if (altResult.records) {
                                        altResult.records.forEach((acc)=>{
                                            accountMap.set(acc.Id, acc);
                                        });
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Found ${altResult.records.length} accounts with alternative field names`);
                                    }
                                } catch (altError) {
                                    // If alternative fields also fail, fall back to standard fields
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])('Alternative custom fields also not found, using standard fields only');
                                    useCustomFields = false;
                                    ownerQuery = `SELECT ${standardFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                                    const ownerResult = await conn.query(ownerQuery);
                                    if (ownerResult.records) {
                                        ownerResult.records.forEach((acc)=>{
                                            accountMap.set(acc.Id, acc);
                                        });
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Found ${ownerResult.records.length} accounts owned by ${userEmail} (standard fields only)`);
                                    }
                                }
                            } else {
                                throw retryError;
                            }
                        }
                    } else {
                        // Not a Type error, try alternative field names
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])('Custom fields not found, trying alternative field names...');
                        // Try alternative field names (including Employee_Band__c for tier)
                        const altCustomFields = `Id, Name, Employee_Band__c, Expiring_Revenue__c, Tier__c, ContractValue__c, Type, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
                        try {
                            ownerQuery = `SELECT ${altCustomFields} FROM Account WHERE Owner.Email = '${escapedEmail}' AND Type != 'Former Customer' ORDER BY Name LIMIT 100`;
                            const altResult = await conn.query(ownerQuery);
                            if (altResult.records) {
                                altResult.records.forEach((acc)=>{
                                    accountMap.set(acc.Id, acc);
                                });
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Found ${altResult.records.length} accounts with alternative field names`);
                            }
                        } catch (altError) {
                            // If alternative fields also fail, check if it's Type error
                            if (altError.errorCode === 'INVALID_FIELD' && altError.message && altError.message.includes('Type')) {
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])('Type field not found, retrying without Type filter');
                                ownerQuery = `SELECT ${altCustomFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                                const altResult = await conn.query(ownerQuery);
                                if (altResult.records) {
                                    altResult.records.forEach((acc)=>{
                                        accountMap.set(acc.Id, acc);
                                    });
                                }
                            } else {
                                // If alternative fields also fail, fall back to standard fields
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])('Alternative custom fields also not found, using standard fields only');
                                useCustomFields = false;
                                ownerQuery = `SELECT ${standardFields} FROM Account WHERE Owner.Email = '${escapedEmail}' AND Type != 'Former Customer' ORDER BY Name LIMIT 100`;
                                try {
                                    const ownerResult = await conn.query(ownerQuery);
                                    if (ownerResult.records) {
                                        ownerResult.records.forEach((acc)=>{
                                            accountMap.set(acc.Id, acc);
                                        });
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Found ${ownerResult.records.length} accounts owned by ${userEmail} (standard fields only)`);
                                    }
                                } catch (stdError) {
                                    // Last resort: standard fields without Type filter
                                    if (stdError.errorCode === 'INVALID_FIELD' && stdError.message && stdError.message.includes('Type')) {
                                        ownerQuery = `SELECT ${standardFields} FROM Account WHERE Owner.Email = '${escapedEmail}' ORDER BY Name LIMIT 100`;
                                        const ownerResult = await conn.query(ownerQuery);
                                        if (ownerResult.records) {
                                            ownerResult.records.forEach((acc)=>{
                                                accountMap.set(acc.Id, acc);
                                            });
                                        }
                                    } else {
                                        throw stdError;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    throw error;
                }
            }
        } catch (error) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error querying accounts by owner:', error);
        }
        // Query 2: Accounts from AccountTeamMember (if we have User ID)
        // Skip team member accounts if ownerOnly is true
        if (!ownerOnly && salesforceUserId) {
            try {
                // First get Account IDs from AccountTeamMember
                const teamMemberQuery = `SELECT AccountId FROM AccountTeamMember WHERE UserId = '${salesforceUserId}' LIMIT 100`;
                const teamResult = await conn.query(teamMemberQuery);
                if (teamResult.records && teamResult.records.length > 0) {
                    const accountIds = teamResult.records.map((tm)=>tm.AccountId);
                    // Query accounts by IDs (Salesforce allows up to 200 IDs in IN clause)
                    // Escape IDs to prevent injection (though IDs are typically safe)
                    // Filter by Type != 'Former Customer' to exclude former customers
                    const fields = useCustomFields ? customFields : standardFields;
                    const idsString = accountIds.map((id)=>`'${escapeSOQL(id)}'`).join(',');
                    const accountQuery = `SELECT ${fields} FROM Account WHERE Id IN (${idsString}) AND Type != 'Former Customer' ORDER BY Name`;
                    try {
                        const accountResult = await conn.query(accountQuery);
                        if (accountResult.records) {
                            accountResult.records.forEach((acc)=>{
                                accountMap.set(acc.Id, acc);
                            });
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Found ${accountResult.records.length} accounts from AccountTeamMember`);
                        }
                    } catch (error) {
                        if (error.errorCode === 'INVALID_FIELD' && useCustomFields) {
                            // Retry with standard fields
                            const standardAccountQuery = `SELECT ${standardFields} FROM Account WHERE Id IN (${idsString}) AND Type != 'Former Customer' ORDER BY Name`;
                            const accountResult = await conn.query(standardAccountQuery);
                            if (accountResult.records) {
                                accountResult.records.forEach((acc)=>{
                                    accountMap.set(acc.Id, acc);
                                });
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Found ${accountResult.records.length} accounts from AccountTeamMember (standard fields)`);
                            }
                        } else {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error querying accounts from AccountTeamMember:', error);
                        }
                    }
                }
            } catch (error) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error querying AccountTeamMember:', error);
            }
        }
        // Convert Map to array
        allAccounts = Array.from(accountMap.values());
    } else {
        // For admins or other roles, get all accounts
        // Filter by Type != 'Former Customer' to exclude former customers
        try {
            let adminQuery = `SELECT ${customFields} FROM Account WHERE Type != 'Former Customer' ORDER BY Name LIMIT 100`;
            try {
                const result = await conn.query(adminQuery);
                allAccounts = result.records || [];
            } catch (error) {
                if (error.errorCode === 'INVALID_FIELD') {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])('Custom fields not found, using standard fields only');
                    adminQuery = `SELECT ${standardFields} FROM Account WHERE Type != 'Former Customer' ORDER BY Name LIMIT 100`;
                    const result = await conn.query(adminQuery);
                    allAccounts = result.records || [];
                } else {
                    throw error;
                }
            }
        } catch (error) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error querying all accounts:', error);
            throw error;
        }
    }
    return allAccounts;
}
/**
 * Search for cached accounts in Supabase by name
 */ async function searchCachedAccounts(supabase, searchTerm) {
    if (!supabase || !searchTerm || searchTerm.trim().length < 2) {
        return null;
    }
    const search = searchTerm.trim();
    // Search in Supabase cache by account name (case-insensitive)
    const { data: cachedAccounts, error } = await supabase.from('accounts').select('*').ilike('name', `%${search}%`).order('name', {
        ascending: true
    }).limit(20);
    if (error || !cachedAccounts || cachedAccounts.length === 0) {
        return null;
    }
    // Check if cache is fresh (within TTL)
    const now = new Date();
    const cacheExpiry = CACHE_TTL.ACCOUNTS * 60 * 60 * 1000;
    // Check if all accounts are fresh (within TTL)
    const allFresh = cachedAccounts.every((acc)=>{
        if (!acc.last_synced_at) return false;
        const lastSynced = new Date(acc.last_synced_at);
        return now - lastSynced < cacheExpiry;
    });
    return {
        accounts: cachedAccounts,
        isFresh: allFresh
    };
}
/**
 * Search for accounts in Salesforce by name
 */ async function searchSalesforceAccounts(conn, searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
        return [];
    }
    const escapedSearch = escapeSOQL(searchTerm.trim());
    // Field selection - try custom fields first, fallback to standard
    // Using Employee_Band__c for Account Segment (Tier) - confirmed API name
    // Using Expiring_Revenue__c for Contract Value (Expiring ARR) - confirmed API name
    // Type is a standard field used to filter out "Former Customer" accounts
    const customFields = `Id, Name, Employee_Band__c, Expiring_Revenue__c, Type, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
    const standardFields = `Id, Name, Type, Industry, AnnualRevenue, OwnerId, Owner.Name, Owner.Email`;
    // Use LIKE for partial matching (case-insensitive)
    // Filter by Type != 'Former Customer' to exclude former customers
    let searchQuery = `SELECT ${customFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' AND Type != 'Former Customer' ORDER BY Name LIMIT 20`;
    try {
        const result = await conn.query(searchQuery);
        return result.records || [];
    } catch (error) {
        if (error.errorCode === 'INVALID_FIELD') {
            // Check if error is about Type field
            const typeError = error.message && error.message.includes('Type');
            if (typeError) {
                // Type field doesn't exist or has issues - retry without filter
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])('Type field issue on Account, searching without Type filter');
                try {
                    searchQuery = `SELECT ${customFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' ORDER BY Name LIMIT 20`;
                    const result = await conn.query(searchQuery);
                    return result.records || [];
                } catch (retryError) {
                    // If still fails, might be custom fields issue
                    if (retryError.errorCode === 'INVALID_FIELD') {
                        // Retry with standard fields (without Type filter)
                        searchQuery = `SELECT ${standardFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' ORDER BY Name LIMIT 20`;
                        const result = await conn.query(searchQuery);
                        return result.records || [];
                    } else {
                        throw retryError;
                    }
                }
            } else {
                // Not a Type error, try standard fields with Type filter
                try {
                    searchQuery = `SELECT ${standardFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' AND Type != 'Former Customer' ORDER BY Name LIMIT 20`;
                    const result = await conn.query(searchQuery);
                    return result.records || [];
                } catch (stdError) {
                    // If standard fields with Type filter fails, check if it's Type error
                    if (stdError.errorCode === 'INVALID_FIELD' && stdError.message && stdError.message.includes('Type')) {
                        // Last resort: standard fields without Type filter
                        searchQuery = `SELECT ${standardFields} FROM Account WHERE Name LIKE '%${escapedSearch}%' ORDER BY Name LIMIT 20`;
                        const result = await conn.query(searchQuery);
                        return result.records || [];
                    } else {
                        throw stdError;
                    }
                }
            }
        } else {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error searching accounts:', error);
            throw error;
        }
    }
}
/**
 * Sync accounts from Salesforce to Supabase
 * @param {Object} supabase - Supabase client
 * @param {Array} sfdcAccounts - Accounts from Salesforce
 * @param {string} userId - User ID (optional, only used if createRelationships is true)
 * @param {boolean} createRelationships - Whether to create user_accounts relationships (default: true)
 */ async function syncAccountsToSupabase(supabase, sfdcAccounts, userId = null, createRelationships = true) {
    if (!supabase || !sfdcAccounts || sfdcAccounts.length === 0) {
        return [];
    }
    const syncedAccounts = [];
    for (const sfdcAccount of sfdcAccounts){
        // Upsert account in Supabase
        // Handle custom fields that may not exist (they'll be undefined)
        // Try multiple possible field names for tier and contract value
        // Primary: Employee_Band__c (Account Segment - matches SOW-Generator)
        const accountTier = sfdcAccount.Employee_Band__c || sfdcAccount.Account_Segment__c || sfdcAccount.Account_Tier__c || sfdcAccount.Tier__c || sfdcAccount.AccountTier__c || sfdcAccount.Tier || null;
        // Primary: Expiring_Revenue__c (Expiring ARR - confirmed API name)
        const contractValue = sfdcAccount.Expiring_Revenue__c || sfdcAccount.Expiring_ARR__c || sfdcAccount.ExpiringARR__c || sfdcAccount.ARR_Expiring__c || sfdcAccount.Contract_Value__c || sfdcAccount.ContractValue__c || sfdcAccount.Contract_Value || sfdcAccount.ContractValue || null;
        const accountData = {
            salesforce_id: sfdcAccount.Id,
            name: sfdcAccount.Name,
            account_tier: accountTier,
            contract_value: contractValue,
            industry: sfdcAccount.Industry || null,
            annual_revenue: sfdcAccount.AnnualRevenue || null,
            owner_id: sfdcAccount.OwnerId || null,
            owner_name: sfdcAccount.Owner?.Name || null,
            last_synced_at: new Date().toISOString()
        };
        const { data: account, error: accountError } = await supabase.from('accounts').upsert(accountData, {
            onConflict: 'salesforce_id',
            ignoreDuplicates: false
        }).select().single();
        if (accountError) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(`Error syncing account ${sfdcAccount.Id}:`, accountError);
            continue;
        }
        // Only create user-account relationship if:
        // 1. createRelationships is true (regular query flow, not search)
        // 2. userId is provided
        // 3. The user is actually the owner of this account (verify ownership)
        if (createRelationships && userId && account) {
            // Verify that this account should be associated with this user
            // We'll check ownership when retrieving cached accounts, but we can also verify here
            // For now, we trust that syncAccountsToSupabase is only called with accounts the user owns/is a team member of
            const { error: relationError } = await supabase.from('user_accounts').upsert({
                user_id: userId,
                account_id: account.id
            }, {
                onConflict: 'user_id,account_id',
                ignoreDuplicates: true
            });
            if (relationError) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(`Error creating user-account relationship:`, relationError);
            }
        }
        syncedAccounts.push(account);
    }
    return syncedAccounts;
}
/**
 * Get cached accounts from Supabase
 * Returns accounts and whether they need refresh (based on last_synced_at)
 * Only returns accounts where the user is actually the owner (verified by owner_id matching Salesforce User ID)
 */ async function getCachedAccounts(supabase, userId, email, role) {
    if (!supabase) {
        return {
            accounts: null,
            needsRefresh: true
        };
    }
    // Get user
    let user;
    if (userId) {
        const { data: userData } = await supabase.from('users').select('*').eq('id', userId).single();
        user = userData;
    } else if (email) {
        const { data: userData } = await supabase.from('users').select('*').eq('email', email).single();
        user = userData;
    }
    if (!user) {
        return {
            accounts: null,
            needsRefresh: true
        };
    }
    // Get accounts from user_accounts relationships
    // These should only be accounts the user owns or is a team member of
    const { data: userAccounts, error: userAccountsError } = await supabase.from('user_accounts').select(`
      account_id,
      accounts (
        id,
        salesforce_id,
        name,
        account_tier,
        contract_value,
        industry,
        annual_revenue,
        owner_id,
        owner_name,
        last_synced_at
      )
    `).eq('user_id', user.id);
    if (userAccountsError) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error fetching user_accounts:', userAccountsError);
        return {
            accounts: null,
            needsRefresh: true
        };
    }
    if (!userAccounts || userAccounts.length === 0) {
        return {
            accounts: null,
            needsRefresh: true
        };
    }
    // Check if any account needs refresh (older than CACHE_TTL_HOURS)
    const now = new Date();
    const cacheExpiry = CACHE_TTL.ACCOUNTS * 60 * 60 * 1000; // Convert hours to milliseconds
    let needsRefresh = false;
    const accounts = userAccounts.filter((ua)=>ua.accounts) // Filter out any null accounts
    .map((ua)=>{
        const account = ua.accounts;
        if (!account) return null;
        const lastSynced = account.last_synced_at ? new Date(account.last_synced_at) : null;
        // Check if this account needs refresh
        if (!lastSynced || now - lastSynced > cacheExpiry) {
            needsRefresh = true;
        }
        return {
            id: account.salesforce_id || account.id,
            salesforceId: account.salesforce_id,
            name: account.name,
            accountTier: account.account_tier,
            contractValue: account.contract_value,
            industry: account.industry,
            annualRevenue: account.annual_revenue ? parseFloat(account.annual_revenue) : null,
            ownerId: account.owner_id,
            ownerName: account.owner_name,
            lastSyncedAt: account.last_synced_at
        };
    }).filter((acc)=>acc !== null); // Remove any null entries
    return {
        accounts,
        needsRefresh
    };
}
async function OPTIONS() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handlePreflight"])(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextRequest"]('http://localhost', {
        method: 'OPTIONS'
    }));
}
async function GET(request) {
    const preflight = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handlePreflight"])(request);
    if (preflight) return preflight;
    const sizeValidation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateRequestSize"])(request, MAX_REQUEST_SIZE.DEFAULT);
    if (!sizeValidation.valid) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error(sizeValidation.error.message), sizeValidation.error.status);
    }
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId')?.trim() || null;
    const email = searchParams.get('email')?.trim() || null;
    const role = searchParams.get('role')?.trim() || null;
    const forceRefresh = searchParams.get('forceRefresh');
    const search = searchParams.get('search');
    const ownerOnly = searchParams.get('ownerOnly');
    const cacheOnly = searchParams.get('cacheOnly');
    // Check if this is a search request
    const isSearch = search && search.trim().length >= 2;
    // Validate input (skip validation for search requests)
    if (!isSearch && !userId && !email) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Missing required parameters', {
            userId,
            email,
            role,
            isSearch
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Missing required parameter: userId or email (or search term)'), 400);
    }
    // Check if we should force refresh (bypass cache)
    const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';
    try {
        // Get Supabase client
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
        if (!supabase) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Supabase client is null - environment variables may not be set');
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Database connection not configured. Please check environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)'), 503);
        }
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateSupabase"])(supabase);
        if (!validation.valid) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(`Supabase validation failed: ${validation.error.message}`);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error(validation.error.message), validation.error.status);
        }
        // Handle search request (bypasses user assignment logic)
        if (isSearch) {
            try {
                // CACHE-FIRST: Check Supabase cache before querying Salesforce
                const cachedSearch = await searchCachedAccounts(supabase, search);
                if (cachedSearch && cachedSearch.isFresh) {
                    // Use cached results (fresh)
                    const accounts = cachedSearch.accounts.map((acc)=>({
                            id: acc.salesforce_id || acc.id,
                            salesforceId: acc.salesforce_id,
                            name: acc.name,
                            accountTier: acc.account_tier,
                            contractValue: acc.contract_value,
                            industry: acc.industry,
                            annualRevenue: acc.annual_revenue ? parseFloat(acc.annual_revenue) : null,
                            ownerId: acc.owner_id,
                            ownerName: acc.owner_name,
                            lastSyncedAt: acc.last_synced_at
                        }));
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
                        accounts: accounts,
                        total: accounts.length,
                        searchTerm: search,
                        isSearch: true,
                        cached: true
                    });
                } else {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`No cache found for search: ${search}, querying Salesforce`);
                }
                const sfdcAuth = await authenticateSalesforce(supabase);
                const searchResults = await searchSalesforceAccounts(sfdcAuth.connection, search);
                // Sync search results to Supabase (for caching) - but don't create user relationships
                // Pass createRelationships=false so searched accounts aren't associated with the searching user
                const syncedAccounts = await syncAccountsToSupabase(supabase, searchResults, null, false);
                const accounts = syncedAccounts.map((acc)=>({
                        id: acc.salesforce_id || acc.id,
                        salesforceId: acc.salesforce_id,
                        name: acc.name,
                        accountTier: acc.account_tier,
                        contractValue: acc.contract_value,
                        industry: acc.industry,
                        annualRevenue: acc.annual_revenue ? parseFloat(acc.annual_revenue) : null,
                        ownerId: acc.owner_id,
                        ownerName: acc.owner_name,
                        lastSyncedAt: acc.last_synced_at
                    }));
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
                    accounts: accounts,
                    total: accounts.length,
                    searchTerm: search,
                    isSearch: true,
                    cached: false
                });
            } catch (searchError) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Salesforce search error:', searchError);
                // If Salesforce fails but we have stale cache, use it
                const staleCache = await searchCachedAccounts(supabase, search);
                if (staleCache && staleCache.accounts.length > 0) {
                    const accounts = staleCache.accounts.map((acc)=>({
                            id: acc.salesforce_id || acc.id,
                            salesforceId: acc.salesforce_id,
                            name: acc.name,
                            accountTier: acc.account_tier,
                            contractValue: acc.contract_value,
                            industry: acc.industry,
                            annualRevenue: acc.annual_revenue ? parseFloat(acc.annual_revenue) : null,
                            ownerId: acc.owner_id,
                            ownerName: acc.owner_name,
                            lastSyncedAt: acc.last_synced_at
                        }));
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
                        accounts: accounts,
                        total: accounts.length,
                        searchTerm: search,
                        isSearch: true,
                        cached: true,
                        stale: true
                    });
                }
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(searchError, 500);
            }
        }
        // Regular flow: get user's assigned accounts
        // First, get the user by userId or email
        let user;
        try {
            if (userId && userId.trim()) {
                const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', userId).single();
                if (userError) {
                    if (userError.code === 'PGRST116') {
                        // User not found - try email instead
                        if (email && email.trim()) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])(`User not found by ID ${userId}, trying email ${email}`);
                        } else {
                            user = null;
                        }
                    } else {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error fetching user by ID:', userError);
                        throw userError;
                    }
                } else {
                    user = userData;
                }
            }
            // If user not found by ID, try email
            if (!user && email && email.trim()) {
                const { data: userData, error: userError } = await supabase.from('users').select('*').eq('email', email).single();
                if (userError) {
                    if (userError.code === 'PGRST116') {
                        // User not found in database
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(`User not found by email: ${email}`);
                        user = null;
                    } else {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error fetching user by email:', userError);
                        throw userError;
                    }
                } else {
                    user = userData;
                }
            }
            if (!user) {
                // User doesn't exist in database yet - return empty accounts instead of error
                // This can happen if user hasn't logged in through the proper flow
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])(`User not found in database - userId: ${userId || '(empty)'}, email: ${email || '(empty)'}. Returning empty accounts.`);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
                    accounts: [],
                    total: 0,
                    userId: null,
                    role: role || 'Account Manager',
                    cached: false,
                    message: 'User not found in database. Please log out and log back in to create your account.'
                });
            }
        } catch (userFetchError) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error in user lookup:', userFetchError);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(userFetchError, 500);
        }
        // Check cache first (unless force refresh is requested)
        let accounts = [];
        let useCached = false;
        let needsRefresh = true;
        if (!shouldForceRefresh) {
            try {
                const cacheResult = await getCachedAccounts(supabase, user.id, user.email, user.role);
                if (cacheResult && cacheResult.accounts && cacheResult.accounts.length > 0) {
                    accounts = cacheResult.accounts;
                    needsRefresh = cacheResult.needsRefresh || false;
                    if (!needsRefresh) {
                        useCached = true;
                    }
                }
            } catch (cacheError) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error getting cached accounts', cacheError);
                // Continue - will try Salesforce or return empty
                accounts = [];
                needsRefresh = true;
            }
        }
        // Query Salesforce if cache is stale/missing or force refresh requested
        // BUT: If we have cached accounts, only try Salesforce if force refresh is explicitly requested
        // This prevents unnecessary Salesforce calls when we have valid cached data
        // If cacheOnly is true, never query Salesforce - just return cached accounts (or empty)
        const shouldTrySalesforce = !(cacheOnly === 'true' || cacheOnly === '1') && (needsRefresh || shouldForceRefresh) && (shouldForceRefresh || accounts.length === 0);
        if (shouldTrySalesforce) {
            try {
                const sfdcAuth = await authenticateSalesforce(supabase);
                const sfdcAccounts = await querySalesforceAccounts(sfdcAuth.connection, user.id, user.email, user.role || role, ownerOnly === 'true' || ownerOnly === '1');
                // Sync accounts to Supabase
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isProduction"])()) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Syncing ${sfdcAccounts.length} accounts to Supabase...`);
                }
                const syncedAccounts = await syncAccountsToSupabase(supabase, sfdcAccounts, user.id);
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isProduction"])()) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Synced ${syncedAccounts.length} accounts to Supabase`);
                }
                // Transform to expected format
                accounts = syncedAccounts.map((acc)=>({
                        id: acc.salesforce_id || acc.id,
                        salesforceId: acc.salesforce_id,
                        name: acc.name,
                        accountTier: acc.account_tier,
                        contractValue: acc.contract_value,
                        industry: acc.industry,
                        annualRevenue: acc.annual_revenue ? parseFloat(acc.annual_revenue) : null,
                        ownerId: acc.owner_id,
                        ownerName: acc.owner_name,
                        lastSyncedAt: acc.last_synced_at
                    }));
                useCached = false;
            } catch (sfdcError) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Salesforce API error:', sfdcError);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error details:', sfdcError.message);
                if (sfdcError.stack) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error stack:', sfdcError.stack);
                }
                // If we have cached accounts, use them even if stale
                if (accounts.length > 0) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarn"])(`Salesforce query failed, using ${accounts.length} cached accounts (may be stale)`);
                    useCached = true;
                } else {
                    // No cached accounts available
                    // If cacheOnly mode, just return empty array instead of error
                    if (cacheOnly === 'true' || cacheOnly === '1') {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])('Cache-only mode: no cached accounts found, returning empty array');
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
                            accounts: [],
                            total: 0,
                            userId: user.id,
                            role: user.role || role || 'Account Manager',
                            cached: false
                        });
                    }
                    // Otherwise return error
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('No cached accounts available and Salesforce query failed');
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Failed to fetch accounts from Salesforce and no cached accounts available'), 500);
                }
            }
        } else if (accounts.length > 0) {
            // We have cached accounts and don't need to refresh
            useCached = true;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
            accounts: accounts,
            total: accounts.length,
            userId: user.id,
            role: user.role || role || 'Account Manager',
            cached: useCached
        });
    } catch (error) {
        // Enhanced error logging
        console.error('[salesforce-accounts] Error caught:', {
            message: error.message,
            name: error.name,
            code: error.code,
            details: error.details,
            stack: error.stack
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error in salesforce-accounts function:', error);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error message:', error.message);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error name:', error.name);
        if (error.stack) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error stack:', error.stack);
        }
        if (error.code) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error code:', error.code);
        }
        if (error.details) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error details:', error.details);
        }
        // Return a more descriptive error
        const errorMessage = error.message || 'Internal server error';
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error(`Failed to fetch accounts: ${errorMessage}`), 500);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__904fac3b._.js.map