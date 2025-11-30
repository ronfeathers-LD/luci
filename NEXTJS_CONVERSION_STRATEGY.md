# Next.js Conversion Strategy

## Key Insight
Next.js App Router API routes can use `require()` for lib files! This means we can:
- Keep all existing `require('../lib/...')` imports
- Only convert the route handler structure
- Use existing helper functions as-is

## Conversion Pattern

### Before (Vercel Serverless):
```javascript
const { getSupabaseClient } = require('../lib/supabase-client');
module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    // ...
    return res.status(200).json(data);
  }
}
```

### After (Next.js App Router):
```javascript
const { getSupabaseClient } = require('../../../lib/supabase-client');
export async function GET(request) {
  // ...
  return NextResponse.json(data);
}
```

## Key Changes
1. Update require paths: `../lib/` → `../../../lib/` (from src/app/api)
2. Convert handler to named exports (GET, POST, etc.)
3. Convert `req.query` → `request.nextUrl.searchParams`
4. Convert `req.body` → `await request.json()`
5. Use `NextResponse` instead of `res.status().json()`

## Progress
- 4/10 API routes done
- 6 remaining (~4,150 lines)

Continuing...

