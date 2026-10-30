/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Sparkles, Flower2, Award } from 'lucide-react';

interface DadiStorySectionProps {
  onReadMore?: () => void;
}

export function DadiStorySection({ onReadMore }: DadiStorySectionProps) {
  return (
    <section className="w-full bg-[#FFF5CC] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#811B2B]/15 relative overflow-hidden">
      
      {/* Decorative Washi Tape & Stamp */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT: Scrapbook Photographic Collage (6 Cols) */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Background Pastel Block */}
            <div className="w-full max-w-lg aspect-[4/3] rounded-3xl bg-[#F5C4D5] border-2 border-[#811B2B] shadow-2xl relative p-4 sm:p-6 rotate-1">
              
              {/* Polaroid 1: Authentic Handcrafting */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white border border-[#811B2B]/20 shadow-inner">
                <img
                  src="/products/byob.jpg"
                  alt="Dadi Handcrafting Crochet Flowers in Surat"
                  className="w-full h-full object-cover"
                />
                
                {/* Polaroid Bottom Caption */}
                <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm p-3 border-t border-[#811B2B]/15 flex items-center justify-between">
                  <div>
                    <p className="font-handwriting text-lg text-[#811B2B] font-bold">
                      Surat Artisan Circle, Gujarat
                    </p>
                    <p className="text-[10px] text-[#811B2B]/70 font-rounded">
                      Every single knot tied with patience and joy
                    </p>
                  </div>
                  <span className="text-xl">🪡</span>
                </div>
              </div>

              {/* Floating Mini Polaroid Stamp: Combed Cotton Spools */}
              <div className="absolute -bottom-6 -right-4 sm:-right-8 w-36 sm:w-44 bg-[#FFFEF8] p-2.5 rounded-2xl border-2 border-[#811B2B] shadow-2xl -rotate-6 hidden sm:block">
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#FFF5CC] mb-1.5 border border-[#811B2B]/15">
                  <img
                    src="/bloom/bouquet-pink-dawn.jpg"
                    alt="Soft Combed Milk Cotton Yarn"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-handwriting text-xs text-[#811B2B] font-bold text-center">
                  100% Milk Cotton Yarn ♡
                </p>
              </div>

              {/* Top Washi Tape */}
              <div className="absolute -top-3.5 left-1/4 bg-[#F5DD91] text-[#811B2B] px-4 py-0.5 text-xs font-bold font-handwriting rounded shadow-sm -rotate-2 border border-[#811B2B]/30">
                Stitched with Dadi's Blessing ✨
              </div>

            </div>

          </div>

          {/* RIGHT: Emotional Narrative & Values (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col items-start">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#811B2B]/10 text-[#811B2B] text-xs font-bold mb-4 font-rounded">
              <Heart className="w-3.5 h-3.5 fill-[#811B2B]" />
              <span>THE SOUL OF KNOTSNCO</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#811B2B] tracking-tight leading-[1.12]">
              Made By Hands That Know What Love Looks Like.
            </h2>

            <p className="font-handwriting text-2xl text-[#811B2B] font-bold mt-3">
              meet the grandmothers of Surat behind every bloom ✿
            </p>

            <div className="mt-5 space-y-4 text-sm sm:text-base text-[#811B2B]/85 font-rounded leading-relaxed">
              <p>
                In a world full of mass-produced plastic and wilted flowers that end up in trash cans three days later,
                Knotsnco was born with a gentle rebellion: <strong>things made slowly, by hand, meant to stay forever.</strong>
              </p>
              <p>
                Every single petal, amigurumi turtle, and granny square tote is hand-crocheted by our beloved Dadis in Surat.
                For them, crochet isn’t an automated assembly line — it’s an art form passed down generations, woven with stories, laughter, and an abundance of blessings.
              </p>
              <p>
                When you hold a Knotsnco flower, you hold hours of someone’s dedicated care. That’s why our blooms never ghost you — they stay bright, soft, and comforting for years.
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <div className="p-3.5 rounded-2xl bg-[#FFFEF8] border border-[#811B2B]/20">
                <p className="font-editorial text-xl font-bold text-[#811B2B]">0% Waste</p>
                <p className="text-[11px] text-[#811B2B]/70 font-rounded mt-1">Slow fashion with zero excess landfill fabric</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFFEF8] border border-[#811B2B]/20">
                <p className="font-editorial text-xl font-bold text-[#811B2B]">Fair Pay</p>
                <p className="text-[11px] text-[#811B2B]/70 font-rounded mt-1">Dignified artisan livelihood for senior women</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFFEF8] border border-[#811B2B]/20">
                <p className="font-editorial text-xl font-bold text-[#811B2B]">Everlasting</p>
                <p className="text-[11px] text-[#811B2B]/70 font-rounded mt-1">Gifts that will still look gorgeous in 2030</p>
              </div>
            </div>

            {onReadMore && (
              <button
                onClick={onReadMore}
                className="mt-7 px-6 py-3 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-lg"
              >
                Read The Full Dadi Story →
              </button>
            )}

          </div>

        </div>
      </div>

    </section>
  );
}
