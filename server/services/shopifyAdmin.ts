import { InternalOrder } from '../types';

export interface ShopifyAdminConfig {
  storeDomain: string;
  apiVersion: string;
}

interface CachedAdminToken {
  token: string;
  expiresAt: number; // millisecond timestamp
  scope?: string;
}

// In-memory token cache (never persisted, expires with the node process or TTL)
let cachedAdminToken: CachedAdminToken | null = null;

// Concurrency mutex: in-flight Promise so parallel requests share one token exchange
let inFlightTokenPromise: Promise<string> | null = null;

/**
 * Resets the in-memory token cache (useful for testing or forced refresh)
 */
export function clearShopifyAdminTokenCache(): void {
  cachedAdminToken = null;
  inFlightTokenPromise = null;
}

/**
 * Internal worker to request a new access token via Shopify's Client Credentials Grant:
 * POST https://{store-domain}/admin/oauth/access_token
 * Content-Type: application/x-www-form-urlencoded
 * Body: grant_type=client_credentials&client_id=...&client_secret=...
 */
async function fetchNewAccessToken(): Promise<string> {
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  const storeDomain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.VITE_SHOPIFY_STORE_DOMAIN ||
    '04wv6h-ut.myshopify.com';

  if (process.env.MOCK_SHOPIFY === 'true') {
    return 'mock_admin_token';
  }

  if (!clientId || !clientSecret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[ShopifyAdmin] Missing credentials: SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET are required in production.'
      );
    }
    return 'mock_admin_token';
  }

  const tokenEndpoint = `https://${storeDomain}/admin/oauth/access_token`;
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  let response: Response;
  try {
    response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params.toString(),
    });
  } catch (netErr: any) {
    throw new Error(`[ShopifyAdmin] Network error connecting to Shopify OAuth: ${netErr?.message || netErr}`);
  }

  if (!response.ok) {
    const rawBody = await response.text();
    let sanitizedError = '';

    try {
      const parsedJson = JSON.parse(rawBody);
      sanitizedError = parsedJson.error_description || parsedJson.error || parsedJson.errors || '';
    } catch {
      const match =
        rawBody.match(/Oauth error ([^<:\n]+)(?::\s*([^<\n]+))?/i) ||
        rawBody.match(/<title>([^<]+)<\/title>/i);
      if (match) {
        sanitizedError = (match[2] ? `${match[1]}: ${match[2]}` : match[1]).trim();
      } else {
        sanitizedError = `HTTP ${response.status} ${response.statusText}`;
      }
    }

    // Specific user-requested handling for shop_not_permitted and related OAuth errors
    if (sanitizedError.includes('shop_not_permitted') || rawBody.includes('shop_not_permitted')) {
      throw new Error(
        `[ShopifyAdmin] Shopify OAuth Error: shop_not_permitted. Ensure the app "Knotsnco Backend Integration" is installed and approved on store "${storeDomain}".`
      );
    }
    if (
      sanitizedError.includes('application_cannot_be_found') ||
      rawBody.includes('application_cannot_be_found')
    ) {
      throw new Error(
        `[ShopifyAdmin] Shopify OAuth Error: application_cannot_be_found. The SHOPIFY_CLIENT_ID does not match an app registered for store "${storeDomain}".`
      );
    }
    if (
      sanitizedError.includes('invalid_client') ||
      sanitizedError.includes('invalid_request')
    ) {
      throw new Error(
        `[ShopifyAdmin] Shopify OAuth Error: invalid_client/invalid_request. Verify SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET.`
      );
    }

    throw new Error(
      `[ShopifyAdmin] Failed to obtain Shopify Admin access token (HTTP ${response.status}): ${sanitizedError}`
    );
  }

  const data = (await response.json()) as {
    access_token?: string;
    scope?: string;
    expires_in?: number;
  };

  if (!data.access_token) {
    throw new Error('[ShopifyAdmin] Shopify OAuth response did not contain an access_token.');
  }

  const expiresInSec = typeof data.expires_in === 'number' ? data.expires_in : 86400;
  const now = Date.now();

  cachedAdminToken = {
    token: data.access_token,
    expiresAt: now + expiresInSec * 1000,
    scope: data.scope,
  };

  return data.access_token;
}

/**
 * Obtains an Admin API access token using Shopify's Client Credentials Grant.
 * Caches the token in memory and automatically refreshes it 5 minutes before expiry.
 * Concurrent requests safely share a single in-flight Promise.
 */
export async function getShopifyAdminAccessToken(): Promise<string> {
  const now = Date.now();
  // Refresh if less than 5 minutes (300,000 ms) remain before expiration
  if (cachedAdminToken && cachedAdminToken.expiresAt - 300_000 > now) {
    return cachedAdminToken.token;
  }

  if (inFlightTokenPromise) {
    return inFlightTokenPromise;
  }

  inFlightTokenPromise = fetchNewAccessToken().finally(() => {
    inFlightTokenPromise = null;
  });

  return inFlightTokenPromise;
}

/**
 * Returns safe metadata about the current Shopify token without exposing secrets.
 */
export async function getShopifyAdminTokenDetails(): Promise<{
  hasToken: boolean;
  scope: string;
  expiresInSeconds: number;
  isCached: boolean;
}> {
  const token = await getShopifyAdminAccessToken();
  const now = Date.now();
  const remainingMs = cachedAdminToken ? Math.max(0, cachedAdminToken.expiresAt - now) : 0;
  return {
    hasToken: Boolean(token),
    scope: cachedAdminToken?.scope || '',
    expiresInSeconds: Math.floor(remainingMs / 1000),
    isCached: Boolean(cachedAdminToken),
  };
}

export function getShopifyAdminConfig(): ShopifyAdminConfig {
  const storeDomain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.VITE_SHOPIFY_STORE_DOMAIN ||
    '04wv6h-ut.myshopify.com';
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2026-10';

  return { storeDomain, apiVersion };
}

export interface CreatedShopifyOrderResult {
  orderId: string; // GID e.g. gid://shopify/Order/8492048293
  orderNumber: string; // e.g. #1042
  financialStatus: string;
  createdAt: string;
}

export const ORDER_CREATE_MUTATION = `
  mutation OrderCreate($order: OrderCreateOrderInput!, $options: OrderCreateOptionsInput) {
    orderCreate(order: $order, options: $options) {
      order {
        id
        name
        displayFinancialStatus
        createdAt
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Builds the exact OrderCreateOrderInput and OrderCreateOptionsInput objects
 */
export function buildShopifyOrderCreatePayload(
  order: InternalOrder,
  razorpayPaymentId: string
): { order: Record<string, any>; options: Record<string, any> } {
  const nameParts = (order.customer.name || '').trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || '';

  const lineItems = order.items.map((item) => ({
    variantId: item.variantId.startsWith('gid://')
      ? item.variantId
      : `gid://shopify/ProductVariant/${item.variantId}`,
    quantity: item.quantity,
    priceSet: {
      shopMoney: {
        amount: Number(item.unitPrice).toFixed(2),
        currencyCode: 'INR',
      },
    },
  }));

  const finalAmountStr = Number(order.pricing.finalAmount).toFixed(2);

  const orderInput: Record<string, any> = {
    lineItems,
    financialStatus: 'PAID',
    transactions: [
      {
        kind: 'SALE',
        status: 'SUCCESS',
        gateway: 'Razorpay',
        amountSet: {
          shopMoney: {
            amount: finalAmountStr,
            currencyCode: 'INR',
          },
        },
        authorizationCode: razorpayPaymentId,
      },
    ],
    email: order.customer.email,
    phone: order.customer.phone || undefined,
    shippingAddress: {
      address1: order.shippingAddress.address1,
      address2: order.shippingAddress.address2 || '',
      city: order.shippingAddress.city,
      province: order.shippingAddress.province || order.shippingAddress.state || '',
      zip: order.shippingAddress.zip,
      country: 'India',
      countryCode: 'IN',
      firstName,
      lastName,
      phone: order.customer.phone || undefined,
    },
    billingAddress: {
      address1: order.billingAddress.address1 || order.shippingAddress.address1,
      address2: order.billingAddress.address2 || order.shippingAddress.address2 || '',
      city: order.billingAddress.city || order.shippingAddress.city,
      province: order.billingAddress.province || order.billingAddress.state || order.shippingAddress.province || '',
      zip: order.billingAddress.zip || order.shippingAddress.zip,
      country: 'India',
      countryCode: 'IN',
      firstName,
      lastName,
      phone: order.customer.phone || undefined,
    },
    shippingLines: [
      {
        title: order.pricing.shippingCharge === 0 ? 'Free Standard Delivery' : 'Standard Delivery',
        priceSet: {
          shopMoney: {
            amount: Number(order.pricing.shippingCharge || 0).toFixed(2),
            currencyCode: 'INR',
          },
        },
      },
    ],
    note: `Order placed via Knotsnco Headless Storefront. Internal Ref: ${order.orderReference}. Razorpay Payment ID: ${razorpayPaymentId}`,
    tags: ['Knotsnco Headless', 'Razorpay Paid', `Ref:${order.orderReference}`],
    customAttributes: [
      { key: 'knotsnco_order_ref', value: order.orderReference },
      { key: 'razorpay_payment_id', value: razorpayPaymentId },
    ],
  };

  const optionsInput = {
    inventoryBehaviour: 'DECREMENT_OBEYING_POLICY',
    sendReceipt: true, // Triggers Shopify's automated order confirmation email to the customer
  };

  return {
    order: orderInput,
    options: optionsInput,
  };
}

/**
 * Creates a verified PAID order in Shopify using the Shopify Admin GraphQL API
 */
export async function createShopifyAdminOrder(
  order: InternalOrder,
  razorpayPaymentId: string
): Promise<CreatedShopifyOrderResult> {
  const { storeDomain, apiVersion } = getShopifyAdminConfig();
  const adminAccessToken = await getShopifyAdminAccessToken();

  // If already created (Idempotency safeguard)
  if (order.shopify?.orderId && order.shopify?.orderNumber) {
    console.log(`[ShopifyAdmin] Order ${order.orderReference} already has Shopify order ${order.shopify.orderNumber}. Skipping creation.`);
    return {
      orderId: order.shopify.orderId,
      orderNumber: order.shopify.orderNumber,
      financialStatus: 'PAID',
      createdAt: order.shopify.createdAt || new Date().toISOString(),
    };
  }

  // Handle mock / test mode when Admin token is mocked
  if (adminAccessToken === 'mock_admin_token') {
    console.warn(
      `[ShopifyAdmin] ⚠️ Running in mock mode. Simulating verified order creation for ${order.orderReference}.`
    );
    const mockOrderNumber = `#KNOTS-${Math.floor(1000 + Math.random() * 9000)}`;
    const mockOrderId = `gid://shopify/Order/mock_${Date.now()}`;
    return {
      orderId: mockOrderId,
      orderNumber: mockOrderNumber,
      financialStatus: 'PAID',
      createdAt: new Date().toISOString(),
    };
  }

  const endpoint = `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`;

  const { order: orderInput, options: optionsInput } = buildShopifyOrderCreatePayload(order, razorpayPaymentId);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminAccessToken,
    },
    body: JSON.stringify({
      query: ORDER_CREATE_MUTATION,
      variables: {
        order: orderInput,
        options: optionsInput,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify Admin API HTTP ${response.status}: ${errorText}`);
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    const msg = result.errors.map((e: any) => e.message).join(', ');
    throw new Error(`Shopify Admin GraphQL Error: ${msg}`);
  }

  const orderData = result.data?.orderCreate?.order;
  const userErrors = result.data?.orderCreate?.userErrors;

  if (userErrors && userErrors.length > 0) {
    const msg = userErrors.map((e: any) => `${e.field?.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Shopify Order Creation Rejected: ${msg}`);
  }

  if (!orderData || !orderData.id) {
    throw new Error('Shopify Admin API did not return a valid order object.');
  }

  console.log(`[ShopifyAdmin] Successfully created Shopify order ${orderData.name} (${orderData.id}) for Ref ${order.orderReference}`);

  return {
    orderId: orderData.id,
    orderNumber: orderData.name,
    financialStatus: orderData.displayFinancialStatus || 'PAID',
    createdAt: orderData.createdAt,
  };
}
