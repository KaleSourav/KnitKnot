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
  // If user has chosen ribbon AND has at least 1 flower, bouquet wraps into a cone!
  const isWrapped = hasRibbonChosen && totalCount > 0;

  // Natural fan arrangement for flower blossoms on open paper (Snug, lush bunch matching Petal Post)
  const getUnwrappedStemStyle = (index: number, total: number): React.CSSProperties => {
    if (total === 0) return {};
    if (total === 1) {
      return {
        transform: 'rotate(0deg) scale(1.15)',
        transformOrigin: 'bottom center',
        zIndex: 10,
      };
    }

    const spread = Math.min(total - 1, 10);
    const progress = spread === 0 ? 0.5 : index / spread;
    // Fan angle between -20deg and +20deg (snug florist fan)
    const angleRange = Math.min(40, 14 + spread * 3.0);
    const angle = -angleRange / 2 + progress * angleRange;

    // Horizontal spread from -55px to +55px (tightly gathered florist bunch matching reference)
    const xRange = Math.min(115, 20 + spread * 11);
    const xOffset = -xRange / 2 + progress * xRange;

    // Arch height: center blooms sit higher
    const archOffset = (1 - Math.pow((progress - 0.5) * 2, 2)) * 22;

    return {
      transform: `translateX(${xOffset}px) translateY(${-archOffset}px) rotate(${angle}deg)`,
      transformOrigin: 'bottom center',
      zIndex: Math.round(10 + (1 - Math.abs(progress - 0.5)) * 10),
    };
  };

  // Natural compact dome arrangement for flowers emerging directly from cone opening
  const getWrappedStemStyle = (index: number, total: number): React.CSSProperties => {
    if (total === 0) return {};
    if (total === 1) {
      return {
        transform: 'rotate(0deg) scale(1.15)',
        transformOrigin: 'bottom center',
        zIndex: 10,
      };
    }

    const spread = Math.min(total - 1, 10);
    const progress = spread === 0 ? 0.5 : index / spread;
    // Tightly gathered cone fan angle between -12deg and +12deg
    const angle = -12 + progress * 24;
    // Tightly gathered horizontal spread from -34px to +34px
    const xOffset = -34 + progress * 68;
    // Arch dome
    const arch = (1 - Math.pow((progress - 0.5) * 2, 2)) * 14;

    return {
      transform: `translateX(${xOffset}px) translateY(${-arch}px) rotate(${angle}deg)`,
      transformOrigin: 'bottom center',
      zIndex: Math.round(10 + (1 - Math.abs(progress - 0.5)) * 10),
    };
  };

  return (
    <div className="relative w-full max-w-[480px] lg:max-w-[520px] mx-auto flex flex-col items-center select-none">
      {/* ── Central Bouquet Stage on Counter ── */}
      <div
        className="relative w-full flex items-end justify-center"
        style={{ height: '370px' }}
      >
        {totalCount === 0 ? (
          /* ══════════════════════════════════════════════════════════════
              EMPTY STAGE: Photorealistic flat open diamond wrapping paper
              with resting white-gloved hand (Matching Annie's Petal Post)
             ══════════════════════════════════════════════════════════════ */
          <div className="relative flex flex-col items-center justify-center pb-2 animate-fadeIn">
            {/* Flat diamond open wrapping sheet with centered radiant backlight */}
            <div className="relative w-[300px] h-[300px] flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]">
              {/* Luminous yellow radial halo (100% locked to paper center) */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(254, 240, 138, 0.7) 0%, rgba(250, 204, 21, 0.45) 45%, rgba(245, 158, 11, 0.15) 70%, transparent 85%)',
                  filter: 'blur(24px)',
                  transform: 'scale(1.15)',
                }}
              />

              <img
                src="/boutique/wrapping-paper-open.png"
                alt="Open wrapping paper sheet"
                className="relative z-10 w-full h-full object-contain pointer-events-none select-none"
                style={{
                  filter:
                    'drop-shadow(0 0 16px rgba(254, 240, 138, 0.95)) drop-shadow(0 0 32px rgba(250, 204, 21, 0.85)) drop-shadow(0 0 50px rgba(234, 179, 8, 0.5)) drop-shadow(0 16px 28px rgba(0,0,0,0.22))',
                }}
              />
            </div>

            {/* Photorealistic White Gloved Hand resting on paper */}
            <div
              className="absolute pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] z-15"
              style={{
                width: '130px',
                height: '150px',
                top: '42%',
                left: '42%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <img
                src="/boutique/gloved-hand-resting.png"
                alt="Florist white gloved hand"
                className="w-full h-full object-contain pointer-events-none select-none animate-bounce-subtle"
              />
            </div>

            {/* Instruction Bubble */}
            <div className="absolute -bottom-2 inset-x-0 flex justify-center pointer-events-none z-20">
              <span className="font-['Fredoka'] font-bold text-xs text-[#811B2B] bg-white/95 px-4 py-1.5 rounded-full shadow-md border border-[#811B2B]/20">
                Pick flowers from the shelf above to build your bouquet ♡
              </span>
            </div>
          </div>
        ) : !isWrapped ? (
          /* ══════════════════════════════════════════════════════════════
              UNWRAPPED STAGE: Flowers laid out on open diamond sheet
              with green stems converging and gloved hand holding stems
             ══════════════════════════════════════════════════════════════ */
          <>
            {/* Open diamond wrapping paper sheet underneath with perfectly centered radiant halo */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center justify-center"
              style={{ width: '310px', height: '310px' }}
            >
              {/* Luminous sunny-yellow radiant backlight halo (100% centered on paper) */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(254, 240, 138, 0.75) 0%, rgba(250, 204, 21, 0.5) 45%, rgba(245, 158, 11, 0.18) 70%, transparent 85%)',
                  filter: 'blur(26px)',
                  transform: 'scale(1.18)',
                }}
              />

              <img
                src="/boutique/wrapping-paper-open.png"
                alt="Open wrapping paper"
                className="relative z-10 w-full h-full object-contain pointer-events-none"
                style={{
                  filter:
                    'drop-shadow(0 0 16px rgba(254, 240, 138, 0.95)) drop-shadow(0 0 32px rgba(250, 204, 21, 0.85)) drop-shadow(0 0 50px rgba(234, 179, 8, 0.5)) drop-shadow(0 16px 28px rgba(0,0,0,0.22))',
                }}
              />
            </div>

            {/* Converging Stems */}
            <div
              className="absolute pointer-events-none z-15"
              style={{
                bottom: '60px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '240px',
                height: '110px',
              }}
            >
              <svg viewBox="0 0 240 110" fill="none" className="w-full h-full">
                {flowerInstances.slice(0, 16).map((_, idx) => {
                  const spread = Math.min(flowerInstances.length - 1, 10);
                  const progress = spread === 0 ? 0.5 : idx / spread;
                  const xRange = Math.min(115, 20 + spread * 11);
                  const startX = 120 + (progress - 0.5) * xRange;
                  return (
                    <line
                      key={idx}
                      x1={startX}
                      y1="0"
                      x2="120"
                      y2="105"
                      stroke="#3B6B22"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      opacity="0.95"
                    />
                  );
                })}
              </svg>
            </div>

            {/* ── Luminous Soft Bloom behind flower heads ── */}
            <div
              className="absolute pointer-events-none z-18 rounded-full"
              style={{
                bottom: '95px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '180px',
                height: '130px',
                background:
                  'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.75) 0%, rgba(254, 240, 138, 0.5) 45%, rgba(250, 204, 21, 0.2) 75%, transparent 90%)',
                filter: 'blur(16px)',
              }}
            />

            {/* Flowers fanning out on the open paper (Nestled directly on yellow paper with glowing luminous pop) */}
            <div
              className="absolute bottom-[65px] left-1/2 pointer-events-none z-20"
              style={{ transform: 'translateX(-50%)', width: '1px', height: '1px' }}
            >
              {flowerInstances.slice(0, 16).map((flower, idx) => {
                const style = getUnwrappedStemStyle(idx, Math.min(flowerInstances.length, 16));
                return (
                  <div
                    key={`${flower.variantId}-${idx}`}
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                      ...style,
                      width: '135px',
                      height: '175px',
                      left: '-67px',
                      bottom: '0',
                    }}
                  >
                    <img
                      src={flower.cutoutImage || flower.image}
                      alt={flower.name}
                      className="w-full h-full object-contain select-none pointer-events-none transition-transform duration-300 hover:scale-105"
                      style={{
                        filter:
                          'brightness(1.08) contrast(1.06) saturate(1.15) drop-shadow(0 0 10px rgba(255, 245, 180, 0.7)) drop-shadow(0 0 20px rgba(254, 224, 71, 0.4)) drop-shadow(0 12px 20px rgba(0,0,0,0.25))',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* White Gloved Hand holding stems at convergence point */}
            <div
              className="absolute pointer-events-none z-25 drop-shadow-[0_12px_22px_rgba(0,0,0,0.32)]"
              style={{
                width: '115px',
                height: '135px',
                bottom: '38px',
                left: 'calc(50% - 18px)',
              }}
            >
              <img
                src="/boutique/gloved-hand-resting.png"
                alt="Gloved florist hand"
                className="w-full h-full object-contain pointer-events-none select-none -rotate-12"
              />
            </div>

            {/* ── Small White Stem Count Pill at bottom tip of paper (Matching Petal Post reference) ── */}
            <div className="absolute -bottom-1.5 inset-x-0 flex justify-center z-30 pointer-events-none">
              <span className="font-['Fredoka'] text-[11px] font-bold text-[#811B2B] bg-white/95 px-3.5 py-1 rounded-full shadow-md border border-[#811B2B]/20">
                {totalCount} {totalCount === 1 ? 'stem' : 'stems'}
              </span>
            </div>
          </>
        ) : (
          /* ══════════════════════════════════════════════════════════════
              WRAPPED CONE STAGE: Photorealistic crepe paper cone, tied ribbon & card
              Flower heads emerge naturally right from the cone's top opening
             ══════════════════════════════════════════════════════════════ */
          <>
            {/* 1. Photorealistic Folded Crepe Paper Cone (Back Layer, z-10) with centered radiant backlight */}
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]"
              style={{ width: '235px', height: '280px' }}
            >
              {/* Luminous yellow radial halo (100% locked to cone center) */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(254, 240, 138, 0.75) 0%, rgba(250, 204, 21, 0.45) 50%, transparent 80%)',
                  filter: 'blur(22px)',
                  transform: 'scale(1.15)',
                }}
              />

              <img
                src="/boutique/wrapping-paper-cone.png"
                alt="Wrapped bouquet crepe cone"
                className="relative z-10 w-full h-full object-contain pointer-events-none"
                style={{
                  filter:
                    'drop-shadow(0 0 16px rgba(254, 240, 138, 0.9)) drop-shadow(0 0 35px rgba(250, 204, 21, 0.65)) drop-shadow(0 18px 32px rgba(0,0,0,0.28))',
                }}
              />
            </div>

            {/* 2. Customer's Actual Flower Blossoms blooming naturally out of the top cone opening (z-18) */}
            <div
              className="absolute bottom-[140px] left-1/2 pointer-events-none z-18"
              style={{ transform: 'translateX(-50%)', width: '1px', height: '1px' }}
            >
              {flowerInstances.slice(0, 16).map((flower, idx) => {
                const style = getWrappedStemStyle(idx, Math.min(flowerInstances.length, 16));
                return (
                  <div
                    key={`${flower.variantId}-${idx}`}
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                      ...style,
                      width: '140px',
                      height: '180px',
                      left: '-70px',
                      bottom: '0',
                    }}
                  >
                    <img
                      src={flower.cutoutImage || flower.image}
                      alt={flower.name}
                      className="w-full h-full object-contain select-none pointer-events-none"
                      style={{
                        filter:
                          'brightness(1.08) contrast(1.06) saturate(1.15) drop-shadow(0 0 10px rgba(255, 245, 180, 0.7)) drop-shadow(0 0 20px rgba(254, 224, 71, 0.4)) drop-shadow(0 10px 18px rgba(0,0,0,0.28))',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* 3. Tucked Handwritten Greeting Card (peeking out top-right of cone, z-22) */}
            {note.isTucked && note.message && (
              <div
                onClick={onOpenNoteModal}
                className="absolute z-22 cursor-pointer transform rotate-6 hover:rotate-3 transition-transform duration-200 drop-shadow-md"
                style={{ bottom: '210px', left: 'calc(50% + 35px)' }}
                title="Click to view/edit your handwritten note"
              >
                <div
                  className="w-16 h-20 rounded-md bg-[#FFFDF9] border-2 shadow-lg p-1.5 flex flex-col justify-between"
                  style={{ borderColor: '#811B2B' }}
                >
                  <span className="text-[8px] font-['Satisfy'] text-[#811B2B] leading-tight line-clamp-3">
                    "{note.message}"
                  </span>
                  <div className="flex items-center justify-between text-[7px] text-[#811B2B]/70 font-mono">
                    <span>💌</span>
                    <span>{note.recipient || 'Dear'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Front Crepe Cone Flap (z-24) - Covers lower stems inside the cone */}
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 z-24 pointer-events-none"
              style={{ width: '235px', height: '280px' }}
            >
              <img
                src="/boutique/wrapping-paper-cone-front.png"
                alt="Front fold"
                className="w-full h-full object-contain select-none pointer-events-none"
              />
            </div>

            {/* 5. Tied Photorealistic 3D Satin Ribbon Bow (z-26, positioned at the cone's waist) */}
            <div
              className="absolute z-26 pointer-events-none drop-shadow-[0_14px_24px_rgba(0,0,0,0.35)]"
              style={{
                bottom: '75px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '140px',
                height: '140px',
              }}
            >
              <img
                src={ribbon.image || '/boutique/satin-ribbon-orange.png'}
                alt={ribbon.name}
                className="w-full h-full object-contain select-none pointer-events-none animate-scaleIn"
              />
            </div>

            {/* Action Bar Overlay */}
            <div className="absolute -bottom-1 inset-x-0 flex items-center justify-center gap-2 z-30">
              {onUndoRibbon && (
                <button
                  type="button"
                  onClick={onUndoRibbon}
                  className="text-[10px] font-bold text-[#811B2B] bg-white/95 px-3.5 py-1.5 rounded-full shadow-sm border border-[#811B2B]/20 hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Unwrap &amp; Add More</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Bouquet Footer Controls (Wrapping Swatches & Counter Stats) ── */}
      <div className="w-full mt-2 flex items-center justify-between px-3">
        {/* Wrapping Paper Swatches */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-[#811B2B]/85 font-['Fredoka'] mr-1">
            Paper:
          </span>
          {WRAPPING_OPTIONS.slice(0, 5).map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => onSelectWrapping(w)}
              title={w.name}
              className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                wrapping.id === w.id
                  ? 'scale-125 border-[#811B2B] shadow-sm'
                  : 'border-white/80 hover:scale-110'
              }`}
              style={{ backgroundColor: w.colorHex }}
            />
          ))}
        </div>

        {/* Stem Count Pill & Clear Bouquet */}
        <div className="flex items-center gap-2">
          {totalCount > 0 && (
            <>
              <span className="text-[11px] font-bold text-white bg-[#811B2B] px-3 py-0.5 rounded-full shadow-xs">
                {totalCount} {totalCount === 1 ? 'stem' : 'stems'}
              </span>
              <button
                type="button"
                onClick={onClearBouquet}
                title="Clear all flowers"
                className="w-6 h-6 rounded-full bg-white/90 text-[#811B2B] hover:bg-white flex items-center justify-center shadow-xs cursor-pointer transition-transform active:scale-90"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
