import { getDb } from "./db";
import { promo_codes } from "../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

export interface CreatePromoCodeInput {
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  minPurchase?: string;
  maxUses?: number;
  expiresAt?: Date;
}

export interface ValidatePromoCodeResult {
  valid: boolean;
  message?: string;
  promoCode?: typeof promo_codes.$inferSelect;
  discountAmount?: number;
}

/**
 * Create a new promo code
 */
export async function createPromoCode(input: CreatePromoCodeInput) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [promoCode] = await db.insert(promo_codes).values({
    code: input.code.toUpperCase(),
    description: input.description,
    discountType: input.discountType,
    discountValue: input.discountValue,
    minPurchase: input.minPurchase,
    maxUses: input.maxUses,
    expiresAt: input.expiresAt,
    active: 1,
    usedCount: 0,
  });

  return promoCode;
}

/**
 * Get all promo codes with optional filters
 */
export async function getAllPromoCodes(filters?: {
  active?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  let query = db.select().from(promo_codes);

  if (filters?.active !== undefined) {
    query = query.where(eq(promo_codes.active, filters.active ? 1 : 0)) as any;
  }

  const codes = await query.orderBy(sql`${promo_codes.createdAt} DESC`);
  return codes;
}

/**
 * Get promo code by ID
 */
export async function getPromoCodeById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [promoCode] = await db
    .select()
    .from(promo_codes)
    .where(eq(promo_codes.id, id));

  return promoCode;
}

/**
 * Get promo code by code string
 */
export async function getPromoCodeByCode(code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [promoCode] = await db
    .select()
    .from(promo_codes)
    .where(eq(promo_codes.code, code.toUpperCase()));

  return promoCode;
}

/**
 * Update promo code
 */
export async function updatePromoCode(
  id: number,
  updates: Partial<CreatePromoCodeInput> & { active?: number }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = {};

  if (updates.code) updateData.code = updates.code.toUpperCase();
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.discountType) updateData.discountType = updates.discountType;
  if (updates.discountValue) updateData.discountValue = updates.discountValue;
  if (updates.minPurchase !== undefined) updateData.minPurchase = updates.minPurchase;
  if (updates.maxUses !== undefined) updateData.maxUses = updates.maxUses;
  if (updates.expiresAt !== undefined) updateData.expiresAt = updates.expiresAt;
  if (updates.active !== undefined) updateData.active = updates.active;

  await db.update(promo_codes).set(updateData).where(eq(promo_codes.id, id));

  return getPromoCodeById(id);
}

/**
 * Delete promo code
 */
export async function deletePromoCode(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(promo_codes).where(eq(promo_codes.id, id));
}

/**
 * Validate promo code and calculate discount
 */
export async function validatePromoCode(
  code: string,
  orderAmount: number
): Promise<ValidatePromoCodeResult> {
  const promoCode = await getPromoCodeByCode(code);

  if (!promoCode) {
    return {
      valid: false,
      message: "Invalid promo code",
    };
  }

  // Check if active
  if (promoCode.active === 0) {
    return {
      valid: false,
      message: "This promo code is no longer active",
    };
  }

  // Check expiration
  if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
    return {
      valid: false,
      message: "This promo code has expired",
    };
  }

  // Check usage limit
  if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
    return {
      valid: false,
      message: "This promo code has reached its usage limit",
    };
  }

  // Check minimum purchase
  if (promoCode.minPurchase) {
    const minPurchase = parseFloat(promoCode.minPurchase);
    if (orderAmount < minPurchase) {
      return {
        valid: false,
        message: `Minimum purchase of $${minPurchase} required to use this code`,
      };
    }
  }

  // Calculate discount
  let discountAmount = 0;
  const discountValue = parseFloat(promoCode.discountValue);

  if (promoCode.discountType === "percentage") {
    discountAmount = (orderAmount * discountValue) / 100;
  } else {
    discountAmount = discountValue;
  }

  // Ensure discount doesn't exceed order amount
  discountAmount = Math.min(discountAmount, orderAmount);

  return {
    valid: true,
    promoCode,
    discountAmount,
  };
}

/**
 * Increment promo code usage count
 */
export async function incrementPromoCodeUsage(code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(promo_codes)
    .set({ usedCount: sql`${promo_codes.usedCount} + 1` })
    .where(eq(promo_codes.code, code.toUpperCase()));
}

/**
 * Get promo code statistics
 */
export async function getPromoCodeStatistics() {
  const allCodes = await getAllPromoCodes();
  const activeCodes = allCodes.filter((code) => code.active === 1);
  const expiredCodes = allCodes.filter(
    (code) => code.expiresAt && new Date(code.expiresAt) < new Date()
  );
  const totalUsage = allCodes.reduce((sum, code) => sum + code.usedCount, 0);

  return {
    total: allCodes.length,
    active: activeCodes.length,
    expired: expiredCodes.length,
    totalUsage,
  };
}
