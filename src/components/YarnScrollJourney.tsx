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
  totalHeight: number;
}

export const YarnScrollJourney: React.FC<YarnScrollJourneyProps> = ({ containerRef }) => {
  // Track container dimensions and measured section offsets dynamically
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: 5300,
  });

  const [offsets, setOffsets] = useState<SectionOffsets>({
    hero: 0,
    categories: 1069,
    bestsellers: 2259,
    story: 2973,
    occasions: 3927,
    reels: 4584,
    totalHeight: 5319,
  });

  useEffect(() => {
    const measure = () => {
      const container = containerRef?.current;
      const w = container?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1280);
      const h = container?.scrollHeight || 5300;

      setDimensions({ width: w, height: h });

      if (container) {
        const getOffset = (id: string, fallback: number) => {
          const el = container.querySelector(`#${id}`) as HTMLElement | null;
          return el ? el.offsetTop : fallback;
        };

        const isMob = w < 768;
        setOffsets({
          hero: getOffset('section-hero', 0),
          categories: getOffset('section-categories', isMob ? 560 : 1069),
          bestsellers: getOffset('section-bestsellers', isMob ? 1002 : 2259),
          story: getOffset('section-story', isMob ? 1530 : 2973),
          occasions: getOffset('section-occasions', isMob ? 2451 : 3927),
          reels: getOffset('section-reels', isMob ? 2961 : 4584),
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

  // Hook into scroll progress with spring physics for natural yarn inertia
  const { scrollYProgress } = useScroll(
    containerRef?.current
      ? { target: containerRef, offset: ['start start', 'end end'] }
      : { offset: ['start start', 'end end'] }
  );

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.0005,
  });

  // Yarn ball spin rotation linked to scroll (rotates 3 full turns as visitor scrolls down)
  const yarnRotation = useTransform(smoothProgress, [0, 1], [0, 1080]);

  const isMobile = dimensions.width < 768;
  const W = dimensions.width;
  const H = Math.max(dimensions.height, offsets.totalHeight, 3200);

  const { pathData, milestones } = useMemo(() => {
    if (isMobile) {
      // Mobile Layout: Path stays anchored to margins and wraps headers in whitespace
      const rightMargin = W - 14;
      const leftMargin = 14;

      // Start at yarn ball top-right
      const y0 = 35;
      const x0 = W - 26;

      // Section 1: Categories Header
      const yCat = offsets.categories + 35;
      // Section 2: Bestsellers Header
      const yBest = offsets.bestsellers + 35;
      // Section 3: Our Story Button / Header
      const yStory = offsets.story + 420;
      // Section 4: Occasions Header
      const yOcc = offsets.occasions + 30;
      // Section 5: Reels Header
      const yReels = offsets.reels + 30;
      // Finish
      const yEnd = H - 30;

      const d = `
        M ${x0} ${y0}
        C ${rightMargin} ${y0 + 100}, ${rightMargin} ${yCat - 80}, ${rightMargin} ${yCat - 40}
        C ${rightMargin} ${yCat - 10}, ${leftMargin + 40} ${yCat - 20}, ${leftMargin + 12} ${yCat}
        C ${leftMargin} ${yCat + 20}, ${leftMargin} ${yBest - 80}, ${leftMargin} ${yBest - 40}
        C ${leftMargin} ${yBest - 10}, ${rightMargin - 40} ${yBest - 20}, ${rightMargin - 12} ${yBest}
        C ${rightMargin} ${yBest + 20}, ${rightMargin} ${yStory - 80}, ${rightMargin} ${yStory - 40}
        C ${rightMargin} ${yStory - 10}, ${leftMargin + 40} ${yStory - 20}, ${leftMargin + 12} ${yStory}
        C ${leftMargin} ${yStory + 20}, ${leftMargin} ${yOcc - 80}, ${leftMargin} ${yOcc - 40}
        C ${leftMargin} ${yOcc - 10}, ${rightMargin - 40} ${yOcc - 20}, ${rightMargin - 12} ${yOcc}
        C ${rightMargin} ${yOcc + 20}, ${rightMargin} ${yReels - 80}, ${rightMargin} ${yReels - 40}
        C ${rightMargin} ${yReels - 10}, ${leftMargin + 40} ${yReels - 20}, ${leftMargin + 12} ${yReels}
        C ${leftMargin} ${yReels + 40}, ${W * 0.5 - 40} ${yEnd - 60}, ${W * 0.5} ${yEnd}
      `;

      return {
        pathData: d,
        milestones: [
          { id: 'm-cat', threshold: 0.16, x: leftMargin + 16, y: yCat, type: 'daisy' as const },
          { id: 'm-best', threshold: 0.32, x: rightMargin - 16, y: yBest, type: 'rose' as const },
          { id: 'm-story', threshold: 0.52, x: leftMargin + 16, y: yStory, type: 'lavender' as const },
          { id: 'm-occ', threshold: 0.72, x: rightMargin - 16, y: yOcc, type: 'buttercup' as const },
          { id: 'm-reels', threshold: 0.86, x: leftMargin + 16, y: yReels, type: 'heart' as const },
        ],
      };
    }

    // Desktop Layout (W >= 768px):
    // Starts at yarn ball, flows strictly through gutters and section header whitespace
    const startX = Math.min(W * 0.90, W - 90);
    const startY = 65;

    // Right Gutter along Hero
    const heroRightX = W - 40;
    const heroBottomY = offsets.categories - 50;

    // Categories Header Loop
    const catHeaderY = offsets.categories + 55;
    const catLoopX = W * 0.35; // Near "shop by category" heading

    // Left Gutter along Category Cards (cards max-w-[1040px], gutter ~120px)
    const catLeftGutterX = Math.max(32, (W - 1060) / 2 - 24);
    const bestHeaderY = offsets.bestsellers + 45;

    // Heart Knot Loop in whitespace above Bestsellers heading
    const heartCenterX = W * 0.50;
    const heartY = bestHeaderY - 15;

    // Right Gutter along Bestsellers Carousel (W - 30 keeps clear of card 5)
    const bestRightGutterX = W - 32;

    // Our Story Section:
    // Continue down right gutter past the collage to offsets.story + 760
    const storyCollageBottomY = offsets.story + 760;
    // Sweep under the collage into the divider area between story and occasions
    const storyDividerY = offsets.story + 860;
    const storyDividerX = W * 0.46;

    // Shop The Occasion Header:
    const occHeaderY = offsets.occasions + 40;
    const occLoopX = W * 0.52;
    // Right gutter alongside Occasion cards (W - 32 keeps clear of occasion cards)
    const occRightGutterX = W - 32;
    const occBottomY = offsets.occasions + 580;

    // Reels & Community Header
    const reelsHeaderY = offsets.reels + 45;
    const reelsLoopX = W * 0.62;

    // Finish into footer wave
    const endX = W * 0.50;
    const endY = H - 45;

    // Form an upright heart knot loop right at Bestsellers header
    const heartLoop = `
      C ${heartCenterX + 90} ${heartY - 65}, ${heartCenterX + 35} ${heartY - 35}, ${heartCenterX + 28} ${heartY}
      C ${heartCenterX + 45} ${heartY - 25}, ${heartCenterX + 20} ${heartY - 45}, ${heartCenterX} ${heartY - 20}
      C ${heartCenterX - 20} ${heartY - 45}, ${heartCenterX - 45} ${heartY - 25}, ${heartCenterX - 28} ${heartY}
      C ${heartCenterX - 35} ${heartY + 25}, ${heartCenterX} ${heartY + 45}, ${heartCenterX} ${heartY + 45}
    `;

    const d = `
      M ${startX} ${startY}
      C ${heroRightX + 15} 250, ${heroRightX} ${heroBottomY - 150}, ${heroRightX} ${heroBottomY}
      C ${heroRightX - 60} ${catHeaderY - 30}, ${catLoopX + 160} ${catHeaderY - 30}, ${catLoopX} ${catHeaderY}
      C ${catLoopX - 120} ${catHeaderY + 30}, ${catLeftGutterX} ${catHeaderY + 180}, ${catLeftGutterX} ${catHeaderY + 400}
      C ${catLeftGutterX} ${offsets.categories + 800}, ${catLeftGutterX + 10} ${bestHeaderY - 160}, ${catLeftGutterX + 50} ${bestHeaderY - 80}
      C ${catLeftGutterX + 150} ${bestHeaderY - 50}, ${heartCenterX - 120} ${heartY - 70}, ${heartCenterX - 60} ${heartY - 40}
      ${heartLoop}
      C ${heartCenterX + 60} ${heartY + 45}, ${bestRightGutterX - 100} ${bestHeaderY + 10}, ${bestRightGutterX} ${bestHeaderY + 30}
      C ${bestRightGutterX} ${bestHeaderY + 140}, ${bestRightGutterX} ${offsets.story + 300}, ${bestRightGutterX} ${storyCollageBottomY}
      C ${bestRightGutterX} ${storyDividerY - 40}, ${storyDividerX + 120} ${storyDividerY - 20}, ${storyDividerX} ${storyDividerY}
      C ${storyDividerX - 120} ${storyDividerY + 20}, ${storyDividerX - 180} ${occHeaderY - 40}, ${occLoopX - 60} ${occHeaderY}
      C ${occLoopX} ${occHeaderY + 10}, ${occLoopX + 80} ${occHeaderY - 15}, ${occLoopX + 120} ${occHeaderY - 15}
      C ${occLoopX + 240} ${occHeaderY - 15}, ${occRightGutterX} ${occHeaderY + 80}, ${occRightGutterX} ${occHeaderY + 220}
      C ${occRightGutterX} ${occBottomY}, ${occRightGutterX} ${reelsHeaderY - 100}, ${occRightGutterX} ${reelsHeaderY - 40}
      C ${occRightGutterX - 30} ${reelsHeaderY + 10}, ${reelsLoopX + 70} ${reelsHeaderY - 20}, ${reelsLoopX} ${reelsHeaderY}
      C ${reelsLoopX - 120} ${reelsHeaderY + 40}, ${endX + 60} ${endY - 120}, ${endX} ${endY}
    `;

    return {
      pathData: d,
      milestones: [
        { id: 'm-cat', threshold: 0.18, x: catLoopX, y: catHeaderY, type: 'daisy' as const },
        { id: 'm-best', threshold: 0.38, x: heartCenterX + 85, y: bestHeaderY + 15, type: 'rose' as const },
        { id: 'm-story', threshold: 0.58, x: storyDividerX, y: storyDividerY, type: 'lavender' as const },
        { id: 'm-occ', threshold: 0.73, x: occLoopX, y: occHeaderY, type: 'buttercup' as const },
        { id: 'm-reels', threshold: 0.88, x: reelsLoopX, y: reelsHeaderY, type: 'heart' as const },
      ],
    };
  }, [W, H, isMobile, offsets]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-10 overflow-hidden">
      {/* 1. Rotating Spinning Yarn Ball at the Start of the Thread in Hero */}
      <motion.div
        style={{
          position: 'absolute',
          top: isMobile ? 24 : 52,
          right: isMobile ? 12 : Math.max(W * 0.08, 40),
          rotate: yarnRotation,
        }}
        className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-md flex items-center justify-center z-20 pointer-events-none select-none"
      >
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
          {/* Base Dusty Rose Ball */}
          <circle cx="32" cy="32" r="28" fill="#DE637E" stroke="#381A1F" strokeWidth="2.5" />
          {/* Main Diagonal Yarn Strands */}
          <path d="M 18,10 C 30,28 42,46 52,50" stroke="#381A1F" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 10,18 C 24,36 36,54 44,58" stroke="#381A1F" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 14,14 C 27,32 39,50 48,54" stroke="#F896AC" strokeWidth="1.8" strokeLinecap="round" />
          {/* Left Wrapping Strands */}
          <path d="M 6,28 C 16,22 24,28 28,38" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
          <path d="M 8,40 C 18,36 24,44 28,52" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
          {/* Right Wrapping Strands */}
          <path d="M 38,6 C 46,14 54,22 58,34" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
          <path d="M 42,16 C 48,24 54,32 56,44" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
          {/* Soft Highlights */}
          <path d="M 10,32 C 18,28 24,32 26,40" stroke="#F896AC" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 40,10 C 46,18 50,26 54,36" stroke="#F896AC" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* 2. Full-Page SVG Canvas for the Progressive Drawing Yarn Thread */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        style={{ width: '100%', height: `${H}px` }}
        fill="none"
      >
        {/* Soft Faint Guide / Embossed Under-Thread */}
        <path
          d={pathData}
          stroke="#DE637E"
          strokeWidth={isMobile ? 2.0 : 2.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.14}
        />

        {/* Dynamic Animated Unraveling Yarn Thread */}
        <motion.path
          d={pathData}
          stroke="#DE637E"
          strokeWidth={isMobile ? 2.6 : 3.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: smoothProgress }}
        />
      </svg>

      {/* 3. Blooming Flower Milestones along the Thread Path */}
      {milestones.map((m) => (
        <BloomingMilestone
          key={m.id}
          milestone={m}
          scrollProgress={smoothProgress}
        />
      ))}
    </div>
  );
};

// Subcomponent for blooming flower milestone
interface BloomingMilestoneProps {
  milestone: {
    id: string;
    threshold: number;
    x: number;
    y: number;
    type: 'daisy' | 'rose' | 'heart' | 'lavender' | 'buttercup';
  };
  scrollProgress: any;
}

const BloomingMilestone: React.FC<BloomingMilestoneProps> = ({ milestone, scrollProgress }) => {
  const { threshold, x, y, type } = milestone;

  // Spring scale from 0 -> 1.25 -> 1.0 when thread arrives at milestone
  const scale = useTransform(
    scrollProgress,
    [threshold - 0.02, threshold, threshold + 0.03],
    [0, 1.25, 1],
    { clamp: true }
  );

  const opacity = useTransform(
    scrollProgress,
    [threshold - 0.025, threshold],
    [0, 1],
    { clamp: true }
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        scale,
        opacity,
        transform: 'translate(-50%, -50%)',
      }}
      className="pointer-events-none select-none drop-shadow-sm z-20"
    >
      {type === 'daisy' && (
        // Sunny Yellow Daisy
        <svg viewBox="0 0 36 36" className="w-8 h-8 sm:w-10 sm:h-10" fill="none">
          <g stroke="#381A1F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="9" r="4.5" fill="#FCD34D" />
            <circle cx="26" cy="14" r="4.5" fill="#FCD34D" />
            <circle cx="25" cy="23" r="4.5" fill="#FCD34D" />
            <circle cx="18" cy="27" r="4.5" fill="#FCD34D" />
            <circle cx="11" cy="23" r="4.5" fill="#FCD34D" />
            <circle cx="10" cy="14" r="4.5" fill="#FCD34D" />
          </g>
          <circle cx="18" cy="18" r="5" fill="#E56B86" stroke="#381A1F" strokeWidth="1.8" />
          <circle cx="18" cy="18" r="2.5" fill="#FAF4ED" />
        </svg>
      )}

      {type === 'rose' && (
        // Dusty Rose Blossom with Leaves
        <svg viewBox="0 0 40 40" className="w-9 h-9 sm:w-11 sm:h-11" fill="none">
          {/* Soft Leaves */}
          <path d="M 12,28 C 4,32 4,22 14,22 Z" fill="#6E8E34" stroke="#381A1F" strokeWidth="1.5" />
          <path d="M 28,28 C 36,32 36,22 26,22 Z" fill="#6E8E34" stroke="#381A1F" strokeWidth="1.5" />
          {/* Rose Petals */}
          <circle cx="20" cy="18" r="12" fill="#E56B86" stroke="#381A1F" strokeWidth="1.8" />
          <path d="M 14,14 C 18,10 24,12 26,16" stroke="#381A1F" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 14,20 C 18,24 24,22 26,18" stroke="#381A1F" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="20" cy="17" r="5" fill="#F896AC" stroke="#381A1F" strokeWidth="1.5" />
        </svg>
      )}

      {type === 'heart' && (
        // Playful Yarn Heart Knot
        <svg viewBox="0 0 32 32" className="w-8 h-8 sm:w-10 sm:h-10" fill="none">
          <path
            d="M 16,28 C 10,22 4,16 4,10 C 4,5.5 7.5,2 12,2 C 14.5,2 15.5,3.5 16,4.5 C 16.5,3.5 17.5,2 20,2 C 24.5,2 28,5.5 28,10 C 28,16 22,22 16,28 Z"
            fill="#E56B86"
            stroke="#381A1F"
            strokeWidth="2.0"
            strokeLinejoin="round"
          />
          <path d="M 12,6 C 14,8 15,11 16,14" stroke="#FAF4ED" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}

      {type === 'lavender' && (
        // Soft Lavender / Lilac Bloom
        <svg viewBox="0 0 36 36" className="w-8 h-8 sm:w-10 sm:h-10" fill="none">
          <g stroke="#381A1F" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="18" cy="8" r="4" fill="#B89FD6" />
            <circle cx="25" cy="15" r="4" fill="#B89FD6" />
            <circle cx="22" cy="24" r="4" fill="#B89FD6" />
            <circle cx="14" cy="24" r="4" fill="#B89FD6" />
            <circle cx="11" cy="15" r="4" fill="#B89FD6" />
          </g>
          <circle cx="18" cy="17" r="4.5" fill="#FDE047" stroke="#381A1F" strokeWidth="1.6" />
        </svg>
      )}

      {type === 'buttercup' && (
        // Golden Buttercup with Stitches
        <svg viewBox="0 0 36 36" className="w-8 h-8 sm:w-10 sm:h-10" fill="none">
          <g stroke="#381A1F" strokeWidth="1.8">
            <circle cx="18" cy="10" r="5" fill="#FFE066" />
            <circle cx="25" cy="18" r="5" fill="#FFE066" />
            <circle cx="21" cy="26" r="5" fill="#FFE066" />
            <circle cx="15" cy="26" r="5" fill="#FFE066" />
            <circle cx="11" cy="18" r="5" fill="#FFE066" />
          </g>
          <circle cx="18" cy="19" r="4" fill="#DE637E" stroke="#381A1F" strokeWidth="1.6" />
          <circle cx="18" cy="19" r="1.5" fill="#FAF4ED" />
        </svg>
      )}
    </motion.div>
  );
};
