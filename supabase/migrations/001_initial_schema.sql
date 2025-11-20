-- Initial Schema for LUCI Application
-- Run this migration in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_sub TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  picture TEXT,
  role TEXT DEFAULT 'Account Manager',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on google_sub for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Accounts table (for storing Salesforce account data)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salesforce_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  account_tier TEXT,
  contract_value TEXT,
  industry TEXT,
  annual_revenue NUMERIC,
  owner_id TEXT,
  owner_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on salesforce_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_accounts_salesforce_id ON accounts(salesforce_id);
CREATE INDEX IF NOT EXISTS idx_accounts_owner_id ON accounts(owner_id);

-- User-Account relationships (many-to-many)
-- This allows users to have access to multiple accounts based on their role
CREATE TABLE IF NOT EXISTS user_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, account_id)
);

-- Create indexes for user_accounts
CREATE INDEX IF NOT EXISTS idx_user_accounts_user_id ON user_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_accounts_account_id ON user_accounts(account_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Salesforce configs table (for storing Salesforce credentials)
CREATE TABLE IF NOT EXISTS salesforce_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  security_token TEXT,
  login_url TEXT DEFAULT 'https://login.salesforce.com',
  is_active BOOLEAN DEFAULT true,
  last_tested TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on is_active for faster lookups
CREATE INDEX IF NOT EXISTS idx_salesforce_configs_is_active ON salesforce_configs(is_active);

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salesforce_configs_updated_at BEFORE UPDATE ON salesforce_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true); -- Service role key bypasses RLS

-- Policy: Service role can do everything
CREATE POLICY "Service role full access" ON accounts
  FOR ALL USING (true);

CREATE POLICY "Service role full access" ON user_accounts
  FOR ALL USING (true);

CREATE POLICY "Service role full access" ON salesforce_configs
  FOR ALL USING (true);

