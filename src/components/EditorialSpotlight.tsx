/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../data/products';

interface EditorialSpotlightProps {
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  onExploreCollection: (slug: string) => void;
}

export function EditorialSpotlight({
  onAddToCart,
  onQuickView,
  onExploreCollection,
}: EditorialSpotlightProps) {
  // Feature 2 standout pieces: The Pink Melody Bouquet & The Daisy Granny Square Tote
  const spotlightPiece1: Product = {
    id: 'spotlight-pink-melody',
    name: 'Pink Melody Signature Bouquet',
    category: 'Flowers',
    price: 1599,
    originalPrice: 1999,
    image: '/bloom/bouquet-pink-dawn.jpg',
    rating: 4.9,
    reviewsCount: 88,
    badge: 'Magazine Feature',
    description: 'Our most viral floral arrangement featuring 7 hand-knitted pastel blooms wrapped in blush crepe paper and tied with a burgundy satin bow.',
    details: [
      '7 Signature hand-knitted crochet flowers',
      'Stitched by our Dadis in Surat',
      'Ultra-soft combed cotton yarn',
      'Everlasting keepsake that never wilts',
    ],
    inStock: true,
  };

  const spotlightPiece2: Product = {
    id: 'spotlight-daisy-tote',
    name: 'Handmade Daisy Granny Square Tote',
    category: 'Bags',
    price: 1399,
    originalPrice: 1699,
    image: '/products/tote.jpg',
    rating: 4.8,
    reviewsCount: 64,
    badge: 'Editor Pick',
    description: 'A slow-fashion masterpiece. 24 intricate daisy granny squares stitched together with reinforced shoulder straps and pure cotton lining.',
    details: [
      '24 Hand-stitched granny squares',
      'Comfortable shoulder drop length',
      'Holds 13" laptop, books, and essentials',
      'Machine washable on gentle cycle',
    ],
    inStock: true,
  };

  return (
    <section className="w-full bg-[#FFF5CC] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#811B2B]/15 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#811B2B]/10 text-[#811B2B] text-xs font-bold mb-3 font-rounded">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EDITORIAL SPREAD</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#811B2B] tracking-tight">
              The Knotsnco Spotlight.
            </h2>
            <p className="mt-2 text-[#811B2B]/80 font-handwriting text-2xl">
              statement creations that turn heads wherever you go ✿
            </p>
          </div>

          <span className="hidden md:block font-handwriting text-3xl text-[#811B2B]/60 rotate-2">
            issue no. 04 — Surat edition
          </span>
        </div>

        {/* Spread 1: The Pink Melody Bouquet (Large High-Contrast Color Block) */}
        <div className="rounded-3xl bg-[#BBDDEB] border-2 border-[#811B2B] p-6 sm:p-10 mb-10 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Image Area */}
            <div className="lg:col-span-7 relative">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-white border border-[#811B2B]/20 shadow-inner group">
                <img
                  src={spotlightPiece1.image}
                  alt={spotlightPiece1.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#811B2B] text-[#FFF5CC] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Viral Sensation
                </div>
              </div>
            </div>

            {/* Right Story & Specs */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="font-handwriting text-2xl text-[#811B2B] font-bold">
                  Flowers that stay forever
                </span>
                <h3 className="font-editorial text-2xl sm:text-4xl font-extrabold text-[#811B2B] mt-1 leading-tight">
                  {spotlightPiece1.name}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-[#811B2B]/85 font-rounded leading-relaxed">
                  {spotlightPiece1.description}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-[#811B2B] font-rounded">
                  {spotlightPiece1.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[#811B2B]">✿</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-6 pt-5 border-t border-[#811B2B]/20 flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#811B2B]">
                    ₹{spotlightPiece1.price}
                  </span>
                  <span className="text-xs text-[#811B2B]/60 line-through">
                    ₹{spotlightPiece1.originalPrice}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onQuickView(spotlightPiece1)}
                    className="px-4 py-2.5 rounded-full bg-white text-[#811B2B] border border-[#811B2B] text-xs font-bold hover:bg-[#FFF5CC] transition-colors"
                  >
                    Quick Look
                  </button>
                  <button
                    onClick={() => onAddToCart(spotlightPiece1, 1)}
                    className="px-5 py-2.5 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Spread 2: Daisy Granny Square Tote (Warm Peach / Butter Yellow Block) */}
        <div className="rounded-3xl bg-[#F4D2BB] border-2 border-[#811B2B] p-6 sm:p-10 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Story & Specs */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-between">
              <div>
                <span className="font-handwriting text-2xl text-[#811B2B] font-bold">
                  Slow fashion staple
                </span>
                <h3 className="font-editorial text-2xl sm:text-4xl font-extrabold text-[#811B2B] mt-1 leading-tight">
                  {spotlightPiece2.name}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-[#811B2B]/85 font-rounded leading-relaxed">
                  {spotlightPiece2.description}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-[#811B2B] font-rounded">
                  {spotlightPiece2.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[#811B2B]">🪡</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-6 pt-5 border-t border-[#811B2B]/20 flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#811B2B]">
                    ₹{spotlightPiece2.price}
                  </span>
                  <span className="text-xs text-[#811B2B]/60 line-through">
                    ₹{spotlightPiece2.originalPrice}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onQuickView(spotlightPiece2)}
                    className="px-4 py-2.5 rounded-full bg-white text-[#811B2B] border border-[#811B2B] text-xs font-bold hover:bg-[#FFF5CC] transition-colors"
                  >
                    Quick Look
                  </button>
                  <button
                    onClick={() => onAddToCart(spotlightPiece2, 1)}
                    className="px-5 py-2.5 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Image Area */}
            <div className="lg:col-span-7 order-1 lg:order-2 relative">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-white border border-[#811B2B]/20 shadow-inner group">
                <img
                  src={spotlightPiece2.image}
                  alt={spotlightPiece2.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-[#811B2B] text-[#FFF5CC] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Dadi's Masterpiece
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
