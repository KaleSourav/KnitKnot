/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Product, CartItem } from '../data/products';
import { BouquetCustomizerSection } from '../components/BouquetCustomizerSection';

interface DedicatedBYOBPageProps {
  onAddToCart: (product: Product, quantity?: number, customization?: CartItem['customization']) => void;
  onOpenCart: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export function DedicatedBYOBPage({
  onAddToCart,
  onOpenCart,
  onNavigate,
}: DedicatedBYOBPageProps) {
  return (
    <div className="w-full bg-[#FFF5CC] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs font-bold text-[#811B2B] font-rounded">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:underline text-[#811B2B]/75 hover:text-[#811B2B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-[#811B2B] font-extrabold">Build Your Own Bouquet Studio</span>
        </div>

        {/* Feature Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#811B2B]/10 text-[#811B2B] text-xs font-bold mb-3 font-rounded">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BESPOKE ARTISAN WORKSHOP</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl font-extrabold text-[#811B2B] tracking-tight">
            Create Your Signature Bouquet.
          </h1>
          <p className="mt-2 text-[#811B2B]/85 font-handwriting text-2xl">
            curated by you, hand-crocheted stitch by stitch in Surat ♡
          </p>
        </div>

        {/* Interactive Customizer Studio */}
        <BouquetCustomizerSection
          onAddToCart={onAddToCart}
          onOpenCart={onOpenCart}
        />

      </div>
    </div>
  );
}

