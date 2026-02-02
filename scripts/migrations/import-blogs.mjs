import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Get all blog JSON files
const blogFiles = glob.sync('/home/ubuntu/data_file/*.json');
console.log(`Found ${blogFiles.length} blog posts to import\n`);

let successCount = 0;
let failCount = 0;

for (const blogFile of blogFiles) {
  try {
    const blogData = JSON.parse(fs.readFileSync(blogFile, 'utf-8'));
    
    // Extract slug from URL
    const url = blogData.url || '';
    const slug = url.split('/').filter(Boolean).pop() || path.basename(blogFile, '.json');
    
    // Clean content for SEO (remove accents from résumé)
    const title = (blogData.title || 'Untitled').replace(/résumé/gi, 'resume').replace(/Résumé/gi, 'Resume');
    const content = (blogData.content || '').replace(/résumé/gi, 'resume').replace(/Résumé/gi, 'Resume');
    const excerpt = (blogData.excerpt || content.substring(0, 500)).replace(/résumé/gi, 'resume').replace(/Résumé/gi, 'Resume');
    
    // Prepare SQL insert
    const author = blogData.author || 'All Resume Services';
    const publishedDate = blogData.publishedDate || new Date().toISOString();
    const categories = JSON.stringify(blogData.categories || ['Resume Writing', 'Career Advice']);
    
    // Insert into database
    await connection.execute(
      `INSERT INTO blog_posts (slug, title, content, excerpt, author, published_at, categories, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       content = VALUES(content),
       excerpt = VALUES(excerpt),
       author = VALUES(author),
       published_at = VALUES(published_at),
       categories = VALUES(categories),
       updated_at = NOW()`,
      [slug, title, content, excerpt, author, publishedDate, categories]
    );
    
    successCount++;
    console.log(`✓ ${successCount}. ${title.substring(0, 70)}...`);
    
  } catch (error) {
    failCount++;
    console.error(`✗ Failed: ${path.basename(blogFile)} - ${error.message}`);
  }
}

await connection.end();

console.log(`\n${'='.repeat(80)}`);
console.log(`✅ Successfully imported ${successCount} blog posts`);
console.log(`❌ Failed: ${failCount}`);
