export type CaseStudyRow = {
  id: number;
  title: string;
  slug: string;
  category: string;
  clientName: string;
  challenge: string;
  solution: string;
  result: string;
  testimonialQuote: string | null;
  image: string | null;
  published: number;
  featured: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export const FALLBACK_CASE_STUDIES: CaseStudyRow[] = [
  {
    id: -1,
    title: "Mining Engineer Secures Senior Role at BHP",
    slug: "mining-engineer-bhp-success",
    category: "Career Advancement",
    clientName: "Michelle T.",
    challenge: "Michelle had 8 years of experience in mining operations but her resume was overly technical and didn't highlight her leadership achievements. She was applying for senior roles at major mining companies but wasn't getting interviews despite her strong background.",
    solution: "We restructured Michelle's resume to lead with quantifiable achievements in safety improvements, cost reduction, and team leadership. We emphasized her experience with large-scale operations, regulatory compliance, and cross-functional collaboration. Her cover letter was tailored to BHP's values of sustainability and operational excellence.",
    result: "Within 3 weeks of receiving her new resume, Michelle secured interviews with three major mining companies including BHP, Rio Tinto, and Fortescue. She accepted a Senior Mining Engineer position at BHP with a 28% salary increase and relocation package to Western Australia.",
    testimonialQuote: "The team at All Résumé Services completely transformed how I presented my experience. The focus on achievements rather than duties made all the difference. I'm now in my dream role at BHP!",
    image: "/case-studies/mining-engineer.jpg",
    published: 1,
    featured: 1,
    viewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -2,
    title: "Banking Professional Transitions to Commonwealth Bank Leadership",
    slug: "banking-professional-commonwealth-bank",
    category: "Career Change Success",
    clientName: "Alexander L.",
    challenge: "Alexander had spent 6 years in retail banking at a smaller institution and wanted to move to one of the Big Four banks in a leadership capacity. His resume read like a job description and didn't showcase his customer service excellence or team management skills.",
    solution: "We created a compelling narrative around Alexander's customer satisfaction metrics (98% positive feedback), his success in mentoring junior staff, and his digital banking initiatives. We highlighted his compliance knowledge and risk management experience.",
    result: "Alexander received a LinkedIn message from a Commonwealth Bank recruiter within 2 weeks. After a successful interview process, he was offered a Team Leader position in their retail banking division with a 35% salary increase and comprehensive benefits package.",
    testimonialQuote: "I was skeptical about professional resume writing, but the results speak for themselves. The LinkedIn optimization was particularly valuable - that's how Commonwealth Bank found me!",
    image: "/case-studies/banking-professional.jpg",
    published: 1,
    featured: 1,
    viewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -3,
    title: "IT Professional Lands Cloud Architecture Role at Telstra",
    slug: "it-professional-telstra-cloud-architect",
    category: "Career Advancement",
    clientName: "Priya M.",
    challenge: "Priya had strong technical skills in cloud computing and network infrastructure but her resume was too technical for HR screeners and didn't pass ATS systems. She was applying for cloud architect roles at major telecommunications companies without success.",
    solution: "We created an ATS-optimized resume that balanced technical depth with business impact. We highlighted Priya's AWS and Azure certifications, her experience with large-scale cloud migrations, and her cost-saving achievements (reduced infrastructure costs by $2.1M annually).",
    result: "Priya's application was fast-tracked through Telstra's recruitment process. She received an interview within 5 days and was offered a Cloud Solutions Architect position with a competitive salary package, flexible working arrangements, and professional development budget.",
    testimonialQuote: "I had been applying for months with no luck. The ATS optimization made my resume actually get seen by hiring managers. Within weeks I had my dream job at Telstra!",
    image: "/case-studies/tech-professional.jpg",
    published: 1,
    featured: 1,
    viewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: -4,
    title: "Public Servant Promoted to Executive Level in Australian Government",
    slug: "public-servant-australian-government-executive",
    category: "Executive Promotion",
    clientName: "Rebecca W.",
    challenge: "Rebecca had been at the APS6 level for 5 years and wanted to move to Executive Level 1. Her application responses were too modest and didn't adequately demonstrate her leadership impact or policy development expertise. Government selection criteria require a specific approach that she was struggling with.",
    solution: "We worked with Rebecca to extract concrete examples of her policy achievements, stakeholder engagement, and team leadership. We crafted comprehensive selection criteria responses using the STAR method, emphasizing her strategic thinking, budget management, and change management experience.",
    result: "Rebecca's application stood out among 87 candidates. She was shortlisted and successfully interviewed for an Executive Level 1 position in the Department of Infrastructure. Her new role came with a $35,000 salary increase and expanded responsibilities across multiple divisions.",
    testimonialQuote: "Writing government selection criteria is an art form, and All Résumé Services are masters at it. They helped me showcase my achievements in a way that resonated with the selection panel.",
    image: "/case-studies/public-servant.jpg",
    published: 1,
    featured: 1,
    viewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function getFallbackCaseStudyBySlug(slug: string): CaseStudyRow | undefined {
  return FALLBACK_CASE_STUDIES.find(s => s.slug === slug);
}
