import axios from "axios";

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.warn("[PayPal] Missing credentials. Payment processing will not work.");
}

if (!PAYPAL_WEBHOOK_ID) {
  console.warn("[PayPal] Missing PAYPAL_WEBHOOK_ID. Webhook verification will not work.");
}

/**
 * Get PayPal access token for API requests
 */
async function getAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials not configured");
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

  const response = await axios.post(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

/**
 * Verify PayPal credentials are valid
 */
export async function verifyPayPalCredentials(): Promise<boolean> {
  try {
    await getAccessToken();
    return true;
  } catch (error) {
    console.error("[PayPal] Credential verification failed:", error);
    return false;
  }
}

export interface CreateOrderParams {
  amount: string;
  currency?: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

/**
 * Create a PayPal order
 */
export async function createPayPalOrder(params: CreateOrderParams) {
  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${PAYPAL_API_BASE}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: params.currency || "AUD",
            value: params.amount,
          },
          description: params.description,
        },
      ],
      application_context: {
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
        brand_name: "All Resume Services",
        user_action: "PAY_NOW",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

/**
 * Capture payment for an approved order
 */
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

/**
 * Get order details
 */
export async function getPayPalOrderDetails(orderId: string) {
  const accessToken = await getAccessToken();

  const response = await axios.get(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}

/**
 * Verify PayPal webhook signature
 * @see https://developer.paypal.com/api/rest/webhooks/
 */
export async function verifyWebhookSignature(
  headers: {
    'paypal-transmission-id': string;
    'paypal-transmission-time': string;
    'paypal-transmission-sig': string;
    'paypal-cert-url': string;
    'paypal-auth-algo': string;
  },
  rawBody: string
): Promise<boolean> {
  if (!PAYPAL_WEBHOOK_ID) {
    console.error("[PayPal Webhook] PAYPAL_WEBHOOK_ID not configured");
    return false;
  }

  try {
    const accessToken = await getAccessToken();

    const response = await axios.post(
      `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      {
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: JSON.parse(rawBody),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verificationStatus = response.data.verification_status;
    console.log(`[PayPal Webhook] Signature verification: ${verificationStatus}`);
    return verificationStatus === "SUCCESS";
  } catch (error) {
    console.error("[PayPal Webhook] Signature verification failed:", error);
    return false;
  }
}

/**
 * PayPal Webhook Event Types
 */
export type PayPalWebhookEventType =
  | "PAYMENT.CAPTURE.COMPLETED"
  | "PAYMENT.CAPTURE.DENIED"
  | "PAYMENT.CAPTURE.REFUNDED"
  | "CHECKOUT.ORDER.APPROVED"
  | "CHECKOUT.ORDER.COMPLETED";

export interface PayPalWebhookEvent {
  id: string;
  event_type: PayPalWebhookEventType;
  event_version: string;
  create_time: string;
  resource_type: string;
  resource: {
    id: string;
    status: string;
    amount?: {
      currency_code: string;
      value: string;
    };
    supplementary_data?: {
      related_ids?: {
        order_id?: string;
      };
    };
    [key: string]: any;
  };
  summary: string;
  links: Array<{ href: string; rel: string; method: string }>;
}

/**
 * Process PayPal webhook event
 */
export async function processWebhookEvent(event: PayPalWebhookEvent): Promise<{
  success: boolean;
  message: string;
}> {
  console.log(`[PayPal Webhook] Processing event: ${event.event_type} (${event.id})`);

  try {
    const { getOrderByPayPalId, updateOrderStatus } = await import("./orders");

    switch (event.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED": {
        // Payment was successfully captured
        const captureId = event.resource.id;
        const orderId = event.resource.supplementary_data?.related_ids?.order_id;
        
        if (orderId) {
          const order = await getOrderByPayPalId(orderId);
          if (order && order.status !== "completed") {
            await updateOrderStatus(order.id, "completed");
            console.log(`[PayPal Webhook] Order #${order.id} marked as completed via webhook`);
          }
        }
        return { success: true, message: `Payment capture completed: ${captureId}` };
      }

      case "PAYMENT.CAPTURE.DENIED": {
        // Payment was denied
        const orderId = event.resource.supplementary_data?.related_ids?.order_id;
        
        if (orderId) {
          const order = await getOrderByPayPalId(orderId);
          if (order && order.status === "pending") {
            await updateOrderStatus(order.id, "failed");
            console.log(`[PayPal Webhook] Order #${order.id} marked as failed via webhook`);
          }
        }
        return { success: true, message: "Payment capture denied" };
      }

      case "PAYMENT.CAPTURE.REFUNDED": {
        // Payment was refunded
        const orderId = event.resource.supplementary_data?.related_ids?.order_id;
        
        if (orderId) {
          const order = await getOrderByPayPalId(orderId);
          if (order) {
            // Update order status to refunded (you may want to add this status to your schema)
            await updateOrderStatus(order.id, "cancelled");
            console.log(`[PayPal Webhook] Order #${order.id} marked as cancelled (refunded) via webhook`);
            
            // Send refund notification email
            try {
              const { sendRefundNotificationEmail } = await import("./emailService");
              if (order.customerEmail) {
                await sendRefundNotificationEmail({
                  orderId: order.id,
                  customerName: order.customerName || "Customer",
                  customerEmail: order.customerEmail,
                  packageName: order.packageName,
                  amount: event.resource.amount?.value || order.amount,
                  currency: event.resource.amount?.currency_code || order.currency,
                });
              }
            } catch (emailError) {
              console.error("[PayPal Webhook] Failed to send refund email:", emailError);
            }
          }
        }
        return { success: true, message: "Payment refund processed" };
      }

      case "CHECKOUT.ORDER.APPROVED":
      case "CHECKOUT.ORDER.COMPLETED": {
        // Order was approved/completed - typically handled by return URL flow
        console.log(`[PayPal Webhook] Order event received: ${event.event_type}`);
        return { success: true, message: `Order ${event.event_type.toLowerCase()}` };
      }

      default:
        console.log(`[PayPal Webhook] Unhandled event type: ${event.event_type}`);
        return { success: true, message: `Unhandled event: ${event.event_type}` };
    }
  } catch (error) {
    console.error(`[PayPal Webhook] Error processing event:`, error);
    return { success: false, message: `Error: ${error instanceof Error ? error.message : "Unknown error"}` };
  }
}
