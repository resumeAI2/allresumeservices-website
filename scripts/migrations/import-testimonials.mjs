import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const testimonials = JSON.parse(fs.readFileSync('./scraped_testimonials.json', 'utf8'));

// Remove duplicates based on name and first 50 chars of testimonial
const seen = new Set();
const uniqueTestimonials = testimonials.filter(t => {
  const key = `${t.name}-${t.testimonial.substring(0, 50)}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

console.log(`Total testimonials: ${testimonials.length}`);
console.log(`Unique testimonials: ${uniqueTestimonials.length}`);

async function importTestimonials() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    // First, delete all existing testimonials
    console.log('Deleting existing testimonials...');
    await connection.execute('DELETE FROM testimonials');
    console.log('Existing testimonials deleted.');
    
    // Insert new testimonials
    console.log('Inserting new testimonials...');
    let inserted = 0;
    
    for (const t of uniqueTestimonials) {
      // Determine service type based on testimonial content
      let serviceType = 'Resume Writing';
      const text = t.testimonial.toLowerCase();
      if (text.includes('cover letter') && text.includes('linkedin')) {
        serviceType = 'Resume, Cover Letter & LinkedIn';
      } else if (text.includes('linkedin')) {
        serviceType = 'LinkedIn Profile';
      } else if (text.includes('cover letter')) {
        serviceType = 'Resume & Cover Letter';
      } else if (text.includes('selection criteria')) {
        serviceType = 'Selection Criteria';
      }
      
      await connection.execute(
        `INSERT INTO testimonials (clientName, testimonialText, rating, serviceUsed, approved, featured, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          t.name,
          t.testimonial,
          5, // All 5-star reviews
          serviceType,
          1, // Approved
          0 // Not featured by default
        ]
      );
      inserted++;
    }
    
    console.log(`Successfully inserted ${inserted} testimonials.`);
    
    // Get count
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM testimonials');
    console.log(`Total testimonials in database: ${rows[0].count}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

importTestimonials();
