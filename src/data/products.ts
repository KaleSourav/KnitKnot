/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SHOPIFY_CATALOG } from './shopifyCatalog';

export interface Product {
  id: string;
  shopifyId?: string;
  variantId?: string;
  handle?: string;
  name: string;
  category: string;
  group?: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  description: string;
  details: string[];
  inStock: boolean;
  featuredInHero?: boolean;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export const PRODUCTS: Product[] = SHOPIFY_CATALOG;
