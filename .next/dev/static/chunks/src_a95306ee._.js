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
"[project]/src/components/calendar/CalendarPage.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Calendar Page Component
// Displays upcoming meetings with external contacts and research summary
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
const CalendarPage = ({ user, onSignOut })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [calendarConnected, setCalendarConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [checkingCalendar, setCheckingCalendar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [calendarConfigured, setCalendarConfigured] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [upcomingMeetings, setUpcomingMeetings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingMeetings, setLoadingMeetings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [researchSummary, setResearchSummary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Check Google Calendar connection status
    const checkCalendarConnection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalendarPage.useCallback[checkCalendarConnection]": async ()=>{
            if (!user?.id) {
                setCheckingCalendar(false);
                return;
            }
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deduplicatedFetch"])(`/api/google-calendar?action=status&userId=${user.id}`);
                const responseClone = response.clone();
                if (response.ok) {
                    const data = await responseClone.json();
                    setCalendarConnected(data.connected || false);
                    setCalendarConfigured(data.configured !== false);
                } else {
                    setCalendarConnected(false);
                    setCalendarConfigured(true);
                }
            } catch (err) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error checking calendar connection:', err);
                setCalendarConnected(false);
                setCalendarConfigured(true);
            } finally{
                setCheckingCalendar(false);
            }
        }
    }["CalendarPage.useCallback[checkCalendarConnection]"], [
        user
    ]);
    // Handle Google Calendar authorization
    const handleConnectCalendar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalendarPage.useCallback[handleConnectCalendar]": ()=>{
            if (!user?.id) {
                setError('User ID is required to connect Google Calendar');
                return;
            }
            // Redirect to Google Calendar OAuth endpoint
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.href = `/api/google-calendar?userId=${user.id}`;
            }
        }
    }["CalendarPage.useCallback[handleConnectCalendar]"], [
        user
    ]);
    // Handle Google Calendar disconnection
    const handleDisconnectCalendar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalendarPage.useCallback[handleDisconnectCalendar]": async ()=>{
            if (!user?.id) {
                setError('User ID is required to disconnect Google Calendar');
                return;
            }
            if (!confirm('Are you sure you want to disconnect Google Calendar? You will need to reconnect to sync your meetings.')) {
                return;
            }
            try {
                // Use query param for DELETE requests (more reliable than body in some environments)
                const response = await fetch(`/api/google-calendar?userId=${encodeURIComponent(user.id)}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "CalendarPage.useCallback[handleDisconnectCalendar]": ()=>({})
                    }["CalendarPage.useCallback[handleDisconnectCalendar]"]);
                    throw new Error(errorData.message || errorData.error || 'Failed to disconnect Google Calendar');
                }
                setCalendarConnected(false);
                setUpcomingMeetings([]);
                setResearchSummary(null);
            } catch (err) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error disconnecting calendar:', err);
                setError(err.message || 'Failed to disconnect Google Calendar. Please try again.');
            }
        }
    }["CalendarPage.useCallback[handleDisconnectCalendar]"], [
        user
    ]);
    // Fetch upcoming meetings
    const fetchUpcomingMeetings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalendarPage.useCallback[fetchUpcomingMeetings]": async (forceRefresh = false)=>{
            if (!user?.id || !calendarConnected) {
                return;
            }
            try {
                setLoadingMeetings(true);
                setError(null);
                const url = `/api/google-calendar?userId=${user.id}&action=events&days=7${forceRefresh ? '&forceRefresh=true' : ''}`;
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deduplicatedFetch"])(url);
                const responseClone = response.clone();
                if (!response.ok) {
                    if (response.status === 401) {
                        setCalendarConnected(false);
                        return;
                    }
                    const errorData = await responseClone.json().catch({
                        "CalendarPage.useCallback[fetchUpcomingMeetings]": ()=>({})
                    }["CalendarPage.useCallback[fetchUpcomingMeetings]"]);
                    throw new Error(errorData.message || errorData.error || 'Failed to fetch meetings');
                }
                const data = await responseClone.json();
                const allEvents = data.events || [];
                // Filter to only show meetings with matched accounts
                // We'll show any event that has matched accounts, regardless of how they matched
                const userEmail = user.email?.toLowerCase();
                const filteredEvents = allEvents.filter({
                    "CalendarPage.useCallback[fetchUpcomingMeetings].filteredEvents": ({ event, matchedAccounts })=>{
                        // Must have matched accounts
                        if (!matchedAccounts || matchedAccounts.length === 0) {
                            return false;
                        }
                        // If there are attendees, check if any are external (not the user)
                        if (event.attendees && Array.isArray(event.attendees)) {
                            const hasExternalAttendee = event.attendees.some({
                                "CalendarPage.useCallback[fetchUpcomingMeetings].filteredEvents.hasExternalAttendee": (attendee)=>{
                                    if (!attendee.email) return false;
                                    const attendeeEmail = attendee.email.toLowerCase();
                                    // Skip if this is the user's email
                                    return !(userEmail && attendeeEmail === userEmail);
                                }
                            }["CalendarPage.useCallback[fetchUpcomingMeetings].filteredEvents.hasExternalAttendee"]);
                            // If there are external attendees, show the event
                            if (hasExternalAttendee) {
                                return true;
                            }
                        }
                        // Also show events matched by account name even if no external attendees
                        // (in case the account name was found in title/description)
                        return true;
                    }
                }["CalendarPage.useCallback[fetchUpcomingMeetings].filteredEvents"]);
                setUpcomingMeetings(filteredEvents);
                // Create research summary
                const accountMap = new Map();
                filteredEvents.forEach({
                    "CalendarPage.useCallback[fetchUpcomingMeetings]": ({ matchedAccounts })=>{
                        matchedAccounts.forEach({
                            "CalendarPage.useCallback[fetchUpcomingMeetings]": (account)=>{
                                if (!accountMap.has(account.id)) {
                                    accountMap.set(account.id, {
                                        ...account,
                                        meetingCount: 0,
                                        meetings: []
                                    });
                                }
                                const accountData = accountMap.get(account.id);
                                accountData.meetingCount += 1;
                            }
                        }["CalendarPage.useCallback[fetchUpcomingMeetings]"]);
                    }
                }["CalendarPage.useCallback[fetchUpcomingMeetings]"]);
                // Add meeting details to each account
                filteredEvents.forEach({
                    "CalendarPage.useCallback[fetchUpcomingMeetings]": ({ event, matchedAccounts })=>{
                        const startTime = event.start?.dateTime || event.start?.date;
                        const startDate = startTime ? new Date(startTime) : null;
                        matchedAccounts.forEach({
                            "CalendarPage.useCallback[fetchUpcomingMeetings]": (account)=>{
                                const accountData = accountMap.get(account.id);
                                if (accountData && startDate) {
                                    accountData.meetings.push({
                                        title: event.summary || 'No Title',
                                        date: startDate,
                                        htmlLink: event.htmlLink
                                    });
                                }
                            }
                        }["CalendarPage.useCallback[fetchUpcomingMeetings]"]);
                    }
                }["CalendarPage.useCallback[fetchUpcomingMeetings]"]);
                // Convert to array and sort by meeting count (most meetings first)
                const researchAccounts = Array.from(accountMap.values()).sort({
                    "CalendarPage.useCallback[fetchUpcomingMeetings].researchAccounts": (a, b)=>b.meetingCount - a.meetingCount
                }["CalendarPage.useCallback[fetchUpcomingMeetings].researchAccounts"]);
                setResearchSummary({
                    totalAccounts: researchAccounts.length,
                    totalMeetings: filteredEvents.length,
                    accounts: researchAccounts
                });
            } catch (err) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error fetching meetings:', err);
                setError(err.message || 'Failed to fetch meetings. Please try again.');
            } finally{
                setLoadingMeetings(false);
            }
        }
    }["CalendarPage.useCallback[fetchUpcomingMeetings]"], [
        user,
        calendarConnected
    ]);
    // Load calendar status on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalendarPage.useEffect": ()=>{
            checkCalendarConnection();
        }
    }["CalendarPage.useEffect"], [
        checkCalendarConnection
    ]);
    // Fetch meetings when calendar is connected
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalendarPage.useEffect": ()=>{
            if (calendarConnected) {
                fetchUpcomingMeetings();
            } else {
                setUpcomingMeetings([]);
                setResearchSummary(null);
            }
        }
    }["CalendarPage.useEffect"], [
        calendarConnected,
        fetchUpcomingMeetings
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-lean-almost-white flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Header$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                user: user,
                onSignOut: onSignOut
            }, void 0, false, {
                fileName: "[project]/src/components/calendar/CalendarPage.js",
                lineNumber: 216,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 px-4 sm:px-6 lg:px-8 py-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "typography-heading text-lean-black mb-2",
                                    children: "Calendar"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                    lineNumber: 223,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-lean-black-70",
                                    children: "Upcoming meetings with external contacts"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                    lineNumber: 224,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                            lineNumber: 222,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-red-700",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/calendar/CalendarPage.js",
                                lineNumber: 229,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                            lineNumber: 228,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-lean-white rounded-lg shadow-lg p-6 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "typography-heading text-lean-black",
                                                    children: "Google Calendar"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                    lineNumber: 237,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-lean-black-70 mt-1",
                                                    children: "Connect your Google Calendar to see upcoming meetings and associated accounts"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                    lineNumber: 238,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                            lineNumber: 236,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        checkingCalendar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                            className: "w-5 h-5 animate-spin text-lean-green"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                            lineNumber: 243,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)) : !calendarConfigured ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-yellow-600 font-medium",
                                            children: "Not Configured"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                            lineNumber: 245,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)) : calendarConnected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm text-green-600 font-medium",
                                                    children: "Connected"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                    lineNumber: 248,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleDisconnectCalendar,
                                                    className: "px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors",
                                                    children: "Disconnect"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                    lineNumber: 249,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                            lineNumber: 247,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleConnectCalendar,
                                            className: "px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors",
                                            children: "Connect Calendar"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                            lineNumber: 257,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                    lineNumber: 235,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                !calendarConfigured && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-yellow-700",
                                        children: "⚠️ Google Calendar integration is not configured. Please contact your administrator to set up the required environment variables."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                        lineNumber: 267,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                    lineNumber: 266,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                calendarConfigured && calendarConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 p-4 bg-green-50 border border-green-200 rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-green-700",
                                        children: "✓ Your Google Calendar is connected. Meetings will be synced automatically."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                        lineNumber: 274,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                    lineNumber: 273,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                            lineNumber: 234,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        calendarConnected && researchSummary && researchSummary.accounts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gradient-to-r from-lean-green-10 to-lean-green-5 rounded-lg shadow-lg p-6 mb-6 border border-lean-green/20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "typography-heading text-lean-black",
                                                children: "Weekly Research Summary"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                lineNumber: 286,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-lean-black-70 mt-1",
                                                children: [
                                                    researchSummary.totalAccounts,
                                                    " ",
                                                    researchSummary.totalAccounts === 1 ? 'account' : 'accounts',
                                                    " to research across ",
                                                    researchSummary.totalMeetings,
                                                    " ",
                                                    researchSummary.totalMeetings === 1 ? 'meeting' : 'meetings'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                lineNumber: 287,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                        lineNumber: 285,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                    lineNumber: 284,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                    children: researchSummary.accounts.map((account)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-lean-white rounded-lg p-4 border border-lean-black/10 hover:shadow-md transition-shadow",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "font-semibold text-lean-black flex-1",
                                                            children: account.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                            lineNumber: 300,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "ml-2 px-2 py-1 bg-lean-green-10 text-lean-green text-xs font-semibold rounded-full",
                                                            children: [
                                                                account.meetingCount,
                                                                " ",
                                                                account.meetingCount === 1 ? 'meeting' : 'meetings'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                            lineNumber: 301,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                    lineNumber: 299,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-lean-black-60 space-y-1",
                                                    children: [
                                                        account.meetings.slice(0, 3).map((meeting, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium",
                                                                        children: meeting.date.toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric'
                                                                        })
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                        lineNumber: 308,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        children: meeting.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                        lineNumber: 311,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                lineNumber: 307,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))),
                                                        account.meetings.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-lean-black-60 italic",
                                                            children: [
                                                                "+",
                                                                account.meetings.length - 3,
                                                                " more"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                            lineNumber: 315,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                    lineNumber: 305,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, account.id, true, {
                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                            lineNumber: 295,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                    lineNumber: 293,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                            lineNumber: 283,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        calendarConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-lean-white rounded-lg shadow-lg p-6 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "typography-heading text-lean-black",
                                                    children: "Upcoming Meetings"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                    lineNumber: 331,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-lean-black-70 mt-1",
                                                    children: "Meetings with external contacts for the next 7 days"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                    lineNumber: 332,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                            lineNumber: 330,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>fetchUpcomingMeetings(true),
                                            disabled: loadingMeetings,
                                            className: "px-4 py-2 text-sm text-lean-black-70 hover:text-lean-black transition-colors disabled:opacity-50",
                                            title: "Force refresh from Google Calendar (bypasses cache)",
                                            children: loadingMeetings ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                                className: "w-4 h-4 animate-spin inline"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                lineNumber: 343,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)) : 'Refresh'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                            lineNumber: 336,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                    lineNumber: 329,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                loadingMeetings ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center py-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                            className: "w-6 h-6 animate-spin text-lean-green"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                            lineNumber: 352,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-3 text-lean-black-70",
                                            children: "Loading meetings..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                            lineNumber: 353,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                    lineNumber: 351,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)) : upcomingMeetings.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center py-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-lean-black-70",
                                            children: "No meetings with external contacts found for the next 7 days."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                            lineNumber: 357,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-lean-black-60 mt-2",
                                            children: "Only meetings with external attendees who are known contacts are shown."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                            lineNumber: 358,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                    lineNumber: 356,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)) : (()=>{
                                    // Group meetings by date
                                    const meetingsByDate = {};
                                    upcomingMeetings.forEach(({ event, matchedAccounts })=>{
                                        const startTime = event.start?.dateTime || event.start?.date;
                                        if (!startTime) return;
                                        const startDate = new Date(startTime);
                                        const dateKey = startDate.toDateString();
                                        if (!meetingsByDate[dateKey]) {
                                            meetingsByDate[dateKey] = [];
                                        }
                                        meetingsByDate[dateKey].push({
                                            event,
                                            matchedAccounts,
                                            startDate
                                        });
                                    });
                                    // Sort dates
                                    const sortedDates = Object.keys(meetingsByDate).sort((a, b)=>new Date(a) - new Date(b));
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-6",
                                        children: sortedDates.map((dateKey)=>{
                                            const date = new Date(dateKey);
                                            const meetings = meetingsByDate[dateKey].sort((a, b)=>a.startDate - b.startDate);
                                            const isToday = date.toDateString() === new Date().toDateString();
                                            const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border border-lean-black/10 rounded-lg overflow-hidden",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `px-4 py-3 border-b border-lean-black/10 ${isToday ? 'bg-lean-green-10' : 'bg-lean-almost-white'}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `text-2xl font-bold ${isToday ? 'text-lean-green' : 'text-lean-black'}`,
                                                                            children: date.getDate()
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                            lineNumber: 399,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "font-semibold text-lean-black",
                                                                                    children: isToday ? 'Today' : isTomorrow ? 'Tomorrow' : date.toLocaleDateString('en-US', {
                                                                                        weekday: 'long'
                                                                                    })
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                    lineNumber: 405,
                                                                                    columnNumber: 35
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "text-sm text-lean-black-70",
                                                                                    children: date.toLocaleDateString('en-US', {
                                                                                        month: 'long',
                                                                                        year: 'numeric'
                                                                                    })
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                    lineNumber: 408,
                                                                                    columnNumber: 35
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                            lineNumber: 404,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                    lineNumber: 398,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm text-lean-black-70",
                                                                    children: [
                                                                        meetings.length,
                                                                        " ",
                                                                        meetings.length === 1 ? 'meeting' : 'meetings'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                    lineNumber: 413,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                            lineNumber: 397,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                        lineNumber: 394,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "divide-y divide-lean-black/5",
                                                        children: meetings.map(({ event, matchedAccounts, startDate }, index)=>{
                                                            const endTime = event.end?.dateTime || event.end?.date;
                                                            const endDate = endTime ? new Date(endTime) : null;
                                                            const duration = endDate ? Math.round((endDate - startDate) / (1000 * 60)) : null;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "p-4 hover:bg-lean-almost-white transition-colors",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex-shrink-0 w-24",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "text-sm font-semibold text-lean-black",
                                                                                    children: startDate.toLocaleTimeString('en-US', {
                                                                                        hour: 'numeric',
                                                                                        minute: '2-digit'
                                                                                    })
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                    lineNumber: 434,
                                                                                    columnNumber: 39
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                endDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "text-xs text-lean-black-60 mt-1",
                                                                                    children: endDate.toLocaleTimeString('en-US', {
                                                                                        hour: 'numeric',
                                                                                        minute: '2-digit'
                                                                                    })
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                    lineNumber: 441,
                                                                                    columnNumber: 41
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                duration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "text-xs text-lean-black-60 mt-1",
                                                                                    children: [
                                                                                        duration,
                                                                                        " min"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                    lineNumber: 449,
                                                                                    columnNumber: 41
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                            lineNumber: 433,
                                                                            columnNumber: 37
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex-1 min-w-0",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-start justify-between gap-4",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "flex-1 min-w-0",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                                className: "font-semibold text-lean-black mb-1 truncate",
                                                                                                children: event.summary || 'No Title'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                                lineNumber: 459,
                                                                                                columnNumber: 43
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            event.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "text-sm text-lean-black-70 mb-2 flex items-center gap-1",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        children: "📍"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                                        lineNumber: 465,
                                                                                                        columnNumber: 47
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "truncate",
                                                                                                        children: event.location
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                                        lineNumber: 466,
                                                                                                        columnNumber: 47
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                                lineNumber: 464,
                                                                                                columnNumber: 45
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            event.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "text-sm text-lean-black-60 mb-2 line-clamp-2",
                                                                                                children: event.description
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                                lineNumber: 471,
                                                                                                columnNumber: 45
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            matchedAccounts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "mt-3",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                        className: "text-xs font-semibold text-lean-black-70 mb-2 uppercase tracking-wide",
                                                                                                        children: "Accounts to Research:"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                                        lineNumber: 478,
                                                                                                        columnNumber: 47
                                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex flex-wrap gap-2",
                                                                                                        children: matchedAccounts.map((account)=>{
                                                                                                            // Use salesforce_id (snake_case) from matcher, fallback to salesforceId (camelCase) or id
                                                                                                            const accountId = account.salesforce_id || account.salesforceId || account.id;
                                                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                                onClick: ()=>{
                                                                                                                    router.push(`/account/${accountId}/data`);
                                                                                                                },
                                                                                                                className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-lean-green-10 text-lean-green border border-lean-green/20 hover:bg-lean-green hover:text-lean-white transition-colors cursor-pointer",
                                                                                                                children: account.name
                                                                                                            }, account.id, false, {
                                                                                                                fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                                                lineNumber: 486,
                                                                                                                columnNumber: 53
                                                                                                            }, ("TURBOPACK compile-time value", void 0));
                                                                                                        })
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                                        lineNumber: 481,
                                                                                                        columnNumber: 47
                                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                                lineNumber: 477,
                                                                                                columnNumber: 45
                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                        lineNumber: 458,
                                                                                        columnNumber: 41
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    event.htmlLink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                        href: event.htmlLink,
                                                                                        target: "_blank",
                                                                                        rel: "noopener noreferrer",
                                                                                        className: "flex-shrink-0 px-3 py-1 text-xs text-lean-green hover:text-lean-green/80 hover:underline whitespace-nowrap",
                                                                                        children: "Open →"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                        lineNumber: 503,
                                                                                        columnNumber: 43
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                                lineNumber: 457,
                                                                                columnNumber: 39
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                            lineNumber: 456,
                                                                            columnNumber: 37
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                    lineNumber: 431,
                                                                    columnNumber: 35
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, event.id || index, false, {
                                                                fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                                lineNumber: 427,
                                                                columnNumber: 33
                                                            }, ("TURBOPACK compile-time value", void 0));
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                        lineNumber: 420,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, dateKey, true, {
                                                fileName: "[project]/src/components/calendar/CalendarPage.js",
                                                lineNumber: 392,
                                                columnNumber: 25
                                            }, ("TURBOPACK compile-time value", void 0));
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/calendar/CalendarPage.js",
                                        lineNumber: 382,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0));
                                })()
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/calendar/CalendarPage.js",
                            lineNumber: 328,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/calendar/CalendarPage.js",
                    lineNumber: 220,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/calendar/CalendarPage.js",
                lineNumber: 219,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/calendar/CalendarPage.js",
        lineNumber: 214,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CalendarPage, "0+9uotn2aqu8EoKqq2wqJfMC8lY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CalendarPage;
const __TURBOPACK__default__export__ = CalendarPage;
var _c;
__turbopack_context__.k.register(_c, "CalendarPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/calendar/CalendarPage.js [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/calendar/CalendarPage.js [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_a95306ee._.js.map