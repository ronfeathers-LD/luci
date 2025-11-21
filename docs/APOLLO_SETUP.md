# Apollo.io Integration Setup

This guide explains how to set up Apollo.io API integration for contact enrichment in L.U.C.I.

## Overview

Apollo.io provides contact enrichment data including:
- Current job title and company
- LinkedIn profile information
- Email addresses
- Phone numbers
- Location data
- Job change history
- And more

## Step 1: Get Apollo.io API Key

1. **Sign up for Apollo.io** (if you don't have an account)
   - Visit: https://www.apollo.io/
   - Create an account or sign in

2. **Navigate to API Settings**
   - Go to Settings → Integrations → API
   - Or visit: https://app.apollo.io/#/settings/integrations/api

3. **Create API Key**
   - Click "Create API Key" or "Generate New Key"
   - Copy the API key (you'll need it for Step 2)

## Step 2: Add API Key to Supabase

Run this SQL in your Supabase SQL editor:

```sql
-- Insert Apollo.io API key
INSERT INTO apollo_configs (api_key, is_active)
VALUES ('YOUR_APOLLO_API_KEY_HERE', true)
ON CONFLICT DO NOTHING;
```

Replace `YOUR_APOLLO_API_KEY_HERE` with your actual Apollo.io API key.

## Step 3: Verify Configuration

You can verify the configuration by checking the `apollo_configs` table:

```sql
SELECT id, is_active, created_at, last_tested
FROM apollo_configs
WHERE is_active = true;
```

## Step 4: Test Enrichment

Once configured, the enrichment will automatically work when:
1. Contacts are fetched from Salesforce
2. Contacts have email addresses, LinkedIn URLs, or name+company data
3. The `/api/apollo-enrich` endpoint is called

## API Endpoints

### Enrich Single Contact

**POST** `/api/apollo-enrich`

Request body:
```json
{
  "contactId": "uuid-here",
  "forceRefresh": false
}
```

Or:
```json
{
  "email": "person@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "linkedinURL": "https://www.linkedin.com/in/johndoe",
  "company": "Acme Corp"
}
```

Response:
```json
{
  "success": true,
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "current_title": "VP of Sales",
    "current_company": "Acme Corp",
    "linkedin_url": "https://www.linkedin.com/in/johndoe",
    "location": "San Francisco, CA",
    ...
  },
  "cached": false,
  "source": "apollo"
}
```

## How It Works

1. **Contact Matching**: Apollo.io matches contacts using:
   - Email address (most reliable)
   - LinkedIn URL
   - First name + Last name + Company name

2. **Data Enrichment**: Apollo.io returns:
   - Current job title and company
   - LinkedIn profile URL
   - Location information
   - Job change history
   - Profile picture URL
   - And more

3. **Caching**: Enriched profiles are cached in the `linkedin_profiles` table for 24 hours to minimize API calls.

## Rate Limits

Apollo.io has rate limits based on your plan:
- **Free tier**: Limited requests
- **Paid tiers**: Higher limits

Check your Apollo.io dashboard for current rate limits.

## Troubleshooting

### "Apollo.io API key not configured"
- Verify the API key is in the `apollo_configs` table
- Check that `is_active = true`
- Ensure the API key is valid

### "No matching person found"
- The contact may not exist in Apollo.io's database
- Try providing more matching data (email is most reliable)
- Verify the LinkedIn URL format is correct

### API Errors
- Check Apollo.io API status
- Verify your API key hasn't expired
- Check rate limits in your Apollo.io dashboard

## Cost Considerations

Apollo.io charges based on:
- Number of API calls
- Your subscription plan
- Data credits used

Monitor your usage in the Apollo.io dashboard to avoid unexpected charges.

## Next Steps

After setup:
1. Contacts will be automatically enriched when fetched
2. Enriched data will appear in contact cards
3. Enriched data will be included in sentiment analysis
4. Job changes and engagement metrics will be tracked

## References

- Apollo.io API Documentation: https://docs.apollo.io/
- Apollo.io API Overview: https://docs.apollo.io/docs/api-overview
- Apollo.io People Match Endpoint: https://docs.apollo.io/docs/people-match

