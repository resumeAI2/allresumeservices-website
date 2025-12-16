/**
 * Cron Job for Review Request Automation
 * 
 * Runs daily at 9:00 AM to check for clients who completed projects 3 weeks ago
 * and sends them automated review request emails
 */

import { processReviewRequests } from "../services/reviewRequestScheduler";

/**
 * Main cron job function
 * This should be called daily by your cron scheduler
 */
export async function runReviewRequestCron() {
  console.log("[ReviewRequestCron] Starting daily review request processing...");
  
  try {
    const result = await processReviewRequests();
    
    console.log(
      `[ReviewRequestCron] Completed successfully. Processed ${result?.processed || 0} records.`
    );
    
    return result;
  } catch (error) {
    console.error("[ReviewRequestCron] Error during cron execution:", error);
    throw error;
  }
}

/**
 * Setup instructions for the cron job:
 * 
 * Option 1: Using node-cron (recommended for development/small scale)
 * ----------------------------------------------------------------
 * Install: pnpm add node-cron @types/node-cron
 * 
 * Add to your server startup file (server/_core/index.ts):
 * 
 * import cron from 'node-cron';
 * import { runReviewRequestCron } from './cron/reviewRequestCron';
 * 
 * // Run daily at 9:00 AM
 * cron.schedule('0 9 * * *', async () => {
 *   await runReviewRequestCron();
 * });
 * 
 * 
 * Option 2: Using system cron (recommended for production)
 * --------------------------------------------------------
 * Create a standalone script file (scripts/review-request-cron.ts):
 * 
 * import { runReviewRequestCron } from '../server/cron/reviewRequestCron';
 * 
 * runReviewRequestCron()
 *   .then(() => process.exit(0))
 *   .catch((error) => {
 *     console.error(error);
 *     process.exit(1);
 *   });
 * 
 * Then add to your system crontab:
 * 0 9 * * * cd /path/to/project && node scripts/review-request-cron.js
 * 
 * 
 * Option 3: Using external cron service (recommended for cloud deployments)
 * -------------------------------------------------------------------------
 * Create an API endpoint that triggers the cron:
 * 
 * router.post('/api/cron/review-requests', async (req, res) => {
 *   // Add authentication/secret token check here
 *   const result = await runReviewRequestCron();
 *   res.json(result);
 * });
 * 
 * Then use a service like:
 * - Vercel Cron
 * - AWS EventBridge
 * - Google Cloud Scheduler
 * - cron-job.org
 * 
 * To call this endpoint daily at 9:00 AM
 */

// Export for use in cron setup
export default runReviewRequestCron;
