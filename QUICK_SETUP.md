# Quick Setup Guide - LeanData Salesforce Integration

Based on your existing credentials and matching SOW-Generator setup.

## What You Have ✅

- **Login URL**: `https://leandata.my.salesforce.com`
- **Username**: `sow.app.integration@leandata.com`
- **Password**: `S0wP@ssw0rd`
- **Security Token**: `o7VFJrMqGhCn8nu0DZuxLtIw`

## Good News! 🎉

**You don't need Client ID/Secret anymore!** 

LUCI now uses the same approach as SOW-Generator:
- Uses `jsforce` library (handles OAuth internally)
- Stores credentials in Supabase `salesforce_configs` table
- No Client ID/Secret needed!

## Setup Steps

### 1. Run Database Migration

Add the `salesforce_configs` table to your Supabase:

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this SQL:

```sql
-- Salesforce configs table (same as SOW-Generator)
CREATE TABLE IF NOT EXISTS salesforce_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  security_token TEXT,
  login_url TEXT DEFAULT 'https://login.salesforce.com',
  is_active BOOLEAN DEFAULT true,
  last_tested TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_salesforce_configs_is_active ON salesforce_configs(is_active);

-- Enable RLS
ALTER TABLE salesforce_configs ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access" ON salesforce_configs
  FOR ALL USING (true);
```

### 2. Insert Salesforce Credentials

In Supabase SQL Editor, run:

```sql
INSERT INTO salesforce_configs (username, password, security_token, login_url, is_active)
VALUES (
  'sow.app.integration@leandata.com',
  'S0wP@ssw0rd',
  'o7VFJrMqGhCn8nu0DZuxLtIw',
  'https://leandata.my.salesforce.com',
  true
);
```

### 3. Install jsforce Dependency

The code now uses `jsforce` (same as SOW-Generator). Make sure it's installed:

```bash
npm install jsforce
```

Or it will be installed automatically when Vercel builds.

### 4. That's It! 🎉

No environment variables needed in Vercel for Salesforce! Everything is stored in Supabase.

## How It Works

1. **Credentials stored in Supabase** - Same table structure as SOW-Generator
2. **jsforce handles OAuth** - No Client ID/Secret needed
3. **Automatic authentication** - Code fetches config from Supabase and authenticates
4. **Same credentials** - You can use the exact same credentials as SOW-Generator

## Testing

1. Deploy to Vercel
2. Sign in with Google OAuth
3. The app should automatically:
   - Fetch Salesforce config from Supabase
   - Authenticate with Salesforce using jsforce
   - Query accounts for the logged-in user
   - Display accounts in the dropdown

## Troubleshooting

### "Salesforce configuration not found in Supabase"
- Make sure you ran the migration SQL
- Verify the `salesforce_configs` table exists
- Check that `is_active = true` for your config

### "jsforce library not available"
- Make sure `jsforce` is in `package.json` dependencies
- Redeploy to Vercel after adding the dependency

### "Salesforce authentication failed"
- Verify username and password are correct
- Check that security token is correct
- Make sure login_url is `https://leandata.my.salesforce.com`

### "No accounts found"
- The user might not own any accounts
- Check AccountTeamMember relationships
- Verify the SOQL query matches your org structure

## Benefits of This Approach

✅ **No Client ID/Secret needed** - jsforce handles OAuth internally  
✅ **Same as SOW-Generator** - Consistent approach across projects  
✅ **Credentials in Supabase** - Easy to manage and update  
✅ **No Vercel env vars** - One less thing to configure  
✅ **Reuse credentials** - Same credentials as SOW-Generator
