# L.U.C.I.

**LeanData Unified Customer Intelligence**

A Vercel-ready React application that analyzes customer sentiment by combining Avoma transcription data and Salesforce customer context using the Gemini API.

🌐 **Live Demo:** [luci-ivory.vercel.app](https://luci-ivory.vercel.app)

## Features

- 🔐 **Google Authentication** - Secure sign-in with Google OAuth
- 📊 **Sentiment Analysis** - AI-powered sentiment scoring (1-10 scale)
- 🔒 **Secure API** - Serverless function protects API keys
- 📱 **Responsive Design** - Beautiful UI with Tailwind CSS
- ♿ **Accessible** - ARIA labels and semantic HTML
- 🚀 **Production Ready** - Optimized for performance and security

## Tech Stack

- **Frontend:** React 18, Tailwind CSS
- **Backend:** Vercel Serverless Functions
- **AI:** Google Gemini 2.5 Flash API
- **Authentication:** Google Identity Services
- **Deployment:** Vercel

## Quick Start

### Prerequisites

- Node.js 18+ (for local development)
- Vercel account
- Google OAuth credentials
- Gemini API key

### Local Development

For detailed local development setup, see [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md).

**Quick Start:**

1. Clone the repository:
```bash
git clone https://github.com/ronfeathers-LD/luci.git
cd luci
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file with your credentials
# See .env.local.example for required variables
```

4. Link to Vercel project (first time only):
```bash
npx vercel link
```

5. Run the development server (run directly, not via npm script):
```bash
npx vercel dev
```

**Note:** Don't use `npm run dev` - Vercel CLI will detect it as recursive invocation. Always run `npx vercel dev` directly.

6. Open `http://localhost:3000` in your browser

The development server will:
- Serve your API routes at `/api/*`
- Hot reload on file changes
- Use environment variables from `.env.local`

### Deployment to Vercel

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Vercel will automatically detect the build settings

2. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your Gemini API key
   - Available for: Production, Preview, Development

3. **Configure Google OAuth**
   - Add your Vercel domain to Google OAuth "Authorized JavaScript origins"
   - Example: `https://your-app.vercel.app`

4. **Deploy**
   - Push to main branch or use Vercel CLI:
   ```bash
   vercel --prod
   ```

## Project Structure

```
LUCI/
├── api/
│   └── analyze-sentiment.js    # Serverless function for Gemini API
├── src/
│   └── input.css               # Tailwind CSS source
├── index.html                  # Main application (single-file React app)
├── sw.js                       # Service worker for offline support
├── build.js                    # Build script for Tailwind
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── vercel.json                 # Vercel deployment config
├── DEPLOYMENT.md               # Detailed deployment guide
├── HEALTH_CHECK.md             # Troubleshooting guide
└── OPTIMIZATIONS.md            # Optimization report
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Client ID
3. Add authorized JavaScript origins:
   - `https://your-app.vercel.app`
   - `http://localhost:3000` (for local dev)
4. Copy Client ID to `index.html` (or use environment variable)

## API Endpoints

### POST `/api/analyze-sentiment`

Analyzes customer sentiment from transcription and Salesforce context.

**Request:**
```json
{
  "transcription": "Customer conversation text...",
  "salesforceContext": {
    "account_tier": "Enterprise (Tier 1)",
    "contract_value": "$120,000/year",
    ...
  }
}
```

**Response:**
```json
{
  "score": 8,
  "summary": "Customer initially frustrated but satisfied after resolution..."
}
```

**Rate Limits:** 10 requests per minute per IP

## Security Features

- ✅ API keys stored server-side only
- ✅ CORS headers configured
- ✅ Request size limits (10MB)
- ✅ Rate limiting (10 req/min)
- ✅ Input validation and sanitization
- ✅ Error message sanitization in production
- ✅ Secure headers (XSS, CSRF protection)

## Performance Optimizations

- ✅ Production builds (React, Tailwind)
- ✅ Conditional logging (disabled in production)
- ✅ Service worker for offline support
- ✅ Optimized bundle size
- ✅ Lazy loading ready

## Accessibility

- ✅ ARIA labels on all interactive elements
- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ Screen reader announcements
- ✅ Focus management

## Development

### Build Commands

```bash
# Build Tailwind CSS
npm run build:css

# Build HTML with inline CSS
npm run build:html

# Build everything
npm run build
```

### Code Structure

The application is a single-file React app (`index.html`) that includes:
- Google OAuth authentication
- Sentiment analysis UI
- Mock data functions (Avoma, Salesforce)
- API client for serverless function

## Troubleshooting

See [HEALTH_CHECK.md](./HEALTH_CHECK.md) for detailed troubleshooting guide.

Common issues:
- **Google Sign-In button not appearing** → Check OAuth origins in Google Console
- **API errors** → Verify `GEMINI_API_KEY` is set in Vercel
- **Build failures** → Check Node.js version (18+)

## Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Step-by-step deployment guide
- [HEALTH_CHECK.md](./HEALTH_CHECK.md) - Troubleshooting and health checks
- [OPTIMIZATIONS.md](./OPTIMIZATIONS.md) - Optimization report and best practices

## License

Proprietary - LeanData

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

