import React from 'react';

interface OurStorySectionProps {
  onStoryClick?: () => void;
}

export const OurStorySection: React.FC<OurStorySectionProps> = ({ onStoryClick }) => {
  return (
    <section className="w-full relative py-6 sm:py-10 bg-[#FAF4ED] overflow-hidden">
      {/* 1. Section Division: Smooth Golden Wavy Sine-wave Line (Reference 2) */}
      <div className="w-full overflow-hidden flex justify-center -mt-2 mb-8 sm:mb-12" aria-hidden="true">
        <svg
          viewBox="0 0 1440 24"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-4 sm:h-6 text-[#F7BE44]"
        >
          <path
            d="M0 12 C 30 0, 60 24, 90 12 C 120 0, 150 24, 180 12 C 210 0, 240 24, 270 12 C 300 0, 330 24, 360 12 C 390 0, 420 24, 450 12 C 480 0, 510 24, 540 12 C 570 0, 600 24, 630 12 C 660 0, 690 24, 720 12 C 750 0, 780 24, 810 12 C 840 0, 870 24, 900 12 C 930 0, 960 24, 990 12 C 1020 0, 1050 24, 1080 12 C 1110 0, 1140 24, 1170 12 C 1200 0, 1230 24, 1260 12 C 1290 0, 1320 24, 1350 12 C 1380 0, 1410 24, 1440 12"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 2. Main Storytelling Container (Two-column layout like Reference 1 + Craft Knots & Tapes like Reference 3) */}
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#FFF9F5] border-[2.2px] border-[#641623]/20 p-6 sm:p-10 lg:p-12 shadow-[0_10px_30px_rgba(100,22,35,0.06)]">
          {/* Decorative Scrapbook Washi Tape in Top-Left Corner (Reference 3) */}
          <div
            className="absolute -top-3.5 -left-4 sm:-left-5 z-20 w-20 sm:w-28 h-7 sm:h-8 bg-[#FEEF9E]/90 backdrop-blur-[1px] shadow-[0_3px_6px_rgba(100,22,35,0.12)] -rotate-12 pointer-events-none border-t border-b border-[#F7BE44]/40"
            style={{
              clipPath:
                'polygon(0% 0%, 96% 0%, 100% 12%, 96% 25%, 100% 45%, 95% 65%, 100% 85%, 96% 100%, 4% 100%, 0% 88%, 4% 75%, 0% 55%, 4% 35%, 0% 15%)',
            }}
          />

          {/* Decorative Scrapbook Washi Tape in Bottom-Right Corner (Reference 3) */}
          <div
            className="absolute -bottom-3.5 -right-4 sm:-right-5 z-20 w-20 sm:w-28 h-7 sm:h-8 bg-[#FEEF9E]/90 backdrop-blur-[1px] shadow-[0_3px_6px_rgba(100,22,35,0.12)] 12deg pointer-events-none border-t border-b border-[#F7BE44]/40 rotate-12"
            style={{
              clipPath:
                'polygon(0% 0%, 96% 0%, 100% 12%, 96% 25%, 100% 45%, 95% 65%, 100% 85%, 96% 100%, 4% 100%, 0% 88%, 4% 75%, 0% 55%, 4% 35%, 0% 15%)',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: Editorial Storytelling, Heartfelt Note & CTA (Reference 1 & 3) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {/* Cute Maroon Heart Doodle (Reference 3) */}
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#641623] transition-transform duration-300 hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="font-['Fredoka'] font-bold text-xs sm:text-sm tracking-wider uppercase text-[#641623]/70">
                  handcrafted with love
                </span>
              </div>

              {/* Bold Expressive Story Heading */}
              <h2 className="font-['Fredoka'] font-black text-3xl sm:text-4xl md:text-5xl text-[#641623] tracking-tight leading-[1.15] mb-4 sm:mb-5">
                made by hand,<br />made with love.
              </h2>

              {/* Story Narrative Paragraphs */}
              <div className="font-['Fredoka'] text-sm sm:text-base text-[#641623]/85 leading-relaxed space-y-3 sm:space-y-4">
                <p>
                  at knotsnco, our crochet pieces are lovingly handmade by a group of talented dadis and craftswomen in surat. each stitch carries their skill, care, and years of craft, turning simple yarn into meaningful gifts that last forever.
                </p>
                <p>
                  every petal, plushie, and charm is looped by hand—never by machines. we believe the most cherished treasures aren&apos;t just purchased; they are felt, shared, and remembered.
                </p>
              </div>

              {/* Founder / Artisan Sign-off (Reference 1) */}
              <div className="mt-5 sm:mt-6 font-['Fredoka']">
                <p className="text-xs sm:text-sm font-medium text-[#641623]/70">much love,</p>
                <p className="text-sm sm:text-base font-bold text-[#641623]">the dadis &amp; artisans at knotsnco</p>
              </div>

              {/* Pill Button CTA (Reference 1 & 3) */}
              <div className="mt-6 sm:mt-8">
                <button
                  onClick={onStoryClick}
                  className="group inline-flex items-center gap-2.5 px-7 py-3 sm:py-3.5 rounded-full bg-[#641623] text-white font-['Fredoka'] font-bold text-sm sm:text-base tracking-wide shadow-[0_6px_0_0_#3F0B13] hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#3F0B13] active:translate-y-1 active:shadow-none transition-all duration-200 cursor-pointer"
                >
                  <span>our story</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>

              {/* Whimsical Trailing Yarn Ball with Knot Detail at Bottom (Reference 3) */}
              <div className="mt-6 pt-4 border-t border-[#641623]/10 flex items-center gap-3" aria-hidden="true">
                <svg
                  className="w-8 h-8 text-[#641623] flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M4.5 9c2.5 1 6.5 1 9.5-1 3-2 5-1 5.5 0" />
                  <path d="M5 15c3-1 6.5-1 9 1 2.5 2 4.5 1.5 5.5 0" />
                  <path d="M9 4.5c1 2.5 1 6.5-1 9.5-2 3-1 5 0 5.5" />
                  <path d="M15 5c-1 3-1 6.5 1 9 2 2.5 1.5 4.5 0 5.5" />
                </svg>
                <svg
                  className="w-full h-5 text-[#641623]/40"
                  viewBox="0 0 300 20"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 10 C 30 18, 50 2, 80 10 C 110 18, 130 2, 160 10 C 190 18, 220 2, 250 10 C 270 15, 290 8, 300 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </div>

            {/* RIGHT COLUMN: 5-Tile Editorial Photo Collage (Reference 1 Layout) */}
            <div className="lg:col-span-7">
              {/* TOP ROW: 3 Square Tiles */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {/* Tile 1: Soft Pastel Yarn Skeins */}
                <div className="relative group overflow-hidden aspect-square rounded-[18px] sm:rounded-[22px] border-[2px] border-[#641623]/15 shadow-sm bg-white">
                  <img
                    src="/story/story-yarn-skeins.jpg"
                    alt="Soft pastel cotton yarn skeins"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  {/* Subtle inner shadow overlay */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[18px] sm:rounded-[22px] pointer-events-none" />
                </div>

                {/* Tile 2: Handcrafted Daisy Motif Flatlay */}
                <div className="relative group overflow-hidden aspect-square rounded-[18px] sm:rounded-[22px] border-[2px] border-[#641623]/15 shadow-sm bg-white">
                  <img
                    src="/story/story-crochet-daisies.jpg"
                    alt="Handmade crochet daisy floral motifs"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[18px] sm:rounded-[22px] pointer-events-none" />
                </div>

                {/* Tile 3: Cozy Studio Tabletop / Sunflower */}
                <div className="relative group overflow-hidden aspect-square rounded-[18px] sm:rounded-[22px] border-[2px] border-[#641623]/15 shadow-sm bg-white">
                  <img
                    src="/story/story-lifestyle-table.jpg"
                    alt="Cozy sunlit tabletop with handmade crochet sunflower"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[18px] sm:rounded-[22px] pointer-events-none" />
                </div>
              </div>

              {/* BOTTOM ROW: 2 Tiles (Large Artisan Photo + Stadium Arch Pill) */}
              <div className="grid grid-cols-12 gap-3 sm:gap-4 mt-3 sm:mt-4">
                {/* Tile 4: Large Artisan Hands Crocheting Hero Shot (Spans 8 cols ~66%) */}
                <div className="col-span-7 sm:col-span-8 relative group overflow-hidden aspect-[4/4.8] sm:aspect-[4/4.5] rounded-[22px] sm:rounded-[28px] border-[2.2px] border-[#641623]/15 shadow-md bg-white">
                  <img
                    src="/story/story-artisan-hands.jpg"
                    alt="Authentic artisan craftswoman hands crocheting with love"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Corner Washi Tape Accent on the Photo (Reference 3) */}
                  <div
                    className="absolute -top-2 -right-3 z-20 w-16 sm:w-20 h-5 sm:h-6 bg-[#FEEF9E]/90 backdrop-blur-[1px] shadow-sm rotate-12 pointer-events-none border-t border-b border-[#F7BE44]/40"
                    style={{
                      clipPath:
                        'polygon(0% 0%, 96% 0%, 100% 15%, 96% 30%, 100% 50%, 95% 70%, 100% 85%, 96% 100%, 4% 100%, 0% 85%, 4% 70%, 0% 50%, 4% 30%, 0% 15%)',
                    }}
                  />

                  {/* Floating Handcrafted Badge */}
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#641623]/20 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#7FE5BD] animate-pulse" />
                    <span className="font-['Fredoka'] font-bold text-[11px] sm:text-xs text-[#641623] uppercase tracking-wider">
                      100% handmade
                    </span>
                  </div>

                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[22px] sm:rounded-[28px] pointer-events-none" />
                </div>

                {/* Tile 5: Vertical Arch / Pill Stadium Capsule (Spans 4 cols ~34%) */}
                <div className="col-span-5 sm:col-span-4 relative group overflow-hidden aspect-[4/8] sm:aspect-[4/7.5] rounded-t-full rounded-b-[22px] sm:rounded-b-[28px] border-[2.2px] border-[#641623]/15 shadow-md bg-white">
                  <img
                    src="/story/story-tulip-arch.jpg"
                    alt="Vertical crochet tulip and craft tag arrangement"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Top-Center Washi Tape Tape on Arch */}
                  <div
                    className="absolute top-1 left-1/2 -translate-x-1/2 z-20 w-12 sm:w-16 h-4 sm:h-5 bg-[#FEEF9E]/90 backdrop-blur-[1px] shadow-sm -rotate-3 pointer-events-none border-t border-b border-[#F7BE44]/40"
                    style={{
                      clipPath:
                        'polygon(0% 0%, 96% 0%, 100% 15%, 96% 30%, 100% 50%, 95% 70%, 100% 85%, 96% 100%, 4% 100%, 0% 85%, 4% 70%, 0% 50%, 4% 30%, 0% 15%)',
                    }}
                  />

                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-t-full rounded-b-[22px] sm:rounded-b-[28px] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
