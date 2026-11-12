import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS, ShopProduct } from '../data/allProductsData';
import {
  SparkleIcon,
  DaisyIcon,
  YarnBallIcon,
  CrochetHookIcon,
  DaadiIcon,
  LoveLetterIcon,
  GiftBoxIcon,
  BouquetIcon,
  DeliveryTruckIcon,
  LeafIcon,
  ClockIcon,
  FeatherDusterIcon,
  DropletIcon,
  SunIcon,
  WiltedFlowerIcon,
  CheckCircleIcon,
} from './ArtisanIcons';

const optimizeShopifyUrl = (url?: string, width = 600) => {
  if (!url) return '';
  if (url.includes('cdn.shopify.com') && !url.includes('&width=')) {
    return `${url}&width=${width}&format=webp`;
  }
  return url;
};

interface ProductDetailsPageProps {
  productId?: string | null;
  productHandle?: string | null;
  onNavigateHome?: () => void;
  onNavigateShop?: (category?: string) => void;
  onNavigateProduct?: (productId: string) => void;
  onAddToCart?: (product: ShopProduct, quantity: number) => void | Promise<void>;
  onBuyNow?: (product: ShopProduct, quantity: number) => void | Promise<void>;
}

const RECOMMENDED_BADGES = [
  { line1: 'BEST', line2: 'SELLER', bgColor: '#7FE5BD' },
  { line1: 'MOST', line2: 'LOVED', bgColor: '#F9A8D4' },
  { line1: 'TOP', line2: 'PICK', bgColor: '#FDE047' },
  { line1: 'HOT', line2: 'FAV', bgColor: '#FDBA74' },
  { line1: 'POPULAR', line2: 'GIFT', bgColor: '#93C5FD' },
  { line1: 'DAADI', line2: 'SPECIAL', bgColor: '#FED7AA' },
];

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  productId,
  productHandle,
  onNavigateHome,
  onNavigateShop,
  onNavigateProduct,
  onAddToCart,
  onBuyNow,
}) => {
  // Find product from Shopify data with robust matching (ID, shopifyId, handle, title)
  const product: ShopProduct = useMemo(() => {
    const safeDecode = (val?: string | null) => {
      if (!val) return '';
      try {
        return decodeURIComponent(val).trim();
      } catch {
        return val.trim();
      }
    };

    const rawTarget = safeDecode(productId);
    const rawHandle = safeDecode(productHandle);

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
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [isBuyingNow, setIsBuyingNow] = useState<boolean>(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { openCart } = useCart();

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

  // Recommendations for "You might also like" - strictly authentic bouquets from store catalog
  const recommendedBouquets = useMemo(() => {
    const isTrueBouquet = (p: ShopProduct) => {
      const name = p.name.toLowerCase();
      // Exclude keychains, charms, pots, loose leaves/packs, magnets, accessories
      if (p.category === 'Keychains' || name.includes('charm') || name.includes('keychain')) return false;
      if (p.category === 'Flower Pots' || name.includes(' pot') || name.includes('pot ') || name.endsWith('pot')) return false;
      if (name.includes('leaf') || name.includes('pack of') || name.includes('magnet') || name.includes('earring') || name.includes('stud') || name.includes('tote') || name.includes('bag')) return false;
      if (p.category === 'Bouquets') return true;
      if (name.includes('bouquet')) return true;
      return false;
    };

    const valid = ALL_PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        p.handle !== product.handle &&
        isTrueBouquet(p) &&
        p.images &&
        p.images.length > 0 &&
        typeof p.price === 'number'
    );

    // Prioritize 4 showcase bouquets matching the reference image:
    // Slot 1: Tulip Bouquet
    const tulip =
      valid.find((p) => p.handle === 'flowers-mini-crochet-tulip-valley') ||
      valid.find((p) => p.name.toLowerCase().includes('tulip'));
    // Slot 2: Lavender Bouquet
    const lavender =
      valid.find((p) => p.handle === 'flowers-lavender-sunshine-lily-bouquet') ||
      valid.find((p) => p.name.toLowerCase().includes('lavender'));
    // Slot 3: Rose Bouquet
    const rose =
      valid.find((p) => p.handle === 'flowers-mini-red-rose-garden-bouquet') ||
      valid.find((p) => p.handle === 'flowers-shaded-rose-bouquet') ||
      valid.find((p) => p.name.toLowerCase().includes('rose'));
    // Slot 4: Daisy / Bloom Bouquet
    const daisy =
      valid.find((p) => p.handle === 'flowers-mini-pure-bloom-bouquet') ||
      valid.find((p) => p.handle === 'flowers-pink-daisy') ||
      valid.find((p) => p.name.toLowerCase().includes('daisy') || p.name.toLowerCase().includes('bloom'));

    const showcase = [tulip, lavender, rose, daisy].filter(
      (p): p is ShopProduct => p !== undefined && p.id !== product.id && p.handle !== product.handle
    );
    // Deduplicate in case a bouquet matched multiple slots
    const uniqueShowcase = Array.from(new Set(showcase));
    const rest = valid.filter((p) => !uniqueShowcase.some((s) => s.id === p.id));
    return [...uniqueShowcase, ...rest].slice(0, 20);
  }, [product]);

  // Carousel track ref and scroll controls for "You might also like"
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const [addedRecommendedId, setAddedRecommendedId] = useState<string | null>(null);
  const [recommendedActiveDot, setRecommendedActiveDot] = useState<number>(0);

  const handleRecommendedScroll = () => {
    if (carouselTrackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselTrackRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) return;
      const progress = scrollLeft / maxScroll;
      const dotCount = Math.min(6, recommendedBouquets.length);
      const dotIndex = Math.min(
        dotCount - 1,
        Math.max(0, Math.round(progress * (dotCount - 1)))
      );
      setRecommendedActiveDot(dotIndex);
    }
  };

  const handleCarouselPrev = () => {
    if (carouselTrackRef.current) {
      const scrollAmount = Math.max(260, Math.round(carouselTrackRef.current.clientWidth * 0.75));
      carouselTrackRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCarouselNext = () => {
    if (carouselTrackRef.current) {
      const scrollAmount = Math.max(260, Math.round(carouselTrackRef.current.clientWidth * 0.75));
      carouselTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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

  // Interactive Badges tab (0: Handmade with love, 1: Soft & Long-lasting, 2: Gift-Ready Packaging, 3: Made by our Dadis)
  const [activeBadgeStory, setActiveBadgeStory] = useState<number | null>(null);

  // Live Pincode Estimator State
  const [pincodeInput, setPincodeInput] = useState<string>('');
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [pincodeDetails, setPincodeDetails] = useState<{
    zone: string;
    deliveryDate: string;
  } | null>(null);

  // Complimentary Handwritten Gift Card Personalizer
  const [isGiftNoteOpen, setIsGiftNoteOpen] = useState<boolean>(false);
  const [giftRecipient, setGiftRecipient] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [giftSender, setGiftSender] = useState<string>('');
  const [giftNoteSaved, setGiftNoteSaved] = useState<boolean>(false);

  // Handle Pincode Check
  const handleCheckPincode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPin = pincodeInput.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setPincodeStatus('error');
      setPincodeDetails(null);
      return;
    }
    setPincodeStatus('checking');
    setTimeout(() => {
      const now = new Date();
      let daysToAdd = 3;
      let zoneName = 'India Express Delivery';
      if (cleanPin.startsWith('395') || cleanPin.startsWith('394')) {
        zoneName = 'Surat Artisan Hub';
        daysToAdd = 1;
      } else if (cleanPin.startsWith('400') || cleanPin.startsWith('411')) {
        zoneName = 'Mumbai / Pune Region';
        daysToAdd = 2;
      } else if (cleanPin.startsWith('110') || cleanPin.startsWith('122') || cleanPin.startsWith('201')) {
        zoneName = 'Delhi NCR';
        daysToAdd = 2;
      } else if (cleanPin.startsWith('560')) {
        zoneName = 'Bengaluru';
        daysToAdd = 2;
      } else if (cleanPin.startsWith('500')) {
        zoneName = 'Hyderabad';
        daysToAdd = 2;
      }

      const deliveryDateObj = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
      const formattedDate = deliveryDateObj.toLocaleDateString('en-IN', options);

      setPincodeDetails({
        zone: zoneName,
        deliveryDate: formattedDate,
      });
      setPincodeStatus('success');
    }, 350);
  };

  const handleSaveGiftNote = () => {
    setGiftNoteSaved(true);
    setTimeout(() => {
      setGiftNoteSaved(false);
    }, 2800);
  };

  const handlePrevImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCartClick = async () => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await onAddToCart?.(product, quantity);
      setAddedToast(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setAddedToast(false), 2400);
    } catch (err) {
      console.error('Add to cart failed:', err);
      // Still show toast — count was updated optimistically
      setAddedToast(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setAddedToast(false), 2400);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (isBuyingNow) return;
    setIsBuyingNow(true);
    try {
      await onBuyNow?.(product, quantity);
    } catch (err) {
      console.error('Buy Now failed:', err);
    } finally {
      setIsBuyingNow(false);
    }
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
      return `Lovingly hand-crocheted ${product.name}, crafted with soft premium milk-cotton yarn.`;
    }

    let text = product.description.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

    // 1. Cut at metadata squashes
    const metaPattern = /(?:Product\s*Name\s*[:–-]|Category\s*[:–-]|Material\(s?\)\s*[:–-]|Dimensions\s*(?:\/\s*Size)?\s*[:–-]|Color\s*\/\s*Design|Handmade\s*Features|Craftsmanship\s*[:–-]|Ideal\s*For|Why\s*It(?:’|')?s\s*Special|Care\s*Instructions|Features\s*\/\s*Highlights)/i;
    const match = text.search(metaPattern);
    let hook = text;
    if (match !== -1 && match > 5) {
      hook = text.substring(0, match).trim();
    }

    // 2. If it contains bullets, take the first clear bullet
    if (hook.includes('•')) {
      const parts = hook.split('•').filter((p) => p.trim().length > 0);
      if (parts.length > 0) {
        hook = parts[0].replace(/^[^:]+:\s*/i, '').trim();
      }
    }

    // 3. Keep 1-2 clean sentences
    const sentences = hook.split(/(?<=[.?!])\s+/).filter((s) => s.trim().length > 5);
    if (sentences.length > 2) {
      hook = sentences.slice(0, 2).join(' ');
    } else if (sentences.length > 0) {
      hook = sentences.join(' ');
    }

    hook = hook.replace(/[-–•,\s]+$/, '').trim();
    if (hook.length > 5) {
      hook = hook.charAt(0).toUpperCase() + hook.slice(1);
      if (!hook.endsWith('.')) hook += '.';
    } else {
      hook = `Lovingly hand-crocheted ${product.name}, crafted with soft premium milk-cotton yarn.`;
    }

    return hook;
  }, [product.description, product.name]);

  // Extract full clean details for the "Product Details" accordion
  const detailedBulletPoints = useMemo(() => {
    return [
      { label: '100% Handcrafted', text: 'Stitched knot-by-knot by skilled women artisans and Daadis in Surat, India.' },
      { label: 'Premium Material', text: 'Crafted with combed soft milk-cotton yarn with gentle internal shaping armature.' },
      { label: 'Everlasting Keepsake', text: 'Retains vivid color and shape indefinitely — zero watering or wilting required.' },
      { label: 'Ideal For', text: 'Birthdays, anniversaries, home aesthetic decor, or a warm heartfelt gift.' },
      { label: 'Care Instructions', text: 'Gently spot clean with a soft damp cloth. Dust-resistant and durable.' },
    ];
  }, []);

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
    <article className="relative w-full bg-[#FAF4ED]/85 text-[#2D2424] font-['Fredoka'] pt-4 pb-4 sm:pb-8">
      {/* Toast Notification for Add to Cart */}
      {addedToast && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 max-w-sm mx-auto sm:mx-0 z-50 bg-[#641623] text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2.5 min-w-0">
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
            <span className="font-medium text-xs sm:text-sm truncate">
              Added {quantity} {quantity > 1 ? 'items' : 'item'} to bag!
            </span>
          </div>
          <button
            onClick={() => {
              setAddedToast(false);
              openCart();
            }}
            type="button"
            className="px-3 py-1 rounded-full bg-[#FAF4ED] text-[#641623] font-bold text-xs uppercase tracking-wider hover:bg-[#FFE485] active:scale-95 transition-all flex-shrink-0 cursor-pointer"
          >
            View Bag →
          </button>
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
              {/* Overlaid Handmade Badge (Top Left) */}
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-[#641623]/15 text-[#641623] shadow-xs flex items-center gap-1.5 font-bold text-[11px] sm:text-xs">
                <SparkleIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="uppercase tracking-wider">100% Handcrafted</span>
              </div>

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
                  src={optimizeShopifyUrl(images[safeImageIndex], 850)}
                  alt={product.name}
                  decoding="async"
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
                        src={optimizeShopifyUrl(imgUrl, 160)}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
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
            {/* Top Category Pill & Stock Status */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#FAF2E8] border border-[#641623]/15 text-[#641623] font-['Fredoka'] font-bold text-xs uppercase tracking-wider">
                {product.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                In stock & ready to ship
              </span>
            </div>

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
            <div className="flex items-center gap-2.5 sm:gap-3.5 flex-wrap mt-2 sm:mt-2.5">
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

              {/* Discount Pill Badge */}
              {savings > 0 ? (
                <span className="px-3 py-1 rounded-full bg-[#FCE2EB] text-[#811B2B] font-['Fredoka'] font-semibold text-xs sm:text-sm">
                  Save ₹{savings.toLocaleString('en-IN')} ({savingsPct}% off)
                </span>
              ) : product.discount ? (
                <span className="px-3 py-1 rounded-full bg-[#FCE2EB] text-[#811B2B] font-['Fredoka'] font-semibold text-xs sm:text-sm">
                  {product.discount}
                </span>
              ) : null}

              <span className="text-xs text-[#641623]/60 font-medium ml-1">
                (Inclusive of all taxes)
              </span>
            </div>

            {/* Rating Stars Row: ★★★★★ 4.8 (126 reviews) */}
            <div className="flex items-center gap-2 mt-2 sm:mt-2.5 text-sm">
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
              <span className="text-[#641623]/40">•</span>
              <span className="text-xs text-[#641623] font-semibold">
                Verified Handmade ♡
              </span>
            </div>

            {/* Clean Heartfelt Description Callout Box */}
            <div className="mt-3.5 p-3.5 sm:p-4 rounded-[20px] bg-[#FAF2E8]/80 border border-[#641623]/12 shadow-2xs">
              <p className="text-sm sm:text-[15px] text-[#2D2424]/90 font-medium leading-relaxed italic">
                "{conciseSummary}"
              </p>
            </div>

            {/* 4 Feature Badges (Brand Trust Chips) */}
            <div className="flex items-center gap-2 flex-wrap mt-3.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4ED] border border-[#641623]/15 text-[#641623] text-xs font-bold shadow-2xs">
                <DaisyIcon className="w-3.5 h-3.5 flex-shrink-0" /> 100% Handcrafted
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4ED] border border-[#641623]/15 text-[#641623] text-xs font-bold shadow-2xs">
                <SparkleIcon className="w-3.5 h-3.5 flex-shrink-0" /> Everlasting Blooms
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4ED] border border-[#641623]/15 text-[#641623] text-xs font-bold shadow-2xs">
                <YarnBallIcon className="w-3.5 h-3.5 flex-shrink-0" /> Soft Milk-Cotton Yarn
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4ED] border border-[#641623]/15 text-[#641623] text-xs font-bold shadow-2xs">
                <LoveLetterIcon className="w-3.5 h-3.5 flex-shrink-0" /> Free Custom Gift Note
              </span>
            </div>

            {/* Handmade Specs Card (Compact 4-Item Grid) */}
            <div className="mt-4 p-3.5 sm:p-4 rounded-[22px] bg-[#FAF2E8] border border-[#641623]/15 shadow-2xs">
              <p className="font-['Fredoka'] font-bold text-xs uppercase tracking-wider text-[#641623] mb-2.5">
                HANDMADE SPECIFICATIONS
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs sm:text-[13px]">
                <div className="flex items-start gap-2.5 bg-[#FFFDF9] p-2.5 rounded-xl border border-[#641623]/10">
                  <CrochetHookIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#641623]/60 text-[10px] font-bold uppercase tracking-wider">Material</p>
                    <p className="font-bold text-[#641623]">Soft Milk-Cotton Yarn</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-[#FFFDF9] p-2.5 rounded-xl border border-[#641623]/10">
                  <DaadiIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#641623]/60 text-[10px] font-bold uppercase tracking-wider">Crafted By</p>
                    <p className="font-bold text-[#641623]">Surat Home Daadis</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-[#FFFDF9] p-2.5 rounded-xl border border-[#641623]/10">
                  <BouquetIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#641623]/60 text-[10px] font-bold uppercase tracking-wider">Durability</p>
                    <p className="font-bold text-[#641623]">Never Wilts & Dust-Free</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-[#FFFDF9] p-2.5 rounded-xl border border-[#641623]/10">
                  <GiftBoxIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#641623]/60 text-[10px] font-bold uppercase tracking-wider">Packaging</p>
                    <p className="font-bold text-[#641623]">Gift-Ready Box & Card</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QUANTITY Stepper Section */}
            <div className="mt-4 sm:mt-5">
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

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="mt-4 sm:mt-5 space-y-2.5">
              {/* 1. Add to Cart Button */}
              <button
                onClick={handleAddToCartClick}
                type="button"
                disabled={isAddingToCart}
                className="w-full py-3.5 sm:py-4 rounded-full bg-[#641623] hover:bg-[#52121c] active:scale-[0.99] text-white font-['Fredoka'] font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all shadow-[0_4px_16px_rgba(100,22,35,0.2)] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </button>

              {/* 2. Buy Now Button — creates cart & redirects to Shopify checkout */}
              <button
                onClick={handleBuyNow}
                type="button"
                disabled={isBuyingNow}
                className="w-full py-3 sm:py-3.5 rounded-full bg-[#FFE9A7] hover:bg-[#FDD874] active:scale-[0.99] text-[#641623] font-['Fredoka'] font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all border border-[#641623]/15 shadow-2xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isBuyingNow ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span>Redirecting...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 text-[#641623]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span>Buy Now</span>
                  </>
                )}
              </button>

              {/* 3. Add to Wishlist — subtle text link below */}
              <button
                onClick={toggleWishlist}
                type="button"
                className="w-full py-2 text-[#641623]/65 font-['Fredoka'] font-medium text-sm flex items-center justify-center gap-1.5 hover:text-[#641623] transition-colors cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill={isWishlist ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>{isWishlist ? '♡ In Wishlist' : '♡ Add to Wishlist'}</span>
              </button>
            </div>

            {/* Free Delivery & Trust Bar */}
            <div className="mt-3.5 p-3 rounded-2xl bg-[#FFFDF9] border border-[#641623]/12 flex flex-col gap-1.5 text-xs text-[#641623]/85 shadow-2xs">
              <div className="flex items-center gap-2">
                <DeliveryTruckIcon className="w-4 h-4 flex-shrink-0" />
                <span>
                  <strong>Free Express Shipping</strong> on all orders above ₹1,999
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GiftBoxIcon className="w-4 h-4 flex-shrink-0" />
                <span>
                  Every order includes a <strong>complimentary custom gift card</strong>
                </span>
              </div>
            </div>

            {/* Feature Trust Badges (Interactive 4 Scalloped Rosette Badges) */}
            <div className="mt-7 sm:mt-8 pt-2">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="font-['Fredoka'] font-bold text-xs uppercase tracking-wider text-[#641623]/80">
                  OUR ARTISAN PROMISE
                </span>
                <span className="text-[11px] font-medium text-[#641623]/60">
                  Tap any badge to explore story ♡
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                {/* 1. Handmade with love */}
                <button
                  type="button"
                  onClick={() => setActiveBadgeStory(activeBadgeStory === 0 ? null : 0)}
                  className={`flex flex-col items-center group cursor-pointer transition-all duration-200 active:scale-95 ${
                    activeBadgeStory === 0 ? '-translate-y-1' : 'hover:-translate-y-0.5'
                  }`}
                  aria-label="Handmade with love story"
                >
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-[#641623]">
                    {/* Scalloped 8-petal Rosette background with dynamic active glow */}
                    <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full drop-shadow-2xs transition-all duration-300">
                      <path
                        d="M 42.19 16.47 A 8 8 0 0 1 42.19 31.53 A 8 8 0 0 1 31.53 42.19 A 8 8 0 0 1 16.47 42.19 A 8 8 0 0 1 5.81 31.53 A 8 8 0 0 1 5.81 16.47 A 8 8 0 0 1 16.47 5.81 A 8 8 0 0 1 31.53 5.81 A 8 8 0 0 1 42.19 16.47 Z"
                        fill={activeBadgeStory === 0 ? '#FCE2EB' : '#FFFDF9'}
                        stroke={activeBadgeStory === 0 ? '#D96B7D' : '#641623'}
                        strokeWidth={activeBadgeStory === 0 ? '2.2' : '1.6'}
                      />
                    </svg>
                    {/* Icon: Heart */}
                    <svg
                      className={`relative z-10 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${
                        activeBadgeStory === 0 ? 'scale-110 text-[#D96B7D]' : 'group-hover:scale-105'
                      }`}
                      viewBox="0 0 24 24"
                      fill={activeBadgeStory === 0 ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold mt-2 leading-tight transition-colors ${
                    activeBadgeStory === 0 ? 'text-[#D96B7D] font-bold' : 'text-[#641623]'
                  }`}>
                    Handmade<br />with love
                  </span>
                  {activeBadgeStory === 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D96B7D] mt-1 animate-pulse" />
                  )}
                </button>

                {/* 2. Soft & Long-lasting */}
                <button
                  type="button"
                  onClick={() => setActiveBadgeStory(activeBadgeStory === 1 ? null : 1)}
                  className={`flex flex-col items-center group cursor-pointer transition-all duration-200 active:scale-95 ${
                    activeBadgeStory === 1 ? '-translate-y-1' : 'hover:-translate-y-0.5'
                  }`}
                  aria-label="Soft & Long-lasting story"
                >
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-[#641623]">
                    <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full drop-shadow-2xs transition-all duration-300">
                      <path
                        d="M 42.19 16.47 A 8 8 0 0 1 42.19 31.53 A 8 8 0 0 1 31.53 42.19 A 8 8 0 0 1 16.47 42.19 A 8 8 0 0 1 5.81 31.53 A 8 8 0 0 1 5.81 16.47 A 8 8 0 0 1 16.47 5.81 A 8 8 0 0 1 31.53 5.81 A 8 8 0 0 1 42.19 16.47 Z"
                        fill={activeBadgeStory === 1 ? '#FCF7D1' : '#FFFDF9'}
                        stroke={activeBadgeStory === 1 ? '#C99814' : '#641623'}
                        strokeWidth={activeBadgeStory === 1 ? '2.2' : '1.6'}
                      />
                    </svg>
                    {/* Icon: Yarn Skein */}
                    <svg
                      className={`relative z-10 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${
                        activeBadgeStory === 1 ? 'scale-110 text-[#8C6B0D]' : 'group-hover:scale-105'
                      }`}
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
                  <span className={`text-[10px] sm:text-xs font-semibold mt-2 leading-tight transition-colors ${
                    activeBadgeStory === 1 ? 'text-[#8C6B0D] font-bold' : 'text-[#641623]'
                  }`}>
                    Soft &<br />Long-lasting
                  </span>
                  {activeBadgeStory === 1 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C99814] mt-1 animate-pulse" />
                  )}
                </button>

                {/* 3. Gift-Ready Packaging */}
                <button
                  type="button"
                  onClick={() => setActiveBadgeStory(activeBadgeStory === 2 ? null : 2)}
                  className={`flex flex-col items-center group cursor-pointer transition-all duration-200 active:scale-95 ${
                    activeBadgeStory === 2 ? '-translate-y-1' : 'hover:-translate-y-0.5'
                  }`}
                  aria-label="Gift-Ready Packaging story"
                >
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-[#641623]">
                    <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full drop-shadow-2xs transition-all duration-300">
                      <path
                        d="M 42.19 16.47 A 8 8 0 0 1 42.19 31.53 A 8 8 0 0 1 31.53 42.19 A 8 8 0 0 1 16.47 42.19 A 8 8 0 0 1 5.81 31.53 A 8 8 0 0 1 5.81 16.47 A 8 8 0 0 1 16.47 5.81 A 8 8 0 0 1 31.53 5.81 A 8 8 0 0 1 42.19 16.47 Z"
                        fill={activeBadgeStory === 2 ? '#D6E8EF' : '#FFFDF9'}
                        stroke={activeBadgeStory === 2 ? '#2B6CB0' : '#641623'}
                        strokeWidth={activeBadgeStory === 2 ? '2.2' : '1.6'}
                      />
                    </svg>
                    {/* Icon: Gift box with bow */}
                    <svg
                      className={`relative z-10 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${
                        activeBadgeStory === 2 ? 'scale-110 text-[#2B6CB0]' : 'group-hover:scale-105'
                      }`}
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
                  <span className={`text-[10px] sm:text-xs font-semibold mt-2 leading-tight transition-colors ${
                    activeBadgeStory === 2 ? 'text-[#2B6CB0] font-bold' : 'text-[#641623]'
                  }`}>
                    Gift-Ready<br />Packaging
                  </span>
                  {activeBadgeStory === 2 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B6CB0] mt-1 animate-pulse" />
                  )}
                </button>

                {/* 4. Made by our Dadis */}
                <button
                  type="button"
                  onClick={() => setActiveBadgeStory(activeBadgeStory === 3 ? null : 3)}
                  className={`flex flex-col items-center group cursor-pointer transition-all duration-200 active:scale-95 ${
                    activeBadgeStory === 3 ? '-translate-y-1' : 'hover:-translate-y-0.5'
                  }`}
                  aria-label="Made by our Dadis story"
                >
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-[#641623]">
                    <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full drop-shadow-2xs transition-all duration-300">
                      <path
                        d="M 42.19 16.47 A 8 8 0 0 1 42.19 31.53 A 8 8 0 0 1 31.53 42.19 A 8 8 0 0 1 16.47 42.19 A 8 8 0 0 1 16.47 5.81 A 8 8 0 0 1 31.53 5.81 A 8 8 0 0 1 42.19 16.47 Z"
                        fill={activeBadgeStory === 3 ? '#E3F5E1' : '#FFFDF9'}
                        stroke={activeBadgeStory === 3 ? '#236E38' : '#641623'}
                        strokeWidth={activeBadgeStory === 3 ? '2.2' : '1.6'}
                      />
                    </svg>
                    {/* Icon: Leaf */}
                    <svg
                      className={`relative z-10 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${
                        activeBadgeStory === 3 ? 'scale-110 text-[#236E38]' : 'group-hover:scale-105'
                      }`}
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
                  <span className={`text-[10px] sm:text-xs font-semibold mt-2 leading-tight transition-colors ${
                    activeBadgeStory === 3 ? 'text-[#236E38] font-bold' : 'text-[#641623]'
                  }`}>
                    Made by<br />our Dadis
                  </span>
                  {activeBadgeStory === 3 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#236E38] mt-1 animate-pulse" />
                  )}
                </button>
              </div>

              {/* Dynamic Interactive Story Drawer */}
              {activeBadgeStory !== null && (
                <div className="mt-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#FFFDF9] border border-[#641623]/15 shadow-sm transition-all duration-300 relative text-left">
                  <button
                    onClick={() => setActiveBadgeStory(null)}
                    type="button"
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#641623]/5 hover:bg-[#641623]/10 text-[#641623] flex items-center justify-center text-xs font-bold cursor-pointer"
                    aria-label="Close story drawer"
                  >
                    ✕
                  </button>

                  {/* Story 0: Handmade with Love */}
                  {activeBadgeStory === 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <DaisyIcon className="w-4 h-4 flex-shrink-0" />
                        <h4 className="font-['Fredoka'] font-bold text-sm text-[#641623]">
                          100% Stitched Knot-by-Knot with Milk-Cotton Yarn
                        </h4>
                      </div>
                      <p className="text-xs text-[#2D2424]/85 leading-relaxed">
                        Every single flower petal, stem, and leaf in <span className="font-semibold text-[#641623]">{product.name}</span> is woven stitch-by-stitch by experienced artisans in Surat. We never use machine shortcuts or cheap plastics — just pure, tactile crochet art that takes an average of <strong>4.5 hours</strong> of patient craftsmanship.
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2.5 text-[11px] font-semibold text-[#641623]">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FCE2EB] border border-[#641623]/10">
                          <ClockIcon className="w-3 h-3" /> 4.5 Hours Handcrafting
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FCE2EB] border border-[#641623]/10">
                          <CrochetHookIcon className="w-3 h-3" /> Tight Double-Loop Stitch
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FCE2EB] border border-[#641623]/10">
                          <LeafIcon className="w-3 h-3" /> Zero Machine Production
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Story 1: Soft & Long-lasting */}
                  {activeBadgeStory === 1 && (
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <SparkleIcon className="w-4 h-4 flex-shrink-0" />
                        <h4 className="font-['Fredoka'] font-bold text-sm text-[#641623]">
                          Everlasting Keepsake vs Fresh Cut Flowers
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#FFF5F5] border border-red-200">
                          <p className="font-bold text-red-700 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                            <WiltedFlowerIcon className="w-3.5 h-3.5 flex-shrink-0" /> Fresh Bouquets
                          </p>
                          <p className="text-[#2D2424]/80 text-[11px] leading-snug">
                            Wilts in 3-4 days, water turns murky, leaves a mess, and ends up in the bin.
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FCF7D1]/70 border border-[#C99814]/30">
                          <p className="font-bold text-[#8C6B0D] text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                            <DaisyIcon className="w-3.5 h-3.5 flex-shrink-0" /> Knots & Co Keepsake
                          </p>
                          <p className="text-[#2D2424]/90 text-[11px] leading-snug">
                            Stays vibrant for 5+ years, 100% dust-resistant, zero watering, treasured forever!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Story 2: Gift-Ready Packaging */}
                  {activeBadgeStory === 2 && (
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <GiftBoxIcon className="w-4 h-4 flex-shrink-0" />
                        <h4 className="font-['Fredoka'] font-bold text-sm text-[#641623]">
                          Delightful Unboxing & Secret Gifting Ready
                        </h4>
                      </div>
                      <p className="text-xs text-[#2D2424]/85 leading-relaxed">
                        Each bouquet arrives packed in our custom sturdy pastel gift box with soft floral tissue wrapping, satin ribbon bow, and <strong>zero price tags or invoice inside</strong> — making it 100% ready to surprise your loved ones!
                      </p>
                      <button
                        onClick={() => {
                          setIsGiftNoteOpen(true);
                          setActiveBadgeStory(null);
                        }}
                        type="button"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#2B6CB0] underline cursor-pointer hover:text-[#1A4971]"
                      >
                        <LoveLetterIcon className="w-3.5 h-3.5 flex-shrink-0" /> Add a complimentary handwritten card below ↓
                      </button>
                    </div>
                  )}

                  {/* Story 3: Made by our Dadis */}
                  {activeBadgeStory === 3 && (
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <DaadiIcon className="w-4 h-4 flex-shrink-0" />
                        <h4 className="font-['Fredoka'] font-bold text-sm text-[#641623]">
                          Empowering 200+ Surat Daadis & Women Artisans
                        </h4>
                      </div>
                      <p className="text-xs text-[#2D2424]/85 leading-relaxed">
                        Knots & Co was founded to give elderly grandmothers and homemakers in Surat a platform to earn fair, independent incomes from the comfort of their homes. Your purchase directly supports their families and keeps traditional crochet alive.
                      </p>
                      <p className="text-[11px] italic text-[#641623] mt-2 font-medium">
                        "When you receive Knots & Co, you hold a grandmother's blessings in your hands ♡"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Interactive "Personalize Your Gift" Complimentary Card Box */}
            <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#FFF9F5] to-[#FCEEF3] border border-[#641623]/15 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FCE2EB] border border-[#641623]/15 flex items-center justify-center flex-shrink-0">
                    <LoveLetterIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-['Fredoka'] font-bold text-sm text-[#641623]">
                      Complimentary Handwritten Gift Card
                    </p>
                    <p className="text-[11px] text-[#641623]/70">
                      Personalize a handwritten note for your box (Free ₹0)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGiftNoteOpen(!isGiftNoteOpen)}
                  className="px-3 py-1.5 rounded-full bg-[#FFE9A7] hover:bg-[#FDD874] active:scale-95 text-[#641623] font-['Fredoka'] font-bold text-xs cursor-pointer border border-[#641623]/15 shadow-2xs transition-all"
                >
                  {isGiftNoteOpen ? 'Close Note ✕' : giftRecipient || giftMessage ? 'Edit Note ✎' : '+ Add Note'}
                </button>
              </div>

              {/* Collapsible Card Creator */}
              {isGiftNoteOpen && (
                <div className="mt-3.5 pt-3 border-t border-[#641623]/10 space-y-3">
                  {/* Quick preset chips */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold text-[#641623]/60 uppercase tracking-wider self-center">
                      Quick ideas:
                    </span>
                    {[
                      'Happy Birthday! ♡',
                      'Forever grateful for you ♡',
                      'Happy Anniversary! ♡',
                      'You make every day brighter ♡',
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setGiftMessage(chip)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-[#641623] border border-[#641623]/15 cursor-pointer transition-all active:scale-95"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#641623]/70 mb-1">
                        To (Recipient Name)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ananya / Mumma"
                        value={giftRecipient}
                        onChange={(e) => setGiftRecipient(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#641623]/20 text-[#641623] placeholder-[#641623]/40 focus:outline-none focus:ring-1 focus:ring-[#641623]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#641623]/70 mb-1">
                        From (Your Name)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rohan"
                        value={giftSender}
                        onChange={(e) => setGiftSender(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#641623]/20 text-[#641623] placeholder-[#641623]/40 focus:outline-none focus:ring-1 focus:ring-[#641623]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#641623]/70 mb-1">
                      Your Heartfelt Message
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Wishing you a year as everlasting and beautiful as these flowers! Lots of love ♡"
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#641623]/20 text-[#641623] placeholder-[#641623]/40 focus:outline-none focus:ring-1 focus:ring-[#641623] text-xs resize-none"
                    />
                  </div>

                  {/* Real-time Vintage Postcard Live Preview */}
                  <div className="p-3.5 rounded-xl bg-[#FAF3E8] border border-dashed border-[#641623]/30 shadow-inner relative text-left">
                    <div className="flex justify-between items-start mb-2 border-b border-[#641623]/10 pb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#641623]/60">
                        POSTCARD LIVE PREVIEW
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#641623]/10 text-[#641623]">
                        SURAT ARTISAN COURIER
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#641623] italic">
                      Dearest {giftRecipient || '[Recipient Name]'},
                    </p>
                    <p className="text-xs text-[#2D2424] my-2 leading-relaxed italic">
                      "{giftMessage || 'Your message will be lovingly handwritten with archival ink on this vintage card...'}"
                    </p>
                    <p className="text-right text-xs font-semibold text-[#641623] italic">
                      — With love, {giftSender || '[Your Name]'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-[#641623]/70">
                      Written with dip fountain ink on recycled seed paper.
                    </p>
                    <button
                      type="button"
                      onClick={handleSaveGiftNote}
                      className="px-4 py-1.5 rounded-full bg-[#641623] hover:bg-[#7D1D2E] text-[#FFFDF9] font-['Fredoka'] font-bold text-xs cursor-pointer active:scale-95 transition-all shadow-2xs"
                    >
                      {giftNoteSaved ? '✓ Card Saved!' : 'Save Note ♡'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cute Wavy Ribbon Divider */}
            <div className="w-full flex justify-end mt-4 mb-2 pr-2 pointer-events-none">
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

            {/* 3 Interactive Accordions (Product Details, Care, Shipping) */}
            <div className="space-y-2.5 sm:space-y-3 mt-1">
              {/* 1. Product Details Accordion */}
              <div className="rounded-[18px] sm:rounded-[20px] bg-[#FFF8FA] border border-[#641623]/15 overflow-hidden transition-all shadow-2xs">
                <button
                  onClick={() => toggleAccordion('details')}
                  type="button"
                  aria-expanded={openAccordions.details}
                  className="w-full py-3 sm:py-3.5 px-4 sm:px-5 flex items-center justify-between text-[#641623] font-['Fredoka'] font-bold text-sm sm:text-base cursor-pointer hover:bg-[#FCEEF3] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#FCE2EB] flex items-center justify-center">
                      <DaisyIcon className="w-3.5 h-3.5" />
                    </span>
                    <span>Product Details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-[#FCE2EB] text-[#641623] font-medium">
                      100% Milk Cotton
                    </span>
                    <svg
                      className={`w-4 h-4 text-[#641623] transition-transform duration-200 ${
                        openAccordions.details ? 'rotate-180' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>
                {openAccordions.details && (
                  <div className="px-4 sm:px-5 pb-4 pt-2 text-xs sm:text-[13px] text-[#2D2424]/85 leading-relaxed space-y-3 border-t border-[#641623]/10">
                    {/* Visual Specs Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-[#641623]/10">
                        <p className="font-bold text-[#641623] text-[10px] uppercase tracking-wider">Height & Spread</p>
                        <p className="text-[#2D2424]">Approx. 38cm (15") tall</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#641623]/10">
                        <p className="font-bold text-[#641623] text-[10px] uppercase tracking-wider">Yarn Grade</p>
                        <p className="text-[#2D2424]">5-Ply Combed Milk Cotton</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#641623]/10">
                        <p className="font-bold text-[#641623] text-[10px] uppercase tracking-wider">Internal Core</p>
                        <p className="text-[#2D2424]">Flexible Bendable Stem</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#641623]/10">
                        <p className="font-bold text-[#641623] text-[10px] uppercase tracking-wider">Weight</p>
                        <p className="text-[#2D2424]">Ultra-light ~240g</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-['Fredoka'] font-bold text-xs text-[#641623] uppercase tracking-wider mb-1.5">
                        What's Included in Your Package:
                      </p>
                      <ul className="space-y-1.5 text-xs text-[#2D2424]">
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3.5 h-3.5 flex-shrink-0" /> Handcrafted crochet bouquet wrapped in florist paper
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3.5 h-3.5 flex-shrink-0" /> Elegant satin ribbon bow
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3.5 h-3.5 flex-shrink-0" /> Sturdy protective gift transport box
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3.5 h-3.5 flex-shrink-0" /> Complimentary handwritten greeting card (custom message)
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Care Instructions Accordion */}
              <div className="rounded-[18px] sm:rounded-[20px] bg-[#FFF8FA] border border-[#641623]/15 overflow-hidden transition-all shadow-2xs">
                <button
                  onClick={() => toggleAccordion('care')}
                  type="button"
                  aria-expanded={openAccordions.care}
                  className="w-full py-3 sm:py-3.5 px-4 sm:px-5 flex items-center justify-between text-[#641623] font-['Fredoka'] font-bold text-sm sm:text-base cursor-pointer hover:bg-[#FCEEF3] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#FCF7D1] flex items-center justify-center">
                      <FeatherDusterIcon className="w-3.5 h-3.5" />
                    </span>
                    <span>Care Instructions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-[#FCF7D1] text-[#8C6B0D] font-medium">
                      Zero Water Needed
                    </span>
                    <svg
                      className={`w-4 h-4 text-[#641623] transition-transform duration-200 ${
                        openAccordions.care ? 'rotate-180' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>
                {openAccordions.care && (
                  <div className="px-4 sm:px-5 pb-4 pt-2 text-xs sm:text-[13px] text-[#2D2424]/85 leading-relaxed space-y-2.5 border-t border-[#641623]/10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-white border border-[#641623]/10">
                        <FeatherDusterIcon className="w-4 h-4 mb-1.5" />
                        <p className="font-bold text-[#641623] text-xs">1. Monthly Dusting</p>
                        <p className="text-[11px] text-[#2D2424]/80 mt-0.5">
                          Use a soft makeup brush or blowdryer on cool setting to keep dust away.
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#641623]/10">
                        <DropletIcon className="w-4 h-4 mb-1.5" />
                        <p className="font-bold text-[#641623] text-xs">2. Spot Dab Only</p>
                        <p className="text-[11px] text-[#2D2424]/80 mt-0.5">
                          If stained, gently dab with a slightly damp cloth. Never submerge or machine wash!
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#641623]/10">
                        <SunIcon className="w-4 h-4 mb-1.5" />
                        <p className="font-bold text-[#641623] text-xs">3. Room Display</p>
                        <p className="text-[11px] text-[#2D2424]/80 mt-0.5">
                          Display in any vase or on your desk. Keep away from direct open flames.
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#641623] italic font-medium bg-[#FFF9ED] p-2 rounded-lg border border-[#C99814]/20 flex items-center gap-1.5">
                      <SparkleIcon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Colorfast Milk-Cotton: Will retain 100% of its vibrant tones for years without fading.</span>
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Shipping & Returns Accordion with Live Pincode Estimator */}
              <div className="rounded-[18px] sm:rounded-[20px] bg-[#FFF8FA] border border-[#641623]/15 overflow-hidden transition-all shadow-2xs">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  type="button"
                  aria-expanded={openAccordions.shipping}
                  className="w-full py-3 sm:py-3.5 px-4 sm:px-5 flex items-center justify-between text-[#641623] font-['Fredoka'] font-bold text-sm sm:text-base cursor-pointer hover:bg-[#FCEEF3] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#D6E8EF] flex items-center justify-center">
                      <DeliveryTruckIcon className="w-3.5 h-3.5" />
                    </span>
                    <span>Shipping & Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-[#D6E8EF] text-[#2B6CB0] font-medium">
                      Free Above ₹1,999
                    </span>
                    <svg
                      className={`w-4 h-4 text-[#641623] transition-transform duration-200 ${
                        openAccordions.shipping ? 'rotate-180' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>
                {openAccordions.shipping && (
                  <div className="px-4 sm:px-5 pb-4 pt-2 text-xs sm:text-[13px] text-[#2D2424]/85 leading-relaxed space-y-3 border-t border-[#641623]/10">
                    {/* Live Pincode Delivery Estimator */}
                    <div className="p-3 rounded-xl bg-white border border-[#641623]/15">
                      <p className="font-['Fredoka'] font-bold text-xs text-[#641623] uppercase tracking-wider mb-1.5">
                        Check Estimated Delivery Date:
                      </p>
                      <form onSubmit={handleCheckPincode} className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit Pincode (e.g. 400001)"
                          value={pincodeInput}
                          onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-[#641623]/25 text-xs text-[#641623] placeholder-[#641623]/40 focus:outline-none focus:ring-1 focus:ring-[#641623]"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 rounded-lg bg-[#641623] hover:bg-[#7D1D2E] text-white font-['Fredoka'] font-bold text-xs cursor-pointer active:scale-95 transition-all"
                        >
                          {pincodeStatus === 'checking' ? 'Checking...' : 'Check'}
                        </button>
                      </form>

                      {pincodeStatus === 'success' && pincodeDetails && (
                        <div className="mt-2.5 p-2 rounded-lg bg-[#E3F5E1] border border-[#236E38]/30 text-xs text-[#236E38]">
                          <p className="font-bold flex items-center gap-1.5">
                            <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                            <span>Express Courier Available to {pincodeDetails.zone}!</span>
                          </p>
                          <p className="text-[11px] text-[#2D2424] mt-0.5">
                            Estimated delivery by <strong>{pincodeDetails.deliveryDate}</strong> with live tracking. Free shipping on orders above ₹1,999!
                          </p>
                        </div>
                      )}

                      {pincodeStatus === 'error' && (
                        <p className="mt-2 text-[11px] text-red-600 font-medium">
                          Please enter a valid 6-digit Indian pincode.
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-[#2D2424]">
                      <p>
                        • <strong>Dispatch Window:</strong> Dispatches within 24 to 48 hours directly from our Surat studio.
                      </p>
                      <p>
                        • <strong>Live Tracking:</strong> Real-time SMS & WhatsApp updates with courier tracking link.
                      </p>
                      <p>
                        • <strong>100% Safe Transit Guarantee:</strong> In the rare event of transit damage, we send an immediate free replacement!
                      </p>
                    </div>
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
          4. "YOU MIGHT ALSO LIKE" SECTION
          Matches BestsellersSection & ShopTheOccasionSection card scale:
          Big, bold, tall aspect-[3/4] sm:aspect-[4/5.1] cards, 72vw on mobile with
          peeking second card, crisp border, scalloped badge, quick add to cart, and
          heartwarming Knots & Co vector decorations.
         ========================================================================= */}
      <section className="relative w-full max-w-[1340px] mx-auto px-4 sm:px-8 lg:px-10 pt-8 sm:pt-12 pb-16 sm:pb-24 overflow-x-clip">
        {/* Section Heading: ♥ You might also like ♥ */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mb-6 sm:mb-8 text-[#641623]">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-[#641623] flex-shrink-0" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <h2 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#641623]">
            You might also like
          </h2>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-[#641623] flex-shrink-0" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Carousel Container with Left/Right Arrow Buttons (Desktop) */}
        <div className="relative w-full">
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={handleCarouselPrev}
            aria-label="Previous products"
            className="hidden sm:flex absolute -left-2 sm:-left-3 lg:-left-5 top-[38%] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[1.8px] sm:border-2 border-[#2D2424] bg-[#FAF4ED] text-[#2D2424] items-center justify-center hover:bg-[#2D2424] hover:text-white transition-all shadow-md focus:outline-none cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Scrollable Track / Grid (Matches Bestsellers & Occasion scale) */}
          <div
            ref={carouselTrackRef}
            onScroll={handleRecommendedScroll}
            className="w-full flex items-stretch justify-start gap-3.5 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar py-3 px-1 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recommendedBouquets.map((item, idx) => {
              const isItemWishlist = !!wishlistMap[item.id];
              const badge = RECOMMENDED_BADGES[idx % RECOMMENDED_BADGES.length];

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
                  className="group w-[72vw] max-w-[310px] sm:max-w-none flex-shrink-0 sm:w-[270px] md:w-[285px] lg:w-[calc(25%-15px)] cursor-pointer flex flex-col items-start justify-between snap-start relative z-10"
                >
                  {/* 1. Tall Rounded Image Box with Crisp Border & Aspect Ratio matching Bestsellers */}
                  <div className="relative w-full aspect-[3/4] sm:aspect-[4/5.1] rounded-[20px] sm:rounded-[28px] overflow-hidden border-[1.8px] sm:border-2 border-[#2D2424] bg-white shadow-sm transition-all duration-300">
                    {/* Cute Knotsnco Decorative Pop-in Element on Hover */}
                    <div
                      className="absolute top-2.5 left-2.5 z-20 pointer-events-none transition-all duration-300 ease-out transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:rotate-12"
                      aria-hidden="true"
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FFF5CC] border border-[#811B2B]/20 shadow-sm flex items-center justify-center p-1">
                        <svg viewBox="0 0 24 24" className="w-full h-full text-[#811B2B]">
                          <circle cx="12" cy="7" r="3" fill="currentColor" opacity="0.9" />
                          <circle cx="16.5" cy="10" r="3" fill="currentColor" opacity="0.9" />
                          <circle cx="15" cy="15.5" r="3" fill="currentColor" opacity="0.9" />
                          <circle cx="9" cy="15.5" r="3" fill="currentColor" opacity="0.9" />
                          <circle cx="7.5" cy="10" r="3" fill="currentColor" opacity="0.9" />
                          <circle cx="12" cy="12" r="2.8" fill="#F5D76E" stroke="#811B2B" strokeWidth="1" />
                        </svg>
                      </div>
                    </div>

                    {/* Animated Image Wrapper: 1.04 scale, lift, 2-deg rotation */}
                    <div className="w-full h-full relative transition-transform duration-500 ease-out group-hover:scale-[1.04] group-hover:-translate-y-1.5 group-hover:rotate-[2deg] motion-reduce:transform-none">
                      {item.image || (item.images && item.images[0]) ? (
                        <>
                          <img
                            src={optimizeShopifyUrl(item.image || (item.images && item.images[0]), 500)}
                            alt={item.name}
                            className={`w-full h-full object-cover select-none absolute inset-0 block transition-opacity duration-350 ease-in-out ${
                              item.images && item.images.length > 1 && item.images[1] !== (item.image || item.images[0])
                                ? 'group-hover:opacity-0'
                                : ''
                            }`}
                            loading="lazy"
                            decoding="async"
                          />
                          {item.images && item.images.length > 1 && item.images[1] !== (item.image || item.images[0]) && (
                            <img
                              src={optimizeShopifyUrl(item.images[1], 500)}
                              alt={`${item.name} alternate view`}
                              className="w-full h-full object-cover select-none absolute inset-0 block opacity-0 transition-opacity duration-350 ease-in-out group-hover:opacity-100"
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#641623]/40 bg-[#FAF4ED]">
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Scalloped Daisy Flower Badge in Top Right */}
                    <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none drop-shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <svg viewBox="0 0 50 50" className="w-10 h-10 sm:w-11 sm:h-11">
                        <g fill={badge.bgColor} stroke="#2D2424" strokeWidth="2.2">
                          <circle cx="25" cy="14" r="9.5" />
                          <circle cx="35.5" cy="21.6" r="9.5" />
                          <circle cx="31.5" cy="34" r="9.5" />
                          <circle cx="18.5" cy="34" r="9.5" />
                          <circle cx="14.5" cy="21.6" r="9.5" />
                        </g>
                        <circle cx="25" cy="25" r="12.5" fill={badge.bgColor} />
                        <text
                          x="25"
                          y="22.5"
                          textAnchor="middle"
                          fontSize="6.5"
                          fontWeight="800"
                          fill="#2D2424"
                          fontFamily="Fredoka, sans-serif"
                          letterSpacing="0.02em"
                        >
                          {badge.line1}
                        </text>
                        <text
                          x="25"
                          y="30.5"
                          textAnchor="middle"
                          fontSize="6.5"
                          fontWeight="800"
                          fill="#2D2424"
                          fontFamily="Fredoka, sans-serif"
                          letterSpacing="0.02em"
                        >
                          {badge.line2}
                        </text>
                      </svg>
                    </div>

                    {/* Slide-Up Pill Button ("ADD TO CART") on Hover */}
                    <div className="absolute bottom-3 sm:bottom-3.5 left-0 right-0 z-20 flex items-center justify-center px-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart?.(item, 1);
                          setAddedRecommendedId(item.id);
                          setTimeout(() => setAddedRecommendedId(null), 1800);
                        }}
                        className={`w-full py-2.5 px-4 font-['Fredoka'] font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-lg transition-all duration-300 ease-out hover:scale-102 active:scale-95 cursor-pointer text-center ${
                          addedRecommendedId === item.id
                            ? 'bg-[#7FE5BD] text-[#2D2424]'
                            : 'bg-[#2D2424] text-white hover:bg-[#641623]'
                        } opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto`}
                      >
                        {addedRecommendedId === item.id ? 'ADDED! ♡' : 'ADD TO CART'}
                      </button>
                    </div>
                  </div>

                  {/* 2. Product Information Below Image (Left-Aligned + Price + Wishlist Heart) */}
                  <div className="w-full mt-3 px-1 flex flex-col items-start text-left">
                    {/* Title */}
                    <h3 className="font-['Fredoka'] font-bold text-sm sm:text-[15px] text-[#2D2424] leading-snug line-clamp-2 group-hover:text-[#641623] transition-colors">
                      {item.name}
                    </h3>

                    {/* Price & Wishlist Row */}
                    <div className="mt-1.5 flex items-center justify-between w-full">
                      <span className="font-['Fredoka'] font-bold text-sm sm:text-base text-[#2D2424]">
                        Rs. {item.price.toLocaleString('en-IN')}
                      </span>
                      {/* Wishlist Heart Icon */}
                      <button
                        type="button"
                        onClick={(e) => toggleCardWishlist(item.id, e)}
                        className="text-[#2D2424] hover:text-[#641623] transition-colors focus:outline-none cursor-pointer"
                        aria-label={isItemWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        {isItemWishlist ? (
                          <svg className="w-4 h-4 text-[#641623] fill-current" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Mobile Quick Add to Cart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart?.(item, 1);
                        setAddedRecommendedId(item.id);
                        setTimeout(() => setAddedRecommendedId(null), 1800);
                      }}
                      className={`sm:hidden w-full mt-2.5 py-2 px-4 font-['Fredoka'] font-bold text-xs tracking-wider uppercase rounded-full border border-[#2D2424] shadow-2xs active:scale-95 transition-all cursor-pointer text-center ${
                        addedRecommendedId === item.id
                          ? 'bg-[#7FE5BD] text-[#2D2424]'
                          : 'bg-[#2D2424] text-white'
                      }`}
                    >
                      {addedRecommendedId === item.id ? 'ADDED! ♡' : 'ADD TO CART'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleCarouselNext}
            aria-label="Next products"
            className="hidden sm:flex absolute -right-2 sm:-right-3 lg:-right-5 top-[38%] -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[1.8px] sm:border-2 border-[#2D2424] bg-[#FAF4ED] text-[#2D2424] items-center justify-center hover:bg-[#2D2424] hover:text-white transition-all shadow-md focus:outline-none cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Mobile Dot Pagination Indicator */}
        <div className="flex sm:hidden items-center justify-center gap-2 mt-5">
          {recommendedBouquets.slice(0, 6).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (carouselTrackRef.current) {
                  const target = carouselTrackRef.current.children[idx] as HTMLElement;
                  if (target) {
                    carouselTrackRef.current.scrollTo({
                      left: target.offsetLeft - 16,
                      behavior: 'smooth',
                    });
                  }
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                recommendedActiveDot === idx ? 'w-6 bg-[#641623]' : 'w-2 bg-[#641623]/25'
              }`}
              aria-label={`Go to product ${idx + 1}`}
            />
          ))}
        </div>

        {/* Bottom Left Handcrafted Flower Illustration (Pure Vector SVG) */}
        <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 pointer-events-none select-none z-0">
          <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-2xs" fill="none">
            {/* Stem */}
            <path d="M 90,105 Q 98,122 102,136" stroke="#381A1F" strokeWidth="2.2" strokeLinecap="round" />
            
            {/* Top Left Leaf */}
            <g stroke="#381A1F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 42,48 C 22,32 16,14 30,8 C 44,12 48,28 46,45 Z" fill="#6E8E34" />
              <path d="M 30,12 L 44,45" />
              <path d="M 34,20 L 28,17" />
              <path d="M 38,28 L 32,25" />
              <path d="M 41,35 L 36,33" />
              <path d="M 35,22 L 40,24" />
              <path d="M 39,30 L 43,33" />
            </g>

            {/* Right Leaf */}
            <g stroke="#381A1F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 82,78 C 104,70 120,78 116,92 C 102,104 88,96 76,86 Z" fill="#6E8E34" />
              <path d="M 82,82 L 112,88" />
              <path d="M 90,83 L 95,78" />
              <path d="M 98,85 L 102,81" />
              <path d="M 92,84 L 90,90" />
              <path d="M 100,86 L 97,93" />
            </g>

            {/* 6 Petals (Yellow #F9D35A) */}
            <g stroke="#381A1F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {/* Top-Left */}
              <path d="M 58,68 C 42,56 30,42 42,28 C 54,16 68,30 62,54 Z" fill="#F9D35A" />
              {/* Top-Right */}
              <path d="M 62,54 C 74,32 88,24 96,36 C 104,48 90,64 74,68 Z" fill="#F9D35A" />
              {/* Right */}
              <path d="M 74,68 C 96,66 110,74 104,90 C 98,104 78,98 68,82 Z" fill="#F9D35A" />
              {/* Bottom-Right */}
              <path d="M 68,82 C 70,104 60,118 44,116 C 30,112 38,94 48,80 Z" fill="#F9D35A" />
              {/* Bottom-Left */}
              <path d="M 48,80 C 30,94 14,88 14,72 C 14,58 32,60 48,68 Z" fill="#F9D35A" />
              {/* Left */}
              <path d="M 48,68 C 28,62 20,44 32,34 C 44,24 54,42 58,68 Z" fill="#F9D35A" />
            </g>

            {/* Petal stitch details */}
            <g stroke="#381A1F" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2.5 2.5" opacity="0.6">
              <line x1="46" y1="30" x2="54" y2="54" />
              <line x1="84" y1="38" x2="68" y2="58" />
              <line x1="94" y1="84" x2="72" y2="76" />
              <line x1="50" y1="104" x2="56" y2="80" />
              <line x1="22" y1="72" x2="46" y2="72" />
              <line x1="30" y1="44" x2="50" y2="60" />
            </g>

            {/* Pink Ring Core */}
            <circle cx="58" cy="72" r="16" fill="#DE637E" stroke="#381A1F" strokeWidth="2.2" />
            {/* Center Cream Glow Core */}
            <circle cx="58" cy="72" r="8.5" fill="#FFF5DF" stroke="#381A1F" strokeWidth="1.6" />
            <circle cx="58" cy="72" r="4.5" fill="#FFE699" />
          </svg>
        </div>

        {/* Bottom Right Pink Yarn Ball with Heart Thread (Pure Vector SVG) */}
        <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-4 w-28 sm:w-40 md:w-44 h-14 sm:h-16 md:h-20 pointer-events-none select-none z-0 flex items-end justify-end">
          <svg viewBox="0 0 220 90" className="w-full h-full drop-shadow-2xs" fill="none">
            {/* Dainty Continuous Heart Trail matching ref */}
            <path
              d="M 10,64 C 40,68 62,68 82,60 C 88,54 94,44 98,38 C 102,32 96,26 90,30 C 86,33 85,38 84,41 C 83,38 82,33 78,30 C 72,26 66,32 70,38 C 74,44 80,54 86,60 C 98,68 126,72 158,62"
              stroke="#DE637E"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Yarn Ball at (182, 45) r=28 */}
            <g transform="translate(182, 45)">
              <circle cx="0" cy="0" r="28" fill="#DE637E" stroke="#381A1F" strokeWidth="2.5" />

              {/* Center Diagonal Band */}
              <path d="M -12,-24 C 0,-6 12,12 22,18" stroke="#381A1F" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M -20,-18 C -5,2 5,20 14,24" stroke="#381A1F" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M -16,-21 C -3,-2 9,16 18,21" stroke="#F896AC" strokeWidth="1.8" strokeLinecap="round" />

              {/* Left Winding Strands */}
              <path d="M -27,-5 C -14,-10 -7,-3 -3,5" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
              <path d="M -26,7 C -16,5 -9,12 -3,21" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
              <path d="M -17,21 C -10,24 -3,24 4,24" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />

              {/* Right Winding Strands */}
              <path d="M 4,-27 C 12,-19 21,-12 26,-2" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
              <path d="M 9,-17 C 16,-10 21,-3 25,9" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />
              <path d="M 16,2 C 21,9 23,16 21,21" stroke="#381A1F" strokeWidth="2.0" strokeLinecap="round" />

              {/* Highlight accents */}
              <path d="M -22,-2 C -14,-5 -8,0 -5,7" stroke="#F896AC" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M 7,-23 C 14,-16 19,-9 23,2" stroke="#F896AC" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </section>
    </article>
  );
};
