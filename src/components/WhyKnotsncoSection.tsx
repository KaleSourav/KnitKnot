/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Heart, Smile, Package, ShieldCheck, Flower2 } from 'lucide-react';

export function WhyKnotsncoSection() {
  const reasons = [
    {
      emoji: '🌸',
      tag: 'Everlasting',
      title: 'Flowers That Never Ghost You',
      desc: 'Real flowers wilt and end up in the bin within 72 hours. Knotsnco blooms stay vibrant, cheerful, and full of color year after year.',
      bg: '#F5C4D5', // Pastel Pink
      rotate: '-rotate-1',
    },
    {
      emoji: '🪡',
      tag: 'Hand-Crafted',
      title: 'Stitched By Dadis in Surat',
      desc: 'Zero automated factory molds. Every loop, petal, and stitch is hand-crocheted by grandmothers in Gujarat, sharing warmth with every creation.',
      bg: '#F5DD91', // Butter Yellow
      rotate: 'rotate-1',
    },
    {
      emoji: '☁️',
      tag: 'Soft Texture',
      title: 'Combed Milk Cotton Yarn',
      desc: 'We only source ultra-soft, hypoallergenic combed milk cotton yarn. Pill-resistant, durable, and so cozy to touch you won’t want to let go.',
      bg: '#C5E7D4', // Muted Mint
      rotate: '-rotate-2',
    },
    {
      emoji: '🎁',
      tag: 'Slow Gifting',
      title: 'Complimentary Handwritten Notes',
      desc: 'Every single parcel arrives with an artisan handwritten card, ribbon bow, and gift-ready luxury packaging to make unwrapping unforgettable.',
      bg: '#BBDDEB', // Powder Blue
      rotate: 'rotate-2',
    },
    {
      emoji: '🎨',
      tag: 'Custom Studio',
      title: 'Build Your Own Creation',
      desc: 'Want 3 tulips, 2 daisies, and a yellow ribbon? Our interactive Bouquet Studio lets you customize stems, wrapping, and personal sentiments.',
      bg: '#F4D2BB', // Soft Peach
      rotate: '-rotate-1',
    },
    {
      emoji: '✨',
      tag: 'Gen-Z Aesthetic',
      title: 'Pinterest-Worthy Room Decor',
      desc: 'Add immediate dopamine to your bedroom, study desk, or bookshelf. Designed to look effortlessly cute in every mirror selfie.',
      bg: '#FFF5CC', // Warm Cream
      rotate: 'rotate-1',
    },
  ];

  return (
    <section className="w-full bg-[#FFF5CC] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#811B2B]/15 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#811B2B]/10 text-[#811B2B] text-xs font-bold mb-3 font-rounded">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE KNOTSNCO PROMISE</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#811B2B] tracking-tight">
            Why You'll Fall In Love.
          </h2>
          <p className="mt-2 text-[#811B2B]/80 font-handwriting text-2xl">
            the little details that make all the difference ♡
          </p>
        </div>

        {/* Playful Scrapbook Cards Grid (Ref 1 & Ref 4 style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-7 border-2 border-[#811B2B] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:rotate-0 flex flex-col justify-between ${item.rotate}`}
              style={{ backgroundColor: item.bg }}
            >
              <div>
                {/* Top Badge & Emoji Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl select-none">{item.emoji}</span>
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#811B2B] bg-white/70 px-2.5 py-1 rounded-full border border-[#811B2B]/15">
                    {item.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-editorial text-xl sm:text-2xl font-extrabold text-[#811B2B] leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-xs sm:text-sm text-[#811B2B]/85 font-rounded leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Scrapbook Accent */}
              <div className="mt-5 pt-3 border-t border-[#811B2B]/15 flex items-center justify-between">
                <span className="font-handwriting text-base text-[#811B2B] font-bold">
                  knotsnco original ✿
                </span>
                <span className="text-xs font-bold text-[#811B2B]">
                  0{idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

