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

interface MobileBannerSlide {
  id: string;
  src: string;
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

// Exact 11-slide sequence requested for mobile landing page
const MOBILE_BANNER_SLIDES: MobileBannerSlide[] = [
  {
    id: 'mob-1',
    src: '/banners-mobile/banner-mobile-1.jpg',
    alt: 'Handmade crochet treasures - 100% handcrafted with love by Knots & Co',
    category: 'all',
  },
  {
    id: 'mob-2',
    src: '/banners-mobile/banner-mobile-2.jpg',
    alt: 'Handcrafted crochet flower bouquets and gifts',
    category: 'Bouquets',
  },
  {
    id: 'mob-3',
    src: '/banners-mobile/banner-mobile-3.jpg',
    alt: 'Handmade crochet plushies and accessories',
    category: 'Plushies',
  },
  {
    id: 'mob-4',
    src: '/banners-mobile/banner-mobile-4.jpg',
    alt: 'Everlasting crochet blooms collection',
    category: 'Flowers',
  },
  {
    id: 'mob-5',
    src: '/banners-mobile/banner-mobile-5.jpg',
    alt: 'Crochet desk decor and flower pots',
    category: 'Flower Pots',
  },
  {
    id: 'mob-6',
    src: '/banners-mobile/banner-mobile-6.jpg',
    alt: 'Adorable handmade crochet bag charms and keychains',
    category: 'Keychains',
  },
  {
    id: 'mob-7',
    src: '/banners-mobile/banner-mobile-7.jpg',
    alt: 'Knots & Co artisan collection',
    category: 'all',
  },
  {
    id: 'mob-8',
    src: '/banners-mobile/banner-mobile-8.jpg',
    alt: 'Handmade crochet gifts for loved ones',
    category: 'all',
  },
  {
    id: 'mob-9',
    src: '/banners-mobile/banner-mobile-9.jpg',
    alt: 'Crafted with premium soft combed cotton yarn',
    category: 'all',
  },
  {
    id: 'mob-10',
    src: '/banners-mobile/banner-mobile-10.jpg',
    alt: 'Special handcrafted crochet occasions gifts',
    category: 'all',
  },
  {
    id: 'mob-11',
    src: '/banners-mobile/banner-mobile-11.jpg',
    alt: 'Made by hand, made with love - Knots & Co',
    category: 'all',
  },
];

const SLIDE_DURATION_MS = 5000; // Desktop: 5-second rotation
const MOBILE_SLIDE_DURATION_MS = 4500; // Mobile: 4.5-second rotation

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Mobile slideshow state & swipe handling
  const [mobileIndex, setMobileIndex] = useState(0);
  const mobileTouchStartX = useRef<number | null>(null);
  const mobileHasSwiped = useRef<boolean>(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Desktop automatic slideshow loop: 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [currentIndex, goToNext]);

  // Mobile automatic slideshow loop: 4.5 seconds with crossfade
  const goToNextMobile = useCallback(() => {
    setMobileIndex((prev) => (prev + 1) % MOBILE_BANNER_SLIDES.length);
  }, []);

  const goToPrevMobile = useCallback(() => {
    setMobileIndex((prev) => (prev - 1 + MOBILE_BANNER_SLIDES.length) % MOBILE_BANNER_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goToNextMobile();
    }, MOBILE_SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [mobileIndex, goToNextMobile]);

  // Handle touch swiping on mobile
  const handleMobileTouchStart = (e: React.TouchEvent) => {
    mobileTouchStartX.current = e.touches[0].clientX;
    mobileHasSwiped.current = false;
  };

  const handleMobileTouchEnd = (e: React.TouchEvent) => {
    if (mobileTouchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = mobileTouchStartX.current - touchEndX;

    if (Math.abs(diff) > 35) {
      mobileHasSwiped.current = true;
      if (diff > 0) {
        goToNextMobile();
      } else {
        goToPrevMobile();
      }
    }
    mobileTouchStartX.current = null;
  };

  // Handle touch swiping on desktop/tablet
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

      {/* Mobile View: 11-Slide Automatic Carousel with Silky Crossfade Transition */}
      <div
        className="block sm:hidden relative w-full aspect-[1086/1448] overflow-hidden bg-[#FAF4ED] select-none"
        onTouchStart={handleMobileTouchStart}
        onTouchEnd={handleMobileTouchEnd}
      >
        {/* Stacked Mobile Slides with Crossfade */}
        {MOBILE_BANNER_SLIDES.map((slide, index) => {
          const isActive = index === mobileIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out cursor-pointer ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              onClick={() => {
                if (!mobileHasSwiped.current) {
                  onShopClick?.(slide.category || 'all');
                }
              }}
              aria-hidden={!isActive}
              role="button"
              tabIndex={isActive ? 0 : -1}
              aria-label={slide.alt}
              onKeyDown={(e) => {
                if (isActive && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onShopClick?.(slide.category || 'all');
                }
              }}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover select-none block"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding={index === 0 ? 'sync' : 'async'}
                draggable={false}
              />
            </div>
          );
        })}

        {/* Left Arrow Button for Mobile */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToPrevMobile();
          }}
          aria-label="Previous mobile banner"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#641623] shadow-xs backdrop-blur-xs flex items-center justify-center transition-all active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.4]" />
        </button>

        {/* Right Arrow Button for Mobile */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToNextMobile();
          }}
          aria-label="Next mobile banner"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#641623] shadow-xs backdrop-blur-xs flex items-center justify-center transition-all active:scale-90 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.4]" />
        </button>

        {/* 11 Slide Indicator Dots for Mobile */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/55 backdrop-blur-md border border-white/40 shadow-2xs pointer-events-auto">
          {MOBILE_BANNER_SLIDES.map((slide, index) => {
            const isActive = index === mobileIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileIndex(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={isActive ? 'true' : 'false'}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer overflow-hidden ${
                  isActive
                    ? 'w-4 bg-[#641623]'
                    : 'w-1.5 bg-[#641623]/30 hover:bg-[#641623]/60'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop View: Full-width Edge-to-Edge 4-Slide Carousel (2:1 aspect ratio) */}
      <div
        className="hidden sm:block relative w-full aspect-[2/1] overflow-hidden bg-[#F8EFE4] group select-none"
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
    </section>
  );
};
