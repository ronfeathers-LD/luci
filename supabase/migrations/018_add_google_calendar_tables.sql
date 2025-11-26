-- Migration: Add Google Calendar Integration Tables
-- Stores Google Calendar OAuth tokens per user and calendar events

-- Google Calendar OAuth tokens (per-user)
CREATE TABLE IF NOT EXISTS google_calendar_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL, -- OAuth access token (encrypted in production)
  refresh_token TEXT, -- OAuth refresh token (encrypted in production)
  token_expires_at TIMESTAMP WITH TIME ZONE,
  scope TEXT, -- OAuth scopes granted
  is_active BOOLEAN DEFAULT true,
  last_tested TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_google_calendar_tokens_user_id ON google_calendar_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_google_calendar_tokens_is_active ON google_calendar_tokens(is_active);

-- Google Calendar Events (cached events for matching with accounts)
CREATE TABLE IF NOT EXISTS google_calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL, -- Google Calendar event ID
  summary TEXT, -- Event title
  description TEXT, -- Event description
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  attendees JSONB, -- Array of attendee objects with email, name, etc.
  organizer_email TEXT,
  organizer_name TEXT,
  conference_data JSONB, -- Video conference info (Zoom, Meet, etc.)
  html_link TEXT, -- Link to event in Google Calendar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Create indexes for calendar events
CREATE INDEX IF NOT EXISTS idx_google_calendar_events_user_id ON google_calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_google_calendar_events_start_time ON google_calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_google_calendar_events_event_id ON google_calendar_events(event_id);
CREATE INDEX IF NOT EXISTS idx_google_calendar_events_attendees ON google_calendar_events USING GIN(attendees);

-- Calendar Event to Account Matches (links events to Salesforce accounts)
CREATE TABLE IF NOT EXISTS calendar_event_account_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES google_calendar_events(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  salesforce_account_id TEXT, -- For quick lookups
  match_confidence TEXT, -- 'high', 'medium', 'low'
  match_reason TEXT, -- Why this match was made (e.g., "Account name in event title", "Attendee email matches contact")
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, account_id)
);

-- Create indexes for matches
CREATE INDEX IF NOT EXISTS idx_calendar_event_account_matches_event_id ON calendar_event_account_matches(event_id);
CREATE INDEX IF NOT EXISTS idx_calendar_event_account_matches_account_id ON calendar_event_account_matches(account_id);
CREATE INDEX IF NOT EXISTS idx_calendar_event_account_matches_salesforce_account_id ON calendar_event_account_matches(salesforce_account_id);

-- Triggers to automatically update updated_at
CREATE TRIGGER update_google_calendar_tokens_updated_at BEFORE UPDATE ON google_calendar_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_google_calendar_events_updated_at BEFORE UPDATE ON google_calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE google_calendar_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_event_account_matches ENABLE ROW LEVEL SECURITY;

-- Policies: Service role can do everything
CREATE POLICY "Service role full access" ON google_calendar_tokens
  FOR ALL USING (true);

CREATE POLICY "Service role full access" ON google_calendar_events
  FOR ALL USING (true);

CREATE POLICY "Service role full access" ON calendar_event_account_matches
  FOR ALL USING (true);

-- Add comments for documentation
COMMENT ON TABLE google_calendar_tokens IS 'Stores Google Calendar OAuth tokens per user for accessing their calendar';
COMMENT ON TABLE google_calendar_events IS 'Cached Google Calendar events for matching with Salesforce accounts';
COMMENT ON TABLE calendar_event_account_matches IS 'Links calendar events to Salesforce accounts based on matching logic';

