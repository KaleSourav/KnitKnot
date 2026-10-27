import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check, 
  Star, 
  Sparkles, 
  ShoppingBag,
  Eye,
  Heart
} from 'lucide-react';
import { Product } from '../data/products';

interface HangingYarnShowcaseProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onBrowseAll: () => void;
  onSelectCategory?: (category: string) => void;
}

interface ShelfCategory {
  id: string;
  name: string;
  label: string;
  icon?: string;
  filter: (p: Product) => boolean;
}

const SHELF_CATEGORIES: ShelfCategory[] = [
  {
    id: 'picks',
    name: 'All Products',
    label: 'Artisan Picks',
    icon: '🌸',
    filter: (p) => p.rating >= 4.7 || p.badge === 'Bestseller' || p.badge === 'Artisan Pick' || (p.featuredInHero ?? false),
  },
  {
    id: 'bags',
    name: 'Bags',
    label: 'Bags & Totes',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return c === 'bags' || n.includes('bag') || n.includes('tote');
    },
  },
  {
    id: 'accessories',
    name: 'Accessories',
    label: 'Hair Accessories',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return (
        c === 'hair accessories' ||
        c === 'bandanas' ||
        c === 'earrings' ||
        c === 'accessories' ||
        n.includes('clip') ||
        n.includes('gajra') ||
        n.includes('bandana')
      );
    },
  },
  {
    id: 'flowers',
    name: 'Flowers',
    label: 'Everlasting Flowers',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return (
        c === 'flowers' ||
        c === 'fillers' ||
        c === 'bouquets' ||
        n.includes('rose') ||
        n.includes('lily') ||
        n.includes('tulip') ||
        n.includes('flower') ||
        n.includes('daisy') ||
        n.includes('sunflower')
      );
    },
  },
  {
    id: 'home-decore',
    name: 'Home Decore',
    label: 'Home Decore',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return (
        c === 'standees' ||
        c === 'vases' ||
        c === 'fridge magnets' ||
        c.includes('decor') ||
        n.includes('standee') ||
        n.includes('vase') ||
        n.includes('magnet')
      );
    },
  },
  {
    id: 'flower-pots',
    name: 'Flower Pots',
    label: 'Flower Pots',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return c === 'flower pots' || c.includes('pot') || n.includes('pot');
    },
  },
  {
    id: 'keychains',
    name: 'Keychains & Bag Charms',
    label: 'Keychains & Charms',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return (
        c === 'keychains' ||
        c === 'bag charms' ||
        c.includes('charm') ||
        n.includes('keychain') ||
        n.includes('charm') ||
        n.includes('turtle')
      );
    },
  },
  {
    id: 'under-500',
    name: 'All Products',
    label: 'Under ₹500',
    filter: (p) => p.price <= 500,
  },
];

export const HangingYarnShowcase: React.FC<HangingYarnShowcaseProps> = ({
  products,
  onAddToCart,
  onQuickView,
  onBrowseAll,
  onSelectCategory,
}) => {
  const [selectedShelfId, setSelectedShelfId] = useState<string>('picks');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Drag & Sway Physics State
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [swayAngle, setSwayAngle] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Filter products by selected shelf
  const selectedShelf = useMemo(
    () => SHELF_CATEGORIES.find((s) => s.id === selectedShelfId) || SHELF_CATEGORIES[0],
    [selectedShelfId]
  );

  const shelfProducts = useMemo(() => {
    const list = products.filter(selectedShelf.filter);
    return list.length > 0 ? list : products.slice(0, 12);
  }, [products, selectedShelf]);

  // Compute live counts for each shelf category
  const shelfCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    SHELF_CATEGORIES.forEach((s) => {
      counts[s.id] = products.filter(s.filter).length;
    });
    return counts;
  }, [products]);

  // Update scroll progress (0 to 1) for the custom bottom slider
  const updateScrollProgress = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
    } else {
      setScrollProgress(Math.min(1, Math.max(0, el.scrollLeft / maxScroll)));
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateScrollProgress();
    el.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollProgress);
  }, [updateScrollProgress, shelfProducts]);

  // Smooth scroll left/right arrows
  const handleScrollBy = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = 320;
    const scrollAmount = direction === 'left' ? -cardWidth * 1.5 : cardWidth * 1.5;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Drag-to-scroll via mouse pointer
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollStart(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollContainerRef.current;
    if (!el) return;

    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.4;
    el.scrollLeft = scrollStart - walk;

    // Calculate dynamic sway angle based on drag velocity
    const velocity = (x - startX);
    const clampedAngle = Math.max(-4, Math.min(4, -velocity * 0.08));
    setSwayAngle(clampedAngle);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    // Smoothly settle sway back to 0
    setTimeout(() => {
      setSwayAngle(0);
    }, 150);
  };

  // Touch swipe support for mobile/tablet
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchScrollStart, setTouchScrollStart] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setTouchStartX(e.touches[0].pageX);
    setTouchScrollStart(el.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const currentX = e.touches[0].pageX;
    const diff = (currentX - touchStartX);
    const clampedAngle = Math.max(-3, Math.min(3, -diff * 0.06));
    setSwayAngle(clampedAngle);
  };

  const handleTouchEnd = () => {
    setTimeout(() => setSwayAngle(0), 180);
  };

  // Add to cart with feedback
  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1200);
  };

  // Jump to position on progress track click
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    const track = e.currentTarget;
    if (!el || !track) return;
    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetScroll = ratio * (el.scrollWidth - el.clientWidth);
    el.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  return (
    <section 
      id="hanging-shelf-section" 
      className="w-full bg-[#faf4e8] text-[#2b0b12] py-14 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-12 relative overflow-hidden select-none font-['DM_Sans',sans-serif] border-t border-[#841724]/10"
    >
      {/* Decorative Whimsical Background Elements */}
      <div className="absolute top-10 right-12 w-64 h-64 rounded-full bg-[#faedd3]/70 blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-6 left-8 w-72 h-72 rounded-full bg-[#f8f0dc]/60 blur-3xl pointer-events-none -z-0" />

      <div className="max-w-[1540px] mx-auto relative z-10">
        
        {/* TWO-COLUMN LAYOUT: Left Shelf Selector, Right Hanging Clothesline Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Editorial Typography & Interactive Shelf Category Menu */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-between pr-0 lg:pr-4 pt-1">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 text-[#841724] font-black text-xs uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>HAND-CROCHETED IN INDIA</span>
              </div>

              {/* Headline with Serif Italic Accent (Matching Reference Photo) */}
              <h2 className="text-3xl sm:text-5xl lg:text-[46px] xl:text-[52px] font-medium text-[#2b0b12] leading-[1.12] tracking-tight font-serif mb-4">
                Handmade <br className="hidden sm:inline" />
                crochet, <br />
                <span className="italic font-normal text-[#841724] font-serif">
                  made to keep
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-[#7c5c62] leading-relaxed max-w-md font-medium mb-8">
                Flowers that never wilt, plushies and little gifts. Pick a shelf, then swipe along the line.
              </p>

              {/* Category Shelves List (Matching Reference Image) */}
              <div className="space-y-1 mb-8 max-w-sm">
                {SHELF_CATEGORIES.map((shelf) => {
                  const isSelected = selectedShelfId === shelf.id;
                  const count = shelfCounts[shelf.id] || 0;

                  return (
                    <button
                      key={shelf.id}
                      onClick={() => {
                        setSelectedShelfId(shelf.id);
                        if (onSelectCategory && shelf.name !== 'All Products') {
                          // keep category in sync if needed
                        }
                      }}
                      className={`w-full py-2.5 px-3.5 rounded-2xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer group ${
                        isSelected
                          ? 'bg-[#faedd3] text-[#841724] font-extrabold shadow-sm border border-[#841724]/15 translate-x-1'
                          : 'text-[#2b0b12] hover:text-[#841724] hover:bg-[#faedd3]/50 font-serif text-sm sm:text-base'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {shelf.icon && (
                          <span className="text-sm">{shelf.icon}</span>
                        )}
                        <span className={`text-sm sm:text-[15px] ${isSelected ? 'font-black font-sans' : 'font-serif font-medium'}`}>
                          {shelf.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs">
                        {isSelected ? (
                          <span className="text-xs font-black text-[#841724] flex items-center gap-0.5">
                            <span>{count}</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span className="text-[#7c5c62] group-hover:text-[#841724] text-xs font-mono font-medium">
                            {count > 0 ? count : '→'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Dark Pill CTA Button */}
            <button
              onClick={onBrowseAll}
              className="inline-flex items-center justify-center gap-2 self-start bg-[#2b0b12] hover:bg-[#841724] text-[#faedd3] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 group"
            >
              <span>Shop all {products.length} pieces</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* RIGHT COLUMN: The Interactive Hanging Clothesline / Yarn Rope Gallery */}
          <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-start relative pt-4 sm:pt-6">
            
            {/* 1. ARTISAN BRAIDED YARN ROPE WITH GENTLE SAG & YARN BALL ILLUSTRATION */}
            <div className="relative w-full mb-[-24px] pointer-events-none z-20">
              
              {/* Handcrafted Stitched Yarn Chain Line */}
              <svg 
                viewBox="0 0 1000 48" 
                className="w-full h-8 sm:h-12 overflow-visible stroke-[#841724]/45 fill-none"
                preserveAspectRatio="none"
              >
                {/* Twisted 2-ply yarn effect */}
                <path 
                  d="M0,18 Q250,34 500,26 T1000,18" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeDasharray="6,4"
                  className="stroke-[#9c3b46]"
                />
                <path 
                  d="M0,19 Q250,35 500,27 T1000,19" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  className="stroke-[#faedd3]"
                />

                {/* Decorative Yarn Stitches along the line */}
                {[80, 240, 410, 590, 760, 920].map((cx, i) => (
                  <circle key={i} cx={cx} cy={20 + (i % 2 === 0 ? 4 : 2)} r="2.5" fill="#841724" />
                ))}
              </svg>

              {/* Whimsical Yarn Ball Outline (Matching Reference Sketch Background) */}
              <div className="absolute -top-10 right-16 opacity-25 w-28 h-28 pointer-events-none hidden md:block">
                <svg viewBox="0 0 100 100" fill="none" stroke="#841724" strokeWidth="1.6">
                  <circle cx="50" cy="50" r="38" />
                  <path d="M22,35 C38,18 68,22 80,45" />
                  <path d="M15,55 C30,75 72,78 85,50" />
                  <path d="M35,18 C48,40 54,65 48,85" />
                  <path d="M65,16 C55,42 45,68 62,84" />
                  <path d="M28,78 C52,70 75,58 92,72" />
                </svg>
              </div>
            </div>

            {/* 2. SCROLLABLE / DRAGGABLE CARDS TRACK */}
            <div
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`w-full overflow-x-auto no-scrollbar pt-6 pb-8 px-2 flex gap-5 sm:gap-6 items-start cursor-grab active:cursor-grabbing select-none relative z-10 transition-transform ${
                isDragging ? 'cursor-grabbing' : ''
              }`}
              style={{
                scrollBehavior: isDragging ? 'auto' : 'smooth',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {shelfProducts.map((product, index) => {
                const isJustAdded = justAddedId === product.id;
                // Alternate natural static tilt for whimsical clothesline feel
                const baseTilt = index % 3 === 0 ? -1.2 : index % 3 === 1 ? 1.0 : -0.4;
                const totalRotation = baseTilt + swayAngle;

                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      if (!isDragging) {
                        onQuickView(product);
                      }
                    }}
                    style={{
                      transform: `rotate(${totalRotation}deg)`,
                      transition: isDragging ? 'none' : 'transform 300ms cubic-bezier(0.2, 0.9, 0.3, 1.2), box-shadow 300ms ease',
                    }}
                    className="shrink-0 w-[240px] sm:w-[270px] md:w-[290px] group/card relative pt-4 cursor-pointer"
                  >
                    {/* REALISTIC WOODEN CLOTHESPIN PEG CLAMPING THE CARD */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none drop-shadow-sm group-hover/card:-translate-y-0.5 transition-transform">
                      {/* Top pin head */}
                      <div className="w-3.5 h-7 rounded-sm bg-gradient-to-b from-[#d4a373] via-[#b68250] to-[#8d5b2d] border border-[#6b421a]/30 shadow-xs relative">
                        {/* Metal spring clamp wire */}
                        <div className="absolute top-3 left-[-2px] right-[-2px] h-1.5 bg-[#5c4033] rounded-full border border-black/30" />
                        {/* Wooden groove */}
                        <div className="absolute inset-y-1 left-1.5 w-0.5 bg-black/15" />
                      </div>
                    </div>

                    {/* POLAROID ARTISAN KEEPSAKE CARD */}
                    <div className="bg-[#faf7f2] rounded-2xl sm:rounded-[22px] p-3 sm:p-3.5 pb-4 border border-[#841724]/12 shadow-[0_14px_35px_-10px_rgba(43,11,18,0.14)] hover:shadow-[0_22px_45px_-8px_rgba(132,23,36,0.22)] transition-all duration-300 flex flex-col justify-between">
                      
                      {/* PHOTO WRAPPER WITH NATURAL ASPECT */}
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#f0e6d6] mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          draggable={false}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover/card:scale-106 transition-transform duration-500 pointer-events-none select-none"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/products/bouquet.jpg';
                          }}
                        />

                        {/* Top corner badge if any */}
                        {product.badge && (
                          <span className="absolute top-2 left-2 bg-[#841724] text-[#faedd3] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                            {product.badge}
                          </span>
                        )}

                        {/* Hover Quick View Preview Pill */}
                        <div className="hidden group-hover/card:flex absolute inset-0 bg-[#2b0b12]/30 backdrop-blur-[1.5px] items-center justify-center transition-opacity duration-200">
                          <span className="bg-[#faedd3] text-[#841724] font-bold text-[11px] px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 transform scale-95 group-hover/card:scale-100 transition-transform">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Quick View</span>
                          </span>
                        </div>
                      </div>

                      {/* CARD DETAILS ROW: Title, Price & The Round Dark Plus Button */}
                      <div className="flex items-end justify-between gap-2 px-1">
                        <div className="flex-1 min-w-0 pr-1">
                          <h4 className="text-xs sm:text-sm font-bold text-[#2b0b12] group-hover/card:text-[#841724] transition-colors line-clamp-1 leading-snug">
                            {product.name}
                          </h4>

                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-sm sm:text-base font-black text-[#2b0b12]">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.originalPrice && (
                              <span className="text-[11px] text-[#7c5c62] line-through font-medium">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Round Dark Plus Action Button (Exact Match to Reference Image!) */}
                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer shrink-0 ${
                            isJustAdded
                              ? 'bg-emerald-700 text-white scale-110 shadow-emerald-900/30'
                              : 'bg-[#2b0b12] hover:bg-[#841724] active:scale-95 text-[#faedd3]'
                          }`}
                          title="Quick add to shopping bag"
                          aria-label={`Add ${product.name} to bag`}
                        >
                          {isJustAdded ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
                          )}
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. BOTTOM SLIDER CONTROLS: Arrow Left + Draggable Progress Line + Arrow Right */}
            <div className="flex items-center justify-end gap-3 sm:gap-4 max-w-sm ml-auto px-4 mt-2">
              
              {/* Prev Button */}
              <button
                onClick={() => handleScrollBy('left')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#841724]/20 hover:border-[#841724] bg-[#faedd3] hover:bg-[#f8f0dc] text-[#841724] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Previous hanging products"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Interactive Progress Track */}
              <div 
                onClick={handleTrackClick}
                className="flex-1 h-1.5 bg-[#841724]/15 rounded-full overflow-hidden relative cursor-pointer group/track py-1 -my-1"
                title="Slide along the line"
              >
                <div 
                  className="h-full bg-[#841724] rounded-full transition-all duration-150"
                  style={{ width: `${Math.max(12, scrollProgress * 100)}%` }}
                />
              </div>

              {/* Next Button */}
              <button
                onClick={() => handleScrollBy('right')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#841724]/20 hover:border-[#841724] bg-[#faedd3] hover:bg-[#f8f0dc] text-[#841724] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Next hanging products"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
