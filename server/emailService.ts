import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  serviceInterest?: string;
  message: string;
}

interface OrderData {
  orderId: number;
  customerName: string;
  customerEmail: string;
  packageName: string;
  amount: string;
  currency: string;
  paypalOrderId?: string;
}

/**
 * Create email transporter using ProtonMail SMTP
 * Uses environment variables for configuration
 */
function createTransporter() {
  const emailUser = process.env.EMAIL_USER || 'info@allresumeservices.com';
  const emailPass = process.env.SMTP_PASSWORD;
  const emailHost = process.env.EMAIL_HOST || 'smtp.protonmail.ch';
  const emailPort = parseInt(process.env.EMAIL_PORT || '587');

  if (!emailUser || !emailPass) {
    console.warn('[Email] ProtonMail SMTP credentials not configured. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

/**
 * Check if email is properly configured
 */
export function isEmailConfigured(): boolean {
  const emailUser = process.env.EMAIL_USER || 'info@allresumeservices.com';
  const emailPass = process.env.SMTP_PASSWORD;
  return !!(emailUser && emailPass);
}

/**
 * Send contact form notification email to admin
 */
export async function sendContactFormNotification(data: ContactFormData): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('[Email] Transporter not configured, skipping contact form notification');
    return false;
  }

  const recipientEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.CONTACT_NOTIFICATION_EMAIL || 'info@allresumeservices.com';

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

  try {
    await transporter.sendMail({
      from: `"All Resume Services" <info@allresumeservices.com>`,
      to: recipientEmail,
      subject: `New Contact Form Submission from ${data.name}`,
      text: textContent,
      html: htmlContent,
    });

    console.log('[Email] Contact form notification sent successfully');
    return true;
  } catch (error) {
    console.error('[Email] Failed to send contact form notification:', error);
    return false;
  }
}

/**
 * Send test email to verify configuration
 */
export async function sendTestEmail(recipientEmail: string): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    throw new Error('Email transporter not configured. Please check SMTP_PASSWORD environment variable.');
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a8a; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
        ProtonMail SMTP Test Email
      </h2>
      
      <p style="font-size: 16px; line-height: 1.6;">
        Congratulations! Your ProtonMail SMTP integration is working correctly.
      </p>
      
      <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #065f46;">
          ✅ <strong>Email Configuration Verified</strong>
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

  try {
    await transporter.sendMail({
      from: `"All Resume Services" <info@allresumeservices.com>`,
      to: recipientEmail,
      subject: 'Test Email from All Resume Services',
      text: 'This is a test email to verify your email configuration is working correctly.',
      html: htmlContent,
    });

    console.log('[Email] Test email sent successfully');
    return true;
  } catch (error) {
    console.error('[Email] Failed to send test email:', error);
    throw error;
  }
}

/**
 * Send lead magnet email with PDF download link
 */
export async function sendLeadMagnetEmail(name: string, email: string, pdfUrl: string): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('[Email] Transporter not configured, skipping lead magnet email');
    return false;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1e3a8a;">Your Free Resume Guide is Ready!</h1>
      
      <p>Hi ${name},</p>
      
      <p>Thank you for downloading our guide: <strong>"10 ATS Resume Mistakes Costing You Interviews"</strong></p>
      
      <p>This comprehensive guide reveals the most common mistakes that cause resumes to be automatically rejected by Applicant Tracking Systems—and exactly how to fix them.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <h2 style="margin-top: 0; color: #1e3a8a;">Download Your Guide</h2>
        <p style="margin-bottom: 16px;">Click the button below to download your PDF guide:</p>
        <a href="${pdfUrl}" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Download Guide (PDF)</a>
      </div>
      
      <h3 style="color: #1e3a8a;">What's Next?</h3>
      
      <p>After reading the guide, if you'd like professional help optimizing your resume for ATS and landing more interviews, we're here to help.</p>
      
      <p><strong>Our services include:</strong></p>
      <ul>
        <li>Professional Resume Writing (ATS-optimized)</li>
        <li>Cover Letter Writing</li>
        <li>LinkedIn Profile Optimization</li>
        <li>Selection Criteria Responses</li>
        <li>Career Consultation</li>
      </ul>
      
      <p>With 18+ years of experience and a 96% interview success rate, we know how to get you noticed.</p>
      
      <div style="background-color: #fef3c7; padding: 16px; border-left: 4px solid #f59e0b; margin: 24px 0;">
        <p style="margin: 0;"><strong>Special Offer:</strong> Mention this email when you contact us and receive a free 15-minute consultation to discuss your career goals.</p>
      </div>
      
      <p>Ready to get started? Visit our website or give us a call:</p>
      
      <p>
        <strong>Website:</strong> <a href="https://www.allresumeservices.com.au">www.allresumeservices.com.au</a><br>
        <strong>Phone:</strong> 0410 934 371<br>
        <strong>Email:</strong> admin@allresumeservices.com.au
      </p>
      
      <p>Best of luck with your job search!</p>
      
      <p>
        <strong>All Resume Services</strong><br>
        Professional Resume Writing | 18+ Years Experience | 96% Interview Success Rate
      </p>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
      
      <p style="font-size: 12px; color: #6b7280;">
        You're receiving this email because you requested our free ATS Resume Mistakes guide from allresumeservices.com.au. 
        If you no longer wish to receive emails from us, you can <a href="#" style="color: #6b7280;">unsubscribe here</a>.
      </p>
    </div>
  `;

  const textContent = `
Your Free Resume Guide is Ready!

Hi ${name},

Thank you for downloading our guide: "10 ATS Resume Mistakes Costing You Interviews"

Download your guide here: ${pdfUrl}

What's Next?

After reading the guide, if you'd like professional help optimizing your resume for ATS and landing more interviews, we're here to help.

Our services include:
- Professional Resume Writing (ATS-optimized)
- Cover Letter Writing
- LinkedIn Profile Optimization
- Selection Criteria Responses
- Career Consultation

With 18+ years of experience and a 96% interview success rate, we know how to get you noticed.

Special Offer: Mention this email when you contact us and receive a free 15-minute consultation to discuss your career goals.

Ready to get started? Visit our website or give us a call:
Website: https://www.allresumeservices.com.au
Phone: 0410 934 371
Email: admin@allresumeservices.com.au

Best of luck with your job search!

All Resume Services
Professional Resume Writing | 18+ Years Experience | 96% Interview Success Rate
  `;

  try {
    await transporter.sendMail({
      from: `"All Resume Services" <info@allresumeservices.com>`,
      to: email,
      subject: 'Your Free Guide: 10 ATS Resume Mistakes Costing You Interviews',
      text: textContent,
      html: htmlContent,
    });

    console.log(`[Email] Lead magnet email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send lead magnet email:', error);
    return false;
  }
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(orderData: OrderData): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('[Email] Transporter not configured, skipping order confirmation email');
    return false;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">✅ Order Confirmed!</h1>
      </div>
      
      <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #374151;">Hi ${orderData.customerName},</p>
        
        <p style="font-size: 16px; color: #374151;">
          Thank you for your order! We've received your payment and are excited to start working on your professional documents.
        </p>
        
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1f2937;">Order Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order ID:</td>
              <td style="padding: 8px 0; color: #1f2937; font-weight: 600; font-size: 14px; text-align: right;">#${orderData.orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Service:</td>
              <td style="padding: 8px 0; color: #1f2937; font-weight: 600; font-size: 14px; text-align: right;">${orderData.packageName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Amount Paid:</td>
              <td style="padding: 8px 0; color: #10b981; font-weight: 700; font-size: 16px; text-align: right;">${orderData.currency} $${orderData.amount}</td>
            </tr>
            ${orderData.paypalOrderId ? `
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">PayPal Transaction:</td>
              <td style="padding: 8px 0; color: #1f2937; font-size: 12px; text-align: right; font-family: monospace;">${orderData.paypalOrderId}</td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #1e40af; font-weight: 600;">📋 What Happens Next?</p>
          <ol style="margin: 10px 0; padding-left: 20px; color: #1e3a8a; font-size: 14px;">
            <li style="margin-bottom: 8px;">Our team will review your order within 24 hours</li>
            <li style="margin-bottom: 8px;">We'll contact you to schedule a consultation</li>
            <li style="margin-bottom: 8px;">Our expert writers will craft your documents</li>
            <li style="margin-bottom: 8px;">You'll receive your completed documents for review</li>
          </ol>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 25px;">
          If you have any questions, please don't hesitate to contact us at 
          <a href="mailto:admin@allresumeservices.com.au" style="color: #3b82f6; text-decoration: none;">admin@allresumeservices.com.au</a>
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">All Resume Services</p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">Professional Resume Writing & Career Services</p>
        </div>
      </div>
    </div>
  `;

  const textContent = `
Order Confirmed!

Hi ${orderData.customerName},

Thank you for your order! We've received your payment and are excited to start working on your professional documents.

Order Details:
- Order ID: #${orderData.orderId}
- Service: ${orderData.packageName}
- Amount Paid: ${orderData.currency} $${orderData.amount}
${orderData.paypalOrderId ? `- PayPal Transaction: ${orderData.paypalOrderId}` : ''}

What Happens Next?
1. Our team will review your order within 24 hours
2. We'll contact you to schedule a consultation
3. Our expert writers will craft your documents
4. You'll receive your completed documents for review

If you have any questions, please contact us at admin@allresumeservices.com.au

---
All Resume Services
Professional Resume Writing & Career Services
  `;

  try {
    await transporter.sendMail({
      from: `"All Resume Services" <info@allresumeservices.com>`,
      to: orderData.customerEmail,
      subject: `Order Confirmation #${orderData.orderId} - All Resume Services`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`[Email] Order confirmation sent successfully to ${orderData.customerEmail}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send order confirmation email:', error);
    return false;
  }
}

/**
 * Send review request email to client
 */
export async function sendReviewRequestEmail(
  clientEmail: string,
  clientName: string,
  reviewLink: string
): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('[Email] Transporter not configured, skipping review request email');
    return false;
  }

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

  try {
    await transporter.sendMail({
      from: `"All Resume Services" <info@allresumeservices.com>`,
      to: clientEmail,
      subject: "We'd Love Your Feedback - All Resume Services",
      text: textContent,
      html: htmlContent,
    });

    console.log(`[Email] Review request sent successfully to ${clientEmail}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send review request email:', error);
    return false;
  }
}
