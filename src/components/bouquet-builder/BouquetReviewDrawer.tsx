import React, { useState } from 'react';
import {
  FlowerStem,
  WrappingOption,
  RibbonOption,
  CustomBouquetState,
} from '../../data/bouquetFlowers';
import { X, Loader2, Sparkles, Heart } from 'lucide-react';

interface BouquetReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bouquet: CustomBouquetState;
  onConfirm: (deliveryDetails: {
    address: string;
    date: string;
    notes: string;
  }) => Promise<void>;
}

export const BouquetReviewDrawer: React.FC<BouquetReviewDrawerProps> = ({
  isOpen,
  onClose,
  bouquet,
  onConfirm,
}) => {
  const selectedFlowers = bouquet?.flowers || {};
  const wrapping = bouquet?.wrapping;
  const ribbon = bouquet?.ribbon;
  const note = bouquet?.note;
  const [recipient, setRecipient] = useState(note?.recipient || '');
  const [address, setAddress] = useState(bouquet?.delivery?.address || '');
  const [deliverySlot, setDeliverySlot] = useState('Standard Delivery (2-4 Days)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const items = Object.values(selectedFlowers);
  const totalStems = items.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = items.reduce(
    (acc, it) => acc + it.flower.price * it.quantity,
    0
  );

  // Flatten stems for visual display
  const flowerInstances: FlowerStem[] = [];
  items.forEach(({ flower, quantity }) => {
    for (let i = 0; i < quantity; i++) flowerInstances.push(flower);
  });

  const handleConfirmAddToCart = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm({
        address: address || 'Standard Delivery',
        date: deliverySlot,
        notes: recipient ? `For: ${recipient}` : '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Dim backdrop */}
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Dialog Card matching Annie's "Where's the love going?" (media_1794989621305_04e4230d.jpg) ── */}
      <div
        className="relative w-full max-w-3xl rounded-[36px] bg-[#FBF8CF] border border-[#641623]/20 shadow-[0_25px_60px_rgba(0,0,0,0.3)] font-['Fredoka'] z-10 animate-scaleIn overflow-hidden max-h-[92vh] flex flex-col md:flex-row"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-[#641623] flex items-center justify-center transition-all cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── LEFT: Complete Bouquet Preview held by Gloved Hands ── */}
        <div className="w-full md:w-[45%] bg-[#FDF0E6] p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-[#641623]/10">
          <div className="relative w-full flex items-center justify-center h-[280px] sm:h-[320px]">
            {/* Luminous yellow radial halo */}
            <div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
              style={{
                width: '240px',
                height: '240px',
                background:
                  'radial-gradient(ellipse at center, rgba(254, 240, 138, 0.75) 0%, rgba(250, 204, 21, 0.45) 50%, transparent 80%)',
                filter: 'blur(20px)',
              }}
            />

            {/* 1. Back Crepe Paper Cone (z-10) */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
              style={{ width: '200px', height: '250px' }}
            >
              <img
                src="/boutique/wrapping-paper-cone.png"
                alt="Bouquet wrap"
                className="w-full h-full object-contain select-none pointer-events-none"
                style={{
                  filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.22))',
                }}
              />
            </div>

            {/* 2. Customer's Actual Flower Blooms (z-18) - Blooming naturally from cone opening */}
            <div
              className="absolute bottom-[135px] left-1/2 pointer-events-none z-18"
              style={{ transform: 'translateX(-50%)', width: '1px', height: '1px' }}
            >
              {flowerInstances.slice(0, 16).map((flower, idx) => {
                const total = Math.min(flowerInstances.length, 16);
                const spread = Math.min(total - 1, 10);
                const progress = spread === 0 ? 0.5 : idx / spread;
                const angle = -14 + progress * 28;
                const xOffset = -36 + progress * 72;
                const arch = (1 - Math.pow((progress - 0.5) * 2, 2)) * 14;
                return (
                  <div
                    key={`${flower.variantId}-${idx}`}
                    className="absolute"
                    style={{
                      transform: `translateX(${xOffset}px) translateY(${-arch}px) rotate(${angle}deg)`,
                      transformOrigin: 'bottom center',
                      width: '120px',
                      height: '155px',
                      left: '-60px',
                      bottom: '0',
                      zIndex: Math.round(10 + (1 - Math.abs(progress - 0.5)) * 10),
                    }}
                  >
                    <img
                      src={flower.cutoutImage || flower.image}
                      alt={flower.name}
                      className="w-full h-full object-contain select-none pointer-events-none"
                      style={{
                        filter:
                          'brightness(1.08) contrast(1.06) saturate(1.15) drop-shadow(0 0 8px rgba(255, 245, 180, 0.6)) drop-shadow(0 6px 14px rgba(0,0,0,0.25))',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* 3. Tucked Note Card (z-22) */}
            {note.isTucked && note.message && (
              <div
                className="absolute z-22 transform rotate-6 drop-shadow-lg"
                style={{ bottom: '185px', left: 'calc(50% + 28px)' }}
              >
                <div className="bg-[#FFFDF9] border-2 border-[#811B2B] rounded-lg px-2.5 py-1.5 w-[90px] shadow-md">
                  <p className="font-['Satisfy'] text-[10px] text-[#811B2B] leading-tight truncate">
                    "{note.message}"
                  </p>
                  <div className="flex items-center justify-between text-[7px] text-[#811B2B]/70 font-mono mt-0.5">
                    <span>💌</span>
                    <span>{note.recipient || 'Dear'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Front Crepe Cone Flap (z-25) - Covers lower stems inside the cone */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-25 pointer-events-none"
              style={{ width: '200px', height: '250px' }}
            >
              <img
                src="/boutique/wrapping-paper-cone-front.png"
                alt="Front fold"
                className="w-full h-full object-contain select-none pointer-events-none"
              />
            </div>

            {/* 5. 3D Satin Ribbon Bow (z-30) */}
            <div
              className="absolute z-30 pointer-events-none drop-shadow-md"
              style={{ bottom: '70px', left: '50%', transform: 'translateX(-50%)' }}
            >
              <img
                src={ribbon.image || '/boutique/satin-ribbon-orange.png'}
                alt={ribbon.name}
                className="w-24 h-24 object-contain select-none pointer-events-none"
              />
            </div>

            {/* 6. Photorealistic Gloved Hands holding the bouquet (z-35) */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-35 pointer-events-none drop-shadow-lg"
              style={{ width: '130px', height: '95px' }}
            >
              <img
                src="/boutique/gloved-hands-holding.png"
                alt="Gloved hands holding bouquet"
                className="w-full h-full object-contain select-none pointer-events-none"
              />
            </div>
          </div>

          <div className="text-center mt-1">
            <span className="font-['Fredoka'] font-black text-xs text-[#811B2B]">
              {totalStems} {totalStems === 1 ? 'Handmade Bloom' : 'Handmade Blooms'}
            </span>
            <span className="text-[10px] text-[#641623]/70 block">
              Wrapped in {wrapping.name} with {ribbon.name}
            </span>
          </div>
        </div>

        {/* ── RIGHT: Form Fields ("Where's the love going?") ── */}
        <div className="w-full md:w-[55%] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img
                src="/logo-knotsnco.png"
                alt="knotsnco."
                className="h-5 sm:h-5.5 w-auto object-contain select-none"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#811B2B]/80 font-['Fredoka']">
                • Flower Boutique
              </span>
            </div>
            <h3 className="font-['Fredoka'] font-black text-2xl sm:text-[26px] text-[#641623] tracking-tight leading-tight">
              Where’s the love going?
            </h3>
            <p className="font-['Fredoka'] text-xs text-[#641623]/70 mt-0.5">
              Handmade with patience by 200+ artisan daadis in India ♡
            </p>

            {/* Form Fields */}
            <div className="mt-5 space-y-3 text-left">
              <div>
                <label className="block text-[11px] font-bold text-[#641623] uppercase tracking-wider mb-1">
                  Recipient
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Their name"
                  className="w-full bg-white border border-[#641623]/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#811B2B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#641623] uppercase tracking-wider mb-1">
                  Delivery address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, City, Pincode"
                  className="w-full bg-white border border-[#641623]/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#811B2B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#641623] uppercase tracking-wider mb-1">
                  Delivery
                </label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="w-full bg-white border border-[#641623]/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#811B2B]"
                >
                  <option value="Standard Delivery (2-4 Days)">Standard Delivery (2–4 Days)</option>
                  <option value="Express Dispatch (Next Day)">Express Dispatch (Next Day)</option>
                  <option value="Schedule for Special Occasion">Schedule for a Special Date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="mt-6 pt-3 border-t border-[#641623]/10">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-[#641623]/80">
                Bouquet Total ({totalStems} stems)
              </span>
              <span className="font-black text-sm text-[#811B2B]">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4 text-xs text-green-700 font-bold">
              <span>Standard Insured Delivery</span>
              <span>FREE</span>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmAddToCart}
              className="w-full py-3.5 px-6 rounded-full font-['Fredoka'] font-black text-sm text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg active:scale-95 hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #811B2B 0%, #641623 100%)',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Your Gift...</span>
                </>
              ) : (
                <span>Send a little happiness →</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
