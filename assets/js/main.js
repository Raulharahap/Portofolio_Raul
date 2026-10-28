/**
 * ==========================================================================
 * MAIN.JS - Logika Navigasi, Interaktivitas, & Modal Portofolio
 * Portfolio: Raul Danovan Harahap
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

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
  // 2. NAVBAR ON SCROLL & BACK TO TOP
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar background transition
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('py-3.5', 'bg-[#0b0f17]/95', 'border-b', 'border-white/10');
        navbar.classList.remove('py-5', 'bg-transparent', 'border-transparent');
      } else {
        navbar.classList.add('py-5', 'bg-transparent', 'border-transparent');
        navbar.classList.remove('py-3.5', 'bg-[#0b0f17]/95', 'border-b', 'border-white/10');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 500) {
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
  // 3. SCROLL REVEAL (Smooth Stagger)
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
  // 4. ACTIVE LINK HIGHLIGHTING
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
            link.classList.remove('text-white', 'font-semibold');
            link.classList.add('text-slate-400');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('text-white', 'font-semibold');
              link.classList.remove('text-slate-400');
            }
          });

          mobileLinks.forEach(link => {
            link.classList.remove('text-white', 'bg-white/10');
            link.classList.add('text-slate-400');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('text-white', 'bg-white/10');
              link.classList.remove('text-slate-400');
            }
          });
        }
      });
    }, navObserverOptions);

    sections.forEach(sec => navObserver.observe(sec));
  }

  // --------------------------------------------------------------------------
  // 5. COPY TO CLIPBOARD TOAST
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
    toast.innerHTML = `<i class="fas fa-check text-sky-400 text-sm"></i><span>Alamat email berhasil disalin</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
});

// --------------------------------------------------------------------------
// 6. IMAGE MODAL / LIGHTBOX (Sertifikat Preview)
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
