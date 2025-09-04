-- Supabase Database Setup for Domain-Based Authentication
-- Run this in your Supabase SQL editor

-- Create admin_whitelist table
CREATE TABLE IF NOT EXISTS admin_whitelist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    notes TEXT
);

-- Create profiles table with enhanced college tracking (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    domain TEXT,                                    -- NEW: extracted from email (e.g., 'dbcblr.edu.in')
    full_name TEXT,
    role TEXT DEFAULT 'attendee',
    college_verified BOOLEAN DEFAULT false,          -- NEW: true if domain matches official college
    is_admin BOOLEAN DEFAULT false,                  -- NEW: admin status for performance
    avatar_url TEXT,
    phone TEXT,
    academic_year TEXT,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create events table with privacy controls
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    capacity INTEGER DEFAULT 0,
    datetime TIMESTAMP WITH TIME ZONE NOT NULL,

    -- NEW: Privacy and Access Control Fields
    event_type TEXT DEFAULT 'private' CHECK (event_type IN ('public', 'private')),
    organizing_college TEXT,                         -- college that owns the event
    college_domain TEXT,                            -- @dbcblr.edu.in for college events
    visibility_level TEXT DEFAULT 'college' CHECK (visibility_level IN ('public', 'college', 'admin_only')),
    registration_deadline TIMESTAMP WITH TIME ZONE,
    max_registrations INTEGER DEFAULT NULL,         -- NULL means unlimited

    -- Enhanced event fields
    category TEXT,                                  -- 'academic', 'cultural', 'sports', 'technical', 'intercollegiate'
    entry_fee DECIMAL DEFAULT 0,
    is_team_event BOOLEAN DEFAULT false,
    min_team_size INTEGER DEFAULT 1,
    max_team_size INTEGER DEFAULT 1,
    prize_info JSONB,
    requirements TEXT,
    registration_rules TEXT,
    contact_email TEXT,
    contact_phone TEXT,

    -- Status and Meta
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'cancelled', 'completed')),
    tags TEXT[] DEFAULT '{}',

    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- For team events
    team_name TEXT,
    team_members JSONB,  -- array of {id, name, lead: boolean}

    -- Additional info
    special_requests TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),

    UNIQUE(event_id, user_id)  -- prevent duplicate registrations
);

-- Enable Row Level Security
ALTER TABLE admin_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_whitelist
-- Only admins can view admin whitelist
CREATE POLICY "Admins can view admin whitelist" ON admin_whitelist
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Only admins can insert into admin whitelist
CREATE POLICY "Admins can insert admin whitelist" ON admin_whitelist
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Only admins can update admin whitelist
CREATE POLICY "Admins can update admin whitelist" ON admin_whitelist
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- RLS Policies for profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- RLS Policies for events (Privacy-based access control)
-- 1. Public events: All authenticated users can view
CREATE POLICY "Public events are visible to all authenticated users" ON events
    FOR SELECT USING (
        visibility_level = 'public' AND status = 'active'
    );

-- 2. College events: Only users from the same college or admins can view
CREATE POLICY "College events are visible to same college or admins" ON events
    FOR SELECT USING (
        visibility_level = 'college' AND status = 'active' AND (
            -- Same college domain
            (SELECT domain FROM profiles WHERE profiles.id = auth.uid()) = college_domain
            -- OR admin access
            OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (role = 'admin' OR is_admin = true))
        )
    );

-- 3. Admin-only events: Only admins can view
CREATE POLICY "Admin-only events are visible to admins only" ON events
    FOR SELECT USING (
        visibility_level = 'admin_only' AND EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (role = 'admin' OR is_admin = true)
        )
    );

-- 4. Event creators and admins can modify events
CREATE POLICY "Event creators and admins can modify events" ON events
    FOR ALL USING (
        created_by = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (role = 'admin' OR is_admin = true))
    );

-- RLS Policies for registrations
-- Users can view registrations for events they can see
CREATE POLICY "Users can view registrations for visible events" ON registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events WHERE events.id = registrations.event_id
            AND (
                -- Public events - all users can see registrations
                events.visibility_level = 'public' OR
                -- College events - same college or admins
                (events.visibility_level = 'college' AND events.college_domain = (SELECT domain FROM profiles WHERE profiles.id = auth.uid())) OR
                events.visibility_level = 'admin_only'
            )
        )
    );

-- Users can register for events they can see
CREATE POLICY "Users can register for visible events" ON registrations
    FOR INSERT WITH CHECK (
        event_id IN (
            SELECT id FROM events WHERE
                -- Public events - anyone can register
                visibility_level = 'public' OR
                -- College events - only same college can register
                (visibility_level = 'college' AND college_domain = (SELECT domain FROM profiles WHERE profiles.id = auth.uid()))
        )
        AND user_id = auth.uid()
    );

-- Users can modify their own registrations
CREATE POLICY "Users can modify their own registrations" ON registrations
    FOR UPDATE USING (user_id = auth.uid());

-- Function to get user's role with enhanced logic
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
    user_domain TEXT;
BEGIN
    -- Get user's email domain
    SELECT SPLIT_PART(email, '@', 2) INTO user_domain
    FROM auth.users
    WHERE id = auth.uid();

    -- First check if user is in admin whitelist (must have @dbcblr.edu.in domain)
    SELECT aw.role INTO user_role
    FROM admin_whitelist aw
    WHERE aw.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND aw.is_active = true
    AND user_domain = 'dbcblr.edu.in';  -- Only college emails can be admin

    -- If not in admin whitelist, check regular profile
    IF user_role IS NULL THEN
        SELECT
            CASE
                WHEN p.role = 'admin' THEN 'admin'  -- explicit admin
                WHEN p.domain = 'dbcblr.edu.in' THEN 'attendee'  -- college student
                ELSE 'public_user'  -- external student
            END INTO user_role
        FROM profiles p
        WHERE p.id = auth.uid();
    END IF;

    -- Return default role if not found
    RETURN COALESCE(user_role, 'public_user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access event
CREATE OR REPLACE FUNCTION can_access_event(event_id UUID, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
    event_visibility TEXT;
    event_domain TEXT;
    user_domain TEXT;
    user_role TEXT;
BEGIN
    -- Get event details
    SELECT visibility_level, college_domain INTO event_visibility, event_domain
    FROM events WHERE id = event_id;

    IF event_visibility IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Public events - all authenticated users can access
    IF event_visibility = 'public' THEN
        RETURN TRUE;
    END IF;

    -- Get user details
    SELECT domain, role INTO user_domain, user_role
    FROM profiles WHERE id = user_id;

    -- Admin-only events - only admins
    IF event_visibility = 'admin_only' THEN
        RETURN (user_role = 'admin' OR
               EXISTS (SELECT 1 FROM admin_whitelist WHERE email = (SELECT email FROM auth.users WHERE id = user_id)));
    END IF;

    -- College events - same college domain or admin
    IF event_visibility = 'college' THEN
        RETURN (event_domain = user_domain) OR (user_role = 'admin') OR
               EXISTS (SELECT 1 FROM admin_whitelist WHERE email = (SELECT email FROM auth.users WHERE id = user_id));
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'attendee');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample admin emails (replace with real emails)
INSERT INTO admin_whitelist (email, name, role, notes)
VALUES
    ('admin@dbcblr.edu.in', 'Primary Admin', 'admin', 'College administrator'),
    ('principal@dbcblr.edu.in', 'College Principal', 'admin', 'Head of institution')
ON CONFLICT (email) DO NOTHING;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.admin_whitelist TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_role() TO authenticated;

COMMENT ON TABLE admin_whitelist IS 'Whitelisted admin emails who can access admin panel';
COMMENT ON TABLE profiles IS 'User profiles with roles for the application';
COMMENT ON FUNCTION get_my_role() IS 'Returns the current user role based on admin whitelist or profile';
