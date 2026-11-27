import React, { useState, useRef } from 'react';
import { ChevronDown, ArrowRight, Mail, Instagram } from 'lucide-react';
import { FAQ_CATEGORIES, FAQ_CONTACT, FAQ_HEADER } from '../data/faqData';

interface FaqSectionProps {
  onViewAllFaq: () => void;
  onNavigatePolicy?: (tab: 'returns' | 'shipping') => void;
  onNavigateB2B?: () => void;
  onNavigateShop?: (category?: string) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onViewAllFaq,
  onNavigatePolicy,
  onNavigateB2B,
  onNavigateShop,
}) => {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [openId, setOpenId] = useState<string | null>(FAQ_CATEGORIES[0].items[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const currentCategory = FAQ_CATEGORIES[activeCategoryIdx];

  const handleCategoryChange = (idx: number) => {
    setActiveCategoryIdx(idx);
    setOpenId(FAQ_CATEGORIES[idx].items[0]?.id ?? null);
    tabRefs.current[idx]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const count = FAQ_CATEGORIES.length;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (activeCategoryIdx + 1) % count;
    else if (e.key === 'ArrowLeft') next = (activeCategoryIdx - 1 + count) % count;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = count - 1;

    if (next !== null) {
      e.preventDefault();
      handleCategoryChange(next);
      tabRefs.current[next]?.focus();
    }
  };

  const handleLinkTarget = (target: 'returns' | 'shipping' | 'b2b' | 'shop') => {
    if (target === 'returns') onNavigatePolicy?.('returns');
    else if (target === 'shipping') onNavigatePolicy?.('shipping');
    else if (target === 'b2b') onNavigateB2B?.();
    else if (target === 'shop') onNavigateShop?.('all');
  };

  return (
    <section
      id="section-faq"
      aria-labelledby="home-faq-heading"
      className="w-full bg-[#FBF8CF] pt-6 pb-16 sm:pt-12 sm:pb-24 px-4 sm:px-6 lg:px-8 font-['Fredoka']"
    >
      <div className="max-w-5xl mx-auto">
        {/* Top Dashed Stitch Separator matching Knots & Co. storefront */}
        <div className="w-full overflow-hidden flex justify-center mb-8 sm:mb-12" aria-hidden="true">
          <svg viewBox="0 0 1200 24" fill="none" preserveAspectRatio="none" className="w-full max-w-4xl h-4 text-[#641623]/30">
            <path
              d="M 10 12 Q 60 2 110 12 T 210 12 T 310 12 T 410 12 T 510 12 T 610 12 T 710 12 T 810 12 T 910 12 T 1010 12 T 1110 12 T 1190 12"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeDasharray="10 8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-10">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#811B2B] mb-2">
            Frequently Asked Questions
          </p>
          <h2
            id="home-faq-heading"
            className="font-black text-2xl sm:text-4xl md:text-[42px] text-[#641623] tracking-tight leading-tight"
          >
            <span>Before your gift arrives, </span>
            <span className="font-script font-normal text-[1.18em] text-[#811B2B] inline-block -rotate-1">
              quick answers
            </span>
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#2D2424]/80 leading-relaxed">
            {FAQ_HEADER.subtitle}
          </p>
        </div>

        {/* Single-Row Scrollable Category Tabs */}
        <div
          role="tablist"
          aria-label="FAQ Topics"
          onKeyDown={handleTabKeyDown}
          className="flex flex-nowrap items-center sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-5 snap-x snap-proximity"
        >
          {FAQ_CATEGORIES.map((cat, idx) => {
            const selected = idx === activeCategoryIdx;
            return (
              <button
                key={cat.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                id={`home-faq-tab-${cat.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => handleCategoryChange(idx)}
                className={`flex-none snap-start min-h-[42px] px-4 py-2 rounded-full text-xs sm:text-sm font-bold border-x border-t transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-3 focus-visible:outline-[#811B2B] focus-visible:outline-offset-2 ${
                  selected
                    ? 'bg-[#641623] text-[#FBF8CF] border-[#641623] border-b-[3.5px] border-b-[#F7BE44] shadow-xs'
                    : 'bg-[#FFFDF8] text-[#641623] border-[#641623]/20 border-b-[3.5px] border-b-transparent hover:bg-[#FFF5CC]'
                }`}
              >
                {cat.shortLabel}
              </button>
            );
          })}
        </div>

        {/* Accordion Container */}
        <div
          role="tabpanel"
          aria-labelledby={`home-faq-tab-${currentCategory.id}`}
          tabIndex={0}
          className="bg-[#FFFDF8] rounded-[24px] sm:rounded-[32px] border border-[#641623]/15 p-4 sm:p-7 shadow-[0_14px_38px_rgba(100,22,35,0.06)] focus-visible:outline-3 focus-visible:outline-[#811B2B]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-2 border-b border-[#641623]/10">
            <div>
              <h3 className="font-black text-lg sm:text-xl text-[#641623]">
                {currentCategory.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#2D2424]/70">
                {currentCategory.description}
              </p>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#FFF5CC] text-[#811B2B] text-xs font-bold flex-shrink-0">
              {currentCategory.items.length} Questions
            </span>
          </div>

          <div className="divide-y divide-[#641623]/10">
            {currentCategory.items.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className="py-3 sm:py-3.5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full text-left flex items-center justify-between gap-4 py-1 font-bold text-sm sm:text-base text-[#641623] hover:text-[#811B2B] cursor-pointer transition-colors"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-[#811B2B] flex-shrink-0 transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-2.5 pr-4 space-y-2">
                      <p className="text-xs sm:text-[15px] text-[#2D2424]/85 leading-relaxed">
                        {item.answer}
                      </p>
                      {item.linkAction && (
                        <button
                          type="button"
                          onClick={() => handleLinkTarget(item.linkAction!.target)}
                          className="text-xs font-bold text-[#811B2B] hover:text-[#641623] underline underline-offset-4 cursor-pointer"
                        >
                          {item.linkAction.label}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Support Bar + View All FAQs CTA */}
        <div className="mt-6 sm:mt-8 bg-[#FFF5CC] rounded-[24px] border border-[#811B2B]/20 p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-bold text-base sm:text-lg text-[#641623]">
              Still have a question?
            </p>
            <p className="text-xs sm:text-sm text-[#2D2424]/80 mt-0.5">
              Email{' '}
              <a
                href={`mailto:${FAQ_CONTACT.email}`}
                className="font-bold text-[#811B2B] underline underline-offset-2"
              >
                {FAQ_CONTACT.email}
              </a>{' '}
              or DM{' '}
              <a
                href={FAQ_CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#811B2B] underline underline-offset-2"
              >
                {FAQ_CONTACT.instagramHandle}
              </a>{' '}
              on Instagram.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a
              href={`mailto:${FAQ_CONTACT.email}`}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-full bg-[#FFFDF8] border border-[#641623]/25 text-xs sm:text-sm font-bold text-[#641623] hover:bg-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#811B2B]" aria-hidden="true" />
              <span>Email Us</span>
            </a>
            <a
              href={FAQ_CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-full bg-[#FFFDF8] border border-[#641623]/25 text-xs sm:text-sm font-bold text-[#641623] hover:bg-white transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-[#811B2B]" aria-hidden="true" />
              <span>{FAQ_CONTACT.instagramHandle}</span>
            </a>
            <button
              type="button"
              onClick={onViewAllFaq}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-5 py-2 rounded-full bg-[#641623] text-[#FBF8CF] text-xs sm:text-sm font-bold hover:bg-[#811B2B] transition-colors cursor-pointer"
            >
              <span>All 26 FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
