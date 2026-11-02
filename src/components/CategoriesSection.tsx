import React from 'react';

interface CategoryItem {
  id: string;
  name: string;
  buttonLabel: string;
  image: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'flowers',
    name: 'flowers',
    buttonLabel: 'FLOWERS',
    image: '/categories/flowers-real.jpg',
  },
  {
    id: 'flower-pots',
    name: 'flower pots',
    buttonLabel: 'FLOWER POTS',
    image: '/categories/flower-pots-real.jpg',
  },
  {
    id: 'plushies',
    name: 'plushies',
    buttonLabel: 'PLUSHIES',
    image: '/categories/plushies-real.jpg',
  },
  {
    id: 'bags',
    name: 'bags',
    buttonLabel: 'BAGS & TOTES',
    image: '/categories/bags-real.jpg',
  },
  {
    id: 'keychains',
    name: 'keychains',
    buttonLabel: 'KEYCHAINS',
    image: '/categories/keychains-real.jpg',
  },
  {
    id: 'home-decor',
    name: 'home decor',
    buttonLabel: 'HOME DECOR',
    image: '/categories/home-decor-real.jpg',
  },
];

interface CategoriesSectionProps {
  onCategorySelect?: (categoryId: string) => void;
  onShopAllClick?: () => void;
}

// Scalloped Cloud Boundary Paths (1440w)
const TOP_CLOUD_FILL = "M 0 60 L 0 35 C 32.5 7.0, 97.5 7.0, 130.0 35.0 C 157.5 12.0, 212.5 12.0, 240.0 35.0 C 277.5 7.0, 352.5 7.0, 390.0 35.0 C 420.0 12.0, 480.0 12.0, 510.0 35.0 C 545.0 7.0, 615.0 7.0, 650.0 35.0 C 682.5 12.0, 747.5 12.0, 780.0 35.0 C 810.0 7.0, 870.0 7.0, 900.0 35.0 C 937.5 12.0, 1012.5 12.0, 1050.0 35.0 C 1077.5 7.0, 1132.5 7.0, 1160.0 35.0 C 1195.0 12.0, 1265.0 12.0, 1300.0 35.0 C 1335.0 7.0, 1405.0 7.0, 1440.0 35.0 L 1440 60 Z";
const TOP_CLOUD_STROKE = "M 0 35 C 32.5 7.0, 97.5 7.0, 130.0 35.0 C 157.5 12.0, 212.5 12.0, 240.0 35.0 C 277.5 7.0, 352.5 7.0, 390.0 35.0 C 420.0 12.0, 480.0 12.0, 510.0 35.0 C 545.0 7.0, 615.0 7.0, 650.0 35.0 C 682.5 12.0, 747.5 12.0, 780.0 35.0 C 810.0 7.0, 870.0 7.0, 900.0 35.0 C 937.5 12.0, 1012.5 12.0, 1050.0 35.0 C 1077.5 7.0, 1132.5 7.0, 1160.0 35.0 C 1195.0 12.0, 1265.0 12.0, 1300.0 35.0 C 1335.0 7.0, 1405.0 7.0, 1440.0 35.0";

const BOT_CLOUD_FILL = "M 0 0 L 0 25 C 32.5 53.0, 97.5 53.0, 130.0 25.0 C 157.5 48.0, 212.5 48.0, 240.0 25.0 C 277.5 53.0, 352.5 53.0, 390.0 25.0 C 420.0 48.0, 480.0 48.0, 510.0 25.0 C 545.0 53.0, 615.0 53.0, 650.0 25.0 C 682.5 48.0, 747.5 48.0, 780.0 25.0 C 810.0 53.0, 870.0 53.0, 900.0 25.0 C 937.5 48.0, 1012.5 48.0, 1050.0 25.0 C 1077.5 53.0, 1132.5 53.0, 1160.0 25.0 C 1195.0 48.0, 1265.0 48.0, 1300.0 25.0 C 1335.0 53.0, 1405.0 53.0, 1440.0 25.0 L 1440 0 Z";
const BOT_CLOUD_STROKE = "M 0 25 C 32.5 53.0, 97.5 53.0, 130.0 25.0 C 157.5 48.0, 212.5 48.0, 240.0 25.0 C 277.5 53.0, 352.5 53.0, 390.0 25.0 C 420.0 48.0, 480.0 48.0, 510.0 25.0 C 545.0 53.0, 615.0 53.0, 650.0 25.0 C 682.5 48.0, 747.5 48.0, 780.0 25.0 C 810.0 53.0, 870.0 53.0, 900.0 25.0 C 937.5 48.0, 1012.5 48.0, 1050.0 25.0 C 1077.5 53.0, 1132.5 53.0, 1160.0 25.0 C 1195.0 48.0, 1265.0 48.0, 1300.0 25.0 C 1335.0 53.0, 1405.0 53.0, 1440.0 25.0";

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onCategorySelect,
  onShopAllClick,
}) => {
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
        <div className="w-full max-w-[1440px] mx-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onCategorySelect?.(cat.id)}
                className="group cursor-pointer flex flex-col items-center"
              >
                {/* Picture Window Card Frame */}
                <div className="w-full relative overflow-hidden rounded-[28px] sm:rounded-[34px] border-[2.5px] border-[#641623] bg-[#FDF6EE] shadow-[0_8px_24px_rgba(100,22,35,0.06)] group-hover:shadow-[0_16px_36px_rgba(100,22,35,0.12)] transition-all duration-300">
                  {/* 1:1 Aspect Ratio Image Frame */}
                  <div className="w-full aspect-square overflow-hidden bg-[#FAF1E6] relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 select-none"
                      loading="lazy"
                    />
                    {/* Subtle ambient interior shadow gradient */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-60" />
                  </div>
                </div>

                {/* Retro 3D Offset Pill Button Tag Below Frame */}
                <div className="w-full flex justify-center mt-4 sm:mt-5">
                  <div className="w-full max-w-[280px] sm:max-w-[300px] py-2.5 sm:py-3.5 px-6 rounded-full bg-[#F7BE44] border-[2.5px] border-[#641623] shadow-[0_5px_0_#641623] text-center font-['Fredoka'] font-black tracking-wider text-sm sm:text-base md:text-lg text-[#641623] uppercase transition-all duration-150 group-hover:translate-y-1 group-hover:shadow-[0_1px_0_#641623] select-none">
                    {cat.buttonLabel}
                  </div>
                </div>
              </div>
            ))}
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
