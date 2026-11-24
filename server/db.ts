import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { InternalOrder, WebhookEventRecord } from './types';

dotenv.config();

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Local file fallback paths for offline development
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
  } catch {
    return false;
  }
}

let cachedRedis: Redis | null = null;

/**
 * Returns an active Upstash Redis client initialized via Redis.fromEnv()
 * Supports UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL + KV_REST_API_TOKEN.
 */
export function getRedisClient(): Redis | null {
  const hasEnv = Boolean(
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  );

  if (!hasEnv) {
    cachedRedis = null;
    return null;
  }

  if (!cachedRedis) {
    try {
      cachedRedis = Redis.fromEnv();
      console.log('⚡ [Database] Connected to Upstash Redis via Redis.fromEnv()');
    } catch (err: any) {
      console.warn('[Database] Redis.fromEnv() initialization failed:', err?.message || err);
      return null;
    }
  }

  return cachedRedis;
}

/**
 * Resets cached Redis instance (used by test suites)
 */
export function resetRedisClient(): void {
  cachedRedis = null;
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
  private verificationLocks: Set<string> = new Set();

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
          for (const v of Object.values(data.orders)) {
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
    } catch {
      // Ignore load failures in clean environments
    }
  }

  public isConfigured(): boolean {
    return Boolean(
      (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
      (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
    );
  }

  /**
   * Health check verifying Redis connectivity via PING command
   */
  public async checkHealth(): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
    const redis = getRedisClient();
    if (!redis) {
      return { ok: false, error: 'unconfigured' };
    }

    const start = Date.now();
    try {
      const ping = await redis.ping();
      const latencyMs = Date.now() - start;
      return { ok: ping === 'PONG', latencyMs };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'ping_failed' };
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

  // ─── Orders API (Durable Redis Persistence) ─────────────────────────────────

  public async saveOrder(order: InternalOrder): Promise<InternalOrder> {
    order.updatedAt = new Date().toISOString();
    this.indexInMemory(order);

    const redis = getRedisClient();
    if (redis) {
      try {
        // Persist order permanently in Redis (no short TTL)
        await redis.set(`order:${order.orderReference}`, JSON.stringify(order));

        // Secondary lookup indexes for O(1) query performance
        if (order.razorpay?.orderId) {
          await redis.set(`idx:rzp_order:${order.razorpay.orderId}`, order.orderReference);
        }
        if (order.razorpay?.paymentLinkId) {
          await redis.set(`idx:plink:${order.razorpay.paymentLinkId}`, order.orderReference);
        }
        if (order.razorpay?.paymentId) {
          await redis.set(`idx:pay:${order.razorpay.paymentId}`, order.orderReference);
        }

        // Set tracking all order references
        await redis.sadd('orders:all', order.orderReference);
      } catch (err: any) {
        console.error('[Database:Redis] saveOrder error:', err?.message || err);
      }
    }

    this.persistOrdersToFile();
    return order;
  }

  public async getOrderByReference(orderReference: string): Promise<InternalOrder | undefined> {
    if (!orderReference) return undefined;

    const redis = getRedisClient();
    if (redis) {
      try {
        const raw = await redis.get(`order:${orderReference}`);
        if (raw) {
          const parsed: InternalOrder = typeof raw === 'string' ? JSON.parse(raw) : (raw as InternalOrder);
          this.indexInMemory(parsed);
          return parsed;
        }
      } catch (err: any) {
        console.warn('[Database:Redis] getOrderByReference error:', err?.message || err);
      }
    }

    return this.orders.get(orderReference);
  }

  public async getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<InternalOrder | undefined> {
    if (!razorpayOrderId) return undefined;

    const redis = getRedisClient();
    if (redis) {
      try {
        const ref = await redis.get<string>(`idx:rzp_order:${razorpayOrderId}`);
        if (ref) {
          return this.getOrderByReference(ref);
        }
      } catch (err: any) {
        console.warn('[Database:Redis] getOrderByRazorpayOrderId error:', err?.message || err);
      }
    }

    const ref = this.ordersByRazorpayId.get(razorpayOrderId);
    if (ref) return this.orders.get(ref);

    for (const order of this.orders.values()) {
      if (order.razorpay?.orderId === razorpayOrderId) return order;
    }
    return undefined;
  }

  public async getOrderByPaymentLinkId(paymentLinkId: string): Promise<InternalOrder | undefined> {
    if (!paymentLinkId) return undefined;

    const redis = getRedisClient();
    if (redis) {
      try {
        const ref = await redis.get<string>(`idx:plink:${paymentLinkId}`);
        if (ref) {
          return this.getOrderByReference(ref);
        }
      } catch (err: any) {
        console.warn('[Database:Redis] getOrderByPaymentLinkId error:', err?.message || err);
      }
    }

    const ref = this.ordersByPaymentLinkId.get(paymentLinkId);
    if (ref) return this.orders.get(ref);

    for (const order of this.orders.values()) {
      if (order.razorpay?.paymentLinkId === paymentLinkId) return order;
    }
    return undefined;
  }

  public async getOrderByPaymentId(paymentId: string): Promise<InternalOrder | undefined> {
    if (!paymentId) return undefined;

    const redis = getRedisClient();
    if (redis) {
      try {
        const ref = await redis.get<string>(`idx:pay:${paymentId}`);
        if (ref) {
          return this.getOrderByReference(ref);
        }
      } catch (err: any) {
        console.warn('[Database:Redis] getOrderByPaymentId error:', err?.message || err);
      }
    }

    const ref = this.ordersByPaymentId.get(paymentId);
    if (ref) return this.orders.get(ref);

    for (const order of this.orders.values()) {
      if (order.razorpay?.paymentId === paymentId) return order;
    }
    return undefined;
  }

  public async getAllOrders(): Promise<InternalOrder[]> {
    const redis = getRedisClient();
    if (redis) {
      try {
        const refs = await redis.smembers('orders:all');
        if (refs && refs.length > 0) {
          const orders: InternalOrder[] = [];
          for (const ref of refs) {
            const ord = await this.getOrderByReference(String(ref));
            if (ord) orders.push(ord);
          }
          return orders;
        }
      } catch (err: any) {
        console.warn('[Database:Redis] getAllOrders error:', err?.message || err);
      }
    }

    return Array.from(this.orders.values());
  }

  // ─── Webhook Deduplication API (Atomic SETNX) ───────────────────────────────

  public async hasWebhookEvent(eventId: string): Promise<boolean> {
    if (!eventId) return false;

    const redis = getRedisClient();
    if (redis) {
      try {
        const exists = await redis.exists(`webhook:event:${eventId}`);
        if (exists === 1) return true;
      } catch (err: any) {
        console.warn('[Database:Redis] hasWebhookEvent error:', err?.message || err);
      }
    }

    return this.webhookEvents.has(eventId);
  }

  /**
   * Atomically records a webhook event. Returns true if this is a NEW event,
   * or false if it was already recorded by another concurrent request.
   */
  public async recordWebhookEvent(record: WebhookEventRecord): Promise<boolean> {
    if (!record?.eventId) return false;

    const redis = getRedisClient();
    if (redis) {
      try {
        // Atomic SET with NX (not exists) and 30-day retention (2592000s)
        const setResult = await redis.set(
          `webhook:event:${record.eventId}`,
          JSON.stringify(record),
          { nx: true, ex: 2592000 }
        );

        const isNew = setResult !== null;
        if (isNew) {
          this.webhookEvents.add(record.eventId);
          this.persistWebhookEventToFile(record);
        }
        return isNew;
      } catch (err: any) {
        console.warn('[Database:Redis] recordWebhookEvent error:', err?.message || err);
      }
    }

    // In-memory fallback
    if (this.webhookEvents.has(record.eventId)) {
      return false;
    }
    this.webhookEvents.add(record.eventId);
    this.persistWebhookEventToFile(record);
    return true;
  }

  // ─── Distributed Lock for Concurrency Safety & Idempotency ───────────────────

  /**
   * Acquires a distributed lock on order verification to prevent concurrent
   * executions between customer browser redirects and webhook events.
   */
  public async acquireVerificationLock(orderReference: string, ttlSeconds: number = 30): Promise<boolean> {
    if (!orderReference) return false;

    const redis = getRedisClient();
    if (redis) {
      try {
        const lock = await redis.set(
          `lock:verify:${orderReference}`,
          Date.now().toString(),
          { nx: true, ex: ttlSeconds }
        );
        return lock !== null;
      } catch (err: any) {
        console.warn('[Database:Redis] acquireVerificationLock error:', err?.message || err);
      }
    }

    // In-memory atomic fallback
    if (this.verificationLocks.has(orderReference)) {
      return false;
    }
    this.verificationLocks.add(orderReference);
    return true;
  }

  public async releaseVerificationLock(orderReference: string): Promise<void> {
    if (!orderReference) return;
    this.verificationLocks.delete(orderReference);

    const redis = getRedisClient();
    if (redis) {
      try {
        await redis.del(`lock:verify:${orderReference}`);
      } catch (err: any) {
        console.warn('[Database:Redis] releaseVerificationLock error:', err?.message || err);
      }
    }
  }
}

export const db = new Database();
