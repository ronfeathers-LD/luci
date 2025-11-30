# Next.js Conversion Plan for LUCI

## Current Status
✅ Next.js installed and configured
✅ Basic structure created
⏳ Ready to begin systematic conversion

## Conversion Phases

### Phase 1: API Routes (10 endpoints)
Convert each `/api/*.js` to `/src/app/api/*/route.js`
- Uses Next.js App Router format with named exports (GET, POST, PUT, DELETE)
- Adapt request/response handling from Express-style to Next.js Request/Response

### Phase 2: Pages (8-10 routes)
Convert App.js routing to file-based routing:
- `/` → `src/app/page.js` (Dashboard)
- `/login` → `src/app/login/page.js`
- `/analyze` → `src/app/analyze/page.js`
- `/admin` → `src/app/admin/page.js`
- `/admin/roles` → `src/app/admin/roles/page.js`
- `/admin/settings` → `src/app/admin/settings/page.js`
- `/user` → `src/app/user/page.js`
- `/calendar` → `src/app/calendar/page.js`
- `/account/[id]/data` → `src/app/account/[id]/data/page.js`
- `/sentiment/[id]` → `src/app/sentiment/[id]/page.js`

### Phase 3: Components (13 components)
- Remove `window.*` global exports
- Convert to standard ES6 imports
- Update all 353 `window.*` references

### Phase 4: Navigation
- Replace `window.navigate()` with Next.js `useRouter().push()`
- Update all routing logic

### Phase 5: Build & Deploy
- Update package.json scripts
- Update vercel.json
- Remove old build.js

## Estimated Effort
- API Routes: ~2-3 hours (10 routes, ~300 lines each)
- Pages: ~3-4 hours (10 pages + layouts)
- Components: ~4-6 hours (13 components, refactoring)
- Testing: ~2-3 hours
- **Total: ~12-16 hours of work**

## Next Steps
Starting conversion now. Will proceed systematically through each phase.

