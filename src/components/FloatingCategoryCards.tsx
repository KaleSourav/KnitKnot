import React, { useState } from 'react';

interface FloatingCardItem {
  id: string;
  title: string;
  category: string;
  priceUSD: string;
  priceINR: string;
  image: string;
  altImage: string;
}

const CARDS: FloatingCardItem[] = [
  {
    id: 'tote',
    title: 'Pastel Checkered Tote',
    category: 'Handcrafted Totes',
    priceUSD: '$66.00',
    priceINR: '₹1,499.00',
    image: '/floating-cards/ref-card1.jpg',
    altImage: '/products/tote.jpg',
  },
  {
    id: 'knit-bag',
    title: 'Ocean Blue Knit Handbag',
    category: 'Artisan Handbags',
    priceUSD: '$120.00',
    priceINR: '₹2,499.00',
    image: '/floating-cards/ref-card2.jpg',
    altImage: '/products/utility.jpg',
  },
  {
    id: 'accessories',
    title: 'Sunshine Fashion Charms',
    category: 'Streetwear & Charms',
    priceUSD: '$56.00',
    priceINR: '₹899.00',
    image: '/floating-cards/ref-card3.jpg',
    altImage: '/products/bunny.jpg',
  },
  {
    id: 'cardigan',
    title: 'Sunset Tailored Knitwear',
    category: 'Artisan Wearables',
    priceUSD: '$80.00',
    priceINR: '₹1,899.00',
    image: '/floating-cards/ref-card4.jpg',
    altImage: '/products/cardigan.jpg',
  },
];

export const FloatingCategoryCards: React.FC = () => {
  const [activeImageSet, setActiveImageSet] = useState<'ref' | 'crochet'>('ref');

  const handleCardClick = (card: FloatingCardItem) => {
    if (typeof (window as any).handleAddToCart === 'function') {
      (window as any).handleAddToCart(card.title);
    }
  };

  return (
    <section className="relative w-full py-16 sm:py-24 lg:py-28 bg-[#FFFFFF] overflow-hidden select-none" id="categories">
      {/* Decorative subtle ambient backdrop glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(77, 106, 16, 0.04) 0%, rgba(250, 248, 242, 0.01) 70%, transparent 100%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="relative max-w-[1340px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ========================================================= */}
          {/* COLUMN 1 (LEFT): TALL FLOATING CARD (OFFSET VERTICALLY)  */}
          {/* ========================================================= */}
          <div className="md:col-span-4 md:pt-14 lg:pt-20 flex justify-center">
            <div
              onClick={() => handleCardClick(CARDS[0])}
              className="group relative w-full max-w-[340px] lg:max-w-[370px] h-[450px] lg:h-[490px] rounded-[32px] lg:rounded-[36px] overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.11)] hover:shadow-[0_28px_60px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out cursor-pointer hover:-translate-y-2 bg-[#eae7dc]"
              style={{
                animation: 'driftFloatA 7s ease-in-out infinite alternate',
              }}
            >
              <img
                src={activeImageSet === 'ref' ? CARDS[0].image : CARDS[0].altImage}
                alt={CARDS[0].title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Frosted Glassmorphic Capsule Pill */}
              <div className="absolute bottom-5 inset-x-5 z-20 flex items-center justify-between px-5 py-2.5 rounded-full bg-white/60 group-hover:bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition-all duration-300">
                <span className="text-[15px] sm:text-[16px] font-semibold text-[#181c0f] tracking-tight">
                  {CARDS[0].priceUSD}
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b1e15] group-hover:bg-[#2d3815] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md flex-shrink-0">
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
              onClick={() => handleCardClick(CARDS[1])}
              className="group relative w-full max-w-[340px] lg:max-w-[370px] h-[270px] lg:h-[295px] rounded-[30px] lg:rounded-[34px] overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.11)] hover:shadow-[0_28px_60px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out cursor-pointer hover:-translate-y-2 bg-[#eae7dc]"
              style={{
                animation: 'driftFloatB 8s ease-in-out infinite alternate',
              }}
            >
              <img
                src={activeImageSet === 'ref' ? CARDS[1].image : CARDS[1].altImage}
                alt={CARDS[1].title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Frosted Glassmorphic Capsule Pill */}
              <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between px-5 py-2.5 rounded-full bg-white/60 group-hover:bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition-all duration-300">
                <span className="text-[15px] sm:text-[16px] font-semibold text-[#181c0f] tracking-tight">
                  {CARDS[1].priceUSD}
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b1e15] group-hover:bg-[#2d3815] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </span>
              </div>
            </div>

            {/* Center Bottom Card (Square / Landscape) */}
            <div
              onClick={() => handleCardClick(CARDS[2])}
              className="group relative w-full max-w-[340px] lg:max-w-[370px] h-[240px] lg:h-[265px] rounded-[30px] lg:rounded-[34px] overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.11)] hover:shadow-[0_28px_60px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out cursor-pointer hover:-translate-y-2 bg-[#eae7dc]"
              style={{
                animation: 'driftFloatA 7.5s ease-in-out 1s infinite alternate',
              }}
            >
              <img
                src={activeImageSet === 'ref' ? CARDS[2].image : CARDS[2].altImage}
                alt={CARDS[2].title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Frosted Glassmorphic Capsule Pill */}
              <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between px-5 py-2.5 rounded-full bg-white/60 group-hover:bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition-all duration-300">
                <span className="text-[15px] sm:text-[16px] font-semibold text-[#181c0f] tracking-tight">
                  {CARDS[2].priceUSD}
                </span>
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b1e15] group-hover:bg-[#2d3815] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md flex-shrink-0">
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
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.12] tracking-[-0.03em] text-[#181b10] mb-3">
                Top Product Of<br />The Month
              </h2>
              <p className="text-xs sm:text-[13.5px] leading-relaxed text-[#555a48] font-normal max-w-xs mb-3">
                Made from upcycled ocean plastic, this minimalist backpack redefines functional fashion
              </p>
              
              {/* Category selector pill to toggle editorial reference vs crochet studio */}
              <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-[#f3f1ea] border border-[#e5e1d4] mt-1 text-[11px] font-medium text-[#444a36]">
                <button
                  type="button"
                  onClick={() => setActiveImageSet('ref')}
                  className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                    activeImageSet === 'ref'
                      ? 'bg-white text-[#181c0f] shadow-sm font-semibold'
                      : 'hover:text-[#181c0f]'
                  }`}
                >
                  Editorial Style
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageSet('crochet')}
                  className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                    activeImageSet === 'crochet'
                      ? 'bg-white text-[#181c0f] shadow-sm font-semibold'
                      : 'hover:text-[#181c0f]'
                  }`}
                >
                  Crochet Atelier
                </button>
              </div>
            </div>

            {/* Right Tall Card */}
            <div className="w-full flex justify-center md:justify-start">
              <div
                onClick={() => handleCardClick(CARDS[3])}
                className="group relative w-full max-w-[340px] lg:max-w-[370px] h-[430px] lg:h-[470px] rounded-[32px] lg:rounded-[36px] overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.11)] hover:shadow-[0_28px_60px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out cursor-pointer hover:-translate-y-2 bg-[#eae7dc]"
                style={{
                  animation: 'driftFloatB 7s ease-in-out 0.5s infinite alternate',
                }}
              >
                <img
                  src={activeImageSet === 'ref' ? CARDS[3].image : CARDS[3].altImage}
                  alt={CARDS[3].title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Frosted Glassmorphic Capsule Pill */}
                <div className="absolute bottom-5 inset-x-5 z-20 flex items-center justify-between px-5 py-2.5 rounded-full bg-white/60 group-hover:bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition-all duration-300">
                  <span className="text-[15px] sm:text-[16px] font-semibold text-[#181c0f] tracking-tight">
                    {CARDS[3].priceUSD}
                  </span>
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b1e15] group-hover:bg-[#2d3815] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md flex-shrink-0">
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
          100% { transform: translateY(-9px); }
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
