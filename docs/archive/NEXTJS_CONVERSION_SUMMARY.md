# Next.js Conversion - Summary

## Scope
- **10 API routes** (~5,083 lines) → Convert to Next.js App Router format
- **14 component files** → Remove window globals, use imports
- **8-10 pages** → Create file-based routing
- **353 window.* references** → Update to Next.js patterns

## Approach

I'm proceeding with a systematic conversion:

1. **Phase 1**: Create Next.js foundation (layout, root page, helpers)
2. **Phase 2**: Convert API routes (10 endpoints)
3. **Phase 3**: Create pages with routing
4. **Phase 4**: Refactor components
5. **Phase 5**: Update navigation/build

This is a **major refactor** that will require many file changes. Starting now...

