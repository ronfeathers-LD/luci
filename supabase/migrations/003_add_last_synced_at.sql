-- Add last_synced_at column to accounts table for cache management
-- This allows us to track when accounts were last synced from Salesforce

-- Add column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounts' AND column_name = 'last_synced_at'
  ) THEN
    ALTER TABLE accounts ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    
    -- Set last_synced_at to updated_at for existing records
    UPDATE accounts 
    SET last_synced_at = COALESCE(updated_at, created_at, NOW())
    WHERE last_synced_at IS NULL;
  END IF;
END $$;

