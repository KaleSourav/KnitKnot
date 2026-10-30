/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long do Knotsnco crochet flowers last?',
      a: 'They last practically forever! Because they are hand-crocheted using combed milk-cotton yarn with reinforced interior wire stems, they never wilt, discolor, or die. You can dust them gently with a dry microfiber cloth or soft brush.',
    },
    {
      q: 'Can I request a custom color palette or flower combination?',
      a: 'Yes, absolutely! You can use our interactive "Build Your Own Bouquet" studio on this website to choose stems, wrapping papers, and ribbon colors. For wedding bouquets, corporate gifting, or special amigurumi characters, contact us on WhatsApp!',
    },
    {
      q: 'How long does shipping take across India?',
      a: 'Standard orders dispatch from our Surat atelier within 24–48 hours and arrive in 3–5 business days depending on your city. Custom bespoke bouquets take 3–5 days to handcraft before shipping.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'Yes! We ship worldwide. International delivery typically takes 8–12 business days via tracked express courier.',
    },
    {
      q: 'What is your return policy?',
      a: 'We want you to adore your purchase! If any item arrives damaged during transit, notify us within 48 hours with a photo and we will happily replace it free of charge.',
    },
  ];

  return (
    <section className="w-full bg-[#FFF5CC] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#811B2B]/15">
      <div className="max-w-4xl mx-auto bg-[#FFFEF8] p-6 sm:p-10 rounded-3xl border-2 border-[#811B2B] shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#811B2B]/10 text-[#811B2B] text-xs font-bold mb-2 font-rounded">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KNOTSNCO CARE GUIDE</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-4xl font-extrabold text-[#811B2B]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#811B2B]/75 font-handwriting text-xl mt-1">
            everything you need to know about our handmade bouquets ♡
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#811B2B]/20 bg-[#FFF5CC]/30 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-editorial text-base sm:text-lg font-bold text-[#811B2B]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-[#811B2B]/85 font-rounded leading-relaxed border-t border-[#811B2B]/10 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
