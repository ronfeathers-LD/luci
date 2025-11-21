# Quick Local Setup Guide

## Prerequisites

- Node.js 18+ installed
- Docker Desktop installed and running (required for local Supabase)
- Supabase CLI installed (`brew install supabase/tap/supabase`)

## Step 1: Start Local Supabase Database

**This is required before running the app locally.** Start your local Supabase instance:

```bash
# Start local Supabase (first time will download Docker images)
supabase start

# Or use the helper script
./scripts/db-local.sh start
```

This will:
- Start a local PostgreSQL database
- Apply all migrations from `supabase/migrations/`
- Start Supabase Studio (database admin UI) at `http://127.0.0.1:54333`
- Display connection details including API URL and service role key

**Note:** The first time you run this, it may take a few minutes to download Docker images.

## Step 2: Set Up Environment Variables

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials. **For local development, use the local Supabase values:**

```bash
# Get these values by running: supabase status
SUPABASE_URL=http://127.0.0.1:54331
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Google OAuth (for Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id

# Gemini API (for sentiment analysis)
GEMINI_API_KEY=your-gemini-api-key
```

**To get the exact service role key for your local instance, run:**
```bash
supabase status | grep "service_role key"
```

## Step 3: Link to Vercel Project (Optional)

If you want to use Vercel environment variables or deploy:

```bash
npx vercel link
```

When prompted:
1. Select "Link to existing project"
2. Choose your account
3. Select the "luci" project (or whatever you named it)

**Note:** You can skip this step if you only want to run locally with `.env.local`.

## Step 4: Run Development Server

**Important:** Don't use `npm run dev` - run vercel dev directly:

```bash
npx vercel dev
```

This will start the server at `http://localhost:3000`

**Why?** Vercel CLI detects if `package.json` has a `dev` script that calls `vercel dev` and treats it as recursive invocation. Running `npx vercel dev` directly avoids this issue.

## Useful Commands

### Database Management

```bash
# Start local Supabase
./scripts/db-local.sh start

# Stop local Supabase
./scripts/db-local.sh stop

# Show status and connection details
./scripts/db-local.sh status

# Reset database (reapply all migrations)
./scripts/db-local.sh reset

# Open Supabase Studio (database admin UI)
./scripts/db-local.sh studio
```

### Alternative: Run Without Linking

If you don't want to link, you can run vercel dev directly but you'll need to provide a project name:

```bash
npx vercel dev --yes
```

When prompted for project name, use: `luci` (or your project name)

## Switching Between Local and Production

To use **local Supabase** (default for development):
- Use `SUPABASE_URL=http://127.0.0.1:54331` in `.env.local`
- Use the service role key from `supabase status`

To use **production Supabase**:
- Replace `SUPABASE_URL` with your production Supabase project URL
- Replace `SUPABASE_SERVICE_ROLE_KEY` with your production service role key
- Get these from: Supabase Dashboard → Settings → API

## Troubleshooting

### Port Already in Use

If you get a "port is already allocated" error, another Supabase instance might be running:

```bash
# Check if SOW-Generator or another instance is running
supabase stop --project-id SOW-Generator

# Or stop all Supabase instances
docker ps | grep supabase | awk '{print $1}' | xargs docker stop
```

### Database Not Starting

Make sure Docker Desktop is running:
- macOS: Check Docker Desktop app
- Linux: `sudo systemctl start docker`

### Migrations Not Applied

Reset the database to reapply all migrations:

```bash
./scripts/db-local.sh reset
```

