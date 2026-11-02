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
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onCategorySelect,
}) => {
  return (
    <section className="w-full bg-[#FAF4ED] pt-2 sm:pt-4 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1440px] mx-auto">
        {/* Exact Heading with Whimsical Radiant Dashes: \ | /  shop by category  / | \ */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-6 sm:mb-9 text-center">
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
          <h2 className="font-['Fredoka'] font-bold text-3xl sm:text-4xl md:text-5xl text-[#641623] lowercase tracking-tight">
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
      </div>
    </section>
  );
};
