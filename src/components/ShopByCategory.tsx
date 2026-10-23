/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Sparkles, ChevronRight, Layers } from 'lucide-react';
import { CATEGORIES_DATA, MEGA_GROUPS } from '../data/categories';

interface ShopByCategoryProps {
  onSelectCategory: (categoryTab: string) => void;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onSelectCategory }) => {
  const handleCategoryClick = (catName: string) => {
    onSelectCategory(catName);
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="shop-by-category-section"
      className="w-full bg-[#0e0b16] text-white py-14 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-12 select-none relative font-['DM_Sans',sans-serif] border-t border-purple-500/20"
    >
      <div className="max-w-[1540px] mx-auto">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-pink-300 text-xs sm:text-sm uppercase tracking-widest font-extrabold mb-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>13 Artisanal Categories • 252 Unique Products</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
              DISCOVER BY CATEGORY
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-medium mt-1.5 max-w-xl">
              From everlasting bouquets and desk potted plants to granny square totes and pocket fruit turtles.
            </p>
          </div>

          <button
            onClick={() => handleCategoryClick('All Products')}
            className="self-start md:self-auto inline-flex items-center gap-2 bg-[#edd2f7] hover:bg-[#e4c2f1] text-[#4a044e] font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-md"
          >
            <span>Explore All 252 Items</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 1. TOP BENTO GRID - 4 MEGA PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-14">
          
          {/* PILLAR 1: BOUQUETS & FLORALS */}
          <div
            onClick={() => handleCategoryClick('Flowers')}
            className="group relative min-h-[300px] sm:min-h-[360px] rounded-3xl overflow-hidden shadow-lg border border-pink-500/20 flex flex-col justify-end p-5 sm:p-6 cursor-pointer bg-gradient-to-t from-black via-black/50 to-transparent"
          >
            <img
              src="/products/bouquet.jpg"
              alt="Bouquets & Florals"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-pink-500/30 text-pink-200 border border-pink-400/30 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                83 Items • Florals
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-pink-200 transition-colors">
                Flowers & Fillers
              </h3>
              <p className="text-xs text-stone-300 font-medium line-clamp-2 mt-1">
                Roses, lilies, sunflowers, monstera leaves & sage sprigs that never wilt.
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-pink-300 mt-3 group-hover:translate-x-1 transition-transform">
                <span>Shop 61 Blooms & 22 Fillers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* PILLAR 2: HOME & DESK DECOR */}
          <div
            onClick={() => handleCategoryClick('Flower Pots')}
            className="group relative min-h-[300px] sm:min-h-[360px] rounded-3xl overflow-hidden shadow-lg border border-teal-500/20 flex flex-col justify-end p-5 sm:p-6 cursor-pointer bg-gradient-to-t from-black via-black/50 to-transparent"
          >
            <img
              src="/products/tulips.jpg"
              alt="Home & Desk Decor"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                67 Items • Cozy Living
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-teal-200 transition-colors">
                Pots, Vases & Standees
              </h3>
              <p className="text-xs text-stone-300 font-medium line-clamp-2 mt-1">
                Desk planters, ceramic-style vases, cartoon standees & fridge magnets.
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-teal-300 mt-3 group-hover:translate-x-1 transition-transform">
                <span>Shop 4 Decor Collections</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* PILLAR 3: KEYCHAINS & CHARMS */}
          <div
            onClick={() => handleCategoryClick('Keychains')}
            className="group relative min-h-[300px] sm:min-h-[360px] rounded-3xl overflow-hidden shadow-lg border border-amber-500/20 flex flex-col justify-end p-5 sm:p-6 cursor-pointer bg-gradient-to-t from-black via-black/50 to-transparent"
          >
            <img
              src="/products/bunny.jpg"
              alt="Keychains & Charms"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/30 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                46 Items • Pocket Minis
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-200 transition-colors">
                Keychains & Charms
              </h3>
              <p className="text-xs text-stone-300 font-medium line-clamp-2 mt-1">
                Watermelon & kiwi turtles, Barnaby bunny, puffy flower charms & evil eyes.
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-300 mt-3 group-hover:translate-x-1 transition-transform">
                <span>Shop 40 Minis & 6 Charms</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* PILLAR 4: WEARABLES & BAGS */}
          <div
            onClick={() => handleCategoryClick('Bags')}
            className="group relative min-h-[300px] sm:min-h-[360px] rounded-3xl overflow-hidden shadow-lg border border-purple-500/20 flex flex-col justify-end p-5 sm:p-6 cursor-pointer bg-gradient-to-t from-black via-black/50 to-transparent"
          >
            <img
              src="/products/tote.jpg"
              alt="Bags & Wearables"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                47 Items • Slow Fashion
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-purple-200 transition-colors">
                Totes, Hair & Jewelry
              </h3>
              <p className="text-xs text-stone-300 font-medium line-clamp-2 mt-1">
                Granny square totes, blossom hairclips, mogra gajras, studs & bandanas.
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-purple-300 mt-3 group-hover:translate-x-1 transition-transform">
                <span>Shop 4 Wearable Styles</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>

        {/* 2. ALL 13 CATEGORIES QUICK ACCORDION / PILL GRID */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-stone-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Jump Directly into Any Specific Category</span>
            </h3>
            <span className="text-xs text-stone-400">13 Categories</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {CATEGORIES_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-purple-400/50 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-95"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl select-none">{cat.emoji}</span>
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-extrabold ${cat.accentBg}`}>
                      {cat.count}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#edd2f7] transition-colors truncate">
                    {cat.name}
                  </h4>
                </div>
                <span className="text-[10px] text-stone-400 line-clamp-1 mt-1">
                  {cat.tagline}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
