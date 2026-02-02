import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Get all blog JSON files
const blogFiles = fs.readdirSync('/home/ubuntu/data_file')
  .filter(f => f.endsWith('.json'))
  .map(f => `/home/ubuntu/data_file/${f}`)
  .sort();

console.log(`\nImporting ${blogFiles.length} blog posts...\n`);

let successCount = 0;
let skipCount = 0;

for (const blogFile of blogFiles) {
  try {
    const blogData = JSON.parse(fs.readFileSync(blogFile, 'utf-8'));
    
    // Extract slug from URL
    const url = blogData.url || '';
    const parts = url.split('/').filter(Boolean);
    const slug = parts[parts.length - 1] || `blog-post-${successCount + 1}`;
    
    // Clean content for SEO (remove accents from résumé)
    const title = (blogData.title || 'Untitled').substring(0, 200)
      .replace(/résumé/gi, 'resume').replace(/Résumé/gi, 'Resume');
    const content = (blogData.content || '').substring(0, 50000)
      .replace(/résumé/gi, 'resume').replace(/Résumé/gi, 'Resume');
    const excerpt = (blogData.excerpt || content.substring(0, 500)).substring(0, 500)
      .replace(/résumé/gi, 'resume').replace(/Résumé/gi, 'Resume');
    const metaDescription = excerpt.substring(0, 160);
    
    const category = 'Resume Writing';
    const readTime = `${Math.max(3, Math.floor(content.length / 1000))} min read`;
    
    // Check if already exists
    const [existing] = await connection.execute(
      'SELECT id FROM blog_posts WHERE slug = ?',
      [slug]
    );
    
    if (existing.length > 0) {
      skipCount++;
      if (successCount + skipCount <= 5) {
        console.log(`⊙ ${successCount + skipCount}. ${title.substring(0, 60)}... (already exists)`);
      }
      continue;
    }
    
    // Insert into database
    await connection.execute(
      `INSERT INTO blog_posts (slug, title, content, excerpt, metaDescription, category, published, readTime, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?, NOW(), NOW())`,
      [slug, title, content, excerpt, metaDescription, category, readTime]
    );
    
    successCount++;
    if (successCount <= 5 || successCount % 10 === 0) {
      console.log(`✓ ${successCount}. ${title.substring(0, 60)}...`);
    }
    
  } catch (error) {
    console.error(`✗ Failed: ${blogFile.split('/').pop()} - ${error.message}`);
  }
}

await connection.end();

console.log(`\n${'='.repeat(80)}`);
console.log(`✅ Successfully imported ${successCount} blog posts`);
console.log(`⊙ Skipped ${skipCount} (already existed)`);
console.log(`📊 Total: ${successCount + skipCount} / ${blogFiles.length}`);
