import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('Auditing blog posts for table issues...\n');

// Get all posts without filtering
const [posts] = await connection.execute(
  'SELECT id, title, slug FROM blog_posts ORDER BY id DESC LIMIT 48'
);

console.log(`Checking ${posts.length} blog posts...\n`);

const issues = [];

for (const post of posts) {
  const [rows] = await connection.execute(
    'SELECT content FROM blog_posts WHERE id = ?',
    [post.id]
  );
  
  const content = rows[0].content;
  
  // Look for mashed-together table text
  if (/[a-z][A-Z][a-z]+[A-Z][a-z]+[A-Z]/.test(content) && 
      !content.includes('| Career Stage |')) {
    const match = content.match(/[A-Z][a-z]+[A-Z][a-z]+[A-Z][a-z]+.{0,50}/);
    issues.push({
      title: post.title,
      slug: post.slug,
      sample: match ? match[0].substring(0, 50) : 'Found'
    });
  }
}

console.log(`Found ${issues.length} posts with table issues\n`);

if (issues.length > 0) {
  issues.forEach((p, i) => {
    console.log(`${i+1}. ${p.title}`);
    console.log(`   ${p.slug}`);
    console.log(`   Sample: ${p.sample}...`);
    console.log('');
  });
}

await connection.end();
