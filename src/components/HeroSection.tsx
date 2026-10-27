import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Eye, 
  ChevronDown 
} from 'lucide-react';
import { Product } from '../data/products';
import landingHeroImage from '../assets/handmade-happiness-hero.png';

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

// Hotspots positioned specifically for "Handmade Happiness Crochet Collection.png"
const HERO_HOTSPOTS: Hotspot[] = [
  {
    id: 'hs-bouquet',
    productId: 'p-bouquet-01',
    title: 'Everlasting White Lily Bouquet',
    price: 1499,
    xPercent: 18,
    yPercent: 54,
    category: 'Flowers',
  },
  {
    id: 'hs-bunny',
    productId: 'p-amigurumi-01',
    title: 'Lilac Bunny & Chick Set',
    price: 899,
    xPercent: 37,
    yPercent: 71,
    category: 'Amigurumi',
  },
  {
    id: 'hs-sunflower',
    productId: 'p-flower-03',
    title: 'Sunbeam Sunflower Stem',
    price: 399,
    xPercent: 53,
    yPercent: 81,
    category: 'Flowers',
  },
  {
    id: 'hs-tote',
    productId: 'p-tote-01',
    title: 'Daisy Granny Square Tote',
    price: 1599,
    xPercent: 65,
    yPercent: 69,
    category: 'Bags',
  },
  {
    id: 'hs-accessories',
    productId: 'p-acc-01',
    title: 'Handmade Headband & Bow',
    price: 599,
    xPercent: 82,
    yPercent: 79,
    category: 'Hair Accessories',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onAddToCart,
  onQuickView,
  heroProducts,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  return (
    <section className="relative w-full h-[calc(100vh-136px)] min-h-[480px] max-h-[880px] bg-[#faedd3] select-none flex flex-col justify-between overflow-hidden">
      {/* 1. SINGLE STATIC HERO IMAGE (NO SLIDESHOW) - Spans 100% edge-to-edge */}
      <div className="relative w-full flex-1 overflow-hidden flex items-center justify-center">
        <img
          src={landingHeroImage}
          alt="Handmade Happiness Crochet Collection"
          className="w-full h-full object-cover object-center"
        />

        {/* Interactive Hotspot Pins on Products */}
        <div className="absolute inset-0 pointer-events-auto">
          {HERO_HOTSPOTS.map((spot) => {
            const product = heroProducts[spot.productId];
            const isHovered = activeHotspot?.id === spot.id;

            const alignmentClasses =
              spot.xPercent < 25
                ? 'left-0 translate-x-0'
                : spot.xPercent > 75
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
                {/* Pulsing Hotspot Pin */}
                <button
                  onMouseEnter={() => setActiveHotspot(spot)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  onClick={() => {
                    setActiveHotspot(activeHotspot?.id === spot.id ? null : spot);
                  }}
                  className="relative group flex items-center justify-center p-1 sm:p-2 cursor-pointer focus:outline-none"
                  aria-label={`View ${spot.title}`}
                >
                  <span className="absolute w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-[#841724]/35 animate-ping" />
                  <span className="relative flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#841724] text-[#faedd3] font-bold shadow-lg border-2 border-[#faedd3] hover:scale-110 active:scale-95 transition-transform">
                    <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#faedd3]" />
                  </span>
                </button>

                {/* Interactive Hotspot Popup Card (Light Cream theme) */}
                {isHovered && (
                  <div
                    onMouseEnter={() => setActiveHotspot(spot)}
                    onMouseLeave={() => setActiveHotspot(null)}
                    className={`absolute bottom-full mb-3 ${alignmentClasses} w-56 sm:w-64 bg-[#faedd3] text-[#2d0a10] rounded-2xl shadow-2xl p-3 border border-[#841724]/25 z-30 animate-in fade-in zoom-in-95 duration-200`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#841724] bg-[#841724]/10 px-2 py-0.5 rounded-full">
                        {spot.category}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold ml-auto">
                        In Stock
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-[#2d0a10] line-clamp-1">
                      {spot.title}
                    </h4>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#841724]/15">
                      <span className="text-sm font-black text-[#841724]">
                        ₹{spot.price.toLocaleString('en-IN')}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {product && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickView(product);
                            }}
                            className="p-1.5 text-[#841724] hover:bg-[#841724]/15 rounded-lg transition-colors cursor-pointer"
                            title="Quick Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {product && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(product);
                            }}
                            className="inline-flex items-center gap-1 bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm cursor-pointer"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. SUBTLE BOTTOM STRIP WITH SCROLL PROMPT - Leads seamlessly into the next section */}
      <div 
        onClick={onExploreClick}
        className="w-full bg-[#faedd3] border-t border-[#841724]/15 py-2 px-4 flex items-center justify-between text-xs sm:text-sm font-serif italic text-[#841724] cursor-pointer hover:bg-[#f6e6c4] transition-colors shrink-0"
      >
        <span className="hidden sm:inline">✨ Made slowly, lovingly & by hand</span>
        <div className="mx-auto flex items-center gap-1.5 font-sans font-semibold text-[11px] sm:text-xs not-italic tracking-wider uppercase text-[#841724]">
          <span>Scroll to explore our collections</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce stroke-[2.5]" />
        </div>
        <span className="hidden sm:inline">100% Handcrafted crochet ♡</span>
      </div>
    </section>
  );
};
