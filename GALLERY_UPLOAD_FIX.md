# Gallery Upload Issue - Fixed

## Problems Identified

1. **Old photos disappearing after uploading new photo**
   - Caused by filename conflicts when using same title/description
   - `upsert: true` was overwriting files instead of creating new ones

2. **Photos showing as uploaded but not reflecting on website**
   - CDN caching issues with Supabase Storage
   - Browser cache not refreshing images
   - No cache-busting mechanism in place

## Solutions Implemented

### 1. Unique Filename Generation
- **Before**: `title___description.ext`
- **After**: `title___description___timestamp.ext`
- Each upload now has a unique timestamp, preventing conflicts
- Old photos won't be overwritten even with same title

### 2. Cache Busting
- Added cache-busting query parameters to all image URLs
- Format: `imageUrl?t=timestamp`
- Both admin panel and website now use fresh images
- Reduced cache time from 3600s to 300s (5 minutes)

### 3. Upload Verification
- Added verification step after upload
- Logs upload details to console
- Checks if file exists in storage after upload
- Better error messages for troubleshooting

### 4. Auto-Refresh on Website
- Website gallery auto-refreshes every 30 seconds
- Catches new uploads without manual page reload
- Can manually refresh with `window.refreshGallery()`

### 5. Improved Delete Process
- Deletes old file completely before uploading new one during edits
- Ensures no orphaned files in storage
- Better error handling if deletion fails

## Testing the Fix

### Test 1: Upload New Photo
1. Go to Admin Panel > Gallery Management
2. Click "Add Photo"
3. Fill in title and description
4. Select an image
5. Click "Save Photo"
6. ✅ Photo should appear immediately in admin grid
7. ✅ Within 30 seconds, photo should appear on website

### Test 2: Upload Multiple Photos with Same Title
1. Upload a photo with title "Test"
2. Upload another photo with same title "Test"
3. ✅ Both photos should be visible (not overwrite)
4. ✅ Both show different timestamps in filename

### Test 3: Edit Existing Photo
1. Click "Edit" on any gallery photo
2. Change image (keep same title/description)
3. Click "Save Photo"
4. ✅ Old photo should be deleted
5. ✅ New photo should appear with new timestamp
6. ✅ Website updates within 30 seconds

### Test 4: Cache Refresh
1. Upload a new photo
2. Open website in incognito/private window
3. ✅ New photo should be visible immediately
4. Open DevTools (F12) > Network tab
5. ✅ Image URLs should have `?t=timestamp` parameter

## Browser Console Debugging

When uploading, check browser console (F12) for:
```
Uploading new file: [filename]
File size: [bytes] bytes
File type: [mime-type]
Upload successful: [upload data]
Upload verified successfully: [verification data]
```

If you see errors:
- Check Supabase storage permissions
- Verify bucket name is correct (`gallery-photos`)
- Check file size limits
- Ensure user is authenticated

## Manual Refresh (If Needed)

If photos don't appear on website after 30 seconds:
1. Open browser console (F12)
2. Run: `window.refreshGallery()`
3. Or hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)

## Files Modified

1. **admin/admin.js**
   - Added timestamp to filenames
   - Implemented cache busting
   - Added upload verification
   - Improved error handling
   - Better delete process

2. **website/supabase-loader.js**
   - Added cache busting to image URLs
   - Auto-refresh every 30 seconds
   - Handle both old and new filename formats
   - Exposed manual refresh function

## Backward Compatibility

The system handles both filename formats:
- **Old format**: `title___description.ext`
- **New format**: `title___description___timestamp.ext`

Existing photos will continue to work without re-upload.

## Performance Improvements

- Reduced cache time: 3600s → 300s (5 minutes)
- Auto-refresh prevents stale content
- Faster updates visible to users
- Better CDN cache management

## Next Steps

1. Test the upload process
2. Upload a few test photos
3. Verify they appear on both admin and website
4. Check browser console for any errors
5. Delete test photos when done

## Support

If issues persist:
1. Check browser console (F12) for errors
2. Verify Supabase credentials are correct
3. Check storage bucket permissions
4. Ensure file types are supported (jpg, png, gif, webp)
5. Try with different file sizes (keep under 5MB)

## Rollback (If Needed)

If the new system causes issues, you can temporarily disable timestamp:
1. In `admin.js`, change line:
   ```javascript
   const fileName = `${encodeURIComponent(title)}___${encodeURIComponent(description)}.${fileExt}`;
   ```
2. Set `upsert: true` if you want old behavior

However, this is **NOT recommended** as it will bring back the original issues.
