/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../data/products';
import { KnotsncoProductCard } from './KnotsncoProductCard';

interface BestsellersShowcaseProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  onViewAll: () => void;
}

export function BestsellersShowcase({
  products,
  onAddToCart,
  onQuickView,
  onViewAll,
}: BestsellersShowcaseProps) {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filterTabs = [
    'All',
    'Flowers',
    'Flower Pots',
    'Keychains & Bag Charms',
    'Accessories',
    'Bags',
    'Home Decor',
  ];

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (selectedFilter === 'All') return true;
    return p.category === selectedFilter;
  });

  // Showcase up to 8 top picks
  const displayedProducts = filteredProducts.slice(0, 8);

  return (
    <section className="w-full bg-[#FFF5CC] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#811B2B]/15 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Heading & Filter Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#811B2B]/10 text-[#811B2B] text-xs font-bold mb-3 font-rounded">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HANDMADE BESTSELLERS</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#811B2B] tracking-tight">
              Most-Loved Little Things.
            </h2>
            <p className="mt-2 text-[#811B2B]/80 font-handwriting text-2xl">
              the pieces our community can't stop gifting ♡
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="self-start md:self-end flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-lg group"
          >
            <span>VIEW ENTIRE CATALOG ({products.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Filter Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold font-rounded whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#811B2B] text-[#FFF5CC] border-[#811B2B] shadow-md scale-105'
                    : 'bg-[#FFFEF8] text-[#811B2B] border-[#811B2B]/20 hover:border-[#811B2B]/50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {displayedProducts.map((product, index) => (
            <KnotsncoProductCard
              key={product.id}
              product={product}
              cardIndex={index}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Bottom Banner Prompt to Make Own Bouquet */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#F5C4D5] border-2 border-[#811B2B] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-center md:text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#811B2B] bg-white/70 px-3 py-1 rounded-full">
              Bespoke Experience
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#811B2B] mt-2">
              Want a bouquet customized just for them?
            </h3>
            <p className="text-xs sm:text-sm text-[#811B2B]/85 font-rounded mt-1">
              Pick individual crochet roses, daisies & sunflowers with custom wrappers and ribbons.
            </p>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('bouquet-customizer-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] font-bold text-xs tracking-wider uppercase transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>OPEN BOUQUET STUDIO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
