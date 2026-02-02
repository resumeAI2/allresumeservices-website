import { getDb } from './db';
import { testimonials } from '../drizzle/schema';
import { desc, eq, and } from 'drizzle-orm';

interface TestimonialInput {
  clientName: string;
  clientTitle?: string;
  clientPhoto?: string;
  rating: number;
  testimonialText: string;
  serviceUsed?: string;
  featured?: number;
  approved?: number;
}

/**
 * Create a new testimonial
 */
export async function createTestimonial(input: TestimonialInput) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [inserted] = await db.insert(testimonials).values({
    clientName: input.clientName,
    clientTitle: input.clientTitle || null,
    clientPhoto: input.clientPhoto || null,
    rating: input.rating,
    testimonialText: input.testimonialText,
    serviceUsed: input.serviceUsed || null,
    featured: input.featured || 0,
    approved: input.approved || 1,
  }).returning();

  return { success: true, id: inserted?.id };
}

/**
 * Get all testimonials (optionally filtered)
 */
export async function getAllTestimonials(approvedOnly: boolean = false, featuredOnly: boolean = false) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(testimonials);

  if (approvedOnly && featuredOnly) {
    const results = await query
      .where(and(eq(testimonials.approved, 1), eq(testimonials.featured, 1)))
      .orderBy(desc(testimonials.createdAt));
    return results;
  } else if (approvedOnly) {
    const results = await query
      .where(eq(testimonials.approved, 1))
      .orderBy(desc(testimonials.createdAt));
    return results;
  } else if (featuredOnly) {
    const results = await query
      .where(eq(testimonials.featured, 1))
      .orderBy(desc(testimonials.createdAt));
    return results;
  }

  const results = await query.orderBy(desc(testimonials.createdAt));
  return results;
}

/**
 * Get a single testimonial by ID
 */
export async function getTestimonialById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const [testimonial] = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id))
    .limit(1);

  return testimonial || null;
}

/**
 * Update a testimonial
 */
export async function updateTestimonial(id: number, data: Partial<TestimonialInput>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(testimonials)
    .set(data)
    .where(eq(testimonials.id, id));

  return { success: true };
}

/**
 * Delete a testimonial
 */
export async function deleteTestimonial(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(testimonials)
    .where(eq(testimonials.id, id));

  return { success: true };
}
