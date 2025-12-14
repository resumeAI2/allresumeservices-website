import { describe, it, expect } from 'vitest';
import { sendTestEmail } from './emailService';

describe('Email Service - SMTP Configuration', () => {
  it('should send test email successfully with ProtonMail SMTP', async () => {
    // Test sending email to the configured address
    const testEmail = 'info@allresumeservices.com';
    
    try {
      const result = await sendTestEmail(testEmail);
      expect(result).toBe(true);
      console.log('✅ SMTP credentials validated successfully');
    } catch (error) {
      console.error('❌ SMTP validation failed:', error);
      throw new Error('Invalid SMTP credentials or configuration. Please check your ProtonMail settings.');
    }
  }, 30000); // 30 second timeout for email sending
});
