import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendEmailFailureAlert, getAlertCooldownStatus } from './emailFailureAlert';

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-message-id' }),
    })),
  },
}));

describe('emailFailureAlert', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up environment variables
    process.env.EMAIL_USER = 'test@example.com';
    process.env.SMTP_PASSWORD = 'test-password';
    process.env.ADMIN_NOTIFICATION_EMAIL = 'admin@example.com';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('sendEmailFailureAlert', () => {
    it('should send failure alert email with correct data', async () => {
      const nodemailer = await import('nodemailer');
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-id' });
      (nodemailer.default.createTransport as any).mockReturnValue({
        sendMail: mockSendMail,
      });

      const result = await sendEmailFailureAlert({
        emailType: 'contact_form',
        recipientEmail: 'customer@example.com',
        recipientName: 'John Doe',
        subject: 'Test Subject',
        errorMessage: 'SMTP connection failed',
        attemptedAt: new Date('2025-01-01T10:00:00Z'),
      });

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'admin@example.com',
          subject: expect.stringContaining('Email Delivery Failed'),
        })
      );
    });

    it('should include failure details in email content', async () => {
      const nodemailer = await import('nodemailer');
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-id' });
      (nodemailer.default.createTransport as any).mockReturnValue({
        sendMail: mockSendMail,
      });

      await sendEmailFailureAlert({
        emailType: 'order_confirmation',
        recipientEmail: 'customer@example.com',
        recipientName: 'Jane Smith',
        subject: 'Order Confirmation',
        errorMessage: 'Connection timeout',
        attemptedAt: new Date(),
      });

      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('order_confirmation');
      expect(callArgs.html).toContain('customer@example.com');
      expect(callArgs.html).toContain('Jane Smith');
      expect(callArgs.html).toContain('Connection timeout');
    });

    it('should return false when SMTP credentials are not configured', async () => {
      delete process.env.SMTP_PASSWORD;

      const result = await sendEmailFailureAlert({
        emailType: 'test',
        recipientEmail: 'test@example.com',
        errorMessage: 'Test error',
        attemptedAt: new Date(),
      });

      expect(result).toBe(false);
    });

    it('should respect rate limiting (cooldown)', async () => {
      const nodemailer = await import('nodemailer');
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-id' });
      (nodemailer.default.createTransport as any).mockReturnValue({
        sendMail: mockSendMail,
      });

      // First alert should succeed
      const result1 = await sendEmailFailureAlert({
        emailType: 'rate_limit_test',
        recipientEmail: 'test@example.com',
        errorMessage: 'First error',
        attemptedAt: new Date(),
      });
      expect(result1).toBe(true);

      // Second alert for same type should be rate limited
      const result2 = await sendEmailFailureAlert({
        emailType: 'rate_limit_test',
        recipientEmail: 'test@example.com',
        errorMessage: 'Second error',
        attemptedAt: new Date(),
      });
      expect(result2).toBe(false);

      // Different email type should still work
      const result3 = await sendEmailFailureAlert({
        emailType: 'different_type',
        recipientEmail: 'test@example.com',
        errorMessage: 'Different type error',
        attemptedAt: new Date(),
      });
      expect(result3).toBe(true);
    });
  });

  describe('getAlertCooldownStatus', () => {
    it('should return cooldown status for tracked email types', async () => {
      const nodemailer = await import('nodemailer');
      const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-id' });
      (nodemailer.default.createTransport as any).mockReturnValue({
        sendMail: mockSendMail,
      });

      // Send an alert to create a cooldown entry
      await sendEmailFailureAlert({
        emailType: 'cooldown_test',
        recipientEmail: 'test@example.com',
        errorMessage: 'Test error',
        attemptedAt: new Date(),
      });

      const status = getAlertCooldownStatus();
      expect(status).toHaveProperty('cooldown_test');
      expect(status['cooldown_test']).toHaveProperty('lastAlert');
      expect(status['cooldown_test']).toHaveProperty('cooldownRemaining');
      expect(status['cooldown_test'].cooldownRemaining).toBeGreaterThan(0);
    });
  });
});
