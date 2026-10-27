import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  User, 
  ShoppingBag, 
  Heart, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  Eye,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Product } from '../data/products';
import logoImg from '../assets/logo-knotsnco.png';

export interface NavCategoryConfig {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  filter: (p: Product) => boolean;
}

export const NAV_CATEGORIES: NavCategoryConfig[] = [
  {
    id: 'bags',
    name: 'Bags',
    tagline: 'Handmade Daisy & Sunflower Carryalls',
    emoji: '👜',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return c === 'bags' || n.includes('bag') || n.includes('tote');
    },
  },
  {
    id: 'accessories',
    name: 'Accessories',
    tagline: 'Floral Hair Clips, Gajras & Bandanas',
    emoji: '🎀',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return (
        c === 'hair accessories' ||
        c === 'bandanas' ||
        c === 'earrings' ||
        c === 'accessories' ||
        n.includes('clip') ||
        n.includes('gajra') ||
        n.includes('bandana')
      );
    },
  },
  {
    id: 'flowers',
    name: 'Flowers',
    tagline: 'Everlasting Roses, Lilies & Foliage',
    emoji: '🌸',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return (
        c === 'flowers' ||
        c === 'fillers' ||
        c === 'bouquets' ||
        n.includes('rose') ||
        n.includes('lily') ||
        n.includes('tulip') ||
        n.includes('flower') ||
        n.includes('daisy') ||
        n.includes('sunflower')
      );
    },
  },
  {
    id: 'home-decore',
    name: 'Home Decore',
    tagline: 'Character Standees, Vases & Magnets',
    emoji: '🏺',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return (
        c === 'standees' ||
        c === 'vases' ||
        c === 'fridge magnets' ||
        c.includes('decor') ||
        n.includes('standee') ||
        n.includes('vase') ||
        n.includes('magnet')
      );
    },
  },
  {
    id: 'flower-pots',
    name: 'Flower Pots',
    tagline: 'Desk Potted Plants & Illuminated Lilies',
    emoji: '🪴',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return c === 'flower pots' || c.includes('pot') || n.includes('pot');
    },
  },
  {
    id: 'keychains-bag-charms',
    name: 'Keychains & Bag Charms',
    tagline: 'Fruit Turtles, Pocket Pals & Charms',
    emoji: '🔑',
    filter: (p) => {
      const c = (p.category || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return (
        c === 'keychains' ||
        c === 'bag charms' ||
        c.includes('charm') ||
        n.includes('keychain') ||
        n.includes('charm') ||
        n.includes('turtle')
      );
    },
  },
];

const ANNOUNCEMENTS = [
  'Supporting Women Artisans',
  'Free Shipping Across India on Orders Above ₹999',
  'Crocheted Gifts for a Brighter & Warmer Tomorrow',
  '100% Handcrafted Slowly, Lovingly & By Hand',
];

interface KnitKnotNavbarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  products?: Product[];
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  cartCount?: number;
  wishlistCount?: number;
  onSearchClick?: () => void;
  onUserClick?: () => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onShopNowClick?: () => void;
}

export const KnitKnotNavbar: React.FC<KnitKnotNavbarProps> = ({
  activeTab,
  onTabChange,
  products = [],
  onQuickView,
  onAddToCart,
  cartCount = 0,
  wishlistCount = 0,
  onSearchClick,
  onUserClick,
  onCartClick,
  onWishlistClick,
}) => {
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>('bags');
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Group products by the 6 navigation categories
  const categoryProductsMap = useMemo(() => {
    const map: { [key: string]: Product[] } = {};
    NAV_CATEGORIES.forEach((cat) => {
      map[cat.id] = products.filter(cat.filter);
    });
    return map;
  }, [products]);

  // Smooth slow fade out -> update text -> slow fade in
  const transitionAnnouncement = (nextIndex: number) => {
    setAnnouncementVisible(false);
    setTimeout(() => {
      setAnnouncementIndex(nextIndex);
      setAnnouncementVisible(true);
    }, 450);
  };

  // Auto rotate announcement every 5.2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementVisible(false);
      setTimeout(() => {
        setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setAnnouncementVisible(true);
      }, 450);
    }, 5200);
    return () => clearInterval(timer);
  }, []);

  const handlePrevAnnouncement = (e: React.MouseEvent) => {
    e.stopPropagation();
    transitionAnnouncement((announcementIndex - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNextAnnouncement = (e: React.MouseEvent) => {
    e.stopPropagation();
    transitionAnnouncement((announcementIndex + 1) % ANNOUNCEMENTS.length);
  };

  const handleMouseEnter = (catId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(catId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleCategorySelect = (catName: string) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    onTabChange(catName);
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full select-none shadow-sm bg-[#faf4e8]">
      {/* 1. TOP ANNOUNCEMENT BAR (Rich Burgundy #841724 with soft cream text) */}
      <div className="bg-[#841724] text-[#faedd3] py-2 px-3 sm:px-6 relative flex items-center justify-center border-b border-[#5c0f19]">
        <button
          onClick={handlePrevAnnouncement}
          className="absolute left-2 sm:left-4 p-1 hover:text-white transition-colors cursor-pointer text-[#faedd3]/80 hover:bg-black/10 rounded-full"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
        </button>

        <div className="overflow-hidden h-5 sm:h-6 flex items-center justify-center px-8">
          <span 
            className={`text-[11px] sm:text-xs font-serif tracking-widest text-center uppercase transition-all duration-500 ease-in-out ${
              announcementVisible 
                ? 'opacity-100 translate-y-0 filter-none' 
                : 'opacity-0 -translate-y-1 blur-[1px]'
            }`}
          >
            {ANNOUNCEMENTS[announcementIndex]}
          </span>
        </div>

        <button
          onClick={handleNextAnnouncement}
          className="absolute right-2 sm:right-4 p-1 hover:text-white transition-colors cursor-pointer text-[#faedd3]/80 hover:bg-black/10 rounded-full"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* 2. MAIN HEADER NAVBAR (Warm Cream/White #fffdfa background, Burgundy text/logo) */}
      <div className="bg-[#fffdfa]/95 backdrop-blur-md border-b border-[#841724]/10 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* TOP ROW: Search on left, Logo in center, Icons on right */}
          <div className="h-14 sm:h-16 lg:h-18 flex items-center justify-between relative">
            
            {/* LEFT: Search Icon + Mobile Menu Trigger */}
            <div className="flex items-center gap-1 sm:gap-2 w-1/3 justify-start">
              {/* Mobile Hamburger Toggle (Visible on < lg) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-[#841724] hover:text-[#5c0f19] hover:bg-[#841724]/5 rounded-full transition-colors cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 stroke-[2.2]" />
                ) : (
                  <Menu className="w-5 h-5 stroke-[2.2]" />
                )}
              </button>

              {/* Search Icon Button */}
              <button
                onClick={onSearchClick}
                className="p-2 text-[#841724] hover:text-[#5c0f19] hover:bg-[#841724]/5 rounded-full transition-colors cursor-pointer flex items-center gap-2 group"
                title="Search Products"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[2.2] group-hover:scale-105 transition-transform" />
                <span className="hidden sm:inline text-xs font-semibold text-[#841724]/80 group-hover:text-[#841724] tracking-wide">
                  Search
                </span>
              </button>
            </div>

            {/* CENTER: Brand Logo Image (knotsnco.) */}
            <div className="w-1/3 flex justify-center items-center">
              <button
                onClick={() => handleCategorySelect('Home')}
                className="group flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
                aria-label="Knotsnco Home"
              >
                <img
                  src={logoImg}
                  alt="knotsnco."
                  className="h-8 sm:h-9 md:h-10 w-auto max-w-[170px] sm:max-w-[210px] md:max-w-[240px] object-contain drop-shadow-sm"
                />
              </button>
            </div>

            {/* RIGHT: User Account, Wishlist, Shopping Bag Icons */}
            <div className="flex items-center gap-1.5 sm:gap-3 w-1/3 justify-end">
              {/* User Account */}
              <button
                onClick={onUserClick}
                className="p-2 text-[#841724] hover:text-[#5c0f19] hover:bg-[#841724]/5 rounded-full transition-colors cursor-pointer"
                title="Account"
                aria-label="Account"
              >
                <User className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Wishlist Heart with Badge */}
              <button
                onClick={onWishlistClick || onUserClick}
                className="p-2 text-[#841724] hover:text-[#5c0f19] hover:bg-[#841724]/5 rounded-full transition-colors cursor-pointer relative"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[2.2]" />
                <span className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 bg-[#841724] text-[#faedd3] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              </button>

              {/* Shopping Bag with Count Badge */}
              <button
                onClick={onCartClick}
                className="p-2 text-[#841724] hover:text-[#5c0f19] hover:bg-[#841724]/5 rounded-full transition-colors cursor-pointer relative"
                title="Shopping Bag"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                <span className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 bg-[#841724] text-[#faedd3] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              </button>
            </div>

          </div>

          {/* BOTTOM ROW: The 6 Exact Categories with Rich Mega Dropdown (Desktop) */}
          <div className="hidden lg:flex items-center justify-center gap-4 xl:gap-7 pb-2.5 pt-0 border-t border-[#841724]/10 relative">
            {NAV_CATEGORIES.map((cat) => {
              const isOpen = activeDropdown === cat.id;
              const catProducts = categoryProductsMap[cat.id] || [];
              const isSelected = activeTab.toLowerCase() === cat.name.toLowerCase();

              return (
                <div
                  key={cat.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`flex items-center gap-1 py-1 px-2.5 xl:px-3 text-[13px] xl:text-[14px] font-medium transition-colors cursor-pointer rounded-full ${
                      isOpen || isSelected
                        ? 'text-[#841724] font-bold bg-[#841724]/8'
                        : 'text-[#4a121d] hover:text-[#841724] hover:bg-[#841724]/5'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#841724]' : 'text-[#841724]/60'
                      }`}
                    />
                  </button>

                  {/* RICH SHOPIFY PRODUCTS MEGA DROPDOWN */}
                  {isOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[580px] xl:w-[680px] animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseEnter={() => handleMouseEnter(cat.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="bg-[#fffdfa] rounded-2xl shadow-2xl border border-[#841724]/15 p-4 xl:p-5 overflow-hidden">
                        
                        {/* Dropdown Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#841724]/10">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{cat.emoji}</span>
                            <div>
                              <h4 className="text-xs xl:text-sm font-extrabold uppercase tracking-wider text-[#841724]">
                                {cat.name} Collection
                              </h4>
                              <p className="text-[11px] text-[#7c5c62]">
                                {cat.tagline}
                              </p>
                            </div>
                          </div>

                          <span className="text-[11px] font-bold text-[#841724] bg-[#841724]/10 px-2.5 py-0.5 rounded-full">
                            {catProducts.length} Live Items
                          </span>
                        </div>

                        {/* Shopify Products Grid with Embedded Images */}
                        <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 py-3">
                          {catProducts.slice(0, 4).map((product) => (
                            <div
                              key={product.id}
                              onClick={() => {
                                setActiveDropdown(null);
                                onQuickView?.(product);
                              }}
                              className="group flex flex-col bg-[#faf4e8]/60 hover:bg-[#faf4e8] p-2 rounded-xl border border-[#841724]/10 transition-all hover:shadow-md cursor-pointer text-left"
                            >
                              {/* Embedded Shopify Image */}
                              <div className="w-full aspect-square rounded-lg overflow-hidden bg-white mb-2 relative">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                />
                                {product.badge && (
                                  <span className="absolute top-1 left-1 bg-[#841724] text-[#faedd3] text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                                    {product.badge}
                                  </span>
                                )}
                              </div>

                              {/* Title & Price */}
                              <h5 className="text-[11px] font-bold text-[#2d0a10] group-hover:text-[#841724] line-clamp-1">
                                {product.name}
                              </h5>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs font-black text-[#841724]">
                                  ₹{product.price.toLocaleString('en-IN')}
                                </span>
                                
                                {onAddToCart && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onAddToCart(product);
                                    }}
                                    className="p-1 text-[#841724] hover:bg-[#841724]/15 rounded-md transition-colors"
                                    title="Add to bag"
                                    aria-label="Add to bag"
                                  >
                                    <ShoppingBag className="w-3 h-3 stroke-[2.2]" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Dropdown Footer CTA */}
                        <div className="pt-2.5 border-t border-[#841724]/10 flex items-center justify-between">
                          <span className="text-[11px] text-[#7c5c62] italic">
                            Handcrafted with combed cotton yarn in Surat ♡
                          </span>

                          <button
                            onClick={() => handleCategorySelect(cat.name)}
                            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#841724] hover:text-[#5c0f19] hover:underline"
                          >
                            <span>Explore all {catProducts.length} {cat.name}</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick link to All 252 items */}
            <button
              onClick={() => handleCategorySelect('All Products')}
              className={`text-[13px] xl:text-[14px] font-medium py-1 px-3 rounded-full transition-colors cursor-pointer ${
                activeTab === 'All Products'
                  ? 'text-[#841724] font-bold bg-[#841724]/8'
                  : 'text-[#4a121d] hover:text-[#841724] hover:bg-[#841724]/5'
              }`}
            >
              All Items
            </button>
          </div>

        </div>
      </div>

      {/* 3. MOBILE MENU SLIDE-OVER DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-[#fffdfa] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              {/* Header */}
              <div className="p-4 flex items-center justify-between border-b border-[#841724]/10">
                <img
                  src={logoImg}
                  alt="knotsnco."
                  className="h-7 w-auto object-contain"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-[#841724] hover:bg-[#841724]/5 rounded-full cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Search */}
              <div className="p-4 border-b border-[#841724]/10">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSearchClick?.();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#841724]/5 border border-[#841724]/15 text-[#841724] text-xs font-medium cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search all handcrafted items...</span>
                </button>
              </div>

              {/* The 6 Categories Accordion */}
              <div className="p-4 space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#841724]/70 px-2 mb-1">
                  Shop by Category
                </div>

                {NAV_CATEGORIES.map((cat) => {
                  const isExpanded = expandedMobileCategory === cat.id;
                  const catProducts = categoryProductsMap[cat.id] || [];

                  return (
                    <div key={cat.id} className="rounded-xl border border-[#841724]/10 overflow-hidden">
                      <button
                        onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.id)}
                        className="w-full p-3 flex items-center justify-between text-left font-bold text-sm text-[#2d0a10] bg-[#faf4e8]/60 hover:bg-[#faf4e8]"
                      >
                        <span className="flex items-center gap-2">
                          <span>{cat.emoji}</span>
                          <span>{cat.name}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-[#841724] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-2 space-y-2 bg-[#fffdfa] border-t border-[#841724]/10">
                          {catProducts.slice(0, 3).map((product) => (
                            <div
                              key={product.id}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                onQuickView?.(product);
                              }}
                              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#841724]/5 cursor-pointer text-left"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 rounded-md object-cover shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h6 className="text-xs font-bold text-[#2d0a10] truncate">
                                  {product.name}
                                </h6>
                                <span className="text-[11px] font-black text-[#841724]">
                                  ₹{product.price.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          ))}

                          <button
                            onClick={() => handleCategorySelect(cat.name)}
                            className="w-full text-center text-xs font-bold text-[#841724] py-1.5 hover:underline"
                          >
                            View all {cat.name} ({catProducts.length}) →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={() => handleCategorySelect('All Products')}
                  className="w-full p-3 rounded-xl bg-[#841724] text-[#faedd3] font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-sm mt-3"
                >
                  <span>Explore All Items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Footer in Drawer */}
            <div className="p-4 border-t border-[#841724]/10 bg-[#faf4e8]/50 text-center">
              <p className="text-[11px] font-serif text-[#841724] italic">
                “Made slowly, lovingly & by hand.”
              </p>
              <p className="text-[10px] text-[#7c5c62] mt-1">
                Supporting women artisans across India ♡
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
