import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('Auditing all blog posts for table formatting issues...\n');
console.log('='.repeat(80));

// Get all published posts (is_published = 1)
const [posts] = await connection.execute(
  `SELECT id, title, slug, LENGTH(content) as content_length
   FROM blog_posts 
   WHERE is_published = 1
   ORDER BY id DESC
   LIMIT 50`
);

console.log(`Checking ${posts.length} published blog posts...\n`);

// Check each post for malformed tables
const postsWithIssues = [];

for (const post of posts) {
  const [contentRows] = await connection.execute(
    'SELECT content FROM blog_posts WHERE id = ?',
    [post.id]
  );
  
  const content = contentRows[0].content;
  
  // Look for malformed tables: words mashed together without spaces
  const hasMalformedTable = (
    /[a-z][A-Z][a-z]+[A-Z][a-z]+[A-Z]/.test(content) && // CamelCase mashed words
    !content.includes('| Career Stage |') && // Not already fixed
    !content.includes('| Stage |')
  );
  
  if (hasMalformedTable) {
    const match = content.match(/[A-Z][a-z]+[A-Z][a-z]+[A-Z][a-z]+.{0,80}/);
    postsWithIssues.push({
      id: post.id,
      title: post.title,
      slug: post.slug,
      sample: match ? match[0].substring(0, 60) + '...' : 'Pattern detected'
    });
  }
}

console.log(`Blog posts with table issues: ${postsWithIssues.length}\n`);

if (postsWithIssues.length > 0) {
  console.log('Posts needing fixes:');
  console.log('='.repeat(80));
  postsWithIssues.forEach((post, index) => {
    console.log(`${index + 1}. ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   Sample: ${post.sample}`);
    console.log('');
  });
} else {
  console.log('✅ No table issues found!');
}

await connection.end();
