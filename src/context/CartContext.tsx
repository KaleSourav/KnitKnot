/**
 * CartContext — Shopify Storefront Cart State
 * Persists cartId + checkoutUrl in localStorage.
 * Exposes: cartCount, cartId, checkoutUrl, addToShopifyCart, buyNow
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { shopifyFetch } from '../services/shopify';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CartLine {
  merchandiseId: string;
  quantity: number;
}

interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
}

interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

// ─── GraphQL ─────────────────────────────────────────────────────────────────

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const LS_CART_ID = 'knotsnco_cart_id';
const LS_CART_URL = 'knotsnco_cart_url';
const LS_CART_QTY = 'knotsnco_cart_qty';

function readLocalCart(): { cartId: string | null; checkoutUrl: string | null; qty: number } {
  try {
    return {
      cartId: localStorage.getItem(LS_CART_ID),
      checkoutUrl: localStorage.getItem(LS_CART_URL),
      qty: parseInt(localStorage.getItem(LS_CART_QTY) || '0', 10) || 0,
    };
  } catch {
    return { cartId: null, checkoutUrl: null, qty: 0 };
  }
}

function saveLocalCart(cart: ShopifyCart) {
  try {
    localStorage.setItem(LS_CART_ID, cart.id);
    localStorage.setItem(LS_CART_URL, cart.checkoutUrl);
    localStorage.setItem(LS_CART_QTY, String(cart.totalQuantity));
  } catch {}
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface CartContextValue {
  cartCount: number;
  cartId: string | null;
  checkoutUrl: string | null;
  /** Add item to Shopify cart. Returns updated totalQuantity. */
  addToShopifyCart: (variantId: string, quantity: number) => Promise<number>;
  /** Create a fresh one-item cart and redirect to Shopify checkout. */
  buyNow: (variantId: string, quantity: number) => Promise<void>;
  /** Increment local count without API (fallback for products without variantId). */
  incrementCount: (qty?: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const local = readLocalCart();
  const [cartId, setCartId] = useState<string | null>(local.cartId);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(local.checkoutUrl);
  const [cartCount, setCartCount] = useState<number>(local.qty);

  /** Internal: create a brand new Shopify cart */
  const createCart = useCallback(async (lines: CartLine[]): Promise<ShopifyCart> => {
    const data = await shopifyFetch<CartCreateResponse>(CART_CREATE_MUTATION, { lines });
    const cart = data.cartCreate?.cart;
    const errors = data.cartCreate?.userErrors;
    if (!cart) {
      const msg = errors?.map((e) => e.message).join(', ') || 'Could not create Shopify cart';
      throw new Error(msg);
    }
    return cart;
  }, []);

  /** Internal: add lines to existing cart */
  const addLinesToCart = useCallback(async (id: string, lines: CartLine[]): Promise<ShopifyCart> => {
    const data = await shopifyFetch<CartLinesAddResponse>(CART_LINES_ADD_MUTATION, {
      cartId: id,
      lines,
    });
    const cart = data.cartLinesAdd?.cart;
    const errors = data.cartLinesAdd?.userErrors;
    if (!cart) {
      const msg = errors?.map((e) => e.message).join(', ') || 'Could not add to Shopify cart';
      throw new Error(msg);
    }
    return cart;
  }, []);

  /** Public: Add to cart (creates cart on first use, otherwise appends) */
  const addToShopifyCart = useCallback(
    async (variantId: string, quantity: number): Promise<number> => {
      const lines: CartLine[] = [{ merchandiseId: variantId, quantity }];
      let cart: ShopifyCart;

      if (cartId) {
        try {
          cart = await addLinesToCart(cartId, lines);
        } catch {
          // Cart may have expired — create a fresh one
          cart = await createCart(lines);
        }
      } else {
        cart = await createCart(lines);
      }

      setCartId(cart.id);
      setCheckoutUrl(cart.checkoutUrl);
      setCartCount(cart.totalQuantity);
      saveLocalCart(cart);
      return cart.totalQuantity;
    },
    [cartId, createCart, addLinesToCart]
  );

  /** Public: Buy Now — ephemeral cart → redirect to checkout */
  const buyNow = useCallback(
    async (variantId: string, quantity: number): Promise<void> => {
      const lines: CartLine[] = [{ merchandiseId: variantId, quantity }];
      const cart = await createCart(lines);
      // Redirect immediately to Shopify's hosted checkout
      window.location.href = cart.checkoutUrl;
    },
    [createCart]
  );

  /** Fallback count increment (no Shopify API — used when variantId unavailable) */
  const incrementCount = useCallback((qty = 1) => {
    setCartCount((prev) => {
      const next = prev + qty;
      try {
        localStorage.setItem(LS_CART_QTY, String(next));
      } catch {}
      return next;
    });
  }, []);

  return (
    <CartContext.Provider
      value={{ cartCount, cartId, checkoutUrl, addToShopifyCart, buyNow, incrementCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
