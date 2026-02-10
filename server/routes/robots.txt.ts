// Generic request/response types to avoid Express/Vercel conflicts
interface RequestLike {
  protocol?: string;
  get?: (name: string) => string | undefined;
  headers?: Record<string, string | string[] | undefined>;
}

interface ResponseLike {
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
}

export const GET = async (req: RequestLike, res: ResponseLike) => {
  const protocol = req.protocol || "https";
  const hostFromRequest = req.get?.('host') ?? req.headers?.['host'];
  const hostStr = Array.isArray(hostFromRequest) ? hostFromRequest[0] : hostFromRequest;
  const canonicalHost =
    process.env.VITE_APP_URL?.replace(/^https?:\/\//, '').replace(/\/$/, '') ||
    process.env.SITE_URL?.replace(/^https?:\/\//, '').replace(/\/$/, '') ||
    hostStr ||
    "www.allresumeservices.com.au";
  const baseUrl = `${protocol}://${canonicalHost}`;

  const robotsTxt = `# All Résumé Services - Robots.txt
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
