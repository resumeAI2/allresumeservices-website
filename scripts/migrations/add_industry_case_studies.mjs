import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { case_studies } from './drizzle/schema.ts';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const industryCaseStudies = [
  {
    title: 'Mining Engineer Lands $180K FIFO Role at Major Iron Ore Operation',
    slug: 'mining-engineer-180k-fifo-role',
    category: 'Mining & Resources Success',
    clientName: 'David',
    challenge: `David had been working in underground coal mining for 8 years but wanted to transition to the more lucrative iron ore FIFO sector in Western Australia. Despite his extensive experience with drill and blast operations, heavy mobile equipment, and mine planning, he was struggling to get interviews with major mining companies like BHP, Rio Tinto, and Fortescue.

His existing resume was too focused on coal-specific terminology and didn't highlight the transferable skills that iron ore operations valued. He also wasn't emphasising his clean safety record and high-risk work licences prominently enough—critical factors for FIFO roles.`,
    solution: `We completely restructured David's resume to target iron ore FIFO positions specifically. We prominently featured his safety statistics at the top (zero LTIs over 8 years, 15,000+ incident-free hours), highlighted his heavy mobile equipment tickets (haul truck, excavator, loader), and repositioned his drill and blast experience using terminology common in open-cut iron ore operations.

We also created a targeted cover letter that addressed his motivation for transitioning from coal to iron ore, emphasising his adaptability to roster patterns (7/7, 8/6, 14/14) and experience living in remote camp environments. The resume was optimised with ATS-friendly keywords specific to major mining companies' applicant tracking systems.`,
    result: `Within three weeks of submitting his new resume, David received interview invitations from three major iron ore operators. He accepted a Production Supervisor role at a Pilbara iron ore mine with a $180,000 package (including FIFO allowances), representing a 35% salary increase from his previous coal mining position.

David's new employer specifically mentioned that his resume stood out because of how clearly it presented his safety record and transferable technical skills. He's now working a 14/14 roster and loving the work-life balance FIFO provides.`,
    testimonialQuote: `"The team at All Resume Services completely transformed how I presented my mining experience. Within weeks I had multiple FIFO offers, and I'm now earning significantly more while working fewer days per year. Best investment I've made in my career."`,
    published: true,
    featured: true,
    createdAt: new Date('2025-11-15'),
  },
  {
    title: 'Registered Nurse Secures Clinical Nurse Consultant Role in Major Hospital',
    slug: 'registered-nurse-clinical-consultant-role',
    category: 'Healthcare Success',
    clientName: 'Sarah',
    challenge: `Sarah was an experienced Registered Nurse with 12 years in acute care settings, specialising in emergency and critical care. She wanted to move into a Clinical Nurse Consultant (CNC) role to advance her career, but her applications weren't getting through to interview stage.

Her resume read like a job description rather than showcasing her clinical leadership, quality improvement initiatives, and mentoring experience. She also wasn't effectively highlighting her postgraduate qualifications, AHPRA registration, and specialty certifications that are essential for senior nursing roles.`,
    solution: `We restructured Sarah's resume to emphasise her clinical leadership and quality improvement achievements. We created a dedicated "Clinical Leadership & Quality Improvement" section showcasing her work leading a falls prevention program that reduced patient falls by 40%, mentoring 15+ graduate nurses, and implementing evidence-based practice changes.

We repositioned her AHPRA registration, postgraduate certificate in critical care, and specialty certifications (ACLS, TNCC, trauma nursing) prominently at the top. We also used healthcare-specific keywords and terminology that align with NSW Health and other major hospital networks' selection criteria.`,
    result: `Sarah received interview invitations for three Clinical Nurse Consultant positions within five weeks. She accepted a CNC role in the Emergency Department of a major metropolitan hospital with a $115,000 salary—a $20,000 increase from her previous RN position.

The interview panel specifically praised how her resume clearly demonstrated her clinical leadership experience and quality improvement outcomes. Sarah is now leading a team of 12 nurses and driving clinical excellence initiatives across the department.`,
    testimonialQuote: `"I'd been applying for CNC roles for over a year with no success. After working with All Resume Services, I had three interviews within a month. They knew exactly how to present my clinical leadership experience in a way that resonated with hospital recruiters."`,
    published: true,
    featured: true,
    createdAt: new Date('2025-11-20'),
  },
  {
    title: 'APS Officer Promoted to Executive Level 1 in Federal Government',
    slug: 'aps-officer-executive-level-promotion',
    category: 'Government Application Success',
    clientName: 'Michael',
    challenge: `Michael had been working as an APS6 policy officer in a federal government department for 6 years and was ready to move into an Executive Level 1 (EL1) role. However, his applications were consistently unsuccessful, and he wasn't receiving feedback on why.

His selection criteria responses were too generic and didn't provide specific examples using the STAR method. He also wasn't effectively demonstrating how his work aligned with the APS Integrated Leadership System and the department's strategic priorities. His resume didn't showcase his policy development achievements or stakeholder management experience at a senior level.`,
    solution: `We completely rewrote Michael's selection criteria responses using the STAR method, providing detailed, specific examples of his policy work. For instance, we described how he led a cross-agency working group (Situation), was tasked with developing new regulatory framework (Task), consulted with 20+ stakeholders and drafted cabinet submission (Action), resulting in legislation passed through Parliament (Result).

We restructured his resume to align with the APS Integrated Leadership System capability framework, highlighting his achievements in policy development, stakeholder engagement, and team leadership. We also created a compelling cover letter that demonstrated his understanding of the department's strategic direction and how his experience positioned him to contribute at the EL1 level.`,
    result: `Michael was shortlisted for two EL1 positions and successfully secured an Executive Level 1 role in his preferred department with a $135,000 salary—a $25,000 increase. The selection panel noted that his application stood out because of the specific, measurable examples he provided and how clearly he demonstrated EL1-level capabilities.

Michael is now leading a team of four policy officers and managing high-priority government initiatives. He credits his success to how his application materials were tailored to government selection processes.`,
    testimonialQuote: `"After years of unsuccessful EL1 applications, I finally understood what selection panels were looking for. The STAR method examples and capability framework alignment made all the difference. I'm now in my dream executive role."`,
    published: true,
    featured: true,
    createdAt: new Date('2025-11-25'),
  },
  {
    title: 'Software Engineer Joins Leading Tech Company with 40% Salary Increase',
    slug: 'software-engineer-tech-company-salary-increase',
    category: 'IT & Technology Success',
    clientName: 'James',
    challenge: `James was a mid-level software engineer with 5 years of experience in full-stack development, but he was stuck in a role that didn't challenge him technically or compensate him fairly. He wanted to join one of Australia's leading tech companies but wasn't getting past the initial screening stage.

His resume was too focused on day-to-day responsibilities rather than showcasing his technical achievements, open-source contributions, and problem-solving abilities. He also wasn't effectively highlighting his modern tech stack experience (React, Node.js, AWS, Docker, Kubernetes) or his experience with Agile/DevOps practices that tech companies value.`,
    solution: `We completely restructured James's resume to focus on technical achievements and impact. We created a "Key Technical Achievements" section highlighting how he architected a microservices platform that reduced deployment time by 70%, optimised database queries that improved application performance by 3x, and led the migration to AWS cloud infrastructure.

We prominently featured his tech stack with specific versions and years of experience, showcased his GitHub contributions (including a popular open-source library with 500+ stars), and highlighted his experience with CI/CD pipelines, test-driven development, and Agile methodologies. We also tailored his resume to use keywords from tech company job descriptions and ATS systems.`,
    result: `James received interview requests from four leading Australian tech companies within three weeks, including Atlassian, Canva, and two major fintech startups. He accepted a Senior Software Engineer role at a high-growth tech company with a $160,000 package (including equity)—a 40% increase from his previous $115,000 salary.

The hiring manager specifically mentioned that James's resume stood out because it clearly demonstrated his technical depth, problem-solving abilities, and modern development practices. James is now working on cutting-edge projects with a talented engineering team and has significant career growth opportunities.`,
    testimonialQuote: `"I was undervaluing myself and not presenting my technical skills effectively. All Resume Services helped me showcase my achievements in a way that resonated with tech recruiters. The salary increase alone paid for their service 50 times over."`,
    published: true,
    featured: true,
    createdAt: new Date('2025-11-28'),
  },
];

async function addIndustryCaseStudies() {
  try {
    console.log('Adding industry-specific case studies...');
    
    for (const study of industryCaseStudies) {
      await db.insert(case_studies).values(study);
      console.log(`✓ Added: ${study.title}`);
    }
    
    console.log(`\n✅ Successfully added ${industryCaseStudies.length} industry-specific case studies!`);
  } catch (error) {
    console.error('Error adding case studies:', error);
  } finally {
    await connection.end();
  }
}

addIndustryCaseStudies();
