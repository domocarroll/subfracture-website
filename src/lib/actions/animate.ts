/**
 * GSAP Svelte action with proper cleanup
 *
 * Wraps GSAP animations in a Svelte action for declarative usage with
 * automatic cleanup on component unmount. Prevents memory leaks and
 * ScrollTrigger persistence across route navigation.
 *
 * @example
 * <script lang="ts">
 *   import { animate } from '$lib/actions/animate';
 * </script>
 *
 * <h1 use:animate={{
 *   type: 'from',
 *   opacity: 0,
 *   y: 30,
 *   duration: 0.6
 * }}>
 *   Heading
 * </h1>
 *
 * @example With ScrollTrigger
 * <div use:animate={{
 *   type: 'from',
 *   opacity: 0,
 *   y: 20,
 *   scrollTrigger: {
 *     start: 'top 85%',
 *     toggleActions: 'play none none none'
 *   }
 * }}>
 *   Content
 * </div>
 */

import { browser } from '$app/environment';
import { prefersReducedMotion } from '$lib/utils/motion';

import type { Action } from 'svelte/action';

/**
 * Animation type options
 */
type AnimationType = 'to' | 'from' | 'fromTo' | 'set';

/**
 * ScrollTrigger configuration (subset of ScrollTrigger.Vars)
 */
interface ScrollTriggerConfig {
  trigger?: Element | string;
  start?: string | number;
  end?: string | number;
  scrub?: boolean | number;
  pin?: boolean | Element | string;
  markers?: boolean;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

/**
 * Animation options extending GSAP TweenVars
 */
interface AnimateOptions {
  /** Animation type: 'to' (default), 'from', 'fromTo', or 'set' */
  type?: AnimationType;

  /** ScrollTrigger configuration */
  scrollTrigger?: ScrollTriggerConfig;

  /** Starting values for 'fromTo' type */
  fromVars?: Record<string, unknown>;

  // Common GSAP properties
  duration?: number;
  delay?: number;
  ease?: string;
  opacity?: number;
  x?: number | string;
  y?: number | string;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
  transformOrigin?: string;
  stagger?: number | object;
  onComplete?: () => void;
  onStart?: () => void;

  /** Allow any other GSAP properties */
  [key: string]: unknown;
}

// Module-level cache for lazy-loaded GSAP
let gsapModule: typeof import('gsap') | null = null;
let ScrollTriggerPlugin: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;

/**
 * Lazy load GSAP only in browser context
 */
async function ensureGSAP() {
  if (!browser) return null;

  if (!gsapModule) {
    gsapModule = await import('gsap');
    const stModule = await import('gsap/ScrollTrigger');
    ScrollTriggerPlugin = stModule.ScrollTrigger;
    gsapModule.gsap.registerPlugin(ScrollTriggerPlugin);
  }

  return gsapModule.gsap;
}

/**
 * Svelte action for GSAP animations with automatic cleanup.
 *
 * Features:
 * - SSR-safe with browser guard
 * - Supports 'to', 'from', 'fromTo', 'set' animation types
 * - ScrollTrigger support with automatic cleanup
 * - Respects reduced motion preference
 * - Automatic cleanup on component unmount
 */
export const animate: Action<HTMLElement, AnimateOptions> = (
  node: HTMLElement,
  options: AnimateOptions = {}
) => {
  // SSR guard - return empty object on server
  if (!browser) {
    return {};
  }

  let tween: gsap.core.Tween | gsap.core.Timeline | null = null;
  let scrollTriggerInstance: ScrollTrigger | null = null;

  // Initialize animation asynchronously
  const initAnimation = async () => {
    const gsap = await ensureGSAP();
    if (!gsap) return;

    const {
      type = 'to',
      scrollTrigger,
      fromVars,
      ...tweenVars
    } = options;

    // Respect reduced motion preference
    if (prefersReducedMotion()) {
      tweenVars.duration = 0;
    }

    // Build ScrollTrigger config with node as default trigger
    const scrollTriggerConfig = scrollTrigger
      ? { trigger: node, ...scrollTrigger }
      : undefined;

    // Create animation based on type
    const vars: gsap.TweenVars = {
      ...tweenVars,
      scrollTrigger: scrollTriggerConfig
    };

    switch (type) {
      case 'from':
        tween = gsap.from(node, vars);
        break;

      case 'fromTo':
        if (fromVars) {
          tween = gsap.fromTo(node, fromVars, vars);
        } else {
          console.warn('[animate] fromTo type requires fromVars property');
          tween = gsap.to(node, vars);
        }
        break;

      case 'set':
        // gsap.set returns Tween but with instant duration
        tween = gsap.set(node, tweenVars) as unknown as gsap.core.Tween;
        break;

      case 'to':
      default:
        tween = gsap.to(node, vars);
        break;
    }

    // Store ScrollTrigger reference for cleanup
    if (tween && 'scrollTrigger' in tween && tween.scrollTrigger) {
      scrollTriggerInstance = tween.scrollTrigger as ScrollTrigger;
    }
  };

  // Start initialization
  initAnimation();

  return {
    /**
     * Update animation with new options
     */
    update(newOptions: AnimateOptions) {
      // Kill existing animation
      if (tween) {
        if (scrollTriggerInstance) {
          scrollTriggerInstance.kill();
          scrollTriggerInstance = null;
        }
        tween.kill();
        tween = null;
      }

      // Re-initialize with new options
      options = newOptions;
      initAnimation();
    },

    /**
     * Cleanup on component unmount
     */
    destroy() {
      if (tween) {
        // Kill ScrollTrigger first if exists
        if (scrollTriggerInstance) {
          scrollTriggerInstance.kill();
          scrollTriggerInstance = null;
        }

        // Then kill the tween
        tween.kill();
        tween = null;
      }
    }
  };
};

export default animate;
