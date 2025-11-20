# Quick Setup Guide - LeanData Salesforce Integration

Based on your existing credentials, here's what you need to complete the setup.

## What You Have ✅

- **Login URL**: `https://leandata.my.salesforce.com`
- **Username**: `sow.app.integration@leandata.com`
- **Security Token**: `o7VFJrMqGhCn8nu0DZuxLtIw`

## What You Still Need 🔑

### 1. Consumer Key & Consumer Secret

Since you mentioned you already have API access on another app, you need to get the Connected App credentials:

1. Log in to Salesforce at https://leandata.my.salesforce.com
2. Go to **Setup** (gear icon) → **App Manager**
3. Find your existing Connected App (the one you're using for other integrations)
4. Click the dropdown arrow → **View**
5. Click **Manage Consumer Details**
6. Copy:
   - **Consumer Key** → This will be your `SFDC_CLIENT_ID`
   - **Consumer Secret** → Click "Click to reveal" → This will be your `SFDC_CLIENT_SECRET`

### 2. Password for API User

You'll need the password for `sow.app.integration@leandata.com`. If you don't have it:
- Check with your Salesforce admin
- Or reset it: **Setup** → **Users** → Find the user → **Reset Password**

## Environment Variables for Vercel

Once you have all the credentials, add these to Vercel:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `SFDC_LOGIN_URL` | `https://leandata.my.salesforce.com` | Your custom domain |
| `SFDC_USERNAME` | `sow.app.integration@leandata.com` | Your API username |
| `SFDC_PASSWORD` | `[password for sow.app.integration@leandata.com]` | The user's password |
| `SFDC_SECURITY_TOKEN` | `o7VFJrMqGhCn8nu0DZuxLtIw` | Your security token |
| `SFDC_CLIENT_ID` | `[Consumer Key from Connected App]` | From Step 1 above |
| `SFDC_CLIENT_SECRET` | `[Consumer Secret from Connected App]` | From Step 1 above |

## Important Notes

1. **Password + Security Token**: When using IP restrictions, Salesforce requires `password + security_token` combined. The code handles this automatically.

2. **Custom Domain**: Your login URL `https://leandata.my.salesforce.com` is a custom domain. The OAuth endpoint will be:
   ```
   https://leandata.my.salesforce.com/services/oauth2/token
   ```

3. **OAuth Scopes**: Make sure your existing Connected App has these scopes:
   - `Full access (full)` OR `Access and manage your data (api)`
   - `Perform requests on your behalf at any time (refresh_token, offline_access)`

## Testing

After setting up the environment variables:

1. Deploy to Vercel (or redeploy if variables were added)
2. Sign in with Google OAuth
3. The app should automatically:
   - Authenticate with Salesforce using your credentials
   - Query accounts for the logged-in user
   - Display accounts in the dropdown

## Troubleshooting

### "Salesforce authentication failed: 400"
- Verify the password is correct for `sow.app.integration@leandata.com`
- Check that security token is correct
- Make sure you're using the full password (not password + token - the code adds the token)

### "Salesforce authentication failed: 401"
- Invalid credentials
- User might be locked out
- Check if the user account is active

### "No accounts found"
- The user `sow.app.integration@leandata.com` might not own any accounts
- Check AccountTeamMember relationships
- Verify the SOQL query matches your org structure

## Next Steps

1. ✅ Get Consumer Key/Secret from existing Connected App
2. ✅ Get password for `sow.app.integration@leandata.com`
3. ✅ Add all environment variables to Vercel
4. ✅ Redeploy application
5. ✅ Test the integration

