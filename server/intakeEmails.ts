import nodemailer from 'nodemailer';
import { sendEmailFailureAlert } from './services/emailFailureAlert';
import { logEmail } from './services/emailLogger';

const SITE_URL = "https://allresumeservices.com.au";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "resumes@allresumeservices.com";

/**
 * Create email transporter using ProtonMail SMTP
 */
function createTransporter() {
  const emailUser = process.env.EMAIL_USER || 'admin@allresumeservices.com';
  const emailPass = process.env.SMTP_PASSWORD;
  const emailHost = process.env.EMAIL_HOST || 'smtp.protonmail.ch';
  const emailPort = parseInt(process.env.EMAIL_PORT || '587');

  if (!emailUser || !emailPass) {
    console.warn('[IntakeEmails] Email credentials not configured. Emails will not be sent.');
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
 * Send confirmation email to client after intake form submission
 */
export async function sendClientConfirmationEmail(
  clientEmail: string,
  clientName: string,
  purchasedService?: string
) {
  const subject = "Thank you for your information – All Résumé Services";
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #1e3a8a;
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #ffffff;
      padding: 30px 20px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    h1 {
      margin: 0;
      font-size: 24px;
    }
    p {
      margin: 16px 0;
    }
    .button {
      display: inline-block;
      background-color: #1e3a8a;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>All Résumé Services</h1>
  </div>
  
  <div class="content">
    <p>Dear ${clientName},</p>
    
    <p>Thank you for providing your details.</p>
    
    <p>Your information has been successfully received and linked to your order${purchasedService ? ` for <strong>${purchasedService}</strong>` : ''}. This allows us to begin preparing your documents accurately and efficiently.</p>
    
    <p>If any clarification is required, we will contact you directly. Otherwise, the process will move forward within the standard turnaround timeframe outlined at the time of purchase.</p>
    
    <p>We look forward to helping you achieve your career goals.</p>
    
    <p>Kind regards,<br>
    <strong>All Résumé Services</strong></p>
  </div>
  
  <div class="footer">
    <p>This is an automated message. Please do not reply to this email.</p>
    <p>&copy; ${new Date().getFullYear()} All Résumé Services. All rights reserved.</p>
  </div>
</body>
</html>
  `;

  const textBody = `
Dear ${clientName},

Thank you for providing your details.

Your information has been successfully received and linked to your order${purchasedService ? ` for ${purchasedService}` : ''}. This allows us to begin preparing your documents accurately and efficiently.

If any clarification is required, we will contact you directly. Otherwise, the process will move forward within the standard turnaround timeframe outlined at the time of purchase.

We look forward to helping you achieve your career goals.

Kind regards,
All Résumé Services

---
This is an automated message. Please do not reply to this email.
© ${new Date().getFullYear()} All Résumé Services. All rights reserved.
  `;

  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('[IntakeEmails] Email transporter not configured, skipping client confirmation email');
    return { success: false };
  }

  try {
    await transporter.sendMail({
      from: `"All Résumé Services" <admin@allresumeservices.com>`,
      to: clientEmail,
      subject: subject,
      text: textBody,
      html: htmlBody,
    });

    console.log(`[IntakeEmails] Client confirmation email sent successfully to ${clientEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error(`[IntakeEmails] Failed to send client confirmation email to ${clientEmail}:`, error);
    
    // Log failed email
    await logEmail({
      emailType: 'intake_confirmation',
      recipientEmail: clientEmail,
      recipientName: clientName,
      subject,
      status: 'failed',
      errorMessage: error?.message || 'Unknown error',
    });
    
    // Send admin failure alert
    await sendEmailFailureAlert({
      emailType: 'intake_confirmation',
      recipientEmail: clientEmail,
      recipientName: clientName,
      subject,
      errorMessage: error?.message || 'Unknown error',
      attemptedAt: new Date(),
    });
    
    return { success: false };
  }
}

/**
 * Send notification email to admin when new intake form is submitted
 */
export async function sendAdminNotificationEmail(
  clientName: string,
  clientEmail: string,
  purchasedService?: string,
  paypalTransactionId?: string,
  intakeRecordId?: number
) {
  const subject = "New Client Information Submitted – Paid Order";
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #059669;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #ffffff;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background-color: #f9fafb;
      font-weight: 600;
    }
    .button {
      display: inline-block;
      background-color: #059669;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 New Client Intake Submitted</h1>
  </div>
  
  <div class="content">
    <p><strong>A new client has completed the intake form for a paid order.</strong></p>
    
    <table>
      <tr>
        <th>Client Name</th>
        <td>${clientName}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td><a href="mailto:${clientEmail}">${clientEmail}</a></td>
      </tr>
      ${purchasedService ? `
      <tr>
        <th>Purchased Service</th>
        <td>${purchasedService}</td>
      </tr>
      ` : ''}
      ${paypalTransactionId ? `
      <tr>
        <th>PayPal Transaction ID</th>
        <td>${paypalTransactionId}</td>
      </tr>
      ` : ''}
      <tr>
        <th>Submission Time</th>
        <td>${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' })}</td>
      </tr>
      ${intakeRecordId ? `
      <tr>
        <th>Intake Record ID</th>
        <td>#${intakeRecordId}</td>
      </tr>
      ` : ''}
    </table>
    
    <a href="${SITE_URL}/admin/intake-records/${intakeRecordId || ''}" class="button">View Full Submission</a>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
      This is an automated notification from the All Résumé Services client intake system.
    </p>
  </div>
</body>
</html>
  `;

  const textBody = `
NEW CLIENT INTAKE SUBMITTED

A new client has completed the intake form for a paid order.

Client Name: ${clientName}
Email: ${clientEmail}
${purchasedService ? `Purchased Service: ${purchasedService}\n` : ''}${paypalTransactionId ? `PayPal Transaction ID: ${paypalTransactionId}\n` : ''}Submission Time: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' })}
${intakeRecordId ? `Intake Record ID: #${intakeRecordId}\n` : ''}
View full submission: ${SITE_URL}/admin/intake-records/${intakeRecordId || ''}

---
This is an automated notification from the All Résumé Services client intake system.
  `;

  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('[IntakeEmails] Email transporter not configured, skipping admin notification email');
    return { success: false };
  }

  try {
    await transporter.sendMail({
      from: `"All Résumé Services" <admin@allresumeservices.com>`,
      to: ADMIN_EMAIL,
      subject: subject,
      text: textBody,
      html: htmlBody,
    });

    console.log(`[IntakeEmails] Admin notification email sent successfully to ${ADMIN_EMAIL}`);
    return { success: true };
  } catch (error: any) {
    console.error(`[IntakeEmails] Failed to send admin notification email to ${ADMIN_EMAIL}:`, error);
    
    // Log failed email
    await logEmail({
      emailType: 'intake_admin_notification',
      recipientEmail: ADMIN_EMAIL,
      recipientName: 'Admin',
      subject,
      status: 'failed',
      errorMessage: error?.message || 'Unknown error',
    });
    
    // Send admin failure alert
    await sendEmailFailureAlert({
      emailType: 'intake_admin_notification',
      recipientEmail: ADMIN_EMAIL,
      subject,
      errorMessage: error?.message || 'Unknown error',
      attemptedAt: new Date(),
    });
    
    return { success: false };
  }
}

/**
 * Send resume-later email with tokenized link
 */
export async function sendResumeLaterEmail(
  clientEmail: string,
  clientName: string,
  resumeToken: string
) {
  const resumeUrl = `${SITE_URL}/thank-you-onboarding?resume_token=${resumeToken}`;
  const subject = "Complete Your Client Information Form – All Résumé Services";
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #1e3a8a;
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #ffffff;
      padding: 30px 20px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .button {
      display: inline-block;
      background-color: #1e3a8a;
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 600;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>All Résumé Services</h1>
  </div>
  
  <div class="content">
    <p>Dear ${clientName},</p>
    
    <p>We noticed you started filling out your client information form but haven't completed it yet.</p>
    
    <p>To ensure we can begin preparing your professional documents without delay, please take a few minutes to complete the form. Your progress has been saved, so you can pick up right where you left off.</p>
    
    <div style="text-align: center;">
      <a href="${resumeUrl}" class="button">Continue Your Form</a>
    </div>
    
    <p style="font-size: 14px; color: #6b7280;">
      This link is unique to you and will restore all the information you've already entered.
    </p>
    
    <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
    
    <p>Kind regards,<br>
    <strong>All Résumé Services</strong></p>
  </div>
  
  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} All Résumé Services. All rights reserved.</p>
  </div>
</body>
</html>
  `;

  const textBody = `
Dear ${clientName},

We noticed you started filling out your client information form but haven't completed it yet.

To ensure we can begin preparing your professional documents without delay, please take a few minutes to complete the form. Your progress has been saved, so you can pick up right where you left off.

Continue your form here:
${resumeUrl}

This link is unique to you and will restore all the information you've already entered.

If you have any questions or need assistance, please don't hesitate to contact us.

Kind regards,
All Résumé Services

---
© ${new Date().getFullYear()} All Résumé Services. All rights reserved.
  `;

  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('[IntakeEmails] Email transporter not configured, skipping resume-later email');
    return { success: false };
  }

  try {
    await transporter.sendMail({
      from: `"All Résumé Services" <admin@allresumeservices.com>`,
      to: clientEmail,
      subject: subject,
      text: textBody,
      html: htmlBody,
    });

    console.log(`[IntakeEmails] Resume-later email sent successfully to ${clientEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error(`[IntakeEmails] Failed to send resume-later email to ${clientEmail}:`, error);
    
    // Log failed email
    await logEmail({
      emailType: 'intake_resume_later',
      recipientEmail: clientEmail,
      recipientName: clientName,
      subject,
      status: 'failed',
      errorMessage: error?.message || 'Unknown error',
    });
    
    // Send admin failure alert
    await sendEmailFailureAlert({
      emailType: 'intake_resume_later',
      recipientEmail: clientEmail,
      recipientName: clientName,
      subject,
      errorMessage: error?.message || 'Unknown error',
      attemptedAt: new Date(),
    });
    
    return { success: false };
  }
}
