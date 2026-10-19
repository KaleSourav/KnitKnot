import React from 'react';

export interface BrandLogoProps {
  className?: string;
}

export const BrandLogos: React.FC<BrandLogoProps> = ({ className = '' }) => {
  return (
    <div className={`w-full max-w-6xl mx-auto px-4 ${className}`}>
      <p className="text-center text-sm md:text-base font-medium text-white tracking-wide mb-8">
        Trusted By Top Brands
      </p>

      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-14">
        {/* 1. dokey. */}
        <div className="flex items-center text-white select-none transition-opacity hover:opacity-80">
          <span className="text-2xl sm:text-[28px] font-bold tracking-tight lowercase">
            dokey<span className="text-white">.</span>
          </span>
        </div>

        {/* 2. HubSpot */}
        <div className="flex items-center gap-1.5 text-white select-none transition-opacity hover:opacity-80">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
            <path d="M16.5 7.5a3 3 0 0 0-2.82 2.002H9.5a3 3 0 0 0-2.82-2.002 3 3 0 1 0 0 6 3 3 0 0 0 2.82-2.002h4.18A3 3 0 1 0 16.5 7.5zm0 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM4.5 10.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm15 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
          <span className="text-xl sm:text-2xl font-bold tracking-tight">HubSpot</span>
        </div>

        {/* 3. zendesk */}
        <div className="flex items-center text-white select-none transition-opacity hover:opacity-80">
          <span className="text-xl sm:text-2xl font-bold lowercase tracking-normal">
            zendesk
          </span>
        </div>

        {/* 4. Jira Software */}
        <div className="flex items-center gap-2 text-white select-none transition-opacity hover:opacity-80">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
            <path d="M11.51 2.2a.93.93 0 0 0-1.02.24L4.2 8.73a.94.94 0 0 0 0 1.33l6.29 6.29a.93.93 0 0 0 1.33 0l6.29-6.29a.94.94 0 0 0 0-1.33L11.82 2.44a.93.93 0 0 0-.31-.24zm0 4.02l3.96 3.96-3.96 3.96-3.96-3.96 3.96-3.96z" />
          </svg>
          <span className="text-lg sm:text-xl font-bold tracking-tight">Jira Software</span>
        </div>

        {/* 5. Dropbox */}
        <div className="flex items-center gap-2 text-white select-none transition-opacity hover:opacity-80">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
            <path d="M6 3.5l6 3.8-6 3.8-6-3.8 6-3.8zm12 0l6 3.8-6 3.8-6-3.8 6-3.8zm-12 9.1l6-3.8 6 3.8-6 3.8-6-3.8zm12 0l6-3.8-6-3.8-6 3.8 6 3.8zm-6 4.7l6-3.8 6 3.8-12 7.7-6-3.9 6-3.8z" />
          </svg>
          <span className="text-lg sm:text-xl font-bold tracking-tight">Dropbox</span>
        </div>

        {/* 6. hotjar */}
        <div className="flex items-center gap-1.5 text-white select-none transition-opacity hover:opacity-80">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2c.5 3 2.5 5 4 7 1.5 2 2 4.5 1 7-1 2.5-3.5 4-6 4s-5.5-2-6-5c-.5-3 1-5 2.5-7 1-1.5 2-3 2.5-5 1 1 2 2 2 3z" />
          </svg>
          <span className="text-lg sm:text-xl font-bold tracking-tight">hotjar</span>
        </div>

        {/* 7. dorik */}
        <div className="flex items-center gap-1.5 text-white select-none transition-opacity hover:opacity-80">
          <span className="text-xl sm:text-2xl font-bold tracking-tight lowercase">
            dorik
          </span>
        </div>

        {/* 8. DeepL */}
        <div className="flex items-center gap-2 text-white select-none transition-opacity hover:opacity-80">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 3l8 4.6v9.2L12 21.4 4 16.8V7.6L12 3zm0 2.3L6 8.8v6.9l6 3.5 6-3.5V8.8l-6-3.5zm-1 4.7h2v4h3v2h-5V10z" />
          </svg>
          <span className="text-lg sm:text-xl font-bold tracking-tight">DeepL</span>
        </div>
      </div>
    </div>
  );
};
