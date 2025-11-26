import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: { host: "test.example.com" },
      get: (key: string) => {
        if (key === "host") return "test.example.com";
        return undefined;
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("Payment Integration", () => {
  it("should create a payment order with valid package data", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.payment.createOrder({
      packageName: "Basic Package",
      amount: "125",
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      customerPhone: "0400000000",
    });

    expect(result).toHaveProperty("orderId");
    expect(result).toHaveProperty("paypalOrderId");
    expect(result).toHaveProperty("approvalUrl");
    expect(result.approvalUrl).toContain("paypal.com");
  }, 15000); // 15 second timeout for PayPal API call

  it("should retrieve order details by order ID", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // First create an order
    const createResult = await caller.payment.createOrder({
      packageName: "Standard Package",
      amount: "185",
      customerEmail: "test2@example.com",
    });

    // Then retrieve it
    const order = await caller.payment.getOrder({
      orderId: createResult.orderId,
    });

    expect(order).toBeDefined();
    expect(order?.packageName).toBe("Standard Package");
    expect(order?.amount).toBe("185");
    expect(order?.status).toBe("pending");
  }, 15000);
});
