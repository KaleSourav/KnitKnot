import React, { useState, useEffect } from 'react';
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
import { Footer } from './components/Footer';

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

  // Client-side page routing: 'home' | 'shop'
  const [currentPage, setCurrentPage] = useState<'home' | 'shop'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      return hash.startsWith('#shop') || hash.startsWith('#/shop') ? 'shop' : 'home';
    }
    return 'home';
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
      const hash = window.location.hash;
      if (hash.startsWith('#shop') || hash.startsWith('#/shop')) {
        setCurrentPage('shop');
        const qIndex = hash.indexOf('?');
        if (qIndex !== -1) {
          const params = new URLSearchParams(hash.substring(qIndex));
          setSelectedCategory(params.get('category') || 'all');
        } else {
          setSelectedCategory('all');
        }
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Central page navigator
  const navigateTo = (page: 'home' | 'shop', category: string = 'all') => {
    setCurrentPage(page);
    setSelectedCategory(category);

    if (page === 'home') {
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
    } else {
      if (category && category !== 'all') {
        window.location.hash = `/shop?category=${encodeURIComponent(category)}`;
      } else {
        window.location.hash = '/shop';
      }
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
          <>
            {/* Hero Landing Banner */}
            <HeroBanner onShopClick={() => navigateTo('shop', 'all')} />

            {/* Trust Badges & Curvy Section Divider */}
            <TrustBadges />

            {/* Shop by Category (Scalloped Cloud Container, 3 Top, 3 Below) */}
            <CategoriesSection
              onCategorySelect={(id) => {
                const targetCat = CATEGORY_MAP[id] || id;
                navigateTo('shop', targetCat);
              }}
            />

            {/* Bestsellers Section (Yarn Ball Divider, 4-Point Sparkle Stars, Carousel) */}
            <div id="bestsellers">
              <BestsellersSection
                onProductClick={(id) => console.log('Product clicked:', id)}
                onShopAllClick={() => navigateTo('shop', 'all')}
                onNotifyClick={(id) => console.log('Notify me clicked for:', id)}
              />
            </div>

            {/* Storytelling Section: Made by Hand, Made with Love (2-Column Collage + Craft Washi Tape & Knots) */}
            <OurStorySection onStoryClick={() => console.log('Our story clicked')} />

            {/* Shop The Occasion Section (Top Stitch with Smiling Flower, 5 Occasion Cards with Hover Crossfade, Bottom Golden Wave) */}
            <ShopTheOccasionSection
              onOccasionClick={(id) => navigateTo('shop', 'all')}
            />

            {/* Reels / Community Section ("from our community ♡" + Instagram Link + Autoplaying 9:16 Video Cards) */}
            <ReelsSection />
          </>
        ) : (
          /* =========================================================================
             DEDICATED SHOP PAGE VIEW (All Products Shop)
             Exact Match to Reference: 3-Col Desktop with Filters & 2-Col Mobile with Drawer
             ========================================================================= */
          <AllProductsShopSection
            initialCategory={selectedCategory}
            onProductClick={(id) => console.log('Product clicked:', id)}
            onAddToCart={() => setCartCount((prev) => prev + 1)}
            onNavigateHome={() => navigateTo('home')}
          />
        )}
      </main>

      {/* 4. Footer Section ("stay in the loop" newsletter + scalloped wave + brand links & legal) */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
