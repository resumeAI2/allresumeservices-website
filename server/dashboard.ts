import { getDb } from './db';
import { blog_posts, contact_submissions, testimonials, faq_search_analytics } from '../drizzle/schema';
import { desc, eq, count, sql } from 'drizzle-orm';

/**
 * Get dashboard metrics
 */
export async function getDashboardMetrics() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Blog post statistics
  const [blogStats] = await db
    .select({
      total: count(),
      published: sql<number>`SUM(CASE WHEN ${blog_posts.published} = 1 THEN 1 ELSE 0 END)`,
      draft: sql<number>`SUM(CASE WHEN ${blog_posts.published} = 0 THEN 1 ELSE 0 END)`,
    })
    .from(blog_posts);

  // Contact submissions statistics
  const [contactStats] = await db
    .select({
      total: count(),
      new: sql<number>`SUM(CASE WHEN ${contact_submissions.status} = 'new' THEN 1 ELSE 0 END)`,
      contacted: sql<number>`SUM(CASE WHEN ${contact_submissions.status} = 'contacted' THEN 1 ELSE 0 END)`,
      converted: sql<number>`SUM(CASE WHEN ${contact_submissions.status} = 'converted' THEN 1 ELSE 0 END)`,
    })
    .from(contact_submissions);

  // Testimonials statistics
  const [testimonialStats] = await db
    .select({
      total: count(),
      featured: sql<number>`SUM(CASE WHEN ${testimonials.featured} = 1 THEN 1 ELSE 0 END)`,
      approved: sql<number>`SUM(CASE WHEN ${testimonials.approved} = 1 THEN 1 ELSE 0 END)`,
    })
    .from(testimonials);

  // FAQ search statistics
  const [faqStats] = await db
    .select({
      totalSearches: count(),
    })
    .from(faq_search_analytics);

  return {
    blog: {
      total: blogStats?.total || 0,
      published: Number(blogStats?.published) || 0,
      draft: Number(blogStats?.draft) || 0,
    },
    contacts: {
      total: contactStats?.total || 0,
      new: Number(contactStats?.new) || 0,
      contacted: Number(contactStats?.contacted) || 0,
      converted: Number(contactStats?.converted) || 0,
    },
    testimonials: {
      total: testimonialStats?.total || 0,
      featured: Number(testimonialStats?.featured) || 0,
      approved: Number(testimonialStats?.approved) || 0,
    },
    faq: {
      totalSearches: faqStats?.totalSearches || 0,
    },
  };
}

/**
 * Get recent contact submissions
 */
export async function getRecentContactSubmissions(limit: number = 5) {
  const db = await getDb();
  if (!db) return [];

  const submissions = await db
    .select()
    .from(contact_submissions)
    .orderBy(desc(contact_submissions.submittedAt))
    .limit(limit);

  return submissions;
}

/**
 * Get recent blog posts
 */
export async function getRecentBlogPosts(limit: number = 5) {
  const db = await getDb();
  if (!db) return [];

  const posts = await db
    .select({
      id: blog_posts.id,
      title: blog_posts.title,
      slug: blog_posts.slug,
      published: blog_posts.published,
      createdAt: blog_posts.createdAt,
      updatedAt: blog_posts.updatedAt,
    })
    .from(blog_posts)
    .orderBy(desc(blog_posts.updatedAt))
    .limit(limit);

  return posts;
}

/**
 * Get scheduled blog posts (future publish dates)
 */
export async function getScheduledBlogPosts(limit: number = 5) {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  
  const posts = await db
    .select({
      id: blog_posts.id,
      title: blog_posts.title,
      slug: blog_posts.slug,
      scheduledPublishDate: blog_posts.scheduledPublishDate,
      createdAt: blog_posts.createdAt,
    })
    .from(blog_posts)
    .where(sql`${blog_posts.scheduledPublishDate} > ${now.toISOString()}`)
    .orderBy(blog_posts.scheduledPublishDate)
    .limit(limit);

  return posts;
}
