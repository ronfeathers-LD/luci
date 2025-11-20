# Supabase Setup Guide

This guide will help you set up Supabase for the LUCI application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: LUCI (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Click "Create new project"
5. Wait for project to be provisioned (~2 minutes)

## Step 2: Run Database Migration

1. In your Supabase project, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. Verify tables were created:
   - Go to **Table Editor**
   - You should see: `users`, `accounts`, `user_accounts`

## Step 3: Get Supabase Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **service_role key** (under "Project API keys" → "service_role" - **keep this secret!**)

## Step 4: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `SUPABASE_URL` | Your Project URL from Step 3 | All (Production, Preview, Development) |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your service_role key from Step 3 | All (Production, Preview, Development) |

4. Click "Save"
5. **Important**: Redeploy your application for environment variables to take effect

## Step 5: Verify Setup

1. Deploy your application to Vercel
2. Sign in with Google OAuth
3. Check Supabase Dashboard → **Table Editor** → `users` table
4. You should see a new user record created

## Database Schema

### Users Table
- `id` (UUID) - Primary key
- `google_sub` (TEXT) - Google OAuth subject ID (unique)
- `email` (TEXT) - User email (unique)
- `name` (TEXT) - User display name
- `picture` (TEXT) - Profile picture URL
- `role` (TEXT) - User role (default: 'Account Manager')
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### Accounts Table
- `id` (UUID) - Primary key
- `salesforce_id` (TEXT) - Salesforce Account ID (unique)
- `name` (TEXT) - Account name
- `account_tier` (TEXT) - Account tier
- `contract_value` (TEXT) - Contract value
- `industry` (TEXT) - Industry
- `annual_revenue` (NUMERIC) - Annual revenue
- `owner_id` (TEXT) - Salesforce owner ID
- `owner_name` (TEXT) - Owner name
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### User Accounts Table (Many-to-Many)
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `account_id` (UUID) - Foreign key to accounts
- `assigned_at` (TIMESTAMP) - Assignment timestamp

## Populating Accounts

To populate accounts for testing:

1. Go to Supabase Dashboard → **Table Editor** → `accounts`
2. Click "Insert row"
3. Add account data:
   ```json
   {
     "salesforce_id": "001XX000004ABCD",
     "name": "Acme Corp",
     "account_tier": "Enterprise (Tier 1)",
     "contract_value": "$120,000/year",
     "industry": "Technology",
     "annual_revenue": 5000000,
     "owner_id": "user-id-here",
     "owner_name": "Sarah Johnson"
   }
   ```
4. Go to `user_accounts` table
5. Insert a relationship:
   ```json
   {
     "user_id": "user-uuid-from-users-table",
     "account_id": "account-uuid-from-accounts-table"
   }
   ```

## Security Notes

- **Never commit** `SUPABASE_SERVICE_ROLE_KEY` to Git
- The service role key bypasses Row Level Security (RLS)
- Use it only in serverless functions, never in client-side code
- Consider setting up RLS policies for additional security

## Troubleshooting

### "Supabase not configured" warning
- Check that environment variables are set in Vercel
- Verify variable names are exactly: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Redeploy after adding environment variables

### "User not found" errors
- Verify the migration ran successfully
- Check that users are being created in the `users` table
- Verify the `google_sub` field matches the Google OAuth subject

### "No accounts found"
- Verify accounts exist in the `accounts` table
- Check that `user_accounts` relationships are created
- Verify `user_id` matches the user's UUID (not Google sub)

## Next Steps

1. Set up Salesforce API integration to sync accounts
2. Create a sync job to periodically update accounts from Salesforce
3. Implement role-based account assignment logic
4. Add additional user fields as needed

