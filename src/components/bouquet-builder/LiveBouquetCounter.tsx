import React from 'react';
import {
  FlowerStem,
  WrappingOption,
  RibbonOption,
  WRAPPING_OPTIONS,
} from '../../data/bouquetFlowers';
import { Sparkles, Trash2, Edit3, Heart } from 'lucide-react';

interface LiveBouquetCounterProps {
  selectedFlowers: Record<string, { flower: FlowerStem; quantity: number }>;
  wrapping: WrappingOption;
  ribbon: RibbonOption;
  note: {
    recipient: string;
    message: string;
    sender: string;
    cardStyle: string;
    isTucked: boolean;
  };
  onSelectWrapping: (wrap: WrappingOption) => void;
  onOpenNoteModal: () => void;
  onClearBouquet: () => void;
}

export const LiveBouquetCounter: React.FC<LiveBouquetCounterProps> = ({
  selectedFlowers,
  wrapping,
  ribbon,
  note,
  onSelectWrapping,
  onOpenNoteModal,
  onClearBouquet,
}) => {
  // Flatten stems into individual visual flower instances for the bouquet fan
  const flowerInstances: FlowerStem[] = [];
  Object.values(selectedFlowers).forEach(({ flower, quantity }) => {
    for (let i = 0; i < quantity; i++) {
      flowerInstances.push(flower);
    }
  });

  const totalCount = flowerInstances.length;

  // Compute fan layout angles and offsets for up to 18 visible stems
  const getStemTransform = (index: number, total: number) => {
    if (total === 1) return { rotate: 0, x: 0, y: 0, scale: 1, z: 10 };

    // Spread angles from -32deg to +32deg
    const progress = index / (total - 1); // 0 to 1
    const angle = -32 + progress * 64; // e.g. -32 to +32
    const xOffset = (progress - 0.5) * 110; // -55px to +55px
    // Center stems sit higher, edge stems slightly lower
    const yCurve = Math.abs(progress - 0.5) * 28;
    // Stagger depth
    const zIndex = 10 + (index % 5);

    return {
      rotate: angle,
      x: xOffset,
      y: yCurve,
      scale: 0.95 + (index % 2) * 0.08,
      z: zIndex,
    };
  };

  return (
    <div className="relative w-full max-w-[460px] mx-auto flex flex-col items-center select-none">
      {/* ── Bouquet Visual Stage ── */}
      <div className="relative w-full h-[360px] sm:h-[420px] flex items-end justify-center overflow-visible">
        {/* Soft Radial Backlight */}
        <div
          className="absolute inset-x-12 bottom-12 h-64 rounded-full blur-3xl opacity-35 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: wrapping.colorHex }}
        />

        {/* ── 1. The Flowers Layer (Blooming inside the wrap) ── */}
        <div className="absolute inset-x-0 bottom-24 sm:bottom-28 h-[240px] sm:h-[290px] flex items-end justify-center pointer-events-none">
          {totalCount === 0 ? (
            /* Empty State Encouragement */
            <div className="flex flex-col items-center justify-center text-center p-6 bg-white/70 backdrop-blur-xs rounded-2xl border-2 border-dashed border-[#641623]/25 max-w-[280px] shadow-xs pointer-events-auto mb-10 animate-pulse">
              <span className="text-3xl mb-1.5">🌸</span>
              <p className="font-['Fredoka'] font-bold text-sm text-[#641623]">
                Your bouquet is empty!
              </p>
              <p className="font-['Fredoka'] text-xs text-[#641623]/70 mt-1 leading-relaxed">
                Click any crochet blooms on the shelf above to arrange them here ♡
              </p>
            </div>
          ) : (
            /* Flower Fan Arrangement */
            flowerInstances.slice(0, 20).map((flower, idx) => {
              const { rotate, x, y, scale, z } = getStemTransform(idx, totalCount);

              return (
                <div
                  key={`${flower.variantId}-${idx}`}
                  style={{
                    transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
                    transformOrigin: 'bottom center',
                    zIndex: z,
                  }}
                  className="absolute bottom-6 w-28 h-40 sm:w-36 sm:h-48 transition-all duration-300 ease-out filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.14)]"
                >
                  <img
                    src={flower.image}
                    alt={flower.name}
                    className="w-full h-full object-contain select-none"
                  />
                </div>
              );
            })
          )}

          {/* ── 2. Tucked Greeting Card (Visible in Bouquet) ── */}
          {note.isTucked && note.message && (
            <div
              onClick={onOpenNoteModal}
              className="absolute top-2 right-4 z-40 transform rotate-12 hover:rotate-6 hover:scale-105 transition-all duration-200 cursor-pointer pointer-events-auto group"
              title="Click to view/edit handwritten note"
            >
              <div className="bg-[#FFFCEB] border-2 border-[#811B2B] rounded-xl p-2.5 shadow-md w-32 text-left">
                <div className="flex items-center justify-between border-b border-[#811B2B]/20 pb-1 mb-1">
                  <span className="text-[10px] font-bold text-[#811B2B] uppercase tracking-wider truncate">
                    {note.recipient ? `To: ${note.recipient}` : 'Gift Note'}
                  </span>
                  <Edit3 className="w-3 h-3 text-[#811B2B] group-hover:scale-115 transition-transform" />
                </div>
                <p className="font-script text-xs text-[#641623] truncate leading-tight">
                  &ldquo;{note.message}&rdquo;
                </p>
                {note.sender && (
                  <span className="font-script text-[11px] text-[#811B2B] block text-right mt-0.5">
                    — {note.sender}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── 3. Wrapping Paper Cone / Fold (Center Counter Anchor) ── */}
        <div className="relative w-[280px] sm:w-[330px] h-[190px] sm:h-[220px] z-20 flex items-center justify-center">
          <svg
            viewBox="0 0 320 220"
            fill="none"
            className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] overflow-visible"
          >
            {/* Background wrap fold left */}
            <path
              d="M 20 20 L 160 210 L 80 40 Z"
              fill={wrapping.foldColor}
              stroke={wrapping.borderColor}
              strokeWidth="2.2"
              className="transition-colors duration-300"
            />
            {/* Background wrap fold right */}
            <path
              d="M 300 20 L 160 210 L 240 40 Z"
              fill={wrapping.foldColor}
              stroke={wrapping.borderColor}
              strokeWidth="2.2"
              className="transition-colors duration-300"
            />
            {/* Main Center Fold Wrapping Paper */}
            <path
              d="M 30 25 C 90 60, 160 40, 290 25 L 175 212 C 168 218, 152 218, 145 212 Z"
              fill={wrapping.colorHex}
              stroke={wrapping.borderColor}
              strokeWidth="2.5"
              className="transition-colors duration-300"
            />
            {/* Layered Overlapping Front Flap */}
            <path
              d="M 50 38 Q 160 85 270 38 L 165 210 L 155 210 Z"
              fill={wrapping.foldColor}
              fillOpacity="0.45"
              className="transition-colors duration-300"
            />
            {/* Decorative Scallop Stitch Rim Line on Wrap */}
            <path
              d="M 45 32 Q 160 70 275 32"
              stroke="#641623"
              strokeWidth="1.8"
              strokeDasharray="6 4"
              strokeLinecap="round"
              className="opacity-40"
            />
          </svg>

          {/* ── 4. Ribbon Bow (Tied at the Cinch of the Wrap) ── */}
          <div className="absolute bottom-5 sm:bottom-6 z-30 flex flex-col items-center pointer-events-none transform -translate-y-1">
            {/* Ribbon Knot & Bow SVG */}
            <svg
              viewBox="0 0 120 70"
              fill="none"
              className="w-24 sm:w-28 h-14 sm:h-16 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)]"
            >
              {/* Left Bow Loop */}
              <path
                d="M 60 30 C 40 10, 10 15, 20 35 C 28 48, 52 38, 60 30 Z"
                fill={ribbon.colorHex}
                stroke="#641623"
                strokeWidth="2"
                className="transition-colors duration-300"
              />
              {/* Right Bow Loop */}
              <path
                d="M 60 30 C 80 10, 110 15, 100 35 C 92 48, 68 38, 60 30 Z"
                fill={ribbon.colorHex}
                stroke="#641623"
                strokeWidth="2"
                className="transition-colors duration-300"
              />
              {/* Center Bow Knot */}
              <circle
                cx="60"
                cy="30"
                r="7"
                fill={ribbon.colorHex}
                stroke="#641623"
                strokeWidth="2"
                className="transition-colors duration-300"
              />
              {/* Ribbon Tails */}
              <path
                d="M 57 35 Q 48 55 42 66"
                stroke={ribbon.colorHex}
                strokeWidth="6"
                strokeLinecap="round"
                className="transition-colors duration-300"
              />
              <path
                d="M 63 35 Q 72 55 78 66"
                stroke={ribbon.colorHex}
                strokeWidth="6"
                strokeLinecap="round"
                className="transition-colors duration-300"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Bouquet Controls & Wrapping Swatches Row ── */}
      <div className="w-full mt-3 bg-white/90 backdrop-blur-xs rounded-2xl border border-[#641623]/15 p-3 sm:p-4 shadow-xs flex flex-col gap-2.5">
        {/* Top Status Row */}
        <div className="flex items-center justify-between text-xs font-bold text-[#641623]">
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#811B2B] fill-[#811B2B]" />
            <span>
              {totalCount} {totalCount === 1 ? 'stem' : 'stems'} selected
            </span>
          </span>

          {totalCount > 0 && (
            <button
              type="button"
              onClick={onClearBouquet}
              className="text-[#811B2B] hover:text-[#641623] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear blooms</span>
            </button>
          )}
        </div>

        {/* Wrapping Paper Swatch Picker */}
        <div className="flex items-center justify-between pt-2 border-t border-[#641623]/10">
          <span className="text-[11px] sm:text-xs font-bold text-[#641623]/80 uppercase tracking-wider">
            Paper: <span className="text-[#811B2B]">{wrapping.name}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {WRAPPING_OPTIONS.map((wrap) => {
              const isSelected = wrap.id === wrapping.id;
              return (
                <button
                  key={wrap.id}
                  type="button"
                  onClick={() => onSelectWrapping(wrap)}
                  style={{ backgroundColor: wrap.colorHex }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? 'border-[#811B2B] scale-115 ring-2 ring-[#811B2B]/30'
                      : 'border-white/80 hover:scale-110'
                  }`}
                  title={wrap.name}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
