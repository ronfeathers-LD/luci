# Vercel Settings Check - Fix 404 Error

## ⚠️ Critical Settings to Check

### 1. Framework Preset (MOST IMPORTANT)

Go to Vercel Dashboard → Your Project → **Settings** → **General**

**Check:**
- **Framework Preset** should be set to **"Next.js"**
- If it's set to "Other" or something else, change it to "Next.js"

**Steps:**
1. Open Vercel Dashboard
2. Select your LUCI project
3. Go to **Settings** tab
4. Click **General** in the left sidebar
5. Scroll down to **Build & Development Settings**
6. Find **Framework Preset** dropdown
7. Select **"Next.js"** if not already set
8. Click **Save**

### 2. Build Command

**Should be:**
- Build Command: `next build` (or leave empty - Next.js auto-detects)

**Check:**
- In **Settings** → **General** → **Build & Development Settings**
- Build Command should be empty or `next build`
- If it's set to something else, clear it or set to `next build`

### 3. Output Directory

**Should be:**
- Output Directory: Leave empty (Next.js handles this automatically)

**Check:**
- Output Directory should be empty or `.`
- If it's set to something like `dist` or `build`, clear it

### 4. Install Command

**Should be:**
- Install Command: `npm install` (or leave empty for auto-detect)

**Check:**
- Install Command should be empty or `npm install`

### 5. Root Directory

**Should be:**
- Root Directory: `.` (root of the repo)

**Check:**
- Should be set to `.` (current directory)
- If you have your Next.js app in a subfolder, adjust accordingly

## Quick Fix Checklist

- [ ] Framework Preset = **Next.js**
- [ ] Build Command = empty or `next build`
- [ ] Output Directory = empty
- [ ] Install Command = empty or `npm install`
- [ ] Root Directory = `.`

## After Making Changes

1. **Save** the settings in Vercel
2. Go to **Deployments** tab
3. Click **Redeploy** on the latest deployment
4. Wait for build to complete
5. Test the app

## Alternative: Create a Minimal vercel.json

If Vercel still isn't detecting Next.js properly, we can create a minimal `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "next build"
}
```

But this should NOT be necessary if Framework Preset is set correctly.

