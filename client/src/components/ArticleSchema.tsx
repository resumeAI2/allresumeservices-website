import { useEffect } from 'react';

interface ArticleSchemaProps {
  title: string;
  description: string;
  content?: string;
  image?: string;
  url: string;
  publishedTime: string;
  modifiedTime?: string;
  authorName?: string;
  authorTitle?: string;
  authorImage?: string;
  category?: string;
  tags?: string[];
  wordCount?: number;
  readTime?: string;
}

/**
 * ArticleSchema Component
 * 
 * Generates comprehensive Article schema markup (JSON-LD) for blog posts
 * following Google's structured data guidelines for rich snippets.
 * 
 * Benefits:
 * - Enhanced search result appearance with rich snippets
 * - Author information displayed in search results
 * - Article metadata (publish date, read time) shown
 * - Better click-through rates from search results
 * - Improved SEO ranking signals
 */
export function ArticleSchema({
  title,
  description,
  content,
  image,
  url,
  publishedTime,
  modifiedTime,
  authorName = 'Sonia Lynch',
  authorTitle = 'Founder & CEO, All Résumé Services',
  authorImage = '/team/sonia-lynch.png',
  category,
  tags = [],
  wordCount,
  readTime,
}: ArticleSchemaProps) {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://allresumeservices.com.au';
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const fullImageUrl = image?.startsWith('http') ? image : `${siteUrl}${image || '/og-image.png'}`;
  const authorImageUrl = authorImage?.startsWith('http') ? authorImage : `${siteUrl}${authorImage}`;

  // Calculate word count from content if not provided
  const estimatedWordCount = wordCount || (content ? content.split(/\s+/).length : 1000);
  
  // Parse read time to minutes
  const readTimeMinutes = readTime ? parseInt(readTime) || 5 : Math.ceil(estimatedWordCount / 200);

  useEffect(() => {
    // Remove any existing article schema
    const existingSchema = document.getElementById('article-schema-org');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Comprehensive Article schema following Google's guidelines
    // https://developers.google.com/search/docs/appearance/structured-data/article
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${fullUrl}#article`,
      
      // Core article properties
      "headline": title.length > 110 ? title.substring(0, 107) + '...' : title,
      "name": title,
      "description": description,
      "articleBody": content ? content.substring(0, 5000) : undefined, // First 5000 chars
      
      // URLs and identifiers
      "url": fullUrl,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": fullUrl
      },
      
      // Images - Google recommends multiple sizes
      "image": {
        "@type": "ImageObject",
        "url": fullImageUrl,
        "width": 1200,
        "height": 630
      },
      "thumbnailUrl": fullImageUrl,
      
      // Dates
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "dateCreated": publishedTime,
      
      // Author information - Person type for better rich snippets
      "author": {
        "@type": "Person",
        "@id": `${siteUrl}/#author`,
        "name": authorName,
        "jobTitle": authorTitle,
        "image": {
          "@type": "ImageObject",
          "url": authorImageUrl,
          "width": 200,
          "height": 200
        },
        "url": `${siteUrl}/about-us`,
        "sameAs": [
          "https://www.linkedin.com/company/all-resume-services/",
          "https://www.facebook.com/allresumeservices",
          "https://www.instagram.com/allresumeservices/"
        ],
        "worksFor": {
          "@type": "Organization",
          "name": "All Résumé Services",
          "url": siteUrl
        }
      },
      
      // Publisher information
      "publisher": {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "All Résumé Services",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo-v2.svg`,
          "width": 200,
          "height": 60
        },
        "sameAs": [
          "https://www.linkedin.com/company/all-resume-services/",
          "https://www.facebook.com/allresumeservices",
          "https://www.youtube.com/@AllResumeServices",
          "https://www.instagram.com/allresumeservices/"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+61-410-934-371",
          "contactType": "customer service",
          "email": "enquiries@allresumeservices.com",
          "areaServed": "AU",
          "availableLanguage": "English"
        }
      },
      
      // Article metadata
      "wordCount": estimatedWordCount,
      "timeRequired": `PT${readTimeMinutes}M`,
      "inLanguage": "en-AU",
      
      // Category and keywords
      "articleSection": category || "Career Advice",
      "keywords": tags.length > 0 ? tags.join(', ') : `${category}, resume writing, career advice, job search, Australia`,
      
      // Accessibility
      "accessMode": ["textual", "visual"],
      "accessibilityFeature": ["readingOrder", "structuralNavigation"],
      
      // Content indicators
      "isAccessibleForFree": true,
      "creativeWorkStatus": "Published",
      
      // Breadcrumb reference
      "isPartOf": {
        "@type": "Blog",
        "@id": `${siteUrl}/blog#blog`,
        "name": "All Résumé Services Career Advice Blog",
        "url": `${siteUrl}/blog`,
        "description": "Expert career advice, resume writing tips, and job search strategies from Australia's leading resume writing service."
      }
    };

    // Create and inject the schema script
    const script = document.createElement('script');
    script.id = 'article-schema-org';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(articleSchema, null, 0);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const schemaScript = document.getElementById('article-schema-org');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [
    title, 
    description, 
    content, 
    fullUrl, 
    fullImageUrl, 
    publishedTime, 
    modifiedTime, 
    authorName, 
    authorTitle, 
    authorImageUrl, 
    category, 
    tags, 
    estimatedWordCount, 
    readTimeMinutes, 
    siteUrl
  ]);

  return null;
}

/**
 * BreadcrumbSchema Component
 * 
 * Generates BreadcrumbList schema for blog posts
 * Helps Google understand site structure and display breadcrumbs in search results
 */
export function BreadcrumbSchema({ 
  items 
}: { 
  items: Array<{ name: string; url?: string }> 
}) {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://allresumeservices.com.au';

  useEffect(() => {
    const existingSchema = document.getElementById('breadcrumb-schema-org');
    if (existingSchema) {
      existingSchema.remove();
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        },
        ...items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 2,
          "name": item.name,
          "item": item.url ? `${siteUrl}${item.url}` : undefined
        }))
      ]
    };

    const script = document.createElement('script');
    script.id = 'breadcrumb-schema-org';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);

    return () => {
      const schemaScript = document.getElementById('breadcrumb-schema-org');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [items, siteUrl]);

  return null;
}

export default ArticleSchema;
