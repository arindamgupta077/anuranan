# 🚀 Copy-Paste Commands for Deployment

## Step 1: Create GitHub Repository First!

1. Go to: https://github.com/new
2. Create a new repository (name it anything you want, e.g., "anuranan")
3. **DO NOT** check any boxes (no README, no .gitignore, no license)
4. Click "Create repository"
5. **COPY THE REPOSITORY URL** from the page (looks like: `https://github.com/YOUR-USERNAME/YOUR-REPO.git`)

## Step 2: Push to GitHub

**Replace `YOUR-REPO-URL` with the URL you copied above**, then run these commands:

```powershell
cd C:\VSCODE\Anuranan

git remote add origin YOUR-REPO-URL

git branch -M main

git push -u origin main
```

### Example (replace with YOUR actual URL):
```powershell
cd C:\VSCODE\Anuranan
git remote add origin https://github.com/yourname/anuranan.git
git branch -M main
git push -u origin main
```

## Step 3: Render Deployment Settings

After pushing to GitHub, deploy on Render with these EXACT settings:

### 🌐 For Main Website:

| Setting | Value |
|---------|-------|
| Name | `anuranan-website` |
| Root Directory | `website` |
| Environment | `Node` |
| Branch | `main` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Plan | `Free` |

### ⚙️ For Admin Panel:

| Setting | Value |
|---------|-------|
| Name | `anuranan-admin` |
| Root Directory | `admin` |
| Environment | `Node` |
| Branch | `main` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Plan | `Free` |

## ✅ That's It!

After following these steps, you'll have:
- ✅ Code on GitHub
- ✅ Main website live on Render
- ✅ Admin panel live on Render
- ✅ Both sites auto-deploy on every git push

## 🔄 Future Updates

Whenever you want to update your site:

```powershell
cd C:\VSCODE\Anuranan

# Make your changes to files in website/ or admin/ folders

git add .
git commit -m "Your update description"
git push
```

Render will automatically redeploy in 2-3 minutes!

---

**Need more details?** See QUICK_DEPLOY.md or DEPLOYMENT_GUIDE.md
