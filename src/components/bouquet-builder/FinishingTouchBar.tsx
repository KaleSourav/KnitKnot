import React from 'react';
import {
  RibbonOption,
  RIBBON_OPTIONS,
} from '../../data/bouquetFlowers';
import { Edit3, Heart, Check } from 'lucide-react';

interface FinishingTouchBarProps {
  selectedRibbon: RibbonOption;
  onSelectRibbon: (ribbon: RibbonOption) => void;
  hasNote: boolean;
  noteRecipient: string;
  onOpenNoteModal: () => void;
}

// Detailed bow SVG for each ribbon option
const BowSVG: React.FC<{ colorHex: string; size?: number }> = ({ colorHex, size = 56 }) => (
  <svg
    viewBox="0 0 70 56"
    fill="none"
    style={{ width: size, height: size * 0.8 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Left loop */}
    <path
      d="M 35 28 C 20 10 2 14 8 30 C 14 44 30 36 35 28 Z"
      fill={colorHex}
      stroke="rgba(0,0,0,0.25)"
      strokeWidth="1"
    />
    {/* Left loop inner sheen */}
    <path
      d="M 35 28 C 24 16 10 18 13 28"
      fill="none"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.4"
    />
    {/* Right loop */}
    <path
      d="M 35 28 C 50 10 68 14 62 30 C 56 44 40 36 35 28 Z"
      fill={colorHex}
      stroke="rgba(0,0,0,0.25)"
      strokeWidth="1"
    />
    {/* Right loop inner sheen */}
    <path
      d="M 35 28 C 46 16 60 18 57 28"
      fill="none"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.4"
    />
    {/* Center knot */}
    <ellipse cx="35" cy="28" rx="6" ry="5" fill={colorHex} stroke="rgba(0,0,0,0.3)" strokeWidth="1.2" />
    <ellipse cx="33" cy="26" rx="2.5" ry="2" fill="white" opacity="0.3" />
    {/* Left tail */}
    <path
      d="M 32 32 Q 25 46 20 54"
      stroke={colorHex}
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M 32 32 Q 25 46 20 54"
      stroke="rgba(0,0,0,0.12)"
      strokeWidth="5"
      strokeLinecap="round"
    />
    {/* Right tail */}
    <path
      d="M 38 32 Q 45 46 50 54"
      stroke={colorHex}
      strokeWidth="5"
      strokeLinecap="round"
    />
  </svg>
);

export const FinishingTouchBar: React.FC<FinishingTouchBarProps> = ({
  selectedRibbon,
  onSelectRibbon,
  hasNote,
  noteRecipient,
  onOpenNoteModal,
}) => {
  return (
    <div className="relative w-full max-w-[260px] mx-auto flex flex-col gap-5 select-none text-left">

      {/* ── 1. "The finishing touch." – Ribbon station ── */}
      <div>
        {/* Handwritten-style section label */}
        <div className="mb-3">
          <span
            className="font-['Satisfy'] text-xl text-[#811B2B]"
            style={{ textShadow: '0 1px 2px rgba(129,27,43,0.1)' }}
          >
            The finishing touch.
          </span>
          <p className="font-['Fredoka'] text-xs text-[#641623]/70 mt-0.5">
            Choose a ribbon bow to tie around your bouquet:
          </p>
        </div>

        {/* Bows displayed like physical items on the counter */}
        <div className="flex items-end gap-2 flex-wrap">
          {RIBBON_OPTIONS.map((ribbon) => {
            const isSelected = ribbon.id === selectedRibbon.id;
            return (
              <button
                key={ribbon.id}
                type="button"
                onClick={() => onSelectRibbon(ribbon)}
                className={`relative flex flex-col items-center transition-all duration-200 cursor-pointer rounded-2xl pt-2 pb-1.5 px-2 ${
                  isSelected
                    ? 'bg-[#FFF5CC] ring-2 ring-[#811B2B] shadow-md scale-105'
                    : 'bg-white/50 hover:bg-white/80 hover:shadow-sm hover:scale-102'
                }`}
                title={ribbon.name}
              >
                <BowSVG colorHex={ribbon.colorHex} size={52} />
                {isSelected && (
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#811B2B]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-2">
          <span className="font-['Fredoka'] font-bold text-xs text-[#811B2B]">
            {selectedRibbon.name}
          </span>
        </div>
      </div>

      {/* ── 2. "Make it personal." – Gift note station ── */}
      <div>
        <div className="mb-2">
          <span
            className="font-['Satisfy'] text-xl text-[#811B2B]"
          >
            Make it personal.
          </span>
        </div>

        <div
          onClick={onOpenNoteModal}
          className="relative cursor-pointer group transition-all duration-200 hover:-translate-y-0.5"
        >
          {/* Physical greeting card appearance */}
          <div
            className="rounded-2xl p-3 shadow-sm border-2 transition-all duration-200 group-hover:shadow-md"
            style={{
              background: 'linear-gradient(135deg, #FFF9EE 0%, #FFF5CC 100%)',
              borderColor: '#E6D7A3',
            }}
          >
            {/* Scalloped top edge */}
            <div className="absolute -top-[5px] left-3 right-3 flex justify-around pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: '#FFF9EE', border: '1.5px solid #E6D7A3', marginTop: '-1px' }}
                />
              ))}
            </div>

            <div className="flex items-start justify-between mb-2">
              <span className="font-['Fredoka'] font-black text-xs text-[#641623] uppercase tracking-wide">
                Handwritten Note
              </span>
              <span className="w-6 h-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: 'rgba(129,27,43,0.08)' }}>
                <Edit3 className="w-3 h-3 text-[#811B2B]" />
              </span>
            </div>

            <div className="font-['Satisfy'] text-xs text-[#641623] leading-relaxed min-h-[32px]">
              {hasNote
                ? noteRecipient
                  ? `To ${noteRecipient} ♡`
                  : '"Your message is ready ♡"'
                : '"Write your sweet message here..."'}
            </div>

            {hasNote && (
              <div className="mt-2 flex items-center gap-1">
                <Check className="w-3 h-3 text-green-600" />
                <span className="text-[10px] font-bold text-green-700">Note tucked in!</span>
              </div>
            )}

            <div className="mt-2 text-right">
              <span className="text-[11px] font-bold text-[#811B2B] group-hover:underline">
                {hasNote ? 'Edit note →' : 'Add a note →'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
