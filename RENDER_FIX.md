# 🔧 Render Static Site Deployment Guide

## How to Deploy as Static Sites

### For Website:

1. Go to Render Dashboard → **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Fill in these settings:

```
Name: anuranan-website
Root Directory: website
Branch: main
Build Command: (leave empty)
Publish Directory: .
```

4. Click **"Create Static Site"**

### For Admin Panel:

1. Go to Render Dashboard → **"New +"** → **"Static Site"**
2. Select the same repository
3. Fill in these settings:

```
Name: anuranan-admin
Root Directory: admin
Branch: main
Build Command: (leave empty)
Publish Directory: .
```

4. Click **"Create Static Site"**

## ✅ What This Does

Render will:
- Serve your HTML, CSS, and JavaScript files directly
- Automatically enable HTTPS
- Auto-deploy when you push to GitHub
- Host your site for free

## 🎯 Important Notes

- **No build step needed** - Your files are already ready to serve
- **Root Directory** tells Render which folder to deploy
- **Publish Directory** `.` means "use everything in the root directory folder"
- Your Supabase connections will work normally (already configured in JavaScript)

## 🌐 Your URLs

After deployment:
- **Website**: `https://anuranan-website.onrender.com`
- **Admin**: `https://anuranan-admin.onrender.com`

## 🔄 Updates

Any time you push to GitHub, Render will automatically redeploy both sites.

---

**Updated**: November 8, 2025
