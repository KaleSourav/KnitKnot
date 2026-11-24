import crypto from 'crypto';

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
}

export function getRazorpayConfig(): RazorpayConfig {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

  return { keyId, keySecret, webhookSecret };
}

function getBasicAuthHeader(keyId: string, keySecret: string): string {
  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  return `Basic ${credentials}`;
}

export interface CreateOrderParams {
  orderReference: string;
  amountInPaise: number;
  notes?: Record<string, string>;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface CreatePaymentLinkParams {
  orderReference: string;
  amountInPaise: number;
  callbackUrl: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  description?: string;
}

export interface RazorpayPaymentLinkResult {
  id: string;
  short_url: string;
  status: string;
  reference_id: string;
}

/**
 * Creates a Razorpay Order using the standard Orders API
 */
export async function createRazorpayOrder(params: CreateOrderParams): Promise<RazorpayOrderResult> {
  const { keyId, keySecret } = getRazorpayConfig();

  if (!keyId || !keySecret) {
    console.warn('⚠️ Razorpay credentials missing in environment (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET). Using mock test order.');
    return {
      id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: params.amountInPaise,
      currency: 'INR',
      receipt: params.orderReference,
      status: 'created',
    };
  }

  const payload = {
    amount: params.amountInPaise,
    currency: 'INR',
    receipt: params.orderReference,
    notes: {
      orderReference: params.orderReference,
      customerName: params.customer?.name || '',
      customerEmail: params.customer?.email || '',
      customerPhone: params.customer?.phone || '',
      ...(params.notes || {}),
    },
  };

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBasicAuthHeader(keyId, keySecret),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay Orders API Error (${response.status}): ${errorText}`);
  }

  return (await response.json()) as RazorpayOrderResult;
}

/**
 * Creates a Razorpay Payment Link (Hosted payment page)
 */
export async function createRazorpayPaymentLink(params: CreatePaymentLinkParams): Promise<RazorpayPaymentLinkResult> {
  const { keyId, keySecret } = getRazorpayConfig();

  if (!keyId || !keySecret) {
    console.warn('⚠️ Razorpay credentials missing. Using mock test payment link.');
    return {
      id: `plink_mock_${Date.now()}`,
      short_url: `http://localhost:3000/#order-confirmation?orderRef=${params.orderReference}`,
      status: 'created',
      reference_id: params.orderReference,
    };
  }

  const payload = {
    amount: params.amountInPaise,
    currency: 'INR',
    accept_partial: false,
    reference_id: params.orderReference,
    description: params.description || `Knotsnco Handmade Order #${params.orderReference}`,
    customer: {
      name: params.customer.name,
      email: params.customer.email,
      contact: params.customer.phone,
    },
    notify: {
      sms: true,
      email: true,
    },
    reminder_enable: false,
    callback_url: params.callbackUrl,
    callback_method: 'get',
    notes: {
      orderReference: params.orderReference,
    },
  };

  const response = await fetch('https://api.razorpay.com/v1/payment_links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBasicAuthHeader(keyId, keySecret),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay Payment Link API Error (${response.status}): ${errorText}`);
  }

  return (await response.json()) as RazorpayPaymentLinkResult;
}

/**
 * Fetches verified payment details directly from Razorpay
 */
export async function fetchRazorpayPayment(paymentId: string): Promise<any> {
  const { keyId, keySecret } = getRazorpayConfig();

  if (!keyId || !keySecret) {
    // If mock testing
    if (paymentId.startsWith('pay_mock_') || paymentId.startsWith('pay_test_')) {
      return {
        id: paymentId,
        status: 'captured',
        currency: 'INR',
        method: 'upi',
      };
    }
    throw new Error('Razorpay keys not configured on server');
  }

  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      Authorization: getBasicAuthHeader(keyId, keySecret),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Razorpay payment (${response.status}): ${errorText}`);
  }

  return await response.json();
}

function safeTimingEqual(expected: string, actual: string): boolean {
  if (!expected || !actual) return false;
  const expectedBuf = Buffer.from(expected, 'hex');
  const actualBuf = Buffer.from(actual, 'hex');
  if (expectedBuf.length === 0 || actualBuf.length === 0 || expectedBuf.length !== actualBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

/**
 * Case A: Verifies Razorpay Standard Checkout signature
 * HMAC-SHA256(order_id + "|" + payment_id, key_secret)
 */
export function verifyStandardCheckoutSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const { keySecret } = getRazorpayConfig();

  // Allow explicit mock payment verification in local dev mode when signature is explicitly 'test_signature_valid'
  if ((!keySecret || keySecret === 'test_secret') && params.signature === 'test_signature_valid') {
    return true;
  }

  if (!keySecret) {
    console.error('Cannot verify signature: RAZORPAY_KEY_SECRET is not set.');
    return false;
  }

  const payload = `${params.orderId}|${params.paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(payload)
    .digest('hex');

  return safeTimingEqual(expectedSignature, params.signature);
}

/**
 * Case B: Verifies Razorpay Payment Link signature
 * HMAC-SHA256(payment_link_id + "|" + payment_link_reference_id + "|" + payment_link_status + "|" + payment_id, key_secret)
 */
export function verifyPaymentLinkSignature(params: {
  paymentLinkId: string;
  paymentLinkReferenceId: string;
  paymentLinkStatus: string;
  paymentId: string;
  signature: string;
}): boolean {
  const { keySecret } = getRazorpayConfig();

  if ((!keySecret || keySecret === 'test_secret') && params.signature === 'test_signature_valid') {
    return true;
  }

  if (!keySecret) {
    console.error('Cannot verify signature: RAZORPAY_KEY_SECRET is not set.');
    return false;
  }

  const payload = `${params.paymentLinkId}|${params.paymentLinkReferenceId}|${params.paymentLinkStatus}|${params.paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(payload)
    .digest('hex');

  return safeTimingEqual(expectedSignature, params.signature);
}

/**
 * Verifies Razorpay Webhook signature
 * HMAC-SHA256(rawBody, webhook_secret)
 */
export function verifyWebhookSignature(rawBody: string | Buffer, signature: string): boolean {
  const { webhookSecret } = getRazorpayConfig();

  if (!webhookSecret) {
    console.error('Cannot verify webhook signature: RAZORPAY_WEBHOOK_SECRET is not set.');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  return safeTimingEqual(expectedSignature, signature);
}
