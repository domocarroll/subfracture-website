/**
 * Footer Dramatics - Theatrical emergence for the Subfracture wordmark
 * The crescendo of the page experience
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Split SVG logo into animatable paths
 * If SVG has individual letter paths, return them
 * Otherwise, work with the whole image
 */
function prepareLogo(logoContainer) {
  const img = logoContainer.querySelector('img');
  if (!img) return null;

  // Check if we can access SVG internals (inline SVG)
  const svg = logoContainer.querySelector('svg');

  if (svg) {
    // We have an inline SVG - split by paths/groups
    const paths = Array.from(svg.querySelectorAll('path, g > *'));
    return { type: 'svg', elements: paths, container: svg };
  }

  // Fallback: work with the image as a whole
  return { type: 'image', elements: [img], container: logoContainer };
}

/**
 * Main footer dramatics initialization
 * @param {Object} options - Configuration options
 */
export function initFooterDramatics(options = {}) {
  const {
    prefersReducedMotion = false,
    mouseParallax = true,
    breathingEffect = true,
    letterRiseStagger = 0.08,
    riseDistance = 120,
    riseRotation = 8
  } = options;

  const bigtype = document.querySelector('.sf-closer__bigtype');
  if (!bigtype) return;

  const logo = prepareLogo(bigtype);
  if (!logo) return;

  // Reduced motion: simple fade-in
  if (prefersReducedMotion) {
    gsap.fromTo(bigtype,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bigtype,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
    return;
  }

  // ======================
  // LETTER RISE ANIMATION
  // ======================

  const elements = logo.elements;

  // Set initial state - below viewport with rotation
  gsap.set(elements, {
    y: riseDistance,
    rotation: (i) => (i % 2 === 0 ? riseRotation : -riseRotation),
    opacity: 0,
    transformOrigin: 'center center',
    force3D: true
  });

  // Create timeline for the rise
  const riseTL = gsap.timeline({
    paused: true,
    defaults: {
      ease: 'power2.out',
      duration: 1.2
    }
  });

  // Staggered letter rise with bounce
  riseTL.to(elements, {
    y: 0,
    rotation: 0,
    opacity: 1,
    stagger: {
      amount: letterRiseStagger * elements.length,
      from: 'start',
      ease: 'power1.in'
    },
    ease: 'back.out(1.4)'
  });

  // Add subtle settle effect
  riseTL.to(elements, {
    y: -5,
    duration: 0.3,
    stagger: {
      amount: 0.2,
      from: 'start'
    },
    ease: 'power1.out'
  }, '-=0.6')
  .to(elements, {
    y: 0,
    duration: 0.4,
    stagger: {
      amount: 0.2,
      from: 'start'
    },
    ease: 'power2.out'
  }, '-=0.1');

  // Trigger animation on scroll
  ScrollTrigger.create({
    trigger: bigtype,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      riseTL.play();

      // After rise completes, enable interactive effects
      riseTL.eventCallback('onComplete', () => {
        if (mouseParallax) initMouseParallax(bigtype, elements);
        if (breathingEffect) initBreathingEffect(bigtype);
      });
    }
  });

  // ======================
  // SCROLL-BASED BREATHING
  // ======================

  if (breathingEffect) {
    // Add subtle scale breathing effect tied to scroll
    ScrollTrigger.create({
      trigger: bigtype,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        // Gentle breathing pulse (scale between 0.98 and 1.02)
        const scale = 0.98 + (Math.sin(progress * Math.PI) * 0.04);
        gsap.set(bigtype, { scale });
      }
    });
  }
}

/**
 * Mouse parallax effect - letters respond to cursor position
 * Creates living, breathing typography
 */
function initMouseParallax(container, elements) {
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  const ease = 0.08;
  const depth = 8; // pixels of movement

  // Track mouse position relative to container
  const updateMouse = (e) => {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to -1 to 1 range
    mouseX = (e.clientX - centerX) / (rect.width / 2);
    mouseY = (e.clientY - centerY) / (rect.height / 2);
  };

  document.addEventListener('mousemove', updateMouse, { passive: true });

  // Smooth animation loop
  function animate() {
    // Smooth interpolation
    currentX += (mouseX - currentX) * ease;
    currentY += (mouseY - currentY) * ease;

    // Apply parallax to each element with varying depth
    elements.forEach((el, i) => {
      const factor = 1 + (i * 0.1); // Each letter has slightly different depth
      const x = currentX * depth * factor;
      const y = currentY * depth * factor;

      gsap.set(el, {
        x,
        y,
        rotation: currentX * 1.5, // Subtle rotation based on X position
        force3D: true
      });
    });

    requestAnimationFrame(animate);
  }

  animate();

  console.log('Footer mouse parallax initialized');
}

/**
 * Breathing effect - wordmark subtly scales with scroll
 */
function initBreathingEffect(container) {
  // Create a gentle pulsing effect independent of scroll
  gsap.to(container, {
    scale: 1.01,
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });
}

/**
 * Alternative: Particle assembly effect (advanced)
 * Letters dissolve into particles then reform
 * Requires canvas and more complex setup - commented for reference
 */
export function initParticleAssembly(bigtypeContainer) {
  // TODO: Canvas-based particle system
  // 1. Render SVG logo to canvas
  // 2. Sample pixels as particles
  // 3. Scatter particles randomly
  // 4. Animate particles to target positions
  // 5. Fade out canvas, fade in actual SVG

  console.log('Particle assembly not yet implemented - use letter rise for now');
}

/**
 * Enhanced version with clip-path reveal wipe
 * Dramatic diagonal wipe reveals the wordmark
 */
export function initRevealWipe(bigtypeContainer) {
  const bigtype = bigtypeContainer;
  if (!bigtype) return;

  // Set initial clip-path (hidden)
  gsap.set(bigtype, {
    clipPath: 'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)',
    opacity: 1
  });

  // Animate clip-path to reveal diagonally
  ScrollTrigger.create({
    trigger: bigtype,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(bigtype, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1.6,
        ease: 'power4.inOut'
      });

      // Add subtle scale up during reveal
      gsap.fromTo(bigtype,
        { scale: 0.95 },
        {
          scale: 1,
          duration: 1.6,
          ease: 'power2.out'
        }
      );
    }
  });

  console.log('Footer reveal wipe initialized');
}
