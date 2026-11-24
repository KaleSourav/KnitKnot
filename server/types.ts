/**
 * Types for Knotsnco Backend Payment & Shopify Order Integration
 */

export type OrderPaymentStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_CAPTURED_SHOPIFY_PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED';

export interface OrderItem {
  productId: string;
  variantId: string;
  title: string;
  subtitle?: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

export interface AddressDetails {
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  state?: string;
  zip: string;
  country: string;
  countryCode: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface InternalOrder {
  orderReference: string; // e.g. KNOTS-1732456789-A1B2
  status: OrderPaymentStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    discount: number;
    shippingCharge: number;
    taxes: number;
    finalAmount: number; // in INR e.g. 1000
    amountInPaise: number; // in paise e.g. 100000
    currency: 'INR';
  };
  customer: CustomerDetails;
  shippingAddress: AddressDetails;
  billingAddress: AddressDetails;
  razorpay?: {
    orderId?: string;
    paymentLinkId?: string;
    paymentLinkUrl?: string;
    paymentId?: string;
    signature?: string;
    method?: string;
    paidAt?: string;
  };
  shopify?: {
    orderId?: string; // GID e.g. gid://shopify/Order/123456789
    orderNumber?: string; // e.g. #1042
    createdAt?: string;
    error?: string;
  };
}

export interface WebhookEventRecord {
  eventId: string;
  eventType: string;
  orderReference?: string;
  razorpayPaymentId?: string;
  processedAt: string;
  status: 'SUCCESS' | 'PROCESSING' | 'IGNORED' | 'ERROR';
  error?: string;
}
