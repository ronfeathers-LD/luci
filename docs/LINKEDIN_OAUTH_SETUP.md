# LinkedIn OAuth Setup Guide

## Overview

LinkedIn uses OAuth 2.0 for API authentication. This guide will help you set up OAuth for L.U.C.I.

## Step 1: Configure LinkedIn App in Developer Portal

1. **Go to LinkedIn Developer Portal:**
   - Visit: https://www.linkedin.com/developers/apps
   - Sign in with your LinkedIn account

2. **Select or Create Your App:**
   - If you already have an app, select it
   - If not, click "Create app" and fill in:
     - App name: "L.U.C.I. - LeanData Unified Customer Intelligence"
     - LinkedIn Page: Your company page
     - Privacy Policy URL: Your privacy policy URL
     - App logo: Upload a logo

3. **Get Your Credentials:**
   - Go to the **Auth** tab
   - Copy your **Client ID** and **Client Secret**
   - You'll need these in Step 2

4. **Add Redirect URI:**
   - In the **Auth** tab, under "OAuth 2.0 settings"
   - Add redirect URI: `https://your-app.vercel.app/api/linkedin-auth`
   - Replace `your-app.vercel.app` with your actual Vercel domain
   - Click **Update**

5. **Add Required Products (CRITICAL):**
   - Go to the **Products** tab
   - **MUST ADD:** **"Sign In with LinkedIn using OpenID Connect"** 
     - This is REQUIRED for `openid`, `profile`, and `email` scopes
     - Without this product, you'll get `invalid_scope_error`
     - Click "Request access" or "Add product" if available
   - If you have MDP access, add **"Marketing Developer Platform"** (optional)
   
   **⚠️ IMPORTANT:** The OAuth flow will fail with `invalid_scope_error` if this product is not enabled!

## Step 2: Insert Credentials into Database

Run this SQL in Supabase SQL Editor:

```sql
-- Insert or update LinkedIn credentials
INSERT INTO linkedin_configs (client_id, client_secret, redirect_uri, is_active)
VALUES (
  'YOUR_CLIENT_ID_HERE',
  'YOUR_CLIENT_SECRET_HERE',
  'https://your-app.vercel.app/api/linkedin-auth', -- Replace with your Vercel domain
  true
)
ON CONFLICT (id) DO UPDATE
SET 
  client_id = EXCLUDED.client_id,
  client_secret = EXCLUDED.client_secret,
  redirect_uri = EXCLUDED.redirect_uri,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
```

**Important:** Replace:
- `YOUR_CLIENT_ID_HERE` with your actual Client ID
- `YOUR_CLIENT_SECRET_HERE` with your actual Client Secret
- `your-app.vercel.app` with your actual Vercel domain

## Step 3: Initiate OAuth Flow

### Option A: Via Browser (Recommended for Testing)

1. **Visit the OAuth endpoint:**
   ```
   https://your-app.vercel.app/api/linkedin-auth
   ```

2. **You'll be redirected to LinkedIn:**
   - Sign in to LinkedIn (if not already)
   - Review permissions
   - Click **Allow**

3. **LinkedIn redirects back:**
   - You'll be redirected to `/api/linkedin-auth` with an authorization code
   - The endpoint exchanges the code for an access token
   - Token is stored in the database

4. **Success!**
   - You should see a success message
   - Access token is now stored and ready to use

### Option B: Add OAuth Button to UI (Future Enhancement)

We can add a "Connect LinkedIn" button to the UI that initiates OAuth flow.

## Step 4: Verify OAuth Setup

Check that tokens are stored:

```sql
SELECT 
  id,
  client_id,
  has_access_token = (access_token IS NOT NULL) as has_token,
  token_expires_at,
  last_tested
FROM linkedin_configs
WHERE is_active = true;
```

## Step 5: Test the Integration

Once OAuth is configured, test profile enrichment:

```bash
# Test enriching a contact
curl -X POST https://your-app.vercel.app/api/linkedin-enrich \
  -H "Content-Type: application/json" \
  -d '{
    "linkedinURL": "https://www.linkedin.com/in/example",
    "salesforceContactId": "003XX000004ABCD"
  }'
```

## OAuth Flow Details

### Authorization Code Flow

1. **User Authorization:**
   - User visits `/api/linkedin-auth`
   - Redirected to LinkedIn authorization page
   - User grants permissions
   - LinkedIn redirects back with `code`

2. **Token Exchange:**
   - `/api/linkedin-auth` receives the `code`
   - Exchanges `code` for `access_token` and `refresh_token`
   - Stores tokens in `linkedin_configs` table

3. **Token Usage:**
   - Access token used for API requests
   - Token expires after ~60 days
   - Refresh token used to get new access token

4. **Token Refresh:**
   - Automatically handled by `getAccessToken()` function
   - Refreshes when token expires or is about to expire

## Required Scopes

The OAuth flow requests these scopes:

- `openid` - OpenID Connect authentication (required for new API)
- `profile` - Basic profile information (replaces deprecated `r_liteprofile`)
- `email` - Email address (replaces deprecated `r_emailaddress`)

**Note:** 
- The old scopes (`r_liteprofile`, `r_emailaddress`) are **deprecated** and will cause `invalid_scope_error`
- For organization/company data, you may need Marketing Developer Platform (MDP) access
- Additional scopes like `r_organization_social` and `w_member_social` require special approval

## Troubleshooting

### "Invalid redirect_uri"
- Make sure the redirect URI in your LinkedIn app matches exactly
- Must use HTTPS in production
- No trailing slashes

### "Invalid client_id or client_secret"
- Verify credentials are correct in database
- Check for extra spaces or characters

### "Access token not available"
- OAuth flow hasn't been completed
- Visit `/api/linkedin-auth` to initiate authorization

### "Token expired"
- Token needs to be refreshed
- If refresh token is missing, re-authenticate
- Visit `/api/linkedin-auth` again

### "Insufficient permissions"
- Check that required products are added in LinkedIn Developer Portal
- Verify scopes are approved for your app

## Security Notes

1. **Client Secret:**
   - Never expose in client-side code
   - Stored securely in Supabase database
   - Only accessible via serverless functions

2. **Access Tokens:**
   - Stored in database (encrypted in production)
   - Never exposed to client
   - Automatically refreshed when needed

3. **Redirect URI:**
   - Must match exactly in LinkedIn app settings
   - Use HTTPS in production

## Next Steps

After OAuth is configured:

1. ✅ Profile enrichment will work automatically
2. ✅ LinkedIn data will be included in sentiment analysis
3. ✅ Engagement metrics will be tracked (if MDP access available)

## Manual Token Entry (Alternative)

If you already have an access token from another source:

```sql
UPDATE linkedin_configs
SET 
  access_token = 'your-access-token-here',
  token_expires_at = '2025-12-31T23:59:59Z', -- Set expiration date
  last_tested = NOW()
WHERE is_active = true;
```

**Note:** Manual tokens will still need to be refreshed when they expire.

