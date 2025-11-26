import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { InsertOrder, Order, orders } from "../drizzle/schema";

/**
 * Create a new order
 */
export async function createOrder(order: InsertOrder): Promise<Order> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(orders).values(order);
  const orderId = Number(result[0].insertId);

  const createdOrder = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);

  if (!createdOrder[0]) {
    throw new Error("Failed to create order");
  }

  return createdOrder[0];
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: number): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result[0];
}

/**
 * Get order by PayPal order ID
 */
export async function getOrderByPayPalId(paypalOrderId: string): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.paypalOrderId, paypalOrderId))
    .limit(1);
  return result[0];
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "completed" | "cancelled" | "failed",
  paypalPayerId?: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const updateData: Partial<Order> = { status };
  if (paypalPayerId) {
    updateData.paypalPayerId = paypalPayerId;
  }

  await db.update(orders).set(updateData).where(eq(orders.id, orderId));
}

/**
 * Get all orders for a user
 */
export async function getUserOrders(userId: number): Promise<Order[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(orders).where(eq(orders.userId, userId));
}

/**
 * Get all orders (admin only)
 */
export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(orders);
}
