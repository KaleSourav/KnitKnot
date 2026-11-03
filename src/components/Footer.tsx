import React, { useState } from 'react';

// Cloud pill scalloped border path for the newsletter container (viewBox: 0 0 1100 130)
const CLOUD_NEWSLETTER_PATH =
  'M 30,12 ' +
  'Q 62.5,0 95.0,12 Q 127.5,0 160.0,12 Q 192.5,0 225.0,12 Q 257.5,0 290.0,12 ' +
  'Q 322.5,0 355.0,12 Q 387.5,0 420.0,12 Q 452.5,0 485.0,12 Q 517.5,0 550.0,12 ' +
  'Q 582.5,0 615.0,12 Q 647.5,0 680.0,12 Q 712.5,0 745.0,12 Q 777.5,0 810.0,12 ' +
  'Q 842.5,0 875.0,12 Q 907.5,0 940.0,12 Q 972.5,0 1005.0,12 Q 1037.5,0 1070.0,12 ' +
  'Q 1100,15 1092,35 Q 1100,55 1092,75 Q 1100,95 1092,115 ' +
  'Q 1100,128 1070,118 ' +
  'Q 1037.5,130 1005.0,118 Q 972.5,130 940.0,118 Q 907.5,130 875.0,118 Q 842.5,130 810.0,118 ' +
  'Q 777.5,130 745.0,118 Q 712.5,130 680.0,118 Q 647.5,130 615.0,118 Q 582.5,130 550.0,118 ' +
  'Q 517.5,130 485.0,118 Q 452.5,130 420.0,118 Q 387.5,130 355.0,118 Q 322.5,130 290.0,118 ' +
  'Q 257.5,130 225.0,118 Q 192.5,130 160.0,118 Q 127.5,130 95.0,118 Q 62.5,130 30.0,118 ' +
  'Q 0,115 8,95 Q 0,75 8,55 Q 0,35 8,15 Q 0,15 30,12 Z';

// Continuous upward scallop wave for the top border of the maroon footer (viewBox: 0 0 1440 60)
const FOOTER_SCALLOP_WAVE =
  'M 0,60 L 0,32 ' +
  'Q 45,4 90,32 Q 135,4 180,32 Q 225,4 270,32 Q 315,4 360,32 ' +
  'Q 405,4 450,32 Q 495,4 540,32 Q 585,4 630,32 Q 675,4 720,32 ' +
  'Q 765,4 810,32 Q 855,4 900,32 Q 945,4 990,32 Q 1035,4 1080,32 ' +
  'Q 1125,4 1170,32 Q 1215,4 1260,32 Q 1305,4 1350,32 Q 1395,4 1440,32 ' +
  'L 1440,60 Z';

export const Footer: React.FC = () => {
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
    <footer className="relative w-full bg-[#FAF4ED] text-white font-['Fredoka'] overflow-hidden pt-6">
      {/* =========================================================================
          1. NEWSLETTER BANNER: "stay in the loop" (Scalloped Cloud Pill Container)
         ========================================================================= */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 z-20 pb-4 sm:pb-6">
        <div className="relative w-full min-h-[110px] sm:min-h-[125px] flex items-center p-6 sm:p-8 md:p-9">
          {/* Scalloped Cloud Background SVG */}
          <svg
            viewBox="0 0 1100 130"
            fill="none"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_8px_20px_rgba(100,22,35,0.06)]"
          >
            <path d={CLOUD_NEWSLETTER_PATH} fill="#DDF2F8" />
          </svg>

          {/* Cloud Content Layer */}
          <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            {/* Left Content: Envelope Icon + Heading + Subtitle */}
            <div className="flex items-center gap-4 sm:gap-5 text-left w-full lg:w-auto">
              {/* Rounded Envelope Icon */}
              <div className="w-13 h-11 sm:w-14 sm:h-12 rounded-xl border-2 border-[#641623] bg-[#DDF2F8] flex items-center justify-center flex-shrink-0 text-[#641623]">
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
              {/* Cute 3 red accent rays above the button matching Image 1 */}
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
                    className="w-4 h-4"
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
      <div className="relative w-full -mt-2 sm:-mt-4 z-10 leading-none">
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
              <a href="#" className="inline-block transition-opacity duration-200 hover:opacity-90">
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
                    <a href="#bestsellers" className="hover:text-white transition-colors duration-150">
                      all products
                    </a>
                  </li>
                  <li>
                    <a href="#bestsellers" className="hover:text-white transition-colors duration-150">
                      flowers
                    </a>
                  </li>
                  <li>
                    <a href="#bestsellers" className="hover:text-white transition-colors duration-150">
                      flower pots
                    </a>
                  </li>
                  <li>
                    <a href="#bestsellers" className="hover:text-white transition-colors duration-150">
                      plushies
                    </a>
                  </li>
                  <li>
                    <a href="#bestsellers" className="hover:text-white transition-colors duration-150">
                      bags
                    </a>
                  </li>
                  <li>
                    <a href="#bestsellers" className="hover:text-white transition-colors duration-150">
                      keychains & charms
                    </a>
                  </li>
                  <li>
                    <a href="#bestsellers" className="hover:text-white transition-colors duration-150">
                      home decor
                    </a>
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
