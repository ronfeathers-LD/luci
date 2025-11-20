# Salesforce Integration Setup Guide

This guide will help you set up Salesforce API integration for the LUCI application.

## Prerequisites

1. A Salesforce org (Production, Sandbox, or Developer Edition)
2. Admin access to create a Connected App (or existing Connected App credentials)
3. A user account for API access

## Option A: Use Existing Connected App Credentials

If you already have a Connected App set up for another integration, you can reuse those credentials!

### What You Need

1. **Consumer Key** (also called Client ID)
2. **Consumer Secret** (also called Client Secret)

### How to Find Your Existing Credentials

1. Log in to your Salesforce org
2. Go to **Setup** → **App Manager**
3. Find your existing Connected App
4. Click the dropdown arrow → **View**
5. Click **Manage Consumer Details**
6. Copy:
   - **Consumer Key** → This is your `SFDC_CLIENT_ID`
   - **Consumer Secret** → Click "Click to reveal" → This is your `SFDC_CLIENT_SECRET`

### Important Notes

- ✅ **You can reuse credentials** - Multiple apps can use the same Connected App
- ✅ **No changes needed** - Your existing Connected App will work as-is
- ⚠️ **OAuth Scopes** - Make sure your Connected App has these scopes enabled:
  - `Full access (full)` OR `Access and manage your data (api)`
  - `Perform requests on your behalf at any time (refresh_token, offline_access)`
- ⚠️ **IP Restrictions** - If your Connected App has IP restrictions, make sure Vercel's IPs are allowed (or use security tokens)

### Skip to Step 4

If using existing credentials, you can skip to **Step 4: Get User Credentials** below.

---

## Option B: Create a New Connected App

If you prefer to create a dedicated Connected App for LUCI:

## Step 1: Create a Connected App in Salesforce

1. Log in to your Salesforce org
2. Go to **Setup** (gear icon) → **Setup Home**
3. In Quick Find, search for "App Manager"
4. Click **New Connected App**
5. Fill in the basic information:
   - **Connected App Name**: `LUCI Integration`
   - **API Name**: `LUCI_Integration` (auto-filled)
   - **Contact Email**: Your email
6. Enable OAuth Settings:
   - Check **Enable OAuth Settings**
   - **Callback URL**: `https://your-vercel-app.vercel.app/api/salesforce-callback` (or any valid URL)
   - **Selected OAuth Scopes**: 
     - `Full access (full)`
     - `Perform requests on your behalf at any time (refresh_token, offline_access)`
     - `Access the identity URL service (id, profile, email, address, phone)`
7. Click **Save**
8. **Important**: Wait 2-10 minutes for the changes to propagate

## Step 2: Get Connected App Credentials

1. After saving, you'll see the Connected App details
2. Click **Manage Consumer Details**
3. Copy the following:
   - **Consumer Key** (this is your `SFDC_CLIENT_ID`)
   - **Consumer Secret** (this is your `SFDC_CLIENT_SECRET`) - Click "Click to reveal" to see it
4. Save these securely - you'll need them for environment variables

---

## Step 3: Create API User (Recommended)

For security, create a dedicated user for API access:

1. Go to **Setup** → **Users** → **Users**
2. Click **New User**
3. Fill in user details:
   - **First Name**: API
   - **Last Name**: User
   - **Email**: Use a real email (you'll need to verify it)
   - **Username**: `api-user@yourorg.com`
   - **Profile**: System Administrator (or custom profile with API access)
4. Click **Save**
5. After email verification, log in as this user
6. Go to **My Settings** → **Personal** → **Reset My Security Token**
7. Click **Reset Security Token**
8. Check the email for the security token (you'll need this)

---

## Step 4: Get User Credentials

You'll need:
- **Username**: The API user's username (e.g., `api-user@yourorg.com`)
- **Password**: The API user's password
- **Security Token**: From the email sent in Step 3

**Note**: If you're using a Sandbox, the username format is: `username@sandbox-name.sandbox`

---

## Step 5: Determine Login URL

- **Production**: `https://login.salesforce.com`
- **Sandbox**: `https://test.salesforce.com`
- **Custom Domain**: Your custom Salesforce domain URL

---

## Step 6: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   | Name | Value | Environment | Description |
   |------|-------|-------------|-------------|
   | `SFDC_USERNAME` | `api-user@yourorg.com` | All | Salesforce username |
   | `SFDC_PASSWORD` | `your-password` | All | Salesforce password |
   | `SFDC_SECURITY_TOKEN` | `token-from-email` | All | Security token (if using) |
   | `SFDC_CLIENT_ID` | `Consumer Key` | All | From Connected App |
   | `SFDC_CLIENT_SECRET` | `Consumer Secret` | All | From Connected App |
   | `SFDC_LOGIN_URL` | `https://login.salesforce.com` | All | Login URL (optional, defaults to production) |

4. Click **Save** for each variable
5. **Important**: Redeploy your application for environment variables to take effect

---

## Step 7: Verify Salesforce Fields

The integration expects these fields on the Account object:

- `Id` (standard)
- `Name` (standard)
- `Account_Tier__c` (custom field - create if needed)
- `Contract_Value__c` (custom field - create if needed)
- `Industry` (standard)
- `AnnualRevenue` (standard)
- `OwnerId` (standard)
- `Owner.Name` (standard)

### Creating Custom Fields (if needed)

1. Go to **Setup** → **Object Manager** → **Account**
2. Click **Fields & Relationships** → **New**
3. Create fields:
   - **Account_Tier__c**: Text (255) - e.g., "Enterprise (Tier 1)"
   - **Contract_Value__c**: Text (255) - e.g., "$120,000/year"
4. Add fields to Account page layouts

---

## Step 8: Test the Integration

1. Deploy your application to Vercel
2. Sign in with Google OAuth
3. The app should automatically:
   - Authenticate with Salesforce
   - Query accounts based on your user's role
   - Sync accounts to Supabase
   - Display accounts in the dropdown

---

## Troubleshooting

### "Salesforce credentials not configured"
- Verify all environment variables are set in Vercel
- Check variable names are exact (case-sensitive)
- Redeploy after adding variables

### "Salesforce authentication failed: 400"
- Verify username and password are correct
- Check if security token is needed (IP restrictions)
- Verify Connected App is activated (wait 2-10 minutes)
- Check if user account is active

### "Salesforce authentication failed: 401"
- Invalid credentials
- Security token might be wrong
- User might be locked out

### "Salesforce query failed: 403"
- User doesn't have permission to query Account object
- Check user profile/permission set
- Verify field-level security settings

### "No accounts found"
- User might not own any accounts
- Check AccountTeamMember relationships
- Verify SOQL query matches your org structure
- Check sharing rules

### "INVALID_FIELD" errors
- Custom fields might not exist in your org
- Field API names might be different
- Check field-level security

---

## Using Existing Connected App - Quick Reference

If you're reusing existing credentials, here's what you need:

| Environment Variable | Where to Find It |
|---------------------|------------------|
| `SFDC_CLIENT_ID` | Connected App → Manage Consumer Details → Consumer Key |
| `SFDC_CLIENT_SECRET` | Connected App → Manage Consumer Details → Consumer Secret (click to reveal) |
| `SFDC_USERNAME` | Your API user's username |
| `SFDC_PASSWORD` | Your API user's password |
| `SFDC_SECURITY_TOKEN` | From "Reset Security Token" email (if using IP restrictions) |
| `SFDC_LOGIN_URL` | `https://login.salesforce.com` (production) or `https://test.salesforce.com` (sandbox) |

**That's it!** No need to create a new Connected App if you already have one.

---

## SOQL Query Customization

The default query in `api/salesforce-accounts.js` queries accounts where:
- User is the owner, OR
- User is a team member

You can customize the query based on your org's sharing rules:

```javascript
// Example: Query by territory
soqlQuery = `
  SELECT Id, Name, Account_Tier__c, Contract_Value__c, Industry, 
         AnnualRevenue, OwnerId, Owner.Name, Owner.Email
  FROM Account
  WHERE Owner.Territory__c = '${userTerritory}'
  ORDER BY Name
  LIMIT 100
`;

// Example: Query by role hierarchy
soqlQuery = `
  SELECT Id, Name, Account_Tier__c, Contract_Value__c, Industry, 
         AnnualRevenue, OwnerId, Owner.Name, Owner.Email
  FROM Account
  WHERE OwnerId IN (
    SELECT Id FROM User WHERE UserRoleId IN (
      SELECT Id FROM UserRole WHERE DeveloperName = '${userRole}'
    )
  )
  ORDER BY Name
  LIMIT 100
`;
```

## Security Best Practices

1. **Use a dedicated API user** - Don't use your personal account
2. **Restrict IP ranges** - In Connected App settings, restrict to Vercel IPs
3. **Use least privilege** - Give API user only necessary permissions
4. **Rotate credentials** - Change password and security token periodically
5. **Monitor API usage** - Check Setup → Monitoring → API Usage
6. **Use Sandbox for testing** - Test integration in Sandbox first

## Next Steps

1. Set up periodic sync job to keep accounts updated
2. Implement account assignment logic based on your business rules
3. Add error handling and retry logic for API failures
4. Set up monitoring and alerts for integration health

