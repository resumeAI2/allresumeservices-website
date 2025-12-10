import { getDb } from './server/db.ts';
import { blog_posts } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

/**
 * Generate SEO metadata for all blog posts
 * - Meta titles (max 60 characters)
 * - Meta descriptions (max 160 characters)
 * - Natural Australian English
 * - User benefit focused
 */

function generateMetaTitle(title) {
  // If title is already short enough, use it
  if (title.length <= 60) {
    return title;
  }
  
  // Try to shorten by removing common suffixes
  const shortened = title
    .replace(/ - ALL RESUME SERVICES$/i, '')
    .replace(/ \| All Resume Services$/i, '')
    .replace(/ \(Australia\)$/i, '')
    .replace(/ \(2025\)$/i, '');
  
  if (shortened.length <= 60) {
    return shortened;
  }
  
  // Truncate at last complete word before 57 chars (leaving room for "...")
  const truncated = shortened.substring(0, 57);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
}

function generateMetaDescription(excerpt, content) {
  // Use excerpt if it exists and is appropriate length
  if (excerpt && excerpt.length >= 50 && excerpt.length <= 160) {
    return excerpt;
  }
  
  // Extract first paragraph from content
  const cleanContent = content
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // If content is short enough, use it
  if (cleanContent.length <= 160) {
    return cleanContent;
  }
  
  // Truncate at last complete sentence before 157 chars
  const truncated = cleanContent.substring(0, 157);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastExclamation = truncated.lastIndexOf('!');
  
  const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);
  
  if (lastSentenceEnd > 80) {
    return cleanContent.substring(0, lastSentenceEnd + 1);
  }
  
  // Otherwise truncate at last complete word
  const lastSpace = truncated.lastIndexOf(' ');
  return cleanContent.substring(0, lastSpace) + '...';
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
    
    const updates = {};
    
    // Generate meta title if missing
    if (!post.metaTitle) {
      updates.metaTitle = generateMetaTitle(post.title);
      console.log(`  📌 Meta Title: "${updates.metaTitle}" (${updates.metaTitle.length} chars)`);
    }
    
    // Generate meta description if missing
    if (!post.metaDescription) {
      updates.metaDescription = generateMetaDescription(post.excerpt, post.content);
      console.log(`  📝 Meta Description: "${updates.metaDescription.substring(0, 50)}..." (${updates.metaDescription.length} chars)`);
    }
    
    // Update if we have changes
    if (Object.keys(updates).length > 0) {
      await db
        .update(blog_posts)
        .set(updates)
        .where(eq(blog_posts.id, post.id));
      
      updatedCount++;
      console.log(`  ✅ Updated with SEO metadata`);
    } else {
      console.log(`  ⏭️  SEO metadata already exists`);
    }
  }
  
  console.log(`\n✨ SEO metadata generation complete!`);
  console.log(`   Total posts: ${posts.length}`);
  console.log(`   Updated: ${updatedCount}`);
  console.log(`   Already had metadata: ${posts.length - updatedCount}`);
  
  // Validation check
  console.log(`\n🔍 Validation check:`);
  const allPostsUpdated = await db.select().from(blog_posts);
  
  let validCount = 0;
  let warnings = [];
  
  for (const post of allPostsUpdated) {
    let isValid = true;
    
    if (!post.metaTitle) {
      warnings.push(`⚠️  Post ${post.id} missing metaTitle`);
      isValid = false;
    } else if (post.metaTitle.length > 60) {
      warnings.push(`⚠️  Post ${post.id} metaTitle too long (${post.metaTitle.length} chars)`);
      isValid = false;
    }
    
    if (!post.metaDescription) {
      warnings.push(`⚠️  Post ${post.id} missing metaDescription`);
      isValid = false;
    } else if (post.metaDescription.length > 160) {
      warnings.push(`⚠️  Post ${post.id} metaDescription too long (${post.metaDescription.length} chars)`);
      isValid = false;
    }
    
    if (isValid) {
      validCount++;
    }
  }
  
  console.log(`   ✅ Valid posts: ${validCount}/${allPostsUpdated.length}`);
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  Warnings:`);
    warnings.forEach(w => console.log(`   ${w}`));
  }
}

main().catch(console.error);
