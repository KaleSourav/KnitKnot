/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Sparkles, ArrowLeft, SlidersHorizontal, X } from 'lucide-react';
import { Product } from '../data/products';
import { MAIN_CATEGORIES } from '../data/categories';
import { KnotsncoProductCard } from '../components/KnotsncoProductCard';

interface ShopAllPageProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  onNavigate: (view: string, param?: string) => void;
}

export function ShopAllPage({
  products,
  onAddToCart,
  onQuickView,
  onNavigate,
}: ShopAllPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceTier, setPriceTier] = useState<string>('all');

  const categoriesList = ['All', ...MAIN_CATEGORIES.map((c) => c.name)];

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Price tier
    if (priceTier === 'under-399') {
      result = result.filter((p) => p.price <= 399);
    } else if (priceTier === '400-799') {
      result = result.filter((p) => p.price >= 400 && p.price <= 799);
    } else if (priceTier === '800-plus') {
      result = result.filter((p) => p.price >= 800);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, priceTier]);

  return (
    <div className="w-full bg-[#FFF5CC] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-xs font-bold text-[#811B2B] font-rounded">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:underline text-[#811B2B]/75 hover:text-[#811B2B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-[#811B2B] font-extrabold">Complete Catalog</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#811B2B]/10 text-[#811B2B] text-xs font-bold mb-3 font-rounded">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE FULL TREASURE TROVE</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl font-extrabold text-[#811B2B] tracking-tight">
            Every Little Knot.
          </h1>
          <p className="mt-2 text-[#811B2B]/85 font-handwriting text-2xl">
            {products.length} handmade crochet creations crafted with lots of love ✿
          </p>
        </div>

        {/* Filter Toolbar (Ref 2 Style) */}
        <div className="bg-[#FFFEF8] p-5 sm:p-6 rounded-3xl border-2 border-[#811B2B] shadow-lg mb-10 space-y-4">
          
          {/* Top row: Search input & Sort */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-[#811B2B]/60 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bouquets, turtles, totes, pots, charms..."
                className="w-full pl-11 pr-10 py-2.5 rounded-full border border-[#811B2B]/30 bg-[#FFF5CC]/30 text-[#811B2B] text-xs sm:text-sm font-rounded placeholder-[#811B2B]/50 focus:outline-none focus:ring-2 focus:ring-[#811B2B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#811B2B]/60 hover:text-[#811B2B]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & Count */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
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

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 border-t border-[#811B2B]/10 no-scrollbar">
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold font-rounded whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-[#811B2B] text-[#FFF5CC] border-[#811B2B] shadow-sm'
                      : 'bg-white text-[#811B2B] border-[#811B2B]/20 hover:border-[#811B2B]/50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Price Quick Filter Chips */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#811B2B]/10 text-xs font-rounded">
            <span className="font-bold text-[#811B2B] mr-2">Budget:</span>
            {[
              { id: 'all', label: 'All Prices' },
              { id: 'under-399', label: 'Under ₹399' },
              { id: '400-799', label: '₹400 – ₹799' },
              { id: '800-plus', label: '₹800+' },
            ].map((tier) => (
              <button
                key={tier.id}
                onClick={() => setPriceTier(tier.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  priceTier === tier.id
                    ? 'bg-[#811B2B] text-[#FFF5CC]'
                    : 'bg-[#FFF5CC]/60 text-[#811B2B] hover:bg-[#FFF5CC]'
                }`}
              >
                {tier.label}
              </button>
            ))}
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
          <div className="text-center py-20 bg-[#FFFEF8] rounded-3xl border-2 border-dashed border-[#811B2B]/30 p-8">
            <span className="text-5xl select-none">🔍</span>
            <h3 className="font-editorial text-2xl font-bold text-[#811B2B] mt-3">
              No products match your search
            </h3>
            <p className="text-xs sm:text-sm text-[#811B2B]/75 font-rounded mt-1">
              Try searching for something else or clear your filters to view all 252 items.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setPriceTier('all');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#811B2B] text-[#FFF5CC] text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
