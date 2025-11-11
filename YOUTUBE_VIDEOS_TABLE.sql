-- ==========================================
-- YouTube Videos Table Setup for Anuranan
-- ==========================================
-- Run this in Supabase SQL Editor
-- ==========================================

-- Create the youtube_videos table
CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    youtube_url VARCHAR(500) NOT NULL,
    youtube_id VARCHAR(50) NOT NULL,
    thumbnail_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on display_order for faster sorting
CREATE INDEX IF NOT EXISTS idx_youtube_videos_display_order 
ON public.youtube_videos(display_order);

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_youtube_videos_is_active 
ON public.youtube_videos(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active videos
CREATE POLICY "Public can view active youtube videos"
ON public.youtube_videos
FOR SELECT
TO public
USING (is_active = true);

-- Policy: Allow public read access to all videos (for admin)
CREATE POLICY "Public can view all youtube videos"
ON public.youtube_videos
FOR SELECT
TO public
USING (true);

-- Policy: Allow public insert
CREATE POLICY "Allow public insert to youtube videos"
ON public.youtube_videos
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Allow public update
CREATE POLICY "Allow public update to youtube videos"
ON public.youtube_videos
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Policy: Allow public delete
CREATE POLICY "Allow public delete from youtube videos"
ON public.youtube_videos
FOR DELETE
TO public
USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_youtube_videos_updated_at 
    BEFORE UPDATE ON public.youtube_videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO public.youtube_videos (title, description, youtube_url, youtube_id, thumbnail_url, display_order, is_active)
VALUES 
    (
        'Welcome to Anuranan - Recitation Training Institute',
        'An introduction to our institute and the art of Bengali recitation',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'dQw4w9WgXcQ',
        'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        1,
        true
    );

-- Grant permissions (if needed)
GRANT ALL ON public.youtube_videos TO anon;
GRANT ALL ON public.youtube_videos TO authenticated;

-- ==========================================
-- Setup Complete!
-- ==========================================
-- Next Steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify the table was created
-- 3. Test adding a video through the admin panel
-- ==========================================
