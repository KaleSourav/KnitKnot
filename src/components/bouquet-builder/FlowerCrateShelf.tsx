import React, { useRef, useState } from 'react';
import {
  FlowerStem,
  STEM_CATEGORIES,
  FLOWER_STEMS,
} from '../../data/bouquetFlowers';
import { ChevronLeft, ChevronRight, Plus, Minus, Check, Sparkles } from 'lucide-react';

interface FlowerCrateShelfProps {
  selectedFlowers: Record<string, { flower: FlowerStem; quantity: number }>;
  onAddFlower: (flower: FlowerStem) => void;
  onRemoveFlower: (variantId: string) => void;
}

const CRATE_STYLES = [
  { bg: 'bg-[#FCE2EB]', border: 'border-[#E8A5B8]', accent: '#811B2B' }, // Pink
  { bg: 'bg-[#FEF0C7]', border: 'border-[#F9DB7B]', accent: '#811B2B' }, // Butter Yellow
  { bg: 'bg-[#F4EBFF]', border: 'border-[#D8B4FE]', accent: '#6B21A8' }, // Lilac
  { bg: 'bg-[#E0F2FE]', border: 'border-[#93C5FD]', accent: '#0369A1' }, // Sky Blue
  { bg: 'bg-[#DCFCE7]', border: 'border-[#86EFAC]', accent: '#15803D' }, // Mint
];

export const FlowerCrateShelf: React.FC<FlowerCrateShelfProps> = ({
  selectedFlowers,
  onAddFlower,
  onRemoveFlower,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Blooms');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredStems =
    activeCategory === 'All Blooms'
      ? FLOWER_STEMS
      : FLOWER_STEMS.filter((s) => s.category === activeCategory);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const distance = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative select-none">
      {/* 1. Category Filter Tabs */}
      <div className="flex items-center justify-between mb-3 px-2 sm:px-4">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {STEM_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full font-['Fredoka'] font-bold text-xs sm:text-[13px] whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-[#811B2B] text-white shadow-sm scale-102 border border-[#811B2B]'
                    : 'bg-white/85 text-[#641623] hover:bg-[#FFF5CC] border border-[#641623]/15'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll Arrows */}
        <div className="hidden sm:flex items-center gap-1.5 ml-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="w-7 h-7 rounded-full bg-white border border-[#641623]/20 flex items-center justify-center text-[#641623] hover:bg-[#FFF5CC] active:scale-90 transition-all cursor-pointer shadow-xs"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="w-7 h-7 rounded-full bg-white border border-[#641623]/20 flex items-center justify-center text-[#641623] hover:bg-[#FFF5CC] active:scale-90 transition-all cursor-pointer shadow-xs"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Horizontal Shelf with Crates */}
      <div className="relative w-full">
        {/* Wooden Shelf Bar Top Edge */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#E3D1BE] border-b border-[#C8B29C] rounded-t-lg z-0 pointer-events-none" />

        {/* Crates Container */}
        <div
          ref={scrollRef}
          className="flex items-end gap-3 sm:gap-4 overflow-x-auto no-scrollbar pt-4 pb-2 px-3 sm:px-4 scroll-smooth"
        >
          {filteredStems.map((stem, index) => {
            const count = selectedFlowers[stem.variantId]?.quantity || 0;
            const crateTheme = CRATE_STYLES[index % CRATE_STYLES.length];
            const isSelected = count > 0;

            return (
              <div
                key={stem.variantId}
                className="flex-shrink-0 flex flex-col items-center w-[130px] sm:w-[155px] group"
              >
                {/* ── Flower Crate Container ── */}
                <div
                  onClick={() => onAddFlower(stem)}
                  className={`relative w-full h-[140px] sm:h-[165px] rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between p-2 shadow-xs hover:shadow-md hover:-translate-y-1 ${
                    crateTheme.bg
                  } ${crateTheme.border} ${
                    isSelected ? 'ring-2 ring-[#811B2B] ring-offset-2' : ''
                  }`}
                  title={`Click to add ${stem.name} to bouquet`}
                >
                  {/* Crate Ribbed Slats Effect */}
                  <div className="absolute inset-x-2 top-2 h-1 bg-white/40 rounded-full pointer-events-none" />
                  <div className="absolute inset-x-2 bottom-3 h-1 bg-black/5 rounded-full pointer-events-none" />

                  {/* Quantity Badge on Top Right of Crate */}
                  {isSelected && (
                    <div className="absolute -top-2.5 -right-2.5 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#811B2B] text-white border-2 border-white font-['Fredoka'] font-black text-xs sm:text-[13px] flex items-center justify-center shadow-md animate-bounce">
                      {count}
                    </div>
                  )}

                  {/* Actual Crochet Flower Product Photograph */}
                  <div className="relative w-full h-[100px] sm:h-[120px] flex items-center justify-center overflow-hidden rounded-xl bg-white/70 shadow-inner group-hover:scale-102 transition-transform duration-200">
                    <img
                      src={stem.image}
                      alt={stem.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-1 filter drop-shadow-sm select-none"
                    />
                  </div>

                  {/* Crate Label Footnote */}
                  <div className="w-full text-center py-0.5">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#641623]/80 uppercase tracking-wider block truncate">
                      {stem.color !== 'Multi' ? stem.color : stem.category}
                    </span>
                  </div>
                </div>

                {/* ── Price Tag Hanging Below Crate ── */}
                <div className="relative -mt-1 w-[92%] bg-white/95 border border-[#641623]/20 rounded-xl p-2 shadow-xs text-center z-10">
                  <h4
                    className="font-['Fredoka'] font-bold text-xs sm:text-[13px] text-[#641623] truncate leading-tight"
                    title={stem.name}
                  >
                    {stem.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#641623]/10">
                    <span className="font-['Fredoka'] font-black text-xs sm:text-[13px] text-[#811B2B]">
                      ₹{stem.price}
                    </span>

                    {/* Stepper / Add button */}
                    {isSelected ? (
                      <div
                        className="inline-flex items-center gap-1 bg-[#FFF5CC] rounded-full p-0.5 border border-[#811B2B]/25"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onRemoveFlower(stem.variantId)}
                          className="w-5 h-5 rounded-full bg-white text-[#811B2B] hover:bg-[#811B2B] hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
                          title="Remove one stem"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-['Fredoka'] font-bold text-xs text-[#811B2B] px-1">
                          {count}
                        </span>
                        <button
                          type="button"
                          onClick={() => onAddFlower(stem)}
                          className="w-5 h-5 rounded-full bg-[#811B2B] text-white hover:bg-[#641623] flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
                          title="Add one stem"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddFlower(stem);
                        }}
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#FFF5CC] text-[#811B2B] hover:bg-[#811B2B] hover:text-white border border-[#811B2B]/20 text-[11px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                        title="Add to bouquet"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shelf Base Board */}
        <div className="w-full h-3 bg-[#D4BFAB] border-t border-[#BCA58F] shadow-sm rounded-b-lg" />
      </div>
    </div>
  );
};
