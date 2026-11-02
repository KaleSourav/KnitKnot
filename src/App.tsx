import React, { useState } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TrustBadges } from './components/TrustBadges';

export default function App() {
  const [cartCount, setCartCount] = useState<number>(0);

  const handleSearchClick = () => {
    // Ready for search modal/filter
  };

  const handleCartClick = () => {
    // Ready for cart drawer
  };

  const handleShopClick = () => {
    const productsEl = document.getElementById('products');
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

        {/* 4. Trust Badges & Value Propositions */}
        <TrustBadges />

        {/* Anchor for shopping section */}
        <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* We will build the next sections step-by-step as guided by the user */}
        </div>
      </main>
    </div>
  );
}
