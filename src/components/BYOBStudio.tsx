import React, { useState } from 'react';
import { Sparkles, Check, Plus, Minus, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../data/products';

interface BYOBStudioProps {
  onAddCustomBouquet: (customProduct: Product) => void;
}

interface FlowerStem {
  id: string;
  name: string;
  emoji: string;
  price: number;
}

const STEM_OPTIONS: FlowerStem[] = [
  { id: 'white-lily', name: 'Artisan White Lily', emoji: '🪷', price: 249 },
  { id: 'pink-rose', name: 'Blushing Pink Rose', emoji: '🌹', price: 199 },
  { id: 'yellow-tulip', name: 'Golden Tulip', emoji: '🌷', price: 179 },
  { id: 'sunflower', name: 'Sunbeam Sunflower', emoji: '🌻', price: 219 },
  { id: 'daisy', name: 'Meadow Daisy Stem', emoji: '🌼', price: 149 },
  { id: 'lavender', name: 'French Lavender Sprig', emoji: '🪻', price: 169 },
];

const WRAPPER_COLORS = [
  { id: 'blush-pink', name: 'Blush Pink', colorHex: '#fbcfe8' },
  { id: 'sage-green', name: 'Earthy Sage', colorHex: '#bbf7d0' },
  { id: 'oatmeal-kraft', name: 'Artisan Kraft', colorHex: '#d6c4aa' },
  { id: 'cloud-white', name: 'Cloud White', colorHex: '#f1f5f9' },
  { id: 'lilac-haze', name: 'Lilac Haze', colorHex: '#edd2f7' },
];

const RIBBON_COLORS = [
  { id: 'ivory', name: 'Ivory Satin', hex: '#fafaf9' },
  { id: 'rose', name: 'Dusty Rose', hex: '#f43f5e' },
  { id: 'gold', name: 'Golden Honey', hex: '#eab308' },
  { id: 'purple', name: 'Royal Plum', hex: '#7e22ce' },
];

export const BYOBStudio: React.FC<BYOBStudioProps> = ({ onAddCustomBouquet }) => {
  const [selectedStems, setSelectedStems] = useState<{ [stemId: string]: number }>({
    'white-lily': 1,
    'pink-rose': 2,
    'yellow-tulip': 1,
    'daisy': 2,
  });

  const [wrapperColor, setWrapperColor] = useState(WRAPPER_COLORS[0]);
  const [ribbonColor, setRibbonColor] = useState(RIBBON_COLORS[0]);
  const [giftNote, setGiftNote] = useState('Made with love ♡');

  const updateStemCount = (id: string, delta: number) => {
    setSelectedStems((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const totalStemsCount = Object.values(selectedStems).reduce((a, b) => a + b, 0);

  const calculatedPrice = 299 + STEM_OPTIONS.reduce((acc, stem) => {
    return acc + (selectedStems[stem.id] || 0) * stem.price;
  }, 0);

  const handleAddToCart = () => {
    const customSummary = STEM_OPTIONS
      .filter((s) => (selectedStems[s.id] || 0) > 0)
      .map((s) => `${selectedStems[s.id]}x ${s.name}`)
      .join(', ');

    const customBouquet: Product = {
      id: `byob-${Date.now()}`,
      name: `Custom Bouquet (${totalStemsCount} Stems)`,
      category: 'BYOB',
      price: calculatedPrice,
      image: '/products/bouquet.jpg',
      rating: 5.0,
      reviewsCount: 1,
      badge: 'Custom Created',
      description: `Bespoke bouquet hand-crocheted with: ${customSummary}. Wrapped in ${wrapperColor.name} with ${ribbonColor.name} ribbon. Note: "${giftNote}"`,
      details: [
        `Stems: ${customSummary}`,
        `Wrap: ${wrapperColor.name}`,
        `Ribbon: ${ribbonColor.name}`,
        `Handwritten Note: "${giftNote}"`,
      ],
      inStock: true,
    };

    onAddCustomBouquet(customBouquet);
  };

  return (
    <section id="byob-studio" className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-[#191424] via-[#120f1a] to-[#1c152a] rounded-3xl p-6 sm:p-10 border border-purple-500/20 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* LEFT: STUDIO CONTROLS */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 text-pink-400 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Customizer</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Build Your Own Bouquet (BYOB)
            </h2>
            <p className="text-sm text-stone-300 mb-6">
              Pick your everlasting stems, select luxury wraps, and add a personalized calligraphy gift note. Our artisans will crochet and assemble it with love!
            </p>

            {/* STEP 1: STEM SELECTION */}
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-3 flex items-center justify-between">
                <span>1. Select Your Blooms ({totalStemsCount} stems selected)</span>
                <span className="text-xs normal-case text-stone-400 font-normal">Min. 3 stems recommended</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STEM_OPTIONS.map((stem) => {
                  const count = selectedStems[stem.id] || 0;
                  return (
                    <div
                      key={stem.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-purple-500/15 hover:border-purple-400/30 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{stem.emoji}</span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-white">{stem.name}</p>
                          <p className="text-[11px] text-purple-300 font-semibold">+₹{stem.price}/stem</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateStemCount(stem.id, -1)}
                          disabled={count === 0}
                          className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white cursor-pointer transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-sm font-bold text-white">{count}</span>
                        <button
                          onClick={() => updateStemCount(stem.id, 1)}
                          className="w-7 h-7 rounded-full bg-purple-600/60 hover:bg-purple-600 flex items-center justify-center text-white cursor-pointer transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: WRAPPER & RIBBON SELECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                  2. Parchment Wrap Color
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {WRAPPER_COLORS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setWrapperColor(w)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        wrapperColor.id === w.id
                          ? 'border-white bg-white/20 text-white'
                          : 'border-white/10 bg-black/30 text-stone-300 hover:border-white/30'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: w.colorHex }} />
                      <span>{w.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                  3. Silk Ribbon Color
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {RIBBON_COLORS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRibbonColor(r)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        ribbonColor.id === r.id
                          ? 'border-white bg-white/20 text-white'
                          : 'border-white/10 bg-black/30 text-stone-300 hover:border-white/30'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: r.hex }} />
                      <span>{r.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 3: GIFT NOTE */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                4. Handwritten Gift Note (Included Free)
              </h4>
              <input
                type="text"
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                maxLength={60}
                placeholder="e.g. Happy Birthday to my favorite person ♡"
                className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW CARD */}
          <div className="w-full lg:w-80 shrink-0 bg-[#0e0c14] rounded-2xl p-5 border border-purple-500/20 shadow-xl flex flex-col justify-between">
            <div>
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-stone-900 border border-white/10">
                <img
                  src="/products/bouquet.jpg"
                  alt="Custom Bouquet Preview"
                  className="w-full h-full object-cover"
                />
                <div 
                  className="absolute bottom-2 left-2 right-2 p-2 rounded-lg backdrop-blur-md bg-black/60 border border-white/20 text-center"
                >
                  <p className="text-[11px] font-bold text-pink-300">
                    Wrap: {wrapperColor.name} • Ribbon: {ribbonColor.name}
                  </p>
                </div>
              </div>

              <h4 className="text-base font-extrabold text-white">Your Custom Arrangement</h4>
              <p className="text-xs text-stone-400 mt-1">
                {totalStemsCount === 0 ? 'No stems chosen yet' : `${totalStemsCount} artisanal stems prepared`}
              </p>

              <div className="mt-3 py-2 border-y border-white/10 space-y-1">
                <div className="flex justify-between text-xs text-stone-300">
                  <span>Artisan Assembly & Wrap</span>
                  <span>₹299</span>
                </div>
                <div className="flex justify-between text-xs text-stone-300">
                  <span>Flower Stems ({totalStemsCount})</span>
                  <span>₹{calculatedPrice - 299}</span>
                </div>
                <div className="flex justify-between text-xs text-pink-300 font-semibold pt-1 border-t border-white/5">
                  <span>Calligraphed Note</span>
                  <span>FREE</span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-stone-400 font-bold">Total</span>
                <span className="text-2xl font-extrabold text-[#edd2f7]">₹{calculatedPrice}</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={totalStemsCount === 0}
                className="w-full bg-[#edd2f7] hover:bg-[#e4c2f1] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-[#4a044e] font-extrabold text-sm py-3 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Custom Bouquet</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
