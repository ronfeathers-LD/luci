# LinkedIn OAuth Setup Verification

## Current Error
```
error=invalid_scope_error
error_description=The+requested+permission+scope+is+not+valid
```

## Root Cause
The `invalid_scope_error` means LinkedIn is rejecting the scopes `openid profile email`. This happens when:
1. **"Sign In with LinkedIn using OpenID Connect" product is NOT enabled** in your LinkedIn app
2. The scopes don't match what your app has access to

## Step-by-Step Fix

### Step 1: Check Your LinkedIn App Products

1. Go to: https://www.linkedin.com/developers/apps
2. Sign in with your LinkedIn account
3. Find your app (Client ID: `86vb3srl5hijb5`)
4. Click on it to open
5. **Go to the "Products" tab** (left sidebar)

### Step 2: Check What Products Are Available

Look for these products in the list:

**Required for OpenID Connect scopes:**
- ✅ **"Sign In with LinkedIn using OpenID Connect"** - This is what we need!

**Alternative products (if OpenID Connect not available):**
- "Sign In with LinkedIn" (legacy - different scopes)
- "Marketing Developer Platform" (for organization data)

### Step 3: Enable "Sign In with LinkedIn using OpenID Connect"

If you see **"Sign In with LinkedIn using OpenID Connect"**:

1. Click on it
2. Click **"Request access"** or **"Add product"** button
3. Follow any approval process (may be instant or require approval)
4. Wait for it to show as **"Active"** or **"Enabled"**

**If you DON'T see this product:**
- Your app may not have access to it
- You may need to create a new LinkedIn app
- Or contact LinkedIn Developer Support

### Step 4: Verify Redirect URI

While you're in the LinkedIn app settings:

1. Go to **"Auth"** tab
2. Under **"OAuth 2.0 settings"** → **"Redirect URLs"**
3. Make sure this EXACT URL is listed:
   ```
   https://ld-luci.vercel.app/api/linkedin-auth
   ```
4. It must match EXACTLY (case-sensitive, no trailing slash)

### Step 5: Wait and Test

1. After enabling the product, wait **5-10 minutes** for changes to propagate
2. Clear your browser cache
3. Try again: `https://ld-luci.vercel.app/api/linkedin-auth`

## What to Tell Me

Please check your LinkedIn app and tell me:

1. **What products are listed in the "Products" tab?**
   - List all products you see (even if not enabled)

2. **Is "Sign In with LinkedIn using OpenID Connect" visible?**
   - Yes/No
   - If yes, is it enabled/active?

3. **What's the status of your app?**
   - Development mode?
   - Production mode?
   - Any pending approvals?

4. **What redirect URIs are configured?**
   - List all redirect URIs in the Auth tab

## Alternative: If OpenID Connect Not Available

If you cannot get "Sign In with LinkedIn using OpenID Connect" access, we have a few options:

1. **Use a different LinkedIn app** that has the product enabled
2. **Request access from LinkedIn** (may take time)
3. **Use alternative authentication** (manual token entry, or different integration method)
4. **Skip LinkedIn enrichment** for now and use only Salesforce data

Let me know what you find in the Products tab!

