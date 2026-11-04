import React, { useState } from 'react';

interface HeaderProps {
  onSearchClick?: () => void;
  onCartClick?: () => void;
  cartCount?: number;
  currentPage?: 'home' | 'shop';
  activeCategory?: string;
  onNavigate?: (page: 'home' | 'shop', categoryId?: string) => void;
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

  const categories = [
    { id: 'all', label: 'all products', category: 'all' },
    { id: 'flowers', label: 'flowers', category: 'Flowers' },
    { id: 'bouquets', label: 'bouquets', category: 'Bouquets' },
    { id: 'plushies', label: 'plushies', category: 'Plushies' },
    { id: 'bags', label: 'bags', category: 'Bags' },
    { id: 'keychains', label: 'keychains', category: 'Keychains' },
    { id: 'flower-pots', label: 'flower pots', category: 'Flower Pots' },
    { id: 'more', label: 'more', hasIcon: true, category: 'Home Decor' },
  ];

  return (
    <header className="relative w-full knots-header-stripes border-b border-[#E2D8C3]/50">
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3 flex items-center justify-between">
        {/* Left: Hamburger Icon */}
        <div className="flex-1 flex items-center justify-start">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 text-[#641623] hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8"
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

        {/* Center: Brand Logo + Subtitle */}
        <div className="flex flex-col items-center justify-center text-center px-2">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.('home');
            }}
            className="inline-block transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <img
              src="/logo-knotsnco.png"
              alt="knotsnco."
              className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-sm"
            />
          </a>
          <span className="text-[#641623] font-['Fredoka'] font-semibold text-xs sm:text-sm tracking-wide lowercase mt-0.5">
            everything crochet
          </span>
        </div>

        {/* Right: Actions (Search, Profile, Cart) */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3 md:gap-4 text-[#641623]">
          {/* Search Icon */}
          <button
            onClick={onSearchClick}
            className="p-2 hover:opacity-80 transition-opacity"
            aria-label="Search products"
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
            className="p-2 hover:opacity-80 transition-opacity"
            aria-label="My Account"
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
            className="p-2 relative hover:opacity-80 transition-opacity"
            aria-label="Shopping Cart"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
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
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#641623] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
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

      {/* Floating Pill Category Navigation Bar */}
      <div className="w-full relative z-20 -mb-4 px-4 flex justify-center">
        <div className="inline-flex items-center gap-1 sm:gap-2 bg-[#FFFDF6] border border-[#EFE4D6] rounded-full px-4 sm:px-6 py-1 sm:py-1.5 shadow-[0_4px_16px_rgba(100,22,35,0.08)] overflow-x-auto no-scrollbar max-w-full">
          {categories.map((cat) => {
            const isActive =
              currentPage === 'shop' &&
              (activeCategory === cat.category ||
                activeCategory === cat.id ||
                (cat.id === 'all' && (!activeCategory || activeCategory === 'all')));

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onNavigate?.('shop', cat.category || cat.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-['Fredoka'] font-semibold lowercase transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-white bg-[#641623] shadow-xs scale-105'
                    : 'text-[#641623] hover:bg-[#641623]/10 hover:scale-[1.02]'
                }`}
              >
                <span>{cat.label}</span>
                {cat.hasIcon && (
                  <svg
                    className={`w-3.5 h-3.5 fill-current ${isActive ? 'text-white' : 'text-[#641623]'}`}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2a3.5 3.5 0 00-3.5 3.5c0 .35.05.69.15 1A3.5 3.5 0 005.15 8.1 3.5 3.5 0 003.5 12 3.5 3.5 0 005.15 15.9a3.5 3.5 0 003.5 1.6c-.1.31-.15.65-.15 1A3.5 3.5 0 0012 22a3.5 3.5 0 003.5-3.5c0-.35-.05-.69-.15-1a3.5 3.5 0 003.5-1.6A3.5 3.5 0 0020.5 12a3.5 3.5 0 00-1.65-3.9 3.5 3.5 0 00-3.5-1.6c.1-.31.15-.65.15-1A3.5 3.5 0 0012 2zm0 7a3 3 0 100 6 3 3 0 000-6z"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm bg-[#FFFDF8] h-full shadow-2xl flex flex-col p-6 z-10 border-r border-[#EFE4D6]">
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
                className="p-1.5 text-[#641623] hover:opacity-70 cursor-pointer"
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

            <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
              {/* Home Navigation Button */}
              <button
                onClick={() => {
                  onNavigate?.('home');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-['Fredoka'] font-semibold text-base transition-colors flex items-center justify-between cursor-pointer ${
                  currentPage === 'home'
                    ? 'bg-[#641623] text-white shadow-sm'
                    : 'text-[#641623] hover:bg-[#641623]/10'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>home</span>
                </span>
                <span className="text-xs opacity-70">→</span>
              </button>

              {/* Shop All Products Navigation Button */}
              <button
                onClick={() => {
                  onNavigate?.('shop', 'all');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-['Fredoka'] font-semibold text-base transition-colors flex items-center justify-between cursor-pointer ${
                  currentPage === 'shop' && (!activeCategory || activeCategory === 'all')
                    ? 'bg-[#641623] text-white shadow-sm'
                    : 'text-[#641623] hover:bg-[#641623]/10'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span>shop all products</span>
                </span>
                <span className="text-xs opacity-70">→</span>
              </button>

              <div className="pt-3 pb-1 px-4 text-xs font-bold text-[#641623]/60 tracking-wider uppercase">
                categories
              </div>

              {categories.filter((c) => c.id !== 'all').map((cat) => {
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
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-['Fredoka'] font-medium text-sm transition-colors flex items-center justify-between cursor-pointer ${
                      isCatActive
                        ? 'bg-[#641623]/15 text-[#641623] font-bold'
                        : 'text-[#641623] hover:bg-[#641623]/10'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-xs text-[#641623]/40">→</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#EFE4D6] space-y-2 text-center text-xs text-[#641623]/70 font-['Fredoka']">
              <p className="font-semibold text-[#641623]">knotsnco. • everything crochet</p>
              <p>Handcrafted with love, just for you.</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
