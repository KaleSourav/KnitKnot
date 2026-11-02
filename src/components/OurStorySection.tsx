import React from 'react';

interface OurStorySectionProps {
  onStoryClick?: () => void;
}

export const OurStorySection: React.FC<OurStorySectionProps> = ({ onStoryClick }) => {
  return (
    <section className="w-full bg-[#FAF4ED] py-14 sm:py-20 lg:py-28 text-[#2D2424] overflow-hidden font-['Fredoka']">
      {/* 1. Golden Wavy Divider at Top Transition (Reference 2) */}
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

      {/* 2. Full-Screen Section Coverage Container */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-start">
          {/* Left Column: Brand Story in Our Font Language (Fredoka & Maroon #641623) */}
          <div className="lg:col-span-5 flex flex-col justify-start lg:sticky lg:top-24 pt-2 lg:pt-6">
            {/* Headline in Fredoka Font Language */}
            <h2 className="font-['Fredoka'] font-black text-4xl sm:text-5xl md:text-6xl lg:text-[68px] text-[#641623] leading-[1.04] tracking-tight mb-6 sm:mb-8 select-none">
              made by hand,<br />made with love.
            </h2>

            {/* Authentic Brand Story */}
            <div className="font-['Fredoka'] font-medium text-base sm:text-[18px] leading-[1.65] text-[#2D2424]/85 max-w-[480px] space-y-4 mb-6">
              <p>
                at knotsnco, our crochet pieces are lovingly handmade by a group of talented dadis in surat. each stitch carries their skill, care and years of craft, turning simple yarn into meaningful gifts that last forever.
              </p>
              <p>
                every petal, leaf, and plushie is looped by hand—never by machines. we believe the most cherished treasures aren&apos;t just made, they are felt and remembered.
              </p>
            </div>

            {/* Personal Sign-off */}
            <div className="font-['Fredoka'] text-base sm:text-[18px] leading-[1.5] text-[#2D2424]/85 mb-8 sm:mb-10">
              <p>much love,</p>
              <p className="mt-1 font-bold text-[#641623]">the dadis &amp; artisans at knotsnco</p>
            </div>

            {/* Clean Outline Pill Button in Brand Theme */}
            <div>
              <button
                onClick={onStoryClick}
                className="inline-flex items-center justify-center min-w-[200px] sm:min-w-[220px] py-3 sm:py-3.5 px-7 rounded-full border-[2.2px] border-[#641623] text-[#641623] font-['Fredoka'] font-bold text-base sm:text-lg tracking-wide hover:bg-[#641623] hover:text-[#FAF4ED] transition-all duration-200 cursor-pointer text-center"
              >
                our story
              </button>
            </div>
          </div>

          {/* Right Column: Full-Section 5-Tile Razor-Sharp Crochet Photo Grid */}
          <div className="lg:col-span-7 w-full flex justify-center lg:justify-end">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[620px] xl:max-w-[660px]">
              {/* Tile 1: Top-Left Square (Handmade Flower Clips Detail) */}
              <div className="aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#F2EDE4] shadow-sm">
                <img
                  src="/story/crochet_tile1.jpg"
                  alt="Handmade crochet flower hair clips detail"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Tile 2: Top-Center Square (Crochet Daisy Flower Pot) */}
              <div className="aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#F2EDE4] shadow-sm">
                <img
                  src="/story/crochet_tile2.jpg"
                  alt="Handmade crochet daisy potted plant"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Tile 3: Top-Right Square (Handmade Sunflower Bouquet) */}
              <div className="aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#F2EDE4] shadow-sm">
                <img
                  src="/story/crochet_tile3.jpg"
                  alt="Sunflower bouquet on warm studio table"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Tile 4: Bottom-Left Large Hero Square (Authentic Hands Crocheting Flower, Spans 2 Cols) */}
              <div className="col-span-2 aspect-square rounded-[22px] sm:rounded-[28px] overflow-hidden bg-[#F2EDE4] shadow-md">
                <img
                  src="/story/crochet_tile4.jpg"
                  alt="Authentic artisan craftswoman hands crocheting flower with golden hook"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Tile 5: Bottom-Right Vertical Capsule Stadium Pill (Summer Tulips Bouquet, Spans 1 Col) */}
              <div className="col-span-1 rounded-full overflow-hidden bg-[#F2EDE4] shadow-md h-full">
                <img
                  src="/story/crochet_tile5.jpg"
                  alt="Handcrafted vertical crochet tulip bouquet"
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
