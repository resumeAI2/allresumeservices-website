import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Properly formatted markdown table WITHOUT blank lines between rows
const properTable = `| Career Stage | Ideal Length | Why This Length Works |
| --- | --- | --- |
| Graduate / Entry Level | 1–2 pages | Focuses on education, internships, and foundational skills. |
| Early to Mid-Career | 2–3 pages | Effectively balances detailed experience with demonstrated impact. |
| Senior / Executive Level | 3–5 pages | Provides ample space to showcase leadership achievements and strategic contributions. |`;

console.log('Fixing table spacing in Expert CV Help blog post...\n');

// Get the current content
const [rows] = await connection.execute(
  "SELECT id, content FROM blog_posts WHERE slug = 'expert-cv-help-for-crafting-winning-resumes-effortlessly' LIMIT 1"
);

if (rows[0]) {
  const currentContent = rows[0].content;
  const postId = rows[0].id;
  
  // Find and replace the table (it might have extra newlines)
  const tablePattern = /\| Career Stage.*?\| Senior \/ Executive Level.*?strategic contributions\. \|/s;
  const updatedContent = currentContent.replace(tablePattern, properTable);
  
  if (updatedContent !== currentContent) {
    // Update the database
    await connection.execute(
      'UPDATE blog_posts SET content = ? WHERE id = ?',
      [updatedContent, postId]
    );
    
    console.log('✅ Successfully updated table spacing!');
    console.log('\nNew table format (no blank lines between rows):');
    console.log(properTable);
  } else {
    console.log('⚠️  Table content not found or already fixed.');
  }
} else {
  console.log('❌ Blog post not found.');
}

await connection.end();
console.log('\n✨ Done!');
