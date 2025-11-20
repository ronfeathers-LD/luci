-- Add salesforce_configs table for storing Salesforce credentials
-- This matches the SOW-Generator setup

-- Create salesforce_configs table
CREATE TABLE IF NOT EXISTS salesforce_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  security_token TEXT,
  login_url TEXT DEFAULT 'https://login.salesforce.com',
  is_active BOOLEAN DEFAULT true,
  last_tested TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on is_active for faster lookups
CREATE INDEX IF NOT EXISTS idx_salesforce_configs_is_active ON salesforce_configs(is_active);

-- Function to update updated_at timestamp (if not already exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_salesforce_configs_updated_at ON salesforce_configs;
CREATE TRIGGER update_salesforce_configs_updated_at 
  BEFORE UPDATE ON salesforce_configs
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE salesforce_configs ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
DROP POLICY IF EXISTS "Service role full access" ON salesforce_configs;
CREATE POLICY "Service role full access" ON salesforce_configs
  FOR ALL USING (true);

-- Insert LeanData Salesforce credentials
-- Note: This will insert only if no active config exists
INSERT INTO salesforce_configs (username, password, security_token, login_url, is_active)
SELECT 
  'sow.app.integration@leandata.com',
  'S0wP@ssw0rd',
  'o7VFJrMqGhCn8nu0DZuxLtIw',
  'https://leandata.my.salesforce.com',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM salesforce_configs WHERE is_active = true
);

