/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MainCategory {
  id: string;
  slug: string;
  name: string;
  count: number;
  tagline: string;
  description: string;
  image: string;
  accentBg: string;
  accentBorder: string;
  badge: string;
  editorialNote: string;
  subcategories: string[];
}

export interface ProductLike {
  name?: string;
  title?: string;
  category?: string;
  rawCategory?: string;
  productType?: string;
  tags?: string[];
}

/**
 * Exact collection counts matching Shopify Admin Collections dashboard.
 */
export const SHOPIFY_COLLECTION_COUNTS: Record<string, number> = {
  'flowers': 87,
  'bouquets': 42,
  'keychains': 48,
  'keychains-and-bag-charms': 48,
  'flower pots': 40,
  'flower-pots': 40,
  'plushies': 33,
  'home decor': 30,
  'home-decor': 30,
  'bags': 21,
  'accessories': 28,
};

// Builder stems / items excluded from pre-made Bouquets collection in Shopify
export const EXCLUDED_BOUQUET_TITLES = new Set([
  'Pink Daisy',
  'Big Leaf',
  'Rounded Leaf',
  'Sunflower With Honeybee Pot',
  'Shaded Rose Peach - Pack of 2',
  'Regular Sunflower',
  'Tiger Lily White',
  'Mod Leaf',
  'White Tulip',
  'Shaded Lily',
  'Jasmine Filler',
  'Rose Blue',
  'Tiger Lily Red',
]);

// Loose charms excluded from Keychains collection in Shopify
export const EXCLUDED_KEYCHAIN_TITLES = new Set([
  'Maroon Puffy Flower Charm',
  'Pink Puffy Flower Charm',
  'Yellow Puffy Flower Charm',
  'Bell Bottom Flower Charm',
  'Evil Eye Charm',
  'Rose Bag Charm',
  'Spiderman Car Charm',
]);

// Photo frames excluded from Home Decor collection in Shopify
export const EXCLUDED_HOME_DECOR_TITLES = new Set([
  'Puffy Sunflower Frame',
  'Daisy Photo Frame',
]);

/**
 * Maps any product or node to its exact Shopify Collection (8 core collections).
 * Returns the normalized collection slug, or null if the product is uncollected (e.g. builder stem/charm).
 */
export function getShopifyCollection(p: ProductLike): string | null {
  const title = (p.name || p.title || '').trim();
  const tags = (p.tags || []).map((t) => t.toLowerCase().trim());

  // 1. Tag-based matching with collection-specific exclusions (matches Shopify Collections 100%)
  for (const t of tags) {
    if (t === 'knotsnco-collection-flowers' || t === 'flowers') {
      return 'flowers';
    }
    if (t === 'knotsnco-collection-bouquets' || t === 'bouquets') {
      if (EXCLUDED_BOUQUET_TITLES.has(title)) return null;
      return 'bouquets';
    }
    if (t === 'knotsnco-collection-keychains' || t === 'keychains') {
      if (EXCLUDED_KEYCHAIN_TITLES.has(title)) return null;
      return 'keychains';
    }
    if (t === 'knotsnco-collection-flower-pots' || t === 'flower pots' || t === 'flower-pots') {
      return 'flower pots';
    }
    if (t === 'knotsnco-collection-plushies' || t === 'plushies') {
      return 'plushies';
    }
    if (t === 'knotsnco-collection-home-decor' || t === 'home decor' || t === 'home-decor') {
      if (EXCLUDED_HOME_DECOR_TITLES.has(title)) return null;
      return 'home decor';
    }
    if (t === 'knotsnco-collection-bags' || t === 'bags') {
      return 'bags';
    }
    if (t === 'knotsnco-collection-accessories' || t === 'accessories') {
      return 'accessories';
    }
  }

  // 2. Fallback to productType / category / title heuristics if untagged
  const type = (p.productType || p.rawCategory || p.category || '').toLowerCase().trim();
  const lowerTitle = title.toLowerCase();

  if (type.includes('flower pot') || type.includes('pot') || lowerTitle.includes('flower pot') || lowerTitle.includes('planter')) {
    return 'flower pots';
  }
  if (type.includes('keychain') || lowerTitle.includes('keychain')) {
    if (EXCLUDED_KEYCHAIN_TITLES.has(title)) return null;
    return 'keychains';
  }
  if (type.includes('tote') || type.includes('bag') || lowerTitle.includes('tote') || lowerTitle.includes('bag') || lowerTitle.includes('potli')) {
    return 'bags';
  }
  if (type.includes('plushie') || type.includes('character') || lowerTitle.includes('plushie') || lowerTitle.includes('duck') || lowerTitle.includes('teddy')) {
    return 'plushies';
  }
  if (type.includes('standee') || type.includes('magnet') || type.includes('decor') || lowerTitle.includes('magnet') || lowerTitle.includes('standee')) {
    if (EXCLUDED_HOME_DECOR_TITLES.has(title)) return null;
    return 'home decor';
  }
  if (type.includes('hair') || type.includes('bandana') || type.includes('earring') || type.includes('clip') || type.includes('gajra') || lowerTitle.includes('clip') || lowerTitle.includes('bandana') || lowerTitle.includes('earring') || lowerTitle.includes('stud') || lowerTitle.includes('gajra') || lowerTitle.includes('scrunchie')) {
    return 'accessories';
  }
  if (type.includes('bouquet') || lowerTitle.includes('bouquet')) {
    if (EXCLUDED_BOUQUET_TITLES.has(title)) return null;
    return 'bouquets';
  }
  if (type.includes('flower') || lowerTitle.includes('rose') || lowerTitle.includes('tulip') || lowerTitle.includes('sunflower') || lowerTitle.includes('lily') || lowerTitle.includes('daisy')) {
    return 'flowers';
  }

  return null;
}

export const MAIN_CATEGORIES: MainCategory[] = [
  {
    id: 'flowers',
    slug: 'flowers',
    name: 'Flowers',
    count: 87,
    tagline: 'Flowers That Never Ghost You 🌸',
    description: 'Handcrafted single roses, pastel tulips, sunny sunflowers, lilies & daisies stitched with love by our Dadis.',
    image: '/products/bouquet.jpg',
    accentBg: '#F5C4D5', // Pastel Pink
    accentBorder: '#811B2B',
    badge: 'Everlasting Blooms',
    editorialNote: 'No wilting, no watering — just pure handmade joy on your table.',
    subcategories: ['Crochet Roses', 'Pastel Tulips', 'Sunflowers', 'Calla Lilies', 'Daisies', 'Fillers & Foliage'],
  },
  {
    id: 'bouquets',
    slug: 'bouquets',
    name: 'Bouquets',
    count: 42,
    tagline: 'Arrangements That Last Forever 💐',
    description: 'Pre-assembled artisanal bouquets wrapped in butter yellow paper and satin ribbons for unforgettable celebrations.',
    image: '/products/bouquet.jpg',
    accentBg: '#FFF2A3', // Soft Butter Yellow
    accentBorder: '#811B2B',
    badge: 'Artisan Bouquets',
    editorialNote: 'Every bouquet is carefully curated, tied by hand, and arrives in pristine presentation boxes.',
    subcategories: ['Grand Bouquets', 'Pastel Mixes', 'Rose Bunches', 'Sunflower Bundles'],
  },
  {
    id: 'flower-pots',
    slug: 'flower-pots',
    name: 'Flower Pots',
    count: 40,
    tagline: 'Cozy Desktop Gardens 🪴',
    description: 'Mini knitted desk planters, fairy-lit lily pots, smiling heart pots & blooming potted plants for your study desk.',
    image: '/products/tulips.jpg',
    accentBg: '#C5E7D4', // Muted Mint
    accentBorder: '#811B2B',
    badge: 'Desktop Companions',
    editorialNote: 'Bring a touch of calm greenery and handmade warmth to your workspace.',
    subcategories: ['Lit Lily Pots', 'Heart Pots', 'Potted Tulips', 'Daisy Planters', 'Ceramic & Knitted Bases'],
  },
  {
    id: 'keychains-and-bag-charms',
    slug: 'keychains-and-bag-charms',
    name: 'Keychains & Bag Charms',
    count: 48,
    tagline: 'Little Friends On The Go 🔑',
    description: 'Amigurumi fruit turtles, cute duckies, puffy floral charms, and lucky evil eyes to carry everywhere.',
    image: '/products/bunny.jpg',
    accentBg: '#F5DD91', // Butter Yellow
    accentBorder: '#811B2B',
    badge: 'Pocket Pals',
    editorialNote: 'Attach them to your tote or backpack for instant dopamine.',
    subcategories: ['Fruit Turtles', 'Amigurumi Animals', 'Puffy Flower Charms', 'Evil Eye Talismans', 'Mini Bouquets'],
  },
  {
    id: 'plushies',
    slug: 'plushies',
    name: 'Plushies',
    count: 33,
    tagline: 'Squishy Amigurumi Buddies 🧸',
    description: 'Chubby crochet animals, huggable teddy bears, sleepy bunnies and playful character plushies.',
    image: '/products/bunny.jpg',
    accentBg: '#E8D5F5', // Soft Lilac
    accentBorder: '#811B2B',
    badge: 'Huggable Friends',
    editorialNote: 'Stuffed with hypoallergenic plush fill and made to be cherished forever.',
    subcategories: ['Teddy Bears', 'Sleepy Bunnies', 'Fruit Pals', 'Desk Plushies'],
  },
  {
    id: 'accessories',
    slug: 'accessories',
    name: 'Accessories',
    count: 28,
    tagline: 'Wearable Handmade Art 🎀',
    description: 'Hand-knitted bandanas, dainty floral earrings, hair scrunchies & clips designed for playful Gen-Z styling.',
    image: '/products/accessories.jpg',
    accentBg: '#F4D2BB', // Soft Peach
    accentBorder: '#811B2B',
    badge: 'Slow Fashion',
    editorialNote: 'Crafted with super-soft combed cotton for everyday comfort and compliments.',
    subcategories: ['Floral Bandanas', 'Crochet Hairclips', 'Statement Earrings', 'Scrunchies'],
  },
  {
    id: 'bags',
    slug: 'bags',
    name: 'Bags',
    count: 21,
    tagline: 'Statement Granny Square Totes 👜',
    description: 'Handcrafted floral tote bags, boho shoulder carryalls, and phone pouches stitched with durable cotton yarn.',
    image: '/products/tote.jpg',
    accentBg: '#BBDDEB', // Powder Blue
    accentBorder: '#811B2B',
    badge: 'Boutique Carryalls',
    editorialNote: 'Sturdy, roomy, and completely unique — turn sidewalks into runways.',
    subcategories: ['Daisy Totes', 'Granny Square Bags', 'Shoulder Pouches', 'Crossbody Slings'],
  },
  {
    id: 'home-decor',
    slug: 'home-decor',
    name: 'Home Decor',
    count: 30,
    tagline: 'Handmade Cozy Corners 🛋️',
    description: 'Cute crochet standees, fridge magnets, amigurumi characters & table centerpieces to brighten your room.',
    image: '/products/utility.jpg',
    accentBg: '#FFF5CC', // Warm Cream
    accentBorder: '#811B2B',
    badge: 'Room Accents',
    editorialNote: 'Add soft textures and handcrafted whimsy to any nook in your home.',
    subcategories: ['Table Standees', 'Cute Fridge Magnets', 'Amigurumi Figures', 'Knitted Vases'],
  },
];

/**
 * Normalizes any category string for consistent matching across UI components.
 */
export function normalizeCategory(cat?: string): string {
  if (!cat) return '';
  const cleaned = cat.toLowerCase().replace(/[-_]/g, ' ').trim();
  if (cleaned === 'bouquet' || cleaned === 'bouquets') return 'bouquets';
  if (cleaned === 'flower' || cleaned === 'flowers') return 'flowers';
  if (cleaned === 'keychain' || cleaned === 'keychains' || cleaned === 'keychains and bag charms' || cleaned === 'bag charms' || cleaned === 'charms') return 'keychains';
  if (cleaned === 'bag' || cleaned === 'bags') return 'bags';
  if (cleaned === 'plushie' || cleaned === 'plushies' || cleaned === 'characters') return 'plushies';
  if (cleaned === 'flower pot' || cleaned === 'flower pots' || cleaned === 'flower-pots' || cleaned === 'pots' || cleaned === 'vases') return 'flower pots';
  if (cleaned === 'home decor' || cleaned === 'homedecor' || cleaned === 'decor') return 'home decor';
  if (cleaned === 'accessory' || cleaned === 'accessories') return 'accessories';
  return cleaned;
}

/**
 * Maps any raw product category, title or tags to one of the core Knotsnco categories.
 */
export function mapToMainCategory(rawCategory: string = '', title: string = '', tags: string[] = []): string {
  const col = getShopifyCollection({ productType: rawCategory, rawCategory, title, name: title, tags });
  if (col) {
    switch (col) {
      case 'flowers': return 'Flowers';
      case 'bouquets': return 'Bouquets';
      case 'keychains': return 'Keychains';
      case 'flower pots': return 'Flower Pots';
      case 'plushies': return 'Plushies';
      case 'home decor': return 'Home Decor';
      case 'bags': return 'Bags';
      case 'accessories': return 'Accessories';
    }
  }

  const t = title.trim();
  if (EXCLUDED_BOUQUET_TITLES.has(t)) return 'Bouquet Stems';
  if (EXCLUDED_KEYCHAIN_TITLES.has(t)) return 'Bag Charms';
  if (EXCLUDED_HOME_DECOR_TITLES.has(t)) return 'Home Decor Frames';

  return 'Flowers';
}

export function getCategorySlug(categoryName: string): string {
  switch (categoryName) {
    case 'Flowers':
      return 'flowers';
    case 'Bouquets':
      return 'bouquets';
    case 'Flower Pots':
      return 'flower-pots';
    case 'Keychains':
    case 'Keychains & Bag Charms':
      return 'keychains';
    case 'Plushies':
      return 'plushies';
    case 'Accessories':
      return 'accessories';
    case 'Bags':
      return 'bags';
    case 'Home Decor':
      return 'home-decor';
    default:
      return normalizeCategory(categoryName);
  }
}

// Backward compatibility alias
export const CATEGORIES_DATA = MAIN_CATEGORIES;

