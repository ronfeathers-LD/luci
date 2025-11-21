# LinkedIn Integration Plan for L.U.C.I.

## What We Can Determine from LinkedIn Data

### 1. **Professional Activity & Changes** (High Value for Sentiment)
- **Recent Job Changes**: If a key contact recently changed jobs, this could indicate:
  - Dissatisfaction with current company/role
  - Better opportunity elsewhere (neutral/positive)
  - Company restructuring (neutral)
- **Profile Updates**: Frequent updates might indicate job searching
- **Skills & Endorsements**: Engagement level with professional network

### 2. **Engagement with Your Company** (High Value)
- **Company Page Engagement**: 
  - Posts about your company (positive/negative sentiment)
  - Comments on your company posts
  - Shares of company content
  - Reactions (likes, celebrates, etc.)
- **Mentions**: Direct mentions of your company in posts/comments
- **Recommendations**: Recommendations from contacts about your company

### 3. **Network & Relationships** (Medium Value)
- **Mutual Connections**: Strength of relationship network
- **Connection Growth**: Expanding network might indicate career growth
- **Industry Activity**: Engagement in industry discussions

### 4. **Content Sentiment Signals** (High Value)
- **Post Sentiment**: Analyze posts for mentions of your company/product
- **Comment Sentiment**: Sentiment of comments on your company's posts
- **Share Context**: Why they're sharing your content (positive endorsement?)

## Implementation Options

### Option 1: LinkedIn API (Official - Recommended if Available)
**Pros:**
- Official, supported by LinkedIn
- Reliable and compliant
- Good rate limits for partners

**Cons:**
- Requires partnership/approval
- Limited access (mostly for partners)
- Complex OAuth setup
- Rate limits

**APIs Available:**
- **Profile API**: Get basic profile information
- **Social Metadata API**: Get engagement data (reactions, comments)
- **Share API**: Post content (not needed for our use case)
- **Sales Navigator API**: Enhanced data (if you have Sales Navigator)

### Option 2: Third-Party Enrichment Services
**Services:**
- **Clearbit Enrichment API**: Provides LinkedIn profile data
- **ZoomInfo**: Contact enrichment with LinkedIn data
- **Apollo.io**: LinkedIn profile enrichment
- **Lusha**: Contact data with LinkedIn profiles

**Pros:**
- Easier to implement
- No OAuth complexity
- Often includes additional data (email, phone, etc.)
- Better rate limits

**Cons:**
- Cost (usually paid services)
- Data freshness varies
- May not have real-time engagement data

### Option 3: Manual Profile URL Collection
**Approach:**
- Store LinkedIn profile URLs in Salesforce Contacts
- Use LinkedIn profile URLs to manually enrich data
- Could use web scraping (not recommended - against ToS)

**Pros:**
- No API costs
- Direct access to public profiles

**Cons:**
- Manual process
- Web scraping violates LinkedIn ToS
- Limited to public data only

## Recommended Approach

### Phase 1: Basic Profile Enrichment (Start Here)
1. **Store LinkedIn Profile URLs** in Salesforce Contacts
2. **Use Third-Party Enrichment** (Clearbit or similar) to get:
   - Current job title
   - Company
   - Profile picture
   - Recent job changes
3. **Cache in Supabase** for performance

### Phase 2: Engagement Tracking (If API Access Available)
1. **LinkedIn API Integration** for:
   - Company page engagement
   - Post mentions
   - Comment sentiment
2. **Store engagement metrics** in database
3. **Include in sentiment analysis** context

### Phase 3: Advanced Sentiment Analysis
1. **Analyze LinkedIn posts** mentioning your company
2. **Track engagement trends** over time
3. **Correlate with sentiment scores**

## Data to Include in Sentiment Analysis

When LinkedIn data is available, add to `salesforceContext`:

```javascript
{
  // Existing Salesforce data...
  
  // LinkedIn enrichment
  linkedin_data: {
    contacts: [
      {
        name: "John Doe",
        linkedin_url: "https://linkedin.com/in/johndoe",
        current_title: "VP of Engineering",
        current_company: "Acme Corp",
        job_changed_recently: false, // Changed in last 90 days?
        days_in_current_role: 450,
        profile_updated_recently: true, // Updated in last 30 days?
        mutual_connections: 5,
        engagement_with_company: {
          posts_about_company: 0,
          comments_on_company_posts: 2,
          shares_of_company_content: 1,
          reactions_to_company_posts: 5
        }
      }
    ],
    company_engagement: {
      total_mentions: 3,
      positive_mentions: 2,
      negative_mentions: 0,
      neutral_mentions: 1
    }
  }
}
```

## Sentiment Indicators from LinkedIn

### Positive Signals:
- ✅ Recent promotion or positive job change
- ✅ Active engagement with company posts (likes, comments, shares)
- ✅ Positive mentions of company in posts
- ✅ Recommendations from contacts
- ✅ Long tenure in current role

### Negative Signals:
- ⚠️ Recent job change (especially to competitor)
- ⚠️ Negative mentions of company
- ⚠️ Reduced engagement with company content
- ⚠️ Profile updates suggesting job search
- ⚠️ Connections with competitors

### Neutral/Context:
- 📊 Industry activity and engagement
- 📊 Network growth
- 📊 Skills and endorsements

## Next Steps

1. **Decide on approach**: API vs Third-party vs Manual
2. **Create database schema** for LinkedIn data
3. **Build enrichment endpoint** to fetch LinkedIn data
4. **Integrate with sentiment analysis** to include LinkedIn context
5. **Display LinkedIn insights** in ResultsPage

## Questions to Answer

1. Do you have LinkedIn API access or Sales Navigator?
2. Are you open to using third-party enrichment services (Clearbit, ZoomInfo)?
3. Do you already store LinkedIn profile URLs in Salesforce?
4. What's the priority: profile enrichment or engagement tracking?

