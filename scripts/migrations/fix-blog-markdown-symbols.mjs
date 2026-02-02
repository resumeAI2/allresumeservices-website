/**
 * Remove Markdown Symbols from Blog Posts
 * Converts visible Markdown syntax to proper HTML
 */

import { getDb } from './server/db.ts';

const db = await getDb();

console.log('\n=== REMOVING MARKDOWN SYMBOLS FROM BLOG POSTS ===\n');

// Get all blog posts
const result = await db.execute('SELECT id, title, content FROM blog_posts');
const posts = Array.isArray(result) ? result : (result.rows || []);

console.log(`Found ${posts.length} blog posts to process\n`);

let updatedCount = 0;

for (const post of posts) {
  if (!post.content) {
    console.log(`⏭️  Skipped (no content): ${post.title}`);
    continue;
  }
  
  let content = post.content;
  let originalContent = content;
  
  // Step 1: Remove standalone ** markers (bold markers not part of HTML)
  // Match ** that are not immediately followed or preceded by < or >
  content = content.replace(/\*\*(?![<>])/g, '');
  content = content.replace(/(?<![<>])\*\*/g, '');
  
  // Step 2: Convert ###### headings to <h3><strong> tags
  // Match: ###### Heading Text (with or without surrounding whitespace/newlines)
  content = content.replace(/######\s*([^\n<]+)/g, '<h3><strong>$1</strong></h3>');
  
  // Step 3: Clean up any remaining markdown heading symbols
  content = content.replace(/#{1,6}\s*/g, '');
  
  // Step 4: Remove empty paragraphs that might have been created
  content = content.replace(/<p>\s*<\/p>/g, '');
  
  // Step 5: Clean up multiple consecutive newlines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // Step 6: Ensure proper spacing around h3 tags
  content = content.replace(/<h3>/g, '\n\n<h3>');
  content = content.replace(/<\/h3>/g, '</h3>\n\n');
  
  // Step 7: Clean up any remaining ** symbols
  content = content.replace(/\*\*/g, '');
  
  if (content !== originalContent) {
    // Update the database
    await db.execute(
      'UPDATE blog_posts SET content = ? WHERE id = ?',
      [content, post.id]
    );
    updatedCount++;
    console.log(`✅ Updated: ${post.title}`);
  } else {
    console.log(`⏭️  Skipped (no changes): ${post.title}`);
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`Total posts: ${posts.length}`);
console.log(`Updated: ${updatedCount}`);
console.log(`No changes needed: ${posts.length - updatedCount}`);
console.log('\n=== DONE ===\n');

process.exit(0);
