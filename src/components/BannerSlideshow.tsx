import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Slide {
  id: number;
  image: string;
  fallback: string;
  title: string;
  tagline: string;
  badge: string;
}

const SLIDES: Slide[] = [
  {
    id: 5,
    image: '/banners/5.jpg',
    fallback: '/banners/5.png',
    title: 'Plushie Bouquets',
    tagline: 'Super-soft hand-stitched amigurumi companions paired with everlasting floral stems',
    badge: 'Loved By 10k+ Givers',
  },
  {
    id: 4,
    image: '/banners/4.jpg',
    fallback: '/banners/4.png',
    title: 'Crochet God Collection',
    tagline: 'Sacred handwoven deities crafted with pure devotion, fine detail & milk cotton',
    badge: 'Spiritual Keepsakes',
  },
  {
    id: 1,
    image: '/banners/1.jpg',
    fallback: '/banners/1.png',
    title: 'Handmade Happiness',
    tagline: 'Every knot tied by hand, every petal woven with purpose for smiles that last',
    badge: 'Knotsnco Originals',
  },
  {
    id: 3,
    image: '/banners/3.jpg',
    fallback: '/banners/3.png',
    title: 'Artisan Everlasting Blooms',
    tagline: 'Sunflowers, blush roses, dancing lilies & meadow tulips that bloom forever',
    badge: '100% Hand-Crocheted',
  },
];

const SLIDE_DURATION = 5000; // 5 seconds per slide

export const BannerSlideshow: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const total = SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrent(idx);
    setProgress(0);
  };

  // Preload images
  useEffect(() => {
    SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // Automatic progression with smooth progress tick
  useEffect(() => {
    if (isPaused) return;

    const interval = 50; // update progress every 50ms
    const step = (interval / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full h-[75vh] min-h-[480px] md:h-screen md:min-h-[660px] max-h-[1080px] overflow-hidden bg-[#FAF8F2] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Knotsnco Collections Showcase"
    >
      {/* Slides Viewport */}
      {SLIDES.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            <picture className="w-full h-full block">
              <source srcSet={slide.image} type="image/jpeg" />
              <img
                src={slide.fallback}
                alt={slide.title}
                className={`w-full h-full object-cover object-center block transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </picture>

            {/* Subtle bottom gradient to ensure controls & text contrast */}
            <div
              className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)',
              }}
            />
          </div>
        );
      })}

      {/* Floating Top Badge */}
      <div className="absolute top-5 sm:top-8 left-5 sm:left-10 z-20 flex items-center gap-2.5">
        <span className="px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase bg-black/45 backdrop-blur-md text-white border border-white/20 shadow-lg">
          {SLIDES[current].badge}
        </span>
        {isPaused && (
          <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-black/35 backdrop-blur-md text-white/85 border border-white/10">
            Paused
          </span>
        )}
      </div>

      {/* Slide Counter (e.g. 01 / 04) */}
      <div className="absolute top-5 sm:top-8 right-5 sm:right-10 z-20">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider bg-black/45 backdrop-blur-md text-white border border-white/20 shadow-lg">
          0{current + 1} / 0{total}
        </span>
      </div>

      {/* Previous Slide Button */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white/75 hover:bg-white text-[#181a08] shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border border-white/40"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next Slide Button */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white/75 hover:bg-white text-[#181a08] shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border border-white/40"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Bottom Bar: Slide Navigation Indicators & CTA */}
      <div className="absolute bottom-6 sm:bottom-9 inset-x-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-12 pointer-events-none">
        {/* Slide Title info */}
        <div className="hidden md:flex flex-col text-white max-w-md pointer-events-auto drop-shadow-md">
          <span className="text-sm font-semibold tracking-wide text-white/90 uppercase">{SLIDES[current].title}</span>
          <span className="text-xs text-white/75 font-normal line-clamp-1">{SLIDES[current].tagline}</span>
        </div>

        {/* Bottom Navigation Indicators (Fill Progress Bars) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 pointer-events-auto">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                className="group relative h-2 sm:h-2.5 rounded-full overflow-hidden transition-all duration-300 cursor-pointer bg-white/35 hover:bg-white/55"
                style={{
                  width: isActive ? 'clamp(54px, 7vw, 84px)' : 'clamp(22px, 2.5vw, 34px)',
                }}
              >
                {isActive && (
                  <span
                    className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-75 shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Floating Explore Collection Button */}
        <div className="pointer-events-auto">
          <a
            href="#stats"
            className="px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/90 hover:bg-white text-[#2a380b] shadow-[0_8px_20px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 border border-white/40"
          >
            <span>Shop Collection</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BannerSlideshow;
