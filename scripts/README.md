# LUCI Scripts

Helper scripts for managing the LUCI application.

## sync-prod-to-local.js

Syncs data from production Supabase to local Supabase database.

### Usage

```bash
node scripts/sync-prod-to-local.js
```

### What it does

1. Connects to production Supabase (using credentials from `.env.local.backup`)
2. Fetches data from all key tables:
   - `users`
   - `salesforce_configs`
   - `avoma_configs`
   - `linkedin_configs`
   - `accounts`
   - `user_accounts`
   - `transcriptions`
   - `cases`
   - `contacts`
   - `sentiment_history`
   - `linkedin_profiles`
3. Clears local tables
4. Inserts production data into local database

### Prerequisites

- Local Supabase must be running: `supabase start`
- Production Supabase credentials must be available (stored in script)

### Notes

- The script uses `ON CONFLICT DO NOTHING` to avoid errors on duplicate keys
- Tables are cleared before inserting new data
- Foreign key dependencies are respected by syncing tables in order

## db-local.sh

Manages the local Supabase instance.

### Usage

```bash
./scripts/db-local.sh <command>
```

### Commands

- `start` - Start local Supabase
- `stop` - Stop local Supabase
- `status` - Show Supabase status
- `reset` - Reset database (reapply migrations)
- `studio` - Open Supabase Studio

