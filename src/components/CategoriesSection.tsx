import React, { useState, useRef } from 'react';

interface CategoryItem {
  id: string;
  buttonLabel: string;
  badgeLine1: string;
  badgeLine2: string;
  image: string;
  hoverImage: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'flowers',
    buttonLabel: 'FLOWERS',
    badgeLine1: 'BEST',
    badgeLine2: 'SELLER',
    image: '/categories/flowers-real.jpg',
    hoverImage: '/categories/flowers-hover.jpg',
    icon: (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0 transition-transform duration-300 group-hover:rotate-12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3.2" fill="currentColor" />
        <path d="M12 3a2.5 2.5 0 0 0-2.5 2.5c0 1.5 2.5 3.5 2.5 3.5s2.5-2 2.5-3.5A2.5 2.5 0 0 0 12 3z" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 21a2.5 2.5 0 0 0 2.5-2.5c0-1.5-2.5-3.5-2.5-3.5s-2.5 2-2.5 3.5A2.5 2.5 0 0 0 12 21z" fill="currentColor" fillOpacity="0.2" />
        <path d="M3 12a2.5 2.5 0 0 0 2.5 2.5c1.5 0 3.5-2.5 3.5-2.5s-2-2.5-3.5-2.5A2.5 2.5 0 0 0 3 12z" fill="currentColor" fillOpacity="0.2" />
        <path d="M21 12a2.5 2.5 0 0 0-2.5-2.5c-1.5 0-3.5 2.5-3.5 2.5s2 2.5 3.5 2.5A2.5 2.5 0 0 0 21 12z" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
  },
  {
    id: 'flower-pots',
    buttonLabel: 'FLOWER POTS',
    badgeLine1: 'HAND',
    badgeLine2: 'MADE',
    image: '/categories/flower-pots-real.jpg',
    hoverImage: '/categories/flower-pots-hover.jpg',
    icon: (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 6 11 L 18 11 L 16.5 21 L 7.5 21 Z" fill="currentColor" fillOpacity="0.2" />
        <line x1="5" y1="11" x2="19" y2="11" strokeWidth="2.8" />
        <path d="M 12 11 C 12 7, 7 6, 7 3 C 11 3, 12 6, 12 11" fill="currentColor" fillOpacity="0.25" />
        <path d="M 12 11 C 12 7, 17 6, 17 3 C 13 3, 12 6, 12 11" fill="currentColor" fillOpacity="0.25" />
      </svg>
    ),
  },
  {
    id: 'plushies',
    buttonLabel: 'PLUSHIES',
    badgeLine1: 'SO',
    badgeLine2: 'CUTE',
    image: '/categories/plushies-real.jpg',
    hoverImage: '/categories/plushies-hover.jpg',
    icon: (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0 transition-transform duration-300 group-hover:scale-115"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="6.5" cy="7.5" r="3" fill="currentColor" fillOpacity="0.25" />
        <circle cx="17.5" cy="7.5" r="3" fill="currentColor" fillOpacity="0.25" />
        <circle cx="12" cy="14" r="7.5" fill="currentColor" fillOpacity="0.15" />
        <circle cx="9.5" cy="13" r="1" fill="currentColor" />
        <circle cx="14.5" cy="13" r="1" fill="currentColor" />
        <path d="M 10.8 15.5 Q 12 16.8 13.2 15.5" />
      </svg>
    ),
  },
  {
    id: 'bags',
    buttonLabel: 'BAGS & TOTES',
    badgeLine1: 'TOP',
    badgeLine2: 'TREND',
    image: '/categories/bags-real.jpg',
    hoverImage: '/categories/bags-hover.jpg',
    icon: (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0 transition-transform duration-300 group-hover:rotate-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="9" width="16" height="12" rx="3" fill="currentColor" fillOpacity="0.2" />
        <path d="M 8 9 V 5 A 4 4 0 0 1 16 5 V 9" strokeWidth="2.4" />
        <path d="M 12 13 V 17 M 10 15 H 14" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'keychains',
    buttonLabel: 'KEYCHAINS',
    badgeLine1: 'HOT',
    badgeLine2: 'PICK',
    image: '/categories/keychains-real.jpg',
    hoverImage: '/categories/keychains-hover.jpg',
    icon: (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0 transition-transform duration-300 group-hover:rotate-12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="8" r="4.5" fill="currentColor" fillOpacity="0.2" />
        <path d="M 12.5 11.5 L 16 15" strokeWidth="2.4" />
        <circle cx="18" cy="17" r="3.5" fill="currentColor" fillOpacity="0.25" />
        <path d="M 18 15.5 V 18.5 M 16.5 17 H 19.5" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    id: 'home-decor',
    buttonLabel: 'HOME DECOR',
    badgeLine1: 'COZY',
    badgeLine2: 'VIBES',
    image: '/categories/home-decor-real.jpg',
    hoverImage: '/categories/home-decor-hover.jpg',
    icon: (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0 transition-transform duration-300 group-hover:scale-115"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 3 13 C 3 6, 21 6, 21 13 Z" fill="currentColor" fillOpacity="0.25" />
        <path d="M 7 13 L 7 19 A 2 2 0 0 0 9 21 L 15 21 A 2 2 0 0 0 17 19 L 17 13" fill="currentColor" fillOpacity="0.15" />
        <path d="M 10 21 V 16.5 A 2 2 0 0 1 14 16.5 V 21" strokeWidth="2" />
        <circle cx="8" cy="9.5" r="1" fill="currentColor" />
        <circle cx="15.5" cy="9.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

interface CategoriesSectionProps {
  onCategorySelect?: (categoryId: string) => void;
  onShopAllClick?: () => void;
}

// Scalloped Cloud Boundary Paths (1440w)
const TOP_CLOUD_FILL =
  'M 0 60 L 0 35 C 32.5 7.0, 97.5 7.0, 130.0 35.0 C 157.5 12.0, 212.5 12.0, 240.0 35.0 C 277.5 7.0, 352.5 7.0, 390.0 35.0 C 420.0 12.0, 480.0 12.0, 510.0 35.0 C 545.0 7.0, 615.0 7.0, 650.0 35.0 C 682.5 12.0, 747.5 12.0, 780.0 35.0 C 810.0 7.0, 870.0 7.0, 900.0 35.0 C 937.5 12.0, 1012.5 12.0, 1050.0 35.0 C 1077.5 7.0, 1132.5 7.0, 1160.0 35.0 C 1195.0 12.0, 1265.0 12.0, 1300.0 35.0 C 1335.0 7.0, 1405.0 7.0, 1440.0 35.0 L 1440 60 Z';
const TOP_CLOUD_STROKE =
  'M 0 35 C 32.5 7.0, 97.5 7.0, 130.0 35.0 C 157.5 12.0, 212.5 12.0, 240.0 35.0 C 277.5 7.0, 352.5 7.0, 390.0 35.0 C 420.0 12.0, 480.0 12.0, 510.0 35.0 C 545.0 7.0, 615.0 7.0, 650.0 35.0 C 682.5 12.0, 747.5 12.0, 780.0 35.0 C 810.0 7.0, 870.0 7.0, 900.0 35.0 C 937.5 12.0, 1012.5 12.0, 1050.0 35.0 C 1077.5 7.0, 1132.5 7.0, 1160.0 35.0 C 1195.0 12.0, 1265.0 12.0, 1300.0 35.0 C 1335.0 7.0, 1405.0 7.0, 1440.0 35.0';

const BOT_CLOUD_FILL =
  'M 0 0 L 0 25 C 32.5 53.0, 97.5 53.0, 130.0 25.0 C 157.5 48.0, 212.5 48.0, 240.0 25.0 C 277.5 53.0, 352.5 53.0, 390.0 25.0 C 420.0 48.0, 480.0 48.0, 510.0 25.0 C 545.0 53.0, 615.0 53.0, 650.0 25.0 C 682.5 48.0, 747.5 48.0, 780.0 25.0 C 810.0 53.0, 870.0 53.0, 900.0 25.0 C 937.5 48.0, 1012.5 48.0, 1050.0 25.0 C 1077.5 53.0, 1132.5 53.0, 1160.0 25.0 C 1195.0 48.0, 1265.0 48.0, 1300.0 25.0 C 1335.0 53.0, 1405.0 53.0, 1440.0 25.0 L 1440 0 Z';
const BOT_CLOUD_STROKE =
  'M 0 25 C 32.5 53.0, 97.5 53.0, 130.0 25.0 C 157.5 48.0, 212.5 48.0, 240.0 25.0 C 277.5 53.0, 352.5 53.0, 390.0 25.0 C 420.0 48.0, 480.0 48.0, 510.0 25.0 C 545.0 53.0, 615.0 53.0, 650.0 25.0 C 682.5 48.0, 747.5 48.0, 780.0 25.0 C 810.0 53.0, 870.0 53.0, 900.0 25.0 C 937.5 48.0, 1012.5 48.0, 1050.0 25.0 C 1077.5 53.0, 1132.5 53.0, 1160.0 25.0 C 1195.0 48.0, 1265.0 48.0, 1300.0 25.0 C 1335.0 53.0, 1405.0 53.0, 1440.0 25.0';

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onCategorySelect,
  onShopAllClick,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState<number>(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        const progress = scrollLeft / maxScroll;
        setActiveDot(Math.min(Math.max(0, Math.round(progress * 2)), 2));
      }
    }
  };

  return (
    <div className="w-full relative mt-3 sm:mt-5">
      {/* 1. Top Puffy Cloud Scalloped Border with Clean Maroon Stroke */}
      <div className="w-full overflow-hidden leading-none -mb-[1px]">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-9 sm:h-12 md:h-14 block"
          aria-hidden="true"
        >
          <path d={TOP_CLOUD_FILL} fill="#D4EFF4" />
          <path
            d={TOP_CLOUD_STROKE}
            fill="none"
            stroke="#641623"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 2. Main Cloud Body in Theme's Pastel Blue (#D4EFF4) */}
      <section className="w-full bg-[#D4EFF4] py-3 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        {/* Perfectly proportioned container: max-w-[1040px] creates ideal card dimensions */}
        <div className="w-full max-w-[1040px] mx-auto">
          {/* Header with Mascots on both sides */}
          <div className="flex items-center justify-center gap-2 sm:gap-5 md:gap-6 mb-5 sm:mb-8 text-center">
            {/* Left Mascot GIF */}
            <img
              src="/knotsnco_mascot_transparent.gif"
              alt="knotsnco mascot"
              className="w-8 h-8 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain drop-shadow-sm select-none flex-shrink-0"
            />

            {/* Center Heading with Whimsical Radiant Dashes */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 text-center">
              {/* Left Radiant Dashes */}
              <svg
                className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#641623] flex-shrink-0"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              >
                <line x1="12" y1="16" x2="3" y2="16" />
                <line x1="14" y1="9" x2="6" y2="5" />
                <line x1="14" y1="23" x2="6" y2="27" />
              </svg>

              {/* Heading in Exact Case & Font */}
              <h2 className="font-['Fredoka'] font-bold text-xl sm:text-3xl md:text-4xl lg:text-[42px] text-[#641623] lowercase tracking-tight whitespace-nowrap">
                shop by category
              </h2>

              {/* Right Radiant Dashes */}
              <svg
                className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#641623] flex-shrink-0"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              >
                <line x1="20" y1="16" x2="29" y2="16" />
                <line x1="18" y1="9" x2="26" y2="5" />
                <line x1="18" y1="23" x2="26" y2="27" />
              </svg>
            </div>

            {/* Right Mascot GIF */}
            <img
              src="/knotsnco_mascot_transparent.gif"
              alt="knotsnco mascot"
              className="w-8 h-8 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain drop-shadow-sm select-none flex-shrink-0"
            />
          </div>

          {/* Mobile Horizontal Carousel (< lg) & Desktop 3x2 Grid (>= lg) */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-7 overflow-x-auto lg:overflow-visible pb-3 pt-1 px-1 no-scrollbar snap-x snap-mandatory"
          >
            {CATEGORIES.map((cat) => {
              const isHovered = hoveredCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  title={cat.buttonLabel}
                  onClick={() => onCategorySelect?.(cat.id)}
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="group flex-shrink-0 w-[152px] sm:w-[200px] lg:w-auto snap-center cursor-pointer flex flex-col items-center"
                >
                  {/* 1. Perfect Square Aspect Ratio Image Box with Crisp Maroon Border & Hover Crossfade */}
                  <div className="relative w-full aspect-square rounded-[18px] sm:rounded-[28px] overflow-hidden border-[1.8px] sm:border-[2.2px] border-[#641623] bg-white shadow-[0_4px_14px_rgba(100,22,35,0.06)] group-hover:shadow-[0_12px_28px_rgba(100,22,35,0.14)] transition-all duration-300 group-hover:-translate-y-1">
                    {/* Default Image */}
                    <img
                      src={cat.image}
                      alt={cat.buttonLabel}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out select-none ${
                        isHovered ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
                      }`}
                      loading="lazy"
                    />

                    {/* Secondary Alternate / Lifestyle Image (Fades In on Hover) */}
                    <img
                      src={cat.hoverImage}
                      alt={`${cat.buttonLabel} alternate view`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out select-none ${
                        isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      loading="lazy"
                    />

                    {/* Mint Green Scalloped Daisy Flower Badge in Top Right */}
                    <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-20 pointer-events-none drop-shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <svg viewBox="0 0 50 50" className="w-6 h-6 sm:w-9 sm:h-9">
                        {/* 5 Petal Lobes */}
                        <g fill="#7FE5BD" stroke="#641623" strokeWidth="2.2">
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
                          fill="#641623"
                          fontFamily="Fredoka, sans-serif"
                          letterSpacing="0.02em"
                        >
                          {cat.badgeLine1}
                        </text>
                        <text
                          x="25"
                          y="30.5"
                          textAnchor="middle"
                          fontSize="6.5"
                          fontWeight="800"
                          fill="#641623"
                          fontFamily="Fredoka, sans-serif"
                          letterSpacing="0.02em"
                        >
                          {cat.badgeLine2}
                        </text>
                      </svg>
                    </div>
                  </div>

                  {/* 2. Sleek 3D Offset Pill Button Matching the Card Width */}
                  <div className="w-full mt-2 sm:mt-3.5 flex justify-center">
                    <div className="w-full py-1.5 sm:py-3 px-1.5 sm:px-5 rounded-full bg-[#F7BE44] border-[1.8px] sm:border-[2.2px] border-[#641623] shadow-[0_3px_0_0_#641623] sm:shadow-[0_6px_0_0_#641623] flex items-center justify-center gap-1 sm:gap-2.5 text-center font-['Fredoka'] font-black tracking-wide sm:tracking-wider text-[10px] sm:text-sm md:text-[15px] text-[#641623] uppercase transition-all duration-200 group-hover:translate-y-[2px] group-hover:shadow-[0_4px_0_0_#641623] active:translate-y-1 active:shadow-[0_1px_0_0_#641623] select-none">
                      <span className="scale-75 sm:scale-100 flex-shrink-0">{cat.icon}</span>
                      <span className="leading-tight pt-0.5 truncate">{cat.buttonLabel}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Pagination Indicator Dots */}
          <div className="flex lg:hidden items-center justify-center gap-2 mt-3">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollRef.current) {
                    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                    scrollRef.current.scrollTo({
                      left: (maxScroll / 2) * idx,
                      behavior: 'smooth',
                    });
                  }
                  setActiveDot(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeDot === idx
                    ? 'bg-[#641623] scale-110'
                    : 'border-2 border-[#641623]/40 bg-transparent'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Bottom Call to Action: Shop All Collections & Cute Mascot Doodle */}
          <div className="relative mt-8 sm:mt-10 flex flex-col items-center justify-center">
            <button
              onClick={onShopAllClick}
              className="group inline-flex flex-col items-center text-center cursor-pointer focus:outline-none"
            >
              <span className="font-['Fredoka'] font-bold text-sm sm:text-base md:text-lg text-[#641623] hover:opacity-80 transition-opacity flex items-center gap-1.5">
                <span>Shop All Collections</span>
                <span className="text-xs transition-transform group-hover:translate-x-1">▶</span>
              </span>

              {/* Cute Terracotta Wavy Squiggle Underline */}
              <svg
                viewBox="0 0 100 12"
                className="w-24 sm:w-28 h-3 text-[#D96B43] mt-1 overflow-visible"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              >
                <path d="M 4 6 Q 16 0 28 6 T 52 6 T 76 6 T 96 6" />
              </svg>
            </button>

            {/* Cute Whimsical Flower / Sparkle Accent in Bottom Right */}
            <div className="absolute right-2 sm:right-6 bottom-0 pointer-events-none hidden sm:flex items-center gap-1 text-[#641623]/60">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-[#641623]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" fill="#F7BE44" stroke="#641623" />
                <path d="M12 3a2 2 0 0 0-2 2v2a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2z" fill="#FFFDF9" stroke="#641623" />
                <path d="M12 17a2 2 0 0 0-2 2v2a2 2 0 0 0 4 0v-2a2 2 0 0 0-2-2z" fill="#FFFDF9" stroke="#641623" />
                <path d="M3 12a2 2 0 0 0 2-2h2a2 2 0 0 0 0 4H5a2 2 0 0 0-2-2z" fill="#FFFDF9" stroke="#641623" />
                <path d="M17 12a2 2 0 0 0 2-2h2a2 2 0 0 0 0 4h-2a2 2 0 0 0-2-2z" fill="#FFFDF9" stroke="#641623" />
              </svg>
              <span className="text-xs text-[#D96B43]">✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bottom Puffy Cloud Scalloped Border with Clean Maroon Stroke */}
      <div className="w-full overflow-hidden leading-none -mt-[1px]">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-9 sm:h-12 md:h-14 block"
          aria-hidden="true"
        >
          <path d={BOT_CLOUD_FILL} fill="#D4EFF4" />
          <path
            d={BOT_CLOUD_STROKE}
            fill="none"
            stroke="#641623"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
