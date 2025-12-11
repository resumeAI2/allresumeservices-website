# How to Add Featured Images to Blog Posts

## Overview

Featured images make your blog posts more visually appealing and engaging. They appear on the blog listing page and at the top of individual blog posts. This guide shows you how to add featured images through the admin interface.

---

## Method 1: Upload a New Image

**Step 1:** Navigate to Blog Management
- Go to `/admin/blog` in your browser
- Click the **"Edit"** button next to the blog post you want to update

**Step 2:** Locate the Featured Image Section
- Scroll down to the **"Featured Image"** section in the editor
- You'll see three options: URL field, "Choose from Library", and "Upload"

**Step 3:** Upload Your Image
- Click the **"Upload"** button
- Select an image file from your computer (recommended: JPG or PNG, max 2MB)
- The image will be automatically uploaded to S3 storage
- The image URL will populate in the field

**Step 4:** Add Alt Text (Important for SEO!)
- In the "Alt text" field below, enter a descriptive alt text
- Example: "Professional resume writer helping client with career documents"
- Keep it natural and descriptive (helps with SEO and accessibility)

**Step 5:** Save Your Changes
- Scroll to the bottom and click **"Update Post"**
- Your featured image will now appear on the blog listing and post pages

---

## Method 2: Choose from Media Library

**Step 1:** Access the Blog Editor
- Go to `/admin/blog` and click **"Edit"** on your desired post

**Step 2:** Open Media Library
- In the "Featured Image" section, click **"Choose from Library"**
- Browse previously uploaded images
- Click on an image to select it

**Step 3:** Add Alt Text
- Enter descriptive alt text in the field below
- Example: "Australian job seeker reviewing professional resume"

**Step 4:** Save
- Click **"Update Post"** at the bottom

---

## Method 3: Use an External Image URL

**Step 1:** Find Your Image URL
- If you have an image hosted elsewhere (e.g., stock photo site, your own server)
- Copy the direct image URL (must end in .jpg, .png, .webp, etc.)

**Step 2:** Paste URL
- In the blog editor, paste the URL into the "Featured Image" field
- The image will be loaded from the external URL

**Step 3:** Add Alt Text and Save
- Add descriptive alt text
- Click **"Update Post"**

---

## Best Practices for Featured Images

### Image Specifications
- **Recommended size:** 1200 x 630 pixels (optimal for social sharing)
- **Aspect ratio:** 16:9 or 1.91:1
- **File format:** JPG or PNG
- **File size:** Under 500KB (compressed for fast loading)
- **Quality:** High resolution but optimized for web

### Content Guidelines
- **Relevant:** Image should relate to the blog post topic
- **Professional:** Use high-quality, professional-looking images
- **Avoid text-heavy images:** Keep text minimal or none
- **Brand consistency:** Use images that align with your résumé services brand
- **Diversity:** Show diverse professionals and workplace scenarios

### Alt Text Best Practices
- **Be descriptive:** Describe what's in the image naturally
- **Include keywords:** Mention relevant keywords (e.g., "resume", "career", "job search")
- **Keep it concise:** 125 characters or less
- **Don't stuff keywords:** Write naturally for humans, not just search engines
- **Example good alt text:** "Professional career advisor reviewing client's resume at desk"
- **Example bad alt text:** "resume resume writing services career job"

---

## Where to Find Free Professional Images

### Recommended Stock Photo Sites (Free)
1. **Unsplash** (https://unsplash.com)
   - Search: "office professional", "resume", "career", "job interview"
   - High-quality, free for commercial use

2. **Pexels** (https://www.pexels.com)
   - Search: "business meeting", "professional woman", "office work"
   - Free, no attribution required

3. **Pixabay** (https://pixabay.com)
   - Search: "career success", "job application", "professional"
   - Free for commercial use

### Search Keywords for Résumé Services
- "professional resume writing"
- "career counseling"
- "job interview preparation"
- "office professional"
- "business meeting"
- "career success"
- "job search"
- "professional development"
- "Australian workplace" (for local relevance)

---

## Checking Your Featured Images

### On the Blog Listing Page
1. Go to `/blog` on your website
2. Featured images appear as cards above each blog post title
3. Verify the image displays correctly and looks professional

### On Individual Blog Posts
1. Click "Read More" on any blog post
2. The featured image should appear at the top of the post (if implemented)
3. Check that the image loads quickly and looks good on mobile devices

---

## Troubleshooting

### Image Not Displaying
- **Check the URL:** Make sure the image URL is valid and accessible
- **File format:** Ensure the image is JPG, PNG, or WebP
- **External URLs:** Some external URLs may be blocked by CORS policies
- **Solution:** Upload the image directly instead of using external URLs

### Image Too Large/Slow Loading
- **Compress the image:** Use tools like TinyPNG (https://tinypng.com)
- **Resize:** Use image editing software to resize to 1200 x 630 pixels
- **Convert format:** JPG is usually smaller than PNG for photos

### Image Looks Blurry
- **Use higher resolution:** Minimum 1200 pixels wide
- **Avoid over-compression:** Balance file size with quality
- **Check source:** Download original high-res version from stock photo site

---

## Quick Reference

| Action | Steps |
|--------|-------|
| Upload new image | Edit post → Featured Image → Upload → Choose file → Add alt text → Update Post |
| Choose from library | Edit post → Featured Image → Choose from Library → Select image → Add alt text → Update Post |
| Use external URL | Edit post → Featured Image → Paste URL → Add alt text → Update Post |
| Update alt text | Edit post → Scroll to Featured Image → Update alt text field → Update Post |

---

## Need Help?

If you encounter any issues adding featured images:
1. Check that you're logged in as an admin
2. Verify your internet connection
3. Try refreshing the page
4. Clear your browser cache
5. Try a different browser

For technical support, contact your web developer or submit a request at https://help.manus.im

---

**Last Updated:** December 11, 2025
