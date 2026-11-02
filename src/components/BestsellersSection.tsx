import React, { useState, useRef } from 'react';

interface BestsellerProduct {
  id: string;
  nameLine1: string;
  nameLine2: string;
  price: string;
  image: string;
  fallbackImage: string;
}

const BESTSELLERS: BestsellerProduct[] = [
  {
    id: 'sunflower-keychain',
    nameLine1: 'sunflower',
    nameLine2: 'keychain',
    price: '₹499',
    image: '/bestsellers/sunflower-keychain-real.jpg',
    fallbackImage: '/bestsellers/sunflower-keychain.jpg',
  },
  {
    id: 'crochet-hair-bow',
    nameLine1: 'crochet',
    nameLine2: 'hair bow',
    price: '₹399',
    image: '/bestsellers/crochet-hair-bow-real.jpg',
    fallbackImage: '/bestsellers/crochet-hair-bow.jpg',
  },
  {
    id: 'sunflower-bouquet',
    nameLine1: 'sunflower',
    nameLine2: 'bouquet',
    price: '₹1,299',
    image: '/bestsellers/sunflower-bouquet-real.jpg',
    fallbackImage: '/bestsellers/sunflower-bouquet.jpg',
  },
  {
    id: 'flower-clips',
    nameLine1: 'flower clips',
    nameLine2: '(set of 2)',
    price: '₹399',
    image: '/bestsellers/flower-clips-real.jpg',
    fallbackImage: '/bestsellers/flower-clips.jpg',
  },
  {
    id: 'tulip-stems',
    nameLine1: 'tulip stems',
    nameLine2: '(set of 3)',
    price: '₹999',
    image: '/bestsellers/tulip-stems-real.jpg',
    fallbackImage: '/bestsellers/tulip-stems.jpg',
  },
];

interface BestsellersSectionProps {
  onProductClick?: (productId: string) => void;
  onShopAllClick?: () => void;
}

export const BestsellersSection: React.FC<BestsellersSectionProps> = ({
  onProductClick,
  onShopAllClick,
}) => {
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) return;
      const progress = scrollLeft / maxScroll;
      const dotIndex = Math.min(2, Math.max(0, Math.round(progress * 2)));
      setActiveDot(dotIndex);
    }
  };

  return (
    <section className="w-full bg-[#FAF4ED] pt-3 pb-12 sm:pt-5 sm:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1300px] mx-auto flex flex-col items-center">
        {/* 1. Curvy Dashed Stitch Divider with Centered Yarn Ball Icon */}
        <div className="w-full mb-5 sm:mb-7 px-2">
          <svg
            viewBox="0 0 1200 64"
            className="w-full h-auto text-[#641623] overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left Curvy Wavy Dashed Stitch Line */}
            <path
              d="M 15 32 C 160 16, 310 46, 450 24 C 500 16, 545 28, 568 32"
              stroke="#641623"
              strokeWidth="2.8"
              strokeDasharray="22 14"
              strokeLinecap="round"
              className="opacity-85"
            />

            {/* Authentic Yarn Ball Icon in the Center */}
            <g transform="translate(600, 32)">
              {/* Page cream background circle to prevent dashed line collision */}
              <circle cx="0" cy="0" r="18" fill="#FAF4ED" stroke="#641623" strokeWidth="2.8" />
              {/* Yarn strand windings */}
              <path d="M -13 -7 C -7 -14, 2 -14, 12 -8" stroke="#641623" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M -16 1 C -8 -6, 2 -5, 14 -1" stroke="#641623" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M -14 9 C -7 3, 4 4, 15 5" stroke="#641623" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M -9 15 C -3 10, 5 10, 11 13" stroke="#641623" strokeWidth="2.4" strokeLinecap="round" />
              {/* Interlocking yarn cross bands */}
              <path d="M -4 -16 C 3 -6, 3 7, -3 16" stroke="#641623" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M 4 -16 C 10 -5, 9 8, 5 16" stroke="#641623" strokeWidth="2.4" strokeLinecap="round" />
            </g>

            {/* Right Curvy Wavy Dashed Stitch Line */}
            <path
              d="M 632 32 C 655 28, 700 16, 750 24 C 890 46, 1040 16, 1185 32"
              stroke="#641623"
              strokeWidth="2.8"
              strokeDasharray="22 14"
              strokeLinecap="round"
              className="opacity-85"
            />
          </svg>
        </div>

        {/* 2. Heading with 4-Point Sparkle Stars: ✦ bestsellers ✦ */}
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8 text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Left 4-Point Sparkle Star */}
            <svg
              className="w-5 h-5 sm:w-7 sm:h-7 text-[#641623] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="#FFFDF9"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinejoin="round"
            >
              <path d="M 12 1.5 Q 12 12 22.5 12 Q 12 12 12 22.5 Q 12 12 1.5 12 Q 12 12 12 1.5 Z" />
            </svg>

            {/* Heading in Exact Lowercase, Font & Color */}
            <h2 className="font-['Fredoka'] font-bold text-3xl sm:text-4xl md:text-5xl text-[#641623] lowercase tracking-tight">
              bestsellers
            </h2>

            {/* Right 4-Point Sparkle Star */}
            <svg
              className="w-5 h-5 sm:w-7 sm:h-7 text-[#641623] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="#FFFDF9"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinejoin="round"
            >
              <path d="M 12 1.5 Q 12 12 22.5 12 Q 12 12 12 22.5 Q 12 12 1.5 12 Q 12 12 12 1.5 Z" />
            </svg>
          </div>

          {/* Subtitle Link */}
          <button
            onClick={onShopAllClick}
            className="text-[#641623] font-['Fredoka'] font-bold text-sm sm:text-base md:text-[17px] hover:underline inline-flex items-center gap-1.5 mt-1 transition-opacity cursor-pointer focus:outline-none"
          >
            <span>shop all bestsellers</span>
            <span className="text-base">→</span>
          </button>
        </div>

        {/* 3. Product Carousel Row with Left and Right Circular Arrow Navigation */}
        <div className="relative w-full">
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll('left')}
            className="flex absolute -left-2 sm:-left-3 lg:-left-5 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-[#641623] bg-[#FAF4ED] text-[#641623] items-center justify-center hover:bg-[#641623] hover:text-white transition-all shadow-md focus:outline-none cursor-pointer"
            aria-label="Previous products"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Cards Container (Scrollable Row / Flex Grid) */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="w-full flex items-stretch justify-start lg:justify-between gap-3 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar py-2 px-1 snap-x snap-mandatory"
          >
            {BESTSELLERS.map((item) => (
              <div
                key={item.id}
                onClick={() => onProductClick?.(item.id)}
                className="group flex-1 min-w-[175px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[225px] cursor-pointer rounded-[26px] bg-[#FFF7F0] border border-[#F0E2D4] shadow-[0_4px_16px_rgba(100,22,35,0.04)] hover:shadow-[0_12px_28px_rgba(100,22,35,0.1)] transition-all duration-300 hover:-translate-y-1.5 p-2.5 sm:p-3 flex flex-col items-center justify-between snap-center"
              >
                {/* Product Image Window */}
                <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-[#F8EFE5] flex items-center justify-center relative">
                  <img
                    src={item.image}
                    alt={`${item.nameLine1} ${item.nameLine2}`}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== item.fallbackImage) {
                        target.src = item.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300 select-none"
                    loading="lazy"
                  />
                </div>

                {/* Product Title & Price */}
                <div className="w-full text-center mt-3 mb-1 flex flex-col items-center">
                  <h3 className="font-['Fredoka'] font-bold text-xs sm:text-sm md:text-base lg:text-[17px] text-[#641623] leading-tight lowercase">
                    {item.nameLine1}
                    <br />
                    {item.nameLine2}
                  </h3>
                  <span className="font-['Fredoka'] font-bold text-sm sm:text-base md:text-lg lg:text-xl text-[#641623] mt-1.5">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll('right')}
            className="flex absolute -right-2 sm:-right-3 lg:-right-5 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-[#641623] bg-[#FAF4ED] text-[#641623] items-center justify-center hover:bg-[#641623] hover:text-white transition-all shadow-md focus:outline-none cursor-pointer"
            aria-label="Next products"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* 4. Carousel Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          <button
            onClick={() => {
              scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
              setActiveDot(0);
            }}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
              activeDot === 0
                ? 'bg-[#641623] scale-110'
                : 'border-2 border-[#641623] bg-transparent'
            }`}
            aria-label="Slide 1"
          />
          <button
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({
                  left: (scrollRef.current.scrollWidth - scrollRef.current.clientWidth) / 2,
                  behavior: 'smooth',
                });
              }
              setActiveDot(1);
            }}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
              activeDot === 1
                ? 'bg-[#641623] scale-110'
                : 'border-2 border-[#641623] bg-transparent'
            }`}
            aria-label="Slide 2"
          />
          <button
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({
                  left: scrollRef.current.scrollWidth,
                  behavior: 'smooth',
                });
              }
              setActiveDot(2);
            }}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
              activeDot === 2
                ? 'bg-[#641623] scale-110'
                : 'border-2 border-[#641623] bg-transparent'
            }`}
            aria-label="Slide 3"
          />
        </div>
      </div>
    </section>
  );
};
