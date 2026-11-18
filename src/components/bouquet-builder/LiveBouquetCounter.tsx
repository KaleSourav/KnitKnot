import React from 'react';
import {
  FlowerStem,
  WrappingOption,
  RibbonOption,
  WRAPPING_OPTIONS,
} from '../../data/bouquetFlowers';
import { Trash2, RotateCcw } from 'lucide-react';

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
  hasRibbonChosen: boolean;
  onSelectWrapping: (w: WrappingOption) => void;
  onOpenNoteModal: () => void;
  onClearBouquet: () => void;
  onUndoRibbon?: () => void;
}

export const LiveBouquetCounter: React.FC<LiveBouquetCounterProps> = ({
  selectedFlowers,
  wrapping,
  ribbon,
  note,
  hasRibbonChosen,
  onSelectWrapping,
  onOpenNoteModal,
  onClearBouquet,
  onUndoRibbon,
}) => {
  // Flatten stems into individual visual flower instances
  const flowerInstances: FlowerStem[] = [];
  Object.values(selectedFlowers).forEach(({ flower, quantity }) => {
    for (let i = 0; i < quantity; i++) {
      flowerInstances.push(flower);
    }
  });

  const totalCount = flowerInstances.length;
  // If user has chosen ribbon AND has at least 1 flower, bouquet is wrapped into cone!
  const isWrapped = hasRibbonChosen && totalCount > 0;

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
    <div className="relative w-full max-w-[460px] lg:max-w-[500px] mx-auto flex flex-col items-center select-none">
      {/* ── Bouquet Stage on Counter ── */}
      <div
        className="relative w-full flex items-end justify-center"
        style={{ height: '370px' }}
      >
        {/* Soft colored glow behind bouquet */}
        <div
          className="absolute inset-x-12 bottom-0 h-52 rounded-full blur-3xl opacity-35 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: wrapping.colorHex }}
        />

        {totalCount === 0 ? (
          /* ══════════════════════════════════════════════════════════════
              EMPTY STATE: Flat open diamond origami napkin + pointing hand
             ══════════════════════════════════════════════════════════════ */
          <div className="relative flex flex-col items-center justify-center pb-6">
            {/* Flat diamond open wrapping sheet */}
            <div
              className="relative w-[210px] h-[210px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
              style={{ transform: 'rotate(45deg)' }}
            >
              <div
                className="w-full h-full rounded-2xl border-2 transition-colors duration-500 relative overflow-hidden"
                style={{
                  backgroundColor: wrapping.colorHex,
                  borderColor: wrapping.borderColor,
                }}
              >
                {/* Diagonal fold crease lines */}
                <div className="absolute inset-0 border-t border-l border-white/40" />
                <div
                  className="absolute inset-4 rounded-xl border border-dashed opacity-40"
                  style={{ borderColor: wrapping.borderColor }}
                />
              </div>
            </div>

            {/* Gloved Hand pointing icon & instruction overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10 pointer-events-none">
              {/* Animated White Gloved Hand */}
              <div className="w-14 h-14 mb-2 animate-bounce-subtle drop-shadow-md">
                <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                  {/* Glove cuff */}
                  <rect x="24" y="46" width="16" height="10" rx="3" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5" />
                  {/* Glove palm */}
                  <path d="M 22 26 C 22 20 26 18 32 18 C 38 18 42 20 42 26 L 42 46 L 22 46 Z" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="1.5" />
                  {/* Pointing index finger */}
                  <rect x="29" y="8" width="6" height="20" rx="3" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="1.5" />
                  {/* Thumb */}
                  <path d="M 22 30 Q 14 30 16 38 Q 18 44 24 44 Z" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="1.5" />
                  {/* Glove shading */}
                  <path d="M 32 20 L 32 46" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="3 2" />
                </svg>
              </div>

              <p className="font-['Fredoka'] font-bold text-xs text-[#641623] max-w-[170px] leading-snug drop-shadow-xs">
                Pick flowers from the shelf above to fill your bouquet ♡
              </p>
            </div>
          </div>
        ) : !isWrapped ? (
          /* ══════════════════════════════════════════════════════════════
              UNWRAPPED STATE: Flowers laid out on open flat diamond sheet
             ══════════════════════════════════════════════════════════════ */
          <>
            {/* Open flat wrapping sheet underneath */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
              style={{ width: '260px', height: '220px' }}
            >
              <svg viewBox="0 0 260 220" fill="none" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.14)]">
                {/* Flat open diamond paper corners */}
                <polygon
                  points="130,10 245,110 130,210 15,110"
                  fill={wrapping.colorHex}
                  stroke={wrapping.borderColor}
                  strokeWidth="2.5"
                  className="transition-colors duration-500"
                />
                <polygon
                  points="130,30 225,110 130,190 35,110"
                  fill={wrapping.foldColor}
                  fillOpacity="0.4"
                  className="transition-colors duration-500"
                />
                <line x1="130" y1="10" x2="130" y2="210" stroke="white" strokeWidth="1.5" opacity="0.35" />
                <line x1="15" y1="110" x2="245" y2="110" stroke="white" strokeWidth="1.5" opacity="0.35" />
              </svg>
            </div>

            {/* Converging Stems */}
            <div
              className="absolute pointer-events-none z-15"
              style={{ bottom: '70px', left: '50%', transform: 'translateX(-50%)', width: '220px', height: '110px' }}
            >
              <svg viewBox="0 0 220 110" fill="none" className="w-full h-full">
                {flowerInstances.slice(0, 14).map((_, idx) => {
                  const spread = Math.min(flowerInstances.length - 1, 11);
                  const progress = spread === 0 ? 0.5 : idx / spread;
                  const xRange = Math.min(140, 20 + spread * 11);
                  const startX = 110 + (progress - 0.5) * xRange;
                  return (
                    <line
                      key={idx}
                      x1={startX}
                      y1="0"
                      x2="110"
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

            {/* Flowers fanning out on the open paper */}
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

            {/* Subtitle guidance text */}
            <div className="absolute bottom-1 inset-x-0 flex justify-center z-30">
              <span className="font-['Fredoka'] text-[11px] font-bold text-[#811B2B] bg-white/80 px-3 py-1 rounded-full shadow-xs border border-[#811B2B]/20">
                Choose a ribbon on the right to wrap your bouquet 🎀
              </span>
            </div>
          </>
        ) : (
          /* ══════════════════════════════════════════════════════════════
              WRAPPED CONE STATE: Complete bouquet with cone, ribbon & card
             ══════════════════════════════════════════════════════════════ */
          <>
            {/* 1. Back Wrapping Paper Wings (z-10) */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
              style={{ width: '250px', height: '220px' }}
            >
              <svg viewBox="0 0 250 220" fill="none" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
                <path
                  d="M 15 25 L 125 210 L 65 80 Z"
                  fill={wrapping.foldColor}
                  stroke={wrapping.borderColor}
                  strokeWidth="1.8"
                  className="transition-colors duration-500"
                />
                <path
                  d="M 235 25 L 125 210 L 185 80 Z"
                  fill={wrapping.foldColor}
                  stroke={wrapping.borderColor}
                  strokeWidth="1.8"
                  className="transition-colors duration-500"
                />
                <path
                  d="M 25 35 Q 125 15 225 35 L 195 100 Q 125 80 55 100 Z"
                  fill={wrapping.colorHex}
                  fillOpacity="0.85"
                  className="transition-colors duration-500"
                />
              </svg>
            </div>

            {/* 2. Stems (z-15) */}
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

            {/* 3. Tucked Handwritten Greeting Card (z-18, peeking out top-right!) */}
            {note.isTucked && note.message && (
              <div
                onClick={onOpenNoteModal}
                className="absolute z-18 cursor-pointer transform rotate-6 hover:rotate-3 transition-transform duration-200"
                style={{ bottom: '155px', left: 'calc(50% + 25px)' }}
                title="Click to view/edit your handwritten note"
              >
                {/* Realistic Scalloped Edge Note Card */}
                <div
                  className="bg-[#FFFDF9] rounded-md px-3 py-2 shadow-lg border-2 relative select-none w-[110px] sm:w-[125px]"
                  style={{
                    borderColor: '#F43F5E',
                    backgroundImage: 'radial-gradient(#F43F5E 1px, transparent 1px)',
                    backgroundSize: '12px 12px',
                    backgroundColor: '#FFFDF9',
                  }}
                >
                  <div className="font-['Satisfy'] text-xs text-[#811B2B] leading-tight line-clamp-2 italic">
                    "{note.message}"
                  </div>
                  <div className="font-['Fredoka'] text-[8.5px] font-bold text-gray-500 mt-1 text-right">
                    {note.sender ? `— ${note.sender}` : '♡'}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Flower Blooms (z-20) */}
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

            {/* 5. Front Wrapping Cone (z-25) */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 z-25 pointer-events-none"
              style={{ width: '250px', height: '185px' }}
            >
              <svg viewBox="0 0 250 185" fill="none" className="w-full h-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.14)]">
                <path
                  d="M 22 28 C 75 58 125 42 228 28 L 136 180 C 130 186 120 186 114 180 Z"
                  fill={wrapping.colorHex}
                  stroke={wrapping.borderColor}
                  strokeWidth="2.2"
                  className="transition-colors duration-500"
                />
                <path
                  d="M 28 34 Q 125 70 222 34"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.4"
                />
                <path
                  d="M 34 40 Q 125 74 216 40"
                  stroke={wrapping.borderColor}
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                <path
                  d="M 45 48 Q 125 88 205 48 L 132 178 L 118 178 Z"
                  fill={wrapping.foldColor}
                  fillOpacity="0.32"
                  className="transition-colors duration-500"
                />
              </svg>
            </div>

            {/* 6. Tied Ribbon Bow (z-30) */}
            <div
              className="absolute z-30 pointer-events-none"
              style={{ bottom: '70px', left: '50%', transform: 'translateX(-50%)' }}
            >
              <svg viewBox="0 0 110 70" fill="none" className="w-24 h-16 drop-shadow-[0_4px_10px_rgba(0,0,0,0.22)]">
                <path
                  d="M 55 32 C 36 12 6 16 16 36 C 24 50 48 42 55 32 Z"
                  fill={ribbon.colorHex}
                  stroke="#5A1218"
                  strokeWidth="1.5"
                  className="transition-colors duration-300"
                />
                <path
                  d="M 55 32 C 74 12 104 16 94 36 C 86 50 62 42 55 32 Z"
                  fill={ribbon.colorHex}
                  stroke="#5A1218"
                  strokeWidth="1.5"
                  className="transition-colors duration-300"
                />
                <ellipse cx="55" cy="32" rx="7" ry="6" fill={ribbon.colorHex} stroke="#5A1218" strokeWidth="2" />
                <ellipse cx="52" cy="30" rx="3" ry="2.5" fill="white" opacity="0.3" />
                <path
                  d="M 50 36 C 42 46 34 54 28 66 L 38 64 C 44 56 50 48 52 38 Z"
                  fill={ribbon.colorHex}
                  stroke="#5A1218"
                  strokeWidth="1.2"
                  opacity="0.9"
                />
                <path
                  d="M 60 36 C 68 46 76 54 82 66 L 72 64 C 66 56 60 48 58 38 Z"
                  fill={ribbon.colorHex}
                  stroke="#5A1218"
                  strokeWidth="1.2"
                  opacity="0.9"
                />
              </svg>
            </div>
          </>
        )}
      </div>

      {/* ── Status pill + Actions below bouquet ── */}
      {totalCount > 0 && (
        <div className="flex items-center gap-2 mt-3 mb-1">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 border border-[#811B2B]/20 font-['Fredoka'] font-bold text-xs text-[#811B2B] shadow-xs">
            <span>♥</span> {totalCount} {totalCount === 1 ? 'stem' : 'stems'}
          </span>

          {isWrapped && onUndoRibbon && (
            <button
              type="button"
              onClick={onUndoRibbon}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/60 hover:bg-white text-gray-700 hover:text-[#811B2B] border border-gray-300 text-[11px] font-semibold transition-all cursor-pointer"
              title="Unwrap bouquet"
            >
              <RotateCcw className="w-3 h-3" />
              Undo
            </button>
          )}

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
        <div className="flex items-center justify-between w-full max-w-[340px] px-1 mb-1">
          <span className="font-['Fredoka'] font-black text-[10.5px] uppercase tracking-wider text-[#641623]/80">
            Wrapping Paper:
          </span>
          <span className="font-['Fredoka'] text-xs font-bold text-[#811B2B]">
            {wrapping.name}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/50 border border-[#811B2B]/15 backdrop-blur-xs">
          {WRAPPING_OPTIONS.map((w) => {
            const isSelected = w.id === wrapping.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => onSelectWrapping(w)}
                className={`relative w-7 h-7 rounded-full transition-all duration-200 cursor-pointer ${
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
