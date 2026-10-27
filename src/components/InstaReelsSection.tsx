/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../data/products';
import { Play, Pause, Volume2, VolumeX, Eye, ShoppingBag, Sparkles, Instagram, X, Check } from 'lucide-react';

export interface ReelItem {
  id: string;
  title: string;
  views: string;
  handle: string;
  thumbnail: string;
  videoUrl?: string;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
  };
}

const SAMPLE_REELS: ReelItem[] = [
  {
    id: 'reel-1',
    title: 'Packing an everlasting White Lily & Pink Rose bouquet order 🌸✨',
    views: '148.5K',
    handle: '@knitknot.crochet',
    thumbnail: '/products/bouquet.jpg',
    videoUrl: '/crochet-showcase.mp4',
    product: {
      id: 'gid://shopify/Product/8456441430079',
      name: 'Everlasting White Lily & Rose Bouquet',
      price: 1499,
      originalPrice: 1899,
      image: '/products/bouquet.jpg',
      category: 'Bouquets',
    },
  },
  {
    id: 'reel-2',
    title: 'Crocheting this cute baby sheep companion stitch by stitch 🧶🧸',
    views: '312.4K',
    handle: '@knitknot.crochet',
    thumbnail: '/products/bunny.jpg',
    videoUrl: '/crochet-showcase.mp4',
    product: {
      id: 'gid://shopify/Product/8456441724991',
      name: 'Lilac Overalls Bunny & Chick Set',
      price: 899,
      originalPrice: 1199,
      image: '/products/bunny.jpg',
      category: 'Plushies',
    },
  },
  {
    id: 'reel-3',
    title: 'How I style the Sunflower Bag Charm on my vintage tote bag 🌻💛',
    views: '89.2K',
    handle: '@knitknot.crochet',
    thumbnail: '/products/accessories.jpg',
    videoUrl: '/crochet-showcase.mp4',
    product: {
      id: 'gid://shopify/Product/8456441757759',
      name: 'Sunflower & Turtle Bag Charm',
      price: 350,
      originalPrice: 450,
      image: '/products/accessories.jpg',
      category: 'Charms',
    },
  },
  {
    id: 'reel-4',
    title: 'Sunday morning coffee run with the Daisy Granny Square Tote ☕🧺',
    views: '220.8K',
    handle: '@knitknot.crochet',
    thumbnail: '/products/tote.jpg',
    videoUrl: '/crochet-showcase.mp4',
    product: {
      id: 'gid://shopify/Product/8456441790527',
      name: 'Daisy & Sunflower Granny Square Tote',
      price: 1599,
      originalPrice: 1999,
      image: '/products/tote.jpg',
      category: 'Totes',
    },
  },
];

interface InstaReelsSectionProps {
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  products?: Product[];
}

export const InstaReelsSection: React.FC<InstaReelsSectionProps> = ({
  onAddToCart,
  onQuickView,
  products = [],
}) => {
  const [activeModalReel, setActiveModalReel] = useState<ReelItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [addedReelId, setAddedReelId] = useState<string | null>(null);

  const handleOpenReel = (reel: ReelItem) => {
    setActiveModalReel(reel);
    setIsPlaying(true);
  };

  const handleCloseModal = () => {
    setActiveModalReel(null);
  };

  const handleBuyFromReel = (reel: ReelItem) => {
    // Find matching product in catalog or construct one
    const matched = products.find((p) => p.name.toLowerCase().includes(reel.product.name.toLowerCase())) || {
      id: reel.product.id,
      name: reel.product.name,
      price: reel.product.price,
      originalPrice: reel.product.originalPrice,
      image: reel.product.image,
      category: reel.product.category,
      rating: 4.9,
      reviewsCount: 88,
      inStock: true,
      description: 'Handmade crochet piece featured in our viral reel.',
      details: ['100% Handcrafted', 'Combed milk cotton yarn'],
    } as Product;

    onAddToCart(matched, 1);
    setAddedReelId(reel.id);
    setTimeout(() => {
      setAddedReelId(null);
    }, 1500);
  };

  return (
    <section 
      id="watch-and-buy"
      className="w-full bg-transparent py-12 sm:py-16 md:py-24 px-3.5 sm:px-6 lg:px-8 border-t border-[#841724]/10 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#841724]/10 border border-[#841724]/20 text-[#841724] font-bold text-xs uppercase tracking-widest mb-2.5">
              <Instagram className="w-3.5 h-3.5 text-[#841724]" />
              <span>Watch & Buy • Viral on Reels</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#2b0b12] tracking-tight font-serif">
              As Seen On Your Feed
            </h2>
            <p className="text-sm sm:text-base text-[#7c5c62] mt-2 max-w-xl">
              Real unboxings, yarn ASMR, and styling inspo from our crochet community. Tap any reel to watch and shop the look instantly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#841724] text-[#faedd3] text-xs sm:text-sm font-bold shadow-md hover:bg-[#5c0f19] transition-all hover:scale-102"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow @knitknot.official</span>
            </a>
          </div>
        </div>

        {/* 4-Card Vertical 9:16 Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
          {SAMPLE_REELS.map((reel) => {
            const isAdded = addedReelId === reel.id;

            return (
              <div
                key={reel.id}
                onClick={() => handleOpenReel(reel)}
                className="group relative rounded-3xl overflow-hidden bg-[#2b0b12] shadow-lg border border-[#841724]/20 hover:border-[#841724]/50 hover:shadow-2xl transition-all duration-400 aspect-[9/16] cursor-pointer flex flex-col justify-between"
              >
                {/* Poster / Thumbnail Background */}
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-95"
                />

                {/* Dark Vignette Gradients for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60 pointer-events-none" />

                {/* Top Info Bar */}
                <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] sm:text-xs font-bold text-white border border-white/20">
                    <Eye className="w-3 h-3 text-amber-300" />
                    <span>{reel.views}</span>
                  </div>

                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:bg-[#841724] transition-colors">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Overlay: Caption & Interactive Shop Pill */}
                <div className="relative z-10 p-3 sm:p-4 flex flex-col gap-2.5">
                  
                  {/* Creator handle */}
                  <span className="text-[11px] font-bold text-amber-200/90 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {reel.handle}
                  </span>

                  {/* Reel Title */}
                  <p className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                    {reel.title}
                  </p>

                  {/* Floating "Shop Product" Pill */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyFromReel(reel);
                    }}
                    className="mt-1 flex items-center justify-between p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-[#faf4e8]/95 backdrop-blur-md border border-white/60 shadow-lg hover:bg-white transition-all duration-200"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden pr-1">
                      <img
                        src={reel.product.image}
                        alt={reel.product.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl object-cover shrink-0 border border-[#841724]/20"
                      />
                      <div className="overflow-hidden">
                        <p className="text-[10px] sm:text-[11px] font-bold text-[#2b0b12] truncate leading-tight">
                          {reel.product.name}
                        </p>
                        <p className="text-[10px] sm:text-[11px] font-black text-[#841724]">
                          ₹{reel.product.price}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Add to bag"
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isAdded 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3]'
                      }`}
                    >
                      {isAdded ? <Check className="w-3 h-3 stroke-[3]" /> : <ShoppingBag className="w-3 h-3" />}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Interactive Reel Playback Modal */}
      {activeModalReel && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-sm aspect-[9/16] max-h-[92svh] sm:max-h-[88vh] rounded-3xl sm:rounded-[32px] overflow-hidden bg-black shadow-2xl border border-white/20 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-transform active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video element or Poster */}
            <div className="absolute inset-0 w-full h-full">
              {activeModalReel.videoUrl ? (
                <video
                  src={activeModalReel.videoUrl}
                  autoPlay={isPlaying}
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeModalReel.thumbnail}
                  alt={activeModalReel.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />
            </div>

            {/* Top controls: sound & views */}
            <div className="relative z-20 p-4 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-black/50 text-white text-xs font-bold backdrop-blur-md border border-white/20">
                {activeModalReel.views} views
              </span>
              <button
                onClick={() => setIsMuted((m) => !m)}
                className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 mr-12"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Bottom: Shop the look Drawer */}
            <div className="relative z-20 p-5 flex flex-col gap-3">
              <div>
                <span className="text-xs font-bold text-amber-300">
                  {activeModalReel.handle}
                </span>
                <p className="text-sm font-semibold text-white leading-snug mt-1">
                  {activeModalReel.title}
                </p>
              </div>

              {/* Product Card Inside Reel */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf4e8] text-[#2b0b12] shadow-xl border border-white/40">
                <div className="flex items-center gap-3">
                  <img
                    src={activeModalReel.product.image}
                    alt={activeModalReel.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#841724]/20"
                  />
                  <div>
                    <h4 className="text-xs font-bold line-clamp-1">
                      {activeModalReel.product.name}
                    </h4>
                    <p className="text-sm font-black text-[#841724]">
                      ₹{activeModalReel.product.price}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleBuyFromReel(activeModalReel)}
                  className="px-4 py-2 rounded-full bg-[#841724] text-[#faedd3] text-xs font-bold shadow-md hover:bg-[#5c0f19] active:scale-95 transition-all"
                >
                  {addedReelId === activeModalReel.id ? 'Added! ♡' : 'Shop Now'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
