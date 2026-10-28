import React, { useState } from 'react';
import { 
  ShoppingBag, 
  User, 
  Search, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  Instagram, 
  MessageCircle, 
  Eye, 
  Check, 
  ChevronRight,
  Flame,
  Star,
  Menu
} from 'lucide-react';
import { Product } from '../data/products';

export interface BloomHeroProps {
  cartCount: number;
  onCartClick: () => void;
  onSearchClick: () => void;
  onUserClick: () => void;
  onExploreCatalog: () => void;
  onCustomOrder: () => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOpenCategoryDrawer?: () => void;
}

export const BLOOM_CATALOG_ITEMS: Product[] = [
  {
    id: 'bloom-pink-dawn',
    name: 'Pink Dawn Everlasting Bouquet',
    category: 'Bouquets & Florals',
    price: 1499,
    originalPrice: 1999,
    image: '/bloom/bouquet-pink-dawn.jpg',
    rating: 4.9,
    reviewsCount: 48,
    badge: 'Atelier Signature',
    description: 'A delicate harmony of pastel pink crochet tulips, blush buds, and white daisy blossoms tied with a soft silk ribbon. Stitched by hand with premium anti-pill combed yarn.',
    details: [
      '100% Handcrafted by women artisans in Surat',
      'Never wilts, fades, or sheds pollen — forever keepsake',
      'Includes 11 individual stems tied with satin ribbon',
      'Height: 34 cm • Width: 24 cm',
      'Hypoallergenic & allergen-free luxury yarn'
    ],
    inStock: true,
  },
  {
    id: 'bloom-royal-blue',
    name: 'Royal Blue Chamomile Bouquet',
    category: 'Bouquets & Florals',
    price: 1399,
    originalPrice: 1799,
    image: '/bloom/bouquet-royal-blue.jpg',
    rating: 5.0,
    reviewsCount: 36,
    badge: 'Limited Edition',
    description: 'Vibrant cobalt blue chamomile flowers paired with delicate baby blue florets and wrapped with a matching satin cord. A striking, poetic gift for those who love bold aesthetics.',
    details: [
      'Artisan hand-knitted with vibrant dyed cotton yarn',
      'Each petal individually shaped and wired for longevity',
      'Includes 14 stems with flexible inner wire cores',
      'Height: 32 cm • Width: 22 cm',
      'Arrives gift-wrapped in signature Knotsnco craft paper'
    ],
    inStock: true,
  },
  {
    id: 'bloom-summer-garden',
    name: 'Summer Garden Tulip Ensemble',
    category: 'Bouquets & Florals',
    price: 1599,
    originalPrice: 2099,
    image: '/bloom/bouquet-summer-tulips.jpg',
    rating: 4.9,
    reviewsCount: 52,
    badge: 'Bestseller',
    description: 'A vibrant burst of fresh summer meadows featuring soft pink garden tulips, baby blush florets, and lush emerald green stems. Tied with a delicate woven bow.',
    details: [
      'Hand-crocheted over 6 hours of detailed craftsmanship',
      'Everlasting spring meadow warmth for any desk or bedside',
      'Includes 12 stems of assorted tulips and filler buds',
      'Height: 35 cm • Width: 25 cm',
      'Packaged in eco-friendly protective luxury box'
    ],
    inStock: true,
  },
  {
    id: 'bloom-gentle-white',
    name: 'Gentle Daisy & Lily Bouquet',
    category: 'Bouquets & Florals',
    price: 1299,
    originalPrice: 1699,
    image: '/bloom/bouquet-gentle-white.jpg',
    rating: 4.8,
    reviewsCount: 29,
    badge: 'Pure Elegance',
    description: 'Pristine white field daisies with warm sunshine centers and ivory cream lily buds, tied with a natural burlap linen ribbon. Timeless, gentle, and utterly heartwarming.',
    details: [
      'Pure white and warm butter yellow combed milk cotton',
      'Classic neutral palette that matches any interior decor',
      'Includes 13 stems with natural textured green foliage',
      'Height: 33 cm • Width: 23 cm',
      'Comes with personalized handwritten message card'
    ],
    inStock: true,
  },
];

export const BloomEditorialHero: React.FC<BloomHeroProps> = ({
  cartCount,
  onCartClick,
  onSearchClick,
  onUserClick,
  onExploreCatalog,
  onCustomOrder,
  onAddToCart,
  onQuickView,
  onOpenCategoryDrawer,
}) => {
  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'popular' | 'new'>('all');
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleQuickAdd = (product: Product) => {
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="w-full bg-[#fcecee] text-[#2b0b12] pt-3 sm:pt-5 pb-8 sm:pb-12 px-3 sm:px-6 lg:px-10 transition-colors duration-500 font-sans selection:bg-[#841724] selection:text-[#faedd3]">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP EDITORIAL META FRAME: "[ ATELIER COLLECTION 01 ]" & BRAND   */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#841724]/75 px-2 sm:px-4 mb-3 sm:mb-4 select-none">
        <div className="flex items-center gap-2">
          <span className="font-semibold">[ ATELIER COLLECTION 01 ]</span>
          <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-[#841724]/40" />
          <span className="hidden md:inline text-[10px] tracking-widest text-[#841724]/60 font-sans font-medium">SURAT CRAFTED • EST. 2024</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[10px] font-sans font-bold tracking-widest text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
            ● READY TO SHIP
          </span>
          <span className="font-extrabold tracking-[0.25em] text-[#841724]">
            KNOTSNCO. STUDIO
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. FLOATING GLASS CAPSULE NAVBAR (MATCHING REFERENCE IMAGE)       */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-[1440px] mx-auto px-1 sm:px-4 mb-4 sm:mb-6 select-none sticky top-2 sm:top-4 z-40">
        <header className="relative w-full bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(132,23,36,0.06)] rounded-full px-3 sm:px-6 py-2.5 flex items-center justify-between transition-all">
          
          {/* LEFT: Circular Social & Concierge Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="https://wa.me/919999999999?text=Hi%20Knotsnco!%20I'd%20like%20to%20order%20a%20handcrafted%20crochet%20bouquet"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Concierge"
              title="Chat with our artisan florist on WhatsApp"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
            </a>

            <a
              href="https://www.instagram.com/knotsnco.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Lookbook"
              title="Follow @knotsnco.in on Instagram"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform"
            >
              <Instagram className="w-4 h-4 stroke-[2.2]" />
            </a>

            {/* Micro Tagline on Desktop */}
            <div className="hidden xl:flex flex-col pl-2 border-l border-gray-100 leading-tight">
              <span className="text-[10px] font-bold text-[#841724] tracking-wide uppercase">Everlasting Blooms</span>
              <span className="text-[9px] text-[#7c5c62]">Hand-knitted in Surat</span>
            </div>
          </div>

          {/* CENTER: Clean Minimal Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-[13px] font-medium text-[#4a2e35]">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#841724] transition-colors relative py-1 cursor-pointer font-semibold"
            >
              Atelier
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('bloom-catalog') || document.getElementById('bestseller-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#841724] transition-colors relative py-1 cursor-pointer"
            >
              Catalog
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('bestseller-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#841724] transition-colors relative py-1 cursor-pointer"
            >
              Bestsellers
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('reels-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#841724] transition-colors relative py-1 cursor-pointer flex items-center gap-1 text-[#841724] font-bold"
            >
              <Sparkles className="w-3 h-3 text-[#f472b6] animate-pulse" />
              <span>Watch Reels</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('reviews-section') || document.getElementById('faq-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#841724] transition-colors relative py-1 cursor-pointer"
            >
              Delivery & FAQs
            </button>
          </nav>

          {/* RIGHT: Search, Account & Shopping Bag Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onSearchClick}
              aria-label="Search catalog"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-50 hover:bg-[#841724]/10 text-[#4a2e35] hover:text-[#841724] flex items-center justify-center transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>

            <button
              onClick={onUserClick}
              aria-label="User Account"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-50 hover:bg-[#841724]/10 text-[#4a2e35] hover:text-[#841724] flex items-center justify-center transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 stroke-[2]" />
            </button>

            {onOpenCategoryDrawer && (
              <button
                onClick={onOpenCategoryDrawer}
                aria-label="Browse categories"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-50 hover:bg-[#841724]/10 text-[#4a2e35] hover:text-[#841724] flex items-center justify-center transition-colors cursor-pointer md:hidden"
              >
                <Menu className="w-4 h-4 stroke-[2.2]" />
              </button>
            )}

            {/* Shopping Bag Pill Button */}
            <button
              onClick={onCartClick}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="flex items-center gap-2 bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] pl-3.5 pr-4 py-1.5 sm:py-2 rounded-full font-bold text-xs shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer group"
            >
              <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Bag</span>
              <span className="w-5 h-5 rounded-full bg-[#faedd3] text-[#841724] text-[10px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </header>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. ROUNDED HERO STAGE (INSPIRED BY REFERENCE IMAGE)                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-[1440px] mx-auto select-none">
        <div className="relative w-full rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden shadow-2xl border border-white/60 bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#dbeafe]">
          
          {/* Main Photographic Sky & Hand Bouquet Visual */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/9] min-h-[460px] max-h-[820px] overflow-hidden">
            <img
              src="/bloom/hero-sky-bouquet.jpg"
              alt="Knotsnco Atelier - Handcrafted Crochet Flower Bouquet under Clear Sky"
              className="w-full h-full object-cover object-center select-none"
              loading="eager"
            />

            {/* Subtle Gradient Vignette at the bottom to ensure readability of text & buttons */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Floating Top Pill Badges inside Hero */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-8 flex items-center gap-2 z-10">
              <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-[#841724] text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md border border-white/80">
                <Sparkles className="w-3 h-3 text-[#f472b6]" />
                <span>100% Handcrafted • Never Wilts</span>
              </span>
            </div>

            {/* BOTTOM-LEFT: Romantic Boutique Narrative Copy */}
            <div className="absolute bottom-5 sm:bottom-8 lg:bottom-10 left-4 sm:left-8 lg:left-12 max-w-xs sm:max-w-md lg:max-w-lg z-20 text-white text-left drop-shadow-md">
              <p className="text-xs sm:text-sm lg:text-[15px] font-medium leading-relaxed sm:leading-relaxed text-white/95 text-shadow-sm font-sans">
                Airy everlasting flowers from our Surat artisan workshop. We hand-crochet soft forever-bouquets for birthdays, anniversaries, date nights, and heartwarming everyday surprises that stay vibrant forever.
              </p>
              <div className="mt-2 flex items-center gap-3 text-[11px] sm:text-xs text-white/80 font-mono tracking-wider uppercase">
                <span>Hand-stitched in Surat</span>
                <span>•</span>
                <span>All-India Free Shipping ₹999+</span>
              </div>
            </div>

            {/* BOTTOM-RIGHT: Dual Action Buttons matching reference */}
            <div className="absolute bottom-5 sm:bottom-8 lg:bottom-10 right-4 sm:right-8 lg:right-12 z-20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5">
              
              {/* Button 1: Pink/Maroon Filled Pill "Explore Catalog" */}
              <button
                onClick={onExploreCatalog}
                className="bg-[#f472b6] hover:bg-[#841724] text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group border border-pink-300/40"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Button 2: Crisp White Pill "Custom Order" */}
              <button
                onClick={onCustomOrder}
                className="bg-white/95 hover:bg-white text-[#2b0b12] hover:text-[#841724] px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/80"
              >
                <span>Custom Order</span>
                <Heart className="w-3.5 h-3.5 fill-[#f472b6] text-[#f472b6]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. THE EDITORIAL 4-CARD CATALOG ("Каталог" IN THE REFERENCE)        */}
      {/* ------------------------------------------------------------------ */}
      <section id="bloom-catalog" className="max-w-[1440px] mx-auto mt-8 sm:mt-12 select-none">
        
        {/* Header Row: Big Bold Title + Right Pink Action Pill */}
        <div className="flex items-center justify-between px-2 sm:px-4 mb-5 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2b0b12]">
              Catalog
            </h2>
            <p className="text-xs sm:text-sm text-[#7c5c62] mt-1 font-medium">
              Hand-picked everlasting bouquets • Ready for doorstep gifting
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Filter Pills */}
            <div className="hidden md:flex items-center gap-1.5 bg-white/70 p-1 rounded-full border border-pink-100">
              <button
                onClick={() => setActiveCatalogTab('all')}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                  activeCatalogTab === 'all'
                    ? 'bg-[#841724] text-[#faedd3]'
                    : 'text-[#4a2e35] hover:text-[#841724]'
                }`}
              >
                All Bouquets
              </button>
              <button
                onClick={() => setActiveCatalogTab('popular')}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                  activeCatalogTab === 'popular'
                    ? 'bg-[#841724] text-[#faedd3]'
                    : 'text-[#4a2e35] hover:text-[#841724]'
                }`}
              >
                Most Loved
              </button>
            </div>

            {/* "View All" Pill Button matching reference "Смотреть все" */}
            <button
              onClick={onExploreCatalog}
              className="bg-[#f472b6] hover:bg-[#841724] text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* 4 Portrait Cards Grid (Exactly like reference image bottom row) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-1 sm:px-2">
          {BLOOM_CATALOG_ITEMS.map((item, idx) => {
            const isAdded = addedId === item.id;
            // Pastel backdrops matching reference card shades
            const bgTones = [
              'bg-[#fdf3f5]', // soft blush
              'bg-[#f5f8fd]', // soft sky pastel
              'bg-[#f4f8f4]', // soft mint / meadow
              'bg-[#fcf9f2]', // soft ivory / warm cream
            ];
            const currentBg = bgTones[idx % bgTones.length];

            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-[22px] sm:rounded-[30px] p-2.5 sm:p-4 bg-white/70 hover:bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgb(132,23,36,0.08)] border border-pink-100/60 hover:border-pink-200 transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Image Container with Soft Pastel Canvas */}
                <div 
                  onClick={() => onQuickView(item)}
                  className={`relative w-full aspect-[3/4] ${currentBg} rounded-[18px] sm:rounded-[24px] overflow-hidden flex items-center justify-center p-2 sm:p-3 cursor-pointer group-hover:shadow-inner transition-all`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-500 ease-out select-none"
                    loading="lazy"
                  />

                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/90 backdrop-blur-md text-[#841724] shadow-sm border border-pink-100">
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Quick Preview Hover Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickView(item);
                    }}
                    aria-label={`Preview ${item.name}`}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#841724] opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all shadow-md flex items-center justify-center cursor-pointer"
                  >
                    <Eye className="w-4 h-4 stroke-[2.2]" />
                  </button>
                </div>

                {/* Card Meta & Action */}
                <div className="mt-3 sm:mt-4 text-center px-1 flex flex-col items-center">
                  <h3 
                    onClick={() => onQuickView(item)}
                    className="text-xs sm:text-sm lg:text-base font-bold text-[#2b0b12] group-hover:text-[#841724] transition-colors line-clamp-1 cursor-pointer"
                  >
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-xs sm:text-base font-black text-[#841724]">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    {item.originalPrice && (
                      <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Quick Add Button matching theme */}
                  <button
                    onClick={() => handleQuickAdd(item)}
                    disabled={isAdded}
                    className={`mt-2.5 w-full py-2 px-3 rounded-full text-[11px] sm:text-xs font-bold tracking-wide transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
