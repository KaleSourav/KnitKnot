import React from 'react';

interface CategoryItem {
  id: string;
  title: string;
  desc: string;
  tag: string;
  image: string;
  href: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'flowers',
    title: 'Flowers & Bouquets',
    desc: 'Everlasting roses, dancing lilies & meadow tulips that never wilt or fade.',
    tag: 'Up To 25% Off',
    image: '/bloom/bouquet-pink-dawn.jpg',
    href: '#flowers',
  },
  {
    id: 'flower-pots',
    title: 'Flower Pots',
    desc: 'Desk-ready potted tulips, cheerful daisies & vibrant desk companions.',
    tag: 'Up To 20% Off',
    image: '/products/tulips.jpg',
    href: '#flower-pots',
  },
  {
    id: 'bags',
    title: 'Bags & Totes',
    desc: 'Handwoven sunflower checkered totes, slouchy shoulder bags & carryalls.',
    tag: 'Up To 30% Off',
    image: '/products/tote.jpg',
    href: '#bags',
  },
  {
    id: 'keychains',
    title: 'Keychains & Charms',
    desc: 'Pocket-sized amigurumi charms, floral tags & everyday bag accessories.',
    tag: 'From ₹299',
    image: '/products/accessories.jpg',
    href: '#keychains',
  },
  {
    id: 'plushies',
    title: 'Plushies & Mascots',
    desc: 'Ultra-soft cuddly amigurumi bunnies, plushie companions & sacred keepsakes.',
    tag: 'Up To 35% Off',
    image: '/products/bunny.jpg',
    href: '#accessories',
  },
  {
    id: 'byob',
    title: 'BYOB Studio',
    desc: 'Build Your Own Bouquet — customize individual stems, wrappers & ribbons.',
    tag: 'Custom Creation',
    image: '/products/byob.jpg',
    href: '#byob',
  },
];

export const OurCategoriesGrid: React.FC = () => {
  const handleCategoryClick = (cat: CategoryItem) => {
    if (typeof (window as any).handleAddToCart === 'function') {
      (window as any).handleAddToCart(`${cat.title} Collection`);
    }
  };

  return (
    <section
      className="relative w-full min-h-screen py-16 sm:py-20 lg:py-28 bg-[#FAF7F2] select-none flex flex-col justify-center"
      id="categories"
    >
      <div className="w-full max-w-[1560px] mx-auto px-5 sm:px-8 lg:px-14">
        
        {/* ========================================================= */}
        {/* HEADER BLOCK (MATCHING THE REFERENCE)                     */}
        {/* ========================================================= */}
        <div className="mb-10 sm:mb-14 max-w-3xl">
          <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#282116] tracking-tight leading-[1.08] mb-3">
            Our Categories
          </h2>
          <p className="text-base sm:text-lg text-[#6E6558] font-normal leading-relaxed">
            Find all your favorite handcrafted crochet items in one place.
          </p>
        </div>

        {/* ========================================================= */}
        {/* 2 ROWS × 3 COLUMNS CATEGORIES GRID                         */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 items-stretch">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="group relative bg-[#FFFFFF] rounded-[26px] sm:rounded-[28px] p-6 sm:p-7 min-h-[240px] sm:min-h-[260px] lg:min-h-[270px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_rgba(40,33,22,0.10)] border border-black/[0.04] transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between"
            >
              {/* Left Content Column */}
              <div className="relative z-10 max-w-[58%] sm:max-w-[60%] flex flex-col items-start pr-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#241c13] tracking-tight leading-snug mb-1.5 group-hover:text-[#4d6a10] transition-colors duration-200">
                  {cat.title}
                </h3>
                
                <p className="text-xs sm:text-[13px] text-[#6E6558] leading-relaxed mb-4 line-clamp-3 font-normal">
                  {cat.desc}
                </p>

                {/* Soft Warm Pill Badge */}
                <span className="inline-block px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F6F0E6] text-[#7A5A36] border border-[#EDE3D4] tracking-tight transition-colors duration-200 group-hover:bg-[#4d6a10]/10 group-hover:text-[#3e560b] group-hover:border-[#4d6a10]/20">
                  {cat.tag}
                </span>
              </div>

              {/* Bottom-Right Emerging Product Artwork */}
              <div className="absolute right-0 bottom-0 w-[46%] sm:w-[48%] h-[82%] sm:h-[86%] pointer-events-none overflow-hidden rounded-tl-[32px]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                  loading="lazy"
                />
                
                {/* Subtle inward blend so photo melds seamlessly into the white card */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: 'inset 4px 4px 16px rgba(0,0,0,0.06)',
                  }}
                />
              </div>

              {/* Subtle interactive hover highlight */}
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-7 h-7 rounded-full bg-[#241c13] text-white flex items-center justify-center shadow-md">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OurCategoriesGrid;
