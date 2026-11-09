import React, { useState, useRef } from 'react';

interface BestsellerProduct {
  id: string;
  name: string;
  price: string;
  badge?: string;
  image: string;
  hoverImage: string;
  fallbackImage: string;
}

const BESTSELLERS: BestsellerProduct[] = [
  {
    id: 'gid://shopify/Product/8502150037567',
    name: 'Mini Red Rose Garden Bouquet',
    price: 'Rs. 1,000',
    badge: 'COMING SOON',
    image: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_DlhI_qXJ_1791261174851_7ircqgdvvz7aeb1.jpg?v=1793949938',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_DlhI_qXJ_1791261175003_kd00cx2qr19tfk9.jpg?v=1793949938',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_DlhI_qXJ_1791261174851_7ircqgdvvz7aeb1.jpg?v=1793949938',
  },
  {
    id: 'gid://shopify/Product/8502148530239',
    name: 'Heart Plushie',
    price: 'Rs. 1,800',
    badge: 'COMING SOON',
    image: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_S1joXZHQ_1791261165706_rszy83chhrcpyp6.jpg?v=1793949900',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_S1joXZHQ_1791261166017_p8avr2g8cr99e96.jpg?v=1793949900',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_S1joXZHQ_1791261165706_rszy83chhrcpyp6.jpg?v=1793949900',
  },
  {
    id: 'gid://shopify/Product/8473635291199',
    name: 'Pink Lotus',
    price: 'Rs. 900',
    badge: 'COMING SOON',
    image: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/k940KGAH_2OT96H05C8_2026-09-29_1.jpg?v=1793949796',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/k940KGAH_QN8I4BTIYD_2026-09-29_2.jpg?v=1793949795',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/k940KGAH_2OT96H05C8_2026-09-29_1.jpg?v=1793949796',
  },
  {
    id: 'gid://shopify/Product/8502149513279',
    name: 'Photo Frame Pink',
    price: 'Rs. 700',
    badge: 'COMING SOON',
    image: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_bFk5rglw_1791261162907_jr33ya3o5a6mhpf.jpg?v=1793949927',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_bFk5rglw_1791261163165_8q5mx6tdf8ukcz5.jpg?v=1793949927',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_bFk5rglw_1791261162907_jr33ya3o5a6mhpf.jpg?v=1793949927',
  },
  {
    id: 'gid://shopify/Product/8473638109247',
    name: 'Blue Daisy Tote',
    price: 'Rs. 1,930',
    badge: 'COMING SOON',
    image: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website__s4EYMjW_1791261175302_gf0hgngr2qf7xx0_ec0964c6-7d75-43cf-9d67-aaef8b426210.jpg?v=1793949725',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website__s4EYMjW_1791261175407_iud6c5vtahfi0d3_d19dcb3c-3c92-484f-b0f5-222dad16d457.jpg?v=1793949726',
    fallbackImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website__s4EYMjW_1791261175302_gf0hgngr2qf7xx0_ec0964c6-7d75-43cf-9d67-aaef8b426210.jpg?v=1793949725',
  },
];

const optimizeShopifyUrl = (url: string, width = 500) => {
  if (!url) return url;
  if (url.includes('cdn.shopify.com') && !url.includes('&width=')) {
    return `${url}&width=${width}&format=webp`;
  }
  return url;
};

interface BestsellersSectionProps {
  onProductClick?: (productId: string) => void;
  onShopAllClick?: () => void;
  onNotifyClick?: (productId: string) => void;
  initialHoveredId?: string | null;
}

export const BestsellersSection: React.FC<BestsellersSectionProps> = ({
  onProductClick,
  onShopAllClick,
  onNotifyClick,
  initialHoveredId = null,
}) => {
  const [activeDot, setActiveDot] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(initialHoveredId);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
      <div className="w-full max-w-[1340px] mx-auto flex flex-col items-center">
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

            {/* Authentic Yarn Ball Icon in Center */}
            <g transform="translate(600, 32)">
              <circle cx="0" cy="0" r="18" fill="#FAF4ED" stroke="#641623" strokeWidth="2.8" />
              <path d="M -13 -7 C -7 -14, 2 -14, 12 -8" stroke="#641623" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M -16 1 C -8 -6, 2 -5, 14 -1" stroke="#641623" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M -14 9 C -7 3, 4 4, 15 5" stroke="#641623" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M -9 15 C -3 10, 5 10, 11 13" stroke="#641623" strokeWidth="2.4" strokeLinecap="round" />
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
          {/* Left Arrow Button (Desktop only, mobile uses smooth touch swipe) */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute -left-2 sm:-left-3 lg:-left-5 top-[38%] -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full border-[1.8px] sm:border-2 border-[#2D2424] bg-[#FAF4ED] text-[#2D2424] items-center justify-center hover:bg-[#2D2424] hover:text-white transition-all shadow-md focus:outline-none cursor-pointer"
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
            {BESTSELLERS.map((item) => {
              const isHovered = hoveredCard === item.id;

              return (
                <div
                  key={item.id}
                  title={item.name}
                  onClick={() => onProductClick?.(item.id)}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group flex-1 min-w-[160px] sm:min-w-[210px] md:min-w-[230px] lg:min-w-[240px] cursor-pointer flex flex-col items-start justify-between snap-center"
                >
                  {/* 1. Tall Rounded Image Box with Crisp Border & Smooth Hover Crossfade */}
                  <div className="relative w-full aspect-[3/4] sm:aspect-[4/5.1] rounded-[20px] sm:rounded-[28px] overflow-hidden border-[1.8px] sm:border-2 border-[#2D2424] bg-white shadow-sm transition-all duration-300">
                    {/* Cute Knotsnco Decorative Pop-in Element on Hover (Tiny Crochet Flower) */}
                    <div
                      className="absolute top-2.5 left-2.5 z-20 pointer-events-none transition-all duration-300 ease-out transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:rotate-12"
                      aria-hidden="true"
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FFF5CC] border border-[#811B2B]/20 shadow-sm flex items-center justify-center p-1">
                        <svg viewBox="0 0 24 24" className="w-full h-full text-[#811B2B]">
                          <circle cx="12" cy="7" r="3" fill="currentColor" opacity="0.9" />
                          <circle cx="16.5" cy="10" r="3" fill="currentColor" opacity="0.9" />
                          <circle cx="15" cy="15.5" r="3" fill="currentColor" opacity="0.9" />
                          <circle cx="9" cy="15.5" r="3" fill="currentColor" opacity="0.9" />
                          <circle cx="7.5" cy="10" r="3" fill="currentColor" opacity="0.9" />
                          <circle cx="12" cy="12" r="2.8" fill="#F5D76E" stroke="#811B2B" strokeWidth="1" />
                        </svg>
                      </div>
                    </div>

                    {/* Animated Image Wrapper: 1.04 scale, gentle upward lift, and subtle 2-deg rotation */}
                    <div className="w-full h-full relative transition-transform duration-500 ease-out group-hover:scale-[1.04] group-hover:-translate-y-1.5 group-hover:rotate-[2deg] motion-reduce:transform-none">
                      {/* Default Image */}
                      <img
                        src={optimizeShopifyUrl(item.image, 500)}
                        alt={item.name}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== item.fallbackImage) {
                            target.src = item.fallbackImage;
                          }
                        }}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out select-none ${
                          isHovered ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
                        }`}
                        loading="lazy"
                        decoding="async"
                      />

                      {/* Secondary Hover Image (Fades In on Hover) */}
                      <img
                        src={optimizeShopifyUrl(item.hoverImage, 500)}
                        alt={`${item.name} alternate view`}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== item.fallbackImage) {
                            target.src = item.fallbackImage;
                          }
                        }}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out select-none ${
                          isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* Mint Green Scalloped Daisy Flower Badge ("COMING SOON") in Top Right */}
                    {item.badge && (
                      <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none drop-shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <svg viewBox="0 0 50 50" className="w-10 h-10 sm:w-11 sm:h-11">
                          {/* 5 Petal Lobes */}
                          <g fill="#7FE5BD" stroke="#2D2424" strokeWidth="2.2">
                            <circle cx="25" cy="14" r="9.5" />
                            <circle cx="35.5" cy="21.6" r="9.5" />
                            <circle cx="31.5" cy="34" r="9.5" />
                            <circle cx="18.5" cy="34" r="9.5" />
                            <circle cx="14.5" cy="21.6" r="9.5" />
                          </g>
                          {/* Center Fill */}
                          <circle cx="25" cy="25" r="12.5" fill="#7FE5BD" />
                          {/* Badge Text */}
                          <text
                            x="25"
                            y="22.5"
                            textAnchor="middle"
                            fontSize="6.5"
                            fontWeight="800"
                            fill="#2D2424"
                            fontFamily="Fredoka, sans-serif"
                            letterSpacing="0.02em"
                          >
                            COMING
                          </text>
                          <text
                            x="25"
                            y="30.5"
                            textAnchor="middle"
                            fontSize="6.5"
                            fontWeight="800"
                            fill="#2D2424"
                            fontFamily="Fredoka, sans-serif"
                            letterSpacing="0.02em"
                          >
                            SOON
                          </text>
                        </svg>
                      </div>
                    )}

                    {/* Slide-Up Pill Button ("NOTIFY ME") on Hover */}
                    <div className="absolute bottom-3 sm:bottom-3.5 left-0 right-0 z-20 flex items-center justify-center px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNotifyClick?.(item.id);
                        }}
                        className={`w-full py-2.5 px-4 bg-[#2D2424] text-white font-['Fredoka'] font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-lg transition-all duration-300 ease-out hover:bg-[#641623] hover:scale-102 active:scale-95 cursor-pointer text-center ${
                          isHovered
                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                        }`}
                      >
                        NOTIFY ME
                      </button>
                    </div>
                  </div>

                  {/* 2. Product Information Below Image (Left-Aligned + Price + Wishlist Heart) */}
                  <div className="w-full mt-3 px-1 flex flex-col items-start text-left">
                    {/* Title */}
                    <h3 className="font-['Fredoka'] font-bold text-sm sm:text-[15px] text-[#2D2424] leading-snug line-clamp-2 hover:text-[#641623] transition-colors">
                      {item.name}
                    </h3>

                    {/* Price & Wishlist Row */}
                    <div className="mt-1.5 flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-['Fredoka'] font-bold text-sm sm:text-base text-[#2D2424]">
                          {item.price}
                        </span>
                        {/* Wishlist Heart Icon */}
                        <button
                          onClick={(e) => toggleWishlist(item.id, e)}
                          className="text-[#2D2424] hover:text-[#641623] transition-colors focus:outline-none cursor-pointer"
                          aria-label="Add to wishlist"
                        >
                          {wishlist[item.id] ? (
                            <svg className="w-4 h-4 text-[#641623] fill-current" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button (Desktop only, mobile uses smooth touch swipe) */}
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute -right-2 sm:-right-3 lg:-right-5 top-[38%] -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full border-[1.8px] sm:border-2 border-[#2D2424] bg-[#FAF4ED] text-[#2D2424] items-center justify-center hover:bg-[#2D2424] hover:text-white transition-all shadow-md focus:outline-none cursor-pointer"
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
