/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../data/products';
import { MAIN_CATEGORIES } from '../data/categories';

interface KnotsncoSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function KnotsncoSearchModal({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart,
}: KnotsncoSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = searchTerm.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 8)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#811B2B]/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#FFFEF8] text-[#811B2B] rounded-3xl border-2 border-[#811B2B] shadow-2xl z-10 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#811B2B]/15 flex items-center gap-3 bg-[#FFF5CC]">
          <Search className="w-5 h-5 text-[#811B2B]" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search 252 crochet blooms, keychains, totes, planters..."
            className="w-full bg-transparent text-sm sm:text-base font-rounded font-semibold text-[#811B2B] placeholder-[#811B2B]/50 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full hover:bg-[#811B2B]/10 text-[#811B2B]/60"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#811B2B]/10 text-[#811B2B]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Categories when no search term is entered */}
        {!searchTerm.trim() && (
          <div className="p-6">
            <p className="text-xs font-bold text-[#811B2B]/60 uppercase tracking-widest font-rounded mb-3">
              Explore By Category
            </p>
            <div className="flex flex-wrap gap-2">
              {MAIN_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSearchTerm(cat.name)}
                  className="px-3.5 py-1.5 rounded-full bg-[#FFF5CC] hover:bg-[#811B2B] hover:text-[#FFF5CC] text-xs font-bold text-[#811B2B] border border-[#811B2B]/20 transition-all font-rounded flex items-center gap-1.5"
                >
                  <span>✿</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-[#811B2B]/10">
              <p className="text-xs font-bold text-[#811B2B]/60 uppercase tracking-widest font-rounded mb-3">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-[#811B2B] font-rounded">
                {['Pink Melody Bouquet', 'Turtle Keychain', 'Sunflower Pot', 'Daisy Tote', 'Lily Pot'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="hover:underline bg-[#FFF5CC]/60 px-3 py-1 rounded-lg"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results List */}
        {searchTerm.trim() && (
          <div className="p-4 max-h-[60vh] overflow-y-auto divide-y divide-[#811B2B]/10">
            {results.length > 0 ? (
              results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="py-3 px-3 rounded-2xl hover:bg-[#FFF5CC]/60 flex items-center justify-between gap-4 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FFF5CC] shrink-0 border border-[#811B2B]/15">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-editorial text-sm font-bold text-[#811B2B] group-hover:underline">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-[#811B2B]/60 font-rounded">
                        {product.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-editorial text-sm font-bold text-[#811B2B]">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                        onClose();
                      }}
                      className="p-2 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] shadow-sm"
                      title="Add to bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <span className="text-4xl select-none">🌸</span>
                <p className="font-editorial text-lg font-bold text-[#811B2B] mt-2">
                  No matching treasures found for "{searchTerm}"
                </p>
                <p className="text-xs text-[#811B2B]/70 font-rounded mt-1">
                  Try checking for typos or searching a broader term like "rose", "tulip", "tote"
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

