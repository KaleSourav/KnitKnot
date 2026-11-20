import React, { useState, useRef } from 'react';

interface ReasonCard {
  number: string;
  title: string;
  description: string;
  type: 'blue' | 'yellow';
  rotationDesktop: string;
  rotationMobile: string;
  zIndex: string;
  overlapDesktop: string;
  contentPaddingDesktop: string;
  titleMaxWidthDesktop: string;
}

const REASONS: ReasonCard[] = [
  {
    number: '01',
    title: '100% handmade with love',
    description:
      'Every single petal, plushie, and knot is patiently crocheted by hand. No factory machines, no shortcuts — just genuine warmth in every stitch.',
    type: 'blue',
    rotationDesktop: 'lg:-rotate-[6deg]',
    rotationMobile: '-rotate-[2deg]',
    zIndex: 'z-10',
    overlapDesktop: '',
    contentPaddingDesktop: 'lg:pr-14 xl:pr-18 2xl:pr-20',
    titleMaxWidthDesktop: 'max-w-[260px] xl:max-w-[310px] 2xl:max-w-[340px]',
  },
  {
    number: '02',
    title: 'empowering 200+ daadis',
    description:
      'Your orders bring flexible, independent work to 200+ daadis and aunties across homes in India, giving their golden skills the pride they deserve.',
    type: 'yellow',
    rotationDesktop: 'lg:-rotate-[2deg]',
    rotationMobile: 'rotate-[1.5deg]',
    zIndex: 'z-30',
    overlapDesktop: 'lg:-ml-12 xl:-ml-16 2xl:-ml-20',
    contentPaddingDesktop: '',
    titleMaxWidthDesktop: 'max-w-[300px] xl:max-w-[360px] 2xl:max-w-[390px]',
  },
  {
    number: '03',
    title: 'blooms that never wilt',
    description:
      'Real flowers wither away in a few days. Our crochet treasures stay vibrant year after year — a forever keepsake of your sweetest moments.',
    type: 'blue',
    rotationDesktop: 'lg:rotate-[2.5deg]',
    rotationMobile: '-rotate-[1.5deg]',
    zIndex: 'z-20',
    overlapDesktop: 'lg:-ml-12 xl:-ml-16 2xl:-ml-20',
    contentPaddingDesktop: 'lg:pl-14 xl:pl-18 2xl:pl-20',
    titleMaxWidthDesktop: 'max-w-[260px] xl:max-w-[310px] 2xl:max-w-[340px]',
  },
  {
    number: '04',
    title: 'thoughtful & custom gifting',
    description:
      'Packed like a parcel from home with custom handwritten note cards, lovely ribbon wraps, and bespoke color choices for every celebration.',
    type: 'yellow',
    rotationDesktop: 'lg:rotate-[6deg]',
    rotationMobile: 'rotate-[2deg]',
    zIndex: 'z-10',
    overlapDesktop: 'lg:-ml-12 xl:-ml-16 2xl:-ml-20',
    contentPaddingDesktop: 'lg:pl-14 xl:pl-18 2xl:pl-20',
    titleMaxWidthDesktop: 'max-w-[260px] xl:max-w-[310px] 2xl:max-w-[340px]',
  },
];

export const WhyChooseSection: React.FC = () => {
  const [activeDot, setActiveDot] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const { scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      scrollRef.current.scrollTo({
        left: (maxScroll / (REASONS.length - 1)) * index,
        behavior: 'smooth',
      });
      setActiveDot(index);
    }
  };

  return (
    <section className="w-full bg-[#FBF8CF] pt-8 pb-20 sm:pt-14 sm:pb-28 overflow-hidden font-['Fredoka'] select-none">
      <div className="w-full max-w-[1780px] 2xl:max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Whimsical Curvy Dashed Stitch Divider */}
        <div className="w-full flex justify-center mb-5 sm:mb-7" aria-hidden="true">
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
            {/* Center Mascot Badge */}
            <g transform="translate(600, 24)">
              <circle cx="0" cy="0" r="16" fill="#FBF8CF" stroke="#641623" strokeWidth="2.4" />
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

        {/* Section Heading */}
        <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-16">
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

            <h2 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[44px] text-[#641623] tracking-tight">
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
          <p className="font-['Fredoka'] text-sm sm:text-base text-[#641623]/75 mt-1.5 max-w-md">
            a little yarn, a lot of love, and a forever keepsake for you ♡
          </p>
        </div>

        {/* The 4 Big Fanned Cards — Replicating the Russian Reference Exactly */}
        <div className="w-full flex justify-center py-4 sm:py-8">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="w-full flex lg:justify-center items-center overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 sm:px-6 py-10 sm:py-16"
          >
            {REASONS.map((card, index) => {
              const isBlue = card.type === 'blue';
              const isCard2 = card.number === '02';

              return (
                <div
                  key={card.number}
                  className={`group relative flex-shrink-0 w-[84vw] max-w-[340px] sm:w-[350px] md:w-[370px] lg:w-[325px] xl:w-[385px] 2xl:w-[430px] h-[520px] sm:h-[550px] lg:h-[570px] xl:h-[620px] 2xl:h-[660px] rounded-[34px] sm:rounded-[40px] xl:rounded-[46px] p-6 sm:p-8 xl:p-10 flex flex-col justify-between overflow-hidden border border-[#641623]/12 transition-all duration-400 ease-out snap-center lg:snap-none ${card.zIndex} ${card.overlapDesktop} ${card.rotationMobile} ${card.rotationDesktop} lg:hover:rotate-0 lg:hover:-translate-y-8 lg:hover:scale-[1.04] lg:hover:z-50 shadow-[0_20px_50px_rgba(100,22,35,0.11)] lg:hover:shadow-[0_32px_70px_rgba(100,22,35,0.24)] cursor-pointer ${
                    isBlue
                      ? 'bg-gradient-to-b from-[#E2F0F6] via-[#D6EBF4] to-[#C9E4EF] text-[#641623]'
                      : 'bg-gradient-to-b from-[#FFF9DA] via-[#FEF4C5] to-[#FCEEB2] text-[#641623]'
                  }`}
                >
                  {/* Organic Wave SVGs (Matching Reference Curves) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                    {index === 0 && (
                      <svg viewBox="0 0 300 460" preserveAspectRatio="none" className="w-full h-full text-[#B9DCEB]">
                        <path d="M -20 180 C 80 140, 160 250, 320 190 L 320 480 L -20 480 Z" fill="currentColor" opacity="0.5" />
                        <path d="M -20 280 C 90 240, 190 330, 320 280 L 320 480 L -20 480 Z" fill="currentColor" opacity="0.38" />
                      </svg>
                    )}
                    {index === 1 && (
                      <svg viewBox="0 0 300 460" preserveAspectRatio="none" className="w-full h-full text-[#F4E396]">
                        <path d="M -20 140 C 110 190, 210 110, 320 160 L 320 480 L -20 480 Z" fill="currentColor" opacity="0.5" />
                        <circle cx="260" cy="70" r="85" fill="currentColor" opacity="0.3" />
                      </svg>
                    )}
                    {index === 2 && (
                      <svg viewBox="0 0 300 460" preserveAspectRatio="none" className="w-full h-full text-[#B9DCEB]">
                        <path d="M 120 -20 C 190 120, 130 280, 320 440 L 320 480 L 140 480 C 60 300, 110 140, 70 -20 Z" fill="currentColor" opacity="0.4" />
                        <path d="M -20 290 C 90 250, 180 340, 320 290 L 320 480 L -20 480 Z" fill="currentColor" opacity="0.45" />
                      </svg>
                    )}
                    {index === 3 && (
                      <svg viewBox="0 0 300 460" preserveAspectRatio="none" className="w-full h-full text-[#F4E396]">
                        <path d="M 60 -20 C 190 60, 260 200, 320 250 L 320 -20 Z" fill="currentColor" opacity="0.3" />
                        <path d="M -20 210 C 130 170, 160 330, 320 270 L 320 480 L -20 480 Z" fill="currentColor" opacity="0.45" />
                        <circle cx="240" cy="380" r="95" fill="currentColor" opacity="0.25" />
                      </svg>
                    )}
                  </div>

                  {/* Top Area: Number Badge + Large Chunky Title */}
                  <div className={`relative z-10 flex flex-col text-left ${card.contentPaddingDesktop}`}>
                    {/* Top-Left Circular Number Badge */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 xl:w-14 xl:h-14 rounded-full flex items-center justify-center font-black text-sm sm:text-base xl:text-lg shadow-sm ring-1 ring-[#641623]/10 bg-[#FFFDF9] text-[#641623]">
                      {card.number}
                    </div>

                    {/* Massive Bold Title (Like Reference Russian Typography) */}
                    <h3 className={`font-['Fredoka'] font-black text-[27px] sm:text-[31px] lg:text-[32px] xl:text-[38px] 2xl:text-[42px] leading-[1.06] tracking-tight text-[#641623] mt-5 sm:mt-6 ${card.titleMaxWidthDesktop}`}>
                      {card.title}
                    </h3>

                    {/* On Card 2: Description sits right underneath title, followed by bottom sticker */}
                    {isCard2 && (
                      <p className="font-['Fredoka'] text-[13px] sm:text-sm xl:text-[15.5px] 2xl:text-base leading-relaxed text-[#641623]/85 mt-4 sm:mt-5 font-medium max-w-[280px] xl:max-w-[340px]">
                        {card.description}
                      </p>
                    )}
                  </div>

                  {/* On Card 2: Die-Cut Cutout Sticker Popping Out at the Bottom Edge */}
                  {isCard2 ? (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 sm:translate-y-2 pointer-events-none select-none z-20 w-[94%] max-w-[320px] sm:max-w-[360px] xl:max-w-[400px] 2xl:max-w-[440px] flex justify-center items-end">
                      <img
                        src="/story/crochet-sticker-card2.png"
                        alt="Handmade crochet craft sticker"
                        className="w-full h-auto object-contain drop-shadow-[0_18px_32px_rgba(100,22,35,0.22)] transition-transform duration-400 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    /* On Cards 1, 3, 4: Spacious Middle Area & Description Sits at the Bottom */
                    <div className={`relative z-10 mt-auto pt-6 text-left ${card.contentPaddingDesktop}`}>
                      <p className="font-['Fredoka'] text-[13px] sm:text-sm xl:text-[15.5px] 2xl:text-base leading-relaxed text-[#641623]/85 font-medium">
                        {card.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Carousel Pagination Indicator Dots */}
        <div className="flex lg:hidden items-center justify-center gap-2 mt-4">
          {REASONS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToCard(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                activeDot === idx
                  ? 'bg-[#641623] w-5'
                  : 'w-2.5 border-[1.8px] border-[#641623]/50 bg-transparent'
              }`}
              aria-label={`Why choose slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
