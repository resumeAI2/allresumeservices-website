# Structured Data Validation Checklist

Use this checklist when adding or changing structured data (JSON-LD) on the site.

## Before Going Live

- [ ] **JSON-LD is valid**  
  - No trailing commas, valid property types (e.g. numbers as numbers, dates in ISO 8601).
  - Run output through https://validator.schema.org/ (paste JSON or URL).

- [ ] **Required properties per type**  
  - **Organization / LocalBusiness:** name, url; optional: logo, address, contactPoint.
  - **Product / Offer:** name, offers with price, priceCurrency; optional: availability, url.
  - **Article / BlogPosting:** headline, datePublished, author, publisher (with logo).
  - **FAQPage:** mainEntity array of Question with acceptedAnswer (Answer with text).

- [ ] **IDs and references**  
  - Use `@id` for entities that are referenced elsewhere (e.g. `#organization`).
  - Refer to them with `"@id": "https://yoursite.com/#organization"` (or relative `#organization` where valid).

- [ ] **URLs**  
  - All URLs in schema are absolute (e.g. `https://allresumeservices.com.au/...`).
  - Image URLs resolve and are HTTPS.

- [ ] **No conflicting or duplicate types**  
  - Same entity (e.g. organization) should not be output twice with different types on the same page unless intentional (e.g. Organization + LocalBusiness with same @id).

## After Deployment

- [ ] **Google Rich Results Test**  
  - https://search.google.com/test/rich-results  
  - Enter live page URL.  
  - Confirm “Valid” for the types you expect (e.g. Organization, Product, FAQ, Article).

- [ ] **Google Search Console**  
  - After a few days, check Enhancements for structured data.  
  - Fix any reported errors or warnings.

- [ ] **Manual spot-check**  
  - View page source, find `<script type="application/ld+json">`, copy JSON into validator.schema.org.

## When Changing Prices or Services

- [ ] Update **PricingSchema** (`client/src/components/PricingSchema.tsx`) with new prices and service names.
- [ ] Update **StructuredData** (`client/src/components/StructuredData.tsx`) price range and any offer lists.
- [ ] Re-run Rich Results Test on `/pricing` (and homepage if it includes offers).

## Files That Output Structured Data

| File | Output |
|------|--------|
| `client/src/components/PricingSchema.tsx` | Organization + Product/Service offers (pricing page) |
| `client/src/components/StructuredData.tsx` | ProfessionalService, hasOfferCatalog (homepage) |
| `client/src/components/OrganizationSchema.tsx` | Organization/ProfessionalService (homepage) |
| `client/src/components/SchemaMarkup.tsx` | LocalBusiness + Organization |
| `client/src/components/FAQSchema.tsx` | FAQPage |
| `client/src/components/ArticleSchema.tsx` | Article (blog posts) |
| `client/src/components/Breadcrumb.tsx` | BreadcrumbList |
| `client/src/components/SEOHead.tsx` | BlogPosting (when used with article type) |

---

**Last updated:** February 2026
