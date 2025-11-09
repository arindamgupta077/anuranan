# Quick Fix Guide - RLS Policy Error

## The Problem
Error: "new row violates row-level security policy for table class_details"

This happens because the admin panel was using JavaScript password (not real Supabase authentication), so RLS policies blocked the insert.

## The Solution (3 Steps)

### Step 1: Update RLS Policies in Supabase

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Drop old policies
DROP POLICY IF EXISTS "Allow authenticated users to insert class details" ON public.class_details;
DROP POLICY IF EXISTS "Allow authenticated users to update class details" ON public.class_details;
DROP POLICY IF EXISTS "Allow authenticated users to delete class details" ON public.class_details;

-- Create new policies
CREATE POLICY "Allow authenticated users to insert class details"
ON public.class_details FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update class details"
ON public.class_details FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to delete class details"
ON public.class_details FOR DELETE
USING (auth.uid() IS NOT NULL);
```

6. Click **RUN** (or press Ctrl+Enter)
7. Should see: "Success. 0 rows returned"

### Step 2: Create Admin User in Supabase

1. In Supabase Dashboard, click **Authentication** (left sidebar)
2. Click **Users** tab
3. Click **Add User** button
4. Fill in:
   - **Email:** `admin@anuranan.in` (or your email)
   - **Password:** Choose a strong password (save it!)
   - **✅ Auto Confirm User** ← IMPORTANT! Check this box
5. Click **Create User**
6. **Save your password somewhere safe!**

### Step 3: Login with New Credentials

1. Go to your admin panel
2. You'll now see TWO fields:
   - **Email:** Enter `admin@anuranan.in`
   - **Password:** Enter the password you just created
3. Click **Login**
4. Try adding a class again - should work now! ✅

## What I Changed

### Files Modified:
1. ✅ `admin/admin.js` - Now uses Supabase Auth instead of JavaScript password
2. ✅ `admin/index.html` - Added email field to login form
3. ✅ `CLASS_DETAILS_TABLE.sql` - Updated RLS policies to use `auth.uid()`

### Before:
- Login: JavaScript password check (not real auth)
- RLS: `auth.role() = 'authenticated'` (always failed)

### After:
- Login: Real Supabase authentication
- RLS: `auth.uid() IS NOT NULL` (works with auth)

## Quick Test

After completing Steps 1-3:

1. Admin Panel → Edit Class Details
2. Click **Add Class**
3. Fill in form:
   - Subject: "Test Subject"
   - Branch: "Test Branch"  
   - Day: "Monday"
   - Timings: "10:00 AM - 12:00 PM"
4. Click **Save Class**
5. ✅ Should save successfully!

## Important Notes

⚠️ **Auto Confirm User**: You MUST check this box when creating the user, otherwise you'll need to verify the email.

🔒 **Save Your Password**: Keep the admin email and password secure. Don't commit them to GitHub.

👥 **Multiple Admins**: You can create multiple admin users by repeating Step 2.

## Troubleshooting

**"Invalid login credentials"**
- Check email and password are correct
- Verify user exists in Supabase → Authentication → Users

**"Email not confirmed"**
- Go to Supabase → Authentication → Users
- Click on the user → Click "Confirm Email"

**Still getting RLS error**
- Make sure you ran the SQL from Step 1
- Check browser console for error messages
- Verify you're logged in (check Supabase session)

---

That's it! Your admin panel now uses proper Supabase authentication. 🎉
