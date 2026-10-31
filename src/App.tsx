/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Knotsnco — Clean Headless Environment
 * Clean starter canvas with active Shopify Storefront API integration.
 */

import React, { useState, useEffect } from 'react';
import { PRODUCTS, Product, CartItem } from './data/products';
import { fetchShopifyProducts, createShopifyCheckout } from './services/shopify';

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLiveShopify, setIsLiveShopify] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  useEffect(() => {
    fetchShopifyProducts()
      .then((res) => {
        if (res.isLiveShopify && res.products.length > 0) {
          setProducts(res.products);
          setIsLiveShopify(true);
        }
      })
      .catch((err) => {
        console.warn('Shopify fetch notice:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    try {
      const url = await createShopifyCheckout(cartItems);
      if (url) {
        window.location.href = url;
      }
    } catch (e) {
      console.error('Checkout error:', e);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5CC] text-[#811B2B] p-6 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="border-b border-[#811B2B]/20 pb-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Knotsnco Headless Environment
            </h1>
            <p className="text-sm opacity-80 mt-1">
              Clean starter slate ready for your custom frontend build.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-[#811B2B]/20 text-xs font-bold">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLiveShopify ? 'bg-green-600 animate-pulse' : 'bg-amber-600'
              }`}
            />
            <span>
              {isLiveShopify ? 'Shopify API: Live' : 'Shopify API: Local Catalog'}
            </span>
          </div>
        </header>

        {/* Environment Status Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#811B2B]/15 shadow-sm mb-8 space-y-4">
          <h2 className="text-lg font-bold">Environment Ready:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-[#FFF5CC]/60 border border-[#811B2B]/10">
              <span className="block text-xs uppercase tracking-wider opacity-60 font-bold">
                Products Loaded
              </span>
              <span className="text-2xl font-black mt-1 block">
                {isLoading ? '...' : products.length}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#FFF5CC]/60 border border-[#811B2B]/10">
              <span className="block text-xs uppercase tracking-wider opacity-60 font-bold">
                Cart Items
              </span>
              <span className="text-2xl font-black mt-1 block">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#FFF5CC]/60 border border-[#811B2B]/10">
              <span className="block text-xs uppercase tracking-wider opacity-60 font-bold">
                Storefront Endpoint
              </span>
              <span className="text-xs font-mono font-bold mt-2 block break-all opacity-80">
                04wv6h-ut.myshopify.com
              </span>
            </div>
          </div>
        </div>

        {/* Getting Started Notice */}
        <div className="rounded-2xl border-2 border-dashed border-[#811B2B]/30 p-8 text-center bg-white/40">
          <h3 className="text-xl font-bold mb-2">Blank Slate Initialized</h3>
          <p className="text-sm max-w-md mx-auto opacity-75 leading-relaxed mb-6">
            All UI components, sections, and redesign pages have been cleared.
            The headless Shopify integration, types, and build environment are fully preserved.
          </p>
          <div className="inline-flex items-center gap-3">
            <button
              onClick={() => handleAddToCart(products[0])}
              className="px-5 py-2.5 rounded-full bg-[#811B2B] text-[#FFF5CC] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
            >
              Test Add to Cart ({products[0]?.name || 'Product'})
            </button>
            {cartItems.length > 0 && (
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="px-5 py-2.5 rounded-full bg-green-700 text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                {isCheckingOut ? 'Opening Checkout...' : 'Test Checkout'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
