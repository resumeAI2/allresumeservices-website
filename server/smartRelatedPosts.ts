import { getDb } from './db';
import { blog_posts, blog_post_tags, blog_tags } from '../drizzle/schema';
import { eq, and, ne, or, isNull, lte, inArray } from 'drizzle-orm';

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  categoryId: number | null;
  image: string | null;
  readTime: string | null;
  createdAt: Date;
  score: number;
}

/**
 * Smart related posts algorithm that uses tags, keywords, and category
 * to find the most relevant posts
 */
export async function getSmartRelatedPosts(postId: number, limit: number = 3): Promise<RelatedPost[]> {
  const db = await getDb();
  if (!db) return [];

  // Get the current post
  const currentPost = await db.select().from(blog_posts).where(eq(blog_posts.id, postId)).limit(1);
  if (!currentPost || currentPost.length === 0) return [];

  const post = currentPost[0];

  // Get tags for the current post
  const postTags = await db
    .select({ tagId: blog_post_tags.tagId })
    .from(blog_post_tags)
    .where(eq(blog_post_tags.postId, postId));

  const tagIds = postTags.map(pt => pt.tagId);

  // Get all published posts except the current one
  const now = new Date();
  const allPosts = await db
    .select()
    .from(blog_posts)
    .where(
      and(
        eq(blog_posts.published, 1),
        ne(blog_posts.id, postId),
        or(
          isNull(blog_posts.scheduledPublishDate),
          lte(blog_posts.scheduledPublishDate, now)
        )
      )
    );

  // Calculate relevance scores for each post
  const scoredPosts: RelatedPost[] = [];

  for (const relatedPost of allPosts) {
    let score = 0;

    // Get tags for this related post
    const relatedPostTags = await db
      .select({ tagId: blog_post_tags.tagId })
      .from(blog_post_tags)
      .where(eq(blog_post_tags.postId, relatedPost.id));

    const relatedTagIds = relatedPostTags.map(pt => pt.tagId);

    // Score based on tag matches (highest weight)
    const commonTags = tagIds.filter(tagId => relatedTagIds.includes(tagId));
    score += commonTags.length * 10; // 10 points per matching tag

    // Score based on category match (medium weight)
    if (post.categoryId && relatedPost.categoryId === post.categoryId) {
      score += 5; // 5 points for same category
    }

    // Score based on keyword similarity in title (lower weight)
    const currentTitleWords = post.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const relatedTitleWords = relatedPost.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const commonWords = currentTitleWords.filter(word => relatedTitleWords.includes(word));
    score += commonWords.length * 2; // 2 points per matching keyword

    // Only include posts with some relevance
    if (score > 0) {
      scoredPosts.push({
        id: relatedPost.id,
        title: relatedPost.title,
        slug: relatedPost.slug,
        excerpt: relatedPost.excerpt,
        category: relatedPost.category,
        categoryId: relatedPost.categoryId,
        image: relatedPost.image,
        readTime: relatedPost.readTime,
        createdAt: relatedPost.createdAt,
        score,
      });
    }
  }

  // Sort by score (descending) and return top N
  scoredPosts.sort((a, b) => b.score - a.score);

  // If we don't have enough high-scoring posts, fall back to category-only matching
  if (scoredPosts.length < limit && post.categoryId) {
    const categoryPosts = allPosts
      .filter(p => 
        p.categoryId === post.categoryId && 
        !scoredPosts.find(sp => sp.id === p.id)
      )
      .slice(0, limit - scoredPosts.length)
      .map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        category: p.category,
        categoryId: p.categoryId,
        image: p.image,
        readTime: p.readTime,
        createdAt: p.createdAt,
        score: 1, // Low score for category-only matches
      }));

    scoredPosts.push(...categoryPosts);
  }

  return scoredPosts.slice(0, limit);
}
