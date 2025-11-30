-- Make a user an admin in local database
-- Replace 'your-email@example.com' with your actual email address

-- Step 1: Find your user ID (run this first to get your user ID)
-- SELECT id, email, name FROM users WHERE email = 'your-email@example.com';

-- Step 2: Grant admin role by email (replace email below)
DO $$
DECLARE
  target_user_id UUID;
  admin_role_id UUID;
  user_email TEXT := 'your-email@example.com'; -- REPLACE WITH YOUR EMAIL
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id
  FROM users
  WHERE email = user_email
  LIMIT 1;

  -- Get admin role ID
  SELECT id INTO admin_role_id
  FROM roles
  WHERE LOWER(name) = 'admin'
  LIMIT 1;

  -- Check if user and role exist
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found with email: %. Please check the email address or find your user ID first.', user_email;
  END IF;

  IF admin_role_id IS NULL THEN
    RAISE EXCEPTION 'Admin role not found. Please run migration 016_add_roles_system.sql first.';
  END IF;

  -- Assign admin role (ignore if already assigned)
  INSERT INTO user_roles (user_id, role_id)
  VALUES (target_user_id, admin_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RAISE NOTICE 'Admin role assigned successfully to user: % (email: %)', target_user_id, user_email;
END $$;

-- Step 3: Verify the assignment
SELECT 
  u.email,
  u.name,
  r.name as role_name,
  ur.assigned_at
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE LOWER(r.name) = 'admin'
ORDER BY ur.assigned_at DESC;
