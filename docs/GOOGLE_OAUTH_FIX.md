# Fix Google OAuth "Origin Not Allowed" Error

## Error Message
```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
Failed to load resource: the server responded with a status of 403
```

## Solution: Add Localhost to Authorized Origins

### Step 1: Open Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **luci-478817**
3. Navigate to: **APIs & Services** → **Credentials**

### Step 2: Edit Your OAuth Client ID

1. Find your OAuth 2.0 Client ID: `160384595408-625gmnr4j40cgjp44qkfljoeo6i0n7j9`
2. Click on it to edit

### Step 3: Add Authorized JavaScript Origins

In the **Authorized JavaScript origins** section:

1. Click **+ ADD URI**
2. Add these origins (one at a time):

   **For Local Development:**
   ```
   http://localhost:3000
   ```

   **For Production (if not already added):**
   ```
   https://luci-ivory.vercel.app
   https://ld-luci.vercel.app
   ```

   **Important Notes:**
   - ✅ Use `http://` for localhost (not `https://`)
   - ✅ Don't include a trailing slash
   - ✅ Use the exact port number (3000)

3. Click **SAVE** after adding each origin

### Step 4: Verify Authorized Redirect URIs

While you're in the OAuth settings, check the **Authorized redirect URIs** section:

Make sure these are included:
```
http://localhost:3000/api/google-calendar
https://luci-ivory.vercel.app/api/google-calendar
```

### Step 5: Wait and Test

1. **Wait 1-2 minutes** after saving (Google caches OAuth settings)
2. **Clear browser cache** or use incognito mode
3. **Hard refresh** the page (Ctrl+Shift+R or Cmd+Shift+R)
4. Test Google Sign-In again

## Quick Checklist

- [ ] Added `http://localhost:3000` to Authorized JavaScript origins
- [ ] Added production URLs to Authorized JavaScript origins
- [ ] Verified redirect URIs are correct
- [ ] Waited 1-2 minutes after saving
- [ ] Cleared browser cache / used incognito mode
- [ ] Hard refreshed the page

## Alternative: Check Current Configuration

If you want to see what origins are currently configured:

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click on your OAuth Client ID
3. Scroll to "Authorized JavaScript origins"
4. Verify `http://localhost:3000` is in the list

## Troubleshooting

### Still Getting Errors After Adding Origin?

1. **Verify the Client ID matches:**
   - In code: `160384595408-625gmnr4j40cgjp44qkfljoeo6i0n7j9.apps.googleusercontent.com`
   - In Google Console: Should match exactly

2. **Check for typos:**
   - Should be `http://localhost:3000` (not `https://`)
   - No trailing slash
   - Exact port number

3. **Try incognito mode:**
   - Old cached credentials might interfere

4. **Check browser console:**
   - Look for specific error messages
   - Check Network tab for failed requests to `accounts.google.com`

## Related Files

- `src/components/auth/LoginPage.js` - Contains Google Sign-In implementation
- `src/app/layout.js` - Loads Google Identity Services script
- `docs/HEALTH_CHECK.md` - More detailed Google Sign-In troubleshooting

