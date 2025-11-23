-- Migration: Add Contact Fields to Cases Table
-- Adds contact_email, contact_id, and contact_name to track case involvement

-- Add contact fields to cases table
ALTER TABLE cases ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS contact_id TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS contact_name TEXT;

-- Create index on contact_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_cases_contact_email ON cases(contact_email);
CREATE INDEX IF NOT EXISTS idx_cases_contact_id ON cases(contact_id);

