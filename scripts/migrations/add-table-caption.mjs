import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('Adding table caption to Expert CV Help blog post...\n');

// Get the current content
const [rows] = await connection.execute(
  "SELECT id, content FROM blog_posts WHERE slug = 'expert-cv-help-for-crafting-winning-resumes-effortlessly' LIMIT 1"
);

if (rows[0]) {
  const currentContent = rows[0].content;
  const postId = rows[0].id;
  
  // Add caption before the table
  const captionText = "**Table 1: Recommended CV Length by Career Stage** - This table outlines the ideal CV length for different career stages in the Australian job market, helping you determine the appropriate level of detail for your professional experience.";
  
  // Find the table and add caption before it
  const tablePattern = /Here's a guide to appropriate CV length based on your career stage:\n\n(\| Career Stage \| Ideal Length \| Why This Length Works \|)/;
  const updatedContent = currentContent.replace(
    tablePattern,
    `Here's a guide to appropriate CV length based on your career stage:\n\n${captionText}\n\n$1`
  );
  
  if (updatedContent !== currentContent) {
    // Update the database
    await connection.execute(
      'UPDATE blog_posts SET content = ? WHERE id = ?',
      [updatedContent, postId]
    );
    
    console.log('✅ Successfully added table caption!');
    console.log('\nCaption added:');
    console.log(captionText);
  } else {
    console.log('⚠️  Table pattern not found or caption already exists.');
  }
} else {
  console.log('❌ Blog post not found.');
}

await connection.end();
console.log('\n✨ Done!');
