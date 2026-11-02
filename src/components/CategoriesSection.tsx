import React, { useState } from 'react';

interface CategoryItem {
  id: string;
  name: string;
  badgeLine1: string;
  badgeLine2: string;
  tagline: string;
  image: string;
  hoverImage: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'flowers',
    name: 'Crochet Flowers & Bouquets',
    badgeLine1: 'BEST',
    badgeLine2: 'SELLER',
    tagline: 'everlasting blooms that never fade',
    image: '/categories/flowers-real.jpg',
    hoverImage: '/categories/flowers-hover.jpg',
  },
  {
    id: 'flower-pots',
    name: 'Handcrafted Flower Pots',
    badgeLine1: 'HAND',
    badgeLine2: 'MADE',
    tagline: 'charming desk & windowsill daisies',
    image: '/categories/flower-pots-real.jpg',
    hoverImage: '/categories/flower-pots-hover.jpg',
  },
  {
    id: 'plushies',
    name: 'Cute Amigurumi Plushies',
    badgeLine1: 'SO',
    badgeLine2: 'CUTE',
    tagline: 'ultra-soft hand-knitted companions',
    image: '/categories/plushies-real.jpg',
    hoverImage: '/categories/plushies-hover.jpg',
  },
  {
    id: 'bags',
    name: 'Bags & Woven Totes',
    badgeLine1: 'TOP',
    badgeLine2: 'TREND',
    tagline: 'handwoven granny square tote bags',
    image: '/categories/bags-real.jpg',
    hoverImage: '/categories/bags-hover.jpg',
  },
  {
    id: 'keychains',
    name: 'Keychains & Bag Charms',
    badgeLine1: 'HOT',
    badgeLine2: 'PICK',
    tagline: 'adorable everyday pocket companions',
    image: '/categories/keychains-real.jpg',
    hoverImage: '/categories/keychains-hover.jpg',
  },
  {
    id: 'home-decor',
    name: 'Whimsical Home Decor',
    badgeLine1: 'COZY',
    badgeLine2: 'VIBES',
    tagline: 'cottagecore accents & fairy houses',
    image: '/categories/home-decor-real.jpg',
    hoverImage: '/categories/home-decor-hover.jpg',
  },
];

interface CategoriesSectionProps {
  onCategorySelect?: (categoryId: string) => void;
  onShopAllClick?: () => void;
  initialHoveredId?: string | null;
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
  initialHoveredId = null,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(initialHoveredId);

  return (
    <div className="w-full relative mt-4 sm:mt-6">
      {/* 1. Top Puffy Cloud Scalloped Border with Clean Maroon Stroke */}
      <div className="w-full overflow-hidden leading-none -mb-[1px]">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14 md:h-16 block"
          aria-hidden="true"
        >
          {/* Cloud Fill */}
          <path d={TOP_CLOUD_FILL} fill="#D4EFF4" />
          {/* Scalloped Contour Outline */}
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
      <section className="w-full bg-[#D4EFF4] py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1300px] mx-auto">
          {/* Exact Heading with Whimsical Radiant Dashes: \ | /  shop by category  / | \ */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-8 sm:mb-12 text-center">
            {/* Left Radiant Dashes */}
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-[#641623] flex-shrink-0"
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
            <h2 className="font-['Fredoka'] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#641623] lowercase tracking-tight">
              shop by category
            </h2>

            {/* Right Radiant Dashes */}
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-[#641623] flex-shrink-0"
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

          {/* 3 On Top, 3 Below Grid (3x2 on desktop, 2x3 on tablet, 1x6 on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {CATEGORIES.map((cat) => {
              const isHovered = hoveredCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  title={cat.name}
                  onClick={() => onCategorySelect?.(cat.id)}
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="group cursor-pointer flex flex-col items-start transition-all duration-300"
                >
                  {/* 1. Tall Rounded Image Box with Crisp Dark Border & Smooth Crossfade */}
                  <div className="relative w-full aspect-[4/4.7] rounded-[28px] sm:rounded-[32px] overflow-hidden border-[2px] sm:border-[2.4px] border-[#2D2424] bg-white shadow-[0_8px_24px_rgba(45,36,36,0.08)] group-hover:shadow-[0_18px_36px_rgba(45,36,36,0.16)] transition-all duration-300 group-hover:-translate-y-1.5">
                    {/* Default Image */}
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out select-none ${
                        isHovered ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
                      }`}
                      loading="lazy"
                    />

                    {/* Secondary Alternate / Lifestyle Image (Fades In on Hover) */}
                    <img
                      src={cat.hoverImage}
                      alt={`${cat.name} alternate view`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out select-none ${
                        isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      loading="lazy"
                    />

                    {/* Mint Green Scalloped Daisy Flower Badge in Top Right */}
                    <div className="absolute top-3 right-3 z-20 pointer-events-none drop-shadow-sm transition-transform duration-300 group-hover:scale-105">
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
                          {cat.badgeLine1}
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
                          {cat.badgeLine2}
                        </text>
                      </svg>
                    </div>

                    {/* Slide-Up Pill Button ("EXPLORE COLLECTION →") on Hover */}
                    <div className="absolute bottom-3.5 sm:bottom-4 left-0 right-0 z-20 flex items-center justify-center px-4">
                      <button
                        className={`w-[85%] py-2.5 px-4 bg-[#2D2424] text-white font-['Fredoka'] font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-lg transition-all duration-300 ease-out hover:bg-[#641623] hover:scale-102 active:scale-95 cursor-pointer text-center ${
                          isHovered
                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                        }`}
                      >
                        EXPLORE NOW →
                      </button>
                    </div>
                  </div>

                  {/* 2. Category Information Below Image (Clean & Left-Aligned) */}
                  <div className="w-full mt-3.5 px-1.5 flex items-center justify-between">
                    <div>
                      <h3 className="font-['Fredoka'] font-bold text-base sm:text-lg md:text-xl text-[#2D2424] leading-snug group-hover:text-[#641623] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="font-['Fredoka'] font-medium text-xs sm:text-sm text-[#2D2424]/70 mt-0.5">
                        {cat.tagline}
                      </p>
                    </div>

                    {/* Arrow Pill Indicator */}
                    <div className="w-8 h-8 rounded-full border-[1.8px] border-[#2D2424] bg-white flex items-center justify-center text-[#2D2424] group-hover:bg-[#2D2424] group-hover:text-white transition-all shadow-sm flex-shrink-0 ml-2">
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Call to Action: Shop All Collections & Cute Mascot Doodle */}
          <div className="relative mt-10 sm:mt-14 flex flex-col items-center justify-center">
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
            <div className="absolute right-4 sm:right-12 bottom-0 pointer-events-none hidden sm:flex items-center gap-1 text-[#641623]/60">
              {/* Little Daisy Accent */}
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8 text-[#641623]"
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
              {/* Tiny Sparkles */}
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
          className="w-full h-10 sm:h-14 md:h-16 block"
          aria-hidden="true"
        >
          {/* Cloud Fill */}
          <path d={BOT_CLOUD_FILL} fill="#D4EFF4" />
          {/* Scalloped Contour Outline */}
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
