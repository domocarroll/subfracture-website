/**
 * Subfracture Website - Main Entry Point
 * Vite + Vanilla + GSAP
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initCursor } from './cursor.js';
import { initVisionController } from './vision-controller.js';
import { upgradeFooterAnimation } from './init-footer-upgrade.js';
import { initReadingSpotlight } from './reading-spotlight.js';
import { initCultureStudioDramatics } from './culture-studio-dramatics.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Expose to window for debugging
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

// =====================
// UTILITIES
// =====================
const ready = (fn) =>
  document.readyState !== 'loading'
    ? fn()
    : document.addEventListener('DOMContentLoaded', fn);

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// =====================
// TIMEZONES (BNE & LAX)
// =====================
function initClocks() {
  const zones = [
    { sel: '.clock-bne', tz: 'Australia/Brisbane' },
    { sel: '.clock-lax', tz: 'America/Los_Angeles' }
  ];

  const clocks = zones.map(z => {
    const container = document.querySelector(z.sel);
    if (!container) return null;
    const timeEl = container.querySelector('.clock-time');
    const fmt = new Intl.DateTimeFormat([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: z.tz
    });
    return { timeEl, fmt };
  }).filter(Boolean);

  if (!clocks.length) return;

  function render() {
    const now = new Date();
    clocks.forEach(({ timeEl, fmt }) => {
      timeEl.textContent = fmt.format(now);
    });
  }

  let timer;
  function start() { stop(); render(); timer = setInterval(render, 1000); }
  function stop()  { if (timer) clearInterval(timer); }

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  start();
}

// =====================
// STICKY NAV
// =====================
function initStickyNav() {
  const bar = document.querySelector('.sticky__nav');
  if (!bar) return;

  let lastY = window.scrollY || 0;
  let ticking = false;
  let showAfter = window.innerHeight;
  const topZone = 24;
  const deltaMin = 8;

  function update() {
    const y = window.scrollY || 0;
    const dy = y - lastY;

    const scrollingDown = dy > deltaMin;
    const scrollingUp = dy < -deltaMin;

    if (y <= topZone || y <= showAfter || scrollingDown) {
      bar.classList.remove('is-visible');
    } else if (scrollingUp) {
      bar.classList.add('is-visible');
    }

    lastY = y;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  function onResize() {
    showAfter = window.innerHeight;
    update();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  update();
}

// =====================
// HERO PARALLAX
// =====================
function initHeroParallax() {
  // Hero parallax now handled by GSAP ScrollTrigger in initGSAPAnimations()
  // This prevents transform conflicts between manual scroll and GSAP
  if (prefersReducedMotion()) return;

  // Watermark parallax only (media handled by GSAP)
  const mark = document.querySelector('.hero__watermark');
  if (!mark) return;

  gsap.to(mark, {
    yPercent: -15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero__sticky',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5
    }
  });
}

// =====================
// HERO LIGHTBOX
// =====================
function initHeroLightbox() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const mediaWrap = hero.querySelector('.hero__media');
  if (!mediaWrap) return;

  const nativeVideo = mediaWrap.querySelector('video');

  // Create play cursor
  const playCursor = document.createElement('div');
  playCursor.className = 'hero__play-cursor';
  playCursor.innerHTML = '<span class="icon" aria-hidden="true"></span><span>Sizzle Me</span>';
  document.documentElement.appendChild(playCursor);

  let showCursor = false;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let x = mx, y = my;
  const ease = 0.25;

  function move(e) {
    mx = e.clientX;
    my = e.clientY;
    if (!showCursor) {
      showCursor = true;
      playCursor.style.opacity = '1';
    }
  }

  function leave() {
    showCursor = false;
    playCursor.style.opacity = '0';
  }

  mediaWrap.addEventListener('pointermove', move, { passive: true });
  mediaWrap.addEventListener('pointerenter', () => { playCursor.style.opacity = '1'; showCursor = true; });
  mediaWrap.addEventListener('pointerleave', leave);
  mediaWrap.addEventListener('pointerdown', () => playCursor.classList.add('is-down'));
  mediaWrap.addEventListener('pointerup', () => playCursor.classList.remove('is-down'));

  // Smooth follow animation with visibility cleanup
  let cursorRafId = null;
  function tick() {
    if (!document.body.contains(playCursor)) return; // Element removed
    x += (mx - x) * ease;
    y += (my - y) * ease;
    playCursor.style.transform = `translate(${x}px, ${y}px)`;
    cursorRafId = requestAnimationFrame(tick);
  }
  tick();

  // Pause when page hidden to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(cursorRafId);
    } else {
      tick();
    }
  });

  // Lightbox
  function openLightbox() {
    const lb = document.createElement('div');
    lb.className = 'sf-lightbox';
    lb.innerHTML = `
      <div class="sf-lightbox__inner" role="dialog" aria-modal="true">
        <button class="sf-lightbox__close" aria-label="Close">&times;</button>
      </div>
    `;
    document.body.appendChild(lb);
    document.body.classList.add('sf-modal-open');

    const inner = lb.querySelector('.sf-lightbox__inner');

    if (nativeVideo) {
      const srcEl = nativeVideo.querySelector('source');
      const src = srcEl ? srcEl.getAttribute('src') : nativeVideo.getAttribute('src');
      const type = srcEl ? srcEl.getAttribute('type') : 'video/mp4';
      const v = document.createElement('video');
      v.setAttribute('controls', '');
      v.setAttribute('playsinline', '');
      v.setAttribute('autoplay', '');
      v.innerHTML = `<source src="${src}" type="${type}">`;
      inner.appendChild(v);
      try { nativeVideo.pause(); } catch(e) {}
    }

    requestAnimationFrame(() => lb.classList.add('is-open'));

    function close() {
      lb.classList.remove('is-open');
      setTimeout(() => {
        inner.innerHTML = '';
        lb.remove();
      }, 180);
      document.body.classList.remove('sf-modal-open');
      try { nativeVideo?.play(); } catch(e) {}
      playCursor.style.opacity = showCursor ? '1' : '0';
    }

    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target.classList.contains('sf-lightbox__close')) close();
    });

    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
  }

  mediaWrap.addEventListener('click', openLightbox);
}

// =====================
// ORB ANIMATION
// =====================
function initOrbAnimation() {
  const block = document.querySelector('.intro-block');
  if (!block || prefersReducedMotion()) return;

  const RANGE_X = 60;
  const RANGE_Y = 40;
  const EASES = [
    'cubic-bezier(0.37, 0, 0.63, 1)',
    'cubic-bezier(0.4, 0, 0.2, 1)',
    'cubic-bezier(0.42, 0, 0.58, 1)',
    'cubic-bezier(0.25, 0.1, 0.25, 1)'
  ];

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  let timer;

  function hop() {
    const x = rand(-RANGE_X, RANGE_X).toFixed(2) + 'px';
    const y = rand(-RANGE_Y, RANGE_Y).toFixed(2) + 'px';
    const dur = rand(4, 9).toFixed(2) + 's';
    const ease = pick(EASES);

    block.style.setProperty('--ox', x);
    block.style.setProperty('--oy', y);
    block.style.setProperty('--orb-dur', dur);
    block.style.setProperty('--orb-ease', ease);

    clearTimeout(timer);
    timer = setTimeout(hop, parseFloat(dur) * 1000);
  }

  hop();
}

// =====================
// LOGO MARQUEE (Mobile)
// =====================
function initLogoMarquee() {
  const mq = window.matchMedia('(max-width: 900px)');
  const strip = document.querySelector('.logo-strip');
  const track = strip?.querySelector('.logo-grid');

  if (!strip || !track) return;

  function onceImagesLoaded(el, cb) {
    const imgs = el.querySelectorAll('img');
    let left = imgs.length;
    if (!left) return cb();
    const done = () => { if (--left === 0) cb(); };
    imgs.forEach(img => img.complete ? done() : (img.addEventListener('load', done), img.addEventListener('error', done)));
  }

  function init() {
    if (mq.matches) {
      if (!track.dataset.duped) {
        track.innerHTML += track.innerHTML;
        track.dataset.duped = '1';
      }

      onceImagesLoaded(track, () => {
        const kids = Array.from(track.children);
        const setSize = Math.floor(kids.length / 2);
        const gap = parseFloat(getComputedStyle(track).gap) || 0;

        let w = 0;
        for (let i = 0; i < setSize; i++) {
          w += kids[i].getBoundingClientRect().width;
        }
        w += gap * Math.max(0, setSize - 1);

        const SPEED_PX_S = 50;
        const dur = Math.max(10, w / SPEED_PX_S);

        track.style.setProperty('--w', w + 'px');
        track.style.setProperty('--dur', dur + 's');
      });
    } else {
      track.style.removeProperty('--w');
      track.style.removeProperty('--dur');
    }
  }

  init();
  mq.addEventListener('change', init);
  window.addEventListener('resize', init);
}

// =====================
// GSAP ANIMATIONS
// =====================
function initGSAPAnimations() {
  if (prefersReducedMotion()) return;

  // Load timeline
  const loadTL = gsap.timeline({ defaults: { duration: 0.9, ease: 'power2.out' } });

  const watermark = document.querySelector('.hero__watermark');
  if (watermark) {
    gsap.set(watermark, { autoAlpha: 0, y: 40 });
    loadTL.to(watermark, { autoAlpha: 1, y: 0 }, 0.2);
  }

  // Culture Studio title and lede are now handled by initCultureStudioDramatics
  // with premium character-level animations - skip simple fade here
  // (see culture-studio-dramatics.js for the full theatrical experience)

  // Scroll reveals - batched for performance (single observer)
  gsap.set('.reveal', { opacity: 0, y: 40 });
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    onEnter: batch => gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.1
    })
  });

  // Staggered children - elegant cascade
  document.querySelectorAll('.reveal-stagger').forEach((wrap) => {
    const items = wrap.querySelectorAll(':scope > *');
    gsap.fromTo(items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: wrap,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Services grid - batched card reveals for performance
  gsap.set('.sf-service', { opacity: 0, y: 50 });
  ScrollTrigger.batch('.sf-service', {
    start: 'top 90%',
    onEnter: batch => gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.1
    })
  });

  // Approach pillars - simultaneous reveal with scale
  const pillars = document.querySelectorAll('.sf-approach__pillar');
  if (pillars.length) {
    gsap.fromTo(pillars,
      { opacity: 0, y: 30, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.sf-approach__pillars',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // Fight items - alternating slide
  document.querySelectorAll('.sf-fight__item').forEach((item, i) => {
    const enemy = item.querySelector('.sf-fight__enemy');
    const virtue = item.querySelector('.sf-fight__virtue');

    if (enemy && virtue) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });

      tl.fromTo(enemy,
        { opacity: 0, x: -30 },
        { opacity: 0.4, x: 0, duration: 0.6, ease: 'power2.out' }
      )
      .fromTo(virtue,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );
    }
  });

  // Hero media parallax
  const heroMedia = document.querySelector('.hero__media');
  if (heroMedia) {
    gsap.to(heroMedia, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero__sticky',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.3
      }
    });
  }

  // Logo grid reveal (skip clients-reveal section - it has its own animation)
  document.querySelectorAll('.logo-grid').forEach((grid) => {
    // Skip if inside clients-reveal (handled by initClientsReveal)
    if (grid.closest('.clients-reveal')) return;

    const kids = grid.querySelectorAll(':scope > *');
    gsap.from(kids, {
      autoAlpha: 0,
      y: 12,
      duration: 0.45,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Footer animations
  initFooterAnimations();
}

function initFooterAnimations() {
  const closer = document.querySelector('.sf-closer');
  if (!closer) return;

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.7 } });

  const offices = gsap.utils.toArray('.sf-closer__offices .office, .sf-closer__offices > *');
  if (offices.length) {
    gsap.set(offices, { autoAlpha: 0, y: 16 });
    tl.to(offices, { autoAlpha: 1, y: 0, stagger: 0.08 }, 0);
  }

  const mark = closer.querySelector('.sf-closer__mark');
  if (mark) {
    gsap.set(mark, { autoAlpha: 0, y: -10 });
    tl.to(mark, { autoAlpha: 1, y: 0 }, 0.1);
  }

  const big = closer.querySelector('.sf-closer__bigtype');
  if (big) {
    gsap.set(big, { willChange: 'transform, opacity' });
    tl.fromTo(
      big,
      { y: () => window.innerHeight, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1.0,
        ease: 'power2.out',
        force3D: true,
        onComplete: () => { big.style.willChange = 'auto'; } // Cleanup for memory
      },
      0
    );
  }

  // Sentinel for trigger
  let sentinel = document.querySelector('.sf-closer-sentinel');
  if (!sentinel) {
    sentinel = document.createElement('div');
    sentinel.className = 'sf-closer-sentinel';
    sentinel.setAttribute('aria-hidden', 'true');
    closer.parentNode.insertBefore(sentinel, closer);
  }

  ScrollTrigger.create({
    trigger: sentinel,
    start: 'top bottom',
    toggleActions: 'play none none reverse',
    onEnter: () => tl.play(),
    onLeaveBack: () => tl.reverse()
  });
}

// =====================
// PREMIUM SCROLL ANIMATIONS
// =====================

/**
 * Split text into individual character spans while preserving spaces
 * @param {HTMLElement} element - The element containing text to split
 * @returns {HTMLElement[]} Array of span elements wrapping each character
 */
function splitTextToChars(element) {
  if (!element) return [];

  const text = element.textContent || '';
  if (!text.trim()) return [];

  // Clear the element
  element.innerHTML = '';

  const chars = [];

  // Split into words first to preserve word boundaries
  const words = text.split(/(\s+)/);

  words.forEach(word => {
    if (!word) return;

    // Check if this is whitespace
    if (/^\s+$/.test(word)) {
      // Add a space span between words
      const spaceSpan = document.createElement('span');
      spaceSpan.className = 'sf-space';
      spaceSpan.innerHTML = ' ';
      element.appendChild(spaceSpan);
      return;
    }

    // Create a word wrapper to keep characters together
    const wordSpan = document.createElement('span');
    wordSpan.className = 'sf-word';
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';

    // Process each character in the word
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const charSpan = document.createElement('span');
      charSpan.className = 'sf-char';
      charSpan.style.display = 'inline-block';
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
      chars.push(charSpan);
    }

    element.appendChild(wordSpan);
  });

  return chars;
}

/**
 * Character-by-character text reveal for section titles
 */
function initCharacterReveal() {
  if (prefersReducedMotion()) return;

  const titles = document.querySelectorAll('.sf-section__title');
  if (!titles.length) return;

  titles.forEach((title) => {
    // Skip if already processed
    if (title.dataset.charSplit) return;
    title.dataset.charSplit = 'true';

    const chars = splitTextToChars(title);
    if (!chars.length) return;

    // Set initial state (subtle offset to prevent clipping)
    gsap.set(chars, {
      opacity: 0,
      y: 12,
      rotation: 2,
      transformOrigin: 'center bottom'
    });

    // Animate on scroll
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotation: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.03,
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });
}

/**
 * Flow list cascade animation for AI section
 */
function initFlowListCascade() {
  if (prefersReducedMotion()) return;

  const flowContainer = document.querySelector('.sf-ai-flow');
  if (!flowContainer) return;

  const listItems = flowContainer.querySelectorAll('.sf-ai-flow__list li');
  if (!listItems.length) return;

  gsap.fromTo(listItems,
    {
      opacity: 0,
      x: -20
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: flowContainer,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
}

/**
 * Enhanced footer emergence with parallax feel
 */
function initFooterEmergence() {
  if (prefersReducedMotion()) return;

  const bigtype = document.querySelector('.sf-closer__bigtype');
  if (!bigtype) return;

  // Note: The main footer animation is handled in initFooterAnimations()
  // This adds an additional subtle parallax layer if not already animated
  if (bigtype.dataset.emergenceInit) return;
  bigtype.dataset.emergenceInit = 'true';

  // Create a subtle parallax effect on scroll
  ScrollTrigger.create({
    trigger: bigtype,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.5,
    onUpdate: (self) => {
      // Subtle parallax movement based on scroll progress
      const progress = self.progress;
      const yOffset = 40 * (1 - progress);
      const opacity = 0.5 + (0.5 * progress);

      // Only apply if not being animated by the main timeline
      if (!bigtype.classList.contains('is-animating')) {
        gsap.set(bigtype, {
          y: yOffset,
          opacity: opacity
        });
      }
    }
  });
}

/**
 * Scroll progress bar animation
 */
function initScrollProgress() {
  // Create progress bar if it doesn't exist
  let progressBar = document.querySelector('.scroll-progress');

  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);

    // Apply default styles if not in CSS
    Object.assign(progressBar.style, {
      position: 'fixed',
      top: '0',
      right: '0',
      width: '3px',
      height: '100%',
      backgroundColor: 'var(--clr-accent, #000)',
      transformOrigin: 'top center',
      transform: 'scaleY(0)',
      zIndex: '9999',
      pointerEvents: 'none'
    });
  }

  // Animate scaleY based on scroll position
  gsap.to(progressBar, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3
    }
  });
}

/**
 * Initialize all premium scroll animations
 */
function initPremiumAnimations() {
  if (prefersReducedMotion()) return;

  // Character reveal for section titles
  initCharacterReveal();

  // Flow list cascade
  initFlowListCascade();

  // Footer emergence (supplementary to existing)
  // Note: Disabled by default as initFooterAnimations() handles this
  // Uncomment if you want the additional parallax layer:
  // initFooterEmergence();

  // Scroll progress bar
  initScrollProgress();
}

// =====================
// FLOATING ARTWORK PARALLAX
// =====================
function initFloatingArtwork() {
  const artworks = document.querySelectorAll('.floating-art');
  if (!artworks.length) return;

  // Parallax on scroll
  function updateParallax() {
    const scrollY = window.scrollY;

    artworks.forEach((art) => {
      const speed = parseFloat(art.dataset.speed) || 0.5;
      const yOffset = scrollY * speed;
      art.style.transform = `translateY(${-yOffset}px)`;
    });
  }

  // Mouse movement subtle effect with RAF throttling and visibility cleanup
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  let mouseRafId = null;
  let mouseTicking = false;

  document.addEventListener('mousemove', (e) => {
    if (!mouseTicking) {
      requestAnimationFrame(() => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        mouseTicking = false;
      });
      mouseTicking = true;
    }
  }, { passive: true });

  function animateMouseParallax() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    artworks.forEach((art, i) => {
      const factor = 15 + (i * 5);
      // Only apply mouse parallax, scroll is handled separately
      art.style.setProperty('--mouse-x', `${currentX * factor}px`);
      art.style.setProperty('--mouse-y', `${currentY * factor}px`);
    });

    mouseRafId = requestAnimationFrame(animateMouseParallax);
  }

  // Pause when page hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(mouseRafId);
    } else {
      animateMouseParallax();
    }
  });

  // Initialize
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
  animateMouseParallax();

  console.log(`Floating artwork initialized: ${artworks.length} pieces`);
}

// =====================
// GSAP ENHANCED: SCROLL THEATRE
// =====================
function initScrollTheatre() {
  if (prefersReducedMotion()) return;

  // 1. HORIZONTAL SCROLL - Services section
  const servicesSection = document.querySelector('.sf-services');
  const servicesGrid = document.querySelector('.sf-services__grid');

  if (servicesSection && servicesGrid && window.innerWidth > 900) {
    const cards = gsap.utils.toArray('.sf-service');
    const totalWidth = cards.length * (cards[0]?.offsetWidth + 40) || 0;

    gsap.to(cards, {
      xPercent: -100 * (cards.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: servicesSection,
        pin: true,
        scrub: 1,
        snap: 1 / (cards.length - 1),
        end: () => `+=${totalWidth}`,
        invalidateOnRefresh: true
      }
    });
  }

  // 2. PARALLAX DEPTH - Multiple speed layers
  const depthLayers = [
    { selector: '.sf-section__label', speed: 0.3 },
    { selector: '.sf-section__title', speed: 0.15 },
    { selector: '.sf-lead', speed: 0.08 }
  ];

  depthLayers.forEach(({ selector, speed }) => {
    document.querySelectorAll(selector).forEach(el => {
      gsap.to(el, {
        yPercent: -30 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  });

  // 3. APPROACH PILLARS - Scrub reveal with rotation
  const pillarsContainer = document.querySelector('.sf-approach__pillars');
  if (pillarsContainer) {
    const pillars = gsap.utils.toArray('.sf-approach__pillar');

    pillars.forEach((pillar, i) => {
      gsap.fromTo(pillar,
        {
          opacity: 0,
          y: 60,
          rotateX: 15,
          transformPerspective: 1000
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: pillar,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 1
          }
        }
      );
    });
  }
}

// =====================
// GSAP ENHANCED: MICRO-INTERACTIONS
// =====================
function initMicroInteractions() {
  if (prefersReducedMotion()) return;

  // 1. MAGNETIC BUTTONS
  const magneticElements = document.querySelectorAll('a, button, .magnetic');

  magneticElements.forEach(el => {
    const strength = 0.3;
    const ease = 0.1;
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;
    let rafId = null;

    const animate = () => {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      gsap.set(el, {
        x: currentX,
        y: currentY
      });

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        rafId = requestAnimationFrame(animate);
      }
    };

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
    });

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      targetX = (e.clientX - centerX) * strength;
      targetY = (e.clientY - centerY) * strength;

      if (!rafId) rafId = requestAnimationFrame(animate);
    });

    el.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      rafId = requestAnimationFrame(animate);
    });
  });

  // 2. SERVICE CARD HOVER - 3D tilt
  const serviceCards = document.querySelectorAll('.sf-service');

  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.4
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: 'elastic.out(1, 0.5)',
        duration: 0.8
      });
    });
  });

  // 3. TEXT HOVER UNDERLINE ANIMATION
  const links = document.querySelectorAll('.sf-closer a, .sf-section a');

  links.forEach(link => {
    if (link.querySelector('.link-line')) return;

    const line = document.createElement('span');
    line.className = 'link-line';
    line.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: currentColor;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    link.style.position = 'relative';
    link.appendChild(line);

    link.addEventListener('mouseenter', () => {
      line.style.transformOrigin = 'left';
      line.style.transform = 'scaleX(1)';
    });

    link.addEventListener('mouseleave', () => {
      line.style.transformOrigin = 'right';
      line.style.transform = 'scaleX(0)';
    });
  });
}

// =====================
// GSAP ENHANCED: REVEAL DRAMA
// =====================
function initRevealDrama() {
  if (prefersReducedMotion()) return;

  // 1. CLIP-PATH WIPE REVEALS - Section headers
  const sectionHeaders = document.querySelectorAll('.sf-section__header');

  sectionHeaders.forEach(header => {
    gsap.fromTo(header,
      {
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)'
      },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // 2. STAGGER FROM CENTER - Fight items
  const fightGrid = document.querySelector('.sf-fight__grid');
  if (fightGrid) {
    const fightItems = gsap.utils.toArray('.sf-fight__item');

    gsap.fromTo(fightItems,
      {
        opacity: 0,
        scale: 0.8,
        y: 40
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: {
          amount: 0.6,
          from: 'center'
        },
        scrollTrigger: {
          trigger: fightGrid,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // 3. WORD-BY-WORD REVEAL - Lead paragraphs
  const leadTexts = document.querySelectorAll('.sf-lead');

  leadTexts.forEach(lead => {
    if (lead.dataset.wordSplit) return;
    lead.dataset.wordSplit = 'true';

    const text = lead.textContent;
    const words = text.split(' ');
    lead.innerHTML = words.map(word =>
      `<span class="word-wrap" style="display:inline-block;overflow:hidden;vertical-align:top;">
        <span class="word" style="display:inline-block;transform:translateY(100%)">${word}</span>
      </span> `
    ).join('');

    const wordSpans = lead.querySelectorAll('.word');

    gsap.to(wordSpans, {
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.04,
      scrollTrigger: {
        trigger: lead,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });

  // 4. NUMBER COUNTER ANIMATION - Service numbers
  const serviceNumbers = document.querySelectorAll('.sf-service__number');

  serviceNumbers.forEach(num => {
    const finalNum = parseInt(num.textContent);
    if (isNaN(finalNum)) return;

    num.textContent = '00';

    ScrollTrigger.create({
      trigger: num,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(num, {
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: function() {
            const progress = this.progress();
            num.textContent = String(Math.round(finalNum * progress)).padStart(2, '0');
          }
        });
      },
      once: true
    });
  });

  // 5. LOGO GRID - Random pop-in (skip clients-reveal - has its own animation)
  const logoGrid = document.querySelector('.logo-grid:not(.clients-reveal .logo-grid)');
  if (logoGrid) {
    const logoItems = gsap.utils.toArray(logoGrid.querySelectorAll('.logo-grid__item'));
    if (logoItems.length) {
      gsap.fromTo(logoItems,
        {
          opacity: 0,
          scale: 0,
          rotation: () => gsap.utils.random(-15, 15)
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: 'back.out(2)',
          stagger: {
            amount: 0.8,
            from: 'random'
          },
          scrollTrigger: {
            trigger: logoGrid,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }
}

// =====================
// GSAP ENHANCED: SEMANTIC TEXT ANIMATION
// Words animate to reinforce their meaning
// =====================
function initSemanticText() {
  if (prefersReducedMotion()) return;

  // Semantic word mappings - motion that amplifies meaning
  const semanticWords = {
    // Flow & Movement
    'flow': { animation: 'wave', class: 'sem-flow' },
    'flowing': { animation: 'wave', class: 'sem-flow' },
    'movements': { animation: 'drift', class: 'sem-drift' },
    'shift': { animation: 'slide', class: 'sem-slide' },
    'shifting': { animation: 'slide', class: 'sem-slide' },

    // Emotional resonance
    'love': { animation: 'pulse-warm', class: 'sem-love' },
    'acceptance': { animation: 'embrace', class: 'sem-embrace' },
    'accepting': { animation: 'embrace', class: 'sem-embrace' },

    // Creative states
    'pretending': { animation: 'shimmer', class: 'sem-shimmer' },
    'imagination': { animation: 'shimmer', class: 'sem-shimmer' },
    'creative': { animation: 'shimmer', class: 'sem-shimmer' },

    // Tension
    'fight': { animation: 'impact', class: 'sem-impact' },
    'enemy': { animation: 'fade-strike', class: 'sem-enemy' },

    // Opening
    'open': { animation: 'spread', class: 'sem-spread' },
    'curious': { animation: 'tilt', class: 'sem-curious' },

    // Duration
    'sustained': { animation: 'stretch', class: 'sem-stretch' },
    'collective': { animation: 'gather', class: 'sem-gather' },

    // Living systems
    'breathe': { animation: 'breathe', class: 'sem-breathe' },
    'breathing': { animation: 'breathe', class: 'sem-breathe' },

    // The brands
    'DANNI': { animation: 'warm-glow', class: 'sem-danni' },
    'SubFrac.OS': { animation: 'system-pulse', class: 'sem-system' },

    // New semantic words - teaching through motion
    'before-stretch': { animation: 'pre-extend', class: 'sem-pre-extend' },
    'remembers': { animation: 'echo-trail', class: 'sem-echo' },
    'learns': { animation: 'grow-wise', class: 'sem-learn' },
    'Learns': { animation: 'grow-wise', class: 'sem-learn' },
    'sleep': { animation: 'rest-fade', class: 'sem-sleep' },
    'softens': { animation: 'tension-release', class: 'sem-soften' },
    'opening': { animation: 'curtain-part', class: 'sem-opening' },
    'patterns': { animation: 'tessellate', class: 'sem-pattern' },
    'soul': { animation: 'deep-glow', class: 'sem-soul' },
    'inevitable': { animation: 'gravity-settle', class: 'sem-inevitable' }
  };

  // Find and wrap semantic words in the page content
  const contentAreas = document.querySelectorAll('.sf-body, .sf-lead, .sf-ai-part__desc, .sf-fight__manifesto, .sf-ai-flow__outro');

  contentAreas.forEach(area => {
    if (area.dataset.semanticProcessed) return;
    area.dataset.semanticProcessed = 'true';

    let html = area.innerHTML;

    Object.entries(semanticWords).forEach(([word, config]) => {
      // Case-insensitive word boundary match, preserve original case
      const regex = new RegExp(`\\b(${word})\\b`, 'gi');
      html = html.replace(regex, `<span class="sem-word ${config.class}" data-animation="${config.animation}">$1</span>`);
    });

    area.innerHTML = html;
  });

  // Animate semantic words on scroll using batch for performance
  // (Single observer instead of 50+ individual ScrollTriggers)
  ScrollTrigger.batch('.sem-word', {
    start: 'top 85%',
    once: true,
    onEnter: (batch) => {
      batch.forEach(word => {
        const animation = word.dataset.animation;
        animateSemanticWord(word, animation);
      });
    }
  });

  // Animation functions for each semantic type
  function animateSemanticWord(el, type) {
    switch (type) {
      case 'wave':
        // Flowing wave motion
        gsap.fromTo(el,
          { y: 0 },
          {
            keyframes: [
              { y: -3, duration: 0.15 },
              { y: 2, duration: 0.15 },
              { y: -1, duration: 0.1 },
              { y: 0, duration: 0.1 }
            ],
            ease: 'sine.inOut'
          }
        );
        // Continuous subtle wave on hover
        el.addEventListener('mouseenter', () => {
          gsap.to(el, {
            y: -2,
            duration: 0.6,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          });
        });
        el.addEventListener('mouseleave', () => {
          gsap.killTweensOf(el);
          gsap.to(el, { y: 0, duration: 0.3 });
        });
        break;

      case 'pulse-warm':
        // Warm, loving pulse
        gsap.fromTo(el,
          { scale: 1, color: 'inherit' },
          {
            keyframes: [
              { scale: 1.08, duration: 0.3 },
              { scale: 1, duration: 0.4 }
            ],
            ease: 'power2.out'
          }
        );
        el.style.color = '#c45a5a';
        gsap.to(el, { color: 'inherit', duration: 1.5, delay: 0.5 });
        break;

      case 'embrace':
        // Opening, welcoming motion
        gsap.fromTo(el,
          { letterSpacing: '-0.05em', opacity: 0.7 },
          {
            letterSpacing: '0.02em',
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          }
        );
        break;

      case 'shimmer':
        // Dreamy, imaginative shimmer (GPU-friendly: scale instead of blur)
        gsap.fromTo(el,
          { opacity: 0.5, scale: 0.97 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out'
          }
        );
        // Add shimmer effect
        el.style.background = 'linear-gradient(90deg, transparent 0%, rgba(125,84,255,0.15) 50%, transparent 100%)';
        el.style.backgroundSize = '200% 100%';
        gsap.fromTo(el,
          { backgroundPosition: '200% 0' },
          { backgroundPosition: '-200% 0', duration: 1.5, ease: 'power1.inOut' }
        );
        setTimeout(() => { el.style.background = 'none'; }, 1600);
        break;

      case 'impact':
        // Bold, fighting impact
        gsap.fromTo(el,
          { x: -10, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'power3.out'
          }
        );
        gsap.fromTo(el,
          { fontWeight: '400' },
          { fontWeight: '700', duration: 0.1 }
        );
        break;

      case 'fade-strike':
        // Enemy fading, struck through
        gsap.to(el, {
          opacity: 0.4,
          textDecoration: 'line-through',
          duration: 0.8,
          ease: 'power2.out'
        });
        break;

      case 'slide':
        // Lateral shift
        gsap.fromTo(el,
          { x: 20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
          }
        );
        break;

      case 'drift':
        // Gentle drifting motion
        gsap.fromTo(el,
          { x: -5, y: 5, opacity: 0.7 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power1.out'
          }
        );
        break;

      case 'spread':
        // Opening, spreading apart
        gsap.fromTo(el,
          { letterSpacing: '-0.1em', opacity: 0 },
          {
            letterSpacing: '0.05em',
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
          }
        );
        break;

      case 'tilt':
        // Curious tilt/lean
        gsap.fromTo(el,
          { rotation: -3, opacity: 0.7 },
          {
            rotation: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(2)'
          }
        );
        break;

      case 'stretch':
        // Sustained, stretching duration
        gsap.fromTo(el,
          { scaleX: 0.8, opacity: 0.5 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'power1.out'
          }
        );
        break;

      case 'gather':
        // Collective, gathering together
        gsap.fromTo(el,
          { letterSpacing: '0.2em', opacity: 0.5 },
          {
            letterSpacing: '0',
            opacity: 1,
            duration: 0.7,
            ease: 'power2.inOut'
          }
        );
        break;

      case 'breathe':
        // Living, breathing pulse
        gsap.fromTo(el,
          { scale: 0.95 },
          {
            scale: 1.02,
            duration: 1,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: 2
          }
        );
        break;

      case 'warm-glow':
        // DANNI - Organic, breathing, human warmth
        // Initial state
        el.style.textShadow = '0 0 0 transparent';

        // Phase 1: Warm arrival with micro-random timing (human imperfection)
        const humanDelay = 0.8 + (Math.random() * 0.15 - 0.075); // ±75ms variance
        gsap.to(el, {
          textShadow: '0 0 24px rgba(255, 180, 120, 0.6), 0 0 8px rgba(255, 200, 140, 0.3)',
          duration: humanDelay,
          ease: 'sine.out' // Organic easing
        });

        // Phase 2: Settle into gentle breathing
        gsap.to(el, {
          textShadow: '0 0 12px rgba(255, 180, 120, 0.35)',
          duration: 1.2,
          delay: humanDelay,
          ease: 'sine.inOut'
        });

        // Phase 3: Continuous breathing pulse (subtle, organic)
        gsap.to(el, {
          textShadow: '0 0 16px rgba(255, 180, 120, 0.45), 0 0 6px rgba(255, 200, 140, 0.25)',
          duration: 3.5 + Math.random() * 0.5, // Slightly irregular breath cycle
          delay: humanDelay + 1.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1, // Infinite breathing
          repeatDelay: 0.3 + Math.random() * 0.2 // Natural pause between breaths
        });

        // Subtle scale breathing (barely perceptible, like a living thing)
        gsap.to(el, {
          scale: 1.008,
          duration: 3.5,
          delay: humanDelay + 1.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          repeatDelay: 0.3
        });
        break;

      case 'system-pulse':
        // SubFrac.OS - Mechanical, grid-locked, digital precision
        el.style.fontFamily = 'monospace';

        // Phase 1: Boot sequence with exact step timing
        gsap.fromTo(el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.08,
            repeat: 4, // Exactly 5 flickers
            yoyo: true,
            ease: 'steps(1)', // Pure digital on/off
            repeatDelay: 0.06 // Precise 60ms intervals
          }
        );

        // Phase 2: Scan line artifact (moves precisely down the text)
        gsap.fromTo(el,
          {
            backgroundImage: 'linear-gradient(180deg, rgba(125, 84, 255, 0) 0%, rgba(125, 84, 255, 0.4) 50%, rgba(125, 84, 255, 0) 100%)',
            backgroundSize: '100% 4px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 0%'
          },
          {
            backgroundPosition: '0 100%',
            duration: 0.3,
            delay: 0.5,
            ease: 'steps(8)' // Stepped movement (not smooth)
          }
        );

        // Phase 3: Lock into purple glow with metronomic pulse
        gsap.to(el, {
          textShadow: '0 0 12px rgba(125, 84, 255, 0.5), 0 0 4px rgba(125, 84, 255, 0.3)',
          duration: 0.15,
          delay: 0.8,
          ease: 'steps(2)' // Two-step snap into place
        });

        // Phase 4: Machine pulse (metronomic, predictable)
        gsap.to(el, {
          textShadow: '0 0 16px rgba(125, 84, 255, 0.6), 0 0 6px rgba(125, 84, 255, 0.4)',
          duration: 0.8, // Exact timing
          delay: 1.0,
          ease: 'steps(3)', // Quantized steps
          yoyo: true,
          repeat: -1,
          repeatDelay: 0 // No pause, machine doesn't rest
        });

        // Subtle grid-locked flicker (brief opacity drops at exact intervals)
        gsap.to(el, {
          opacity: 0.85,
          duration: 0.05,
          delay: 2.0,
          ease: 'steps(1)',
          repeat: -1,
          repeatDelay: 2.4, // Every 2.45 seconds exactly
          yoyo: true
        });
        break;

      // =====================
      // NEW SEMANTIC ANIMATIONS
      // =====================

      case 'pre-extend':
        // before-stretch: The hyphen elongates, letters spread - self-teaching
        gsap.fromTo(el,
          { letterSpacing: '-0.05em', scaleX: 0.85, opacity: 0.7 },
          {
            keyframes: [
              { scaleX: 0.9, duration: 0.2 },
              { scaleX: 1.15, letterSpacing: '0.08em', duration: 0.5, ease: 'power2.out' },
              { scaleX: 1, letterSpacing: '0.02em', duration: 0.3 }
            ],
            opacity: 1
          }
        );
        break;

      case 'echo-trail':
        // remembers: Persistence, echo effect with ghost trails
        el.style.position = 'relative';
        gsap.fromTo(el,
          { opacity: 0.3 },
          { opacity: 1, duration: 0.5 }
        );
        gsap.fromTo(el,
          { textShadow: '0 0 0 transparent' },
          {
            textShadow: '2px 0 0 rgba(125, 84, 255, 0.3), 4px 0 0 rgba(125, 84, 255, 0.2), 6px 0 0 rgba(125, 84, 255, 0.1)',
            duration: 0.6,
            ease: 'power2.out'
          }
        );
        gsap.to(el, {
          textShadow: '0 0 0 transparent',
          duration: 1.2,
          delay: 0.8,
          ease: 'power1.in'
        });
        break;

      case 'grow-wise':
        // learns: Growth, expansion, gaining weight/presence
        gsap.fromTo(el,
          { scale: 0.88, fontWeight: '300', opacity: 0.6, letterSpacing: '-0.02em' },
          {
            scale: 1.05,
            fontWeight: '500',
            opacity: 1,
            letterSpacing: '0.01em',
            duration: 0.8,
            ease: 'power2.out'
          }
        );
        gsap.to(el, {
          scale: 1,
          fontWeight: '400',
          duration: 0.4,
          delay: 0.8
        });
        break;

      case 'rest-fade':
        // sleep: Gentle descent, fading, eyes-closing feeling
        gsap.fromTo(el,
          { y: -8, opacity: 1 },
          {
            keyframes: [
              { y: 0, opacity: 0.85, duration: 0.6, ease: 'power1.in' },
              { y: 3, opacity: 0.6, duration: 0.5, ease: 'power1.in' },
              { opacity: 0.75, duration: 0.4 }
            ]
          }
        );
        // GPU-friendly: scale down slightly instead of blur
        gsap.fromTo(el,
          { scale: 1 },
          { scale: 0.98, duration: 1.2, ease: 'power1.in' }
        );
        gsap.to(el, {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: 1.2
        });
        break;

      case 'tension-release':
        // softens: Easing, relaxing tension, sharp to rounded
        gsap.fromTo(el,
          { letterSpacing: '-0.08em', fontWeight: '600', opacity: 0.9 },
          {
            letterSpacing: '0.04em',
            fontWeight: '300',
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
          }
        );
        // GPU-friendly: slight scale instead of blur
        gsap.fromTo(el,
          { scale: 0.99 },
          { scale: 1, duration: 0.8, delay: 0.3 }
        );
        gsap.to(el, {
          fontWeight: '400',
          letterSpacing: '0',
          duration: 0.4,
          delay: 1
        });
        break;

      case 'curtain-part':
        // opening: Dramatic, like curtains parting
        gsap.fromTo(el,
          { letterSpacing: '-0.15em', opacity: 0, scaleY: 0.7 },
          {
            keyframes: [
              { letterSpacing: '0.12em', opacity: 1, scaleY: 1, duration: 0.6, ease: 'power3.out' },
              { letterSpacing: '0.03em', duration: 0.3, ease: 'power1.inOut' }
            ]
          }
        );
        el.style.background = 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)';
        el.style.backgroundSize = '200% 100%';
        gsap.fromTo(el,
          { backgroundPosition: '50% 0' },
          { backgroundPosition: '150% 0', duration: 0.8, ease: 'power2.out' }
        );
        setTimeout(() => { el.style.background = 'none'; }, 900);
        break;

      case 'tessellate':
        // patterns: Subtle duplication/tessellation effect
        gsap.fromTo(el,
          { opacity: 0.5 },
          { opacity: 1, duration: 0.4 }
        );
        gsap.fromTo(el,
          { textShadow: '0 0 0 transparent' },
          {
            keyframes: [
              {
                textShadow: '1px 1px 0 rgba(125, 84, 255, 0.2), 2px 2px 0 rgba(125, 84, 255, 0.15), 3px 3px 0 rgba(125, 84, 255, 0.1)',
                duration: 0.5,
                ease: 'steps(3)'
              },
              { textShadow: '0 0 0 transparent', duration: 0.5, delay: 0.3 }
            ]
          }
        );
        break;

      case 'deep-glow':
        // soul: Warm, ethereal, deeper than love
        el.style.textShadow = '0 0 0 transparent';
        gsap.to(el, {
          textShadow: '0 0 25px rgba(255, 200, 140, 0.6), 0 0 40px rgba(255, 180, 100, 0.3)',
          duration: 1,
          ease: 'power2.out'
        });
        gsap.fromTo(el,
          { color: 'inherit' },
          { color: '#d4956c', duration: 0.8, ease: 'power2.inOut' }
        );
        gsap.to(el, {
          color: 'inherit',
          textShadow: '0 0 10px rgba(255, 200, 140, 0.2)',
          duration: 1.5,
          delay: 1
        });
        break;

      case 'gravity-settle':
        // inevitable: Weight, gravity, settling with finality
        gsap.fromTo(el,
          { y: -15, opacity: 0.5, fontWeight: '300' },
          {
            y: 0,
            opacity: 1,
            fontWeight: '600',
            duration: 1.2,
            ease: 'power3.in'
          }
        );
        gsap.fromTo(el,
          { scaleY: 1.1 },
          { scaleY: 0.97, duration: 0.3, delay: 1.1, ease: 'power2.out' }
        );
        gsap.to(el, {
          scaleY: 1,
          fontWeight: '400',
          duration: 0.3,
          delay: 1.4
        });
        break;

      default:
        gsap.fromTo(el,
          { opacity: 0.5 },
          { opacity: 1, duration: 0.5 }
        );
    }
  }

  // Special: AI Flow list - sequential connection
  initAIFlowSequence();

  // Special: AI conversation - DANNI and SubFrac.OS visual dialogue
  initAIConversation();

  // Special: Fight section transformation
  initFightTransformation();
}

// AI Flow list - each step connects to the next
function initAIFlowSequence() {
  const flowList = document.querySelector('.sf-ai-flow__list');
  if (!flowList) return;

  const items = flowList.querySelectorAll('li');

  items.forEach((item, i) => {
    gsap.set(item, { opacity: 0, x: i % 2 === 0 ? -30 : 30 });

    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(item, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: i * 0.15,
          ease: 'power2.out'
        });

        // Draw connecting line to next item
        if (i < items.length - 1) {
          const line = document.createElement('span');
          line.className = 'flow-connector';
          line.style.cssText = `
            position: absolute;
            left: 0;
            bottom: -0.5em;
            width: 0;
            height: 1px;
            background: linear-gradient(90deg, var(--sf-black) 0%, transparent 100%);
          `;
          item.style.position = 'relative';
          item.appendChild(line);

          gsap.to(line, {
            width: '100%',
            duration: 0.4,
            delay: i * 0.15 + 0.3,
            ease: 'power2.out'
          });
        }
      },
      once: true
    });
  });
}

// AI Conversation - Visual dialogue between DANNI and SubFrac.OS
function initAIConversation() {
  const aiParts = document.querySelectorAll('.sf-ai-part');
  if (aiParts.length < 2) return; // Need both DANNI and SubFrac.OS

  const danniPart = aiParts[0]; // First is DANNI
  const subfracPart = aiParts[1]; // Second is SubFrac.OS

  const danniName = danniPart.querySelector('.sf-ai-part__name');
  const subfracName = subfracPart.querySelector('.sf-ai-part__name');

  if (!danniName || !subfracName) return;

  // Wait for both to be visible, then start conversation
  ScrollTrigger.create({
    trigger: subfracPart,
    start: 'top 80%',
    onEnter: () => {
      startVisualConversation(danniName, subfracName);
    },
    once: true
  });
}

function startVisualConversation(danni, subfrac) {
  // Create a subtle "ping-pong" effect between the two AIs
  // DANNI pulses warmly, SubFrac.OS responds with digital precision

  let conversationCycle = 0;

  function conversationLoop() {
    conversationCycle++;

    // DANNI "speaks" - warm pulse with human timing
    gsap.to(danni, {
      textShadow: '0 0 28px rgba(255, 180, 120, 0.7), 0 0 12px rgba(255, 200, 140, 0.4)',
      scale: 1.012,
      duration: 0.6 + Math.random() * 0.3, // Human variance
      ease: 'sine.inOut',
      onComplete: () => {
        // DANNI fades back
        gsap.to(danni, {
          textShadow: '0 0 12px rgba(255, 180, 120, 0.35)',
          scale: 1.0,
          duration: 0.8,
          ease: 'sine.out'
        });
      }
    });

    // SubFrac.OS "responds" after precise delay
    gsap.delayedCall(1.8, () => {
      // SubFrac.OS digital pulse - precise, stepped
      gsap.to(subfrac, {
        textShadow: '0 0 20px rgba(125, 84, 255, 0.8), 0 0 8px rgba(125, 84, 255, 0.6)',
        duration: 0.12,
        ease: 'steps(2)',
        onComplete: () => {
          // Brief flicker
          gsap.to(subfrac, {
            opacity: 0.7,
            duration: 0.04,
            ease: 'steps(1)',
            yoyo: true,
            repeat: 1
          });

          // SubFrac.OS fades back
          gsap.to(subfrac, {
            textShadow: '0 0 12px rgba(125, 84, 255, 0.5), 0 0 4px rgba(125, 84, 255, 0.3)',
            duration: 0.15,
            delay: 0.1,
            ease: 'steps(2)'
          });
        }
      });
    });

    // Schedule next conversation cycle (with natural variation)
    if (conversationCycle < 4) { // Limit to 4 exchanges to avoid overwhelming
      gsap.delayedCall(5.5 + Math.random() * 2, conversationLoop);
    }
  }

  // Start conversation after initial animations settle
  gsap.delayedCall(4.5, conversationLoop);
}

// Fight section - enemy dissolves, virtue strengthens
function initFightTransformation() {
  const fightItems = document.querySelectorAll('.sf-fight__item');

  fightItems.forEach(item => {
    const enemy = item.querySelector('.sf-fight__enemy');
    const arrow = item.querySelector('.sf-fight__arrow');
    const virtue = item.querySelector('.sf-fight__virtue');

    if (!enemy || !virtue) return;

    // Set initial states
    gsap.set(enemy, { opacity: 0, x: -20 });
    gsap.set(arrow, { opacity: 0, scale: 0 });
    gsap.set(virtue, { opacity: 0, x: 20, fontWeight: 400 });

    ScrollTrigger.create({
      trigger: item,
      start: 'top 80%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Enemy appears but weakened
        tl.to(enemy, {
          opacity: 0.4,
          x: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
        // Arrow transforms
        .to(arrow, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'back.out(2)'
        }, '-=0.2')
        // Enemy fades further, gets struck (GPU-friendly: scale instead of blur)
        .to(enemy, {
          opacity: 0.25,
          textDecoration: 'line-through',
          scale: 0.97,
          duration: 0.4
        }, '-=0.1')
        // Virtue emerges strong
        .to(virtue, {
          opacity: 1,
          x: 0,
          fontWeight: 600,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.3')
        // Virtue glows briefly
        .to(virtue, {
          textShadow: '0 0 20px rgba(125, 84, 255, 0.3)',
          duration: 0.3
        })
        .to(virtue, {
          textShadow: 'none',
          duration: 0.5
        });
      },
      once: true
    });
  });
}

// =====================
// CLIENTS REVEAL - LIPS SPREADING ANIMATION
// Vertical unfold "opening from behind" effect
// =====================

function initClientsReveal() {
  const container = document.querySelector('.clients-reveal');
  const headerBlock = document.querySelector('section.header-block');
  const hero = document.querySelector('.hero');
  const content = container?.querySelector('.clients-reveal__content');
  const topLip = container?.querySelector('.clients-reveal__lip--top');
  const bottomLip = container?.querySelector('.clients-reveal__lip--bottom');
  const crack = container?.querySelector('.clients-reveal__crack');

  if (!container || !headerBlock || !hero || !content) return;

  // Ensure collapsed state on init
  gsap.set(container, { gridTemplateRows: '0fr' });

  if (prefersReducedMotion()) {
    gsap.set(container, { gridTemplateRows: '1fr' });
    if (topLip) gsap.set(topLip, { rotateX: -90 });
    if (bottomLip) gsap.set(bottomLip, { rotateX: 90 });
    return;
  }

  // Fix header-block at bottom initially
  headerBlock.classList.add('is-fixed-bottom');

  // ===== SMOOTHNESS: Cache elements and state =====
  const logos = Array.from(container.querySelectorAll('.logo-grid__item'));
  const centerIndex = Math.floor(logos.length / 2);
  const logoDelays = logos.map((_, i) => Math.abs(i - centerIndex) * 0.06);

  // Track animation state for smoothing
  let hasFlashed = false;
  let isBuilding = false;
  let lastScrollY = 0;
  let currentGridProgress = 0;
  let currentLipProgress = 0;
  let lipMomentum = 0;
  let lastLogoUpdate = 0;

  // Micro-tween duration for smooth interpolation
  const TWEEN_DURATION = 0.12;
  const TWEEN_EASE = 'power2.out';

  // Softer ease for scroll-driven animation
  function easeOutSoft(t) {
    // Smooth cubic with subtle overshoot
    return 1 - Math.pow(1 - t, 3) + (Math.sin(t * Math.PI) * 0.04);
  }

  // Smooth interpolation helper
  function lerp(current, target, factor) {
    return current + (target - current) * factor;
  }

  // Create spacer to maintain document flow
  let spacer = document.querySelector('.header-block-spacer');
  if (!spacer) {
    spacer = document.createElement('div');
    spacer.className = 'header-block-spacer';
    headerBlock.parentNode.insertBefore(spacer, headerBlock.nextSibling);
  }
  spacer.classList.add('is-active');

  // ScrollTrigger: hero scrolling up reveals clients
  ScrollTrigger.create({
    trigger: hero,
    start: 'bottom bottom',   // When hero bottom reaches viewport bottom
    end: 'bottom 20%',        // Until hero bottom reaches 20% from top
    scrub: 1,
    onUpdate: (self) => {
      const scrollY = window.scrollY || window.pageYOffset;
      const isScrollingDown = scrollY > lastScrollY;

      // ===== CRACK ANIMATION (anticipation phase: 50-100px) =====
      if (crack) {
        if (scrollY >= 50 && scrollY < 100) {
          const crackProgress = (scrollY - 50) / 50;
          // Smooth crack expansion
          gsap.to(crack, {
            scaleX: crackProgress,
            duration: TWEEN_DURATION,
            ease: TWEEN_EASE,
            overwrite: true
          });

          // Building anticipation (pulse effect)
          if (scrollY >= 80 && !isBuilding) {
            crack.classList.add('is-building');
            isBuilding = true;
          }
        } else if (scrollY < 50) {
          gsap.to(crack, { scaleX: 0, duration: TWEEN_DURATION, ease: TWEEN_EASE, overwrite: true });
          hasFlashed = false;
          isBuilding = false;
          crack.classList.remove('is-building');
        } else {
          // Fade out crack as lips open
          const fadeProgress = Math.min(1, (scrollY - 100) / 50);
          gsap.to(crack, {
            scaleX: 1,
            opacity: 1 - fadeProgress,
            duration: TWEEN_DURATION,
            ease: TWEEN_EASE,
            overwrite: true
          });
        }

        // Purple flash at threshold crossing
        if (scrollY >= 95 && scrollY <= 110 && !hasFlashed && isScrollingDown) {
          crack.classList.remove('is-building');
          crack.classList.add('is-glowing');
          hasFlashed = true;
          isBuilding = false;
          // Smooth glow fade
          gsap.to(crack, {
            '--glow-intensity': 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => crack.classList.remove('is-glowing')
          });
        }

        if (scrollY < 90) {
          hasFlashed = false;
        }
      }

      lastScrollY = scrollY;

      // ===== THRESHOLD CHECK: Don't animate until scrolled past 100px =====
      if (scrollY < 100) {
        currentGridProgress = lerp(currentGridProgress, 0, 0.2);
        currentLipProgress = 0;
        lipMomentum = 0;

        gsap.to(container, {
          gridTemplateRows: '0fr',
          duration: TWEEN_DURATION,
          ease: TWEEN_EASE,
          overwrite: true
        });
        if (topLip) gsap.to(topLip, { rotateX: 0, duration: TWEEN_DURATION, ease: TWEEN_EASE, overwrite: true });
        if (bottomLip) gsap.to(bottomLip, { rotateX: 0, duration: TWEEN_DURATION, ease: TWEEN_EASE, overwrite: true });

        // Reset logos smoothly
        logos.forEach(logo => {
          gsap.to(logo, { opacity: 0, y: 15, scale: 0.92, duration: 0.2, ease: TWEEN_EASE, overwrite: true });
        });

        container.classList.remove('is-animating', 'is-revealed');
        return;
      }

      const progress = self.progress;

      // ===== GRID ANIMATION with smooth interpolation =====
      currentGridProgress = lerp(currentGridProgress, progress, 0.25);
      gsap.to(container, {
        gridTemplateRows: `${currentGridProgress}fr`,
        duration: TWEEN_DURATION,
        ease: 'none',
        overwrite: true
      });

      // ===== LIP ANIMATION with momentum =====
      const targetLipProgress = progress;

      // Add momentum for organic feel
      lipMomentum += (targetLipProgress - currentLipProgress) * 0.12;
      lipMomentum *= 0.88; // Friction
      currentLipProgress += lipMomentum;
      currentLipProgress = Math.max(0, Math.min(1, currentLipProgress));

      // Asymmetric timing: top leads, bottom follows
      const topProgress = Math.min(1, currentLipProgress * 1.06);
      const bottomProgress = Math.min(1, currentLipProgress * 0.97);

      const topEased = easeOutSoft(topProgress);
      const bottomEased = easeOutSoft(bottomProgress);

      if (topLip) {
        gsap.to(topLip, {
          rotateX: -90 * topEased,
          duration: TWEEN_DURATION,
          ease: 'none',
          overwrite: true
        });
      }
      if (bottomLip) {
        gsap.to(bottomLip, {
          rotateX: 90 * bottomEased,
          duration: TWEEN_DURATION,
          ease: 'none',
          overwrite: true
        });
      }

      // ===== LOGO CHOREOGRAPHY with throttled updates =====
      const now = performance.now();
      if (now - lastLogoUpdate > 25) { // ~40fps for logos
        lastLogoUpdate = now;

        logos.forEach((logo, i) => {
          const logoProgress = Math.max(0, Math.min(1, (progress - logoDelays[i]) * 1.4));

          gsap.to(logo, {
            opacity: logoProgress,
            y: (1 - logoProgress) * 15,
            scale: 0.92 + (logoProgress * 0.08),
            duration: 0.18,
            ease: TWEEN_EASE,
            overwrite: true
          });
        });
      }

      // ===== STATE CLASSES =====
      if (progress > 0.02 && progress < 0.98) {
        container.classList.add('is-animating');
        container.classList.remove('is-revealed', 'is-dwelling');
      } else if (progress >= 0.98) {
        container.classList.remove('is-animating');
        container.classList.add('is-revealed');
      } else {
        container.classList.remove('is-animating', 'is-revealed', 'is-dwelling');
      }
    },
    onLeaveBack: () => {
      // Re-fix header when scrolling back up
      headerBlock.classList.add('is-fixed-bottom');
      spacer.classList.add('is-active');

      // Reset momentum state
      currentGridProgress = 0;
      currentLipProgress = 0;
      lipMomentum = 0;

      // Smooth reset animations
      gsap.to(container, { gridTemplateRows: '0fr', duration: 0.25, ease: TWEEN_EASE, overwrite: true });
      if (topLip) gsap.to(topLip, { rotateX: 0, duration: 0.25, ease: TWEEN_EASE, overwrite: true });
      if (bottomLip) gsap.to(bottomLip, { rotateX: 0, duration: 0.25, ease: TWEEN_EASE, overwrite: true });
      if (crack) gsap.to(crack, { scaleX: 0, opacity: 1, duration: 0.2, ease: TWEEN_EASE, overwrite: true });

      // Smooth logo reset with stagger
      logos.forEach((logo, i) => {
        gsap.to(logo, {
          opacity: 0,
          y: 15,
          scale: 0.92,
          duration: 0.2,
          delay: i * 0.02,
          ease: TWEEN_EASE,
          overwrite: true
        });
      });

      container.classList.remove('is-animating', 'is-revealed', 'is-dwelling');
    }
  });

  // ===== DWELL PHASE: Scroll-lock after reveal completes =====
  // Creates a "moment of focus" on the client logos
  // User scrolls through ~350px while clients section stays pinned
  const DWELL_DISTANCE = 350;

  ScrollTrigger.create({
    trigger: container,
    start: 'top 60%',
    end: `+=${DWELL_DISTANCE}`,
    onEnter: () => {
      // Smooth entrance to dwell phase
      container.classList.add('is-dwelling');
      headerBlock.classList.add('is-fixed-bottom');
      spacer.classList.add('is-active');

      // Subtle settle animation
      gsap.fromTo(container, { y: 2 }, { y: 0, duration: 0.3, ease: 'power2.out' });
    },
    onUpdate: (self) => {
      // Gradually prepare for release in final 25% of dwell
      const releaseProgress = Math.max(0, (self.progress - 0.75) / 0.25);
      if (releaseProgress > 0) {
        // Smooth drift with easing
        const easedRelease = easeOutSoft(releaseProgress);
        gsap.to(headerBlock, {
          y: easedRelease * 12,
          opacity: 1 - (easedRelease * 0.12),
          duration: 0.1,
          ease: 'none',
          overwrite: true
        });
      } else {
        gsap.to(headerBlock, { y: 0, opacity: 1, duration: 0.15, ease: TWEEN_EASE, overwrite: true });
      }
    },
    onLeave: () => {
      // Smooth release from dwell
      gsap.to(headerBlock, {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
        onComplete: () => {
          container.classList.remove('is-dwelling');
          headerBlock.classList.remove('is-fixed-bottom');
          spacer.classList.remove('is-active');
        }
      });
    },
    onEnterBack: () => {
      // Smooth re-entry to dwell
      container.classList.add('is-dwelling');
      headerBlock.classList.add('is-fixed-bottom');
      spacer.classList.add('is-active');
      gsap.to(headerBlock, { y: 0, opacity: 1, duration: 0.25, ease: TWEEN_EASE, overwrite: true });
    },
    onLeaveBack: () => {
      // Leaving dwell going back up
      container.classList.remove('is-dwelling');
    }
  });
}

// =====================
// PHRASE ORCHESTRATION
// Multi-word choreography for key phrases
// =====================

/**
 * "Sustained Collective Pretending" - the philosophical core
 * Three words building to a unified moment of realization
 */
function orchestrateSustainedCollectivePretending() {
  const titleEl = document.querySelector('.sf-approach .sf-section__title');
  if (!titleEl || !titleEl.textContent.includes('Sustained')) return;

  // Find the three semantic words within the title
  const sustained = titleEl.querySelector('.sem-stretch');
  const collective = titleEl.querySelector('.sem-gather');
  const pretending = titleEl.querySelector('.sem-shimmer');

  if (!sustained || !collective || !pretending) return;

  // Override individual scroll triggers - we orchestrate as one
  ScrollTrigger.create({
    trigger: titleEl,
    start: 'top 80%',
    onEnter: () => {
      const tl = gsap.timeline();

      // PHASE 1: "Sustained" stretches out, claiming space over time
      tl.fromTo(sustained,
        { scaleX: 0.8, opacity: 0.3 },
        { scaleX: 1, opacity: 1, duration: 1.4, ease: 'power1.out' },
        0
      );

      // PHASE 2: "Collective" gathers in while sustained holds
      tl.fromTo(collective,
        { letterSpacing: '0.3em', opacity: 0.3, scale: 0.95 },
        { letterSpacing: '0', opacity: 1, scale: 1, duration: 0.9, ease: 'power2.inOut' },
        0.6
      );

      // PHASE 3: "Pretending" shimmers into existence (GPU-friendly)
      tl.fromTo(pretending,
        { opacity: 0.3, scale: 0.95, y: 3 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        1.1
      );

      // Purple gradient shimmer sweep
      pretending.style.background = 'linear-gradient(90deg, transparent 0%, rgba(125,84,255,0.2) 50%, transparent 100%)';
      pretending.style.backgroundSize = '200% 100%';
      tl.fromTo(pretending,
        { backgroundPosition: '200% 0' },
        { backgroundPosition: '-200% 0', duration: 1.8, ease: 'power1.inOut' },
        1.1
      );

      // PHASE 4: UNITY MOMENT - All three pulse together
      tl.to([sustained, collective, pretending],
        { scale: 1.03, duration: 0.25, ease: 'power2.out', stagger: 0.04 },
        2.2
      );
      tl.to([sustained, collective, pretending],
        { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)', stagger: 0.04 },
        2.45
      );

      // PHASE 5: Subtle breathing pulse - the phrase lives
      tl.to([sustained, collective, pretending],
        { opacity: 0.92, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: 1 },
        3.0
      );

      // Clear background after shimmer
      tl.call(() => { pretending.style.background = 'none'; }, null, 2.9);
    },
    once: true
  });
}

/**
 * "Art and systems, flowing together" - the Subfracture duality
 * Two opposing forces that merge into unified flow
 */
function orchestrateArtAndSystems() {
  const taglineEl = document.querySelector('.sf-closer__tagline');
  if (!taglineEl || !taglineEl.textContent.includes('Art and systems')) return;

  // Wrap words for individual control
  const html = taglineEl.innerHTML;
  if (!html.includes('phrase-art')) {
    const wrappedHtml = html
      .replace(/\b(Art)\b/g, '<span class="phrase-art" style="display:inline-block">$1</span>')
      .replace(/\b(systems)\b/g, '<span class="phrase-systems" style="display:inline-block">$1</span>')
      .replace(/\b(flowing)\b/g, '<span class="phrase-flowing" style="display:inline-block">$1</span>')
      .replace(/\b(together)\b/g, '<span class="phrase-together" style="display:inline-block">$1</span>');
    taglineEl.innerHTML = wrappedHtml;
  }

  const art = taglineEl.querySelector('.phrase-art');
  const systems = taglineEl.querySelector('.phrase-systems');
  const flowing = taglineEl.querySelector('.phrase-flowing');
  const together = taglineEl.querySelector('.phrase-together');

  if (!art || !systems || !flowing || !together) return;

  ScrollTrigger.create({
    trigger: taglineEl,
    start: 'top 85%',
    onEnter: () => {
      const tl = gsap.timeline();

      // PHASE 1: OPPOSITION - Art and Systems enter from opposite sides
      // Art: organic, loose, flowing from left (GPU-friendly)
      tl.fromTo(art,
        { x: -30, rotation: -2, opacity: 0, scale: 0.97 },
        { x: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out' },
        0
      );

      // Systems: precise, grid-snapped, sliding from right
      tl.fromTo(systems,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        0
      );

      // PHASE 2: TENSION - They maintain their character
      tl.to(art,
        { y: -2, rotation: 1, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: 1 },
        1.0
      );

      tl.to(systems,
        { opacity: 0.85, duration: 0.15, ease: 'steps(1)', repeat: 3, yoyo: true },
        1.2
      );

      // PHASE 3: CONVERGENCE - "flowing together" dissolves the boundary (GPU-friendly)
      tl.fromTo(flowing,
        { opacity: 0, y: 5, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' },
        2.5
      );

      tl.to(flowing,
        { scaleX: 1.05, scaleY: 0.98, duration: 0.4, ease: 'sine.inOut', yoyo: true, repeat: 1 },
        2.8
      );

      tl.fromTo(together,
        { opacity: 0, letterSpacing: '0.2em' },
        { opacity: 1, letterSpacing: '0', duration: 0.7, ease: 'power2.inOut' },
        3.2
      );

      // PHASE 4: UNITY - All words harmonize
      tl.to([art, systems],
        { y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        3.8
      );

      // Final unified pulse
      tl.to([art, systems, flowing, together],
        { scale: 1.02, duration: 0.4, ease: 'sine.inOut', stagger: 0.05 },
        4.2
      );
      tl.to([art, systems, flowing, together],
        { scale: 1, duration: 0.5, ease: 'sine.inOut', stagger: 0.05 },
        4.6
      );
    },
    once: true
  });
}

// =====================
// INITIALIZE ALL
// =====================
ready(() => {
  initClocks();
  initStickyNav();
  initHeroParallax();
  initHeroLightbox();
  initOrbAnimation();
  initLogoMarquee();
  initGSAPAnimations();
  initPremiumAnimations();
  initCursor();
  initFloatingArtwork();

  // Clients banner - lips spreading reveal
  initClientsReveal();

  // Culture Studio section - premium typography choreography
  initCultureStudioDramatics({
    prefersReducedMotion: prefersReducedMotion(),
    debug: false
  });

  // Enhanced GSAP animations
  initScrollTheatre();
  initMicroInteractions();
  initRevealDrama();
  initSemanticText();

  // Phrase orchestration - multi-word choreography
  orchestrateSustainedCollectivePretending();
  // orchestrateArtAndSystems() - now handled by culture-studio-dramatics.js

  // Footer dramatics - the crescendo
  upgradeFooterAnimation();

  // Reading spotlight (press R to toggle)
  initReadingSpotlight();

  // Remove pre-anim class
  document.documentElement.classList.remove('pre-anim');

  // Initialize Vision Controller (press V to toggle panel, 1-4 to switch visions)
  // Artwork layer is now the default - visions are optional enhancements
  initVisionController({
    default: null, // No vision by default - let the artwork shine
    mobileFirst: true
  });

  console.log('Subfracture loaded. Art and systems, flowing together.');
  console.log('Press V to toggle vision panel, 1-4 to switch creative visions.');
  console.log('Press R to toggle reading spotlight (enhances focus while reading).');
});
