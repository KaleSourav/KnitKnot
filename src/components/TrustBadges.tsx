import React from 'react';

export const TrustBadges: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF4ED] pt-2 pb-8 sm:pt-4 sm:pb-12 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
        {/* Cloud-shaped Trust Badges & Stitched Ribbon Bow */}
        <div className="w-full max-w-3xl select-none transition-transform duration-300 hover:scale-[1.01]">
          <img
            src="/trust-badges-transparent.png"
            alt="Knotsnco Promises: Handmade with love, Made by dadis in Surat, Sustainable yarn & materials, Perfect for gifting"
            className="w-full h-auto object-contain mx-auto drop-shadow-[0_2px_12px_rgba(100,22,35,0.03)]"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
};
