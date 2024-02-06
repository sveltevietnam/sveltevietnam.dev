<script>
	import { copy } from '@svelte-put/copy';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { getEnhancedCodeBlockGroupContext } from './EnhancedCodeBlockGroup.svelte';

	/** @type {string}*/
	export let label = '';

	const groupContext = getEnhancedCodeBlockGroupContext();

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

{#if groupContext}
	<label class="codeblock-label">
		<span>{label}</span>
		<input class="codeblock-input" type="radio" name={groupContext.id} />
	</label>
{/if}

<!-- svelte-ignore a11y-no-static-element-interactions -->
<section class="codeblock" on:mouseleave={onMouseLeaveContainer} class:grouped={!!groupContext}>
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
			<span class="codeblock-sr">Copy</span>
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
</section>

<style>
	:where(.codeblock) {
		position: relative;
		z-index: 1;
		margin-block: 24px;

		&:where(.grouped) {
			grid-column: 1 / span calc(var(--cols) + 1);
			grid-row: 2;
			margin-block: 0;

			& :global(pre) {
				border-top-left-radius: 0;
			}
		}

		& :global(pre) {
			margin-block: 0;
		}
	}

	:where(button) {
		position: absolute;
		top: 8px;
		right: 8px;

		padding: 8px;

		color: hsl(0deg 0% 64%);

		opacity: 0;
		background-color: hsl(0deg 0% 19%);
		border: 1px solid hsl(0deg 0% 28%);
		border-radius: 4px;

		transition: opacity 250ms ease-out;

		&:disabled {
			/* allow clicking even if already copied */
			cursor: pointer;
		}
	}

	:where(.codeblock):hover {
		& :where(button) {
			opacity: 1;
		}

		& :global(pre::before) {
			opacity: 0;
		}
	}

	:where(.codeblock-sr) {
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

	:where(.codeblock-label) {
		--color-label-bg-active: hsl(215deg 30% 10%);
		--color-label-bg: hsl(215deg 15% 15.7%);
		--color-label-fg: hsl(210deg 18.8% 72.9%);
		--color-label-underline: hsl(10deg 100% 55%);
		--underline-x-bleed: 16px;
		--padding-left: 16px;
		--padding-right: 16px;

		cursor: pointer;

		position: relative;
		z-index: 2;

		grid-row: 1;

		padding-block: 12px;
		padding-inline: var(--padding-left) var(--padding-right);

		font-size: 14px;
		line-height: normal;
		color: var(--color-label-fg);

		background-color: var(--color-label-bg);
		border-bottom: 1px solid currentcolor;

		&::after {
			--scale-x: 0;

			content: '';

			position: absolute;
			right: calc(var(--padding-right) - var(--underline-x-bleed));
			bottom: -1px;
			left: calc(var(--padding-left) - var(--underline-x-bleed));
			transform: scaleX(var(--scale-x));

			height: 1px;

			color: var(--color-label-underline);

			background-color: currentcolor;
		}

		&:first-of-type {
			border-top-left-radius: 0.375rem;
		}

		&:last-of-type {
			border-top-right-radius: 0.375rem;
		}

		&:not(:first-of-type) {
			border-left: 1px solid currentcolor;
		}

		&:has(.codeblock-input:checked) {
			background-color: var(--color-label-bg-active);

			&::after {
				--scale-x: 1;
			}
		}
	}

	:where(.codeblock-input) {
		display: none;
	}

	:where(.codeblock-label:has(.codeblock-input:not(:checked))) + :where(.codeblock) {
		display: none;
	}

	:global(.codeblock-group):not(:has(.codeblock-input:checked)) {
		& .codeblock:first-of-type {
			display: block;
		}

		& .codeblock-label:first-of-type {
			background-color: var(--color-label-bg-active);

			&::after {
				--scale-x: 1;
			}
		}
	}
</style>
