/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Craft & Quality',
    question: 'How long do Knitknot crochet flowers actually last?',
    answer: 'Forever! Unlike fresh cut flowers that wilt, brown, and get thrown away in 4 days, our hand-crocheted blooms are crafted with premium combed milk cotton yarn and flexible wire stems. They require zero water, zero sunlight, and will look just as vibrant 10 years from today.',
  },
  {
    id: 'faq-2',
    category: 'Artisans & Handcraft',
    question: 'Are all pieces genuinely 100% handmade?',
    answer: 'Every single petal, leaf, stitch, and wooden button is hand-hooked by our community of 45+ skilled women artisans in Surat, Gujarat. We never use automated knitting machines. When you purchase from Knitknot, you directly support ethical artisan livelihoods and fair wages.',
  },
  {
    id: 'faq-3',
    category: 'Care & Washing',
    question: 'How do I clean and care for my crochet items?',
    answer: 'For bouquets and desk flowers, simply dust gently with a soft makeup brush or a hair dryer on the cool/low setting. For plushies, totes, and wearables, spot clean with a damp cloth and mild soap, or hand wash gently in cold water and air-dry flat.',
  },
  {
    id: 'faq-4',
    category: 'Shipping & Delivery',
    question: 'How fast is delivery across India?',
    answer: 'Ready-to-ship pieces dispatch within 24–48 hours from our Surat studio. Express courier delivery takes 2–4 business days to metros (Mumbai, Delhi, Bangalore, Hyderabad, Pune) and 4–6 days to other regional pin codes with live tracking sent via SMS and WhatsApp.',
  },
  {
    id: 'faq-5',
    category: 'Custom Orders',
    question: 'Can I request a custom color theme or personalized bouquet?',
    answer: 'Yes, we love custom orders! Whether you need a pastel lilac wedding bouquet, personalized anniversary flowers, or custom bag charms for bridal party gifts, tap the WhatsApp button below to speak directly with our design artisan.',
  },
  {
    id: 'faq-6',
    category: 'Payments & COD',
    question: 'Is Cash on Delivery (COD) available?',
    answer: 'Yes! Cash on Delivery is available across 18,000+ Indian postal codes. We also accept instant UPI (Google Pay, PhonePe, Paytm), credit/debit cards, and NetBanking with secure 256-bit encryption.',
  },
];

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <section 
      id="faq-section"
      className="w-full bg-transparent py-14 sm:py-20 px-3.5 sm:px-6 lg:px-8 border-t border-[#841724]/10 select-none overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#841724]/10 border border-[#841724]/20 text-[#841724] font-bold text-xs uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#841724]" />
            <span>Everything You Need To Know</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#2b0b12] tracking-tight font-serif">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#7c5c62] mt-2.5">
            Got questions about yarn quality, shipping times, or caring for your forever flowers? We've got you covered.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-3.5 sm:gap-4 mb-12">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#faf4e8] border-[#841724]/30 shadow-md ring-1 ring-[#841724]/20'
                    : 'bg-[#faf4e8]/80 hover:bg-[#faf4e8] border-[#841724]/15'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between text-left gap-4"
                >
                  <span className="font-bold text-sm sm:text-base text-[#2b0b12] leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#841724] text-[#faedd3] rotate-180'
                        : 'bg-[#faedd3] text-[#841724]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-[#5c3e44] leading-relaxed border-t border-[#841724]/10 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reassurance Feature Bar (Phoolwali / Mindori Reference) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-[#faf4e8] border border-[#841724]/15 flex items-center gap-3">
            <Truck className="w-6 h-6 text-[#841724] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#2b0b12]">Free Express Shipping</p>
              <p className="text-[10px] text-[#7c5c62]">On all orders above ₹499</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf4e8] border border-[#841724]/15 flex items-center gap-3">
            <Heart className="w-6 h-6 text-[#841724] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#2b0b12]">Supporting Artisans</p>
              <p className="text-[10px] text-[#7c5c62]">45+ rural women empowered</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf4e8] border border-[#841724]/15 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#841724] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#2b0b12]">100% Combed Cotton</p>
              <p className="text-[10px] text-[#7c5c62]">Soft, durable & non-toxic</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf4e8] border border-[#841724]/15 flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-[#841724] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#2b0b12]">Never Wilt Guarantee</p>
              <p className="text-[10px] text-[#7c5c62]">Keepsakes that last years</p>
            </div>
          </div>
        </div>

        {/* Custom Order Callout Card */}
        <div className="rounded-3xl bg-[#841724] text-[#faedd3] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold mb-2 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Looking For Something Specific?</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif">
              Have a Dream Crochet Idea in Mind?
            </h3>
            <p className="text-xs sm:text-sm text-rose-100/90 mt-1 max-w-md">
              We make bespoke wedding bouquets, personalized name charms, and color-matched plushies. Chat with our artisan coordinator directly!
            </p>
          </div>

          <a
            href="https://wa.me/919999999999?text=Hi%20Knitknot!%20I%20would%20like%20to%20customize%20a%20crochet%20order."
            target="_blank"
            rel="noreferrer"
            className="relative z-10 shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#faedd3] text-[#841724] text-xs sm:text-sm font-extrabold shadow-lg hover:bg-white hover:scale-105 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat On WhatsApp</span>
          </a>

          {/* Decorative subtle circles in background */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        </div>

      </div>
    </section>
  );
};
