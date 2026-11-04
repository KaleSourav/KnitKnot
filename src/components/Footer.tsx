import React, { useState } from 'react';

// Exact full-screen scalloped cloud path extracted directly from reference (viewBox: 0 0 1440 140)
const EXACT_FULLSCREEN_CLOUD_PATH =
  'M 0,52.2 L 12,46.2 L 24,37.9 L 36,25.8 L 48,20.0 L 60,17.6 L 72,16.0 L 84,18.1 L 96,21.4 L 108,25.2 ' +
  'L 120,24.3 L 132,22.8 L 144,22.9 L 156,22.5 L 168,17.2 L 180,13.0 L 192,13.0 L 204,16.5 L 216,20.0 ' +
  'L 228,21.0 L 240,21.0 L 252,21.0 L 264,22.4 L 276,17.5 L 288,13.0 L 300,12.0 L 312,14.6 L 324,20.5 ' +
  'L 336,24.2 L 348,25.0 L 360,20.5 L 372,15.1 L 384,14.0 L 396,16.8 L 408,21.0 L 420,23.8 L 432,25.0 ' +
  'L 444,24.0 L 456,23.5 L 468,24.8 L 480,22.1 L 492,19.0 L 504,18.0 L 516,21.5 L 528,25.0 L 540,25.0 ' +
  'L 552,22.2 L 564,19.2 L 576,19.6 L 588,22.8 L 600,25.0 L 612,23.8 L 624,22.2 L 636,22.8 L 648,20.5 ' +
  'L 660,17.5 L 672,16.0 L 684,20.0 L 696,23.8 L 708,24.8 L 720,23.8 L 732,23.0 L 744,23.0 L 756,19.8 ' +
  'L 768,16.8 L 780,17.8 L 792,21.5 L 804,24.8 L 816,25.0 L 828,24.5 L 840,20.0 L 852,14.8 L 864,13.0 ' +
  'L 876,17.0 L 888,22.0 L 900,24.0 L 912,23.0 L 924,20.0 L 936,19.5 L 948,22.5 L 960,23.2 L 972,32.8 ' +
  'L 984,43.2 L 996,44.0 L 1008,44.0 L 1020,44.0 L 1032,44.0 L 1044,44.0 L 1056,44.0 L 1068,44.0 L 1080,44.0 ' +
  'L 1092,44.0 L 1104,44.0 L 1116,44.0 L 1128,44.0 L 1140,44.0 L 1152,44.0 L 1164,44.0 L 1176,44.0 L 1188,44.0 ' +
  'L 1200,44.0 L 1212,44.0 L 1224,44.0 L 1236,44.0 L 1248,44.0 L 1260,44.0 L 1272,44.0 L 1284,44.0 L 1296,44.0 ' +
  'L 1308,44.0 L 1320,44.0 L 1332,44.0 L 1344,44.0 L 1356,44.0 L 1368,44.0 L 1380,44.0 L 1392,44.0 L 1404,44.0 ' +
  'L 1416,44.0 L 1428,44.0 L 1440,44.0 ' +
  // Bottom edge going in reverse
  'L 1440,89.5 L 1428,89.5 L 1416,89.5 L 1404,89.5 L 1392,89.5 L 1380,89.5 L 1368,89.5 L 1356,89.5 L 1344,89.5 ' +
  'L 1332,89.5 L 1320,89.5 L 1308,89.5 L 1296,89.5 L 1284,89.5 L 1272,89.5 L 1260,89.5 L 1248,89.5 L 1236,89.5 ' +
  'L 1224,89.5 L 1212,89.5 L 1200,89.5 L 1188,89.5 L 1176,89.5 L 1164,89.5 L 1152,89.5 L 1140,89.5 L 1128,89.5 ' +
  'L 1116,89.5 L 1104,89.5 L 1092,89.5 L 1080,89.5 L 1068,89.5 L 1056,89.5 L 1044,89.5 L 1032,89.5 L 1020,89.5 ' +
  'L 1008,89.5 L 996,89.5 L 984,89.5 L 972,89.5 L 960,89.5 L 948,95.0 L 936,104.0 L 924,115.0 L 912,120.0 ' +
  'L 900,121.0 L 888,122.5 L 876,123.0 L 864,123.0 L 852,121.5 L 840,121.0 L 828,122.0 L 816,122.8 L 804,122.0 ' +
  'L 792,121.0 L 780,121.5 L 768,122.5 L 756,123.0 L 744,122.5 L 732,122.0 L 720,122.2 L 708,122.8 L 696,122.5 ' +
  'L 684,121.8 L 672,121.0 L 660,121.2 L 648,121.8 L 636,122.0 L 624,121.5 L 612,121.0 L 600,121.2 L 588,121.8 ' +
  'L 576,122.0 L 564,121.8 L 552,121.2 L 540,121.0 L 528,121.5 L 516,122.0 L 504,122.2 L 492,122.0 L 480,121.5 ' +
  'L 468,121.0 L 456,121.2 L 444,121.8 L 432,122.0 L 420,121.8 L 408,121.2 L 396,121.0 L 384,121.5 L 372,122.0 ' +
  'L 360,122.2 L 348,122.0 L 336,121.5 L 324,121.0 L 312,121.2 L 300,121.8 L 288,122.0 L 276,121.8 L 264,121.2 ' +
  'L 252,121.0 L 240,121.5 L 228,122.0 L 216,122.2 L 204,122.0 L 192,121.5 L 180,121.0 L 168,121.2 L 156,121.8 ' +
  'L 144,122.0 L 132,121.8 L 120,121.2 L 108,121.0 L 96,121.5 L 84,122.0 L 72,122.2 L 60,122.0 L 48,121.5 ' +
  'L 36,117.3 L 24,104.2 L 12,95.1 L 0,89.5 Z';

// Continuous upward scallop wave for the top border of the maroon footer (viewBox: 0 0 1440 60)
const FOOTER_SCALLOP_WAVE =
  'M 0,60 L 0,32 ' +
  'Q 45,4 90,32 Q 135,4 180,32 Q 225,4 270,32 Q 315,4 360,32 ' +
  'Q 405,4 450,32 Q 495,4 540,32 Q 585,4 630,32 Q 675,4 720,32 ' +
  'Q 765,4 810,32 Q 855,4 900,32 Q 945,4 990,32 Q 1035,4 1080,32 ' +
  'Q 1125,4 1170,32 Q 1215,4 1260,32 Q 1305,4 1350,32 Q 1395,4 1440,32 ' +
  'L 1440,60 Z';

interface FooterProps {
  onNavigate?: (page: 'home' | 'shop', category?: string) => void;
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
        <div className="relative w-full min-h-[135px] sm:min-h-[145px] md:min-h-[155px] flex items-center justify-center">
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
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            {/* Left Content: Envelope Icon + Heading + Subtitle */}
            <div className="flex items-center gap-4 sm:gap-5 text-left w-full lg:w-auto">
              {/* Rounded Envelope Icon */}
              <div className="w-13 h-11 sm:w-14 sm:h-12 rounded-xl border-2 border-[#641623] bg-transparent flex items-center justify-center flex-shrink-0 text-[#641623]">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
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
                <h3 className="text-2xl sm:text-3xl font-bold text-[#641623] tracking-tight leading-tight lowercase">
                  stay in the loop
                </h3>
                <p className="text-sm sm:text-base text-[#641623]/80 font-normal mt-0.5 lowercase leading-snug">
                  new drops, special offers and little stories from our studio.
                </p>
              </div>
            </div>

            {/* Right Form: Pill Input + Sign up Button + Cute Sunburst Rays */}
            <div className="relative w-full lg:w-auto flex-shrink-0">
              {/* Cute 3 red accent rays above the button matching Image */}
              <div className="absolute -top-3.5 right-10 sm:right-12 pointer-events-none hidden sm:flex gap-1.5 items-end">
                <span className="w-0.5 h-3 bg-[#641623] rotate-[-25deg] rounded-full" />
                <span className="w-0.5 h-4 bg-[#641623] -translate-y-0.5 rounded-full" />
                <span className="w-0.5 h-3 bg-[#641623] rotate-[25deg] rounded-full" />
              </div>

              <form
                onSubmit={handleSubmit}
                className="relative flex items-center bg-white rounded-full p-1.5 sm:p-2 border border-[#641623]/15 shadow-sm max-w-md w-full"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your email address"
                  required
                  className="flex-1 bg-transparent px-4 sm:px-5 py-2 text-sm sm:text-base text-[#641623] placeholder-[#641623]/50 focus:outline-none lowercase font-medium"
                />

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#641623] hover:bg-[#7e1c2d] active:scale-95 text-white text-sm sm:text-base font-semibold px-5 sm:px-7 py-2.5 sm:py-3 rounded-full transition-all duration-200 shadow-sm flex-shrink-0"
                >
                  <span>{isSubscribed ? 'joined!' : 'sign up'}</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
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
