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
"[project]/src/app/api/health/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Health Check API Route
 * Simple endpoint to test database connectivity
 */ __turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase-server.js [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        // Check environment variables
        const hasUrl = !!process.env.SUPABASE_URL;
        const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        const envStatus = {
            SUPABASE_URL: hasUrl ? '✅ Set' : '❌ Missing',
            SUPABASE_SERVICE_ROLE_KEY: hasKey ? '✅ Set' : '❌ Missing'
        };
        if (!hasUrl || !hasKey) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status: 'error',
                message: 'Environment variables not configured',
                environment: envStatus,
                timestamp: new Date().toISOString()
            }, {
                status: 503
            });
        }
        // Try to create Supabase client
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseClient"])();
        if (!supabase) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status: 'error',
                message: 'Failed to create Supabase client',
                environment: envStatus,
                timestamp: new Date().toISOString()
            }, {
                status: 503
            });
        }
        // Try a simple query to test connection
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status: 'error',
                message: 'Database query failed',
                error: error.message,
                code: error.code,
                environment: envStatus,
                timestamp: new Date().toISOString()
            }, {
                status: 503
            });
        }
        // Check which database we're using (local vs production)
        const supabaseUrl = process.env.SUPABASE_URL || '';
        const isLocal = supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost');
        const databaseType = isLocal ? 'Local Supabase' : 'Production Supabase';
        // Try to get user count to verify database has data
        const { count, error: countError } = await supabase.from('users').select('*', {
            count: 'exact',
            head: true
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: 'ok',
            message: 'Database connection successful',
            database: {
                type: databaseType,
                url: supabaseUrl.replace(/\/$/, ''),
                userCount: countError ? 'unknown' : count
            },
            environment: envStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: 'error',
            message: error.message || 'Unknown error',
            stack: ("TURBOPACK compile-time truthy", 1) ? error.stack : "TURBOPACK unreachable",
            timestamp: new Date().toISOString()
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__55d97baf._.js.map