/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Product } from '../data/products';
import { Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { ModernProductCard } from './ModernProductCard';

interface MoodDeck {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  accentColor: string;
  bgGradient: string;
  image: string;
  count: number;
  badge: string;
}

const MOOD_DECKS: MoodDeck[] = [
  {
    id: 'florals',
    title: 'Cottagecore Florals',
    subtitle: 'Eternal blooms that never wilt or fade',
    tagline: 'Hand-wired stems & soft combed cotton',
    accentColor: '#841724',
    bgGradient: 'from-[#faedd3] to-[#f5dfc3]',
    image: '/products/bouquet.jpg',
    count: 5,
    badge: '🌸 Never Wilts',
  },
  {
    id: 'plushies',
    title: 'Squishy Cuddle Club',
    subtitle: 'Desk companions & amigurumi buddies',
    tagline: 'Instant dopamine booster for your workspace',
    accentColor: '#6b3e26',
    bgGradient: 'from-[#fceddf] to-[#f4d8c2]',
    image: '/products/bunny.jpg',
    count: 5,
    badge: '🧸 Squishy Soft',
  },
  {
    id: 'totes',
    title: 'Clean-Girl & Pinterest Totes',
    subtitle: 'Artisan granny-square everyday luxury',
    tagline: 'Spacious, durable & aesthetic coffee run carryall',
    accentColor: '#2b0b12',
    bgGradient: 'from-[#f3e9db] to-[#eadac3]',
    image: '/products/tote.jpg',
    count: 5,
    badge: '👜 100% Cotton',
  },
  {
    id: 'charms',
    title: 'Micro-Charms & Bag Jewelry',
    subtitle: 'Cutest details for keys, bags & hair',
    tagline: 'Puffy flowers, turtle shells & mini bouquets',
    accentColor: '#841724',
    bgGradient: 'from-[#faedd3] to-[#edd3b4]',
    image: '/products/accessories.jpg',
    count: 5,
    badge: '✨ Under ₹400',
  },
];

// Fallback curated 20 items if products prop is empty or filtering
const CURATED_20_DEFINITIONS: Array<{
  moodId: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  badge: string;
  rating: number;
  reviewsCount: number;
}> = [
  // 1-5: Cottagecore Florals
  {
    moodId: 'florals',
    name: 'XL Sunflower - Double Layered Bloom',
    category: 'Bouquets',
    price: 699,
    originalPrice: 899,
    image: '/products/byob.jpg',
    badge: '🔥 Top Seller',
    rating: 4.9,
    reviewsCount: 142,
  },
  {
    moodId: 'florals',
    name: 'Double White Tulip Desk Pot',
    category: 'Flower Pots',
    price: 549,
    originalPrice: 699,
    image: '/products/tulips.jpg',
    badge: '🌸 Eternal',
    rating: 4.8,
    reviewsCount: 96,
  },
  {
    moodId: 'florals',
    name: 'Everlasting White Lily & Rose Bouquet',
    category: 'Bouquets',
    price: 1499,
    originalPrice: 1899,
    image: '/products/bouquet.jpg',
    badge: '✨ Luxury Edit',
    rating: 5.0,
    reviewsCount: 215,
  },
  {
    moodId: 'florals',
    name: 'Pastel Sunrise Tulip Bouquet',
    category: 'Bouquets',
    price: 749,
    originalPrice: 999,
    image: '/products/tulips.jpg',
    badge: '💐 Best Gift',
    rating: 4.9,
    reviewsCount: 78,
  },
  {
    moodId: 'florals',
    name: 'Mini Red Rose Ceramic Planter Pot',
    category: 'Flower Pots',
    price: 499,
    originalPrice: 649,
    image: '/products/utility.jpg',
    badge: '🌹 Hand-Wired',
    rating: 4.7,
    reviewsCount: 54,
  },

  // 6-10: Squishy Cuddle Club
  {
    moodId: 'plushies',
    name: 'Barnaby Bunny Companion with Overalls',
    category: 'Amigurumi Plushies',
    price: 899,
    originalPrice: 1199,
    image: '/products/bunny.jpg',
    badge: '🧸 Cuddle Club',
    rating: 5.0,
    reviewsCount: 189,
  },
  {
    moodId: 'plushies',
    name: 'Watermelon Shell Pocket Turtle',
    category: 'Toys & Charms',
    price: 399,
    originalPrice: 499,
    image: '/products/accessories.jpg',
    badge: '🍉 Viral Reel',
    rating: 4.9,
    reviewsCount: 130,
  },
  {
    moodId: 'plushies',
    name: 'Strawberry Shell Crochet Mini Turtle',
    category: 'Toys & Charms',
    price: 399,
    originalPrice: 499,
    image: '/products/accessories.jpg',
    badge: '🍓 Fan Favorite',
    rating: 4.9,
    reviewsCount: 112,
  },
  {
    moodId: 'plushies',
    name: 'Harry Potter Artisan Desk Standee',
    category: 'Home & Desk Decor',
    price: 649,
    originalPrice: 799,
    image: '/products/utility.jpg',
    badge: '⚡ Wizardry',
    rating: 4.8,
    reviewsCount: 67,
  },
  {
    moodId: 'plushies',
    name: 'Naruto Shippuden Amigurumi Standee',
    category: 'Home & Desk Decor',
    price: 649,
    originalPrice: 799,
    image: '/products/utility.jpg',
    badge: '🔥 Anime Edit',
    rating: 4.9,
    reviewsCount: 84,
  },

  // 11-15: Clean-Girl & Pinterest Totes
  {
    moodId: 'totes',
    name: 'Boho Sunflower Granny Square Carryall',
    category: 'Wearables & Bags',
    price: 1599,
    originalPrice: 1999,
    image: '/products/tote.jpg',
    badge: '👜 Resort Edit',
    rating: 4.9,
    reviewsCount: 164,
  },
  {
    moodId: 'totes',
    name: 'Blue Sunflower Valley Crochet Shoulder Bag',
    category: 'Wearables & Bags',
    price: 1450,
    originalPrice: 1799,
    image: '/products/tote.jpg',
    badge: '✨ Hand-Lined',
    rating: 4.8,
    reviewsCount: 79,
  },
  {
    moodId: 'totes',
    name: 'Gulabi Bow Coquette Tote Bag',
    category: 'Wearables & Bags',
    price: 1399,
    originalPrice: 1699,
    image: '/products/tote.jpg',
    badge: '🎀 Coquette Drop',
    rating: 4.9,
    reviewsCount: 92,
  },
  {
    moodId: 'totes',
    name: 'Puffy Butter Yellow Mini Handbag',
    category: 'Wearables & Bags',
    price: 1250,
    originalPrice: 1550,
    image: '/products/cardigan.jpg',
    badge: '🧈 Butter Soft',
    rating: 4.7,
    reviewsCount: 63,
  },
  {
    moodId: 'totes',
    name: 'Black & White Boho Checker Sling Bag',
    category: 'Wearables & Bags',
    price: 1199,
    originalPrice: 1499,
    image: '/products/tote.jpg',
    badge: '🤍 Monochrome',
    rating: 4.8,
    reviewsCount: 81,
  },

  // 16-20: Micro-Charms & Bag Jewelry
  {
    moodId: 'charms',
    name: 'Maroon Puffy Flower Bag Charm',
    category: 'Keychains & Charms',
    price: 350,
    originalPrice: 438,
    image: '/products/accessories.jpg',
    badge: '✨ Under ₹399',
    rating: 4.8,
    reviewsCount: 124,
  },
  {
    moodId: 'charms',
    name: 'Cherry Blossom Hairclip Duo (Pink)',
    category: 'Hair Accessories',
    price: 299,
    originalPrice: 399,
    image: '/products/accessories.jpg',
    badge: '🌸 Hair Accent',
    rating: 4.9,
    reviewsCount: 145,
  },
  {
    moodId: 'charms',
    name: 'Red Rose Hanging Car & Bag Charm',
    category: 'Keychains & Charms',
    price: 380,
    originalPrice: 490,
    image: '/products/accessories.jpg',
    badge: '🌹 Car Hanging',
    rating: 4.9,
    reviewsCount: 98,
  },
  {
    moodId: 'charms',
    name: 'Mini Sunflower Clasp & Clip Accessory',
    category: 'Keychains & Charms',
    price: 320,
    originalPrice: 420,
    image: '/products/accessories.jpg',
    badge: '🌻 Sunny Vibe',
    rating: 4.8,
    reviewsCount: 87,
  },
  {
    moodId: 'charms',
    name: 'Bell Bottom Pastel Flower Charm',
    category: 'Keychains & Charms',
    price: 350,
    originalPrice: 450,
    image: '/products/accessories.jpg',
    badge: '🔔 Cute Bell',
    rating: 4.7,
    reviewsCount: 71,
  },
];

interface MoodwiseDecksSectionProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
}

export const MoodwiseDecksSection: React.FC<MoodwiseDecksSectionProps> = ({
  products,
  onAddToCart,
  onQuickView,
}) => {
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Map products to the 20 items or use the curated 20 definitions
  const curated20Products = useMemo(() => {
    return CURATED_20_DEFINITIONS.map((def, idx) => {
      // Look for match in live products
      const match = products.find((p) =>
        p.name.toLowerCase().includes(def.name.toLowerCase().split(' ')[0]) ||
        p.category.toLowerCase() === def.category.toLowerCase()
      );

      return {
        id: match ? match.id : `curated-${idx + 1}`,
        name: def.name,
        category: def.category,
        price: def.price,
        originalPrice: def.originalPrice,
        image: match && match.image ? match.image : def.image,
        rating: def.rating,
        reviewsCount: def.reviewsCount,
        badge: def.badge,
        inStock: true,
        moodId: def.moodId,
        description: `${def.name} - 100% handcrafted crochet piece, stitched slowly with premium combed milk cotton yarn.`,
        details: [
          '100% Handcrafted by women artisans in Surat',
          'Soft combed milk cotton yarn',
          'Everlasting durability & vibrant colors',
          'Perfect aesthetic gift',
        ],
      } as Product & { moodId: string };
    });
  }, [products]);

  // Filter 20 products according to selected mood deck
  const displayedProducts = useMemo(() => {
    if (selectedMood === 'all') return curated20Products;
    return curated20Products.filter((p) => p.moodId === selectedMood);
  }, [curated20Products, selectedMood]);

  const toggleWishlist = (id: string) => {
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = (product: Product) => {
    onAddToCart(product, 1);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1400);
  };

  return (
    <section 
      id="mood-decks-section"
      className="w-full bg-transparent py-12 sm:py-16 md:py-24 px-3.5 sm:px-6 lg:px-8 border-t border-[#841724]/10 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">

        {/* 5) SECTION HEADER: MOODWISE / DECKS ROW */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#841724]/10 border border-[#841724]/20 text-[#841724] font-bold text-xs uppercase tracking-widest mb-2.5">
              <Layers className="w-3.5 h-3.5 text-[#841724]" />
              <span>Cardwise & Moodwise Decks</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#2b0b12] tracking-tight font-serif">
              Shop By Your Aesthetic Mood
            </h2>
            <p className="text-sm sm:text-base text-[#7c5c62] mt-2 max-w-xl">
              Tap any mood deck below to unlock our 20 hand-stitched curations. From everlasting floral romance to squishy desk companions.
            </p>
          </div>

          {/* Quick Filter Pill Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedMood('all')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap shrink-0 border ${
                selectedMood === 'all'
                  ? 'bg-[#841724] text-[#faedd3] border-[#841724] shadow-md'
                  : 'bg-[#faedd3] text-[#2b0b12] border-[#841724]/20 hover:border-[#841724]/40'
              }`}
            >
              ✨ All 20 Curations
            </button>
          </div>
        </div>

        {/* 5) 4-CARD DECKS ROW (2 cols on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10 sm:mb-16">
          {MOOD_DECKS.map((deck) => {
            const isSelected = selectedMood === deck.id;

            return (
              <div
                key={deck.id}
                onClick={() => setSelectedMood(isSelected ? 'all' : deck.id)}
                className={`relative rounded-2xl sm:rounded-3xl p-3 sm:p-6 cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-xl ${
                  isSelected
                    ? 'border-[#841724] ring-2 ring-[#841724]/40 scale-[1.02] bg-[#faedd3]'
                    : 'border-[#841724]/15 hover:border-[#841724]/40 bg-white/80 hover:bg-white'
                }`}
              >
                {/* Top Badge & Count */}
                <div className="flex items-center justify-between mb-2 sm:mb-4 z-10">
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/90 text-[#841724] text-[9px] sm:text-[11px] font-black uppercase tracking-wider backdrop-blur-sm border border-[#841724]/15 shadow-sm">
                    {deck.badge}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-[#7c5c62]">
                    {deck.count} Pcs
                  </span>
                </div>

                {/* Deck Visual Thumbnail in Rounded Frame */}
                <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-white/80 mb-2.5 sm:mb-4 border border-[#841724]/10">
                  <img
                    src={deck.image}
                    alt={deck.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-base font-bold text-[#2b0b12] font-serif group-hover:text-[#841724] transition-colors line-clamp-1">
                      {deck.title}
                    </h3>
                    <div className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'bg-[#841724] text-[#faedd3]' : 'bg-white/80 text-[#841724] group-hover:bg-[#841724] group-hover:text-[#faedd3]'
                    }`}>
                      <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#7c5c62] mt-0.5 sm:mt-1 font-medium leading-tight sm:leading-relaxed line-clamp-2">
                    {deck.subtitle}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* 6) 20 PRODUCTS SHOWCASE FOR THE ABOVE */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#841724]" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#2b0b12] font-serif">
                {selectedMood === 'all' 
                  ? 'Curated 20 Products' 
                  : `${MOOD_DECKS.find((d) => d.id === selectedMood)?.title} (${displayedProducts.length} Pieces)`}
              </h3>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#841724] bg-[#841724]/10 px-3 py-1 rounded-full border border-[#841724]/20">
              Showing {displayedProducts.length} Handcrafted Gems
            </span>
          </div>

          {/* 20 Products Grid (2 cols mobile, 3 cols sm, 4 cols lg) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {displayedProducts.map((product) => (
              <ModernProductCard
                key={product.id}
                product={product}
                badgeText={product.badge}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
