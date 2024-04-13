<script>
	import { copy } from '@svelte-put/copy';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { getEnhancedCodeBlockGroupContext } from './EnhancedCodeBlockGroup.svelte';
	import FileIcon from './FileIcon.svelte';

	/** @type {string}*/
	export let lang = '';
	/** @type {string}*/
	export let title = '';
	/** @type {string} */
	export let hideLineNumber = 'false';
	/** @type {string | 'disabled'} */
	export let collapsed = 'false';
	/** @type {string | undefined} */
	export let numLines = undefined;
	let cls = '';
	export { cls as class };

	const groupContext = getEnhancedCodeBlockGroupContext();

	$: currentTitle = groupContext?.title;

	const id = Math.random().toString(36).slice(2);
	let collapsible = groupContext ? false : collapsed !== 'disabled';
	let collapsedInputChecked = collapsible ? collapsed === 'true' : false;

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
</script>

<section
	class="codeblock {cls}"
	class:grouped={!!groupContext}
	class:hide-line-number={hideLineNumber !== 'false'}
	{...groupContext && { 'data-group-display': groupContext.display }}
	class:has-title={title}
	class:collapsible={groupContext ? false : collapsible}
	style:--num-line-width="{numLines ? numLines.length + 2 : 4}ch"
>
	{#if groupContext}
		<label class="codeblock-group-label">
			{#if groupContext.display === 'files'}
				<span class="codeblock-title">
					<FileIcon {lang} />
					{title}
				</span>
			{:else}
				<span>{title}</span>
			{/if}
			<input
				type="radio"
				class="codeblock-group-selected sr-only"
				value={title}
				name={groupContext.name}
				checked={title === $currentTitle}
				bind:group={$currentTitle}
			/>
		</label>
	{:else}
		<label class="codeblock-header" for="codeblock-{id}-collapsed">
			<p class="codeblock-title">
				<FileIcon {lang} />
				{title}
			</p>
		</label>
	{/if}
	<div class="codeblock-content">
		<div class="codeblock-content-accordion">
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
								<path
									d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
								/>
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
				{#if collapsible}
					<label class="codeblock-btn codeblock-collapsed-indicator">
						<input
							class="codeblock-collapsed sr-only"
							type="checkbox"
							bind:checked={collapsedInputChecked}
							id="codeblock-{id}-collapsed"
						/>
						<span class="sr-only">Collapse</span>
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
							class="lucide lucide-chevron-up"
						>
							<path d="m6 9 6 6 6-6" />
						</svg>
					</label>
				{/if}
			</div>
			<div
				class="codeblock-pre-container"
				use:copy={{ trigger, text: copyText }}
				on:copied={onCopied}
			>
				<slot />
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
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

		overflow: hidden;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr;

		margin-block: 24px;

		border-width: 1px;
		border-radius: 0.375rem;

		& :global(pre) {
			height: 100%;
			margin-block: 0;

			border-width: 1px 0 0 !important;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
		}

		&.grouped {
			display: contents !important;

			& :global(pre) {
				border-width: 1px !important;
			}

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

		&.collapsible:not(:has(.codeblock-fullscreen:checked)) {
			& .codeblock-header {
				cursor: pointer;
			}

			& .codeblock-content {
				grid-template-rows: 0fr;
				transition: grid-template-rows 150ms ease-out;
			}

			&:not(:has(.codeblock-collapsed:checked)) {
				& .codeblock-content {
					grid-template-rows: 1fr;
				}

				& .codeblock-collapsed-indicator {
					transform: rotate(180deg);
				}
			}

			& .codeblock-collapsed-indicator {
				display: block;
			}
		}
	}

	:global(.codeblock:not(.grouped, .has-title):has(pre[data-num-lines='1'])) {
		& .codeblock-header {
			display: none;
		}

		& .codeblock-btns {
			display: none;
		}

		& :global(pre) {
			border-top-width: 0 !important;
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
			display: grid;
		}
	}

	.codeblock:has(.codeblock-group-selected:checked) {
		& .codeblock-group-label {
			color: currentcolor;
			background-color: var(--color-pre-bg);
		}

		& .codeblock-content {
			display: grid;
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
	}

	:where(.codeblock-title) {
		width: fit-content;
		font-size: theme('fontSize.xs');
	}

	:where(.codeblock-content) {
		z-index: 1;
		display: grid;
		max-width: 100%;
	}

	:where(.codeblock-content-accordion) {
		overflow: hidden;
	}

	:where(.codeblock-btns) {
		position: absolute;
		z-index: 2;
		top: 6px;
		right: 8px;

		display: flex;
		gap: 4px;
		align-items: center;

		width: fit-content;
	}

	:where(.codeblock-btn) {
		cursor: pointer;
		padding: 4px;
		color: var(--color-header-fg);
		transition: color 150ms ease-out;

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

	:where(.codeblock-collapsed-indicator) {
		display: none;
		transition: transform 150ms ease-out;
	}

	:where(.codeblock-pre-container) {
		height: 100%;
	}
</style>
