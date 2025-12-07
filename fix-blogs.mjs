import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { blog_posts } from './drizzle/schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Get all blog posts
const posts = await db.select().from(blog_posts);

console.log(`Found ${posts.length} blog posts to fix`);

for (const post of posts) {
  let content = post.content;
  
  // Convert \n\n to paragraph breaks
  content = content
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => `<p>${p.trim()}</p>`)
    .join('\n\n');
  
  // Convert single \n within paragraphs to <br>
  content = content.replace(/<p>([^<]+)<\/p>/g, (match, p1) => {
    return `<p>${p1.replace(/\n/g, '<br>')}</p>`;
  });
  
  // Fix image paths - remove local paths and use relative URLs
  content = content.replace(/\/home\/ubuntu\/blog_images\//g, '/blog-images/');
  
  // Update the post
  await db.update(blog_posts)
    .set({ content })
    .where(blog_posts.id.eq(post.id));
  
  console.log(`Fixed: ${post.title}`);
}

console.log('All blog posts fixed!');
await connection.end();
