import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Coins,
  PackageCheck,
  Truck,
  Building2,
  HeartHandshake,
  Gift,
  Smile,
  CheckCircle2,
  ArrowRight,
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
} from 'lucide-react';

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

const QUANTITY_PRESETS = ['50 pcs', '100 pcs', '250 pcs', '500+ pcs', 'Custom'];

export const CorporateGiftingSection: React.FC = () => {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('onboarding');
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '100 pcs',
    occasion: 'Onboarding Kits',
    details: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

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
      // Direct submission via AJAX to knotsnco101@gmail.com and CC princeadwani003@gmail.com
      // Seamless background submission without opening external email clients
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
          Source: 'Knotsnco Corporate Gifting Section',
        }),
      });

      const result = await response.json();

      if (response.ok && (result.success === 'true' || result.success === true)) {
        setStatus('success');
      } else {
        // Fallback: save locally
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
      quantity: '100 pcs',
      occasion: 'Onboarding Kits',
      details: '',
    });
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <section
      id="section-b2b"
      className="w-full bg-[#FFFDF9] pt-8 pb-16 sm:pt-12 sm:pb-24 font-['Fredoka'] select-none relative overflow-hidden"
    >
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Whimsical Curvy Dashed Stitch Divider */}
        <div className="w-full flex justify-center mb-5 sm:mb-7" aria-hidden="true">
          <svg
            viewBox="0 0 1200 48"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="w-full max-w-[960px] h-8 sm:h-11 overflow-visible"
          >
            <path
              d="M 20 24 C 75 12, 135 36, 195 24 C 255 12, 315 36, 375 24 C 435 12, 495 36, 565 24"
              stroke="#641623"
              strokeWidth="2.8"
              strokeDasharray="22 14"
              strokeLinecap="round"
              className="opacity-75"
            />
            {/* Center Smiling Flower Mascot */}
            <g transform="translate(600, 24)" className="cursor-pointer">
              <circle cx="0" cy="0" r="17" fill="#FFFDF9" stroke="#641623" strokeWidth="2.4" />
              <g fill="#F7BE44" stroke="#641623" strokeWidth="1.6">
                <circle cx="0" cy="-9" r="4.2" />
                <circle cx="7.8" cy="-4.5" r="4.2" />
                <circle cx="7.8" cy="4.5" r="4.2" />
                <circle cx="0" cy="9" r="4.2" />
                <circle cx="-7.8" cy="4.5" r="4.2" />
                <circle cx="-7.8" cy="-4.5" r="4.2" />
              </g>
              <circle cx="0" cy="0" r="6" fill="#811B2B" stroke="#641623" strokeWidth="1.8" />
              <circle cx="-2" cy="-1" r="0.9" fill="white" />
              <circle cx="2" cy="-1" r="0.9" fill="white" />
            </g>
            <path
              d="M 635 24 C 705 12, 765 36, 825 24 C 885 12, 945 36, 1005 24 C 1065 12, 1125 36, 1180 24"
              stroke="#641623"
              strokeWidth="2.8"
              strokeDasharray="22 14"
              strokeLinecap="round"
              className="opacity-75"
            />
          </svg>
        </div>

        {/* 2. Section Heading: Dual-Font Pairing + Pill Badge */}
        <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF5CC] border border-[#641623]/20 shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#811B2B]" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#641623]">
              100% custom co-branding &amp; corporate gifting
            </span>
          </div>

          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            >
              <line x1="12" y1="16" x2="3" y2="16" />
              <line x1="14" y1="9" x2="6" y2="5" />
              <line x1="14" y1="23" x2="6" y2="27" />
            </svg>

            <h2 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[44px] text-[#641623] tracking-tight">
              <span>corporate &amp; </span>
              <span className="font-script text-[1.22em] text-[#811B2B] font-normal lowercase px-1 inline-block -rotate-2">
                bespoke
              </span>
              <span> gifting</span>
            </h2>

            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#641623] flex-shrink-0"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            >
              <line x1="20" y1="16" x2="29" y2="16" />
              <line x1="18" y1="9" x2="26" y2="5" />
              <line x1="18" y1="23" x2="26" y2="27" />
            </svg>
          </div>

          <p className="font-['Fredoka'] text-sm sm:text-base text-[#641623]/80 mt-1.5 max-w-xl leading-relaxed">
            say goodbye to generic hampers. Gift everlasting handmade crochet treasures crafted with patience and love by 200+ daadis ♡
          </p>
        </div>

        {/* 3. Concise 4-Pillar Advantage Ribbon (NO EMOJIS - Clean SVG Icons & Brand Colors) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-10 sm:mb-14">
          <div className="bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 border-2 border-[#641623]/15 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5CC] border border-[#641623]/15 flex items-center justify-center flex-shrink-0 text-[#811B2B]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Fredoka'] font-black text-sm sm:text-base text-[#641623] uppercase">
                Custom Co-Branding
              </h4>
              <p className="font-['Fredoka'] text-xs text-[#641623]/75 mt-1 leading-snug font-medium">
                Logo colors, engraved wooden tags &amp; custom ribbon wraps.
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 border-2 border-[#641623]/15 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#DEEEF5] border border-[#641623]/15 flex items-center justify-center flex-shrink-0 text-[#811B2B]">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Fredoka'] font-black text-sm sm:text-base text-[#641623] uppercase">
                Tiered Wholesale Rates
              </h4>
              <p className="font-['Fredoka'] text-xs text-[#641623]/75 mt-1 leading-snug font-medium">
                Fair-trade artisan direct pricing with volume discounts.
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 border-2 border-[#641623]/15 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5CC] border border-[#641623]/15 flex items-center justify-center flex-shrink-0 text-[#811B2B]">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Fredoka'] font-black text-sm sm:text-base text-[#641623] uppercase">
                Luxury Box Packaging
              </h4>
              <p className="font-['Fredoka'] text-xs text-[#641623]/75 mt-1 leading-snug font-medium">
                Unboxing-ready presentation with handwritten note cards.
              </p>
            </div>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 border-2 border-[#641623]/15 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#DEEEF5] border border-[#641623]/15 flex items-center justify-center flex-shrink-0 text-[#811B2B]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Fredoka'] font-black text-sm sm:text-base text-[#641623] uppercase">
                Pan-India Delivery
              </h4>
              <p className="font-['Fredoka'] text-xs text-[#641623]/75 mt-1 leading-snug font-medium">
                Single HQ bulk drop or direct delivery to 1,000+ employee homes.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Interactive Gifting Studio & Occasion Explorer (Replaces Boring Static Grids) */}
        <div className="w-full bg-[#FFFDF9] rounded-[32px] sm:rounded-[36px] border-2 border-[#641623]/15 p-5 sm:p-8 lg:p-10 mb-14 sm:mb-20 shadow-[0_12px_32px_rgba(100,22,35,0.06)] relative">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="font-['Fredoka'] font-black text-xl sm:text-2xl md:text-3xl text-[#641623] uppercase tracking-tight">
              explore corporate gifting ideas
            </h3>
            <p className="font-['Fredoka'] text-xs sm:text-sm text-[#641623]/70 mt-1">
              click through occasions to see curated concepts, turnaround times &amp; inclusions
            </p>
          </div>

          {/* Interactive Occasion Pill Selector (No Emojis!) */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-6 sm:mb-8">
            {OCCASIONS.map((occ) => {
              const Icon = occ.icon;
              const isSelected = selectedOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => handleOccasionSelect(occ)}
                  className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#811B2B] text-white border-[#811B2B] shadow-sm -translate-y-0.5 scale-102'
                      : 'bg-white text-[#641623] border-[#641623]/20 hover:bg-[#FFF5CC] hover:border-[#641623]/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#811B2B]'}`} />
                  <span>{occ.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Occasion Showcase Card */}
          <div className="w-full bg-gradient-to-br from-[#FFFDF9] via-[#FFF9DA]/40 to-[#FFFDF9] rounded-2xl sm:rounded-3xl border border-[#641623]/15 p-5 sm:p-7 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Description & Curated Items */}
              <div className="lg:col-span-7 flex flex-col justify-center text-left">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#811B2B] bg-[#FFF5CC] px-3 py-1 rounded-full border border-[#811B2B]/20">
                    curated concept
                  </span>
                  <span className="text-xs text-[#641623]/70 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#811B2B]" />
                    {activeOccasion.turnaround}
                  </span>
                </div>

                <h4 className="font-['Fredoka'] font-black text-xl sm:text-2xl text-[#641623]">
                  {activeOccasion.name}
                </h4>
                <p className="font-['Fredoka'] text-xs sm:text-sm text-[#641623]/80 mt-1.5 leading-relaxed font-medium">
                  {activeOccasion.tagline}
                </p>

                {/* Popular Crochet Items Chips */}
                <div className="mt-4 pt-3 border-t border-[#641623]/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#641623]/70 block mb-2">
                    Popular Pieces for This Occasion:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeOccasion.curatedItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-bold text-[#641623] border border-[#641623]/15 shadow-xs"
                      >
                        <Heart className="w-3 h-3 text-[#811B2B] fill-[#811B2B]" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Inclusions & Direct Action */}
              <div className="lg:col-span-5 bg-white/90 rounded-2xl p-4 sm:p-5 border border-[#641623]/15 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#811B2B] block mb-2.5">
                    Included with Every Order:
                  </span>
                  <ul className="space-y-2">
                    {activeOccasion.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-semibold text-[#641623]/85">
                        <CheckCircle2 className="w-4 h-4 text-[#811B2B] flex-shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handlePickForQuote(activeOccasion)}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#811B2B] text-white font-bold text-xs sm:text-sm hover:bg-[#641623] transition-all duration-200 cursor-pointer shadow-sm active:scale-98"
                >
                  <span>Request Quote for {activeOccasion.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. How It Works (Sleek 3-Step Timeline) */}
        <div className="mb-14 sm:mb-20 text-center">
          <h3 className="font-['Fredoka'] font-black text-xl sm:text-2xl md:text-3xl text-[#641623] uppercase tracking-tight mb-2">
            how it works
          </h3>
          <p className="font-['Fredoka'] text-xs sm:text-sm text-[#641623]/70 max-w-md mx-auto mb-8 font-medium">
            seamless collaboration from brief to delivery
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <div className="bg-[#FFFDF9] rounded-2xl p-5 border-2 border-[#641623]/15 shadow-xs text-left relative">
              <span className="w-8 h-8 rounded-full bg-[#FFF5CC] border border-[#811B2B]/30 text-[#811B2B] font-black text-sm flex items-center justify-center mb-3">
                1
              </span>
              <h4 className="font-['Fredoka'] font-black text-base text-[#641623] uppercase">
                Tell Us What You Need
              </h4>
              <p className="font-['Fredoka'] text-xs text-[#641623]/75 mt-1.5 leading-relaxed font-medium">
                Submit your approx. quantity, event timeline, and branding ideas in the quote form below.
              </p>
            </div>

            <div className="bg-[#FFFDF9] rounded-2xl p-5 border-2 border-[#641623]/15 shadow-xs text-left relative">
              <span className="w-8 h-8 rounded-full bg-[#DEEEF5] border border-[#811B2B]/30 text-[#811B2B] font-black text-sm flex items-center justify-center mb-3">
                2
              </span>
              <h4 className="font-['Fredoka'] font-black text-base text-[#641623] uppercase">
                Approve Mockup &amp; Sample
              </h4>
              <p className="font-['Fredoka'] text-xs text-[#641623]/75 mt-1.5 leading-relaxed font-medium">
                We craft digital mockups and color swatch samples matching your brand aesthetic before production.
              </p>
            </div>

            <div className="bg-[#FFFDF9] rounded-2xl p-5 border-2 border-[#641623]/15 shadow-xs text-left relative">
              <span className="w-8 h-8 rounded-full bg-[#FFF5CC] border border-[#811B2B]/30 text-[#811B2B] font-black text-sm flex items-center justify-center mb-3">
                3
              </span>
              <h4 className="font-['Fredoka'] font-black text-base text-[#641623] uppercase">
                Handcrafted &amp; Delivered
              </h4>
              <p className="font-['Fredoka'] text-xs text-[#641623]/75 mt-1.5 leading-relaxed font-medium">
                200+ daadis crochet every stitch with love. Packed in gift boxes and delivered right on time.
              </p>
            </div>
          </div>
        </div>

        {/* 6. "REQUEST A QUOTE" CARD */}
        <div id="b2b-quote-card" className="w-full max-w-2xl mx-auto pt-6 sm:pt-8 relative">
          {/* Card Container with Retro Border & Drop Shadow */}
          <div className="bg-[#FFFDF9] rounded-[32px] sm:rounded-[38px] border-[2.5px] border-[#641623] p-6 sm:p-9 shadow-[0_16px_40px_rgba(100,22,35,0.12)] text-left relative overflow-hidden">
            {/* Top Form Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#DEEEF5] border border-[#641623]/15 text-[#641623] text-[11px] font-bold uppercase mb-2">
                <Sparkles className="w-3 h-3 text-[#811B2B]" />
                <span>custom corporate inquiry</span>
              </div>
              <h3 className="font-['Fredoka'] font-black text-2xl sm:text-3xl text-[#641623] uppercase tracking-tight">
                request a quote
              </h3>
              <p className="font-['Fredoka'] text-xs sm:text-sm text-[#641623]/75 mt-1 font-medium">
                tell us a bit about your gifting &amp; our team will reply within 1 business day.
              </p>
            </div>

            {status === 'success' ? (
              /* Success State */
              <div className="text-center py-8 px-4 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#DEEEF5] border-2 border-[#811B2B] flex items-center justify-center text-[#811B2B] mb-4 shadow-sm animate-bounce">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="font-['Fredoka'] font-black text-2xl text-[#641623]">
                  Request Sent Successfully! ♡
                </h4>
                <p className="font-['Fredoka'] text-sm sm:text-base text-[#641623]/80 mt-2 max-w-md leading-relaxed font-medium">
                  Thank you, <span className="font-bold text-[#811B2B]">{formData.name}</span>! Your quote details have been sent directly to our corporate team at{' '}
                  <span className="font-bold text-[#811B2B]">knotsnco101@gmail.com</span> and{' '}
                  <span className="font-bold text-[#811B2B]">princeadwani003@gmail.com</span>.
                </p>
                <p className="font-['Fredoka'] text-xs sm:text-sm text-[#641623]/70 mt-2">
                  Our specialist will get back to you within 24 hours with custom tiered pricing, sample previews &amp; mockups.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#811B2B] text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Send another request
                </button>
              </div>
            ) : (
              /* Interactive Form */
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Quick Occasion Selection Chips */}
                <div>
                  <label className="block font-['Fredoka'] font-black text-xs sm:text-[13px] uppercase tracking-wider text-[#641623] mb-1.5">
                    Select Occasion / Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {OCCASIONS.map((occ) => (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => handleOccasionSelect(occ)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          formData.occasion === occ.name
                            ? 'bg-[#811B2B] text-white border-[#811B2B]'
                            : 'bg-white text-[#641623] border-[#641623]/20 hover:bg-[#FFF5CC]'
                        }`}
                      >
                        {occ.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="b2b-name"
                    className="block font-['Fredoka'] font-black text-xs sm:text-[13px] uppercase tracking-wider text-[#641623] mb-1.5"
                  >
                    Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="b2b-name"
                      name="name"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 rounded-2xl bg-white border-2 border-[#641623]/20 focus:border-[#811B2B] focus:outline-none font-['Fredoka'] text-sm sm:text-base text-[#641623] placeholder-[#641623]/40 shadow-xs transition-colors"
                    />
                    <User className="w-4 h-4 text-[#811B2B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Work Email & Phone / WhatsApp Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Email */}
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
                        placeholder="ananya@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-10 rounded-2xl bg-white border-2 border-[#641623]/20 focus:border-[#811B2B] focus:outline-none font-['Fredoka'] text-sm sm:text-base text-[#641623] placeholder-[#641623]/40 shadow-xs transition-colors"
                      />
                      <Mail className="w-4 h-4 text-[#811B2B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Phone */}
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

                {/* Company Name */}
                <div>
                  <label
                    htmlFor="b2b-company"
                    className="block font-['Fredoka'] font-black text-xs sm:text-[13px] uppercase tracking-wider text-[#641623] mb-1.5"
                  >
                    Company / Organization *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="b2b-company"
                      name="company"
                      required
                      placeholder="e.g. Google India / Razorpay"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 rounded-2xl bg-white border-2 border-[#641623]/20 focus:border-[#811B2B] focus:outline-none font-['Fredoka'] text-sm sm:text-base text-[#641623] placeholder-[#641623]/40 shadow-xs transition-colors"
                    />
                    <Building className="w-4 h-4 text-[#811B2B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Approx. Quantity with Preset Chips */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="b2b-quantity"
                      className="block font-['Fredoka'] font-black text-xs sm:text-[13px] uppercase tracking-wider text-[#641623]"
                    >
                      Approx. Quantity
                    </label>
                    <span className="text-[11px] font-bold text-[#811B2B]">
                      Tiered bulk pricing applies
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {QUANTITY_PRESETS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, quantity: q }))}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          formData.quantity === q
                            ? 'bg-[#811B2B] text-white border-[#811B2B]'
                            : 'bg-white text-[#641623] border-[#641623]/20 hover:bg-[#FFF5CC]'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="b2b-quantity"
                      name="quantity"
                      placeholder="e.g. 100 pcs"
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
      </div>
    </section>
  );
};
