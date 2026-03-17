<script lang="ts">
	interface Message {
		role: 'user' | 'assistant';
		content: string;
	}

	interface DesignBrief {
		type: string;
		description: string;
		industry: string;
		mood: string;
		colors: string | null;
		constraints: string[];
	}

	interface Props {
		generating?: boolean;
		ongenerate?: (brief: DesignBrief) => void;
	}

	let { generating = false, ongenerate }: Props = $props();

	let messages = $state<Message[]>([
		{
			role: 'assistant',
			content:
				"I'm better-casey \u2014 Subfracture's AI design director. Describe any UI and I'll build it live. Hero sections, pricing pages, card layouts, dashboards \u2014 whatever you need.\n\nThe last guy couldn't do this in under a week. Watch."
		}
	]);
	let input = $state('');
	let loading = $state(false);
	let messagesEl: HTMLElement | undefined = $state();

	// Auto-scroll on new messages
	$effect(() => {
		messages.length;
		if (messagesEl) {
			requestAnimationFrame(() => {
				messagesEl!.scrollTop = messagesEl!.scrollHeight;
			});
		}
	});

	async function send() {
		const text = input.trim();
		if (!text || loading || generating) return;

		input = '';
		messages = [...messages, { role: 'user', content: text }];
		loading = true;

		try {
			const res = await fetch('/better-casey/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					messages: messages.map((m) => ({ role: m.role, content: m.content }))
				})
			});

			const data = await res.json();

			if (data.error) {
				messages = [
					...messages,
					{ role: 'assistant', content: `Something went wrong. ${data.error}` }
				];
			} else {
				messages = [...messages, { role: 'assistant', content: data.content }];

				// If a design brief was extracted, trigger generation
				if (data.brief && ongenerate) {
					ongenerate(data.brief);
				}
			}
		} catch {
			messages = [...messages, { role: 'assistant', content: 'Connection issue. Try again.' }];
		} finally {
			loading = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}

	const suggestions = [
		'Hero section for a coffee brand',
		'Pricing page for a SaaS startup',
		'Team grid for a design agency',
		'Contact form with personality'
	];
</script>

<div class="chat">
	<div class="chat-messages" bind:this={messagesEl}>
		{#each messages as message}
			<div class="chat-msg chat-msg--{message.role}">
				{#if message.role === 'assistant'}
					<span class="chat-label">better-casey</span>
				{/if}
				<p class="chat-text">{message.content}</p>
			</div>
		{/each}

		{#if loading}
			<div class="chat-msg chat-msg--assistant">
				<span class="chat-label">better-casey</span>
				<p class="chat-text chat-typing">Thinking...</p>
			</div>
		{/if}

		{#if generating}
			<div class="chat-msg chat-msg--system">
				<p class="chat-text chat-generating">Designing... watch the preview panel.</p>
			</div>
		{/if}
	</div>

	{#if messages.length === 1}
		<div class="suggestions">
			{#each suggestions as suggestion}
				<button
					class="suggestion-chip"
					onclick={() => {
						input = suggestion;
						send();
					}}
				>
					{suggestion}
				</button>
			{/each}
		</div>
	{/if}

	<div class="chat-input-row">
		<textarea
			class="chat-input"
			bind:value={input}
			onkeydown={handleKeydown}
			placeholder="Describe a UI..."
			rows={1}
			disabled={loading || generating}
		></textarea>
		<button
			class="chat-send"
			onclick={send}
			disabled={!input.trim() || loading || generating}
			aria-label="Send"
		>
			&rarr;
		</button>
	</div>
</div>

<style>
	.chat {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 400px;
	}

	.chat-messages {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.chat-msg {
		max-width: 85%;
	}

	.chat-msg--user {
		align-self: flex-end;
	}

	.chat-msg--assistant {
		align-self: flex-start;
	}

	.chat-msg--system {
		align-self: center;
	}

	.chat-label {
		display: block;
		font-family: var(--font-sans);
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(255, 255, 255, 0.35);
		margin-bottom: 0.25rem;
	}

	.chat-text {
		font-family: var(--font-sans);
		font-size: 0.875rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.85);
		margin: 0;
		white-space: pre-wrap;
	}

	.chat-msg--user .chat-text {
		background: rgba(255, 255, 255, 0.08);
		padding: 0.75rem 1rem;
		border-radius: 12px 12px 2px 12px;
	}

	.chat-typing {
		opacity: 0.5;
		animation: pulse 1.5s ease-in-out infinite;
	}

	.chat-generating {
		color: rgba(201, 168, 76, 0.8);
		font-style: italic;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 0.2;
		}
	}

	.suggestions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0 1.5rem 1rem;
	}

	.suggestion-chip {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 999px;
		padding: 0.4rem 0.8rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.suggestion-chip:hover {
		color: rgba(255, 255, 255, 0.8);
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.chat-input-row {
		display: flex;
		gap: 0.5rem;
		padding: 1rem 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.chat-input {
		flex: 1;
		font-family: var(--font-sans);
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.9);
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 0.6rem 0.8rem;
		resize: none;
		outline: none;
		transition: border-color 0.2s ease;
	}

	.chat-input:focus {
		border-color: rgba(255, 255, 255, 0.25);
	}

	.chat-input::placeholder {
		color: rgba(255, 255, 255, 0.25);
	}

	.chat-input:disabled {
		opacity: 0.5;
	}

	.chat-send {
		font-family: var(--font-sans);
		font-size: 1.1rem;
		color: rgba(255, 255, 255, 0.7);
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		width: 2.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.chat-send:hover:not(:disabled) {
		color: white;
		background: rgba(255, 255, 255, 0.15);
	}

	.chat-send:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
</style>
