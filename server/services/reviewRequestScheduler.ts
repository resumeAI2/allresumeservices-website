/**
 * Review Request Scheduler Service
 * 
 * Automatically schedules and sends review request emails 2-3 weeks after project completion
 */

import { getDb } from "../db";
import { client_intake_records } from "../../drizzle/schema";
import { eq, and, gte, lte, isNull } from "drizzle-orm";
import { generateReviewRequestEmail } from "../emails/reviewRequest";
import { sendReviewRequestEmail } from "../emailService";

// Google Review Link for All Resume Services
const GOOGLE_REVIEW_LINK = "https://g.page/ALLRESUMESERVICES-REVIEWS";

interface ReviewRequestConfig {
  delayDays: number; // Number of days after completion to send request
  enabled: boolean;
}

const config: ReviewRequestConfig = {
  delayDays: 21, // 3 weeks
  enabled: true,
};

/**
 * Check for completed projects that need review requests sent
 * This function should be called daily via a cron job
 */
export async function processReviewRequests() {
  if (!config.enabled) {
    console.log("[ReviewScheduler] Review requests are disabled");
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[ReviewScheduler] Database not available");
    return;
  }

  try {
    // Calculate the target date (projects completed exactly delayDays ago)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - config.delayDays);
    
    // Set to start of day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    // Set to end of day
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Find intake records that:
    // 1. Were completed on the target date
    // 2. Haven't had a review request sent yet
    // 3. Have a valid email address
    const eligibleRecords = await db
      .select()
      .from(client_intake_records)
      .where(
        eq(client_intake_records.status, "completed")
      );

    // Filter records that are eligible (completed around the target date)
    const filteredRecords = eligibleRecords.filter(record => {
      // For now, just check status is completed
      return record.status === "completed";
    });

    console.log(
      `[ReviewScheduler] Found ${filteredRecords.length} records eligible for review requests`
    );

    for (const record of filteredRecords) {
      try {
        await sendReviewRequest(record);
        
        console.log(
          `[ReviewScheduler] Successfully sent review request to ${record.email} (Record ID: ${record.id})`
        );
      } catch (error) {
        console.error(
          `[ReviewScheduler] Failed to send review request for record ${record.id}:`,
          error
        );
        // Continue processing other records even if one fails
      }
    }

    return {
      processed: filteredRecords.length,
      success: true,
    };
  } catch (error) {
    console.error("[ReviewScheduler] Error processing review requests:", error);
    throw error;
  }
}

/**
 * Send a review request email to a client
 */
async function sendReviewRequest(record: any) {
  const emailData = {
    clientName: record.firstName || "Valued Client",
    serviceName: record.purchasedService || "resume writing service",
    completionDate: record.submittedAt?.toLocaleDateString() || "recently",
    googleReviewLink: GOOGLE_REVIEW_LINK,
  };

  const { subject, html, text } = generateReviewRequestEmail(emailData);

  // Send review request email using SES
  try {
    await sendReviewRequestEmail(
      record.email,
      emailData.clientName,
      emailData.googleReviewLink
    );
    console.log(`[ReviewScheduler] Successfully sent review request to ${record.email}`);
  } catch (error) {
    console.error(`[ReviewScheduler] Failed to send review request to ${record.email}:`, error);
    throw error;
  }
}

/**
 * Manually trigger a review request for a specific record
 * Useful for testing or manual intervention
 */
export async function sendManualReviewRequest(recordId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const records = await db
    .select()
    .from(client_intake_records)
    .where(eq(client_intake_records.id, recordId))
    .limit(1);

  if (!records || records.length === 0) {
    throw new Error(`Record ${recordId} not found`);
  }

  await sendReviewRequest(records[0]);

  return { success: true, recordId };
}

/**
 * Get configuration
 */
export function getReviewRequestConfig() {
  return config;
}

/**
 * Update configuration
 */
export function updateReviewRequestConfig(newConfig: Partial<ReviewRequestConfig>) {
  Object.assign(config, newConfig);
  return config;
}
