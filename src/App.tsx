/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { KnitKnotNavbar } from './components/KnitKnotNavbar';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { MostWantedCarousel } from './components/MostWantedCarousel';
import { HangingYarnShowcase } from './components/HangingYarnShowcase';
import { FullscreenVideoSection } from './components/FullscreenVideoSection';
import { ShopByCategory } from './components/ShopByCategory';
import { FeaturedEditorialSection } from './components/FeaturedEditorialSection';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { QuickViewModal } from './components/QuickViewModal';
import { CategoryNavDrawer } from './components/CategoryNavDrawer';
import { PRODUCTS, Product, CartItem } from './data/products';
import { Heart, Check } from 'lucide-react';
import { fetchShopifyProducts, createShopifyCheckout } from './services/shopify';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLiveShopify, setIsLiveShopify] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // Everlasting White Lily Bouquet pre-loaded in cart as sample
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
      // Fallback if products in cart are mock items before publishing in Shopify
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
        const fallback = document.getElementById('shop-by-category-section');
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
    <div className="min-h-screen w-full bg-[#faf4e8] text-[#2b0b12] flex flex-col justify-start relative overflow-x-hidden selection:bg-[#841724] selection:text-[#faedd3]">
      
      {/* 1. STICKY KNOTSNCO NAVBAR WITH LOGO & ALL CONTROLS */}
      <KnitKnotNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        products={products}
        onQuickView={(p) => setQuickViewProduct(p)}
        onAddToCart={handleAddToCart}
        cartCount={totalCartCount}
        wishlistCount={wishlistCount}
        onSearchClick={() => setIsSearchOpen(true)}
        onUserClick={() => setIsAccountOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => showToast('♡ Added to your wishlist collection!')}
        onShopNowClick={() => handleTabChange('All Products')}
      />

      {/* 2. FULL LANDING PAGE HERO WITH THE KNOTSNCO LANDING IMAGE */}
      <HeroSection
        onExploreClick={() => {
          const el = document.getElementById('hanging-shelf-section') || document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectCategory={handleTabChange}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
        heroProducts={heroProductsMap}
      />

      {/* 3. INTERACTIVE HANGING YARN SHOWCASE (MATCHING USER REFERENCE IMAGE) */}
      <HangingYarnShowcase
        products={products}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
        onBrowseAll={() => {
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectCategory={handleTabChange}
      />

      {/* 4. FULLSCREEN HIGH-QUALITY AUTO-PLAYING LOOP VIDEO SHOWCASE */}
      <FullscreenVideoSection />

      {/* 5. OUR CATEGORIES BENTO GRID (MATCHING REFERENCE IMAGE) */}
      <ShopByCategory
        onSelectCategory={(categoryTab) => {
          setActiveTab(categoryTab);
          const el = document.getElementById('catalog-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* 6. HANDMADE COLLECTIONS SHOWCASE (WHITE BACKGROUND) */}
      <ProductCatalog
        products={products}
        selectedCategory={activeTab}
        onSelectCategory={handleTabChange}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
        onOpenCategoryDrawer={() => setIsCategoryDrawerOpen(true)}
      />

      {/* 7. FEATURED EDITORIAL HERO BANNER (MATCHING REFERENCE IMAGE WITH CROCHET RESORT SET) */}
      <FeaturedEditorialSection
        onQuickView={(p) => setQuickViewProduct(p)}
        onAddToCart={handleAddToCart}
      />

      {/* 8. COMMUNITY LOVE REVIEWS SECTION */}
      <ReviewsSection />

      {/* 9. EDITORIAL LUXURY FOOTER (MATCHING REFERENCE WITH ALL CATEGORIES & GIANT BRAND TYPOGRAPHY) */}
      <Footer onSelectCategory={handleTabChange} />

      {/* 8. MODALS & DRAWERS */}
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

      {/* 9. FLOATING TOAST NOTIFICATION */}
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
