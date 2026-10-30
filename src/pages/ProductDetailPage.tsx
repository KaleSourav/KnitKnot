/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  Share2,
  Check,
  Plus,
  Minus,
  Flower2,
} from 'lucide-react';
import { Product } from '../data/products';
import { KnotsncoProductCard } from '../components/KnotsncoProductCard';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onQuickView: (product: Product) => void;
  onNavigate: (view: string, param?: string) => void;
  onCheckoutInstant?: (product: Product, quantity: number) => void;
}

export function ProductDetailPage({
  product,
  allProducts,
  onAddToCart,
  onQuickView,
  onNavigate,
  onCheckoutInstant,
}: ProductDetailPageProps) {
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [selectedImage, setSelectedImage] = useState(images[0] || product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'story' | 'care'>('details');
  const [isCopied, setIsCopied] = useState(false);

  // Discount percentage
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // Related products from the same category
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Look at this adorable handmade ${product.name} on Knotsnco!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="w-full bg-[#FFF5CC] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-8 text-xs font-bold text-[#811B2B] font-rounded">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:underline text-[#811B2B]/75 hover:text-[#811B2B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('collection', product.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'))}
            className="hover:underline text-[#811B2B]/75 hover:text-[#811B2B]"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-[#811B2B] font-extrabold truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </div>

        {/* Product Hero Layout (Reference 2 Inspired) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-[#FFFEF8] p-6 sm:p-10 rounded-3xl border-2 border-[#811B2B] shadow-2xl mb-16">
          
          {/* LEFT: Multi-Photo Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Thumbnails strip */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] shrink-0 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img
                        ? 'border-[#811B2B] scale-105 shadow-md'
                        : 'border-[#811B2B]/20 hover:border-[#811B2B]/60 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-[#FFF5CC] border border-[#811B2B]/20 shadow-inner group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />

              {/* Badges on top */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercent && (
                  <span className="px-3 py-1 rounded-full bg-[#811B2B] text-[#FFF5CC] text-xs font-extrabold shadow-md">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-[#F5DD91] text-[#811B2B] text-xs font-extrabold border border-[#811B2B]/20 shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 text-[#811B2B] hover:bg-white shadow-md transition-all hover:scale-110"
                title="Share product"
              >
                {isCopied ? <Check className="w-4 h-4 text-green-700" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* RIGHT: Product Buying Box & Specs (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category pill & rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full bg-[#811B2B]/10 text-[#811B2B] text-[11px] font-bold uppercase tracking-wider font-rounded">
                  {product.category}
                </span>

                <div className="flex items-center gap-1.5 bg-[#FFF5CC] px-2.5 py-0.5 rounded-full border border-[#811B2B]/20">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-bold text-[#811B2B]">
                    {product.rating}
                  </span>
                  <span className="text-[10px] text-[#811B2B]/60 font-rounded">
                    ({product.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="font-editorial text-2xl sm:text-4xl font-extrabold text-[#811B2B] leading-tight">
                {product.name}
              </h1>

              {/* Price section */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-editorial text-3xl sm:text-4xl font-extrabold text-[#811B2B]">
                  ₹{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm sm:text-base text-[#811B2B]/50 line-through font-rounded">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Tax included
                </span>
              </div>

              {/* Short blurb */}
              <p className="mt-4 text-xs sm:text-sm text-[#811B2B]/85 font-rounded leading-relaxed">
                {product.description}
              </p>

              {/* Quantity stepper */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs font-bold text-[#811B2B] font-rounded">Quantity:</span>
                <div className="flex items-center gap-2 bg-[#FFF5CC] border border-[#811B2B]/30 rounded-full p-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#811B2B] hover:bg-[#811B2B]/10 active:scale-90"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-[#811B2B]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#811B2B] hover:bg-[#811B2B]/10 active:scale-90"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => onAddToCart(product, quantity)}
                  className="w-full py-4 px-6 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag (₹{product.price * quantity})</span>
                </button>

                {onCheckoutInstant && (
                  <button
                    onClick={() => onCheckoutInstant(product, quantity)}
                    className="w-full py-3.5 px-6 rounded-full bg-[#F5DD91] hover:bg-[#ebd07a] text-[#811B2B] font-extrabold text-xs sm:text-sm tracking-wider uppercase border-2 border-[#811B2B] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Instant Checkout via Shopify 🛍️</span>
                  </button>
                )}
              </div>

              {/* Trust perks */}
              <div className="mt-6 pt-5 border-t border-[#811B2B]/15 space-y-2 text-xs text-[#811B2B]/85 font-rounded">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#811B2B]" />
                  <span>Free shipping across India on orders over ₹999</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#811B2B]" />
                  <span>Stitched by hand by our Dadis in Surat with pure combed cotton</span>
                </div>
              </div>
            </div>

            {/* Tabbed Specs (Details / Dadi Story / Care) */}
            <div className="mt-8 pt-5 border-t border-[#811B2B]/15">
              <div className="flex items-center gap-2 mb-3 border-b border-[#811B2B]/10 pb-2">
                {[
                  { id: 'details', label: 'Details' },
                  { id: 'story', label: 'Artisan Story' },
                  { id: 'care', label: 'Care Guide' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1 rounded-full text-xs font-bold font-rounded transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#811B2B] text-[#FFF5CC]'
                        : 'text-[#811B2B]/70 hover:text-[#811B2B]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'details' && (
                <ul className="space-y-1.5 text-xs text-[#811B2B]/85 font-rounded">
                  {product.details.map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[#811B2B]">✿</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'story' && (
                <p className="text-xs text-[#811B2B]/85 font-rounded leading-relaxed">
                  Crafted by our cooperative of senior artisans in Surat, Gujarat. Your purchase supports dignified, flexible livelihoods and preserves traditional slow-craft artistry.
                </p>
              )}

              {activeTab === 'care' && (
                <p className="text-xs text-[#811B2B]/85 font-rounded leading-relaxed">
                  Spot clean with mild soapy water or gentle dust with a soft cloth. For bags and bandanas, hand wash in cold water and lay flat to dry in shade.
                </p>
              )}
            </div>

          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#811B2B]">
                  More from {product.category}
                </h3>
                <p className="text-xs sm:text-sm text-[#811B2B]/80 font-handwriting text-xl">
                  curated companion pieces you might also cherish ♡
                </p>
              </div>

              <button
                onClick={() => onNavigate('collection', product.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'))}
                className="text-xs font-bold text-[#811B2B] hover:underline"
              >
                View Category ({product.category}) →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, idx) => (
                <KnotsncoProductCard
                  key={p.id}
                  product={p}
                  cardIndex={idx}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
