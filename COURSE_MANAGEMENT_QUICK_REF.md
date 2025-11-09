# 📝 Course Management - Quick Reference Card

## 🎯 Admin Access
**URL**: `admin/courses.html`  
**Login**: Required (redirects if not authenticated)

---

## ➕ Add New Course

### Required Fields
```
Title:           Bengali Recitation
Icon:            fas fa-book-open
Description:     [2-3 sentences about the course]
Features:        [At least 1 feature]
Button Text:     Enroll Now
Display Order:   10
Active:          ☑ Checked
```

### Optional Fields
```
Badge:           Popular
Badge Type:      popular (Yellow) / new (Green) / discount (Red)
Is Featured:     ☐ For special courses only
Featured Text:   Special Offer
```

---

## ✏️ Edit Course

1. Click **Edit** button on course
2. Form auto-fills with data
3. Make changes
4. Click **Update Course**

---

## 👁️ Show/Hide Course

Click **Hide** or **Show** button
- **Active** → Visible on website
- **Inactive** → Hidden from public (still in database)

---

## 🗑️ Delete Course

1. Click **Delete** button
2. Confirm action
3. Permanently removed

---

## 🎨 Font Awesome Icons

### Popular Course Icons
| Icon Class | Displays |
|------------|----------|
| `fas fa-book-open` | 📖 Open book |
| `fas fa-language` | 🗣️ Language/speech |
| `fas fa-scroll` | 📜 Scroll |
| `fas fa-microphone-alt` | 🎤 Microphone |
| `fas fa-theater-masks` | 🎭 Drama masks |
| `fas fa-gift` | 🎁 Gift box |
| `fas fa-music` | 🎵 Music note |
| `fas fa-pen-fancy` | ✒️ Pen |
| `fas fa-graduation-cap` | 🎓 Graduation |
| `fas fa-star` | ⭐ Star |

Browse more: https://fontawesome.com/icons

---

## 🏷️ Badge Types

### Popular Badge
```
Badge Text:  Popular
Badge Type:  popular
Color:       Yellow with blue text
Use for:     Most enrolled courses
```

### New Badge
```
Badge Text:  New
Badge Type:  new
Color:       Green with white text
Use for:     Recently added courses
```

### Discount Badge
```
Badge Text:  Save 30%
Badge Type:  discount
Color:       Red with white text
Use for:     Special offers
```

---

## ⭐ Featured Courses

### When to Use
- Special combo packages
- Limited time offers
- Premium courses
- Seasonal promotions

### What's Different
- Crown icon badge
- Special background
- Enhanced button
- Stands out visually

### Settings
```
Is Featured:     ☑ Checked
Featured Text:   Special Offer
```

---

## 🔢 Display Order

### How It Works
- Lower numbers appear **first**
- Higher numbers appear **last**

### Best Practice
Use increments of 10:
```
10 → First course
20 → Second course
30 → Third course
40 → Fourth course
```

### Why Increments?
Easy to insert courses between:
```
10 → Bengali Recitation
15 → NEW COURSE (inserted between 10 and 20)
20 → English Recitation
```

---

## ✅ Course Features

### Adding Features
1. Type feature in text box
2. Click **+ Add Feature** for more
3. Minimum: 1 feature
4. Recommended: 4-5 features

### Removing Features
- Click trash icon next to feature
- Must keep at least 1 feature

### Feature Writing Tips
```
✅ GOOD:
   - Classical & Modern Poetry
   - Voice Modulation Techniques
   - Stage Presence Training

❌ AVOID:
   - learn poetry (not capitalized)
   - We teach you everything (too vague)
   - Feature 1, Feature 2 (meaningless)
```

---

## 📱 Course Card Preview

### Standard Course
```
┌─────────────────────────┐
│      [📖 Icon]         │
│                         │
│   Course Title          │
│   [Popular Badge]       │
│                         │
│   Description text...   │
│                         │
│   ✓ Feature 1          │
│   ✓ Feature 2          │
│   ✓ Feature 3          │
│   ✓ Feature 4          │
│                         │
│   [Enroll Now Button]  │
└─────────────────────────┘
```

### Featured Course
```
┌─────────────────────────┐
│ 👑 Special Offer        │
│      [🎁 Icon]         │
│                         │
│   Combo Package         │
│   [Save 30% Badge]      │
│                         │
│   Description text...   │
│                         │
│   ✓ Feature 1          │
│   ✓ Feature 2          │
│   ✓ Feature 3          │
│   ✓ Feature 4          │
│                         │
│ [Special Offer Button] │
└─────────────────────────┘
```

---

## 🎯 Common Tasks

### Create Standard Course
1. Enter title
2. Choose icon (`fas fa-book-open`)
3. Write description
4. Add 4-5 features
5. Set display order
6. Save

### Create Popular Course
1. Follow standard steps
2. Badge Text: `Popular`
3. Badge Type: `popular`
4. Save

### Create Featured Course
1. Follow standard steps
2. Check ☑ Is Featured
3. Featured Text: `Special Offer`
4. Badge Text: `Save 30%`
5. Badge Type: `discount`
6. Save

### Temporarily Hide Course
1. Find course in list
2. Click **Hide** button
3. Verify status shows "Inactive"

### Change Course Order
1. Click **Edit** on course
2. Change Display Order number
3. Click **Update Course**
4. Courses re-sort automatically

---

## ⚠️ Important Notes

### Do's ✅
- ✅ Test changes on website
- ✅ Use descriptive titles
- ✅ Write engaging descriptions
- ✅ Keep 4-5 features per course
- ✅ Use badges sparingly
- ✅ Preview icon before saving
- ✅ Hide instead of delete (when possible)

### Don'ts ❌
- ❌ Leave required fields empty
- ❌ Use same display order for multiple courses
- ❌ Forget to check "Active" checkbox
- ❌ Use too many featured courses
- ❌ Write very long descriptions
- ❌ Delete without confirming
- ❌ Use incorrect icon format

---

## 🔄 Workflow Example

### Adding "French Recitation" Course

**Step 1: Basic Info**
```
Title:           French Recitation
Icon:            fas fa-language
Display Order:   35 (between English and Hindi)
```

**Step 2: Description**
```
Master French poetry and literature through 
expert-guided recitation. Build confidence 
in French pronunciation and expression.
```

**Step 3: Features**
```
✓ French Poetry & Prose
✓ Accent Training
✓ Cultural Context
✓ Performance Practice
```

**Step 4: Settings**
```
Badge:           New
Badge Type:      new
Button Text:     Enroll Now
Active:          ☑ Checked
Is Featured:     ☐ Unchecked
```

**Step 5: Save**
- Click "Save Course"
- Check website to verify
- Adjust order if needed

---

## 📊 Status Indicators

### Active Course
```
🟢 Active
- Visible on website
- Public can enroll
- Appears in course list
```

### Inactive Course
```
🟡 Inactive
- Hidden from public
- Still in database
- Admins can edit
- Can reactivate anytime
```

### Featured Course
```
⭐ Featured
- Special styling
- Highlighted position
- Crown badge
- Enhanced visibility
```

---

## 🆘 Quick Fixes

### Problem: Icon not showing
**Fix**: Use format `fas fa-icon-name`

### Problem: Course not on website
**Fix**: Check ☑ Active checkbox

### Problem: Wrong badge color
**Fix**: Verify badge_type matches badge text

### Problem: Course in wrong position
**Fix**: Edit and change display_order number

### Problem: Can't delete feature
**Fix**: Must have at least 1 feature

---

## 💾 Save Your Work

### Auto-save: NO
Changes are saved only when you:
- Click **Save Course** (new)
- Click **Update Course** (edit)

### Before Closing
- Ensure you clicked Save/Update
- Check confirmation message
- Verify changes on website

---

## 🎓 Training Checklist

**New Admin Training** ✅
- [ ] Can login to admin panel
- [ ] Can navigate to Course Management
- [ ] Can add a new course
- [ ] Can edit existing course
- [ ] Can add/remove features
- [ ] Can preview icons
- [ ] Can toggle visibility
- [ ] Can reorder courses
- [ ] Can delete courses
- [ ] Understands badge types
- [ ] Can create featured courses
- [ ] Verifies changes on website

---

## 📞 Need Help?

**Documentation**
- Full Guide: `COURSE_MANAGEMENT_GUIDE.md`
- Summary: `COURSE_MANAGEMENT_SUMMARY.md`

**Quick Help**
- Check icon preview before saving
- Use badge preview in course list
- Test changes immediately on website
- Keep this reference card handy

---

**Print this card for quick reference at your desk!** 📋

---

**Version**: 1.0  
**Last Updated**: November 2025  
**For**: Anuranan Admin Users
