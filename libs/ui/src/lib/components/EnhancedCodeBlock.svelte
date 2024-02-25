<script>
	import { copy } from '@svelte-put/copy';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { getEnhancedCodeBlockGroupContext } from './EnhancedCodeBlockGroup.svelte';
	import FileIcon from './FileIcon.svelte';

	/** @type {string}*/
	export let lang = '';
	/** @type {string}*/
	export let label = '';
	/** @type {string} */
	export let filename = '';
	/** @type {boolean} */
	export let hideLineNumber = false;

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

	let showCopyBtn = false;
	let showCopyBtnTimeoutId;
	function onMouseEnterContainer() {
		clearTimeout(showCopyBtnTimeoutId);
		showCopyBtn = true;
	}
	function onMouseLeaveContainer() {
		if (copied) {
			showCopyBtnTimeoutId = setTimeout(() => {
				showCopyBtn = false;
			}, 1500);
		} else {
			showCopyBtn = false;
		}
	}

	let hydrated = false;
	onMount(() => {
		hydrated = true;
	});
</script>

{#if groupContext}
	<label class="codeblock-label">
		<span>{label}</span>
		<input class="codeblock-input" value={label} type="radio" name={groupContext.name} />
	</label>
{/if}

<!-- svelte-ignore a11y-no-static-element-interactions -->
<section
	class="codeblock"
	on:mouseenter={onMouseEnterContainer}
	on:mouseleave={onMouseLeaveContainer}
	class:grouped={!!groupContext}
	class:hide-line-number={hideLineNumber}
>
	{#if filename}
		<p class="codeblock-filename">
			<FileIcon {lang} />
			{filename}
		</p>
	{/if}
	<div class="codeblock-pre-container" use:copy={{ trigger, text: copyText }} on:copied={onCopied}>
		{#if !filename}
			<p class="codeblock-lang" class:shown={!showCopyBtn}>{lang}</p>
		{/if}
		<slot>
			<!-- <pre><code>...</code></pre> -->
		</slot>
		{#if hydrated}
			<button
				class="codeblock-copy-btn"
				bind:this={trigger}
				disabled={copied}
				on:mouseleave={onMouseLeaveCopyButton}
				on:mouseenter={onMouseEnterCopyButton}
				class:shown={showCopyBtn}
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
	</div>
</section>

<style>
	:where(.codeblock) {
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

		&:has(.codeblock-filename) {
			position: relative;

			& :where(.codeblock-pre-container) {
				position: static;
			}

			& :where(.codeblock-copy-btn) {
				top: 10px;
				right: 16px;

				padding: 0;

				opacity: 1;
				background-color: transparent;
				border-width: 0;
			}

			& :global(pre) {
				border-top-left-radius: 0;
				border-top-right-radius: 0;
			}
		}

		& :global(pre) {
			margin-block: 0;
		}
	}

	:where(.codeblock-pre-container) {
		position: relative;
	}

	:where(.codeblock-filename) {
		margin: 0;
		padding: 12px 16px;

		font-size: 12px;
		line-height: normal;

		background-color: var(--color-pre-bg);
		border-width: 1px 1px 0;
		border-radius: 4px 4px 0 0;
	}

	:where(.codeblock-lang) {
		position: absolute;
		z-index: 1;
		top: 2ch;
		right: 2ch;

		margin: 0;
		padding: 0;

		font-size: theme('fontSize.xs');
		font-weight: theme('fontWeight.medium');
		line-height: theme('lineHeight.normal');

		opacity: 0;
		backdrop-filter: blur(1px);

		transition: opacity 250ms ease-out;

		&.shown {
			opacity: 1;
		}
	}

	:where(.codeblock-copy-btn) {
		--color-button-fg: hsl(0deg 0% 50%);
		--color-button-outline: hsl(0deg 0% 75%);

		/* assume integration with @sveltevietnam/ui */
		@dark global {
			--color-button-fg: hsl(0deg 0% 64%);
			--color-button-outline: hsl(0deg 0% 28%);
		}

		position: absolute;
		z-index: 2;
		top: 8px;
		right: 8px;

		padding: 6px;

		color: var(--color-button-fg);

		opacity: 0;
		background-color: var(--color-pre-bg);
		border: 1px solid var(--color-button-outline);
		border-radius: 0.375rem;

		transition: opacity 250ms ease-out;

		&:disabled {
			/* allow clicking even if already copied */
			cursor: pointer;
		}

		&.shown {
			opacity: 1;
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
		--underline-x-bleed: 16px;
		--padding-left: 16px;
		--padding-right: 16px;
		--color-label-fg: var(--color-pre-fg);
		--color-label-bg-active: var(--color-pre-bg);
		--color-label-underline: theme('colors.primary.DEFAULT');
		--color-label-outline: theme('colors.outline.DEFAULT');

		cursor: pointer;

		position: relative;
		z-index: 2;
		bottom: -1px;

		grid-row: 1;

		padding-block: 12px;
		padding-inline: var(--padding-left) var(--padding-right);

		font-size: 14px;
		line-height: normal;
		color: var(--color-pre-fg);

		border-color: var(--color-label-outline);
		border-style: solid;
		border-top-width: 1px;

		&:first-of-type {
			border-left-width: 1px;
			border-top-left-radius: 0.375rem;
		}

		&:last-of-type {
			border-right-width: 1px;
			border-top-right-radius: 0.375rem;
		}

		&:not(:first-of-type) {
			border-left: 1px solid var(--color-label-outline);
		}

		&:has(.codeblock-input:checked) {
			background-color: var(--color-pre-bg);
			border-bottom-width: 0;
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
			background-color: var(--color-pre-bg);
			border-bottom-width: 0;
		}
	}
</style>
