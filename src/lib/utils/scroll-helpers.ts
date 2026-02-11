/**
 * Scroll animation helper utilities
 *
 * Factory functions for common GSAP ScrollTrigger patterns used
 * across the Subfracture scroll storytelling system.
 *
 * @example
 * import { createScrollPlayReset } from '$lib/utils/scroll-helpers';
 *
 * const st = createScrollPlayReset(timeline, trigger, {
 *   start: 'top 80%',
 *   end: 'bottom 20%'
 * });
 */

import { browser } from '$app/environment';
import { prefersReducedMotion } from '$lib/utils/motion';

interface PlayResetOptions {
  /** ScrollTrigger start position (default: 'top 80%') */
  start?: string;
  /** ScrollTrigger end position (default: 'bottom 20%') */
  end?: string;
  /** Custom trigger element (default: uses the timeline's first target) */
  trigger?: Element | string;
}

/**
 * Create a play-on-enter / reset-on-leave-back ScrollTrigger.
 *
 * Plays the timeline when scrolling down into view.
 * Resets to start when scrolling back above the trigger.
 * Respects reduced motion (skips to end immediately).
 *
 * @param timeline - GSAP timeline to control
 * @param trigger - Element to use as ScrollTrigger trigger
 * @param options - ScrollTrigger configuration
 * @returns ScrollTrigger instance for cleanup, or null on server/reduced motion
 */
export async function createScrollPlayReset(
  timeline: gsap.core.Timeline,
  trigger: Element,
  options: PlayResetOptions = {}
): Promise<ScrollTrigger | null> {
  if (!browser) return null;

  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  const {
    start = 'top 80%',
    end = 'bottom 20%'
  } = options;

  if (prefersReducedMotion()) {
    timeline.progress(1);
    return null;
  }

  const st = ScrollTrigger.create({
    trigger: options.trigger ?? trigger,
    start,
    end,
    onEnter: () => timeline.play(),
    onLeaveBack: () => timeline.pause(0)
  });

  return st;
}

/**
 * Create a scrub-linked ScrollTrigger that maps scroll position
 * to timeline progress.
 *
 * @param timeline - GSAP timeline to scrub
 * @param trigger - Element to use as ScrollTrigger trigger
 * @param options - ScrollTrigger configuration
 * @returns ScrollTrigger instance for cleanup, or null on server
 */
export async function createScrollScrub(
  timeline: gsap.core.Timeline,
  trigger: Element,
  options: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean;
  } = {}
): Promise<ScrollTrigger | null> {
  if (!browser) return null;

  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  const {
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = true,
    pin = false
  } = options;

  if (prefersReducedMotion()) {
    timeline.progress(1);
    return null;
  }

  const st = ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub,
    pin,
    animation: timeline
  });

  return st;
}
