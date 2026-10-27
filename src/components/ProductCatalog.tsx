/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Star, ShoppingBag, Eye, Sparkles, Filter, SlidersHorizontal, ArrowUpDown, Search, ChevronDown, Check } from 'lucide-react';
import { Product } from '../data/products';
import { CATEGORIES_DATA } from '../data/categories';
import { ModernProductCard } from './ModernProductCard';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOpenCategoryDrawer?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onQuickView,
  onOpenCategoryDrawer,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [priceRange, setPriceRange] = useState<'all' | 'under400' | '400to800' | 'above800'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'rating'>('featured');
  const [displayCount, setDisplayCount] = useState<number>(24);

  // Active Category Meta
  const activeCategoryMeta = useMemo(() => {
    return CATEGORIES_DATA.find((c) => c.name.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory]);

  // Filtering products
  const filteredProducts = useMemo(() => {
    const sel = selectedCategory.toLowerCase().trim();
    let result = sel === 'all products' || sel === 'home' || !sel
      ? products
      : products.filter((p) => {
          const cat = (p.category || '').toLowerCase();
          const name = (p.name || '').toLowerCase();
          if (sel === 'bags') {
            return cat === 'bags' || cat.includes('bag') || name.includes('tote') || name.includes('bag');
          }
          if (sel === 'accessories') {
            return (
              cat === 'hair accessories' ||
              cat === 'bandanas' ||
              cat === 'earrings' ||
              cat === 'accessories' ||
              name.includes('clip') ||
              name.includes('gajra') ||
              name.includes('bandana')
            );
          }
          if (sel === 'flowers') {
            return (
              cat === 'flowers' ||
              cat === 'fillers' ||
              cat.includes('flower') ||
              name.includes('rose') ||
              name.includes('lily') ||
              name.includes('tulip')
            );
          }
          if (sel === 'home decore' || sel === 'home decor' || sel === 'home & decor') {
            return (
              cat === 'standees' ||
              cat === 'vases' ||
              cat === 'fridge magnets' ||
              cat.includes('decor') ||
              name.includes('standee')
            );
          }
          if (sel === 'flower pots') {
            return cat === 'flower pots' || cat.includes('pot') || name.includes('pot');
          }
          if (sel === 'keychains & bag charms' || sel === 'keychains' || sel === 'bag charms') {
            return cat === 'keychains' || cat === 'bag charms' || name.includes('keychain') || name.includes('charm');
          }
          return cat === sel || cat.includes(sel);
        });

    // Search filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Price range filter
    if (priceRange === 'under400') {
      result = result.filter((p) => p.price <= 400);
    } else if (priceRange === '400to800') {
      result = result.filter((p) => p.price > 400 && p.price <= 800);
    } else if (priceRange === 'above800') {
      result = result.filter((p) => p.price > 800);
    }

    // Sorting
    if (sortBy === 'priceAsc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, searchFilter, priceRange, sortBy]);

  // Paginated slice for smooth mobile rendering
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, displayCount);
  }, [filteredProducts, displayCount]);

  const handleCategorySwitch = (cat: string) => {
    onSelectCategory(cat);
    setDisplayCount(24);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 24);
  };

  const handleShowAll = () => {
    setDisplayCount(filteredProducts.length);
  };

  // Compute category counts dynamically from products list
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  return (
    <section 
      id="catalog-section" 
      className="w-full bg-transparent text-[#2b0b12] py-12 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-12 select-none relative font-['DM_Sans',sans-serif] border-t border-[#841724]/10"
    >
      <div className="max-w-[1540px] mx-auto">
        
        {/* SECTION TITLE & STATS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4 pb-5 border-b border-[#841724]/15">
          <div>
            <div className="flex items-center gap-2 text-[#841724] font-extrabold text-xs uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#841724]" />
              <span>{products.length} Handcrafted Creations</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#2b0b12] tracking-tight">
              Treasures Stitched With Love
            </h2>
            <p className="text-xs sm:text-sm text-[#7c5c62] font-medium mt-1 max-w-2xl leading-relaxed">
              Explore 13 artisanal categories crafted by our artisans in Surat with combed cotton yarns.
            </p>
          </div>

          {/* Quick Category Drawer Button for Mobile/Desktop */}
          {onOpenCategoryDrawer && (
            <button
              onClick={onOpenCategoryDrawer}
              className="inline-flex items-center gap-2 self-start md:self-auto bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#faedd3]" />
              <span>Browse All 13 Categories</span>
              <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-extrabold">
                13
              </span>
            </button>
          )}
        </div>

        {/* 1. HORIZONTAL SCROLLABLE CATEGORY PILLS BAR (MOBILE OPTIMIZED) */}
        <div className="w-full mb-6 pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar flex items-center gap-2">
          {/* ALL PRODUCTS PILL */}
          <button
            onClick={() => handleCategorySwitch('All Products')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm ${
              selectedCategory === 'All Products' || selectedCategory === 'Home'
                ? 'bg-[#841724] text-[#faedd3] border border-[#5c0f19] scale-105 shadow-md'
                : 'bg-[#faedd3] hover:bg-[#f6ebd4] text-[#2b0b12] border border-[#841724]/15'
            }`}
          >
            <span>🧶</span>
            <span>All Products</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
              {products.length}
            </span>
          </button>

          {/* 13 CATEGORY PILLS WITH LIVE COUNTS */}
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            const count = categoryCounts[cat.name] || cat.count;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySwitch(cat.name)}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm ${
                  isSelected
                    ? 'bg-[#841724] text-[#faedd3] border border-[#5c0f19] scale-105 shadow-md'
                    : 'bg-[#faedd3] hover:bg-[#f6ebd4] text-[#2b0b12] border border-[#841724]/15'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-[#faedd3]' : 'bg-[#841724]/10 text-[#841724]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. ACTIVE CATEGORY HERO BANNER (WHEN SPECIFIC CATEGORY IS SELECTED) */}
        {activeCategoryMeta && (
          <div className="mb-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#faedd3] via-[#faf4e8] to-[#f8f0dc] border border-[#841724]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl sm:text-4xl">{activeCategoryMeta.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-2xl font-black text-[#2b0b12] font-serif">
                    {activeCategoryMeta.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full border border-[#841724]/20 bg-[#841724]/10 text-[#841724] text-[10px] font-extrabold">
                    {categoryCounts[activeCategoryMeta.name] || activeCategoryMeta.count} Products
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#7c5c62] font-medium mt-0.5 max-w-xl">
                  {activeCategoryMeta.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCategorySwitch('All Products')}
              className="text-xs font-bold text-[#841724] hover:text-[#5c0f19] underline underline-offset-4 self-end sm:self-auto cursor-pointer"
            >
              Show All 252 Products
            </button>
          </div>
        )}

        {/* 3. FILTER & SORT CONTROLS BAR */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#faedd3] p-3 rounded-2xl border border-[#841724]/15 shadow-sm">
          
          {/* Search within current category */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#841724]/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search in ${selectedCategory === 'Home' || selectedCategory === 'All Products' ? 'all 252 products' : selectedCategory}...`}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#f8f0dc] border border-[#841724]/20 rounded-xl pl-9 pr-3 py-2 text-xs text-[#2b0b12] placeholder-[#841724]/40 focus:outline-none focus:border-[#841724]"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#841724]/60 hover:text-[#841724]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Price Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-bold">
            {[
              { id: 'all', label: 'All Prices' },
              { id: 'under400', label: 'Under ₹400' },
              { id: '400to800', label: '₹400 - ₹800' },
              { id: 'above800', label: '₹800+' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPriceRange(p.id as typeof priceRange)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  priceRange === p.id
                    ? 'bg-[#841724] text-[#faedd3] font-extrabold shadow-sm'
                    : 'bg-[#f8f0dc] hover:bg-[#f3e5c9] text-[#2b0b12] border border-[#841724]/10'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none bg-[#f8f0dc] hover:bg-[#f3e5c9] border border-[#841724]/20 text-[#2b0b12] text-xs font-bold rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-[#841724] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#841724]/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 4. PRODUCTS COUNT SUMMARY */}
        <div className="flex items-center justify-between mb-4 text-xs font-semibold text-[#7c5c62]">
          <span>
            Showing <strong className="text-[#2b0b12]">{visibleProducts.length}</strong> of{' '}
            <strong className="text-[#2b0b12]">{filteredProducts.length}</strong> products
          </span>
          {filteredProducts.length !== products.length && (
            <button
              onClick={() => {
                onSelectCategory('All Products');
                setSearchFilter('');
                setPriceRange('all');
              }}
              className="text-[#841724] hover:text-[#5c0f19] font-bold"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* 5. RESPONSIVE PRODUCT GRID (2 col on mobile, 3 on md, 4 on xl) */}
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {visibleProducts.map((product) => (
              <ModernProductCard
                key={product.id}
                product={product}
                badgeText={product.badge}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#faedd3] rounded-3xl border border-dashed border-[#841724]/30 p-8">
            <span className="text-4xl">🧶</span>
            <h3 className="text-lg font-bold text-[#2b0b12] mt-2">No matching products found</h3>
            <p className="text-xs text-[#7c5c62] mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any items matching your current filters. Try resetting your search or price range.
            </p>
            <button
              onClick={() => {
                onSelectCategory('All Products');
                setSearchFilter('');
                setPriceRange('all');
              }}
              className="mt-4 px-4 py-2 bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] rounded-full text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 6. PAGINATION / LOAD MORE (MOBILE PERFORMANCE ENHANCER) */}
        {visibleProducts.length < filteredProducts.length && (
          <div className="mt-10 sm:mt-14 flex flex-col items-center justify-center gap-3">
            <div className="w-48 h-1.5 bg-[#841724]/15 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#841724] rounded-full transition-all duration-300"
                style={{ width: `${(visibleProducts.length / filteredProducts.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-[#7c5c62] font-medium">
              Showing {visibleProducts.length} of {filteredProducts.length} items
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2.5 bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] font-extrabold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                Load More (+24 items)
              </button>
              <button
                onClick={handleShowAll}
                className="px-5 py-2.5 bg-[#faedd3] hover:bg-[#f6ebd4] text-[#841724] border border-[#841724]/20 font-bold text-xs sm:text-sm rounded-full transition-all cursor-pointer"
              >
                View All ({filteredProducts.length})
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
