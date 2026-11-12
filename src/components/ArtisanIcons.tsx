import React from 'react';

interface IconProps {
  className?: string;
}

/** 4-point sparkle star matching brand aesthetic */
export const SparkleIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path
      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
      fill="#F7BE44"
      stroke="#641623"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

/** Handcrafted 5-petal daisy icon */
export const DaisyIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="6.5" r="3" fill="#FCE2EB" stroke="#641623" strokeWidth="1.6" />
    <circle cx="17.2" cy="10.2" r="3" fill="#FCE2EB" stroke="#641623" strokeWidth="1.6" />
    <circle cx="15.2" cy="16.2" r="3" fill="#FCE2EB" stroke="#641623" strokeWidth="1.6" />
    <circle cx="8.8" cy="16.2" r="3" fill="#FCE2EB" stroke="#641623" strokeWidth="1.6" />
    <circle cx="6.8" cy="10.2" r="3" fill="#FCE2EB" stroke="#641623" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3" fill="#F7BE44" stroke="#641623" strokeWidth="1.6" />
  </svg>
);

/** Soft yarn ball skein icon */
export const YarnBallIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="12" r="8.5" fill="#F9A8D4" stroke="#641623" strokeWidth="1.8" />
    <path d="M5.5 9.5C8.5 6.5 15.5 7 18.5 10" stroke="#641623" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 13.5C8 10.5 15 11 19 13.5" stroke="#641623" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7.5 17.5C10 15 14 15.5 16.5 17.5" stroke="#641623" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 19.5C18.5 21 21 20 22 18" stroke="#641623" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Yarn ball + crochet needle icon */
export const CrochetHookIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="11" cy="13" r="7" fill="#D6E8EF" stroke="#641623" strokeWidth="1.7" />
    <path d="M6 11.5C8.5 9 13.5 9.5 16 12" stroke="#641623" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M6.5 15C9 12.5 13.5 13 16 15.5" stroke="#641623" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="4" y1="20" x2="20" y2="4" stroke="#F7BE44" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="4" y1="20" x2="20" y2="4" stroke="#641623" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="19.5" cy="4.5" r="1.3" fill="#641623" />
  </svg>
);

/** Adorable Surat Daadi artisan icon */
export const DaadiIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="5.5" r="3" fill="#E2E8F0" stroke="#641623" strokeWidth="1.5" />
    <circle cx="12" cy="11.5" r="5" fill="#FFE4D6" stroke="#641623" strokeWidth="1.6" />
    <path d="M7.5 10.5C7.5 7.5 16.5 7.5 16.5 10.5" fill="#CBD5E1" stroke="#641623" strokeWidth="1.5" />
    <circle cx="10.2" cy="11.8" r="1.4" fill="white" stroke="#641623" strokeWidth="1.2" />
    <circle cx="13.8" cy="11.8" r="1.4" fill="white" stroke="#641623" strokeWidth="1.2" />
    <line x1="11.6" y1="11.8" x2="12.4" y2="11.8" stroke="#641623" strokeWidth="1.2" />
    <path d="M10.5 14.2Q12 15.5 13.5 14.2" stroke="#641623" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M6.5 21C7 17.5 17 17.5 17.5 21Z" fill="#FCE2EB" stroke="#641623" strokeWidth="1.5" />
  </svg>
);

/** Envelope with heart wax seal for custom gift notes */
export const LoveLetterIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2.5" fill="#FFFDF9" stroke="#641623" strokeWidth="1.7" />
    <path d="M3 6.5L12 13L21 6.5" stroke="#641623" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M12 16.2C10.5 14.9 9.5 13.9 9.5 12.8C9.5 11.9 10.2 11.2 11.1 11.2C11.5 11.2 11.8 11.4 12 11.7C12.2 11.4 12.5 11.2 12.9 11.2C13.8 11.2 14.5 11.9 14.5 12.8C14.5 13.9 13.5 14.9 12 16.2Z"
      fill="#D96B7D"
      stroke="#641623"
      strokeWidth="1"
    />
  </svg>
);

/** Gift box with ribbon bow icon */
export const GiftBoxIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect x="4" y="10" width="16" height="10.5" rx="1.5" fill="#FFE9A7" stroke="#641623" strokeWidth="1.7" />
    <rect x="3" y="7" width="18" height="3.5" rx="1" fill="#F9A8D4" stroke="#641623" strokeWidth="1.7" />
    <line x1="12" y1="7" x2="12" y2="20.5" stroke="#641623" strokeWidth="1.7" />
    <path d="M12 7C12 7 8 3 6.5 4.8C5.3 6.2 8.5 7 12 7Z" fill="#FCE2EB" stroke="#641623" strokeWidth="1.5" />
    <path d="M12 7C12 7 16 3 17.5 4.8C18.7 6.2 15.5 7 12 7Z" fill="#FCE2EB" stroke="#641623" strokeWidth="1.5" />
  </svg>
);

/** Tied forever bouquet icon */
export const BouquetIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path d="M7 10L12 20L17 10Z" fill="#FFE9A7" stroke="#641623" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="9.5" cy="7.5" r="2.8" fill="#FCE2EB" stroke="#641623" strokeWidth="1.5" />
    <circle cx="14.5" cy="7.5" r="2.8" fill="#D6E8EF" stroke="#641623" strokeWidth="1.5" />
    <circle cx="12" cy="5.5" r="2.8" fill="#F7BE44" stroke="#641623" strokeWidth="1.5" />
    <path d="M10.5 14.5L13.5 14.5" stroke="#D96B7D" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Courier delivery van icon */
export const DeliveryTruckIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect x="2" y="6" width="13" height="10" rx="1.5" fill="#D6E8EF" stroke="#641623" strokeWidth="1.7" />
    <path d="M15 9H19L22 12V16H15V9Z" fill="#FCF7D1" stroke="#641623" strokeWidth="1.7" strokeLinejoin="round" />
    <circle cx="6.5" cy="17.5" r="2" fill="#FFFDF9" stroke="#641623" strokeWidth="1.7" />
    <circle cx="18" cy="17.5" r="2" fill="#FFFDF9" stroke="#641623" strokeWidth="1.7" />
  </svg>
);

/** Eco-friendly crochet leaf icon */
export const LeafIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path
      d="M11 20C5.5 20 3 15.5 3 11C3 6.5 7.5 3 14 3C16.5 3 19 4 21 6C21 14 16.5 20 11 20Z"
      fill="#E3F5E1"
      stroke="#641623"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M3.5 20.5C6.5 16.5 10.5 12.5 16 8.5" stroke="#641623" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/** Cozy clock icon for artisan hours */
export const ClockIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="12" r="8.5" fill="#FCF7D1" stroke="#641623" strokeWidth="1.7" />
    <polyline points="12 7.5 12 12 15 13.5" stroke="#641623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Feather duster / brush icon for care instructions */
export const FeatherDusterIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <line x1="5" y1="19" x2="11.5" y2="12.5" stroke="#641623" strokeWidth="2.2" strokeLinecap="round" />
    <path
      d="M10.5 13.5C9 11 10 7 13 5C16 3 19.5 4.5 19.5 4.5C19.5 4.5 21 8 19 11C17 14 13 15 10.5 13.5Z"
      fill="#FCE2EB"
      stroke="#641623"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M13 10.5L17 6.5" stroke="#641623" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/** Water droplet icon for spot cleaning */
export const DropletIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path
      d="M12 3.5C12 3.5 6 10.5 6 14.5C6 17.8 8.7 20.5 12 20.5C15.3 20.5 18 17.8 18 14.5C18 10.5 12 3.5 12 3.5Z"
      fill="#D6E8EF"
      stroke="#641623"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M9.5 15C9.5 16.5 10.5 17.5 11.5 17.8" stroke="#641623" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/** Cozy sun icon for display guidance */
export const SunIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="12" r="4.5" fill="#FDE047" stroke="#641623" strokeWidth="1.7" />
    <line x1="12" y1="3" x2="12" y2="5" stroke="#641623" strokeWidth="1.7" strokeLinecap="round" />
    <line x1="12" y1="19" x2="12" y2="21" stroke="#641623" strokeWidth="1.7" strokeLinecap="round" />
    <line x1="3" y1="12" x2="5" y2="12" stroke="#641623" strokeWidth="1.7" strokeLinecap="round" />
    <line x1="19" y1="12" x2="21" y2="12" stroke="#641623" strokeWidth="1.7" strokeLinecap="round" />
    <line x1="5.6" y1="5.6" x2="7.1" y2="7.1" stroke="#641623" strokeWidth="1.7" strokeLinecap="round" />
    <line x1="16.9" y1="16.9" x2="18.4" y2="18.4" stroke="#641623" strokeWidth="1.7" strokeLinecap="round" />
    <line x1="18.4" y1="5.6" x2="16.9" y2="7.1" stroke="#641623" strokeWidth="1.7" strokeLinecap="round" />
    <line x1="7.1" y1="16.9" x2="5.6" y2="18.4" stroke="#641623" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

/** Drooping wilted flower icon for fresh flower comparison */
export const WiltedFlowerIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path d="M9 21V11C9 7.5 11.5 6 14 7" stroke="#991B1B" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M14 7C16.5 8 17.5 11 15 12.5C13 13.5 12.5 10.5 14 7Z" fill="#FECACA" stroke="#991B1B" strokeWidth="1.5" />
    <path d="M9 16L6 14.5" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Verified green checkmark icon */
export const CheckCircleIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <circle cx="12" cy="12" r="9" fill="#E3F5E1" stroke="#236E38" strokeWidth="1.8" />
    <polyline points="8.5 12.2 11 14.7 15.8 9.5" stroke="#236E38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

