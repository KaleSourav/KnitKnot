import React, { useRef, useState } from 'react';
import {
  FlowerStem,
  STEM_CATEGORIES,
  FLOWER_STEMS,
} from '../../data/bouquetFlowers';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';

interface FlowerCrateShelfProps {
  selectedFlowers: Record<string, { flower: FlowerStem; quantity: number }>;
  onAddFlower: (flower: FlowerStem) => void;
  onRemoveFlower: (variantId: string) => void;
}

// Boutique pot/basket colors — 6 rotating pastels
const POT_COLORS = [
  { pot: '#F9A8B8', rim: '#E8809A', label: '#FFF0F3' }, // Dusty rose
  { pot: '#FBBF4A', rim: '#E8A020', label: '#FFFBEE' }, // Warm amber
  { pot: '#A8D8B9', rim: '#6DBF8E', label: '#F0FFF6' }, // Sage green
  { pot: '#A8C8F8', rim: '#6BAEE8', label: '#EFF6FF' }, // Cornflower blue
  { pot: '#D4B4F8', rim: '#B87EE8', label: '#F8F0FF' }, // Soft purple
  { pot: '#F8C4A8', rim: '#E89470', label: '#FFF5EE' }, // Peach
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
      const distance = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative select-none">
      {/* ── Category Filter Row ── */}
      <div className="flex items-center gap-2 px-3 sm:px-6 pb-3 overflow-x-auto no-scrollbar">
        {STEM_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full font-['Fredoka'] font-semibold text-xs whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                isActive
                  ? 'bg-[#811B2B] text-white border-[#811B2B] shadow-sm'
                  : 'bg-white/70 text-[#641623] border-[#641623]/20 hover:bg-[#FFF5CC] hover:border-[#811B2B]/30'
              }`}
            >
              {cat}
            </button>
          );
        })}

        {/* Scroll Arrows */}
        <div className="hidden sm:flex items-center gap-1 ml-auto flex-shrink-0">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="w-7 h-7 rounded-full bg-white/80 border border-[#641623]/20 flex items-center justify-center text-[#641623] hover:bg-[#FFF5CC] active:scale-90 transition-all cursor-pointer shadow-xs"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="w-7 h-7 rounded-full bg-white/80 border border-[#641623]/20 flex items-center justify-center text-[#641623] hover:bg-[#FFF5CC] active:scale-90 transition-all cursor-pointer shadow-xs"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── The Pink Display Shelf ── */}
      <div className="relative w-full">
        {/* ── Shelf items container (flowers sit ON the shelf) ── */}
        <div
          ref={scrollRef}
          className="flex items-end gap-3 sm:gap-5 overflow-x-auto no-scrollbar px-4 sm:px-8 pb-0 scroll-smooth"
          style={{ paddingBottom: 0 }}
        >
          {filteredStems.map((stem, index) => {
            const count = selectedFlowers[stem.variantId]?.quantity || 0;
            const isSelected = count > 0;
            const pot = POT_COLORS[index % POT_COLORS.length];

            return (
              <div
                key={stem.variantId}
                className="flex-shrink-0 flex flex-col items-center"
                style={{ width: '110px' }}
              >
                {/* ── Quantity Badge floating above pot ── */}
                <div className="relative w-full flex justify-center mb-0.5" style={{ height: '20px' }}>
                  {isSelected && (
                    <div
                      className="absolute top-0 right-3 z-30 w-5 h-5 rounded-full bg-[#811B2B] text-white border-2 border-white font-black text-[10px] flex items-center justify-center shadow-md"
                      style={{ lineHeight: 1 }}
                    >
                      {count}
                    </div>
                  )}
                </div>

                {/* ── Flower photograph (above pot, appears to grow from it) ── */}
                <div
                  onClick={() => onAddFlower(stem)}
                  className={`relative cursor-pointer w-[90px] h-[110px] sm:h-[120px] flex items-end justify-center transition-all duration-200 hover:-translate-y-1 ${
                    isSelected ? 'drop-shadow-[0_0_8px_rgba(129,27,43,0.5)]' : 'hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]'
                  }`}
                  title={`Click to add ${stem.name}`}
                >
                  <img
                    src={stem.cutoutImage || stem.image}
                    alt={stem.name}
                    loading="lazy"
                    className="w-full h-full object-contain select-none"
                    style={{
                      filter: isSelected
                        ? 'brightness(1.05) drop-shadow(0 4px 10px rgba(129,27,43,0.35))'
                        : 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))',
                    }}
                  />

                  {/* Selected glow ring overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-xl ring-2 ring-[#811B2B]/40 pointer-events-none" />
                  )}
                </div>

                {/* ── Ceramic Pot / Basket (SVG) ── */}
                <div className="w-[90px] relative -mt-1 z-10">
                  <svg viewBox="0 0 90 55" className="w-full h-auto" fill="none">
                    {/* Pot rim */}
                    <ellipse cx="45" cy="12" rx="40" ry="8" fill={pot.rim} />
                    {/* Pot body */}
                    <path
                      d="M 10 14 Q 5 54 25 54 L 65 54 Q 85 54 80 14 Z"
                      fill={pot.pot}
                    />
                    {/* Inner rim shadow */}
                    <ellipse cx="45" cy="12" rx="34" ry="6" fill={pot.pot} opacity="0.6" />
                    {/* Top rim highlight */}
                    <ellipse cx="45" cy="10" rx="38" ry="6" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
                    {/* Soil top */}
                    <ellipse cx="45" cy="12" rx="32" ry="5" fill="#8B6B4A" opacity="0.35" />
                    {/* Small decorative dot pattern on pot */}
                    <circle cx="30" cy="34" r="2.5" fill="white" opacity="0.25" />
                    <circle cx="45" cy="38" r="2.5" fill="white" opacity="0.25" />
                    <circle cx="60" cy="34" r="2.5" fill="white" opacity="0.25" />
                  </svg>

                  {/* Selected state ring on pot */}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="absolute bottom-1 left-1 right-1 h-[48px] rounded-b-full ring-2 ring-[#811B2B] rounded-[50%] opacity-50" />
                    </div>
                  )}
                </div>

                {/* ── Price label card (below the shelf) ── */}
                <div
                  className="w-full text-center pt-1.5 pb-1"
                  style={{ background: 'transparent' }}
                >
                  <p
                    className="font-['Fredoka'] font-bold text-[11px] leading-tight text-[#641623] truncate px-1"
                    title={stem.name}
                  >
                    {stem.name}
                  </p>
                  <p className="font-['Fredoka'] font-black text-[12px] text-[#811B2B]">
                    ₹{stem.price}
                  </p>

                  {/* Add / Stepper control */}
                  {isSelected ? (
                    <div
                      className="inline-flex items-center gap-1 bg-[#811B2B]/10 rounded-full px-1.5 py-0.5 mt-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onRemoveFlower(stem.variantId)}
                        className="w-5 h-5 rounded-full bg-white text-[#811B2B] hover:bg-[#811B2B] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#811B2B]/30 shadow-xs"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="font-['Fredoka'] font-black text-xs text-[#811B2B] min-w-[14px] text-center">
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAddFlower(stem)}
                        className="w-5 h-5 rounded-full bg-[#811B2B] text-white hover:bg-[#641623] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAddFlower(stem)}
                      className="mt-1 inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-[#FFF5CC] text-[#811B2B] hover:bg-[#811B2B] hover:text-white border border-[#811B2B]/25 text-[11px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── The Pink Shelf Plank ── */}
        <div
          className="w-full relative z-10 mt-1"
          style={{ height: '20px' }}
        >
          {/* Top ledge highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-[6px] rounded-t"
            style={{ background: '#E87EA0' }}
          />
          {/* Main shelf board */}
          <div
            className="absolute top-[6px] left-0 right-0 bottom-0 shadow-[0_6px_18px_rgba(129,27,43,0.18)]"
            style={{ background: '#D86490' }}
          />
        </div>
      </div>
    </div>
  );
};
