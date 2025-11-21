# Local Development Guide

This guide will help you set up and run L.U.C.I. locally for development.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Vercel CLI (will be installed as dev dependency)
- Access to your Supabase project
- Google OAuth credentials (for authentication)
- Gemini API key (for sentiment analysis)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all dependencies including Vercel CLI as a dev dependency.

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

- **SUPABASE_URL**: Your Supabase project URL (found in Supabase dashboard)
- **SUPABASE_SERVICE_ROLE_KEY**: Your Supabase service role key (found in Supabase dashboard > Settings > API)
- **GOOGLE_CLIENT_ID**: Your Google OAuth Client ID (from Google Cloud Console)
- **GEMINI_API_KEY**: Your Google Gemini API key (from Google AI Studio)

### 3. Link to Vercel Project (Optional)

If you want to use your production environment variables from Vercel:

```bash
npx vercel link
```

This will prompt you to:
- Link to an existing project or create a new one
- Select your Vercel account and project

**Note**: You can also run locally without linking - just use `.env.local` for all variables.

### 4. Run the Development Server

```bash
npm run dev
```

This will:
- Start Vercel's development server
- Serve your API routes at `http://localhost:3000/api/*`
- Serve your frontend at `http://localhost:3000`
- Hot reload on file changes

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

### 5. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## Development Workflow

### Making Changes

1. **Frontend Changes**: Edit `index.html` - changes will be reflected immediately
2. **API Changes**: Edit files in `api/` directory - server will auto-reload
3. **Build Process**: Run `npm run build` to rebuild CSS before committing

### Testing API Endpoints

You can test API endpoints directly:

```bash
# Test sentiment analysis
curl -X POST http://localhost:3000/api/analyze-sentiment \
  -H "Content-Type: application/json" \
  -d '{"transcription": "test", "salesforceContext": {}}'

# Test user creation
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "sub": "test123"}'
```

### Environment Variables

Vercel CLI will automatically load environment variables from:
1. `.env.local` (highest priority, not committed to git)
2. `.env` (if exists)
3. Vercel project environment variables (if linked)

**Important**: Never commit `.env.local` - it's already in `.gitignore`

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
PORT=3001 npm run dev
```

Or use the tunnel script:

```bash
npm run dev:tunnel
```

### API Routes Not Working

1. Make sure you're using the correct URL format: `http://localhost:3000/api/endpoint-name`
2. Check that your environment variables are set correctly
3. Verify that Vercel CLI is installed: `npx vercel --version`

### CORS Issues

If you encounter CORS issues during development:
- The API endpoints include CORS headers automatically
- Make sure you're accessing from `http://localhost:3000` (not `127.0.0.1`)

### Database Connection Issues

1. Verify your Supabase credentials in `.env.local`
2. Check that your Supabase project is active
3. Ensure your IP is allowed in Supabase (or disable IP restrictions for development)

### Google Sign-In Not Working Locally

1. Make sure `http://localhost:3000` is added to your Google OAuth authorized redirect URIs
2. Check that `GOOGLE_CLIENT_ID` is set correctly in `.env.local`
3. Clear browser cache and cookies

## Building for Production

Before deploying, build the production assets:

```bash
npm run build
```

This will:
- Compile and minify Tailwind CSS
- Inline CSS into `index.html`
- Add build version for cache busting

## Additional Resources

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Supabase Local Development](https://supabase.com/docs/guides/cli/local-development)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

## Quick Start Checklist

- [ ] Node.js 18+ installed
- [ ] Run `npm install`
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Fill in all environment variables in `.env.local`
- [ ] Run `npm run dev`
- [ ] Open `http://localhost:3000` in browser
- [ ] Test Google Sign-In
- [ ] Test sentiment analysis

Happy coding! 🚀

