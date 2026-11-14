import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { ArrowLeft, Heart, Sparkles, ShoppingBag } from 'lucide-react';

interface BehindTheStitchesPageProps {
  onNavigateHome: () => void;
  onNavigateShop: (category?: string) => void;
}

interface StoryChapter {
  id: string;
  step: string;
  badge: string;
  title: string;
  headline: string;
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
    body: [
      'In 2019, it all began with a 16-year-old and a dream to build something special through crochet. But the real soul of Knots & Co came to life when we met talented daadis and aunties across our neighbourhoods — women with decades of untaught mastery waiting for an opportunity to shine.',
      'We started bringing yarn to their doorsteps, creating work they could do comfortably from home — turning cherished craft traditions into real financial independence, self-reliance, and pride.',
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

export const BehindTheStitchesPage: React.FC<BehindTheStitchesPageProps> = ({
  onNavigateHome,
  onNavigateShop,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Scroll to top upon mounting this dedicated page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Smooth scroll tracking for the continuous yarn thread
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 90%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  const pathLength = prefersReduced ? 1 : smoothProgress;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#FAF4ED] text-[#2D2424] font-['Fredoka'] select-none overflow-x-hidden"
    >
      {/* =========================================================================
          TOP BREADCRUMBS & RETURN BUTTON
          ========================================================================= */}
      <div className="w-full bg-[#FFFDF8] border-b border-[#641623]/10 py-3 px-4 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#641623] hover:text-[#811B2B] hover:-translate-x-0.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#641623]/60 font-medium">
            <span
              onClick={onNavigateHome}
              className="hover:underline cursor-pointer"
            >
              Home
            </span>
            <span>/</span>
            <span className="text-[#811B2B] font-bold">Behind The Stitches</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          EDITORIAL HERO HEADER
          ========================================================================= */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 sm:pt-16 pb-12 sm:pb-20">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5CC] border border-[#811B2B]/20 text-[#811B2B] text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#811B2B]" />
          <span>THE HEART BEHIND THE HANDMADE</span>
          <Sparkles className="w-3.5 h-3.5 text-[#811B2B]" />
        </motion.div>

        {/* Page Title with Dual-Font Pairing */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-[#641623] tracking-tight leading-[1.12]"
        >
          <span>Behind The </span>
          <span className="font-script font-normal text-[1.25em] text-[#811B2B] inline-block -rotate-2 px-1">
            Stitches
          </span>
        </motion.h1>

        {/* Headline Quote */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-[#811B2B] tracking-tight"
        >
          <span>Every </span>
          <span className="font-script font-normal text-[1.18em] text-[#811B2B] inline-block -rotate-2 px-0.5">
            stitch
          </span>
          <span> has a story.</span>
        </motion.h2>

        {/* Supporting Introduction */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 sm:mt-6 text-base sm:text-xl md:text-2xl text-[#2D2424]/85 font-normal max-w-2xl mx-auto leading-relaxed italic"
        >
          &ldquo;Behind every little handmade treasure are hands filled with skill, patience and love.&rdquo;
        </motion.p>
      </div>

      {/* =========================================================================
          THE 4 EDITORIAL CHAPTERS WITH THE REAL PHOTOGRAPHS
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
            <path
              d="M 576 0 C 576 150, 240 250, 240 500 C 240 750, 900 850, 900 1150 C 900 1450, 250 1550, 250 1850 C 250 2150, 880 2250, 880 2450 C 880 2600, 620 2680, 576 2740"
              stroke="#811B2B"
              strokeWidth="3.5"
              strokeOpacity="0.08"
              strokeLinecap="round"
            />
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

        {/* Mobile Left Thread */}
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

        {/* 4 Chapters */}
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
                {/* PHOTOGRAPH CONTAINER (58% width on desktop) */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: prefersReduced ? 1 : 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.01, margin: '200px 0px 200px 0px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full lg:w-[58%] flex-shrink-0"
                >
                  <div className="relative group">
                    {/* Soft Craft Frame Tint */}
                    <div
                      className="absolute -inset-2.5 sm:-inset-3.5 rounded-[30px] sm:rounded-[38px] opacity-75 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                      style={{ backgroundColor: item.accentBg }}
                    />

                    {/* Editorial Photo Frame */}
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

                      {/* Step Badge */}
                      <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#FFFDF8]/92 backdrop-blur-md border border-[#811B2B]/20 shadow-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#811B2B]" />
                        <span className="font-['Fredoka'] font-bold text-xs sm:text-sm text-[#641623]">
                          {item.step} • {item.badge}
                        </span>
                      </div>
                    </div>

                    {/* Caption Directly Below Photograph */}
                    <div className="mt-3 sm:mt-4 px-2 sm:px-3 flex items-start gap-2.5">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#811B2B] flex-shrink-0 mt-0.5 fill-[#811B2B]/20" />
                      <p className="font-['Fredoka'] text-xs sm:text-sm font-semibold text-[#641623]/80 italic leading-snug">
                        &ldquo;{item.caption}&rdquo;
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* TEXT EDITORIAL COLUMN */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.01, margin: '200px 0px 200px 0px' }}
                  transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full lg:w-[42%] flex flex-col justify-center text-left"
                >
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="font-bold text-xs sm:text-sm text-[#811B2B] uppercase tracking-wider font-['Fredoka']">
                      Chapter {item.step}
                    </span>
                    <span className="w-8 h-[1.5px] bg-[#811B2B]/40" />
                  </div>

                  <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#641623] tracking-tight mb-2.5 sm:mb-3.5">
                    {item.title}
                  </h3>

                  <div className="relative pl-3.5 sm:pl-4 border-l-2 border-[#811B2B]/40 mb-3.5 sm:mb-4">
                    <p className="font-['Fredoka'] font-bold text-lg sm:text-xl text-[#811B2B] leading-snug">
                      {item.headline}
                    </p>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3 font-normal text-sm sm:text-base text-[#2D2424]/85 leading-relaxed">
                    {item.body.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

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
          THE COMMUNITY IMPACT MOMENT (200+ Nanis, Daadis, Aunties & Artisans)
          ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 sm:mt-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.01, margin: '200px 0px 200px 0px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] sm:rounded-[44px] bg-[#FFF5CC] border-[2.5px] border-[#811B2B]/20 p-7 sm:p-12 lg:p-16 shadow-[0_16px_48px_rgba(100,22,35,0.08)]"
        >
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-[#FAF4ED]/50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-[#D9EEF5]/40 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Giant Statistic & Title */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF8] border border-[#811B2B]/20 text-[#811B2B] text-xs sm:text-sm font-bold tracking-wide uppercase mb-3 sm:mb-4">
                <span>✦ Since 2019, made with love ✦</span>
              </div>

              <div className="font-['Fredoka'] font-black text-6xl sm:text-7xl lg:text-8xl text-[#811B2B] tracking-tight leading-none mb-2 sm:mb-3">
                200+
              </div>

              <h3 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-[#641623] tracking-tight leading-tight mb-4">
                Nanis, daadis, aunties and artisans
              </h3>

              <p className="font-normal text-sm sm:text-base lg:text-lg text-[#2D2424]/85 leading-relaxed max-w-xl">
                What began as one little dream has grown into a community of talented women creating beautiful things, one stitch at a time.
              </p>
            </div>

            {/* Right: Knots & Co Mascot */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
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
          FINAL STORY CLOSING MESSAGE & CALL TO ACTION
          ========================================================================= */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16 sm:mt-24 mb-16 sm:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.01, margin: '200px 0px 200px 0px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 sm:space-y-6"
        >
          <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#641623] tracking-tight">
            <span>More than crochet. It&apos;s a </span>
            <span className="font-script font-normal text-[1.22em] text-[#811B2B] inline-block -rotate-2">
              community.
            </span>
          </h3>

          <p className="font-normal text-sm sm:text-base md:text-lg text-[#2D2424]/85 leading-relaxed max-w-2xl mx-auto">
            Every bouquet, plushie and little treasure carries the creativity and care of the hands that made it.
            When you choose handmade, you&apos;re celebrating their skills and becoming a little part of their story.
          </p>

          <div>
            <p className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-[#811B2B]">
              <span>A little yarn. A lot of </span>
              <span className="font-script font-normal text-[1.25em] text-[#811B2B]">love</span>
              <span>. ♡</span>
            </p>
          </div>

          {/* Action Button to Shop */}
          <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigateShop('all')}
              className="inline-flex items-center justify-center gap-2 min-w-[200px] sm:min-w-[240px] py-3.5 px-7 rounded-full bg-[#811B2B] text-white font-['Fredoka'] font-bold text-sm sm:text-base tracking-wide hover:bg-[#641623] shadow-md hover:shadow-lg transition-all active:scale-97 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Handcrafted Pieces</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="inline-flex items-center justify-center gap-2 min-w-[170px] py-3.5 px-6 rounded-full border-[2px] border-[#641623] text-[#641623] font-['Fredoka'] font-bold text-sm sm:text-base tracking-wide hover:bg-[#641623] hover:text-[#FAF4ED] transition-all cursor-pointer"
            >
              <span>Back to Home</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
