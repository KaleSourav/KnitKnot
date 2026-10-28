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
  Menu,
  Flower2,
  Ribbon,
  Shapes,
  Smile,
  KeyRound,
  X
} from 'lucide-react';
import { Product } from '../data/products';
import heroBannerImg from '../assets/handmade-happiness-hero.png';

export interface KnotsncoBrandHeroProps {
  cartCount: number;
  products: Product[];
  onCartClick: () => void;
  onSearchClick: () => void;
  onUserClick: () => void;
  onOpenCategoryDrawer: () => void;
  onSelectCategory: (categoryName: string) => void;
  onCustomOrder: () => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  heroProductsMap: { [key: string]: Product };
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

// Interactive pins on the official "Handmade Happiness Crochet Collection.png"
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

export interface AtelierCategoryItem {
  id: string;
  name: string;
  subtitle: string;
  itemCount: number;
  startingPrice: number;
  image: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ATELIER_CATEGORIES: AtelierCategoryItem[] = [
  {
    id: 'flowers',
    name: 'Flowers & Bouquets',
    subtitle: 'Everlasting blooms that never wilt',
    itemCount: 85,
    startingPrice: 399,
    image: '/products/bouquet.jpg',
    badge: 'Bestseller',
    icon: Flower2,
  },
  {
    id: 'bags',
    name: 'Bags & Totes',
    subtitle: 'Handwoven daisy & resort carryalls',
    itemCount: 38,
    startingPrice: 1299,
    image: '/products/tote.jpg',
    badge: 'Trending Edit',
    icon: ShoppingBag,
  },
  {
    id: 'accessories',
    name: 'Hair Accessories',
    subtitle: 'Coquette bows, clips & gajras',
    itemCount: 42,
    startingPrice: 299,
    image: '/products/accessories.jpg',
    badge: 'Artisan Picks',
    icon: Ribbon,
  },
  {
    id: 'amigurumi',
    name: 'Plushies & Toys',
    subtitle: 'Soft companions & keepsake dolls',
    itemCount: 28,
    startingPrice: 699,
    image: '/products/bunny.jpg',
    badge: 'Cute Gifts',
    icon: Smile,
  },
  {
    id: 'keychains',
    name: 'Keychains & Charms',
    subtitle: 'Mini bag charms & car hangings',
    itemCount: 32,
    startingPrice: 249,
    image: '/bloom/bouquet-pink-dawn.jpg',
    badge: 'Popular',
    icon: KeyRound,
  },
  {
    id: 'home-decor',
    name: 'Home & Desk Decor',
    subtitle: 'Standees, coasters & floral vases',
    itemCount: 27,
    startingPrice: 499,
    image: '/products/utility.jpg',
    badge: 'Living Space',
    icon: Shapes,
  },
];

export const KnotsncoBrandHero: React.FC<KnotsncoBrandHeroProps> = ({
  cartCount,
  onCartClick,
  onSearchClick,
  onUserClick,
  onOpenCategoryDrawer,
  onSelectCategory,
  onCustomOrder,
  onAddToCart,
  onQuickView,
  heroProductsMap,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  return (
    <div className="w-full bg-[#faf4e8] text-[#2b0b12] pt-3 sm:pt-5 pb-8 sm:pb-12 px-3 sm:px-6 lg:px-8 font-sans selection:bg-[#841724] selection:text-[#faedd3]">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP EDITORIAL META FRAME: "[ COLLECTION 2026 ]" & BRAND         */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[11px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#841724]/80 px-2 sm:px-4 mb-3 sm:mb-4 select-none">
        <div className="flex items-center gap-2">
          <span className="font-semibold">[ ATELIER COLLECTION 2026 ]</span>
          <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-[#841724]/40" />
          <span className="hidden md:inline text-[10px] tracking-widest text-[#7c5c62] font-sans font-medium">SURAT CRAFTED • 100% HANDMADE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[10px] font-sans font-bold tracking-widest text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200">
            ● ALL-INDIA DISPATCH 24-48 HRS
          </span>
          <span className="font-extrabold tracking-[0.25em] text-[#841724]">
            KNOTSNCO. STUDIO
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. FLOATING GLASS CAPSULE NAVBAR (WARM CREAM & MAROON PALETTE)     */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-[1440px] mx-auto px-1 sm:px-4 mb-4 sm:mb-6 select-none sticky top-2 sm:top-4 z-40">
        <header className="relative w-full bg-white/95 backdrop-blur-xl border border-[#841724]/12 shadow-[0_8px_30px_rgba(132,23,36,0.06)] rounded-full px-3 sm:px-6 py-2.5 flex items-center justify-between transition-all">
          
          {/* LEFT: Brand Identity & Direct Concierge Contacts */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://wa.me/919999999999?text=Hi%20Knotsnco!%20I'd%20like%20to%20order%20a%20handcrafted%20crochet%20item"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Concierge"
              title="Chat with our artisan team on WhatsApp"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-transform"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
            </a>

            <a
              href="https://www.instagram.com/knotsnco.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Lookbook"
              title="Follow @knotsnco.in on Instagram"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-transform"
            >
              <Instagram className="w-4 h-4 stroke-[2.2]" />
            </a>

            {/* Brand Monogram Tagline on Desktop */}
            <div className="hidden xl:flex flex-col pl-2 border-l border-[#841724]/12 leading-tight">
              <span className="text-[11px] font-black text-[#841724] tracking-wide uppercase">knotsnco.</span>
              <span className="text-[9px] text-[#7c5c62] font-medium">Handmade Happiness</span>
            </div>
          </div>

          {/* CENTER: Clean Minimal Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs lg:text-[13px] font-medium text-[#2b0b12]">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#841724] transition-colors relative py-1 cursor-pointer font-bold text-[#841724]"
            >
              Atelier
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('categories-deck');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#841724] transition-colors relative py-1 cursor-pointer"
            >
              Collections
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('hanging-shelf-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#841724] transition-colors relative py-1 cursor-pointer"
            >
              Hanging Line
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
              <Sparkles className="w-3 h-3 text-[#841724] animate-pulse" />
              <span>Reels</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('reviews-section') || document.getElementById('faq-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#841724] transition-colors relative py-1 cursor-pointer"
            >
              Reviews & FAQs
            </button>
          </nav>

          {/* RIGHT: Search, Account, Mobile Menu & Shopping Bag Pill */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={onSearchClick}
              aria-label="Search catalog"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#faf4e8] hover:bg-[#faedd3] text-[#2b0b12] hover:text-[#841724] flex items-center justify-center transition-colors cursor-pointer border border-[#841724]/10"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </button>

            <button
              onClick={onUserClick}
              aria-label="User Account"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#faf4e8] hover:bg-[#faedd3] text-[#2b0b12] hover:text-[#841724] flex items-center justify-center transition-colors cursor-pointer border border-[#841724]/10"
            >
              <User className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Mobile Category Drawer Trigger */}
            <button
              onClick={onOpenCategoryDrawer}
              aria-label="Browse categories"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#faf4e8] hover:bg-[#faedd3] text-[#2b0b12] hover:text-[#841724] flex items-center justify-center transition-colors cursor-pointer border border-[#841724]/10 md:hidden"
            >
              <Menu className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Shopping Bag Pill Button in Signature Maroon */}
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
      {/* 3. GRAND ROUNDED HERO STAGE (FEATURING HANDMADE HAPPINESS ARTWORK) */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-[1440px] mx-auto select-none">
        <div 
          onClick={() => setActiveHotspot(null)}
          className="relative w-full rounded-[24px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden shadow-2xl border border-[#841724]/15 bg-[#faf4e8]"
        >
          {/* Main Visual: Handmade Happiness Crochet Collection */}
          <div className="relative w-full aspect-[1672/941] sm:aspect-auto sm:h-[calc(100vh-140px)] sm:min-h-[500px] sm:max-h-[860px] overflow-hidden flex items-center justify-center bg-[#faf4e8]">
            <img
              src={heroBannerImg}
              alt="knotsnco. - Handmade Happiness Crochet Collection"
              className="w-full h-full object-cover object-center select-none"
              loading="eager"
            />

            {/* Subtle Gradient Shadow at the bottom for narrative contrast */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#2b0b12]/60 via-[#2b0b12]/20 to-transparent pointer-events-none" />

            {/* Top Atelier Badge */}
            <div className="absolute top-3.5 sm:top-6 left-3.5 sm:left-8 flex items-center gap-2 z-10">
              <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#841724] text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md border border-[#841724]/15">
                <Sparkles className="w-3 h-3 text-[#841724]" />
                <span>100% Handcrafted • Surat Atelier</span>
              </span>
            </div>

            {/* INTERACTIVE HOTSPOT PINS ON THE ACTUAL PRODUCTS */}
            <div className="absolute inset-0 pointer-events-auto">
              {HERO_HOTSPOTS.map((spot) => {
                const product = heroProductsMap[spot.productId];
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
                    {/* Pulsing Hotspot Pin */}
                    <button
                      onMouseEnter={() => setActiveHotspot(spot)}
                      onMouseLeave={() => setActiveHotspot(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(activeHotspot?.id === spot.id ? null : spot);
                      }}
                      className="relative group flex items-center justify-center p-1 sm:p-2 cursor-pointer focus:outline-none"
                      aria-label={`View ${spot.title}`}
                    >
                      <span className="absolute w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-[#841724]/35 animate-ping" />
                      <span className="relative flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#841724] text-[#faedd3] font-bold shadow-md border-[1.5px] sm:border-2 border-[#faedd3] hover:scale-115 active:scale-95 transition-transform">
                        <Heart className="w-2.5 h-2.5 sm:w-3.5 h-3.5 fill-[#faedd3]" />
                      </span>
                    </button>

                    {/* Popup Card */}
                    {isHovered && (
                      <div
                        onMouseEnter={() => setActiveHotspot(spot)}
                        onMouseLeave={() => setActiveHotspot(null)}
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute bottom-full mb-2 ${alignmentClasses} w-48 sm:w-64 max-w-[85vw] bg-[#ffffff] text-[#2b0b12] rounded-2xl shadow-2xl p-2.5 sm:p-3 border border-[#841724]/20 z-30 animate-in fade-in zoom-in-95 duration-200`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#841724] bg-[#841724]/10 px-2 py-0.5 rounded-full">
                              {spot.category}
                            </span>
                            <span className="text-[10px] text-emerald-800 font-bold">
                              In Stock
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveHotspot(null);
                            }}
                            className="text-[#7c5c62] hover:text-[#841724] p-0.5 rounded cursor-pointer"
                            aria-label="Close details"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-[#2b0b12] line-clamp-1">
                          {spot.title}
                        </h4>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#841724]/12">
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
                                className="p-1.5 text-[#841724] hover:bg-[#841724]/10 rounded-lg transition-colors cursor-pointer"
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
                                className="inline-flex items-center gap-1 bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors shadow-xs cursor-pointer"
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

            {/* BOTTOM-LEFT: Romantic Atelier Narrative Copy */}
            <div className="absolute bottom-4 sm:bottom-7 lg:bottom-9 left-4 sm:left-8 lg:left-12 max-w-xs sm:max-w-md lg:max-w-xl z-20 text-white text-left drop-shadow-md">
              <p className="text-xs sm:text-sm lg:text-[15px] font-medium leading-relaxed text-white/95 font-sans">
                Handcrafted with soul by women artisans in Surat. We weave slow, thoughtful crochet fashion, everlasting florals, and heirloom companions meant to be treasured forever.
              </p>
              <div className="mt-1.5 hidden sm:flex items-center gap-3 text-[11px] text-white/85 font-mono tracking-wider uppercase">
                <span>100% Milk Cotton</span>
                <span>•</span>
                <span>Plastic-Free Gifting</span>
                <span>•</span>
                <span>Free Shipping ₹999+</span>
              </div>
            </div>

            {/* BOTTOM-RIGHT: Dual Action Pill Buttons */}
            <div className="absolute bottom-4 sm:bottom-7 lg:bottom-9 right-4 sm:right-8 lg:right-12 z-20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              
              {/* Button 1: Maroon Pill "Explore Collections" */}
              <button
                onClick={() => {
                  const el = document.getElementById('categories-deck') || document.getElementById('hanging-shelf-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#faedd3]/30 group"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Button 2: Crisp White Pill "Custom Orders" */}
              <button
                onClick={onCustomOrder}
                className="bg-white/95 hover:bg-[#faedd3] text-[#841724] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#841724]/20"
              >
                <span>Custom Orders</span>
                <Heart className="w-3.5 h-3.5 fill-[#841724] text-[#841724]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. CURATED ATELIER CATEGORIES DECK (OUR 6 ACTUAL CATEGORIES)        */}
      {/* ------------------------------------------------------------------ */}
      <section id="categories-deck" className="max-w-[1440px] mx-auto mt-10 sm:mt-16 select-none">
        
        {/* Header Row: Title & Action Pill */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-2 sm:px-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#841724] font-black text-[11px] uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>HANDMADE HAPPINESS • ATELIER EDITS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2b0b12]">
              Our Collections
            </h2>
            <p className="text-xs sm:text-sm text-[#7c5c62] mt-1 font-medium">
              Carefully categorized handcrafted crochet • Spreading warmth across homes & wardrobes
            </p>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="self-start sm:self-auto bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>View All (252)</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        {/* 6 Portrait Category Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 px-1 sm:px-2">
          {ATELIER_CATEGORIES.map((cat) => {
            const Icon = cat.icon;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className="group flex flex-col justify-between rounded-[22px] sm:rounded-[26px] p-2.5 sm:p-3 bg-white hover:bg-[#fffdf9] shadow-[0_4px_20px_rgba(132,23,36,0.04)] hover:shadow-[0_16px_36px_rgba(132,23,36,0.12)] border border-[#841724]/12 hover:border-[#841724]/30 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Image Container with Soft Warm Cream Canvas */}
                <div className="relative w-full aspect-[4/5] bg-[#faf4e8] rounded-[18px] sm:rounded-[20px] overflow-hidden flex items-center justify-center p-2 mb-2.5 sm:mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center rounded-[14px] transform group-hover:scale-106 transition-transform duration-500 ease-out select-none"
                    loading="lazy"
                  />

                  {/* Badge */}
                  {cat.badge && (
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#841724] shadow-xs border border-[#841724]/15">
                        {cat.badge}
                      </span>
                    </div>
                  )}

                  {/* Icon Stamp */}
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/95 text-[#841724] flex items-center justify-center shadow-xs border border-[#841724]/15 group-hover:scale-110 transition-transform">
                    <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                </div>

                {/* Category Meta */}
                <div className="px-1 text-center flex flex-col items-center">
                  <h3 className="text-xs sm:text-sm font-bold text-[#2b0b12] group-hover:text-[#841724] transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-[#7c5c62] line-clamp-1 mt-0.5 font-medium">
                    {cat.subtitle}
                  </p>

                  <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-[#841724]/10 text-[11px]">
                    <span className="font-mono text-[#7c5c62] text-[10px]">
                      {cat.itemCount} items
                    </span>
                    <span className="font-black text-[#841724] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      From ₹{cat.startingPrice} →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
