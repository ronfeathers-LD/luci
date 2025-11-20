# Avoma API Integration Setup Guide

This guide will help you set up Avoma API integration for L.U.C.I.

## Prerequisites

1. An Avoma account with API access
2. Avoma API key

## Step 1: Get Your Avoma API Key

1. Log in to your Avoma account
2. Go to **Settings** → **Integrations** → **API**
3. Generate or copy your API key
4. Note your API base URL (usually `https://api.avoma.com/v1`)

## Step 2: Run Database Migration

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Copy the contents of `supabase/migrations/004_add_avoma_tables.sql`
4. Paste and run the SQL
5. Verify tables were created:
   - `avoma_configs` - Stores API credentials
   - `transcriptions` - Caches transcriptions

## Step 3: Insert Avoma Credentials

In Supabase SQL Editor, run:

```sql
INSERT INTO avoma_configs (api_key, api_url, is_active)
VALUES (
  'nrkxhy5b5g:n6jp7yy57r2deudcsgr3',
  'https://api.avoma.com/v1',
  true
);
```

**Note:** Only one active config should exist. If you need to update:
```sql
-- Deactivate old configs
UPDATE avoma_configs SET is_active = false WHERE is_active = true;

-- Insert new config
INSERT INTO avoma_configs (api_key, api_url, is_active)
VALUES ('new-api-key', 'https://api.avoma.com/v1', true);
```

## Step 4: How It Works

### Caching Strategy

1. **Check Cache First** - Looks for cached transcription in `transcriptions` table
2. **Cache TTL** - Transcriptions are cached for 24 hours
3. **Smart Refresh** - Only calls Avoma API if:
   - Cache is missing
   - Cache is stale (>24 hours old)
   - `forceRefresh=true` parameter is used

### API Endpoint

**POST `/api/avoma-transcription`**

Request body:
```json
{
  "customerIdentifier": "Acme Corp",
  "salesforceAccountId": "001XX000004ABCD", // Optional
  "meetingUuid": "uuid-here", // Optional - direct meeting UUID
  "forceRefresh": false // Optional - bypass cache
}
```

Response:
```json
{
  "transcription": "Speaker 1: Hello...",
  "speakers": [...],
  "meeting": {
    "subject": "Q4 Review",
    "meeting_date": "2024-11-15T10:00:00Z",
    "duration": 3600,
    "url": "https://app.avoma.com/meetings/...",
    "attendees": [...]
  },
  "cached": true,
  "last_synced_at": "2024-11-20T12:00:00Z"
}
```

## Step 5: How Transcriptions Are Cached

When a transcription is fetched from Avoma:
1. Stored in `transcriptions` table with:
   - `avoma_meeting_uuid` (unique identifier)
   - `customer_identifier` (for searching)
   - `salesforce_account_id` (if available)
   - Full transcription text
   - Speaker information (JSON)
   - Meeting metadata
   - `last_synced_at` timestamp

2. Subsequent requests check cache first:
   - If cache is fresh (<24 hours), return cached data
   - If cache is stale, refresh from Avoma
   - If no cache exists, fetch from Avoma

## Step 6: Testing

1. Deploy to Vercel
2. Sign in with Google
3. Select an account
4. Enter customer identifier
5. Click "Analyze Sentiment"
6. First call will fetch from Avoma and cache
7. Subsequent calls within 24 hours will use cache

## Troubleshooting

### "Avoma configuration not found"
- Verify `avoma_configs` table exists
- Check that `is_active = true` for your config
- Verify API key is correct

### "No meetings with ready transcripts found"
- Customer name might not match Avoma records
- Transcripts might not be ready yet
- Try using `salesforceAccountId` instead

### "Transcript is not ready for this meeting"
- Avoma is still processing the transcription
- Wait a few minutes and try again
- Check Avoma dashboard for processing status

### Cache not working
- Verify `transcriptions` table exists
- Check `last_synced_at` is being updated
- Verify cache TTL logic (24 hours)

## API Rate Limits

Avoma API has rate limits. The caching strategy helps minimize API calls:
- **First request**: Calls Avoma API
- **Subsequent requests (within 24h)**: Uses cache (no API call)
- **After 24 hours**: Refreshes from Avoma API

## Best Practices

1. **Use Salesforce Account ID** - More reliable than customer name matching
2. **Cache is automatic** - No need to manually manage
3. **Force refresh when needed** - Use `forceRefresh=true` to bypass cache
4. **Monitor cache hit rate** - Check `cached: true/false` in responses

