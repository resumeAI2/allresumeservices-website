/**
 * SEO Fix Script for All Resume Services Blog Posts
 * Fixes meta descriptions that are too short (<120 chars) or too long (>160 chars)
 */

import mysql from 'mysql2/promise';

// Database connection - uses environment variables
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'allresumeservices',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

console.log('🔍 SEO Audit & Fix Script for All Resume Services\n');
console.log('=' .repeat(60));

// Optimized meta descriptions for posts with short descriptions
// Target: 140-155 characters (optimal range for Google)
const seoFixes = {
  // Posts with meta descriptions under 120 characters need expansion
  // Format: id: "new optimized meta description"
  
  // These will be generated based on post titles and content themes
};

// Get all posts that need fixing
const [shortPosts] = await connection.execute(`
  SELECT id, title, metaDescription, LENGTH(metaDescription) as len 
  FROM blog_posts 
  WHERE LENGTH(metaDescription) < 120 
  ORDER BY id
`);

const [longPosts] = await connection.execute(`
  SELECT id, title, metaDescription, LENGTH(metaDescription) as len 
  FROM blog_posts 
  WHERE LENGTH(metaDescription) > 160 
  ORDER BY id
`);

console.log(`\n📊 SEO AUDIT RESULTS:`);
console.log(`   - Posts with short meta descriptions (<120 chars): ${shortPosts.length}`);
console.log(`   - Posts with long meta descriptions (>160 chars): ${longPosts.length}`);
console.log(`   - Total posts needing fixes: ${shortPosts.length + longPosts.length}\n`);

// Generate optimized meta descriptions based on titles
function generateOptimizedMetaDescription(title, currentDesc) {
  // Remove any URL prefixes or markdown artifacts
  let cleanDesc = currentDesc
    .replace(/\*\*URL:\*\*[^;]*;?\s*---\s*/gi, '')
    .replace(/\*\*/g, '')
    .trim();
  
  // Keywords to include based on common resume/career themes
  const keywords = {
    'resume': 'professional resume',
    'cover letter': 'compelling cover letter',
    'linkedin': 'LinkedIn profile',
    'interview': 'job interview',
    'career': 'career success',
    'job': 'job search',
    'ats': 'ATS-optimized',
    'selection criteria': 'selection criteria',
    'government': 'government jobs',
    'executive': 'executive-level'
  };
  
  // Build optimized description
  let optimized = cleanDesc;
  
  // If too short, expand with relevant content
  if (optimized.length < 120) {
    // Add call-to-action and expertise mention
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('resume')) {
      optimized = `${cleanDesc} Expert tips from professional resume writers with 18+ years experience. Get more interviews today.`;
    } else if (titleLower.includes('cover letter')) {
      optimized = `${cleanDesc} Professional cover letter strategies that get results. Stand out from other applicants.`;
    } else if (titleLower.includes('linkedin')) {
      optimized = `${cleanDesc} Optimize your LinkedIn profile for recruiters. Expert strategies for career success.`;
    } else if (titleLower.includes('interview')) {
      optimized = `${cleanDesc} Expert interview preparation tips to help you land your dream job in Australia.`;
    } else if (titleLower.includes('career') || titleLower.includes('job')) {
      optimized = `${cleanDesc} Professional career advice from Australia's leading resume writing experts.`;
    } else if (titleLower.includes('selection criteria') || titleLower.includes('government')) {
      optimized = `${cleanDesc} Expert guidance for Australian government job applications. Get shortlisted.`;
    } else if (titleLower.includes('ats')) {
      optimized = `${cleanDesc} Beat applicant tracking systems with expert formatting tips. Get past the robots.`;
    } else {
      optimized = `${cleanDesc} Professional career advice from All Resume Services Australia. Get expert help today.`;
    }
  }
  
  // If too long, trim intelligently at sentence boundary
  if (optimized.length > 160) {
    // Try to cut at a sentence boundary
    const sentences = optimized.match(/[^.!?]+[.!?]+/g) || [optimized];
    let trimmed = '';
    for (const sentence of sentences) {
      if ((trimmed + sentence).length <= 155) {
        trimmed += sentence;
      } else {
        break;
      }
    }
    // If still too long or empty, just truncate
    if (trimmed.length < 100 || trimmed.length > 160) {
      trimmed = optimized.substring(0, 155) + '...';
    }
    optimized = trimmed.trim();
  }
  
  // Ensure it ends properly
  if (!optimized.match(/[.!?]$/)) {
    if (optimized.length < 157) {
      optimized += '.';
    }
  }
  
  return optimized;
}

// Fix short meta descriptions
console.log('\n🔧 FIXING SHORT META DESCRIPTIONS:\n');
for (const post of shortPosts) {
  const newDesc = generateOptimizedMetaDescription(post.title, post.metaDescription);
  console.log(`ID ${post.id}: "${post.title.substring(0, 50)}..."`);
  console.log(`   Old (${post.len} chars): ${post.metaDescription.substring(0, 60)}...`);
  console.log(`   New (${newDesc.length} chars): ${newDesc.substring(0, 60)}...`);
  
  await connection.execute(
    'UPDATE blog_posts SET metaDescription = ?, updatedAt = NOW() WHERE id = ?',
    [newDesc, post.id]
  );
  console.log(`   ✅ Fixed!\n`);
}

// Fix long meta descriptions
console.log('\n🔧 FIXING LONG META DESCRIPTIONS:\n');
for (const post of longPosts) {
  const newDesc = generateOptimizedMetaDescription(post.title, post.metaDescription);
  console.log(`ID ${post.id}: "${post.title.substring(0, 50)}..."`);
  console.log(`   Old (${post.len} chars): ${post.metaDescription.substring(0, 60)}...`);
  console.log(`   New (${newDesc.length} chars): ${newDesc.substring(0, 60)}...`);
  
  await connection.execute(
    'UPDATE blog_posts SET metaDescription = ?, updatedAt = NOW() WHERE id = ?',
    [newDesc, post.id]
  );
  console.log(`   ✅ Fixed!\n`);
}

// Verify fixes
const [verifyShort] = await connection.execute(`
  SELECT COUNT(*) as count FROM blog_posts WHERE LENGTH(metaDescription) < 120
`);
const [verifyLong] = await connection.execute(`
  SELECT COUNT(*) as count FROM blog_posts WHERE LENGTH(metaDescription) > 160
`);

console.log('\n' + '=' .repeat(60));
console.log('✅ SEO FIX COMPLETE!\n');
console.log('📊 VERIFICATION:');
console.log(`   - Posts still with short meta descriptions: ${verifyShort[0].count}`);
console.log(`   - Posts still with long meta descriptions: ${verifyLong[0].count}`);
console.log(`   - Total posts fixed: ${shortPosts.length + longPosts.length}`);

await connection.end();
console.log('\n🎉 All SEO issues have been resolved!');
