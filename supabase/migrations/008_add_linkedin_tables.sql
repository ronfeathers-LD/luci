-- Migration: Add LinkedIn Integration Tables
-- Stores LinkedIn profile data, engagement metrics, and API configuration

-- LinkedIn API Configuration
CREATE TABLE IF NOT EXISTS linkedin_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  redirect_uri TEXT,
  is_active BOOLEAN DEFAULT true,
  last_tested TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  access_token TEXT, -- OAuth access token (encrypted in production)
  refresh_token TEXT, -- OAuth refresh token (encrypted in production)
  token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on is_active for faster lookups
CREATE INDEX IF NOT EXISTS idx_linkedin_configs_is_active ON linkedin_configs(is_active);

-- LinkedIn Profile Data (enriched from contacts)
CREATE TABLE IF NOT EXISTS linkedin_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  salesforce_contact_id TEXT, -- For quick lookups
  linkedin_url TEXT,
  linkedin_urn TEXT UNIQUE, -- LinkedIn URN (e.g., urn:li:person:123456)
  
  -- Profile Information
  first_name TEXT,
  last_name TEXT,
  headline TEXT,
  current_title TEXT,
  current_company TEXT,
  company_urn TEXT, -- LinkedIn company URN
  location TEXT,
  profile_picture_url TEXT,
  
  -- Engagement Metrics
  profile_views_30d INTEGER DEFAULT 0,
  connection_count INTEGER,
  mutual_connections INTEGER DEFAULT 0,
  
  -- Activity Indicators
  profile_updated_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  job_changed_recently BOOLEAN DEFAULT false,
  days_in_current_role INTEGER,
  
  -- Company Engagement (if available via MDP)
  posts_about_company INTEGER DEFAULT 0,
  comments_on_company_posts INTEGER DEFAULT 0,
  shares_of_company_content INTEGER DEFAULT 0,
  reactions_to_company_posts INTEGER DEFAULT 0,
  
  -- Metadata
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for linkedin_profiles
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_contact_id ON linkedin_profiles(contact_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_salesforce_contact_id ON linkedin_profiles(salesforce_contact_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_linkedin_url ON linkedin_profiles(linkedin_url);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_linkedin_urn ON linkedin_profiles(linkedin_urn);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_last_synced_at ON linkedin_profiles(last_synced_at);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_job_changed_recently ON linkedin_profiles(job_changed_recently);

-- LinkedIn Company Engagement (aggregated company-level data)
CREATE TABLE IF NOT EXISTS linkedin_company_engagement (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  salesforce_account_id TEXT NOT NULL,
  
  -- Engagement Metrics
  total_mentions INTEGER DEFAULT 0,
  positive_mentions INTEGER DEFAULT 0,
  negative_mentions INTEGER DEFAULT 0,
  neutral_mentions INTEGER DEFAULT 0,
  
  -- Engagement Breakdown
  total_reactions INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  
  -- Time Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Metadata
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(salesforce_account_id, period_start, period_end)
);

-- Create indexes for company engagement
CREATE INDEX IF NOT EXISTS idx_linkedin_company_engagement_account_id ON linkedin_company_engagement(account_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_company_engagement_salesforce_account_id ON linkedin_company_engagement(salesforce_account_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_company_engagement_period ON linkedin_company_engagement(period_start, period_end);

-- Triggers to automatically update updated_at
CREATE TRIGGER update_linkedin_configs_updated_at BEFORE UPDATE ON linkedin_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_linkedin_profiles_updated_at BEFORE UPDATE ON linkedin_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_linkedin_company_engagement_updated_at BEFORE UPDATE ON linkedin_company_engagement
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE linkedin_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_company_engagement ENABLE ROW LEVEL SECURITY;

-- Policies: Service role can do everything
CREATE POLICY "Service role full access" ON linkedin_configs
  FOR ALL USING (true);

CREATE POLICY "Service role full access" ON linkedin_profiles
  FOR ALL USING (true);

CREATE POLICY "Service role full access" ON linkedin_company_engagement
  FOR ALL USING (true);

-- Add comments for documentation
COMMENT ON TABLE linkedin_configs IS 'Stores LinkedIn API OAuth credentials and configuration';
COMMENT ON TABLE linkedin_profiles IS 'Enriched LinkedIn profile data for contacts, including engagement metrics';
COMMENT ON TABLE linkedin_company_engagement IS 'Aggregated company-level LinkedIn engagement metrics for sentiment analysis';

