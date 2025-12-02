import { getDb } from './db';
import { email_subscribers } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export interface EmailSubscriber {
  id: number;
  email: string;
  name: string | null;
  source: string | null;
  caseStudyId: number | null;
  subscribed: number;
  createdAt: Date;
}

/**
 * Subscribe an email address
 */
export async function subscribeEmail(
  email: string,
  name?: string,
  source?: string,
  caseStudyId?: number
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Check if email already exists
  const existing = await db
    .select()
    .from(email_subscribers)
    .where(eq(email_subscribers.email, email))
    .limit(1);

  if (existing.length > 0) {
    // Update existing subscriber
    await db
      .update(email_subscribers)
      .set({
        subscribed: 1,
        name: name || existing[0].name,
        source: source || existing[0].source,
        caseStudyId: caseStudyId || existing[0].caseStudyId,
      })
      .where(eq(email_subscribers.email, email));

    return { success: true, alreadySubscribed: true };
  }

  // Insert new subscriber
  await db.insert(email_subscribers).values({
    email,
    name: name || null,
    source: source || null,
    caseStudyId: caseStudyId || null,
    subscribed: 1,
    createdAt: new Date(),
  });

  return { success: true, alreadySubscribed: false };
}

/**
 * Unsubscribe an email address
 */
export async function unsubscribeEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db
    .update(email_subscribers)
    .set({ subscribed: 0 })
    .where(eq(email_subscribers.email, email));

  return { success: true };
}

/**
 * Get all subscribers
 */
export async function getAllSubscribers(subscribedOnly: boolean = true) {
  const db = await getDb();
  if (!db) return [];

  if (subscribedOnly) {
    return await db
      .select()
      .from(email_subscribers)
      .where(eq(email_subscribers.subscribed, 1));
  }

  return await db.select().from(email_subscribers);
}

/**
 * Get subscriber count
 */
export async function getSubscriberCount() {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select()
    .from(email_subscribers)
    .where(eq(email_subscribers.subscribed, 1));

  return result.length;
}
