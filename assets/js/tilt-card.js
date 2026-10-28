/**
 * ==========================================================================
 * TILT-CARD.JS - Buttery Smooth 60/120 FPS 3D Tilt Physics
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

        // Subtly bounded 2.2 degree tilt for elegant tactile response
        const maxRotate = 2.2;
        const rotateX = ((y - centerY) / centerY) * -maxRotate;
        const rotateY = ((x - centerX) / centerX) * maxRotate;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -4px, 0)`;
        ticking = false;
      });
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
    });
  });
});
