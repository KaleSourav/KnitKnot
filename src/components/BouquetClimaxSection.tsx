import React from 'react';
import { motion } from 'motion/react';

interface BouquetClimaxSectionProps {
  onShopBouquets?: () => void;
}

export const BouquetClimaxSection: React.FC<BouquetClimaxSectionProps> = ({ onShopBouquets }) => {
  return (
    <section
      id="section-bouquet-climax"
      className="relative w-full bg-[#FAF4ED] py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-center"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-20">
        {/* Story Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCE8ED] border border-[#DE637E]/30 text-[#DE637E] font-medium text-xs sm:text-sm tracking-wide mb-4 shadow-xs"
        >
          {/* Dainty Needle & Thread SVG Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 2L14 8L16 2" />
            <circle cx="12" cy="14" r="8" />
            <path d="M8 14C8 11.8 9.8 10 12 10C14.2 10 16 11.8 16 14" />
          </svg>
          <span>crafted from two yarns, tied with love</span>
        </motion.div>

        {/* Grand Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-['Fredoka'] font-bold text-3xl sm:text-4xl md:text-5xl text-[#641623] tracking-tight mb-3"
        >
          the forever bouquet
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-stone-600 max-w-md text-sm sm:text-base leading-relaxed mb-8 sm:mb-10"
        >
          Two single strands of yarn, looped with patience by our Surat dadis, blossom into a bouquet that will never wilt.
        </motion.p>

        {/* Central Handcrafted Crochet Bouquet Artwork with Spring Pop */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          whileInView={{ scale: 1, opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            type: 'spring',
            stiffness: 85,
            damping: 15,
            mass: 0.8,
            delay: 0.2,
          }}
          className="relative w-72 h-80 sm:w-84 sm:h-96 md:w-96 md:h-[420px] flex items-center justify-center mb-8 drop-shadow-xl select-none"
        >
          {/* Sub-pixel Bow Knot Anchor for mathematically exact yarn thread connection */}
          <div
            id="bouquet-bow-anchor"
            className="absolute left-1/2 top-[72.5%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          />

          {/* Floating Sparkle Stars */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], rotate: [0, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2 left-6 text-[#F59E0B]"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="absolute top-10 right-8 text-[#DE637E]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.2, 1], y: [0, -4, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="absolute bottom-20 left-4 text-[#F59E0B]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </motion.div>

          {/* Master Vector Crochet Bouquet SVG */}
          <svg viewBox="0 0 340 400" className="w-full h-full" fill="none">
            {/* Background Halo Glow */}
            <circle cx="170" cy="180" r="140" fill="#FCE8ED" fillOpacity="0.45" />

            {/* --- 1. SAGE GREEN LEAVES & STEMS --- */}
            <g stroke="#381A1F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {/* Left Arching Leaf */}
              <path d="M 120,220 C 70,190 60,140 85,115 C 105,145 115,185 130,215" fill="#6E8E34" />
              <path d="M 85,115 C 100,140 108,175 118,205" stroke="#FAF4ED" strokeWidth="1.4" />

              {/* Right Arching Leaf */}
              <path d="M 220,220 C 270,190 280,140 255,115 C 235,145 225,185 210,215" fill="#6E8E34" />
              <path d="M 255,115 C 240,140 232,175 222,205" stroke="#FAF4ED" strokeWidth="1.4" />

              {/* Center Stems into Wrap */}
              <line x1="170" y1="180" x2="170" y2="280" stroke="#557328" strokeWidth="6" />
              <line x1="125" y1="150" x2="160" y2="275" stroke="#557328" strokeWidth="5" />
              <line x1="215" y1="150" x2="180" y2="275" stroke="#557328" strokeWidth="5" />
            </g>

            {/* --- 2. LAVENDER SPRIGS --- */}
            {/* Left Lavender Sprig */}
            <g stroke="#381A1F" strokeWidth="1.8" strokeLinecap="round">
              <line x1="105" y1="140" x2="75" y2="70" stroke="#557328" strokeWidth="3" />
              <circle cx="75" cy="70" r="6" fill="#B89FD6" />
              <circle cx="70" cy="82" r="6.5" fill="#C084FC" />
              <circle cx="82" cy="85" r="6.5" fill="#A855F7" />
              <circle cx="74" cy="98" r="7" fill="#B89FD6" />
              <circle cx="88" cy="100" r="7" fill="#C084FC" />
              <circle cx="82" cy="114" r="7" fill="#A855F7" />
            </g>

            {/* Right Lavender Sprig */}
            <g stroke="#381A1F" strokeWidth="1.8" strokeLinecap="round">
              <line x1="235" y1="140" x2="265" y2="70" stroke="#557328" strokeWidth="3" />
              <circle cx="265" cy="70" r="6" fill="#B89FD6" />
              <circle cx="270" cy="82" r="6.5" fill="#C084FC" />
              <circle cx="258" cy="85" r="6.5" fill="#A855F7" />
              <circle cx="266" cy="98" r="7" fill="#B89FD6" />
              <circle cx="252" cy="100" r="7" fill="#C084FC" />
              <circle cx="258" cy="114" r="7" fill="#A855F7" />
            </g>

            {/* --- 3. PASTEL TULIP BLOSSOMS --- */}
            {/* Left Pink Tulip */}
            <g transform="translate(100, 100) rotate(-16)" stroke="#381A1F" strokeWidth="2.2" strokeLinejoin="round">
              <path d="M 0,-30 C -20,-10 -20,20 0,30 C 20,20 20,-10 0,-30 Z" fill="#F472B6" />
              <path d="M -16,-20 C -28,0 -20,25 0,30 C -10,18 -15,0 -16,-20 Z" fill="#FBCFE8" />
              <path d="M 16,-20 C 28,0 20,25 0,30 C 10,18 15,0 16,-20 Z" fill="#F472B6" />
              <circle cx="0" cy="5" r="5" fill="#FDF2F8" stroke="#381A1F" strokeWidth="1.5" />
            </g>

            {/* Right Blush Coral Tulip */}
            <g transform="translate(240, 100) rotate(16)" stroke="#381A1F" strokeWidth="2.2" strokeLinejoin="round">
              <path d="M 0,-30 C -20,-10 -20,20 0,30 C 20,20 20,-10 0,-30 Z" fill="#FB7185" />
              <path d="M -16,-20 C -28,0 -20,25 0,30 C -10,18 -15,0 -16,-20 Z" fill="#FB7185" />
              <path d="M 16,-20 C 28,0 20,25 0,30 C 10,18 15,0 16,-20 Z" fill="#FECDD3" />
              <circle cx="0" cy="5" r="5" fill="#FFF1F2" stroke="#381A1F" strokeWidth="1.5" />
            </g>

            {/* --- 4. CHEERFUL WHITE & YELLOW DAISIES --- */}
            {/* Daisy 1 (Top Left) */}
            <g transform="translate(125, 60)" stroke="#381A1F" strokeWidth="2" strokeLinejoin="round">
              <circle cx="0" cy="-14" r="7" fill="#FAF4ED" />
              <circle cx="12" cy="-7" r="7" fill="#FAF4ED" />
              <circle cx="12" cy="7" r="7" fill="#FAF4ED" />
              <circle cx="0" cy="14" r="7" fill="#FAF4ED" />
              <circle cx="-12" cy="7" r="7" fill="#FAF4ED" />
              <circle cx="-12" cy="-7" r="7" fill="#FAF4ED" />
              <circle cx="0" cy="0" r="8" fill="#FBBF24" stroke="#381A1F" strokeWidth="2" />
              <circle cx="0" cy="0" r="4" fill="#F59E0B" />
            </g>

            {/* Daisy 2 (Top Right) */}
            <g transform="translate(215, 60)" stroke="#381A1F" strokeWidth="2" strokeLinejoin="round">
              <circle cx="0" cy="-14" r="7" fill="#FAF4ED" />
              <circle cx="12" cy="-7" r="7" fill="#FAF4ED" />
              <circle cx="12" cy="7" r="7" fill="#FAF4ED" />
              <circle cx="0" cy="14" r="7" fill="#FAF4ED" />
              <circle cx="-12" cy="7" r="7" fill="#FAF4ED" />
              <circle cx="-12" cy="-7" r="7" fill="#FAF4ED" />
              <circle cx="0" cy="0" r="8" fill="#FBBF24" stroke="#381A1F" strokeWidth="2" />
              <circle cx="0" cy="0" r="4" fill="#F59E0B" />
            </g>

            {/* --- 5. CENTRAL GRAND CROCHET SUNFLOWER --- */}
            <g transform="translate(170, 160)" stroke="#381A1F" strokeWidth="2.4" strokeLinejoin="round">
              {/* 14 Golden Petals */}
              {[0, 25.7, 51.4, 77.1, 102.8, 128.5, 154.2, 180, 205.7, 231.4, 257.1, 282.8, 308.5, 334.2].map((angle, i) => (
                <path
                  key={i}
                  d="M 0,-48 C -11,-36 -11,-24 0,-18 C 11,-24 11,-36 0,-48 Z"
                  fill={i % 2 === 0 ? '#FBBF24' : '#F59E0B'}
                  transform={`rotate(${angle})`}
                />
              ))}

              {/* Textured Brown Spiral Disc Center */}
              <circle cx="0" cy="0" r="24" fill="#6B3410" stroke="#381A1F" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="17" fill="#8B4513" stroke="#381A1F" strokeWidth="1.8" />
              <circle cx="0" cy="0" r="10" fill="#52270A" stroke="#381A1F" strokeWidth="1.6" />
              {/* Cozy Crochet Stitch Dots */}
              <circle cx="-5" cy="-6" r="1.6" fill="#FBBF24" />
              <circle cx="6" cy="-4" r="1.6" fill="#FBBF24" />
              <circle cx="-3" cy="5" r="1.6" fill="#FBBF24" />
              <circle cx="5" cy="5" r="1.6" fill="#FBBF24" />
              <circle cx="0" cy="0" r="1.8" fill="#FAF4ED" />
            </g>

            {/* --- 6. TEXTURED KRAFT PAPER / BOUQUET CONE WRAP --- */}
            <g stroke="#381A1F" strokeWidth="2.4" strokeLinejoin="round">
              <polygon points="120,230 220,230 195,350 145,350" fill="#E6D2B5" />
              <polygon points="110,225 170,250 142,352 110,240" fill="#DFC7A6" />
              <polygon points="230,225 170,250 198,352 230,240" fill="#D3B894" />
              <path d="M 125,230 Q 170,260 215,230" stroke="#381A1F" strokeWidth="2" strokeDasharray="4 3" />
            </g>

            {/* --- 7. THE TIED YARN BOW (Where Left & Right Yarns converge!) --- */}
            <g transform="translate(170, 290)">
              {/* Left Bow Loop */}
              <path
                d="M 0,0 C -25,-25 -50,-10 -40,10 C -30,25 -10,12 0,0 Z"
                fill="#DE637E"
                stroke="#381A1F"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path d="M -30,-5 C -35,5 -25,12 -15,6" stroke="#F896AC" strokeWidth="1.8" strokeLinecap="round" />

              {/* Right Bow Loop */}
              <path
                d="M 0,0 C 25,-25 50,-10 40,10 C 30,25 10,12 0,0 Z"
                fill="#DE637E"
                stroke="#381A1F"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path d="M 30,-5 C 35,5 25,12 15,6" stroke="#F896AC" strokeWidth="1.8" strokeLinecap="round" />

              {/* Cascading Ribbon Ends */}
              <path
                d="M -4,5 C -15,25 -25,45 -35,55"
                stroke="#DE637E"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M -4,5 C -15,25 -25,45 -35,55"
                stroke="#381A1F"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              <path
                d="M 4,5 C 15,25 25,45 35,55"
                stroke="#DE637E"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 4,5 C 15,25 25,45 35,55"
                stroke="#381A1F"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Center Knot */}
              <circle cx="0" cy="0" r="8" fill="#B93B57" stroke="#381A1F" strokeWidth="2.4" />
              <circle cx="-2" cy="-2" r="2.5" fill="#F896AC" />
            </g>
          </svg>
        </motion.div>

        {/* Action Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <button
            onClick={() => {
              if (onShopBouquets) onShopBouquets();
            }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#641623] text-[#FAF4ED] font-['Fredoka'] font-semibold text-lg tracking-wide shadow-[0_8px_24px_rgba(100,22,35,0.22)] hover:bg-[#7D1D2E] hover:shadow-[0_12px_30px_rgba(100,22,35,0.32)] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>shop all crochet bouquets</span>
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
