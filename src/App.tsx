/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { KnotsncoBrandHero } from './components/KnotsncoBrandHero';
import { HangingYarnShowcase } from './components/HangingYarnShowcase';
import { AutoBannerSlideshow } from './components/AutoBannerSlideshow';
import { BestSellerSection } from './components/BestSellerSection';
import { InstaReelsSection } from './components/InstaReelsSection';
import { MoodwiseDecksSection } from './components/MoodwiseDecksSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqSection } from './components/FaqSection';
import { ProductCatalog } from './components/ProductCatalog';
import { Footer } from './components/Footer';
import { DynamicScrollBackground } from './components/DynamicScrollBackground';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { QuickViewModal } from './components/QuickViewModal';
import { CategoryNavDrawer } from './components/CategoryNavDrawer';
import { PRODUCTS, Product, CartItem } from './data/products';
import { Check } from 'lucide-react';
import { fetchShopifyProducts, createShopifyCheckout } from './services/shopify';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLiveShopify, setIsLiveShopify] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // Sample item in cart
      quantity: 1,
    },
  ]);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; show: boolean }>({
    message: '',
    show: false,
  });

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast({ message: '', show: false });
    }, 2800);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Cart operations
  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`Added "${product.name}" to bag! ♡`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  useEffect(() => {
    fetchShopifyProducts().then((res) => {
      if (res.isLiveShopify && res.products.length > 0) {
        setProducts(res.products);
        setIsLiveShopify(true);
        showToast(`✨ Connected to Shopify! Loaded ${res.products.length} live products.`);
      }
    });
  }, []);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    showToast('Connecting to secure Shopify checkout...');

    try {
      const checkoutUrl = await createShopifyCheckout(cartItems);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }
    } catch (err) {
      console.warn('Shopify checkout notice:', err);
      showToast('🛍️ Shopify store connected! Add products in Shopify Admin to enable live checkout.');
      setTimeout(() => {
        setIsCartOpen(false);
      }, 2500);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Tab & Category navigation
  const handleTabChange = (id: string) => {
    setActiveTab(id);
    if (id === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById('catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const fallback = document.getElementById('bestseller-section');
        fallback?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const heroProductsMap: { [key: string]: Product } = {};
  products.forEach((p) => {
    heroProductsMap[p.id] = p;
  });

  const [wishlistCount, setWishlistCount] = useState(0);

  return (
    <div className="min-h-screen w-full bg-transparent text-[#2b0b12] flex flex-col justify-start relative overflow-x-hidden selection:bg-[#841724] selection:text-[#faedd3]">
      
      {/* DYNAMIC SCROLL REACTIVE LIGHT-THEME BACKGROUND WITH GLOW ORBS */}
      <DynamicScrollBackground />

      {/* 1. EDITORIAL BOUTIQUE HERO & FLOATING CAPSULE NAVBAR (BRAND AESTHETIC & OUR PRODUCTS) */}
      <KnotsncoBrandHero
        cartCount={totalCartCount}
        products={products}
        onCartClick={() => setIsCartOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
        onUserClick={() => setIsAccountOpen(true)}
        onOpenCategoryDrawer={() => setIsCategoryDrawerOpen(true)}
        onSelectCategory={handleTabChange}
        onCustomOrder={() => {
          showToast('Opening bespoke artisan order on WhatsApp... ♡');
          window.open(
            "https://wa.me/919999999999?text=Hi%20Knotsnco!%20I'd%20like%20to%20place%20a%20custom%20crochet%20order",
            '_blank'
          );
        }}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
        heroProductsMap={heroProductsMap}
      />

      {/* 3. INTERACTIVE HANGING YARN SHOWCASE (MATCHING REFERENCE WITH CLIPS & ROTATING TICKER) */}
      <HangingYarnShowcase
        products={products}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
        onBrowseAll={() => {
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* AUTOMATIC SLIDESHOW BANNER BEFORE STEP 3 (USING /banners/1.png, 3.png, 4.png, 5.png) */}
      <AutoBannerSlideshow
        onBannerClick={() => {
          const el = document.getElementById('bestseller-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3) BEST SELLER SECTION */}
      <BestSellerSection
        products={products}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
        onBrowseAll={() => {
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4) INSTA REELS SECTION ("WATCH & BUY") */}
      <InstaReelsSection
        products={products}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 5) CARDWISE / MOODWISE DECKS ROW & 6) 20 PRODUCTS FOR THE ABOVE */}
      <MoodwiseDecksSection
        products={products}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 7) REVIEWS SECTION */}
      <ReviewsSection />

      {/* 8) FAQS SECTION */}
      <FaqSection />

      {/* FULL CATALOG (COLLAPSIBLE / ACCESSIBLE VIA TABS & DRAWER) */}
      <ProductCatalog
        products={products}
        selectedCategory={activeTab}
        onSelectCategory={handleTabChange}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
        onOpenCategoryDrawer={() => setIsCategoryDrawerOpen(true)}
      />

      {/* EDITORIAL LUXURY FOOTER */}
      <Footer onSelectCategory={handleTabChange} />

      {/* MODALS & DRAWERS */}
      <CategoryNavDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        selectedCategory={activeTab}
        onSelectCategory={handleTabChange}
        totalProductsCount={products.length}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setQuickViewProduct(p)}
        onAddToCart={handleAddToCart}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* FLOATING TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 bg-[#841724] border border-[#5c0f19] rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-7 h-7 rounded-full bg-[#faedd3]/20 text-[#faedd3] flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#faedd3]">{toast.message}</span>
        </div>
      )}

    </div>
  );
}
