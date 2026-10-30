/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Instagram, Mail, Phone, MapPin, Sparkles, Flower2 } from 'lucide-react';
import { MAIN_CATEGORIES } from '../data/categories';

interface KnotsncoFooterProps {
  onNavigate: (view: string, param?: string) => void;
  onReplayIntro: () => void;
}

export function KnotsncoFooter({ onNavigate, onReplayIntro }: KnotsncoFooterProps) {
  return (
    <footer className="w-full bg-[#811B2B] text-[#FFF5CC] relative pt-16 pb-10 overflow-hidden border-t-2 border-[#5C0F19]">
      
      {/* Top Scalloped Ribbon Detail */}
      <div className="absolute top-0 inset-x-0 h-3 bg-gingham-burgundy opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#FFF5CC]/15">
          
          {/* Brand Info & Story (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <div
              onClick={() => onNavigate('home')}
              className="cursor-pointer mb-4 group"
            >
              <img
                src="/logo-knotsnco.png"
                alt="Knotsnco"
                className="h-10 sm:h-12 w-auto object-contain brightness-0 invert"
              />
            </div>

            <p className="font-editorial text-xl font-bold text-[#FFF5CC] leading-tight">
              Handmade Happiness.
            </p>
            <p className="font-handwriting text-2xl text-[#F5DD91] font-bold mt-1">
              Little yarn. Big stories.
            </p>

            <p className="mt-3 text-xs sm:text-sm text-[#FFF5CC]/80 font-rounded leading-relaxed max-w-sm">
              Knotsnco is a slow-craft boutique creating everlasting crochet flowers, desktop planters, amigurumi companions, and statement accessories — stitched with love by our Dadis in Surat.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://instagram.com/knotsnco"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#FFF5CC]/10 hover:bg-[#FFF5CC] hover:text-[#811B2B] border border-[#FFF5CC]/20 flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <button
                onClick={onReplayIntro}
                className="px-3 py-1.5 rounded-full bg-[#FFF5CC]/10 hover:bg-[#FFF5CC] hover:text-[#811B2B] border border-[#FFF5CC]/20 text-xs font-bold transition-all flex items-center gap-1.5"
                title="Replay opening crochet bouquet animation"
              >
                <Flower2 className="w-3.5 h-3.5 text-[#F5DD91]" />
                <span>Replay Bouquet Animation</span>
              </button>
            </div>
          </div>

          {/* Categories Column (3 Cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-editorial text-lg font-bold text-[#FFF5CC] mb-4">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-rounded">
              <li>
                <button
                  onClick={() => onNavigate('shop-all')}
                  className="text-[#FFF5CC]/85 hover:text-[#F5DD91] transition-colors"
                >
                  All Products (252 Designs)
                </button>
              </li>
              {MAIN_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('collection', cat.slug)}
                    className="text-[#FFF5CC]/85 hover:text-[#F5DD91] transition-colors"
                  >
                    {cat.name} ({cat.count})
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('byob')}
                  className="text-[#F5DD91] font-bold hover:underline flex items-center gap-1"
                >
                  <span>Build A Bouquet Studio ✿</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links & Brand Column (2 Cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-editorial text-lg font-bold text-[#FFF5CC] mb-4">
              About Knotsnco
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-rounded">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-[#FFF5CC]/85 hover:text-[#F5DD91] transition-colors"
                >
                  Our Dadis in Surat
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-[#FFF5CC]/85 hover:text-[#F5DD91] transition-colors"
                >
                  Sustainable Slow Craft
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-[#FFF5CC]/85 hover:text-[#F5DD91] transition-colors"
                >
                  Custom & Bulk Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-[#FFF5CC]/85 hover:text-[#F5DD91] transition-colors"
                >
                  Help & FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Studio (3 Cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-editorial text-lg font-bold text-[#FFF5CC] mb-4">
              Surat Artisan Studio
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-[#FFF5CC]/85 font-rounded">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F5DD91] shrink-0 mt-0.5" />
                <span>Knotsnco Artisan Atelier, Adajan, Surat, Gujarat 395009, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F5DD91] shrink-0" />
                <a href="mailto:hello@knotsnco.com" className="hover:underline">hello@knotsnco.com</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F5DD91] shrink-0" />
                <span>+91 99999 99999 (Mon–Sat 10am–7pm)</span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-2xl bg-[#FFF5CC]/10 border border-[#FFF5CC]/15">
              <p className="text-[11px] font-bold text-[#F5DD91] font-rounded">
                Slow Crafted With Love
              </p>
              <p className="text-[10px] text-[#FFF5CC]/70 mt-0.5">
                Each piece takes between 2 to 8 hours of careful hand-crochet work.
              </p>
            </div>
          </div>

        </div>

        {/* Oversized Brand Typography Strip (Ref 5 Style) */}
        <div className="pt-8 pb-4 text-center select-none overflow-hidden">
          <p className="font-editorial text-4xl sm:text-6xl md:text-8xl font-black text-[#FFF5CC]/10 tracking-widest uppercase">
            KNOTSNCO
          </p>
        </div>

        {/* Bottom Copyright & Policies Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF5CC]/60 font-rounded">
          <p>© {new Date().getFullYear()} Knotsnco. All handmade rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('contact')} className="hover:text-[#FFF5CC]">
              Shipping & Returns
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#FFF5CC]">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#FFF5CC]">
              Terms of Service
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
