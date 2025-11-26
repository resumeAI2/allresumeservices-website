import { describe, expect, it } from "vitest";
import { verifyPayPalCredentials } from "./paypal";

describe("PayPal Integration", () => {
  it("should verify PayPal credentials are valid", async () => {
    const isValid = await verifyPayPalCredentials();
    expect(isValid).toBe(true);
  }, 10000); // 10 second timeout for API call
});
