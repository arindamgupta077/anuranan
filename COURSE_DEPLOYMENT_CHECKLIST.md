# ✅ Course Management Deployment Checklist

Use this checklist to ensure proper deployment of the Course Management system.

---

## 📋 Pre-Deployment Checklist

### Database Setup
- [ ] Supabase project is active
- [ ] Have database admin access
- [ ] SQL Editor is accessible
- [ ] Backup existing data (if any)

### File Verification
- [ ] `COURSES_TABLE_SETUP.sql` exists
- [ ] `admin/courses.html` exists
- [ ] `website/index.html` updated
- [ ] `website/script.js` updated
- [ ] `website/styles.css` updated
- [ ] `admin/index.html` updated

### Authentication
- [ ] Admin user account exists
- [ ] Can login to admin panel
- [ ] Supabase auth configured
- [ ] Session management working

---

## 🚀 Deployment Steps

### Step 1: Database Deployment
```
✅ Task: Execute SQL script
```
- [ ] Open Supabase Dashboard
- [ ] Navigate to SQL Editor
- [ ] Open `COURSES_TABLE_SETUP.sql`
- [ ] Copy entire file contents
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Verify no errors in output
- [ ] Check "Success" message appears

**Verification SQL**:
```sql
SELECT COUNT(*) FROM public.courses;
-- Should return: 6
```

### Step 2: Verify Database
```
✅ Task: Confirm table creation
```
- [ ] Table `courses` exists
- [ ] 6 sample courses inserted
- [ ] RLS policies enabled
- [ ] Indexes created
- [ ] Trigger created

**Check RLS**:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'courses';
-- rowsecurity should be TRUE
```

**Check Policies**:
```sql
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'courses';
-- Should show 5 policies
```

### Step 3: Deploy Website Files
```
✅ Task: Update website files
```
- [ ] Upload `website/index.html`
- [ ] Upload `website/script.js`
- [ ] Upload `website/styles.css`
- [ ] Clear CDN cache (if using)
- [ ] Verify `supabase-loader.js` loads

### Step 4: Deploy Admin Files
```
✅ Task: Update admin panel
```
- [ ] Upload `admin/index.html`
- [ ] Upload `admin/courses.html`
- [ ] Verify `admin/supabase-loader.js` loads
- [ ] Verify `admin/admin.css` loads

### Step 5: Test Website
```
✅ Task: Verify public-facing site
```
- [ ] Open website in browser
- [ ] Navigate to "Our Courses" section
- [ ] Courses load (no spinner stuck)
- [ ] All 6 courses display
- [ ] Bengali Recitation has "Popular" badge
- [ ] Anchoring Classes has "New" badge
- [ ] Combo Package is featured
- [ ] Combo Package has "Save 30%" badge
- [ ] All icons display correctly
- [ ] All features show checkmarks
- [ ] Buttons say correct text
- [ ] Hover effects work
- [ ] Mobile responsive

**Expected Course Order**:
1. Bengali Recitation (Popular)
2. English Recitation
3. Hindi Recitation
4. Anchoring Classes (New)
5. Acting Workshops
6. Combo Package (Featured)

### Step 6: Test Admin Panel
```
✅ Task: Verify admin functionality
```

**Login Test**:
- [ ] Can access `admin/index.html`
- [ ] Login page appears
- [ ] Can login successfully
- [ ] Dashboard loads

**Navigation Test**:
- [ ] "Course Management" link visible
- [ ] Link works when clicked
- [ ] `admin/courses.html` loads
- [ ] Form appears correctly
- [ ] Course list appears below

**Add Course Test**:
- [ ] Can fill all fields
- [ ] Icon preview works
- [ ] Can add features
- [ ] Can remove features
- [ ] Form validation works
- [ ] "Save Course" button works
- [ ] Success message appears
- [ ] New course appears in list

**Edit Course Test**:
- [ ] Click "Edit" on a course
- [ ] Form populates correctly
- [ ] Icon preview shows
- [ ] Features list loads
- [ ] Can modify data
- [ ] "Update Course" button works
- [ ] Changes reflect in list

**Toggle Test**:
- [ ] Click "Hide" button
- [ ] Status changes to "Inactive"
- [ ] Course hidden on website
- [ ] Click "Show" button
- [ ] Status changes to "Active"
- [ ] Course visible on website

**Delete Test**:
- [ ] Click "Delete" button
- [ ] Confirmation popup appears
- [ ] Click "Cancel" - nothing happens
- [ ] Click "Delete" again
- [ ] Click "OK" - course removed
- [ ] Course gone from list
- [ ] Course gone from website

**Mobile Test**:
- [ ] Open on mobile device
- [ ] Form is responsive
- [ ] Can scroll and interact
- [ ] Buttons are tappable
- [ ] No layout issues

---

## 🔍 Verification Tests

### Database Verification

**Test 1: Public Read Access**
```sql
-- Run as anonymous user
SELECT * FROM courses WHERE is_active = true;
-- Should return 6 rows
```

**Test 2: Admin Write Access**
```sql
-- Run as authenticated admin
INSERT INTO courses (title, description, icon, features)
VALUES ('Test Course', 'Test', 'fas fa-test', '["Feature 1"]'::jsonb);
-- Should succeed
```

**Test 3: Inactive Course Hiding**
```sql
-- Update a course to inactive
UPDATE courses SET is_active = false WHERE title = 'Test Course';
-- Verify it doesn't show on website
```

### Website Verification

**Test 1: Dynamic Loading**
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Refresh website
- [ ] No errors in console
- [ ] See Supabase requests in Network tab
- [ ] Courses load successfully

**Test 2: Badge Styling**
- [ ] "Popular" badge is yellow
- [ ] "New" badge is green/red
- [ ] "Save 30%" badge is red
- [ ] Featured badge has crown icon

**Test 3: Responsiveness**
- [ ] Desktop: 3 columns
- [ ] Tablet: 2 columns  
- [ ] Mobile: 1 column
- [ ] All text readable
- [ ] Buttons work

### Admin Panel Verification

**Test 1: Authentication**
- [ ] Logout works
- [ ] Redirects to login
- [ ] Can't access `courses.html` without login
- [ ] Login and redirect works

**Test 2: Form Validation**
- [ ] Can't submit empty title
- [ ] Can't submit empty description
- [ ] Can't submit empty icon
- [ ] Must have at least 1 feature
- [ ] Error messages appear

**Test 3: Real-time Updates**
- [ ] Add course
- [ ] Immediately check website
- [ ] New course appears
- [ ] Edit course
- [ ] Changes reflect on website
- [ ] Delete course
- [ ] Removed from website

---

## 🐛 Troubleshooting Guide

### Issue: SQL Script Fails

**Symptoms**: Error messages in SQL Editor

**Solutions**:
- [ ] Check if table already exists (DROP first)
- [ ] Verify RLS is supported
- [ ] Check for syntax errors
- [ ] Run sections individually
- [ ] Contact Supabase support

### Issue: Courses Don't Load on Website

**Symptoms**: Spinner keeps spinning

**Solutions**:
- [ ] Check browser console for errors
- [ ] Verify Supabase URL/Key in `supabase-loader.js`
- [ ] Check RLS policies enabled
- [ ] Verify courses have `is_active = true`
- [ ] Check network requests in DevTools

### Issue: Can't Access Admin Panel

**Symptoms**: Redirects to login or errors

**Solutions**:
- [ ] Verify logged in
- [ ] Check session validity
- [ ] Clear browser cache/cookies
- [ ] Try incognito mode
- [ ] Re-login

### Issue: Icon Not Displaying

**Symptoms**: No icon or broken icon

**Solutions**:
- [ ] Verify Font Awesome CDN loaded
- [ ] Check icon class format: `fas fa-name`
- [ ] Try different icon
- [ ] Check browser console
- [ ] Verify Font Awesome version

### Issue: Badge Wrong Color

**Symptoms**: Badge appears but wrong color

**Solutions**:
- [ ] Check `badge_type` field
- [ ] Verify CSS classes exist
- [ ] Clear browser cache
- [ ] Check for CSS conflicts

---

## 📊 Success Metrics

After deployment, verify:

### Database Metrics
- [ ] ✅ 6 courses in database
- [ ] ✅ RLS enabled and working
- [ ] ✅ Policies active (5 total)
- [ ] ✅ Indexes created (3 total)
- [ ] ✅ Trigger working

### Website Metrics
- [ ] ✅ Courses load in < 2 seconds
- [ ] ✅ No console errors
- [ ] ✅ All badges display
- [ ] ✅ All icons show
- [ ] ✅ Responsive on all devices
- [ ] ✅ Animations smooth

### Admin Metrics
- [ ] ✅ Can add courses
- [ ] ✅ Can edit courses
- [ ] ✅ Can delete courses
- [ ] ✅ Can toggle visibility
- [ ] ✅ Changes reflect immediately
- [ ] ✅ Form validation works
- [ ] ✅ Mobile usable

---

## 📝 Post-Deployment Tasks

### Documentation
- [ ] Share `COURSE_MANAGEMENT_GUIDE.md` with admins
- [ ] Print `COURSE_MANAGEMENT_QUICK_REF.md`
- [ ] Create backup of SQL script
- [ ] Document admin credentials securely

### Training
- [ ] Train admin users
- [ ] Demo course creation
- [ ] Show edit/delete functions
- [ ] Explain badge system
- [ ] Show icon selection
- [ ] Practice on test course

### Monitoring
- [ ] Set up error monitoring
- [ ] Monitor Supabase usage
- [ ] Check course load times
- [ ] Verify mobile experience
- [ ] Monitor admin activity

### Maintenance
- [ ] Schedule regular backups
- [ ] Plan content updates
- [ ] Review course performance
- [ ] Update descriptions seasonally
- [ ] Archive old courses

---

## 🎯 Final Verification

Before marking as complete:

**Database** ✅
- [ ] Table created successfully
- [ ] Sample data inserted
- [ ] RLS working correctly
- [ ] Can query from website
- [ ] Can modify from admin

**Website** ✅
- [ ] Courses load dynamically
- [ ] Design matches original
- [ ] Responsive on all devices
- [ ] No errors in console
- [ ] Performance acceptable

**Admin Panel** ✅
- [ ] Full CRUD working
- [ ] Authentication required
- [ ] Form validation active
- [ ] Real-time updates
- [ ] Mobile functional

**Documentation** ✅
- [ ] All guides created
- [ ] Quick reference available
- [ ] SQL script documented
- [ ] Training materials ready

---

## 🎉 Deployment Complete

When all items are checked:

✅ **Database**: Deployed and verified  
✅ **Website**: Updated and tested  
✅ **Admin Panel**: Functional and secure  
✅ **Documentation**: Complete and distributed  
✅ **Training**: Admins know how to use  
✅ **Testing**: All scenarios verified  

**Status**: 🟢 PRODUCTION READY

---

## 📞 Support Contacts

**Technical Issues**:
- Supabase Dashboard: [your-project].supabase.co
- Documentation: See `COURSE_MANAGEMENT_GUIDE.md`

**Admin Support**:
- Quick Reference: `COURSE_MANAGEMENT_QUICK_REF.md`
- Training: Schedule with admin trainer

---

## 🔄 Rollback Plan

If deployment fails:

### Rollback Database
```sql
DROP TABLE IF EXISTS public.courses CASCADE;
-- Restore from backup if needed
```

### Rollback Website
- Restore previous `index.html`
- Restore previous `script.js`
- Clear CDN cache

### Rollback Admin
- Restore previous `admin/index.html`
- Remove `admin/courses.html`

---

**Checklist Version**: 1.0  
**Last Updated**: November 2025  
**Deployment Date**: _______________  
**Deployed By**: _______________  
**Verified By**: _______________

---

**Print this checklist and check off items as you complete them!** ✅
