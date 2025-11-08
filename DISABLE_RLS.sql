-- ==========================================
-- ULTIMATE FIX: Disable RLS completely for testing
-- ==========================================
-- This will allow ALL operations without restrictions
-- Run this in Supabase SQL Editor
-- ==========================================

-- CRITICAL: First, make sure your buckets are PUBLIC
-- Go to: Storage > Your Bucket > Settings > "Public bucket" must be ON

-- Step 1: Disable Row Level Security on storage.objects
-- This removes all policy restrictions
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- You should see: rowsecurity = false

-- ==========================================
-- Alternative: If you want to keep RLS enabled but allow everything
-- Comment out the above and use this instead:
-- ==========================================

/*
-- Remove all existing policies
DROP POLICY IF EXISTS "gallery_select" ON storage.objects;
DROP POLICY IF EXISTS "gallery_insert" ON storage.objects;
DROP POLICY IF EXISTS "gallery_update" ON storage.objects;
DROP POLICY IF EXISTS "gallery_delete" ON storage.objects;
DROP POLICY IF EXISTS "events_select" ON storage.objects;
DROP POLICY IF EXISTS "events_insert" ON storage.objects;
DROP POLICY IF EXISTS "events_update" ON storage.objects;
DROP POLICY IF EXISTS "events_delete" ON storage.objects;

-- Create permissive policies that allow EVERYTHING (no restrictions)
CREATE POLICY "Allow all for gallery" ON storage.objects 
  FOR ALL 
  USING (bucket_id = 'gallery-photos') 
  WITH CHECK (bucket_id = 'gallery-photos');

CREATE POLICY "Allow all for events" ON storage.objects 
  FOR ALL 
  USING (bucket_id = 'event-images') 
  WITH CHECK (bucket_id = 'event-images');
*/

-- ==========================================
-- After running this, test again in your admin panel!
-- ==========================================
