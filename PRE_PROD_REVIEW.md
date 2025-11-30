# Pre-Production Code Review Checklist

## 🔴 Critical Issues Found

### 1. Legacy API Files
- **Location**: `/api` directory
- **Issue**: Old Vercel serverless function files still exist (10 files)
- **Impact**: Confusion, potential conflicts
- **Action**: Delete all files in `/api` directory

### 2. Security: Hardcoded API Keys
- **Location**: `update-env-local.sh` lines 30, 33
- **Issue**: Hardcoded API keys in script
- **Impact**: Security risk if committed
- **Action**: Remove hardcoded keys, use placeholders

### 3. window.* References
- **Location**: 
  - `src/components/user/AccountDataPage.js` line 465
  - `src/components/user/SentimentDetailPage.js` line 109, 123
- **Issue**: Still using `window.Header` and `window.navigate`
- **Impact**: Potential runtime errors
- **Action**: Replace with proper imports

### 4. Console Logging
- **Issue**: Multiple console.log/console.error statements throughout
- **Impact**: Production noise, potential info leakage
- **Action**: Wrap in production checks or use proper logging

## ⚠️ Medium Priority Issues

### 5. Missing Error Boundaries
- **Issue**: Error boundaries not consistently applied
- **Action**: Ensure all routes have error boundaries

### 6. Environment Variables
- **Issue**: Need to verify all required env vars are documented
- **Action**: Create comprehensive env var checklist

### 7. API Route Redundancy
- **Issue**: Both legacy and Next.js API routes exist
- **Action**: Remove legacy routes

## ✅ Good Practices Already in Place

- Request deduplication implemented
- Error handling in most places
- Environment variable validation
- Security headers in vercel.json
- React Strict Mode enabled

## 📋 Review Checklist

### Critical Fixes
- [x] Fix hardcoded API keys in scripts (`update-env-local.sh`)
- [x] Replace window.Header references (AccountDataPage, SentimentDetailPage)
- [x] Replace window.navigate references (SentimentDetailPage)
- [x] Replace window.deduplicatedFetch references (AccountDataPage)
- [ ] Remove legacy `/api` directory files (10 files)
- [ ] Remove unused utility files (`src/lib/utils.js`, `src/lib/router.js`)
- [ ] Clean up conversion status documents (12+ files)

### Code Quality
- [ ] Clean up console.log statements (wrap in production checks)
- [ ] Remove unused imports across components
- [ ] Consolidate duplicate helper functions
- [ ] Remove old migration/conversion documentation files

### Configuration & Security
- [ ] Verify error boundaries on all routes
- [ ] Verify all required environment variables are documented
- [ ] Check API rate limiting is working
- [ ] Verify CORS settings are correct
- [ ] Verify authentication flow end-to-end

### Testing & Deployment
- [ ] Check Next.js build succeeds (`npm run build`)
- [ ] Verify all API routes work
- [ ] Test authentication flow
- [ ] Verify all page routes load correctly
- [ ] Check for runtime errors in console

