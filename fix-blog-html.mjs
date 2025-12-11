/**
 * Fix Blog Post HTML Rendering
 * Converts Markdown-in-HTML to proper HTML tags
 */

import { getDb } from './server/db.ts';

const db = await getDb();

console.log('\n=== FIXING BLOG POST HTML RENDERING ===\n');

// Get all blog posts
const result = await db.execute('SELECT id, title, content FROM blog_posts');
const posts = Array.isArray(result) ? result : (result.rows || []);

console.log(`Found ${posts.length} blog posts to process\n`);

let updatedCount = 0;

for (const post of posts) {
  let content = post.content;
  let hasChanges = false;
  
  // Fix pattern: **<p>###### Heading</p>** → <h3><strong>Heading</strong></h3>
  const pattern1 = /\*\*<p>######\s*([^<]+)<\/p>\*\*/g;
  if (pattern1.test(content)) {
    content = content.replace(pattern1, '<h3><strong>$1</strong></h3>');
    hasChanges = true;
  }
  
  // Fix pattern: <p>###### Heading</p> → <h3><strong>Heading</strong></h3>
  const pattern2 = /<p>######\s*([^<]+)<\/p>/g;
  if (pattern2.test(content)) {
    content = content.replace(pattern2, '<h3><strong>$1</strong></h3>');
    hasChanges = true;
  }
  
  // Fix pattern: **<p>Text</p>** → <p><strong>Text</strong></p>
  const pattern3 = /\*\*<p>([^#][^<]+)<\/p>\*\*/g;
  if (pattern3.test(content)) {
    content = content.replace(pattern3, '<p><strong>$1</strong></p>');
    hasChanges = true;
  }
  
  // Remove any remaining ** that aren't part of HTML
  const pattern4 = /\*\*/g;
  if (pattern4.test(content)) {
    content = content.replace(pattern4, '');
    hasChanges = true;
  }
  
  if (hasChanges) {
    // Update the database
    await db.execute(
      'UPDATE blog_posts SET content = ? WHERE id = ?',
      [content, post.id]
    );
    updatedCount++;
    console.log(`✅ Updated: ${post.title}`);
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`Total posts: ${posts.length}`);
console.log(`Updated: ${updatedCount}`);
console.log(`No changes needed: ${posts.length - updatedCount}`);
console.log('\n=== DONE ===\n');

process.exit(0);
