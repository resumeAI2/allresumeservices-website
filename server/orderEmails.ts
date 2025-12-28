import nodemailer from 'nodemailer';
import { sendEmailFailureAlert } from './services/emailFailureAlert';
import { logEmail } from './services/emailLogger';

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
 */
function createTransporter() {
  const emailUser = process.env.EMAIL_USER || 'info@allresumeservices.com';
  const emailPass = process.env.SMTP_PASSWORD;
  const emailHost = process.env.EMAIL_HOST || 'smtp.protonmail.ch';
  const emailPort = parseInt(process.env.EMAIL_PORT || '587');

  if (!emailUser || !emailPass) {
    console.warn('[OrderEmails] Email credentials not configured. Emails will not be sent.');
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
 * Send order confirmation email via SMTP (ProtonMail)
 */
export async function sendOrderConfirmationEmailSMTP(orderData: OrderData): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('[OrderEmails] Email transporter not configured, skipping order confirmation email');
    return false;
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
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
          <li style="margin-bottom: 8px;">Please complete the Client Information Form (link in your thank you page)</li>
          <li style="margin-bottom: 8px;">Our team will review your information within 24 hours</li>
          <li style="margin-bottom: 8px;">Our expert writers will craft your professional documents</li>
          <li style="margin-bottom: 8px;">You'll receive your completed documents for review</li>
        </ol>
      </div>
      
      <p style="font-size: 14px; color: #6b7280; margin-top: 25px;">
        If you have any questions, please don't hesitate to contact us at 
        <a href="mailto:enquiries@allresumeservices.com" style="color: #3b82f6; text-decoration: none;">enquiries@allresumeservices.com</a>
      </p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 12px;">All Résumé Services</p>
        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">Professional Resume Writing & Career Services</p>
      </div>
    </div>
  </div>
</body>
</html>
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
1. Please complete the Client Information Form (link in your thank you page)
2. Our team will review your information within 24 hours
3. Our expert writers will craft your professional documents
4. You'll receive your completed documents for review

If you have any questions, please contact us at enquiries@allresumeservices.com

---
All Résumé Services
Professional Resume Writing & Career Services
  `;

  try {
    await transporter.sendMail({
      from: `"All Résumé Services" <info@allresumeservices.com>`,
      to: orderData.customerEmail,
      subject: `Order Confirmation #${orderData.orderId} - All Résumé Services`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`[OrderEmails] Order confirmation email sent successfully to ${orderData.customerEmail}`);
    return true;
  } catch (error: any) {
    console.error(`[OrderEmails] Failed to send order confirmation email to ${orderData.customerEmail}:`, error);
    
    const subject = `Order Confirmation #${orderData.orderId} - All Résumé Services`;
    
    // Log failed email
    await logEmail({
      emailType: 'order_confirmation',
      recipientEmail: orderData.customerEmail,
      recipientName: orderData.customerName,
      subject,
      status: 'failed',
      errorMessage: error?.message || 'Unknown error',
      metadata: { orderId: orderData.orderId },
    });
    
    // Send admin failure alert
    await sendEmailFailureAlert({
      emailType: 'order_confirmation',
      recipientEmail: orderData.customerEmail,
      recipientName: orderData.customerName,
      subject,
      errorMessage: error?.message || 'Unknown error',
      attemptedAt: new Date(),
    });
    
    return false;
  }
}

/**
 * Send admin notification when new order is placed
 */
export async function sendAdminOrderNotificationEmail(orderData: OrderData): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('[OrderEmails] Email transporter not configured, skipping admin notification');
    return false;
  }

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'enquiries@allresumeservices.com';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-size: 24px;">💰 New Order Received!</h1>
    </div>
    
    <div style="background-color: #ffffff; padding: 25px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
      <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
        A new order has been placed and payment has been confirmed.
      </p>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Order ID:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">#${orderData.orderId}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Customer:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderData.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
            <a href="mailto:${orderData.customerEmail}" style="color: #3b82f6;">${orderData.customerEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Service:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${orderData.packageName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Amount:</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #10b981; font-weight: 700;">${orderData.currency} $${orderData.amount}</td>
        </tr>
        ${orderData.paypalOrderId ? `
        <tr>
          <td style="padding: 10px; color: #6b7280;">PayPal ID:</td>
          <td style="padding: 10px; font-family: monospace; font-size: 12px;">${orderData.paypalOrderId}</td>
        </tr>
        ` : ''}
      </table>
      
      <p style="font-size: 14px; color: #6b7280;">
        Time: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' })}
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
NEW ORDER RECEIVED!

A new order has been placed and payment has been confirmed.

Order ID: #${orderData.orderId}
Customer: ${orderData.customerName}
Email: ${orderData.customerEmail}
Service: ${orderData.packageName}
Amount: ${orderData.currency} $${orderData.amount}
${orderData.paypalOrderId ? `PayPal ID: ${orderData.paypalOrderId}` : ''}

Time: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Perth' })}
  `;

  try {
    await transporter.sendMail({
      from: `"All Résumé Services" <info@allresumeservices.com>`,
      to: adminEmail,
      subject: `💰 New Order #${orderData.orderId} - ${orderData.packageName}`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`[OrderEmails] Admin notification email sent successfully to ${adminEmail}`);
    return true;
  } catch (error: any) {
    console.error(`[OrderEmails] Failed to send admin notification email:`, error);
    
    const subject = `💰 New Order #${orderData.orderId} - ${orderData.packageName}`;
    
    // Log failed email
    await logEmail({
      emailType: 'order_admin_notification',
      recipientEmail: adminEmail,
      recipientName: 'Admin',
      subject,
      status: 'failed',
      errorMessage: error?.message || 'Unknown error',
      metadata: { orderId: orderData.orderId },
    });
    
    // Send admin failure alert
    await sendEmailFailureAlert({
      emailType: 'order_admin_notification',
      recipientEmail: adminEmail,
      subject,
      errorMessage: error?.message || 'Unknown error',
      attemptedAt: new Date(),
    });
    
    return false;
  }
}
