<script lang="ts">
	/**
	 * better-casey — Easter egg tribute page
	 *
	 * A Harry Potter–style moving portrait of Casey that zooms out
	 * to reveal him as a toddler throwing his toys, then gets a binky.
	 *
	 * The portrait starts as a normal professional headshot, then on
	 * scroll/click, animates through the "regression sequence".
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import DesignChat from '$lib/components/better-casey/DesignChat.svelte';
	import DesignPreview from '$lib/components/better-casey/DesignPreview.svelte';
	import CodeOutput from '$lib/components/better-casey/CodeOutput.svelte';

	interface DesignBrief {
		type: string;
		description: string;
		industry: string;
		mood: string;
		colors: string | null;
		constraints: string[];
	}

	let generatedHtml = $state('');
	let generating = $state(false);

	async function handleGenerate(brief: DesignBrief) {
		generating = true;
		generatedHtml = '';

		try {
			const res = await fetch('/better-casey/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ brief })
			});

			const data = await res.json();
			if (data.html) {
				generatedHtml = data.html;
			}
		} catch {
			// Generation failed silently — chat will show error
		} finally {
			generating = false;
		}
	}

	let phase = $state<'portrait' | 'zooming' | 'toddler' | 'binky'>('portrait');
	let frameEl: HTMLElement | undefined = $state();
	let shaking = $state(false);

	function advancePhase() {
		if (phase === 'portrait') {
			phase = 'zooming';
			setTimeout(() => { phase = 'toddler'; shaking = true; }, 1500);
			setTimeout(() => { shaking = false; phase = 'binky'; }, 4000);
		} else if (phase === 'binky') {
			phase = 'portrait';
		}
	}

	onMount(() => {
		if (!browser) return;
		// Subtle frame wobble on hover — harry potter style
		const handleMouseMove = (e: MouseEvent) => {
			if (!frameEl) return;
			const rect = frameEl.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width - 0.5;
			const y = (e.clientY - rect.top) / rect.height - 0.5;
			frameEl.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
		};
		const handleMouseLeave = () => {
			if (frameEl) frameEl.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
		};
		frameEl?.addEventListener('mousemove', handleMouseMove);
		frameEl?.addEventListener('mouseleave', handleMouseLeave);
		return () => {
			frameEl?.removeEventListener('mousemove', handleMouseMove);
			frameEl?.removeEventListener('mouseleave', handleMouseLeave);
		};
	});
</script>

<svelte:head>
	<title>better-casey | Subfracture</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page">
	<div class="gallery-wall">
		<!-- The Portrait Frame -->
		<button
			class="portrait-frame"
			class:shaking
			bind:this={frameEl}
			onclick={advancePhase}
			aria-label="Casey's moving portrait — click to interact"
		>
			<!-- Gold ornate frame border -->
			<div class="frame-border">
				<div class="frame-inner">
					<!-- The portrait image -->
					<div class="portrait" class:zooming={phase === 'zooming'} class:toddler={phase === 'toddler' || phase === 'binky'}>
						<img src="/images/team/casey.png" alt="Casey Midgley" class="portrait-img" />

						{#if phase === 'toddler' || phase === 'binky'}
							<!-- Toys flying out -->
							<span class="toy toy-1" aria-hidden="true">🧸</span>
							<span class="toy toy-2" aria-hidden="true">🎨</span>
							<span class="toy toy-3" aria-hidden="true">✏️</span>
							<span class="toy toy-4" aria-hidden="true">📐</span>
							<span class="toy toy-5" aria-hidden="true">🖌️</span>
						{/if}

						{#if phase === 'binky'}
							<span class="binky" aria-hidden="true">🍼</span>
						{/if}
					</div>
				</div>
			</div>

			<!-- Nameplate -->
			<div class="nameplate">
				<span class="nameplate-text">
					{#if phase === 'portrait' || phase === 'zooming'}
						Casey Midgley — Design Director (2012–2026)
					{:else if phase === 'toddler'}
						Casey Midgley — Throwing His Toys
					{:else}
						Casey Midgley — Settled Down Now
					{/if}
				</span>
			</div>
		</button>

		<!-- Plaque below -->
		<p class="plaque">
			{#if phase === 'portrait'}
				<em>"Click the portrait... if you dare."</em>
			{:else if phase === 'binky'}
				<em>"His design instinct lives on — codified into an AI that never misses a deadline."</em>
				<br />
				<a href="/" class="back-link">← Back to the grown-ups</a>
			{:else}
				<em>"Wait for it..."</em>
			{/if}
		</p>
	</div>

	<!-- The Pitch -->
	<section class="pitch">
		<h2 class="pitch-heading">He left. We built something better.</h2>
		<p class="pitch-sub">Describe any UI and watch our AI design director build it live. No signup. No cost. Impeccable output guaranteed.</p>
	</section>

	<!-- Design Tool -->
	<section class="design-tool">
		<div class="tool-chat">
			<DesignChat {generating} ongenerate={handleGenerate} />
		</div>
		<div class="tool-preview">
			<DesignPreview html={generatedHtml} />
		</div>
	</section>

	<!-- Code Output -->
	<CodeOutput html={generatedHtml} />

	<!-- CTA -->
	<section class="cta">
		<p class="cta-text">Want this for your brand?</p>
		<a href="/#contact" class="cta-link">Let's talk →</a>
	</section>
</div>

<style>
	.page {
		background: #1a1815;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 2rem;
		background-image:
			radial-gradient(ellipse at 30% 20%, rgba(120, 80, 40, 0.08) 0%, transparent 50%),
			radial-gradient(ellipse at 70% 80%, rgba(80, 60, 30, 0.06) 0%, transparent 50%);
	}

	/* Portrait frame — gold ornate style */
	.portrait-frame {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: transform 0.3s ease;
		transform-style: preserve-3d;
	}

	.portrait-frame:focus-visible {
		outline: 2px solid #c9a84c;
		outline-offset: 8px;
		border-radius: 4px;
	}

	.frame-border {
		padding: 1.5rem;
		background: linear-gradient(145deg, #c9a84c 0%, #8b6914 25%, #c9a84c 50%, #8b6914 75%, #c9a84c 100%);
		border-radius: 4px;
		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.5),
			inset 0 1px 0 rgba(255, 255, 255, 0.15),
			0 0 60px rgba(201, 168, 76, 0.1);
	}

	.frame-inner {
		background: #0a0908;
		padding: 4px;
		border-radius: 2px;
	}

	.portrait {
		width: clamp(250px, 40vw, 400px);
		aspect-ratio: 3 / 4;
		overflow: hidden;
		position: relative;
		border-radius: 2px;
		transition: transform 1.5s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.portrait.zooming {
		transform: scale(1.3);
	}

	.portrait.toddler {
		transform: scale(0.7);
		border-radius: 50%;
	}

	.portrait-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: sepia(0.3) contrast(1.1);
		transition: filter 1.5s ease, transform 1.5s ease;
	}

	.portrait.toddler .portrait-img {
		filter: sepia(0.5) contrast(0.9) saturate(1.4) brightness(1.1);
		transform: scale(1.8) translateY(10%);
	}

	/* Shaking animation when throwing toys */
	.shaking {
		animation: tantrum 0.15s ease-in-out infinite alternate;
	}

	@keyframes tantrum {
		0% { transform: perspective(800px) rotate(-2deg) translateX(-3px); }
		100% { transform: perspective(800px) rotate(2deg) translateX(3px); }
	}

	/* Toys flying out */
	.toy {
		position: absolute;
		font-size: 2rem;
		animation: throw-toy 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
		pointer-events: none;
	}

	.toy-1 { top: 30%; left: 20%; animation-delay: 0s; }
	.toy-2 { top: 40%; left: 60%; animation-delay: 0.2s; }
	.toy-3 { top: 50%; left: 30%; animation-delay: 0.4s; }
	.toy-4 { top: 35%; left: 70%; animation-delay: 0.6s; }
	.toy-5 { top: 55%; left: 50%; animation-delay: 0.8s; }

	@keyframes throw-toy {
		0% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
		100% { opacity: 0; transform: translate(var(--tx, 100px), var(--ty, -150px)) rotate(720deg) scale(0.3); }
	}

	.toy-1 { --tx: -120px; --ty: -180px; }
	.toy-2 { --tx: 150px; --ty: -200px; }
	.toy-3 { --tx: -80px; --ty: -140px; }
	.toy-4 { --tx: 180px; --ty: -160px; }
	.toy-5 { --tx: -40px; --ty: -220px; }

	/* Binky drops in */
	.binky {
		position: absolute;
		bottom: 25%;
		left: 50%;
		font-size: 3rem;
		transform: translateX(-50%);
		animation: drop-binky 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
		pointer-events: none;
	}

	@keyframes drop-binky {
		0% { opacity: 0; transform: translateX(-50%) translateY(-80px) scale(0.5); }
		100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
	}

	/* Nameplate */
	.nameplate {
		margin-top: 0.75rem;
		padding: 0.4rem 1.5rem;
		background: linear-gradient(145deg, #c9a84c, #8b6914);
		border-radius: 2px;
		text-align: center;
	}

	.nameplate-text {
		font-family: var(--font-serif, Georgia, serif);
		font-size: 0.75rem;
		color: #1a1815;
		font-weight: 600;
		letter-spacing: 0.04em;
	}

	/* Plaque text */
	.plaque {
		font-family: var(--font-sans, system-ui, sans-serif);
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.4);
		text-align: center;
		max-width: 30ch;
		line-height: 1.6;
	}

	.back-link {
		color: rgba(255, 255, 255, 0.5);
		text-decoration: none;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		transition: color 0.2s ease;
		display: inline-block;
		margin-top: 0.5rem;
	}

	.back-link:hover {
		color: rgba(255, 255, 255, 0.8);
	}

	/* Gallery wall — centered first screen */
	.gallery-wall {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
	}

	/* The Pitch */
	.pitch {
		text-align: center;
		padding: clamp(4rem, 8vw, 8rem) 2rem;
		max-width: 40rem;
	}

	.pitch-heading {
		font-family: var(--font-serif, Georgia, serif);
		font-size: clamp(1.5rem, 4vw, 2.5rem);
		font-weight: 400;
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.2;
		margin: 0 0 1rem;
	}

	.pitch-sub {
		font-family: var(--font-sans, system-ui, sans-serif);
		font-size: 0.95rem;
		color: rgba(255, 255, 255, 0.4);
		line-height: 1.6;
		margin: 0;
	}

	/* Design Tool */
	.design-tool {
		display: grid;
		grid-template-columns: 2fr 3fr;
		gap: 1px;
		width: 100%;
		max-width: 1200px;
		min-height: 600px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 12px;
		overflow: hidden;
	}

	.tool-chat {
		border-right: 1px solid rgba(255, 255, 255, 0.06);
	}

	.tool-preview {
		min-height: 500px;
	}

	@media (max-width: 48rem) {
		.design-tool {
			grid-template-columns: 1fr;
		}

		.tool-chat {
			border-right: none;
			border-bottom: 1px solid rgba(255, 255, 255, 0.06);
			min-height: 350px;
		}
	}

	/* CTA */
	.cta {
		text-align: center;
		padding: clamp(4rem, 8vw, 8rem) 2rem;
	}

	.cta-text {
		font-family: var(--font-serif, Georgia, serif);
		font-size: 1.3rem;
		color: rgba(255, 255, 255, 0.5);
		margin: 0 0 1rem;
	}

	.cta-link {
		font-family: var(--font-sans, system-ui, sans-serif);
		font-size: 0.8rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #c9a84c;
		text-decoration: none;
		padding: 0.6rem 1.5rem;
		border: 1px solid rgba(201, 168, 76, 0.3);
		border-radius: 4px;
		transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
	}

	.cta-link:hover {
		background: rgba(201, 168, 76, 0.1);
		border-color: rgba(201, 168, 76, 0.5);
	}

	@media (prefers-reduced-motion: reduce) {
		.shaking { animation: none; }
		.toy { animation: none; opacity: 1; }
		.binky { animation: none; opacity: 1; }
		.portrait { transition: none; }
	}
</style>
