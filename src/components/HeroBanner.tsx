import React from 'react';

interface HeroBannerProps {
  onShopClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopClick }) => {
  return (
    <section className="relative w-full bg-[#FAF4ED] overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-0 sm:px-4 lg:px-6 pt-2 sm:pt-3 pb-8">
        {/* Banner Container with subtle rounded aesthetic on desktop */}
        <div className="relative w-full overflow-hidden sm:rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgba(100,22,35,0.06)] bg-[#F8EFE4]">
          {/* Main Hero Image */}
          <img
            src="/hero-banner.png"
            alt="Handmade Crochet Bouquet - gifts that last forever"
            className="w-full h-auto object-cover select-none block"
            loading="eager"
            fetchPriority="high"
          />

          {/* Interactive Clickable Hotspot on 'shop the collection ->' Button */}
          <a
            href="#products"
            onClick={(e) => {
              if (onShopClick) {
                e.preventDefault();
                onShopClick();
              }
            }}
            className="absolute z-10 cursor-pointer rounded-full transition-all duration-200 group focus:outline-none focus:ring-4 focus:ring-[#641623]/30"
            style={{
              left: '11.5%',
              top: '63.5%',
              width: '29.2%',
              height: '9.2%',
            }}
            title="Shop the collection"
            aria-label="Shop the collection"
          >
            {/* Subtle glow / hover outline highlight to indicate interactivity */}
            <span className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/50 group-hover:bg-white/10 transition-all duration-200" />
            <span className="sr-only">shop the collection</span>
          </a>
        </div>
      </div>
    </section>
  );
};
