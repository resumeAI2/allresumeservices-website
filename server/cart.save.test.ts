import { describe, it, expect, beforeEach } from 'vitest';
import { getDb } from './db';
import * as servicesService from './services';
import { cart_items } from '../drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';

describe('Cart Save for Later Functionality', () => {
  let testSessionId: string;
  let testUserId: number;
  let testServiceId: number;

  beforeEach(async () => {
    // Generate unique test identifiers
    testSessionId = `test_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    testUserId = Math.floor(Math.random() * 1000000) + 1000;
    testServiceId = 1; // Assuming service with ID 1 exists

    // Clean up any existing test data
    const db = await getDb();
    await db!.delete(cart_items)
      .where(eq(cart_items.sessionId, testSessionId));
    await db!.delete(cart_items)
      .where(eq(cart_items.userId, testUserId));
  });

  it('should add items to guest cart using session ID', async () => {
    // Add item to guest cart
    const cartItem = await servicesService.addToCart({
      serviceId: testServiceId,
      quantity: 1,
      sessionId: testSessionId,
    });

    expect(cartItem).toBeDefined();
    expect(cartItem.sessionId).toBe(testSessionId);
    expect(cartItem.serviceId).toBe(testServiceId);
    expect(cartItem.quantity).toBe(1);
    expect(cartItem.userId).toBeNull();
  });

  it('should retrieve guest cart items by session ID', async () => {
    // Add items to guest cart
    await servicesService.addToCart({
      serviceId: testServiceId,
      quantity: 2,
      sessionId: testSessionId,
    });

    // Retrieve cart items
    const cartItems = await servicesService.getCartItems(undefined, testSessionId);

    expect(cartItems).toBeDefined();
    expect(cartItems.length).toBeGreaterThan(0);
    expect(cartItems[0].quantity).toBe(2);
    expect(cartItems[0].service).toBeDefined();
  });

  it('should merge guest cart with user cart on login', async () => {
    // Add items to guest cart
    await servicesService.addToCart({
      serviceId: testServiceId,
      quantity: 1,
      sessionId: testSessionId,
    });

    // Verify guest cart has items
    const guestCartBefore = await servicesService.getCartItems(undefined, testSessionId);
    expect(guestCartBefore.length).toBe(1);

    // Merge guest cart with user cart (simulating login)
    await servicesService.mergeGuestCartWithUserCart(testUserId, testSessionId);

    // Verify items are now in user cart
    const userCart = await servicesService.getCartItems(testUserId);
    expect(userCart.length).toBe(1);
    expect(userCart[0].userId).toBe(testUserId);
    expect(userCart[0].serviceId).toBe(testServiceId);

    // Verify guest cart is cleared
    const guestCartAfter = await servicesService.getCartItems(undefined, testSessionId);
    expect(guestCartAfter.length).toBe(0);
  });

  it('should merge quantities when guest cart has same items as user cart', async () => {
    // Add item to user cart
    await servicesService.addToCart({
      serviceId: testServiceId,
      quantity: 2,
      userId: testUserId,
    });

    // Add same item to guest cart
    await servicesService.addToCart({
      serviceId: testServiceId,
      quantity: 3,
      sessionId: testSessionId,
    });

    // Merge carts
    await servicesService.mergeGuestCartWithUserCart(testUserId, testSessionId);

    // Verify quantities are merged
    const userCart = await servicesService.getCartItems(testUserId);
    expect(userCart.length).toBe(1);
    expect(userCart[0].quantity).toBe(5); // 2 + 3
  });

  it('should preserve user cart items when merging empty guest cart', async () => {
    // Add items to user cart
    await servicesService.addToCart({
      serviceId: testServiceId,
      quantity: 2,
      userId: testUserId,
    });

    // Merge with empty guest cart
    await servicesService.mergeGuestCartWithUserCart(testUserId, testSessionId);

    // Verify user cart is unchanged
    const userCart = await servicesService.getCartItems(testUserId);
    expect(userCart.length).toBe(1);
    expect(userCart[0].quantity).toBe(2);
  });

  it('should get correct cart item count for user', async () => {
    // Add multiple items to user cart
    await servicesService.addToCart({
      serviceId: testServiceId,
      quantity: 3,
      userId: testUserId,
    });

    const count = await servicesService.getCartItemCount(testUserId);
    expect(count).toBe(3);
  });

  it('should get correct cart item count for guest', async () => {
    // Add multiple items to guest cart
    await servicesService.addToCart({
      serviceId: testServiceId,
      quantity: 2,
      sessionId: testSessionId,
    });

    const count = await servicesService.getCartItemCount(undefined, testSessionId);
    expect(count).toBe(2);
  });

  it('should handle merging multiple different items from guest to user cart', async () => {
    const serviceId2 = 2; // Assuming service with ID 2 exists

    // Add different items to guest cart
    await servicesService.addToCart({
      serviceId: testServiceId,
      quantity: 1,
      sessionId: testSessionId,
    });
    await servicesService.addToCart({
      serviceId: serviceId2,
      quantity: 2,
      sessionId: testSessionId,
    });

    // Merge carts
    await servicesService.mergeGuestCartWithUserCart(testUserId, testSessionId);

    // Verify all items are in user cart
    const userCart = await servicesService.getCartItems(testUserId);
    expect(userCart.length).toBe(2);
    
    const item1 = userCart.find(item => item.serviceId === testServiceId);
    const item2 = userCart.find(item => item.serviceId === serviceId2);
    
    expect(item1).toBeDefined();
    expect(item1?.quantity).toBe(1);
    expect(item2).toBeDefined();
    expect(item2?.quantity).toBe(2);
  });
});
