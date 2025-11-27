import { getDb } from './db';
import { contact_submissions } from '../drizzle/schema';
import { desc, eq } from 'drizzle-orm';
import { sendContactFormNotification } from './emailService';

interface ContactSubmissionInput {
  name: string;
  email: string;
  phone?: string;
  serviceInterest?: string;
  message: string;
  honeypot?: string;
  submissionTime?: number;
}

/**
 * Create a new contact form submission
 */
export async function createContactSubmission(input: ContactSubmissionInput) {
  // Spam protection: check honeypot field
  if (input.honeypot && input.honeypot.trim() !== '') {
    throw new Error("Invalid submission detected");
  }

  // Spam protection: check submission time (min 3 seconds from form mount)
  if (input.submissionTime) {
    const currentTime = Date.now();
    const timeDiff = (currentTime - input.submissionTime) / 1000;
    if (timeDiff < 3) {
      throw new Error("Submission too fast - please take your time");
    }
  }

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

  // Send email notification (non-blocking)
  sendContactFormNotification({
    name: input.name,
    email: input.email,
    phone: input.phone,
    serviceInterest: input.serviceInterest,
    message: input.message,
  }).catch(error => {
    console.error('Failed to send contact form notification:', error);
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

/**
 * Update contact submission notes
 */
export async function updateContactSubmissionNotes(id: number, notes: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(contact_submissions)
    .set({ notes })
    .where(eq(contact_submissions.id, id));

  return { success: true };
}

/**
 * Get contact submission by ID
 */
export async function getContactSubmissionById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const [submission] = await db
    .select()
    .from(contact_submissions)
    .where(eq(contact_submissions.id, id));

  return submission || null;
}
