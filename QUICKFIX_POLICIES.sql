-- ==========================================
-- SIMPLE FIX: Delete all existing policies and recreate them
-- ==========================================
-- Copy and paste this ENTIRE script into Supabase SQL Editor
-- Then click "Run"
-- ==========================================

-- Step 1: Drop all existing policies (if any)
DROP POLICY IF EXISTS "Public read access for gallery photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete from gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for events" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to events" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to events" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete from events" ON storage.objects;

-- Step 2: Create simple policies that allow EVERYTHING for both buckets

-- Gallery bucket - Allow ALL operations
CREATE POLICY "gallery_select" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-photos');
CREATE POLICY "gallery_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-photos');
CREATE POLICY "gallery_update" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery-photos');
CREATE POLICY "gallery_delete" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-photos');

-- Events bucket - Allow ALL operations  
CREATE POLICY "events_select" ON storage.objects FOR SELECT USING (bucket_id = 'event-images');
CREATE POLICY "events_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-images');
CREATE POLICY "events_update" ON storage.objects FOR UPDATE USING (bucket_id = 'event-images');
CREATE POLICY "events_delete" ON storage.objects FOR DELETE USING (bucket_id = 'event-images');

-- ==========================================
-- Verification Query
-- ==========================================
-- Run this after to verify policies are created:

SELECT 
    policyname,
    cmd as operation,
    tablename
FROM pg_policies
WHERE tablename = 'objects'
AND (policyname LIKE 'gallery%' OR policyname LIKE 'events%')
ORDER BY policyname;

-- You should see 8 policies (4 for gallery, 4 for events)
