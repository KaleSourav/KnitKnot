import React from 'react';
import {
  FlowerStem,
  WrappingOption,
  RibbonOption,
  WRAPPING_OPTIONS,
} from '../../data/bouquetFlowers';
import { Trash2, RotateCcw, Sparkles } from 'lucide-react';

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

  // Natural fan arrangement for flower blossoms
  const getStemStyle = (index: number, total: number): React.CSSProperties => {
    if (total === 0) return {};
    if (total === 1) {
      return {
        transform: 'rotate(0deg) scale(1.05)',
        transformOrigin: 'bottom center',
        zIndex: 10,
      };
    }

    const spread = Math.min(total - 1, 12);
    const progress = spread === 0 ? 0.5 : index / spread;
    // Fan angle between -26deg and +26deg
    const angleRange = Math.min(52, 16 + spread * 3.4);
    const angle = -angleRange / 2 + progress * angleRange;

    // Horizontal spread from -80px to +80px
    const xRange = Math.min(150, 24 + spread * 11);
    const xOffset = -xRange / 2 + progress * xRange;

    // Arch height: center blooms sit higher
    const archOffset = (1 - Math.pow((progress - 0.5) * 2, 2)) * 26;

    return {
      transform: `translateX(${xOffset}px) translateY(${-archOffset}px) rotate(${angle}deg)`,
      transformOrigin: 'bottom center',
      zIndex: Math.round(10 + (1 - Math.abs(progress - 0.5)) * 10),
    };
  };

  return (
    <div className="relative w-full max-w-[460px] lg:max-w-[500px] mx-auto flex flex-col items-center select-none">
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
          <div className="relative flex flex-col items-center justify-center pb-4 animate-fadeIn">
            {/* Flat diamond open wrapping sheet */}
            <div className="relative w-[270px] h-[270px] drop-shadow-[0_18px_30px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:scale-[1.02]">
              <img
                src="/boutique/wrapping-paper-open.png"
                alt="Open wrapping paper sheet"
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            </div>

            {/* Photorealistic White Gloved Hand resting on paper */}
            <div
              className="absolute pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.28)]"
              style={{
                width: '120px',
                height: '140px',
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
            <div className="absolute -bottom-1 inset-x-0 flex justify-center pointer-events-none">
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
            {/* Open diamond wrapping paper sheet underneath */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
              style={{ width: '290px', height: '290px' }}
            >
              <img
                src="/boutique/wrapping-paper-open.png"
                alt="Open wrapping paper"
                className="w-full h-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.22)] pointer-events-none"
              />
            </div>

            {/* Converging Stems */}
            <div
              className="absolute pointer-events-none z-15"
              style={{
                bottom: '72px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '240px',
                height: '115px',
              }}
            >
              <svg viewBox="0 0 240 115" fill="none" className="w-full h-full">
                {flowerInstances.slice(0, 16).map((_, idx) => {
                  const spread = Math.min(flowerInstances.length - 1, 12);
                  const progress = spread === 0 ? 0.5 : idx / spread;
                  const xRange = Math.min(150, 20 + spread * 11);
                  const startX = 120 + (progress - 0.5) * xRange;
                  return (
                    <line
                      key={idx}
                      x1={startX}
                      y1="0"
                      x2="120"
                      y2="110"
                      stroke="#427328"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.9"
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
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                      ...style,
                      width: '120px',
                      height: '155px',
                      left: '-60px',
                      bottom: '0',
                    }}
                  >
                    <img
                      src={flower.cutoutImage || flower.image}
                      alt={flower.name}
                      className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.24)]"
                    />
                  </div>
                );
              })}
            </div>

            {/* White Gloved Hand holding stems at convergence point */}
            <div
              className="absolute pointer-events-none z-25 drop-shadow-[0_10px_18px_rgba(0,0,0,0.3)]"
              style={{
                width: '100px',
                height: '120px',
                bottom: '50px',
                left: 'calc(50% - 15px)',
              }}
            >
              <img
                src="/boutique/gloved-hand-resting.png"
                alt="Gloved florist hand"
                className="w-full h-full object-contain pointer-events-none select-none -rotate-12"
              />
            </div>

            {/* Subtitle guidance text */}
            <div className="absolute bottom-0 inset-x-0 flex justify-center z-30">
              <span className="font-['Fredoka'] text-[11px] font-bold text-[#811B2B] bg-white/95 px-3.5 py-1 rounded-full shadow-sm border border-[#811B2B]/20">
                Choose a ribbon on the right to wrap your bouquet 🎀
              </span>
            </div>
          </>
        ) : (
          /* ══════════════════════════════════════════════════════════════
              WRAPPED CONE STAGE: Photorealistic crepe paper cone, tied ribbon & card
             ══════════════════════════════════════════════════════════════ */
          <>
            {/* Stems Converging at base peeking out */}
            <div
              className="absolute pointer-events-none z-10"
              style={{
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '40px',
              }}
            >
              <svg viewBox="0 0 80 40" fill="none" className="w-full h-full">
                <line x1="32" y1="0" x2="38" y2="35" stroke="#427328" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="40" y1="0" x2="40" y2="38" stroke="#427328" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="48" y1="0" x2="42" y2="35" stroke="#427328" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Flower Blossoms blooming naturally out of the top cone opening (z-15) */}
            <div
              className="absolute bottom-[180px] left-1/2 pointer-events-none z-15"
              style={{ transform: 'translateX(-50%)', width: '1px', height: '1px' }}
            >
              {flowerInstances.slice(0, 16).map((flower, idx) => {
                const spread = Math.min(flowerInstances.length - 1, 10);
                const progress = spread === 0 ? 0.5 : idx / spread;
                const angle = -18 + progress * 36;
                const xOffset = -55 + progress * 110;
                const arch = (1 - Math.pow((progress - 0.5) * 2, 2)) * 18;

                return (
                  <div
                    key={`${flower.variantId}-${idx}`}
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                      transform: `translateX(${xOffset}px) translateY(${-arch}px) rotate(${angle}deg)`,
                      transformOrigin: 'bottom center',
                      width: '105px',
                      height: '135px',
                      left: '-52px',
                      bottom: '0',
                      zIndex: Math.round(10 + (1 - Math.abs(progress - 0.5)) * 10),
                    }}
                  >
                    <img
                      src={flower.cutoutImage || flower.image}
                      alt={flower.name}
                      className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_8px_14px_rgba(0,0,0,0.22)]"
                    />
                  </div>
                );
              })}
            </div>

            {/* Tucked Handwritten Greeting Card (peeking out top-right) */}
            {note.isTucked && note.message && (
              <div
                onClick={onOpenNoteModal}
                className="absolute z-22 cursor-pointer transform rotate-6 hover:rotate-3 transition-transform duration-200 drop-shadow-md"
                style={{ bottom: '195px', left: 'calc(50% + 28px)' }}
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

            {/* Photorealistic Folded Crepe Paper Cone (z-20) */}
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
              style={{ width: '220px', height: '270px' }}
            >
              <img
                src="/boutique/wrapping-paper-cone.png"
                alt="Wrapped bouquet crepe cone"
                className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)] pointer-events-none"
              />
            </div>

            {/* Tied Photorealistic 3D Satin Ribbon Bow (z-25, positioned at the cone's waist) */}
            <div
              className="absolute z-25 pointer-events-none drop-shadow-[0_12px_22px_rgba(0,0,0,0.35)]"
              style={{
                bottom: '65px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '130px',
                height: '130px',
              }}
            >
              <img
                src={ribbon.image || '/boutique/satin-ribbon-orange.png'}
                alt={ribbon.name}
                className="w-full h-full object-contain select-none pointer-events-none animate-scaleIn"
              />
            </div>

            {/* Action Bar Overlay */}
            <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-2 z-30">
              {onUndoRibbon && (
                <button
                  type="button"
                  onClick={onUndoRibbon}
                  className="text-[10px] font-bold text-[#811B2B] bg-white/95 px-3 py-1 rounded-full shadow-sm border border-[#811B2B]/20 hover:bg-white transition-colors cursor-pointer flex items-center gap-1"
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
      <div className="w-full mt-2 flex items-center justify-between px-2">
        {/* Wrapping Paper Swatches */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-[#811B2B]/80 font-['Fredoka'] mr-1">
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
              <span className="text-[11px] font-bold text-white bg-[#811B2B] px-2.5 py-0.5 rounded-full shadow-xs">
                {totalCount} {totalCount === 1 ? 'stem' : 'stems'}
              </span>
              <button
                type="button"
                onClick={onClearBouquet}
                title="Clear all flowers"
                className="w-6 h-6 rounded-full bg-white/80 text-[#811B2B] hover:bg-white flex items-center justify-center shadow-xs cursor-pointer transition-transform active:scale-90"
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
