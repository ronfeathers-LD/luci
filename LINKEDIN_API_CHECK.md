# How to Check LinkedIn API Access

## Step 1: Check LinkedIn Developer Account

1. **Go to LinkedIn Developer Portal:**
   - Visit: https://www.linkedin.com/developers/
   - Or: https://developer.linkedin.com/

2. **Sign In:**
   - Use your LinkedIn account credentials
   - If you don't have a developer account, you'll need to create one

## Step 2: Check for Existing Apps

1. **Navigate to "My Apps":**
   - In the LinkedIn Developer Portal, look for "My Apps" or "Applications"
   - This shows all LinkedIn apps you've created

2. **Check App Status:**
   - Look for apps with status: "Approved", "Pending", or "In Development"
   - Each app has API access levels

## Step 3: Check API Access Levels

LinkedIn has different access levels:

### **Standard Access** (Free, but limited):
- Basic profile information
- Company pages
- Limited rate limits
- No engagement data

### **Marketing Developer Platform (MDP)** (Requires approval):
- Social metadata (reactions, comments, shares)
- Company page analytics
- Post engagement data
- Requires partnership application

### **Sales Navigator API** (Requires Sales Navigator subscription):
- Enhanced profile data
- Sales Navigator features
- Requires active Sales Navigator subscription

## Step 4: Check Your App Details

For each app, check:

1. **API Products:**
   - Look for "Marketing Developer Platform" or "MDP"
   - Check for "Sign In with LinkedIn"
   - Check for "Share on LinkedIn"

2. **Credentials:**
   - Client ID
   - Client Secret
   - OAuth redirect URLs

3. **Permissions/Scopes:**
   - `r_liteprofile` - Basic profile
   - `r_fullprofile` - Full profile (deprecated)
   - `r_emailaddress` - Email address
   - `w_member_social` - Post on behalf of user
   - `r_organization_social` - Company page data
   - `r_social_metadata` - Engagement data (MDP only)

## Step 5: Check for MDP Access

Marketing Developer Platform (MDP) is what we need for engagement data:

1. **Look for "Marketing Developer Platform" in your apps**
2. **Check if you have "Social Metadata API" access**
3. **Verify you can see:**
   - Reactions (likes, celebrates, etc.)
   - Comments
   - Shares
   - Company page analytics

## What to Look For

### ✅ **You Have API Access If:**
- You can see "My Apps" in LinkedIn Developer Portal
- You have at least one app created
- You have Client ID and Client Secret
- App status is "Approved" or "In Development"

### ⚠️ **You Need MDP Access For:**
- Engagement data (reactions, comments, shares)
- Company page analytics
- Post performance metrics

### ❌ **You Don't Have API Access If:**
- You can't access developer.linkedin.com
- You see "Create App" but no existing apps
- You don't have Client ID/Secret

## Quick Check Commands

If you have API credentials, you can test access:

```bash
# Test basic API access (replace with your credentials)
curl -X GET "https://api.linkedin.com/v2/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Next Steps Based on What You Find

### **If You Have Basic API Access:**
- We can get profile information
- We can get company page data
- Limited engagement data

### **If You Have MDP Access:**
- Full engagement tracking
- Social metadata (reactions, comments, shares)
- Company page analytics
- This is ideal for sentiment analysis!

### **If You Don't Have API Access:**
- We can apply for LinkedIn Developer account (free)
- Apply for MDP access (requires partnership application)
- Or use third-party enrichment services as alternative

## How to Apply for MDP Access

If you don't have MDP access but want it:

1. **Go to:** https://www.linkedin.com/developers/apps
2. **Create a new app** (if you don't have one)
3. **Request MDP Access:**
   - Go to your app settings
   - Look for "Request Access" or "Apply for Marketing Developer Platform"
   - Fill out the partnership application
   - Wait for approval (can take weeks)

## Alternative: Check Your Organization

If you're part of an organization:

1. **Check if your company has LinkedIn API access**
2. **Ask your IT/admin team** if they have:
   - LinkedIn Developer account
   - MDP access
   - API credentials

## What Information Do You Need?

Once you check, please share:

1. ✅ Do you have a LinkedIn Developer account?
2. ✅ Do you have any apps created?
3. ✅ What's the status of your app(s)?
4. ✅ Do you have Client ID and Client Secret?
5. ✅ Do you have MDP (Marketing Developer Platform) access?
6. ✅ What API products/scopes are available?

This will help determine the best integration approach!

