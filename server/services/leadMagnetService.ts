import { getDb } from "../db";
import { leadMagnetSubscribers, type InsertLeadMagnetSubscriber } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const leadMagnetService = {
  async createSubscriber(data: InsertLeadMagnetSubscriber) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const [result] = await db.insert(leadMagnetSubscribers).values(data);
    return result;
  },

  async getAllSubscribers() {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(leadMagnetSubscribers);
  },

  async getSubscriberByEmail(email: string) {
    const db = await getDb();
    if (!db) return null;
    const [subscriber] = await db
      .select()
      .from(leadMagnetSubscribers)
      .where(eq(leadMagnetSubscribers.email, email));
    return subscriber || null;
  },
};
