import React from 'react';
import { ArrowRight } from 'lucide-react';

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
    <div className="relative select-none" style={{ width: '220px' }}>
      {/* ── Receipt Paper Roll on Top ── */}
      <div className="flex flex-col items-center -mb-1 relative z-10">
        {/* Paper roll tube */}
        <div
          className="w-16 h-5 rounded-full border border-[#C5B39A] shadow-inner"
          style={{ background: 'linear-gradient(to bottom, #F5EDE0, #E8D9C6)' }}
        />
        {/* Paper strip hanging down */}
        <div
          className="w-12 border-x border-[#E0D4C0] pb-1 pt-0.5 px-1 shadow-xs -mt-1"
          style={{ background: '#FAFAF5' }}
        >
          <span className="block text-center font-['Fredoka'] font-black text-[7px] uppercase tracking-tighter text-[#811B2B] leading-tight">
            Knots &amp; Co.
          </span>
          <span className="block text-center text-[6px] font-bold text-[#641623]/50 leading-tight">
            Boutique #101
          </span>
          <div className="border-b border-dashed border-[#811B2B]/15 my-0.5" />
        </div>
      </div>

      {/* ── Main Register Body ── */}
      <div
        className="rounded-3xl pt-3 px-3 pb-3 relative overflow-hidden border-[2px] shadow-[0_12px_30px_rgba(100,22,35,0.16)]"
        style={{
          background: 'linear-gradient(160deg, #F9F3EA 0%, #EDE0CC 100%)',
          borderColor: '#C8A882',
        }}
      >
        {/* Body top highlight band */}
        <div
          className="absolute top-0 left-3 right-3 h-[3px] rounded-b-full opacity-50"
          style={{ background: 'white' }}
        />

        {/* ── TOTAL LABEL ── */}
        <div
          className="text-center px-2 py-0.5 rounded-lg mb-2 mx-auto inline-block w-full"
          style={{ background: 'rgba(129,27,43,0.08)', border: '1px solid rgba(129,27,43,0.12)' }}
        >
          <span className="font-['Fredoka'] font-black text-[9px] uppercase tracking-widest text-[#811B2B]">
            Your Bouquet Total
          </span>
        </div>

        {/* ── LED Display Screen ── */}
        <div
          className="rounded-xl px-3 py-2 mb-3 text-center shadow-inner relative overflow-hidden"
          style={{ background: '#1A1612', border: '2px solid #8B6B42' }}
        >
          {/* Screen scanline texture */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)',
            }}
          />
          <div className="font-mono text-[9px] uppercase tracking-widest text-[#E5A93C] opacity-80 mb-0.5 relative">
            INR TOTAL
          </div>
          <div className="font-mono font-black flex items-center justify-center gap-0.5 relative">
            <span className="text-sm text-[#E5A93C]">₹</span>
            <span
              className="text-2xl text-[#FFF5CC] tabular-nums transition-all duration-500"
              style={{ letterSpacing: '-0.02em' }}
            >
              {totalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#E5A93C] self-end mb-0.5">.00</span>
          </div>
        </div>

        {/* ── Keypad Buttons ── */}
        <div
          className="rounded-xl p-2 mb-3 grid grid-cols-4 gap-1.5"
          style={{ background: '#DDD0BC' }}
        >
          {['1','2','3','+','4','5','6','♡'].map((key, i) => (
            <div
              key={i}
              className="h-5 rounded-md flex items-center justify-center text-[9px] font-black text-white shadow-sm"
              style={{
                background: ['1','2','3','4','5','6'].includes(key) ? '#E8721A' : '#D4A820',
                boxShadow: '0 2px 0 rgba(0,0,0,0.25)',
              }}
            >
              {key}
            </div>
          ))}
        </div>

        {/* Status line */}
        <div className="text-center text-[10px] font-bold text-[#641623]/70 mb-2.5 font-['Fredoka']">
          {stemCount === 0 ? (
            <span className="italic">Pick some blooms to start ♡</span>
          ) : (
            <span>{stemCount} {stemCount === 1 ? 'stem' : 'stems'} ready to send</span>
          )}
        </div>

        {/* ── SEND FLOWERS Button ── */}
        <button
          type="button"
          disabled={!isReady}
          onClick={onCheckoutClick}
          className={`w-full py-3 rounded-xl font-['Fredoka'] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${
            isReady
              ? 'text-white cursor-pointer hover:-translate-y-0.5'
              : 'cursor-not-allowed opacity-50'
          }`}
          style={{
            background: isReady
              ? 'linear-gradient(135deg, #811B2B 0%, #641623 100%)'
              : '#B0A090',
            boxShadow: isReady ? '0 6px 18px rgba(129,27,43,0.38), 0 2px 0 #4A0F18' : 'none',
          }}
        >
          <span>Send Flowers</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Register feet */}
        <div className="flex justify-between px-4 mt-2">
          <div
            className="w-4 h-2 rounded-b-md"
            style={{ background: '#B0906A' }}
          />
          <div
            className="w-4 h-2 rounded-b-md"
            style={{ background: '#B0906A' }}
          />
        </div>
      </div>
    </div>
  );
};
