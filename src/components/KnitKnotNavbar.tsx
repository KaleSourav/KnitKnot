import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, User, ShoppingBag, ArrowRight } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'Home', label: 'Home' },
  { id: 'Flowers', label: 'Flowers' },
  { id: 'Amigurumi', label: 'Amigurumi' },
  { id: 'Accessories', label: 'Accessories' },
  { id: 'Clothing', label: 'Clothing' },
  { id: 'Utility', label: 'Utility' },
  { id: 'BYOB', label: 'BYOB' },
  { id: 'All Products', label: 'All Products' },
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
    // Also recompute after fonts load and on resize
    if (document.fonts) {
      document.fonts.ready.then(updatePosition);
    }
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition, targetTab, activeTab]);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full select-none transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-md bg-[#0a080f]/90 border-b border-white/10 shadow-lg py-2.5'
          : 'bg-transparent border-none py-3.5 sm:py-4'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* 1. LEFT LOGO & TAGLINE */}
        <div 
          onClick={() => onTabChange('Home')}
          className="flex flex-col items-start cursor-pointer shrink-0 transition-opacity hover:opacity-90"
        >
          <div className="flex items-center">
            <span className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-white font-['Nunito',sans-serif] leading-none drop-shadow-sm">
              KnitKnot
            </span>
            {/* Handcrafted Heart Loop Doodle with Sparkle */}
            <span className="inline-flex items-center ml-1 text-white relative">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 fill-none stroke-current"
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
          <span className="text-[9.5px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-white/95 mt-1 pl-0.5">
            -WE'AVE MADE IT WITH LOVE
          </span>
        </div>

        {/* 2. CENTER MENU ITEMS WITH SMOOTH MOVING OVAL INDICATOR */}
        <nav
          ref={navContainerRef}
          onMouseLeave={() => setHoveredTab(null)}
          className="flex items-center relative py-1 px-1 overflow-x-auto no-scrollbar scroll-smooth"
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
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 shrink-0">
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
                  className={`relative z-10 px-3 sm:px-3.5 md:px-4 py-2 text-[13.5px] sm:text-[14.5px] md:text-[15.5px] font-semibold text-white whitespace-nowrap rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-none ${
                    isSelected || isHovered
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* 3. RIGHT ICONS & SHOP NOW BUTTON */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 shrink-0">
          {/* Search Icon */}
          <button
            onClick={onSearchClick}
            className="p-1.5 text-white hover:text-white/80 transition-colors cursor-pointer rounded-full hover:bg-white/10"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[2.2]" />
          </button>

          {/* User Account Icon */}
          <button
            onClick={onUserClick}
            className="p-1.5 text-white hover:text-white/80 transition-colors cursor-pointer rounded-full hover:bg-white/10"
            title="Account"
            aria-label="Account"
          >
            <User className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[2.2]" />
          </button>

          {/* Shopping Bag Icon with '0' badge */}
          <button
            onClick={onCartClick}
            className="p-1.5 text-white hover:text-white/80 transition-colors cursor-pointer rounded-full hover:bg-white/10 relative"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 bg-white text-[#4a044e] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          </button>

          {/* SHOP NOW -> Pill Button */}
          <button
            onClick={onShopNowClick}
            className="bg-[#edd2f7] hover:bg-[#e4c2f1] active:scale-95 transition-all text-[#4a044e] font-extrabold text-xs sm:text-[13px] tracking-wider uppercase px-4 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
          >
            <span>SHOP NOW</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </header>
  );
};
