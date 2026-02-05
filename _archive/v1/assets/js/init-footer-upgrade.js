/**
 * Footer Animation Upgrade
 * Replaces the basic bigtype animation with dramatic letter-rise effect
 * Call this after DOM is ready to override the existing footer animation
 */

import { initFooterDramatics } from './footer-dramatics.js';

export function upgradeFooterAnimation() {
  const prefersReducedMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Initialize dramatic bigtype emergence
  initFooterDramatics({
    prefersReducedMotion: prefersReducedMotion(),
    mouseParallax: true,
    breathingEffect: false, // Keep it subtle - don't compete with scroll effects
    letterRiseStagger: 0.08,
    riseDistance: 120,
    riseRotation: 8
  });

  console.log('Footer dramatics initialized - the crescendo awaits');
}
