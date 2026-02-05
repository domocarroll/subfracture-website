/**
 * SSR-safe GSAP initialization utility
 *
 * Provides lazy-loaded GSAP with ScrollTrigger registration and global defaults.
 * Safe to call multiple times (idempotent).
 *
 * @example
 * import { initGSAP } from '$lib/utils/gsap';
 *
 * onMount(async () => {
 *   const gsap = await initGSAP();
 *   if (gsap) {
 *     // Use gsap...
 *   }
 * });
 */

import { browser } from '$app/environment';

// Track initialization state to prevent double-registration
let initialized = false;
let gsapInstance: typeof import('gsap').gsap | null = null;

/**
 * Initialize GSAP with ScrollTrigger plugin and global defaults.
 *
 * @returns The gsap instance for optional chaining, or null on server
 */
export async function initGSAP(): Promise<typeof import('gsap').gsap | null> {
  // SSR guard - return null on server
  if (!browser) return null;

  // Return cached instance if already initialized
  if (initialized && gsapInstance) {
    return gsapInstance;
  }

  // Dynamic imports for GSAP modules (lazy loading)
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Set global defaults matching motion personality from CONTEXT.md
  // - Organic feel with gentle ease-out
  // - 0.5-0.8s duration range, defaulting to 0.6s
  gsap.defaults({
    duration: 0.6,
    ease: 'power3.out'
  });

  // Mark as initialized and cache instance
  initialized = true;
  gsapInstance = gsap;

  return gsap;
}

/**
 * Get the GSAP instance if already initialized.
 * Returns null if not yet initialized or on server.
 */
export function getGSAP(): typeof import('gsap').gsap | null {
  if (!browser || !initialized) return null;
  return gsapInstance;
}

/**
 * Reset initialization state (useful for testing).
 */
export function resetGSAP(): void {
  initialized = false;
  gsapInstance = null;
}
