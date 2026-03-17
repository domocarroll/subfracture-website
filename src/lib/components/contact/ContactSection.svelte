<script lang="ts">
	/**
	 * ContactSection - Scrub text invitation + contact form
	 *
	 * Dark background chapter. ScrubTextReveal heading invites contact.
	 * ContactForm sits below. Shares the dark chapter with Footer —
	 * no divider between them.
	 */

	import Container from '$lib/components/ui/Container.svelte';
	import ScrubTextReveal from '$lib/components/scroll/ScrubTextReveal.svelte';
	import ContactForm from './ContactForm.svelte';
	import { siteContent } from '$lib/data/content';
</script>

<section id="contact" class="contact">
	<Container>
		<div class="contact-header">
			<span class="contact-number">{siteContent.contact.number}</span>
			<ScrubTextReveal
				text={siteContent.contact.heading}
				tag="h2"
				class="contact-heading"
				start="top 80%"
				end="top 30%"
			/>
		</div>

		<div class="contact-body">
			<p class="contact-intro">
				{siteContent.contact.intro}
			</p>
			<ContactForm />
		</div>
	</Container>
</section>

<style>
	.contact {
		padding: clamp(8rem, 10vw, 12rem) 0;
		background-color: var(--color-text);
		color: var(--color-surface);
	}

	.contact-header {
		margin-bottom: clamp(3rem, 5vw, 5rem);
	}

	.contact-number {
		display: block;
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--color-text-muted);
		letter-spacing: var(--letter-spacing-label);
		margin-bottom: 1rem;
	}

	:global(.contact-heading) {
		font-family: var(--font-serif);
		font-size: var(--text-3xl);
		font-weight: 400;
		color: var(--color-surface);
		line-height: var(--text-3xl--line-height);
		max-width: 24ch;
		margin: 0;
	}

	.contact-body {
		max-width: 36rem;
	}

	.contact-intro {
		font-family: var(--font-sans);
		font-size: var(--text-base);
		color: rgba(255, 255, 255, 0.6);
		line-height: var(--text-base--line-height);
		margin: 0 0 3rem;
	}
</style>
