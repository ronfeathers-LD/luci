# LinkedIn API Integration Setup

## Prerequisites

1. ✅ LinkedIn Developer Account
2. ✅ Client ID and Client Secret
3. ✅ LinkedIn App created in Developer Portal

## Salesforce Field

The LinkedIn URL is stored in Salesforce Contacts in the field: **`Person_LinkedIn__c`**

This field is automatically fetched when contacts are synced from Salesforce.

## Step 1: Run Database Migration

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Copy the contents of `supabase/migrations/008_add_linkedin_tables.sql`
4. Paste and run the SQL
5. Verify tables were created:
   - `linkedin_configs` - Stores API credentials
   - `linkedin_profiles` - Caches LinkedIn profile data
   - `linkedin_company_engagement` - Stores engagement metrics

## Step 2: Insert LinkedIn Credentials

In Supabase SQL Editor, run:

```sql
-- Insert LinkedIn API credentials
INSERT INTO linkedin_configs (client_id, client_secret, redirect_uri, is_active)
VALUES (
  'YOUR_CLIENT_ID_HERE',
  'YOUR_CLIENT_SECRET_HERE',
  'https://your-app.vercel.app/api/linkedin-callback', -- OAuth redirect URI
  true
);
```

**Important:** Replace `YOUR_CLIENT_ID_HERE` and `YOUR_CLIENT_SECRET_HERE` with your actual credentials.

## Step 3: Configure OAuth Redirect URI

1. Go to LinkedIn Developer Portal: https://www.linkedin.com/developers/apps
2. Select your app
3. Go to **Auth** tab
4. Add redirect URI: `https://your-app.vercel.app/api/linkedin-callback`
5. Save changes

## Step 4: Check API Access Level

### Basic Access (Standard)
- ✅ Profile information (r_liteprofile)
- ✅ Company pages (r_organization_social)
- ❌ Engagement data (requires MDP)

### MDP Access (Marketing Developer Platform)
- ✅ All basic access features
- ✅ Social metadata (reactions, comments, shares)
- ✅ Company page analytics
- ✅ Post engagement metrics

**To check if you have MDP:**
1. Go to your app in LinkedIn Developer Portal
2. Check **Products** section
3. Look for "Marketing Developer Platform" or "MDP"

## Step 5: OAuth Authentication Flow

LinkedIn uses OAuth 2.0. You have two options:

### Option A: User OAuth (Interactive)
- User authorizes app
- Get access token for that user
- Can access their profile and network

### Option B: Server-to-Server (Recommended for B2B)
- Requires special approval
- Long-lived tokens
- Better for automated enrichment

**For L.U.C.I., we'll start with basic profile enrichment:**
- Use profile URLs from Salesforce Contacts
- Fetch profile data via API
- Cache in Supabase

## Step 6: Test the Integration

Once credentials are set up, test the API endpoint:

```bash
# Test LinkedIn profile fetch
curl -X POST https://your-app.vercel.app/api/linkedin-enrich \
  -H "Content-Type: application/json" \
  -d '{
    "linkedinURL": "https://www.linkedin.com/in/example",
    "contactId": "contact-uuid"
  }'
```

## API Endpoints

### `/api/linkedin-enrich`
Enriches a contact with LinkedIn profile data.

**Request:**
```json
{
  "linkedinURL": "https://www.linkedin.com/in/johndoe",
  "contactId": "uuid-here",
  "salesforceContactId": "003XX000004ABCD"
}
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "headline": "VP of Engineering",
    "current_title": "VP of Engineering",
    "current_company": "Acme Corp",
    "profile_picture_url": "https://...",
    "linkedin_url": "https://www.linkedin.com/in/johndoe"
  }
}
```

## What Data We Can Get

### With Basic Access:
- ✅ Name, headline, profile picture
- ✅ Current job title and company
- ✅ Location
- ✅ Basic profile information

### With MDP Access:
- ✅ All basic access features
- ✅ Engagement metrics (reactions, comments, shares)
- ✅ Company page analytics
- ✅ Post performance data

## Limitations

1. **Profile Search**: LinkedIn API doesn't provide public search
   - Solution: Use profile URLs from Salesforce
   - Or: Use third-party enrichment services

2. **URN Requirement**: Need LinkedIn URN to fetch profile
   - Solution: Extract from profile URL or use API lookup

3. **Rate Limits**: LinkedIn has rate limits
   - Solution: Cache profiles in Supabase (24-hour TTL)

4. **OAuth Complexity**: Requires user authorization or special approval
   - Solution: Start with profile URLs, add OAuth later if needed

## Next Steps

1. ✅ Run migration
2. ✅ Insert credentials
3. ✅ Test API endpoint
4. ⏳ Build enrichment endpoint
5. ⏳ Integrate with sentiment analysis
6. ⏳ Display LinkedIn insights in UI

## Troubleshooting

### "LinkedIn configuration not found"
- Check that credentials are inserted in `linkedin_configs` table
- Verify `is_active = true`

### "Access token not available"
- Need to implement OAuth flow
- Or use server-to-server authentication

### "403 Forbidden" or "MDP access not available"
- You don't have MDP access
- Can still use basic profile data
- Consider applying for MDP if you need engagement data

### "LinkedIn URN not available"
- Profile URL lookup required
- May need to use third-party service to get URN
- Or collect URNs manually

