import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useReducedMotion,
} from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Sparkles,
  ShoppingBag,
  ZoomIn,
  X,
  ChevronDown,
  LayoutList,
  Layers,
} from 'lucide-react';

interface BehindTheStitchesPageProps {
  onNavigateHome: () => void;
  onNavigateShop: (category?: string) => void;
}

interface StoryChapter {
  id: string;
  step: string;
  badge: string;
  shortLabel: string;
  emoji: string;
  title: string;
  headline: string;
  quote: string;
  body: string[];
  craftNoteTitle: string;
  craftNote: string;
  yarnColors: Array<{ name: string; hex: string }>;
  caption: string;
  imagePng: string;
  imageWebp: string;
  alt: string;
  accentBg: string;
  accentBorder: string;
}

interface PostcardNote {
  id: string;
  emoji: string;
  title: string;
  teaser: string;
  secretNote: string;
  artisanTag: string;
  bgClass: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 'craft-begins',
    step: '01',
    badge: 'The Beginning',
    shortLabel: 'Where It Started',
    emoji: '🧶',
    title: 'Where Nani’s Craft Meets the World',
    headline: 'Every beautiful thing begins with a single stitch.',
    quote:
      'In 2019, a 16-year-old with a dream met a nani with golden hands — and together they spun a movement.',
    body: [
      'We met talented nanis, daadis, and aunties across our neighbourhoods who had spent lifetimes perfecting crochet, yet rarely had a platform to share their artistry beyond family gifts.',
      'So we began bringing soft milk-cotton yarn straight to their doorsteps, turning cherished heirloom skills into joyful, dignified home-based livelihoods.',
    ],
    craftNoteTitle: 'Heirloom Stitches Reimagined',
    craftNote:
      'Many of our nanis learned basic chain and single-crochet stitches as young girls. Today, those same foundational loops form blooming petals, amigurumi plushies, and keepsake charms shipped across India.',
    yarnColors: [
      { name: 'Crimson', hex: '#A41D31' },
      { name: 'Warm Butter', hex: '#F7BE44' },
      { name: 'Blush Cream', hex: '#F4D8CE' },
    ],
    caption: 'Every beautiful thing begins with a single stitch.',
    imagePng: '/stories/artisan-1-craft-begins.png',
    imageWebp: '/stories/artisan-1-craft-begins.webp',
    alt: 'Nani artisan wearing glasses crocheting vibrant red yarn with patience and precision',
    accentBg: '#FFF5CC',
    accentBorder: '#F7BE44',
  },
  {
    id: 'hands-magic',
    step: '02',
    badge: "Nani's Magic",
    shortLabel: "Nani's Magic",
    emoji: '💛',
    title: 'The Hands Behind Every Loop',
    headline: 'Years of skill, patience, and intuition in every stitch.',
    quote:
      'True handmade tension cannot be programmed — no machine on earth can replicate a Nani’s gentle touch.',
    body: [
      'Look closely at these hands: the steady rhythm guiding purple yarn around a hook, decades of muscle memory, and quiet patience poured into every petal fold.',
      'Each piece carries hours of calm craftsmanship and real human warmth — something you feel the instant you unbox a Knots & Co keepsake.',
    ],
    craftNoteTitle: 'Why Crochet Cannot Be Machine-Made',
    craftNote:
      'Unlike woven or knitted fabric, crochet relies on interlocking 3D slip-knots turned in multiple planes. Every flower petal and plushie head at Knotsnco is genuinely 100% hand-hooked.',
    yarnColors: [
      { name: 'Plum Iris', hex: '#7A4988' },
      { name: 'Rosewood', hex: '#811B2B' },
      { name: 'Soft Sky', hex: '#A8D8EA' },
    ],
    caption: 'Years of skill, patience, and creativity in every loop.',
    imagePng: '/stories/artisan-2-hands-magic.png',
    imageWebp: '/stories/artisan-2-hands-magic.webp',
    alt: 'Close-up photograph of Nani hands adorned with rings crocheting purple yarn',
    accentBg: '#D9EEF5',
    accentBorder: '#7BBFD4',
  },
  {
    id: 'creative-process',
    step: '03',
    badge: 'Work With Dignity',
    shortLabel: 'At Her Own Pace',
    emoji: '🏡',
    title: 'Creating Comfortably From Home',
    headline: 'Turning simple skeins of yarn into financial independence.',
    quote:
      'She works with a warm cup of chai nearby, surrounded by family, taking immense pride in earning on her own terms.',
    body: [
      'Working from home means our nanis never face rigid factory shifts or grueling commutes. They craft when inspired, rest whenever they choose, and stay present with their children and grandchildren.',
      'From cheerful sunflower bouquets to pocket keychains and tabletop decor, each creation comes alive in a peaceful living room.',
    ],
    craftNoteTitle: 'Flexible, Doorstep Yarn Delivery',
    craftNote:
      'Our team drops off combed cotton skeins, stuffing, and brass hooks every week and picks up finished pieces — making earning effortless and completely stress-free.',
    yarnColors: [
      { name: 'Marigold', hex: '#EA8C2A' },
      { name: 'Sunburst', hex: '#F7BE44' },
      { name: 'Leaf Sage', hex: '#6F8F5C' },
    ],
    caption: 'Turning simple yarn into something extraordinary.',
    imagePng: '/stories/artisan-3-creative-process.png',
    imageWebp: '/stories/artisan-3-creative-process.webp',
    alt: 'Nani artisan sitting comfortably at home crafting a vibrant orange crochet piece',
    accentBg: '#FFF5CC',
    accentBorder: '#F7BE44',
  },
  {
    id: 'community-creativity',
    step: '04',
    badge: 'One Family',
    shortLabel: 'One Family',
    emoji: '🌸',
    title: 'A Sisterhood Woven Across Surat',
    headline: 'Different colours. Different hands. One proud handmade family.',
    quote:
      'More than a craft collective — a sisterhood of 200+ women cheering for every milestone together.',
    body: [
      'What began as one living-room conversation has blossomed into a vibrant network of nanis, daadis, and aunties across Surat and neighbouring towns.',
      'When you gift a Knots & Co bouquet or charm, you are not gifting mass-produced merchandise — you are celebrating a real Nani’s artistry and story.',
    ],
    craftNoteTitle: '200+ Women, Shared Patterns & Joy',
    craftNote:
      'Experienced nanis mentor newer artisans on intricate picot borders and floral shaping, keeping traditional needlecraft alive for the next generation.',
    yarnColors: [
      { name: 'Ruby Yarn', hex: '#811B2B' },
      { name: 'Teal Mist', hex: '#5BA4B8' },
      { name: 'Daffodil', hex: '#F7BE44' },
    ],
    caption: 'Different colours. Different hands. One beautiful handmade family.',
    imagePng: '/stories/artisan-4-community-family.png',
    imageWebp: '/stories/artisan-4-community-family.webp',
    alt: 'Nani artisan hands crocheting a colourful geometric textile with diverse yarn hues',
    accentBg: '#D9EEF5',
    accentBorder: '#7BBFD4',
  },
];

const POSTCARD_NOTES: PostcardNote[] = [
  {
    id: 'chai-stitch',
    emoji: '☕',
    title: 'Morning Chai & Yarn Rituals',
    teaser: 'How a bouquet blooms in Nani’s courtyard',
    secretNote:
      'A single forever sunflower bouquet passes through 2 to 4 hours of mindful finger-hook tension — crafted alongside morning bhajans and afternoon tea.',
    artisanTag: 'Surat Atelier Family',
    bgClass: 'bg-[#FFF5CC] border-[#F7BE44]/50',
  },
  {
    id: 'zero-factories',
    emoji: '✨',
    title: 'Zero Machines, 100% Heartbeat',
    teaser: 'Why subtle stitch variations are precious',
    secretNote:
      'Every Nani holds her crochet hook slightly differently. Those tiny organic curves in petal tilt mean your gift is genuinely one of a kind.',
    artisanTag: 'Hand-Hooked Heritage',
    bgClass: 'bg-[#D9EEF5] border-[#7BBFD4]/55',
  },
  {
    id: 'pride-earned',
    emoji: '💝',
    title: 'Independent Pocket Money & Pride',
    teaser: 'Where every order truly travels',
    secretNote:
      'Nanis tell us their favourite moment is buying sweets for their grandkids or gifting sarees with money earned straight from their own crochet hands.',
    artisanTag: '200+ Empowered Homes',
    bgClass: 'bg-[#FCE8EC] border-[#811B2B]/25',
  },
];

const STATS = [
  { number: '200+', label: 'Nani Artisans', emoji: '👵' },
  { number: '2019', label: 'Year Started', emoji: '🧶' },
  { number: '100%', label: 'Hand-Hooked', emoji: '💛' },
  { number: 'Surat', label: 'Homegrown Roots', emoji: '🏡' },
];

const BASE_LOVE_COUNT = 1248;
const LS_LOVE_KEY = 'knotsnco_nani_love_count';
const LS_USER_LOVED_KEY = 'knotsnco_nani_user_hearts';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export const BehindTheStitchesPage: React.FC<BehindTheStitchesPageProps> = ({
  onNavigateHome,
  onNavigateShop,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const heartIdRef = useRef(0);

  const prefersReduced = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'interactive' | 'timeline'>('interactive');
  const [craftExpanded, setCraftExpanded] = useState<Record<string, boolean>>({});
  const [openPostcard, setOpenPostcard] = useState<string | null>('chai-stitch');
  const [lightboxChapter, setLightboxChapter] = useState<StoryChapter | null>(null);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [loveAnnouncement, setLoveAnnouncement] = useState('');

  const [loveCount, setLoveCount] = useState<number>(() => {
    if (typeof window === 'undefined') return BASE_LOVE_COUNT;
    try {
      const saved = localStorage.getItem(LS_LOVE_KEY);
      const parsed = saved ? parseInt(saved, 10) : NaN;
      return Number.isFinite(parsed) && parsed >= BASE_LOVE_COUNT ? parsed : BASE_LOVE_COUNT;
    } catch {
      return BASE_LOVE_COUNT;
    }
  });

  const [userHeartsSent, setUserHeartsSent] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const saved = localStorage.getItem(LS_USER_LOVED_KEY);
      const parsed = saved ? parseInt(saved, 10) : 0;
      return Number.isFinite(parsed) ? parsed : 0;
    } catch {
      return 0;
    }
  });

  const activeChapter = CHAPTERS[activeIndex];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Keep active tab pill scrolled into view on narrow mobile viewports
  useEffect(() => {
    const activeTabEl = tabRefs.current[activeIndex];
    if (activeTabEl && typeof activeTabEl.scrollIntoView === 'function') {
      activeTabEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [activeIndex]);

  // Manage native <dialog> lifecycle for photo lightbox
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightboxChapter && !dialog.open) {
      dialog.showModal();
    } else if (!lightboxChapter && dialog.open) {
      dialog.close();
    }
  }, [lightboxChapter]);

  // Smooth scroll tracking for timeline yarn thread
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

  const sendLoveToNani = useCallback(
    (clientX?: number, clientY?: number) => {
      setLoveCount((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem(LS_LOVE_KEY, String(next));
        } catch {}
        setLoveAnnouncement(`Sent love to Nani! Total hearts: ${next.toLocaleString('en-IN')}`);
        return next;
      });
      setUserHeartsSent((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem(LS_USER_LOVED_KEY, String(next));
        } catch {}
        return next;
      });

      if (!prefersReduced && typeof clientX === 'number' && typeof clientY === 'number' && clientX > 0 && clientY > 0) {
        const id = heartIdRef.current++;
        setHearts((prev) => [...prev.slice(-10), { id, x: clientX, y: clientY }]);
      }
    },
    [prefersReduced]
  );

  const removeHeart = useCallback((id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleCraftNote = useCallback((chapterId: string) => {
    setCraftExpanded((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
  }, []);

  // Keyboard navigation following WAI-ARIA tablist guidelines
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const count = CHAPTERS.length;
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') nextIndex = (activeIndex + 1) % count;
    else if (e.key === 'ArrowLeft') nextIndex = (activeIndex - 1 + count) % count;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = count - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      setActiveIndex(nextIndex);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  // Horizontal touch swipe between chapters without blocking vertical scroll
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    // Only trigger swipe when horizontal drag clearly dominates vertical scroll
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      if (dx < 0 && activeIndex < CHAPTERS.length - 1) {
        setActiveIndex((i) => i + 1);
      } else if (dx > 0 && activeIndex > 0) {
        setActiveIndex((i) => i - 1);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#FBF8CF] text-[#2D2424] font-['Fredoka'] overflow-x-hidden"
    >
      {/* Floating heart burst animations (decorative) */}
      <div aria-hidden="true" className="pointer-events-none">
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            className="fixed z-50 text-2xl text-[#811B2B] select-none"
            style={{ left: h.x - 12, top: h.y - 14 }}
            initial={{ opacity: 1, scale: 0.6, y: 0 }}
            animate={{ opacity: 0, scale: 1.7, y: -64 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            onAnimationComplete={() => removeHeart(h.id)}
          >
            ♡
          </motion.div>
        ))}
      </div>

      {/* Screen-reader live announcement for appreciation counter */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {loveAnnouncement}
      </div>

      {/* =====================================================================
          1. TOP BREADCRUMB BAR
          ===================================================================== */}
      <div className="w-full bg-[#FFFDF8] border-b border-[#641623]/10 py-2.5 px-4 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 min-h-[40px] px-2 -ml-2 rounded-lg text-xs sm:text-sm font-bold text-[#641623] hover:text-[#811B2B] hover:-translate-x-0.5 transition-all cursor-pointer focus-visible:outline-3 focus-visible:outline-[#811B2B] focus-visible:outline-offset-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Home</span>
          </button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-[#641623]/65 font-medium">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-[#641623] hover:underline cursor-pointer min-h-[36px] px-1 rounded focus-visible:outline-3 focus-visible:outline-[#811B2B]"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-[#811B2B] font-bold" aria-current="page">
              Nani
            </span>
          </nav>
        </div>
      </div>

      {/* =====================================================================
          2. EDITORIAL HERO HEADER ("Meet Nani")
          ===================================================================== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-8 sm:pb-12">
        {/* Eyebrow Pill */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5CC] border border-[#811B2B]/20 text-[#811B2B] text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 shadow-xs"
        >
          <span aria-hidden="true">👵</span>
          <span>THE HEART BEHIND THE HANDMADE</span>
          <span aria-hidden="true">🧶</span>
        </motion.div>

        {/* Main Page Title */}
        <motion.h1
          initial={prefersReduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-[#641623] tracking-tight leading-[1.1]"
        >
          <span>Meet </span>
          <span className="font-script font-normal text-[1.22em] text-[#811B2B] inline-block -rotate-2 px-1">
            Nani
          </span>
        </motion.h1>

        {/* Warm Sub-headline */}
        <motion.h2
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2.5 sm:mt-4 text-xl sm:text-3xl font-bold text-[#811B2B] tracking-tight"
        >
          <span>Every </span>
          <span className="font-script font-normal text-[1.16em] inline-block -rotate-2 px-0.5">
            stitch
          </span>
          <span> has her story.</span>
        </motion.h2>

        {/* Quote Intro */}
        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3.5 sm:mt-5 text-sm sm:text-lg md:text-xl text-[#2D2424]/85 font-normal max-w-2xl mx-auto leading-relaxed italic"
        >
          &ldquo;Behind every crochet bouquet and plushie are the patient, loving hands of our 200+ Nanis.&rdquo;
        </motion.p>

        {/* Hero Interactive Actions: Send Love + View Mode Switch */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={(e) => sendLoveToNani(e.clientX, e.clientY)}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 sm:px-6 py-2.5 rounded-full bg-[#811B2B] text-white font-bold text-sm sm:text-base shadow-md hover:bg-[#641623] active:scale-95 transition-all cursor-pointer focus-visible:outline-3 focus-visible:outline-[#641623] focus-visible:outline-offset-2"
          >
            <Heart
              aria-hidden="true"
              className={`w-4 h-4 ${userHeartsSent > 0 ? 'fill-[#F7BE44] text-[#F7BE44]' : 'fill-white/25'}`}
            />
            <span>Send Love to Nani</span>
            <span className="ml-0.5 px-2 py-0.5 rounded-full bg-white/18 text-xs font-extrabold tabular-nums">
              {loveCount.toLocaleString('en-IN')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateShop('all')}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-[#FFFDF8] border-2 border-[#641623]/30 text-[#641623] font-bold text-sm sm:text-base hover:border-[#641623] hover:bg-[#FFF5CC] active:scale-95 transition-all cursor-pointer focus-visible:outline-3 focus-visible:outline-[#811B2B] focus-visible:outline-offset-2"
          >
            <ShoppingBag aria-hidden="true" className="w-4 h-4" />
            <span>Shop Nani&apos;s Crafts</span>
          </button>
        </div>

        {/* 2x2 Mobile / 4-col Desktop Stats Ribbon */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-3xl mx-auto">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-[#FFFDF8] border border-[#811B2B]/15 px-3 py-3 sm:py-4 shadow-2xs flex flex-col items-center justify-center"
            >
              <span className="text-xl sm:text-2xl mb-1" aria-hidden="true">
                {stat.emoji}
              </span>
              <span className="font-black text-xl sm:text-2xl text-[#811B2B] leading-none">
                {stat.number}
              </span>
              <span className="mt-1 text-[11px] sm:text-xs font-semibold text-[#641623]/75 uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          3. CHAPTER EXPLORER (Interactive Cards vs. Full Timeline)
          ===================================================================== */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-10">
        {/* Controls Toolbar: Chapter Switcher Tabs + Reading Mode Toggle */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6 sm:mb-8">
          {/* Scrollable Single-Row Chapter Tablist */}
          {viewMode === 'interactive' ? (
            <div className="w-full md:w-auto overflow-hidden">
              <div
                role="tablist"
                aria-label="Nani Story Chapters"
                onKeyDown={handleTabKeyDown}
                className="flex flex-nowrap items-center gap-2 overflow-x-auto no-scrollbar pb-1.5 snap-x snap-proximity"
              >
                {CHAPTERS.map((chap, idx) => {
                  const isSelected = idx === activeIndex;
                  return (
                    <button
                      key={chap.id}
                      ref={(el) => {
                        tabRefs.current[idx] = el;
                      }}
                      id={`nani-tab-${chap.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => setActiveIndex(idx)}
                      className={`flex-none snap-start inline-flex items-center gap-2 min-h-[44px] px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border-x border-t transition-colors duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-3 focus-visible:outline-[#811B2B] focus-visible:outline-offset-2 ${
                        isSelected
                          ? 'bg-[#641623] text-[#FBF8CF] border-[#641623] border-b-[4px] border-b-[#F7BE44] shadow-sm'
                          : 'bg-[#FFFDF8] text-[#641623] border-[#811B2B]/20 border-b-[4px] border-b-transparent hover:bg-[#FFF5CC]'
                      }`}
                    >
                      <span aria-hidden="true">{chap.emoji}</span>
                      <span>
                        {chap.step} · {chap.shortLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-sm font-bold text-[#641623] flex items-center gap-2">
              <Sparkles aria-hidden="true" className="w-4 h-4 text-[#811B2B]" />
              <span>Reading Complete 4-Chapter Story</span>
            </div>
          )}

          {/* Reading Mode Segmented Toggle */}
          <div
            role="group"
            aria-label="Story layout mode"
            className="inline-flex items-center self-start sm:self-auto p-1 rounded-full bg-[#FFF5CC] border border-[#811B2B]/25"
          >
            <button
              type="button"
              aria-pressed={viewMode === 'interactive'}
              onClick={() => setViewMode('interactive')}
              className={`inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer focus-visible:outline-3 focus-visible:outline-[#811B2B] ${
                viewMode === 'interactive'
                  ? 'bg-[#641623] text-[#FBF8CF] shadow-xs'
                  : 'text-[#641623] hover:bg-[#FFFDF8]/70'
              }`}
            >
              <Layers aria-hidden="true" className="w-3.5 h-3.5" />
              <span>Chapter Cards</span>
            </button>
            <button
              type="button"
              aria-pressed={viewMode === 'timeline'}
              onClick={() => setViewMode('timeline')}
              className={`inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-colors cursor-pointer focus-visible:outline-3 focus-visible:outline-[#811B2B] ${
                viewMode === 'timeline'
                  ? 'bg-[#641623] text-[#FBF8CF] shadow-xs'
                  : 'text-[#641623] hover:bg-[#FFFDF8]/70'
              }`}
            >
              <LayoutList aria-hidden="true" className="w-3.5 h-3.5" />
              <span>Full Timeline</span>
            </button>
          </div>
        </div>

        {/* ── MODE A: INTERACTIVE SPOTLIGHT CHAPTER VIEW (Mobile-First + Rich Desktop) ── */}
        {viewMode === 'interactive' && (
          <div
            role="tabpanel"
            id={`nani-panel-${activeChapter.id}`}
            aria-labelledby={`nani-tab-${activeChapter.id}`}
            tabIndex={0}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="touch-pan-y rounded-[28px] sm:rounded-[38px] bg-[#FFFDF8] border-2 border-[#811B2B]/15 p-4 sm:p-7 lg:p-10 shadow-[0_16px_48px_rgba(100,22,35,0.08)] focus-visible:outline-3 focus-visible:outline-[#811B2B]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter.id}
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center"
              >
                {/* Left Photo Column */}
                <div className="lg:col-span-6 relative">
                  <div
                    className="relative rounded-[22px] sm:rounded-[28px] p-2 sm:p-3 transition-colors duration-300"
                    style={{ backgroundColor: activeChapter.accentBg }}
                  >
                    <div className="relative overflow-hidden rounded-[18px] sm:rounded-[22px] border-2 border-[#811B2B]/15 bg-[#EFE6DC] shadow-md group">
                      <picture>
                        <source srcSet={activeChapter.imageWebp} type="image/webp" />
                        <img
                          src={activeChapter.imagePng}
                          alt={activeChapter.alt}
                          loading="eager"
                          className="w-full h-[270px] sm:h-[380px] lg:h-[440px] object-cover select-none transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </picture>

                      {/* Chapter Badge Stamp */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFFDF8]/92 backdrop-blur-sm border border-[#811B2B]/20 shadow-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#811B2B]" />
                        <span className="text-xs font-bold text-[#641623]">
                          {activeChapter.step} · {activeChapter.badge}
                        </span>
                      </div>

                      {/* Photo Quick Actions: Tap Love + Zoom Inspect */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => sendLoveToNani(e.clientX, e.clientY)}
                          aria-label={`Send heart to ${activeChapter.badge}`}
                          className="min-h-[40px] min-w-[40px] px-3 py-1.5 rounded-full bg-[#FFFDF8]/95 backdrop-blur-sm border border-[#811B2B]/25 text-[#811B2B] font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#811B2B] hover:text-white active:scale-90 transition-all cursor-pointer focus-visible:outline-3 focus-visible:outline-[#811B2B]"
                        >
                          <Heart aria-hidden="true" className="w-3.5 h-3.5 fill-current" />
                          <span>♡</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setLightboxChapter(activeChapter)}
                          aria-label={`Inspect photo for ${activeChapter.title} closely`}
                          className="min-h-[40px] min-w-[40px] px-3 py-1.5 rounded-full bg-[#641623]/90 backdrop-blur-sm text-[#FBF8CF] font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#811B2B] active:scale-95 transition-all cursor-pointer focus-visible:outline-3 focus-visible:outline-[#F7BE44]"
                        >
                          <ZoomIn aria-hidden="true" className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Inspect</span>
                        </button>
                      </div>
                    </div>

                    {/* Caption + Yarn Swatches */}
                    <div className="mt-3 px-1.5 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm font-semibold text-[#641623]/80 italic">
                        &ldquo;{activeChapter.caption}&rdquo;
                      </p>
                      <div className="flex items-center gap-1.5" aria-label="Chapter yarn colour palette">
                        {activeChapter.yarnColors.map((yc) => (
                          <span
                            key={yc.name}
                            title={yc.name}
                            className="w-4 h-4 rounded-full border border-[#641623]/25 shadow-2xs"
                            style={{ backgroundColor: yc.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Editorial Content Column */}
                <div className="lg:col-span-6 flex flex-col justify-center text-left space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">
                      {activeChapter.emoji}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-[#811B2B] uppercase tracking-wider">
                      Chapter {activeChapter.step}
                    </span>
                    <span className="flex-1 h-px bg-[#811B2B]/20" />
                  </div>

                  <h3 className="font-black text-2xl sm:text-3xl text-[#641623] tracking-tight leading-snug">
                    {activeChapter.title}
                  </h3>

                  {/* Nani Quote Card */}
                  <div className="rounded-2xl bg-[#FFF5CC] px-4 py-3.5 border-l-4 border-[#F7BE44]">
                    <p className="font-semibold text-sm sm:text-base text-[#811B2B] italic leading-relaxed">
                      &ldquo;{activeChapter.quote}&rdquo;
                    </p>
                  </div>

                  {/* Story Paragraphs */}
                  <div className="space-y-3 text-sm sm:text-base text-[#2D2424]/85 leading-relaxed">
                    {activeChapter.body.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>

                  {/* Interactive Disclosure: "Behind Nani's Stitch" */}
                  <div className="pt-1">
                    <button
                      type="button"
                      aria-expanded={Boolean(craftExpanded[activeChapter.id])}
                      onClick={() => toggleCraftNote(activeChapter.id)}
                      className="w-full flex items-center justify-between gap-3 min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#FBF8CF] border border-[#811B2B]/20 text-left text-xs sm:text-sm font-bold text-[#641623] hover:bg-[#FFF5CC] cursor-pointer transition-colors focus-visible:outline-3 focus-visible:outline-[#811B2B]"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles aria-hidden="true" className="w-4 h-4 text-[#811B2B] flex-shrink-0" />
                        <span>Nani&apos;s Craft Detail: {activeChapter.craftNoteTitle}</span>
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`w-4 h-4 text-[#811B2B] transition-transform duration-200 ${
                          craftExpanded[activeChapter.id] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {craftExpanded[activeChapter.id] && (
                      <div className="mt-2 px-4 py-3 rounded-2xl bg-[#D9EEF5]/55 border border-[#7BBFD4]/45 text-xs sm:text-sm text-[#2D2424]/85 leading-relaxed">
                        {activeChapter.craftNote}
                      </div>
                    )}
                  </div>

                  {/* Prev / Dots / Next Stepper */}
                  <div className="pt-3 border-t border-[#811B2B]/12 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      aria-disabled={activeIndex === 0}
                      onClick={() => activeIndex > 0 && setActiveIndex((i) => i - 1)}
                      className={`inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full border border-[#641623]/25 font-bold text-xs sm:text-sm transition-all ${
                        activeIndex === 0
                          ? 'opacity-40 cursor-not-allowed text-[#641623]'
                          : 'text-[#641623] hover:bg-[#FFF5CC] active:scale-95 cursor-pointer'
                      }`}
                    >
                      <ArrowLeft aria-hidden="true" className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {CHAPTERS.map((c, idx) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setActiveIndex(idx)}
                          aria-label={`Jump to chapter ${idx + 1}: ${c.shortLabel}`}
                          className={`min-h-[24px] min-w-[24px] flex items-center justify-center cursor-pointer rounded-full`}
                        >
                          <span
                            className={`block rounded-full transition-all duration-200 ${
                              idx === activeIndex
                                ? 'w-6 h-2.5 bg-[#811B2B]'
                                : 'w-2.5 h-2.5 bg-[#811B2B]/25 hover:bg-[#811B2B]/50'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      aria-disabled={activeIndex === CHAPTERS.length - 1}
                      onClick={() =>
                        activeIndex < CHAPTERS.length - 1 && setActiveIndex((i) => i + 1)
                      }
                      className={`inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all ${
                        activeIndex === CHAPTERS.length - 1
                          ? 'opacity-40 cursor-not-allowed bg-[#641623]/10 text-[#641623]'
                          : 'bg-[#641623] text-[#FBF8CF] hover:bg-[#811B2B] active:scale-95 cursor-pointer shadow-xs'
                      }`}
                    >
                      <span>Next</span>
                      <ArrowRight aria-hidden="true" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* ── MODE B: FULL TIMELINE SCROLL VIEW ── */}
        {viewMode === 'timeline' && (
          <div className="relative">
            {/* Desktop animated yarn thread */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none z-0" aria-hidden="true">
              <svg className="w-full h-full" viewBox="0 0 1152 2400" fill="none" preserveAspectRatio="none">
                <path
                  d="M 576 0 C 576 140, 240 240, 240 460 C 240 680, 900 780, 900 1050 C 900 1320, 250 1420, 250 1700 C 250 1980, 880 2060, 880 2250"
                  stroke="#811B2B"
                  strokeWidth="3.5"
                  strokeOpacity="0.08"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M 576 0 C 576 140, 240 240, 240 460 C 240 680, 900 780, 900 1050 C 900 1320, 250 1420, 250 1700 C 250 1980, 880 2060, 880 2250"
                  stroke="#811B2B"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeDasharray="8 6"
                  style={{ pathLength }}
                />
              </svg>
            </div>

            <div className="relative z-10 space-y-14 sm:space-y-24">
              {CHAPTERS.map((item, index) => {
                const isEven = index % 2 === 1;
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col ${
                      isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
                    } items-center gap-6 sm:gap-10 lg:gap-14 bg-[#FFFDF8]/75 lg:bg-transparent rounded-[28px] p-4 sm:p-6 lg:p-0 border border-[#811B2B]/10 lg:border-0`}
                  >
                    {/* Photo */}
                    <div className="w-full lg:w-[55%] flex-shrink-0">
                      <div
                        className="rounded-[24px] p-2.5 sm:p-3"
                        style={{ backgroundColor: item.accentBg }}
                      >
                        <div className="relative overflow-hidden rounded-[18px] sm:rounded-[22px] border border-[#811B2B]/15">
                          <picture>
                            <source srcSet={item.imageWebp} type="image/webp" />
                            <img
                              src={item.imagePng}
                              alt={item.alt}
                              loading="lazy"
                              className="w-full h-64 sm:h-96 lg:h-[430px] object-cover"
                            />
                          </picture>
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFFDF8]/92 border border-[#811B2B]/20 text-xs font-bold text-[#641623]">
                            {item.step} · {item.badge}
                          </div>
                          <button
                            type="button"
                            onClick={() => setLightboxChapter(item)}
                            aria-label={`Inspect photo for ${item.title}`}
                            className="absolute bottom-3 right-3 min-h-[38px] px-3 py-1.5 rounded-full bg-[#641623]/90 text-[#FBF8CF] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer hover:bg-[#811B2B]"
                          >
                            <ZoomIn aria-hidden="true" className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="w-full lg:w-[45%] space-y-3.5 text-left">
                      <div className="flex items-center gap-2">
                        <span aria-hidden="true">{item.emoji}</span>
                        <span className="font-bold text-xs sm:text-sm text-[#811B2B] uppercase tracking-wider">
                          Chapter {item.step}
                        </span>
                      </div>
                      <h3 className="font-black text-2xl sm:text-3xl text-[#641623]">{item.title}</h3>
                      <p className="font-bold text-base sm:text-lg text-[#811B2B] pl-3.5 border-l-4 border-[#F7BE44] italic">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                      <div className="space-y-2.5 text-sm sm:text-base text-[#2D2424]/85 leading-relaxed">
                        {item.body.map((para, pIdx) => (
                          <p key={pIdx}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          4. INTERACTIVE ARTISAN POSTCARDS (Tap-to-Open Notes from Nani's Room)
          ===================================================================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 mt-14 sm:mt-24">
        <div className="text-center mb-7 sm:mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#811B2B] mb-1.5">
            Tap a postcard to open ♡
          </span>
          <h2 className="font-black text-2xl sm:text-4xl text-[#641623] tracking-tight">
            <span>Notes from </span>
            <span className="font-script font-normal text-[1.2em] text-[#811B2B] inline-block -rotate-2">
              Nani&apos;s
            </span>
            <span> Craft Table</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {POSTCARD_NOTES.map((card) => {
            const isOpen = openPostcard === card.id;
            return (
              <div
                key={card.id}
                className={`rounded-[26px] border-2 p-5 sm:p-6 shadow-sm transition-shadow ${card.bgClass}`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenPostcard(isOpen ? null : card.id)}
                  className="w-full text-left flex flex-col gap-2 cursor-pointer focus-visible:outline-3 focus-visible:outline-[#811B2B] rounded-xl"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-2xl sm:text-3xl" aria-hidden="true">
                      {card.emoji}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/75 border border-[#641623]/15 text-[11px] font-bold text-[#641623]">
                      {isOpen ? 'Close note' : 'Open note ✨'}
                    </span>
                  </div>
                  <h3 className="font-black text-lg sm:text-xl text-[#641623] mt-1">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#641623]/75">
                    {card.teaser}
                  </p>
                </button>

                {isOpen && (
                  <div className="mt-4 pt-3.5 border-t border-[#641623]/15 space-y-2.5">
                    <p className="text-sm text-[#2D2424]/90 leading-relaxed">
                      &ldquo;{card.secretNote}&rdquo;
                    </p>
                    <p className="text-xs font-bold text-[#811B2B] uppercase tracking-wider">
                      — {card.artisanTag}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          5. COMMUNITY IMPACT CARD (200+ Nanis + Mascot)
          ===================================================================== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="relative overflow-hidden rounded-[30px] sm:rounded-[42px] bg-[#FFF5CC] border-[2.5px] border-[#811B2B]/20 p-6 sm:p-12 shadow-[0_16px_48px_rgba(100,22,35,0.08)]">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-[#FBF8CF]/60 pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-[#D9EEF5]/45 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF8] border border-[#811B2B]/20 text-[#811B2B] text-xs sm:text-sm font-bold tracking-wide uppercase mb-3">
                <span>✦ Since 2019, made with love ✦</span>
              </div>

              <div className="font-black text-5xl sm:text-7xl lg:text-8xl text-[#811B2B] tracking-tight leading-none mb-2">
                200+
              </div>

              <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-[#641623] tracking-tight leading-tight mb-3">
                Nanis, daadis, aunties and artisans
              </h2>

              <p className="font-normal text-sm sm:text-base lg:text-lg text-[#2D2424]/85 leading-relaxed max-w-xl mx-auto lg:mx-0">
                What began as one dream has blossomed into 200+ talented women earning independently from home — one careful stitch at a time.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={(e) => sendLoveToNani(e.clientX, e.clientY)}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-[#FFFDF8] border-2 border-[#811B2B] text-[#811B2B] font-bold text-sm hover:bg-[#811B2B] hover:text-white active:scale-95 transition-all cursor-pointer"
                >
                  <Heart aria-hidden="true" className="w-4 h-4 fill-current" />
                  <span>Cheer for Our Nanis ({loveCount.toLocaleString('en-IN')})</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 sm:w-44 sm:h-44 flex items-center justify-center">
                <img
                  src="/knotsnco_mascot_transparent.gif"
                  alt="Official Knots & Co yarn ball mascot smiling with a crochet hook"
                  className="w-full h-full object-contain select-none drop-shadow-md"
                  loading="lazy"
                />
              </div>
              <span className="mt-2 text-xs font-bold text-[#811B2B] uppercase tracking-wider text-center">
                Handmade with Pride in Surat
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          6. CLOSING STORY CTA
          ===================================================================== */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-14 sm:mt-20 pb-16 sm:pb-24">
        <div className="space-y-4 sm:space-y-5">
          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#641623] tracking-tight">
            <span>More than crochet. It&apos;s Nani&apos;s </span>
            <span className="font-script font-normal text-[1.22em] text-[#811B2B] inline-block -rotate-2">
              legacy.
            </span>
          </h2>

          <p className="font-normal text-sm sm:text-base md:text-lg text-[#2D2424]/85 leading-relaxed max-w-2xl mx-auto">
            Every bouquet, plushie, and little treasure carries the care of the nani who stitched it.
            When you choose handmade, you become a part of her story.
          </p>

          <p className="text-lg sm:text-2xl font-bold text-[#811B2B] pt-1">
            <span>A little yarn. A lot of </span>
            <span className="font-script font-normal text-[1.25em]">love</span>
            <span>. ♡</span>
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => onNavigateShop('all')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] sm:min-w-[240px] py-3.5 px-7 rounded-full bg-[#811B2B] text-white font-bold text-sm sm:text-base tracking-wide hover:bg-[#641623] shadow-md hover:shadow-lg transition-all active:scale-97 cursor-pointer"
            >
              <ShoppingBag aria-hidden="true" className="w-4 h-4" />
              <span>Explore Nani&apos;s Collection</span>
            </button>

            <button
              type="button"
              onClick={onNavigateHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] sm:min-w-[170px] py-3.5 px-6 rounded-full border-2 border-[#641623] text-[#641623] font-bold text-sm sm:text-base tracking-wide hover:bg-[#641623] hover:text-[#FBF8CF] transition-all cursor-pointer"
            >
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          7. NATIVE <dialog> PHOTO LIGHTBOX (Esc + Backdrop Light Dismiss)
          ===================================================================== */}
      <dialog
        ref={dialogRef}
        aria-labelledby="nani-lightbox-title"
        onClose={() => setLightboxChapter(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            setLightboxChapter(null);
          }
        }}
        className="m-auto w-[92vw] max-w-3xl rounded-[28px] bg-[#FFFDF8] p-0 border-2 border-[#641623]/20 shadow-2xl backdrop:bg-[#2D2424]/70 backdrop:backdrop-blur-xs"
      >
        {lightboxChapter && (
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 id="nani-lightbox-title" className="font-black text-lg sm:text-xl text-[#641623]">
                {lightboxChapter.step} · {lightboxChapter.title}
              </h2>
              <button
                type="button"
                onClick={() => setLightboxChapter(null)}
                aria-label="Close photo zoom"
                className="min-h-[40px] min-w-[40px] rounded-full bg-[#FFF5CC] text-[#641623] flex items-center justify-center hover:bg-[#811B2B] hover:text-white transition-colors cursor-pointer"
              >
                <X aria-hidden="true" className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-hidden rounded-[20px] bg-[#EFE6DC]">
              <picture>
                <source srcSet={lightboxChapter.imageWebp} type="image/webp" />
                <img
                  src={lightboxChapter.imagePng}
                  alt={lightboxChapter.alt}
                  className="w-full max-h-[70vh] object-contain"
                />
              </picture>
            </div>
            <p className="mt-3 text-sm text-[#641623]/80 italic text-center">
              &ldquo;{lightboxChapter.caption}&rdquo;
            </p>
          </div>
        )}
      </dialog>
    </div>
  );
};
