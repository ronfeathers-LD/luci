-- Add User Login Tracking System
-- Run this migration in your Supabase SQL Editor

-- User logins table to track login events
CREATE TABLE IF NOT EXISTS user_logins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logged_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_logins_user_id ON user_logins(user_id);
CREATE INDEX IF NOT EXISTS idx_user_logins_logged_in_at ON user_logins(logged_in_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_logins_user_logged_in ON user_logins(user_id, logged_in_at DESC);

-- Enable Row Level Security
ALTER TABLE user_logins ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access" ON user_logins
  FOR ALL USING (true);

-- Function to get user login statistics
CREATE OR REPLACE FUNCTION get_user_login_stats(user_uuid UUID)
RETURNS TABLE (
  last_login TIMESTAMP WITH TIME ZONE,
  login_count BIGINT,
  first_login TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    MAX(ul.logged_in_at) as last_login,
    COUNT(*) as login_count,
    MIN(ul.logged_in_at) as first_login
  FROM user_logins ul
  WHERE ul.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

