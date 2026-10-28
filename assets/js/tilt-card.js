/**
 * ==========================================================================
 * TILT-CARD.JS - Subtle and Elegant Hover Interactions
 * Portfolio: Raul Danovan Harahap
 * ==========================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Keep interaction understated and refined without artificial glare
  const tiltWrappers = document.querySelectorAll('.tilt-card-wrapper');
  if (!tiltWrappers.length) return;

  const canHover = window.matchMedia('(hover: hover)').matches;
  if (!canHover) return;

  tiltWrappers.forEach(wrapper => {
    const card = wrapper.querySelector('.tilt-card');
    if (!card) return;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Very subtle, micro-perspective (max 1.5 deg) - no jitter, no glare
      const maxRotate = 1.5;
      const rotateX = ((y - centerY) / centerY) * -maxRotate;
      const rotateY = ((x - centerX) / centerX) * maxRotate;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
});
