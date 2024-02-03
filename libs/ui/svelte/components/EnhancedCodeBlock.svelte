<script>
	import { copy } from '@svelte-put/copy';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	/** @type {HTMLButtonElement}*/
	let trigger;

	/**
	 * @param {import('@svelte-put/copy').TextResolverInput<'click'>} input
	 */
	function copyText(input) {
		const codeNode = input.node.getElementsByTagName('code')[0];
		if (!codeNode) return '';
		let text = '';
		for (const lineNode of codeNode.children) {
			// assuming shiki build output and transformers set up at mdsvex.config.js
			if (/** @type {HTMLElement} */ (lineNode).dataset.lineDiff === '-') continue;
			text += (lineNode.textContent || '') + '\n';
		}

		return text;
	}

	let copied = false;
	function onCopied() {
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1800);
	}

	let hydrated = false;
	onMount(() => {
		hydrated = true;
	});
</script>

<div class="__container">
	{#if hydrated}
		<button bind:this={trigger} disabled={copied}>
			<span class="__label">Copy</span>
			{#if copied}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					stroke-width="1"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-copy-check"
					in:fly={{ y: 10 }}
				>
					<path d="m12 15 2 2 4-4" />
					<rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
						d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					stroke-width="1"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-copy"
					in:fly={{ y: 10 }}
				>
					<rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
						d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
					/>
				</svg>
			{/if}
		</button>
	{/if}
	<div use:copy={{ trigger, text: copyText }} on:copied={onCopied}>
		<slot>
			<!-- <pre><code>...</code></pre> -->
		</slot>
	</div>
</div>

<style>
	.__container {
		position: relative;
	}

	button {
		position: absolute;
		top: 16px;
		right: 16px;

		opacity: 0.5;

		transition: opacity 250ms ease-out;

		&:hover {
			opacity: 1;
		}

		&:disabled {
			/* allow clicking even if already copied */
			cursor: pointer;
		}
	}

	.__label {
		position: absolute;

		overflow: hidden;

		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;

		white-space: nowrap;

		clip: rect(0, 0, 0, 0);
		border-width: 0;
	}
</style>
