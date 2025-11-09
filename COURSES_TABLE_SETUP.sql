-- =====================================================
-- COURSES TABLE SETUP FOR ANURANAN
-- =====================================================
-- This script creates the courses table and sets up RLS policies
-- for managing course data in the Anuranan Recitation Training Institute website
-- =====================================================

-- Drop existing table if needed (use with caution in production)
-- DROP TABLE IF EXISTS public.courses CASCADE;

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) NOT NULL,  -- Font Awesome icon class (e.g., 'fas fa-book-open')
    badge VARCHAR(50),  -- Optional badge text (e.g., 'Popular', 'New', 'Save 30%')
    badge_type VARCHAR(20),  -- Badge style type (e.g., 'popular', 'new', 'discount')
    features JSONB NOT NULL,  -- Array of feature strings
    is_featured BOOLEAN DEFAULT FALSE,  -- Whether this is a featured/special course
    featured_text VARCHAR(100),  -- Text for featured badge (e.g., 'Special Offer')
    button_text VARCHAR(50) DEFAULT 'Enroll Now',  -- CTA button text
    display_order INTEGER DEFAULT 0,  -- Order for displaying courses (lower numbers first)
    is_active BOOLEAN DEFAULT TRUE,  -- Whether course is currently active/visible
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_courses_display_order ON public.courses(display_order);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON public.courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON public.courses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous read access to active courses" ON public.courses;
DROP POLICY IF EXISTS "Allow authenticated users to insert courses" ON public.courses;
DROP POLICY IF EXISTS "Allow authenticated users to update courses" ON public.courses;
DROP POLICY IF EXISTS "Allow authenticated users to delete courses" ON public.courses;

-- RLS Policies
-- 1. Allow anyone to read active courses (for public website)
CREATE POLICY "Allow anonymous read access to active courses"
    ON public.courses
    FOR SELECT
    USING (is_active = TRUE);

-- 2. Allow authenticated users (admins) to view all courses
CREATE POLICY "Allow authenticated users to view all courses"
    ON public.courses
    FOR SELECT
    TO authenticated
    USING (true);

-- 3. Allow authenticated users (admins) to insert courses
CREATE POLICY "Allow authenticated users to insert courses"
    ON public.courses
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 4. Allow authenticated users (admins) to update courses
CREATE POLICY "Allow authenticated users to update courses"
    ON public.courses
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Allow authenticated users (admins) to delete courses
CREATE POLICY "Allow authenticated users to delete courses"
    ON public.courses
    FOR DELETE
    TO authenticated
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_courses_updated_at_trigger ON public.courses;
CREATE TRIGGER update_courses_updated_at_trigger
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION update_courses_updated_at();

-- =====================================================
-- INSERT SAMPLE DATA (existing courses from website)
-- =====================================================

INSERT INTO public.courses (title, description, icon, badge, badge_type, features, is_featured, display_order, is_active, button_text)
VALUES 
(
    'Bengali Recitation',
    'Immerse yourself in the beauty of Bengali poetry. Learn to recite works of Rabindranath Tagore, Kazi Nazrul Islam, Sukumar Ray, and other legendary poets with proper pronunciation, emotion, and expression.',
    'fas fa-book-open',
    'Popular',
    'popular',
    '["Classical & Modern Poetry", "Voice Modulation Techniques", "Stage Presence Training", "Competition Preparation"]'::jsonb,
    FALSE,
    1,
    TRUE,
    'Enroll Now'
),
(
    'English Recitation',
    'Master the art of English poetry recitation with confidence. From Shakespeare to contemporary poets, develop your linguistic skills and stage confidence through expert guidance.',
    'fas fa-language',
    NULL,
    NULL,
    '["British & American Poetry", "Accent & Diction Training", "Performance Skills", "Public Speaking Basics"]'::jsonb,
    FALSE,
    2,
    TRUE,
    'Enroll Now'
),
(
    'Hindi Recitation',
    'Explore the richness of Hindi literature through recitation. Learn to present works of renowned Hindi poets with authenticity, emotion, and cultural understanding.',
    'fas fa-scroll',
    NULL,
    NULL,
    '["Classical Hindi Poetry", "Expression Development", "Cultural Context Learning", "Performance Practice"]'::jsonb,
    FALSE,
    3,
    TRUE,
    'Enroll Now'
),
(
    'Anchoring Classes',
    'Develop the skills to host events with confidence and charisma. Learn script writing, stage presence, audience engagement, and professional anchoring techniques for various occasions.',
    'fas fa-microphone-alt',
    'New',
    'new',
    '["Event Hosting Skills", "Script Writing & Delivery", "Confidence Building", "Live Event Practice"]'::jsonb,
    FALSE,
    4,
    TRUE,
    'Enroll Now'
),
(
    'Acting Workshops',
    'Unleash your dramatic potential through comprehensive acting training. Learn character development, improvisation, dialogue delivery, and stage/camera performance techniques.',
    'fas fa-theater-masks',
    NULL,
    NULL,
    '["Character Building", "Improvisation Training", "Dialogue Delivery", "Theatre Performance"]'::jsonb,
    FALSE,
    5,
    TRUE,
    'Enroll Now'
),
(
    'Combo Package',
    'Get comprehensive training across multiple disciplines. Our combo package offers excellent value for students who want to explore various aspects of performing arts.',
    'fas fa-gift',
    'Save 30%',
    'discount',
    '["Any 3 Courses Combined", "Personalized Attention", "Flexible Schedule", "Priority Event Participation"]'::jsonb,
    TRUE,
    6,
    TRUE,
    'Get Special Offer'
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if table was created successfully
-- SELECT COUNT(*) as total_courses FROM public.courses;

-- View all courses ordered by display_order
-- SELECT id, title, badge, is_featured, display_order, is_active FROM public.courses ORDER BY display_order;

-- View course features
-- SELECT title, features FROM public.courses;

-- =====================================================
-- NOTES
-- =====================================================
-- 1. The 'features' column uses JSONB to store an array of feature strings
-- 2. Example feature access: SELECT features->0 FROM courses; (gets first feature)
-- 3. To add a feature: UPDATE courses SET features = features || '["New Feature"]'::jsonb WHERE id = 'xxx';
-- 4. Icons should use Font Awesome class names (e.g., 'fas fa-book-open')
-- 5. Badge types can be: 'popular', 'new', 'discount', or custom
-- 6. Featured courses will have special styling on the website
-- 7. Display order determines the sequence of courses (ascending order)
-- 8. Only active courses (is_active = TRUE) are shown to public users
-- =====================================================
