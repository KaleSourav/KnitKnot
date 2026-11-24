import http from 'http';
import { Redis } from '@upstash/redis';
import { Database, getRedisClient, resetRedisClient } from './db';
import { InternalOrder, WebhookEventRecord } from './types';
import { verifyStandardCheckoutSignature, verifyWebhookSignature } from './services/razorpay';
import { buildShopifyOrderCreatePayload } from './services/shopifyAdmin';

async function runUpstashRedisTests() {
  console.log('================================================================');
  console.log('Knotsnco - Upstash Redis & Concurrency Safety Verification');
  console.log('================================================================\n');

  let mockServer: http.Server | null = null;
  const isLiveEnvConfigured = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );

  if (isLiveEnvConfigured) {
    console.log('📡 Detected LIVE Upstash Redis credentials in environment.');
  } else {
    console.log('🛠️ No local Upstash credentials in .env. Starting local Upstash REST mock server to test @upstash/redis wire protocol...');
    
    // In-memory Redis store simulating Upstash REST API
    const redisStore = new Map<string, string>();
    const setsStore = new Map<string, Set<string>>();

    mockServer = http.createServer(async (req, res) => {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }

      let parsed: any;
      try {
        parsed = JSON.parse(body);
      } catch {
        parsed = null;
      }

      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith('Bearer ')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      const commands = Array.isArray(parsed) && Array.isArray(parsed[0]) ? parsed : [parsed];
      const results: any[] = [];

      for (const cmdArr of commands) {
        if (!Array.isArray(cmdArr)) {
          results.push({ result: null });
          continue;
        }

        const cmd = String(cmdArr[0]).toUpperCase();
        if (cmd === 'PING') {
          results.push({ result: 'PONG' });
          continue;
        }

        if (cmd === 'SET') {
          const key = cmdArr[1];
          const val = cmdArr[2];
          const hasNx = cmdArr.some((x: any) => String(x).toUpperCase() === 'NX');

          if (hasNx && redisStore.has(key)) {
            results.push({ result: null });
            continue;
          }

          redisStore.set(key, typeof val === 'string' ? val : JSON.stringify(val));
          results.push({ result: 'OK' });
          continue;
        }

        if (cmd === 'GET') {
          const key = cmdArr[1];
          const val = redisStore.get(key) || null;
          results.push({ result: val });
          continue;
        }

        if (cmd === 'EXISTS') {
          const key = cmdArr[1];
          results.push({ result: redisStore.has(key) ? 1 : 0 });
          continue;
        }

        if (cmd === 'DEL') {
          const key = cmdArr[1];
          const deleted = redisStore.delete(key) ? 1 : 0;
          results.push({ result: deleted });
          continue;
        }

        if (cmd === 'SADD') {
          const key = cmdArr[1];
          const member = cmdArr[2];
          if (!setsStore.has(key)) {
            setsStore.set(key, new Set());
          }
          setsStore.get(key)!.add(member);
          results.push({ result: 1 });
          continue;
        }

        if (cmd === 'SMEMBERS') {
          const key = cmdArr[1];
          const members = setsStore.has(key) ? Array.from(setsStore.get(key)!) : [];
          results.push({ result: members });
          continue;
        }

        results.push({ result: null });
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(req.url?.includes('pipeline') || Array.isArray(parsed[0]) ? results : results[0]));
    });

    await new Promise<void>((resolve) => mockServer!.listen(4003, resolve));
    process.env.UPSTASH_REDIS_REST_URL = 'http://localhost:4003';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'mock_test_token_123';
    resetRedisClient();
  }

  try {
    // ─── Test 21: Redis connection using a temporary test key and clean it up ───
    console.log('Test 21: Redis Connection & Temporary Test Key Lifecycle');
    const redis = Redis.fromEnv();
    const pingRes = await redis.ping();
    if (pingRes !== 'PONG') {
      throw new Error(`Expected PONG, received: ${pingRes}`);
    }
    console.log('✅ PING command returned PONG.');

    const tempKey = `knotsnco_test_${Date.now()}`;
    const testPayload = { test: true, time: new Date().toISOString() };
    await redis.set(tempKey, JSON.stringify(testPayload));

    const retrieved = await redis.get(tempKey);
    const parsedRetrieved = typeof retrieved === 'string' ? JSON.parse(retrieved) : retrieved;
    if (!parsedRetrieved || parsedRetrieved.test !== true) {
      throw new Error('Temporary test key verification failed');
    }
    console.log('✅ Temporary test key successfully written and verified.');

    await redis.del(tempKey);
    const postDelete = await redis.get(tempKey);
    if (postDelete !== null) {
      throw new Error('Temporary test key cleanup failed');
    }
    console.log('✅ Temporary test key cleaned up (DEL verified).\n');

    // ─── Test 22: Order creation and retrieval across separate requests ─────────
    console.log('Test 22: Order Creation and Retrieval via Durable Database');
    const db = new Database();

    const sampleOrderRef = `KNOTS-${Date.now()}-TEST`;
    const sampleOrder: InternalOrder = {
      orderReference: sampleOrderRef,
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          productId: 'prod_sunflower',
          variantId: 'gid://shopify/ProductVariant/44296302297151',
          title: 'Sunflower Bouquet',
          image: '/products/bouquet.jpg',
          unitPrice: 1299,
          quantity: 1,
          lineTotal: 1299,
        },
      ],
      pricing: {
        subtotal: 1299,
        discount: 0,
        shippingCharge: 0,
        taxes: 0,
        finalAmount: 1299,
        amountInPaise: 129900,
        currency: 'INR',
      },
      customer: {
        name: 'Simulated Customer',
        email: 'test@knotsnco.com',
        phone: '9876543210',
      },
      shippingAddress: {
        address1: 'Test Line 1',
        city: 'Mumbai',
        province: 'Maharashtra',
        zip: '400001',
        country: 'India',
        countryCode: 'IN',
      },
      billingAddress: {
        address1: 'Test Line 1',
        city: 'Mumbai',
        province: 'Maharashtra',
        zip: '400001',
        country: 'India',
        countryCode: 'IN',
      },
      razorpay: {
        orderId: `order_rzp_${Date.now()}`,
        paymentLinkId: `plink_${Date.now()}`,
      },
    };

    await db.saveOrder(sampleOrder);
    console.log(`✅ Saved order ${sampleOrderRef} to Redis.`);

    // Retrieve by order reference
    const fetchedByRef = await db.getOrderByReference(sampleOrderRef);
    if (!fetchedByRef || fetchedByRef.orderReference !== sampleOrderRef) {
      throw new Error('Failed to retrieve order by orderReference');
    }
    console.log(`✅ Successfully retrieved order by orderReference: ${fetchedByRef.orderReference}`);

    // Retrieve by Razorpay Order ID
    const fetchedByRzpId = await db.getOrderByRazorpayOrderId(sampleOrder.razorpay!.orderId!);
    if (!fetchedByRzpId || fetchedByRzpId.orderReference !== sampleOrderRef) {
      throw new Error('Failed to retrieve order by Razorpay Order ID');
    }
    console.log(`✅ Successfully retrieved order by Razorpay Order ID index: ${sampleOrder.razorpay!.orderId}`);

    // Retrieve by Payment Link ID
    const fetchedByPlinkId = await db.getOrderByPaymentLinkId(sampleOrder.razorpay!.paymentLinkId!);
    if (!fetchedByPlinkId || fetchedByPlinkId.orderReference !== sampleOrderRef) {
      throw new Error('Failed to retrieve order by Payment Link ID index');
    }
    console.log(`✅ Successfully retrieved order by Payment Link ID index: ${sampleOrder.razorpay!.paymentLinkId}\n`);

    // ─── Test 23: Redis persistence across separate serverless invocations ──────
    console.log('Test 23: Redis Persistence Across Separate Serverless Invocations');
    // Emulate a cold-boot serverless invocation with a fresh Database instance and clean memory
    const freshContainerDb = new Database();
    const coldBootOrder = await freshContainerDb.getOrderByReference(sampleOrderRef);
    if (!coldBootOrder || coldBootOrder.orderReference !== sampleOrderRef) {
      throw new Error('Fresh container instance could not find order in Redis!');
    }
    console.log(`✅ Verified order ${sampleOrderRef} persists durably across independent serverless instances.\n`);

    // ─── Test 24: Duplicate payment verification & atomic locking ───────────────
    console.log('Test 24: Duplicate Payment Verification & Atomic Distributed Lock');
    const lock1 = await db.acquireVerificationLock(sampleOrderRef, 10);
    if (!lock1) {
      throw new Error('Initial lock acquisition should succeed');
    }
    console.log(`✅ Lock successfully acquired for order ${sampleOrderRef}.`);

    const lock2 = await db.acquireVerificationLock(sampleOrderRef, 10);
    if (lock2) {
      throw new Error('Concurrent lock acquisition must be blocked!');
    }
    console.log('✅ Concurrent lock attempt blocked atomically (prevents duplicate Shopify order creation).');

    await db.releaseVerificationLock(sampleOrderRef);
    console.log('✅ Lock released.\n');

    // ─── Test 25: Duplicate webhook event handling (Atomic SETNX) ───────────────
    console.log('Test 25: Atomic Webhook Event Deduplication');
    const testWebhookEventId = `evt_test_${Date.now()}`;
    const webhookRecord: WebhookEventRecord = {
      eventId: testWebhookEventId,
      eventType: 'payment.captured',
      orderReference: sampleOrderRef,
      processedAt: new Date().toISOString(),
      status: 'PROCESSING',
    };

    const firstWebhookHandled = await db.recordWebhookEvent(webhookRecord);
    if (!firstWebhookHandled) {
      throw new Error('First webhook event should be accepted');
    }
    console.log(`✅ First webhook event (${testWebhookEventId}) accepted.`);

    const secondWebhookHandled = await db.recordWebhookEvent(webhookRecord);
    if (secondWebhookHandled) {
      throw new Error('Duplicate webhook event MUST be rejected atomically!');
    }
    console.log('✅ Duplicate webhook event rejected atomically via Redis SETNX.\n');

    // ─── Test 26: Invalid Razorpay signatures ───────────────────────────────────
    console.log('Test 26: Cryptographic Signature Verification');
    const dummySecret = 'rzp_secret_verification_test';
    const originalEnv = process.env.RAZORPAY_KEY_SECRET;
    process.env.RAZORPAY_KEY_SECRET = dummySecret;

    const invalidSigResult = verifyStandardCheckoutSignature({
      orderId: 'order_123',
      paymentId: 'pay_456',
      signature: 'fraudulent_signature_hash',
    });
    if (invalidSigResult !== false) {
      throw new Error('Invalid signature must return false');
    }
    console.log('✅ Fraudulent / invalid signature correctly rejected with false.');

    const invalidWebhookSigResult = verifyWebhookSignature(
      Buffer.from('{"test":"payload"}'),
      'invalid_webhook_signature'
    );
    if (invalidWebhookSigResult !== false) {
      throw new Error('Invalid webhook signature must return false');
    }
    console.log('✅ Fraudulent / invalid webhook signature correctly rejected with false.\n');
    process.env.RAZORPAY_KEY_SECRET = originalEnv;

    // ─── Test 27: Shopify order creation payload with mocked payment data ───────
    console.log('Test 27: Shopify Order Creation Payload Verification');
    const payload = buildShopifyOrderCreatePayload(sampleOrder, 'pay_mock_789');
    if ('sendReceipt' in payload.order) {
      throw new Error('sendReceipt must NOT be inside OrderCreateOrderInput!');
    }
    if (payload.options.sendReceipt !== true) {
      throw new Error('Expected options.sendReceipt to be true');
    }
    if (payload.options.inventoryBehaviour !== 'DECREMENT_OBEYING_POLICY') {
      throw new Error('Expected options.inventoryBehaviour to be DECREMENT_OBEYING_POLICY');
    }
    if (!payload.order.transactions[0].amountSet?.shopMoney?.amount) {
      throw new Error('Expected 2026-10 amountSet.shopMoney structure');
    }
    console.log('✅ Shopify Admin API 2026-10 payload correctly configured with DECREMENT_OBEYING_POLICY and sendReceipt.');

    console.log('\n🎉 ALL 7 UPSTASH REDIS & INTEGRATION TEST PHASES PASSED PERFECTLY!');
  } finally {
    if (mockServer) {
      mockServer.close();
    }
  }
}

runUpstashRedisTests().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
