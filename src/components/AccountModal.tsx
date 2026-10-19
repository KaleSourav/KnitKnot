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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-[#130f1c] border border-purple-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl z-10 text-white animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-pink-300">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold">KnitKnot VIP Club</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoggedIn ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Welcome back, {email.split('@')[0]}!</h4>
            <p className="text-xs text-stone-400 mb-6">
              You have 150 KnitKnot Yarn Points (₹150 value) ready to use on your next order.
            </p>

            <div className="grid grid-cols-2 gap-3 text-left mb-6">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                <Package className="w-4 h-4 text-purple-400 mb-1" />
                <p className="text-xs font-bold text-white">Active Orders</p>
                <p className="text-[11px] text-stone-400">1 bouquet in transit</p>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                <Heart className="w-4 h-4 text-pink-400 mb-1" />
                <p className="text-xs font-bold text-white">Wishlist</p>
                <p className="text-[11px] text-stone-400">4 saved items</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsLoggedIn(false);
                setEmail('');
              }}
              className="text-xs text-stone-400 hover:text-white underline"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div>
            <div className="flex rounded-full bg-black/40 p-1 mb-5 border border-white/10">
              <button
                onClick={() => setTab('signin')}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                  tab === 'signin' ? 'bg-[#edd2f7] text-[#4a044e]' : 'text-stone-400'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                  tab === 'register' ? 'bg-[#edd2f7] text-[#4a044e]' : 'text-stone-400'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#edd2f7] hover:bg-[#e4c2f1] text-[#4a044e] font-extrabold text-xs py-2.5 rounded-full shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span>{tab === 'signin' ? 'Sign In to KnitKnot' : 'Join VIP Club (+100 Pts)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-pink-300" />
                <span>Members receive exclusive access to secret plushie drops</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
