import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  serviceInterest?: string;
  message: string;
}

/**
 * Create SES client with AWS credentials from environment variables
 */
function createSESClient(): SESClient | null {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    console.warn('[SES] AWS credentials not configured. Emails will not be sent.');
    console.warn('[SES] Required env vars: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY');
    return null;
  }

  return new SESClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Send email using Amazon SES API
 */
async function sendEmail(options: EmailOptions): Promise<boolean> {
  const sesClient = createSESClient();
  
  if (!sesClient) {
    console.log('[SES] Email client not configured, skipping email send');
    return false;
  }

  const fromEmail = process.env.SES_FROM_EMAIL;
  
  if (!fromEmail) {
    console.error('[SES] SES_FROM_EMAIL environment variable not set');
    return false;
  }

  // Convert to array if single recipient
  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  const command = new SendEmailCommand({
    Source: fromEmail,
    Destination: {
      ToAddresses: recipients,
    },
    Message: {
      Subject: {
        Data: options.subject,
        Charset: 'UTF-8',
      },
      Body: {
        Text: {
          Data: options.text,
          Charset: 'UTF-8',
        },
        Html: {
          Data: options.html,
          Charset: 'UTF-8',
        },
      },
    },
  });

  try {
    const response = await sesClient.send(command);
    console.log('[SES] Email sent successfully. MessageId:', response.MessageId);
    return true;
  } catch (error: any) {
    console.error('[SES] Failed to send email:', error.message);
    
    // Provide helpful error messages
    if (error.name === 'MessageRejected') {
      console.error('[SES] Email rejected. Check that sender email is verified in SES console.');
    } else if (error.name === 'MailFromDomainNotVerifiedException') {
      console.error('[SES] Domain not verified. Verify your domain in SES console.');
    } else if (error.name === 'ConfigurationSetDoesNotExistException') {
      console.error('[SES] Configuration set does not exist.');
    }
    
    return false;
  }
}

/**
 * Send contact form notification email
 */
export async function sendContactFormNotification(data: ContactFormData): Promise<boolean> {
  const recipientEmail = process.env.CONTACT_NOTIFICATION_EMAIL || process.env.SES_FROM_EMAIL;

  if (!recipientEmail) {
    console.error('[SES] No recipient email configured for contact form notifications');
    return false;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a8a; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
        New Contact Form Submission
      </h2>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 10px 0;"><strong>Name:</strong> ${data.name}</p>
        <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        ${data.phone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> ${data.phone}</p>` : ''}
        ${data.serviceInterest ? `<p style="margin: 10px 0;"><strong>Service Interest:</strong> ${data.serviceInterest}</p>` : ''}
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #1e3a8a;">Message:</h3>
        <p style="background-color: #ffffff; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 4px;">
          ${data.message.replace(/\n/g, '<br>')}
        </p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
        <p>This email was sent from the All Resume Services contact form.</p>
        <p>Submitted at: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}</p>
      </div>
    </div>
  `;

  const textContent = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.serviceInterest ? `Service Interest: ${data.serviceInterest}` : ''}

Message:
${data.message}

---
Submitted at: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}
  `;

  return await sendEmail({
    to: recipientEmail,
    subject: `New Contact Form Submission from ${data.name}`,
    html: htmlContent,
    text: textContent,
  });
}

/**
 * Send review request email to client
 */
export async function sendReviewRequestEmail(
  clientEmail: string,
  clientName: string,
  reviewLink: string
): Promise<boolean> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a8a; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
        We'd Love Your Feedback!
      </h2>
      
      <p style="font-size: 16px; line-height: 1.6;">
        Hi ${clientName},
      </p>
      
      <p style="font-size: 16px; line-height: 1.6;">
        Thank you for choosing All Resume Services! We hope you're thrilled with your new resume and that it's helping you land interviews.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6;">
        We'd be incredibly grateful if you could take a moment to share your experience by leaving us a Google review. Your feedback helps us improve and helps other job seekers find quality resume services.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${reviewLink}" 
           style="background-color: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          Leave a Google Review
        </a>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">
        It only takes a minute, and your review means the world to us!
      </p>
      
      <p style="font-size: 16px; line-height: 1.6;">
        Thank you again for your trust in All Resume Services.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6;">
        Best regards,<br>
        <strong>The All Resume Services Team</strong>
      </p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
        <p>All Resume Services | Professional Resume Writing</p>
        <p>Email: admin@allresumeservices.com.au | Phone: +61 410 934 371</p>
      </div>
    </div>
  `;

  const textContent = `
We'd Love Your Feedback!

Hi ${clientName},

Thank you for choosing All Resume Services! We hope you're thrilled with your new resume and that it's helping you land interviews.

We'd be incredibly grateful if you could take a moment to share your experience by leaving us a Google review. Your feedback helps us improve and helps other job seekers find quality resume services.

Leave a Google Review: ${reviewLink}

It only takes a minute, and your review means the world to us!

Thank you again for your trust in All Resume Services.

Best regards,
The All Resume Services Team

---
All Resume Services | Professional Resume Writing
Email: admin@allresumeservices.com.au | Phone: +61 410 934 371
  `;

  return await sendEmail({
    to: clientEmail,
    subject: "We'd Love Your Feedback - All Resume Services",
    html: htmlContent,
    text: textContent,
  });
}

/**
 * Send test email to verify SES configuration
 */
export async function sendTestEmail(recipientEmail: string): Promise<boolean> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a8a; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
        Amazon SES Test Email
      </h2>
      
      <p style="font-size: 16px; line-height: 1.6;">
        Congratulations! Your Amazon SES integration is working correctly.
      </p>
      
      <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #065f46;">
          ✅ <strong>SES Configuration Verified</strong>
        </p>
      </div>
      
      <p style="font-size: 14px; color: #6b7280;">
        Test sent at: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}
      </p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
        <p>All Resume Services - Email System</p>
      </div>
    </div>
  `;

  const textContent = `
Amazon SES Test Email

Congratulations! Your Amazon SES integration is working correctly.

✅ SES Configuration Verified

Test sent at: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}

---
All Resume Services - Email System
  `;

  return await sendEmail({
    to: recipientEmail,
    subject: 'Amazon SES Test Email - All Resume Services',
    html: htmlContent,
    text: textContent,
  });
}

/**
 * Check if SES is properly configured
 */
export function isSESConfigured(): boolean {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const fromEmail = process.env.SES_FROM_EMAIL;

  return !!(region && accessKeyId && secretAccessKey && fromEmail);
}
