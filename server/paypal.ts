import axios from "axios";

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.warn("[PayPal] Missing credentials. Payment processing will not work.");
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
