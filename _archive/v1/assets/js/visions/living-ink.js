/**
 * AVENUE A: THE LIVING INK
 *
 * Vision module where drawings breathe with AI-generated subtle motion
 * and strategic diagrams draw themselves into existence.
 *
 * Features:
 * - Breathing video system with graceful fallback to static images
 * - Self-drawing SVG diagrams using GSAP stroke animation
 * - Scroll-triggered reveals
 * - Mobile-optimized performance
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// =====================
// STATE
// =====================
let state = {
  initialized: false,
  videos: [],
  animations: [],
  scrollTriggers: [],
  isMobile: false,
  prefersReducedMotion: false
};

// =====================
// BREATHING VIDEO SYSTEM
// =====================

/**
 * Creates a breathing video element with fallback to static image
 * @param {HTMLElement} container - Container element with data attributes
 */
function createBreathingVideo(container) {
  const videoSrc = container.dataset.videoSrc;
  const fallbackSrc = container.dataset.fallbackSrc;
  const alt = container.dataset.alt || 'Living ink drawing';

  // If no video source yet, show static image
  if (!videoSrc) {
    const img = document.createElement('img');
    img.src = fallbackSrc;
    img.alt = alt;
    img.className = 'living-ink__image';
    container.appendChild(img);
    return null;
  }

  // Create video element
  const video = document.createElement('video');
  video.className = 'living-ink__video';
  video.setAttribute('playsinline', '');
  video.setAttribute('loop', '');
  video.setAttribute('muted', '');
  video.setAttribute('autoplay', '');
  video.setAttribute('aria-label', alt);

  const source = document.createElement('source');
  source.src = videoSrc;
  source.type = 'video/mp4';
  video.appendChild(source);

  // Fallback image
  const fallbackImg = document.createElement('img');
  fallbackImg.src = fallbackSrc;
  fallbackImg.alt = alt;
  fallbackImg.className = 'living-ink__fallback';
  video.appendChild(fallbackImg);

  container.appendChild(video);

  // Handle video load errors gracefully
  video.addEventListener('error', () => {
    console.warn('Video failed to load, showing fallback image');
    video.style.display = 'none';
    const img = container.querySelector('.living-ink__fallback');
    if (img) img.style.display = 'block';
  });

  // Lazy play when in viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Silent fail - fallback image is shown
          });
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(container);

  return {
    video,
    observer,
    destroy: () => {
      observer.disconnect();
      video.pause();
      video.remove();
    }
  };
}

/**
 * Initialize all breathing video containers
 */
function initBreathingVideos() {
  const containers = document.querySelectorAll('.living-ink__breathing');

  containers.forEach((container) => {
    const videoInstance = createBreathingVideo(container);
    if (videoInstance) {
      state.videos.push(videoInstance);
    }
  });
}

// =====================
// SELF-DRAWING SVG DIAGRAMS
// =====================

/**
 * Creates SVG path data for strategic diagrams
 */
const SVG_PATHS = {
  // Bagua/I-Ching octagon - sacred geometry
  bagua: `
    M 150 40
    L 210 75
    L 210 135
    L 150 170
    L 90 135
    L 90 75
    Z
    M 150 105 m -50 0 a 50 50 0 1 0 100 0 a 50 50 0 1 0 -100 0
    M 150 55 L 150 105
    M 195 75 L 150 105
    M 195 135 L 150 105
    M 150 155 L 150 105
    M 105 135 L 150 105
    M 105 75 L 150 105
  `,

  // Joy spiral - upward expansion
  joySpiral: `
    M 150 150
    Q 150 140, 155 140
    Q 160 140, 160 145
    Q 160 155, 150 155
    Q 135 155, 135 140
    Q 135 120, 155 120
    Q 180 120, 180 145
    Q 180 175, 150 175
    Q 115 175, 115 140
    Q 115 100, 155 100
    Q 200 100, 200 145
    Q 200 195, 150 195
    Q 95 195, 95 140
    Q 95 80, 155 80
    Q 220 80, 220 145
    Q 220 215, 150 215
  `,

  // Fear spiral - downward contraction
  fearSpiral: `
    M 150 80
    Q 150 90, 145 90
    Q 140 90, 140 85
    Q 140 75, 150 75
    Q 165 75, 165 90
    Q 165 110, 145 110
    Q 120 110, 120 85
    Q 120 55, 150 55
    Q 185 55, 185 85
    Q 185 125, 145 125
    Q 105 125, 105 85
    Q 105 35, 150 35
    Q 200 35, 200 85
    Q 200 145, 145 145
  `,

  // Infinity loop - continuous flow
  infinity: `
    M 100 105
    Q 75 80, 100 55
    Q 125 30, 150 55
    Q 175 80, 150 105
    Q 125 130, 100 105
    M 150 105
    Q 175 80, 200 55
    Q 225 30, 250 55
    Q 275 80, 250 105
    Q 225 130, 200 155
    Q 175 130, 150 105
  `,

  // Triangle trinity - stability
  trinity: `
    M 150 50
    L 250 200
    L 50 200
    Z
    M 150 50 L 150 180
    M 100 175 L 200 175
    M 125 137.5 L 175 137.5
  `
};

/**
 * Creates an SVG diagram element with drawing animation
 * @param {string} type - Type of diagram (bagua, joySpiral, fearSpiral, etc)
 * @param {object} options - Configuration options
 */
function createSVGDiagram(type, options = {}) {
  const {
    width = 300,
    height = 230,
    strokeColor = '#000',
    strokeWidth = 2,
    duration = 3,
    ease = 'power2.inOut',
    stagger = 0.1
  } = options;

  // Create SVG container
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 300 230');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('living-ink__svg', `living-ink__svg--${type}`);

  // Create path
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', SVG_PATHS[type]);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', strokeColor);
  path.setAttribute('stroke-width', strokeWidth);
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.classList.add('living-ink__path');

  svg.appendChild(path);

  // Calculate path length for animation
  const length = path.getTotalLength();

  // Set up stroke dash for animation
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  return { svg, path, length, duration, ease };
}

/**
 * Animate SVG path drawing
 * @param {object} diagram - Diagram object from createSVGDiagram
 * @param {object} scrollTriggerOptions - ScrollTrigger configuration
 */
function animateSVGDrawing(diagram, scrollTriggerOptions = {}) {
  const { path, length, duration, ease } = diagram;

  // Create drawing animation
  const animation = gsap.to(path, {
    strokeDashoffset: 0,
    duration: state.isMobile ? duration * 0.7 : duration,
    ease: ease,
    scrollTrigger: {
      trigger: diagram.svg,
      start: 'top 85%',
      toggleActions: 'play none none none',
      ...scrollTriggerOptions
    }
  });

  return animation;
}

/**
 * Initialize all SVG diagram containers
 */
function initSVGDiagrams() {
  const containers = document.querySelectorAll('.living-ink__diagram');

  containers.forEach((container) => {
    const type = container.dataset.diagramType;
    const strokeColor = container.dataset.strokeColor || getComputedStyle(container).color || '#000';
    const strokeWidth = container.dataset.strokeWidth || 2;
    const duration = parseFloat(container.dataset.duration) || 3;

    if (!type || !SVG_PATHS[type]) {
      console.warn(`Unknown diagram type: ${type}`);
      return;
    }

    // Create diagram
    const diagram = createSVGDiagram(type, {
      strokeColor,
      strokeWidth,
      duration,
      ease: 'power2.inOut'
    });

    // Add to container
    container.appendChild(diagram.svg);

    // Animate when scrolled into view
    const animation = animateSVGDrawing(diagram, {
      onComplete: () => {
        // Optional: Add subtle breathing pulse after drawing completes
        if (!state.prefersReducedMotion && !state.isMobile) {
          gsap.to(diagram.path, {
            opacity: 0.7,
            duration: 2,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1
          });
        }
      }
    });

    state.animations.push(animation);
  });
}

// =====================
// SCROLL REVEALS
// =====================

/**
 * Initialize scroll-triggered reveals for living ink elements
 */
function initScrollReveals() {
  if (state.prefersReducedMotion) return;

  // Reveal breathing videos
  const breathingContainers = document.querySelectorAll('.living-ink__breathing');
  breathingContainers.forEach((container, i) => {
    gsap.fromTo(
      container,
      {
        opacity: 0,
        y: 40,
        scale: 0.98
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Reveal diagram containers
  const diagramContainers = document.querySelectorAll('.living-ink__diagram-wrapper');
  diagramContainers.forEach((container, i) => {
    gsap.fromTo(
      container,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

// =====================
// UTILITY FUNCTIONS
// =====================

/**
 * Detect mobile device
 */
function detectMobile() {
  return window.innerWidth < 768 ||
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check for reduced motion preference
 */
function checkReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
}

// =====================
// PUBLIC API
// =====================

/**
 * Initialize the Living Ink vision module
 * @param {object} options - Configuration options
 */
function init(options = {}) {
  if (state.initialized) {
    console.warn('Living Ink already initialized');
    return;
  }

  // Update state
  state.isMobile = detectMobile();
  state.prefersReducedMotion = checkReducedMotion();

  // Initialize subsystems
  initBreathingVideos();
  initSVGDiagrams();
  initScrollReveals();

  state.initialized = true;

  console.log('🖋️ Living Ink: Drawings breathe, diagrams reveal themselves');
}

/**
 * Cleanup and destroy all animations
 */
function destroy() {
  if (!state.initialized) return;

  // Stop and remove all videos
  state.videos.forEach(({ destroy }) => destroy());
  state.videos = [];

  // Kill all GSAP animations
  state.animations.forEach(anim => anim.kill());
  state.animations = [];

  // Kill all ScrollTriggers
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger?.classList?.contains('living-ink__diagram') ||
        st.vars.trigger?.classList?.contains('living-ink__breathing')) {
      st.kill();
    }
  });

  state.scrollTriggers = [];
  state.initialized = false;

  console.log('Living Ink: Destroyed');
}

// =====================
// EXPORTS
// =====================

export default {
  init,
  destroy,

  // Expose utility functions for advanced usage
  createBreathingVideo,
  createSVGDiagram,
  animateSVGDrawing,

  // Expose path library for custom diagrams
  paths: SVG_PATHS
};
