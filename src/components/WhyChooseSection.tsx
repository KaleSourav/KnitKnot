import React, { useState, useRef } from 'react';

interface ReasonCard {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  perkTitle: string;
  perkDescription: string;
  statBadge: string;
  type: 'blue' | 'yellow';
  rotation: string;
  illustration: 'yarn' | 'artisans' | 'blooms' | 'gifting';
}

const REASONS: ReasonCard[] = [
  {
    number: '01',
    title: '100% handmade with love',
    subtitle: 'stitch by stitch',
    description:
      'Every single petal, plushie, and knot is patiently crocheted by hand. No factory machines, no shortcuts — just genuine warmth in every stitch.',
    perkTitle: 'The Handmade Promise',
    perkDescription:
      'Each piece takes 3 to 8 hours of devoted craftsmanship using premium soft milk-cotton yarn that feels soothing and stays durable forever.',
    statBadge: '3-8 hrs per piece',
    type: 'blue',
    rotation: 'rotate-0 lg:-rotate-[2.5deg]',
    illustration: 'yarn',
  },
  {
    number: '02',
    title: 'empowering 200+ daadis',
    subtitle: 'crafting dignity',
    description:
      'Your orders bring flexible, independent work to 200+ daadis and aunties across homes in India, giving their golden skills the pride they deserve.',
    perkTitle: 'Community First',
    perkDescription:
      '100% fair wages paid directly to home artisans, helping women earn with respect while caring for their families in the comfort of their homes.',
    statBadge: '200+ home artisans',
    type: 'yellow',
    rotation: 'rotate-0 lg:rotate-[1deg]',
    illustration: 'artisans',
  },
  {
    number: '03',
    title: 'blooms that never wilt',
    subtitle: 'everlasting memories',
    description:
      'Real flowers wither away in a few days. Our crochet treasures stay vibrant year after year — a forever keepsake of your sweetest moments.',
    perkTitle: 'Zero Maintenance',
    perkDescription:
      'Dust-resistant, hypoallergenic, and no watering needed. Just gentle love, keeping your room and sweetest memories forever blooming.',
    statBadge: 'lasts forever',
    type: 'blue',
    rotation: 'rotate-0 lg:-rotate-[1.2deg]',
    illustration: 'blooms',
  },
  {
    number: '04',
    title: 'thoughtful & custom gifting',
    subtitle: 'wrapped from the heart',
    description:
      'Packed like a parcel from home with custom handwritten note cards, lovely ribbon wraps, and bespoke color choices for every celebration.',
    perkTitle: 'Gifting Ready',
    perkDescription:
      'Complimentary custom message card and luxury craft packaging included with every order. Ready to bring pure joy the second it is unboxed.',
    statBadge: 'free custom note',
    type: 'yellow',
    rotation: 'rotate-0 lg:rotate-[2.5deg]',
    illustration: 'gifting',
  },
];

export const WhyChooseSection: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [activeDot, setActiveDot] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) return;
      const progress = scrollLeft / maxScroll;
      const dotIndex = Math.min(
        REASONS.length - 1,
        Math.max(0, Math.round(progress * (REASONS.length - 1)))
      );
      setActiveDot(dotIndex);
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: (maxScroll / (REASONS.length - 1)) * index,
        behavior: 'smooth',
      });
      setActiveDot(index);
    }
  };

  return (
    <section className="w-full bg-[#FAF4ED] pt-6 pb-14 sm:pt-8 sm:pb-20 overflow-hidden font-['Fredoka'] select-none">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Whimsical Curvy Dashed Stitch Divider */}
        <div className="w-full flex justify-center mb-4 sm:mb-6" aria-hidden="true">
          <svg
            viewBox="0 0 1200 48"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="w-full max-w-[960px] h-8 sm:h-11 overflow-visible"
          >
            <path
              d="M 20 24 C 75 12, 135 36, 195 24 C 255 12, 315 36, 375 24 C 435 12, 495 36, 565 24"
              stroke="#641623"
              strokeWidth="2.8"
              strokeDasharray="22 14"
              strokeLinecap="round"
              className="opacity-75"
            />
            {/* Center Smiling Heart Mascot */}
            <g transform="translate(600, 24)" className="cursor-pointer">
              <circle cx="0" cy="0" r="16" fill="#FFFDF9" stroke="#641623" strokeWidth="2.4" />
              <path
                d="M 0 5 C -7 -3, -11 -7, -11 -11 C -11 -15, -7 -18, -2 -18 C 1 -18, 0 -16, 0 -16 C 0 -16, -1 -18, 2 -18 C 7 -18, 11 -15, 11 -11 C 11 -7, 7 -3, 0 5 Z"
                transform="translate(0, 6) scale(0.65)"
                fill="#F472B6"
                stroke="#641623"
                strokeWidth="1.8"
              />
              <circle cx="-3.5" cy="-2.5" r="1.3" fill="#641623" />
              <circle cx="3.5" cy="-2.5" r="1.3" fill="#641623" />
              <path d="M -2 1.5 Q 0 3.5 2 1.5" fill="none" stroke="#641623" strokeWidth="1.6" strokeLinecap="round" />
            </g>
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

        {/* 2. Heading: \ | /  why choose knotsnco  / | \ */}
        <div className="flex flex-col items-center justify-center text-center mb-7 sm:mb-10">
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5">
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

            {/* Heading in Dual-Font Pairing (Fredoka + Flowing Cursive Script) */}
            <h2 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-[#641623] tracking-tight">
              <span>why </span>
              <span className="font-script text-[1.22em] text-[#811B2B] font-normal lowercase px-1 inline-block -rotate-2">choose</span>
              <span> knots &amp; co</span>
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
          <p className="font-['Fredoka'] text-sm sm:text-base text-[#641623]/70 mt-1 max-w-md">
            a little yarn, a lot of love, and a forever keepsake for you ♡
          </p>
        </div>

        {/* 3. The 4 Interactive Cards (Blue & Yellow Alternating Palette) */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full flex lg:grid lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 overflow-x-auto no-scrollbar py-3 px-1 snap-x snap-mandatory scroll-smooth"
        >
          {REASONS.map((card, index) => {
            const isFlipped = !!flippedCards[index];
            const isBlue = card.type === 'blue';

            return (
              <div
                key={card.number}
                onClick={() => toggleFlip(index)}
                className={`group flex-shrink-0 w-[76vw] max-w-[310px] sm:w-[260px] md:w-[280px] lg:w-auto h-[410px] sm:h-[440px] md:h-[460px] cursor-pointer snap-start lg:snap-none transition-all duration-500 ease-out ${card.rotation} lg:hover:rotate-0 lg:hover:-translate-y-3 lg:hover:scale-[1.03] hover:z-20`}
                style={{ perspective: '1200px' }}
                title="Click to flip card"
              >
                {/* 3D Flip Wrapper */}
                <div
                  className="relative w-full h-full rounded-[28px] sm:rounded-[32px] transition-transform duration-500 ease-out shadow-[0_8px_24px_rgba(100,22,35,0.08)] lg:hover:shadow-[0_20px_35px_rgba(100,22,35,0.18)]"
                  style={{
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* ========================================================
                      FRONT SIDE OF CARD
                      ======================================================== */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 flex flex-col justify-between overflow-hidden border-[2px] ${
                      isBlue
                        ? 'bg-gradient-to-b from-[#DEEEF5] via-[#D6E8EF] to-[#C9E0EC] text-[#641623] border-[#641623]/15 lg:hover:border-[#641623]/35 shadow-[0_8px_24px_rgba(100,22,35,0.06)]'
                        : 'bg-gradient-to-b from-[#FEFBE2] via-[#FCF7D1] to-[#F5EEBD] text-[#641623] border-[#641623]/15 lg:hover:border-[#641623]/35 shadow-[0_8px_24px_rgba(100,22,35,0.06)]'
                    }`}
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(0deg) translateZ(1px)',
                      opacity: isFlipped ? 0 : 1,
                      visibility: isFlipped ? 'hidden' : 'visible',
                      pointerEvents: isFlipped ? 'none' : 'auto',
                      transition: isFlipped
                        ? 'opacity 0.14s ease 0.14s, visibility 0s linear 0.28s'
                        : 'opacity 0.14s ease 0.14s, visibility 0s linear 0s',
                    }}
                  >
                    {/* Wavy Background Shapes (Inspired by Reference) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                      <svg
                        viewBox="0 0 300 450"
                        preserveAspectRatio="none"
                        className={`w-full h-full opacity-35 ${
                          isBlue ? 'text-[#B5D6E6]' : 'text-[#ECE09E]'
                        }`}
                      >
                        <path
                          d="M -30 180 Q 80 120 180 200 T 350 220 L 350 480 L -30 480 Z"
                          fill="currentColor"
                        />
                        <circle cx="260" cy="80" r="70" fill="currentColor" opacity="0.4" />
                        <circle cx="20" cy="380" r="90" fill="currentColor" opacity="0.35" />
                      </svg>
                    </div>

                    {/* Top Row: Number Badge + Category Subtitle + Mini Flip Icon */}
                    <div className="relative z-10 flex items-center justify-between w-full">
                      {/* Number Badge */}
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-sm border border-[#641623]/20 bg-[#FFFDF9] text-[#641623]">
                        {card.number}
                      </div>

                      {/* Stat Pill */}
                      <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm border border-[#641623]/20 bg-[#FFFDF9]/85 text-[#641623]">
                        {card.statBadge}
                      </span>
                    </div>

                    {/* Card Content: Title & Description */}
                    <div className="relative z-10 mt-3 sm:mt-4 text-left">
                      <h3 className="font-['Fredoka'] font-bold text-xl sm:text-2xl leading-tight tracking-tight text-[#641623]">
                        {card.title}
                      </h3>
                      <p className="font-['Fredoka'] text-xs sm:text-[13px] leading-relaxed mt-2.5 font-medium text-[#641623]/85">
                        {card.description}
                      </p>
                    </div>

                    {/* Die-Cut Cutout Sticker Illustration (Matching Reference Vibe) */}
                    <div className="relative z-10 my-auto flex justify-center items-center py-2">
                      <div className="relative group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        {card.illustration === 'yarn' && (
                          /* Sticker 1: Yarn Ball & Crochet Hook */
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FFFDF9] p-2 shadow-md ring-4 ring-white/90 border border-[#641623]/15 flex items-center justify-center">
                            <svg viewBox="0 0 64 64" className="w-full h-full text-[#641623]" fill="none">
                              <circle cx="32" cy="32" r="24" fill="#D6E8EF" stroke="#641623" strokeWidth="2.6" />
                              <path d="M 16 26 C 24 16, 40 18, 48 28" stroke="#641623" strokeWidth="2.4" strokeLinecap="round" />
                              <path d="M 14 36 C 22 26, 42 27, 50 35" stroke="#641623" strokeWidth="2.4" strokeLinecap="round" />
                              <path d="M 20 45 C 28 38, 38 39, 44 46" stroke="#641623" strokeWidth="2.4" strokeLinecap="round" />
                              <line x1="10" y1="54" x2="54" y2="10" stroke="#FCF7D1" strokeWidth="4.5" strokeLinecap="round" />
                              <line x1="10" y1="54" x2="54" y2="10" stroke="#641623" strokeWidth="2.2" strokeLinecap="round" />
                              <circle cx="53" cy="11" r="2.5" fill="#641623" />
                            </svg>
                          </div>
                        )}

                        {card.illustration === 'artisans' && (
                          /* Sticker 2: Grandma Daadi Smiling with Yarn */
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FFFDF9] p-2 shadow-md ring-4 ring-white/90 border border-[#641623]/15 flex items-center justify-center">
                            <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                              {/* Background Circle */}
                              <circle cx="32" cy="32" r="24" fill="#FCF7D1" stroke="#641623" strokeWidth="2.6" />
                              {/* Daadi Hair Bun */}
                              <circle cx="32" cy="18" r="9" fill="#E2E8F0" stroke="#641623" strokeWidth="2" />
                              <circle cx="32" cy="27" r="11" fill="#FFE4D6" stroke="#641623" strokeWidth="2" />
                              {/* Hair Top */}
                              <path d="M 21 26 C 21 19, 43 19, 43 26" fill="#CBD5E1" stroke="#641623" strokeWidth="2" />
                              {/* Glasses */}
                              <circle cx="28" cy="28" r="3.2" stroke="#641623" strokeWidth="1.8" fill="white" />
                              <circle cx="36" cy="28" r="3.2" stroke="#641623" strokeWidth="1.8" fill="white" />
                              <line x1="31.2" y1="28" x2="32.8" y2="28" stroke="#641623" strokeWidth="1.8" />
                              {/* Eyes */}
                              <circle cx="28" cy="28" r="1.1" fill="#641623" />
                              <circle cx="36" cy="28" r="1.1" fill="#641623" />
                              {/* Smiling Mouth */}
                              <path d="M 29 33 Q 32 35.5 35 33" stroke="#641623" strokeWidth="1.6" strokeLinecap="round" />
                              {/* Rosy Cheeks */}
                              <circle cx="24" cy="30" r="1.5" fill="#F472B6" />
                              <circle cx="40" cy="30" r="1.5" fill="#F472B6" />
                              {/* Torso / Saree */}
                              <path d="M 20 50 C 22 38, 42 38, 44 50 Z" fill="#D6E8EF" stroke="#641623" strokeWidth="2" />
                              {/* Tiny Heart */}
                              <path d="M 32 45 C 30 42, 27 43, 27 45 C 27 48, 32 50, 32 50 C 32 50, 37 48, 37 45 C 37 43, 34 42, 32 45 Z" fill="#F472B6" />
                            </svg>
                          </div>
                        )}

                        {card.illustration === 'blooms' && (
                          /* Sticker 3: Everlasting Sunflower Bloom */
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FFFDF9] p-2 shadow-md ring-4 ring-white/90 border border-[#641623]/15 flex items-center justify-center">
                            <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                              <circle cx="32" cy="32" r="24" fill="#D6E8EF" stroke="#641623" strokeWidth="2.6" />
                              {/* Sunflower Petals */}
                              <g fill="#F7BE44" stroke="#641623" strokeWidth="1.8">
                                <circle cx="32" cy="19" r="5.5" />
                                <circle cx="41" cy="23" r="5.5" />
                                <circle cx="45" cy="32" r="5.5" />
                                <circle cx="41" cy="41" r="5.5" />
                                <circle cx="32" cy="45" r="5.5" />
                                <circle cx="23" cy="41" r="5.5" />
                                <circle cx="19" cy="32" r="5.5" />
                                <circle cx="23" cy="23" r="5.5" />
                              </g>
                              {/* Center Disc */}
                              <circle cx="32" cy="32" r="8.5" fill="#8B4513" stroke="#641623" strokeWidth="2" />
                              {/* Smiling Face */}
                              <circle cx="29.5" cy="31" r="1.1" fill="#FFF" />
                              <circle cx="34.5" cy="31" r="1.1" fill="#FFF" />
                              <path d="M 30 34 Q 32 36 34 34" stroke="#FFF" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                          </div>
                        )}

                        {card.illustration === 'gifting' && (
                          /* Sticker 4: Gift Box Tied with Crochet Ribbon */
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FFFDF9] p-2 shadow-md ring-4 ring-white/90 border border-[#641623]/15 flex items-center justify-center">
                            <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                              <circle cx="32" cy="32" r="24" fill="#FCF7D1" stroke="#641623" strokeWidth="2.6" />
                              {/* Gift Box Base */}
                              <rect x="20" y="28" width="24" height="20" rx="3" fill="#D6E8EF" stroke="#641623" strokeWidth="2.2" />
                              {/* Lid */}
                              <rect x="18" y="23" width="28" height="6" rx="2" fill="#F472B6" stroke="#641623" strokeWidth="2.2" />
                              {/* Ribbon Vertical */}
                              <rect x="30" y="23" width="4" height="25" fill="#641623" />
                              {/* Ribbon Bow */}
                              <path d="M 32 23 C 27 16, 22 21, 31 23 Z" fill="#F7BE44" stroke="#641623" strokeWidth="1.8" />
                              <path d="M 32 23 C 37 16, 42 21, 33 23 Z" fill="#F7BE44" stroke="#641623" strokeWidth="1.8" />
                              <circle cx="32" cy="23" r="2.2" fill="#641623" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Hint Pill */}
                    <div className="relative z-10 w-full pt-2">
                      <div className="w-full py-2 px-3 rounded-full text-center text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm border border-[#641623]/25 bg-[#FFFDF9]/90 hover:bg-[#FFFDF9] text-[#641623]">
                        <span>tap to reveal perk</span>
                        <span className="text-sm">↺</span>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================
                      BACK SIDE OF CARD (REVEALED ON CLICK)
                      ======================================================== */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 flex flex-col justify-between overflow-hidden border-[2px] ${
                      isBlue
                        ? 'bg-gradient-to-b from-[#CEE3ED] via-[#C3DDE9] to-[#B6D6E4] text-[#641623] border-[#641623]/20'
                        : 'bg-gradient-to-b from-[#F7F1C5] via-[#EFE7B1] to-[#E5DB9E] text-[#641623] border-[#641623]/20'
                    }`}
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg) translateZ(1px)',
                      opacity: isFlipped ? 1 : 0,
                      visibility: isFlipped ? 'visible' : 'hidden',
                      pointerEvents: isFlipped ? 'auto' : 'none',
                      transition: isFlipped
                        ? 'opacity 0.14s ease 0.14s, visibility 0s linear 0s'
                        : 'opacity 0.14s ease 0.14s, visibility 0s linear 0.28s',
                    }}
                  >
                    {/* Top Row: Number Badge + Close / Flip back icon */}
                    <div className="flex items-center justify-between w-full">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border border-[#641623]/20 bg-[#FFFDF9] text-[#641623]">
                        {card.number}
                      </div>

                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FFFDF9]/85 text-[#641623] border border-[#641623]/15">
                        our promise ♡
                      </span>
                    </div>

                    {/* Perk Details */}
                    <div className="my-auto text-left py-2">
                      <h4 className="font-['Fredoka'] font-bold text-lg sm:text-xl leading-tight text-[#641623]">
                        {card.perkTitle}
                      </h4>
                      <p className="font-['Fredoka'] text-xs sm:text-[13px] leading-relaxed mt-3 font-medium text-[#641623]/90">
                        {card.perkDescription}
                      </p>

                      <div className="mt-4 p-3 rounded-2xl border bg-[#FFFDF9]/80 border-[#641623]/15 text-[#641623]">
                        <p className="text-[11px] font-bold tracking-wide">
                          Handmade with love in Surat, India. Every order directly supports our artisan family.
                        </p>
                      </div>
                    </div>

                    {/* Flip Back Pill */}
                    <div className="w-full pt-2">
                      <div className="w-full py-2 px-3 rounded-full text-center text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm border border-[#641623]/25 bg-[#FFFDF9] text-[#641623]">
                        <span>tap to flip back</span>
                        <span className="text-sm">↺</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Mobile Carousel Pagination Indicator Dots */}
        <div className="flex lg:hidden items-center justify-center gap-2 mt-5">
          {REASONS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToCard(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                activeDot === idx
                  ? 'bg-[#641623] scale-110 w-5'
                  : 'border-[1.8px] border-[#641623]/50 bg-transparent'
              }`}
              aria-label={`Why choose slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
