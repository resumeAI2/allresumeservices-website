import { eq, and, sql } from 'drizzle-orm';
import { getDb } from './db';
import { services, cart_items, testimonials, type Service, type CartItem, type InsertCartItem } from '../drizzle/schema';

/**
 * Get all active services.
 * Requires DATABASE_URL and a migrated + seeded `services` table.
 */
export async function getAllServices(): Promise<Service[]> {
  const db = await getDb();
  if (!db) {
    throw new Error(
      'Services catalog is unavailable. Set DATABASE_URL in .env and ensure the database is reachable. Run migrations (e.g. pnpm drizzle-kit push) and seed (node scripts/seed-services-postgres.mjs).'
    );
  }
  try {
    return await db.select().from(services).where(eq(services.active, 1)).orderBy(services.sortOrder);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Services catalog could not be loaded: ${message}. Ensure the "services" table exists (run migrations) and is seeded.`);
  }
}

/**
 * Get services by type
 */
export async function getServicesByType(type: 'individual' | 'package' | 'addon'): Promise<Service[]> {
  const db = await getDb();
  return db!.select().from(services)
    .where(and(eq(services.active, 1), eq(services.type, type)))
    .orderBy(services.sortOrder);
}

/**
 * Get services by category
 */
export async function getServicesByCategory(category: string): Promise<Service[]> {
  const db = await getDb();
  return db!.select().from(services)
    .where(and(eq(services.active, 1), eq(services.category, category)))
    .orderBy(services.sortOrder);
}

/**
 * Get service by ID
 */
export async function getServiceById(id: number): Promise<Service | undefined> {
  const db = await getDb();
  const result = await db!.select().from(services).where(eq(services.id, id)).limit(1);
  return result[0];
}

/**
 * Add item to cart
 */
export async function addToCart(data: InsertCartItem): Promise<CartItem> {
  const db = await getDb();
  
  // Check if item already exists in cart
  const existing = await db!.select().from(cart_items)
    .where(and(
      data.userId ? eq(cart_items.userId, data.userId) : sql`${cart_items.userId} IS NULL`,
      data.sessionId ? eq(cart_items.sessionId, data.sessionId) : sql`${cart_items.sessionId} IS NULL`,
      eq(cart_items.serviceId, data.serviceId)
    ))
    .limit(1);
  
  if (existing.length > 0) {
    // Update quantity
    const newQuantity = existing[0].quantity + (data.quantity || 1);
    await db!.update(cart_items)
      .set({ quantity: newQuantity, updatedAt: new Date() })
      .where(eq(cart_items.id, existing[0].id));
    
    const updated = await db!.select().from(cart_items).where(eq(cart_items.id, existing[0].id)).limit(1);
    return updated[0];
  } else {
    // Insert new item
    const [inserted] = await db!.insert(cart_items).values(data).returning();
    if (!inserted) { throw new Error('Failed to insert cart item'); }
    return inserted;
  }
}

/**
 * Get cart items for user or session
 */
export async function getCartItems(userId?: number, sessionId?: string): Promise<Array<CartItem & { service: Service }>> {
  const db = await getDb();
  
  const whereClause = userId 
    ? eq(cart_items.userId, userId)
    : sessionId 
      ? eq(cart_items.sessionId, sessionId)
      : sql`1=0`; // Return empty if neither provided
  
  const items = await db!.select().from(cart_items).where(whereClause);
  
  // Fetch service details for each cart item
  const itemsWithServices = await Promise.all(
    items.map(async (item) => {
      const service = await getServiceById(item.serviceId);
      return { ...item, service: service! };
    })
  );
  
  return itemsWithServices;
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(itemId: number, quantity: number): Promise<void> {
  const db = await getDb();
  await db!.update(cart_items)
    .set({ quantity, updatedAt: new Date() })
    .where(eq(cart_items.id, itemId));
}

/**
 * Remove item from cart
 */
export async function removeFromCart(itemId: number): Promise<void> {
  const db = await getDb();
  await db!.delete(cart_items).where(eq(cart_items.id, itemId));
}

/**
 * Clear cart for user or session
 */
export async function clearCart(userId?: number, sessionId?: string): Promise<void> {
  const db = await getDb();
  
  if (userId) {
    await db!.delete(cart_items).where(eq(cart_items.userId, userId));
  } else if (sessionId) {
    await db!.delete(cart_items).where(eq(cart_items.sessionId, sessionId));
  }
}

/**
 * Get cart item count
 */
export async function getCartItemCount(userId?: number, sessionId?: string): Promise<number> {
  const db = await getDb();
  
  const whereClause = userId 
    ? eq(cart_items.userId, userId)
    : sessionId 
      ? eq(cart_items.sessionId, sessionId)
      : sql`1=0`;
  
  const result = await db!.select({ count: sql<number>`SUM(${cart_items.quantity})` })
    .from(cart_items)
    .where(whereClause);
  
  return Number(result[0]?.count) || 0;
}

/**
 * Merge guest cart with user cart on login
 * This function transfers items from a session-based cart to a user-based cart
 */
export async function mergeGuestCartWithUserCart(userId: number, sessionId: string): Promise<void> {
  const db = await getDb();
  
  // Get guest cart items
  const guestItems = await db!.select().from(cart_items)
    .where(eq(cart_items.sessionId, sessionId));
  
  if (guestItems.length === 0) {
    return; // No guest items to merge
  }
  
  // Get existing user cart items
  const userItems = await db!.select().from(cart_items)
    .where(eq(cart_items.userId, userId));
  
  // Merge items
  for (const guestItem of guestItems) {
    // Check if user already has this service in cart
    const existingUserItem = userItems.find(item => item.serviceId === guestItem.serviceId);
    
    if (existingUserItem) {
      // Update quantity - add guest quantity to user quantity
      await db!.update(cart_items)
        .set({ 
          quantity: existingUserItem.quantity + guestItem.quantity,
          updatedAt: new Date()
        })
        .where(eq(cart_items.id, existingUserItem.id));
    } else {
      // Transfer guest item to user cart
      await db!.update(cart_items)
        .set({ 
          userId,
          sessionId: null,
          updatedAt: new Date()
        })
        .where(eq(cart_items.id, guestItem.id));
    }
  }
  
  // Clean up any remaining guest items (those that were merged into existing user items)
  await db!.delete(cart_items)
    .where(and(
      eq(cart_items.sessionId, sessionId),
      sql`${cart_items.userId} IS NULL`
    ));
}

/**
 * Save current session cart to user account
 */
export async function saveCartToUser(userId: number, sessionId: string): Promise<void> {
  await mergeGuestCartWithUserCart(userId, sessionId);
}


// ============================================================================
// Testimonials Service
// ============================================================================

/**
 * Get featured testimonials for display on About Us page
 */
export async function getFeaturedTestimonials() {
  const db = await getDb();
  const { desc } = await import('drizzle-orm');
  const results = await db!.select()
    .from(testimonials)
    .where(and(eq(testimonials.featured, 1), eq(testimonials.approved, 1)))
    .orderBy(desc(testimonials.createdAt))
    .limit(10);
  
  return results;
}

/**
 * Get all testimonials (for admin)
 */
export async function getAllTestimonials() {
  const db = await getDb();
  const { desc } = await import('drizzle-orm');
  const results = await db!.select()
    .from(testimonials)
    .orderBy(desc(testimonials.createdAt));
  
  return results;
}

/**
 * Add a new testimonial
 */
export async function addTestimonial(data: {
  clientName: string;
  clientTitle?: string | null;
  rating: number;
  testimonialText: string;
  serviceUsed?: string | null;
  featured?: number;
  approved?: number;
}) {
  const db = await getDb();
  const [inserted] = await db!.insert(testimonials).values(data).returning();
  return { id: inserted?.id };
}

/**
 * Update testimonial
 */
export async function updateTestimonial(id: number, data: Partial<{
  clientName: string;
  clientTitle: string | null;
  rating: number;
  testimonialText: string;
  serviceUsed: string | null;
  featured: number;
  approved: number;
}>) {
  const db = await getDb();
  await db!.update(testimonials)
    .set(data)
    .where(eq(testimonials.id, id));
  
  return { success: true };
}

/**
 * Delete testimonial
 */
export async function deleteTestimonial(id: number) {
  const db = await getDb();
  await db!.delete(testimonials)
    .where(eq(testimonials.id, id));
  
  return { success: true };
}
