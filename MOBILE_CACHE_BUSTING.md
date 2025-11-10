# Mobile Cache Busting - Quick Guide

## Problem Solved
Mobile browsers were showing old cached versions even after deployment. Now every deployment gets a unique timestamp version, forcing browsers to load fresh files.

## How It Works

### Automatic Cache Busting
All CSS and JS files now have timestamp-based version parameters:
- `styles.css?v=202511102038`
- `script.js?v=202511102038`
- `admin.css?v=202511102038`

The timestamp changes with every deployment, ensuring mobile browsers load the latest version.

## Deployment Options

### Option 1: One-Command Deployment (RECOMMENDED)
```powershell
.\deploy.ps1
```
This automatically:
1. Updates all cache version numbers with a new timestamp
2. Stages all changes in git
3. Commits with a descriptive message
4. Pushes to your repository

### Option 2: Manual Cache Update Only
```powershell
.\update-cache-version.ps1
```
Then commit and push manually:
```powershell
git add .
git commit -m "Update cache version"
git push
```

## What Happens on Mobile

### Before (Old Behavior)
- User visits site
- Browser caches `styles.css?v=1.0`
- You deploy changes
- Browser still uses cached `styles.css?v=1.0`
- User must manually clear cache to see updates ❌

### After (New Behavior)
- User visits site
- Browser caches `styles.css?v=202511102038`
- You deploy changes (version becomes `202511102040`)
- Browser sees different URL and loads fresh `styles.css?v=202511102040`
- User sees updates immediately! ✓

## Deployment Workflow

1. Make your changes to CSS, JS, or HTML files
2. Run `.\deploy.ps1`
3. Wait 1-2 minutes for Render to rebuild
4. Test on mobile - you'll see the latest version immediately!

## Files Automatically Updated

The scripts update cache versions in:
- `website/index.html` (main site CSS & JS)
- `admin/index.html` (admin panel)
- `admin/courses.html` (courses admin)
- Root `index.html` and `admin.html` (if used)

## No More Manual Cache Clearing!

Mobile users will automatically get fresh content on every deployment. The timestamp-based versioning ensures the browser treats each deployment as a completely new file.

## Troubleshooting

### If mobile still shows old content:
1. Check if the deployment actually ran: `.\deploy.ps1`
2. Verify Render completed the build
3. Check the version number in browser DevTools:
   - Right-click > Inspect
   - Go to Network tab
   - Look for `styles.css?v=XXXXXXXXXX`
   - The timestamp should match your latest deployment

### Version format:
`yyyyMMddHHmm` = Year-Month-Day-Hour-Minute
Example: `202511102038` = November 10, 2025 at 20:38

## Scripts Reference

- `deploy.ps1` - Full deployment with cache busting
- `update-cache-version.ps1` - Cache version update only
- `update-version.ps1` - Original (complex) version updater

## Best Practice

Always use `.\deploy.ps1` for deployments. This ensures cache busting is never forgotten!
