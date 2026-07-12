/* ── Config / Constants ── */
const ANIMATION = {
  FLY_DURATION_MS: 800,
  PULSE_DURATION_MS: 400,
  SKELETON_FADE_DELAY_MS: 800,
  SKELETON_REMOVE_DELAY_MS: 1000,
};

/* ── Intersection Observer — Reveal Animations ── */
function initRevealAnimations() {
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
}

/* ── Skeleton / Image Loading ── */
function initImageSkeletons() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.querySelectorAll('.product-card__img').forEach((img) => {
        img.classList.add('loaded');
        const skeleton = img.previousElementSibling;
        if (skeleton && skeleton.classList.contains('product-card__skeleton')) {
          skeleton.style.opacity = '0';
          setTimeout(() => skeleton.remove(), ANIMATION.SKELETON_REMOVE_DELAY_MS);
        }
      });
    }, ANIMATION.SKELETON_FADE_DELAY_MS);
  });
}

/* ── Cart Controller ── */
class CartController {
  #count = 0;

  constructor(badgeEl, triggerEl) {
    if (!badgeEl || !triggerEl) {
      throw new Error('CartController: elementos do carrinho não encontrados no DOM.');
    }
    this.badgeEl = badgeEl;
    this.triggerEl = triggerEl;
  }

  get count() {
    return this.#count;
  }

  increment() {
    this.#count += 1;
    this.#updateBadge();
    return this.#count;
  }

  #updateBadge() {
    this.badgeEl.textContent = String(this.#count);
    this.badgeEl.classList.add('cart-pulse');
    setTimeout(() => this.badgeEl.classList.remove('cart-pulse'), ANIMATION.PULSE_DURATION_MS);
  }

  getTriggerRect() {
    return this.triggerEl.getBoundingClientRect();
  }
}

/* ── Fly-to-cart Animation ── */
function createGhostImage(sourceImg, startRect) {
  const ghost = document.createElement('img');
  ghost.src = sourceImg.src;
  ghost.alt = '';
  ghost.className = 'fly-to-cart';
  ghost.style.left = `${startRect.left}px`;
  ghost.style.top = `${startRect.top}px`;
  ghost.style.width = `${startRect.width}px`;
  ghost.style.height = `${startRect.height}px`;
  ghost.style.opacity = '0.8';
  document.body.appendChild(ghost);
  return ghost;
}

function animateGhostToCart(ghost, targetRect) {
  requestAnimationFrame(() => {
    ghost.style.left = `${targetRect.left + 10}px`;
    ghost.style.top = `${targetRect.top + 10}px`;
    ghost.style.width = '20px';
    ghost.style.height = '20px';
    ghost.style.opacity = '0';
    ghost.style.transform = 'rotate(45deg)';
  });
}

function handleAddToCart(cart, button) {
  const card = button.closest('.product-card');
  const productImg = card?.querySelector('.product-card__img');

  if (!productImg) {
    console.warn('Imagem do produto não encontrada para animação do carrinho.');
    cart.increment();
    return;
  }

  const startRect = productImg.getBoundingClientRect();
  const ghost = createGhostImage(productImg, startRect);
  const cartRect = cart.getTriggerRect();

  animateGhostToCart(ghost, cartRect);

  setTimeout(() => {
    cart.increment();
    ghost.remove();
  }, ANIMATION.FLY_DURATION_MS);
}

function initCart() {
  const badgeEl = document.getElementById('cart-count');
  const triggerEl = document.getElementById('cart-trigger');
  const cart = new CartController(badgeEl, triggerEl);

  document.querySelectorAll('[data-add-to-cart]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      handleAddToCart(cart, button);
    });
  });

  // Keyboard accessibility for the cart trigger (role="button")
  triggerEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      triggerEl.click();
    }
  });
}

/* ── Hero Parallax ── */
function initHeroParallax() {
  const heroTitle = document.querySelector('.hero__watermark h1');
  const heroVideo = document.querySelector('.hero__video');

  window.addEventListener(
    'scroll',
    () => {
      const scrolled = window.pageYOffset;
      if (heroTitle) heroTitle.style.transform = `translateY(${scrolled * 0.3}px)`;
      if (heroVideo) heroVideo.style.transform = `translateY(${scrolled * 0.15}px)`;
    },
    { passive: true }
  );
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initRevealAnimations();
  initImageSkeletons();
  initCart();
  initHeroParallax();
});