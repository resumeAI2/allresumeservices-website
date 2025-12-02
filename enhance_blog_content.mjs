import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { blog_posts } from './drizzle/schema.ts';
import { eq, like } from 'drizzle-orm';
import dotenv from 'dotenv';
import { chromium } from 'playwright';

dotenv.config({ path: './.env' });

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Get all blog posts with placeholder content
const postsToEnhance = await db.select({
  id: blog_posts.id,
  title: blog_posts.title,
  slug: blog_posts.slug
}).from(blog_posts).where(like(blog_posts.content, '%This is a placeholder%'));

console.log(`Found ${postsToEnhance.length} blog posts to enhance with full content`);

// Launch browser
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

let enhanced = 0;
let failed = 0;

for (const post of postsToEnhance.slice(0, 15)) { // Process first 15 posts
  try {
    const url = `https://www.allresumeservices.com.au/${post.slug}/`;
    console.log(`\nProcessing: ${post.title}`);
    console.log(`URL: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Extract the main content from the blog post
    const content = await page.evaluate(() => {
      // Find the main article content
      const articleContent = document.querySelector('article .entry-content, article .post-content, .blog-post-content, .post-entry');
      
      if (!articleContent) {
        return null;
      }
      
      // Remove unwanted elements
      const unwanted = articleContent.querySelectorAll('script, style, .social-share, .author-box, .related-posts, nav');
      unwanted.forEach(el => el.remove());
      
      // Get all paragraphs and headings
      const elements = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote');
      
      let html = '';
      elements.forEach(el => {
        const tagName = el.tagName.toLowerCase();
        const text = el.textContent.trim();
        
        if (text && text.length > 0) {
          if (tagName.startsWith('h')) {
            html += `<${tagName}>${text}</${tagName}>\n\n`;
          } else if (tagName === 'p') {
            html += `<p>${text}</p>\n\n`;
          } else if (tagName === 'blockquote') {
            html += `<blockquote>${text}</blockquote>\n\n`;
          } else if (tagName === 'ul' || tagName === 'ol') {
            const items = Array.from(el.querySelectorAll('li')).map(li => li.textContent.trim());
            if (tagName === 'ul') {
              html += '<ul>\n';
              items.forEach(item => html += `  <li>${item}</li>\n`);
              html += '</ul>\n\n';
            } else {
              html += '<ol>\n';
              items.forEach(item => html += `  <li>${item}</li>\n`);
              html += '</ol>\n\n';
            }
          }
        }
      });
      
      return html;
    });
    
    if (content && content.length > 200) {
      // Update the database
      await db.update(blog_posts)
        .set({ 
          content: content,
          updatedAt: new Date()
        })
        .where(eq(blog_posts.id, post.id));
      
      enhanced++;
      console.log(`✓ Enhanced with ${content.length} characters of content`);
    } else {
      failed++;
      console.log(`✗ Could not extract sufficient content (got ${content ? content.length : 0} chars)`);
    }
    
    // Small delay to be respectful
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    failed++;
    console.error(`✗ Error processing "${post.title}":`, error.message);
  }
}

await browser.close();
await connection.end();

console.log(`\n=== Enhancement Summary ===`);
console.log(`Total posts to enhance: ${postsToEnhance.length}`);
console.log(`Successfully enhanced: ${enhanced}`);
console.log(`Failed: ${failed}`);

process.exit(0);
