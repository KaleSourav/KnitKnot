/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Minus, Flower2, ShoppingBag, Check, Sparkles, Heart } from 'lucide-react';
import { Product, CartItem } from '../data/products';

interface FlowerStemOption {
  id: string;
  name: string;
  price: number;
  color: string;
  icon: string;
  image: string;
}

const AVAILABLE_FLOWERS: FlowerStemOption[] = [
  {
    id: 'stem-rose-red',
    name: 'Burgundy Classic Rose',
    price: 249,
    color: '#811B2B',
    icon: '🌹',
    image: '/products/bouquet.jpg',
  },
  {
    id: 'stem-tulip-pink',
    name: 'Pastel Pink Tulip',
    price: 199,
    color: '#F5C4D5',
    icon: '🌷',
    image: '/products/tulips.jpg',
  },
  {
    id: 'stem-sunflower',
    name: 'Smiling Sunflower',
    price: 299,
    color: '#F5DD91',
    icon: '🌻',
    image: '/products/byob.jpg',
  },
  {
    id: 'stem-daisy',
    name: 'Marshmallow Daisy',
    price: 189,
    color: '#FFFEF8',
    icon: '🌼',
    image: '/bloom/bouquet-gentle-white.jpg',
  },
  {
    id: 'stem-lily-blue',
    name: 'Royal Blue Bloom',
    price: 229,
    color: '#BBDDEB',
    icon: '🪻',
    image: '/bloom/bouquet-royal-blue.jpg',
  },
  {
    id: 'stem-foliage',
    name: 'Sage Eucalyptus Sprig',
    price: 129,
    color: '#C5E7D4',
    icon: '🌿',
    image: '/products/utility.jpg',
  },
];

const WRAPPING_STYLES = [
  { id: 'wrap-pink', name: 'Pastel Pink', color: '#F5C4D5', pattern: 'Origami Folds' },
  { id: 'wrap-yellow', name: 'Butter Yellow', color: '#F5DD91', pattern: 'Sunlit Crepe' },
  { id: 'wrap-mint', name: 'Muted Mint', color: '#C5E7D4', pattern: 'Checkered Gingham' },
  { id: 'wrap-blue', name: 'Powder Blue', color: '#BBDDEB', pattern: 'Cloud Matte' },
  { id: 'wrap-cream', name: 'Warm Cream', color: '#FFF5CC', pattern: 'Vintage Newspaper' },
];

const RIBBON_COLORS = [
  { id: 'ribbon-burgundy', name: 'Deep Burgundy', color: '#811B2B' },
  { id: 'ribbon-pink', name: 'Rose Pink', color: '#F5C4D5' },
  { id: 'ribbon-gold', name: 'Golden Honey', color: '#F5DD91' },
  { id: 'ribbon-mint', name: 'Muted Forest', color: '#4A7C59' },
];

interface BouquetCustomizerSectionProps {
  onAddToCart: (product: Product, quantity?: number, customization?: CartItem['customization']) => void;
  onOpenCart?: () => void;
}

export function BouquetCustomizerSection({
  onAddToCart,
  onOpenCart,
}: BouquetCustomizerSectionProps) {
  // Quantities for each stem
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'stem-rose-red': 2,
    'stem-tulip-pink': 2,
    'stem-sunflower': 1,
    'stem-daisy': 1,
  });

  const [selectedWrap, setSelectedWrap] = useState(WRAPPING_STYLES[0]);
  const [selectedRibbon, setSelectedRibbon] = useState(RIBBON_COLORS[0]);
  const [customNote, setCustomNote] = useState('Happy Birthday! May your smile bloom forever ♡');
  const [isAdded, setIsAdded] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const totalStems = Object.values(quantities).reduce((a, b) => a + b, 0);

  // Price calculation: sum of stems + base artisanal wrapping packaging ₹149
  const baseWrappingPrice = 149;
  const stemsTotal = AVAILABLE_FLOWERS.reduce((sum, stem) => {
    return sum + stem.price * (quantities[stem.id] || 0);
  }, 0);
  const totalPrice = stemsTotal > 0 ? stemsTotal + baseWrappingPrice : 0;

  const handleCreateAndAddToCart = () => {
    if (totalStems === 0) return;

    const breakdown = AVAILABLE_FLOWERS.filter((f) => (quantities[f.id] || 0) > 0).map((f) => ({
      name: f.name,
      qty: quantities[f.id],
    }));

    const customBouquetProduct: Product = {
      id: `custom-bouquet-${Date.now()}`,
      name: `Bespoke Bouquet (${totalStems} Stems)`,
      category: 'Flowers',
      price: totalPrice,
      image: '/bloom/hero-sky-bouquet.jpg',
      rating: 5.0,
      reviewsCount: 1,
      badge: 'Bespoke Order',
      description: `Custom arrangement of ${totalStems} handcrafted crochet stems with ${selectedWrap.name} wrapping and ${selectedRibbon.name} ribbon bow. Note: "${customNote}"`,
      details: [
        `Includes: ${breakdown.map((b) => `${b.qty}x ${b.name}`).join(', ')}`,
        `Wrapping Paper: ${selectedWrap.name} (${selectedWrap.pattern})`,
        `Ribbon: ${selectedRibbon.name} hand-tied bow`,
        `Includes handwritten artisan gift card`,
        `Crafted stitch by stitch by Dadis in Surat`,
      ],
      inStock: true,
    };

    onAddToCart(customBouquetProduct, 1, {
      wrapping: selectedWrap.name,
      ribbonColor: selectedRibbon.name,
      flowerBreakdown: breakdown,
      note: customNote,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      if (onOpenCart) onOpenCart();
    }, 1200);
  };

  return (
    <section
      id="bouquet-customizer-section"
      className="w-full bg-[#FFF5CC] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#811B2B]/15 relative"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#811B2B] text-[#FFF5CC] text-xs font-bold mb-4 font-rounded shadow-sm">
            <Flower2 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
            <span>INTERACTIVE STUDIO</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#811B2B] tracking-tight">
            Build Your Own Bouquet.
          </h2>
          <p className="mt-3 text-[#811B2B]/85 font-rounded text-sm sm:text-base leading-relaxed">
            Select your favorite stems, pick the wrapping paper, choose the ribbon, and write a sweet note.
            Our Dadis in Surat will knit and assemble it just for you.
          </p>
        </div>

        {/* Main Studio Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Live Bouquet Visualizer & Summary (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div
              className="rounded-3xl p-6 sm:p-8 border-2 border-[#811B2B] shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
              style={{ backgroundColor: selectedWrap.color }}
            >
              {/* Paper Washi Tape Header */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#FFFEF8] text-[#811B2B] px-4 py-1 rounded shadow-sm text-xs font-bold border border-[#811B2B]/20 font-handwriting text-lg">
                Your Arrangement Preview ✿
              </div>

              {/* Live Visual Illustration of Bouquet with chosen wrapper & ribbon */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 mt-6 flex items-center justify-center">
                {/* SVG Visualizer with real-time stem bubbles and ribbon */}
                <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
                  {/* Outer Wrapper Shape matching selectedWrap color */}
                  <polygon
                    points="60,80 120,225 180,80"
                    fill={selectedWrap.color}
                    stroke="#811B2B"
                    strokeWidth="3"
                  />
                  <polygon
                    points="45,75 120,225 90,75"
                    fill="#FFFEF8"
                    stroke="#811B2B"
                    strokeWidth="2.5"
                    opacity="0.85"
                  />
                  <polygon
                    points="195,75 120,225 150,75"
                    fill="#FFFEF8"
                    stroke="#811B2B"
                    strokeWidth="2.5"
                    opacity="0.85"
                  />

                  {/* Render stems clustered inside */}
                  {AVAILABLE_FLOWERS.map((flower, idx) => {
                    const count = quantities[flower.id] || 0;
                    if (count === 0) return null;

                    // Compute slight positions based on index
                    const angle = ((idx * 55) % 180) - 90;
                    const rad = (angle * Math.PI) / 180;
                    const cx = 120 + Math.sin(rad) * 45;
                    const cy = 60 + Math.cos(rad) * 25;

                    return (
                      <g key={flower.id} transform={`translate(${cx}, ${cy})`}>
                        <circle
                          cx="0"
                          cy="0"
                          r="18"
                          fill={flower.color}
                          stroke="#811B2B"
                          strokeWidth="2"
                        />
                        <text
                          x="0"
                          y="6"
                          textAnchor="middle"
                          fontSize="16"
                          className="select-none"
                        >
                          {flower.icon}
                        </text>
                        {count > 1 && (
                          <g transform="translate(10, -10)">
                            <circle cx="0" cy="0" r="8" fill="#811B2B" />
                            <text
                              x="0"
                              y="3"
                              textAnchor="middle"
                              fill="#FFF5CC"
                              fontSize="9"
                              fontWeight="bold"
                            >
                              x{count}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* Ribbon Knot at center waist */}
                  <g transform="translate(120, 160)">
                    {/* Ribbon Bow in selectedRibbon color */}
                    <path
                      d="M 0,0 C -22,-18 -32,5 -5,0"
                      fill={selectedRibbon.color}
                      stroke="#811B2B"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 0,0 C 22,-18 32,5 5,0"
                      fill={selectedRibbon.color}
                      stroke="#811B2B"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M -2,4 Q -10,25 -18,35 Q -8,25 0,8"
                      fill={selectedRibbon.color}
                      stroke="#811B2B"
                      strokeWidth="2"
                    />
                    <path
                      d="M 2,4 Q 10,25 18,35 Q 8,25 0,8"
                      fill={selectedRibbon.color}
                      stroke="#811B2B"
                      strokeWidth="2"
                    />
                    <circle cx="0" cy="0" r="6" fill={selectedRibbon.color} stroke="#FFF5CC" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>

              {/* Bouquet Summary Box */}
              <div className="w-full bg-[#FFFEF8] p-4 rounded-2xl border border-[#811B2B]/20 text-left mt-4 shadow-sm">
                <div className="flex items-center justify-between font-bold text-sm text-[#811B2B]">
                  <span>Total Stems:</span>
                  <span className="font-editorial text-base">{totalStems} Stems</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#811B2B]/80 mt-1 font-rounded">
                  <span>Paper Wrapper:</span>
                  <span className="font-bold">{selectedWrap.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#811B2B]/80 mt-1 font-rounded">
                  <span>Ribbon Color:</span>
                  <span className="font-bold">{selectedRibbon.name}</span>
                </div>

                <div className="border-t border-[#811B2B]/15 pt-3 mt-3 flex items-baseline justify-between">
                  <span className="font-editorial text-lg font-bold text-[#811B2B]">
                    Bouquet Total:
                  </span>
                  <span className="font-editorial text-2xl font-extrabold text-[#811B2B]">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                disabled={totalStems === 0}
                onClick={handleCreateAndAddToCart}
                className={`w-full mt-4 py-3.5 px-6 rounded-full font-bold text-sm tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
                  totalStems === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isAdded
                    ? 'bg-green-600 text-white'
                    : 'bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] hover:scale-105 active:scale-95'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Bouquet Added to Bag! ♡</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Custom Bouquet to Bag (₹{totalPrice})</span>
                  </>
                )}
              </button>

            </div>
          </div>

          {/* RIGHT: Customizer Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* STEP 1: Select Flower Stems */}
            <div className="bg-[#FFFEF8] p-6 sm:p-7 rounded-3xl border-2 border-[#811B2B] shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] font-extrabold text-[#811B2B]/70 tracking-widest uppercase font-rounded">
                    Step 01
                  </span>
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#811B2B]">
                    Choose Your Crochet Stems
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#811B2B] bg-[#FFF5CC] px-3 py-1 rounded-full border border-[#811B2B]/20">
                  {totalStems} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {AVAILABLE_FLOWERS.map((stem) => {
                  const qty = quantities[stem.id] || 0;
                  return (
                    <div
                      key={stem.id}
                      className="p-3.5 rounded-2xl border border-[#811B2B]/20 bg-[#FFF5CC]/40 hover:bg-[#FFF5CC] transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{stem.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-[#811B2B] leading-tight">
                            {stem.name}
                          </p>
                          <p className="text-xs font-extrabold text-[#811B2B]/80 font-editorial">
                            ₹{stem.price}
                          </p>
                        </div>
                      </div>

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-1.5 bg-[#FFFEF8] border border-[#811B2B]/30 rounded-full p-1 shadow-sm">
                        <button
                          onClick={() => updateQuantity(stem.id, -1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[#811B2B] hover:bg-[#811B2B]/10 active:scale-90"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-[#811B2B]">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(stem.id, 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[#811B2B] hover:bg-[#811B2B]/10 active:scale-90"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Choose Wrapping Style */}
            <div className="bg-[#FFFEF8] p-6 sm:p-7 rounded-3xl border-2 border-[#811B2B] shadow-md">
              <span className="text-[11px] font-extrabold text-[#811B2B]/70 tracking-widest uppercase font-rounded">
                Step 02
              </span>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#811B2B] mb-4">
                Pick Your Wrapping Paper
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {WRAPPING_STYLES.map((wrap) => {
                  const isSelected = selectedWrap.id === wrap.id;
                  return (
                    <button
                      key={wrap.id}
                      onClick={() => setSelectedWrap(wrap)}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
                        isSelected
                          ? 'border-[#811B2B] bg-[#811B2B]/10 shadow-md scale-105'
                          : 'border-[#811B2B]/20 bg-white hover:border-[#811B2B]/50'
                      }`}
                    >
                      <div
                        className="w-9 h-9 rounded-full border border-[#811B2B]/30 mb-2 shadow-inner"
                        style={{ backgroundColor: wrap.color }}
                      />
                      <span className="text-xs font-bold text-[#811B2B]">
                        {wrap.name}
                      </span>
                      <span className="text-[9px] text-[#811B2B]/60 font-rounded mt-0.5">
                        {wrap.pattern}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Choose Ribbon Color & Handwritten Note */}
            <div className="bg-[#FFFEF8] p-6 sm:p-7 rounded-3xl border-2 border-[#811B2B] shadow-md">
              <span className="text-[11px] font-extrabold text-[#811B2B]/70 tracking-widest uppercase font-rounded">
                Step 03
              </span>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#811B2B] mb-4">
                Ribbon Bow & Gift Message
              </h3>

              {/* Ribbons */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {RIBBON_COLORS.map((ribbon) => {
                  const isSelected = selectedRibbon.id === ribbon.id;
                  return (
                    <button
                      key={ribbon.id}
                      onClick={() => setSelectedRibbon(ribbon)}
                      className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-[#811B2B] bg-[#811B2B] text-[#FFF5CC] shadow-md'
                          : 'border-[#811B2B]/20 bg-white text-[#811B2B] hover:border-[#811B2B]/50'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white"
                        style={{ backgroundColor: ribbon.color }}
                      />
                      <span>{ribbon.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Note input */}
              <div>
                <label className="block text-xs font-bold text-[#811B2B] mb-1.5 font-rounded">
                  Complimentary Handwritten Note Card:
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  maxLength={140}
                  rows={2}
                  className="w-full p-3 rounded-2xl border border-[#811B2B]/30 bg-[#FFF5CC]/30 text-[#811B2B] text-xs font-handwriting text-lg focus:outline-none focus:ring-2 focus:ring-[#811B2B] resize-none"
                  placeholder="Write your personal message here..."
                />
                <span className="text-[10px] text-[#811B2B]/60 font-rounded text-right block mt-1">
                  {140 - customNote.length} characters left • Written by hand on recycled cotton card
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
