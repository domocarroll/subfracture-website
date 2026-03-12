/**
 * Magnetic hover action - Elements subtly track the mouse cursor
 *
 * Creates a "pulled toward your interest" effect on hover.
 * Uses GSAP quickTo for smooth, physics-based following.
 *
 * @example
 * <script lang="ts">
 *   import { magnetic } from '$lib/actions/magnetic';
 * </script>
 *
 * <a use:magnetic={{ strength: 8 }}>Magnetic link</a>
 */

import { browser } from '$app/environment';
import { prefersReducedMotion } from '$lib/utils/motion';

import type { Action } from 'svelte/action';

interface MagneticOptions {
	/** Maximum displacement in pixels (default: 8) */
	strength?: number;
	/** Smoothing duration in seconds (default: 0.35) */
	duration?: number;
}

export const magnetic: Action<HTMLElement, MagneticOptions> = (
	node,
	options = {}
) => {
	if (!browser || prefersReducedMotion()) return {};

	const { strength = 8, duration = 0.35 } = options;

	let qtX: ((value: number) => void) | null = null;
	let qtY: ((value: number) => void) | null = null;

	const init = async () => {
		const { gsap } = await import('gsap');
		qtX = gsap.quickTo(node, 'x', { duration, ease: 'power3.out' });
		qtY = gsap.quickTo(node, 'y', { duration, ease: 'power3.out' });
	};

	const handleMove = (e: MouseEvent) => {
		if (!qtX || !qtY) return;
		const rect = node.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const dx = (e.clientX - cx) / rect.width;
		const dy = (e.clientY - cy) / rect.height;
		qtX(dx * strength);
		qtY(dy * strength);
	};

	const handleLeave = () => {
		if (qtX) qtX(0);
		if (qtY) qtY(0);
	};

	init();

	node.addEventListener('mousemove', handleMove);
	node.addEventListener('mouseleave', handleLeave);

	return {
		destroy() {
			node.removeEventListener('mousemove', handleMove);
			node.removeEventListener('mouseleave', handleLeave);
			if (qtX) qtX(0);
			if (qtY) qtY(0);
		}
	};
};
