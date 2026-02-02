import { getDb } from './server/db.ts';
import { blog_posts } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

/**
 * Apply blog formatting rules to all existing blog posts
 * - Make headings bold
 * - Add proper spacing around headings and paragraphs
 * - No content changes
 */

function formatBlogContent(content) {
  if (!content) return content;
  
  let formatted = content;
  
  // Step 1: Normalize line breaks
  formatted = formatted.replace(/\r\n/g, '\n');
  
  // Step 2: Find and format headings (lines that look like headings but aren't properly formatted)
  // Match lines that start with capital letters and end with colons or are short standalone lines
  const lines = formatted.split('\n');
  const formattedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const prevLine = i > 0 ? lines[i - 1].trim() : '';
    const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
    
    // Skip empty lines
    if (!line) {
      formattedLines.push('');
      continue;
    }
    
    // Check if this line is already an HTML heading
    if (line.match(/^<h[1-6]>/i)) {
      // Ensure blank line before heading (if not at start)
      if (i > 0 && prevLine !== '') {
        formattedLines.push('');
      }
      formattedLines.push(line);
      // Ensure blank line after heading
      if (nextLine !== '') {
        formattedLines.push('');
      }
      continue;
    }
    
    // Check if this line is a Markdown heading
    if (line.match(/^#{1,6}\s/)) {
      // Ensure blank line before heading (if not at start)
      if (i > 0 && prevLine !== '') {
        formattedLines.push('');
      }
      formattedLines.push(line);
      // Ensure blank line after heading
      if (nextLine !== '') {
        formattedLines.push('');
      }
      continue;
    }
    
    // Check if this line looks like a heading (short, capitalized, possibly ends with colon)
    const isLikelyHeading = (
      line.length < 100 && // Headings are usually short
      line.length > 5 && // But not too short
      line[0] === line[0].toUpperCase() && // Starts with capital
      !line.match(/^[A-Z]{2,}/) && // Not all caps (could be acronym in paragraph)
      (
        line.endsWith(':') || // Ends with colon
        line.endsWith('?') || // Question heading
        !line.match(/[.!]$/) // Doesn't end with period (likely not a sentence)
      ) &&
      !line.match(/^(The|A|An|In|On|At|To|For|With|By|From)\s/i) // Doesn't start like a sentence
    );
    
    if (isLikelyHeading) {
      // Convert to bold heading with proper spacing
      const headingText = line.replace(/:$/, ''); // Remove trailing colon if present
      
      // Ensure blank line before heading (if not at start)
      if (i > 0 && prevLine !== '') {
        formattedLines.push('');
      }
      
      // Make it bold
      formattedLines.push(`**${headingText}**`);
      
      // Ensure blank line after heading
      if (nextLine !== '') {
        formattedLines.push('');
      }
      continue;
    }
    
    // Regular paragraph line
    formattedLines.push(line);
  }
  
  // Step 3: Join lines back together
  formatted = formattedLines.join('\n');
  
  // Step 4: Ensure proper spacing between paragraphs
  // Replace 3+ consecutive newlines with 2 (paragraph break)
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  // Step 5: Ensure HTML headings are bold
  formatted = formatted.replace(/<h([1-6])>(.*?)<\/h\1>/gi, (match, level, text) => {
    // If not already wrapped in <strong> or <b>, wrap it
    if (!text.match(/<(strong|b)>/i)) {
      return `<h${level}><strong>${text}</strong></h${level}>`;
    }
    return match;
  });
  
  // Step 6: Ensure spacing around HTML headings
  formatted = formatted.replace(/([^\n])\n(<h[1-6]>)/gi, '$1\n\n$2');
  formatted = formatted.replace(/(<\/h[1-6]>)\n([^\n])/gi, '$1\n\n$2');
  
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
    const formattedContent = formatBlogContent(originalContent);
    
    // Only update if content actually changed
    if (formattedContent !== originalContent) {
      await db
        .update(blog_posts)
        .set({ content: formattedContent })
        .where(eq(blog_posts.id, post.id));
      
      updatedCount++;
      console.log(`  ✅ Updated with formatting improvements`);
    } else {
      console.log(`  ⏭️  No formatting changes needed`);
    }
  }
  
  console.log(`\n✨ Formatting complete!`);
  console.log(`   Total posts: ${posts.length}`);
  console.log(`   Updated: ${updatedCount}`);
  console.log(`   Unchanged: ${posts.length - updatedCount}`);
}

main().catch(console.error);
