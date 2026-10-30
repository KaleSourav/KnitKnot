/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, MessageCircle, Check, ChevronDown, Sparkles } from 'lucide-react';

interface ContactUsPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export function ContactUsPage({ onNavigate }: ContactUsPageProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long do Knotsnco crochet flowers last?',
      a: 'They last practically forever! Because they are hand-crocheted using combed milk-cotton yarn with reinforced interior wire stems, they never wilt, discolor, or die. You can dust them gently with a dry microfiber cloth or soft brush.',
    },
    {
      q: 'Can I request a custom color palette or flower combination?',
      a: 'Yes, absolutely! You can use our interactive "Build Your Own Bouquet" studio on this website to choose stems, wrapping papers, and ribbon colors. For wedding bouquets, corporate gifting, or special amigurumi characters, contact us on WhatsApp!',
    },
    {
      q: 'How long does shipping take across India?',
      a: 'Standard orders dispatch from our Surat atelier within 24–48 hours and arrive in 3–5 business days depending on your city. Custom bespoke bouquets take 3–5 days to handcraft before shipping.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'Yes! We ship worldwide. International delivery typically takes 8–12 business days via tracked express courier.',
    },
    {
      q: 'What is your return policy?',
      a: 'We want you to adore your purchase! If any item arrives damaged during transit, notify us within 48 hours with a photo and we will happily replace it free of charge.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="w-full bg-[#FFF5CC] min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs font-bold text-[#811B2B] font-rounded">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:underline text-[#811B2B]/75 hover:text-[#811B2B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="text-[#811B2B] font-extrabold">Contact & Concierge</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#811B2B]/10 text-[#811B2B] text-xs font-bold mb-3 font-rounded">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WE WOULD LOVE TO HEAR FROM YOU</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl font-extrabold text-[#811B2B] tracking-tight">
            Say Hello to Knotsnco.
          </h1>
          <p className="mt-2 text-[#811B2B]/85 font-handwriting text-2xl">
            questions, custom ideas, or just sharing some crochet love ♡
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* Left: Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#FFFEF8] p-6 sm:p-10 rounded-3xl border-2 border-[#811B2B] shadow-xl">
            <h2 className="font-editorial text-2xl font-bold text-[#811B2B] mb-2">
              Send Us a Message
            </h2>
            <p className="text-xs text-[#811B2B]/75 font-rounded mb-6">
              Our Surat studio team replies within 2–4 hours during working hours.
            </p>

            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-rounded">
                <div>
                  <label className="block font-bold text-[#811B2B] mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ananya Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-[#811B2B]/30 bg-[#FFF5CC]/30 text-[#811B2B] focus:outline-none focus:ring-2 focus:ring-[#811B2B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#811B2B] mb-1">Email Address:</label>
                    <input
                      type="email"
                      required
                      placeholder="ananya@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#811B2B]/30 bg-[#FFF5CC]/30 text-[#811B2B] focus:outline-none focus:ring-2 focus:ring-[#811B2B]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#811B2B] mb-1">WhatsApp / Phone:</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-[#811B2B]/30 bg-[#FFF5CC]/30 text-[#811B2B] focus:outline-none focus:ring-2 focus:ring-[#811B2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#811B2B] mb-1">Inquiry Type:</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-[#811B2B]/30 bg-[#FFF5CC]/30 text-[#811B2B] focus:outline-none focus:ring-2 focus:ring-[#811B2B]">
                    <option>Bespoke Custom Bouquet</option>
                    <option>Wedding & Event Floral Order</option>
                    <option>Bulk Corporate Gifting</option>
                    <option>Existing Order Tracking</option>
                    <option>General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#811B2B] mb-1">How can we help you bloom?</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you have in mind..."
                    className="w-full px-4 py-3 rounded-xl border border-[#811B2B]/30 bg-[#FFF5CC]/30 text-[#811B2B] focus:outline-none focus:ring-2 focus:ring-[#811B2B] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] font-bold text-xs tracking-wider uppercase transition-all shadow-md"
                >
                  Send Message to Surat Atelier
                </button>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#811B2B]">
                  Message Received with Love!
                </h3>
                <p className="text-xs text-[#811B2B]/80 font-rounded mt-1">
                  Our team in Surat will contact you via WhatsApp / Email shortly.
                </p>
              </div>
            )}
          </div>

          {/* Right: Direct Concierge & Studio Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Direct Concierge Card */}
            <div className="bg-[#C5E7D4] p-6 sm:p-8 rounded-3xl border-2 border-[#811B2B] shadow-xl">
              <span className="text-3xl">💬</span>
              <h3 className="font-editorial text-2xl font-bold text-[#811B2B] mt-2">
                Chat With Us on WhatsApp
              </h3>
              <p className="text-xs text-[#811B2B]/85 font-rounded mt-1 leading-relaxed">
                Need immediate help choosing stems or want to place a custom order right now? Chat directly with our customer concierge.
              </p>
              <a
                href="https://wa.me/919999999999?text=Hi%20Knotsnco!%20I'd%20like%20to%20order%20a%20handmade%20crochet%20bouquet"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#811B2B] text-[#FFF5CC] font-bold text-xs tracking-wider uppercase shadow-md hover:bg-[#5C0F19] transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#F5DD91]" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>

            {/* Atelier Info */}
            <div className="bg-[#FFFEF8] p-6 rounded-3xl border-2 border-[#811B2B] shadow-md space-y-3 text-xs text-[#811B2B] font-rounded">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#811B2B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Knotsnco Atelier & Studio</p>
                  <p className="text-[#811B2B]/75">Adajan Crafts Center, Surat, Gujarat 395009</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#811B2B] shrink-0" />
                <span>hello@knotsnco.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#811B2B] shrink-0" />
                <span>+91 99999 99999 (10am – 7pm IST)</span>
              </div>
            </div>

          </div>

        </div>

        {/* FAQs Accordion */}
        <div className="bg-[#FFFEF8] p-6 sm:p-10 rounded-3xl border-2 border-[#811B2B] shadow-xl">
          <div className="text-center mb-8">
            <h2 className="font-editorial text-2xl sm:text-4xl font-extrabold text-[#811B2B]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#811B2B]/70 font-handwriting text-xl mt-1">
              everything you need to know about our handmade bouquets ♡
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#811B2B]/20 bg-[#FFF5CC]/30 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-editorial text-base sm:text-lg font-bold text-[#811B2B]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-[#811B2B]/85 font-rounded leading-relaxed border-t border-[#811B2B]/10 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

