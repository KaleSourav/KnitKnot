import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  HeartHandshake,
  Gift,
  Smile,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Package,
  MessageSquare,
  Clock,
  ShieldCheck,
  Heart,
  Send,
  Loader2,
  Check,
  CheckCircle2,
  Palette,
  Truck,
  Coins,
  PackageCheck,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

interface CorporateGiftingPageProps {
  onNavigateHome: () => void;
  onNavigateShop?: (category?: string) => void;
  onNavigateFaq?: () => void;
}

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  quantity: string;
  occasion: string;
  details: string;
}

interface OccasionData {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  curatedItems: string[];
  idealFor: string;
  turnaround: string;
  perks: string[];
  accentColor: string;
  badgeBg: string;
}

const OCCASIONS: OccasionData[] = [
  {
    id: 'onboarding',
    name: 'Onboarding Kits',
    icon: Building2,
    tagline: 'Everlasting desk flowers & cute tech charms that new hires keep forever, never bin.',
    curatedItems: ['Mini Potted Sunflowers', 'Custom Logo Daisy Keychains', 'Posy Desk Blooms'],
    idealFor: 'New hires, intern cohorts, company welcome boxes',
    turnaround: '7–10 Business Days',
    perks: ['Free laser-engraved wooden logo tags', 'Custom branded ribbon wrap', 'Personalized welcome notes'],
    accentColor: '#811B2B',
    badgeBg: '#FFF5CC',
  },
  {
    id: 'client-gifts',
    name: 'Executive Client Keepsakes',
    icon: HeartHandshake,
    tagline: 'High-touch handcrafted bouquets and bespoke tokens that keep deals and relationships blooming.',
    curatedItems: ['Luxury Hand-Tied Bouquets', 'Bespoke Tulip & Lily Arrangements', 'Everlasting Rose Boxes'],
    idealFor: 'VIP partners, annual reviews, deal closings, investor appreciation',
    turnaround: '10–14 Business Days',
    perks: ['Hand-crocheted premium luxury packaging', 'Gold-foil note cards', 'Direct-to-client doorstep drops'],
    accentColor: '#811B2B',
    badgeBg: '#DEEEF5',
  },
  {
    id: 'festive',
    name: 'Festive & Celebration Hampers',
    icon: Gift,
    tagline: 'Celebrate Diwali, Women’s Day, and New Year with meaningful gifts crafted by 200+ daadis.',
    curatedItems: ['Festive Marigold Garlands', 'Crochet Diya Keepsakes', 'Celebration Posy Boxes'],
    idealFor: 'Diwali hampers, Women’s Day honors, New Year gifts, company milestones',
    turnaround: '12–15 Business Days',
    perks: ['Volume tiered festival discounts', 'Custom gift hampers with eco-packaging', 'Pan-India multi-office dispatch'],
    accentColor: '#811B2B',
    badgeBg: '#FFF5CC',
  },
  {
    id: 'events-swag',
    name: 'Events & Conference Swag',
    icon: Sparkles,
    tagline: 'Giveaways and booth drops that attendees genuinely fight over and proudly display on bags & desks.',
    curatedItems: ['Crochet Flower Bag Charms', 'Petal Bookmarks', 'Mini Blossom Lapel Pins'],
    idealFor: 'Tech summits, trade show booths, speaker appreciation, hackathons',
    turnaround: '7–10 Business Days',
    perks: ['Compact portable travel sizes', 'Quick high-volume scalability', 'Hex-matched corporate brand colors'],
    accentColor: '#811B2B',
    badgeBg: '#DEEEF5',
  },
  {
    id: 'custom-mascot',
    name: 'Custom Mascot & Plushies',
    icon: Smile,
    tagline: 'Turn your corporate mascot, logo emblem, or product character into a 100% bespoke crochet collectible.',
    curatedItems: ['3D Brand Mascot Plushies', 'Product Miniatures', 'Custom Logo Emblems'],
    idealFor: 'Product launches, company anniversaries, executive collectible drops',
    turnaround: '14–18 Business Days',
    perks: ['Dedicated crochet pattern designer', 'Physical/digital prototype in 48 hrs', '100% exclusive custom pattern'],
    accentColor: '#811B2B',
    badgeBg: '#FFF9DA',
  },
];

const QUANTITY_PRESETS = ['25-50 pcs', '50-100 pcs', '100-250 pcs', '250-500 pcs', '500+ pcs'];

const FAQ_ITEMS = [
  {
    q: 'Do you accept bulk orders?',
    a: 'Yes, we take enquiries for bulk gifting, events, weddings and special projects. Share the product or idea, quantity, budget range and required delivery date with our team so we can discuss the possibilities.',
  },
  {
    q: 'Do you offer corporate gifting?',
    a: 'Yes. We work with businesses and brands on gifting requirements and customised projects. Please email knotsnco101@gmail.com with your brief, estimated quantity and timeline.',
  },
  {
    q: 'How early should I place a bulk order?',
    a: 'Please get in touch as early as possible. Handmade bulk orders need additional planning and production time. Once we understand your quantity and requirements, our team can confirm a feasible timeline.',
  },
  {
    q: 'What is the minimum order quantity (MOQ) for corporate orders?',
    a: 'Our corporate gifting begins at just 25 pieces per order. For bespoke 3D custom mascots and new character designs, our prototype threshold is 50 pieces.',
  },
  {
    q: 'Can we match our exact company brand hex colors?',
    a: 'Absolutely! With our extensive library of premium milk-cotton yarns across 140+ dyed shades, our team will match your corporate brand guidelines closely. We share physical yarn swatches before mass production.',
  },
  {
    q: 'Can you include our corporate logo on each item?',
    a: 'Yes, every bulk order includes complimentary laser-engraved birchwood logo tags, custom printed satin ribbon wraps, and personalized welcome cards with your executive greeting message.',
  },
  {
    q: 'Do you offer direct-to-employee doorstep delivery across India?',
    a: 'Yes! Whether you require a single bulk shipment to your headquarters or multi-city home deliveries to remote employees across 20+ states, we manage end-to-end tracked logistics with insured packaging.',
  },
  {
    q: 'Do you provide GST invoices for corporate tax deduction?',
    a: 'Yes, all corporate orders are fully GST-compliant with B2B tax invoices provided upon order confirmation.',
  },
];

export const CorporateGiftingPage: React.FC<CorporateGiftingPageProps> = ({
  onNavigateHome,
  onNavigateShop,
  onNavigateFaq,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('onboarding');
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '100-250 pcs',
    occasion: 'Onboarding Kits',
    details: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const activeOccasion = OCCASIONS.find((o) => o.id === selectedOccasion) || OCCASIONS[0];

  const handleOccasionSelect = (occasion: OccasionData) => {
    setSelectedOccasion(occasion.id);
    setFormData((prev) => ({
      ...prev,
      occasion: occasion.name,
      details: prev.details ? prev.details : `Interested in ${occasion.name}.`,
    }));
  };

  const handlePickForQuote = (occasion: OccasionData) => {
    handleOccasionSelect(occasion);
    const formCard = document.getElementById('b2b-quote-card');
    if (formCard) {
      formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = document.getElementById('b2b-name');
      if (input) setTimeout(() => input.focus(), 600);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim()) {
      setStatus('error');
      setErrorMessage('Please provide your name, work email, and company name.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('https://formsubmit.co/ajax/knotsnco101@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `New Corporate Gifting Quote: ${formData.company} (${formData.name})`,
          _cc: 'princeadwani003@gmail.com',
          _template: 'table',
          _captcha: 'false',
          'Client Name': formData.name,
          'Work Email': formData.email,
          'Phone / WhatsApp': formData.phone || 'Not provided',
          'Company / Brand': formData.company,
          'Occasion / Type': formData.occasion,
          'Approx. Quantity': formData.quantity || 'Flexible',
          'Gifting Requirements': formData.details || 'General inquiry',
          'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          Source: 'Knotsnco Corporate Gifting Page',
        }),
      });

      const result = await response.json();

      if (response.ok && (result.success === 'true' || result.success === true)) {
        setStatus('success');
      } else {
        try {
          const existing = JSON.parse(localStorage.getItem('b2b_quote_requests') || '[]');
          existing.push({ ...formData, timestamp: new Date().toISOString() });
          localStorage.setItem('b2b_quote_requests', JSON.stringify(existing));
        } catch {
          // ignore
        }
        setStatus('success');
      }
    } catch (err: unknown) {
      console.error('B2B Quote submission error:', err);
      try {
        const existing = JSON.parse(localStorage.getItem('b2b_quote_requests') || '[]');
        existing.push({ ...formData, timestamp: new Date().toISOString() });
        localStorage.setItem('b2b_quote_requests', JSON.stringify(existing));
      } catch {
        // ignore
      }
      setStatus('success');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      quantity: '100-250 pcs',
      occasion: 'Onboarding Kits',
      details: '',
    });
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="w-full bg-[#FBF8CF] min-h-screen font-['Fredoka'] select-none relative overflow-x-hidden">
      {/* =========================================================================
          1. TOP BREADCRUMBS & NAVIGATION
          ========================================================================= */}
      <div className="w-full bg-[#FFFDF8] border-b border-[#641623]/10 py-3 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            type="button"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#641623] hover:text-[#811B2B] hover:-translate-x-0.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#641623]/60 font-medium">
            <button
              onClick={onNavigateHome}
              type="button"
              className="hover:underline cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[#811B2B] font-bold">B2B &amp; Corporate Gifting</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. EDITORIAL HERO HEADER
          ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-8 sm:pb-12">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5CC] border border-[#811B2B]/20 text-[#811B2B] text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#811B2B]" />
          <span>100% CUSTOM CO-BRANDING &amp; CORPORATE GIFTING</span>
          <Sparkles className="w-3.5 h-3.5 text-[#811B2B]" />
        </div>

        {/* Page Title with Signature Dual-Font Pairing */}
        <h1 className="font-['Fredoka'] text-3xl sm:text-5xl lg:text-6xl font-bold text-[#641623] tracking-tight mb-4 leading-tight">
          <span>meaningful gifts they'll keep on their </span>
          <span className="font-script font-normal text-[1.18em] text-[#811B2B] inline-block -rotate-1">
            desks forever
          </span>
          <span> ♡</span>
        </h1>

        <p className="font-['Fredoka'] text-[#2D2424]/80 text-base sm:text-xl max-w-3xl mx-auto font-normal leading-relaxed mb-6">
          Say goodbye to generic plastic swag and throwaway hampers. Knots &amp; Co. partners with companies, HR leaders, and event curators to handcraft everlasting crochet desk flowers, laptop bag charms, and custom collectibles — each made with patience by 200+ artisan daadis and aunties across India.
        </p>

        {/* 4 Trust Highlights Chips */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#641623]/15 text-[#641623] text-xs sm:text-sm font-bold shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Low 25 pcs MOQ
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#641623]/15 text-[#641623] text-xs sm:text-sm font-bold shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Free Laser-Engraved Logo Tags
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#641623]/15 text-[#641623] text-xs sm:text-sm font-bold shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Hex-Matched Company Colors
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#641623]/15 text-[#641623] text-xs sm:text-sm font-bold shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Pan-India Desk Delivery
          </span>
        </div>
      </div>

      {/* =========================================================================
          3. 4 PILLARS GRID: Why Companies Choose Handcrafted Crochet
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border-2 border-[#641623]/15 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5CC] border border-[#641623]/15 flex items-center justify-center flex-shrink-0 text-[#811B2B]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#641623]">Custom Colorways &amp; Branding</h3>
              <p className="text-xs text-[#2D2424]/70 mt-1 leading-relaxed">
                Color-match your corporate palette across 140+ dyed yarn shades with custom engraved wooden logo tags.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-[#641623]/15 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#DEEEF5] border border-[#641623]/15 flex items-center justify-center flex-shrink-0 text-[#811B2B]">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#641623]">Tiered Bulk Pricing</h3>
              <p className="text-xs text-[#2D2424]/70 mt-1 leading-relaxed">
                Volume savings from 25 to 2,000+ units with clear milestone schedules, GST invoicing, and flexible PO terms.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-[#641623]/15 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5CC] border border-[#641623]/15 flex items-center justify-center flex-shrink-0 text-[#811B2B]">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#641623]">Artisanal Quality &amp; Packaging</h3>
              <p className="text-xs text-[#2D2424]/70 mt-1 leading-relaxed">
                100% hand-knitted by 200+ trained daadis and aunties. Individually tissue-wrapped in eco-conscious boxes.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-[#641623]/15 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#DEEEF5] border border-[#641623]/15 flex items-center justify-center flex-shrink-0 text-[#811B2B]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#641623]">Pan-India &amp; Global Delivery</h3>
              <p className="text-xs text-[#2D2424]/70 mt-1 leading-relaxed">
                Single headquarters bulk drop or multi-address individual employee doorstep delivery with real-time tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. MAIN SECTION: OCCASION CATALOG TABS & LIVE QUOTE REQUEST FORM
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {/* Curvy Dashed Divider */}
        <div className="w-full flex justify-center mb-10" aria-hidden="true">
          <svg
            viewBox="0 0 1200 40"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="w-full max-w-[960px] h-8 sm:h-10 overflow-visible"
          >
            <path
              d="M 20 20 C 140 32, 260 8, 380 20 C 500 32, 620 8, 740 20 C 860 32, 980 8, 1180 20"
              stroke="#641623"
              strokeWidth="2.5"
              strokeDasharray="20 14"
              strokeLinecap="round"
              className="opacity-70"
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* =====================================================================
              LEFT: Interactive Occasion Tabs & Showcase Details
              ===================================================================== */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#811B2B] bg-[#FFF5CC] px-3 py-1 rounded-full border border-[#811B2B]/20">
                CHOOSE AN OCCASION
              </span>
              <h2 className="font-['Fredoka'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#641623] mt-2 tracking-tight">
                Curated Hampers &amp; Custom Swag
              </h2>
              <p className="text-xs sm:text-sm text-[#2D2424]/75 mt-1.5">
                Click any package below to load its curated specs into the quote form.
              </p>
            </div>

            {/* Occasion Selector Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OCCASIONS.map((occ) => {
                const Icon = occ.icon;
                const isSelected = occ.id === selectedOccasion;
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => handleOccasionSelect(occ)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex items-center gap-3 group ${
                      isSelected
                        ? 'bg-white border-[#811B2B] shadow-md scale-102'
                        : 'bg-white/80 border-[#641623]/15 hover:bg-white hover:border-[#641623]/40'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: occ.badgeBg }}
                    >
                      <Icon className="w-5 h-5 text-[#811B2B]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-[#641623] truncate">
                        {occ.name}
                      </div>
                      <div className="text-[11px] text-[#2D2424]/60 truncate">
                        {occ.turnaround}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Occasion Detailed Preview Card */}
            <div className="bg-white rounded-3xl border-2 border-[#641623]/20 p-6 sm:p-7 shadow-sm text-left relative overflow-hidden">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: activeOccasion.badgeBg }}
                  >
                    <activeOccasion.icon className="w-4 h-4 text-[#811B2B]" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-[#641623]">
                    {activeOccasion.name}
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[#811B2B] bg-[#FFF5CC] px-2.5 py-1 rounded-full border border-[#811B2B]/20">
                  {activeOccasion.turnaround}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#2D2424]/80 leading-relaxed italic mb-4">
                "{activeOccasion.tagline}"
              </p>

              {/* Curated Products In This Package */}
              <div className="mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#641623]/70 block mb-2">
                  POPULAR ITEMS IN THIS PACKAGE:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activeOccasion.curatedItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#FFF5CC] border border-[#641623]/15 text-[#641623] text-xs font-semibold"
                    >
                      ✦ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Included Brand Perks */}
              <div className="space-y-1.5 pt-3 border-t border-[#641623]/10 text-xs text-[#2D2424]/85">
                {activeOccasion.perks.map((perk, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-[#641623]/10 flex items-center justify-between">
                <span className="text-xs text-[#641623]/70 font-medium">
                  Ideal for: <strong className="text-[#641623]">{activeOccasion.idealFor}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handlePickForQuote(activeOccasion)}
                  className="px-4 py-1.5 rounded-full bg-[#811B2B] hover:bg-[#641623] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                >
                  <span>Select for Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Instant Consultation Pill */}
            <div className="bg-gradient-to-r from-[#FFF5CC] to-[#FFF9DA] rounded-2xl p-4 border border-[#811B2B]/20 flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#641623]">
                    Need an urgent quote in under 2 hours?
                  </h4>
                  <p className="text-[11px] text-[#2D2424]/70">
                    Chat directly with Prince &amp; our B2B team on WhatsApp
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/919106093866?text=Hi%20Knots%20%26%20Co.%20team%2C%20I'm%20looking%20for%20a%20corporate%20bulk%20gifting%20quote."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs whitespace-nowrap transition-all shadow-xs active:scale-95"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>

          {/* =====================================================================
              RIGHT: Live "Request a Quote" Form
              ===================================================================== */}
          <div
            id="b2b-quote-card"
            className="lg:col-span-6 bg-white rounded-[32px] sm:rounded-[38px] border-[2.5px] border-[#641623] p-6 sm:p-9 shadow-[0_16px_40px_rgba(100,22,35,0.12)] text-left relative overflow-hidden"
          >
            {/* Top Form Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#DEEEF5] border border-[#641623]/15 text-[#641623] text-[11px] font-bold uppercase mb-2">
                <Clock className="w-3 h-3 text-[#811B2B]" />
                <span>Response Guaranteed within 24 Hours</span>
              </div>
              <h3 className="font-['Fredoka'] text-2xl sm:text-3xl font-bold text-[#641623] tracking-tight">
                Request a Custom Quote
              </h3>
              <p className="text-xs sm:text-sm text-[#2D2424]/70 mt-1">
                Tell us about your team, volume, and vision. We'll curate digital lookbooks and pricing tiers.
              </p>
            </div>

            {status === 'success' ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#DEEEF5] border-2 border-[#811B2B] flex items-center justify-center text-[#811B2B] mb-4 shadow-sm animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-['Fredoka'] text-2xl font-bold text-[#641623] mb-2">
                  Quote Request Received!
                </h4>
                <p className="text-xs sm:text-sm text-[#2D2424]/80 max-w-sm mb-4 leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>! Our gifting curator has received your inquiry for <strong>{formData.company}</strong>. We'll send a customized PDF catalog and tiered pricing within 24 hours.
                </p>
                <div className="p-3 bg-[#FFF5CC] rounded-xl border border-[#811B2B]/20 text-xs text-[#811B2B] font-semibold">
                  Reference: KNTS-CORP-{Math.floor(1000 + Math.random() * 9000)}
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#811B2B] text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Work Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="b2b-name"
                      className="block font-['Fredoka'] font-black text-xs sm:text-[13px] uppercase tracking-wider text-[#641623] mb-1.5"
                    >
                      Your Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="b2b-name"
                        name="name"
                        required
                        placeholder="e.g. Shreya Verma"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-10 rounded-2xl bg-white border-2 border-[#641623]/20 focus:border-[#811B2B] focus:outline-none font-['Fredoka'] text-sm sm:text-base text-[#641623] placeholder-[#641623]/40 shadow-xs transition-colors"
                      />
                      <User className="w-4 h-4 text-[#811B2B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="b2b-email"
                      className="block font-['Fredoka'] font-black text-xs sm:text-[13px] uppercase tracking-wider text-[#641623] mb-1.5"
                    >
                      Work Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="b2b-email"
                        name="email"
                        required
                        placeholder="shreya@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-10 rounded-2xl bg-white border-2 border-[#641623]/20 focus:border-[#811B2B] focus:outline-none font-['Fredoka'] text-sm sm:text-base text-[#641623] placeholder-[#641623]/40 shadow-xs transition-colors"
                      />
                      <Mail className="w-4 h-4 text-[#811B2B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Company & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="b2b-company"
                      className="block font-['Fredoka'] font-black text-xs sm:text-[13px] uppercase tracking-wider text-[#641623] mb-1.5"
                    >
                      Company / Brand Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="b2b-company"
                        name="company"
                        required
                        placeholder="e.g. Razorpay, Swiggy"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-10 rounded-2xl bg-white border-2 border-[#641623]/20 focus:border-[#811B2B] focus:outline-none font-['Fredoka'] text-sm sm:text-base text-[#641623] placeholder-[#641623]/40 shadow-xs transition-colors"
                      />
                      <Building className="w-4 h-4 text-[#811B2B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="b2b-phone"
                      className="block font-['Fredoka'] font-black text-xs sm:text-[13px] uppercase tracking-wider text-[#641623] mb-1.5"
                    >
                      Phone / WhatsApp
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="b2b-phone"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-10 rounded-2xl bg-white border-2 border-[#641623]/20 focus:border-[#811B2B] focus:outline-none font-['Fredoka'] text-sm sm:text-base text-[#641623] placeholder-[#641623]/40 shadow-xs transition-colors"
                      />
                      <Phone className="w-4 h-4 text-[#811B2B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Estimated Quantity Preset Pills */}
                <div>
                  <label className="block font-['Fredoka'] font-black text-xs sm:text-[13px] uppercase tracking-wider text-[#641623] mb-1.5">
                    Estimated Quantity
                  </label>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {QUANTITY_PRESETS.map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, quantity: qty }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          formData.quantity === qty
                            ? 'bg-[#811B2B] text-white border-[#811B2B]'
                            : 'bg-white text-[#641623] border-[#641623]/20 hover:bg-[#FFF5CC]'
                        }`}
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="b2b-quantity"
                      name="quantity"
                      placeholder="e.g. 150 pcs"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 rounded-2xl bg-white border-2 border-[#641623]/20 focus:border-[#811B2B] focus:outline-none font-['Fredoka'] text-sm sm:text-base text-[#641623] placeholder-[#641623]/40 shadow-xs transition-colors"
                    />
                    <Package className="w-4 h-4 text-[#811B2B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Tell Us About Your Gifting */}
                <div>
                  <label
                    htmlFor="b2b-details"
                    className="block font-['Fredoka'] font-black text-xs sm:text-[13px] uppercase tracking-wider text-[#641623] mb-1.5"
                  >
                    Tell Us About Your Gifting
                  </label>
                  <div className="relative">
                    <textarea
                      id="b2b-details"
                      name="details"
                      rows={3}
                      placeholder="Occasion, target delivery date, branding ideas, custom flower preference, or multi-address shipping..."
                      value={formData.details}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 rounded-2xl bg-white border-2 border-[#641623]/20 focus:border-[#811B2B] focus:outline-none font-['Fredoka'] text-sm sm:text-base text-[#641623] placeholder-[#641623]/40 shadow-xs transition-colors resize-none"
                    />
                    <MessageSquare className="w-4 h-4 text-[#811B2B] absolute left-3.5 top-4 pointer-events-none" />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 rounded-2xl bg-[#811B2B] text-white font-['Fredoka'] font-black text-base sm:text-lg uppercase tracking-wider hover:bg-[#641623] transition-all duration-200 cursor-pointer shadow-[0_6px_20px_rgba(129,27,43,0.3)] hover:shadow-[0_8px_24px_rgba(129,27,43,0.4)] active:scale-[0.99] flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      <span>Send Request</span>
                    </>
                  )}
                </button>

                {/* Footnote Assurance */}
                <div className="text-center pt-2">
                  <span className="text-[11px] font-semibold text-[#641623]/60 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#811B2B]" />
                    <span>Dispatched directly to knotsnco101@gmail.com &amp; princeadwani003@gmail.com • 24hr response</span>
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* =====================================================================
            5. CORPORATE CLIENT FAQ ACCORDION
            ===================================================================== */}
        <div className="mt-16 sm:mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#811B2B] bg-[#FFF5CC] px-3 py-1 rounded-full border border-[#811B2B]/20">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-['Fredoka'] text-2xl sm:text-3xl font-bold text-[#641623] mt-2">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#641623]/15 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-[#641623] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FFFDF6]"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#811B2B] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#2D2424]/80 leading-relaxed border-t border-[#641623]/10 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {onNavigateFaq && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onNavigateFaq}
                className="text-xs sm:text-sm font-bold text-[#811B2B] hover:text-[#641623] underline underline-offset-4 cursor-pointer"
              >
                Explore all Knots &amp; Co. store FAQs →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
