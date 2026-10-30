/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Instagram, Heart, Sparkles, ExternalLink } from 'lucide-react';

export function SocialScrapbook() {
  const polaroids = [
    {
      image: '/bloom/hero-sky-bouquet.jpg',
      caption: 'anniversary morning surprise 💐',
      author: '@ananya.reads',
      likes: '4.2k',
      rotate: '-rotate-3',
      tapeColor: '#F5C4D5',
    },
    {
      image: '/products/bunny.jpg',
      caption: 'pocket pal turtle guarding my tote ✨',
      author: '@tanya_crafts',
      likes: '2.8k',
      rotate: 'rotate-2',
      tapeColor: '#F5DD91',
    },
    {
      image: '/bloom/bouquet-summer-tulips.jpg',
      caption: 'desk blooms that never wilt on me 🪴',
      author: '@shreya.space',
      likes: '3.9k',
      rotate: '-rotate-1',
      tapeColor: '#C5E7D4',
    },
    {
      image: '/products/tote.jpg',
      caption: 'sunday farmer market daisy tote bag 🥐',
      author: '@diyalovescrochet',
      likes: '5.1k',
      rotate: 'rotate-3',
      tapeColor: '#BBDDEB',
    },
  ];

  return (
    <section className="w-full bg-[#FFF5CC] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#811B2B]/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#811B2B]/10 text-[#811B2B] text-xs font-bold mb-3 font-rounded">
              <Instagram className="w-3.5 h-3.5" />
              <span>COMMUNITY SCRAPBOOK</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#811B2B] tracking-tight">
              Tagged In The Wild.
            </h2>
            <p className="mt-2 text-[#811B2B]/80 font-handwriting text-2xl">
              share your handmade moments with #knotsnco ♡
            </p>
          </div>

          <a
            href="https://instagram.com/knotsnco"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start md:self-end flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] text-xs font-bold tracking-wider uppercase transition-all shadow-md group"
          >
            <Instagram className="w-4 h-4" />
            <span>FOLLOW @KNOTSNCO</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Scrapbook Polaroids Grid (Ref 1 & Ref 4 style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8">
          {polaroids.map((item, idx) => (
            <div
              key={idx}
              className={`relative bg-[#FFFEF8] p-3.5 rounded-2xl border-2 border-[#811B2B] shadow-xl hover:shadow-2xl transition-all duration-300 hover:rotate-0 hover:-translate-y-2 group cursor-pointer ${item.rotate}`}
            >
              {/* Washi tape on top */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded text-[10px] font-bold font-handwriting text-[#811B2B] border border-[#811B2B]/20 shadow-xs z-10"
                style={{ backgroundColor: item.tapeColor }}
              >
                pin #{idx + 1}
              </div>

              {/* Photo */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FFF5CC] border border-[#811B2B]/15 mb-3 shadow-inner">
                <img
                  src={item.image}
                  alt={item.caption}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Likes badge */}
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-red-400 text-red-400" />
                  <span>{item.likes}</span>
                </div>
              </div>

              {/* Polaroid Handwritten Caption */}
              <p className="font-handwriting text-lg text-[#811B2B] font-bold leading-tight">
                "{item.caption}"
              </p>
              <p className="text-[11px] text-[#811B2B]/70 font-rounded mt-1">
                posted by {item.author}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

