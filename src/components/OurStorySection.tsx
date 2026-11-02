import React from 'react';

interface OurStorySectionProps {
  onStoryClick?: () => void;
}

export const OurStorySection: React.FC<OurStorySectionProps> = ({ onStoryClick }) => {
  return (
    <section className="w-full bg-[#FAF5EE] py-14 sm:py-20 lg:py-28 text-[#1E1E1E] overflow-hidden">
      {/* 1. Subtle Golden Wavy Divider at Top Transition (Reference 2) */}
      <div className="w-full overflow-hidden flex justify-center -mt-6 sm:-mt-10 mb-12 sm:mb-16 lg:mb-20" aria-hidden="true">
        <svg
          viewBox="0 0 1440 24"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-4 sm:h-5 text-[#F7BE44]"
        >
          <path
            d="M0 12 C 30 0, 60 24, 90 12 C 120 0, 150 24, 180 12 C 210 0, 240 24, 270 12 C 300 0, 330 24, 360 12 C 390 0, 420 24, 450 12 C 480 0, 510 24, 540 12 C 570 0, 600 24, 630 12 C 660 0, 690 24, 720 12 C 750 0, 780 24, 810 12 C 840 0, 870 24, 900 12 C 930 0, 960 24, 990 12 C 1020 0, 1050 24, 1080 12 C 1110 0, 1140 24, 1170 12 C 1200 0, 1230 24, 1260 12 C 1290 0, 1320 24, 1350 12 C 1380 0, 1410 24, 1440 12"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 2. Full-Screen Section Coverage Container (Spans broadly across the viewport like Reference) */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-start">
          {/* Left Column: Razor-Sharp Editorial Typography & Story */}
          <div className="lg:col-span-5 flex flex-col justify-start lg:sticky lg:top-24 pt-2 lg:pt-6">
            {/* Headline with Exact Editorial Font matching Reference */}
            <h2 className="font-['Editorial',serif] font-normal text-5xl sm:text-6xl md:text-7xl lg:text-[76px] text-[#1E1E1E] leading-[0.95] tracking-[-0.01em] mb-6 sm:mb-8 select-none">
              Life is better with<br />a matcha in hand
            </h2>

            {/* Editorial Story Body */}
            <div className="font-['Quicksand',sans-serif] text-base sm:text-[18px] leading-[1.48] text-[#1E1E1E]/85 max-w-[460px] space-y-4 mb-6">
              <p>
                Matcha is meant to be enjoyed with your community, which is why I wanted to share my love for matcha with you! Grown and crafted in Japan, Nami Matcha is here to bring you the highest quality tea possible. We&apos;re honored to be a part of your daily ritual &lt;3
              </p>
            </div>

            {/* Personal Sign-off */}
            <div className="font-['Quicksand',sans-serif] text-base sm:text-[18px] leading-[1.45] text-[#1E1E1E]/85 mb-8 sm:mb-10">
              <p>Much love,</p>
              <p className="mt-1 font-medium text-[#1E1E1E]">Ashley (Founder &amp; CEO)</p>
            </div>

            {/* Exact Outline Pill Button (min-width 220px, 1.5px border) */}
            <div>
              <button
                onClick={onStoryClick}
                className="inline-flex items-center justify-center min-w-[200px] sm:min-w-[220px] py-3 sm:py-3.5 px-6 rounded-full border-[1.5px] border-[#1E1E1E] text-[#1E1E1E] font-['Quicksand',sans-serif] font-medium text-base sm:text-[18px] tracking-wide hover:bg-[#1E1E1E] hover:text-[#FAF5EE] transition-all duration-200 cursor-pointer text-center"
              >
                About us
              </button>
            </div>
          </div>

          {/* Right Column: Full-Section 5-Tile Razor-Sharp Photo Grid (Exact Reference Geometry) */}
          <div className="lg:col-span-7 w-full flex justify-center lg:justify-end">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[620px] xl:max-w-[660px]">
              {/* Tile 1: Top-Left Square (1400px Source High-Res) */}
              <div className="aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#EFE9DF] shadow-sm">
                <img
                  src="/story/tile_a.jpg"
                  alt="Matcha bowl and tin craft detail"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Tile 2: Top-Center Square Graphic Motif Tile (Sharp Source) */}
              <div className="aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#EFE9DF] shadow-sm">
                <img
                  src="/story/tile_b_sharp.png"
                  alt="Sun mosaic motif pattern tile"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Tile 3: Top-Right Square (1400px Source High-Res) */}
              <div className="aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#EFE9DF] shadow-sm">
                <img
                  src="/story/tile_c.jpg"
                  alt="Iced matcha drinks and tins"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Tile 4: Bottom-Left Large Hero Square (1800px Source High-Res, Spans 2 Cols) */}
              <div className="col-span-2 aspect-square rounded-[22px] sm:rounded-[28px] overflow-hidden bg-[#EFE9DF] shadow-md">
                <img
                  src="/story/tile_d.jpg"
                  alt="Authentic lifestyle portrait drinking matcha"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Tile 5: Bottom-Right Vertical Capsule Stadium Pill (Sharp Source, Spans 1 Col) */}
              <div className="col-span-1 rounded-full overflow-hidden bg-[#EFE9DF] shadow-md h-full">
                <img
                  src="/story/tile_e_sharp.png"
                  alt="Vintage paper ticket print stadium capsule"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
