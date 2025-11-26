-- Migration: Add input_hash column to sentiment_history table
-- This allows us to detect if the input data has changed and avoid re-running analysis

-- Add input_hash column to sentiment_history table
ALTER TABLE sentiment_history ADD COLUMN IF NOT EXISTS input_hash TEXT;

-- Create index for efficient lookups by input hash
CREATE INDEX IF NOT EXISTS idx_sentiment_history_input_hash ON sentiment_history(input_hash);

-- Add comment for documentation
COMMENT ON COLUMN sentiment_history.input_hash IS 'SHA256 hash of input data (transcription + key metrics) to detect duplicate analyses';

