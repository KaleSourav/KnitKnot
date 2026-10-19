import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavClick: (item: string) => void;
  onContactClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavClick, onContactClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Product', id: 'product' },
    { name: 'About Us', id: 'about' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Contact', id: 'contact' },
    { name: 'Features', id: 'features' },
  ];

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 relative z-50">
      <div className="w-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/15 rounded-2xl md:rounded-full px-6 py-3.5 flex items-center justify-between shadow-2xl">
        {/* Brand Wordmark */}
        <div className="flex items-center">
          <button
            onClick={() => onNavClick('home')}
            className="text-2xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
          >
            Zioza
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7 lg:space-x-9">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavClick(link.id)}
              className="text-white hover:text-neutral-300 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded px-1 py-0.5"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Right CTA Action */}
        <div className="hidden md:flex items-center">
          <button
            onClick={onContactClick}
            className="bg-white text-black hover:bg-neutral-200 transition-all font-semibold text-sm px-6 py-2.5 rounded-full cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Contact Us
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-white hover:text-neutral-300 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-[#0d0d0d] border border-white/20 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavClick(link.id);
                  setMobileMenuOpen(false);
                }}
                className="text-left text-white hover:text-neutral-300 font-medium text-base py-1 px-2 rounded hover:bg-white/5 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                onContactClick();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-white text-black font-semibold text-sm py-3 rounded-full hover:bg-neutral-200 transition-colors text-center"
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
