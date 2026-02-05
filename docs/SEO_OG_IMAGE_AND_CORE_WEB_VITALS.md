# Open Graph Image & Core Web Vitals

## Open Graph (OG) Image

### Current setup
- **File:** `client/public/og-image.png`
- **Used in:** `client/index.html` (og:image, twitter:image), `SEOHead.tsx` (default `/og-image.png`)

### Recommended specs (for best SEO and social sharing)
- **Dimensions:** 1200 × 630 px
- **Aspect ratio:** 1.91:1
- **Format:** PNG or JPG
- **Max file size:** Under 1 MB (ideally under 300 KB)
- **Content:** Logo + tagline or key message; avoid important text near edges (cropping varies by platform)

### If you need to fix or replace the image
1. Replace `client/public/og-image.png` with your new asset (or add `og-image.jpg` and update references).
2. Keep filename as `og-image.png` (or update both `index.html` and `SEOHead.tsx` if you use a different name).
3. Re-test with:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

---

## Core Web Vitals

### What to monitor
- **LCP (Largest Contentful Paint):** Main content should paint within ~2.5s.
- **FID / INP (Interaction to Next Paint):** Clicks should feel responsive (~100ms or less).
- **CLS (Cumulative Layout Shift):** Layout should be stable (CLS &lt; 0.1).

### How to check
1. **Google Search Console** → Experience → Core Web Vitals (for real-user data).
2. **PageSpeed Insights:** https://pagespeed.web.dev/ (run against production URL).
3. **Chrome DevTools** → Lighthouse → Performance (and optionally “Core Web Vitals” in the report).

### Optional: reporting in your app
- Use the [web-vitals](https://www.npmjs.com/package/web-vitals) library and send LCP, FID/INP, and CLS to your analytics (e.g. Google Analytics 4 or custom endpoint).
- Or rely on Search Console + periodic PageSpeed runs.

### Quick wins already in place
- Lazy loading on images where appropriate.
- `fetchPriority="high"` on critical hero images.
- Responsive images and optimisation (e.g. Sharp) on the server.

---

**Last updated:** February 2026
