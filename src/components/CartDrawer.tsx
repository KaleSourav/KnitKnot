import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Sparkles, Check, ArrowRight } from 'lucide-react';
import { CartItem } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  isCheckingOut?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isCheckingOut = false,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [includeGiftWrap, setIncludeGiftWrap] = useState(true);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = rawSubtotal * appliedDiscount;
  const giftWrapFee = 0; // Complimentary gift wrap
  const total = Math.max(0, rawSubtotal - discountAmount + giftWrapFee);

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, (rawSubtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'KNITLOVE') {
      setAppliedDiscount(0.15); // 15% discount
      setPromoSuccess('15% off applied! Code: KNITLOVE');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try KNITLOVE');
      setPromoSuccess('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-[#faf4e8] border-l border-[#841724]/20 text-[#2b0b12] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* HEADER */}
          <div className="p-4 sm:p-5 border-b border-[#841724]/12 flex items-center justify-between bg-[#faedd3]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#841724]/10 text-[#841724] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#2b0b12] font-serif">Your Shopping Bag</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#841724] text-[#faedd3] font-black">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#841724]/10 text-[#7c5c62] hover:text-[#841724] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          {/* FREE SHIPPING PROGRESS BAR */}
          <div className="px-4 sm:px-5 py-3 bg-[#f8f0dc] border-b border-[#841724]/10">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              {rawSubtotal >= freeShippingThreshold ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" /> You unlocked FREE All-India Shipping!
                </span>
              ) : (
                <span className="text-[#5c3e44]">
                  Add <strong className="text-[#841724] font-black">₹{amountNeededForFreeShipping.toFixed(0)}</strong> more for FREE Shipping!
                </span>
              )}
              <span className="text-[#841724] font-bold text-[11px]">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#841724]/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#841724] to-[#c8102e] transition-all duration-300 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* ITEM LIST */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#841724]/10 flex items-center justify-center text-[#841724] mb-3">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-[#2b0b12] mb-1 font-serif">Your bag is empty</h3>
                <p className="text-xs text-[#7c5c62] max-w-xs mb-4">
                  Discover everlasting floral bouquets and cute amigurumi waiting to be loved.
                </p>
                <button
                  onClick={onClose}
                  className="bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] font-extrabold text-xs px-6 py-2.5 rounded-full shadow-md cursor-pointer transition-all"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-2xl bg-white border border-[#841724]/12 shadow-xs hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover bg-[#faf4ec] shrink-0 border border-stone-100"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-[#2b0b12] line-clamp-1 leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-[#c8102e] transition-colors p-1 cursor-pointer"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs font-black text-[#841724]">
                      ₹{item.product.price}
                    </p>

                    <div className="flex items-center justify-between mt-1.5">
                      {/* Quantity stepper with touch-friendly 32px targets */}
                      <div className="flex items-center gap-2 bg-[#faedd3] rounded-lg p-0.5 border border-[#841724]/20">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center text-[#841724] hover:bg-[#841724]/10 rounded cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center text-[#2b0b12]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center text-[#841724] hover:bg-[#841724]/10 rounded cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-[#2b0b12]">
                        ₹{(item.product.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER & CHECKOUT */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#841724]/15 bg-[#faedd3] space-y-3 pb-6 sm:pb-5">
              {/* GIFT WRAP OPTION */}
              <label className="flex items-center gap-2 text-xs text-[#5c3e44] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGiftWrap}
                  onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                  className="rounded border-[#841724]/30 text-[#841724] focus:ring-0"
                />
                <Sparkles className="w-3.5 h-3.5 text-[#841724]" />
                <span className="font-medium">Complimentary gift wrap & handwritten ribbon note</span>
              </label>

              {/* PROMO CODE */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. KNITLOVE)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-[#841724]/20 rounded-xl px-3 py-1.5 text-xs text-[#2b0b12] placeholder-[#7c5c62] focus:outline-none focus:border-[#841724]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Apply
                </button>
              </div>
              {promoSuccess && <p className="text-[11px] font-bold text-emerald-700">{promoSuccess}</p>}
              {promoError && <p className="text-[11px] font-bold text-[#c8102e]">{promoError}</p>}

              {/* TOTALS */}
              <div className="space-y-1 pt-1.5 border-t border-[#841724]/12 text-xs">
                <div className="flex justify-between text-[#7c5c62]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2b0b12]">₹{rawSubtotal.toFixed(0)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount (15%)</span>
                    <span>-₹{discountAmount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#7c5c62]">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-[#2b0b12]">
                    {rawSubtotal >= freeShippingThreshold ? 'FREE' : '₹99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-[#2b0b12] pt-1.5 border-t border-[#841724]/12">
                  <span>Total</span>
                  <span className="text-[#841724]">
                    ₹{(total + (rawSubtotal >= freeShippingThreshold ? 0 : 99)).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* CHECKOUT BUTTON */}
              <button
                type="button"
                onClick={onCheckout}
                disabled={isCheckingOut}
                className="w-full bg-[#841724] hover:bg-[#5c0f19] active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed text-[#faedd3] font-black text-xs sm:text-sm py-3 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer uppercase tracking-wider"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#faedd3] border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Shopify Checkout...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

