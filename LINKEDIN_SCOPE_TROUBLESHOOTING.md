# LinkedIn OAuth Scope Troubleshooting

## Current Error
```
{"error":"LinkedIn OAuth error","message":"invalid_scope_error"}
```

## Root Cause
The `invalid_scope_error` means LinkedIn is rejecting the scopes we're requesting. This happens when:
1. The required product is not enabled in your LinkedIn app
2. The scopes don't match what your app has access to
3. The scopes are deprecated or invalid

## Solution Options

### Option 1: Enable "Sign In with LinkedIn using OpenID Connect" (Recommended)

**This is the modern approach and what we're currently using.**

1. Go to: https://www.linkedin.com/developers/apps
2. Select your app (Client ID: `86vb3srl5hijb5`)
3. Go to **Products** tab
4. Find **"Sign In with LinkedIn using OpenID Connect"**
5. Click **"Request access"** or **"Add product"**
6. Wait for approval (may be instant or take time)

**Required scopes:** `openid profile email`

### Option 2: Use Legacy "Sign In with LinkedIn" Product

If you have the older "Sign In with LinkedIn" product (not OpenID Connect):

1. Check what products are enabled in your app
2. If you have "Sign In with LinkedIn" (legacy), we can use different scopes
3. Contact me to update the OAuth endpoint with legacy scopes

**Note:** Legacy scopes may have limited functionality.

### Option 3: Check Available Products

To see what products your app has access to:

1. Go to: https://www.linkedin.com/developers/apps
2. Select your app
3. Go to **Products** tab
4. List all available/enabled products
5. Share that list so we can determine correct scopes

## Testing Different Scopes

You can test different scopes by adding `?scope=...` to the OAuth URL:

### Try OpenID Connect (current):
```
https://ld-luci.vercel.app/api/linkedin-auth?scope=openid%20profile%20email
```

### Try minimal OpenID Connect:
```
https://ld-luci.vercel.app/api/linkedin-auth?scope=openid
```

### Try legacy scopes (if you have old product):
```
https://ld-luci.vercel.app/api/linkedin-auth?scope=r_basicprofile
```

**Note:** The endpoint now accepts a `scope` query parameter to test different combinations.

## What to Check

1. **Products Tab:**
   - What products are listed?
   - Which ones are "Active" or "Enabled"?
   - Is "Sign In with LinkedIn using OpenID Connect" there?

2. **Auth Tab:**
   - Is the redirect URI correct?
   - Are there any warnings or errors shown?

3. **App Status:**
   - Is the app in "Development" or "Production" mode?
   - Are there any pending approvals?

## Next Steps

1. **Check your LinkedIn app's Products tab** and tell me:
   - What products are available?
   - What products are enabled/active?
   - Can you see "Sign In with LinkedIn using OpenID Connect"?

2. **If the product is not available:**
   - You may need to request access
   - Or we can use alternative authentication methods
   - Or we can use a different LinkedIn integration approach

3. **If the product is available but not enabled:**
   - Enable it and wait a few minutes
   - Then try the OAuth flow again

## Alternative: Manual Token Entry

If OAuth continues to fail, you can manually obtain a token:

1. Use LinkedIn's OAuth Playground: https://www.linkedin.com/developers/tools/oauth/playground
2. Get an access token there
3. Insert it directly into the database:

```sql
UPDATE linkedin_configs
SET 
  access_token = 'your-manual-token-here',
  token_expires_at = '2025-12-31T23:59:59Z',
  last_tested = NOW()
WHERE is_active = true;
```

**Note:** Manual tokens will still expire and need to be refreshed.

