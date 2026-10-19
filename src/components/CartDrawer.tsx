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
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [includeGiftWrap, setIncludeGiftWrap] = useState(true);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = rawSubtotal * appliedDiscount;
  const giftWrapFee = includeGiftWrap ? 0 : 0; // Free gift wrap promo
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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-[#110e17] border-l border-purple-500/20 text-white shadow-2xl flex flex-col justify-between">
          
          {/* HEADER */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-pink-300" />
              <h2 className="text-lg font-bold text-white">Your Shopping Bag</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FREE SHIPPING PROGRESS BAR */}
          <div className="px-5 py-3 bg-purple-950/40 border-b border-purple-500/20">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              {rawSubtotal >= freeShippingThreshold ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> You unlocked FREE Shipping!
                </span>
              ) : (
                <span className="text-purple-200">
                  Add <strong className="text-pink-300">₹{amountNeededForFreeShipping.toFixed(0)}</strong> more for FREE Shipping!
                </span>
              )}
              <span className="text-purple-400">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* ITEM LIST */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-300 mb-3">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Your bag is empty</h3>
                <p className="text-xs text-stone-400 max-w-xs mb-4">
                  Discover everlasting floral bouquets and cute amigurumi waiting to be loved.
                </p>
                <button
                  onClick={onClose}
                  className="bg-[#edd2f7] text-[#4a044e] font-extrabold text-xs px-5 py-2.5 rounded-full"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3.5 p-3 rounded-2xl bg-black/40 border border-purple-500/10"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-cover bg-stone-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs font-bold text-[#edd2f7]">
                      ₹{item.product.price}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-stone-900 rounded-lg p-1 border border-stone-800">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-stone-300 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-stone-300 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-white">
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
            <div className="p-5 border-t border-white/10 bg-[#0d0a12] space-y-3">
              {/* GIFT WRAP OPTION */}
              <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGiftWrap}
                  onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                  className="rounded border-stone-700 bg-black text-purple-600 focus:ring-0"
                />
                <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                <span>Complimentary gift wrap & handwritten ribbon note</span>
              </label>

              {/* PROMO CODE */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. KNITLOVE)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-black/50 border border-purple-500/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                >
                  Apply
                </button>
              </div>
              {promoSuccess && <p className="text-[11px] text-emerald-400">{promoSuccess}</p>}
              {promoError && <p className="text-[11px] text-rose-400">{promoError}</p>}

              {/* TOTALS */}
              <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span>₹{rawSubtotal.toFixed(0)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount (15%)</span>
                    <span>-₹{discountAmount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>Standard Shipping</span>
                  <span>{rawSubtotal >= freeShippingThreshold ? 'FREE' : '₹99'}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-[#edd2f7]">
                    ₹{(total + (rawSubtotal >= freeShippingThreshold ? 0 : 99)).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* CHECKOUT BUTTON */}
              <button
                onClick={onCheckout}
                className="w-full bg-[#edd2f7] hover:bg-[#e4c2f1] active:scale-95 text-[#4a044e] font-extrabold text-sm py-3 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
