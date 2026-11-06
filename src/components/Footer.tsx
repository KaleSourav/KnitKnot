import React, { useState } from 'react';

// Exact full-screen scalloped cloud path extracted directly from reference (viewBox: 0 0 1440 140)
const EXACT_FULLSCREEN_CLOUD_PATH =
  'M 0,36 ' +
  'Q 30,10 60,36 Q 90,10 120,36 Q 150,10 180,36 Q 210,10 240,36 Q 270,10 300,36 Q 330,10 360,36 ' +
  'Q 390,10 420,36 Q 450,10 480,36 Q 510,10 540,36 Q 570,10 600,36 Q 630,10 660,36 Q 690,10 720,36 ' +
  'Q 750,10 780,36 Q 810,10 840,36 Q 870,10 900,36 Q 930,10 960,36 Q 990,10 1020,36 Q 1050,10 1080,36 ' +
  'Q 1110,10 1140,36 Q 1170,10 1200,36 Q 1230,10 1260,36 Q 1290,10 1320,36 Q 1350,10 1380,36 Q 1410,10 1440,36 ' +
  'L 1440,104 ' +
  'Q 1410,130 1380,104 Q 1350,130 1320,104 Q 1290,130 1260,104 Q 1230,130 1200,104 Q 1170,130 1140,104 Q 1110,130 1080,104 ' +
  'Q 1050,130 1020,104 Q 990,130 960,104 Q 930,130 900,104 Q 870,130 840,104 Q 810,130 780,104 Q 750,130 720,104 ' +
  'Q 690,130 660,104 Q 630,130 600,104 Q 570,130 540,104 Q 510,130 480,104 Q 450,130 420,104 Q 390,130 360,104 ' +
  'Q 330,130 300,104 Q 270,130 240,104 Q 210,130 180,104 Q 150,130 120,104 Q 90,130 60,104 Q 30,130 0,104 ' +
  'Z';

// Continuous upward scallop wave for the top border of the maroon footer (viewBox: 0 0 1440 60)
const FOOTER_SCALLOP_WAVE =
  'M 0,60 L 0,32 ' +
  'Q 45,4 90,32 Q 135,4 180,32 Q 225,4 270,32 Q 315,4 360,32 ' +
  'Q 405,4 450,32 Q 495,4 540,32 Q 585,4 630,32 Q 675,4 720,32 ' +
  'Q 765,4 810,32 Q 855,4 900,32 Q 945,4 990,32 Q 1035,4 1080,32 ' +
  'Q 1125,4 1170,32 Q 1215,4 1260,32 Q 1305,4 1350,32 Q 1395,4 1440,32 ' +
  'L 1440,60 Z';

interface FooterProps {
  onNavigate?: (page: 'home' | 'shop' | 'product', category?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative w-full bg-[#FAF4ED] text-white font-['Fredoka'] overflow-hidden pt-4">
      {/* =========================================================================
          1. NEWSLETTER BANNER: "stay in the loop" (Full-Screen Scalloped Cloud Band)
         ========================================================================= */}
      <div className="relative w-full z-20">
        <div className="relative w-full min-h-[160px] sm:min-h-[145px] md:min-h-[155px] flex items-center justify-center">
          {/* Full Screen Exact Cloud SVG Background */}
          <svg
            viewBox="0 0 1440 140"
            fill="none"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <path d={EXACT_FULLSCREEN_CLOUD_PATH} fill="#DBEFF8" />
          </svg>

          {/* Centered responsive content container matching reference */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-8">
            {/* Left Content: Envelope Icon + Heading + Subtitle */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 text-center sm:text-left w-full lg:w-auto">
              {/* Rounded Envelope Icon */}
              <div className="w-11 h-9 sm:w-14 sm:h-12 rounded-xl border-2 border-[#641623] bg-transparent flex items-center justify-center flex-shrink-0 text-[#641623]">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="4" />
                  <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>

              <div>
                <h3 className="text-xl sm:text-3xl font-bold text-[#641623] tracking-tight leading-tight lowercase">
                  stay in the loop
                </h3>
                <p className="text-xs sm:text-base text-[#641623]/80 font-normal mt-0.5 lowercase leading-snug max-w-md">
                  new drops, special offers and little stories from our studio.
                </p>
              </div>
            </div>

            {/* Right Form: Pill Input + Sign up Button + Cute Sunburst Rays */}
            <div className="relative w-full lg:w-auto flex justify-center flex-shrink-0">
              {/* Cute 3 red accent rays above the button matching Image */}
              <div className="absolute -top-3.5 right-10 sm:right-12 pointer-events-none hidden sm:flex gap-1.5 items-end">
                <span className="w-0.5 h-3 bg-[#641623] rotate-[-25deg] rounded-full" />
                <span className="w-0.5 h-4 bg-[#641623] -translate-y-0.5 rounded-full" />
                <span className="w-0.5 h-3 bg-[#641623] rotate-[25deg] rounded-full" />
              </div>

              <form
                onSubmit={handleSubmit}
                className="relative flex items-center bg-white rounded-full p-1 sm:p-2 border border-[#641623]/15 shadow-sm max-w-md w-full"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your email address"
                  required
                  className="flex-1 min-w-0 bg-transparent px-3 sm:px-5 py-2 text-xs sm:text-base text-[#641623] placeholder-[#641623]/50 focus:outline-none lowercase font-medium"
                />

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#641623] hover:bg-[#7e1c2d] active:scale-95 text-white text-xs sm:text-base font-semibold px-4 sm:px-7 py-2 sm:py-3 rounded-full transition-all duration-200 shadow-sm flex-shrink-0 cursor-pointer"
                >
                  <span>{isSubscribed ? 'joined!' : 'sign up'}</span>
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. SCALLOPED WAVE DIVIDER (Top Edge of Maroon Footer)
         ========================================================================= */}
      <div className="relative w-full -mt-2 sm:-mt-3 z-10 leading-none">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14 md:h-16 block"
        >
          <path d={FOOTER_SCALLOP_WAVE} fill="#641623" />
        </svg>
      </div>

      {/* =========================================================================
          3. MAIN MAROON FOOTER BODY (#641623)
         ========================================================================= */}
      <div className="w-full bg-[#641623] pt-6 sm:pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main 5-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pb-10 sm:pb-12">
            {/* Column 1: Brand Info (Spans 4 columns on desktop with vertical divider) */}
            <div className="lg:col-span-4 flex flex-col items-start text-left lg:border-r lg:border-white/20 lg:pr-10">
              {/* Wordmark Logo in White (Exact same custom font as 2nd photo logo) */}
              <a
                href="#/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('home');
                }}
                className="inline-block transition-opacity duration-200 hover:opacity-90 cursor-pointer"
              >
                <img
                  src="/logo-knotsnco-white.png"
                  alt="knotsnco."
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </a>

              {/* Sub-tagline */}
              <span className="text-white/80 text-xs sm:text-sm font-medium tracking-wide lowercase mt-1.5">
                everything crochet
              </span>

              {/* Description */}
              <p className="text-white/85 text-sm sm:text-base font-normal leading-relaxed lowercase mt-4 max-w-sm">
                handmade crochet gifts, accessories and little joys for a brighter, kinder everyday.
              </p>

              {/* Social Media Outline Icons (Instagram, Pinterest, YouTube, WhatsApp) */}
              <div className="flex items-center gap-3 mt-6">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/knotsnco._/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#641623] hover:border-white transition-all duration-200 hover:scale-105"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                {/* Pinterest */}
                <a
                  href="#"
                  aria-label="Pinterest"
                  className="w-9 h-9 rounded-lg border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#641623] hover:border-white transition-all duration-200 hover:scale-105"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="9" x2="12" y2="21" />
                    <path d="M12 9a4 4 0 1 1 4-4c0 2.21-1.79 4-4 4z" />
                    <path d="M8 12c.5 2 2 4 4 4" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="#"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-lg border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#641623] hover:border-white transition-all duration-200 hover:scale-105"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="4" />
                    <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-lg border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#641623] hover:border-white transition-all duration-200 hover:scale-105"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Link Columns (Spans 8 columns on large screens) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-left">
              {/* Column 2: shop */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white lowercase tracking-tight mb-3 sm:mb-4">
                  shop
                </h4>
                <ul className="space-y-2 text-sm sm:text-base text-white/80 lowercase">
                  <li>
                    <button
                      onClick={() => onNavigate?.('shop', 'all')}
                      className="hover:text-white transition-colors duration-150 cursor-pointer"
                    >
                      all products
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate?.('shop', 'Flowers')}
                      className="hover:text-white transition-colors duration-150 cursor-pointer"
                    >
                      flowers
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate?.('shop', 'Flower Pots')}
                      className="hover:text-white transition-colors duration-150 cursor-pointer"
                    >
                      flower pots
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate?.('shop', 'Plushies')}
                      className="hover:text-white transition-colors duration-150 cursor-pointer"
                    >
                      plushies
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate?.('shop', 'Bags')}
                      className="hover:text-white transition-colors duration-150 cursor-pointer"
                    >
                      bags
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate?.('shop', 'Keychains')}
                      className="hover:text-white transition-colors duration-150 cursor-pointer"
                    >
                      keychains & charms
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate?.('shop', 'Home Decor')}
                      className="hover:text-white transition-colors duration-150 cursor-pointer"
                    >
                      home decor
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 3: about */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white lowercase tracking-tight mb-3 sm:mb-4">
                  about
                </h4>
                <ul className="space-y-2 text-sm sm:text-base text-white/80 lowercase">
                  <li>
                    <a href="#story" className="hover:text-white transition-colors duration-150">
                      our story
                    </a>
                  </li>
                  <li>
                    <a href="#custom" className="hover:text-white transition-colors duration-150">
                      custom orders
                    </a>
                  </li>
                  <li>
                    <a href="#journal" className="hover:text-white transition-colors duration-150">
                      journal
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 4: help */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white lowercase tracking-tight mb-3 sm:mb-4">
                  help
                </h4>
                <ul className="space-y-2 text-sm sm:text-base text-white/80 lowercase">
                  <li>
                    <a href="#shipping" className="hover:text-white transition-colors duration-150">
                      shipping policy
                    </a>
                  </li>
                  <li>
                    <a href="#returns" className="hover:text-white transition-colors duration-150">
                      returns & refunds
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-white transition-colors duration-150">
                      faq
                    </a>
                  </li>
                  <li>
                    <a href="#track" className="hover:text-white transition-colors duration-150">
                      track order
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 5: contact */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-white lowercase tracking-tight mb-3 sm:mb-4">
                  contact
                </h4>
                <ul className="space-y-2 text-sm sm:text-base text-white/80 lowercase">
                  <li>
                    <a
                      href="mailto:hello@knotsnco.com"
                      className="hover:text-white transition-colors duration-150 underline underline-offset-4 decoration-white/40"
                    >
                      hello@knotsnco.com
                    </a>
                  </li>
                  <li className="text-white/70">
                    surat, india
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* =====================================================================
              4. BOTTOM COPYRIGHT & LEGAL BAR
             ===================================================================== */}
          <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white/70 lowercase">
            <p>
              © 2024 knotsnco. all rights reserved.
            </p>

            <div className="flex items-center gap-3 text-white/75">
              <a href="#privacy" className="hover:text-white transition-colors duration-150">
                privacy policy
              </a>
              <span className="text-white/30">|</span>
              <a href="#terms" className="hover:text-white transition-colors duration-150">
                terms of service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
