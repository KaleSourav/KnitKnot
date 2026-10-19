import React from 'react';
import { Heart, Sparkles, Feather, ShieldCheck, Sun, Recycle } from 'lucide-react';

export const CraftsmanshipSection: React.FC = () => {
  const pillars = [
    {
      icon: Feather,
      title: 'Combed Milk Cotton Yarn',
      description: 'Spun from breathable, velvet-soft organic cotton fibers that feel heavenly to touch, resist pilling, and produce no shedding.',
    },
    {
      icon: Heart,
      title: '100% Hand-Crocheted',
      description: 'Zero factory machines. Every stitch, petal, and cute amigurumi face is meticulously looped by talented artisan women.',
    },
    {
      icon: Sun,
      title: 'Flowers That Bloom Forever',
      description: 'Unlike fresh cuts that wither away in days, our eternal floral bouquets maintain their radiant pastel colors for decades.',
    },
    {
      icon: Recycle,
      title: 'Eco-Conscious Keepsakes',
      description: 'Packaged in biodegradable tissue and recyclable gift boxes with zero single-use plastics and handwritten cards.',
    },
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-purple-900/20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Little Yarn, Big Stories ♡</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Handmade Happiness in Every Loop
        </h2>
        <p className="text-sm sm:text-base text-stone-400 mt-2">
          KnitKnot started as a humble dream: to replace temporary disposable gifts with timeless, huggable pieces of art that warm your home.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="bg-[#121017] rounded-3xl p-6 border border-purple-500/15 hover:border-purple-400/40 transition-all duration-300 flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-pink-300 mb-4">
                <Icon className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">{pillar.description}</p>
            </div>
          );
        })}
      </div>

      {/* STATS BANNER */}
      <div className="mt-12 bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-purple-950/40 rounded-3xl p-8 border border-purple-500/20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#edd2f7]">45,000+</p>
          <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Bouquets Delivered</p>
        </div>
        <div>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#edd2f7]">100%</p>
          <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Everlasting Lifespan</p>
        </div>
        <div>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#edd2f7]">4.95 ★</p>
          <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Over 1,800 Reviews</p>
        </div>
        <div>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#edd2f7]">50+ Artisans</p>
          <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Empowered Creators</p>
        </div>
      </div>
    </section>
  );
};
