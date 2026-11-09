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
  const hookGroupRef = useRef<SVGGElement>(null);
  const flowerGroupRef = useRef<SVGGElement>(null);
  const bowGroupRef = useRef<SVGGElement>(null);
  const ballGroupRef = useRef<SVGGElement>(null);
  const pathLengthRef = useRef<number>(0);

  const targetProgress = useRef<number>(0);
  const currentProgress = useRef<number>(0);

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Interactive micro-states (for user clicks/taps)
  const [ballSpin, setBallSpin] = useState<number>(0);
  const [flowerSpin, setFlowerSpin] = useState<boolean>(false);
  const [bowBounce, setBowBounce] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 35, y: 600 });

  // Measure actual section bounding boxes in the DOM so path coordinates stay strictly in gutters
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
    if (document.fonts) {
      document.fonts.ready.then(measureSections);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [measureSections]);

  // Compute total SVG path length
  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (len > 0) {
          pathLengthRef.current = len;
          pathRef.current.style.strokeDasharray = `${len}px`;
          pathRef.current.style.strokeDashoffset = `${len * (1 - currentProgress.current)}px`;
          if (texturePathRef.current) {
            texturePathRef.current.style.strokeDasharray = `${len}px`;
            texturePathRef.current.style.strokeDashoffset = `${len * (1 - currentProgress.current)}px`;
          }
        }
      } catch (err) {
        console.warn('Could not get total path length:', err);
      }
    }
  }, [metrics]);

  // Scroll listener: updates targetProgress
  useEffect(() => {
    if (!metrics) return;

    const handleScroll = () => {
      if (prefersReducedMotion) {
        targetProgress.current = 1;
        return;
      }

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Start unraveling near lower edge of hero
      const scrollStart = Math.max(0, metrics.heroBottom - windowHeight * 0.75);
      // Finish tying the bow when story section is well in view
      const scrollEnd = Math.max(scrollStart + 500, metrics.sTop - windowHeight * 0.35);

      const totalDist = scrollEnd - scrollStart;
      const raw = (scrollY - scrollStart) / totalDist;
      targetProgress.current = Math.min(1, Math.max(0, raw));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [metrics, prefersReducedMotion]);

  // Responsive geometry calculations (computed once per metrics change)
  const geom = useRef({
    xFlower: 38,
    yFlower: 880,
    xBow: 32,
    yBow: 2900,
    flowerScaleMul: 1.0,
    bowScaleMul: 1.0,
    hookScaleMul: 1.0,
  });

  if (metrics) {
    const { width, catTop, sTop } = metrics;
    if (width >= 1024) {
      geom.current = {
        xFlower: 42,
        yFlower: catTop + 140,
        xBow: 32,
        yBow: sTop + 85,
        flowerScaleMul: 1.0,
        bowScaleMul: 1.0,
        hookScaleMul: 1.0,
      };
    } else if (width >= 640) {
      geom.current = {
        xFlower: 26,
        yFlower: catTop + 130,
        xBow: 22,
        yBow: sTop + 75,
        flowerScaleMul: 0.88,
        bowScaleMul: 0.88,
        hookScaleMul: 0.88,
      };
    } else {
      geom.current = {
        xFlower: 16,
        yFlower: catTop + 120,
        xBow: 14,
        yBow: sTop + 65,
        flowerScaleMul: 0.76,
        bowScaleMul: 0.76,
        hookScaleMul: 0.76,
      };
    }
  }

  // 60FPS Silky Smooth Physics Loop (Direct DOM mutations for ZERO dropped frames)
  useEffect(() => {
    let animId: number;

    const lerpPhysics = () => {
      const pLen = pathLengthRef.current;
      const pathEl = pathRef.current;
      const textureEl = texturePathRef.current;
      const hookEl = hookGroupRef.current;
      const flowerEl = flowerGroupRef.current;
      const bowEl = bowGroupRef.current;
      const ballEl = ballGroupRef.current;

      if (prefersReducedMotion) {
        currentProgress.current = 1;
        if (pathEl && pLen > 0) {
          pathEl.style.strokeDashoffset = '0px';
          if (textureEl) textureEl.style.strokeDashoffset = '0px';
        }
        if (hookEl) hookEl.style.display = 'none';
        if (flowerEl) {
          const { xFlower, yFlower, flowerScaleMul } = geom.current;
          flowerEl.setAttribute('transform', `translate(${xFlower}, ${yFlower}) scale(${flowerScaleMul})`);
          flowerEl.style.opacity = '1';
        }
        if (bowEl) {
          const { xBow, yBow, bowScaleMul } = geom.current;
          bowEl.setAttribute('transform', `translate(${xBow}, ${yBow}) scale(${bowScaleMul})`);
          bowEl.style.opacity = '1';
        }
        return;
      }

      // Smooth organic lerp factor (0.082 gives a soft tactile wool elasticity)
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgress.current += diff * 0.082;
        const p = currentProgress.current;

        // 1. Direct SVG path dashoffset update (Zero React re-render overhead!)
        if (pathEl && pLen > 0) {
          const offset = pLen * (1 - p);
          pathEl.style.strokeDashoffset = `${offset}px`;
          if (textureEl) {
            textureEl.style.strokeDashoffset = `${offset}px`;
          }

          // 2. Compute exact position and tangent angle for golden crochet hook
          if (hookEl) {
            if (p > 0.02 && p < 0.98) {
              const currentDist = pLen * p;
              try {
                const pt = pathEl.getPointAtLength(currentDist);
                const ptNext = pathEl.getPointAtLength(Math.min(pLen, currentDist + 2.5));
                const angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x) * (180 / Math.PI);
                const scale = geom.current.hookScaleMul;
                hookEl.setAttribute(
                  'transform',
                  `translate(${pt.x}, ${pt.y}) rotate(${angle - 35}) scale(${scale})`
                );
                hookEl.style.display = 'block';
              } catch (e) {}
            } else {
              hookEl.style.display = 'none';
            }
          }
        }

        // 3. Flower blooming (scale & opacity direct update)
        if (flowerEl) {
          const { xFlower, yFlower, flowerScaleMul } = geom.current;
          const flowerProg = Math.min(1, Math.max(0, (p - 0.16) / 0.1));
          const flowerScale = flowerProg * flowerScaleMul;
          const flowerRot = flowerProg * 15;
          flowerEl.setAttribute(
            'transform',
            `translate(${xFlower}, ${yFlower}) scale(${flowerScale}) rotate(${flowerRot})`
          );
          flowerEl.style.opacity = flowerProg > 0.05 ? `${Math.min(1, flowerProg * 1.5)}` : '0';
        }

        // 4. Bow reveal (scale & opacity direct update)
        if (bowEl) {
          const { xBow, yBow, bowScaleMul } = geom.current;
          const bowProg = Math.min(1, Math.max(0, (p - 0.84) / 0.1));
          const bowScale = bowProg * bowScaleMul;
          bowEl.setAttribute('transform', `translate(${xBow}, ${yBow}) scale(${bowScale})`);
          bowEl.style.opacity = bowProg > 0.05 ? `${Math.min(1, bowProg * 1.4)}` : '0';
        }

        // 5. Yarn ball unrolling rotation
        if (ballEl) {
          const ballRot = p * 420;
          ballEl.setAttribute('transform', `rotate(${ballRot})`);
        }
      }

      animId = requestAnimationFrame(lerpPhysics);
    };

    animId = requestAnimationFrame(lerpPhysics);
    return () => cancelAnimationFrame(animId);
  }, [prefersReducedMotion]);

  if (!metrics) return null;

  // STRICT GUTTER COORDINATES:
  // Card left edges: Desktop Bestsellers=38px, Tablet Categories=29px, Mobile=20px.
  // Setting xBase=18px on Desktop (max x=21px), 12px on Tablet (max x=14.5px), 8px on Mobile (max x=9.5px)
  // guarantees at least 14px to 20px+ of clean clearance from EVERY card!
  const { width, heroBottom, catTop, catBottom, bTop, bBottom, sTop, containerHeight } = metrics;

  let xBase: number;
  let swing: number;

  if (width >= 1024) {
    xBase = 18;
    swing = 3.5;
  } else if (width >= 640) {
    xBase = 12;
    swing = 2.5;
  } else {
    xBase = 8;
    swing = 1.5;
  }

  // Key vertical milestones
  const yStart = Math.max(200, heroBottom - 45);
  const xStart = xBase;

  const yCatTransition = catTop - 25;
  const xCatTransition = xBase + swing * 0.4;

  const yFlower = catTop + 140;
  const xFlower = geom.current.xFlower;

  const yCatMid = catTop + (catBottom - catTop) * 0.5;
  const yBestsellersTransition = bTop - 30;
  const yBestsellersMid = bTop + (bBottom - bTop) * 0.5;

  const yStoryApproach = sTop + 50;
  const xBow = geom.current.xBow;
  const yBow = geom.current.yBow;

  // Construct organic path strictly in the safe left gutter
  const pathParts: string[] = [
    `M ${xStart} ${yStart}`,
    // 1. Unspooling down from yarn ball towards Categories
    `C ${xStart - swing * 0.5} ${yStart + 60}, ${xCatTransition + swing * 0.5} ${yCatTransition - 60}, ${xCatTransition} ${yCatTransition}`,
    // 2. Approaching flower loop near Collections heading
    `C ${xCatTransition - swing * 0.5} ${yCatTransition + 40}, ${xFlower - swing * 0.8} ${yFlower - 50}, ${xFlower} ${yFlower - 25}`,
    // 3. Circular loop for flower
    `C ${xFlower + swing * 1.5} ${yFlower - 25}, ${xFlower + swing * 1.5} ${yFlower + 25}, ${xFlower} ${yFlower + 25}`,
    `C ${xFlower - swing * 1.2} ${yFlower + 25}, ${xFlower - swing * 1.2} ${yFlower - 15}, ${xFlower} ${yFlower}`,
    // 4. Traveling down categories
    `C ${xFlower + swing * 0.6} ${yFlower + 70}, ${xBase - swing * 0.5} ${yCatMid - 60}, ${xBase} ${yCatMid}`,
    // 5. Delicate decorative knot loop
    `C ${xBase + swing * 1.2} ${yCatMid + 25}, ${xBase - swing * 1.2} ${yCatMid + 35}, ${xBase} ${yCatMid + 60}`,
    // 6. Transition past categories towards Bestsellers
    `C ${xBase + swing * 0.5} ${yCatMid + 140}, ${xBase - swing * 0.4} ${yBestsellersTransition - 60}, ${xBase} ${yBestsellersTransition}`,
    // 7. Graceful sweep through Bestsellers gutter (STRICTLY outside product cards!)
    `C ${xBase + swing * 0.5} ${bTop + 50}, ${xBase - swing * 0.5} ${yBestsellersMid}, ${xBase + swing * 0.2} ${bBottom - 35}`,
    // 8. Reaching the Handmade Story Section and tying into bow
    `C ${xBase - swing * 0.4} ${yStoryApproach - 30}, ${xBow - swing * 0.5} ${yBow - 35}, ${xBow} ${yBow}`,
  ];

  const yarnPathD = pathParts.join(' ');

  // Handle interactive clicks on motifs
  const handleBallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBallSpin((prev) => prev + 360);
    setTooltipPos({ x: xStart, y: yStart });
    setActiveTooltip('Yarn unspooling! ♡');
    setTimeout(() => setActiveTooltip(null), 2000);
  };

  const handleFlowerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlowerSpin(true);
    setTooltipPos({ x: xFlower, y: yFlower });
    setActiveTooltip('Handmade with love ✿');
    setTimeout(() => setFlowerSpin(false), 900);
    setTimeout(() => setActiveTooltip(null), 2000);
  };

  const handleBowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBowBounce(true);
    setTooltipPos({ x: xBow, y: yBow });
    setActiveTooltip('Tied with love 🎀');
    setTimeout(() => setBowBounce(false), 700);
    setTimeout(() => setActiveTooltip(null), 2000);
  };

  return (
    <svg
      ref={containerRef}
      className="absolute top-0 left-0 w-full pointer-events-none z-20 overflow-visible select-none"
      style={{ height: `${containerHeight}px` }}
      aria-hidden="true"
    >
      <defs>
        {/* Soft, tactile multi-level yarn shadow for rich 3D depth */}
        <filter id="chunkyYarnShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2.2" stdDeviation="2.2" floodColor="#641623" floodOpacity="0.28" />
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#F5D76E" floodOpacity="0.22" />
        </filter>
        {/* Golden Crochet Hook Glow */}
        <filter id="crochetHookGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#D97706" floodOpacity="0.38" />
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#FDE68A" floodOpacity="0.45" />
        </filter>
        {/* Soft motif shadow */}
        <filter id="motifShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="#641623" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* =========================================================================
          STAGE 1: INTERACTIVE BURGUNDY YARN BALL NEAR LOWER EDGE OF HERO
          - Click/tap to spin!
          - Pulses and unspools as you scroll
          ========================================================================= */}
      <g
        transform={`translate(${xStart}, ${yStart})`}
        filter="url(#chunkyYarnShadow)"
        className="pointer-events-auto cursor-pointer group"
        onClick={handleBallClick}
        onMouseEnter={() => setActiveTooltip('Click to spin! 🧶')}
        onMouseLeave={() => setActiveTooltip(null)}
        role="button"
        tabIndex={0}
        aria-label="Interactive Knotsnco Yarn Ball"
      >
        <g
          ref={ballGroupRef}
          style={{
            transformOrigin: '0 0',
            transform: `rotate(${ballSpin}deg)`,
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Yarn Ball Core in Rich Burgundy */}
          <circle cx="0" cy="0" r="14" fill="#811B2B" stroke="#641623" strokeWidth="1.6" />
          {/* Authentic Combed Cotton Yarn Strands in Cream and Soft Pink */}
          <path d="M -10 -5 C -4 -11, 4 -11, 10 -5" stroke="#FFF5CC" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M -12 1 C -4 -4, 4 -3, 12 1" stroke="#FDA4AF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M -10 7 C -4 3, 4 3, 10 5" stroke="#FFF5CC" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M -3 -12 C 3 -4, 3 5, -2 12" stroke="#FDA4AF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M 4 -12 C 9 -4, 8 5, 4 11" stroke="#FFF5CC" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.65" />
        </g>
      </g>

      {/* =========================================================================
          STAGE 2: CHUNKY BURGUNDY YARN THREAD WITH TACTILE PLY TWIST
          - Chunky 3.8px base stroke for strong visual presence
          - Cream 2-ply dashed highlight gives authentic twisted cotton look
          - Stays strictly in gutter margin (never crosses product cards!)
          ========================================================================= */}
      {/* Chunky Burgundy Yarn Base Stroke */}
      <path
        ref={pathRef}
        d={yarnPathD}
        fill="none"
        stroke="#811B2B"
        strokeWidth={width < 640 ? 3.2 : 3.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#chunkyYarnShadow)"
      />

      {/* Cream Twisted 2-Ply Highlight */}
      <path
        ref={texturePathRef}
        d={yarnPathD}
        fill="none"
        stroke="#FFF5CC"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5 7"
        opacity="0.6"
      />

      {/* =========================================================================
          MAGIC GOLDEN CROCHET HOOK (Drawing Tip Companion)
          - Actively crochets and leads the thread down the page as you scroll!
          - Glides smoothly with tangent rotation
          - Eye-catching and distinctly handmade Knotsnco signature!
          ========================================================================= */}
      <g
        ref={hookGroupRef}
        filter="url(#crochetHookGlow)"
        className="pointer-events-auto cursor-pointer"
        style={{ display: 'none', transformOrigin: '0 0' }}
        onClick={() => {
          setActiveTooltip('Magic Crochet Hook ✨');
          setTimeout(() => setActiveTooltip(null), 1800);
        }}
        role="button"
        tabIndex={0}
        aria-label="Magic Golden Crochet Hook"
      >
        {/* Polished Golden Hook Shaft */}
        <path d="M 0 0 L 22 -32" stroke="#F5D76E" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 0 0 L 22 -32" stroke="#D97706" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        {/* Golden Hook Beak / Lip */}
        <path d="M 0 0 C -4 2, -6 -2, -3 -6 C -1 -8, 2 -6, 2 -4" fill="#F5D76E" stroke="#D97706" strokeWidth="1" />
        {/* Little Sparkle Star on Hook Tip */}
        <circle cx="-1.5" cy="-1.5" r="1.6" fill="#FFFFFF" />
      </g>

      {/* =========================================================================
          STAGE 3: INTERACTIVE BLOOMING CROCHET FLOWER (Collections Loop)
          - Placed in loop beside Collections section
          - Blooms as user scrolls into collections
          - Click/tap to spin!
          ========================================================================= */}
      <g
        ref={flowerGroupRef}
        filter="url(#motifShadow)"
        className="pointer-events-auto cursor-pointer group"
        onClick={handleFlowerClick}
        onMouseEnter={() => setActiveTooltip('Click me! ✿')}
        onMouseLeave={() => setActiveTooltip(null)}
        role="button"
        tabIndex={0}
        aria-label="Handcrafted Crochet Flower"
        style={{
          transformOrigin: '0 0',
          opacity: 0,
          transition: prefersReducedMotion
            ? 'none'
            : flowerSpin
            ? 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : undefined,
        }}
      >
        {/* 5 Plump Soft Pink Petals with Burgundy Stitch Outline */}
        <circle cx="0" cy="-9.5" r="5.5" fill="#FDA4AF" stroke="#811B2B" strokeWidth="1.5" />
        <circle cx="9" cy="-3" r="5.5" fill="#FDA4AF" stroke="#811B2B" strokeWidth="1.5" />
        <circle cx="5.6" cy="7.6" r="5.5" fill="#FDA4AF" stroke="#811B2B" strokeWidth="1.5" />
        <circle cx="-5.6" cy="7.6" r="5.5" fill="#FDA4AF" stroke="#811B2B" strokeWidth="1.5" />
        <circle cx="-9" cy="-3" r="5.5" fill="#FDA4AF" stroke="#811B2B" strokeWidth="1.5" />
        {/* Butter Yellow Center */}
        <circle cx="0" cy="0" r="4.6" fill="#F5D76E" stroke="#811B2B" strokeWidth="1.5" />
        {/* Center Cross Stitch */}
        <path d="M -1.8 0 L 1.8 0 M 0 -1.8 L 0 1.8" stroke="#811B2B" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* =========================================================================
          STAGE 4: INTERACTIVE DECORATIVE CROCHET BOW (Story Section)
          - Reveals beside Story section as the finishing touch
          - Click/tap to flutter ribbons!
          ========================================================================= */}
      <g
        ref={bowGroupRef}
        filter="url(#motifShadow)"
        className="pointer-events-auto cursor-pointer group"
        onClick={handleBowClick}
        onMouseEnter={() => setActiveTooltip('Tied with love 🎀')}
        onMouseLeave={() => setActiveTooltip(null)}
        role="button"
        tabIndex={0}
        aria-label="Hand-tied Crochet Bow"
        style={{
          transformOrigin: '0 0',
          opacity: 0,
          transition: prefersReducedMotion
            ? 'none'
            : bowBounce
            ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : undefined,
        }}
      >
        {/* Left Bow Loop in Burgundy with Cream Highlight */}
        <path d="M 0 0 C -13 -14, -24 -6, -20 3 C -16 7, -6 3, 0 0" fill="#811B2B" stroke="#641623" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M -3 -1 C -10 -8, -17 -4, -14 1" fill="none" stroke="#FFF5CC" strokeWidth="1" opacity="0.7" strokeLinecap="round" />
        {/* Right Bow Loop in Burgundy with Cream Highlight */}
        <path d="M 0 0 C 13 -14, 24 -6, 20 3 C 16 7, 6 3, 0 0" fill="#811B2B" stroke="#641623" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M 3 -1 C 10 -8, 17 -4, 14 1" fill="none" stroke="#FFF5CC" strokeWidth="1" opacity="0.7" strokeLinecap="round" />
        {/* Left Dangling Ribbon with Loose Yarn End */}
        <path d="M -2 2 C -8 10, -15 16, -12 23" fill="none" stroke="#811B2B" strokeWidth="2.5" strokeLinecap="round" />
        {/* Right Dangling Ribbon with Loose Yarn End */}
        <path d="M 2 2 C 8 9, 14 15, 16 23" fill="none" stroke="#811B2B" strokeWidth="2.5" strokeLinecap="round" />
        {/* Center Knot in Butter Yellow */}
        <circle cx="0" cy="0" r="3.8" fill="#F5D76E" stroke="#641623" strokeWidth="1.4" />
      </g>

      {/* Interactive Tooltip Toast when tapping motifs */}
      {activeTooltip && (
        <foreignObject x={xBase + 12} y={Math.max(60, tooltipPos.y - 45)} width="180" height="40" className="pointer-events-none">
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#FFF5CC] border border-[#641623] shadow-md animate-bounce">
            <span className="font-['Fredoka'] font-bold text-xs text-[#811B2B] whitespace-nowrap">
              {activeTooltip}
            </span>
          </div>
        </foreignObject>
      )}
    </svg>
  );
};
