import { eq, and, sql } from 'drizzle-orm';
import { getDb } from './db';
import { services, cart_items, type Service, type CartItem, type InsertCartItem } from '../drizzle/schema';

/**
 * Get all active services
 */
export async function getAllServices(): Promise<Service[]> {
  const db = await getDb();
  return db!.select().from(services).where(eq(services.active, 1)).orderBy(services.sortOrder);
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
    const result = await db!.insert(cart_items).values(data) as any;
    const inserted = await db!.select().from(cart_items).where(eq(cart_items.id, Number(result.insertId))).limit(1);
    return inserted[0];
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
  
  return result[0]?.count || 0;
}
