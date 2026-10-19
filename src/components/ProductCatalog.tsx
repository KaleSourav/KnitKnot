import React from 'react';
import { Star, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { Product } from '../data/products';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onQuickView,
}) => {
  const filteredProducts = selectedCategory === 'All Products' || selectedCategory === 'Home'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <section 
      id="catalog-section" 
      className="w-full bg-[#fdfcf9] sm:bg-white text-stone-900 py-20 sm:py-28 px-4 sm:px-6 lg:px-12 select-none relative font-['DM_Sans',sans-serif] border-t border-stone-200/50"
    >
      <div className="max-w-[1500px] mx-auto">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-stone-200/60">
          <div>
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs sm:text-sm uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Handmade Collections</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-stone-950 tracking-tight">
              Treasures Stitched With Love
            </h2>
            <p className="text-sm sm:text-base text-stone-600 font-medium mt-2 max-w-2xl leading-relaxed">
              Each piece is painstakingly crocheted by hand using premium combed cotton yarns. Everlasting blooms, snuggly companions, and joyful accessories.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {['All Products', 'Flowers', 'Amigurumi', 'Accessories', 'Clothing', 'Utility'].map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                  selectedCategory === cat || (cat === 'All Products' && selectedCategory === 'Home')
                    ? 'bg-[#edd2f7] text-[#4a044e] border border-purple-300 scale-105'
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-[28px] p-4 border border-stone-200/70 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1.2)] flex flex-col justify-between"
            >
              {/* IMAGE WRAPPER */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-100 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1.2)]"
                  loading="lazy"
                />

                {/* BADGE */}
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#4a044e] border border-purple-200/70 text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {product.badge}
                  </span>
                )}

                {/* QUICK ACTIONS OVERLAY */}
                <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => onQuickView(product)}
                    className="p-3 rounded-full bg-white text-stone-900 hover:bg-[#edd2f7] hover:text-[#4a044e] transition-all transform hover:scale-110 shadow-lg cursor-pointer"
                    title="Quick View"
                    aria-label={`Quick View ${product.name}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="p-3 rounded-full bg-[#edd2f7] text-[#4a044e] hover:bg-white transition-all transform hover:scale-110 shadow-lg cursor-pointer"
                    title="Add to Cart"
                    aria-label={`Add ${product.name} to Cart`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* DETAILS */}
              <div className="flex flex-col flex-1 justify-between px-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{product.rating}</span>
                      <span className="text-stone-400 text-[10px] font-normal">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-purple-900 transition-colors line-clamp-1 leading-snug">
                    {product.name}
                  </h3>

                  <p className="text-xs text-stone-500 font-medium line-clamp-2 mt-1.5 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* PRICE & ADD BUTTON */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-black text-stone-950">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-stone-400 line-through font-semibold">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="bg-[#edd2f7] hover:bg-[#e4c2f1] active:scale-95 text-[#4a044e] font-extrabold text-xs sm:text-sm px-4 py-2 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
