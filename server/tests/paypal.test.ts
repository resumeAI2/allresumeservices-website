import { describe, it, expect } from 'vitest';

describe('PayPal Configuration', () => {
  it('should have PAYPAL_CLIENT_ID configured', () => {
    expect(process.env.PAYPAL_CLIENT_ID).toBeDefined();
    expect(process.env.PAYPAL_CLIENT_ID).not.toBe('');
  });

  it('should have PAYPAL_CLIENT_SECRET configured', () => {
    expect(process.env.PAYPAL_CLIENT_SECRET).toBeDefined();
    expect(process.env.PAYPAL_CLIENT_SECRET).not.toBe('');
  });

  it('should have PAYPAL_MODE configured', () => {
    expect(process.env.PAYPAL_MODE).toBeDefined();
    expect(['sandbox', 'live']).toContain(process.env.PAYPAL_MODE);
  });

  it('should verify PayPal credentials are valid', async () => {
    const { verifyPayPalCredentials } = await import('../paypal');
    const isValid = await verifyPayPalCredentials();
    expect(isValid).toBe(true);
  });
});
