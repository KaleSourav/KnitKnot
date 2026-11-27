import React, { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion, AnimatePresence } from 'motion/react';

interface TheHandsBehindEveryStitchSectionProps {
  onStoryClick?: () => void;
}

interface StoryChapter {
  id: string;
  step: string;
  badge: string;
  emoji: string;
  title: string;
  headline: string;
  quote: string;
  body: string[];
  caption: string;
  imagePng: string;
  imageWebp: string;
  alt: string;
  accentBg: string;
  accentBorder: string;
  badgeBg: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 'craft-begins',
    step: '01',
    badge: 'The Beginning',
    emoji: '🧶',
    title: 'Where It All Started',
    headline: 'Every beautiful thing begins with a single stitch.',
    quote: '"In 2019, a 16-year-old with a dream met a nani with golden hands."',
    body: [
      'Along the way, we met talented nanis, daadis and aunties across our neighbourhoods — women who had spent lifetimes perfecting crochet, but had few opportunities to share their art with the world.',
      'We started bringing yarn to their doorsteps, creating work they could do comfortably from home — turning cherished craft traditions into real financial independence and self-worth.',
    ],
    caption: 'Every beautiful thing begins with a single stitch.',
    imagePng: '/stories/artisan-1-craft-begins.png',
    imageWebp: '/stories/artisan-1-craft-begins.webp',
    alt: 'Nani artisan wearing glasses crocheting vibrant red yarn with patience and precision',
    accentBg: '#FFF5CC',
    accentBorder: '#F7BE44',
    badgeBg: '#FFF5CC',
  },
  {
    id: 'hands-magic',
    step: '02',
    badge: 'Nani\'s Magic',
    emoji: '💛',
    title: 'Nani\'s Hands, Nani\'s Heart',
    headline: 'Years of skill, patience and creativity in every loop.',
    quote: '"Behind every loop is an intuition passed down through generations — from her nani, to her, to us."',
    body: [
      'Look closely at these hands. The gentle pressure, the rings worn with time, the steady rhythm pulling yarn through needles — this is mastery that no factory machine on earth can replicate.',
      'Each knot holds hours of calm patience, quiet afternoons of dedication, and an authentic human warmth you can feel the moment you hold our products.',
    ],
    caption: 'Years of skill, patience and creativity in every loop.',
    imagePng: '/stories/artisan-2-hands-magic.png',
    imageWebp: '/stories/artisan-2-hands-magic.webp',
    alt: 'Nani artisan hands adorned with rings skillfully knitting purple yarn',
    accentBg: '#D9EEF5',
    accentBorder: '#7BBFD4',
    badgeBg: '#D9EEF5',
  },
  {
    id: 'creative-process',
    step: '03',
    badge: 'Work With Dignity',
    emoji: '🏡',
    title: 'Creating at Her Own Pace',
    headline: 'Turning simple yarn into something extraordinary.',
    quote: '"She works surrounded by her grandchildren — a cup of chai at her side, joy in every stitch."',
    body: [
      'Working from home allows our nanis and aunties to earn with complete freedom. They work when they want, rest when they need, and take immense pride in contributing independently to their households.',
      'From simple skeins of wool, blooming sunflower bouquets, plush companions, and delicate home keepsakes come alive — each crafted with genuine happiness.',
    ],
    caption: 'Turning simple yarn into something extraordinary.',
    imagePng: '/stories/artisan-3-creative-process.png',
    imageWebp: '/stories/artisan-3-creative-process.webp',
    alt: 'Nani artisan sitting comfortably at home crafting a rich orange crochet piece with golden yarn',
    accentBg: '#FFF5CC',
    accentBorder: '#F7BE44',
    badgeBg: '#FFF5CC',
  },
  {
    id: 'community-creativity',
    step: '04',
    badge: 'One Family',
    emoji: '🌸',
    title: 'A Sisterhood of Stitches',
    headline: 'Different colours. Different hands. One beautiful handmade family.',
    quote: '"More than a workshop — a sisterhood woven across hundreds of homes."',
    body: [
      'What began as a quiet conversation has united nanis across Surat and beyond. They share patterns, celebrate each other\'s milestones, and pour their collective spirit into every piece.',
      'When you hold a Knots & Co piece, you are holding a real nani\'s time, skill, artistry, and love.',
    ],
    caption: 'Different colours. Different hands. One beautiful handmade family.',
    imagePng: '/stories/artisan-4-community-family.png',
    imageWebp: '/stories/artisan-4-community-family.webp',
    alt: 'Nani artisan hands crocheting a joyful multi-colored geometric crochet textile',
    accentBg: '#D9EEF5',
    accentBorder: '#7BBFD4',
    badgeBg: '#D9EEF5',
  },
];

const STATS = [
  { number: '200+', label: 'Nani Artisans', emoji: '👵' },
  { number: '2019', label: 'Founded', emoji: '🧶' },
  { number: '351+', label: 'Products', emoji: '🌸' },
  { number: '100%', label: 'Handmade', emoji: '💛' },
];

// Floating heart burst on click
function HeartBurst({ x, y, id, onDone }: { x: number; y: number; id: number; onDone: (id: number) => void }) {
  return (
    <motion.div
      key={id}
      className="fixed pointer-events-none z-50 text-xl select-none"
      style={{ left: x - 12, top: y - 12 }}
      initial={{ opacity: 1, scale: 0.5, y: 0 }}
      animate={{ opacity: 0, scale: 1.6, y: -55 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      onAnimationComplete={() => onDone(id)}
    >
      ♡
    </motion.div>
  );
}

export const TheHandsBehindEveryStitchSection: React.FC<TheHandsBehindEveryStitchSectionProps> = ({
  onStoryClick,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [activeChapter, setActiveChapter] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const heartIdRef = useRef(0);
  const chapter = CHAPTERS[activeChapter];

  // Scroll-driven yarn thread
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 85%'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });
  const pathLength = prefersReduced ? 1 : smoothProgress;
  const headerY = useTransform(smoothProgress, [0, 1], ['0%', '-6%']);

  const handleHeartClick = useCallback((e: React.MouseEvent) => {
    const id = heartIdRef.current++;
    setHearts((h) => [...h, { id, x: e.clientX, y: e.clientY }]);
  }, []);

  const removeHeart = useCallback((id: number) => {
    setHearts((h) => h.filter((hh) => hh.id !== id));
  }, []);

  return (
    <section
      id="section-story"
      ref={sectionRef}
      className="relative w-full bg-[#FBF8CF] pt-6 sm:pt-14 pb-16 sm:pb-32 overflow-hidden text-[#2D2424] font-['Fredoka'] select-none"
      aria-label="Meet Nani — The Hands Behind Every Stitch"
    >
      {/* Floating hearts portal */}
      {hearts.map((h) => (
        <HeartBurst key={h.id} x={h.x} y={h.y} id={h.id} onDone={removeHeart} />
      ))}

      <div id="section-artisans" className="absolute -top-24 left-0" />

      {/* Top wavy divider */}
      <div className="w-full overflow-hidden flex justify-center -mt-4 sm:-mt-8 mb-8 sm:mb-14" aria-hidden="true">
        <svg viewBox="0 0 1440 24" fill="none" preserveAspectRatio="none" className="w-full h-4 sm:h-5 text-[#F7BE44]">
          <path
            d="M0 12 C 30 0, 60 24, 90 12 C 120 0, 150 24, 180 12 C 210 0, 240 24, 270 12 C 300 0, 330 24, 360 12 C 390 0, 420 24, 450 12 C 480 0, 510 24, 540 12 C 570 0, 600 24, 630 12 C 660 0, 690 24, 720 12 C 750 0, 780 24, 810 12 C 840 0, 870 24, 900 12 C 930 0, 960 24, 990 12 C 1020 0, 1050 24, 1080 12 C 1110 0, 1140 24, 1170 12 C 1200 0, 1230 24, 1260 12 C 1290 0, 1320 24, 1350 12 C 1380 0, 1410 24, 1440 12"
            stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"
          />
        </svg>
      </div>

      {/* ── 1. HEADER ─────────────────────────────────────────────────────── */}
      <motion.div
        style={prefersReduced ? undefined : { y: headerY }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-20"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5CC] border border-[#811B2B]/20 text-[#811B2B] text-xs sm:text-sm font-bold tracking-wider uppercase mb-3.5 shadow-sm"
        >
          <span>👵</span>
          <span>MEET NANI</span>
          <span>🧶</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-black text-[#641623] tracking-tight leading-[1.15]"
        >
          <span>The hands behind </span>
          <span className="font-script font-normal text-[1.18em] text-[#811B2B] inline-block -rotate-2 px-1">
            every stitch.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3.5 sm:mt-5 text-base sm:text-xl md:text-2xl text-[#2D2424]/80 font-normal max-w-2xl mx-auto leading-relaxed italic"
        >
          &ldquo;Behind every little handmade treasure are hands filled with skill, patience and love.&rdquo;
        </motion.p>

        {/* Tap-to-love hint (mobile only) */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-3 text-[11px] sm:hidden text-[#811B2B]/60 font-medium"
        >
          tap the photos to send love ♡
        </motion.p>
      </motion.div>

      {/* ── 2. LIVE STATS STRIP ───────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-4 gap-2 sm:gap-4 bg-[#FFF5CC] rounded-2xl sm:rounded-3xl border border-[#811B2B]/15 p-3 sm:p-6 shadow-sm"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-col items-center gap-0.5 sm:gap-1 text-center"
            >
              <span className="text-lg sm:text-2xl">{s.emoji}</span>
              <span className="font-black text-lg sm:text-3xl text-[#811B2B] leading-none">{s.number}</span>
              <span className="text-[9px] sm:text-xs font-semibold text-[#641623]/70 uppercase tracking-wider leading-tight">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── 3. INTERACTIVE CHAPTER SWITCHER (MOBILE TABS + DESKTOP STORY) ─── */}
      <div className="relative max-w-6xl mx-auto px-3 sm:px-8 lg:px-12">

        {/* Background yarn thread (desktop) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full" viewBox="0 0 1152 400" fill="none" preserveAspectRatio="none">
            <path
              d="M 100 200 C 300 50, 500 350, 700 200 C 900 50, 1050 300, 1052 200"
              stroke="#811B2B" strokeWidth="3" strokeOpacity="0.07" strokeLinecap="round"
            />
            <motion.path
              d="M 100 200 C 300 50, 500 350, 700 200 C 900 50, 1050 300, 1052 200"
              stroke="#811B2B" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="8 6"
              style={{ pathLength }}
            />
          </svg>
        </div>

        {/* ── MOBILE: horizontal scrollable chapter tabs ── */}
        <div className="lg:hidden mb-5">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x snap-proximity">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveChapter(i)}
                className={`flex-shrink-0 snap-start flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                  i === activeChapter
                    ? 'bg-[#641623] text-[#FBF8CF] border-[#641623] shadow-md scale-[1.03]'
                    : 'bg-white/70 text-[#641623] border-[#811B2B]/25 hover:border-[#641623]'
                }`}
              >
                <span>{c.emoji}</span>
                <span>{c.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── MOBILE: AnimatePresence chapter card ── */}
        <div className="lg:hidden relative z-10 mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: 24, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -24, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-5"
            >
              {/* Photo */}
              <div
                className="relative group cursor-pointer active:scale-[0.98] transition-transform"
                onClick={handleHeartClick}
                role="button"
                tabIndex={0}
                aria-label={`Send love to ${chapter.badge}`}
                onKeyDown={(e) => e.key === 'Enter' && handleHeartClick(e as unknown as React.MouseEvent)}
              >
                {/* Accent glow frame */}
                <div
                  className="absolute -inset-2 rounded-[26px] opacity-60 -z-10"
                  style={{ backgroundColor: chapter.accentBg }}
                />
                <div
                  className="relative overflow-hidden rounded-[22px] border-2 shadow-lg"
                  style={{ borderColor: chapter.accentBorder + '55' }}
                >
                  <picture>
                    <source srcSet={chapter.imageWebp} type="image/webp" />
                    <img
                      src={chapter.imagePng}
                      alt={chapter.alt}
                      loading="eager"
                      className="w-full h-64 object-cover"
                    />
                  </picture>
                  {/* Badge overlay */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-[#811B2B]/20 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#811B2B]" />
                    <span className="font-bold text-xs text-[#641623]">{chapter.step} · {chapter.badge}</span>
                  </div>
                  {/* Tap-love overlay hint */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-active:opacity-100 transition-opacity duration-100 text-white text-lg drop-shadow">
                    ♡
                  </div>
                </div>
                {/* Caption */}
                <div className="mt-2 px-1 flex items-start gap-2">
                  <span className="text-[#811B2B] text-xs mt-0.5">♡</span>
                  <p className="text-xs font-semibold text-[#641623]/80 italic leading-snug">&ldquo;{chapter.caption}&rdquo;</p>
                </div>
              </div>

              {/* Text block */}
              <div className="bg-white/50 rounded-2xl border border-[#811B2B]/10 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#811B2B] uppercase tracking-wider">Chapter {chapter.step}</span>
                  <span className="flex-1 h-px bg-[#811B2B]/20" />
                </div>
                <h3 className="font-bold text-xl text-[#641623] leading-tight">{chapter.title}</h3>

                {/* Pull quote */}
                <div className="bg-[#FFF5CC] rounded-xl px-3.5 py-3 border-l-4 border-[#F7BE44]">
                  <p className="text-sm font-semibold text-[#811B2B] italic leading-snug">{chapter.quote}</p>
                </div>

                {/* Body */}
                <div className="space-y-2 text-sm text-[#2D2424]/80 leading-relaxed">
                  {chapter.body.map((para, i) => <p key={i}>{para}</p>)}
                </div>

                {/* Footer tag */}
                <div className="flex items-center gap-2 pt-1 text-xs text-[#641623]/65 font-medium border-t border-[#811B2B]/10">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#811B2B]" />
                  <span>100% Handcrafted by Nani Artisans</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile prev/next controls */}
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => setActiveChapter((a) => Math.max(0, a - 1))}
              disabled={activeChapter === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#811B2B]/25 text-[#641623] text-xs font-bold disabled:opacity-30 active:scale-95 transition-all"
            >
              ← Prev
            </button>
            {/* Dot indicators */}
            <div className="flex gap-1.5">
              {CHAPTERS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveChapter(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === activeChapter ? 'w-5 h-2.5 bg-[#811B2B]' : 'w-2.5 h-2.5 bg-[#811B2B]/25'
                  }`}
                  aria-label={`Go to chapter ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActiveChapter((a) => Math.min(CHAPTERS.length - 1, a + 1))}
              disabled={activeChapter === CHAPTERS.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#811B2B]/25 text-[#641623] text-xs font-bold disabled:opacity-30 active:scale-95 transition-all"
            >
              Next →
            </button>
          </div>
        </div>

        {/* ── DESKTOP: full alternating story layout ── */}
        <div className="hidden lg:block relative z-10 space-y-32 xl:space-y-40">
          {CHAPTERS.map((item, index) => {
            const isEven = index % 2 === 1;
            return (
              <div
                key={item.id}
                className={`relative flex ${isEven ? 'flex-row-reverse' : 'flex-row'} items-center gap-14 xl:gap-20`}
              >
                {/* Photo column */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: prefersReduced ? 1 : 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.08, margin: '100px 0px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-[56%] flex-shrink-0"
                >
                  <div
                    className="relative group cursor-pointer"
                    onClick={handleHeartClick}
                    role="button"
                    tabIndex={0}
                    aria-label={`Send love to ${item.badge}`}
                    onKeyDown={(e) => e.key === 'Enter' && handleHeartClick(e as unknown as React.MouseEvent)}
                  >
                    {/* Accent glow */}
                    <div
                      className="absolute -inset-3.5 rounded-[42px] opacity-70 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                      style={{ backgroundColor: item.accentBg }}
                    />
                    {/* Photo frame */}
                    <div
                      className="relative overflow-hidden rounded-[32px] border-2 shadow-[0_14px_40px_rgba(100,22,35,0.09)] group-hover:shadow-[0_20px_52px_rgba(100,22,35,0.14)] transition-shadow duration-500"
                      style={{ borderColor: item.accentBorder + '50' }}
                    >
                      <picture>
                        <source srcSet={item.imageWebp} type="image/webp" />
                        <img
                          src={item.imagePng}
                          alt={item.alt}
                          loading="eager"
                          decoding="async"
                          className="w-full h-auto max-h-[560px] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      </picture>
                      {/* Chapter stamp */}
                      <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/92 backdrop-blur-md border border-[#811B2B]/20 shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#811B2B]" />
                        <span className="font-bold text-sm text-[#641623]">{item.step} · {item.badge}</span>
                      </div>
                      {/* Hover heart overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="text-5xl text-white/80 drop-shadow-lg">♡</span>
                      </div>
                    </div>
                    {/* Caption */}
                    <div className="mt-3.5 px-3 flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-[#811B2B] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <p className="text-sm font-semibold text-[#641623]/75 italic leading-snug">&ldquo;{item.caption}&rdquo;</p>
                    </div>
                  </div>
                </motion.div>

                {/* Text column */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.08, margin: '100px 0px' }}
                  transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-[44%] flex flex-col justify-center text-left"
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="font-bold text-sm text-[#811B2B] uppercase tracking-wider">Chapter {item.step}</span>
                    <span className="flex-1 h-px bg-[#811B2B]/30" />
                  </div>

                  <h3 className="font-bold text-2xl lg:text-3xl text-[#641623] tracking-tight mb-3.5">{item.title}</h3>

                  {/* Pull-quote card */}
                  <div className="relative mb-5 bg-[#FFF5CC] rounded-2xl px-5 py-4 border-l-4 border-[#F7BE44] shadow-sm">
                    <p className="font-semibold text-base text-[#811B2B] italic leading-snug">{item.quote}</p>
                  </div>

                  {/* Body paragraphs */}
                  <div className="space-y-3 font-normal text-base text-[#2D2424]/80 leading-relaxed">
                    {item.body.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

                  {/* Footnote */}
                  <div className="mt-6 pt-4 border-t border-[#811B2B]/12 flex items-center gap-2 text-sm text-[#641623]/65 font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#811B2B]" />
                    <span>100% Handcrafted by Nani Artisans in Surat</span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. COMMUNITY IMPACT BANNER ────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08, margin: '80px 0px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[28px] sm:rounded-[44px] bg-[#FFF5CC] border-[2.5px] border-[#811B2B]/20 p-7 sm:p-12 lg:p-16 shadow-[0_16px_48px_rgba(100,22,35,0.08)]"
        >
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-[#FBF8CF]/50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-36 h-36 rounded-full bg-[#D9EEF5]/40 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 border border-[#811B2B]/20 text-[#811B2B] text-xs sm:text-sm font-bold tracking-wide uppercase mb-3 sm:mb-4">
                <span>✦ Since 2019, made with love ✦</span>
              </div>
              <div className="font-black text-6xl sm:text-8xl text-[#811B2B] tracking-tight leading-none mb-2">
                200+
              </div>
              <h3 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-[#641623] tracking-tight leading-tight mb-4">
                Nanis, daadis, aunties & artisans
              </h3>
              <p className="font-normal text-sm sm:text-base lg:text-lg text-[#2D2424]/80 leading-relaxed max-w-xl">
                What began as one little dream has grown into a community of talented women creating beautiful things, one stitch at a time.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                <img
                  src="/knotsnco_mascot_transparent.gif"
                  alt="Official Knots & Co yarn ball mascot"
                  className="w-full h-full object-contain select-none drop-shadow-md"
                  loading="lazy"
                />
              </div>
              <span className="mt-2 text-xs font-bold text-[#811B2B] uppercase tracking-wider text-center">
                Handmade with Pride in Surat
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── 5. CLOSING MESSAGE ───────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16 sm:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08, margin: '80px 0px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 sm:space-y-5"
        >
          <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#641623] tracking-tight">
            <span>More than crochet. It&apos;s a </span>
            <span className="font-script font-normal text-[1.22em] text-[#811B2B] inline-block -rotate-2">
              community.
            </span>
          </h3>
          <p className="font-normal text-sm sm:text-base md:text-lg text-[#2D2424]/80 leading-relaxed max-w-2xl mx-auto">
            Every bouquet, plushie and little treasure carries the creativity and care of the nani who made it.
            When you choose handmade, you&apos;re celebrating her skills and becoming a little part of her story.
          </p>
          <div className="pt-2">
            <p className="text-lg sm:text-2xl font-bold text-[#811B2B]">
              <span>A little yarn. A lot of </span>
              <span className="font-script font-normal text-[1.25em]">love</span>
              <span>. ♡</span>
            </p>
          </div>

          {onStoryClick && (
            <div className="pt-3 sm:pt-5">
              <button
                type="button"
                onClick={onStoryClick}
                className="inline-flex items-center justify-center min-w-[180px] sm:min-w-[220px] py-2.5 sm:py-3.5 px-6 sm:px-8 rounded-full border-[2.2px] border-[#641623] text-[#641623] font-bold text-sm sm:text-base tracking-wide hover:bg-[#641623] hover:text-[#FBF8CF] active:scale-95 transition-all duration-200 cursor-pointer"
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
