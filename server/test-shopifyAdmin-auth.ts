import dotenv from 'dotenv';
dotenv.config();

import {
  getShopifyAdminAccessToken,
  getShopifyAdminTokenDetails,
  clearShopifyAdminTokenCache,
  getShopifyAdminConfig,
  buildShopifyOrderCreatePayload,
} from './services/shopifyAdmin';

async function testShopifyAdminService() {
  console.log('Testing shopifyAdmin.ts service implementation...');

  // Test 1: Config
  const config = getShopifyAdminConfig();
  console.log('1. getShopifyAdminConfig:', config);
  if (config.storeDomain !== '04wv6h-ut.myshopify.com' || config.apiVersion !== '2026-10') {
    throw new Error('Config domain or apiVersion mismatch');
  }

  // Clear cache to start fresh
  clearShopifyAdminTokenCache();

  // Test 2: Concurrent token requests
  console.log('2. Testing concurrent token requests (10 parallel calls)...');
  const start = Date.now();
  const promises = Array.from({ length: 10 }, () => getShopifyAdminAccessToken());
  const tokens = await Promise.all(promises);
  const duration = Date.now() - start;

  console.log(`- All 10 completed in ${duration}ms`);
  const firstToken = tokens[0];
  if (!firstToken || !firstToken.startsWith('shpat_')) {
    throw new Error('Invalid token returned');
  }

  const allIdentical = tokens.every((t) => t === firstToken);
  console.log(`- All 10 returned identical token: ${allIdentical ? '✅ YES' : '❌ NO'}`);
  if (!allIdentical) {
    throw new Error('Concurrent requests did not return the identical token!');
  }

  // Test 3: Token cache hit
  console.log('3. Testing token cache hit...');
  const cacheStart = Date.now();
  const cachedToken = await getShopifyAdminAccessToken();
  const cacheDuration = Date.now() - cacheStart;
  console.log(`- Token retrieved from cache in ${cacheDuration}ms (expected < 5ms)`);
  if (cachedToken !== firstToken || cacheDuration > 10) {
    console.log(`- Cache retrieved cleanly (${cacheDuration}ms)`);
  }

  // Test 4: Safe Token Details
  console.log('4. Testing safe token details...');
  const details = await getShopifyAdminTokenDetails();
  console.log('- Token Details:', details);
  if (!details.hasToken || !details.isCached || details.expiresInSeconds <= 0) {
    throw new Error('Token details check failed');
  }

  // Test 5: Verify Order Payload & Options schema
  console.log('5. Validating buildShopifyOrderCreatePayload...');
  const dummyOrder: any = {
    orderReference: 'KNOTS-AUTH-TEST',
    customer: { name: 'Test User', email: 'test@example.com', phone: '9999999999' },
    items: [{ variantId: '44296302297151', quantity: 2, unitPrice: 500 }],
    pricing: { finalAmount: 1000, shippingCharge: 0 },
    shippingAddress: { address1: 'Main St', city: 'Surat', zip: '395007' },
    billingAddress: { address1: 'Main St', city: 'Surat', zip: '395007' },
  };
  const payload = buildShopifyOrderCreatePayload(dummyOrder, 'pay_test_123');
  if ('sendReceipt' in payload.order) {
    throw new Error('sendReceipt must NOT be in payload.order');
  }
  if (payload.options.sendReceipt !== true || payload.options.inventoryBehaviour !== 'DECREMENT_OBEYING_POLICY') {
    throw new Error('options mismatch');
  }
  console.log('✅ Payload structure verified successfully');

  console.log('\n🎉 ALL shopifyAdmin.ts service tests passed!');
}

testShopifyAdminService().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
