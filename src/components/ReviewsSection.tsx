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
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-stone-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-600 font-semibold text-xs uppercase tracking-widest mb-3">
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>Community Love</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight font-serif">
              Loved By Thousands of Gifters
            </h2>
            <p className="text-sm sm:text-base text-stone-500 mt-2 max-w-xl">
              Real photos and genuine love notes from happy KnitKnot homes around the globe. Every stitch made with love.
            </p>
          </div>

          <div className="flex items-center gap-3.5 bg-stone-50 px-5 py-3 rounded-2xl border border-stone-200 shadow-sm shrink-0">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <div className="text-xs">
              <span className="font-extrabold text-stone-900 text-sm">4.95 / 5.0</span>
              <span className="text-stone-500 ml-1.5 font-medium">(1,840+ reviews)</span>
            </div>
          </div>
        </div>

        {/* Reviews 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#faf8f5] rounded-3xl p-6 border border-stone-200/80 hover:border-amber-400/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-stone-300 group-hover:text-amber-400/60 transition-colors" />
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900">{rev.name}</span>
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
