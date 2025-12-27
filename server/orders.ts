import { eq, desc, like, or, and, sql, gte, lte } from "drizzle-orm";
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
  
  // Send confirmation email when order is completed
  if (status === "completed") {
    const order = await getOrderById(orderId);
    if (order && order.customerEmail) {
      try {
        // Use ProtonMail SMTP for all emails
        const { sendOrderConfirmationEmail } = await import('./emailService');
        await sendOrderConfirmationEmail({
          orderId: order.id,
          customerName: order.customerName || 'Valued Customer',
          customerEmail: order.customerEmail,
          packageName: order.packageName,
          amount: order.amount,
          currency: order.currency,
          paypalOrderId: order.paypalOrderId || undefined,
        });
        console.log(`[Orders] Confirmation email sent for order #${orderId}`);
        
        // Also send admin notification
        try {
          const { sendAdminOrderNotificationEmail } = await import('./orderEmails');
          await sendAdminOrderNotificationEmail({
            orderId: order.id,
            customerName: order.customerName || 'Valued Customer',
            customerEmail: order.customerEmail,
            packageName: order.packageName,
            amount: order.amount,
            currency: order.currency,
            paypalOrderId: order.paypalOrderId || undefined,
          });
        } catch (adminError) {
          console.error(`[Orders] Failed to send admin notification for order #${orderId}:`, adminError);
        }
      } catch (error) {
        console.error(`[Orders] Failed to send confirmation email for order #${orderId}:`, error);
        // Don't throw error - email failure shouldn't prevent order update
      }
    }
  }
}

/**
 * Get all orders for a user
 */
export async function getUserOrders(userId: number): Promise<Order[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

/**
 * Get all orders (admin only) with optional filtering
 */
export async function getAllOrders(filters?: {
  status?: "pending" | "completed" | "cancelled" | "failed";
  search?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<Order[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  let query = db.select().from(orders);

  // Build where conditions
  const conditions = [];

  // Status filter
  if (filters?.status) {
    conditions.push(eq(orders.status, filters.status));
  }

  // Search filter (customer name, email, or order ID)
  if (filters?.search) {
    const searchTerm = `%${filters.search}%`;
    conditions.push(
      or(
        like(orders.customerName, searchTerm),
        like(orders.customerEmail, searchTerm),
        like(orders.paypalOrderId, searchTerm),
        sql`CAST(${orders.id} AS CHAR) LIKE ${searchTerm}`
      )
    );
  }

  // Date range filter
  if (filters?.startDate) {
    conditions.push(gte(orders.createdAt, filters.startDate));
  }
  if (filters?.endDate) {
    conditions.push(lte(orders.createdAt, filters.endDate));
  }

  // Apply conditions if any
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  // Order by most recent first
  return await query.orderBy(desc(orders.createdAt));
}

/**
 * Get order statistics for admin dashboard
 */
export async function getOrderStatistics(): Promise<{
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  failedOrders: number;
  revenueByMonth: { month: string; revenue: number }[];
}> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Get all orders
  const allOrders = await db.select().from(orders);

  // Calculate statistics
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders
    .filter(order => order.status === "completed")
    .reduce((sum, order) => sum + parseFloat(order.amount), 0);

  const pendingOrders = allOrders.filter(order => order.status === "pending").length;
  const completedOrders = allOrders.filter(order => order.status === "completed").length;
  const cancelledOrders = allOrders.filter(order => order.status === "cancelled").length;
  const failedOrders = allOrders.filter(order => order.status === "failed").length;

  // Calculate revenue by month (last 12 months)
  const revenueByMonth: { month: string; revenue: number }[] = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString('en-AU', { year: 'numeric', month: 'short' });
    
    const monthRevenue = allOrders
      .filter(order => {
        if (order.status !== "completed") return false;
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      })
      .reduce((sum, order) => sum + parseFloat(order.amount), 0);
    
    revenueByMonth.push({ month: monthKey, revenue: monthRevenue });
  }

  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    failedOrders,
    revenueByMonth,
  };
}

/**
 * Get recent orders (for dashboard widgets)
 */
export async function getRecentOrders(limit: number = 10): Promise<Order[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(limit);
}

/**
 * Update order details (admin only)
 */
export async function updateOrder(
  orderId: number,
  updates: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(orders).set(updates).where(eq(orders.id, orderId));
}

/**
 * Delete order (admin only - use with caution)
 */
export async function deleteOrder(orderId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(orders).where(eq(orders.id, orderId));
}
