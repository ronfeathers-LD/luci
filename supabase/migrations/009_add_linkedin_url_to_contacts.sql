-- Migration: Add LinkedIn URL column to contacts table
-- This allows us to store LinkedIn profile URLs from Salesforce for enrichment

ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Create index for LinkedIn URL lookups
CREATE INDEX IF NOT EXISTS idx_contacts_linkedin_url ON contacts(linkedin_url) WHERE linkedin_url IS NOT NULL;

-- Add comment
COMMENT ON COLUMN contacts.linkedin_url IS 'LinkedIn profile URL from Salesforce Person_LinkedIn__c field';

