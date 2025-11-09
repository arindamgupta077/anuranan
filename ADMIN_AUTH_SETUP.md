# Supabase Admin User Setup Guide

## Overview
The admin panel now uses **Supabase Authentication** instead of JavaScript password checking. This provides proper security and allows RLS policies to work correctly.

## Step 1: Run the Updated SQL Script

First, update your database with the corrected RLS policies:

1. Go to Supabase Dashboard → **SQL Editor**
2. Create a **New Query**
3. Copy and paste the entire `CLASS_DETAILS_TABLE.sql` file
4. Click **Run**

The new policies use `auth.uid() IS NOT NULL` which checks for authenticated users.

## Step 2: Create Admin User in Supabase

### Method A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Click on **Authentication** in the left sidebar
3. Click on **Users** tab
4. Click **Add User** (or **Invite User**)
5. Fill in the details:
   - **Email:** `admin@anuranan.in` (or your preferred email)
   - **Password:** Create a strong password
   - **Auto Confirm User:** ✅ Enable this (important!)
6. Click **Create User**

### Method B: Using SQL (Alternative)

Run this SQL in the Supabase SQL Editor:

```sql
-- Create admin user
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@anuranan.in',
    crypt('YourStrongPassword123!', gen_salt('bf')), -- Replace with your password
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);
```

**Note:** Replace `YourStrongPassword123!` with your actual password.

## Step 3: Test the Login

1. Go to your admin panel: `https://yourdomain.com/admin/`
2. Enter the credentials:
   - **Email:** `admin@anuranan.in` (or the email you created)
   - **Password:** The password you set
3. Click **Login**
4. You should now be authenticated and see the dashboard

## Step 4: Test Class Details CRUD

1. Navigate to **Edit Class Details** in the sidebar
2. Click **Add Class**
3. Fill in the form:
   - Subject: "Test Class"
   - Branch: "Test Branch"
   - Day: Select any day
   - Timings: "10:00 AM - 12:00 PM"
4. Click **Save Class**
5. ✅ It should save successfully without RLS errors!

## What Changed?

### 1. SQL Policies (CLASS_DETAILS_TABLE.sql)
**Before:**
```sql
WITH CHECK (auth.role() = 'authenticated')
```

**After:**
```sql
WITH CHECK (auth.uid() IS NOT NULL)
```

### 2. Admin JavaScript (admin/admin.js)
- ❌ Removed: JavaScript password checking
- ✅ Added: Supabase `signInWithPassword()` authentication
- ✅ Added: Session management with `getSession()`
- ✅ Added: Proper sign out with `signOut()`

### 3. Admin HTML (admin/index.html)
- Added email input field
- Updated login form to accept email + password

## Security Benefits

✅ **Proper Authentication:** Uses Supabase Auth instead of client-side password
✅ **RLS Compatibility:** Authenticated users can now pass RLS policies
✅ **Session Management:** Sessions persist across page refreshes
✅ **Secure Logout:** Properly destroys sessions
✅ **Password Hashing:** Passwords stored securely in Supabase

## Troubleshooting

### Issue: "Invalid login credentials"
**Solution:** Double-check email and password, ensure user was created in Supabase

### Issue: "Email not confirmed"
**Solution:** In Supabase Dashboard → Authentication → Users → Click on user → Confirm email

### Issue: Still getting RLS error
**Solution:** 
1. Make sure you ran the updated SQL script
2. Check if user is actually logged in (check browser console)
3. Verify policies in Supabase: Table Editor → class_details → RLS tab

### Issue: "Cannot read property 'auth' of undefined"
**Solution:** Ensure Supabase SDK is loaded before admin.js runs

## Important Notes

1. **Email Confirmation:** Make sure "Auto Confirm User" is enabled when creating the user, or manually confirm the email in the dashboard

2. **Password Requirements:** Use a strong password (minimum 6 characters recommended)

3. **Multiple Admins:** You can create multiple admin users by repeating Step 2

4. **Password Reset:** If you forget the password, you can reset it from Supabase Dashboard → Authentication → Users → Click user → Reset Password

## Recommended Admin Credentials

For production:
- **Email:** `admin@anuranan.in`
- **Password:** Use a strong, unique password (save it securely!)

For testing:
- **Email:** `test@anuranan.in`
- **Password:** `TestAdmin123!`

## Next Steps

1. ✅ Run updated SQL script
2. ✅ Create admin user in Supabase
3. ✅ Test login with new credentials
4. ✅ Test adding/editing/deleting classes
5. ✅ Delete test user if created
6. ✅ Keep admin credentials secure!

---

**Remember:** Never commit credentials to Git! Keep your admin email and password secure.
