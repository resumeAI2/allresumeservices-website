import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { blog_posts } from './drizzle/schema.ts';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const blogPostsData = JSON.parse(fs.readFileSync('./all_new_blog_posts.json', 'utf8'));

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log(`Importing ${blogPostsData.length} blog posts...`);

let imported = 0;
let skipped = 0;

for (const post of blogPostsData) {
  try {
    // Map category to match existing categories
    let category = post.category;
    if (category === 'Uncategorized') {
      category = 'Career Tips';
    }
    
    // Generate a featured image URL based on category
    let featuredImage = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop';
    if (category === 'Resume Writing') {
      featuredImage = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop';
    } else if (category === 'Career Tips') {
      featuredImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop';
    } else if (category === 'Blog') {
      featuredImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop';
    }
    
    await db.insert(blog_posts).values({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: `<p>${post.excerpt}</p><p>This is a placeholder for the full blog post content. The content will be enhanced with detailed information from the original website.</p>`,
      featuredImage: featuredImage,
      category: category,
      tags: JSON.stringify(['resume', 'career', 'job search']),
      authorId: 1,
      published: true,
      publishedAt: new Date('2024-12-12'),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    imported++;
    console.log(`✓ Imported: ${post.title}`);
  } catch (error) {
    if (error.message.includes('Duplicate entry')) {
      skipped++;
      console.log(`⊘ Skipped (duplicate): ${post.title}`);
    } else {
      console.error(`✗ Error importing "${post.title}":`, error.message);
    }
  }
}

console.log(`\n=== Import Summary ===`);
console.log(`Total posts: ${blogPostsData.length}`);
console.log(`Imported: ${imported}`);
console.log(`Skipped: ${skipped}`);

await connection.end();
process.exit(0);
