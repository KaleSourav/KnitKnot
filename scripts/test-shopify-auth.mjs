import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log('================================================================');
  console.log('Knotsnco - Shopify Admin API OAuth & GraphQL Live Verification');
  console.log('================================================================\n');

  // Step 1: Verify Environment Variables
  console.log('Step 1: Inspecting Required Environment Variables:');
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION;

  console.log(`- SHOPIFY_STORE_DOMAIN:      ${domain ? domain : '❌ MISSING'}`);
  console.log(`- SHOPIFY_CLIENT_ID:         ${clientId ? clientId.substring(0, 6) + '...' + clientId.substring(clientId.length - 4) : '❌ MISSING'}`);
  console.log(`- SHOPIFY_CLIENT_SECRET:     ${clientSecret ? '[CONFIGURED & MASKED]' : '❌ MISSING'}`);
  console.log(`- SHOPIFY_ADMIN_API_VERSION: ${apiVersion ? apiVersion : '❌ MISSING'}`);
  console.log(`- SHOPIFY_ADMIN_ACCESS_TOKEN:${process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ? '⚠️ (Legacy token still present)' : '✅ Not set (Correctly decoupled)'}`);

  if (!domain || !clientId || !clientSecret || !apiVersion) {
    throw new Error('One or more required Shopify environment variables are missing!');
  }

  // Step 2: Live Client Credentials Grant Exchange
  console.log('\nStep 2: Performing Live Client Credentials Grant:');
  console.log(`POST https://${domain}/admin/oauth/access_token`);
  console.log('Content-Type: application/x-www-form-urlencoded');

  const tokenParams = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  const startTime = Date.now();
  const tokenRes = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: tokenParams.toString(),
  });

  const durationMs = Date.now() - startTime;

  if (!tokenRes.ok) {
    const errorBody = await tokenRes.text();
    throw new Error(`Token exchange failed with HTTP ${tokenRes.status}: ${errorBody}`);
  }

  const tokenData = await tokenRes.json();
  console.log(`✅ OAuth token exchange succeeded in ${durationMs}ms!`);
  console.log(`- Token type: Bearer / X-Shopify-Access-Token`);
  console.log(`- Token prefix: ${tokenData.access_token ? tokenData.access_token.substring(0, 10) + '...' : 'NONE'}`);
  console.log(`- Granted Scopes: "${tokenData.scope}"`);
  console.log(`- Token Expiry (expires_in): ${tokenData.expires_in} seconds (~${Math.round(tokenData.expires_in / 3600)} hours)`);

  const hasWriteOrders = tokenData.scope && tokenData.scope.includes('write_orders');
  console.log(`- write_orders scope granted: ${hasWriteOrders ? '✅ YES' : '❌ NO'}`);
  console.log(`  (Note: In Shopify Admin API, write_orders encompasses full read and write access for orders)`);

  // Step 3: Authenticated Admin GraphQL Query
  console.log(`\nStep 3: Executing Authenticated Admin GraphQL Query (API Version: ${apiVersion}):`);
  const endpoint = `https://${domain}/admin/api/${apiVersion}/graphql.json`;
  console.log(`POST ${endpoint}`);

  const gqlQuery = `
    query VerifyAdminAccess {
      shop {
        name
        email
        myshopifyDomain
        currencyCode
        plan {
          displayName
        }
      }
      orders(first: 1) {
        edges {
          node {
            id
            name
            displayFinancialStatus
          }
        }
      }
    }
  `;

  const gqlRes = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': tokenData.access_token,
    },
    body: JSON.stringify({ query: gqlQuery }),
  });

  if (!gqlRes.ok) {
    const gqlErr = await gqlRes.text();
    throw new Error(`GraphQL query failed with HTTP ${gqlRes.status}: ${gqlErr}`);
  }

  const gqlJson = await gqlRes.json();
  if (gqlJson.errors && gqlJson.errors.length > 0) {
    throw new Error(`GraphQL returned errors: ${JSON.stringify(gqlJson.errors)}`);
  }

  console.log('✅ GraphQL Admin query succeeded with HTTP 200!');
  console.log(`- Store Name:             ${gqlJson.data?.shop?.name}`);
  console.log(`- Store myshopifyDomain:  ${gqlJson.data?.shop?.myshopifyDomain}`);
  console.log(`- Currency:               ${gqlJson.data?.shop?.currencyCode}`);
  console.log(`- Plan:                   ${gqlJson.data?.shop?.plan?.displayName || 'Development / Active'}`);
  console.log(`- Order Access (Read):    Verified (${gqlJson.data?.orders?.edges?.length ?? 0} sample orders inspected)`);

  console.log('\n================================================================');
  console.log('✅ LIVE SHOPIFY ADMIN OAUTH & GRAPHQL API VERIFICATION SUCCESSFUL!');
  console.log('   - No customer orders were created.');
  console.log('   - No inventory was modified.');
  console.log('   - All credentials remained secure and masked.');
  console.log('================================================================');
}

main().catch((err) => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
