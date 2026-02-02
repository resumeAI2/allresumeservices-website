#!/usr/bin/env node
/**
 * Insert parsed testimonials into the database
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { testimonials } from './drizzle/schema.js';
import { readFileSync } from 'fs';

async function main() {
  // Create database connection
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  });

  const db = drizzle(connection);

  // Read parsed testimonials
  const testimonialsData = JSON.parse(
    readFileSync('/home/ubuntu/testimonials_parsed.json', 'utf-8')
  );

  console.log(`Loaded ${testimonialsData.length} testimonials`);

  // Clear existing sample data
  await connection.execute('DELETE FROM testimonials');
  console.log('Cleared existing testimonials');

  // Insert real testimonials in batches
  const batchSize = 10;
  let inserted = 0;

  for (let i = 0; i < testimonialsData.length; i += batchSize) {
    const batch = testimonialsData.slice(i, i + batchSize);
    
    for (const t of batch) {
      await db.insert(testimonials).values({
        clientName: t.clientName,
        clientTitle: t.clientTitle,
        rating: t.rating,
        testimonialText: t.testimonialText,
        serviceUsed: t.serviceUsed,
        featured: t.featured,
        approved: t.approved,
      });
      inserted++;
    }
    
    console.log(`Inserted ${inserted}/${testimonialsData.length} testimonials`);
  }

  console.log(`Successfully inserted ${inserted} testimonials!`);
  
  // Close connection
  await connection.end();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
