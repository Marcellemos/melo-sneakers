/* ============================================================
   AURA SNEAKERS — script.js
   ============================================================ */

/* ── Intersection Observer — Reveal Animations ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ── Skeleton / Image Loading ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.product-card__img').forEach((img) => {
      img.classList.add('loaded');
      const skeleton = img.previousElementSibling;
      if (skeleton && skeleton.classList.contains('product-card__skeleton')) {
        skeleton.style.opacity = '0';
        setTimeout(() => skeleton.remove(), 1000);
      }
    });
  }, 800);
});

/* ── Cart Logic ── */
let cartCount = 0;
const cartBadge = document.getElementById('cart-count');
const cartTrigger = document.getElementById('cart-trigger');

function addToCart(event, button) {
  event.stopPropagation();

  const card = button.closest('.product-card');
  const originalImg = card.querySelector('.product-card__img');
  const rect = originalImg.getBoundingClientRect();

  // Create ghost image for fly animation
  const ghost = document.createElement('img');
  ghost.src = originalImg.src;
  ghost.className = 'fly-to-cart';
  ghost.style.left   = rect.left   + 'px';
  ghost.style.top    = rect.top    + 'px';
  ghost.style.width  = rect.width  + 'px';
  ghost.style.height = rect.height + 'px';
  ghost.style.opacity = '0.8';
  document.body.appendChild(ghost);

  const cartRect = cartTrigger.getBoundingClientRect();

  requestAnimationFrame(() => {
    ghost.style.left      = (cartRect.left + 10) + 'px';
    ghost.style.top       = (cartRect.top  + 10) + 'px';
    ghost.style.width     = '20px';
    ghost.style.height    = '20px';
    ghost.style.opacity   = '0';
    ghost.style.transform = 'rotate(45deg)';
  });

  setTimeout(() => {
    cartCount++;
    cartBadge.textContent = cartCount;
    cartBadge.classList.add('cart-pulse');
    ghost.remove();

    setTimeout(() => cartBadge.classList.remove('cart-pulse'), 400);
  }, 800);
}

/* ── Hero Parallax ── */
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroTitle = document.querySelector('.hero__watermark h1');
  const heroBg    = document.querySelector('.hero__bg img');

  if (heroTitle) heroTitle.style.transform = `translateY(${scrolled * 0.3}px)`;
  if (heroBg)    heroBg.style.transform    = `translateY(${scrolled * 0.15}px)`;
}, { passive: true });