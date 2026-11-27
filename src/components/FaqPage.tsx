import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Search,
  ChevronDown,
  Mail,
  Instagram,
  X,
  HelpCircle,
  ShoppingBag,
} from 'lucide-react';
import { FAQ_CATEGORIES, FAQ_CONTACT, FAQ_HEADER, ALL_FAQ_ITEMS } from '../data/faqData';

interface FaqPageProps {
  onNavigateHome: () => void;
  onNavigateShop: (category?: string) => void;
  onNavigatePolicy: (tab: 'returns' | 'shipping') => void;
  onNavigateB2B: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({
  onNavigateHome,
  onNavigateShop,
  onNavigatePolicy,
  onNavigateB2B,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'what-is-knotsnco': true,
    'delivery-timeline': true,
  });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_CATEGORIES.filter(
      (cat) => selectedCategory === 'all' || cat.id === selectedCategory
    )
      .map((cat) => ({
        ...cat,
        items: q
          ? cat.items.filter(
              (item) =>
                item.question.toLowerCase().includes(q) ||
                item.answer.toLowerCase().includes(q)
            )
          : cat.items,
      }))
      .filter((cat) => cat.items.length > 0);
  }, [searchQuery, selectedCategory]);

  const totalMatching = useMemo(
    () => filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0),
    [filteredCategories]
  );

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLinkTarget = (target: 'returns' | 'shipping' | 'b2b' | 'shop') => {
    if (target === 'returns') onNavigatePolicy('returns');
    else if (target === 'shipping') onNavigatePolicy('shipping');
    else if (target === 'b2b') onNavigateB2B();
    else if (target === 'shop') onNavigateShop('all');
  };

  const tabOptions = useMemo(
    () => [
      { id: 'all', label: `All Topics (${ALL_FAQ_ITEMS.length})` },
      ...FAQ_CATEGORIES.map((c) => ({
        id: c.id,
        label: `${c.shortLabel} (${c.items.length})`,
      })),
    ],
    []
  );

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = tabOptions.findIndex((t) => t.id === selectedCategory);
    if (idx === -1) return;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (idx + 1) % tabOptions.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + tabOptions.length) % tabOptions.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabOptions.length - 1;

    if (next !== null) {
      e.preventDefault();
      setSelectedCategory(tabOptions[next].id);
      tabRefs.current[next]?.focus();
      tabRefs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FBF8CF] text-[#2D2424] font-['Fredoka'] overflow-x-hidden">
      {/* Top Breadcrumb Bar (cleared below Header floating pills) */}
      <div className="relative z-10 w-full bg-[#FFFDF8] border-b border-[#641623]/10 pt-5 sm:pt-6 pb-3 px-4 sm:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 min-h-[38px] text-xs sm:text-sm font-bold text-[#641623] hover:text-[#811B2B] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Home</span>
          </button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#641623]/65 font-medium">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:underline cursor-pointer"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-[#811B2B] font-bold" aria-current="page">
              Frequently Asked Questions
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5CC] border border-[#811B2B]/20 text-[#811B2B] text-xs font-bold tracking-wider uppercase mb-4">
          <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Frequently Asked Questions</span>
        </div>

        <h1
          className="font-black text-[#641623] tracking-tight leading-tight"
          style={{ fontSize: 'clamp(2.1rem, 1.3rem + 3.5vw, 3.75rem)' }}
        >
          <span>Everything about </span>
          <span className="font-script font-normal text-[1.18em] text-[#811B2B] inline-block -rotate-1">
            Knots &amp; Co.
          </span>
        </h1>

        <p className="mt-3 text-base sm:text-lg font-semibold text-[#641623]/90 max-w-2xl mx-auto">
          {FAQ_HEADER.subtitle}
        </p>

        <p className="mt-2 text-xs sm:text-sm text-[#2D2424]/75 max-w-2xl mx-auto leading-relaxed">
          {FAQ_HEADER.welcomeNote}
        </p>

        {/* Live Search Box */}
        <div className="mt-6 max-w-xl mx-auto">
          <label htmlFor="faq-search-input" className="sr-only">
            Search Frequently Asked Questions
          </label>
          <div className="relative flex items-center">
            <Search
              aria-hidden="true"
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623]/55 absolute left-4 pointer-events-none"
            />
            <input
              id="faq-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs (delivery, bouquets, returns)..."
              className="w-full min-h-[48px] pl-11 pr-10 py-3 rounded-full bg-[#FFFDF8] border-2 border-[#641623]/20 text-sm sm:text-base text-[#2D2424] placeholder-[#641623]/45 focus:outline-none focus:border-[#811B2B] shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1.5 rounded-full text-[#641623] hover:bg-[#FFF5CC] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
          {searchQuery.trim() && (
            <p className="mt-2 text-xs font-semibold text-[#811B2B]">
              Showing {totalMatching} matching {totalMatching === 1 ? 'question' : 'questions'}
            </p>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 mb-6">
        <div
          role="tablist"
          aria-label="FAQ categories"
          onKeyDown={handleTabKeyDown}
          className="flex flex-nowrap items-center lg:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 snap-x snap-proximity"
        >
          {tabOptions.map((tab, idx) => {
            const selected = tab.id === selectedCategory;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                type="button"
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => {
                  setSelectedCategory(tab.id);
                  tabRefs.current[idx]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                }}
                className={`flex-none snap-start min-h-[42px] px-3.5 py-2 rounded-full text-xs sm:text-[13px] font-bold border-x border-t transition-colors cursor-pointer whitespace-nowrap ${
                  selected
                    ? 'bg-[#641623] text-[#FBF8CF] border-[#641623] border-b-[3.5px] border-b-[#F7BE44] shadow-xs'
                    : 'bg-[#FFFDF8] text-[#641623] border-[#641623]/20 border-b-[3.5px] border-b-transparent hover:bg-[#FFF5CC]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main FAQ Groups */}
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 pb-16 sm:pb-24 space-y-6 sm:space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="bg-[#FFFDF8] rounded-[24px] border border-[#641623]/15 p-8 text-center space-y-3">
            <p className="font-bold text-lg text-[#641623]">
              No matching questions found for &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-sm text-[#2D2424]/75">
              Try a broader word like &ldquo;delivery&rdquo;, &ldquo;custom&rdquo;, or email us directly at{' '}
              <a href={`mailto:${FAQ_CONTACT.email}`} className="font-bold text-[#811B2B] underline">
                {FAQ_CONTACT.email}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 px-5 py-2 rounded-full bg-[#641623] text-[#FBF8CF] text-xs font-bold cursor-pointer"
            >
              Show all questions
            </button>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <section
              key={cat.id}
              aria-labelledby={`faq-cat-${cat.id}`}
              className="bg-[#FFFDF8] rounded-[24px] sm:rounded-[30px] border border-[#641623]/15 p-5 sm:p-8 shadow-xs"
            >
              <div className="pb-4 mb-2 border-b border-[#641623]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#811B2B]">
                    {cat.items.length} Questions
                  </p>
                  <h2 id={`faq-cat-${cat.id}`} className="font-black text-xl sm:text-2xl text-[#641623]">
                    {cat.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#2D2424]/70 max-w-md">{cat.description}</p>
              </div>

              <div className="divide-y divide-[#641623]/10">
                {cat.items.map((item) => {
                  const isOpen = searchQuery.trim().length > 0 || Boolean(openIds[item.id]);
                  return (
                    <div key={item.id} className="py-3.5">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => toggleItem(item.id)}
                        className="w-full text-left flex items-center justify-between gap-4 py-1 font-bold text-sm sm:text-base text-[#641623] hover:text-[#811B2B] cursor-pointer"
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
            </section>
          ))
        )}

        {/* Still Have a Question Card */}
        <div className="bg-[#FFF5CC] rounded-[28px] border-2 border-[#811B2B]/25 p-6 sm:p-10 text-center space-y-4">
          <h2 className="font-black text-2xl sm:text-3xl text-[#641623]">
            Still have a question?
          </h2>
          <p className="text-sm sm:text-base text-[#2D2424]/85 max-w-xl mx-auto">
            We&apos;d love to help. Email us at{' '}
            <a
              href={`mailto:${FAQ_CONTACT.email}`}
              className="font-bold text-[#811B2B] underline underline-offset-2"
            >
              {FAQ_CONTACT.email}
            </a>{' '}
            or find us on Instagram at{' '}
            <a
              href={FAQ_CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#811B2B] underline underline-offset-2"
            >
              {FAQ_CONTACT.instagramHandle}
            </a>
            .
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`mailto:${FAQ_CONTACT.email}?subject=Question%20from%20Knots%20%26%20Co.%20FAQ`}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-[#641623] text-[#FBF8CF] text-xs sm:text-sm font-bold hover:bg-[#811B2B] transition-colors"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>{FAQ_CONTACT.email}</span>
            </a>
            <a
              href={FAQ_CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-[#FFFDF8] border border-[#641623]/25 text-[#641623] text-xs sm:text-sm font-bold hover:bg-white transition-colors"
            >
              <Instagram className="w-4 h-4 text-[#811B2B]" aria-hidden="true" />
              <span>Instagram {FAQ_CONTACT.instagramHandle}</span>
            </a>
            <button
              type="button"
              onClick={() => onNavigateShop('all')}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-[#FFFDF8] border border-[#641623]/25 text-[#641623] text-xs sm:text-sm font-bold hover:bg-white transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#811B2B]" aria-hidden="true" />
              <span>Browse Shop</span>
            </button>
          </div>

          <p className="pt-2 text-xs font-bold tracking-wide text-[#641623]/70">
            {FAQ_CONTACT.website} &nbsp;|&nbsp; {FAQ_CONTACT.tagline}
          </p>
        </div>
      </div>
    </div>
  );
};
