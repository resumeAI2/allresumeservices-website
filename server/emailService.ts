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

/**
 * Send lead magnet email with PDF download link
 */
export async function sendLeadMagnetEmail(name: string, email: string, pdfUrl: string): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email transporter not configured, skipping lead magnet email');
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

    console.log(`Lead magnet email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Failed to send lead magnet email:', error);
    return false;
  }
}
