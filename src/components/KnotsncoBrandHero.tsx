/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Knotsnco — World Portal Hero Section
 * Converted from the 3D Planet Jumping experience into a luxury handmade
 * Gen-Z editorial atelier. Features 3D perspective portal canvas tilt,
 * seamless universe expansion transitions, world switching, and artisan facts.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Flower2,
  Heart,
  ShoppingBag,
  Eye,
  Compass,
  Check,
} from 'lucide-react';
import { Product } from '../data/products';

export interface KnotsncoBrandHeroProps {
  onExplore?: () => void;
  onMakeBouquet?: () => void;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  featuredProduct?: Product;
  products?: Product[];
  cartCount?: number;
  onCartClick?: () => void;
  onSearchClick?: () => void;
  onUserClick?: () => void;
  onOpenCategoryDrawer?: () => void;
  onSelectCategory?: (categoryName: string) => void;
  onCustomOrder?: () => void;
  heroProductsMap?: { [key: string]: Product };
}

/* ─── WORLD DATA MODEL ────────────────────────────────────────── */

interface WorldState {
  id: string;
  number: string;
  name: string;
  headline: string;
  tagline: string;
  handwritten: string;
  description: string;
  categorySlug: string;
  categoryName: string;
  bgImage: string;
  portalImage: string;
  accentColor: string;
  nextId: string;
  featuredPrice: number;
  facts: [string, string][];
}

const WORLDS: Record<string, WorldState> = {
  blooms: {
    id: 'blooms',
    number: '[01]',
    name: 'Everlasting Blooms',
    headline: 'BLOOMS',
    tagline: 'Everlasting Crochet Bouquets',
    handwritten: 'Flowers that never ghost you ♡',
    description:
      'Stitched petal by petal with ultra-soft milk cotton yarn. Zero watering, zero wilting — handcrafted to stay blooming forever.',
    categorySlug: 'flowers',
    categoryName: 'Flowers',
    bgImage: '/bloom/hero-sky-bouquet.jpg',
    portalImage: '/bloom/bouquet-summer-tulips.jpg',
    accentColor: '#F5C4D5',
    nextId: 'pots',
    featuredPrice: 1499,
    facts: [
      ['Slow Crafted:', 'By our master Dadis in Surat, Gujarat.'],
      ['Yarn Blend:', '100% Combed milk-cotton yarn.'],
      ['Stitch Count:', '~1,850 handmade stitches per bouquet.'],
      ['Care:', 'Forever fresh — never needs water.'],
    ],
  },
  pots: {
    id: 'pots',
    number: '[02]',
    name: 'Desktop Flower Pots',
    headline: 'POTS',
    tagline: 'Hand-Knitted Desk Companions',
    handwritten: 'Desk companions that bring sunshine indoors ✿',
    description:
      'Weighted ceramic planters filled with hand-crocheted soil and flexible iron-core stems that bring daily warmth and gentle serotonin.',
    categorySlug: 'flower-pots',
    categoryName: 'Flower Pots',
    bgImage: '/bloom/bouquet-summer-tulips.jpg',
    portalImage: '/products/tote.jpg',
    accentColor: '#F5DD91',
    nextId: 'totes',
    featuredPrice: 799,
    facts: [
      ['Placement:', 'Study desks, bedside tables & vanity mirrors.'],
      ['Base:', 'Weighted ceramic planter with crochet soil.'],
      ['Stems:', 'Flexible iron-core for playful posing.'],
      ['Vibe:', 'Instant mood booster & daily serotonin.'],
    ],
  },
  totes: {
    id: 'totes',
    number: '[03]',
    name: 'Granny Square Bags',
    headline: 'TOTES',
    tagline: 'Handmade Bohemian Totes',
    handwritten: 'Vintage bohemian soul, modern Gen-Z charm ✦',
    description:
      'Authentic 1970s floral granny-square motifs reimagined as durable shoulder totes. Spacious enough for your daily essentials.',
    categorySlug: 'bags',
    categoryName: 'Bags',
    bgImage: '/products/tote.jpg',
    portalImage: '/products/bunny.jpg',
    accentColor: '#C5E7D4',
    nextId: 'charms',
    featuredPrice: 1299,
    facts: [
      ['Motif:', 'Hand-assembled 1970s floral granny squares.'],
      ['Capacity:', 'Laptop & tablet ready with reinforced straps.'],
      ['Artisan Time:', '12+ hours of slow artisan needlework.'],
      ['Material:', 'Natural breathable combed cotton yarn.'],
    ],
  },
  charms: {
    id: 'charms',
    number: '[04]',
    name: 'Keychains & Charms',
    headline: 'CHARMS',
    tagline: 'Amigurumi Companions & Charms',
    handwritten: 'Pocket-sized yarn joy to take everywhere 🧸',
    description:
      'Adorable amigurumi fruit turtles, strawberries, and soft bunnies to clip on your keys, tote bag, or backpack for extra cheer.',
    categorySlug: 'keychains-and-bag-charms',
    categoryName: 'Keychains & Bag Charms',
    bgImage: '/products/bunny.jpg',
    portalImage: '/bloom/hero-sky-bouquet.jpg',
    accentColor: '#BBDDEB',
    nextId: 'blooms',
    featuredPrice: 349,
    facts: [
      ['Details:', 'Miniature strawberries, bunnies & plushies.'],
      ['Hardware:', 'Anti-tarnish luxury gold-plated lobster clasp.'],
      ['Gifting:', 'The sweetest "thinking of you" token.'],
      ['Care:', 'Spot clean with gentle damp cloth.'],
    ],
  },
};

const WORLD_KEYS = ['blooms', 'pots', 'totes', 'charms'];

export function KnotsncoBrandHero({
  onExplore,
  onMakeBouquet,
  onQuickView,
  onAddToCart,
  products = [],
  onSelectCategory,
  onCustomOrder,
}: KnotsncoBrandHeroProps) {
  const [currentId, setCurrentId] = useState<string>('blooms');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [expansionProgress, setExpansionProgress] = useState<number>(0);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHoveringPortal, setIsHoveringPortal] = useState<boolean>(false);
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);

  // References for Canvas and 3D Tilt
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const portalRef = useRef<HTMLButtonElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Preloaded image cache
  const imagesCacheRef = useRef<Record<string, HTMLImageElement>>({});

  // Physics & Animation state refs
  const rotXRef = useRef<number>(0);
  const rotYRef = useRef<number>(0);
  const targetXRef = useRef<number>(0);
  const targetYRef = useRef<number>(0);
  const expansionRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  const currentWorld = WORLDS[currentId] || WORLDS.blooms;
  const nextWorld = WORLDS[currentWorld.nextId] || WORLDS.pots;

  /* ─── IMAGE PRELOADING ────────────────────────────────────────── */
  useEffect(() => {
    Object.values(WORLDS).forEach((world) => {
      [world.bgImage, world.portalImage].forEach((src) => {
        if (!imagesCacheRef.current[src]) {
          const img = new Image();
          img.src = src;
          imagesCacheRef.current[src] = img;
        }
      });
    });
  }, []);

  /* ─── 3D CANVAS DRAW LOOP ─────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;
    let lastTime = performance.now();

    const resize = () => {
      if (!canvas || !heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const drawCover = (img: HTMLImageElement, targetCtx: CanvasRenderingContext2D, wBound: number, hBound: number) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      const scale = Math.max(wBound / nw, hBound / nh);
      const w = nw * scale;
      const h = nh * scale;
      const x = (wBound - w) / 2;
      const y = (hBound - h) / 2;
      targetCtx.drawImage(img, x, y, w, h);
    };

    const loop = (now: number) => {
      if (!isMounted) return;
      const dt = Math.min(40, now - lastTime);
      lastTime = now;

      // Pointer tilt interpolation
      rotXRef.current += (targetXRef.current - rotXRef.current) * Math.min(1, dt * 0.009);
      rotYRef.current += (targetYRef.current - rotYRef.current) * Math.min(1, dt * 0.009);

      if (heroRef.current && canvas) {
        const heroRect = heroRef.current.getBoundingClientRect();
        const heroW = heroRect.width;
        const heroH = heroRect.height;

        ctx.clearRect(0, 0, heroW, heroH);

        if (portalRef.current) {
          const pRect = portalRef.current.getBoundingClientRect();
          // Portal position relative to hero container
          const rectLeft = pRect.left - heroRect.left;
          const rectTop = pRect.top - heroRect.top;
          const rectCx = rectLeft + pRect.width / 2;
          const rectCy = rectTop + pRect.height / 2;

          const e = expansionRef.current; // 0..1 during transition
          const cx = rectCx + (heroW / 2 - rectCx) * e;
          const cy = rectCy + (heroH / 2 - rectCy) * e;
          const baseW = pRect.width + (heroW - pRect.width) * e;
          const baseH = pRect.height + (heroH - pRect.height) * e;

          const w = baseW;
          const h = baseH;
          const r = Math.max(0, 36 * (1 - e));
          const rx = rotXRef.current * (1 - e);
          const ry = rotYRef.current * (1 - e);

          if (w > 2 && h > 2) {
            const clampedR = Math.max(0, Math.min(r, w / 2, h / 2));
            const corners = [
              { cx: w / 2 - clampedR, cy: -h / 2 + clampedR, start: -Math.PI / 2, end: 0 },
              { cx: w / 2 - clampedR, cy: h / 2 - clampedR, start: 0, end: Math.PI / 2 },
              { cx: -w / 2 + clampedR, cy: h / 2 - clampedR, start: Math.PI / 2, end: Math.PI },
              { cx: -w / 2 + clampedR, cy: -h / 2 + clampedR, start: Math.PI, end: Math.PI * 1.5 },
            ];

            const ax = (rx * Math.PI) / 180;
            const ay = (ry * Math.PI) / 180;
            const cosAx = Math.cos(ax);
            const sinAx = Math.sin(ax);
            const cosAy = Math.cos(ay);
            const sinAy = Math.sin(ay);

            ctx.beginPath();
            let first = true;
            for (const corner of corners) {
              for (let i = 0; i <= 8; i++) {
                const angle = corner.start + (corner.end - corner.start) * (i / 8);
                const lx = corner.cx + clampedR * Math.cos(angle);
                const ly = corner.cy + clampedR * Math.sin(angle);

                // 3D Perspective Projection (Focal length: 850)
                const xx = lx * cosAy;
                const yy = ly * cosAx;
                const z = lx * sinAy - ly * sinAx;
                const p = 850 / (850 + z);
                const sx = cx + xx * p;
                const sy = cy + yy * p;

                if (first) {
                  ctx.moveTo(sx, sy);
                  first = false;
                } else {
                  ctx.lineTo(sx, sy);
                }
              }
            }
            ctx.closePath();

            // Clip and draw image inside 3D portal
            ctx.save();
            ctx.clip();

            // Background fill behind image
            ctx.fillStyle = '#3D0911';
            ctx.fillRect(0, 0, heroW, heroH);

            const activePortalImg = imagesCacheRef.current[nextWorld.bgImage] || imagesCacheRef.current[nextWorld.portalImage];
            if (activePortalImg) {
              drawCover(activePortalImg, ctx, heroW, heroH);
            }

            // Warm gradient wash overlay
            const grad = ctx.createLinearGradient(0, cy - h / 2, 0, cy + h / 2);
            grad.addColorStop(0, 'rgba(129, 27, 43, 0.05)');
            grad.addColorStop(1, 'rgba(61, 9, 17, 0.45)');
            ctx.fillStyle = grad;
            ctx.fillRect(cx - w / 2, cy - h / 2, w, h);

            ctx.restore();

            // Delicate gold/cream border if not fully expanded
            if (e < 0.95) {
              ctx.save();
              ctx.strokeStyle = 'rgba(255, 245, 204, 0.85)';
              ctx.lineWidth = 2.5;
              ctx.shadowColor = 'rgba(129, 27, 43, 0.5)';
              ctx.shadowBlur = 18;
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', resize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [nextWorld]);

  /* ─── MOUSE POINTER TILT HANDLER ─────────────────────────────── */
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!heroRef.current || isTransitioning) return;
    const rect = heroRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    setCursorPos({ x: e.clientX, y: e.clientY });

    const normX = relX / rect.width - 0.5;
    const normY = relY / rect.height - 0.5;

    targetYRef.current = normX * 32;
    targetXRef.current = normY * -28;
  }, [isTransitioning]);

  const handlePointerLeave = useCallback(() => {
    targetXRef.current = 0;
    targetYRef.current = 0;
    setIsHoveringPortal(false);
  }, []);

  /* ─── WORLD TRAVEL TRANSITION ────────────────────────────────── */
  const travelToWorld = useCallback((targetWorldId: string) => {
    if (isTransitioning || targetWorldId === currentId) return;
    setIsTransitioning(true);
    targetXRef.current = 0;
    targetYRef.current = 0;

    // Smooth cubic-bezier expansion animation (portal expands to full hero view)
    const duration = 750;
    const start = performance.now();

    const animateExpansion = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease in-out cubic
      const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      expansionRef.current = eased;
      setExpansionProgress(eased);

      if (progress < 1) {
        requestAnimationFrame(animateExpansion);
      } else {
        // Commit new world
        setCurrentId(targetWorldId);

        // Shrink back
        setTimeout(() => {
          const shrinkStart = performance.now();
          const shrinkDur = 650;

          const animateShrink = (shrinkNow: number) => {
            const shrinkElapsed = shrinkNow - shrinkStart;
            const shrinkProgress = Math.min(1, shrinkElapsed / shrinkDur);
            const shrinkEased = 1 - (shrinkProgress < 0.5 ? 4 * shrinkProgress * shrinkProgress * shrinkProgress : 1 - Math.pow(-2 * shrinkProgress + 2, 3) / 2);

            expansionRef.current = shrinkEased;
            setExpansionProgress(shrinkEased);

            if (shrinkProgress < 1) {
              requestAnimationFrame(animateShrink);
            } else {
              expansionRef.current = 0;
              setExpansionProgress(0);
              setIsTransitioning(false);
            }
          };

          requestAnimationFrame(animateShrink);
        }, 120);
      }
    };

    requestAnimationFrame(animateExpansion);
  }, [currentId, isTransitioning]);

  /* ─── QUICK ACTIONS ─────────────────────────────────────────── */
  const handleShopCurrentWorld = () => {
    if (onSelectCategory) {
      onSelectCategory(currentWorld.categoryName);
    } else if (onExplore) {
      onExplore();
    }
  };

  const handleQuickViewCurrent = () => {
    if (onQuickView) {
      const match = products.find((p) => p.category.toLowerCase().includes(currentWorld.categorySlug) || p.name.toLowerCase().includes(currentWorld.headline.toLowerCase()));
      const fallbackProduct: Product = match || {
        id: `hero-${currentWorld.id}`,
        name: currentWorld.tagline,
        category: currentWorld.categoryName,
        price: currentWorld.featuredPrice,
        originalPrice: Math.round(currentWorld.featuredPrice * 1.25),
        image: currentWorld.bgImage,
        rating: 5.0,
        reviewsCount: 42,
        badge: 'Artisan Signature',
        description: currentWorld.description,
        details: currentWorld.facts.map(([k, v]) => `${k} ${v}`),
        inStock: true,
      };
      onQuickView(fallbackProduct);
    }
  };

  const handleAddToCartCurrent = () => {
    if (onAddToCart) {
      const match = products.find((p) => p.category.toLowerCase().includes(currentWorld.categorySlug) || p.name.toLowerCase().includes(currentWorld.headline.toLowerCase()));
      const fallbackProduct: Product = match || {
        id: `hero-${currentWorld.id}`,
        name: currentWorld.tagline,
        category: currentWorld.categoryName,
        price: currentWorld.featuredPrice,
        originalPrice: Math.round(currentWorld.featuredPrice * 1.25),
        image: currentWorld.bgImage,
        rating: 5.0,
        reviewsCount: 42,
        badge: 'Artisan Signature',
        description: currentWorld.description,
        details: currentWorld.facts.map(([k, v]) => `${k} ${v}`),
        inStock: true,
      };
      onAddToCart(fallbackProduct, 1);
      setIsAddedFeedback(true);
      setTimeout(() => setIsAddedFeedback(false), 1500);
    }
  };

  return (
    <div
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, #4A0E18 0%, #35060D 50%, #200307 100%)',
        color: '#FFF5CC',
      }}
    >
      {/* ── BACKGROUND ACTIVE UNIVERSE IMAGE & VIDEO LAYER ────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Background photo of current universe with smooth cross-fade */}
        <motion.div
          key={currentWorld.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.35, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${currentWorld.bgImage})`,
            filter: 'blur(3px)',
          }}
        />

        {/* Ambient Dark Velvet Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(129,27,43,0.3) 0%, rgba(32,3,7,0.85) 75%, #180205 100%)',
          }}
        />

        {/* Floating Ambient Yarn Particles & Hearts */}
        {[
          { top: '15%', left: '8%', size: '14px', emoji: '✿', dur: 7 },
          { top: '22%', right: '12%', size: '18px', emoji: '♡', dur: 6.5 },
          { top: '68%', left: '10%', size: '12px', emoji: '✦', dur: 8 },
          { top: '75%', right: '15%', size: '16px', emoji: '✿', dur: 7.2 },
          { top: '40%', right: '28%', size: '11px', emoji: '♡', dur: 9 },
        ].map((p, idx) => (
          <motion.span
            key={idx}
            animate={{
              y: [-12, 12, -12],
              rotate: [0, 15, -15, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute pointer-events-none select-none"
            style={{
              top: p.top,
              left: p.left,
              right: (p as any).right,
              fontSize: p.size,
              color: currentWorld.accentColor,
            }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </div>

      {/* ── 3D CANVAS FOR TILTED PORTAL WINDOW ──────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* ── TOP CAPSULE HEADER BAR ──────────────────────────────────── */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#FFF5CC]/20 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: currentWorld.accentColor }} />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFF5CC]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Knotsnco Handmade Universes
          </span>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex items-center gap-2">
          {onMakeBouquet && (
            <button
              onClick={onMakeBouquet}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-[#FFF5CC] text-[#811B2B] hover:bg-[#F5DD91] hover:scale-105 shadow-sm cursor-pointer"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              <Flower2 className="w-3.5 h-3.5" />
              <span>BYOB Studio</span>
            </button>
          )}

          <button
            onClick={handleShopCurrentWorld}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all border border-[#FFF5CC]/30 hover:border-[#FFF5CC] text-[#FFF5CC] bg-white/10 backdrop-blur-sm hover:scale-105 cursor-pointer"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── MAIN HERO STAGE ─────────────────────────────────────────── */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[580px] sm:min-h-[640px] flex flex-col justify-between pt-6 pb-12 sm:pb-16">

        {/* Top Center: Current Universe Tagline */}
        <div className="text-center pt-2 sm:pt-4">
          <motion.p
            key={`handwriting-${currentWorld.id}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-handwriting font-bold text-2xl sm:text-4xl text-[#FFF5CC] drop-shadow-md"
            style={{ fontFamily: 'Caveat, cursive' }}
          >
            {currentWorld.handwritten}
          </motion.p>
        </div>

        {/* Middle Row: Side Universe Menu + Center 3D Portal Window + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-4">

          {/* LEFT: Universe Switcher Menu (lg: 3 Cols) */}
          <div className="lg:col-span-3 hidden lg:flex flex-col gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FFF5CC]/50 mb-1" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Select Universe
            </span>
            {WORLD_KEYS.map((wKey) => {
              const world = WORLDS[wKey];
              const isActive = world.id === currentWorld.id;
              return (
                <button
                  key={world.id}
                  onClick={() => travelToWorld(world.id)}
                  disabled={isTransitioning}
                  className={`group flex items-center justify-between text-left p-3 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#FFF5CC] text-[#811B2B] shadow-lg translate-x-2'
                      : 'bg-black/30 hover:bg-black/50 text-[#FFF5CC]/75 hover:text-[#FFF5CC] border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full transition-transform ${
                        isActive ? 'scale-125' : 'group-hover:scale-110 opacity-50'
                      }`}
                      style={{ backgroundColor: isActive ? '#811B2B' : world.accentColor }}
                    />
                    <div>
                      <span className="text-[10px] font-mono font-bold block opacity-60 leading-none">
                        {world.number}
                      </span>
                      <span className="text-xs font-black tracking-wide block mt-0.5" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                        {world.name}
                      </span>
                    </div>
                  </div>
                  {isActive && (
                    <motion.span
                      layoutId="active-dot"
                      className="text-xs font-bold"
                    >
                      ✿
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>

          {/* CENTER: The 3D Portal Button (lg: 6 Cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center text-center">
            {/* Next Destination Label */}
            <motion.div
              key={`next-label-${nextWorld.id}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-3 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15"
            >
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '14s', color: nextWorld.accentColor }} />
              <span className="text-[11px] font-bold text-[#FFF5CC]/80" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                Next Universe: <strong className="text-[#FFF5CC] ml-1">{nextWorld.number} {nextWorld.name}</strong>
              </span>
            </motion.div>

            {/* Invisible Portal Anchor Target for 3D Canvas Projection */}
            <div className="relative group">
              <button
                ref={portalRef}
                type="button"
                onClick={() => travelToWorld(nextWorld.id)}
                onPointerEnter={() => setIsHoveringPortal(true)}
                onPointerLeave={() => setIsHoveringPortal(false)}
                disabled={isTransitioning}
                aria-label={`Hop to ${nextWorld.name}`}
                className="relative w-64 h-72 sm:w-72 sm:h-84 rounded-[36px] bg-transparent cursor-pointer outline-none focus:ring-4 focus:ring-[#FFF5CC]/40 transition-transform active:scale-95"
                style={{
                  boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
                }}
              >
                {/* Visual frame overlay to guide click */}
                <div className="absolute inset-0 rounded-[36px] border-2 border-[#FFF5CC]/40 group-hover:border-[#FFF5CC] transition-colors pointer-events-none" />

                {/* Floating "Click to Hop" Badge */}
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border border-black/10 transition-transform group-hover:scale-110 pointer-events-none"
                  style={{
                    backgroundColor: nextWorld.accentColor,
                    color: '#811B2B',
                    fontFamily: 'Quicksand, sans-serif',
                  }}
                >
                  Click to Hop World ✿
                </div>

                {/* Bottom Capsule with Destination Info */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#FFFEF8] text-[#811B2B] px-4 py-1.5 rounded-full text-xs font-bold border border-[#811B2B]/20 shadow-xl whitespace-nowrap flex items-center gap-1.5 pointer-events-none group-hover:bg-[#FFF5CC] transition-colors">
                  <span>Enter {nextWorld.name}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* Helper Caption */}
            <p className="text-[11px] font-bold text-[#FFF5CC]/60 mt-6 uppercase tracking-[0.2em]" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Hover &amp; Move Cursor to Tilt in 3D • Tap to Hop
            </p>
          </div>

          {/* RIGHT: Universe Quick Highlights & Quick Actions (lg: 3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-black/40 backdrop-blur-md p-5 rounded-3xl border border-white/15 shadow-xl">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFF5CC]/60" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                  Signature Piece
                </span>
                <span className="text-sm font-black text-[#F5DD91] font-editorial">
                  ₹{currentWorld.featuredPrice}
                </span>
              </div>

              <h4 className="text-base font-bold text-[#FFF5CC] leading-tight mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                {currentWorld.tagline}
              </h4>

              <p className="text-xs text-[#FFF5CC]/75 leading-relaxed mb-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                {currentWorld.description}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCartCurrent}
                  className="flex-1 py-2.5 px-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  style={{
                    backgroundColor: isAddedFeedback ? '#16a34a' : '#FFF5CC',
                    color: isAddedFeedback ? '#FFFFFF' : '#811B2B',
                    fontFamily: 'Quicksand, sans-serif',
                  }}
                >
                  {isAddedFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Bag (₹{currentWorld.featuredPrice})</span>
                    </>
                  )}
                </button>

                {onQuickView && (
                  <button
                    onClick={handleQuickViewCurrent}
                    title="Quick View Details"
                    className="p-2.5 rounded-full border border-white/20 hover:border-white text-[#FFF5CC] bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Horizon Switcher (Visible on mobile/tablet) */}
            <div className="flex lg:hidden items-center justify-center gap-2 overflow-x-auto py-2">
              {WORLD_KEYS.map((wKey) => {
                const world = WORLDS[wKey];
                const isActive = world.id === currentWorld.id;
                return (
                  <button
                    key={world.id}
                    onClick={() => travelToWorld(world.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#FFF5CC] text-[#811B2B] shadow-md'
                        : 'bg-black/40 text-[#FFF5CC]/70 border border-white/10'
                    }`}
                  >
                    {world.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* BOTTOM EDITORIAL SECTION: Giant Headline & Artisan Facts */}
        <div className="pt-6 border-t border-white/15 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          
          {/* Big Typography Title */}
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#FFF5CC]/60 block mb-1" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Knotsnco Universe {currentWorld.number}
            </span>
            <motion.h1
              key={`headline-${currentWorld.id}`}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl sm:text-8xl lg:text-9xl font-black leading-none tracking-tight text-[#FFF5CC]"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                textShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              {currentWorld.headline}
            </motion.h1>
          </div>

          {/* Artisan Fact Sheet Definition Grid */}
          <div className="w-full md:w-auto md:max-w-md lg:max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 bg-black/35 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 shadow-xl">
              {currentWorld.facts.map(([label, val], idx) => (
                <div key={idx} className="pb-2 border-b border-white/10 last:border-b-0 sm:last:border-b">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#F5DD91] block mb-0.5" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                    {label}
                  </span>
                  <span className="text-xs text-[#FFF5CC]/90 leading-snug block" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Direct CTA Link */}
            <div className="mt-3 flex items-center justify-end">
              <button
                onClick={handleShopCurrentWorld}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#F5DD91] hover:text-[#FFF5CC] transition-colors cursor-pointer group"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                <span>Shop the complete {currentWorld.name} collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ── CUSTOM MOUSE CURSOR OVER PORTAL (Desktop) ───────────────── */}
      <AnimatePresence>
        {isHoveringPortal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: cursorPos.x - 24,
              y: cursorPos.y - 24,
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed z-50 pointer-events-none hidden lg:flex items-center justify-center"
            style={{ width: 48, height: 48 }}
          >
            <div
              className="absolute inset-0 rounded-full border-2 border-dashed animate-spin"
              style={{
                borderColor: nextWorld.accentColor,
                animationDuration: '8s',
                backgroundColor: 'rgba(129, 27, 43, 0.4)',
                backdropFilter: 'blur(4px)',
              }}
            />
            <span className="relative z-10 text-[10px] font-black uppercase text-[#FFF5CC] tracking-widest text-center" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Hop ✿
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default KnotsncoBrandHero;
