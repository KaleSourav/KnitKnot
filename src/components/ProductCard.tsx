import React, { useState } from 'react';
import { Plus, Check, Heart } from 'lucide-react';
import { ShopProduct } from '../data/allProductsData';

export interface ProductCardProps {
  product: ShopProduct;
  isLiked?: boolean;
  onProductClick?: (productId: string) => void;
  onAddToCart?: (product: ShopProduct) => void;
  onToggleWishlist?: (productId: string, e: React.MouseEvent) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isLiked = false,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  className = '',
}) => {
  const [isJustAdded, setIsJustAdded] = useState(false);
  const [isHeartPopping, setIsHeartPopping] = useState(false);

  // Identify primary and secondary images
  const primaryImage = product.image || (product.images && product.images[0]) || '';
  const secondaryImage =
    product.images &&
    product.images.length > 1 &&
    product.images[1] &&
    product.images[1] !== primaryImage
      ? product.images[1]
      : null;
  const hasSecondaryImage = Boolean(secondaryImage);

  // Quick Add click handler with instant visual feedback
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid card click navigation
    if (onAddToCart) {
      onAddToCart(product);
      setIsJustAdded(true);
      setTimeout(() => {
        setIsJustAdded(false);
      }, 1600);
    }
  };

  // Wishlist click handler with spring bounce pop
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHeartPopping(true);
    setTimeout(() => setIsHeartPopping(false), 400);
    if (onToggleWishlist) {
      onToggleWishlist(product.id, e);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onProductClick?.(product.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onProductClick?.(product.id);
        }
      }}
      className={`group relative rounded-[20px] bg-[#FFFBF7] border border-[#811B2B]/10 shadow-[0_4px_16px_rgba(129,27,43,0.04)] hover:shadow-[0_14px_32px_rgba(129,27,43,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer select-none active:scale-[0.99] ${className}`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF2E8]/60">
        {/* Scalloped Yellow Discount / NEW Badge */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <div className="relative inline-flex items-center justify-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#FFE485] border border-dashed border-[#B45309] text-[#78350F] text-[10px] sm:text-xs font-bold shadow-xs">
              <span className="tracking-tight">{product.badge}</span>
            </div>
          </div>
        )}

        {/* Cute Knotsnco Decorative Pop-in Element on Hover (Tiny Crochet Flower) */}
        <div
          className={`absolute z-15 pointer-events-none transition-all duration-300 ease-out transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:rotate-12 ${
            product.badge ? 'bottom-2.5 left-2.5 sm:bottom-3 sm:left-3' : 'top-2.5 left-2.5 sm:top-3 sm:left-3'
          }`}
          aria-hidden="true"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FFF5CC] border border-[#811B2B]/20 shadow-sm flex items-center justify-center p-1">
            <svg viewBox="0 0 24 24" className="w-full h-full text-[#811B2B]">
              {/* Crochet 5-petal flower with stitched center */}
              <circle cx="12" cy="7" r="3" fill="currentColor" opacity="0.9" />
              <circle cx="16.5" cy="10" r="3" fill="currentColor" opacity="0.9" />
              <circle cx="15" cy="15.5" r="3" fill="currentColor" opacity="0.9" />
              <circle cx="9" cy="15.5" r="3" fill="currentColor" opacity="0.9" />
              <circle cx="7.5" cy="10" r="3" fill="currentColor" opacity="0.9" />
              <circle cx="12" cy="12" r="2.8" fill="#F5D76E" stroke="#811B2B" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Top Right Circular Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          type="button"
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          className="group/heart absolute top-2.5 right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#811B2B]/10 text-[#811B2B] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#811B2B]/30"
        >
          <span
            className={`transition-transform duration-300 ${
              isHeartPopping ? 'scale-130' : 'scale-100'
            }`}
          >
            {isLiked ? (
              <Heart className="w-4 h-4 fill-[#811B2B] text-[#811B2B]" />
            ) : (
              <Heart className="w-4 h-4 text-[#811B2B] stroke-[2.2]" />
            )}
          </span>
        </button>

        {/* Animated Product Image Container: Smooth 1.04 Scale, Lift Upwards, and 2-deg Rotation */}
        <div className="w-full h-full relative transition-transform duration-500 ease-out group-hover:scale-[1.04] group-hover:-translate-y-1.5 group-hover:rotate-[2deg] motion-reduce:transform-none">
          {primaryImage ? (
            <>
              {/* Primary Image */}
              <img
                src={primaryImage}
                alt={product.name}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className={`w-full h-full object-cover select-none absolute inset-0 block transition-opacity duration-350 ease-in-out ${
                  hasSecondaryImage ? 'group-hover:opacity-0' : ''
                }`}
              />

              {/* Secondary Product Image (Smooth 350ms Fade-in on Hover) */}
              {hasSecondaryImage && (
                <img
                  src={secondaryImage!}
                  alt={`${product.name} alternate view`}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover select-none absolute inset-0 block opacity-0 transition-opacity duration-350 ease-in-out group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full bg-[#FAF4ED]" />
          )}
        </div>

        {/* Desktop Quick Add Button: Slides smoothly upwards into bottom of image */}
        <div className="hidden sm:block absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Quick add ${product.name} to cart`}
            className={`w-full py-2 px-3 rounded-full font-['Fredoka'] font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all duration-300 ease-out cursor-pointer pointer-events-auto transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 active:scale-95 focus:opacity-100 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#811B2B]/40 ${
              isJustAdded
                ? 'bg-[#2E7D32] text-white'
                : 'bg-[#811B2B] hover:bg-[#641623] text-[#FFFEF8]'
            }`}
          >
            {isJustAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[2.6] animate-bounce" />
                <span>Added to bag!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.4]" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Quick Add Button: Clean, touch-accessible button without requiring hover */}
        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`Quick add ${product.name} to cart`}
          className={`sm:hidden absolute bottom-2.5 right-2.5 z-20 w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none ${
            isJustAdded
              ? 'bg-[#2E7D32] text-white'
              : 'bg-[#811B2B] text-[#FFFEF8]'
          }`}
        >
          {isJustAdded ? (
            <Check className="w-4 h-4 stroke-[2.6]" />
          ) : (
            <Plus className="w-4 h-4 stroke-[2.4]" />
          )}
        </button>
      </div>

      {/* Bottom Details Container */}
      <div className="p-3 sm:p-4 text-left flex flex-col justify-between flex-1">
        <div>
          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-[#2D2424] group-hover:text-[#811B2B] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Subtitle / Type */}
          <p className="text-[11px] sm:text-xs text-[#811B2B]/70 font-normal mt-0.5 line-clamp-1">
            {product.subtitle}
          </p>

          {/* Color Swatch Dots */}
          {product.colorSwatches && product.colorSwatches.length > 0 && (
            <div className="flex items-center gap-1.5 my-2">
              {product.colorSwatches.map((color, idx) => (
                <span
                  key={idx}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-black/15 shadow-2xs"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap pt-1">
          <span className="text-sm sm:text-base font-bold text-[#811B2B]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          {product.originalPrice && (
            <span className="text-[11px] sm:text-xs text-[#2D2424]/45 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}

          {product.discount && (
            <span className="text-[10px] sm:text-xs font-semibold text-[#2E7D32]">
              {product.discount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
