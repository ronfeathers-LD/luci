# Google Calendar Integration Setup Guide

This guide will help you set up Google Calendar integration for the LUCI application.

## Prerequisites

1. ✅ Google Cloud Project with Calendar API enabled
2. ✅ OAuth 2.0 Client ID and Client Secret
3. ✅ Supabase database with migration `018_add_google_calendar_tables.sql` applied

## Step 1: Create Google Cloud Project and Enable Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Google Calendar API"
   - Click **Enable**

## Step 2: Add Calendar Scopes to Existing OAuth Client

Since you already have a Google OAuth client ID set up for user authentication, you can reuse it by adding Calendar scopes:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your existing OAuth 2.0 Client ID (the one used for Google Sign-In)
4. Click to edit it
5. **Add Authorized redirect URI** (if not already present):
   - Production: `https://your-app.vercel.app/api/google-calendar-auth`
   - Local dev: `http://localhost:3000/api/google-calendar-auth`
   - Click **+ ADD URI** for each, then **SAVE**
6. Go to **APIs & Services** → **OAuth consent screen**
7. Click **EDIT APP**
8. Under **Scopes**, click **ADD OR REMOVE SCOPES**
9. Add these scopes:
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar.events.readonly`
10. Click **UPDATE** and **SAVE**
11. If you need the **Client Secret**:
    - Go back to **Credentials**
    - Click on your OAuth client ID
    - The Client Secret should be visible (or click "Reset secret" if needed)
    - Copy the **Client Secret**

## Step 3: Run Database Migration

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Copy the contents of `supabase/migrations/018_add_google_calendar_tables.sql`
4. Paste and run the SQL
5. Verify tables were created:
   - `google_calendar_tokens` - Stores OAuth tokens per user
   - `google_calendar_events` - Caches calendar events
   - `calendar_event_account_matches` - Links events to Salesforce accounts

## Step 4: Set Environment Variables

Add these environment variables to your Vercel project (or `.env.local` for local development):

**Option A: Reuse Existing OAuth Client (Recommended)**
```bash
GOOGLE_CLIENT_ID=your-existing-client-id
GOOGLE_CLIENT_SECRET=your-existing-client-secret
GOOGLE_CALENDAR_REDIRECT_URI=https://your-app.vercel.app/api/google-calendar-auth
```

**Option B: Use Separate OAuth Client (if you prefer)**
```bash
GOOGLE_CALENDAR_CLIENT_ID=your-calendar-client-id
GOOGLE_CALENDAR_CLIENT_SECRET=your-calendar-client-secret
GOOGLE_CALENDAR_REDIRECT_URI=https://your-app.vercel.app/api/google-calendar-auth
```

**Note:** The code will automatically use `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` if the Calendar-specific variables are not set, so you can reuse your existing OAuth client.

**For Vercel:**
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add the three variables above
4. Redeploy your application

**For Local Development:**
1. Create or update `.env.local` file in the project root
2. Add the environment variables
3. Restart your development server

## Step 5: Install Dependencies

The `googleapis` package should already be in `package.json`. If not, install it:

```bash
npm install googleapis
```

## Step 6: Test the Integration

1. Deploy your application (or run locally)
2. Log in to the application
3. Navigate to **My Accounts** page (`/user`)
4. Click **Connect Calendar** button
5. Authorize the application to access your Google Calendar
6. You should see:
   - "Connected" status
   - Upcoming meetings section showing events for the next 7 days
   - Associated Salesforce accounts for each meeting (if matches are found)

## How It Works

### OAuth Flow
1. User clicks "Connect Calendar" on `/user` page
2. Redirects to Google OAuth consent screen
3. User authorizes access to their calendar
4. Google redirects back with authorization code
5. Server exchanges code for access token and refresh token
6. Tokens are stored in `google_calendar_tokens` table (per user)

### Event Fetching
1. When calendar is connected, the app fetches upcoming events (next 7 days)
2. Events are stored in `google_calendar_events` table
3. Events are matched to Salesforce accounts based on:
   - Account names in event title/description
   - Attendee email addresses matching contact emails

### Account Matching
Events are matched to accounts using:
- **High confidence**: Account name found in event title/description (word boundary matching)
- **High confidence**: Attendee email matches a contact email in Salesforce
- Matches are stored in `calendar_event_account_matches` table

## Troubleshooting

### "Google Calendar not configured" error
- Check that environment variables are set correctly
- Verify `GOOGLE_CALENDAR_CLIENT_ID` and `GOOGLE_CALENDAR_CLIENT_SECRET` are present
- Restart your server after adding environment variables

### "Google Calendar not authorized" error
- User needs to connect their calendar via the `/user` page
- Check that OAuth redirect URI matches exactly in Google Cloud Console
- Verify the Calendar API is enabled in Google Cloud Console

### No meetings showing up
- Check that user has upcoming events in their Google Calendar
- Verify the calendar is connected (should show "Connected" status)
- Check browser console for errors
- Verify user has accounts in their account list (matching requires accounts)

### Events not matching to accounts
- Ensure user has accounts in their account list
- Check that account names in Salesforce match names in calendar events
- Verify contacts have email addresses in Salesforce
- Check that attendee emails in calendar events match contact emails

## API Endpoints

- `GET /api/google-calendar-status?userId={userId}` - Check if calendar is connected
- `GET /api/google-calendar-auth?userId={userId}` - Initiate OAuth flow
- `GET /api/google-calendar-events?userId={userId}&days=7` - Fetch upcoming events
- `DELETE /api/google-calendar-auth` - Disconnect calendar (requires userId in body)

## Security Notes

- OAuth tokens are stored per-user in the database
- Tokens are encrypted in production (ensure Supabase encryption is enabled)
- Only calendar read-only access is requested
- Users can disconnect their calendar at any time
- Refresh tokens are used to automatically renew access tokens

