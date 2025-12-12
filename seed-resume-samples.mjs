import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { resume_samples } from './drizzle/schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const resumeSamples = [
  {
    title: "Executive Leadership Transformation - David Miller",
    industry: "Management",
    beforeImage: "/resume-samples/before-executive-david-miller.png",
    afterImage: "/resume-samples/after-executive-david-miller.jpg",
    description: "Transformed a basic executive resume into a comprehensive leadership profile showcasing strategic competencies, key attributes, and measurable achievements. Enhanced visual hierarchy and professional presentation to attract C-suite opportunities.",
    improvements: JSON.stringify([
      "Added comprehensive competencies section highlighting strategic planning and business development",
      "Developed detailed key attributes with quantifiable achievements",
      "Enhanced visual design with professional formatting and clear sections",
      "Incorporated industry-specific keywords for ATS optimization",
      "Structured content to emphasize leadership impact and business results"
    ]),
    sortOrder: 1
  },
  {
    title: "Construction & FIFO Professional - Greg Read",
    industry: "Construction",
    beforeImage: "/resume-samples/before-construction-greg-read.png",
    afterImage: "/resume-samples/after-construction-greg-read.jpg",
    description: "Elevated a simple FIFO worker resume into a comprehensive professional profile highlighting technical proficiency, safety focus, and operational leadership. Modern design with clear sections for certifications and key attributes.",
    improvements: JSON.stringify([
      "Created detailed profile showcasing technical skills and safety commitment",
      "Added comprehensive key attributes section with specific competencies",
      "Highlighted relevant certifications and training prominently",
      "Improved visual layout with modern design and clear information hierarchy",
      "Emphasized safety focus and operational excellence for mining/construction roles"
    ]),
    sortOrder: 2
  }
];

console.log('Seeding resume samples...');

for (const sample of resumeSamples) {
  try {
    await db.insert(resume_samples).values({
      title: sample.title,
      industry: sample.industry,
      beforeImage: sample.beforeImage,
      afterImage: sample.afterImage,
      description: sample.description,
      improvements: sample.improvements,
      sortOrder: sample.sortOrder
    });
    console.log(`✓ Added: ${sample.title}`);
  } catch (error) {
    console.error(`✗ Error adding ${sample.title}:`, error.message);
  }
}

console.log('\nResume samples seeding complete!');
await connection.end();
