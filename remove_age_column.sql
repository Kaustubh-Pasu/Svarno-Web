-- SQL Script to Remove Age Column from Users Table
-- This script removes the age column and related constraints from the users table
-- Run this script in your Supabase SQL editor

-- Step 1: Drop the age constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_age_check;

-- Step 2: Remove the age column from the users table
ALTER TABLE users DROP COLUMN IF EXISTS age;

-- Step 3: Update the handle_new_user function to remove age handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Verify the changes by checking the table structure
-- This query will show the current structure of the users table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 5: Optional - Check if there are any existing users with age data
-- (This will only work if the age column still exists)
-- SELECT id, name, age, email FROM users LIMIT 5;

-- Note: After running this script:
-- 1. The age column will be completely removed from the users table
-- 2. The age constraint (13-18 years old) will be removed
-- 3. The handle_new_user function will no longer try to insert age data
-- 4. New user registrations will not require or store age information
-- 5. Existing users will have their age data permanently removed

-- If you need to rollback this change, you would need to:
-- 1. Add the age column back: ALTER TABLE users ADD COLUMN age INTEGER;
-- 2. Add the constraint back: ALTER TABLE users ADD CONSTRAINT users_age_check CHECK (age >= 13 AND age <= 18);
-- 3. Update the handle_new_user function to include age handling again
