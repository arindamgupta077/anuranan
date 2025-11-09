-- Create table for class details
CREATE TABLE IF NOT EXISTS public.class_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    branch VARCHAR(255) NOT NULL,
    day VARCHAR(50) NOT NULL,
    timings VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on day for faster queries
CREATE INDEX IF NOT EXISTS idx_class_details_day ON public.class_details(day);

-- Enable Row Level Security (RLS)
ALTER TABLE public.class_details ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read class details (for public website)
CREATE POLICY "Allow public read access to class details"
ON public.class_details
FOR SELECT
USING (true);

-- Policy to allow authenticated users (admin) to insert
CREATE POLICY "Allow authenticated users to insert class details"
ON public.class_details
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy to allow authenticated users (admin) to update
CREATE POLICY "Allow authenticated users to update class details"
ON public.class_details
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Policy to allow authenticated users (admin) to delete
CREATE POLICY "Allow authenticated users to delete class details"
ON public.class_details
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function
CREATE TRIGGER update_class_details_updated_at BEFORE UPDATE ON public.class_details
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO public.class_details (subject, branch, day, timings) VALUES
('Rabindra Sangeet', 'Saltlake Branch', 'Monday', '4:00 PM - 6:00 PM'),
('Tabla', 'Saltlake Branch', 'Wednesday', '5:00 PM - 7:00 PM'),
('Classical Dance', 'Park Street Branch', 'Saturday', '3:00 PM - 5:00 PM'),
('Painting', 'Park Street Branch', 'Sunday', '10:00 AM - 12:00 PM');
