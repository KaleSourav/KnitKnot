import React from 'react';
import {
  RibbonOption,
  RIBBON_OPTIONS,
  CARD_STYLES,
} from '../../data/bouquetFlowers';
import { Sparkles, Check, Edit3, Heart } from 'lucide-react';

interface FinishingTouchBarProps {
  selectedRibbon: RibbonOption;
  onSelectRibbon: (ribbon: RibbonOption) => void;
  hasNote: boolean;
  noteRecipient: string;
  onOpenNoteModal: () => void;
}

export const FinishingTouchBar: React.FC<FinishingTouchBarProps> = ({
  selectedRibbon,
  onSelectRibbon,
  hasNote,
  noteRecipient,
  onOpenNoteModal,
}) => {
  return (
    <div className="relative w-full max-w-[240px] sm:max-w-[270px] mx-auto flex flex-col gap-5 select-none text-left">
      {/* ── 1. The Finishing Touch: Ribbons & Bows Station ── */}
      <div className="bg-white/90 backdrop-blur-xs border-2 border-[#641623]/15 rounded-3xl p-4 shadow-xs">
        {/* Banner Label Header */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-4 h-4 text-[#811B2B]" />
          <h3 className="font-['Fredoka'] font-black text-sm text-[#641623] uppercase tracking-wide">
            The finishing touch
          </h3>
        </div>
        <p className="font-['Fredoka'] text-[11px] text-[#641623]/75 leading-tight mb-3">
          Choose a bow to tie around your bouquet:
        </p>

        {/* Ribbons Row */}
        <div className="grid grid-cols-5 gap-1.5">
          {RIBBON_OPTIONS.map((ribbon) => {
            const isSelected = ribbon.id === selectedRibbon.id;

            return (
              <button
                key={ribbon.id}
                type="button"
                onClick={() => onSelectRibbon(ribbon)}
                className={`relative flex flex-col items-center p-1 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF5CC] ring-2 ring-[#811B2B] scale-105 shadow-xs'
                    : 'hover:bg-[#FFF5CC]/50'
                }`}
                title={ribbon.name}
              >
                {/* SVG Mini Bow Preview */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
                  <svg viewBox="0 0 40 30" fill="none" className="w-full h-full">
                    {/* Left Loop */}
                    <path
                      d="M 20 15 C 12 5, 2 8, 6 18 C 10 24, 18 18, 20 15 Z"
                      fill={ribbon.colorHex}
                      stroke="#641623"
                      strokeWidth="1.2"
                    />
                    {/* Right Loop */}
                    <path
                      d="M 20 15 C 28 5, 38 8, 34 18 C 30 24, 22 18, 20 15 Z"
                      fill={ribbon.colorHex}
                      stroke="#641623"
                      strokeWidth="1.2"
                    />
                    {/* Knot */}
                    <circle
                      cx="20"
                      cy="15"
                      r="3.5"
                      fill={ribbon.colorHex}
                      stroke="#641623"
                      strokeWidth="1.2"
                    />
                    {/* Tails */}
                    <path
                      d="M 19 18 Q 15 25 12 28"
                      stroke={ribbon.colorHex}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 21 18 Q 25 25 28 28"
                      stroke={ribbon.colorHex}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#811B2B] mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-2 text-center">
          <span className="text-[11px] font-bold text-[#811B2B]">
            {selectedRibbon.name}
          </span>
        </div>
      </div>

      {/* ── 2. Make it Personal: Greeting Card Station ── */}
      <div
        onClick={onOpenNoteModal}
        className="bg-gradient-to-br from-[#FFF9DA] via-[#FEFBE2] to-[#FFF5CC] border-2 border-[#641623]/20 rounded-3xl p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-['Fredoka'] font-black text-xs sm:text-sm text-[#641623] uppercase tracking-wide flex items-center gap-1.5">
            <span>Make it personal</span>
            <Heart className="w-3.5 h-3.5 text-[#811B2B] fill-[#811B2B]" />
          </span>

          <span className="w-6 h-6 rounded-full bg-white/80 border border-[#811B2B]/25 flex items-center justify-center text-[#811B2B] group-hover:scale-110 transition-transform">
            <Edit3 className="w-3 h-3" />
          </span>
        </div>

        <p className="font-['Fredoka'] text-[11.5px] text-[#641623]/80 leading-relaxed font-medium mb-3">
          Tuck a handwritten greeting card right into the bouquet.
        </p>

        {/* Mini Card Preview Illustration */}
        <div className="bg-white/95 rounded-xl border-2 border-dashed border-[#811B2B]/30 p-2.5 shadow-2xs group-hover:border-[#811B2B] transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#811B2B]">
              Handwritten Card
            </span>
            {hasNote && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-green-700 bg-green-100 px-1.5 py-0.2 rounded-full">
                <Check className="w-2.5 h-2.5" />
                Tucked In
              </span>
            )}
          </div>

          <div className="font-script text-xs text-[#641623] truncate leading-tight">
            {hasNote
              ? noteRecipient
                ? `To ${noteRecipient} ♡`
                : 'Message added ♡'
              : '“Write your sweet note here...”'}
          </div>

          <div className="mt-2 text-right">
            <span className="text-[10px] font-bold text-[#811B2B] group-hover:underline">
              {hasNote ? 'Edit note →' : 'Add a note →'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
