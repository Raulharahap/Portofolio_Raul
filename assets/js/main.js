/**
 * ==========================================================================
 * MAIN.JS - Apple Clean Liquid Glass Interactions (Optimized 60/120 FPS)
 * Portfolio: Raul Danovan Harahap
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. HARDWARE-ACCELERATED MOUSE GLOW TRACKER (Zero Style Recalculation)
  // --------------------------------------------------------------------------
  const mouseGlow = document.querySelector('.mouse-glow');
  if (mouseGlow && window.matchMedia('(hover: hover)').matches) {
    let mouseFrame = null;
    window.addEventListener('pointermove', (e) => {
      if (mouseFrame) return;
      mouseFrame = requestAnimationFrame(() => {
        mouseGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        mouseFrame = null;
      });
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 2. MOBILE MENU TOGGLE
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('main-navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      if (menuIcon) {
        menuIcon.classList.toggle('fa-bars');
        menuIcon.classList.toggle('fa-xmark');
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (menuIcon) {
          menuIcon.classList.remove('fa-xmark');
          menuIcon.classList.add('fa-bars');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. NAVBAR GLASS BLUR ON SCROLL & BACK TO TOP (Throttled via rAF)
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      if (navbar) {
        if (scrollY > 40) {
          navbar.classList.add('py-3', 'bg-white/80', 'backdrop-blur-2xl', 'border-b', 'border-black/[0.06]', 'shadow-sm');
          navbar.classList.remove('py-5', 'bg-transparent', 'border-transparent');
        } else {
          navbar.classList.add('py-5', 'bg-transparent', 'border-transparent');
          navbar.classList.remove('py-3', 'bg-white/80', 'backdrop-blur-2xl', 'border-b', 'border-black/[0.06]', 'shadow-sm');
        }
      }

      if (backToTopBtn) {
        if (scrollY > 500) {
          backToTopBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
          backToTopBtn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        } else {
          backToTopBtn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
          backToTopBtn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
      }

      scrollTicking = false;
    });
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // --------------------------------------------------------------------------
  // 4. FLUID SCROLL REVEAL (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --------------------------------------------------------------------------
  // 5. ACTIVE NAVIGATION TRACKING
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id], footer[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserverOptions = { root: null, rootMargin: '-35% 0px -55% 0px', threshold: 0 };

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');

          desktopLinks.forEach(link => {
            link.classList.remove('text-[#1d1d1f]', 'bg-black/[0.06]', 'shadow-sm');
            link.classList.add('text-[#6e6e73]');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('text-[#1d1d1f]', 'bg-black/[0.06]', 'shadow-sm');
              link.classList.remove('text-[#6e6e73]');
            }
          });

          mobileLinks.forEach(link => {
            link.classList.remove('text-[#1d1d1f]', 'bg-black/[0.06]');
            link.classList.add('text-[#6e6e73]');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('text-[#1d1d1f]', 'bg-black/[0.06]');
              link.classList.remove('text-[#6e6e73]');
            }
          });
        }
      });
    }, navObserverOptions);

    sections.forEach(sec => navObserver.observe(sec));
  }

  // --------------------------------------------------------------------------
  // 6. COPY TO CLIPBOARD WITH APPLE FROSTED GLASS TOAST
  // --------------------------------------------------------------------------
  function showToastMessage() {
    const container = document.querySelector('.toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fas fa-check-circle text-emerald-600 text-sm"></i>
      <span>Email berhasil disalin ke clipboard!</span>
    `;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  window.copyToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => showToastMessage());
    } else {
      const temp = document.createElement('input');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      showToastMessage();
    }
  };

  // --------------------------------------------------------------------------
  // 7. LIGHTBOX THEATER MODE (Certificate Preview)
  // --------------------------------------------------------------------------
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  if (modal && modalImg) {
    const openModal = (src) => {
      modalImg.src = src;
      modal.classList.remove('hidden');
      void modal.offsetWidth;

      modal.classList.remove('opacity-0');
      modalImg.classList.remove('scale-95');
      modalImg.classList.add('scale-100');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.add('opacity-0');
      modalImg.classList.remove('scale-100');
      modalImg.classList.add('scale-95');
      document.body.style.overflow = '';

      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    };

    // Event delegation for all cert triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.cert-trigger');
      if (trigger) {
        openModal(trigger.src);
      }
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }
});
