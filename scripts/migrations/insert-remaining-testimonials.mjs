import { readFileSync } from 'fs';
import { createConnection } from 'mysql2/promise';

const testimonials = JSON.parse(readFileSync('/home/ubuntu/testimonials_parsed.json', 'utf8'));

// Skip first 15 (already inserted)
const remaining = testimonials.slice(15);

console.log(`Inserting ${remaining.length} remaining testimonials...`);

const connection = await createConnection({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

try {
  let inserted = 0;
  
  for (const t of remaining) {
    try {
      await connection.execute(
        `INSERT INTO testimonials (clientName, clientTitle, rating, testimonialText, serviceUsed, featured, approved, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          t.clientName,
          t.clientTitle || null,
          t.rating,
          t.testimonialText,
          t.serviceUsed || null,
          t.featured,
          t.approved
        ]
      );
      inserted++;
      if (inserted % 10 === 0) {
        console.log(`Inserted ${inserted}/${remaining.length} testimonials...`);
      }
    } catch (err) {
      console.error(`Error inserting testimonial for ${t.clientName}:`, err.message);
    }
  }
  
  console.log(`\nSuccessfully inserted ${inserted} testimonials!`);
} finally {
  await connection.end();
}
