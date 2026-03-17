<script lang="ts">
	interface Props {
		html: string;
	}

	let { html }: Props = $props();
	let viewport = $state<'desktop' | 'tablet' | 'mobile'>('desktop');

	const viewports: Record<'desktop' | 'tablet' | 'mobile', { width: string; label: string }> = {
		desktop: { width: '100%', label: 'Desktop' },
		tablet: { width: '768px', label: 'Tablet' },
		mobile: { width: '375px', label: 'Mobile' }
	};

	let hasContent = $derived(html.length > 0);
</script>

<div class="preview">
	{#if hasContent}
		<div class="preview-toolbar">
			{#each Object.entries(viewports) as [key, config]}
				<button
					class="viewport-btn"
					class:active={viewport === key}
					onclick={() => (viewport = key as 'desktop' | 'tablet' | 'mobile')}
				>
					{config.label}
				</button>
			{/each}
		</div>

		<div class="preview-frame" style:max-width={viewports[viewport].width}>
			<iframe
				srcdoc={html}
				sandbox="allow-scripts allow-same-origin"
				title="Design preview"
				class="preview-iframe"
			></iframe>
		</div>
	{:else}
		<div class="preview-empty">
			<p class="preview-empty-text">Your design will appear here.</p>
			<p class="preview-empty-sub">Describe what you want in the chat panel.</p>
		</div>
	{/if}
</div>

<style>
	.preview {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 400px;
		background: rgba(255, 255, 255, 0.02);
		border-radius: 8px;
		overflow: hidden;
	}

	.preview-toolbar {
		display: flex;
		gap: 0.25rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.viewport-btn {
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: rgba(255, 255, 255, 0.35);
		background: none;
		border: 1px solid transparent;
		border-radius: 4px;
		padding: 0.3rem 0.6rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.viewport-btn:hover {
		color: rgba(255, 255, 255, 0.6);
	}

	.viewport-btn.active {
		color: rgba(255, 255, 255, 0.8);
		border-color: rgba(255, 255, 255, 0.15);
		background: rgba(255, 255, 255, 0.05);
	}

	.preview-frame {
		flex: 1;
		margin: 1rem auto;
		width: 100%;
		transition: max-width 0.3s cubic-bezier(0.25, 1, 0.5, 1);
	}

	.preview-iframe {
		width: 100%;
		height: 100%;
		min-height: 500px;
		border: none;
		border-radius: 4px;
		background: white;
	}

	.preview-empty {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.preview-empty-text {
		font-family: var(--font-serif);
		font-size: 1.1rem;
		color: rgba(255, 255, 255, 0.25);
		margin: 0;
	}

	.preview-empty-sub {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.15);
		margin: 0;
	}
</style>
