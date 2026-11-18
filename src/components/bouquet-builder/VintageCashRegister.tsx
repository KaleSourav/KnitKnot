import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface VintageCashRegisterProps {
  totalPrice: number;
  stemCount: number;
  onCheckoutClick: () => void;
}

export const VintageCashRegister: React.FC<VintageCashRegisterProps> = ({
  totalPrice,
  stemCount,
  onCheckoutClick,
}) => {
  const isReady = stemCount > 0;

  return (
    <div className="relative select-none flex flex-col items-center" style={{ width: '270px' }}>
      {/* ── 3D Photorealistic Cash Register ── */}
      <div className="relative w-full drop-shadow-[0_18px_32px_rgba(0,0,0,0.32)] transition-transform duration-200 hover:scale-[1.02]">
        <img
          src="/boutique/vintage-cash-register.png"
          alt="Vintage Cash Register"
          className="w-full h-auto object-contain pointer-events-none select-none"
        />

        {/* ── Live Digital LED Screen Overlay (Pixel-perfect aligned with physical register screen) ── */}
        <div
          className="absolute font-mono font-black text-center flex items-center justify-center pointer-events-none select-none overflow-hidden"
          style={{
            top: '29.2%',
            left: '40.5%',
            width: '29.0%',
            height: '11.5%',
            background: '#0D130E',
            borderRadius: '2px',
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.95)',
            border: '1px solid #1E3A24',
          }}
        >
          {/* Scanline CRT overlay */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,255,0,0.35) 2px, rgba(0,255,0,0.35) 3px)',
            }}
          />
          <span
            className="relative text-xs sm:text-[13px] font-black tracking-tight text-[#4ADE80] tabular-nums"
            style={{
              textShadow: '0 0 8px rgba(74, 222, 128, 0.85), 0 0 2px #4ADE80',
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            ₹{totalPrice.toLocaleString('en-IN')}.00
          </span>
        </div>

        {/* Interactive Click Hotspot over Register's Physical Yellow "SEND FLOWERS" Key */}
        {isReady && (
          <button
            type="button"
            onClick={onCheckoutClick}
            title="Click yellow key to send flowers"
            className="absolute cursor-pointer rounded-full transition-transform active:scale-90"
            style={{
              top: '61.5%',
              left: '53.0%',
              width: '10.5%',
              height: '7.0%',
            }}
          />
        )}
      </div>

      {/* ── Subtitle Status ── */}
      <div className="mt-2 text-center text-xs font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] font-['Fredoka']">
        {stemCount === 0 ? (
          <span className="italic text-white/95">Pick blooms from shelf to start ♡</span>
        ) : (
          <span className="bg-[#811B2B] text-[#FFF5CC] px-3.5 py-1 rounded-full shadow-sm border border-[#FFF5CC]/30">
            {stemCount} {stemCount === 1 ? 'stem' : 'stems'} ready to wrap
          </span>
        )}
      </div>

      {/* ── Big Yellow 3D SEND FLOWERS Button (Matching Petal Post Reference) ── */}
      <button
        type="button"
        disabled={!isReady}
        onClick={onCheckoutClick}
        className={`w-full mt-3 py-3 rounded-2xl font-['Fredoka'] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 border-2 ${
          isReady
            ? 'bg-[#FBBF24] hover:bg-[#F59E0B] text-black border-[#D97706] shadow-[0_6px_0_#B45309,0_12px_20px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 cursor-pointer'
            : 'bg-white/40 text-gray-700 border-white/60 cursor-not-allowed opacity-60'
        }`}
      >
        <span>SEND FLOWERS</span>
        <ArrowRight className="w-4 h-4 text-black" />
      </button>
    </div>
  );
};
