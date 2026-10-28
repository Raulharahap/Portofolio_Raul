/**
 * ==========================================================================
 * TILT-CARD.JS - Buttery Smooth 3D Liquid Glass Physics
 * Portfolio: Raul Danovan Harahap
 * ==========================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const canHover = window.matchMedia('(hover: hover)').matches;
  if (!canHover) return;

  const tiltCards = document.querySelectorAll('.liquid-tilt-card');
  if (!tiltCards.length) return;

  tiltCards.forEach(card => {
    let ticking = false;

    card.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Subtly bounded 2.2 degree tilt
        const maxRotate = 2.2;
        const rotateX = ((y - centerY) / centerY) * -maxRotate;
        const rotateY = ((x - centerX) / centerX) * maxRotate;

        card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        ticking = false;
      });
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
});
