import { getDb } from './db';
import { blog_posts, uploaded_images } from '../drizzle/schema';
import { eq, desc, and, or, lte, isNull, sql } from 'drizzle-orm';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  published: number; // 0 = draft, 1 = published
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllBlogPosts(publishedOnly: boolean = true) {
  const db = await getDb();
  if (!db) return [];
  
  const now = new Date();
  
  const query = publishedOnly
    ? db.select().from(blog_posts).where(
        and(
          eq(blog_posts.published, 1),
          or(
            isNull(blog_posts.scheduledPublishDate),
            lte(blog_posts.scheduledPublishDate, now)
          )
        )
      ).orderBy(desc(blog_posts.createdAt))
    : db.select().from(blog_posts).orderBy(desc(blog_posts.createdAt));
  
  return await query;
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const posts = await db.select().from(blog_posts).where(eq(blog_posts.slug, slug)).limit(1);
  return posts[0] || null;
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const posts = await db.select().from(blog_posts).where(eq(blog_posts.id, id)).limit(1);
  return posts[0] || null;
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.insert(blog_posts).values({
    ...post,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
}

export async function updateBlogPost(id: number, post: Partial<Omit<BlogPost, 'id' | 'createdAt'>>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.update(blog_posts)
    .set({
      ...post,
      updatedAt: new Date(),
    })
    .where(eq(blog_posts.id, id));
  return result;
}

export async function uploadImage(filename: string, contentType: string, base64Data: string, altText?: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const { optimizeBase64Image } = await import('./imageOptimization');
  
  // Generate optimized image variants
  const optimizedImages = await optimizeBase64Image(base64Data, filename, 'blog');
  
  // Find specific size URLs
  const originalImage = optimizedImages.find(img => img.size === 'original');
  const thumbnailImage = optimizedImages.find(img => img.size === 'thumbnail');
  const smallImage = optimizedImages.find(img => img.size === 'small');
  const mediumImage = optimizedImages.find(img => img.size === 'medium');
  const largeImage = optimizedImages.find(img => img.size === 'large');
  
  if (!originalImage) {
    throw new Error('Failed to upload original image');
  }
  
  // Calculate original buffer size
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Save image metadata to database with all variants
  await db.insert(uploaded_images).values({
    filename,
    url: originalImage.url,
    key: `blog/${filename}`, // Keep original key format for compatibility
    contentType,
    size: buffer.length,
    altText: altText || null,
    thumbnailUrl: thumbnailImage?.url || null,
    smallUrl: smallImage?.url || null,
    mediumUrl: mediumImage?.url || null,
    largeUrl: largeImage?.url || null,
  });
  
  return {
    url: mediumImage?.url || originalImage.url, // Return medium size for editor by default
    key: `blog/${filename}`,
    variants: optimizedImages,
  };
}

export async function getAllUploadedImages() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(uploaded_images).orderBy(desc(uploaded_images.uploadedAt));
}

export async function updateImageAltText(id: number, altText: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.update(uploaded_images)
    .set({ altText })
    .where(eq(uploaded_images.id, id));
  
  return result;
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.delete(blog_posts).where(eq(blog_posts.id, id));
  return result;
}
