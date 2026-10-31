import React, { useState } from 'react';

interface CategoryItem {
  id: string;
  tag: string;
  badge: string;
  eyebrow: string;
  title: string;
  desc: string;
  price: string;
  image: string;
  colSpan: string;
  height: string;
  href: string;
  pillLabel: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'flowers',
    tag: 'Flowers',
    badge: 'Most Loved • Signature Craft',
    eyebrow: 'Everlasting Botanicals',
    title: 'Flowers & Bouquets',
    desc: 'Blush roses, royal blue velvets & spring tulips hand-crocheted to never wilt, droop, or fade.',
    price: 'From ₹1,399',
    image: '/bloom/hero-sky-bouquet.jpg',
    colSpan: 'md:col-span-7',
    height: 'h-[440px] sm:h-[480px]',
    href: '#stats',
    pillLabel: 'Shop Bouquets',
  },
  {
    id: 'bags',
    tag: 'Bags',
    badge: 'Trending Streetwear',
    eyebrow: 'Handwoven Carryalls',
    title: 'Bags & Totes',
    desc: 'Artisan sunflower checkered totes, slouchy shoulder bags & durable everyday woven pouches.',
    price: 'From ₹1,499',
    image: '/products/tote.jpg',
    colSpan: 'md:col-span-5',
    height: 'h-[440px] sm:h-[480px]',
    href: '#bags',
    pillLabel: 'Explore Bags',
  },
  {
    id: 'flower-pots',
    tag: 'Pots',
    badge: 'Home & Desk Decor',
    eyebrow: 'Desk Flora',
    title: 'Flower Pots',
    desc: 'Cheerful potted tulips & daisies anchored in soft ceramic-style pots. Zero watering needed.',
    price: 'From ₹799',
    image: '/products/tulips.jpg',
    colSpan: 'md:col-span-4',
    height: 'h-[380px] sm:h-[420px]',
    href: '#flower-pots',
    pillLabel: 'Discover Pots',
  },
  {
    id: 'keychains',
    tag: 'Plushies',
    badge: 'Cuddly Keepsakes',
    eyebrow: 'Amigurumi Studio',
    title: 'Keychains & Plushies',
    desc: 'Hand-stitched honey bunnies, cuddly amigurumi animals & sacred spiritual deity charms.',
    price: 'From ₹499',
    image: '/products/bunny.jpg',
    colSpan: 'md:col-span-4',
    height: 'h-[380px] sm:h-[420px]',
    href: '#keychains',
    pillLabel: 'View Plushies',
  },
  {
    id: 'accessories',
    tag: 'Accessories',
    badge: 'Artisan Accents',
    eyebrow: 'Wearable Joy',
    title: 'Accessories & Charms',
    desc: 'Floral hairpins, coquette crochet bows, patchwork cardigans & charming bag pendants.',
    price: 'From ₹299',
    image: '/products/accessories.jpg',
    colSpan: 'md:col-span-4',
    height: 'h-[380px] sm:h-[420px]',
    href: '#accessories',
    pillLabel: 'Shop Charms',
  },
  {
    id: 'byob',
    tag: 'BYOB',
    badge: 'Interactive Custom Studio',
    eyebrow: 'Design Your Own',
    title: 'BYOB Studio (Build Your Own Bouquet)',
    desc: 'Hand-pick individual floral stems, select luxury kraft wrap colors, ribbons, and add a personalized wax-sealed gift note.',
    price: 'Stems from ₹149',
    image: '/products/byob.jpg',
    colSpan: 'md:col-span-12',
    height: 'h-[340px] sm:h-[380px]',
    href: '#byob',
    pillLabel: 'Launch BYOB Studio',
  },
];

const FILTER_TABS = [
  { id: 'all', label: 'All Categories' },
  { id: 'flowers', label: 'Bouquets' },
  { id: 'bags', label: 'Bags & Totes' },
  { id: 'flower-pots', label: 'Flower Pots' },
  { id: 'keychains', label: 'Plushies & Charms' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'byob', label: 'BYOB Studio' },
];

export const AllCategoriesShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredCategories =
    activeTab === 'all'
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.id === activeTab);

  const handleCardClick = (item: CategoryItem) => {
    if (typeof (window as any).handleAddToCart === 'function') {
      (window as any).handleAddToCart(`${item.title} Collection`);
    }
  };

  return (
    <section
      className="relative w-full py-16 sm:py-24 lg:py-28 bg-[#FFFFFF] overflow-hidden select-none"
      id="categories"
    >
      {/* Subtle ambient luxury backdrop aura */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(77, 106, 16, 0.035) 0%, rgba(250, 248, 242, 0.01) 70%, transparent 100%)',
          filter: 'blur(120px)',
        }}
      />

      <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* ========================================================= */}
        {/* EDITORIAL HEADER BLOCK                                    */}
        {/* ========================================================= */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase bg-[#4d6a10]/10 text-[#3a520b] border border-[#4d6a10]/20 mb-3.5 shadow-sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m4.93 4.93 4.24 4.24"></path>
              <path d="m14.83 9.17 4.24-4.24"></path>
              <path d="m14.83 14.83 4.24 4.24"></path>
              <path d="m9.17 14.83-4.24 4.24"></path>
              <circle cx="12" cy="12" r="3.5"></circle>
            </svg>
            <span>The Knotsnco Atelier</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-[-0.03em] text-[#161a0d] mb-3">
            Explore All Categories
          </h2>

          <p className="text-sm sm:text-base text-[#525a42] font-normal leading-relaxed">
            Every knot tied by hand, every stitch woven with purpose. Discover our complete handcrafted universe of slow-crafted keepsakes.
          </p>

          {/* Quick Filter Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 mt-6">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#1e2412] text-white shadow-md scale-105'
                      : 'bg-[#f4f2ea] hover:bg-[#eae6da] text-[#444c33] border border-[#e5e1d3]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* LUXURY BENTO GRID (6 CATEGORIES)                          */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-7 items-stretch">
          {filteredCategories.map((cat) => {
            const isWide = cat.id === 'byob';
            return (
              <div
                key={cat.id}
                onClick={() => handleCardClick(cat)}
                className={`group relative ${cat.colSpan} ${cat.height} rounded-[28px] sm:rounded-[34px] overflow-hidden shadow-[0_14px_36px_rgba(0,0,0,0.08)] hover:shadow-[0_26px_56px_rgba(0,0,0,0.16)] transition-all duration-500 ease-out cursor-pointer hover:-translate-y-1.5 bg-[#eae7dc] flex flex-col justify-between`}
              >
                {/* Background Image with Ken Burns Zoom */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                    loading="lazy"
                  />
                  {/* Cinematic Gradient Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: isWide
                        ? 'linear-gradient(to right, rgba(14, 18, 8, 0.88) 0%, rgba(14, 18, 8, 0.6) 50%, rgba(14, 18, 8, 0.2) 100%)'
                        : 'linear-gradient(to top, rgba(12, 16, 6, 0.88) 0%, rgba(12, 16, 6, 0.45) 55%, rgba(12, 16, 6, 0.05) 85%, transparent 100%)',
                    }}
                  />
                </div>

                {/* Top Badge & Price Tag */}
                <div className="relative z-10 p-5 sm:p-6 flex items-start justify-between gap-3">
                  <span className="px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide uppercase bg-black/45 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 shadow-md transition-colors duration-200">
                    {cat.badge}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/85 text-[#1b220d] backdrop-blur-md shadow-sm">
                    {cat.price}
                  </span>
                </div>

                {/* Bottom Content & Frosted Action Capsule */}
                <div className="relative z-10 p-5 sm:p-7 flex flex-col gap-2">
                  <span className="text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-white/80">
                    {cat.eyebrow}
                  </span>
                  
                  <h3 className="text-xl sm:text-2xl lg:text-[26px] font-medium text-white tracking-tight leading-snug drop-shadow-sm">
                    {cat.title}
                  </h3>

                  <p className="text-xs sm:text-[13.5px] text-white/85 font-normal line-clamp-2 max-w-lg leading-relaxed">
                    {cat.desc}
                  </p>

                  {/* Frosted Action Capsule Bar */}
                  <div className="mt-3.5 inline-flex items-center self-start gap-3 px-4 py-2 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-[#181d0e] backdrop-blur-xl border border-white/30 group-hover:border-white shadow-lg transition-all duration-300">
                    <span className="text-xs font-semibold tracking-wide uppercase">
                      {cat.pillLabel}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-white/30 group-hover:bg-[#181d0e] group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* BOTTOM ARTISAN TRUST RIBBON (NO WHITE GAPS)              */}
        {/* ========================================================= */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-[#ece7d8] flex flex-wrap items-center justify-around gap-6 text-[#353d24]">
          <div className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold tracking-tight">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#4d6a10" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>100% Handcrafted by Women Artisans</span>
          </div>

          <div className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold tracking-tight">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#4d6a10" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Blooms that Never Wilt or Fade</span>
          </div>

          <div className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold tracking-tight">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#4d6a10" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            <span>Free Express Delivery Across India</span>
          </div>

          <div className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold tracking-tight">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#4d6a10" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span>Gift-Ready Luxury Keepsake Packaging</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AllCategoriesShowcase;
