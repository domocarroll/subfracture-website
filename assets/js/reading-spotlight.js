/**
 * Reading Spotlight - Scroll-synchronized text highlighting
 *
 * Creates a "reading zone" in the viewport where current reading position
 * is highlighted. Text above and below is gently dimmed, creating natural
 * focus without competing with content.
 *
 * Performance: GPU-accelerated with will-change hints, RAF-debounced updates
 * Accessibility: Respects prefers-reduced-motion, provides disable toggle
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Configuration
const CONFIG = {
  // Reading zone boundaries (percentage from top of viewport)
  zoneStart: 0.30,  // 30% from top
  zoneEnd: 0.60,    // 60% from top

  // Visual states
  dimmedOpacity: 0.4,
  activeOpacity: 1.0,
  dimmedBlur: 0.5,   // px

  // Transition smoothness
  easeDuration: 0.6,
  ease: 'power2.out',

  // Performance
  throttleMs: 16,    // ~60fps

  // Selectors
  targetSelector: '.sf-body p, .sf-lead, .sf-ai-part__desc, .sf-approach__pillar, .sf-fight__manifesto',
  containerClass: 'spotlight-container',
  paragraphClass: 'spotlight-paragraph',

  // Storage key for user preference
  storageKey: 'sf-reading-spotlight-enabled'
};

// State
let isEnabled = true;
let spotlightParagraphs = [];
let isInitialized = false;
let rafId = null;

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Load user preference from localStorage
 */
function loadPreference() {
  try {
    const stored = localStorage.getItem(CONFIG.storageKey);
    return stored === null ? true : stored === 'true';
  } catch (e) {
    return true;
  }
}

/**
 * Save user preference to localStorage
 */
function savePreference(enabled) {
  try {
    localStorage.setItem(CONFIG.storageKey, String(enabled));
  } catch (e) {
    console.warn('Could not save reading spotlight preference');
  }
}

/**
 * Calculate opacity and blur based on distance from reading zone
 * @param {number} paragraphCenter - Paragraph center position (0-1)
 * @returns {object} - { opacity, blur }
 */
function calculateSpotlightState(paragraphCenter) {
  const { zoneStart, zoneEnd, dimmedOpacity, activeOpacity, dimmedBlur } = CONFIG;

  // Inside reading zone - full clarity
  if (paragraphCenter >= zoneStart && paragraphCenter <= zoneEnd) {
    return { opacity: activeOpacity, blur: 0 };
  }

  // Fade zones (smooth transitions at boundaries)
  const fadeDistance = 0.1; // 10% fade zone

  // Above reading zone
  if (paragraphCenter < zoneStart) {
    const distanceFromZone = zoneStart - paragraphCenter;
    const fadeProgress = Math.min(distanceFromZone / fadeDistance, 1);

    return {
      opacity: activeOpacity - (fadeProgress * (activeOpacity - dimmedOpacity)),
      blur: fadeProgress * dimmedBlur
    };
  }

  // Below reading zone
  if (paragraphCenter > zoneEnd) {
    const distanceFromZone = paragraphCenter - zoneEnd;
    const fadeProgress = Math.min(distanceFromZone / fadeDistance, 1);

    return {
      opacity: activeOpacity - (fadeProgress * (activeOpacity - dimmedOpacity)),
      blur: fadeProgress * dimmedBlur
    };
  }

  return { opacity: activeOpacity, blur: 0 };
}

/**
 * Update spotlight effect based on current scroll position
 */
function updateSpotlight() {
  if (!isEnabled || !isInitialized) return;

  const viewportHeight = window.innerHeight;

  spotlightParagraphs.forEach(({ element, tween }) => {
    const rect = element.getBoundingClientRect();
    const paragraphCenter = (rect.top + rect.height / 2) / viewportHeight;

    const { opacity, blur } = calculateSpotlightState(paragraphCenter);

    // Use GSAP for smooth transitions
    if (tween) tween.kill();

    const newTween = gsap.to(element, {
      opacity,
      filter: blur > 0 ? `blur(${blur}px)` : 'blur(0px)',
      duration: CONFIG.easeDuration,
      ease: CONFIG.ease,
      overwrite: true
    });

    // Store tween reference for cleanup
    const index = spotlightParagraphs.findIndex(p => p.element === element);
    if (index !== -1) {
      spotlightParagraphs[index].tween = newTween;
    }
  });
}

/**
 * Throttled scroll handler
 */
let scrollTimeout;
function onScroll() {
  if (rafId) return;

  rafId = requestAnimationFrame(() => {
    updateSpotlight();
    rafId = null;
  });
}

/**
 * Initialize spotlight on target paragraphs
 */
function initSpotlight() {
  if (isInitialized) return;
  if (prefersReducedMotion()) {
    console.log('Reading spotlight disabled: prefers-reduced-motion');
    return;
  }

  // Load user preference
  isEnabled = loadPreference();
  if (!isEnabled) {
    console.log('Reading spotlight disabled by user preference');
    return;
  }

  // Find all target elements
  const elements = document.querySelectorAll(CONFIG.targetSelector);
  if (!elements.length) {
    console.warn('No elements found for reading spotlight');
    return;
  }

  // Prepare elements
  elements.forEach(element => {
    // Skip if already processed
    if (element.classList.contains(CONFIG.paragraphClass)) return;

    // Add class for styling/identification
    element.classList.add(CONFIG.paragraphClass);

    // GPU acceleration hints
    element.style.willChange = 'opacity, filter';
    element.style.transition = 'none'; // GSAP handles transitions

    // Store element reference
    spotlightParagraphs.push({
      element,
      tween: null
    });
  });

  // Initial update
  updateSpotlight();

  // Attach scroll listener
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateSpotlight);

  isInitialized = true;

  console.log(`Reading spotlight initialized: ${spotlightParagraphs.length} paragraphs tracked`);
}

/**
 * Disable spotlight effect
 */
function disableSpotlight() {
  if (!isInitialized) return;

  isEnabled = false;
  savePreference(false);

  // Remove all effects
  spotlightParagraphs.forEach(({ element, tween }) => {
    if (tween) tween.kill();
    gsap.set(element, {
      opacity: 1,
      filter: 'none',
      clearProps: 'willChange'
    });
  });

  // Remove scroll listener
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', updateSpotlight);

  console.log('Reading spotlight disabled');
}

/**
 * Enable spotlight effect
 */
function enableSpotlight() {
  if (!isInitialized) {
    initSpotlight();
    return;
  }

  isEnabled = true;
  savePreference(true);

  // Reattach listeners and update
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateSpotlight);

  // Reinitialize GPU acceleration
  spotlightParagraphs.forEach(({ element }) => {
    element.style.willChange = 'opacity, filter';
  });

  updateSpotlight();

  console.log('Reading spotlight enabled');
}

/**
 * Toggle spotlight on/off
 */
function toggleSpotlight() {
  if (isEnabled) {
    disableSpotlight();
  } else {
    enableSpotlight();
  }
  return isEnabled;
}

/**
 * Create UI toggle button
 */
function createToggleButton() {
  const button = document.createElement('button');
  button.className = 'spotlight-toggle';
  button.setAttribute('aria-label', 'Toggle reading spotlight');
  button.setAttribute('title', 'Toggle reading spotlight (R)');
  button.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="4" fill="currentColor"/>
      <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
    </svg>
  `;

  // Style button
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    zIndex: '1000',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  });

  // Update button state
  function updateButtonState() {
    button.style.opacity = isEnabled ? '1' : '0.5';
    button.setAttribute('aria-pressed', String(isEnabled));
  }
  updateButtonState();

  // Click handler
  button.addEventListener('click', () => {
    toggleSpotlight();
    updateButtonState();
  });

  // Hover effect
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  });

  document.body.appendChild(button);

  return button;
}

/**
 * Keyboard shortcut (R key to toggle)
 */
function initKeyboardShortcut() {
  document.addEventListener('keydown', (e) => {
    // R key (not in input/textarea)
    if (e.key === 'r' || e.key === 'R') {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      e.preventDefault();
      toggleSpotlight();

      // Visual feedback
      const button = document.querySelector('.spotlight-toggle');
      if (button) {
        button.style.opacity = isEnabled ? '1' : '0.5';
        button.setAttribute('aria-pressed', String(isEnabled));
      }
    }
  });
}

/**
 * Public API
 */
export function initReadingSpotlight(options = {}) {
  // Merge custom config
  Object.assign(CONFIG, options);

  // Initialize
  initSpotlight();

  // Create UI toggle
  createToggleButton();

  // Keyboard shortcut
  initKeyboardShortcut();

  // Return control methods
  return {
    enable: enableSpotlight,
    disable: disableSpotlight,
    toggle: toggleSpotlight,
    isEnabled: () => isEnabled,
    update: updateSpotlight
  };
}

export { CONFIG, toggleSpotlight, enableSpotlight, disableSpotlight };
