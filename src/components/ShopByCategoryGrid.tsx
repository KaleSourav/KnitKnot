/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUpRight, Sparkles, Flower2 } from 'lucide-react';
import { MAIN_CATEGORIES, MainCategory } from '../data/categories';

interface ShopByCategoryGridProps {
  onSelectCategory: (categorySlug: string) => void;
}

export function ShopByCategoryGrid({ onSelectCategory }: ShopByCategoryGridProps) {
  // Let's create an intentionally varied magazine editorial layout for the 6 categories:
  // Card 1: Flowers (Large feature card with scalloped frame and pastel pink background)
  // Card 2: Flower Pots (Mint green card with desktop vibe and pill badge)
  // Card 3: Keychains & Bag Charms (Butter yellow card with cute sticker collage)
  // Card 4: Accessories (Soft peach card with slow fashion styling)
  // Card 5: Bags (Powder blue card with bold tote presentation)
  // Card 6: Home Decor (Warm cream & burgundy color-block card)

  return (
    <section className="w-full bg-[#FFF5CC] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#811B2B]/15 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header: Retro Editorial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#811B2B]/10 text-[#811B2B] text-xs font-bold mb-3 font-rounded">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CRAFTED CATEGORIES</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#811B2B] tracking-tight">
              Curated With A Whole Lot Of Love.
            </h2>
            <p className="mt-2 text-[#811B2B]/80 font-handwriting text-2xl">
              explore the 6 handmade worlds of Knotsnco ✿
            </p>
          </div>

          <div className="text-right hidden md:block">
            <span className="font-editorial text-4xl font-extrabold text-[#811B2B]/20">
              01 — 06
            </span>
          </div>
        </div>

        {/* Dynamic Asymmetrical Magazine Grid (Cards 1 to 6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {MAIN_CATEGORIES.map((cat, idx) => {
            // Give different cards custom visual personalities
            const isFirst = idx === 0;
            const isTall = idx === 2 || idx === 4;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`group relative rounded-3xl p-6 sm:p-7 border-2 border-[#811B2B] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between overflow-hidden ${
                  isFirst ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
                style={{ backgroundColor: cat.accentBg }}
              >
                {/* Decorative sticker badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#811B2B] text-[#FFF5CC] text-[11px] font-bold tracking-wider uppercase shadow-sm">
                    {cat.badge}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white/70 border border-[#811B2B]/20 flex items-center justify-center text-[#811B2B] group-hover:bg-[#811B2B] group-hover:text-[#FFF5CC] transition-colors shadow-sm">
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Product Imagery */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white/60 mb-5 border border-[#811B2B]/20 shadow-inner">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700"
                  />
                  {/* Floating item count pill */}
                  <div className="absolute bottom-2.5 right-2.5 bg-[#FFF5CC] text-[#811B2B] border border-[#811B2B] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                    {cat.count} Designs
                  </div>
                </div>

                {/* Card Content & Story */}
                <div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#811B2B] group-hover:underline">
                    {cat.name}
                  </h3>
                  <p className="font-handwriting text-xl text-[#811B2B] font-bold mt-1">
                    {cat.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-[#811B2B]/80 font-rounded mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Subcategories tags */}
                  <div className="mt-4 pt-3 border-t border-[#811B2B]/20 flex flex-wrap gap-1.5">
                    {cat.subcategories.slice(0, 3).map((sub, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold text-[#811B2B] bg-white/60 px-2 py-0.5 rounded-md border border-[#811B2B]/10"
                      >
                        {sub}
                      </span>
                    ))}
                    {cat.subcategories.length > 3 && (
                      <span className="text-[10px] font-bold text-[#811B2B]/70 self-center">
                        +{cat.subcategories.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
