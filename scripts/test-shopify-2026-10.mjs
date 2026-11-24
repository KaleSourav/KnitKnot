/**
 * Live Storefront API 2026-10 Verification Script
 */
import dotenv from 'dotenv';
dotenv.config();

const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN || '04wv6h-ut.myshopify.com';
const token = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '0c626353bdea1d2a4c8f32890eb14565';
const version = process.env.VITE_SHOPIFY_API_VERSION || '2026-10';

console.log(`\n🔍 Verifying Live Shopify Storefront API on version: ${version}`);
console.log(`Endpoint: https://${domain}/api/${version}/graphql.json\n`);

async function post(query, variables = {}) {
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return await res.json();
}

async function run() {
  // 1. Fetch live products
  console.log('1. Testing Live Products Query (first: 5)...');
  const pData = await post(`
    query GetProducts2026 {
      products(first: 5) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id
            title
            handle
            variants(first: 1) {
              edges {
                node {
                  id
                  price { amount currencyCode }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `);

  if (pData.errors) {
    throw new Error(`Products Query Error: ${JSON.stringify(pData.errors)}`);
  }

  const products = pData.data?.products?.edges || [];
  console.log(`✅ Successfully fetched ${products.length} live products on 2026-10.`);
  for (const p of products) {
    const v = p.node.variants.edges[0]?.node;
    console.log(`   - ${p.node.title} (Price: ₹${v?.price?.amount}, Available: ${v?.availableForSale})`);
  }

  const testVariantId = products[0]?.node?.variants?.edges[0]?.node?.id;
  if (!testVariantId) throw new Error('No product variant available for testing');

  // 2. Test live Cart creation
  console.log('\n2. Testing Live Cart Creation (cartCreate) on 2026-10...');
  const cartData = await post(`
    mutation CreateCart2026($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount { amount currencyCode }
            totalAmount { amount currencyCode }
          }
        }
        userErrors { field message }
      }
    }
  `, {
    lines: [{ merchandiseId: testVariantId, quantity: 1 }],
  });

  if (cartData.errors || cartData.data?.cartCreate?.userErrors?.length > 0) {
    throw new Error(`Cart Creation Error: ${JSON.stringify(cartData.errors || cartData.data.cartCreate.userErrors)}`);
  }

  const cart = cartData.data.cartCreate.cart;
  console.log(`✅ Live Cart Created on 2026-10:`);
  console.log(`   - Cart ID: ${cart.id}`);
  console.log(`   - Total Quantity: ${cart.totalQuantity}`);
  console.log(`   - Subtotal: ${cart.cost.subtotalAmount.currencyCode} ${cart.cost.subtotalAmount.amount}`);
  console.log(`   - Checkout URL generated: ${cart.checkoutUrl.substring(0, 50)}...`);

  console.log('\n✨ All live Shopify Storefront API 2026-10 checks passed successfully!\n');
}

run().catch((err) => {
  console.error('❌ Live test failed:', err);
  process.exit(1);
});
