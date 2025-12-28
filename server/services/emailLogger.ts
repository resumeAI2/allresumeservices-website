/**
 * Email Logging Service
 * 
 * Tracks all email deliveries for monitoring and debugging
 */

import { getDb } from "../db";
import { email_logs } from "../../drizzle/schema";
import { desc, eq, and, gte, lte, sql } from "drizzle-orm";

export type EmailType = 
  | "contact_form"
  | "order_confirmation"
  | "order_admin_notification"
  | "review_request"
  | "lead_magnet"
  | "intake_confirmation"
  | "intake_admin_notification"
  | "intake_resume_later"
  | "test"
  | "free_review";

export type EmailStatus = "sent" | "failed" | "pending";

interface LogEmailParams {
  emailType: EmailType;
  recipientEmail: string;
  recipientName?: string;
  subject?: string;
  status: EmailStatus;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

/**
 * Log an email delivery attempt
 */
export async function logEmail(params: LogEmailParams): Promise<number | null> {
  const db = await getDb();
  if (!db) {
    console.error("[EmailLogger] Database not available");
    return null;
  }

  try {
    const result = await db.insert(email_logs).values({
      emailType: params.emailType,
      recipientEmail: params.recipientEmail,
      recipientName: params.recipientName || null,
      subject: params.subject || null,
      status: params.status,
      errorMessage: params.errorMessage || null,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
    });

    console.log(`[EmailLogger] Logged ${params.status} email: ${params.emailType} to ${params.recipientEmail}`);
    return result[0]?.insertId || null;
  } catch (error) {
    console.error("[EmailLogger] Failed to log email:", error);
    return null;
  }
}

/**
 * Get recent email logs
 */
export async function getRecentEmailLogs(limit: number = 50) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    const logs = await db
      .select()
      .from(email_logs)
      .orderBy(desc(email_logs.sentAt))
      .limit(limit);

    return logs.map(log => ({
      ...log,
      metadata: log.metadata ? JSON.parse(log.metadata) : null,
    }));
  } catch (error) {
    console.error("[EmailLogger] Failed to get recent logs:", error);
    return [];
  }
}

/**
 * Get email statistics
 */
export async function getEmailStatistics(days: number = 30) {
  const db = await getDb();
  if (!db) {
    return null;
  }

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total counts by status
    const allLogs = await db
      .select()
      .from(email_logs)
      .where(gte(email_logs.sentAt, startDate));

    const stats = {
      total: allLogs.length,
      sent: allLogs.filter(l => l.status === "sent").length,
      failed: allLogs.filter(l => l.status === "failed").length,
      pending: allLogs.filter(l => l.status === "pending").length,
      byType: {} as Record<string, number>,
      recentFailures: [] as any[],
    };

    // Count by type
    allLogs.forEach(log => {
      stats.byType[log.emailType] = (stats.byType[log.emailType] || 0) + 1;
    });

    // Get recent failures
    stats.recentFailures = allLogs
      .filter(l => l.status === "failed")
      .slice(0, 10)
      .map(log => ({
        ...log,
        metadata: log.metadata ? JSON.parse(log.metadata) : null,
      }));

    return stats;
  } catch (error) {
    console.error("[EmailLogger] Failed to get statistics:", error);
    return null;
  }
}

/**
 * Get logs by email type
 */
export async function getLogsByType(emailType: EmailType, limit: number = 50) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    const logs = await db
      .select()
      .from(email_logs)
      .where(eq(email_logs.emailType, emailType))
      .orderBy(desc(email_logs.sentAt))
      .limit(limit);

    return logs.map(log => ({
      ...log,
      metadata: log.metadata ? JSON.parse(log.metadata) : null,
    }));
  } catch (error) {
    console.error("[EmailLogger] Failed to get logs by type:", error);
    return [];
  }
}

/**
 * Get logs for a specific recipient
 */
export async function getLogsByRecipient(email: string, limit: number = 50) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    const logs = await db
      .select()
      .from(email_logs)
      .where(eq(email_logs.recipientEmail, email))
      .orderBy(desc(email_logs.sentAt))
      .limit(limit);

    return logs.map(log => ({
      ...log,
      metadata: log.metadata ? JSON.parse(log.metadata) : null,
    }));
  } catch (error) {
    console.error("[EmailLogger] Failed to get logs by recipient:", error);
    return [];
  }
}
