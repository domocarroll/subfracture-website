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
		/** Photo URL (placeholder for now) */
		photo?: string;
		/** Additional CSS class */
		class?: string;
	}

	let {
		name,
		role,
		photo,
		class: className = ''
	}: Props = $props();
</script>

<div class="member {className}">
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
</div>

<style>
	.member {
		transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.member:hover {
		transform: scale(1.03);
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
		color: var(--color-primary);
		margin: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.member {
			transition: none;
		}

		.member:hover {
			transform: none;
		}
	}
</style>
