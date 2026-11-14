import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react';

interface TheHandsBehindEveryStitchSectionProps {
  onStoryClick?: () => void;
}

interface StoryChapter {
  id: string;
  step: string;
  badge: string;
  title: string;
  headline: string;
  quote: string;
  body: string[];
  caption: string;
  imagePng: string;
  imageWebp: string;
  alt: string;
  accentBg: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 'craft-begins',
    step: '01',
    badge: 'The Beginning',
    title: 'The Craft Begins',
    headline: 'Every beautiful thing begins with a single stitch.',
    quote: 'In 2019, it started with a 16-year-old and a dream to build something special through crochet.',
    body: [
      'Along the way, we met talented daadis and aunties across our neighbourhoods who had spent lifetimes perfecting crochet, but had few opportunities to showcase their work to the world.',
      'We started bringing yarn to their doorsteps, creating work they could do comfortably from home — turning cherished craft traditions into real financial independence and self-worth.',
    ],
    caption: 'Every beautiful thing begins with a single stitch.',
    imagePng: '/stories/artisan-1-craft-begins.png',
    imageWebp: '/stories/artisan-1-craft-begins.webp',
    alt: 'Master artisan wearing glasses crocheting vibrant red yarn with patience and precision',
    accentBg: '#FFF5CC',
  },
  {
    id: 'hands-magic',
    step: '02',
    badge: 'Artisanal Mastery',
    title: 'The Hands Behind the Magic',
    headline: 'Years of skill, patience and creativity in every loop.',
    quote: 'Behind every loop is an intuition passed down through generations.',
    body: [
      'Look closely at these hands. The gentle pressure, the rings worn with time, the steady rhythm pulling purple yarn through needles — this is mastery that no factory machine on earth can replicate.',
      'Each knot holds hours of calm patience, quiet afternoons of dedication, and an authentic human warmth you can feel the moment you hold our products.',
    ],
    caption: 'Years of skill, patience and creativity in every loop.',
    imagePng: '/stories/artisan-2-hands-magic.png',
    imageWebp: '/stories/artisan-2-hands-magic.webp',
    alt: 'Macro photograph of artisan hands adorned with rings skillfully knitting purple yarn',
    accentBg: '#D9EEF5',
  },
  {
    id: 'creative-process',
    step: '03',
    badge: 'Work With Dignity',
    title: 'Creating Something Beautiful',
    headline: 'Turning simple yarn into something special.',
    quote: 'Artisans craft at their own pace, surrounded by their children and grandchildren.',
    body: [
      'Working from home allows our daadis and aunties to earn with complete freedom. They work when they want, rest when they need, and take immense pride in contributing independently to their households.',
      'From simple skeins of wool, blooming sunflower bouquets, plush companions, and delicate home keepsakes come alive — each crafted with genuine happiness.',
    ],
    caption: 'Turning simple yarn into something special.',
    imagePng: '/stories/artisan-3-creative-process.png',
    imageWebp: '/stories/artisan-3-creative-process.webp',
    alt: 'Artisan sitting comfortably at home crafting a rich orange crochet piece with golden yarn',
    accentBg: '#FFF5CC',
  },
  {
    id: 'community-creativity',
    step: '04',
    badge: 'One Family',
    title: 'A Community of Creativity',
    headline: 'Different colours. Different hands. One beautiful handmade family.',
    quote: 'More than a workshop — a sisterhood woven across hundreds of homes.',
    body: [
      'What began as a quiet conversation has united women across Surat and beyond. They share patterns, celebrate each other’s milestones, and pour their collective spirit into every piece.',
      'When you hold a Knots & Co piece, you are not holding mass-produced merchandise. You are holding a real woman’s time, skill, artistry, and story.',
    ],
    caption: 'Different colours. Different hands. One beautiful handmade family.',
    imagePng: '/stories/artisan-4-community-family.png',
    imageWebp: '/stories/artisan-4-community-family.webp',
    alt: 'Artisan hands crocheting a joyful multi-colored geometric crochet textile with diverse yarn shades',
    accentBg: '#D9EEF5',
  },
];

export const TheHandsBehindEveryStitchSection: React.FC<TheHandsBehindEveryStitchSectionProps> = ({
  onStoryClick,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Scroll tracking across the 4 storytelling chapters
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 90%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  const pathLength = prefersReduced ? 1 : smoothProgress;

  return (
    <section
      id="section-story"
      ref={sectionRef}
      className="relative w-full bg-[#FAF4ED] pt-6 sm:pt-12 pb-20 sm:pb-32 overflow-hidden text-[#2D2424] font-['Fredoka'] select-none"
      aria-label="The Hands Behind Every Stitch - Our Story and Artisans"
    >
      {/* Target anchor for navbar clicks */}
      <div id="section-artisans" className="absolute -top-24 left-0" />

      {/* Decorative Golden Wavy Top Divider */}
      <div className="w-full overflow-hidden flex justify-center -mt-4 sm:-mt-8 mb-10 sm:mb-16" aria-hidden="true">
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

      {/* =========================================================================
          1. SECTION HEADER
          ========================================================================= */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-14 sm:mb-24">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#FFF5CC] border border-[#811B2B]/20 text-[#811B2B] text-xs sm:text-sm font-bold tracking-wider uppercase mb-3.5 sm:mb-4 shadow-2xs"
        >
          <span className="text-[10px] sm:text-xs">✦</span>
          <span>THE HEART BEHIND THE HANDMADE</span>
          <span className="text-[10px] sm:text-xs">✦</span>
        </motion.div>

        {/* Main Headline with Dual-Font Pairing */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-black text-[#641623] tracking-tight leading-[1.15]"
        >
          <span>Every </span>
          <span className="font-script font-normal text-[1.22em] text-[#811B2B] inline-block -rotate-2 px-1">
            stitch
          </span>
          <span> has a story.</span>
        </motion.h2>

        {/* Supporting Introduction */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3.5 sm:mt-5 text-base sm:text-xl md:text-2xl text-[#2D2424]/85 font-normal max-w-2xl mx-auto leading-relaxed italic"
        >
          &ldquo;Behind every little handmade treasure are hands filled with skill, patience and love.&rdquo;
        </motion.p>
      </div>

      {/* =========================================================================
          2. THE EDITORIAL STORY CHAPTERS WITH 4 REAL PHOTOGRAPHS
          ========================================================================= */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Background "Follow the Thread" Yarn Line on Desktop */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 1152 2800"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Guide faint yarn shadow */}
            <path
              d="M 576 0 C 576 150, 240 250, 240 500 C 240 750, 900 850, 900 1150 C 900 1450, 250 1550, 250 1850 C 250 2150, 880 2250, 880 2450 C 880 2600, 620 2680, 576 2740"
              stroke="#811B2B"
              strokeWidth="3.5"
              strokeOpacity="0.08"
              strokeLinecap="round"
            />
            {/* Dynamic Animated Scroll Yarn Thread */}
            <motion.path
              d="M 576 0 C 576 150, 240 250, 240 500 C 240 750, 900 850, 900 1150 C 900 1450, 250 1550, 250 1850 C 250 2150, 880 2250, 880 2450 C 880 2600, 620 2680, 576 2740"
              stroke="#811B2B"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeDasharray="8 6"
              style={{ pathLength }}
            />
          </svg>
        </div>

        {/* Mobile "Follow the Thread" Left Edge Line */}
        <div className="lg:hidden absolute top-0 bottom-0 left-6 sm:left-10 w-1 pointer-events-none z-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 4 2800"
            fill="none"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M 2 0 L 2 2800"
              stroke="#811B2B"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>
        </div>

        {/* 4 Storytelling Chapters */}
        <div className="relative z-10 space-y-20 sm:space-y-32 lg:space-y-40">
          {CHAPTERS.map((item, index) => {
            const isEven = index % 2 === 1;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col ${
                  isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } items-center gap-8 sm:gap-12 lg:gap-16 xl:gap-20`}
              >
                {/* PHOTOGRAPH CONTAINER (Occupies 55-60% width on desktop) */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: prefersReduced ? 1 : 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.01, margin: '200px 0px 200px 0px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full lg:w-[58%] flex-shrink-0"
                >
                  <div className="relative group">
                    {/* Soft Craft Tint Frame */}
                    <div
                      className="absolute -inset-2.5 sm:-inset-3.5 rounded-[30px] sm:rounded-[38px] opacity-75 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                      style={{ backgroundColor: item.accentBg }}
                    />

                    {/* Editorial Photo Frame with Soft Natural Shadow */}
                    <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-[#EFE6DC] border-[2px] border-[#811B2B]/15 shadow-[0_12px_36px_rgba(100,22,35,0.08)]">
                      <picture>
                        <source srcSet={item.imageWebp} type="image/webp" />
                        <img
                          src={item.imagePng}
                          alt={item.alt}
                          loading="eager"
                          decoding="async"
                          className="w-full h-auto max-h-[580px] object-cover select-none transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                        />
                      </picture>

                      {/* Step Corner Stamp */}
                      <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#FFFDF8]/92 backdrop-blur-md border border-[#811B2B]/20 shadow-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#811B2B]" />
                        <span className="font-['Fredoka'] font-bold text-xs sm:text-sm text-[#641623]">
                          {item.step} • {item.badge}
                        </span>
                      </div>
                    </div>

                    {/* Immediate Caption Directly Below Photograph */}
                    <div className="mt-3 sm:mt-4 px-2 sm:px-3 flex items-start gap-2.5">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[#811B2B] flex-shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <p className="font-['Fredoka'] text-xs sm:text-sm font-semibold text-[#641623]/80 italic leading-snug">
                        &ldquo;{item.caption}&rdquo;
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* TEXT EDITORIAL COLUMN (Remaining ~42% space) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.01, margin: '200px 0px 200px 0px' }}
                  transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full lg:w-[42%] flex flex-col justify-center text-left"
                >
                  {/* Chapter Eyebrow */}
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="font-bold text-xs sm:text-sm text-[#811B2B] uppercase tracking-wider font-['Fredoka']">
                      Chapter {item.step}
                    </span>
                    <span className="w-8 h-[1.5px] bg-[#811B2B]/40" />
                  </div>

                  {/* Chapter Title */}
                  <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#641623] tracking-tight mb-2.5 sm:mb-3.5">
                    {item.title}
                  </h3>

                  {/* Pull-Quote Headline */}
                  <div className="relative pl-3.5 sm:pl-4 border-l-2 border-[#811B2B]/40 mb-3.5 sm:mb-4">
                    <p className="font-['Fredoka'] font-bold text-lg sm:text-xl text-[#811B2B] leading-snug">
                      {item.headline}
                    </p>
                  </div>

                  {/* Narrative Body Paragraphs */}
                  <div className="space-y-2.5 sm:space-y-3 font-normal text-sm sm:text-base text-[#2D2424]/85 leading-relaxed">
                    {item.body.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

                  {/* Subtle Craft Footnote */}
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#811B2B]/12 flex items-center gap-2 text-xs sm:text-sm text-[#641623]/70 font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#811B2B]" />
                    <span>100% Handcrafted by Women Artisans</span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          3. THE COMMUNITY IMPACT MOMENT (200+ Nanis, Daadis, Aunties & Artisans)
          ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 sm:mt-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.01, margin: '200px 0px 200px 0px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] sm:rounded-[44px] bg-[#FFF5CC] border-[2.5px] border-[#811B2B]/20 p-7 sm:p-12 lg:p-16 shadow-[0_16px_48px_rgba(100,22,35,0.08)]"
        >
          {/* Subtle Decorative Background Stitches */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-[#FAF4ED]/50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-[#D9EEF5]/40 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Giant Statistic & Title */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Year Detail */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF8] border border-[#811B2B]/20 text-[#811B2B] text-xs sm:text-sm font-bold tracking-wide uppercase mb-3 sm:mb-4">
                <span>✦ Since 2019, made with love ✦</span>
              </div>

              {/* 200+ Number */}
              <div className="font-['Fredoka'] font-black text-6xl sm:text-7xl lg:text-8xl text-[#811B2B] tracking-tight leading-none mb-2 sm:mb-3">
                200+
              </div>

              {/* Artisan Community Label */}
              <h3 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-[#641623] tracking-tight leading-tight mb-4">
                Nanis, daadis, aunties and artisans
              </h3>

              {/* Supporting Copy */}
              <p className="font-normal text-sm sm:text-base lg:text-lg text-[#2D2424]/85 leading-relaxed max-w-xl">
                What began as one little dream has grown into a community of talented women creating beautiful things, one stitch at a time.
              </p>
            </div>

            {/* Right: Line-Art Mascot & Subtle Badge */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              {/* Official Mascot Accent (Tastefully Sized, Not Distracting) */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                <img
                  src="/knotsnco_mascot_transparent.gif"
                  alt="Official Knots & Co yarn ball mascot smiling with a crochet hook and heart tail"
                  className="w-full h-full object-contain select-none drop-shadow-md"
                  loading="lazy"
                />
              </div>
              <span className="mt-2 text-xs font-bold text-[#811B2B] uppercase tracking-wider font-['Fredoka'] text-center">
                Handmade with Pride in Surat
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =========================================================================
          4. FINAL STORY CLOSING MESSAGE (Warm, Dignified & Emotional)
          ========================================================================= */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16 sm:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.01, margin: '200px 0px 200px 0px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 sm:space-y-5"
        >
          {/* Closing Headline with Dual Font */}
          <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#641623] tracking-tight">
            <span>More than crochet. It&apos;s a </span>
            <span className="font-script font-normal text-[1.22em] text-[#811B2B] inline-block -rotate-2">
              community.
            </span>
          </h3>

          {/* Closing Body Copy */}
          <p className="font-normal text-sm sm:text-base md:text-lg text-[#2D2424]/85 leading-relaxed max-w-2xl mx-auto">
            Every bouquet, plushie and little treasure carries the creativity and care of the hands that made it.
            When you choose handmade, you&apos;re celebrating their skills and becoming a little part of their story.
          </p>

          {/* Closing Line */}
          <div className="pt-2 sm:pt-4">
            <p className="font-['Fredoka'] text-lg sm:text-2xl font-bold text-[#811B2B]">
              <span>A little yarn. A lot of </span>
              <span className="font-script font-normal text-[1.25em] text-[#811B2B]">love</span>
              <span>. ♡</span>
            </p>
          </div>

          {/* Optional Action Button */}
          {onStoryClick && (
            <div className="pt-3 sm:pt-5">
              <button
                type="button"
                onClick={onStoryClick}
                className="inline-flex items-center justify-center min-w-[180px] sm:min-w-[220px] py-2.5 sm:py-3.5 px-6 sm:px-8 rounded-full border-[2.2px] border-[#641623] text-[#641623] font-['Fredoka'] font-bold text-sm sm:text-base tracking-wide hover:bg-[#641623] hover:text-[#FAF4ED] transition-all duration-200 cursor-pointer"
              >
                <span>explore </span>
                <span className="font-script font-normal text-[1.18em] lowercase ml-1">our collection</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
