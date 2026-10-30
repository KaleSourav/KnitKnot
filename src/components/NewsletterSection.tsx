/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Check, ArrowRight, Sparkles, Heart } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
  };

  return (
    <section className="w-full bg-[#FFF5CC] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#811B2B]/15 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Newsletter Card with Scalloped Top/Bottom or Pastel Background */}
        <div className="rounded-3xl bg-[#F5C4D5] border-2 border-[#811B2B] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          
          {/* Decorative Corner Stamps */}
          <div className="absolute top-4 left-6 hidden sm:block text-2xl select-none -rotate-12">
            💌
          </div>
          <div className="absolute bottom-4 right-6 hidden sm:block text-2xl select-none rotate-12">
            🌸
          </div>

          <div className="max-w-xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-[#811B2B] text-[#FFF5CC] text-[11px] font-bold tracking-wider uppercase mb-4 shadow-sm">
              The Knotsnco Club
            </span>

            <h2 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#811B2B] tracking-tight">
              Stay in the Loop.
            </h2>

            <p className="mt-2 text-[#811B2B]/85 font-handwriting text-2xl">
              Little updates, new drops, and lots of handmade happiness ♡
            </p>

            <p className="mt-2 text-xs sm:text-sm text-[#811B2B]/80 font-rounded">
              Join 15,000+ crochet lovers. Get <strong>10% off your first handmade bouquet</strong> + early access to limited seasonal drops.
            </p>

            {/* Email Form */}
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                <div className="relative w-full">
                  <Mail className="w-4 h-4 text-[#811B2B]/60 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-full border-2 border-[#811B2B] bg-[#FFFEF8] text-[#811B2B] placeholder-[#811B2B]/50 text-xs sm:text-sm font-rounded font-semibold focus:outline-none focus:ring-2 focus:ring-[#811B2B] shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all shrink-0 flex items-center justify-center gap-2"
                >
                  <span>JOIN CLUB</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="mt-6 p-4 rounded-2xl bg-[#FFFEF8] border-2 border-[#811B2B] inline-block animate-in fade-in duration-300">
                <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>You're in! Use code <strong className="font-editorial text-base text-[#811B2B]">HAPPINESS10</strong> for 10% off.</span>
                </div>
              </div>
            )}

            <p className="mt-3 text-[10px] text-[#811B2B]/60 font-rounded">
              Zero spam. Only sweet handmade updates & Dadi craft stories. Unsubscribe anytime.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
