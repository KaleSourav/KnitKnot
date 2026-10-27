import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  ArrowRight
} from 'lucide-react';
import logoImg from '../assets/logo-knotsnco.png';

export interface NavCategoryGroup {
  id: string;
  name: string;
  subcategories: {
    name: string;
    label: string;
    count: number;
    emoji: string;
    description: string;
  }[];
}

export const NAV_CATEGORY_GROUPS: NavCategoryGroup[] = [
  {
    id: 'floral',
    name: 'Floral',
    subcategories: [
      { name: 'Flowers', label: 'Everlasting Flowers', count: 61, emoji: '🌸', description: 'Single roses, lilies, tulips & sunflowers' },
      { name: 'Fillers', label: 'Bouquet Fillers & Foliage', count: 22, emoji: '🌿', description: 'Eucalyptus, sage & baby’s breath stems' },
      { name: 'Flower Pots', label: 'Desk Flower Pots', count: 21, emoji: '🪴', description: 'Potted lilies, double tulips & heart pots' },
      { name: 'Vases', label: 'Arrangement Vases', count: 19, emoji: '🏺', description: 'Pastel tabletop flower gardens & bouquets' },
    ],
  },
  {
    id: 'baby-products',
    name: 'Baby Products',
    subcategories: [
      { name: 'Characters', label: 'Amigurumi Plushies', count: 9, emoji: '🧸', description: 'Soft chenille bunnies, chicks & Hello Kitty' },
      { name: 'Keychains', label: 'Pocket Animal Pals', count: 40, emoji: '🔑', description: 'Fruit turtles, tiny bunnies & mini octopus' },
      { name: 'Bag Charms', label: 'Floral Charms & Tassels', count: 6, emoji: '🏷️', description: 'Puffy flower bag charms & evil eye protection' },
    ],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subcategories: [
      { name: 'Hair Accessories', label: 'Clips, Gajras & Scrunchies', count: 15, emoji: '🎀', description: 'Cherry blossom hair clips & crochet mogra gajras' },
      { name: 'Bags', label: 'Granny Square Totes', count: 19, emoji: '👜', description: 'Artisan floral totes & puffy shoulder bags' },
      { name: 'Earrings', label: 'Handmade Studs & Drops', count: 10, emoji: '💎', description: 'Ultra-lightweight fruit & floral drop earrings' },
      { name: 'Fridge Magnets', label: 'Miniature Potted Magnets', count: 12, emoji: '🧲', description: 'Sunflowers & potted plant desk magnets' },
      { name: 'Bandanas', label: 'Boho Crochet Headscarves', count: 3, emoji: '🧣', description: 'Open-stitch floral & beachy bandanas' },
    ],
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
  cartCount = 0,
  wishlistCount = 0,
  onSearchClick,
  onUserClick,
  onCartClick,
  onWishlistClick,
  onShopNowClick,
}) => {
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>('floral');
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto rotate announcement every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const handlePrevAnnouncement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnnouncementIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNextAnnouncement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const handleMouseEnter = (groupId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(groupId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleCategorySelect = (catName: string) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    onTabChange(catName);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full select-none shadow-sm">
      {/* 1. TOP ANNOUNCEMENT BAR (Rich Burgundy #841724 with soft cream text) */}
      <div className="bg-[#841724] text-[#faedd3] py-2 px-3 sm:px-6 relative flex items-center justify-center border-b border-[#5c0f19]">
        <button
          onClick={handlePrevAnnouncement}
          className="absolute left-2 sm:left-4 p-1 hover:text-white transition-colors cursor-pointer text-[#faedd3]/80 hover:bg-black/10 rounded-full"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
        </button>

        <div className="overflow-hidden h-4 sm:h-5 flex items-center justify-center">
          <span 
            key={announcementIndex}
            className="text-[11px] sm:text-xs font-serif tracking-widest text-center uppercase animate-in fade-in duration-300"
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
          <div className="h-16 sm:h-18 lg:h-20 flex items-center justify-between relative">
            
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
                  className="h-8 sm:h-9 md:h-10 lg:h-11 w-auto max-w-[170px] sm:max-w-[210px] md:max-w-[240px] object-contain drop-shadow-sm"
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

          {/* BOTTOM ROW: Center Categories with Dropdowns (Desktop View) */}
          <div className="hidden lg:flex items-center justify-center gap-8 pb-3 pt-0 border-t border-[#841724]/10 relative">
            {NAV_CATEGORY_GROUPS.map((group) => {
              const isOpen = activeDropdown === group.id;
              return (
                <div
                  key={group.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(group.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => handleMouseEnter(group.id)}
                    className={`flex items-center gap-1 py-1 px-3 text-[14px] font-medium transition-colors cursor-pointer rounded-full ${
                      isOpen
                        ? 'text-[#841724] font-bold bg-[#841724]/8'
                        : 'text-[#4a121d] hover:text-[#841724] hover:bg-[#841724]/5'
                    }`}
                  >
                    <span>{group.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#841724]' : 'text-[#841724]/60'
                      }`}
                    />
                  </button>

                  {/* LUXURY DROPDOWN MENU */}
                  {isOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-80 sm:w-96 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseEnter={() => handleMouseEnter(group.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="bg-[#fffdfa] rounded-2xl shadow-xl border border-[#841724]/15 p-4 divide-y divide-[#841724]/10 overflow-hidden">
                        <div className="pb-2.5 px-1 flex items-center justify-between">
                          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#841724]/80">
                            {group.name} Collection
                          </span>
                          <span className="text-[10px] font-medium text-[#7c5c62]">
                            Handcrafted by artisans
                          </span>
                        </div>

                        <div className="pt-2 space-y-1">
                          {group.subcategories.map((sub) => {
                            const isCurrent = activeTab.toLowerCase() === sub.name.toLowerCase();
                            return (
                              <button
                                key={sub.name}
                                onClick={() => handleCategorySelect(sub.name)}
                                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 cursor-pointer group ${
                                  isCurrent
                                    ? 'bg-[#841724]/10 text-[#841724]'
                                    : 'hover:bg-[#841724]/5 text-[#361117]'
                                }`}
                              >
                                <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                                  {sub.emoji}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#2d0a10] group-hover:text-[#841724] truncate">
                                      {sub.label}
                                    </span>
                                    <span className="text-[10px] font-semibold text-[#841724] bg-[#841724]/10 px-2 py-0.5 rounded-full shrink-0 ml-2">
                                      {sub.count}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#7c5c62] line-clamp-1 mt-0.5">
                                    {sub.description}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="pt-2 px-1 text-center">
                          <button
                            onClick={() => handleCategorySelect('All Products')}
                            className="text-[11px] font-bold text-[#841724] hover:underline inline-flex items-center gap-1 py-1"
                          >
                            <span>Browse All 252 Items</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Direct Quick Link: All Products */}
            <button
              onClick={() => handleCategorySelect('All Products')}
              className={`text-[14px] font-medium py-1 px-3 rounded-full transition-colors cursor-pointer ${
                activeTab === 'All Products'
                  ? 'text-[#841724] font-bold bg-[#841724]/8'
                  : 'text-[#4a121d] hover:text-[#841724] hover:bg-[#841724]/5'
              }`}
            >
              All 252 Items
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
                  <span>Search all 252 handcrafted items...</span>
                </button>
              </div>

              {/* Categories Accordion */}
              <div className="p-4 space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#841724]/70 px-2 mb-1">
                  Shop by Category
                </div>

                {NAV_CATEGORY_GROUPS.map((group) => {
                  const isExpanded = expandedMobileGroup === group.id;
                  return (
                    <div key={group.id} className="rounded-xl border border-[#841724]/10 overflow-hidden">
                      <button
                        onClick={() => setExpandedMobileGroup(isExpanded ? null : group.id)}
                        className="w-full p-3 flex items-center justify-between text-left font-bold text-sm text-[#2d0a10] bg-[#faf4e8]/60 hover:bg-[#faf4e8]"
                      >
                        <span>{group.name}</span>
                        <ChevronDown className={`w-4 h-4 text-[#841724] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-2 space-y-1 bg-[#fffdfa] border-t border-[#841724]/10">
                          {group.subcategories.map((sub) => (
                            <button
                              key={sub.name}
                              onClick={() => handleCategorySelect(sub.name)}
                              className="w-full text-left p-2 rounded-lg text-xs flex items-center justify-between hover:bg-[#841724]/5 text-[#361117]"
                            >
                              <span className="flex items-center gap-2">
                                <span>{sub.emoji}</span>
                                <span className="font-medium">{sub.label}</span>
                              </span>
                              <span className="text-[10px] text-[#841724] font-bold bg-[#841724]/10 px-2 py-0.5 rounded-full">
                                {sub.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={() => handleCategorySelect('All Products')}
                  className="w-full p-3 rounded-xl bg-[#841724] text-[#faedd3] font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-sm mt-3"
                >
                  <span>Explore All 252 Items</span>
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
