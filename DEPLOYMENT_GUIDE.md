# Anuranan Deployment Guide

This repository contains two separate applications:
1. **Main Website** - Public-facing recitation institute website
2. **Admin Panel** - Content management interface for gallery and events

## 📁 Project Structure

```
Anuranan/
├── website/           # Main public website
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── supabase-loader.js
│   ├── public/
│   └── package.json
├── admin/            # Admin panel
│   ├── admin.html
│   ├── admin.css
│   ├── admin.js
│   ├── supabase-loader.js
│   ├── public/
│   └── package.json
└── DEPLOYMENT_GUIDE.md
```

## 🚀 Deploying to Render

### Step 1: Push to GitHub

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit: Anuranan website and admin panel"
```

2. Create a new repository on GitHub

3. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Main Website on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `anuranan-website`
   - **Root Directory**: `website`
   - **Branch**: `main`
   - **Build Command**: *(leave empty)*
   - **Publish Directory**: `.`

5. Click **"Create Static Site"**

### Step 3: Deploy Admin Panel on Render

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure the service:
   - **Name**: `anuranan-admin`
   - **Root Directory**: `admin`
   - **Branch**: `main`
   - **Build Command**: *(leave empty)*
   - **Publish Directory**: `.`

4. Click **"Create Static Site"**

### Step 4: Get Your URLs

After deployment completes, you'll receive two URLs:
- **Main Website**: `https://anuranan-website.onrender.com`
- **Admin Panel**: `https://anuranan-admin.onrender.com`

## 🔧 Supabase Configuration

Both applications use Supabase for backend services. Make sure your Supabase project is properly configured:

1. **Storage Buckets**:
   - `gallery-photos` (public)
   - `event-photos` (public)

2. **Database Tables** (if needed):
   - Run the SQL scripts in the root directory

3. **API Keys**:
   - Both `supabase-loader.js` files contain hardcoded Supabase URLs and keys
   - For production, consider using environment variables

## 📝 Important Notes

- **Static Sites**: No cold starts - always instant loading
- **No Sleep**: Static sites don't sleep on Render's free tier
- **Custom Domain**: You can add custom domains in Render settings
- **HTTPS**: Render provides free SSL certificates automatically
- **Auto-Deploy**: Automatic deployment on every git push

## 🔄 Updating Your Site

To update either site:

1. Make changes to your code
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Update description"
git push
```

3. Render will automatically detect the changes and redeploy

## 🛠️ Local Development

### Main Website
```bash
cd website
npm install
npm start
# Visit http://localhost:3000
```

### Admin Panel
```bash
cd admin
npm install
npm start
# Visit http://localhost:3001
```

## 🔐 Security Recommendations

1. **Admin Panel**: Consider adding password protection
2. **Supabase Keys**: Move API keys to environment variables in Render
3. **CORS**: Configure Supabase CORS settings to only allow your domains

## 📞 Support

For issues or questions, refer to:
- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

**Last Updated**: November 8, 2025
