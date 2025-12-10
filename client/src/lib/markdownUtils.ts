/**
 * Clean HTML tags from markdown content to ensure proper rendering
 * Handles both HTML tables and markdown wrapped in HTML tags
 */
export function cleanMarkdownContent(content: string): string {
  if (!content) return '';
  
  try {
    // First, check if this is markdown wrapped in HTML tags (not actual HTML content)
    // If we see markdown syntax like ##, ###, |table|, etc. inside <p> tags, just strip the HTML
    const hasMarkdownInHTML = /<p>[#*|]/.test(content) || /<p>#{2,6}\s/.test(content);
    
    if (hasMarkdownInHTML) {
      // This is markdown wrapped in HTML - just strip the HTML tags
      let cleaned = content;
      
      // Remove <p> and </p> tags - replace with single newline
      cleaned = cleaned.replace(/<\/p>\s*<p>/g, '\n');
      cleaned = cleaned.replace(/<\/?p>/g, '\n');
      
      // Remove other common HTML tags but keep the content
      cleaned = cleaned.replace(/<\/?div>/g, '\n');
      cleaned = cleaned.replace(/<\/?span>/g, '');
      cleaned = cleaned.replace(/<br\s*\/?>/g, '\n');
      
      // Remove any remaining HTML tags but keep content
      cleaned = cleaned.replace(/<[^>]+>/g, '');
      
      // IMPORTANT: Remove blank lines within markdown tables FIRST
      // This must happen before adding spacing around tables
      cleaned = cleaned.replace(/(\|[^\n]+\|)\n\n+(\|[^\n]+\|)/g, '$1\n$2');
      
      // Ensure headings have blank lines before and after
      cleaned = cleaned.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');
      cleaned = cleaned.replace(/(#{1,6}\s[^\n]+)\n([^\n#])/g, '$1\n\n$2');
      
      // Ensure tables have blank lines before and after the ENTIRE table
      // But NOT between table rows (already fixed above)
      // Use negative lookbehind/lookahead to avoid matching table rows
      cleaned = cleaned.replace(/(^|[^|\n])(\n)(\|[^\n]+\|)/gm, '$1\n\n$3');
      cleaned = cleaned.replace(/(\|[^\n]+\|)(\n)([^|\n]|$)/gm, '$1\n\n$3');
      
      // Clean up excessive newlines (more than 2 consecutive)
      cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
      
      // Trim whitespace from start and end
      cleaned = cleaned.trim();
      
      return cleaned;
    }
    
    // If it's actual HTML content (tables, lists, etc.), use unified to convert
    // This path would handle real HTML tables and convert them to markdown
    // For now, fall back to basic cleaning since most content is markdown-in-HTML
    return basicClean(content);
    
  } catch (error) {
    console.error('Error cleaning markdown content:', error);
    return basicClean(content);
  }
}

/**
 * Basic fallback cleaning function
 */
function basicClean(content: string): string {
  let cleaned = content.replace(/<\/p>\s*<p>/g, '\n');
  cleaned = cleaned.replace(/<\/?p>/g, '\n');
  cleaned = cleaned.replace(/<\/?div>/g, '\n');
  cleaned = cleaned.replace(/<\/?span>/g, '');
  cleaned = cleaned.replace(/<br\s*\/?>/g, '\n');
  cleaned = cleaned.replace(/<[^>]+>/g, ''); // Remove all HTML tags
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
}
