# Amazon SES Integration Setup Guide

## Overview

This website now uses **Amazon SES (Simple Email Service) API integration** via AWS SDK v3 for all email communications. This provides better performance, higher sending limits, and more reliable delivery compared to traditional SMTP.

## What's Been Implemented

### Email Service Features

The following email functionality is now powered by Amazon SES:

1. **Contact Form Notifications** - Automatically sends notifications when customers submit the contact form
2. **Review Request Emails** - Sends automated review requests to clients 2-3 weeks after project completion
3. **Test Email Endpoint** - Admin interface to verify SES configuration and test email delivery

### Technical Implementation

| Component | Description | Location |
|-----------|-------------|----------|
| **SES Email Service** | Core email sending logic using AWS SDK v3 | `server/services/sesEmailService.ts` |
| **Contact Integration** | Contact form email notifications | `server/contact.ts` |
| **Review Scheduler** | Automated review request emails | `server/services/reviewRequestScheduler.ts` |
| **Test Endpoint** | API endpoint for testing SES | `server/routers.ts` (email router) |
| **Admin Test Page** | User interface for testing emails | `client/src/pages/AdminEmailTest.tsx` |

## Required Environment Variables

You must add the following **4 environment variables** in the Manus Secrets Panel:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-here
AWS_SECRET_ACCESS_KEY=your-secret-key-here
SES_FROM_EMAIL=admin@allresumeservices.com.au
```

### Variable Details

| Variable | Purpose | Example Value | Required |
|----------|---------|---------------|----------|
| `AWS_REGION` | AWS region where SES is configured | `us-east-1` or `ap-southeast-2` | Yes |
| `AWS_ACCESS_KEY_ID` | IAM user access key with SES permissions | `AKIAIOSFODNN7EXAMPLE` | Yes |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret access key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCY...` | Yes |
| `SES_FROM_EMAIL` | Verified sender email address | `admin@allresumeservices.com.au` | Yes |
| `CONTACT_NOTIFICATION_EMAIL` | Where contact form submissions are sent | `admin@allresumeservices.com.au` | Optional |

**Note:** If `CONTACT_NOTIFICATION_EMAIL` is not set, contact form notifications will be sent to `SES_FROM_EMAIL`.

## AWS SES Setup Steps

### Step 1: Create AWS Account and Access SES

1. Log in to your [AWS Console](https://console.aws.amazon.com/)
2. Navigate to **Amazon SES** (Simple Email Service)
3. Select your preferred region (e.g., `us-east-1` for US East, or `ap-southeast-2` for Sydney)

### Step 2: Verify Your Email Address or Domain

**For Email Verification (Quick Start):**

1. In SES console, go to **Verified identities**
2. Click **Create identity**
3. Select **Email address**
4. Enter `admin@allresumeservices.com.au`
5. Click **Create identity**
6. Check your inbox for verification email and click the verification link

**For Domain Verification (Recommended for Production):**

1. In SES console, go to **Verified identities**
2. Click **Create identity**
3. Select **Domain**
4. Enter `allresumeservices.com.au`
5. Follow instructions to add DNS records (DKIM, SPF, DMARC)
6. Wait for verification (usually 24-72 hours)

### Step 3: Request Production Access (Remove Sandbox Restrictions)

By default, SES accounts are in **sandbox mode**, which means you can only send emails to verified addresses. To send to any email address:

1. In SES console, go to **Account dashboard**
2. Click **Request production access**
3. Fill out the form:
   - **Mail type:** Transactional
   - **Website URL:** `https://allresumeservices.com.au`
   - **Use case description:** "Sending transactional emails for resume writing service including contact form notifications and automated review requests to clients"
   - **Compliance:** Confirm you have processes to handle bounces and complaints
4. Submit request (approval usually takes 24 hours)

### Step 4: Create IAM User with SES Permissions

1. Go to **IAM** (Identity and Access Management) in AWS Console
2. Click **Users** → **Create user**
3. Enter username: `ses-email-sender`
4. Click **Next**
5. Select **Attach policies directly**
6. Search for and select **AmazonSESFullAccess** (or create custom policy with minimum permissions)
7. Click **Next** → **Create user**
8. Click on the created user → **Security credentials** tab
9. Click **Create access key**
10. Select **Application running outside AWS**
11. Click **Next** → **Create access key**
12. **IMPORTANT:** Copy the **Access Key ID** and **Secret Access Key** immediately (you won't be able to see the secret again)

### Step 5: Add Credentials to Manus Secrets Panel

1. Open your Manus project
2. Click the **Management UI** icon (top right)
3. Navigate to **Settings** → **Secrets**
4. Add each environment variable:
   - `AWS_REGION` → Your selected region (e.g., `us-east-1`)
   - `AWS_ACCESS_KEY_ID` → The access key from Step 4
   - `AWS_SECRET_ACCESS_KEY` → The secret key from Step 4
   - `SES_FROM_EMAIL` → Your verified email (e.g., `admin@allresumeservices.com.au`)
5. Click **Save** for each variable

### Step 6: Test Email Integration

1. Navigate to `/admin/email-test` in your website
2. The configuration status should show **"SES Configured ✓"**
3. Enter your email address in the test form
4. Click **Send Test Email**
5. Check your inbox (and spam folder) for the test email
6. If successful, you should see a success message and receive the email within seconds

## Troubleshooting

### Configuration Not Detected

**Problem:** Admin test page shows "SES Not Configured"

**Solutions:**
- Verify all 4 environment variables are added in Secrets Panel
- Check for typos in variable names (they are case-sensitive)
- Restart the development server after adding secrets
- Check server logs for specific error messages

### Email Not Received

**Problem:** Test email sent successfully but not received

**Solutions:**
- **Check spam folder** - New domains often land in spam initially
- **Verify sender email** - Ensure `SES_FROM_EMAIL` is verified in SES console
- **Sandbox mode** - If account is in sandbox, recipient email must also be verified
- **Check SES sending limits** - New accounts have low limits (200 emails/day)
- **Review SES dashboard** - Check for bounces or complaints in AWS console

### "MessageRejected" Error

**Problem:** Error message indicates email was rejected

**Solutions:**
- Verify your sender email address in SES console
- If using domain, ensure all DNS records are properly configured
- Check that your IAM user has `ses:SendEmail` permission
- Verify you're not exceeding sending limits

### "Email address is not verified" Error

**Problem:** Cannot send to specific recipient

**Solutions:**
- If in sandbox mode, verify the recipient email in SES console
- Request production access to send to any email address
- Check that sender email (`SES_FROM_EMAIL`) is verified

## Email Templates

The system includes professionally designed email templates for:

### Contact Form Notification

Sent to admin when a customer submits the contact form. Includes:
- Customer name, email, phone
- Service interest
- Message content
- Submission timestamp

### Review Request Email

Sent to clients 2-3 weeks after project completion. Includes:
- Personalized greeting
- Thank you message
- Call-to-action button linking to Google Reviews
- Professional branding

### Test Email

Simple confirmation email to verify SES configuration is working correctly.

## API Endpoints

### Check SES Configuration

```typescript
// Query to check if SES is configured
const { data } = trpc.email.checkConfiguration.useQuery();
// Returns: { configured: boolean }
```

### Send Test Email

```typescript
// Mutation to send test email
const mutation = trpc.email.testSES.useMutation();
await mutation.mutateAsync({ recipientEmail: "test@example.com" });
// Returns: { success: true, message: "Test email sent to test@example.com" }
```

## Best Practices

### Email Deliverability

To ensure high deliverability rates:

1. **Verify your domain** instead of just email address
2. **Configure SPF, DKIM, and DMARC** records for your domain
3. **Monitor bounce and complaint rates** in SES dashboard
4. **Warm up your sending** - Start with low volume and gradually increase
5. **Use a professional from address** (e.g., `admin@` or `noreply@`)
6. **Include unsubscribe links** in marketing emails (not required for transactional)

### Security

1. **Never commit AWS credentials** to version control
2. **Use IAM user with minimum required permissions** (not root account)
3. **Rotate access keys regularly** (every 90 days recommended)
4. **Enable MFA** on your AWS account
5. **Monitor CloudWatch logs** for suspicious activity

### Cost Management

Amazon SES pricing (as of 2024):

- **First 62,000 emails per month:** FREE (when sent from EC2)
- **Beyond free tier:** $0.10 per 1,000 emails
- **Attachments:** $0.12 per GB

For a resume writing service sending ~100 emails/day, monthly cost would be approximately **$0.30 - $3.00**.

## Migration from SMTP

The old SMTP-based email service (`server/emailService.ts`) has been replaced but is still available as a fallback. If you need to revert:

1. Update imports in `server/contact.ts` and `server/services/reviewRequestScheduler.ts`
2. Change from `./services/sesEmailService` to `./emailService`
3. Add SMTP credentials (`EMAIL_USER`, `EMAIL_PASS`, `EMAIL_HOST`, `EMAIL_PORT`)

However, **SES API is strongly recommended** for better performance and reliability.

## Support and Resources

- **AWS SES Documentation:** https://docs.aws.amazon.com/ses/
- **AWS SES Pricing:** https://aws.amazon.com/ses/pricing/
- **SES Sending Limits:** https://docs.aws.amazon.com/ses/latest/dg/manage-sending-quotas.html
- **Email Best Practices:** https://docs.aws.amazon.com/ses/latest/dg/best-practices.html

## Admin Test Page

Access the email testing interface at: `/admin/email-test`

This page allows you to:
- Check if SES is properly configured
- Send test emails to verify delivery
- View helpful setup instructions
- Troubleshoot configuration issues

The test page provides real-time feedback on configuration status and email sending results.

---

**Implementation Date:** December 2024  
**Author:** Manus AI  
**Version:** 1.0
