import { getDb } from './server/db';
import { blog_posts } from './drizzle/schema';

const blogPostsData = [
  {
    title: "Transform Your Resume with Powerful Action Verbs",
    slug: "transform-your-resume-with-powerful-action-verbs",
    excerpt: "Learn how strategic action verbs can transform your resume from ordinary to extraordinary, capturing recruiters' attention and showcasing your achievements effectively.",
    category: "Resume Tips",
    image: "/blog/resume-action-verbs.jpg",
    published: 1,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    readTime: "5 min read",
    content: `<h2>Why Action Verbs Matter in Your Resume</h2>
<p>Your resume is often the first impression you make on a potential employer. Using powerful action verbs can significantly enhance how your experience and achievements are perceived.</p>`
  },
  {
    title: "Stand Out with Top-notch Senior Management Resume Services",
    slug: "stand-out-with-top-notch-senior-management-resume-services",
    excerpt: "Discover how professional senior management resume services can help executives showcase their leadership experience and secure C-suite positions.",
    category: "Resume Tips",
    image: "/blog/senior-management.jpg",
    published: 1,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    readTime: "6 min read",
    content: `<h2>The Executive Resume Challenge</h2>
<p>Senior management positions require resumes that go beyond listing responsibilities.</p>`
  },
  {
    title: "Write Winning Selection Criteria for Government Roles Today!",
    slug: "write-winning-selection-criteria-for-government-roles",
    excerpt: "Master the art of writing compelling selection criteria responses that demonstrate your suitability for Australian government positions.",
    category: "Selection Criteria",
    image: "/blog/selection-criteria.jpg",
    published: 1,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    readTime: "7 min read",
    content: `<h2>Understanding Selection Criteria</h2>
<p>Selection criteria are specific skills, knowledge, and experience requirements that government agencies use to assess candidates.</p>`
  },
  {
    title: "Ace Your Next Interview with Expert Preparation Tips",
    slug: "ace-your-next-interview-with-expert-preparation-tips",
    excerpt: "Learn proven interview preparation strategies that help you confidently showcase your skills and land your dream job.",
    category: "Interview Tips",
    image: "/blog/interview-prep.jpg",
    published: 1,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
    readTime: "8 min read",
    content: `<h2>Pre-Interview Research</h2>
<p>Thorough preparation begins with comprehensive research about the company, role, and industry.</p>`
  },
  {
    title: "LinkedIn Profile Optimization: Your Digital First Impression",
    slug: "linkedin-profile-optimization-digital-first-impression",
    excerpt: "Transform your LinkedIn profile into a powerful personal brand that attracts recruiters and creates career opportunities.",
    category: "LinkedIn",
    image: "/blog/linkedin-optimization.jpg",
    published: 1,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
    readTime: "9 min read",
    content: `<h2>Why LinkedIn Optimization Matters</h2>
<p>Your LinkedIn profile is often the first professional impression you make.</p>`
  },
  {
    title: "Cover Letter Mistakes That Cost You Job Interviews",
    slug: "cover-letter-mistakes-cost-job-interviews",
    excerpt: "Avoid these common cover letter pitfalls that prevent you from landing interviews, even with a strong resume.",
    category: "Cover Letters",
    image: "/blog/cover-letter-mistakes.jpg",
    published: 1,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20"),
    readTime: "6 min read",
    content: `<h2>The Importance of Cover Letters</h2>
<p>Despite common misconceptions, cover letters remain crucial in the job application process.</p>`
  },
  {
    title: "ATS-Friendly Resume Formatting: Beat the Bots",
    slug: "ats-friendly-resume-formatting-beat-the-bots",
    excerpt: "Learn how to format your resume to pass Applicant Tracking Systems while maintaining visual appeal for human readers.",
    category: "Resume Tips",
    image: "/blog/ats-formatting.jpg",
    published: 1,
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-02-25"),
    readTime: "7 min read",
    content: `<h2>Understanding Applicant Tracking Systems</h2>
<p>Over 90% of large companies use ATS to screen resumes before human eyes see them.</p>`
  },
  {
    title: "Career Change Resume: Successfully Pivot Your Professional Path",
    slug: "career-change-resume-successfully-pivot",
    excerpt: "Navigate career transitions with a resume that highlights transferable skills and positions you for success in a new industry.",
    category: "Career Advice",
    image: "/blog/career-change.jpg",
    published: 1,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
    readTime: "10 min read",
    content: `<h2>The Career Change Challenge</h2>
<p>Changing careers can feel daunting, especially when your resume doesn't obviously align with your target role.</p>`
  },
  {
    title: "Resume Length: How Long Should Your Resume Really Be?",
    slug: "resume-length-how-long-should-it-be",
    excerpt: "Discover the optimal resume length for your career stage and learn when to use one page versus multiple pages.",
    category: "Resume Tips",
    image: "/blog/resume-length.jpg",
    published: 1,
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
    readTime: "8 min read",
    content: `<h2>The Resume Length Debate</h2>
<p>One of the most common questions job seekers ask is: "How long should my resume be?"</p>`
  }
];

async function migrateBlogPosts() {
  console.log('Starting blog post migration...');
  
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }
  
  for (const post of blogPostsData) {
    try {
      await db.insert(blog_posts).values(post);
      console.log(`✓ Migrated: ${post.title}`);
    } catch (error: any) {
      console.error(`✗ Failed to migrate: ${post.title}`, error.message);
    }
  }
  
  console.log('Migration complete!');
  process.exit(0);
}

migrateBlogPosts();
