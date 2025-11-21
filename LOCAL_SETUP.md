# Quick Local Setup Guide

## Step 1: Link to Vercel Project

**This is required before running locally.** Link to your existing Vercel project:

```bash
npx vercel link
```

When prompted:
1. Select "Link to existing project"
2. Choose your account
3. Select the "luci" project (or whatever you named it)

This creates a `.vercel` directory with project configuration.

## Step 2: Set Up Environment Variables

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_CLIENT_ID`
- `GEMINI_API_KEY`

## Step 3: Run Development Server

```bash
npm run dev
```

This will start the server at `http://localhost:3000`

## Alternative: Run Without Linking

If you don't want to link, you can run vercel dev directly but you'll need to provide a project name:

```bash
npx vercel dev --yes
```

When prompted for project name, use: `luci` (or your project name)

**Note**: You still need `.env.local` with all your environment variables.

