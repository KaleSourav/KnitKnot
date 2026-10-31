import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GooeyNav, { GooeyNavItem } from './components/GooeyNav';
import { AllCategoriesShowcase } from './components/AllCategoriesShowcase';
import './index.css';

// 1. Navigation bar
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

// 2. All Categories Showcase Section
const categoriesContainer =
  document.getElementById('floating-categories-root') ||
  document.getElementById('categories-root') ||
  document.getElementById('slideshow-root') ||
  document.getElementById('scroll-stack-root');

if (categoriesContainer) {
  createRoot(categoriesContainer).render(
    <StrictMode>
      <AllCategoriesShowcase />
    </StrictMode>
  );
}
