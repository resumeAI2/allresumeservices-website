/**
 * Clean HTML tags from markdown content to ensure proper rendering
 * Converts HTML-wrapped markdown to clean markdown format
 */
export function cleanMarkdownContent(content: string): string {
  if (!content) return '';
  
  // Remove <p> and </p> tags
  let cleaned = content.replace(/<\/?p>/g, '\n\n');
  
  // Remove other common HTML tags but keep the content
  cleaned = cleaned.replace(/<\/?div>/g, '\n');
  cleaned = cleaned.replace(/<\/?span>/g, '');
  cleaned = cleaned.replace(/<br\s*\/?>/g, '\n');
  
  // Clean up excessive newlines (more than 2 consecutive)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Trim whitespace from start and end
  cleaned = cleaned.trim();
  
  return cleaned;
}
