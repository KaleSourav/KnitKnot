import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { DaisyIcon, SparkleIcon, DeliveryTruckIcon, YarnBallIcon } from './ArtisanIcons';

interface CartDrawerProps {
  onNavigateShop?: (category?: string) => void;
}

const optimizeShopifyUrl = (url?: string, width = 200) => {
  if (!url) return '';
  if (url.includes('cdn.shopify.com') && !url.includes('&width=')) {
    return `${url}&width=${width}&format=webp`;
  }
  return url;
};

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateShop }) => {
  const {
    isCartOpen,
    closeCart,
    items,
    cost,
    isLoading,
    updateLineQuantity,
    removeLine,
    proceedToCheckout,
  } = useCart();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  // Free shipping threshold (₹1,999)
  const FREE_SHIPPING_THRESHOLD = 1999;
  const currentSubtotal = cost.subtotal;
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - currentSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((currentSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* 1. Backdrop Overlay */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-[#2D2424]/45 backdrop-blur-[2px] transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* 2. Slide-Over Panel */}
      <aside
        className="relative w-full max-w-md bg-[#FAF4ED] text-[#2D2424] h-full shadow-[0_0_50px_rgba(100,22,35,0.2)] flex flex-col font-['Fredoka'] z-10 transition-transform duration-300 ease-out transform translate-x-0"
        aria-label="Shopping Cart Drawer"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#641623]/15 flex items-center justify-between bg-[#FFFDF9]">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg sm:text-xl text-[#641623] flex items-center gap-2">
              <span>Your Crochet Bag</span>
              <span className="text-sm font-normal text-[#641623]/70">♡</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FCE2EB] text-[#641623] text-xs font-bold">
              {items.reduce((acc, it) => acc + it.quantity, 0)}
            </span>
          </div>

          <button
            onClick={closeCart}
            type="button"
            className="w-8 h-8 rounded-full border border-[#641623]/20 flex items-center justify-center text-[#641623] hover:bg-[#641623]/10 active:scale-95 transition-all cursor-pointer"
            aria-label="Close cart drawer"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Milestone Bar */}
        <div className="bg-[#FAF2E8] px-4 py-3 border-b border-[#641623]/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#641623] mb-1.5">
            <DeliveryTruckIcon className="w-4 h-4 flex-shrink-0" />
            {amountNeeded > 0 ? (
              <span>
                Add <strong className="text-[#811B2B]">₹{amountNeeded}</strong> more for <strong>FREE Express Shipping</strong>!
              </span>
            ) : (
              <span className="text-emerald-800 flex items-center gap-1 font-bold">
                <SparkleIcon className="w-3.5 h-3.5 text-amber-500" />
                You unlocked FREE Express Shipping! 🎉
              </span>
            )}
          </div>
          <div className="w-full h-2 rounded-full bg-white border border-[#641623]/15 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F7BE44] to-[#641623] transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#641623]">
              <div className="w-20 h-20 rounded-full bg-[#FAF2E8] border border-[#641623]/15 flex items-center justify-center mb-4">
                <YarnBallIcon className="w-10 h-10 text-[#641623]/70" />
              </div>
              <h3 className="font-bold text-lg mb-1">Your bag is empty</h3>
              <p className="text-xs text-[#2D2424]/70 max-w-xs mb-6">
                Fill it with everlasting handmade bouquets, keychains, and adorable plushies!
              </p>
              <button
                onClick={() => {
                  closeCart();
                  onNavigateShop?.('all');
                }}
                type="button"
                className="px-6 py-2.5 rounded-full bg-[#641623] text-white font-bold text-sm shadow-sm hover:bg-[#52121c] active:scale-95 transition-all cursor-pointer"
              >
                Explore Handcrafted Blooms
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.lineId}
                className="relative p-3 rounded-2xl bg-white border border-[#641623]/12 shadow-xs flex gap-3.5 items-center"
              >
                {/* Product Image */}
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FAF2E8] border border-[#641623]/10 flex-shrink-0">
                  {item.image ? (
                    <img
                      src={optimizeShopifyUrl(item.image, 160)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#641623]/40">
                      <DaisyIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-[#641623] truncate leading-tight">
                      {item.title}
                    </h4>
                    <button
                      onClick={() => removeLine(item.lineId)}
                      type="button"
                      disabled={isLoading}
                      aria-label={`Remove ${item.title}`}
                      className="text-[#641623]/40 hover:text-[#641623] p-1 -mt-1 -mr-1 transition-colors cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </div>

                  {item.subtitle && (
                    <p className="text-[11px] text-[#2D2424]/60 truncate mt-0.5">{item.subtitle}</p>
                  )}

                  <div className="flex items-center justify-between mt-2.5">
                    {/* Stepper */}
                    <div className="inline-flex items-center h-7 px-2 rounded-full border border-[#641623]/25 bg-[#FAF4ED] text-xs font-bold text-[#641623]">
                      <button
                        onClick={() => updateLineQuantity(item.lineId, item.quantity - 1)}
                        type="button"
                        disabled={isLoading}
                        aria-label="Decrease quantity"
                        className="px-1.5 hover:opacity-70 disabled:opacity-30 cursor-pointer"
                      >
                        −
                      </button>
                      <span className="px-2 select-none">{item.quantity}</span>
                      <button
                        onClick={() => updateLineQuantity(item.lineId, item.quantity + 1)}
                        type="button"
                        disabled={isLoading}
                        aria-label="Increase quantity"
                        className="px-1.5 hover:opacity-70 disabled:opacity-30 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-bold text-sm text-[#641623]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#641623]/15 bg-[#FFFDF9] space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#2D2424]/75 font-medium">Subtotal</span>
              <span className="font-bold text-lg text-[#641623]">
                ₹{cost.subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-[11px] text-[#2D2424]/60">
              Taxes and free shipping discounts calculated at checkout.
            </p>

            {/* Direct Checkout CTA Button */}
            <button
              onClick={proceedToCheckout}
              type="button"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#641623] hover:bg-[#52121c] active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(100,22,35,0.2)] transition-all cursor-pointer disabled:opacity-70"
            >
              <span>Proceed to Checkout</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            {/* Secure Payment Trust Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#641623]/70 font-medium">
              <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
              <span>Secure Checkout powered by Shopify • UPI & Cards accepted</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

