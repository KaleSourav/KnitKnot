import fs from 'fs';
import path from 'path';
import { InternalOrder, WebhookEventRecord } from './types';

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// On Vercel / serverless environments, the root filesystem is read-only.
// We use /tmp for temporary file fallback, or a remote durable store (Vercel KV / Upstash).
const DATA_DIR = isServerless
  ? path.resolve('/tmp', 'knotsnco_data')
  : path.resolve(process.cwd(), 'server/data');

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const WEBHOOKS_FILE = path.join(DATA_DIR, 'webhooks.json');

function ensureDataDir(): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    return true;
  } catch (err) {
    // Graceful fallback on read-only environments
    return false;
  }
}

interface KvConfig {
  url: string;
  token: string;
}

function getKvConfig(): KvConfig | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return { url, token };
  }
  return null;
}

async function executeKv(command: any[]): Promise<any> {
  const config = getKvConfig();
  if (!config) return null;
  try {
    const res = await fetch(config.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });
    if (res.ok) {
      const data = (await res.json()) as any;
      return data.result;
    }
  } catch (err: any) {
    console.warn('[Database:KV] Error executing command:', err?.message || err);
  }
  return null;
}

interface DBState {
  orders: Record<string, InternalOrder>;
}

interface WebhookDBState {
  events: Record<string, WebhookEventRecord>;
}

export class Database {
  private orders: Map<string, InternalOrder> = new Map();
  private webhookEvents: Set<string> = new Set();
  private ordersByRazorpayId: Map<string, string> = new Map();
  private ordersByPaymentLinkId: Map<string, string> = new Map();
  private ordersByPaymentId: Map<string, string> = new Map();
  private hasLoggedStorageNotice = false;

  constructor() {
    this.initFileStore();
  }

  private initFileStore() {
    if (!ensureDataDir()) return;

    try {
      if (fs.existsSync(ORDERS_FILE)) {
        const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
        const data: DBState = JSON.parse(raw);
        if (data.orders) {
          for (const [k, v] of Object.entries(data.orders)) {
            this.indexInMemory(v);
          }
        }
      }

      if (fs.existsSync(WEBHOOKS_FILE)) {
        const raw = fs.readFileSync(WEBHOOKS_FILE, 'utf-8');
        const data: WebhookDBState = JSON.parse(raw);
        if (data.events) {
          for (const k of Object.keys(data.events)) {
            this.webhookEvents.add(k);
          }
        }
      }
    } catch (err) {
      // Ignore load failures in read-only / clean environments
    }
  }

  private logStorageNoticeOnce() {
    if (this.hasLoggedStorageNotice) return;
    this.hasLoggedStorageNotice = true;

    if (getKvConfig()) {
      console.log('📦 [Database] Connected to durable storage (Vercel KV / Upstash Redis REST API).');
    } else if (isServerless) {
      console.warn(
        '⚠️ [Database] Running on Vercel without a durable database configured (KV_REST_API_URL / KV_REST_API_TOKEN). Orders are held in memory and /tmp ephemeral storage. To persist orders durably across serverless executions before enabling real customer payments, connect Vercel KV or Upstash Redis.'
      );
    }
  }

  private indexInMemory(order: InternalOrder) {
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

  private persistOrdersToFile() {
    if (!ensureDataDir()) return;
    try {
      const obj: Record<string, InternalOrder> = {};
      for (const [k, v] of this.orders.entries()) {
        obj[k] = v;
      }
      fs.writeFileSync(ORDERS_FILE, JSON.stringify({ orders: obj }, null, 2), 'utf-8');
    } catch {
      // Ignore write errors on read-only environments
    }
  }

  private persistWebhookEventToFile(record: WebhookEventRecord) {
    if (!ensureDataDir()) return;
    try {
      let events: Record<string, WebhookEventRecord> = {};
      if (fs.existsSync(WEBHOOKS_FILE)) {
        const raw = fs.readFileSync(WEBHOOKS_FILE, 'utf-8');
        const data = JSON.parse(raw);
        events = data.events || {};
      }
      events[record.eventId] = record;
      fs.writeFileSync(WEBHOOKS_FILE, JSON.stringify({ events }, null, 2), 'utf-8');
    } catch {
      // Ignore write errors on read-only environments
    }
  }

  // ─── Orders API ─────────────────────────────────────────────────────────────

  public async saveOrder(order: InternalOrder): Promise<InternalOrder> {
    this.logStorageNoticeOnce();
    order.updatedAt = new Date().toISOString();
    this.indexInMemory(order);

    // 1. If remote KV is configured, persist durably
    if (getKvConfig()) {
      try {
        const serialized = JSON.stringify(order);
        await executeKv(['SET', `order:${order.orderReference}`, serialized]);

        if (order.razorpay?.orderId) {
          await executeKv(['SET', `order_rzp:${order.razorpay.orderId}`, order.orderReference]);
        }
        if (order.razorpay?.paymentLinkId) {
          await executeKv(['SET', `order_plink:${order.razorpay.paymentLinkId}`, order.orderReference]);
        }
        if (order.razorpay?.paymentId) {
          await executeKv(['SET', `order_pay:${order.razorpay.paymentId}`, order.orderReference]);
        }
      } catch (err: any) {
        console.warn('[Database] KV save error:', err?.message || err);
      }
    }

    // 2. Persist to file store fallback
    this.persistOrdersToFile();

    return order;
  }

  public async getOrderByReference(orderReference: string): Promise<InternalOrder | undefined> {
    this.logStorageNoticeOnce();
    if (!orderReference) return undefined;

    // Check memory first
    const cached = this.orders.get(orderReference);
    if (cached) return cached;

    // Check remote KV store
    if (getKvConfig()) {
      try {
        const res = await executeKv(['GET', `order:${orderReference}`]);
        if (res) {
          const parsed: InternalOrder = typeof res === 'string' ? JSON.parse(res) : res;
          this.indexInMemory(parsed);
          return parsed;
        }
      } catch (err: any) {
        console.warn('[Database] KV lookup error:', err?.message || err);
      }
    }

    return undefined;
  }

  public async getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<InternalOrder | undefined> {
    this.logStorageNoticeOnce();
    if (!razorpayOrderId) return undefined;

    const ref = this.ordersByRazorpayId.get(razorpayOrderId);
    if (ref) {
      return this.getOrderByReference(ref);
    }

    if (getKvConfig()) {
      try {
        const foundRef = await executeKv(['GET', `order_rzp:${razorpayOrderId}`]);
        if (foundRef) {
          return this.getOrderByReference(String(foundRef));
        }
      } catch (err: any) {
        console.warn('[Database] KV lookup error:', err?.message || err);
      }
    }

    // In-memory scan fallback
    for (const order of this.orders.values()) {
      if (order.razorpay?.orderId === razorpayOrderId) {
        return order;
      }
    }

    return undefined;
  }

  public async getOrderByPaymentLinkId(paymentLinkId: string): Promise<InternalOrder | undefined> {
    this.logStorageNoticeOnce();
    if (!paymentLinkId) return undefined;

    const ref = this.ordersByPaymentLinkId.get(paymentLinkId);
    if (ref) {
      return this.getOrderByReference(ref);
    }

    if (getKvConfig()) {
      try {
        const foundRef = await executeKv(['GET', `order_plink:${paymentLinkId}`]);
        if (foundRef) {
          return this.getOrderByReference(String(foundRef));
        }
      } catch (err: any) {
        console.warn('[Database] KV lookup error:', err?.message || err);
      }
    }

    // In-memory scan fallback
    for (const order of this.orders.values()) {
      if (order.razorpay?.paymentLinkId === paymentLinkId) {
        return order;
      }
    }

    return undefined;
  }

  public async getOrderByPaymentId(paymentId: string): Promise<InternalOrder | undefined> {
    this.logStorageNoticeOnce();
    if (!paymentId) return undefined;

    const ref = this.ordersByPaymentId.get(paymentId);
    if (ref) {
      return this.getOrderByReference(ref);
    }

    if (getKvConfig()) {
      try {
        const foundRef = await executeKv(['GET', `order_pay:${paymentId}`]);
        if (foundRef) {
          return this.getOrderByReference(String(foundRef));
        }
      } catch (err: any) {
        console.warn('[Database] KV lookup error:', err?.message || err);
      }
    }

    // In-memory scan fallback
    for (const order of this.orders.values()) {
      if (order.razorpay?.paymentId === paymentId) {
        return order;
      }
    }

    return undefined;
  }

  public async getAllOrders(): Promise<InternalOrder[]> {
    return Array.from(this.orders.values());
  }

  // ─── Webhook Idempotency API ────────────────────────────────────────────────

  public async hasWebhookEvent(eventId: string): Promise<boolean> {
    this.logStorageNoticeOnce();
    if (!eventId) return false;

    if (this.webhookEvents.has(eventId)) return true;

    if (getKvConfig()) {
      try {
        const res = await executeKv(['GET', `webhook:${eventId}`]);
        if (res) {
          this.webhookEvents.add(eventId);
          return true;
        }
      } catch (err: any) {
        console.warn('[Database] KV webhook lookup error:', err?.message || err);
      }
    }

    return false;
  }

  public async recordWebhookEvent(record: WebhookEventRecord): Promise<void> {
    this.logStorageNoticeOnce();
    if (!record?.eventId) return;

    this.webhookEvents.add(record.eventId);

    if (getKvConfig()) {
      try {
        // Expire recorded webhook events after 7 days (604800 seconds)
        await executeKv(['SETEX', `webhook:${record.eventId}`, 604800, JSON.stringify(record)]);
      } catch (err: any) {
        console.warn('[Database] KV webhook save error:', err?.message || err);
      }
    }

    this.persistWebhookEventToFile(record);
  }
}

export const db = new Database();
