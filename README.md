# Anuranan Recitation Training Institute - Website

A beautiful, culturally-rich website for Anuranan Recitation Training Institute in Kolkata, West Bengal. This website celebrates Bengali culture and promotes recitation, anchoring, and acting classes.

## 🎨 Features

- **Beautiful Yellow & Blue Color Theme**: Reflects the vibrant Bengali cultural heritage
- **Fully Responsive Design**: Looks great on desktop, tablet, and mobile devices
- **Smooth Animations**: Gentle fade-in effects and smooth scrolling for an elegant experience
- **Admin Panel**: Full-featured content management system with Supabase integration
- **Interactive Elements**: 
  - Image gallery with lightbox viewer
  - Contact form with validation
  - Smooth navigation with active link highlighting
  - Scroll-to-top button
  - Mobile-friendly hamburger menu

## 📁 Project Structure

```
Anuranan/
├── index.html           # Main website
├── admin.html           # Admin panel interface
├── setup-guide.html     # Interactive setup guide
├── test-connection.html # Supabase connection tester
├── styles.css           # Main website styles
├── admin.css            # Admin panel styles
├── script.js            # Main website JavaScript
├── admin.js             # Admin panel logic
├── supabase-loader.js   # Loads content from Supabase
├── supabase-setup.sql   # Database setup script
├── ADMIN_SETUP.md       # Detailed admin setup guide
└── README.md            # This file
```

## 🎯 New: Admin Panel Features

### Gallery Management
- ✅ Add new photos with title and description
- ✅ Update existing photos
- ✅ Delete photos
- ✅ Automatic display on main website
- ✅ Image preview before upload

### Events Management
- ✅ Add new events with complete details
- ✅ Update existing events
- ✅ Delete events
- ✅ Organize by date, category, time, and location
- ✅ Automatic display on main website

## 🚀 Getting Started

### Main Website

#### Option 1: Open Directly
Simply double-click `index.html` to open the website in your default browser.

#### Option 2: Use Live Server (Recommended)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Admin Panel Setup

⚠️ **Important**: The admin panel requires Supabase setup before use.

#### Quick Start:
1. Open `setup-guide.html` in your browser for step-by-step instructions
2. Or open `test-connection.html` to verify your Supabase setup
3. Follow the instructions in `ADMIN_SETUP.md` for detailed setup

#### Admin Panel Access:
- URL: `admin.html`
- Default Password: `anuranan2024`
- ⚠️ Change password in `admin.js` for production use

#### Setup Steps Summary:
1. Create Supabase account (if not already done)
2. Create two storage buckets: `gallery-photos` and `event-images`
3. Configure bucket policies (see `supabase-setup.sql`)
4. Access admin panel and start managing content

## � Supabase Configuration

### What is Supabase?
Supabase is an open-source Firebase alternative that provides:
- Cloud storage for images
- Real-time database
- Authentication (optional)
- RESTful API

### Your Supabase Details:
- **URL**: https://ghcsoyispspvjvbkcfoj.supabase.co
- **Project**: ghcsoyispspvjvbkcfoj
- **Buckets Required**:
  - `gallery-photos` (Public)
  - `event-images` (Public)

### Setting Up Supabase:

1. **Create Account**: Visit [supabase.com](https://supabase.com)
2. **Create Buckets**: 
   - Go to Storage in your project dashboard
   - Create `gallery-photos` bucket (Public)
   - Create `event-images` bucket (Public)
3. **Configure Policies**: Run SQL from `supabase-setup.sql`
4. **Test Connection**: Open `test-connection.html`

For detailed instructions, see `ADMIN_SETUP.md`

## �📝 Customization Guide

### 1. Update Contact Information

**In `index.html`, find and replace:**
- `[Your Address Here]` - Line ~670
- `[Your Phone Number]` - Lines ~680, ~965
- `info@anuranan.in` - Lines ~689, ~968
- Social media links - Lines ~703-706, ~958-961

### 2. Update Google Maps

**In `index.html`, line ~763:**
Replace the iframe `src` URL with your institute's exact location:
1. Go to Google Maps
2. Search for your institute address
3. Click "Share" → "Embed a map"
4. Copy the iframe code
5. Replace the existing iframe in the HTML

### 3. Replace Gallery Images

**In `index.html`, lines ~549-595:**
Replace the placeholder image URLs with your own:
- Student performances
- Class sessions
- Cultural events
- Award ceremonies

Current format:
```html
<img src="https://images.unsplash.com/photo-..." alt="Your Description">
```

Change to:
```html
<img src="images/your-photo.jpg" alt="Your Description">
```

**Recommended:** Create an `images` folder in your project and save your photos there.

### 4. Update Events

**In `index.html`, lines ~620-710:**
Modify event dates, titles, descriptions, times, and venues according to your actual schedule.

### 5. Modify Courses

**In `index.html`, lines ~453-543:**
Update course descriptions, features, or add/remove courses as needed.

### 6. Change Colors

**In `styles.css`, lines 5-20:**
Modify the CSS variables to change the color scheme:
```css
:root {
    --primary-yellow: #FDB813;
    --primary-blue: #1B4B8F;
    /* etc. */
}
```

## 🎯 Important Sections to Update

### High Priority:
1. ✅ Contact information (phone, email, address)
2. ✅ Google Maps location
3. ✅ Gallery images
4. ✅ Event dates and details

### Medium Priority:
5. ✅ Course details and pricing (if needed)
6. ✅ About section content
7. ✅ Testimonials (replace with real student feedback)

### Optional:
8. Social media links
9. Class timings
10. Student statistics

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## 🎨 Color Palette

- **Primary Yellow**: #FDB813
- **Primary Blue**: #1B4B8F
- **Dark Blue**: #0F2C54
- **Accent Yellow**: #FFD700
- **Text Dark**: #2C3E50
- **White**: #FFFFFF

## 🔧 Technical Details

### Fonts Used:
- **Primary**: Poppins (Google Fonts)
- **Bengali**: Hind Siliguri (Google Fonts)
- **Serif**: Cormorant Garamond (Google Fonts)

### External Resources:
- Font Awesome Icons (v6.4.0)
- Google Fonts
- Unsplash placeholder images

## 📋 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 🎭 Cultural Elements

The website incorporates Bengali cultural elements:
- Bengali typography (অনুরণন)
- Traditional color scheme (yellow & blue)
- Cultural motifs and patterns
- References to Bengali poets and literature

## 💡 Tips

1. **Image Optimization**: Compress images before uploading to improve load times
2. **Regular Updates**: Keep event information and gallery updated
3. **Mobile Testing**: Always test on actual mobile devices
4. **Backup**: Keep backup copies of your images and content
5. **SEO**: Consider adding meta descriptions and keywords for better search visibility

## 📞 Support

For technical assistance or questions about customization:
- Review the code comments in each file
- Check browser console for any errors
- Test on different devices and browsers

## 📄 License

This website template is created specifically for Anuranan Recitation Training Institute.

## 🎉 Credits

Designed and developed with ❤️ for Bengali culture and arts education.

---

**Last Updated**: November 2025  
**Version**: 1.0  
**Status**: Ready for deployment
