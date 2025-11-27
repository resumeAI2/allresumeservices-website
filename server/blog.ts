import { getDb } from './db';
import { blog_posts, uploaded_images } from '../drizzle/schema';
import { eq, desc } from 'drizzle-orm';

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
  
  const query = publishedOnly
    ? db.select().from(blog_posts).where(eq(blog_posts.published, 1)).orderBy(desc(blog_posts.createdAt))
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

export async function uploadImage(filename: string, contentType: string, base64Data: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const { storagePut } = await import('./storage');
  
  // Convert base64 to buffer
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Generate unique filename
  const timestamp = Date.now();
  const ext = filename.split('.').pop();
  const uniqueFilename = `blog/${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
  
  // Upload to S3
  const result = await storagePut(uniqueFilename, buffer, contentType);
  
  // Save image metadata to database
  await db.insert(uploaded_images).values({
    filename,
    url: result.url,
    key: result.key,
    contentType,
    size: buffer.length,
  });
  
  return {
    url: result.url,
    key: result.key
  };
}

export async function getAllUploadedImages() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(uploaded_images).orderBy(desc(uploaded_images.uploadedAt));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.delete(blog_posts).where(eq(blog_posts.id, id));
  return result;
}
