-- Add Avoma integration tables for transcriptions and config

-- Avoma configs table (for storing Avoma API credentials)
CREATE TABLE IF NOT EXISTS avoma_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key TEXT NOT NULL,
  api_url TEXT DEFAULT 'https://api.avoma.com/v1',
  is_active BOOLEAN DEFAULT true,
  last_tested TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on is_active for faster lookups
CREATE INDEX IF NOT EXISTS idx_avoma_configs_is_active ON avoma_configs(is_active);

-- Transcriptions table (for caching Avoma transcriptions)
CREATE TABLE IF NOT EXISTS transcriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  avoma_meeting_uuid TEXT UNIQUE NOT NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  salesforce_account_id TEXT, -- Reference to Salesforce Account ID
  customer_identifier TEXT, -- Customer name or identifier used to search
  transcription_text TEXT NOT NULL,
  speakers JSONB, -- Store speaker information as JSON
  meeting_subject TEXT,
  meeting_date TIMESTAMP WITH TIME ZONE,
  meeting_duration INTEGER, -- Duration in seconds
  meeting_url TEXT,
  attendees JSONB, -- Store attendees as JSON
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for transcriptions
CREATE INDEX IF NOT EXISTS idx_transcriptions_avoma_meeting_uuid ON transcriptions(avoma_meeting_uuid);
CREATE INDEX IF NOT EXISTS idx_transcriptions_account_id ON transcriptions(account_id);
CREATE INDEX IF NOT EXISTS idx_transcriptions_salesforce_account_id ON transcriptions(salesforce_account_id);
CREATE INDEX IF NOT EXISTS idx_transcriptions_customer_identifier ON transcriptions(customer_identifier);
CREATE INDEX IF NOT EXISTS idx_transcriptions_last_synced_at ON transcriptions(last_synced_at);

-- Triggers to automatically update updated_at
CREATE TRIGGER update_avoma_configs_updated_at BEFORE UPDATE ON avoma_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transcriptions_updated_at BEFORE UPDATE ON transcriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE avoma_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access" ON avoma_configs
  FOR ALL USING (true);

CREATE POLICY "Service role full access" ON transcriptions
  FOR ALL USING (true);

