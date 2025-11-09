# Class Details Troubleshooting Guide

## Issue: "Unable to load class details"

### Quick Fix Steps:

## Step 1: Run the SQL Script in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **dcbqaerzqfpntghptrfq**
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `CLASS_DETAILS_TABLE.sql`
6. Paste into the SQL editor
7. Click **Run** (or press Ctrl+Enter)
8. You should see: "Success. No rows returned"

## Step 2: Verify Table Creation

1. In Supabase Dashboard, go to **Table Editor**
2. You should see a new table called **class_details**
3. Click on it to view the 4 sample rows

## Step 3: Check RLS Policies

1. In Table Editor, click on **class_details** table
2. Click on the **RLS** tab
3. You should see 4 policies:
   - ✅ Allow public read access to class details
   - ✅ Allow authenticated users to insert class details
   - ✅ Allow authenticated users to update class details
   - ✅ Allow authenticated users to delete class details

## Step 4: Test the Website

1. Clear your browser cache (Ctrl+Shift+Delete)
2. Hard refresh the website (Ctrl+F5)
3. Navigate to the "Class Details" section
4. You should now see the 4 sample classes:
   - Monday: Rabindra Sangeet
   - Wednesday: Tabla
   - Saturday: Classical Dance
   - Sunday: Painting

## Common Issues & Solutions

### Issue: "Table does not exist"
**Solution:** You haven't run the SQL script yet. Go to Step 1.

### Issue: "Permission denied"
**Solution:** RLS policies not created. Re-run the SQL script completely.

### Issue: Still showing loading spinner
**Solution:** 
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Share the error with me for further help

### Issue: "Supabase client not loaded"
**Solution:**
1. Check if `supabase-loader.js` is loaded in the HTML
2. Verify the script tag is before `script.js`
3. Check browser console for 404 errors

## Manual Testing in Supabase

You can test if the table works directly in Supabase:

1. Go to **SQL Editor**
2. Run this query:
```sql
SELECT * FROM public.class_details;
```
3. You should see 4 rows of sample data

## What Changed in Latest Update

### Fixed Issues:
1. ✅ Changed `supabase` to `supabaseClient` in website/script.js
2. ✅ Added better error handling with error messages
3. ✅ Improved ordering (by created_at instead of day)
4. ✅ Added Supabase client existence check

### Files Modified:
- `website/script.js` - Fixed Supabase client reference
- `admin/admin.js` - Improved ordering

## Next Steps

1. **Run the SQL script** (most important!)
2. Test the website
3. If still having issues, check browser console (F12)
4. Share any error messages for further debugging

## Expected Result

Once working, you should see:
- Website: Class schedule grouped by days with times
- Admin: Grid of class cards with edit/delete buttons
- Sample data: 4 classes displayed

---

**Remember:** The #1 reason for "Unable to load class details" is that the SQL script hasn't been executed in Supabase yet!
