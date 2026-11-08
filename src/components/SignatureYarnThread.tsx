import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Metrics {
  heroBottom: number;
  catTop: number;
  catBottom: number;
  bTop: number;
  bBottom: number;
  sTop: number;
  width: number;
  containerHeight: number;
}

export const SignatureYarnThread: React.FC = () => {
  const containerRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const texturePathRef = useRef<SVGPathElement>(null);

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [pathLength, setPathLength] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Measure actual section bounding boxes in the DOM so path coordinates are 100% precision-aligned
  const measureSections = useCallback(() => {
    if (typeof window === 'undefined') return;

    const hero = document.getElementById('section-hero');
    const cat = document.getElementById('section-categories');
    const best = document.getElementById('section-bestsellers');
    const story = document.getElementById('section-story');

    if (!hero || !cat || !best || !story) return;

    const container = hero.parentElement;
    if (!container) return;

    const cRect = container.getBoundingClientRect();
    const hRect = hero.getBoundingClientRect();
    const catRect = cat.getBoundingClientRect();
    const bRect = best.getBoundingClientRect();
    const sRect = story.getBoundingClientRect();

    setMetrics({
      heroBottom: hRect.bottom - cRect.top,
      catTop: catRect.top - cRect.top,
      catBottom: catRect.bottom - cRect.top,
      bTop: bRect.top - cRect.top,
      bBottom: bRect.bottom - cRect.top,
      sTop: sRect.top - cRect.top,
      width: window.innerWidth,
      containerHeight: container.offsetHeight,
    });
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(media.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  // Measure on mount, window resize, and font loading
  useEffect(() => {
    measureSections();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measureSections, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    // Also re-measure after fonts load to ensure razor-sharp vertical offsets
    if (document.fonts) {
      document.fonts.ready.then(measureSections);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [measureSections]);

  // Compute total SVG path length when path changes
  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (len > 0) {
          setPathLength(len);
        }
      } catch (err) {
        console.warn('Could not get total path length:', err);
      }
    }
  }, [metrics]);

  // Scroll handler using requestAnimationFrame for 60fps buttery smoothness
  useEffect(() => {
    if (prefersReducedMotion) {
      setScrollProgress(1);
      return;
    }

    if (!metrics) return;

    let ticking = false;

    const updateScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Start unraveling near lower edge of hero (when hero bottom approaches upper viewport)
      const scrollStart = Math.max(0, metrics.heroBottom - windowHeight * 0.75);
      // Finish tying the bow when story section is well in view
      const scrollEnd = Math.max(scrollStart + 500, metrics.sTop - windowHeight * 0.35);

      const totalDist = scrollEnd - scrollStart;
      const raw = (scrollY - scrollStart) / totalDist;
      const clamped = Math.min(1, Math.max(0, raw));

      setScrollProgress(clamped);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [metrics, prefersReducedMotion]);

  if (!metrics) return null;

  // Generate responsive yarn coordinates and smooth organic bezier path
  const { width, heroBottom, catTop, catBottom, bTop, bBottom, sTop, containerHeight } = metrics;

  let xBase: number;
  let xLoop: number;
  let swing: number;
  let flowerScaleMultiplier: number;
  let bowScaleMultiplier: number;

  if (width >= 1024) {
    // Desktop: Generous margin along left side
    xBase = Math.max(48, Math.min(75, (width - 1200) / 2 + 55));
    xLoop = xBase + 12;
    swing = 32;
    flowerScaleMultiplier = 1.0;
    bowScaleMultiplier = 1.0;
  } else if (width >= 640) {
    // Tablet: Moderate curve swings
    xBase = 36;
    xLoop = 44;
    swing = 20;
    flowerScaleMultiplier = 0.88;
    bowScaleMultiplier = 0.88;
  } else {
    // Mobile: Narrow hugs left edge so it never obscures cards
    xBase = 18;
    xLoop = 22;
    swing = 10;
    flowerScaleMultiplier = 0.78;
    bowScaleMultiplier = 0.78;
  }

  // Key vertical milestones
  const yStart = Math.max(200, heroBottom - 45);
  const xStart = xBase;

  const yCatTransition = catTop - 25;
  const xCatTransition = xBase + swing * 0.4;

  const yFlower = catTop + 130;
  const xFlower = xLoop;

  const yCatKnot = catTop + (catBottom - catTop) * 0.45;
  const yBestsellersTransition = bTop - 35;
  const yBestsellersMid = bTop + (bBottom - bTop) * 0.5;

  const yStoryApproach = sTop + 60;
  const xBow = xBase + swing * 0.25;
  const yBow = sTop + 90;

  // Construct organic curved path
  const pathParts: string[] = [
    `M ${xStart} ${yStart}`,
    // 1. Unspooling from yarn ball towards Categories
    `C ${xStart - swing * 0.3} ${yStart + 55}, ${xCatTransition + swing * 0.5} ${yCatTransition - 55}, ${xCatTransition} ${yCatTransition}`,
    // 2. Approaching flower loop near Collections heading
    `C ${xCatTransition - swing * 0.4} ${yCatTransition + 40}, ${xFlower - swing * 0.9} ${yFlower - 45}, ${xFlower} ${yFlower - 25}`,
    // 3. Circular crochet loop for flower
    `C ${xFlower + swing * 0.9} ${yFlower - 25}, ${xFlower + swing * 0.9} ${yFlower + 25}, ${xFlower} ${yFlower + 25}`,
    `C ${xFlower - swing * 0.8} ${yFlower + 25}, ${xFlower - swing * 0.8} ${yFlower - 15}, ${xFlower} ${yFlower}`,
    // 4. Traveling down collections with organic handmade curves
    `C ${xFlower + swing * 0.4} ${yFlower + 70}, ${xBase - swing * 0.4} ${yCatKnot - 60}, ${xBase} ${yCatKnot}`,
    // 5. Delicate decorative knot loop
    `C ${xBase + swing * 0.5} ${yCatKnot + 25}, ${xBase - swing * 0.5} ${yCatKnot + 35}, ${xBase} ${yCatKnot + 60}`,
    // 6. Transition past categories into Bestsellers
    `C ${xBase + swing * 0.4} ${yCatKnot + 140}, ${xBase - swing * 0.3} ${yBestsellersTransition - 60}, ${xBase} ${yBestsellersTransition}`,
    // 7. Graceful sweep past Bestsellers carousel
    `C ${xBase + swing * 0.6} ${bTop + 50}, ${xBase - swing * 0.4} ${yBestsellersMid}, ${xBase + swing * 0.2} ${bBottom - 35}`,
    // 8. Reaching the Handmade Story Section and tying into bow
    `C ${xBase - swing * 0.4} ${yStoryApproach - 30}, ${xBow - swing * 0.4} ${yBow - 35}, ${xBow} ${yBow}`,
  ];

  const yarnPathD = pathParts.join(' ');

  // Compute animated dashoffset (when progress=0 -> offset=length; when progress=1 -> offset=0)
  const dashOffset = pathLength > 0 ? pathLength * (1 - scrollProgress) : 0;

  // Flower blooming animation: blooms from scale 0 to 1 when scroll passes top of collections
  // Approximate progress range for flower is 0.18 to 0.28
  const flowerProgress = prefersReducedMotion
    ? 1
    : Math.min(1, Math.max(0, (scrollProgress - 0.16) / 0.1));

  // Bow reveal animation: reveals from scale 0 to 1 when scroll reaches story section
  // Approximate progress range for bow is 0.86 to 0.98
  const bowProgress = prefersReducedMotion
    ? 1
    : Math.min(1, Math.max(0, (scrollProgress - 0.85) / 0.1));

  // Gentle subtle rotation for the yarn ball as thread unspools
  const ballRotation = prefersReducedMotion ? 0 : scrollProgress * 360;

  return (
    <svg
      ref={containerRef}
      className="absolute top-0 left-0 w-full pointer-events-none z-10 overflow-visible select-none"
      style={{ height: `${containerHeight}px` }}
      aria-hidden="true"
    >
      <defs>
        {/* Soft realistic yarn drop shadow */}
        <filter id="yarnShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#641623" floodOpacity="0.16" />
        </filter>
        {/* Soft flower & bow drop shadow */}
        <filter id="motifShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#641623" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* =========================================================================
          STAGE 1: BURGUNDY YARN BALL NEAR LOWER EDGE OF HERO
          ========================================================================= */}
      <g
        transform={`translate(${xStart}, ${yStart})`}
        filter="url(#yarnShadow)"
        className="transition-transform duration-100 ease-out"
        style={{
          transformOrigin: '0 0',
          transform: `translate(${xStart}px, ${yStart}px) rotate(${ballRotation}deg)`,
        }}
      >
        {/* Yarn Ball Core in Rich Burgundy */}
        <circle cx="0" cy="0" r="12" fill="#811B2B" stroke="#641623" strokeWidth="1.2" />
        {/* Soft Texture Lines suggesting twisted yarn strands */}
        <path d="M -8 -4 C -3 -9, 3 -9, 8 -4" stroke="#FFF5CC" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.65" />
        <path d="M -10 1 C -3 -3, 3 -2, 10 1" stroke="#F8D9D8" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.75" />
        <path d="M -8 6 C -3 3, 3 3, 8 5" stroke="#FFF5CC" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.65" />
        <path d="M -2 -10 C 2 -3, 2 4, -1 10" stroke="#F8D9D8" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.75" />
        <path d="M 3 -10 C 8 -3, 7 4, 3 9" stroke="#FFF5CC" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.55" />
      </g>

      {/* =========================================================================
          STAGE 2: SCROLL-RESPONSIVE BURGUNDY YARN THREAD
          - Gradually draws itself as user scrolls down the homepage
          - Reverses naturally when scrolling up
          - Layered base + subtle cream twist highlight suggests authentic wool fibers
          ========================================================================= */}
      {/* Base Burgundy Yarn Stroke */}
      <path
        ref={pathRef}
        d={yarnPathD}
        fill="none"
        stroke="#811B2B"
        strokeWidth={width < 640 ? 2.2 : 2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength > 0 ? pathLength : undefined}
        strokeDashoffset={pathLength > 0 ? dashOffset : undefined}
        filter="url(#yarnShadow)"
        style={{
          transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 0.08s ease-out',
        }}
      />

      {/* Layered Textured Twist Highlight */}
      <path
        ref={texturePathRef}
        d={yarnPathD}
        fill="none"
        stroke="#FFF5CC"
        strokeWidth={0.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 5"
        strokeDashoffset={pathLength > 0 ? dashOffset : undefined}
        opacity="0.45"
        style={{
          transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 0.08s ease-out',
        }}
      />

      {/* =========================================================================
          STAGE 3: TINY CROCHET FLOWER BLOOMING MOMENT NEAR COLLECTIONS
          - Placed in loop beside Collections section
          - Blooms from scale(0) to scale(1) as scroll progress reaches this point
          - Burgundy, butter yellow, and soft pink
          ========================================================================= */}
      <g
        transform={`translate(${xFlower}, ${yFlower})`}
        filter="url(#motifShadow)"
        style={{
          transformOrigin: `${xFlower}px ${yFlower}px`,
          transform: `translate(${xFlower}px, ${yFlower}px) scale(${flowerProgress * flowerScaleMultiplier}) rotate(${flowerProgress * 18}deg)`,
          opacity: flowerProgress > 0.05 ? Math.min(1, flowerProgress * 1.5) : 0,
          transition: prefersReducedMotion ? 'none' : 'transform 0.15s ease-out, opacity 0.15s ease-out',
        }}
      >
        {/* 5 Soft Pink Petals with Burgundy Stitch Outline */}
        <circle cx="0" cy="-8.5" r="5" fill="#FDA4AF" stroke="#811B2B" strokeWidth="1.3" />
        <circle cx="8" cy="-2.6" r="5" fill="#FDA4AF" stroke="#811B2B" strokeWidth="1.3" />
        <circle cx="5" cy="6.8" r="5" fill="#FDA4AF" stroke="#811B2B" strokeWidth="1.3" />
        <circle cx="-5" cy="6.8" r="5" fill="#FDA4AF" stroke="#811B2B" strokeWidth="1.3" />
        <circle cx="-8" cy="-2.6" r="5" fill="#FDA4AF" stroke="#811B2B" strokeWidth="1.3" />
        {/* Butter Yellow Center with Burgundy Rim */}
        <circle cx="0" cy="0" r="4.2" fill="#F5D76E" stroke="#811B2B" strokeWidth="1.3" />
        {/* Handcrafted Center Cross Stitch */}
        <path d="M -1.6 0 L 1.6 0 M 0 -1.6 L 0 1.6" stroke="#811B2B" strokeWidth="1.1" strokeLinecap="round" />
      </g>

      {/* =========================================================================
          STAGE 4: DECORATIVE CROCHET YARN BOW NEAR HANDMADE STORY
          - Sits beside the handmade story content as a decorative finishing detail
          - Reveals with gentle scale and opacity animation as thread arrives
          ========================================================================= */}
      <g
        transform={`translate(${xBow}, ${yBow})`}
        filter="url(#motifShadow)"
        style={{
          transformOrigin: `${xBow}px ${yBow}px`,
          transform: `translate(${xBow}px, ${yBow}px) scale(${bowProgress * bowScaleMultiplier})`,
          opacity: bowProgress > 0.05 ? Math.min(1, bowProgress * 1.4) : 0,
          transition: prefersReducedMotion ? 'none' : 'transform 0.2s ease-out, opacity 0.2s ease-out',
        }}
      >
        {/* Left Bow Loop in Burgundy with Cream Highlight */}
        <path d="M 0 0 C -12 -13, -22 -5, -18 2 C -15 6, -5 3, 0 0" fill="#811B2B" stroke="#641623" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M -3 -1 C -9 -7, -15 -3, -12 1" fill="none" stroke="#FFF5CC" strokeWidth="0.9" opacity="0.6" strokeLinecap="round" />
        {/* Right Bow Loop in Burgundy with Cream Highlight */}
        <path d="M 0 0 C 12 -13, 22 -5, 18 2 C 15 6, 5 3, 0 0" fill="#811B2B" stroke="#641623" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M 3 -1 C 9 -7, 15 -3, 12 1" fill="none" stroke="#FFF5CC" strokeWidth="0.9" opacity="0.6" strokeLinecap="round" />
        {/* Left Dangling Ribbon with Loose Yarn End */}
        <path d="M -2 2 C -7 9, -13 14, -10 20" fill="none" stroke="#811B2B" strokeWidth="2.2" strokeLinecap="round" />
        {/* Right Dangling Ribbon with Loose Yarn End */}
        <path d="M 2 2 C 7 8, 12 13, 14 20" fill="none" stroke="#811B2B" strokeWidth="2.2" strokeLinecap="round" />
        {/* Center Knot in Butter Yellow */}
        <circle cx="0" cy="0" r="3.5" fill="#F5D76E" stroke="#641623" strokeWidth="1.3" />
      </g>
    </svg>
  );
};
