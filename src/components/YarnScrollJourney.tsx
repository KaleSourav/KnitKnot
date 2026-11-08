import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

interface YarnScrollJourneyProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

interface SectionOffsets {
  hero: number;
  categories: number;
  bestsellers: number;
  story: number;
  occasions: number;
  reels: number;
  climax: number;
  bowTargetX: number;
  bowTargetY: number;
  totalHeight: number;
}

export const YarnScrollJourney: React.FC<YarnScrollJourneyProps> = ({ containerRef }) => {
  // Track container dimensions and measured section offsets dynamically
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: 5800,
  });

  const [offsets, setOffsets] = useState<SectionOffsets>({
    hero: 0,
    categories: 1069,
    bestsellers: 2259,
    story: 2973,
    occasions: 3927,
    reels: 4584,
    climax: 5319,
    bowTargetX: 640,
    bowTargetY: 5750,
    totalHeight: 6100,
  });

  useEffect(() => {
    const measure = () => {
      const container = containerRef?.current;
      const w = container?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1280);
      const h = container?.scrollHeight || 5800;

      setDimensions({ width: w, height: h });

      if (container) {
        const getOffset = (id: string, fallback: number) => {
          const el = container.querySelector(`#${id}`) as HTMLElement | null;
          return el ? el.offsetTop : fallback;
        };

        const isMob = w < 768;
        const climaxTop = getOffset('section-bouquet-climax', isMob ? 3500 : 5319);

        // Sub-pixel dynamic anchor lookup for the bouquet bow knot
        let bX = w * 0.5;
        let bY = climaxTop + (isMob ? 385 : 445);

        const anchor = container.querySelector('#bouquet-bow-anchor') as HTMLElement | null;
        if (anchor) {
          const cRect = container.getBoundingClientRect();
          const aRect = anchor.getBoundingClientRect();
          bX = aRect.left - cRect.left + aRect.width / 2;
          bY = aRect.top - cRect.top + aRect.height / 2;
        }

        setOffsets({
          hero: getOffset('section-hero', 0),
          categories: getOffset('section-categories', isMob ? 560 : 1069),
          bestsellers: getOffset('section-bestsellers', isMob ? 1002 : 2259),
          story: getOffset('section-story', isMob ? 1530 : 2973),
          occasions: getOffset('section-occasions', isMob ? 2451 : 3927),
          reels: getOffset('section-reels', isMob ? 2961 : 4584),
          climax: climaxTop,
          bowTargetX: bX,
          bowTargetY: bY,
          totalHeight: h,
        });
      }
    };

    measure();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef?.current) {
      resizeObserver = new ResizeObserver(() => measure());
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', measure);
    const t1 = setTimeout(measure, 400);
    const t2 = setTimeout(measure, 1500);

    return () => {
      window.removeEventListener('resize', measure);
      resizeObserver?.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [containerRef]);

  // Hook into scroll progress with spring physics
  const { scrollYProgress } = useScroll(
    containerRef?.current
      ? { target: containerRef, offset: ['start start', 'end end'] }
      : { offset: ['start start', 'end end'] }
  );

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.0005,
  });

  // Yarn ball spin rotations linked to scroll (left turns clockwise, right turns counter-clockwise)
  const yarnRotationLeft = useTransform(smoothProgress, [0, 1], [0, 1080]);
  const yarnRotationRight = useTransform(smoothProgress, [0, 1], [0, -1080]);

  const isMobile = dimensions.width < 768;
  const W = dimensions.width;
  const H = Math.max(dimensions.height, offsets.totalHeight, 3500);

  // Generate the dual background paths: Left Yarn & Right Yarn converging cleanly into the Bouquet
  const { leftPath, rightPath, sideAccents } = useMemo(() => {
    // Left & Right Gutters (strictly outside content cards to preserve clean readability)
    const leftMargin = isMobile ? 12 : Math.max(30, (W - 1280) / 2 + 25);
    const rightMargin = isMobile ? W - 12 : Math.min(W - 30, W - ((W - 1280) / 2 + 25));

    const startY = isMobile ? 32 : 55;

    // Target bow coordinate measured dynamically
    const targetX = offsets.bowTargetX;
    const targetY = offsets.bowTargetY;

    // Waypoints for Left Yarn Strand:
    // Stays in left gutter down to targetY - 50, then sweeps horizontally into the bow knot
    const l0 = { x: leftMargin, y: startY };
    const l1 = { x: leftMargin + (isMobile ? 4 : 8), y: offsets.categories * 0.5 };
    const l2 = { x: leftMargin, y: offsets.categories + 100 };
    const l3 = { x: leftMargin + (isMobile ? 5 : 10), y: offsets.bestsellers + 150 };
    const l4 = { x: leftMargin, y: offsets.story + 200 };
    const l5 = { x: leftMargin + (isMobile ? 4 : 8), y: offsets.occasions + 150 };
    const l6 = { x: leftMargin, y: offsets.reels + 150 };
    const l7 = { x: leftMargin, y: targetY - 45 };
    const lEnd = { x: targetX - (isMobile ? 14 : 20), y: targetY };

    const leftD = `
      M ${l0.x} ${l0.y}
      C ${l0.x} ${l0.y + 150}, ${l1.x} ${l1.y - 150}, ${l1.x} ${l1.y}
      C ${l1.x} ${l1.y + 150}, ${l2.x} ${l2.y - 150}, ${l2.x} ${l2.y}
      C ${l2.x} ${l2.y + 150}, ${l3.x} ${l3.y - 150}, ${l3.x} ${l3.y}
      C ${l3.x} ${l3.y + 150}, ${l4.x} ${l4.y - 150}, ${l4.x} ${l4.y}
      C ${l4.x} ${l4.y + 150}, ${l5.x} ${l5.y - 150}, ${l5.x} ${l5.y}
      C ${l5.x} ${l5.y + 150}, ${l6.x} ${l6.y - 150}, ${l6.x} ${l6.y}
      C ${l6.x} ${l6.y + 120}, ${l7.x} ${l7.y - 60}, ${l7.x} ${l7.y}
      C ${l7.x + 40} ${l7.y + 10}, ${lEnd.x - 50} ${lEnd.y}, ${lEnd.x} ${lEnd.y}
    `;

    // Waypoints for Right Yarn Strand:
    // Stays in right gutter down to targetY - 50, then sweeps horizontally into the bow knot
    const r0 = { x: rightMargin, y: startY };
    const r1 = { x: rightMargin - (isMobile ? 4 : 8), y: offsets.categories * 0.5 };
    const r2 = { x: rightMargin, y: offsets.categories + 100 };
    const r3 = { x: rightMargin - (isMobile ? 5 : 10), y: offsets.bestsellers + 150 };
    const r4 = { x: rightMargin, y: offsets.story + 200 };
    const r5 = { x: rightMargin - (isMobile ? 4 : 8), y: offsets.occasions + 150 };
    const r6 = { x: rightMargin, y: offsets.reels + 150 };
    const r7 = { x: rightMargin, y: targetY - 45 };
    const rEnd = { x: targetX + (isMobile ? 14 : 20), y: targetY };

    const rightD = `
      M ${r0.x} ${r0.y}
      C ${r0.x} ${r0.y + 150}, ${r1.x} ${r1.y - 150}, ${r1.x} ${r1.y}
      C ${r1.x} ${r1.y + 150}, ${r2.x} ${r2.y - 150}, ${r2.x} ${r2.y}
      C ${r2.x} ${r2.y + 150}, ${r3.x} ${r3.y - 150}, ${r3.x} ${r3.y}
      C ${r3.x} ${r3.y + 150}, ${r4.x} ${r4.y - 150}, ${r4.x} ${r4.y}
      C ${r4.x} ${r4.y + 150}, ${r5.x} ${r5.y - 150}, ${r5.x} ${r5.y}
      C ${r5.x} ${r5.y + 150}, ${r6.x} ${r6.y - 150}, ${r6.x} ${r6.y}
      C ${r6.x} ${r6.y + 120}, ${r7.x} ${r7.y - 60}, ${r7.x} ${r7.y}
      C ${r7.x - 40} ${r7.y + 10}, ${rEnd.x + 50} ${rEnd.y}, ${rEnd.x} ${rEnd.y}
    `;

    // Subtle decorative crochet leaf accents along margins that bloom as you scroll
    const accents = [
      { id: 'left-1', side: 'left', x: leftMargin + 8, y: l2.y, threshold: 0.20 },
      { id: 'right-1', side: 'right', x: rightMargin - 8, y: r2.y, threshold: 0.22 },
      { id: 'left-2', side: 'left', x: leftMargin + 8, y: l4.y, threshold: 0.46 },
      { id: 'right-2', side: 'right', x: rightMargin - 8, y: r4.y, threshold: 0.48 },
      { id: 'left-3', side: 'left', x: leftMargin + 8, y: l6.y, threshold: 0.70 },
      { id: 'right-3', side: 'right', x: rightMargin - 8, y: r6.y, threshold: 0.72 },
    ];

    return {
      leftPath: leftD,
      rightPath: rightD,
      sideAccents: accents,
    };
  }, [W, H, isMobile, offsets]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-10 overflow-hidden">
      {/* =========================================================================
          1. TOP LEFT YARN BALL (Dusty Rose)
          ========================================================================= */}
      <motion.div
        style={{
          position: 'absolute',
          top: isMobile ? 22 : 46,
          left: isMobile ? 8 : Math.max(W * 0.03, 24),
          rotate: yarnRotationLeft,
        }}
        className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-md flex items-center justify-center z-20 pointer-events-none select-none"
      >
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
          <circle cx="32" cy="32" r="28" fill="#DE637E" stroke="#381A1F" strokeWidth="2.5" />
          <path d="M 18,10 C 30,28 42,46 52,50" stroke="#381A1F" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 10,18 C 24,36 36,54 44,58" stroke="#381A1F" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 14,14 C 27,32 39,50 48,54" stroke="#F896AC" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 6,28 C 16,22 24,28 28,38" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
          <path d="M 8,40 C 18,36 24,44 28,52" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
          <path d="M 38,6 C 46,14 54,22 58,34" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
          <path d="M 42,16 C 48,24 54,32 56,44" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
          <path d="M 10,32 C 18,28 24,32 26,40" stroke="#F896AC" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 40,10 C 46,18 50,26 54,36" stroke="#F896AC" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* =========================================================================
          2. TOP RIGHT YARN BALL (Soft Coral / Blush Rose)
          ========================================================================= */}
      <motion.div
        style={{
          position: 'absolute',
          top: isMobile ? 22 : 46,
          right: isMobile ? 8 : Math.max(W * 0.03, 24),
          rotate: yarnRotationRight,
        }}
        className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-md flex items-center justify-center z-20 pointer-events-none select-none"
      >
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
          <circle cx="32" cy="32" r="28" fill="#E88299" stroke="#381A1F" strokeWidth="2.5" />
          <path d="M 46,10 C 34,28 22,46 12,50" stroke="#381A1F" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 54,18 C 40,36 28,54 20,58" stroke="#381A1F" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 50,14 C 37,32 25,50 16,54" stroke="#FBCFE8" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 58,28 C 48,22 40,28 36,38" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
          <path d="M 56,40 C 46,36 40,44 36,52" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
          <path d="M 26,6 C 18,14 10,22 6,34" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
          <path d="M 22,16 C 16,24 10,32 8,44" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
          <path d="M 54,32 C 46,28 40,32 38,40" stroke="#FBCFE8" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 24,10 C 18,18 14,26 10,36" stroke="#FBCFE8" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* =========================================================================
          3. FULL-PAGE SVG CANVAS: DUAL LEFT & RIGHT YARN THREADS
          ========================================================================= */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        style={{ width: '100%', height: `${H}px` }}
        fill="none"
      >
        {/* Soft Faint Guides / Embossed Shadow Threads */}
        <path
          d={leftPath}
          stroke="#DE637E"
          strokeWidth={isMobile ? 1.8 : 2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.12}
        />
        <path
          d={rightPath}
          stroke="#E88299"
          strokeWidth={isMobile ? 1.8 : 2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.12}
        />

        {/* Dynamic Progressive Left Yarn Strand */}
        <motion.path
          d={leftPath}
          stroke="#DE637E"
          strokeWidth={isMobile ? 2.4 : 3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: smoothProgress }}
        />

        {/* Dynamic Progressive Right Yarn Strand */}
        <motion.path
          d={rightPath}
          stroke="#E88299"
          strokeWidth={isMobile ? 2.4 : 3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: smoothProgress }}
        />
      </svg>

      {/* =========================================================================
          4. SUBTLE CROCHET LEAF STITCH ACCENTS ALONG MARGINS
          ========================================================================= */}
      {sideAccents.map((acc) => (
        <SideLeafAccent key={acc.id} accent={acc} scrollProgress={smoothProgress} />
      ))}
    </div>
  );
};

// Subcomponent for delicate leaf stitches unfurling in the margins
interface SideLeafAccentProps {
  accent: {
    id: string;
    side: string;
    x: number;
    y: number;
    threshold: number;
  };
  scrollProgress: any;
}

const SideLeafAccent: React.FC<SideLeafAccentProps> = ({ accent, scrollProgress }) => {
  const { side, x, y, threshold } = accent;

  const scale = useTransform(
    scrollProgress,
    [threshold - 0.02, threshold, threshold + 0.02],
    [0, 1.2, 1],
    { clamp: true }
  );

  const opacity = useTransform(
    scrollProgress,
    [threshold - 0.025, threshold],
    [0, 1],
    { clamp: true }
  );

  const isLeft = side === 'left';

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        scale,
        opacity,
        transform: `translate(-50%, -50%) ${isLeft ? 'rotate(-25deg)' : 'rotate(25deg)'}`,
      }}
      className="pointer-events-none select-none z-10"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
        <path
          d={isLeft ? 'M 18,18 C 10,18 4,12 4,4 C 12,4 18,10 18,18 Z' : 'M 6,18 C 14,18 20,12 20,4 C 12,4 6,10 6,18 Z'}
          fill="#6E8E34"
          stroke="#381A1F"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d={isLeft ? 'M 6,6 C 10,10 14,14 16,16' : 'M 18,6 C 14,10 10,14 8,16'}
          stroke="#FAF4ED"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};
