# Additional Codebase Optimizations

## Analysis Summary

After creating shared utilities, here are additional optimization opportunities:

## 1. Standardize Export Patterns ⚠️ **HIGH PRIORITY**

**Issue:** Inconsistent module exports
- `api/salesforce-cases.js` → `module.exports` 
- `api/salesforce-contacts.js` → `module.exports`
- All others → `export default`

**Fix:** Standardize all to `export default` (Vercel best practice)

**Impact:** Consistency, easier maintenance

---

## 2. Extract Supabase Validation Helper ⚠️ **HIGH PRIORITY**

**Issue:** Repeated pattern in every endpoint:
```javascript
const supabase = getSupabaseClient();
if (!supabase) {
  return res.status(503).json({
    error: 'Database not configured',
    message: '...'
  });
}
```

**Fix:** Create `validateSupabase(supabase, res)` helper

**Impact:** ~30 lines saved across 9 endpoints = ~270 lines

---

## 3. Extract Rate Limiter to Shared Utility ⚠️ **MEDIUM PRIORITY**

**Issue:** Rate limiting code only in `analyze-sentiment.js` but could be reused

**Fix:** Move to `lib/api-helpers.js` or `lib/rate-limiter.js`

**Impact:** Reusable rate limiting for other endpoints

---

## 4. Extract Input Validation Helpers ⚠️ **MEDIUM PRIORITY**

**Issue:** Repeated validation patterns:
- Missing required parameters
- Invalid parameter types
- Parameter sanitization

**Fix:** Create `lib/validation-helpers.js`:
```javascript
validateRequired(params, requiredFields)
validateTypes(params, schema)
sanitizeInput(input)
```

**Impact:** Consistent validation, easier to maintain

---

## 5. Frontend Code Organization ⚠️ **MEDIUM PRIORITY**

**Issue:** `index.html` is 2808 lines - all React code in one file

**Potential Extractions:**
1. **Utility Functions** (~200 lines):
   - `formatCurrency()`
   - `getBuildVersion()`, `checkVersionUpdate()`
   - `log()`, `logError()`
   - Constants (MAX_RETRIES, etc.)

2. **API Client Functions** (~300 lines):
   - `fetchAvomaData()`
   - `fetchSalesforceData()`
   - `analyzeSentiment()`
   - `fetchCasesForAccount()`
   - `fetchContactsForAccount()`
   - `fetchSentimentHistory()`

3. **Constants** (~50 lines):
   - `GOOGLE_CLIENT_ID`
   - `MAX_RETRIES`, `RETRY_DELAY`, etc.
   - `isProduction`

**Note:** Since this is a single-file app by design, we could:
- Option A: Keep as-is (intentional design)
- Option B: Extract to separate JS files loaded via `<script>` tags
- Option C: Create a build step that bundles everything

**Recommendation:** Extract utilities to separate files, keep components in index.html

---

## 6. Database Query Patterns ⚠️ **LOW PRIORITY**

**Issue:** Similar query patterns repeated:
- Account UUID lookup by salesforce_id
- Cache freshness checks
- Upsert operations with error handling

**Fix:** Create `lib/db-helpers.js`:
```javascript
async function findAccountBySalesforceId(supabase, salesforceId)
async function isCacheStale(supabase, table, id, ttlHours)
async function safeUpsert(supabase, table, data, conflictKey)
```

**Impact:** Reduced duplication, consistent error handling

---

## 7. Error Response Consistency ⚠️ **MEDIUM PRIORITY**

**Issue:** Some endpoints use `sendErrorResponse()`, others use manual `res.status().json()`

**Files to fix:**
- `api/salesforce-cases.js` - Line 136: `return res.status(400).json(...)`
- `api/salesforce-accounts.js` - Multiple manual responses
- `api/analyze-sentiment.js` - Multiple manual responses
- `api/users.js` - Multiple manual responses

**Fix:** Replace all with `sendErrorResponse()` and `sendSuccessResponse()`

**Impact:** Consistent error handling, easier to maintain

---

## 8. Constants Still in Individual Files ⚠️ **MEDIUM PRIORITY**

**Issue:** Some constants still defined in individual files:

**Files with remaining constants:**
- `api/analyze-sentiment.js`: `MAX_REQUEST_SIZE`, `REQUEST_TIMEOUT`, `RATE_LIMIT_*`
- `api/salesforce-accounts.js`: `MAX_REQUEST_SIZE`, `REQUEST_TIMEOUT`, `CACHE_TTL_HOURS`
- `api/avoma-transcription.js`: `CACHE_TTL_HOURS`, `MAX_REQUEST_SIZE`

**Fix:** Use constants from `lib/constants.js`

**Impact:** Single source of truth

---

## 9. Logging Consistency ⚠️ **MEDIUM PRIORITY**

**Issue:** Some files still use `console.log/error/warn` directly

**Files to fix:**
- `api/analyze-sentiment.js` - Line 97: `console.error`
- `api/users.js` - Multiple `console.error`
- `api/salesforce-accounts.js` - Multiple console statements

**Fix:** Use `log()`, `logError()`, `logWarn()` from `api-helpers.js`

**Impact:** Consistent logging, automatic production filtering

---

## 10. CORS Headers Still Manual ⚠️ **HIGH PRIORITY**

**Issue:** Some endpoints still set CORS headers manually:

**Files to fix:**
- `api/analyze-sentiment.js` - Lines 60-62
- `api/salesforce-accounts.js` - Lines 694-696
- `api/users.js` - Lines 12-14
- `api/avoma-transcription.js` - Lines 199-201
- `api/linkedin-auth.js` - Lines 12-14
- `api/linkedin-enrich.js` - Lines 13-15
- `api/sentiment-history.js` - Lines 10-12

**Fix:** Use `setCORSHeaders()` and `handlePreflight()` from `api-helpers.js`

**Impact:** Consistent CORS handling, ~30 lines saved

---

## 11. Request Size Validation Inconsistency ⚠️ **MEDIUM PRIORITY**

**Issue:** Some use `validateRequestSize()`, others check manually

**Files to fix:**
- `api/analyze-sentiment.js` - Manual check (lines 88-91)
- `api/salesforce-accounts.js` - Manual check (lines 709-712)
- `api/avoma-transcription.js` - Manual check (lines 214-217)

**Fix:** Use `validateRequestSize()` from `api-helpers.js`

**Impact:** Consistent validation

---

## 12. Method Validation Inconsistency ⚠️ **LOW PRIORITY**

**Issue:** Some use helpers, others check manually

**Fix:** Create `validateMethod(req, res, allowedMethods)` helper

**Impact:** Consistent method validation

---

## 13. Account UUID Lookup Pattern ⚠️ **LOW PRIORITY**

**Issue:** Repeated pattern in multiple files:
```javascript
// Try UUID first, then lookup by salesforce_id
let accountUuid = null;
if (accountId && accountId.includes('-') && accountId.length === 36) {
  // Verify UUID exists
  const { data: account } = await supabase...
}
if (!accountUuid) {
  // Lookup by salesforce_id
  const { data: account } = await supabase...
}
```

**Fix:** Create `lib/db-helpers.js` with `resolveAccountId()` function

**Impact:** ~20 lines saved per file = ~60 lines total

---

## 14. Frontend State Management ⚠️ **LOW PRIORITY**

**Issue:** 35+ `useState` hooks in one component

**Potential Improvements:**
- Group related state into objects
- Use `useReducer` for complex state
- Extract state management to custom hooks

**Note:** Current approach works, but could be more organized

---

## 15. API Response Mapping ⚠️ **LOW PRIORITY**

**Issue:** Repeated mapping patterns:
- Cases: `c.salesforce_id` → `c.id`
- Contacts: Similar field mapping
- Accounts: Similar field mapping

**Fix:** Create mapper functions:
```javascript
mapCaseToResponse(case)
mapContactToResponse(contact)
mapAccountToResponse(account)
```

**Impact:** Consistent response formats, easier to maintain

---

## Priority Summary

### 🔴 **HIGH PRIORITY** (Do First)
1. Standardize export patterns (2 files)
2. Extract Supabase validation helper (~270 lines saved)
3. Fix CORS headers in remaining endpoints (~30 lines saved)

### 🟡 **MEDIUM PRIORITY** (Do Next)
4. Extract rate limiter
5. Extract input validation helpers
6. Frontend code organization (utilities extraction)
7. Error response consistency
8. Constants cleanup
9. Logging consistency
10. Request size validation consistency

### 🟢 **LOW PRIORITY** (Nice to Have)
11. Database query patterns
12. Method validation helper
13. Account UUID lookup pattern
14. Frontend state management
15. API response mapping

---

## Estimated Total Impact

**Code Reduction:**
- High Priority: ~300 lines
- Medium Priority: ~200 lines
- Low Priority: ~150 lines
- **Total: ~650 lines of duplicate/redundant code**

**Maintainability:**
- Single source of truth for all common operations
- Consistent patterns across all endpoints
- Easier to test and debug
- Easier to add new endpoints

**Performance:**
- Slightly smaller bundle size
- Consistent error handling
- Better caching patterns

---

## Implementation Order

1. ✅ Create shared utilities (DONE)
2. ✅ Refactor salesforce-cases.js (DONE)
3. **Next:** Standardize exports (2 files)
4. **Next:** Extract Supabase validation (all endpoints)
5. **Next:** Fix CORS headers (7 endpoints)
6. **Then:** Continue with medium priority items

