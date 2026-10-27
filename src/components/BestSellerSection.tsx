/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { Product } from '../data/products';
import { Star, Heart, Eye, Plus, Check, ChevronLeft, ChevronRight, Flame, Sparkles, ShoppingBag } from 'lucide-react';

interface BestSellerSectionProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  onBrowseAll?: () => void;
}

const BESTSELLER_TABS = [
  { id: 'all', label: '🔥 All Bestsellers' },
  { id: 'bouquets', label: '🌸 Eternal Bouquets' },
  { id: 'plushies', label: '🧸 Squishy Plushies' },
  { id: 'charms', label: '🌻 Charms & Trinkets' },
  { id: 'totes', label: '👜 Artisan Totes' },
];

export const BestSellerSection: React.FC<BestSellerSectionProps> = ({
  products,
  onAddToCart,
  onQuickView,
  onBrowseAll,
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter products based on active tab with curated ranking
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    let list = [...products];

    if (activeTab === 'bouquets') {
      list = list.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const grp = (p.group || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        return cat.includes('flower') || cat.includes('bouquet') || grp.includes('floral') || name.includes('lily') || name.includes('rose') || name.includes('tulip');
      });
    } else if (activeTab === 'plushies') {
      list = list.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const grp = (p.group || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        return cat.includes('character') || cat.includes('toy') || cat.includes('plush') || grp.includes('plush') || grp.includes('toy') || name.includes('bunny') || name.includes('turtle') || name.includes('bear');
      });
    } else if (activeTab === 'charms') {
      list = list.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const grp = (p.group || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        return cat.includes('charm') || cat.includes('keychain') || grp.includes('keychain') || name.includes('charm') || name.includes('keychain');
      });
    } else if (activeTab === 'totes') {
      list = list.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const grp = (p.group || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        return cat.includes('bag') || grp.includes('wearable') || name.includes('tote') || name.includes('cardigan');
      });
    }

    // Sort by rating and reviews count for best sellers
    list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));

    // Return top 8 items
    return list.slice(0, 8);
  }, [products, activeTab]);

  const toggleWishlist = (id: string) => {
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = (product: Product) => {
    onAddToCart(product, 1);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1400);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section 
      id="bestseller-section"
      className="w-full bg-[#faf4e8] py-12 sm:py-16 md:py-20 px-3.5 sm:px-6 lg:px-8 border-t border-[#841724]/10 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#841724]/10 border border-[#841724]/20 text-[#841724] font-bold text-xs uppercase tracking-widest mb-2.5">
              <Flame className="w-3.5 h-3.5 fill-[#841724] text-[#841724]" />
              <span>Viral Drops & Best Sellers</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#2b0b12] tracking-tight font-serif">
              The Pieces Everyone's Obsessed With
            </h2>
            <p className="text-sm sm:text-base text-[#7c5c62] mt-2 max-w-xl">
              Hand-stitched viral favorites that sell out in hours. Every petal and stitch made slowly with combed milk cotton.
            </p>
          </div>

          {/* Slider Arrows & View All */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full bg-[#faedd3] hover:bg-[#841724] text-[#841724] hover:text-[#faedd3] border border-[#841724]/20 flex items-center justify-center transition-all duration-300 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full bg-[#faedd3] hover:bg-[#841724] text-[#841724] hover:text-[#faedd3] border border-[#841724]/20 flex items-center justify-center transition-all duration-300 shadow-sm"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
            {onBrowseAll && (
              <button
                onClick={onBrowseAll}
                className="ml-2 text-xs sm:text-sm font-bold text-[#841724] hover:underline underline-offset-4 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {BESTSELLER_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap shrink-0 border ${
                  isActive
                    ? 'bg-[#841724] text-[#faedd3] border-[#841724] shadow-md scale-102'
                    : 'bg-[#faedd3] text-[#2b0b12] border-[#841724]/15 hover:border-[#841724]/40 hover:bg-[#faedd3]/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Products Row / Horizontal Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {filteredProducts.map((product, index) => {
            const isWishlisted = wishlistedIds.has(product.id);
            const isRecentlyAdded = recentlyAddedId === product.id;
            const originalPrice = product.originalPrice || Math.round(product.price * 1.3);
            const discountPct = Math.round(((originalPrice - product.price) / originalPrice) * 100);

            // Gen-Z badges
            let badgeText = '🔥 VIRAL DROP';
            if (index % 4 === 1) badgeText = '✨ ARTISAN PICK';
            if (index % 4 === 2) badgeText = '★ TOP RATED';
            if (index % 4 === 3) badgeText = '⚡ SELLING FAST';

            return (
              <div
                key={product.id}
                className="w-[260px] sm:w-[290px] md:w-[310px] shrink-0 snap-start bg-[#faedd3] rounded-3xl p-3 sm:p-4 border border-[#841724]/15 hover:border-[#841724]/40 hover:shadow-xl transition-all duration-400 flex flex-col justify-between group relative"
              >
                {/* Image & Overlays Frame */}
                <div 
                  className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white/70 mb-3.5 cursor-pointer"
                  onClick={() => onQuickView(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                  />

                  {/* Top Left Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#841724] text-[#faedd3] text-[10px] font-extrabold tracking-wider uppercase shadow-md">
                      <Sparkles className="w-2.5 h-2.5" />
                      {badgeText}
                    </span>
                  </div>

                  {/* Top Right Wishlist & QuickView Buttons */}
                  <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      aria-label="Wishlist"
                      className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all duration-200 ${
                        isWishlisted
                          ? 'bg-[#841724] text-[#faedd3]'
                          : 'bg-white/80 hover:bg-white text-[#2b0b12]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#faedd3]' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(product);
                      }}
                      aria-label="Quick preview"
                      className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#2b0b12] flex items-center justify-center backdrop-blur-md shadow-md transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Discount Tag */}
                  {discountPct > 0 && (
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <span className="px-2 py-0.5 rounded-md bg-[#2b0b12]/80 text-[#faedd3] text-[10px] font-bold backdrop-blur-sm">
                        {discountPct}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-1.5 text-xs text-[#7c5c62] mb-1.5">
                      <div className="flex text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                      </div>
                      <span className="font-extrabold text-[#2b0b12] text-xs">
                        {product.rating || 4.9}
                      </span>
                      <span>({product.reviewsCount || 48})</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[11px] font-medium text-[#841724]">100% Handmade</span>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => onQuickView(product)}
                      className="font-bold text-sm sm:text-base text-[#2b0b12] leading-snug hover:text-[#841724] transition-colors cursor-pointer line-clamp-1"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Category subtle */}
                    <p className="text-[11px] text-[#7c5c62] mt-0.5 font-medium">
                      {product.category || 'Handcrafted'}
                    </p>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between pt-3.5 mt-2 border-t border-[#841724]/10">
                    <div>
                      <span className="text-base sm:text-lg font-black text-[#841724]">
                        ₹{product.price}
                      </span>
                      {originalPrice > product.price && (
                        <span className="text-xs text-stone-400 line-through ml-1.5 font-medium">
                          ₹{originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      aria-label={`Add ${product.name} to bag`}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-sm ${
                        isRecentlyAdded
                          ? 'bg-emerald-600 text-white scale-105'
                          : 'bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] hover:shadow-md active:scale-95'
                      }`}
                    >
                      {isRecentlyAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
