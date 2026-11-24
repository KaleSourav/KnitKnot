import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✨ Knotsnco Backend Server running on http://localhost:${PORT}`);
  console.log(`📦 Endpoints ready:`);
  console.log(`   - POST /api/checkout/create-order`);
  console.log(`   - POST /api/checkout/verify-payment`);
  console.log(`   - GET  /api/checkout/callback`);
  console.log(`   - POST /api/webhooks/razorpay`);
  console.log(`   - GET  /api/orders/:orderReference`);
  console.log(`   - GET  /api/health`);
});
