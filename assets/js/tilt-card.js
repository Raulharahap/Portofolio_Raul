/**
 * ==========================================================================
 * TILT-CARD.JS - Buttery Smooth 3D Liquid Glass Physics & Specular Glare
 * Portfolio: Raul Danovan Harahap
 * ==========================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const canHover = window.matchMedia('(hover: hover)').matches;
  if (!canHover) return;

  const tiltCards = document.querySelectorAll('.liquid-tilt-card, .liquid-glass');
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

        // Pass local coordinates for realistic specular glare tracking
        card.style.setProperty('--mouse-x-local', `${x}px`);
        card.style.setProperty('--mouse-y-local', `${y}px`);

        if (card.classList.contains('liquid-tilt-card')) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          // Subtly bounded 2.4 degree tilt for tactile depth
          const maxRotate = 2.4;
          const rotateX = ((y - centerY) / centerY) * -maxRotate;
          const rotateY = ((x - centerX) / centerX) * maxRotate;

          card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
        }

        ticking = false;
      });
    });

    card.addEventListener('mouseleave', () => {
      if (card.classList.contains('liquid-tilt-card')) {
        card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      }
    });
  });
});
