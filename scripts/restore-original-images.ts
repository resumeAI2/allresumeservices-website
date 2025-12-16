import { getDb } from '../server/db';
import { case_studies } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

// Restore the original professional images that looked great
// These were the images before I incorrectly replaced them all
async function restoreImages() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }
  
  console.log('Restoring original professional case study images...\n');
  
  // Restore original images - these were the good professional photos
  const originalImages = [
    { id: 1, image: '/case-studies/business-professional.jpg' },
    { id: 2, image: '/case-studies/mature-professional.jpg' },
    { id: 3, image: '/case-studies/interview-success.jpg' },
    { id: 30001, image: '/case-studies/career-success.jpg' },
    { id: 30002, image: '/case-studies/nurse-healthcare.jpg' },
    { id: 30003, image: '/case-studies/office-professional.jpg' },
    { id: 30004, image: '/case-studies/tech-professional.jpg' },
    { id: 60001, image: '/case-studies/mining-engineer.jpg' },
    { id: 60002, image: '/case-studies/banking-professional.jpg' },
    { id: 60003, image: '/case-studies/retail-manager.jpg' },
    { id: 60004, image: '/case-studies/software-engineer.jpg' },
    { id: 60005, image: '/case-studies/aviation-pilot.jpg' },
    { id: 60006, image: '/case-studies/public-servant.jpg' },
    { id: 60007, image: '/case-studies/finance-executive.jpg' },
    { id: 60008, image: '/case-studies/project-manager.jpg' },
    { id: 60009, image: '/case-studies/corporate-banking.jpg' },
  ];
  
  for (const item of originalImages) {
    await db.update(case_studies)
      .set({ image: item.image })
      .where(eq(case_studies.id, item.id));
    console.log(`Restored ID ${item.id} -> ${item.image}`);
  }
  
  // Get all case studies to verify
  const allStudies = await db.select({
    id: case_studies.id,
    clientName: case_studies.clientName,
    category: case_studies.category,
    image: case_studies.image
  }).from(case_studies);
  
  console.log('\nRestored case studies:');
  allStudies.forEach(s => {
    console.log(`${s.id}: ${s.clientName} (${s.category}) -> ${s.image}`);
  });
  
  process.exit(0);
}

restoreImages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
