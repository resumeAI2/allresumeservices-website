import { getDb } from '../db.js';
import { blog_posts, case_studies } from '../../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

// Generic request/response types to avoid Express/Vercel conflicts
interface RequestLike {
  protocol?: string;
  get?: (name: string) => string | undefined;
  headers?: Record<string, string | string[] | undefined>;
}

interface ResponseLike {
  status: (code: number) => ResponseLike;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
}

export const GET = async (req: RequestLike, res: ResponseLike) => {
  try {
    // Get all published blog posts
    const db = await getDb();
    if (!db) {
      res.status(500).send('Database not available');
      return;
    }
    
    const posts = await db.select({
      slug: blog_posts.slug,
      updatedAt: blog_posts.updatedAt,
      createdAt: blog_posts.createdAt
    }).from(blog_posts).where(eq(blog_posts.published, 1));

    // Get the base URL from the request
    const protocol = req.protocol || "https";
    const host = req.get?.('host') || req.headers?.['host'] || "www.allresumeservices.com.au";
    const baseUrl = `${protocol}://${host}`;

    // Define static pages with lastmod for SEO (ISO date when page was last meaningfully updated)
    const staticPagesLastmod = '2026-02-02'; // Update when static content changes
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/services', priority: '0.9', changefreq: 'monthly' },
      { url: '/services/resume-writing', priority: '0.9', changefreq: 'monthly' },
      { url: '/services/cover-letter', priority: '0.8', changefreq: 'monthly' },
      { url: '/services/linkedin-profile', priority: '0.8', changefreq: 'monthly' },
      { url: '/services/selection-criteria', priority: '0.8', changefreq: 'monthly' },
      { url: '/pricing', priority: '0.9', changefreq: 'monthly' },
      { url: '/blog', priority: '0.9', changefreq: 'daily' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/case-studies', priority: '0.8', changefreq: 'weekly' },
      { url: '/testimonials', priority: '0.8', changefreq: 'weekly' },
      { url: '/google-reviews', priority: '0.7', changefreq: 'weekly' },
      { url: '/industries', priority: '0.7', changefreq: 'monthly' },
    ];

    // Build XML sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages with lastmod
    for (const page of staticPages) {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${staticPagesLastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    // Add blog posts
    for (const post of posts) {
      const lastmod = post.updatedAt || post.createdAt;
      const formattedDate = lastmod.toISOString().split('T')[0];
      
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${formattedDate}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += '  </url>\n';
    }

    // Get all published case studies
    const caseStudiesData = await db.select({
      slug: case_studies.slug,
      updatedAt: case_studies.updatedAt,
      createdAt: case_studies.createdAt
    }).from(case_studies).where(eq(case_studies.published, 1));

    // Add case studies
    for (const study of caseStudiesData) {
      const lastmod = study.updatedAt || study.createdAt;
      const formattedDate = lastmod.toISOString().split('T')[0];
      
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/case-studies/${study.slug}</loc>\n`;
      xml += `    <lastmod>${formattedDate}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    // Set proper headers for XML
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
};
