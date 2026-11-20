import React from 'react';
import { Sparkles, ArrowRight, Heart, Gift } from 'lucide-react';

interface MakeYourOwnBouquetBannerProps {
  onStartBuilding: () => void;
}

export const MakeYourOwnBouquetBanner: React.FC<MakeYourOwnBouquetBannerProps> = ({
  onStartBuilding,
}) => {
  return (
    <section className="w-full bg-[#FBF8CF] py-8 sm:py-12 font-['Fredoka'] select-none relative overflow-hidden">
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Curvy Dashed Stitch Divider */}
        <div className="w-full flex justify-center mb-6 sm:mb-8" aria-hidden="true">
          <svg
            viewBox="0 0 1200 40"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="w-full max-w-[960px] h-7 sm:h-9 overflow-visible"
          >
            <path
              d="M 20 20 C 140 32, 260 8, 380 20 C 500 32, 620 8, 740 20 C 860 32, 980 8, 1180 20"
              stroke="#641623"
              strokeWidth="2.5"
              strokeDasharray="18 12"
              strokeLinecap="round"
              className="opacity-70"
            />
          </svg>
        </div>

        {/* ── Main Banner Card ── */}
        <div className="relative w-full bg-gradient-to-br from-[#FFF9DA] via-[#FFF5CC] to-[#FCEEB2] rounded-[36px] sm:rounded-[44px] border-[2.5px] border-[#641623] p-6 sm:p-10 lg:p-12 shadow-[0_16px_40px_rgba(100,22,35,0.1)] overflow-hidden">
          {/* Decorative Pattern Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#811B2B 1.2px, transparent 1.2px)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Brand Logo & Flower Boutique Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#641623]/20 shadow-xs">
                  <img
                    src="/logo-knotsnco.png"
                    alt="knotsnco."
                    className="h-5 sm:h-6 w-auto object-contain select-none"
                  />
                  <span className="text-[#641623]/35 font-bold">|</span>
                  <span className="text-[#641623] font-['Fredoka'] font-semibold text-xs tracking-wide lowercase select-none">
                    everything crochet
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#811B2B] text-white shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFF5CC]" />
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FFF5CC]">
                    Interactive Flower Boutique
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <h2 className="font-['Fredoka'] font-black text-3xl sm:text-4xl md:text-5xl text-[#641623] tracking-tight leading-tight">
                MAKE YOUR OWN BOUQUET
              </h2>

              {/* Tagline */}
              <p className="font-script text-xl sm:text-2xl text-[#811B2B] mt-1.5">
                &ldquo;A little something, made by you.&rdquo; ♡
              </p>

              {/* Supporting Text */}
              <p className="font-['Fredoka'] text-sm sm:text-base text-[#641623]/80 mt-3 max-w-xl leading-relaxed font-medium">
                Pick your favourite blooms, choose your wrapping and add a little note. Let&apos;s make something special!
              </p>

              {/* 3 Steps Mini Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mt-5 pt-3 border-t border-[#641623]/15">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-xs font-bold text-[#641623] border border-[#641623]/10">
                  <span className="w-4 h-4 rounded-full bg-[#811B2B] text-white text-[10px] flex items-center justify-center font-black">
                    1
                  </span>
                  <span>Pick Your Blooms</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-xs font-bold text-[#641623] border border-[#641623]/10">
                  <span className="w-4 h-4 rounded-full bg-[#811B2B] text-white text-[10px] flex items-center justify-center font-black">
                    2
                  </span>
                  <span>Choose Wrap &amp; Bow</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-xs font-bold text-[#641623] border border-[#641623]/10">
                  <span className="w-4 h-4 rounded-full bg-[#811B2B] text-white text-[10px] flex items-center justify-center font-black">
                    3
                  </span>
                  <span>Tuck in a Note</span>
                </span>
              </div>

              {/* CTA Button */}
              <div className="mt-7 flex justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={onStartBuilding}
                  className="px-7 sm:px-9 py-4 rounded-full bg-[#811B2B] text-white font-['Fredoka'] font-black text-sm sm:text-base uppercase tracking-wider hover:bg-[#641623] hover:scale-102 transition-all duration-200 cursor-pointer shadow-[0_8px_24px_rgba(129,27,43,0.35)] flex items-center gap-2 group active:scale-95"
                >
                  <span>Start Building Your Bouquet</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column: Visual Boutique Teaser */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div
                onClick={onStartBuilding}
                className="relative bg-white/95 rounded-3xl border-2 border-[#641623]/20 p-5 sm:p-6 shadow-md hover:scale-103 transition-transform duration-300 cursor-pointer group max-w-sm w-full"
              >
                {/* Cute Corner Ribbon */}
                <div className="absolute -top-3 -right-3 z-20 bg-[#811B2B] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full border-2 border-white shadow-sm transform rotate-6">
                  Interactive Bar
                </div>

                {/* Boutique Header Tag with Brand Logo */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-1.5">
                    <img
                      src="/logo-knotsnco.png"
                      alt="knotsnco."
                      className="h-4 sm:h-5 w-auto object-contain select-none"
                    />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#811B2B]/80 font-['Fredoka']">
                      • Flower Boutique
                    </span>
                  </div>
                  <span className="text-[10px] text-[#641623]/70 font-semibold font-['Fredoka']">
                    100% Handmade ♡
                  </span>
                </div>

                {/* Sample Bouquet Visual Composition */}
                <div className="relative w-full h-44 sm:h-52 bg-gradient-to-b from-[#FFFDF9] to-[#FCE2EB]/40 rounded-2xl flex items-center justify-center overflow-hidden border border-[#641623]/10">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0688/9829/1775/files/Screenshot2026-11-06175510.png?v=1793969360"
                    alt="Rose Bouquet"
                    className="w-24 h-36 object-contain transform -rotate-12 translate-x-2 -translate-y-2 select-none group-hover:-rotate-6 transition-transform duration-300"
                  />
                  <img
                    src="https://cdn.shopify.com/s/files/1/0688/9829/1775/files/Screenshot2026-11-06172451.png?v=1793966122"
                    alt="Sunflower Bouquet"
                    className="w-28 h-40 object-contain z-10 transform scale-105 select-none group-hover:scale-110 transition-transform duration-300"
                  />
                  <img
                    src="https://cdn.shopify.com/s/files/1/0688/9829/1775/files/Screenshot2026-11-06193243.png?v=1793973873"
                    alt="Lavender Bouquet"
                    className="w-24 h-36 object-contain transform rotate-12 -translate-x-2 -translate-y-2 select-none group-hover:rotate-6 transition-transform duration-300"
                  />
                </div>

                <div className="mt-3 text-center">
                  <span className="font-['Fredoka'] font-bold text-xs text-[#641623] flex items-center justify-center gap-1 group-hover:text-[#811B2B]">
                    <span>Tap to enter our Bouquet Boutique</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
