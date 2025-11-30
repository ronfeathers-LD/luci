(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/shared/Header.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Global Header Component
// Used across all pages for consistent navigation
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const Header = ({ user, onSignOut, showHelp, setShowHelp })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const currentPath = pathname || '/';
    // Helper function to check if user has admin role (case-insensitive)
    const hasAdminRole = (userToCheck = user)=>{
        if (!userToCheck || !userToCheck.roles) return false;
        return userToCheck.roles.some((role)=>role.name && role.name.toLowerCase() === 'admin');
    };
    // Check if a tab is active
    const isActive = (path)=>{
        if (path === '/') {
            return currentPath === '/' || currentPath === '';
        }
        return currentPath.startsWith(path);
    };
    // Get build version for cache busting
    const getBuildVersion = ()=>{
        if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.getBuildVersion) {
            return window.getBuildVersion();
        }
        return Date.now().toString();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "bg-lean-black px-4 sm:px-6 lg:px-8 py-4 flex-shrink-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: `/ld-logo-abbr-green.png?v=${getBuildVersion()}`,
                                    alt: "LeanData Logo",
                                    className: "h-12 w-auto flex-shrink-0"
                                }, `logo-${getBuildVersion()}`, false, {
                                    fileName: "[project]/src/components/shared/Header.js",
                                    lineNumber: 43,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "typography-heading text-[#f7f7f7] mb-1",
                                            children: "L.U.C.I."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/shared/Header.js",
                                            lineNumber: 50,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-[#f7f7f7]",
                                            children: "LeanData Unified Customer Intelligence"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/shared/Header.js",
                                            lineNumber: 53,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/shared/Header.js",
                                    lineNumber: 49,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/shared/Header.js",
                            lineNumber: 41,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                setShowHelp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowHelp(!showHelp),
                                    className: "px-3 py-2 text-sm font-medium text-[#f7f7f7] hover:text-lean-green transition-colors flex items-center gap-2",
                                    "aria-label": "Show help and information",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/shared/Header.js",
                                                lineNumber: 68,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/shared/Header.js",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        showHelp ? 'Hide' : 'Help'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/shared/Header.js",
                                    lineNumber: 62,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 bg-lean-black/50 px-4 py-2 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-right",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>router.push('/user'),
                                                    className: "text-sm font-medium text-[#f7f7f7] hover:text-lean-green transition-colors cursor-pointer text-right",
                                                    "aria-label": "Go to account settings",
                                                    children: user?.name || 'User'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/shared/Header.js",
                                                    lineNumber: 75,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-[#f7f7f7]",
                                                    children: user?.email
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/shared/Header.js",
                                                    lineNumber: 82,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                user?.role && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-lean-green font-medium",
                                                    children: user.role
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/shared/Header.js",
                                                    lineNumber: 86,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/shared/Header.js",
                                            lineNumber: 74,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-8 h-8 rounded-full bg-lean-green flex items-center justify-center flex-shrink-0",
                                            children: [
                                                user?.picture ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: user.picture,
                                                    alt: user.name || 'User',
                                                    className: "w-8 h-8 rounded-full object-cover",
                                                    onError: (e)=>{
                                                        // Show fallback initials if image fails
                                                        e.target.style.display = 'none';
                                                        const fallback = e.target.nextSibling;
                                                        if (fallback) {
                                                            fallback.style.display = 'flex';
                                                        }
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/shared/Header.js",
                                                    lineNumber: 93,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)) : null,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-8 h-8 rounded-full bg-lean-green flex items-center justify-center text-white text-xs font-semibold",
                                                    style: {
                                                        display: user?.picture ? 'none' : 'flex'
                                                    },
                                                    children: user?.name ? user.name.split(' ').map((n)=>n[0]).join('').toUpperCase().substring(0, 2) : user?.email ? user.email.substring(0, 2).toUpperCase() : 'U'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/shared/Header.js",
                                                    lineNumber: 107,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/shared/Header.js",
                                            lineNumber: 91,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/shared/Header.js",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        if (onSignOut) {
                                            onSignOut();
                                        } else {
                                            if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.google?.accounts?.id) {
                                                window.google.accounts.id.disableAutoSelect();
                                            }
                                            localStorage.removeItem('userInfo');
                                            window.location.reload();
                                        }
                                    },
                                    className: "px-4 py-2 text-sm font-medium text-[#f7f7f7] hover:text-lean-green transition-colors whitespace-nowrap",
                                    children: "Sign Out"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/shared/Header.js",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/shared/Header.js",
                            lineNumber: 60,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/shared/Header.js",
                    lineNumber: 40,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between gap-1 border-b border-[#f7f7f7]/20",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push('/'),
                                    className: `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${isActive('/') && currentPath !== '/user' && currentPath !== '/calendar' && currentPath !== '/analyze' && !currentPath.startsWith('/admin') && !currentPath.startsWith('/account') && !currentPath.startsWith('/sentiment') ? 'text-lean-green border-lean-green' : 'text-[#f7f7f7]/70 border-transparent hover:text-[#f7f7f7] hover:border-[#f7f7f7]/30'}`,
                                    "aria-label": "Go to dashboard",
                                    children: "Dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/shared/Header.js",
                                    lineNumber: 142,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push('/analyze'),
                                    className: `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${isActive('/analyze') ? 'text-lean-green border-lean-green' : 'text-[#f7f7f7]/70 border-transparent hover:text-[#f7f7f7] hover:border-[#f7f7f7]/30'}`,
                                    "aria-label": "Run sentiment analysis",
                                    children: "Analyze"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/shared/Header.js",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push('/user'),
                                    className: `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${isActive('/user') ? 'text-lean-green border-lean-green' : 'text-[#f7f7f7]/70 border-transparent hover:text-[#f7f7f7] hover:border-[#f7f7f7]/30'}`,
                                    "aria-label": "Manage my accounts",
                                    children: "My Accounts"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/shared/Header.js",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push('/calendar'),
                                    className: `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${isActive('/calendar') ? 'text-lean-green border-lean-green' : 'text-[#f7f7f7]/70 border-transparent hover:text-[#f7f7f7] hover:border-[#f7f7f7]/30'}`,
                                    "aria-label": "View calendar",
                                    children: "Calendar"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/shared/Header.js",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/shared/Header.js",
                            lineNumber: 141,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        hasAdminRole(user) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push('/admin'),
                            className: `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${isActive('/admin') ? 'text-blue-400 border-blue-400' : 'text-[#f7f7f7]/70 border-transparent hover:text-[#f7f7f7] hover:border-[#f7f7f7]/30'}`,
                            "aria-label": "Go to admin panel",
                            children: "Admin"
                        }, void 0, false, {
                            fileName: "[project]/src/components/shared/Header.js",
                            lineNumber: 188,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/shared/Header.js",
                    lineNumber: 140,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/shared/Header.js",
            lineNumber: 38,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/shared/Header.js",
        lineNumber: 37,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Header, "gA9e4WsoP6a20xDgQgrFkfMP8lc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Header;
const __TURBOPACK__default__export__ = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shared/Icons.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Shared Icon Components
__turbopack_context__.s([
    "LoaderIcon",
    ()=>LoaderIcon,
    "TrendingDownIcon",
    ()=>TrendingDownIcon,
    "TrendingUpIcon",
    ()=>TrendingUpIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const TrendingUpIcon = ({ className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "22 7 13.5 15.5 8.5 10.5 2 17"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/Icons.js",
                lineNumber: 6,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "16 7 22 7 22 13"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/Icons.js",
                lineNumber: 7,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/Icons.js",
        lineNumber: 5,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = TrendingUpIcon;
const TrendingDownIcon = ({ className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "22 17 13.5 8.5 8.5 13.5 2 7"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/Icons.js",
                lineNumber: 13,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "16 17 22 17 22 11"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/Icons.js",
                lineNumber: 14,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/Icons.js",
        lineNumber: 12,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = TrendingDownIcon;
const LoaderIcon = ({ className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "2",
                x2: "12",
                y2: "6"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/Icons.js",
                lineNumber: 20,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "18",
                x2: "12",
                y2: "22"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/Icons.js",
                lineNumber: 21,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "4.93",
                y1: "4.93",
                x2: "7.76",
                y2: "7.76"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/Icons.js",
                lineNumber: 22,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "16.24",
                y1: "16.24",
                x2: "19.07",
                y2: "19.07"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/Icons.js",
                lineNumber: 23,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "2",
                y1: "12",
                x2: "6",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/Icons.js",
                lineNumber: 24,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "18",
                y1: "12",
                x2: "22",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/Icons.js",
                lineNumber: 25,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "4.93",
                y1: "19.07",
                x2: "7.76",
                y2: "16.24"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/Icons.js",
                lineNumber: 26,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "16.24",
                y1: "7.76",
                x2: "19.07",
                y2: "4.93"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/Icons.js",
                lineNumber: 27,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/Icons.js",
        lineNumber: 19,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c2 = LoaderIcon;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "TrendingUpIcon");
__turbopack_context__.k.register(_c1, "TrendingDownIcon");
__turbopack_context__.k.register(_c2, "LoaderIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/client-utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Client Utilities for Next.js
 * 
 * Provides client-side utilities that replace window.* globals
 * Can be imported in components
 */ /**
 * Deduplicated fetch wrapper
 * Falls back to regular fetch if deduplication script isn't loaded
 */ __turbopack_context__.s([
    "categorizeContactLevel",
    ()=>categorizeContactLevel,
    "deduplicatedFetch",
    ()=>deduplicatedFetch,
    "formatCurrency",
    ()=>formatCurrency,
    "getBuildVersion",
    ()=>getBuildVersion,
    "getSupabaseClient",
    ()=>getSupabaseClient,
    "isProduction",
    ()=>isProduction,
    "log",
    ()=>log,
    "logError",
    ()=>logError,
    "logWarn",
    ()=>logWarn,
    "pageView",
    ()=>pageView,
    "trackAnalytics",
    ()=>trackAnalytics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function deduplicatedFetch(...args) {
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.deduplicatedFetch) {
        return window.deduplicatedFetch(...args);
    }
    return fetch(...args);
}
function logError(message, error, ...args) {
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.logError) {
        return window.logError(message, error, ...args);
    }
    console.error(message, error, ...args);
}
function log(message, ...args) {
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.log) {
        return window.log(message, ...args);
    }
    console.log(message, ...args);
}
function logWarn(message, ...args) {
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.logWarn) {
        return window.logWarn(message, ...args);
    }
    console.warn(message, ...args);
}
function trackAnalytics(event, data) {
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.analytics) {
        return window.analytics.track(event, data);
    }
    if ("TURBOPACK compile-time truthy", 1) {
        console.log('[Analytics] Track:', event, data);
    }
}
function pageView(page) {
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.analytics) {
        return window.analytics.pageView(page);
    }
    if ("TURBOPACK compile-time truthy", 1) {
        console.log('[Analytics] Page View:', page);
    }
}
function getSupabaseClient() {
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.supabase) {
        return window.supabase;
    }
    throw new Error('Supabase client not available. Make sure it\'s initialized.');
}
function categorizeContactLevel(title) {
    if (!title) return 'Other';
    const titleLower = title.toLowerCase();
    // C-Level executives
    const cLevelPatterns = [
        /^chief/i,
        /^c\s*[-.]?\s*level/i,
        /^c\s*[-.]?\s*suite/i,
        /president/i,
        /^ceo/i,
        /^cto/i,
        /^cfo/i,
        /^coo/i,
        /^cmo/i,
        /^chro/i,
        /^chief\s+executive/i,
        /^chief\s+technology/i,
        /^chief\s+financial/i,
        /^chief\s+operating/i,
        /^chief\s+marketing/i,
        /^chief\s+human/i
    ];
    // Senior Level (VP, SVP, Director, etc.)
    const srLevelPatterns = [
        /^vice\s+president/i,
        /^vp/i,
        /^svp/i,
        /^evp/i,
        /^senior\s+vice\s+president/i,
        /^executive\s+vice\s+president/i,
        /^director/i,
        /^senior\s+director/i,
        /^executive\s+director/i,
        /^head\s+of/i,
        /^general\s+manager/i,
        /^gm\b/i
    ];
    // Check C-Level first
    if (cLevelPatterns.some((pattern)=>pattern.test(titleLower))) {
        return 'C-Level';
    }
    // Check Senior Level
    if (srLevelPatterns.some((pattern)=>pattern.test(titleLower))) {
        return 'Sr. Level';
    }
    return 'Other';
}
function formatCurrency(value) {
    if (!value || value === 'N/A' || value === null || value === undefined) {
        return 'N/A';
    }
    // If it's already a formatted string with $, return as is
    if (typeof value === 'string' && value.includes('$')) {
        return value;
    }
    // Convert to number if it's a string
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
    // Check if it's a valid number
    if (isNaN(numValue)) {
        return value; // Return original if not a number
    }
    // Format as US currency
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numValue);
}
function getBuildVersion() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const htmlTag = document.documentElement;
    return htmlTag.getAttribute('data-build-version') || document.querySelector('meta[name="build-version"]')?.content || 'unknown';
}
function isProduction() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/SentimentAnalyzer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// SentimentAnalyzer Component
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Header$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/Header.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shared/Icons.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/client-utils.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// Helper Functions
// Fetch Avoma transcription data (with caching)
const fetchAvomaData = async (customerIdentifier, salesforceAccountId = null)=>{
    try {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deduplicatedFetch"])('/api/avoma-transcription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerIdentifier: customerIdentifier,
                salesforceAccountId: salesforceAccountId
            })
        });
        const responseClone = response.clone();
        if (!response.ok) {
            // Only throw error for actual API errors, not missing transcriptions
            const errorData = await responseClone.json();
            throw new Error(errorData.error || 'Failed to fetch transcription');
        }
        const data = await responseClone.json();
        // Return transcription, meeting counts, and any warning
        return {
            transcription: data.transcription || '',
            meetingCounts: data.meetingCounts || null,
            warning: data.warning || null
        };
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error fetching Avoma transcription:', error);
        // Return empty data instead of throwing - allow analysis to continue
        return {
            transcription: '',
            meetingCounts: null,
            warning: 'Unable to fetch Avoma transcription. Analysis will proceed with Salesforce data only.'
        };
    }
};
// Fetch Salesforce customer context (using real account data + cases)
// Note: This function is defined outside component but doesn't use component state
// Cases should be passed in from component state (already fetched via fetchCasesForAccount)
const fetchSalesforceData = async (customerIdentifier, accountData = null, existingCases = [])=>{
    // Use account data if provided, otherwise return minimal context
    if (!accountData) {
        return {
            account_tier: "Unknown",
            contract_value: "Unknown",
            account_manager: "Unknown"
        };
    }
    // Use existing cases from component state instead of making redundant API call
    // Cases are already loaded via fetchCasesForAccount when account is selected
    const recentCases = existingCases || [];
    const totalCasesCount = recentCases.length;
    // Return real Salesforce account data with cases
    // Include more case details for sentiment analysis (description, type, reason, etc.)
    return {
        account_tier: accountData.accountTier || null,
        contract_value: accountData.contractValue || null,
        account_id: accountData.id,
        account_name: accountData.name,
        industry: accountData.industry || null,
        annual_revenue: accountData.annualRevenue || null,
        account_manager: accountData.ownerName || null,
        recent_tickets: recentCases.map((c)=>({
                id: c.caseNumber || c.id,
                subject: c.subject || null,
                status: c.status || null,
                priority: c.priority || null,
                type: c.type || null,
                reason: c.reason || null,
                origin: c.origin || null,
                created_date: c.createdDate || null,
                closed_date: c.closedDate || null,
                description: c.description || null,
                contact_email: c.contactEmail || null,
                contact_id: c.contactId || null,
                contact_name: c.contactName || null
            })),
        total_cases_count: totalCasesCount
    };
};
// Analyze sentiment using secure Vercel Serverless Function
const analyzeSentiment = async (transcription, salesforceContext, userId, accountId, salesforceAccountId, customerIdentifier, forceRefresh = false)=>{
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deduplicatedFetch"])('/api/analyze-sentiment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            transcription,
            salesforceContext,
            userId,
            accountId,
            salesforceAccountId,
            customerIdentifier,
            forceRefresh: forceRefresh
        })
    });
    const responseClone = response.clone();
    if (!response.ok) {
        const errorData = await responseClone.json().catch(()=>({
                error: 'Unknown error'
            }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
    }
    const result = await responseClone.json();
    // Validate score is within range
    if (result.score < 1 || result.score > 10) {
        throw new Error('Invalid sentiment score returned from API');
    }
    return result;
};
// Icon Components are already defined in Icons.js and exported to window
// Main SentimentAnalyzer Component
const SentimentAnalyzer = ({ user, onSignOut })=>{
    _s();
    var _s1 = __turbopack_context__.k.signature();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [accounts, setAccounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedAccount, setSelectedAccount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loadingAccounts, setLoadingAccounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [customerIdentifier, setCustomerIdentifier] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sentiment, setSentiment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [retryCount, setRetryCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSearchMode, setIsSearchMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dataSources, setDataSources] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Track data sources used
    const [analysisData, setAnalysisData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Store actual data used for analysis
    const [showDataDetails, setShowDataDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Toggle for showing data details
    const [cases, setCases] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // Store cases for the selected account
    const [casesLoading, setCasesLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Loading state for cases
    const [casesLoadingFromCache, setCasesLoadingFromCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Track if loading from cache vs Salesforce
    const [showCasesList, setShowCasesList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Toggle for showing cases list
    const [contacts, setContacts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // Store contacts for the selected account
    const [contactsLoading, setContactsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Loading state for contacts
    const [contactsLoadingFromCache, setContactsLoadingFromCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Track if loading from cache vs Salesforce
    const [showContactsList, setShowContactsList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Toggle for showing contacts list
    const [showHelp, setShowHelp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Toggle for showing help page
    const [showResultsPage, setShowResultsPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Navigate to results page
    const [sentimentHistory, setSentimentHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Historical sentiment data
    const [historyLoading, setHistoryLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Loading state for history
    const [cachedSentiment, setCachedSentiment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Most recent cached sentiment for selected account
    const [checkingCache, setCheckingCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Loading state for cache check
    const [avomaWarning, setAvomaWarning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Warning message for missing Avoma data
    const maxRetries = 3;
    // HelpPage component - reusable help content (defined early for use throughout component)
    const HelpPage = ({ onClose })=>{
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-lean-white rounded-lg shadow-lg p-8 mb-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "typography-heading text-lean-black",
                            children: "How Sentiment Analysis Works"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 180,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-lean-black-60 hover:text-lean-black",
                            "aria-label": "Close help",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-6 h-6",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M6 18L18 6M6 6l12 12"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 187,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 186,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 181,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                    lineNumber: 179,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "prose max-w-none space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "typography-heading text-lean-black mb-3",
                                    children: "Overview"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 194,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "typography-body text-lean-black-80",
                                    children: "L.U.C.I. uses Google Gemini AI to analyze customer sentiment by combining conversation transcripts from Avoma meetings with comprehensive Salesforce account context. The analysis provides a score from 1-10 and detailed insights about the customer relationship."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 195,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 193,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "typography-heading text-lean-black mb-3",
                                    children: "Data Sources Analyzed"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-lean-green-10 rounded-lg p-4 border-l-4 border-lean-green",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-lean-black mb-2",
                                                    children: "1. Avoma Conversation Transcripts"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 204,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lean-black-80 text-sm",
                                                    children: "The AI analyzes the actual conversation between your team and the customer, looking for:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 205,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "list-disc list-inside text-lean-black-80 text-sm mt-2 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Tone and emotional indicators (frustration, satisfaction, urgency)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 209,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Language patterns and sentiment signals"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 210,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Initial concerns and how they were addressed"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 211,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Resolution quality and final satisfaction level"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 212,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 208,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 203,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-lean-green-10 rounded-lg p-4 border-l-4 border-lean-green",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-lean-black mb-2",
                                                    children: "2. Salesforce Support Cases"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 217,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lean-black-80 text-sm",
                                                    children: "Recent support cases provide critical context:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 218,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "list-disc list-inside text-lean-black-80 text-sm mt-2 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Case Count:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 222,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Number of recent cases (more cases may indicate issues)"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 222,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Case Descriptions:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 223,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Customer feedback and issue details"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 223,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Priority & Status:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 224,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " High priority or unresolved cases signal risk"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 224,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Case Types & Reasons:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 225,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Patterns in support needs"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 225,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Resolution Timelines:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 226,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " How quickly issues are resolved"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 226,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "⚠️ Contact Level Involvement:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 227,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "CRITICAL INDICATOR"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 227,
                                                                    columnNumber: 70
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " - C-Level or Sr. Level executives submitting support cases is a major red flag indicating serious escalation"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 227,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 221,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 216,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-lean-almost-white rounded-lg p-4 border-l-4 border-lean-black/20",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-lean-black mb-2",
                                                    children: "3. Account Profile Context"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 232,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lean-black-80 text-sm",
                                                    children: "Account characteristics help set appropriate expectations:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 233,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "list-disc list-inside text-lean-black-80 text-sm mt-2 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Account Tier:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 237,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Higher tier accounts may have different expectations"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 237,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Contract Value:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 238,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Expiring ARR indicates renewal risk"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 238,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Industry:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 239,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Industry norms and standards"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 239,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Account Manager:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 240,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Relationship context"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 240,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 236,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 231,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-lean-almost-white rounded-lg p-4 border-l-4 border-lean-green",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-lean-black mb-2",
                                                    children: "4. Engagement Metrics"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 245,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lean-black-80 text-sm",
                                                    children: "Meeting participation and frequency:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 246,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "list-disc list-inside text-lean-black-80 text-sm mt-2 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Total Avoma calls/meetings with the customer"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 250,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Number of meetings with ready transcripts"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 251,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Engagement frequency and participation"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 252,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 249,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 244,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-lean-green-10 rounded-lg p-4 border-l-4 border-lean-green",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-lean-black mb-2",
                                                    children: "5. Contact Intelligence & Professional Context"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 257,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lean-black-80 text-sm",
                                                    children: "Enriched contact data from Salesforce provides deep insights:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 258,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "list-disc list-inside text-lean-black-80 text-sm mt-2 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Contact Level Breakdown:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 262,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " C-Level, Sr. Level, and Other contacts categorized by title"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 262,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Case Involvement by Level:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 263,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Which contact levels are submitting support cases (C-Level involvement = major concern)"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 263,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Job Change Signals:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 264,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Recent job changes or high job change likelihood indicate account risk"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 264,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Stale Relationships:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 265,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Contacts with no activity in 90+ days may indicate disengagement"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 265,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Engagement Signals:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 266,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Social media interactions with company content"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 266,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: "Professional Context:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 267,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Department, reporting structure, company size, industry, and technologies"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 267,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 261,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 256,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 202,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 200,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-lean-black mb-3",
                                    children: "Sentiment Score Scale"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 274,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-red-50 rounded-lg p-4 border-2 border-red-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold text-red-600 mb-2",
                                                    children: "1-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 277,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-semibold text-lean-black mb-1",
                                                    children: "At Risk"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 278,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-lean-black-80",
                                                    children: "Very negative sentiment. Customer may be at risk of churn. Immediate attention required."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 279,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 276,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold text-yellow-600 mb-2",
                                                    children: "5-7"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 282,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-semibold text-lean-black mb-1",
                                                    children: "Neutral/Mixed"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 283,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-lean-black-80",
                                                    children: "Mixed or neutral sentiment. Relationship is stable but needs attention to improve."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 284,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 281,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-green-50 rounded-lg p-4 border-2 border-green-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl font-bold text-lean-green mb-2",
                                                    children: "8-10"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 287,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-semibold text-lean-black mb-1",
                                                    children: "Positive"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 288,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-lean-black-80",
                                                    children: "Strong positive sentiment. Customer is satisfied and may be a strong advocate."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 289,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 286,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 275,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 273,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-lean-black mb-3",
                                    children: "What the Analysis Includes"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 295,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lean-black-80 leading-relaxed mb-3",
                                    children: "Each sentiment analysis provides two levels of detail:"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 296,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-lean-almost-white rounded-lg p-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold text-lean-black mb-1",
                                                    children: "Executive Summary (150 words)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 301,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-lean-black-80",
                                                    children: "A concise, high-level overview for C-level executives focusing on overall sentiment, top critical factors, immediate actions, and relationship health status."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 302,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 300,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-lean-almost-white rounded-lg p-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold text-lean-black mb-1",
                                                    children: "Comprehensive Analysis (500-800 words)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 307,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-lean-black-80",
                                                    children: "A detailed, in-depth analysis for CSMs and Account Managers including detailed factor breakdown, specific concerns/positive signals with examples, relationship trajectory with evidence, contact level involvement analysis, support case patterns, engagement metrics, risk factors, opportunities, and detailed recommendations."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 308,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 306,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 299,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lean-black-80 leading-relaxed mb-2",
                                    children: "Both analyses include:"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 313,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "list-disc list-inside text-lean-black-80 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Key Factors:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 317,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " What most influenced the sentiment score"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 317,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Specific Concerns or Signals:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 318,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Identified issues or positive indicators"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 318,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Relationship Trajectory:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 319,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Whether sentiment is improving, declining, or stable"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 319,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Contact Level Analysis:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 320,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Critical assessment of which contact levels are involved in support cases"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 320,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Actionable Insights:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 321,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Detailed recommendations for account management"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 321,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 294,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-lean-black mb-3",
                                    children: "Best Practices"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 326,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-lean-almost-white rounded-lg p-4 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-lean-black-80",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "✓ Regular Monitoring:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 329,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Check sentiment after important meetings or when support cases are resolved"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 328,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-lean-black-80",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "✓ Context Matters:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 332,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Review the detailed data sources to understand what influenced the score"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 331,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-lean-black-80",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "✓ Action on Low Scores:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 335,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Scores of 4 or below indicate immediate attention is needed"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 334,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-lean-black-80",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "✓ Track Trends:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 338,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Monitor sentiment over time to identify improving or declining relationships"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 337,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 327,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 325,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "pt-4 border-t border-lean-black/20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-lean-black-60",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "AI Model:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 345,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " Google Gemini (auto-discovered best available model)",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 345,
                                        columnNumber: 94
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Analysis Framework:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 346,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " 6-dimensional analysis (Conversation, Support Context, Account Profile, Engagement, Contact Intelligence, Overall Assessment)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 344,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 343,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                    lineNumber: 192,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/SentimentAnalyzer.js",
            lineNumber: 178,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    };
    // Fetch cases for an account (can be called independently)
    const fetchCasesForAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SentimentAnalyzer.useCallback[fetchCasesForAccount]": async (accountData)=>{
            if (!accountData) {
                setCases([]);
                setCasesLoading(false);
                setCasesLoadingFromCache(false);
                return;
            }
            // Use salesforceId if available, otherwise check if id is a Salesforce ID (no dashes, 15 or 18 chars)
            // UUIDs have dashes, Salesforce IDs don't
            const salesforceAccountId = accountData.salesforceId || (accountData.id && !accountData.id.includes('-') && (accountData.id.length === 15 || accountData.id.length === 18) ? accountData.id : null);
            if (!salesforceAccountId) {
                setCases([]);
                setCasesLoading(false);
                setCasesLoadingFromCache(false);
                return;
            }
            setCasesLoading(true);
            // Optimistically assume cache first (will be updated if Salesforce is queried)
            setCasesLoadingFromCache(true);
            try {
                const params = new URLSearchParams({
                    salesforceAccountId: salesforceAccountId,
                    accountId: accountData.id
                });
                const casesResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deduplicatedFetch"])(`/api/salesforce-cases?${params}`);
                const casesResponseClone = casesResponse.clone();
                if (casesResponse.ok) {
                    const casesData = await casesResponseClone.json();
                    const fetchedCases = casesData.cases || [];
                    // Update loading source based on response
                    setCasesLoadingFromCache(casesData.cached === true);
                    setCases(fetchedCases);
                } else {
                    const errorData = await casesResponseClone.json().catch({
                        "SentimentAnalyzer.useCallback[fetchCasesForAccount]": ()=>({})
                    }["SentimentAnalyzer.useCallback[fetchCasesForAccount]"]);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error fetching cases:', new Error(errorData.message || errorData.error || `HTTP ${casesResponse.status}`));
                    setCases([]);
                }
            } catch (err) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error fetching cases:', err);
                setCases([]);
            } finally{
                setCasesLoading(false);
            }
        }
    }["SentimentAnalyzer.useCallback[fetchCasesForAccount]"], []);
    // Fetch contacts for an account (can be called independently)
    const fetchContactsForAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SentimentAnalyzer.useCallback[fetchContactsForAccount]": async (accountData)=>{
            if (!accountData) {
                setContacts([]);
                setContactsLoading(false);
                setContactsLoadingFromCache(false);
                return;
            }
            // Use salesforceId if available, otherwise check if id is a Salesforce ID (no dashes, 15 or 18 chars)
            // UUIDs have dashes, Salesforce IDs don't
            const salesforceAccountId = accountData.salesforceId || (accountData.id && !accountData.id.includes('-') && (accountData.id.length === 15 || accountData.id.length === 18) ? accountData.id : null);
            if (!salesforceAccountId) {
                setContacts([]);
                setContactsLoading(false);
                setContactsLoadingFromCache(false);
                return;
            }
            setContactsLoading(true);
            // Optimistically assume cache first (will be updated if Salesforce is queried)
            setContactsLoadingFromCache(true);
            try {
                const params = new URLSearchParams({
                    salesforceAccountId: salesforceAccountId,
                    accountId: accountData.id
                });
                const contactsResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deduplicatedFetch"])(`/api/salesforce-contacts?${params}`);
                const contactsResponseClone = contactsResponse.clone();
                if (contactsResponse.ok) {
                    const contactsData = await contactsResponseClone.json();
                    const fetchedContacts = contactsData.contacts || [];
                    // Update loading source based on response
                    setContactsLoadingFromCache(contactsData.cached === true);
                    // Log whether we got cached or fresh data
                    if (contactsData.cached) {
                    // Contacts loaded from cache
                    }
                    setContacts(fetchedContacts);
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isProduction"])()) {}
                } else {
                    const errorData = await contactsResponse.json().catch({
                        "SentimentAnalyzer.useCallback[fetchContactsForAccount]": ()=>({})
                    }["SentimentAnalyzer.useCallback[fetchContactsForAccount]"]);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error fetching contacts:', new Error(errorData.message || errorData.error || `HTTP ${contactsResponse.status}`));
                    setContacts([]);
                }
            } catch (err) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error fetching contacts:', err);
                setContacts([]);
            } finally{
                setContactsLoading(false);
            }
        }
    }["SentimentAnalyzer.useCallback[fetchContactsForAccount]"], []);
    // Fetch cached accounts from user_accounts (no Salesforce query, just cached data)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SentimentAnalyzer.useEffect": ()=>{
            const fetchCachedAccounts = {
                "SentimentAnalyzer.useEffect.fetchCachedAccounts": async ()=>{
                    if (!user?.id && !user?.email) {
                        setLoadingAccounts(false);
                        return;
                    }
                    try {
                        setLoadingAccounts(true);
                        setError(null);
                        // Fetch cached accounts only - don't query Salesforce, just return what's in user_accounts
                        const params = new URLSearchParams({
                            userId: user.id || '',
                            email: user.email || '',
                            role: user.role || '',
                            cacheOnly: 'true'
                        });
                        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deduplicatedFetch"])(`/api/salesforce-accounts?${params}`);
                        const responseClone = response.clone();
                        if (!response.ok) {
                            const errorData = await responseClone.json().catch({
                                "SentimentAnalyzer.useEffect.fetchCachedAccounts": ()=>({})
                            }["SentimentAnalyzer.useEffect.fetchCachedAccounts"]);
                            // Don't throw error for empty accounts - that's expected if user hasn't added any yet
                            if (errorData.error && !errorData.error.includes('not found')) {
                                throw new Error(errorData.message || errorData.error || 'Failed to fetch accounts');
                            }
                            setAccounts([]);
                            setLoadingAccounts(false);
                            return;
                        }
                        const data = await responseClone.json();
                        const cachedAccounts = data.accounts || [];
                        setAccounts(cachedAccounts);
                        // Auto-select first account if available
                        if (cachedAccounts.length > 0) {
                            setSelectedAccount(cachedAccounts[0]);
                            setCustomerIdentifier(cachedAccounts[0].name);
                        }
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackAnalytics"])('cached_accounts_loaded', {
                            count: cachedAccounts.length,
                            userId: user.id
                        });
                    } catch (err) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error fetching cached accounts:', err);
                        // Don't show error for missing accounts - just set empty array
                        setAccounts([]);
                    } finally{
                        setLoadingAccounts(false);
                    }
                }
            }["SentimentAnalyzer.useEffect.fetchCachedAccounts"];
            // Only fetch if not in search mode
            if (!isSearchMode) {
                fetchCachedAccounts();
            }
        }
    }["SentimentAnalyzer.useEffect"], [
        user,
        isSearchMode
    ]);
    // Fetch cases and contacts when selected account changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SentimentAnalyzer.useEffect": ()=>{
            if (selectedAccount) {
                // Use the memoized functions to fetch data
                fetchCasesForAccount(selectedAccount);
                fetchContactsForAccount(selectedAccount);
            } else {
                setCases([]);
                setShowCasesList(false);
                setContacts([]);
                setShowContactsList(false);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["SentimentAnalyzer.useEffect"], [
        selectedAccount
    ]); // Functions are stable (useCallback with empty deps), so we can omit them
    // Fetch historical sentiment when results page is shown
    const fetchSentimentHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SentimentAnalyzer.useCallback[fetchSentimentHistory]": async (accountData)=>{
            if (!accountData) {
                setSentimentHistory(null);
                return;
            }
            const salesforceAccountId = accountData.salesforceId || (accountData.id && !accountData.id.includes('-') && (accountData.id.length === 15 || accountData.id.length === 18) ? accountData.id : null);
            if (!salesforceAccountId && !accountData.id) {
                return;
            }
            setHistoryLoading(true);
            try {
                const params = new URLSearchParams({
                    accountId: accountData.id || '',
                    salesforceAccountId: salesforceAccountId || '',
                    limit: '50',
                    days: '365'
                });
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deduplicatedFetch"])(`/api/sentiment-analysis?${params}`);
                const responseClone = response.clone();
                if (response.ok) {
                    const data = await responseClone.json();
                    setSentimentHistory(data);
                } else {
                    const errorData = await responseClone.json().catch({
                        "SentimentAnalyzer.useCallback[fetchSentimentHistory]": ()=>({})
                    }["SentimentAnalyzer.useCallback[fetchSentimentHistory]"]);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Failed to fetch sentiment history:', {
                        status: response.status,
                        error: errorData
                    });
                    // Don't show error to user - historical data is optional
                    setSentimentHistory(null);
                }
            } catch (err) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error fetching sentiment history:', err);
                // Don't show error to user - historical data is optional
                setSentimentHistory(null);
            } finally{
                setHistoryLoading(false);
            }
        }
    }["SentimentAnalyzer.useCallback[fetchSentimentHistory]"], []);
    // Check for most recent cached sentiment when account is selected
    const checkCachedSentiment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SentimentAnalyzer.useCallback[checkCachedSentiment]": async (accountData)=>{
            if (!accountData) {
                setCachedSentiment(null);
                return;
            }
            const salesforceAccountId = accountData.salesforceId || (accountData.id && !accountData.id.includes('-') && (accountData.id.length === 15 || accountData.id.length === 18) ? accountData.id : null);
            if (!salesforceAccountId && !accountData.id) {
                setCachedSentiment(null);
                return;
            }
            setCheckingCache(true);
            try {
                const params = new URLSearchParams({
                    accountId: accountData.id || '',
                    salesforceAccountId: salesforceAccountId || '',
                    limit: '1',
                    days: '365'
                });
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deduplicatedFetch"])(`/api/sentiment-analysis?${params}`);
                const responseClone = response.clone();
                if (response.ok) {
                    const data = await responseClone.json();
                    if (data.history && data.history.length > 0) {
                        setCachedSentiment(data.history[0]); // Most recent sentiment
                    } else {
                        setCachedSentiment(null);
                    }
                } else {
                    setCachedSentiment(null);
                }
            } catch (err) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error checking cached sentiment:', err);
                setCachedSentiment(null);
            } finally{
                setCheckingCache(false);
            }
        }
    }["SentimentAnalyzer.useCallback[checkCachedSentiment]"], []);
    // Check for cached sentiment when account is selected
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SentimentAnalyzer.useEffect": ()=>{
            if (selectedAccount && !showResultsPage) {
                checkCachedSentiment(selectedAccount);
            } else {
                setCachedSentiment(null);
            }
        }
    }["SentimentAnalyzer.useEffect"], [
        selectedAccount,
        showResultsPage,
        checkCachedSentiment
    ]);
    // Fetch history when results page is shown
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SentimentAnalyzer.useEffect": ()=>{
            if (showResultsPage && selectedAccount) {
                fetchSentimentHistory(selectedAccount);
            }
        }
    }["SentimentAnalyzer.useEffect"], [
        showResultsPage,
        selectedAccount,
        fetchSentimentHistory
    ]);
    // Search for accounts
    const handleSearch = async (searchQuery)=>{
        if (!searchQuery || searchQuery.trim().length < 2) {
            setError('Please enter at least 2 characters to search');
            return;
        }
        try {
            setIsSearching(true);
            setError(null);
            const params = new URLSearchParams({
                search: searchQuery.trim(),
                userId: user?.id || ''
            });
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deduplicatedFetch"])(`/api/salesforce-accounts?${params}`);
            const responseClone = response.clone();
            if (!response.ok) {
                const errorData = await responseClone.json().catch(()=>({}));
                throw new Error(errorData.message || errorData.error || 'Failed to search accounts');
            }
            const data = await responseClone.json();
            setAccounts(data.accounts || []);
            setIsSearchMode(true);
            // Auto-select first result if available
            if (data.accounts && data.accounts.length > 0) {
                setSelectedAccount(data.accounts[0]);
                setCustomerIdentifier(data.accounts[0].name);
            } else {
                setSelectedAccount(null);
                setCustomerIdentifier('');
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackAnalytics"])('accounts_searched', {
                searchTerm: searchQuery,
                count: data.accounts?.length || 0,
                userId: user?.id
            });
        } catch (err) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error searching accounts:', err);
            setError(err.message || 'Failed to search accounts. Please try again.');
        } finally{
            setIsSearching(false);
        }
    };
    // Clear search and return to assigned accounts
    const handleClearSearch = ()=>{
        setSearchTerm('');
        setIsSearchMode(false);
        setSelectedAccount(null);
        setCustomerIdentifier('');
        setError(null);
        // Trigger useEffect to reload assigned accounts
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.reload();
            }
        }
    };
    const handleAnalyze = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SentimentAnalyzer.useCallback[handleAnalyze]": async (attempt = 0, forceRefresh = false)=>{
            setLoading(true);
            setError(null);
            // Don't set casesLoading - cases/contacts are already loaded from useEffect
            // This prevents unnecessary reloading indicators
            if (attempt === 0) {
                setSentiment(null);
            }
            try {
                // Fetch data from both sources in parallel
                // Pass existing cases to avoid redundant API call
                const [avomaData, salesforceContext] = await Promise.all([
                    fetchAvomaData(customerIdentifier, selectedAccount?.salesforceId || selectedAccount?.id),
                    fetchSalesforceData(customerIdentifier, selectedAccount, cases)
                ]);
                // Extract transcription and meeting counts
                const transcription = avomaData.transcription || '';
                const meetingCounts = avomaData.meetingCounts || null;
                // Show warning if no transcription available (but don't error out)
                if (avomaData.warning || !transcription) {
                    const warningMessage = avomaData.warning || 'No Avoma transcription available. Analysis will proceed with Salesforce account data only.';
                    setAvomaWarning(warningMessage);
                } else {
                    setAvomaWarning(null);
                }
                // Categorize contacts by level and track case involvement
                const contactTitle = {
                    "SentimentAnalyzer.useCallback[handleAnalyze].contactTitle": (c)=>c.title || c.linkedinProfile?.current_title || ''
                }["SentimentAnalyzer.useCallback[handleAnalyze].contactTitle"];
                const categorizedContacts = contacts.map({
                    "SentimentAnalyzer.useCallback[handleAnalyze].categorizedContacts": (c)=>{
                        const title = contactTitle(c);
                        const level = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categorizeContactLevel"])(title);
                        return {
                            ...c,
                            contactLevel: level,
                            title: title
                        };
                    }
                }["SentimentAnalyzer.useCallback[handleAnalyze].categorizedContacts"]);
                // Track which contacts are involved in cases (by email or ID)
                const caseContactEmails = new Set();
                const caseContactIds = new Set();
                (salesforceContext.recent_tickets || []).forEach({
                    "SentimentAnalyzer.useCallback[handleAnalyze]": (ticket)=>{
                        if (ticket.contact_email) caseContactEmails.add(ticket.contact_email.toLowerCase());
                        if (ticket.contact_id) caseContactIds.add(ticket.contact_id);
                    }
                }["SentimentAnalyzer.useCallback[handleAnalyze]"]);
                // Mark contacts involved in cases
                const contactsWithCaseInvolvement = categorizedContacts.map({
                    "SentimentAnalyzer.useCallback[handleAnalyze].contactsWithCaseInvolvement": (c)=>{
                        const emailMatch = c.email && caseContactEmails.has(c.email.toLowerCase());
                        const idMatch = c.id && caseContactIds.has(c.id);
                        const involvedInCases = emailMatch || idMatch;
                        return {
                            ...c,
                            involvedInCases: involvedInCases
                        };
                    }
                }["SentimentAnalyzer.useCallback[handleAnalyze].contactsWithCaseInvolvement"]);
                // Count contacts by level - optimized single pass instead of multiple filters
                const contactLevelCounts = {
                    'C-Level': 0,
                    'Sr. Level': 0,
                    'Other': 0
                };
                const caseInvolvedByLevel = {
                    'C-Level': 0,
                    'Sr. Level': 0,
                    'Other': 0
                };
                contactsWithCaseInvolvement.forEach({
                    "SentimentAnalyzer.useCallback[handleAnalyze]": (c)=>{
                        contactLevelCounts[c.contactLevel] = (contactLevelCounts[c.contactLevel] || 0) + 1;
                        if (c.involvedInCases) {
                            caseInvolvedByLevel[c.contactLevel] = (caseInvolvedByLevel[c.contactLevel] || 0) + 1;
                        }
                    }
                }["SentimentAnalyzer.useCallback[handleAnalyze]"]);
                // Enrich with comprehensive contact data from Salesforce
                const linkedinData = {
                    contacts: contactsWithCaseInvolvement.filter({
                        "SentimentAnalyzer.useCallback[handleAnalyze]": (c)=>c.linkedinURL || c.linkedinProfile || c.email || c.name
                    }["SentimentAnalyzer.useCallback[handleAnalyze]"]).map({
                        "SentimentAnalyzer.useCallback[handleAnalyze]": (c)=>({
                                // Basic Info
                                name: c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim(),
                                email: c.email,
                                linkedin_url: c.linkedinURL || c.linkedin_url,
                                // Contact Level
                                contact_level: c.contactLevel,
                                involved_in_cases: c.involvedInCases,
                                // Salesforce Contact Data
                                department: c.department,
                                reports_to_name: c.reports_to_name,
                                owner_name: c.owner_name,
                                last_activity_date: c.last_activity_date,
                                created_date: c.created_date,
                                lead_source: c.lead_source,
                                mailing_city: c.mailing_city,
                                mailing_state: c.mailing_state,
                                mailing_country: c.mailing_country,
                                current_title: c.title || c.linkedinProfile?.current_title,
                                current_company: c.linkedinProfile?.current_company || c.account_name,
                                job_changed_recently: c.linkedinProfile?.job_changed_recently || false,
                                days_in_current_role: c.linkedinProfile?.days_in_current_role,
                                job_change_likelihood: c.linkedinProfile?.job_change_likelihood,
                                profile_updated_recently: c.linkedinProfile?.profile_updated_at ? new Date() - new Date(c.linkedinProfile.profile_updated_at) < 30 * 24 * 60 * 60 * 1000 : false,
                                company_industry: c.linkedinProfile?.company_industry,
                                company_size: c.linkedinProfile?.company_size,
                                company_revenue: c.linkedinProfile?.company_revenue,
                                company_technologies: c.linkedinProfile?.company_technologies || [],
                                previous_companies: c.linkedinProfile?.previous_companies || [],
                                previous_titles: c.linkedinProfile?.previous_titles || [],
                                email_status: c.linkedinProfile?.email_status,
                                phone_status: c.linkedinProfile?.phone_status,
                                email_verified: c.linkedinProfile?.email_verified,
                                phone_verified: c.linkedinProfile?.phone_verified,
                                engagement_with_company: {
                                    posts_about_company: c.linkedinProfile?.posts_about_company || 0,
                                    comments_on_company_posts: c.linkedinProfile?.comments_on_company_posts || 0,
                                    shares_of_company_content: c.linkedinProfile?.shares_of_company_content || 0,
                                    reactions_to_company_posts: c.linkedinProfile?.reactions_to_company_posts || 0
                                },
                                email_open_rate: c.linkedinProfile?.email_open_rate,
                                email_click_rate: c.linkedinProfile?.email_click_rate,
                                response_rate: c.linkedinProfile?.response_rate,
                                last_contacted: c.linkedinProfile?.last_contacted,
                                last_engaged: c.linkedinProfile?.last_engaged
                            })
                    }["SentimentAnalyzer.useCallback[handleAnalyze]"]),
                    total_contacts_with_linkedin: contacts.filter({
                        "SentimentAnalyzer.useCallback[handleAnalyze]": (c)=>c.linkedinURL || c.linkedin_url
                    }["SentimentAnalyzer.useCallback[handleAnalyze]"]).length,
                    contacts_with_enriched_data: contacts.filter({
                        "SentimentAnalyzer.useCallback[handleAnalyze]": (c)=>c.linkedinProfile
                    }["SentimentAnalyzer.useCallback[handleAnalyze]"]).length,
                    contact_level_counts: contactLevelCounts,
                    case_involved_by_level: caseInvolvedByLevel,
                    total_contacts: contacts.length
                };
                // Add counts to salesforce context for sentiment analysis
                const enrichedContext = {
                    ...salesforceContext,
                    total_cases_count: salesforceContext.total_cases_count || 0,
                    total_avoma_calls: meetingCounts?.total || 0,
                    ready_avoma_calls: meetingCounts?.ready || 0,
                    linkedin_data: linkedinData.contacts.length > 0 ? linkedinData : null,
                    contact_levels: {
                        c_level_count: contactLevelCounts['C-Level'],
                        sr_level_count: contactLevelCounts['Sr. Level'],
                        other_count: contactLevelCounts['Other'],
                        c_level_in_cases: caseInvolvedByLevel['C-Level'],
                        sr_level_in_cases: caseInvolvedByLevel['Sr. Level'],
                        other_in_cases: caseInvolvedByLevel['Other']
                    }
                };
                // Store the actual data used for analysis (for transparency)
                setAnalysisData({
                    transcription: transcription,
                    salesforceContext: enrichedContext,
                    transcriptionPreview: transcription.length > 500 ? transcription.substring(0, 500) + '...' : transcription
                });
                // Analyze sentiment (pass account/user info for historical tracking)
                // Determine account IDs - selectedAccount.id should be UUID, selectedAccount.salesforceId should be Salesforce ID
                const accountId = selectedAccount?.id; // This should be a UUID from Supabase
                const salesforceAccountId = selectedAccount?.salesforceId || (selectedAccount?.id && !selectedAccount.id.includes('-') && (selectedAccount.id.length === 15 || selectedAccount.id.length === 18) ? selectedAccount.id : null);
                const result = await analyzeSentiment(transcription, enrichedContext, user?.id, accountId, salesforceAccountId, customerIdentifier, forceRefresh // Pass forceRefresh flag to bypass cache
                );
                setSentiment(result);
                setRetryCount(0);
                // Track data sources used for this analysis
                setDataSources({
                    hasTranscription: !!transcription && transcription.length > 0,
                    transcriptionLength: transcription.length,
                    hasAccountData: !!selectedAccount,
                    accountName: selectedAccount?.name || customerIdentifier,
                    casesCount: enrichedContext.total_cases_count || 0,
                    avomaCallsTotal: enrichedContext.total_avoma_calls || 0,
                    avomaCallsReady: enrichedContext.ready_avoma_calls || 0,
                    hasCases: (enrichedContext.recent_tickets || []).length > 0,
                    hasLinkedIn: !!enrichedContext.linkedin_data && enrichedContext.linkedin_data.contacts.length > 0,
                    linkedinContactsCount: enrichedContext.linkedin_data?.contacts.length || 0,
                    linkedinEnrichedCount: enrichedContext.linkedin_data?.contacts_with_enriched_data || 0
                });
                // Navigate to results page
                setShowResultsPage(true);
                // Refetch sentiment history and cached sentiment after a brief delay to ensure the new result is saved
                // The useEffect will also fetch, but this ensures we get the latest data after save completes
                setTimeout({
                    "SentimentAnalyzer.useCallback[handleAnalyze]": ()=>{
                        if (selectedAccount) {
                            fetchSentimentHistory(selectedAccount);
                            checkCachedSentiment(selectedAccount); // Refresh cached sentiment indicator
                        }
                    }
                }["SentimentAnalyzer.useCallback[handleAnalyze]"], 1000); // Small delay to allow database save to complete
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackAnalytics"])('sentiment_analyzed', {
                    customerIdentifier,
                    score: result.score,
                    hasTranscription: !!transcription,
                    casesCount: enrichedContext.total_cases_count || 0,
                    avomaCallsCount: enrichedContext.total_avoma_calls || 0
                });
            } catch (err) {
                const errorMessage = err.message || 'An error occurred while analyzing sentiment';
                setError(errorMessage);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Sentiment analysis error:', err);
                if (attempt < maxRetries && (err.message?.includes('timeout') || err.message?.includes('network'))) {
                    setRetryCount(attempt + 1);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackAnalytics"])('sentiment_analysis_retry', {
                        attempt: attempt + 1
                    });
                } else {
                    setRetryCount(0);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackAnalytics"])('sentiment_analysis_failed', {
                        error: errorMessage
                    });
                }
            } finally{
                setLoading(false);
            }
        }
    }["SentimentAnalyzer.useCallback[handleAnalyze]"], [
        customerIdentifier,
        selectedAccount,
        contacts,
        cases,
        fetchSentimentHistory
    ]);
    const getScoreColor = (score)=>{
        if (score <= 4) return 'text-red-600 bg-red-50 border-red-200';
        if (score <= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-lean-green bg-lean-green-10 border-lean-green/20';
    };
    const getScoreBgColor = (score)=>{
        if (score <= 4) return 'bg-red-100';
        if (score <= 7) return 'bg-yellow-100';
        return 'bg-lean-green-10';
    };
    // Results Page Component
    const ResultsPage = ({ sentiment, dataSources, analysisData, selectedAccount, cases, contacts, sentimentHistory, historyLoading, avomaWarning, onBack, onShowHelp, onCloseHelp, showHelp })=>{
        _s1();
        const [showDataDetails, setShowDataDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
        // Scroll to help section when it opens
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
            "SentimentAnalyzer.ResultsPage.useEffect": ()=>{
                if (showHelp) {
                    // Small delay to ensure DOM is updated
                    setTimeout({
                        "SentimentAnalyzer.ResultsPage.useEffect": ()=>{
                            const helpSection = document.getElementById('help-section');
                            if (helpSection) {
                                helpSection.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }
                        }
                    }["SentimentAnalyzer.ResultsPage.useEffect"], 100);
                }
            }
        }["SentimentAnalyzer.ResultsPage.useEffect"], [
            showHelp
        ]);
        // Categorize contacts for display
        const categorizedContacts = contacts.map((c)=>{
            const title = c.title || c.linkedinProfile?.current_title || '';
            return {
                ...c,
                contactLevel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categorizeContactLevel"])(title),
                title: title
            };
        });
        // Track case involvement
        const caseContactEmails = new Set();
        const caseContactIds = new Set();
        (cases || []).forEach((caseItem)=>{
            if (caseItem.contactEmail) caseContactEmails.add(caseItem.contactEmail.toLowerCase());
            if (caseItem.contactId) caseContactIds.add(caseItem.contactId);
        });
        const contactsWithCaseInvolvement = categorizedContacts.map((c)=>{
            const emailMatch = c.email && caseContactEmails.has(c.email.toLowerCase());
            const idMatch = c.id && caseContactIds.has(c.id);
            return {
                ...c,
                involvedInCases: emailMatch || idMatch
            };
        });
        // Group contacts by level
        const contactsByLevel = {
            'C-Level': contactsWithCaseInvolvement.filter((c)=>c.contactLevel === 'C-Level'),
            'Sr. Level': contactsWithCaseInvolvement.filter((c)=>c.contactLevel === 'Sr. Level'),
            'Other': contactsWithCaseInvolvement.filter((c)=>c.contactLevel === 'Other')
        };
        const contactLevelCounts = {
            'C-Level': contactsByLevel['C-Level'].length,
            'Sr. Level': contactsByLevel['Sr. Level'].length,
            'Other': contactsByLevel['Other'].length
        };
        const caseInvolvedByLevel = {
            'C-Level': contactsByLevel['C-Level'].filter((c)=>c.involvedInCases).length,
            'Sr. Level': contactsByLevel['Sr. Level'].filter((c)=>c.involvedInCases).length,
            'Other': contactsByLevel['Other'].filter((c)=>c.involvedInCases).length
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-lean-almost-white flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "bg-lean-black px-4 sm:px-6 lg:px-8 py-4 flex-shrink-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-6xl mx-auto flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: `/ld-logo-abbr-green.png?v=${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBuildVersion"])()}`,
                                        alt: "LeanData Logo",
                                        className: "h-12 w-auto flex-shrink-0"
                                    }, `logo-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBuildVersion"])()}`, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1032,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "typography-heading text-[#f7f7f7] mb-1",
                                                children: "L.U.C.I."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1039,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-[#f7f7f7]",
                                                children: "LeanData Unified Customer Intelligence"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1042,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1038,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1030,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            router.push('/user');
                                        },
                                        className: "px-4 py-2 text-sm font-medium text-[#f7f7f7] bg-lean-green rounded-lg hover:bg-lean-green/90 focus:outline-none focus:ring-2 focus:ring-lean-green transition-all",
                                        "aria-label": "Manage my accounts",
                                        children: "My Accounts"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1048,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            router.push('/admin');
                                        },
                                        className: "px-4 py-2 text-sm font-medium text-[#f7f7f7] bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                                        "aria-label": "Go to admin panel",
                                        children: "Admin"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1057,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            e.preventDefault();
                                            if (onShowHelp && typeof onShowHelp === 'function') {
                                                onShowHelp();
                                            }
                                        },
                                        className: "px-4 py-2 text-sm font-medium text-[#f7f7f7] bg-lean-green rounded-lg hover:bg-lean-green/90 focus:outline-none focus:ring-2 focus:ring-lean-green transition-all",
                                        "aria-label": "Show help and explanation",
                                        type: "button",
                                        children: "Help"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1066,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1047,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                        lineNumber: 1029,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                    lineNumber: 1028,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "flex-1 px-4 sm:px-6 lg:px-8 py-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-6xl mx-auto",
                        children: [
                            showHelp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "help-section",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HelpPage, {
                                    onClose: ()=>onCloseHelp && onCloseHelp()
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 1088,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1087,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onBack,
                                        className: "mb-6 flex items-center gap-2 text-lean-black-70 hover:text-lean-black transition-colors",
                                        "aria-label": "Back to account selection",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M15 19l-7-7 7-7"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 1100,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1099,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: "Back to Account Selection"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1102,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1094,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "typography-heading text-lean-black mb-2",
                                                children: "Sentiment Analysis Results"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1105,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            selectedAccount ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    const accountId = selectedAccount.salesforceId || selectedAccount.id;
                                                    router.push(`/account/${accountId}/data`);
                                                },
                                                className: "typography-body text-lean-black-70 hover:text-lean-green hover:underline transition-colors text-left",
                                                children: selectedAccount.name || 'Account Analysis'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1109,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "typography-body text-lean-black-70",
                                                children: "Account Analysis"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1119,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1104,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1093,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            avomaWarning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg",
                                role: "alert",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "h-5 w-5 text-yellow-400",
                                                viewBox: "0 0 20 20",
                                                fill: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    fillRule: "evenodd",
                                                    d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
                                                    clipRule: "evenodd"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 1132,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1131,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 1130,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-yellow-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Note:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1137,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " ",
                                                    avomaWarning
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1136,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 1135,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 1129,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1128,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-lean-white rounded-lg shadow-lg p-8 mb-6",
                                role: "region",
                                "aria-live": "polite",
                                "aria-label": "Sentiment analysis results",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `text-center mb-6 p-8 rounded-xl border-2 ${getScoreColor(sentiment.score)}`,
                                        role: "status",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-6xl font-bold mb-2",
                                                "aria-label": `Sentiment score: ${sentiment.score} out of 10`,
                                                children: sentiment.score
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1148,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xl font-semibold text-lean-black-70",
                                                children: "/ 10"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1151,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1147,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `rounded-lg p-6 ${getScoreBgColor(sentiment.score)}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start gap-3",
                                            children: [
                                                sentiment.score >= 8 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUpIcon"], {
                                                    className: "w-6 h-6 text-lean-green flex-shrink-0 mt-1"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 1160,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingDownIcon"], {
                                                    className: "w-6 h-6 text-red-600 flex-shrink-0 mt-1"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 1162,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "font-semibold text-lean-black",
                                                                    children: "Executive Summary"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 1166,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-lean-black-60 bg-lean-almost-white px-2 py-1 rounded",
                                                                    children: "C-Level Brief"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 1167,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 1165,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-lean-black-80 leading-relaxed",
                                                            children: sentiment.summary
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 1171,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 1164,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 1158,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1157,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1145,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            sentiment.comprehensiveAnalysis && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-lean-white rounded-lg shadow-lg p-8 mb-6 border-l-4 border-lean-green",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-xl font-semibold text-lean-black",
                                                    children: "Comprehensive Analysis"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 1182,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-lean-black-60 bg-blue-50 px-2 py-1 rounded border border-blue-200",
                                                    children: "For CSMs & Account Managers"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 1183,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 1181,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1180,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "prose max-w-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-lean-black-80 leading-relaxed whitespace-pre-wrap",
                                            children: sentiment.comprehensiveAnalysis
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 1189,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1188,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1179,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            sentimentHistory && sentimentHistory.history && sentimentHistory.history.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-lean-white rounded-lg shadow-lg p-8 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "typography-heading text-lean-black mb-4",
                                        children: "Sentiment History"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1199,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    sentimentHistory.stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-lean-almost-white rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-lean-black-70 mb-1",
                                                        children: "Average Score"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1205,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-lean-black",
                                                        children: sentimentHistory.stats.average.toFixed(1)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1206,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-lean-black-60",
                                                        children: "/ 10"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1207,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1204,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-lean-almost-white rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-lean-black-70 mb-1",
                                                        children: "Range"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1210,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-lean-black",
                                                        children: [
                                                            sentimentHistory.stats.min,
                                                            " - ",
                                                            sentimentHistory.stats.max
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1211,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-lean-black-60",
                                                        children: "Min - Max"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1214,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1209,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-lean-almost-white rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-lean-black-70 mb-1",
                                                        children: "Total Analyses"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1217,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-lean-black",
                                                        children: sentimentHistory.stats.total
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1218,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-lean-black-60",
                                                        children: "Last 365 days"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1219,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1216,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-lean-almost-white rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-lean-black-70 mb-1",
                                                        children: "Trend"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1222,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `text-2xl font-bold ${sentimentHistory.stats.trend === 'improving' ? 'text-lean-green' : sentimentHistory.stats.trend === 'declining' ? 'text-red-600' : 'text-yellow-600'}`,
                                                        children: sentimentHistory.stats.trend === 'improving' ? '↑ Improving' : sentimentHistory.stats.trend === 'declining' ? '↓ Declining' : '→ Stable'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1223,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    sentimentHistory.stats.recentAverage > 0 && sentimentHistory.stats.previousAverage > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-lean-black-60",
                                                        children: [
                                                            sentimentHistory.stats.recentAverage.toFixed(1),
                                                            " vs ",
                                                            sentimentHistory.stats.previousAverage.toFixed(1)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1233,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1221,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1203,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-semibold text-lean-black-80 mb-3",
                                                children: "Score Over Time"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1243,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-lean-almost-white rounded-lg p-4",
                                                style: {
                                                    height: '200px',
                                                    position: 'relative'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-end justify-between h-full gap-1",
                                                    children: sentimentHistory.history.slice(0, 20).reverse().map((entry, idx)=>{
                                                        const height = entry.score / 10 * 100;
                                                        const color = entry.score <= 4 ? '#ef4444' : entry.score <= 7 ? '#eab308' : '#22c55e';
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                if (entry.id) {
                                                                    router.push(`/sentiment/${entry.id}`);
                                                                }
                                                            },
                                                            className: "flex-1 flex flex-col items-center cursor-pointer",
                                                            title: `Score: ${entry.score} on ${new Date(entry.analyzed_at).toLocaleDateString()} - Click to view details`,
                                                            disabled: !entry.id,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-full rounded-t transition-all hover:opacity-80",
                                                                    style: {
                                                                        height: `${height}%`,
                                                                        backgroundColor: color,
                                                                        minHeight: '4px'
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 1262,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs text-lean-black-60 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap",
                                                                    style: {
                                                                        writingMode: 'vertical-rl'
                                                                    },
                                                                    children: new Date(entry.analyzed_at).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 1270,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, entry.id || idx, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 1251,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0));
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 1246,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1244,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1242,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-semibold text-lean-black-80 mb-3",
                                                children: "Recent Analyses"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1282,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2 max-h-60 overflow-y-auto",
                                                children: sentimentHistory.history.slice(0, 10).map((entry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            if (entry.id) {
                                                                router.push(`/sentiment/${entry.id}`);
                                                            }
                                                        },
                                                        className: "w-full flex items-center justify-between p-3 bg-lean-almost-white rounded-lg border border-lean-black/20 hover:bg-lean-green-10 hover:border-lean-green/30 transition-colors text-left",
                                                        disabled: !entry.id,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `text-lg font-bold ${entry.score <= 4 ? 'text-red-600' : entry.score <= 7 ? 'text-yellow-600' : 'text-lean-green'}`,
                                                                            children: entry.score
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 1297,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm text-lean-black-70",
                                                                            children: "/ 10"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 1304,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-lean-black-60 ml-2",
                                                                            children: new Date(entry.analyzed_at).toLocaleString()
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 1305,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 1296,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-lean-black-70 mt-1 line-clamp-1",
                                                                    children: entry.summary
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 1309,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 1295,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, entry.id, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1285,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1283,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1281,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1198,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            historyLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-lean-white rounded-lg shadow-lg p-8 mb-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                            className: "w-6 h-6 animate-spin text-blue-600 mr-3"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 1321,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-lean-black-70",
                                            children: "Loading sentiment history..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 1322,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 1320,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1319,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            dataSources && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-lean-white rounded-lg shadow-lg p-8 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-semibold text-lean-black mb-4",
                                        children: "Analysis Data Sources"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1330,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            dataSources.hasTranscription ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-5 h-5 text-lean-green",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 1336,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1335,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-5 h-5 text-gray-400",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M6 18L18 6M6 6l12 12"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 1340,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1339,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-lean-black-80",
                                                                children: "Avoma Transcription"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1343,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1333,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    dataSources.hasTranscription ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-lean-black-70 ml-7",
                                                        children: [
                                                            dataSources.transcriptionLength.toLocaleString(),
                                                            " characters from customer call/meeting",
                                                            dataSources.avomaCallsTotal > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "block mt-1 text-xs text-lean-black-60",
                                                                children: [
                                                                    "Found ",
                                                                    dataSources.avomaCallsTotal,
                                                                    " meeting",
                                                                    dataSources.avomaCallsTotal !== 1 ? 's' : '',
                                                                    dataSources.avomaCallsReady > 0 && ` (${dataSources.avomaCallsReady} with ready transcripts)`
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1349,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1346,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-lean-black-60 ml-7 text-xs",
                                                        children: "No transcription available"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1356,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1332,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            dataSources.hasAccountData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-5 h-5 text-lean-green",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 1364,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1363,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-5 h-5 text-gray-400",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M6 18L18 6M6 6l12 12"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 1368,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1367,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-lean-black-80",
                                                                children: "Salesforce Account"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1371,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1361,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    dataSources.hasAccountData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-lean-black-70 ml-7",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    const accountId = selectedAccount?.salesforceId || selectedAccount?.id;
                                                                    if (accountId) {
                                                                        router.push(`/account/${accountId}/data`);
                                                                    }
                                                                },
                                                                className: "text-blue-600 hover:text-blue-800 hover:underline transition-colors",
                                                                children: dataSources.accountName
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1375,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            dataSources.casesCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "block mt-1 text-xs text-lean-black-60",
                                                                children: [
                                                                    dataSources.casesCount,
                                                                    " support case",
                                                                    dataSources.casesCount !== 1 ? 's' : '',
                                                                    " found"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1387,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1374,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-lean-black-60 ml-7 text-xs",
                                                        children: "No account data available"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1393,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1360,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1331,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 pt-4 border-t border-gray-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-lean-black-60 mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "AI Analysis:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1399,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " Powered by Google Gemini 2.5 Flash, analyzing conversation tone, customer language, and account context to generate sentiment score."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1398,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowDataDetails(!showDataDetails),
                                                className: "text-xs text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1",
                                                "aria-expanded": showDataDetails,
                                                "aria-label": showDataDetails ? 'Hide data details' : 'Show data details',
                                                children: showDataDetails ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-4 h-4",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            viewBox: "0 0 24 24",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M5 15l7-7 7 7"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1411,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 1410,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Hide Data Used in Analysis"
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-4 h-4",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            viewBox: "0 0 24 24",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M19 9l-7 7-7-7"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1418,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 1417,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Show Data Used in Analysis"
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1402,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1397,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1329,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            showDataDetails && analysisData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-lean-white rounded-lg shadow-lg p-8 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-lg font-semibold text-lean-black mb-4",
                                        children: "Detailed Data Used in Analysis"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1431,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-lean-almost-white rounded-lg p-4 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                className: "text-sm font-semibold text-gray-800 mb-2",
                                                children: "Avoma Transcription"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1435,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            analysisData.transcription && analysisData.transcription.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-lean-black-80 mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: "Characters:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1439,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            " ",
                                                            analysisData.transcription.length.toLocaleString(),
                                                            " |",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium ml-2",
                                                                children: "Words:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1440,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            " ",
                                                            analysisData.transcription.split(/\s+/).filter(Boolean).length.toLocaleString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1438,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-lean-white border border-lean-black/20 rounded-md p-3 text-xs text-gray-800 max-h-60 overflow-y-auto",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                            className: "whitespace-pre-wrap font-mono",
                                                            children: analysisData.transcription
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 1443,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1442,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-lean-black-60",
                                                children: "No transcription data was available for analysis."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1447,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1434,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-lean-almost-white rounded-lg p-4 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                className: "text-sm font-semibold text-gray-800 mb-2",
                                                children: "Salesforce Account Context"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1453,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            analysisData.salesforceContext ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-x-4 gap-y-2 text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-lean-black-70",
                                                                children: "Account Name:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1457,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    const accountId = selectedAccount?.salesforceId || selectedAccount?.id || analysisData.salesforceContext?.account_id;
                                                                    if (accountId) {
                                                                        router.push(`/account/${accountId}/data`);
                                                                    }
                                                                },
                                                                className: "ml-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors",
                                                                children: analysisData.salesforceContext.account_name || 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1458,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1456,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-lean-black-70",
                                                                children: "Tier:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1471,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-lean-black",
                                                                children: analysisData.salesforceContext.account_tier || 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1472,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1470,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-lean-black-70",
                                                                children: "Contract Value:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1475,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-lean-black",
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(analysisData.salesforceContext.contract_value) || 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1476,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1474,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-lean-black-70",
                                                                children: "Industry:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1479,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-lean-black",
                                                                children: analysisData.salesforceContext.industry || 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1480,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1478,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-lean-black-70",
                                                                children: "Annual Revenue:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1483,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-lean-black",
                                                                children: analysisData.salesforceContext.annual_revenue ? `$${analysisData.salesforceContext.annual_revenue.toLocaleString()}` : 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1484,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1482,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-lean-black-70",
                                                                children: "Account Manager:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1487,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-lean-black",
                                                                children: analysisData.salesforceContext.account_manager || 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1488,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1486,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    analysisData.salesforceContext.total_cases_count !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-lean-black-70",
                                                                children: "Support Cases:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1492,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-lean-black",
                                                                children: analysisData.salesforceContext.total_cases_count
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1493,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1491,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    analysisData.salesforceContext.total_avoma_calls !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-lean-black-70",
                                                                children: "Avoma Calls (Total):"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1498,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-lean-black",
                                                                children: analysisData.salesforceContext.total_avoma_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1499,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1497,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    analysisData.salesforceContext.ready_avoma_calls !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-lean-black-70",
                                                                children: "Avoma Calls (Ready):"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1504,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 text-lean-black",
                                                                children: analysisData.salesforceContext.ready_avoma_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1505,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1503,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1455,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-lean-black-60",
                                                children: "No Salesforce account context was available for analysis."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1510,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1452,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    analysisData.salesforceContext?.recent_tickets && analysisData.salesforceContext.recent_tickets.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-lean-almost-white rounded-lg p-4 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                className: "text-sm font-semibold text-gray-800 mb-2",
                                                children: [
                                                    "Recent Support Cases (",
                                                    analysisData.salesforceContext.recent_tickets.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1518,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2 max-h-60 overflow-y-auto pr-2",
                                                children: analysisData.salesforceContext.recent_tickets.map((ticket, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs bg-lean-white rounded p-2 border border-lean-black/20",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: `https://leandata.my.salesforce.com/500/o/Case/d?id=${ticket.id}`,
                                                                target: "_blank",
                                                                rel: "noopener noreferrer",
                                                                className: "font-medium text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1",
                                                                "aria-label": `View case ${ticket.caseNumber} in Salesforce`,
                                                                children: [
                                                                    ticket.caseNumber || ticket.id,
                                                                    " - ",
                                                                    ticket.subject || 'No Subject',
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-3 h-3 text-blue-500",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2,
                                                                            d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 1533,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1532,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1524,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-lean-black-70 mt-1",
                                                                children: [
                                                                    "Status: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `font-semibold ${ticket.status === 'Closed' ? 'text-lean-green' : 'text-blue-600'}`,
                                                                        children: ticket.status
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1537,
                                                                        columnNumber: 35
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "mx-2",
                                                                        children: "|"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1538,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Priority: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `font-semibold ${[
                                                                            'High',
                                                                            'Critical'
                                                                        ].includes(ticket.priority) ? 'text-red-600' : 'text-lean-black-70'}`,
                                                                        children: ticket.priority || 'N/A'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1538,
                                                                        columnNumber: 69
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1536,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-lean-black-60 mt-1",
                                                                children: [
                                                                    "Created: ",
                                                                    new Date(ticket.created_date).toLocaleDateString(),
                                                                    " ",
                                                                    ticket.closed_date ? `| Closed: ${new Date(ticket.closed_date).toLocaleDateString()}` : ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1540,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            ticket.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-lean-black-80 mt-2 italic line-clamp-2",
                                                                title: ticket.description,
                                                                children: [
                                                                    '"',
                                                                    ticket.description,
                                                                    '"'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1544,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1523,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1521,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1517,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    analysisData.salesforceContext?.linkedin_data && analysisData.salesforceContext.linkedin_data.contacts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-lean-almost-white rounded-lg p-4 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                className: "text-sm font-semibold text-gray-800 mb-2",
                                                children: [
                                                    "LinkedIn Professional Context (",
                                                    analysisData.salesforceContext.linkedin_data.contacts.length,
                                                    " contacts)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1558,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2 max-h-60 overflow-y-auto pr-2",
                                                children: analysisData.salesforceContext.linkedin_data.contacts.map((contact, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs bg-lean-white rounded p-2 border border-lean-black/20",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium text-lean-black",
                                                                        children: contact.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1565,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    contact.linkedin_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                        href: contact.linkedin_url,
                                                                        target: "_blank",
                                                                        rel: "noopener noreferrer",
                                                                        className: "text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1",
                                                                        "aria-label": `View ${contact.name} on LinkedIn`,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                className: "w-3 h-3",
                                                                                fill: "currentColor",
                                                                                viewBox: "0 0 24 24",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 1575,
                                                                                    columnNumber: 33
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 1574,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            "LinkedIn"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1567,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1564,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            contact.current_title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-lean-black-80 mt-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium",
                                                                        children: "Title:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1583,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " ",
                                                                    contact.current_title,
                                                                    contact.current_company && ` at ${contact.current_company}`
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1582,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            contact.job_changed_recently && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-red-600 text-xs font-semibold mt-1",
                                                                children: "⚠️ Recent job change detected"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1588,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            contact.profile_updated_recently && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-yellow-600 text-xs mt-1",
                                                                children: "📝 Profile recently updated"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1593,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            contact.engagement_with_company && (contact.engagement_with_company.posts_about_company > 0 || contact.engagement_with_company.comments_on_company_posts > 0 || contact.engagement_with_company.shares_of_company_content > 0 || contact.engagement_with_company.reactions_to_company_posts > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-lean-black-70 text-xs mt-1",
                                                                children: [
                                                                    "Engagement: ",
                                                                    contact.engagement_with_company.posts_about_company,
                                                                    " posts,",
                                                                    contact.engagement_with_company.comments_on_company_posts,
                                                                    " comments,",
                                                                    contact.engagement_with_company.shares_of_company_content,
                                                                    " shares,",
                                                                    contact.engagement_with_company.reactions_to_company_posts,
                                                                    " reactions"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1603,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1563,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1561,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1557,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-lean-almost-white rounded-lg p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                className: "text-sm font-semibold text-blue-900 uppercase tracking-wide mb-2",
                                                children: "Data Summary"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1618,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-blue-600 font-medium",
                                                                children: "Transcription"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1623,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-blue-900",
                                                                children: [
                                                                    analysisData.transcription.length.toLocaleString(),
                                                                    " chars"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1624,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1622,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-blue-600 font-medium",
                                                                children: "Account Fields"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1627,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-blue-900",
                                                                children: [
                                                                    Object.keys(analysisData.salesforceContext).filter((k)=>![
                                                                            'recent_tickets',
                                                                            'account_id',
                                                                            'linkedin_data'
                                                                        ].includes(k) && analysisData.salesforceContext[k] !== null).length,
                                                                    " provided"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1628,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1626,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-blue-600 font-medium",
                                                                children: "Support Cases"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1636,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-blue-900",
                                                                children: [
                                                                    analysisData.salesforceContext.recent_tickets?.length || 0,
                                                                    " cases"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1637,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1635,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-blue-600 font-medium",
                                                                children: "LinkedIn Contacts"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1642,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-blue-900",
                                                                children: [
                                                                    analysisData.salesforceContext.linkedin_data?.contacts.length || 0,
                                                                    " profiles"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1643,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1641,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1621,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1617,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1430,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            contacts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-lean-white rounded-lg shadow-lg p-6 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-lean-black mb-4",
                                        children: "Contact Level Breakdown"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1655,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `rounded-lg p-4 border-2 ${caseInvolvedByLevel['C-Level'] > 0 ? 'bg-red-50 border-red-300' : 'bg-lean-almost-white border-lean-black/20'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "font-semibold text-lean-black",
                                                                children: "C-Level"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1664,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            caseInvolvedByLevel['C-Level'] > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full",
                                                                children: [
                                                                    "⚠️ ",
                                                                    caseInvolvedByLevel['C-Level'],
                                                                    " in cases"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1666,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1663,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-lean-black mb-1",
                                                        children: contactLevelCounts['C-Level']
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1671,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-lean-black-70",
                                                        children: caseInvolvedByLevel['C-Level'] > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-red-600 font-semibold",
                                                            children: [
                                                                caseInvolvedByLevel['C-Level'],
                                                                " involved in support cases - Major concern"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 1676,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lean-green",
                                                            children: "No case involvement"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 1680,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1674,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1658,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `rounded-lg p-4 border-2 ${caseInvolvedByLevel['Sr. Level'] > 0 ? 'bg-yellow-50 border-yellow-300' : 'bg-lean-almost-white border-lean-black/20'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "font-semibold text-lean-black",
                                                                children: "Sr. Level"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1692,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            caseInvolvedByLevel['Sr. Level'] > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full",
                                                                children: [
                                                                    "⚠️ ",
                                                                    caseInvolvedByLevel['Sr. Level'],
                                                                    " in cases"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1694,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1691,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-lean-black mb-1",
                                                        children: contactLevelCounts['Sr. Level']
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1699,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-lean-black-70",
                                                        children: caseInvolvedByLevel['Sr. Level'] > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-yellow-600 font-semibold",
                                                            children: [
                                                                caseInvolvedByLevel['Sr. Level'],
                                                                " involved in support cases - Significant concern"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 1704,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lean-green",
                                                            children: "No case involvement"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 1708,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1702,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1686,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-lg p-4 border-2 bg-lean-almost-white border-lean-black/20",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "font-semibold text-lean-black",
                                                                children: "Other"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1716,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            caseInvolvedByLevel['Other'] > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-lean-black-70",
                                                                children: [
                                                                    caseInvolvedByLevel['Other'],
                                                                    " in cases"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1718,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1715,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-lean-black mb-1",
                                                        children: contactLevelCounts['Other']
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1723,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-lean-black-70",
                                                        children: caseInvolvedByLevel['Other'] > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                caseInvolvedByLevel['Other'],
                                                                " involved in support cases"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 1728,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lean-green",
                                                            children: "No case involvement"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 1730,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1726,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1714,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1656,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            contactsByLevel['C-Level'].length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-sm font-semibold text-lean-black mb-2",
                                                        children: [
                                                            "C-Level Contacts (",
                                                            contactsByLevel['C-Level'].length,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1740,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2 max-h-48 overflow-y-auto",
                                                        children: contactsByLevel['C-Level'].map((contact)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `text-sm p-2 rounded border ${contact.involvedInCases ? 'bg-red-50 border-red-200' : 'bg-lean-almost-white border-lean-black/20'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-medium text-lean-black",
                                                                                children: contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 1751,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            contact.involvedInCases && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded",
                                                                                children: "⚠️ In Cases"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 1755,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1750,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    contact.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-lean-black-70 mt-1",
                                                                        children: contact.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1761,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, contact.id || contact.email, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1745,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1743,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1739,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            contactsByLevel['Sr. Level'].length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-sm font-semibold text-lean-black mb-2",
                                                        children: [
                                                            "Sr. Level Contacts (",
                                                            contactsByLevel['Sr. Level'].length,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1771,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2 max-h-48 overflow-y-auto",
                                                        children: contactsByLevel['Sr. Level'].map((contact)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `text-sm p-2 rounded border ${contact.involvedInCases ? 'bg-yellow-50 border-yellow-200' : 'bg-lean-almost-white border-lean-black/20'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-medium text-lean-black",
                                                                                children: contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 1782,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            contact.involvedInCases && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded",
                                                                                children: "⚠️ In Cases"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 1786,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1781,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    contact.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-lean-black-70 mt-1",
                                                                        children: contact.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1792,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, contact.id || contact.email, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1776,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1774,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1770,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1737,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1654,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6",
                                children: [
                                    cases.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-lean-white rounded-lg shadow-lg p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold text-lean-black mb-4",
                                                children: [
                                                    "Support Cases (",
                                                    cases.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1808,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3 max-h-96 overflow-y-auto",
                                                children: cases.map((caseItem)=>{
                                                    const salesforceUrl = caseItem.id ? `https://leandata.my.salesforce.com/${caseItem.id}` : null;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-lean-almost-white rounded-lg p-3 border border-lean-black/20",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: salesforceUrl,
                                                                target: "_blank",
                                                                rel: "noopener noreferrer",
                                                                className: "font-medium text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 mb-1",
                                                                children: [
                                                                    caseItem.caseNumber || caseItem.id,
                                                                    " - ",
                                                                    caseItem.subject || 'No Subject',
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-4 h-4 text-blue-500",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2,
                                                                            d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 1825,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1824,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1817,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-lean-black-70 mt-1",
                                                                children: [
                                                                    "Status: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `font-semibold ${caseItem.status === 'Closed' ? 'text-lean-green' : 'text-blue-600'}`,
                                                                        children: caseItem.status
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1829,
                                                                        columnNumber: 35
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "mx-2",
                                                                        children: "|"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1830,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Priority: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `font-semibold ${[
                                                                            'High',
                                                                            'Critical'
                                                                        ].includes(caseItem.priority) ? 'text-red-600' : 'text-lean-black-70'}`,
                                                                        children: caseItem.priority || 'N/A'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1830,
                                                                        columnNumber: 69
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1828,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-lean-black-60 mt-1",
                                                                children: [
                                                                    "Created: ",
                                                                    new Date(caseItem.createdDate).toLocaleDateString(),
                                                                    " ",
                                                                    caseItem.closedDate ? `| Closed: ${new Date(caseItem.closedDate).toLocaleDateString()}` : ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1832,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, caseItem.id, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1816,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0));
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1809,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1807,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    contacts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-lean-white rounded-lg shadow-lg p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-semibold text-lean-black mb-4",
                                                children: [
                                                    "Account Contacts (",
                                                    contacts.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1845,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3 max-h-96 overflow-y-auto",
                                                children: contactsWithCaseInvolvement.map((contact)=>{
                                                    const contactLevel = contact.contactLevel || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categorizeContactLevel"])(contact.title || contact.linkedinProfile?.current_title || '');
                                                    const isInvolved = contact.involvedInCases;
                                                    const salesforceUrl = contact.id ? `https://leandata.my.salesforce.com/${contact.id}` : null;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-lean-almost-white rounded-lg p-3 border border-lean-black/20",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: salesforceUrl,
                                                                target: "_blank",
                                                                rel: "noopener noreferrer",
                                                                className: "font-medium text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 mb-1",
                                                                children: [
                                                                    contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Contact',
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-4 h-4 text-blue-500",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2,
                                                                            d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 1864,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1863,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1856,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            contact.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-lean-black-70 mt-1",
                                                                children: contact.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1868,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap gap-x-3 gap-y-1 text-xs text-lean-black-60 mt-1",
                                                                children: [
                                                                    contact.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                        href: `mailto:${contact.email}`,
                                                                        className: "text-blue-600 hover:text-blue-800 hover:underline",
                                                                        children: contact.email
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1872,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    contact.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                        href: `tel:${contact.phone}`,
                                                                        className: "text-blue-600 hover:text-blue-800 hover:underline",
                                                                        children: contact.phone
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1877,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    contact.linkedinURL && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                        href: contact.linkedinURL,
                                                                        target: "_blank",
                                                                        rel: "noopener noreferrer",
                                                                        className: "text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1",
                                                                        "aria-label": `View ${contact.name} on LinkedIn`,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                                className: "w-3 h-3",
                                                                                fill: "currentColor",
                                                                                viewBox: "0 0 24 24",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 1890,
                                                                                    columnNumber: 33
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 1889,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            "LinkedIn"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1882,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1870,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            contact.linkedinProfile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-2 pt-2 border-t border-lean-black/20",
                                                                children: [
                                                                    contact.linkedinProfile.job_changed_recently && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-red-600 font-semibold mb-1",
                                                                        children: "⚠️ Recent job change detected"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1899,
                                                                        columnNumber: 31
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    contact.linkedinProfile.current_title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-lean-black-70",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-medium",
                                                                                children: "LinkedIn:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 1905,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " ",
                                                                            contact.linkedinProfile.current_title,
                                                                            contact.linkedinProfile.current_company && ` at ${contact.linkedinProfile.current_company}`
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 1904,
                                                                        columnNumber: 31
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 1897,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, contact.id, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 1855,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0));
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 1846,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1844,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1804,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                        lineNumber: 1084,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                    lineNumber: 1083,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                    className: "bg-lean-black px-4 sm:px-6 lg:px-8 py-4 flex-shrink-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-6xl mx-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-[#f7f7f7] text-center",
                            children: "✅ Sentiment analysis is securely handled via Vercel Serverless Function"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 1924,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                        lineNumber: 1923,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                    lineNumber: 1922,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/SentimentAnalyzer.js",
            lineNumber: 1026,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    };
    _s1(ResultsPage, "pcFq+SSHdhxFiAs5OFkJDVCRaTo=");
    // Show results page if analysis is complete
    if (showResultsPage && sentiment) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultsPage, {
                sentiment: sentiment,
                dataSources: dataSources,
                analysisData: analysisData,
                selectedAccount: selectedAccount,
                cases: cases,
                contacts: contacts,
                sentimentHistory: sentimentHistory,
                historyLoading: historyLoading,
                avomaWarning: avomaWarning,
                onBack: ()=>{
                    setShowResultsPage(false);
                    setSentiment(null);
                    setAnalysisData(null);
                    setDataSources(null);
                    setSentimentHistory(null);
                    setAvomaWarning(null);
                },
                onShowHelp: ()=>setShowHelp(true),
                onCloseHelp: ()=>setShowHelp(false),
                showHelp: showHelp
            }, void 0, false, {
                fileName: "[project]/src/components/SentimentAnalyzer.js",
                lineNumber: 1937,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-lean-almost-white flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Header$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                user: user,
                onSignOut: onSignOut,
                showHelp: showHelp,
                setShowHelp: setShowHelp
            }, void 0, false, {
                fileName: "[project]/src/components/SentimentAnalyzer.js",
                lineNumber: 1966,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 px-4 sm:px-6 lg:px-8 py-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-4xl mx-auto",
                    children: [
                        showHelp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HelpPage, {
                            onClose: ()=>setShowHelp(false)
                        }, void 0, false, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 1971,
                            columnNumber: 22
                        }, ("TURBOPACK compile-time value", void 0)),
                        loadingAccounts ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-lean-white rounded-lg shadow-lg p-6 mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center py-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                        className: "w-6 h-6 animate-spin text-blue-600 mr-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1977,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lean-black-70",
                                        children: "Loading your accounts..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 1978,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 1976,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 1975,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-lean-white rounded-lg shadow-lg p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "account-select",
                                                    className: "block text-sm font-semibold text-lean-black",
                                                    children: "📋 My Accounts"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 1986,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        router.push('/user');
                                                    },
                                                    className: "text-xs text-lean-green hover:text-lean-green/80 underline font-medium transition-colors",
                                                    "aria-label": "Manage accounts",
                                                    children: "Manage Accounts →"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 1989,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 1985,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        accounts.length > 0 && !isSearchMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            id: "account-select",
                                            value: selectedAccount?.id || '',
                                            onChange: (e)=>{
                                                const account = accounts.find((acc)=>acc.id === e.target.value);
                                                setSelectedAccount(account);
                                                setCustomerIdentifier(account?.name || '');
                                            },
                                            className: "w-full px-4 py-3 border border-lean-black/20 rounded-lg focus:ring-2 focus:ring-lean-green focus:border-transparent outline-none transition-all",
                                            "aria-label": "Select Salesforce account",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "-- Select an account --"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2011,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                accounts.map((account)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: account.id,
                                                        children: [
                                                            account.name,
                                                            " ",
                                                            account.accountTier ? `(${account.accountTier})` : ''
                                                        ]
                                                    }, account.id, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 2013,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2000,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)) : !isSearchMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg",
                                            role: "alert",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-yellow-700 mb-2",
                                                    children: [
                                                        "No accounts found. Visit the ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "My Accounts"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2021,
                                                            columnNumber: 50
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        " page to add accounts."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2020,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        router.push('/user');
                                                    },
                                                    className: "text-sm text-yellow-800 hover:text-yellow-900 underline font-semibold",
                                                    children: "Go to My Accounts →"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2023,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2019,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg",
                                            role: "alert",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-blue-700",
                                                children: "Currently showing search results. Select an account from the search results on the right."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 2034,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2033,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 1984,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-lean-white rounded-lg shadow-lg p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "account-search",
                                                    className: "block text-sm font-semibold text-lean-black",
                                                    children: isSearchMode ? '🔍 Search Results' : '🔍 Search for Any Account'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2044,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                isSearchMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleClearSearch,
                                                    className: "text-sm text-blue-600 hover:text-blue-800 underline",
                                                    "aria-label": "Clear search and show assigned accounts",
                                                    children: "Show My Accounts"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2048,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2043,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "account-search",
                                                    type: "text",
                                                    value: searchTerm,
                                                    onChange: (e)=>setSearchTerm(e.target.value),
                                                    onKeyPress: (e)=>{
                                                        if (e.key === 'Enter') {
                                                            handleSearch(searchTerm);
                                                        }
                                                    },
                                                    placeholder: "Type account name to search (min 2 characters)...",
                                                    className: "flex-1 px-4 py-3 border-2 border-lean-black/20 rounded-lg focus:ring-2 focus:ring-lean-green focus:border-lean-green outline-none transition-all",
                                                    "aria-label": "Search for Salesforce account"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2058,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleSearch(searchTerm),
                                                    disabled: isSearching || !searchTerm || searchTerm.trim().length < 2,
                                                    className: "px-6 py-3 bg-lean-green text-lean-white rounded-lg hover:bg-lean-green/90 disabled:bg-lean-black/30 disabled:cursor-not-allowed transition-colors font-medium shadow-md",
                                                    "aria-label": "Search accounts",
                                                    children: isSearching ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                                        className: "w-5 h-5 animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 2079,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)) : 'Search'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2072,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2057,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        isSearchMode && accounts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    id: "search-account-select",
                                                    value: selectedAccount?.id || '',
                                                    onChange: (e)=>{
                                                        const account = accounts.find((acc)=>acc.id === e.target.value);
                                                        setSelectedAccount(account);
                                                        setCustomerIdentifier(account?.name || '');
                                                    // useEffect will handle fetching cases and contacts when selectedAccount changes
                                                    },
                                                    className: "w-full px-4 py-3 border border-lean-black/20 rounded-lg focus:ring-2 focus:ring-lean-green focus:border-transparent outline-none transition-all",
                                                    "aria-label": "Select from search results",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "-- Select from search results --"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2099,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        accounts.map((account)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: account.id,
                                                                children: [
                                                                    account.name,
                                                                    " ",
                                                                    account.accountTier ? `(${account.accountTier})` : ''
                                                                ]
                                                            }, account.id, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2101,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2087,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-lean-black-60 mt-2",
                                                    children: [
                                                        "Found ",
                                                        accounts.length,
                                                        " account",
                                                        accounts.length !== 1 ? 's' : '',
                                                        ". Select one to analyze."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2106,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true) : isSearchMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-lean-almost-white border border-lean-black/20 rounded-lg p-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-lean-black-70",
                                                children: [
                                                    'No accounts found matching "',
                                                    searchTerm,
                                                    '". Try a different search term.'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 2112,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2111,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-lean-black-60",
                                            children: "Search for any account in Salesforce by name. Results will appear here."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2117,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 2042,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 1982,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        selectedAccount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-lean-white rounded-lg shadow-lg p-6 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-semibold text-lean-black",
                                            children: "Selected Account Details"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2129,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                checkingCache ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 text-xs text-lean-black-70",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                                            className: "w-4 h-4 animate-spin text-lean-green"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2134,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Checking cache..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2135,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2133,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)) : cachedSentiment ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 text-xs",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium",
                                                            children: "✓ Cached"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2139,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lean-black-70",
                                                            children: (()=>{
                                                                try {
                                                                    const analyzedDate = new Date(cachedSentiment.analyzed_at);
                                                                    const now = new Date();
                                                                    const diffMs = now - analyzedDate;
                                                                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                                                                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                                                                    if (diffDays === 0 && diffHours === 0) {
                                                                        const diffMins = Math.floor(diffMs / (1000 * 60));
                                                                        return diffMins < 1 ? 'Just now' : `${diffMins} min ago`;
                                                                    } else if (diffDays === 0) {
                                                                        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                                                                    } else if (diffDays === 1) {
                                                                        return 'Yesterday';
                                                                    } else if (diffDays < 7) {
                                                                        return `${diffDays} days ago`;
                                                                    } else {
                                                                        return analyzedDate.toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric'
                                                                        });
                                                                    }
                                                                } catch  {
                                                                    return 'Recently';
                                                                }
                                                            })()
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2142,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2138,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)) : null,
                                                cachedSentiment ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                // View cached sentiment - load it directly
                                                                if (cachedSentiment.id) {
                                                                    router.push(`/sentiment/${cachedSentiment.id}`);
                                                                } else {
                                                                    // Fallback: set sentiment from cache and show results
                                                                    setSentiment({
                                                                        score: cachedSentiment.score,
                                                                        summary: cachedSentiment.summary,
                                                                        comprehensiveAnalysis: cachedSentiment.comprehensive_analysis || cachedSentiment.summary,
                                                                        cached: true,
                                                                        analyzedAt: cachedSentiment.analyzed_at
                                                                    });
                                                                    setShowResultsPage(true);
                                                                }
                                                            },
                                                            disabled: loading,
                                                            className: "px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm",
                                                            "aria-label": "View cached sentiment",
                                                            children: "View Cached"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2174,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleAnalyze(0, true),
                                                            disabled: loading || !selectedAccount || !customerIdentifier,
                                                            className: "px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 focus:outline-none focus:ring-2 focus:ring-lean-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm",
                                                            "aria-label": loading ? 'Re-running analysis' : 'Re-run analysis',
                                                            "aria-busy": loading,
                                                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                                                        className: "w-4 h-4 animate-spin"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2206,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "Analyzing..."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2207,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-4 h-4",
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2,
                                                                            d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2212,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2211,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "Re-run"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2214,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2197,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2173,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleAnalyze(0, false),
                                                    disabled: loading || !selectedAccount || !customerIdentifier,
                                                    className: "px-6 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 focus:outline-none focus:ring-2 focus:ring-lean-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2",
                                                    "aria-label": loading ? 'Analyzing sentiment' : 'View sentiment analysis',
                                                    "aria-busy": loading,
                                                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                                                className: "w-5 h-5 animate-spin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2229,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Analyzing..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2230,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-5 h-5",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2235,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2236,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2234,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "View Sentiment"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2238,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2220,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2130,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 2128,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lean-black-70",
                                                    children: "Account:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2247,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 font-medium text-lean-black block",
                                                    children: selectedAccount.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2248,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2246,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lean-black-70",
                                                    children: "Tier:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2251,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 font-medium text-lean-black",
                                                    children: selectedAccount.accountTier || 'N/A'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2252,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2250,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lean-black-70",
                                                    children: "Contract Value:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2255,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 font-medium text-lean-black",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedAccount.contractValue)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2256,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2254,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lean-black-70",
                                                    children: "Industry:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2259,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 font-medium text-lean-black",
                                                    children: selectedAccount.industry || 'N/A'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2260,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2258,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lean-black-70",
                                                    children: "Owner:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2263,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 font-medium text-lean-black",
                                                    children: selectedAccount.ownerName || 'N/A'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2264,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2262,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lean-black-70",
                                                    children: "Support Cases:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2267,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 font-medium text-lean-black",
                                                    children: casesLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: casesLoadingFromCache ? "text-blue-600" : "text-orange-600",
                                                        children: casesLoadingFromCache ? "Loading from cache..." : "Loading from Salesforce..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 2270,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)) : cases.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowCasesList(!showCasesList),
                                                        className: "text-blue-600 hover:text-blue-800 underline font-semibold",
                                                        "aria-label": `${cases.length} cases - click to ${showCasesList ? 'hide' : 'show'} list`,
                                                        children: [
                                                            cases.length,
                                                            " case",
                                                            cases.length !== 1 ? 's' : ''
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 2274,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)) : '0'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2268,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2266,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lean-black-70",
                                                    children: "Contacts:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2287,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ml-2 font-medium text-lean-black",
                                                    children: contactsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: contactsLoadingFromCache ? "text-blue-600" : "text-orange-600",
                                                        children: contactsLoadingFromCache ? "Loading from cache..." : "Loading from Salesforce..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 2290,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)) : contacts.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowContactsList(!showContactsList),
                                                        className: "text-blue-600 hover:text-blue-800 underline font-semibold",
                                                        "aria-label": `${contacts.length} contacts - click to ${showContactsList ? 'hide' : 'show'} list`,
                                                        children: [
                                                            contacts.length,
                                                            " contact",
                                                            contacts.length !== 1 ? 's' : ''
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 2294,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)) : '0'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2288,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2286,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 2245,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                cases.length > 0 && showCasesList && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 pt-4 border-t border-lean-black/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "text-sm font-semibold text-lean-black",
                                                    children: [
                                                        "Recent Support Cases (",
                                                        cases.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2312,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowCasesList(false),
                                                    className: "text-xs text-lean-black-60 hover:text-lean-black-80",
                                                    "aria-label": "Hide cases list",
                                                    children: "Hide"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2315,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2311,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 max-h-96 overflow-y-auto",
                                            children: cases.map((caseItem, idx)=>{
                                                // Build Salesforce URL if we have the case ID
                                                const salesforceUrl = caseItem.id ? `https://leandata.my.salesforce.com/${caseItem.id}` : null;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-lean-almost-white rounded-lg p-3 border border-lean-black/20 hover:border-lean-green/30 hover:bg-lean-green-10 transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start justify-between gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 mb-1",
                                                                        children: [
                                                                            salesforceUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                href: salesforceUrl,
                                                                                target: "_blank",
                                                                                rel: "noopener noreferrer",
                                                                                className: "font-semibold text-blue-600 hover:text-blue-800 hover:underline text-sm",
                                                                                onClick: (e)=>e.stopPropagation(),
                                                                                children: caseItem.caseNumber || `Case ${idx + 1}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2339,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-semibold text-lean-black text-sm",
                                                                                children: caseItem.caseNumber || `Case ${idx + 1}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2349,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `text-xs px-2 py-0.5 rounded-full ${caseItem.status === 'Closed' ? 'bg-green-100 text-green-800' : caseItem.status === 'Open' ? 'bg-blue-100 text-blue-800' : caseItem.priority === 'High' || caseItem.priority === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`,
                                                                                children: caseItem.status || 'Unknown'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2353,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            caseItem.priority && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs text-lean-black-70",
                                                                                children: [
                                                                                    caseItem.priority,
                                                                                    " priority"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2362,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2337,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-lean-black font-medium mb-1",
                                                                        children: caseItem.subject || 'No subject'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2367,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    caseItem.createdDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-lean-black-60",
                                                                        children: [
                                                                            "Created: ",
                                                                            new Date(caseItem.createdDate).toLocaleDateString(),
                                                                            caseItem.closedDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "ml-2",
                                                                                children: [
                                                                                    "• Closed: ",
                                                                                    new Date(caseItem.closedDate).toLocaleDateString()
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2374,
                                                                                columnNumber: 35
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2371,
                                                                        columnNumber: 31
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2336,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            salesforceUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: salesforceUrl,
                                                                target: "_blank",
                                                                rel: "noopener noreferrer",
                                                                className: "text-blue-600 hover:text-blue-800 flex-shrink-0",
                                                                onClick: (e)=>e.stopPropagation(),
                                                                "aria-label": `Open case ${caseItem.caseNumber} in Salesforce`,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-5 h-5",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2391,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2390,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2382,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 2335,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, idx, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2331,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0));
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2323,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 2310,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                contacts.length > 0 && showContactsList && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 pt-4 border-t border-lean-black/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "text-sm font-semibold text-lean-black",
                                                    children: [
                                                        "Account Contacts (",
                                                        contacts.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2407,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowContactsList(false),
                                                    className: "text-xs text-lean-black-60 hover:text-lean-black-80",
                                                    "aria-label": "Hide contacts list",
                                                    children: "Hide"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2410,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2406,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 max-h-96 overflow-y-auto",
                                            children: contacts.map((contact, idx)=>{
                                                // Build Salesforce URL if we have the contact ID
                                                const salesforceUrl = contact.id ? `https://leandata.my.salesforce.com/${contact.id}` : null;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-lean-almost-white rounded-lg p-3 border border-lean-black/20 hover:border-lean-green/30 hover:bg-lean-green-10 transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start justify-between gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 mb-1",
                                                                        children: [
                                                                            salesforceUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                href: salesforceUrl,
                                                                                target: "_blank",
                                                                                rel: "noopener noreferrer",
                                                                                className: "font-semibold text-blue-600 hover:text-blue-800 hover:underline text-sm",
                                                                                onClick: (e)=>e.stopPropagation(),
                                                                                children: contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Contact'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2434,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-semibold text-lean-black text-sm",
                                                                                children: contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Contact'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2444,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            contact.contactStatus && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `text-xs px-2 py-0.5 rounded-full ${contact.contactStatus === 'Unqualified' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`,
                                                                                children: contact.contactStatus
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2449,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2432,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-lean-black-70 mb-1",
                                                                        children: [
                                                                            contact.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: contact.title
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2459,
                                                                                columnNumber: 49
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            contact.department && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "ml-2 text-lean-black-60",
                                                                                children: [
                                                                                    "• ",
                                                                                    contact.department
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2461,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            contact.reportsToName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "ml-2 text-lean-black-60",
                                                                                children: [
                                                                                    "• Reports to: ",
                                                                                    contact.reportsToName
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2464,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2458,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    (contact.linkedinProfile?.job_changed_recently || contact.linkedinProfile?.job_change_likelihood && contact.linkedinProfile.job_change_likelihood > 50) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mb-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold",
                                                                                children: "⚠️ Job Change Risk"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2471,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            contact.linkedinProfile.days_in_current_role && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs text-lean-black-60 ml-2",
                                                                                children: [
                                                                                    "(",
                                                                                    contact.linkedinProfile.days_in_current_role,
                                                                                    " days in role)"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2475,
                                                                                columnNumber: 35
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2470,
                                                                        columnNumber: 31
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    contact.lastActivityDate && (()=>{
                                                                        const daysSinceActivity = Math.floor((new Date() - new Date(contact.lastActivityDate)) / (24 * 60 * 60 * 1000));
                                                                        const isStale = daysSinceActivity > 90;
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mb-1",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `text-xs ${isStale ? 'text-red-600 font-semibold' : 'text-lean-black-60'}`,
                                                                                children: [
                                                                                    "Last activity: ",
                                                                                    daysSinceActivity,
                                                                                    " days ago ",
                                                                                    isStale ? '(Stale)' : ''
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2487,
                                                                                columnNumber: 35
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2486,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0));
                                                                    })(),
                                                                    contact.linkedinProfile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mb-1 flex flex-wrap gap-2",
                                                                        children: [
                                                                            contact.linkedinProfile.email_verified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800",
                                                                                children: "✓ Verified Email"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2497,
                                                                                columnNumber: 35
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            contact.linkedinProfile.company_industry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs text-lean-black-60",
                                                                                children: [
                                                                                    "Industry: ",
                                                                                    contact.linkedinProfile.company_industry
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2502,
                                                                                columnNumber: 35
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            contact.linkedinProfile.company_size && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs text-lean-black-60",
                                                                                children: [
                                                                                    "Company: ",
                                                                                    contact.linkedinProfile.company_size.toLocaleString(),
                                                                                    " employees"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2507,
                                                                                columnNumber: 35
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2495,
                                                                        columnNumber: 31
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-lean-black-60",
                                                                        children: [
                                                                            contact.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                href: `mailto:${contact.email}`,
                                                                                className: "text-blue-600 hover:text-blue-800 hover:underline",
                                                                                children: contact.email
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2515,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            contact.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                href: `tel:${contact.phone}`,
                                                                                className: "text-blue-600 hover:text-blue-800 hover:underline",
                                                                                children: contact.phone
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2523,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            contact.mobilePhone && !contact.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                href: `tel:${contact.mobilePhone}`,
                                                                                className: "text-blue-600 hover:text-blue-800 hover:underline",
                                                                                children: [
                                                                                    contact.mobilePhone,
                                                                                    " (mobile)"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2531,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            contact.mailingCity && contact.mailingState && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-lean-black-60",
                                                                                children: [
                                                                                    "📍 ",
                                                                                    contact.mailingCity,
                                                                                    ", ",
                                                                                    contact.mailingState
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2539,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2513,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2431,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            salesforceUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: salesforceUrl,
                                                                target: "_blank",
                                                                rel: "noopener noreferrer",
                                                                className: "text-blue-600 hover:text-blue-800 flex-shrink-0",
                                                                onClick: (e)=>e.stopPropagation(),
                                                                "aria-label": `Open contact ${contact.name} in Salesforce`,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-5 h-5",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2555,
                                                                        columnNumber: 33
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2554,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2546,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 2430,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, idx, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2426,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0));
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2418,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 2405,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 2127,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6",
                            role: "alert",
                            "aria-live": "polite",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-shrink-0",
                                        "aria-hidden": "true",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "h-5 w-5 text-red-400",
                                            viewBox: "0 0 20 20",
                                            fill: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                fillRule: "evenodd",
                                                d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                                                clipRule: "evenodd"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 2575,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2574,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 2573,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "ml-3 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-red-700 font-medium",
                                                children: "Error"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 2579,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-red-600 mt-1",
                                                children: error
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 2580,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            retryCount > 0 && retryCount < maxRetries && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleAnalyze(retryCount),
                                                    className: "text-sm text-red-700 hover:text-red-900 font-medium underline",
                                                    "aria-label": `Retry analysis (attempt ${retryCount + 1} of ${maxRetries})`,
                                                    children: [
                                                        "Retry (",
                                                        retryCount,
                                                        "/",
                                                        maxRetries,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2583,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 2582,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 2578,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                lineNumber: 2572,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 2571,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        false && sentiment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-lean-white rounded-lg shadow-lg p-8",
                            role: "region",
                            "aria-live": "polite",
                            "aria-label": "Sentiment analysis results",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-center mb-6 p-8 rounded-xl border-2 ${getScoreColor(sentiment.score)}`,
                                    role: "status",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-6xl font-bold mb-2",
                                            "aria-label": `Sentiment score: ${sentiment.score} out of 10`,
                                            children: sentiment.score
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2602,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xl font-semibold text-lean-black-70",
                                            children: "/ 10"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2605,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 2601,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `rounded-lg p-6 ${getScoreBgColor(sentiment.score)}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3",
                                        children: [
                                            sentiment.score >= 8 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUpIcon"], {
                                                className: "w-6 h-6 text-lean-green flex-shrink-0 mt-1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 2614,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingDownIcon"], {
                                                className: "w-6 h-6 text-red-600 flex-shrink-0 mt-1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 2616,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-semibold text-lean-black",
                                                                children: "Executive Summary"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2620,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-lean-black-60 bg-lean-almost-white px-2 py-1 rounded",
                                                                children: "C-Level Brief"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2621,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 2619,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-lean-black-80 leading-relaxed",
                                                        children: sentiment.summary
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 2625,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 2618,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                        lineNumber: 2612,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 2611,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                sentiment.comprehensiveAnalysis && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-lean-white rounded-lg shadow-lg p-8 mb-6 border-l-4 border-lean-green",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-xl font-semibold text-lean-black",
                                                        children: "Comprehensive Analysis"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 2635,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-lean-black-60 bg-blue-50 px-2 py-1 rounded border border-blue-200",
                                                        children: "For CSMs & Account Managers"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                        lineNumber: 2636,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 2634,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2633,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "prose max-w-none",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-lean-black-80 leading-relaxed whitespace-pre-wrap",
                                                children: sentiment.comprehensiveAnalysis
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                lineNumber: 2642,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2641,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 2632,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                dataSources && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 pt-6 border-t border-lean-black/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "text-sm font-semibold text-lean-black mb-3",
                                            children: "Analysis Data Sources"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2652,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                dataSources.hasTranscription ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-5 h-5 text-lean-green",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2658,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2657,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-5 h-5 text-gray-400",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M6 18L18 6M6 6l12 12"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2662,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2661,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium text-lean-black-80",
                                                                    children: "Avoma Transcription"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2665,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2655,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        dataSources.hasTranscription ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-lean-black-70 ml-7",
                                                            children: [
                                                                dataSources.transcriptionLength.toLocaleString(),
                                                                " characters from customer call/meeting",
                                                                dataSources.avomaCallsTotal > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "block mt-1 text-xs text-lean-black-60",
                                                                    children: [
                                                                        "Found ",
                                                                        dataSources.avomaCallsTotal,
                                                                        " meeting",
                                                                        dataSources.avomaCallsTotal !== 1 ? 's' : '',
                                                                        dataSources.avomaCallsReady > 0 && ` (${dataSources.avomaCallsReady} with ready transcripts)`
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2671,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2668,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-lean-black-60 ml-7 text-xs",
                                                            children: "No transcription available"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2678,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2654,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                dataSources.hasAccountData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-5 h-5 text-lean-green",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2686,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2685,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-5 h-5 text-gray-400",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M6 18L18 6M6 6l12 12"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2690,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2689,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-medium text-lean-black-80",
                                                                    children: "Salesforce Account"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2693,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2683,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        dataSources.hasAccountData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-lean-black-70 ml-7",
                                                            children: [
                                                                dataSources.accountName,
                                                                dataSources.casesCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "block mt-1 text-xs text-lean-black-60",
                                                                    children: [
                                                                        dataSources.casesCount,
                                                                        " support case",
                                                                        dataSources.casesCount !== 1 ? 's' : '',
                                                                        " found"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2699,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2696,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-lean-black-60 ml-7 text-xs",
                                                            children: "No account data available"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2705,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2682,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2653,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 pt-4 border-t border-gray-100",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-lean-black-60 mb-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "AI Analysis:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2711,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        " Powered by Google Gemini 2.5 Flash, analyzing conversation tone, customer language, and account context to generate sentiment score."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2710,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowDataDetails(!showDataDetails),
                                                    className: "text-xs text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1",
                                                    "aria-expanded": showDataDetails,
                                                    "aria-label": showDataDetails ? 'Hide data details' : 'Show data details',
                                                    children: showDataDetails ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-4 h-4",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M5 15l7-7 7 7"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2723,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2722,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            "Hide Data Used in Analysis"
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-4 h-4",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M19 9l-7 7-7-7"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2730,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2729,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            "Show Data Used in Analysis"
                                                        ]
                                                    }, void 0, true)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2714,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2709,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 2651,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                showDataDetails && analysisData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 pt-6 border-t border-lean-black/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "text-sm font-semibold text-lean-black mb-4",
                                            children: "Exact Data Analyzed"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2743,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-lean-almost-white rounded-lg p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                    className: "text-xs font-semibold text-lean-black-80 uppercase tracking-wide",
                                                                    children: [
                                                                        "Avoma Transcription (",
                                                                        analysisData.transcription.length.toLocaleString(),
                                                                        " characters)"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2749,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-lean-black-60",
                                                                    children: [
                                                                        Math.round(analysisData.transcription.length / 5),
                                                                        " words"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2752,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2748,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-lean-white rounded border border-lean-black/20 p-3 max-h-64 overflow-y-auto",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                                className: "text-xs text-lean-black-80 whitespace-pre-wrap font-mono",
                                                                children: [
                                                                    analysisData.transcriptionPreview,
                                                                    analysisData.transcription.length > 500 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-400 italic",
                                                                        children: '\n\n[... ' + (analysisData.transcription.length - 500).toLocaleString() + ' more characters ...]'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                        lineNumber: 2760,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                lineNumber: 2757,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2756,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2747,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-lean-almost-white rounded-lg p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                            className: "text-xs font-semibold text-lean-black-80 uppercase tracking-wide mb-3",
                                                            children: "Salesforce Account Context"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2770,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-lean-white rounded border border-lean-black/20 p-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-xs",
                                                                    children: [
                                                                        analysisData.salesforceContext.account_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium text-lean-black-70",
                                                                                    children: "Account:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2777,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-lean-black",
                                                                                    children: analysisData.salesforceContext.account_name
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2778,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2776,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        analysisData.salesforceContext.account_tier && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium text-lean-black-70",
                                                                                    children: "Tier:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2783,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-lean-black",
                                                                                    children: analysisData.salesforceContext.account_tier
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2784,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2782,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        analysisData.salesforceContext.contract_value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium text-lean-black-70",
                                                                                    children: "Contract Value:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2789,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-lean-black",
                                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(analysisData.salesforceContext.contract_value)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2790,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2788,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        analysisData.salesforceContext.industry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium text-lean-black-70",
                                                                                    children: "Industry:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2795,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-lean-black",
                                                                                    children: analysisData.salesforceContext.industry
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2796,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2794,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        analysisData.salesforceContext.annual_revenue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium text-lean-black-70",
                                                                                    children: "Annual Revenue:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2801,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-lean-black",
                                                                                    children: [
                                                                                        "$",
                                                                                        analysisData.salesforceContext.annual_revenue.toLocaleString()
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2802,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2800,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        analysisData.salesforceContext.account_manager && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium text-lean-black-70",
                                                                                    children: "Account Manager:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2809,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-lean-black",
                                                                                    children: analysisData.salesforceContext.account_manager
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2810,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2808,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        analysisData.salesforceContext.total_cases_count !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium text-lean-black-70",
                                                                                    children: "Support Cases:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2815,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-lean-black",
                                                                                    children: analysisData.salesforceContext.total_cases_count
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2816,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2814,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        analysisData.salesforceContext.total_avoma_calls !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium text-lean-black-70",
                                                                                    children: "Avoma Meetings:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2821,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "ml-2 text-lean-black",
                                                                                    children: [
                                                                                        analysisData.salesforceContext.ready_avoma_calls || 0,
                                                                                        " ready / ",
                                                                                        analysisData.salesforceContext.total_avoma_calls,
                                                                                        " total"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2822,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2820,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2774,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                analysisData.salesforceContext.recent_tickets && analysisData.salesforceContext.recent_tickets.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-4 pt-4 border-t border-lean-black/20",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center justify-between mb-2",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs font-semibold text-lean-black-80",
                                                                                children: [
                                                                                    "Recent Support Cases (",
                                                                                    analysisData.salesforceContext.recent_tickets.length,
                                                                                    ")"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                lineNumber: 2834,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2833,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "space-y-2",
                                                                            children: [
                                                                                analysisData.salesforceContext.recent_tickets.slice(0, 5).map((ticket, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-xs bg-lean-almost-white rounded p-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "flex items-center justify-between",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "font-medium text-lean-black",
                                                                                                        children: ticket.subject || 'No subject'
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                                        lineNumber: 2842,
                                                                                                        columnNumber: 35
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "text-lean-black-60",
                                                                                                        children: ticket.status || 'Unknown'
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                                        lineNumber: 2843,
                                                                                                        columnNumber: 35
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                                lineNumber: 2841,
                                                                                                columnNumber: 33
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            ticket.priority && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "text-lean-black-70 mt-1",
                                                                                                children: [
                                                                                                    "Priority: ",
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "font-medium",
                                                                                                        children: ticket.priority
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                                        lineNumber: 2847,
                                                                                                        columnNumber: 47
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    ticket.created_date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "ml-2 text-lean-black-60",
                                                                                                        children: [
                                                                                                            "• ",
                                                                                                            new Date(ticket.created_date).toLocaleDateString()
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                                        lineNumber: 2849,
                                                                                                        columnNumber: 39
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                                lineNumber: 2846,
                                                                                                columnNumber: 35
                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                        ]
                                                                                    }, idx, true, {
                                                                                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                        lineNumber: 2840,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0))),
                                                                                analysisData.salesforceContext.recent_tickets.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-lean-black-60 italic mt-2",
                                                                                    children: [
                                                                                        "... and ",
                                                                                        analysisData.salesforceContext.recent_tickets.length - 5,
                                                                                        " more case",
                                                                                        analysisData.salesforceContext.recent_tickets.length - 5 !== 1 ? 's' : ''
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                                    lineNumber: 2858,
                                                                                    columnNumber: 31
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2838,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2832,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2773,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2769,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-blue-50 rounded-lg p-4 border border-blue-200",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                            className: "text-xs font-semibold text-blue-900 uppercase tracking-wide mb-2",
                                                            children: "Data Summary"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2870,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-xs",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-blue-600 font-medium",
                                                                            children: "Transcription"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2875,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-blue-900",
                                                                            children: [
                                                                                analysisData.transcription.length.toLocaleString(),
                                                                                " chars"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2876,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2874,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-blue-600 font-medium",
                                                                            children: "Account Fields"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2879,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-blue-900",
                                                                            children: [
                                                                                Object.keys(analysisData.salesforceContext).filter((k)=>![
                                                                                        'recent_tickets',
                                                                                        'account_id'
                                                                                    ].includes(k) && analysisData.salesforceContext[k] !== null).length,
                                                                                " provided"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2880,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2878,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-blue-600 font-medium",
                                                                            children: "Support Cases"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2888,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-blue-900",
                                                                            children: [
                                                                                analysisData.salesforceContext.recent_tickets?.length || 0,
                                                                                " cases"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2889,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2887,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-blue-600 font-medium",
                                                                            children: "Total Context"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2894,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-blue-900",
                                                                            children: [
                                                                                (analysisData.transcription.length + JSON.stringify(analysisData.salesforceContext).length).toLocaleString(),
                                                                                " chars"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                            lineNumber: 2895,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                                    lineNumber: 2893,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                            lineNumber: 2873,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                                    lineNumber: 2869,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                                            lineNumber: 2745,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                                    lineNumber: 2742,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/SentimentAnalyzer.js",
                            lineNumber: 2599,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                    lineNumber: 1969,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/SentimentAnalyzer.js",
                lineNumber: 1968,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "bg-lean-black px-4 sm:px-6 lg:px-8 py-4 flex-shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-[#f7f7f7] text-center",
                        children: "✅ Sentiment analysis is securely handled via Vercel Serverless Function"
                    }, void 0, false, {
                        fileName: "[project]/src/components/SentimentAnalyzer.js",
                        lineNumber: 2916,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/SentimentAnalyzer.js",
                    lineNumber: 2915,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/SentimentAnalyzer.js",
                lineNumber: 2914,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/SentimentAnalyzer.js",
        lineNumber: 1964,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SentimentAnalyzer, "GMnuTvKSk8lSnagjvUeRd2pJTdc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SentimentAnalyzer;
const __TURBOPACK__default__export__ = SentimentAnalyzer;
var _c;
__turbopack_context__.k.register(_c, "SentimentAnalyzer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/SentimentAnalyzer.js [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/SentimentAnalyzer.js [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_a061dd93._.js.map