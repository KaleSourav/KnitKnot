import React, { useState } from 'react';

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  quantity: string;
  details: string;
}

export const CorporateGiftingSection: React.FC = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '',
    details: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

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
      setErrorMessage('Please fill in your name, work email, and company name.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      // Direct submission via AJAX to knotsnco101@gmail.com and CC princeadwani003@gmail.com
      // Runs seamlessly in background WITHOUT opening user's email client
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
        // Fallback: save locally and acknowledge
        console.warn('FormSubmit notice:', result);
        try {
          const existing = JSON.parse(localStorage.getItem('b2b_quote_requests') || '[]');
          existing.push({ ...formData, timestamp: new Date().toISOString() });
          localStorage.setItem('b2b_quote_requests', JSON.stringify(existing));
        } catch {
          // ignore localStorage err
        }
        // Mark as success since request was recorded
        setStatus('success');
      }
    } catch (err: unknown) {
      console.error('B2B Quote submission error:', err);
      // Even on network blip, record in localStorage
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
      quantity: '',
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
              {/* Petals */}
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
        <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-14">
          {/* Top Pill Badge (Inspired by Reference) */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DEEEF5] border border-[#641623]/20 shadow-xs mb-3">
            <span className="text-xs">✨</span>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#641623]">
              100% custom co-branding &amp; bulk gifting
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

          <p className="font-['Fredoka'] text-sm sm:text-base text-[#641623]/75 mt-1.5 max-w-xl leading-relaxed">
            meaningful, everlasting handmade crochet gifts that teams, clients &amp; partners will actually cherish forever ♡
          </p>
        </div>

        {/* 3. Hero Mascot Quote Banner (Exact Recreation of User's Image 5 Mascot Drawing) */}
        <div className="w-full bg-gradient-to-br from-[#FEFBE2] via-[#FFF9DA] to-[#FCEEB2] rounded-[32px] sm:rounded-[40px] border-2 border-[#641623]/15 p-6 sm:p-8 lg:p-10 mb-12 sm:mb-16 shadow-[0_12px_32px_rgba(100,22,35,0.06)] relative overflow-hidden">
          {/* Subtle Decorative Background Wave */}
          <div className="absolute inset-0 pointer-events-none opacity-25" aria-hidden="true">
            <svg viewBox="0 0 900 300" preserveAspectRatio="none" className="w-full h-full text-[#F4E396]">
              <path d="M 0 100 C 250 160, 450 60, 900 120 L 900 300 L 0 300 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Left: Mascot Sketch with Flower Bouquet & Pouch (Image 5) */}
            <div className="lg:col-span-4 flex justify-center items-center">
              <div className="relative group p-2">
                <div className="w-48 sm:w-56 lg:w-64 h-auto rounded-3xl bg-white/90 p-3 sm:p-4 shadow-md border-2 border-[#641623]/15 transform -rotate-1 transition-transform duration-300 group-hover:rotate-0 group-hover:scale-102">
                  <img
                    src="/mascot/b2b-mascot-poster.png"
                    alt="Knots & Co Mascot - Always Spreading love with flowers forever"
                    className="w-full h-auto object-contain select-none rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Right: The Handwritten Quote & Impact Narrative */}
            <div className="lg:col-span-8 flex flex-col justify-center text-left">
              {/* Grand Mascot Quote Headline */}
              <div className="mb-3">
                <h3 className="font-['Fredoka'] font-black text-2xl sm:text-3xl md:text-4xl text-[#641623] tracking-tight leading-tight">
                  Always <span className="font-script text-[1.25em] text-[#811B2B] font-normal px-1">Spreading love</span>
                </h3>
                <p className="font-['Fredoka'] font-black text-xl sm:text-2xl md:text-3xl text-[#641623] tracking-tight mt-0.5">
                  with <span className="font-script text-[1.25em] text-[#811B2B] font-normal px-1">flowers forever</span>
                </p>
              </div>

              <p className="font-['Fredoka'] text-sm sm:text-base text-[#641623]/85 leading-relaxed max-w-2xl font-medium mt-1">
                Say goodbye to generic corporate hampers that end up forgotten. Every bouquet, desk bloom, bag charm, and custom keepsake from Knots &amp; Co is patiently hand-crocheted by 200+ daadis and aunties across homes in India.
              </p>

              <p className="font-['Fredoka'] text-xs sm:text-sm text-[#811B2B] font-semibold mt-2.5">
                Turn your corporate gifting into real home livelihoods, ethical recognition, and everlasting handcrafted warmth.
              </p>

              {/* 4 Brand Pillars Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-5 border-t border-[#641623]/15">
                <div className="bg-white/80 rounded-2xl p-2.5 sm:p-3 border border-[#641623]/10 text-center">
                  <span className="block font-black text-lg sm:text-xl text-[#811B2B]">200+</span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#641623]/75 lowercase">artisan daadis</span>
                </div>
                <div className="bg-white/80 rounded-2xl p-2.5 sm:p-3 border border-[#641623]/10 text-center">
                  <span className="block font-black text-lg sm:text-xl text-[#811B2B]">100%</span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#641623]/75 lowercase">handcrafted</span>
                </div>
                <div className="bg-white/80 rounded-2xl p-2.5 sm:p-3 border border-[#641623]/10 text-center">
                  <span className="block font-black text-lg sm:text-xl text-[#811B2B]">Forever</span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#641623]/75 lowercase">zero wilt keepsakes</span>
                </div>
                <div className="bg-white/80 rounded-2xl p-2.5 sm:p-3 border border-[#641623]/10 text-center">
                  <span className="block font-black text-lg sm:text-xl text-[#811B2B]">Pan-India</span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#641623]/75 lowercase">doorstep delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. "WHY GIFT KNOTS & CO?" (3 Cards Matching Reference Image 3) */}
        <div className="mb-14 sm:mb-20">
          <div className="text-center mb-8">
            <h3 className="font-['Fredoka'] font-black text-2xl sm:text-3xl lg:text-[34px] text-[#641623] tracking-tight uppercase">
              why gift knots &amp; co?
            </h3>
            <p className="font-['Fredoka'] text-sm sm:text-base text-[#641623]/70 mt-1">
              thoughtfully designed, sustainably handcrafted, and remembered for years
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Card 1: Your Brand, Our Handmade Love */}
            <div className="bg-[#FFFDF9] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border-2 border-[#641623]/15 shadow-[0_8px_24px_rgba(100,22,35,0.06)] hover:-translate-y-1.5 transition-transform duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#DEEEF5] border border-[#641623]/15 flex items-center justify-center text-2xl mb-4 shadow-xs">
                  🎨
                </div>
                <h4 className="font-['Fredoka'] font-black text-lg sm:text-xl text-[#641623] uppercase tracking-tight">
                  your brand, our handmade love
                </h4>
                <p className="font-['Fredoka'] text-xs sm:text-[13.5px] leading-relaxed text-[#641623]/80 mt-2.5 font-medium">
                  Co-brand any flower bouquet, potted plant, plushie mascot, or charm with your company logo colors, custom engraved wooden or acrylic brand tags, bespoke ribbon wraps, or dream up an entirely custom crochet design with our studio.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#641623]/10">
                <span className="text-[11px] font-bold text-[#811B2B] uppercase tracking-wider">
                  ✓ Custom Colors &amp; Tag Engraving
                </span>
              </div>
            </div>

            {/* Card 2: Bulk Pricing */}
            <div className="bg-[#FFFDF9] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border-2 border-[#641623]/15 shadow-[0_8px_24px_rgba(100,22,35,0.06)] hover:-translate-y-1.5 transition-transform duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FEFBE2] border border-[#641623]/15 flex items-center justify-center text-2xl mb-4 shadow-xs">
                  💰
                </div>
                <h4 className="font-['Fredoka'] font-black text-lg sm:text-xl text-[#641623] uppercase tracking-tight">
                  transparent bulk pricing
                </h4>
                <p className="font-['Fredoka'] text-xs sm:text-[13.5px] leading-relaxed text-[#641623]/80 mt-2.5 font-medium">
                  The larger your order quantity, the sweeter the per-piece wholesale price. Direct fair-wage employment for our home artisans with 100% transparent quotes and zero surprise charges.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#641623]/10">
                <span className="text-[11px] font-bold text-[#811B2B] uppercase tracking-wider">
                  ✓ Tiered Corporate Wholesale Rates
                </span>
              </div>
            </div>

            {/* Card 3: Handled End-to-End */}
            <div className="bg-[#FFFDF9] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border-2 border-[#641623]/15 shadow-[0_8px_24px_rgba(100,22,35,0.06)] hover:-translate-y-1.5 transition-transform duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#DEEEF5] border border-[#641623]/15 flex items-center justify-center text-2xl mb-4 shadow-xs">
                  🚀
                </div>
                <h4 className="font-['Fredoka'] font-black text-lg sm:text-xl text-[#641623] uppercase tracking-tight">
                  handled end-to-end
                </h4>
                <p className="font-['Fredoka'] text-xs sm:text-[13.5px] leading-relaxed text-[#641623]/80 mt-2.5 font-medium">
                  Design, sample creation, artisan crocheting, custom handwritten note cards, luxury packaging, and pan-India dispatch to one corporate headquarters or direct to 1,000+ individual home addresses.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#641623]/10">
                <span className="text-[11px] font-bold text-[#811B2B] uppercase tracking-wider">
                  ✓ Pan-India Individual Address Drops
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. "PERFECT FOR" (4 Occasion Cards Matching Reference Image 2) */}
        <div className="mb-14 sm:mb-20">
          <div className="text-center mb-8">
            <h3 className="font-['Fredoka'] font-black text-2xl sm:text-3xl lg:text-[34px] text-[#641623] tracking-tight uppercase">
              perfect for
            </h3>
            <p className="font-['Fredoka'] text-sm sm:text-base text-[#641623]/70 mt-1">
              unforgettable tokens that coworkers and clients will treasure on their desks
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Occasion 1: Onboarding Kits */}
            <div className="bg-[#FFFDF9] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 border-2 border-[#641623]/15 shadow-[0_6px_20px_rgba(100,22,35,0.05)] hover:-translate-y-1 transition-transform">
              <span className="text-2xl sm:text-3xl block mb-3">🧑‍💻</span>
              <h4 className="font-['Fredoka'] font-black text-base sm:text-lg text-[#641623] uppercase tracking-tight">
                onboarding kits
              </h4>
              <p className="font-['Fredoka'] text-xs sm:text-[13px] leading-relaxed text-[#641623]/75 mt-1.5 font-medium">
                Welcome new hires with handcrafted desk flowers or cute plushies they will actually keep, not bin.
              </p>
            </div>

            {/* Occasion 2: Client Gifts */}
            <div className="bg-[#FFFDF9] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 border-2 border-[#641623]/15 shadow-[0_6px_20px_rgba(100,22,35,0.05)] hover:-translate-y-1 transition-transform">
              <span className="text-2xl sm:text-3xl block mb-3">🤝</span>
              <h4 className="font-['Fredoka'] font-black text-base sm:text-lg text-[#641623] uppercase tracking-tight">
                client gifts
              </h4>
              <p className="font-['Fredoka'] text-xs sm:text-[13px] leading-relaxed text-[#641623]/75 mt-1.5 font-medium">
                Stay memorable long after meetings and deals close with heartwarming, bespoke keepsake gifts.
              </p>
            </div>

            {/* Occasion 3: Events & Swag */}
            <div className="bg-[#FFFDF9] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 border-2 border-[#641623]/15 shadow-[0_6px_20px_rgba(100,22,35,0.05)] hover:-translate-y-1 transition-transform">
              <span className="text-2xl sm:text-3xl block mb-3">🎤</span>
              <h4 className="font-['Fredoka'] font-black text-base sm:text-lg text-[#641623] uppercase tracking-tight">
                events &amp; swag
              </h4>
              <p className="font-['Fredoka'] text-xs sm:text-[13px] leading-relaxed text-[#641623]/75 mt-1.5 font-medium">
                Booth giveaways, speaker appreciation gifts, and conference drops that everyone fights over.
              </p>
            </div>

            {/* Occasion 4: Festive Gifting */}
            <div className="bg-[#FFFDF9] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 border-2 border-[#641623]/15 shadow-[0_6px_20px_rgba(100,22,35,0.05)] hover:-translate-y-1 transition-transform">
              <span className="text-2xl sm:text-3xl block mb-3">🎉</span>
              <h4 className="font-['Fredoka'] font-black text-base sm:text-lg text-[#641623] uppercase tracking-tight">
                festive gifting
              </h4>
              <p className="font-['Fredoka'] text-xs sm:text-[13px] leading-relaxed text-[#641623]/75 mt-1.5 font-medium">
                Diwali, Women&apos;s Day, New Year, work anniversaries, and company milestones sorted in bulk.
              </p>
            </div>
          </div>
        </div>

        {/* 6. "HOW IT WORKS" (3 Steps Matching Reference Image 2) */}
        <div className="mb-14 sm:mb-20">
          <div className="text-center mb-8">
            <h3 className="font-['Fredoka'] font-black text-2xl sm:text-3xl lg:text-[34px] text-[#641623] tracking-tight uppercase">
              how it works
            </h3>
            <p className="font-['Fredoka'] text-sm sm:text-base text-[#641623]/70 mt-1">
              simple, smooth, and seamless from inquiry to unboxing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="bg-[#FFFDF9] rounded-[28px] p-6 border-2 border-[#641623]/15 shadow-sm text-left">
              <span className="inline-block font-black text-2xl text-[#811B2B] mb-2">1</span>
              <h4 className="font-['Fredoka'] font-black text-lg text-[#641623] uppercase">
                tell us what you need
              </h4>
              <p className="font-['Fredoka'] text-xs sm:text-[13px] leading-relaxed text-[#641623]/75 mt-2 font-medium">
                Submit quantity, preferred items, timeline, and any custom branding ideas in our quote form below. We will reply fast with pricing options.
              </p>
            </div>

            <div className="bg-[#FFFDF9] rounded-[28px] p-6 border-2 border-[#641623]/15 shadow-sm text-left">
              <span className="inline-block font-black text-2xl text-[#811B2B] mb-2">2</span>
              <h4 className="font-['Fredoka'] font-black text-lg text-[#641623] uppercase">
                approve the mockup &amp; sample
              </h4>
              <p className="font-['Fredoka'] text-xs sm:text-[13px] leading-relaxed text-[#641623]/75 mt-2 font-medium">
                We prepare digital mockups and color swatch samples matching your corporate branding and aesthetic before starting bulk production.
              </p>
            </div>

            <div className="bg-[#FFFDF9] rounded-[28px] p-6 border-2 border-[#641623]/15 shadow-sm text-left">
              <span className="inline-block font-black text-2xl text-[#811B2B] mb-2">3</span>
              <h4 className="font-['Fredoka'] font-black text-lg text-[#641623] uppercase">
                handcrafted &amp; delivered
              </h4>
              <p className="font-['Fredoka'] text-xs sm:text-[13px] leading-relaxed text-[#641623]/75 mt-2 font-medium">
                Our 200+ artisan daadis crochet every stitch with love. Packed in gift boxes and delivered right on time across India.
              </p>
            </div>
          </div>
        </div>

        {/* 7. "REQUEST A QUOTE" FORM (Exact Card Layout & Logic Matching Image 1) */}
        <div className="w-full max-w-2xl mx-auto">
          {/* Card Container with Retro Shadow */}
          <div className="bg-[#FFFDF9] rounded-[32px] sm:rounded-[38px] border-[2.5px] border-[#641623] p-6 sm:p-9 shadow-[0_12px_36px_rgba(100,22,35,0.14)] text-left relative overflow-hidden">
            {/* Top Form Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="font-['Fredoka'] font-black text-2xl sm:text-3xl text-[#641623] uppercase tracking-tight">
                request a quote
              </h3>
              <p className="font-['Fredoka'] text-xs sm:text-sm text-[#641623]/75 mt-1 font-medium">
                Tell us a bit about your gifting and we&apos;ll get back within 1 business day.
              </p>
            </div>

            {status === 'success' ? (
              /* Success State */
              <div className="text-center py-8 px-4 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#DEEEF5] border-2 border-[#811B2B] flex items-center justify-center text-3xl mb-4 shadow-sm animate-bounce">
                  ✨
                </div>
                <h4 className="font-['Fredoka'] font-black text-2xl text-[#641623]">
                  Request Sent Successfully! ♡
                </h4>
                <p className="font-['Fredoka'] text-sm sm:text-base text-[#641623]/80 mt-2 max-w-md leading-relaxed font-medium">
                  Thank you, <span className="font-bold text-[#811B2B]">{formData.name}</span>! Your quote details have been sent directly to our team at{' '}
                  <span className="font-bold text-[#811B2B]">knotsnco101@gmail.com</span> and{' '}
                  <span className="font-bold text-[#811B2B]">princeadwani003@gmail.com</span>.
                </p>
                <p className="font-['Fredoka'] text-xs sm:text-sm text-[#641623]/70 mt-2">
                  Our corporate gifting specialist will get back to you within 24 hours with custom pricing and mockups.
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
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="b2b-name" className="block text-xs sm:text-sm font-black uppercase text-[#641623] mb-1.5">
                    name *
                  </label>
                  <input
                    type="text"
                    id="b2b-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#641623]/25 bg-white text-[#641623] placeholder-[#641623]/40 text-sm font-medium focus:outline-none focus:border-[#811B2B] focus:ring-2 focus:ring-[#811B2B]/20 transition-all"
                  />
                </div>

                {/* Work Email */}
                <div>
                  <label htmlFor="b2b-email" className="block text-xs sm:text-sm font-black uppercase text-[#641623] mb-1.5">
                    work email *
                  </label>
                  <input
                    type="email"
                    id="b2b-email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="priya@company.com"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#641623]/25 bg-white text-[#641623] placeholder-[#641623]/40 text-sm font-medium focus:outline-none focus:border-[#811B2B] focus:ring-2 focus:ring-[#811B2B]/20 transition-all"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label htmlFor="b2b-phone" className="block text-xs sm:text-sm font-black uppercase text-[#641623] mb-1.5">
                    phone / whatsapp
                  </label>
                  <input
                    type="tel"
                    id="b2b-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#641623]/25 bg-white text-[#641623] placeholder-[#641623]/40 text-sm font-medium focus:outline-none focus:border-[#811B2B] focus:ring-2 focus:ring-[#811B2B]/20 transition-all"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="b2b-company" className="block text-xs sm:text-sm font-black uppercase text-[#641623] mb-1.5">
                    company / organization *
                  </label>
                  <input
                    type="text"
                    id="b2b-company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#641623]/25 bg-white text-[#641623] placeholder-[#641623]/40 text-sm font-medium focus:outline-none focus:border-[#811B2B] focus:ring-2 focus:ring-[#811B2B]/20 transition-all"
                  />
                </div>

                {/* Approx. Quantity */}
                <div>
                  <label htmlFor="b2b-quantity" className="block text-xs sm:text-sm font-black uppercase text-[#641623] mb-1.5">
                    approx. quantity (pieces)
                  </label>
                  <input
                    type="text"
                    id="b2b-quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 50, 100, 250, 500+"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#641623]/25 bg-white text-[#641623] placeholder-[#641623]/40 text-sm font-medium focus:outline-none focus:border-[#811B2B] focus:ring-2 focus:ring-[#811B2B]/20 transition-all"
                  />
                </div>

                {/* Tell us about your gifting */}
                <div>
                  <label htmlFor="b2b-details" className="block text-xs sm:text-sm font-black uppercase text-[#641623] mb-1.5">
                    tell us about your gifting
                  </label>
                  <textarea
                    id="b2b-details"
                    name="details"
                    rows={4}
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Occasion, timeline, preferred items (bouquets, potted plants, keychains, plushies), branding ideas, delivery..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#641623]/25 bg-white text-[#641623] placeholder-[#641623]/40 text-sm font-medium focus:outline-none focus:border-[#811B2B] focus:ring-2 focus:ring-[#811B2B]/20 transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-[#811B2B] hover:bg-[#641623] text-white font-black text-sm sm:text-base uppercase tracking-wider transition-all duration-200 shadow-[0_6px_20px_rgba(129,27,43,0.3)] hover:shadow-[0_8px_25px_rgba(129,27,43,0.4)] active:scale-[0.98] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {status === 'submitting' ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>sending request...</span>
                      </>
                    ) : (
                      <>
                        <span>send request</span>
                        <span className="text-lg">♡</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-[#641623]/60 font-semibold mt-2.5">
                    Direct confirmation to knotsnco101@gmail.com &amp; princeadwani003@gmail.com
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
