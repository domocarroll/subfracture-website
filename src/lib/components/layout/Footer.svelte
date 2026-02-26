<script lang="ts">
	/**
	 * Footer - Site footer with office addresses and contact information
	 *
	 * Displays:
	 * - Subfracture wordmark and tagline
	 * - Brisbane HQ and Los Angeles office addresses
	 * - Contact email
	 * - Copyright notice
	 */
	import Container from '$lib/components/ui/Container.svelte';

	const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
	<Container variant="wide">
		<div class="footer-grid">
			<!-- Column 1: Brand -->
			<div class="footer-col">
				<a href="/" class="footer-wordmark">SUBFRACTURE</a>
				<p class="footer-tagline">Culture Studio</p>
			</div>

			<!-- Column 2: Offices -->
			<div class="footer-col footer-col--offices">
				<div class="office">
					<h3 class="office-heading">Brisbane HQ</h3>
					<address class="office-address">
						29 Merivale Street<br />
						South Brisbane QLD 4101<br />
						Australia
					</address>
				</div>

				<div class="office">
					<h3 class="office-heading">Los Angeles</h3>
					<address class="office-address">
						520 Broadway Suite 200<br />
						Santa Monica, CA 90401<br />
						United States
					</address>
				</div>
			</div>

			<!-- Column 3: Contact -->
			<div class="footer-col footer-col--contact">
				<h3 class="contact-heading">Get in touch</h3>
				<a href="mailto:ohhello@subfrac.com" class="contact-email">
					ohhello@subfrac.com
				</a>
				<p class="copyright">
					&copy; {currentYear} Subfracture. All rights reserved.
				</p>
			</div>
		</div>
	</Container>
</footer>

<style>
	.footer {
		background-color: var(--color-text);
		padding: 4rem 0;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
	}

	/* Brand column */
	.footer-wordmark {
		font-family: var(--font-serif);
		font-size: var(--text-lg);
		font-weight: 500;
		letter-spacing: 0.1em;
		color: var(--color-surface);
		text-decoration: none;
		display: block;
	}

	.footer-wordmark:hover {
		color: var(--color-primary);
	}

	.footer-tagline {
		font-family: var(--font-serif);
		font-size: var(--text-sm);
		font-style: italic;
		color: var(--color-text-muted);
		margin: 0.5rem 0 0;
		opacity: 0.8;
	}

	/* Office addresses */
	.footer-col--offices {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.office {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.office-heading {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-primary);
		margin: 0;
	}

	.office-address {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-style: normal;
		line-height: 1.7;
		color: var(--color-surface);
		opacity: 0.85;
	}

	/* Contact column */
	.footer-col--contact {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.contact-heading {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-primary);
		margin: 0;
	}

	.contact-email {
		font-family: var(--font-sans);
		font-size: var(--text-base);
		color: var(--color-surface);
		text-decoration: none;
		transition: color 200ms ease;
	}

	.contact-email:hover {
		color: var(--color-primary);
	}

	.copyright {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--color-surface);
		opacity: 0.6;
		margin: 1.5rem 0 0;
	}

	/* Responsive: Two columns on tablet */
	@media (min-width: 40rem) {
		.footer {
			padding: 5rem 0;
		}

		.footer-grid {
			grid-template-columns: 1fr 1fr;
			gap: 3rem;
		}

		.footer-col--offices {
			flex-direction: row;
			gap: 3rem;
		}
	}

	/* Responsive: Three columns on desktop */
	@media (min-width: 64rem) {
		.footer {
			padding: 6rem 0;
		}

		.footer-grid {
			grid-template-columns: 1.5fr 2fr 1fr;
			align-items: start;
		}

		.footer-col--offices {
			flex-direction: row;
			gap: 4rem;
			justify-content: center;
		}
	}
</style>
