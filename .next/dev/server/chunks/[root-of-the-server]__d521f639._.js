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
"[project]/src/app/api/salesforce-cases/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Next.js App Router API Route for Salesforce Cases/Tickets
 * 
 * Fetches Cases from Salesforce for a specific account with intelligent caching
 * Only calls Salesforce API when cache is stale or missing
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
 * Get cached cases from Supabase
 */ async function getCachedCases(supabase, salesforceAccountId) {
    if (!supabase || !salesforceAccountId) {
        return null;
    }
    const { data: cases, error } = await supabase.from('cases').select('*').eq('salesforce_account_id', salesforceAccountId).order('created_date', {
        ascending: false
    }).limit(API_LIMITS.CASES_PER_ACCOUNT);
    if (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error querying cached cases', error);
        return null;
    }
    if (!cases || cases.length === 0) {
        return null;
    }
    const mostRecentSync = cases.reduce((latest, current)=>{
        const currentDate = current.last_synced_at ? new Date(current.last_synced_at) : new Date(0);
        const latestDate = latest ? new Date(latest) : new Date(0);
        return currentDate > latestDate ? current.last_synced_at : latest;
    }, null);
    const isFresh = isCacheFresh(mostRecentSync, CACHE_TTL.CASES);
    return {
        cases: cases,
        isFresh: isFresh,
        lastSyncedAt: mostRecentSync
    };
}
/**
 * Query Salesforce for Cases
 */ async function querySalesforceCases(conn, salesforceAccountId) {
    const escapedAccountId = escapeSOQL(salesforceAccountId);
    const caseQuery = `SELECT Id, CaseNumber, Subject, Status, Priority, Type, Reason, Origin, CreatedDate, ClosedDate, Description, 
                     ContactEmail, ContactId, Contact.Name
                     FROM Case 
                     WHERE AccountId = '${escapedAccountId}' 
                     ORDER BY CreatedDate DESC 
                     LIMIT ${API_LIMITS.CASES_PER_ACCOUNT}`;
    try {
        const result = await conn.query(caseQuery);
        const caseCount = result.records?.length || 0;
        if (caseCount === 0) {
            const simpleQuery = `SELECT Id, CaseNumber, Subject, Status, Priority, Type, Reason, Origin, CreatedDate, ClosedDate, Description, 
                           ContactEmail, ContactId
                           FROM Case 
                           WHERE AccountId = '${escapedAccountId}' 
                           ORDER BY CreatedDate DESC 
                           LIMIT ${API_LIMITS.CASES_PER_ACCOUNT}`;
            try {
                const simpleResult = await conn.query(simpleQuery);
                const simpleCount = simpleResult.records?.length || 0;
                if (simpleCount > 0) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`⚠️ Simpler query returned ${simpleCount} cases - Contact.Name field may be causing issues`);
                    const contactIds = simpleResult.records.filter((record)=>record.ContactId).map((record)=>record.ContactId);
                    if (contactIds.length > 0) {
                        const contactPromises = contactIds.map((contactId)=>conn.sobject('Contact').retrieve(contactId, [
                                'Name'
                            ]).then((contact)=>({
                                    contactId,
                                    contact
                                })).catch((error)=>({
                                    contactId,
                                    error
                                })));
                        const contactResults = await Promise.all(contactPromises);
                        const contactMap = new Map();
                        contactResults.forEach(({ contactId, contact, error })=>{
                            if (error) {
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(`Could not fetch Contact.Name for ContactId ${contactId}`, error);
                                contactMap.set(contactId, null);
                            } else {
                                contactMap.set(contactId, {
                                    Name: contact.Name
                                });
                            }
                        });
                        simpleResult.records.forEach((record)=>{
                            if (record.ContactId) {
                                record.Contact = contactMap.get(record.ContactId) || null;
                            }
                        });
                    }
                    return simpleResult.records || [];
                }
            } catch (simpleError) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Simple query also failed:', simpleError);
            }
        }
        return result.records || [];
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error querying Salesforce Cases:', error);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Query that failed:', caseQuery);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Account ID used:', salesforceAccountId);
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Attempting fallback query without Contact.Name for account ${salesforceAccountId}`);
            const fallbackQuery = `SELECT Id, CaseNumber, Subject, Status, Priority, Type, Reason, Origin, CreatedDate, ClosedDate, Description, 
                              ContactEmail, ContactId
                              FROM Case 
                              WHERE AccountId = '${escapedAccountId}' 
                              ORDER BY CreatedDate DESC 
                              LIMIT ${API_LIMITS.CASES_PER_ACCOUNT}`;
            const fallbackResult = await conn.query(fallbackQuery);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Fallback query returned ${fallbackResult.records?.length || 0} cases`);
            if (fallbackResult.records && fallbackResult.records.length > 0) {
                const contactIds = fallbackResult.records.filter((record)=>record.ContactId).map((record)=>record.ContactId);
                if (contactIds.length > 0) {
                    const contactPromises = contactIds.map((contactId)=>conn.sobject('Contact').retrieve(contactId, [
                            'Name'
                        ]).then((contact)=>({
                                contactId,
                                contact
                            })).catch((error)=>({
                                contactId,
                                error
                            })));
                    const contactResults = await Promise.all(contactPromises);
                    const contactMap = new Map();
                    contactResults.forEach(({ contactId, contact, error })=>{
                        if (error) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(`Could not fetch Contact.Name for ContactId ${contactId}`, error);
                            contactMap.set(contactId, null);
                        } else {
                            contactMap.set(contactId, {
                                Name: contact.Name
                            });
                        }
                    });
                    fallbackResult.records.forEach((record)=>{
                        if (record.ContactId) {
                            record.Contact = contactMap.get(record.ContactId) || null;
                        }
                    });
                }
            }
            return fallbackResult.records || [];
        } catch (fallbackError) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Fallback query also failed:', fallbackError);
            throw error;
        }
    }
}
/**
 * Sync cases to Supabase cache
 */ async function syncCasesToSupabase(supabase, sfdcCases, salesforceAccountId, accountId) {
    if (!supabase || !sfdcCases || sfdcCases.length === 0) {
        return [];
    }
    const syncedCases = [];
    for (const sfdcCase of sfdcCases){
        const caseData = {
            salesforce_id: sfdcCase.Id,
            salesforce_account_id: salesforceAccountId,
            account_id: accountId || null,
            case_number: sfdcCase.CaseNumber || null,
            subject: sfdcCase.Subject || null,
            status: sfdcCase.Status || null,
            priority: sfdcCase.Priority || null,
            type: sfdcCase.Type || null,
            reason: sfdcCase.Reason || null,
            origin: sfdcCase.Origin || null,
            created_date: sfdcCase.CreatedDate || null,
            closed_date: sfdcCase.ClosedDate || null,
            description: sfdcCase.Description || null,
            last_synced_at: new Date().toISOString()
        };
        if (sfdcCase.ContactEmail !== undefined) {
            caseData.contact_email = sfdcCase.ContactEmail || null;
        }
        if (sfdcCase.ContactId !== undefined) {
            caseData.contact_id = sfdcCase.ContactId || null;
        }
        if (sfdcCase.Contact?.Name !== undefined) {
            caseData.contact_name = sfdcCase.Contact?.Name || null;
        }
        const { data: caseRecord, error: caseError } = await supabase.from('cases').upsert(caseData, {
            onConflict: 'salesforce_id',
            ignoreDuplicates: false
        }).select().single();
        if (caseError) {
            if (caseError.code === 'PGRST204' && (caseError.message?.includes('contact_email') || caseError.message?.includes('contact_id') || caseError.message?.includes('contact_name'))) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(`Contact columns not found in cases table. Please run migration 013_add_case_contact_fields.sql. Retrying without contact fields for case ${sfdcCase.Id}`);
                delete caseData.contact_email;
                delete caseData.contact_id;
                delete caseData.contact_name;
                const { data: retryRecord, error: retryError } = await supabase.from('cases').upsert(caseData, {
                    onConflict: 'salesforce_id',
                    ignoreDuplicates: false
                }).select().single();
                if (retryError) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(`Error syncing case ${sfdcCase.Id} (retry without contact fields):`, retryError);
                    continue;
                }
                syncedCases.push(retryRecord);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(`Error syncing case ${sfdcCase.Id}:`, caseError);
                continue;
            }
        } else {
            syncedCases.push(caseRecord);
        }
    }
    return syncedCases;
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
    const salesforceAccountId = searchParams.get('salesforceAccountId');
    const accountId = searchParams.get('accountId');
    const forceRefresh = searchParams.get('forceRefresh');
    if (!salesforceAccountId) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Missing required parameter: salesforceAccountId'), 400);
    }
    const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateSupabase"])(supabase);
        if (!validation.valid) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error(validation.error.message), validation.error.status);
        }
        // CACHE-FIRST: Check Supabase cache before querying Salesforce
        if (!shouldForceRefresh) {
            const cached = await getCachedCases(supabase, salesforceAccountId);
            if (cached && cached.isFresh) {
                const mappedCases = cached.cases.map((c)=>({
                        id: c.salesforce_id,
                        caseNumber: c.case_number,
                        subject: c.subject,
                        status: c.status,
                        priority: c.priority,
                        type: c.type,
                        reason: c.reason,
                        origin: c.origin,
                        createdDate: c.created_date,
                        closedDate: c.closed_date,
                        description: c.description,
                        contactEmail: c.contact_email,
                        contactId: c.contact_id,
                        contactName: c.contact_name
                    }));
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
                    cases: mappedCases,
                    total: cached.cases.length,
                    cached: true,
                    lastSyncedAt: cached.lastSyncedAt
                });
            } else if (cached && !cached.isFresh) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Cache stale for account ${salesforceAccountId}, refreshing from Salesforce`);
            }
        }
        if (shouldForceRefresh) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Force refresh requested, querying Salesforce for account ${salesforceAccountId}`);
        }
        const sfdcAuth = await authenticateSalesforce(supabase);
        const sfdcCases = await querySalesforceCases(sfdcAuth.connection, salesforceAccountId);
        if (sfdcCases.length > 0) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Retrieved ${sfdcCases.length} cases from Salesforce`);
        }
        let accountUuid = null;
        const isLikelyUUID = accountId && accountId.includes('-') && accountId.length === 36;
        if (isLikelyUUID) {
            const [uuidResult, salesforceIdResult] = await Promise.all([
                supabase.from('accounts').select('id').eq('id', accountId).single(),
                supabase.from('accounts').select('id').eq('salesforce_id', salesforceAccountId).single()
            ]);
            accountUuid = uuidResult.data?.id || salesforceIdResult.data?.id || null;
        } else {
            const { data: account } = await supabase.from('accounts').select('id').eq('salesforce_id', salesforceAccountId).single();
            accountUuid = account?.id || null;
        }
        const syncedCases = await syncCasesToSupabase(supabase, sfdcCases, salesforceAccountId, accountUuid);
        const cases = syncedCases.map((c)=>({
                id: c.salesforce_id,
                caseNumber: c.case_number,
                subject: c.subject,
                status: c.status,
                priority: c.priority,
                type: c.type,
                reason: c.reason,
                origin: c.origin,
                createdDate: c.created_date,
                closedDate: c.closed_date,
                description: c.description,
                contactEmail: c.contact_email,
                contactId: c.contact_id,
                contactName: c.contact_name
            }));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
            cases: cases,
            total: cases.length,
            cached: false,
            lastSyncedAt: new Date().toISOString(),
            _debug: !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isProduction"])() ? {
                cacheLookup: false,
                casesCount: cases.length,
                salesforceAccountId: salesforceAccountId
            } : undefined
        });
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])('Error in salesforce-cases function:', error);
        // If Salesforce fails, try to return stale cache
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
        if (!shouldForceRefresh && supabase) {
            const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateSupabase"])(supabase);
            if (validation.valid) {
                const staleCache = await getCachedCases(supabase, salesforceAccountId);
                if (staleCache && staleCache.cases.length > 0) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])(`Salesforce query failed, using ${staleCache.cases.length} stale cached cases`);
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
                        cases: staleCache.cases.map((c)=>({
                                id: c.salesforce_id,
                                caseNumber: c.case_number,
                                subject: c.subject,
                                status: c.status,
                                priority: c.priority,
                                type: c.type,
                                reason: c.reason,
                                origin: c.origin,
                                createdDate: c.created_date,
                                closedDate: c.closed_date,
                                description: c.description,
                                contactEmail: c.contact_email,
                                contactId: c.contact_id,
                                contactName: c.contact_name
                            })),
                        total: staleCache.cases.length,
                        cached: true,
                        stale: true,
                        lastSyncedAt: staleCache.lastSyncedAt
                    });
                }
            }
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(error, 500);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d521f639._.js.map