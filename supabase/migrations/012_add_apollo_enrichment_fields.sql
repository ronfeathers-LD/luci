-- Migration: Add Apollo.io Enrichment Fields to linkedin_profiles
-- Extends linkedin_profiles table to store comprehensive Apollo.io enrichment data

-- Contact Verification
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS email_status TEXT;  -- verified/unverified/invalid
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS phone_status TEXT;  -- verified/unverified/invalid
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN;
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN;

-- Company Intelligence (from Apollo organization data)
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS company_industry TEXT;
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS company_size INTEGER;  -- Number of employees
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS company_revenue NUMERIC;
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS company_website_url TEXT;
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS company_linkedin_url TEXT;
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS company_twitter_url TEXT;
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS company_facebook_url TEXT;

-- Technographic Data (technologies used by company)
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS company_technologies TEXT[];  -- Array of technology names

-- Employment History
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS previous_companies TEXT[];  -- Array of previous company names
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS previous_titles TEXT[];  -- Array of previous job titles
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS employment_history JSONB;  -- Full employment history with dates

-- Education
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS education JSONB;  -- Education history (schools, degrees, dates)

-- Social Profiles
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS personal_emails TEXT[];  -- Alternative email addresses
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS personal_phone_numbers TEXT[];  -- Alternative phone numbers

-- Skills & Interests
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS skills TEXT[];  -- Array of skills
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS interests TEXT[];  -- Array of interests
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS languages TEXT[];  -- Array of languages spoken

-- Buying Intent & Signals
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS job_change_likelihood INTEGER;  -- 0-100 score
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS buying_signals JSONB;  -- Buying intent signals
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS technology_adoptions JSONB;  -- Technology adoption signals
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS hiring_signals JSONB;  -- Hiring/growth signals

-- Engagement Metrics (if available from Apollo)
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS email_open_rate NUMERIC;  -- 0-100
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS email_click_rate NUMERIC;  -- 0-100
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS response_rate NUMERIC;  -- 0-100
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS last_contacted TIMESTAMP WITH TIME ZONE;
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS last_engaged TIMESTAMP WITH TIME ZONE;

-- Raw Apollo Data (for reference and future use)
ALTER TABLE linkedin_profiles ADD COLUMN IF NOT EXISTS apollo_raw_data JSONB;  -- Store full Apollo API response

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_email_status ON linkedin_profiles(email_status);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_phone_status ON linkedin_profiles(phone_status);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_company_industry ON linkedin_profiles(company_industry);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_job_change_likelihood ON linkedin_profiles(job_change_likelihood);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_last_contacted ON linkedin_profiles(last_contacted);

-- Add GIN index for array fields (for efficient searching)
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_technologies_gin ON linkedin_profiles USING GIN(company_technologies);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_previous_companies_gin ON linkedin_profiles USING GIN(previous_companies);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_skills_gin ON linkedin_profiles USING GIN(skills);

-- Add comments for documentation
COMMENT ON COLUMN linkedin_profiles.email_status IS 'Apollo.io email verification status: verified/unverified/invalid';
COMMENT ON COLUMN linkedin_profiles.company_technologies IS 'Array of technologies used by the contact company (technographic data)';
COMMENT ON COLUMN linkedin_profiles.employment_history IS 'Full employment history with dates, companies, and titles';
COMMENT ON COLUMN linkedin_profiles.job_change_likelihood IS 'Apollo.io score (0-100) indicating likelihood of job change';
COMMENT ON COLUMN linkedin_profiles.apollo_raw_data IS 'Full Apollo.io API response stored as JSONB for reference';

