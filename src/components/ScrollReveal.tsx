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
  yOffset = 48,
  duration = 1.4, // Generous 1.4s organic, realistic fade
  id,
}) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: yOffset, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.08, margin: '0px 0px -40px 0px' }}
      transition={{
        opacity: {
          duration: duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1.0], // Gentle, realistic sinusoidal fade
        },
        y: {
          duration: duration + 0.1,
          delay,
          ease: [0.22, 0.61, 0.36, 1.0], // Natural fluid rise
        },
        scale: {
          duration: duration + 0.1,
          delay,
          ease: [0.22, 0.61, 0.36, 1.0],
        },
      }}
      className={`will-change-[opacity,transform] ${className}`}
    >
      {children}
    </motion.div>
  );
};
