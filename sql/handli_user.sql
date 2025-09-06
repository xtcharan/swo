-- Step 1: Drop the old trigger if it exists, to avoid the error.
-- The "IF EXISTS" clause prevents an error if the trigger isn't there.
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Now, create the function and trigger again.
-- We use "CREATE OR REPLACE FUNCTION" so it updates the function if it already exists.

CREATE OR REPLACE FUNCTION public.handle_new_user_and_set_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert a new row into public.profiles
  INSERT INTO public.profiles (id, email, attendee_type)
  VALUES (
    new.id, -- The user's ID from the auth.users table
    new.email, -- The user's email from the auth.users table

    -- This is the logic to determine if the user is a Guest or a pre-provisioned Student.
    -- We check the 'raw_user_meta_data' that can be passed during signup.
    CASE
      WHEN new.raw_user_meta_data->>'is_guest' = 'true' THEN 'external'
      ELSE 'internal'
    END
  );
  RETURN new;
END;
$$;

-- Step 3: Recreate the trigger to connect it to the function.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_and_set_role();