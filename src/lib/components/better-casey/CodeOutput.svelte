<script lang="ts">
	interface Props {
		html: string;
	}

	let { html }: Props = $props();
	let expanded = $state(false);
	let copied = $state(false);

	let hasContent = $derived(html.length > 0);

	function copyCode() {
		navigator.clipboard.writeText(html);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}

	function download() {
		const blob = new Blob([html], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'better-casey-design.html';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

{#if hasContent}
	<div class="code-output">
		<button class="code-toggle" onclick={() => (expanded = !expanded)}>
			<span class="code-toggle-label">
				{expanded ? 'Hide Code' : 'View Code'}
			</span>
			<span class="code-toggle-arrow" class:expanded>&darr;</span>
		</button>

		{#if expanded}
			<div class="code-actions">
				<button class="code-btn" onclick={copyCode}>
					{copied ? 'Copied!' : 'Copy'}
				</button>
				<button class="code-btn" onclick={download}> Download .html </button>
			</div>
			<pre class="code-block"><code>{html}</code></pre>
		{/if}
	</div>
{/if}

<style>
	.code-output {
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.code-toggle {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1.5rem;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: rgba(255, 255, 255, 0.4);
		background: none;
		border: none;
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.code-toggle:hover {
		color: rgba(255, 255, 255, 0.6);
	}

	.code-toggle-arrow {
		transition: transform 0.2s ease;
		font-size: 0.6rem;
	}

	.code-toggle-arrow.expanded {
		transform: rotate(180deg);
	}

	.code-actions {
		display: flex;
		gap: 0.5rem;
		padding: 0 1.5rem 0.75rem;
	}

	.code-btn {
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.5);
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		padding: 0.3rem 0.7rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.code-btn:hover {
		color: rgba(255, 255, 255, 0.8);
		background: rgba(255, 255, 255, 0.1);
	}

	.code-block {
		margin: 0;
		padding: 1rem 1.5rem;
		max-height: 400px;
		overflow: auto;
		background: rgba(0, 0, 0, 0.3);
		border-top: 1px solid rgba(255, 255, 255, 0.04);
	}

	.code-block code {
		font-family: var(--font-mono, 'SF Mono', 'Fira Code', monospace);
		font-size: 0.75rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.6);
		white-space: pre-wrap;
		word-break: break-all;
	}
</style>
