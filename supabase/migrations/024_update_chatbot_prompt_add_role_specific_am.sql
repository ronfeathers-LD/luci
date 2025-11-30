-- Update chatbot prompt to add role_specific_am if missing
-- This migration updates the existing PROMPT_BASE setting to include role_specific_am

UPDATE system_settings
SET setting_value = setting_value || '{
  "role_specific_am": "- Focus on relationship building and revenue opportunities\n   - Identify decision-makers and influencers to engage\n   - Suggest strategic touchpoints and sales activities\n   - Recommend cross-sell/upsell opportunities based on account data"
}'::jsonb
WHERE category = 'chatbot' 
  AND setting_key = 'PROMPT_BASE'
  AND NOT (setting_value ? 'role_specific_am');

