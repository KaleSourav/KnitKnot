import React, { useState } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TrustBadges } from './components/TrustBadges';
import { CategoriesSection } from './components/CategoriesSection';
import { BestsellersSection } from './components/BestsellersSection';

export default function App() {
  const [cartCount, setCartCount] = useState<number>(0);

  const handleSearchClick = () => {
    // Ready for search modal/filter
  };

  const handleCartClick = () => {
    // Ready for cart drawer
  };

  const handleShopClick = () => {
    const productsEl = document.getElementById('bestsellers');
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
            onShopAllClick={() => console.log('Shop all bestsellers clicked')}
          />
        </div>
      </main>
    </div>
  );
}
