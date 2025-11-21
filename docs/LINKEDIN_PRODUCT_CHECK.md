# LinkedIn Product Check - Fix invalid_scope_error

## Problem
You're getting `invalid_scope_error` because the required LinkedIn product is not enabled.

## Solution

### Step 1: Enable "Sign In with LinkedIn using OpenID Connect"

1. **Go to LinkedIn Developer Portal:**
   - Visit: https://www.linkedin.com/developers/apps
   - Sign in with your LinkedIn account

2. **Select Your App:**
   - Find your app (Client ID: `86vb3srl5hijb5`)
   - Click on it to open

3. **Go to Products Tab:**
   - Click on the **"Products"** tab in the left sidebar

4. **Add "Sign In with LinkedIn using OpenID Connect":**
   - Look for **"Sign In with LinkedIn using OpenID Connect"**
   - If you see it listed but not enabled:
     - Click on it
     - Click **"Request access"** or **"Add product"**
     - Follow any approval process if required
   - If you don't see it:
     - You may need to create a new app
     - Or contact LinkedIn support

5. **Verify Product is Enabled:**
   - After adding, you should see it listed as "Active" or "Enabled"
   - The product status should show as approved/active

### Step 2: Verify Redirect URI

Make sure your redirect URI is added in the **Auth** tab:
- `https://ld-luci.vercel.app/api/linkedin-auth`

### Step 3: Test Again

Once the product is enabled:
1. Visit: `https://ld-luci.vercel.app/api/linkedin-auth`
2. You should be redirected to LinkedIn
3. LinkedIn should show the authorization screen (not an error)
4. After clicking "Allow", you'll be redirected back with a token

## Common Issues

### "Product not available"
- Some products require approval from LinkedIn
- You may need to wait for approval
- Or use a different authentication method

### "Request access" button doesn't work
- Try refreshing the page
- Check if you're logged in with the correct LinkedIn account
- Verify you have admin access to the app

### Still getting invalid_scope_error after enabling product
- Wait a few minutes for changes to propagate
- Clear browser cache and try again
- Verify the product shows as "Active" or "Enabled"

## Alternative: Use Basic Profile API (if OpenID Connect not available)

If you cannot enable "Sign In with LinkedIn using OpenID Connect", you may need to:
1. Use the older v2 API endpoints
2. Request different scopes (if your app has access)
3. Contact LinkedIn support for product access

## Need Help?

If you continue to have issues:
1. Check LinkedIn Developer Portal status
2. Review LinkedIn API documentation
3. Contact LinkedIn Developer Support

