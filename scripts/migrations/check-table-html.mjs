import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(
  "SELECT SUBSTRING(content, LOCATE('Career Stage', content) - 200, 1000) as sample FROM blog_posts WHERE slug = 'expert-cv-help-for-crafting-winning-resumes-effortlessly' LIMIT 1"
);

if (rows[0]) {
  console.log('Raw HTML content around table:');
  console.log('='.repeat(80));
  console.log(rows[0].sample);
  console.log('='.repeat(80));
}

await connection.end();
