const fs = require('fs');
const path = require('path');

// Read the extracted blog posts JSON
const blogData = JSON.parse(fs.readFileSync('/home/ubuntu/extract_blog_posts.json', 'utf8'));

// Also read the two blog posts we already extracted
const blog1Path = '/home/ubuntu/page_texts/www.allresumeservices.com.au_transform-your-resume-with-powerful-action-verbs_.md';
const blog2Path = '/home/ubuntu/page_texts/www.allresumeservices.com.au_stand-out-with-top-notch-senior-management-resume-services_.md';

const allBlogContent = [];

// Add first two blogs
if (fs.existsSync(blog1Path)) {
  allBlogContent.push({
    slug: 'transform-resume-action-verbs',
    content: fs.readFileSync(blog1Path, 'utf8')
  });
}

if (fs.existsSync(blog2Path)) {
  allBlogContent.push({
    slug: 'senior-management-resume-services',
    content: fs.readFileSync(blog2Path, 'utf8')
  });
}

// Map slugs to extracted content
const slugMap = {
  'expert-resume-services': 'elevate-your-career-with-expert-resume-services',
  'mid-career-resume-help': 'unlock-opportunities-with-expert-mid-career-resume-help',
  'affordable-basic-resume-writing': 'affordable-basic-resume-writing-stand-out-in-your-job-hunt',
  'winning-selection-criteria-government': 'write-winning-selection-criteria-for-government-roles-today',
  'effective-cv-writing-strategies': 'effective-cv-writing-strategies-for-career-success',
  'expert-cv-help-winning-resumes': 'expert-cv-help-for-crafting-winning-resumes-effortlessly',
  'why-need-cv-services': 'why-do-you-need-cv-services'
};

// Process extracted blogs
blogData.results.forEach(result => {
  const contentFile = result.output.content_file;
  if (fs.existsSync(contentFile)) {
    const content = fs.readFileSync(contentFile, 'utf8');
    const url = result.output.url;
    const urlSlug = url.split('/').filter(Boolean).pop();
    
    // Find matching slug
    const slug = Object.keys(slugMap).find(key => slugMap[key] === urlSlug);
    if (slug) {
      allBlogContent.push({ slug, content });
    }
  }
});

// Simple markdown to HTML converter (basic)
function markdownToHtml(md) {
  let html = md;
  
  // Remove metadata header
  html = html.replace(/^#[^\n]+\n\n\*\*URL:\*\*[^\n]+\n\n---\n\n[\s\S]*?Cart\n/m, '');
  
  // Convert headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Convert bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert paragraphs
  html = html.split('\n\n').map(para => {
    para = para.trim();
    if (!para || para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol')) {
      return para;
    }
    return `<p>${para}</p>`;
  }).join('\n');
  
  return html;
}

// Generate TypeScript file with content
let tsContent = `export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
  image: string;
  content: string;
}

export const blogPosts: BlogPost[] = [\n`;

const posts = [
  { id: 1, slug: 'transform-resume-action-verbs', title: 'Transform Your Resume with Powerful Action Verbs', excerpt: 'Transform your resume into a powerful tool with action verbs that capture attention. Elevate your language and stand out in the job market today!', category: 'Resume Tips', date: 'November 19, 2025', readTime: '5 min read' },
  { id: 2, slug: 'senior-management-resume-services', title: 'Stand Out with Top-notch Senior Management Resume Services', excerpt: 'Revamp your career with our senior management resume services. Create a standout leadership resume that showcases your executive skills and achievements.', category: 'Resume Writing', date: 'November 19, 2025', readTime: '6 min read' },
  { id: 3, slug: 'expert-resume-services', title: 'Elevate Your Career with Expert Resume Services', excerpt: 'Boost your career prospects with expert resume services. Craft a powerful resume that highlights your strengths and sets you apart from the competition.', category: 'Resume Services', date: 'November 17, 2025', readTime: '5 min read' },
  { id: 4, slug: 'mid-career-resume-help', title: 'Unlock Opportunities with Expert Mid-Career Resume Help', excerpt: 'Unlock new job opportunities with our expert mid-career resume help. Tailored drafts enhance your experienced or professional resume for impactful applications.', category: 'Career Advice', date: 'November 12, 2025', readTime: '6 min read' },
  { id: 5, slug: 'affordable-basic-resume-writing', title: 'Affordable Basic Resume Writing – Stand Out in Your Job Hunt', excerpt: 'Stand out in your job hunt with an affordable basic resume. Master entry-level applications and impress employers without breaking the bank. Get started now!', category: 'Resume Writing', date: 'November 12, 2025', readTime: '5 min read' },
  { id: 6, slug: 'winning-selection-criteria-government', title: 'Write Winning Selection Criteria for Government Roles Today!', excerpt: 'Craft persuasive selection criteria for government roles to stand out. Enhance your public service applications with our expert tips and strategies for success.', category: 'Selection Criteria', date: 'November 10, 2025', readTime: '7 min read' },
  { id: 7, slug: 'effective-cv-writing-strategies', title: 'Effective CV Writing Strategies for Career Success', excerpt: 'Unlock your career potential with effective CV writing strategies. Learn how to craft a standout CV that impresses employers and secures interviews.', category: 'CV Writing', date: 'October 6, 2025', readTime: '6 min read' },
  { id: 8, slug: 'expert-cv-help-winning-resumes', title: 'Expert CV Help for Crafting Winning Resumes Effortlessly', excerpt: 'Unlock the secrets to crafting a winning resume effortlessly. Get expert CV help and transform your job applications into interview opportunities.', category: 'CV Writing', date: 'September 26, 2025', readTime: '6 min read' },
  { id: 9, slug: 'why-need-cv-services', title: 'Why do you need CV services', excerpt: 'Introduction: Turning Job Search Blues into a Beacon of Success. Ever felt like you are chasing your tail in the job search process?', category: 'CV Services', date: 'December 12, 2024', readTime: '5 min read' }
];

posts.forEach((post, index) => {
  const blogContent = allBlogContent.find(b => b.slug === post.slug);
  let htmlContent = '';
  
  if (blogContent) {
    htmlContent = markdownToHtml(blogContent.content);
    // Escape for TypeScript string - escape backslashes first, then backticks and dollars
    htmlContent = htmlContent.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  }
  
  const escapedTitle = post.title.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const escapedExcerpt = post.excerpt.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  
  tsContent += `  {
    id: ${post.id},
    title: "${escapedTitle}",
    excerpt: "${escapedExcerpt}",
    category: "${post.category}",
    date: "${post.date}",
    readTime: "${post.readTime}",
    slug: "${post.slug}",
    image: "/api/placeholder/800/400",
    content: \`${htmlContent}\`
  }${index < posts.length - 1 ? ',' : ''}
`;
});

tsContent += '];\n';

fs.writeFileSync('client/src/data/blogPosts.ts', tsContent);
console.log('Blog posts data file generated successfully!');
