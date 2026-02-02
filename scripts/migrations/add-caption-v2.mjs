import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './server/db/schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('Adding table caption...\n');

// Get the blog post
const [post] = await connection.execute(
  "SELECT id, content FROM blog_posts WHERE slug = ?",
  ['expert-cv-help-for-crafting-winning-resumes-effortlessly']
);

if (post && post.length > 0) {
  let content = post[0].content;
  const postId = post[0].id;
  
  console.log('Found blog post, checking for table...');
  
  // Find where the table starts
  const tableHeaderIndex = content.indexOf('| Career Stage | Ideal Length | Why This Length Works |');
  
  if (tableHeaderIndex > -1) {
    console.log('Table found at position:', tableHeaderIndex);
    
    // Find the text before the table
    const beforeTable = content.substring(0, tableHeaderIndex);
    const lastNewlineBeforeTable = beforeTable.lastIndexOf('\n');
    
    // Caption text
    const caption = "**Table 1: Recommended CV Length by Career Stage** - This table outlines the ideal CV length for different career stages in the Australian job market, helping you determine the appropriate level of detail for your professional experience.\n\n";
    
    // Insert caption right before the table
    const updatedContent = content.substring(0, tableHeaderIndex) + caption + content.substring(tableHeaderIndex);
    
    // Update database
    await connection.execute(
      'UPDATE blog_posts SET content = ? WHERE id = ?',
      [updatedContent, postId]
    );
    
    console.log('\n✅ Caption added successfully!');
    console.log('Caption text:', caption.trim());
  } else {
    console.log('❌ Table not found in content');
  }
} else {
  console.log('❌ Blog post not found');
}

await connection.end();
console.log('\n✨ Done!');
