/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, ArrowRight, Flower2, RotateCcw } from 'lucide-react';

interface CrochetBouquetIntroProps {
  onComplete: () => void;
  isManualReplay?: boolean;
}

// Real handcrafted flower assets with authentic yarn textures
const REAL_BLOOMS = [
  {
    id: 'pink-rose',
    name: 'Blush Crochet Rose',
    image: '/bloom/bouquet-pink-dawn.jpg',
    tag: 'Hand-knitted Rose',
    accentBg: '#F5C4D5',
    x: -80,
    y: -40,
    rotate: -12,
    delay: 0.1,
  },
  {
    id: 'sunflower',
    name: 'Sunbeam Sunflower',
    image: '/bloom/bouquet-summer-tulips.jpg',
    tag: 'Cotton Sunflower',
    accentBg: '#F5DD91',
    x: 80,
    y: -35,
    rotate: 14,
    delay: 0.35,
  },
  {
    id: 'white-daisy',
    name: 'Marshmallow Daisy',
    image: '/bloom/bouquet-gentle-white.jpg',
    tag: 'Milk Cotton Daisy',
    accentBg: '#FFFEF8',
    x: -40,
    y: -95,
    rotate: -6,
    delay: 0.6,
  },
  {
    id: 'royal-blue',
    name: 'Cornflower Lily',
    image: '/bloom/bouquet-royal-blue.jpg',
    tag: 'Pastel Lily Stem',
    accentBg: '#BBDDEB',
    x: 45,
    y: -90,
    rotate: 8,
    delay: 0.85,
  },
  {
    id: 'tulip',
    name: 'Surat Sunset Tulip',
    image: '/products/tulips.jpg',
    tag: 'Everlasting Tulip',
    accentBg: '#F4D2BB',
    x: 0,
    y: -55,
    rotate: 0,
    delay: 1.1,
  },
];

export function CrochetBouquetIntro({ onComplete, isManualReplay = false }: CrochetBouquetIntroProps) {
  // Scene: 1 -> 2 -> 3 -> 4
  const [scene, setScene] = useState<number>(1);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    // Respect reduced motion unless triggered manually
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !isManualReplay) {
      onComplete();
      return;
    }

    // Sequence schedule:
    // Scene 1: 0 - 1.5s (The Beginning: Sprout & "Something lovely is blooming...")
    // Scene 2: 1.5 - 4.0s (Flowers Come Alive: Real blooms pop with spring bounce)
    // Scene 3: 4.0 - 6.5s (Bouquet Assembly: Flowers gather, pastel wrapping & ribbon tie)
    // Scene 4: 6.5 - 9.0s (Brand Reveal: Finished bouquet floats, logo & taglines)
    const t1 = setTimeout(() => setScene(2), 1500);
    const t2 = setTimeout(() => setScene(3), 4000);
    const t3 = setTimeout(() => setScene(4), 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isManualReplay]);

  const handleFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  if (isExiting) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFF5CC] text-[#811B2B] overflow-hidden select-none"
      >
        {/* Ambient Warm Atmosphere & Floating Yarn Petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle Gingham Ribbons at Top & Bottom */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gingham-peach opacity-60" />
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-gingham-peach opacity-60" />

          {/* Floating Petals and Yarn Dust */}
          {[
            { top: '15%', left: '10%', size: 'w-4 h-4', color: '#F5C4D5', dur: 6 },
            { top: '25%', right: '12%', size: 'w-5 h-5', color: '#F5DD91', dur: 7 },
            { top: '70%', left: '8%', size: 'w-4 h-4', color: '#C5E7D4', dur: 8 },
            { top: '75%', right: '15%', size: 'w-6 h-6', color: '#BBDDEB', dur: 6.5 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 0, rotate: 0 }}
              animate={{ y: [-15, 15, -15], rotate: [0, 25, -20, 0] }}
              transition={{ duration: item.dur, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute ${item.size} rounded-full opacity-60 pointer-events-none shadow-sm`}
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
                backgroundColor: item.color,
                border: '1.5px dashed rgba(129, 27, 43, 0.3)',
              }}
            />
          ))}
        </div>

        {/* Top Control Bar: Brand Capsule & Skip Button */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#811B2B]/15 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#811B2B] animate-ping" />
            <span className="text-xs font-bold tracking-wide uppercase text-[#811B2B] font-rounded">
              Knotsnco Signature Experience
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] text-xs font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <span>Skip into Store</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Central Stage Container */}
        <div className="relative w-full max-w-3xl h-[560px] flex flex-col items-center justify-center px-4">
          
          {/* ==============================================================
              SCENE 1: The Beginning — Sprouting Stem & Handwritten Text
             ============================================================== */}
          {scene === 1 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center text-center"
            >
              {/* Sprouting single crochet stem with yarn leaves and bud */}
              <div className="relative w-44 h-60 mb-6 flex items-center justify-center">
                <svg viewBox="0 0 100 160" className="w-full h-full overflow-visible">
                  {/* Textured Green Stem growing upward */}
                  <motion.path
                    d="M 50,160 Q 46,100 50,45"
                    fill="none"
                    stroke="#4A7C59"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="160"
                    initial={{ strokeDashoffset: 160 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                  />
                  {/* Left Leaf */}
                  <motion.path
                    d="M 49,115 C 25,105 28,88 48,100"
                    fill="#68A377"
                    stroke="#4A7C59"
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
                  />
                  {/* Right Leaf */}
                  <motion.path
                    d="M 51,85 C 75,75 72,58 52,70"
                    fill="#68A377"
                    stroke="#4A7C59"
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
                  />
                </svg>

                {/* Soft Bud with real crochet texture crop */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.25, 1], opacity: 1 }}
                  transition={{ delay: 0.95, duration: 0.6, type: 'spring', bounce: 0.5 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full overflow-hidden border-2 border-[#811B2B] shadow-lg bg-[#F5C4D5]"
                >
                  <img
                    src="/bloom/bouquet-pink-dawn.jpg"
                    alt="Baby Crochet Rose Bud"
                    className="w-full h-full object-cover scale-150"
                  />
                </motion.div>
              </div>

              {/* Handwritten Heading */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-handwriting text-3xl sm:text-5xl text-[#811B2B] font-bold"
              >
                Something lovely is blooming...
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="text-xs sm:text-sm font-bold text-[#811B2B]/75 uppercase tracking-widest mt-2 font-rounded"
              >
                Stitched petal by petal by our Dadis in Surat ✿
              </motion.p>
            </motion.div>
          )}

          {/* ==============================================================
              SCENE 2: Flowers Come Alive — Real Handmade Crochet Blooms Pop
             ============================================================== */}
          {scene === 2 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full flex flex-col items-center justify-center text-center"
            >
              {/* Central Flower Assembly Canvas */}
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
                
                {/* Branching Stems SVG */}
                <svg viewBox="0 0 300 280" className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                  {/* Stem Fan from base (150, 270) */}
                  {[
                    { d: 'M 150,270 Q 120,180 70,120', delay: 0 },
                    { d: 'M 150,270 Q 180,180 230,125', delay: 0.1 },
                    { d: 'M 150,270 Q 130,160 110,65', delay: 0.2 },
                    { d: 'M 150,270 Q 170,160 190,70', delay: 0.3 },
                    { d: 'M 150,270 Q 150,150 150,95', delay: 0.4 },
                  ].map((stem, i) => (
                    <motion.path
                      key={i}
                      d={stem.d}
                      fill="none"
                      stroke="#4A7C59"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      strokeDasharray="250"
                      initial={{ strokeDashoffset: 250 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 0.8, delay: stem.delay, ease: 'easeOut' }}
                    />
                  ))}
                </svg>

                {/* 5 Distinctive Real Crochet Blooms popping into view */}
                {REAL_BLOOMS.map((bloom) => (
                  <motion.div
                    key={bloom.id}
                    initial={{ scale: 0, opacity: 0, rotate: bloom.rotate - 20 }}
                    animate={{ scale: [0, 1.18, 1], opacity: 1, rotate: bloom.rotate }}
                    transition={{
                      delay: bloom.delay,
                      duration: 0.65,
                      type: 'spring',
                      stiffness: 260,
                      damping: 18,
                    }}
                    style={{
                      transform: `translate(${bloom.x}px, ${bloom.y}px)`,
                    }}
                    className="absolute w-20 h-20 sm:w-24 sm:h-24 group cursor-pointer"
                  >
                    {/* Flower Card with Real Crochet Texture and Crochet Stitch Border */}
                    <div
                      className="w-full h-full rounded-full overflow-hidden border-3 border-[#811B2B] shadow-xl p-1 relative transition-transform group-hover:scale-110"
                      style={{ backgroundColor: bloom.accentBg }}
                    >
                      <img
                        src={bloom.image}
                        alt={bloom.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                      {/* Gentle Shimmer Accent */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/25 to-white/0 pointer-events-none" />
                    </div>

                    {/* Cute floating label tag */}
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: bloom.delay + 0.3 }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FFFEF8] text-[#811B2B] text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-[#811B2B]/30 shadow-xs whitespace-nowrap"
                    >
                      {bloom.tag}
                    </motion.span>
                  </motion.div>
                ))}
              </div>

              {/* Scene Caption */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="mt-2"
              >
                <p className="font-editorial text-2xl sm:text-4xl font-extrabold text-[#811B2B]">
                  Handmade blooms coming to life
                </p>
                <p className="font-handwriting text-xl sm:text-2xl text-[#811B2B]/85 mt-1 font-bold">
                  stitched petal by petal with soft milk cotton yarn ✿
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* ==============================================================
              SCENE 3: Bouquet Assembly — Origami Wrapping Folds & Ribbon Ties
             ============================================================== */}
          {scene === 3 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full flex flex-col items-center justify-center text-center"
            >
              {/* Assembled Bouquet Visual */}
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
                
                {/* Floating Heart & Sparkle Emitters */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], y: -45, scale: [0.5, 1.2, 0.8] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute top-2 left-8 text-pink-500 z-30"
                >
                  <Heart className="w-6 h-6 fill-current" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], y: -40, scale: [0.5, 1.2, 0.8] }}
                  transition={{ duration: 2.0, repeat: Infinity, delay: 0.4 }}
                  className="absolute top-8 right-6 text-amber-500 z-30"
                >
                  <Sparkles className="w-6 h-6 fill-current" />
                </motion.div>

                {/* The Assembled Floral Head: Real Photo Cluster */}
                <motion.div
                  initial={{ scale: 0.85, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ duration: 0.8, type: 'spring', damping: 18 }}
                  className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-[#811B2B] shadow-2xl bg-[#FFF5CC] z-10"
                >
                  <img
                    src="/bloom/bouquet-pink-dawn.jpg"
                    alt="Knotsnco Bouquet Gathering"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#811B2B]/20 via-transparent to-transparent pointer-events-none" />
                </motion.div>

                {/* Origami Pastel Wrapping Paper Layers */}
                <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full overflow-visible z-20 pointer-events-none">
                  {/* Left Folding Flap */}
                  <motion.polygon
                    points="60,130 150,290 120,130"
                    fill="#F5C4D5"
                    stroke="#811B2B"
                    strokeWidth="3"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    style={{ transformOrigin: '150px 290px' }}
                  />

                  {/* Right Folding Flap */}
                  <motion.polygon
                    points="240,130 150,290 180,130"
                    fill="#F4D2BB"
                    stroke="#811B2B"
                    strokeWidth="3"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '150px 290px' }}
                  />

                  {/* Front Wrapping Cone */}
                  <motion.polygon
                    points="85,140 150,290 215,140"
                    fill="#FFF5CC"
                    stroke="#811B2B"
                    strokeWidth="2.5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.95, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  />

                  {/* Deep Burgundy Satin Ribbon Band around waist */}
                  <motion.path
                    d="M 105,210 Q 150,225 195,210"
                    fill="none"
                    stroke="#811B2B"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                  />

                  {/* Animated Ribbon Bow Ties Itself */}
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ delay: 1.0, duration: 0.65, type: 'spring' }}
                    transform="translate(150, 218)"
                  >
                    {/* Left Loop */}
                    <path
                      d="M 0,0 C -30,-30 -50,10 -8,0"
                      fill="#811B2B"
                      stroke="#5C0F19"
                      strokeWidth="2.5"
                    />
                    {/* Right Loop */}
                    <path
                      d="M 0,0 C 30,-30 50,10 8,0"
                      fill="#811B2B"
                      stroke="#5C0F19"
                      strokeWidth="2.5"
                    />
                    {/* Ribbon Tails */}
                    <path
                      d="M -4,5 Q -20,35 -32,55 Q -15,40 0,10"
                      fill="#811B2B"
                      stroke="#5C0F19"
                      strokeWidth="2"
                    />
                    <path
                      d="M 4,5 Q 20,35 32,55 Q 15,40 0,10"
                      fill="#811B2B"
                      stroke="#5C0F19"
                      strokeWidth="2"
                    />
                    {/* Gold Knot center */}
                    <circle cx="0" cy="0" r="8" fill="#F5DD91" stroke="#811B2B" strokeWidth="2" />
                  </motion.g>
                </svg>
              </div>

              {/* Caption */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="mt-2"
              >
                <p className="font-editorial text-2xl sm:text-4xl font-extrabold text-[#811B2B]">
                  Wrapped with care & tied with a bow
                </p>
                <p className="font-handwriting text-xl sm:text-2xl text-[#811B2B]/85 mt-1 font-bold">
                  a little crochet, a whole lot of love ♡
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* ==============================================================
              SCENE 4: Brand Reveal — Finished Bouquet Floats, Knotsnco Logo
             ============================================================== */}
          {scene === 4 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-12 w-full"
            >
              {/* Finished Bouquet with gentle floating physics */}
              <motion.div
                initial={{ scale: 0.85, x: 20 }}
                animate={{
                  scale: 1,
                  x: 0,
                  y: [0, -10, 0],
                  rotate: [0, 1.5, -1.5, 0],
                }}
                transition={{
                  scale: { duration: 0.6 },
                  x: { duration: 0.6 },
                  y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="relative w-56 h-64 sm:w-64 sm:h-72 shrink-0 drop-shadow-2xl"
              >
                <div className="w-full h-full rounded-3xl overflow-hidden border-3 border-[#811B2B] shadow-2xl bg-[#FFFEF8]">
                  <img
                    src="/bloom/hero-sky-bouquet.jpg"
                    alt="Knotsnco Everlasting Bouquet"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Cute Sticker Tag */}
                <div className="absolute -bottom-3 -right-3 bg-[#F5DD91] text-[#811B2B] text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg border-2 border-[#811B2B] rotate-3 font-rounded">
                  Made to stay ✿
                </div>
              </motion.div>

              {/* Official Brand Logo, Mascot & Grand Entrance */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="flex flex-col items-center md:items-start text-center md:text-left max-w-md"
              >
                {/* Official Knotsnco Logo with Mascot */}
                <div className="h-16 sm:h-20 mb-3">
                  <img
                    src="/logo-knotsnco.png"
                    alt="Knotsnco"
                    className="h-full w-auto object-contain filter contrast-105"
                  />
                </div>

                <h2 className="font-editorial text-3xl sm:text-5xl font-black text-[#811B2B] leading-tight tracking-tight">
                  Handmade Happiness.
                </h2>
                
                <p className="font-handwriting text-2xl sm:text-3xl text-[#811B2B] font-bold mt-1">
                  Little yarn. Big stories.
                </p>
                
                <p className="text-xs sm:text-sm text-[#811B2B]/85 mt-2 font-rounded leading-relaxed">
                  Everlasting crochet gifting, accessories & flowers crafted stitch by stitch with combed cotton yarn by our Dadis in Surat.
                </p>

                {/* Eye-catching Primary Entrance Button */}
                <motion.button
                  onClick={handleFinish}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="mt-6 px-8 py-3.5 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] font-bold text-xs sm:text-sm tracking-widest uppercase transition-all shadow-xl hover:shadow-2xl flex items-center gap-2.5 group"
                >
                  <Flower2 className="w-4 h-4 text-[#F5DD91] animate-spin" style={{ animationDuration: '8s' }} />
                  <span>STEP INSIDE THE WORLD</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}

        </div>

        {/* Scene Progress Dots Indicator */}
        <div className="absolute bottom-6 flex items-center gap-2 z-30">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              onClick={() => setScene(step)}
              className={`h-2 rounded-full transition-all duration-300 ${
                scene === step ? 'w-8 bg-[#811B2B]' : 'w-2 bg-[#811B2B]/30 hover:bg-[#811B2B]/60'
              }`}
              title={`Jump to Scene ${step}`}
            />
          ))}
        </div>

      </motion.div>
    </AnimatePresence>
  );
}

export default CrochetBouquetIntro;
