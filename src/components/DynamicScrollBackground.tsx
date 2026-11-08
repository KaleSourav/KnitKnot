import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayOffset: number;
  rotation: number;
  rotationSpeed: number;
  flipAngle: number;
  flipSpeed: number;
  opacity: number;
  baseOpacity: number;
  type: 'petal-pink' | 'petal-peach' | 'daisy' | 'sparkle' | 'heart' | 'lavender';
  depth: number; // 0.6 (far) to 1.2 (near)
}

export const DynamicScrollBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track scroll velocity for natural parallax breeze
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    // Track mouse position for gentle petal wafting
    let mouseX = -1000;
    let mouseY = -1000;

    // Handle high DPI
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      scrollVelocity = Math.max(-15, Math.min(15, delta * 0.15));
      lastScrollY = currentScrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle types pool for a cozy crochet garden aesthetic
    const types: Particle['type'][] = [
      'petal-pink',
      'petal-pink',
      'petal-peach',
      'daisy',
      'sparkle',
      'sparkle',
      'heart',
      'lavender',
    ];

    const particleCount = width < 768 ? 22 : 36;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const depth = 0.6 + Math.random() * 0.6;
      const type = types[Math.floor(Math.random() * types.length)];
      const baseOpacity =
        type === 'sparkle'
          ? 0.5 + Math.random() * 0.4
          : 0.35 + Math.random() * 0.35;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: (type === 'daisy' ? 14 : type === 'sparkle' ? 9 : 12) * depth,
        speedY: (0.4 + Math.random() * 0.6) * depth,
        speedX: (Math.random() - 0.5) * 0.3,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayAmplitude: 0.8 + Math.random() * 1.4,
        swayOffset: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        flipAngle: Math.random() * Math.PI,
        flipSpeed: 0.01 + Math.random() * 0.02,
        opacity: baseOpacity,
        baseOpacity,
        type,
        depth,
      });
    }

    let time = 0;

    // Drawing helpers for pure vector-like artisanal rendering
    const drawPetal = (
      c: CanvasRenderingContext2D,
      p: Particle,
      color1: string,
      color2: string
    ) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      // 3D flip effect
      const scaleY = Math.cos(p.flipAngle);
      c.scale(1, Math.abs(scaleY) < 0.1 ? 0.1 : scaleY);

      c.beginPath();
      c.moveTo(0, -p.size);
      c.bezierCurveTo(p.size * 0.8, -p.size * 0.4, p.size * 0.8, p.size * 0.5, 0, p.size);
      c.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.4, 0, -p.size);

      const grad = c.createLinearGradient(0, -p.size, 0, p.size);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      c.fillStyle = grad;
      c.globalAlpha = p.opacity;
      c.fill();

      // Subtle delicate center rib
      c.beginPath();
      c.moveTo(0, -p.size * 0.7);
      c.lineTo(0, p.size * 0.6);
      c.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      c.lineWidth = 1;
      c.stroke();

      c.restore();
    };

    const drawDaisy = (c: CanvasRenderingContext2D, p: Particle) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      c.globalAlpha = p.opacity;

      const r = p.size * 0.5;
      const petalR = r * 0.65;

      // 5 soft rounded petals
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        c.beginPath();
        c.arc(px, py, petalR, 0, Math.PI * 2);
        c.fillStyle = '#FFFDF8';
        c.fill();
        c.strokeStyle = 'rgba(100, 22, 35, 0.15)';
        c.lineWidth = 0.8;
        c.stroke();
      }

      // Golden center
      c.beginPath();
      c.arc(0, 0, r * 0.55, 0, Math.PI * 2);
      c.fillStyle = '#FBBF24';
      c.fill();

      c.restore();
    };

    const drawSparkle = (c: CanvasRenderingContext2D, p: Particle) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      // Soft breathing twinkle pulse
      const twinkle = 0.7 + Math.sin(time * 3 + p.swayOffset) * 0.3;
      c.globalAlpha = p.opacity * twinkle;

      const s = p.size;
      c.beginPath();
      c.moveTo(0, -s);
      c.quadraticCurveTo(s * 0.15, -s * 0.15, s, 0);
      c.quadraticCurveTo(s * 0.15, s * 0.15, 0, s);
      c.quadraticCurveTo(-s * 0.15, s * 0.15, -s, 0);
      c.quadraticCurveTo(-s * 0.15, -s * 0.15, 0, -s);
      c.closePath();

      c.fillStyle = '#F59E0B';
      c.fill();

      // Soft white central highlight
      c.beginPath();
      c.arc(0, 0, s * 0.22, 0, Math.PI * 2);
      c.fillStyle = '#FFFBEB';
      c.fill();

      c.restore();
    };

    const drawHeart = (c: CanvasRenderingContext2D, p: Particle) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      c.globalAlpha = p.opacity;

      const s = p.size * 0.8;
      c.beginPath();
      c.moveTo(0, s * 0.4);
      c.bezierCurveTo(-s * 0.6, -s * 0.2, -s, -s * 0.8, -s * 0.4, -s * 1.1);
      c.bezierCurveTo(0, -s * 1.2, 0, -s * 0.6, 0, -s * 0.4);
      c.bezierCurveTo(0, -s * 0.6, 0, -s * 1.2, s * 0.4, -s * 1.1);
      c.bezierCurveTo(s, -s * 0.8, s * 0.6, -s * 0.2, 0, s * 0.4);
      c.fillStyle = '#F472B6';
      c.fill();

      c.restore();
    };

    const drawLavender = (c: CanvasRenderingContext2D, p: Particle) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      c.globalAlpha = p.opacity;

      const s = p.size * 0.6;
      c.beginPath();
      c.ellipse(0, 0, s * 0.5, s, 0, 0, Math.PI * 2);
      c.fillStyle = '#C084FC';
      c.fill();

      c.beginPath();
      c.ellipse(0, -s * 0.8, s * 0.4, s * 0.7, 0, 0, Math.PI * 2);
      c.fillStyle = '#D8B4FE';
      c.fill();

      c.restore();
    };

    const render = () => {
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // Damp scroll velocity gradually
      scrollVelocity *= 0.92;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Horizontal sinusoidal swaying breeze
        const sway = Math.sin(time * p.swaySpeed * 60 + p.swayOffset) * p.swayAmplitude;

        // Downward drift + scroll parallax boost
        p.y += p.speedY + scrollVelocity * p.depth;
        p.x += p.speedX + sway * 0.4;

        // Subtle 3D tumbling rotation
        p.rotation += p.rotationSpeed;
        p.flipAngle += p.flipSpeed;

        // Gentle interactive mouse wafting
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (1 - dist / 120) * 1.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Wrap around boundaries smoothly
        if (p.y > height + 40) {
          p.y = -30;
          p.x = Math.random() * width;
        } else if (p.y < -40) {
          p.y = height + 30;
          p.x = Math.random() * width;
        }

        if (p.x > width + 40) {
          p.x = -30;
        } else if (p.x < -40) {
          p.x = width + 30;
        }

        // Render particle according to type
        if (p.type === 'petal-pink') {
          drawPetal(ctx, p, '#F472B6', '#FDA4AF');
        } else if (p.type === 'petal-peach') {
          drawPetal(ctx, p, '#FBBF24', '#FED7AA');
        } else if (p.type === 'daisy') {
          drawDaisy(ctx, p);
        } else if (p.type === 'sparkle') {
          drawSparkle(ctx, p);
        } else if (p.type === 'heart') {
          drawHeart(ctx, p);
        } else if (p.type === 'lavender') {
          drawLavender(ctx, p);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* 1. Background Ambient Pastel Breathing Aura Blobs (z-0) */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <div className="absolute top-[5%] -left-[10%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-[#FCE8ED]/50 blur-[90px] animate-pulse duration-[9000ms]" />
        <div className="absolute top-[35%] -right-[12%] w-[420px] sm:w-[580px] h-[420px] sm:h-[580px] rounded-full bg-[#FEF9C3]/45 blur-[100px] animate-pulse duration-[11000ms]" />
        <div className="absolute top-[65%] -left-[8%] w-[460px] sm:w-[620px] h-[460px] sm:h-[620px] rounded-full bg-[#F3E8FF]/40 blur-[95px] animate-pulse duration-[10000ms]" />
        <div className="absolute top-[88%] -right-[10%] w-[400px] sm:w-[550px] h-[400px] sm:h-[550px] rounded-full bg-[#FFEDD5]/40 blur-[90px] animate-pulse duration-[12000ms]" />
      </div>

      {/* 2. Hardware-Accelerated Floating Petals & Fairy Sparkles (z-20, pointer-events-none) */}
      {/* Floats gently across the viewport over all sections including Shop by Category */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none select-none z-20"
        style={{ width: '100%', height: '100%' }}
        aria-hidden="true"
      />
    </>
  );
};

