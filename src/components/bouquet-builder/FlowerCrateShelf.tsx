import React, { useRef, useState } from 'react';
import {
  FlowerStem,
  STEM_CATEGORIES,
  FLOWER_STEMS,
} from '../../data/bouquetFlowers';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FlowerCrateShelfProps {
  selectedFlowers: Record<string, { flower: FlowerStem; quantity: number }>;
  onAddFlower: (flower: FlowerStem) => void;
  onRemoveFlower: (variantId: string) => void;
  hasRibbon: boolean;
  hasNote: boolean;
}

// 6 distinct vibrant retro milk crates matching Petal Post
const CRATE_VARIETIES = [
  '/boutique/crate_pink_roses.png',     // Hot Pink crate
  '/boutique/crate_yellow_blooms.png',   // Retro Orange crate
  '/boutique/crate_red_tulips.png',      // Milk White crate
  '/boutique/crate_white_daisies.png',   // Magenta crate
  '/boutique/crate_purple_lavender.png', // Amber Orange crate
  '/boutique/crate_blue_bells.png',      // Baby Blue crate
];

const getCrateImageForIndex = (index: number): string => {
  return CRATE_VARIETIES[index % CRATE_VARIETIES.length];
};

export const FlowerCrateShelf: React.FC<FlowerCrateShelfProps> = ({
  selectedFlowers,
  onAddFlower,
  onRemoveFlower,
  hasRibbon,
  hasNote,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Blooms');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter stems by active category
  const filteredStems =
    activeCategory === 'All Blooms'
      ? FLOWER_STEMS
      : FLOWER_STEMS.filter((s) => s.category === activeCategory);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const distance = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative select-none">
      {/* ── Category Filter Pills ── */}
      <div className="flex items-center gap-2 px-4 sm:px-8 pb-2.5 overflow-x-auto no-scrollbar">
        {STEM_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1 rounded-full font-['Fredoka'] font-semibold text-xs whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                isActive
                  ? 'bg-[#811B2B] text-white border-[#811B2B] shadow-md scale-105'
                  : 'bg-white/90 text-[#641623] border-[#641623]/20 hover:bg-[#FFF5CC] hover:border-[#811B2B]/40'
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
      <div className="relative w-full pt-2 pb-1">
        <div
          ref={scrollRef}
          className="flex items-end gap-3 sm:gap-6 overflow-x-auto no-scrollbar px-4 sm:px-8 pt-3 pb-1 scroll-smooth"
        >
          {filteredStems.map((stem, index) => {
            const count = selectedFlowers[stem.variantId]?.quantity || 0;
            const crateImage = getCrateImageForIndex(index);
            const flowerSrc = stem.cutoutImage || stem.image;

            return (
              <div
                key={stem.variantId}
                data-crate-stem={stem.variantId}
                onClick={() => onAddFlower(stem)}
                className="group flex-shrink-0 flex flex-col items-center relative w-[124px] sm:w-[138px] select-none cursor-pointer"
              >
                {/* ── Black Circular Quantity Badge (above crate, like Petal Post) ── */}
                {count > 0 && (
                  <div className="absolute -top-2.5 -right-1 z-30 flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFlower(stem.variantId);
                      }}
                      title="Click to remove one stem"
                      className="w-6 h-6 rounded-full bg-[#111827] text-white font-['Fredoka'] font-black text-xs flex items-center justify-center shadow-lg border-2 border-white hover:bg-[#811B2B] transition-colors cursor-pointer"
                    >
                      {count}
                    </button>
                  </div>
                )}

                {/* ── PHOTOREALISTIC MILK CRATE WITH OVERFLOWING LUSH BLOOMS ── */}
                <div
                  className="relative w-[120px] sm:w-[134px] h-[126px] sm:h-[140px] flex items-end justify-center transition-all duration-200 group-hover:-translate-y-2 active:scale-95 drop-shadow-[0_14px_22px_rgba(0,0,0,0.24)]"
                  title={`Click to pick ${stem.name} (+₹${stem.price})`}
                >
                  {/* Photorealistic Crate with zinc bucket and lush crochet bouquet */}
                  <img
                    src={crateImage}
                    alt={stem.name}
                    loading="lazy"
                    className="w-full h-full object-contain pointer-events-none select-none transition-transform group-hover:scale-105"
                  />

                  {/* Variety Identification Bloom Icon */}
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/95 p-0.5 shadow-md border border-[#811B2B]/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title={stem.name}
                  >
                    <img
                      src={flowerSrc}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* ── BOUTIQUE SHELF HANGING PRICE TAG (Matching Petal Post) ── */}
                <div className="mt-1.5 w-[116px] sm:w-[130px] bg-[#FFFDF9] border border-[#E2DBD0] rounded-sm py-1 px-1.5 shadow-xs flex flex-col items-center text-center cursor-pointer hover:border-[#811B2B]/40 hover:bg-[#FFFBEA] transition-colors">
                  <span className="font-['Fredoka'] text-[11px] font-bold text-[#4A1521] truncate max-w-full leading-tight">
                    {stem.name}
                  </span>
                  <span className="font-mono text-[11px] font-black text-[#811B2B] mt-0.5 tabular-nums">
                    ₹{stem.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 3D Hot-Pink Shelf Board ── */}
        <div
          className="w-full h-3.5 sm:h-4 relative shadow-md"
          style={{
            background: 'linear-gradient(to bottom, #F43F5E 0%, #E11D48 60%, #BE123C 100%)',
            borderTop: '1px solid #FDA4AF',
            borderBottom: '2px solid #881337',
          }}
        >
          {/* Soft top highlight line */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-white/40" />
        </div>
      </div>
    </div>
  );
};
