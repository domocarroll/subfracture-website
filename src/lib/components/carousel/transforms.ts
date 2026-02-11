/**
 * Pure transform functions for 3D fold-behind carousel
 *
 * Cards fold behind the active card with perspective rotation,
 * creating a physical "deck of cards" feel. Parameters are tuned
 * for text-only editorial cards on a cream background.
 */

export interface CardTransform {
	x: number;
	rotateY: number;
	translateZ: number;
	transformOrigin: string;
	scale: number;
	opacity: number;
	blur: number;
	zIndex: number;
	isActive: boolean;
}

/**
 * Compute the 3D transform for a card based on its position
 * relative to the active card.
 *
 * @param index - Card index in the array
 * @param currentOffset - Current spring-driven offset in pixels
 * @param cardStep - Width + gap of one card slot
 * @param total - Total number of cards
 */
export function getCardTransform(
	index: number,
	currentOffset: number,
	cardStep: number,
	total: number
): CardTransform {
	const cameraIndex = -currentOffset / cardStep;

	// Wrap-around distance for infinite looping
	let diff = index - cameraIndex;
	while (diff > total / 2) diff -= total;
	while (diff < -total / 2) diff += total;

	const absDistance = Math.abs(diff);

	// X spread: tighter overlap for fold-behind effect
	const spreadFactor = 0.5;
	const x = diff * cardStep * spreadFactor;

	// Rotation: fold side cards behind center
	// Lower max for text readability
	const maxRotation = 45;
	const rawRotation = -diff * 50;
	const rotateY = Math.max(-maxRotation, Math.min(maxRotation, rawRotation));

	// Z depth: push side cards behind center
	const translateZ = -absDistance * 150;

	// Transform origin: cards pivot from inner edge
	const clampedDiff = Math.max(-1, Math.min(1, diff));
	const originX = 50 - clampedDiff * 50;
	const transformOrigin = `${originX}% 50%`;

	// Scale: side cards slightly smaller
	const scale = Math.max(0.82, 1 - absDistance * 0.08);

	// Opacity: higher floor so cream cards don't vanish on cream bg
	const opacity = Math.max(0.45, 1 - absDistance * 0.35);

	// Blur: lighter for text cards
	const blur = Math.min(absDistance * 1.5, 3);

	// Z-index: center card always on top
	const zIndex = Math.round(100 - absDistance * 20);

	return {
		x,
		rotateY,
		translateZ,
		transformOrigin,
		scale,
		opacity,
		blur,
		zIndex,
		isActive: absDistance < 0.5
	};
}

/**
 * Rubber band easing: moves freely at first, then stiffens.
 * Used for scroll tension phase before snap.
 *
 * t=0 → 0, t=1 → 1, but decelerating (resistance builds).
 */
export function rubberBand(t: number): number {
	return 1 - Math.pow(1 - t, 3);
}
