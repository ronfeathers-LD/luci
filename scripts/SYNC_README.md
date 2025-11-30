# Production to Local Database Sync

## Quick Setup

### 1. Create `.env.local.backup` file

```bash
# Production Supabase Credentials
PROD_SUPABASE_URL=https://your-project-id.supabase.co
PROD_SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
```

**Get credentials from:** Supabase Dashboard → Settings → API

### 2. Start Local Supabase

```bash
supabase start
```

### 3. Run Sync Script

```bash
node scripts/sync-prod-to-local.js
```

This will sync all data from production to local.

## What Gets Synced

All tables are synced in the correct dependency order:
- Users and roles
- Configuration tables
- Accounts and relationships
- All related data (cases, contacts, transcriptions, etc.)
- User-specific data (calendar tokens, login history)
- System settings

## Troubleshooting

- **"Credentials not found"**: Create `.env.local.backup` file (see Step 1)
- **"Connection refused"**: Make sure local Supabase is running (`supabase start`)
- **"Table doesn't exist"**: Run `supabase db reset` to apply all migrations

## Full Documentation

See `docs/EXPORT_PROD_TO_LOCAL.md` for complete guide including:
- Schema export methods
- pg_dump alternatives
- Troubleshooting tips

