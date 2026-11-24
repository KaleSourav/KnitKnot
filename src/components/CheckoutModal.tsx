import React, { useState } from 'react';
import { useCart, CartItemDetails } from '../context/CartContext';
import { SparkleIcon, DaisyIcon } from './ArtisanIcons';

interface AddressFormState {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
}

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    closeCheckout,
    checkoutItems,
    items,
    clearCart,
  } = useCart();

  // Prefer checkoutItems if passed (e.g. for Buy Now), otherwise use cart items
  const activeItems = checkoutItems.length > 0 ? checkoutItems : items;

  // Subtotal calculation
  const subtotal = activeItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const shippingCharge = 0; // Free Standard Delivery
  const total = subtotal + shippingCharge;

  const [formData, setFormData] = useState<AddressFormState>(() => {
    // Try to restore saved customer address from local storage for convenience
    try {
      const saved = localStorage.getItem('knotsnco_customer_address');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: '',
      email: '',
      phone: '',
      address1: '',
      address2: '',
      city: '',
      state: 'Gujarat',
      zip: '',
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isCheckoutOpen || activeItems.length === 0) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your full name.';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid email address for your order receipt.';
    if (!formData.phone.trim() || formData.phone.trim().length < 10) return 'Please enter a valid 10-digit mobile number for delivery updates.';
    if (!formData.address1.trim()) return 'Please enter your street address / house number.';
    if (!formData.city.trim()) return 'Please enter your city.';
    if (!formData.zip.trim() || formData.zip.trim().length < 5) return 'Please enter a valid postal pincode.';
    return null;
  };

  const handleStartPayment = async () => {
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Save address for user convenience
    try {
      localStorage.setItem('knotsnco_customer_address', JSON.stringify(formData));
    } catch {}

    try {
      // 1. Create Internal Pending Order & Razorpay Order on backend
      const createRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: activeItems.map((it) => ({
            productId: it.lineId,
            variantId: it.variantId,
            title: it.title,
            subtitle: it.subtitle,
            image: it.image,
            unitPrice: it.price,
            quantity: it.quantity,
          })),
          customer: {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
          },
          shippingAddress: {
            address1: formData.address1.trim(),
            address2: formData.address2.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            province: formData.state.trim(),
            zip: formData.zip.trim(),
            country: 'India',
            countryCode: 'IN',
          },
        }),
      });

      if (!createRes.ok) {
        const errJson = await createRes.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to initialize checkout session');
      }

      const orderData = await createRes.json();
      const { orderReference, razorpayOrderId, amountInPaise, keyId } = orderData;

      // 2. Launch Razorpay Standard Checkout
      if (typeof window !== 'undefined' && (window as any).Razorpay && keyId && !keyId.includes('placeholder')) {
        const options = {
          key: keyId,
          amount: amountInPaise,
          currency: 'INR',
          name: 'Knotsnco',
          description: `Handmade Order #${orderReference}`,
          image: '/logo-knotsnco.png',
          order_id: razorpayOrderId,
          handler: async (response: any) => {
            try {
              // 3. Verify signature on backend
              const verifyRes = await fetch('/api/checkout/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderReference,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              if (!verifyRes.ok) {
                const verifyErr = await verifyRes.json().catch(() => ({}));
                throw new Error(verifyErr.error || 'Payment signature verification failed.');
              }

              // Payment successfully verified & Shopify order created
              clearCart();
              closeCheckout();
              window.location.hash = `#order-confirmation?orderRef=${orderReference}`;
            } catch (err: any) {
              setErrorMessage(`Verification error: ${err.message}. If funds were debited, our team will verify your payment automatically.`);
            } finally {
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#641623',
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          setIsSubmitting(false);
          setErrorMessage(`Payment failed: ${response.error?.description || 'Transaction was declined.'}`);
        });
        rzp.open();
      } else {
        // Fallback or Test Mode (when Razorpay credentials are test/unconfigured on backend)
        console.log('[Checkout] Using Test/Dev Mode payment simulation for Order Ref:', orderReference);
        
        // Simulate successful test payment verification
        const mockPaymentId = `pay_mock_${Date.now()}`;
        const verifyRes = await fetch('/api/checkout/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderReference,
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: 'test_signature_valid',
          }),
        });

        if (!verifyRes.ok) {
          const vErr = await verifyRes.json().catch(() => ({}));
          throw new Error(vErr.error || 'Test verification failed');
        }

        clearCart();
        closeCheckout();
        window.location.hash = `#order-confirmation?orderRef=${orderReference}`;
      }
    } catch (err: any) {
      console.error('[CheckoutModal] Payment initiation error:', err);
      setErrorMessage(err.message || 'An error occurred while launching payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-['Fredoka']">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D2424]/60 backdrop-blur-sm transition-opacity"
        onClick={closeCheckout}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#FBF8CF] rounded-3xl shadow-[0_20px_60px_rgba(100,22,35,0.25)] border-2 border-[#641623]/15 overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-[#641623]/15 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FCE2EB] text-[#641623] flex items-center justify-center shadow-inner">
              <DaisyIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#641623] flex items-center gap-2">
                <span>Where's the love going?</span>
                <span className="text-base text-[#641623]/70">♡</span>
              </h2>
              <p className="text-xs text-[#2D2424]/70 font-medium">
                Handmade with love & patience by 200+ artisan women in India
              </p>
            </div>
          </div>

          <button
            onClick={closeCheckout}
            type="button"
            className="w-9 h-9 rounded-full border border-[#641623]/20 flex items-center justify-center text-[#641623] hover:bg-[#641623]/10 active:scale-95 transition-all cursor-pointer"
            aria-label="Close checkout"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
              <span className="text-base">⚠️</span>
              <p className="font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Customer & Shipping Details (7 cols) */}
            <div className="lg:col-span-7 space-y-5 bg-white p-5 sm:p-6 rounded-2xl border border-[#641623]/10 shadow-sm">
              <div className="border-b border-[#641623]/10 pb-3 flex items-center justify-between">
                <h3 className="font-bold text-base text-[#641623] flex items-center gap-2">
                  <span>1. Contact & Delivery Address</span>
                </h3>
                <span className="text-[11px] text-[#641623]/70 font-medium">Step 1 of 2</span>
              </div>

              <div className="space-y-4 text-sm text-[#2D2424]">
                <div>
                  <label className="block text-xs font-bold text-[#641623] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#641623]/20 focus:border-[#641623] focus:ring-2 focus:ring-[#641623]/15 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#641623] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ananya@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#641623]/20 focus:border-[#641623] focus:ring-2 focus:ring-[#641623]/15 outline-none transition-all"
                    />
                    <span className="text-[10px] text-[#2D2424]/60 block mt-0.5">Order receipt will be sent here</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#641623] mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      maxLength={12}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#641623]/20 focus:border-[#641623] focus:ring-2 focus:ring-[#641623]/15 outline-none transition-all"
                    />
                    <span className="text-[10px] text-[#2D2424]/60 block mt-0.5">For delivery updates & courier OTP</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#641623] mb-1">
                    Street Address / House No. / Flat *
                  </label>
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    placeholder="e.g. Flat 402, Lotus Greens, Citylight Road"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#641623]/20 focus:border-[#641623] focus:ring-2 focus:ring-[#641623]/15 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#641623] mb-1">
                    Landmark / Area (Optional)
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    placeholder="Near Science Centre"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#641623]/20 focus:border-[#641623] focus:ring-2 focus:ring-[#641623]/15 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#641623] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Surat"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#641623]/20 focus:border-[#641623] focus:ring-2 focus:ring-[#641623]/15 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#641623] mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#641623]/20 focus:border-[#641623] focus:ring-2 focus:ring-[#641623]/15 outline-none transition-all bg-white"
                    >
                      <option value="Gujarat">Gujarat</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Other">Other State / UT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#641623] mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="395007"
                      maxLength={6}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#641623]/20 focus:border-[#641623] focus:ring-2 focus:ring-[#641623]/15 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Payment Button (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-[#641623]/10 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-[#641623] border-b border-[#641623]/10 pb-2">
                  Order Summary ({activeItems.reduce((acc, it) => acc + it.quantity, 0)} items)
                </h3>

                {/* Items List */}
                <div className="max-h-52 overflow-y-auto space-y-3 pr-1">
                  {activeItems.map((item, idx) => (
                    <div key={`${item.variantId}_${idx}`} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FBF8CF] border border-[#641623]/10 overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <DaisyIcon className="w-6 h-6 text-[#641623]/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#641623] truncate">{item.title}</h4>
                        {item.subtitle && <p className="text-[10px] text-[#2D2424]/60 truncate">{item.subtitle}</p>}
                        <div className="text-[11px] text-[#2D2424]/75">
                          Qty: <span className="font-bold">{item.quantity}</span> × ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-[#641623]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Totals */}
                <div className="border-t border-[#641623]/10 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-[#2D2424]/70">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#2D2424]">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#2D2424]/70">
                    <span>Handcrafted Production & Insured Delivery</span>
                    <span className="font-bold text-emerald-700">FREE</span>
                  </div>
                  <div className="border-t border-[#641623]/15 pt-2 flex justify-between items-center text-sm">
                    <span className="font-bold text-[#641623]">Total Payable</span>
                    <span className="font-bold text-lg text-[#641623]">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Primary Payment Button */}
                <button
                  type="button"
                  onClick={handleStartPayment}
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-[#641623] hover:bg-[#52121c] active:scale-[0.99] text-white font-bold text-base shadow-[0_6px_20px_rgba(100,22,35,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Opening Secure Checkout...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹{total.toLocaleString('en-IN')} via Razorpay</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Supported Payment Logos & Security Badges */}
                <div className="space-y-2 pt-2 border-t border-[#641623]/10 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#641623] font-semibold">
                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                    <span>Instant UPI • Google Pay • PhonePe • Cards • Netbanking</span>
                  </div>
                  <p className="text-[10px] text-[#2D2424]/60 leading-tight">
                    Secured by 256-bit Razorpay encryption & direct Shopify order synchronization.
                  </p>
                </div>
              </div>

              {/* Handmade & Return Reassurance Card */}
              <div className="p-4 rounded-2xl bg-[#FCE2EB]/60 border border-[#641623]/10 text-xs text-[#641623] space-y-1.5">
                <div className="flex items-center gap-2 font-bold">
                  <SparkleIcon className="w-4 h-4 text-[#641623]" />
                  <span>The Knotsnco Artisan Promise</span>
                </div>
                <p className="text-[11px] text-[#2D2424]/80 leading-relaxed">
                  Every bloom is 100% handcrafted by women artisans. Orders are dispatched in 7–10 days with love. We offer a 24-hour exchange/return for transit damages with unboxing video.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
