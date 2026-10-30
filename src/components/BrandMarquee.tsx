/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BrandMarqueeProps {
  variant?: 'burgundy' | 'cream';
}

export function BrandMarquee({ variant = 'burgundy' }: BrandMarqueeProps) {
  const isBurgundy = variant === 'burgundy';

  const marqueePhrases = [
    'MADE BY HAND',
    'MADE WITH LOVE',
    'NEVER MASS PRODUCED',
    'FLOWERS THAT NEVER GHOST YOU',
    'A LITTLE PIECE OF HAPPINESS',
    'STITCHED BY DADIS IN SURAT',
    'EVERLASTING CROCHET ART',
    'SLOW FASHION & SUSTAINABLE CRAFT',
  ];

  return (
    <div
      className={`w-full py-3.5 overflow-hidden select-none border-y relative ${
        isBurgundy
          ? 'bg-[#811B2B] text-[#FFF5CC] border-[#5C0F19]'
          : 'bg-[#FFF5CC] text-[#811B2B] border-[#811B2B]/20'
      }`}
    >
      {/* Decorative side fades */}
      <div className="absolute top-0 bottom-0 left-0 w-12 z-10 pointer-events-none bg-gradient-to-r from-[#811B2B] to-transparent" />
      <div className="absolute top-0 bottom-0 right-0 w-12 z-10 pointer-events-none bg-gradient-to-l from-[#811B2B] to-transparent" />

      <div className="animate-marquee-rtl flex items-center whitespace-nowrap">
        {/* Render twice for continuous loop */}
        {[...marqueePhrases, ...marqueePhrases].map((phrase, i) => (
          <div key={i} className="flex items-center mx-5 sm:mx-8">
            <span className="font-editorial text-sm sm:text-base font-bold tracking-widest uppercase">
              {phrase}
            </span>
            <span className="ml-5 sm:ml-8 text-[#F5DD91] text-lg select-none">
              ✿
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
