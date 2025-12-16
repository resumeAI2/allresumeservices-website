import { getDb } from '../server/db';
import { case_studies } from '../drizzle/schema';
import { eq, like, or, inArray } from 'drizzle-orm';

// Update all case studies to use industry-specific images without people
async function updateImages() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }
  
  console.log('Updating ALL case study images to industry-specific images (no people)...\n');
  
  // Update specific case studies by ID with appropriate industry images
  const updates = [
    // Career Change Success / General - use desk workspace
    { id: 1, image: '/case-studies/desk-workspace.jpg' }, // Howard - Career Change
    { id: 2, image: '/case-studies/desk-workspace.jpg' }, // Mark - Age Discrimination (mature professional)
    { id: 3, image: '/case-studies/government-building.jpg' }, // Elizabeth - Government
    
    // Mining
    { id: 30001, image: '/case-studies/mining-hardhat.jpg' }, // David - Mining
    
    // Healthcare
    { id: 30002, image: '/case-studies/stethoscope-healthcare.jpg' }, // Sarah - Healthcare
    
    // Government
    { id: 30003, image: '/case-studies/government-building.jpg' }, // Michael - Government
    
    // IT & Technology
    { id: 30004, image: '/case-studies/software-code.jpg' }, // James - IT
    
    // Engineering
    { id: 60001, image: '/case-studies/engineering-tools.jpg' }, // Michael T - Mining Engineer
    
    // Finance/Banking
    { id: 60002, image: '/case-studies/finance-charts.jpg' }, // Sarah L - Banking
    
    // Retail
    { id: 60003, image: '/case-studies/retail-bags.jpg' }, // David K - Retail
    
    // Software
    { id: 60004, image: '/case-studies/software-code.jpg' }, // Priya M - Software
    
    // Aviation
    { id: 60005, image: '/case-studies/aviation-instruments.jpg' }, // James R - Aviation
    
    // Government/Public Sector
    { id: 60006, image: '/case-studies/government-building.jpg' }, // Rebecca W - Public Sector
    
    // Finance
    { id: 60007, image: '/case-studies/finance-charts.jpg' }, // Thomas H - Finance
    
    // Project Management
    { id: 60008, image: '/case-studies/desk-workspace.jpg' }, // Amanda C - Project Manager
    
    // Banking
    { id: 60009, image: '/case-studies/finance-charts.jpg' }, // Daniel P - Banking
  ];
  
  for (const update of updates) {
    await db.update(case_studies)
      .set({ image: update.image })
      .where(eq(case_studies.id, update.id));
    console.log(`Updated ID ${update.id} -> ${update.image}`);
  }
  
  // Get all case studies to verify
  const allStudies = await db.select({
    id: case_studies.id,
    clientName: case_studies.clientName,
    category: case_studies.category,
    image: case_studies.image
  }).from(case_studies);
  
  console.log('\nFinal case studies:');
  allStudies.forEach(s => {
    console.log(`${s.id}: ${s.clientName} (${s.category}) -> ${s.image}`);
  });
  
  process.exit(0);
}

updateImages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
