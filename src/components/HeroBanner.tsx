import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroBannerProps {
  onShopClick?: (category?: string) => void;
}

interface BannerSlide {
  id: string;
  src: string;
  webp: string;
  alt: string;
  category: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'plushie-bouquets',
    src: '/banners/3.png',
    webp: '/banners/3.webp',
    alt: 'Plushie bouquets - collection live now',
    category: 'Plushies',
  },
  {
    id: 'crochet-god-collection',
    src: '/banners/4.png',
    webp: '/banners/4.webp',
    alt: 'Crochet god collection',
    category: 'Home Decor',
  },
  {
    id: 'forever-frames',
    src: '/banners/5.png',
    webp: '/banners/5.webp',
    alt: 'Forever Frames collection',
    category: 'Home Decor',
  },
];

const AUTOPLAY_INTERVAL = 4500; // 4.5 seconds per slide

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Autoplay crossfade loop
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      goToNext();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, goToNext]);

  // Handle touch swiping on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section className="relative w-full bg-[#FAF4ED] overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-0 sm:px-4 lg:px-6 pt-2 sm:pt-3 pb-8">
        {/* Banner Slideshow Container - Preserves exact original layout, proportions, and styling */}
        <div
          className="relative w-full aspect-[2/1] overflow-hidden sm:rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgba(100,22,35,0.06)] bg-[#F8EFE4] group select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Stacked Slides with Crossfade */}
          {BANNER_SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out cursor-pointer ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
                onClick={() => onShopClick?.(slide.category)}
                aria-hidden={!isActive}
                role="button"
                tabIndex={isActive ? 0 : -1}
                aria-label={`Shop ${slide.alt}`}
                onKeyDown={(e) => {
                  if (isActive && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onShopClick?.(slide.category);
                  }
                }}
              >
                <picture>
                  <source srcSet={slide.webp} type="image/webp" />
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-full object-cover select-none block"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    draggable={false}
                  />
                </picture>
              </div>
            );
          })}

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="Previous banner"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/75 hover:bg-white text-[#641623] shadow-md hover:shadow-lg backdrop-blur-sm flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#641623]/40 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next banner"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/75 hover:bg-white text-[#641623] shadow-md hover:shadow-lg backdrop-blur-sm flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#641623]/40 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/45 backdrop-blur-md border border-white/40 shadow-sm pointer-events-auto">
            {BANNER_SLIDES.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  aria-label={`Go to slide ${index + 1}: ${slide.alt}`}
                  aria-current={isActive ? 'true' : 'false'}
                  className={`h-2 transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#641623] ${
                    isActive
                      ? 'w-6 bg-[#641623]'
                      : 'w-2 bg-[#641623]/35 hover:bg-[#641623]/70'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
