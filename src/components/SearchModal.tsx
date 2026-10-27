/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, X, ShoppingBag } from 'lucide-react';
import { Product } from '../data/products';
import { CATEGORIES_DATA } from '../data/categories';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  if (!isOpen) return null;

  const results = useMemo(() => {
    let list = products;
    if (activeCategoryFilter !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === activeCategoryFilter.toLowerCase());
    }

    if (!query.trim()) {
      return list.slice(0, 8);
    }

    const q = query.toLowerCase().trim();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 20);
  }, [products, query, activeCategoryFilter]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-20 bg-black/70 backdrop-blur-xs font-['DM_Sans',sans-serif]">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#faf4e8] border border-[#841724]/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl z-10 text-[#2b0b12] animate-in fade-in zoom-in-95 duration-150">
        
        {/* SEARCH INPUT BAR */}
        <div className="relative flex items-center mb-3">
          <Search className="w-5 h-5 text-[#841724] absolute left-4 pointer-events-none" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across 252 items (e.g. turtle, tulip, tote, rose, clip)..."
            className="w-full bg-white border border-[#841724]/25 rounded-2xl pl-12 pr-10 py-3 text-xs sm:text-sm text-[#2b0b12] placeholder-[#7c5c62] focus:outline-none focus:border-[#841724] shadow-xs"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 p-1 text-[#7c5c62] hover:text-[#841724] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="absolute right-3.5 p-1 text-[#7c5c62] hover:text-[#841724] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* CATEGORY FILTER PILLS IN SEARCH */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3 text-[11px] font-bold">
          <button
            onClick={() => setActiveCategoryFilter('All')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              activeCategoryFilter === 'All'
                ? 'bg-[#841724] text-[#faedd3] font-black shadow-sm'
                : 'bg-white/80 hover:bg-white text-[#2b0b12] border border-[#841724]/15'
            }`}
          >
            All (252)
          </button>
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.name)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                activeCategoryFilter === cat.name
                  ? 'bg-[#841724] text-[#faedd3] font-black shadow-sm'
                  : 'bg-white/80 hover:bg-white text-[#2b0b12] border border-[#841724]/15'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name} ({cat.count})</span>
            </button>
          ))}
        </div>

        {/* QUICK SEARCH KEYWORDS */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3 pb-3 border-b border-[#841724]/10 text-xs">
          <span className="text-[#7c5c62] text-[11px] font-semibold">Trending:</span>
          {['Turtle', 'Daisy Tote', 'Tulip Pot', 'Standee', 'Mogra Gajra', 'Rose', 'Bunny'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                setActiveCategoryFilter('All');
              }}
              className="px-2.5 py-0.5 rounded-full bg-[#faedd3] hover:bg-[#841724] text-[#841724] hover:text-[#faedd3] border border-[#841724]/15 transition-colors text-[11px] font-medium cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* SEARCH RESULTS */}
        <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1">
          {results.length === 0 ? (
            <div className="py-10 text-center text-[#7c5c62] text-xs">
              No handcrafted pieces found matching &quot;{query}&quot;. Try exploring other categories above!
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white hover:bg-[#faedd3] border border-[#841724]/12 hover:border-[#841724]/30 transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-[#faf4ec] shrink-0 border border-stone-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/products/bouquet.jpg';
                    }}
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#841724] font-black uppercase tracking-wider block">
                      {product.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#2b0b12] group-hover:text-[#841724] transition-colors truncate">
                      {product.name}
                    </h4>
                    <span className="text-xs font-black text-[#841724]">₹{product.price}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="p-2 rounded-xl bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Add to Cart"
                    aria-label={`Add ${product.name} to Cart`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER COUNT */}
        <div className="mt-3 pt-3 border-t border-[#841724]/10 flex items-center justify-between text-[11px] text-[#7c5c62]">
          <span>Showing {results.length} results</span>
          <span className="text-[#841724] font-bold">252 Total Products in Catalog</span>
        </div>

      </div>
    </div>
  );
};

