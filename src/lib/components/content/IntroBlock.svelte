<script lang="ts">
	/**
	 * IntroBlock - "The Declaration"
	 *
	 * Full-height white surface with the brand thesis.
	 * Heading words crystallize from blur as you scroll (blur-to-sharp).
	 * Lede lines slide up from behind masked reveals (editorial authority).
	 *
	 * Semantic word interactions: each key word performs its own meaning
	 * on hover — "dead" falls flat, "worlds" drifts away, "grows" scales up.
	 *
	 * Ambient orb-drift behind the content adds depth.
	 * Reduced motion: all text visible immediately.
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { prefersReducedMotion } from '$lib/utils/motion';
	import BlurWordReveal from '$lib/components/scroll/BlurWordReveal.svelte';

	let ledeEl: HTMLElement | undefined = $state();

	onMount(() => {
		if (!browser || !ledeEl || prefersReducedMotion()) return;

		let tl: gsap.core.Timeline | null = null;
		let scrollTriggerInstance: ScrollTrigger | null = null;
		const handlers: Array<{ el: HTMLElement; type: string; fn: EventListener }> = [];

		const init = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			// ── Line-reveal entrance (replaces MaskedLineReveal) ──
			const lineEls = ledeEl!.querySelectorAll('.masked-line');
			if (lineEls.length === 0) return;

			gsap.set(lineEls, { yPercent: 110, opacity: 0 });

			tl = gsap.timeline({ paused: true });
			tl.to(lineEls, {
				yPercent: 0,
				opacity: 1,
				duration: 0.85,
				ease: 'power4.out',
				stagger: { each: 0.18 }
			});

			scrollTriggerInstance = ScrollTrigger.create({
				trigger: ledeEl,
				start: 'top 55%',
				onEnter: () => tl!.play(),
				onLeaveBack: () => tl!.pause(0)
			});

			// ── Semantic word hover interactions ──
			const anchors = ledeEl!.querySelectorAll<HTMLElement>('.semantic-anchor');
			anchors.forEach((anchor) => {
				const word = anchor.querySelector<HTMLElement>('.semantic-word');
				if (!word) return;
				const motion = word.dataset.motion;

				let activeTween: gsap.core.Tween | null = null;

				const onEnter = () => {
					if (activeTween) activeTween.kill();

					switch (motion) {
						case 'dead':
							// Face-plants forward — word falls flat on its face
							activeTween = gsap.to(word, {
								rotationX: -75,
								opacity: 0.25,
								y: 2,
								duration: 0.4,
								ease: 'power3.in',
								transformPerspective: 300,
								transformOrigin: 'bottom center'
							});
							break;

						case 'worlds':
							// Drifts away into space — weightless departure
							activeTween = gsap.to(word, {
								y: -22,
								rotation: -4,
								opacity: 0.1,
								scale: 0.85,
								duration: 1.2,
								ease: 'power2.out'
							});
							break;

						case 'inevitable':
							// Gets heavier — gravity settles it into place
							activeTween = gsap.to(word, {
								scale: 1.06,
								y: 1,
								duration: 0.8,
								ease: 'power1.out'
							});
							break;

						case 'culture':
							// Breathes out — organic, alive
							activeTween = gsap.to(word, {
								letterSpacing: '0.06em',
								duration: 0.5,
								ease: 'power2.out'
							});
							break;

						case 'grows':
							// Literally grows — spring bounce
							activeTween = gsap.to(word, {
								scale: 1.22,
								duration: 0.4,
								ease: 'back.out(1.5)'
							});
							break;

						case 'itself':
							// Leans into itself — self-referential
							activeTween = gsap.to(word, {
								skewX: -8,
								duration: 0.3,
								ease: 'power2.out'
							});
							break;
					}
				};

				const onLeave = () => {
					if (activeTween) activeTween.kill();

					// Return to rest — each word recovers at its own pace
					const baseReturn = { duration: 0.6, ease: 'power2.out', overwrite: true };

					switch (motion) {
						case 'dead':
							activeTween = gsap.to(word, {
								...baseReturn,
								rotationX: 0,
								opacity: 1,
								y: 0,
								duration: 0.7,
								ease: 'elastic.out(1, 0.6)'
							});
							break;

						case 'worlds':
							activeTween = gsap.to(word, {
								...baseReturn,
								y: 0,
								rotation: 0,
								opacity: 1,
								scale: 1,
								duration: 0.9
							});
							break;

						case 'inevitable':
							activeTween = gsap.to(word, {
								...baseReturn,
								scale: 1,
								y: 0
							});
							break;

						case 'culture':
							activeTween = gsap.to(word, {
								...baseReturn,
								letterSpacing: '0em',
								ease: 'power2.inOut'
							});
							break;

						case 'grows':
							activeTween = gsap.to(word, {
								...baseReturn,
								scale: 1,
								duration: 0.4
							});
							break;

						case 'itself':
							activeTween = gsap.to(word, {
								...baseReturn,
								skewX: 0,
								duration: 0.3
							});
							break;
					}
				};

				anchor.addEventListener('mouseenter', onEnter);
				anchor.addEventListener('mouseleave', onLeave);
				handlers.push(
					{ el: anchor, type: 'mouseenter', fn: onEnter },
					{ el: anchor, type: 'mouseleave', fn: onLeave }
				);
			});
		};

		init();

		return () => {
			if (scrollTriggerInstance) scrollTriggerInstance.kill();
			if (tl) tl.kill();
			handlers.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
		};
	});
</script>

<section class="intro-block">
	<div class="intro-block__content">
		<BlurWordReveal
			text="Strategic Creative Design Technology"
			tag="h1"
			class="intro-block__heading"
			start="top 95%"
			end="top 20%"
			blurAmount={11}
			startOpacity={0.05}
		/>

		<!-- Semantic lede — each key word performs its own meaning -->
		<div class="intro-block__lede" bind:this={ledeEl}>
			<span class="masked-line-wrap">
				<span class="masked-line">
					Outshine trends and leave bland for <span class="semantic-anchor"><span class="semantic-word" data-motion="dead">dead</span></span>.
				</span>
			</span>
			<span class="masked-line-wrap">
				<span class="masked-line">
					We architect brand <span class="semantic-anchor"><span class="semantic-word" data-motion="worlds">worlds</span></span> that feel <span class="semantic-anchor"><span class="semantic-word" data-motion="inevitable">inevitable</span></span>.
				</span>
			</span>
			<span class="masked-line-wrap">
				<span class="masked-line">
					When the <span class="semantic-anchor"><span class="semantic-word" data-motion="culture">culture</span></span> fits, the brand <span class="semantic-anchor"><span class="semantic-word" data-motion="grows">grows</span></span> <span class="semantic-anchor"><span class="semantic-word" data-motion="itself">itself</span></span>.
				</span>
			</span>
		</div>
	</div>
</section>

<style>
	.intro-block {
		position: relative;
		z-index: 95;
		background: #fff;
		padding: 3rem 0 1rem;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.intro-block::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 120%;
		width: 120vmin;
		height: 80vmin;
		background: radial-gradient(
			ellipse at center,
			rgb(180 180 180 / 60%) 10%,
			rgb(255 255 255 / 18%) 38%,
			transparent 65%
		);
		transform: translate(-50%, -50%);
		filter: blur(80px);
		z-index: 0;
		pointer-events: none;
		animation: orb-drift 8s cubic-bezier(0.37, 0, 0.63, 1) infinite alternate;
	}

	.intro-block > * {
		position: relative;
		z-index: 1;
	}

	@keyframes orb-drift {
		0% {
			top: 100%;
			left: 20%;
		}
		50% {
			top: 110%;
			left: 80%;
		}
		100% {
			top: 100%;
			left: 20%;
		}
	}

	.intro-block__content {
		text-align: center;
		padding-inline: 12vw;
	}

	:global(.intro-block__heading) {
		font-family: var(--font-sans);
		font-size: clamp(2rem, 6vw, 6.5rem);
		font-weight: 700;
		color: var(--color-text);
		line-height: 1.05;
		letter-spacing: -0.02em;
		margin: 2rem 0 1rem;
		text-align: center;
		max-width: clamp(20ch, 50vw, 28ch);
		margin-inline: auto;
	}

	.intro-block__lede {
		font-family: var(--font-sans);
		font-size: clamp(1.4rem, 4vw, 2rem);
		color: var(--color-text);
		opacity: 0.8;
		line-height: 1.5;
		max-width: 32ch;
		margin: 0 auto;
		padding-block: 0.3em 1.5em;
		text-align: center;
	}

	/* Masked line entrance infrastructure */
	.masked-line-wrap {
		display: block;
		overflow: hidden;
	}

	.masked-line {
		display: block;
	}

	/* Semantic word anchors — stable hover target */
	.semantic-anchor {
		display: inline-block;
		position: relative;
		cursor: pointer;
	}

	/* The animated word inside the anchor */
	.semantic-word {
		display: inline-block;
		will-change: transform;
	}

	@media (max-width: 33rem) {
		:global(.intro-block__heading) {
			font-size: clamp(2rem, 9vw, 3rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.intro-block::before {
			animation: none;
		}

		.masked-line {
			opacity: 1 !important;
			transform: none !important;
		}

		.semantic-word {
			transform: none !important;
			opacity: 1 !important;
		}
	}
</style>
