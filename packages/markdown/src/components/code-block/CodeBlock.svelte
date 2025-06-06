<script lang="ts">
	import { copy } from '@svelte-put/copy';

	import BtnCollapse from '../btn-collapse/BtnCollapse.svelte';
	import BtnCopyCode, { copyCode } from '../btn-copy-code/BtnCopyCode.svelte';
	import BtnFullscreen from '../btn-fullscreen/BtnFullscreen.svelte';
	import { getGroupContext } from '../code-block-group/CodeBlockGroup.svelte';
	import FileIcon from '../file-icon/FileIcon.svelte';

	import type { CodeBlockProps } from './CodeBlock.svelte.d.ts';

	let {
		lang = '',
		title = '',
		hideLineNumber = 'false',
		numLines = undefined,
		collapsed = 'false',
		children,
		class: cls,
		...rest
	}: CodeBlockProps = $props();

	// init context & id
	const group = getGroupContext();
	const id = Math.random().toString(36).slice(2);
	const fullScreenCheckBoxId = group
		? `codeblock-group-${group.id}-fullscreen`
		: `codeblock-${id}-fullscreen`;
	const collapsedCheckboxId = `codeblock-${id}-collapsed`;

	// resolve the collapsed prop
	let collapsible = $derived(group ? false : collapsed !== 'disabled');
	let collapsedInputChecked = $state(collapsed === 'true');
	$effect(() => {
		if (!collapsible) collapsedInputChecked = false;
	});

	let copyBtnEl: HTMLButtonElement | undefined = $state(undefined);
	let codeBlockEl: HTMLElement | undefined = $state(undefined);
</script>

{#snippet titleAndFileIcon()}
	<span class="codeblock-title">
		<FileIcon {lang} />
		<span>{title}</span>
	</span>
{/snippet}

<section
	class="codeblock {cls}"
	bind:this={codeBlockEl}
	class:collapsible={group ? false : collapsible}
	class:titled={!!title}
	class:grouped={!!group}
	class:hide-line-number={hideLineNumber !== 'false'}
	style:--num-line-width="{numLines ? numLines.length + 2 : 4}ch"
	{...group && { 'data-group-display': group.display }}
	{...rest}
>
	{#if group}
		<label class="codeblock-group-label">
			{#if group.display === 'files'}
				{@render titleAndFileIcon()}
			{:else}
				<span>{title}</span>
			{/if}
			<input
				type="radio"
				class="codeblock-group-selected sr-only"
				value={title}
				name={group.name}
				checked={title === group.title}
				bind:group={group.title}
			/>
		</label>
	{:else}
		<label class="codeblock-header" for={collapsedCheckboxId}>
			{@render titleAndFileIcon()}
		</label>
	{/if}
	<div class="codeblock-content">
		<div class="codeblock-content-accordion">
			<!-- buttons -->
			<div class="codeblock-btns">
				<BtnCopyCode class="codeblock-btn" bind:trigger={copyBtnEl} />
				<BtnFullscreen
					class="codeblock-btn codeblock--btn--collapse"
					codeblock={codeBlockEl}
					id={fullScreenCheckBoxId}
				/>
				{#if collapsible}
					<BtnCollapse
						class="codeblock-btn codeblock-btn--collapse"
						id={collapsedCheckboxId}
						collapsed={collapsedInputChecked}
					/>
				{/if}
			</div>
			<!-- pre & code -->
			<div class="codeblock-pre-container" use:copy={{ trigger: copyBtnEl, text: copyCode }}>
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
	/** has selectors */
	@custom-selector :--group-selected :has(.codeblock-group-selected:checked);
	@custom-selector :--fullscreen :has(.codeblock-fullscreen:checked);
	@custom-selector :--oneliner :has(pre[data-num-lines='1']);
	@custom-selector :--collapsed :has(.codeblock-collapsed:checked);

	/** complex patterns for codeblock-group */
	@custom-selector :--g-fullscreen
		:global(.codeblock-group:has(.codeblock-group-fullscreen:checked));
	@custom-selector :--g-not-fullscreen
		:global(.codeblock-group:not(:has(.codeblock-group-fullscreen:checked)));

	/** complex patterns for codeblock */
	@custom-selector :--c-not-collapsed :global(.codeblock:not(:--collapsed));

	@custom-selector :--c-collapsible-not-fullscreen
		:global(.codeblock.collapsible:not(:--fullscreen));

	@custom-selector :--c-oneliner-not-grouped-or-titled
		:global(.codeblock:not(.grouped, .titled):--oneliner);

	@custom-selector :--c-grouped-and-selected :global(.codeblock.grouped:--group-selected);
	@custom-selector :--c-tabs-grouped :global(.codeblock.grouped[data-group-display='tabs']);

	@custom-selector :--c-first-of-group :global(.codeblock:first-of-type);
	@custom-selector :--c-last-of-non-files-group
		:global(.codeblock:not([data-group-display='files']):last-of-type);

	@custom-selector :--c-first-of-unselected-group
		:global(.codeblock-group:not(:--group-selected) .codeblock:first-of-type);

	.codeblock {
		--color-header-fg: hsl(0deg 0% 50%);

		position: relative;

		overflow: hidden;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr;

		margin-block: 1.5rem;
		border-width: 1px;
		border-radius: var(--code-block-border-radius, 0);

		&.grouped {
			display: contents !important;
		}

		:global(:--fullscreen) {
			border-radius: 0;
		}
	}

	.codeblock:global(:--fullscreen),
	:--g-fullscreen {
		position: fixed;
		z-index: var(--z-index-overlay);
		inset: 0;

		height: 100dvh;
		margin: 0;
	}

	.codeblock-header {
		padding: 0.75rem 1rem;
		line-height: normal;
		background-color: var(--color-pre-bg);

		:--c-collapsible-not-fullscreen & {
			cursor: pointer;
		}

		:--c-oneliner-not-grouped-or-titled & {
			display: none;
		}
	}

	.codeblock-title {
		width: fit-content;
		margin: 0;
		padding: 0;

		font-size: var(--text-xs);
		white-space: nowrap;

		& span {
			margin-left: 0.5rem;
		}
	}

	.codeblock-group-label {
		cursor: pointer;

		position: relative;
		z-index: 2;

		grid-column: auto;
		grid-row: 1;

		padding: 0.75rem 1rem;
		border-top-width: 1px;
		border-right-width: 1px;

		font-size: var(--text-sm);
		line-height: normal;
		color: var(--color-header-fg);

		background-color: var(--color-bg);

		&:has(:global(input:focus-visible)) {
			outline-offset: -1px;
		}

		&:hover {
			color: currentcolor;
		}

		:--c-first-of-group & {
			border-left-width: 1px;
		}

		:--g-not-fullscreen :--c-first-of-group & {
			border-top-left-radius: var(--code-block-border-radius, 0);
		}

		:--g-not-fullscreen :--c-last-of-non-files-group & {
			border-top-right-radius: var(--code-block-border-radius, 0);
		}

		:--c-first-of-unselected-group &,
		:--c-grouped-and-selected & {
			margin-bottom: -1px;
			color: currentcolor;
			background-color: var(--color-pre-bg);
		}
	}

	.codeblock-content {
		z-index: 1;
		display: grid;
		max-width: 100%;

		.codeblock.grouped & {
			display: none;
			grid-column: 1 / span calc(var(--cols) + 1);
			grid-row: 2;
		}

		:--c-grouped-and-selected &,
		:--c-first-of-unselected-group & {
			display: grid;
		}

		:--c-collapsible-not-fullscreen & {
			grid-template-rows: 0fr;
			transition: grid-template-rows 150ms ease-out;
		}

		:--c-not-collapsed & {
			grid-template-rows: 1fr !important;
		}
	}

	.codeblock-content-accordion {
		overflow: hidden;
	}

	.codeblock-btns {
		position: absolute;
		z-index: 2;
		top: 0.25rem;
		right: 0.5rem;

		display: flex;
		gap: 0.25rem;
		align-items: center;

		width: fit-content;

		:--c-tabs-grouped & {
			right: 0;
		}

		:--c-oneliner-not-grouped-or-titled & {
			display: none;
		}

		:--g-fullscreen & {
			right: 0.75rem;
		}
	}

	:global(.codeblock-btn) {
		cursor: pointer;

		display: flex;

		padding: 0.5rem;

		color: var(--color-header-fg);

		transition: color 150ms ease-out;

		&:hover {
			color: currentcolor;
		}

		& i {
			width: 1.25rem; /* 20px */
			height: 1.25rem; /* 20px */
		}

	}

	.codeblock-pre-container {
		height: 100%;
	}

	.codeblock :global(pre) {
		height: 100%;
		max-height: 50rem; /* 800px */
		margin-block: 0;
		border-width: 1px 0 0 !important;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}

	.codeblock.grouped :global(pre) {
		border-width: 1px !important;
	}

	:--c-tabs-grouped :global(pre) {
		border-top-right-radius: var(--code-block-border-radius, 0);
	}

	:--c-oneliner-not-grouped-or-titled :global(pre) {
		border-top-width: 0 !important;
		border-top-left-radius: var(--code-block-border-radius, 0);
		border-top-right-radius: var(--code-block-border-radius, 0);
	}

	.codeblock:global(:--fullscreen) :global(pre) {
		max-height: 100dvh !important;
		max-height: 100vh !important;
	}

	:--g-fullscreen :global(pre) {
		max-height: calc(100vh - 2.625rem) !important;
		max-height: calc(100dvh - 2.625rem) !important;
	}
</style>
