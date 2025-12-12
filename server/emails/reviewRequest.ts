/**
 * Review Request Email Template
 * 
 * Sent 2-3 weeks after project completion to request Google reviews
 */

interface ReviewRequestEmailData {
  clientName: string;
  serviceName: string;
  completionDate: string;
  googleReviewLink: string;
}

export function generateReviewRequestEmail(data: ReviewRequestEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const { clientName, serviceName, googleReviewLink } = data;

  const subject = `How did we do, ${clientName}? Share your experience!`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Review Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 8px 8px 0 0;">
              <img src="https://allresumeservices.com.au/logo-white.png" alt="All Resume Services" style="max-width: 200px; height: auto;" />
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 20px; font-size: 24px; color: #1e3a8a; text-align: center;">
                We'd Love Your Feedback!
              </h1>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi ${clientName},
              </p>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for choosing All Resume Services for your ${serviceName}. We hope your new professional documents are helping you achieve your career goals!
              </p>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Your feedback is incredibly valuable to us and helps other job seekers make informed decisions. If you're happy with our service, we'd be grateful if you could take 2 minutes to share your experience on Google.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${googleReviewLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      ⭐ Leave a Google Review
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Your review helps us:
              </p>

              <ul style="margin: 0 0 20px; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #333333;">
                <li>Improve our services based on your feedback</li>
                <li>Help other job seekers find quality resume writing support</li>
                <li>Grow our small Australian business</li>
              </ul>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                If there's anything we could have done better, please don't hesitate to reach out to us directly at <a href="mailto:admin@allresumeservices.com.au" style="color: #1e3a8a; text-decoration: none;">admin@allresumeservices.com.au</a>. We're always looking to improve!
              </p>

              <p style="margin: 0 0 10px; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for your support!
              </p>

              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333333;">
                <strong>Sonia & The Team</strong><br />
                All Resume Services
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                <a href="https://allresumeservices.com.au" style="color: #1e3a8a; text-decoration: none; margin: 0 10px;">Website</a> |
                <a href="mailto:admin@allresumeservices.com.au" style="color: #1e3a8a; text-decoration: none; margin: 0 10px;">Email Us</a> |
                <a href="tel:0410934371" style="color: #1e3a8a; text-decoration: none; margin: 0 10px;">0410 934 371</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #999999;">
                © ${new Date().getFullYear()} All Resume Services. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
Hi ${clientName},

Thank you for choosing All Resume Services for your ${serviceName}. We hope your new professional documents are helping you achieve your career goals!

Your feedback is incredibly valuable to us and helps other job seekers make informed decisions. If you're happy with our service, we'd be grateful if you could take 2 minutes to share your experience on Google.

Leave a Google Review: ${googleReviewLink}

Your review helps us:
- Improve our services based on your feedback
- Help other job seekers find quality resume writing support
- Grow our small Australian business

If there's anything we could have done better, please don't hesitate to reach out to us directly at admin@allresumeservices.com.au. We're always looking to improve!

Thank you for your support!

Sonia & The Team
All Resume Services

Website: https://allresumeservices.com.au
Email: admin@allresumeservices.com.au
Phone: 0410 934 371
  `.trim();

  return { subject, html, text };
}
