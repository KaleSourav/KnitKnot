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
    id: 'hero-main',
    src: '/hero-banner.png',
    webp: '/banners/hero-banner.webp',
    alt: 'Little things, made with lots of love - Handmade crochet gifts, bouquets, plushies, bags and more',
    category: 'all',
  },
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

const SLIDE_DURATION_MS = 5000; // Exact 5-second automatic rotation

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Automatic slideshow loop: reliably triggers every 5 seconds without stopping on mouse hover
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [currentIndex, goToNext]);

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
      {/* Keyframe animation for subtle 5s progress fill */}
      <style>{`
        @keyframes bannerProgressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      <div className="w-full max-w-[1440px] mx-auto px-0 sm:px-4 lg:px-6 pt-2 sm:pt-3 pb-8">
        {/* Banner Slideshow Container - Preserves exact layout, proportions, and styling */}
        <div
          className="relative w-full aspect-[2/1] overflow-hidden sm:rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgba(100,22,35,0.06)] bg-[#F8EFE4] group select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Stacked Slides with Smooth 1s Crossfade */}
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
                    decoding={index === 0 ? 'sync' : 'async'}
                    draggable={false}
                  />
                </picture>

                {/* Subtle hover feedback over the button hotspot on hero-main slide ("Explore Collections ->") */}
                {slide.id === 'hero-main' && (
                  <div
                    className="absolute z-10 cursor-pointer rounded-full transition-all duration-200 pointer-events-none"
                    style={{
                      left: '5.2%',
                      top: '60.6%',
                      width: '18.8%',
                      height: '6.2%',
                    }}
                  >
                    <span className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/50 group-hover:bg-white/10 transition-all duration-200" />
                  </div>
                )}
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
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-[#641623] shadow-md hover:shadow-lg backdrop-blur-sm flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#641623]/40 cursor-pointer"
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
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-[#641623] shadow-md hover:shadow-lg backdrop-blur-sm flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#641623]/40 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </button>

          {/* Slide Indicator Dots with 5-second dynamic progress */}
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/40 shadow-sm pointer-events-auto">
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
                  className={`h-2 transition-all duration-300 rounded-full cursor-pointer overflow-hidden focus:outline-none focus:ring-1 focus:ring-[#641623] ${
                    isActive
                      ? 'w-7 bg-[#641623]/25 relative'
                      : 'w-2 bg-[#641623]/35 hover:bg-[#641623]/70'
                  }`}
                >
                  {isActive && (
                    <span
                      key={currentIndex}
                      className="absolute inset-y-0 left-0 bg-[#641623] rounded-full"
                      style={{
                        animation: `bannerProgressFill ${SLIDE_DURATION_MS}ms linear forwards`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
