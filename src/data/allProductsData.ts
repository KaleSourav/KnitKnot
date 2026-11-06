import allProductsRaw from './allProductsData.json';

export interface ShopProduct {
  id: string;
  shopifyId?: string;
  variantId?: string;
  handle?: string;
  name: string;
  subtitle: string;
  category: string;
  rawCategory?: string;
  price: number;
  originalPrice?: number | null;
  discount?: string | null;
  badge?: string | null;
  image: string;
  images?: string[];
  colorSwatches: string[];
  inStock: boolean;
  occasions: string[];
  color: string;
  description?: string;
  tags?: string[];
}

export const ALL_PRODUCTS: ShopProduct[] = allProductsRaw as ShopProduct[];
