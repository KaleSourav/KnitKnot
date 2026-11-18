import React, { useState } from 'react';
import {
  FlowerStem,
  WrappingOption,
  RibbonOption,
} from '../../data/bouquetFlowers';
import {
  X,
  Plus,
  Minus,
  Sparkles,
  Heart,
  Check,
  ShoppingBag,
  Truck,
  Calendar,
  MapPin,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

interface BouquetReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFlowers: Record<string, { flower: FlowerStem; quantity: number }>;
  wrapping: WrappingOption;
  ribbon: RibbonOption;
  note: {
    recipient: string;
    message: string;
    sender: string;
    cardStyle: string;
    isTucked: boolean;
  };
  onAddFlower: (flower: FlowerStem) => void;
  onRemoveFlower: (variantId: string) => void;
  onOpenNoteModal: () => void;
  onAddToCart: (deliveryDetails: {
    address: string;
    date: string;
    notes: string;
  }) => Promise<void>;
}

export const BouquetReviewDrawer: React.FC<BouquetReviewDrawerProps> = ({
  isOpen,
  onClose,
  selectedFlowers,
  wrapping,
  ribbon,
  note,
  onAddFlower,
  onRemoveFlower,
  onOpenNoteModal,
  onAddToCart,
}) => {
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const items = Object.values(selectedFlowers);
  const totalStems = items.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = items.reduce(
    (acc, it) => acc + it.flower.price * it.quantity,
    0
  );

  const handleConfirmAddToCart = async () => {
    setIsSubmitting(true);
    try {
      await onAddToCart({ address, date, notes });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D2424]/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Over Panel */}
      <aside
        className="relative w-full max-w-lg bg-[#FAF4ED] text-[#2D2424] h-full shadow-[0_0_50px_rgba(100,22,35,0.25)] flex flex-col font-['Fredoka'] z-10 overflow-y-auto"
        aria-label="Bouquet Review & Checkout"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#641623]/15 flex items-center justify-between bg-[#FFFDF9] sticky top-0 z-20 shadow-2xs">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#811B2B] uppercase">
              <Sparkles className="w-3 h-3 text-[#E5A93C]" />
              <span>Review Your Creation</span>
            </div>
            <h2 className="font-bold text-xl sm:text-2xl text-[#641623] tracking-tight">
              Where&apos;s the love going?
            </h2>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full border border-[#641623]/20 flex items-center justify-center text-[#641623] hover:bg-[#641623]/10 active:scale-95 transition-all cursor-pointer"
            aria-label="Close review drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-4 sm:p-6 space-y-6 flex-1 text-left">
          {/* ── 1. Bouquet Summary Card ── */}
          <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#641623]/15 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#641623]/10">
              <span className="font-black text-xs sm:text-sm text-[#641623] uppercase">
                Your Custom Bouquet
              </span>
              <span className="text-xs font-bold text-[#811B2B] bg-[#FFF5CC] px-2 py-0.5 rounded-full border border-[#811B2B]/20">
                {totalStems} {totalStems === 1 ? 'stem' : 'stems'}
              </span>
            </div>

            {/* Inclusions Strip */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#641623]/80 mb-3 bg-[#FAF3EA] p-2.5 rounded-xl border border-[#641623]/10">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: wrapping.colorHex }}
                />
                <span className="truncate">
                  Wrap: <strong className="text-[#811B2B]">{wrapping.name}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: ribbon.colorHex }}
                />
                <span className="truncate">
                  Ribbon: <strong className="text-[#811B2B]">{ribbon.name}</strong>
                </span>
              </div>
            </div>

            {/* Stems Itemized List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {items.map(({ flower, quantity }) => (
                <div
                  key={flower.variantId}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#641623]/10 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={flower.image}
                      alt={flower.name}
                      className="w-10 h-10 object-contain rounded-lg bg-[#FAF4ED] p-0.5 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[#641623] truncate">
                        {flower.name}
                      </h4>
                      <span className="text-[11px] text-[#641623]/70 font-semibold">
                        ₹{flower.price} each
                      </span>
                    </div>
                  </div>

                  {/* Stepper & Line Price */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="inline-flex items-center gap-1 bg-[#FFF5CC] rounded-full p-0.5 border border-[#811B2B]/20">
                      <button
                        type="button"
                        onClick={() => onRemoveFlower(flower.variantId)}
                        className="w-4 h-4 rounded-full bg-white text-[#811B2B] flex items-center justify-center text-[10px] font-bold hover:bg-[#811B2B] hover:text-white transition-colors cursor-pointer"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-xs font-bold text-[#811B2B] px-1">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAddFlower(flower)}
                        className="w-4 h-4 rounded-full bg-[#811B2B] text-white flex items-center justify-center text-[10px] font-bold hover:bg-[#641623] transition-colors cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <span className="font-black text-xs text-[#811B2B] w-14 text-right">
                      ₹{flower.price * quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 2. Handwritten Note Preview / Add ── */}
          <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#641623]/15 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-xs sm:text-sm text-[#641623] uppercase flex items-center gap-1.5">
                <span>Gift Card Note</span>
                <Heart className="w-3.5 h-3.5 text-[#811B2B] fill-[#811B2B]" />
              </span>

              <button
                type="button"
                onClick={onOpenNoteModal}
                className="text-xs font-bold text-[#811B2B] hover:underline cursor-pointer"
              >
                {note.isTucked ? 'Edit note' : '+ Add gift note'}
              </button>
            </div>

            {note.isTucked && note.message ? (
              <div className="bg-[#FFFCEB] rounded-xl border border-dashed border-[#811B2B]/40 p-3 text-left">
                <span className="text-[10px] font-bold text-[#811B2B] uppercase block">
                  {note.recipient ? `For: ${note.recipient}` : 'Personal Message'}
                </span>
                <p className="font-script text-sm text-[#641623] mt-1 leading-snug">
                  &ldquo;{note.message}&rdquo;
                </p>
                {note.sender && (
                  <span className="font-script text-xs text-[#811B2B] block text-right mt-1">
                    — {note.sender}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#641623]/60 italic font-medium">
                No note attached yet. We provide a complimentary handwritten card with every bouquet!
              </p>
            )}
          </div>

          {/* ── 3. Recipient & Delivery Details (Optional) ── */}
          <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#641623]/15 p-4 shadow-xs space-y-3">
            <span className="font-black text-xs sm:text-sm text-[#641623] uppercase block">
              Delivery Details (Optional)
            </span>

            {/* Delivery Address */}
            <div>
              <label className="block text-[11px] font-bold text-[#641623]/80 uppercase mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#811B2B]" />
                <span>Recipient City / Pin Code</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai, 400001 (or doorstep address)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF4ED] border border-[#641623]/20 focus:border-[#811B2B] focus:outline-none text-xs text-[#641623]"
              />
            </div>

            {/* Delivery Date */}
            <div>
              <label className="block text-[11px] font-bold text-[#641623]/80 uppercase mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#811B2B]" />
                <span>Preferred Delivery Date / Occasion</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Birthday on 24th Nov / ASAP"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF4ED] border border-[#641623]/20 focus:border-[#811B2B] focus:outline-none text-xs text-[#641623]"
              />
            </div>
          </div>

          {/* ── 4. Price Breakdown & Free Perks ── */}
          <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#641623]/15 p-4 shadow-xs space-y-2">
            <div className="flex justify-between text-xs text-[#641623]/80 font-medium">
              <span>Crochet Stems Subtotal ({totalStems} stems)</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs text-[#641623]/80 font-medium">
              <span>Boutique Gift Wrapping</span>
              <span className="text-green-700 font-bold uppercase text-[11px]">
                FREE (Included)
              </span>
            </div>
            <div className="flex justify-between text-xs text-[#641623]/80 font-medium">
              <span>{ribbon.name}</span>
              <span className="text-green-700 font-bold uppercase text-[11px]">
                FREE (Included)
              </span>
            </div>
            <div className="flex justify-between text-xs text-[#641623]/80 font-medium">
              <span>Handwritten Greeting Card</span>
              <span className="text-green-700 font-bold uppercase text-[11px]">
                FREE (Included)
              </span>
            </div>
            <div className="flex justify-between text-xs text-[#641623]/80 font-medium">
              <span>Pan-India Safe Delivery</span>
              <span className="text-green-700 font-bold uppercase text-[11px]">
                {subtotal >= 1999 ? 'FREE' : 'Calculated at Checkout'}
              </span>
            </div>

            <div className="pt-2 border-t border-[#641623]/15 flex justify-between items-center text-sm sm:text-base font-black text-[#641623]">
              <span>Bouquet Total</span>
              <span className="text-xl sm:text-2xl text-[#811B2B]">
                ₹{subtotal.toLocaleString('en-IN')}.00
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Bottom Sticky Checkout Action */}
        <div className="p-4 sm:p-5 border-t border-[#641623]/15 bg-[#FFFDF9] sticky bottom-0 z-20 shadow-md flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3.5 rounded-2xl border-2 border-[#641623]/25 text-[#641623] hover:bg-[#FAF4ED] font-bold text-xs sm:text-sm cursor-pointer transition-all"
          >
            ← Keep Editing
          </button>

          <button
            type="button"
            disabled={isSubmitting || totalStems === 0}
            onClick={handleConfirmAddToCart}
            className="flex-1 py-4 px-4 rounded-2xl bg-[#811B2B] text-white font-['Fredoka'] font-black text-sm sm:text-base uppercase tracking-wider hover:bg-[#641623] transition-all cursor-pointer shadow-[0_6px_20px_rgba(129,27,43,0.35)] active:scale-98 flex items-center justify-center gap-2 group disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Wrapping &amp; Adding...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Send a Little Happiness →</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
};
