import React, { useState } from 'react';
import { Sparkles, Heart, ArrowDown, ShoppingBag, Eye, Star, ShieldCheck } from 'lucide-react';
import { Product } from '../data/products';
import landingImage from '../assets/knitknot-landing.png';
import landingImageMobile from '../assets/knitknot-landing-mobile.jpg';

interface HeroSectionProps {
  onExploreClick: () => void;
  onSelectCategory?: (cat: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  heroProducts: { [key: string]: Product };
}

interface Hotspot {
  id: string;
  productId: string;
  title: string;
  price: number;
  xPercent: number; // percentage from left
  yPercent: number; // percentage from top
  category: string;
}

const HERO_HOTSPOTS_DESKTOP: Hotspot[] = [
  {
    id: 'hs-bouquet',
    productId: 'p-bouquet-01',
    title: 'Everlasting White Lily Bouquet',
    price: 1499,
    xPercent: 18,
    yPercent: 48,
    category: 'Flowers',
  },
  {
    id: 'hs-bunny',
    productId: 'p-amigurumi-01',
    title: 'Lilac Bunny & Chick Set',
    price: 899,
    xPercent: 35,
    yPercent: 68,
    category: 'Amigurumi',
  },
  {
    id: 'hs-sunflower',
    productId: 'p-flower-03',
    title: 'Sunbeam Sunflower Stem',
    price: 399,
    xPercent: 52,
    yPercent: 74,
    category: 'Flowers',
  },
  {
    id: 'hs-tote',
    productId: 'p-tote-01',
    title: 'Daisy Granny Square Tote',
    price: 1599,
    xPercent: 60,
    yPercent: 62,
    category: 'Accessories',
  },
  {
    id: 'hs-accessories',
    productId: 'p-acc-01',
    title: 'Lavender Headband & Bow',
    price: 599,
    xPercent: 76,
    yPercent: 70,
    category: 'Accessories',
  },
];

const HERO_HOTSPOTS_MOBILE: Hotspot[] = [
  {
    id: 'hs-m-bouquet',
    productId: 'p-bouquet-01',
    title: 'Everlasting Bouquet',
    price: 1499,
    xPercent: 20,
    yPercent: 57,
    category: 'Flowers',
  },
  {
    id: 'hs-m-chick',
    productId: 'p-amigurumi-01',
    title: 'Happy Chick Set',
    price: 899,
    xPercent: 20,
    yPercent: 79,
    category: 'Amigurumi',
  },
  {
    id: 'hs-m-bunny',
    productId: 'p-amigurumi-01',
    title: 'Lilac Bunny Companion',
    price: 899,
    xPercent: 39,
    yPercent: 75,
    category: 'Amigurumi',
  },
  {
    id: 'hs-m-sunflower',
    productId: 'p-flower-03',
    title: 'Sunbeam Sunflower',
    price: 399,
    xPercent: 62,
    yPercent: 78,
    category: 'Flowers',
  },
  {
    id: 'hs-m-tote',
    productId: 'p-tote-01',
    title: 'Daisy Granny Square Tote',
    price: 1599,
    xPercent: 82,
    yPercent: 68,
    category: 'Accessories',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onAddToCart,
  onQuickView,
  heroProducts,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const renderHotspots = (spots: Hotspot[]) => {
    return spots.map((spot) => {
      const product = heroProducts[spot.productId];
      const isHovered = activeHotspot?.id === spot.id;

      const alignmentClasses =
        spot.xPercent < 30
          ? 'left-0 translate-x-0'
          : spot.xPercent > 70
          ? 'right-0 left-auto translate-x-0'
          : 'left-1/2 -translate-x-1/2';

      return (
        <div
          key={spot.id}
          className="absolute pointer-events-auto z-20"
          style={{
            left: `${spot.xPercent}%`,
            top: `${spot.yPercent}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Hotspot Pulsing Pin */}
          <button
            onMouseEnter={() => setActiveHotspot(spot)}
            onMouseLeave={() => setActiveHotspot(null)}
            onClick={() => {
              if (activeHotspot?.id === spot.id) {
                setActiveHotspot(null);
              } else {
                setActiveHotspot(spot);
              }
            }}
            className="relative group/pin flex items-center justify-center p-1.5 sm:p-2 cursor-pointer focus:outline-none"
            aria-label={`View ${spot.title}`}
          >
            <span className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/40 animate-ping" />
            <span className="relative flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white text-[#4a044e] font-bold shadow-lg border-2 border-[#edd2f7] hover:scale-110 active:scale-95 transition-transform">
              <Heart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-[#4a044e]" />
            </span>
          </button>

          {/* Popover Card */}
          {isHovered && product && (
            <div 
              onMouseEnter={() => setActiveHotspot(spot)}
              onMouseLeave={() => setActiveHotspot(null)}
              className={`absolute z-30 bottom-full mb-2 w-44 sm:w-60 bg-[#16121e]/95 border border-purple-400/30 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-auto max-w-[calc(100vw-32px)] ${alignmentClasses}`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <span className="text-[8.5px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                  {spot.category}
                </span>
                <div className="flex items-center gap-0.5 text-amber-300 text-[11px] sm:text-xs ml-auto">
                  <Star className="w-3 h-3 fill-amber-300" />
                  <span>{product.rating}</span>
                </div>
              </div>

              <h4 className="text-[11px] sm:text-sm font-bold text-white line-clamp-1 mb-1">
                {product.name}
              </h4>

              <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/10">
                <span className="text-xs sm:text-sm font-extrabold text-[#edd2f7]">
                  ₹{product.price}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickView(product);
                    }}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
                    title="Quick View"
                  >
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="px-2 py-0.5 sm:py-1 rounded-lg bg-[#edd2f7] hover:bg-[#e4c2f1] text-[#4a044e] font-bold text-[11px] sm:text-xs flex items-center gap-1 transition-all"
                  >
                    <ShoppingBag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <section className="relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] sm:h-[100dvh] sm:min-h-[100dvh] sm:max-h-none flex flex-col justify-between overflow-hidden select-none">
      {/* 1. FULL-BLEED BACKGROUND IMAGE (RESPONSIVE FOR MOBILE PORTRAIT AND DESKTOP LANDSCAPE) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {/* Mobile Vertical 9:16 Artwork (Fully visible, centered, zero letters cropped!) */}
        <img
          src={landingImageMobile || '/knitknot-landing-mobile.jpg'}
          alt="Knotsnco - Crocheted Gifts for a Brighter and Warmer Tomorrow"
          className="sm:hidden w-full h-full object-cover object-top pointer-events-none select-none"
        />
        
        {/* Desktop Landscape 16:9 Artwork */}
        <img
          src={landingImage || '/knotsnco-landing.png'}
          alt="Knotsnco - Crocheted Gifts for a Brighter and Warmer Tomorrow"
          className="hidden sm:block w-full h-full object-cover object-center pointer-events-none select-none"
        />

        {/* Subtle cinematic gradient only at the bottom for floating glass pill */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
      </div>

      {/* 2. TOP SPACING (NAVBAR OVERHEAD) */}
      <div className="w-full pt-14 sm:pt-20 lg:pt-24 shrink-0" />

      {/* 3. INTERACTIVE HOTSPOTS OVER THE PRODUCTS IN THE ARTWORK */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Mobile Hotspots */}
        <div className="sm:hidden">
          {renderHotspots(HERO_HOTSPOTS_MOBILE)}
        </div>
        {/* Desktop Hotspots */}
        <div className="hidden sm:block">
          {renderHotspots(HERO_HOTSPOTS_DESKTOP)}
        </div>
      </div>

      {/* 4. CENTER AREA: EXPLORE COLLECTION PILL BUTTON */}
      <div className="w-full flex flex-col items-center justify-center z-10 text-center py-2 sm:py-6 shrink-0">
        <button
          onClick={onExploreClick}
          className="group px-5 sm:px-9 py-2.5 sm:py-3.5 rounded-full bg-[#fdeee4]/95 hover:bg-white text-stone-900 font-extrabold text-[11px] sm:text-sm tracking-wider sm:tracking-widest uppercase shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md border border-white/60 flex items-center gap-1.5 sm:gap-2 cursor-pointer mt-1 sm:mt-8"
        >
          <span>EXPLORE COLLECTION</span>
          <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-y-0.5 transition-transform text-stone-800" />
        </button>
      </div>

      {/* 5. BOTTOM AREA: FLOATING FROSTED GLASS PILL BAR (COMPACT & FITS 100% IN MOBILE VIEWPORT) */}
      <div className="w-full px-3 sm:px-6 lg:px-8 pb-3 sm:pb-6 z-20 shrink-0">
        <div className="w-full max-w-6xl mx-auto rounded-2xl sm:rounded-3xl lg:rounded-full bg-white/35 hover:bg-white/40 backdrop-blur-xl border border-white/45 shadow-2xl px-3 sm:px-8 lg:px-10 py-2 sm:py-3.5 transition-all">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 items-center">
            
            {/* Pillar 1 */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/50 border border-white/60 flex items-center justify-center text-stone-900 shrink-0 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-900" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[9.5px] sm:text-xs font-black uppercase tracking-wider text-stone-950 truncate drop-shadow-sm">
                  PREMIUM QUALITY
                </h4>
                <p className="text-[8.5px] sm:text-[11px] text-stone-800 font-semibold truncate">
                  Finest cotton yarn
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/50 border border-white/60 flex items-center justify-center text-stone-900 shrink-0 shadow-sm">
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-900" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[9.5px] sm:text-xs font-black uppercase tracking-wider text-stone-950 truncate drop-shadow-sm">
                  TIMELESS DESIGN
                </h4>
                <p className="text-[8.5px] sm:text-[11px] text-stone-800 font-semibold truncate">
                  Everlasting blooms
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/50 border border-white/60 flex items-center justify-center text-stone-900 shrink-0 shadow-sm">
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-900" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[9.5px] sm:text-xs font-black uppercase tracking-wider text-stone-950 truncate drop-shadow-sm">
                  EXCLUSIVE DROPS
                </h4>
                <p className="text-[8.5px] sm:text-[11px] text-stone-800 font-semibold truncate">
                  Handmade edition
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/50 border border-white/60 flex items-center justify-center text-stone-900 shrink-0 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-900" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[9.5px] sm:text-xs font-black uppercase tracking-wider text-stone-950 truncate drop-shadow-sm">
                  SECURE & EASY
                </h4>
                <p className="text-[8.5px] sm:text-[11px] text-stone-800 font-semibold truncate">
                  Gift wrap & delivery
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};
