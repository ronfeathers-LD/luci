-- Add System Settings Table
-- Run this migration in your Supabase SQL Editor

-- System settings table for storing configurable system parameters
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL, -- 'cache', 'api_limits', 'rate_limiting', 'features', 'ai'
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL, -- Store various types as JSON
  description TEXT,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, setting_key)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_category_key ON system_settings(category, setting_key);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access" ON system_settings
  FOR ALL USING (true);

-- Insert default cache TTL settings
INSERT INTO system_settings (category, setting_key, setting_value, description) VALUES
  ('cache', 'ACCOUNTS', '1'::jsonb, 'Cache TTL for accounts in hours'),
  ('cache', 'CASES', '1'::jsonb, 'Cache TTL for cases in hours'),
  ('cache', 'CONTACTS', '24'::jsonb, 'Cache TTL for contacts in hours'),
  ('cache', 'TRANSCRIPTIONS', '24'::jsonb, 'Cache TTL for transcriptions in hours'),
  ('cache', 'LINKEDIN_PROFILES', '24'::jsonb, 'Cache TTL for LinkedIn profiles in hours'),
  ('cache', 'CALENDAR_EVENTS', '15'::jsonb, 'Cache TTL for calendar events in minutes')
ON CONFLICT (category, setting_key) DO NOTHING;

-- Insert default API limit settings
INSERT INTO system_settings (category, setting_key, setting_value, description) VALUES
  ('api_limits', 'CASES_PER_ACCOUNT', '25'::jsonb, 'Maximum number of cases to fetch per account'),
  ('api_limits', 'CONTACTS_PER_ACCOUNT', '100'::jsonb, 'Maximum number of contacts to fetch per account'),
  ('api_limits', 'ACCOUNTS_PER_USER', '1000'::jsonb, 'Maximum number of accounts per user')
ON CONFLICT (category, setting_key) DO NOTHING;

-- Insert default rate limiting settings
INSERT INTO system_settings (category, setting_key, setting_value, description) VALUES
  ('rate_limiting', 'WINDOW_MS', '60000'::jsonb, 'Rate limit window duration in milliseconds (1 minute)'),
  ('rate_limiting', 'MAX_REQUESTS', '10'::jsonb, 'Maximum requests allowed per window per IP')
ON CONFLICT (category, setting_key) DO NOTHING;

-- Insert default timeout settings
INSERT INTO system_settings (category, setting_key, setting_value, description) VALUES
  ('timeouts', 'REQUEST_TIMEOUT_MS', '30000'::jsonb, 'Default request timeout in milliseconds (30 seconds)')
ON CONFLICT (category, setting_key) DO NOTHING;

-- Insert default AI/Gemini settings
INSERT INTO system_settings (category, setting_key, setting_value, description) VALUES
  ('ai', 'GEMINI_MODEL', '"auto"'::jsonb, 'Gemini model to use (auto = auto-discover)'),
  ('ai', 'GEMINI_API_TIMEOUT_MS', '45000'::jsonb, 'Gemini API timeout in milliseconds (45 seconds)'),
  ('ai', 'SKIP_MODEL_DISCOVERY', 'false'::jsonb, 'Skip model discovery and use specified model directly')
ON CONFLICT (category, setting_key) DO NOTHING;

-- Insert default feature flags
INSERT INTO system_settings (category, setting_key, setting_value, description) VALUES
  ('features', 'ENABLE_AVOMA_TRANSCRIPTIONS', 'true'::jsonb, 'Enable Avoma transcription integration'),
  ('features', 'ENABLE_GOOGLE_CALENDAR', 'true'::jsonb, 'Enable Google Calendar integration'),
  ('features', 'ENABLE_SENTIMENT_ANALYSIS', 'true'::jsonb, 'Enable sentiment analysis feature')
ON CONFLICT (category, setting_key) DO NOTHING;

-- Add comment for documentation
COMMENT ON TABLE system_settings IS 'Stores configurable system settings and parameters';

