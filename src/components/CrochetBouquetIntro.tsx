/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Knotsnco — Cinematic Opening Experience
 * A single, seamless, photographic brand reveal. No scenes. No SVG cartoons.
 * Just real product beauty, fluid motion, and an emotional brand entrance.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CrochetBouquetIntroProps {
  onComplete: () => void;
  isManualReplay?: boolean;
}

// Floating polaroid cards — real product images drifting in from all directions
const POLAROIDS = [
  {
    id: 'p1',
    src: '/bloom/bouquet-pink-dawn.jpg',
    alt: 'Pink Crochet Bouquet',
    label: 'Hand-knitted Rose',
    accent: '#F5C4D5',
    // start pos (off-screen), end pos (settled)
    from: { x: -420, y: -180, rotate: -22, scale: 0.6 },
    to:   { x: -310, y: -90,  rotate: -14, scale: 1 },
    delay: 0.0,
  },
  {
    id: 'p2',
    src: '/bloom/bouquet-summer-tulips.jpg',
    alt: 'Summer Tulips',
    label: 'Everlasting Tulip',
    accent: '#F5DD91',
    from: { x: 440,  y: -200, rotate: 18,  scale: 0.6 },
    to:   { x: 300,  y: -110, rotate: 12,  scale: 1 },
    delay: 0.18,
  },
  {
    id: 'p3',
    src: '/bloom/bouquet-gentle-white.jpg',
    alt: 'White Daisy Bouquet',
    label: 'Milk Cotton Daisy',
    accent: '#C5E7D4',
    from: { x: -360, y: 280,  rotate: 14,  scale: 0.6 },
    to:   { x: -270, y: 150,  rotate: 8,   scale: 1 },
    delay: 0.32,
  },
  {
    id: 'p4',
    src: '/bloom/bouquet-royal-blue.jpg',
    alt: 'Royal Blue Bouquet',
    label: 'Cornflower Lily',
    accent: '#BBDDEB',
    from: { x: 400,  y: 300,  rotate: -16, scale: 0.6 },
    to:   { x: 290,  y: 160,  rotate: -10, scale: 1 },
    delay: 0.46,
  },
  {
    id: 'p5',
    src: '/products/tulips.jpg',
    alt: 'Crochet Tulips',
    label: 'Surat Sunset Tulip',
    accent: '#F4D2BB',
    from: { x: 0,    y: -360, rotate: -6,  scale: 0.6 },
    to:   { x: 30,   y: -220, rotate: 4,   scale: 1 },
    delay: 0.6,
  },
];

// Tiny floating ambient particles (yarn dust / hearts)
const PARTICLES = [
  { id: 'a1', emoji: '✿', x: '12%',  y: '18%', size: 18, dur: 6.0, delay: 0.8 },
  { id: 'a2', emoji: '♡', x: '82%',  y: '15%', size: 16, dur: 7.2, delay: 1.2 },
  { id: 'a3', emoji: '✦', x: '8%',   y: '72%', size: 14, dur: 5.8, delay: 1.5 },
  { id: 'a4', emoji: '✿', x: '88%',  y: '68%', size: 20, dur: 6.5, delay: 1.0 },
  { id: 'a5', emoji: '♡', x: '50%',  y: '10%', size: 12, dur: 8.0, delay: 1.8 },
  { id: 'a6', emoji: '✦', x: '22%',  y: '85%', size: 15, dur: 6.8, delay: 0.6 },
  { id: 'a7', emoji: '✿', x: '75%',  y: '80%', size: 13, dur: 7.5, delay: 2.0 },
];

export function CrochetBouquetIntro({ onComplete, isManualReplay = false }: CrochetBouquetIntroProps) {
  const [phase, setPhase] = useState<'polaroids' | 'reveal' | 'exiting'>('polaroids');
  const [showCTA, setShowCTA] = useState(false);

  const handleFinish = useCallback(() => {
    setPhase('exiting');
    setTimeout(() => onComplete(), 700);
  }, [onComplete]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !isManualReplay) {
      onComplete();
      return;
    }

    // Phase 1 — polaroids float in for 1.6s, then we cross-fade into brand reveal
    const t1 = setTimeout(() => setPhase('reveal'), 1800);
    // After reveal appears, show CTA button after another 1.4s
    const t2 = setTimeout(() => setShowCTA(true), 3200);
    // Auto-complete after 5.5s total
    const t3 = setTimeout(() => handleFinish(), 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isManualReplay, handleFinish]);

  return (
    <AnimatePresence>
      <motion.div
        key="knotsnco-intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'exiting' ? 0 : 1 }}
        transition={{ duration: phase === 'exiting' ? 0.65 : 0.4, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #FFFEF8 0%, #FFF5CC 55%, #F5E8B0 100%)' }}
      >
        {/* ── AMBIENT PARTICLES ──────────────────────────────────────── */}
        {PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.55, 0.35, 0.55],
              y: [-12, 12, -12],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              opacity: { duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay },
              y:       { duration: p.dur * 0.9, repeat: Infinity, ease: 'easeInOut', delay: p.delay },
              scale:   { duration: p.dur * 1.1, repeat: Infinity, ease: 'easeInOut', delay: p.delay },
            }}
            className="absolute pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
              fontSize: p.size,
              color: '#811B2B',
            }}
          >
            {p.emoji}
          </motion.span>
        ))}

        {/* ── SKIP BUTTON ─────────────────────────────────────────────── */}
        <motion.button
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 0.75, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFinish}
          className="absolute top-5 right-5 z-50 flex items-center gap-1.5 px-4 py-2 rounded-full
                     border border-[#811B2B]/30 text-[#811B2B] text-xs font-bold tracking-widest
                     uppercase bg-white/60 backdrop-blur-sm hover:bg-[#811B2B] hover:text-[#FFF5CC]
                     transition-all duration-300 shadow-sm"
        >
          Skip <ArrowRight className="w-3 h-3" />
        </motion.button>

        {/* ══ PHASE 1 — FLOATING POLAROID CARDS ══════════════════════════ */}
        <AnimatePresence>
          {phase === 'polaroids' && (
            <motion.div
              key="polaroids-layer"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {/* Centre teaser text that fades in first */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative z-10 flex flex-col items-center gap-1 text-center"
              >
                <motion.span
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-4xl sm:text-5xl"
                  style={{ color: '#811B2B' }}
                >
                  ✿
                </motion.span>
                <p
                  className="font-handwriting text-2xl sm:text-4xl font-bold leading-tight"
                  style={{ color: '#811B2B' }}
                >
                  Something lovely<br />is blooming...
                </p>
                <p
                  className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] opacity-60"
                  style={{ color: '#811B2B', fontFamily: 'Quicksand, Nunito, sans-serif' }}
                >
                  Stitched by our Dadis in Surat
                </p>
              </motion.div>

              {/* Polaroid Cards around the center text */}
              {POLAROIDS.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{
                    x: card.from.x,
                    y: card.from.y,
                    rotate: card.from.rotate,
                    scale: card.from.scale,
                    opacity: 0,
                  }}
                  animate={{
                    x: card.to.x,
                    y: card.to.y,
                    rotate: card.to.rotate,
                    scale: card.to.scale,
                    opacity: 1,
                  }}
                  transition={{
                    delay: card.delay,
                    duration: 0.85,
                    type: 'spring',
                    stiffness: 180,
                    damping: 22,
                  }}
                  className="absolute"
                  style={{ zIndex: 5 }}
                >
                  {/* Polaroid frame */}
                  <div
                    className="rounded-xl overflow-hidden shadow-2xl"
                    style={{
                      width: 120,
                      padding: '7px 7px 22px 7px',
                      backgroundColor: '#FFFEF8',
                      border: '1.5px solid rgba(129,27,43,0.18)',
                      boxShadow: '0 12px 40px rgba(129,27,43,0.18), 0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    <div
                      className="rounded-lg overflow-hidden"
                      style={{ width: '100%', aspectRatio: '1', backgroundColor: card.accent }}
                    >
                      <img
                        src={card.src}
                        alt={card.alt}
                        className="w-full h-full object-cover"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                    <p
                      className="text-center font-handwriting font-bold leading-tight mt-1"
                      style={{
                        fontSize: 9,
                        color: '#811B2B',
                        fontFamily: 'Caveat, cursive',
                      }}
                    >
                      {card.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ PHASE 2 — CINEMATIC BRAND REVEAL ═══════════════════════════ */}
        <AnimatePresence>
          {(phase === 'reveal' || phase === 'exiting') && (
            <motion.div
              key="reveal-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="relative z-20 flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-12 px-6 w-full max-w-4xl mx-auto"
            >
              {/* ─ HERO BOUQUET PHOTO ─────────────────────────────────── */}
              <motion.div
                initial={{ scale: 0.75, opacity: 0, y: 30 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: [0, -10, 0],
                  rotate: [0, 1.2, -1.2, 0],
                }}
                transition={{
                  scale:   { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
                  opacity: { duration: 0.6 },
                  y:       { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.7 },
                  rotate:  { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.7 },
                }}
                className="relative shrink-0"
                style={{ width: 240, height: 280 }}
              >
                {/* Soft glow behind image */}
                <div
                  className="absolute inset-0 rounded-3xl blur-2xl opacity-40 scale-110 pointer-events-none"
                  style={{ backgroundColor: '#F5C4D5' }}
                />

                {/* Main image frame */}
                <div
                  className="relative w-full h-full rounded-3xl overflow-hidden"
                  style={{
                    border: '3px solid #811B2B',
                    boxShadow: '0 24px 64px rgba(129,27,43,0.28), 0 4px 16px rgba(0,0,0,0.1)',
                    backgroundColor: '#FFFEF8',
                  }}
                >
                  <img
                    src="/bloom/hero-sky-bouquet.jpg"
                    alt="Knotsnco Everlasting Crochet Bouquet"
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/bloom/bouquet-pink-dawn.jpg';
                    }}
                  />
                  {/* Warm vignette overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(129,27,43,0.15) 0%, transparent 60%)',
                    }}
                  />
                </div>

                {/* Sticker tag */}
                <motion.div
                  initial={{ opacity: 0, rotate: -12, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 6, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, type: 'spring', bounce: 0.5 }}
                  className="absolute -bottom-3 -right-4 px-3.5 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-wide"
                  style={{
                    backgroundColor: '#F5DD91',
                    color: '#811B2B',
                    border: '2px solid #811B2B',
                    boxShadow: '0 4px 12px rgba(129,27,43,0.2)',
                    fontFamily: 'Quicksand, Nunito, sans-serif',
                  }}
                >
                  Made to stay ✿
                </motion.div>

                {/* Small floating hearts around the bouquet */}
                {[
                  { top: '-18px', left: '-18px', delay: 0.4, size: 18 },
                  { top: '20px',  left: '-30px', delay: 0.9, size: 14 },
                  { top: '-10px', right: '-22px', delay: 0.65, size: 16 },
                ].map((h, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0.9, 0.6, 0.9],
                      scale: [0, 1.2, 1, 1.1],
                      y: [-6, 4, -6],
                    }}
                    transition={{
                      delay: h.delay,
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute pointer-events-none"
                    style={{
                      top: h.top,
                      left: h.left,
                      right: (h as any).right,
                      fontSize: h.size,
                      color: '#F5C4D5',
                      filter: 'drop-shadow(0 1px 3px rgba(129,27,43,0.3))',
                    }}
                  >
                    ♡
                  </motion.span>
                ))}
              </motion.div>

              {/* ─ BRAND TEXT BLOCK ─────────────────────────────────────── */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm">
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  className="mb-3"
                  style={{ height: 68 }}
                >
                  <img
                    src="/logo-knotsnco.png"
                    alt="Knotsnco"
                    style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
                  />
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
                  className="font-editorial leading-none tracking-tight"
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                    fontWeight: 900,
                    color: '#811B2B',
                    fontFamily: '"Playfair Display", Georgia, serif',
                  }}
                >
                  Handmade<br />Happiness.
                </motion.h1>

                {/* Handwritten sub-line */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38, duration: 0.6 }}
                  className="font-handwriting font-bold mt-1"
                  style={{
                    fontSize: 'clamp(1.2rem, 3vw, 1.7rem)',
                    color: '#811B2B',
                    fontFamily: 'Caveat, cursive',
                  }}
                >
                  Little yarn. Big stories.
                </motion.p>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.52, duration: 0.55 }}
                  className="mt-3 leading-relaxed"
                  style={{
                    fontSize: 'clamp(0.72rem, 1.5vw, 0.85rem)',
                    color: 'rgba(129,27,43,0.80)',
                    fontFamily: 'Quicksand, Nunito, sans-serif',
                    maxWidth: 320,
                  }}
                >
                  Everlasting crochet gifting, accessories &amp; flowers —<br />
                  crafted stitch by stitch by our Dadis in Surat.
                </motion.p>

                {/* Divider row */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.62, duration: 0.5, ease: 'easeOut' }}
                  className="flex items-center gap-2 mt-4 origin-left"
                >
                  <div className="h-px w-10" style={{ backgroundColor: 'rgba(129,27,43,0.25)' }} />
                  <Sparkles className="w-3.5 h-3.5" style={{ color: '#811B2B', opacity: 0.5 }} />
                  <div className="h-px w-10" style={{ backgroundColor: 'rgba(129,27,43,0.25)' }} />
                </motion.div>

                {/* CTA Button — only appears after showCTA */}
                <AnimatePresence>
                  {showCTA && (
                    <motion.button
                      key="cta"
                      initial={{ opacity: 0, scale: 0.82, y: 14 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.06, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.5, type: 'spring', stiffness: 240, damping: 20 }}
                      onClick={handleFinish}
                      className="mt-5 flex items-center gap-2.5 uppercase font-bold tracking-widest
                                 rounded-full transition-all duration-300"
                      style={{
                        padding: '14px 30px',
                        fontSize: '0.72rem',
                        backgroundColor: '#811B2B',
                        color: '#FFF5CC',
                        boxShadow: '0 8px 32px rgba(129,27,43,0.35), 0 2px 8px rgba(129,27,43,0.2)',
                        fontFamily: 'Quicksand, Nunito, sans-serif',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <span>Step Inside the World</span>
                      <ArrowRight className="w-3.5 h-3.5" style={{ flexShrink: 0 }} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BOTTOM BRAND CREDIT ─────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-5 text-center text-[10px] font-bold uppercase tracking-[0.25em]"
          style={{ color: '#811B2B', fontFamily: 'Quicksand, Nunito, sans-serif' }}
        >
          Knotsnco — Handmade with ♡ in Surat
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}

export default CrochetBouquetIntro;
