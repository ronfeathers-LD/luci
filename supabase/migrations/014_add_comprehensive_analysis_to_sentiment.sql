-- Migration: Add comprehensive_analysis column to sentiment_history table
-- This allows storing the full detailed analysis alongside the summary

-- Add comprehensive_analysis column to sentiment_history table
ALTER TABLE sentiment_history ADD COLUMN IF NOT EXISTS comprehensive_analysis TEXT;

-- Add comment for documentation
COMMENT ON COLUMN sentiment_history.comprehensive_analysis IS 'Detailed comprehensive sentiment analysis (500-800 words) for CSMs and Account Managers';

