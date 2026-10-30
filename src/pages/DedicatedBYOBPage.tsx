/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Flower2 } from 'lucide-react';
import { Product, CartItem } from '../data/products';
import { BouquetCustomizerSection } from '../components/BouquetCustomizerSection';

interface DedicatedBYOBPageProps {
  onAddToCart: (product: Product, quantity?: number, customization?: CartItem['customization']) => void;
  onOpenCart: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export function DedicatedBYOBPage({
  onAddToCart,
  onOpenCart,
  onNavigate,
}: DedicatedBYOBPageProps) {
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFF5CC' }}>

      {/* ── PAGE HERO ─────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #811B2B 0%, #5C0F19 60%, #3A0810 100%)',
          paddingTop: 64,
        }}
      >
        {/* Decorative ambient blobs */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: '#F5C4D5', transform: 'translate(30%, -30%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: '#F5DD91', transform: 'translate(-30%, 30%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">

          {/* Breadcrumb */}
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 mb-8 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-70"
            style={{ color: 'rgba(255,245,204,0.65)', fontFamily: 'Quicksand, sans-serif' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </motion.button>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            {/* Left: Text */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                style={{ backgroundColor: 'rgba(245,196,213,0.18)', border: '1px solid rgba(245,196,213,0.3)' }}
              >
                <Flower2 className="w-3.5 h-3.5" style={{ color: '#F5C4D5', animationDuration: '10s' }} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#F5C4D5', fontFamily: 'Quicksand, sans-serif' }}>
                  Bespoke Artisan Studio
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                className="leading-none tracking-tight mb-3"
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 900,
                  color: '#FFF5CC',
                  fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                }}
              >
                Build Your Own<br />
                <span style={{ color: '#F5C4D5' }}>Bouquet.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.55 }}
                className="mb-6"
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
                  color: 'rgba(255,245,204,0.75)',
                }}
              >
                Curated by you — hand-crocheted stitch by stitch by our Dadis in Surat ♡
              </motion.p>

              {/* Feature pills */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-wrap gap-2 justify-center lg:justify-start"
              >
                {[
                  { icon: '✿', text: '100% Crochet' },
                  { icon: '♡', text: 'Never Wilts' },
                  { icon: '✦', text: 'Handwritten Card' },
                  { icon: '✿', text: 'Gift-Ready' },
                ].map((pill) => (
                  <span
                    key={pill.text}
                    className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: 'rgba(255,245,204,0.12)',
                      color: '#FFF5CC',
                      border: '1px solid rgba(255,245,204,0.2)',
                      fontFamily: 'Quicksand, sans-serif',
                    }}
                  >
                    <span style={{ color: '#F5DD91' }}>{pill.icon}</span>
                    {pill.text}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: Hero image collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative shrink-0 hidden md:block"
              style={{ width: 280, height: 220 }}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 rounded-3xl overflow-hidden"
                style={{ border: '3px solid rgba(255,245,204,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
              >
                <img
                  src="/bloom/hero-sky-bouquet.jpg"
                  alt="Knotsnco Crochet Bouquet"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/bloom/bouquet-pink-dawn.jpg'; }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(129,27,43,0.4) 0%, transparent 60%)' }} />
              </div>

              {/* Floating sticker */}
              <div
                className="absolute -top-3 -right-4 px-3.5 py-1.5 rounded-full font-black text-xs rotate-6"
                style={{
                  backgroundColor: '#F5DD91',
                  color: '#811B2B',
                  border: '2px solid #811B2B',
                  fontFamily: 'Quicksand, sans-serif',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                Made to stay ✿
              </div>

              {/* Small polaroid overlay */}
              <div
                className="absolute -bottom-4 -left-5 p-2 rounded-xl rotate-[-8deg]"
                style={{
                  backgroundColor: '#FFFEF8',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  width: 88,
                }}
              >
                <div className="rounded-lg overflow-hidden" style={{ aspectRatio: '1' }}>
                  <img src="/bloom/bouquet-pink-dawn.jpg" alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-center mt-1" style={{ fontFamily: 'Caveat, cursive', fontSize: 9, color: '#811B2B' }}>
                  🌹 Blush Rose
                </p>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Scalloped bottom edge */}
        <svg
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ marginTop: -1 }}
        >
          <path
            d="M0,40 C120,10 240,40 360,20 C480,0 600,40 720,20 C840,0 960,40 1080,20 C1200,0 1320,40 1440,20 L1440,40 Z"
            fill="#FFF5CC"
          />
        </svg>
      </div>

      {/* ── CUSTOMIZER STUDIO ─────────────────────────────────────── */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
      >
        {/* How it works */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
          {[
            { step: '01', label: 'Pick your stems', desc: 'Choose from 6 crochet flowers' },
            { step: '02', label: 'Dress it up', desc: 'Wrapping & ribbon colours' },
            { step: '03', label: 'Add your note', desc: 'Handwritten gift card included' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm mx-auto mb-2"
                style={{ backgroundColor: '#811B2B', color: '#FFF5CC', fontFamily: '"Playfair Display", serif' }}
              >
                {item.step}
              </div>
              <p className="text-xs font-black leading-tight" style={{ color: '#811B2B' }}>
                {item.label}
              </p>
              <p className="text-[10px] opacity-60 mt-0.5" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <BouquetCustomizerSection
          onAddToCart={onAddToCart}
          onOpenCart={onOpenCart}
          showHeader={false}
        />

        {/* Bottom trust section */}
        <div
          className="mt-14 p-8 rounded-3xl text-center"
          style={{ backgroundColor: '#FFFEF8', border: '2px solid rgba(129,27,43,0.12)' }}
        >
          <Sparkles className="w-6 h-6 mx-auto mb-3 opacity-50" style={{ color: '#811B2B' }} />
          <h3
            className="font-black mb-1"
            style={{ color: '#811B2B', fontFamily: '"Playfair Display", serif', fontSize: '1.2rem' }}
          >
            Every bouquet is made just for you.
          </h3>
          <p className="text-xs opacity-70 max-w-lg mx-auto" style={{ color: '#811B2B', fontFamily: 'Quicksand, sans-serif' }}>
            After you place your order, our Dadis in Surat begin crocheting your stems by hand.
            Each flower takes 45–60 minutes of careful stitching. Your bouquet will ship within 5–7 business days in premium gift packaging.
          </p>
        </div>
      </div>
    </div>
  );
}
