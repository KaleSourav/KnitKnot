import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface CategoryCard {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  tag: string;
  categoryTab: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: 'cat-flowers',
    name: 'Flowers & Blooms',
    subtitle: 'Everlasting Bouquets, Tulips & Lilies',
    image: '/products/bouquet.jpg',
    tag: 'Never Withers',
    categoryTab: 'Flowers',
  },
  {
    id: 'cat-amigurumi',
    name: 'Amigurumi Plushies',
    subtitle: 'Heirloom Bunnies, Chicks & Mini Friends',
    image: '/products/bunny.jpg',
    tag: '100% Hand-Stitched',
    categoryTab: 'Amigurumi',
  },
  {
    id: 'cat-accessories',
    name: 'Artisan Accessories',
    subtitle: 'Granny Square Totes & Coquette Bows',
    image: '/products/tote.jpg',
    tag: 'Slow Fashion',
    categoryTab: 'Accessories',
  },
  {
    id: 'cat-clothing',
    name: 'Handmade Knitwear',
    subtitle: 'Patchwork Cardigans & Crochet Tops',
    image: '/products/cardigan.jpg',
    tag: 'Limited Drops',
    categoryTab: 'Clothing',
  },
  {
    id: 'cat-byob',
    name: 'Build Your Own Bouquet (BYOB)',
    subtitle: 'Custom Florist Studio, Stems & Gift Wrapping',
    image: '/products/byob.jpg',
    tag: 'Custom Creation',
    categoryTab: 'BYOB',
  },
  {
    id: 'cat-utility',
    name: 'Everyday Utility',
    subtitle: 'Blooming Coasters, Mug Sweaters & Cozies',
    image: '/products/utility.jpg',
    tag: 'Cozy Living',
    categoryTab: 'Utility',
  },
];

interface ShopByCategoryProps {
  onSelectCategory: (categoryTab: string) => void;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onSelectCategory }) => {
  return (
    <section 
      id="shop-by-category-section"
      className="w-full bg-white text-black py-20 sm:py-28 px-4 sm:px-6 lg:px-12 select-none relative font-['DM_Sans',sans-serif]"
    >
      <div className="max-w-[1500px] mx-auto">
        {/* SECTION HEADER (MATCHING REFERENCE IMAGE) */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 text-stone-500 text-xs sm:text-sm uppercase tracking-widest font-bold mb-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Curated Artisan Collections</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-black font-['DM_Sans',serif]">
            OUR CATEGORIES
          </h2>
        </div>

        {/* 1. TOP BENTO GRID (EXACT LAYOUT AS REFERENCE: TALL LEFT, WIDE TOP-RIGHT, TWO BOTTOM-RIGHT) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 mb-7">
          
          {/* CARD 1: TALL LEFT CARD (SPANS 2 ROWS) */}
          <div
            onClick={() => onSelectCategory(CATEGORIES[0].categoryTab)}
            className="group relative md:row-span-2 min-h-[480px] md:min-h-[640px] rounded-[32px] sm:rounded-[38px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)] cursor-pointer bg-stone-100 flex flex-col justify-end p-6 sm:p-10 border border-stone-200/60"
          >
            {/* Background Image with Buttery Zoom Effect */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={CATEGORIES[0].image}
                alt={CATEGORIES[0].name}
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)]"
              />
              {/* Gradient Vignette for crisp text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-colors duration-500" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10">
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#edd2f7] mb-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                {CATEGORIES[0].tag}
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight group-hover:-translate-y-1 transition-transform duration-300">
                {CATEGORIES[0].name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 font-medium mt-1.5 mb-5 max-w-sm group-hover:-translate-y-1 transition-transform duration-300">
                {CATEGORIES[0].subtitle}
              </p>
              <div>
                <button
                  className="bg-white hover:bg-[#edd2f7] text-stone-950 hover:text-[#4a044e] font-extrabold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-full shadow-lg group-hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <span>View Collections</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: TOP RIGHT WIDE CARD (SPANS 2 COLUMNS) */}
          <div
            onClick={() => onSelectCategory(CATEGORIES[1].categoryTab)}
            className="group relative md:col-span-2 min-h-[300px] sm:min-h-[320px] rounded-[32px] sm:rounded-[38px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)] cursor-pointer bg-stone-100 flex flex-col justify-end p-6 sm:p-10 border border-stone-200/60"
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={CATEGORIES[1].image}
                alt={CATEGORIES[1].name}
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-colors duration-500" />
            </div>

            <div className="relative z-10">
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#edd2f7] mb-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                {CATEGORIES[1].tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight group-hover:-translate-y-1 transition-transform duration-300">
                {CATEGORIES[1].name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 font-medium mt-1 mb-4 group-hover:-translate-y-1 transition-transform duration-300">
                {CATEGORIES[1].subtitle}
              </p>
              <div>
                <button
                  className="bg-white hover:bg-[#edd2f7] text-stone-950 hover:text-[#4a044e] font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-lg group-hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <span>View Collections</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* CARD 3: BOTTOM MID CARD */}
          <div
            onClick={() => onSelectCategory(CATEGORIES[2].categoryTab)}
            className="group relative min-h-[300px] sm:min-h-[320px] rounded-[32px] sm:rounded-[38px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)] cursor-pointer bg-stone-100 flex flex-col justify-end p-6 sm:p-8 border border-stone-200/60"
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={CATEGORIES[2].image}
                alt={CATEGORIES[2].name}
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-colors duration-500" />
            </div>

            <div className="relative z-10">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#edd2f7] mb-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                {CATEGORIES[2].tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:-translate-y-1 transition-transform duration-300">
                {CATEGORIES[2].name}
              </h3>
              <p className="text-xs text-stone-200 font-medium mt-1 mb-4 group-hover:-translate-y-1 transition-transform duration-300 truncate">
                {CATEGORIES[2].subtitle}
              </p>
              <div>
                <button
                  className="bg-white hover:bg-[#edd2f7] text-stone-950 hover:text-[#4a044e] font-extrabold text-xs px-5 py-2.5 rounded-full shadow-lg group-hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Collections</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* CARD 4: BOTTOM RIGHT CARD */}
          <div
            onClick={() => onSelectCategory(CATEGORIES[3].categoryTab)}
            className="group relative min-h-[300px] sm:min-h-[320px] rounded-[32px] sm:rounded-[38px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)] cursor-pointer bg-stone-100 flex flex-col justify-end p-6 sm:p-8 border border-stone-200/60"
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={CATEGORIES[3].image}
                alt={CATEGORIES[3].name}
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-colors duration-500" />
            </div>

            <div className="relative z-10">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#edd2f7] mb-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                {CATEGORIES[3].tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:-translate-y-1 transition-transform duration-300">
                {CATEGORIES[3].name}
              </h3>
              <p className="text-xs text-stone-200 font-medium mt-1 mb-4 group-hover:-translate-y-1 transition-transform duration-300 truncate">
                {CATEGORIES[3].subtitle}
              </p>
              <div>
                <button
                  className="bg-white hover:bg-[#edd2f7] text-stone-950 hover:text-[#4a044e] font-extrabold text-xs px-5 py-2.5 rounded-full shadow-lg group-hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Collections</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* 2. SECOND BENTO ROW (FEATURING BYOB STUDIO & EVERYDAY UTILITY) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          
          {/* CARD 5: BYOB FEATURED CARD (SPANS 2 COLUMNS) */}
          <div
            onClick={() => onSelectCategory(CATEGORIES[4].categoryTab)}
            className="group relative md:col-span-2 min-h-[300px] sm:min-h-[340px] rounded-[32px] sm:rounded-[38px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)] cursor-pointer bg-stone-100 flex flex-col justify-end p-6 sm:p-10 border border-stone-200/60"
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={CATEGORIES[4].image}
                alt={CATEGORIES[4].name}
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-colors duration-500" />
            </div>

            <div className="relative z-10">
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#edd2f7] mb-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                {CATEGORIES[4].tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight group-hover:-translate-y-1 transition-transform duration-300">
                {CATEGORIES[4].name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 font-medium mt-1 mb-4 group-hover:-translate-y-1 transition-transform duration-300">
                {CATEGORIES[4].subtitle}
              </p>
              <div>
                <button
                  className="bg-white hover:bg-[#edd2f7] text-stone-950 hover:text-[#4a044e] font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-lg group-hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  <span>Build Custom Bouquet</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* CARD 6: UTILITY CARD */}
          <div
            onClick={() => onSelectCategory(CATEGORIES[5].categoryTab)}
            className="group relative min-h-[300px] sm:min-h-[340px] rounded-[32px] sm:rounded-[38px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)] cursor-pointer bg-stone-100 flex flex-col justify-end p-6 sm:p-8 border border-stone-200/60"
          >
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={CATEGORIES[5].image}
                alt={CATEGORIES[5].name}
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-colors duration-500" />
            </div>

            <div className="relative z-10">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#edd2f7] mb-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                {CATEGORIES[5].tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:-translate-y-1 transition-transform duration-300">
                {CATEGORIES[5].name}
              </h3>
              <p className="text-xs text-stone-200 font-medium mt-1 mb-4 group-hover:-translate-y-1 transition-transform duration-300 truncate">
                {CATEGORIES[5].subtitle}
              </p>
              <div>
                <button
                  className="bg-white hover:bg-[#edd2f7] text-stone-950 hover:text-[#4a044e] font-extrabold text-xs px-5 py-2.5 rounded-full shadow-lg group-hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Collections</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
