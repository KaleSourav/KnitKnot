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
  ChevronRight,
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
  const [hasRibbonChosen, setHasRibbonChosen] = useState(false);

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
    setHasRibbonChosen(false);
    showToast('Cleared your bouquet. Start fresh! 🌸');
  };

  // ── Wrapping & Ribbon ────────────────────────────────────────────────────────
  const handleSelectWrapping = (wrapping: WrappingOption) => {
    setBouquet((prev) => ({ ...prev, wrapping }));
    showToast(`Changed wrapping paper to ${wrapping.name}`);
  };

  const handleSelectRibbon = (ribbon: RibbonOption) => {
    setBouquet((prev) => ({ ...prev, ribbon }));
    setHasRibbonChosen(true);
    showToast(`Tied ${ribbon.name} around your bouquet! 🎀`);
  };

  const handleUndoRibbon = () => {
    setHasRibbonChosen(false);
    showToast('Unwrapped bouquet. Choose another ribbon!');
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

  // Helper status text on green subway tiles (matching Petal Post stages)
  let statusBannerText = 'Pick your flowers. We’ll wrap them when you choose a ribbon.';
  if (totalStems > 0 && !hasRibbonChosen) {
    statusBannerText = 'A few more stems, then choose your ribbon.';
  } else if (hasRibbonChosen && !(bouquet.note.isTucked && bouquet.note.message.length > 0)) {
    statusBannerText = 'A note makes it personal. Your bouquet is ready to send.';
  } else if (bouquet.note.isTucked && bouquet.note.message.length > 0) {
    statusBannerText = 'Your handwritten note is tucked into the flowers. Ready to send!';
  }

  // ── Add Complete Bouquet to Shopify Cart ────────────────────────────────────
  const handleConfirmAddToCart = async (deliveryDetails: {
    address: string;
    date: string;
    notes: string;
  }) => {
    if (totalStems === 0) return;

    // Build line item payload for Shopify Cart API
    const lines = flowerItems.map(({ flower, quantity }) => {
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
      setIsReviewDrawerOpen(false);
      openCart();
    }
  };

  return (
    <div
      className="w-full min-h-screen lg:h-screen lg:max-h-[960px] flex flex-col justify-between font-['Fredoka'] select-none relative overflow-x-hidden"
      style={{ background: '#FFF8F0' }}
    >
      {/* ── 0. Toast Notification Pill ── */}
      {toastMessage && (
        <div
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50 text-white px-5 py-2 rounded-full font-bold text-xs shadow-lg flex items-center gap-2"
          style={{ background: '#811B2B', animation: 'fadeInDown 0.3s ease' }}
        >
          <span>🌸</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Slim Burgundy Top Bar ── */}
      <div
        className="w-full text-white py-1.5 px-4 relative z-30 flex-shrink-0"
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
          <span className="hidden md:block font-['Satisfy'] text-sm sm:text-base text-[#FFF5CC]">
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
          2. RETRO CHECKERBOARD SHOP WALL + 3D SHOP SIGN
          1970s mod wavy checkered boutique wall with 3D plaque
         ══════════════════════════════════════════════════════════ */}
      <div
        className="w-full relative overflow-hidden bg-cover bg-center flex-shrink-0"
        style={{
          backgroundImage: "url('/boutique/shop-wall-sign.jpg')",
          height: '160px',
        }}
      >
        {/* Subtle warm lighting vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.1) 100%)',
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════
          3. PINK FLOWER SHELF — Photorealistic milk crates & buckets
         ══════════════════════════════════════════════════════════ */}
      <div
        className="w-full relative flex-shrink-0"
        style={{ background: 'linear-gradient(to bottom, #FFF5EB 0%, #FFE9D9 100%)' }}
      >
        <div className="max-w-7xl mx-auto pt-2 pb-0">
          <FlowerCrateShelf
            selectedFlowers={bouquet.flowers}
            onAddFlower={handleAddFlower}
            onRemoveFlower={handleRemoveFlower}
            hasRibbon={hasRibbonChosen}
            hasNote={bouquet.note.isTucked && bouquet.note.message.length > 0}
          />
        </div>

        {/* Glossy dark emerald green subway tile backsplash with status pill */}
        <div
          className="w-full h-11 relative overflow-hidden bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage: "url('/boutique/green-subway-tiles.jpg')",
            backgroundRepeat: 'repeat-x',
          }}
        >
          {/* Subtle glossy glass reflection line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-white/30" />

          {/* Floating white status guidance pill matching Petal Post */}
          <div className="z-10 bg-white/95 text-[#641623] px-4 py-1 rounded-full font-['Fredoka'] font-bold text-[11px] sm:text-xs shadow-md border border-[#641623]/20 flex items-center gap-1.5 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{statusBannerText}</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          4. GLOSSY PINK FLORIST COUNTER — Register | Bouquet | Ribbons
         ══════════════════════════════════════════════════════════ */}
      <div
        className="w-full relative overflow-hidden flex-1 flex flex-col justify-between"
        style={{
          background: 'linear-gradient(to bottom, #F472B6 0%, #EC4899 45%, #DB2777 100%)',
          minHeight: '390px',
        }}
      >
        {/* Subtle photographic counter surface texture overlay */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: "url('/boutique/pink-counter-surface.jpg')" }}
        />

        {/* Counter top highlight edge */}
        <div
          className="w-full h-2 relative z-10"
          style={{ background: 'linear-gradient(to right, #FBCFE8 0%, #FDF2F8 50%, #FBCFE8 100%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 relative z-10 w-full flex-1 flex items-center">
          {/* 3-column layout: Register | Bouquet | Finishing Touch */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center w-full">
            {/* ── LEFT: 3D Vintage Cash Register ── */}
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
                hasRibbonChosen={hasRibbonChosen}
                onSelectWrapping={handleSelectWrapping}
                onOpenNoteModal={() => setIsNoteModalOpen(true)}
                onClearBouquet={handleClearBouquet}
                onUndoRibbon={handleUndoRibbon}
              />
            </div>

            {/* ── RIGHT: Finishing Touch & Note ── */}
            <div className="lg:col-span-3 flex justify-center order-3">
              <FinishingTouchBar
                selectedRibbon={bouquet.ribbon}
                onSelectRibbon={handleSelectRibbon}
                hasRibbonChosen={hasRibbonChosen}
                hasNote={bouquet.note.isTucked && bouquet.note.message.length > 0}
                noteRecipient={bouquet.note.recipient}
                noteMessage={bouquet.note.message}
                onOpenNoteModal={() => setIsNoteModalOpen(true)}
                onChangeRibbonClick={() => setHasRibbonChosen(false)}
              />
            </div>
          </div>
        </div>

        {/* Counter front edge */}
        <div
          className="w-full h-4 relative z-10 flex-shrink-0"
          style={{ background: '#BE185D' }}
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
          <span className="text-lg font-black text-[#811B2B] leading-none">
            ₹{totalPrice.toLocaleString('en-IN')}
          </span>
        </div>

        <button
          type="button"
          disabled={totalStems === 0}
          onClick={() => setIsReviewDrawerOpen(true)}
          className={`px-5 py-2.5 rounded-full font-['Fredoka'] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
            totalStems > 0
              ? 'bg-[#FBBF24] text-black hover:bg-[#F59E0B] shadow-[#D97706]/40 cursor-pointer active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Send Flowers</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── 6. Modals ── */}
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
        bouquet={bouquet}
        onConfirm={handleConfirmAddToCart}
      />

      {/* ── 7. How It Works Modal ── */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none">
          <div
            className="w-full max-w-md rounded-3xl p-6 shadow-2xl relative border-2 border-[#811B2B]/20"
            style={{ background: '#FFFDF9' }}
          >
            <button
              type="button"
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
            <h3 className="font-['Fredoka'] font-black text-xl text-[#811B2B] mb-3">
              How Make Your Own Bouquet Works
            </h3>
            <ol className="space-y-3 text-xs sm:text-sm text-[#641623]/80 font-medium">
              <li className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#811B2B] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span>
                  <strong>Pick Your Flowers:</strong> Browse the shelves and click flower crates to add stems to your wrapping paper.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#811B2B] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <span>
                  <strong>Choose a Ribbon:</strong> Pick a satin ribbon bow on the right to cinch and wrap your bouquet into a crepe paper cone!
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#811B2B] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <span>
                  <strong>Write a Little Note:</strong> Pick a stationery card and tuck a handwritten greeting into the blooms.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#811B2B] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  4
                </span>
                <span>
                  <strong>Send Flowers:</strong> Hit the yellow button on the register to send your handmade bouquet directly to your cart or loved ones!
                </span>
              </li>
            </ol>
            <button
              type="button"
              onClick={() => setShowHowItWorks(false)}
              className="w-full mt-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white cursor-pointer shadow-sm"
              style={{ background: '#811B2B' }}
            >
              Got it, let's bloom! 🌸
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
