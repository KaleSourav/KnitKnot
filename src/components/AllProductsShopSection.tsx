import React, { useState, useMemo, useEffect } from 'react';
import { ALL_PRODUCTS, ShopProduct } from '../data/allProductsData';
import { ProductCard } from './ProductCard';

interface AllProductsShopSectionProps {
  initialCategory?: string;
  onProductClick?: (productId: string) => void;
  onAddToCart?: (product: ShopProduct) => void;
  onNavigateHome?: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'all products' },
  { id: 'Flowers', label: 'flowers' },
  { id: 'Bouquets', label: 'bouquets' },
  { id: 'Plushies', label: 'plushies' },
  { id: 'Bags', label: 'bags' },
  { id: 'Keychains', label: 'keychains' },
  { id: 'Flower Pots', label: 'flower pots' },
  { id: 'Home Decor', label: 'home decor' },
  { id: 'Accessories', label: 'accessories' },
];

const OCCASIONS = [
  'Birthdays',
  'Anniversaries',
  'Thank You',
  'Just Because',
  'Festive Gifting',
];

const COLOR_SWATCHES = [
  { name: 'Maroon', hex: '#641623' },
  { name: 'Yellow', hex: '#F7BE44' },
  { name: 'Soft Yellow', hex: '#FFF2A3' },
  { name: 'Pastel Lilac', hex: '#E0BBE4' },
  { name: 'Sky Blue', hex: '#BAE6FD' },
  { name: 'White', hex: '#FFFFFF', hasBorder: true },
];

// Helper to normalize category strings for foolproof matching
const normalizeCategory = (cat?: string): string => {
  if (!cat) return '';
  const cleaned = cat.toLowerCase().replace(/[-_]/g, ' ').trim();
  if (cleaned === 'bouquet') return 'bouquets';
  if (cleaned === 'flower') return 'flowers';
  if (cleaned === 'keychain') return 'keychains';
  if (cleaned === 'bag') return 'bags';
  if (cleaned === 'plushie') return 'plushies';
  if (cleaned === 'flower pot' || cleaned === 'flower-pots') return 'flower pots';
  if (cleaned === 'home decor' || cleaned === 'homedecor') return 'home decor';
  return cleaned;
};

export const AllProductsShopSection: React.FC<AllProductsShopSectionProps> = ({
  initialCategory = 'all',
  onProductClick,
  onAddToCart,
  onNavigateHome,
}) => {
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    return initialCategory && initialCategory !== 'all' ? [initialCategory] : [];
  });
  const [activeCategoryPill, setActiveCategoryPill] = useState<string>(initialCategory || 'all');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Dynamic counts derived from real Shopify products with normalized categories
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of ALL_PRODUCTS) {
      const normCat = normalizeCategory(p.category);
      counts[normCat] = (counts[normCat] || 0) + 1;
      if (p.rawCategory) {
        const normRaw = normalizeCategory(p.rawCategory);
        if (normRaw !== normCat) {
          counts[normRaw] = (counts[normRaw] || 0) + 1;
        }
      }
    }
    return counts;
  }, []);

  const inStockCount = useMemo(() => ALL_PRODUCTS.filter((p) => p.inStock).length, []);
  const outOfStockCount = useMemo(() => ALL_PRODUCTS.filter((p) => !p.inStock).length, []);

  // Sync when initialCategory prop changes from outside (e.g. navbar click)
  useEffect(() => {
    if (initialCategory && initialCategory !== 'all') {
      setSelectedCategories([initialCategory]);
      setActiveCategoryPill(initialCategory);
    } else {
      setSelectedCategories([]);
      setActiveCategoryPill('all');
    }
  }, [initialCategory]);

  // Accordion Collapse States
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(true);
  const [isPriceOpen, setIsPriceOpen] = useState<boolean>(true);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState<boolean>(true);
  const [isColourOpen, setIsColourOpen] = useState<boolean>(true);
  const [isOccasionOpen, setIsOccasionOpen] = useState<boolean>(true);

  // Mobile Filter Drawer State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  // Wishlist state synchronized with localStorage
  const [wishlist, setWishlist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('knotsnco_wishlist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Listen for external wishlist changes (e.g. toggled on ProductDetailsPage)
  useEffect(() => {
    const handleWishlistSync = () => {
      try {
        const saved = localStorage.getItem('knotsnco_wishlist');
        if (saved) {
          setWishlist(JSON.parse(saved));
        }
      } catch {}
    };
    window.addEventListener('knotsnco_wishlist_updated', handleWishlistSync);
    return () => window.removeEventListener('knotsnco_wishlist_updated', handleWishlistSync);
  }, []);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('knotsnco_wishlist', JSON.stringify(next));
        window.dispatchEvent(new Event('knotsnco_wishlist_updated'));
      } catch {}
      return next;
    });
  };

  const handleCategoryPillClick = (catId: string) => {
    setActiveCategoryPill(catId);
    if (catId === 'all') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([catId]);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const isAlready = prev.some((c) => normalizeCategory(c) === normalizeCategory(cat));
      if (isAlready) {
        return prev.filter((c) => normalizeCategory(c) !== normalizeCategory(cat));
      }
      return [...prev, cat];
    });
  };

  const toggleAvailability = (status: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleOccasion = (occ: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setActiveCategoryPill('all');
    setMaxPrice(5000);
    setSelectedAvailability([]);
    setSelectedColors([]);
    setSelectedOccasions([]);
    setSortBy('featured');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    // Category filter with normalized comparison
    if (selectedCategories.length > 0) {
      const normalizedTargets = selectedCategories.map(normalizeCategory);
      result = result.filter((p) => {
        const prodCat = normalizeCategory(p.category);
        const prodRaw = p.rawCategory ? normalizeCategory(p.rawCategory) : '';
        return normalizedTargets.includes(prodCat) || (prodRaw && normalizedTargets.includes(prodRaw));
      });
    }

    // Price filter
    result = result.filter((p) => p.price <= maxPrice);

    // Availability filter
    if (selectedAvailability.length > 0) {
      const wantInStock = selectedAvailability.includes('in-stock');
      const wantOutOfStock = selectedAvailability.includes('out-of-stock');
      if (wantInStock && !wantOutOfStock) {
        result = result.filter((p) => p.inStock);
      } else if (!wantInStock && wantOutOfStock) {
        result = result.filter((p) => !p.inStock);
      }
    }

    // Color filter (matches primary color OR swatch hex)
    if (selectedColors.length > 0) {
      const activeHexes = COLOR_SWATCHES.filter((s) => selectedColors.includes(s.name)).map((s) =>
        s.hex.toLowerCase()
      );
      result = result.filter((p) => {
        if (selectedColors.includes(p.color)) return true;
        if (p.colorSwatches && p.colorSwatches.some((hex) => activeHexes.includes(hex.toLowerCase()))) {
          return true;
        }
        return false;
      });
    }

    // Occasion filter
    if (selectedOccasions.length > 0) {
      result = result.filter((p) =>
        p.occasions && p.occasions.some((occ) => selectedOccasions.includes(occ))
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0));
    } else if (sortBy === 'best-selling') {
      result.sort((a, b) => {
        const scoreA = (a.discount ? 2 : 0) + (a.badge ? 1 : 0) + (a.originalPrice ? 1 : 0);
        const scoreB = (b.discount ? 2 : 0) + (b.badge ? 1 : 0) + (b.originalPrice ? 1 : 0);
        return scoreB - scoreA;
      });
    }

    return result;
  }, [
    selectedCategories,
    maxPrice,
    selectedAvailability,
    selectedColors,
    selectedOccasions,
    sortBy,
  ]);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    maxPrice < 5000 ||
    selectedAvailability.length > 0 ||
    selectedColors.length > 0 ||
    selectedOccasions.length > 0;

  return (
    <section id="all-products-shop" className="relative w-full bg-[#FAF4ED]/85 text-[#2D2424] font-['Fredoka'] pt-6 pb-12 sm:pb-16">
      {/* =========================================================================
          1. BREADCRUMB NAVIGATION ("home / shop all products")
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#641623]/70 font-medium flex-wrap">
          <button
            onClick={onNavigateHome}
            type="button"
            className="hover:text-[#641623] hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span>home</span>
          </button>
          <span className="text-[#641623]/40">/</span>
          <button
            onClick={clearAllFilters}
            type="button"
            className={`cursor-pointer transition-colors ${
              selectedCategories.length === 0
                ? "text-[#641623] font-bold"
                : "hover:text-[#641623] hover:underline"
            }`}
          >
            shop all products
          </button>
          {selectedCategories.length === 1 && (
            <>
              <span className="text-[#641623]/40">/</span>
              <span className="text-[#641623] font-bold lowercase">
                {selectedCategories[0]}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* =========================================================================
          2. SECTION TITLE: Dashed Ribbon Line + Cute Flowers + "all products"
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 text-center">
        {/* Top Dashed Stitch Line with Ribbon Bow */}
        <div className="relative flex items-center justify-center mb-6 sm:mb-8">
          <div className="flex-1 border-t-2 border-dashed border-[#641623]/30" />
          {/* Centered Ribbon Bow SVG */}
          <div className="px-4 flex items-center justify-center text-[#641623]">
            <svg
              className="w-10 h-7 sm:w-12 sm:h-8"
              viewBox="0 0 64 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Left Bow Loop */}
              <path d="M30 18 C20 6, 8 10, 10 20 C12 28, 26 24, 30 20" />
              {/* Right Bow Loop */}
              <path d="M34 18 C44 6, 56 10, 54 20 C52 28, 38 24, 34 20" />
              {/* Center Knot */}
              <ellipse cx="32" cy="19" rx="3.5" ry="3.5" fill="currentColor" />
              {/* Left Ribbon Tail */}
              <path d="M29 22 C25 28, 20 34, 18 36" />
              {/* Right Ribbon Tail */}
              <path d="M35 22 C39 28, 44 34, 46 36" />
            </svg>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-[#641623]/30" />
        </div>

        {/* Heading Row with Smiling Flowers on Sides & Sparks */}
        <div className="relative inline-flex items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
          {/* Left Smiling Flower Doodle (Desktop only) */}
          <div className="hidden sm:flex items-center justify-center text-[#F7BE44]">
            <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="9" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
              <circle cx="38" cy="20" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
              <circle cx="33" cy="35" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
              <circle cx="15" cy="35" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
              <circle cx="10" cy="20" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
              <circle cx="24" cy="24" r="8" fill="#F7BE44" stroke="#641623" strokeWidth="2.2" />
              <circle cx="21" cy="23" r="1.2" fill="#641623" />
              <circle cx="27" cy="23" r="1.2" fill="#641623" />
              <path d="M22 26 Q24 28 26 26" stroke="#641623" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          {/* Heading with Radiating Rays */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-4">
            {/* Left Rays */}
            <div className="hidden sm:flex flex-col gap-1 text-[#641623]">
              <span className="w-3 h-0.5 bg-[#641623] rotate-[-25deg] rounded-full" />
              <span className="w-4 h-0.5 bg-[#641623] rounded-full" />
              <span className="w-3 h-0.5 bg-[#641623] rotate-[25deg] rounded-full" />
            </div>

            {/* Desktop / Mobile Title */}
            <div className="w-full sm:w-auto text-left sm:text-center flex sm:block items-center justify-between">
              <div>
                <h2 className="hidden sm:block text-3xl sm:text-4xl md:text-5xl font-bold text-[#641623] tracking-tight lowercase">
                  all products
                </h2>
                <h2 className="sm:hidden text-2xl font-bold text-[#641623] tracking-tight">
                  Shop all products
                </h2>
                <p className="sm:hidden text-xs text-[#2D2424]/70 font-normal mt-0.5">
                  Explore all the little things, handmade with love.
                </p>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                type="button"
                className="sm:hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#641623] bg-white text-[#641623] text-xs font-semibold shadow-xs active:scale-95 transition-all ml-2 flex-shrink-0 cursor-pointer"
              >
                <span>Filter</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                  <circle cx="8" cy="7" r="2.5" fill="white" stroke="#641623" strokeWidth="2" />
                  <circle cx="16" cy="17" r="2.5" fill="white" stroke="#641623" strokeWidth="2" />
                </svg>
              </button>
            </div>

            {/* Right Rays */}
            <div className="hidden sm:flex flex-col gap-1 text-[#641623]">
              <span className="w-3 h-0.5 bg-[#641623] rotate-[25deg] rounded-full" />
              <span className="w-4 h-0.5 bg-[#641623] rounded-full" />
              <span className="w-3 h-0.5 bg-[#641623] rotate-[-25deg] rounded-full" />
            </div>
          </div>

          {/* Right Smiling Flower Doodle (Desktop only) */}
          <div className="hidden sm:flex items-center justify-center text-[#F7BE44]">
            <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="9" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
              <circle cx="38" cy="20" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
              <circle cx="33" cy="35" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
              <circle cx="15" cy="35" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
              <circle cx="10" cy="20" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
              <circle cx="24" cy="24" r="8" fill="#F7BE44" stroke="#641623" strokeWidth="2.2" />
              <circle cx="21" cy="23" r="1.2" fill="#641623" />
              <circle cx="27" cy="23" r="1.2" fill="#641623" />
              <path d="M22 26 Q24 28 26 26" stroke="#641623" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Desktop Subtitle */}
        <p className="hidden sm:block text-base sm:text-lg text-[#2D2424]/75 font-normal mt-2 lowercase">
          explore our complete collection of handmade crochet goodies.
        </p>

        {/* Mobile Scalloped Wave Divider under Title */}
        <div className="sm:hidden mt-3 mb-1">
          <svg viewBox="0 0 340 12" fill="none" className="w-full h-2.5 text-[#F7BE44]/70">
            <path
              d="M 0,6 Q 15,1 30,6 Q 45,11 60,6 Q 75,1 90,6 Q 105,11 120,6 Q 135,1 150,6 Q 165,11 180,6 Q 195,1 210,6 Q 225,11 240,6 Q 255,1 270,6 Q 285,11 300,6 Q 315,1 330,6 Q 345,11 360,6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* =========================================================================
          3. MAIN LAYOUT: Left Filters Sidebar (Desktop) + Right Products Grid
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* =====================================================================
              A. LEFT FILTERS SIDEBAR (DESKTOP VIEW)
             ===================================================================== */}
          <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0">
            {/* Sidebar Title: "filters" with Slider Icon */}
            <div className="flex items-center justify-between mb-3 text-[#641623]">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold lowercase tracking-tight">filters</span>
                <svg className="w-4 h-4 text-[#641623]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                  <circle cx="8" cy="6" r="2.5" fill="white" stroke="#641623" strokeWidth="2" />
                  <circle cx="16" cy="18" r="2.5" fill="white" stroke="#641623" strokeWidth="2" />
                </svg>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  type="button"
                  className="text-xs text-[#641623]/70 hover:text-[#641623] underline cursor-pointer"
                >
                  clear all
                </button>
              )}
            </div>

            {/* Filter Accordion Box */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#641623]/15 p-4 sm:p-5 shadow-xs space-y-5 text-left">
              {/* 1. Category Filter */}
              <div className="border-b border-[#641623]/10 pb-4">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  type="button"
                  className="w-full flex items-center justify-between text-base font-bold text-[#641623] lowercase cursor-pointer"
                >
                  <span>category</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isCategoryOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isCategoryOpen && (
                  <div className="mt-3 space-y-2 text-sm text-[#2D2424]/80">
                    {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                      const isChecked = selectedCategories.some(
                        (sc) => normalizeCategory(sc) === normalizeCategory(cat.id)
                      );
                      const count = categoryCounts[normalizeCategory(cat.id)] || 0;

                      return (
                        <label
                          key={cat.id}
                          className="flex items-center gap-2.5 cursor-pointer hover:text-[#641623] transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategory(cat.id)}
                            className="w-4 h-4 rounded text-[#641623] border-[#641623]/30 focus:ring-[#641623] cursor-pointer"
                          />
                          <span>{cat.label}</span>
                          <span className="text-[#2D2424]/40 text-xs">({count})</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Price Filter */}
              <div className="border-b border-[#641623]/10 pb-4">
                <button
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                  type="button"
                  className="w-full flex items-center justify-between text-base font-bold text-[#641623] lowercase cursor-pointer"
                >
                  <span>price</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isPriceOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isPriceOpen && (
                  <div className="mt-3">
                    <input
                      type="range"
                      min={50}
                      max={5000}
                      step={50}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#641623] cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-xs text-[#641623] font-semibold mt-1">
                      <span>₹50</span>
                      <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Availability Filter */}
              <div className="border-b border-[#641623]/10 pb-4">
                <button
                  onClick={() => setIsAvailabilityOpen(!isAvailabilityOpen)}
                  type="button"
                  className="w-full flex items-center justify-between text-base font-bold text-[#641623] lowercase cursor-pointer"
                >
                  <span>availability</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isAvailabilityOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isAvailabilityOpen && (
                  <div className="mt-3 space-y-2 text-sm text-[#2D2424]/80">
                    <label className="flex items-center gap-2.5 cursor-pointer hover:text-[#641623]">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes('in-stock')}
                        onChange={() => toggleAvailability('in-stock')}
                        className="w-4 h-4 rounded text-[#641623] border-[#641623]/30 focus:ring-[#641623] cursor-pointer"
                      />
                      <span>In stock</span>
                      <span className="text-[#2D2424]/40 text-xs">({inStockCount})</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer hover:text-[#641623]">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes('out-of-stock')}
                        onChange={() => toggleAvailability('out-of-stock')}
                        className="w-4 h-4 rounded text-[#641623] border-[#641623]/30 focus:ring-[#641623] cursor-pointer"
                      />
                      <span>Out of stock</span>
                      <span className="text-[#2D2424]/40 text-xs">({outOfStockCount})</span>
                    </label>
                  </div>
                )}
              </div>

              {/* 4. Colour Filter */}
              <div className="border-b border-[#641623]/10 pb-4">
                <button
                  onClick={() => setIsColourOpen(!isColourOpen)}
                  type="button"
                  className="w-full flex items-center justify-between text-base font-bold text-[#641623] lowercase cursor-pointer"
                >
                  <span>colour</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isColourOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isColourOpen && (
                  <div className="mt-3 flex items-center gap-2.5 flex-wrap">
                    {COLOR_SWATCHES.map((swatch) => {
                      const isSelected = selectedColors.includes(swatch.name);
                      return (
                        <button
                          key={swatch.name}
                          onClick={() => toggleColor(swatch.name)}
                          type="button"
                          aria-label={`Filter by ${swatch.name}`}
                          className={`w-6 h-6 rounded-full transition-transform duration-150 hover:scale-110 relative cursor-pointer ${
                            swatch.hasBorder ? 'border border-[#641623]/25' : ''
                          } ${isSelected ? 'ring-2 ring-[#641623] ring-offset-1 scale-110' : ''}`}
                          style={{ backgroundColor: swatch.hex }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 5. Occasion Filter */}
              <div>
                <button
                  onClick={() => setIsOccasionOpen(!isOccasionOpen)}
                  type="button"
                  className="w-full flex items-center justify-between text-base font-bold text-[#641623] lowercase cursor-pointer"
                >
                  <span>occasion</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOccasionOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isOccasionOpen && (
                  <div className="mt-3 space-y-2 text-sm text-[#2D2424]/80">
                    {OCCASIONS.map((occ) => (
                      <label
                        key={occ}
                        className="flex items-center gap-2.5 cursor-pointer hover:text-[#641623]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedOccasions.includes(occ)}
                          onChange={() => toggleOccasion(occ)}
                          className="w-4 h-4 rounded text-[#641623] border-[#641623]/30 focus:ring-[#641623] cursor-pointer"
                        />
                        <span>{occ}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* =====================================================================
              B. RIGHT PRODUCTS GRID (DESKTOP & MOBILE VIEWS)
             ===================================================================== */}
          <main className="flex-1 w-full">
            {/* Top Bar: Count & Sort Pill */}
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              {/* Product Count (Desktop & Mobile) */}
              <p className="text-base sm:text-lg font-bold text-[#641623]">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>

              {/* Sort By Dropdown Pill */}
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-[#2D2424]/70">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-full border border-[#641623]/25 bg-white px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#641623] focus:outline-none focus:ring-1 focus:ring-[#641623] cursor-pointer shadow-2xs"
                >
                  <option value="featured">Featured</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Empty State when 0 products match */}
            {filteredProducts.length === 0 ? (
              <div className="w-full py-16 px-4 text-center rounded-[24px] bg-white/70 border border-[#641623]/10 flex flex-col items-center justify-center">
                <div className="text-[#F7BE44] mb-4">
                  <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="9" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
                    <circle cx="38" cy="20" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
                    <circle cx="33" cy="35" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
                    <circle cx="15" cy="35" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
                    <circle cx="10" cy="20" r="7" fill="#FFE485" stroke="#641623" strokeWidth="2.2" />
                    <circle cx="24" cy="24" r="8" fill="#F7BE44" stroke="#641623" strokeWidth="2.2" />
                    <circle cx="21" cy="23" r="1.2" fill="#641623" />
                    <circle cx="27" cy="23" r="1.2" fill="#641623" />
                    <path d="M22 27 Q24 25 26 27" stroke="#641623" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="font-['Fredoka'] font-bold text-xl sm:text-2xl text-[#641623]">
                  No crochet goodies found
                </h3>
                <p className="text-sm text-[#2D2424]/70 max-w-md mt-2">
                  We couldn't find any items matching your selected filters. Try broadening your price range or resetting filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  type="button"
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#641623] hover:bg-[#52121c] text-white font-['Fredoka'] font-bold text-sm transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              /* Product Cards Grid: 3 cols on Desktop, 2 cols on Mobile */
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6">
                {filteredProducts.map((product) => {
                  const isLiked = wishlist[product.id] ?? false;

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isLiked={isLiked}
                      onProductClick={onProductClick}
                      onAddToCart={onAddToCart}
                      onToggleWishlist={toggleWishlist}
                    />
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* =========================================================================
          4. MOBILE FILTER BOTTOM DRAWER (Triggered by "Filter ⊶" on Mobile)
         ========================================================================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Bottom Sheet Drawer */}
          <div className="relative w-full sm:max-w-md bg-[#FAF4ED] rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-y-auto z-10 shadow-2xl text-left border border-[#641623]/20">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#641623]/15">
              <span className="text-xl font-bold text-[#641623] lowercase">filters</span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                type="button"
                aria-label="Close filters"
                className="w-8 h-8 rounded-full bg-white/80 border border-[#641623]/20 flex items-center justify-center text-[#641623] cursor-pointer hover:bg-white"
              >
                ✕
              </button>
            </div>

            {/* Filter Content */}
            <div className="py-4 space-y-4">
              {/* Category */}
              <div>
                <p className="text-sm font-bold text-[#641623] lowercase mb-2">category</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                    const isChecked = selectedCategories.some(
                      (sc) => normalizeCategory(sc) === normalizeCategory(cat.id)
                    );
                    const count = categoryCounts[normalizeCategory(cat.id)] || 0;

                    return (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#641623]/15 cursor-pointer hover:bg-white/80"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat.id)}
                          className="rounded text-[#641623] cursor-pointer"
                        />
                        <span className="truncate">{cat.label}</span>
                        <span className="text-[#2D2424]/40 text-[10px]">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-sm font-bold text-[#641623] lowercase mb-1">
                  max price: ₹{maxPrice.toLocaleString('en-IN')}
                </p>
                <input
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#641623] cursor-pointer"
                />
              </div>

              {/* Availability */}
              <div>
                <p className="text-sm font-bold text-[#641623] lowercase mb-2">availability</p>
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#641623]/15 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAvailability.includes('in-stock')}
                      onChange={() => toggleAvailability('in-stock')}
                      className="rounded text-[#641623] cursor-pointer"
                    />
                    <span>In stock ({inStockCount})</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#641623]/15 flex-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAvailability.includes('out-of-stock')}
                      onChange={() => toggleAvailability('out-of-stock')}
                      className="rounded text-[#641623] cursor-pointer"
                    />
                    <span>Out of stock ({outOfStockCount})</span>
                  </label>
                </div>
              </div>

              {/* Colour */}
              <div>
                <p className="text-sm font-bold text-[#641623] lowercase mb-2">colour</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {COLOR_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.name}
                      onClick={() => toggleColor(swatch.name)}
                      type="button"
                      aria-label={`Filter by ${swatch.name}`}
                      className={`w-7 h-7 rounded-full border cursor-pointer ${
                        selectedColors.includes(swatch.name) ? 'ring-2 ring-[#641623] ring-offset-1 scale-105' : ''
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div>
                <p className="text-sm font-bold text-[#641623] lowercase mb-2">occasion</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {OCCASIONS.map((occ) => (
                    <label
                      key={occ}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#641623]/15 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedOccasions.includes(occ)}
                        onChange={() => toggleOccasion(occ)}
                        className="rounded text-[#641623] cursor-pointer"
                      />
                      <span>{occ}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#641623]/15 flex items-center gap-3">
              <button
                onClick={clearAllFilters}
                type="button"
                className="flex-1 py-2.5 rounded-full border border-[#641623] text-[#641623] font-semibold text-xs cursor-pointer hover:bg-[#641623]/5"
              >
                Clear all
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                type="button"
                className="flex-2 py-2.5 rounded-full bg-[#641623] text-white font-semibold text-xs shadow-md cursor-pointer hover:bg-[#52121c]"
              >
                Apply ({filteredProducts.length} items)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. BOTTOM RIBBON BOW DIVIDER (matching Reference)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="relative flex items-center justify-center">
          <div className="flex-1 border-t-2 border-dashed border-[#641623]/30" />
          <div className="px-4 flex items-center justify-center text-[#641623]">
            <svg
              className="w-10 h-7 sm:w-12 sm:h-8"
              viewBox="0 0 64 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M30 18 C20 6, 8 10, 10 20 C12 28, 26 24, 30 20" />
              <path d="M34 18 C44 6, 56 10, 54 20 C52 28, 38 24, 34 20" />
              <ellipse cx="32" cy="19" rx="3.5" ry="3.5" fill="currentColor" />
              <path d="M29 22 C25 28, 20 34, 18 36" />
              <path d="M35 22 C39 28, 44 34, 46 36" />
            </svg>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-[#641623]/30" />
        </div>
      </div>
    </section>
  );
};
