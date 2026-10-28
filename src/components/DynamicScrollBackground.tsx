/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';

interface ColorStop {
  bgBase: string;
  orb1: string;
  orb2: string;
  orb3: string;
}

// Curated aesthetic light-theme gradient palettes for each page section
const SCROLL_THEMES: Record<string, ColorStop> = {
  hero: {
    bgBase: 'linear-gradient(180deg, #fcecee 0%, #fbe8ea 60%, #faf3ea 100%)',
    orb1: 'rgba(254, 205, 211, 0.45)', // delicate blush
    orb2: 'rgba(253, 230, 138, 0.25)', // soft golden champagne
    orb3: 'rgba(244, 114, 182, 0.20)', // pastel rose
  },
  hanging: {
    bgBase: 'linear-gradient(180deg, #faf3ea 0%, #f6f0e4 50%, #faf2e8 100%)',
    orb1: 'rgba(254, 226, 226, 0.40)', // soft garden rose
    orb2: 'rgba(254, 240, 138, 0.35)', // sunshine glow
    orb3: 'rgba(245, 208, 175, 0.35)', // terracotta light
  },
  banner: {
    bgBase: 'linear-gradient(180deg, #faf2e8 0%, #fdf6ec 50%, #faf3e8 100%)',
    orb1: 'rgba(253, 230, 138, 0.40)', // warm honey
    orb2: 'rgba(254, 215, 170, 0.35)', // peach
    orb3: 'rgba(254, 202, 202, 0.30)', // pink blossom
  },
  bestseller: {
    bgBase: 'linear-gradient(180deg, #faf3e8 0%, #fdf2f0 50%, #faf4ec 100%)',
    orb1: 'rgba(254, 205, 211, 0.50)', // vibrant strawberry rose
    orb2: 'rgba(254, 243, 199, 0.45)', // warm vanilla
    orb3: 'rgba(253, 164, 175, 0.30)', // bright rose
  },
  reels: {
    bgBase: 'linear-gradient(180deg, #faf4ec 0%, #fcedde 50%, #faeedf 100%)',
    orb1: 'rgba(251, 146, 60, 0.35)', // sunset warm amber
    orb2: 'rgba(244, 114, 182, 0.28)', // reel pink glow
    orb3: 'rgba(253, 224, 71, 0.30)', // golden sparkle
  },
  moods: {
    bgBase: 'linear-gradient(180deg, #faeedf 0%, #f5eee6 50%, #faf4eb 100%)',
    orb1: 'rgba(245, 208, 175, 0.45)', // artisan beige/linen
    orb2: 'rgba(254, 205, 211, 0.35)', // coquette pink
    orb3: 'rgba(254, 240, 138, 0.30)', // floral daisy
  },
  reviews: {
    bgBase: 'linear-gradient(180deg, #faf4eb 0%, #fcf0ee 50%, #faf4e8 100%)',
    orb1: 'rgba(254, 205, 211, 0.45)', // soft love heart
    orb2: 'rgba(254, 215, 170, 0.40)', // honey glow
    orb3: 'rgba(251, 207, 232, 0.30)', // pastel blush
  },
  faqs: {
    bgBase: 'linear-gradient(180deg, #faf4e8 0%, #faeedc 50%, #f9f2e8 100%)',
    orb1: 'rgba(253, 230, 138, 0.40)', // butter cream
    orb2: 'rgba(254, 215, 170, 0.35)', // warm peach
    orb3: 'rgba(245, 235, 224, 0.50)', // calm linen
  },
};

export const DynamicScrollBackground: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<ColorStop>(SCROLL_THEMES.hero);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
          setScrollProgress(progress);

          // Detect active section based on scroll offset
          const sections = [
            { id: 'hanging-shelf-section', theme: SCROLL_THEMES.hanging },
            { id: 'bestseller-section', theme: SCROLL_THEMES.bestseller },
            { id: 'watch-and-buy', theme: SCROLL_THEMES.reels },
            { id: 'mood-decks-section', theme: SCROLL_THEMES.moods },
            { id: 'reviews-section', theme: SCROLL_THEMES.reviews },
            { id: 'faq-section', theme: SCROLL_THEMES.faqs },
          ];

          let matchedTheme = SCROLL_THEMES.hero;
          const viewportMid = scrollY + window.innerHeight * 0.45;

          for (const sec of sections) {
            const el = document.getElementById(sec.id);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (viewportMid >= top && viewportMid < top + height) {
                matchedTheme = sec.theme;
                break;
              }
            }
          }

          setActiveTheme(matchedTheme);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Motion coordinates for the floating ambient light orbs
  const orb1Y = Math.sin(scrollProgress * Math.PI * 2) * 120 + scrollProgress * 150;
  const orb2Y = Math.cos(scrollProgress * Math.PI * 2) * 100 - scrollProgress * 120;
  const orb3X = Math.sin(scrollProgress * Math.PI * 3) * 80;

  return (
    <div 
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-all duration-1000 ease-out"
      style={{
        background: activeTheme.bgBase,
      }}
    >
      {/* Dynamic Floating Glow Orb 1 (Top Left to Center) */}
      <div
        className="absolute -top-32 -left-32 w-[520px] sm:w-[720px] h-[520px] sm:h-[720px] rounded-full blur-[100px] sm:blur-[140px] transition-all duration-1000 ease-out will-change-transform"
        style={{
          backgroundColor: activeTheme.orb1,
          transform: `translate3d(0, ${orb1Y}px, 0)`,
        }}
      />

      {/* Dynamic Floating Glow Orb 2 (Right Side to Bottom) */}
      <div
        className="absolute top-1/3 -right-32 w-[480px] sm:w-[680px] h-[480px] sm:h-[680px] rounded-full blur-[110px] sm:blur-[150px] transition-all duration-1000 ease-out will-change-transform"
        style={{
          backgroundColor: activeTheme.orb2,
          transform: `translate3d(0, ${orb2Y}px, 0)`,
        }}
      />

      {/* Dynamic Floating Glow Orb 3 (Bottom Center) */}
      <div
        className="absolute bottom-10 left-1/4 w-[420px] sm:w-[560px] h-[420px] sm:h-[560px] rounded-full blur-[90px] sm:blur-[130px] transition-all duration-1000 ease-out will-change-transform"
        style={{
          backgroundColor: activeTheme.orb3,
          transform: `translate3d(${orb3X}px, 0, 0)`,
        }}
      />

      {/* Subtle fine noise texture for rich tactile feel */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#2b0b12 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
