# Mock Data Report

This document lists all mock data currently in use and their purposes.

## 1. Avoma Transcription Mock (`index.html`)

**Location:** `index.html` - `fetchAvomaData()` function (lines ~74-101)

**Purpose:** Simulates Avoma API call for transcription data

**Current Implementation:**
- Hardcoded conversation transcript
- 500ms simulated delay
- Returns a sample customer conversation showing sentiment journey

**Status:** ⚠️ **Still Mock** - Needs real Avoma API integration

**Action Required:**
- Replace with actual Avoma API call
- Create `/api/avoma-transcription` endpoint
- Pass customer identifier to fetch real transcription

---

## 2. Salesforce Context Mock (`index.html`)

**Location:** `index.html` - `fetchSalesforceData()` function (lines ~103-148)

**Purpose:** Simulates Salesforce API call for customer context

**Current Implementation:**
- Uses real account data if available (from selected account)
- Falls back to hardcoded defaults if no account data
- Includes mock tickets, dates, NPS score

**Status:** ⚠️ **Partially Mock** - Uses real account data but adds mock supplemental data

**Mock Data Includes:**
- `contract_start_date`: "2023-01-15"
- `renewal_date`: "2025-01-15"
- `recent_tickets`: Hardcoded array of 2 tickets
- `customer_since`: "2023-01-15"
- `nps_score`: 7
- `last_interaction`: "2024-09-15"

**Action Required:**
- Fetch real tickets from Salesforce
- Fetch real contract dates from Salesforce
- Fetch real NPS score from Salesforce
- Fetch real last interaction date

---

## 3. Salesforce Accounts Mock (API Fallback)

**Location:** `api/salesforce-accounts.js` (lines ~443-473)

**Purpose:** Fallback when Supabase is not configured

**Current Implementation:**
- Returns 2 hardcoded accounts (Acme Corp, TechStart Inc)
- Only used if Supabase environment variables are missing

**Status:** ✅ **Fallback Only** - Only used in development/testing

**Action Required:**
- Keep as fallback for development
- Consider removing in production (should fail gracefully instead)

---

## 4. User Mock (API Fallback)

**Location:** `api/users.js` (lines ~58-70, ~120-126)

**Purpose:** Fallback when Supabase is not configured

**Current Implementation:**
- Returns mock user data
- Only used if Supabase environment variables are missing

**Status:** ✅ **Fallback Only** - Only used in development/testing

**Action Required:**
- Keep as fallback for development
- Consider removing in production (should fail gracefully instead)

---

## Summary

### High Priority (Replace with Real APIs)
1. ✅ **Avoma Transcription** - Replace with real Avoma API
2. ✅ **Salesforce Supplemental Data** - Replace tickets, dates, NPS with real Salesforce queries

### Low Priority (Keep as Fallbacks)
3. ✅ **API Mock Accounts** - Keep for development, remove in production
4. ✅ **API Mock Users** - Keep for development, remove in production

---

## Recommended Next Steps

1. **Create Avoma API Integration**
   - Add `/api/avoma-transcription` endpoint
   - Integrate with Avoma API
   - Replace `fetchAvomaData()` mock

2. **Enhance Salesforce Context**
   - Query Salesforce for:
     - Recent Cases/Tickets
     - Contract dates
     - NPS scores
     - Last interaction dates
   - Replace hardcoded values in `fetchSalesforceData()`

3. **Remove Production Fallbacks**
   - Remove mock data fallbacks in production
   - Return proper errors instead

