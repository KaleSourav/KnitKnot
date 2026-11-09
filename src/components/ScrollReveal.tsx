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
  yOffset = 20,
  duration = 0.45,
  id,
}) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01, margin: '220px 0px 100px 0px' }}
      transition={{
        opacity: {
          duration: Math.min(duration, 0.5),
          delay,
          ease: [0.16, 1, 0.3, 1], // Crisp, modern Apple-style deceleration curve
        },
        y: {
          duration: Math.min(duration, 0.5),
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      className={`will-change-[opacity,transform] ${className}`}
    >
      {children}
    </motion.div>
  );
};
