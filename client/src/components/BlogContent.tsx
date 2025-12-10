import { useMemo } from 'react';
import './BlogContent.css';

type BlogContentProps = {
  content: string;
};

/**
 * BlogContent component for rendering HTML blog post content
 * with proper formatting, spacing, and styling
 */
export default function BlogContent({ content }: BlogContentProps) {
  // Clean and process the HTML content
  const processedContent = useMemo(() => {
    if (!content) return '';
    
    // The content is already formatted HTML from the database
    // Just ensure it's properly structured
    return content;
  }, [content]);

  return (
    <div 
      className="blog-content-html"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
