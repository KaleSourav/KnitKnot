import React from 'react';
import {
  FlowerStem,
  WrappingOption,
  RibbonOption,
  WRAPPING_OPTIONS,
} from '../../data/bouquetFlowers';
import { Trash2, FileText } from 'lucide-react';

interface LiveBouquetCounterProps {
  selectedFlowers: Record<string, { flower: FlowerStem; quantity: number }>;
  wrapping: WrappingOption;
  ribbon: RibbonOption;
  giftNote: string;
  recipientName: string;
  onSelectWrapping: (w: WrappingOption) => void;
  onOpenNoteModal: () => void;
  onClearBouquet: () => void;
}

export const LiveBouquetCounter: React.FC<LiveBouquetCounterProps> = ({
  selectedFlowers,
  wrapping,
  ribbon,
  giftNote,
  recipientName,
  onSelectWrapping,
  onOpenNoteModal,
  onClearBouquet,
}) => {
  // Flatten stems into individual visual flower instances
  const flowerInstances: FlowerStem[] = [];
  Object.values(selectedFlowers).forEach(({ flower, quantity }) => {
    for (let i = 0; i < quantity; i++) {
      flowerInstances.push(flower);
    }
  });

  const totalCount = flowerInstances.length;

  // Compute natural fan arrangement for flower blossoms
  const getStemStyle = (index: number, total: number): React.CSSProperties => {
    if (total === 0) return {};
    if (total === 1) {
      return {
        transform: 'rotate(0deg) scale(1.05)',
        transformOrigin: 'bottom center',
        zIndex: 10,
      };
    }

    const spread = Math.min(total - 1, 11);
    const progress = spread === 0 ? 0.5 : index / spread;
    // Angle fan between -28deg and +28deg
    const angleRange = Math.min(56, 18 + spread * 3.8);
    const angle = -angleRange / 2 + progress * angleRange;

    // Horizontal spread from -80px to +80px
    const xRange = Math.min(150, 30 + spread * 12);
    const xOffset = -xRange / 2 + progress * xRange;

    // Arch height: center flowers sit higher, edges slightly lower
    const archOffset = (1 - Math.pow((progress - 0.5) * 2, 2)) * 22;

    return {
      transform: `translateX(${xOffset}px) translateY(${-archOffset}px) rotate(${angle}deg)`,
      transformOrigin: 'bottom center',
      zIndex: Math.round(10 + (1 - Math.abs(progress - 0.5)) * 10),
    };
  };

  return (
    <div className="relative w-full max-w-[440px] lg:max-w-[480px] mx-auto flex flex-col items-center select-none">
      {/* ── Bouquet Stage ── */}
      <div
        className="relative w-full flex items-end justify-center"
        style={{ height: '360px' }}
      >
        {/* Soft colored glow behind bouquet */}
        <div
          className="absolute inset-x-12 bottom-0 h-52 rounded-full blur-3xl opacity-35 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: wrapping.colorHex }}
        />

        {totalCount === 0 ? (
          /* Empty state */
          <div className="absolute inset-0 flex flex-col items-center justify-center pb-8">
            <div
              className="flex flex-col items-center justify-center text-center px-6 py-8 rounded-3xl border-2 border-dashed border-[#811B2B]/25 max-w-[270px] shadow-sm"
              style={{ background: 'rgba(255,255,255,0.65)' }}
            >
              <div className="text-4xl mb-2">🌸</div>
              <p className="font-['Fredoka'] font-bold text-sm text-[#641623]">
                Your bouquet is empty!
              </p>
              <p className="font-['Fredoka'] text-xs text-[#641623]/70 mt-1 leading-relaxed">
                Tap flowers on the shelf above to start arranging your bouquet ♡
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ════════════════════════════════════════════
                1. BACK WRAPPING PAPER (behind flowers, z-10)
                ════════════════════════════════════════════ */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
              style={{ width: '250px', height: '220px' }}
            >
              <svg viewBox="0 0 250 220" fill="none" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
                {/* Back Left Wing */}
                <path
                  d="M 15 25 L 125 210 L 65 80 Z"
                  fill={wrapping.foldColor}
                  stroke={wrapping.borderColor}
                  strokeWidth="1.8"
                  className="transition-colors duration-500"
                />
                {/* Back Right Wing */}
                <path
                  d="M 235 25 L 125 210 L 185 80 Z"
                  fill={wrapping.foldColor}
                  stroke={wrapping.borderColor}
                  strokeWidth="1.8"
                  className="transition-colors duration-500"
                />
                {/* Back Top Fan Panel */}
                <path
                  d="M 25 35 Q 125 15 225 35 L 195 100 Q 125 80 55 100 Z"
                  fill={wrapping.colorHex}
                  fillOpacity="0.85"
                  className="transition-colors duration-500"
                />
              </svg>
            </div>

            {/* ════════════════════════════════════════════
                2. STEM CONVERGENCE (green lines, z-15)
                ════════════════════════════════════════════ */}
            <div
              className="absolute pointer-events-none z-15"
              style={{ bottom: '70px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '110px' }}
            >
              <svg viewBox="0 0 200 110" fill="none" className="w-full h-full">
                {flowerInstances.slice(0, 14).map((_, idx) => {
                  const spread = Math.min(flowerInstances.length - 1, 11);
                  const progress = spread === 0 ? 0.5 : idx / spread;
                  const xRange = Math.min(130, 20 + spread * 11);
                  const startX = 100 + (progress - 0.5) * xRange;
                  return (
                    <line
                      key={idx}
                      x1={startX}
                      y1="0"
                      x2="100"
                      y2="105"
                      stroke="#4E7C30"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  );
                })}
              </svg>
            </div>

            {/* ════════════════════════════════════════════
                3. TUCKED GIFT CARD (z-18, peeking out)
                ════════════════════════════════════════════ */}
            {giftNote && (
              <div
                onClick={onOpenNoteModal}
                className="absolute z-18 cursor-pointer transform -rotate-6 hover:-rotate-3 transition-transform duration-200"
                style={{ bottom: '135px', left: 'calc(50% + 40px)' }}
                title="Click to view/edit note"
              >
                <div className="bg-[#FFFDF9] border border-[#811B2B]/30 rounded-md px-2.5 py-1.5 shadow-md flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#811B2B]" />
                  <span className="font-['Fredoka'] text-[10px] font-bold text-[#811B2B] max-w-[70px] truncate">
                    {recipientName || 'Gift note'}
                  </span>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════
                4. FLOWER BLOOMS (fan arrangement, z-20)
                ════════════════════════════════════════════ */}
            <div
              className="absolute bottom-[115px] left-1/2 pointer-events-none z-20"
              style={{ transform: 'translateX(-50%)', width: '1px', height: '1px' }}
            >
              {flowerInstances.slice(0, 16).map((flower, idx) => {
                const style = getStemStyle(idx, Math.min(flowerInstances.length, 16));
                return (
                  <div
                    key={`${flower.variantId}-${idx}`}
                    className="absolute transition-all duration-400 ease-out"
                    style={{
                      ...style,
                      width: '105px',
                      height: '140px',
                      left: '-52px',
                      bottom: '0',
                    }}
                  >
                    <img
                      src={flower.cutoutImage || flower.image}
                      alt={flower.name}
                      className="w-full h-full object-contain select-none pointer-events-none"
                      style={{
                        filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.22))',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* ════════════════════════════════════════════
                5. FRONT WRAPPING CONE (covers bottom stems, z-25)
                ════════════════════════════════════════════ */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 z-25 pointer-events-none"
              style={{ width: '250px', height: '185px' }}
            >
              <svg viewBox="0 0 250 185" fill="none" className="w-full h-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.14)]">
                {/* Main Front Cone */}
                <path
                  d="M 22 28 C 75 58 125 42 228 28 L 136 180 C 130 186 120 186 114 180 Z"
                  fill={wrapping.colorHex}
                  stroke={wrapping.borderColor}
                  strokeWidth="2.2"
                  className="transition-colors duration-500"
                />
                {/* Top Crease Highlight */}
                <path
                  d="M 28 34 Q 125 70 222 34"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.4"
                />
                {/* Decorative Stitching on Rim */}
                <path
                  d="M 34 40 Q 125 74 216 40"
                  stroke={wrapping.borderColor}
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                {/* Front Overlap Shading Flap */}
                <path
                  d="M 45 48 Q 125 88 205 48 L 132 178 L 118 178 Z"
                  fill={wrapping.foldColor}
                  fillOpacity="0.32"
                  className="transition-colors duration-500"
                />
              </svg>
            </div>

            {/* ════════════════════════════════════════════
                6. RIBBON BOW (on wrap cinch, z-30)
                ════════════════════════════════════════════ */}
            <div
              className="absolute z-30 pointer-events-none"
              style={{ bottom: '70px', left: '50%', transform: 'translateX(-50%)' }}
            >
              <svg viewBox="0 0 110 70" fill="none" className="w-24 h-16"
                style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.22))' }}
              >
                {/* Left bow loop */}
                <path
                  d="M 55 32 C 36 12 6 16 16 36 C 24 50 48 42 55 32 Z"
                  fill={ribbon.colorHex}
                  stroke="#5A1218"
                  strokeWidth="1.5"
                  className="transition-colors duration-300"
                />
                {/* Right bow loop */}
                <path
                  d="M 55 32 C 74 12 104 16 94 36 C 86 50 62 42 55 32 Z"
                  fill={ribbon.colorHex}
                  stroke="#5A1218"
                  strokeWidth="1.5"
                  className="transition-colors duration-300"
                />
                {/* Center knot */}
                <ellipse
                  cx="55"
                  cy="32"
                  rx="7"
                  ry="6"
                  fill={ribbon.colorHex}
                  stroke="#5A1218"
                  strokeWidth="2"
                  className="transition-colors duration-300"
                />
                {/* Inner sheen on knot */}
                <ellipse cx="52" cy="30" rx="3" ry="2.5" fill="white" opacity="0.3" />
                {/* Left ribbon tail */}
                <path
                  d="M 50 36 C 42 46 34 54 28 66 L 38 64 C 44 56 50 48 52 38 Z"
                  fill={ribbon.colorHex}
                  stroke="#5A1218"
                  strokeWidth="1.2"
                  opacity="0.9"
                  className="transition-colors duration-300"
                />
                {/* Right ribbon tail */}
                <path
                  d="M 60 36 C 68 46 76 54 82 66 L 72 64 C 66 56 60 48 58 38 Z"
                  fill={ribbon.colorHex}
                  stroke="#5A1218"
                  strokeWidth="1.2"
                  opacity="0.9"
                  className="transition-colors duration-300"
                />
              </svg>
            </div>
          </>
        )}
      </div>

      {/* ── Status pill + Clear action ── */}
      {totalCount > 0 && (
        <div className="flex items-center gap-2 mt-3 mb-1">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 border border-[#811B2B]/20 font-['Fredoka'] font-bold text-xs text-[#811B2B] shadow-xs">
            <span>♥</span> {totalCount} {totalCount === 1 ? 'stem' : 'stems'}
          </span>
          <button
            type="button"
            onClick={onClearBouquet}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/50 hover:bg-white/90 text-[#811B2B]/70 hover:text-[#811B2B] border border-transparent hover:border-[#811B2B]/20 text-[11px] font-medium transition-all cursor-pointer"
            title="Clear all stems from bouquet"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>
      )}

      {/* ── Wrapping Paper Swatches Selector ── */}
      <div className="w-full mt-3 flex flex-col items-center">
        <div className="flex items-center justify-between w-full max-w-[360px] px-1 mb-1.5">
          <span className="font-['Fredoka'] font-black text-[11px] uppercase tracking-wider text-[#641623]/80">
            Wrapping Paper:
          </span>
          <span className="font-['Fredoka'] text-xs font-bold text-[#811B2B]">
            {wrapping.name}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2.5 p-2 rounded-2xl bg-white/40 border border-[#811B2B]/15 backdrop-blur-xs">
          {WRAPPING_OPTIONS.map((w) => {
            const isSelected = w.id === wrapping.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => onSelectWrapping(w)}
                className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#811B2B] ring-offset-2 scale-110 shadow-sm'
                    : 'hover:scale-105 opacity-85 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: w.colorHex,
                  border: `2px solid ${w.borderColor}`,
                }}
                title={w.name}
                aria-label={`Select ${w.name} wrapping paper`}
              >
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] text-[#811B2B]">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
