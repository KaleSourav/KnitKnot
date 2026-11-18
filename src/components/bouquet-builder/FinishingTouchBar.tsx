import React from 'react';
import { RibbonOption, RIBBON_OPTIONS } from '../../data/bouquetFlowers';
import { Sparkles, Edit3, Check } from 'lucide-react';

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

// Detailed Satin Bow SVG Component
const BowSVG: React.FC<{ colorHex: string; isSelected: boolean }> = ({
  colorHex,
  isSelected,
}) => (
  <svg
    viewBox="0 0 110 80"
    className={`w-18 h-14 sm:w-20 sm:h-16 transition-all duration-300 drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)] ${
      isSelected ? 'scale-110 drop-shadow-[0_10px_22px_rgba(129,27,43,0.35)]' : 'hover:scale-105'
    }`}
    fill="none"
  >
    {/* Left Ribbon Tail */}
    <path
      d="M 50 42 C 40 54 28 66 18 78 L 32 75 C 40 64 48 52 52 44 Z"
      fill={colorHex}
      stroke="#5A1218"
      strokeWidth="1.2"
      opacity="0.9"
    />
    {/* Right Ribbon Tail */}
    <path
      d="M 60 42 C 70 54 82 66 92 78 L 78 75 C 70 64 62 52 58 44 Z"
      fill={colorHex}
      stroke="#5A1218"
      strokeWidth="1.2"
      opacity="0.9"
    />
    {/* Left Bow Loop */}
    <path
      d="M 55 36 C 32 10 -2 16 12 40 C 22 56 46 48 55 36 Z"
      fill={colorHex}
      stroke="#5A1218"
      strokeWidth="1.6"
    />
    {/* Right Bow Loop */}
    <path
      d="M 55 36 C 78 10 112 16 98 40 C 88 56 64 48 55 36 Z"
      fill={colorHex}
      stroke="#5A1218"
      strokeWidth="1.6"
    />
    {/* Center Knot */}
    <ellipse cx="55" cy="36" rx="8" ry="7" fill={colorHex} stroke="#5A1218" strokeWidth="2" />
    {/* Glossy Sheen Highlight */}
    <ellipse cx="52" cy="33" rx="3.5" ry="3" fill="white" opacity="0.35" />
    <path d="M 28 26 Q 42 22 50 32" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    <path d="M 82 26 Q 68 22 60 32" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
  </svg>
);

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
    <div className="w-full max-w-[320px] mx-auto flex flex-col items-center select-none text-center">
      {!hasRibbonChosen ? (
        /* ══════════════════════════════════════════════════════════════
            PHASE 1: "The finishing touch." (Ribbon Selection)
           ══════════════════════════════════════════════════════════════ */
        <div className="w-full flex flex-col items-center animate-fadeIn">
          {/* Handwritten Cursive Script Title */}
          <h3 className="font-['Satisfy'] text-2xl sm:text-[28px] text-[#811B2B] leading-tight drop-shadow-xs">
            The finishing touch.
          </h3>
          <p className="font-['Fredoka'] text-[11.5px] text-[#641623]/80 mt-1 max-w-[240px] leading-relaxed">
            Choose a ribbon bow to tie around your bouquet:
          </p>

          {/* 3 Ribbon Bows Laid Out on the Pink Counter */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 pt-1">
            {RIBBON_OPTIONS.map((r) => {
              const isSelected = selectedRibbon.id === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSelectRibbon(r)}
                  className={`group relative flex flex-col items-center p-2 rounded-2xl transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-white/40 ring-2 ring-[#811B2B] shadow-sm'
                      : 'hover:bg-white/20'
                  }`}
                  title={`Choose ${r.name}`}
                >
                  <BowSVG colorHex={r.colorHex} isSelected={isSelected} />
                  <span className="font-['Fredoka'] text-[10.5px] font-bold text-[#641623] mt-1 block">
                    {r.name}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-extrabold text-[#811B2B] uppercase tracking-wide">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="font-['Fredoka'] text-[10px] text-[#641623]/60 italic mt-3">
            Click a ribbon to cinch &amp; tie your bouquet
          </p>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
            PHASE 2: "Make it personal." (Stationery Note Cards)
           ══════════════════════════════════════════════════════════════ */
        <div className="w-full flex flex-col items-center animate-fadeIn">
          {/* Handwritten Cursive Script Title */}
          <h3 className="font-['Satisfy'] text-2xl sm:text-[28px] text-[#811B2B] leading-tight drop-shadow-xs">
            Make it personal.
          </h3>
          <p className="font-['Fredoka'] text-[11.5px] text-[#641623]/80 mt-1 max-w-[250px] leading-relaxed">
            Pick a card to tuck a handwritten note into the flowers:
          </p>

          {/* 3 Cute Stationery Note Cards Laid Out on the Counter */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-4">
            {/* Card 1: Red Scalloped Border Card */}
            <div
              onClick={onOpenNoteModal}
              className="group cursor-pointer flex flex-col items-center transition-transform hover:-translate-y-1 active:scale-95"
            >
              <div
                className="w-16 h-20 sm:w-18 sm:h-22 rounded-md bg-[#FFFDF9] border-2 shadow-md relative p-1.5 flex flex-col justify-between select-none"
                style={{ borderColor: '#F43F5E' }}
              >
                {/* Scalloped interior dots */}
                <div
                  className="w-full h-full border border-dashed rounded-[3px] p-1 flex flex-col justify-between"
                  style={{ borderColor: '#F43F5E' }}
                >
                  <span className="text-[8px] font-['Satisfy'] text-[#811B2B] leading-tight">
                    {hasNote ? 'Tucked ♡' : 'With love'}
                  </span>
                  <div className="w-3 h-3 rounded-full bg-[#F43F5E]/20 self-end flex items-center justify-center">
                    <span className="text-[7px] text-[#F43F5E]">💌</span>
                  </div>
                </div>
              </div>
              <span className="font-['Fredoka'] text-[10px] font-bold text-[#641623] mt-1">
                Scallop
              </span>
            </div>

            {/* Card 2: Golden Warm Cream Card */}
            <div
              onClick={onOpenNoteModal}
              className="group cursor-pointer flex flex-col items-center transition-transform hover:-translate-y-1 active:scale-95"
            >
              <div
                className="w-16 h-20 sm:w-18 sm:h-22 rounded-md bg-[#FFF9E6] border-2 border-[#D97706] shadow-md relative p-1.5 flex flex-col justify-between select-none"
              >
                <div className="w-full h-full border border-[#D97706]/40 rounded-[3px] p-1 flex flex-col justify-between">
                  <span className="text-[8px] font-['Satisfy'] text-[#92400E] leading-tight">
                    Sweet note
                  </span>
                  <div className="w-3 h-3 rounded-full bg-[#D97706]/20 self-end flex items-center justify-center">
                    <span className="text-[7px]">✨</span>
                  </div>
                </div>
              </div>
              <span className="font-['Fredoka'] text-[10px] font-bold text-[#641623] mt-1">
                Gold Trim
              </span>
            </div>

            {/* Card 3: Pastel Blossom Card */}
            <div
              onClick={onOpenNoteModal}
              className="group cursor-pointer flex flex-col items-center transition-transform hover:-translate-y-1 active:scale-95"
            >
              <div
                className="w-16 h-20 sm:w-18 sm:h-22 rounded-md bg-[#FDF2F8] border-2 border-[#EC4899] shadow-md relative p-1.5 flex flex-col justify-between select-none"
              >
                <div className="w-full h-full border border-pink-300 rounded-[3px] p-1 flex flex-col justify-between">
                  <span className="text-[8px] font-['Satisfy'] text-[#9D174D] leading-tight">
                    For you
                  </span>
                  <div className="w-3 h-3 rounded-full bg-pink-200 self-end flex items-center justify-center">
                    <span className="text-[7px]">🌸</span>
                  </div>
                </div>
              </div>
              <span className="font-['Fredoka'] text-[10px] font-bold text-[#641623] mt-1">
                Floral
              </span>
            </div>
          </div>

          {/* Note Status / Trigger */}
          <div className="mt-3 flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenNoteModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#811B2B] text-white hover:bg-[#641623] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Edit3 className="w-3 h-3" />
              <span>{hasNote ? 'Edit Handwritten Note' : 'Write Note on Card →'}</span>
            </button>

            <button
              type="button"
              onClick={onChangeRibbonClick}
              className="text-[10.5px] font-semibold text-[#811B2B]/75 hover:text-[#811B2B] underline cursor-pointer mt-1"
            >
              Change ribbon ({selectedRibbon.name})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
