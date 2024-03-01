<script>
	import { copy } from '@svelte-put/copy';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { getEnhancedCodeBlockGroupContext } from './EnhancedCodeBlockGroup.svelte';
	import FileIcon from './FileIcon.svelte';

	/** @type {string}*/
	export let lang = '';
	/** @type {string}*/
	export let tab = '';
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

	let hydrated = false;
	onMount(() => {
		hydrated = true;
	});

	$: id = groupContext?.display === 'files' ? filename : tab;
	/** @type {import('svelte/elements').ChangeEventHandler<HTMLInputElement>} */
	const onChange = (e) => {
		if (/** @type {HTMLInputElement} */ (e.target).checked) {
			groupContext?.onSelect(id);
		}
	};
</script>

<section
	class="codeblock"
	class:grouped={!!groupContext}
	class:hide-line-number={hideLineNumber}
	{...groupContext && { 'data-group-display': groupContext.display }}
	class:has-filename={filename}
>
	{#if groupContext}
		<label class="codeblock-group-label">
			{#if groupContext.display === 'files'}
				<span class="codeblock-filename">
					<FileIcon {lang} />
					{id}
				</span>
			{:else}
				<span>{id}</span>
			{/if}
			<input
				type="radio"
				class="codeblock-group-selected sr-only"
				value={id}
				name={groupContext.name}
				on:change={onChange}
				checked={groupContext.initial === id}
			/>
		</label>
	{:else}
		<header class="codeblock-header">
			<p class="codeblock-filename">
				<FileIcon {lang} />
				{filename}
			</p>
		</header>
	{/if}
	<div class="codeblock-content">
		<div class="codeblock-btns">
			{#if hydrated}
				<button
					class="codeblock-btn codeblock-btn-copy"
					bind:this={trigger}
					disabled={copied}
					on:mouseleave={onMouseLeaveCopyButton}
					on:mouseenter={onMouseEnterCopyButton}
					type="button"
				>
					<span class="sr-only">Copy</span>
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
			<label class="codeblock-btn codeblock-btn-fullscreen">
				<span class="sr-only">Fullscreen</span>
				<input class="codeblock-fullscreen sr-only" type="checkbox" />
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
					class="lucide lucide-maximize"
					><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path
						d="M3 16v3a2 2 0 0 0 2 2h3"
					/><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg
				>
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
					class="lucide lucide-minimize"
					><path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" /><path
						d="M3 16h3a2 2 0 0 1 2 2v3"
					/><path d="M16 21v-3a2 2 0 0 1 2-2h3" /></svg
				>
			</label>
		</div>
		<div
			class="codeblock-pre-container"
			use:copy={{ trigger, text: copyText }}
			on:copied={onCopied}
		>
			<slot />
		</div>
	</div>
</section>

<style lang="postcss">
	:where(.sr-only) {
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

	p {
		margin: 0;
		padding: 0;
	}

	:where(.codeblock) {
		--color-header-fg: hsl(0deg 0% 50%);

		/* assume integration with @sveltevietnam/ui */
		@dark global {
			--color-header-fg: hsl(0deg 0% 64%);
		}

		position: relative;

		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr;

		margin-block: 24px;

		& :global(pre) {
			height: 100%;
			margin-block: 0;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
		}

		&.grouped {
			display: contents !important;

			& .codeblock-content {
				display: none;
				grid-column: 1 / span calc(var(--cols) + 1);
				grid-row: 2;
			}

			&[data-group-display='tabs'] {
				& .codeblock-btns {
					right: 0;
				}

				& .codeblock-btn {
					border-radius: 0.375rem;
				}

				& :global(pre) {
					border-top-right-radius: 0.375rem;
				}
			}
		}
	}

	:global(.codeblock:not(.grouped, .has-filename):has(pre[data-num-lines='1'])) {
		& .codeblock-header {
			display: none;
		}

		& .codeblock-btns {
			display: none;
		}

		& :global(pre) {
			border-top-left-radius: 0.375rem;
			border-top-right-radius: 0.375rem;
		}
	}

	.codeblock:has(.codeblock-fullscreen:checked),
	.codeblock.grouped:has(.codeblock-fullscreen:checked) .codeblock-content {
		position: fixed;
		z-index: theme('zIndex.overlay');
		inset: 0;

		height: 100dvh;
		margin: 0;

		& :global(pre) {
			max-height: none !important;
		}

		& .codeblock-btns {
			right: 12px;
		}
	}

	/* code block selected */
	:global(.codeblock-group):not(:has(.codeblock-group-selected:checked)) .codeblock:first-of-type {
		& .codeblock-group-label {
			color: currentcolor;
			background-color: var(--color-pre-bg);
		}

		& .codeblock-content {
			display: block;
		}
	}

	.codeblock:has(.codeblock-group-selected:checked) {
		& .codeblock-group-label {
			color: currentcolor;
			background-color: var(--color-pre-bg);
		}

		& .codeblock-content {
			display: block;
		}
	}

	:where(.codeblock-group-label) {
		cursor: pointer;

		position: relative;
		z-index: 2;
		bottom: -1px;

		grid-column: auto;
		grid-row: 1;

		padding: 12px 16px;

		font-size: theme('fontSize.sm');
		line-height: normal;
		color: var(--color-header-fg);

		border-top-width: 1px;

		&:hover {
			color: currentcolor;
		}

		.codeblock:first-of-type & {
			border-left-width: 1px;
			border-top-left-radius: 0.375rem;
		}

		.codeblock:last-of-type:not([data-group-display='files']) & {
			border-right-width: 1px;
			border-top-right-radius: 0.375rem;
		}

		.codeblock:not(:first-of-type) & {
			border-left-width: 1px;
		}
	}

	:where(.codeblock-header) {
		padding: 12px 16px;

		line-height: normal;

		background-color: var(--color-pre-bg);
		border-width: 1px 1px 0;
		border-radius: 0.375rem 0.375rem 0 0;
	}

	:where(.codeblock-filename) {
		font-size: theme('fontSize.xs');
	}

	:where(.codeblock-content) {
		z-index: 1;
		overflow: auto;
		max-width: 100%;
	}

	:where(.codeblock-btns) {
		position: absolute;
		z-index: 2;
		top: 10px;
		right: 12px;

		display: flex;
		gap: 12px;
		align-items: center;

		width: fit-content;
	}

	:where(.codeblock-btn) {
		cursor: pointer;
		color: var(--color-header-fg);
		transition: color 120ms ease-out;

		&:hover {
			color: currentcolor;
		}
	}

	:where(.codeblock-btn-copy) {
		&:disabled {
			/* allow clicking even if already copied */
			cursor: pointer;
		}
	}

	:where(.codeblock-btn-fullscreen) {
		& .lucide-minimize {
			display: none;
		}

		&:has(.codeblock-fullscreen:checked) {
			& .lucide-maximize {
				display: none;
			}

			& .lucide-minimize {
				display: block;
			}
		}
	}

	:where(.codeblock-pre-container) {
		height: 100%;
	}
</style>
