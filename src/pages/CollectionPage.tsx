/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Sparkles, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { MAIN_CATEGORIES, MainCategory } from '../data/categories';
import { Product } from '../data/products';
import { KnotsncoProductCard } from '../components/KnotsncoProductCard';

interface CollectionPageProps {
  categorySlug: string;
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  onNavigate: (view: string, param?: string) => void;
}

export function CollectionPage({
  categorySlug,
  products,
  onAddToCart,
  onQuickView,
  onNavigate,
}: CollectionPageProps) {
  // Find current category
  const categoryInfo = MAIN_CATEGORIES.find((c) => c.slug === categorySlug) || MAIN_CATEGORIES[0];

  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(3000);

  // Filter products belonging to this category
  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category === categoryInfo.name);
  }, [products, categoryInfo]);

  // Subcategory and sort filtering
  const filteredProducts = useMemo(() => {
    let result = categoryProducts.filter((p) => p.price <= maxPrice);

    if (selectedSubcategory !== 'All') {
      const sub = selectedSubcategory.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(sub) ||
          p.description.toLowerCase().includes(sub) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(sub)))
      );
    }

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [categoryProducts, selectedSubcategory, sortBy, maxPrice]);

  return (
    <div className="w-full bg-[#FFF5CC] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-2 mb-6 text-xs font-bold text-[#811B2B] font-rounded">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:underline text-[#811B2B]/75 hover:text-[#811B2B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('shop-all')}
            className="hover:underline text-[#811B2B]/75 hover:text-[#811B2B]"
          >
            Shop
          </button>
          <span>/</span>
          <span className="text-[#811B2B] font-extrabold">{categoryInfo.name}</span>
        </div>

        {/* Editorial Category Hero Banner (Ref 1 & Ref 3) */}
        <div
          className="rounded-3xl p-8 sm:p-12 border-2 border-[#811B2B] shadow-xl mb-12 relative overflow-hidden"
          style={{ backgroundColor: categoryInfo.accentBg }}
        >
          {/* Decorative Corner Icon */}
          <div className="absolute top-6 right-8 hidden md:block select-none opacity-25">
            <span className="text-8xl">✿</span>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#811B2B] text-[#FFF5CC] text-[11px] font-bold tracking-wider uppercase mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{categoryInfo.badge}</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl font-black text-[#811B2B] tracking-tight leading-none">
              {categoryInfo.name}
            </h1>

            <p className="font-handwriting text-2xl sm:text-3xl text-[#811B2B] font-bold mt-2">
              {categoryInfo.tagline}
            </p>

            <p className="mt-3 text-xs sm:text-base text-[#811B2B]/85 font-rounded leading-relaxed">
              {categoryInfo.description} {categoryInfo.editorialNote}
            </p>

            <div className="mt-5 flex items-center gap-3 text-xs font-bold text-[#811B2B] font-rounded">
              <span className="bg-white/80 px-3 py-1 rounded-full border border-[#811B2B]/20">
                {categoryProducts.length} Handcrafted Designs
              </span>
              <span className="bg-white/80 px-3 py-1 rounded-full border border-[#811B2B]/20">
                100% Combed Cotton
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="bg-[#FFFEF8] p-4 sm:p-5 rounded-2xl border-2 border-[#811B2B] shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Subcategories Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedSubcategory('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-rounded whitespace-nowrap transition-all border ${
                selectedSubcategory === 'All'
                  ? 'bg-[#811B2B] text-[#FFF5CC] border-[#811B2B]'
                  : 'bg-white text-[#811B2B] border-[#811B2B]/20 hover:border-[#811B2B]/50'
              }`}
            >
              All {categoryInfo.name}
            </button>
            {categoryInfo.subcategories.map((sub) => {
              const isActive = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-rounded whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-[#811B2B] text-[#FFF5CC] border-[#811B2B]'
                      : 'bg-white text-[#811B2B] border-[#811B2B]/20 hover:border-[#811B2B]/50'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>

          {/* Sort & Count */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4 shrink-0">
            <span className="text-xs text-[#811B2B]/70 font-rounded">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#811B2B] font-rounded hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold text-[#811B2B] bg-[#FFF5CC] border border-[#811B2B]/30 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#811B2B]"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((product, idx) => (
              <KnotsncoProductCard
                key={product.id}
                product={product}
                cardIndex={idx}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FFFEF8] rounded-3xl border-2 border-dashed border-[#811B2B]/30 p-8">
            <span className="text-5xl select-none">🌸</span>
            <h3 className="font-editorial text-2xl font-bold text-[#811B2B] mt-3">
              No matching pieces found
            </h3>
            <p className="text-xs sm:text-sm text-[#811B2B]/75 font-rounded mt-1">
              Try adjusting your subcategory filters or explore the complete collection.
            </p>
            <button
              onClick={() => setSelectedSubcategory('All')}
              className="mt-4 px-5 py-2 rounded-full bg-[#811B2B] text-[#FFF5CC] text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

