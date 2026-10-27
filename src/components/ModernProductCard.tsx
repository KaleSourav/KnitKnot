/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../data/products';
import { Star, Heart, Eye, Check, ShoppingBag, Sparkles } from 'lucide-react';

interface ModernProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  badgeText?: string;
  specs?: string[];
  notes?: string;
}

export const ModernProductCard: React.FC<ModernProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  badgeText,
  specs,
  notes,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const originalPrice = product.originalPrice || Math.round(product.price * 1.35);
  const discountPct = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  // Auto-generate curated notes line if not provided (like Candied Nuts | Cinnamon | Dates in ref)
  const defaultNotes = notes || (() => {
    const name = product.name.toLowerCase();
    if (name.includes('bouquet') || name.includes('flower') || name.includes('lily') || name.includes('tulip') || name.includes('rose') || name.includes('sunflower')) {
      return 'Combed Cotton | Hand-Wired Stem | Never Wilts';
    }
    if (name.includes('bunny') || name.includes('turtle') || name.includes('plush') || name.includes('standee')) {
      return 'Ultra-Soft Yarn | Micro-Stitched | Desk Companion';
    }
    if (name.includes('tote') || name.includes('bag')) {
      return 'Granny Square | Reinforced Handles | 100% Cotton';
    }
    return '100% Handcrafted | Milk Cotton | Surat Artisans';
  })();

  // Auto-generate spec pills (like [25% Oil Concentration] [Unisex] in ref)
  const defaultSpecs = specs || (() => {
    const name = product.name.toLowerCase();
    if (name.includes('tote') || name.includes('bag')) {
      return ['Hand-Lined', 'Spacious'];
    }
    if (name.includes('charm') || name.includes('keychain')) {
      return ['Brass Ring', 'Lightweight'];
    }
    if (name.includes('plush') || name.includes('bunny') || name.includes('turtle')) {
      return ['Hypoallergenic', 'Durable'];
    }
    return ['100% Cotton', 'Everlasting'];
  })();

  // Top badge text (like NEW LAUNCH in ref)
  const displayBadge = badgeText || product.badge || (discountPct >= 30 ? 'NEW LAUNCH' : 'VIRAL DROP');

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  return (
    <div 
      className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-[#841724]/12 hover:border-[#841724]/35 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
    >
      {/* 1. TOP IMAGE STAGE CONTAINER (MATCHING BLA BLI BLU & PHOOLJHADI REFS) */}
      <div 
        className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#faf4ec] cursor-pointer mb-3.5 border border-stone-100"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
        />

        {/* Top-Left Solid Tag (Matching Reference NEW LAUNCH) */}
        {displayBadge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-block px-2.5 py-1 bg-[#841724] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-md shadow-sm">
              {displayBadge}
            </span>
          </div>
        )}

        {/* Top-Right Circular Wishlist Button (Matching Phooljhadi Reference) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Wishlist"
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#841724] shadow-md border border-[#841724]/15 flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
        >
          <Heart className={`w-4 h-4 stroke-[2.2] transition-colors ${isWishlisted ? 'fill-[#841724] text-[#841724]' : 'text-[#841724]'}`} />
        </button>

        {/* Bottom-Left Floating Rating Badge Inside Image (Matching Bla Bli Blu Reference) */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md sm:rounded-lg bg-white/95 backdrop-blur-md shadow-sm border border-stone-200/60 text-[#2b0b12] text-[11px] sm:text-xs font-black">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{product.rating || 4.8}</span>
            <span className="text-stone-500 font-semibold">({product.reviewsCount || 370})</span>
          </div>
        </div>

        {/* Quick View Eye Button on Hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          aria-label="Quick View"
          className="absolute bottom-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#2b0b12] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* 2. PRODUCT DETAILS SECTION (MATCHING REFERENCE TYPOGRAPHY) */}
      <div className="flex flex-col flex-1 justify-between">
        
        <div>
          {/* Title in Bold, Punchy Modern Style */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-extrabold text-sm sm:text-base text-[#1a060a] leading-tight uppercase tracking-tight hover:text-[#841724] transition-colors cursor-pointer line-clamp-1 font-sans"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Flavor/Ingredient/Craft Notes Line (e.g. Candied Nuts | Cinnamon | Dates) */}
          <p className="text-[11px] sm:text-xs text-stone-500 font-medium truncate mt-1">
            {defaultNotes}
          </p>

          {/* Price Row (Matching Ref: ₹695 ₹1,000 30% OFF) */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base sm:text-lg font-black text-[#1a060a]">
              ₹{product.price}
            </span>
            {originalPrice > product.price && (
              <span className="text-xs sm:text-sm text-stone-400 line-through font-medium">
                ₹{originalPrice}
              </span>
            )}
            {discountPct > 0 && (
              <span className="text-xs sm:text-sm font-black text-[#841724]">
                {discountPct}% OFF
              </span>
            )}
          </div>

          {/* Specification Pills Row (Matching Ref: [25% Oil Concentration] [Unisex]) */}
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            {defaultSpecs.map((spec, sIdx) => (
              <span
                key={sIdx}
                className="px-2 py-0.5 rounded-sm bg-[#f5ede3] text-stone-700 text-[10px] font-semibold tracking-wide"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* 3. BOLD, FULL-WIDTH ADD TO CART BUTTON (MAROON THEME PALETTE #841724) */}
        <div className="pt-3.5 mt-2">
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-sm active:scale-98 cursor-pointer ${
              isAdded
                ? 'bg-emerald-700 text-white scale-102'
                : 'bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] hover:shadow-md'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>ADDED TO CART! ✓</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span>ADD TO CART</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
