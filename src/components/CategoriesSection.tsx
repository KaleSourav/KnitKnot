import React, { useState, useRef, useEffect } from 'react';

interface CategoryItem {
  id: string;
  buttonLabel: string;
  badgeLine1: string;
  badgeLine2: string;
  image: string;
  hoverImage: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'flowers',
    buttonLabel: 'FLOWERS',
    badgeLine1: 'BEST',
    badgeLine2: 'SELLER',
    image: '/categories/flowers-real.jpg',
    hoverImage: '/categories/flowers-hover.jpg',
    icon: (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0 transition-transform duration-300 group-hover:rotate-12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3.2" fill="currentColor" />
        <path d="M12 3a2.5 2.5 0 0 0-2.5 2.5c0 1.5 2.5 3.5 2.5 3.5s2.5-2 2.5-3.5A2.5 2.5 0 0 0 12 3z" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 21a2.5 2.5 0 0 0 2.5-2.5c0-1.5-2.5-3.5-2.5-3.5s-2.5 2-2.5 3.5A2.5 2.5 0 0 0 12 21z" fill="currentColor" fillOpacity="0.2" />
        <path d="M3 12a2.5 2.5 0 0 0 2.5 2.5c1.5 0 3.5-2.5 3.5-2.5s-2-2.5-3.5-2.5A2.5 2.5 0 0 0 3 12z" fill="currentColor" fillOpacity="0.2" />
        <path d="M21 12a2.5 2.5 0 0 0-2.5-2.5c-1.5 0-3.5 2.5-3.5 2.5s2 2.5 3.5 2.5A2.5 2.5 0 0 0 21 12z" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
  },
  {
    id: 'flower-pots',
    buttonLabel: 'FLOWER POTS',
    badgeLine1: 'HAND',
    badgeLine2: 'MADE',
    image: '/categories/flower-pots-real.jpg',
    hoverImage: '/categories/flower-pots-hover.jpg',
    icon: (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 6 11 L 18 11 L 16.5 21 L 7.5 21 Z" fill="currentColor" fillOpacity="0.2" />
        <line x1="5" y1="11" x2="19" y2="11" strokeWidth="2.8" />
        <path d="M 12 11 C 12 7, 7 6, 7 3 C 11 3, 12 6, 12 11" fill="currentColor" fillOpacity="0.25" />
        <path d="M 12 11 C 12 7, 17 6, 17 3 C 13 3, 12 6, 12 11" fill="currentColor" fillOpacity="0.25" />
      </svg>
    ),
  },
  {
    id: 'plushies',
    buttonLabel: 'PLUSHIES',
    badgeLine1: 'SO',
    badgeLine2: 'CUTE',
    image: '/categories/plushies-real.jpg',
    hoverImage: '/categories/plushies-hover.jpg',
    icon: (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0 transition-transform duration-300 group-hover:scale-115"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="6.5" cy="7.5" r="3" fill="currentColor" fillOpacity="0.25" />
        <circle cx="17.5" cy="7.5" r="3" fill="currentColor" fillOpacity="0.25" />
        <circle cx="12" cy="14" r="7.5" fill="currentColor" fillOpacity="0.15" />
        <circle cx="9.5" cy="13" r="1" fill="currentColor" />
        <circle cx="14.5" cy="13" r="1" fill="currentColor" />
        <path d="M 10.8 15.5 Q 12 16.8 13.2 15.5" />
      </svg>
    ),
  },
  {
    id: 'bags',
    buttonLabel: 'BAGS & TOTES',
    badgeLine1: 'TOP',
    badgeLine2: 'TREND',
    image: '/categories/bags-real.jpg',
    hoverImage: '/categories/bags-hover.jpg',
    icon: (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0 transition-transform duration-300 group-hover:rotate-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="9" width="16" height="12" rx="3" fill="currentColor" fillOpacity="0.2" />
        <path d="M 8 9 V 5 A 4 4 0 0 1 16 5 V 9" strokeWidth="2.4" />
        <path d="M 12 13 V 17 M 10 15 H 14" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'keychains',
    buttonLabel: 'KEYCHAINS',
    badgeLine1: 'HOT',
    badgeLine2: 'PICK',
    image: '/categories/keychains-real.jpg',
    hoverImage: '/categories/keychains-hover.jpg',
    icon: (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0 transition-transform duration-300 group-hover:rotate-12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="8" r="4.5" fill="currentColor" fillOpacity="0.2" />
        <path d="M 12.5 11.5 L 16 15" strokeWidth="2.4" />
        <circle cx="18" cy="17" r="3.5" fill="currentColor" fillOpacity="0.25" />
        <path d="M 18 15.5 V 18.5 M 16.5 17 H 19.5" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    id: 'home-decor',
    buttonLabel: 'HOME DECOR',
    badgeLine1: 'COZY',
    badgeLine2: 'VIBES',
    image: '/categories/home-decor-real.jpg',
    hoverImage: '/categories/home-decor-hover.jpg',
    icon: (
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0 transition-transform duration-300 group-hover:scale-115"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 3 13 C 3 6, 21 6, 21 13 Z" fill="currentColor" fillOpacity="0.25" />
        <path d="M 7 13 L 7 19 A 2 2 0 0 0 9 21 L 15 21 A 2 2 0 0 0 17 19 L 17 13" fill="currentColor" fillOpacity="0.15" />
        <path d="M 10 21 V 16.5 A 2 2 0 0 1 14 16.5 V 21" strokeWidth="2" />
        <circle cx="8" cy="9.5" r="1" fill="currentColor" />
        <circle cx="15.5" cy="9.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

interface GuideStageInfo {
  id: string;
  categoryTarget?: string;
  stepLabel: string;
  speech: string;
  subtext: string;
  accessoryIcon: React.ReactNode;
}

// Crisp handmade SVGs for mascot accessory badges and card micro-animations (strictly NO emojis)
const SVG_ICONS = {
  flower: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#811B2B]" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" fill="#F5D76E" />
      <path d="M12 3a2.2 2.2 0 0 0-2.2 2.2c0 1.2 2.2 2.8 2.2 2.8s2.2-1.6 2.2-2.8A2.2 2.2 0 0 0 12 3z" fill="#FDA4AF" />
      <path d="M12 21a2.2 2.2 0 0 0 2.2-2.2c0-1.2-2.2-2.8-2.2-2.8s-2.2 1.6-2.2 2.8A2.2 2.2 0 0 0 12 21z" fill="#FDA4AF" />
      <path d="M3 12a2.2 2.2 0 0 0 2.2 2.2c1.2 0 2.8-2.2 2.8-2.2s-1.6-2.2-2.8-2.2A2.2 2.2 0 0 0 3 12z" fill="#FDA4AF" />
      <path d="M21 12a2.2 2.2 0 0 0-2.2-2.2c-1.2 0-2.8 2.2-2.8 2.2s1.6 2.2 2.8 2.2A2.2 2.2 0 0 0 21 12z" fill="#FDA4AF" />
    </svg>
  ),
  flowerPot: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#811B2B]" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 10h12l-1.5 10h-9z" fill="#D9EEF5" />
      <path d="M12 10V5m-3 2c0-2 3-3 3-3s3 1 3 3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  bag: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#811B2B]" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="9" width="14" height="11" rx="2.5" fill="#FFF5CC" />
      <path d="M8 9V6a4 4 0 0 1 8 0v3" strokeWidth="2" />
      <circle cx="12" cy="14" r="1.5" fill="#811B2B" />
    </svg>
  ),
  keychain: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#811B2B]" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="10" cy="8" r="4" fill="#F8D9D8" />
      <path d="M13 11l6 6m-2 0l2 2" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="8" r="1.5" fill="#811B2B" />
    </svg>
  ),
  plushie: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#811B2B]" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="8" cy="7" r="2.5" fill="#FFF5CC" />
      <circle cx="16" cy="7" r="2.5" fill="#FFF5CC" />
      <circle cx="12" cy="13" r="6" fill="#FFF5CC" />
      <circle cx="10" cy="12" r="0.8" fill="#811B2B" />
      <circle cx="14" cy="12" r="0.8" fill="#811B2B" />
      <path d="M11 14.5q1 1 2 0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  homeDecor: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#811B2B]" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12l9-8 9 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#FFF5CC" />
      <rect x="9" y="14" width="6" height="8" fill="#F5D76E" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#F59E0B]" fill="currentColor">
      <path d="M12 0l3 8.5 8.5 2.5-8.5 3.5-3 8.5-3-8.5-8.5-3.5 8.5-2.5z" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#811B2B]" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
};

const GUIDE_STAGES: Record<string, GuideStageInfo> = {
  welcome: {
    id: 'welcome',
    stepLabel: 'Welcome',
    speech: "Hey! Let's find your little favourite.",
    subtext: 'Scroll or tap any collection below to let your mascot guide you.',
    accessoryIcon: SVG_ICONS.star,
  },
  flowers: {
    id: 'flowers',
    categoryTarget: 'flowers',
    stepLabel: 'Flowers',
    speech: 'Flowers that keep your sweetest moments blooming.',
    subtext: 'Handcrafted blooms that never wilt or fade away.',
    accessoryIcon: SVG_ICONS.flower,
  },
  'flower-pots': {
    id: 'flower-pots',
    categoryTarget: 'flower-pots',
    stepLabel: 'Flower Pots',
    speech: 'A little handmade happiness for every corner.',
    subtext: 'Charming mini planters stitched with love for desk or shelf.',
    accessoryIcon: SVG_ICONS.flowerPot,
  },
  bags: {
    id: 'bags',
    categoryTarget: 'bags',
    stepLabel: 'Bags & Totes',
    speech: 'Carry a little creativity wherever you go.',
    subtext: 'Hand-woven crochet shoulder bags and chunky totes.',
    accessoryIcon: SVG_ICONS.bag,
  },
  keychains: {
    id: 'keychains',
    categoryTarget: 'keychains',
    stepLabel: 'Keychains',
    speech: 'Small charms, big personality.',
    subtext: 'Cute backpack pendants and tactile yarn accessories.',
    accessoryIcon: SVG_ICONS.keychain,
  },
  plushies: {
    id: 'plushies',
    categoryTarget: 'plushies',
    stepLabel: 'Plushies',
    speech: 'Tiny yarn-made friends, ready for big hugs.',
    subtext: 'Soft amigurumi creatures hand-knitted by dadis.',
    accessoryIcon: SVG_ICONS.plushie,
  },
  'home-decor': {
    id: 'home-decor',
    categoryTarget: 'home-decor',
    stepLabel: 'Home Decor',
    speech: 'Cozy textures to make any space feel like home.',
    subtext: 'Handmade details that make your style uniquely yours.',
    accessoryIcon: SVG_ICONS.homeDecor,
  },
  final: {
    id: 'final',
    stepLabel: 'Find Yours',
    speech: "There's something special waiting for you!",
    subtext: 'Find your favourite little handmade thing.',
    accessoryIcon: SVG_ICONS.heart,
  },
};

interface CategoriesSectionProps {
  onCategorySelect?: (categoryId: string) => void;
  onShopAllClick?: () => void;
}

// Scalloped Cloud Boundary Paths (1440w)
const TOP_CLOUD_FILL =
  'M 0 60 L 0 35 C 32.5 7.0, 97.5 7.0, 130.0 35.0 C 157.5 12.0, 212.5 12.0, 240.0 35.0 C 277.5 7.0, 352.5 7.0, 390.0 35.0 C 420.0 12.0, 480.0 12.0, 510.0 35.0 C 545.0 7.0, 615.0 7.0, 650.0 35.0 C 682.5 12.0, 747.5 12.0, 780.0 35.0 C 810.0 7.0, 870.0 7.0, 900.0 35.0 C 937.5 12.0, 1012.5 12.0, 1050.0 35.0 C 1077.5 7.0, 1132.5 7.0, 1160.0 35.0 C 1195.0 12.0, 1265.0 12.0, 1300.0 35.0 C 1335.0 7.0, 1405.0 7.0, 1440.0 35.0 L 1440 60 Z';
const TOP_CLOUD_STROKE =
  'M 0 35 C 32.5 7.0, 97.5 7.0, 130.0 35.0 C 157.5 12.0, 212.5 12.0, 240.0 35.0 C 277.5 7.0, 352.5 7.0, 390.0 35.0 C 420.0 12.0, 480.0 12.0, 510.0 35.0 C 545.0 7.0, 615.0 7.0, 650.0 35.0 C 682.5 12.0, 747.5 12.0, 780.0 35.0 C 810.0 7.0, 870.0 7.0, 900.0 35.0 C 937.5 12.0, 1012.5 12.0, 1050.0 35.0 C 1077.5 7.0, 1132.5 7.0, 1160.0 35.0 C 1195.0 12.0, 1265.0 12.0, 1300.0 35.0 C 1335.0 7.0, 1405.0 7.0, 1440.0 35.0';

const BOT_CLOUD_FILL =
  'M 0 0 L 0 25 C 32.5 53.0, 97.5 53.0, 130.0 25.0 C 157.5 48.0, 212.5 48.0, 240.0 25.0 C 277.5 53.0, 352.5 53.0, 390.0 25.0 C 420.0 48.0, 480.0 48.0, 510.0 25.0 C 545.0 53.0, 615.0 53.0, 650.0 25.0 C 682.5 48.0, 747.5 48.0, 780.0 25.0 C 810.0 53.0, 870.0 53.0, 900.0 25.0 C 937.5 48.0, 1012.5 48.0, 1050.0 25.0 C 1077.5 53.0, 1132.5 53.0, 1160.0 25.0 C 1195.0 48.0, 1265.0 48.0, 1300.0 25.0 C 1335.0 53.0, 1405.0 53.0, 1440.0 25.0 L 1440 0 Z';
const BOT_CLOUD_STROKE =
  'M 0 25 C 32.5 53.0, 97.5 53.0, 130.0 25.0 C 157.5 48.0, 212.5 48.0, 240.0 25.0 C 277.5 53.0, 352.5 53.0, 390.0 25.0 C 420.0 48.0, 480.0 48.0, 510.0 25.0 C 545.0 53.0, 615.0 53.0, 650.0 25.0 C 682.5 48.0, 747.5 48.0, 780.0 25.0 C 810.0 53.0, 870.0 53.0, 900.0 25.0 C 937.5 48.0, 1012.5 48.0, 1050.0 25.0 C 1077.5 53.0, 1132.5 53.0, 1160.0 25.0 C 1195.0 48.0, 1265.0 48.0, 1300.0 25.0 C 1335.0 53.0, 1405.0 53.0, 1440.0 25.0';

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onCategorySelect,
  onShopAllClick,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [scrollStage, setScrollStage] = useState<string>('welcome');
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState<number>(0);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Active guide stage: hovered category takes immediate visual priority, otherwise scroll stage
  const activeStageId = hoveredCategory || scrollStage;
  const currentStage = GUIDE_STAGES[activeStageId] || GUIDE_STAGES.welcome;

  // Track scroll position to update mascot guide stages smoothly
  useEffect(() => {
    const handleScrollObserver = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Section entered top of viewport
      if (rect.top > viewportHeight * 0.7) {
        setScrollStage('welcome');
        return;
      }

      // Check card positions to highlight relevant category
      let bestCategory = 'welcome';
      let minDistance = Infinity;

      for (const cat of CATEGORIES) {
        const el = cardRefs.current[cat.id];
        if (el) {
          const cardRect = el.getBoundingClientRect();
          const cardCenter = cardRect.top + cardRect.height / 2;
          const targetCenter = viewportHeight * 0.55;
          const distance = Math.abs(cardCenter - targetCenter);

          if (cardRect.top < viewportHeight * 0.85 && cardRect.bottom > viewportHeight * 0.2) {
            if (distance < minDistance) {
              minDistance = distance;
              bestCategory = cat.id;
            }
          }
        }
      }

      // Bottom invitation zone
      if (rect.bottom < viewportHeight * 0.95 && rect.bottom > 0) {
        bestCategory = 'final';
      }

      setScrollStage(bestCategory);
    };

    window.addEventListener('scroll', handleScrollObserver, { passive: true });
    handleScrollObserver();
    return () => window.removeEventListener('scroll', handleScrollObserver);
  }, []);

  const handleCarouselScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        const progress = scrollLeft / maxScroll;
        const dotIndex = Math.min(Math.max(0, Math.round(progress * 2)), 2);
        setActiveDot(dotIndex);

        // Map mobile horizontal carousel position to category stages
        const approxCategoryIndex = Math.min(
          CATEGORIES.length - 1,
          Math.floor((scrollLeft / maxScroll) * CATEGORIES.length)
        );
        if (CATEGORIES[approxCategoryIndex]) {
          setScrollStage(CATEGORIES[approxCategoryIndex].id);
        }
      }
    }
  };

  const handleStageSelect = (stageId: string) => {
    setScrollStage(stageId);
    const cat = CATEGORIES.find((c) => c.id === stageId);
    if (cat && cardRefs.current[cat.id]) {
      cardRefs.current[cat.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAllClick = () => {
    if (onShopAllClick) {
      onShopAllClick();
    } else if (onCategorySelect) {
      onCategorySelect('all');
    }
  };

  return (
    <div ref={sectionRef} className="w-full relative mt-3 sm:mt-5 select-none">
      {/* 1. Top Puffy Cloud Scalloped Border with Clean Maroon Stroke */}
      <div className="w-full overflow-hidden leading-none -mb-[1px]">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-9 sm:h-12 md:h-14 block"
          aria-hidden="true"
        >
          <path d={TOP_CLOUD_FILL} fill="#D4EFF4" />
          <path
            d={TOP_CLOUD_STROKE}
            fill="none"
            stroke="#641623"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 2. Main Cloud Body in Theme's Pastel Blue (#D4EFF4) */}
      <section className="w-full bg-[#D4EFF4] py-3 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Soft Ambient Floating Petals & Fairy Sparkles in the Category Cloud */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          {/* Top-Left Floating Petal */}
          <div className="absolute top-4 left-6 sm:left-12 opacity-70 animate-[bounce_6s_infinite_ease-in-out]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-[#F472B6] -rotate-12" fill="currentColor">
              <path d="M12 2C8 6 6 12 12 22C18 12 16 6 12 2Z" />
            </svg>
          </div>

          {/* Top-Right Floating Daisy */}
          <div className="absolute top-6 right-8 sm:right-16 opacity-75 animate-[pulse_5s_infinite_ease-in-out]">
            <svg viewBox="0 0 28 28" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
              <circle cx="14" cy="7" r="4" fill="#FFFDF8" />
              <circle cx="21" cy="11" r="4" fill="#FFFDF8" />
              <circle cx="20" cy="18" r="4" fill="#FFFDF8" />
              <circle cx="14" cy="21" r="4" fill="#FFFDF8" />
              <circle cx="8" cy="18" r="4" fill="#FFFDF8" />
              <circle cx="7" cy="11" r="4" fill="#FFFDF8" />
              <circle cx="14" cy="14" r="4.5" fill="#FBBF24" />
            </svg>
          </div>

          {/* Mid-Left Golden Sparkle */}
          <div className="absolute top-1/2 left-4 sm:left-8 opacity-65 -translate-y-1/2 animate-[spin_8s_linear_infinite]">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#F59E0B]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>

          {/* Mid-Right Floating Peach Petal */}
          <div className="absolute top-2/3 right-4 sm:right-10 opacity-70 animate-[bounce_7s_infinite_ease-in-out]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-[#FBBF24] rotate-45" fill="currentColor">
              <path d="M12 2C8 6 6 12 12 22C18 12 16 6 12 2Z" />
            </svg>
          </div>

          {/* Bottom-Left Pink Petal */}
          <div className="absolute bottom-6 left-12 sm:left-24 opacity-60 animate-[pulse_6s_infinite]">
            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-[#FDA4AF] rotate-12" fill="currentColor">
              <path d="M12 2C8 6 6 12 12 22C18 12 16 6 12 2Z" />
            </svg>
          </div>

          {/* Bottom-Right Fairy Sparkle */}
          <div className="absolute bottom-8 right-16 sm:right-32 opacity-70 animate-[spin_10s_linear_infinite]">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#DE637E]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
        </div>

        <div className="w-full max-w-[1060px] mx-auto relative z-10">
          {/* Header with Whimsical Radiant Dashes */}
          <div className="flex flex-col items-center justify-center mb-4 sm:mb-6 text-center">
            {/* Small Friendly Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5CC] border border-[#641623]/25 shadow-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-[#811B2B] animate-ping" />
              <span className="font-['Fredoka'] font-semibold text-xs text-[#811B2B] tracking-wide">
                Meet your little shopping guide!
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 text-center">
              {/* Left Radiant Dashes */}
              <svg
                className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#641623] flex-shrink-0"
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

              {/* Heading in Exact Brand Font */}
              <h2 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-[#641623] lowercase tracking-tight whitespace-nowrap">
                shop by category
              </h2>

              {/* Right Radiant Dashes */}
              <svg
                className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#641623] flex-shrink-0"
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
          </div>

          {/* =========================================================================
              MASCOT SHOPPING GUIDE STATION
              Interactive Mascot Companion with Dynamic Speech Bubble
              ========================================================================= */}
          <div className="w-full mb-5 sm:mb-8 bg-[#FFFDF8] rounded-2xl sm:rounded-3xl border-[2px] border-[#641623] shadow-[0_6px_20px_rgba(100,22,35,0.08)] p-2.5 sm:p-5 transition-all duration-300">
            <div className="flex flex-row items-center gap-2.5 sm:gap-6">
              {/* Mascot Character Avatar Box */}
              <div className="relative flex-shrink-0 flex items-center justify-center">
                {/* Clean Cameo Arch Frame with Warm Gradient */}
                <div className="w-16 h-20 sm:w-24 sm:h-28 md:w-30 md:h-34 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#FFF5CC] to-[#FFE8BF] border-[2px] border-[#641623] flex items-end justify-center overflow-hidden shadow-inner relative group">
                  {/* Original Boy Mascot Character Portrait */}
                  <img
                    src="/mascot/guide-portrait.png"
                    alt="Knotsnco Boy Shopping Guide"
                    className="h-20 sm:h-28 md:h-34 w-auto object-contain select-none drop-shadow-sm transition-transform duration-300 transform hover:scale-105"
                  />

                  {/* Dynamic SVG Accessory Badge for Current Stage */}
                  <div className="absolute top-1 right-1 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white border border-[#641623] flex items-center justify-center shadow-xs animate-bounce">
                    {currentStage.accessoryIcon}
                  </div>
                </div>
              </div>

              {/* Dynamic Speech Bubble */}
              <div className="flex-1 min-w-0 text-left relative">
                {/* Speech Bubble Arrow pointing toward Mascot */}
                <div className="block absolute -left-2 top-6 sm:top-7 w-0 h-0 border-t-[6px] sm:border-t-[8px] border-t-transparent border-b-[6px] sm:border-b-[8px] border-b-transparent border-r-[8px] sm:border-r-[10px] border-r-[#FFF5CC] filter drop-shadow-[-1px_0_0_#641623]" />

                <div className="bg-[#FFF5CC] rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border-[1.8px] border-[#641623] relative">
                  {/* Stage Tracker Pill & Guide Hint */}
                  <div className="flex items-center justify-between gap-2 mb-0.5 sm:mb-1">
                    <span className="inline-flex items-center gap-1 font-['Fredoka'] font-bold text-[10px] sm:text-xs text-[#811B2B] uppercase tracking-wider truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#811B2B] flex-shrink-0" />
                      {currentStage.stepLabel}
                    </span>
                    <span className="font-['Fredoka'] text-[10px] sm:text-[11px] text-[#641623]/60 italic hidden md:inline">
                      hover or scroll cards to guide
                    </span>
                  </div>

                  {/* Main Speech Sentence from Mascot */}
                  <p className="font-['Fredoka'] font-bold text-xs sm:text-lg md:text-xl text-[#641623] leading-snug tracking-tight transition-all duration-300">
                    &ldquo;{currentStage.speech}&rdquo;
                  </p>

                  {/* Subtitle / Descriptive Context */}
                  <p className="font-['Fredoka'] text-[10px] sm:text-sm text-[#641623]/75 mt-0.5 leading-snug sm:leading-relaxed hidden xs:block">
                    {currentStage.subtext}
                  </p>

                  {/* Quick Stage Navigation Chips */}
                  <div className="mt-1.5 sm:mt-2.5 pt-1.5 sm:pt-2 border-t border-[#641623]/15 flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
                    {CATEGORIES.map((cat) => {
                      const isActive = activeStageId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleStageSelect(cat.id)}
                          className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[11px] font-['Fredoka'] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                            isActive
                              ? 'bg-[#811B2B] text-white shadow-xs scale-105'
                              : 'bg-white/80 text-[#641623] hover:bg-white border border-[#641623]/20'
                          }`}
                        >
                          {cat.buttonLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              COLLECTION CARDS GRID (Mobile Carousel & Desktop 3x2 Grid)
              ========================================================================= */}
          <div
            ref={scrollRef}
            onScroll={handleCarouselScroll}
            className="flex lg:grid lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-7 overflow-x-auto lg:overflow-visible pb-3 pt-1 px-1 no-scrollbar snap-x snap-mandatory"
          >
            {CATEGORIES.map((cat) => {
              const isHovered = hoveredCategory === cat.id;
              const isStageActive = activeStageId === cat.id;

              return (
                <div
                  key={cat.id}
                  ref={(el) => {
                    cardRefs.current[cat.id] = el;
                  }}
                  title={cat.buttonLabel}
                  onClick={() => onCategorySelect?.(cat.id)}
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`group flex-shrink-0 w-[152px] sm:w-[200px] lg:w-auto snap-center cursor-pointer flex flex-col items-center relative transition-transform duration-300 ${
                    isStageActive ? 'scale-[1.02]' : ''
                  }`}
                >
                  {/* 1. Square Aspect Ratio Image Box with Maroon Border & Hover Crossfade */}
                  <div
                    className={`relative w-full aspect-square rounded-[18px] sm:rounded-[28px] overflow-hidden border-[1.8px] sm:border-[2.2px] border-[#641623] bg-white transition-all duration-300 group-hover:-translate-y-1 ${
                      isStageActive
                        ? 'shadow-[0_12px_28px_rgba(129,27,43,0.18)] ring-2 ring-[#811B2B]/40'
                        : 'shadow-[0_4px_14px_rgba(100,22,35,0.06)] group-hover:shadow-[0_12px_28px_rgba(100,22,35,0.14)]'
                    }`}
                  >
                    {/* Default Image */}
                    <img
                      src={cat.image}
                      alt={cat.buttonLabel}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out select-none ${
                        isHovered ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
                      }`}
                      loading="lazy"
                    />

                    {/* Secondary Alternate / Lifestyle Image (Fades In on Hover) */}
                    <img
                      src={cat.hoverImage}
                      alt={`${cat.buttonLabel} alternate view`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out select-none ${
                        isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      loading="lazy"
                    />

                    {/* Mint Green Scalloped Daisy Flower Badge in Top Right */}
                    <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-20 pointer-events-none drop-shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <svg viewBox="0 0 50 50" className="w-6 h-6 sm:w-9 sm:h-9">
                        {/* 5 Petal Lobes */}
                        <g fill="#7FE5BD" stroke="#641623" strokeWidth="2.2">
                          <circle cx="25" cy="14" r="9.5" />
                          <circle cx="35.5" cy="21.6" r="9.5" />
                          <circle cx="31.5" cy="34" r="9.5" />
                          <circle cx="18.5" cy="34" r="9.5" />
                          <circle cx="14.5" cy="21.6" r="9.5" />
                        </g>
                        {/* Center Fill */}
                        <circle cx="25" cy="25" r="12.5" fill="#7FE5BD" />
                        {/* Badge Text */}
                        <text
                          x="25"
                          y="22.5"
                          textAnchor="middle"
                          fontSize="6.5"
                          fontWeight="800"
                          fill="#641623"
                          fontFamily="Fredoka, sans-serif"
                          letterSpacing="0.02em"
                        >
                          {cat.badgeLine1}
                        </text>
                        <text
                          x="25"
                          y="30.5"
                          textAnchor="middle"
                          fontSize="6.5"
                          fontWeight="800"
                          fill="#641623"
                          fontFamily="Fredoka, sans-serif"
                          letterSpacing="0.02em"
                        >
                          {cat.badgeLine2}
                        </text>
                      </svg>
                    </div>

                    {/* =====================================================================
                        STAGE-SPECIFIC MICRO-ANIMATIONS ON CARDS (Strictly SVG, NO emojis)
                        ===================================================================== */}
                    {/* Stage 2: Flowers blooming crochet flower */}
                    {cat.id === 'flowers' && (
                      <div
                        className={`absolute bottom-2 left-2 z-20 pointer-events-none transition-all duration-300 ${
                          isStageActive || isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                        }`}
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFF5CC] border border-[#641623] shadow-md flex items-center justify-center animate-[bounce_2s_infinite]">
                          {SVG_ICONS.flower}
                        </div>
                      </div>
                    )}

                    {/* Stage 2: Flower Pots swaying plant */}
                    {cat.id === 'flower-pots' && (
                      <div
                        className={`absolute bottom-2 left-2 z-20 pointer-events-none transition-all duration-300 ${
                          isStageActive || isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                        }`}
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D9EEF5] border border-[#641623] shadow-md flex items-center justify-center origin-bottom animate-[wiggle_2.5s_infinite]">
                          {SVG_ICONS.flowerPot}
                        </div>
                      </div>
                    )}

                    {/* Stage 3: Bags hanging & swinging charm */}
                    {cat.id === 'bags' && (
                      <div
                        className={`absolute bottom-2 left-2 z-20 pointer-events-none transition-all duration-300 ${
                          isStageActive || isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                        }`}
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F5D76E] border border-[#641623] shadow-md flex items-center justify-center origin-top animate-[wiggle_2s_infinite]">
                          {SVG_ICONS.bag}
                        </div>
                      </div>
                    )}

                    {/* Stage 3: Keychains swinging charm */}
                    {cat.id === 'keychains' && (
                      <div
                        className={`absolute bottom-2 left-2 z-20 pointer-events-none transition-all duration-300 ${
                          isStageActive || isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                        }`}
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFF5CC] border border-[#641623] shadow-md flex items-center justify-center origin-top animate-[wiggle_1.8s_infinite]">
                          {SVG_ICONS.keychain}
                        </div>
                      </div>
                    )}

                    {/* Stage 4: Plushies bouncing friend */}
                    {cat.id === 'plushies' && (
                      <div
                        className={`absolute bottom-2 left-2 z-20 pointer-events-none transition-all duration-300 ${
                          isStageActive || isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                        }`}
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F8D9D8] border border-[#641623] shadow-md flex items-center justify-center animate-[bounce_1.5s_infinite]">
                          {SVG_ICONS.plushie}
                        </div>
                      </div>
                    )}

                    {/* Stage 5: Home Decor cozy spark */}
                    {cat.id === 'home-decor' && (
                      <div
                        className={`absolute bottom-2 left-2 z-20 pointer-events-none transition-all duration-300 ${
                          isStageActive || isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                        }`}
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFF5CC] border border-[#641623] shadow-md flex items-center justify-center animate-[spin_6s_linear_infinite]">
                          {SVG_ICONS.star}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Sleek 3D Offset Pill Button Matching the Card Width */}
                  <div className="w-full mt-2 sm:mt-3.5 flex justify-center">
                    <div
                      className={`w-full py-1.5 sm:py-3 px-1.5 sm:px-5 rounded-full border-[1.8px] sm:border-[2.2px] border-[#641623] shadow-[0_3px_0_0_#641623] sm:shadow-[0_6px_0_0_#641623] flex items-center justify-center gap-1 sm:gap-2.5 text-center font-['Fredoka'] font-black tracking-wide sm:tracking-wider text-[10px] sm:text-sm md:text-[15px] uppercase transition-all duration-200 group-hover:translate-y-[2px] group-hover:shadow-[0_4px_0_0_#641623] active:translate-y-1 active:shadow-[0_1px_0_0_#641623] select-none ${
                        isStageActive
                          ? 'bg-[#811B2B] text-white shadow-[0_3px_0_0_#380B12]'
                          : 'bg-[#F7BE44] text-[#641623]'
                      }`}
                    >
                      <span className="scale-75 sm:scale-100 flex-shrink-0">{cat.icon}</span>
                      <span className="leading-tight pt-0.5 truncate">{cat.buttonLabel}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Pagination Indicator Dots */}
          <div className="flex lg:hidden items-center justify-center gap-2 mt-3">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollRef.current) {
                    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                    scrollRef.current.scrollTo({
                      left: (maxScroll / 2) * idx,
                      behavior: 'smooth',
                    });
                  }
                  setActiveDot(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeDot === idx
                    ? 'bg-[#641623] scale-110'
                    : 'border-2 border-[#641623]/40 bg-transparent'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* =========================================================================
              STAGE 5: STITCHED YARN TRAIL & FINAL INVITATION STATION
              ========================================================================= */}
          <div className="relative mt-8 sm:mt-12 flex flex-col items-center justify-center text-center">
            {/* Playful Stitched Yarn Trail connecting down to the Invitation */}
            <div className="w-full max-w-[340px] sm:max-w-[480px] h-8 flex items-center justify-center mb-3 pointer-events-none">
              <svg viewBox="0 0 400 30" className="w-full h-full overflow-visible" fill="none">
                {/* Wavy stitched yarn thread in burgundy */}
                <path
                  d="M 10 15 Q 60 0, 110 15 T 210 15 T 310 15 T 390 15"
                  stroke="#811B2B"
                  strokeWidth="2.5"
                  strokeDasharray="6 5"
                  strokeLinecap="round"
                />
                {/* Cute daisy at center of trail */}
                <circle cx="200" cy="15" r="4.5" fill="#F5D76E" stroke="#641623" strokeWidth="1.5" />
                <circle cx="100" cy="15" r="3" fill="#FDA4AF" />
                <circle cx="300" cy="15" r="3" fill="#7FE5BD" />
              </svg>
            </div>

            {/* Final Invitation Speech Bubble */}
            <div className="max-w-[560px] bg-[#FFF5CC] border-[2px] border-[#641623] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_6px_20px_rgba(100,22,35,0.08)] mb-4 relative">
              <p className="font-['Fredoka'] font-bold text-base sm:text-xl text-[#811B2B]">
                &ldquo;There&apos;s something special waiting for you!&rdquo;
              </p>
              <p className="font-['Fredoka'] text-xs sm:text-sm text-[#641623]/80 mt-1">
                Find your favourite little handmade thing.
              </p>
            </div>

            {/* Clear Call-To-Action Button: Explore all collections */}
            <button
              onClick={handleAllClick}
              className="group relative inline-flex items-center gap-2.5 py-3 sm:py-3.5 px-6 sm:px-8 rounded-full bg-[#F7BE44] hover:bg-[#F5D76E] border-[2.2px] border-[#641623] shadow-[0_5px_0_0_#641623] hover:shadow-[0_2px_0_0_#641623] hover:translate-y-[3px] active:translate-y-1 active:shadow-[0_0_0_0_#641623] transition-all duration-150 cursor-pointer focus:outline-none"
            >
              <span className="font-['Fredoka'] font-bold text-sm sm:text-base md:text-lg text-[#641623] tracking-wide">
                Explore all collections
              </span>
              <span className="text-base sm:text-lg font-bold text-[#641623] transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Bottom Puffy Cloud Scalloped Border with Clean Maroon Stroke */}
      <div className="w-full overflow-hidden leading-none -mt-[1px]">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-9 sm:h-12 md:h-14 block"
          aria-hidden="true"
        >
          <path d={BOT_CLOUD_FILL} fill="#D4EFF4" />
          <path
            d={BOT_CLOUD_STROKE}
            fill="none"
            stroke="#641623"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
