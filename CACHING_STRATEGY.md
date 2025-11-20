# Caching Strategy - Minimize External API Calls

This document outlines our cache-first approach to minimize external API calls and improve performance.

## Core Principle

**Always check local cache (Supabase) before making external API calls. Only call external APIs when:**
1. Cache is missing
2. Cache is stale (beyond TTL)
3. Force refresh is explicitly requested

## Caching Implementation

### 1. Salesforce Accounts

**Location:** `api/salesforce-accounts.js`

**Cache TTL:** 1 hour (`CACHE_TTL_HOURS = 1`)

**Strategy:**
1. **Assigned Accounts:**
   - Check `user_accounts` table for cached accounts
   - If cache is fresh (<1 hour), return cached data
   - If cache is stale or missing, query Salesforce
   - Sync results to Supabase for future use

2. **Account Search:**
   - Check `accounts` table by name (case-insensitive LIKE)
   - If cache is fresh, return cached results
   - If cache is stale or missing, query Salesforce
   - Sync search results to Supabase
   - **Fallback:** Use stale cache if Salesforce API fails

**Cache Storage:**
- `accounts` table: Stores account data with `last_synced_at` timestamp
- `user_accounts` table: Links users to their assigned accounts

**Benefits:**
- First search: Calls Salesforce API, caches results
- Subsequent searches: Uses cache (no API call)
- After 1 hour: Refreshes from Salesforce, updates cache

---

### 2. Avoma Transcriptions

**Location:** `api/avoma-transcription.js`

**Cache TTL:** 24 hours (`CACHE_TTL_HOURS = 24`)

**Strategy:**
1. Check `transcriptions` table by:
   - `salesforce_account_id` (preferred)
   - `customer_identifier` (fallback)
2. If cache is fresh (<24 hours), return cached transcription
3. If cache is stale or missing:
   - Search Avoma for meetings matching customer
   - Fetch transcription from Avoma API
   - Cache in Supabase for future use

**Cache Storage:**
- `transcriptions` table: Stores full transcription text, speakers, meeting metadata
- Indexed on `avoma_meeting_uuid`, `salesforce_account_id`, `customer_identifier`

**Benefits:**
- First request: Calls Avoma API, caches transcription
- Subsequent requests (within 24h): Uses cache (no API call)
- After 24 hours: Refreshes from Avoma, updates cache

---

### 3. User Data

**Location:** `api/users.js`

**Cache Storage:**
- `users` table: Stores user profile data
- Created/updated on Google Sign-In

**Strategy:**
- No external API calls needed
- All user data stored in Supabase
- Updates on each sign-in

---

## Cache Invalidation

### Automatic Refresh
- Accounts: Refreshed when `last_synced_at` > 1 hour old
- Transcriptions: Refreshed when `last_synced_at` > 24 hours old

### Manual Refresh
- Use `forceRefresh=true` query parameter to bypass cache
- Forces fresh data from external APIs

### Stale Cache Fallback
- If external API fails, use stale cache if available
- Provides graceful degradation
- User still gets data (may be slightly outdated)

---

## Performance Impact

### Before Caching
- Every search: Salesforce API call
- Every sentiment analysis: Avoma API call
- High latency, API rate limit risk

### After Caching
- First search: Salesforce API call (cached)
- Subsequent searches: Cache hit (instant)
- First sentiment analysis: Avoma API call (cached)
- Subsequent analyses: Cache hit (instant)

### Estimated API Call Reduction
- **Account searches:** ~90% reduction (after initial cache)
- **Transcription fetches:** ~95% reduction (24h TTL)
- **Overall:** Significant reduction in external API calls

---

## Cache Management

### Cache Keys
- **Accounts:** `salesforce_id` (unique)
- **Transcriptions:** `avoma_meeting_uuid` (unique)
- **User-Account Links:** `user_id` + `account_id` (composite)

### Cache Updates
- Automatic on fetch (upsert pattern)
- `last_synced_at` updated on each sync
- Old cache automatically refreshed when stale

### Cache Cleanup
- No manual cleanup needed
- Supabase handles storage
- Old data automatically refreshed when accessed

---

## Best Practices

1. **Always check cache first** - Before any external API call
2. **Cache on fetch** - Store all fetched data for future use
3. **Use appropriate TTL** - Balance freshness vs API calls
4. **Graceful degradation** - Use stale cache if API fails
5. **Index for performance** - Database indexes on search fields

---

## Monitoring

### Cache Hit Rate
- Check `cached: true/false` in API responses
- Monitor cache freshness via `last_synced_at`
- Track API call frequency in logs

### Optimization Opportunities
- Increase TTL for rarely-changing data
- Decrease TTL for frequently-updated data
- Add more indexes for common search patterns

---

## Summary

✅ **All external API calls are cache-first**
✅ **Cache TTLs configured appropriately**
✅ **Stale cache fallback for reliability**
✅ **Automatic cache refresh on access**
✅ **Significant reduction in API calls**

The application now minimizes external API calls while maintaining data freshness through intelligent caching.

