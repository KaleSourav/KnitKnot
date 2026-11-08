import React, { useState, useEffect, useRef } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TrustBadges } from './components/TrustBadges';
import { CategoriesSection } from './components/CategoriesSection';
import { BestsellersSection } from './components/BestsellersSection';
import { ShopTheOccasionSection } from './components/ShopTheOccasionSection';
import { OurStorySection } from './components/OurStorySection';
import { ReelsSection } from './components/ReelsSection';
import { AllProductsShopSection } from './components/AllProductsShopSection';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { Footer } from './components/Footer';
import { DynamicScrollBackground } from './components/DynamicScrollBackground';

// Mapping from landing page category IDs to Shop category names
const CATEGORY_MAP: Record<string, string> = {
  'flowers': 'Flowers',
  'flower-pots': 'Flower Pots',
  'plushies': 'Plushies',
  'bags': 'Bags',
  'keychains': 'Keychains',
  'home-decor': 'Home Decor',
  'bouquets': 'Bouquets',
  'bouquet': 'Bouquets',
};

export default function App() {
  const [cartCount, setCartCount] = useState<number>(0);

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
    // Ready for cart drawer
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

      {/* 3. Main Content: Dedicated Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' ? (
          /* =========================================================================
             LANDING PAGE VIEW (Home)
             ========================================================================= */
          <div className="relative w-full">
            {/* Soothing Ambient Particle & Pastel Aura Background */}
            <DynamicScrollBackground />

            {/* Hero Landing Banner */}
            <div id="section-hero">
              <HeroBanner onShopClick={() => navigateTo('shop', 'all')} />
              <TrustBadges />
            </div>

            {/* Shop by Category (Scalloped Cloud Container, 3 Top, 3 Below) */}
            <div id="section-categories">
              <CategoriesSection
                onCategorySelect={(id) => {
                  const targetCat = CATEGORY_MAP[id] || id;
                  navigateTo('shop', targetCat);
                }}
              />
            </div>

            {/* Bestsellers Section (Yarn Ball Divider, 4-Point Sparkle Stars, Carousel) */}
            <div id="section-bestsellers">
              <BestsellersSection
                onProductClick={(id) => navigateTo('product', id)}
                onShopAllClick={() => navigateTo('shop', 'all')}
                onNotifyClick={(id) => navigateTo('product', id)}
              />
            </div>

            {/* Storytelling Section: Made by Hand, Made with Love (2-Column Collage + Craft Washi Tape & Knots) */}
            <div id="section-story">
              <OurStorySection onStoryClick={() => console.log('Our story clicked')} />
            </div>

            {/* Shop The Occasion Section (Top Stitch with Smiling Flower, 5 Occasion Cards with Hover Crossfade, Bottom Golden Wave) */}
            <div id="section-occasions">
              <ShopTheOccasionSection
                onOccasionClick={(id) => navigateTo('shop', 'all')}
              />
            </div>

            {/* Reels / Community Section ("from our community ♡" + Instagram Link + Autoplaying 9:16 Video Cards) */}
            <div id="section-reels">
              <ReelsSection />
            </div>
          </div>
        ) : currentPage === 'shop' ? (
          /* =========================================================================
             DEDICATED SHOP PAGE VIEW (All Products Shop)
             Exact Match to Reference: 3-Col Desktop with Filters & 2-Col Mobile with Drawer
             ========================================================================= */
          <AllProductsShopSection
            initialCategory={selectedCategory}
            onProductClick={(id) => navigateTo('product', id)}
            onAddToCart={() => setCartCount((prev) => prev + 1)}
            onNavigateHome={() => navigateTo('home')}
          />
        ) : (
          /* =========================================================================
             DEDICATED PRODUCT DETAILS PAGE VIEW
             Exact Match to Reference: Gallery with Arrows & Wishlist, Stepper, Actions & Accordions
             ========================================================================= */
          <ProductDetailsPage
            productId={selectedProductId}
            onNavigateHome={() => navigateTo('home')}
            onNavigateShop={(cat) => navigateTo('shop', cat || 'all')}
            onNavigateProduct={(id) => navigateTo('product', id)}
            onAddToCart={(_product, qty) => setCartCount((prev) => prev + qty)}
          />
        )}
      </main>

      {/* 4. Footer Section ("stay in the loop" newsletter + scalloped wave + brand links & legal) */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
