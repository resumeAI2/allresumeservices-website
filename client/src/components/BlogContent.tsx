import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import './BlogContent.css';

type BlogContentProps = {
  content: string;
};

/**
 * BlogContent component for rendering HTML blog post content
 * with proper formatting, spacing, styling, and XSS protection
 */
export default function BlogContent({ content }: BlogContentProps) {
  // Sanitize and process the HTML content to prevent XSS attacks
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    
    // Sanitize HTML to prevent XSS while allowing safe formatting tags
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        // Headings
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        // Text formatting
        'p', 'br', 'hr', 'strong', 'em', 'u', 's', 'code', 'pre',
        // Lists
        'ul', 'ol', 'li',
        // Links and media
        'a', 'img',
        // Quotes
        'blockquote',
        // Tables
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption',
        // Containers
        'div', 'span', 'section', 'article',
      ],
      ALLOWED_ATTR: [
        // Link attributes
        'href', 'target', 'rel',
        // Image attributes
        'src', 'alt', 'title', 'width', 'height',
        // Styling attributes
        'class', 'id',
        // Table attributes
        'colspan', 'rowspan',
      ],
      ALLOW_DATA_ATTR: false, // Prevent data-* attributes
      ALLOW_UNKNOWN_PROTOCOLS: false, // Only allow http, https, mailto, etc.
    });
  }, [content]);

  return (
    <div 
      className="blog-content-html"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
