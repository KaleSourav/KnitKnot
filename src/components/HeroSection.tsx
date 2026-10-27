import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play,
  ChevronDown
} from 'lucide-react';
import { Product } from '../data/products';
import heroImage1 from '../assets/handmade-happiness-hero.png';
import heroImage2 from '../assets/knitknot-landing.png';

interface HeroSectionProps {
  onExploreClick: () => void;
  onSelectCategory?: (cat: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  heroProducts: { [key: string]: Product };
}

interface Hotspot {
  id: string;
  productId: string;
  title: string;
  price: number;
  xPercent: number; // percentage from left
  yPercent: number; // percentage from top
  category: string;
}

// Hotspots positioned specifically for "Handmade Happiness Crochet Collection.png"
const HERO_HOTSPOTS: Hotspot[] = [
  {
    id: 'hs-bouquet',
    productId: 'p-bouquet-01',
    title: 'Everlasting White Lily Bouquet',
    price: 1499,
    xPercent: 18,
    yPercent: 54,
    category: 'Flowers',
  },
  {
    id: 'hs-bunny',
    productId: 'p-amigurumi-01',
    title: 'Lilac Bunny & Chick Set',
    price: 899,
    xPercent: 37,
    yPercent: 71,
    category: 'Amigurumi',
  },
  {
    id: 'hs-sunflower',
    productId: 'p-flower-03',
    title: 'Sunbeam Sunflower Stem',
    price: 399,
    xPercent: 53,
    yPercent: 81,
    category: 'Flowers',
  },
  {
    id: 'hs-tote',
    productId: 'p-tote-01',
    title: 'Daisy Granny Square Tote',
    price: 1599,
    xPercent: 65,
    yPercent: 69,
    category: 'Bags',
  },
  {
    id: 'hs-accessories',
    productId: 'p-acc-01',
    title: 'Handmade Headband & Bow',
    price: 599,
    xPercent: 82,
    yPercent: 79,
    category: 'Hair Accessories',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onAddToCart,
  onQuickView,
  heroProducts,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const slides = [
    {
      id: 'slide-handmade-happiness',
      image: heroImage1,
      title: 'Handmade Happiness Crochet Collection',
      tagline: 'Flowers... but everlasting!! • Little yarn. Big stories ♡',
    },
    {
      id: 'slide-knots-story',
      image: heroImage2,
      title: 'Artisan Knits & Everlasting Blooms',
      tagline: 'Made slowly, lovingly & by hand',
    },
  ];

  // Auto carousel rotation with gentle 6.5s interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full h-[calc(100vh-136px)] min-h-[480px] max-h-[880px] bg-[#faf4e8] select-none flex flex-col justify-between overflow-hidden">
      {/* 1. HERO IMAGE STACK - Perfectly capturing the opening screen viewport */}
      <div className="relative w-full flex-1 overflow-hidden flex items-center justify-center">
        
        {/* SLIDES STACK WITH SLOW CROSS-FADE TRANSITION (1000ms duration) */}
        {slides.map((slide, index) => {
          const isActive = currentSlide === index;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex items-center justify-center ${
                isActive 
                  ? 'opacity-100 z-10' 
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
              />

              {/* Interactive Hotspot Pins (Only on Slide 1 for "Handmade Happiness") */}
              {index === 0 && (
                <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}>
                  {HERO_HOTSPOTS.map((spot) => {
                    const product = heroProducts[spot.productId];
                    const isHovered = activeHotspot?.id === spot.id;

                    const alignmentClasses =
                      spot.xPercent < 25
                        ? 'left-0 translate-x-0'
                        : spot.xPercent > 75
                        ? 'right-0 left-auto translate-x-0'
                        : 'left-1/2 -translate-x-1/2';

                    return (
                      <div
                        key={spot.id}
                        className="absolute pointer-events-auto z-20"
                        style={{
                          left: `${spot.xPercent}%`,
                          top: `${spot.yPercent}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        {/* Pulsing Hotspot Pin */}
                        <button
                          onMouseEnter={() => setActiveHotspot(spot)}
                          onMouseLeave={() => setActiveHotspot(null)}
                          onClick={() => {
                            setActiveHotspot(activeHotspot?.id === spot.id ? null : spot);
                          }}
                          className="relative group flex items-center justify-center p-1 sm:p-2 cursor-pointer focus:outline-none"
                          aria-label={`View ${spot.title}`}
                        >
                          <span className="absolute w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-[#841724]/35 animate-ping" />
                          <span className="relative flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#841724] text-[#faedd3] font-bold shadow-lg border-2 border-[#fffdfa] hover:scale-110 active:scale-95 transition-transform">
                            <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#faedd3]" />
                          </span>
                        </button>

                        {/* Interactive Hotspot Popup Card */}
                        {isHovered && (
                          <div
                            onMouseEnter={() => setActiveHotspot(spot)}
                            onMouseLeave={() => setActiveHotspot(null)}
                            className={`absolute bottom-full mb-3 ${alignmentClasses} w-56 sm:w-64 bg-[#fffdfa] text-[#2d0a10] rounded-2xl shadow-2xl p-3 border border-[#841724]/20 z-30 animate-in fade-in zoom-in-95 duration-200`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#841724] bg-[#841724]/10 px-2 py-0.5 rounded-full">
                                {spot.category}
                              </span>
                              <span className="text-[10px] text-emerald-700 font-bold ml-auto">
                                In Stock
                              </span>
                            </div>

                            <h4 className="text-xs sm:text-sm font-bold text-[#2d0a10] line-clamp-1">
                              {spot.title}
                            </h4>

                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#841724]/10">
                              <span className="text-sm font-black text-[#841724]">
                                ₹{spot.price.toLocaleString('en-IN')}
                              </span>

                              <div className="flex items-center gap-1.5">
                                {product && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onQuickView(product);
                                    }}
                                    className="p-1.5 text-[#841724] hover:bg-[#841724]/10 rounded-lg transition-colors cursor-pointer"
                                    title="Quick Preview"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {product && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onAddToCart(product);
                                    }}
                                    className="inline-flex items-center gap-1 bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm cursor-pointer"
                                  >
                                    <ShoppingBag className="w-3 h-3" />
                                    <span>Add</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* BOTTOM SLIDER CONTROLS (Matching Reference Image: < ● ○ > ||) */}
        <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 sm:gap-4 bg-[#fffdfa]/90 backdrop-blur-md px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full border border-[#841724]/20 shadow-md">
          {/* Prev arrow */}
          <button
            onClick={handlePrevSlide}
            className="p-1 text-[#841724] hover:text-[#5c0f19] hover:bg-[#841724]/10 rounded-full transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </button>

          {/* Slider Dots */}
          <div className="flex items-center gap-2">
            {slides.map((s, index) => {
              const isActive = currentSlide === index;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isActive
                      ? 'w-2.5 h-2.5 bg-[#841724]'
                      : 'w-2 h-2 bg-[#841724]/30 hover:bg-[#841724]/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>

          {/* Next arrow */}
          <button
            onClick={handleNextSlide}
            className="p-1 text-[#841724] hover:text-[#5c0f19] hover:bg-[#841724]/10 rounded-full transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </button>

          {/* Divider */}
          <span className="w-px h-3.5 bg-[#841724]/20" />

          {/* Pause / Play Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 text-[#841724] hover:text-[#5c0f19] hover:bg-[#841724]/10 rounded-full transition-colors cursor-pointer"
            title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2]" />
            ) : (
              <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2] fill-current" />
            )}
          </button>
        </div>

      </div>

      {/* 2. SUBTLE BOTTOM STRIP WITH SCROLL PROMPT - Leads seamlessly into the next section */}
      <div 
        onClick={onExploreClick}
        className="w-full bg-[#faedd3] border-t border-[#841724]/15 py-2 px-4 flex items-center justify-between text-xs sm:text-sm font-serif italic text-[#841724] cursor-pointer hover:bg-[#f6e6c4] transition-colors"
      >
        <span className="hidden sm:inline">✨ Made slowly, lovingly & by hand</span>
        <div className="mx-auto flex items-center gap-1.5 font-sans font-semibold text-[11px] sm:text-xs not-italic tracking-wider uppercase text-[#841724]">
          <span>Scroll to explore our collections</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce stroke-[2.5]" />
        </div>
        <span className="hidden sm:inline">100% Handcrafted crochet ♡</span>
      </div>
    </section>
  );
};
