# Export Production Database to Local

This guide explains how to export all data and schema from your production Supabase database and import it into your local Supabase instance.

## Method 1: Automated Data Sync Script (Recommended)

The `sync-prod-to-local.js` script automatically syncs all data from production to local.

### Prerequisites

1. **Local Supabase must be running:**
   ```bash
   supabase start
   ```

2. **Ensure all migrations are applied to local:**
   ```bash
   # If you need to reset and reapply all migrations
   supabase db reset
   ```

### Step 1: Set Up Production Credentials

Create a file `.env.local.backup` in your project root:

```bash
# Production Supabase Credentials
PROD_SUPABASE_URL=https://your-project-id.supabase.co
PROD_SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
```

**To get your production credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your production project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `PROD_SUPABASE_URL`
   - **service_role key** (under Project API keys) → `PROD_SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important:** The `service_role` key has admin access. Keep it secure and never commit it to git.

### Step 2: Run the Sync Script

```bash
node scripts/sync-prod-to-local.js
```

The script will:
1. Connect to production Supabase
2. Connect to local Supabase
3. Fetch all data from production tables
4. Clear local tables
5. Insert production data into local tables

**Tables synced (in correct dependency order):**
- `users`
- `salesforce_configs`, `avoma_configs`, `linkedin_configs`
- `roles`, `user_roles`
- `accounts`, `user_accounts`
- `transcriptions`, `cases`, `contacts`, `sentiment_history`, `linkedin_profiles`
- `google_calendar_tokens`, `google_calendar_events`, `user_logins`
- `system_settings`

### Step 3: Verify the Sync

1. **Check local database in Supabase Studio:**
   ```bash
   supabase studio
   ```
   Or visit: http://127.0.0.1:54333

2. **Run a quick query:**
   ```sql
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM accounts;
   ```

## Method 2: Complete Schema + Data Export with pg_dump

For a complete database dump including schema, use PostgreSQL's `pg_dump` tool.

### Prerequisites

- PostgreSQL client tools installed (`pg_dump`, `psql`)
- Connection string for both production and local databases

### Step 1: Get Production Database Connection String

1. Go to Supabase Dashboard → Your Project → **Settings** → **Database**
2. Under "Connection string", select "URI" tab
3. Copy the connection string (it will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
4. Replace `[YOUR-PASSWORD]` with your actual database password (found in Settings → Database → Database password)

### Step 2: Get Local Database Connection String

When local Supabase is running (`supabase start`), the connection details are:

```
Host: 127.0.0.1
Port: 54322
Database: postgres
User: postgres
Password: postgres
```

Connection string: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

### Step 3: Export from Production

**Option A: Export data only (INSERT statements):**
```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  --data-only \
  --no-owner \
  --no-acl \
  --column-inserts \
  -f prod-data-only.sql
```

**Option B: Export schema + data (complete dump):**
```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  --no-owner \
  --no-acl \
  -f prod-complete.sql
```

**Option C: Export specific tables only:**
```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  --data-only \
  --no-owner \
  --no-acl \
  --table=users \
  --table=accounts \
  --table=user_accounts \
  -f prod-specific-tables.sql
```

### Step 4: Reset Local Database (Optional)

If you want a clean slate:

```bash
supabase db reset
```

This will:
- Drop all tables
- Reapply all migrations from `supabase/migrations/`
- Create a fresh schema

### Step 5: Import into Local

**If you exported data-only:**
```bash
# First ensure schema exists (migrations should already be applied)
supabase db reset

# Then import data
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" < prod-data-only.sql
```

**If you exported complete dump:**
```bash
# This will replace everything
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" < prod-complete.sql
```

⚠️ **Warning:** Complete dumps may include Supabase-specific tables and functions that might conflict. Use data-only dumps for safety.

## Method 3: Using Supabase CLI (Alternative)

Supabase CLI provides commands for database operations:

```bash
# Link to production project (one-time setup)
supabase link --project-ref your-project-ref

# Pull schema from production (migrations)
supabase db pull

# Note: Supabase CLI doesn't have a built-in data sync command,
# so use Method 1 (sync script) or Method 2 (pg_dump) for data.
```

## Troubleshooting

### "Table doesn't exist" errors

**Solution:** Ensure all migrations are applied to local:
```bash
supabase db reset
```

### Foreign key constraint errors

**Solution:** The sync script handles table ordering automatically. If using `pg_dump`, import in dependency order or disable foreign key checks temporarily:
```sql
SET session_replication_role = 'replica';
-- Import your data here
SET session_replication_role = 'origin';
```

### Connection refused errors

**Solution:** Ensure local Supabase is running:
```bash
supabase status
# If not running:
supabase start
```

### Permission errors

**Solution:** Make sure you're using the `service_role` key for production, not the `anon` key.

## Important Notes

1. **Schema vs Data:**
   - **Schema** (table structures) is managed by migrations in `supabase/migrations/`
   - **Data** is synced using the sync script or `pg_dump`

2. **Sensitive Data:**
   - OAuth tokens and API keys will be copied from production
   - Be careful with local database dumps - they contain sensitive information
   - Never commit `.env.local.backup` or database dumps to git

3. **Large Databases:**
   - For very large databases, consider syncing specific tables or using filters
   - The sync script can be modified to add WHERE clauses for filtering

4. **Regular Syncs:**
   - Keep production data fresh in local by running sync script regularly
   - Consider automating with a cron job or GitHub Action

## Quick Reference

```bash
# Start local Supabase
supabase start

# Check status
supabase status

# Reset local database (reapply migrations)
supabase db reset

# Open Supabase Studio
supabase studio

# Sync production data to local
node scripts/sync-prod-to-local.js
```

