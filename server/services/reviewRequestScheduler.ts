/**
 * Review Request Scheduler Service
 * 
 * Automatically schedules and sends review request emails 2-3 weeks after project completion
 */

import { db } from "../db";
import { intakeRecords } from "../../shared/schema";
import { eq, and, gte, lte, isNull } from "drizzle-orm";
import { generateReviewRequestEmail } from "../emails/reviewRequest";

// Google Review Link for All Resume Services
const GOOGLE_REVIEW_LINK = "https://g.page/r/CYourGoogleBusinessIDHere/review";

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
      .from(intakeRecords)
      .where(
        and(
          gte(intakeRecords.completedAt, startOfDay),
          lte(intakeRecords.completedAt, endOfDay),
          isNull(intakeRecords.reviewRequestSentAt),
          eq(intakeRecords.status, "completed")
        )
      );

    console.log(
      `[ReviewScheduler] Found ${eligibleRecords.length} records eligible for review requests`
    );

    for (const record of eligibleRecords) {
      try {
        await sendReviewRequest(record);
        
        // Update the record to mark review request as sent
        await db
          .update(intakeRecords)
          .set({
            reviewRequestSentAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(intakeRecords.id, record.id));

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
      processed: eligibleRecords.length,
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
    serviceName: record.service || "resume writing service",
    completionDate: record.completedAt?.toLocaleDateString() || "recently",
    googleReviewLink: GOOGLE_REVIEW_LINK,
  };

  const { subject, html, text } = generateReviewRequestEmail(emailData);

  // TODO: Integrate with your email service (e.g., SendGrid, AWS SES, Resend)
  // For now, we'll log the email details
  console.log(`[ReviewScheduler] Would send email to: ${record.email}`);
  console.log(`[ReviewScheduler] Subject: ${subject}`);
  
  // Example integration with a hypothetical email service:
  /*
  await emailService.send({
    to: record.email,
    from: "admin@allresumeservices.com.au",
    subject,
    html,
    text,
  });
  */
  
  // For demonstration, we'll just log it
  // In production, uncomment the email service integration above
}

/**
 * Manually trigger a review request for a specific record
 * Useful for testing or manual intervention
 */
export async function sendManualReviewRequest(recordId: number) {
  const record = await db
    .select()
    .from(intakeRecords)
    .where(eq(intakeRecords.id, recordId))
    .limit(1);

  if (!record || record.length === 0) {
    throw new Error(`Record ${recordId} not found`);
  }

  await sendReviewRequest(record[0]);
  
  await db
    .update(intakeRecords)
    .set({
      reviewRequestSentAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(intakeRecords.id, recordId));

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
