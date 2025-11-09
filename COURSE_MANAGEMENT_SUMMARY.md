# Course Management - Quick Setup

## ✅ What Has Been Created

### 1. Database SQL Script
**File**: `COURSES_TABLE_SETUP.sql`
- Creates `courses` table with all necessary fields
- Sets up Row Level Security (RLS) policies
- Includes sample data (your existing 6 courses)
- Adds indexes and triggers

### 2. Admin Management Page
**File**: `admin/courses.html`
- Full course editor interface
- Add/Edit/Delete courses
- Toggle visibility
- Feature list management
- Icon preview
- Authentication protected

### 3. Dynamic Website Loading
**Modified Files**: 
- `website/index.html` - Replaced static HTML with dynamic placeholder
- `website/script.js` - Added `loadCourses()` function

### 4. Admin Navigation
**Modified File**: `admin/index.html`
- Added "Course Management" menu item

### 5. Documentation
**File**: `COURSE_MANAGEMENT_GUIDE.md`
- Complete setup instructions
- Usage guide
- Troubleshooting tips

## 🚀 Quick Start (3 Steps)

### Step 1: Run the SQL Script
```
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Paste contents of COURSES_TABLE_SETUP.sql
4. Click "Run"
```

### Step 2: Verify Website
```
1. Open website/index.html
2. Scroll to "Our Courses" section
3. Courses should load dynamically
```

### Step 3: Access Admin Panel
```
1. Login to admin/index.html
2. Click "Course Management"
3. Start managing courses!
```

## 📋 Course Table Structure

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| title | VARCHAR(200) | Course name |
| description | TEXT | Course details |
| icon | VARCHAR(100) | Font Awesome class |
| badge | VARCHAR(50) | Badge text (optional) |
| badge_type | VARCHAR(20) | Badge color style |
| features | JSONB | Array of features |
| is_featured | BOOLEAN | Featured course flag |
| featured_text | VARCHAR(100) | Featured badge text |
| button_text | VARCHAR(50) | CTA button text |
| display_order | INTEGER | Sort order |
| is_active | BOOLEAN | Visibility on website |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-updated |

## 🎨 Course Card Features

### Standard Course Card
```
✓ Icon
✓ Title
✓ Optional Badge (Popular/New/Discount)
✓ Description
✓ Feature List (checkmarks)
✓ CTA Button
```

### Featured Course Card
```
✓ All standard features
✓ Special featured badge with crown icon
✓ Different background styling
✓ Custom button styling
```

## 🎯 Admin Features

### ✅ Add New Course
- Fill comprehensive form
- Add multiple features dynamically
- Preview icon in real-time
- Set display order
- Mark as featured
- Control visibility

### ✏️ Edit Course
- Click "Edit" on any course
- Form auto-populates
- Update and save changes
- Instant preview in list

### 👁️ Show/Hide Course
- Toggle visibility with one click
- Hidden courses invisible to public
- Still editable in admin panel

### 🗑️ Delete Course
- Confirmation required
- Permanent removal from database

## 📱 Responsive Design

✅ Desktop optimized  
✅ Tablet friendly  
✅ Mobile responsive  
✅ Touch-friendly buttons  

## 🔒 Security Features

✅ Row Level Security (RLS) enabled  
✅ Public can only read active courses  
✅ Only authenticated admins can modify  
✅ Authentication checked on page load  
✅ Auto-redirect if not logged in  

## 🎨 Customization Options

### Badge Types
- **popular** → Yellow badge
- **new** → Green badge
- **discount** → Red badge

### Icons (Font Awesome)
- fas fa-book-open
- fas fa-language
- fas fa-microphone-alt
- fas fa-theater-masks
- fas fa-gift
- [Browse more](https://fontawesome.com/icons)

### Display Order
- Lower numbers appear first
- Use increments of 10: (10, 20, 30...)
- Easy to insert courses between

## 📝 Sample Course Data

The SQL script includes all your existing courses:
1. Bengali Recitation (Popular badge)
2. English Recitation
3. Hindi Recitation
4. Anchoring Classes (New badge)
5. Acting Workshops
6. Combo Package (Featured, Save 30% badge)

## 🔧 Technical Details

### Frontend
- Vanilla JavaScript
- Supabase JS Client
- Font Awesome 6.4.0
- CSS Grid Layout
- Smooth animations

### Backend
- Supabase PostgreSQL
- JSONB for features array
- RLS policies for security
- Automatic timestamps

### Authentication
- Supabase Auth required
- Session-based
- Auto-redirect protection

## 📚 File Structure

```
Anuranan/
├── COURSES_TABLE_SETUP.sql          # Database setup
├── COURSE_MANAGEMENT_GUIDE.md       # Full documentation
├── COURSE_MANAGEMENT_SUMMARY.md     # This file
├── admin/
│   ├── index.html                   # Admin dashboard (updated)
│   ├── courses.html                 # NEW: Course management
│   ├── admin.css                    # Existing styles
│   ├── admin.js                     # Existing scripts
│   └── supabase-loader.js          # Supabase client
└── website/
    ├── index.html                   # Main site (updated)
    ├── script.js                    # Scripts (updated)
    ├── styles.css                   # Existing styles
    └── supabase-loader.js          # Supabase client
```

## ✨ Key Features Summary

✅ **Dynamic Course Loading** - Courses load from database  
✅ **Full CRUD Operations** - Create, Read, Update, Delete  
✅ **Same Design & Style** - Preserves original website look  
✅ **Easy Management** - User-friendly admin interface  
✅ **Badge Support** - Popular, New, Discount badges  
✅ **Featured Courses** - Special styling for highlighted courses  
✅ **Visibility Control** - Show/hide courses without deletion  
✅ **Order Management** - Control course display sequence  
✅ **Feature Lists** - Dynamic feature management  
✅ **Icon Preview** - See icon before saving  
✅ **Mobile Friendly** - Responsive admin panel  
✅ **Secure** - RLS policies protect data  

## 🎯 Next Steps

1. ✅ Run SQL script in Supabase
2. ✅ Test website - verify courses load
3. ✅ Login to admin panel
4. ✅ Navigate to Course Management
5. ✅ Try adding/editing a course
6. ✅ Test visibility toggle
7. ✅ Verify changes on website

## 💡 Pro Tips

- Use **display_order** in increments of 10 (10, 20, 30...)
- Keep **descriptions** concise but compelling
- Use **4-5 features** per course for consistency
- **Preview** on website after every change
- Use **badges** sparingly for maximum impact
- **Featured** courses should be special offers
- Keep **icon classes** consistent with Font Awesome

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Courses not loading | Check Supabase connection, verify RLS policies |
| Can't edit courses | Ensure you're logged in as admin |
| Icon not showing | Use correct Font Awesome class format |
| Wrong badge color | Check badge_type matches: popular/new/discount |
| Course not on website | Verify is_active = true |

## 📞 Support Resources

- **Full Guide**: Read `COURSE_MANAGEMENT_GUIDE.md`
- **SQL Script**: `COURSES_TABLE_SETUP.sql`
- **Admin Panel**: `admin/courses.html`
- **Supabase Docs**: https://supabase.com/docs

---

**Status**: ✅ Ready to Use  
**Last Updated**: November 2025  
**Version**: 1.0
