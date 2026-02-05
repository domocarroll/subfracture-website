/**
 * Culture Studio Dramatics
 * Premium typography choreography for the Culture Studio section
 * Motion that reveals meaning
 *
 * Works with existing HTML structure:
 * - .intro-title ("Culture Studio")
 * - .intro-lede (value proposition)
 * - .sf-section__title ("Where art and systems flow together")
 * - .sf-lead (lead paragraph)
 * - .sf-body (body content)
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Unified Animation State - prevents conflicts between systems
 * Single source of truth for what's currently happening
 */
const AnimationState = {
  // Current interaction mode
  mode: 'idle', // 'idle' | 'hover-culture' | 'hover-studio' | 'hover-space' | 'magnetic'

  // Flags
  initialAnimationComplete: false,
  canInteract: false,

  // Mouse state (unified tracking)
  mouse: { x: 0, y: 0, velocityX: 0, velocityY: 0 },
  scroll: { y: 0, velocity: 0 },

  // Element references (set during init)
  elements: {
    title: null,
    cultureEl: null,
    studioEl: null,
    periodEl: null,
    glow: null,
    introBlock: null
  },

  // Timing
  lastInteraction: Date.now(),
  idleThreshold: 20000,

  // Set mode with conflict resolution
  setMode(newMode) {
    if (this.mode === newMode) return;
    const prevMode = this.mode;
    this.mode = newMode;
    this.lastInteraction = Date.now();
    // console.log(`[AnimationState] ${prevMode} → ${newMode}`);
  }
};

/**
 * Unified RAF loop - single animation frame for all systems
 * Prevents multiple competing loops
 */
let unifiedRAFId = null;
function startUnifiedRAF() {
  const state = AnimationState;
  let lastMouseX = 0, lastMouseY = 0;
  let lastScrollY = window.scrollY;

  function tick() {
    // Update mouse velocity
    state.mouse.velocityX = state.mouse.x - lastMouseX;
    state.mouse.velocityY = state.mouse.y - lastMouseY;
    lastMouseX = state.mouse.x;
    lastMouseY = state.mouse.y;

    // Update scroll velocity
    const currentScrollY = window.scrollY;
    state.scroll.velocity = Math.abs(currentScrollY - lastScrollY);
    state.scroll.y = currentScrollY;
    lastScrollY = currentScrollY;

    // Smooth scroll velocity
    state.scroll.velocitySmoothed = (state.scroll.velocitySmoothed || 0) +
      (state.scroll.velocity - (state.scroll.velocitySmoothed || 0)) * 0.1;

    // Check for idle state
    if (state.canInteract && state.mode === 'idle') {
      const timeSinceInteraction = Date.now() - state.lastInteraction;
      if (timeSinceInteraction > state.idleThreshold) {
        triggerIdleAwakening();
        state.lastInteraction = Date.now(); // Reset to prevent rapid re-triggers
      }
    }

    // Apply magnetic effect only when appropriate
    if (state.canInteract && state.mode === 'idle') {
      applyMagneticEffect();
    }

    // Apply glow parallax
    applyGlowParallax();

    unifiedRAFId = requestAnimationFrame(tick);
  }

  tick();
}

function stopUnifiedRAF() {
  if (unifiedRAFId) {
    cancelAnimationFrame(unifiedRAFId);
    unifiedRAFId = null;
  }
}

/**
 * Apply magnetic effect - called from unified RAF
 * Only runs when in idle mode (not hovering)
 */
function applyMagneticEffect() {
  const { cultureEl, studioEl, title } = AnimationState.elements;
  if (!cultureEl || !studioEl || !title) return;

  const titleRect = title.getBoundingClientRect();
  const centerX = titleRect.left + titleRect.width / 2;
  const centerY = titleRect.top + titleRect.height / 2;

  const mouseX = (AnimationState.mouse.x - centerX) / titleRect.width;
  const mouseY = (AnimationState.mouse.y - centerY) / titleRect.height;

  // Calculate proximity
  const distance = Math.sqrt(
    Math.pow(AnimationState.mouse.x - centerX, 2) +
    Math.pow(AnimationState.mouse.y - centerY, 2)
  );
  const maxDistance = Math.max(titleRect.width, titleRect.height) * 1.5;
  const proximity = Math.max(0, 1 - distance / maxDistance);

  if (proximity < 0.1) return;

  const cultureChars = cultureEl.querySelectorAll('.split-char');
  const studioChars = studioEl.querySelectorAll('.split-char');

  // "Culture" - organic drift toward mouse
  cultureChars.forEach((char, i) => {
    const offset = (i - cultureChars.length / 2) / cultureChars.length;
    gsap.to(char, {
      x: mouseX * 6 * proximity * (1 + offset * 0.3),
      y: mouseY * 3 * proximity,
      rotation: mouseX * 1.5 * proximity * (i % 2 === 0 ? 1 : -1),
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  });

  // "Studio" - mechanical resistance
  studioChars.forEach((char) => {
    gsap.to(char, {
      x: -mouseX * 2 * proximity,
      y: -mouseY * 1 * proximity,
      rotation: 0,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  });
}

/**
 * Apply glow parallax - called from unified RAF
 */
function applyGlowParallax() {
  const { glow, introBlock } = AnimationState.elements;
  if (!glow || !introBlock) return;

  const rect = introBlock.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const targetX = ((AnimationState.mouse.x - centerX) / rect.width) * 20;
  const targetY = ((AnimationState.mouse.y - centerY) / rect.height) * 15;

  // Smooth interpolation
  const currentX = parseFloat(gsap.getProperty(glow, 'x')) || 0;
  const currentY = parseFloat(gsap.getProperty(glow, 'y')) || 0;

  gsap.set(glow, {
    x: currentX + (targetX - currentX) * 0.05,
    y: currentY + (targetY - currentY) * 0.05
  });
}

/**
 * Trigger idle awakening animation
 */
function triggerIdleAwakening() {
  const { cultureEl, periodEl, glow } = AnimationState.elements;
  if (!cultureEl) return;

  // Period bounce
  if (periodEl) {
    gsap.timeline()
      .to(periodEl, { y: -8, scale: 1.2, duration: 0.3, ease: 'power2.out' })
      .to(periodEl, { y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  }

  // Culture pink pulse
  gsap.timeline()
    .to(cultureEl, { color: '#FF2D55', duration: 0.6, ease: 'power2.inOut' })
    .to(cultureEl, { color: 'inherit', duration: 1.2, ease: 'power2.out' });

  // Glow brightens
  if (glow) {
    gsap.timeline()
      .to(glow, { opacity: 0.9, scale: 1.15, duration: 0.8, ease: 'power2.inOut' })
      .to(glow, { opacity: 0.6, scale: 1, duration: 1.5, ease: 'power2.out' });
  }
}

/**
 * Reset characters to rest position
 */
function resetCharactersToRest() {
  const { cultureEl, studioEl } = AnimationState.elements;
  if (!cultureEl || !studioEl) return;

  const allChars = [
    ...cultureEl.querySelectorAll('.split-char'),
    ...studioEl.querySelectorAll('.split-char')
  ];

  gsap.to(allChars, {
    x: 0,
    y: 0,
    rotation: 0,
    duration: 0.6,
    ease: 'elastic.out(1, 0.6)',
    stagger: 0.015,
    overwrite: 'auto'
  });
}

/**
 * Unified Hover System - handles all hover states without conflicts
 */
function initUnifiedHover(cultureEl, studioEl, periodEl) {
  // Culture hover - soft warm pulse (only when not in another mode)
  cultureEl.addEventListener('mouseenter', () => {
    if (!AnimationState.canInteract) return;
    AnimationState.setMode('hover-culture');

    // Kill any conflicting tweens on this element
    gsap.killTweensOf(cultureEl, 'color');

    gsap.to(cultureEl, {
      color: '#FF2D55',
      duration: 0.4,
      ease: 'power2.inOut',
      overwrite: 'auto'
    });

    // Subtle organic lift on characters
    const chars = cultureEl.querySelectorAll('.split-char');
    gsap.to(chars, {
      y: -2,
      duration: 0.3,
      stagger: 0.02,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  });

  cultureEl.addEventListener('mouseleave', () => {
    if (!AnimationState.canInteract) return;
    AnimationState.setMode('idle');

    gsap.to(cultureEl, {
      color: 'inherit',
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    // Characters return to rest
    resetCharactersToRest();
  });

  // Studio hover - precision tighten
  studioEl.addEventListener('mouseenter', () => {
    if (!AnimationState.canInteract) return;
    AnimationState.setMode('hover-studio');

    gsap.to(studioEl, {
      letterSpacing: '-0.02em',
      duration: 0.25,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    const chars = studioEl.querySelectorAll('.split-char');
    gsap.to(chars, {
      y: -1,
      duration: 0.15,
      stagger: 0.015,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  });

  studioEl.addEventListener('mouseleave', () => {
    if (!AnimationState.canInteract) return;
    AnimationState.setMode('idle');

    gsap.to(studioEl, {
      letterSpacing: '0',
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    resetCharactersToRest();
  });

  // Period hover - playful bounce
  if (periodEl) {
    periodEl.addEventListener('mouseenter', () => {
      if (!AnimationState.canInteract) return;

      gsap.to(periodEl, {
        scale: 1.3,
        y: -3,
        duration: 0.2,
        ease: 'back.out(3)',
        overwrite: 'auto'
      });
    });

    periodEl.addEventListener('mouseleave', () => {
      if (!AnimationState.canInteract) return;

      gsap.to(periodEl, {
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto'
      });
    });
  }
}

/**
 * Space Between - unified version with proper state handling
 */
function initSpaceBetweenUnified(title, cultureEl, studioEl) {
  const spacer = document.createElement('span');
  spacer.className = 'cs-space-between';
  spacer.setAttribute('aria-hidden', 'true');
  spacer.innerHTML = '&nbsp;';
  studioEl.parentNode.insertBefore(spacer, studioEl);

  spacer.addEventListener('mouseenter', () => {
    if (!AnimationState.canInteract) return;
    AnimationState.setMode('hover-space');

    // Culture leans right
    gsap.to(cultureEl, {
      x: 8,
      rotateZ: 2,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    // Studio leans left
    gsap.to(studioEl, {
      x: -8,
      rotateZ: -2,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    // Glow intensifies
    const { glow } = AnimationState.elements;
    if (glow) {
      gsap.to(glow, {
        opacity: 0.85,
        scale: 1.1,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  });

  spacer.addEventListener('mouseleave', () => {
    if (!AnimationState.canInteract) return;
    AnimationState.setMode('idle');

    gsap.to([cultureEl, studioEl], {
      x: 0,
      rotateZ: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto'
    });

    const { glow } = AnimationState.elements;
    if (glow) {
      gsap.to(glow, {
        opacity: 0.6,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  });
}

/**
 * Depth Parallax Unified - uses scroll velocity from AnimationState
 */
function initDepthParallaxUnified(cultureEl, studioEl, introBlock) {
  if (!introBlock) return;

  ScrollTrigger.create({
    trigger: introBlock,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;
      // Use velocity from unified state
      const velocityMultiplier = 1 + Math.min((AnimationState.scroll.velocitySmoothed || 0) / 50, 2);

      gsap.set(cultureEl, {
        z: progress * 30 * velocityMultiplier,
        rotateY: progress * -3 * velocityMultiplier,
        transformPerspective: 1000
      });

      gsap.set(studioEl, {
        z: progress * -20 * velocityMultiplier,
        rotateY: progress * 2 * velocityMultiplier,
        transformPerspective: 1000
      });
    }
  });
}

/**
 * Manual text split utility - no SplitText dependency
 * Splits text into words or characters with proper wrapper elements
 */
function splitText(element, type = 'words') {
  const text = element.textContent;
  element.setAttribute('aria-label', text);

  if (type === 'chars') {
    const words = text.split(/\s+/);
    element.innerHTML = words.map(word => {
      const chars = word.split('').map(char =>
        `<span class="split-char">${char}</span>`
      ).join('');
      return `<span class="split-word">${chars}</span>`;
    }).join(' ');
    return Array.from(element.querySelectorAll('.split-char'));
  }

  if (type === 'words') {
    const words = text.split(/\s+/);
    element.innerHTML = words.map(word =>
      `<span class="split-word">${word}</span>`
    ).join(' ');
    return Array.from(element.querySelectorAll('.split-word'));
  }

  return [];
}

/**
 * Wrap specific phrases in elements for targeted animation
 */
function wrapPhrases(element, phraseMap) {
  let html = element.innerHTML;

  Object.entries(phraseMap).forEach(([phrase, className]) => {
    const regex = new RegExp(`\\b(${phrase})\\b`, 'gi');
    html = html.replace(regex, `<span class="${className}">$1</span>`);
  });

  element.innerHTML = html;
}

/**
 * Initialize all Culture Studio animations
 */
export function initCultureStudioDramatics(options = {}) {
  const {
    prefersReducedMotion = false,
    debug = true // Force debug on for troubleshooting
  } = options;

  console.log('[CultureStudio] Starting initialization...');

  if (prefersReducedMotion) {
    console.log('[CultureStudio] Reduced motion - using simple fades');
    initReducedMotion();
    return;
  }

  try {
    // Run immediately, not in RAF (RAF might be too late)
    console.log('[CultureStudio] Animating title...');
    animateCultureStudioTitle();

    console.log('[CultureStudio] Animating lede...');
    animateIntroLede();

    console.log('[CultureStudio] Animating philosophy title...');
    animatePhilosophyTitle();

    console.log('[CultureStudio] Animating lead statement...');
    animateLeadStatement();

    console.log('[CultureStudio] Animating body copy...');
    animateBodyCopy();

    // Refresh after all elements are processed
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    console.log('[CultureStudio] All animations initialized successfully');
  } catch (error) {
    console.error('[CultureStudio] ERROR:', error);
    // FALLBACK: If anything fails, just show the content
    showContentFallback();
  }
}

/**
 * Emergency fallback - just show the content without animation
 */
function showContentFallback() {
  console.log('[CultureStudio] Running fallback - showing content without animation');
  const elements = document.querySelectorAll('.intro-title, .intro-lede, .sf-what-we-do .sf-section__title, .sf-what-we-do .sf-lead, .sf-what-we-do .sf-body');
  elements.forEach(el => {
    el.style.opacity = '1';
    el.style.visibility = 'visible';
    el.style.transform = 'none';
  });
}

/**
 * "Culture Studio" Title - Dual Personality Emergence
 * "Culture" = organic, elastic, human warmth
 * "Studio" = precise, systematic, crafted intention
 *
 * NOTE: This is above the fold - plays immediately, no ScrollTrigger
 */
function animateCultureStudioTitle() {
  const title = document.querySelector('.intro-title');
  if (!title) return;

  // CRITICAL: Override CSS that hides this element (main.css sets opacity:0)
  title.style.opacity = '1';

  // Preserve original for accessibility
  const originalText = title.textContent.trim();

  // Split into words, separating the period for dramatic emphasis
  const words = originalText.split(/\s+/);
  const culture = words[0];
  // Separate "Studio." into "Studio" and "."
  const studioWithPeriod = words[1] || '';
  const studio = studioWithPeriod.replace('.', '');
  const hasPeriod = studioWithPeriod.includes('.');

  title.innerHTML = `
    <span class="cs-word cs-culture" aria-hidden="true">${culture}</span>
    <span class="cs-word cs-studio" aria-hidden="true">${studio}</span>${hasPeriod ? '<span class="cs-period" aria-hidden="true">.</span>' : ''}
  `;
  title.setAttribute('aria-label', originalText);

  // Split each word into characters
  const cultureEl = title.querySelector('.cs-culture');
  const studioEl = title.querySelector('.cs-studio');
  const periodEl = title.querySelector('.cs-period');

  const cultureChars = splitText(cultureEl, 'chars');
  const studioChars = splitText(studioEl, 'chars');

  // Set initial states
  gsap.set(cultureChars, {
    opacity: 0,
    y: 80,
    rotationX: -60,
    rotationZ: (i) => gsap.utils.random(-12, 12),
    transformOrigin: '50% 100%',
    force3D: true
  });

  gsap.set(studioChars, {
    opacity: 0,
    y: 50,
    rotationX: -30,
    transformOrigin: '50% 100%',
    force3D: true
  });

  // Period starts high and invisible - will drop with weight
  if (periodEl) {
    gsap.set(periodEl, {
      opacity: 0,
      y: -30,
      scale: 1.5,
      transformOrigin: '50% 100%'
    });
  }

  // Get animation config based on first visit vs return
  const config = getAnimationConfig();

  // Above the fold - play immediately with slight delay for page settle
  const tl = gsap.timeline({
    delay: config.titleDelay,
    onStart: () => title.classList.add('cs-title-active')
  });

  // "Culture" - organic, elastic arrival with warm undertone
  // First visit = full theatrical, return = softer welcome
  tl.to(cultureChars, {
    opacity: 1,
    y: 0,
    rotationX: 0,
    rotationZ: 0,
    duration: config.firstVisit ? 1.4 : 0.8,
    stagger: {
      each: config.cultureStagger,
      from: 'start',
      ease: 'power1.out'
    },
    ease: config.firstVisit ? 'elastic.out(1, 0.5)' : 'power3.out'
  }, 0);

  // Add warm undertone to "Culture" after it lands
  tl.to(cultureEl, {
    color: '#FF2D55', // Subfracture hot pink
    duration: config.colorPulseDuration,
    ease: 'power2.inOut'
  }, config.firstVisit ? 0.8 : 0.4)
  .to(cultureEl, {
    color: 'inherit',
    duration: config.firstVisit ? 1.2 : 0.6,
    ease: 'power2.out'
  }, '+=0.3');

  // "Studio" - precise, synchronized arrival (stays cool/neutral)
  tl.to(studioChars, {
    opacity: 1,
    y: 0,
    rotationX: 0,
    duration: config.studioDuration,
    stagger: {
      each: config.firstVisit ? 0.04 : 0.02,
      from: 'start',
      ease: 'power3.out'
    },
    ease: 'power3.out'
  }, config.firstVisit ? 0.25 : 0.1);

  // THE PERIOD - drops with weight, lands with attitude
  if (periodEl) {
    tl.to(periodEl, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power3.in' // Accelerates down like gravity
    }, '-=0.3')
    .to(periodEl, {
      y: 2, // Slight squash on landing
      scaleY: 0.8,
      duration: 0.1,
      ease: 'power2.in'
    })
    .to(periodEl, {
      y: 0,
      scaleY: 1,
      duration: 0.2,
      ease: 'elastic.out(1, 0.5)'
    });
  }

  // Subtle settle - everything breathes together
  tl.to([...cultureChars, ...studioChars], {
    y: -3,
    duration: 0.2,
    stagger: 0.01,
    ease: 'power2.out'
  }, '-=0.2')
  .to([...cultureChars, ...studioChars], {
    y: 0,
    duration: 0.25,
    stagger: 0.01,
    ease: 'power2.inOut'
  });

  // Activate the glow element for atmosphere
  const glow = document.querySelector('.intro-glow');
  const introBlock = title.closest('.intro-block');

  if (glow) {
    gsap.set(glow, { opacity: 0, scale: 0.8 });
    tl.to(glow, {
      opacity: 0.6,
      scale: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, 0.5);

    // Glow synesthesia - reacts to animation states (timed, one-shot)
    initGlowSynesthesia(glow, cultureEl);

    // Breathing rhythm - 4 second human breath cycle
    initGlowBreathing(glow);
  }

  // Store element references in unified state
  AnimationState.elements = {
    title,
    cultureEl,
    studioEl,
    periodEl,
    glow,
    introBlock
  };

  // Set up unified mouse tracking (single listener)
  document.addEventListener('mousemove', (e) => {
    AnimationState.mouse.x = e.clientX;
    AnimationState.mouse.y = e.clientY;
    AnimationState.lastInteraction = Date.now();
  }, { passive: true });

  // Set up unified interaction event tracking
  ['scroll', 'keydown', 'touchstart'].forEach(event => {
    document.addEventListener(event, () => {
      AnimationState.lastInteraction = Date.now();
    }, { passive: true });
  });

  // Scroll continuation - title scales down as you scroll away
  initScrollContinuation(title);

  // Depth parallax with velocity awareness (unified scroll tracking)
  initDepthParallaxUnified(cultureEl, studioEl, introBlock);

  // The space between - meeting point interaction
  initSpaceBetweenUnified(title, cultureEl, studioEl);

  // Unified hover system - no conflicts
  initUnifiedHover(cultureEl, studioEl, periodEl);

  // Glow as connective tissue - morphs to next section
  initGlowConnectiveTissue(glow, introBlock);

  // Mark initial animation complete and enable interactions
  tl.call(() => {
    AnimationState.initialAnimationComplete = true;
  });

  // Enable interactions after a delay
  setTimeout(() => {
    AnimationState.canInteract = true;
    AnimationState.lastInteraction = Date.now();
    startUnifiedRAF();
  }, config.firstVisit ? 4000 : 2000);
}

/**
 * Title scales down slightly as user scrolls away
 */
function initScrollContinuation(title) {
  const introBlock = title.closest('.intro-block');
  if (!introBlock) return;

  ScrollTrigger.create({
    trigger: introBlock,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;
      // Scale from 1 to 0.85 as you scroll away
      const scale = 1 - (progress * 0.15);
      // Fade slightly
      const opacity = 1 - (progress * 0.3);

      gsap.set(title, {
        scale,
        opacity,
        transformOrigin: 'center top'
      });
    }
  });
}

/**
 * "Where art and systems flow together" - Philosophical Convergence
 * Opposites that find harmony through motion
 */
function animatePhilosophyTitle() {
  const section = document.querySelector('.sf-what-we-do');
  const title = section?.querySelector('.sf-section__title');
  if (!title) return;

  const originalText = title.textContent;

  // Wrap key philosophical terms
  wrapPhrases(title, {
    'art': 'cs-art',
    'systems': 'cs-systems',
    'flow together': 'cs-flow'
  });

  // Wrap remaining text for reveal
  const textNodes = Array.from(title.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
  textNodes.forEach(node => {
    if (node.textContent.trim()) {
      const span = document.createElement('span');
      span.className = 'cs-connector';
      span.textContent = node.textContent;
      node.replaceWith(span);
    }
  });

  const art = title.querySelector('.cs-art');
  const systems = title.querySelector('.cs-systems');
  const flow = title.querySelector('.cs-flow');
  const connectors = title.querySelectorAll('.cs-connector');

  // Initial states - opposites apart
  gsap.set(art, { x: -60, opacity: 0, rotationZ: -8 });
  gsap.set(systems, { x: 60, opacity: 0, rotationZ: 8 });
  gsap.set(flow, { y: 30, opacity: 0, scale: 0.95 });
  gsap.set(connectors, { opacity: 0, y: 15 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: title,
      start: 'top 75%',
      once: true
    }
  });

  // Connectors fade in first - setting the stage
  tl.to(connectors, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  }, 0);

  // "art" enters from left - organic, creative side
  tl.to(art, {
    x: 0,
    opacity: 1,
    rotationZ: 0,
    duration: 1,
    ease: 'power2.out'
  }, 0.1);

  // "systems" enters from right - structured, logical side
  tl.to(systems, {
    x: 0,
    opacity: 1,
    rotationZ: 0,
    duration: 1,
    ease: 'power2.out'
  }, 0.15);

  // "flow together" - emerges as they converge
  tl.to(flow, {
    y: 0,
    opacity: 1,
    scale: 1,
    duration: 1.2,
    ease: 'power2.out'
  }, 0.4);

  // Subtle liquid motion on "flow together"
  tl.to(flow, {
    y: -5,
    duration: 0.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: 1
  }, '-=0.5');
}

/**
 * Intro Lede - Semantic chunk reveal
 * Meaning groups appear sequentially with emphasis on key moments
 *
 * Chunks:
 * 1. "For brands and IP" — the audience
 * 2. "that deserve more than campaigns," — the qualifier
 * 3. "we co-design movements" — the action
 * 4. "that generate acceptance and love." — the payoff
 */
function animateIntroLede() {
  const lede = document.querySelector('.intro-lede');
  if (!lede) return;

  // CRITICAL: Override CSS that hides this element (main.css sets opacity:0)
  lede.style.opacity = '1';

  // Define semantic chunks with their timing character
  const chunks = [
    { text: 'For brands and IP', class: 'cs-chunk cs-chunk--audience', delay: 0 },
    { text: 'that deserve more than campaigns,', class: 'cs-chunk cs-chunk--qualifier', delay: 0.15 },
    { text: 'we co-design movements', class: 'cs-chunk cs-chunk--action', delay: 0.15 },
    { text: 'that generate acceptance and love.', class: 'cs-chunk cs-chunk--payoff', delay: 0.2 }
  ];

  // Emphasis replacements within chunks
  const emphasisMap = {
    'more': '<strong class="cs-emphasis-more">more</strong>'
  };

  // Rebuild the lede with wrapped chunks
  let html = lede.textContent;
  chunks.forEach(chunk => {
    // Apply emphasis within chunk text
    let chunkContent = chunk.text;
    Object.entries(emphasisMap).forEach(([word, replacement]) => {
      chunkContent = chunkContent.replace(new RegExp(`\\b${word}\\b`, 'g'), replacement);
    });
    html = html.replace(chunk.text, `<span class="${chunk.class}">${chunkContent}</span>`);
  });
  lede.innerHTML = html;

  // Get chunk elements
  const chunkEls = lede.querySelectorAll('.cs-chunk');

  // Initial state - chunks hidden and slightly below
  // Using scale instead of blur for GPU-friendly performance
  gsap.set(chunkEls, {
    opacity: 0,
    y: 15,
    scale: 0.97,
    transformOrigin: 'left center'
  });

  // Get animation config for first visit vs return
  const config = getAnimationConfig();

  // Timeline starts after title animation begins
  const tl = gsap.timeline({ delay: config.ledeDelay });

  // Reveal each chunk with its own character
  chunkEls.forEach((chunk, i) => {
    const isPayoff = chunk.classList.contains('cs-chunk--payoff');
    const isAction = chunk.classList.contains('cs-chunk--action');

    tl.to(chunk, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: isPayoff ? (config.chunkDuration * 1.5) : config.chunkDuration,
      ease: isPayoff ? 'power2.out' : 'power3.out'
    }, i === 0 ? 0 : `>-0.25`); // Overlap slightly for flow
  });

  // Emphasis on "movements" - subtle motion
  const actionChunk = lede.querySelector('.cs-chunk--action');
  if (actionChunk) {
    // Find and emphasize "movements" within the chunk
    actionChunk.innerHTML = actionChunk.innerHTML.replace(
      'movements',
      '<span class="cs-movements">movements</span>'
    );
    const movements = actionChunk.querySelector('.cs-movements');
    if (movements) {
      tl.to(movements, {
        x: 3,
        duration: 0.5,
        ease: 'sine.inOut',
        repeat: 2,
        yoyo: true
      }, '-=0.8');
    }
  }

  // Emphasis on "acceptance and love" - warm moment
  const payoffChunk = lede.querySelector('.cs-chunk--payoff');
  if (payoffChunk) {
    payoffChunk.innerHTML = payoffChunk.innerHTML.replace(
      'acceptance and love',
      '<span class="cs-love">acceptance and love</span>'
    );
    const love = payoffChunk.querySelector('.cs-love');
    if (love) {
      tl.to(love, {
        color: '#FF2D55', // Subfracture hot pink
        duration: 0.6,
        ease: 'power2.inOut'
      }, '-=0.4')
      .to(love, {
        color: 'inherit',
        duration: 1.5,
        ease: 'power1.out'
      });
    }
  }
}

/**
 * Lead Statement - Declaration with payload emphasis
 * "We design solutions to make people want change"
 */
function animateLeadStatement() {
  const section = document.querySelector('.sf-what-we-do');
  const lead = section?.querySelector('.sf-lead');
  if (!lead || lead.dataset.csDramatics) return;

  lead.dataset.csDramatics = 'true';

  // Wrap the payload
  wrapPhrases(lead, {
    'want change': 'cs-payload',
    'make people': 'cs-emphasis'
  });

  const payload = lead.querySelector('.cs-payload');
  const words = splitText(lead, 'words');

  gsap.set(words, { opacity: 0, y: 20 });
  if (payload) gsap.set(payload, { scale: 0.9 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: lead,
      start: 'top 75%',
      once: true
    }
  });

  // Words build momentum
  tl.to(words, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: {
      each: 0.045,
      ease: 'power2.in'
    },
    ease: 'power2.out'
  });

  // Payload punches - scale emphasis
  if (payload) {
    tl.to(payload, {
      scale: 1,
      duration: 0.6,
      ease: 'back.out(2.5)'
    }, '-=0.2');
  }
}

/**
 * Body Copy - Semantic micro-moments
 * Key phrases get special treatment
 */
function animateBodyCopy() {
  const section = document.querySelector('.sf-what-we-do');
  const body = section?.querySelector('.sf-body');
  if (!body || body.dataset.csDramatics) return;

  body.dataset.csDramatics = 'true';

  // Wrap key phrases
  wrapPhrases(body, {
    'entire brand worlds': 'cs-worlds',
    'shifting perception': 'cs-shifting',
    'Generating acceptance': 'cs-generating',
    'love that lasts': 'cs-lasting',
    'feel inevitable': 'cs-inevitable',
    'flowing together': 'cs-flowing'
  });

  const worlds = body.querySelector('.cs-worlds');
  const inevitable = body.querySelector('.cs-inevitable');
  const paragraphs = body.querySelectorAll('p');

  // Stagger paragraphs
  gsap.set(paragraphs, { opacity: 0, y: 30 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: body,
      start: 'top 70%',
      once: true
    }
  });

  tl.to(paragraphs, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // "entire brand worlds" - depth/parallax moment
  if (worlds) {
    tl.from(worlds, {
      scale: 0.96,
      z: -30,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.6');
  }

  // "feel inevitable" - gravity settle
  if (inevitable) {
    tl.from(inevitable, {
      y: -15,
      opacity: 0.3,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4')
    .to(inevitable, {
      y: 2,
      duration: 0.15,
      ease: 'power2.in'
    })
    .to(inevitable, {
      y: 0,
      duration: 0.25,
      ease: 'bounce.out'
    });
  }
}

/**
 * Reduced motion fallback
 */
function initReducedMotion() {
  const elements = document.querySelectorAll(`
    .intro-title,
    .intro-lede,
    .sf-what-we-do .sf-section__title,
    .sf-what-we-do .sf-lead,
    .sf-what-we-do .sf-body
  `);

  elements.forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      },
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
}

/**
 * Glow Synesthesia - Glow responds to animation states
 * Brightens and shifts warmer during hot pink pulse
 */
function initGlowSynesthesia(glow, cultureEl) {
  // Watch for color changes on Culture element
  // When hot pink pulse happens, glow reacts

  // Create a warmer glow state
  const warmGlow = {
    background: `radial-gradient(
      ellipse at center,
      rgba(255, 45, 85, 0.25) 0%,
      rgba(255, 120, 100, 0.15) 40%,
      transparent 70%
    )`,
    scale: 1.15,
    opacity: 0.8
  };

  const coolGlow = {
    background: `radial-gradient(
      ellipse at center,
      rgba(125, 84, 255, 0.15) 0%,
      rgba(232, 93, 117, 0.08) 40%,
      transparent 70%
    )`,
    scale: 1,
    opacity: 0.6
  };

  // Sync with the Culture color animation (happens at ~0.8s + 0.3s delay)
  setTimeout(() => {
    // Warm pulse
    gsap.to(glow, {
      ...warmGlow,
      duration: 0.8,
      ease: 'power2.inOut'
    });

    // Return to cool
    setTimeout(() => {
      gsap.to(glow, {
        ...coolGlow,
        duration: 1.2,
        ease: 'power2.out'
      });
    }, 1100);
  }, 1100); // Synced with Culture color animation timing
}

/**
 * Breathing Rhythm - Glow breathes at human pace
 * 4 second cycle matches resting breath
 */
function initGlowBreathing(glow) {
  // Wait for initial animations to settle
  setTimeout(() => {
    gsap.to(glow, {
      scale: 1.08,
      opacity: 0.7,
      duration: 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }, 5000);
}

/**
 * First Visit vs Return - theatrical vs soft entrance
 * Uses localStorage to remember visitors
 */
function isFirstVisit() {
  const KEY = 'sf_culture_studio_visited';
  const hasVisited = localStorage.getItem(KEY);

  if (!hasVisited) {
    localStorage.setItem(KEY, Date.now().toString());
    return true;
  }

  return false;
}

/**
 * Get animation config based on visit status
 * First visit = full theatrical, Return = softer welcome back
 */
function getAnimationConfig() {
  const firstVisit = isFirstVisit();

  return {
    firstVisit,
    // Title animation
    titleDelay: firstVisit ? 0.3 : 0.1,
    cultureStagger: firstVisit ? 0.06 : 0.03,
    studioDuration: firstVisit ? 1 : 0.6,
    // Color pulse
    colorPulseDuration: firstVisit ? 0.8 : 0.4,
    // Lede
    ledeDelay: firstVisit ? 1.0 : 0.4,
    chunkDuration: firstVisit ? 0.6 : 0.4
  };
}

/**
 * Glow as Connective Tissue - morphs to next section
 * Creates visual continuity as user scrolls
 */
function initGlowConnectiveTissue(glow, introBlock) {
  if (!glow || !introBlock) return;

  const nextSection = introBlock.nextElementSibling;
  if (!nextSection) return;

  // Create a secondary glow element that will appear in the next section
  const glowThread = document.createElement('div');
  glowThread.className = 'cs-glow-thread';
  glowThread.setAttribute('aria-hidden', 'true');
  nextSection.style.position = 'relative';
  nextSection.insertBefore(glowThread, nextSection.firstChild);

  ScrollTrigger.create({
    trigger: introBlock,
    start: 'bottom 80%',
    end: 'bottom 20%',
    scrub: 0.8,
    onUpdate: (self) => {
      const progress = self.progress;

      // Original glow fades and drifts down
      gsap.set(glow, {
        opacity: 0.6 * (1 - progress * 0.5),
        y: progress * 100,
        scale: 1 - progress * 0.3
      });

      // Thread glow emerges in next section
      gsap.set(glowThread, {
        opacity: progress * 0.4,
        y: -50 + progress * 50,
        scale: 0.5 + progress * 0.5
      });
    }
  });

  // When fully transitioned, thread becomes the new ambient element
  ScrollTrigger.create({
    trigger: nextSection,
    start: 'top 60%',
    onEnter: () => {
      gsap.to(glowThread, {
        opacity: 0.3,
        duration: 1,
        ease: 'power2.out'
      });
    },
    onLeaveBack: () => {
      gsap.to(glowThread, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      });
    }
  });
}

/**
 * Cleanup for HMR
 */
export function cleanupCultureStudioDramatics() {
  ScrollTrigger.getAll()
    .filter(st => st.vars?.trigger?.closest?.('.intro-block, .sf-what-we-do'))
    .forEach(st => st.kill());
}
