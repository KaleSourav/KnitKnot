import React, { useState, useEffect } from 'react';
import { ProductProvider, useProducts } from './context/ProductContext';
import { CartProvider, useCart } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoriesSection } from './components/CategoriesSection';
import { BestsellersSection } from './components/BestsellersSection';
import { ShopTheOccasionSection } from './components/ShopTheOccasionSection';
import { TheHandsBehindEveryStitchSection } from './components/TheHandsBehindEveryStitchSection';
import { ReelsSection } from './components/ReelsSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { AllProductsShopSection } from './components/AllProductsShopSection';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { Footer } from './components/Footer';
import { DynamicScrollBackground } from './components/DynamicScrollBackground';
import { ScrollReveal } from './components/ScrollReveal';
import { SignatureYarnThread } from './components/SignatureYarnThread';

// Mapping from landing page category IDs to Shop category names
const CATEGORY_MAP: Record<string, string> = {
  'flowers': 'Flowers',
  'bouquets': 'Bouquets',
  'bouquet': 'Bouquets',
  'plushies': 'Plushies',
  'bags': 'Bags',
  'keychains': 'Keychains',
  'flower-pots': 'Flower Pots',
  'home-decor': 'Home Decor',
  'accessories': 'Accessories',
};

function AppInner() {
  const { cartCount, addToShopifyCart, buyNow, incrementCount, openCart } = useCart();
  const { products } = useProducts();

  // Client-side page routing: 'home' | 'shop' | 'product'
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'product'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#product') || hash.startsWith('#/product')) return 'product';
      if (hash.startsWith('#shop') || hash.startsWith('#/shop')) return 'shop';
      return 'home';
    }
    return 'home';
  });

  const [selectedProductId, setSelectedProductId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#product') || hash.startsWith('#/product')) {
        const qIndex = window.location.hash.indexOf('?');
        if (qIndex !== -1) {
          const params = new URLSearchParams(window.location.hash.substring(qIndex));
          return params.get('id') || params.get('handle') || null;
        }
        const parts = window.location.hash.split('/');
        if (parts.length >= 3 && parts[2]) {
          return decodeURIComponent(parts[2]);
        }
      }
    }
    return null;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const qIndex = hash.indexOf('?');
      if (qIndex !== -1) {
        const params = new URLSearchParams(hash.substring(qIndex));
        return params.get('category') || 'all';
      }
    }
    return 'all';
  });

  // Sync with browser back/forward and URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#product') || hash.startsWith('#/product')) {
        setCurrentPage('product');
        const qIndex = window.location.hash.indexOf('?');
        if (qIndex !== -1) {
          const params = new URLSearchParams(window.location.hash.substring(qIndex));
          setSelectedProductId(params.get('id') || params.get('handle') || null);
        } else {
          const parts = window.location.hash.split('/');
          if (parts.length >= 3 && parts[2]) {
            setSelectedProductId(decodeURIComponent(parts[2]));
          }
        }
      } else if (hash.startsWith('#shop') || hash.startsWith('#/shop')) {
        setCurrentPage('shop');
        setSelectedProductId(null);
        const qIndex = window.location.hash.indexOf('?');
        if (qIndex !== -1) {
          const params = new URLSearchParams(window.location.hash.substring(qIndex));
          setSelectedCategory(params.get('category') || 'all');
        } else {
          setSelectedCategory('all');
        }
      } else {
        setCurrentPage('home');
        setSelectedProductId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Central page navigator
  const navigateTo = (page: 'home' | 'shop' | 'product', param: string = 'all') => {
    setCurrentPage(page);

    if (page === 'home') {
      setSelectedCategory('all');
      setSelectedProductId(null);
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
    } else if (page === 'shop') {
      setSelectedCategory(param || 'all');
      setSelectedProductId(null);
      if (param && param !== 'all') {
        window.location.hash = `/shop?category=${encodeURIComponent(param)}`;
      } else {
        window.location.hash = '/shop';
      }
    } else if (page === 'product') {
      setSelectedProductId(param);
      window.location.hash = `/product?id=${encodeURIComponent(param)}`;
    }

    // Scroll smoothly to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchClick = () => {
    // Ready for search modal/filter
  };

  const handleCartClick = () => {
    openCart();
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF4ED] text-[#2D2424] antialiased flex flex-col font-['Fredoka']">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Striped Header with Brand Logo, Actions, and Category Pill Nav */}
      <Header
        currentPage={currentPage}
        activeCategory={selectedCategory}
        onNavigate={navigateTo}
        onSearchClick={handleSearchClick}
        onCartClick={handleCartClick}
        cartCount={cartCount}
      />

      {/* Global Whimsical Ambient Petals, Stars & Hearts Animation Across EVERY Page */}
      <DynamicScrollBackground />

      {/* 3. Main Content: Dedicated Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' ? (
          /* =========================================================================
             LANDING PAGE VIEW (Home)
             ========================================================================= */
          <div className="relative w-full">
            {/* Signature Scroll-Responsive Yarn Thread Animation */}
            <SignatureYarnThread />

            {/* Hero Landing Banner (Flush with announcement bar, instant LCP render) */}
            <div id="section-hero">
              <HeroBanner onShopClick={(cat) => navigateTo('shop', cat || 'all')} />
            </div>

            {/* Shop by Category (Scalloped Cloud Container, 3 Top, 3 Below) */}
            <ScrollReveal id="section-categories" yOffset={24} duration={0.45}>
              <CategoriesSection
                onCategorySelect={(id) => {
                  const targetCat = CATEGORY_MAP[id] || id;
                  navigateTo('shop', targetCat);
                }}
              />
            </ScrollReveal>

            {/* Bestsellers Section (Yarn Ball Divider, 4-Point Sparkle Stars, Carousel) */}
            <ScrollReveal id="section-bestsellers" yOffset={24} duration={0.45}>
              <BestsellersSection
                onProductClick={(id) => navigateTo('product', id)}
                onShopAllClick={() => navigateTo('shop', 'all')}
                onAddToCart={async (productId) => {
                  const p = products.find((item) => item.id === productId || item.shopifyId === productId);
                  if (p?.variantId) {
                    await addToShopifyCart(p.variantId, 1);
                  } else {
                    incrementCount(1);
                  }
                }}
              />
            </ScrollReveal>

            {/* Storytelling Section: The Hands Behind Every Stitch (Nanis, Daadis, Aunties & Artisans) */}
            <TheHandsBehindEveryStitchSection onStoryClick={() => navigateTo('shop', 'all')} />

            {/* Shop The Occasion Section (Top Stitch with Smiling Flower, 5 Occasion Cards with Hover Crossfade, Bottom Golden Wave) */}
            <ScrollReveal id="section-occasions" yOffset={24} duration={0.45}>
              <ShopTheOccasionSection
                onOccasionClick={(id) => navigateTo('shop', 'all')}
              />
            </ScrollReveal>

            {/* Reels / Community Section ("from our community ♡" + Instagram Link + Autoplaying 9:16 Video Cards) */}
            <ScrollReveal id="section-reels" yOffset={24} duration={0.45}>
              <ReelsSection />
            </ScrollReveal>

            {/* Why Choose Knots & Co Section (Interactive Blue & Yellow Cards, Tilting & 3D Flip) */}
            <ScrollReveal id="section-why-choose" yOffset={24} duration={0.45}>
              <WhyChooseSection />
            </ScrollReveal>
          </div>
        ) : currentPage === 'shop' ? (
          /* =========================================================================
             DEDICATED SHOP PAGE VIEW (All Products Shop)
             Exact Match to Reference: 3-Col Desktop with Filters & 2-Col Mobile with Drawer
             ========================================================================= */
          <AllProductsShopSection
            initialCategory={selectedCategory}
            onProductClick={(id) => navigateTo('product', id)}
            onAddToCart={async (product) => {
              if (product.variantId) {
                await addToShopifyCart(product.variantId, 1);
              } else {
                incrementCount(1);
              }
            }}
            onNavigateHome={() => navigateTo('home')}
          />
        ) : (
          /* =========================================================================
             DEDICATED PRODUCT DETAILS PAGE VIEW
             Exact Match to Reference: Gallery with Arrows & Wishlist, Stepper, Actions & Accordions
             Followed by Reels Section & Why Choose Knots & Co cards right above Footer.
             ========================================================================= */
          <div className="relative w-full">
            <ProductDetailsPage
              productId={selectedProductId}
              onNavigateHome={() => navigateTo('home')}
              onNavigateShop={(cat) => navigateTo('shop', cat || 'all')}
              onNavigateProduct={(id) => navigateTo('product', id)}
              onAddToCart={async (product, qty) => {
                if (product.variantId) {
                  await addToShopifyCart(product.variantId, qty);
                } else {
                  incrementCount(qty);
                }
              }}
              onBuyNow={async (product, qty) => {
                if (product.variantId) {
                  await buyNow(product.variantId, qty);
                } else {
                  // Fallback: open Shopify store in new tab if no variantId
                  window.open('https://knotsnco.myshopify.com', '_blank', 'noopener');
                }
              }}
            />

            {/* Reels / Community Section ("from our community ♡" + Instagram Link + Autoplaying 9:16 Video Cards) */}
            <ScrollReveal id="section-product-reels" yOffset={24} duration={0.45}>
              <ReelsSection />
            </ScrollReveal>

            {/* Why Choose Knots & Co Section (Interactive Blue & Yellow Cards, Tilting & 3D Flip) */}
            <ScrollReveal id="section-product-why-choose" yOffset={24} duration={0.45}>
              <WhyChooseSection />
            </ScrollReveal>
          </div>
        )}
      </main>

      {/* 4. Footer Section ("stay in the loop" newsletter + scalloped wave + brand links & legal) */}
      <ScrollReveal yOffset={32}>
        <Footer onNavigate={navigateTo} />
      </ScrollReveal>

      {/* 5. Slide-Over Shopify Cart Drawer */}
      <CartDrawer onNavigateShop={(cat) => navigateTo('shop', cat || 'all')} />
    </div>
  );
}

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </ProductProvider>
  );
}
