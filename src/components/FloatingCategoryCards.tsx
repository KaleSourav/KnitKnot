import React from 'react';

interface CategoryCard {
  id: string;
  category: string;
  title: string;
  price: string;
  image: string;
  badge: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: 'bags',
    category: 'Bags & Totes',
    title: 'Daisy Checkered Crochet Tote',
    price: '₹1,499.00',
    image: '/products/tote.jpg',
    badge: 'Bags & Totes',
  },
  {
    id: 'flower-pots',
    category: 'Flower Pots',
    title: 'Potted Meadow Tulips',
    price: '₹999.00',
    image: '/products/tulips.jpg',
    badge: 'Flower Pots',
  },
  {
    id: 'keychains',
    category: 'Keychains & Plushies',
    title: 'Amigurumi Honey Bunny',
    price: '₹699.00',
    image: '/products/bunny.jpg',
    badge: 'Plushies',
  },
  {
    id: 'wearables',
    category: 'Wearables & Knits',
    title: 'Artisan Patchwork Cardigan',
    price: '₹2,899.00',
    image: '/products/cardigan.jpg',
    badge: 'Wearables',
  },
];

export const FloatingCategoryCards: React.FC = () => {
  const handleCardClick = (card: CategoryCard) => {
    if (typeof (window as any).handleAddToCart === 'function') {
      (window as any).handleAddToCart(card.title);
    }
  };

  return (
    <section
      className="relative w-full py-16 sm:py-24 lg:py-28 bg-[#FFFFFF] overflow-hidden select-none"
      id="categories"
    >
      {/* Decorative ambient subtle background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(77, 106, 16, 0.04) 0%, rgba(250, 248, 242, 0.01) 70%, transparent 100%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ========================================================= */}
          {/* COLUMN 1 (LEFT): TALL FLOATING CARD (OFFSET VERTICALLY)  */}
          {/* ========================================================= */}
          <div className="md:col-span-4 md:pt-14 lg:pt-20 flex justify-center">
            <div
              onClick={() => handleCardClick(CATEGORIES[0])}
              className="group relative w-full max-w-[340px] lg:max-w-[370px] h-[450px] lg:h-[490px] rounded-[32px] lg:rounded-[36px] overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.10)] hover:shadow-[0_28px_60px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out cursor-pointer hover:-translate-y-2 bg-[#eae7dc]"
              style={{
                animation: 'driftFloatA 7s ease-in-out infinite alternate',
              }}
            >
              {/* Category Badge */}
              <div className="absolute top-4 sm:top-5 left-4 sm:left-5 z-20">
                <span className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide bg-white/75 backdrop-blur-md text-[#222a0e] border border-white/60 shadow-sm">
                  {CATEGORIES[0].badge}
                </span>
              </div>

              {/* Product Artwork */}
              <img
                src={CATEGORIES[0].image}
                alt={CATEGORIES[0].title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Frosted Glassmorphic Capsule Pill */}
              <div className="absolute bottom-5 inset-x-5 z-20 flex items-center justify-between px-5 py-2.5 rounded-full bg-white/70 group-hover:bg-white/85 backdrop-blur-xl border border-white/70 shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition-all duration-300">
                <span className="text-[15px] sm:text-[16px] font-semibold text-[#181c0f] tracking-tight">
                  {CATEGORIES[0].price}
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b1e15] group-hover:bg-[#4d6a10] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md flex-shrink-0 ml-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 2 (CENTER): 2 STACKED FLOATING CARDS              */}
          {/* ========================================================= */}
          <div className="md:col-span-4 flex flex-col gap-6 lg:gap-7 items-center">
            {/* Center Top Card (Landscape / Square) */}
            <div
              onClick={() => handleCardClick(CATEGORIES[1])}
              className="group relative w-full max-w-[340px] lg:max-w-[370px] h-[270px] lg:h-[295px] rounded-[30px] lg:rounded-[34px] overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.10)] hover:shadow-[0_28px_60px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out cursor-pointer hover:-translate-y-2 bg-[#eae7dc]"
              style={{
                animation: 'driftFloatB 8s ease-in-out infinite alternate',
              }}
            >
              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-white/75 backdrop-blur-md text-[#222a0e] border border-white/60 shadow-sm">
                  {CATEGORIES[1].badge}
                </span>
              </div>

              {/* Product Artwork */}
              <img
                src={CATEGORIES[1].image}
                alt={CATEGORIES[1].title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Frosted Glassmorphic Capsule Pill */}
              <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between px-5 py-2.5 rounded-full bg-white/70 group-hover:bg-white/85 backdrop-blur-xl border border-white/70 shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition-all duration-300">
                <span className="text-[15px] sm:text-[16px] font-semibold text-[#181c0f] tracking-tight">
                  {CATEGORIES[1].price}
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b1e15] group-hover:bg-[#4d6a10] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md flex-shrink-0 ml-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </span>
              </div>
            </div>

            {/* Center Bottom Card (Square / Landscape) */}
            <div
              onClick={() => handleCardClick(CATEGORIES[2])}
              className="group relative w-full max-w-[340px] lg:max-w-[370px] h-[240px] lg:h-[265px] rounded-[30px] lg:rounded-[34px] overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.10)] hover:shadow-[0_28px_60px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out cursor-pointer hover:-translate-y-2 bg-[#eae7dc]"
              style={{
                animation: 'driftFloatA 7.5s ease-in-out 1s infinite alternate',
              }}
            >
              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-white/75 backdrop-blur-md text-[#222a0e] border border-white/60 shadow-sm">
                  {CATEGORIES[2].badge}
                </span>
              </div>

              {/* Product Artwork */}
              <img
                src={CATEGORIES[2].image}
                alt={CATEGORIES[2].title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Frosted Glassmorphic Capsule Pill */}
              <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between px-5 py-2.5 rounded-full bg-white/70 group-hover:bg-white/85 backdrop-blur-xl border border-white/70 shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition-all duration-300">
                <span className="text-[15px] sm:text-[16px] font-semibold text-[#181c0f] tracking-tight">
                  {CATEGORIES[2].price}
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b1e15] group-hover:bg-[#4d6a10] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md flex-shrink-0 ml-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 3 (RIGHT): HEADER TEXT BLOCK + TALL CARD          */}
          {/* ========================================================= */}
          <div className="md:col-span-4 flex flex-col items-start w-full">
            {/* Header Text Block matching reference */}
            <div className="w-full pt-1 pb-6 lg:pb-8 pl-1 sm:pl-3">
              <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-[#4d6a10] mb-2.5">
                Our Categories
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal leading-[1.14] tracking-[-0.03em] text-[#181b10] mb-3">
                Top Product Of<br />The Month
              </h2>
              <p className="text-xs sm:text-[13.5px] leading-relaxed text-[#555a48] font-normal max-w-xs">
                Handcrafted with 100% organic milk cotton yarn, each piece is thoughtfully stitched to bring warmth, mindful joy, and lasting memories.
              </p>
            </div>

            {/* Right Tall Card */}
            <div className="w-full flex justify-center md:justify-start">
              <div
                onClick={() => handleCardClick(CATEGORIES[3])}
                className="group relative w-full max-w-[340px] lg:max-w-[370px] h-[430px] lg:h-[470px] rounded-[32px] lg:rounded-[36px] overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.10)] hover:shadow-[0_28px_60px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out cursor-pointer hover:-translate-y-2 bg-[#eae7dc]"
                style={{
                  animation: 'driftFloatB 7s ease-in-out 0.5s infinite alternate',
                }}
              >
                {/* Category Badge */}
                <div className="absolute top-4 sm:top-5 left-4 sm:left-5 z-20">
                  <span className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide bg-white/75 backdrop-blur-md text-[#222a0e] border border-white/60 shadow-sm">
                    {CATEGORIES[3].badge}
                  </span>
                </div>

                {/* Product Artwork */}
                <img
                  src={CATEGORIES[3].image}
                  alt={CATEGORIES[3].title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Frosted Glassmorphic Capsule Pill */}
                <div className="absolute bottom-5 inset-x-5 z-20 flex items-center justify-between px-5 py-2.5 rounded-full bg-white/70 group-hover:bg-white/85 backdrop-blur-xl border border-white/70 shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition-all duration-300">
                  <span className="text-[15px] sm:text-[16px] font-semibold text-[#181c0f] tracking-tight">
                    {CATEGORIES[3].price}
                  </span>
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b1e15] group-hover:bg-[#4d6a10] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md flex-shrink-0 ml-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes driftFloatA {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-8px); }
        }
        @keyframes driftFloatB {
          0% { transform: translateY(0px); }
          100% { transform: translateY(8px); }
        }
      `}</style>
    </section>
  );
};

export default FloatingCategoryCards;
