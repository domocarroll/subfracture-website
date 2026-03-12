<script lang="ts">
	/**
	 * Footer - Minimal footer matching v1 pattern
	 *
	 * Displays:
	 * - Subfracture wordmark and tagline (top)
	 * - Bottom bar: tagline left, live city clocks right, copyright
	 */
	import { onMount, onDestroy } from 'svelte';
	import Container from '$lib/components/ui/Container.svelte';

	const currentYear = new Date().getFullYear();

	let brisbaneTime = $state('');
	let laTime = $state('');
	let interval: ReturnType<typeof setInterval> | null = null;

	function updateClocks() {
		const now = new Date();
		brisbaneTime = now.toLocaleTimeString('en-AU', {
			timeZone: 'Australia/Brisbane',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
		laTime = now.toLocaleTimeString('en-US', {
			timeZone: 'America/Los_Angeles',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	}

	onMount(() => {
		updateClocks();
		interval = setInterval(updateClocks, 30000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<footer class="footer">
	<Container variant="wide">
		<!-- Top: Brand -->
		<div class="footer-top">
			<a href="/" class="footer-wordmark" aria-label="Subfracture — home">
				<img src="/subfracture.svg" alt="Subfracture" class="footer-wordmark-img" />
			</a>
			<p class="footer-tagline">A culture studio. Art and systems, flowing together.</p>
		</div>

		<!-- Bottom bar -->
		<div class="footer-bottom">
			<p class="footer-credo">Built on Intelligence. Powered by Humans.</p>

			<div class="footer-clocks">
				<span class="clock">
					<span class="clock-city">BRISBANE</span>
					<span class="clock-time">{brisbaneTime}</span>
				</span>
				<span class="clock-divider" aria-hidden="true"></span>
				<span class="clock">
					<span class="clock-city">LOS ANGELES</span>
					<span class="clock-time">{laTime}</span>
				</span>
			</div>

			<p class="copyright">&copy; {currentYear} <img src="/subfracture.svg" alt="Subfracture" class="copyright-wordmark" /></p>
		</div>
	</Container>
</footer>

<style>
	.footer {
		background-color: var(--color-text);
		padding: 4rem 0 2rem;
		position: sticky;
		bottom: 0;
		z-index: -1;
	}

	/* Top brand section */
	.footer-top {
		padding-bottom: 3rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.footer-wordmark {
		display: block;
		text-decoration: none;
	}

	.footer-wordmark:hover .footer-wordmark-img {
		opacity: 0.7;
	}

	.footer-wordmark:focus-visible {
		outline: 2px solid var(--color-surface);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.footer-wordmark-img {
		height: 18px;
		width: auto;
		display: block;
		filter: invert(1);
		transition: opacity 0.2s ease;
	}

	.footer-tagline {
		font-family: var(--font-sans);
		font-size: 0.9rem;
		font-style: italic;
		color: var(--color-surface);
		margin: 0.5rem 0 0;
		opacity: 0.45;
	}

	/* Bottom bar */
	.footer-bottom {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 1.5rem;
	}

	.footer-credo {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--color-surface);
		opacity: 0.45;
		margin: 0;
		letter-spacing: 0.02em;
	}

	/* Live clocks */
	.footer-clocks {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}

	.clock {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}

	.clock-city {
		font-family: var(--font-sans);
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-surface);
		opacity: 0.4;
	}

	.clock-time {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-variant-numeric: tabular-nums;
		color: var(--color-surface);
		opacity: 0.7;
	}

	.clock-divider {
		width: 1px;
		height: 12px;
		background: rgba(255, 255, 255, 0.15);
	}

	.copyright {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--color-surface);
		opacity: 0.3;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.35em;
	}

	.copyright-wordmark {
		height: 0.7em;
		width: auto;
		display: inline-block;
		filter: invert(1);
		vertical-align: baseline;
	}

	/* Mobile: stack vertically */
	@media (max-width: 40rem) {
		.footer-bottom {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
	}
</style>
