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
 * Request deduplication map (in-memory, shared across components)
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
const pendingRequests = new Map();
/**
 * Generate a cache key from request parameters
 */ function getRequestKey(url, options = {}) {
    const method = options.method || 'GET';
    const body = options.body ? typeof options.body === 'string' ? options.body : JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
}
function deduplicatedFetch(url, options = {}) {
    // Use existing window implementation if available (for backwards compatibility)
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.deduplicatedFetch && window.deduplicatedFetch !== deduplicatedFetch) {
        return window.deduplicatedFetch(url, options);
    }
    const key = getRequestKey(url, options);
    // If request is already in progress, return the existing promise
    if (pendingRequests.has(key)) {
        return pendingRequests.get(key);
    }
    // Create new request
    const requestPromise = fetch(url, options).then((response)=>{
        // Remove from pending after a short delay to allow for rapid re-requests
        setTimeout(()=>{
            pendingRequests.delete(key);
        }, 100);
        return response;
    }).catch((error)=>{
        // Remove from pending on error
        pendingRequests.delete(key);
        throw error;
    });
    pendingRequests.set(key, requestPromise);
    return requestPromise;
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
"[project]/src/components/user/UserPage.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// User Account Management Page Component
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
const UserPage = ({ user, onSignOut })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [accounts, setAccounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [searchResults, setSearchResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAddAccount, setShowAddAccount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [removingAccountId, setRemovingAccountId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [addingAccountId, setAddingAccountId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedAccounts, setSelectedAccounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [bulkRemoving, setBulkRemoving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [refreshingFromSalesforce, setRefreshingFromSalesforce] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Fetch user's cached accounts
    const fetchUserAccounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UserPage.useCallback[fetchUserAccounts]": async ()=>{
            if (!user?.id && !user?.email) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const params = new URLSearchParams({
                    userId: user.id || '',
                    email: user.email || '',
                    role: user.role || ''
                });
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deduplicatedFetch"])(`/api/salesforce-accounts?${params}`);
                const responseClone = response.clone();
                if (!response.ok) {
                    const errorData = await responseClone.json().catch({
                        "UserPage.useCallback[fetchUserAccounts]": ()=>({})
                    }["UserPage.useCallback[fetchUserAccounts]"]);
                    throw new Error(errorData.message || errorData.error || 'Failed to fetch accounts');
                }
                const data = await responseClone.json();
                setAccounts(data.accounts || []);
            } catch (err) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error fetching user accounts:', err);
                setError(err.message || 'Failed to load accounts. Please refresh the page.');
            } finally{
                setLoading(false);
            }
        }
    }["UserPage.useCallback[fetchUserAccounts]"], [
        user
    ]);
    // Load accounts on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserPage.useEffect": ()=>{
            fetchUserAccounts();
        }
    }["UserPage.useEffect"], [
        fetchUserAccounts
    ]);
    // Search for accounts
    const handleSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UserPage.useCallback[handleSearch]": async (searchQuery)=>{
            if (!searchQuery || searchQuery.trim().length < 2) {
                setSearchResults([]);
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
                    const errorData = await responseClone.json().catch({
                        "UserPage.useCallback[handleSearch]": ()=>({})
                    }["UserPage.useCallback[handleSearch]"]);
                    throw new Error(errorData.message || errorData.error || 'Failed to search accounts');
                }
                const data = await responseClone.json();
                // Filter out accounts already in user's list
                const existingAccountIds = new Set(accounts.map({
                    "UserPage.useCallback[handleSearch]": (acc)=>acc.salesforceId || acc.id
                }["UserPage.useCallback[handleSearch]"]));
                const filteredResults = (data.accounts || []).filter({
                    "UserPage.useCallback[handleSearch].filteredResults": (acc)=>!existingAccountIds.has(acc.salesforceId || acc.id)
                }["UserPage.useCallback[handleSearch].filteredResults"]);
                setSearchResults(filteredResults);
            } catch (err) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error searching accounts:', err);
                setError(err.message || 'Failed to search accounts. Please try again.');
                setSearchResults([]);
            } finally{
                setIsSearching(false);
            }
        }
    }["UserPage.useCallback[handleSearch]"], [
        user,
        accounts
    ]);
    // Handle search input change with debounce
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserPage.useEffect": ()=>{
            if (!showAddAccount) {
                setSearchTerm('');
                setSearchResults([]);
                return;
            }
            const timeoutId = setTimeout({
                "UserPage.useEffect.timeoutId": ()=>{
                    if (searchTerm.trim().length >= 2) {
                        handleSearch(searchTerm);
                    } else {
                        setSearchResults([]);
                    }
                }
            }["UserPage.useEffect.timeoutId"], 300);
            return ({
                "UserPage.useEffect": ()=>clearTimeout(timeoutId)
            })["UserPage.useEffect"];
        }
    }["UserPage.useEffect"], [
        searchTerm,
        showAddAccount,
        handleSearch
    ]);
    // Add account to user's list
    const handleAddAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UserPage.useCallback[handleAddAccount]": async (account)=>{
            if (!user?.id) {
                setError('User ID is required to add accounts');
                return;
            }
            try {
                setAddingAccountId(account.salesforceId || account.id);
                setError(null);
                const response = await fetch('/api/users/accounts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        accountId: account.salesforceId || account.id
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "UserPage.useCallback[handleAddAccount]": ()=>({})
                    }["UserPage.useCallback[handleAddAccount]"]);
                    throw new Error(errorData.message || errorData.error || 'Failed to add account');
                }
                // Refresh accounts list
                await fetchUserAccounts();
                // Remove from search results
                setSearchResults({
                    "UserPage.useCallback[handleAddAccount]": (prev)=>prev.filter({
                            "UserPage.useCallback[handleAddAccount]": (acc)=>(acc.salesforceId || acc.id) !== (account.salesforceId || account.id)
                        }["UserPage.useCallback[handleAddAccount]"])
                }["UserPage.useCallback[handleAddAccount]"]);
                // Clear search if no more results
                if (searchResults.length <= 1) {
                    setSearchTerm('');
                    setShowAddAccount(false);
                }
            } catch (err) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error adding account:', err);
                setError(err.message || 'Failed to add account. Please try again.');
            } finally{
                setAddingAccountId(null);
            }
        }
    }["UserPage.useCallback[handleAddAccount]"], [
        user,
        fetchUserAccounts,
        searchResults.length
    ]);
    // Remove account from user's list
    const handleRemoveAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UserPage.useCallback[handleRemoveAccount]": async (account)=>{
            if (!user?.id) {
                setError('User ID is required to remove accounts');
                return;
            }
            if (!confirm(`Are you sure you want to remove "${account.name}" from your account list?`)) {
                return;
            }
            try {
                setRemovingAccountId(account.salesforceId || account.id);
                setError(null);
                const response = await fetch('/api/users/accounts', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        accountId: account.salesforceId || account.id
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "UserPage.useCallback[handleRemoveAccount]": ()=>({})
                    }["UserPage.useCallback[handleRemoveAccount]"]);
                    throw new Error(errorData.message || errorData.error || 'Failed to remove account');
                }
                // Refresh accounts list
                await fetchUserAccounts();
                // Clear selection if this account was selected
                setSelectedAccounts({
                    "UserPage.useCallback[handleRemoveAccount]": (prev)=>{
                        const newSet = new Set(prev);
                        newSet.delete(account.salesforceId || account.id);
                        return newSet;
                    }
                }["UserPage.useCallback[handleRemoveAccount]"]);
            } catch (err) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error removing account:', err);
                setError(err.message || 'Failed to remove account. Please try again.');
            } finally{
                setRemovingAccountId(null);
            }
        }
    }["UserPage.useCallback[handleRemoveAccount]"], [
        user,
        fetchUserAccounts
    ]);
    // Handle checkbox toggle
    const handleToggleAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UserPage.useCallback[handleToggleAccount]": (accountId)=>{
            setSelectedAccounts({
                "UserPage.useCallback[handleToggleAccount]": (prev)=>{
                    const newSet = new Set(prev);
                    if (newSet.has(accountId)) {
                        newSet.delete(accountId);
                    } else {
                        newSet.add(accountId);
                    }
                    return newSet;
                }
            }["UserPage.useCallback[handleToggleAccount]"]);
        }
    }["UserPage.useCallback[handleToggleAccount]"], []);
    // Handle select all/none
    const handleSelectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UserPage.useCallback[handleSelectAll]": ()=>{
            if (selectedAccounts.size === accounts.length) {
                // Deselect all
                setSelectedAccounts(new Set());
            } else {
                // Select all
                setSelectedAccounts(new Set(accounts.map({
                    "UserPage.useCallback[handleSelectAll]": (acc)=>acc.salesforceId || acc.id
                }["UserPage.useCallback[handleSelectAll]"])));
            }
        }
    }["UserPage.useCallback[handleSelectAll]"], [
        accounts,
        selectedAccounts.size
    ]);
    // Bulk remove selected accounts
    const handleBulkRemove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UserPage.useCallback[handleBulkRemove]": async ()=>{
            if (selectedAccounts.size === 0) {
                setError('Please select at least one account to remove');
                return;
            }
            const selectedCount = selectedAccounts.size;
            if (!confirm(`Are you sure you want to remove ${selectedCount} account${selectedCount > 1 ? 's' : ''} from your account list?`)) {
                return;
            }
            if (!user?.id) {
                setError('User ID is required to remove accounts');
                return;
            }
            try {
                setBulkRemoving(true);
                setError(null);
                const accountIds = Array.from(selectedAccounts);
                const response = await fetch('/api/users/accounts', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        accountIds: accountIds
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "UserPage.useCallback[handleBulkRemove]": ()=>({})
                    }["UserPage.useCallback[handleBulkRemove]"]);
                    throw new Error(errorData.message || errorData.error || 'Failed to remove accounts');
                }
                // Refresh accounts list
                await fetchUserAccounts();
                // Clear selection
                setSelectedAccounts(new Set());
            } catch (err) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error bulk removing accounts:', err);
                setError(err.message || 'Failed to remove accounts. Please try again.');
            } finally{
                setBulkRemoving(false);
            }
        }
    }["UserPage.useCallback[handleBulkRemove]"], [
        user,
        selectedAccounts,
        fetchUserAccounts
    ]);
    // Refresh from Salesforce - removes all accounts and re-syncs
    const handleRefreshFromSalesforce = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UserPage.useCallback[handleRefreshFromSalesforce]": async ()=>{
            if (!user?.id && !user?.email) {
                setError('User information is required to refresh accounts');
                return;
            }
            if (!confirm('This will remove all your cached accounts and refresh them from Salesforce. Continue?')) {
                return;
            }
            try {
                setRefreshingFromSalesforce(true);
                setError(null);
                // First, clear all user-account relationships
                const clearResponse = await fetch('/api/users/accounts', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        clearAll: true
                    })
                });
                if (!clearResponse.ok) {
                    const errorData = await clearResponse.json().catch({
                        "UserPage.useCallback[handleRefreshFromSalesforce]": ()=>({})
                    }["UserPage.useCallback[handleRefreshFromSalesforce]"]);
                    throw new Error(errorData.message || errorData.error || 'Failed to clear accounts');
                }
                // Then, refresh from Salesforce with force refresh and ownerOnly=true
                // This ensures we only get accounts the user owns, not all accounts
                const params = new URLSearchParams({
                    userId: user.id || '',
                    email: user.email || '',
                    role: user.role || '',
                    forceRefresh: 'true',
                    ownerOnly: 'true'
                });
                const refreshResponse = await fetch(`/api/salesforce-accounts?${params}`);
                if (!refreshResponse.ok) {
                    const errorData = await refreshResponse.json().catch({
                        "UserPage.useCallback[handleRefreshFromSalesforce]": ()=>({})
                    }["UserPage.useCallback[handleRefreshFromSalesforce]"]);
                    throw new Error(errorData.message || errorData.error || 'Failed to refresh accounts from Salesforce');
                }
                // Refresh accounts list
                await fetchUserAccounts();
                // Clear selection
                setSelectedAccounts(new Set());
            } catch (err) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logError"])('Error refreshing from Salesforce:', err);
                setError(err.message || 'Failed to refresh accounts from Salesforce. Please try again.');
            } finally{
                setRefreshingFromSalesforce(false);
            }
        }
    }["UserPage.useCallback[handleRefreshFromSalesforce]"], [
        user,
        fetchUserAccounts
    ]);
    const formatCurrency = (value)=>{
        if (!value) return 'N/A';
        if (typeof value === 'string' && value.includes('$')) return value;
        if (typeof value === 'number') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
            }).format(value);
        }
        return value;
    };
    const formatDate = (dateString)=>{
        if (!dateString) return 'Never';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch  {
            return 'Invalid date';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-lean-almost-white flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Header$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                user: user,
                onSignOut: onSignOut
            }, void 0, false, {
                fileName: "[project]/src/components/user/UserPage.js",
                lineNumber: 385,
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
                                    children: "My Accounts"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/user/UserPage.js",
                                    lineNumber: 392,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-lean-black-70",
                                    children: "Manage your cached Salesforce accounts"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/user/UserPage.js",
                                    lineNumber: 393,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/user/UserPage.js",
                            lineNumber: 391,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-red-700",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/user/UserPage.js",
                                lineNumber: 397,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/user/UserPage.js",
                            lineNumber: 396,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-lean-white rounded-lg shadow-lg p-6 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "typography-heading text-lean-black",
                                            children: "Add Account"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/user/UserPage.js",
                                            lineNumber: 405,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setShowAddAccount(!showAddAccount);
                                                if (!showAddAccount) {
                                                    setSearchTerm('');
                                                    setSearchResults([]);
                                                }
                                            },
                                            className: "px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors",
                                            children: showAddAccount ? 'Cancel' : 'Add Account'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/user/UserPage.js",
                                            lineNumber: 406,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/user/UserPage.js",
                                    lineNumber: 404,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                showAddAccount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: searchTerm,
                                                    onChange: (e)=>setSearchTerm(e.target.value),
                                                    placeholder: "Search for accounts by name (minimum 2 characters)...",
                                                    className: "w-full px-4 py-2 border border-lean-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green focus:border-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/user/UserPage.js",
                                                    lineNumber: 423,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                isSearching && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute right-3 top-1/2 transform -translate-y-1/2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                                        className: "w-5 h-5 animate-spin text-lean-green"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/user/UserPage.js",
                                                        lineNumber: 432,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/user/UserPage.js",
                                                    lineNumber: 431,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/user/UserPage.js",
                                            lineNumber: 422,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        searchResults.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 border border-lean-black/20 rounded-lg max-h-96 overflow-y-auto",
                                            children: searchResults.map((account)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-4 border-b border-lean-black/10 last:border-b-0 hover:bg-lean-almost-white transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "font-semibold text-lean-black",
                                                                        children: account.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/user/UserPage.js",
                                                                        lineNumber: 446,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-sm text-lean-black-70 mt-1 space-y-1",
                                                                        children: [
                                                                            account.accountTier && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    "Tier: ",
                                                                                    account.accountTier
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                                lineNumber: 449,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            account.contractValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    "Contract Value: ",
                                                                                    formatCurrency(account.contractValue)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                                lineNumber: 452,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            account.industry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    "Industry: ",
                                                                                    account.industry
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                                lineNumber: 455,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            account.ownerName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    "Owner: ",
                                                                                    account.ownerName
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                                lineNumber: 458,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/user/UserPage.js",
                                                                        lineNumber: 447,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                lineNumber: 445,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleAddAccount(account),
                                                                disabled: addingAccountId === (account.salesforceId || account.id),
                                                                className: "ml-4 px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                                                children: addingAccountId === (account.salesforceId || account.id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                                                    className: "w-5 h-5 animate-spin"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/user/UserPage.js",
                                                                    lineNumber: 468,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0)) : 'Add'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                lineNumber: 462,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/user/UserPage.js",
                                                        lineNumber: 444,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, account.salesforceId || account.id, false, {
                                                    fileName: "[project]/src/components/user/UserPage.js",
                                                    lineNumber: 440,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/user/UserPage.js",
                                            lineNumber: 438,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        searchTerm.trim().length >= 2 && !isSearching && searchResults.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 text-center text-lean-black-70 py-4",
                                            children: [
                                                'No accounts found matching "',
                                                searchTerm,
                                                '"'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/user/UserPage.js",
                                            lineNumber: 480,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        searchTerm.trim().length > 0 && searchTerm.trim().length < 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 text-center text-lean-black-70 py-4",
                                            children: "Please enter at least 2 characters to search"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/user/UserPage.js",
                                            lineNumber: 486,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/user/UserPage.js",
                                    lineNumber: 421,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/user/UserPage.js",
                            lineNumber: 403,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-lean-white rounded-lg shadow-lg p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "typography-heading text-lean-black",
                                            children: [
                                                "My Accounts (",
                                                accounts.length,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/user/UserPage.js",
                                            lineNumber: 497,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                selectedAccounts.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleBulkRemove,
                                                    disabled: bulkRemoving,
                                                    className: "px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                                    children: bulkRemoving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                                                className: "w-4 h-4 animate-spin inline mr-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                lineNumber: 509,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            "Removing..."
                                                        ]
                                                    }, void 0, true) : `Remove Selected (${selectedAccounts.size})`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/user/UserPage.js",
                                                    lineNumber: 502,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleRefreshFromSalesforce,
                                                    disabled: refreshingFromSalesforce || loading,
                                                    className: "px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                                    title: "Remove all accounts and refresh from Salesforce",
                                                    children: refreshingFromSalesforce ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                                                className: "w-4 h-4 animate-spin inline mr-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                lineNumber: 525,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            "Refreshing..."
                                                        ]
                                                    }, void 0, true) : 'Refresh from Salesforce'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/user/UserPage.js",
                                                    lineNumber: 517,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: fetchUserAccounts,
                                                    disabled: loading || refreshingFromSalesforce,
                                                    className: "px-4 py-2 text-lean-black-70 hover:text-lean-black transition-colors disabled:opacity-50",
                                                    children: "Refresh"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/user/UserPage.js",
                                                    lineNumber: 532,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/user/UserPage.js",
                                            lineNumber: 500,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/user/UserPage.js",
                                    lineNumber: 496,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center py-12",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                            className: "w-8 h-8 animate-spin text-lean-green"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/user/UserPage.js",
                                            lineNumber: 544,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-3 text-lean-black-70",
                                            children: "Loading accounts..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/user/UserPage.js",
                                            lineNumber: 545,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/user/UserPage.js",
                                    lineNumber: 543,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)) : accounts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center py-12",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-lean-black-70 mb-4",
                                            children: "You don't have any accounts cached yet."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/user/UserPage.js",
                                            lineNumber: 549,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-lean-black-60",
                                            children: 'Use the "Add Account" section above to search for and add accounts.'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/user/UserPage.js",
                                            lineNumber: 550,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/user/UserPage.js",
                                    lineNumber: 548,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "overflow-x-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "w-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "border-b border-lean-black/20",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "text-left py-3 px-4 font-semibold text-lean-black w-12",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: accounts.length > 0 && selectedAccounts.size === accounts.length,
                                                                onChange: handleSelectAll,
                                                                className: "w-4 h-4 text-lean-green rounded border-lean-black/20 focus:ring-lean-green"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                lineNumber: 558,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/user/UserPage.js",
                                                            lineNumber: 557,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "text-left py-3 px-4 font-semibold text-lean-black",
                                                            children: "Account Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/user/UserPage.js",
                                                            lineNumber: 565,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "text-left py-3 px-4 font-semibold text-lean-black",
                                                            children: "Tier"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/user/UserPage.js",
                                                            lineNumber: 566,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "text-left py-3 px-4 font-semibold text-lean-black",
                                                            children: "Contract Value"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/user/UserPage.js",
                                                            lineNumber: 567,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "text-left py-3 px-4 font-semibold text-lean-black",
                                                            children: "Industry"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/user/UserPage.js",
                                                            lineNumber: 568,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "text-left py-3 px-4 font-semibold text-lean-black",
                                                            children: "Owner"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/user/UserPage.js",
                                                            lineNumber: 569,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "text-left py-3 px-4 font-semibold text-lean-black",
                                                            children: "Last Synced"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/user/UserPage.js",
                                                            lineNumber: 570,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "text-right py-3 px-4 font-semibold text-lean-black",
                                                            children: "Actions"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/user/UserPage.js",
                                                            lineNumber: 571,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/user/UserPage.js",
                                                    lineNumber: 556,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/user/UserPage.js",
                                                lineNumber: 555,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "divide-y divide-lean-black/10",
                                                children: accounts.map((account)=>{
                                                    const accountId = account.salesforceId || account.id;
                                                    const isSelected = selectedAccounts.has(accountId);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: `hover:bg-lean-almost-white transition-colors ${isSelected ? 'bg-lean-green-10' : ''}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "py-3 px-4",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "checkbox",
                                                                    checked: isSelected,
                                                                    onChange: ()=>handleToggleAccount(accountId),
                                                                    className: "w-4 h-4 text-lean-green rounded border-lean-black/20 focus:ring-lean-green"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/user/UserPage.js",
                                                                    lineNumber: 581,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                lineNumber: 580,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "py-3 px-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>{
                                                                            const accountId = account.salesforceId || account.id;
                                                                            router.push(`/account/${accountId}/data`);
                                                                        },
                                                                        className: "font-medium text-lean-black text-left hover:text-lean-green hover:underline",
                                                                        children: account.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/user/UserPage.js",
                                                                        lineNumber: 589,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    account.salesforceId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-lean-black-60 mt-1",
                                                                        children: [
                                                                            "ID: ",
                                                                            account.salesforceId
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/user/UserPage.js",
                                                                        lineNumber: 599,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                lineNumber: 588,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "py-3 px-4 text-lean-black-70",
                                                                children: account.accountTier || 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                lineNumber: 602,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "py-3 px-4 text-lean-black-70",
                                                                children: formatCurrency(account.contractValue)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                lineNumber: 605,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "py-3 px-4 text-lean-black-70",
                                                                children: account.industry || 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                lineNumber: 608,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "py-3 px-4 text-lean-black-70",
                                                                children: account.ownerName || 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                lineNumber: 611,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "py-3 px-4 text-lean-black-70 text-sm",
                                                                children: formatDate(account.lastSyncedAt)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                lineNumber: 614,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "py-3 px-4 text-right",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleRemoveAccount(account),
                                                                    disabled: removingAccountId === (account.salesforceId || account.id),
                                                                    className: "px-3 py-1 text-red-600 hover:text-red-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                                                                    children: removingAccountId === (account.salesforceId || account.id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shared$2f$Icons$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoaderIcon"], {
                                                                        className: "w-4 h-4 animate-spin inline"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/user/UserPage.js",
                                                                        lineNumber: 624,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)) : 'Remove'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/user/UserPage.js",
                                                                    lineNumber: 618,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/user/UserPage.js",
                                                                lineNumber: 617,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, accountId, true, {
                                                        fileName: "[project]/src/components/user/UserPage.js",
                                                        lineNumber: 579,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0));
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/user/UserPage.js",
                                                lineNumber: 574,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/user/UserPage.js",
                                        lineNumber: 554,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/user/UserPage.js",
                                    lineNumber: 553,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/user/UserPage.js",
                            lineNumber: 495,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/user/UserPage.js",
                    lineNumber: 389,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/user/UserPage.js",
                lineNumber: 388,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/user/UserPage.js",
        lineNumber: 383,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(UserPage, "pfWxdPVnajnci1g2yFT4pDTfBis=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = UserPage;
const __TURBOPACK__default__export__ = UserPage;
var _c;
__turbopack_context__.k.register(_c, "UserPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/user/UserPage.js [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/user/UserPage.js [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_fa417bfc._.js.map