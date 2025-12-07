import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';
import mysql from 'mysql2/promise';

// Sample HTML table to test
const sampleHTML = `
<p>Here's a guide to appropriate CV length based on your career stage:</p>
<table>
  <tr>
    <th>Career Stage</th>
    <th>Ideal Length</th>
    <th>Why This Length Works</th>
  </tr>
  <tr>
    <td>Graduate / Entry Level</td>
    <td>1–2 pages</td>
    <td>Focuses on education, internships, and foundational skills.</td>
  </tr>
  <tr>
    <td>Early to Mid-Career</td>
    <td>2–3 pages</td>
    <td>Effectively balances detailed experience with demonstrated impact.</td>
  </tr>
</table>
`;

console.log('Testing HTML to Markdown conversion...\n');
console.log('Input HTML:');
console.log(sampleHTML);
console.log('\n---\n');

try {
  const result = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify, {
      bullet: '-',
      fence: '`',
      fences: true,
      incrementListMarker: false,
    })
    .processSync(sampleHTML);
  
  console.log('Output Markdown:');
  console.log(String(result));
} catch (error) {
  console.error('Conversion error:', error);
}

// Now test with actual database content
console.log('\n\n=== Testing with actual database content ===\n');

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(
  "SELECT SUBSTRING(content, LOCATE('Career Stage', content) - 100, 800) as sample FROM blog_posts WHERE slug = 'expert-cv-help-for-crafting-winning-resumes-effortlessly' LIMIT 1"
);

if (rows[0]) {
  console.log('Database HTML sample:');
  console.log(rows[0].sample.substring(0, 500));
  console.log('\n---\n');
  
  try {
    const result = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeRemark)
      .use(remarkGfm)
      .use(remarkStringify)
      .processSync(rows[0].sample);
    
    console.log('Converted Markdown:');
    console.log(String(result));
  } catch (error) {
    console.error('Conversion error:', error);
  }
}

await connection.end();
