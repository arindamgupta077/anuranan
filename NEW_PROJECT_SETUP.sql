-- ==========================================
-- NEW PROJECT SETUP - Run this AFTER creating buckets
-- ==========================================
-- Project: dcbqaerzqfpntghptrfq
-- ==========================================

-- STEP 1: Make sure you created these buckets as PUBLIC:
--   - gallery-photos (Public bucket = ON)
--   - event-images (Public bucket = ON)

-- STEP 2: Run this SQL to create policies

-- Drop any existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- Create policies for gallery-photos bucket
CREATE POLICY "gallery_all"
ON storage.objects
FOR ALL
TO anon, authenticated
USING (bucket_id = 'gallery-photos')
WITH CHECK (bucket_id = 'gallery-photos');

-- Create policies for event-images bucket
CREATE POLICY "events_all"
ON storage.objects
FOR ALL
TO anon, authenticated
USING (bucket_id = 'event-images')
WITH CHECK (bucket_id = 'event-images');

-- Verify
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- Should see 2 rows: gallery_all and events_all
