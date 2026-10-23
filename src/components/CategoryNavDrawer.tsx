/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Search, Sparkles, ChevronRight, Check } from 'lucide-react';
import { CATEGORIES_DATA, MEGA_GROUPS, CategoryItem } from '../data/categories';

interface CategoryNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
  totalProductsCount: number;
}

export const CategoryNavDrawer: React.FC<CategoryNavDrawerProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  totalProductsCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  if (!isOpen) return null;

  const filteredCategories = CATEGORIES_DATA.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === 'All' || cat.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handlePickCategory = (catName: string) => {
    onSelectCategory(catName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['DM_Sans',sans-serif]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-[#130f1c] border-l border-purple-500/20 text-white shadow-2xl flex flex-col justify-between">
          
          {/* HEADER */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#191424]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                <Sparkles className="w-5 h-5 text-[#edd2f7]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">Browse 13 Categories</h2>
                <p className="text-[11px] text-stone-400 font-medium">
                  {totalProductsCount} handcrafted crochet items
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SEARCH & GROUP FILTER */}
          <div className="p-4 border-b border-white/10 bg-[#161120] space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search categories (e.g. keychains, pots, totes)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-purple-500/20 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Quick group filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px] font-bold">
              {['All', 'Florals', 'Home & Decor', 'Charms & Minis', 'Wearables & Bags', 'Amigurumi'].map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                    selectedGroup === group
                      ? 'bg-[#edd2f7] text-[#4a044e] font-extrabold shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-stone-300'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* CATEGORIES LIST */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {/* "ALL PRODUCTS" OPTION */}
            <div
              onClick={() => handlePickCategory('All Products')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedCategory === 'All Products' || selectedCategory === 'Home'
                  ? 'bg-purple-900/40 border-purple-400 shadow-lg'
                  : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧶</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">All Products</h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#edd2f7]/20 text-[#edd2f7] text-[10px] font-extrabold">
                      {totalProductsCount} items
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 line-clamp-1">
                    Explore the complete artisanal crochet collection
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </div>

            {/* 13 CATEGORIES */}
            {filteredCategories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <div
                  key={cat.id}
                  onClick={() => handlePickCategory(cat.name)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-purple-900/40 border-purple-400 shadow-lg'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl select-none">{cat.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-[#edd2f7] transition-colors">
                          {cat.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold ${cat.accentBg}`}>
                          {cat.count} items
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                        {cat.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="text-center py-12 text-stone-400 text-xs">
                No categories matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>

          {/* FOOTER QUICK ACTIONS */}
          <div className="p-4 border-t border-white/10 bg-[#191424] flex gap-2">
            <button
              onClick={() => handlePickCategory('All Products')}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all text-center"
            >
              Reset to All ({totalProductsCount})
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#edd2f7] hover:bg-[#e4c2f1] text-xs font-extrabold text-[#4a044e] transition-all text-center"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
