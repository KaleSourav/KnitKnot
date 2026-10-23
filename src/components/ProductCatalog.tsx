/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Star, ShoppingBag, Eye, Sparkles, Filter, SlidersHorizontal, ArrowUpDown, Search, ChevronDown, Check } from 'lucide-react';
import { Product } from '../data/products';
import { CATEGORIES_DATA } from '../data/categories';

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
    let result = selectedCategory === 'All Products' || selectedCategory === 'Home'
      ? products
      : products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

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
      className="w-full bg-[#fcfbfa] text-stone-900 py-12 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-12 select-none relative font-['DM_Sans',sans-serif] border-t border-stone-200/50"
    >
      <div className="max-w-[1540px] mx-auto">
        
        {/* SECTION TITLE & STATS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4 pb-5 border-b border-stone-200/70">
          <div>
            <div className="flex items-center gap-2 text-purple-700 font-extrabold text-xs uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{products.length} Handcrafted Creations</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight">
              Treasures Stitched With Love
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1 max-w-2xl leading-relaxed">
              Explore 13 artisanal categories crafted by our artisans in Surat with combed cotton yarns.
            </p>
          </div>

          {/* Quick Category Drawer Button for Mobile/Desktop */}
          {onOpenCategoryDrawer && (
            <button
              onClick={onOpenCategoryDrawer}
              className="inline-flex items-center gap-2 self-start md:self-auto bg-stone-900 hover:bg-stone-800 text-white px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#edd2f7]" />
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
                ? 'bg-[#edd2f7] text-[#4a044e] border border-purple-400 scale-105 shadow-md'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
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
                    ? 'bg-[#edd2f7] text-[#4a044e] border border-purple-400 scale-105 shadow-md'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-purple-900/20' : 'bg-stone-100'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. ACTIVE CATEGORY HERO BANNER (WHEN SPECIFIC CATEGORY IS SELECTED) */}
        {activeCategoryMeta && (
          <div className="mb-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-900/10 via-pink-900/5 to-amber-900/10 border border-purple-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl sm:text-4xl">{activeCategoryMeta.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-2xl font-black text-stone-900">
                    {activeCategoryMeta.name}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold ${activeCategoryMeta.accentBg}`}>
                    {categoryCounts[activeCategoryMeta.name] || activeCategoryMeta.count} Products
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5 max-w-xl">
                  {activeCategoryMeta.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCategorySwitch('All Products')}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 underline underline-offset-4 self-end sm:self-auto cursor-pointer"
            >
              Show All 252 Products
            </button>
          </div>
        )}

        {/* 3. FILTER & SORT CONTROLS BAR */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200/80 shadow-sm">
          
          {/* Search within current category */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search in ${selectedCategory === 'Home' || selectedCategory === 'All Products' ? 'all 252 products' : selectedCategory}...`}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-purple-500"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
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
                    ? 'bg-stone-900 text-white font-extrabold shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-600'
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
                className="appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 4. PRODUCTS COUNT SUMMARY */}
        <div className="flex items-center justify-between mb-4 text-xs font-semibold text-stone-500">
          <span>
            Showing <strong className="text-stone-900">{visibleProducts.length}</strong> of{' '}
            <strong className="text-stone-900">{filteredProducts.length}</strong> products
          </span>
          {filteredProducts.length !== products.length && (
            <button
              onClick={() => {
                onSelectCategory('All Products');
                setSearchFilter('');
                setPriceRange('all');
              }}
              className="text-purple-700 hover:text-purple-900 font-bold"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* 5. RESPONSIVE PRODUCT GRID (2 col on mobile, 3 on md, 4 on xl) */}
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-2xl sm:rounded-[26px] p-2.5 sm:p-4 border border-stone-200/80 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* IMAGE WRAPPER */}
                <div 
                  onClick={() => onQuickView(product)}
                  className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 mb-2.5 sm:mb-3.5 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).src = '/products/bouquet.jpg';
                    }}
                  />

                  {/* BADGE */}
                  {product.badge && (
                    <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-white/95 backdrop-blur-md text-[#4a044e] border border-purple-200 text-[8px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      {product.badge}
                    </span>
                  )}

                  {/* DESKTOP HOVER OVERLAY */}
                  <div className="hidden sm:flex absolute inset-0 bg-black/35 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center gap-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(product);
                      }}
                      className="p-2.5 rounded-full bg-white text-stone-900 hover:bg-[#edd2f7] hover:text-[#4a044e] transition-all transform hover:scale-110 shadow-lg cursor-pointer"
                      title="Quick View"
                      aria-label={`Quick View ${product.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="p-2.5 rounded-full bg-[#edd2f7] text-[#4a044e] hover:bg-white transition-all transform hover:scale-110 shadow-lg cursor-pointer"
                      title="Add to Cart"
                      aria-label={`Add ${product.name} to Cart`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>

                  {/* MOBILE QUICK ADD / VIEW BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickView(product);
                    }}
                    className="sm:hidden absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-md"
                    aria-label="Quick View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* DETAILS */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9px] sm:text-[11px] font-extrabold text-purple-700 uppercase tracking-wider truncate">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-0.5 text-[10px] sm:text-xs text-amber-500 font-bold shrink-0">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3 
                      onClick={() => onQuickView(product)}
                      className="text-xs sm:text-base font-bold text-stone-900 group-hover:text-purple-900 transition-colors line-clamp-1 leading-snug cursor-pointer"
                    >
                      {product.name}
                    </h3>

                    <p className="hidden sm:block text-[11px] text-stone-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* PRICE & ADD BUTTON */}
                  <div className="flex items-center justify-between pt-2.5 sm:pt-3 mt-2 sm:mt-3 border-t border-stone-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm sm:text-lg font-black text-stone-950">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-stone-400 line-through font-semibold">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className="bg-[#edd2f7] hover:bg-[#e4c2f1] active:scale-95 text-[#4a044e] font-extrabold text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                      aria-label={`Add ${product.name} to Cart`}
                    >
                      <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden xs:inline">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8">
            <span className="text-4xl">🧶</span>
            <h3 className="text-lg font-bold text-stone-900 mt-2">No matching products found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any items matching your current filters. Try resetting your search or price range.
            </p>
            <button
              onClick={() => {
                onSelectCategory('All Products');
                setSearchFilter('');
                setPriceRange('all');
              }}
              className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-full text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 6. PAGINATION / LOAD MORE (MOBILE PERFORMANCE ENHANCER) */}
        {visibleProducts.length < filteredProducts.length && (
          <div className="mt-10 sm:mt-14 flex flex-col items-center justify-center gap-3">
            <div className="w-48 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${(visibleProducts.length / filteredProducts.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Showing {visibleProducts.length} of {filteredProducts.length} items
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                Load More (+24 items)
              </button>
              <button
                onClick={handleShowAll}
                className="px-5 py-2.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 font-bold text-xs sm:text-sm rounded-full transition-all cursor-pointer"
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
