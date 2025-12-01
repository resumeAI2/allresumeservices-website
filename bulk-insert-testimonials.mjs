import { readFileSync } from 'fs';
import { db } from './server/db.js';
import { testimonials } from './drizzle/schema.js';

// Read the parsed testimonials
const data = JSON.parse(readFileSync('/home/ubuntu/testimonials_parsed.json', 'utf-8'));

// Skip the first 30 (already inserted)
const remaining = data.slice(30);

console.log(`Inserting ${remaining.length} remaining testimonials...`);

try {
  // Insert in batches of 10
  for (let i = 0; i < remaining.length; i += 10) {
    const batch = remaining.slice(i, i + 10);
    
    const values = batch.map(t => ({
      clientName: t.clientName,
      clientTitle: t.clientTitle || null,
      rating: t.rating,
      testimonialText: t.testimonialText,
      serviceUsed: t.serviceUsed || null,
      featured: t.featured ? 1 : 0,
      approved: t.approved ? 1 : 0,
      createdAt: new Date()
    }));
    
    await db.insert(testimonials).values(values);
    console.log(`Inserted batch ${Math.floor(i / 10) + 1}: ${values.length} testimonials`);
  }
  
  console.log(`\nSuccess! Inserted all ${remaining.length} testimonials.`);
  process.exit(0);
} catch (error) {
  console.error('Error inserting testimonials:', error);
  process.exit(1);
}
