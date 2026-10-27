import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check, 
  Sparkles, 
  Eye,
  Crown,
  ShoppingBag,
  Heart,
  KeyRound,
  Scissors
} from 'lucide-react';
import { Product } from '../data/products';

interface HangingYarnShowcaseProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onBrowseAll: () => void;
}

interface ShelfCategory {
  id: string;
  name: string;
  label: string;
  icon: React.ReactNode;
  filter: (p: Product) => boolean;
}

// Strictly partitioned categories from Shopify catalog (zero overlap, luxury icons with effects)
const SHELF_CATEGORIES: ShelfCategory[] = [
  {
    id: 'picks',
    name: 'All Products',
    label: 'Artisan Picks',
    icon: <Crown className="w-4 h-4 stroke-[2.2]" />,
    filter: (p) => Boolean(p.featuredInHero) || p.badge === 'Artisan Pick' || p.badge === 'Bestseller' || p.badge === 'Best Seller',
  },
  {
    id: 'bags',
    name: 'Bags',
    label: 'Bags & Totes',
    icon: <ShoppingBag className="w-4 h-4 stroke-[2.2]" />,
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return (
        (c === 'bags' || n.includes('tote') || n.includes('potli') || (n.includes('bag') && !n.includes('charm'))) &&
        c !== 'bag charms' &&
        !n.includes('charm') &&
        c !== 'hair accessories' &&
        c !== 'bandanas' &&
        c !== 'earrings' &&
        c !== 'standees' &&
        c !== 'characters'
      );
    },
  },
  {
    id: 'toys',
    name: 'Toys',
    label: 'Toys & Standees',
    icon: <Heart className="w-4 h-4 stroke-[2.2]" />,
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return (
        (c === 'standees' || c === 'characters' || n.includes('standee') || n.includes('plushie')) &&
        c !== 'bags' &&
        c !== 'keychains' &&
        c !== 'hair accessories' &&
        c !== 'bandanas'
      );
    },
  },
  {
    id: 'keychains',
    name: 'Keychains & Bag Charms',
    label: 'Keychains & Charms',
    icon: <KeyRound className="w-4 h-4 stroke-[2.2]" />,
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return (
        (c === 'keychains' || c === 'bag charms' || n.includes('keychain') || n.includes('charm')) &&
        c !== 'bags' &&
        !n.includes('tote') &&
        !n.includes('potli') &&
        c !== 'standees' &&
        c !== 'characters' &&
        c !== 'hair accessories' &&
        c !== 'bandanas'
      );
    },
  },
  {
    id: 'accessories',
    name: 'Accessories',
    label: 'Hair Accessories',
    icon: <Scissors className="w-4 h-4 stroke-[2.2]" />,
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return (
        (c === 'hair accessories' || c === 'bandanas' || c === 'earrings' || n.includes('clip') || n.includes('gajra') || n.includes('bandana')) &&
        c !== 'bags' &&
        c !== 'keychains' &&
        c !== 'bag charms' &&
        c !== 'standees' &&
        c !== 'characters' &&
        !n.includes('charm')
      );
    },
  },
];

// Continuous trust badge ticker items (matching reference image)
const TICKER_ITEMS = [
  'Delivered in 4–7 days across India',
  'Free shipping on orders over ₹999',
  'UPI · Cards · Netbanking · Cash on Delivery',
  'Faulty or wrong — we cover it with instant replacement',
  'Packed plastic-free with eco-conscious care',
  '100% Handcrafted by women artisans in Surat',
  'Soft combed milk cotton yarn made to keep',
];

// Natural variation values for authentic hand-hung clothesline look
const NATURAL_TILTS = [-3.0, 2.6, -1.8, 3.2, -2.4, 2.0, -2.8, 2.2, -1.8, 2.8, -1.6, 2.4];
const NATURAL_STAGGERS = [2, 10, -2, 12, 4, -4, 8, 0, 6, -2, 10, 2];

// Card layout constants (compacted to prevent excessive blank space)
const CARD_WIDTH = 265; // px
const CARD_GAP = 24; // px
const LEFT_PAD = 40; // px

export const HangingYarnShowcase: React.FC<HangingYarnShowcaseProps> = ({
  products,
  onAddToCart,
  onQuickView,
  onBrowseAll,
}) => {
  const [selectedShelfId, setSelectedShelfId] = useState<string>('picks');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Drag & Scroll refs
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Timestamp when the current category was selected to drive smooth transition
  const categorySwitchTimeRef = useRef<number>(performance.now());

  // Interactive physics state held in refs for 60fps / 120fps direct DOM manipulation
  const physicsRef = useRef({
    angle: 0,            // current spring pendulum angle in degrees
    angularVelocity: 0,  // current angular velocity in deg/sec
    targetAngle: 0,      // target angle during drag
    isDragging: false,
    startX: 0,
    scrollStart: 0,
    lastPointerX: 0,
    lastPointerTime: 0,
    dragVelocityX: 0,
    hoveredIndex: null as number | null,
    hoverNudge: 0,
  });

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

  const lastScrollLeftRef = useRef(0);
  const lastScrollTimeRef = useRef(performance.now());

  // Track scroll progress for bottom progress bar & impart physics on mobile touch scroll
  const updateScrollProgress = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
    } else {
      setScrollProgress(Math.min(1, Math.max(0, el.scrollLeft / maxScroll)));
    }

    // Dynamic swing impulse from finger swiping / touch scrolling on mobile
    const currentScroll = el.scrollLeft;
    const currentTime = performance.now();
    const dt = Math.max(1, currentTime - lastScrollTimeRef.current);
    const dx = currentScroll - lastScrollLeftRef.current;
    const scrollVelocity = dx / dt;
    lastScrollLeftRef.current = currentScroll;
    lastScrollTimeRef.current = currentTime;

    if (Math.abs(scrollVelocity) > 0.05) {
      const clamped = Math.max(-14, Math.min(14, -scrollVelocity * 10));
      physicsRef.current.targetAngle = clamped;
      physicsRef.current.angularVelocity += -scrollVelocity * 6;
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateScrollProgress();
    el.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollProgress);
  }, [updateScrollProgress, shelfProducts]);

  // Internal shelf switcher: NO PAGE SCROLLING!
  const handleCategorySwitch = (shelfId: string) => {
    if (selectedShelfId === shelfId) return;
    setSelectedShelfId(shelfId);
    categorySwitchTimeRef.current = performance.now();

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  // -------------------------------------------------------------
  // HIGH-PERFORMANCE PHYSICAL PENDULUM SWAY & GENTLE HANGING TRANSITION
  // -------------------------------------------------------------
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = Math.min(0.04, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const p = physicsRef.current;

      if (p.isDragging) {
        const diff = p.targetAngle - p.angle;
        p.angle += diff * Math.min(1, 14 * dt);
        p.angularVelocity = diff * 8;
      } else {
        const kSpring = 42;
        const kDamping = 4.8;
        const acc = -kSpring * p.angle - kDamping * p.angularVelocity;
        p.angularVelocity += acc * dt;
        p.angle += p.angularVelocity * dt;
      }

      const timeSinceSwitch = (currentTime - categorySwitchTimeRef.current) / 1000;
      const timeSec = currentTime / 1000;

      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        const baseTilt = NATURAL_TILTS[index % NATURAL_TILTS.length];
        const staggerY = NATURAL_STAGGERS[index % NATURAL_STAGGERS.length];
        
        const phase = index * 0.78;
        const ambient = Math.sin(timeSec * 1.5 + phase) * 1.15;

        const waveFactor = Math.cos((p.angle * 0.1) + (index * 0.3));
        const dynamicSway = p.angle * (0.9 + 0.15 * waveFactor);

        const isHovered = p.hoveredIndex === index;
        const hoverLift = isHovered ? -6 : 0;
        const hoverTilt = isHovered ? p.hoverNudge : 0;

        const cardDelay = index * 0.035;
        const cardElapsed = timeSinceSwitch - cardDelay;

        let settleY = 0;
        let cardOpacity = 1;
        let settleSway = 0;

        if (cardElapsed < 0) {
          settleY = -12;
          cardOpacity = 0.2;
          settleSway = -3;
        } else if (cardElapsed < 0.45) {
          const t = cardElapsed / 0.45;
          const decay = Math.exp(-5.5 * t);
          settleY = -12 * decay * Math.cos(t * Math.PI * 2);
          cardOpacity = Math.min(1, 0.2 + cardElapsed * 3.5);
          settleSway = Math.sin(t * Math.PI * 2) * 3 * decay;
        }

        const totalAngle = baseTilt + dynamicSway + ambient + settleSway + hoverTilt;
        const totalY = staggerY + settleY + hoverLift;

        el.style.transform = `translateY(${totalY.toFixed(1)}px) rotate(${totalAngle.toFixed(2)}deg)`;
        el.style.opacity = cardOpacity.toFixed(2);
        el.style.transformOrigin = '50% 0px';
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [shelfProducts]);

  const impartImpulse = (velocityImpulse: number) => {
    const p = physicsRef.current;
    p.angularVelocity += velocityImpulse;
  };

  const handleScrollBy = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardStep = CARD_WIDTH + CARD_GAP;
    const scrollAmount = direction === 'left' ? -cardStep * 1.6 : cardStep * 1.6;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    impartImpulse(direction === 'right' ? -12 : 12);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const p = physicsRef.current;
    p.isDragging = true;
    p.startX = e.pageX - el.offsetLeft;
    p.scrollStart = el.scrollLeft;
    p.lastPointerX = e.pageX;
    p.lastPointerTime = performance.now();
    p.dragVelocityX = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const p = physicsRef.current;
    if (!p.isDragging) return;
    e.preventDefault();
    const el = scrollContainerRef.current;
    if (!el) return;

    const currentX = e.pageX;
    const currentTime = performance.now();
    const dt = Math.max(1, currentTime - p.lastPointerTime);
    const dx = currentX - p.lastPointerX;
    
    p.dragVelocityX = dx / dt;
    p.lastPointerX = currentX;
    p.lastPointerTime = currentTime;

    const x = e.pageX - el.offsetLeft;
    const walk = (x - p.startX) * 1.4;
    el.scrollLeft = p.scrollStart - walk;

    const clampedVelocity = Math.max(-12, Math.min(12, -p.dragVelocityX * 8));
    p.targetAngle = clampedVelocity;
  };

  const handleMouseUpOrLeave = () => {
    const p = physicsRef.current;
    if (!p.isDragging) return;
    p.isDragging = false;
    p.angularVelocity += Math.max(-20, Math.min(20, -p.dragVelocityX * 16));
    p.targetAngle = 0;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const p = physicsRef.current;
    p.isDragging = true;
    p.startX = e.touches[0].pageX - el.offsetLeft;
    p.scrollStart = el.scrollLeft;
    p.lastPointerX = e.touches[0].pageX;
    p.lastPointerTime = performance.now();
    p.dragVelocityX = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const p = physicsRef.current;
    if (!p.isDragging) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    const currentX = e.touches[0].pageX;
    const currentTime = performance.now();
    const dt = Math.max(1, currentTime - p.lastPointerTime);
    const dx = currentX - p.lastPointerX;

    p.dragVelocityX = dx / dt;
    p.lastPointerX = currentX;
    p.lastPointerTime = currentTime;

    const clampedVelocity = Math.max(-14, Math.min(14, -p.dragVelocityX * 8.5));
    p.targetAngle = clampedVelocity;
  };

  const handleTouchEnd = () => {
    const p = physicsRef.current;
    p.isDragging = false;
    p.angularVelocity += Math.max(-20, Math.min(20, -p.dragVelocityX * 16));
    p.targetAngle = 0;
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1200);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    const track = e.currentTarget;
    if (!el || !track) return;
    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetScroll = ratio * (el.scrollWidth - el.clientWidth);
    const scrollDelta = targetScroll - el.scrollLeft;
    el.scrollTo({ left: targetScroll, behavior: 'smooth' });

    impartImpulse(scrollDelta > 0 ? -12 : 12);
  };

  // -------------------------------------------------------------
  // COMPUTE DYNAMIC SAGGING ROPE SVG PATH CONNECTING EVERY CARD PEG
  // -------------------------------------------------------------
  const ropeSvgData = useMemo(() => {
    const count = shelfProducts.length;
    const totalWidth = LEFT_PAD + count * (CARD_WIDTH + CARD_GAP) + 160;

    const pegCoords: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      const x = LEFT_PAD + i * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2;
      const stagger = NATURAL_STAGGERS[i % NATURAL_STAGGERS.length];
      const y = 30 + stagger;
      pegCoords.push({ x, y });
    }

    if (pegCoords.length === 0) return { pathD: '', totalWidth, pegCoords: [] };

    let d = `M 0,22 `;
    const first = pegCoords[0];
    d += `C ${first.x * 0.3},24 ${first.x * 0.7},${first.y + 8} ${first.x},${first.y} `;

    for (let i = 0; i < pegCoords.length - 1; i++) {
      const p1 = pegCoords[i];
      const p2 = pegCoords[i + 1];
      const dx = p2.x - p1.x;
      const sag = 16;
      const cp1x = p1.x + dx * 0.35;
      const cp1y = p1.y + sag;
      const cp2x = p2.x - dx * 0.35;
      const cp2y = p2.y + sag;
      d += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y} `;
    }

    const last = pegCoords[pegCoords.length - 1];
    d += `C ${last.x + 45},${last.y + 10} ${totalWidth - 30},22 ${totalWidth},18`;

    return { pathD: d, totalWidth, pegCoords };
  }, [shelfProducts.length]);

  return (
    <section 
      id="hanging-shelf-section" 
      className="w-full bg-[#faf4e8] text-[#2b0b12] pt-6 sm:pt-8 lg:pt-10 pb-0 relative overflow-hidden select-none font-['DM_Sans',sans-serif] border-t border-[#841724]/10"
    >
      {/* ------------------------------------------------------------- */}
      {/* VIBRANT & RICHER GARDEN WATERCOLOR BACKDROP (CLEARLY VISIBLE) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Wildflower Garden Watercolor Image darkened and contrasted for rich visual presence */}
        <img
          src="/garden-bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-[0.32] mix-blend-multiply filter contrast-[1.06] brightness-[0.92] select-none pointer-events-none"
        />

        {/* Soft edge gradients so the meadow artwork integrates seamlessly with warm cream */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf4e8]/65 via-transparent to-[#faf4e8]/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf4e8]/75 via-transparent to-[#faf4e8]/45" />

        {/* Ambient Whimsical Light Flares */}
        <div className="absolute top-10 right-12 w-80 h-80 rounded-full bg-[#faedd3]/60 blur-3xl" />
        <div className="absolute bottom-6 left-8 w-96 h-96 rounded-full bg-[#f8f0dc]/50 blur-3xl" />
      </div>

      <div className="max-w-[1540px] mx-auto relative z-10 px-3 sm:px-6 lg:px-12 pb-5 sm:pb-7">
        
        {/* TWO-COLUMN LAYOUT: Left Editorial Menu, Right Hanging Clothesline Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: Fresh, Eye-Catchy Editorial Copy & Luxury Vector Icon Menu */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-between pr-0 lg:pr-2 pt-0.5">
            <div>
              {/* Eyebrow - Fresh & Distinctive to Knitknot */}
              <div className="flex items-center gap-2 text-[#841724] font-black text-[11px] uppercase tracking-widest mb-2">
                <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>STITCHED WITH SOUL • SURAT CRAFTED</span>
              </div>

              {/* Headline - Poetic, Memorable & Brand-Unique (Tighter line height and scale) */}
              <h2 className="text-2xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-medium text-[#2b0b12] leading-[1.14] tracking-tight font-serif mb-2.5">
                Knotted with love, <br />
                woven to <br />
                <span className="italic font-normal text-[#841724] font-serif">
                  treasure forever
                </span>
              </h2>

              {/* Subtitle - Inviting & Engaging */}
              <p className="text-xs sm:text-sm text-[#7c5c62] leading-relaxed max-w-md font-medium mb-4">
                Bespoke crochet totes, cuddly companions, and artisanal keepsakes. Glide along the clothesline to discover today's hand-hung pieces.
              </p>

              {/* Mobile Category Pill Bar (Horizontal scroll with touch feedback for small screens) */}
              <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar -mx-2 px-2">
                {SHELF_CATEGORIES.map((shelf) => {
                  const isSelected = selectedShelfId === shelf.id;
                  const count = shelfCounts[shelf.id] || 0;
                  return (
                    <button
                      key={shelf.id}
                      onClick={() => handleCategorySwitch(shelf.id)}
                      type="button"
                      className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#841724] text-[#faedd3] shadow-md border border-[#841724] scale-102'
                          : 'bg-white/80 text-[#2b0b12] border border-[#841724]/15 hover:bg-white'
                      }`}
                    >
                      <span className="w-4 h-4">{shelf.icon}</span>
                      <span>{shelf.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-white/20 text-[#faedd3]' : 'bg-[#841724]/10 text-[#841724]'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Desktop Category Shelves List: Luxury Vector Badges with Micro-Interactions */}
              <div className="hidden lg:block space-y-1 mb-4 max-w-sm">
                {SHELF_CATEGORIES.map((shelf) => {
                  const isSelected = selectedShelfId === shelf.id;
                  const count = shelfCounts[shelf.id] || 0;

                  return (
                    <button
                      key={shelf.id}
                      onMouseEnter={() => handleCategorySwitch(shelf.id)}
                      onClick={() => handleCategorySwitch(shelf.id)}
                      type="button"
                      className={`w-full py-2 px-3 rounded-2xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer group ${
                        isSelected
                          ? 'bg-[#faedd3] text-[#841724] font-extrabold shadow-sm border border-[#841724]/20 translate-x-1'
                          : 'text-[#2b0b12] hover:text-[#841724] hover:bg-[#faedd3]/60 font-serif text-sm sm:text-[14.5px] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Elegant vector icon box with hover pop effect */}
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isSelected 
                            ? 'bg-[#841724] text-[#faedd3] shadow-md scale-105' 
                            : 'bg-[#faedd3]/80 text-[#841724] border border-[#841724]/15 group-hover:bg-[#841724] group-hover:text-[#faedd3] group-hover:scale-110 shadow-xs'
                        }`}>
                          {shelf.icon}
                        </div>

                        <span className={`text-xs sm:text-sm ${isSelected ? 'font-black font-sans tracking-tight' : 'font-serif font-medium'}`}>
                          {shelf.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs">
                        {isSelected ? (
                          <span className="text-[11px] font-black text-[#841724] flex items-center gap-0.5 bg-[#841724]/10 px-2 py-0.5 rounded-full">
                            <span>{count}</span>
                            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
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
              type="button"
              className="inline-flex items-center justify-center gap-2 self-start bg-[#2b0b12] hover:bg-[#841724] text-[#faedd3] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 group"
            >
              <span>Explore all {products.length} creations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* RIGHT COLUMN: The Interactive Hanging Clothesline with Natural Sagging Rope & Smooth Hanging Cards */}
          <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-start relative pt-1">
            
            {/* HORIZONTALLY SCROLLABLE / DRAGGABLE CLOTHESLINE TRACK */}
            <div
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full overflow-x-auto no-scrollbar pt-2 pb-6 px-1 cursor-grab active:cursor-grabbing select-none relative z-10"
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {/* INNER TRACK CONTAINER: Holds the Sagging Rope SVG and Cards in exact unified coordinates */}
              <div 
                className="relative flex items-start"
                style={{ 
                  width: `${ropeSvgData.totalWidth}px`,
                  minHeight: '430px',
                  paddingLeft: `${LEFT_PAD}px`,
                  gap: `${CARD_GAP}px`,
                }}
              >
                {/* 1. SAGGING JUTE ROPE SVG: Flows continuously through every wooden peg notch */}
                <svg
                  className="absolute top-0 left-0 pointer-events-none z-20 overflow-visible"
                  style={{ width: `${ropeSvgData.totalWidth}px`, height: '90px' }}
                >
                  {/* Rope Ambient Cast Shadow */}
                  <path
                    d={ropeSvgData.pathD}
                    fill="none"
                    stroke="rgba(43, 11, 18, 0.14)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="translate-y-1.5 blur-[2px]"
                  />

                  {/* Main Rustic Braided Twine Body */}
                  <path
                    d={ropeSvgData.pathD}
                    fill="none"
                    stroke="#8b3a2b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Braided Cream Yarn Twist Overlay */}
                  <path
                    d={ropeSvgData.pathD}
                    fill="none"
                    stroke="#faedd3"
                    strokeWidth="1.6"
                    strokeDasharray="5 5"
                    strokeLinecap="round"
                  />

                  {/* Deep Shadow Accent Thread */}
                  <path
                    d={ropeSvgData.pathD}
                    fill="none"
                    stroke="#3b151a"
                    strokeWidth="1"
                    strokeDasharray="2 6"
                    strokeLinecap="round"
                  />

                  {/* Little stitched knot accents at each peg contact point */}
                  {ropeSvgData.pegCoords.map((coord, idx) => (
                    <g key={idx} transform={`translate(${coord.x}, ${coord.y})`}>
                      <circle r="3" fill="#8b3a2b" stroke="#faedd3" strokeWidth="1" />
                    </g>
                  ))}
                </svg>

                {/* 2. HANGING POLAROID CARDS (SUSPENDED FIRMLY BY REALISTIC WOODEN CLOTHESPIN PEGS) */}
                {shelfProducts.map((product, index) => {
                  const isJustAdded = justAddedId === product.id;

                  return (
                    <div
                      key={product.id}
                      ref={(el) => {
                        cardRefs.current[index] = el;
                      }}
                      onClick={() => {
                        if (!physicsRef.current.isDragging) {
                          onQuickView(product);
                        }
                      }}
                      onMouseEnter={() => {
                        const p = physicsRef.current;
                        p.hoveredIndex = index;
                        p.hoverNudge = index % 2 === 0 ? -1.8 : 1.8;
                      }}
                      onMouseLeave={() => {
                        const p = physicsRef.current;
                        if (p.hoveredIndex === index) {
                          p.hoveredIndex = null;
                          p.hoverNudge = 0;
                        }
                      }}
                      style={{
                        width: `${CARD_WIDTH}px`,
                        willChange: 'transform, opacity',
                      }}
                      className="shrink-0 relative pt-4 group/card cursor-pointer"
                    >
                      {/* REALISTIC WOODEN CLOTHESPIN PEG CLAMPING THE ROPE & CARD TOP */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center drop-shadow-md">
                        {/* Upper Peg Pinch Handles (clamping onto the rope notch) */}
                        <div className="w-3.5 h-8 rounded-[3px] bg-gradient-to-b from-[#e3b88a] via-[#c9955e] to-[#9c6a3b] border border-[#6b421a]/30 relative shadow-sm flex flex-col justify-between items-center py-1">
                          
                          {/* Center vertical wood grain slit */}
                          <div className="absolute inset-y-1 left-1/2 -translate-x-1/2 w-0.5 bg-[#4a2810]/40 rounded-full" />
                          
                          {/* Metal Spring Wire Ring Clamping the Peg Center */}
                          <div className="w-[16px] h-1.5 bg-gradient-to-r from-[#422c1d] via-[#75553e] to-[#422c1d] rounded-sm border border-black/40 shadow-xs z-10 -my-0.5" />
                          
                          {/* Lower clamping jaws shadow cast directly onto the polaroid card */}
                          <div className="w-3 h-1 bg-[#3a1d0d]/30 rounded-full blur-[0.5px]" />
                        </div>
                      </div>

                      {/* AUTHENTIC TALL POLAROID KEEPSAKE CARD (SUSPENDED EXACTLY ON THE CLIP) */}
                      <div className="mt-2.5 bg-[#faf7f2] rounded-2xl p-2.5 sm:p-3 pb-3.5 border border-[#841724]/12 shadow-[0_12px_30px_-8px_rgba(43,11,18,0.13)] group-hover/card:shadow-[0_22px_44px_-6px_rgba(132,23,36,0.20)] transition-shadow duration-300 flex flex-col justify-between">
                        
                        {/* PHOTO WRAPPER: Compacted Portrait Ratio with Smooth Rounded Corners */}
                        <div className="relative w-full h-[240px] sm:h-[265px] rounded-xl overflow-hidden bg-[#f0e6d6] mb-2.5">
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

                          {/* Top Left Badge (e.g., Artisan Pick, Bestseller) */}
                          {product.badge && (
                            <span className="absolute top-2 left-2 bg-[#841724] text-[#faedd3] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                              {product.badge}
                            </span>
                          )}

                          {/* Hover Quick View Eye Pill */}
                          <div className="opacity-0 group-hover/card:opacity-100 absolute inset-0 bg-[#2b0b12]/30 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-200">
                            <span className="bg-[#faedd3] text-[#841724] font-bold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform scale-90 group-hover/card:scale-100 transition-transform">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Quick View</span>
                            </span>
                          </div>
                        </div>

                        {/* CARD DETAILS ROW: Title, Price & Signature Round Black Action Button */}
                        <div className="flex items-end justify-between gap-2 px-0.5">
                          <div className="flex-1 min-w-0 pr-1">
                            <h4 className="text-xs sm:text-[14px] font-bold text-[#2b0b12] group-hover/card:text-[#841724] transition-colors line-clamp-1 leading-snug">
                              {product.name}
                            </h4>

                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-sm sm:text-[15px] font-black text-[#2b0b12]">
                                ₹{product.price.toLocaleString('en-IN')}
                              </span>
                              {product.originalPrice && (
                                <span className="text-[10.5px] text-[#7c5c62] line-through font-medium">
                                  ₹{product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Signature Round Black Plus Action Button */}
                          <button
                            onClick={(e) => handleQuickAdd(e, product)}
                            type="button"
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer shrink-0 ${
                              isJustAdded
                                ? 'bg-emerald-700 text-white scale-110 shadow-emerald-900/30'
                                : 'bg-[#2b0b12] hover:bg-[#841724] active:scale-95 text-[#faedd3]'
                            }`}
                            title="Quick add to shopping bag"
                            aria-label={`Add ${product.name} to bag`}
                          >
                            {isJustAdded ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : (
                              <Plus className="w-4 h-4 stroke-[2.4]" />
                            )}
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. BOTTOM SLIDER CONTROLS: Arrow Left + Draggable Progress Line + Arrow Right */}
            <div className="flex items-center justify-end gap-3 sm:gap-4 max-w-sm ml-auto px-4 mt-1">
              
              {/* Prev Button with Physical Swing Kick */}
              <button
                onClick={() => handleScrollBy('left')}
                type="button"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#841724]/20 hover:border-[#841724] bg-[#faedd3] hover:bg-[#f8f0dc] text-[#841724] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Previous hanging products"
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
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

              {/* Next Button with Physical Swing Kick */}
              <button
                onClick={() => handleScrollBy('right')}
                type="button"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#841724]/20 hover:border-[#841724] bg-[#faedd3] hover:bg-[#f8f0dc] text-[#841724] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Next hanging products"
              >
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. CONTINUOUS ROTATING MARQUEE TICKER STRIPE (FULL BLEED AT BOTTOM) */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full bg-[#23070d] text-[#faedd3] py-2.5 sm:py-3 overflow-hidden border-t border-[#841724]/20 select-none relative z-20">
        <div className="animate-marquee-ltr flex items-center whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center text-xs sm:text-[13px] font-medium tracking-wide">
              <span className="text-[#faedd3]/95">{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#38b2ac] inline-block mx-4 sm:mx-6 shrink-0 shadow-xs" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
