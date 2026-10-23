/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CategoryItem {
  id: string;
  name: string;
  count: number;
  iconName: string;
  emoji: string;
  tagline: string;
  description: string;
  group: 'Florals' | 'Home & Decor' | 'Charms & Minis' | 'Wearables & Bags' | 'Amigurumi';
  image: string;
  accentBg: string;
  accentText: string;
  badge?: string;
}

export interface MegaCategoryGroup {
  id: string;
  name: string;
  count: number;
  tagline: string;
  description: string;
  categories: string[];
  image: string;
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'cat-flowers',
    name: 'Flowers',
    count: 61,
    iconName: 'Flower2',
    emoji: '🌸',
    tagline: 'Everlasting Stems & Blooms',
    description: 'Handcrafted single roses, tulips, lilies, daisies & sunflowers that will never wilt or fade.',
    group: 'Florals',
    image: '/products/bouquet.jpg',
    accentBg: 'bg-pink-500/10 border-pink-500/20 text-pink-300',
    accentText: 'text-pink-400',
    badge: '61 Stems',
  },
  {
    id: 'cat-keychains',
    name: 'Keychains',
    count: 40,
    iconName: 'Key',
    emoji: '🔑',
    tagline: 'Pocket Pals & Fruit Turtles',
    description: 'Adorably tiny turtles, bunnies, geese, mini bouquets & octopus keychains made to travel everywhere with you.',
    group: 'Charms & Minis',
    image: '/products/bunny.jpg',
    accentBg: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
    accentText: 'text-amber-400',
    badge: '40 Minis',
  },
  {
    id: 'cat-fillers',
    name: 'Fillers',
    count: 22,
    iconName: 'Leaf',
    emoji: '🌿',
    tagline: 'Bouquet Foliage & Leaves',
    description: 'Monstera leaves, sage sprigs, baby’s breath & eucalyptus stems to customize your dream arrangement.',
    group: 'Florals',
    image: '/products/byob.jpg',
    accentBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    accentText: 'text-emerald-400',
    badge: '22 Foliage',
  },
  {
    id: 'cat-flower-pots',
    name: 'Flower Pots',
    count: 21,
    iconName: 'Flower',
    emoji: '🪴',
    tagline: 'Desktop Potted Plants',
    description: 'Lit lily pots, heart pots, single and double tulip desk planters with cozy knitted soil.',
    group: 'Home & Decor',
    image: '/products/tulips.jpg',
    accentBg: 'bg-teal-500/10 border-teal-500/20 text-teal-300',
    accentText: 'text-teal-400',
    badge: '21 Planters',
  },
  {
    id: 'cat-bags',
    name: 'Bags',
    count: 19,
    iconName: 'ShoppingBag',
    emoji: '👜',
    tagline: 'Artisan Granny Square Totes',
    description: 'Floral daisy totes, boho sunflower carryalls, ocean bloom mermaid bags & puffy shoulder pouches.',
    group: 'Wearables & Bags',
    image: '/products/tote.jpg',
    accentBg: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
    accentText: 'text-purple-400',
    badge: '19 Totes',
  },
  {
    id: 'cat-vases',
    name: 'Vases',
    count: 19,
    iconName: 'Sparkles',
    emoji: '🏺',
    tagline: 'Display Arrangements & Gardens',
    description: 'Multi-stem daisy vases, rose valley centerpieces and pastel tabletop flower gardens.',
    group: 'Home & Decor',
    image: '/products/bouquet.jpg',
    accentBg: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
    accentText: 'text-rose-400',
    badge: '19 Vases',
  },
  {
    id: 'cat-standees',
    name: 'Standees',
    count: 15,
    iconName: 'Smile',
    emoji: '🪞',
    tagline: 'Tabletop Character Standees',
    description: 'Playful desktop standees featuring Snoopy, Cinderella, Spider-Man, Batman, and Mickey.',
    group: 'Home & Decor',
    image: '/products/utility.jpg',
    accentBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
    accentText: 'text-indigo-400',
    badge: '15 Standees',
  },
  {
    id: 'cat-hair-accessories',
    name: 'Hair Accessories',
    count: 15,
    iconName: 'Sparkles',
    emoji: '🎀',
    tagline: 'Clips, Gajras & Scrunchies',
    description: 'White and pink cherry blossom hairclips, festive crochet mogra gajras, and daisy barrettes.',
    group: 'Wearables & Bags',
    image: '/products/accessories.jpg',
    accentBg: 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-300',
    accentText: 'text-fuchsia-400',
    badge: '15 Pieces',
  },
  {
    id: 'cat-fridge-magnets',
    name: 'Fridge Magnets',
    count: 12,
    iconName: 'Heart',
    emoji: '🧲',
    tagline: 'Miniature Potted Magnets',
    description: 'Charming mini sunflower, daisy, and baby breath magnetic pots to brighten up your kitchen or desk board.',
    group: 'Home & Decor',
    image: '/products/utility.jpg',
    accentBg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300',
    accentText: 'text-yellow-400',
    badge: '12 Magnets',
  },
  {
    id: 'cat-earrings',
    name: 'Earrings',
    count: 10,
    iconName: 'Sparkles',
    emoji: '💎',
    tagline: 'Handmade Studs & Drops',
    description: 'Ultra-lightweight watermelon studs, avo-love dangles, cherry blossoms, and blue orchid drop earrings.',
    group: 'Wearables & Bags',
    image: '/products/accessories.jpg',
    accentBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
    accentText: 'text-cyan-400',
    badge: '10 Pairs',
  },
  {
    id: 'cat-characters',
    name: 'Characters',
    count: 9,
    iconName: 'Heart',
    emoji: '🧸',
    tagline: 'Heirloom Amigurumi Plushies',
    description: 'Soft chenille chicks, Hello Kitty, pastel blue & pink penguins, and crochet birthday cake plush companions.',
    group: 'Amigurumi',
    image: '/products/bunny.jpg',
    accentBg: 'bg-pink-500/10 border-pink-500/20 text-pink-300',
    accentText: 'text-pink-400',
    badge: '9 Amigurumi',
  },
  {
    id: 'cat-bag-charms',
    name: 'Bag Charms',
    count: 6,
    iconName: 'ShoppingBag',
    emoji: '🏷️',
    tagline: 'Puffy Floral Accents',
    description: 'Maroon, pink & yellow puffy flower charms, evil eye protection charms, and bell bottom tassels.',
    group: 'Charms & Minis',
    image: '/products/accessories.jpg',
    accentBg: 'bg-violet-500/10 border-violet-500/20 text-violet-300',
    accentText: 'text-violet-400',
    badge: '6 Charms',
  },
  {
    id: 'cat-bandanas',
    name: 'Bandanas',
    count: 3,
    iconName: 'Sun',
    emoji: '🧣',
    tagline: 'Boho Crochet Headscarves',
    description: 'Artisanal open-stitch headscarves including Beachy, Red, and Floral Crochet Bandanas.',
    group: 'Wearables & Bags',
    image: '/products/cardigan.jpg',
    accentBg: 'bg-orange-500/10 border-orange-500/20 text-orange-300',
    accentText: 'text-orange-400',
    badge: '3 Styles',
  },
];

export const MEGA_GROUPS: MegaCategoryGroup[] = [
  {
    id: 'group-florals',
    name: 'Bouquets & Florals',
    count: 83,
    tagline: 'Everlasting Stems & Foliage',
    description: 'Roses, tulips, lilies, sunflowers & greenery leaves that stay vibrant forever.',
    categories: ['Flowers', 'Fillers'],
    image: '/products/bouquet.jpg',
  },
  {
    id: 'group-home',
    name: 'Home & Desk Decor',
    count: 67,
    tagline: 'Pots, Vases, Standees & Magnets',
    description: 'Knitted potted plants, ceramic style vases, tabletop character standees, and fridge magnets.',
    categories: ['Flower Pots', 'Vases', 'Standees', 'Fridge Magnets'],
    image: '/products/tulips.jpg',
  },
  {
    id: 'group-wearables',
    name: 'Wearables & Bags',
    count: 47,
    tagline: 'Artisan Totes, Clips & Jewelry',
    description: 'Granny square bags, floral hair accessories, handmade crochet earrings, and bandanas.',
    categories: ['Bags', 'Hair Accessories', 'Earrings', 'Bandanas'],
    image: '/products/tote.jpg',
  },
  {
    id: 'group-charms',
    name: 'Keychains & Charms',
    count: 46,
    tagline: 'Fruit Turtles & Pocket Minis',
    description: 'Portable handcrafted pocket friends, puffy flower charms, and keychain bouquets.',
    categories: ['Keychains', 'Bag Charms'],
    image: '/products/accessories.jpg',
  },
  {
    id: 'group-amigurumi',
    name: 'Amigurumi Plushies',
    count: 9,
    tagline: 'Hand-Stitched Soft Companions',
    description: 'Collectible characters, chenille chicks, Hello Kitty, and cuddly penguins.',
    categories: ['Characters'],
    image: '/products/bunny.jpg',
  },
];
