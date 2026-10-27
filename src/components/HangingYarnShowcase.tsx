import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check, 
  Sparkles, 
  Eye
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
  icon?: string;
  filter: (p: Product) => boolean;
}

// 4 Selected Categories: Artisan Picks, Keychains, Accessories, and Bags
const SHELF_CATEGORIES: ShelfCategory[] = [
  {
    id: 'picks',
    name: 'All Products',
    label: 'Artisan Picks',
    icon: '🌸',
    filter: (p) => (p.featuredInHero ?? false) || p.badge === 'Artisan Pick' || p.badge === 'Bestseller' || p.rating >= 4.85,
  },
  {
    id: 'keychains',
    name: 'Keychains & Bag Charms',
    label: 'Keychains & Charms',
    icon: '🎀',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      const g = (p.group || '').toLowerCase();
      return (
        c === 'keychains' ||
        c === 'bag charms' ||
        g.includes('keychain') ||
        g.includes('charm') ||
        c.includes('charm') ||
        n.includes('keychain') ||
        n.includes('charm') ||
        n.includes('turtle')
      );
    },
  },
  {
    id: 'accessories',
    name: 'Accessories',
    label: 'Hair Accessories',
    icon: '✨',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      const g = (p.group || '').toLowerCase();
      return (
        c === 'hair accessories' ||
        c === 'bandanas' ||
        c === 'earrings' ||
        c === 'accessories' ||
        g.includes('accessories') ||
        n.includes('clip') ||
        n.includes('gajra') ||
        n.includes('bandana') ||
        n.includes('scrunchie')
      );
    },
  },
  {
    id: 'bags',
    name: 'Bags',
    label: 'Bags & Totes',
    icon: '👜',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      const g = (p.group || '').toLowerCase();
      return c === 'bags' || g.includes('bag') || n.includes('bag') || n.includes('tote');
    },
  },
];

// Natural variation values for authentic hand-hung clothesline look
const NATURAL_TILTS = [-3.0, 2.6, -1.8, 3.2, -2.4, 2.0, -2.8, 2.2, -1.8, 2.8, -1.6, 2.4];
const NATURAL_STAGGERS = [2, 12, -2, 14, 4, -4, 10, 0, 8, -2, 12, 2];

// Card layout constants
const CARD_WIDTH = 280; // px
const CARD_GAP = 28; // px
const LEFT_PAD = 48; // px

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

  // Track scroll progress for bottom progress bar
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

  // Internal shelf switcher: NO PAGE SCROLLING! Updates only the hanging cards and reset line scroll
  const handleCategorySwitch = (shelfId: string) => {
    if (selectedShelfId === shelfId) return;
    setSelectedShelfId(shelfId);
    categorySwitchTimeRef.current = performance.now();

    // Smoothly reset horizontal track to start of the line
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
      const dt = Math.min(0.04, (currentTime - lastTime) / 1000); // capped delta time in seconds
      lastTime = currentTime;

      const p = physicsRef.current;

      if (p.isDragging) {
        // While dragging: spring towards the target drag tilt
        const diff = p.targetAngle - p.angle;
        p.angle += diff * Math.min(1, 14 * dt);
        p.angularVelocity = diff * 8;
      } else {
        // Released or idle: damped harmonic spring oscillator
        const kSpring = 42; // spring stiffness
        const kDamping = 4.8; // air resistance damping
        const acc = -kSpring * p.angle - kDamping * p.angularVelocity;
        p.angularVelocity += acc * dt;
        p.angle += p.angularVelocity * dt;
      }

      // Elapsed time since current category was selected
      const timeSinceSwitch = (currentTime - categorySwitchTimeRef.current) / 1000;
      const timeSec = currentTime / 1000;

      // Update each hanging card's transformation
      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        const baseTilt = NATURAL_TILTS[index % NATURAL_TILTS.length];
        const staggerY = NATURAL_STAGGERS[index % NATURAL_STAGGERS.length];
        
        // Gentle ambient breeze sway (each card has its own slightly out-of-phase frequency)
        const phase = index * 0.78;
        const ambient = Math.sin(timeSec * 1.5 + phase) * 1.15;

        // Wave ripple factor: cards further along the line swing with a tiny delay
        const waveFactor = Math.cos((p.angle * 0.1) + (index * 0.3));
        const dynamicSway = p.angle * (0.9 + 0.15 * waveFactor);

        // Hover effect if this specific card is hovered
        const isHovered = p.hoveredIndex === index;
        const hoverLift = isHovered ? -6 : 0;
        const hoverTilt = isHovered ? p.hoverNudge : 0;

        // GENTLE HANGING ENTRANCE:
        // Each card smoothly fades & settles directly on its clip (max 14px dip)
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
        el.style.transformOrigin = '50% 0px'; // Pivot firmly from top wooden clip
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [shelfProducts]);

  // Impart an impulse (sway swing) down the clothesline
  const impartImpulse = (velocityImpulse: number) => {
    const p = physicsRef.current;
    p.angularVelocity += velocityImpulse;
  };

  // Smooth scroll left/right arrows with dynamic physical swing impulse
  const handleScrollBy = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardStep = CARD_WIDTH + CARD_GAP;
    const scrollAmount = direction === 'left' ? -cardStep * 1.6 : cardStep * 1.6;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    impartImpulse(direction === 'right' ? -12 : 12);
  };

  // Drag-to-scroll via mouse pointer with fluid physics
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

  // Touch swipe support for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const p = physicsRef.current;
    p.isDragging = true;
    p.lastPointerX = e.touches[0].pageX;
    p.lastPointerTime = performance.now();
    p.dragVelocityX = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const p = physicsRef.current;
    if (!p.isDragging) return;
    const currentX = e.touches[0].pageX;
    const currentTime = performance.now();
    const dt = Math.max(1, currentTime - p.lastPointerTime);
    const dx = currentX - p.lastPointerX;

    p.dragVelocityX = dx / dt;
    p.lastPointerX = currentX;
    p.lastPointerTime = currentTime;

    const clampedVelocity = Math.max(-10, Math.min(10, -p.dragVelocityX * 7));
    p.targetAngle = clampedVelocity;
  };

  const handleTouchEnd = () => {
    const p = physicsRef.current;
    p.isDragging = false;
    p.angularVelocity += Math.max(-18, Math.min(18, -p.dragVelocityX * 14));
    p.targetAngle = 0;
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
      const y = 32 + stagger; // exact height where the clothespin peg notch clamps the rope
      pegCoords.push({ x, y });
    }

    if (pegCoords.length === 0) return { pathD: '', totalWidth, pegCoords: [] };

    let d = `M 0,24 `;
    const first = pegCoords[0];
    d += `C ${first.x * 0.3},26 ${first.x * 0.7},${first.y + 10} ${first.x},${first.y} `;

    for (let i = 0; i < pegCoords.length - 1; i++) {
      const p1 = pegCoords[i];
      const p2 = pegCoords[i + 1];
      const dx = p2.x - p1.x;
      const sag = 18; // Natural catenary drape sag
      const cp1x = p1.x + dx * 0.35;
      const cp1y = p1.y + sag;
      const cp2x = p2.x - dx * 0.35;
      const cp2y = p2.y + sag;
      d += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y} `;
    }

    const last = pegCoords[pegCoords.length - 1];
    d += `C ${last.x + 50},${last.y + 12} ${totalWidth - 30},24 ${totalWidth},20`;

    return { pathD: d, totalWidth, pegCoords };
  }, [shelfProducts.length]);

  return (
    <section 
      id="hanging-shelf-section" 
      className="w-full bg-[#faf4e8] text-[#2b0b12] py-14 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-12 relative overflow-hidden select-none font-['DM_Sans',sans-serif] border-t border-[#841724]/10"
    >
      {/* ------------------------------------------------------------- */}
      {/* SUBTLE, LIGHT GARDEN WATERCOLOR BACKDROP (GENTLE & AIRY) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Wildflower Garden Watercolor Image at gentle opacity */}
        <img
          src="/garden-bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-[0.14] mix-blend-multiply filter contrast-[0.92] brightness-[1.08] select-none pointer-events-none"
        />

        {/* Delicate Gradient Masks to blend seamlessly into the warm cream tones */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf4e8]/90 via-transparent to-[#faf4e8]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf4e8]/95 via-transparent to-[#faf4e8]/80" />

        {/* Ambient Whimsical Light Flares */}
        <div className="absolute top-10 right-12 w-80 h-80 rounded-full bg-[#faedd3]/70 blur-3xl" />
        <div className="absolute bottom-6 left-8 w-96 h-96 rounded-full bg-[#f8f0dc]/60 blur-3xl" />
      </div>

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

              {/* Category Shelves List: Artisan Picks, Keychains, Accessories, and Bags */}
              <div className="space-y-1.5 mb-8 max-w-sm">
                {SHELF_CATEGORIES.map((shelf) => {
                  const isSelected = selectedShelfId === shelf.id;
                  const count = shelfCounts[shelf.id] || 0;

                  return (
                    <button
                      key={shelf.id}
                      onMouseEnter={() => handleCategorySwitch(shelf.id)}
                      onClick={() => handleCategorySwitch(shelf.id)}
                      type="button"
                      className={`w-full py-3 px-4 rounded-2xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer group ${
                        isSelected
                          ? 'bg-[#faedd3] text-[#841724] font-extrabold shadow-sm border border-[#841724]/20 translate-x-1.5'
                          : 'text-[#2b0b12] hover:text-[#841724] hover:bg-[#faedd3]/60 font-serif text-sm sm:text-base border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {shelf.icon && (
                          <span className="text-base">{shelf.icon}</span>
                        )}
                        <span className={`text-sm sm:text-[15px] ${isSelected ? 'font-black font-sans tracking-tight' : 'font-serif font-medium'}`}>
                          {shelf.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs">
                        {isSelected ? (
                          <span className="text-xs font-black text-[#841724] flex items-center gap-1 bg-[#841724]/10 px-2.5 py-0.5 rounded-full">
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
              className="inline-flex items-center justify-center gap-2 self-start bg-[#2b0b12] hover:bg-[#841724] text-[#faedd3] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 group"
            >
              <span>Shop all {products.length} pieces</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* RIGHT COLUMN: The Interactive Hanging Clothesline with Natural Sagging Rope & Smooth Hanging Cards */}
          <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-start relative pt-2">
            
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
              className="w-full overflow-x-auto no-scrollbar pt-4 pb-12 px-2 cursor-grab active:cursor-grabbing select-none relative z-10"
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {/* INNER TRACK CONTAINER: Holds the Sagging Rope SVG and Cards in exact unified coordinates */}
              <div 
                className="relative flex items-start"
                style={{ 
                  width: `${ropeSvgData.totalWidth}px`,
                  minHeight: '480px',
                  paddingLeft: `${LEFT_PAD}px`,
                  gap: `${CARD_GAP}px`,
                }}
              >
                {/* 1. SAGGING JUTE ROPE SVG: Flows continuously through every wooden peg notch */}
                <svg
                  className="absolute top-0 left-0 pointer-events-none z-20 overflow-visible"
                  style={{ width: `${ropeSvgData.totalWidth}px`, height: '110px' }}
                >
                  {/* Rope Ambient Cast Shadow */}
                  <path
                    d={ropeSvgData.pathD}
                    fill="none"
                    stroke="rgba(43, 11, 18, 0.12)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="translate-y-2 blur-[2px]"
                  />

                  {/* Main Rustic Braided Twine Body */}
                  <path
                    d={ropeSvgData.pathD}
                    fill="none"
                    stroke="#8b3a2b"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Braided Cream Yarn Twist Overlay */}
                  <path
                    d={ropeSvgData.pathD}
                    fill="none"
                    stroke="#faedd3"
                    strokeWidth="1.8"
                    strokeDasharray="6 5"
                    strokeLinecap="round"
                  />

                  {/* Deep Shadow Accent Thread */}
                  <path
                    d={ropeSvgData.pathD}
                    fill="none"
                    stroke="#3b151a"
                    strokeWidth="1"
                    strokeDasharray="2 7"
                    strokeLinecap="round"
                  />

                  {/* Little stitched knot accents at each peg contact point */}
                  {ropeSvgData.pegCoords.map((coord, idx) => (
                    <g key={idx} transform={`translate(${coord.x}, ${coord.y})`}>
                      <circle r="3.5" fill="#8b3a2b" stroke="#faedd3" strokeWidth="1" />
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
                        p.hoverNudge = index % 2 === 0 ? -2.0 : 2.0;
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
                      className="shrink-0 relative pt-5 group/card cursor-pointer"
                    >
                      {/* REALISTIC WOODEN CLOTHESPIN PEG CLAMPING THE ROPE & CARD TOP */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center drop-shadow-md">
                        {/* Upper Peg Pinch Handles (clamping onto the rope notch) */}
                        <div className="w-4 h-9 rounded-[3px] bg-gradient-to-b from-[#e3b88a] via-[#c9955e] to-[#9c6a3b] border border-[#6b421a]/30 relative shadow-sm flex flex-col justify-between items-center py-1">
                          
                          {/* Center vertical wood grain slit */}
                          <div className="absolute inset-y-1 left-1/2 -translate-x-1/2 w-0.5 bg-[#4a2810]/40 rounded-full" />
                          
                          {/* Metal Spring Wire Ring Clamping the Peg Center */}
                          <div className="w-[18px] h-2 bg-gradient-to-r from-[#422c1d] via-[#75553e] to-[#422c1d] rounded-sm border border-black/40 shadow-xs z-10 -my-0.5" />
                          
                          {/* Lower clamping jaws shadow cast directly onto the polaroid card */}
                          <div className="w-3.5 h-1.5 bg-[#3a1d0d]/30 rounded-full blur-[0.5px]" />
                        </div>
                      </div>

                      {/* AUTHENTIC TALL POLAROID KEEPSAKE CARD (SUSPENDED EXACTLY ON THE CLIP) */}
                      <div className="mt-3 bg-[#faf7f2] rounded-2xl p-3 pb-4 border border-[#841724]/12 shadow-[0_14px_35px_-8px_rgba(43,11,18,0.14)] group-hover/card:shadow-[0_24px_48px_-6px_rgba(132,23,36,0.22)] transition-shadow duration-300 flex flex-col justify-between">
                        
                        {/* PHOTO WRAPPER: Portrait Ratio (approx 3:4) with Smooth Rounded Corners */}
                        <div className="relative w-full h-[270px] sm:h-[295px] rounded-xl overflow-hidden bg-[#f0e6d6] mb-3">
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
                            <span className="absolute top-2.5 left-2.5 bg-[#841724] text-[#faedd3] text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                              {product.badge}
                            </span>
                          )}

                          {/* Hover Quick View Eye Pill */}
                          <div className="opacity-0 group-hover/card:opacity-100 absolute inset-0 bg-[#2b0b12]/30 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-200">
                            <span className="bg-[#faedd3] text-[#841724] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform scale-90 group-hover/card:scale-100 transition-transform">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Quick View</span>
                            </span>
                          </div>
                        </div>

                        {/* CARD DETAILS ROW: Title, Price & Signature Round Black Action Button */}
                        <div className="flex items-end justify-between gap-2 px-1">
                          <div className="flex-1 min-w-0 pr-1">
                            <h4 className="text-sm sm:text-[15px] font-bold text-[#2b0b12] group-hover/card:text-[#841724] transition-colors line-clamp-1 leading-snug">
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

                          {/* Signature Round Black Plus Action Button */}
                          <button
                            onClick={(e) => handleQuickAdd(e, product)}
                            type="button"
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
            </div>

            {/* 3. BOTTOM SLIDER CONTROLS: Arrow Left + Draggable Progress Line + Arrow Right */}
            <div className="flex items-center justify-end gap-3 sm:gap-4 max-w-sm ml-auto px-4 mt-2">
              
              {/* Prev Button with Physical Swing Kick */}
              <button
                onClick={() => handleScrollBy('left')}
                type="button"
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

              {/* Next Button with Physical Swing Kick */}
              <button
                onClick={() => handleScrollBy('right')}
                type="button"
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
