/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { Product } from '../data/products';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { ModernProductCard } from './ModernProductCard';

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

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -350 : 350;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section 
      id="bestseller-section"
      className="w-full py-12 sm:py-16 md:py-20 px-3.5 sm:px-6 lg:px-8 select-none overflow-hidden transition-colors duration-700"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#841724]/10 border border-[#841724]/20 text-[#841724] font-bold text-xs uppercase tracking-widest mb-2.5">
              <Flame className="w-3.5 h-3.5 fill-[#841724] text-[#841724]" />
              <span>Viral Drops & Best Sellers</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#1a060a] tracking-tight font-serif">
              The Pieces Everyone's Obsessed With
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl font-medium">
              Hand-stitched viral favorites that sell out in hours. Every petal and stitch made slowly with combed milk cotton.
            </p>
          </div>

          {/* Slider Arrows & View All */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full bg-white hover:bg-[#841724] text-[#841724] hover:text-white border border-[#841724]/20 flex items-center justify-center transition-all duration-300 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full bg-white hover:bg-[#841724] text-[#841724] hover:text-white border border-[#841724]/20 flex items-center justify-center transition-all duration-300 shadow-sm"
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
                    : 'bg-white/80 text-[#2b0b12] border-[#841724]/15 hover:border-[#841724]/40 hover:bg-white'
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
            let badgeText = 'NEW LAUNCH';
            if (index % 4 === 1) badgeText = 'VIRAL DROP';
            if (index % 4 === 2) badgeText = 'BESTSELLER';
            if (index % 4 === 3) badgeText = 'ARTISAN PICK';

            return (
              <div
                key={product.id}
                className="w-[270px] sm:w-[300px] md:w-[320px] shrink-0 snap-start"
              >
                <ModernProductCard
                  product={product}
                  badgeText={badgeText}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
