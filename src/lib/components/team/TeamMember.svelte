<script lang="ts">
	/**
	 * TeamMember - Individual team member card
	 *
	 * Photo (3:4 aspect), name (serif), role (sans, terracotta).
	 * Hover: subtle scale 1.03. Clean, warm design.
	 */

	interface Props {
		/** Team member name */
		name: string;
		/** Role/title */
		role: string;
		/** Photo URL */
		photo?: string;
		/** Short bio */
		bio?: string;
		/** LinkedIn profile URL */
		linkedin?: string;
		/** Additional CSS class */
		class?: string;
	}

	let {
		name,
		role,
		photo,
		bio,
		linkedin,
		class: className = ''
	}: Props = $props();

	let expanded = $state(false);

	function toggleBio() {
		expanded = !expanded;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleBio();
		}
	}
</script>

<div class="member {className}">
	<button
		type="button"
		class="member-card"
		onclick={toggleBio}
		onkeydown={handleKeydown}
		aria-expanded={expanded}
		aria-label="{name} — {expanded ? 'close' : 'read'} bio"
	>
		<div class="member-photo">
			{#if photo}
				<img src={photo} alt={name} loading="lazy" />
			{:else}
				<div class="member-photo-placeholder">
					<span class="member-initial">{name.charAt(0)}</span>
				</div>
			{/if}
		</div>
		<h3 class="member-name">{name}</h3>
		<p class="member-role">{role}</p>
	</button>

	{#if expanded && bio}
		<div class="member-bio">
			<p class="member-bio-text">{bio}</p>
			{#if linkedin}
				<a href={linkedin} target="_blank" rel="noopener" class="member-linkedin">
					LinkedIn
				</a>
			{/if}
		</div>
	{/if}
</div>

<style>
	.member {
		/* No outer transition — card button handles hover */
	}

	.member-card {
		display: block;
		width: 100%;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		text-align: left;
		color: inherit;
		font: inherit;
		transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.member-card:hover {
		transform: scale(1.03);
	}

	.member-card:focus-visible {
		outline: 2px solid var(--color-text);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.member-photo {
		aspect-ratio: 3 / 4;
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	.member-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.member-photo-placeholder {
		width: 100%;
		height: 100%;
		background-color: var(--color-bone);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.member-initial {
		font-family: var(--font-serif);
		font-size: var(--text-3xl);
		color: var(--color-text-muted);
		opacity: 0.3;
	}

	.member-name {
		font-family: var(--font-serif);
		font-size: var(--text-lg);
		font-weight: 400;
		color: var(--color-text);
		line-height: var(--text-lg--line-height);
		margin: 0 0 0.25rem;
	}

	.member-role {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin: 0;
	}

	/* Bio expansion */
	.member-bio {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-bone);
	}

	.member-bio-text {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: 1.7;
		margin: 0 0 0.75rem;
	}

	.member-linkedin {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-label);
		color: var(--color-text);
		text-decoration: none;
		border-bottom: 1px solid currentColor;
		transition: opacity 0.2s ease;
	}

	.member-linkedin:hover {
		opacity: 0.6;
	}

	.member-linkedin:focus-visible {
		outline: 2px solid var(--color-text);
		outline-offset: 4px;
		border-radius: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.member-card {
			transition: none;
		}

		.member-card:hover {
			transform: none;
		}
	}
</style>
