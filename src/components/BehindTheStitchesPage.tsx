import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ZoomIn,
  X,
  ShoppingBag,
  Plus,
  Check,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

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
  shopifyHandle: string;
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

interface PracticalFaqItem {
  id: string;
  question: string;
  answer: string;
}

const optimizeShopifyUrl = (url: string, width = 700) => {
  if (!url) return url;
  if (url.includes('cdn.shopify.com') && !url.includes('&width=')) {
    return `${url}&width=${width}&format=webp`;
  }
  return url;
};

const TRANSFORMATION_PAIRS: TransformationPair[] = [
  {
    id: 'full-of-sunshine',
    label: 'Full Of Sunshine',
    shopifyHandle: 'flowers-bouquet-full-of-sunshine',
    hoursSpent: '3–4 hrs crafted',
    stitchEstimate: '680+ loops',
    beforeImage: '/stories/artisan-3-creative-process.webp',
    beforeAlt: 'Nani seated at home crocheting marigold yellow wool',
    afterImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/zpc9P5wW_ZNM0MJ7TRS_2026-09-29_1.jpg?v=1793949872',
    afterAlt: 'Actual Knots & Co Bouquet Full Of Sunshine with crocheted sunflowers and daisies',
    stages: {
      early: 'Hour 01 — Soft milk cotton sits across her lap as she forms each brown center spiral by hand.',
      middle: 'Hour 02 — Afternoon tea beside her; 18 golden petals and white daisies shaped cleanly by touch.',
      finished: 'Hour 04 — Wired bendable stems wrapped in kraft paper and satin. Lasts for years without water.',
    },
  },
  {
    id: 'golden-glow',
    label: 'Golden Glow',
    shopifyHandle: 'flowers-golden-glow',
    hoursSpent: '2.5 hrs crafted',
    stitchEstimate: '520+ knots',
    beforeImage: '/stories/artisan-1-craft-begins.webp',
    beforeAlt: 'Nani wearing glasses crocheting cotton yarn by sunlit window',
    afterImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_HlaGdz4d_1791261152985_uvfj3vvo6fyywq7.jpg?v=1793949877',
    afterAlt: 'Actual Knots & Co Golden Glow sunflower bouquet photographed outdoors',
    stages: {
      early: 'Hour 01 — Using her light 3mm crochet hook in morning window light.',
      middle: 'Hour 02 — Fine leaf veins and chamomile buds stitched tight enough to hold their curl.',
      finished: 'Hour 2.5 — Wrapped ready to gift in Golden Glow — bright cheer for study desks and shelves.',
    },
  },
  {
    id: 'tulip-valley',
    label: 'Tulip Valley',
    shopifyHandle: 'flowers-mini-crochet-tulip-valley',
    hoursSpent: '3 hrs crafted',
    stitchEstimate: '610+ rows',
    beforeImage: '/stories/artisan-2-hands-magic.webp',
    beforeAlt: 'Close-up of Nani hands wearing an emerald ring guiding cotton yarn',
    afterImage: 'https://cdn.shopify.com/s/files/1/0688/9829/1775/files/website_refTGTSD_1791261172997_ip1i5z5roefp22w.jpg?v=1793949970',
    afterAlt: 'Actual Knots & Co Mini Crochet Tulip Valley bouquet in blush paper wrap',
    stages: {
      early: 'Hour 01 — Strand looped twice around her finger so every tulip petal stays plump and uniform.',
      middle: 'Hour 02 — Stuffed softly with fibre-fill and sealed smoothly without visible knots.',
      finished: 'Hour 03 — Five cream and pink tulips tied in blush wrap with an organza bow.',
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
      'Before the kitchen gets busy, she takes half an hour by the window where daylight falls clean across the cotton yarn.',
      'No hourly quota, no noisy room — every flower grows at a calm, unrushed pace.',
    ],
    whisper: 'Crafted at home under daylight, never factory lights.',
    imagePng: '/stories/artisan-1-craft-begins.png',
    imageWebp: '/stories/artisan-1-craft-begins.webp',
    alt: 'Nani wearing glasses crocheting red yarn with a blue crochet hook near a bright window',
    tiltClass: '-rotate-1',
    hotspots: [
      {
        id: 'hook',
        xPercent: 61,
        yPercent: 60,
        label: '3mm Aluminum Hook',
        detail: 'Lightweight enough for long afternoons without wrist strain — most nanis guard one favourite hook for decades.',
      },
      {
        id: 'sunlight',
        xPercent: 32,
        yPercent: 36,
        label: 'Natural Morning Light',
        detail: 'Working from home lets her pick comfortable daytime hours around cooking and resting.',
      },
    ],
  },
  {
    id: 'emerald-ring',
    frameNo: '02 / 04',
    timeStamp: 'Afternoon · Tea Hour',
    title: 'Thirty Winters in Her Knuckles',
    subtitle: 'Look closely at the rings and the stillness of her hands.',
    story: [
      'A factory machine stamps synthetic knit in seconds — and feels stiff the moment you touch it.',
      'Here, decades of muscle memory control stitch tightness intuitively so petals stay crisp yet soft.',
    ],
    whisper: 'Minor stitch curves are proof a real person shaped it.',
    imagePng: '/stories/artisan-2-hands-magic.png',
    imageWebp: '/stories/artisan-2-hands-magic.webp',
    alt: 'Close-up of Nani hands wearing an emerald ring guiding lilac yarn cleanly',
    tiltClass: 'rotate-1',
    hotspots: [
      {
        id: 'ring',
        xPercent: 22,
        yPercent: 48,
        label: 'Heirloom Gold & Stone Ring',
        detail: 'These same hands taught daughters chain stitches during summer breaks — now they craft keepsakes shipped across India.',
      },
      {
        id: 'knit',
        xPercent: 43,
        yPercent: 79,
        label: 'Stitch Tension by Feel',
        detail: 'Seasoned artisans switch stripes and flower curls purely by fingertip feel.',
      },
    ],
  },
  {
    id: 'home-veranda',
    frameNo: '03 / 04',
    timeStamp: 'Mid-Day · On Her Sofa',
    title: 'Zero Shifts. Full Dignity.',
    subtitle: 'Made beside cushions, rugs, and family laughter in Surat.',
    story: [
      'Since 2019, instead of renting warehouse floors, we deliver raw yarn and patterns directly to nanis’ doorsteps across Surat.',
      'Each woman chooses how much work fits her week — resting freely during family visits and festivals.',
    ],
    whisper: 'Every order funds independent home earnings.',
    imagePng: '/stories/artisan-3-creative-process.png',
    imageWebp: '/stories/artisan-3-creative-process.webp',
    alt: 'Nani sitting comfortably at home crafting marigold crochet',
    tiltClass: '-rotate-1',
    hotspots: [
      {
        id: 'saffron',
        xPercent: 54,
        yPercent: 42,
        label: 'Doorstep Yarn Supply',
        detail: 'Combed cotton yarn and floral wire are delivered weekly — zero upfront cost for the artisan.',
      },
      {
        id: 'cushion',
        xPercent: 26,
        yPercent: 73,
        label: 'Comfort of Home',
        detail: 'No daily commute, no rigid shift — she works right beside her own family.',
      },
    ],
  },
  {
    id: 'purple-tension',
    frameNo: '04 / 04',
    timeStamp: 'Sundown · Sharing Patterns',
    title: '200+ Homes, One Sisterhood',
    subtitle: 'Neighbourhood nanis mentoring younger women stitch by stitch.',
    story: [
      'Notice the purple yarn coiled softly around her left forefinger — subtle craft techniques pass person-to-person across streets in Surat.',
      'What began with one conversation now sustains more than two hundred women crafting everyday gifts.',
    ],
    whisper: 'Passing heirloom needlecraft to the next generation.',
    imagePng: '/stories/artisan-4-community-family.png',
    imageWebp: '/stories/artisan-4-community-family.webp',
    alt: 'Nani hands crocheting vibrant rainbow granny squares with lilac thread coiled around her finger',
    tiltClass: 'rotate-1',
    hotspots: [
      {
        id: 'tension',
        xPercent: 80,
        yPercent: 34,
        label: 'Two-Wrap Finger Tension',
        detail: 'Wrapping thread around her forefinger keeps tension silky-even across hundreds of petal rows.',
      },
      {
        id: 'granny',
        xPercent: 45,
        yPercent: 68,
        label: 'Colour Sense',
        detail: 'Bold marigold, ruby, moss, and rose shades balanced naturally without printed moodboards.',
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
      'Nobody imagines a grandmother’s afternoon hobby belongs inside modern apartments — until a young team brought fresh yellow cotton yarn to my door.',
      'Buying Diwali gifts for my grandkids with money I earned right next to my tea tray feels lighter and prouder than anything else.',
    ],
    signOff: '— One of 200+ Nanis in Surat',
  },
  {
    id: 'family',
    tab: 'From Her Daughter',
    salutation: '“Watching Maa take pride in her work changed our home.”',
    paragraphs: [
      'For thirty years she repaired sweaters and knitted booties for the building without ever counting the hours.',
      'Now when a customer orders a bouquet, she sets her spectacles carefully and asks which city her flowers are travelling to today.',
    ],
    signOff: '— Family of a Knots & Co. Artisan',
  },
  {
    id: 'knots',
    tab: 'From Knots & Co.',
    salutation: '“No factory assembly line — just doorstep deliveries.”',
    paragraphs: [
      'Started in 2019 at age sixteen, Knots & Co. delivers soft cotton wool, stuffing, and brass hooks directly to women working from home.',
      'Every piece passes inspection for clean finishes while preserving genuine handmade character.',
    ],
    signOff: '— Team Knots & Co., Surat',
  },
];

const PRACTICAL_FAQS: PracticalFaqItem[] = [
  {
    id: 'dispatch',
    question: 'How fast do Nani’s handmade orders dispatch & arrive?',
    answer:
      'In-stock bouquets, pots, and charms dispatch within 24–48 hours from Surat and arrive in 4–6 business days across India. Orders above ₹1,999 ship free.',
  },
  {
    id: 'reshape',
    question: 'Can stems and petals be adjusted after delivery?',
    answer:
      'Yes! Bouquets use soft insulated floral wire inside crochet stems. When you unbox, gently bend stems and curve petals with your fingers to match any vase or angle.',
  },
  {
    id: 'care',
    question: 'How do I clean crochet flowers or plushies?',
    answer:
      'All blooms and plushies use combed milk-cotton yarn. Dust gently with a soft brush or spot-clean using cold water + mild soap, then air-dry flat away from direct heat.',
  },
  {
    id: 'custom',
    question: 'Can I request a gift note or bulk event colours?',
    answer:
      'You can add a free gift message note at checkout. For weddings, birthdays, or bulk corporate gifting (20+ units) with custom ribbon shades, use B2B Gifting.',
  },
];

export const BehindTheStitchesPage: React.FC<BehindTheStitchesPageProps> = ({
  onNavigateHome,
  onNavigateShop,
  onNavigateProduct,
}) => {
  const { products } = useProducts();
  const { addToShopifyCart, incrementCount, openCart } = useCart();
  const prefersReduced = useReducedMotion();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const albumTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const sectionRefs = {
    craft: useRef<HTMLElement>(null),
    album: useRef<HTMLElement>(null),
    faq: useRef<HTMLElement>(null),
  };

  // Drag/swipe state for tactile album & intentional slider drag
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);
  const sliderBoxRef = useRef<HTMLDivElement>(null);
  const isDraggingSlider = useRef(false);

  // Interactive UI State
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [sliderPercent, setSliderPercent] = useState(50);
  const [activeFrameIndex, setActiveFrameIndex] = useState(1);
  const [activeHotspotId, setActiveHotspotId] = useState<string>(ALBUM_FRAMES[1].hotspots[0].id);
  const [activeVoiceIndex, setActiveVoiceIndex] = useState(0);
  const [openFaqId, setOpenFaqId] = useState<string | null>('dispatch');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [lightboxFrame, setLightboxFrame] = useState<AlbumFrame | null>(null);

  const currentPair = TRANSFORMATION_PAIRS[selectedPairIndex];
  const liveSliderProduct = useMemo(
    () =>
      products.find(
        (p) =>
          p.handle === currentPair.shopifyHandle ||
          p.name.toLowerCase() === currentPair.label.toLowerCase()
      ),
    [products, currentPair]
  );
  const resolvedSliderAfterImage = optimizeShopifyUrl(
    liveSliderProduct?.image || currentPair.afterImage,
    900
  );

  const currentFrame = ALBUM_FRAMES[activeFrameIndex];
  const currentHotspot =
    currentFrame.hotspots.find((h) => h.id === activeHotspotId) || currentFrame.hotspots[0];
  const currentVoice = PERSPECTIVE_VOICES[activeVoiceIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    setActiveHotspotId(ALBUM_FRAMES[activeFrameIndex].hotspots[0].id);
  }, [activeFrameIndex]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (lightboxFrame && !dialog.open) dialog.showModal();
    else if (!lightboxFrame && dialog.open) dialog.close();
  }, [lightboxFrame]);

  // Quick Add handler connected directly to Shopify Cart
  const handleQuickAdd = useCallback(
    async (item: { id: string; variantId?: string }, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setAddedIds((prev) => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [item.id]: false }));
      }, 1500);

      if (item.variantId) {
        await addToShopifyCart(item.variantId, 1);
      } else {
        incrementCount(1);
      }
      openCart();
    },
    [addToShopifyCart, incrementCount, openCart]
  );

  // Scoped horizontal comparison slider drag handler (does NOT hijack vertical touch scrolling)
  const updateSliderFromClientX = useCallback((clientX: number) => {
    const box = sliderBoxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const pct = Math.round(((clientX - rect.left) / rect.width) * 100);
    setSliderPercent(Math.max(6, Math.min(94, pct)));
  }, []);

  const handleSliderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return; // Touch users use the dedicated thumb scrubber or explicit drag handle
    isDraggingSlider.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSliderFromClientX(e.clientX);
  };

  const handleSliderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSlider.current) return;
    updateSliderFromClientX(e.clientX);
  };

  const handleSliderPointerUp = () => {
    isDraggingSlider.current = false;
  };

  const handleSliderHandleTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    updateSliderFromClientX(e.touches[0].clientX);
  };

  // Album keyboard & touch swipe
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

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      if (dx < 0) setActiveFrameIndex((i) => (i + 1) % ALBUM_FRAMES.length);
      else setActiveFrameIndex((i) => (i - 1 + ALBUM_FRAMES.length) % ALBUM_FRAMES.length);
    }
  };

  const scrollToSection = (key: keyof typeof sectionRefs) => {
    sectionRefs[key].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

  return (
    <div className="relative w-full min-h-screen bg-[#FBF8CF] text-[#2D2424] font-['Fredoka'] overflow-x-hidden">
      {/* =====================================================================
          1. NON-OVERLAPPING QUICK-JUMP NAVIGATION BAR
          (Top spacing clears Header's -mb-4 floating nav cleanly)
          ===================================================================== */}
      <div className="relative z-10 w-full bg-[#FFFDF8]/85 border-b border-[#641623]/10 pt-5 sm:pt-6 pb-2.5 px-3 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex-shrink-0 inline-flex items-center gap-1.5 min-h-[38px] px-2.5 -ml-1 rounded-full text-xs sm:text-sm font-bold text-[#641623] hover:bg-[#FFF5CC] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Home</span>
          </button>

          {/* Horizontal scrollable section jump strip (mobile-friendly quick access) */}
          <nav
            aria-label="Nani page sections"
            className="flex flex-nowrap items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar"
          >
            {[
              { key: 'craft' as const, label: 'Yarn to Bouquet' },
              { key: 'album' as const, label: 'Photo Story' },
              { key: 'faq' as const, label: 'Delivery & Care' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => scrollToSection(item.key)}
                className="flex-none min-h-[34px] px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-[#641623] bg-[#FBF8CF]/75 hover:bg-[#641623] hover:text-[#FBF8CF] border border-[#641623]/15 transition-colors cursor-pointer whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* =====================================================================
          2. ACT 1 — COMPACT RESPONSIVE EDITORIAL OPENING
          ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 pt-7 sm:pt-12 lg:pt-16 pb-10 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-center">
          {/* Editorial Intro */}
          <div className="lg:col-span-6 text-left space-y-4">
            <p className="font-script text-lg sm:text-2xl text-[#811B2B] -rotate-1 inline-block">
              handmade by 200+ nanis in Surat
            </p>

            <h1
              className="font-black text-[#641623] tracking-tight leading-[1.06]"
              style={{ fontSize: 'clamp(2.25rem, 1.35rem + 4vw, 4.35rem)' }}
            >
              <span>Stitched in </span>
              <span className="font-script font-normal text-[1.18em] text-[#811B2B] inline-block -rotate-2 px-1">
                Nani&apos;s
              </span>
              <span> living room.</span>
            </h1>

            <p className="text-sm sm:text-lg text-[#2D2424]/85 leading-relaxed max-w-xl">
              Instead of factory floors, we deliver soft cotton wool straight to grandmothers and home artisans across Surat — handcrafted from home and dispatched in 24–48 hours.
            </p>

            {/* Practical Trust Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] sm:text-xs font-bold text-[#641623]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#641623]/15">
                <Clock className="w-3.5 h-3.5 text-[#811B2B]" aria-hidden="true" />
                <span>24–48 hr Dispatch</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#641623]/15">
                <Sparkles className="w-3.5 h-3.5 text-[#811B2B]" aria-hidden="true" />
                <span>100% Cotton Yarn</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#641623]/15">
                <ShieldCheck className="w-3.5 h-3.5 text-[#811B2B]" aria-hidden="true" />
                <span>Never Wilts</span>
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => onNavigateShop('all')}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 sm:px-6 py-2.5 rounded-full bg-[#811B2B] text-white font-bold text-sm sm:text-base shadow-sm hover:bg-[#641623] active:scale-97 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>Shop Nani&apos;s Crafts</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('craft')}
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full border-2 border-[#641623]/30 text-[#641623] font-bold text-sm sm:text-base hover:border-[#641623] hover:bg-[#FFF5CC] transition-all cursor-pointer"
              >
                <span>See how it&apos;s made</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right Framed Macro Print */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <motion.figure
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-[340px] sm:max-w-[420px] bg-[#FFFDF8] p-3 sm:p-4 pb-5 sm:pb-7 rounded-[6px] border border-[#641623]/12 shadow-[0_18px_45px_rgba(100,22,35,0.12)] -rotate-1"
            >
              <span
                aria-hidden="true"
                className="hidden sm:block absolute -top-2.5 left-6 w-16 h-5 bg-[#F3DF99]/85 border border-[#D4B86A]/40 -rotate-12 pointer-events-none"
              />
              <span
                aria-hidden="true"
                className="hidden sm:block absolute -top-2 right-6 w-14 h-5 bg-[#F3DF99]/85 border border-[#D4B86A]/40 rotate-12 pointer-events-none"
              />
              <div className="overflow-hidden bg-[#EFE6DC] aspect-[4/3.8] sm:aspect-[4/4.2]">
                <picture>
                  <source srcSet="/stories/artisan-2-hands-magic.webp" type="image/webp" />
                  <img
                    src="/stories/artisan-2-hands-magic.png"
                    alt="Macro portrait of Nani hands wearing an emerald ring guiding lilac yarn"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </picture>
              </div>
              <figcaption className="mt-3 sm:mt-4 px-1 flex items-baseline justify-between gap-2">
                <span className="font-script text-lg sm:text-2xl text-[#641623]">
                  One emerald ring, forty years of craft.
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#811B2B]/60 flex-shrink-0">
                  Surat
                </span>
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. ACT 2 — LIVE SHOPIFY BOUQUET TRANSFORMATION SLIDER (No Touch Scroll Hijack!)
          ===================================================================== */}
      <section ref={sectionRefs.craft} className="max-w-5xl mx-auto px-3.5 sm:px-8 lg:px-10 py-10 sm:py-16 border-t border-[#641623]/10 scroll-mt-14">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#811B2B]">
            Real Yarn vs. Finished Shopify Bouquet
          </p>
          <h2 className="font-black text-2xl sm:text-4xl text-[#641623] tracking-tight leading-tight">
            <span>From loose cotton thread to </span>
            <span className="font-script font-normal text-[1.2em] text-[#811B2B] inline-block -rotate-1">
              your room
            </span>
          </h2>
        </div>

        {/* Pair Selector Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {TRANSFORMATION_PAIRS.map((pair, idx) => {
            const active = idx === selectedPairIndex;
            return (
              <button
                key={pair.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedPairIndex(idx)}
                className={`flex-none min-h-[40px] px-3.5 sm:px-4.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-colors cursor-pointer whitespace-nowrap ${
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

        {/* Interactive Box */}
        <div className="max-w-3xl mx-auto bg-[#FFFDF8] p-3 sm:p-5 rounded-[24px] sm:rounded-[34px] border border-[#641623]/12 shadow-[0_18px_48px_rgba(100,22,35,0.09)]">
          {/* Split Comparison Image — touch-pan-y preserves vertical scrolling on mobile! */}
          <div
            ref={sliderBoxRef}
            onPointerDown={handleSliderPointerDown}
            onPointerMove={handleSliderPointerMove}
            onPointerUp={handleSliderPointerUp}
            onPointerCancel={handleSliderPointerUp}
            className="relative w-full aspect-[4/3.7] sm:aspect-[16/11] max-h-[58dvh] rounded-[18px] sm:rounded-[24px] overflow-hidden bg-[#EFE6DC] select-none touch-pan-y sm:cursor-ew-resize"
          >
            {/* Underlayer: Actual Shopify Bouquet Image */}
            <img
              src={resolvedSliderAfterImage}
              alt={liveSliderProduct?.name || currentPair.afterAlt}
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              loading="lazy"
            />

            {/* Overlayer: Nani Crafting Yarn */}
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

            {/* Side Badges */}
            <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 px-2.5 sm:px-3 py-1 rounded-full bg-[#2D2424]/80 text-[#FBF8CF] text-[10px] sm:text-xs font-bold pointer-events-none">
              In Nani&apos;s Hands
            </div>
            <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 px-2.5 sm:px-3 py-1 rounded-full bg-[#FFFDF8]/92 text-[#641623] text-[10px] sm:text-xs font-bold pointer-events-none shadow-2xs">
              In Your Room
            </div>

            {/* Seam Divider + Mobile Touch Grab Knob */}
            <div
              className="absolute top-0 bottom-0 w-[2.5px] bg-[#FFFDF8] shadow-[0_0_10px_rgba(45,36,36,0.35)] pointer-events-none"
              style={{ left: `${sliderPercent}%`, transform: 'translateX(-50%)' }}
            >
              <button
                type="button"
                aria-label="Drag comparison handle"
                onTouchMove={handleSliderHandleTouchMove}
                className="pointer-events-auto touch-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFDF8] border-2 border-[#641623] shadow-lg flex items-center justify-center text-[#641623] cursor-ew-resize active:scale-105"
              >
                <ChevronLeft className="w-4 h-4 -mr-1" aria-hidden="true" />
                <ChevronRight className="w-4 h-4 -ml-1" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Native Dedicated Range Scrubber (Clean, Accessible, Zero Scroll Hijack) */}
          <div className="mt-3 px-1">
            <label htmlFor="nani-craft-scrubber" className="sr-only">
              Slide between Nani crafting yarn and finished {currentPair.label} bouquet
            </label>
            <input
              id="nani-craft-scrubber"
              type="range"
              min={6}
              max={94}
              step={1}
              value={sliderPercent}
              aria-valuetext={`${sliderPercent}% — ${currentStageLabel}`}
              onChange={(e) => setSliderPercent(Number(e.target.value))}
              style={{ '--slider-progress': `${((sliderPercent - 6) / 88) * 100}%` } as React.CSSProperties}
              className="knots-range-slider"
            />
          </div>

          {/* Stage Story + Direct Order Action */}
          <div className="mt-1 px-1 sm:px-2 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <span className="text-[#811B2B]">{currentStageLabel}</span>
              <span className="text-[#641623]/70">
                {currentPair.hoursSpent} · {currentPair.stitchEstimate}
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#2D2424]/85 leading-relaxed">
              {currentStageCopy}
            </p>

            {/* Quick Stage Buttons + Live Buy Now / View Bouquet */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-[#641623]/10">
              <div className="grid grid-cols-3 gap-1.5 sm:flex sm:gap-2">
                {[
                  { label: '01 · Yarn', val: 16, active: sliderPercent < 34 },
                  { label: '02 · Loops', val: 50, active: sliderPercent >= 34 && sliderPercent < 70 },
                  { label: '03 · Finished', val: 88, active: sliderPercent >= 70 },
                ].map((st) => (
                  <button
                    key={st.label}
                    type="button"
                    aria-pressed={st.active}
                    onClick={() => setSliderPercent(st.val)}
                    className={`min-h-[38px] px-3 rounded-xl border text-[11px] sm:text-xs font-bold cursor-pointer transition-colors ${
                      st.active
                        ? 'bg-[#FFF5CC] border-[#641623]/45 text-[#641623]'
                        : 'bg-[#FBF8CF]/60 hover:bg-[#FFF5CC] border-[#641623]/15 text-[#641623]/75'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {liveSliderProduct && (
                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onNavigateProduct?.(liveSliderProduct.handle || liveSliderProduct.id)
                    }
                    className="text-xs font-bold text-[#811B2B] underline underline-offset-4 cursor-pointer px-2 py-1"
                  >
                    View details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(liveSliderProduct)}
                    className="inline-flex items-center gap-1.5 min-h-[38px] px-4 rounded-full bg-[#641623] text-[#FBF8CF] text-xs font-bold hover:bg-[#811B2B] active:scale-95 transition-all cursor-pointer"
                  >
                    {addedIds[liveSliderProduct.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Add Bouquet · ₹{liveSliderProduct.price.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. ACT 3 — FOUR MOMENTS ALBUM & INTERACTIVE PINS
          ===================================================================== */}
      <section ref={sectionRefs.album} className="w-full bg-[#D9EEF5]/55 border-y border-[#7BBFD4]/35 py-12 sm:py-20 scroll-mt-14">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-10">
            <div className="space-y-1">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#811B2B]">
                Swipe Photos · Tap Circles to Inspect
              </p>
              <h2 className="font-black text-2xl sm:text-4xl text-[#641623] tracking-tight">
                <span>Four quiet moments from </span>
                <span className="font-script font-normal text-[1.2em] text-[#811B2B]">
                  her day
                </span>
              </h2>
            </div>

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
                    className={`flex-none min-h-[40px] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-colors cursor-pointer whitespace-nowrap ${
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
            className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-center"
          >
            {/* Left Print Stack */}
            <div
              onTouchStart={handleDeckTouchStart}
              onTouchEnd={handleDeckTouchEnd}
              className="lg:col-span-6 relative max-w-[440px] w-full mx-auto touch-pan-y pt-1 pb-3"
            >
              <button
                type="button"
                aria-label="Next photograph in stack"
                onClick={() => setActiveFrameIndex((i) => (i + 1) % ALBUM_FRAMES.length)}
                className="hidden sm:block absolute inset-x-4 top-4 bottom-1 bg-[#FFFDF8] rounded-[6px] border border-[#641623]/12 shadow-md rotate-[3deg] cursor-pointer hover:rotate-[4.5deg] transition-transform"
              />
              <div
                aria-hidden="true"
                className="hidden sm:block absolute inset-x-6 top-5 bottom-0 bg-[#FFF5CC] rounded-[6px] border border-[#641623]/10 shadow-sm -rotate-[2deg]"
              />

              <div
                className={`relative z-10 bg-[#FFFDF8] p-2.5 sm:p-4 pb-4 rounded-[6px] border border-[#641623]/15 shadow-[0_18px_42px_rgba(100,22,35,0.13)] ${currentFrame.tiltClass}`}
              >
                <div className="relative overflow-hidden aspect-[4/4.1] bg-[#EFE6DC]">
                  <picture>
                    <source srcSet={currentFrame.imageWebp} type="image/webp" />
                    <img
                      src={currentFrame.imagePng}
                      alt={currentFrame.alt}
                      className="w-full h-full object-cover select-none"
                    />
                  </picture>

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
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center cursor-pointer group rounded-full"
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-150 border-2 shadow-md ${
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

                  <button
                    type="button"
                    onClick={() => setLightboxFrame(currentFrame)}
                    aria-label={`Expand photograph: ${currentFrame.title}`}
                    className="absolute bottom-2.5 right-2.5 min-h-[36px] px-3 py-1 rounded-full bg-[#2D2424]/75 backdrop-blur-xs text-[#FFFDF8] text-xs font-bold inline-flex items-center gap-1.5 hover:bg-[#641623] transition-colors cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Zoom</span>
                  </button>
                </div>

                <div className="mt-3 px-1 flex items-baseline justify-between gap-2">
                  <span className="font-script text-lg sm:text-xl text-[#641623]">
                    {currentFrame.timeStamp}
                  </span>
                  <span className="text-[11px] font-bold tracking-widest text-[#811B2B]/65">
                    {currentFrame.frameNo}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Story Column */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <div>
                <h3 className="font-black text-2xl sm:text-3xl text-[#641623] tracking-tight leading-snug">
                  {currentFrame.title}
                </h3>
                <p className="mt-1 font-semibold text-sm sm:text-base text-[#811B2B]">
                  {currentFrame.subtitle}
                </p>
              </div>

              <div className="space-y-2.5 text-sm sm:text-base text-[#2D2424]/85 leading-relaxed">
                {currentFrame.story.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="rounded-2xl bg-[#FFFDF8] border border-[#641623]/15 p-3.5 sm:p-4 shadow-2xs space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#811B2B]">
                    Craft Note
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
                            : 'bg-[#FFF5CC] text-[#641623]'
                        }`}
                      >
                        Detail {sIdx + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="font-bold text-sm text-[#641623]">{currentHotspot.label}</p>
                <p className="text-xs sm:text-sm text-[#2D2424]/80 leading-relaxed">
                  {currentHotspot.detail}
                </p>
              </div>

              <div className="pt-1 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveFrameIndex((i) => (i - 1 + ALBUM_FRAMES.length) % ALBUM_FRAMES.length)
                  }
                  className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-full bg-[#FFFDF8] border border-[#641623]/25 text-xs sm:text-sm font-bold text-[#641623] hover:bg-[#FFF5CC] cursor-pointer"
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
                  className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 min-h-[42px] px-5 py-2 rounded-full bg-[#641623] text-[#FBF8CF] text-xs sm:text-sm font-bold hover:bg-[#811B2B] cursor-pointer"
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
          5. ACT 4 — PRACTICAL CARE FAQ + THREE-VOICE LETTER SIDE-BY-SIDE ON DESKTOP
          ===================================================================== */}
      <section ref={sectionRefs.faq} className="max-w-6xl mx-auto px-3.5 sm:px-8 lg:px-12 py-12 sm:py-20 scroll-mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left: Real Practical Ordering & Care Answers */}
          <div className="lg:col-span-6 bg-[#FFFDF8] rounded-[24px] border border-[#641623]/15 p-5 sm:p-7 shadow-xs">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#811B2B]">
              Practical Guide
            </p>
            <h2 className="mt-1 font-black text-2xl sm:text-3xl text-[#641623] mb-4">
              Before you gift handmade
            </h2>

            <div className="divide-y divide-[#641623]/10">
              {PRACTICAL_FAQS.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="py-3">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full text-left flex items-center justify-between gap-3 py-1 font-bold text-sm sm:text-base text-[#641623] cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`w-4 h-4 text-[#811B2B] flex-shrink-0 transition-transform duration-150 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs sm:text-sm text-[#2D2424]/80 leading-relaxed pr-4">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Compact Three-Voice Letter */}
          <div className="lg:col-span-6 bg-[#FFFDF8] rounded-[24px] border border-[#641623]/15 p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#641623]/10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#811B2B]">
                  In Three Voices · Surat
                </p>
                <h2 className="mt-1 font-black text-2xl sm:text-3xl text-[#641623]">
                  Why we chose homes over factories
                </h2>
              </div>
              <img
                src="/knotsnco_mascot_transparent.gif"
                alt="Knots & Co mascot"
                className="w-12 h-12 object-contain flex-shrink-0"
                loading="lazy"
              />
            </div>

            <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-1.5 py-4 border-b border-[#641623]/8">
              {PERSPECTIVE_VOICES.map((voice, idx) => {
                const selected = idx === activeVoiceIndex;
                return (
                  <button
                    key={voice.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveVoiceIndex(idx)}
                    className={`flex-none min-h-[36px] px-3.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                      selected
                        ? 'bg-[#FFF5CC] text-[#641623] border-[#641623]'
                        : 'bg-transparent text-[#641623]/70 border-[#641623]/15 hover:text-[#641623]'
                    }`}
                  >
                    {voice.tab}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 space-y-3 text-left">
              <p className="font-script text-xl sm:text-2xl text-[#811B2B] leading-snug">
                {currentVoice.salutation}
              </p>
              <div className="space-y-2.5 text-xs sm:text-sm text-[#2D2424]/85 leading-relaxed">
                {currentVoice.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <p className="pt-1 text-xs font-bold text-[#641623]/75">{currentVoice.signOff}</p>
            </div>
          </div>
        </div>

        {/* Clean Bottom CTA */}
        <div className="mt-10 sm:mt-14 text-center">
          <button
            type="button"
            onClick={() => onNavigateShop('all')}
            className="inline-flex items-center justify-center gap-2 min-h-[46px] px-8 py-3 rounded-full bg-[#811B2B] text-white font-bold text-sm sm:text-base shadow-md hover:bg-[#641623] active:scale-97 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Explore Full Handmade Store</span>
          </button>
        </div>
      </section>

      {/* =====================================================================
          7. NATIVE <dialog> PHOTO LIGHTBOX
          ===================================================================== */}
      <dialog
        ref={dialogRef}
        aria-labelledby="nani-photo-modal-title"
        onClose={() => setLightboxFrame(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setLightboxFrame(null);
        }}
        className="m-auto w-[92vw] max-w-3xl rounded-[22px] bg-[#FFFDF8] p-0 border border-[#641623]/20 shadow-2xl backdrop:bg-[#2D2424]/75 backdrop:backdrop-blur-xs"
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
            <div className="overflow-hidden rounded-[14px] bg-[#EFE6DC]">
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
