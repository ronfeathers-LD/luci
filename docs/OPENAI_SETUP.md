# OpenAI API Key Setup for Embeddings

The RAG chatbot now uses OpenAI's `text-embedding-3-small` for generating embeddings, which has a more generous free tier than Gemini.

## Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click **"Create new secret key"**
5. Give it a name (e.g., "LUCI Embeddings")
6. Copy the key (starts with `sk-...`)
   - ⚠️ **Important**: Copy it immediately - you won't be able to see it again!

## Step 2: Add to Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **LUCI** project
3. Click on **Settings** (gear icon in the top navigation)
4. Click on **Environment Variables** in the left sidebar
5. Click **Add New** button
6. Fill in:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Paste your OpenAI API key (starts with `sk-...`)
   - **Environments**: Check all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
7. Click **Save**

## Step 3: Redeploy Your Application

After adding the environment variable, you need to redeploy:

**Option A: Redeploy from Dashboard**
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **three dots (⋯)** menu
4. Select **Redeploy**
5. Wait for deployment to complete

**Option B: Push a New Commit**
```bash
git commit --allow-empty -m "Trigger redeploy for OpenAI key"
git push origin main
```

## Step 4: Run Database Migration

The database schema needs to be updated to support OpenAI's 1536-dimensional embeddings:

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run the migration file: `supabase/migrations/022_update_embeddings_to_openai.sql`
   - Or copy the contents and run it in the SQL editor

**Or if using Supabase CLI:**
```bash
supabase migration up
```

## Step 5: Regenerate Embeddings

After the migration:
1. Go to any account's data page (`/account/[id]/data`)
2. Click **"Generate Embeddings"** button
3. Wait for embeddings to be generated (now using OpenAI)

## Verification

To verify it's working:
1. Check Vercel deployment logs - should not show "No embedding API key available"
2. Try generating embeddings - should complete successfully
3. Check Supabase `account_embeddings` table - embeddings should have 1536 dimensions

## Fallback Behavior

- If `OPENAI_API_KEY` is set: Uses OpenAI for embeddings
- If only `GEMINI_API_KEY` is set: Falls back to Gemini (768 dimensions)
- If neither is set: Returns an error

## Cost Information

OpenAI `text-embedding-3-small` pricing:
- **Free tier**: $5 free credit when you sign up
- **After free tier**: $0.02 per 1M tokens (very affordable)
- Typical account embedding: ~$0.0001 - $0.001 per account

## Troubleshooting

**Error: "No embedding API key available"**
- Make sure `OPENAI_API_KEY` is added to Vercel
- Make sure you redeployed after adding the key
- Check that the key starts with `sk-`

**Error: "Invalid API key"**
- Verify the key is correct in Vercel
- Make sure you copied the full key (it's long)
- Check that the key hasn't been revoked in OpenAI dashboard

**Error: "Rate limit exceeded"**
- OpenAI has generous limits, but if you hit them, wait a few minutes
- Check your usage at https://platform.openai.com/usage

**Database errors after migration**
- Make sure migration `022_update_embeddings_to_openai.sql` was run
- Check that the `embedding` column is `vector(1536)`
- You may need to delete old embeddings and regenerate them

