# Admin Panel - Quick Reference

## 🔐 Login
- **URL**: `admin.html`
- **Default Password**: `anuranan2024`
- **Change Password**: Edit line 18 in `admin.js`

## 📸 Gallery Management

### Add Photo
1. Click "Add Photo" button
2. Fill in:
   - Title (e.g., "Student Performances")
   - Description (e.g., "Annual Cultural Program 2024")
   - Upload image file (PNG, JPG, JPEG - Max 5MB)
3. Preview appears automatically
4. Click "Save Photo"

### Edit Photo
1. Click "Edit" button on any gallery item
2. Modify title and/or description
3. Optionally upload new image
4. Click "Save Photo"

### Delete Photo
1. Click "Delete" button on any gallery item
2. Confirm deletion in popup
3. Photo is permanently removed

## 📅 Events Management

### Add Event
1. Click "Add Event" button
2. Fill in all fields:
   - **Date**: Day (1-31) and Month (JAN-DEC)
   - **Category**: Select from dropdown
     - Cultural Program
     - Workshop
     - Celebration
     - Competition
     - Special Event
   - **Title**: Event name
   - **Description**: Detailed information
   - **Time**: e.g., "5:00 PM - 8:00 PM"
   - **Location**: e.g., "Main Auditorium"
3. Click "Save Event"

### Edit Event
1. Click "Edit" button on any event card
2. Modify any fields
3. Click "Save Event"

### Delete Event
1. Click "Delete" button on any event card
2. Confirm deletion in popup
3. Event is permanently removed

## 🔄 How Data is Stored

### Gallery Photos
- **Storage**: Supabase `gallery-photos` bucket
- **Format**: `{title}___{description}.{extension}`
- **Example**: `Student_Performances___Annual_Program_2024.jpg`

### Events
- **Storage**: Supabase `event-images` bucket
- **Format**: `{day}_{month}_{category}___{title}___{description}___{time}___{location}.json`
- **Example**: `15_DEC_Cultural_Program___Recitation_Competition___...json`

## 🌐 Main Website Integration

Changes made in admin panel appear **immediately** on the main website:
- Gallery photos → "Our Gallery" section
- Events → "Events & Programs" section

No manual update required!

## 💡 Tips & Best Practices

### For Gallery:
- Use high-quality images (1920x1080 or higher)
- Compress images before upload for faster loading
- Use descriptive titles and descriptions
- Organize by event type or date

### For Events:
- Keep descriptions concise but informative
- Use consistent time format (12-hour with AM/PM)
- Update past events or archive them
- Add events well in advance

## ⚠️ Important Notes

### File Naming
- System automatically handles special characters
- Titles and descriptions are URL-encoded
- Don't use `___` (triple underscore) in your text

### File Size Limits
- Maximum image size: 5MB
- Larger files will fail to upload
- Compress images using tools like TinyPNG

### Browser Compatibility
- Works best in Chrome, Firefox, Safari, Edge
- Requires JavaScript enabled
- Requires internet connection for Supabase

## 🐛 Troubleshooting

### Photos not uploading?
- Check file size (max 5MB)
- Verify file format (PNG, JPG, JPEG only)
- Check browser console for errors
- Verify Supabase bucket policies

### Events not saving?
- Fill all required fields (marked with *)
- Check browser console for errors
- Verify internet connection
- Check Supabase bucket exists

### Changes not appearing on website?
- Hard refresh main website (Ctrl+F5)
- Clear browser cache
- Check browser console for errors
- Verify Supabase buckets are PUBLIC

### Cannot login?
- Verify password (default: `anuranan2024`)
- Check if password was changed in code
- Clear browser cache
- Try different browser

## 🔒 Security Recommendations

### For Production:
1. **Change default password** in `admin.js`
2. **Use HTTPS** for production deployment
3. **Implement proper authentication** with Supabase Auth
4. **Add rate limiting** to prevent abuse
5. **Regular backups** of Supabase data
6. **Monitor storage usage** in Supabase dashboard

## 📊 Storage Usage

### Monitor in Supabase Dashboard:
- Go to: Storage → Your bucket → Settings
- Check: Current usage, File count, Quota
- Upgrade plan if needed

### Typical Usage:
- Each gallery photo: 500KB - 2MB
- Each event JSON: < 5KB
- 100 photos ≈ 50-200MB

## 🔗 Quick Links

- [Main Website](index.html)
- [Admin Panel](admin.html)
- [Setup Guide](setup-guide.html)
- [Connection Test](test-connection.html)
- [Supabase Dashboard](https://supabase.com/dashboard/project/ghcsoyispspvjvbkcfoj)

## 📞 Need Help?

1. Check `ADMIN_SETUP.md` for detailed setup instructions
2. Run `test-connection.html` to diagnose issues
3. Check browser console for error messages
4. Verify Supabase dashboard for bucket status

---

**Version**: 1.0  
**Last Updated**: November 2025
