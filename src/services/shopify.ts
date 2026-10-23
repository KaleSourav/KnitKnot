/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, CartItem, PRODUCTS } from '../data/products';

const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '04wv6h-ut.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '0c626353bdea1d2a4c8f32890eb14565';
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-01';

const GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
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

/**
 * Fetches products from Shopify Storefront API.
 * Falls back to local curated products if the Shopify catalog has no published items yet.
 */
export async function fetchShopifyProducts(): Promise<{ products: Product[]; isLiveShopify: boolean }> {
  const query = `
    query GetProducts {
      products(first: 50) {
        edges {
          node {
            id
            title
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

  try {
    const data = await shopifyFetch<{
      products: {
        edges: Array<{
          node: {
            id: string;
            title: string;
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
          };
        }>;
      };
    }>(query);

    const edges = data.products?.edges || [];

    // If Shopify store has products published, transform and return them
    if (edges.length > 0) {
      const liveProducts: Product[] = edges.map(({ node }, index) => {
        const firstVariant = node.variants.edges[0]?.node;
        const mainImage = node.images.edges[0]?.node.url || '/products/bouquet.jpg';
        const price = firstVariant ? parseFloat(firstVariant.price.amount) : 999;
        const originalPrice = firstVariant?.compareAtPrice
          ? parseFloat(firstVariant.compareAtPrice.amount)
          : undefined;

        // Categorization mapping
        let category: Product['category'] = 'Flowers';
        const typeLower = (node.productType || '').toLowerCase();
        if (typeLower.includes('amigurumi') || typeLower.includes('plush') || typeLower.includes('toy')) {
          category = 'Amigurumi';
        } else if (typeLower.includes('access') || typeLower.includes('tote') || typeLower.includes('bag')) {
          category = 'Accessories';
        } else if (typeLower.includes('cloth') || typeLower.includes('wear') || typeLower.includes('sweater') || typeLower.includes('cardigan')) {
          category = 'Clothing';
        } else if (typeLower.includes('util') || typeLower.includes('home') || typeLower.includes('coaster')) {
          category = 'Utility';
        } else if (typeLower.includes('byob') || typeLower.includes('custom')) {
          category = 'BYOB';
        }

        return {
          id: node.id,
          shopifyId: node.id,
          variantId: firstVariant?.id,
          name: node.title,
          category,
          price,
          originalPrice,
          image: mainImage,
          rating: 4.9,
          reviewsCount: 40 + (index * 7) % 80,
          badge: index === 0 ? 'Best Seller' : undefined,
          description: node.description || 'Artisanal handcrafted crochet piece made with premium soft yarn.',
          details: node.tags.length > 0 ? node.tags : ['100% Handcrafted', 'Premium milk cotton yarn', 'Artisanal quality inspection'],
          inStock: firstVariant ? firstVariant.availableForSale : true,
          featuredInHero: index < 2,
        };
      });

      return { products: liveProducts, isLiveShopify: true };
    }

    // If store has 0 products currently, return curated local mock products
    return { products: PRODUCTS, isLiveShopify: false };
  } catch (error) {
    console.warn('Unable to fetch live Shopify products, using curated catalog:', error);
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

  // If cart has valid Shopify variants, create cart with them
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
