# Codebase Optimization Plan

## Overview

This document outlines the comprehensive optimization and refactoring of the LUCI codebase to improve code organization, reduce duplication, and follow best practices.

## Completed Optimizations

### 1. Shared Utilities Created ✅

#### `lib/constants.js`
- Centralized all constants (request sizes, timeouts, rate limits, cache TTLs, API limits)
- Single source of truth for configuration values

#### `lib/api-helpers.js`
- Standardized CORS header handling
- Preflight request handling
- Request size validation
- Error sanitization for production
- Standardized response helpers
- Client IP extraction
- Conditional logging utilities

#### `lib/salesforce-client.js`
- Consolidated `getJsforceClient()` (was duplicated in 3 files)
- Consolidated `authenticateSalesforce()` (was duplicated in 3 files)
- Consolidated `escapeSOQL()` (was duplicated in 2 files)
- Consolidated `isCacheFresh()` (was duplicated in 2 files)

#### `lib/cache-helpers.js`
- Resource-specific cache freshness checking
- Cache TTL utilities
- Cache age calculation

### 2. Refactored Endpoints ✅

#### `api/salesforce-cases.js`
- ✅ Now uses shared utilities
- ✅ Removed 60+ lines of duplicate code
- ✅ Consistent error handling
- ✅ Standardized logging

## Remaining Optimizations

### 3. Refactor Other API Endpoints

#### `api/salesforce-contacts.js`
- Replace duplicate `getJsforceClient()`, `authenticateSalesforce()`, `escapeSOQL()`
- Use shared constants for `CACHE_TTL_HOURS`, `MAX_REQUEST_SIZE`
- Use shared API helpers for CORS, validation, error handling
- Use shared logging utilities

#### `api/salesforce-accounts.js`
- Replace duplicate `getJsforceClient()`, `authenticateSalesforce()`, `escapeSOQL()`
- Use shared constants
- Use shared API helpers
- Use shared logging utilities
- Note: This is the largest file, will see significant reduction

#### `api/avoma-transcription.js`
- Use shared constants for `CACHE_TTL_HOURS`, `MAX_REQUEST_SIZE`
- Use shared API helpers
- Use shared logging utilities
- Consolidate `isCacheFresh()` usage

#### `api/analyze-sentiment.js`
- Use shared constants for rate limiting, timeouts, request sizes
- Use shared API helpers
- Use shared logging utilities
- Consider extracting rate limiter to shared utility

#### `api/linkedin-enrich.js`
- Use shared API helpers
- Use shared logging utilities

#### `api/linkedin-auth.js`
- Use shared API helpers
- Use shared logging utilities

#### `api/sentiment-history.js`
- Use shared API helpers
- Use shared logging utilities

#### `api/users.js`
- Use shared API helpers
- Use shared logging utilities

### 4. Standardize Export Patterns

**Current State:**
- Some files use `export default`
- Some files use `module.exports`

**Recommendation:**
- Standardize on `export default` for Vercel serverless functions
- Or standardize on `module.exports` for consistency

**Files to Update:**
- `api/salesforce-cases.js` → Change to `export default`
- `api/salesforce-contacts.js` → Change to `export default`
- `api/salesforce-accounts.js` → Already uses `export default` ✅

### 5. Frontend Code Organization

**Current State:**
- `index.html` is 2808 lines - all React code in one file

**Recommendations:**
- Extract utility functions to separate modules
- Extract constants to separate file
- Consider component extraction (though single-file app is intentional)

**Potential Extractions:**
- Version checking utilities
- Currency formatting
- Logging utilities
- API client functions
- Constants

### 6. Error Handling Consistency

**Current State:**
- Inconsistent error response formats
- Some use `sendErrorResponse`, some use manual `res.status().json()`

**Recommendation:**
- All endpoints should use `sendErrorResponse()` from `api-helpers.js`
- Consistent error message structure

### 7. Logging Consistency

**Current State:**
- Mix of `console.log`, `console.error`, `console.warn`
- Some conditional on `process.env.NODE_ENV`

**Recommendation:**
- All should use `log()`, `logError()`, `logWarn()` from `api-helpers.js`
- Automatic production filtering

## Code Reduction Summary

### Before Optimization:
- `getJsforceClient()`: 3 copies (18 lines each = 54 lines)
- `authenticateSalesforce()`: 3 copies (~60 lines each = 180 lines)
- `escapeSOQL()`: 2 copies (4 lines each = 8 lines)
- `isCacheFresh()`: 2 copies (8 lines each = 16 lines)
- CORS headers: 9 copies (3 lines each = 27 lines)
- Constants: Scattered across files (~50 lines)

**Total Duplication: ~335 lines**

### After Optimization:
- All consolidated into shared utilities
- **Estimated reduction: ~300 lines of duplicate code**
- **Improved maintainability: Single source of truth**

## Benefits

1. **DRY Principle**: Eliminated code duplication
2. **Maintainability**: Changes in one place affect all endpoints
3. **Consistency**: Standardized patterns across all endpoints
4. **Testability**: Shared utilities can be tested independently
5. **Readability**: Endpoints are cleaner and focus on business logic
6. **Error Handling**: Consistent error responses
7. **Logging**: Consistent logging with production filtering

## Implementation Priority

1. ✅ **High Priority - Completed:**
   - Create shared utilities
   - Refactor `api/salesforce-cases.js`

2. **High Priority - Next:**
   - Refactor `api/salesforce-contacts.js`
   - Refactor `api/salesforce-accounts.js`

3. **Medium Priority:**
   - Refactor remaining API endpoints
   - Standardize export patterns

4. **Low Priority:**
   - Frontend code organization (if needed)
   - Additional optimizations

## Testing Checklist

After each refactoring:
- [ ] Verify endpoint still works
- [ ] Check error handling
- [ ] Verify logging (production vs development)
- [ ] Test rate limiting (if applicable)
- [ ] Test caching behavior
- [ ] Verify CORS headers

## Notes

- All changes maintain backward compatibility
- No breaking changes to API contracts
- All optimizations are internal refactoring
- Performance improvements from reduced code size

