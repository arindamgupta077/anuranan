-- ==========================================
-- Supabase Storage Setup for Anuranan Admin Panel
-- ==========================================
-- Run these commands in Supabase SQL Editor
-- ==========================================

-- Note: Create the buckets through the Supabase Dashboard UI first
-- Storage > New Bucket > Name: gallery-photos (Public)
-- Storage > New Bucket > Name: event-images (Public)

-- ==========================================
-- Gallery Photos Bucket Policies
-- ==========================================

-- Allow public read access to gallery photos
CREATE POLICY "Public read access for gallery photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-photos');

-- Allow insert/upload to gallery photos bucket
CREATE POLICY "Allow authenticated uploads to gallery"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'gallery-photos');

-- Allow updates to gallery photos
CREATE POLICY "Allow authenticated updates to gallery"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'gallery-photos')
WITH CHECK (bucket_id = 'gallery-photos');

-- Allow delete from gallery photos
CREATE POLICY "Allow authenticated delete from gallery"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'gallery-photos');

-- ==========================================
-- Events Bucket Policies
-- ==========================================

-- Allow public read access to events
CREATE POLICY "Public read access for events"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-images');

-- Allow insert/upload to events bucket
CREATE POLICY "Allow authenticated uploads to events"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'event-images');

-- Allow updates to events
CREATE POLICY "Allow authenticated updates to events"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'event-images')
WITH CHECK (bucket_id = 'event-images');

-- Allow delete from events
CREATE POLICY "Allow authenticated delete from events"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'event-images');

-- ==========================================
-- Verify Policies
-- ==========================================
-- Run this to check if policies are created correctly

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'objects'
AND (policyname LIKE '%gallery%' OR policyname LIKE '%events%')
ORDER BY policyname;

-- ==========================================
-- Optional: Create a table for admin users
-- (For future enhancement - proper authentication)
-- ==========================================

/*
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users
CREATE POLICY "Admin users can read their own data"
ON admin_users FOR SELECT
TO authenticated
USING (auth.uid() = id);
*/
