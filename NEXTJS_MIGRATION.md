# Next.js Migration Plan

## Overview
Converting LUCI from static HTML + dynamic JS loading to Next.js App Router.

## Key Changes

### 1. Directory Structure
- Old: `/api/*.js` → New: `/src/app/api/*/route.js`
- Old: Components in `/src/components/` loaded dynamically
- New: Pages in `/src/app/*/page.js` (App Router)

### 2. API Routes
Converting 10 API endpoints to Next.js App Router format:
- Each route becomes a `route.js` file with named exports (GET, POST, PUT, DELETE)
- Use Next.js Request/Response objects instead of req/res

### 3. Pages/Routing
- Old: Custom routing in App.js
- New: File-based routing in `/src/app/`

### 4. Components
- Remove `window.*` global exports
- Use standard ES6 imports
- Update navigation from `window.navigate()` to Next.js `useRouter()`

## Migration Steps

1. ✅ Set up Next.js config and dependencies
2. ⏳ Convert API routes (10 endpoints)
3. ⏳ Create app layout and root page
4. ⏳ Convert page components
5. ⏳ Update navigation/routing
6. ⏳ Update build process
7. ⏳ Test and verify

## Progress
- [x] Next.js installed
- [x] Configuration files created
- [ ] API routes converted (0/10)
- [ ] Pages created (0/8)
- [ ] Components updated
- [ ] Build process updated

