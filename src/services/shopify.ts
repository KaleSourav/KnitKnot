/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, CartItem, PRODUCTS } from '../data/products';
import { mapToMainCategory } from '../data/categories';

const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '04wv6h-ut.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '0c626353bdea1d2a4c8f32890eb14565';
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-01';

const GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export function getImageForProduct(productType: string = '', title: string = ''): string {
  const t = title.toLowerCase();
  const pt = productType.toLowerCase();

  if (pt.includes('bag charm') || pt.includes('charm')) return '/products/accessories.jpg';
  if (pt.includes('keychain')) {
    if (t.includes('turtle') || t.includes('bunny') || t.includes('octopus') || t.includes('goose')) return '/products/bunny.jpg';
    if (t.includes('rose') || t.includes('sunflower') || t.includes('tulip') || t.includes('flower') || t.includes('bouquet')) return '/products/tulips.jpg';
    return '/products/accessories.jpg';
  }
  if (pt.includes('flower pot') || pt.includes('pot')) {
    if (t.includes('tulip') || t.includes('lily')) return '/products/tulips.jpg';
    return '/products/utility.jpg';
  }
  if (pt.includes('standee')) return '/products/utility.jpg';
  if (pt.includes('fridge magnet') || pt.includes('magnet')) return '/products/accessories.jpg';
  if (pt.includes('vase')) return '/products/bouquet.jpg';
  if (pt.includes('flower')) {
    if (t.includes('tulip')) return '/products/tulips.jpg';
    if (t.includes('sunflower') || t.includes('daisy')) return '/products/byob.jpg';
    return '/products/bouquet.jpg';
  }
  if (pt.includes('filler')) return '/products/byob.jpg';
  if (pt.includes('character')) return '/products/bunny.jpg';
  if (pt.includes('hair')) return '/products/accessories.jpg';
  if (pt.includes('bandana')) return '/products/cardigan.jpg';
  if (pt.includes('earring')) return '/products/accessories.jpg';
  if (pt.includes('bag')) return '/products/tote.jpg';

  return '/products/bouquet.jpg';
}

function getCategoryGroup(productType: string = ''): string {
  const pt = productType.trim();
  if (['Flowers', 'Fillers'].includes(pt)) return 'Bouquets & Florals';
  if (['Flower Pots', 'Vases', 'Standees', 'Fridge Magnets'].includes(pt)) return 'Home & Desk Decor';
  if (['Keychains', 'Bag Charms'].includes(pt)) return 'Keychains & Charms';
  if (['Bags', 'Hair Accessories', 'Earrings', 'Bandanas'].includes(pt)) return 'Wearables & Bags';
  if (['Characters'].includes(pt)) return 'Amigurumi Plushies';
  return 'Handcrafted Curations';
}

/**
 * Generic helper to send GraphQL requests to Shopify Storefront API
 */
export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API HTTP Error: ${response.status} ${response.statusText}`);
  }

  const json: GraphQLResponse<T> = await response.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(`Shopify GraphQL Error: ${json.errors.map((e) => e.message).join(', ')}`);
  }

  if (!json.data) {
    throw new Error('No data received from Shopify');
  }

  return json.data;
}

interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  tags: string[];
  images: { edges: Array<{ node: { url: string; altText: string } }> };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
        compareAtPrice: { amount: string; currencyCode: string } | null;
      };
    }>;
  };
}

/**
 * Fetches all products from Shopify Storefront API with cursor pagination.
 * Falls back to pre-compiled local catalog if network or API is unreachable.
 */
interface ProductsPageResponse {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    edges: Array<{ cursor: string; node: ShopifyProductNode }>;
  };
}

async function fetchProductsBatch(cursor: string | null): Promise<ProductsPageResponse> {
  const afterClause: string = cursor ? `, after: "${cursor}"` : '';
  const query: string = `
    query GetProducts {
      products(first: 100${afterClause}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            id
            title
            handle
            description
            productType
            tags
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  return shopifyFetch<ProductsPageResponse>(query);
}

/**
 * Fetches all products from Shopify Storefront API with cursor pagination.
 * Falls back to pre-compiled local catalog if network or API is unreachable.
 */
export async function fetchShopifyProducts(): Promise<{ products: Product[]; isLiveShopify: boolean }> {
  try {
    let hasNextPage = true;
    let cursor: string | null = null;
    const allNodes: ShopifyProductNode[] = [];

    // Paginate through Shopify products in batches of 100
    while (hasNextPage && allNodes.length < 500) {
      const data: ProductsPageResponse = await fetchProductsBatch(cursor);
      const edges = data.products?.edges || [];
      for (const edge of edges) {
        allNodes.push(edge.node);
      }

      hasNextPage = data.products?.pageInfo?.hasNextPage || false;
      cursor = data.products?.pageInfo?.endCursor || null;
      if (!cursor) break;
    }

    if (allNodes.length > 0) {
      const liveProducts: Product[] = allNodes.map((node, index) => {
        const firstVariant = node.variants.edges[0]?.node;
        const imageUrls = node.images.edges.map((e) => e.node.url).filter(Boolean);
        const mainImage = imageUrls[0] || getImageForProduct(node.productType, node.title);
        const images = imageUrls.length > 0 ? imageUrls : [mainImage, getImageForProduct(node.productType, node.title)];
        const price = firstVariant ? parseFloat(firstVariant.price.amount) : 499;
        const originalPrice = firstVariant?.compareAtPrice
          ? parseFloat(firstVariant.compareAtPrice.amount)
          : Math.round(price * 1.25);

        let badge: string | undefined = undefined;
        if (index % 11 === 0) badge = 'Artisan Pick';
        else if (index % 19 === 0) badge = 'Best Seller';
        else if (index % 23 === 0) badge = 'Popular Gift';
        else if (price < 350) badge = 'Under ₹350';

        const desc = (node.description || 'Handmade crochet, crafted with love by our artisans in Surat using combed cotton yarn.')
          .replace(/\\n/g, ' ')
          .trim();

        const mappedCategory = mapToMainCategory(node.productType, node.title);

        return {
          id: node.id,
          shopifyId: node.id,
          variantId: firstVariant?.id,
          handle: node.handle,
          name: node.title,
          category: mappedCategory,
          rawCategory: node.productType,
          group: getCategoryGroup(node.productType),
          price,
          originalPrice: originalPrice > price ? originalPrice : undefined,
          image: mainImage,
          images,
          rating: Number((4.7 + ((index * 13) % 4) * 0.1).toFixed(1)),
          reviewsCount: 18 + ((index * 17) % 125),
          badge,
          description: desc,
          details: [
            '100% Handcrafted crochet piece',
            'Made with love by artisans in Surat',
            'Soft combed milk cotton yarn',
            'Durable, everlasting & easy care',
          ],
          inStock: firstVariant?.availableForSale !== false,
          featuredInHero: index < 8,
          tags: node.tags || [],
        };
      });

      return { products: liveProducts, isLiveShopify: true };
    }

    return { products: PRODUCTS, isLiveShopify: false };
  } catch (error) {
    console.warn('Using pre-compiled Shopify catalog snapshot:', error);
    return { products: PRODUCTS, isLiveShopify: false };
  }
}

/**
 * Creates a Shopify Cart and returns the checkout URL to redirect customer
 */
export async function createShopifyCheckout(cartItems: CartItem[]): Promise<string> {
  const lineItemsWithVariants = cartItems
    .filter((item) => item.product.variantId)
    .map((item) => ({
      merchandiseId: item.product.variantId!,
      quantity: item.quantity,
    }));

  if (lineItemsWithVariants.length === 0) {
    throw new Error('No valid Shopify items found in cart');
  }

  const mutation = `
    mutation CreateCart($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(mutation, {
    lines: lineItemsWithVariants,
  });

  const cart = data.cartCreate?.cart;
  if (cart?.checkoutUrl) {
    return cart.checkoutUrl;
  }

  const errors = data.cartCreate?.userErrors;
  if (errors && errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join(', '));
  }

  throw new Error('Could not generate Shopify checkout URL');
}
