# How to Verify LinkedIn Enrichment is Working

## Quick Check: Browser Console

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. **Select an account** with contacts that have LinkedIn URLs
4. **Look for these log messages:**
   - `[LinkedIn Enrich] Attempting to enrich contact with URL: ...`
   - `[LinkedIn Enrich] Enrichment result: SUCCESS` or `FAILED`
   - `[LinkedIn Enrich] Profile fetched from DB: Found` or `Not found`

## What You Should See in Contact Cards

When enrichment is working, contact cards should show:

1. **LinkedIn Link** (always shown if URL exists)
   - Blue "LinkedIn" link next to email/phone

2. **LinkedIn Profile Data** (only if enrichment succeeded)
   - A section below the contact info with a border
   - Shows: "LinkedIn: [Title] at [Company]"
   - May show: "⚠️ Recent job change detected" (if applicable)
   - May show: "📝 Profile recently updated" (if applicable)

## Check Database Directly

Run this SQL in Supabase to see if profiles are being stored:

```sql
-- Check if any LinkedIn profiles have been enriched
SELECT 
  linkedin_url,
  first_name,
  last_name,
  headline,
  current_title,
  current_company,
  last_synced_at,
  created_at
FROM linkedin_profiles
ORDER BY last_synced_at DESC
LIMIT 10;
```

## Check Enrichment API Response

1. **Open Browser DevTools** → **Network tab**
2. **Select an account** with contacts
3. **Filter by "linkedin-enrich"**
4. **Click on a request** to see the response
5. **Check the response:**
   - `success: true` + `profile: {...}` = Enrichment worked!
   - `success: false` + `error: "..."` = Enrichment failed (check error message)

## Common Issues

### Issue: No LinkedIn Profile Section Appears

**Possible causes:**
1. Enrichment is failing silently
2. LinkedIn API endpoints need updating for OpenID Connect
3. Profile data structure doesn't match what UI expects

**Check:**
- Browser console for `[LinkedIn Enrich]` messages
- Network tab for `/api/linkedin-enrich` responses
- Database for `linkedin_profiles` table entries

### Issue: LinkedIn Link Shows But No Profile Data

**This means:**
- LinkedIn URL is being collected ✅
- But enrichment is not working ❌

**Check:**
- Browser console for error messages
- Network tab for failed API calls
- Vercel function logs for errors

### Issue: Enrichment Returns "LinkedIn URN not available"

**This means:**
- The LinkedIn API client can't extract a URN from the profile URL
- OpenID Connect might need different API endpoints

**Solution:**
- We may need to update the LinkedIn API client to use OpenID Connect userinfo endpoint
- Or use a different approach to get profile data

## Expected Behavior

**When enrichment works:**
1. Contact card shows LinkedIn link ✅
2. Below contact info, a bordered section appears ✅
3. Section shows: "LinkedIn: [Title] at [Company]" ✅
4. May show job change warnings ✅

**When enrichment doesn't work:**
1. Contact card shows LinkedIn link ✅
2. No additional section below contact info ❌
3. No errors in console (silent failure) ❌

## Next Steps

If enrichment isn't working:
1. Check browser console for `[LinkedIn Enrich]` messages
2. Check Network tab for API responses
3. Share the error messages you see
4. We may need to update the LinkedIn API client for OpenID Connect

