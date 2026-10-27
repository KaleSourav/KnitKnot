/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Star, CheckCircle, Heart, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  product: string;
  comment: string;
  date: string;
  verified: boolean;
  avatarColor: string;
}

const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Ananya Sharma',
    location: 'Mumbai',
    rating: 5,
    product: 'Everlasting White Lily Bouquet',
    comment: 'I ordered this bouquet for my mom’s birthday and she literally cried tears of joy! The detail on the white lily petals is breathtaking. It sits on her coffee table every single day without fading. 1000% worth it!',
    date: '2 days ago',
    verified: true,
    avatarColor: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'rev-2',
    name: 'Riya Patel',
    location: 'Surat',
    rating: 5,
    product: 'Sunflower & Turtle Shell Bag Charm',
    comment: 'The softest little companion ever! The little wooden ring and sunflower charm make my daily canvas tote look like a Pinterest board. Everyone at university keeps asking me where I got it ♡',
    date: '4 days ago',
    verified: true,
    avatarColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'rev-3',
    name: 'Sneha Kulkarni',
    location: 'Pune',
    rating: 5,
    product: 'Barnaby Bunny Companion with Overalls',
    comment: 'Immaculate craftsmanship! Real wooden buttons on the lilac overalls, and the combed milk cotton yarn feels like a cloud. Ordered on Wednesday and it arrived beautifully gift-wrapped by Friday!',
    date: '1 week ago',
    verified: true,
    avatarColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'rev-4',
    name: 'Aarav Mehta',
    location: 'Bangalore',
    rating: 5,
    product: 'Daisy & Sunflower Granny Square Tote',
    comment: 'Bought this as an anniversary gift for my girlfriend. The stitching is so sturdy and thick, definitely not cheap fast-fashion. She brings it to every weekend cafe run.',
    date: '1 week ago',
    verified: true,
    avatarColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'rev-5',
    name: 'Pooja Iyer',
    location: 'Chennai',
    rating: 5,
    product: 'Cherry Blossom Hairclip Duo',
    comment: 'Such a delicate and pretty hair accent! Stays firmly in place on my thick hair without pulling. Knowing this supports women artisans in Gujarat makes it feel so special.',
    date: '2 weeks ago',
    verified: true,
    avatarColor: 'bg-pink-100 text-pink-700',
  },
  {
    id: 'rev-6',
    name: 'Diya Sen',
    location: 'Kolkata',
    rating: 5,
    product: 'Double White Tulip Desk Pot',
    comment: 'Cut flowers die in 4 days and break my heart. These crochet tulips look fresh, vibrant and cheerful year-round with zero maintenance. My desk sanctuary is complete!',
    date: '3 weeks ago',
    verified: true,
    avatarColor: 'bg-orange-100 text-orange-700',
  },
];

export const ReviewsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -350 : 350;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section 
      id="reviews-section"
      className="w-full bg-transparent py-14 sm:py-20 px-3.5 sm:px-6 lg:px-8 border-t border-[#841724]/10 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#841724]/10 border border-[#841724]/20 text-[#841724] font-bold text-xs uppercase tracking-widest mb-2.5">
              <Heart className="w-3.5 h-3.5 fill-[#841724] text-[#841724]" />
              <span>Real Customer Stories</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#2b0b12] tracking-tight font-serif">
              Customers Are Saying ♡
            </h2>
            <p className="text-sm sm:text-base text-[#7c5c62] mt-2 max-w-xl">
              1,840+ verified 5-star reviews from crochet lovers across India. Every single piece is stitched slowly and packed lovingly.
            </p>
          </div>

          {/* Average Rating Pill & Carousel Navigation */}
          <div className="flex items-center gap-4 self-start md:self-auto">
            <div className="flex items-center gap-2.5 bg-[#faedd3] px-4 py-2 rounded-2xl border border-[#841724]/20 shadow-sm">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <span className="font-black text-[#2b0b12] text-xs sm:text-sm">4.95 / 5.0</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                aria-label="Scroll reviews left"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#faedd3] hover:bg-[#841724] text-[#841724] hover:text-[#faedd3] border border-[#841724]/20 flex items-center justify-center transition-all duration-300 shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Scroll reviews right"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#faedd3] hover:bg-[#841724] text-[#841724] hover:text-[#faedd3] border border-[#841724]/20 flex items-center justify-center transition-all duration-300 shadow-sm"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-1 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="w-[280px] sm:w-[340px] shrink-0 snap-start bg-[#faedd3] rounded-3xl p-5 sm:p-6 border border-[#841724]/15 hover:border-[#841724]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#841724]/25 group-hover:text-[#841724]/60 transition-colors" />
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#2b0b12] leading-relaxed italic mb-5 line-clamp-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="pt-3.5 border-t border-[#841724]/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${rev.avatarColor}`}>
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#2b0b12]">
                        {rev.name}
                      </h4>
                      <p className="text-[10px] text-[#7c5c62] font-medium">
                        {rev.location}
                      </p>
                    </div>
                  </div>

                  {rev.verified && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle className="w-3 h-3 text-emerald-700" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#841724] font-semibold truncate">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span className="truncate">{rev.product}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
