import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ALL_PRODUCTS, ShopProduct } from '../data/allProductsData';

interface ProductDetailsPageProps {
  productId?: string | null;
  productHandle?: string | null;
  onNavigateHome?: () => void;
  onNavigateShop?: (category?: string) => void;
  onNavigateProduct?: (productId: string) => void;
  onAddToCart?: (product: ShopProduct, quantity: number) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  productId,
  productHandle,
  onNavigateHome,
  onNavigateShop,
  onNavigateProduct,
  onAddToCart,
}) => {
  // Find product from Shopify data with robust matching (ID, shopifyId, handle, title)
  const product: ShopProduct = useMemo(() => {
    const rawTarget = productId ? decodeURIComponent(productId).trim() : '';
    const rawHandle = productHandle ? decodeURIComponent(productHandle).trim() : '';

    if (rawTarget) {
      const found = ALL_PRODUCTS.find((p) => {
        if (p.id === rawTarget || p.shopifyId === rawTarget) return true;
        if (p.handle && (p.handle === rawTarget || p.handle.toLowerCase() === rawTarget.toLowerCase())) return true;
        // Handle suffix matching (e.g. 'bouquet-full-of-sunshine' matching 'flowers-bouquet-full-of-sunshine')
        if (p.handle && (p.handle.endsWith(rawTarget) || rawTarget.endsWith(p.handle))) return true;
        if (p.name.toLowerCase() === rawTarget.toLowerCase()) return true;
        return false;
      });
      if (found) return found;
    }

    if (rawHandle) {
      const found = ALL_PRODUCTS.find((p) => {
        if (p.handle && (p.handle === rawHandle || p.handle.toLowerCase() === rawHandle.toLowerCase())) return true;
        if (p.handle && (p.handle.endsWith(rawHandle) || rawHandle.endsWith(p.handle))) return true;
        return false;
      });
      if (found) return found;
    }

    // Default fallback: Hero bouquet "Bouquet Full Of Sunshine" (or first bouquet with images)
    const sunshine = ALL_PRODUCTS.find((p) => p.handle === 'flowers-bouquet-full-of-sunshine');
    if (sunshine) return sunshine;

    const featured =
      ALL_PRODUCTS.find(
        (p) =>
          p.category === 'Bouquets' &&
          p.images &&
          p.images.length > 0 &&
          p.originalPrice
      ) || ALL_PRODUCTS[0];
    return featured;
  }, [productId, productHandle]);

  // Gallery Images from Shopify CDN only
  const images = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images.filter((img) => typeof img === 'string' && img.trim().length > 0);
    }
    if (product.image && product.image.trim().length > 0) {
      return [product.image];
    }
    return [];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Safe image index guard in case image count shrinks
  const safeImageIndex = activeImageIndex < images.length ? activeImageIndex : 0;

  // Wishlist state synchronized with localStorage across shop & product pages
  const [isWishlist, setIsWishlist] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('knotsnco_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        return !!parsed[product.id];
      }
    } catch {}
    return false;
  });

  const [wishlistMap, setWishlistMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('knotsnco_wishlist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Keep wishlist in sync with localStorage and product changes
  useEffect(() => {
    const syncWishlist = () => {
      try {
        const saved = localStorage.getItem('knotsnco_wishlist');
        if (saved) {
          const parsed = JSON.parse(saved);
          setIsWishlist(!!parsed[product.id]);
          setWishlistMap(parsed);
        }
      } catch {}
    };

    syncWishlist();
    window.addEventListener('knotsnco_wishlist_updated', syncWishlist);
    return () => window.removeEventListener('knotsnco_wishlist_updated', syncWishlist);
  }, [product.id]);

  const toggleWishlist = () => {
    setIsWishlist((prev) => {
      const next = !prev;
      try {
        const saved = localStorage.getItem('knotsnco_wishlist');
        const parsed = saved ? JSON.parse(saved) : {};
        parsed[product.id] = next;
        localStorage.setItem('knotsnco_wishlist', JSON.stringify(parsed));
        setWishlistMap({ ...parsed });
        window.dispatchEvent(new Event('knotsnco_wishlist_updated'));
      } catch {}
      return next;
    });
  };

  const toggleCardWishlist = (targetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const saved = localStorage.getItem('knotsnco_wishlist');
      const parsed = saved ? JSON.parse(saved) : {};
      const nextVal = !parsed[targetId];
      parsed[targetId] = nextVal;
      localStorage.setItem('knotsnco_wishlist', JSON.stringify(parsed));
      setWishlistMap({ ...parsed });
      if (targetId === product.id) {
        setIsWishlist(nextVal);
      }
      window.dispatchEvent(new Event('knotsnco_wishlist_updated'));
    } catch {}
  };

  // Recommendations for "You might also like"
  const recommendedProducts = useMemo(() => {
    const valid = ALL_PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        p.handle !== product.handle &&
        p.images &&
        p.images.length > 0 &&
        typeof p.price === 'number'
    );

    const sameCategory = valid.filter((p) => p.category === product.category);
    const otherCategories = valid.filter((p) => p.category !== product.category);
    const merged = [...sameCategory, ...otherCategories];
    return merged.slice(0, 12);
  }, [product]);

  // Carousel track ref and scroll controls for "You might also like"
  const carouselTrackRef = useRef<HTMLDivElement>(null);

  const handleCarouselPrev = () => {
    if (carouselTrackRef.current) {
      carouselTrackRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleCarouselNext = () => {
    if (carouselTrackRef.current) {
      carouselTrackRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Reset gallery and quantity when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id, product.handle]);

  // Keyboard navigation for image carousel (Left & Right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  // Accordion open/close states (default closed matching reference image)
  const [openAccordions, setOpenAccordions] = useState<{
    details: boolean;
    care: boolean;
    shipping: boolean;
  }>({
    details: false,
    care: false,
    shipping: false,
  });

  const toggleAccordion = (section: 'details' | 'care' | 'shipping') => {
    setOpenAccordions((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePrevImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCartClick = () => {
    onAddToCart?.(product, quantity);
    setAddedToast(true);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setAddedToast(false);
    }, 2400);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Pricing & Discount calculation
  const currentPrice = product.price;
  const originalPrice = product.originalPrice;
  const savings =
    originalPrice && originalPrice > currentPrice
      ? originalPrice - currentPrice
      : 0;
  const savingsPct =
    originalPrice && originalPrice > currentPrice
      ? Math.round((savings / originalPrice) * 100)
      : 0;

  // Extract a crisp 1-2 sentence friendly description for the top area
  const conciseSummary = useMemo(() => {
    if (!product.description) {
      return 'A cheerful handmade crochet bouquet of sunflowers and daisies, perfect to brighten any space.';
    }

    const raw = product.description.trim();

    // Check if there are bullet points like "• Premium Quality: The Bouquet Full Of Sunshine Is Handcrafted..."
    if (raw.includes('•')) {
      const parts = raw.split('•').filter((p) => p.trim().length > 0);
      if (parts.length > 0) {
        const first = parts[0].trim();
        const cleaned = first.replace(/^[^:]+:\s*/i, '').trim();
        return cleaned.endsWith('.') ? cleaned : `${cleaned}.`;
      }
    }

    // Cut off before bullet sections or features
    let intro = raw;
    for (const marker of ['Features:', '✨ Handmade', 'Perfect for:', 'Craftsmanship:']) {
      const idx = intro.indexOf(marker);
      if (idx !== -1 && idx > 20) {
        intro = intro.substring(0, idx).trim();
      }
    }

    // Grab first 1-2 sentences
    const sentences = intro.split(/(?<=[.?!])\s+/);
    if (sentences.length > 0 && sentences[0].length > 15) {
      return sentences.slice(0, 2).join(' ').trim();
    }

    return intro;
  }, [product.description]);

  // Extract full details for the "Product Details" accordion
  const detailedBulletPoints = useMemo(() => {
    if (!product.description) {
      return [
        { label: '100% Handcrafted', text: 'Stitched with love by our skilled crochet artisans and Dadis in Surat, India.' },
        { label: 'Material', text: 'Premium combed milk cotton yarn with hypoallergenic filler and gentle wire armature.' },
        { label: 'Everlasting Keepsake', text: 'Zero watering, zero wilting — retains its vibrant colors indefinitely.' },
      ];
    }

    const raw = product.description.trim();

    // If description has bullet points
    if (raw.includes('•')) {
      const parts = raw.split('•').filter((p) => p.trim().length > 0);
      return parts.map((part) => {
        const colonIdx = part.indexOf(':');
        if (colonIdx !== -1) {
          return {
            label: part.substring(0, colonIdx).trim(),
            text: part.substring(colonIdx + 1).trim(),
          };
        }
        return { label: 'Feature', text: part.trim() };
      });
    }

    // If description has ✨ items
    if (raw.includes('✨') && raw.split('✨').length > 2) {
      const parts = raw.split('✨').filter((p) => p.trim().length > 0);
      return parts.map((part) => {
        return { label: 'Handmade Feature', text: part.trim() };
      });
    }

    return [
      { label: 'Handcrafted', text: raw },
      { label: 'Care & Durability', text: 'Created with soft premium yarn for lasting warmth and cheerful charm.' },
    ];
  }, [product.description]);

  // Dynamic Design Details Cards (Matching Reference: "The Design Details")
  const designDetailCards = useMemo(() => {
    const isSunflower =
      product.handle?.includes('sunshine') ||
      product.handle?.includes('sunflower') ||
      product.name.toLowerCase().includes('sunflower') ||
      product.name.toLowerCase().includes('sunshine');

    if (isSunflower) {
      return [
        {
          id: 'sunflower-flowers',
          tag: 'Realistic Flowers',
          description: 'Handcrafted petals with thoughtful detail.',
          imageUrl: images[0] || undefined,
          crop: { width: 230, height: 230, x: -15, y: -10 },
        },
        {
          id: 'sunflower-vase',
          tag: 'Crochet Vase',
          description: 'A sturdy, textured vase that adds charm.',
          imageUrl: images[0] || undefined,
          crop: { width: 230, height: 230, x: -15, y: -30 },
        },
        {
          id: 'sunflower-blooms',
          tag: 'Mixed Blooms',
          description: 'A lovely mix of sunflowers and daisies.',
          imageUrl: images[1] || images[0] || undefined,
          crop: { width: 230, height: 230, x: -15, y: -15 },
        },
        {
          id: 'sunflower-size',
          tag: 'Perfect Size',
          description: 'Ideal for desks, shelves or gifting.',
          imageUrl: images[0] || undefined,
          crop: { width: 200, height: 200, x: 0, y: 0 },
        },
      ];
    }

    // Determine category-specific copy
    const cat = (product.category || '').toLowerCase();
    let tags = [
      { tag: 'Handmade with Love', desc: 'Meticulously crocheted stitch by stitch by artisans.' },
      { tag: 'Premium Cotton', desc: 'Soft, durable fibers designed to maintain vivid hue.' },
      { tag: 'Thoughtful Details', desc: 'Carefully finished edges and playful sweet accents.' },
      { tag: 'Timeless Keepsake', desc: 'Everlasting charm made to be cherished for years.' },
    ];

    if (cat.includes('bouquet')) {
      tags = [
        { tag: 'Realistic Petals', desc: 'Handcrafted petals with thoughtful detail.' },
        { tag: 'Crochet Wrap', desc: 'A sturdy, textured base that adds charm.' },
        { tag: 'Mixed Blooms', desc: 'A lovely harmonious mix of forever flowers.' },
        { tag: 'Perfect Size', desc: 'Ideal for desks, shelves or gifting.' },
      ];
    } else if (cat.includes('flower')) {
      tags = [
        { tag: 'Realistic Petals', desc: 'Handcrafted petals with thoughtful detail.' },
        { tag: 'Flexible Stems', desc: 'Sturdy, bendable stems to shape as you like.' },
        { tag: 'Evergreen Blooms', desc: '100% yarn blooms that never wilt or fade.' },
        { tag: 'Perfect Accent', desc: 'Ideal for single vases, bouquets, or gifting.' },
      ];
    } else if (cat.includes('plushie')) {
      tags = [
        { tag: 'Handmade Cuddles', desc: 'Soft premium yarn with careful hand-stitching.' },
        { tag: 'Safe & Sturdy', desc: 'Securely attached details safe for everyday hugs.' },
        { tag: 'Squishy Filling', desc: 'Fluffy high-grade polyfill for maximum softness.' },
        { tag: 'Pocket Buddy', desc: 'Cute compact companion to brighten any space.' },
      ];
    } else if (cat.includes('bag')) {
      tags = [
        { tag: 'Intricate Weave', desc: 'Dense, durable crochet weave for daily carry.' },
        { tag: 'Reinforced Straps', desc: 'Comfortable sturdy handles built to last.' },
        { tag: 'Signature Motifs', desc: 'Hand-stitched patterns with vibrant artisan charm.' },
        { tag: 'Spacious Fit', desc: 'Ample room for your phone, keys, and essentials.' },
      ];
    } else if (cat.includes('keychain')) {
      tags = [
        { tag: 'Golden Hardware', desc: 'Premium anti-tarnish clasp and sturdy key ring.' },
        { tag: 'Micro Stitching', desc: 'Delicate miniature crochet work full of personality.' },
        { tag: 'Lightweight Charm', desc: "Featherlight design that won't weigh down your bag." },
        { tag: 'Everyday Cute', desc: 'Adds an instant pop of joy to your keys or backpack.' },
      ];
    } else if (cat.includes('pot')) {
      tags = [
        { tag: 'Textured Pot', desc: 'Sturdy crochet planter base that stands upright.' },
        { tag: 'Evergreen Blooms', desc: 'Sculpted yarn flowers with lush green leaves.' },
        { tag: 'Zero Care', desc: 'No watering needed - blooms vibrant all year round.' },
        { tag: 'Desk Companion', desc: 'Handmade warmth for study tables, desks and shelves.' },
      ];
    } else if (cat.includes('decor')) {
      tags = [
        { tag: 'Cozy Aesthetic', desc: 'Adds handcrafted warmth and color to your home.' },
        { tag: 'Artisan Knits', desc: 'Lovingly crocheted with neat, dense yarn stitches.' },
        { tag: 'Retains Shape', desc: 'Structured form built to retain its charming look.' },
        { tag: 'Unique Gift', desc: 'A one-of-a-kind handmade treasure for loved ones.' },
      ];
    }

    // Assign images and crops
    if (images.length === 0) {
      return tags.map((t, idx) => ({
        id: `detail-${idx}`,
        tag: t.tag,
        description: t.desc,
        imageUrl: undefined,
        crop: { width: 200, height: 200, x: 0, y: 0 },
      }));
    }

    if (images.length === 1) {
      // Natural focal crops for single image
      const crops = [
        { width: 240, height: 240, x: -20, y: -20 },
        { width: 250, height: 250, x: -25, y: -65 },
        { width: 240, height: 240, x: -20, y: -10 },
        { width: 190, height: 190, x: 5, y: 5 },
      ];
      return tags.map((t, idx) => ({
        id: `detail-${idx}`,
        tag: t.tag,
        description: t.desc,
        imageUrl: images[0],
        crop: crops[idx],
      }));
    }

    // Multiple images available
    return tags.map((t, idx) => {
      const img = images[idx % images.length];
      return {
        id: `detail-${idx}`,
        tag: t.tag,
        description: t.desc,
        imageUrl: img,
        crop: { width: 200, height: 200, x: 0, y: 0 },
      };
    });
  }, [product, images]);

  return (
    <article className="relative w-full bg-[#FAF4ED] text-[#2D2424] font-['Fredoka'] pt-4 pb-16 sm:pb-24">
      {/* Toast Notification for Add to Cart */}
      {addedToast && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 max-w-sm mx-auto sm:mx-0 z-50 bg-[#641623] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <svg
            className="w-5 h-5 text-[#F7BE44] flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-medium text-sm">
            Added {quantity} {quantity > 1 ? 'items' : 'item'} to cart!
          </span>
        </div>
      )}

      {/* =========================================================================
          1. BREADCRUMBS NAVIGATION: home / shop all / [category] / [product name]
         ========================================================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#641623]/70 font-medium flex-wrap">
          <button
            onClick={onNavigateHome}
            type="button"
            className="hover:text-[#641623] hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span>home</span>
          </button>
          <span className="text-[#641623]/40">/</span>
          <button
            onClick={() => onNavigateShop?.('all')}
            type="button"
            className="hover:text-[#641623] hover:underline cursor-pointer"
          >
            shop all
          </button>
          <span className="text-[#641623]/40">/</span>
          <button
            onClick={() => onNavigateShop?.(product.category)}
            type="button"
            className="hover:text-[#641623] hover:underline cursor-pointer lowercase"
          >
            {product.category}
          </button>
          <span className="text-[#641623]/40">/</span>
          <span className="text-[#641623] font-bold line-clamp-1 max-w-[220px] sm:max-w-none">
            {product.name}
          </span>
        </nav>
      </div>

      {/* =========================================================================
          2. MAIN PRODUCT SECTION: Left Gallery (50%) + Right Details (50%)
         ========================================================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* =====================================================================
              A. LEFT COLUMN: IMAGE CAROUSEL & THUMBNAILS
             ===================================================================== */}
          <div className="w-full flex flex-col items-center">
            {/* Main Image Box */}
            <div className="relative aspect-square w-full rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#FAF2E8]/60 border border-[#641623]/10 shadow-[0_8px_28px_rgba(100,22,35,0.06)] group">
              {/* Overlaid Wishlist Button (Top Right) */}
              <button
                onClick={toggleWishlist}
                type="button"
                aria-label={isWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm border border-[#641623]/15 text-[#641623] flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                {isWishlist ? (
                  // Solid Maroon Heart
                  <svg
                    className="w-5 h-5 text-[#641623]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  // Outline Maroon Heart
                  <svg
                    className="w-5 h-5 text-[#641623]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                )}
              </button>

              {/* Carousel Left Arrow (Only if more than 1 image) */}
              {images.length > 1 && (
                <button
                  onClick={handlePrevImage}
                  type="button"
                  aria-label="Previous image"
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-sm border border-[#641623]/15 text-[#641623] flex items-center justify-center shadow-xs hover:scale-110 active:scale-90 transition-all cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 -translate-x-[1px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
              )}

              {/* Carousel Right Arrow (Only if more than 1 image) */}
              {images.length > 1 && (
                <button
                  onClick={handleNextImage}
                  type="button"
                  aria-label="Next image"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-sm border border-[#641623]/15 text-[#641623] flex items-center justify-center shadow-xs hover:scale-110 active:scale-90 transition-all cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 translate-x-[1px]"
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
              )}

              {/* Main Image Rendering (Strictly Shopify CDN image, or blank if none) */}
              {images.length > 0 && images[safeImageIndex] ? (
                <img
                  src={images[safeImageIndex]}
                  alt={product.name}
                  onError={(e) => {
                    // Gracefully hide broken image
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover select-none transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full bg-[#FAF4ED] flex items-center justify-center select-none" />
              )}
            </div>

            {/* Thumbnail Row Underneath (Only if > 1 image, matching Reference) */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto max-w-full pb-2 pt-4 no-scrollbar">
                {images.map((imgUrl, idx) => {
                  const isActive = idx === safeImageIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      type="button"
                      aria-label={`View photo ${idx + 1}`}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-200 ${
                        isActive
                          ? 'border-[2.5px] border-[#641623] shadow-xs scale-102'
                          : 'border border-[#641623]/15 opacity-70 hover:opacity-100 hover:scale-102'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* =====================================================================
              B. RIGHT COLUMN: PRODUCT TITLE, PRICE, ACTIONS & ACCORDIONS
             ===================================================================== */}
          <div className="w-full text-left flex flex-col">
            {/* Title Row with Attached Cute Flower Doodle */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 flex-wrap">
              <h1 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl lg:text-4xl text-[#641623] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Flower Icon Doodle (Matching Reference) */}
              <div className="inline-flex items-center text-[#F7BE44] flex-shrink-0">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  {/* 5 Petals */}
                  <circle cx="16" cy="7" r="4.5" fill="#FFE485" stroke="#641623" strokeWidth="1.8" />
                  <circle cx="24" cy="13" r="4.5" fill="#FFE485" stroke="#641623" strokeWidth="1.8" />
                  <circle cx="21" cy="22" r="4.5" fill="#FFE485" stroke="#641623" strokeWidth="1.8" />
                  <circle cx="11" cy="22" r="4.5" fill="#FFE485" stroke="#641623" strokeWidth="1.8" />
                  <circle cx="8" cy="13" r="4.5" fill="#FFE485" stroke="#641623" strokeWidth="1.8" />
                  {/* Center Core */}
                  <circle cx="16" cy="15" r="5" fill="#F7BE44" stroke="#641623" strokeWidth="1.8" />
                  <circle cx="14.5" cy="14.5" r="0.8" fill="#641623" />
                  <circle cx="17.5" cy="14.5" r="0.8" fill="#641623" />
                  <path d="M15 16.5 Q16 17.5 17 16.5" stroke="#641623" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Price & Savings Badge Row */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 flex-wrap mt-2 sm:mt-3">
              {/* Current Price */}
              <span className="font-['Fredoka'] font-black text-2xl sm:text-3xl lg:text-[32px] text-[#641623]">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>

              {/* Original Compare-At Price (Strikethrough) */}
              {originalPrice && originalPrice > currentPrice && (
                <span className="font-['Fredoka'] font-medium text-lg sm:text-xl text-[#2D2424]/45 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}

              {/* Discount Pill Badge: "Save ₹300 (19% off)" or preset discount */}
              {savings > 0 ? (
                <span className="px-3 py-1 rounded-full bg-[#FCE2EB] text-[#811B2B] font-['Fredoka'] font-semibold text-xs sm:text-sm">
                  Save ₹{savings.toLocaleString('en-IN')} ({savingsPct}% off)
                </span>
              ) : product.discount ? (
                <span className="px-3 py-1 rounded-full bg-[#FCE2EB] text-[#811B2B] font-['Fredoka'] font-semibold text-xs sm:text-sm">
                  {product.discount}
                </span>
              ) : null}
            </div>

            {/* Rating Stars Row: ★★★★★ 4.8 (126 reviews) */}
            <div className="flex items-center gap-2 mt-2.5 sm:mt-3 text-sm">
              <div className="flex items-center gap-0.5 text-[#F7BE44]">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs sm:text-sm text-[#2D2424]/80 font-medium">
                4.8 (126 reviews)
              </span>
            </div>

            {/* Description Text */}
            <p className="text-sm sm:text-base text-[#2D2424]/85 leading-relaxed mt-3.5 sm:mt-4">
              {conciseSummary}
            </p>

            {/* QUANTITY Stepper Section */}
            <div className="mt-5 sm:mt-6">
              <p className="font-['Fredoka'] font-bold text-xs uppercase tracking-wider text-[#641623] mb-2">
                QUANTITY
              </p>
              <div className="inline-flex items-center justify-between w-36 h-10 px-3.5 rounded-full border border-[#641623]/30 bg-white shadow-2xs text-[#641623]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  type="button"
                  aria-label="Decrease quantity"
                  className="p-1 hover:opacity-70 font-bold text-lg cursor-pointer"
                >
                  −
                </button>
                <span className="font-bold text-sm select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  type="button"
                  aria-label="Increase quantity"
                  className="p-1 hover:opacity-70 font-bold text-lg cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Add to Wishlist */}
            <div className="mt-5 sm:mt-6 space-y-3">
              {/* 1. Add to Cart Button */}
              <button
                onClick={handleAddToCartClick}
                type="button"
                className="w-full py-3.5 sm:py-4 rounded-full bg-[#641623] hover:bg-[#52121c] active:scale-[0.99] text-white font-['Fredoka'] font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all shadow-[0_4px_16px_rgba(100,22,35,0.2)] cursor-pointer"
              >
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span>Add to Cart</span>
              </button>

              {/* 2. Add to Wishlist Button */}
              <button
                onClick={toggleWishlist}
                type="button"
                className="w-full py-3.5 sm:py-4 rounded-full bg-[#FFE9A7] hover:bg-[#FDD874] active:scale-[0.99] text-[#641623] font-['Fredoka'] font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all border border-[#641623]/15 shadow-2xs cursor-pointer"
              >
                <svg
                  className="w-5 h-5 text-[#641623]"
                  viewBox="0 0 24 24"
                  fill={isWishlist ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>{isWishlist ? 'In Wishlist ♡' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Feature Trust Badges (Exact 4 Scalloped Rosette Badges from Reference) */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-7 sm:mt-8 pt-2 text-center">
              {/* 1. Handmade with love */}
              <div className="flex flex-col items-center">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-[#641623]">
                  {/* Scalloped 8-petal Rosette background */}
                  <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full drop-shadow-2xs">
                    <path
                      d="M 42.19 16.47 A 8 8 0 0 1 42.19 31.53 A 8 8 0 0 1 31.53 42.19 A 8 8 0 0 1 16.47 42.19 A 8 8 0 0 1 5.81 31.53 A 8 8 0 0 1 5.81 16.47 A 8 8 0 0 1 16.47 5.81 A 8 8 0 0 1 31.53 5.81 A 8 8 0 0 1 42.19 16.47 Z"
                      fill="#FFFDF9"
                      stroke="#641623"
                      strokeWidth="1.6"
                    />
                  </svg>
                  {/* Icon: Hand holding heart */}
                  <svg
                    className="relative z-10 w-5 h-5 sm:w-6 sm:h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-[#641623] mt-2 leading-tight">
                  Handmade<br />with love
                </span>
              </div>

              {/* 2. Soft & Long-lasting */}
              <div className="flex flex-col items-center">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-[#641623]">
                  {/* Scalloped 8-petal Rosette background */}
                  <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full drop-shadow-2xs">
                    <path
                      d="M 42.19 16.47 A 8 8 0 0 1 42.19 31.53 A 8 8 0 0 1 31.53 42.19 A 8 8 0 0 1 16.47 42.19 A 8 8 0 0 1 5.81 31.53 A 8 8 0 0 1 5.81 16.47 A 8 8 0 0 1 16.47 5.81 A 8 8 0 0 1 31.53 5.81 A 8 8 0 0 1 42.19 16.47 Z"
                      fill="#FFFDF9"
                      stroke="#641623"
                      strokeWidth="1.6"
                    />
                  </svg>
                  {/* Icon: Yarn Skein */}
                  <svg
                    className="relative z-10 w-5 h-5 sm:w-6 sm:h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 4a8 8 0 0 0 0 16" />
                    <path d="M4.5 9h15" />
                    <path d="M4.5 15h15" />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-[#641623] mt-2 leading-tight">
                  Soft &<br />Long-lasting
                </span>
              </div>

              {/* 3. Gift-Ready Packaging */}
              <div className="flex flex-col items-center">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-[#641623]">
                  {/* Scalloped 8-petal Rosette background */}
                  <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full drop-shadow-2xs">
                    <path
                      d="M 42.19 16.47 A 8 8 0 0 1 42.19 31.53 A 8 8 0 0 1 31.53 42.19 A 8 8 0 0 1 16.47 42.19 A 8 8 0 0 1 5.81 31.53 A 8 8 0 0 1 5.81 16.47 A 8 8 0 0 1 16.47 5.81 A 8 8 0 0 1 42.19 16.47 Z"
                      fill="#FFFDF9"
                      stroke="#641623"
                      strokeWidth="1.6"
                    />
                  </svg>
                  {/* Icon: Gift box with bow */}
                  <svg
                    className="relative z-10 w-5 h-5 sm:w-6 sm:h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" rx="1" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-[#641623] mt-2 leading-tight">
                  Gift-Ready<br />Packaging
                </span>
              </div>

              {/* 4. Made by our Dadis */}
              <div className="flex flex-col items-center">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-[#641623]">
                  {/* Scalloped 8-petal Rosette background */}
                  <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full drop-shadow-2xs">
                    <path
                      d="M 42.19 16.47 A 8 8 0 0 1 42.19 31.53 A 8 8 0 0 1 31.53 42.19 A 8 8 0 0 1 16.47 42.19 A 8 8 0 0 1 5.81 31.53 A 8 8 0 0 1 5.81 16.47 A 8 8 0 0 1 16.47 5.81 A 8 8 0 0 1 31.53 5.81 A 8 8 0 0 1 42.19 16.47 Z"
                      fill="#FFFDF9"
                      stroke="#641623"
                      strokeWidth="1.6"
                    />
                  </svg>
                  {/* Icon: Gentle leaf with veins */}
                  <svg
                    className="relative z-10 w-5 h-5 sm:w-6 sm:h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-[#641623] mt-2 leading-tight">
                  Made by<br />our Dadis
                </span>
              </div>
            </div>

            {/* Cute Wavy Ribbon Divider */}
            <div className="w-full flex justify-end mt-4 mb-3 pr-2 pointer-events-none">
              <svg
                viewBox="0 0 120 16"
                className="w-24 sm:w-28 h-3 text-[#D96B7D]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M 4 8 Q 24 1 44 8 T 84 8 T 116 8" />
              </svg>
            </div>

            {/* 3 Collapsible Accordions (Product Details, Care, Shipping) */}
            <div className="space-y-2.5 sm:space-y-3 mt-1">
              {/* 1. Product Details Accordion */}
              <div className="rounded-[18px] sm:rounded-[20px] bg-[#F7E5EE] border border-[#641623]/10 overflow-hidden transition-all">
                <button
                  onClick={() => toggleAccordion('details')}
                  type="button"
                  className="w-full py-3 sm:py-3.5 px-5 flex items-center justify-between text-[#641623] font-['Fredoka'] font-bold text-sm sm:text-base cursor-pointer hover:bg-[#F2D7E4] transition-colors"
                >
                  <span>Product Details</span>
                  <svg
                    className={`w-4 h-4 text-[#641623] transition-transform duration-200 ${
                      openAccordions.details ? 'rotate-180' : ''
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
                {openAccordions.details && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#2D2424]/85 leading-relaxed space-y-2 border-t border-[#641623]/5">
                    {detailedBulletPoints.map((item, i) => (
                      <p key={i}>
                        • <strong>{item.label}:</strong> {item.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Care Instructions Accordion */}
              <div className="rounded-[18px] sm:rounded-[20px] bg-[#F7E5EE] border border-[#641623]/10 overflow-hidden transition-all">
                <button
                  onClick={() => toggleAccordion('care')}
                  type="button"
                  className="w-full py-3 sm:py-3.5 px-5 flex items-center justify-between text-[#641623] font-['Fredoka'] font-bold text-sm sm:text-base cursor-pointer hover:bg-[#F2D7E4] transition-colors"
                >
                  <span>Care Instructions</span>
                  <svg
                    className={`w-4 h-4 text-[#641623] transition-transform duration-200 ${
                      openAccordions.care ? 'rotate-180' : ''
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
                {openAccordions.care && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#2D2424]/85 leading-relaxed space-y-2 border-t border-[#641623]/5">
                    <p>
                      • <strong>Spot Clean Only:</strong> Gently dab any dusty spot with a soft, slightly damp cloth.
                    </p>
                    <p>
                      • <strong>Do Not Submerge:</strong> Avoid machine washing or soaking in water to maintain the structural yarn stitch.
                    </p>
                    <p>
                      • <strong>Display:</strong> Keep in a cool, dry room away from direct open flames and extreme dampness.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Shipping & Returns Accordion */}
              <div className="rounded-[18px] sm:rounded-[20px] bg-[#F7E5EE] border border-[#641623]/10 overflow-hidden transition-all">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  type="button"
                  className="w-full py-3 sm:py-3.5 px-5 flex items-center justify-between text-[#641623] font-['Fredoka'] font-bold text-sm sm:text-base cursor-pointer hover:bg-[#F2D7E4] transition-colors"
                >
                  <span>Shipping & Returns</span>
                  <svg
                    className={`w-4 h-4 text-[#641623] transition-transform duration-200 ${
                      openAccordions.shipping ? 'rotate-180' : ''
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
                {openAccordions.shipping && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#2D2424]/85 leading-relaxed space-y-2 border-t border-[#641623]/5">
                    <p>
                      • <strong>Free Shipping:</strong> Complimentary courier delivery across India on orders above ₹1,999.
                    </p>
                    <p>
                      • <strong>Dispatch:</strong> Carefully crafted and dispatched within 24 to 48 hours with live tracking.
                    </p>
                    <p>
                      • <strong>Gift Packaging:</strong> Dispatched in sturdy, eco-conscious gift boxes with custom handwritten gift cards.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. THE DESIGN DETAILS SECTION (Exact Match to Reference Image)
          Full-width scalloped cloud banner in pastel lilac (#EBD8E7),
          top 5-petal flower badge, doodle spark rays, 8-lobed rosette frames,
          butter-yellow pills & centered captions.
         ========================================================================= */}
      <section className="relative w-full mt-12 sm:mt-16 mb-4">
        {/* Scalloped Cloud Top Wave */}
        <div className="w-full overflow-hidden leading-none -mb-[1px]">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-7 sm:h-10 block">
            <path
              d="M 0,25 Q 30,5 60,25 Q 90,5 120,25 Q 150,5 180,25 Q 210,5 240,25 Q 270,5 300,25 Q 330,5 360,25 Q 390,5 420,25 Q 450,5 480,25 Q 510,5 540,25 Q 570,5 600,25 Q 630,5 660,25 Q 690,5 720,25 Q 750,5 780,25 Q 810,5 840,25 Q 870,5 900,25 Q 930,5 960,25 Q 990,5 1020,25 Q 1050,5 1080,25 Q 1110,5 1140,25 Q 1170,5 1200,25 Q 1230,5 1260,25 Q 1290,5 1320,25 Q 1350,5 1380,25 Q 1410,5 1440,25 L 1440,40 L 0,40 Z"
              fill="#EBD8E7"
            />
          </svg>
        </div>

        {/* Main Content Area in Pastel Lilac */}
        <div className="relative w-full bg-[#EBD8E7] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Top Center Overlapping Flower Badge */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <svg viewBox="0 0 44 44" className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-sm">
              <circle cx="22" cy="12" r="6" fill="#F47C96" stroke="#641623" strokeWidth="2.2" />
              <circle cx="31.5" cy="19" r="6" fill="#F47C96" stroke="#641623" strokeWidth="2.2" />
              <circle cx="28" cy="30" r="6" fill="#F47C96" stroke="#641623" strokeWidth="2.2" />
              <circle cx="16" cy="30" r="6" fill="#F47C96" stroke="#641623" strokeWidth="2.2" />
              <circle cx="12.5" cy="19" r="6" fill="#F47C96" stroke="#641623" strokeWidth="2.2" />
              <circle cx="22" cy="22" r="6" fill="#FCD34D" stroke="#641623" strokeWidth="2.2" />
              <circle cx="22" cy="22" r="2" fill="#641623" />
            </svg>
          </div>

          {/* Floating Spark Doodles on Left and Right */}
          <div className="absolute top-6 left-6 sm:left-14 md:left-20 text-[#641623] pointer-events-none select-none hidden sm:block">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 opacity-85"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            >
              <line x1="8" y1="18" x2="3" y2="24" />
              <line x1="16" y1="14" x2="16" y2="6" />
              <line x1="24" y1="18" x2="29" y2="24" />
            </svg>
          </div>
          <div className="absolute top-6 right-6 sm:right-14 md:right-20 text-[#641623] pointer-events-none select-none hidden sm:block">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 opacity-85"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            >
              <line x1="8" y1="18" x2="3" y2="24" />
              <line x1="16" y1="14" x2="16" y2="6" />
              <line x1="24" y1="18" x2="29" y2="24" />
            </svg>
          </div>

          {/* Section Heading with Left Stitch & Right Spark Rays */}
          <div className="flex items-center justify-center gap-2 sm:gap-3.5 mb-8 sm:mb-12 text-[#641623]">
            <span className="text-xl sm:text-2xl font-bold select-none leading-none">-</span>
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#641623]">
              The Design Details
            </h2>
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#641623] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            >
              <line x1="8" y1="16" x2="3" y2="21" />
              <line x1="12" y1="14" x2="12" y2="5" />
              <line x1="16" y1="16" x2="21" y2="21" />
            </svg>
          </div>

          {/* 4 Feature Cards: 2-Col on Mobile, 4-Col on Desktop */}
          <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-start justify-items-center">
            {designDetailCards.map((card, idx) => {
              const clipId = `rosette-clip-${card.id}-${idx}`;
              return (
                <div key={card.id} className="flex flex-col items-center text-center group w-full">
                  {/* Rosette Frame with Overlapping Butter-Yellow Pill */}
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48">
                    <svg
                      viewBox="0 0 200 200"
                      className="w-full h-full drop-shadow-[0_4px_12px_rgba(100,22,35,0.08)]"
                    >
                      <defs>
                        <clipPath id={clipId}>
                          <path d="M 169.68 71.14 A 30 30 0 0 1 169.68 128.86 A 30 30 0 0 1 128.86 169.68 A 30 30 0 0 1 71.14 169.68 A 30 30 0 0 1 30.32 128.86 A 30 30 0 0 1 30.32 71.14 A 30 30 0 0 1 71.14 30.32 A 30 30 0 0 1 128.86 30.32 A 30 30 0 0 1 169.68 71.14 Z" />
                        </clipPath>
                      </defs>
                      {/* Outer White Rosette Frame */}
                      <path
                        d="M 174.08 69.32 A 32 32 0 0 1 174.08 130.68 A 32 32 0 0 1 130.68 174.08 A 32 32 0 0 1 69.32 174.08 A 32 32 0 0 1 25.92 130.68 A 32 32 0 0 1 25.92 69.32 A 32 32 0 0 1 69.32 25.92 A 32 32 0 0 1 130.68 25.92 A 32 32 0 0 1 174.08 69.32 Z"
                        fill="#FFFFFF"
                      />
                      {/* Inner Image / Blank Pastel Background */}
                      {card.imageUrl ? (
                        <image
                          href={card.imageUrl}
                          width={card.crop.width}
                          height={card.crop.height}
                          x={card.crop.x}
                          y={card.crop.y}
                          preserveAspectRatio="xMidYMid slice"
                          clipPath={`url(#${clipId})`}
                          className="transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <g clipPath={`url(#${clipId})`}>
                          <rect width="200" height="200" fill="#FAF4ED" />
                          <circle cx="100" cy="100" r="32" fill="#EBD8E7" opacity="0.6" />
                        </g>
                      )}
                    </svg>

                    {/* Butter-Yellow Pill Badge Overlapping Bottom */}
                    <div className="absolute -bottom-2.5 sm:-bottom-3 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                      <span className="inline-block px-3.5 sm:px-4 py-1 rounded-full bg-[#FFECA8] border-2 border-white shadow-[0_2px_8px_rgba(100,22,35,0.06)] font-bold text-xs sm:text-sm text-[#641623]">
                        {card.tag}
                      </span>
                    </div>
                  </div>

                  {/* Descriptive Caption Underneath */}
                  <p className="mt-4 sm:mt-5 text-xs sm:text-sm font-medium text-[#5A1827] max-w-[175px] leading-snug">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scalloped Cloud Bottom Wave */}
        <div className="w-full overflow-hidden leading-none -mt-[1px]">
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-7 sm:h-10 block">
            <path
              d="M 0,0 L 1440,0 L 1440,15 Q 1410,35 1380,15 Q 1350,35 1320,15 Q 1290,35 1260,15 Q 1230,35 1200,15 Q 1170,35 1140,15 Q 1110,35 1080,15 Q 1050,35 1020,15 Q 990,35 960,15 Q 930,35 900,15 Q 870,35 840,15 Q 810,35 780,15 Q 750,35 720,15 Q 690,35 660,15 Q 630,35 600,15 Q 570,35 540,15 Q 510,35 480,15 Q 450,35 420,15 Q 390,35 360,15 Q 330,35 300,15 Q 270,35 240,15 Q 210,35 180,15 Q 150,35 120,15 Q 90,35 60,15 Q 30,35 0,15 Z"
              fill="#EBD8E7"
            />
          </svg>
        </div>
      </section>

      {/* =========================================================================
          4. "YOU MIGHT ALSO LIKE" SECTION (Exact Match to Reference Image)
          Heart-accented title, circular carousel arrows, 4 cards in view,
          bottom-left crochet flower and bottom-right pink yarn ball with heart loop trail.
         ========================================================================= */}
      <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 sm:pb-20 overflow-hidden">
        {/* Section Heading: ♥ You might also like ♥ */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-8 sm:mb-10 text-[#641623]">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-[#641623] flex-shrink-0" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#641623]">
            You might also like
          </h2>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-[#641623] flex-shrink-0" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Carousel Container with Left/Right Arrow Buttons */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-4">
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={handleCarouselPrev}
            aria-label="Previous products"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-[#641623]/30 shadow-xs flex items-center justify-center text-[#641623] hover:border-[#641623] hover:bg-[#641623] hover:text-white transition-all cursor-pointer flex-shrink-0 z-20"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Scrollable Track / Grid */}
          <div
            ref={carouselTrackRef}
            className="flex-1 flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recommendedProducts.map((item) => {
              const isItemWishlist = !!wishlistMap[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (onNavigateProduct) {
                      onNavigateProduct(item.handle || item.id);
                    } else {
                      window.location.hash = `/product?id=${encodeURIComponent(item.handle || item.id)}`;
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-[calc(50%-8px)] sm:w-[calc(33.333%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start flex flex-col items-center text-center group cursor-pointer"
                >
                  {/* Peach / Beige Image Card */}
                  <div className="relative aspect-square w-full rounded-[24px] sm:rounded-[28px] bg-[#F7ECE2] overflow-hidden border border-[#641623]/8 p-3 sm:p-4 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_8px_24px_rgba(100,22,35,0.08)]">
                    {/* Top-Right Heart Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleCardWishlist(item.id, e)}
                      aria-label={isItemWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      className="absolute top-3 right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 border border-[#641623]/20 shadow-xs flex items-center justify-center text-[#641623] z-10 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <svg
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          isItemWishlist ? 'fill-[#641623] text-[#641623]' : 'fill-none text-[#641623]'
                        }`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>

                    {/* Product Image */}
                    {item.image || (item.images && item.images[0]) ? (
                      <img
                        src={item.image || (item.images && item.images[0])}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 select-none"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#641623]/40">
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Title */}
                  <h3 className="font-bold text-xs sm:text-sm md:text-base text-[#641623] mt-3 group-hover:text-[#8E283A] transition-colors leading-snug line-clamp-1 max-w-[95%]">
                    {item.name}
                  </h3>

                  {/* Product Price */}
                  <p className="font-bold text-xs sm:text-sm md:text-base text-[#641623] mt-0.5">
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleCarouselNext}
            aria-label="Next products"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-[#641623]/30 shadow-xs flex items-center justify-center text-[#641623] hover:border-[#641623] hover:bg-[#641623] hover:text-white transition-all cursor-pointer flex-shrink-0 z-20"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
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

        {/* Bottom Left Handcrafted Flower Illustration */}
        <div className="absolute -bottom-2 -left-2 sm:left-2 w-20 h-20 sm:w-28 sm:h-28 pointer-events-none select-none z-10">
          <img
            src="/decorations/you_might_like_flower.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>

        {/* Bottom Right Pink Yarn Ball with Heart Trail */}
        <div className="absolute -bottom-2 -right-2 sm:right-2 w-28 sm:w-36 h-18 sm:h-24 pointer-events-none select-none z-10 flex items-end justify-end">
          <img
            src="/decorations/you_might_like_yarn.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
      </section>
    </article>
  );
};
