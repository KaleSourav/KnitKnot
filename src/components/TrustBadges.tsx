import React from 'react';

export const TrustBadges: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF4ED] pt-4 pb-10 sm:pt-6 sm:pb-16 px-3 sm:px-6 lg:px-8 overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center">
        {/* 1. Full-Width Puffy Scalloped Cloud Container */}
        <div className="relative w-full min-h-[120px] sm:min-h-[140px] md:min-h-[160px] flex items-center justify-center px-4 sm:px-10 md:px-14 py-6 sm:py-8 md:py-10">
          {/* Realistic Multi-Layer Vector Cloud Background */}
          <svg
            viewBox="0 0 1200 160"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full select-none pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              {/* Soft sky-cloud realistic gradient */}
              <linearGradient id="puffyCloudGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EBF8FA" />
                <stop offset="60%" stopColor="#D9F2F6" />
                <stop offset="100%" stopColor="#C8ECF3" />
              </linearGradient>

              {/* Realistic cloud soft drop shadow */}
              <filter id="puffyCloudShadow" x="-5%" y="-10%" width="110%" height="135%">
                <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#641623" floodOpacity="0.05" />
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#8ED5E3" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Cloud Puffy Scallop Path */}
            <path
              d="M 15 80 C 15 45, 30 25, 50.0 20 C 60.0 5.0, 118.6 5.0, 128.6 20 C 138.6 10.0, 197.1 10.0, 207.1 20 C 217.1 5.0, 275.7 5.0, 285.7 20 C 295.7 10.0, 354.3 10.0, 364.3 20 C 374.3 5.0, 432.9 5.0, 442.9 20 C 452.9 10.0, 511.4 10.0, 521.4 20 C 531.4 5.0, 590.0 5.0, 600.0 20 C 610.0 10.0, 668.6 10.0, 678.6 20 C 688.6 5.0, 747.1 5.0, 757.1 20 C 767.1 10.0, 825.7 10.0, 835.7 20 C 845.7 5.0, 904.3 5.0, 914.3 20 C 924.3 10.0, 982.9 10.0, 992.9 20 C 1002.9 5.0, 1061.4 5.0, 1071.4 20 C 1081.4 10.0, 1140.0 10.0, 1150.0 20 C 1170.0 25, 1185.0 45, 1185.0 80 C 1185.0 115, 1170.0 135, 1150.0 140 C 1140.0 155.0, 1081.4 155.0, 1071.4 140 C 1061.4 150.0, 1002.9 150.0, 992.9 140 C 982.9 155.0, 924.3 155.0, 914.3 140 C 904.3 150.0, 845.7 150.0, 835.7 140 C 825.7 155.0, 767.1 155.0, 757.1 140 C 747.1 150.0, 688.6 150.0, 678.6 140 C 668.6 155.0, 610.0 155.0, 600.0 140 C 590.0 150.0, 531.4 150.0, 521.4 140 C 511.4 155.0, 452.9 155.0, 442.9 140 C 432.9 150.0, 374.3 150.0, 364.3 140 C 354.3 155.0, 295.7 155.0, 285.7 140 C 275.7 150.0, 217.1 150.0, 207.1 140 C 197.1 155.0, 138.6 155.0, 128.6 140 C 118.6 150.0, 60.0 150.0, 50.0 140 C 30 135, 15 115, 15 80 Z"
              fill="url(#puffyCloudGrad)"
              filter="url(#puffyCloudShadow)"
            />
          </svg>

          {/* 4 Trust Pillars with High-Fidelity Vector Icons & Real Text */}
          <div className="relative z-10 w-full grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 items-center text-center">
            {/* Pillar 1: Handmade with love */}
            <div className="flex flex-col items-center justify-center group px-2 sm:px-4 py-2">
              <div className="text-[#641623] mb-2 transition-transform duration-300 group-hover:scale-115">
                <svg
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <p className="font-['Fredoka'] font-bold text-xs sm:text-base md:text-lg text-[#641623] leading-snug">
                handmade
                <br />
                with love
              </p>
            </div>

            {/* Pillar 2: Made by dadis in surat */}
            <div className="flex flex-col items-center justify-center group px-2 sm:px-4 py-2 relative">
              {/* Divider on left (desktop) */}
              <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 h-10 md:h-12 w-[1.5px] bg-[#641623]/25 rounded-full" />
              <div className="text-[#641623] mb-2 transition-transform duration-300 group-hover:scale-115">
                {/* Cute Yarn Ball with Crochet Hook */}
                <svg
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="16" cy="16" r="10.5" />
                  <path d="M 9 12 Q 16 16 23 11" />
                  <path d="M 8 18 Q 15 22 24 17" />
                  <path d="M 12 7 Q 16 16 14 25" />
                  <path d="M 18 8 Q 19 17 21 24" />
                  <line x1="5" y1="27" x2="27" y2="5" strokeWidth="2.4" />
                  <path d="M 27 5 Q 29 3 27 2" />
                </svg>
              </div>
              <p className="font-['Fredoka'] font-bold text-xs sm:text-base md:text-lg text-[#641623] leading-snug">
                made by
                <br />
                dadis in surat
              </p>
            </div>

            {/* Pillar 3: Sustainable yarn & materials */}
            <div className="flex flex-col items-center justify-center group px-2 sm:px-4 py-2 relative">
              {/* Divider on left (desktop) */}
              <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 h-10 md:h-12 w-[1.5px] bg-[#641623]/25 rounded-full" />
              <div className="text-[#641623] mb-2 transition-transform duration-300 group-hover:scale-115">
                {/* Twin Leaves */}
                <svg
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 7 25 C 10 20 13 16 20 13" />
                  <path d="M 15 14 C 13 6 21 4 25 5 C 26 9 24 16 16 18 Z" />
                  <path d="M 14 17 C 8 13 6 7 9 5 C 13 5 18 9 16 16 Z" />
                </svg>
              </div>
              <p className="font-['Fredoka'] font-bold text-xs sm:text-base md:text-lg text-[#641623] leading-snug">
                sustainable
                <br />
                yarn & materials
              </p>
            </div>

            {/* Pillar 4: Perfect for gifting */}
            <div className="flex flex-col items-center justify-center group px-2 sm:px-4 py-2 relative">
              {/* Divider on left (desktop) */}
              <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 h-10 md:h-12 w-[1.5px] bg-[#641623]/25 rounded-full" />
              <div className="text-[#641623] mb-2 transition-transform duration-300 group-hover:scale-115">
                {/* Gift Box with Ribbon Bow */}
                <svg
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="14" width="20" height="13" rx="2" />
                  <rect x="4" y="9" width="24" height="5" rx="1.5" />
                  <line x1="16" y1="9" x2="16" y2="27" />
                  <path d="M 16 9 C 13 4 8 4 9 7 C 10 9 14 9 16 9 Z" />
                  <path d="M 16 9 C 19 4 24 4 23 7 C 22 9 18 9 16 9 Z" />
                </svg>
              </div>
              <p className="font-['Fredoka'] font-bold text-xs sm:text-base md:text-lg text-[#641623] leading-snug">
                perfect
                <br />
                for gifting
              </p>
            </div>
          </div>
        </div>

        {/* 2. Full-Width Curvy Dashed Stitch Ribbon Section Divider */}
        <div className="w-full max-w-[1440px] mt-8 sm:mt-12 px-2 sm:px-6">
          <svg
            viewBox="0 0 1200 64"
            className="w-full h-auto text-[#641623] overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left Curvy Wavy Dashed Stitch Line */}
            <path
              d="M 10 32 C 160 14, 300 48, 440 22 C 490 13, 535 30, 565 32"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeDasharray="26 14"
              strokeLinecap="round"
              className="opacity-80"
            />

            {/* Hand-Drawn Ribbon Bow in the Center */}
            <g transform="translate(600, 32)">
              {/* Left Bow Loop */}
              <path
                d="M 0 0 C -12 -18 -36 -24 -38 -10 C -39 2 -14 3 0 0 Z"
                stroke="currentColor"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Right Bow Loop */}
              <path
                d="M 0 0 C 12 -18 36 -24 38 -10 C 39 2 14 3 0 0 Z"
                stroke="currentColor"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Left Flowing Ribbon Tail */}
              <path
                d="M 0 0 Q -8 14 -24 28"
                stroke="currentColor"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
              {/* Right Flowing Ribbon Tail */}
              <path
                d="M 0 0 Q 8 14 24 28"
                stroke="currentColor"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
              {/* Knot Center Accent */}
              <circle cx="0" cy="0" r="2.5" fill="currentColor" />
            </g>

            {/* Right Curvy Wavy Dashed Stitch Line */}
            <path
              d="M 635 32 C 665 30, 710 13, 760 22 C 900 48, 1040 14, 1190 32"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeDasharray="26 14"
              strokeLinecap="round"
              className="opacity-80"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};
