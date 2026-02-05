/**
 * Reduced motion detection utilities
 *
 * Respects user's prefers-reduced-motion preference for accessibility.
 * All utilities are SSR-safe (return sensible defaults on server).
 *
 * @example
 * import { prefersReducedMotion, getAnimationDuration } from '$lib/utils/motion';
 *
 * const duration = getAnimationDuration(0.6); // Returns 0 if reduced motion preferred
 */

import { browser } from '$app/environment';

/**
 * Check if user prefers reduced motion.
 *
 * @returns true if user has prefers-reduced-motion: reduce
 * @returns false on server (fail-open for SSR compatibility)
 */
export function prefersReducedMotion(): boolean {
  if (!browser) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration respecting reduced motion preference.
 *
 * @param baseDuration - The intended animation duration in seconds
 * @returns 0 if reduced motion is preferred, baseDuration otherwise
 *
 * @example
 * gsap.to(element, {
 *   opacity: 1,
 *   duration: getAnimationDuration(0.6)
 * });
 */
export function getAnimationDuration(baseDuration: number): number {
  return prefersReducedMotion() ? 0 : baseDuration;
}

/**
 * Get motion-safe animation properties.
 *
 * If reduced motion is preferred, returns a copy of the props with duration: 0.
 * Otherwise returns the original props unchanged.
 *
 * @param animationProps - GSAP tween properties
 * @returns Motion-safe version of the properties
 *
 * @example
 * gsap.to(element, getMotionSafeProps({
 *   opacity: 1,
 *   y: 0,
 *   duration: 0.6
 * }));
 */
export function getMotionSafeProps<T extends Record<string, unknown>>(
  animationProps: T
): T {
  if (prefersReducedMotion()) {
    return {
      ...animationProps,
      duration: 0
    };
  }
  return animationProps;
}

/**
 * Subscribe to reduced motion preference changes.
 *
 * Useful for reactive updates when user toggles system preference.
 *
 * @param callback - Function called when preference changes
 * @returns Cleanup function to remove listener
 *
 * @example
 * onMount(() => {
 *   const cleanup = onReducedMotionChange((prefersReduced) => {
 *     console.log('Reduced motion:', prefersReduced);
 *   });
 *   return cleanup;
 * });
 */
export function onReducedMotionChange(
  callback: (prefersReduced: boolean) => void
): () => void {
  if (!browser) {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const handler = (event: MediaQueryListEvent) => {
    callback(event.matches);
  };

  mediaQuery.addEventListener('change', handler);

  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}
