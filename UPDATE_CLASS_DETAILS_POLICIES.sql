-- ==========================================
-- DROP OLD POLICIES AND CREATE NEW ONES
-- ==========================================
-- This script updates the RLS policies to work with Supabase Auth

-- First, drop the old policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to insert class details" ON public.class_details;
DROP POLICY IF EXISTS "Allow authenticated users to update class details" ON public.class_details;
DROP POLICY IF EXISTS "Allow authenticated users to delete class details" ON public.class_details;

-- Create new policies that check for authenticated user ID
CREATE POLICY "Allow authenticated users to insert class details"
ON public.class_details
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update class details"
ON public.class_details
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete class details"
ON public.class_details
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- ==========================================
-- VERIFY POLICIES
-- ==========================================
-- Run this to check if policies are correctly applied:
-- SELECT * FROM pg_policies WHERE tablename = 'class_details';
