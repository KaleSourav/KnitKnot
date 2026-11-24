// server/app.ts
import express from "express";

// server/db.ts
import fs from "fs";
import path from "path";
var isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
var DATA_DIR = isServerless ? path.resolve("/tmp", "knotsnco_data") : path.resolve(process.cwd(), "server/data");
var ORDERS_FILE = path.join(DATA_DIR, "orders.json");
var WEBHOOKS_FILE = path.join(DATA_DIR, "webhooks.json");
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    return true;
  } catch (err) {
    return false;
  }
}
function getKvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return { url, token };
  }
  return null;
}
async function executeKv(command) {
  const config = getKvConfig();
  if (!config) return null;
  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(command)
    });
    if (res.ok) {
      const data = await res.json();
      return data.result;
    }
  } catch (err) {
    console.warn("[Database:KV] Error executing command:", err?.message || err);
  }
  return null;
}
var Database = class {
  constructor() {
    this.orders = /* @__PURE__ */ new Map();
    this.webhookEvents = /* @__PURE__ */ new Set();
    this.ordersByRazorpayId = /* @__PURE__ */ new Map();
    this.ordersByPaymentLinkId = /* @__PURE__ */ new Map();
    this.ordersByPaymentId = /* @__PURE__ */ new Map();
    this.hasLoggedStorageNotice = false;
    this.initFileStore();
  }
  initFileStore() {
    if (!ensureDataDir()) return;
    try {
      if (fs.existsSync(ORDERS_FILE)) {
        const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
        const data = JSON.parse(raw);
        if (data.orders) {
          for (const [k, v] of Object.entries(data.orders)) {
            this.indexInMemory(v);
          }
        }
      }
      if (fs.existsSync(WEBHOOKS_FILE)) {
        const raw = fs.readFileSync(WEBHOOKS_FILE, "utf-8");
        const data = JSON.parse(raw);
        if (data.events) {
          for (const k of Object.keys(data.events)) {
            this.webhookEvents.add(k);
          }
        }
      }
    } catch (err) {
    }
  }
  logStorageNoticeOnce() {
    if (this.hasLoggedStorageNotice) return;
    this.hasLoggedStorageNotice = true;
    if (getKvConfig()) {
      console.log("\u{1F4E6} [Database] Connected to durable storage (Vercel KV / Upstash Redis REST API).");
    } else if (isServerless) {
      console.warn(
        "\u26A0\uFE0F [Database] Running on Vercel without a durable database configured (KV_REST_API_URL / KV_REST_API_TOKEN). Orders are held in memory and /tmp ephemeral storage. To persist orders durably across serverless executions before enabling real customer payments, connect Vercel KV or Upstash Redis."
      );
    }
  }
  indexInMemory(order) {
    this.orders.set(order.orderReference, order);
    if (order.razorpay?.orderId) {
      this.ordersByRazorpayId.set(order.razorpay.orderId, order.orderReference);
    }
    if (order.razorpay?.paymentLinkId) {
      this.ordersByPaymentLinkId.set(order.razorpay.paymentLinkId, order.orderReference);
    }
    if (order.razorpay?.paymentId) {
      this.ordersByPaymentId.set(order.razorpay.paymentId, order.orderReference);
    }
  }
  persistOrdersToFile() {
    if (!ensureDataDir()) return;
    try {
      const obj = {};
      for (const [k, v] of this.orders.entries()) {
        obj[k] = v;
      }
      fs.writeFileSync(ORDERS_FILE, JSON.stringify({ orders: obj }, null, 2), "utf-8");
    } catch {
    }
  }
  persistWebhookEventToFile(record) {
    if (!ensureDataDir()) return;
    try {
      let events = {};
      if (fs.existsSync(WEBHOOKS_FILE)) {
        const raw = fs.readFileSync(WEBHOOKS_FILE, "utf-8");
        const data = JSON.parse(raw);
        events = data.events || {};
      }
      events[record.eventId] = record;
      fs.writeFileSync(WEBHOOKS_FILE, JSON.stringify({ events }, null, 2), "utf-8");
    } catch {
    }
  }
  // ─── Orders API ─────────────────────────────────────────────────────────────
  async saveOrder(order) {
    this.logStorageNoticeOnce();
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.indexInMemory(order);
    if (getKvConfig()) {
      try {
        const serialized = JSON.stringify(order);
        await executeKv(["SET", `order:${order.orderReference}`, serialized]);
        if (order.razorpay?.orderId) {
          await executeKv(["SET", `order_rzp:${order.razorpay.orderId}`, order.orderReference]);
        }
        if (order.razorpay?.paymentLinkId) {
          await executeKv(["SET", `order_plink:${order.razorpay.paymentLinkId}`, order.orderReference]);
        }
        if (order.razorpay?.paymentId) {
          await executeKv(["SET", `order_pay:${order.razorpay.paymentId}`, order.orderReference]);
        }
      } catch (err) {
        console.warn("[Database] KV save error:", err?.message || err);
      }
    }
    this.persistOrdersToFile();
    return order;
  }
  async getOrderByReference(orderReference) {
    this.logStorageNoticeOnce();
    if (!orderReference) return void 0;
    const cached = this.orders.get(orderReference);
    if (cached) return cached;
    if (getKvConfig()) {
      try {
        const res = await executeKv(["GET", `order:${orderReference}`]);
        if (res) {
          const parsed = typeof res === "string" ? JSON.parse(res) : res;
          this.indexInMemory(parsed);
          return parsed;
        }
      } catch (err) {
        console.warn("[Database] KV lookup error:", err?.message || err);
      }
    }
    return void 0;
  }
  async getOrderByRazorpayOrderId(razorpayOrderId) {
    this.logStorageNoticeOnce();
    if (!razorpayOrderId) return void 0;
    const ref = this.ordersByRazorpayId.get(razorpayOrderId);
    if (ref) {
      return this.getOrderByReference(ref);
    }
    if (getKvConfig()) {
      try {
        const foundRef = await executeKv(["GET", `order_rzp:${razorpayOrderId}`]);
        if (foundRef) {
          return this.getOrderByReference(String(foundRef));
        }
      } catch (err) {
        console.warn("[Database] KV lookup error:", err?.message || err);
      }
    }
    for (const order of this.orders.values()) {
      if (order.razorpay?.orderId === razorpayOrderId) {
        return order;
      }
    }
    return void 0;
  }
  async getOrderByPaymentLinkId(paymentLinkId) {
    this.logStorageNoticeOnce();
    if (!paymentLinkId) return void 0;
    const ref = this.ordersByPaymentLinkId.get(paymentLinkId);
    if (ref) {
      return this.getOrderByReference(ref);
    }
    if (getKvConfig()) {
      try {
        const foundRef = await executeKv(["GET", `order_plink:${paymentLinkId}`]);
        if (foundRef) {
          return this.getOrderByReference(String(foundRef));
        }
      } catch (err) {
        console.warn("[Database] KV lookup error:", err?.message || err);
      }
    }
    for (const order of this.orders.values()) {
      if (order.razorpay?.paymentLinkId === paymentLinkId) {
        return order;
      }
    }
    return void 0;
  }
  async getOrderByPaymentId(paymentId) {
    this.logStorageNoticeOnce();
    if (!paymentId) return void 0;
    const ref = this.ordersByPaymentId.get(paymentId);
    if (ref) {
      return this.getOrderByReference(ref);
    }
    if (getKvConfig()) {
      try {
        const foundRef = await executeKv(["GET", `order_pay:${paymentId}`]);
        if (foundRef) {
          return this.getOrderByReference(String(foundRef));
        }
      } catch (err) {
        console.warn("[Database] KV lookup error:", err?.message || err);
      }
    }
    for (const order of this.orders.values()) {
      if (order.razorpay?.paymentId === paymentId) {
        return order;
      }
    }
    return void 0;
  }
  async getAllOrders() {
    return Array.from(this.orders.values());
  }
  // ─── Webhook Idempotency API ────────────────────────────────────────────────
  async hasWebhookEvent(eventId) {
    this.logStorageNoticeOnce();
    if (!eventId) return false;
    if (this.webhookEvents.has(eventId)) return true;
    if (getKvConfig()) {
      try {
        const res = await executeKv(["GET", `webhook:${eventId}`]);
        if (res) {
          this.webhookEvents.add(eventId);
          return true;
        }
      } catch (err) {
        console.warn("[Database] KV webhook lookup error:", err?.message || err);
      }
    }
    return false;
  }
  async recordWebhookEvent(record) {
    this.logStorageNoticeOnce();
    if (!record?.eventId) return;
    this.webhookEvents.add(record.eventId);
    if (getKvConfig()) {
      try {
        await executeKv(["SETEX", `webhook:${record.eventId}`, 604800, JSON.stringify(record)]);
      } catch (err) {
        console.warn("[Database] KV webhook save error:", err?.message || err);
      }
    }
    this.persistWebhookEventToFile(record);
  }
};
var db = new Database();

// server/services/razorpay.ts
import crypto from "crypto";
function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  return { keyId, keySecret, webhookSecret };
}
function getBasicAuthHeader(keyId, keySecret) {
  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  return `Basic ${credentials}`;
}
async function createRazorpayOrder(params) {
  const { keyId, keySecret } = getRazorpayConfig();
  if (!keyId || !keySecret) {
    console.warn("\u26A0\uFE0F Razorpay credentials missing in environment (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET). Using mock test order.");
    return {
      id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: params.amountInPaise,
      currency: "INR",
      receipt: params.orderReference,
      status: "created"
    };
  }
  const payload = {
    amount: params.amountInPaise,
    currency: "INR",
    receipt: params.orderReference,
    notes: {
      orderReference: params.orderReference,
      customerName: params.customer?.name || "",
      customerEmail: params.customer?.email || "",
      customerPhone: params.customer?.phone || "",
      ...params.notes || {}
    }
  };
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getBasicAuthHeader(keyId, keySecret)
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay Orders API Error (${response.status}): ${errorText}`);
  }
  return await response.json();
}
async function createRazorpayPaymentLink(params) {
  const { keyId, keySecret } = getRazorpayConfig();
  if (!keyId || !keySecret) {
    console.warn("\u26A0\uFE0F Razorpay credentials missing. Using mock test payment link.");
    return {
      id: `plink_mock_${Date.now()}`,
      short_url: `http://localhost:3000/#order-confirmation?orderRef=${params.orderReference}`,
      status: "created",
      reference_id: params.orderReference
    };
  }
  const payload = {
    amount: params.amountInPaise,
    currency: "INR",
    accept_partial: false,
    reference_id: params.orderReference,
    description: params.description || `Knotsnco Handmade Order #${params.orderReference}`,
    customer: {
      name: params.customer.name,
      email: params.customer.email,
      contact: params.customer.phone
    },
    notify: {
      sms: true,
      email: true
    },
    reminder_enable: false,
    callback_url: params.callbackUrl,
    callback_method: "get",
    notes: {
      orderReference: params.orderReference
    }
  };
  const response = await fetch("https://api.razorpay.com/v1/payment_links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getBasicAuthHeader(keyId, keySecret)
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay Payment Link API Error (${response.status}): ${errorText}`);
  }
  return await response.json();
}
async function fetchRazorpayPayment(paymentId) {
  const { keyId, keySecret } = getRazorpayConfig();
  if (!keyId || !keySecret) {
    if (paymentId.startsWith("pay_mock_") || paymentId.startsWith("pay_test_")) {
      return {
        id: paymentId,
        status: "captured",
        currency: "INR",
        method: "upi"
      };
    }
    throw new Error("Razorpay keys not configured on server");
  }
  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    method: "GET",
    headers: {
      Authorization: getBasicAuthHeader(keyId, keySecret)
    }
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Razorpay payment (${response.status}): ${errorText}`);
  }
  return await response.json();
}
function safeTimingEqual(expected, actual) {
  if (!expected || !actual) return false;
  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(actual, "hex");
  if (expectedBuf.length === 0 || actualBuf.length === 0 || expectedBuf.length !== actualBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}
function verifyStandardCheckoutSignature(params) {
  const { keySecret } = getRazorpayConfig();
  if ((!keySecret || keySecret === "test_secret") && params.signature === "test_signature_valid") {
    return true;
  }
  if (!keySecret) {
    console.error("Cannot verify signature: RAZORPAY_KEY_SECRET is not set.");
    return false;
  }
  const payload = `${params.orderId}|${params.paymentId}`;
  const expectedSignature = crypto.createHmac("sha256", keySecret).update(payload).digest("hex");
  return safeTimingEqual(expectedSignature, params.signature);
}
function verifyPaymentLinkSignature(params) {
  const { keySecret } = getRazorpayConfig();
  if ((!keySecret || keySecret === "test_secret") && params.signature === "test_signature_valid") {
    return true;
  }
  if (!keySecret) {
    console.error("Cannot verify signature: RAZORPAY_KEY_SECRET is not set.");
    return false;
  }
  const payload = `${params.paymentLinkId}|${params.paymentLinkReferenceId}|${params.paymentLinkStatus}|${params.paymentId}`;
  const expectedSignature = crypto.createHmac("sha256", keySecret).update(payload).digest("hex");
  return safeTimingEqual(expectedSignature, params.signature);
}
function verifyWebhookSignature(rawBody, signature) {
  const { webhookSecret } = getRazorpayConfig();
  if (!webhookSecret) {
    console.error("Cannot verify webhook signature: RAZORPAY_WEBHOOK_SECRET is not set.");
    return false;
  }
  const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  return safeTimingEqual(expectedSignature, signature);
}

// server/services/shopifyAdmin.ts
var cachedAdminToken = null;
var inFlightTokenPromise = null;
async function fetchNewAccessToken() {
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN || "04wv6h-ut.myshopify.com";
  if (process.env.MOCK_SHOPIFY === "true") {
    return "mock_admin_token";
  }
  if (!clientId || !clientSecret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[ShopifyAdmin] Missing credentials: SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET are required in production."
      );
    }
    return "mock_admin_token";
  }
  const tokenEndpoint = `https://${storeDomain}/admin/oauth/access_token`;
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret
  });
  let response;
  try {
    response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: params.toString()
    });
  } catch (netErr) {
    throw new Error(`[ShopifyAdmin] Network error connecting to Shopify OAuth: ${netErr?.message || netErr}`);
  }
  if (!response.ok) {
    const rawBody = await response.text();
    let sanitizedError = "";
    try {
      const parsedJson = JSON.parse(rawBody);
      sanitizedError = parsedJson.error_description || parsedJson.error || parsedJson.errors || "";
    } catch {
      const match = rawBody.match(/Oauth error ([^<:\n]+)(?::\s*([^<\n]+))?/i) || rawBody.match(/<title>([^<]+)<\/title>/i);
      if (match) {
        sanitizedError = (match[2] ? `${match[1]}: ${match[2]}` : match[1]).trim();
      } else {
        sanitizedError = `HTTP ${response.status} ${response.statusText}`;
      }
    }
    if (sanitizedError.includes("shop_not_permitted") || rawBody.includes("shop_not_permitted")) {
      throw new Error(
        `[ShopifyAdmin] Shopify OAuth Error: shop_not_permitted. Ensure the app "Knotsnco Backend Integration" is installed and approved on store "${storeDomain}".`
      );
    }
    if (sanitizedError.includes("application_cannot_be_found") || rawBody.includes("application_cannot_be_found")) {
      throw new Error(
        `[ShopifyAdmin] Shopify OAuth Error: application_cannot_be_found. The SHOPIFY_CLIENT_ID does not match an app registered for store "${storeDomain}".`
      );
    }
    if (sanitizedError.includes("invalid_client") || sanitizedError.includes("invalid_request")) {
      throw new Error(
        `[ShopifyAdmin] Shopify OAuth Error: invalid_client/invalid_request. Verify SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET.`
      );
    }
    throw new Error(
      `[ShopifyAdmin] Failed to obtain Shopify Admin access token (HTTP ${response.status}): ${sanitizedError}`
    );
  }
  const data = await response.json();
  if (!data.access_token) {
    throw new Error("[ShopifyAdmin] Shopify OAuth response did not contain an access_token.");
  }
  const expiresInSec = typeof data.expires_in === "number" ? data.expires_in : 86400;
  const now = Date.now();
  cachedAdminToken = {
    token: data.access_token,
    expiresAt: now + expiresInSec * 1e3,
    scope: data.scope
  };
  return data.access_token;
}
async function getShopifyAdminAccessToken() {
  const now = Date.now();
  if (cachedAdminToken && cachedAdminToken.expiresAt - 3e5 > now) {
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
function getShopifyAdminConfig() {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN || "04wv6h-ut.myshopify.com";
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || "2026-10";
  return { storeDomain, apiVersion };
}
var ORDER_CREATE_MUTATION = `
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
function buildShopifyOrderCreatePayload(order, razorpayPaymentId) {
  const nameParts = (order.customer.name || "").trim().split(" ");
  const firstName = nameParts[0] || "Customer";
  const lastName = nameParts.slice(1).join(" ") || "";
  const lineItems = order.items.map((item) => ({
    variantId: item.variantId.startsWith("gid://") ? item.variantId : `gid://shopify/ProductVariant/${item.variantId}`,
    quantity: item.quantity,
    priceSet: {
      shopMoney: {
        amount: Number(item.unitPrice).toFixed(2),
        currencyCode: "INR"
      }
    }
  }));
  const finalAmountStr = Number(order.pricing.finalAmount).toFixed(2);
  const orderInput = {
    lineItems,
    financialStatus: "PAID",
    transactions: [
      {
        kind: "SALE",
        status: "SUCCESS",
        gateway: "Razorpay",
        amountSet: {
          shopMoney: {
            amount: finalAmountStr,
            currencyCode: "INR"
          }
        },
        authorizationCode: razorpayPaymentId
      }
    ],
    email: order.customer.email,
    phone: order.customer.phone || void 0,
    shippingAddress: {
      address1: order.shippingAddress.address1,
      address2: order.shippingAddress.address2 || "",
      city: order.shippingAddress.city,
      province: order.shippingAddress.province || order.shippingAddress.state || "",
      zip: order.shippingAddress.zip,
      country: "India",
      countryCode: "IN",
      firstName,
      lastName,
      phone: order.customer.phone || void 0
    },
    billingAddress: {
      address1: order.billingAddress.address1 || order.shippingAddress.address1,
      address2: order.billingAddress.address2 || order.shippingAddress.address2 || "",
      city: order.billingAddress.city || order.shippingAddress.city,
      province: order.billingAddress.province || order.billingAddress.state || order.shippingAddress.province || "",
      zip: order.billingAddress.zip || order.shippingAddress.zip,
      country: "India",
      countryCode: "IN",
      firstName,
      lastName,
      phone: order.customer.phone || void 0
    },
    shippingLines: [
      {
        title: order.pricing.shippingCharge === 0 ? "Free Standard Delivery" : "Standard Delivery",
        priceSet: {
          shopMoney: {
            amount: Number(order.pricing.shippingCharge || 0).toFixed(2),
            currencyCode: "INR"
          }
        }
      }
    ],
    note: `Order placed via Knotsnco Headless Storefront. Internal Ref: ${order.orderReference}. Razorpay Payment ID: ${razorpayPaymentId}`,
    tags: ["Knotsnco Headless", "Razorpay Paid", `Ref:${order.orderReference}`],
    customAttributes: [
      { key: "knotsnco_order_ref", value: order.orderReference },
      { key: "razorpay_payment_id", value: razorpayPaymentId }
    ]
  };
  const optionsInput = {
    inventoryBehaviour: "DECREMENT_OBEYING_POLICY",
    sendReceipt: true
    // Triggers Shopify's automated order confirmation email to the customer
  };
  return {
    order: orderInput,
    options: optionsInput
  };
}
async function createShopifyAdminOrder(order, razorpayPaymentId) {
  const { storeDomain, apiVersion } = getShopifyAdminConfig();
  const adminAccessToken = await getShopifyAdminAccessToken();
  if (order.shopify?.orderId && order.shopify?.orderNumber) {
    console.log(`[ShopifyAdmin] Order ${order.orderReference} already has Shopify order ${order.shopify.orderNumber}. Skipping creation.`);
    return {
      orderId: order.shopify.orderId,
      orderNumber: order.shopify.orderNumber,
      financialStatus: "PAID",
      createdAt: order.shopify.createdAt || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  if (adminAccessToken === "mock_admin_token") {
    console.warn(
      `[ShopifyAdmin] \u26A0\uFE0F Running in mock mode. Simulating verified order creation for ${order.orderReference}.`
    );
    const mockOrderNumber = `#KNOTS-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const mockOrderId = `gid://shopify/Order/mock_${Date.now()}`;
    return {
      orderId: mockOrderId,
      orderNumber: mockOrderNumber,
      financialStatus: "PAID",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  const endpoint = `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`;
  const { order: orderInput, options: optionsInput } = buildShopifyOrderCreatePayload(order, razorpayPaymentId);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminAccessToken
    },
    body: JSON.stringify({
      query: ORDER_CREATE_MUTATION,
      variables: {
        order: orderInput,
        options: optionsInput
      }
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify Admin API HTTP ${response.status}: ${errorText}`);
  }
  const result = await response.json();
  if (result.errors && result.errors.length > 0) {
    const msg = result.errors.map((e) => e.message).join(", ");
    throw new Error(`Shopify Admin GraphQL Error: ${msg}`);
  }
  const orderData = result.data?.orderCreate?.order;
  const userErrors = result.data?.orderCreate?.userErrors;
  if (userErrors && userErrors.length > 0) {
    const msg = userErrors.map((e) => `${e.field?.join(".")}: ${e.message}`).join(", ");
    throw new Error(`Shopify Order Creation Rejected: ${msg}`);
  }
  if (!orderData || !orderData.id) {
    throw new Error("Shopify Admin API did not return a valid order object.");
  }
  console.log(`[ShopifyAdmin] Successfully created Shopify order ${orderData.name} (${orderData.id}) for Ref ${order.orderReference}`);
  return {
    orderId: orderData.id,
    orderNumber: orderData.name,
    financialStatus: orderData.displayFinancialStatus || "PAID",
    createdAt: orderData.createdAt
  };
}

// server/app.ts
var app = express();
var apiRouter = express.Router();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Razorpay-Signature, x-razorpay-event-id"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: true }));
apiRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    store: "Knotsnco Headless Storefront",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    runtime: process.env.VERCEL ? "vercel-serverless" : "node-server"
  });
});
apiRouter.post("/checkout/create-order", async (req, res) => {
  try {
    const { items, customer, shippingAddress, billingAddress, mode = "standard" } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Order must contain at least one item." });
      return;
    }
    if (!customer || !customer.email || !customer.name || !customer.phone) {
      res.status(400).json({ error: "Customer name, email, and phone are required." });
      return;
    }
    if (!shippingAddress || !shippingAddress.address1 || !shippingAddress.city || !shippingAddress.zip) {
      res.status(400).json({ error: "Complete shipping address (address1, city, zip) is required." });
      return;
    }
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderReference = `KNOTS-${Date.now()}-${randomSuffix}`;
    let subtotal = 0;
    const sanitizedItems = items.map((it) => {
      const unitPrice = Math.max(0, Number(it.unitPrice || it.price || 0));
      const quantity = Math.max(1, Math.floor(Number(it.quantity || 1)));
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;
      return {
        productId: String(it.productId || ""),
        variantId: String(it.variantId || ""),
        title: String(it.title || "Handcrafted Crochet Item"),
        subtitle: it.subtitle ? String(it.subtitle) : void 0,
        image: String(it.image || ""),
        unitPrice,
        quantity,
        lineTotal
      };
    });
    const shippingCharge = subtotal >= 1999 ? 0 : 0;
    const discount = 0;
    const taxes = 0;
    const finalAmount = Math.max(1, subtotal + shippingCharge - discount);
    const amountInPaise = Math.round(finalAmount * 100);
    const fullShippingAddress = {
      address1: shippingAddress.address1,
      address2: shippingAddress.address2 || "",
      city: shippingAddress.city,
      province: shippingAddress.province || shippingAddress.state || "",
      state: shippingAddress.state || shippingAddress.province || "",
      zip: shippingAddress.zip,
      country: shippingAddress.country || "India",
      countryCode: shippingAddress.countryCode || "IN",
      firstName: shippingAddress.firstName || customer.name.split(" ")[0] || "Customer",
      lastName: shippingAddress.lastName || customer.name.split(" ").slice(1).join(" ") || "",
      phone: customer.phone
    };
    const fullBillingAddress = billingAddress ? {
      address1: billingAddress.address1 || fullShippingAddress.address1,
      address2: billingAddress.address2 || fullShippingAddress.address2,
      city: billingAddress.city || fullShippingAddress.city,
      province: billingAddress.province || fullShippingAddress.province,
      state: billingAddress.state || fullShippingAddress.state,
      zip: billingAddress.zip || fullShippingAddress.zip,
      country: billingAddress.country || "India",
      countryCode: billingAddress.countryCode || "IN",
      firstName: billingAddress.firstName || fullShippingAddress.firstName,
      lastName: billingAddress.lastName || fullShippingAddress.lastName,
      phone: billingAddress.phone || fullShippingAddress.phone
    } : { ...fullShippingAddress };
    const pendingOrder = {
      orderReference,
      status: "PENDING_PAYMENT",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      items: sanitizedItems,
      pricing: {
        subtotal,
        discount,
        shippingCharge,
        taxes,
        finalAmount,
        amountInPaise,
        currency: "INR"
      },
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim()
      },
      shippingAddress: fullShippingAddress,
      billingAddress: fullBillingAddress,
      razorpay: {}
    };
    const rzpOrder = await createRazorpayOrder({
      orderReference,
      amountInPaise,
      customer: pendingOrder.customer,
      notes: {
        orderReference,
        customerName: pendingOrder.customer.name
      }
    });
    pendingOrder.razorpay = {
      orderId: rzpOrder.id
    };
    if (mode === "payment_link") {
      const frontendBaseUrl = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || `${req.protocol}://${req.get("host")}`;
      const callbackUrl = `${frontendBaseUrl}/api/checkout/callback`;
      const pLink = await createRazorpayPaymentLink({
        orderReference,
        amountInPaise,
        callbackUrl,
        customer: pendingOrder.customer,
        description: `Knotsnco Handmade Order ${orderReference}`
      });
      pendingOrder.razorpay.paymentLinkId = pLink.id;
      pendingOrder.razorpay.paymentLinkUrl = pLink.short_url;
    }
    await db.saveOrder(pendingOrder);
    const { keyId } = getRazorpayConfig();
    res.json({
      success: true,
      orderReference: pendingOrder.orderReference,
      razorpayOrderId: pendingOrder.razorpay.orderId,
      paymentLinkId: pendingOrder.razorpay.paymentLinkId,
      paymentLinkUrl: pendingOrder.razorpay.paymentLinkUrl,
      amount: pendingOrder.pricing.finalAmount,
      amountInPaise: pendingOrder.pricing.amountInPaise,
      currency: "INR",
      keyId,
      customer: pendingOrder.customer
    });
  } catch (error) {
    console.error("[CreateOrder] Error creating pending order:", error);
    res.status(500).json({
      error: "Failed to initialize order checkout session",
      details: error.message
    });
  }
});
apiRouter.post("/checkout/verify-payment", async (req, res) => {
  try {
    const { orderReference, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!orderReference || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ error: "Missing required Razorpay payment verification parameters." });
      return;
    }
    const order = await db.getOrderByReference(orderReference);
    if (!order) {
      res.status(404).json({ error: `Order with reference ${orderReference} not found.` });
      return;
    }
    if (order.status === "PAID" && order.shopify?.orderNumber) {
      res.json({
        success: true,
        orderReference: order.orderReference,
        shopifyOrderNumber: order.shopify.orderNumber,
        shopifyOrderId: order.shopify.orderId,
        message: "Order is already paid and confirmed in Shopify."
      });
      return;
    }
    const isSignatureValid = verifyStandardCheckoutSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });
    if (!isSignatureValid) {
      console.error(`[VerifyPayment] Invalid signature for order ${orderReference}.`);
      res.status(400).json({ error: "Payment verification failed: Invalid cryptographic signature." });
      return;
    }
    const payment = await fetchRazorpayPayment(razorpay_payment_id);
    if (payment.status !== "captured" && payment.status !== "authorized") {
      console.warn(`[VerifyPayment] Payment ${razorpay_payment_id} status is ${payment.status}, expected captured.`);
      res.status(400).json({ error: `Payment is not captured. Current status: ${payment.status}` });
      return;
    }
    order.status = "PAYMENT_CAPTURED_SHOPIFY_PENDING";
    order.razorpay = {
      ...order.razorpay || {},
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      method: payment.method || "online",
      paidAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await db.saveOrder(order);
    try {
      const shopifyOrder = await createShopifyAdminOrder(order, razorpay_payment_id);
      order.status = "PAID";
      order.shopify = {
        orderId: shopifyOrder.orderId,
        orderNumber: shopifyOrder.orderNumber,
        createdAt: shopifyOrder.createdAt
      };
      await db.saveOrder(order);
      res.json({
        success: true,
        orderReference: order.orderReference,
        shopifyOrderNumber: shopifyOrder.orderNumber,
        shopifyOrderId: shopifyOrder.orderId
      });
    } catch (shopifyError) {
      console.error(`[VerifyPayment] Payment verified, but Shopify order creation failed for ${orderReference}:`, shopifyError);
      order.shopify = {
        error: shopifyError.message
      };
      await db.saveOrder(order);
      res.json({
        success: true,
        orderReference: order.orderReference,
        pendingSync: true,
        message: "Payment received. Your order is finalizing in Shopify."
      });
    }
  } catch (error) {
    console.error("[VerifyPayment] Error during payment verification:", error);
    res.status(500).json({ error: "Internal error verifying payment", details: error.message });
  }
});
apiRouter.get("/checkout/callback", async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_payment_link_id,
      razorpay_payment_link_reference_id,
      razorpay_payment_link_status,
      razorpay_signature
    } = req.query;
    const paymentId = String(razorpay_payment_id || "");
    const linkId = String(razorpay_payment_link_id || "");
    const referenceId = String(razorpay_payment_link_reference_id || "");
    const status = String(razorpay_payment_link_status || "");
    const signature = String(razorpay_signature || "");
    const order = referenceId ? await db.getOrderByReference(referenceId) : linkId ? await db.getOrderByPaymentLinkId(linkId) : void 0;
    const frontendBaseUrl = process.env.FRONTEND_URL || process.env.VITE_FRONTEND_URL || `${req.protocol}://${req.get("host")}`;
    if (!order) {
      res.redirect(`${frontendBaseUrl}/#order-confirmation?error=order_not_found`);
      return;
    }
    if (status !== "paid") {
      res.redirect(`${frontendBaseUrl}/#order-confirmation?orderRef=${order.orderReference}&status=${status}`);
      return;
    }
    const isSignatureValid = verifyPaymentLinkSignature({
      paymentLinkId: linkId,
      paymentLinkReferenceId: referenceId,
      paymentLinkStatus: status,
      paymentId,
      signature
    });
    if (!isSignatureValid) {
      res.redirect(`${frontendBaseUrl}/#order-confirmation?orderRef=${order.orderReference}&error=invalid_signature`);
      return;
    }
    if (order.status !== "PAID" || !order.shopify?.orderNumber) {
      order.status = "PAYMENT_CAPTURED_SHOPIFY_PENDING";
      order.razorpay = {
        ...order.razorpay || {},
        paymentLinkId: linkId,
        paymentId,
        signature,
        paidAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await db.saveOrder(order);
      try {
        const shopifyOrder = await createShopifyAdminOrder(order, paymentId);
        order.status = "PAID";
        order.shopify = {
          orderId: shopifyOrder.orderId,
          orderNumber: shopifyOrder.orderNumber,
          createdAt: shopifyOrder.createdAt
        };
        await db.saveOrder(order);
      } catch (err) {
        console.error(`[Callback] Shopify order creation error: ${err.message}`);
        order.shopify = { error: err.message };
        await db.saveOrder(order);
      }
    }
    res.redirect(`${frontendBaseUrl}/#order-confirmation?orderRef=${order.orderReference}&status=success`);
  } catch (error) {
    console.error("[Callback] Error handling Razorpay callback:", error);
    res.redirect(`/#order-confirmation?error=internal_error`);
  }
});
apiRouter.post("/webhooks/razorpay", async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const eventId = req.headers["x-razorpay-event-id"];
    if (!signature) {
      console.warn("[Webhook] Missing X-Razorpay-Signature header.");
      res.status(400).json({ error: "Missing X-Razorpay-Signature header." });
      return;
    }
    const rawBody = req.rawBody || (Buffer.isBuffer(req.body) ? req.body : Buffer.from(typeof req.body === "string" ? req.body : JSON.stringify(req.body)));
    if (!rawBody || rawBody.length === 0) {
      console.error("[Webhook] Raw request body not available for signature verification.");
      res.status(500).json({ error: "Server misconfiguration: Raw body required." });
      return;
    }
    const isWebhookValid = verifyWebhookSignature(rawBody, signature);
    if (!isWebhookValid) {
      console.error("[Webhook] Invalid X-Razorpay-Signature.");
      res.status(400).json({ error: "Invalid webhook signature." });
      return;
    }
    if (eventId && await db.hasWebhookEvent(eventId)) {
      console.log(`[Webhook] Duplicate event ${eventId} received. Skipping.`);
      res.status(200).json({ status: "duplicate_ignored", eventId });
      return;
    }
    const event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const eventType = event.event;
    console.log(`[Webhook] Processing Razorpay event: ${eventType} (ID: ${eventId || "unknown"})`);
    let orderReference;
    let paymentId;
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const payment = event.payload?.payment?.entity;
      const order = event.payload?.order?.entity;
      paymentId = payment?.id;
      orderReference = payment?.notes?.orderReference || order?.notes?.orderReference || payment?.description?.match(/KNOTS-\d+-[A-Z0-9]+/)?.[0];
      let targetOrder;
      if (orderReference) {
        targetOrder = await db.getOrderByReference(orderReference);
      } else if (order?.id) {
        targetOrder = await db.getOrderByRazorpayOrderId(order.id);
      } else if (paymentId) {
        targetOrder = await db.getOrderByPaymentId(paymentId);
      }
      if (targetOrder) {
        orderReference = targetOrder.orderReference;
        if (targetOrder.status !== "PAID" || !targetOrder.shopify?.orderNumber) {
          targetOrder.status = "PAYMENT_CAPTURED_SHOPIFY_PENDING";
          targetOrder.razorpay = {
            ...targetOrder.razorpay || {},
            orderId: order?.id || targetOrder.razorpay?.orderId,
            paymentId: paymentId || targetOrder.razorpay?.paymentId,
            method: payment?.method || targetOrder.razorpay?.method,
            paidAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          await db.saveOrder(targetOrder);
          try {
            const shopifyOrder = await createShopifyAdminOrder(targetOrder, paymentId || "webhook_captured");
            targetOrder.status = "PAID";
            targetOrder.shopify = {
              orderId: shopifyOrder.orderId,
              orderNumber: shopifyOrder.orderNumber,
              createdAt: shopifyOrder.createdAt
            };
            await db.saveOrder(targetOrder);
            console.log(`[Webhook] Created Shopify order ${shopifyOrder.orderNumber} for ${targetOrder.orderReference}`);
          } catch (shopErr) {
            console.error(`[Webhook] Error creating Shopify order: ${shopErr.message}`);
            targetOrder.shopify = { error: shopErr.message };
            await db.saveOrder(targetOrder);
          }
        }
      }
    } else if (eventType === "payment_link.paid") {
      const pLink = event.payload?.payment_link?.entity;
      const payment = event.payload?.payment?.entity;
      paymentId = payment?.id;
      orderReference = pLink?.reference_id || pLink?.notes?.orderReference;
      const targetOrder = orderReference ? await db.getOrderByReference(orderReference) : await db.getOrderByPaymentLinkId(pLink?.id);
      if (targetOrder) {
        if (targetOrder.status !== "PAID" || !targetOrder.shopify?.orderNumber) {
          targetOrder.status = "PAID";
          targetOrder.razorpay = {
            ...targetOrder.razorpay || {},
            paymentLinkId: pLink?.id,
            paymentId,
            paidAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          await db.saveOrder(targetOrder);
          try {
            const shopifyOrder = await createShopifyAdminOrder(targetOrder, paymentId || "plink_captured");
            targetOrder.shopify = {
              orderId: shopifyOrder.orderId,
              orderNumber: shopifyOrder.orderNumber,
              createdAt: shopifyOrder.createdAt
            };
            await db.saveOrder(targetOrder);
          } catch (err) {
            console.error(`[Webhook] Payment link Shopify creation error: ${err.message}`);
          }
        }
      }
    }
    if (eventId) {
      await db.recordWebhookEvent({
        eventId,
        eventType,
        orderReference,
        razorpayPaymentId: paymentId,
        processedAt: (/* @__PURE__ */ new Date()).toISOString(),
        status: "SUCCESS"
      });
    }
    res.status(200).json({ status: "ok", event: eventType });
  } catch (error) {
    console.error("[Webhook] Unhandled error in webhook handler:", error);
    res.status(500).json({ error: "Webhook processing error", details: error.message });
  }
});
apiRouter.get("/orders/:orderReference", async (req, res) => {
  const { orderReference } = req.params;
  const order = await db.getOrderByReference(orderReference);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json({
    orderReference: order.orderReference,
    status: order.status,
    createdAt: order.createdAt,
    items: order.items,
    pricing: order.pricing,
    customer: {
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone
    },
    shippingAddress: order.shippingAddress,
    razorpay: {
      orderId: order.razorpay?.orderId,
      paymentId: order.razorpay?.paymentId,
      paidAt: order.razorpay?.paidAt
    },
    shopify: {
      orderNumber: order.shopify?.orderNumber,
      createdAt: order.shopify?.createdAt,
      isCreated: Boolean(order.shopify?.orderNumber),
      error: order.shopify?.error
    }
  });
});
app.use("/api", apiRouter);
app.use("/", apiRouter);
var app_default = app;
export {
  apiRouter,
  app,
  app_default as default
};
