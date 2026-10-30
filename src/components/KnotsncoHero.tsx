/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, ArrowRight, Flower2, ShieldCheck, Smile } from 'lucide-react';
import { Product } from '../data/products';

interface KnotsncoHeroProps {
  onExplore: () => void;
  onMakeBouquet: () => void;
  onQuickView: (product: Product) => void;
  featuredProduct?: Product;
}

export function KnotsncoHero({
  onExplore,
  onMakeBouquet,
  onQuickView,
  featuredProduct,
}: KnotsncoHeroProps) {
  return (
    <section className="relative w-full bg-[#FFF5CC] pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden border-b border-[#811B2B]/15">
      
      {/* Decorative Wavy / Scalloped Accent Background Shapes */}
      <div className="absolute top-12 left-10 w-64 h-64 rounded-full bg-[#F5C4D5]/35 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#F5DD91]/35 blur-3xl pointer-events-none" />

      {/* Retro Doodles & Floating Stickers */}
      <div className="absolute top-8 right-16 hidden lg:block select-none pointer-events-none">
        <div className="washi-tape bg-[#F4D2BB] text-[#811B2B] px-3.5 py-1.5 rounded-sm shadow-sm rotate-6 border border-[#811B2B]/20 text-xs font-bold font-handwriting text-lg">
          Zero wilting. Forever cute ✿
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Editorial Typography & Brand Pitch (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Pill Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#811B2B]/10 border border-[#811B2B]/20 text-[#811B2B] text-xs font-bold mb-4 font-rounded">
              <span className="text-sm">🌸</span>
              <span>Handcrafted by Dadis in Surat, India</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#811B2B]" />
              <span className="text-[#811B2B]/80">Slow Gifting</span>
            </div>

            {/* Main Editorial Heading */}
            <h1 className="font-editorial text-4xl sm:text-6xl xl:text-7xl font-extrabold text-[#811B2B] leading-[1.08] tracking-tight">
              Little Things.{' '}
              <span className="block font-handwriting text-[#811B2B] font-bold text-5xl sm:text-7xl xl:text-8xl mt-1 -rotate-1">
                Made With Lots Of Love.
              </span>
            </h1>

            {/* Supporting Pitch */}
            <p className="mt-5 text-base sm:text-lg text-[#811B2B]/85 max-w-xl font-rounded font-medium leading-relaxed">
              Handcrafted crochet treasures, made to make your everyday a little more special.
              From everlasting bouquets that never ghost you to pocket-sized amigurumi companions.
            </p>

            {/* Handwritten note with cute arrow */}
            <div className="mt-3 flex items-center gap-2 text-[#811B2B]/80 font-handwriting text-2xl font-bold">
              <span>made stitch by stitch with combed cotton yarn</span>
              <span className="text-xl">♡</span>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
              {/* Primary CTA */}
              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] font-bold text-sm tracking-wider uppercase shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
              >
                <span>EXPLORE THE COLLECTION</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Secondary CTA: Build Bouquet */}
              <button
                onClick={onMakeBouquet}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#F5DD91] hover:bg-[#ebd07a] text-[#811B2B] font-extrabold text-sm tracking-wider uppercase border-2 border-[#811B2B] shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Flower2 className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                <span>MAKE YOUR OWN BOUQUET</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 pt-6 border-t border-[#811B2B]/15 grid grid-cols-3 gap-4 w-full max-w-lg text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F5C4D5] text-[#811B2B] flex items-center justify-center font-bold text-xs shrink-0">
                  ✿
                </div>
                <div>
                  <p className="text-xs font-bold text-[#811B2B]">Never Wilts</p>
                  <p className="text-[10px] text-[#811B2B]/70 font-rounded">Forever blooms</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#C5E7D4] text-[#811B2B] flex items-center justify-center font-bold text-xs shrink-0">
                  🪡
                </div>
                <div>
                  <p className="text-xs font-bold text-[#811B2B]">100% Cotton</p>
                  <p className="text-[10px] text-[#811B2B]/70 font-rounded">Super soft yarn</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#BBDDEB] text-[#811B2B] flex items-center justify-center font-bold text-xs shrink-0">
                  ♡
                </div>
                <div>
                  <p className="text-xs font-bold text-[#811B2B]">Dadi Made</p>
                  <p className="text-[10px] text-[#811B2B]/70 font-rounded">Surat artisans</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Asymmetrical Editorial Collage with Real Crochet Photography (5 Cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Main Central Product Feature Card (Scalloped Frame) */}
            <div className="relative w-full max-w-md bg-[#FFFEF8] p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-[#811B2B] rotate-1 hover:rotate-0 transition-transform duration-500">
              
              {/* Top Washi Tape Decoration */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F5C4D5] text-[#811B2B] px-4 py-0.5 text-[11px] font-bold font-handwriting tracking-wider rounded shadow-sm rotate-1 border border-[#811B2B]/30">
                Signature Pink Melody Bouquet
              </div>

              {/* Main Photo */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FFF5CC] border border-[#811B2B]/10">
                <img
                  src="/bloom/hero-sky-bouquet.jpg"
                  alt="Knotsnco Signature Handmade Crochet Bouquet"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Price Pill */}
                <div className="absolute bottom-3 left-3 bg-[#811B2B] text-[#FFF5CC] px-3.5 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5">
                  <span>₹1,499</span>
                  <span className="text-[10px] opacity-75 line-through">₹1,899</span>
                  <span className="text-[10px] bg-[#F5DD91] text-[#811B2B] px-1.5 py-0.2 rounded-full font-extrabold">SAVE 21%</span>
                </div>

                {/* Badge top-right */}
                <div className="absolute top-3 right-3 bg-[#FFF5CC] text-[#811B2B] border border-[#811B2B] text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                  ★ 4.9 (120+ Loves)
                </div>
              </div>

              {/* Caption Under Card */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#811B2B]">
                    Everlasting Pastel Bloom
                  </h3>
                  <p className="text-xs text-[#811B2B]/70 font-rounded">
                    Hand-stitched roses, tulips & daisies
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (featuredProduct) onQuickView(featuredProduct);
                    else onExplore();
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#811B2B]/10 hover:bg-[#811B2B] text-[#811B2B] hover:text-[#FFF5CC] text-xs font-bold transition-all"
                >
                  Quick View
                </button>
              </div>

            </div>

            {/* Floating Satellite 1: Adorable Fruit Turtle Keychain (Top-Left) */}
            <div className="absolute -top-6 -left-6 sm:-left-10 w-28 sm:w-32 bg-[#F5DD91] p-2.5 rounded-2xl border-2 border-[#811B2B] shadow-xl -rotate-6 animate-float hidden sm:block">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-white mb-1.5 border border-[#811B2B]/15">
                <img
                  src="/products/bunny.jpg"
                  alt="Crochet Turtle Keychain"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] font-bold text-[#811B2B] truncate text-center">
                Pocket Pal Turtle
              </p>
              <p className="text-[10px] text-[#811B2B]/80 font-bold text-center">
                ₹349
              </p>
            </div>

            {/* Floating Satellite 2: Daisy Granny Square Tote (Bottom-Right) */}
            <div className="absolute -bottom-6 -right-4 sm:-right-8 w-32 sm:w-36 bg-[#C5E7D4] p-2.5 rounded-2xl border-2 border-[#811B2B] shadow-xl rotate-6 animate-float-alt hidden sm:block">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-white mb-1.5 border border-[#811B2B]/15">
                <img
                  src="/products/tote.jpg"
                  alt="Daisy Crochet Tote Bag"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] font-bold text-[#811B2B] truncate text-center">
                Floral Daisy Tote
              </p>
              <p className="text-[10px] text-[#811B2B]/80 font-bold text-center">
                ₹1,299
              </p>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
