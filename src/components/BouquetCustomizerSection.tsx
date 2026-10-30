/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Knotsnco — Build Your Own Bouquet (BYOB) Studio
 * A beautiful, interactive 3-step bouquet customizer.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Minus, ShoppingBag, Check, Sparkles,
  Heart, ChevronRight, ArrowRight, MessageSquare, Palette, Flower2
} from 'lucide-react';
import { Product, CartItem } from '../data/products';

/* ─── DATA ────────────────────────────────────────────────────── */

interface FlowerOption {
  id: string;
  name: string;
  tagline: string;
  price: number;
  color: string;
  bg: string;
  emoji: string;
  image: string;
}

const FLOWERS: FlowerOption[] = [
  {
    id: 'rose',
    name: 'Burgundy Classic Rose',
    tagline: 'Timeless & romantic',
    price: 249,
    color: '#811B2B',
    bg: '#F5C4D5',
    emoji: '🌹',
    image: '/products/bouquet.jpg',
  },
  {
    id: 'tulip',
    name: 'Pastel Pink Tulip',
    tagline: 'Soft & dreamy',
    price: 199,
    color: '#D46A8A',
    bg: '#FAE0EB',
    emoji: '🌷',
    image: '/products/tulips.jpg',
  },
  {
    id: 'sunflower',
    name: 'Smiling Sunflower',
    tagline: 'Bright & joyful',
    price: 299,
    color: '#C4951A',
    bg: '#FFF0B3',
    emoji: '🌻',
    image: '/products/byob.jpg',
  },
  {
    id: 'daisy',
    name: 'Marshmallow Daisy',
    tagline: 'Cute & delicate',
    price: 189,
    color: '#8E6B3E',
    bg: '#F5F0E8',
    emoji: '🌼',
    image: '/bloom/bouquet-gentle-white.jpg',
  },
  {
    id: 'lily',
    name: 'Royal Blue Bloom',
    tagline: 'Rare & majestic',
    price: 229,
    color: '#2E6DA4',
    bg: '#D6EAF8',
    emoji: '🪻',
    image: '/bloom/bouquet-royal-blue.jpg',
  },
  {
    id: 'foliage',
    name: 'Sage Eucalyptus Sprig',
    tagline: 'Lush & fresh',
    price: 129,
    color: '#3D7A54',
    bg: '#D5ECD9',
    emoji: '🌿',
    image: '/products/utility.jpg',
  },
];

interface WrapOption {
  id: string;
  name: string;
  style: string;
  color: string;
  textColor: string;
}

const WRAPS: WrapOption[] = [
  { id: 'pink',   name: 'Blush Pink',     style: 'Origami Folds',      color: '#F5C4D5', textColor: '#811B2B' },
  { id: 'yellow', name: 'Butter Yellow',  style: 'Sunlit Crepe',       color: '#F5DD91', textColor: '#7A5C00' },
  { id: 'mint',   name: 'Muted Mint',     style: 'Gingham Check',      color: '#C5E7D4', textColor: '#1F5E3B' },
  { id: 'blue',   name: 'Powder Blue',    style: 'Cloud Matte',        color: '#BBDDEB', textColor: '#1A4A70' },
  { id: 'cream',  name: 'Warm Cream',     style: 'Vintage Newspaper',  color: '#FFF5CC', textColor: '#811B2B' },
];

interface RibbonOption {
  id: string;
  name: string;
  color: string;
}

const RIBBONS: RibbonOption[] = [
  { id: 'burgundy', name: 'Deep Burgundy', color: '#811B2B' },
  { id: 'pink',     name: 'Rose Pink',     color: '#F5C4D5' },
  { id: 'gold',     name: 'Golden Honey',  color: '#C4951A' },
  { id: 'forest',   name: 'Forest Green',  color: '#4A7C59' },
  { id: 'navy',     name: 'Midnight Blue', color: '#2E4A7A' },
];

const BASE_PACKAGING_PRICE = 149;
const STEPS = ['Flowers', 'Wrapping', 'Finishing'];

/* ─── PROPS ───────────────────────────────────────────────────── */

interface BouquetCustomizerSectionProps {
  onAddToCart: (product: Product, quantity?: number, customization?: CartItem['customization']) => void;
  onOpenCart?: () => void;
  showHeader?: boolean;
  className?: string;
}

/* ─── LIVE BOUQUET PREVIEW ────────────────────────────────────── */

function BouquetPreview({
  quantities,
  wrapColor,
  ribbonColor,
  totalStems,
  totalPrice,
  isAdded,
  onAddToCart: handleAdd,
}: {
  quantities: Record<string, number>;
  wrapColor: string;
  ribbonColor: string;
  totalStems: number;
  totalPrice: number;
  isAdded: boolean;
  onAddToCart: () => void;
}) {
  const activeFlowers = FLOWERS.filter((f) => (quantities[f.id] || 0) > 0);

  return (
    <div className="flex flex-col h-full">
      {/* Preview card */}
      <motion.div
        layout
        className="relative rounded-3xl overflow-hidden flex flex-col items-center justify-between p-6 pb-5 flex-1"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${wrapColor} 0%, #FFFEF8 80%)`,
          border: '2.5px solid #811B2B',
          boxShadow: '0 20px 60px rgba(129,27,43,0.18)',
          minHeight: 390,
        }}
      >
        {/* Washi tape label */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 px-5 py-1.5 text-xs font-bold rounded-b-xl shadow-sm z-20"
          style={{
            backgroundColor: '#FFFEF8',
            color: '#811B2B',
            fontFamily: 'Caveat, cursive',
            fontSize: 16,
            border: '1.5px solid rgba(129,27,43,0.2)',
            borderTop: 'none',
          }}
        >
          Your Arrangement Preview ✿
        </div>

        {/* Flower cluster & wrapping cone */}
        <div className="relative w-56 h-56 mt-7 flex items-center justify-center">
          {activeFlowers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="text-5xl opacity-30">🌸</span>
              <p className="text-xs font-bold opacity-40" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
                Add stems below to craft your bouquet
              </p>
            </motion.div>
          ) : (
            <>
              {/* Wrapping paper cone */}
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 w-full h-full"
                style={{ pointerEvents: 'none' }}
              >
                {/* Back flap */}
                <polygon
                  points="36,86 100,192 78,86"
                  fill="#FFFEF8"
                  stroke="#811B2B"
                  strokeWidth="2"
                  opacity="0.9"
                />
                <polygon
                  points="164,86 100,192 122,86"
                  fill="#FFFEF8"
                  stroke="#811B2B"
                  strokeWidth="2"
                  opacity="0.9"
                />
                {/* Main wrap */}
                <polygon
                  points="52,90 100,192 148,90"
                  fill={wrapColor}
                  stroke="#811B2B"
                  strokeWidth="2.5"
                  opacity="0.95"
                />
                {/* Ribbon band */}
                <motion.path
                  key={ribbonColor}
                  d="M 70,140 Q 100,152 130,140"
                  fill="none"
                  stroke={ribbonColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                {/* Bow */}
                <motion.g
                  key={`bow-${ribbonColor}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 18 }}
                  transform="translate(100, 148)"
                >
                  <path d="M 0,0 C -20,-14 -28,6 -5,0" fill={ribbonColor} stroke="#811B2B" strokeWidth="2" />
                  <path d="M 0,0 C 20,-14 28,6 5,0"  fill={ribbonColor} stroke="#811B2B" strokeWidth="2" />
                  <path d="M -2,3 Q -12,20 -20,30 Q -10,18 0,6"  fill={ribbonColor} stroke="#811B2B" strokeWidth="1.5" />
                  <path d="M 2,3 Q 12,20 20,30 Q 10,18 0,6"   fill={ribbonColor} stroke="#811B2B" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="5" fill={ribbonColor} stroke="#FFFEF8" strokeWidth="1.5" />
                </motion.g>
              </svg>

              {/* Realistic Flower Mini-Thumbnails Clustered in Cone */}
              <div className="relative w-44 h-32 flex items-end justify-center -mt-12" style={{ zIndex: 2 }}>
                {activeFlowers.map((f, i) => {
                  const total = activeFlowers.length;
                  const angle = total === 1 ? 0 : ((i / (total - 1)) - 0.5) * 110;
                  const rad = (angle * Math.PI) / 180;
                  const x = Math.sin(rad) * 50;
                  const y = -Math.cos(rad) * 18;
                  const count = quantities[f.id] || 0;
                  return (
                    <motion.div
                      key={f.id}
                      layout
                      initial={{ scale: 0, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className="absolute flex flex-col items-center group cursor-pointer"
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                      <div
                        className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-lg border-2 relative"
                        style={{ backgroundColor: f.bg, borderColor: f.color }}
                      >
                        <img
                          src={f.image}
                          alt={f.name}
                          className="w-full h-full object-cover scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-base -z-10">
                          {f.emoji}
                        </span>
                      </div>
                      {count > 1 && (
                        <span
                          className="text-[9px] font-black mt-0.5 px-1.5 py-0.5 rounded-full border border-white/50 shadow-xs"
                          style={{ backgroundColor: '#811B2B', color: '#FFF5CC' }}
                        >
                          ×{count}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Summary Details */}
        <div className="w-full mt-4 space-y-2">
          {activeFlowers.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {activeFlowers.map((f) => (
                <span
                  key={f.id}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-black/5"
                  style={{ backgroundColor: f.bg, color: f.color }}
                >
                  {quantities[f.id]}× {f.name.replace(/^(Burgundy|Pastel|Smiling|Marshmallow|Royal|Sage)\s+/i, '')}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between py-3 border-t border-[#811B2B]/15">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
                Bouquet Total
              </p>
              <p
                className="text-3xl font-black leading-none"
                style={{ color: '#811B2B', fontFamily: '"Playfair Display", serif' }}
              >
                {totalStems > 0 ? `₹${totalPrice}` : '—'}
              </p>
              {totalStems > 0 && (
                <p className="text-[10px] opacity-50 mt-0.5" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
                  {totalStems} stems + artisan gift wrapping
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: totalStems > 0 ? 1.05 : 1 }}
              whileTap={{ scale: totalStems > 0 ? 0.95 : 1 }}
              onClick={handleAdd}
              disabled={totalStems === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all"
              style={{
                backgroundColor: totalStems === 0 ? 'rgba(129,27,43,0.12)' : isAdded ? '#16a34a' : '#811B2B',
                color: totalStems === 0 ? 'rgba(129,27,43,0.4)' : '#FFF5CC',
                cursor: totalStems === 0 ? 'not-allowed' : 'pointer',
                boxShadow: totalStems > 0 ? '0 8px 24px rgba(129,27,43,0.3)' : 'none',
                fontFamily: 'Quicksand, Nunito, sans-serif',
              }}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Trust pills */}
      <div className="flex flex-wrap gap-2 mt-3">
        {[
          { icon: '✿', text: 'Handmade in Surat' },
          { icon: '♡', text: 'Gift-ready box' },
          { icon: '✦', text: 'Never wilts' },
        ].map((pill) => (
          <span
            key={pill.text}
            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#811B2B]/10"
            style={{ backgroundColor: 'rgba(129,27,43,0.06)', color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}
          >
            {pill.icon} {pill.text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────── */

export function BouquetCustomizerSection({
  onAddToCart,
  onOpenCart,
  showHeader = true,
  className = '',
}: BouquetCustomizerSectionProps) {
  const [activeStep, setActiveStep] = useState(0);
  // Inspiring default bouquet arrangement so visitors immediately see the visualizer alive
  const [quantities, setQuantities] = useState<Record<string, number>>({
    rose: 2,
    tulip: 2,
    daisy: 1,
  });
  const [selectedWrap, setSelectedWrap] = useState(WRAPS[0]);
  const [selectedRibbon, setSelectedRibbon] = useState(RIBBONS[0]);
  const [customNote, setCustomNote] = useState('Happy Birthday! May your smile bloom forever ♡');
  const [isAdded, setIsAdded] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: next };
    });
  };

  const totalStems = useMemo(() => Object.values(quantities).reduce((a, b) => a + b, 0), [quantities]);
  const stemsPrice = useMemo(
    () => FLOWERS.reduce((sum, f) => sum + f.price * (quantities[f.id] || 0), 0),
    [quantities]
  );
  const totalPrice = totalStems > 0 ? stemsPrice + BASE_PACKAGING_PRICE : 0;

  const handleAddToCart = () => {
    if (totalStems === 0) return;
    const breakdown = FLOWERS.filter((f) => (quantities[f.id] || 0) > 0).map((f) => ({
      name: f.name,
      qty: quantities[f.id],
    }));

    const product: Product = {
      id: `byob-${Date.now()}`,
      name: `Bespoke Bouquet (${totalStems} Stems)`,
      category: 'Flowers',
      price: totalPrice,
      image: '/bloom/hero-sky-bouquet.jpg',
      rating: 5.0,
      reviewsCount: 1,
      badge: 'Bespoke Order',
      description: `Custom arrangement: ${breakdown.map((b) => `${b.qty}× ${b.name}`).join(', ')}. Wrapping: ${selectedWrap.name}. Ribbon: ${selectedRibbon.name}. Note: "${customNote}"`,
      details: [
        `Stems: ${breakdown.map((b) => `${b.qty}× ${b.name}`).join(', ')}`,
        `Wrapping: ${selectedWrap.name} (${selectedWrap.style})`,
        `Ribbon: ${selectedRibbon.name} hand-tied bow`,
        `Handwritten note card included`,
        `Crafted by Dadis in Surat`,
      ],
      inStock: true,
    };

    onAddToCart(product, 1, {
      wrapping: selectedWrap.name,
      ribbonColor: selectedRibbon.name,
      flowerBreakdown: breakdown,
      note: customNote,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      if (onOpenCart) onOpenCart();
    }, 1400);
  };

  return (
    <section
      id="bouquet-customizer-section"
      className={`w-full relative ${
        showHeader
          ? 'bg-[#FFF5CC] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#811B2B]/15'
          : ''
      } ${className}`}
    >
      <div className={showHeader ? 'max-w-7xl mx-auto' : 'w-full'}>

        {/* Optional Editorial Header */}
        {showHeader && (
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#811B2B] text-[#FFF5CC] text-xs font-bold mb-4 font-rounded shadow-sm">
              <Flower2 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
              <span>INTERACTIVE BESPOKE STUDIO</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#811B2B] tracking-tight">
              Build Your Own Bouquet.
            </h2>
            <p className="mt-3 text-[#811B2B]/85 font-rounded text-sm sm:text-base leading-relaxed">
              Pick your favorite stems, choose your wrapping paper &amp; ribbon, and write a sweet note.
              Our Dadis in Surat will knit and assemble it just for you ♡
            </p>
          </div>
        )}

        {/* Step progress bar */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <button
                onClick={() => setActiveStep(i)}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-all duration-300 border-2"
                  style={{
                    backgroundColor: activeStep >= i ? '#811B2B' : '#FFFEF8',
                    borderColor: activeStep >= i ? '#811B2B' : 'rgba(129,27,43,0.25)',
                    color: activeStep >= i ? '#FFF5CC' : 'rgba(129,27,43,0.4)',
                    boxShadow: activeStep === i ? '0 4px 16px rgba(129,27,43,0.3)' : 'none',
                  }}
                >
                  {activeStep > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span
                  className="text-xs font-bold hidden sm:inline transition-colors"
                  style={{
                    color: activeStep >= i ? '#811B2B' : 'rgba(129,27,43,0.35)',
                    fontFamily: 'Quicksand, sans-serif',
                  }}
                >
                  {step}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className="w-12 sm:w-20 h-0.5 mx-2 transition-all duration-500"
                  style={{ backgroundColor: activeStep > i ? '#811B2B' : 'rgba(129,27,43,0.15)' }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main Layout: Preview (left) + Controls (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── LIVE PREVIEW (sticky) ─────────────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <BouquetPreview
              quantities={quantities}
              wrapColor={selectedWrap.color}
              ribbonColor={selectedRibbon.color}
              totalStems={totalStems}
              totalPrice={totalPrice}
              isAdded={isAdded}
              onAddToCart={handleAddToCart}
            />
          </div>

          {/* ── STEP PANELS ────────────────────────────── */}
          <div className="lg:col-span-7 space-y-5">

            {/* ══ STEP 1: FLOWERS ══════════════════════════════ */}
            <motion.div
              layout
              className="rounded-3xl overflow-hidden"
              style={{
                border: '2px solid',
                borderColor: activeStep === 0 ? '#811B2B' : 'rgba(129,27,43,0.2)',
                backgroundColor: '#FFFEF8',
                boxShadow: activeStep === 0 ? '0 8px 32px rgba(129,27,43,0.12)' : 'none',
              }}
            >
              {/* Step header — always visible */}
              <button
                onClick={() => setActiveStep(0)}
                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                    style={{
                      backgroundColor: activeStep >= 0 ? '#811B2B' : 'rgba(129,27,43,0.1)',
                      color: activeStep >= 0 ? '#FFF5CC' : '#811B2B',
                    }}
                  >
                    <Flower2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>Step 01</p>
                    <h3 className="font-bold text-lg leading-tight" style={{ color: '#811B2B', fontFamily: '"Playfair Display", serif' }}>
                      Choose Your Crochet Stems
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {totalStems > 0 && (
                    <span
                      className="text-xs font-black px-3 py-1 rounded-full"
                      style={{ backgroundColor: '#811B2B', color: '#FFF5CC', fontFamily: 'Quicksand, sans-serif' }}
                    >
                      {totalStems} stems
                    </span>
                  )}
                  <ChevronRight
                    className="w-4 h-4 transition-transform"
                    style={{
                      color: '#811B2B',
                      transform: activeStep === 0 ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                  />
                </div>
              </button>

              <AnimatePresence>
                {activeStep === 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-6 pb-6">
                      <p className="text-xs mb-5 opacity-70" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
                        Pick as many as you'd like — we recommend 4 to 6 stems for a lush, balanced bouquet ✿
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {FLOWERS.map((flower) => {
                          const qty = quantities[flower.id] || 0;
                          const isSelected = qty > 0;
                          return (
                            <motion.div
                              key={flower.id}
                              layout
                              className="relative rounded-2xl p-4 transition-all duration-200 cursor-pointer"
                              style={{
                                backgroundColor: isSelected ? flower.bg : '#FFF5CC',
                                border: `2px solid ${isSelected ? flower.color : 'rgba(129,27,43,0.12)'}`,
                                boxShadow: isSelected ? `0 4px 20px ${flower.bg}80` : 'none',
                              }}
                              onClick={() => !isSelected && updateQty(flower.id, 1)}
                            >
                              {/* Flower image + info */}
                              <div className="flex items-start gap-3 mb-3">
                                <div
                                  className="w-13 h-13 rounded-xl overflow-hidden flex items-center justify-center text-2xl shrink-0 shadow-sm border border-black/5"
                                  style={{ backgroundColor: isSelected ? '#FFFEF8' : flower.bg }}
                                >
                                  <img
                                    src={flower.image}
                                    alt={flower.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-xs leading-tight truncate" style={{ color: '#811B2B' }}>
                                    {flower.name}
                                  </p>
                                  <p className="text-[10px] opacity-60 leading-tight mt-0.5" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
                                    {flower.tagline}
                                  </p>
                                  <p className="font-black text-sm mt-1" style={{ color: flower.color, fontFamily: '"Playfair Display", serif' }}>
                                    ₹{flower.price}
                                    <span className="text-[9px] opacity-60 font-normal ml-1" style={{ fontFamily: 'Quicksand, sans-serif' }}>/ stem</span>
                                  </p>
                                </div>
                              </div>

                              {/* Quantity stepper */}
                              <div className="flex items-center justify-between pt-1">
                                {isSelected ? (
                                  <div
                                    className="flex items-center gap-2 rounded-full px-2.5 py-1"
                                    style={{ backgroundColor: '#FFFEF8', border: `1.5px solid ${flower.color}` }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => updateQty(flower.id, -1)}
                                      className="w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-red-50 cursor-pointer"
                                      style={{ color: '#811B2B' }}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-5 text-center text-sm font-black" style={{ color: '#811B2B' }}>
                                      {qty}
                                    </span>
                                    <button
                                      onClick={() => updateQty(flower.id, 1)}
                                      className="w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-green-50 cursor-pointer"
                                      style={{ color: '#811B2B' }}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQty(flower.id, 1);
                                    }}
                                    className="text-[11px] font-bold px-3 py-1 rounded-full border border-[#811B2B]/20 bg-white hover:bg-[#811B2B] hover:text-[#FFF5CC] transition-colors cursor-pointer"
                                    style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}
                                  >
                                    + Add Stem
                                  </button>
                                )}
                                <span className="text-sm font-bold opacity-75" style={{ color: flower.color }}>
                                  {flower.emoji}
                                </span>
                              </div>

                              {/* Selected indicator */}
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                                  style={{ backgroundColor: flower.color }}
                                >
                                  <Check className="w-3 h-3" style={{ color: '#FFFEF8' }} />
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Next step button */}
                      <motion.button
                        onClick={() => setActiveStep(1)}
                        disabled={totalStems === 0}
                        whileHover={{ scale: totalStems > 0 ? 1.02 : 1 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-6 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                        style={{
                          backgroundColor: totalStems === 0 ? 'rgba(129,27,43,0.08)' : '#811B2B',
                          color: totalStems === 0 ? 'rgba(129,27,43,0.35)' : '#FFF5CC',
                          cursor: totalStems === 0 ? 'not-allowed' : 'pointer',
                          fontFamily: 'Quicksand, sans-serif',
                        }}
                      >
                        <span>Next: Choose Wrapping &amp; Ribbon</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ══ STEP 2: WRAPPING ══════════════════════════════ */}
            <motion.div
              layout
              className="rounded-3xl overflow-hidden"
              style={{
                border: '2px solid',
                borderColor: activeStep === 1 ? '#811B2B' : 'rgba(129,27,43,0.2)',
                backgroundColor: '#FFFEF8',
                boxShadow: activeStep === 1 ? '0 8px 32px rgba(129,27,43,0.12)' : 'none',
              }}
            >
              <button
                onClick={() => setActiveStep(1)}
                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: activeStep >= 1 ? '#811B2B' : 'rgba(129,27,43,0.1)',
                      color: activeStep >= 1 ? '#FFF5CC' : '#811B2B',
                    }}
                  >
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>Step 02</p>
                    <h3 className="font-bold text-lg leading-tight" style={{ color: '#811B2B', fontFamily: '"Playfair Display", serif' }}>
                      Pick Your Wrapping & Ribbon
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-[#811B2B]"
                    style={{ backgroundColor: selectedWrap.color }}
                  />
                  <ChevronRight
                    className="w-4 h-4 transition-transform"
                    style={{
                      color: '#811B2B',
                      transform: activeStep === 1 ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                  />
                </div>
              </button>

              <AnimatePresence>
                {activeStep === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-6 pb-6 space-y-6">
                      {/* Wrapping paper */}
                      <div>
                        <p className="text-xs font-bold mb-3 uppercase tracking-widest opacity-60" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
                          Artisanal Wrapping Paper
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          {WRAPS.map((wrap) => {
                            const isSelected = selectedWrap.id === wrap.id;
                            return (
                              <motion.button
                                key={wrap.id}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setSelectedWrap(wrap)}
                                className="relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-all cursor-pointer"
                                style={{
                                  backgroundColor: isSelected ? wrap.color : '#FFF5CC',
                                  border: `2px solid ${isSelected ? '#811B2B' : 'rgba(129,27,43,0.15)'}`,
                                  boxShadow: isSelected ? '0 4px 16px rgba(129,27,43,0.2)' : 'none',
                                }}
                              >
                                {/* Color circle */}
                                <div
                                  className="w-10 h-10 rounded-full shadow-inner border"
                                  style={{
                                    backgroundColor: wrap.color,
                                    borderColor: 'rgba(129,27,43,0.2)',
                                  }}
                                />
                                <div className="text-center">
                                  <p className="text-[10px] font-black leading-tight" style={{ color: '#811B2B' }}>
                                    {wrap.name}
                                  </p>
                                  <p className="text-[8px] opacity-60 leading-tight mt-0.5" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
                                    {wrap.style}
                                  </p>
                                </div>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                                    style={{ backgroundColor: '#811B2B' }}
                                  >
                                    <Check className="w-2.5 h-2.5" style={{ color: '#FFF5CC' }} />
                                  </motion.div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Ribbon */}
                      <div>
                        <p className="text-xs font-bold mb-3 uppercase tracking-widest opacity-60" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
                          Satin Ribbon Bow
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {RIBBONS.map((ribbon) => {
                            const isSelected = selectedRibbon.id === ribbon.id;
                            return (
                              <motion.button
                                key={ribbon.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedRibbon(ribbon)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer"
                                style={{
                                  backgroundColor: isSelected ? ribbon.color : '#FFF5CC',
                                  color: isSelected
                                    ? ribbon.color === '#F5C4D5' || ribbon.color === '#C4951A' ? '#811B2B' : '#FFFEF8'
                                    : '#811B2B',
                                  border: `2px solid ${isSelected ? ribbon.color : 'rgba(129,27,43,0.15)'}`,
                                  boxShadow: isSelected ? `0 4px 12px ${ribbon.color}60` : 'none',
                                  fontFamily: 'Quicksand, sans-serif',
                                }}
                              >
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-white/60 shrink-0"
                                  style={{ backgroundColor: ribbon.color }}
                                />
                                {ribbon.name}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      <motion.button
                        onClick={() => setActiveStep(2)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        style={{
                          backgroundColor: '#811B2B',
                          color: '#FFF5CC',
                          fontFamily: 'Quicksand, sans-serif',
                        }}
                      >
                        <span>Next: Add Handwritten Gift Note</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ══ STEP 3: FINISHING ══════════════════════════════ */}
            <motion.div
              layout
              className="rounded-3xl overflow-hidden"
              style={{
                border: '2px solid',
                borderColor: activeStep === 2 ? '#811B2B' : 'rgba(129,27,43,0.2)',
                backgroundColor: '#FFFEF8',
                boxShadow: activeStep === 2 ? '0 8px 32px rgba(129,27,43,0.12)' : 'none',
              }}
            >
              <button
                onClick={() => setActiveStep(2)}
                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: activeStep >= 2 ? '#811B2B' : 'rgba(129,27,43,0.1)',
                      color: activeStep >= 2 ? '#FFF5CC' : '#811B2B',
                    }}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>Step 03</p>
                    <h3 className="font-bold text-lg leading-tight" style={{ color: '#811B2B', fontFamily: '"Playfair Display", serif' }}>
                      Write a Sweet Gift Note
                    </h3>
                  </div>
                </div>
                <ChevronRight
                  className="w-4 h-4 transition-transform"
                  style={{
                    color: '#811B2B',
                    transform: activeStep === 2 ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              <AnimatePresence>
                {activeStep === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-6 pb-6">
                      {/* Note card visual */}
                      <div
                        className="relative rounded-2xl p-5 mb-4 shadow-sm"
                        style={{
                          backgroundColor: '#FFFEF8',
                          border: '2px dashed rgba(129,27,43,0.25)',
                          backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, rgba(129,27,43,0.06) 27px, rgba(129,27,43,0.06) 28px)`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Heart className="w-4 h-4" style={{ color: '#811B2B' }} />
                          <span className="text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
                            Complimentary Handwritten Note Card
                          </span>
                        </div>
                        <textarea
                          value={customNote}
                          onChange={(e) => setCustomNote(e.target.value)}
                          maxLength={160}
                          rows={3}
                          placeholder="Write your personal message here...&#10;e.g. Happy Birthday! May your smile bloom forever ♡"
                          className="w-full bg-transparent text-[#811B2B] resize-none focus:outline-none placeholder:opacity-40"
                          style={{
                            fontFamily: 'Caveat, cursive',
                            fontSize: 19,
                            lineHeight: '28px',
                            color: '#811B2B',
                          }}
                        />
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#811B2B]/10">
                          <span className="text-[10px] opacity-60" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
                            Written by hand on recycled cotton card
                          </span>
                          <span className="text-[10px] font-bold opacity-60" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
                            {160 - customNote.length} chars left
                          </span>
                        </div>
                      </div>

                      {/* Quick message suggestions */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {[
                          'Happy Birthday! ♡',
                          'With all my love 🌸',
                          'Just because ✿',
                          'Thinking of you 💌',
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setCustomNote(suggestion)}
                            className="text-[11px] px-3.5 py-1.5 rounded-full font-bold transition-all hover:scale-105 cursor-pointer shadow-xs"
                            style={{
                              backgroundColor: '#FFF5CC',
                              color: '#811B2B',
                              border: '1px solid rgba(129,27,43,0.2)',
                              fontFamily: 'Quicksand, sans-serif',
                            }}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>

                      {/* Final CTA */}
                      <motion.button
                        onClick={handleAddToCart}
                        disabled={totalStems === 0}
                        whileHover={{ scale: totalStems > 0 ? 1.02 : 1, y: totalStems > 0 ? -2 : 0 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer"
                        style={{
                          backgroundColor: totalStems === 0 ? 'rgba(129,27,43,0.1)' : isAdded ? '#16a34a' : '#811B2B',
                          color: totalStems === 0 ? 'rgba(129,27,43,0.35)' : '#FFF5CC',
                          cursor: totalStems === 0 ? 'not-allowed' : 'pointer',
                          boxShadow: totalStems > 0 ? '0 12px 36px rgba(129,27,43,0.3)' : 'none',
                          fontFamily: 'Quicksand, sans-serif',
                          fontSize: '0.85rem',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {totalStems === 0 ? (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Add flowers first (Step 1)</span>
                          </>
                        ) : isAdded ? (
                          <>
                            <Check className="w-5 h-5" />
                            <span>Your bouquet is in the bag! ♡</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-5 h-5" />
                            <span>Add Custom Bouquet to Bag — ₹{totalPrice}</span>
                          </>
                        )}
                      </motion.button>

                      {totalStems === 0 && (
                        <p className="text-center text-[10px] mt-2 opacity-50" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
                          Go back to Step 1 and pick your flowers ✿
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
export default BouquetCustomizerSection;
