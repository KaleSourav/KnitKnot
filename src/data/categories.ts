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

export const MAIN_CATEGORIES: MainCategory[] = [

  {
    id: 'flowers',
    slug: 'flowers',
    name: 'Flowers',
    count: 89,
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
    count: 55,
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
    id: 'accessories',
    slug: 'accessories',
    name: 'Accessories',
    count: 26,
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
    count: 32,
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
 * Maps any raw product category or title to one of the 8 core Knotsnco categories.
 */
export function mapToMainCategory(rawCategory: string = '', title: string = ''): string {
  const c = (rawCategory || '').toLowerCase();
  const t = (title || '').toLowerCase();

  // 1. Primary check: Respect Shopify productType/rawCategory if explicitly specified
  if (c.includes('flower pot') || c.includes('pot') || c.includes('vase')) return 'Flower Pots';
  if (c.includes('keychain') || c.includes('bag charm') || c.includes('charm')) return 'Keychains';
  if (c.includes('bag') || c.includes('tote')) return 'Bags';
  if (c.includes('plushie') || c.includes('character')) return 'Plushies';
  if (c.includes('standee') || c.includes('magnet') || c.includes('decor')) return 'Home Decor';
  if (c.includes('hair') || c.includes('bandana') || c.includes('earring') || c.includes('accessory')) return 'Accessories';
  if (c.includes('bouquet')) return 'Bouquets';
  if (c.includes('flower') || c.includes('filler')) return 'Flowers';

  // 2. Secondary fallback: Title heuristics if rawCategory was ambiguous or empty
  if (t.includes('bouquet')) return 'Bouquets';
  if (t.includes('keychain') || t.includes('charm')) return 'Keychains';
  if (t.includes('tote') || t.includes('bag') || t.includes('potli')) return 'Bags';
  if (t.includes('plushie') || t.includes('duck') || t.includes('teddy')) return 'Plushies';
  if (t.includes('magnet') || t.includes('frame') || t.includes('standee')) return 'Home Decor';
  if (t.includes('clip') || t.includes('bandana') || t.includes('earring') || t.includes('stud') || t.includes('gajra') || t.includes('scrunchie')) return 'Accessories';
  if (t.includes('pot') || t.includes('planter')) return 'Flower Pots';
  if (t.includes('tulip') || t.includes('rose') || t.includes('sunflower') || t.includes('lily') || t.includes('daisy') || t.includes('flower')) return 'Flowers';

  return 'Flowers';
}

export function getCategorySlug(categoryName: string): string {
  switch (categoryName) {
    case 'Flowers':
      return 'flowers';
    case 'Flower Pots':
      return 'flower-pots';
    case 'Keychains & Bag Charms':
      return 'keychains-and-bag-charms';
    case 'Accessories':
      return 'accessories';
    case 'Bags':
      return 'bags';
    case 'Home Decor':
      return 'home-decor';
    default:
      return 'flowers';
  }
}

// Backward compatibility alias
export const CATEGORIES_DATA = MAIN_CATEGORIES;

