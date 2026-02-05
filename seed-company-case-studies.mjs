import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { case_studies } from './drizzle/schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const caseStudiesToInsert = [
  {
    title: "Mining Engineer Secures Senior Role at BHP",
    slug: "mining-engineer-bhp-success",
    category: "Career Advancement",
    clientName: "Michelle T.",
    challenge: "Michelle had 8 years of experience in mining operations but her resume was overly technical and didn't highlight her leadership achievements. She was applying for senior roles at major mining companies but wasn't getting interviews despite her strong background.",
    solution: "We restructured Michelle's resume to lead with quantifiable achievements in safety improvements, cost reduction, and team leadership. We emphasized her experience with large-scale operations, regulatory compliance, and cross-functional collaboration. Her cover letter was tailored to BHP's values of sustainability and operational excellence.",
    result: "Within 3 weeks of receiving her new resume, Michelle secured interviews with three major mining companies including BHP, Rio Tinto, and Fortescue. She accepted a Senior Mining Engineer position at BHP with a 28% salary increase and relocation package to Western Australia.",
    testimonialQuote: "The team at All Resume Services completely transformed how I presented my experience. The focus on achievements rather than duties made all the difference. I'm now in my dream role at BHP!",
    image: null,
    beforeResumeImage: null,
    afterResumeImage: null,
    published: 1,
    featured: 1,
  },
  {
    title: "Banking Professional Transitions to Commonwealth Bank Leadership",
    slug: "banking-professional-commonwealth-bank",
    category: "Career Change Success",
    clientName: "Alexander L.",
    challenge: "Alexander had spent 6 years in retail banking at a smaller institution and wanted to move to one of the Big Four banks in a leadership capacity. His resume read like a job description and didn't showcase his customer service excellence or team management skills.",
    solution: "We created a compelling narrative around Alexander's customer satisfaction metrics (98% positive feedback), his success in mentoring junior staff, and his digital banking initiatives. We highlighted his compliance knowledge and risk management experience, which are critical for Commonwealth Bank roles. His LinkedIn profile was optimized to attract recruiter attention.",
    result: "Alexander received a LinkedIn message from a Commonwealth Bank recruiter within 2 weeks. After a successful interview process, he was offered a Team Leader position in their retail banking division with a 35% salary increase and comprehensive benefits package.",
    testimonialQuote: "I was skeptical about professional resume writing, but the results speak for themselves. The LinkedIn optimization was particularly valuable - that's how Commonwealth Bank found me!",
    image: null,
    beforeResumeImage: null,
    afterResumeImage: null,
    published: 1,
    featured: 1,
  },
  {
    title: "Retail Manager Advances to Woolworths Regional Leadership",
    slug: "retail-manager-woolworths-regional-role",
    category: "Executive Promotion",
    clientName: "David K.",
    challenge: "David had 12 years of retail management experience across various chains but his resume was cluttered with outdated information and didn't emphasize his strategic planning abilities. He was targeting regional management roles but his applications were being overlooked.",
    solution: "We streamlined David's resume to focus on the last 10 years, highlighting his P&L management, inventory optimization, and staff development achievements. We quantified his impact: reducing shrinkage by 23%, improving staff retention by 40%, and increasing store profitability by 18%. His executive summary positioned him as a strategic retail leader.",
    result: "David's new resume opened doors immediately. He was shortlisted for regional management positions at both Woolworths and Coles. He accepted a Regional Manager role at Woolworths overseeing 12 stores, with a salary package exceeding $150,000 plus bonuses.",
    testimonialQuote: "The difference between my old resume and the new one was night and day. All Resume Services knew exactly how to position me for senior leadership roles. Highly recommended!",
    image: null,
    beforeResumeImage: null,
    afterResumeImage: null,
    published: 1,
    featured: 1,
  },
  {
    title: "IT Professional Lands Cloud Architecture Role at Telstra",
    slug: "it-professional-telstra-cloud-architect",
    category: "Career Advancement",
    clientName: "Priya M.",
    challenge: "Priya had strong technical skills in cloud computing and network infrastructure but her resume was too technical for HR screeners and didn't pass ATS systems. She was applying for cloud architect roles at major telecommunications companies without success.",
    solution: "We created an ATS-optimized resume that balanced technical depth with business impact. We highlighted Priya's AWS and Azure certifications, her experience with large-scale cloud migrations, and her cost-saving achievements (reduced infrastructure costs by $2.1M annually). We also crafted a compelling cover letter emphasizing her alignment with Telstra's digital transformation goals.",
    result: "Priya's application was fast-tracked through Telstra's recruitment process. She received an interview within 5 days and was offered a Cloud Solutions Architect position with a competitive salary package, flexible working arrangements, and professional development budget.",
    testimonialQuote: "I had been applying for months with no luck. The ATS optimization made my resume actually get seen by hiring managers. Within weeks I had my dream job at Telstra!",
    image: null,
    beforeResumeImage: null,
    afterResumeImage: null,
    published: 1,
    featured: 1,
  },
  {
    title: "Aviation Professional Secures Management Role at Qantas",
    slug: "aviation-professional-qantas-management",
    category: "Career Advancement",
    clientName: "James R.",
    challenge: "James had 10 years of experience in airport operations and ground services but his resume didn't effectively communicate his leadership capabilities or safety record. He was targeting management positions at Qantas but wasn't getting past the initial screening.",
    solution: "We repositioned James's resume to emphasize his perfect safety record, operational efficiency improvements, and crisis management experience. We highlighted his experience managing teams of 50+ staff, his cost optimization initiatives, and his customer service excellence metrics. His selection criteria responses were tailored to Qantas's core values.",
    result: "James was invited to interview for an Operations Manager role at Qantas Sydney Airport. His well-prepared selection criteria and professional resume impressed the interview panel. He was offered the position with a significant salary increase and career progression opportunities.",
    testimonialQuote: "The selection criteria writing service was exceptional. All Resume Services understood exactly what Qantas was looking for and helped me articulate my experience perfectly.",
    image: null,
    beforeResumeImage: null,
    afterResumeImage: null,
    published: 1,
    featured: 1,
  },
  {
    title: "Public Servant Promoted to Executive Level in Australian Government",
    slug: "public-servant-australian-government-executive",
    category: "Executive Promotion",
    clientName: "Rebecca W.",
    challenge: "Rebecca had been at the APS6 level for 5 years and wanted to move to Executive Level 1. Her application responses were too modest and didn't adequately demonstrate her leadership impact or policy development expertise. Government selection criteria require a specific approach that she was struggling with.",
    solution: "We worked with Rebecca to extract concrete examples of her policy achievements, stakeholder engagement, and team leadership. We crafted comprehensive selection criteria responses using the STAR method, emphasizing her strategic thinking, budget management, and change management experience. Her resume was reformatted to meet government standards while highlighting executive-level competencies.",
    result: "Rebecca's application stood out among 87 candidates. She was shortlisted and successfully interviewed for an Executive Level 1 position in the Department of Infrastructure. Her new role came with a $35,000 salary increase and expanded responsibilities across multiple divisions.",
    testimonialQuote: "Writing government selection criteria is an art form, and All Resume Services are masters at it. They helped me showcase my achievements in a way that resonated with the selection panel.",
    image: null,
    beforeResumeImage: null,
    afterResumeImage: null,
    published: 1,
    featured: 1,
  },
  {
    title: "Finance Professional Joins ANZ Bank Investment Team",
    slug: "finance-professional-anz-investment-banking",
    category: "Career Change Success",
    clientName: "Thomas H.",
    challenge: "Thomas had a strong background in corporate finance but wanted to transition into investment banking. His resume was too focused on his current role and didn't highlight transferable skills relevant to investment banking. He needed to demonstrate financial modeling, deal experience, and analytical capabilities.",
    solution: "We repositioned Thomas's experience to emphasize his M&A analysis, financial modeling, and due diligence work. We highlighted his CFA qualification, his experience with complex financial transactions, and his client relationship management skills. His cover letter articulated his passion for investment banking and his understanding of ANZ's market position.",
    result: "Thomas's targeted application caught the attention of ANZ's recruitment team. He was invited to complete case studies and attend multiple rounds of interviews. He was ultimately offered an Associate position in ANZ's Investment Banking division with an attractive compensation package including performance bonuses.",
    testimonialQuote: "Making a career transition is challenging, but All Resume Services helped me position my experience in a way that made sense for investment banking. I'm thrilled to be at ANZ!",
    image: null,
    beforeResumeImage: null,
    afterResumeImage: null,
    published: 1,
    featured: 1,
  },
  {
    title: "Project Manager Secures Senior Role at Rio Tinto",
    slug: "project-manager-rio-tinto-senior-role",
    category: "Career Advancement",
    clientName: "Amanda C.",
    challenge: "Amanda had extensive project management experience in construction but wanted to transition to mining sector project management. Her resume was generic and didn't emphasize her experience with large capital projects, stakeholder management, or her PMP certification.",
    solution: "We created a targeted resume highlighting Amanda's experience managing $50M+ projects, her track record of on-time and under-budget delivery, and her expertise in risk management. We emphasized her experience with remote site operations, environmental compliance, and indigenous stakeholder engagement - all critical for Rio Tinto roles.",
    result: "Amanda's application was shortlisted for a Senior Project Manager role at Rio Tinto's Pilbara operations. Her interview performance, supported by her professional resume and detailed project portfolio, secured her the position with a substantial salary increase and FIFO arrangements.",
    testimonialQuote: "All Resume Services helped me make a successful sector transition. They understood what Rio Tinto was looking for and positioned my experience perfectly.",
    image: null,
    beforeResumeImage: null,
    afterResumeImage: null,
    published: 1,
    featured: 1,
  },
  {
    title: "Banking Analyst Advances to Westpac Corporate Banking",
    slug: "banking-analyst-westpac-corporate-banking",
    category: "Career Advancement",
    clientName: "Daniel P.",
    challenge: "Daniel had 4 years of experience as a banking analyst but his resume was too technical and didn't showcase his client relationship skills or business development capabilities. He was targeting corporate banking roles but wasn't differentiating himself from other candidates.",
    solution: "We restructured Daniel's resume to highlight his client portfolio growth (increased assets under management by 45%), his credit analysis expertise, and his cross-selling success. We emphasized his understanding of complex corporate structures, his risk assessment capabilities, and his relationship management skills. His LinkedIn profile was optimized to showcase thought leadership.",
    result: "Daniel received multiple interview requests, including from Westpac's Corporate Banking division. His professional presentation and well-articulated career goals impressed the interview panel. He was offered a Relationship Manager position with a 30% salary increase and clear progression pathway.",
    testimonialQuote: "The resume and LinkedIn optimization package was worth every dollar. I went from being ignored to having multiple offers. Thank you All Resume Services!",
    image: null,
    beforeResumeImage: null,
    afterResumeImage: null,
    published: 1,
    featured: 1,
  },
];

console.log('Starting to insert case studies...');

for (const caseStudy of caseStudiesToInsert) {
  try {
    await db.insert(case_studies).values(caseStudy);
    console.log(`✓ Inserted: ${caseStudy.title}`);
  } catch (error) {
    console.error(`✗ Failed to insert ${caseStudy.title}:`, error.message);
  }
}

console.log('\nCase studies seeding completed!');
await connection.end();
