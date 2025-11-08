-- ==========================================
-- WORKING FIX: Create policies that allow anon access
-- ==========================================
-- This will work with your permission level
-- ==========================================

-- First, drop all existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- Create super permissive policies for both buckets
-- These allow anonymous (anon) role to do everything

-- Gallery Photos Bucket
CREATE POLICY "anon_gallery_all"
ON storage.objects
FOR ALL
TO anon, authenticated
USING (bucket_id = 'gallery-photos')
WITH CHECK (bucket_id = 'gallery-photos');

-- Event Images Bucket  
CREATE POLICY "anon_events_all"
ON storage.objects
FOR ALL
TO anon, authenticated
USING (bucket_id = 'event-images')
WITH CHECK (bucket_id = 'event-images');

-- Verify policies were created
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
