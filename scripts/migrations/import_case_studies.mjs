import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { case_studies } from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const caseStudiesData = [
  {
    title: "Transforming a Career Path into Mining Opportunities",
    slug: "transforming-career-path-mining-opportunities",
    category: "Career Change Success",
    clientName: "Howard",
    challenge: `Meet Howard, a dedicated professional with over ten years of experience in civil construction, who decided it was time for a bold career shift into FIFO (Fly-In-Fly-Out) mining roles. Despite fervently applying for positions, he found himself in the frustrating silence of rejection—no callbacks, no feedback.

Curious about the roadblocks he faced, I took a closer look at Howard's résumé. It became clear that it fell short of emphasizing the key attributes that mining employers were seeking. His machinery certifications, impressive safety record, and hands-on experience in on-site environments were buried under generic job descriptions.

Recognising that recruiters in the mining industry often juggle multiple applications and utilise Applicant Tracking Systems (ATS), I knew we needed to revamp his résumé. We worked collaboratively to highlight his technical proficiencies, recent project achievements, and robust safety background—elements that truly set him apart in a competitive field.`,
    solution: `The transformation was remarkable. With his newly polished résumé showcasing a compelling narrative of his skills and experience, Howard took a leap of faith and sent out his updated documents to potential employers.`,
    result: `The result? A flurry of interview invitations began to roll in, and before long, Howard landed an exciting FIFO role in Australia. His journey is a testament to the power of presenting oneself in the best light and ensuring that strengths resonate in a way that captures the attention of busy recruiters. With the right tools and guidance, a career pivot can lead to incredible new horizons.`,
    testimonialQuote: null,
    image: null,
    published: 1,
    featured: 1,
    viewCount: 0,
  },
  {
    title: "Mature-Age Jobseeker Overcoming Barriers",
    slug: "mature-age-jobseeker-overcoming-barriers",
    category: "Age Discrimination Success",
    clientName: "Mark",
    challenge: `Our customer Mark called me and was stressed about applying for jobs because of his age. He said he had been applying for months with no success, and his résumé just wasn't helping him. I explained that we don't put dates of birth or unnecessary old history in resumes, and that what HR really wants to see is whether you can do the job and bring value.`,
    solution: `We updated his résumé to focus on his recent achievements and presented his skills in a clear, modern format. We also prepared a strong cover letter that showed his experience was an asset, not a barrier. Soon after, Mark regained his confidence, landed interviews, and secured a role that suited his skills and gave us an exceptional testimonial.`,
    result: `Mark successfully overcame age discrimination concerns and landed a role that valued his extensive experience. His confidence was restored, and he provided us with an exceptional testimonial about how our services transformed his job search.`,
    testimonialQuote: "I was so stressed about my age holding me back, but after working with All Resume Services, I realized my experience is actually my greatest asset. The new resume opened doors I thought were closed forever.",
    image: null,
    published: 1,
    featured: 1,
    viewCount: 0,
  },
  {
    title: "Public Sector Success (STAR-aligned)",
    slug: "public-sector-success-star-aligned",
    category: "Government Application Success",
    clientName: "Elizabeth",
    challenge: `Elizabeth contacted us about a Queensland Health role and felt overwhelmed by the selection criteria. She told me she had no idea how to structure her responses and worried that her answers didn't sound "professional enough."

I explained that government applications require strict formatting in line with public sector guidelines. Sometimes this means using the STAR method — describing the "Situation, Task, Action, and Result" — but without writing those words into the response. Instead, it should read seamlessly like a story that demonstrates capability.`,
    solution: `We reworked her résumé to align with the advertised role, then crafted each selection criterion response using her own work examples. For instance, we showed how she had successfully managed difficult clients by explaining the challenge (Situation), her responsibility (Task), the strategies she used (Action), and the positive outcome (Result).`,
    result: `With her new application package, Elizabeth was shortlisted for interview and later offered the position. Her success demonstrates how proper structuring and professional presentation can make all the difference in competitive government recruitment processes.`,
    testimonialQuote: "I had no idea how to tackle selection criteria until All Resume Services showed me the way. The STAR method made so much sense once I saw it in action, and it got me the job!",
    image: null,
    published: 1,
    featured: 1,
    viewCount: 0,
  },
];

console.log('Importing case studies...');

for (const study of caseStudiesData) {
  try {
    await db.insert(case_studies).values({
      ...study,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✓ Imported: ${study.title}`);
  } catch (error) {
    console.error(`✗ Failed to import "${study.title}":`, error.message);
  }
}

console.log('\\nCase studies import complete!');
await connection.end();
