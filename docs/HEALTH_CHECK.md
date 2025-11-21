# Health Check Guide - Google Sign-In Setup

## Current Configuration

**Google Client ID:** `160384595408-625gmnr4j40cgjp44qkfljoeo6i0n7j9.apps.googleusercontent.com`

## Step-by-Step Health Check

### 1. Verify Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **luci-478817**
3. Navigate to: **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID: `160384595408-625gmnr4j40cgjp44qkfljoeo6i0n7j9`
5. Click to edit it

### 2. Check Authorized JavaScript Origins

**Required Origins (add all that apply):**
- `https://luci-ivory.vercel.app` (your Vercel production URL)
- `https://ld-luci.vercel.app` (if different)
- `http://localhost:3000` (for local testing)
- `http://localhost:5173` (if using Vite)
- Any other preview URLs you use

**How to add:**
1. Click **+ ADD URI**
2. Enter the full URL (with https://)
3. Click **SAVE**

### 3. Check Authorized Redirect URIs

**Required Redirect URIs:**
- `https://vcztmplyannfgvlihyuq.supabase.co/auth/v1/callback` (from your config)
- Any other callback URLs you're using

### 4. Verify the Script is Loading

Open browser DevTools (F12) and check:

**Console Tab:**
- Look for: `"Google Sign-In initialized successfully"`
- Look for: `"Google Sign-In button rendered successfully"`
- Check for any red error messages

**Network Tab:**
- Filter by "gsi" or "google"
- Verify `https://accounts.google.com/gsi/client` loads successfully (Status 200)
- Check for any CORS errors

### 5. Common Issues & Solutions

#### Issue: "Failed to load sign-in button"
**Possible Causes:**
1. Domain not authorized in Google OAuth settings
2. Google Identity Services script not loading
3. CORS errors
4. Client ID mismatch

**Solutions:**
- Verify your Vercel domain is in "Authorized JavaScript origins"
- Check browser console for specific errors
- Verify the Client ID matches exactly

#### Issue: "Google Sign-In script not loaded"
**Possible Causes:**
1. Network/firewall blocking Google domains
2. Ad blockers interfering
3. Script loading error

**Solutions:**
- Disable ad blockers temporarily
- Check network tab for failed requests
- Try in incognito mode

#### Issue: Button appears but clicking does nothing
**Possible Causes:**
1. Redirect URI not configured
2. Client ID doesn't match
3. OAuth consent screen not configured

**Solutions:**
- Verify redirect URI in Google Console
- Check OAuth consent screen is published
- Verify Client ID in code matches Console

### 6. Test Checklist

- [ ] Google OAuth Client ID exists in Google Cloud Console
- [ ] Vercel domain is in "Authorized JavaScript origins"
- [ ] Redirect URI is configured correctly
- [ ] OAuth consent screen is configured and published
- [ ] Google Identity Services script loads (check Network tab)
- [ ] No console errors
- [ ] Button appears on page
- [ ] Clicking button opens Google sign-in popup
- [ ] After sign-in, user info is displayed

### 7. Debugging Commands

**In Browser Console, run:**
```javascript
// Check if Google Identity Services is loaded
console.log('Google loaded:', !!window.google);
console.log('Google accounts:', !!window.google?.accounts);
console.log('Google accounts.id:', !!window.google?.accounts?.id);

// Check Client ID
console.log('Client ID:', '160384595408-625gmnr4j40cgjp44qkfljoeo6i0n7j9.apps.googleusercontent.com');

// Check current domain
console.log('Current origin:', window.location.origin);
```

### 8. Quick Fixes

**If button doesn't appear:**
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check console for errors
4. Verify domain is authorized

**If you see CORS errors:**
1. Add your exact domain (with https://) to Authorized JavaScript origins
2. Make sure there's no trailing slash
3. Wait a few minutes after saving (Google caches settings)

## Current Status

Based on your error message "Failed to load sign-in button", the most likely issue is:

**Domain not authorized in Google OAuth settings**

**Action Required:**
1. Go to Google Cloud Console
2. Add your Vercel domain to "Authorized JavaScript origins"
3. Wait 2-3 minutes for changes to propagate
4. Refresh your app

