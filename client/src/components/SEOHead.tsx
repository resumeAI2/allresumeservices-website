import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string;
}

export default function SEOHead({
  title,
  description,
  image = '/blog/resume-writing.jpg',
  url,
  type = 'article',
  publishedTime,
  modifiedTime,
  author = 'All Resume Services',
  keywords,
}: SEOHeadProps) {
  const siteUrl = window.location.origin;
  const fullUrl = url ? `${siteUrl}${url}` : window.location.href;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  useEffect(() => {
    // Update document title
    document.title = `${title} | All Resume Services`;

    // Helper function to set or update meta tags
    const setMetaTag = (property: string, content: string, isProperty = true) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', description, false);
    if (keywords) {
      setMetaTag('keywords', keywords, false);
    }

    // Open Graph tags
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:image', fullImageUrl);
    setMetaTag('og:url', fullUrl);
    setMetaTag('og:type', type);
    setMetaTag('og:site_name', 'All Resume Services');

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image', false);
    setMetaTag('twitter:title', title, false);
    setMetaTag('twitter:description', description, false);
    setMetaTag('twitter:image', fullImageUrl, false);

    // Article specific tags
    if (type === 'article') {
      if (publishedTime) {
        setMetaTag('article:published_time', publishedTime);
      }
      if (modifiedTime) {
        setMetaTag('article:modified_time', modifiedTime);
      }
      if (author) {
        setMetaTag('article:author', author);
      }
    }

    // JSON-LD Schema markup
    const schemaScript = document.getElementById('schema-org');
    if (schemaScript) {
      schemaScript.remove();
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": description,
      "image": fullImageUrl,
      "url": fullUrl,
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "author": {
        "@type": "Organization",
        "name": author,
        "url": siteUrl
      },
      "publisher": {
        "@type": "Organization",
        "name": "All Resume Services",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": fullUrl
      }
    };

    const script = document.createElement('script');
    script.id = 'schema-org';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      document.title = 'All Resume Services - Professional Resume Writing';
    };
  }, [title, description, image, fullUrl, fullImageUrl, type, publishedTime, modifiedTime, author, keywords, siteUrl]);

  return null;
}
