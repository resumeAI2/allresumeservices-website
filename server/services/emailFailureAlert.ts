/**
 * Email Failure Alert Service
 * 
 * Sends admin notifications when email delivery fails
 * Uses a separate notification mechanism to avoid infinite loops
 */

import nodemailer from 'nodemailer';

interface FailureAlertData {
  emailType: string;
  recipientEmail: string;
  recipientName?: string;
  subject?: string;
  errorMessage: string;
  attemptedAt: Date;
}

// Track recent alerts to avoid spam (max 1 alert per email type per hour)
const recentAlerts: Map<string, Date> = new Map();
const ALERT_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check if we should send an alert (rate limiting)
 */
function shouldSendAlert(emailType: string): boolean {
  const key = emailType;
  const lastAlert = recentAlerts.get(key);
  
  if (!lastAlert) {
    return true;
  }
  
  const timeSinceLastAlert = Date.now() - lastAlert.getTime();
  return timeSinceLastAlert >= ALERT_COOLDOWN_MS;
}

/**
 * Record that an alert was sent
 */
function recordAlertSent(emailType: string): void {
  recentAlerts.set(emailType, new Date());
}

/**
 * Create a separate transporter for failure alerts
 * Uses the same SMTP but with different error handling
 */
function createAlertTransporter() {
  const emailUser = process.env.EMAIL_USER || 'info@allresumeservices.com';
  const emailPass = process.env.SMTP_PASSWORD;
  const emailHost = process.env.EMAIL_HOST || 'smtp.protonmail.ch';
  const emailPort = parseInt(process.env.EMAIL_PORT || '587');

  if (!emailUser || !emailPass) {
    console.warn('[FailureAlert] SMTP credentials not configured. Cannot send failure alerts.');
    return null;
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

/**
 * Send an admin notification when email delivery fails
 */
export async function sendEmailFailureAlert(data: FailureAlertData): Promise<boolean> {
  // Check rate limiting
  if (!shouldSendAlert(data.emailType)) {
    console.log(`[FailureAlert] Skipping alert for ${data.emailType} - cooldown active`);
    return false;
  }

  const transporter = createAlertTransporter();
  
  if (!transporter) {
    console.log('[FailureAlert] Transporter not configured, cannot send failure alert');
    return false;
  }

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'enquiries@allresumeservices.com';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin-bottom: 20px;">
        <h2 style="color: #dc2626; margin: 0 0 10px 0;">
          ⚠️ Email Delivery Failed
        </h2>
        <p style="margin: 0; color: #7f1d1d;">
          An email failed to send. Please investigate.
        </p>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1f2937; margin-top: 0;">Failure Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 140px;">Email Type:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.emailType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Recipient:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.recipientName ? `${data.recipientName} (${data.recipientEmail})` : data.recipientEmail}</td>
          </tr>
          ${data.subject ? `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Subject:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.subject}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Attempted At:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.attemptedAt.toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}</td>
          </tr>
        </table>
      </div>
      
      <div style="background-color: #fff7ed; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #c2410c; margin: 0 0 10px 0;">Error Message:</h4>
        <pre style="background-color: #ffffff; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 13px; color: #7f1d1d; margin: 0;">${data.errorMessage}</pre>
      </div>
      
      <div style="margin-top: 20px;">
        <h4 style="color: #1f2937;">Recommended Actions:</h4>
        <ul style="color: #4b5563;">
          <li>Check the email logs in the admin dashboard at <strong>/admin/email-logs</strong></li>
          <li>Verify SMTP credentials are still valid</li>
          <li>Check if the recipient email address is valid</li>
          <li>Review server logs for additional details</li>
        </ul>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
        <p>This is an automated alert from All Resume Services email monitoring system.</p>
        <p>Note: To prevent spam, you will only receive one alert per email type per hour.</p>
      </div>
    </div>
  `;

  const textContent = `
EMAIL DELIVERY FAILED

An email failed to send. Please investigate.

FAILURE DETAILS:
- Email Type: ${data.emailType}
- Recipient: ${data.recipientName ? `${data.recipientName} (${data.recipientEmail})` : data.recipientEmail}
${data.subject ? `- Subject: ${data.subject}` : ''}
- Attempted At: ${data.attemptedAt.toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}

ERROR MESSAGE:
${data.errorMessage}

RECOMMENDED ACTIONS:
1. Check the email logs in the admin dashboard at /admin/email-logs
2. Verify SMTP credentials are still valid
3. Check if the recipient email address is valid
4. Review server logs for additional details

---
This is an automated alert from All Resume Services email monitoring system.
Note: To prevent spam, you will only receive one alert per email type per hour.
  `;

  try {
    await transporter.sendMail({
      from: `"All Resume Services Alert" <info@allresumeservices.com>`,
      to: adminEmail,
      subject: `⚠️ Email Delivery Failed: ${data.emailType}`,
      text: textContent,
      html: htmlContent,
    });

    // Record that we sent this alert
    recordAlertSent(data.emailType);

    console.log(`[FailureAlert] Admin notified about ${data.emailType} failure`);
    return true;
  } catch (error: any) {
    // Don't try to send another alert if the alert itself fails
    console.error('[FailureAlert] Failed to send failure alert:', error?.message || error);
    return false;
  }
}

/**
 * Get the current alert cooldown status
 */
export function getAlertCooldownStatus(): Record<string, { lastAlert: Date; cooldownRemaining: number }> {
  const status: Record<string, { lastAlert: Date; cooldownRemaining: number }> = {};
  
  recentAlerts.forEach((lastAlert, emailType) => {
    const timeSinceLastAlert = Date.now() - lastAlert.getTime();
    const cooldownRemaining = Math.max(0, ALERT_COOLDOWN_MS - timeSinceLastAlert);
    
    status[emailType] = {
      lastAlert,
      cooldownRemaining,
    };
  });
  
  return status;
}
