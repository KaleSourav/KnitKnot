import React from 'react';

interface OurStorySectionProps {
  onStoryClick?: () => void;
}

export const OurStorySection: React.FC<OurStorySectionProps> = ({ onStoryClick }) => {
  return (
    <section className="w-full bg-[#FAF4ED] pt-6 sm:pt-10 pb-16 sm:pb-24 lg:pb-28 text-[#2D2424] overflow-hidden font-['Fredoka']">
      {/* Full-Screen Section Coverage Container */}
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
