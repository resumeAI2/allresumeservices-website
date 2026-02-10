import { blogPosts } from './blogPosts';

/** Shape compatible with API blog list/detail (used when DB is empty or unavailable) */
export interface FallbackBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categoryId: number | null;
  image: string;
  readTime: string | null;
  published: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  metaTitle?: string;
  metaDescription?: string;
}

function parseDate(dateStr: string): Date {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

export const FALLBACK_BLOG_POSTS: FallbackBlogPost[] = blogPosts.map((p) => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  excerpt: p.excerpt,
  content: p.content,
  category: p.category,
  categoryId: 1,
  image: p.image,
  readTime: p.readTime || null,
  published: 1,
  viewCount: 0,
  createdAt: parseDate(p.date),
  updatedAt: parseDate(p.date),
  metaTitle: p.metaTitle,
  metaDescription: p.metaDescription,
}));

export function getFallbackPostBySlug(slug: string): FallbackBlogPost | undefined {
  return FALLBACK_BLOG_POSTS.find((p) => p.slug === slug);
}
