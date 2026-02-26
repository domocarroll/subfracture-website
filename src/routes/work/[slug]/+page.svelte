<script lang="ts">
	import type { Project } from '$lib/data/projects';

	interface Props {
		data: {
			project: Project;
		};
	}

	let { data }: Props = $props();
	const project = data.project;
</script>

<svelte:head>
	<title>{project.title} | Subfracture</title>
	<meta name="description" content={project.narrative[0]} />
	<meta property="og:title" content="{project.title} | Subfracture" />
	<meta property="og:description" content={project.narrative[0]} />
	<meta property="og:type" content="article" />
</svelte:head>

<article class="project">
	<!-- Back link -->
	<nav class="project-nav">
		<a href="/#work" class="back-link">&larr; Back to Work</a>
	</nav>

	<!-- Hero -->
	<header class="project-hero">
		<span class="project-category">{project.category}</span>
		<h1 class="project-title">{project.title}</h1>
		<p class="project-meta">Lead: {project.lead}</p>
	</header>

	<!-- Hero image placeholder -->
	<div class="project-hero-image">
		<span class="image-label">{project.category}</span>
	</div>

	<!-- Narrative -->
	<section class="project-narrative">
		{#each project.narrative as paragraph}
			<p>{paragraph}</p>
		{/each}
	</section>

	<!-- Gallery -->
	<section class="project-gallery">
		{#each project.images.gallery as image, i}
			<div class="gallery-item">
				<span class="image-label">0{i + 1}</span>
			</div>
		{/each}
	</section>

	<!-- Bottom nav -->
	<nav class="project-nav project-nav--bottom">
		<a href="/#work" class="back-link">&larr; Back to Work</a>
	</nav>
</article>

<style>
	.project {
		background-color: var(--color-surface);
		color: var(--color-text);
	}

	/* Navigation */
	.project-nav {
		max-width: var(--content-wide);
		margin: 0 auto;
		padding: 2rem clamp(1.5rem, 4vw, 3rem);
	}

	.project-nav--bottom {
		padding-top: 0;
		padding-bottom: clamp(4rem, 6vw, 8rem);
	}

	.back-link {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--color-primary);
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		transition: color 0.2s var(--ease-subtle);
	}

	.back-link:hover {
		color: var(--color-primary-dark);
	}

	/* Hero */
	.project-hero {
		max-width: var(--content-wide);
		margin: 0 auto;
		padding: clamp(2rem, 4vw, 4rem) clamp(1.5rem, 4vw, 3rem) clamp(3rem, 5vw, 6rem);
	}

	.project-category {
		display: block;
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 1.5rem;
	}

	.project-title {
		font-family: var(--font-serif);
		font-size: clamp(3rem, 8vw, var(--text-5xl));
		font-weight: 400;
		line-height: var(--text-5xl--line-height);
		color: var(--color-text);
		margin: 0 0 1.5rem;
	}

	.project-meta {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin: 0;
	}

	/* Hero image placeholder */
	.project-hero-image {
		max-width: var(--content-wide);
		margin: 0 auto;
		padding: 0 clamp(1.5rem, 4vw, 3rem);
	}

	.project-hero-image {
		aspect-ratio: 16 / 9;
		background-color: var(--color-bone);
		border-radius: 4px;
		display: flex;
		align-items: flex-end;
		padding: 1.5rem;
	}

	.image-label {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-muted);
		opacity: 0.5;
	}

	/* Narrative */
	.project-narrative {
		max-width: var(--content-max);
		margin: 0 auto;
		padding: clamp(4rem, 6vw, 8rem) clamp(1.5rem, 4vw, 3rem);
	}

	.project-narrative p {
		font-family: var(--font-serif);
		font-size: var(--text-lg);
		line-height: var(--text-lg--line-height);
		color: var(--color-text);
		margin: 0 0 2rem;
	}

	.project-narrative p:last-child {
		margin-bottom: 0;
	}

	/* Gallery */
	.project-gallery {
		max-width: var(--content-wide);
		margin: 0 auto;
		padding: 0 clamp(1.5rem, 4vw, 3rem) clamp(4rem, 6vw, 8rem);
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: clamp(1rem, 2vw, 2rem);
	}

	.gallery-item {
		aspect-ratio: 4 / 3;
		background-color: var(--color-bone);
		border-radius: 4px;
		display: flex;
		align-items: flex-end;
		padding: 1rem;
	}

	@media (max-width: 48rem) {
		.project-title {
			font-size: clamp(2.4rem, 10vw, 3.5rem);
		}

		.project-gallery {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}
</style>
