/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  Sparkles,
  ChevronRight,
  Flower2,
  RotateCcw
} from 'lucide-react';
import { MAIN_CATEGORIES } from '../data/categories';

interface KnotsncoNavProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onReplayIntro: () => void;
}

export function KnotsncoNav({
  currentView,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
  onReplayIntro,
}: KnotsncoNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Shop All', view: 'shop-all' },
    { label: 'Flowers', view: 'collection', slug: 'flowers' },
    { label: 'Flower Pots', view: 'collection', slug: 'flower-pots' },
    { label: 'Keychains & Charms', view: 'collection', slug: 'keychains-and-bag-charms' },
    { label: 'Accessories', view: 'collection', slug: 'accessories' },
    { label: 'Bags', view: 'collection', slug: 'bags' },
    { label: 'Home Decor', view: 'collection', slug: 'home-decor' },
  ];

  return (
    <>
      {/* 1. TOP TICKER ANNOUNCEMENT BAR */}
      <div className="w-full bg-[#811B2B] text-[#FFF5CC] py-1.5 px-4 text-xs font-semibold tracking-wide flex items-center justify-between select-none relative z-40 overflow-hidden border-b border-[#5C0F19]">
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F5DD91] animate-pulse" />
          <span className="font-rounded">Surat Artisan Studio • 100% Cotton Yarn</span>
        </div>

        {/* Ticker marquee message */}
        <div className="flex-1 text-center font-rounded overflow-hidden px-2">
          <span className="inline-block animate-pulse">
            ✿ Flowers that never ghost you • Handcrafted stitch by stitch by our Dadis in Surat • Free shipping over ₹999 ✿
          </span>
        </div>

        {/* Replay Bouquet Intro Trigger */}
        <button
          onClick={onReplayIntro}
          className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-[#F5DD91] hover:text-white transition-colors bg-[#5C0F19]/60 px-2.5 py-0.5 rounded-full"
          title="Replay opening crochet bouquet animation"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Replay Bouquet</span>
        </button>
      </div>

      {/* 2. MAIN HEADER & NAVIGATION BAR */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFF5CC]/95 backdrop-blur-md shadow-md border-b border-[#811B2B]/15 py-2.5'
            : 'bg-[#FFF5CC] border-b border-[#811B2B]/10 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#811B2B] hover:bg-[#811B2B]/10 rounded-full transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Knotsnco Official Logo with Mascot */}
            <div
              onClick={() => onNavigate('home')}
              className="cursor-pointer flex items-center gap-2.5 shrink-0 group"
            >
              <img
                src="/logo-knotsnco.png"
                alt="Knotsnco"
                className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="hidden xl:inline-block font-handwriting text-lg text-[#811B2B]/80 font-bold -mb-1">
                handmade happiness ♡
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 font-rounded text-[13px] font-bold text-[#811B2B]">
              {navLinks.map((link) => {
                const isActive =
                  currentView === link.view ||
                  (link.slug && currentView === `collection/${link.slug}`);

                return (
                  <button
                    key={link.label}
                    onClick={() => onNavigate(link.view, link.slug)}
                    className={`relative py-1 transition-colors hover:text-[#5C0F19] group ${
                      isActive ? 'text-[#811B2B]' : 'text-[#811B2B]/85'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-[#811B2B] rounded-full transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </button>
                );
              })}

              {/* Special CTA: Build Your Own Bouquet Studio */}
              <button
                onClick={() => onNavigate('byob')}
                className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#811B2B] text-[#FFF5CC] font-bold text-xs tracking-wider shadow-sm hover:shadow-md hover:bg-[#5C0F19] transition-all transform hover:-translate-y-0.5"
              >
                <Flower2 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                <span>BUILD BOUQUET</span>
                <span className="absolute -top-2 -right-2 bg-[#F5DD91] text-[#811B2B] text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-[#811B2B]/20 rotate-6 shadow-sm">
                  NEW
                </span>
              </button>
            </nav>

            {/* Right Action Icons: Search, Account, Cart */}
            <div className="flex items-center gap-2 sm:gap-3 text-[#811B2B]">
              {/* Search */}
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-full hover:bg-[#811B2B]/10 transition-colors text-[#811B2B]"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account */}
              <button
                onClick={onOpenAccount}
                className="p-2 rounded-full hover:bg-[#811B2B]/10 transition-colors text-[#811B2B]"
                aria-label="Account and orders"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Cart Button with Count Badge */}
              <button
                onClick={onOpenCart}
                className="relative p-2.5 rounded-full bg-[#811B2B] text-[#FFF5CC] hover:bg-[#5C0F19] transition-all shadow-md hover:scale-105"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#F5DD91] text-[#811B2B] text-[11px] font-extrabold flex items-center justify-center border-2 border-[#FFF5CC] shadow-sm animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 3. MOBILE MENU SLIDE-OVER DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#811B2B]/50 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-sm bg-[#FFF5CC] text-[#811B2B] h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-[#811B2B]/15 flex items-center justify-between">
              <img
                src="/logo-knotsnco.png"
                alt="Knotsnco"
                className="h-8 w-auto object-contain"
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-[#811B2B]/10 text-[#811B2B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Highlight BYOB Studio Banner */}
            <div className="p-4 bg-[#F5DD91]/50 border-b border-[#811B2B]/10">
              <button
                onClick={() => {
                  onNavigate('byob');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between bg-[#811B2B] text-[#FFF5CC] px-4 py-3 rounded-2xl font-bold text-sm shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Flower2 className="w-4 h-4 text-[#F5DD91]" />
                  <span>Build Your Own Bouquet</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#F5DD91]" />
              </button>
            </div>

            {/* Category Navigation Links with Icons */}
            <div className="flex-1 p-4 space-y-1">
              <div className="text-[11px] font-extrabold text-[#811B2B]/60 uppercase tracking-widest px-2 mb-2 font-rounded">
                Shop Collections
              </div>

              <button
                onClick={() => {
                  onNavigate('shop-all');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm hover:bg-[#811B2B]/10 transition-colors flex items-center justify-between"
              >
                <span>All Products</span>
                <span className="text-xs text-[#811B2B]/60">252 Items</span>
              </button>

              {MAIN_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onNavigate('collection', cat.slug);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-sm hover:bg-[#811B2B]/10 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.accentBg }} />
                    <span>{cat.name}</span>
                  </div>
                  <span className="text-xs text-[#811B2B]/60">{cat.count}</span>
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-[#811B2B]/10 space-y-1">
                <div className="text-[11px] font-extrabold text-[#811B2B]/60 uppercase tracking-widest px-2 mb-2 font-rounded">
                  Our Story & Help
                </div>
                <button
                  onClick={() => {
                    onNavigate('about');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#811B2B]/10 transition-colors"
                >
                  Meet Our Dadis in Surat
                </button>
                <button
                  onClick={() => {
                    onNavigate('contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#811B2B]/10 transition-colors"
                >
                  Contact & Custom Orders
                </button>
                <button
                  onClick={() => {
                    onReplayIntro();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-[#811B2B]/80 hover:bg-[#811B2B]/10 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Bouquet Animation</span>
                </button>
              </div>
            </div>

            {/* Mobile Footer Note */}
            <div className="p-4 bg-[#811B2B] text-[#FFF5CC] text-center text-xs font-rounded">
              <p className="font-handwriting text-lg">Handmade with love in Surat ♡</p>
              <p className="opacity-80 text-[11px]">Knotsnco Everlasting Florals</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

