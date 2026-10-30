/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, User, Package, Heart, Sparkles, ArrowRight, Check } from 'lucide-react';

interface KnotsncoAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KnotsncoAccountModal({ isOpen, onClose }: KnotsncoAccountModalProps) {
  const [activeTab, setActiveTab] = useState<'track' | 'login'>('track');
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [trackingResult, setTrackingResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber) return;
    setTrackingResult(
      `Order #${orderNumber} is being hand-knitted by our Dadis in Surat! Scheduled to dispatch via Bluedart express.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#811B2B]/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#FFFEF8] text-[#811B2B] rounded-3xl border-2 border-[#811B2B] shadow-2xl z-10 overflow-hidden p-6 sm:p-8">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#811B2B]/10 text-[#811B2B]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#FFF5CC] border border-[#811B2B]/20 text-[#811B2B] flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[#811B2B]">
            Knotsnco Account
          </h2>
          <p className="text-xs text-[#811B2B]/70 font-rounded mt-1">
            Track your artisan order or sign in
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#811B2B]/15 mb-6">
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-2 text-xs font-bold font-rounded text-center border-b-2 transition-all ${
              activeTab === 'track'
                ? 'border-[#811B2B] text-[#811B2B]'
                : 'border-transparent text-[#811B2B]/50'
            }`}
          >
            Track Order
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-xs font-bold font-rounded text-center border-b-2 transition-all ${
              activeTab === 'login'
                ? 'border-[#811B2B] text-[#811B2B]'
                : 'border-transparent text-[#811B2B]/50'
            }`}
          >
            Sign In
          </button>
        </div>

        {activeTab === 'track' ? (
          <form onSubmit={handleTrack} className="space-y-4 text-xs font-rounded">
            <div>
              <label className="block font-bold text-[#811B2B] mb-1">Shopify Order #</label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. 1042"
                className="w-full px-4 py-3 rounded-xl border border-[#811B2B]/30 bg-[#FFF5CC]/30 text-[#811B2B] focus:outline-none focus:ring-1 focus:ring-[#811B2B]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#811B2B] mb-1">Email or Phone Number</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#811B2B]/30 bg-[#FFF5CC]/30 text-[#811B2B] focus:outline-none focus:ring-1 focus:ring-[#811B2B]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-[#811B2B] hover:bg-[#5C0F19] text-[#FFF5CC] font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Track Order Status
            </button>

            {trackingResult && (
              <div className="p-3.5 bg-[#FFF5CC] rounded-xl border border-[#811B2B]/20 text-[11px] text-[#811B2B] leading-relaxed">
                🌸 {trackingResult}
              </div>
            )}
          </form>
        ) : (
          <div className="space-y-4 text-xs font-rounded">
            <p className="text-[#811B2B]/80 text-center">
              Customer accounts are linked to Shopify Storefront for easy one-click checkout and saved addresses.
            </p>
            <a
              href="https://04wv6h-ut.myshopify.com/account/login"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-full bg-[#811B2B] text-[#FFF5CC] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#5C0F19] transition-all"
            >
              <span>Sign in via Shopify</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
