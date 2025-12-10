import { getDb } from './server/db.ts';
import { blog_posts } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

/**
 * Apply blog formatting rules to HTML blog posts
 * - Make headings bold with proper HTML tags
 * - Add proper spacing (blank lines) around headings and paragraphs
 * - No content changes
 */

function formatHTMLBlogContent(content) {
  if (!content) return content;
  
  let formatted = content;
  
  // Step 1: Split by semicolons (appears to be the separator in the database)
  const segments = formatted.split(';').map(s => s.trim()).filter(s => s);
  
  const formattedSegments = [];
  
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    
    // Skip empty segments
    if (!segment || segment === '**<p>‍</p>**') {
      continue;
    }
    
    // Check if this segment is a heading wrapped in <p> tags
    // Pattern: **<p>###### Heading Text</p>** or <p>Heading Text</p> where text looks like heading
    const headingMatch = segment.match(/^\*\*<p>(#{1,6})\s*(.+?)<\/p>\*\*$/);
    if (headingMatch) {
      const [, hashes, headingText] = headingMatch;
      const level = hashes.length;
      // Convert to proper HTML heading with bold
      formattedSegments.push(`<h${level}><strong>${headingText.trim()}</strong></h${level}>`);
      continue;
    }
    
    // Check if segment looks like a heading but isn't properly formatted
    // Short text, capitalized, possibly ends with colon
    const plainTextMatch = segment.match(/^<p>(.+?)<\/p>$/);
    if (plainTextMatch) {
      const text = plainTextMatch[1].trim();
      
      // Check if this looks like a heading
      const isLikelyHeading = (
        text.length < 100 &&
        text.length > 5 &&
        text[0] === text[0].toUpperCase() &&
        !text.match(/^[A-Z]{2,}/) && // Not all caps
        (
          text.endsWith(':') ||
          text.endsWith('?') ||
          !text.match(/[.!]$/)
        ) &&
        !text.match(/^(The|A|An|In|On|At|To|For|With|By|From|Take|Why|Now)\s/i) &&
        !text.match(/resume|Resume|job|Job|application|Application/) // Likely part of paragraph
      );
      
      if (isLikelyHeading) {
        const headingText = text.replace(/:$/, '');
        formattedSegments.push(`<h3><strong>${headingText}</strong></h3>`);
        continue;
      }
    }
    
    // Regular paragraph - keep as is
    formattedSegments.push(segment);
  }
  
  // Step 2: Join segments with proper spacing
  // Add blank lines (double newline) between segments
  formatted = formattedSegments.join('\n\n');
  
  // Step 3: Ensure headings have proper spacing in the HTML output
  // This will be handled by CSS, but we can add line breaks
  formatted = formatted.replace(/(<\/h[1-6]>)\n\n(<p>)/g, '$1\n\n$2');
  formatted = formatted.replace(/(<\/p>)\n\n(<h[1-6]>)/g, '$1\n\n$2');
  
  return formatted.trim();
}

async function main() {
  console.log('🔍 Fetching all blog posts from database...\n');
  
  const db = await getDb();
  
  if (!db) {
    console.error('❌ Database not available');
    process.exit(1);
  }
  
  const posts = await db.select().from(blog_posts);
  
  console.log(`📝 Found ${posts.length} blog posts\n`);
  
  let updatedCount = 0;
  
  for (const post of posts) {
    console.log(`Processing: "${post.title}" (ID: ${post.id})`);
    
    const originalContent = post.content;
    const formattedContent = formatHTMLBlogContent(originalContent);
    
    // Only update if content actually changed
    if (formattedContent !== originalContent) {
      await db
        .update(blog_posts)
        .set({ content: formattedContent })
        .where(eq(blog_posts.id, post.id));
      
      updatedCount++;
      console.log(`  ✅ Updated with HTML formatting improvements`);
    } else {
      console.log(`  ⏭️  No formatting changes needed`);
    }
  }
  
  console.log(`\n✨ HTML Formatting complete!`);
  console.log(`   Total posts: ${posts.length}`);
  console.log(`   Updated: ${updatedCount}`);
  console.log(`   Unchanged: ${posts.length - updatedCount}`);
}

main().catch(console.error);
