# Course Management System - Implementation Guide

## Overview
This guide explains how to set up and use the Course Management system for the Anuranan Recitation Training Institute website. Admins can add, edit, and remove courses from the admin panel, which will be dynamically displayed on the website.

## Features Implemented

### 1. **Database Setup**
- Created `courses` table in Supabase with comprehensive fields
- Row Level Security (RLS) policies for public read and admin write access
- Automatic timestamp management with triggers
- JSONB support for flexible feature lists

### 2. **Admin Course Management Page**
- Full CRUD (Create, Read, Update, Delete) operations
- User-friendly form with validation
- Real-time icon preview
- Dynamic feature list management
- Toggle course visibility (active/inactive)
- Course ordering system
- Featured course designation

### 3. **Dynamic Website Display**
- Courses loaded from Supabase database
- Maintains original card design and styling
- Supports badges (Popular, New, Discount)
- Featured courses with special styling
- Smooth fade-in animations
- Responsive design

## Setup Instructions

### Step 1: Create the Database Table

1. Log in to your **Supabase Dashboard**
2. Go to the **SQL Editor**
3. Copy and paste the contents of `COURSES_TABLE_SETUP.sql`
4. Click **Run** to execute the script

This will:
- Create the `courses` table
- Set up RLS policies
- Insert sample data (your existing 6 courses)
- Create indexes for better performance

### Step 2: Verify Database Setup

Run this query to verify the courses were created:

```sql
SELECT id, title, badge, is_featured, display_order, is_active 
FROM public.courses 
ORDER BY display_order;
```

You should see all 6 courses listed.

### Step 3: Test the Website

1. Open your website (`website/index.html`)
2. Scroll to the "Our Courses" section
3. Courses should load dynamically from the database
4. Verify that:
   - All courses display correctly
   - Badges show properly (Popular, New, Save 30%)
   - Featured course (Combo Package) has special styling
   - Features list displays correctly

### Step 4: Access Admin Panel

1. Navigate to `admin/index.html`
2. Log in with your admin credentials
3. Click on **"Course Management"** in the sidebar
4. You'll be redirected to `admin/courses.html`

## Using the Course Management Panel

### Adding a New Course

1. Click on the **Course Management** menu item
2. Fill in the form:
   - **Course Title**: Name of the course (e.g., "Bengali Recitation")
   - **Icon Class**: Font Awesome icon class (e.g., `fas fa-book-open`)
   - **Description**: Detailed course description
   - **Badge Text**: Optional badge (e.g., "Popular", "New")
   - **Badge Type**: Choose color scheme (Popular/Yellow, New/Green, Discount/Red)
   - **Button Text**: CTA button text (default: "Enroll Now")
   - **Display Order**: Number to control position (lower = appears first)
   - **Features**: Add multiple features (click "+ Add Feature" for more)
   - **Featured**: Check if this is a special/featured course
   - **Featured Badge Text**: Text for featured badge (e.g., "Special Offer")
   - **Active**: Check to make visible on website

3. Click **"Save Course"**

### Editing an Existing Course

1. Find the course in the list below the form
2. Click the **"Edit"** button
3. The form will populate with the course data
4. Make your changes
5. Click **"Update Course"**

### Hiding/Showing a Course

- Click the **"Hide"** or **"Show"** button on any course
- Hidden courses won't appear on the public website
- Useful for seasonal courses or courses under development

### Deleting a Course

1. Click the **"Delete"** button
2. Confirm the deletion
3. Course will be permanently removed from the database

## Course Card Structure

Each course card includes:

### Standard Fields
- **Icon**: Font Awesome icon displayed at the top
- **Title**: Course name
- **Badge**: Optional label (Popular, New, etc.)
- **Description**: Course overview text
- **Features**: List of course highlights (bullet points)
- **Button**: Call-to-action button

### Featured Course Additional Elements
- **Featured Badge**: Crown icon with custom text
- **Special Styling**: Different background and colors
- **Custom Button**: Different button styling

## Font Awesome Icons

### Recommended Icons for Courses
- `fas fa-book-open` - Books/Reading
- `fas fa-language` - Languages
- `fas fa-scroll` - Traditional/Classical
- `fas fa-microphone-alt` - Speaking/Anchoring
- `fas fa-theater-masks` - Acting/Drama
- `fas fa-gift` - Special Offers/Packages
- `fas fa-music` - Music/Songs
- `fas fa-pen-fancy` - Writing
- `fas fa-user-graduate` - Students/Education
- `fas fa-star` - Premium/Featured

Visit [Font Awesome Icons](https://fontawesome.com/icons) to browse more options.

## Badge Types

### Popular (Yellow)
- Best for: Most enrolled courses
- Color: Yellow/Gold
- Example: "Popular", "Bestseller"

### New (Green)
- Best for: Recently added courses
- Color: Green
- Example: "New", "Just Launched"

### Discount (Red)
- Best for: Special offers/promotions
- Color: Red
- Example: "Save 30%", "Limited Offer"

## Display Order

Courses are sorted by the `display_order` field (ascending):
- **Order 1**: Appears first
- **Order 2**: Appears second
- And so on...

Use increments of 10 (10, 20, 30...) to leave room for inserting courses between existing ones.

## Database Schema

### Courses Table Structure

```sql
CREATE TABLE public.courses (
    id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) NOT NULL,
    badge VARCHAR(50),
    badge_type VARCHAR(20),
    features JSONB NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    featured_text VARCHAR(100),
    button_text VARCHAR(50) DEFAULT 'Enroll Now',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

### Features Field (JSONB)

The `features` field stores an array of strings:

```json
[
    "Classical & Modern Poetry",
    "Voice Modulation Techniques",
    "Stage Presence Training",
    "Competition Preparation"
]
```

## Security

### Row Level Security (RLS) Policies

1. **Public Read**: Anyone can view active courses
2. **Admin Read All**: Authenticated admins can see all courses
3. **Admin Insert**: Authenticated admins can add courses
4. **Admin Update**: Authenticated admins can edit courses
5. **Admin Delete**: Authenticated admins can remove courses

### Authentication Required

- Must be logged in as admin to access `courses.html`
- Authentication checked on page load
- Redirects to login if session invalid

## Troubleshooting

### Courses Not Loading on Website

1. Check browser console for errors
2. Verify Supabase client is loaded (`supabase-loader.js`)
3. Check RLS policies are enabled
4. Ensure courses have `is_active = true`

### Can't Save Course in Admin Panel

1. Verify you're logged in
2. Check all required fields are filled
3. At least one feature must be added
4. Check console for error messages

### Icon Not Displaying

1. Verify Font Awesome is loaded
2. Use correct class format: `fas fa-icon-name`
3. Check icon name spelling
4. Preview icon in the form before saving

### Badge Not Showing Correct Color

1. Verify `badge_type` is set correctly
2. Options: `popular`, `new`, `discount`
3. Check if CSS classes match

## Files Modified/Created

### New Files
- `COURSES_TABLE_SETUP.sql` - Database setup script
- `admin/courses.html` - Course management admin page
- `COURSE_MANAGEMENT_GUIDE.md` - This documentation

### Modified Files
- `website/index.html` - Updated courses section to load dynamically
- `website/script.js` - Added `loadCourses()` function
- `admin/index.html` - Added Course Management navigation link

## Best Practices

1. **Always test changes**: Preview courses on the website after editing
2. **Use descriptive titles**: Clear, concise course names
3. **Write engaging descriptions**: Highlight benefits, not just features
4. **Consistent feature count**: Try to have 4-5 features per course
5. **Logical ordering**: Group related courses together
6. **Regular backups**: Export course data periodically
7. **Meaningful badges**: Use badges sparingly for impact

## Future Enhancements (Optional)

- Course categories/tags
- Course images
- Pricing information
- Enrollment tracking
- Course capacity limits
- Prerequisites
- Course duration/schedule
- Instructor assignments
- Student reviews/ratings
- Course analytics

## Support

For issues or questions:
1. Check this documentation
2. Review Supabase logs
3. Check browser console errors
4. Verify authentication status
5. Test RLS policies in Supabase SQL editor

## Quick Reference

### Add Course
Admin Panel → Course Management → Fill Form → Save Course

### Edit Course
Admin Panel → Course Management → Click Edit → Update → Save

### Hide Course
Admin Panel → Course Management → Click Hide/Show Button

### Delete Course
Admin Panel → Course Management → Click Delete → Confirm

### Change Order
Admin Panel → Course Management → Edit Course → Change Display Order → Save

---

**Last Updated**: November 2025  
**Version**: 1.0  
**Compatibility**: Supabase, Modern Browsers, Mobile Responsive
