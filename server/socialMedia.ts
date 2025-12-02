import { getDb } from './db';
import { social_media_posts, blog_posts } from '../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';

export interface SocialMediaPost {
  id: number;
  blogPostId: number | null;
  caseStudyId: number | null;
  platform: string;
  postText: string;
  postUrl: string | null;
  status: 'pending' | 'posted' | 'failed';
  scheduledFor: Date | null;
  postedAt: Date | null;
  errorMessage: string | null;
  createdAt: Date;
}

/**
 * Create social media posts for a blog post
 * This simulates auto-posting by creating records that would be processed by a background job
 */
export async function createSocialMediaPostsForBlog(blogPostId: number, blogPostTitle: string, blogPostSlug: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const siteUrl = process.env.VITE_APP_URL || 'https://allresumeservices.com.au';
  const postUrl = `${siteUrl}/blog/${blogPostSlug}`;

  // Generate platform-specific post text
  const platforms = [
    {
      platform: 'linkedin',
      postText: `📝 New Career Advice: ${blogPostTitle}

Read our latest insights to advance your career and stand out in the job market.

${postUrl}

#CareerAdvice #ResumeWriting #JobSearch #ProfessionalDevelopment`,
    },
    {
      platform: 'facebook',
      postText: `New blog post alert! 🎯

${blogPostTitle}

Check out our latest career advice to help you land your dream job.

Read more: ${postUrl}`,
    },
    {
      platform: 'twitter',
      postText: `📝 ${blogPostTitle}

${postUrl}

#CareerTips #ResumeWriting #JobSearch`,
    },
  ];

  const results = [];
  
  for (const { platform, postText } of platforms) {
    try {
      const result = await db.insert(social_media_posts).values({
        blogPostId,
        caseStudyId: null,
        platform,
        postText,
        postUrl: null, // Will be filled when actually posted
        status: 'pending',
        scheduledFor: new Date(), // Schedule for immediate posting
        postedAt: null,
        errorMessage: null,
        createdAt: new Date(),
      });
      results.push({ platform, status: 'scheduled' });
    } catch (error) {
      console.error(`Failed to schedule ${platform} post:`, error);
      results.push({ platform, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  return results;
}

/**
 * Get all social media posts for a blog post
 */
export async function getSocialMediaPostsForBlog(blogPostId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(social_media_posts)
    .where(eq(social_media_posts.blogPostId, blogPostId))
    .orderBy(desc(social_media_posts.createdAt));
}

/**
 * Get all pending social media posts
 */
export async function getPendingSocialMediaPosts() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(social_media_posts)
    .where(eq(social_media_posts.status, 'pending'))
    .orderBy(social_media_posts.scheduledFor);
}

/**
 * Mark a social media post as posted
 */
export async function markSocialMediaPostAsPosted(id: number, postUrl: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db.update(social_media_posts)
    .set({
      status: 'posted',
      postUrl,
      postedAt: new Date(),
    })
    .where(eq(social_media_posts.id, id));

  return { success: true };
}

/**
 * Mark a social media post as failed
 */
export async function markSocialMediaPostAsFailed(id: number, errorMessage: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db.update(social_media_posts)
    .set({
      status: 'failed',
      errorMessage,
    })
    .where(eq(social_media_posts.id, id));

  return { success: true };
}

/**
 * Delete social media posts for a blog post
 */
export async function deleteSocialMediaPostsForBlog(blogPostId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db.delete(social_media_posts).where(eq(social_media_posts.blogPostId, blogPostId));
  return { success: true };
}

/**
 * Get social media posting history/log
 */
export async function getSocialMediaPostingHistory(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(social_media_posts)
    .orderBy(desc(social_media_posts.createdAt))
    .limit(limit);
}
