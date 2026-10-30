/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, Check, Truck } from 'lucide-react';
import { CartItem } from '../data/products';

interface KnotsncoCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  isCheckingOut: boolean;
  onNavigate: (view: string, param?: string) => void;
}

export function KnotsncoCartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isCheckingOut,
  onNavigate,
}: KnotsncoCartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * appliedDiscount);
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  // Free shipping threshold ₹999
  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);
  const shippingProgress = Math.min(100, Math.round((rawSubtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'HAPPINESS10' || code === 'KNOTS10') {
      setAppliedDiscount(0.1);
      setPromoMessage('✨ 10% handmade discount applied!');
    } else {
      setPromoMessage('Invalid coupon code. Try HAPPINESS10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#811B2B]/40 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-[#FFF5CC] text-[#811B2B] h-full shadow-2xl flex flex-col z-10 border-l-2 border-[#811B2B]">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#811B2B]/15 flex items-center justify-between bg-[#FFFEF8]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#811B2B]" />
            <h2 className="font-editorial text-xl font-bold text-[#811B2B]">
              Your Shopping Bag
            </h2>
            <span className="text-xs font-extrabold text-[#811B2B] bg-[#FFF5CC] px-2 py-0.5 rounded-full border border-[#811B2B]/20">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#811B2B]/10 text-[#811B2B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="p-3.5 bg-[#F5C4D5] border-b border-[#811B2B]/15 text-xs font-rounded">
          <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-[#811B2B]">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              {remainingForFreeShipping > 0 ? (
                <span>Add <strong>₹{remainingForFreeShipping}</strong> more for Free Shipping!</span>
              ) : (
                <span className="text-emerald-900 font-extrabold">🎉 You unlocked FREE Shipping across India!</span>
              )}
            </div>
            <span>{shippingProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden">
            <div
              className="h-full bg-[#811B2B] transition-all duration-500 rounded-full"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <span className="text-6xl select-none mb-3">🧺</span>
              <h3 className="font-editorial text-2xl font-bold text-[#811B2B]">
                Your bag is empty
              </h3>
              <p className="text-xs text-[#811B2B]/75 font-rounded mt-1 mb-6 max-w-xs">
                Looks like you haven't added any everlasting flowers or cute pocket pals yet!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNavigate('shop-all');
                }}
                className="px-6 py-3 rounded-full bg-[#811B2B] text-[#FFF5CC] font-bold text-xs tracking-wider uppercase shadow-md hover:bg-[#5C0F19]"
              >
                Explore 252 Handmade Pieces
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="p-3.5 rounded-2xl bg-[#FFFEF8] border border-[#811B2B]/20 shadow-xs flex gap-3 relative"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FFF5CC] shrink-0 border border-[#811B2B]/15">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-editorial text-sm font-bold text-[#811B2B] leading-tight line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-[#811B2B]/60 font-rounded">
                      {item.product.category}
                    </p>

                    {/* Custom Bouquet Details */}
                    {item.customization && (
                      <div className="mt-1 text-[10px] text-[#811B2B]/80 bg-[#FFF5CC] p-1.5 rounded-lg border border-[#811B2B]/10">
                        <p><strong>Wrapping:</strong> {item.customization.wrapping}</p>
                        <p><strong>Ribbon:</strong> {item.customization.ribbonColor}</p>
                        {item.customization.note && (
                          <p className="truncate"><strong>Note:</strong> "{item.customization.note}"</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-editorial text-sm font-extrabold text-[#811B2B]">
                      ₹{item.product.price * item.quantity}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-[#FFF5CC] border border-[#811B2B]/30 rounded-full px-2 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="text-[#811B2B] hover:opacity-75"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#811B2B] w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="text-[#811B2B] hover:opacity-75"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-[#811B2B]/40 hover:text-red-700 p-1"
                      title="Remove from bag"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#FFFEF8] border-t-2 border-[#811B2B] shadow-lg space-y-3">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Discount code (e.g. HAPPINESS10)"
                className="flex-1 px-3 py-2 rounded-xl border border-[#811B2B]/30 bg-[#FFF5CC]/30 text-xs font-rounded uppercase text-[#811B2B] focus:outline-none focus:ring-1 focus:ring-[#811B2B]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#811B2B] text-[#FFF5CC] text-xs font-bold hover:bg-[#5C0F19]"
              >
                Apply
              </button>
            </form>
            {promoMessage && (
              <p className={`text-[11px] font-bold ${appliedDiscount > 0 ? 'text-emerald-800' : 'text-red-600'}`}>
                {promoMessage}
              </p>
            )}

            {/* Calculations */}
            <div className="space-y-1 text-xs text-[#811B2B] font-rounded pt-2 border-t border-[#811B2B]/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">₹{rawSubtotal}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>10% Club Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold">
                  {remainingForFreeShipping === 0 ? 'FREE' : '₹99 (or Free over ₹999)'}
                </span>
              </div>
              <div className="flex justify-between text-base font-editorial font-extrabold pt-2 border-t border-[#811B2B]/15">
                <span>Total Amount:</span>
                <span className="text-xl">₹{finalTotal}</span>
              </div>
            </div>

            {/* Shopify Live Checkout Button */}
            <button
              onClick={onCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 px-6 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xl hover:scale-102 active:scale-98 flex items-center justify-center gap-2 group"
            >
              {isCheckingOut ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#FFF5CC] border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Shopify Checkout...</span>
                </>
              ) : (
                <>
                  <span>PROCEED TO SHOPIFY CHECKOUT</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-[#811B2B]/60 font-rounded">
              🔒 256-bit encrypted checkout powered by official Shopify Storefront
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
