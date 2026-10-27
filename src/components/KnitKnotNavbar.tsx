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
  Sparkles,
  Star,
  Truck,
  Gift,
  Check,
  Ribbon,
  Flower2,
  Shapes,
  Sprout,
  KeyRound
} from 'lucide-react';
import { Product } from '../data/products';
import logoImg from '../assets/logo-knotsnco.png';

export interface NavCategoryConfig {
  id: string;
  name: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlights: string[];
  filter: (p: Product) => boolean;
}

export const NAV_CATEGORIES: NavCategoryConfig[] = [
  {
    id: 'bags',
    name: 'Bags',
    tagline: 'Handmade Daisy & Sunflower Carryalls',
    icon: ShoppingBag,
    badge: 'Trending Edit',
    highlights: ['Granny Square Totes', 'Resort Shoulder Bags', 'Mini Pastel Carryalls', 'Crochet Coin Purses'],
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
    icon: Ribbon,
    badge: 'Artisan Picks',
    highlights: ['Floral Hair Clips', 'Coquette Bow Clips', 'Embroidered Bandanas', 'Handmade Gajras'],
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
    icon: Flower2,
    badge: 'Top Bestseller',
    highlights: ['Everlasting Roses', 'White Lily Bouquets', 'Pastel Sunrise Tulips', 'Sunbeam Sunflowers'],
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
    icon: Shapes,
    badge: 'Studio Favorites',
    highlights: ['Character Standees', 'Handmade Vases', 'Cute Fridge Magnets', 'Desk Ornaments'],
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
    icon: Sprout,
    badge: 'Everlasting Gift',
    highlights: ['Desk Potted Plants', 'Illuminated Lilies', 'Mini Succulents', 'Forever Blossoms'],
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
    icon: KeyRound,
    badge: 'Pocket Pals',
    highlights: ['Pocket Fruit Turtles', 'Coquette Bow Charms', 'Amigurumi Keychains', 'Bag Companions'],
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

  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const handleDropdownAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setJustAddedId(product.id);
      setTimeout(() => {
        setJustAddedId(null);
      }, 1200);
    }
  };

  // Precise hover tracking:
  // 1. When hovering over a category tab: immediately clear timeout and open the dropdown
  const handleTabMouseEnter = (catId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(catId);
  };

  // 2. When hovering out from that category tab: close promptly if cursor does NOT enter floating window
  const handleTabMouseLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  // 3. When pointer enters or is on the floating window: cancel timeout so it does NOT disappear
  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  };

  // 4. When pointer leaves the floating window: close it promptly
  const handleDropdownMouseLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 80);
  };

  // 5. Auto-dismiss floating window on page scroll
  useEffect(() => {
    const handleScroll = () => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeDropdown]);

  const activeCatConfig = useMemo(() => {
    return NAV_CATEGORIES.find((c) => c.id === activeDropdown) || null;
  }, [activeDropdown]);

  const activeCatProducts = useMemo(() => {
    if (!activeCatConfig) return [];
    return categoryProductsMap[activeCatConfig.id] || [];
  }, [activeCatConfig, categoryProductsMap]);

  const handleCategorySelect = (catName: string) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    onTabChange(catName);
  };

  return (
    <header className="sticky top-0 z-50 w-full max-w-full select-none shadow-sm">
      {/* 1. TOP ANNOUNCEMENT BAR (Rich Burgundy #841724 with soft cream text) */}
      <div className="bg-[#841724] text-[#faedd3] py-2 px-3 sm:px-6 relative flex items-center justify-center border-b border-[#5c0f19] w-full">
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

      {/* 2. MAIN HEADER NAVBAR (Light Cream #faedd3 background, Burgundy text/logo) */}
      <div className="bg-[#faedd3] border-b border-[#841724]/15 transition-all duration-200">
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
          <div 
            className="hidden lg:flex items-center justify-center gap-2 xl:gap-5 pb-2.5 pt-0 border-t border-[#841724]/10 relative"
            onMouseLeave={handleTabMouseLeave}
          >
            {NAV_CATEGORIES.map((cat) => {
              const isOpen = activeDropdown === cat.id;
              const isSelected = activeTab.toLowerCase() === cat.name.toLowerCase();
              const CatIcon = cat.icon;

              return (
                <div
                  key={cat.id}
                  className="relative group"
                  onMouseEnter={() => handleTabMouseEnter(cat.id)}
                  onMouseLeave={handleTabMouseLeave}
                >
                  <button
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`flex items-center gap-1.5 py-1.5 px-3 xl:px-4 text-[13px] xl:text-[14px] font-semibold transition-all duration-200 cursor-pointer rounded-full ${
                      isOpen
                        ? 'text-[#841724] font-black bg-[#841724]/12 shadow-xs scale-105'
                        : isSelected
                        ? 'text-[#841724] font-extrabold bg-[#841724]/8'
                        : 'text-[#4a121d] hover:text-[#841724] hover:bg-[#841724]/6'
                    }`}
                  >
                    <CatIcon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 stroke-[2.2] transition-colors ${
                      isOpen || isSelected ? 'text-[#841724]' : 'text-[#841724]/75 group-hover:text-[#841724]'
                    }`} />
                    <span>{cat.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 stroke-[2.2] ${
                        isOpen ? 'rotate-180 text-[#841724]' : 'text-[#841724]/50'
                      }`}
                    />
                  </button>
                </div>
              );
            })}

            {/* Quick link to All 252 items */}
            <button
              onClick={() => handleCategorySelect('All Products')}
              className={`text-[13px] xl:text-[14px] font-semibold py-1.5 px-3.5 rounded-full transition-all cursor-pointer ${
                activeTab === 'All Products'
                  ? 'text-[#841724] font-black bg-[#841724]/12'
                  : 'text-[#4a121d] hover:text-[#841724] hover:bg-[#841724]/6'
              }`}
            >
              All Items
            </button>

            {/* EXPANSIVE LUXURY MEGA DROPDOWN (CENTERED & NEAT) */}
            {activeDropdown && activeCatConfig && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-[1140px] pt-1.5 pointer-events-auto before:absolute before:-top-3.5 before:left-0 before:right-0 before:h-3.5 before:content-[''] animate-in fade-in zoom-in-[0.99] slide-in-from-top-1 duration-150"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="bg-[#faedd3] rounded-3xl shadow-[0_25px_60px_-15px_rgba(132,23,36,0.22)] border border-[#841724]/20 p-5 xl:p-6 overflow-hidden backdrop-blur-md">
                  
                  {/* 1. TOP HEADER ROW */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-[#841724]/12">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#f8f0dc] border border-[#841724]/20 flex items-center justify-center text-[#841724] shadow-sm shrink-0">
                        <activeCatConfig.icon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base xl:text-lg font-black text-[#2b0b12] tracking-tight font-serif">
                            {activeCatConfig.name} Studio Collection
                          </h3>
                          {activeCatConfig.badge && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#841724] bg-[#841724]/10 border border-[#841724]/20 px-2.5 py-0.5 rounded-full">
                              {activeCatConfig.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#7c5c62] mt-0.5 font-medium">
                          {activeCatConfig.tagline} • Crafted with 100% combed cotton yarn
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#841724] bg-[#841724]/10 border border-[#841724]/15 px-3 py-1 rounded-full">
                        {activeCatProducts.length} Handcrafted Designs
                      </span>
                      <button
                        onClick={() => handleCategorySelect(activeCatConfig.name)}
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] px-4 py-1.5 rounded-full transition-all shadow-sm cursor-pointer active:scale-95"
                      >
                        <span>View All {activeCatConfig.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  {/* 2. MAIN CONTENT AREA: CURATED HIGHLIGHTS + PRODUCTS GRID */}
                  <div className="grid grid-cols-12 gap-5 py-4">
                    {/* Left Column: Quick Curated Filters & Studio Guarantee */}
                    <div className="col-span-3 flex flex-col justify-between pr-3 border-r border-[#841724]/12">
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#841724] block mb-2.5">
                          Popular in {activeCatConfig.name}
                        </span>
                        <div className="space-y-1.5">
                          {activeCatConfig.highlights.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleCategorySelect(activeCatConfig.name)}
                              className="w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#2b0b12] hover:text-[#841724] hover:bg-[#f8f0dc] transition-all group cursor-pointer"
                            >
                              <span className="truncate">{item}</span>
                              <ArrowRight className="w-3 h-3 text-[#841724]/40 group-hover:text-[#841724] group-hover:translate-x-0.5 transition-all" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Studio Guarantee Mini Card */}
                      <div className="bg-[#f8f0dc] rounded-2xl p-3 border border-[#841724]/15 mt-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#841724] mb-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Artisan Promise</span>
                        </div>
                        <p className="text-[11px] text-[#7c5c62] leading-relaxed">
                          100% combed cotton yarn, non-fading & crafted petal-by-petal in our Surat studio.
                        </p>
                      </div>
                    </div>

                    {/* Right Column: 4 Curated Products Showcase */}
                    <div className="col-span-9 grid grid-cols-4 gap-3.5">
                      {activeCatProducts.slice(0, 4).map((product) => {
                        const isJustAdded = justAddedId === product.id;
                        return (
                          <div
                            key={product.id}
                            onClick={() => {
                              setActiveDropdown(null);
                              onQuickView?.(product);
                            }}
                            className="group/card flex flex-col bg-[#f8f0dc] hover:bg-[#f3e5c9] p-2.5 rounded-2xl border border-[#841724]/12 hover:border-[#841724]/30 transition-all duration-300 hover:shadow-lg cursor-pointer text-left justify-between"
                          >
                            <div>
                              {/* Embedded Shopify Image Container with Hover Zoom & Badges */}
                              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#faedd3] mb-2.5 relative">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover/card:scale-108 transition-transform duration-500"
                                  loading="lazy"
                                />

                                {/* Badges on Image */}
                                <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                                  {product.badge && (
                                    <span className="bg-[#841724] text-[#faedd3] text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                                      {product.badge}
                                    </span>
                                  )}
                                </div>

                                {/* Star Rating Badge */}
                                <div className="absolute top-1.5 right-1.5 bg-[#faedd3]/90 backdrop-blur-xs text-[#2b0b12] text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                  <span>{product.rating || '4.9'}</span>
                                </div>

                                {/* Hover Quick View Overlay */}
                                <div className="absolute inset-0 bg-[#2b0b12]/30 backdrop-blur-[1px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                  <span className="bg-[#faedd3] text-[#841724] font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 transform scale-95 group-hover/card:scale-100 transition-transform">
                                    <Eye className="w-3 h-3" />
                                    <span>Quick View</span>
                                  </span>
                                </div>
                              </div>

                              {/* Title & Category */}
                              <div className="px-0.5">
                                <span className="text-[9px] font-black text-[#841724] uppercase tracking-wider block mb-0.5 truncate">
                                  {product.category}
                                </span>
                                <h4 className="text-xs font-bold text-[#2b0b12] group-hover/card:text-[#841724] transition-colors line-clamp-1 leading-snug">
                                  {product.name}
                                </h4>
                              </div>
                            </div>

                            {/* Price & Add to Bag Row */}
                            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#841724]/10 px-0.5">
                              <div className="flex items-baseline gap-1">
                                <span className="text-xs xl:text-sm font-black text-[#2b0b12]">
                                  ₹{product.price.toLocaleString('en-IN')}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-[10px] text-[#7c5c62]/70 line-through">
                                    ₹{product.originalPrice}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={(e) => handleDropdownAdd(e, product)}
                                className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                                  isJustAdded
                                    ? 'bg-emerald-700 text-white shadow-xs'
                                    : 'bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] active:scale-95 shadow-xs'
                                }`}
                                title="Add to shopping bag"
                                aria-label={`Add ${product.name} to bag`}
                              >
                                {isJustAdded ? (
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                ) : (
                                  <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. BOTTOM PERKS BAR */}
                  <div className="pt-3 border-t border-[#841724]/12 flex items-center justify-between text-xs text-[#7c5c62]">
                    <div className="flex items-center gap-4 text-[11px] font-medium">
                      <span className="flex items-center gap-1 text-[#2b0b12]">
                        <Truck className="w-3.5 h-3.5 text-[#841724]" />
                        <span>Free All-India Shipping ₹999+</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#2b0b12]">
                        <Gift className="w-3.5 h-3.5 text-[#841724]" />
                        <span>Complimentary Handwritten Note</span>
                      </span>
                      <span>•</span>
                      <span className="text-[#841724] font-semibold">
                        ✨ 100% Handcrafted Slowly & By Hand
                      </span>
                    </div>

                    <button
                      onClick={() => handleCategorySelect(activeCatConfig.name)}
                      className="inline-flex items-center gap-1 text-xs font-black text-[#841724] hover:text-[#5c0f19] hover:underline cursor-pointer"
                    >
                      <span>See all {activeCatProducts.length} items in {activeCatConfig.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                </div>
              </div>
            )}
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
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-[#faedd3] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
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
                        <span className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-[#841724]/10 flex items-center justify-center text-[#841724] shrink-0">
                            <cat.icon className="w-3.5 h-3.5 stroke-[2.2]" />
                          </span>
                          <span>{cat.name}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-[#841724] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-2 space-y-2 bg-[#f8f0dc] border-t border-[#841724]/10">
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
