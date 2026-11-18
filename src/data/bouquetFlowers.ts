/**
 * Bouquet Builder Configuration & Data
 * Real individual crochet flower stems, wrapping papers, ribbons, and gift card styles for Knots & Co.
 */

import rawStems from './curatedBouquetStems.json';

export interface FlowerStem {
  id: string;
  variantId: string;
  name: string;
  category: string;
  price: number;
  image: string;
  cutoutImage?: string;
  color: string;
  description: string;
}

export interface WrappingOption {
  id: string;
  name: string;
  colorHex: string;
  borderColor: string;
  foldColor: string;
  shadowColor: string;
  previewClass?: string;
}

export interface RibbonOption {
  id: string;
  name: string;
  colorHex: string;
  textColor: string;
}

export interface CardStyleOption {
  id: string;
  name: string;
  bgHex: string;
  borderHex: string;
  fontColor: string;
  accentEmoji?: string;
}

export interface SelectedFlowerItem {
  flower: FlowerStem;
  quantity: number;
}

export interface CustomBouquetState {
  flowers: Record<string, SelectedFlowerItem>; // keyed by variantId
  wrapping: WrappingOption;
  ribbon: RibbonOption;
  note: {
    recipient: string;
    message: string;
    sender: string;
    cardStyle: string;
    isTucked: boolean;
  };
  delivery: {
    address: string;
    date: string;
    deliveryNotes: string;
  };
}

// ─── 1. REAL FLOWER STEMS (From Shopify Catalog) ─────────────────────────────
export const FLOWER_STEMS: FlowerStem[] = rawStems as FlowerStem[];

export const STEM_CATEGORIES = [
  'All Blooms',
  'Roses',
  'Sunflowers',
  'Tulips',
  'Daisies & Blooms',
  'Lilies & Lotus',
  'Lavender & Pastels',
  'Fillers & Foliage',
];

// ─── 2. WRAPPING PAPER OPTIONS ───────────────────────────────────────────────
export const WRAPPING_OPTIONS: WrappingOption[] = [
  {
    id: 'butter-yellow',
    name: 'Sunbeam Yellow',
    colorHex: '#F6E07A',
    borderColor: '#D4B841',
    foldColor: '#FDF1A9',
    shadowColor: 'rgba(212, 184, 65, 0.35)',
  },
  {
    id: 'soft-pink',
    name: 'Blush Petal',
    colorHex: '#F8D9D8',
    borderColor: '#E2B4B2',
    foldColor: '#FEEAEA',
    shadowColor: 'rgba(226, 180, 178, 0.35)',
  },
  {
    id: 'warm-cream',
    name: 'Butter Cream',
    colorHex: '#FFF5CC',
    borderColor: '#E6D7A3',
    foldColor: '#FFFBEA',
    shadowColor: 'rgba(230, 215, 163, 0.35)',
  },
  {
    id: 'pastel-blue',
    name: 'Cloud Blue',
    colorHex: '#D9EEF5',
    borderColor: '#B0D6E2',
    foldColor: '#EEF8FB',
    shadowColor: 'rgba(176, 214, 226, 0.35)',
  },
  {
    id: 'pure-offwhite',
    name: 'Linen White',
    colorHex: '#FFFEF8',
    borderColor: '#DCD4C0',
    foldColor: '#FFFFFF',
    shadowColor: 'rgba(220, 212, 192, 0.35)',
  },
  {
    id: 'royal-burgundy',
    name: 'Heritage Burgundy',
    colorHex: '#811B2B',
    borderColor: '#5C121E',
    foldColor: '#A3283C',
    shadowColor: 'rgba(129, 27, 43, 0.35)',
  },
  {
    id: 'kraft-earth',
    name: 'Vintage Kraft',
    colorHex: '#E5D3BD',
    borderColor: '#BAA286',
    foldColor: '#F3E8DC',
    shadowColor: 'rgba(186, 162, 134, 0.35)',
  },
];

// ─── 3. RIBBON & BOW OPTIONS ─────────────────────────────────────────────────
export const RIBBON_OPTIONS: RibbonOption[] = [
  {
    id: 'burgundy-velvet',
    name: 'Burgundy Velvet',
    colorHex: '#811B2B',
    textColor: '#FFFFFF',
  },
  {
    id: 'butter-yellow',
    name: 'Sunbeam Satin',
    colorHex: '#F5D76E',
    textColor: '#641623',
  },
  {
    id: 'soft-pink',
    name: 'Petal Grosgrain',
    colorHex: '#F8B6BA',
    textColor: '#641623',
  },
  {
    id: 'cloud-blue',
    name: 'Cloud Blue Silk',
    colorHex: '#9CD1E5',
    textColor: '#1A4958',
  },
  {
    id: 'silk-cream',
    name: 'Silk Off-White',
    colorHex: '#FFF8E6',
    textColor: '#641623',
  },
];

// ─── 4. CARD STYLES ──────────────────────────────────────────────────────────
export const CARD_STYLES: CardStyleOption[] = [
  {
    id: 'scallop-pink',
    name: 'Scallop Rose',
    bgHex: '#FFF2F4',
    borderHex: '#F09EA7',
    fontColor: '#811B2B',
  },
  {
    id: 'butter-cream',
    name: 'Butter Cream',
    bgHex: '#FFFCEB',
    borderHex: '#E5CD7E',
    fontColor: '#641623',
  },
  {
    id: 'cloud-pastel',
    name: 'Soft Lavender',
    bgHex: '#F4EEFC',
    borderHex: '#C5A9EC',
    fontColor: '#4A2A6F',
  },
];

// ─── 5. INITIAL BOUQUET STATE ────────────────────────────────────────────────
export const DEFAULT_BOUQUET_STATE: CustomBouquetState = {
  flowers: {},
  wrapping: WRAPPING_OPTIONS[0],
  ribbon: RIBBON_OPTIONS[0],
  note: {
    recipient: '',
    message: '',
    sender: '',
    cardStyle: CARD_STYLES[0].id,
    isTucked: false,
  },
  delivery: {
    address: '',
    date: '',
    deliveryNotes: '',
  },
};
