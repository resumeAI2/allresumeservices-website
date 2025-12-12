# Review Request Automation System

## Overview

This system automatically sends Google review request emails to clients 3 weeks (21 days) after their project is completed. The automation helps maintain a steady flow of fresh reviews while the client experience is still recent.

## Components

### 1. Email Template (`server/emails/reviewRequest.ts`)

Professional HTML email template that includes:
- Personalized greeting with client name
- Service-specific messaging
- Prominent "Leave a Google Review" CTA button
- Explanation of why reviews matter
- Direct contact information for feedback
- Mobile-responsive design

### 2. Scheduler Service (`server/services/reviewRequestScheduler.ts`)

Core automation logic that:
- Identifies projects completed exactly 21 days ago
- Filters for clients who haven't received a review request yet
- Sends personalized review request emails
- Tracks sent requests in the database
- Provides manual trigger capability for testing

### 3. Cron Job (`server/cron/reviewRequestCron.ts`)

Daily scheduled task that runs the review request process. Includes setup instructions for three deployment options:
- **Development**: node-cron for local testing
- **Production**: System crontab for dedicated servers
- **Cloud**: API endpoint + external cron service (Vercel Cron, AWS EventBridge, etc.)

## Database Schema Updates Required

Add the following column to your `intakeRecords` table:

```typescript
reviewRequestSentAt: timestamp("review_request_sent_at"),
completedAt: timestamp("completed_at"), // If not already present
```

Migration SQL:

```sql
ALTER TABLE intake_records 
ADD COLUMN review_request_sent_at TIMESTAMP,
ADD COLUMN completed_at TIMESTAMP;
```

## Setup Instructions

### Step 1: Update Google Review Link

Edit `server/services/reviewRequestScheduler.ts` and replace the placeholder with your actual Google Business Profile review link:

```typescript
const GOOGLE_REVIEW_LINK = "https://g.page/r/YOUR_ACTUAL_GOOGLE_BUSINESS_ID/review";
```

**How to find your Google review link:**
1. Go to your Google Business Profile
2. Click "Get more reviews"
3. Copy the short link provided
4. It should look like: `https://g.page/r/CYourBusinessID/review`

### Step 2: Integrate Email Service

The system currently logs emails instead of sending them. Choose an email service and integrate:

**Option A: Resend (Recommended)**
```bash
pnpm add resend
```

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'All Resume Services <admin@allresumeservices.com.au>',
  to: record.email,
  subject,
  html,
});
```

**Option B: SendGrid**
```bash
pnpm add @sendgrid/mail
```

**Option C: AWS SES**
```bash
pnpm add @aws-sdk/client-ses
```

### Step 3: Set Up Cron Schedule

**For Development (node-cron):**

1. Install node-cron:
```bash
pnpm add node-cron @types/node-cron
```

2. Add to `server/_core/index.ts`:
```typescript
import cron from 'node-cron';
import { runReviewRequestCron } from '../cron/reviewRequestCron';

// Run daily at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('[Cron] Running review request automation...');
  await runReviewRequestCron();
});
```

**For Production (Cloud Deployment):**

Create an API endpoint in your tRPC router or Express app:

```typescript
// In your API routes
router.post('/api/cron/review-requests', async (req, res) => {
  // Verify cron secret to prevent unauthorized access
  const cronSecret = req.headers['x-cron-secret'];
  if (cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const result = await runReviewRequestCron();
  res.json(result);
});
```

Then use a cloud cron service to call this endpoint daily:
- **Vercel**: Use Vercel Cron in `vercel.json`
- **AWS**: EventBridge scheduled rule
- **Google Cloud**: Cloud Scheduler
- **External**: cron-job.org or EasyCron

### Step 4: Update Database Schema

Run the migration to add required columns:

```bash
pnpm db:push
```

Or manually execute the SQL migration shown above.

### Step 5: Mark Projects as Completed

Ensure your project completion workflow updates the `completedAt` timestamp:

```typescript
await db.update(intakeRecords)
  .set({
    status: 'completed',
    completedAt: new Date(),
  })
  .where(eq(intakeRecords.id, recordId));
```

## Testing

### Manual Test for a Specific Record

```typescript
import { sendManualReviewRequest } from './server/services/reviewRequestScheduler';

// Send review request for record ID 123
await sendManualReviewRequest(123);
```

### Test the Daily Cron

```typescript
import { runReviewRequestCron } from './server/cron/reviewRequestCron';

// Run manually to see what would be processed
await runReviewRequestCron();
```

## Configuration

Adjust timing and behavior in `server/services/reviewRequestScheduler.ts`:

```typescript
const config = {
  delayDays: 21,    // Change to 14 for 2 weeks, 28 for 4 weeks
  enabled: true,     // Set to false to disable automation
};
```

## Monitoring

The system logs all activity:
- Number of eligible records found
- Successful email sends
- Failures with error details

Monitor your logs to ensure the system is working correctly:

```bash
# View recent cron execution logs
grep "ReviewScheduler" logs/app.log

# Check for errors
grep "ERROR.*ReviewScheduler" logs/app.log
```

## Best Practices

1. **Timing**: 3 weeks is optimal - long enough for clients to use their documents, short enough that the experience is fresh

2. **Personalization**: The template uses client name and service type for better engagement

3. **Opt-out**: Include unsubscribe option if sending to large volumes

4. **Follow-up**: Don't send multiple review requests to the same client

5. **Monitoring**: Check logs weekly to ensure emails are sending successfully

6. **Testing**: Always test with your own email first before enabling for all clients

## Troubleshooting

**No emails being sent:**
- Check that `completedAt` timestamps are being set correctly
- Verify the cron job is running (check logs)
- Ensure email service credentials are configured
- Check that `enabled: true` in config

**Emails going to spam:**
- Use a professional email service (Resend, SendGrid, SES)
- Set up SPF, DKIM, and DMARC records for your domain
- Use a verified sender address

**Wrong timing:**
- Verify server timezone matches your business timezone
- Check `delayDays` configuration
- Ensure `completedAt` is set when project is actually completed, not when created

## Future Enhancements

- Add A/B testing for email subject lines
- Track review completion rate
- Send reminder if no review after 1 week
- Segment by service type for more targeted messaging
- Add SMS option for clients who prefer text messages

---

**Questions?** Contact the development team or refer to the inline code comments for more details.
