/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Pause, Play } from 'lucide-react';

interface BannerSlide {
  id: string;
  image: string;
  alt: string;
  captionTitle?: string;
  captionSubtitle?: string;
  badge?: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: 'banner-1',
    image: '/banners/1.png',
    alt: 'Knitknot Handcrafted Artisan Collection',
    badge: 'Artisan Curations',
  },
  {
    id: 'banner-3',
    image: '/banners/3.png',
    alt: 'Knitknot Eternal Blooms & Bouquets',
    badge: 'Flowers That Never Wilt',
  },
  {
    id: 'banner-4',
    image: '/banners/4.png',
    alt: 'Knitknot Coquette Accessories & Charms',
    badge: 'Handmade With Love',
  },
  {
    id: 'banner-5',
    image: '/banners/5.png',
    alt: 'Knitknot Pure Cotton Crochet Staples',
    badge: 'New Season Drop',
  },
];

interface AutoBannerSlideshowProps {
  onBannerClick?: (index: number) => void;
}

export const AutoBannerSlideshow: React.FC<AutoBannerSlideshowProps> = ({ onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 4500; // 4.5 seconds

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  // Auto slideshow timer
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <section 
      aria-label="Featured Knitknot Banner Showcase"
      className="w-full bg-[#faf4e8] py-6 sm:py-10 px-3.5 sm:px-6 lg:px-8 select-none"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Slideshow Outer Frame */}
        <div 
          className="relative rounded-3xl sm:rounded-[32px] overflow-hidden shadow-xl border border-[#841724]/15 bg-[#2b0b12] group cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => onBannerClick?.(currentIndex)}
        >
          {/* 2:1 Aspect Ratio container with responsive minimum heights */}
          <div className="relative w-full aspect-[2/1] min-h-[200px] sm:min-h-[320px] md:min-h-[420px] lg:min-h-[520px] flex items-center justify-center overflow-hidden">
            {BANNERS.map((banner, index) => {
              const isActive = index === currentIndex;
              return (
                <div
                  key={banner.id}
                  className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${
                    isActive 
                      ? 'opacity-100 scale-100 z-10 pointer-events-auto' 
                      : 'opacity-0 scale-105 z-0 pointer-events-none'
                  }`}
                  aria-hidden={!isActive}
                >
                  <img
                    src={banner.image}
                    alt={banner.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    className="w-full h-full object-cover sm:object-contain object-center bg-[#2b0b12]"
                  />

                  {/* Gradient tint at bottom for controls clarity */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Cute Badge on Top Right */}
                  {banner.badge && (
                    <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 text-[#841724] backdrop-blur-md text-[11px] sm:text-xs font-bold shadow-md border border-white/50 tracking-wide uppercase">
                        <Sparkles className="w-3 h-3 text-[#841724]" />
                        {banner.badge}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous Banner Slide"
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#faedd3]/85 hover:bg-[#841724] text-[#841724] hover:text-[#faedd3] backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 opacity-90 group-hover:opacity-100 hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next Banner Slide"
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#faedd3]/85 hover:bg-[#841724] text-[#841724] hover:text-[#faedd3] backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 opacity-90 group-hover:opacity-100 hover:scale-105"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Bottom Bar: Dots & Pause/Play Indicator */}
          <div className="absolute bottom-3.5 sm:bottom-5 left-0 right-0 z-30 flex items-center justify-center gap-2 sm:gap-2.5 pointer-events-auto">
            {BANNERS.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(dotIndex);
                }}
                aria-label={`Jump to slide ${dotIndex + 1}`}
                className={`transition-all duration-400 rounded-full h-2 sm:h-2.5 ${
                  dotIndex === currentIndex
                    ? 'w-7 sm:w-9 bg-[#faedd3] shadow-md'
                    : 'w-2 sm:w-2.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}

            {/* Micro Pause/Play Pill */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused((p) => !p);
              }}
              title={isPaused ? 'Resume auto-slideshow' : 'Pause auto-slideshow'}
              aria-label={isPaused ? 'Resume auto-slideshow' : 'Pause auto-slideshow'}
              className="ml-2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white/80 flex items-center justify-center backdrop-blur-sm transition-colors text-xs"
            >
              {isPaused ? <Play className="w-3 h-3 fill-white ml-0.5" /> : <Pause className="w-3 h-3 fill-white" />}
            </button>
          </div>

          {/* Animated Progress Bar along the bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30 overflow-hidden">
            <div
              key={currentIndex + (isPaused ? '-paused' : '-running')}
              className="h-full bg-gradient-to-r from-[#faedd3] via-amber-300 to-[#faedd3]"
              style={{
                width: isPaused ? '100%' : '100%',
                animation: isPaused ? 'none' : `bannerProgress ${SLIDE_DURATION}ms linear forwards`,
              }}
            />
          </div>

        </div>

      </div>

      <style>{`
        @keyframes bannerProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};
