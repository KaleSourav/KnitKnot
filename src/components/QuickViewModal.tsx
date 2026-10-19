import React from 'react';
import { X, Star, ShoppingBag, Heart, Check, Sparkles } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[#14101c] border border-purple-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-white animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* IMAGE */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-950 border border-white/10">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-pink-300 border border-pink-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.badge}
              </span>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-300 ml-auto">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-stone-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-2">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-extrabold text-[#edd2f7]">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-emerald-400 font-semibold ml-2">
                  In Stock • Ready to Ship
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* CRAFT DETAILS */}
              <div className="bg-black/30 rounded-2xl p-3.5 border border-white/5 space-y-2 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Artisan Specifications</span>
                </p>
                <ul className="text-xs text-stone-300 space-y-1">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-pink-300 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex-1 bg-[#edd2f7] hover:bg-[#e4c2f1] active:scale-95 text-[#4a044e] font-extrabold text-sm py-3 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag • ₹{product.price}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
