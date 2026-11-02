import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="w-full bg-[#64011E] text-white py-2 px-4 flex items-center justify-center gap-2.5 text-xs sm:text-sm font-['Fredoka'] font-medium tracking-wide selection:bg-white selection:text-[#64011E] z-20 relative">
      {/* Left 5-petal daisy icon */}
      <svg
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <circle cx="12" cy="12" r="3" fill="#64011E" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2a3.5 3.5 0 00-3.5 3.5c0 .35.05.69.15 1A3.5 3.5 0 005.15 8.1 3.5 3.5 0 003.5 12 3.5 3.5 0 005.15 15.9a3.5 3.5 0 003.5 1.6c-.1.31-.15.65-.15 1A3.5 3.5 0 0012 22a3.5 3.5 0 003.5-3.5c0-.35-.05-.69-.15-1a3.5 3.5 0 003.5-1.6A3.5 3.5 0 0020.5 12a3.5 3.5 0 00-1.65-3.9 3.5 3.5 0 00-3.5-1.6c.1-.31.15-.65.15-1A3.5 3.5 0 0012 2zm0 7a3 3 0 100 6 3 3 0 000-6z"
        />
      </svg>

      <span className="font-semibold text-center lowercase tracking-wide">
        free shipping on orders above ₹1999
      </span>

      {/* Right 5-petal daisy icon */}
      <svg
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <circle cx="12" cy="12" r="3" fill="#64011E" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2a3.5 3.5 0 00-3.5 3.5c0 .35.05.69.15 1A3.5 3.5 0 005.15 8.1 3.5 3.5 0 003.5 12 3.5 3.5 0 005.15 15.9a3.5 3.5 0 003.5 1.6c-.1.31-.15.65-.15 1A3.5 3.5 0 0012 22a3.5 3.5 0 003.5-3.5c0-.35-.05-.69-.15-1a3.5 3.5 0 003.5-1.6A3.5 3.5 0 0020.5 12a3.5 3.5 0 00-1.65-3.9 3.5 3.5 0 00-3.5-1.6c.1-.31.15-.65.15-1A3.5 3.5 0 0012 22zm0 7a3 3 0 100 6 3 3 0 000-6z"
        />
      </svg>
    </div>
  );
};
