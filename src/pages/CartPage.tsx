/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, Check, Sparkles } from 'lucide-react';
import { CartItem } from '../data/products';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  isCheckingOut: boolean;
  onNavigate: (view: string, param?: string) => void;
}

export function CartPage({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isCheckingOut,
  onNavigate,
}: CartPageProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');

  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * appliedDiscount);
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);

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
    <div className="w-full bg-[#FFF5CC] min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs font-bold text-[#811B2B] font-rounded">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:underline text-[#811B2B]/75 hover:text-[#811B2B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <span>/</span>
          <span className="text-[#811B2B] font-extrabold">Your Shopping Bag</span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#811B2B] mb-8">
          Review Your Handmade Bag.
        </h1>

        {items.length === 0 ? (
          <div className="bg-[#FFFEF8] p-12 rounded-3xl border-2 border-[#811B2B] text-center shadow-xl">
            <span className="text-6xl select-none mb-4 inline-block">🧺</span>
            <h2 className="font-editorial text-2xl font-bold text-[#811B2B]">
              Your bag is currently empty
            </h2>
            <p className="text-xs sm:text-sm text-[#811B2B]/75 font-rounded mt-1 mb-6 max-w-sm mx-auto">
              Ready to find your next favourite little thing? Explore our everlasting flowers, cute keychains, or customize your own bouquet.
            </p>
            <button
              onClick={() => onNavigate('shop-all')}
              className="px-8 py-3.5 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] font-bold text-xs tracking-wider uppercase transition-all shadow-md"
            >
              Explore Catalog (252 Pieces)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Items list (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-[#FFFEF8] p-4 sm:p-6 rounded-3xl border-2 border-[#811B2B] shadow-md flex flex-col sm:flex-row items-center gap-5 justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FFF5CC] shrink-0 border border-[#811B2B]/20">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#811B2B] bg-[#FFF5CC] px-2 py-0.5 rounded-full border border-[#811B2B]/15">
                        {item.product.category}
                      </span>
                      <h3 className="font-editorial text-base sm:text-lg font-bold text-[#811B2B] mt-1">
                        {item.product.name}
                      </h3>
                      <p className="text-xs font-bold text-[#811B2B] font-editorial mt-0.5">
                        ₹{item.product.price} each
                      </p>

                      {item.customization && (
                        <div className="mt-1 text-[11px] text-[#811B2B]/80 font-rounded">
                          <span>Paper: {item.customization.wrapping} • Ribbon: {item.customization.ribbonColor}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#811B2B]/10">
                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-[#FFF5CC] border border-[#811B2B]/30 rounded-full px-3 py-1">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="text-[#811B2B]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-[#811B2B] w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="text-[#811B2B]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-editorial text-lg font-extrabold text-[#811B2B]">
                      ₹{item.product.price * item.quantity}
                    </span>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-[#811B2B]/50 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary box (4 Cols) */}
            <div className="lg:col-span-4 bg-[#FFFEF8] p-6 sm:p-7 rounded-3xl border-2 border-[#811B2B] shadow-xl sticky top-24 space-y-4">
              <h2 className="font-editorial text-xl font-bold text-[#811B2B]">
                Order Summary
              </h2>

              <div className="space-y-2 text-xs font-rounded text-[#811B2B] pt-2 border-t border-[#811B2B]/10">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold">₹{rawSubtotal}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>10% Club Coupon:</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-bold">
                    {remainingForFreeShipping === 0 ? 'FREE' : '₹99 (or Free over ₹999)'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-editorial font-extrabold pt-2 border-t border-[#811B2B]/15">
                  <span>Total Amount:</span>
                  <span className="text-xl">₹{finalTotal}</span>
                </div>
              </div>

              {/* Promo input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code (e.g. HAPPINESS10)"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#811B2B]/30 bg-[#FFF5CC]/30 text-xs font-rounded uppercase text-[#811B2B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#811B2B] text-[#FFF5CC] text-xs font-bold"
                >
                  Apply
                </button>
              </form>
              {promoMessage && (
                <p className={`text-[11px] font-bold ${appliedDiscount > 0 ? 'text-emerald-800' : 'text-red-600'}`}>
                  {promoMessage}
                </p>
              )}

              {/* Checkout Button */}
              <button
                onClick={onCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 px-6 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xl hover:scale-102 flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <span>Connecting to Shopify Checkout...</span>
                ) : (
                  <>
                    <span>PROCEED TO SHOPIFY CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-[#811B2B]/60 font-rounded">
                Official Shopify checkout • UPI, Cards, NetBanking, COD
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
