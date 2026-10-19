import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface WantedItem {
  id: string;
  title: string;
  tag: string;
  price: string;
  image: string;
}

const MOST_WANTED_ITEMS: WantedItem[] = [
  {
    id: 'wanted-1',
    title: "Everlasting White Lily Bouquet",
    tag: "Spring Edit 2026",
    price: "₹1,499",
    image: "/products/bouquet.jpg",
  },
  {
    id: 'wanted-2',
    title: "Pastel Daisy Patchwork Cardigan",
    tag: "Summer Edit 2026",
    price: "₹2,499",
    image: "/products/cardigan.jpg",
  },
  {
    id: 'wanted-3',
    title: "Pastel Sunrise Tulip Bouquet",
    tag: "Artisan Edit 2026",
    price: "₹749",
    image: "/products/tulips.jpg",
  },
  {
    id: 'wanted-4',
    title: "Lilac Bunny & Chick Companion",
    tag: "Heirloom Edition",
    price: "₹899",
    image: "/products/bunny.jpg",
  },
  {
    id: 'wanted-5',
    title: "Daisy & Sunflower Granny Square Tote",
    tag: "Resort Edit 2026",
    price: "₹1,599",
    image: "/products/tote.jpg",
  },
  {
    id: 'wanted-6',
    title: "Lavender Headband & Coquette Bow",
    tag: "Accessories Edit",
    price: "₹599",
    image: "/products/accessories.jpg",
  },
];

interface MostWantedCarouselProps {
  onBrowseAll?: () => void;
  onSelectItem?: (item: WantedItem) => void;
}

export const MostWantedCarousel: React.FC<MostWantedCarouselProps> = ({
  onBrowseAll,
  onSelectItem,
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [slideWidth, setSlideWidth] = useState(720);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = MOST_WANTED_ITEMS.length;
  const slideMargin = 20;

  useEffect(() => {
    const updateWidth = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setSlideWidth(Math.min(window.innerWidth - 48, 330));
      } else if (window.innerWidth < 1024) {
        setSlideWidth(520);
      } else {
        setSlideWidth(720);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch and mouse drag handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 50) {
      handlePrev();
    } else if (dragOffset < -50) {
      handleNext();
    }
    setDragOffset(0);
  };

  const itemStep = slideWidth + slideMargin;
  const trackTranslate = `calc(50vw - ${slideWidth / 2}px - 10px - ${currentIndex * itemStep}px + ${dragOffset}px)`;

  return (
    <section id="most-wanted-section" className="w-full bg-[#fdfdfd] text-black py-16 sm:py-24 overflow-hidden select-none relative font-['DM_Sans',sans-serif]">
      {/* SECTION HEADER */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-10 sm:mb-14">
        <h2 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-black uppercase mb-3 sm:mb-4 leading-[0.95]">
          MOST<br />WANTED
        </h2>
        <p className="text-xs sm:text-base text-stone-600 font-medium max-w-md mx-auto leading-relaxed px-2">
          The pieces you'll wear on repeat.<br />
          Clean design, effortless styling,<br />
          and lasting quality for every season.
        </p>
      </div>

      {/* CAROUSEL SHOWCASE WITH SMOOTH MOVING TRACK */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing pb-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            setDragOffset(0);
          }
        }}
      >
        {/* DESKTOP/TABLET NAVIGATION PARENTHESES ON SIDES OF CENTER IMAGE */}
        <div 
          className="hidden sm:flex pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 z-30 items-center justify-between"
          style={{ width: `${slideWidth + 80}px`, maxWidth: '98vw' }}
        >
          {/* LEFT CURVED PARENTHESIS '(' BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous photo"
            className="pointer-events-auto p-1 text-black hover:text-stone-700 active:scale-95 transition-all transform hover:-translate-x-1 cursor-pointer focus:outline-none drop-shadow-sm"
          >
            <svg
              className="w-8 h-20 sm:w-10 sm:h-28 stroke-current fill-none"
              viewBox="0 0 32 80"
              strokeWidth="4.5"
              strokeLinecap="round"
            >
              <path d="M24 6 C 8 28, 8 52, 24 74" />
            </svg>
          </button>

          {/* RIGHT CURVED PARENTHESIS ')' BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next photo"
            className="pointer-events-auto p-1 text-black hover:text-stone-700 active:scale-95 transition-all transform hover:translate-x-1 cursor-pointer focus:outline-none drop-shadow-sm"
          >
            <svg
              className="w-8 h-20 sm:w-10 sm:h-28 stroke-current fill-none"
              viewBox="0 0 32 80"
              strokeWidth="4.5"
              strokeLinecap="round"
            >
              <path d="M8 6 C 24 28, 24 52, 8 74" />
            </svg>
          </button>
        </div>

        {/* SLIDING TRACK */}
        <div
          className="flex items-center transition-transform"
          style={{
            transform: `translateX(${trackTranslate})`,
            transition: isDragging
              ? 'none'
              : 'transform 600ms cubic-bezier(0.2, 0.9, 0.3, 1.2)',
          }}
        >
          {MOST_WANTED_ITEMS.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isActive) {
                    setCurrentIndex(idx);
                  } else if (onSelectItem) {
                    onSelectItem(item);
                  }
                }}
                style={{ width: `${slideWidth}px` }}
                className={`shrink-0 mx-[10px] transition-all duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1.2)] ${
                  isActive
                    ? 'opacity-100 scale-100 cursor-pointer'
                    : 'opacity-70 hover:opacity-90 scale-[0.96] cursor-pointer'
                }`}
              >
                {/* LABELS ABOVE EACH PHOTO */}
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-black mb-2 px-1 tracking-tight">
                  <span className="truncate pr-2">{item.title}</span>
                  <span className="shrink-0 text-stone-600 text-[11px] sm:text-xs">{item.tag}</span>
                </div>

                {/* IMAGE FRAME */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-stone-100 rounded-none overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover select-none pointer-events-none transform transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle price tag pill on active image */}
                  {isActive && (
                    <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-black border border-black/10 shadow-sm">
                      {item.price}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE CONTROLS & PAGINATION DOTS */}
      <div className="flex items-center justify-center gap-4 sm:hidden mt-4">
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {MOST_WANTED_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-6 bg-black' : 'w-1.5 bg-stone-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 active:scale-95 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* BOTTOM "Browse All ->" LINK */}
      <div className="w-full text-center mt-6 sm:mt-10">
        <button
          onClick={onBrowseAll}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-black border-b border-black pb-0.5 hover:text-stone-600 hover:border-stone-600 transition-all cursor-pointer group uppercase tracking-wider"
        >
          <span>Browse All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
