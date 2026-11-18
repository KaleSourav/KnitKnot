import React from 'react';
import { RibbonOption, RIBBON_OPTIONS } from '../../data/bouquetFlowers';
import { Sparkles, Edit3 } from 'lucide-react';

interface FinishingTouchBarProps {
  selectedRibbon: RibbonOption;
  onSelectRibbon: (ribbon: RibbonOption) => void;
  hasRibbonChosen: boolean;
  hasNote: boolean;
  noteRecipient: string;
  noteMessage: string;
  onOpenNoteModal: () => void;
  onChangeRibbonClick: () => void;
}

export const FinishingTouchBar: React.FC<FinishingTouchBarProps> = ({
  selectedRibbon,
  onSelectRibbon,
  hasRibbonChosen,
  hasNote,
  noteRecipient,
  noteMessage,
  onOpenNoteModal,
  onChangeRibbonClick,
}) => {
  return (
    <div className="w-full max-w-[340px] mx-auto flex flex-col items-center select-none text-center">
      {!hasRibbonChosen ? (
        /* ══════════════════════════════════════════════════════════════
            PHASE 1: "The finishing touch." (Ribbons Sitting Directly on Counter)
            Matching Petal Post 100%: 3 photorealistic silky bows on the table
           ══════════════════════════════════════════════════════════════ */
        <div className="w-full flex flex-col items-center animate-fadeIn">
          {/* Handwritten Cursive Script Title matching Petal Post */}
          <h3
            className="font-['Satisfy'] text-3xl sm:text-4xl text-[#811B2B] leading-tight drop-shadow-sm"
            style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.7)' }}
          >
            The finishing touch.
          </h3>
          <p className="font-['Fredoka'] text-xs font-semibold text-[#811B2B]/90 mt-1 max-w-[260px] leading-relaxed drop-shadow-xs">
            Choose a ribbon bow to tie around your bouquet:
          </p>

          {/* 3 Silky Ribbon Bows Resting Directly on Counter (NO box container) */}
          <div className="flex items-end justify-center gap-3 sm:gap-4 mt-3 pt-1">
            {RIBBON_OPTIONS.slice(0, 3).map((r) => {
              const isSelected = selectedRibbon.id === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSelectRibbon(r)}
                  className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
                    isSelected ? 'scale-105' : 'hover:scale-105 opacity-90 hover:opacity-100'
                  }`}
                  title={`Choose ${r.name}`}
                >
                  {/* Subtle golden halo when selected */}
                  {isSelected && (
                    <div className="absolute -inset-1 rounded-full bg-[#FBBF24]/40 blur-md -z-10 animate-pulse" />
                  )}

                  {/* Photorealistic 3D Satin Ribbon Bow */}
                  <div className="w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center drop-shadow-[0_12px_20px_rgba(0,0,0,0.28)] transition-transform group-hover:-translate-y-1 group-active:scale-95">
                    <img
                      src={r.image || '/boutique/satin-ribbon-orange.png'}
                      alt={r.name}
                      className="w-full h-full object-contain select-none pointer-events-none"
                    />
                  </div>

                  {/* Clean Ribbon Label (Petal Post style) */}
                  <span
                    className={`font-['Fredoka'] text-[11px] font-bold mt-1.5 transition-colors ${
                      isSelected ? 'text-[#811B2B] underline decoration-2' : 'text-[#811B2B]/85'
                    }`}
                  >
                    {r.name.replace(' Satin', '').replace(' Velvet', '').replace(' Silk', '')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* More Colors Dropdown/Pills */}
          <div className="flex items-center gap-2 mt-3">
            {RIBBON_OPTIONS.slice(3).map((r) => {
              const isSelected = selectedRibbon.id === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSelectRibbon(r)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#811B2B] text-white shadow-sm scale-105'
                      : 'bg-white/80 text-[#811B2B] hover:bg-white shadow-xs'
                  }`}
                >
                  {r.name.replace(' Satin', '').replace(' Velvet', '').replace(' Silk', '')}
                </button>
              );
            })}
          </div>

          <p className="font-['Fredoka'] text-[11px] text-[#811B2B]/75 font-semibold mt-2.5 italic drop-shadow-xs">
            Click a ribbon to cinch &amp; tie your bouquet ♡
          </p>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
            PHASE 2: "Make it personal." (Stationery Note Cards)
           ══════════════════════════════════════════════════════════════ */
        <div className="w-full flex flex-col items-center animate-fadeIn">
          {/* Handwritten Cursive Script Title */}
          <h3
            className="font-['Satisfy'] text-3xl sm:text-4xl text-[#811B2B] leading-tight drop-shadow-sm"
            style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.7)' }}
          >
            Make it personal.
          </h3>
          <p className="font-['Fredoka'] text-xs font-semibold text-[#811B2B]/90 mt-1 max-w-[260px] leading-relaxed drop-shadow-xs">
            Pick a card to tuck a handwritten note into the flowers:
          </p>

          {/* 3 Cute Stationery Note Cards Resting on Counter */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3">
            {/* Card 1: Red Scalloped Border Card */}
            <div
              onClick={onOpenNoteModal}
              className="group cursor-pointer flex flex-col items-center transition-transform hover:-translate-y-1.5 active:scale-95"
            >
              <div
                className="w-18 h-24 sm:w-20 sm:h-26 rounded-md bg-[#FFFDF9] border-2 shadow-lg relative p-2 flex flex-col justify-between select-none"
                style={{ borderColor: '#F43F5E' }}
              >
                <div
                  className="w-full h-full border border-dashed rounded-[3px] p-1.5 flex flex-col justify-between"
                  style={{ borderColor: '#F43F5E' }}
                >
                  <span className="text-[9px] font-['Satisfy'] text-[#811B2B] leading-tight">
                    {hasNote ? 'Tucked ♡' : 'With love'}
                  </span>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F43F5E]/20 self-end flex items-center justify-center">
                    <span className="text-[8px] text-[#F43F5E]">💌</span>
                  </div>
                </div>
              </div>
              <span className="font-['Fredoka'] text-[10px] font-bold text-[#811B2B] mt-1.5">
                Scallop
              </span>
            </div>

            {/* Card 2: Butter Cream Gold Border Card */}
            <div
              onClick={onOpenNoteModal}
              className="group cursor-pointer flex flex-col items-center transition-transform hover:-translate-y-1.5 active:scale-95"
            >
              <div
                className="w-18 h-24 sm:w-20 sm:h-26 rounded-md bg-[#FFFDF0] border-2 shadow-lg relative p-2 flex flex-col justify-between select-none"
                style={{ borderColor: '#F59E0B' }}
              >
                <div
                  className="w-full h-full border border-solid rounded-[3px] p-1.5 flex flex-col justify-between"
                  style={{ borderColor: '#F59E0B' }}
                >
                  <span className="text-[9px] font-['Satisfy'] text-[#92400E] leading-tight">
                    {hasNote ? 'Handwritten' : 'Sweet note'}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/30 self-end" />
                </div>
              </div>
              <span className="font-['Fredoka'] text-[10px] font-bold text-[#811B2B] mt-1.5">
                Gold Trim
              </span>
            </div>

            {/* Card 3: Pink Blossom Border Card */}
            <div
              onClick={onOpenNoteModal}
              className="group cursor-pointer flex flex-col items-center transition-transform hover:-translate-y-1.5 active:scale-95"
            >
              <div
                className="w-18 h-24 sm:w-20 sm:h-26 rounded-md bg-[#FFF7F7] border-2 shadow-lg relative p-2 flex flex-col justify-between select-none"
                style={{ borderColor: '#EC4899' }}
              >
                <div
                  className="w-full h-full border border-dotted rounded-[3px] p-1.5 flex flex-col justify-between"
                  style={{ borderColor: '#EC4899' }}
                >
                  <span className="text-[9px] font-['Satisfy'] text-[#9D174D] leading-tight">
                    {hasNote ? 'Personal note' : 'For you'}
                  </span>
                  <span className="text-[8px] self-end">🌸</span>
                </div>
              </div>
              <span className="font-['Fredoka'] text-[10px] font-bold text-[#811B2B] mt-1.5">
                Floral
              </span>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            type="button"
            onClick={onOpenNoteModal}
            className="mt-3.5 px-5 py-2 rounded-full font-['Fredoka'] font-bold text-xs uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
            style={{ background: '#811B2B' }}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{hasNote ? 'Edit Handwritten Note →' : 'Write Note on Card →'}</span>
          </button>

          {/* Change Ribbon Back Link */}
          <button
            type="button"
            onClick={onChangeRibbonClick}
            className="mt-2 text-[11px] font-bold text-[#811B2B]/80 hover:text-[#811B2B] hover:underline cursor-pointer transition-colors"
          >
            Change ribbon ({selectedRibbon.name})
          </button>
        </div>
      )}
    </div>
  );
};
