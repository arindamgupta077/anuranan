# Cache Busting Guide

## Overview
This guide explains how to prevent browser caching issues when you update your website files.

## What Has Been Implemented

### 1. Cache Control Meta Tags
All HTML files now include these meta tags to prevent HTML caching:
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

### 2. Version Parameters on Static Assets
All CSS and JavaScript files now have version parameters:
- `styles.css?v=1.0`
- `script.js?v=1.0`
- `admin.css?v=1.0`
- `admin.js?v=1.0`
- `supabase-loader.js?v=1.0`

## How to Use

### When You Update CSS or JavaScript Files

**Every time you make changes to any CSS or JS file**, you need to increment the version number in the corresponding HTML file.

#### Example:
If you update `styles.css`, change this line in `website/index.html`:

**Before:**
```html
<link rel="stylesheet" href="styles.css?v=1.0">
```

**After:**
```html
<link rel="stylesheet" href="styles.css?v=1.1">
```

Or use a timestamp/date format:
```html
<link rel="stylesheet" href="styles.css?v=20251110">
```

### Files and Their Locations

#### Website Files (`website/` folder)
**File:** `website/index.html`
- Update version for `styles.css?v=X.X`
- Update version for `script.js?v=X.X`
- Update version for `supabase-loader.js?v=X.X`

#### Admin Files (`admin/` folder)
**File:** `admin/index.html`
- Update version for `admin.css?v=X.X`
- Update version for `admin.js?v=X.X`

**File:** `admin/courses.html`
- Update version for `admin.css?v=X.X`

## Quick Reference

| When You Update... | Update Version In... |
|-------------------|---------------------|
| `website/styles.css` | `website/index.html` → `styles.css?v=X.X` |
| `website/script.js` | `website/index.html` → `script.js?v=X.X` |
| `website/supabase-loader.js` | `website/index.html` → `supabase-loader.js?v=X.X` |
| `admin/admin.css` | `admin/index.html` AND `admin/courses.html` → `admin.css?v=X.X` |
| `admin/admin.js` | `admin/index.html` → `admin.js?v=X.X` |

## Version Numbering Strategies

### Option 1: Semantic Versioning
- Start with `v=1.0`
- Minor changes: `v=1.1`, `v=1.2`, etc.
- Major changes: `v=2.0`, `v=3.0`, etc.

### Option 2: Date-Based Versioning
- Use date format: `v=20251110` (YYYYMMDD)
- Easy to track when changes were made
- Example: `v=20251110-1` for multiple updates on same day

### Option 3: Timestamp
- Use Unix timestamp or datetime: `v=202511101430`
- Guaranteed unique
- Can be automated

## For Images
Images loaded from Supabase or external sources are handled by their own URLs. If you update an image:
1. **Option A:** Upload with a new filename
2. **Option B:** Add a version parameter when referencing it in your code:
   ```javascript
   imageUrl = `${baseUrl}?v=${Date.now()}`
   ```

## Automation Tip

For future automation, you can use a build tool or create a simple script to automatically update version numbers based on file modification times.

### PowerShell Script Example (Optional):
```powershell
# Update version to current timestamp
$version = Get-Date -Format "yyyyMMddHHmm"
(Get-Content website/index.html) -replace 'styles.css\?v=[^"]*', "styles.css?v=$version" | Set-Content website/index.html
```

## Important Notes

1. **Always update the version number** when you modify CSS/JS files
2. **Commit both files** (the modified CSS/JS AND the HTML with new version) together
3. **Deploy both files** to your hosting server
4. HTML files are not cached (thanks to meta tags), so the new version numbers will be picked up immediately
5. Users will automatically get the latest files without clearing their cache

## Testing

After updating versions and deploying:
1. Open your website in a browser
2. Open Developer Tools (F12)
3. Go to Network tab
4. Refresh the page (F5)
5. Check that CSS/JS files are loaded with the new version number
6. Verify your changes are visible

## Current Version Status

Last updated: November 10, 2025

| File | Current Version |
|------|----------------|
| website/styles.css | v=1.0 |
| website/script.js | v=1.0 |
| website/supabase-loader.js | v=1.0 |
| admin/admin.css | v=1.0 |
| admin/admin.js | v=1.0 |

---

**Remember:** Increment these version numbers each time you update the corresponding files!
