/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, Star, Sparkles } from 'lucide-react';
import { Product } from '../data/products';

interface KnotsncoProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  cardIndex?: number;
}

export function KnotsncoProductCard({
  product,
  onAddToCart,
  onQuickView,
  cardIndex = 0,
}: KnotsncoProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Cycle pastel background tones for variety (Ref 2 & Ref 3)
  const pastelBgs = ['#FFFEF8', '#F5C4D5', '#FFF5CC', '#C5E7D4', '#F5DD91', '#BBDDEB', '#F4D2BB'];
  const bg = pastelBgs[cardIndex % pastelBgs.length];

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-3xl p-4 sm:p-5 border-2 border-[#811B2B] flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl select-none"
      style={{ backgroundColor: bg }}
    >
      {/* Top Badges & Wishlist Heart */}
      <div className="flex items-center justify-between mb-3 z-10">
        {/* Custom Pill Badge or Discount Tag */}
        {discountPercent ? (
          <span className="px-2.5 py-0.5 rounded-full bg-[#811B2B] text-[#FFF5CC] text-[10px] font-extrabold tracking-wider uppercase shadow-sm">
            {discountPercent}% OFF
          </span>
        ) : product.badge ? (
          <span className="px-2.5 py-0.5 rounded-full bg-[#811B2B]/10 text-[#811B2B] border border-[#811B2B]/20 text-[10px] font-bold tracking-wider uppercase">
            {product.badge}
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full bg-white/70 text-[#811B2B] text-[10px] font-bold">
            {product.category}
          </span>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isLiked
              ? 'bg-[#811B2B] text-[#FFF5CC] scale-110'
              : 'bg-white/80 text-[#811B2B] hover:bg-white hover:scale-105'
          } border border-[#811B2B]/20 shadow-sm`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image Area with Hover Zoom & Quick View Overlay */}
      <div
        onClick={() => onQuickView(product)}
        className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white cursor-pointer border border-[#811B2B]/15 mb-4 shadow-inner"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700"
          onError={(e) => {
            // Graceful fallback image
            (e.target as HTMLImageElement).src = '/products/bouquet.jpg';
          }}
        />

        {/* Floating Quick View button on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute inset-x-4 bottom-3 py-2 px-3 rounded-full bg-[#FFF5CC]/95 hover:bg-[#FFF5CC] text-[#811B2B] text-xs font-bold border border-[#811B2B] shadow-md flex items-center justify-center gap-1.5 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick Look</span>
        </button>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-[#811B2B]">
              {product.rating}
            </span>
            <span className="text-[10px] text-[#811B2B]/60 font-rounded">
              ({product.reviewsCount} reviews)
            </span>
          </div>

          {/* Product Name */}
          <h4
            onClick={() => onQuickView(product)}
            className="font-editorial text-base sm:text-lg font-bold text-[#811B2B] leading-snug line-clamp-1 cursor-pointer hover:underline"
            title={product.name}
          >
            {product.name}
          </h4>

          {/* Artisan note / category */}
          <p className="text-[11px] text-[#811B2B]/75 font-rounded mt-0.5 truncate">
            {product.category} • Hand-crocheted
          </p>
        </div>

        {/* Pricing & Add To Bag */}
        <div className="mt-4 pt-3 border-t border-[#811B2B]/15 flex items-center justify-between gap-2">
          {/* Prices */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-editorial text-lg sm:text-xl font-bold text-[#811B2B]">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#811B2B]/50 line-through font-rounded">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Pill Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, 1);
            }}
            className="px-3.5 py-2 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] active:scale-95 text-[#FFF5CC] text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>

      </div>
    </div>
  );
}
