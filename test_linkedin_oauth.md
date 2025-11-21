# Test LinkedIn OAuth Flow

## Step 1: Wait for Changes to Propagate
LinkedIn changes can take 5-10 minutes to fully propagate. If you just enabled the product, wait a few minutes.

## Step 2: Clear Browser Cache
- Clear your browser cache or use an incognito/private window
- This ensures you're not using cached OAuth state

## Step 3: Test the OAuth Flow

1. **Visit the OAuth endpoint:**
   ```
   https://ld-luci.vercel.app/api/linkedin-auth
   ```

2. **Expected flow:**
   - You should be redirected to LinkedIn
   - LinkedIn should show an authorization page (not an error)
   - The page should ask you to "Allow" or "Authorize" the app
   - After clicking "Allow", you'll be redirected back
   - You should see a success page: "LinkedIn OAuth Successful!"

## Step 4: Verify Token Was Stored

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

## If It Still Fails

If you still get `invalid_scope_error`:
1. Wait a few more minutes (LinkedIn can be slow to propagate)
2. Double-check the product shows as "Active" or "Enabled"
3. Verify the redirect URI matches exactly in both places:
   - LinkedIn app settings: `https://ld-luci.vercel.app/api/linkedin-auth`
   - Database: `https://ld-luci.vercel.app/api/linkedin-auth`

## Success!

Once the token is stored, LinkedIn profile enrichment will work automatically when contacts are fetched!

