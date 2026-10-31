import React from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

export const CraftScrollStack: React.FC = () => {
  const cards = [
    {
      step: '01 / ETHICAL SOURCING',
      title: '100% Combed Milk Cotton',
      subtitle: 'Ultra-soft, vibrant, hypoallergenic & plastic-free',
      description:
        'Mass-produced artificial flowers use stiff plastics and synthetic polyesters that sit in landfills forever. Every Knotsnco blossom is woven from combed milk cotton yarn—velvety to touch, breathable, and dyed with skin-safe, fade-resistant colors.',
      tags: ['Zero Plastic Waste', 'Baby & Pet Safe', 'Rich Natural Texture'],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m4.93 4.93 4.24 4.24" />
          <path d="m14.83 9.17 4.24-4.24" />
          <path d="m14.83 14.83 4.24 4.24" />
          <path d="m9.17 14.83-4.24 4.24" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      ),
      accent: '#4D6A10',
      bg: '#FAFDF2',
    },
    {
      step: '02 / SLOW CRAFT',
      title: '2 to 6 Hours Per Bouquet',
      subtitle: 'Slow, patient stitching—petal by individual petal',
      description:
        'There are no automated machines or conveyor belts in our studio. Each rose petal, lily bell, and amigurumi mascot is handcrafted by talented women artisans using traditional crochet needles. Each bouquet carries hours of love and human touch.',
      tags: ['Women-Led Artisan Guild', '100% Hand-Crocheted', 'Fair-Wage Guaranteed'],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" />
          <path d="M22 12a4 4 0 0 1-4 4h-1a4 4 0 0 1-4-4 4 4 0 0 1 4-4h1a4 4 0 0 1 4 4z" />
          <path d="M12 22a4 4 0 0 1-4-4v-1a4 4 0 0 1 4-4 4 4 0 0 1 4 4v1a4 4 0 0 1-4 4z" />
          <path d="M2 12a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" />
        </svg>
      ),
      accent: '#3E5A0A',
      bg: '#F6F9EB',
    },
    {
      step: '03 / EVERLASTING JOY',
      title: 'Blooms That Never Wilt or Fade',
      subtitle: 'No watering, no dropped petals, zero pollen allergies',
      description:
        'Real cut flowers dry up and get thrown in the trash in 4 days. Knotsnco blooms stay as cheerful, vibrant, and heartwarming as the day you unboxed them. A timeless keepsake for anniversaries, birthdays, office desks, and homes.',
      tags: ['Allergy-Friendly', 'Lifetime Durability', 'Zero Maintenance'],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.581 0-4.581 8 0 8 5.606 0 7.644-8 12.74-8z" />
        </svg>
      ),
      accent: '#557412',
      bg: '#FBFDF5',
    },
    {
      step: '04 / THE UNBOXING',
      title: 'Luxury Gift-Ready Packaging',
      subtitle: 'Crush-proof safety with your handwritten custom card',
      description:
        'Every arrangement arrives safely wrapped in matte Korean floral paper, silk ribbon ties, and rigid shock-proof protective cartons. Leave a personalized message during checkout and our team hand-writes your note on a botanical card for free.',
      tags: ['Free Pan-India Delivery', 'Handwritten Card Included', 'Crush-Proof Packaging'],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <path d="M12 8v13" />
          <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
          <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
        </svg>
      ),
      accent: '#44600C',
      bg: '#F5F9EA',
    },
  ];

  return (
    <div className="w-full max-w-[1100px] mx-auto py-2">
      <div style={{ height: 600 }}>
        <ScrollStack
          itemDistance={95}
          itemStackDistance={24}
          stackPosition="12%"
          itemScale={0.045}
          baseScale={0.88}
          dimAmount={0.16}
          tiltAmount={2.5}
          rotationAmount={1.2}
          holdDistance={180}
          smoothScroll={true}
          snap={false}
        >
          {cards.map((card, idx) => (
            <ScrollStackItem
              key={idx}
              itemClassName="!h-[360px] md:!h-[330px] border border-[#2d3b10]/15"
              style={{
                backgroundColor: card.bg,
                color: '#1a220a',
              }}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase"
                      style={{
                        backgroundColor: 'rgba(77, 106, 16, 0.1)',
                        color: card.accent,
                      }}
                    >
                      {card.step}
                    </span>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(77, 106, 16, 0.1)',
                        color: card.accent,
                      }}
                    >
                      {card.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-extrabold text-[#141a07] tracking-tight mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm font-semibold text-[#4d6a10] mb-3">
                    {card.subtitle}
                  </p>
                  <p className="text-xs md:text-sm leading-relaxed text-[#2c3812] max-w-2xl">
                    {card.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#2d3b10]/10">
                  {card.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/80 text-[#25320c] border border-[#2d3b10]/10 shadow-sm"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4D6A10" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </div>
  );
};

export default CraftScrollStack;
