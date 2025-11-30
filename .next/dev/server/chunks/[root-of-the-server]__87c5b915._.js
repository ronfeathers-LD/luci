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
"[project]/src/app/api/sentiment-analysis/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Next.js App Router API Route for Sentiment Analysis Data
 * 
 * Returns sentiment history for a given account, with optional filtering
 * OR returns a single sentiment analysis by ID
 * Supports both single account view and admin "all analyses" view
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
const { log, logError, isProduction } = __turbopack_context__.r("[project]/lib/api-helpers.js [app-route] (ecmascript)");
async function OPTIONS() {
    const response = new Response(null, {
        status: 200
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
}
async function GET(request) {
    try {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateSupabase"])(supabase);
        if (!validation.valid) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error(validation.error.message), validation.error.status);
        }
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const accountId = searchParams.get('accountId');
        const salesforceAccountId = searchParams.get('salesforceAccountId');
        const limit = searchParams.get('limit') || '50';
        const offset = searchParams.get('offset') || '0';
        const days = searchParams.get('days') || '365';
        const all = searchParams.get('all');
        const cached = searchParams.get('cached');
        // SINGLE ANALYSIS BY ID
        if (id) {
            const { data: analysis, error } = await supabase.from('sentiment_history').select(`
          *,
          accounts:account_id (
            id,
            name,
            salesforce_id
          ),
          users:user_id (
            id,
            email,
            name
          )
        `).eq('id', id).single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Sentiment analysis not found'), 404);
                }
                logError('Error fetching sentiment analysis:', error);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error(`Failed to fetch sentiment analysis: ${error.message}`), 500);
            }
            if (!analysis) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Sentiment analysis not found'), 404);
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
                analysis: analysis
            });
        }
        // HISTORY/ANALYSES LIST
        const isAdminView = all === 'true';
        // Calculate date filter
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(days));
        if (isAdminView) {
            // ADMIN VIEW: All analyses across all accounts
            let query = supabase.from('sentiment_history').select(`
          *,
          accounts:account_id (
            id,
            name,
            salesforce_id
          ),
          users:user_id (
            id,
            email,
            name
          )
        `).gte('analyzed_at', daysAgo.toISOString()).order('analyzed_at', {
                ascending: false
            });
            if (accountId) {
                query = query.eq('account_id', accountId);
            }
            if (cached === 'true') {
                query = query.not('input_hash', 'is', null);
            }
            query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
            let countQuery = supabase.from('sentiment_history').select('id', {
                count: 'exact',
                head: true
            }).gte('analyzed_at', daysAgo.toISOString());
            if (accountId) {
                countQuery = countQuery.eq('account_id', accountId);
            }
            if (cached === 'true') {
                countQuery = countQuery.not('input_hash', 'is', null);
            }
            const [queryResult, countResult] = await Promise.all([
                query,
                countQuery
            ]);
            const { data: analyses, error } = queryResult;
            if (error) {
                logError('Error fetching all analyses', error);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error(`Failed to fetch analyses: ${error.message}`), 500);
            }
            if (analyses && analyses.length > 0) {
                log(`Fetched ${analyses.length} analyses`);
            }
            const { count, error: countError } = countResult;
            if (countError) {
                logError('Error counting analyses', countError);
            }
            const stats = {
                total: count || analyses?.length || 0,
                cached: 0,
                unique: 0,
                averageScore: 0,
                byScore: {
                    high: 0,
                    medium: 0,
                    low: 0
                }
            };
            if (analyses && analyses.length > 0) {
                stats.cached = analyses.filter((a)=>a.input_hash).length;
                const uniqueHashes = new Set(analyses.filter((a)=>a.input_hash).map((a)=>a.input_hash));
                stats.unique = uniqueHashes.size;
                const scores = analyses.map((a)=>a.score);
                stats.averageScore = scores.reduce((a, b)=>a + b, 0) / scores.length;
                scores.forEach((score)=>{
                    if (score >= 8) stats.byScore.high++;
                    else if (score >= 5) stats.byScore.medium++;
                    else stats.byScore.low++;
                });
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
                analyses: analyses || [],
                stats,
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    total: count || analyses?.length || 0
                }
            });
        } else {
            // SINGLE ACCOUNT VIEW
            if (!accountId && !salesforceAccountId) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Missing required parameter: accountId or salesforceAccountId'), 400);
            }
            let resolvedAccountId = accountId;
            const isUUID = accountId && accountId.includes('-') && accountId.length === 36;
            if (!isUUID) {
                const lookupId = accountId || salesforceAccountId;
                if (lookupId) {
                    const { data: account, error: accountError } = await supabase.from('accounts').select('id').eq('salesforce_id', lookupId).single();
                    if (accountError || !account) {
                        logError('Account lookup error:', accountError);
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Account not found'), 404);
                    }
                    resolvedAccountId = account.id;
                }
            }
            if (!resolvedAccountId) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error('Could not resolve account ID'), 400);
            }
            let query = supabase.from('sentiment_history').select('*').eq('account_id', resolvedAccountId).gte('analyzed_at', daysAgo.toISOString()).order('analyzed_at', {
                ascending: false
            }).limit(parseInt(limit));
            const { data: history, error } = await query;
            if (error) {
                logError('Error fetching sentiment history:', error);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(new Error(`Failed to fetch sentiment history: ${error.message}`), 500);
            }
            const stats = {
                total: history?.length || 0,
                average: 0,
                min: 10,
                max: 1,
                trend: 'stable',
                recentAverage: 0,
                previousAverage: 0
            };
            if (history && history.length > 0) {
                const scores = history.map((h)=>h.score);
                stats.average = scores.reduce((a, b)=>a + b, 0) / scores.length;
                stats.min = Math.min(...scores);
                stats.max = Math.max(...scores);
                if (history.length >= 10) {
                    const recent = history.slice(0, 5);
                    const previous = history.slice(5, 10);
                    stats.recentAverage = recent.reduce((a, b)=>a + b.score, 0) / recent.length;
                    stats.previousAverage = previous.reduce((a, b)=>a + b.score, 0) / previous.length;
                    const diff = stats.recentAverage - stats.previousAverage;
                    if (diff > 0.5) {
                        stats.trend = 'improving';
                    } else if (diff < -0.5) {
                        stats.trend = 'declining';
                    }
                } else if (history.length >= 5) {
                    const recent = history.slice(0, 3);
                    const previous = history.slice(3, 5);
                    stats.recentAverage = recent.reduce((a, b)=>a + b.score, 0) / recent.length;
                    stats.previousAverage = previous.reduce((a, b)=>a + b.score, 0) / previous.length;
                    const diff = stats.recentAverage - stats.previousAverage;
                    if (diff > 0.5) {
                        stats.trend = 'improving';
                    } else if (diff < -0.5) {
                        stats.trend = 'declining';
                    }
                }
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendSuccessResponse"])({
                history: history || [],
                stats
            });
        }
    } catch (error) {
        logError('Error in sentiment-analysis function:', error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$next$2d$api$2d$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendErrorResponse"])(error, 500);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__87c5b915._.js.map