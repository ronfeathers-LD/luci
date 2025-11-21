-- Update LinkedIn config with redirect URI
-- IMPORTANT: Replace 'ld-luci.vercel.app' with your actual Vercel domain

UPDATE linkedin_configs
SET 
  redirect_uri = 'https://ld-luci.vercel.app/api/linkedin-auth',
  updated_at = NOW()
WHERE is_active = true
  AND client_id = '86vb3srl5hijb5'; -- Your specific client ID

-- Verify the update
SELECT 
  id,
  client_id,
  CASE WHEN redirect_uri IS NOT NULL THEN 'Yes' ELSE 'No' END as has_redirect,
  redirect_uri,
  is_active,
  updated_at
FROM linkedin_configs
WHERE is_active = true;

