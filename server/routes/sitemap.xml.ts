import type { RequestHandler } from 'express';
import { getDb } from '../db.js';
import { blog_posts } from '../../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async (req, res) => {
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
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    // Define static pages
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
    ];

    // Build XML sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    for (const page of staticPages) {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
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
