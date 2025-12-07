import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(
  "SELECT content FROM blog_posts WHERE slug = 'expert-cv-help-for-crafting-winning-resumes-effortlessly' LIMIT 1"
);

if (rows[0]) {
  const content = rows[0].content;
  const tableStart = content.indexOf('Career Stage');
  if (tableStart > -1) {
    const sample = content.substring(tableStart - 100, tableStart + 600);
    console.log('Content around "Career Stage":');
    console.log('='.repeat(80));
    console.log(sample);
    console.log('='.repeat(80));
  }
}

await connection.end();
