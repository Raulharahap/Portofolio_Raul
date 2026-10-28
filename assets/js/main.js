/**
 * ==========================================================================
 * MAIN.JS - Apple Clean Light Aesthetic Interactions
 * Portfolio: Raul Danovan Harahap
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 0. INITIALIZE APPLE LIQUID GLASS OPTICS (deepika-builds/liquid-glass)
  // --------------------------------------------------------------------------
  if (typeof liquidGlass === 'function') {
    const cards = document.querySelectorAll('.apple-glass-card');
    const instances = [];
    cards.forEach(card => {
      instances.push(liquidGlass(card, {
        scale: -95,       // Apple magnifying bulge strength (-60 subtle to -180 dramatic)
        chroma: 5,        // Chromatic aberration / prism fringe at edges
        border: 0.07,     // Confines refraction to the 28px squircle rim
        mapBlur: 10,      // Softness of the bulge rim
        blur: 4,          // Internal backdrop blur
        saturate: 1.5,    // Saturation boost
        fallbackBlur: 18  // Safari & Firefox fallback
      }));
    });

    // Refresh after images / webfonts complete layout
    window.addEventListener('load', () => {
      instances.forEach(inst => {
        if (inst && typeof inst.refresh === 'function') {
          inst.refresh();
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 1. MOBILE MENU TOGGLE
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
  // 2. NAVBAR SCROLL FROSTED GLASS & BACK TO TOP
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('py-3', 'bg-white/80', 'backdrop-blur-xl', 'border-b', 'border-black/5', 'shadow-sm');
        navbar.classList.remove('py-5', 'bg-transparent', 'border-transparent');
      } else {
        navbar.classList.add('py-5', 'bg-transparent', 'border-transparent');
        navbar.classList.remove('py-3', 'bg-white/80', 'backdrop-blur-xl', 'border-b', 'border-black/5', 'shadow-sm');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
      } else {
        backToTopBtn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // --------------------------------------------------------------------------
  // 3. FLUID SCROLL REVEAL OBSERVER
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
  // 4. ACTIVE NAVIGATION TRACKING
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
            link.classList.remove('text-[#1d1d1f]', 'font-semibold', 'bg-black/5');
            link.classList.add('text-[#86868b]');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('text-[#1d1d1f]', 'font-semibold', 'bg-black/5');
              link.classList.remove('text-[#86868b]');
            }
          });

          mobileLinks.forEach(link => {
            link.classList.remove('text-[#1d1d1f]', 'font-semibold', 'bg-black/5');
            link.classList.add('text-[#86868b]');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('text-[#1d1d1f]', 'font-semibold', 'bg-black/5');
              link.classList.remove('text-[#86868b]');
            }
          });
        }
      });
    }, navObserverOptions);

    sections.forEach(sec => navObserver.observe(sec));
  }

  // --------------------------------------------------------------------------
  // 5. COPY TO CLIPBOARD WITH APPLE TOAST FEEDBACK
  // --------------------------------------------------------------------------
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

  function showToastMessage() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle text-emerald-600 text-base"></i><span>Alamat email berhasil disalin ke clipboard</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  }
});

// --------------------------------------------------------------------------
// 6. CERTIFICATE LIGHTBOX (Apple Theater Mode)
// --------------------------------------------------------------------------
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-image');
const modalClose = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');
const certTriggers = document.querySelectorAll('.cert-trigger');

if (modal && modalImg && certTriggers.length > 0) {
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

  certTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      openModal(trigger.src);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}
