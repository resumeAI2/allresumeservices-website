const { drizzle } = require('drizzle-orm/mysql2');
const { blog_posts } = require('./drizzle/schema');

const blogPostsData = [
  {
    title: "Transform Your Resume with Powerful Action Verbs",
    slug: "transform-your-resume-with-powerful-action-verbs",
    excerpt: "Learn how strategic action verbs can transform your resume from ordinary to extraordinary, capturing recruiters' attention and showcasing your achievements effectively.",
    category: "Resume Tips",
    image: "/blog/resume-action-verbs.jpg",
    published: 1,
    createdAt: new Date("2024-01-15"),
    content: `<h2>Why Action Verbs Matter in Your Resume</h2>
<p>Your resume is often the first impression you make on a potential employer. Using powerful action verbs can significantly enhance how your experience and achievements are perceived. Instead of passive descriptions, action verbs create a dynamic narrative that showcases your capabilities and accomplishments.</p>

<h2>Categories of Powerful Action Verbs</h2>

<h3>Leadership & Management</h3>
<ul>
<li>Directed</li>
<li>Orchestrated</li>
<li>Spearheaded</li>
<li>Championed</li>
<li>Mobilized</li>
</ul>

<h3>Achievement & Results</h3>
<ul>
<li>Achieved</li>
<li>Exceeded</li>
<li>Surpassed</li>
<li>Delivered</li>
<li>Accomplished</li>
</ul>

<h3>Innovation & Creativity</h3>
<ul>
<li>Pioneered</li>
<li>Innovated</li>
<li>Conceptualized</li>
<li>Designed</li>
<li>Revolutionized</li>
</ul>

<h2>Before and After Examples</h2>
<p><strong>Before:</strong> Was responsible for managing a team of 10 sales representatives.</p>
<p><strong>After:</strong> Led and mentored a high-performing team of 10 sales representatives, achieving 125% of quarterly targets.</p>

<p><strong>Before:</strong> Worked on improving customer satisfaction.</p>
<p><strong>After:</strong> Spearheaded customer experience initiatives that elevated satisfaction scores by 35% within six months.</p>

<h2>Tips for Using Action Verbs Effectively</h2>
<ol>
<li><strong>Be Specific:</strong> Choose verbs that accurately describe your role and contributions</li>
<li><strong>Vary Your Language:</strong> Avoid repetition by using different verbs throughout your resume</li>
<li><strong>Quantify Results:</strong> Pair action verbs with measurable outcomes whenever possible</li>
<li><strong>Match the Job:</strong> Align your verb choices with the language used in the job description</li>
<li><strong>Stay Authentic:</strong> Only use verbs that truthfully represent your experience</li>
</ol>

<h2>Common Mistakes to Avoid</h2>
<ul>
<li>Overusing buzzwords without substance</li>
<li>Using passive voice ("was responsible for" instead of "managed")</li>
<li>Choosing verbs that don't match your actual role</li>
<li>Repeating the same verbs throughout your resume</li>
</ul>

<h2>Conclusion</h2>
<p>Transforming your resume with powerful action verbs is a simple yet effective way to stand out in a competitive job market. By carefully selecting verbs that accurately represent your achievements and capabilities, you create a compelling narrative that captures recruiters' attention and demonstrates your value as a candidate.</p>`
  },
  {
    title: "Stand Out with Top-notch Senior Management Resume Services",
    slug: "stand-out-with-top-notch-senior-management-resume-services",
    excerpt: "Discover how professional senior management resume services can help executives showcase their leadership experience and secure C-suite positions.",
    category: "Resume Tips",
    image: "/blog/senior-management.jpg",
    published: 1,
    createdAt: new Date("2024-01-20"),
    content: `<h2>The Executive Resume Challenge</h2>
<p>Senior management positions require resumes that go beyond listing responsibilities. Your resume must demonstrate strategic thinking, leadership impact, and measurable business results that resonate with board members and executive recruiters.</p>

<h2>What Makes a Senior Management Resume Different</h2>
<p>Executive resumes require a unique approach that highlights:</p>
<ul>
<li>Strategic vision and business acumen</li>
<li>P&L responsibility and financial impact</li>
<li>Change management and transformation initiatives</li>
<li>Board-level communication and stakeholder management</li>
<li>Industry expertise and thought leadership</li>
</ul>

<h2>Key Components of an Executive Resume</h2>

<h3>Executive Summary</h3>
<p>A powerful opening that captures your unique value proposition and career highlights in 3-4 compelling sentences.</p>

<h3>Core Competencies</h3>
<p>Strategic keywords and skills that align with C-suite requirements and pass ATS screening.</p>

<h3>Professional Experience</h3>
<p>Achievement-focused narratives that demonstrate business impact through metrics and outcomes.</p>

<h3>Board Positions & Advisory Roles</h3>
<p>Governance experience and strategic advisory contributions that showcase leadership beyond operational roles.</p>

<h2>Why Professional Services Matter</h2>
<p>Professional senior management resume services provide:</p>
<ul>
<li>Executive-level writing expertise</li>
<li>Industry-specific knowledge and terminology</li>
<li>Understanding of executive recruitment processes</li>
<li>Strategic positioning for career advancement</li>
<li>Confidential and personalized service</li>
</ul>

<h2>The ROI of Professional Resume Services</h2>
<p>Investing in professional resume services for senior management positions typically results in:</p>
<ul>
<li>Faster job search timelines</li>
<li>Higher-quality interview opportunities</li>
<li>Better salary negotiations</li>
<li>Enhanced professional brand</li>
<li>Increased confidence in career transitions</li>
</ul>`
  },
  {
    title: "Write Winning Selection Criteria for Government Roles Today!",
    slug: "write-winning-selection-criteria-for-government-roles",
    excerpt: "Master the art of writing compelling selection criteria responses that demonstrate your suitability for Australian government positions.",
    category: "Selection Criteria",
    image: "/blog/selection-criteria.jpg",
    published: 1,
    createdAt: new Date("2024-02-01"),
    content: `<h2>Understanding Selection Criteria</h2>
<p>Selection criteria are specific skills, knowledge, and experience requirements that government agencies use to assess candidates. Your responses must demonstrate how you meet each criterion using concrete examples from your career.</p>

<h2>The STAR Method</h2>
<p>Use the STAR framework to structure compelling responses:</p>
<ul>
<li><strong>Situation:</strong> Set the context for your example</li>
<li><strong>Task:</strong> Describe your responsibility or challenge</li>
<li><strong>Action:</strong> Explain the steps you took</li>
<li><strong>Result:</strong> Highlight the outcomes and impact</li>
</ul>

<h2>Common Selection Criteria Categories</h2>

<h3>Communication Skills</h3>
<p>Demonstrate your ability to communicate effectively across different audiences and formats.</p>

<h3>Stakeholder Management</h3>
<p>Show how you build and maintain relationships with diverse stakeholders.</p>

<h3>Problem Solving</h3>
<p>Provide examples of analytical thinking and creative solutions.</p>

<h3>Leadership</h3>
<p>Illustrate your ability to lead teams and drive change.</p>

<h2>Writing Tips for Success</h2>
<ol>
<li>Address each criterion separately and explicitly</li>
<li>Use specific examples with measurable outcomes</li>
<li>Incorporate relevant keywords from the position description</li>
<li>Keep responses concise (typically 250-400 words per criterion)</li>
<li>Proofread carefully for grammar and clarity</li>
</ol>

<h2>Common Mistakes to Avoid</h2>
<ul>
<li>Generic responses that could apply to anyone</li>
<li>Focusing on team achievements without highlighting your role</li>
<li>Exceeding word limits or being too brief</li>
<li>Using jargon without explanation</li>
<li>Failing to address all aspects of the criterion</li>
</ul>`
  },
  {
    title: "Ace Your Next Interview with Expert Preparation Tips",
    slug: "ace-your-next-interview-with-expert-preparation-tips",
    excerpt: "Learn proven interview preparation strategies that help you confidently showcase your skills and land your dream job.",
    category: "Interview Tips",
    image: "/blog/interview-prep.jpg",
    published: 1,
    createdAt: new Date("2024-02-10"),
    content: `<h2>Pre-Interview Research</h2>
<p>Thorough preparation begins with comprehensive research about the company, role, and industry. Understanding the organization's culture, recent achievements, and challenges allows you to tailor your responses effectively.</p>

<h2>Essential Preparation Steps</h2>
<ul>
<li>Review the job description and identify key requirements</li>
<li>Research the company's mission, values, and recent news</li>
<li>Prepare specific examples using the STAR method</li>
<li>Practice common interview questions aloud</li>
<li>Prepare thoughtful questions for the interviewer</li>
</ul>

<h2>Common Interview Questions</h2>

<h3>Tell Me About Yourself</h3>
<p>Craft a concise professional narrative that highlights relevant experience and career progression.</p>

<h3>Why Do You Want This Role?</h3>
<p>Connect your career goals with the position's opportunities and the company's mission.</p>

<h3>What Are Your Strengths?</h3>
<p>Choose strengths relevant to the role and support them with specific examples.</p>

<h3>Describe a Challenge You Overcame</h3>
<p>Use the STAR method to demonstrate problem-solving and resilience.</p>

<h2>Body Language and Presentation</h2>
<ul>
<li>Maintain appropriate eye contact</li>
<li>Use confident posture and gestures</li>
<li>Speak clearly and at a moderate pace</li>
<li>Dress professionally for the company culture</li>
<li>Arrive 10-15 minutes early</li>
</ul>

<h2>Virtual Interview Tips</h2>
<ul>
<li>Test technology beforehand</li>
<li>Choose a quiet, well-lit location</li>
<li>Position camera at eye level</li>
<li>Minimize distractions in your background</li>
<li>Look at the camera when speaking</li>
</ul>

<h2>Post-Interview Follow-Up</h2>
<p>Send a thank-you email within 24 hours, reiterating your interest and highlighting key discussion points from the interview.</p>`
  },
  {
    title: "LinkedIn Profile Optimization: Your Digital First Impression",
    slug: "linkedin-profile-optimization-digital-first-impression",
    excerpt: "Transform your LinkedIn profile into a powerful personal brand that attracts recruiters and creates career opportunities.",
    category: "LinkedIn",
    image: "/blog/linkedin-optimization.jpg",
    published: 1,
    createdAt: new Date("2024-02-15"),
    content: `<h2>Why LinkedIn Optimization Matters</h2>
<p>Your LinkedIn profile is often the first professional impression you make. With over 700 million users, optimizing your profile ensures you stand out to recruiters and potential employers actively searching for talent.</p>

<h2>Profile Photo Best Practices</h2>
<ul>
<li>Use a professional, high-quality headshot</li>
<li>Ensure good lighting and a clean background</li>
<li>Dress professionally for your industry</li>
<li>Smile and make eye contact with the camera</li>
<li>Update your photo every 2-3 years</li>
</ul>

<h2>Crafting a Compelling Headline</h2>
<p>Your headline should go beyond your job title. Include keywords, value proposition, and specializations that make you discoverable and memorable.</p>

<h3>Examples:</h3>
<p><strong>Instead of:</strong> Marketing Manager</p>
<p><strong>Try:</strong> Digital Marketing Manager | B2B SaaS Growth Specialist | Driving 200% ROI through Data-Driven Campaigns</p>

<h2>About Section Strategy</h2>
<p>Write in first person and tell your professional story. Include:</p>
<ul>
<li>Your unique value proposition</li>
<li>Key achievements and expertise</li>
<li>Career passion and motivations</li>
<li>Call-to-action for connection</li>
</ul>

<h2>Experience Section Optimization</h2>
<ul>
<li>Use bullet points for readability</li>
<li>Start with action verbs</li>
<li>Include quantifiable achievements</li>
<li>Add relevant media and links</li>
<li>Incorporate industry keywords</li>
</ul>

<h2>Skills and Endorsements</h2>
<p>List up to 50 skills, prioritizing those most relevant to your target roles. Regularly update and reorder skills based on career goals.</p>

<h2>Recommendations</h2>
<p>Request recommendations from managers, colleagues, and clients. Aim for 3-5 strong recommendations that highlight different aspects of your professional capabilities.</p>

<h2>Engagement Strategies</h2>
<ul>
<li>Share industry insights and articles</li>
<li>Comment thoughtfully on others' posts</li>
<li>Publish original content regularly</li>
<li>Join and participate in relevant groups</li>
<li>Connect strategically with industry professionals</li>
</ul>`
  },
  {
    title: "Cover Letter Mistakes That Cost You Job Interviews",
    slug: "cover-letter-mistakes-cost-job-interviews",
    excerpt: "Avoid these common cover letter pitfalls that prevent you from landing interviews, even with a strong resume.",
    category: "Cover Letters",
    image: "/blog/cover-letter-mistakes.jpg",
    published: 1,
    createdAt: new Date("2024-02-20"),
    content: `<h2>The Importance of Cover Letters</h2>
<p>Despite common misconceptions, cover letters remain crucial in the job application process. A well-crafted cover letter can differentiate you from other candidates and demonstrate your genuine interest in the position.</p>

<h2>Critical Mistakes to Avoid</h2>

<h3>1. Generic, One-Size-Fits-All Letters</h3>
<p>Sending the same cover letter to every employer is immediately obvious. Customize each letter to address the specific company, role, and requirements.</p>

<h3>2. Repeating Your Resume</h3>
<p>Your cover letter should complement, not duplicate, your resume. Use it to tell stories that bring your achievements to life and explain your motivation for the role.</p>

<h3>3. Focusing on What You Want</h3>
<p>Instead of emphasizing what you hope to gain, focus on what value you bring to the organization and how you can contribute to their success.</p>

<h3>4. Poor Opening Lines</h3>
<p><strong>Weak:</strong> "I am writing to apply for the position advertised on your website."</p>
<p><strong>Strong:</strong> "As a digital marketing professional who increased online conversions by 150% at XYZ Company, I'm excited about the opportunity to drive similar results for ABC Corp."</p>

<h3>5. Typos and Grammatical Errors</h3>
<p>Errors suggest carelessness and lack of attention to detail. Always proofread multiple times and consider having someone else review your letter.</p>

<h3>6. Wrong Company or Hiring Manager Name</h3>
<p>This mistake is particularly damaging as it shows you're not paying attention. Double-check all names and company details before sending.</p>

<h3>7. Inappropriate Length</h3>
<p>Keep your cover letter to one page, typically 3-4 paragraphs. Hiring managers have limited time and won't read lengthy letters.</p>

<h3>8. Weak Closing</h3>
<p>End with a strong call-to-action that expresses enthusiasm and requests an interview opportunity.</p>

<h2>Cover Letter Structure</h2>
<ol>
<li><strong>Opening:</strong> Hook the reader with a compelling introduction</li>
<li><strong>Body:</strong> Demonstrate your qualifications with specific examples</li>
<li><strong>Connection:</strong> Show why you're interested in this specific company</li>
<li><strong>Closing:</strong> Thank them and request next steps</li>
</ol>

<h2>Best Practices</h2>
<ul>
<li>Research the company thoroughly</li>
<li>Address the hiring manager by name when possible</li>
<li>Use keywords from the job description</li>
<li>Quantify your achievements</li>
<li>Show personality while maintaining professionalism</li>
<li>Proofread carefully</li>
</ul>`
  },
  {
    title: "ATS-Friendly Resume Formatting: Beat the Bots",
    slug: "ats-friendly-resume-formatting-beat-the-bots",
    excerpt: "Learn how to format your resume to pass Applicant Tracking Systems while maintaining visual appeal for human readers.",
    category: "Resume Tips",
    image: "/blog/ats-formatting.jpg",
    published: 1,
    createdAt: new Date("2024-02-25"),
    content: `<h2>Understanding Applicant Tracking Systems</h2>
<p>Over 90% of large companies use ATS to screen resumes before human eyes see them. Understanding how these systems work is crucial for getting your application past the initial screening.</p>

<h2>How ATS Works</h2>
<p>ATS software scans resumes for:</p>
<ul>
<li>Keywords matching the job description</li>
<li>Proper formatting and structure</li>
<li>Relevant skills and qualifications</li>
<li>Work history and education</li>
<li>Contact information</li>
</ul>

<h2>ATS-Friendly Formatting Rules</h2>

<h3>File Format</h3>
<ul>
<li>Use .docx or .pdf formats (check job posting for preference)</li>
<li>Avoid images, graphics, or charts</li>
<li>Skip headers and footers</li>
<li>Use standard fonts (Arial, Calibri, Times New Roman)</li>
</ul>

<h3>Section Headers</h3>
<p>Use standard section titles that ATS can recognize:</p>
<ul>
<li>Work Experience (not "Where I've Been")</li>
<li>Education (not "Academic Background")</li>
<li>Skills (not "What I'm Good At")</li>
</ul>

<h3>Formatting Elements to Avoid</h3>
<ul>
<li>Tables and text boxes</li>
<li>Multiple columns</li>
<li>Headers and footers</li>
<li>Special characters and symbols</li>
<li>Fancy fonts or colors</li>
<li>Images and logos</li>
</ul>

<h2>Keyword Optimization</h2>

<h3>How to Identify Keywords</h3>
<ol>
<li>Analyze the job description carefully</li>
<li>Note repeated skills and qualifications</li>
<li>Include both acronyms and full terms (e.g., "SEO" and "Search Engine Optimization")</li>
<li>Use industry-specific terminology</li>
</ol>

<h3>Where to Place Keywords</h3>
<ul>
<li>Professional summary</li>
<li>Skills section</li>
<li>Work experience descriptions</li>
<li>Education and certifications</li>
</ul>

<h2>Testing Your Resume</h2>
<p>Before submitting, test your resume's ATS compatibility:</p>
<ul>
<li>Copy and paste into a plain text document</li>
<li>Check if formatting remains intact</li>
<li>Ensure all information is readable</li>
<li>Use online ATS scanning tools</li>
</ul>

<h2>Balancing ATS and Human Readers</h2>
<p>While optimizing for ATS is important, remember that humans will eventually read your resume. Strike a balance between:</p>
<ul>
<li>Keyword optimization and natural language</li>
<li>Simple formatting and visual appeal</li>
<li>Comprehensive information and conciseness</li>
</ul>`
  },
  {
    title: "Career Change Resume: Successfully Pivot Your Professional Path",
    slug: "career-change-resume-successfully-pivot",
    excerpt: "Navigate career transitions with a resume that highlights transferable skills and positions you for success in a new industry.",
    category: "Career Advice",
    image: "/blog/career-change.jpg",
    published: 1,
    createdAt: new Date("2024-03-01"),
    content: `<h2>The Career Change Challenge</h2>
<p>Changing careers can feel daunting, especially when your resume doesn't obviously align with your target role. However, with the right strategy, you can effectively position your experience for a successful transition.</p>

<h2>Resume Format for Career Changers</h2>

<h3>Functional or Hybrid Format</h3>
<p>Consider using a functional or hybrid resume format that emphasizes skills over chronological work history. This approach allows you to:</p>
<ul>
<li>Highlight transferable skills prominently</li>
<li>Minimize focus on unrelated job titles</li>
<li>Demonstrate relevant capabilities</li>
<li>Show career progression strategically</li>
</ul>

<h2>Identifying Transferable Skills</h2>
<p>Transferable skills are abilities that apply across industries and roles:</p>

<h3>Hard Skills</h3>
<ul>
<li>Project management</li>
<li>Data analysis</li>
<li>Budget management</li>
<li>Technical proficiencies</li>
<li>Foreign languages</li>
</ul>

<h3>Soft Skills</h3>
<ul>
<li>Leadership and team management</li>
<li>Communication and presentation</li>
<li>Problem-solving and critical thinking</li>
<li>Adaptability and learning agility</li>
<li>Stakeholder management</li>
</ul>

<h2>Crafting Your Professional Summary</h2>
<p>Your summary should bridge your past experience with your future goals:</p>

<p><strong>Example:</strong> "Results-driven professional with 8+ years of project management experience in healthcare, now leveraging analytical skills and stakeholder management expertise to transition into data analytics. Completed Google Data Analytics Certificate and built portfolio of data visualization projects."</p>

<h2>Reframing Your Experience</h2>

<h3>Before (Traditional Approach):</h3>
<p>"Managed daily operations of a retail store with 15 employees"</p>

<h3>After (Career Change Approach):</h3>
<p>"Led cross-functional team of 15 in fast-paced environment, developing strong project management and people leadership skills while driving 25% revenue growth through data-driven decision making"</p>

<h2>Addressing the Career Gap</h2>
<p>Be transparent about your transition:</p>
<ul>
<li>Include relevant coursework or certifications</li>
<li>Highlight volunteer work in target industry</li>
<li>Mention side projects or freelance work</li>
<li>Show continuous learning and development</li>
</ul>

<h2>Additional Strategies</h2>
<ol>
<li><strong>Network Actively:</strong> Leverage connections in your target industry</li>
<li><strong>Gain Experience:</strong> Take on projects, volunteer, or freelance in your new field</li>
<li><strong>Invest in Education:</strong> Complete relevant certifications or courses</li>
<li><strong>Customize Applications:</strong> Tailor each resume to the specific role</li>
<li><strong>Prepare Your Story:</strong> Develop a compelling narrative for interviews</li>
</ol>

<h2>Cover Letter Importance</h2>
<p>For career changers, the cover letter is crucial. Use it to:</p>
<ul>
<li>Explain your motivation for the change</li>
<li>Connect your past experience to future goals</li>
<li>Demonstrate knowledge of the new industry</li>
<li>Show enthusiasm and commitment</li>
</ul>`
  },
  {
    title: "Resume Length: How Long Should Your Resume Really Be?",
    slug: "resume-length-how-long-should-it-be",
    excerpt: "Discover the optimal resume length for your career stage and learn when to use one page versus multiple pages.",
    category: "Resume Tips",
    image: "/blog/resume-length.jpg",
    published: 1,
    createdAt: new Date("2024-03-05"),
    content: `<h2>The Resume Length Debate</h2>
<p>One of the most common questions job seekers ask is: "How long should my resume be?" The answer isn't one-size-fits-all and depends on your experience level, industry, and target role.</p>

<h2>General Guidelines by Experience Level</h2>

<h3>Entry-Level (0-5 years)</h3>
<p><strong>Recommended Length:</strong> 1 page</p>
<p>Early career professionals should focus on education, internships, relevant projects, and transferable skills. A concise one-page resume demonstrates your ability to prioritize information.</p>

<h3>Mid-Career (5-15 years)</h3>
<p><strong>Recommended Length:</strong> 1-2 pages</p>
<p>As you gain experience, you may need additional space to showcase achievements. However, prioritize recent and relevant experience over comprehensive career history.</p>

<h3>Senior-Level (15+ years)</h3>
<p><strong>Recommended Length:</strong> 2-3 pages</p>
<p>Senior professionals and executives may require additional pages to demonstrate extensive experience, leadership roles, and significant achievements.</p>

<h2>Industry Considerations</h2>

<h3>Academic and Research Positions</h3>
<p>CVs (Curriculum Vitae) for academic roles can be several pages long, including publications, presentations, grants, and teaching experience.</p>

<h3>Creative Industries</h3>
<p>Focus on portfolio work rather than lengthy descriptions. Keep the resume concise and direct to your portfolio.</p>

<h3>Technical Fields</h3>
<p>May require additional space for technical skills, certifications, and project details, but should remain focused and relevant.</p>

<h2>What to Include vs. Exclude</h2>

<h3>Always Include:</h3>
<ul>
<li>Recent relevant experience (last 10-15 years)</li>
<li>Quantifiable achievements</li>
<li>Skills matching the job description</li>
<li>Education and relevant certifications</li>
<li>Professional summary</li>
</ul>

<h3>Consider Excluding:</h3>
<ul>
<li>Irrelevant early career positions</li>
<li>Outdated technical skills</li>
<li>Personal information (age, marital status, photo in most countries)</li>
<li>References (provide separately when requested)</li>
<li>Objective statements (use professional summary instead)</li>
</ul>

<h2>Quality Over Quantity</h2>
<p>Regardless of length, every line on your resume should serve a purpose:</p>
<ul>
<li>Demonstrate relevant skills or experience</li>
<li>Showcase measurable achievements</li>
<li>Align with the target role requirements</li>
<li>Add value to your candidacy</li>
</ul>

<h2>Formatting for Readability</h2>
<p>Make your resume easy to scan:</p>
<ul>
<li>Use clear section headers</li>
<li>Employ bullet points for achievements</li>
<li>Maintain consistent formatting</li>
<li>Use appropriate white space</li>
<li>Choose readable fonts (10-12 point)</li>
</ul>

<h2>The Two-Page Test</h2>
<p>If your resume extends to two pages, ask yourself:</p>
<ol>
<li>Is all information relevant to my target role?</li>
<li>Have I quantified achievements where possible?</li>
<li>Could I condense older experience?</li>
<li>Am I repeating similar information?</li>
<li>Would removing any content weaken my application?</li>
</ol>

<h2>Regional Differences</h2>

<h3>United States</h3>
<p>Generally prefers concise resumes (1-2 pages for most professionals)</p>

<h3>Europe</h3>
<p>Often uses CVs that may be longer and include more personal information</p>

<h3>Australia</h3>
<p>Similar to US, typically 2-3 pages for experienced professionals, with detailed achievement descriptions</p>

<h2>Final Recommendation</h2>
<p>Focus on impact rather than length. A well-crafted one-page resume that effectively showcases your value is better than a three-page document filled with irrelevant information. Tailor your resume length to your experience level, industry norms, and the specific requirements of each role you're pursuing.</p>`
  }
];

const db = drizzle(process.env.DATABASE_URL);

async function migrateBlogPosts() {
  console.log('Starting blog post migration...');
  
  for (const post of blogPostsData) {
    try {
      await db.insert(blog_posts).values(post);
      console.log(`✓ Migrated: ${post.title}`);
    } catch (error) {
      console.error(`✗ Failed to migrate: ${post.title}`, error);
    }
  }
  
  console.log('Migration complete!');
  process.exit(0);
}

migrateBlogPosts();
