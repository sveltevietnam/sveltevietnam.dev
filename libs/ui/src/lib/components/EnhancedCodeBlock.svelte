<script>
	import { copy } from '@svelte-put/copy';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

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

	let copyTimeoutId;
	let copied = false;
	function onCopied() {
		copied = true;
	}
	function onMouseEnterCopyButton() {
		clearTimeout(copyTimeoutId);
	}
	function onMouseLeaveCopyButton() {
		copyTimeoutId = setTimeout(() => {
			copied = false;
		}, 1800);
	}
	function onMouseLeaveContainer() {
		clearTimeout(copyTimeoutId);
		copied = false;
	}

	let hydrated = false;
	onMount(() => {
		hydrated = true;
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="__container" on:mouseleave={onMouseLeaveContainer}>
	<div use:copy={{ trigger, text: copyText }} on:copied={onCopied}>
		<slot>
			<!-- <pre><code>...</code></pre> -->
		</slot>
	</div>
	{#if hydrated}
		<button
			bind:this={trigger}
			disabled={copied}
			on:mouseleave={onMouseLeaveCopyButton}
			on:mouseenter={onMouseEnterCopyButton}
		>
			<span class="__label">Copy</span>
			{#key copied}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-clipboard-check"
					in:fade={{ duration: 150 }}
				>
					<rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
					<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
					{#if copied}
						<path d="m9 14 2 2 4-4" />
					{/if}
				</svg>
			{/key}
		</button>
	{/if}
</div>

<style>
	.__container {
		position: relative;
	}

	button {
		position: absolute;
		top: 16px;
		right: 16px;

		padding: 8px;

		color: theme('colors.grayscale.400');

		opacity: 0;
		background-color: theme('colors.grayscale.900');
		border: 1px solid theme('colors.grayscale.800');
		border-radius: theme('borderRadius.DEFAULT');

		transition: opacity 250ms ease-out;

		&:disabled {
			/* allow clicking even if already copied */
			cursor: pointer;
		}
	}

	.__container:hover {
		& button {
			opacity: 1;
		}

		& :global(pre::before) {
			opacity: 0;
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
