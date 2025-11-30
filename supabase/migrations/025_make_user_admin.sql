-- Make a user an admin
-- Replace 'your-email@example.com' with your actual email address

-- Option 1: Grant admin role by email
DO $$
DECLARE
  target_user_id UUID;
  admin_role_id UUID;
BEGIN
  -- Find user by email (replace with your email)
  SELECT id INTO target_user_id
  FROM users
  WHERE email = 'your-email@example.com'
  LIMIT 1;

  -- Get admin role ID
  SELECT id INTO admin_role_id
  FROM roles
  WHERE LOWER(name) = 'admin'
  LIMIT 1;

  -- Check if user and role exist
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found. Please check the email address.';
  END IF;

  IF admin_role_id IS NULL THEN
    RAISE EXCEPTION 'Admin role not found. Please run migration 016_add_roles_system.sql first.';
  END IF;

  -- Assign admin role (ignore if already assigned)
  INSERT INTO user_roles (user_id, role_id)
  VALUES (target_user_id, admin_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RAISE NOTICE 'Admin role assigned successfully to user: %', target_user_id;
END $$;

-- Option 2: Grant admin role to all existing users (uncomment to use)
-- INSERT INTO user_roles (user_id, role_id)
-- SELECT u.id, r.id
-- FROM users u
-- CROSS JOIN roles r
-- WHERE LOWER(r.name) = 'admin'
-- ON CONFLICT (user_id, role_id) DO NOTHING;

