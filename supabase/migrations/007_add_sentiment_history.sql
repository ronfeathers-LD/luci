-- Migration: Add Sentiment History Table
-- This table stores historical sentiment analysis results for tracking trends over time

CREATE TABLE IF NOT EXISTS sentiment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  salesforce_account_id TEXT NOT NULL, -- Keep for quick lookups without joins
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  summary TEXT NOT NULL,
  
  -- Data sources used for this analysis
  has_transcription BOOLEAN DEFAULT false,
  transcription_length INTEGER DEFAULT 0,
  cases_count INTEGER DEFAULT 0,
  avoma_calls_total INTEGER DEFAULT 0,
  avoma_calls_ready INTEGER DEFAULT 0,
  
  -- Metadata
  customer_identifier TEXT, -- Account name or identifier used
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_sentiment_history_account_id ON sentiment_history(account_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_history_salesforce_account_id ON sentiment_history(salesforce_account_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_history_user_id ON sentiment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_history_analyzed_at ON sentiment_history(analyzed_at DESC);
CREATE INDEX IF NOT EXISTS idx_sentiment_history_account_analyzed ON sentiment_history(account_id, analyzed_at DESC);

-- Composite index for common query pattern: get history for account ordered by date
CREATE INDEX IF NOT EXISTS idx_sentiment_history_account_date ON sentiment_history(account_id, analyzed_at DESC);

-- Enable Row Level Security
ALTER TABLE sentiment_history ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything
CREATE POLICY "Service role full access" ON sentiment_history
  FOR ALL USING (true);

-- Add comment for documentation
COMMENT ON TABLE sentiment_history IS 'Stores historical sentiment analysis results for tracking customer sentiment trends over time';
COMMENT ON COLUMN sentiment_history.score IS 'Sentiment score from 1-10 (1=very negative, 10=very positive)';
COMMENT ON COLUMN sentiment_history.analyzed_at IS 'When the sentiment analysis was performed (used for time-series queries)';

