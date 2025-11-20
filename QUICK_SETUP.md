# Quick Setup Guide - LeanData Salesforce Integration

Based on your existing credentials, here's what you need to complete the setup.

## What You Have ✅

- **Login URL**: `https://leandata.my.salesforce.com`
- **Username**: `sow.app.integration@leandata.com`
- **Password**: ✅ You have this
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

✅ **You have the password** - Make sure to add it to Vercel environment variables (see below).

⚠️ **Security Note**: Never commit passwords to git. Only add them to Vercel environment variables.

## Environment Variables for Vercel

**Ready to configure!** Add these to your Vercel project:

Once you have all the credentials, add these to Vercel:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `SFDC_LOGIN_URL` | `https://leandata.my.salesforce.com` | Your custom domain |
| `SFDC_USERNAME` | `sow.app.integration@leandata.com` | Your API username |
| `SFDC_PASSWORD` | `S0wP@ssw0rd` | ⚠️ Add this in Vercel only, not in git |
| `SFDC_SECURITY_TOKEN` | `o7VFJrMqGhCn8nu0DZuxLtIw` | Your security token |
| `SFDC_CLIENT_ID` | `[Consumer Key from Connected App]` | Get from existing Connected App |
| `SFDC_CLIENT_SECRET` | `[Consumer Secret from Connected App]` | Get from existing Connected App |

### Steps to Add in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New** for each variable above
4. For each variable:
   - Paste the **Name** (exactly as shown)
   - Paste the **Value** (use the password `S0wP@ssw0rd` for `SFDC_PASSWORD`)
   - Select **All** environments (Production, Preview, Development)
   - Click **Save**
5. **Important**: After adding all variables, redeploy your application

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

1. ✅ Get Consumer Key/Secret from existing Connected App (see Step 1 above)
2. ✅ Password is ready: `S0wP@ssw0rd`
3. ⏳ Add all environment variables to Vercel (see table above)
4. ⏳ Redeploy application after adding variables
5. ⏳ Test the integration

## Quick Checklist

- [ ] Get Consumer Key from existing Connected App
- [ ] Get Consumer Secret from existing Connected App  
- [ ] Add `SFDC_LOGIN_URL` = `https://leandata.my.salesforce.com`
- [ ] Add `SFDC_USERNAME` = `sow.app.integration@leandata.com`
- [ ] Add `SFDC_PASSWORD` = `S0wP@ssw0rd`
- [ ] Add `SFDC_SECURITY_TOKEN` = `o7VFJrMqGhCn8nu0DZuxLtIw`
- [ ] Add `SFDC_CLIENT_ID` = `[from Connected App]`
- [ ] Add `SFDC_CLIENT_SECRET` = `[from Connected App]`
- [ ] Redeploy application
- [ ] Test by signing in and checking if accounts load

