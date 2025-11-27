import { getDb } from './db';
import { contact_submissions } from '../drizzle/schema';
import { desc, eq } from 'drizzle-orm';

interface ContactSubmissionInput {
  name: string;
  email: string;
  phone?: string;
  serviceInterest?: string;
  message: string;
}

/**
 * Create a new contact form submission
 */
export async function createContactSubmission(input: ContactSubmissionInput) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(contact_submissions).values({
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    serviceInterest: input.serviceInterest || null,
    message: input.message,
    status: "new",
  });

  return { success: true, id: result.insertId };
}

/**
 * Get all contact submissions
 */
export async function getAllContactSubmissions() {
  const db = await getDb();
  if (!db) return [];

  const submissions = await db
    .select()
    .from(contact_submissions)
    .orderBy(desc(contact_submissions.submittedAt));

  return submissions;
}

/**
 * Update contact submission status
 */
export async function updateContactSubmissionStatus(id: number, status: "new" | "contacted" | "converted" | "archived") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(contact_submissions)
    .set({ status })
    .where(eq(contact_submissions.id, id));

  return { success: true };
}
