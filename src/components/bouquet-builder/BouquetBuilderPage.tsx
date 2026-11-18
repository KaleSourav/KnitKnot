import React, { useState, useEffect } from 'react';
import {
  FlowerStem,
  WrappingOption,
  RibbonOption,
  CustomBouquetState,
  DEFAULT_BOUQUET_STATE,
} from '../../data/bouquetFlowers';
import { FlowerCrateShelf } from './FlowerCrateShelf';
import { LiveBouquetCounter } from './LiveBouquetCounter';
import { VintageCashRegister } from './VintageCashRegister';
import { FinishingTouchBar } from './FinishingTouchBar';
import { GiftNoteModal } from './GiftNoteModal';
import { BouquetReviewDrawer } from './BouquetReviewDrawer';
import { useCart } from '../../context/CartContext';
import {
  ArrowLeft,
  Sparkles,
  HelpCircle,
  ShoppingBag,
  Heart,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';

interface BouquetBuilderPageProps {
  onNavigateHome: () => void;
}

export const BouquetBuilderPage: React.FC<BouquetBuilderPageProps> = ({
  onNavigateHome,
}) => {
  const { addBouquetToShopifyCart, openCart } = useCart();

  // Centralized Bouquet Builder State
  const [bouquet, setBouquet] = useState<CustomBouquetState>(() => {
    try {
      const saved = localStorage.getItem('knots_custom_bouquet');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_BOUQUET_STATE;
  });

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync bouquet state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('knots_custom_bouquet', JSON.stringify(bouquet));
    } catch {}
  }, [bouquet]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Flower Operations ────────────────────────────────────────────────────────
  const handleAddFlower = (flower: FlowerStem) => {
    setBouquet((prev) => {
      const existing = prev.flowers[flower.variantId];
      const newQty = (existing?.quantity || 0) + 1;
      return {
        ...prev,
        flowers: {
          ...prev.flowers,
          [flower.variantId]: { flower, quantity: newQty },
        },
      };
    });
    showToast(`Added ${flower.name} to bouquet! ♡`);
  };

  const handleRemoveFlower = (variantId: string) => {
    setBouquet((prev) => {
      const existing = prev.flowers[variantId];
      if (!existing) return prev;

      const newQty = existing.quantity - 1;
      const updated = { ...prev.flowers };

      if (newQty <= 0) {
        delete updated[variantId];
      } else {
        updated[variantId] = { ...existing, quantity: newQty };
      }

      return { ...prev, flowers: updated };
    });
  };

  const handleClearBouquet = () => {
    setBouquet((prev) => ({
      ...prev,
      flowers: {},
      note: { ...prev.note, isTucked: false },
    }));
    showToast('Cleared your bouquet. Start fresh! 🌸');
  };

  // ── Wrapping & Ribbon ────────────────────────────────────────────────────────
  const handleSelectWrapping = (wrapping: WrappingOption) => {
    setBouquet((prev) => ({ ...prev, wrapping }));
    showToast(`Changed wrapping paper to ${wrapping.name}`);
  };

  const handleSelectRibbon = (ribbon: RibbonOption) => {
    setBouquet((prev) => ({ ...prev, ribbon }));
    showToast(`Tied ${ribbon.name} around your bouquet! 🎀`);
  };

  // ── Gift Note ───────────────────────────────────────────────────────────────
  const handleSaveNote = (note: CustomBouquetState['note']) => {
    setBouquet((prev) => ({ ...prev, note }));
    if (note.isTucked) {
      showToast('Handwritten card tucked into your flowers! 💌');
    }
  };

  // ── Cart Calculations ───────────────────────────────────────────────────────
  const flowerItems = Object.values(bouquet.flowers);
  const totalStems = flowerItems.reduce((acc, it) => acc + it.quantity, 0);
  const totalPrice = flowerItems.reduce(
    (acc, it) => acc + it.flower.price * it.quantity,
    0
  );

  // ── Add Complete Bouquet to Shopify Cart ────────────────────────────────────
  const handleConfirmAddToCart = async (deliveryDetails: {
    address: string;
    date: string;
    notes: string;
  }) => {
    if (totalStems === 0) return;

    // Build line item payload for Shopify Cart API
    const lines = flowerItems.map(({ flower, quantity }, index) => {
      const attributes = [
        { key: '_bundle', value: 'Make Your Own Bouquet' },
        { key: 'Bouquet Wrapping', value: bouquet.wrapping.name },
        { key: 'Bouquet Ribbon', value: bouquet.ribbon.name },
      ];

      if (bouquet.note.isTucked && bouquet.note.message) {
        if (bouquet.note.recipient) {
          attributes.push({ key: 'Gift Recipient', value: bouquet.note.recipient });
        }
        attributes.push({ key: 'Gift Note', value: bouquet.note.message });
        if (bouquet.note.sender) {
          attributes.push({ key: 'Gift Sender', value: bouquet.note.sender });
        }
      }

      if (deliveryDetails.address) {
        attributes.push({ key: 'Delivery Location', value: deliveryDetails.address });
      }
      if (deliveryDetails.date) {
        attributes.push({ key: 'Delivery Preference', value: deliveryDetails.date });
      }

      return {
        variantId: flower.variantId,
        quantity,
        attributes,
      };
    });

    try {
      await addBouquetToShopifyCart(lines);
      setIsReviewDrawerOpen(false);
      openCart();
      showToast('Your custom bouquet was added to your cart! 🎉');
    } catch (err) {
      console.error('Error adding bouquet to cart:', err);
      // Fallback: Still open cart drawer
      setIsReviewDrawerOpen(false);
      openCart();
    }
  };

  return (
    <div
      className="w-full min-h-screen font-['Fredoka'] select-none relative pb-24 overflow-x-hidden"
      style={{ background: '#FFF8F0' }}
    >
      {/* ── 0. Toast Notification Pill ── */}
      {toastMessage && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 text-white px-5 py-2 rounded-full font-bold text-xs shadow-lg flex items-center gap-2"
          style={{ background: '#811B2B', animation: 'fadeInDown 0.3s ease' }}
        >
          <span>🌸</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Burgundy Top Bar ── */}
      <div
        className="w-full text-white py-2 px-4 relative z-30"
        style={{ background: '#811B2B', borderBottom: '2px solid #641623' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-bold">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Knots &amp; Co</span>
          </button>
          <span className="hidden md:block font-['Satisfy'] text-base text-[#FFF5CC]">
            "A little something, made by you." ♡
          </span>
          <button
            type="button"
            onClick={() => setShowHowItWorks(true)}
            className="flex items-center gap-1 text-[#FFF5CC] hover:underline cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How it works</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          2. CHECKERBOARD SHOP WALL + HANGING SIGN
         ══════════════════════════════════════════════════════════ */}
      <div
        className="w-full relative overflow-hidden"
        style={{ minHeight: '90px' }}
      >
        {/* Checkerboard background — alternating butter & off-white squares */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-conic-gradient(
                #FFF5CC 0% 25%,
                #FFFEF8 0% 50%
              )
            `,
            backgroundSize: '56px 56px',
          }}
        />
        {/* Vignette darkening at edges for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 60%, rgba(100,22,35,0.08) 100%)',
          }}
        />
        {/* Soft warm overlay so it doesn't look too stark */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(255,245,204,0.18)' }}
        />

        {/* Central hanging shop sign */}
        <div className="relative z-10 flex flex-col items-center justify-center py-5 px-4">
          {/* Hanging strings */}
          <div className="flex gap-32 sm:gap-48 mb-[-2px] pointer-events-none">
            <div className="w-px h-5 bg-[#C8A882] opacity-60" />
            <div className="w-px h-5 bg-[#C8A882] opacity-60" />
          </div>
          {/* Sign board */}
          <div
            className="rounded-2xl px-6 sm:px-12 py-3 shadow-[0_8px_24px_rgba(100,22,35,0.15)] border-2 relative"
            style={{ background: '#FFF8E8', borderColor: '#C8A882' }}
          >
            {/* Pin dots at top corners */}
            <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-[#C8A882] opacity-70" />
            <div className="absolute top-2 right-3 w-2 h-2 rounded-full bg-[#C8A882] opacity-70" />
            <div className="text-center">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#811B2B] block">
                Knots &amp; Co. · Flower Boutique
              </span>
              <h1
                className="font-['Fredoka'] font-black text-lg sm:text-2xl md:text-3xl text-[#641623] leading-tight mt-0.5"
              >
                MAKE YOUR OWN BOUQUET
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          3. PINK FLOWER SHELF — flowers displayed in ceramic pots
         ══════════════════════════════════════════════════════════ */}
      <div
        className="w-full relative"
        style={{ background: 'linear-gradient(to bottom, #FAEBD7 0%, #FDF0E0 100%)' }}
      >
        {/* Shelf area: category tabs + scrollable pots */}
        <div className="max-w-7xl mx-auto pt-4 pb-0">
          <FlowerCrateShelf
            selectedFlowers={bouquet.flowers}
            onAddFlower={handleAddFlower}
            onRemoveFlower={handleRemoveFlower}
          />
        </div>

        {/* Dark tile strip below the shelf (like the reference dark tiled back wall) */}
        <div
          className="w-full h-7 relative overflow-hidden"
          style={{ background: '#3D2B1F' }}
        >
          {/* Tile grout lines */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 60px),
                repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 28px)
              `,
            }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          4. PINK FLORIST COUNTER — 3-column layout
         ══════════════════════════════════════════════════════════ */}
      <div
        className="w-full relative"
        style={{ background: 'linear-gradient(to bottom, #E87EA0 0%, #D86490 40%, #C85880 100%)', minHeight: '500px' }}
      >
        {/* Counter top highlight edge */}
        <div
          className="w-full h-2.5 relative"
          style={{ background: 'linear-gradient(to right, #F090B0 0%, #FAAAC0 50%, #F090B0 100%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {/* 3-column grid: Register | Bouquet | Finishing Touch */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* ── LEFT: Vintage Cash Register ── */}
            <div className="lg:col-span-3 flex justify-center order-2 lg:order-1">
              <VintageCashRegister
                totalPrice={totalPrice}
                stemCount={totalStems}
                onCheckoutClick={() => setIsReviewDrawerOpen(true)}
              />
            </div>

            {/* ── CENTER: Live Bouquet Preview ── */}
            <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
              <LiveBouquetCounter
                selectedFlowers={bouquet.flowers}
                wrapping={bouquet.wrapping}
                ribbon={bouquet.ribbon}
                note={bouquet.note}
                onSelectWrapping={handleSelectWrapping}
                onOpenNoteModal={() => setIsNoteModalOpen(true)}
                onClearBouquet={handleClearBouquet}
              />
            </div>

            {/* ── RIGHT: Finishing Touch & Note ── */}
            <div className="lg:col-span-3 flex justify-center order-3">
              <FinishingTouchBar
                selectedRibbon={bouquet.ribbon}
                onSelectRibbon={handleSelectRibbon}
                hasNote={bouquet.note.isTucked && bouquet.note.message.length > 0}
                noteRecipient={bouquet.note.recipient}
                onOpenNoteModal={() => setIsNoteModalOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Counter front face (bottom trim) */}
        <div
          className="w-full h-6 relative"
          style={{ background: '#B84E70' }}
        />
      </div>

      {/* ── 5. Mobile Sticky Bottom Action Bar ── */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 backdrop-blur-md border-t p-3 z-30 shadow-lg flex items-center justify-between"
        style={{ background: 'rgba(255,248,240,0.96)', borderColor: 'rgba(100,22,35,0.15)' }}
      >
        <div>
          <span className="text-[11px] font-bold text-[#641623]/70 uppercase block leading-tight">
            {totalStems} {totalStems === 1 ? 'stem' : 'stems'} chosen
          </span>
          <span className="font-['Fredoka'] font-black text-lg text-[#811B2B]">
            ₹{totalPrice.toLocaleString('en-IN')}
          </span>
        </div>

        <button
          type="button"
          disabled={totalStems === 0}
          onClick={() => setIsReviewDrawerOpen(true)}
          className={`py-2.5 px-5 rounded-full font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
            totalStems > 0
              ? 'bg-[#811B2B] text-white hover:bg-[#641623] cursor-pointer'
              : 'bg-[#C8B8A6] text-white/70 cursor-not-allowed'
          }`}
        >
          <span>Review Bouquet</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── 6. Modals & Drawers ── */}
      <GiftNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        initialRecipient={bouquet.note.recipient}
        initialMessage={bouquet.note.message}
        initialSender={bouquet.note.sender}
        initialStyleId={bouquet.note.cardStyle}
        onSaveNote={handleSaveNote}
      />

      <BouquetReviewDrawer
        isOpen={isReviewDrawerOpen}
        onClose={() => setIsReviewDrawerOpen(false)}
        selectedFlowers={bouquet.flowers}
        wrapping={bouquet.wrapping}
        ribbon={bouquet.ribbon}
        note={bouquet.note}
        onAddFlower={handleAddFlower}
        onRemoveFlower={handleRemoveFlower}
        onOpenNoteModal={() => {
          setIsReviewDrawerOpen(false);
          setIsNoteModalOpen(true);
        }}
        onAddToCart={handleConfirmAddToCart}
      />

      {/* ── 7. How It Works Modal ── */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-xs"
            onClick={() => setShowHowItWorks(false)}
          />
          <div className="relative w-full max-w-md bg-[#FAF4ED] rounded-3xl border-2 border-[#641623] p-6 text-left shadow-2xl z-10">
            <h3 className="font-bold text-xl text-[#641623] mb-3">
              How the Bouquet Bar Works 🌸
            </h3>
            <ol className="space-y-2.5 text-xs sm:text-sm text-[#641623]/85 font-medium leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#811B2B] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                  1
                </span>
                <span>
                  <strong>Pick Your Stems:</strong> Browse the top crates and tap individual crochet flowers to add them to your wrapping paper.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#811B2B] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                  2
                </span>
                <span>
                  <strong>Choose Wrapping &amp; Bow:</strong> Select your favorite paper color and matching ribbon bow.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#811B2B] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                  3
                </span>
                <span>
                  <strong>Write a Gift Card:</strong> Type your heartfelt message and tuck it into the blooms.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#811B2B] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                  4
                </span>
                <span>
                  <strong>Checkout:</strong> Click the vintage register to send your creation to our 200+ daadis to hand-crochet and dispatch!
                </span>
              </li>
            </ol>
            <button
              type="button"
              onClick={() => setShowHowItWorks(false)}
              className="mt-5 w-full py-2.5 bg-[#811B2B] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#641623] cursor-pointer"
            >
              Got it, let&apos;s build! →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
