# SEO Implementation Notes

## Quick Reference for Adding Canonical URLs

### For Pages Using `Helmet` (react-helmet-async)

Add canonical URL like this:

```tsx
<Helmet>
  <title>Page Title | All Resume Services</title>
  <meta name="description" content="Page description" />
  <link rel="canonical" href="https://allresumeservices.com.au/page-url" />
</Helmet>
```

### For Pages Using `SEOHead` Component

The `SEOHead` component now automatically adds canonical URLs. Just pass the `url` prop:

```tsx
<SEOHead
  title="Page Title"
  description="Page description"
  url="/page-url"  // This will create canonical URL
/>
```

## Pages Currently Using Helmet

These pages should have canonical URLs added manually:

- `client/src/pages/Services.tsx`
- `client/src/pages/AboutUs.tsx`
- `client/src/pages/Pricing.tsx` (already has Helmet)
- `client/src/pages/BlogPost.tsx`
- Industry pages (`Healthcare.tsx`, `ITTechnology.tsx`, etc.)

## Example Implementation

```tsx
import { Helmet } from "react-helmet-async";

export default function MyPage() {
  const siteUrl = "https://allresumeservices.com.au";
  const pageUrl = "/my-page";
  
  return (
    <>
      <Helmet>
        <title>My Page | All Resume Services</title>
        <meta name="description" content="Page description" />
        <link rel="canonical" href={`${siteUrl}${pageUrl}`} />
      </Helmet>
      {/* Rest of page */}
    </>
  );
}
```

## Priority

**High Priority:** Add canonical URLs to main pages:
- Homepage (already has via index.html)
- Services
- Pricing
- About Us
- Blog listing
- Case Studies

**Medium Priority:** Add to industry pages and blog posts

**Low Priority:** Add to admin pages (not indexed anyway)

---

**Note:** The `SEOHead` component has been updated to automatically handle canonical URLs. Consider migrating pages from `Helmet` to `SEOHead` for consistency.
