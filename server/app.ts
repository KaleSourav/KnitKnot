import express, { Request, Response, NextFunction } from 'express';
import { db } from './db';
import {
  createRazorpayOrder,
  createRazorpayPaymentLink,
  verifyStandardCheckoutSignature,
  verifyPaymentLinkSignature,
  verifyWebhookSignature,
  fetchRazorpayPayment,
  getRazorpayConfig,
} from './services/razorpay';
import { createShopifyAdminOrder } from './services/shopifyAdmin';
import { InternalOrder, OrderItem, AddressDetails } from './types';

// Extended Express Request type to include rawBody captured for webhook verification
export interface ExtendedRequest extends Request {
  rawBody?: Buffer;
}

export const app = express();

// Enable CORS headers for development and storefront
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Razorpay-Signature, x-razorpay-event-id'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Capture raw body buffer for Razorpay webhook HMAC-SHA256 signature verification
app.use(
  express.json({
    verify: (req: ExtendedRequest, _res: Response, buf: Buffer) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: true }));

// ─── Health Endpoint ─────────────────────────────────────────────────────────

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: 'Knotsnco Headless Storefront',
    timestamp: new Date().toISOString(),
  });
});

// ─── PART 2: Create Pending Order Before Payment ─────────────────────────────

app.post('/api/checkout/create-order', async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, customer, shippingAddress, billingAddress, mode = 'standard' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Order must contain at least one item.' });
      return;
    }

    if (!customer || !customer.email || !customer.name || !customer.phone) {
      res.status(400).json({ error: 'Customer name, email, and phone are required.' });
      return;
    }

    if (!shippingAddress || !shippingAddress.address1 || !shippingAddress.city || !shippingAddress.zip) {
      res.status(400).json({ error: 'Complete shipping address (address1, city, zip) is required.' });
      return;
    }

    // Generate unique internal order reference: e.g. KNOTS-1732456789-A1B2
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderReference = `KNOTS-${Date.now()}-${randomSuffix}`;

    // Calculate totals securely on the backend
    let subtotal = 0;
    const sanitizedItems: OrderItem[] = items.map((it: any) => {
      const unitPrice = Math.max(0, Number(it.unitPrice || it.price || 0));
      const quantity = Math.max(1, Math.floor(Number(it.quantity || 1)));
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      return {
        productId: String(it.productId || ''),
        variantId: String(it.variantId || ''),
        title: String(it.title || 'Handcrafted Crochet Item'),
        subtitle: it.subtitle ? String(it.subtitle) : undefined,
        image: String(it.image || ''),
        unitPrice,
        quantity,
        lineTotal,
      };
    });

    // Free shipping threshold: Free shipping if subtotal >= ₹1,999, else ₹99 (or 0 if promotion)
    // Note: Knotsnco gives Free Shipping across India on qualifying orders
    const shippingCharge = subtotal >= 1999 ? 0 : 0; // Currently free delivery across India for standard orders
    const discount = 0;
    const taxes = 0; // Prices are all-inclusive of taxes
    const finalAmount = Math.max(1, subtotal + shippingCharge - discount);
    const amountInPaise = Math.round(finalAmount * 100);

    const fullShippingAddress: AddressDetails = {
      address1: shippingAddress.address1,
      address2: shippingAddress.address2 || '',
      city: shippingAddress.city,
      province: shippingAddress.province || shippingAddress.state || '',
      state: shippingAddress.state || shippingAddress.province || '',
      zip: shippingAddress.zip,
      country: shippingAddress.country || 'India',
      countryCode: shippingAddress.countryCode || 'IN',
      firstName: shippingAddress.firstName || customer.name.split(' ')[0] || 'Customer',
      lastName: shippingAddress.lastName || customer.name.split(' ').slice(1).join(' ') || '',
      phone: customer.phone,
    };

    const fullBillingAddress: AddressDetails = billingAddress
      ? {
          address1: billingAddress.address1 || fullShippingAddress.address1,
          address2: billingAddress.address2 || fullShippingAddress.address2,
          city: billingAddress.city || fullShippingAddress.city,
          province: billingAddress.province || fullShippingAddress.province,
          state: billingAddress.state || fullShippingAddress.state,
          zip: billingAddress.zip || fullShippingAddress.zip,
          country: billingAddress.country || 'India',
          countryCode: billingAddress.countryCode || 'IN',
          firstName: billingAddress.firstName || fullShippingAddress.firstName,
          lastName: billingAddress.lastName || fullShippingAddress.lastName,
          phone: billingAddress.phone || fullShippingAddress.phone,
        }
      : { ...fullShippingAddress };

    // Initial pending order
    const pendingOrder: InternalOrder = {
      orderReference,
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: sanitizedItems,
      pricing: {
        subtotal,
        discount,
        shippingCharge,
        taxes,
        finalAmount,
        amountInPaise,
        currency: 'INR',
      },
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
      },
      shippingAddress: fullShippingAddress,
      billingAddress: fullBillingAddress,
      razorpay: {},
    };

    // Create Razorpay Order via Standard Orders API
    const rzpOrder = await createRazorpayOrder({
      orderReference,
      amountInPaise,
      customer: pendingOrder.customer,
      notes: {
        orderReference,
        customerName: pendingOrder.customer.name,
      },
    });

    pendingOrder.razorpay = {
      orderId: rzpOrder.id,
    };

    // If Payment Link hosted flow is requested
    if (mode === 'payment_link') {
      const frontendBaseUrl =
        process.env.FRONTEND_URL ||
        process.env.VITE_FRONTEND_URL ||
        `${req.protocol}://${req.get('host')}`;
      const callbackUrl = `${frontendBaseUrl}/api/checkout/callback`;

      const pLink = await createRazorpayPaymentLink({
        orderReference,
        amountInPaise,
        callbackUrl,
        customer: pendingOrder.customer,
        description: `Knotsnco Handmade Order ${orderReference}`,
      });

      pendingOrder.razorpay.paymentLinkId = pLink.id;
      pendingOrder.razorpay.paymentLinkUrl = pLink.short_url;
    }

    // Persist pending order to durable DB
    db.saveOrder(pendingOrder);

    const { keyId } = getRazorpayConfig();

    res.json({
      success: true,
      orderReference: pendingOrder.orderReference,
      razorpayOrderId: pendingOrder.razorpay.orderId,
      paymentLinkId: pendingOrder.razorpay.paymentLinkId,
      paymentLinkUrl: pendingOrder.razorpay.paymentLinkUrl,
      amount: pendingOrder.pricing.finalAmount,
      amountInPaise: pendingOrder.pricing.amountInPaise,
      currency: 'INR',
      keyId,
      customer: pendingOrder.customer,
    });
  } catch (error: any) {
    console.error('[CreateOrder] Error creating pending order:', error);
    res.status(500).json({
      error: 'Failed to initialize order checkout session',
      details: error.message,
    });
  }
});

// ─── PART 3: Case A — Razorpay Standard Checkout Verification Endpoint ──────

app.post('/api/checkout/verify-payment', async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderReference, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderReference || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ error: 'Missing required Razorpay payment verification parameters.' });
      return;
    }

    const order = db.getOrderByReference(orderReference);
    if (!order) {
      res.status(404).json({ error: `Order with reference ${orderReference} not found.` });
      return;
    }

    // Idempotent: If already processed and marked PAID
    if (order.status === 'PAID' && order.shopify?.orderNumber) {
      res.json({
        success: true,
        orderReference: order.orderReference,
        shopifyOrderNumber: order.shopify.orderNumber,
        shopifyOrderId: order.shopify.orderId,
        message: 'Order is already paid and confirmed in Shopify.',
      });
      return;
    }

    // Verify HMAC-SHA256 signature
    const isSignatureValid = verifyStandardCheckoutSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isSignatureValid) {
      console.error(`[VerifyPayment] Invalid signature for order ${orderReference}.`);
      res.status(400).json({ error: 'Payment verification failed: Invalid cryptographic signature.' });
      return;
    }

    // Verify payment status with Razorpay
    const payment = await fetchRazorpayPayment(razorpay_payment_id);
    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      console.warn(`[VerifyPayment] Payment ${razorpay_payment_id} status is ${payment.status}, expected captured.`);
      res.status(400).json({ error: `Payment is not captured. Current status: ${payment.status}` });
      return;
    }

    // Record capture in internal DB
    order.status = 'PAYMENT_CAPTURED_SHOPIFY_PENDING';
    order.razorpay = {
      ...(order.razorpay || {}),
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      method: payment.method || 'online',
      paidAt: new Date().toISOString(),
    };
    db.saveOrder(order);

    // Call Shopify Admin GraphQL API to create the order
    try {
      const shopifyOrder = await createShopifyAdminOrder(order, razorpay_payment_id);
      order.status = 'PAID';
      order.shopify = {
        orderId: shopifyOrder.orderId,
        orderNumber: shopifyOrder.orderNumber,
        createdAt: shopifyOrder.createdAt,
      };
      db.saveOrder(order);

      res.json({
        success: true,
        orderReference: order.orderReference,
        shopifyOrderNumber: shopifyOrder.orderNumber,
        shopifyOrderId: shopifyOrder.orderId,
      });
    } catch (shopifyError: any) {
      console.error(`[VerifyPayment] Payment verified, but Shopify order creation failed for ${orderReference}:`, shopifyError);
      order.shopify = {
        error: shopifyError.message,
      };
      db.saveOrder(order);

      // Return success with pending sync so user still gets a friendly confirmation
      res.json({
        success: true,
        orderReference: order.orderReference,
        pendingSync: true,
        message: 'Payment received. Your order is finalizing in Shopify.',
      });
    }
  } catch (error: any) {
    console.error('[VerifyPayment] Error during payment verification:', error);
    res.status(500).json({ error: 'Internal error verifying payment', details: error.message });
  }
});

// ─── PART 3: Case B — Razorpay Payment Link GET Callback ────────────────────

app.get('/api/checkout/callback', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      razorpay_payment_id,
      razorpay_payment_link_id,
      razorpay_payment_link_reference_id,
      razorpay_payment_link_status,
      razorpay_signature,
    } = req.query;

    const paymentId = String(razorpay_payment_id || '');
    const linkId = String(razorpay_payment_link_id || '');
    const referenceId = String(razorpay_payment_link_reference_id || '');
    const status = String(razorpay_payment_link_status || '');
    const signature = String(razorpay_signature || '');

    const order = referenceId
      ? db.getOrderByReference(referenceId)
      : linkId
      ? db.getOrderByPaymentLinkId(linkId)
      : undefined;

    const frontendBaseUrl =
      process.env.FRONTEND_URL ||
      process.env.VITE_FRONTEND_URL ||
      `${req.protocol}://${req.get('host')}`;

    if (!order) {
      res.redirect(`${frontendBaseUrl}/#order-confirmation?error=order_not_found`);
      return;
    }

    if (status !== 'paid') {
      res.redirect(`${frontendBaseUrl}/#order-confirmation?orderRef=${order.orderReference}&status=${status}`);
      return;
    }

    // Verify signature
    const isSignatureValid = verifyPaymentLinkSignature({
      paymentLinkId: linkId,
      paymentLinkReferenceId: referenceId,
      paymentLinkStatus: status,
      paymentId,
      signature,
    });

    if (!isSignatureValid) {
      res.redirect(`${frontendBaseUrl}/#order-confirmation?orderRef=${order.orderReference}&error=invalid_signature`);
      return;
    }

    // Create Shopify order if not already created
    if (order.status !== 'PAID' || !order.shopify?.orderNumber) {
      order.status = 'PAYMENT_CAPTURED_SHOPIFY_PENDING';
      order.razorpay = {
        ...(order.razorpay || {}),
        paymentLinkId: linkId,
        paymentId,
        signature,
        paidAt: new Date().toISOString(),
      };
      db.saveOrder(order);

      try {
        const shopifyOrder = await createShopifyAdminOrder(order, paymentId);
        order.status = 'PAID';
        order.shopify = {
          orderId: shopifyOrder.orderId,
          orderNumber: shopifyOrder.orderNumber,
          createdAt: shopifyOrder.createdAt,
        };
        db.saveOrder(order);
      } catch (err: any) {
        console.error(`[Callback] Shopify order creation error: ${err.message}`);
        order.shopify = { error: err.message };
        db.saveOrder(order);
      }
    }

    res.redirect(`${frontendBaseUrl}/#order-confirmation?orderRef=${order.orderReference}&status=success`);
  } catch (error: any) {
    console.error('[Callback] Error handling Razorpay callback:', error);
    res.redirect(`/#order-confirmation?error=internal_error`);
  }
});

// ─── PART 4: Razorpay Webhook Endpoint ───────────────────────────────────────

app.post('/api/webhooks/razorpay', async (req: ExtendedRequest, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const eventId = req.headers['x-razorpay-event-id'] as string;

    if (!signature) {
      console.warn('[Webhook] Missing X-Razorpay-Signature header.');
      res.status(400).json({ error: 'Missing X-Razorpay-Signature header.' });
      return;
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
      console.error('[Webhook] Raw request body not available for signature verification.');
      res.status(500).json({ error: 'Server misconfiguration: Raw body required.' });
      return;
    }

    // Verify HMAC-SHA256 signature
    const isWebhookValid = verifyWebhookSignature(rawBody, signature);
    if (!isWebhookValid) {
      console.error('[Webhook] Invalid X-Razorpay-Signature.');
      res.status(400).json({ error: 'Invalid webhook signature.' });
      return;
    }

    // Deduplication check: if eventId was already processed, ignore
    if (eventId && db.hasWebhookEvent(eventId)) {
      console.log(`[Webhook] Duplicate event ${eventId} received. Skipping.`);
      res.status(200).json({ status: 'duplicate_ignored', eventId });
      return;
    }

    const event = req.body;
    const eventType = event.event;
    console.log(`[Webhook] Processing Razorpay event: ${eventType} (ID: ${eventId || 'unknown'})`);

    let orderReference: string | undefined;
    let paymentId: string | undefined;

    // Handle payment capture / order paid events
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const payment = event.payload?.payment?.entity;
      const order = event.payload?.order?.entity;

      paymentId = payment?.id;
      orderReference =
        payment?.notes?.orderReference ||
        order?.notes?.orderReference ||
        payment?.description?.match(/KNOTS-\d+-[A-Z0-9]+/)?.[0];

      let targetOrder: InternalOrder | undefined;

      if (orderReference) {
        targetOrder = db.getOrderByReference(orderReference);
      } else if (order?.id) {
        targetOrder = db.getOrderByRazorpayOrderId(order.id);
      } else if (paymentId) {
        targetOrder = db.getOrderByPaymentId(paymentId);
      }

      if (targetOrder) {
        orderReference = targetOrder.orderReference;

        // Idempotency check: if not yet marked PAID in Shopify
        if (targetOrder.status !== 'PAID' || !targetOrder.shopify?.orderNumber) {
          targetOrder.status = 'PAYMENT_CAPTURED_SHOPIFY_PENDING';
          targetOrder.razorpay = {
            ...(targetOrder.razorpay || {}),
            orderId: order?.id || targetOrder.razorpay?.orderId,
            paymentId: paymentId || targetOrder.razorpay?.paymentId,
            method: payment?.method || targetOrder.razorpay?.method,
            paidAt: new Date().toISOString(),
          };
          db.saveOrder(targetOrder);

          try {
            const shopifyOrder = await createShopifyAdminOrder(targetOrder, paymentId || 'webhook_captured');
            targetOrder.status = 'PAID';
            targetOrder.shopify = {
              orderId: shopifyOrder.orderId,
              orderNumber: shopifyOrder.orderNumber,
              createdAt: shopifyOrder.createdAt,
            };
            db.saveOrder(targetOrder);
            console.log(`[Webhook] Created Shopify order ${shopifyOrder.orderNumber} for ${targetOrder.orderReference}`);
          } catch (shopErr: any) {
            console.error(`[Webhook] Error creating Shopify order: ${shopErr.message}`);
            targetOrder.shopify = { error: shopErr.message };
            db.saveOrder(targetOrder);
          }
        }
      }
    } else if (eventType === 'payment_link.paid') {
      const pLink = event.payload?.payment_link?.entity;
      const payment = event.payload?.payment?.entity;

      paymentId = payment?.id;
      orderReference = pLink?.reference_id || pLink?.notes?.orderReference;

      const targetOrder = orderReference
        ? db.getOrderByReference(orderReference)
        : db.getOrderByPaymentLinkId(pLink?.id);

      if (targetOrder) {
        if (targetOrder.status !== 'PAID' || !targetOrder.shopify?.orderNumber) {
          targetOrder.status = 'PAID';
          targetOrder.razorpay = {
            ...(targetOrder.razorpay || {}),
            paymentLinkId: pLink?.id,
            paymentId,
            paidAt: new Date().toISOString(),
          };
          db.saveOrder(targetOrder);

          try {
            const shopifyOrder = await createShopifyAdminOrder(targetOrder, paymentId || 'plink_captured');
            targetOrder.shopify = {
              orderId: shopifyOrder.orderId,
              orderNumber: shopifyOrder.orderNumber,
              createdAt: shopifyOrder.createdAt,
            };
            db.saveOrder(targetOrder);
          } catch (err: any) {
            console.error(`[Webhook] Payment link Shopify creation error: ${err.message}`);
          }
        }
      }
    }

    // Record webhook event for deduplication
    if (eventId) {
      db.recordWebhookEvent({
        eventId,
        eventType,
        orderReference,
        razorpayPaymentId: paymentId,
        processedAt: new Date().toISOString(),
        status: 'SUCCESS',
      });
    }

    res.status(200).json({ status: 'ok', event: eventType });
  } catch (error: any) {
    console.error('[Webhook] Unhandled error in webhook handler:', error);
    res.status(500).json({ error: 'Webhook processing error', details: error.message });
  }
});

// ─── PART 6: Public Order Lookup & Polling Endpoint ─────────────────────────

app.get('/api/orders/:orderReference', (req: Request, res: Response): void => {
  const { orderReference } = req.params;
  const order = db.getOrderByReference(orderReference);

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  // Return safe customer order details (exclude internal keys)
  res.json({
    orderReference: order.orderReference,
    status: order.status,
    createdAt: order.createdAt,
    items: order.items,
    pricing: order.pricing,
    customer: {
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
    },
    shippingAddress: order.shippingAddress,
    razorpay: {
      orderId: order.razorpay?.orderId,
      paymentId: order.razorpay?.paymentId,
      paidAt: order.razorpay?.paidAt,
    },
    shopify: {
      orderNumber: order.shopify?.orderNumber,
      createdAt: order.shopify?.createdAt,
      isCreated: Boolean(order.shopify?.orderNumber),
      error: order.shopify?.error,
    },
  });
});
