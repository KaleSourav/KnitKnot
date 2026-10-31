import React from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

interface BannerItem {
  id: number;
  src: string;
  fallback: string;
  alt: string;
}

const BANNERS: BannerItem[] = [
  {
    id: 1,
    src: '/banners/1.jpg',
    fallback: '/banners/1.png',
    alt: 'Knotsnco Handcrafted Bouquets & Artisan Crochet Collection',
  },
  {
    id: 3,
    src: '/banners/3.jpg',
    fallback: '/banners/3.png',
    alt: 'Knotsnco Everlasting Blooms & Botanical Floral Stems',
  },
  {
    id: 4,
    src: '/banners/4.jpg',
    fallback: '/banners/4.png',
    alt: 'Knotsnco Crochet Gifts, Cute Amigurumi & Handwoven Delights',
  },
  {
    id: 5,
    src: '/banners/5.jpg',
    fallback: '/banners/5.png',
    alt: 'Knotsnco Luxury Custom Bouquets & Ready-to-Gift Packaging',
  },
];

export const CraftScrollStack: React.FC = () => {
  return (
    <div className="w-full max-w-[1680px] mx-auto px-2 sm:px-4 md:px-6">
      <div className="w-full h-[460px] sm:h-[540px] md:h-[640px] lg:h-[720px] xl:h-[760px]">
        <ScrollStack
          itemDistance={45}
          itemStackDistance={32}
          stackPosition="4%"
          itemScale={0.035}
          baseScale={0.88}
          dimAmount={0.22}
          tiltAmount={1.8}
          rotationAmount={0.8}
          holdDistance={80}
          scrollSpeed={2.8}
          smoothScroll={true}
          snap={false}
          className="w-full h-full"
        >
          {BANNERS.map((banner, idx) => (
            <ScrollStackItem
              key={banner.id}
              itemClassName="w-full h-[380px] sm:h-[460px] md:h-[540px] lg:h-[620px] xl:h-[660px] p-0 overflow-hidden rounded-[22px] sm:rounded-[28px] md:rounded-[34px] border border-black/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] bg-[#181a12]"
            >
              <picture className="w-full h-full block">
                <source srcSet={banner.src} type="image/jpeg" />
                <img
                  src={banner.fallback}
                  alt={banner.alt}
                  className="w-full h-full object-cover object-center block select-none pointer-events-none transition-transform duration-700 ease-out hover:scale-[1.02]"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                />
              </picture>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </div>
  );
};

export default CraftScrollStack;
