/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PRODUCTS, Product, CartItem } from './data/products';
import { fetchShopifyProducts, createShopifyCheckout } from './services/shopify';
import { CrochetBouquetIntro } from './components/CrochetBouquetIntro';
import { KnotsncoNav } from './components/KnotsncoNav';
import { KnotsncoHero } from './components/KnotsncoHero';
import { BrandMarquee } from './components/BrandMarquee';
import { ShopByCategoryGrid } from './components/ShopByCategoryGrid';
import { BestsellersShowcase } from './components/BestsellersShowcase';
import { BouquetCustomizerSection } from './components/BouquetCustomizerSection';
import { DadiStorySection } from './components/DadiStorySection';
import { EditorialSpotlight } from './components/EditorialSpotlight';
import { WhyKnotsncoSection } from './components/WhyKnotsncoSection';
import { SocialScrapbook } from './components/SocialScrapbook';
import { NewsletterSection } from './components/NewsletterSection';
import { KnotsncoFooter } from './components/KnotsncoFooter';

// Full Storefront Pages
import { CollectionPage } from './pages/CollectionPage';
import { ShopAllPage } from './pages/ShopAllPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { DedicatedBYOBPage } from './pages/DedicatedBYOBPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { CartPage } from './pages/CartPage';

// Modals & Drawers
import { KnotsncoCartDrawer } from './components/KnotsncoCartDrawer';
import { KnotsncoQuickViewModal } from './components/KnotsncoQuickViewModal';
import { KnotsncoSearchModal } from './components/KnotsncoSearchModal';
import { KnotsncoAccountModal } from './components/KnotsncoAccountModal';
import { Check, Sparkles } from 'lucide-react';

export default function App() {
  // Opening Bouquet Animation state (session-aware with instant replay support)
  const [showBouquetIntro, setShowBouquetIntro] = useState<boolean>(() => {
    return !sessionStorage.getItem('knotsnco_intro_seen');
  });

  // Main Navigation View State: 'home' | 'shop-all' | 'collection' | 'product-detail' | 'byob' | 'about' | 'contact' | 'cart'
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string>(''); // For collection slug or product ID

  // Products & Shopify Storefront Data
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLiveShopify, setIsLiveShopify] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  // Cart with local storage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('knotsnco_cart');
      return saved ? JSON.parse(saved) : [{ product: PRODUCTS[0], quantity: 1 }];
    } catch {
      return [{ product: PRODUCTS[0], quantity: 1 }];
    }
  });

  // Modal Dialogs State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);

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

  // Sync Cart with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('knotsnco_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cartItems]);

  // Fetch Live Shopify Products on mount
  useEffect(() => {
    fetchShopifyProducts().then((res) => {
      if (res.isLiveShopify && res.products.length > 0) {
        setProducts(res.products);
        setIsLiveShopify(true);
      }
    });
  }, []);

  // Hash-based URL routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash || hash === 'home') {
        setCurrentView('home');
        setViewParam('');
      } else if (hash === 'shop' || hash === 'shop-all') {
        setCurrentView('shop-all');
        setViewParam('');
      } else if (hash.startsWith('collection/')) {
        const slug = hash.replace('collection/', '');
        setCurrentView('collection');
        setViewParam(slug);
      } else if (hash.startsWith('product/')) {
        const prodIdOrHandle = hash.replace('product/', '');
        const found = products.find((p) => p.handle === prodIdOrHandle || p.id === prodIdOrHandle);
        if (found) {
          setActiveProductDetail(found);
          setCurrentView('product-detail');
        }
      } else if (hash === 'byob') {
        setCurrentView('byob');
        setViewParam('');
      } else if (hash === 'about') {
        setCurrentView('about');
        setViewParam('');
      } else if (hash === 'contact') {
        setCurrentView('contact');
        setViewParam('');
      } else if (hash === 'cart') {
        setCurrentView('cart');
        setViewParam('');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on initial load
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products]);

  // View navigation handler
  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    if (param) setViewParam(param);

    if (view === 'home') {
      window.location.hash = 'home';
    } else if (view === 'shop-all') {
      window.location.hash = 'shop';
    } else if (view === 'collection' && param) {
      window.location.hash = `collection/${param}`;
    } else if (view === 'product-detail' && param) {
      window.location.hash = `product/${param}`;
    } else if (view === 'byob') {
      window.location.hash = 'byob';
    } else if (view === 'about') {
      window.location.hash = 'about';
    } else if (view === 'contact') {
      window.location.hash = 'contact';
    } else if (view === 'cart') {
      window.location.hash = 'cart';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add to cart operation
  const handleAddToCart = (product: Product, quantity: number = 1, customization?: CartItem['customization']) => {
    setCartItems((prev) => {
      // Check for exact matching product & customization
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && !item.customization && !customization
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [...prev, { product, quantity, customization }];
    });

    showToast(`Added "${product.name}" to your bag! ♡`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Shopify Checkout Integration
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    showToast('Connecting to official Shopify checkout...');

    try {
      const checkoutUrl = await createShopifyCheckout(cartItems);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }
    } catch (err) {
      console.warn('Shopify checkout notice:', err);
      showToast('🛍️ Connecting to Shopify Storefront Checkout...');
      setTimeout(() => {
        window.location.href = 'https://04wv6h-ut.myshopify.com/cart';
      }, 1500);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen w-full bg-[#FFF5CC] text-[#811B2B] flex flex-col justify-between relative overflow-x-hidden selection:bg-[#811B2B] selection:text-[#FFF5CC]">
      
      {/* 0. SIGNATURE ANIMATED CROCHET BOUQUET OPENING EXPERIENCE */}
      {showBouquetIntro && (
        <CrochetBouquetIntro
          onComplete={() => {
            setShowBouquetIntro(false);
            sessionStorage.setItem('knotsnco_intro_seen', 'true');
          }}
        />
      )}

      {/* 1. KNOTSNCO BRAND NAVIGATION */}
      <KnotsncoNav
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onReplayIntro={() => setShowBouquetIntro(true)}
      />

      {/* 2. DYNAMIC PAGE ROUTING VIEWS */}
      <main className="flex-1 w-full">
        
        {/* VIEW 1: HOMEPAGE (ALL 12 CREATIVE SECTIONS) */}
        {currentView === 'home' && (
          <>
            {/* Section 2: Hero — The Knotsnco World */}
            <KnotsncoHero
              onExplore={() => handleNavigate('shop-all')}
              onMakeBouquet={() => handleNavigate('byob')}
              onQuickView={(p) => setQuickViewProduct(p)}
              featuredProduct={products[0]}
            />

            {/* Section 3: Animated Marquee */}
            <BrandMarquee variant="burgundy" />

            {/* Section 4: Shop by Category (6 Magazine Cards) */}
            <ShopByCategoryGrid
              onSelectCategory={(slug) => handleNavigate('collection', slug)}
            />

            {/* Section 5: Bestselling Products */}
            <BestsellersShowcase
              products={products}
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
              onViewAll={() => handleNavigate('shop-all')}
            />

            {/* Section 6: Build Your Own Bouquet (Interactive Studio) */}
            <BouquetCustomizerSection
              onAddToCart={handleAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
            />

            {/* Section 7: Brand Story ("Made By Hands That Know What Love Looks Like") */}
            <DadiStorySection
              onReadMore={() => handleNavigate('about')}
            />

            {/* Section 8: Creative Product Spotlight */}
            <EditorialSpotlight
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
              onExploreCollection={(slug) => handleNavigate('collection', slug)}
            />

            {/* Section 9: Why Knotsnco? */}
            <WhyKnotsncoSection />

            {/* Section 10: Instagram / Social Showcase */}
            <SocialScrapbook />

            {/* Section 11: Newsletter */}
            <NewsletterSection />
          </>
        )}

        {/* VIEW 2: SHOP ALL PAGE (252 PRODUCTS) */}
        {currentView === 'shop-all' && (
          <ShopAllPage
            products={products}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW 3: COLLECTION PAGES (FLOWERS, POTS, CHARMS, ACCESSORIES, BAGS, DECOR) */}
        {currentView === 'collection' && (
          <CollectionPage
            categorySlug={viewParam || 'flowers'}
            products={products}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW 4: PRODUCT DETAIL PAGE */}
        {currentView === 'product-detail' && activeProductDetail && (
          <ProductDetailPage
            product={activeProductDetail}
            allProducts={products}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigate={handleNavigate}
            onCheckoutInstant={(p, q) => {
              handleAddToCart(p, q);
              setIsCartOpen(true);
            }}
          />
        )}

        {/* VIEW 5: DEDICATED BUILD YOUR OWN BOUQUET STUDIO */}
        {currentView === 'byob' && (
          <DedicatedBYOBPage
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW 6: ABOUT US PAGE (DADIS IN SURAT) */}
        {currentView === 'about' && (
          <AboutUsPage onNavigate={handleNavigate} />
        )}

        {/* VIEW 7: CONTACT US & FAQS */}
        {currentView === 'contact' && (
          <ContactUsPage onNavigate={handleNavigate} />
        )}

        {/* VIEW 8: DEDICATED CART PAGE */}
        {currentView === 'cart' && (
          <CartPage
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
            isCheckingOut={isCheckingOut}
            onNavigate={handleNavigate}
          />
        )}

      </main>

      {/* 3. EDITORIAL FOOTER */}
      <KnotsncoFooter
        onNavigate={handleNavigate}
        onReplayIntro={() => setShowBouquetIntro(true)}
      />

      {/* 4. MODALS & DRAWERS */}
      <KnotsncoCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
        onNavigate={handleNavigate}
      />

      <KnotsncoQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onViewFullDetails={(p) => {
          setActiveProductDetail(p);
          handleNavigate('product-detail', p.handle || p.id);
        }}
      />

      <KnotsncoSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => {
          setActiveProductDetail(p);
          handleNavigate('product-detail', p.handle || p.id);
        }}
        onAddToCart={handleAddToCart}
      />

      <KnotsncoAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />

      {/* FLOATING TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 left-5 sm:left-auto sm:max-w-md z-[80] bg-[#811B2B] border-2 border-[#5C0F19] rounded-2xl px-5 py-3.5 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="w-8 h-8 rounded-full bg-[#FFF5CC] text-[#811B2B] flex items-center justify-center shrink-0 shadow-sm">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#FFF5CC] font-rounded">
            {toast.message}
          </span>
        </div>
      )}

    </div>
  );
}
