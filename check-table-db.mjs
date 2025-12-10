import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(
  `SELECT content FROM blog_posts WHERE slug = 'expert-cv-help-for-crafting-winning-resumes-effortlessly'`
);

const content = rows[0].content;
const tableStart = content.indexOf('| Career Stage |');
const tableSection = content.substring(tableStart, tableStart + 600);

console.log('Table section from database:');
console.log('='.repeat(80));
console.log(tableSection);
console.log('='.repeat(80));
console.log('\nChecking for newlines:');
console.log('Has \\n:', tableSection.includes('\n'));
console.log('Has \\r\\n:', tableSection.includes('\r\n'));
console.log('Lines:', tableSection.split('\n').length);

await connection.end();
