# Deployment Guide - Customer Pulse Dashboard

## Step-by-Step Setup Instructions

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or use an existing key
4. Copy the API key (starts with something like `AIza...`)

### 2. Add Environment Variable in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **LUCI** project
3. Click on **Settings** (gear icon in the top navigation)
4. Click on **Environment Variables** in the left sidebar
5. Click **Add New** button
6. Fill in:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Paste your Gemini API key here
   - **Environments**: Check all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
7. Click **Save**

### 3. Redeploy Your Application

**Option A: Redeploy from Dashboard**
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **three dots (⋯)** menu
4. Select **Redeploy**
5. Wait for deployment to complete

**Option B: Push a New Commit**
```bash
git add .
git commit -m "Configure environment variables"
git push
```

### 4. Verify the Setup

1. After deployment completes, visit your Vercel URL
2. Sign in with Google
3. Enter a customer identifier (e.g., "Acme Corp")
4. Click "Analyze Sentiment"
5. If it works, you'll see a sentiment score and summary

### 5. Troubleshooting

**Error: "Server configuration error"**
- The `GEMINI_API_KEY` environment variable is not set
- Go back to Step 2 and verify the variable is added correctly
- Make sure to redeploy after adding the variable

**Error: "Method not allowed"**
- The API endpoint is being called with the wrong HTTP method
- Should be POST, not GET

**Error: "Missing required parameters"**
- Check browser console for the exact error
- Verify the frontend is sending `transcription` and `salesforceContext`

**Error: "Gemini API error"**
- Your API key might be invalid or expired
- Check your Google AI Studio dashboard
- Verify the API key has proper permissions

### 6. Testing Locally (Optional)

If you want to test locally before deploying:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link your project:
   ```bash
   vercel link
   ```

3. Add environment variable locally:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   (Paste your API key when prompted)

4. Run dev server:
   ```bash
   vercel dev
   ```

## File Structure

```
LUCI/
├── api/
│   └── analyze-sentiment.js    # Serverless function (secure API key)
├── index.html                   # Main application
├── vercel.json                  # Vercel configuration
└── .gitignore                   # Ignores config file with secrets
```

## Security Notes

✅ **Secure**: Gemini API key is stored server-side only  
✅ **Secure**: Config file with OAuth secrets is gitignored  
✅ **Safe**: Google Client ID is public (by design)  
✅ **Safe**: No sensitive data in client-side code

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variable is set correctly
4. Test the API endpoint directly: `POST /api/analyze-sentiment`

