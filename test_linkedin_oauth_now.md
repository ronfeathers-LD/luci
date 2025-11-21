# Test LinkedIn OAuth Now

## ✅ Product Confirmed Enabled
"Sign In with LinkedIn using OpenID Connect" is enabled in your LinkedIn app!

## Test Steps

### 1. Verify Redirect URI in LinkedIn App
1. Go to: https://www.linkedin.com/developers/apps
2. Select your app (Client ID: `86vb3srl5hijb5`)
3. Go to **Auth** tab
4. Under **"OAuth 2.0 settings"** → **"Redirect URLs"**
5. Make sure this EXACT URL is listed:
   ```
   https://ld-luci.vercel.app/api/linkedin-auth
   ```
6. If not, add it and click **Update**

### 2. Test OAuth Flow
1. Visit: `https://ld-luci.vercel.app/api/linkedin-auth`
2. You should be redirected to LinkedIn
3. LinkedIn should show an authorization page (not an error)
4. Click **"Allow"** or **"Authorize"**
5. You'll be redirected back to your app
6. You should see: **"LinkedIn OAuth Successful!"**

### 3. Verify Token Was Stored
After successful OAuth, check the database:

```sql
SELECT 
  id,
  client_id,
  CASE WHEN access_token IS NOT NULL THEN 'Yes' ELSE 'No' END as has_token,
  token_expires_at,
  last_tested,
  updated_at
FROM linkedin_configs
WHERE is_active = true;
```

You should see:
- `has_token: "Yes"`
- `token_expires_at` set to a future date (~60 days from now)
- `last_tested` updated to current time

## If You Still Get Errors

### "invalid_scope_error"
- Wait 5-10 minutes after enabling the product (LinkedIn needs time to propagate)
- Clear browser cache
- Try again

### "Invalid redirect_uri"
- Make sure the redirect URI in LinkedIn app matches EXACTLY
- Must be: `https://ld-luci.vercel.app/api/linkedin-auth`
- No trailing slash, exact case

### Other Errors
- Check Vercel deployment logs
- Verify the endpoint is deployed: `https://ld-luci.vercel.app/api/linkedin-auth`

## Once OAuth Works

After the token is stored:
1. LinkedIn enrichment will work automatically
2. We can re-enable the enrichment calls in the UI
3. Contacts will be enriched with LinkedIn profile data

