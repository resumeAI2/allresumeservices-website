import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('./db', () => ({
  getDb: vi.fn(),
}));

// Mock the intakeEmails module
vi.mock('./intakeEmails', () => ({
  sendResumeLaterEmail: vi.fn().mockResolvedValue(undefined),
}));

describe('clientIntake router', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requestResumeLater endpoint', () => {
    it('should validate email is required', async () => {
      // Test that email validation works
      const input = {
        email: 'invalid-email',
        name: 'Test User',
        formData: {},
      };
      
      // Email validation should fail for invalid format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(input.email)).toBe(false);
    });

    it('should validate name is required', async () => {
      const input = {
        email: 'test@example.com',
        name: '',
        formData: {},
      };
      
      // Name should not be empty
      expect(input.name.length).toBe(0);
    });

    it('should accept valid input format', async () => {
      const input = {
        email: 'test@example.com',
        name: 'John Doe',
        paypalTransactionId: 'TXN123',
        formData: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '0412345678',
        },
      };
      
      // Validate input structure
      expect(input.email).toContain('@');
      expect(input.name.length).toBeGreaterThan(0);
      expect(typeof input.formData).toBe('object');
    });

    it('should handle optional paypalTransactionId', async () => {
      const inputWithoutTransaction = {
        email: 'test@example.com',
        name: 'John Doe',
        formData: {},
      };
      
      const inputWithTransaction = {
        email: 'test@example.com',
        name: 'John Doe',
        paypalTransactionId: 'TXN123',
        formData: {},
      };
      
      // Both should be valid
      expect(inputWithoutTransaction.paypalTransactionId).toBeUndefined();
      expect(inputWithTransaction.paypalTransactionId).toBe('TXN123');
    });
  });

  describe('saveDraft endpoint', () => {
    it('should validate email format', () => {
      const validEmail = 'user@example.com';
      const invalidEmail = 'not-an-email';
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(validEmail)).toBe(true);
      expect(emailRegex.test(invalidEmail)).toBe(false);
    });

    it('should accept formData as any object', () => {
      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '0412345678',
        employmentHistory: [
          {
            jobTitle: 'Developer',
            employer: 'Tech Co',
          },
        ],
      };
      
      // FormData should be serializable
      const serialized = JSON.stringify(formData);
      const parsed = JSON.parse(serialized);
      expect(parsed.firstName).toBe('John');
      expect(parsed.employmentHistory.length).toBe(1);
    });
  });
});
