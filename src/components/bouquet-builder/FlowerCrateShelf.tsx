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
  hasRibbon: boolean;
  hasNote: boolean;
}

// 6 Retro plastic milk crate colors from Annie's Petal Post reference
const CRATE_STYLES = [
  { crate: '#F43F5E', rim: '#BE123C', name: 'pink' },    // Hot Pink
  { crate: '#FB923C', rim: '#C2410C', name: 'orange' },  // Retro Orange
  { crate: '#F5F2EB', rim: '#D4CDC3', name: 'white' },   // Milk White
  { crate: '#EC4899', rim: '#9D174D', name: 'magenta' }, // Magenta
  { crate: '#38BDF8', rim: '#0284C7', name: 'blue' },    // Sky Blue
  { crate: '#FBBF24', rim: '#B45309', name: 'yellow' },  // Amber Yellow
];

// SVG Plastic Milk Crate with realistic grid cutouts & zinc bucket
const PlasticMilkCrate: React.FC<{
  color: string;
  rimColor: string;
  isSelected: boolean;
}> = ({ color, rimColor, isSelected }) => (
  <svg
    viewBox="0 0 100 66"
    className={`w-full h-auto drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)] transition-transform duration-200 ${
      isSelected ? 'scale-[1.03]' : ''
    }`}
    fill="none"
  >
    {/* Zinc / Galvanized bucket inside crate holding flower stems */}
    <path
      d="M 24 16 L 30 54 L 70 54 L 76 16 Z"
      fill="#D1D5DB"
      stroke="#9CA3AF"
      strokeWidth="1.2"
    />
    <ellipse cx="50" cy="16" rx="26" ry="6" fill="#9CA3AF" />
    <ellipse cx="50" cy="16" rx="24" ry="5" fill="#374151" />

    {/* Front Crate Body */}
    <rect
      x="8"
      y="18"
      width="84"
      height="44"
      rx="4"
      fill={color}
      stroke={rimColor}
      strokeWidth="2.5"
    />

    {/* Top Crate Rim */}
    <rect x="6" y="14" width="88" height="7" rx="2" fill={rimColor} />

    {/* Handle Cutout */}
    <rect x="36" y="24" width="28" height="7" rx="3.5" fill="#111827" opacity="0.38" />

    {/* Grid of rectangular holes on crate face (Authentic milk crate mesh) */}
    <g fill="#111827" opacity="0.3">
      {/* Row 1 */}
      <rect x="14" y="36" width="10" height="9" rx="1.5" />
      <rect x="28" y="36" width="10" height="9" rx="1.5" />
      <rect x="42" y="36" width="10" height="9" rx="1.5" />
      <rect x="56" y="36" width="10" height="9" rx="1.5" />
      <rect x="70" y="36" width="10" height="9" rx="1.5" />
      {/* Row 2 */}
      <rect x="14" y="49" width="10" height="8" rx="1.5" />
      <rect x="28" y="49" width="10" height="8" rx="1.5" />
      <rect x="42" y="49" width="10" height="8" rx="1.5" />
      <rect x="56" y="49" width="10" height="8" rx="1.5" />
      <rect x="70" y="49" width="10" height="8" rx="1.5" />
    </g>

    {/* Corner structural ribbing */}
    <rect x="8" y="18" width="4" height="44" fill={rimColor} opacity="0.8" />
    <rect x="88" y="18" width="4" height="44" fill={rimColor} opacity="0.8" />
  </svg>
);

export const FlowerCrateShelf: React.FC<FlowerCrateShelfProps> = ({
  selectedFlowers,
  onAddFlower,
  onRemoveFlower,
  hasRibbon,
  hasNote,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Blooms');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredStems =
    activeCategory === 'All Blooms'
      ? FLOWER_STEMS
      : FLOWER_STEMS.filter((s) => s.category === activeCategory);

  const totalStemsCount = Object.values(selectedFlowers).reduce(
    (acc, it) => acc + it.quantity,
    0
  );

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const distance = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  // Helper banner instruction text matching reference stages
  let bannerText = 'Pick your flowers. We’ll wrap them when you choose a ribbon.';
  if (totalStemsCount > 0 && !hasRibbon) {
    bannerText = 'A few more stems, then choose your ribbon.';
  } else if (hasRibbon && !hasNote) {
    bannerText = 'A note makes it personal. Your bouquet is ready to send.';
  } else if (hasNote) {
    bannerText = 'Your handwritten note is tucked into the flowers.';
  }

  return (
    <div className="w-full relative select-none">
      {/* ── Category Filter Pills ── */}
      <div className="flex items-center gap-2 px-4 sm:px-8 pb-3 overflow-x-auto no-scrollbar">
        {STEM_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1 rounded-full font-['Fredoka'] font-semibold text-xs whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                isActive
                  ? 'bg-[#811B2B] text-white border-[#811B2B] shadow-sm scale-105'
                  : 'bg-white/80 text-[#641623] border-[#641623]/20 hover:bg-[#FFF5CC] hover:border-[#811B2B]/30'
              }`}
            >
              {cat}
            </button>
          );
        })}

        {/* Scroll Arrows */}
        <div className="hidden sm:flex items-center gap-1.5 ml-auto flex-shrink-0">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="w-7 h-7 rounded-full bg-white/90 border border-[#641623]/25 flex items-center justify-center text-[#641623] hover:bg-[#FFF5CC] active:scale-90 transition-all cursor-pointer shadow-xs"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="w-7 h-7 rounded-full bg-white/90 border border-[#641623]/25 flex items-center justify-center text-[#641623] hover:bg-[#FFF5CC] active:scale-90 transition-all cursor-pointer shadow-xs"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── The Flower Shelf (Items sit directly ON the shelf board) ── */}
      <div className="relative w-full">
        <div
          ref={scrollRef}
          className="flex items-end gap-3 sm:gap-6 overflow-x-auto no-scrollbar px-4 sm:px-8 pb-0 scroll-smooth"
        >
          {filteredStems.map((stem, index) => {
            const count = selectedFlowers[stem.variantId]?.quantity || 0;
            const isSelected = count > 0;
            const crate = CRATE_STYLES[index % CRATE_STYLES.length];

            return (
              <div
                key={stem.variantId}
                className="group flex-shrink-0 flex flex-col items-center relative w-[105px] sm:w-[115px]"
              >
                {/* ── Black Circular Quantity Badge (above crate, like Petal Post) ── */}
                {count > 0 && (
                  <div className="absolute -top-1 -right-1 z-30 w-6 h-6 rounded-full bg-[#111827] text-white font-black text-xs flex items-center justify-center shadow-md border-2 border-white animate-bounce-short">
                    {count}
                  </div>
                )}

                {/* ── Flower Bloom (emerges from zinc bucket inside crate) ── */}
                <div
                  onClick={() => onAddFlower(stem)}
                  className="relative cursor-pointer w-[95px] h-[120px] sm:h-[130px] flex items-end justify-center transition-transform duration-200 hover:-translate-y-1.5 active:scale-95"
                  title={`Click to pick ${stem.name}`}
                >
                  <img
                    src={stem.cutoutImage || stem.image}
                    alt={stem.name}
                    loading="lazy"
                    className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.14)]"
                  />
                </div>

                {/* ── Plastic Milk Crate (SVG) ── */}
                <div
                  onClick={() => onAddFlower(stem)}
                  className="w-[100px] relative -mt-3 z-10 cursor-pointer"
                  title={`Pick ${stem.name}`}
                >
                  <PlasticMilkCrate
                    color={crate.crate}
                    rimColor={crate.rim}
                    isSelected={isSelected}
                  />
                </div>

                {/* ── White Price Tag Sticker (stuck to shelf face) ── */}
                <div
                  className="bg-[#FFFDF9] border border-gray-300 shadow-xs px-1.5 py-1 rounded-[2px] text-center w-[98px] mt-1 relative z-20 transition-all group-hover:shadow-sm"
                  style={{ transform: 'rotate(-0.5deg)' }}
                >
                  <div className="font-['Fredoka'] text-[10px] sm:text-[10.5px] font-bold text-gray-800 leading-tight truncate">
                    {stem.name}
                  </div>
                  <div className="font-['Fredoka'] text-[10.5px] sm:text-[11px] font-black text-[#811B2B] mt-0.5">
                    ₹{stem.price}
                  </div>

                  {/* Quantity Stepper (on hover or when selected) */}
                  {isSelected ? (
                    <div className="flex items-center justify-center gap-1.5 mt-1 pt-1 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFlower(stem.variantId);
                        }}
                        className="w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove one"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="font-['Fredoka'] font-black text-[11px] text-[#811B2B] min-w-[12px] text-center">
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddFlower(stem);
                        }}
                        className="w-4 h-4 rounded-full bg-[#811B2B] text-white hover:bg-[#641623] flex items-center justify-center transition-colors cursor-pointer"
                        title="Add one more"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddFlower(stem);
                      }}
                      className="mt-1 text-[10px] font-bold text-[#811B2B] hover:underline cursor-pointer block w-full text-center"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Pink Shelf Board Plank ── */}
        <div className="w-full mt-2">
          {/* Top highlight line of the shelf board */}
          <div className="w-full h-1 bg-[#FFAEC4]" />
          {/* Main bold pink shelf board */}
          <div
            className="w-full h-4 relative shadow-md"
            style={{
              background: 'linear-gradient(to bottom, #F43F5E 0%, #E11D48 100%)',
            }}
          />
          {/* Underside shadow of shelf */}
          <div className="w-full h-1.5 bg-[#881337] opacity-80" />
        </div>
      </div>

      {/* ── Status Instruction Banner (Centered on glossy backsplash below shelf) ── */}
      <div className="w-full flex justify-center py-2 relative z-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF9]/90 border border-black/15 shadow-sm text-center backdrop-blur-xs">
          <span className="font-['Fredoka'] text-[11.5px] sm:text-xs font-semibold text-[#641623]">
            {bannerText}
          </span>
        </div>
      </div>
    </div>
  );
};
