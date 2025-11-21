-- Add Apollo.io API key to Supabase
-- Run this in your Supabase SQL editor or via CLI

-- First, ensure the apollo_configs table exists (run migration 010 if not already done)
-- Then insert the API key

INSERT INTO apollo_configs (api_key, is_active)
VALUES ('YEw3lTrYaq8n_ETikni5eA', true)
ON CONFLICT DO NOTHING;

-- Verify the key was added
SELECT id, is_active, created_at, 
       CASE 
         WHEN api_key IS NOT NULL THEN 'API key present' 
         ELSE 'No API key' 
       END as key_status
FROM apollo_configs
WHERE is_active = true
ORDER BY created_at DESC
LIMIT 1;

