/**
 * CartContext — Shopify Storefront Cart State & Operations
 * Manages live cart lines, subtotal, totalQuantity, checkoutUrl, and slide-over drawer visibility.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { shopifyFetch } from '../services/shopify';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartItemDetails {
  lineId: string;
  variantId: string;
  title: string;
  subtitle?: string;
  price: number;
  quantity: number;
  image: string;
  handle?: string;
}

export interface CartCost {
  subtotal: number;
  total: number;
  currencyCode: string;
}

interface CartContextValue {
  cartCount: number;
  cartId: string | null;
  checkoutUrl: string | null;
  items: CartItemDetails[];
  cost: CartCost;
  isLoading: boolean;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  checkoutItems: CartItemDetails[];
  openCart: () => void;
  closeCart: () => void;
  openCheckout: (customItems?: CartItemDetails[]) => void;
  closeCheckout: () => void;
  clearCart: () => void;
  addToShopifyCart: (variantId: string, quantity: number) => Promise<number>;
  addBouquetToShopifyCart: (
    lines: Array<{
      variantId: string;
      quantity: number;
      attributes?: Array<{ key: string; value: string }>;
    }>
  ) => Promise<number>;
  updateLineQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  buyNow: (variantId: string, quantity: number, details?: Partial<CartItemDetails>) => Promise<void>;
  proceedToCheckout: () => void;
  incrementCount: (qty?: number) => void;
}

// ─── GraphQL Snippets ────────────────────────────────────────────────────────

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 30) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            product {
              id
              title
              handle
              featuredImage { url altText }
            }
          }
        }
      }
    }
  }
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

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

const GET_CART_QUERY = `
  query getCart($id: ID!) {
    cart(id: $id) {
      ${CART_FIELDS}
    }
  }
`;

// ─── Raw GraphQL Types ───────────────────────────────────────────────────────

interface RawShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          product: {
            id: string;
            title: string;
            handle: string;
            featuredImage?: { url: string; altText?: string | null };
          };
        };
      };
    }>;
  };
}

// ─── LocalStorage Keys ───────────────────────────────────────────────────────

const LS_CART_ID = 'knotsnco_cart_id';
const LS_CART_URL = 'knotsnco_cart_url';
const LS_CART_QTY = 'knotsnco_cart_qty';

// ─── Parser Helper ───────────────────────────────────────────────────────────

function parseShopifyCart(raw: RawShopifyCart): {
  items: CartItemDetails[];
  cost: CartCost;
  totalQuantity: number;
} {
  const items: CartItemDetails[] = (raw.lines?.edges || []).map((edge) => {
    const node = edge.node;
    const merch = node.merchandise;
    const product = merch.product;
    return {
      lineId: node.id,
      variantId: merch.id,
      title: product?.title || 'Crochet Artisan Item',
      subtitle: merch.title && merch.title !== 'Default Title' ? merch.title : undefined,
      price: parseFloat(merch.price.amount) || 0,
      quantity: node.quantity,
      image: product?.featuredImage?.url || '',
      handle: product?.handle,
    };
  });

  const cost: CartCost = {
    subtotal: parseFloat(raw.cost?.subtotalAmount?.amount) || 0,
    total: parseFloat(raw.cost?.totalAmount?.amount) || 0,
    currencyCode: raw.cost?.totalAmount?.currencyCode || 'INR',
  };

  return { items, cost, totalQuantity: raw.totalQuantity || 0 };
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LS_CART_ID);
    } catch {
      return null;
    }
  });

  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LS_CART_URL);
    } catch {
      return null;
    }
  });

  const [cartCount, setCartCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(LS_CART_QTY) || '0', 10) || 0;
    } catch {
      return 0;
    }
  });

  const [items, setItems] = useState<CartItemDetails[]>([]);
  const [cost, setCost] = useState<CartCost>({ subtotal: 0, total: 0, currencyCode: 'INR' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItemDetails[]>([]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const openCheckout = useCallback(
    (customItems?: CartItemDetails[]) => {
      setIsCartOpen(false);
      if (customItems && customItems.length > 0) {
        setCheckoutItems(customItems);
      } else {
        setCheckoutItems(items);
      }
      setIsCheckoutOpen(true);
    },
    [items]
  );

  const closeCheckout = useCallback(() => {
    setIsCheckoutOpen(false);
  }, []);

  const saveCartToStorage = useCallback((raw: RawShopifyCart) => {
    try {
      localStorage.setItem(LS_CART_ID, raw.id);
      localStorage.setItem(LS_CART_URL, raw.checkoutUrl);
      localStorage.setItem(LS_CART_QTY, String(raw.totalQuantity));
    } catch {}
  }, []);

  const clearCartFromStorage = useCallback(() => {
    try {
      localStorage.removeItem(LS_CART_ID);
      localStorage.removeItem(LS_CART_URL);
      localStorage.removeItem(LS_CART_QTY);
    } catch {}
    setCartId(null);
    setCheckoutUrl(null);
    setCartCount(0);
    setItems([]);
    setCost({ subtotal: 0, total: 0, currencyCode: 'INR' });
  }, []);

  const applyCart = useCallback(
    (raw: RawShopifyCart) => {
      setCartId(raw.id);
      setCheckoutUrl(raw.checkoutUrl);
      setCartCount(raw.totalQuantity);
      saveCartToStorage(raw);

      const parsed = parseShopifyCart(raw);
      setItems(parsed.items);
      setCost(parsed.cost);
    },
    [saveCartToStorage]
  );

  // Sync with Shopify Cart on initial load
  useEffect(() => {
    if (!cartId) return;

    let isMounted = true;
    async function loadCart() {
      try {
        const data = await shopifyFetch<{ cart: RawShopifyCart | null }>(GET_CART_QUERY, { id: cartId });
        if (!isMounted) return;
        if (data.cart) {
          applyCart(data.cart);
        } else {
          // Cart likely expired on Shopify side
          clearCartFromStorage();
        }
      } catch {
        // Network or API error; keep local state for now
      }
    }

    loadCart();
    return () => {
      isMounted = false;
    };
  }, [cartId, applyCart, clearCartFromStorage]);

  /** Add item to Shopify Cart */
  const addToShopifyCart = useCallback(
    async (variantId: string, quantity: number): Promise<number> => {
      setIsLoading(true);
      try {
        const lines = [{ merchandiseId: variantId, quantity }];
        let activeCart: RawShopifyCart | null = null;

        if (cartId) {
          try {
            const res = await shopifyFetch<{
              cartLinesAdd: { cart: RawShopifyCart | null; userErrors: Array<{ message: string }> };
            }>(CART_LINES_ADD_MUTATION, { cartId, lines });

            if (res.cartLinesAdd?.cart) {
              activeCart = res.cartLinesAdd.cart;
            }
          } catch {
            // Cart might have expired, will create fresh cart below
          }
        }

        if (!activeCart) {
          const res = await shopifyFetch<{
            cartCreate: { cart: RawShopifyCart | null; userErrors: Array<{ message: string }> };
          }>(CART_CREATE_MUTATION, { lines });

          activeCart = res.cartCreate?.cart || null;
        }

        if (!activeCart) {
          throw new Error('Failed to update Shopify cart');
        }

        applyCart(activeCart);
        return activeCart.totalQuantity;
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, applyCart]
  );

  /** Add an entire custom bouquet bundle with multiple flower lines and custom attributes */
  const addBouquetToShopifyCart = useCallback(
    async (
      lines: Array<{
        variantId: string;
        quantity: number;
        attributes?: Array<{ key: string; value: string }>;
      }>
    ): Promise<number> => {
      setIsLoading(true);
      try {
        const formattedLines = lines.map((l) => ({
          merchandiseId: l.variantId,
          quantity: l.quantity,
          attributes: l.attributes || [],
        }));

        let activeCart: RawShopifyCart | null = null;

        if (cartId) {
          try {
            const res = await shopifyFetch<{
              cartLinesAdd: { cart: RawShopifyCart | null; userErrors: Array<{ message: string }> };
            }>(CART_LINES_ADD_MUTATION, { cartId, lines: formattedLines });

            if (res.cartLinesAdd?.cart) {
              activeCart = res.cartLinesAdd.cart;
            }
          } catch {
            // Cart might have expired on Shopify, fallback to fresh cart creation
          }
        }

        if (!activeCart) {
          const res = await shopifyFetch<{
            cartCreate: { cart: RawShopifyCart | null; userErrors: Array<{ message: string }> };
          }>(CART_CREATE_MUTATION, { lines: formattedLines });

          activeCart = res.cartCreate?.cart || null;
        }

        if (!activeCart) {
          throw new Error('Failed to add custom bouquet to Shopify cart');
        }

        applyCart(activeCart);
        return activeCart.totalQuantity;
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, applyCart]
  );

  /** Update quantity of an existing line item */
  const updateLineQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cartId) return;
      setIsLoading(true);
      try {
        if (quantity <= 0) {
          const res = await shopifyFetch<{
            cartLinesRemove: { cart: RawShopifyCart | null; userErrors: Array<{ message: string }> };
          }>(CART_LINES_REMOVE_MUTATION, { cartId, lineIds: [lineId] });
          if (res.cartLinesRemove?.cart) {
            applyCart(res.cartLinesRemove.cart);
          }
        } else {
          const res = await shopifyFetch<{
            cartLinesUpdate: { cart: RawShopifyCart | null; userErrors: Array<{ message: string }> };
          }>(CART_LINES_UPDATE_MUTATION, {
            cartId,
            lines: [{ id: lineId, quantity }],
          });
          if (res.cartLinesUpdate?.cart) {
            applyCart(res.cartLinesUpdate.cart);
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, applyCart]
  );

  /** Remove line item completely */
  const removeLine = useCallback(
    async (lineId: string) => {
      if (!cartId) return;
      setIsLoading(true);
      try {
        const res = await shopifyFetch<{
          cartLinesRemove: { cart: RawShopifyCart | null; userErrors: Array<{ message: string }> };
        }>(CART_LINES_REMOVE_MUTATION, { cartId, lineIds: [lineId] });
        if (res.cartLinesRemove?.cart) {
          applyCart(res.cartLinesRemove.cart);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, applyCart]
  );

  /** Buy Now: opens checkout modal immediately for the single item */
  const buyNow = useCallback(
    async (variantId: string, quantity: number, details?: Partial<CartItemDetails>) => {
      setIsLoading(true);
      try {
        const buyItem: CartItemDetails = {
          lineId: `line_${Date.now()}`,
          variantId,
          title: details?.title || 'Handcrafted Crochet Item',
          subtitle: details?.subtitle,
          price: details?.price || 0,
          quantity,
          image: details?.image || '',
        };
        openCheckout([buyItem]);
      } finally {
        setIsLoading(false);
      }
    },
    [openCheckout]
  );

  /** Open checkout modal for current active cart items */
  const proceedToCheckout = useCallback(() => {
    if (items.length > 0) {
      openCheckout(items);
    }
  }, [items, openCheckout]);

  /** Clear entire cart after successful payment */
  const clearCart = useCallback(() => {
    clearCartFromStorage();
  }, [clearCartFromStorage]);

  /** Fallback count increment */
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
      value={{
        cartCount,
        cartId,
        checkoutUrl,
        items,
        cost,
        isLoading,
        isCartOpen,
        isCheckoutOpen,
        checkoutItems,
        openCart,
        closeCart,
        openCheckout,
        closeCheckout,
        clearCart,
        addToShopifyCart,
        addBouquetToShopifyCart,
        updateLineQuantity,
        removeLine,
        buyNow,
        proceedToCheckout,
        incrementCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
