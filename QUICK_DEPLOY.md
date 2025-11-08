# 🚀 Quick Deployment Steps

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `anuranan` (or your preferred name)
3. Description: "Anuranan Recitation Training Institute - Website & Admin Panel"
4. Choose: **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

## Step 2: Push Your Code to GitHub

Copy your repository URL from GitHub (looks like: `https://github.com/YOUR-USERNAME/anuranan.git`)

Run these commands in PowerShell:

```powershell
cd C:\VSCODE\Anuranan
git remote add origin https://github.com/YOUR-USERNAME/anuranan.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy Main Website on Render

1. Go to https://dashboard.render.com/
2. Sign in with GitHub (if first time)
3. Click **"New +"** → **"Static Site"**
4. Click **"Connect account"** → Select your GitHub repository
5. Fill in the form:

```
Name: anuranan-website
Root Directory: website
Branch: main
Build Command: (leave empty)
Publish Directory: .
```

6. Click **"Create Static Site"**
7. Wait 1-2 minutes for deployment
8. **Copy the URL** (e.g., `https://anuranan-website.onrender.com`)

## Step 4: Deploy Admin Panel on Render

1. Still in Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Select **same repository**
4. Fill in the form:

```
Name: anuranan-admin
Root Directory: admin
Branch: main
Build Command: (leave empty)
Publish Directory: .
```

5. Click **"Create Static Site"**
6. Wait 1-2 minutes for deployment
7. **Copy the URL** (e.g., `https://anuranan-admin.onrender.com`)

## ✅ You're Done!

You now have:
- 🌐 **Main Website**: `https://anuranan-website.onrender.com`
- ⚙️ **Admin Panel**: `https://anuranan-admin.onrender.com`

## 📝 Important Notes

- **First Load**: Instant (static sites don't sleep)
- **Auto-Deploy**: Any push to GitHub automatically updates both sites
- **No Sleep Mode**: Static sites are always active on Render
- **HTTPS**: Included automatically for free

## 🔄 To Update Your Website

```powershell
# Make your changes to files in website/ or admin/ folders
git add .
git commit -m "Your update message"
git push
# Render will auto-deploy in 2-3 minutes
```

## 🆘 Troubleshooting

**If deployment fails:**
1. Check Render logs (click on your service → "Logs" tab)
2. Verify `package.json` exists in both `website/` and `admin/` folders
3. Make sure `Root Directory` is set correctly

**If website shows blank page:**
1. Check browser console for errors (F12)
2. Verify Supabase URLs and keys are correct
3. Check Render logs for runtime errors

---

Need help? Check the full DEPLOYMENT_GUIDE.md
