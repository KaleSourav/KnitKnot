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
    <div className="w-full min-h-screen bg-[#FFFDF9] font-['Fredoka'] select-none relative pb-24 sm:pb-16 overflow-x-hidden">
      {/* ── 0. Toast Notification Pill ── */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#811B2B] text-white px-4 py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-[#FFF5CC]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Top Retro Header & Store Sign ── */}
      <div className="w-full bg-[#811B2B] text-white py-2.5 px-4 border-b border-[#641623] relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-bold">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Knots &amp; Co</span>
          </button>

          <span className="hidden md:inline-block font-script text-base text-[#FFF5CC]">
            &ldquo;A little something, made by you.&rdquo; ♡
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

      {/* ── 2. The Boutique Wallpaper & Wooden Sign Wall ── */}
      <div className="w-full bg-gradient-to-b from-[#FFF5CC]/60 via-[#FFFDF9] to-[#FAF4ED] pt-6 pb-4 border-b border-[#641623]/10 relative">
        {/* Subtle Checkered Wall Pattern Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#811B2B 1.2px, transparent 1.2px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center relative z-10">
          {/* Hanging Wooden Boutique Shop Sign */}
          <div className="inline-block relative mb-2 max-w-[95vw]">
            <div className="bg-[#FFFDF9] border-[2.5px] border-[#641623] px-4 sm:px-10 py-2 sm:py-2.5 rounded-2xl shadow-[0_6px_18px_rgba(100,22,35,0.12)]">
              <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-[#811B2B] block">
                Knots &amp; Co. Flower Boutique
              </span>
              <h1 className="font-['Fredoka'] font-black text-xl sm:text-3xl md:text-4xl text-[#641623] tracking-tight leading-none mt-0.5">
                MAKE YOUR OWN BOUQUET
              </h1>
            </div>
          </div>

          <p className="font-['Fredoka'] text-xs sm:text-sm text-[#641623]/80 max-w-lg mx-auto leading-relaxed font-medium px-2">
            Pick your favourite blooms from our shelves, wrap them up, add a ribbon and tuck in a sweet note.
          </p>
        </div>
      </div>

      {/* ── 3. The Flower Shelf (Step One: Choose Your Blooms) ── */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 pt-5 pb-6">
        <FlowerCrateShelf
          selectedFlowers={bouquet.flowers}
          onAddFlower={handleAddFlower}
          onRemoveFlower={handleRemoveFlower}
        />
      </div>

      {/* ── 4. The Flower Shop Counter (Center Stage) ── */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-2 pb-12">
        {/* Countertop Surface Board */}
        <div className="w-full bg-[#FAF3EA] rounded-[36px] sm:rounded-[44px] border-[2.5px] border-[#641623] p-4 sm:p-8 shadow-[0_18px_45px_rgba(100,22,35,0.12)] relative">
          {/* Counter Trim Bar */}
          <div className="absolute inset-x-8 top-3 h-1 bg-white/60 rounded-full pointer-events-none" />

          {/* 3-Column Desktop Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Vintage Cash Register */}
            <div className="lg:col-span-3 flex justify-center order-2 lg:order-1">
              <VintageCashRegister
                totalPrice={totalPrice}
                stemCount={totalStems}
                onCheckoutClick={() => setIsReviewDrawerOpen(true)}
              />
            </div>

            {/* Center Column: Live Bouquet Builder Stage */}
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

            {/* Right Column: Finishing Touch & Note Station */}
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
      </div>

      {/* ── 5. Mobile Sticky Bottom Action Bar ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-[#641623]/20 p-3 z-30 shadow-lg flex items-center justify-between">
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
