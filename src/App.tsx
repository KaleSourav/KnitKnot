import React, { useState } from 'react';
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

export default function App() {
  const [cartCount, setCartCount] = useState<number>(0);

  const handleSearchClick = () => {
    // Ready for search modal/filter
  };

  const handleCartClick = () => {
    // Ready for cart drawer
  };

  const handleShopClick = () => {
    const productsEl = document.getElementById('all-products-shop') || document.getElementById('bestsellers');
    if (productsEl) {
      productsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF4ED] text-[#2D2424] antialiased flex flex-col font-['Fredoka']">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Striped Header with Brand Logo and Pill Nav */}
      <Header
        onSearchClick={handleSearchClick}
        onCartClick={handleCartClick}
        cartCount={cartCount}
      />

      {/* 3. Hero Landing Banner */}
      <main className="flex-1">
        <HeroBanner onShopClick={handleShopClick} />

        {/* 4. Trust Badges & Curvy Section Divider */}
        <TrustBadges />

        {/* 5. Shop by Category (Scalloped Cloud Container, 3 Top, 3 Below) */}
        <CategoriesSection onCategorySelect={(id) => console.log('Selected category:', id)} />

        {/* 6. Bestsellers Section (Yarn Ball Divider, 4-Point Sparkle Stars, Carousel) */}
        <div id="bestsellers">
          <BestsellersSection
            onProductClick={(id) => console.log('Product clicked:', id)}
            onShopAllClick={handleShopClick}
            onNotifyClick={(id) => console.log('Notify me clicked for:', id)}
          />
        </div>

        {/* 7. All Products Shop Section (Exact Match to Desktop 3-Col & Mobile 2-Col Layouts with Shopify Products) */}
        <AllProductsShopSection
          onProductClick={(id) => console.log('Product clicked:', id)}
          onAddToCart={() => setCartCount((prev) => prev + 1)}
        />

        {/* 7. Storytelling Section: Made by Hand, Made with Love (2-Column Collage + Craft Washi Tape & Knots) */}
        <OurStorySection onStoryClick={() => console.log('Our story clicked')} />

        {/* 8. Shop The Occasion Section (Top Stitch with Smiling Flower, 5 Occasion Cards with Hover Crossfade, Bottom Golden Wave) */}
        <ShopTheOccasionSection
          onOccasionClick={(id) => console.log('Occasion clicked:', id)}
        />

        {/* 9. Reels / Community Section ("from our community ♡" + Instagram Link + Autoplaying 9:16 Video Cards) */}
        <ReelsSection />
      </main>

      {/* 10. Footer Section ("stay in the loop" newsletter + scalloped wave + brand links & legal) */}
      <Footer />
    </div>
  );
}
