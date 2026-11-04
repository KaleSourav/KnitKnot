import allProductsRaw from './allProductsData.json';

export interface ShopProduct {
  id: string;
  shopifyId?: string;
  variantId?: string;
  name: string;
  subtitle: string;
  category: 'Flowers' | 'Bouquets' | 'Plushies' | 'Bags' | 'Keychains' | 'Home Decor' | 'Flower Pots';
  price: number;
  originalPrice?: number | null;
  discount?: string | null;
  badge?: string | null;
  image: string;
  colorSwatches: string[];
  inStock: boolean;
  occasions: string[];
  color: string;
}

export const ALL_PRODUCTS: ShopProduct[] = allProductsRaw as ShopProduct[];
