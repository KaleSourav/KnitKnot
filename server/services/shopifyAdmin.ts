import { InternalOrder } from '../types';

export interface ShopifyAdminConfig {
  storeDomain: string;
  adminAccessToken: string;
  apiVersion: string;
}

export function getShopifyAdminConfig(): ShopifyAdminConfig {
  const storeDomain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.VITE_SHOPIFY_STORE_DOMAIN ||
    '04wv6h-ut.myshopify.com';
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '';
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2026-10';

  return { storeDomain, adminAccessToken, apiVersion };
}

export interface CreatedShopifyOrderResult {
  orderId: string; // GID e.g. gid://shopify/Order/8492048293
  orderNumber: string; // e.g. #1042
  financialStatus: string;
  createdAt: string;
}

const ORDER_CREATE_MUTATION = `
  mutation OrderCreate($order: OrderCreateOrderInput!) {
    orderCreate(order: $order) {
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
 * Creates a verified PAID order in Shopify using the Shopify Admin GraphQL API
 */
export async function createShopifyAdminOrder(
  order: InternalOrder,
  razorpayPaymentId: string
): Promise<CreatedShopifyOrderResult> {
  const { storeDomain, adminAccessToken, apiVersion } = getShopifyAdminConfig();

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

  // Handle mock / test mode when Admin token is not configured
  if (!adminAccessToken || adminAccessToken === 'mock_admin_token') {
    console.warn(
      `[ShopifyAdmin] ⚠️ SHOPIFY_ADMIN_ACCESS_TOKEN is not set. Simulating verified order creation for ${order.orderReference}.`
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

  // Prepare names
  const nameParts = (order.customer.name || '').trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Format line items
  const lineItems = order.items.map((item) => {
    return {
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
    };
  });

  const finalAmountStr = Number(order.pricing.finalAmount).toFixed(2);

  const orderInput: Record<string, any> = {
    lineItems,
    financialStatus: 'PAID',
    transactions: [
      {
        kind: 'SALE',
        status: 'SUCCESS',
        gateway: 'Razorpay',
        amount: finalAmountStr,
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
    sendReceipt: true, // Triggers Shopify's automated order confirmation email to the customer
  };

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
