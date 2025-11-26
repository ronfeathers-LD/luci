-- Assign admin role to an existing user
-- Replace 'your-email@example.com' with the actual email address
-- Or use the user ID directly

-- Assign admin role to user (ron.feathers@leandata.com)
-- This will assign the admin role to the user with ID: f1237d19-dbca-43d8-861c-f42fa94e35a3
-- Only runs if the user exists (for local dev, user may not exist yet)

DO $$
DECLARE
  v_user_id UUID;
  v_admin_role_id UUID;
BEGIN
  -- Check if user exists
  SELECT id INTO v_user_id FROM users WHERE id = 'f1237d19-dbca-43d8-861c-f42fa94e35a3'::UUID;
  
  -- Get admin role ID
  SELECT id INTO v_admin_role_id FROM roles WHERE name = 'admin' LIMIT 1;
  
  -- Assign admin role if user exists
  IF v_user_id IS NOT NULL AND v_admin_role_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role_id)
    VALUES (v_user_id, v_admin_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
    
    RAISE NOTICE 'Admin role assigned to user: %', v_user_id;
  ELSE
    RAISE NOTICE 'User not found in local database. Skipping admin role assignment.';
  END IF;
END $$;

-- Verify the assignment
SELECT 
  u.email,
  u.name,
  r.name as role_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.id = 'f1237d19-dbca-43d8-861c-f42fa94e35a3'::UUID;

-- Option 2: Assign to user by ID (if you know the user ID)
-- Replace 'f1237d19-dbca-43d8-861c-f42fa94e35a3' with your actual user ID
/*
INSERT INTO user_roles (user_id, role_id)
SELECT 
  'f1237d19-dbca-43d8-861c-f42fa94e35a3'::UUID,
  id
FROM roles
WHERE name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;
*/

