# 🚀 QUICK START - Cache Busting

## Problem Solved ✅
**Before:** Changes not showing until browser cache cleared  
**After:** Changes appear automatically on page refresh

---

## 🎯 When You Update CSS or JavaScript

### Option 1: Automatic (EASIEST) ⭐
1. Make your changes to any CSS/JS file
2. **Double-click `update-version.bat`**
3. Done! All versions updated automatically

### Option 2: Manual
Find the file you changed and update its version in HTML:

```html
<!-- Change this: -->
<link rel="stylesheet" href="styles.css?v=1.0">

<!-- To this: -->
<link rel="stylesheet" href="styles.css?v=1.1">
```

---

## 📋 Quick Reference Table

| File Changed | Update This HTML File | Find & Change |
|-------------|----------------------|---------------|
| `website/styles.css` | `website/index.html` | `styles.css?v=X.X` |
| `website/script.js` | `website/index.html` | `script.js?v=X.X` |
| `admin/admin.css` | `admin/index.html` & `admin/courses.html` | `admin.css?v=X.X` |
| `admin/admin.js` | `admin/index.html` | `admin.js?v=X.X` |

---

## 🔄 Complete Workflow

```
1. Edit CSS/JS file
   ↓
2. Run update-version.bat (or update manually)
   ↓
3. Test locally
   ↓
4. git add . && git commit -m "Update styles v1.1"
   ↓
5. git push origin main
   ↓
6. Deploy (automatic on Render/Netlify)
   ↓
7. ✅ Users see changes immediately!
```

---

## 🧪 Testing

1. **Open website** in browser
2. **Press F12** (Developer Tools)
3. **Go to Network tab**
4. **Refresh (F5)**
5. **Verify** new version numbers are loaded
6. **Check** your changes are visible

---

## 💡 Version Number Tips

### Use Timestamp (Recommended)
- Script does this automatically
- Example: `v=202511101430`

### Or Increment Manually
- Start: `v=1.0`
- Small change: `v=1.1`
- Big change: `v=2.0`

---

## ⚡ PowerShell Commands

```powershell
# Update everything with timestamp
.\update-version.ps1

# Update only CSS
.\update-version.ps1 -FileType css

# Update only JS
.\update-version.ps1 -FileType js
```

---

## 🆘 Troubleshooting

**Changes still not showing?**
1. ✅ Check version number was actually updated in HTML
2. ✅ Clear browser cache completely (Ctrl+Shift+Delete)
3. ✅ Try incognito/private window
4. ✅ Verify file was deployed to server

**Script won't run?**
```powershell
# Run this once (as Administrator):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📚 Full Documentation

- **Complete Guide:** `CACHE_BUSTING_GUIDE.md`
- **Resolution Details:** `CACHE_BUSTING_RESOLVED.md`

---

**Status:** ✅ RESOLVED  
**Last Updated:** November 10, 2025

**Remember:** Update version = instant updates for users! 🎉
