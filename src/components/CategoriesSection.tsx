import React from 'react';

interface CategoryItem {
  id: string;
  name: string;
  image: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'flowers',
    name: 'flowers',
    image: '/categories/flowers-real.jpg',
  },
  {
    id: 'flower-pots',
    name: 'flower pots',
    image: '/categories/flower-pots-real.jpg',
  },
  {
    id: 'plushies',
    name: 'plushies',
    image: '/categories/plushies-real.jpg',
  },
  {
    id: 'bags',
    name: 'bags',
    image: '/categories/bags-real.jpg',
  },
  {
    id: 'keychains',
    name: 'keychains',
    image: '/categories/keychains-real.jpg',
  },
  {
    id: 'home-decor',
    name: 'home decor',
    image: '/categories/home-decor-real.jpg',
  },
];

interface CategoriesSectionProps {
  onCategorySelect?: (categoryId: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onCategorySelect,
}) => {
  return (
    <section className="w-full bg-[#FAF4ED] py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1440px] mx-auto">
        {/* Section Header with Whimsical Radiant Accents */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10 sm:mb-14 text-center">
          {/* Left Radiant Dashes */}
          <svg
            className="w-7 h-7 sm:w-9 sm:h-9 text-[#641623] flex-shrink-0"
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

          {/* Heading */}
          <h2 className="font-['Fredoka'] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#641623] lowercase tracking-tight">
            shop by category
          </h2>

          {/* Right Radiant Dashes */}
          <svg
            className="w-7 h-7 sm:w-9 sm:h-9 text-[#641623] flex-shrink-0"
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

        {/* 3 On Top, 3 Below Grid (3x2 on desktop/tablet, 2x3 on mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7 lg:gap-10">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onCategorySelect?.(cat.id)}
              className="group relative cursor-pointer overflow-hidden rounded-[28px] sm:rounded-3xl bg-gradient-to-b from-[#FFF6EE] via-[#FDF1E4] to-[#F9EBDC] border border-[#EFE3D3] shadow-[0_4px_24px_rgba(100,22,35,0.04)] hover:shadow-[0_16px_40px_rgba(100,22,35,0.12)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center justify-between p-4 sm:p-7 min-h-[300px] sm:min-h-[380px] md:min-h-[440px]"
            >
              {/* Product Image Area */}
              <div className="w-full flex-1 flex items-center justify-center p-2 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full max-h-[220px] sm:max-h-[290px] md:max-h-[340px] object-contain drop-shadow-[0_12px_24px_rgba(100,22,35,0.09)] group-hover:scale-106 transition-transform duration-300 select-none rounded-2xl"
                  loading="lazy"
                />
              </div>

              {/* Bottom Category Pill Tag */}
              <div className="w-full flex justify-center pt-3 pb-1">
                <span className="inline-flex items-center justify-center bg-[#FFFDF9]/95 backdrop-blur-xs border border-[#EADECC] rounded-full px-6 sm:px-8 py-2 sm:py-2.5 text-[#641623] font-['Fredoka'] font-bold text-sm sm:text-lg md:text-xl lowercase tracking-wide shadow-sm group-hover:bg-[#641623] group-hover:text-white group-hover:border-[#641623] transition-all duration-200">
                  {cat.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
