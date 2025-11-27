#!/usr/bin/env node

/**
 * Script to verify Google Calendar OAuth configuration
 * Checks if environment variables are set correctly
 */

const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

console.log('🔍 Verifying Google Calendar OAuth Configuration...\n');

const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI || 'http://localhost:3000/api/google-calendar-auth';

console.log('Environment Variables:');
console.log('  GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID || '(not set)');
console.log('  GOOGLE_CALENDAR_CLIENT_ID:', process.env.GOOGLE_CALENDAR_CLIENT_ID || '(not set)');
console.log('  GOOGLE_CALENDAR_CLIENT_SECRET:', process.env.GOOGLE_CALENDAR_CLIENT_SECRET ? '***' + process.env.GOOGLE_CALENDAR_CLIENT_SECRET.slice(-4) : '(not set)');
console.log('  GOOGLE_CALENDAR_REDIRECT_URI:', redirectUri);
console.log('');

console.log('Resolved Configuration:');
console.log('  Client ID:', clientId || '(MISSING)');
console.log('  Client Secret:', clientSecret ? '***' + clientSecret.slice(-4) : '(MISSING)');
console.log('  Redirect URI:', redirectUri);
console.log('');

// Validate format
if (clientId) {
  const isValidFormat = clientId.includes('.apps.googleusercontent.com');
  if (!isValidFormat) {
    console.log('⚠️  WARNING: Client ID format looks incorrect.');
    console.log('   Expected format: 123456789-abc123def456.apps.googleusercontent.com');
    console.log('   Your format:', clientId.substring(0, 30) + '...');
  } else {
    console.log('✅ Client ID format looks correct');
  }
}

if (clientSecret) {
  const isValidFormat = clientSecret.startsWith('GOCSPX-');
  if (!isValidFormat) {
    console.log('⚠️  WARNING: Client Secret format looks incorrect.');
    console.log('   Expected format: GOCSPX-...');
    console.log('   Your format:', clientSecret.substring(0, 10) + '...');
  } else {
    console.log('✅ Client Secret format looks correct');
  }
}

if (!clientId || !clientSecret) {
  console.log('\n❌ Configuration incomplete!');
  console.log('   Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local');
  process.exit(1);
}

console.log('\n✅ Configuration looks good!');
console.log('\n📋 Next Steps:');
console.log('1. Verify in Google Cloud Console that:');
console.log('   - Client ID:', clientId);
console.log('   - Client Secret matches:', '***' + clientSecret.slice(-4));
console.log('   - Redirect URI is authorized:', redirectUri);
console.log('2. Make sure Calendar scopes are added to OAuth consent screen');
console.log('3. Restart your dev server: npx vercel dev');

