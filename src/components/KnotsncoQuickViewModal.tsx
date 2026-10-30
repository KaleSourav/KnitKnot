/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Star, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { Product } from '../data/products';

interface KnotsncoQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onViewFullDetails: (product: Product) => void;
}

export function KnotsncoQuickViewModal({
  product,
  onClose,
  onAddToCart,
  onViewFullDetails,
}: KnotsncoQuickViewModalProps) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(images[0]);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#811B2B]/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#FFFEF8] text-[#811B2B] rounded-3xl border-2 border-[#811B2B] shadow-2xl z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#811B2B] border border-[#811B2B]/20 transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="w-full md:w-1/2 p-6 bg-[#FFF5CC] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#811B2B]/20">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-[#811B2B]/15 shadow-inner">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent && (
              <span className="absolute top-3 left-3 bg-[#811B2B] text-[#FFF5CC] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Mini thumbnails if available */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 ${
                    activeImage === img ? 'border-[#811B2B]' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Add to Cart */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-xs font-bold text-[#811B2B]">
                {product.rating}
              </span>
              <span className="text-[10px] text-[#811B2B]/60 font-rounded">
                ({product.reviewsCount} verified reviews)
              </span>
            </div>

            <h3 className="font-editorial text-2xl font-bold text-[#811B2B] leading-tight">
              {product.name}
            </h3>

            <p className="text-[11px] text-[#811B2B]/70 font-rounded mt-1">
              Category: <strong className="text-[#811B2B]">{product.category}</strong> • Handcrafted
            </p>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-editorial text-2xl font-bold text-[#811B2B]">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#811B2B]/50 line-through font-rounded">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            <p className="mt-3 text-xs text-[#811B2B]/85 font-rounded line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Stepper */}
            <div className="mt-5 flex items-center gap-3">
              <span className="text-xs font-bold text-[#811B2B] font-rounded">Quantity:</span>
              <div className="flex items-center gap-1.5 bg-[#FFF5CC] border border-[#811B2B]/30 rounded-full p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#811B2B]"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-[#811B2B]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#811B2B]"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#811B2B]/15 space-y-2.5">
            <button
              onClick={() => {
                onAddToCart(product, quantity);
                onClose();
              }}
              className="w-full py-3.5 px-6 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag (₹{product.price * quantity})</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onViewFullDetails(product);
              }}
              className="w-full py-2.5 text-center text-xs font-bold text-[#811B2B] hover:underline flex items-center justify-center gap-1 font-rounded"
            >
              <span>View Full Details & Artisan Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

