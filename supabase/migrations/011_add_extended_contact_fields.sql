-- Migration: Add Extended Salesforce Contact Fields
-- Adds additional fields for comprehensive contact data capture

-- Relationship & Hierarchy
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS reports_to_id TEXT;  -- Salesforce ReportsTo ID
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS reports_to_name TEXT;  -- Denormalized manager name
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS owner_id TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS owner_name TEXT;

-- Communication Preferences
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS do_not_call BOOLEAN DEFAULT false;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS email_opt_out BOOLEAN DEFAULT false;

-- Address Information
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS mailing_street TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS mailing_city TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS mailing_state TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS mailing_postal_code TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS mailing_country TEXT;

-- Engagement & Activity
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS created_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_modified_date TIMESTAMP WITH TIME ZONE;

-- Lead Source & Acquisition
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS lead_source TEXT;

-- Personal Details
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS birthdate DATE;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS assistant_name TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS assistant_phone TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS description TEXT;

-- Account Context (denormalized for easier querying)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS account_industry TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS account_annual_revenue NUMERIC;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS account_number_of_employees INTEGER;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS account_type TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS account_owner_id TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS account_owner_name TEXT;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_contacts_department ON contacts(department);
CREATE INDEX IF NOT EXISTS idx_contacts_reports_to_id ON contacts(reports_to_id);
CREATE INDEX IF NOT EXISTS idx_contacts_owner_id ON contacts(owner_id);
CREATE INDEX IF NOT EXISTS idx_contacts_last_activity_date ON contacts(last_activity_date);
CREATE INDEX IF NOT EXISTS idx_contacts_lead_source ON contacts(lead_source);
CREATE INDEX IF NOT EXISTS idx_contacts_mailing_country ON contacts(mailing_country);
CREATE INDEX IF NOT EXISTS idx_contacts_mailing_state ON contacts(mailing_state);

-- Add comments for documentation
COMMENT ON COLUMN contacts.department IS 'Department the contact works in';
COMMENT ON COLUMN contacts.reports_to_id IS 'Salesforce ID of the contact this person reports to';
COMMENT ON COLUMN contacts.owner_id IS 'Salesforce ID of the user who owns this contact';
COMMENT ON COLUMN contacts.last_activity_date IS 'Date of last activity/interaction with this contact';
COMMENT ON COLUMN contacts.lead_source IS 'Source from which the contact was acquired';

