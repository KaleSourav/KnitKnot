import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GooeyNav, { GooeyNavItem } from './components/GooeyNav';
import './index.css';

const navContainer = document.getElementById('gooey-nav-root');
if (navContainer) {
  const items: GooeyNavItem[] = [
    { label: 'Flowers', href: '#flowers' },
    { label: 'Flower Pots', href: '#flower-pots' },
    { label: 'Bags', href: '#bags' },
    { label: 'Keychains', href: '#keychains' },
    { label: 'Accessories', href: '#accessories' },
    { label: 'BYOB Studio', href: '#byob' },
  ];

  createRoot(navContainer).render(
    <StrictMode>
      <GooeyNav
        items={items}
        initialActiveIndex={0}
        theme="light"
        size="md"
        frame
        particleCount={15}
        spread={56}
        animationTime={600}
        timeVariance={300}
        gooeyness={0.5}
        wobble={0.5}
        hoverEffect
        color="#4d6a10"
        activeTextColor="#ffffff"
        onChange={(index, item) => {
          console.log('Selected category:', index, item.label);
        }}
      />
    </StrictMode>
  );
}
