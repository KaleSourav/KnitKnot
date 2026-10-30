/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Heart, Sparkles, Flower2, Award, Users, Check } from 'lucide-react';

interface AboutUsPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export function AboutUsPage({ onNavigate }: AboutUsPageProps) {
  return (
    <div className="w-full bg-[#FFF5CC] min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs font-bold text-[#811B2B] font-rounded">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:underline text-[#811B2B]/75 hover:text-[#811B2B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-[#811B2B] font-extrabold">Our Story & The Dadis</span>
        </div>

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#811B2B]/10 text-[#811B2B] text-xs font-bold mb-4 font-rounded">
            <Heart className="w-3.5 h-3.5 fill-[#811B2B]" />
            <span>SLOW CRAFT & WOMEN ARTISANS</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl font-black text-[#811B2B] tracking-tight leading-[1.08]">
            Made By Hands That Know What Love Looks Like.
          </h1>

          <p className="mt-3 text-[#811B2B]/85 font-handwriting text-2xl sm:text-3xl font-bold">
            the story of Knotsnco and our beloved Dadis in Surat ✿
          </p>
        </div>

        {/* Story Section 1: The Spark */}
        <div className="bg-[#FFFEF8] p-8 sm:p-12 rounded-3xl border-2 border-[#811B2B] shadow-xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <span className="text-xs font-bold text-[#811B2B]/70 tracking-widest uppercase font-rounded">
                Chapter 01
              </span>
              <h2 className="font-editorial text-2xl sm:text-4xl font-extrabold text-[#811B2B] mt-1 mb-4">
                Why Should Flowers Ever Die?
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-[#811B2B]/85 font-rounded leading-relaxed">
                <p>
                  Think of the last time you bought someone fresh flowers. You picked a stunning bunch, wrapped it up, gave it with a full heart... and three days later, it drooped into brown compost.
                </p>
                <p>
                  We asked: <em>Why should a symbol of love be disposable?</em>
                </p>
                <p>
                  Knotsnco started with a simple belief: <strong>Everlasting blooms that never ghost you.</strong> Flowers that stay vibrant on your study desk through exams, heartbreak, new jobs, and cozy Sunday mornings for years to come.
                </p>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-[#811B2B] shadow-md bg-[#FFF5CC]">
                <img
                  src="/bloom/hero-sky-bouquet.jpg"
                  alt="Knotsnco Everlasting Bouquet"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Story Section 2: The Surat Artisan Cooperative */}
        <div className="bg-[#F5C4D5] p-8 sm:p-12 rounded-3xl border-2 border-[#811B2B] shadow-xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="rounded-2xl overflow-hidden border-2 border-[#811B2B] shadow-md bg-white">
                <img
                  src="/products/byob.jpg"
                  alt="Dadi crocheting in Surat"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-7 order-1 md:order-2">
              <span className="text-xs font-bold text-[#811B2B]/70 tracking-widest uppercase font-rounded">
                Chapter 02
              </span>
              <h2 className="font-editorial text-2xl sm:text-4xl font-extrabold text-[#811B2B] mt-1 mb-4">
                Our Dadis in Surat
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-[#811B2B]/85 font-rounded leading-relaxed">
                <p>
                  In the textile heart of Surat, Gujarat, we gathered talented senior women — mothers and grandmothers who learned needlework decades ago.
                </p>
                <p>
                  Instead of isolating, routine retirement, these women now lead their own artisan circle. They gather together in sunlit rooms, drink ginger chai, tell folklore stories, and crochet each petal stitch by stitch.
                </p>
                <p>
                  Every purchase directly funds dignified fair wages, healthcare support, and creative independence for our grandmothers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-3xl bg-[#FFFEF8] border-2 border-[#811B2B] shadow-md">
            <span className="text-3xl">🪡</span>
            <h3 className="font-editorial text-xl font-bold text-[#811B2B] mt-3">
              100% Cotton & Slow Fashion
            </h3>
            <p className="text-xs text-[#811B2B]/80 font-rounded mt-1 leading-relaxed">
              We never use synthetic polyester yarn. Combed milk-cotton creates soft, durable petals that won't fray or shed plastic microfibers.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFFEF8] border-2 border-[#811B2B] shadow-md">
            <span className="text-3xl">💌</span>
            <h3 className="font-editorial text-xl font-bold text-[#811B2B] mt-3">
              Personalized With Extra Heart
            </h3>
            <p className="text-xs text-[#811B2B]/80 font-rounded mt-1 leading-relaxed">
              Every parcel leaves Surat with an artisan handwritten card, ribbon wrapping, and scented memory papers ready for gifting.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#811B2B] text-[#FFF5CC] p-8 sm:p-12 rounded-3xl shadow-2xl">
          <h2 className="font-editorial text-2xl sm:text-4xl font-extrabold mb-2">
            Bring A Little Dadi Love Home.
          </h2>
          <p className="font-handwriting text-2xl text-[#F5DD91] mb-6">
            explore our handmade bouquets, bags, charms, and flower pots ♡
          </p>
          <button
            onClick={() => onNavigate('shop-all')}
            className="px-8 py-3.5 rounded-full bg-[#FFF5CC] hover:bg-white text-[#811B2B] font-bold text-xs tracking-wider uppercase transition-all shadow-md"
          >
            Explore 252 Handmade Creations →
          </button>
        </div>

      </div>
    </div>
  );
}
