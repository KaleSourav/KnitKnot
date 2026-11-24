import http from 'http';
import handler from '../api/index.js';

async function testVercelHandler() {
  console.log('Testing api/index.ts Vercel Serverless Function entry point...');

  const server = http.createServer(handler);
  await new Promise<void>((resolve) => server.listen(4002, resolve));
  const baseUrl = 'http://localhost:4002';

  try {
    // 1. Health checks on both /api/health and /health
    console.log('1. Testing GET /api/health');
    const res1 = await fetch(`${baseUrl}/api/health`);
    const json1 = await res1.json();
    console.log('Response /api/health:', json1);
    if (res1.status !== 200 || json1.status !== 'ok') {
      throw new Error(`Failed /api/health check: ${JSON.stringify(json1)}`);
    }

    console.log('2. Testing GET /health (simulating stripped prefix)');
    const res2 = await fetch(`${baseUrl}/health`);
    const json2 = await res2.json();
    console.log('Response /health:', json2);
    if (res2.status !== 200 || json2.status !== 'ok') {
      throw new Error(`Failed /health check: ${JSON.stringify(json2)}`);
    }

    // 3. Test 404 for unknown route
    console.log('3. Testing unknown API route');
    const res3 = await fetch(`${baseUrl}/api/unknown-endpoint`);
    if (res3.status !== 404) {
      throw new Error(`Expected 404 for unknown route, got ${res3.status}`);
    }

    // 4. Test OPTIONS CORS preflight on /api/checkout/create-order
    console.log('4. Testing OPTIONS CORS on /api/checkout/create-order');
    const res4 = await fetch(`${baseUrl}/api/checkout/create-order`, { method: 'OPTIONS' });
    if (res4.status !== 200) {
      throw new Error(`Expected 200 for CORS preflight, got ${res4.status}`);
    }

    console.log('\n🎉 api/index.ts Vercel Serverless Function verified successfully!');
  } finally {
    server.close();
  }
}

testVercelHandler().catch((err) => {
  console.error('❌ Vercel handler test failed:', err);
  process.exit(1);
});
