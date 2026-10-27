import React, { useState } from 'react';
import { X, User, Heart, Package, Sparkles, Check, ArrowRight } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs font-['DM_Sans',sans-serif]">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-[#faf4e8] border border-[#841724]/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl z-10 text-[#2b0b12] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#841724]/12 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#841724]/10 flex items-center justify-center text-[#841724]">
              <User className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold font-serif text-[#2b0b12]">Knotsnco VIP Club</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#7c5c62] hover:text-[#841724] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {isLoggedIn ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 border border-emerald-300">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h4 className="text-lg font-bold text-[#2b0b12] mb-1 font-serif">Welcome back, {email.split('@')[0]}!</h4>
            <p className="text-xs text-[#7c5c62] mb-6">
              You have 150 Knotsnco Yarn Points (₹150 value) ready to use on your next order.
            </p>

            <div className="grid grid-cols-2 gap-3 text-left mb-6">
              <div className="p-3 rounded-2xl bg-white border border-[#841724]/15 shadow-xs">
                <Package className="w-4 h-4 text-[#841724] mb-1" />
                <p className="text-xs font-bold text-[#2b0b12]">Active Orders</p>
                <p className="text-[11px] text-[#7c5c62]">1 bouquet in transit</p>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#841724]/15 shadow-xs">
                <Heart className="w-4 h-4 text-[#c8102e] mb-1" />
                <p className="text-xs font-bold text-[#2b0b12]">Wishlist</p>
                <p className="text-[11px] text-[#7c5c62]">4 saved items</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsLoggedIn(false);
                setEmail('');
              }}
              className="text-xs text-[#841724] hover:text-[#5c0f19] font-bold underline cursor-pointer"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div>
            <div className="flex rounded-full bg-[#faedd3] p-1 mb-5 border border-[#841724]/15">
              <button
                onClick={() => setTab('signin')}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  tab === 'signin' ? 'bg-[#841724] text-[#faedd3] shadow-sm' : 'text-[#7c5c62]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  tab === 'register' ? 'bg-[#841724] text-[#faedd3] shadow-sm' : 'text-[#7c5c62]'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#2b0b12] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-white border border-[#841724]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#2b0b12] placeholder-[#7c5c62] focus:outline-none focus:border-[#841724] shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2b0b12] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#841724]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#2b0b12] placeholder-[#7c5c62] focus:outline-none focus:border-[#841724] shadow-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#841724] hover:bg-[#5c0f19] text-[#faedd3] font-black text-xs sm:text-sm py-3 rounded-full shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider active:scale-98"
              >
                <span>{tab === 'signin' ? 'Sign In to Knotsnco' : 'Join VIP Club (+100 Pts)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-[#841724]/10 text-center">
              <p className="text-[11px] text-[#7c5c62] flex items-center justify-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-[#841724]" />
                <span>Members receive exclusive access to secret plushie drops</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

