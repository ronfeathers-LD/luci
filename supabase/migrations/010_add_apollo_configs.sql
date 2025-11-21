-- Migration: Add Apollo.io Integration Configuration
-- Stores Apollo.io API credentials for contact enrichment

CREATE TABLE IF NOT EXISTS apollo_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key TEXT NOT NULL, -- Apollo.io API key
  is_active BOOLEAN DEFAULT true,
  last_tested TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on is_active for faster lookups
CREATE INDEX IF NOT EXISTS idx_apollo_configs_is_active ON apollo_configs(is_active);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_apollo_configs_updated_at BEFORE UPDATE ON apollo_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE apollo_configs ENABLE ROW LEVEL SECURITY;

-- Policy: Service role full access
CREATE POLICY "Service role full access" ON apollo_configs
  FOR ALL USING (true);

-- Add comment for documentation
COMMENT ON TABLE apollo_configs IS 'Stores Apollo.io API credentials for contact enrichment';

