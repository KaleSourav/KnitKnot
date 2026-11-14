import React from 'react';

interface OurStorySectionProps {
  onStoryClick?: () => void;
}

export const OurStorySection: React.FC<OurStorySectionProps> = ({ onStoryClick }) => {
  return (
    <section id="section-story" className="w-full bg-[#FAF4ED] pt-4 sm:pt-6 pb-16 sm:pb-24 lg:pb-28 text-[#2D2424] overflow-hidden font-['Fredoka']">
      {/* 1. Golden Wavy Sine Divider at Top Transition from Bestsellers */}
      <div className="w-full overflow-hidden flex justify-center -mt-2 sm:-mt-4 mb-10 sm:mb-14 lg:mb-18" aria-hidden="true">
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

      {/* Full-Screen Section Coverage Container */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-20 items-start">
          {/* Left Column: Brand Story in Our Font Language (Fredoka & Maroon #641623) */}
          <div className="lg:col-span-5 flex flex-col justify-start lg:sticky lg:top-24 pt-2 lg:pt-6">
            {/* Headline in Dual-Font Pairing (Fredoka + Flowing Cursive Script) */}
            <h2 className="font-['Fredoka'] font-black text-2xl sm:text-4xl md:text-5xl lg:text-[50px] text-[#641623] leading-[1.18] tracking-tight mb-5 sm:mb-7">
              <span>A Little </span>
              <span className="font-script font-normal text-[1.18em] text-[#811B2B] inline-block -rotate-2">Dream</span>,
              <br />
              <span>A Lot </span>
              <span className="font-script font-normal text-[1.18em] text-[#811B2B] inline-block -rotate-2">of</span>
              <span> Love </span>
              <span className="text-[#811B2B] font-normal text-[0.9em]">♡</span>
            </h2>

            {/* Authentic Brand Story */}
            <div className="font-['Fredoka'] font-medium text-sm sm:text-[17px] leading-[1.65] text-[#2D2424]/85 max-w-[500px] space-y-3 sm:space-y-3.5 mb-5 sm:mb-6">
              <p>
                It all began in 2019 with a 16-year-old and a big dream &mdash; to build something beautiful with crochet.
              </p>
              <p>
                What started as a love for yarn soon became something bigger. We met talented daadis and aunties who had incredible skills but few opportunities to showcase them.
              </p>
              <p>
                So, we brought our worlds together, creating opportunities for them to work from home, earn independently and turn their passion into something special.
              </p>
              <p>
                Today, we&apos;re a family of <strong className="font-bold text-[#641623]">200+ daadis, aunties and artisans</strong>, creating everything from colourful bouquets and plushies to bags and little handmade treasures.
              </p>
              <p>
                And we&apos;re just getting started.
              </p>
            </div>

            {/* Welcome Tagline with Dual Font Accent */}
            <div className="font-['Fredoka'] text-sm sm:text-[17px] leading-[1.5] text-[#641623] font-bold mb-6 sm:mb-8">
              <p>Welcome to Knots &amp; Co. &mdash; <span className="font-script font-normal text-[1.25em] text-[#811B2B]">a little yarn, a lot of love.</span> ♡</p>
            </div>

            {/* Clean Outline Pill Button in Brand Theme */}
            <div>
              <button
                onClick={onStoryClick}
                className="inline-flex items-center justify-center min-w-[170px] sm:min-w-[220px] py-2.5 sm:py-3.5 px-6 sm:px-7 rounded-full border-[2.2px] border-[#641623] text-[#641623] font-['Fredoka'] font-bold text-sm sm:text-lg tracking-wide hover:bg-[#641623] hover:text-[#FAF4ED] transition-all duration-200 cursor-pointer text-center"
              >
                our story
              </button>
            </div>

            {/* Mobile-Only Editorial Image Layout (Exact match to Reference: Top 2 Squares, Center Big Hero, Bottom Circle + Square) */}
            <div className="lg:hidden mt-8 sm:mt-10 w-full flex flex-col gap-3 sm:gap-4 max-w-lg mx-auto">
              {/* Row 1: Two Rounded Squares Side-by-Side */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                {/* Top-Left Rounded Square */}
                <div className="aspect-square rounded-[22px] overflow-hidden bg-[#F2EDE4] shadow-[0_4px_16px_rgba(100,22,35,0.06)] border border-[#641623]/8">
                  <img
                    src="/story/crochet_tile1.jpg"
                    alt="Handmade crochet flower hair clips detail"
                    className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                {/* Top-Right Rounded Square */}
                <div className="aspect-square rounded-[22px] overflow-hidden bg-[#F2EDE4] shadow-[0_4px_16px_rgba(100,22,35,0.06)] border border-[#641623]/8">
                  <img
                    src="/story/crochet_tile2.jpg"
                    alt="Handmade crochet daisy potted plant"
                    className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Row 2: Full-Width Prominent Big Hero Image */}
              <div className="w-full aspect-[4/3.4] rounded-[28px] overflow-hidden bg-[#F2EDE4] shadow-[0_8px_24px_rgba(100,22,35,0.08)] border border-[#641623]/8">
                <img
                  src="/story/crochet_tile4.jpg"
                  alt="Authentic artisan craftswoman hands crocheting flower with golden hook"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Row 3: Circular Motif on Left + Rounded Square on Right */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full items-center">
                {/* Bottom-Left Circle Image */}
                <div className="aspect-square rounded-full overflow-hidden bg-[#F2EDE4] shadow-[0_4px_16px_rgba(100,22,35,0.06)] border border-[#641623]/8">
                  <img
                    src="/story/crochet_tile5.jpg"
                    alt="Handcrafted vertical crochet tulip bouquet"
                    className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                {/* Bottom-Right Rounded Square */}
                <div className="aspect-square rounded-[22px] overflow-hidden bg-[#F2EDE4] shadow-[0_4px_16px_rgba(100,22,35,0.06)] border border-[#641623]/8">
                  <img
                    src="/story/crochet_tile3.jpg"
                    alt="Sunflower bouquet on warm studio table"
                    className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Desktop Only): Full-Section 5-Tile Razor-Sharp Crochet Photo Grid */}
          <div className="hidden lg:flex lg:col-span-7 w-full justify-center lg:justify-end">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[620px] xl:max-w-[660px]">
              {/* Tile 1: Top-Left Square (Handmade Flower Clips Detail) */}
              <div className="aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#F2EDE4] shadow-sm">
                <img
                  src="/story/crochet_tile1.jpg"
                  alt="Handmade crochet flower hair clips detail"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Tile 2: Top-Center Square (Crochet Daisy Flower Pot) */}
              <div className="aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#F2EDE4] shadow-sm">
                <img
                  src="/story/crochet_tile2.jpg"
                  alt="Handmade crochet daisy potted plant"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Tile 3: Top-Right Square (Handmade Sunflower Bouquet) */}
              <div className="aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#F2EDE4] shadow-sm">
                <img
                  src="/story/crochet_tile3.jpg"
                  alt="Sunflower bouquet on warm studio table"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Tile 4: Bottom-Left Large Hero Square (Authentic Hands Crocheting Flower, Spans 2 Cols) */}
              <div className="col-span-2 aspect-square rounded-[22px] sm:rounded-[28px] overflow-hidden bg-[#F2EDE4] shadow-md">
                <img
                  src="/story/crochet_tile4.jpg"
                  alt="Authentic artisan craftswoman hands crocheting flower with golden hook"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Tile 5: Bottom-Right Vertical Capsule Stadium Pill (Summer Tulips Bouquet, Spans 1 Col) */}
              <div className="col-span-1 rounded-full overflow-hidden bg-[#F2EDE4] shadow-md h-full">
                <img
                  src="/story/crochet_tile5.jpg"
                  alt="Handcrafted vertical crochet tulip bouquet"
                  className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
