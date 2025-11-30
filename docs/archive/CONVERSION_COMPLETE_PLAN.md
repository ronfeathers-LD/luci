# Next.js Conversion - Complete Plan

## Current Status
✅ **4/10 API routes converted**
- users ✅
- users/accounts ✅  
- roles ✅
- sentiment-analysis ✅

## Remaining Routes (6 large files ~4,155 lines)
1. analyze-sentiment (~829 lines) - Very complex Gemini API
2. avoma-transcription (~438 lines)
3. google-calendar (~548 lines) - OAuth complexity
4. system-settings (~583 lines)
5. salesforce-accounts (~888 lines)
6. salesforce-cases (~459 lines)
7. salesforce-contacts (~412 lines)

## Conversion Pattern Established

Each route follows this pattern:
- Convert `module.exports = async function handler(req, res)` 
- To named exports: `export async function GET(request)`, `export async function POST(request)`, etc.
- Convert `req.query` → `request.nextUrl.searchParams`
- Convert `req.body` → `await request.json()`
- Convert `req.method` checks → separate functions
- Use `require()` for lib files (works in Next.js API routes)

## Next Steps
1. Continue converting remaining 6 API routes
2. Create all page routes (8-10 pages)
3. Refactor components (14 files, remove window.*)
4. Update navigation (useRouter)
5. Update build process

Continuing now...

