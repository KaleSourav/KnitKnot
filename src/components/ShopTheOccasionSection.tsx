import React, { useState, useRef } from 'react';

export interface OccasionItem {
  id: string;
  title: string;
  image: string;
  hoverImage: string;
  badgeLabel: string;
  badgeIcon: React.ReactNode;
}

const optimizeShopifyUrl = (url: string, width = 600) => {
  if (!url) return url;
  if (url.includes('cdn.shopify.com') && !url.includes('&width=')) {
    return `${url}&width=${width}&format=webp`;
  }
  return url;
};

const OCCASIONS: OccasionItem[] = [
  {
    id: 'birthdays',
    title: 'birthdays',
    image: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_XYjbB_DJ_1791261166417_3l7oukh265vjtjy.jpg?v=1793949872',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/xikgsXR6_5B4G6VHD2M_2026-09-29_1.jpg?v=1793949925',
    badgeLabel: 'celebrate',
    badgeIcon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#641623]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
        <path d="M4 21h16" />
        <path d="M12 7v4" />
        <path d="M12 3a1 1 0 0 1 1 1c0 1-1 2-1 2s-1-1-1-2a1 1 0 0 1 1-1z" fill="#F7BE44" />
      </svg>
    ),
  },
  {
    id: 'anniversaries',
    title: 'anniversaries',
    image: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_DlhI_qXJ_1791261174851_7ircqgdvvz7aeb1.jpg?v=1793949938',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_DlhI_qXJ_1791261175003_kd00cx2qr19tfk9.jpg?v=1793949938',
    badgeLabel: 'with love',
    badgeIcon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#641623]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#F472B6" />
      </svg>
    ),
  },
  {
    id: 'thank-you',
    title: 'thank you',
    image: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_ILJ324gG_1791261175791_15gnocsy0dnjr8n_45d62cde-a8e0-4c17-9471-f089eb29e55f.jpg?v=1793949837',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_ILJ324gG_1791261175343_ztlyg0gy5cuo0oj_5ae25ddc-e1d8-4523-b019-019923f9150e.jpg?v=1793949837',
    badgeLabel: 'gratitude',
    badgeIcon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#641623]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" fill="#F7BE44" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
  },
  {
    id: 'just-because',
    title: 'just because',
    image: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_S1joXZHQ_1791261165706_rszy83chhrcpyp6.jpg?v=1793949900',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_S1joXZHQ_1791261166017_p8avr2g8cr99e96.jpg?v=1793949900',
    badgeLabel: 'pure joy',
    badgeIcon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#641623]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    id: 'festive-gifting',
    title: 'festive gifting',
    image: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_INJ8CYwF_1791261129050_t23x12y0o5x1sxc.jpg?v=1793949838',
    hoverImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_INJ8CYwF_1791261131333_t5pf6tavljt99xs.jpg?v=1793949839',
    badgeLabel: 'special',
    badgeIcon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#641623]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" fill="#D96B43" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" fill="#D96B43" />
      </svg>
    ),
  },
];

interface ShopTheOccasionSectionProps {
  onOccasionClick?: (id: string) => void;
}

export const ShopTheOccasionSection: React.FC<ShopTheOccasionSectionProps> = ({
  onOccasionClick,
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState<number>(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) return;
      const progress = scrollLeft / maxScroll;
      const dotIndex = Math.min(
        OCCASIONS.length - 1,
        Math.max(0, Math.round(progress * (OCCASIONS.length - 1)))
      );
      setActiveDot(dotIndex);
    }
  };

  return (
    <section className="w-full bg-[#FAF4ED] pt-3 pb-10 sm:pt-5 sm:pb-14 overflow-hidden font-['Fredoka']">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Top Whimsical Wavy Stitched Line with Smiling 5-Petal Flower Divider */}
        <div className="w-full flex justify-center mb-4 sm:mb-6" aria-hidden="true">
          <svg
            viewBox="0 0 1200 48"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="w-full max-w-[960px] h-8 sm:h-11 overflow-visible select-none"
          >
            {/* Left Curvy Wavy Dashed Stitch Line */}
            <path
              d="M 20 24 C 75 12, 135 36, 195 24 C 255 12, 315 36, 375 24 C 435 12, 495 36, 565 24"
              stroke="#641623"
              strokeWidth="2.8"
              strokeDasharray="22 14"
              strokeLinecap="round"
              className="opacity-75"
            />

            {/* Center Smiling 5-Petal Flower Mascot */}
            <g transform="translate(600, 24)" className="cursor-pointer group">
              <circle cx="0" cy="-11" r="7.5" fill="#F7BE44" stroke="#641623" strokeWidth="2.4" strokeLinejoin="round" />
              <circle cx="10.5" cy="-3.5" r="7.5" fill="#F7BE44" stroke="#641623" strokeWidth="2.4" strokeLinejoin="round" />
              <circle cx="6.5" cy="9" r="7.5" fill="#F7BE44" stroke="#641623" strokeWidth="2.4" strokeLinejoin="round" />
              <circle cx="-6.5" cy="9" r="7.5" fill="#F7BE44" stroke="#641623" strokeWidth="2.4" strokeLinejoin="round" />
              <circle cx="-10.5" cy="-3.5" r="7.5" fill="#F7BE44" stroke="#641623" strokeWidth="2.4" strokeLinejoin="round" />
              <circle cx="0" cy="0" r="8.5" fill="#FFF9F2" stroke="#641623" strokeWidth="2.4" />
              <circle cx="-2.6" cy="-1.5" r="1.3" fill="#641623" />
              <circle cx="2.6" cy="-1.5" r="1.3" fill="#641623" />
              <path d="M -2.2 2 Q 0 4.2 2.2 2" fill="none" stroke="#641623" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="-4.8" cy="0.5" r="1.1" fill="#F472B6" />
              <circle cx="4.8" cy="0.5" r="1.1" fill="#F472B6" />
            </g>

            {/* Right Curvy Wavy Dashed Stitch Line */}
            <path
              d="M 635 24 C 705 12, 765 36, 825 24 C 885 12, 945 36, 1005 24 C 1065 12, 1125 36, 1180 24"
              stroke="#641623"
              strokeWidth="2.8"
              strokeDasharray="22 14"
              strokeLinecap="round"
              className="opacity-75"
            />
          </svg>
        </div>

        {/* 2. Heading with Whimsical Radiant Dashes: \ | /  shop the occasion  / | \ */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mb-5 sm:mb-7 text-center">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          >
            <line x1="12" y1="16" x2="3" y2="16" />
            <line x1="14" y1="9" x2="6" y2="5" />
            <line x1="14" y1="23" x2="6" y2="27" />
          </svg>

          <h2 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl md:text-4xl text-[#641623] tracking-tight">
            shop the occasion
          </h2>

          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          >
            <line x1="20" y1="16" x2="29" y2="16" />
            <line x1="18" y1="9" x2="26" y2="5" />
            <line x1="18" y1="23" x2="26" y2="27" />
          </svg>
        </div>

        {/* 3. The 5 Occasion Cards - Mobile Matches Bestsellers View (w-[72vw], Card 2 Peeking) */}
        <div className="relative w-full">
          {/* Left Arrow Button (Desktop only) */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute -left-2 sm:-left-3 lg:-left-5 top-[40%] -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full border-[1.8px] sm:border-2 border-[#641623] bg-[#FAF4ED] text-[#641623] items-center justify-center hover:bg-[#641623] hover:text-white transition-all shadow-md focus:outline-none cursor-pointer"
            aria-label="Previous occasions"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Cards Scroll Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="w-full flex items-stretch justify-start lg:justify-between gap-3.5 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar py-2 px-1 snap-x snap-mandatory scroll-smooth"
          >
            {OCCASIONS.map((item) => {
              const isHovered = hoveredCard === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => onOccasionClick?.(item.id)}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group w-[72vw] max-w-[310px] flex-shrink-0 sm:w-auto sm:flex-1 sm:min-w-[210px] md:min-w-[230px] lg:min-w-[240px] cursor-pointer flex flex-col snap-start sm:snap-center rounded-[24px] sm:rounded-[28px] bg-[#FAF2E8]/90 hover:bg-[#FAF2E8] border-[2px] border-[#641623]/15 hover:border-[#641623]/35 shadow-[0_4px_16px_rgba(100,22,35,0.06)] hover:shadow-[0_12px_28px_rgba(100,22,35,0.14)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden select-none"
                >
                  {/* Image Container with Real Knots & Co Product Images */}
                  <div className="relative w-full aspect-[3/3.8] sm:aspect-[4/4.8] lg:aspect-[4/5] overflow-hidden rounded-t-[22px] sm:rounded-t-[26px] bg-white">
                    {/* Default Primary Real Product Image */}
                    <img
                      src={optimizeShopifyUrl(item.image, 600)}
                      alt={item.title}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-out ${
                        isHovered
                          ? 'opacity-0 scale-105'
                          : 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-105'
                      }`}
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Secondary Real Product Image (Hover View) */}
                    <img
                      src={optimizeShopifyUrl(item.hoverImage, 600)}
                      alt={`${item.title} alternate view`}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-out ${
                        isHovered
                          ? 'opacity-100 scale-105'
                          : 'opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-105'
                      }`}
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Cute Occasion Floating Badge in Top-Right Corner */}
                    <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 bg-white/95 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#641623]/15 shadow-sm flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-105 group-hover:bg-white">
                      <span className="scale-90 sm:scale-100">{item.badgeIcon}</span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#641623] tracking-wide uppercase">
                        {item.badgeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Occasion Pill Banner */}
                  <div className="w-full p-2.5 sm:p-3.5 flex justify-center items-center bg-[#FAF2E8]">
                    <div className="w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-full bg-[#FFFDF9] group-hover:bg-[#F7BE44] border-[1.8px] sm:border-2 border-[#641623]/25 group-hover:border-[#641623] shadow-sm flex items-center justify-center gap-1.5 transition-all duration-300">
                      <span className="font-['Fredoka'] font-bold text-sm sm:text-base text-[#641623] capitalize tracking-wide leading-none pt-0.5 whitespace-nowrap">
                        {item.title}
                      </span>
                      {/* Animated Arrow on Hover */}
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#641623] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden sm:block"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button (Desktop only) */}
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute -right-2 sm:-right-3 lg:-right-5 top-[40%] -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full border-[1.8px] sm:border-2 border-[#641623] bg-[#FAF4ED] text-[#641623] items-center justify-center hover:bg-[#641623] hover:text-white transition-all shadow-md focus:outline-none cursor-pointer"
            aria-label="Next occasions"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* 4. Carousel Pagination Indicator Dots (Matching Bestsellers) */}
        <div className="flex items-center justify-center gap-2 mt-5 sm:mt-8">
          {OCCASIONS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (scrollRef.current) {
                  const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                  scrollRef.current.scrollTo({
                    left: (maxScroll / (OCCASIONS.length - 1)) * idx,
                    behavior: 'smooth',
                  });
                }
                setActiveDot(idx);
              }}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all cursor-pointer ${
                activeDot === idx
                  ? 'bg-[#641623] scale-110'
                  : 'border-[1.8px] sm:border-2 border-[#641623]/50 bg-transparent'
              }`}
              aria-label={`Occasion ${idx + 1}`}
            />
          ))}
        </div>

        {/* 5. Golden Wavy Sine Divider at Bottom */}
        <div className="w-full overflow-hidden flex justify-center mt-6 sm:mt-10" aria-hidden="true">
          <svg
            viewBox="0 0 1440 24"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-4 sm:h-5 text-[#F7BE44]"
          >
            <path
              d="M0 12 C 30 0, 60 24, 90 12 C 120 0, 150 24, 180 12 C 210 0, 240 24, 270 12 C 300 0, 330 24, 360 12 C 390 0, 420 24, 450 12 C 480 0, 510 24, 540 12 C 570 0, 600 24, 630 12 C 660 0, 690 24, 720 12 C 750 0, 780 24, 810 12 C 840 0, 870 24, 900 12 C 930 0, 960 24, 990 12 C 1020 0, 1050 24, 1080 12 C 1110 0, 1140 24, 1170 12 C 1200 0, 1230 24, 1260 12 C 1290 0, 1320 24, 1350 12 C 1380 0, 1410 24, 1440 12"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

