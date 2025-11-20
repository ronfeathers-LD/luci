-- Add Contacts table for caching Salesforce Contacts
-- Contacts are associated with Accounts and filtered to exclude "Unqualified" status

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salesforce_id TEXT UNIQUE NOT NULL,
  salesforce_account_id TEXT NOT NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  name TEXT,
  email TEXT,
  title TEXT,
  phone TEXT,
  mobile_phone TEXT,
  contact_status TEXT, -- Contact_Status__c or similar custom field
  account_name TEXT, -- Denormalized for easier querying
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for contacts
CREATE INDEX IF NOT EXISTS idx_contacts_salesforce_id ON contacts(salesforce_id);
CREATE INDEX IF NOT EXISTS idx_contacts_salesforce_account_id ON contacts(salesforce_account_id);
CREATE INDEX IF NOT EXISTS idx_contacts_account_id ON contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_last_synced_at ON contacts(last_synced_at);
CREATE INDEX IF NOT EXISTS idx_contacts_contact_status ON contacts(contact_status);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access" ON contacts
  FOR ALL USING (true);

