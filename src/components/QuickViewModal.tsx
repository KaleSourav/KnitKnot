import React from 'react';
import { X, Star, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { Product } from '../data/products';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const originalPrice = product.originalPrice || Math.round(product.price * 1.35);
  const discountPct = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full sm:max-w-3xl max-h-[92svh] sm:max-h-[88vh] overflow-y-auto bg-[#faf4e8] border-t sm:border border-[#841724]/20 rounded-t-[32px] sm:rounded-3xl p-5 sm:p-8 shadow-2xl z-10 text-[#2b0b12] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-250">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#faedd3] hover:bg-[#841724] text-[#841724] hover:text-[#faedd3] border border-[#841724]/20 z-20 cursor-pointer transition-all shadow-xs"
          aria-label="Close quick view"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 items-center pt-2 sm:pt-0">
          {/* IMAGE */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#faf4ec] border border-[#841724]/12 shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#841724] text-[#faedd3] text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {product.badge}
              </span>
            )}
            {discountPct > 0 && (
              <span className="absolute top-3 right-12 sm:right-3 bg-[#841724] text-[#faedd3] text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm border border-[#5c0f19]/30">
                {discountPct}% OFF
              </span>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] sm:text-xs font-extrabold text-[#841724] uppercase tracking-widest bg-[#841724]/10 px-2.5 py-0.5 rounded-full border border-[#841724]/15">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-600 font-bold ml-auto">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{product.rating || 4.8}</span>
                  <span className="text-[#7c5c62] text-[11px]">({product.reviewsCount || 370})</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#1a060a] leading-tight mb-2 font-serif">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl sm:text-3xl font-black text-[#841724]">
                  ₹{product.price}
                </span>
                {originalPrice > product.price && (
                  <span className="text-xs sm:text-sm text-stone-400 line-through font-semibold">
                    ₹{originalPrice}
                  </span>
                )}
                <span className="text-[11px] sm:text-xs text-emerald-700 font-bold ml-2 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Ready to Ship
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#5c3e44] leading-relaxed mb-4 font-medium">
                {product.description}
              </p>

              {/* CRAFT DETAILS */}
              <div className="bg-[#faedd3] rounded-2xl p-3.5 sm:p-4 border border-[#841724]/15 space-y-2 mb-5">
                <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#841724] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Artisan Craftsmanship</span>
                </p>
                <ul className="text-xs text-[#2b0b12] space-y-1.5">
                  {product.details?.slice(0, 4).map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#841724] shrink-0 stroke-[2.5]" />
                      <span className="font-medium">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full bg-[#841724] hover:bg-[#5c0f19] active:scale-98 text-[#faedd3] font-black text-xs sm:text-sm py-3.5 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span>Add to Shopping Bag • ₹{product.price}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

