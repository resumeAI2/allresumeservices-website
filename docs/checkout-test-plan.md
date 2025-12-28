# Checkout Flow Test Plan

**All Resume Services Website**  
**Version:** 1.0  
**Date:** December 28, 2025  
**Author:** Manus AI

---

## Overview

This test plan covers the complete checkout flow for the All Resume Services e-commerce functionality, including adding items to cart, applying discount codes, and completing purchases via PayPal integration.

---

## Test Environment

| Component | Details |
|-----------|---------|
| **Application URL** | Preview via Management UI or `/` route |
| **Payment Gateway** | PayPal (Sandbox/Live based on `PAYPAL_MODE` env) |
| **Database** | PostgreSQL with Drizzle ORM |
| **Authentication** | Optional (guest checkout supported) |

---

## Pre-Test Setup

Before executing tests, ensure the following:

1. **Promo codes exist** in the database (create via `/admin/promo-codes`)
2. **PayPal credentials** are configured (`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`)
3. **Email SMTP** is configured for order confirmations
4. **Test user account** (optional) for authenticated checkout testing

---

## Test Scenarios

### 1. Adding Items to Cart

#### Test 1.1: Add Single Service to Cart
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/pricing` or any service page | Page loads with service packages displayed |
| 2 | Click "Add to Cart" on a service package | Toast notification confirms item added |
| 3 | Check cart icon in header | Cart badge shows "1" item |
| 4 | Navigate to `/cart` | Cart page displays the added item with correct price |

#### Test 1.2: Add Multiple Services to Cart
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add "Professional Resume" package | Item appears in cart |
| 2 | Add "Cover Letter" package | Both items appear in cart |
| 3 | Add "LinkedIn Optimisation" package | All three items listed |
| 4 | Verify cart total | Total equals sum of all item prices |

#### Test 1.3: Add Service with Options/Variants
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to a service with tier options | Options displayed (e.g., Basic, Professional, Executive) |
| 2 | Select a specific tier | Price updates to reflect selection |
| 3 | Add to cart | Correct tier and price added to cart |

#### Test 1.4: Update Cart Quantity
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/cart` with items | Cart displays current items |
| 2 | Click remove button on an item | Item removed, total recalculated |
| 3 | Verify empty cart state | "Your cart is empty" message if all removed |

---

### 2. Applying Discount Codes

#### Test 2.1: Apply Valid Percentage Discount
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add items to cart totaling $500 | Cart shows $500 subtotal |
| 2 | Navigate to `/checkout` | Checkout page loads with promo code field |
| 3 | Enter valid 20% discount code (e.g., "SAVE20") | Code accepted, success message shown |
| 4 | Verify discount applied | Discount line shows -$100, total now $400 |

#### Test 2.2: Apply Valid Fixed Amount Discount
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add items to cart totaling $300 | Cart shows $300 subtotal |
| 2 | Enter fixed $50 discount code (e.g., "FLAT50") | Code accepted |
| 3 | Verify discount | Discount shows -$50, total now $250 |

#### Test 2.3: Apply Invalid/Expired Discount Code
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to checkout with items in cart | Checkout page displays |
| 2 | Enter invalid code "FAKECODE" | Error message: "Invalid promo code" |
| 3 | Enter expired code | Error message: "This promo code has expired" |
| 4 | Verify no discount applied | Original total remains unchanged |

#### Test 2.4: Apply Code Below Minimum Purchase
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add item totaling $50 to cart | Cart shows $50 |
| 2 | Apply code requiring $100 minimum | Error: "Minimum purchase of $100 required" |
| 3 | Add more items to exceed minimum | Code now applies successfully |

#### Test 2.5: Remove Applied Discount Code
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Apply valid discount code | Discount reflected in total |
| 2 | Click "Remove" or clear code field | Discount removed |
| 3 | Verify total | Original price restored |

#### Test 2.6: Single Use Code Validation
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Complete purchase with single-use code | Order successful |
| 2 | Start new checkout, apply same code | Error: "This code has already been used" |

---

### 3. Checkout Process

#### Test 3.1: Guest Checkout - Complete Flow
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add items to cart | Items in cart |
| 2 | Navigate to `/checkout` | Checkout form displayed |
| 3 | Fill in contact details (name, email, phone) | Form validates input |
| 4 | Fill in billing address | Address fields accept input |
| 5 | Review order summary | Correct items, quantities, and total shown |
| 6 | Click "Pay with PayPal" | Redirected to PayPal payment page |

#### Test 3.2: Authenticated User Checkout
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Log in to account | User authenticated |
| 2 | Add items and go to checkout | Form pre-filled with saved details |
| 3 | Complete purchase | Order linked to user account |
| 4 | Navigate to `/my-orders` | New order appears in order history |

#### Test 3.3: Form Validation
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Leave required fields empty | "Required" validation errors shown |
| 2 | Enter invalid email format | "Invalid email" error |
| 3 | Enter invalid phone format | Phone validation error |
| 4 | Fix all errors and submit | Form submits successfully |

---

### 4. Payment Processing (PayPal)

#### Test 4.1: Successful PayPal Payment
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Pay with PayPal" at checkout | PayPal popup/redirect opens |
| 2 | Log in to PayPal (sandbox for testing) | PayPal account authenticated |
| 3 | Confirm payment | Payment processed |
| 4 | Automatic redirect to success page | `/payment/success` page displayed |
| 5 | Verify order created | Order appears in `/admin/orders` |

#### Test 4.2: Cancelled PayPal Payment
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Pay with PayPal" | PayPal opens |
| 2 | Click "Cancel" in PayPal | Redirected to `/payment/cancel` |
| 3 | Verify cart preserved | Items still in cart for retry |
| 4 | Verify no order created | No pending order in admin |

#### Test 4.3: PayPal Payment Error
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Simulate payment failure (insufficient funds) | PayPal returns error |
| 2 | User sees error message | Clear error explanation shown |
| 3 | Option to retry | User can attempt payment again |

---

### 5. Post-Purchase Verification

#### Test 5.1: Order Confirmation Email
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Complete successful purchase | Order confirmed |
| 2 | Check email inbox | Order confirmation email received |
| 3 | Verify email contents | Order details, items, total, and receipt included |
| 4 | Check `/admin/email-logs` | Email delivery logged as "sent" |

#### Test 5.2: Admin Order Management
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/orders` | Orders list displayed |
| 2 | Find new order | Order appears with "paid" status |
| 3 | Click to view details | Full order details shown |
| 4 | Verify customer info | Name, email, items, discount (if applied) correct |

#### Test 5.3: Order Status Updates
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View order in admin | Current status shown |
| 2 | Update status to "In Progress" | Status updated, timestamp recorded |
| 3 | Update status to "Completed" | Final status saved |

---

### 6. Edge Cases & Error Handling

#### Test 6.1: Empty Cart Checkout Attempt
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/checkout` with empty cart | Redirected to cart or error shown |
| 2 | Message displayed | "Your cart is empty" with link to services |

#### Test 6.2: Session Timeout During Checkout
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Start checkout process | Form displayed |
| 2 | Wait for session timeout (if applicable) | Graceful handling |
| 3 | Attempt to submit | Re-authentication prompt or cart preserved |

#### Test 6.3: Network Error During Payment
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Initiate PayPal payment | Payment processing |
| 2 | Simulate network interruption | Error handled gracefully |
| 3 | User notification | Clear message to retry |

#### Test 6.4: Concurrent Promo Code Usage
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Two users apply same limited-use code simultaneously | First completion succeeds |
| 2 | Second user completes checkout | Error if code limit reached |

---

## Test Data

### Sample Promo Codes to Create

| Code | Type | Value | Min Purchase | Usage Limit | Expiry |
|------|------|-------|--------------|-------------|--------|
| SAVE20 | Percentage | 20% | $0 | Unlimited | None |
| FLAT50 | Fixed | $50 | $100 | Unlimited | None |
| WELCOME10 | Percentage | 10% | $0 | 1 per user | None |
| EXPIRED | Percentage | 15% | $0 | Unlimited | Past date |
| VIP100 | Fixed | $100 | $200 | 10 total | Future date |

### Test PayPal Sandbox Accounts
Use PayPal sandbox credentials for testing. Create test buyer accounts at [developer.paypal.com](https://developer.paypal.com).

---

## Acceptance Criteria

All tests must pass for checkout flow to be considered production-ready:

| Category | Pass Criteria |
|----------|---------------|
| **Cart Operations** | All add/remove/update functions work correctly |
| **Promo Codes** | Valid codes apply, invalid codes rejected with clear messages |
| **Checkout Form** | All validations work, data saved correctly |
| **PayPal Integration** | Successful payments create orders, cancellations handled |
| **Email Notifications** | Order confirmations sent and logged |
| **Admin Functions** | Orders visible and manageable in admin panel |

---

## Bug Reporting Template

When issues are found, report using this format:

```
**Bug Title:** [Brief description]
**Severity:** Critical / High / Medium / Low
**Steps to Reproduce:**
1. 
2. 
3. 
**Expected Result:** 
**Actual Result:** 
**Screenshots/Logs:** [Attach if applicable]
**Browser/Device:** 
```

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Tester | | | |
| Developer | | | |
| Product Owner | | | |

---

*This test plan should be executed before each major release to ensure checkout functionality remains stable and secure.*
