import React, { useState, useRef } from 'react';

export interface OccasionItem {
  id: string;
  title: string;
  image: string;
  hoverImage: string;
  badgeLabel: string;
  badgeIcon: React.ReactNode;
}

const OCCASIONS: OccasionItem[] = [
  {
    id: 'birthdays',
    title: 'birthdays',
    image: '/occasions/birthdays.jpg',
    hoverImage: '/occasions/birthdays-hover.jpg',
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
    image: '/occasions/anniversaries.jpg',
    hoverImage: '/occasions/anniversaries-hover.jpg',
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
    image: '/occasions/thank-you.jpg',
    hoverImage: '/occasions/thank-you-hover.jpg',
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
    image: '/occasions/just-because.jpg',
    hoverImage: '/occasions/just-because-hover.jpg',
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
    image: '/occasions/festive-gifting.jpg',
    hoverImage: '/occasions/festive-gifting-hover.jpg',
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

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = scrollLeft / (scrollWidth - clientWidth);
      if (progress < 0.25) setActiveDot(0);
      else if (progress < 0.75) setActiveDot(1);
      else setActiveDot(2);
    }
  };

  const scrollToSection = (index: number) => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      scrollRef.current.scrollTo({
        left: (maxScroll / 2) * index,
        behavior: 'smooth',
      });
      setActiveDot(index);
    }
  };

  return (
    <section className="w-full bg-[#FAF4ED] py-8 sm:py-12 lg:py-16 overflow-hidden font-['Fredoka']">
      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Top Whimsical Stitch Line with Smiling 5-Petal Flower Divider (Reference) */}
        <div className="w-full flex items-center justify-center mb-6 sm:mb-8" aria-hidden="true">
          {/* Left Dashed Stitch Line */}
          <div className="flex-1 max-w-[380px] h-[2px] border-b-[2.5px] border-dashed border-[#641623]/35" />

          {/* Center Smiling 5-Petal Flower Mascot */}
          <div className="mx-3 sm:mx-4 flex-shrink-0 relative group cursor-pointer transition-transform duration-300 hover:rotate-12 hover:scale-110">
            <svg viewBox="0 0 44 44" className="w-8 h-8 sm:w-9 sm:h-9">
              {/* 5 Rounded Petals */}
              <g fill="#F7BE44" stroke="#641623" strokeWidth="2.5" strokeLinejoin="round">
                <circle cx="22" cy="10" r="8" />
                <circle cx="32.5" cy="18" r="8" />
                <circle cx="28.5" cy="31" r="8" />
                <circle cx="15.5" cy="31" r="8" />
                <circle cx="11.5" cy="18" r="8" />
              </g>
              {/* Inner Center Circle */}
              <circle cx="22" cy="22" r="9" fill="#FFF9F2" stroke="#641623" strokeWidth="2.5" />
              {/* Smiling Face Details */}
              <circle cx="19" cy="20.5" r="1.4" fill="#641623" />
              <circle cx="25" cy="20.5" r="1.4" fill="#641623" />
              <path d="M19.5 24.2 Q 22 26.5 24.5 24.2" fill="none" stroke="#641623" strokeWidth="1.8" strokeLinecap="round" />
              {/* Rosy Cheeks */}
              <circle cx="16.5" cy="22.5" r="1.1" fill="#F472B6" />
              <circle cx="27.5" cy="22.5" r="1.1" fill="#F472B6" />
            </svg>
          </div>

          {/* Right Dashed Stitch Line */}
          <div className="flex-1 max-w-[380px] h-[2px] border-b-[2.5px] border-dashed border-[#641623]/35" />
        </div>

        {/* 2. Heading with Whimsical Radiant Dashes: \ | /  shop the occasion  / | \ */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mb-8 sm:mb-10 text-center">
          {/* Left Radiant Dashes */}
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

          {/* Exact Heading */}
          <h2 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl md:text-4xl text-[#641623] tracking-tight">
            shop the occasion
          </h2>

          {/* Right Radiant Dashes */}
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

        {/* 3. The 5 Occasion Cards Grid with Smooth Horizontal Snap on Mobile */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex lg:grid lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 overflow-x-auto lg:overflow-visible pb-4 pt-1 px-1 no-scrollbar snap-x snap-mandatory"
        >
          {OCCASIONS.map((item) => {
            const isHovered = hoveredCard === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onOccasionClick?.(item.id)}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group flex-shrink-0 w-[220px] sm:w-[240px] lg:w-auto snap-center cursor-pointer flex flex-col rounded-[24px] sm:rounded-[28px] bg-[#FAF2E8]/80 hover:bg-[#FAF2E8] border-[2px] border-[#641623]/12 hover:border-[#641623]/30 shadow-[0_4px_16px_rgba(100,22,35,0.05)] hover:shadow-[0_12px_28px_rgba(100,22,35,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden select-none"
              >
                {/* Image Container with Smooth Crossfade and Zoom on Hover */}
                <div className="relative w-full aspect-[4/3.9] overflow-hidden rounded-t-[22px] sm:rounded-t-[26px] bg-white/60">
                  {/* Default Primary Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
                      isHovered
                        ? 'opacity-0 scale-105'
                        : 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-105'
                    }`}
                    loading="lazy"
                  />

                  {/* Secondary Alternate Image (Fades In Smoothly on Hover) */}
                  <img
                    src={item.hoverImage}
                    alt={`${item.title} alternate lifestyle view`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
                      isHovered
                        ? 'opacity-100 scale-105'
                        : 'opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-105'
                    }`}
                    loading="lazy"
                  />

                  {/* Cute Occasion Floating Badge in Top-Right Corner */}
                  <div className="absolute top-2.5 right-2.5 z-10 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#641623]/15 shadow-sm flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-108 group-hover:bg-white">
                    {item.badgeIcon}
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#641623] tracking-wide uppercase">
                      {item.badgeLabel}
                    </span>
                  </div>
                </div>

                {/* Bottom Occasion Pill Banner */}
                <div className="w-full p-2.5 sm:p-3 flex justify-center items-center bg-[#FAF2E8]/60">
                  <div className="w-full py-2 sm:py-2.5 px-3 rounded-full bg-[#FFFDF9] group-hover:bg-[#F7BE44] border-[1.8px] border-[#641623]/20 group-hover:border-[#641623] shadow-sm flex items-center justify-center gap-1.5 transition-all duration-300">
                    <span className="font-['Fredoka'] font-bold text-sm sm:text-base text-[#641623] capitalize tracking-wide leading-none pt-0.5">
                      {item.title}
                    </span>
                    {/* Animated Arrow on Hover */}
                    <svg
                      className="w-3.5 h-3.5 text-[#641623] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
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

        {/* 4. Mobile Carousel Pagination Dots */}
        <div className="flex lg:hidden items-center justify-center gap-2 mt-5">
          <button
            onClick={() => scrollToSection(0)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              activeDot === 0
                ? 'bg-[#641623] w-6'
                : 'bg-[#641623]/30 hover:bg-[#641623]/60'
            }`}
            aria-label="Slide 1"
          />
          <button
            onClick={() => scrollToSection(1)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              activeDot === 1
                ? 'bg-[#641623] w-6'
                : 'bg-[#641623]/30 hover:bg-[#641623]/60'
            }`}
            aria-label="Slide 2"
          />
          <button
            onClick={() => scrollToSection(2)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              activeDot === 2
                ? 'bg-[#641623] w-6'
                : 'bg-[#641623]/30 hover:bg-[#641623]/60'
            }`}
            aria-label="Slide 3"
          />
        </div>

        {/* 5. Golden Wavy Sine Divider at Bottom (Reference) */}
        <div className="w-full overflow-hidden flex justify-center mt-8 sm:mt-12" aria-hidden="true">
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
