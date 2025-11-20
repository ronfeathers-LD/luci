-- Add Cases table for caching Salesforce Cases/Tickets

CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salesforce_id TEXT UNIQUE NOT NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  salesforce_account_id TEXT NOT NULL,
  case_number TEXT,
  subject TEXT,
  status TEXT,
  priority TEXT,
  type TEXT,
  reason TEXT,
  origin TEXT,
  created_date TIMESTAMP WITH TIME ZONE,
  closed_date TIMESTAMP WITH TIME ZONE,
  description TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for cases
CREATE INDEX IF NOT EXISTS idx_cases_salesforce_id ON cases(salesforce_id);
CREATE INDEX IF NOT EXISTS idx_cases_account_id ON cases(account_id);
CREATE INDEX IF NOT EXISTS idx_cases_salesforce_account_id ON cases(salesforce_account_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_created_date ON cases(created_date);
CREATE INDEX IF NOT EXISTS idx_cases_last_synced_at ON cases(last_synced_at);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access" ON cases
  FOR ALL USING (true);

