import fs from 'fs';
import path from 'path';
import { InternalOrder, WebhookEventRecord } from './types';

const DATA_DIR = path.resolve(process.cwd(), 'server/data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const WEBHOOKS_FILE = path.join(DATA_DIR, 'webhooks.json');

// Ensure storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DBState {
  orders: Record<string, InternalOrder>;
}

interface WebhookDBState {
  events: Record<string, WebhookEventRecord>;
}

class Database {
  private orders: Map<string, InternalOrder> = new Map();
  private webhookEvents: Set<string> = new Set();
  private isLoaded = false;

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(ORDERS_FILE)) {
        const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
        const data: DBState = JSON.parse(raw);
        if (data.orders) {
          for (const [k, v] of Object.entries(data.orders)) {
            this.orders.set(k, v);
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
      console.error('Failed to load database files:', err);
    }
    this.isLoaded = true;
  }

  private persistOrders() {
    try {
      const obj: Record<string, InternalOrder> = {};
      for (const [k, v] of this.orders.entries()) {
        obj[k] = v;
      }
      fs.writeFileSync(ORDERS_FILE, JSON.stringify({ orders: obj }, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist orders to disk:', err);
    }
  }

  private persistWebhookEvent(record: WebhookEventRecord) {
    try {
      let events: Record<string, WebhookEventRecord> = {};
      if (fs.existsSync(WEBHOOKS_FILE)) {
        const raw = fs.readFileSync(WEBHOOKS_FILE, 'utf-8');
        const data = JSON.parse(raw);
        events = data.events || {};
      }
      events[record.eventId] = record;
      fs.writeFileSync(WEBHOOKS_FILE, JSON.stringify({ events }, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist webhook event:', err);
    }
  }

  // ─── Orders API ─────────────────────────────────────────────────────────────

  public saveOrder(order: InternalOrder): InternalOrder {
    order.updatedAt = new Date().toISOString();
    this.orders.set(order.orderReference, order);
    this.persistOrders();
    return order;
  }

  public getOrderByReference(orderReference: string): InternalOrder | undefined {
    return this.orders.get(orderReference);
  }

  public getOrderByRazorpayOrderId(razorpayOrderId: string): InternalOrder | undefined {
    for (const order of this.orders.values()) {
      if (order.razorpay?.orderId === razorpayOrderId) {
        return order;
      }
    }
    return undefined;
  }

  public getOrderByPaymentLinkId(paymentLinkId: string): InternalOrder | undefined {
    for (const order of this.orders.values()) {
      if (order.razorpay?.paymentLinkId === paymentLinkId) {
        return order;
      }
    }
    return undefined;
  }

  public getOrderByPaymentId(paymentId: string): InternalOrder | undefined {
    for (const order of this.orders.values()) {
      if (order.razorpay?.paymentId === paymentId) {
        return order;
      }
    }
    return undefined;
  }

  public getAllOrders(): InternalOrder[] {
    return Array.from(this.orders.values());
  }

  // ─── Webhook Idempotency API ────────────────────────────────────────────────

  public hasWebhookEvent(eventId: string): boolean {
    return this.webhookEvents.has(eventId);
  }

  public recordWebhookEvent(record: WebhookEventRecord) {
    this.webhookEvents.add(record.eventId);
    this.persistWebhookEvent(record);
  }
}

export const db = new Database();
