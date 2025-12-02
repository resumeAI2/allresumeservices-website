import type { RequestHandler } from 'express';

export const GET: RequestHandler = async (req, res) => {
  const protocol = req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}`;

  const robotsTxt = `# All Resume Services - Robots.txt
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_/

# Allow blog and public pages
Allow: /blog/
Allow: /services/
Allow: /about
Allow: /contact
Allow: /pricing
`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
  res.send(robotsTxt);
};
