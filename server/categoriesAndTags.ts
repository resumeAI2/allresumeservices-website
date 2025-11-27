import { getDb } from './db';
import { blog_categories, blog_tags, blog_post_tags } from '../drizzle/schema';
import { desc, eq, and } from 'drizzle-orm';

// ===== Categories =====

export async function createCategory(name: string, slug: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(blog_categories).values({
    name,
    slug,
    description: description || null,
  });

  return { success: true, id: result.insertId };
}

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];

  const categories = await db
    .select()
    .from(blog_categories)
    .orderBy(blog_categories.name);

  return categories;
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const [category] = await db
    .select()
    .from(blog_categories)
    .where(eq(blog_categories.id, id))
    .limit(1);

  return category || null;
}

export async function updateCategory(id: number, data: { name?: string; slug?: string; description?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(blog_categories)
    .set(data)
    .where(eq(blog_categories.id, id));

  return { success: true };
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(blog_categories)
    .where(eq(blog_categories.id, id));

  return { success: true };
}

// ===== Tags =====

export async function createTag(name: string, slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(blog_tags).values({
    name,
    slug,
  });

  return { success: true, id: result.insertId };
}

export async function getAllTags() {
  const db = await getDb();
  if (!db) return [];

  const tags = await db
    .select()
    .from(blog_tags)
    .orderBy(blog_tags.name);

  return tags;
}

export async function getTagById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const [tag] = await db
    .select()
    .from(blog_tags)
    .where(eq(blog_tags.id, id))
    .limit(1);

  return tag || null;
}

export async function updateTag(id: number, data: { name?: string; slug?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(blog_tags)
    .set(data)
    .where(eq(blog_tags.id, id));

  return { success: true };
}

export async function deleteTag(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // First delete all post-tag relationships
  await db
    .delete(blog_post_tags)
    .where(eq(blog_post_tags.tagId, id));

  // Then delete the tag
  await db
    .delete(blog_tags)
    .where(eq(blog_tags.id, id));

  return { success: true };
}

// ===== Post-Tag Relationships =====

export async function addTagToPost(postId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(blog_post_tags).values({
    postId,
    tagId,
  });

  return { success: true, id: result.insertId };
}

export async function removeTagFromPost(postId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(blog_post_tags)
    .where(and(
      eq(blog_post_tags.postId, postId),
      eq(blog_post_tags.tagId, tagId)
    ));

  return { success: true };
}

export async function getTagsForPost(postId: number) {
  const db = await getDb();
  if (!db) return [];

  const postTags = await db
    .select({
      id: blog_tags.id,
      name: blog_tags.name,
      slug: blog_tags.slug,
    })
    .from(blog_post_tags)
    .innerJoin(blog_tags, eq(blog_post_tags.tagId, blog_tags.id))
    .where(eq(blog_post_tags.postId, postId));

  return postTags;
}

export async function setPostTags(postId: number, tagIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Remove all existing tags for this post
  await db
    .delete(blog_post_tags)
    .where(eq(blog_post_tags.postId, postId));

  // Add new tags
  if (tagIds.length > 0) {
    await db.insert(blog_post_tags).values(
      tagIds.map(tagId => ({
        postId,
        tagId,
      }))
    );
  }

  return { success: true };
}
