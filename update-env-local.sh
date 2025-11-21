#!/bin/bash
# Script to update .env.local with local Supabase values

echo "Updating .env.local with local Supabase configuration..."

# Get the service role key from Supabase status
SERVICE_ROLE_KEY=$(supabase status 2>/dev/null | grep "service_role key" | awk '{print $3}')

if [ -z "$SERVICE_ROLE_KEY" ]; then
    echo "Error: Could not get service role key. Is Supabase running?"
    echo "Run: supabase start"
    exit 1
fi

# Backup existing .env.local
if [ -f .env.local ]; then
    cp .env.local .env.local.backup
    echo "Backed up existing .env.local to .env.local.backup"
fi

# Create/update .env.local
cat > .env.local << EOF
# Local Development Environment Variables

# Supabase Configuration (Local)
SUPABASE_URL=http://127.0.0.1:54331
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY

# Google OAuth (for Google Sign-In)
GOOGLE_CLIENT_ID=AIzaSyAxl8LZtt_N7I6EBjw7zIGb8EEw5OH44qk

# Gemini API (for sentiment analysis)
GEMINI_API_KEY=AIzaSyAxl8LZtt_N7I6EBjw7zIGb8EEw5OH44qk

# Optional: Override default port
PORT=3000
EOF

echo "✅ Updated .env.local with local Supabase configuration"
echo ""
echo "Current SUPABASE_URL: http://127.0.0.1:54331"
echo "Service role key: $SERVICE_ROLE_KEY"
echo ""
echo "⚠️  IMPORTANT: Restart your Vercel dev server for changes to take effect!"
echo "   Stop the server (Ctrl+C) and run: npx vercel dev"
