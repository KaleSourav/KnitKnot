import React, { useState } from 'react';

interface HeaderProps {
  onSearchClick?: () => void;
  onCartClick?: () => void;
  cartCount?: number;
  currentPage?: 'home' | 'shop' | 'product';
  activeCategory?: string;
  onNavigate?: (page: 'home' | 'shop' | 'product', categoryId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  onCartClick,
  cartCount = 0,
  currentPage = 'home',
  activeCategory = 'all',
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 8 Main Product Categories for Menu Drawer
  const categories = [
    { id: 'flowers', label: 'flowers', count: 87, category: 'Flowers' },
    { id: 'bouquets', label: 'bouquets', count: 56, category: 'Bouquets' },
    { id: 'plushies', label: 'plushies', count: 33, category: 'Plushies' },
    { id: 'bags', label: 'bags', count: 21, category: 'Bags' },
    { id: 'keychains', label: 'keychains', count: 57, category: 'Keychains' },
    { id: 'flower-pots', label: 'flower pots', count: 40, category: 'Flower Pots' },
    { id: 'home-decor', label: 'home decor', count: 32, category: 'Home Decor' },
    { id: 'accessories', label: 'accessories', count: 28, category: 'Accessories' },
  ];

  // Smooth scroll handler for "Story" section (Made by Hand, Made with Love)
  const handleStoryClick = () => {
    if (currentPage !== 'home') {
      onNavigate?.('home');
      setTimeout(() => {
        const el = document.getElementById('section-story');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      const el = document.getElementById('section-story');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Smooth scroll handler for "Contact us" (Footer section)
  const handleContactClick = () => {
    if (currentPage !== 'home') {
      onNavigate?.('home');
      setTimeout(() => {
        const el = document.getElementById('section-footer') || document.querySelector('footer');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      const el = document.getElementById('section-footer') || document.querySelector('footer');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="relative w-full knots-header-stripes border-b border-[#E2D8C3]/50">
      {/* Top Navbar Row: Absolute Center Logo for 100% Balanced Mobile & Desktop View */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2.5 sm:pb-3 flex items-center justify-between relative min-h-[58px] sm:min-h-[70px]">
        {/* Left: Hamburger Menu Icon */}
        <div className="flex-1 flex items-center justify-start z-20">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 sm:p-2 -ml-1 text-[#641623] hover:opacity-80 transition-transform active:scale-95 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
            title="Open Menu"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
              viewBox="0 0 28 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="4" y1="7" x2="24" y2="7" />
              <line x1="4" y1="14" x2="24" y2="14" />
              <line x1="4" y1="21" x2="24" y2="21" />
            </svg>
          </button>
        </div>

        {/* Center: Brand Logo + Subtitle (Mathematically Centered via Absolute Translation) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center z-10 pointer-events-auto">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.('home');
            }}
            className="inline-block transition-transform hover:scale-[1.03] active:scale-97 cursor-pointer"
          >
            <img
              src="/logo-knotsnco.png"
              alt="knotsnco."
              className="h-8 sm:h-11 md:h-13 w-auto object-contain drop-shadow-sm select-none"
            />
          </a>
          <span className="text-[#641623] font-['Fredoka'] font-semibold text-[10px] sm:text-xs md:text-sm tracking-wide lowercase -mt-0.5 sm:mt-0.5 whitespace-nowrap select-none">
            everything crochet
          </span>
        </div>

        {/* Right: Actions (Search, Profile, Cart) */}
        <div className="flex-1 flex items-center justify-end gap-1 sm:gap-2.5 md:gap-3.5 text-[#641623] z-20">
          {/* Search Icon */}
          <button
            onClick={onSearchClick}
            className="p-1.5 sm:p-2 hover:opacity-80 transition-transform active:scale-95 cursor-pointer"
            aria-label="Search products"
            title="Search"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* User Profile Icon */}
          <button
            className="p-1.5 sm:p-2 hover:opacity-80 transition-transform active:scale-95 cursor-pointer"
            aria-label="My Account"
            title="Account"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* Cart Bag Icon with Cute Badge */}
          <button
            onClick={onCartClick}
            className="p-1.5 sm:p-2 relative hover:opacity-80 transition-transform active:scale-95 cursor-pointer"
            aria-label="Shopping Cart"
            title="Cart"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>

            {/* Cute Little Heart Badge */}
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 rounded-full bg-[#641623] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
              {cartCount > 0 ? (
                cartCount
              ) : (
                <svg
                  className="w-2.5 h-2.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Floating Pill Navigation Bar: [Shop all] [Story] [Contact us] [More] */}
      <div className="w-full relative z-20 -mb-4 px-2 sm:px-4 flex justify-center">
        <div className="inline-flex items-center gap-1 sm:gap-2 bg-[#FFFDF6] border-[1.8px] border-[#641623]/25 rounded-full px-2 sm:px-4 py-1 sm:py-1.5 shadow-[0_6px_20px_rgba(100,22,35,0.08)] max-w-full overflow-x-auto no-scrollbar">
          
          {/* 1. Shop all */}
          <button
            type="button"
            onClick={() => onNavigate?.('shop', 'all')}
            className={`group relative inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1 rounded-full font-['Fredoka'] font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
              currentPage === 'shop' && (!activeCategory || activeCategory === 'all')
                ? 'bg-[#811B2B] text-white shadow-xs scale-102'
                : 'text-[#641623] hover:bg-[#FFF5CC] hover:text-[#811B2B] hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95'
            }`}
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>Shop all</span>
          </button>

          {/* 2. Story (Redirects/Scrolls to "Made by Hand, Made with Love" Section) */}
          <button
            type="button"
            onClick={handleStoryClick}
            className="group relative inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1 rounded-full font-['Fredoka'] font-bold text-xs sm:text-sm tracking-wide text-[#641623] hover:bg-[#FFF5CC] hover:text-[#811B2B] hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer select-none whitespace-nowrap"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-[#811B2B] transition-transform duration-300 group-hover:scale-120 group-hover:rotate-12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>Story</span>
          </button>

          {/* 3. Contact us (Redirects/Scrolls to Footer) */}
          <button
            type="button"
            onClick={handleContactClick}
            className="group relative inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1 rounded-full font-['Fredoka'] font-bold text-xs sm:text-sm tracking-wide text-[#641623] hover:bg-[#FFF5CC] hover:text-[#811B2B] hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer select-none whitespace-nowrap"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:-translate-y-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="12" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
            </svg>
            <span>Contact us</span>
          </button>

          {/* 4. More (Opens Left Side Navigation Menu Drawer) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="group relative inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1 rounded-full font-['Fredoka'] font-bold text-xs sm:text-sm tracking-wide text-[#641623] hover:bg-[#FFF5CC] hover:text-[#811B2B] hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer select-none whitespace-nowrap"
          >
            {/* Cute 4-Petal Daisy Flower Icon that spins on hover */}
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-[#811B2B] transition-transform duration-300 group-hover:rotate-90 group-hover:scale-115"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2a3.5 3.5 0 00-3.5 3.5c0 .35.05.69.15 1A3.5 3.5 0 005.15 8.1 3.5 3.5 0 003.5 12 3.5 3.5 0 005.15 15.9a3.5 3.5 0 003.5 1.6c-.1.31-.15.65-.15 1A3.5 3.5 0 0012 22a3.5 3.5 0 003.5-3.5c0-.35-.05-.69-.15-1a3.5 3.5 0 003.5-1.6A3.5 3.5 0 0020.5 12a3.5 3.5 0 00-1.65-3.9 3.5 3.5 0 00-3.5-1.6c.1-.31.15-.65.15-1A3.5 3.5 0 0012 2zm0 7a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
            <span>More</span>
            <svg
              className="w-3 h-3 text-[#641623]/70 transition-transform duration-200 group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Left-Side Navigation Menu Drawer (Slide-Over) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-[#380B12]/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-in Menu Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-[#FFFDF8] h-full shadow-2xl flex flex-col p-6 z-10 border-r-2 border-[#641623] animate-[slideInLeft_0.3s_ease-out]">
            {/* Top Bar with Logo & Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE4D6]">
              <a
                href="#/"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.('home');
                  setMobileMenuOpen(false);
                }}
                className="cursor-pointer"
              >
                <img
                  src="/logo-knotsnco.png"
                  alt="knotsnco."
                  className="h-9 w-auto"
                />
              </a>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#641623]/10 text-[#641623] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Navigation Links with Cute Icons */}
            <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
              {/* Home */}
              <button
                onClick={() => {
                  onNavigate?.('home');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-['Fredoka'] font-semibold text-base transition-all flex items-center justify-between cursor-pointer group ${
                  currentPage === 'home'
                    ? 'bg-[#811B2B] text-white shadow-xs'
                    : 'text-[#641623] hover:bg-[#FFF5CC]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>home</span>
                </span>
                <span className="text-xs opacity-70">→</span>
              </button>

              {/* Shop All Products */}
              <button
                onClick={() => {
                  onNavigate?.('shop', 'all');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-['Fredoka'] font-semibold text-base transition-all flex items-center justify-between cursor-pointer group ${
                  currentPage === 'shop' && (!activeCategory || activeCategory === 'all')
                    ? 'bg-[#811B2B] text-white shadow-xs'
                    : 'text-[#641623] hover:bg-[#FFF5CC]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <span>shop all products</span>
                </span>
                <span className="text-xs opacity-70">→</span>
              </button>

              {/* Our Story (Made by Hand, Made with Love) */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleStoryClick();
                }}
                className="w-full text-left px-4 py-3 rounded-xl font-['Fredoka'] font-semibold text-base transition-all flex items-center justify-between text-[#641623] hover:bg-[#FFF5CC] cursor-pointer group"
              >
                <span className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-[#811B2B] transition-transform duration-200 group-hover:scale-120 group-hover:rotate-12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>our story</span>
                </span>
                <span className="text-xs opacity-70">→</span>
              </button>

              {/* Contact Us */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleContactClick();
                }}
                className="w-full text-left px-4 py-3 rounded-xl font-['Fredoka'] font-semibold text-base transition-all flex items-center justify-between text-[#641623] hover:bg-[#FFF5CC] cursor-pointer group"
              >
                <span className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <circle cx="9" cy="10" r="1" fill="currentColor" />
                    <circle cx="12" cy="10" r="1" fill="currentColor" />
                    <circle cx="15" cy="10" r="1" fill="currentColor" />
                  </svg>
                  <span>contact us</span>
                </span>
                <span className="text-xs opacity-70">→</span>
              </button>

              {/* Divider & Categories Section */}
              <div className="pt-3 pb-1 px-4 text-xs font-bold text-[#641623]/60 tracking-wider uppercase flex items-center justify-between">
                <span>shop categories</span>
                <span className="text-[10px] text-[#811B2B] lowercase font-semibold">8 collections</span>
              </div>

              {categories.map((cat) => {
                const isCatActive =
                  currentPage === 'shop' &&
                  (activeCategory === cat.category || activeCategory === cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onNavigate?.('shop', cat.category || cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-['Fredoka'] font-medium text-sm transition-all flex items-center justify-between cursor-pointer group ${
                      isCatActive
                        ? 'bg-[#811B2B] text-white font-bold shadow-xs'
                        : 'text-[#641623] hover:bg-[#FFF5CC]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#811B2B] group-hover:scale-125 transition-transform" />
                      <span className="capitalize">{cat.label}</span>
                    </span>
                    <span className={`text-xs ${isCatActive ? 'text-white/80' : 'text-[#641623]/50'}`}>
                      ({cat.count})
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-[#EFE4D6] space-y-1.5 text-center text-xs text-[#641623]/75 font-['Fredoka']">
              <p className="font-bold text-[#641623]">knotsnco. • everything crochet</p>
              <p className="text-[11px]">Handcrafted with love by our dadis in Surat.</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
