import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Truck,
  Video,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Mail,
  MapPin,
  Clock,
  Heart,
  Package,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface PolicyPageProps {
  initialTab?: 'returns' | 'shipping';
  onNavigateHome: () => void;
  onNavigateShop?: (category?: string) => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({
  initialTab = 'returns',
  onNavigateHome,
  onNavigateShop,
}) => {
  const [activeTab, setActiveTab] = useState<'returns' | 'shipping'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="w-full bg-[#FBF8CF] min-h-screen font-['Fredoka'] select-none relative overflow-x-hidden">
      {/* =========================================================================
          1. TOP BREADCRUMBS & NAVIGATION
          ========================================================================= */}
      <div className="w-full bg-[#FFFDF8] border-b border-[#641623]/10 py-3 px-4 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
            <span>Customer Care</span>
            <span>/</span>
            <span className="text-[#811B2B] font-bold">
              {activeTab === 'returns' ? 'Return & Exchange Policy' : 'Shipping & Delivery Policy'}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. EDITORIAL HERO HEADER
          ========================================================================= */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-8 sm:pb-10">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5CC] border border-[#811B2B]/20 text-[#811B2B] text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#811B2B]" />
          <span>KNOTSNCO POLICIES &amp; CUSTOMER CARE</span>
          <Sparkles className="w-3.5 h-3.5 text-[#811B2B]" />
        </div>

        {/* Page Title with Signature Dual-Font Pairing */}
        <h1 className="font-['Fredoka'] text-3xl sm:text-5xl lg:text-6xl font-bold text-[#641623] tracking-tight mb-4 leading-tight">
          <span>handcrafted with love, backed by </span>
          <span className="font-script font-normal text-[1.18em] text-[#811B2B] inline-block -rotate-1">
            care
          </span>
          <span> ♡</span>
        </h1>

        <p className="font-['Fredoka'] text-[#2D2424]/80 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-6">
          Every Knotsnco piece takes time, patience, and love to create. We believe in 100% transparency regarding our handmade timelines, transit protection, and return guidelines.
        </p>

        {/* Tab Switcher Pills */}
        <div className="inline-flex items-center p-1.5 bg-white/90 rounded-full border-2 border-[#641623]/20 shadow-sm max-w-md w-full justify-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('returns')}
            className={`flex-1 py-2.5 px-4 rounded-full font-['Fredoka'] font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'returns'
                ? 'bg-[#811B2B] text-white shadow-xs scale-102'
                : 'text-[#641623] hover:bg-[#FFF5CC]'
            }`}
          >
            <RotateCcw className="w-4 h-4 flex-shrink-0" />
            <span>Return &amp; Exchange</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`flex-1 py-2.5 px-4 rounded-full font-['Fredoka'] font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'shipping'
                ? 'bg-[#811B2B] text-white shadow-xs scale-102'
                : 'text-[#641623] hover:bg-[#FFF5CC]'
            }`}
          >
            <Truck className="w-4 h-4 flex-shrink-0" />
            <span>Shipping &amp; Delivery</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. MAIN POLICY CONTENT CONTAINER
          ========================================================================= */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {/* =====================================================================
            TAB 1: RETURN & EXCHANGE POLICY
            ===================================================================== */}
        {activeTab === 'returns' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Handmade Notice Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#641623]/20 shadow-sm text-left relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-2xl bg-[#FFF5CC] border border-[#641623]/15 flex items-center justify-center text-[#811B2B] flex-shrink-0">
                  <Heart className="w-5 h-5" />
                </span>
                <h2 className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-[#641623]">
                  Handcrafted Products &amp; Uniqueness
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-[#2D2424]/85 leading-relaxed font-normal">
                <p>
                  All our products are handcrafted by talented women artisans, including traditional craftswomen, aunties, and dadis across India. Since every product is handmade, each piece is unique and may have slight variations in its shape, size, colour, weave, or stitching.
                </p>
                <div className="p-3.5 rounded-2xl bg-[#FFF9DA] border border-[#F7BE44]/40 text-[#641623]">
                  <p className="font-semibold">
                    ✦ Minor irregularities or variations in handmade products should not be considered defects. Unlike machine-made products, our crochet creations are not expected to have perfectly uniform shapes or stitches. These little differences are what make every Knotsnco product special.
                  </p>
                </div>
                <p>
                  However, at Knotsnco, we stand behind the quality of our products and offer returns and exchanges under certain circumstances outlined below.
                </p>
              </div>
            </div>

            {/* 24-Hour Return & Exchange Policy Highlight */}
            <div className="bg-[#FFF5CC] rounded-3xl p-6 sm:p-8 border-2 border-[#811B2B]/25 shadow-sm text-left relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-2xl bg-white border border-[#811B2B]/20 flex items-center justify-center text-[#811B2B] flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-[#641623]">
                    24-Hour Return &amp; Exchange Window
                  </h2>
                  <p className="text-xs text-[#811B2B] font-semibold">
                    Strict 24-hour claim window from package delivery
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#2D2424]/90 leading-relaxed font-normal">
                We have a <strong>24-hour return and exchange policy</strong>, which means you have <strong>24 hours after receiving your order</strong> to request a return or exchange.
              </p>
            </div>

            {/* Mandatory Unboxing Video Notice */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#811B2B] shadow-md text-left relative">
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 rounded-2xl bg-[#FCE2EB] border-2 border-[#811B2B] flex items-center justify-center text-[#811B2B] flex-shrink-0 mt-0.5">
                  <Video className="w-6 h-6 animate-pulse" />
                </span>
                <div className="flex-1">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#811B2B] text-white text-[11px] font-bold uppercase tracking-wider mb-2">
                    MANDATORY FOR CLAIMS
                  </span>
                  <h3 className="font-['Fredoka'] text-lg sm:text-xl font-bold text-[#641623] mb-2">
                    Unboxing Video Required
                  </h3>
                  <p className="text-xs sm:text-sm text-[#2D2424]/85 leading-relaxed">
                    To be eligible for a return or exchange, you <strong>must provide a continuous unboxing video</strong> showing the parcel being opened and the received product being inspected. This video is essential for our verification process with courier partners.
                  </p>
                </div>
              </div>
            </div>

            {/* Two-Column Grid: Returns vs Exchanges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* Returns Box */}
              <div className="bg-white rounded-3xl p-6 border-2 border-[#641623]/15 shadow-sm text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-3 text-[#811B2B]">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <h3 className="font-['Fredoka'] text-lg font-bold text-[#641623]">
                      Returns Eligibility
                    </h3>
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#2D2424]/85 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>We only accept returns in case of a <strong>damaged or defective product</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Unboxing video showing the package being opened is required.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>Returns due to change of mind, personal preferences, incorrect expectations, or lack of utility will <strong>not be accepted</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>Minor variations in colour, shape, size or stitching due to the handmade nature will not qualify as defects.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Exchanges Box */}
              <div className="bg-white rounded-3xl p-6 border-2 border-[#641623]/15 shadow-sm text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-3 text-[#811B2B]">
                    <Package className="w-5 h-5 flex-shrink-0" />
                    <h3 className="font-['Fredoka'] text-lg font-bold text-[#641623]">
                      Exchanges Eligibility
                    </h3>
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#2D2424]/85 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Exchanges are considered in cases where you receive a <strong>damaged, defective, or incorrect product</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>An unboxing video is required for team verification.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>We will exchange the item with a freshly crafted replacement upon return approval.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How to Initiate & Return Address Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#641623]/20 shadow-sm text-left">
              <h3 className="font-['Fredoka'] text-lg sm:text-xl font-bold text-[#641623] mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#811B2B]" />
                <span>How to Initiate a Return or Exchange</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#2D2424]/85 leading-relaxed mb-4">
                To initiate a return or exchange, please email us at <strong className="text-[#811B2B] underline">knotsnco101@gmail.com</strong> within <strong>24 hours of receiving your order</strong>, attaching your order ID and the unboxing video.
              </p>
              <div className="p-3.5 rounded-2xl bg-[#DEEEF5] border border-[#641623]/15 text-xs text-[#641623] mb-5">
                <strong>Important:</strong> Please note that all returns or exchanges must be approved by our team before the product is shipped back. We will not be responsible for any packages returned without prior notification and approval.
              </div>

              {/* Physical Studio Address */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF6] border border-[#641623]/20 flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#811B2B] flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-[#2D2424]">
                  <p className="font-bold text-[#641623] mb-1">Official Return Address:</p>
                  <p className="font-medium text-[#2D2424]/90">
                    Knotsnco<br />
                    LG-6, Bhagwati Ashish, Citylight,<br />
                    Surat, Gujarat, India.
                  </p>
                  <p className="mt-2 text-[11px] text-[#641623]/80 italic">
                    Customers are required to self-ship the product to our return address. Knotsnco will cover and reimburse shipping charges for approved returns or exchanges.
                  </p>
                </div>
              </div>
            </div>

            {/* Refunds Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#641623]/20 shadow-sm text-left">
              <h3 className="font-['Fredoka'] text-lg sm:text-xl font-bold text-[#641623] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Refund Process &amp; Timelines</span>
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-[#2D2424]/85 leading-relaxed">
                <p>
                  Once we receive your returned product, our team will inspect it and notify you via email whether your refund has been approved or rejected.
                </p>
                <p>
                  If approved, your refund will be processed to your <strong>original payment method within 10 business days</strong>.
                </p>
                <div className="p-3 rounded-xl bg-[#FFF9DA] border border-[#F7BE44]/30 text-xs text-[#641623]">
                  Please note that banks and payment gateways may require additional processing time to reflect the refund in your account. If more than <strong>15 business days</strong> have passed since your refund was approved, please contact us at <strong className="text-[#811B2B]">knotsnco101@gmail.com</strong>.
                </div>
              </div>
            </div>

            {/* Thank You Note */}
            <div className="text-center pt-4">
              <p className="text-sm font-script text-2xl text-[#811B2B]">
                Thank you for supporting handmade products and the incredible women behind every Knotsnco creation! ♡
              </p>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: SHIPPING & DELIVERY POLICY
            ===================================================================== */}
        {activeTab === 'shipping' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* 1. Handmade Production Time Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#641623]/20 shadow-sm text-left relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-2xl bg-[#FFF5CC] border border-[#641623]/15 flex items-center justify-center text-[#811B2B] flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-[#641623]">
                    1. Order Processing &amp; Handmade Production Time
                  </h2>
                  <p className="text-xs text-[#811B2B] font-semibold">
                    Each order is lovingly crafted from scratch
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-[#2D2424]/85 leading-relaxed font-normal">
                <p>
                  At Knotsnco, every product is handcrafted with love and care by our talented women artisans. Unlike mass-produced products, our creations take time to make, and each order goes through a handmade production process.
                </p>

                {/* Timelines Callout Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-4">
                  <div className="p-4 rounded-2xl bg-[#FFFDF6] border-2 border-[#641623]/15 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#641623]/70 block mb-1">
                      PRODUCTION &amp; DISPATCH
                    </span>
                    <span className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-[#811B2B] block">
                      7–10 Days
                    </span>
                    <span className="text-[11px] text-[#2D2424]/70 mt-1 block">
                      Handcrafting each bloom &amp; plushie
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFFDF6] border-2 border-[#641623]/15 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#641623]/70 block mb-1">
                      EXPECTED DELIVERY
                    </span>
                    <span className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-[#811B2B] block">
                      10–15 Days
                    </span>
                    <span className="text-[11px] text-[#2D2424]/70 mt-1 block">
                      From date of placing order
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFFDF6] border-2 border-[#641623]/15 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#641623]/70 block mb-1">
                      PEAK SEASONS &amp; CUSTOM
                    </span>
                    <span className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-[#811B2B] block">
                      Up to 18 Days
                    </span>
                    <span className="text-[11px] text-[#2D2424]/70 mt-1 block">
                      High volume festivals &amp; bespoke builds
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFF9DA] border border-[#F7BE44]/40 text-[#641623] text-xs">
                  <strong>Special Occasion Tip:</strong> We kindly request you to plan your purchases accordingly, especially if you are ordering for a birthday, anniversary, convocation, or gifting purpose!
                </div>
              </div>
            </div>

            {/* 2. Courier Shipping & Logistics */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#641623]/20 shadow-sm text-left">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-2xl bg-[#DEEEF5] border border-[#641623]/15 flex items-center justify-center text-[#811B2B] flex-shrink-0">
                  <Truck className="w-5 h-5" />
                </span>
                <h2 className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-[#641623]">
                  2. Shipping &amp; Courier Delivery
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-[#2D2424]/85 leading-relaxed font-normal">
                <p>
                  Once your order is ready, it is dispatched through trusted third-party delivery partners (including Blue Dart, Delhivery, DTDC, and Speed Post).
                </p>
                <p>
                  After dispatch, the exact delivery timeline depends on the courier partner and the destination location of the customer.
                </p>
                <p>
                  Knotsnco is not responsible for delays caused by third-party logistics or courier partners, including unforeseen circumstances, operational delays, weather conditions, or local logistical issues beyond our control. However, we will always coordinate with delivery partners and actively assist you in tracking your shipment.
                </p>
              </div>
            </div>

            {/* 3. Delayed Deliveries Policy */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#641623]/20 shadow-sm text-left">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-2xl bg-[#FFF5CC] border border-[#641623]/15 flex items-center justify-center text-[#811B2B] flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </span>
                <h2 className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-[#641623]">
                  3. Delayed Deliveries
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-[#2D2424]/85 leading-relaxed font-normal">
                <p>
                  We understand how important timely deliveries are, especially when ordering for a special occasion. However, please note:
                </p>
                <ul className="space-y-2 pl-1">
                  <li className="flex items-start gap-2">
                    <span className="text-[#811B2B] font-bold">•</span>
                    <span>Delays caused by courier partners after the order has been dispatched do not qualify for a return, refund, or exchange.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#811B2B] font-bold">•</span>
                    <span>Once an order has been dispatched on time by Knotsnco, any subsequent delay by the shipping partner is beyond our direct control.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span><strong>Our Responsibility:</strong> If a delay occurs due to Knotsnco’s own production or dispatch process, we take full responsibility for the delay and will work with you to find a suitable resolution. Depending on circumstances, this may include cancellation, return, or exchange.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 4. Order Tracking */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#641623]/20 shadow-sm text-left">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-2xl bg-[#DEEEF5] border border-[#641623]/15 flex items-center justify-center text-[#811B2B] flex-shrink-0">
                  <Package className="w-5 h-5" />
                </span>
                <h2 className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-[#641623]">
                  4. Order Tracking
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#2D2424]/85 leading-relaxed font-normal">
                Once your order has been dispatched, you will automatically receive shipping and tracking details through the email and phone number provided at checkout. You can use these details to monitor your delivery status in real-time. If you experience any issues, please reach out to us and we will assist right away.
              </p>
            </div>

            {/* 5. Contact Us Box */}
            <div className="bg-[#FFFDF6] rounded-3xl p-6 sm:p-8 border-2 border-[#641623]/25 shadow-sm text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-['Fredoka'] text-lg sm:text-xl font-bold text-[#641623] mb-1">
                  Questions About Shipping or Delivery?
                </h3>
                <p className="text-xs sm:text-sm text-[#2D2424]/75">
                  Reach out directly to our customer care team at <strong className="text-[#811B2B]">knotsnco101@gmail.com</strong>
                </p>
              </div>
              <a
                href="mailto:knotsnco101@gmail.com?subject=Knotsnco%20Shipping%20Inquiry"
                className="px-5 py-2.5 rounded-full bg-[#811B2B] hover:bg-[#641623] text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-xs active:scale-95 transition-all"
              >
                Email Support →
              </a>
            </div>

            {/* Thank you sign-off */}
            <div className="text-center pt-4">
              <p className="text-xs sm:text-sm text-[#2D2424]/80 italic">
                We appreciate your patience and support. Every Knotsnco product takes time, effort, and love to create, and we promise to make it worth the wait!
              </p>
              <p className="font-script text-2xl sm:text-3xl text-[#811B2B] mt-2">
                Thank you for choosing handmade. ❤️
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
