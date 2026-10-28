/**
 * ==========================================================================
 * TILT-CARD.JS - Apple Liquid Glass Micro-Parallax & Cursor Glare
 * Portfolio: Raul Danovan Harahap
 * ==========================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const canHover = window.matchMedia('(hover: hover)').matches;
  if (!canHover) return;

  const tiltCards = document.querySelectorAll('.apple-glass-card');
  if (!tiltCards.length) return;

  tiltCards.forEach(card => {
    let ticking = false;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update specular glare reflection coordinates
      const gx = ((x / rect.width) * 100).toFixed(1);
      const gy = ((y / rect.height) * 100).toFixed(1);
      card.style.setProperty('--gx', `${gx}%`);
      card.style.setProperty('--gy', `${gy}%`);

      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const maxRotate = 1.8;
        const rotateX = ((y - centerY) / centerY) * -maxRotate;
        const rotateY = ((x - centerX) / centerX) * maxRotate;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        ticking = false;
      });
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
});
