import React from 'react';
import { ArrowRight, ShoppingBag, Sparkles, Check } from 'lucide-react';

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
    <div className="relative w-full max-w-[240px] sm:max-w-[260px] mx-auto select-none">
      {/* ── Receipt Paper Roll on Top ── */}
      <div className="w-20 mx-auto -mb-2 z-10 relative flex flex-col items-center">
        {/* Paper Roll Cylinder */}
        <div className="w-16 h-4 bg-[#EADCC8] border border-[#C5B39A] rounded-full shadow-inner" />
        {/* Paper Slip Extending Down */}
        <div className="w-14 bg-white border-x border-[#641623]/20 pt-1 pb-1 px-1 text-center shadow-xs -mt-1">
          <span className="font-['Fredoka'] font-black text-[7.5px] uppercase tracking-tighter text-[#811B2B] block leading-tight">
            Knots &amp; Co
          </span>
          <span className="text-[6.5px] font-bold text-[#641623]/60 block leading-tight">
            Boutique #101
          </span>
          <div className="w-full border-b border-dashed border-[#641623]/20 my-0.5" />
        </div>
      </div>

      {/* ── Main Mechanical Cash Register Body ── */}
      <div className="bg-[#FAF3EA] border-[2.5px] border-[#641623] rounded-3xl p-4 shadow-[0_12px_28px_rgba(100,22,35,0.14)] relative overflow-hidden text-center">
        {/* Brass Header Badge */}
        <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#FFF5CC] border border-[#641623]/20 text-[9.5px] font-black uppercase tracking-wider text-[#641623] mb-2 shadow-2xs">
          Your Bouquet Total
        </div>

        {/* ── Digital LED/LCD Price Readout Display ── */}
        <div className="w-full bg-[#1E1815] border-2 border-[#641623] rounded-xl p-2.5 shadow-inner mb-3 text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5A93C] block mb-0.5 opacity-80">
            INR TOTAL
          </span>
          <div className="font-mono font-black text-2xl sm:text-3xl text-[#FFF5CC] tracking-tight flex items-center justify-center gap-0.5">
            <span className="text-sm sm:text-base text-[#E5A93C]">₹</span>
            <span className="transition-all duration-300">
              {totalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#E5A93C]">.00</span>
          </div>
        </div>

        {/* ── Retro Keypad Rows (Pure Decorative Delight) ── */}
        <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-[#EFE3D3] rounded-xl border border-[#641623]/15 mb-3 shadow-inner">
          <div className="h-4 rounded-md bg-[#F97316] shadow-xs flex items-center justify-center text-[8px] font-bold text-white">
            1
          </div>
          <div className="h-4 rounded-md bg-[#F97316] shadow-xs flex items-center justify-center text-[8px] font-bold text-white">
            2
          </div>
          <div className="h-4 rounded-md bg-[#F97316] shadow-xs flex items-center justify-center text-[8px] font-bold text-white">
            3
          </div>
          <div className="h-4 rounded-md bg-[#EAB308] shadow-xs flex items-center justify-center text-[8px] font-bold text-white">
            +
          </div>
          <div className="h-4 rounded-md bg-[#F97316] shadow-xs flex items-center justify-center text-[8px] font-bold text-white">
            4
          </div>
          <div className="h-4 rounded-md bg-[#F97316] shadow-xs flex items-center justify-center text-[8px] font-bold text-white">
            5
          </div>
          <div className="h-4 rounded-md bg-[#F97316] shadow-xs flex items-center justify-center text-[8px] font-bold text-white">
            6
          </div>
          <div className="h-4 rounded-md bg-[#EAB308] shadow-xs flex items-center justify-center text-[8px] font-bold text-white">
            ♡
          </div>
        </div>

        {/* Status text */}
        <div className="text-[11px] font-bold text-[#641623]/75 mb-2.5">
          {stemCount === 0 ? (
            <span className="italic">Pick stems to start</span>
          ) : (
            <span>
              {stemCount} {stemCount === 1 ? 'stem' : 'stems'} in wrap
            </span>
          )}
        </div>

        {/* ── Cash Register Drawer Action Button ── */}
        <button
          type="button"
          disabled={!isReady}
          onClick={onCheckoutClick}
          className={`w-full py-3 px-3 rounded-xl font-['Fredoka'] font-black text-xs sm:text-[13px] uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
            isReady
              ? 'bg-[#811B2B] text-white hover:bg-[#641623] cursor-pointer shadow-[0_6px_16px_rgba(129,27,43,0.35)] hover:-translate-y-0.5'
              : 'bg-[#C8B8A6] text-white/70 cursor-not-allowed shadow-none'
          }`}
        >
          <span>SEND FLOWERS</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Subtle Register Footing */}
        <div className="flex justify-between px-3 mt-1.5 opacity-40">
          <div className="w-3 h-1.5 bg-[#641623] rounded-t-sm" />
          <div className="w-3 h-1.5 bg-[#641623] rounded-t-sm" />
        </div>
      </div>
    </div>
  );
};
