import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, User, ShoppingBag, ArrowRight, Menu, X, Sparkles, Layers } from 'lucide-react';
import { CATEGORIES_DATA } from '../data/categories';

export interface NavItem {
  id: string;
  label: string;
  emoji?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'Home', label: 'Home' },
  { id: 'Flowers', label: 'Flowers (61)', emoji: '🌸' },
  { id: 'Keychains', label: 'Keychains (40)', emoji: '🔑' },
  { id: 'Flower Pots', label: 'Pots (21)', emoji: '🪴' },
  { id: 'Bags', label: 'Bags (19)', emoji: '👜' },
  { id: 'Vases', label: 'Vases (19)', emoji: '🏺' },
  { id: 'All Products', label: 'All 252 Items', emoji: '🧶' },
];

interface KnitKnotNavbarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  cartCount?: number;
  onSearchClick?: () => void;
  onUserClick?: () => void;
  onCartClick?: () => void;
  onShopNowClick?: () => void;
}

export const KnitKnotNavbar: React.FC<KnitKnotNavbarProps> = ({
  activeTab,
  onTabChange,
  cartCount = 0,
  onSearchClick,
  onUserClick,
  onCartClick,
  onShopNowClick,
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const [ovalStyle, setOvalStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const targetTab = hoveredTab || activeTab;

  // Accurately recalculate the position of the oval
  const updatePosition = useCallback(() => {
    const container = navContainerRef.current;
    const targetElement = itemRefs.current[targetTab];

    if (container && targetElement) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();

      setOvalStyle({
        left: targetRect.left - containerRect.left + container.scrollLeft,
        top: targetRect.top - containerRect.top + container.scrollTop,
        width: targetRect.width,
        height: targetRect.height,
        opacity: 1,
      });
    }
  }, [targetTab]);

  useEffect(() => {
    updatePosition();
    if (document.fonts) {
      document.fonts.ready.then(updatePosition);
    }
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition, targetTab, activeTab]);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleMobileNavClick = (id: string) => {
    onTabChange(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full select-none transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'backdrop-blur-xl bg-[#0a080f]/95 border-b border-white/10 shadow-lg py-2.5 sm:py-3'
          : 'bg-transparent border-none py-3 sm:py-4'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* 1. LEFT LOGO & TAGLINE */}
        <div 
          onClick={() => {
            onTabChange('Home');
            setIsMobileMenuOpen(false);
          }}
          className="flex flex-col items-start cursor-pointer shrink-0 transition-opacity hover:opacity-90 min-w-0"
        >
          <div className="flex items-center">
            <span className="text-2xl sm:text-[30px] lg:text-[34px] font-extrabold tracking-tight text-white font-['Nunito',sans-serif] leading-none drop-shadow-sm">
              KnitKnot
            </span>
            {/* Handcrafted Heart Loop Doodle with Sparkle */}
            <span className="inline-flex items-center ml-1 text-white relative">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 fill-none stroke-current"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>
          <span className="text-[8px] sm:text-[10px] lg:text-[11px] font-semibold tracking-[0.14em] sm:tracking-[0.18em] uppercase text-white/90 mt-0.5 pl-0.5 truncate max-w-[180px] sm:max-w-none">
            -WE'VE MADE IT WITH LOVE
          </span>
        </div>

        {/* 2. CENTER DESKTOP MENU (HIDDEN ON MOBILE/TABLET, SHOWN ON LG SCREENS) */}
        <nav
          ref={navContainerRef}
          onMouseLeave={() => setHoveredTab(null)}
          className="hidden lg:flex items-center relative py-1 px-1 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {/* THE SMOOTH MOVING OVAL HIGHLIGHT */}
          <div
            className="absolute rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.2,0.9,0.3,1.2)]"
            style={{
              left: `${ovalStyle.left}px`,
              top: `${ovalStyle.top}px`,
              width: `${ovalStyle.width}px`,
              height: `${ovalStyle.height}px`,
              opacity: ovalStyle.opacity,
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              border: '1.5px solid rgba(255, 255, 255, 0.55)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
            }}
          />

          {/* ALL 8 NAV MENU BUTTONS */}
          <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 shrink-0">
            {NAV_ITEMS.map((item) => {
              const isSelected = activeTab === item.id;
              const isHovered = hoveredTab === item.id;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[item.id] = el;
                  }}
                  onMouseEnter={() => setHoveredTab(item.id)}
                  onClick={() => onTabChange(item.id)}
                  className={`relative z-10 px-3 py-1.5 text-[14px] lg:text-[15px] font-semibold text-white whitespace-nowrap rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-none ${
                    isSelected || isHovered
                      ? 'text-white'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* 3. RIGHT ICONS & MOBILE HAMBURGER TOGGLE */}
        <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0">
          {/* Search Icon */}
          <button
            onClick={onSearchClick}
            className="p-1.5 sm:p-2 text-white hover:text-white/80 transition-colors cursor-pointer rounded-full hover:bg-white/10"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[2.2]" />
          </button>

          {/* User Account Icon (hidden on extra small screens, accessible via mobile drawer) */}
          <button
            onClick={onUserClick}
            className="hidden sm:flex p-1.5 sm:p-2 text-white hover:text-white/80 transition-colors cursor-pointer rounded-full hover:bg-white/10"
            title="Account"
            aria-label="Account"
          >
            <User className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[2.2]" />
          </button>

          {/* Shopping Bag Icon with badge */}
          <button
            onClick={onCartClick}
            className="p-1.5 sm:p-2 text-white hover:text-white/80 transition-colors cursor-pointer rounded-full hover:bg-white/10 relative"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[2.2]" />
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-[#edd2f7] text-[#4a044e] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          </button>

          {/* SHOP NOW -> Pill Button (Desktop only) */}
          <button
            onClick={onShopNowClick}
            className="hidden md:flex bg-[#edd2f7] hover:bg-[#e4c2f1] active:scale-95 transition-all text-[#4a044e] font-extrabold text-xs sm:text-[13px] tracking-wider uppercase px-4 lg:px-5 py-2 sm:py-2.5 rounded-full items-center gap-1.5 shadow-md cursor-pointer shrink-0"
          >
            <span>SHOP NOW</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </button>

          {/* Mobile Hamburger Menu Toggle Button (Visible on < lg) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-white hover:text-white/80 transition-colors cursor-pointer rounded-full hover:bg-white/10 ml-0.5"
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 stroke-[2.4] text-[#edd2f7]" />
            ) : (
              <Menu className="w-6 h-6 stroke-[2.4]" />
            )}
          </button>
        </div>

      </div>

      {/* 4. EXPANDABLE MOBILE MENU DRAWER / MODAL */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[54px] sm:top-[64px] bottom-0 bg-[#0a080f]/98 backdrop-blur-2xl border-t border-white/10 z-40 overflow-y-auto flex flex-col justify-between p-5 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-300 pb-2 border-b border-white/10">
              <span className="flex items-center gap-1.5 uppercase tracking-widest text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                Browse 13 Categories (252 Items)
              </span>
              <span className="text-purple-200 font-extrabold">252 Items</span>
            </div>

            {/* All 13 Categories Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1 max-h-[50vh] overflow-y-auto pr-1">
              <button
                onClick={() => handleMobileNavClick('All Products')}
                className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all text-left col-span-2 ${
                  activeTab === 'All Products'
                    ? 'bg-[#edd2f7] text-[#4a044e] shadow-md font-extrabold'
                    : 'bg-purple-900/20 hover:bg-purple-900/30 text-white border border-purple-500/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🧶</span>
                  <span>All 252 Products</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-black/20 text-[10px]">252 items</span>
              </button>

              {CATEGORIES_DATA.map((cat) => {
                const isSelected = activeTab.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleMobileNavClick(cat.name)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                      isSelected
                        ? 'bg-[#edd2f7] text-[#4a044e] shadow-md font-extrabold'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="select-none">{cat.emoji}</span>
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-normal shrink-0">
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Bottom Quick Actions */}
          <div className="pt-6 border-t border-white/10 space-y-3 mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onUserClick?.();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
              >
                <User className="w-4 h-4 text-purple-300" />
                <span>My Account / VIP</span>
              </button>
              
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onSearchClick?.();
                }}
                className="flex items-center justify-center p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white"
                title="Search"
              >
                <Search className="w-4 h-4 text-purple-300" />
              </button>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onShopNowClick?.();
              }}
              className="w-full bg-[#edd2f7] hover:bg-[#e4c2f1] text-[#4a044e] font-extrabold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl"
            >
              <span>EXPLORE ALL COLLECTIONS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
