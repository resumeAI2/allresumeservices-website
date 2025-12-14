import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  serviceInterest?: string;
  message: string;
}

/**
 * Create email transporter
 * Uses environment variables for configuration
 */
function createTransporter() {
  // ProtonMail SMTP configuration
  const emailUser = process.env.EMAIL_USER || 'info@allresumeservices.com';
  const emailPass = process.env.SMTP_PASSWORD;
  const emailHost = process.env.EMAIL_HOST || 'smtp.protonmail.ch';
  const emailPort = parseInt(process.env.EMAIL_PORT || '587');

  if (!emailUser || !emailPass) {
    console.warn('Email credentials not configured. Emails will not be sent.');
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
 * Send contact form notification email
 */
export async function sendContactFormNotification(data: ContactFormData): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email transporter not configured, skipping email notification');
    return false;
  }

  const recipientEmail = process.env.CONTACT_NOTIFICATION_EMAIL || 'info@allresumeservices.com';

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

    console.log('Contact form notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send contact form notification email:', error);
    return false;
  }
}

/**
 * Send test email to verify configuration
 */
export async function sendTestEmail(recipientEmail: string): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    throw new Error('Email transporter not configured');
  }

  try {
    await transporter.sendMail({
      from: `"All Resume Services" <info@allresumeservices.com>`,
      to: recipientEmail,
      subject: 'Test Email from All Resume Services',
      text: 'This is a test email to verify your email configuration is working correctly.',
      html: '<p>This is a test email to verify your email configuration is working correctly.</p>',
    });

    console.log('Test email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send test email:', error);
    throw error;
  }
}
