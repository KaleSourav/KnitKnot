import React, { useState } from 'react';
import { Search, X, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../data/products';

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

  if (!isOpen) return null;

  const results = query.trim() === ''
    ? products.slice(0, 4)
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/80 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#130f1c] border border-purple-500/20 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 text-white animate-in fade-in zoom-in-95 duration-150">
        {/* SEARCH INPUT BAR */}
        <div className="relative flex items-center mb-4">
          <Search className="w-5 h-5 text-purple-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search flowers, bunny plushies, tote bags, headband..."
            className="w-full bg-black/40 border border-purple-500/25 rounded-2xl pl-12 pr-10 py-3.5 text-sm sm:text-base text-white placeholder-stone-400 focus:outline-none focus:border-purple-400"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 p-1 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="absolute right-3.5 p-1 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* QUICK SEARCH TAGS */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4 pb-3 border-b border-white/10 text-xs">
          <span className="text-stone-400">Popular:</span>
          {['Lily Bouquet', 'Bunny', 'Granny Square', 'Sunflower', 'Coquette Bow'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-purple-900/30 text-purple-300 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* SEARCH RESULTS */}
        <div className="max-h-[55vh] overflow-y-auto space-y-2.5 pr-1">
          {results.length === 0 ? (
            <div className="py-8 text-center text-stone-400 text-sm">
              No handcrafted pieces found matching "{query}".
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-black/30 hover:bg-purple-900/20 border border-purple-500/10 hover:border-purple-400/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-stone-900"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-extrabold text-[#edd2f7]">₹{product.price}</span>
                      <span className="text-[10px] text-purple-400 uppercase font-semibold">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-[#edd2f7] hover:text-[#4a044e] text-white transition-all text-xs font-bold flex items-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
