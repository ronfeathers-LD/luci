# How to Clear Browser Cache and Force Fresh Code

## The Problem
You're seeing 500 errors because the browser is using cached JavaScript code. The latest code changes haven't been loaded.

## Solutions

### Option 1: Hard Refresh (Easiest)

**Chrome/Edge:**
- Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Firefox:**
- Windows/Linux: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Safari:**
- Mac: `Cmd + Option + R`

### Option 2: Clear Cache via DevTools

1. **Open DevTools** (F12)
2. **Right-click the refresh button** (next to address bar)
3. **Select "Empty Cache and Hard Reload"**

### Option 3: Disable Cache in DevTools

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Check "Disable cache"** checkbox
4. **Keep DevTools open** while testing
5. **Refresh the page**

### Option 4: Incognito/Private Window

1. **Open a new incognito/private window**
2. **Navigate to:** `https://ld-luci.vercel.app`
3. **This bypasses all cache**

### Option 5: Clear All Site Data

1. **Open DevTools** (F12)
2. **Go to Application tab** (Chrome) or **Storage tab** (Firefox)
3. **Click "Clear site data"** or "Clear storage"
4. **Refresh the page**

## Verify Fresh Code is Loaded

After clearing cache, check:

1. **Network tab** → Look for `index.html`
2. **Check the timestamp** - should be recent
3. **Check response headers** - should show current date

## Check Vercel Deployment

The code might not be deployed yet:

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Check your project's deployments**
3. **Look for the latest deployment** (should be recent)
4. **Check deployment status** - should be "Ready"

## If 500 Errors Persist After Cache Clear

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard
   - Click on your project
   - Go to "Functions" tab
   - Click on `/api/linkedin-enrich`
   - Check the logs for errors

2. **Check for syntax errors:**
   - The code should have no syntax errors
   - But there might be a runtime error

3. **Share the error details:**
   - Copy the full error from Vercel logs
   - Or check browser Network tab for response body

## Quick Test

After clearing cache:
1. **Hard refresh** the page (`Ctrl+Shift+R` or `Cmd+Shift+R`)
2. **Open DevTools** → **Network tab**
3. **Select an account** with contacts
4. **Check for `/api/linkedin-enrich` requests**
5. **Click on a request** → **Response tab**
6. **See if it's still 500 or now returns 200 with graceful error**

