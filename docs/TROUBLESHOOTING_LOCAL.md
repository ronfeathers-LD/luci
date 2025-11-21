# Local Development Troubleshooting Guide

## Common Issues and Solutions

### 1. "Cannot connect to the Docker daemon"

**Error:** `Cannot connect to the Docker daemon at unix:///Users/ron.feathers/.docker/run/docker.sock`

**Solution:**
- Make sure Docker Desktop is running
- macOS: Open Docker Desktop app and wait for it to fully start
- Check with: `docker ps`

### 2. "Port is already allocated"

**Error:** `Bind for 0.0.0.0:54332 failed: port is already allocated`

**Solution:**
```bash
# Stop other Supabase instances
supabase stop --project-id SOW-Generator

# Or stop all Supabase containers
docker ps | grep supabase | awk '{print $1}' | xargs docker stop
```

### 3. "Container name already in use"

**Error:** `The container name "/supabase_auth_LUCI" is already in use`

**Solution:**
```bash
# Remove old containers
docker ps -a | grep supabase | grep LUCI | awk '{print $1}' | xargs docker rm -f

# Then restart
supabase start
```

### 4. API Returns 500 Errors

**Error:** `POST http://localhost:3000/api/users 500 (Internal Server Error)`

**Possible Causes:**
1. **Wrong Supabase URL/Key in .env.local**
   - Check: `cat .env.local | grep SUPABASE`
   - Should be: `SUPABASE_URL=http://127.0.0.1:54331`
   - Get service role key: `supabase status | grep "service_role key"`

2. **Vercel dev server needs restart**
   - Stop the server (Ctrl+C)
   - Restart: `npx vercel dev`

3. **Supabase not running**
   - Check: `supabase status`
   - Start if needed: `supabase start`

### 5. "Failed to create user" or Database Errors

**Error:** `Error creating user: Error: Failed to create user`

**Solution:**
- Verify Supabase is running: `supabase status`
- Check database connection: Open Supabase Studio at `http://127.0.0.1:54333`
- Verify migrations applied: Check if `users` table exists in Studio
- Reset database if needed: `./scripts/db-local.sh reset`

### 6. Google Sign-In Not Working Locally

**Error:** `[GSI_LOGGER]: The given origin is not allowed for the given client ID`

**Solution:**
- Add `http://localhost:3000` to Google OAuth authorized origins:
  1. Go to [Google Cloud Console](https://console.cloud.google.com)
  2. Navigate to APIs & Services → Credentials
  3. Click your OAuth 2.0 Client ID
  4. Add `http://localhost:3000` to "Authorized JavaScript origins"
  5. Add `http://localhost:3000` to "Authorized redirect URIs"
  6. Save and wait a few minutes for changes to propagate

### 7. Environment Variables Not Loading

**Symptoms:** API calls fail, wrong database connection

**Solution:**
1. Verify `.env.local` exists: `ls -la .env.local`
2. Check file contents: `cat .env.local`
3. Restart Vercel dev server (environment variables are loaded at startup)
4. Verify variables are set:
   ```bash
   # Should show your values
   cat .env.local | grep SUPABASE_URL
   ```

### 8. Database Migrations Not Applied

**Symptoms:** Tables missing, schema errors

**Solution:**
```bash
# Check what migrations exist
ls supabase/migrations/

# Reset database (reapplies all migrations)
./scripts/db-local.sh reset

# Or manually
supabase db reset
```

### 9. "FUNCTION_INVOCATION_FAILED" in Vercel Dev

**Error:** `A server error has occurred FUNCTION_INVOCATION_FAILED`

**Solution:**
1. Check Vercel dev server logs for detailed error
2. Verify Supabase connection:
   ```bash
   supabase status
   ```
3. Check API function code for errors
4. Verify environment variables are loaded correctly

### 10. Supabase Studio Not Accessible

**Error:** Can't open `http://127.0.0.1:54333`

**Solution:**
```bash
# Check if Supabase is running
supabase status

# If not running, start it
supabase start

# Or use the helper script
./scripts/db-local.sh studio
```

## Quick Diagnostic Commands

```bash
# Check Supabase status
supabase status

# Check Docker containers
docker ps | grep supabase

# Check environment variables
cat .env.local | grep SUPABASE

# Test Supabase API connection
curl http://127.0.0.1:54331/rest/v1/ \
  -H "apikey: $(supabase status | grep 'service_role key' | awk '{print $3}')"

# Check if Vercel dev is running
ps aux | grep "vercel dev"
```

## Still Having Issues?

1. **Check the browser console** for client-side errors
2. **Check Vercel dev server logs** for API errors
3. **Check Supabase logs**: Open Supabase Studio → Logs
4. **Verify all prerequisites**:
   - Docker Desktop running
   - Node.js 18+ installed
   - Supabase CLI installed
   - `.env.local` file exists with correct values

## Getting Help

If you're still stuck, provide:
1. The exact error message
2. Where it occurs (browser console, terminal, API response)
3. Output of `supabase status`
4. Contents of `.env.local` (redact sensitive keys)

