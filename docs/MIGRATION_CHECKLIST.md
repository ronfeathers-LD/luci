# Database Migration Checklist

This document lists all database migrations and helps you verify which ones need to be run in production.

## How to Check Which Migrations Have Been Run

### Option 1: Check Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Database** → **Migrations**
3. Check which migrations are listed as applied

### Option 2: Check Database Directly
Run this query in Supabase SQL Editor to see which tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

## All Migrations (in order)

### Core Schema
- ✅ **001_initial_schema.sql** - Initial tables (users, accounts, user_accounts)
- ✅ **002_add_salesforce_configs.sql** - Salesforce configuration table
- ✅ **003_add_last_synced_at.sql** - Adds `last_synced_at` to accounts table

### Data Sources
- ✅ **004_add_avoma_tables.sql** - Avoma configs and transcriptions table
- ✅ **005_add_cases_table.sql** - Salesforce cases/tickets table
- ✅ **006_add_contacts_table.sql** - Salesforce contacts table
- ✅ **007_add_sentiment_history.sql** - Sentiment analysis history table

### Enrichment & Extensions
- ✅ **008_add_linkedin_tables.sql** - LinkedIn profiles and company engagement
- ✅ **009_add_linkedin_url_to_contacts.sql** - Adds LinkedIn URL to contacts
- ✅ **010_add_apollo_configs.sql** - Apollo.io configuration table
- ✅ **011_add_extended_contact_fields.sql** - Additional contact fields
- ✅ **012_add_apollo_enrichment_fields.sql** - Apollo enrichment fields for LinkedIn profiles

### Enhancements
- ✅ **013_add_case_contact_fields.sql** - Contact fields for cases (contact_email, contact_id, contact_name)
- ✅ **014_add_comprehensive_analysis_to_sentiment.sql** - Comprehensive analysis column
- ✅ **015_add_input_hash_to_sentiment.sql** - Input hash for duplicate detection

### Roles & Permissions
- ✅ **016_add_roles_system.sql** - Roles and user_roles tables
- ✅ **017_assign_admin_role_to_existing_user.sql** - Assigns admin role to existing user (if needed)

### Google Calendar Integration
- ⚠️ **018_add_google_calendar_tables.sql** - **NEW - Google Calendar integration tables**

## Migration 018 Details (Google Calendar)

This migration creates three new tables:

1. **google_calendar_tokens** - Stores OAuth tokens per user
2. **google_calendar_events** - Caches calendar events
3. **calendar_event_account_matches** - Links events to Salesforce accounts

### To Apply Migration 018:

**Option A: Via Supabase Dashboard**
1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/migrations/018_add_google_calendar_tables.sql`
3. Paste and run in SQL Editor

**Option B: Via Supabase CLI** (if you have it set up)
```bash
supabase db push
```

### Verification Query

After running migration 018, verify the tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'google_calendar_tokens',
    'google_calendar_events', 
    'calendar_event_account_matches'
  )
ORDER BY table_name;
```

Should return 3 rows.

## Quick Check Script

Run this in Supabase SQL Editor to see what's missing:

```sql
-- Check for Google Calendar tables (migration 018)
SELECT 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'google_calendar_tokens'
  ) THEN '✅ google_calendar_tokens exists' 
  ELSE '❌ google_calendar_tokens MISSING' END as status
UNION ALL
SELECT 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'google_calendar_events'
  ) THEN '✅ google_calendar_events exists' 
  ELSE '❌ google_calendar_events MISSING' END
UNION ALL
SELECT 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'calendar_event_account_matches'
  ) THEN '✅ calendar_event_account_matches exists' 
  ELSE '❌ calendar_event_account_matches MISSING' END;
```

## Migration Safety

All migrations use `IF NOT EXISTS` clauses, so they're safe to run multiple times. However, it's best practice to:
1. Check which migrations have already been applied
2. Only run the ones that are missing
3. Test in a staging environment first if possible

