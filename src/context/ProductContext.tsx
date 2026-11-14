/**
 * ProductContext — Real-Time Shopify Auto-Sync Provider
 * Automatically syncs live products, prices, images, stock status, and titles from Shopify Storefront API.
 * 
 * Features:
 * - Instant Initial Render: Uses local JSON/localStorage cache so page loads in 0ms.
 * - Background Auto-Sync: Fetches live products from Shopify Storefront API on mount.
 * - Tab-Focus Auto-Sync: Automatically re-checks Shopify whenever the user switches back to this tab.
 * - Periodic Auto-Sync: Polls Shopify every 60 seconds while the page is active.
 * - Real-Time Single Product Query: Queries individual products for instant real-time price & stock updates.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { ALL_PRODUCTS, ShopProduct } from '../data/allProductsData';
import { shopifyFetch } from '../services/shopify';
import { mapToMainCategory } from '../data/categories';

// ─── LocalStorage Cache Keys ─────────────────────────────────────────────────

const LS_CATALOG_KEY = 'knotsnco_live_catalog';
const LS_CATALOG_TS_KEY = 'knotsnco_catalog_timestamp';

// ─── Context Interface ───────────────────────────────────────────────────────

interface ProductContextValue {
  products: ShopProduct[];
  isSyncing: boolean;
  lastSynced: Date | null;
  refreshProducts: () => Promise<void>;
  fetchSingleProduct: (idOrHandle: string) => Promise<ShopProduct | null>;
  getProduct: (idOrHandle: string) => ShopProduct | undefined;
}

const ProductContext = createContext<ProductContextValue | null>(null);

// ─── GraphQL Query for Catalog Batch ─────────────────────────────────────────

const GET_PRODUCTS_BATCH_QUERY = `
  query GetLiveProducts($cursor: String) {
    products(first: 100, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          updatedAt
          productType
          description
          tags
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

const GET_SINGLE_PRODUCT_BY_ID_QUERY = `
  query GetSingleProductById($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      updatedAt
      productType
      description
      tags
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            availableForSale
          }
        }
      }
    }
  }
`;

const GET_SINGLE_PRODUCT_BY_HANDLE_QUERY = `
  query GetSingleProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      updatedAt
      productType
      description
      tags
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            availableForSale
          }
        }
      }
    }
  }
`;

interface RawShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  updatedAt: string;
  productType: string;
  description: string;
  tags: string[];
  images: { edges: Array<{ node: { url: string; altText?: string | null } }> };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: { amount: string; currencyCode: string };
        compareAtPrice?: { amount: string; currencyCode: string } | null;
        availableForSale: boolean;
      };
    }>;
  };
}

// ─── Helpers: Transform Shopify Node to ShopProduct ──────────────────────────

function transformShopifyNode(
  node: RawShopifyProductNode,
  existingMap: Map<string, ShopProduct>
): ShopProduct {
  const existing = existingMap.get(node.id) || existingMap.get(node.handle);
  const firstVariant = node.variants?.edges?.[0]?.node;

  const imageUrls = (node.images?.edges || [])
    .map((e) => e.node.url)
    .filter(Boolean);
  const mainImage = imageUrls[0] || existing?.image || '';

  const price = firstVariant ? parseFloat(firstVariant.price.amount) : existing?.price || 499;
  const compareAt = firstVariant?.compareAtPrice ? parseFloat(firstVariant.compareAtPrice.amount) : null;
  const originalPrice = compareAt && compareAt > price ? compareAt : existing?.originalPrice || null;

  let discount: string | null = null;
  if (originalPrice && originalPrice > price) {
    const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
    discount = `${pct}% OFF`;
  }

  const category = mapToMainCategory(node.productType, node.title);

  const desc = (node.description || existing?.description || 'Handmade crochet, crafted with love by our artisans in Surat.')
    .replace(/\r?\n|\r/g, ' ')
    .trim();

  return {
    id: node.id,
    shopifyId: node.id,
    variantId: firstVariant?.id || existing?.variantId || undefined,
    handle: node.handle,
    name: node.title,
    subtitle: node.productType ? `Handmade Crochet ${node.productType}` : (existing?.subtitle || 'Handmade Crochet Creation'),
    category,
    rawCategory: node.productType || existing?.rawCategory || '',
    price,
    originalPrice,
    discount,
    badge: existing?.badge || null,
    image: mainImage,
    images: imageUrls.length > 0 ? imageUrls : existing?.images || [mainImage],
    colorSwatches: existing?.colorSwatches || ['#641623', '#FAF4ED'],
    inStock: firstVariant ? firstVariant.availableForSale !== false : true,
    occasions: existing?.occasions || ['Just Because', 'Birthdays', 'Anniversary'],
    color: existing?.color || 'Multi',
    description: desc,
    tags: node.tags || existing?.tags || [],
  };
}

// ─── Initial Hydration Helper ────────────────────────────────────────────────

function getInitialProducts(): ShopProduct[] {
  if (typeof window === 'undefined') return ALL_PRODUCTS;
  try {
    const cached = localStorage.getItem(LS_CATALOG_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return ALL_PRODUCTS;
}

// ─── Provider Component ──────────────────────────────────────────────────────

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ShopProduct[]>(getInitialProducts);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const ts = localStorage.getItem(LS_CATALOG_TS_KEY);
      return ts ? new Date(parseInt(ts, 10)) : null;
    } catch {
      return null;
    }
  });

  const isSyncingRef = useRef<boolean>(false);

  // Map for fast existing product lookup
  const existingMapRef = useRef<Map<string, ShopProduct>>(new Map());
  useEffect(() => {
    const map = new Map<string, ShopProduct>();
    for (const p of products) {
      map.set(p.id, p);
      if (p.shopifyId) map.set(p.shopifyId, p);
      if (p.handle) map.set(p.handle, p);
    }
    existingMapRef.current = map;
  }, [products]);

  /**
   * Fetches all live products from Shopify Storefront API and updates the state.
   */
  const refreshProducts = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    setIsSyncing(true);

    try {
      let hasNext = true;
      let cursor: string | null = null;
      const allNodes: RawShopifyProductNode[] = [];

      while (hasNext && allNodes.length < 500) {
        const data: {
          products?: {
            pageInfo: { hasNextPage: boolean; endCursor: string | null };
            edges: Array<{ node: RawShopifyProductNode }>;
          };
        } = await shopifyFetch(GET_PRODUCTS_BATCH_QUERY, { cursor });

        const edges = data.products?.edges || [];
        for (const e of edges) {
          allNodes.push(e.node);
        }

        hasNext = data.products?.pageInfo?.hasNextPage || false;
        cursor = data.products?.pageInfo?.endCursor || null;
        if (!cursor) break;
      }

      if (allNodes.length > 0) {
        const transformed = allNodes.map((node) =>
          transformShopifyNode(node, existingMapRef.current)
        );

        setProducts(transformed);
        const now = new Date();
        setLastSynced(now);

        try {
          localStorage.setItem(LS_CATALOG_KEY, JSON.stringify(transformed));
          localStorage.setItem(LS_CATALOG_TS_KEY, String(now.getTime()));
        } catch {}

        console.log(`[Shopify Auto-Sync] Successfully synchronized ${transformed.length} live products.`);
      }
    } catch (err) {
      console.warn('[Shopify Auto-Sync] Could not reach Shopify Storefront API, using cached catalog:', err);
    } finally {
      setIsSyncing(false);
      isSyncingRef.current = false;
    }
  }, []);

  /**
   * Fetch a single product by ID or handle for real-time single-item freshness.
   */
  const fetchSingleProduct = useCallback(async (idOrHandle: string): Promise<ShopProduct | null> => {
    if (!idOrHandle) return null;
    try {
      const isGid = idOrHandle.startsWith('gid://shopify/Product/');
      const query = isGid ? GET_SINGLE_PRODUCT_BY_ID_QUERY : GET_SINGLE_PRODUCT_BY_HANDLE_QUERY;
      const variables = isGid ? { id: idOrHandle } : { handle: idOrHandle };

      const data: { product?: RawShopifyProductNode | null } = await shopifyFetch(query, variables);
      if (data.product) {
        const updated = transformShopifyNode(data.product, existingMapRef.current);
        // Update product in-memory list
        setProducts((prev) => {
          const idx = prev.findIndex((p) => p.id === updated.id || p.handle === updated.handle);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = updated;
            return next;
          }
          return [updated, ...prev];
        });
        return updated;
      }
    } catch (err) {
      console.warn(`[Shopify Auto-Sync] Failed single product fetch for ${idOrHandle}:`, err);
    }
    return null;
  }, []);

  /**
   * Fast synchronous lookup from memory
   */
  const getProduct = useCallback((idOrHandle: string): ShopProduct | undefined => {
    if (!idOrHandle) return undefined;
    return (
      products.find(
        (p) =>
          p.id === idOrHandle ||
          p.shopifyId === idOrHandle ||
          p.handle === idOrHandle ||
          (p.handle && p.handle.toLowerCase() === idOrHandle.toLowerCase())
      ) || undefined
    );
  }, [products]);

  // Initial auto-sync on mount
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Tab focus / visibility change auto-sync (fires when merchant returns from Shopify Admin)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Automatically check for fresh updates from Shopify
        refreshProducts();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [refreshProducts]);

  // Periodic auto-sync: every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshProducts();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [refreshProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        isSyncing,
        lastSynced,
        refreshProducts,
        fetchSingleProduct,
        getProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used inside <ProductProvider>');
  return ctx;
}
