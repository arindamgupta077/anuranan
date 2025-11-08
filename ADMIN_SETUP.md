# Admin Panel Setup Guide

## Overview
This admin panel allows you to manage gallery photos and events for the Anuranan website using Supabase storage buckets.

## Setup Instructions

### 1. Create Supabase Storage Buckets

You need to create two storage buckets in your Supabase dashboard:

1. **Login to Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Navigate to your project: `ghcsoyispspvjvbkcfoj`

2. **Create Gallery Bucket**
   - Go to Storage → Create a new bucket
   - Bucket name: `gallery-photos`
   - Make it **PUBLIC** (toggle the "Public bucket" option)
   - Click "Create bucket"

3. **Create Events Bucket**
   - Go to Storage → Create a new bucket
   - Bucket name: `event-images`
   - Make it **PUBLIC** (toggle the "Public bucket" option)
   - Click "Create bucket"

### 2. Configure Bucket Policies

For both buckets, you need to set up policies to allow public read access and authenticated write access.

#### Gallery Photos Bucket Policies:

1. **SELECT (Read) Policy** - Allow public access:
   ```sql
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'gallery-photos');
   ```

2. **INSERT Policy** - Allow uploads:
   ```sql
   CREATE POLICY "Allow uploads"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'gallery-photos');
   ```

3. **UPDATE Policy** - Allow updates:
   ```sql
   CREATE POLICY "Allow updates"
   ON storage.objects FOR UPDATE
   USING (bucket_id = 'gallery-photos');
   ```

4. **DELETE Policy** - Allow deletions:
   ```sql
   CREATE POLICY "Allow deletions"
   ON storage.objects FOR DELETE
   USING (bucket_id = 'gallery-photos');
   ```

#### Events Bucket Policies:

Repeat the same policies for the `event-images` bucket:

1. **SELECT (Read) Policy**:
   ```sql
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'event-images');
   ```

2. **INSERT Policy**:
   ```sql
   CREATE POLICY "Allow uploads"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'event-images');
   ```

3. **UPDATE Policy**:
   ```sql
   CREATE POLICY "Allow updates"
   ON storage.objects FOR UPDATE
   USING (bucket_id = 'event-images');
   ```

4. **DELETE Policy**:
   ```sql
   CREATE POLICY "Allow deletions"
   ON storage.objects FOR DELETE
   USING (bucket_id = 'event-images');
   ```

### 3. Access the Admin Panel

1. **Open the Admin Panel**
   - Navigate to: `admin.html` in your browser
   - Or add `/admin.html` to your website URL

2. **Login Credentials**
   - Default Password: `anuranan2024`
   - ⚠️ **IMPORTANT**: Change this password in `admin.js` (line 18) for production use

3. **Start Managing Content**
   - Use the sidebar to switch between Gallery and Events management
   - Click "Add Photo" or "Add Event" to create new content
   - Edit or delete existing items using the action buttons on each card

## Features

### Gallery Management
- ✅ Add new photos with title and description
- ✅ Update existing photos
- ✅ Delete photos
- ✅ Image preview before upload
- ✅ Automatic display on main website

### Events Management
- ✅ Add new events with complete details
- ✅ Update existing events
- ✅ Delete events
- ✅ Organize by date, category, time, and location
- ✅ Automatic display on main website

## File Structure

```
admin.html          - Admin panel interface
admin.js            - Admin panel logic with Supabase integration
admin.css           - Admin panel styling
supabase-loader.js  - Loads data from Supabase to main website
```

## How It Works

### Gallery Photos
1. Photos are uploaded to Supabase `gallery-photos` bucket
2. Filename format: `{title}___{description}.{extension}`
3. The main website automatically loads and displays them

### Events
1. Event data is stored as JSON files in Supabase `event-images` bucket
2. Filename format: `{day}_{month}_{category}___{title}___{description}___{time}___{location}.json`
3. The main website automatically loads and displays them

## Security Recommendations

### For Production Use:

1. **Change Admin Password**
   - Edit `admin.js` line 18
   - Use a strong, unique password

2. **Implement Proper Authentication**
   - Consider using Supabase Auth for user authentication
   - Add role-based access control
   - Use environment variables for sensitive data

3. **Add Server-Side Validation**
   - Validate file types and sizes on the server
   - Implement rate limiting
   - Add CSRF protection

4. **Enable RLS (Row Level Security)**
   - Use Supabase Row Level Security for better control
   - Create specific user roles with limited permissions

## Troubleshooting

### Issue: Images not loading
- **Solution**: Verify buckets are set to PUBLIC
- Check browser console for errors
- Ensure bucket names match exactly

### Issue: Cannot upload files
- **Solution**: Check storage policies are correctly configured
- Verify file size is under 5MB
- Check browser console for API errors

### Issue: Admin panel not loading
- **Solution**: Verify Supabase credentials are correct
- Check that the Supabase CDN script is loading
- Clear browser cache and reload

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify Supabase dashboard for bucket status
3. Review the policies in Supabase Storage settings

## Notes

- Maximum file size for images: 5MB (configurable)
- Supported image formats: PNG, JPG, JPEG
- All content updates are reflected immediately on the main website
- No database tables are required - everything uses storage buckets
