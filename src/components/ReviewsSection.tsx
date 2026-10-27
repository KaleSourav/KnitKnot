import React from 'react';
import { Star, CheckCircle, Heart, Quote } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  product: string;
  comment: string;
  date: string;
  verified: boolean;
}

const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Chloe V.',
    rating: 5,
    product: 'Everlasting White Lily & Pink Rose Bouquet',
    comment: 'I gifted this to my mom for Mother’s Day and she started tearing up! The detail on the white lily petals is breathtaking. It sits on her coffee table every single day without fading.',
    date: '2 days ago',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'Maya S.',
    rating: 5,
    product: 'Lilac Overalls Bunny & Chick Set',
    comment: 'The softest little companion ever. The lilac overalls with real wooden buttons are so charming. It looks even cuter in person than in the pictures!',
    date: '1 week ago',
    verified: true,
  },
  {
    id: 'rev-3',
    name: 'Liam T.',
    rating: 5,
    product: 'Daisy & Sunflower Granny Square Tote',
    comment: 'Super sturdy craftsmanship and thick cotton yarn! The wooden ring handles feel wonderful to hold, and I get stopped by strangers every time I take it to the farmer’s market.',
    date: '2 weeks ago',
    verified: true,
  },
  {
    id: 'rev-4',
    name: 'Elena R.',
    rating: 5,
    product: 'Custom Build-Your-Own Bouquet (BYOB)',
    comment: 'Building the bouquet was so fun! I picked sunflowers, daisies, and pink roses with blush wrap. The packaging was immaculate with a personalized handwritten card.',
    date: '3 weeks ago',
    verified: true,
  },
];

export const ReviewsSection: React.FC = () => {
  return (
    <section className="w-full bg-[#faf4e8] py-12 sm:py-16 md:py-24 px-3.5 sm:px-6 lg:px-8 border-t border-[#841724]/10 select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#841724]/10 border border-[#841724]/20 text-[#841724] font-semibold text-xs uppercase tracking-widest mb-2.5">
              <Heart className="w-3.5 h-3.5 fill-[#841724] text-[#841724]" />
              <span>Community Love</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#2b0b12] tracking-tight font-serif">
              Loved By Thousands of Gifters
            </h2>
            <p className="text-sm sm:text-base text-[#7c5c62] mt-2 max-w-xl">
              Real photos and genuine love notes from happy Knotsnco homes around the globe. Every stitch made with love.
            </p>
          </div>

          <div className="flex items-center gap-3.5 bg-[#faedd3] px-5 py-3 rounded-2xl border border-[#841724]/15 shadow-sm shrink-0">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <div className="text-xs">
              <span className="font-extrabold text-[#2b0b12] text-sm">4.95 / 5.0</span>
              <span className="text-[#7c5c62] ml-1.5 font-medium">(1,840+ reviews)</span>
            </div>
          </div>
        </div>

        {/* Reviews 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#faedd3] rounded-3xl p-6 border border-[#841724]/15 hover:border-[#841724]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#841724]/20 group-hover:text-[#841724]/50 transition-colors" />
                </div>

                <p className="text-xs sm:text-sm text-[#2b0b12] leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#841724]/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2b0b12]">{rev.name}</span>
                  {rev.verified && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 font-medium truncate mt-1">
                  {rev.product}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
