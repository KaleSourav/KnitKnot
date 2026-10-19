import React, { useState } from 'react';
import { ArrowRight, Sparkles, Check, Heart } from 'lucide-react';
import { Product } from '../data/products';

interface FeaturedEditorialSectionProps {
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  featuredProduct?: Product;
}

export const FeaturedEditorialSection: React.FC<FeaturedEditorialSectionProps> = ({
  onQuickView,
  onAddToCart,
  featuredProduct,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [added, setAdded] = useState(false);

  // Fallback product info if not passed directly
  const product: Product = featuredProduct || {
    id: 'p-featured-crochet-set',
    name: 'Barefoot at beach co-ord set',
    category: 'Clothing',
    price: 3449,
    originalPrice: 4299,
    image: '/barefoot-beach-coord.jpg',
    rating: 5.0,
    reviewsCount: 168,
    badge: 'Seasonal Favorite',
    description: 'An artisanal summer heirloom handmade from 100% natural organic cotton yarn. Featuring an intricate textured halter crop top with delicate fringe tassels and a matching flared crochet drawstring mini skirt. Designed for sunlit days and effortless luxury.',
    details: [
      '100% sustainably sourced organic cotton',
      'Artisanal crochet lace open-weave stitch',
      'Adjustable drawstring tie waist & halter neck ties',
      'Breathable, lightweight resort knitwear',
    ],
    inStock: true,
  };

  const handleAction = () => {
    if (onAddToCart) {
      onAddToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <section className="w-full bg-white py-14 md:py-24 px-4 sm:px-6 lg:px-12 flex justify-center">
      {/* Outer Banner Card with Warm Golden Gradient */}
      <div className="max-w-[1320px] w-full relative rounded-[36px] sm:rounded-[48px] md:rounded-[60px] overflow-hidden bg-gradient-to-br from-[#f8bc37] via-[#eb9d1b] to-[#d6850e] shadow-[0_25px_70px_-15px_rgba(235,157,27,0.4)] p-6 sm:p-10 md:p-14 lg:p-16 select-none flex flex-col justify-between min-h-[660px] sm:min-h-[760px] md:min-h-[880px] lg:min-h-[960px]">
        
        {/* Soft Organic Palm Silhouette Shadow on the bottom-left / side */}
        <div className="absolute -left-16 -bottom-24 w-[480px] md:w-[720px] h-[480px] md:h-[720px] pointer-events-none opacity-20 mix-blend-multiply z-0">
          <svg viewBox="0 0 500 500" fill="currentColor" className="w-full h-full text-[#7a4800]">
            <path d="M50,450 C120,400 180,320 220,240 C240,200 260,140 250,80 C270,120 280,180 270,240 C310,180 340,110 350,40 C360,110 340,190 310,250 C370,200 420,130 450,70 C440,140 400,220 340,280 C410,250 470,200 500,160 C470,230 420,290 350,330 C410,320 470,300 510,270 C460,340 390,380 320,400 C370,410 430,410 470,400 C410,440 340,450 270,440 C220,470 140,480 50,450 Z" />
            <path d="M20,380 C80,320 140,250 170,170 C160,220 130,280 80,330 C130,270 170,190 190,110 C180,180 150,240 100,300 C150,230 200,150 220,80 C200,160 170,230 110,310 Z" />
          </svg>
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-amber-200/40 via-yellow-100/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

        {/* Top-Left /FEATURED Header */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <span className="text-white/95 font-sans font-medium text-xs sm:text-sm md:text-base tracking-[0.22em] uppercase">
            /FEATURED
          </span>

          <div className="flex items-center gap-2 text-white/85 text-xs sm:text-sm font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span className="hidden sm:inline">KnitKnot Handcrafted Studio</span>
          </div>
        </div>

        {/* Center Main Stage Area */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center my-auto py-6 sm:py-8 md:py-12">
          
          {/* Giant Editorial Serif Background Typography ("Frolax") */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-10 overflow-hidden">
            <h2 
              className="text-white font-serif tracking-tight leading-none text-center font-normal whitespace-nowrap opacity-95 transition-transform duration-700"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(7rem, 25vw, 24rem)',
              }}
            >
              Frolax
            </h2>
          </div>

          {/* Central Photo Card Container - Significantly Enlarged */}
          <div className="relative z-20 w-[96%] sm:w-[90%] md:w-[82%] lg:w-[74%] xl:w-[68%] max-w-[840px] group">
            
            {/* The Main Rounded Image Box (Enlarged) */}
            <div 
              onClick={() => onQuickView && onQuickView(product)}
              className="w-full aspect-[4/3] sm:aspect-[1.18/1] min-h-[360px] sm:min-h-[460px] md:min-h-[540px] rounded-[28px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5)] relative cursor-pointer bg-[#c5821c]"
            >
              <img 
                src="/barefoot-beach-coord.jpg" 
                alt="Barefoot at beach co-ord set" 
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Subtle inner dark vignette for rich photographic depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 pointer-events-none" />

              {/* Like/Favorite Quick button on top left of image */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                className={`absolute top-5 left-5 z-30 w-10 h-10 rounded-full backdrop-blur-md border transition-all flex items-center justify-center ${
                  isLiked 
                    ? 'bg-rose-500 border-rose-400 text-white shadow-lg scale-110' 
                    : 'bg-black/35 border-white/25 text-white hover:bg-black/55'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4.5 h-4.5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Overlapping Top-Right "Quality Product" Circular Badge */}
            <div className="absolute -top-7 -right-5 sm:-top-9 sm:-right-8 md:-top-12 md:-right-10 z-30 transition-transform duration-300 hover:scale-110">
              <div className="w-22 h-22 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full bg-[#f95700] shadow-[0_12px_30px_rgba(249,87,0,0.55)] flex items-center justify-center p-1.5 sm:p-2 border-2 border-white/40">
                {/* Inner Dashed Ring */}
                <div className="w-full h-full rounded-full border-2 border-dashed border-white/90 flex flex-col items-center justify-center text-center p-1">
                  <span className="text-white font-sans font-bold text-xs sm:text-sm md:text-base tracking-wide leading-tight drop-shadow-sm">
                    Quality
                    <br />
                    Product
                  </span>
                </div>
              </div>
            </div>

            {/* Overlapping Bottom-Left Floating Tags & Glassmorphism Price Card */}
            <div className="absolute -bottom-7 -left-3 sm:-bottom-9 sm:-left-7 md:-bottom-12 md:-left-10 z-30 flex flex-col gap-2.5">
              
              {/* Frosted Tags */}
              <div className="flex items-center gap-2 pl-1">
                <span className="px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-white bg-white/25 backdrop-blur-md border border-white/40 shadow-sm">
                  Seasonal Favorite
                </span>
                <span className="px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-white bg-black/25 backdrop-blur-md border border-white/20 shadow-sm">
                  Aesthetic
                </span>
              </div>

              {/* Glassmorphism Floating Price Card */}
              <div className="backdrop-blur-xl bg-white/25 border border-white/40 shadow-[0_18px_40px_rgba(0,0,0,0.22)] rounded-2xl md:rounded-[26px] p-4 sm:p-5 md:p-6 text-white w-[250px] sm:w-[290px] md:w-[330px] transition-all duration-300 hover:bg-white/30 group/card">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-white/90 tracking-wider block uppercase">
                      Sustainably Sourced
                    </span>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight truncate mt-0.5" title={product.name}>
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1 sm:mt-1.5">
                      <span className="text-base sm:text-lg md:text-xl font-extrabold text-white tracking-tight drop-shadow-sm">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm text-white/70 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow Action Button */}
                  <button
                    type="button"
                    onClick={handleAction}
                    className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 shrink-0 ${
                      added 
                        ? 'bg-emerald-500 text-white scale-105' 
                        : 'bg-white text-stone-900 hover:bg-stone-100 hover:scale-110 active:scale-95 group-hover/card:rotate-[-45deg]'
                    }`}
                    aria-label="Add to bag or quick view"
                  >
                    {added ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom subtle detail row */}
        <div className="relative z-10 flex items-center justify-between text-white/80 text-xs sm:text-sm pt-5 border-t border-white/20 mt-10 sm:mt-14">
          <span>Artisanal 100% Hand-Crocheted • Limited Batch Drop</span>
          <button 
            type="button" 
            onClick={() => onQuickView && onQuickView(product)}
            className="hover:text-white underline underline-offset-4 transition-colors font-medium"
          >
            View Details & Sizing Guide →
          </button>
        </div>

      </div>
    </section>
  );
};
