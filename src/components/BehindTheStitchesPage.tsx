import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  ShoppingBag,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ShopProduct } from '../data/allProductsData';

interface BehindTheStitchesPageProps {
  onNavigateHome: () => void;
  onNavigateShop: (category?: string) => void;
  onNavigateProduct?: (id: string) => void;
}

interface CraftHotspot {
  id: string;
  xPercent: number;
  yPercent: number;
  label: string;
  detail: string;
}

interface AlbumFrame {
  id: string;
  frameNo: string;
  timeStamp: string;
  title: string;
  subtitle: string;
  story: string[];
  whisper: string;
  imagePng: string;
  imageWebp: string;
  alt: string;
  tiltClass: string;
  hotspots: CraftHotspot[];
}

interface TransformationPair {
  id: string;
  label: string;
  hoursSpent: string;
  stitchEstimate: string;
  beforeImage: string;
  beforeAlt: string;
  afterImage: string;
  afterAlt: string;
  stages: {
    early: string;
    middle: string;
    finished: string;
  };
}

interface PerspectiveVoice {
  id: string;
  tab: string;
  salutation: string;
  paragraphs: string[];
  signOff: string;
}

const TRANSFORMATION_PAIRS: TransformationPair[] = [
  {
    id: 'sunflower-bouquet',
    label: 'Sunflowers',
    hoursSpent: '3–4 unhurried hours',
    stitchEstimate: '680+ hand-hooked loops',
    beforeImage: '/stories/artisan-3-creative-process.webp',
    beforeAlt: 'Nani seated at home in an indigo floral kurta crocheting marigold yellow wool',
    afterImage: '/story/story-lifestyle-table.jpg',
    afterAlt: 'Finished crochet sunflower bouquet wrapped in kraft paper with a maroon ribbon',
    stages: {
      early: 'Hour 01 — Soft cotton yarn rests over cushions as she builds the brown spiral center loop by loop.',
      middle: 'Hour 02 — Afternoon chai pauses beside her; 18 golden petals are shaped carefully with finger tension alone.',
      finished: 'Hour 04 — Wire-wrapped stems, stitched leaves, and tied in maroon satin. Flowers that never lose a single petal.',
    },
  },
  {
    id: 'daisy-pot',
    label: 'Daisy Pot',
    hoursSpent: '2.5 calm hours',
    stitchEstimate: '520+ neat slip-knots',
    beforeImage: '/stories/artisan-1-craft-begins.webp',
    beforeAlt: 'Nani wearing glasses crocheting red wool near morning window sunlight',
    afterImage: '/story/story-crochet-daisies.jpg',
    afterAlt: 'Handmade white daisy blooms arranged inside a braided yarn pot with wooden button',
    stages: {
      early: 'Hour 01 — Choosing her slender 3mm hook by the window before the afternoon sun warms the room.',
      middle: 'Hour 02 — Alternating dense stitches so the braided basket stands sturdy on its own without plastic inserts.',
      finished: 'Hour 2.5 — Finished with a little wooden button bow — quiet morning cheer for a study desk or kitchen shelf.',
    },
  },
  {
    id: 'peach-tulips',
    label: 'Peach Tulips',
    hoursSpent: '3 quiet hours',
    stitchEstimate: '610+ tight petal rows',
    beforeImage: '/stories/artisan-2-hands-magic.webp',
    beforeAlt: 'Close-up of Nani hands wearing an emerald stone ring while working yarn cleanly',
    afterImage: '/story/story-tulip-arch.jpg',
    afterAlt: 'Coral and blush crochet tulip stems tied with an ivory crocheted bow',
    stages: {
      early: 'Hour 01 — Thread looped twice over her forefinger so every cup-shaped tulip bud blooms uniformly.',
      middle: 'Hour 02 — Stuffed lightly with soft fibre-fill and closed at the crown by intuition alone.',
      finished: 'Hour 03 — Gathered into soft pastel stems with an ivory hand-crocheted ribbon ready to unwrap.',
    },
  },
];

const ALBUM_FRAMES: AlbumFrame[] = [
  {
    id: 'morning-window',
    frameNo: '01 / 04',
    timeStamp: 'Morning · Near the Window',
    title: 'Before the House Wakes Up',
    subtitle: 'Quiet sunlight, a denim lap apron, and her light blue hook.',
    story: [
      'Before the kitchen gets busy, she likes half an hour by the window where the daylight falls clean across the wool.',
      'She never follows a hurried assembly quota. When a flower starts taking shape in red cotton, it moves at the exact speed of calm breathing.',
    ],
    whisper: 'Every stitch begins at her own pace — never under factory fluorescent lights.',
    imagePng: '/stories/artisan-1-craft-begins.png',
    imageWebp: '/stories/artisan-1-craft-begins.webp',
    alt: 'Nani artisan wearing glasses crocheting red yarn with a blue crochet hook in soft window light',
    tiltClass: '-rotate-1',
    hotspots: [
      {
        id: 'hook',
        xPercent: 61,
        yPercent: 60,
        label: 'Her 3mm Aluminum Hook',
        detail: 'Light enough for three hours of stitching without tiring her wrists. Most nanis keep one favourite worn hook wrapped safely in a cloth pouch.',
      },
      {
        id: 'sunlight',
        xPercent: 32,
        yPercent: 36,
        label: 'Working by Daylight',
        detail: 'Working from home lets her pick the brightest hour of morning and pause whenever family needs her.',
      },
    ],
  },
  {
    id: 'emerald-ring',
    frameNo: '02 / 04',
    timeStamp: 'Afternoon · Evening Tea Hour',
    title: 'Thirty Winters in Her Knuckles',
    subtitle: 'Look closely at the rings and the stillness of her hands.',
    story: [
      'A machine stamps identical thread in half a second, and it feels cold the moment you touch it.',
      'Look at the steady angle of her knuckles holding that lilac strand: the same hands that taught nieces chain-stitches during summer holidays now send warmth across India.',
    ],
    whisper: 'That subtle organic curve on a flower petal comes directly from human grip and memory.',
    imagePng: '/stories/artisan-2-hands-magic.png',
    imageWebp: '/stories/artisan-2-hands-magic.webp',
    alt: 'Macro view of Nani weathered hands wearing an emerald ring and gold band guiding purple yarn',
    tiltClass: 'rotate-1',
    hotspots: [
      {
        id: 'ring',
        xPercent: 22,
        yPercent: 48,
        label: 'An Heirloom Stone Ring',
        detail: 'Her everyday gold bands catch the wool as she turns each row — forty years of patience woven directly into your keepsake.',
      },
      {
        id: 'knit',
        xPercent: 43,
        yPercent: 79,
        label: 'Counting Without Charts',
        detail: 'Experienced artisans track stripe transitions purely by fingertip feel while talking with grandchildren beside them.',
      },
    ],
  },
  {
    id: 'home-veranda',
    frameNo: '03 / 04',
    timeStamp: 'Mid-Day · On Her Own Sofa',
    title: 'Zero Shifts. Full Dignity.',
    subtitle: 'Made beside cushions, rugs, and family laughter in Surat.',
    story: [
      'In 2019, starting at sixteen, we didn’t rent noisy rooms with rows of machines. We carried bags of yarn up stairs straight to nanis’ living rooms.',
      'They decide how many pieces to take home each week. When festivals arrive or grandkids visit from school, the wool rests waiting until she chooses.',
    ],
    whisper: 'Independent income in her own hands — without ever stepping out into a crowded factory.',
    imagePng: '/stories/artisan-3-creative-process.png',
    imageWebp: '/stories/artisan-3-creative-process.webp',
    alt: 'Nani sitting comfortably at home in an indigo kurta crafting vibrant marigold crochet',
    tiltClass: '-rotate-1',
    hotspots: [
      {
        id: 'saffron',
        xPercent: 54,
        yPercent: 42,
        label: 'Warm Marigold Cotton',
        detail: 'We drop off combed cotton skeins at her doorstep every week and collect finished blooms without charging her a single rupee upfront.',
      },
      {
        id: 'cushion',
        xPercent: 26,
        yPercent: 73,
        label: 'Her Own Living Room',
        detail: 'Nothing beats crafting on a familiar rug beside afternoon tea rather than punching a clock.',
      },
    ],
  },
  {
    id: 'purple-tension',
    frameNo: '04 / 04',
    timeStamp: 'Sundown · Sharing Patterns',
    title: 'Two Hundred Living Rooms, One Family',
    subtitle: 'Different neighbourhoods across Surat sharing colours and pride.',
    story: [
      'See how the purple yarn wraps twice around her left forefinger? Every neighbourhood nani guards tiny tricks like that — passing them to younger women on the street.',
      'What started with one conversation now sustains more than two hundred women turning simple wool into gifts for birthdays, anniversaries, and homes.',
    ],
    whisper: 'When you buy one keychain or bouquet, it puts earned pride directly in one woman’s palm.',
    imagePng: '/stories/artisan-4-community-family.png',
    imageWebp: '/stories/artisan-4-community-family.webp',
    alt: 'Nani hands crocheting vibrant rainbow granny squares with lilac thread coiled around her finger',
    tiltClass: 'rotate-1',
    hotspots: [
      {
        id: 'tension',
        xPercent: 80,
        yPercent: 34,
        label: 'The Two-Wrap Tension Secret',
        detail: 'Wrapping yarn gently around her forefinger regulates pull smoothly, keeping hundreds of rows crisp and soft instead of stiff.',
      },
      {
        id: 'granny',
        xPercent: 45,
        yPercent: 68,
        label: 'Instinct for Colour',
        detail: 'Ruby, daffodil, moss, and rosewood rows balance naturally — a palette instinct honed over decades.',
      },
    ],
  },
];

const PERSPECTIVE_VOICES: PerspectiveVoice[] = [
  {
    id: 'nani',
    tab: "From Nani's Room",
    salutation: '“I used to stitch only for grandchildren’s winters.”',
    paragraphs: [
      'My eyes aren’t as fast as they were at twenty, so nobody imagines a sixty-something grandmother’s craft still belongs in modern homes. Then a young boy knocked with soft yellow yarn and asked if I could crochet sunflowers.',
      'Last Diwali, I bought bangles for my granddaughter from money I earned sitting right beside my evening tea. That happiness sits taller than anything else.',
    ],
    signOff: '— One of 200+ Nanis in Surat',
  },
  {
    id: 'family',
    tab: 'From Her Daughter',
    salutation: '“We never knew her quiet hobby meant so much to strangers.”',
    paragraphs: [
      'For thirty years, Maa fixed torn sweaters and made baby booties whenever anyone in the building had a child — never thinking twice about charging for her time.',
      'Now when an order message arrives, she puts on her spectacles with pride, spreads the skeins across the diwan, and asks where this bouquet is travelling next.',
    ],
    signOff: '— Family of a Knots & Co. Artisan',
  },
  {
    id: 'knots',
    tab: 'From Knots & Co.',
    salutation: '“Started at sixteen. Built on doorstep deliveries.”',
    paragraphs: [
      'When Knots & Co. began in 2019, we realized the finest crochet hands weren’t inside commercial workshops — they were resting quietly at home in neighbourhoods all around us.',
      'Today, more than two hundred nanis, daadis, and aunties form the backbone of everything on this website. Every slight tilt in a petal is proof a human made it with patience.',
    ],
    signOff: '— The Knots & Co. Team, Surat',
  },
];

export const BehindTheStitchesPage: React.FC<BehindTheStitchesPageProps> = ({
  onNavigateHome,
  onNavigateShop,
  onNavigateProduct,
}) => {
  const { products } = useProducts();
  const prefersReduced = useReducedMotion();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const albumTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);

  // Interactive State
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [sliderPercent, setSliderPercent] = useState(52);
  const [activeFrameIndex, setActiveFrameIndex] = useState(1); // Start with iconic emerald-ring macro photo
  const [activeHotspotId, setActiveHotspotId] = useState<string>(ALBUM_FRAMES[1].hotspots[0].id);
  const [activeVoiceIndex, setActiveVoiceIndex] = useState(0);
  const [lightboxFrame, setLightboxFrame] = useState<AlbumFrame | null>(null);

  const currentPair = TRANSFORMATION_PAIRS[selectedPairIndex];
  const currentFrame = ALBUM_FRAMES[activeFrameIndex];
  const currentHotspot =
    currentFrame.hotspots.find((h) => h.id === activeHotspotId) || currentFrame.hotspots[0];
  const currentVoice = PERSPECTIVE_VOICES[activeVoiceIndex];

  // Pick 4 real handmade Shopify items to showcase "Fresh off her table"
  const handpickedPieces = useMemo<ShopProduct[]>(() => {
    const inStock = products.filter((p) => p.inStock && p.image);
    const categoriesPriority = ['Bouquets', 'Flower Pots', 'Keychains', 'Plushies'];
    const picked: ShopProduct[] = [];
    const seenIds = new Set<string>();

    for (const cat of categoriesPriority) {
      const match = inStock.find(
        (p) =>
          p.category.toLowerCase().includes(cat.toLowerCase()) && !seenIds.has(p.id)
      );
      if (match) {
        picked.push(match);
        seenIds.add(match.id);
      }
    }
    for (const p of inStock) {
      if (picked.length >= 4) break;
      if (!seenIds.has(p.id)) {
        picked.push(p);
        seenIds.add(p.id);
      }
    }
    return picked;
  }, [products]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Reset active hotspot cleanly whenever photo changes
  useEffect(() => {
    setActiveHotspotId(ALBUM_FRAMES[activeFrameIndex].hotspots[0].id);
  }, [activeFrameIndex]);

  // Native <dialog> lightbox sync
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightboxFrame && !dialog.open) dialog.showModal();
    else if (!lightboxFrame && dialog.open) dialog.close();
  }, [lightboxFrame]);

  // Slider stage narrative copy based on sliderPercent
  const currentStageCopy =
    sliderPercent < 34
      ? currentPair.stages.early
      : sliderPercent < 70
      ? currentPair.stages.middle
      : currentPair.stages.finished;

  const currentStageLabel =
    sliderPercent < 34
      ? 'Stage 1 · Skein & Tension'
      : sliderPercent < 70
      ? 'Stage 2 · Afternoon Patience'
      : 'Stage 3 · Ready to Keep';

  const scrollToTransform = () => {
    sliderContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Keyboard navigation for album tabs
  const handleAlbumTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const len = ALBUM_FRAMES.length;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (activeFrameIndex + 1) % len;
    else if (e.key === 'ArrowLeft') next = (activeFrameIndex - 1 + len) % len;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = len - 1;

    if (next !== null) {
      e.preventDefault();
      setActiveFrameIndex(next);
      albumTabRefs.current[next]?.focus();
    }
  };

  // Mobile horizontal swipe on album deck without blocking vertical page scroll
  const handleDeckTouchStart = (e: React.TouchEvent) => {
    swipeStartX.current = e.touches[0].clientX;
    swipeStartY.current = e.touches[0].clientY;
  };

  const handleDeckTouchEnd = (e: React.TouchEvent) => {
    if (swipeStartX.current === null || swipeStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - swipeStartX.current;
    const dy = e.changedTouches[0].clientY - swipeStartY.current;
    swipeStartX.current = null;
    swipeStartY.current = null;

    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      if (dx < 0) {
        setActiveFrameIndex((i) => (i + 1) % ALBUM_FRAMES.length);
      } else {
        setActiveFrameIndex((i) => (i - 1 + ALBUM_FRAMES.length) % ALBUM_FRAMES.length);
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FBF8CF] text-[#2D2424] font-['Fredoka'] overflow-x-hidden">
      {/* =====================================================================
          1. QUIET ARCHIVE TOP BAR
          ===================================================================== */}
      <div className="w-full bg-[#FFFDF8] border-b border-[#641623]/10 py-2.5 px-4 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 min-h-[40px] px-2 -ml-2 rounded-lg text-xs sm:text-sm font-bold text-[#641623] hover:text-[#811B2B] hover:-translate-x-0.5 transition-all cursor-pointer focus-visible:outline-3 focus-visible:outline-[#811B2B] focus-visible:outline-offset-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Home</span>
          </button>

          <nav aria-label="Breadcrumb" className="text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-[#641623]/60">
            <span>Knots &amp; Co. Archive</span>
            <span className="mx-2 text-[#811B2B]/40" aria-hidden="true">/</span>
            <span className="text-[#811B2B]" aria-current="page">Nani</span>
          </nav>
        </div>
      </div>

      {/* =====================================================================
          2. ACT 1 — INTIMATE EDITORIAL COVER
          ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 pt-10 sm:pt-16 lg:pt-20 pb-14 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Editorial Typography */}
          <div className="lg:col-span-6 text-left space-y-5 sm:space-y-6">
            <p className="font-script text-xl sm:text-2xl text-[#811B2B] -rotate-1 inline-block">
              before a flower blooms in your room
            </p>

            <h1
              className="font-black text-[#641623] tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(2.55rem, 1.4rem + 4.4vw, 4.75rem)' }}
            >
              <span>It rested in </span>
              <span className="font-script font-normal text-[1.18em] text-[#811B2B] inline-block -rotate-2 px-1">
                Nani&apos;s
              </span>
              <span> lap.</span>
            </h1>

            <div className="space-y-3.5 text-base sm:text-lg text-[#2D2424]/85 leading-relaxed max-w-xl font-normal">
              <p>
                Everyone remembers a grandmother sitting quietly near an afternoon window, hands busy long after everyone else grew restless.
              </p>
              <p>
                Across Surat, more than <strong className="font-bold text-[#641623]">200 nanis, daadis, and neighbourhood aunties</strong> turn simple cotton skeins into keepsakes you can actually hold onto for years.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={scrollToTransform}
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-full bg-[#641623] text-[#FBF8CF] font-bold text-sm sm:text-base shadow-sm hover:bg-[#811B2B] active:scale-97 transition-all cursor-pointer focus-visible:outline-3 focus-visible:outline-[#811B2B] focus-visible:outline-offset-2"
              >
                <span>See how yarn becomes art</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateShop('all')}
                className="inline-flex items-center justify-center min-h-[46px] px-5 py-3 rounded-full border-2 border-[#641623]/30 text-[#641623] font-bold text-sm sm:text-base hover:border-[#641623] hover:bg-[#FFF5CC] transition-all cursor-pointer focus-visible:outline-3 focus-visible:outline-[#811B2B] focus-visible:outline-offset-2"
              >
                Shop her collection
              </button>
            </div>
          </div>

          {/* Right Paper-Taped Darkroom Print of Iconic Hands */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <motion.figure
              initial={prefersReduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[440px] bg-[#FFFDF8] p-3.5 sm:p-5 pb-7 sm:pb-9 rounded-[4px] sm:rounded-[6px] border border-[#641623]/12 shadow-[0_24px_55px_rgba(100,22,35,0.13)] -rotate-1"
            >
              {/* Tactile kraft paper masking tape corners */}
              <span
                aria-hidden="true"
                className="absolute -top-3 left-6 w-20 h-6 bg-[#F3DF99]/85 border border-[#D4B86A]/40 -rotate-12 shadow-2xs pointer-events-none"
              />
              <span
                aria-hidden="true"
                className="absolute -top-2.5 right-6 w-16 h-6 bg-[#F3DF99]/85 border border-[#D4B86A]/40 rotate-12 shadow-2xs pointer-events-none"
              />

              <div className="overflow-hidden bg-[#EFE6DC] aspect-[4/4.3]">
                <picture>
                  <source srcSet="/stories/artisan-2-hands-magic.webp" type="image/webp" />
                  <img
                    src="/stories/artisan-2-hands-magic.png"
                    alt="Macro portrait of Nani hands wearing an emerald gold ring guiding purple yarn over striped wool"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </picture>
              </div>

              <figcaption className="mt-4 sm:mt-5 px-1 flex items-baseline justify-between gap-3">
                <span className="font-script text-xl sm:text-2xl text-[#641623]">
                  One emerald ring, forty years of memory.
                </span>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#811B2B]/60 flex-shrink-0">
                  Surat
                </span>
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </section>

      {/* Subtle golden wavy thread transition */}
      <div className="w-full overflow-hidden flex justify-center mb-12 sm:mb-20" aria-hidden="true">
        <svg viewBox="0 0 1440 24" fill="none" preserveAspectRatio="none" className="w-full h-4 sm:h-5 text-[#F7BE44]">
          <path
            d="M0 12 C 30 0, 60 24, 90 12 C 120 0, 150 24, 180 12 C 210 0, 240 24, 270 12 C 300 0, 330 24, 360 12 C 390 0, 420 24, 450 12 C 480 0, 510 24, 540 12 C 570 0, 600 24, 630 12 C 660 0, 690 24, 720 12 C 750 0, 780 24, 810 12 C 840 0, 870 24, 900 12 C 930 0, 960 24, 990 12 C 1020 0, 1050 24, 1080 12 C 1110 0, 1140 24, 1170 12 C 1200 0, 1230 24, 1260 12 C 1290 0, 1320 24, 1350 12 C 1380 0, 1410 24, 1440 12"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* =====================================================================
          3. ACT 2 — PULL THE THREAD: INTERACTIVE YARN -> TREASURE REVEAL
          ===================================================================== */}
      <section ref={sliderContainerRef} className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 pb-20 sm:pb-28">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#811B2B]">
            Slide Across to Uncover the Craft
          </p>
          <h2 className="font-black text-2xl sm:text-4xl lg:text-[42px] text-[#641623] tracking-tight leading-tight">
            <span>From loose cotton thread to </span>
            <span className="font-script font-normal text-[1.2em] text-[#811B2B] inline-block -rotate-1">
              forever
            </span>
            <span> keepsake</span>
          </h2>
          <p className="text-sm sm:text-base text-[#2D2424]/75">
            Drag left or right — watch hours of quiet fingerwork turn into the piece on your shelf.
          </p>
        </div>

        {/* Pair Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 pb-1">
          {TRANSFORMATION_PAIRS.map((pair, idx) => {
            const active = idx === selectedPairIndex;
            return (
              <button
                key={pair.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedPairIndex(idx)}
                className={`flex-none min-h-[40px] px-3.5 sm:px-4.5 py-2 rounded-full text-xs sm:text-sm font-bold border transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-3 focus-visible:outline-[#811B2B] ${
                  active
                    ? 'bg-[#641623] text-[#FBF8CF] border-[#641623]'
                    : 'bg-[#FFFDF8] text-[#641623] border-[#641623]/20 hover:bg-[#FFF5CC]'
                }`}
              >
                {pair.label}
              </button>
            );
          })}
        </div>

        {/* Comparison Viewport */}
        <div className="max-w-3xl mx-auto bg-[#FFFDF8] p-3 sm:p-5 rounded-[28px] sm:rounded-[36px] border border-[#641623]/12 shadow-[0_20px_52px_rgba(100,22,35,0.1)]">
          <div className="relative w-full aspect-[4/4] sm:aspect-[16/11] rounded-[20px] sm:rounded-[26px] overflow-hidden bg-[#EFE6DC] select-none has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[#641623] has-[:focus-visible]:outline-offset-2">
            {/* Underlayer: Finished Piece (Right side revealed) */}
            <img
              src={currentPair.afterImage}
              alt={currentPair.afterAlt}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              loading="lazy"
            />

            {/* Overlayer: Nani Crafting Yarn (Clipped dynamically) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPercent}% 0 0)` }}
            >
              <img
                src={currentPair.beforeImage}
                alt={currentPair.beforeAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Subtle Corner Labels */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1 rounded-full bg-[#2D2424]/75 backdrop-blur-xs text-[#FBF8CF] text-[11px] sm:text-xs font-bold pointer-events-none">
              In Nani&apos;s Hands
            </div>
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1 rounded-full bg-[#FFFDF8]/90 backdrop-blur-xs text-[#641623] text-[11px] sm:text-xs font-bold pointer-events-none shadow-2xs">
              In Your Room
            </div>

            {/* Vertical Seam Line + Circular Yarn Knob */}
            <div
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-[2.5px] bg-[#FFFDF8] shadow-[0_0_12px_rgba(45,36,36,0.35)] pointer-events-none"
              style={{ left: `${sliderPercent}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFDF8] border-2 border-[#641623] shadow-lg flex items-center justify-center text-[#641623]">
                <ChevronLeft className="w-4 h-4 -mr-1" />
                <ChevronRight className="w-4 h-4 -ml-1" />
              </div>
            </div>

            {/* Native Range Input overlay: preserves keyboard arrows, touch drag & accessibility */}
            <input
              type="range"
              min={5}
              max={95}
              step={1}
              value={sliderPercent}
              aria-label={`Compare raw yarn crafting and finished ${currentPair.label}`}
              aria-valuetext={`${sliderPercent}% — ${currentStageLabel}`}
              onChange={(e) => setSliderPercent(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 m-0"
            />
          </div>

          {/* Interactive Stage Readout + Quick Jump Tap Pills */}
          <div className="mt-4 sm:mt-5 px-1 sm:px-2 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#811B2B]">
              <span>{currentStageLabel}</span>
              <span className="text-[#641623]/70">
                {currentPair.hoursSpent} · {currentPair.stitchEstimate}
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#2D2424]/85 leading-relaxed min-h-[3.2rem]">
              {currentStageCopy}
            </p>

            {/* Stage jump buttons for users who prefer tapping on small screens */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: '01 · Yarn', val: 18, active: sliderPercent < 34 },
                { label: '02 · Looping', val: 52, active: sliderPercent >= 34 && sliderPercent < 70 },
                { label: '03 · Keepsake', val: 88, active: sliderPercent >= 70 },
              ].map((st) => (
                <button
                  key={st.label}
                  type="button"
                  aria-pressed={st.active}
                  onClick={() => setSliderPercent(st.val)}
                  className={`min-h-[40px] rounded-xl border text-[11px] sm:text-xs font-bold cursor-pointer transition-colors ${
                    st.active
                      ? 'bg-[#FFF5CC] border-[#641623]/45 text-[#641623]'
                      : 'bg-[#FBF8CF]/60 hover:bg-[#FFF5CC] border-[#641623]/15 text-[#641623]/75'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. ACT 3 — HER PHOTOGRAPH STACK & LOUPE DETAIL PINS
          ===================================================================== */}
      <section className="w-full bg-[#D9EEF5]/55 border-y border-[#7BBFD4]/35 py-14 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#811B2B]">
                Swipe Photos · Tap the Circles to Inspect
              </p>
              <h2 className="font-black text-2xl sm:text-4xl text-[#641623] tracking-tight">
                <span>Four quiet moments from </span>
                <span className="font-script font-normal text-[1.2em] text-[#811B2B]">
                  her day
                </span>
              </h2>
            </div>

            {/* Accessible Single-Row Album Index Tabs */}
            <div
              role="tablist"
              aria-label="Nani Photo Album Moments"
              onKeyDown={handleAlbumTabKeyDown}
              className="flex flex-nowrap items-center gap-1.5 overflow-x-auto no-scrollbar pb-1"
            >
              {ALBUM_FRAMES.map((frame, idx) => {
                const selected = idx === activeFrameIndex;
                return (
                  <button
                    key={frame.id}
                    ref={(el) => {
                      albumTabRefs.current[idx] = el;
                    }}
                    id={`album-tab-${frame.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveFrameIndex(idx)}
                    className={`flex-none min-h-[42px] px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-3 focus-visible:outline-[#811B2B] ${
                      selected
                        ? 'bg-[#641623] text-[#FBF8CF] border-[#641623] border-b-[3px] border-b-[#F7BE44]'
                        : 'bg-[#FFFDF8] text-[#641623] border-[#641623]/20 border-b-[3px] border-b-transparent hover:bg-[#FFF5CC]'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            role="tabpanel"
            id={`album-panel-${currentFrame.id}`}
            aria-labelledby={`album-tab-${currentFrame.id}`}
            tabIndex={0}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center focus-visible:outline-3 focus-visible:outline-[#811B2B] rounded-2xl"
          >
            {/* Left: Stacked Polaroid Frame with Direct Craft Pins */}
            <div
              onTouchStart={handleDeckTouchStart}
              onTouchEnd={handleDeckTouchEnd}
              className="lg:col-span-6 relative max-w-[460px] w-full mx-auto touch-pan-y pt-2 pb-4"
            >
              {/* Subtle peeking backing photos to feel like physical prints on a table */}
              <button
                type="button"
                aria-label="Next photograph in stack"
                onClick={() => setActiveFrameIndex((i) => (i + 1) % ALBUM_FRAMES.length)}
                className="hidden sm:block absolute inset-x-4 top-5 bottom-1 bg-[#FFFDF8] rounded-[6px] border border-[#641623]/12 shadow-md rotate-[3.5deg] cursor-pointer hover:rotate-[5deg] transition-transform"
              />
              <div
                aria-hidden="true"
                className="hidden sm:block absolute inset-x-6 top-6 bottom-0 bg-[#FFF5CC] rounded-[6px] border border-[#641623]/10 shadow-sm -rotate-[2.5deg]"
              />

              {/* Active Front Print */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFrame.id}
                  initial={prefersReduced ? false : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReduced ? undefined : { opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative z-10 bg-[#FFFDF8] p-3 sm:p-4 pb-5 rounded-[6px] border border-[#641623]/15 shadow-[0_22px_50px_rgba(100,22,35,0.14)] ${currentFrame.tiltClass}`}
                >
                  <div className="relative overflow-hidden aspect-[4/4.3] bg-[#EFE6DC]">
                    <picture>
                      <source srcSet={currentFrame.imageWebp} type="image/webp" />
                      <img
                        src={currentFrame.imagePng}
                        alt={currentFrame.alt}
                        className="w-full h-full object-cover select-none"
                      />
                    </picture>

                    {/* Loupe Stitch Pins positioned over real visual details in each photo */}
                    {currentFrame.hotspots.map((spot) => {
                      const isOpen = spot.id === currentHotspot.id;
                      return (
                        <button
                          key={spot.id}
                          type="button"
                          aria-pressed={isOpen}
                          aria-label={`Inspect detail: ${spot.label}`}
                          onClick={() => setActiveHotspotId(spot.id)}
                          style={{
                            left: `${spot.xPercent}%`,
                            top: `${spot.yPercent}%`,
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center cursor-pointer group focus-visible:outline-3 focus-visible:outline-[#FFFDF8] rounded-full"
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 border-2 shadow-md ${
                              isOpen
                                ? 'bg-[#811B2B] border-[#FFFDF8] scale-115'
                                : 'bg-[#FFFDF8]/90 border-[#641623] group-hover:scale-110'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isOpen ? 'bg-[#F7BE44]' : 'bg-[#641623]'
                              }`}
                            />
                          </span>
                        </button>
                      );
                    })}

                    {/* Fullscreen inspect button */}
                    <button
                      type="button"
                      onClick={() => setLightboxFrame(currentFrame)}
                      aria-label={`Expand photograph: ${currentFrame.title}`}
                      className="absolute bottom-3 right-3 min-h-[38px] px-3 py-1.5 rounded-full bg-[#2D2424]/75 backdrop-blur-xs text-[#FFFDF8] text-xs font-bold inline-flex items-center gap-1.5 hover:bg-[#641623] transition-colors cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Close-up</span>
                    </button>
                  </div>

                  {/* Polaroid Bottom Margin Note */}
                  <div className="mt-3.5 px-1 flex items-baseline justify-between gap-2">
                    <span className="font-script text-lg sm:text-xl text-[#641623]">
                      {currentFrame.timeStamp}
                    </span>
                    <span className="text-[11px] font-bold tracking-widest text-[#811B2B]/65">
                      {currentFrame.frameNo}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Narrative & Active Loupe Callout */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div>
                <h3 className="font-black text-2xl sm:text-3xl lg:text-4xl text-[#641623] tracking-tight leading-snug">
                  {currentFrame.title}
                </h3>
                <p className="mt-1.5 font-semibold text-base sm:text-lg text-[#811B2B]">
                  {currentFrame.subtitle}
                </p>
              </div>

              <div className="space-y-3 text-sm sm:text-base text-[#2D2424]/85 leading-relaxed">
                {currentFrame.story.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Active Photo Pin Detail Card */}
              <div className="rounded-2xl bg-[#FFFDF8] border border-[#641623]/15 p-4 sm:p-5 shadow-2xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#811B2B]">
                    Inside This Photograph
                  </span>
                  <div className="flex items-center gap-1.5">
                    {currentFrame.hotspots.map((spot, sIdx) => (
                      <button
                        key={spot.id}
                        type="button"
                        onClick={() => setActiveHotspotId(spot.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                          spot.id === currentHotspot.id
                            ? 'bg-[#641623] text-[#FBF8CF]'
                            : 'bg-[#FFF5CC] text-[#641623] hover:bg-[#F7BE44]/50'
                        }`}
                      >
                        Detail {sIdx + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="font-bold text-sm sm:text-base text-[#641623]">
                  {currentHotspot.label}
                </p>
                <p className="text-xs sm:text-sm text-[#2D2424]/80 leading-relaxed">
                  {currentHotspot.detail}
                </p>
              </div>

              {/* Clean Album Stepper Controls */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveFrameIndex((i) => (i - 1 + ALBUM_FRAMES.length) % ALBUM_FRAMES.length)
                  }
                  className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-[#FFFDF8] border border-[#641623]/25 text-xs sm:text-sm font-bold text-[#641623] hover:bg-[#FFF5CC] cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-semibold text-[#641623]/65 hidden xl:inline text-center">
                  {currentFrame.whisper}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveFrameIndex((i) => (i + 1) % ALBUM_FRAMES.length)}
                  className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-2 min-h-[44px] px-5 py-2 rounded-full bg-[#641623] text-[#FBF8CF] text-xs sm:text-sm font-bold hover:bg-[#811B2B] cursor-pointer transition-colors shadow-xs"
                >
                  <span>Next photo</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. ACT 4 — THE STATIONERY LETTER & REAL VOICES
          ===================================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="relative bg-[#FFFDF8] rounded-[24px] sm:rounded-[32px] border-2 border-[#641623]/15 p-6 sm:p-10 lg:p-12 shadow-[0_18px_45px_rgba(100,22,35,0.07)]">
          {/* Mascot stamp in corner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#641623]/12">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#811B2B]">
                In Three Voices · Surat, India
              </p>
              <h2 className="mt-1 font-black text-2xl sm:text-3xl text-[#641623]">
                Why we never built a factory
              </h2>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <img
                src="/knotsnco_mascot_transparent.gif"
                alt="Knots & Co mascot illustration"
                className="w-14 h-14 object-contain"
                loading="lazy"
              />
            </div>
          </div>

          {/* Perspective Switcher Pills */}
          <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-2 py-5 border-b border-[#641623]/8">
            {PERSPECTIVE_VOICES.map((voice, idx) => {
              const selected = idx === activeVoiceIndex;
              return (
                <button
                  key={voice.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveVoiceIndex(idx)}
                  className={`flex-none min-h-[40px] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                    selected
                      ? 'bg-[#FFF5CC] text-[#641623] border-[#641623] border-b-[3px]'
                      : 'bg-transparent text-[#641623]/70 border-[#641623]/15 hover:text-[#641623]'
                  }`}
                >
                  {voice.tab}
                </button>
              );
            })}
          </div>

          {/* Voice Letter Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVoice.id}
              initial={prefersReduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="pt-6 space-y-4 text-left"
            >
              <p className="font-script text-2xl sm:text-3xl text-[#811B2B] leading-snug">
                {currentVoice.salutation}
              </p>
              <div className="space-y-3 text-sm sm:text-base text-[#2D2424]/85 leading-relaxed">
                {currentVoice.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <p className="pt-2 text-xs sm:text-sm font-bold text-[#641623]/75 tracking-wide">
                {currentVoice.signOff}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* =====================================================================
          6. ACT 5 — FRESH OFF NANI'S TABLE TODAY (Live Shopify Products)
          ===================================================================== */}
      {handpickedPieces.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 pb-18 sm:pb-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7 sm:mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#811B2B]">
                Live From Their Craft Tables
              </p>
              <h2 className="mt-1 font-black text-2xl sm:text-4xl text-[#641623]">
                <span>Stitched by these hands, </span>
                <span className="font-script font-normal text-[1.2em] text-[#811B2B]">
                  ready to keep
                </span>
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigateShop('all')}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 text-sm font-bold text-[#811B2B] hover:text-[#641623] underline underline-offset-4 cursor-pointer"
            >
              <span>Browse all pieces</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {handpickedPieces.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onNavigateProduct ? onNavigateProduct(item.handle || item.id) : onNavigateShop(item.category)
                }
                className="group text-left bg-[#FFFDF8] rounded-[20px] sm:rounded-[26px] border border-[#641623]/12 p-2.5 sm:p-3.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer focus-visible:outline-3 focus-visible:outline-[#811B2B]"
              >
                <div className="aspect-square rounded-[14px] sm:rounded-[18px] overflow-hidden bg-[#EFE6DC]">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="pt-2.5 sm:pt-3 px-1 space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#811B2B]/75 truncate">
                    {item.category}
                  </p>
                  <h3 className="font-bold text-sm sm:text-base text-[#641623] leading-snug line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-extrabold text-sm sm:text-base text-[#2D2424]">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-bold text-[#811B2B] group-hover:underline">
                      View →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => onNavigateShop('all')}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-3.5 rounded-full bg-[#811B2B] text-white font-bold text-sm sm:text-base shadow-md hover:bg-[#641623] active:scale-97 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span>Explore Everything Handmade</span>
            </button>
          </div>
        </section>
      )}

      {/* =====================================================================
          7. NATIVE <dialog> FULLSCREEN PHOTO INSPECTOR
          ===================================================================== */}
      <dialog
        ref={dialogRef}
        aria-labelledby="nani-photo-modal-title"
        onClose={() => setLightboxFrame(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setLightboxFrame(null);
        }}
        className="m-auto w-[92vw] max-w-3xl rounded-[24px] bg-[#FFFDF8] p-0 border border-[#641623]/20 shadow-2xl backdrop:bg-[#2D2424]/75 backdrop:backdrop-blur-xs"
      >
        {lightboxFrame && (
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#811B2B]">
                  {lightboxFrame.frameNo} · {lightboxFrame.timeStamp}
                </p>
                <h2 id="nani-photo-modal-title" className="font-black text-lg sm:text-xl text-[#641623]">
                  {lightboxFrame.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setLightboxFrame(null)}
                aria-label="Close photograph"
                className="min-h-[42px] min-w-[42px] rounded-full bg-[#FFF5CC] text-[#641623] flex items-center justify-center hover:bg-[#811B2B] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-hidden rounded-[16px] bg-[#EFE6DC]">
              <picture>
                <source srcSet={lightboxFrame.imageWebp} type="image/webp" />
                <img
                  src={lightboxFrame.imagePng}
                  alt={lightboxFrame.alt}
                  className="w-full max-h-[70dvh] object-contain"
                />
              </picture>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-[#641623]/80 italic text-center">
              {lightboxFrame.whisper}
            </p>
          </div>
        )}
      </dialog>
    </div>
  );
};
