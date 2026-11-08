import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  id?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  yOffset = 42,
  duration = 0.9,
  id,
}) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Soft, luxurious cubic-bezier deceleration
      }}
      className={`will-change-[opacity,transform] ${className}`}
    >
      {children}
    </motion.div>
  );
};
