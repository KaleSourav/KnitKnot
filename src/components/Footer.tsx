import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-white px-4 sm:px-6 lg:px-10 pb-8 sm:pb-12 pt-4">
      {/* Outer Luxury Light Pink Card Container (#edd2f7) with Rounded Corners */}
      <div className="max-w-[1360px] mx-auto bg-gradient-to-br from-[#f8eafc] via-[#edd2f7] to-[#e4c2f1] text-[#4a044e] rounded-[32px] sm:rounded-[44px] md:rounded-[56px] overflow-hidden p-8 sm:p-12 md:p-16 lg:p-20 relative select-none flex flex-col justify-between min-h-[580px] md:min-h-[660px] shadow-[0_25px_65px_-15px_rgba(237,210,247,0.7)] border border-[#deb6ed]/60">
        
        {/* Top Section: Heading + Newsletter & 4 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 md:pb-24">
          
          {/* Left Column: Heading & Newsletter */}
          <div className="lg:col-span-5 flex flex-col justify-start pr-0 lg:pr-8">
            <h3 
              className="text-[#4a044e] font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-[1.15] mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Level Up Your World with KnitKnot
            </h3>
            <p className="text-[#5e1f66] text-xs sm:text-sm leading-relaxed max-w-md mb-8 font-medium">
              Subscribe to our newsletter for news, exclusive offers, and community events. Don't miss updates!
            </p>

            {/* Newsletter input matching reference */}
            {subscribed ? (
              <div className="p-3.5 rounded-2xl bg-white/70 border border-purple-300 text-[#4a044e] text-xs sm:text-sm font-semibold flex items-center gap-2.5 max-w-md shadow-sm">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Welcome to the KnitKnot family.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative max-w-md w-full">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/85 hover:bg-white focus:bg-white border border-[#dab0ea] focus:border-[#4a044e]/50 rounded-full px-5 py-3.5 pr-28 text-xs sm:text-sm text-[#4a044e] placeholder-[#9c61ab] focus:outline-none transition-all shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 sm:px-5 bg-[#4a044e] text-white font-bold text-xs sm:text-sm rounded-full hover:bg-[#350239] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Columns: 4 Navigation Columns exactly as in reference */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            
            {/* 1. Product (All categories) */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#4a044e] mb-4 sm:mb-5">
                Product
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-[#5e1f66]">
                {[
                  { name: 'Accessories', tab: 'Accessories' },
                  { name: 'Flowers', tab: 'Flowers' },
                  { name: 'Amigurumi', tab: 'Amigurumi' },
                  { name: 'Clothing', tab: 'Clothing' },
                  { name: 'Utility & Decor', tab: 'Utility' },
                  { name: 'BYOB Studio', tab: 'BYOB' },
                ].map((item) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => onSelectCategory(item.tab)}
                      className="hover:text-[#230226] font-medium transition-colors cursor-pointer text-left"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Support */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#4a044e] mb-4 sm:mb-5">
                Support
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-[#5e1f66]">
                <li><a href="#support" className="hover:text-[#230226] font-medium transition-colors">Support Center</a></li>
                <li><a href="#faq" className="hover:text-[#230226] font-medium transition-colors">FAQs</a></li>
                <li><a href="#troubleshooting" className="hover:text-[#230226] font-medium transition-colors">Troubleshooting</a></li>
                <li><a href="#feedback" className="hover:text-[#230226] font-medium transition-colors">Feedback</a></li>
              </ul>
            </div>

            {/* 3. Company */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#4a044e] mb-4 sm:mb-5">
                Company
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-[#5e1f66]">
                <li><a href="#about" className="hover:text-[#230226] font-medium transition-colors">About Us</a></li>
                <li><a href="#careers" className="hover:text-[#230226] font-medium transition-colors">Careers</a></li>
                <li><a href="#blog" className="hover:text-[#230226] font-medium transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-[#230226] font-medium transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* 4. Legal */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#4a044e] mb-4 sm:mb-5">
                Legal
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-[#5e1f66]">
                <li><a href="#privacy" className="hover:text-[#230226] font-medium transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-[#230226] font-medium transition-colors">Terms of Service</a></li>
                <li><a href="#cookies" className="hover:text-[#230226] font-medium transition-colors">Cookie Policy</a></li>
                <li><a href="#compliance" className="hover:text-[#230226] font-medium transition-colors">Compliance</a></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Giant Brand Typography Spanning Full Width (White KnitKnot©) */}
        <div className="w-full pt-8 border-t border-[#4a044e]/15 flex items-center justify-between">
          <div className="w-full overflow-hidden">
            <h1 
              className="text-white font-serif leading-none tracking-tight font-normal select-none whitespace-nowrap text-left sm:text-left drop-shadow-[0_2px_12px_rgba(74,4,78,0.12)]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(4.2rem, 16.5vw, 17.5rem)',
              }}
            >
              KnitKnot©
            </h1>
          </div>
        </div>

      </div>
    </footer>
  );
};
