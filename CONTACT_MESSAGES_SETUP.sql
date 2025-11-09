-- ==================== 
-- Contact Messages Table Setup
-- ==================== 

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    course TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON contact_messages;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON contact_messages;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON contact_messages;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON contact_messages;

-- Policy 1: Allow anyone to submit contact forms (insert)
CREATE POLICY "Enable insert for anonymous users"
ON contact_messages
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 2: Allow authenticated users to read all messages (for admin panel)
CREATE POLICY "Enable read access for authenticated users"
ON contact_messages
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Allow authenticated users to update messages (mark as read/unread)
CREATE POLICY "Enable update for authenticated users"
ON contact_messages
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: Allow authenticated users to delete messages
CREATE POLICY "Enable delete for authenticated users"
ON contact_messages
FOR DELETE
TO authenticated
USING (true);

-- Alternative: If you want admin to access without authentication, use this instead:
-- (Comment out the above policy and uncomment this if needed)
/*
CREATE POLICY "Enable read access for service role"
ON contact_messages
FOR SELECT
TO service_role
USING (true);
*/

-- Grant permissions
GRANT INSERT ON contact_messages TO anon;
GRANT SELECT, UPDATE, DELETE ON contact_messages TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Contact messages table created successfully!';
    RAISE NOTICE '📝 Table: contact_messages';
    RAISE NOTICE '🔒 RLS enabled with anonymous insert and authenticated read/update/delete';
END $$;
