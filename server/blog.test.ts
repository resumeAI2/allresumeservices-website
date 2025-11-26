import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from './db';
import { blog_posts } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Blog Management System', () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
  });

  it('should fetch all published blog posts from database', async () => {
    if (!db) throw new Error('Database not available');
    
    const posts = await db
      .select()
      .from(blog_posts)
      .where(eq(blog_posts.published, 1));
    
    expect(posts).toBeDefined();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    
    // Verify migrated posts exist
    const titles = posts.map(p => p.title);
    expect(titles).toContain('Transform Your Resume with Powerful Action Verbs');
    expect(titles).toContain('LinkedIn Profile Optimization: Your Digital First Impression');
  });

  it('should fetch a blog post by slug', async () => {
    if (!db) throw new Error('Database not available');
    
    const post = await db
      .select()
      .from(blog_posts)
      .where(eq(blog_posts.slug, 'transform-your-resume-with-powerful-action-verbs'))
      .limit(1);
    
    expect(post).toBeDefined();
    expect(post.length).toBe(1);
    expect(post[0].title).toBe('Transform Your Resume with Powerful Action Verbs');
    expect(post[0].category).toBe('Resume Tips');
    expect(post[0].content).toContain('Action Verbs Matter');
  });

  it('should verify blog post has required fields', async () => {
    if (!db) throw new Error('Database not available');
    
    const post = await db
      .select()
      .from(blog_posts)
      .limit(1);
    
    expect(post[0]).toHaveProperty('id');
    expect(post[0]).toHaveProperty('title');
    expect(post[0]).toHaveProperty('slug');
    expect(post[0]).toHaveProperty('excerpt');
    expect(post[0]).toHaveProperty('content');
    expect(post[0]).toHaveProperty('category');
    expect(post[0]).toHaveProperty('image');
    expect(post[0]).toHaveProperty('published');
    expect(post[0]).toHaveProperty('createdAt');
  });

  it('should filter posts by category', async () => {
    if (!db) throw new Error('Database not available');
    
    const resumeTipsPosts = await db
      .select()
      .from(blog_posts)
      .where(eq(blog_posts.category, 'Resume Tips'));
    
    expect(resumeTipsPosts).toBeDefined();
    expect(resumeTipsPosts.length).toBeGreaterThan(0);
    
    // All posts should be in Resume Tips category
    resumeTipsPosts.forEach(post => {
      expect(post.category).toBe('Resume Tips');
    });
  });

  it('should verify all migrated posts are published', async () => {
    if (!db) throw new Error('Database not available');
    
    const allPosts = await db
      .select()
      .from(blog_posts);
    
    // All migrated posts should be published
    allPosts.forEach(post => {
      expect(post.published).toBe(1);
    });
  });
});
