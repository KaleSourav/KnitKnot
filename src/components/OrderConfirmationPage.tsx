import React, { useEffect, useState } from 'react';
import { DaisyIcon, SparkleIcon, DeliveryTruckIcon } from './ArtisanIcons';

interface OrderData {
  orderReference: string;
  status: string;
  createdAt: string;
  items: Array<{
    productId: string;
    variantId: string;
    title: string;
    subtitle?: string;
    image: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
  pricing: {
    subtotal: number;
    discount: number;
    shippingCharge: number;
    taxes: number;
    finalAmount: number;
    currency: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    province?: string;
    state?: string;
    zip: string;
    country: string;
    firstName?: string;
    lastName?: string;
  };
  razorpay?: {
    orderId?: string;
    paymentId?: string;
    paidAt?: string;
  };
  shopify?: {
    orderNumber?: string;
    createdAt?: string;
    isCreated?: boolean;
    error?: string;
  };
}

interface OrderConfirmationPageProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  onNavigateHome,
  onNavigateShop,
}) => {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Extract orderRef and status from hash / query
  const getOrderRefFromUrl = (): string | null => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash;
    const query = hash.includes('?') ? hash.split('?')[1] : window.location.search.replace('?', '');
    const params = new URLSearchParams(query);
    return params.get('orderRef') || params.get('ref') || null;
  };

  const orderRef = getOrderRefFromUrl();

  useEffect(() => {
    if (!orderRef) {
      setIsLoading(false);
      setErrorMessage('No order reference found in the URL.');
      return;
    }

    let isMounted = true;
    let pollCount = 0;
    const maxPolls = 15; // 30 seconds max

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderRef}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`Order ${orderRef} was not found.`);
          }
          throw new Error('Failed to fetch order details.');
        }

        const data: OrderData = await res.json();
        if (!isMounted) return;

        setOrder(data);
        setIsLoading(false);

        // If Shopify order is still being finalized by backend, continue polling
        if (!data.shopify?.orderNumber && pollCount < maxPolls) {
          pollCount++;
          setTimeout(fetchOrder, 2000);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setIsLoading(false);
        setErrorMessage(err.message || 'Unable to retrieve order details.');
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderRef]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 font-['Fredoka'] text-center">
        <div className="w-16 h-16 rounded-full border-4 border-[#641623]/20 border-t-[#641623] animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-[#641623]">Confirming your order... 🌸</h2>
        <p className="text-sm text-[#2D2424]/70 mt-2 max-w-md">
          Please wait while we verify your Razorpay payment and prepare your order for our artisan dadas and dadis!
        </p>
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 font-['Fredoka'] text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mb-4">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold text-[#641623]">Order Not Found</h2>
        <p className="text-sm text-[#2D2424]/70 mt-2 max-w-md">
          {errorMessage || "We couldn't locate this order reference. If you recently completed payment, your receipt has been emailed to you."}
        </p>
        <button
          onClick={onNavigateShop}
          type="button"
          className="mt-6 px-6 py-3 rounded-full bg-[#641623] text-white font-bold text-sm shadow-md hover:bg-[#52121c] transition-all cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isPaid = order.status === 'PAID' || order.status === 'PAYMENT_CAPTURED_SHOPIFY_PENDING';

  return (
    <div className="min-h-screen bg-[#FBF8CF] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-['Fredoka'] text-[#2D2424]">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Celebration Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#641623]/15 shadow-[0_15px_40px_rgba(100,22,35,0.08)] text-center space-y-4 relative overflow-hidden">
          {/* Decorative Corner Flowers */}
          <div className="absolute top-3 left-4 text-[#641623]/15 text-2xl select-none">🌸</div>
          <div className="absolute top-4 right-5 text-[#641623]/15 text-2xl select-none">✨</div>

          <div className="w-20 h-20 mx-auto rounded-full bg-[#FCE2EB] text-[#641623] flex items-center justify-center shadow-inner">
            <DaisyIcon className="w-12 h-12" />
          </div>

          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isPaid ? 'Payment Confirmed' : order.status}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#641623] pt-2">
              Yay! Your little bundle of happiness is on its way. 🌸
            </h1>
            <p className="text-sm sm:text-base text-[#2D2424]/75 max-w-lg mx-auto leading-relaxed pt-1">
              Thank you for supporting 200+ artisan women across India. Your order has been placed successfully.
            </p>
          </div>

          {/* Quick Identifier Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#FBF8CF] border border-[#641623]/20 font-bold text-[#641623]">
              Internal Ref: <span className="font-mono text-[#2D2424]">{order.orderReference}</span>
            </div>

            {order.shopify?.orderNumber && (
              <div className="px-3.5 py-1.5 rounded-xl bg-[#FCE2EB] border border-[#641623]/20 font-bold text-[#641623]">
                Shopify Order: <span className="font-mono text-[#641623]">{order.shopify.orderNumber}</span>
              </div>
            )}

            {order.razorpay?.paymentId && (
              <div className="px-3.5 py-1.5 rounded-xl bg-[#FBF8CF] border border-[#641623]/20 font-medium text-[#2D2424]/80">
                Razorpay ID: <span className="font-mono text-xs">{order.razorpay.paymentId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Estimated Timeline Card */}
        <div className="bg-[#FFFDF0] rounded-2xl p-5 border border-[#641623]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#641623] text-white flex items-center justify-center shrink-0">
              <DeliveryTruckIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#641623]">Expected Delivery Timeline</h3>
              <p className="text-xs text-[#2D2424]/75">
                ✦ 7–10 days handmade artisan production • 10–15 days door delivery
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-[#641623] block">Tracking sent to:</span>
            <span className="text-xs text-[#2D2424]/80">{order.customer.email}</span>
          </div>
        </div>

        {/* Items & Price Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#641623]/15 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#641623]/15 pb-4">
            <h2 className="text-lg font-bold text-[#641623] flex items-center gap-2">
              <span>Ordered Items</span>
              <span className="text-xs font-normal text-[#2D2424]/60">
                ({order.items.reduce((acc, it) => acc + it.quantity, 0)} pieces)
              </span>
            </h2>
            <span className="text-xs text-[#641623] font-semibold">100% Handcrafted</span>
          </div>

          <div className="divide-y divide-[#641623]/10">
            {order.items.map((item, idx) => (
              <div key={`${item.variantId}_${idx}`} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FBF8CF] border border-[#641623]/10 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <DaisyIcon className="w-8 h-8 text-[#641623]/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-[#641623] truncate">{item.title}</h3>
                  {item.subtitle && <p className="text-xs text-[#2D2424]/60 truncate">{item.subtitle}</p>}
                  <p className="text-xs text-[#2D2424]/75 mt-0.5">
                    Qty: <span className="font-semibold">{item.quantity}</span> × ₹{item.unitPrice.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="font-bold text-sm text-[#641623] shrink-0">
                  ₹{item.lineTotal.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-[#641623]/15 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-[#2D2424]/75">
              <span>Subtotal</span>
              <span className="font-semibold text-[#2D2424]">
                ₹{order.pricing.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-[#2D2424]/75">
              <span>Handmade Insured Shipping</span>
              <span className="font-bold text-emerald-700">FREE</span>
            </div>
            <div className="border-t border-[#641623]/15 pt-3 flex justify-between items-center text-base">
              <span className="font-bold text-[#641623]">Total Paid</span>
              <span className="font-bold text-xl text-[#641623]">
                ₹{order.pricing.finalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#641623]/15 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-[#641623] border-b border-[#641623]/10 pb-2">
              Delivery Address
            </h3>
            <div className="text-xs text-[#2D2424]/85 space-y-0.5 leading-relaxed">
              <p className="font-bold text-sm text-[#2D2424]">{order.customer.name}</p>
              <p>{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state || order.shippingAddress.province}{' '}
                {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#641623]/15 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-[#641623] border-b border-[#641623]/10 pb-2">
              Contact & Updates
            </h3>
            <div className="text-xs text-[#2D2424]/85 space-y-1.5 leading-relaxed">
              <div>
                <span className="text-[10px] text-[#2D2424]/60 block">Email Receipt:</span>
                <span className="font-medium text-[#2D2424]">{order.customer.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#2D2424]/60 block">Phone / WhatsApp Updates:</span>
                <span className="font-medium text-[#2D2424]">{order.customer.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#2D2424]/60 block">Payment Method:</span>
                <span className="font-medium text-emerald-800">Razorpay Verified (UPI/Cards)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 24-Hour Return & Handmade Policy Assurance */}
        <div className="bg-[#FCE2EB]/70 rounded-3xl p-6 border border-[#641623]/15 space-y-3 text-xs text-[#2D2424]">
          <div className="flex items-center gap-2 font-bold text-[#641623]">
            <SparkleIcon className="w-5 h-5 text-[#641623]" />
            <h4 className="text-sm">Knotsnco Handmade & 24-Hour Return Policy</h4>
          </div>
          <p className="text-[11px] leading-relaxed text-[#2D2424]/80">
            • <strong>24-Hour Return / Exchange:</strong> In case of transit damage or defect, request a return within 24 hours of delivery at{' '}
            <a href="mailto:knotsnco101@gmail.com" className="underline font-bold text-[#641623]">
              knotsnco101@gmail.com
            </a>{' '}
            with an unboxing video.
          </p>
          <p className="text-[11px] leading-relaxed text-[#2D2424]/80">
            • <strong>Handmade Variations:</strong> Every product is handcrafted by our artisan women, aunties and dadis. Minor irregularities in stitches or shape are the signature of authentic handmade craft and not defects.
          </p>
        </div>

        {/* Bottom Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onNavigateShop}
            type="button"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#641623] hover:bg-[#52121c] text-white font-bold text-sm shadow-[0_4px_16px_rgba(100,22,35,0.2)] transition-all cursor-pointer"
          >
            Continue Shopping 🌸
          </button>
          <button
            onClick={onNavigateHome}
            type="button"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-[#FFFDF0] text-[#641623] font-bold text-sm border-2 border-[#641623]/20 transition-all cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
