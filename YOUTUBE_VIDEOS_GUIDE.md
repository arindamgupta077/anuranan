# YouTube Videos Feature - Implementation Guide

## Overview
A complete YouTube video management system has been added to your Anuranan website. This allows you to showcase teaching videos on the main website, and manage them (add, edit, delete) through the admin panel.

## Features Implemented

### 1. **Website - Public Video Display**
   - New "Videos" section on the main website
   - Grid layout displaying video thumbnails
   - Click to play videos in a modal popup
   - Responsive design for mobile devices
   - Added to navigation menu

### 2. **Admin Panel - Video Management**
   - Dedicated videos management page (`admin/videos.html`)
   - Add new YouTube videos
   - Edit existing videos
   - Delete videos
   - Toggle video active/inactive status
   - Auto-extract YouTube video ID
   - Auto-fetch video title using YouTube API
   - Video preview while adding/editing

### 3. **Database**
   - New Supabase table: `youtube_videos`
   - Stores video metadata (title, description, YouTube URL, etc.)
   - Row Level Security (RLS) policies configured
   - Auto-update timestamps

## Setup Instructions

### Step 1: Create the Database Table

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Run the SQL script from `YOUTUBE_VIDEOS_TABLE.sql`
4. Verify the table was created successfully

### Step 2: Test the Feature

1. **Admin Panel:**
   - Login to admin panel: `admin/index.html`
   - Click on "YouTube Videos" in the sidebar
   - Add your first video:
     - Paste a YouTube URL
     - Click "Auto-fill" to extract video ID and title
     - Add description (optional)
     - Set display order (0 = first)
     - Click "Save Video"

2. **Website:**
   - Visit the main website
   - Scroll to the "Videos" section (or click "Videos" in nav)
   - Click on any video to watch in fullscreen modal

## How to Use

### Adding a Video (Admin)

1. Go to **Admin Panel** → **YouTube Videos**
2. Paste YouTube video URL in the form
3. Click "Auto-fill" button (optional - it will try to fetch the title)
4. Fill in:
   - **Title** (required) - Video display name
   - **Description** (optional) - Brief description
   - **Display Order** - Lower numbers appear first (e.g., 0, 1, 2...)
   - **Status** - Active (visible) or Inactive (hidden)
5. Click **Save Video**

### Editing a Video

1. In the videos list, click **Edit** button
2. Modify the details
3. Click **Save Video**

### Deleting a Video

1. Click **Delete** button on the video
2. Confirm deletion
3. Video is permanently removed

### Toggle Video Status

1. Click **Activate** or **Deactivate** button
2. Inactive videos won't show on the website but remain in the database

## Supported YouTube URL Formats

The system supports all standard YouTube URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`

## File Structure

```
├── YOUTUBE_VIDEOS_TABLE.sql        # Database setup script
├── website/
│   ├── index.html                  # Added videos section
│   ├── script.js                   # Added video loading functions
│   └── styles.css                  # Added video styling
└── admin/
    ├── index.html                  # Added videos nav link & dashboard count
    ├── admin.js                    # Added video count to dashboard
    ├── videos.html                 # New video management page
    └── videos.js                   # New video management logic
```

## Database Schema

### Table: `youtube_videos`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `title` | VARCHAR(255) | Video title (required) |
| `description` | TEXT | Video description (optional) |
| `youtube_url` | VARCHAR(500) | Full YouTube URL |
| `youtube_id` | VARCHAR(50) | Extracted YouTube video ID |
| `thumbnail_url` | VARCHAR(500) | Auto-generated thumbnail URL |
| `display_order` | INTEGER | Sort order (default: 0) |
| `is_active` | BOOLEAN | Visibility status (default: true) |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Customization Tips

### Change Video Grid Layout

In `website/styles.css`, find `.videos-grid` and adjust:
```css
.videos-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
}
```

### Change Video Modal Background

In `website/styles.css`, find `.video-modal` and adjust:
```css
.video-modal {
    background: rgba(0, 0, 0, 0.95); /* Change opacity/color */
}
```

## Troubleshooting

### Videos Not Showing on Website
1. Check if videos are marked as "Active" in admin panel
2. Verify Supabase table has RLS policies enabled
3. Check browser console for errors

### Can't Add Videos in Admin
1. Verify you're logged in to admin panel
2. Check Supabase connection
3. Ensure the `youtube_videos` table exists

### Video Thumbnails Not Loading
1. YouTube thumbnails are auto-generated using format:
   `https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg`
2. If video is new, thumbnail might take time to generate
3. Try using `hqdefault.jpg` instead of `maxresdefault.jpg`

### Auto-fill Not Working
1. The feature uses YouTube's oEmbed API
2. It may fail for private/unlisted videos
3. You can manually enter the title - it still works fine

## Security Notes

- RLS (Row Level Security) is enabled on the `youtube_videos` table
- Public can only SELECT (read) active videos
- Admin operations require authentication
- No direct file uploads - only YouTube URLs

## Future Enhancements (Optional)

- Video categories/tags
- Search/filter videos
- Video statistics (view counts)
- Playlist support
- Video duration display
- Admin bulk operations

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase dashboard for table/data
3. Review this documentation

---

**Created:** November 2025  
**Version:** 1.0  
**Status:** Production Ready ✅
